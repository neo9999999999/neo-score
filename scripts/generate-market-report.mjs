#!/usr/bin/env node
/**
 * 데일리 마켓 리포트 생성기
 *
 * 유가 · 달러 · 환율 · 금리 · 나스닥 등 핵심 거시지표를 수집하고,
 * 그 연결관계를 따라 나스닥 반응 → 국내증시 전망 → 수혜 섹터/종목을
 * 분석한 리포트(JSON)를 public/market-report.json 으로 생성한다.
 *
 * 매일 새벽(장 시작 전, 07:00 KST 이전) GitHub Action 으로 실행된다.
 *
 * 환경변수:
 *   ANTHROPIC_API_KEY  설정 시 api.anthropic.com 직접 호출 (권장)
 *   ANTHROPIC_MODEL    모델 ID (기본: claude-sonnet-4-6)
 *   (미설정 시) sector-api 프록시로 폴백
 *
 * 어떤 단계가 실패해도 리포트는 생성된다(룰 기반 폴백).
 */

import { writeFile, readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const OUT = join(ROOT, "public", "market-report.json");
const STOCKS_PATH = join(ROOT, "data", "stocks.json");

const PROXY_URL = "https://sector-api-pink.vercel.app/api/analyze";
const ANTHROPIC_URL = "https://api.anthropic.com/v1/messages";
const PROXY_MODEL = "claude-haiku-4-5-20251001";

// ---- 유틸 ----
function kstNow() {
  const d = new Date();
  const kst = new Date(d.getTime() + (9 * 60 - d.getTimezoneOffset()) * 60000);
  return kst;
}
function kstDateStr(d = kstNow()) { return d.toISOString().slice(0, 10); }
function kstIso(d = kstNow()) { return d.toISOString().slice(0, 19) + "+09:00"; }

async function fetchWithTimeout(url, opts = {}, ms = 15000) {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), ms);
  try { return await fetch(url, { ...opts, signal: ctrl.signal }); }
  finally { clearTimeout(t); }
}

// ---- 1) 거시지표 수집 (Stooq 일봉 CSV, 키 불필요) ----
const STOOQ = [
  { key: "nasdaq", label: "나스닥", symbol: "^ndq", fmt: "index" },
  { key: "sp500", label: "S&P 500", symbol: "^spx", fmt: "index" },
  { key: "wti", label: "WTI 유가", symbol: "cl.f", fmt: "usd" },
  { key: "dxy", label: "달러인덱스", symbol: "dx.f", fmt: "num" },
  { key: "usdkrw", label: "원/달러 환율", symbol: "usdkrw", fmt: "krw" },
  { key: "ust10y", label: "미 10년물 금리", symbol: "10usy.b", fmt: "pct" },
];

function fmtVal(v, fmt) {
  if (v == null || !isFinite(v)) return "—";
  if (fmt === "index") return v.toLocaleString("en-US", { maximumFractionDigits: 2 });
  if (fmt === "usd") return "$" + v.toFixed(2);
  if (fmt === "krw") return v.toLocaleString("ko-KR", { maximumFractionDigits: 1 }) + "원";
  if (fmt === "pct") return v.toFixed(2) + "%";
  return v.toLocaleString("en-US", { maximumFractionDigits: 2 });
}

async function fetchIndicator(item) {
  const url = `https://stooq.com/q/d/l/?s=${encodeURIComponent(item.symbol)}&i=d`;
  try {
    const r = await fetchWithTimeout(url);
    if (!r.ok) throw new Error("HTTP " + r.status);
    const text = await r.text();
    const lines = text.trim().split("\n").filter(Boolean);
    if (lines.length < 3) throw new Error("no data");
    // 헤더: Date,Open,High,Low,Close,Volume
    const rows = lines.slice(1).map(l => l.split(","));
    const last = rows[rows.length - 1];
    const prev = rows[rows.length - 2];
    const close = parseFloat(last[4]);
    const prevClose = parseFloat(prev[4]);
    if (!isFinite(close) || !isFinite(prevClose)) throw new Error("nan");
    const chg = close - prevClose;
    const chgPct = (chg / prevClose) * 100;
    const dir = chgPct > 0.05 ? "up" : chgPct < -0.05 ? "down" : "flat";
    const chgStr = (item.fmt === "pct")
      ? (chg >= 0 ? "+" : "") + chg.toFixed(2) + "%p"
      : (chg >= 0 ? "+" : "") + chg.toLocaleString("en-US", { maximumFractionDigits: 2 });
    return {
      key: item.key, label: item.label,
      value: fmtVal(close, item.fmt),
      change: chgStr,
      changePct: (chgPct >= 0 ? "+" : "") + chgPct.toFixed(2) + "%",
      dir,
      _raw: { close, prevClose, chgPct: +chgPct.toFixed(2) },
    };
  } catch (e) {
    return { key: item.key, label: item.label, value: "—", change: "—", changePct: "—", dir: "flat", _raw: null, _err: String(e.message || e) };
  }
}

