#!/usr/bin/env node
/**
 * 오후 마켓 리포트 (15:00 KST) — 익일 상승 종목 예측
 *
 * 미 선물지수 + 금리·환율·유가·달러 + 당일 코스피/코스닥 흐름과
 * 거래대금 상위 ~500종목의 당일 주가/거래량을 분석해 익일 연속 상승
 * 가능성이 높은 종목을 스코어링·선정한다.
 *
 * 산출물:
 *   public/afternoon-report.json       최신 오후 리포트
 *   public/afternoon/YYYY-MM-DD.json   일자별
 *   public/afternoon-history.json      인덱스(선정 종목, 익일 검증은 백필이 채움)
 *
 * 매일 06:00 UTC(15:00 KST) GitHub Action 으로 실행. 네트워크 필요(Yahoo).
 */

import { writeFile, readFile, mkdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { kstNow, kstDateStr, kstIso, fetchYahooSeries, closesAsOf, makeIndicator } from "./lib/report-core.mjs";
import { loadUniverse, fetchYahooOHLCV, pMap, scoreAt, newHighCandidate, pickReason, fmtEok, buildCalibration, estimate, fetchSupplyMap, supplyInfo } from "./lib/stock-core.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const OUT = join(ROOT, "public", "afternoon-report.json");
const DIR = join(ROOT, "public", "afternoon");
const HIST = join(ROOT, "public", "afternoon-history.json");
const STOCKS_PATH = join(ROOT, "data", "stocks.json");

const UNIVERSE_N = +(process.env.UNIVERSE_N || 500);
const TOP_PICKS = +(process.env.TOP_PICKS || 5); // 익일 대장주 후보 3~5개

const FUTURES = [
  { key: "nq", label: "나스닥 선물", symbol: "NQ=F", fmt: "index" },
  { key: "es", label: "S&P500 선물", symbol: "ES=F", fmt: "index" },
  { key: "ym", label: "다우 선물", symbol: "YM=F", fmt: "index" },
  { key: "vix", label: "VIX", symbol: "^VIX", fmt: "num" },
];
const MACRO = [
  { key: "ust10y", label: "미 10년물 금리", symbol: "^TNX", fmt: "pct" },
  { key: "usdkrw", label: "원/달러", symbol: "KRW=X", fmt: "krw" },
  { key: "wti", label: "WTI 유가", symbol: "CL=F", fmt: "usd" },
  { key: "dxy", label: "달러인덱스", symbol: "DX-Y.NYB", fmt: "num" },
];
const INDICES = [
  { key: "kospi", label: "코스피", symbol: "^KS11", fmt: "index" },
  { key: "kosdaq", label: "코스닥", symbol: "^KQ11", fmt: "index" },
];

async function snap(list, dateStr) {
  const out = [];
  for (const it of list) {
    try {
      const s = await fetchYahooSeries(it.symbol, "1mo");
      const { close, prevClose } = closesAsOf(s, dateStr);
      out.push(makeIndicator(it, close, prevClose));
    } catch { out.push({ key: it.key, label: it.label, value: "—", change: "—", changePct: "—", dir: "flat", _raw: null }); }
  }
  return out;
}

async function main() {
  const dateStr = kstDateStr();
  console.log("[afternoon] 생성 시작:", dateStr);

  const futures = await snap(FUTURES, dateStr);
  const macro = await snap(MACRO, dateStr);
  const indices = await snap(INDICES, dateStr);

  const nq = futures.find(f => f.key === "nq")?._raw?.chgPct ?? 0;
  const es = futures.find(f => f.key === "es")?._raw?.chgPct ?? 0;
  const macroBias = Math.max(-1, Math.min(1, ((nq + es) / 2) / 1.2));
  const marketBias = macroBias > 0.25 ? "bullish" : macroBias < -0.25 ? "bearish" : "neutral";

  // 종목 유니버스 수집 + 스코어링
  const universe = await loadUniverse(STOCKS_PATH, UNIVERSE_N);
  console.log("[afternoon] 유니버스:", universe.length, "종목 수집 중…");
  const scored = await pMap(universe, async (u) => {
    const series = await fetchYahooOHLCV(u.symbol, "1y"); // 120일 고가(신고가) 판정 위해 1년
    if (series.length < 121) return null;
    const i = series.length - 1;
    const m = scoreAt(series, i, macroBias);
    if (!m) return null;
    const nhc = newHighCandidate(series, i, { chgMin: 2, chgMax: 27 });
    return { ...u, ...m, date: series[i].date, price: series[i].close, nh: !!nhc, nearHighPct: nhc ? nhc.nearHighPct : null, breakout: nhc ? nhc.breakout : false };
  }, 8);

  const valid = scored.filter(Boolean).filter(x => isFinite(x.value) && x.value > 0);
  valid.sort((a, b) => b.value - a.value);
  const universeByValue = valid.slice(0, UNIVERSE_N);

  // OOS 히스토리로 점수대별 보정표 생성 → 종목별 예상 익일등락/5%↑ 확률
  let calibration = null;
  try { const h = JSON.parse(await readFile(HIST, "utf8")); calibration = buildCalibration(h.reports); } catch {}

  // 익일 대장주 후보(3%↑ 연속 가능성): 강한 신호 + 당일 급등 + 수급(외+기 동반매수) 우선
  // 백테스트: 점수순 대비 당일등락순이 익일 3%↑ 적중률 우수 / 수급은 라이브 가점
  const supplyMap = await fetchSupplyMap();
  console.log("[afternoon] 수급 데이터:", supplyMap.size, "종목");
  const pool = universeByValue.filter(x => x.nh).map(x => {
    const e = estimate(calibration, x.changePct) || {};
    const si = supplyInfo(supplyMap.get(x.code));
    return { ...x, expRet: e.expRet ?? null, p3: e.p3 ?? null, p5: e.p5 ?? null, p3High: e.p3High ?? null, p5High: e.p5High ?? null, calHit: e.hitRate ?? null, supplyLabel: si.label, dongban: si.dongban, supplyKnown: si.known };
  });
  // 외+기 동반매수 우선 → 신고가 돌파 우선 → 당일 등락폭 순
  pool.sort((a, b) => (b.dongban ? 1 : 0) - (a.dongban ? 1 : 0) || (b.nearHighPct ?? -99) - (a.nearHighPct ?? -99) || b.changePct - a.changePct);

  const candidates = pool.slice(0, TOP_PICKS).map((x, idx) => ({
    rank: idx + 1, name: x.name, code: x.code, market: x.market,
    price: Math.round(x.price),
    score: x.score, changePct: x.changePct, rangePos: x.rangePos,
    volSurge: x.volSurge, gapPct: x.gapPct, aboveMA: x.aboveMA,
    nearHighPct: x.nearHighPct, breakout: x.breakout,
    value: x.value, valueText: fmtEok(x.value),
    expRet: x.expRet, p3: x.p3, p5: x.p5, p3High: x.p3High, p5High: x.p5High, hitRate: x.calHit,
    supplyLabel: x.supplyLabel, dongban: x.dongban,
    target3: x.p3High != null && x.p3High >= 45,
    reason: pickReason(x, x.name) + (x.breakout ? " · 신고가 돌파" : " · 신고가 근접") + " · 정배열" + (x.dongban ? " · 외+기 동반매수" : ""),
  }));

  console.log(`[afternoon] 신고가+정배열 후보 ${candidates.length}종목 (돌파 ${candidates.filter(c => c.breakout).length}, 동반매수 ${candidates.filter(c => c.dongban).length})`);

  const dir = v => v == null ? "혼조" : v > 0.1 ? "상승" : v < -0.1 ? "하락" : "보합";
  const top = candidates[0];
  const summary = `미 선물은 나스닥 ${dir(nq)}(${nq >= 0 ? "+" : ""}${nq}%)·S&P ${dir(es)} 흐름으로, 익일 한국 증시는 ${marketBias === "bullish" ? "강세 우호" : marketBias === "bearish" ? "약세 경계" : "혼조"} 출발이 예상됩니다. 정배열 + 신고가 근접/돌파 종목 중 거래량·종가강도가 강한 ${candidates.length}개를 대장주 후보로 추렸습니다${top ? ` (1순위 ${top.name}, ${top.breakout ? "신고가 돌파" : "신고가 근접"}).` : "."}`;

  const report = {
    date: dateStr, generatedAt: kstIso(), source: "quant", type: "afternoon",
    marketBias, summary,
    futures, macro, indices,
    candidates,
    calibration: calibration ? calibration.all : null,
    note: "미 선물·매크로 + 당일 종목 주가/거래량 정량 스코어. 예상 익일등락·5%↑ 확률은 과거 OOS 통계 기반 추정으로 보장값이 아닙니다. 투자 책임은 본인에게 있습니다.",
  };

  await mkdir(DIR, { recursive: true });
  await writeFile(OUT, JSON.stringify(report, null, 2) + "\n", "utf8");
  await writeFile(join(DIR, dateStr + ".json"), JSON.stringify(report, null, 2) + "\n", "utf8");

  // 히스토리 인덱스(선정 종목 요약) — 익일 검증은 백필이 채움
  let hist = { meta: {}, analysis: null, reports: [] };
  try { hist = JSON.parse(await readFile(HIST, "utf8")); } catch {}
  if (!Array.isArray(hist.reports)) hist.reports = [];
  const entry = {
    date: dateStr, marketBias,
    picks: candidates.map(c => ({ name: c.name, code: c.code, score: c.score, changePct: c.changePct })),
    nq, es,
  };
  hist.reports = hist.reports.filter(r => r.date !== dateStr);
  hist.reports.push(entry);
  hist.reports.sort((a, b) => b.date.localeCompare(a.date));
  hist.meta = { ...(hist.meta || {}), updatedAt: kstIso(), count: hist.reports.length };
  await writeFile(HIST, JSON.stringify(hist, null, 2) + "\n", "utf8");

  console.log("[afternoon] 저장 완료:", OUT);
}

main().catch(e => { console.error("[afternoon] 오류:", e); process.exit(1); });
