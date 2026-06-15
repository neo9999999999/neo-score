#!/usr/bin/env node
/**
 * 데일리 마켓 리포트 생성기
 *
 * 유가 · 달러 · 환율 · 금리 · 나스닥 등 핵심 거시지표를 수집하고,
 * 그 연결관계를 따라 나스닥 반응 → 국내증시 전망 → 수혜 섹터/종목을
 * 분석한 리포트(JSON)를 public/market-report.json 으로 생성한다.
 * 생성된 리포트는 public/market-report-history.json 에 일자별로 누적된다.
 *
 * 매일 새벽(장 시작 전, 07:00 KST 이전) GitHub Action 으로 실행된다.
 *
 * 환경변수:
 *   ANTHROPIC_API_KEY  설정 시 api.anthropic.com 직접 호출 (권장)
 *   ANTHROPIC_MODEL    모델 ID (기본: claude-sonnet-4-6)
 *   (미설정 시) sector-api 프록시로 폴백
 */

import { writeFile, readFile, mkdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import {
  kstNow, kstDateStr, kstIso, fetchWithTimeout, STOOQ, fetchStooqSeries, closesAsOf,
  makeIndicator, loadStockMap, attachCodes, ruleBasedBody, macroSignals,
} from "./lib/report-core.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const OUT = join(ROOT, "public", "market-report.json");
const HIST = join(ROOT, "public", "market-report-history.json");
const REPORTS_DIR = join(ROOT, "public", "reports");
const STOCKS_PATH = join(ROOT, "data", "stocks.json");

const PROXY_URL = "https://sector-api-pink.vercel.app/api/analyze";
const ANTHROPIC_URL = "https://api.anthropic.com/v1/messages";
const PROXY_MODEL = "claude-haiku-4-5-20251001";

// ---- 거시지표 수집 ----
async function collectIndicators(dateStr) {
  const out = [];
  for (const item of STOOQ) {
    try {
      const series = await fetchStooqSeries(item.symbol);
      const { close, prevClose } = closesAsOf(series, dateStr);
      out.push(makeIndicator(item, close, prevClose));
    } catch (e) {
      out.push({ key: item.key, label: item.label, value: "—", change: "—", changePct: "—", dir: "flat", _raw: null });
    }
  }
  return out;
}

// ---- LLM 호출 ----
function buildPrompt(indicators, dateStr) {
  const indLines = indicators.map(i => `- ${i.label}: ${i.value} (${i.changePct})`).join("\n");
  const system = `당신은 한국 주식시장 거시전략 애널리스트입니다. 유가·달러·환율·금리 등 핵심 거시지표의 연결관계(인과사슬)를 따라 간밤 나스닥의 반응을 해석하고, 그에 따른 오늘 한국 증시(코스피/코스닥)의 방향성과 상승 예상 섹터·수혜 종목을 예측합니다.

반드시 아래 JSON 스키마 하나만 출력하세요 (코드블록·설명 텍스트 금지):
{
  "title": "리포트 제목 (한 줄)",
  "sentiment": "bullish|neutral|bearish",
  "summary": "오늘의 요약 3~4문장. 거시 연결고리와 국내증시 방향성 핵심.",
  "chain": [ {"from":"유가","via":"인과 설명","to":"미 금리","tone":"pos|neg|neutral","note":"한 줄 해설"} ],
  "nasdaq": {"verdict":"간밤 나스닥 한 줄 평","detail":"등락 원인을 유가·금리·달러와 연결해 2~3문장"},
  "domestic": {"kospiBias":"강세/약세/관망/갭상승 등","kosdaqBias":"...","fxNote":"환율→외국인 수급 한 줄","detail":"오늘 국내증시 시나리오 2~3문장"},
  "sectors": [ {"name":"섹터명","bias":"up|down|neutral","reason":"왜 오늘 주목하는지","stocks":[{"name":"정확한 한국 상장 종목명","reason":"수혜 이유 한 줄"}]} ],
  "globalIssues": [ {"category":"전쟁/지정학/무역/통화정책 등","title":"국제 핫이슈 제목","detail":"내용과 시장 영향 1~2문장"} ],
  "weeklyCalendar": [ {"date":"6/16","day":"월","title":"이벤트명(예: 미 FOMC, 한국 수출입동향)","detail":"무엇을 보는지·시장 영향 한 줄","importance":"high|mid|low"} ],
  "todayIssues": [ {"category":"국내/글로벌/원자재 등","title":"오늘 주목할 이슈 제목","detail":"한 줄 해설"} ],
  "cards": [ {"emoji":"📊","title":"카드 제목","body":"카드 본문 1~2문장"} ],
  "detail": "상세 분석 본문. 단락은 \\n\\n 으로 구분. 거시 연결고리 → 나스닥 → 국내증시 → 섹터 → 글로벌/전쟁 이슈 순으로 6~8단락."
}

규칙:
- 종목명은 실제 한국 상장사 정식 명칭만 사용(예: 삼성전자, SK하이닉스, 한화에어로스페이스). 코드는 적지 마세요.
- 섹터는 3~5개, 각 섹터당 수혜 종목 2~3개.
- chain은 4~6단계로 유가/달러/금리 → 나스닥 → 국내증시까지 이어지게.
- globalIssues는 전쟁·지정학·무역분쟁 등 국제 핫이슈 2~4개, 한국 증시 영향까지 연결.
- weeklyCalendar는 오늘 날짜가 속한 주(월~금)의 주요 경제 이벤트를 일자별로 3~6개. 미국·한국 지표 발표, 중앙은행 회의, 실적·옵션만기 등. date는 'M/D' 형식, day는 한글 요일 한 글자.
- todayIssues는 오늘 장중 주목할 이슈 2~4개.
- cards는 4~6장, 카드뉴스용으로 직관적이고 짧게.
- 데이터가 '—'(수집 실패)인 지표는 일반적 거시 시나리오로 합리적으로 추론.`;

  const user = `오늘 날짜(KST): ${dateStr}

간밤 글로벌 마감 거시지표:
${indLines}

위 지표의 연결관계를 분석해 오늘 한국 증시 개장 전 브리핑 리포트를 위 JSON 스키마대로 작성하세요. 반드시 단일 JSON만 출력.`;
  return { system, user };
}

async function callLLM(system, user) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  const model = process.env.ANTHROPIC_MODEL || "claude-sonnet-4-6";
  let text = "";
  if (apiKey) {
    const r = await fetchWithTimeout(ANTHROPIC_URL, {
      method: "POST",
      headers: { "content-type": "application/json", "x-api-key": apiKey, "anthropic-version": "2023-06-01" },
      body: JSON.stringify({ model, max_tokens: 4000, system, messages: [{ role: "user", content: user }] }),
    }, 60000);
    const data = await r.json();
    if (data.type === "error") throw new Error(data.error?.message || "anthropic error");
    text = data.content?.[0]?.text || "";
  } else {
    const r = await fetchWithTimeout(PROXY_URL, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ model: PROXY_MODEL, max_tokens: 4000, system, messages: [{ role: "user", content: user }] }),
    }, 60000);
    const data = await r.json();
    if (data.type === "error") throw new Error(data.error?.message || "proxy error");
    text = data.content?.[0]?.text || "";
  }
  const m = text.match(/\{[\s\S]*\}/);
  if (!m) throw new Error("JSON 파싱 실패");
  return JSON.parse(m[0]);
}

