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
import { loadUniverse, fetchYahooOHLCV, pMap, scoreAt, isLeader, runStrategyGrid, simExit, simExitTPSL } from "./lib/stock-core.mjs";

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

  // 시작일에 맞춰 수집 범위 결정
  const yrs = Math.ceil((Date.now() - new Date(START + "T00:00:00Z").getTime()) / (365.25 * 864e5)) + 1;
  const RANGE = process.env.RANGE || (yrs <= 2 ? "2y" : yrs <= 5 ? "5y" : yrs <= 10 ? "10y" : "max");

  const universe = await loadUniverse(STOCKS_PATH, UNIVERSE_N);
  console.log(`[afternoon-bf] 주가 수집 중… ${universe.length}종목 range=${RANGE} (스트리밍)`);

  // 스트리밍: 종목별로 받아 후보만 추출하고 시리즈는 버림(메모리 절약)
  const byDate = new Map();
  const poolByDate = new Map(); // OOS 그리드 탐색용 넓은 후보 풀
  let baseSum = 0, baseN = 0, fetched = 0;
  await pMap(universe, async (u) => {
    let s;
    try { s = await fetchYahooOHLCV(u.symbol, RANGE); } catch { return null; }
    if (!s || !s.length) return null;
    fetched++;
    for (let i = 20; i < s.length - 1; i++) {
      const d = s[i].date;
      if (d < START) continue;
      const next = s[i + 1];
      if (!next || !isFinite(next.close) || s[i].close <= 0) continue;
      const base = s[i].close;
      const nextRet = (next.close - base) / base * 100;
      const nh = (next.high - base) / base * 100, no = (next.open - base) / base * 100, nl = (next.low - base) / base * 100;
      baseSum += nextRet; baseN++;
      const m = scoreAt(s, i, 0);
      if (!m) continue;
      // 넓은 풀(그리드 탐색용) — 상한가(+27%↑) 제외: 매수 불가
      if (m.score >= 70 && m.changePct >= 8 && m.changePct < 27 && m.rangePos >= 0.5 && m.volSurge >= 1.2) {
        if (!poolByDate.has(d)) poolByDate.set(d, []);
        poolByDate.get(d).push({ score: m.score, chg: m.changePct, rangePos: m.rangePos, vol: m.volSurge, o: +no.toFixed(2), h: +nh.toFixed(2), l: +nl.toFixed(2), c: +nextRet.toFixed(2) });
      }
      if (!isLeader(m)) continue;
      if (!byDate.has(d)) byDate.set(d, []);
      byDate.get(d).push({
        code: u.code, name: u.name, score: m.score, changePct: m.changePct,
        nextRet: +nextRet.toFixed(2), nextHigh: +nh.toFixed(2), nextOpen: +no.toFixed(2), nextLow: +nl.toFixed(2),
      });
    }
    return null;
  }, 6);
  console.log(`[afternoon-bf] 수집 완료: ${fetched}/${universe.length}종목, 후보일수 ${byDate.size}, 풀일수 ${poolByDate.size}`);

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
    stocksFetched: fetched, stocksTotal: universe.length,
    note: "당일 급등폭 상위 선정 종목의 익일 성과. hit3HighRate=익일 장중 고가가 +3% 도달한 비율(매도 기회), hit3Rate=익일 종가가 +3% 마감 비율. baseline=유니버스 전체 평균 익일 종가등락. ※상장폐지 종목 미포함(생존편향) 가능.",
  };

  // 월별 OOS 집계
  const mMap = new Map();
  for (const r of reports) {
    const ym = r.date.slice(0, 7);
    if (!mMap.has(ym)) mMap.set(ym, { ym, days: 0, picks: 0, hit3H: 0, retSum: 0 });
    const mm = mMap.get(ym);
    mm.days++; mm.picks += r.picks.length;
    mm.hit3H += r.picks.filter(p => p.hit3High).length;
    mm.retSum += r.picks.reduce((s, p) => s + p.nextRet, 0);
  }
  analysis.monthly = [...mMap.values()].map(mm => ({
    ym: mm.ym, days: mm.days, picks: mm.picks,
    hit3HighRate: mm.picks ? +((mm.hit3H / mm.picks) * 100).toFixed(1) : null,
    avgNextRet: mm.picks ? +(mm.retSum / mm.picks).toFixed(2) : null,
  })).sort((a, b) => b.ym.localeCompare(a.ym));

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

  // ===== 진짜 OOS: 모든 구간을 검증 (연도별 leave-one-out + 양방향 2-fold) =====
  const SPLIT = process.env.OOS_SPLIT || "2023-01-01";
  const EXITS = [
    { name: "무손절(원안)", opt: { tp1Lvl: 5, tp1Frac: 0.5, stop: null } },
    { name: "전량 트레일 + 갭−7%", opt: { tp1Lvl: 5, tp1Frac: 0, gapStop: -7 } },
    { name: "원안 + 갭−7%", opt: { tp1Lvl: 5, tp1Frac: 0.5, gapStop: -7 } },
  ];
  const SCOREMINS = [78, 84], CHGMINS = [10, 15, 20], TOPNS = [3, 5];
  const poolDates = [...poolByDate.keys()].sort();
  // 콤보를 임의의 날짜집합(inSet)에서 평가
  function evalCombo(sMin, cMin, topN, exitOpt, inSet, cMax = 29) {
    let sum = 0, h3 = 0, h5 = 0, n = 0;
    for (const d of poolDates) {
      if (!inSet(d)) continue;
      const sel = poolByDate.get(d).filter(p => p.score >= sMin && p.chg >= cMin && p.chg <= cMax && p.rangePos >= 0.55 && p.vol >= 1.3)
        .sort((a, b) => b.chg - a.chg).slice(0, topN);
      for (const p of sel) { sum += simExit(p, exitOpt); if (p.h >= 3) h3++; if (p.h >= 5) h5++; n++; }
    }
    return { n, avg: n ? +(sum / n).toFixed(3) : null, hit3HighRate: n ? +((h3 / n) * 100).toFixed(1) : null, hit5HighRate: n ? +((h5 / n) * 100).toFixed(1) : null };
  }
  function poolBaseline(inSet) {
    let s = 0, n = 0;
    for (const d of poolDates) { if (!inSet(d)) continue; for (const p of poolByDate.get(d)) { s += p.c; n++; } }
    return n ? +(s / n).toFixed(3) : null;
  }
  // 학습집합에서 최고 평균(표본≥100) 콤보 선택
  function selectBest(trainSet) {
    let best = null;
    for (const sMin of SCOREMINS) for (const cMin of CHGMINS) for (const topN of TOPNS) for (const ex of EXITS) {
      const tr = evalCombo(sMin, cMin, topN, ex.opt, trainSet);
      if (tr.n < 100 || tr.avg == null) continue;
      if (!best || tr.avg > best.train.avg) best = { params: { scoreMin: sMin, chgMin: cMin, topN, exit: ex.name, exitOpt: ex.opt }, train: tr };
    }
    return best;
  }
  function oosFold(trainSet, testSet, trainRange, testRange) {
    const b = selectBest(trainSet);
    if (!b) return null;
    const test = evalCombo(b.params.scoreMin, b.params.chgMin, b.params.topN, b.params.exitOpt, testSet);
    const base = poolBaseline(testSet);
    return {
      trainRange, testRange,
      chosen: { scoreMin: b.params.scoreMin, chgMin: b.params.chgMin, topN: b.params.topN, exit: b.params.exit },
      train: b.train,
      test: { ...test, baselineAvgNextRet: base, edge: (test.avg != null && base != null) ? +(test.avg - base).toFixed(3) : null },
    };
  }

  const years = [...new Set(poolDates.map(d => d.slice(0, 4)))].sort();
  // 연도별 leave-one-out: 해당 연도를 뺀 나머지로 파라미터 선택 → 그 연도에서만 검증 (모든 연도 OOS)
  const byYear = [];
  for (const Y of years) {
    const fold = oosFold(d => d.slice(0, 4) !== Y, d => d.slice(0, 4) === Y, "기타연도", Y);
    if (fold) byYear.push({ year: Y, chosen: fold.chosen, ...fold.test });
  }
  // 양방향 2-fold (헤드라인)
  const foldA = oosFold(d => d < SPLIT, d => d >= SPLIT, { start: START, end: SPLIT }, { start: SPLIT, end: analysis.range.end });
  const foldB = oosFold(d => d >= SPLIT, d => d < SPLIT, { start: SPLIT, end: analysis.range.end }, { start: START, end: SPLIT });
  analysis.oos = foldA ? { split: SPLIT, ...foldA, foldB, byYear } : { split: SPLIT, byYear };
  console.log("[afternoon-bf] OOS 연도별(leave-one-out):");
  for (const y of byYear) console.log(`  ${y.year}: 평균 ${y.avg}% 고가3%도달 ${y.hit3HighRate}% edge ${y.edge} (n=${y.n}) [score≥${y.chosen.scoreMin},+${y.chosen.chgMin}~29,top${y.chosen.topN},${y.chosen.exit}]`);

  // ===== 현실판 OOS: 비용 차감 + 종가청산(고점 가정 제거) + 체결가능 등락대(+10~20%) =====
  const COST = +(process.env.COST_PCT || 0.5); // 왕복 수수료+거래세+슬리피지(%)
  const REAL_EXIT = { tp1Lvl: 5, tp1Frac: 0.5, gapStop: -7, runnerAtClose: true, cost: COST };
  function selectBestReal(trainSet) {
    let best = null;
    for (const sMin of [78, 84]) for (const cMin of [10, 12, 15]) for (const topN of [3, 5]) {
      const tr = evalCombo(sMin, cMin, topN, REAL_EXIT, trainSet, 20); // +20% 초과(상한가 락) 제외
      if (tr.n < 80 || tr.avg == null) continue;
      if (!best || tr.avg > best.train.avg) best = { params: { scoreMin: sMin, chgMin: cMin, topN }, train: tr };
    }
    return best;
  }
  const byYearReal = [];
  for (const Y of years) {
    const b = selectBestReal(d => d.slice(0, 4) !== Y);
    if (!b) continue;
    const test = evalCombo(b.params.scoreMin, b.params.chgMin, b.params.topN, REAL_EXIT, d => d.slice(0, 4) === Y, 20);
    const base = poolBaseline(d => d.slice(0, 4) === Y);
    byYearReal.push({ year: Y, chosen: { ...b.params, chgMax: 20 }, ...test, baselineAvgNextRet: base, edge: (test.avg != null && base != null) ? +(test.avg - (base - COST)).toFixed(3) : null });
  }
  analysis.oosReal = {
    cost: COST,
    note: `현실 반영: 왕복 비용 ${COST}% 차감 · 1차 +5% 절반 익절, 나머지 종가 청산(고점 트레일 가정 제거) · 갭하락 −7% 손절 · 매수 가능 +10~20%만(상한가 락 제외).`,
    byYear: byYearReal,
  };
  console.log("[afternoon-bf] 현실판 OOS 연도별:");
  for (const y of byYearReal) console.log(`  ${y.year}: 순수익 ${y.avg}% (비용 ${COST}% 차감) 고가3%도달 ${y.hit3HighRate}% n=${y.n} [score≥${y.chosen.scoreMin},+${y.chosen.chgMin}~20,top${y.chosen.topN}]`);

  // ===== 고도화: 익절/손절(TP/SL) 그리드 최적화 (상한가 제외, 비용 차감) =====
  function evalTPSL(sMin, cMin, cMax, topN, exitSpec, inSet) {
    let sum = 0, h3 = 0, n = 0, wins = 0;
    for (const d of poolDates) {
      if (!inSet(d)) continue;
      const sel = poolByDate.get(d).filter(p => p.score >= sMin && p.chg >= cMin && p.chg <= cMax && p.rangePos >= 0.55 && p.vol >= 1.3).sort((a, b) => b.chg - a.chg).slice(0, topN);
      for (const p of sel) { const r = simExitTPSL(p, exitSpec); sum += r; if (r > 0) wins++; if (p.h >= 3) h3++; n++; }
    }
    return { n, avg: n ? +(sum / n).toFixed(3) : null, winRate: n ? +((wins / n) * 100).toFixed(1) : null, hit3HighRate: n ? +((h3 / n) * 100).toFixed(1) : null };
  }
  const TPS = [3, 5, 7], SLS = [-3, -5, -7], FRACS = [0.5, 1];
  function selectBestTPSL(trainSet) {
    let best = null;
    for (const sMin of [78, 84]) for (const cMin of [8, 12]) for (const topN of [3, 5])
      for (const tp of TPS) for (const sl of SLS) for (const frac of FRACS) {
        const ex = { tp, sl, tp1Frac: frac, gapStop: -7, cost: COST };
        const tr = evalTPSL(sMin, cMin, 25, topN, ex, trainSet);
        if (tr.n < 80 || tr.avg == null) continue;
        if (!best || tr.avg > best.train.avg) best = { params: { scoreMin: sMin, chgMin: cMin, topN, tp, sl, tp1Frac: frac }, train: tr };
      }
    return best;
  }
  const advByYear = [];
  for (const Y of years) {
    const b = selectBestTPSL(d => d.slice(0, 4) !== Y);
    if (!b) continue;
    const ex = { tp: b.params.tp, sl: b.params.sl, tp1Frac: b.params.tp1Frac, gapStop: -7, cost: COST };
    const test = evalTPSL(b.params.scoreMin, b.params.chgMin, 25, b.params.topN, ex, d => d.slice(0, 4) === Y);
    advByYear.push({ year: Y, chosen: b.params, ...test });
  }
  analysis.oosAdv = { cost: COST, chgMax: 25, note: "상한가(+27%↑) 제외 · 익절(TP)/손절(SL) 학습 최적화 후 검증 · 왕복비용 차감 · 익절·손절 동시 도달 시 손절 우선(보수적).", byYear: advByYear };
  console.log("[afternoon-bf] 고도화 TP/SL OOS:");
  for (const y of advByYear) console.log(`  ${y.year}: 순 ${y.avg}% 승률 ${y.winRate}% n=${y.n} [s≥${y.chosen.scoreMin},+${y.chosen.chgMin}~25,top${y.chosen.topN},TP+${y.chosen.tp}/SL${y.chosen.sl}/익절${y.chosen.tp1Frac}]`);

  reports.sort((a, b) => b.date.localeCompare(a.date));
  const hist = { meta: { updatedAt: kstIso(), count: reports.length, backfilledFrom: START }, analysis, reports };
  await writeFile(HIST, JSON.stringify(hist, null, 2) + "\n", "utf8");

  console.log(`[afternoon-bf] 완료: ${reports.length}일, 선정 ${totPicks}건, 익일고가3%도달 ${analysis.hit3HighRate}%, 종가3%마감 ${analysis.hit3Rate}%, 평균익일종가 ${pickAvg}% (baseline ${baseAvg}%)`);
}

main().catch(e => { console.error("[afternoon-bf] 오류:", e); process.exit(1); });
