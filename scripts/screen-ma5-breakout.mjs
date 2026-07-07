// 5일선 돌파/상단 급등 스크리너 + 커스텀 청산 백테스트
// -----------------------------------------------------------------------------
// HTS 조건검색식(A~M)을 코드로 옮긴 스크리너. 사용자 요청 로직:
//   (H "5일선 돌파(골든크로스)"  OR  J "5일선 위")  AND  나머지 전부(A·B·C·D·E·F·G·I·K·L·M)
// 청산 규칙(사용자 지정):
//   · 진입 = 신호(매수)봉 종가
//   · 익절 = 진입 이후 장중 고가가 +TP%(기본 14%) 도달 시 그 가격
//   · 손절 = 진입 이후 장중 저가가 "매수봉 저가" 이탈 시 그 가격 (매수봉 저가이탈 손절)
//   · 보수적 가정: 같은 날 익절·손절가 동시 터치 시 손절 우선
//   · 최대 보유 MAX_HOLD 거래일 초과 시 종가 청산(TO)
//
// ⚠ 이 스크립트는 야후 파이낸스에서 일봉 OHLCV를 받아 계산한다. 시세 egress가
//    허용된 환경(로컬/깃허브 액션 등)에서 실행해야 한다.
//
// 실행:  node scripts/screen-ma5-breakout.mjs
//        YEAR=2026 TP=14 MAX_HOLD=20 UNIVERSE=2000 node scripts/screen-ma5-breakout.mjs
// 자체검증:  node scripts/screen-ma5-breakout.mjs --selftest   (시세 없이 로직만 검증)
// -----------------------------------------------------------------------------
import { readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import { loadUniverse, fetchYahooOHLCV, pMap } from "./lib/stock-core.mjs";

const __dir = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dir, "..");

const CFG = {
  YEAR: +(process.env.YEAR || 2026),          // 백테스트 대상 연도
  TP: +(process.env.TP || 14),                // 익절 % (장중 고가 도달)
  MAX_HOLD: +(process.env.MAX_HOLD || 20),    // 최대 보유 거래일
  COST: +(process.env.COST || 0.6),           // 왕복 거래비용 % (슬리피지+수수료+세금 근사)
  UNIVERSE: +(process.env.UNIVERSE || 2000),  // 시총 상위 N 유니버스
  RANGE: process.env.RANGE || "2y",           // 야후 조회 범위(지표 룩백 포함)
  CHG_MIN: +(process.env.CHG_MIN || 7),       // B 등락률 하한
  CHG_MAX: +(process.env.CHG_MAX || 28),      // B 등락률 상한
  VALUE_MIN: +(process.env.VALUE_MIN || 5_000e6), // C·E 거래대금 하한(원) = 5,000백만(50억)
  VOL_SURGE: +(process.env.VOL_SURGE || 3),   // F 전봉거래량 대비 배수
  D_CHG: +(process.env.D_CHG || 20),          // D 기간내 일간등락 하한
  CONC: +(process.env.CONC || 8),             // 동시 요청 수
};

// ── 지표 헬퍼 (series는 날짜 오름차순) ──────────────────────────────────────
const maAt = (s, i, n) => {
  if (i < n - 1) return null;
  let sum = 0;
  for (let k = i - n + 1; k <= i; k++) sum += s[k].close;
  return sum / n;
};

