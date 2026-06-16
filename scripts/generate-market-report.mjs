#!/usr/bin/env node
/**
 * 데일리 마켓 리포트 생성기
 *
 * 유가 · 달러 · 환율 · 금리 · 나스닥 등 핵심 거시지표를 수집하고,
 * 그 연결관계를 따라 나스닥 반응 → 국내증시 전망 → 수혜 섹터/종목을
 * 분석한 리포트(JSON)를 public/market-report.json 으로 생성한다.
 * 생성된 리포트는 public/market-report-history.json 에 일자별로 누적된다.
 *
 * 매일 새벽(장 시작 전, 07:00 KST 이전) GitHub Action 으로 실행된다.
 *
 * 환경변수:
 *   ANTHROPIC_API_KEY  설정 시 api.anthropic.com 직접 호출 (권장)
 *   ANTHROPIC_MODEL    모델 ID (기본: claude-sonnet-4-6)
 *   (미설정 시) sector-api 프록시로 폴백
 */

import { writeFile, readFile, mkdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import {
  kstNow, kstDateStr, kstIso, fetchWithTimeout, STOOQ, fetchStooqSeries, closesAsOf,
  makeIndicator, loadStockMap, attachCodes, ruleBasedBody, macroSignals,
} from "./lib/report-core.mjs";
import { buildSectorLeaders } from "./lib/sector-leaders.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const OUT = join(ROOT, "public", "market-report.json");
const HIST = join(ROOT, "public", "market-report-history.json");
const REPORTS_DIR = join(ROOT, "public", "reports");
const STOCKS_PATH = join(ROOT, "data", "stocks.json");

const PROXY_URL = "https://sector-api-pink.vercel.app/api/analyze";
const ANTHROPIC_URL = "https://api.anthropic.com/v1/messages";
const PROXY_MODEL = "claude-haiku-4-5-20251001";

// ---- 거시지표 수집 ----
async function collectIndicators(dateStr) {
  const out = [];
  for (const item of STOOQ) {
    try {
      const series = await fetchStooqSeries(item.symbol);
      const { close, prevClose } = closesAsOf(series, dateStr);
      out.push(makeIndicator(item, close, prevClose));
    } catch (e) {
      out.push({ key: item.key, label: item.label, value: "—", change: "—", changePct: "—", dir: "flat", _raw: null });
    }
  }
  return out;
}

// ---- LLM 호출 ----
function buildPrompt(indicators, dateStr) {
  const indLines = indicators.map(i => `- ${i.label}: ${i.value} (${i.changePct})`).join("\n");
  const system = `당신은 Goldman Sachs·Morgan Stanley 수준의 한국 주식시장 글로벌 거시전략 수석 애널리스트입니다. 단순 시황 요약이 아닌, 월스트리트 리서치 리포트 수준의 인과 분석·확률적 시나리오·리스크 요인·실행 가능한 전략을 제공해야 합니다.

분석 품질 기준 (절대 준수):
1. 모든 지표 설명은 단순 방향('상승/하락')이 아니라 구체적 수치·맥락 포함
   - 나쁜 예: "금리가 상승했다" → 좋은 예: "미 10년물 4.52%는 4.5% 임계선 상회로 기술주 PER 압박 지속"
   - 나쁜 예: "환율이 올랐다" → 좋은 예: "원/달러 1,395원은 1,400원 저항선 5원 이내 접근, 달러 강세 재개 시 1,400원 돌파 위험"
2. 거시 인과사슬은 '왜'와 '얼마나'를 수치로 명시
   - 예: "WTI $76.5(+1.8%) → OPEC+ 감산 이행 우려 → 美 CPI 에너지 항목 상승 기대 → 금리 상승 압력 → 나스닥 성장주 PER 압박"
3. 섹터 추천은 오늘의 매크로 레짐(금리 방향·달러 방향·위험선호 레벨)에서 섹터 선택 논리를 명확히 연결
4. 리스크 요인은 '강세/약세 전망을 무너뜨리는 구체적 트리거'를 명시
5. 투자자가 당일 실행 가능한 전략(진입 타이밍·섹터·ETF·손절선)을 구체적으로 제공

반드시 아래 JSON 스키마 하나만 출력하세요 (코드블록·설명 텍스트 금지):
{
  "title": "리포트 제목 한 줄 — 핵심 수치·이슈 포함(예: 나스닥 +1.8% 고금리 속 반등 — 반도체·AI 주도 강세 출발 기대)",
  "sentiment": "bullish|neutral|bearish",
  "summary": "전문가 수준 요약 4~5문장. 핵심 수치 반드시 포함, 거시 연결고리·국내증시 방향성·주요 리스크 포함.",
  "chain": [ {"from":"지표명","via":"구체적 인과 경로(수치·메커니즘 포함)","to":"결과 지표","tone":"pos|neg|neutral","note":"전문 해설 한 줄"} ],
  "nasdaq": {
    "verdict": "나스닥 한 줄 평(수치+맥락, 예: 나스닥 +1.8% — 4일 연속 상승, 기술주 RSI 단기 과매수 주의)",
    "detail": "등락 원인을 유가·금리·달러와 구체적 수치로 연결해 3~4문장. 기술적 레벨(전고점·이평선) 언급."
  },
  "domestic": {
    "kospiBias": "구체적 전망(예: 갭상승 후 2,610~2,640 레인지 시도)",
    "kosdaqBias": "구체적 전망",
    "fxNote": "환율 현재 레벨 + 외국인 수급 방향 한 줄",
    "detail": "오늘 국내증시 시나리오 3~4문장. 지지/저항 레벨 포함."
  },
  "sectors": [ {"name":"섹터명","bias":"up|down|neutral","reason":"매크로 레짐에서 이 섹터가 부각되는 구체적 이유 2~3문장","stocks":[{"name":"정확한 한국 상장 종목명","reason":"수혜 이유 + 구체적 촉매 한 줄"}]} ],
  "riskFactors": [ {"trigger":"이 전망을 무너뜨리는 구체적 트리거(수치 포함)","impact":"시장 영향 — 어떤 섹터/지수가 얼마나","probability":"high|mid|low"} ],
  "strategy": {
    "dayTrading": "당일 단기 전략(진입 타이밍·섹터·ETF·목표 수익·손절선 언급)",
    "swing": "스윙/중기 포지션 방향(1~2주 기준)",
    "sectorRotation": "오늘 주목 섹터 로테이션 근거(어떤 매크로 조건이 어떤 섹터 유리)"
  },
  "keyLevels": [ {"asset":"자산명","support":"지지선(수치)","resistance":"저항선(수치)","note":"이 레벨의 의미 한 줄"} ],
  "globalIssues": [ {"category":"분류","title":"국제 핫이슈 제목","detail":"내용과 한국 증시 영향 1~2문장"} ],
  "weeklyCalendar": [ {"date":"M/D","day":"한글요일 한 글자","title":"이벤트명","detail":"무엇을 보는지·시장 영향 한 줄","importance":"high|mid|low"} ],
  "todayIssues": [ {"category":"국내/글로벌/원자재 등","title":"오늘 주목할 이슈","detail":"한 줄 해설"} ],
  "cards": [ {"emoji":"","title":"카드 제목","body":"카드 본문 1~2문장(수치 포함)"} ],
  "detail": "전문가 상세 분석 본문. 단락은 \\n\\n으로 구분. [거시지표 분석] → [나스닥 기술적 분석] → [국내증시 시나리오] → [섹터 로테이션 전략] → [리스크 요인] → [글로벌 이슈] 순으로 6~8단락. 각 단락에 구체적 수치와 가격 레벨 포함."
}

규칙:
- 종목명은 실제 한국 상장사 정식 명칭만 사용. 코드 불필요.
- 섹터는 3~5개, 각 섹터당 수혜 종목 2~3개.
- chain은 5~7단계, 유가/달러/금리 → 나스닥 → 국내증시까지 인과관계 수치 포함.
- riskFactors는 2~4개, 발생 확률(high/mid/low) 명시.
- strategy는 당일 단기·중기 스윙·섹터 로테이션 3가지 관점 모두 포함.
- keyLevels는 코스피·코스닥·원/달러·미 10년물 포함 4~6개 핵심 가격 레벨.
- globalIssues는 2~4개, 한국 증시 영향까지 연결.
- weeklyCalendar는 오늘 날짜가 속한 주(월~금) 3~6개 이벤트.
- cards는 4~6장. 수치와 핵심 메시지 포함.
- 데이터가 '—'인 지표는 합리적으로 추론.
- 절대 단순 방향만 쓰지 말고 수치·맥락·메커니즘을 포함할 것.`;

  const user = `오늘 날짜(KST): ${dateStr}

간밤 글로벌 마감 거시지표:
${indLines}

위 지표를 Goldman Sachs 수석 애널리스트 수준으로 분석해 한국 증시 개장 전 브리핑 리포트를 작성하세요. 단순 방향이 아닌 구체적 수치·인과관계·리스크·전략이 담긴 전문가 수준 JSON만 출력하세요.`;
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

function assembleReport(dateStr, mode, indicators, body) {
  const cleanIndicators = indicators.map(({ _raw, _err, ...rest }) => rest);
  const macro = macroSignals(indicators);
  return {
    date: dateStr,
    generatedAt: kstIso(),
    source: mode,
    macroScore: macro.score,
    signals: macro.signals,
    indicators: cleanIndicators,
    title: body.title,
    sentiment: body.sentiment || "neutral",
    summary: body.summary,
    chain: body.chain || [],
    nasdaq: body.nasdaq || null,
    domestic: body.domestic || null,
    sectors: body.sectors || [],
    riskFactors: body.riskFactors || [],
    strategy: body.strategy || null,
    keyLevels: body.keyLevels || [],
    globalIssues: body.globalIssues || [],
    weeklyCalendar: body.weeklyCalendar || [],
    todayIssues: body.todayIssues || body.issues || [],
    cards: body.cards || [],
    detail: body.detail || "",
  };
}

// 전체 리포트는 public/reports/DATE.json, 인덱스는 history.json(요약 + OOS)
async function appendHistory(report) {
  await mkdir(REPORTS_DIR, { recursive: true });
  await writeFile(join(REPORTS_DIR, report.date + ".json"), JSON.stringify(report, null, 2) + "\n", "utf8");

  let hist = { meta: {}, analysis: null, reports: [] };
  try { hist = JSON.parse(await readFile(HIST, "utf8")); } catch { /* 신규 */ }
  if (!Array.isArray(hist.reports)) hist.reports = [];
  // 아침 추천주: 데이터 기반 섹터에서 상위 3종목 저장 (익일 결과는 백필이 채운다)
  let morningPicks;
  if (report.sectorsSource === "data") {
    const seen = new Set();
    const flat = [];
    for (const s of (report.sectors || [])) {
      for (const st of (s.stocks || [])) {
        if (!st.name || seen.has(st.name)) continue;
        seen.add(st.name);
        const chg = typeof st.changePct === "number" ? st.changePct : 0;
        flat.push({ name: st.name, code: st.code, sector: s.name, changePct: chg, _str: chg + (st.breakout ? 12 : st.nearHigh ? 6 : 0) + (st.aligned ? 6 : 0) });
      }
    }
    flat.sort((a, b) => b._str - a._str);
    const picks = flat.slice(0, 3).map(({ _str, ...rest }) => rest);
    if (picks.length) morningPicks = picks;
  }
  const entry = {
    date: report.date,
    sentiment: report.sentiment,
    title: report.title,
    summary: report.summary,
    kospiBias: report.domestic?.kospiBias || "",
    indicators: report.indicators,
    topSectors: (report.sectors || []).slice(0, 3).map(s => ({ name: s.name, bias: s.bias })),
    source: report.source,
    // oos(실제 결과 검증)는 백필 스크립트가 계산해 채운다. 당일 생성 시엔 미정.
    oos: (hist.reports.find(r => r.date === report.date) || {}).oos || null,
    ...(morningPicks ? { morningPicks } : {}),
  };
  hist.reports = hist.reports.filter(r => r.date !== report.date);
  hist.reports.push(entry);
  hist.reports.sort((a, b) => b.date.localeCompare(a.date));
  hist.meta = { ...(hist.meta || {}), updatedAt: kstIso(), count: hist.reports.length };
  await writeFile(HIST, JSON.stringify(hist, null, 2) + "\n", "utf8");
  console.log("[market-report] 히스토리 갱신:", hist.reports.length, "건");
}

async function main() {
  const dateStr = kstDateStr();
  console.log("[market-report] 생성 시작:", dateStr);

  const indicators = await collectIndicators(dateStr);
  console.log(`[market-report] 지표 수집: ${indicators.filter(i => i._raw).length}/${indicators.length}`);

  const { system, user } = buildPrompt(indicators, dateStr);
  let body, mode;
  try {
    body = await callLLM(system, user);
    mode = "llm";
    console.log("[market-report] LLM 분석 완료");
  } catch (e) {
    console.warn("[market-report] LLM 실패, 룰 기반 폴백:", e.message);
    body = ruleBasedBody(indicators, kstNow());
    mode = "rule";
  }

  attachCodes(body.sectors, await loadStockMap(STOCKS_PATH));
  const report = assembleReport(dateStr, mode, indicators, body);

  // 데이터 기반 섹터 주도주 — 전일 실거래(등락·거래대금·신고가·정배열)로 매일 선정
  try {
    const leaders = await buildSectorLeaders(STOCKS_PATH, { dateStr });
    if (leaders && leaders.length) {
      report.sectors = leaders;
      report.sectorsSource = "data";
      // 카드뉴스 '주목 섹터' 서사를 실데이터 섹터·종목으로 동기화 (흐름 한 장 카드와 일치)
      const secCard = (report.cards || []).find(c => c.title === "주목 섹터");
      if (secCard) {
        const names = leaders.map(s => s.name).join("·");
        const leads = leaders.map(s => (s.stocks || [])[0]).filter(Boolean).map(x => x.name).slice(0, 4).join("·");
        secCard.body = `전일 실거래 기준 주도 섹터는 ${names}입니다. ${leads ? `대표주 ${leads} 등 ` : ""}신고가·정배열·거래대금 상위 종목 위주로 관심.`;
      }
      console.log(`[market-report] 데이터 기반 섹터 ${leaders.length}개 (${leaders.map(s => s.name).join(", ")})`);
    } else {
      console.warn("[market-report] 섹터 주도주 데이터 없음 — 템플릿 섹터 유지");
    }
  } catch (e) {
    console.warn("[market-report] 섹터 주도주 실패, 템플릿 섹터 유지:", e.message);
  }

  await writeFile(OUT, JSON.stringify(report, null, 2) + "\n", "utf8");
  console.log("[market-report] 저장 완료:", OUT, `(source=${mode})`);
  await appendHistory(report);
}

main().catch(e => { console.error("[market-report] 치명적 오류:", e); process.exit(1); });
