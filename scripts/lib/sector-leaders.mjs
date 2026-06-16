// 전일(최근 거래일) 실거래 데이터로 섹터별 주도주를 선정한다.
// 아침 리포트는 장 시작 전(05:30 KST) 생성 → KR 최신 종가는 '전일'이므로 전일 기준 주도주가 된다.
import { loadStockMap } from "./report-core.mjs";
import { fetchYahooOHLCV, pMap, scoreAt, fmtEok } from "./stock-core.mjs";
import { SECTOR_MAP } from "./sector-map.mjs";

// 종목 강도: 익일연속성 스코어 + 정배열·신고가 보너스
function strengthOf(m) {
  return m.score + (m.aligned ? 8 : 0) + (m.nearHigh ? (m.breakout ? 10 : 5) : 0);
}

// 종목 한 줄 근거(실데이터)
function stockReason(m) {
  const parts = [`전일 ${m.changePct >= 0 ? "+" : ""}${m.changePct}%`, `거래대금 ${fmtEok(m.value)}`];
  if (m.nearHigh) parts.push(m.breakout ? "신고가 돌파" : "신고가 근접");
  if (m.aligned) parts.push("정배열");
  if (m.volSurge >= 2) parts.push(`거래량 ${m.volSurge.toFixed(1)}배`);
  return parts.join(" · ");
}

export async function buildSectorLeaders(stocksPath, { dateStr = null, topSectors = 4, perSector = 3 } = {}) {
  const nameMap = await loadStockMap(stocksPath); // name -> { code, market }
  const entries = [];
  for (const sec of SECTOR_MAP) {
    for (const nm of sec.stocks) {
      const info = nameMap.get(nm);
      if (!info) continue;
      entries.push({ sector: sec.name, name: nm, code: info.code, market: info.market, symbol: info.code + (info.market === "KOSDAQ" ? ".KQ" : ".KS") });
    }
  }
  if (!entries.length) return null;

  const rows = await pMap(entries, async (e) => {
    const series = await fetchYahooOHLCV(e.symbol, "1y");
    if (series.length < 25) return null;
    let i = series.length - 1;
    if (dateStr) { for (let k = series.length - 1; k >= 0; k--) { if (series[k].date <= dateStr) { i = k; break; } } }
    const m = scoreAt(series, i, 0);
    if (!m) return null;
    let aligned = false, nearHigh = false, breakout = false, nearHighPct = null;
    if (i >= 120) {
      const ma = (n) => { let s = 0; for (let k = i - n + 1; k <= i; k++) s += series[k].close; return s / n; };
      const c = series[i].close, ma5 = ma(5), ma20 = ma(20), ma60 = ma(60);
      aligned = c > ma5 && ma5 > ma20 && ma20 > ma60;
      let hiPrev = 0; for (let k = i - 119; k <= i - 1; k++) hiPrev = Math.max(hiPrev, series[k].high);
      if (hiPrev > 0) { nearHigh = c >= 0.95 * hiPrev; breakout = c > hiPrev; nearHighPct = +((c / hiPrev - 1) * 100).toFixed(2); }
    }
    return { ...e, date: series[i].date, price: Math.round(series[i].close), score: m.score, changePct: m.changePct, value: m.value, volSurge: m.volSurge, rangePos: m.rangePos, aboveMA: m.aboveMA, aligned, nearHigh, breakout, nearHighPct };
  }, 8);

  const valid = rows.filter(Boolean);
  if (!valid.length) return null;

  const bySector = new Map();
  for (const m of valid) { if (!bySector.has(m.sector)) bySector.set(m.sector, []); bySector.get(m.sector).push(m); }

  const sectors = [];
  for (const [name, arr] of bySector) {
    arr.sort((a, b) => strengthOf(b) - strengthOf(a));
    const top = arr.slice(0, perSector);
    // bias·평균은 '실제 표시하는 주도주(top)' 기준으로 계산 (약한 비주도 종목에 희석되지 않게)
    const meanChg = top.reduce((s, x) => s + x.changePct, 0) / top.length;
    const secStrength = top.reduce((s, x) => s + strengthOf(x), 0) / top.length;
    const strongCnt = top.filter(x => x.changePct > 0 && x.aboveMA).length;
    const bias = meanChg > 0.4 ? "up" : meanChg < -0.4 ? "down" : "neutral";
    sectors.push({ name, _rank: secStrength + strongCnt * 2, bias, meanChg: +meanChg.toFixed(2), strongCnt, total: top.length, top });
  }
  sectors.sort((a, b) => b._rank - a._rank);

  return sectors.slice(0, topSectors).map(s => ({
    name: s.name,
    bias: s.bias,
    reason: `전일 주도주 평균 ${s.meanChg >= 0 ? "+" : ""}${s.meanChg}% — 실거래 데이터(등락·거래대금·신고가·정배열) 기준 전일 상위 섹터.`,
    stocks: s.top.map(m => ({ name: m.name, code: m.code, market: m.market, reason: stockReason(m), changePct: m.changePct, value: m.value, breakout: m.breakout, nearHigh: m.nearHigh, aligned: m.aligned })),
    dataDriven: true,
  }));
}
