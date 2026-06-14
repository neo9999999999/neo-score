// 종목 주가 수집 + 익일 상승 스코어링 공용 로직 (Yahoo Finance)
import { readFile } from "node:fs/promises";
import { fetchWithTimeout } from "./report-core.mjs";

// stocks.json(시총 내림차순)에서 상위 N개 유니버스 로드
export async function loadUniverse(stocksPath, limit = 500) {
  const data = JSON.parse(await readFile(stocksPath, "utf8"));
  const list = (data.stocks || []).slice(0, limit).map(s => ({
    code: s.code, name: s.name, market: s.market,
    symbol: s.code + (s.market === "KOSDAQ" ? ".KQ" : ".KS"),
  }));
  return list;
}

// Yahoo 차트 → [{date,open,high,low,close,volume}] (오름차순)
export function parseYahooOHLCV(json) {
  const res = json?.chart?.result?.[0];
  if (!res || !Array.isArray(res.timestamp)) return [];
  const ts = res.timestamp;
  const q = res.indicators?.quote?.[0] || {};
  const out = [];
  for (let i = 0; i < ts.length; i++) {
    const o = q.open?.[i], h = q.high?.[i], l = q.low?.[i], c = q.close?.[i], v = q.volume?.[i];
    if (c == null || !isFinite(c)) continue;
    out.push({
      date: new Date(ts[i] * 1000).toISOString().slice(0, 10),
      open: +o, high: +h, low: +l, close: +c, volume: +(v || 0),
    });
  }
  const map = new Map(out.map(r => [r.date, r]));
  return [...map.values()].sort((a, b) => a.date.localeCompare(b.date));
}

