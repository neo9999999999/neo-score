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

// ---- 한글 조사 헬퍼 (받침 유무로 은/는·이/가·을/를 선택) ----
export function hasBatchim(word) {
  if (!word) return false;
  const c = String(word).charCodeAt(String(word).length - 1);
  if (c < 0xAC00 || c > 0xD7A3) return false; // 한글 음절이 아니면 받침 없음 취급
  return (c - 0xAC00) % 28 !== 0;
}
export const josa = (w, withBatchim, noBatchim) => (w == null ? "" : w) + (hasBatchim(w) ? withBatchim : noBatchim);
// 로/으로: 받침 없음 또는 ㄹ받침 → "로", 그 외 → "으로"
export function josaRo(w) {
  if (w == null) return "";
  const s = String(w);
  const c = s.charCodeAt(s.length - 1);
  if (c < 0xAC00 || c > 0xD7A3) return s + "로";
  const jong = (c - 0xAC00) % 28;
  return s + (jong === 0 || jong === 8 ? "로" : "으로");
}

// ---- 다요인 거시 신호 종합 (나스닥 단일 → 5개 지표 가중 점수) ----
// 각 지표가 '국내증시'에 주는 방향성을 부호×가중치로 합산한다.
//   sign=+1: 값 상승이 국내 우호 / sign=-1: 값 상승이 국내 부담
export function macroSignals(indicators) {
  const get = k => indicators.find(i => i.key === k)?._raw;
  const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
  const defs = [
    { key: "nasdaq", label: "나스닥", sign: 1, w: 1.0, up: "국내 반도체·IT 동반 강세에 우호", down: "기술주 투자심리 위축 요인" },
    { key: "sp500", label: "S&P500", sign: 1, w: 0.5, up: "글로벌 위험선호 개선", down: "위험회피 분위기 확산" },
    { key: "usdkrw", label: "원/달러", sign: -1, w: 0.7, up: "원화 강세 → 외국인 순매수 우호", down: "원화 약세 → 외국인 순매도 압력" },
    { key: "ust10y", label: "미 10년물", sign: -1, w: 0.5, up: "금리 하락 → 성장주 밸류에이션 우호", down: "금리 상승 → 성장주 밸류에이션 부담" },
    { key: "wti", label: "WTI 유가", sign: -1, w: 0.3, up: "유가 안정 → 물가·비용 부담 완화", down: "유가 급등 → 인플레·비용 부담" },
  ];
  const signals = [];
  let score = 0;
  for (const d of defs) {
    const raw = get(d.key);
    if (!raw) continue;
    const pct = raw.chgPct;
    const contrib = clamp(pct, -2, 2) * d.sign * d.w; // 단일 지표 outlier가 전체를 지배하지 않도록 ±2%로 제한
    score += contrib;
    const fav = contrib > 0.03 ? "good" : contrib < -0.03 ? "bad" : "flat";
    signals.push({ key: d.key, label: d.label, pct: +pct.toFixed(2), score: +contrib.toFixed(2), fav, note: fav === "good" ? d.up : fav === "bad" ? d.down : "영향 중립" });
  }
  score = +score.toFixed(2);
  const sentiment = score > 0.5 ? "bullish" : score < -0.5 ? "bearish" : "neutral";
  return { score, sentiment, signals };
}