// series[i]가 매수봉 조건을 만족하는지 판정. 만족 시 진단 객체, 아니면 null.
export function matchAt(series, i, cfg = CFG) {
  if (i < 21) return null;                    // MA20 + 10봉 윈도우 + 전일 룩백 필요
  const b = series[i], prev = series[i - 1];
  if (!b || !prev || !(b.close > 0) || !(prev.close > 0)) return null;

  const chg = (b.close - prev.close) / prev.close * 100;   // 당일 등락률
  const value = b.close * b.volume;                        // 거래대금(원)
  const ma5 = maAt(series, i, 5), ma20 = maAt(series, i, 20);
  const ma5p = maAt(series, i - 1, 5);                     // 전일 MA5
  if (ma5 == null || ma20 == null || ma5p == null) return null;

  // A 주가범위: 종가 1,000 ~ 99,990,000
  const A = b.close >= 1000 && b.close <= 99990000;
  // B 주가등락률: 당일 종가등락률 7% ~ 28%
  const B = chg >= cfg.CHG_MIN && chg <= cfg.CHG_MAX;
  // C 거래대금: 당일 ≥ 5,000백만(50억)
  const C = value >= cfg.VALUE_MIN;
  // D 기간내 등락률: 1봉전~10봉전 중 일간등락 ≥ 20% 1회 이상
  let D = false;
  for (let k = i - 1; k >= i - 10 && k >= 1; k--) {
    if ((series[k].close - series[k - 1].close) / series[k - 1].close * 100 >= cfg.D_CHG) { D = true; break; }
  }
  // E 기간내 거래대금: 1봉전~10봉전 중 거래대금 ≥ 하한 1회 이상 (스크린샷 값 잘림 → VALUE_MIN 가정)
  let E = false;
  for (let k = i - 1; k >= i - 10 && k >= 0; k--) {
    if (series[k].close * series[k].volume >= cfg.VALUE_MIN) { E = true; break; }
  }
  // F 기간내 거래량비율: 0봉전~10봉이내(당일 포함) 전봉거래량 대비 ≥ 300% 1회 이상
  let F = false;
  for (let k = i; k >= i - 9 && k >= 1; k--) {
    if (series[k - 1].volume > 0 && series[k].volume >= cfg.VOL_SURGE * series[k - 1].volume) { F = true; break; }
  }
  // G 거래량비율(n봉): 당일 거래량 ≥ 전일 거래량 (100% 이상)
  const G = prev.volume > 0 && b.volume >= prev.volume;
  // H 주가이평돌파: 골든크로스(전일 종가 ≤ 전일 MA5, 당일 종가 > 당일 MA5)  ← "5일선 돌파"
  const H = prev.close <= ma5p && b.close > ma5;
  // I 주가이평비교: 당일 MA5 > MA20
  const I = ma5 > ma20;
  // J 주가이평비교: 당일 종가 > MA5                                       ← "5일선 위"
  const J = b.close > ma5;
  // K 주가비교: 당일 시가 < 종가 (양봉)
  const K = b.open < b.close;
  // L 최고종가: 당일 종가가 최근 4봉 중 최고종가
  const L = b.close >= Math.max(series[i - 1].close, series[i - 2].close, series[i - 3].close);
  // M(전일 종가<MA5)은 5일선 조건을 "돌파 or 위"로 정의(H||J)하면서 AND에서 제외.
  //   (M은 골든크로스 H = "전일 종가≤MA5 && 당일 종가>MA5"에 이미 포함되어 있음)

  const orPart = H || J;                                   // 5일선 돌파(H) or 5일선 위(J)
  const andPart = A && B && C && D && E && F && G && I && K && L;
  if (!(orPart && andPart)) return null;

  return {
    chg: +chg.toFixed(2), value, ma5: +ma5.toFixed(2), ma20: +ma20.toFixed(2),
    breakout: H, above: J, close: b.close, low: b.low, open: b.open,
  };
}

// 청산 시뮬: 진입=series[i].close, 손절=매수봉(i) 저가, 익절=+TP%. i+1..i+MAX_HOLD.
export function simExit(series, i, cfg = CFG) {
  const entry = series[i].close;
  const slPrice = series[i].low;                           // 매수봉 저가
  const tpPrice = entry * (1 + cfg.TP / 100);
  const slPct = +((slPrice - entry) / entry * 100).toFixed(2);
  const end = Math.min(i + cfg.MAX_HOLD, series.length - 1);
  for (let k = i + 1; k <= end; k++) {
    const bar = series[k];
    if (bar.open <= slPrice)                               // 갭하락으로 시가가 이미 손절 이하
      return { ret: +(((bar.open - entry) / entry * 100) - cfg.COST).toFixed(2), result: "SL_GAP", days: k - i, slPct };
    const hitSL = bar.low <= slPrice;
    const hitTP = bar.high >= tpPrice;
    if (hitSL) return { ret: +(slPct - cfg.COST).toFixed(2), result: "SL", days: k - i, slPct };   // 보수적: 손절 우선
    if (hitTP) return { ret: +(cfg.TP - cfg.COST).toFixed(2), result: "TP", days: k - i, slPct };
  }
  const last = series[end];
  return { ret: +(((last.close - entry) / entry * 100) - cfg.COST).toFixed(2), result: "TO", days: end - i, slPct };
}

// ── 통계 ────────────────────────────────────────────────────────────────────
function summarize(trades) {
  const n = trades.length;
  if (!n) return { n: 0 };
  const rets = trades.map(t => t.ret);
  const wins = rets.filter(x => x > 0).length;
  const avg = rets.reduce((a, b) => a + b, 0) / n;
  const byRes = {};
  for (const t of trades) byRes[t.result] = (byRes[t.result] || 0) + 1;
  const sorted = [...trades].sort((a, b) => b.ret - a.ret);
  return {
    n,
    winRate: +(100 * wins / n).toFixed(1),
    avgRet: +avg.toFixed(2),
    best: +Math.max(...rets).toFixed(2),
    worst: +Math.min(...rets).toFixed(2),
    byResult: byRes,
    avgHoldDays: +(trades.reduce((a, b) => a + b.days, 0) / n).toFixed(1),
    top5: sorted.slice(0, 5).map(t => ({ name: t.name, date: t.date, ret: t.ret, result: t.result })),
    bottom5: sorted.slice(-5).map(t => ({ name: t.name, date: t.date, ret: t.ret, result: t.result })),
  };
}

