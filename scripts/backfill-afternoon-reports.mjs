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
import { loadUniverse, fetchYahooOHLCV, pMap, scoreAt, isCandidate } from "./lib/stock-core.mjs";

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
      const nextRet = (next.close - s[i].close) / s[i].close * 100;
      baseSum += nextRet; baseN++;
      const m = scoreAt(s, i, 0);
      if (!m || !isCandidate(m)) continue;
      if (!byDate.has(d)) byDate.set(d, []);
      byDate.get(d).push({ code: st.code, name: st.name, score: m.score, changePct: m.changePct, nextRet: +nextRet.toFixed(2) });
    }
  }

  // 일자별 상위 K 선정 + 평가
  const dates = [...byDate.keys()].sort();
  const reports = [];
  let totPicks = 0, hits = 0, pickSum = 0;
  for (const d of dates) {
    const picks = byDate.get(d).sort((a, b) => b.score - a.score).slice(0, TOP_PICKS)
      .map(p => ({ ...p, hit: p.nextRet > 0 }));
    if (!picks.length) continue;
    const dayHits = picks.filter(p => p.hit).length;
    const dayAvg = +(picks.reduce((s, p) => s + p.nextRet, 0) / picks.length).toFixed(2);
    totPicks += picks.length; hits += dayHits; pickSum += picks.reduce((s, p) => s + p.nextRet, 0);
    reports.push({ date: d, picks, dayHitRate: +((dayHits / picks.length) * 100).toFixed(1), avgNextRet: dayAvg });
  }

  const baseAvg = baseN ? +(baseSum / baseN).toFixed(3) : null;
  const pickAvg = totPicks ? +(pickSum / totPicks).toFixed(3) : null;
  const analysis = {
    range: { start: START, end: dates[dates.length - 1] || START },
    universe: UNIVERSE_N, topPicks: TOP_PICKS,
    tradedDays: reports.length,
    totalPicks: totPicks,
    hits,
    hitRate: totPicks ? +((hits / totPicks) * 100).toFixed(1) : null,
    avgNextRet: pickAvg,
    baselineAvgNextRet: baseAvg,
    edge: (pickAvg != null && baseAvg != null) ? +(pickAvg - baseAvg).toFixed(3) : null,
    note: "각 거래일 종가 기준 선정 종목의 '익일 종가' 등락률. baseline=유니버스 전체 평균 익일 등락. edge=후보 평균−baseline.",
  };

  reports.sort((a, b) => b.date.localeCompare(a.date));
  const hist = { meta: { updatedAt: kstIso(), count: reports.length, backfilledFrom: START }, analysis, reports };
  await writeFile(HIST, JSON.stringify(hist, null, 2) + "\n", "utf8");

  console.log(`[afternoon-bf] 완료: ${reports.length}일, 선정 ${totPicks}건, 적중률 ${analysis.hitRate}%, 평균익일 ${pickAvg}% (baseline ${baseAvg}%, edge ${analysis.edge})`);
}

main().catch(e => { console.error("[afternoon-bf] 오류:", e); process.exit(1); });
