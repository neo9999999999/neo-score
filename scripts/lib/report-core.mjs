// 리포트 생성 공용 로직 — 데일리 생성기와 백필 스크립트가 함께 사용한다.
import { readFile } from "node:fs/promises";

// ---- 시간 유틸 (KST) ----
export function kstNow() {
  const d = new Date();
  return new Date(d.getTime() + (9 * 60 - d.getTimezoneOffset()) * 60000);
}
export function kstDateStr(d = kstNow()) { return d.toISOString().slice(0, 10); }
export function kstIso(d = kstNow()) { return d.toISOString().slice(0, 19) + "+09:00"; }

export async function fetchWithTimeout(url, opts = {}, ms = 15000) {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), ms);
  try { return await fetch(url, { ...opts, signal: ctrl.signal }); }
  finally { clearTimeout(t); }
}

// ---- 지표 정의 (Yahoo Finance 심볼) ----
export const MARKETS = [
  { key: "nasdaq", label: "나스닥", symbol: "^IXIC", fmt: "index" },
  { key: "sp500", label: "S&P 500", symbol: "^GSPC", fmt: "index" },
  { key: "wti", label: "WTI 유가", symbol: "CL=F", fmt: "usd" },
  { key: "dxy", label: "달러인덱스", symbol: "DX-Y.NYB", fmt: "num" },
  { key: "usdkrw", label: "원/달러 환율", symbol: "KRW=X", fmt: "krw" },
  { key: "ust10y", label: "미 10년물 금리", symbol: "^TNX", fmt: "pct" },
];
export const KOSPI_SYMBOL = "^KS11";
// 하위 호환 별칭
export const STOOQ = MARKETS;

export function fmtVal(v, fmt) {
  if (v == null || !isFinite(v)) return "—";
  if (fmt === "index") return v.toLocaleString("en-US", { maximumFractionDigits: 2 });
  if (fmt === "usd") return "$" + v.toFixed(2);
  if (fmt === "krw") return v.toLocaleString("ko-KR", { maximumFractionDigits: 1 }) + "원";
  if (fmt === "pct") return v.toFixed(2) + "%";
  return v.toLocaleString("en-US", { maximumFractionDigits: 2 });
}

// close/prevClose → 표시용 indicator 객체
export function makeIndicator(item, close, prevClose) {
  if (!isFinite(close) || !isFinite(prevClose)) {
    return { key: item.key, label: item.label, value: "—", change: "—", changePct: "—", dir: "flat", _raw: null };
  }
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
}

// Yahoo Finance 차트 JSON → [{date, close}] (오름차순)
export function parseYahooChart(json) {
  const res = json?.chart?.result?.[0];
  if (!res || !Array.isArray(res.timestamp)) return [];
  const ts = res.timestamp;
  const q = res.indicators?.quote?.[0]?.close || [];
  const adj = res.indicators?.adjclose?.[0]?.adjclose || [];
  const out = [];
  for (let i = 0; i < ts.length; i++) {
    const close = (q[i] != null ? q[i] : adj[i]);
    if (close == null || !isFinite(close)) continue;
    const date = new Date(ts[i] * 1000).toISOString().slice(0, 10);
    out.push({ date, close: +close });
  }
  // 같은 날짜 중복 시 마지막 값 유지
  const map = new Map(out.map(r => [r.date, r.close]));
  return [...map.entries()].map(([date, close]) => ({ date, close })).sort((a, b) => a.date.localeCompare(b.date));
}

