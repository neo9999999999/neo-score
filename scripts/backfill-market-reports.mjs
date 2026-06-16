#!/usr/bin/env node
/**
 * 마켓 리포트 OOS 백필 + 분석
 *
 * 지정한 시작일부터 어제까지, 한국 거래일마다 그 시점에 "사용 가능했던"
 * 거시지표(전일 미국 마감)만으로 룰 기반 OOS(out-of-sample) 리포트를 생성하고,
 * 실제 그날의 코스피 등락과 예측 방향을 비교해 적중 여부를 기록한다.
 *
 * 산출물:
 *   public/reports/YYYY-MM-DD.json      각 일자 전체 리포트
 *   public/market-report-history.json   인덱스(요약 + oos) + 분석 요약
 *
 * 사용:
 *   node scripts/backfill-market-reports.mjs 2026-06-01
 *   node scripts/backfill-market-reports.mjs 2026-01-01
 *   (인자 없으면 START 환경변수, 기본 2026-01-01)
 *
 * 네트워크 필요(Stooq). GitHub Actions 등 외부망 환경에서 실행.
 */

import { writeFile, readFile, mkdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import {
  kstIso, MARKETS, KOSPI_SYMBOL, fetchYahooSeries, closesAsOf, makeIndicator,
  loadStockMap, attachCodes, ruleBasedBody, sentToSign,
} from "./lib/report-core.mjs";
import { buildSectorLeadersFromData } from "./lib/sector-leaders.mjs";
import { fetchYahooOHLCV, pMap } from "./lib/stock-core.mjs";
import { SECTOR_MAP } from "./lib/sector-map.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const HIST = join(ROOT, "public", "market-report-history.json");
const REPORTS_DIR = join(ROOT, "public", "reports");
const STOCKS_PATH = join(ROOT, "data", "stocks.json");

const START = process.argv[2] || process.env.START || "2026-01-01";

function assemble(dateStr, indicators, body) {
  const clean = indicators.map(({ _raw, _err, ...rest }) => rest);
  return {
    date: dateStr, generatedAt: kstIso(), source: "oos",
    indicators: clean, title: body.title, sentiment: body.sentiment || "neutral",
    summary: body.summary, chain: body.chain || [], nasdaq: body.nasdaq || null,
    domestic: body.domestic || null, sectors: body.sectors || [],
    globalIssues: body.globalIssues || [], weeklyCalendar: body.weeklyCalendar || [],
    todayIssues: body.todayIssues || [], cards: body.cards || [], detail: body.detail || "",
  };
}

async function main() {
  console.log("[backfill] 시작일:", START);
  await mkdir(REPORTS_DIR, { recursive: true });

  // 1) 시리즈 수집
  const series = {};
  for (const item of MARKETS) {
    try { series[item.key] = await fetchYahooSeries(item.symbol); console.log(`[backfill] ${item.key}: ${series[item.key].length}개`); }
    catch (e) { series[item.key] = []; console.warn(`[backfill] ${item.key} 수집 실패: ${e.message}`); }
  }
  let kospi = [];
  try { kospi = await fetchYahooSeries(KOSPI_SYMBOL); console.log(`[backfill] kospi: ${kospi.length}개`); }
  catch (e) { console.error("[backfill] 코스피 수집 실패 — OOS 평가 불가:", e.message); }
  if (!kospi.length) { console.error("[backfill] 코스피 데이터 없음. 중단."); process.exit(1); }

  const kospiClose = new Map(kospi.map(r => [r.date, r.close]));
  const kospiDates = kospi.map(r => r.date).filter(d => d >= START).sort();

  const stockMap = await loadStockMap(STOCKS_PATH);

  // 2b) 섹터 주도주 주가 사전 수집 (아침 추천주 OOS용)
  const sectorSymbols = [];
  const seenSym = new Set();
  for (const sec of SECTOR_MAP) {
    for (const nm of sec.stocks) {
      const info = stockMap.get(nm);
      if (!info) continue;
      const sym = info.code + (info.market === "KOSDAQ" ? ".KQ" : ".KS");
      if (!seenSym.has(sym)) { seenSym.add(sym); sectorSymbols.push(sym); }
    }
  }
  const sectorSeriesMap = new Map();
  console.log(`[backfill] 섹터 주가 수집 중… ${sectorSymbols.length}종목`);
  await pMap(sectorSymbols.map(s => ({ symbol: s })), async (e) => {
    try { const s = await fetchYahooOHLCV(e.symbol, "2y"); if (s && s.length >= 25) sectorSeriesMap.set(e.symbol, s); } catch {}
  }, 8);
  console.log(`[backfill] 섹터 주가 수집 완료: ${sectorSeriesMap.size}/${sectorSymbols.length}`);

  // 2) 일자별 OOS 리포트 + 평가
  const index = [];
  for (let i = 0; i < kospiDates.length; i++) {
    const d = kospiDates[i];
    const prevD = kospi.map(r => r.date).filter(x => x < d).sort().pop();
    const refDate = new Date(d + "T00:00:00Z");

    // 그 시점까지의 거시지표(<= d) — 전일 미국 마감 반영
    const indicators = MARKETS.map(item => {
      const { close, prevClose } = closesAsOf(series[item.key] || [], d);
      return makeIndicator(item, close, prevClose);
    });

    const body = ruleBasedBody(indicators, refDate);
    attachCodes(body.sectors, stockMap);
    const report = assemble(d, indicators, body);

    // OOS: 예측 방향 vs 실제 코스피 당일 등락
    const cClose = kospiClose.get(d), pClose = prevD ? kospiClose.get(prevD) : NaN;
    const kospiRet = (isFinite(cClose) && isFinite(pClose)) ? +(((cClose - pClose) / pClose) * 100).toFixed(2) : null;
    const pred = sentToSign(report.sentiment);
    let hit = null;
    if (kospiRet != null && pred !== 0) hit = (pred > 0 && kospiRet > 0) || (pred < 0 && kospiRet < 0);
    report.oos = { kospiRet, predicted: report.sentiment, hit };

    await writeFile(join(REPORTS_DIR, d + ".json"), JSON.stringify(report, null, 2) + "\n", "utf8");

    // 아침 추천주 OOS: 데이터 기반 섹터 주도주 상위 3종목 → 익일 고가/종가 수익률
    let morningPicks;
    try {
      const leaders = buildSectorLeadersFromData(sectorSeriesMap, stockMap, d, { topSectors: 3, perSector: 1 });
      const mp = [];
      for (const sec of (leaders || [])) {
        const top = (sec.stocks || [])[0];
        if (!top || !top.symbol || top._si == null) continue;
        const s = sectorSeriesMap.get(top.symbol);
        if (!s) continue;
        const si = top._si;
        if (si + 1 >= s.length) continue;
        const base = s[si].close, next = s[si + 1];
        if (!base || !next || !isFinite(next.close)) continue;
        const nextRet = +((next.close - base) / base * 100).toFixed(2);
        const nextHigh = +((next.high - base) / base * 100).toFixed(2);
        mp.push({ name: top.name, code: top.code, sector: sec.name, changePct: top.changePct, nextRet, nextHigh, hit3High: nextHigh >= 3 });
      }
      if (mp.length) morningPicks = mp;
    } catch {}

    index.push({
      date: d, sentiment: report.sentiment, title: report.title, summary: report.summary,
      kospiBias: report.domestic?.kospiBias || "", indicators: report.indicators,
      topSectors: report.sectors.slice(0, 3).map(s => ({ name: s.name, bias: s.bias })),
      source: "oos", oos: report.oos,
      ...(morningPicks ? { morningPicks } : {}),
    });
  }

  // 3) 분석 요약
  const evald = index.filter(r => r.oos && r.oos.hit !== null);
  const hits = evald.filter(r => r.oos.hit).length;
  const bull = index.filter(r => r.sentiment === "bullish");
  const bear = index.filter(r => r.sentiment === "bearish");
  const neut = index.filter(r => r.sentiment === "neutral");
  const avg = arr => arr.length ? +(arr.reduce((s, r) => s + (r.oos?.kospiRet || 0), 0) / arr.length).toFixed(2) : null;
  const analysis = {
    range: { start: START, end: kospiDates[kospiDates.length - 1] || START },
    totalDays: index.length,
    evaluated: evald.length,
    directionHits: hits,
    hitRate: evald.length ? +((hits / evald.length) * 100).toFixed(1) : null,
    bullishDays: bull.length, bearishDays: bear.length, neutralDays: neut.length,
    avgKospiOnBullish: avg(bull),
    avgKospiOnBearish: avg(bear),
    avgKospiOnNeutral: avg(neut),
    note: "예측 방향(강세/약세)과 실제 코스피 당일 등락 부호 일치율. 중립일은 방향 평가에서 제외.",
  };

  // 아침 추천주 OOS 집계
  const mAll = index.flatMap(r => r.morningPicks || []);
  if (mAll.length) {
    const hit3H = mAll.filter(p => p.hit3High).length;
    const upCnt = mAll.filter(p => p.nextRet > 0).length;
    const avgRet = +(mAll.reduce((s, p) => s + p.nextRet, 0) / mAll.length).toFixed(2);
    analysis.morningAnalysis = {
      range: { start: START, end: index[0]?.date || START },
      tradedDays: index.filter(r => r.morningPicks?.length).length,
      totalPicks: mAll.length,
      hit3HighRate: +((hit3H / mAll.length) * 100).toFixed(1),
      upRate: +((upCnt / mAll.length) * 100).toFixed(1),
      avgNextRet: avgRet,
      note: "데이터 기반 섹터 주도주 Top3(아침 추천주) — 당일 종가 기준 다음 거래일 고가 +3% 도달률 및 익일 종가 평균 수익률",
    };
    console.log(`[backfill] 아침 추천주 OOS: ${mAll.length}건, 고가3%도달 ${analysis.morningAnalysis.hit3HighRate}%, 익일평균 ${avgRet}%`);
  }

  index.sort((a, b) => b.date.localeCompare(a.date));
  const hist = { meta: { updatedAt: kstIso(), count: index.length, backfilledFrom: START }, analysis, reports: index };
  await writeFile(HIST, JSON.stringify(hist, null, 2) + "\n", "utf8");

  console.log(`[backfill] 완료: ${index.length}일, 평가 ${evald.length}일, 방향 적중률 ${analysis.hitRate}%`);
}

main().catch(e => { console.error("[backfill] 오류:", e); process.exit(1); });