function assembleReport(dateStr, mode, indicators, body) {
  const cleanIndicators = indicators.map(({ _raw, _err, ...rest }) => rest);
  // 거시 신호 종합은 항상 실제 지표에서 계산 (LLM·룰 모드 공통 — UI에 투명 표시)
  const macro = macroSignals(indicators);
  return {
    date: dateStr,
    generatedAt: kstIso(),
    source: mode,
    macroScore: macro.score,
    signals: macro.signals,
    indicators: cleanIndicators,
    title: body.title,
    sentiment: body.sentiment || "neutral",
    summary: body.summary,
    chain: body.chain || [],
    nasdaq: body.nasdaq || null,
    domestic: body.domestic || null,
    sectors: body.sectors || [],
    globalIssues: body.globalIssues || [],
    weeklyCalendar: body.weeklyCalendar || [],
    todayIssues: body.todayIssues || body.issues || [],
    cards: body.cards || [],
    detail: body.detail || "",
  };
}

// 전체 리포트는 public/reports/DATE.json, 인덱스는 history.json(요약 + OOS)
async function appendHistory(report) {
  await mkdir(REPORTS_DIR, { recursive: true });
  await writeFile(join(REPORTS_DIR, report.date + ".json"), JSON.stringify(report, null, 2) + "\n", "utf8");

  let hist = { meta: {}, analysis: null, reports: [] };
  try { hist = JSON.parse(await readFile(HIST, "utf8")); } catch { /* 신규 */ }
  if (!Array.isArray(hist.reports)) hist.reports = [];
  const entry = {
    date: report.date,
    sentiment: report.sentiment,
    title: report.title,
    summary: report.summary,
    kospiBias: report.domestic?.kospiBias || "",
    indicators: report.indicators,
    topSectors: (report.sectors || []).slice(0, 3).map(s => ({ name: s.name, bias: s.bias })),
    source: report.source,
    // oos(실제 결과 검증)는 백필 스크립트가 계산해 채운다. 당일 생성 시엔 미정.
    oos: (hist.reports.find(r => r.date === report.date) || {}).oos || null,
  };
  hist.reports = hist.reports.filter(r => r.date !== report.date);
  hist.reports.push(entry);
  hist.reports.sort((a, b) => b.date.localeCompare(a.date));
  hist.meta = { ...(hist.meta || {}), updatedAt: kstIso(), count: hist.reports.length };
  await writeFile(HIST, JSON.stringify(hist, null, 2) + "\n", "utf8");
  console.log("[market-report] 히스토리 갱신:", hist.reports.length, "건");
}

async function main() {
  const dateStr = kstDateStr();
  console.log("[market-report] 생성 시작:", dateStr);

  const indicators = await collectIndicators(dateStr);
  console.log(`[market-report] 지표 수집: ${indicators.filter(i => i._raw).length}/${indicators.length}`);

  const { system, user } = buildPrompt(indicators, dateStr);
  let body, mode;
  try {
    body = await callLLM(system, user);
    mode = "llm";
    console.log("[market-report] LLM 분석 완료");
  } catch (e) {
    console.warn("[market-report] LLM 실패, 룰 기반 폴백:", e.message);
    body = ruleBasedBody(indicators, kstNow());
    mode = "rule";
  }

  attachCodes(body.sectors, await loadStockMap(STOCKS_PATH));
  const report = assembleReport(dateStr, mode, indicators, body);

  await writeFile(OUT, JSON.stringify(report, null, 2) + "\n", "utf8");
  console.log("[market-report] 저장 완료:", OUT, `(source=${mode})`);
  await appendHistory(report);
}

main().catch(e => { console.error("[market-report] 치명적 오류:", e); process.exit(1); });