// ---- 룰 기반 리포트 본문 (지표 배열 → 분석 객체) ----
export function ruleBasedBody(indicators, refDate = kstNow()) {
  const get = k => indicators.find(i => i.key === k)?._raw;
  const nq = get("nasdaq"), oil = get("wti"), dxy = get("dxy"), fx = get("usdkrw"), y10 = get("ust10y"), sp = get("sp500");
  const nqPct = nq?.chgPct ?? 0;
  const spPct = sp?.chgPct ?? 0;
  const fxClose = fx?.close ?? null;
  const y10Close = y10?.close ?? null;
  const oilClose = oil?.close ?? null;
  const macro = macroSignals(indicators);
  const sentiment = macro.sentiment;
  const goods = macro.signals.filter(s => s.fav === "good").map(s => s.label);
  const bads = macro.signals.filter(s => s.fav === "bad").map(s => s.label);

  // --- 방향 헬퍼 ---
  const dirWord = v => v == null ? "혼조" : v > 0.1 ? "상승" : v < -0.1 ? "하락" : "보합";
  const dW = v => josa(dirWord(v), "은", "는");
  const dRo = v => josaRo(dirWord(v));
  const pctStr = v => v == null ? "—" : (v >= 0 ? "+" : "") + v.toFixed(2) + "%";

  // --- 크기 수식어 ---
  const nqAbs = Math.abs(nqPct);
  const nqMag = nqAbs >= 2.0 ? "급등락" : nqAbs >= 1.0 ? "큰 폭" : nqAbs >= 0.3 ? "소폭" : "보합권";

  // --- 핵심 가격대 맥락 (실제 수치 기반) ---
  const fxCtx = !fxClose ? "환율 수집 중" :
    fxClose >= 1420 ? `${fxClose.toLocaleString("ko-KR", { maximumFractionDigits: 0 })}원 — 연중 고환율 경계, 외국인 순매도 가속 위험` :
    fxClose >= 1400 ? `${fxClose.toLocaleString("ko-KR", { maximumFractionDigits: 0 })}원 — 1,400원 저항선 상회, 외국인 수급 부담 구간` :
    fxClose >= 1380 ? `${fxClose.toLocaleString("ko-KR", { maximumFractionDigits: 0 })}원 — 1,380-1,400원 관리 구간, 안정 여부 주시` :
    `${fxClose.toLocaleString("ko-KR", { maximumFractionDigits: 0 })}원 — 1,380원 하회, 원화 강세로 외국인 수급 우호`;

  const y10Ctx = !y10Close ? "금리 수집 중" :
    y10Close >= 4.8 ? `${y10Close.toFixed(2)}% — 4.8% 돌파, 성장주 밸류에이션 부담 극심` :
    y10Close >= 4.5 ? `${y10Close.toFixed(2)}% — 4.5% 임계선 상회, 기술주·2차전지 PER 압박` :
    y10Close >= 4.0 ? `${y10Close.toFixed(2)}% — 4~4.5% 긴장 구간, 증시와 경쟁 관계` :
    `${y10Close.toFixed(2)}% — 4% 하회, 성장주 밸류에이션 상대적 우호`;

  const oilCtx = !oilClose ? "유가 수집 중" :
    oilClose >= 85 ? `$${oilClose.toFixed(1)} — $85 돌파 고유가, 인플레 우려 재점화 경계` :
    oilClose >= 75 ? `$${oilClose.toFixed(1)} — $75-85 박스권, OPEC+ 감산 이행 여부 핵심` :
    oilClose >= 65 ? `$${oilClose.toFixed(1)} — $65-75 안정 구간, 에너지 비용 부담 제한적` :
    `$${oilClose.toFixed(1)} — $65 하회 저유가, 정유·에너지주 수익성 압박`;

  // --- 동적 제목 ---
  const title = sentiment === "bullish"
    ? `나스닥 ${pctStr(nqPct)} 동조 — 반도체·AI 주도 강세 출발 기대`
    : sentiment === "bearish"
    ? `나스닥 ${pctStr(nqPct)} + 거시 부담 — 약세 경계, 방어적 대응 권고`
    : `나스닥 ${pctStr(nqPct)} 혼조 — 종목 장세·차별화 전망`;

  // --- 전문가 수준 요약 ---
  const summary = [
    nq ? `간밤 나스닥은 전일 대비 ${pctStr(nqPct)}(${nqMag})으로 마감, S&P500은 ${pctStr(spPct)}를 기록했습니다.` : "간밤 미국 증시는 혼조 마감했습니다.",
    y10Close ? `미 10년물 금리는 ${y10Ctx}.` : "",
    fxClose ? `원/달러 ${fxCtx}.` : "",
    `5개 거시지표 가중 신호 점수 ${macro.score >= 0 ? "+" : ""}${macro.score}(범위 ±3)으로, 오늘 국내증시는 ${sentiment === "bullish" ? "강세 우호 출발이 기대됩니다" : sentiment === "bearish" ? "약세 경계가 필요하며 방어적 대응을 권고합니다" : "혼조 속 종목·섹터별 차별화가 예상됩니다"}.`,
    (goods.length || bads.length) ? `우호 요인: ${goods.length ? goods.join("·") : "없음"} / 부담 요인: ${bads.length ? bads.join("·") : "없음"}.` : "",
  ].filter(Boolean).join(" ");

  // --- 인과사슬 (5단계, 정량 맥락 포함) ---
  const chain = [
    {
      from: "WTI 유가",
      via: `$${oilClose ? oilClose.toFixed(1) : "?"} — 에너지 비용·인플레 기대 경로`,
      to: "미 CPI·금리 기대",
      tone: (oil?.chgPct ?? 0) > 0.5 ? "neg" : (oil?.chgPct ?? 0) < -0.5 ? "pos" : "neutral",
      note: `${oilCtx}. ${(oil?.chgPct ?? 0) > 1 ? "급등 → 인플레 기대 자극 → 금리 상승 압력." : (oil?.chgPct ?? 0) < -1 ? "하락 → 인플레 기대 완화 → 금리 하락 우호." : "보합 수준으로 금리 경로 영향 제한적."}`,
    },
    {
      from: "달러인덱스(DXY)",
      via: "글로벌 위험선호 및 신흥국 자본 흐름",
      to: "원/달러 환율",
      tone: (dxy?.chgPct ?? 0) > 0.3 ? "neg" : (dxy?.chgPct ?? 0) < -0.3 ? "pos" : "neutral",
      note: `달러 ${dirWord(dxy?.chgPct)} → 원화 ${(dxy?.chgPct ?? 0) > 0 ? "약세 압력, 외국인 순매도 유발 가능" : "강세 지지, 외국인 순매수 유입 우호"}. ${fxCtx}.`,
    },
    {
      from: "미 10년물 금리",
      via: `${y10Close ? y10Close.toFixed(2) + "%" : ""} — 성장주 할인율·PER 밸류에이션`,
      to: "나스닥 기술주",
      tone: (y10?.chgPct ?? 0) > 0.5 ? "neg" : (y10?.chgPct ?? 0) < -0.5 ? "pos" : "neutral",
      note: `${y10Ctx}. 금리 ${dirWord(y10?.chgPct)} 시 기술주 PER에 ${(y10?.chgPct ?? 0) > 0 ? "부담 → 나스닥 하방 압력" : "우호 → 나스닥 밸류 지지"}.`,
    },
    {
      from: "나스닥",
      via: `${pctStr(nqPct)} — 한국 반도체·IT 동조화 (역사적 β ≈ 1.5~2배)`,
      to: "코스피·코스닥 반도체",
      tone: nqPct > 0.3 ? "pos" : nqPct < -0.3 ? "neg" : "neutral",
      note: `나스닥 1% 변동 시 국내 반도체 지수 약 1.5~2% 연동. ${nqPct >= 1 ? "오늘 강세 동조 기대." : nqPct <= -1 ? "오늘 약세 압력 예상." : "소폭 변동, 수급 방향이 관건."}`,
    },
    {
      from: "외국인 수급",
      via: `환율 ${fxClose ? fxClose.toLocaleString("ko-KR", { maximumFractionDigits: 0 }) + "원" : ""} · 글로벌 위험선호`,
      to: "코스피 지수 방향",
      tone: (fx?.chgPct ?? 0) < -0.3 ? "pos" : (fx?.chgPct ?? 0) > 0.3 ? "neg" : "neutral",
      note: `${fxCtx}. 외국인 수급 방향이 코스피 2,500~2,700 레인지 돌파 여부를 결정합니다.`,
    },
  ];

  // --- 나스닥 분석 (정량 맥락 포함) ---
  const nasdaq = {
    verdict: `나스닥 ${pctStr(nqPct)}(${nqMag}) 마감${sp ? ` / S&P500 ${pctStr(spPct)}` : ""}`,
    detail: [
      `나스닥은 전일 대비 ${pctStr(nqPct)}로 마감했습니다. ${nqAbs >= 1.5 ? "단기적으로 유의미한 변동으로" : nqAbs >= 0.5 ? "중간 강도 변동으로" : "소폭 변동으로"} 국내 반도체·IT 섹터에 ${nqPct >= 0.5 ? "강세 동조 신호를 줍니다" : nqPct <= -0.5 ? "약세 압력으로 작용합니다" : "제한적 영향을 줄 것입니다"}.`,
      y10Close ? `금리 측면에서 미 10년물 ${y10Ctx}. ${(y10?.chgPct ?? 0) > 0 ? "금리 상승이 기술주 밸류에이션에 부담으로 작용했습니다." : (y10?.chgPct ?? 0) < 0 ? "금리 하락이 성장주에 우호적으로 작용했습니다." : "금리 변동이 제한적이었습니다."}` : "",
      oilClose ? `유가(${oilCtx}) ${dW(oil?.chgPct)} 인플레 기대 경로를 통해 금리·나스닥에 영향을 줬습니다.` : "",
    ].filter(Boolean).join(" "),
  };

  // --- 국내증시 전망 (구체적 레인지·시나리오) ---
  const domestic = {
    kospiBias: sentiment === "bullish" ? "강세 출발 — 반도체·AI 주도 갭업 시도"
      : sentiment === "bearish" ? "약세 경계 — 방어주 중심 보수적 대응"
      : "혼조·관망 — 종목·섹터 차별화",
    kosdaqBias: sentiment === "bullish" ? "성장주 강세 — AI·바이오 주도 가능"
      : sentiment === "bearish" ? "고PER 종목 주의 — 금리·환율 부담"
      : "선별적 접근 — 실적·수급 우위 종목만",
    fxNote: fxClose ? `원/달러 ${fxCtx}` : "환율 수집 실패",
    detail: [
      `나스닥 ${pctStr(nqPct)}과 거시신호 ${macro.score >= 0 ? "+" : ""}${macro.score}을 종합하면, 오늘 국내증시는 ${sentiment === "bullish" ? "반도체·AI 중심 강세 출발 후 전반 상승이 기대됩니다" : sentiment === "bearish" ? "갭하락 출발 후 방어주 중심 종목 장세로 압축될 가능성이 높습니다" : "혼조 속 섹터별 차별화가 예상됩니다"}.`,
      fxClose ? `원/달러 ${fxClose.toLocaleString("ko-KR", { maximumFractionDigits: 0 })}원 수준에서 외국인 수급은 ${fxClose >= 1400 ? "순매도 우위로 지수 상단을 제한할 수 있습니다" : fxClose >= 1380 ? "중립적이나, 추가 원화 강세 시 순매수 전환 가능합니다" : "순매수 방향으로 지수에 우호적입니다"}.` : "",
      `단기 전략으로는 ${sentiment === "bullish" ? "반도체·전력기기·방산 수출주 위주 대응이 유효하며, 갭업 후 오전 10~11시 눌림목이 매수 타이밍으로 거론됩니다" : sentiment === "bearish" ? "통신·금융·음식료 방어주 비중 확대와 손절선 명확화가 필요합니다" : "신고가·정배열 종목 위주 선별적 접근을 권고합니다"}.`,
    ].filter(Boolean).join(" "),
  };

  // --- 리스크 요인 ---
  const riskFactors = [];
  if (y10Close >= 4.5) riskFactors.push({
    trigger: `미 10년물 금리 추가 상승 — 현재 ${y10Close.toFixed(2)}%에서 4.8% 돌파 시`,
    impact: "기술주·2차전지 고PER 성장주 급락, 코스닥 하방 가속",
    probability: y10Close >= 4.7 ? "high" : "mid",
  });
  if (fxClose >= 1400) riskFactors.push({
    trigger: `원/달러 추가 상승 — 현재 ${fxClose.toLocaleString("ko-KR", { maximumFractionDigits: 0 })}원에서 1,430원 돌파 시`,
    impact: "외국인 순매도 가속, 코스피 대형주 수급 악화",
    probability: "mid",
  });
  if (oilClose >= 80) riskFactors.push({
    trigger: `WTI 추가 급등 — 현재 $${oilClose.toFixed(1)}에서 $90 돌파 시`,
    impact: "인플레 재점화 → 금리 상승 → 증시 전반 하방 압력",
    probability: "low",
  });
  if (nqPct >= 1.5) riskFactors.push({
    trigger: "나스닥 단기 급등 후 차익실현 매물 출회",
    impact: "국내 반도체·IT 동반 단기 조정, RSI 과매수 되돌림 가능",
    probability: "mid",
  });
  if (sentiment === "bullish" && riskFactors.length < 2) riskFactors.push({
    trigger: "예상 외 매파적 연준 발언 또는 지정학 이벤트 발생",
    impact: "금리 급등·달러 강세 동반 → 나스닥 급락 → 국내증시 연동 하방",
    probability: "low",
  });
  if (sentiment === "bearish" && riskFactors.length < 2) riskFactors.push({
    trigger: "연준 금리 인하 신호 또는 강한 기업실적 서프라이즈",
    impact: "투자심리 급반전, 공매도 숏커버링 → 단기 급등 반전 위험",
    probability: "low",
  });
  if (!riskFactors.length) riskFactors.push({
    trigger: "금리·환율·유가 동반 악화(다중 악재 시나리오)",
    impact: "거시 방향성 반전, 전 섹터 동반 하락",
    probability: "low",
  });

  // --- 전략 제안 ---
  const strategy = {
    dayTrading: sentiment === "bullish"
      ? `갭업 출발 후 오전 10~11시 1차 눌림목에서 반도체(삼성전자·SK하이닉스)·AI 주도주 분할 매수. KODEX 반도체, TIGER 나스닥100 ETF로 방향성 레버리지도 고려. 목표 수익 +2~3%에서 절반 익절, 나머지는 추격 상승 시 추가 보유.`
      : sentiment === "bearish"
      ? `갭하락 출발 시 추격 매수 자제. 낙폭과대 방어주(통신·금융·음식료) 중심 관망. 전일 대비 -2% 이상 종목은 추가 하락 위험 확인 후 접근. 리스크 관리 최우선.`
      : `방향성 불확실 — 전일 신고가·정배열 종목 위주 모멘텀 플레이. 지수 방향보다 개별 종목 수급 확인 우선. 반도체·방산 강한 종목만 선별, 포지션 규모 축소 권고.`,
    swing: sentiment === "bullish"
      ? `반도체 슈퍼사이클(HBM·AI 서버)·방산 수출 구조적 강세 기조 유지 중. 조정 시 정배열 유지 종목 분할 매수 기회. 코스피 2,500~2,550 지지선 확인 후 비중 확대 유효.`
      : sentiment === "bearish"
      ? `단기 약세 국면 — 현금 비중 30~50% 확대 권고. 반등 시 주도 섹터 재진입 탐색. 손절선(매수가 -5~7%) 명확화, 홀딩 종목 재검토 필요.`
      : `중립 국면 — 실적 모멘텀·수주 가시성 높은 업종(방산·조선·반도체 장비) 중심 선별 매수. 고금리·고환율 지속 시 금융주 배당 매력 체크.`,
    sectorRotation: sentiment === "bullish"
      ? `[금리 안정 + 나스닥 강세] → 반도체·AI·2차전지 성장 섹터 확장. 원화 강세 전환 시 소비재·리오프닝 가세 가능. 유가 하락 동반 시 항공·화학도 참여.`
      : sentiment === "bearish"
      ? `[금리 상승 + 고환율] → 방어주(통신·금융·필수소비) 비중 확대. 수주 잔고 탄탄한 조선·방산은 경기방어와 성장 교차점. 수출주는 환율 헤지 여부 확인 후 접근.`
      : `[거시 혼조] → 섹터 로테이션 관찰 기간. 실적 서프라이즈·수출 호조 예정 종목 중심 선택적 매매. 방어+성장 균형 포트폴리오 권장.`,
  };

  // --- 핵심 가격대 ---
  const keyLevels = [
    { asset: "코스피", support: "2,500~2,520선", resistance: "2,620~2,660선", note: `나스닥 ${pctStr(nqPct)}가 코스피에 약 0.5~0.7배 반영. 외국인 수급 방향이 레인지 방향 결정.` },
    { asset: "코스닥", support: "700~720선", resistance: "760~790선", note: "반도체·2차전지·AI 수급 연동. 외국인·기관 매수 전환 여부가 핵심." },
    fxClose ? { asset: "원/달러", support: `${Math.round(fxClose - 15).toLocaleString("ko-KR")}원 근방`, resistance: `${Math.round(fxClose + 15).toLocaleString("ko-KR")}원 근방`, note: fxCtx } : null,
    y10Close ? { asset: "미 10년물", support: `${(y10Close - 0.15).toFixed(2)}%`, resistance: `${(y10Close + 0.15).toFixed(2)}%`, note: y10Ctx } : null,
    oilClose ? { asset: "WTI 유가", support: `$${(oilClose - 3).toFixed(1)}`, resistance: `$${(oilClose + 3).toFixed(1)}`, note: oilCtx } : null,
  ].filter(Boolean);

  // --- 카드뉴스 ---
  const cards = [
    {
      emoji: sentiment === "bullish" ? "📈" : sentiment === "bearish" ? "📉" : "⚖️",
      title: "오늘 국내증시 전망",
      body: `나스닥 ${pctStr(nqPct)}(${nqMag}), 거시신호 ${macro.score >= 0 ? "+" : ""}${macro.score}. ${sentiment === "bullish" ? `강세 출발 기대 — ${goods.length ? goods.join("·") + " 우호" : "매크로 우호 환경"}` : sentiment === "bearish" ? `약세 경계 — ${bads.length ? bads.join("·") + " 부담" : "매크로 부담"}` : "혼조 종목 장세 — 선별 접근"}.`,
    },
    {
      emoji: "🛢️",
      title: "유가 → 금리 → 기술주 연결고리",
      body: `WTI ${oilClose ? "$" + oilClose.toFixed(1) : ""} ${dirWord(oil?.chgPct)}. ${oilCtx}. ${(oil?.chgPct ?? 0) > 0.5 ? "유가 상승 → 인플레 기대 자극 → 금리 상승 압력 → 고밸류 기술주 부담." : (oil?.chgPct ?? 0) < -0.5 ? "유가 하락 → 인플레 완화 → 금리 하락 우호 → 성장주 밸류 개선." : "유가 보합 — 에너지·금리 경로 영향 제한적."}`,
    },
    {
      emoji: "💱",
      title: "달러·환율 → 외국인 수급",
      body: `원/달러 ${fxCtx}. ${(fx?.chgPct ?? 0) > 0.3 ? "원화 약세 → 외국인 순매도 압력 확대, 대형주·지수 부담." : (fx?.chgPct ?? 0) < -0.3 ? "원화 강세 → 외국인 순매수 복귀 신호, 반도체·지수 우호." : "환율 보합 — 외국인 수급 방향 추가 확인 필요."}`,
    },
    {
      emoji: "💡",
      title: "오늘의 전략",
      body: strategy.dayTrading.length > 110 ? strategy.dayTrading.slice(0, 110) + "…" : strategy.dayTrading,
    },
    {
      emoji: "🎯",
      title: "주목 섹터",
      body: `${sentiment !== "bearish" ? "반도체·AI·방산 등 주도 성장 섹터 주목." : "방어주·통신·금융 등 안정 섹터 중심."} ${y10Close ? `금리 ${y10Close.toFixed(2)}%, ` : ""}${fxClose ? `환율 ${fxClose.toLocaleString("ko-KR", { maximumFractionDigits: 0 })}원 환경에서 ` : ""}신고가·정배열 종목 위주 선별 접근 권고.`,
    },
  ];

  // --- 섹터 템플릿 ---
  const sectorsUp = [
    { name: "반도체", bias: "up", reason: `나스닥 ${pctStr(nqPct)} 동조화 — 미 SOX 강세가 국내 반도체에 직결. HBM·AI 서버 수요 구조적 강세 기조 유지.`, stocks: [{ name: "삼성전자", reason: "외국인 수급 바로미터, HBM3·파운드리 수주 모멘텀." }, { name: "SK하이닉스", reason: "HBM 시장 점유율 1위, AI 메모리 단가 상승 직접 수혜." }, { name: "한미반도체", reason: "HBM 본더 장비 독점 공급, 수주 잔고 증가 추세." }] },
    { name: "AI·인터넷", bias: "up", reason: `미 빅테크·AI 강세 동조. 클라우드·온디바이스 AI 투자 확대로 국내 AI 플랫폼 밸류 재평가.`, stocks: [{ name: "NAVER", reason: "HyperCLOVA 기반 AI 서비스 확장, B2B AI 수주 가시성." }, { name: "카카오", reason: "AI 모델 상용화·광고 플랫폼 회복 기대." }] },
    { name: "방산·우주", bias: "up", reason: "지정학 리스크 구조화·NATO 방산 수요 확대. 유럽향 수출 계약 가시화로 멀티플 재평가 진행 중.", stocks: [{ name: "한화에어로스페이스", reason: "K9 자주포·천무 수출 대표주, 수주 잔고 최대치." }, { name: "현대로템", reason: "K2 전차 폴란드 수출, 방산 매출 고성장." }, { name: "한국항공우주", reason: "FA-50 수출 다변화·우주 사업 확장." }] },
    { name: "전력기기·원전", bias: "up", reason: `AI 데이터센터 전력 수요 급증 + 에너지 전환 투자 확대. ${y10Close && y10Close < 4.3 ? "금리 하향 안정 시 인프라 투자 우호." : "금리 부담 속에도 수주 모멘텀 유지."}`, stocks: [{ name: "HD현대일렉트릭", reason: "변압기 수주 급증, 미국·중동 전력 인프라 수혜." }, { name: "두산에너빌리티", reason: "원전 르네상스·SMR 수주 기대주." }, { name: "LS ELECTRIC", reason: "국내외 전력기기 수주 증가, 배전반·변압기 호조." }] },
  ];
  const sectorsDef = [
    { name: "방어주·통신", bias: "up", reason: "위험회피 국면 — 고배당·안정적 현금흐름 방어주 상대 강세 기대.", stocks: [{ name: "KT", reason: "고배당·통신 경기방어, AI 인프라 수익화 기대." }, { name: "SK텔레콤", reason: "안정적 현금흐름, AI 사업 다각화." }] },
    { name: "금융", bias: fxClose && fxClose >= 1380 ? "up" : "neutral", reason: `${fxClose && fxClose >= 1380 ? "고환율 구간 달러 자산 비중 높은 금융지주 수혜 가능." : "금리 안정 구간 이자이익 유지."} 배당 매력 부각.`, stocks: [{ name: "KB금융", reason: "대표 금융지주, 주주환원 정책 강화." }, { name: "신한지주", reason: "고배당·안정 실적, 하방 방어력 우수." }] },
    { name: "정유·에너지", bias: (oil?.chgPct ?? 0) > 0.5 ? "up" : "neutral", reason: `WTI ${oilCtx}. ${(oil?.chgPct ?? 0) > 0 ? "유가 상승 시 정제마진 개선 기대." : "유가 보합, 수익성 유지 수준."}`, stocks: [{ name: "S-Oil", reason: "정제마진·유가 민감주 대표." }, { name: "GS", reason: "에너지·유통 사업 비중, 배당 안정." }] },
    { name: "음식료·필수소비", bias: "up", reason: "경기 침체 우려 국면 필수소비 상대 강세. 원화 약세 수출 식품주 수혜 가능.", stocks: [{ name: "CJ제일제당", reason: "글로벌 HMR 수출, 필수소비 대표주." }, { name: "오리온", reason: "중국·동남아 소비재 안정 실적." }] },
  ];

  // --- 상세 분석 본문 (6단락, 전문가 수준) ---
  const detail = [
    `[거시 신호 종합 분석]\n나스닥·S&P500·원/달러·미 10년물·유가 5개 지표 가중 합산 거시신호 점수: ${macro.score >= 0 ? "+" : ""}${macro.score}(범위 ±3). ${sentiment === "bullish" ? "우호 환경으로 강세 출발이 기대됩니다." : sentiment === "bearish" ? "거시 부담이 누적된 약세 구간입니다." : "혼조 신호로 종목 장세·차별화 국면입니다."} 우호 요인: ${goods.length ? goods.join("·") : "없음"}. 부담 요인: ${bads.length ? bads.join("·") : "없음"}.`,

    `[거시 연결고리 인과 분석]\n유가(${oilCtx})는 에너지 비용·인플레 기대 경로로 미 금리에 ${(oil?.chgPct ?? 0) > 0 ? "상승" : "하락"} 압력으로 작용합니다. 달러인덱스 ${dirWord(dxy?.chgPct)}는 신흥국 자본 흐름을 통해 원화에 영향을 주며, 현재 ${fxCtx}. 미 10년물(${y10Ctx})은 성장주 할인율을 통해 나스닥 기술주 밸류에이션을 직접 좌우합니다.`,

    `[나스닥 기술적 분석]\n간밤 나스닥 ${pctStr(nqPct)}(${nqMag}) 마감${sp ? `, S&P500 ${pctStr(spPct)}` : ""}. ${y10Close ? `금리 ${y10Ctx}와 ` : ""}${oilClose ? `유가 ${oilCtx}의 ` : ""}조합이 기술주 밸류에이션을 ${(y10?.chgPct ?? 0) > 0 ? "압박했습니다" : (y10?.chgPct ?? 0) < 0 ? "지지했습니다" : "중립적으로 유지했습니다"}. 나스닥 ${nqAbs >= 1 ? "1% 이상 변동은 국내 반도체 ETF에 1.5~2배 동조 효과를 기대할 수 있습니다" : "변동이 제한적이어서 국내 영향도 소폭에 머물 가능성이 높습니다"}.`,

    `[국내증시 시나리오]\n오늘 코스피는 ${sentiment === "bullish" ? "강세 출발 후 전반 상승 흐름이 기대됩니다. 반도체·AI 섹터를 중심으로 코스닥도 동반 강세 가능성 있습니다." : sentiment === "bearish" ? "갭하락 출발 후 방어주 중심 종목 장세로 압축될 가능성이 높습니다. 외국인 매도세와 환율 부담이 동반될 수 있습니다." : "혼조 속 섹터별 차별화 장세가 예상됩니다."} ${fxClose ? `원/달러 ${fxClose.toLocaleString("ko-KR", { maximumFractionDigits: 0 })}원은 외국인 수급에 ${fxClose >= 1400 ? "부담 요인으로 작용하며 지수 상단이 제한될 수 있습니다" : fxClose <= 1370 ? "우호적으로 작용해 외국인 순매수가 지속될 수 있습니다" : "중립적 수준입니다"}.` : ""}`,

    `[섹터 로테이션 전략]\n${strategy.sectorRotation} 개별 종목에서는 신고가 돌파·정배열·거래대금 급증 세 가지 조건을 동시에 충족하는 종목 위주의 선별적 접근이 수익률을 극대화합니다.`,

    `[리스크 요인 및 대응]\n${riskFactors.map(r => `• ${r.trigger}(${r.probability === "high" ? "고위험" : r.probability === "mid" ? "중위험" : "저위험"}): ${r.impact}`).join("\n")} 포트폴리오 손절선(매수가 -5~7%)을 명확히 설정하고, 다중 악재 발생 시 현금 비중 확대를 권고합니다.`,

    `[글로벌 이슈 모니터링]\n전쟁·지정학 리스크(유가·안전자산 경로), 미 연준 통화정책(금리·달러 경로), 미-중 반도체 수출 규제(IT·장비주 직접 영향) 등 국제 이슈가 국내 증시에 직접 영향을 줍니다. 특히 주요 경제지표(CPI·고용·연준 발언) 발표 전후 단기 변동성 확대에 대비해야 합니다.\n\n※ 룰 기반 자동 분석(전일 거시지표 기준). ANTHROPIC_API_KEY 설정 시 실시간 뉴스·이벤트 반영 AI 분석으로 전환됩니다.`,
  ].join("\n\n");

  return {
    macroScore: macro.score,
    signals: macro.signals,
    title,
    sentiment,
    summary,
    chain,
    nasdaq,
    domestic,
    sectors: sentiment !== "bearish" ? sectorsUp : sectorsDef,
    globalIssues: [
      { category: "지정학", title: "전쟁·지정학 리스크 모니터링", detail: "중동·우크라이나 분쟁 지속 시 유가 급등·안전자산 선호 → 달러 강세·원화 약세 경로로 국내 증시에 부담." },
      { category: "통화정책", title: "미 연준 금리 경로", detail: `미 10년물 ${y10Ctx}. 연준 발언·CPI 결과에 따라 금리 방향 급변 가능, 나스닥·코스닥 성장주 민감도 높음.` },
      { category: "무역·규제", title: "미-중 반도체 수출규제", detail: "반도체 장비·AI칩 수출 제한 강화 시 국내 반도체·장비주에 직접 영향. 수혜(장비 국산화)·피해(수출 제한) 종목 구분 필요." },
    ],
    riskFactors,
    strategy,
    keyLevels,
    weeklyCalendar: macroWatch(indicators, refDate),
    todayIssues: [
      { category: "나스닥 동조", title: `나스닥 ${pctStr(nqPct)} 국내 반도체 동조 여부`, detail: `나스닥 1% → 국내 반도체지수 약 1.5~2% 연동. 시가 방향 확인이 당일 전략의 출발점.` },
      fxClose ? { category: "환율", title: `원/달러 ${fxCtx.split("—")[0].trim()}`, detail: `${fxCtx}. 외국인 순매수/매도 방향의 핵심 선행 지표.` } : null,
      y10Close ? { category: "금리", title: `미 10년물 ${y10Ctx.split("—")[0].trim()}`, detail: `${y10Ctx}. 성장주·2차전지·코스닥 민감 변수.` } : null,
    ].filter(Boolean),
    cards,
    detail,
  };
}

export const sentToSign = s => s === "bullish" ? 1 : s === "bearish" ? -1 : 0;