export async function fetchYahooSeries(symbol, range = "2y") {
  const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(symbol)}?range=${range}&interval=1d`;
  const r = await fetchWithTimeout(url, { headers: { "User-Agent": "Mozilla/5.0 (compatible; neo-score/1.0)" } }, 20000);
  if (!r.ok) throw new Error("HTTP " + r.status);
  return parseYahooChart(await r.json());
}

// 하위 호환 별칭
export const fetchStooqSeries = fetchYahooSeries;

// 시리즈에서 date 이하(<=)의 가장 최근 종가와 그 직전 종가
export function closesAsOf(series, date) {
  let i = -1;
  for (let k = 0; k < series.length; k++) { if (series[k].date <= date) i = k; else break; }
  if (i < 0) return { close: NaN, prevClose: NaN };
  return { close: series[i].close, prevClose: i > 0 ? series[i - 1].close : NaN };
}

// ---- 종목 코드 매핑 ----
export async function loadStockMap(stocksPath) {
  try {
    const data = JSON.parse(await readFile(stocksPath, "utf8"));
    const map = new Map();
    for (const s of (data.stocks || [])) map.set(s.name, { code: s.code, market: s.market });
    return map;
  } catch { return new Map(); }
}
export function attachCodes(sectors, stockMap) {
  for (const sec of sectors || []) {
    for (const st of sec.stocks || []) {
      if (!st.code && stockMap.has(st.name)) st.code = stockMap.get(st.name).code;
    }
  }
  return sectors;
}

// 해당 날짜가 속한 주(월~금) 골격
export function weekCalendar(refDate = kstNow()) {
  const now = new Date(refDate.getTime());
  const dow = now.getUTCDay();
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

// 룰 기반 '이번주 관전 포인트' — 실제 지표값 기반(가짜 이벤트 대신)
export function macroWatch(indicators) {
  const get = k => indicators.find(i => i.key === k);
  const fmt = ind => (ind && ind.value !== "—") ? `${ind.value} (${ind.changePct})` : "데이터 대기";
  const big = ind => ind && ind._raw && Math.abs(ind._raw.chgPct) >= 0.5;
  const nq = get("nasdaq"), y10 = get("ust10y"), fx = get("usdkrw"), oil = get("wti"), dxy = get("dxy");
  return [
    { date: "금리", day: "美10Y", title: `미 10년물 ${fmt(y10)}`, detail: "상승 지속 시 성장주(기술·바이오·2차전지) 밸류 부담, 하락 시 우호. 한·미 통화정책 발언 주시.", importance: big(y10) ? "high" : "mid" },
    { date: "환율", day: "원/달러", title: `원/달러 ${fmt(fx)}`, detail: "고환율 구간 — 외국인 순매수/순매도 방향을 좌우. 환율 안정 시 외인 수급 개선.", importance: "high" },
    { date: "유가", day: "WTI", title: `WTI ${fmt(oil)}`, detail: "정유·조선·해운·인플레 경로. 급등 시 항공·운송 부담, 하락 시 화학·소비 우호.", importance: big(oil) ? "high" : "mid" },
    { date: "미증시", day: "나스닥", title: `나스닥 ${fmt(nq)}`, detail: "간밤 흐름이 국내 반도체·AI 동조. 빅테크 실적·미 지표 발표 주시.", importance: "mid" },
    { date: "달러", day: "DXY", title: `달러인덱스 ${fmt(dxy)}`, detail: "달러 강세 시 신흥국·원화 약세 압력, 약세 시 위험자산 선호.", importance: "low" },
  ];
}

// ---- 룰 기반 리포트 본문 (지표 배열 → 분석 객체) ----
export function ruleBasedBody(indicators, refDate = kstNow()) {
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
      { name: "반도체", bias: "up", reason: "나스닥·SOX 동조화가 높아 간밤 미 반도체 강세가 직접 반영.", stocks: [{ name: "삼성전자", reason: "외국인 수급 바로미터, 지수 대표주." }, { name: "SK하이닉스", reason: "HBM·AI 메모리 수요 직접 수혜." }, { name: "한미반도체", reason: "HBM 본더 장비 대표주." }] },
      { name: "AI·인터넷", bias: "up", reason: "미 빅테크·AI 강세 동조.", stocks: [{ name: "네이버", reason: "AI·검색 플랫폼." }, { name: "카카오", reason: "플랫폼·AI 모멘텀." }] },
      { name: "2차전지", bias: "neutral", reason: "달러·금리 흐름에 따른 성장주 투자심리 영향.", stocks: [{ name: "LG에너지솔루션", reason: "글로벌 전기차 수요 민감주." }, { name: "삼성SDI", reason: "ESS·전지 수요." }, { name: "에코프로비엠", reason: "양극재 대표주." }] },
      { name: "방산", bias: "up", reason: "지정학 리스크·수출 모멘텀.", stocks: [{ name: "한화에어로스페이스", reason: "방산 수출 대표주." }, { name: "LIG넥스원", reason: "유도무기 수주." }] },
    ] : [
      { name: "방어주·통신", bias: "up", reason: "위험회피 국면에서 상대적 강세 기대.", stocks: [{ name: "KT", reason: "고배당·경기방어." }, { name: "SK텔레콤", reason: "안정적 현금흐름." }] },
      { name: "정유·에너지", bias: oil?.chgPct > 0 ? "up" : "neutral", reason: "유가 흐름에 직접 연동.", stocks: [{ name: "S-Oil", reason: "정제마진·유가 민감주." }, { name: "GS", reason: "에너지 사업 비중." }] },
      { name: "음식료·필수소비", bias: "up", reason: "경기방어 성격.", stocks: [{ name: "CJ제일제당", reason: "필수소비 대표주." }, { name: "오리온", reason: "안정적 실적." }] },
      { name: "금융", bias: "neutral", reason: "금리 상승기 이자이익 수혜 가능.", stocks: [{ name: "KB금융", reason: "대표 금융지주." }, { name: "신한지주", reason: "고배당 금융주." }] },
    ],
    globalIssues: [
      { category: "지정학", title: "국제 정세 모니터링", detail: "전쟁·지정학 리스크는 유가와 안전자산(달러·금) 선호를 통해 증시에 영향을 줍니다." },
      { category: "무역", title: "무역·관세 이슈", detail: "관세·수출규제 등 무역 이슈는 반도체·자동차 등 수출주에 직접 영향을 줍니다." },
    ],
    weeklyCalendar: macroWatch(indicators, refDate),
    todayIssues: [{ category: "거시", title: "지표 자동 요약", detail: `유가 ${dirWord(oil?.chgPct)}, 달러 ${dirWord(dxy?.chgPct)}, 금리 ${dirWord(y10?.chgPct)} — 연결고리 섹션 참고.` }],
    cards: [
      { emoji: sentiment === "bullish" ? "📈" : sentiment === "bearish" ? "📉" : "⚖️", title: "오늘의 한 줄", body: summary.split(". ")[0] + "." },
      { emoji: "🛢️", title: "유가 → 금리", body: `유가 ${dirWord(oil?.chgPct)} → 금리 ${oil?.chgPct > 0 ? "상승 압력, 기술주 부담" : "하락 압력, 기술주 우호"}.` },
      { emoji: "💵", title: "달러 → 환율 → 수급", body: `달러 ${dirWord(dxy?.chgPct)} → 원화 ${dxy?.chgPct > 0 ? "약세, 외국인 매도 경계" : "강세, 외국인 매수 우호"}.` },
      { emoji: "🇰🇷", title: "국내 방향", body: `${sentiment === "bullish" ? "반도체·IT 강세 출발 기대." : sentiment === "bearish" ? "방어적 대응 권고." : "종목 장세, 선별 대응."}` },
    ],
    detail: `[거시 연결고리]\n유가 ${dirWord(oil?.chgPct)}는 인플레 기대를 통해 금리에 ${oil?.chgPct > 0 ? "상승" : "하락"} 압력으로 작용합니다.\n\n[금리 → 나스닥]\n미 10년물 금리 ${dirWord(y10?.chgPct)}는 성장주 할인율을 ${y10?.chgPct > 0 ? "높여 기술주에 부담" : "낮춰 기술주에 우호적"}으로 작용했고, 나스닥은 ${nq ? (nqPct >= 0 ? "+" : "") + nqPct + "%" : "혼조"}로 마감했습니다.\n\n[달러 → 환율 → 수급]\n달러인덱스 ${dirWord(dxy?.chgPct)}로 원/달러는 ${dirWord(fx?.chgPct)} 흐름을 보여 외국인 수급에 ${dxy?.chgPct > 0 ? "부담" : "우호적"}입니다.\n\n[국내증시 전망]\n종합하면 오늘 국내증시는 ${sentiment === "bullish" ? "반도체·IT 중심 강세 출발" : sentiment === "bearish" ? "약세 경계 속 방어적 대응" : "혼조 속 종목 장세"}가 예상됩니다.\n\n※ 룰 기반 자동 분석입니다. LLM 분석이 활성화되면 더 정교한 해설이 제공됩니다.`,
  };
}

export const sentToSign = s => s === "bullish" ? 1 : s === "bearish" ? -1 : 0;