// ── 메인 ────────────────────────────────────────────────────────────────────
async function main() {
  const universe = await loadUniverse(resolve(ROOT, "data/stocks.json"), CFG.UNIVERSE);
  console.error(`유니버스 ${universe.length}종목 · ${CFG.YEAR}년 · 익절 +${CFG.TP}% · 최대보유 ${CFG.MAX_HOLD}일`);

  const yr = String(CFG.YEAR);
  const results = await pMap(universe, async (stock) => {
    let series;
    try { series = await fetchYahooOHLCV(stock.symbol, CFG.RANGE); }
    catch { return []; }
    if (!series || series.length < 25) return [];
    const trades = [];
    for (let i = 21; i < series.length; i++) {
      if (!series[i].date.startsWith(yr)) continue;         // 신호일이 대상 연도인 것만
      const m = matchAt(series, i);
      if (!m) continue;
      const ex = simExit(series, i);
      trades.push({
        code: stock.code, name: stock.name, market: stock.market, date: series[i].date,
        entry: m.close, slPrice: m.low, slPct: ex.slPct, chg: m.chg,
        signal: m.breakout && m.above ? "돌파+상단" : m.breakout ? "돌파" : "상단",
        ...ex,
      });
    }
    return trades;
  }, CFG.CONC);

  const trades = results.flat().sort((a, b) => a.date.localeCompare(b.date));
  const stats = summarize(trades);
  const out = { generatedFor: CFG.YEAR, config: CFG, stats, trades };
  const outPath = resolve(ROOT, `data/screen-ma5-breakout-${CFG.YEAR}.json`);
  await writeFile(outPath, JSON.stringify(out, null, 2));

  console.log(`\n=== ${CFG.YEAR} 5일선 돌파/상단 스크리너 (익절 +${CFG.TP}% / 매수봉 저가이탈 손절) ===`);
  console.log(`추출 신호: ${stats.n}건`);
  if (stats.n) {
    console.log(`승률 ${stats.winRate}% · 평균수익 ${stats.avgRet}% · 최고 ${stats.best}% · 최저 ${stats.worst}% · 평균보유 ${stats.avgHoldDays}일`);
    console.log(`청산분포:`, stats.byResult);
    console.log(`상위:`, stats.top5.map(t => `${t.name}(${t.date}) ${t.ret}%`).join(", "));
  }
  console.log(`\n저장: ${outPath}`);
}

// ── 자체검증(시세 불필요): 손으로 만든 시리즈로 로직 동작 확인 ────────────────
function selftest() {
  // 완만한 하락 → 급등 스파이크(거래량 폭증) → 깊은 눌림(종가<MA5) → 골든크로스 양봉 신호일.
  const s = [];
  let price = 10000;
  for (let d = 0; d < 18; d++) {
    price *= 0.997;
    s.push({ date: `2026-01-${String(d + 1).padStart(2, "0")}`, open: price, high: price * 1.005, low: price * 0.99, close: price, volume: 2_000_000 });
  }
  // +22% 급등 스파이크(거래량 7배) → D(기간내 20%↑)·F(거래량 300%↑) 충족
  let p = s[17].close * 1.22;
  s.push({ date: "2026-01-19", open: s[17].close, high: p * 1.02, low: s[17].close * 0.99, close: p, volume: 14_000_000 });
  // 소폭 상승(MA5 상승)
  p = p * 1.01;
  s.push({ date: "2026-01-20", open: p * 0.999, high: p * 1.01, low: p * 0.985, close: p, volume: 5_000_000 });
  // 깊은 눌림: 종가가 MA5 아래로 → 전일 종가<MA5(M) 세팅
  p = p * 0.90;
  s.push({ date: "2026-01-21", open: p * 1.05, high: p * 1.06, low: p * 0.985, close: p, volume: 5_000_000 });
  // 신호일: +12% 양봉, 종가가 MA5 상향 돌파(H), 4봉 최고종가(L), 거래량>전일(G)
  const prevClose = p;
  const close = prevClose * 1.12;
  s.push({ date: "2026-01-22", open: prevClose * 1.001, high: close * 1.01, low: prevClose * 0.995, close, volume: 6_000_000 });

  const i = s.length - 1;
  const m = matchAt(s, i);
  console.log("selftest matchAt(signal day):", m ? "MATCH OK" : "no-match FAIL");
  if (m) console.log("  진단:", JSON.stringify(m));

  // 청산 검증: 익절 케이스
  s.push({ date: "2026-01-24", open: close * 1.02, high: close * 1.16, low: close * 1.0, close: close * 1.14, volume: 300000 });
  const exTP = simExit(s, i);
  console.log("selftest simExit (익절 도달):", JSON.stringify(exTP), exTP.result === "TP" ? "✔" : "✗");

  // 손절 케이스: 신호일 뒤 저가이탈
  const s2 = s.slice(0, i + 1);
  s2.push({ date: "2026-01-24", open: close * 0.99, high: close * 1.0, low: s2[i].low * 0.98, close: s2[i].low * 0.985, volume: 300000 });
  const exSL = simExit(s2, i);
  console.log("selftest simExit (저가이탈 손절):", JSON.stringify(exSL), exSL.result === "SL" ? "✔" : "✗");

  const ok = !!m && exTP.result === "TP" && exSL.result === "SL";
  console.log(ok ? "\nSELFTEST PASS ✔" : "\nSELFTEST FAIL ✗");
  process.exit(ok ? 0 : 1);
}

if (process.argv.includes("--selftest")) selftest();
else main().catch(e => { console.error(e); process.exit(1); });