async function collectIndicators() {
  const results = await Promise.all(STOOQ.map(fetchIndicator));
  return results;
}

// ---- 2) 종목 코드 매핑 ----
async function loadStockMap() {
  try {
    const raw = await readFile(STOCKS_PATH, "utf8");
    const data = JSON.parse(raw);
    const map = new Map();
    for (const s of (data.stocks || [])) map.set(s.name, { code: s.code, market: s.market });
    return map;
  } catch { return new Map(); }
}
function attachCodes(sectors, stockMap) {
  for (const sec of sectors || []) {
    for (const st of sec.stocks || []) {
      if (!st.code && stockMap.has(st.name)) st.code = stockMap.get(st.name).code;
    }
  }
  return sectors;
}

// ---- 3) LLM 호출 ----
function buildPrompt(indicators, dateStr) {
  const indLines = indicators.map(i => `- ${i.label}: ${i.value} (${i.changePct})`).join("\n");
  const system = `당신은 한국 주식시장 거시전략 애널리스트입니다. 유가·달러·환율·금리 등 핵심 거시지표의 연결관계(인과사슬)를 따라 간밤 나스닥의 반응을 해석하고, 그에 따른 오늘 한국 증시(코스피/코스닥)의 방향성과 상승 예상 섹터·수혜 종목을 예측합니다.

반드시 아래 JSON 스키마 하나만 출력하세요 (코드블록·설명 텍스트 금지):
{
  "title": "리포트 제목 (한 줄)",
  "sentiment": "bullish|neutral|bearish",
  "summary": "오늘의 요약 3~4문장. 거시 연결고리와 국내증시 방향성 핵심.",
  "chain": [ {"from":"유가","via":"인과 설명","to":"미 금리","tone":"pos|neg|neutral","note":"한 줄 해설"} ],
  "nasdaq": {"verdict":"간밤 나스닥 한 줄 평","detail":"등락 원인을 유가·금리·달러와 연결해 2~3문장"},
  "domestic": {"kospiBias":"강세/약세/관망/갭상승 등","kosdaqBias":"...","fxNote":"환율→외국인 수급 한 줄","detail":"오늘 국내증시 시나리오 2~3문장"},
  "sectors": [ {"name":"섹터명","bias":"up|down|neutral","reason":"왜 오늘 주목하는지","stocks":[{"name":"정확한 한국 상장 종목명","reason":"수혜 이유 한 줄"}]} ],
  "globalIssues": [ {"category":"전쟁/지정학/무역/통화정책 등","title":"국제 핫이슈 제목","detail":"내용과 시장 영향 1~2문장"} ],
  "weeklyCalendar": [ {"date":"6/16","day":"월","title":"이벤트명(예: 미 FOMC, 한국 수출입동향)","detail":"무엇을 보는지·시장 영향 한 줄","importance":"high|mid|low"} ],
  "todayIssues": [ {"category":"국내/글로벌/원자재 등","title":"오늘 주목할 이슈 제목","detail":"한 줄 해설"} ],
  "cards": [ {"emoji":"📊","title":"카드 제목","body":"카드 본문 1~2문장"} ],
  "detail": "상세 분석 본문. 단락은 \\n\\n 으로 구분. 거시 연결고리 → 나스닥 → 국내증시 → 섹터 → 글로벌/전쟁 이슈 순으로 6~8단락."
}

규칙:
- 종목명은 실제 한국 상장사 정식 명칭만 사용(예: 삼성전자, SK하이닉스, 한화에어로스페이스). 코드는 적지 마세요.
- 섹터는 3~5개, 각 섹터당 수혜 종목 2~3개.
- chain은 4~6단계로 유가/달러/금리 → 나스닥 → 국내증시까지 이어지게.
- globalIssues는 전쟁·지정학·무역분쟁 등 국제 핫이슈 2~4개, 한국 증시 영향까지 연결.
- weeklyCalendar는 오늘 날짜가 속한 주(월~금)의 주요 경제 이벤트를 일자별로 3~6개. 미국·한국 지표 발표, 중앙은행 회의, 실적·옵션만기 등. date는 'M/D' 형식, day는 한글 요일 한 글자.
- todayIssues는 오늘 장중 주목할 이슈 2~4개.
- cards는 4~6장, 카드뉴스용으로 직관적이고 짧게.
- 데이터가 '—'(수집 실패)인 지표는 일반적 거시 시나리오로 합리적으로 추론.`;

  const user = `오늘 날짜(KST): ${dateStr}

간밤 글로벌 마감 거시지표:
${indLines}

위 지표의 연결관계를 분석해 오늘 한국 증시 개장 전 브리핑 리포트를 위 JSON 스키마대로 작성하세요. 반드시 단일 JSON만 출력.`;
  return { system, user };
}

