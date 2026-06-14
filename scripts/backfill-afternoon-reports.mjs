#!/usr/bin/env node
/**
 * 오후 익일예측 OOS 백필 + 분석
 *
 * 거래대금 상위 유니버스의 1년치 주가로, 과거 각 거래일마다 익일 상승 후보를
 * 스코어링·선정하고 실제 익일 등락으로 적중 여부를 검증한다.
 *
 * 산출물: public/afternoon-history.json (분석 + 일자별 선정/결과)
 *
 * 사용: node scripts/backfill-afternoon-reports.mjs 2026-01-01
 * 네트워크 필요(Yahoo).
 */

import { writeFile, readFile, mkdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { kstIso } from "./lib/report-core.mjs";
import { loadUniverse, fetchYahooOHLCV, pMap, scoreAt, isLeader, runStrategyGrid } from "./lib/stock-core.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const HIST = join(ROOT, "public", "afternoon-history.json");
const DIR = join(ROOT, "public", "afternoon");
const STOCKS_PATH = join(ROOT, "data", "stocks.json");

const START = process.argv[2] || process.env.START || "2026-01-01";
const UNIVERSE_N = +(process.env.UNIVERSE_N || 500);
const TOP_PICKS = +(process.env.TOP_PICKS || 15);

async function main() {
  console.log("[afternoon-bf] 시작일:", START, "유니버스:", UNIVERSE_N);
  await mkdir(DIR, { recursive: true });

  const universe = await loadUniverse(STOCKS_PATH, UNIVERSE_N);
  const codeName = new Map(universe.map(u => [u.code, u.name]));
  console.log("[afternoon-bf] 주가 수집 중…", universe.length, "종목");

  const seriesList = await pMap(universe, async (u) => {
    const s = await fetchYahooOHLCV(u.symbol, "1y");
    return s.length ? { ...u, series: s } : null;
  }, 8);
  const stocks = seriesList.filter(Boolean);
  console.log("[afternoon-bf] 수집 완료:", stocks.length, "종목");

  // 일자별 후보 수집 + 익일 결과 + 베이스라인
  const byDate = new Map();
  let baseSum = 0, baseN = 0;
  for (const st of stocks) {
    const s = st.series;
    for (let i = 20; i < s.length - 1; i++) {
      const d = s[i].date;
      if (d < START) continue;
      const next = s[i + 1];
      if (!next || !isFinite(next.close) || s[i].close <= 0) continue;
      const base = s[i].close;
      const nextRet = (next.close - base) / base * 100;
      const nextHigh = (next.high - base) / base * 100; // 익일 고가 도달폭(당일 종가 기준)
      const nextOpen = (next.open - base) / base * 100;
      const nextLow = (next.low - base) / base * 100;
      baseSum += nextRet; baseN++;
      const m = scoreAt(s, i, 0);
      if (!m || !isLeader(m)) continue;
      if (!byDate.has(d)) byDate.set(d, []);
      byDate.get(d).push({ code: st.code, name: st.name, score: m.score, changePct: m.changePct, nextRet: +nextRet.toFixed(2), nextHigh: +nextHigh.toFixed(2), nextOpen: +nextOpen.toFixed(2), nextLow: +nextLow.toFixed(2) });
    }
  }

  // 일자별 당일 급등폭 상위 K 선정 + 평가 (익일 3%↑ 타겟: 고가 도달 / 종가 마감)
  const dates = [...byDate.keys()].sort();
  const reports = [];
  let totPicks = 0, hits = 0, hits3 = 0, hits3H = 0, hits5 = 0, hits5H = 0, pickSum = 0;
  for (const d of dates) {
    const picks = byDate.get(d).sort((a, b) => b.changePct - a.changePct).slice(0, TOP_PICKS)
      .map(p => ({ ...p, hit: p.nextRet > 0, hit3: p.nextRet >= 3, hit3High: p.nextHigh >= 3 }));
    if (!picks.length) continue;
    const dayHit3H = picks.filter(p => p.hit3High).length;
    const dayAvg = +(picks.reduce((s, p) => s + p.nextRet, 0) / picks.length).toFixed(2);
    totPicks += picks.length;
    hits += picks.filter(p => p.hit).length;
    hits3 += picks.filter(p => p.hit3).length;
    hits3H += dayHit3H;
    hits5 += picks.filter(p => p.nextRet >= 5).length;
    hits5H += picks.filter(p => p.nextHigh >= 5).length;
    pickSum += picks.reduce((s, p) => s + p.nextRet, 0);
    reports.push({ date: d, picks, dayHitRate: +((dayHit3H / picks.length) * 100).toFixed(1), avgNextRet: dayAvg });
  }

  const baseAvg = baseN ? +(baseSum / baseN).toFixed(3) : null;
  const pickAvg = totPicks ? +(pickSum / totPicks).toFixed(3) : null;
  const analysis = {
    range: { start: START, end: dates[dates.length - 1] || START },
    universe: UNIVERSE_N, topPicks: TOP_PICKS,
    tradedDays: reports.length,
    totalPicks: totPicks,
    hit3HighRate: totPicks ? +((hits3H / totPicks) * 100).toFixed(1) : null, // 익일 고가 +3% 도달(주 지표)
    hit5HighRate: totPicks ? +((hits5H / totPicks) * 100).toFixed(1) : null,
    hit3Rate: totPicks ? +((hits3 / totPicks) * 100).toFixed(1) : null,      // 익일 종가 +3% 마감
    hit5Rate: totPicks ? +((hits5 / totPicks) * 100).toFixed(1) : null,
    upRate: totPicks ? +((hits / totPicks) * 100).toFixed(1) : null,
    avgNextRet: pickAvg,
    baselineAvgNextRet: baseAvg,
    edge: (pickAvg != null && baseAvg != null) ? +(pickAvg - baseAvg).toFixed(3) : null,
    note: "당일 급등폭 상위 선정 종목의 익일 성과. hit3HighRate=익일 장중 고가가 +3% 도달한 비율(매도 기회), hit3Rate=익일 종가가 +3% 마감 비율. baseline=유니버스 전체 평균 익일 종가등락.",
  };

  // 매도 전략 비교 (손절 포함) — 익일 시/고/저/종가로 시뮬레이션
  const simPicks = [];
  for (const r of reports) for (const p of r.picks) {
    if (p.nextOpen != null && p.nextHigh != null && p.nextLow != null && p.nextRet != null) {
      simPicks.push({ o: p.nextOpen, h: p.nextHigh, l: p.nextLow, c: p.nextRet });
    }
  }
  const grid = runStrategyGrid(simPicks);
  analysis.strategies = grid.strategies;
  analysis.recommendedStrategy = grid.recommended;
  console.log("[afternoon-bf] 전략 비교:");
  for (const s of grid.strategies) console.log(`  ${s.name}: 평균 ${s.avg}% 승률 ${s.winRate}% 손실 ${s.lossRate}% 최저 ${s.worst}%`);
  console.log("  추천:", grid.recommended);

  reports.sort((a, b) => b.date.localeCompare(a.date));
  const hist = { meta: { updatedAt: kstIso(), count: reports.length, backfilledFrom: START }, analysis, reports };
  await writeFile(HIST, JSON.stringify(hist, null, 2) + "\n", "utf8");

  console.log(`[afternoon-bf] 완료: ${reports.length}일, 선정 ${totPicks}건, 익일고가3%도달 ${analysis.hit3HighRate}%, 종가3%마감 ${analysis.hit3Rate}%, 평균익일종가 ${pickAvg}% (baseline ${baseAvg}%)`);
}

main().catch(e => { console.error("[afternoon-bf] 오류:", e); process.exit(1); });