export async function fetchYahooOHLCV(symbol, range = "3mo") {
  const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(symbol)}?range=${range}&interval=1d`;
  let lastErr;
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const r = await fetchWithTimeout(url, { headers: { "User-Agent": "Mozilla/5.0 (compatible; neo-score/1.0)" } }, 25000);
      if (r.status === 429) { await new Promise(z => setTimeout(z, 800 + Math.random() * 600)); lastErr = new Error("429"); continue; }
      if (!r.ok) throw new Error("HTTP " + r.status);
      return parseYahooOHLCV(await r.json());
    } catch (e) { lastErr = e; await new Promise(z => setTimeout(z, 300)); }
  }
  throw lastErr || new Error("fetch failed");
}

// 동시성 제한 실행
export async function pMap(items, worker, concurrency = 8) {
  const ret = new Array(items.length);
  let idx = 0;
  async function run() {
    while (idx < items.length) {
      const i = idx++;
      try { ret[i] = await worker(items[i], i); } catch (e) { ret[i] = null; }
    }
  }
  await Promise.all(Array.from({ length: Math.min(concurrency, items.length) }, run));
  return ret;
}

const clamp01 = (x, lo, hi) => Math.max(0, Math.min(1, (x - lo) / (hi - lo)));

// 시리즈의 index i(해당 거래일)에 대한 익일상승 스코어. macroBias: 시장 보정(-1~1)
export function scoreAt(series, i, macroBias = 0) {
  if (i < 20 || i >= series.length) return null;
  const bar = series[i], prev = series[i - 1];
  if (!bar || !prev || !isFinite(bar.close) || !isFinite(prev.close) || bar.close <= 0) return null;
  const changePct = (bar.close - prev.close) / prev.close * 100;
  const rng = (bar.high - bar.low);
  const rangePos = rng > 0 ? (bar.close - bar.low) / rng : 0.5; // 종가 위치 (고가권=1)
  const gapPct = prev.close > 0 ? (bar.open - prev.close) / prev.close * 100 : 0;
  let vSum = 0; for (let k = i - 20; k < i; k++) vSum += series[k].volume || 0;
  const vol20 = vSum / 20;
  const volSurge = vol20 > 0 ? bar.volume / vol20 : 1;
  let c5 = 0; for (let k = i - 4; k <= i; k++) c5 += series[k].close; const ma5 = c5 / 5;
  let c20 = 0; for (let k = i - 19; k <= i; k++) c20 += series[k].close; const ma20 = c20 / 20;
  const aboveMA = bar.close > ma5 && ma5 > ma20;
  const value = bar.close * bar.volume; // 거래대금(원)

  // 익일 연속성 스코어 (0~100)
  let score =
    34 * rangePos +
    24 * clamp01(volSurge, 1, 3) +
    18 * clamp01(changePct, 0, 10) +
    12 * (aboveMA ? 1 : 0) +
    8 * clamp01(gapPct, 0, 3);
  // 과열(상한가 근처) 페널티 — 익일 갭 실패 위험
  if (changePct >= 20) score -= (changePct - 20) * 1.2;
  // 시장 보정
  score += macroBias * 6;
  score = Math.max(0, Math.round(score * 10) / 10);

  return { changePct: +changePct.toFixed(2), rangePos: +rangePos.toFixed(2), gapPct: +gapPct.toFixed(2), volSurge: +volSurge.toFixed(2), aboveMA, value, ma5, ma20, score };
}

// 후보 채택 조건
export function isCandidate(m) {
  return m && m.changePct > 0.5 && m.rangePos >= 0.55 && m.volSurge >= 1.2;
}

export function pickReason(m, name) {
  const parts = [];
  parts.push(`종가 ${m.rangePos >= 0.8 ? "고가권" : "상단"} 마감(강도 ${Math.round(m.rangePos * 100)}%)`);
  if (m.volSurge >= 1.5) parts.push(`거래량 평소 ${m.volSurge.toFixed(1)}배`);
  parts.push(`${m.changePct >= 0 ? "+" : ""}${m.changePct}%`);
  if (m.aboveMA) parts.push("5·20일선 정배열");
  return parts.join(" · ") + " — 익일 연속 상승 기대.";
}

export function fmtEok(won) {
  const eok = won / 1e8;
  if (eok >= 10000) return (eok / 10000).toFixed(2) + "조";
  return Math.round(eok).toLocaleString("ko-KR") + "억";
}

// 익일 청산 시뮬레이터. nb={o,h,l,c} = 당일 종가 대비 익일 시/고/저/종가(%).
// 보수적 가정: 손절가가 장중에 닿으면 익절보다 먼저 체결됐다고 본다(하한 추정).
// 룰: tp1Frac 만큼 +tp1Lvl%에서 익절, 잔량은 +floorLvl% 도달 후 그 아래로 빠지면 청산,
//     +15%↑에서는 고가−trailGap% 트레일링. +tp1Lvl% 미도달이면 잔여 전량 종가 청산.
export function simExit(nb, opt = {}) {
  const { tp1Lvl = 5, tp1Frac = 0.5, trailGap = 5, floorLvl = 10, trailFrom = 15, stop = null, gapStop = null, runnerAtClose = false, cost = 0 } = opt;
  const { o, h, l, c } = nb;
  let gross;
  if (gapStop != null && o != null && o <= gapStop) gross = o;
  else if (stop != null && o <= stop) gross = o;
  else if (stop != null && l <= stop) gross = stop;
  else if (h < tp1Lvl) gross = c;
  else {
    let runner;
    if (runnerAtClose) runner = c;                 // 현실: 고점 트레일 가정 없이 종가 청산
    else if (h < floorLvl) runner = c;
    else if (h < trailFrom) runner = (c < floorLvl ? floorLvl : c);
    else runner = (c < h - trailGap ? h - trailGap : c);
    gross = tp1Frac * tp1Lvl + (1 - tp1Frac) * runner;
  }
  return +(gross - cost).toFixed(3);                // 왕복 거래비용 차감
}

// 여러 전략 성과 비교 (picks: [{o,h,l,c}])
export function runStrategyGrid(picks) {
  const strategies = [
    { name: "원안: 5%익절50%+트레일, 손절無", opt: { tp1Lvl: 5, tp1Frac: 0.5, stop: null } },
    { name: "권장: 원안 + 갭하락 −7%만 손절", opt: { tp1Lvl: 5, tp1Frac: 0.5, gapStop: -7 } },
    { name: "원안 + 갭하락 −5%만 손절", opt: { tp1Lvl: 5, tp1Frac: 0.5, gapStop: -5 } },
    { name: "원안 + 손절 −3%(장중)", opt: { tp1Lvl: 5, tp1Frac: 0.5, stop: -3 } },
    { name: "원안 + 손절 −5%(장중)", opt: { tp1Lvl: 5, tp1Frac: 0.5, stop: -5 } },
    { name: "익절 30%@+7% + 트레일 + 갭하락 −7%", opt: { tp1Lvl: 7, tp1Frac: 0.3, gapStop: -7 } },
    { name: "무익절 전량 고가−5% 트레일 + 갭하락 −7%", opt: { tp1Lvl: 5, tp1Frac: 0.0, gapStop: -7 } },
  ];
  const out = strategies.map(s => {
    const rets = picks.map(p => simExit(p, s.opt));
    const n = rets.length;
    const avg = +(rets.reduce((a, b) => a + b, 0) / n).toFixed(3);
    const win = +(100 * rets.filter(x => x > 0).length / n).toFixed(1);
    const loss = +(100 * rets.filter(x => x < 0).length / n).toFixed(1);
    const worst = +Math.min(...rets).toFixed(1);
    const best = +Math.max(...rets).toFixed(1);
    // 위험조정(평균/손실변동성 근사)
    const downs = rets.filter(x => x < 0);
    const dd = downs.length ? Math.sqrt(downs.reduce((a, b) => a + b * b, 0) / downs.length) : 0;
    const ret_risk = dd ? +(avg / dd).toFixed(3) : null;
    return { name: s.name, opt: s.opt, avg, winRate: win, lossRate: loss, worst, best, retRisk: ret_risk };
  });
  // 추천: 하방보호(손절/갭손절) 있는 전략 중 평균 최고 — 무손절은 꼬리위험(−17%↑) 때문에 제외
  const protectedS = out.filter(s => s.opt.stop != null || s.opt.gapStop != null);
  const pool = protectedS.length ? protectedS : out;
  const recommended = pool.reduce((a, b) => b.avg > a.avg ? b : a);
  return { strategies: out, recommended: recommended.name };
}

// OOS 히스토리(과거 선정 종목의 당일등락+익일등락)로 당일등락대별 보정표 생성
export function buildCalibration(reports) {
  const samples = [];
  for (const r of reports || []) for (const p of r.picks || []) {
    if (p.nextRet != null && p.changePct != null) samples.push({ chg: p.changePct, ret: p.nextRet, high: p.nextHigh ?? null });
  }
  const stat = (xs) => {
    if (!xs.length) return { n: 0, expRet: null, p3: null, p5: null, p3High: null, p5High: null, hitRate: null };
    const hs = xs.filter(s => s.high != null);
    return {
      n: xs.length,
      expRet: +(xs.reduce((a, b) => a + b.ret, 0) / xs.length).toFixed(2),
      p3: +((xs.filter(s => s.ret >= 3).length / xs.length) * 100).toFixed(1),
      p5: +((xs.filter(s => s.ret >= 5).length / xs.length) * 100).toFixed(1),
      p3High: hs.length ? +((hs.filter(s => s.high >= 3).length / hs.length) * 100).toFixed(1) : null,
      p5High: hs.length ? +((hs.filter(s => s.high >= 5).length / hs.length) * 100).toFixed(1) : null,
      hitRate: +((xs.filter(s => s.ret > 0).length / xs.length) * 100).toFixed(1),
    };
  };
  const edges = [0, 10, 15, 20, 100]; // 당일 등락률(%) 구간
  const buckets = [];
  for (let i = 0; i < edges.length - 1; i++) {
    const lo = edges[i], hi = edges[i + 1];
    buckets.push({ lo, hi, ...stat(samples.filter(s => s.chg >= lo && s.chg < hi)) });
  }
  return { buckets, all: stat(samples) };
}

// 당일 등락률 → 예상 익일등락/3%↑·5%↑ 확률(종가·고가) 추정 (표본 부족 시 전체 평균 폴백)
export function estimate(cal, changePct) {
  if (!cal) return null;
  const b = cal.buckets.find(x => changePct >= x.lo && changePct < x.hi);
  const src = (b && b.n >= 15) ? b : (cal.all && cal.all.n ? cal.all : null);
  if (!src) return null;
  return { expRet: src.expRet, p3: src.p3, p5: src.p5, p3High: src.p3High, p5High: src.p5High, hitRate: src.hitRate, n: src.n };
}

// 익일 대장주 후보 필터 — 강한 신호 + 당일 급등(상한가 제외: +27% 미만만 매수 가능)
export function isLeader(m) {
  return m && m.score >= 78 && m.changePct >= 15 && m.changePct < 27 && m.rangePos >= 0.55 && m.volSurge >= 1.3;
}

// TP/SL 청산 시뮬레이터 (현실적). nb={o,h,l,c}=당일 종가 대비 익일 시/고/저/종가(%).
// 진입=당일 종가. tp=익절선, sl=손절선(음수), tp1Frac=익절선에서 파는 비중(1=전량).
// 보수적: 익절·손절 동시 도달 시 손절 우선 가정. gapStop=시가 갭하락 청산선.
// 다일 보유 시뮬: 익절=장중 고가가 +tp% 도달 시 tp 매도, 손절=종가가 −sl% 이탈 시 그 종가 매도.
// fwdH/fwdC = 진입(당일 종가) 대비 이후 1..H일의 고가%/종가%. sl=null이면 무손절.
export function simHold(fwdH, fwdC, tp, sl, cost = 0) {
  const n = Math.min(fwdH.length, fwdC.length);
  for (let k = 0; k < n; k++) {
    if (fwdH[k] >= tp) return +(tp - cost).toFixed(3);          // 익절(고가)
    if (sl != null && fwdC[k] <= -sl) return +(fwdC[k] - cost).toFixed(3); // 손절(종가)
  }
  return +((n ? fwdC[n - 1] : 0) - cost).toFixed(3);            // 만기 종가 청산
}
export function simExitTPSL(nb, opt = {}) {
  const { tp = 5, sl = null, tp1Frac = 1, gapStop = null, cost = 0, order = "sl" } = opt;
  const { o, h, l, c } = nb;
  let gross;
  if (o != null && gapStop != null && o <= gapStop) gross = o;        // 갭하락 시가 청산
  else if (o != null && sl != null && o <= sl) gross = o;             // 갭이 손절 이하
  else {
    const hitTP = h != null && h >= tp;
    const hitSL = sl != null && l != null && l <= sl;
    const both = hitTP && hitSL;
    if (tp1Frac >= 1) {
      if (both) gross = order === "tp" ? tp : sl;
      else if (hitTP) gross = tp;
      else if (hitSL) gross = sl;
      else gross = c;
    } else {
      if (hitTP) {
        const rest = both ? (order === "tp" ? c : sl) : c;            // 익절 후 잔량
        gross = tp1Frac * tp + (1 - tp1Frac) * rest;
      } else gross = hitSL ? sl : c;                                   // 익절 미도달 → 손절 or 종가
    }
  }
  return +(gross - cost).toFixed(3);
}

// 수급(외국인/기관 순매수) 맵 — sector-api 당일 스캔에서 code → {supply,frgn,inst}
export async function fetchSupplyMap() {
  const urls = [
    "https://raw.githubusercontent.com/neo9999999999/sector-api/main/data/signals.json?_=" + Date.now(),
  ];
  for (const u of urls) {
    try {
      const r = await fetchWithTimeout(u, { headers: { "User-Agent": "neo-score/1.0" } }, 15000);
      if (!r.ok) continue;
      const arr = await r.json();
      const m = new Map();
      for (const s of (arr || [])) {
        if (!s.code) continue;
        m.set(String(s.code), { supply: s.supply || null, frgn: s.frgn ?? null, inst: s.inst ?? null });
      }
      return m;
    } catch { /* next */ }
  }
  return new Map();
}

// 수급 라벨/동반매수 판정
export function supplyInfo(sup) {
  if (!sup || (sup.frgn == null && sup.inst == null)) return { dongban: false, label: "수급 미확인", known: false };
  const f = sup.frgn ?? 0, i = sup.inst ?? 0;
  if (f > 0 && i > 0) return { dongban: true, label: "외+기 동반매수", known: true };
  if (f > 0) return { dongban: false, label: "외국인 순매수", known: true };
  if (i > 0) return { dongban: false, label: "기관 순매수", known: true };
  return { dongban: false, label: "외+기 순매도", known: true };
}