async function callLLM(system, user) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  const model = process.env.ANTHROPIC_MODEL || "claude-sonnet-4-6";
  let text = "";
  if (apiKey) {
    const r = await fetchWithTimeout(ANTHROPIC_URL, {
      method: "POST",
      headers: { "content-type": "application/json", "x-api-key": apiKey, "anthropic-version": "2023-06-01" },
      body: JSON.stringify({ model, max_tokens: 4000, system, messages: [{ role: "user", content: user }] }),
    }, 60000);
    const data = await r.json();
    if (data.type === "error") throw new Error(data.error?.message || "anthropic error");
    text = data.content?.[0]?.text || "";
  } else {
    const r = await fetchWithTimeout(PROXY_URL, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ model: PROXY_MODEL, max_tokens: 4000, system, messages: [{ role: "user", content: user }] }),
    }, 60000);
    const data = await r.json();
    if (data.type === "error") throw new Error(data.error?.message || "proxy error");
    text = data.content?.[0]?.text || "";
  }
  const m = text.match(/\{[\s\S]*\}/);
  if (!m) throw new Error("JSON 파싱 실패");
  return JSON.parse(m[0]);
}

// 이번 주(월~금) 일자 목록 — 룰 기반 일정 골격
function weekCalendar() {
  const now = kstNow();
  const dow = now.getUTCDay(); // 0=일
  const monOffset = (dow === 0 ? -6 : 1 - dow);
  const days = ["일", "월", "화", "수", "목", "금", "토"];
  const out = [];
  for (let i = 0; i < 5; i++) {
    const d = new Date(now.getTime() + (monOffset + i) * 86400000);
    out.push({
      date: (d.getUTCMonth() + 1) + "/" + d.getUTCDate(),
      day: days[d.getUTCDay()],
      title: "주요 경제 일정",
      detail: "미국·한국 지표 발표 및 이벤트는 LLM 분석 활성화 시 일자별로 채워집니다.",
      importance: "mid",
    });
  }
  return out;
}

// ---- 4) 룰 기반 폴백 ----
function ruleBasedReport(indicators, dateStr) {
  const get = k => indicators.find(i => i.key === k)?._raw;
  const nq = get("nasdaq"), oil = get("wti"), dxy = get("dxy"), fx = get("usdkrw"), y10 = get("ust10y");
  const nqPct = nq?.chgPct ?? 0;
  const sentiment = nqPct > 0.4 ? "bullish" : nqPct < -0.4 ? "bearish" : "neutral";
  const dirWord = v => v == null ? "혼조" : v > 0.1 ? "상승" : v < -0.1 ? "하락" : "보합";
  const summary = `간밤 나스닥은 ${nq ? (nqPct >= 0 ? "+" : "") + nqPct + "%" : "혼조"}로 마감했습니다. 유가 ${dirWord(oil?.chgPct)}, 달러인덱스 ${dirWord(dxy?.chgPct)}, 미 10년물 금리 ${dirWord(y10?.chgPct)}, 원/달러 ${dirWord(fx?.chgPct)} 흐름을 종합하면 오늘 국내증시는 ${sentiment === "bullish" ? "강세 우호적" : sentiment === "bearish" ? "약세 경계" : "혼조·관망"} 출발이 예상됩니다.`;
  return {
    title: "거시 연결고리 기반 나스닥·국내증시 데일리 브리핑",
    sentiment,
    summary,
    chain: [
      { from: "유가", via: "에너지·운송 비용 → 인플레 기대", to: "미 금리", tone: oil?.chgPct > 0 ? "neg" : "pos", note: `유가 ${dirWord(oil?.chgPct)} → 금리 ${oil?.chgPct > 0 ? "상승 압력" : "하락 압력"}.` },
      { from: "미 금리", via: "할인율 → 성장주 밸류에이션", to: "나스닥", tone: y10?.chgPct > 0 ? "neg" : "pos", note: `금리 ${dirWord(y10?.chgPct)}는 기술주에 ${y10?.chgPct > 0 ? "부담" : "우호적"}.` },
      { from: "달러인덱스", via: "위험선호·자금 흐름", to: "원/달러 환율", tone: dxy?.chgPct > 0 ? "neg" : "pos", note: `달러 ${dirWord(dxy?.chgPct)} → 원화 ${dxy?.chgPct > 0 ? "약세, 외국인 매도 압력" : "강세, 외국인 매수 우호"}.` },
      { from: "나스닥", via: "반도체·빅테크 동조화", to: "코스피·코스닥", tone: nqPct > 0 ? "pos" : "neg", note: `나스닥 ${dirWord(nqPct)} → 국내 반도체·IT ${nqPct > 0 ? "동반 강세" : "약세"} 가능.` },
    ],
    nasdaq: { verdict: `나스닥 ${nq ? (nqPct >= 0 ? "+" : "") + nqPct + "%" : "혼조"} 마감`, detail: `금리(${dirWord(y10?.chgPct)})와 유가(${dirWord(oil?.chgPct)}) 흐름이 기술주 밸류에이션에 영향을 줬습니다. 달러(${dirWord(dxy?.chgPct)}) 방향이 위험자산 선호를 좌우했습니다.` },
    domestic: {
      kospiBias: sentiment === "bullish" ? "강세 출발 기대" : sentiment === "bearish" ? "약세 경계" : "관망",
      kosdaqBias: sentiment === "bullish" ? "성장주 우호" : "관망",
      fxNote: `원/달러 ${dirWord(fx?.chgPct)} — ${fx?.chgPct > 0 ? "외국인 수급에 부담" : "외국인 수급에 우호적"}.`,
      detail: `나스닥 흐름과 환율을 종합하면 국내증시는 ${sentiment === "bullish" ? "반도체·IT 중심 강세" : sentiment === "bearish" ? "방어주 중심 보수적 대응" : "종목 장세 속 혼조"}가 예상됩니다.`,
    },
    sectors: nqPct >= 0 ? [
      { name: "반도체", bias: "up", reason: "나스닥·SOX 동조화가 높아 간밤 미 반도체 강세가 직접 반영.", stocks: [{ name: "삼성전자", reason: "외국인 수급 바로미터, 지수 대표주." }, { name: "SK하이닉스", reason: "HBM·AI 메모리 수요 직접 수혜." }] },
      { name: "2차전지", bias: "neutral", reason: "달러·금리 흐름에 따른 성장주 투자심리 영향.", stocks: [{ name: "LG에너지솔루션", reason: "글로벌 전기차 수요 민감주." }, { name: "삼성SDI", reason: "ESS·전지 수요 모멘텀." }] },
    ] : [
      { name: "방어주·통신", bias: "up", reason: "위험회피 국면에서 상대적 강세 기대.", stocks: [{ name: "KT", reason: "고배당·경기방어 특성." }, { name: "SK텔레콤", reason: "안정적 현금흐름, 방어주." }] },
      { name: "정유·에너지", bias: oil?.chgPct > 0 ? "up" : "neutral", reason: "유가 흐름에 직접 연동.", stocks: [{ name: "S-Oil", reason: "정제마진·유가 민감주." }, { name: "GS", reason: "에너지 사업 비중 큼." }] },
    ],
    globalIssues: [
      { category: "지정학", title: "국제 정세 모니터링", detail: "전쟁·지정학 리스크는 유가와 안전자산(달러·금) 선호를 통해 증시에 영향을 줍니다. LLM 분석 활성화 시 당일 핫이슈가 구체적으로 정리됩니다." },
      { category: "무역", title: "무역·관세 이슈", detail: "관세·수출규제 등 무역 이슈는 반도체·자동차 등 수출주에 직접 영향을 줍니다." },
    ],
    weeklyCalendar: weekCalendar(),
    todayIssues: [{ category: "거시", title: "지표 자동 요약", detail: `유가 ${dirWord(oil?.chgPct)}, 달러 ${dirWord(dxy?.chgPct)}, 금리 ${dirWord(y10?.chgPct)} — 연결고리 섹션 참고.` }],
    cards: [
      { emoji: sentiment === "bullish" ? "📈" : sentiment === "bearish" ? "📉" : "⚖️", title: "오늘의 한 줄", body: summary.split(". ")[0] + "." },
      { emoji: "🛢️", title: "유가 → 금리", body: `유가 ${dirWord(oil?.chgPct)} → 금리 ${oil?.chgPct > 0 ? "상승 압력, 기술주 부담" : "하락 압력, 기술주 우호"}.` },
      { emoji: "💵", title: "달러 → 환율 → 수급", body: `달러 ${dirWord(dxy?.chgPct)} → 원화 ${dxy?.chgPct > 0 ? "약세, 외국인 매도 경계" : "강세, 외국인 매수 우호"}.` },
      { emoji: "🇰🇷", title: "국내 방향", body: `${sentiment === "bullish" ? "반도체·IT 강세 출발 기대." : sentiment === "bearish" ? "방어적 대응 권고." : "종목 장세, 선별 대응."}` },
    ],
    detail: `[거시 연결고리]\n유가 ${dirWord(oil?.chgPct)}는 인플레 기대를 통해 금리에 ${oil?.chgPct > 0 ? "상승" : "하락"} 압력으로 작용합니다.\n\n[금리 → 나스닥]\n미 10년물 금리 ${dirWord(y10?.chgPct)}는 성장주 할인율을 ${y10?.chgPct > 0 ? "높여 기술주에 부담" : "낮춰 기술주에 우호적"}으로 작용했고, 나스닥은 ${nq ? (nqPct >= 0 ? "+" : "") + nqPct + "%" : "혼조"}로 마감했습니다.\n\n[달러 → 환율 → 수급]\n달러인덱스 ${dirWord(dxy?.chgPct)}로 원/달러는 ${dirWord(fx?.chgPct)} 흐름을 보여 외국인 수급에 ${dxy?.chgPct > 0 ? "부담" : "우호적"}입니다.\n\n[국내증시 전망]\n종합하면 오늘 국내증시는 ${sentiment === "bullish" ? "반도체·IT 중심 강세 출발" : sentiment === "bearish" ? "약세 경계 속 방어적 대응" : "혼조 속 종목 장세"}가 예상됩니다.\n\n※ 이 리포트는 지표 자동 요약(룰 기반)으로 생성되었습니다. LLM 분석이 활성화되면 더 정교한 해설이 제공됩니다.`,
  };
}

// ---- 메인 ----
async function main() {
  const dateStr = kstDateStr();
  console.log("[market-report] 생성 시작:", dateStr);

  const indicators = await collectIndicators();
  const okCount = indicators.filter(i => i._raw).length;
  console.log(`[market-report] 지표 수집: ${okCount}/${indicators.length}`);

  const { system, user } = buildPrompt(indicators, dateStr);
  let body, mode;
  try {
    body = await callLLM(system, user);
    mode = "llm";
    console.log("[market-report] LLM 분석 완료");
  } catch (e) {
    console.warn("[market-report] LLM 실패, 룰 기반 폴백:", e.message);
    body = ruleBasedReport(indicators, dateStr);
    mode = "rule";
  }

  const stockMap = await loadStockMap();
  attachCodes(body.sectors, stockMap);

  // 수집한 지표를 최종 리포트에 합침 (LLM이 지표를 임의로 채우지 않도록 우리가 덮어씀)
  const cleanIndicators = indicators.map(({ _raw, _err, ...rest }) => rest);

  const report = {
    date: dateStr,
    generatedAt: kstIso(),
    source: mode,
    indicators: cleanIndicators,
    title: body.title,
    sentiment: body.sentiment || "neutral",
    summary: body.summary,
    chain: body.chain || [],
    nasdaq: body.nasdaq || null,
    domestic: body.domestic || null,
    sectors: body.sectors || [],
    globalIssues: body.globalIssues || [],
    weeklyCalendar: body.weeklyCalendar || [],
    todayIssues: body.todayIssues || body.issues || [],
    cards: body.cards || [],
    detail: body.detail || "",
  };

  await writeFile(OUT, JSON.stringify(report, null, 2) + "\n", "utf8");
  console.log("[market-report] 저장 완료:", OUT, `(source=${mode})`);
}

main().catch(e => { console.error("[market-report] 치명적 오류:", e); process.exit(1); });
