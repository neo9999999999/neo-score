import React, { useState, useEffect, useRef, useMemo } from "react";

// ============================================================
// 침착해 종가베팅 AI 분석기 (v4.0)
// v3 → v4 변경점:
// - 4엔진 레이더차트 (SVG)
// - 가격 타임라인 (진입가/1차익절/2차익절/손절가 시각 라인)
// - 신뢰도 점수 + 균형도 경고
// - 엔진별 percentile (저장 기록 기반)
// - 등급별 본인 통계 (승률/평균수익률 자동 산출)
// ============================================================

const STORAGE_KEY = "chimchakhae_v4_records";

// ============================================================
// Helper 1: 등급별 본인 통계
// ============================================================
function calcGradeStats(records) {
  const grades = ["S+", "S", "A+", "A", "B+", "B", "C"];
  const stats = {};
  for (let i = 0; i < grades.length; i++) {
    stats[grades[i]] = { total: 0, traded: 0, wins: 0, totalPnl: 0, winRate: null, avgPnl: null };
  }
  for (let i = 0; i < records.length; i++) {
    const r = records[i];
    if (!r.result || !stats[r.result.grade]) continue;
    stats[r.result.grade].total++;
    if (r.buyPrice && r.sellPrice && r.buyPrice > 0) {
      stats[r.result.grade].traded++;
      const pnl = ((r.sellPrice - r.buyPrice) / r.buyPrice) * 100;
      stats[r.result.grade].totalPnl += pnl;
      if (pnl > 0) stats[r.result.grade].wins++;
    }
  }
  for (let i = 0; i < grades.length; i++) {
    const g = grades[i];
    if (stats[g].traded > 0) {
      stats[g].winRate = Math.round((stats[g].wins / stats[g].traded) * 100);
      stats[g].avgPnl = +((stats[g].totalPnl / stats[g].traded).toFixed(1));
    }
  }
  return stats;
}

// ============================================================
// Helper 2: 신뢰도 점수 (데이터 완전성 + AI 자체 평가)
// ============================================================
function calcConfidence(result) {
  if (!result) return 50;
  const data = result.extractedData || {};
  const fields = Object.keys(data);
  if (fields.length === 0) return 50;
  let filled = 0;
  for (let i = 0; i < fields.length; i++) {
    const v = data[fields[i]];
    if (v && v !== "확인불가" && v !== "-" && String(v).trim() !== "") filled++;
  }
  const dataConfidence = Math.round((filled / fields.length) * 100);
  if (typeof result.confidenceScore === "number") {
    return Math.round((dataConfidence + result.confidenceScore) / 2);
  }
  return dataConfidence;
}

// ============================================================
// Helper 3: 4엔진 균형도
// ============================================================
function calcBalance(engines) {
  if (!engines || !engines.supply || !engines.market || !engines.chart || !engines.material) return null;
  const ratios = [
    engines.supply.score / engines.supply.max,
    engines.market.score / engines.market.max,
    engines.chart.score / engines.chart.max,
    engines.material.score / engines.material.max,
  ];
  const avg = (ratios[0] + ratios[1] + ratios[2] + ratios[3]) / 4;
  let varSum = 0;
  for (let i = 0; i < 4; i++) varSum += (ratios[i] - avg) * (ratios[i] - avg);
  const stdDev = Math.sqrt(varSum / 4);
  const names = ["수급", "시황섹터", "차트", "재료"];
  let weakIdx = 0, strongIdx = 0;
  for (let i = 1; i < 4; i++) {
    if (ratios[i] < ratios[weakIdx]) weakIdx = i;
    if (ratios[i] > ratios[strongIdx]) strongIdx = i;
  }
  return {
    stdDev: stdDev,
    isBalanced: stdDev < 0.18,
    isMild: stdDev >= 0.18 && stdDev < 0.28,
    isHigh: stdDev >= 0.28,
    weakest: { name: names[weakIdx], ratio: ratios[weakIdx] },
    strongest: { name: names[strongIdx], ratio: ratios[strongIdx] },
    avgRatio: avg,
  };
}

// ============================================================
// Helper 4: 엔진별 percentile (저장 기록 대비 상위 몇%)
// ============================================================
function calcEnginePercentile(records, currentScore, engineKey) {
  if (!records || records.length < 3) return null;
  const allScores = [];
  for (let i = 0; i < records.length; i++) {
    const eng = records[i].result && records[i].result.engines && records[i].result.engines[engineKey];
    if (eng && typeof eng.score === "number") allScores.push(eng.score);
  }
  if (allScores.length < 3) return null;
  let below = 0;
  for (let i = 0; i < allScores.length; i++) if (allScores[i] < currentScore) below++;
  return Math.round((below / allScores.length) * 100);
}

// ============================================================
// Helper 5: 가격 파싱/포맷
// ============================================================
function parsePrice(v) {
  if (typeof v === "number" && !isNaN(v)) return v;
  if (typeof v === "string") {
    const cleaned = v.replace(/[^0-9.]/g, "");
    if (!cleaned) return null;
    const num = parseFloat(cleaned);
    return isNaN(num) ? null : num;
  }
  return null;
}
function fmtPrice(n) {
  if (n == null || isNaN(n)) return "-";
  if (n >= 1) return Math.round(n).toLocaleString();
  return n.toFixed(2);
}
function pctVs(target, base) {
  if (!base || target == null) return "";
  const p = ((target - base) / base) * 100;
  return (p > 0 ? "+" : "") + p.toFixed(2) + "%";
}

// ============================================================
// SVG: 4엔진 레이더 차트
// ============================================================
function RadarChart(props) {
  const engines = props.engines;
  const color = props.color || "#a855f7";
  if (!engines || !engines.supply) return null;

  const points = [
    { label: "수급", value: engines.supply.score / engines.supply.max, score: engines.supply.score, max: engines.supply.max },
    { label: "시황섹터", value: engines.market.score / engines.market.max, score: engines.market.score, max: engines.market.max },
    { label: "차트", value: engines.chart.score / engines.chart.max, score: engines.chart.score, max: engines.chart.max },
    { label: "재료", value: engines.material.score / engines.material.max, score: engines.material.score, max: engines.material.max },
  ];

  const cx = 160, cy = 160, R = 100;
  const angles = [-Math.PI / 2, 0, Math.PI / 2, Math.PI];

  function gridStr(scale) {
    const pts = [];
    for (let i = 0; i < 4; i++) {
      const x = cx + Math.cos(angles[i]) * R * scale;
      const y = cy + Math.sin(angles[i]) * R * scale;
      pts.push(x.toFixed(2) + "," + y.toFixed(2));
    }
    return pts.join(" ");
  }

  const dataPts = [];
  for (let i = 0; i < 4; i++) {
    const v = Math.max(points[i].value, 0.02);
    const x = cx + Math.cos(angles[i]) * R * v;
    const y = cy + Math.sin(angles[i]) * R * v;
    dataPts.push(x.toFixed(2) + "," + y.toFixed(2));
  }
  const dataStr = dataPts.join(" ");

  const labels = [
    { x: cx, y: cy - R - 22, anchor: "middle" },
    { x: cx + R + 18, y: cy + 4, anchor: "start" },
    { x: cx, y: cy + R + 30, anchor: "middle" },
    { x: cx - R - 18, y: cy + 4, anchor: "end" },
  ];

  return (
    <svg viewBox="0 0 320 320" style={{ width: "100%", maxWidth: "320px", height: "auto", display: "block", margin: "0 auto" }}>
      <polygon points={gridStr(1.0)} fill="none" stroke="#2f3648" strokeWidth="1" />
      <polygon points={gridStr(0.75)} fill="none" stroke="#252b3a" strokeWidth="1" />
      <polygon points={gridStr(0.5)} fill="none" stroke="#252b3a" strokeWidth="1" />
      <polygon points={gridStr(0.25)} fill="none" stroke="#252b3a" strokeWidth="1" />
      <line x1={cx} y1={cy} x2={cx} y2={cy - R} stroke="#252b3a" strokeWidth="1" />
      <line x1={cx} y1={cy} x2={cx + R} y2={cy} stroke="#252b3a" strokeWidth="1" />
      <line x1={cx} y1={cy} x2={cx} y2={cy + R} stroke="#252b3a" strokeWidth="1" />
      <line x1={cx} y1={cy} x2={cx - R} y2={cy} stroke="#252b3a" strokeWidth="1" />
      <polygon points={dataStr} fill={color + "33"} stroke={color} strokeWidth="2" strokeLinejoin="round" />
      {points.map(function (p, i) {
        const v = Math.max(p.value, 0.02);
        const x = cx + Math.cos(angles[i]) * R * v;
        const y = cy + Math.sin(angles[i]) * R * v;
        return <circle key={i} cx={x} cy={y} r={4.5} fill={color} stroke="#0a0d14" strokeWidth="1.5" />;
      })}
      {points.map(function (p, i) {
        return (
          <g key={"l" + i}>
            <text x={labels[i].x} y={labels[i].y} textAnchor={labels[i].anchor} fill="#eef1f8" fontSize="13" fontWeight="800">
              {p.label}
            </text>
            <text x={labels[i].x} y={labels[i].y + 14} textAnchor={labels[i].anchor} fill={color} fontSize="11" fontWeight="700" fontFamily="'JetBrains Mono', monospace">
              {p.score}/{p.max} ({Math.round(p.value * 100)}%)
            </text>
          </g>
        );
      })}
      <text x={cx} y={cy + 5} textAnchor="middle" fill="#5a6378" fontSize="9" fontWeight="700">100%</text>
    </svg>
  );
}

// ============================================================
// SVG: 가격 타임라인 (진입/익절1/익절2/손절)
// ============================================================
function PriceTimeline(props) {
  const strategy = props.strategy;
  const currentPriceRaw = props.currentPrice;
  if (!strategy) return null;

  const cp = parsePrice(currentPriceRaw);
  const sl = parsePrice(strategy.slPrice);
  const tp1 = parsePrice(strategy.tp1Price);
  const tp2 = parsePrice(strategy.tp2Price);
  const ent = parsePrice(strategy.entryPrice) || cp;

  if (!ent || !sl || !tp1) return null;

  const allPrices = [sl, ent, tp1];
  if (tp2) allPrices.push(tp2);
  if (cp) allPrices.push(cp);
  const minP = Math.min.apply(null, allPrices);
  const maxP = Math.max.apply(null, allPrices);
  const range = maxP - minP || 1;
  const pad = range * 0.18;
  const lo = minP - pad;
  const hi = maxP + pad;

  const W = 600, H = 280;
  const leftPad = 90, rightPad = 130;
  const topPad = 28, bottomPad = 28;
  const plotW = W - leftPad - rightPad;
  const plotH = H - topPad - bottomPad;

  function priceToY(p) {
    return topPad + plotH - ((p - lo) / (hi - lo)) * plotH;
  }

  const lines = [];
  if (tp2) lines.push({ price: tp2, label: "2차 익절", color: "#22c55e", solid: false });
  lines.push({ price: tp1, label: "1차 익절", color: "#22c55e", solid: false });
  lines.push({ price: ent, label: "진입가", color: "#fbbf24", solid: true });
  if (cp && cp !== ent && Math.abs(cp - ent) / ent > 0.001) {
    lines.push({ price: cp, label: "현재가", color: "#a855f7", solid: false });
  }
  lines.push({ price: sl, label: "손절가", color: "#3b82f6", solid: false });

  // 진입가 기준 손익비
  const riskPct = ent ? Math.abs((sl - ent) / ent) * 100 : 0;
  const reward1Pct = ent ? Math.abs((tp1 - ent) / ent) * 100 : 0;
  const reward2Pct = (ent && tp2) ? Math.abs((tp2 - ent) / ent) * 100 : 0;
  const rr1 = riskPct > 0 ? (reward1Pct / riskPct).toFixed(2) : "-";
  const rr2 = (riskPct > 0 && tp2) ? (reward2Pct / riskPct).toFixed(2) : null;

  return (
    <div>
      <svg viewBox={"0 0 " + W + " " + H} style={{ width: "100%", height: "auto", display: "block" }}>
        {/* 영역 배경: 익절 영역 (초록) / 손실 영역 (파랑) */}
        <rect x={leftPad} y={priceToY(Math.max.apply(null, allPrices))} width={plotW} height={priceToY(ent) - priceToY(Math.max.apply(null, allPrices))} fill="#22c55e" opacity="0.05" />
        <rect x={leftPad} y={priceToY(ent)} width={plotW} height={priceToY(sl) - priceToY(ent)} fill="#3b82f6" opacity="0.06" />
        {/* 중앙 가이드 */}
        <line x1={leftPad + plotW / 2} y1={topPad} x2={leftPad + plotW / 2} y2={topPad + plotH} stroke="#2f3648" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.5" />
        {lines.map(function (ln, i) {
          if (!ln.price) return null;
          const y = priceToY(ln.price);
          return (
            <g key={i}>
              <line x1={leftPad} y1={y} x2={leftPad + plotW} y2={y} stroke={ln.color} strokeWidth={ln.solid ? "2.5" : "1.8"} strokeDasharray={ln.solid ? "0" : "5 4"} opacity="0.9" />
              <rect x={6} y={y - 12} width={leftPad - 14} height={24} rx={5} fill={ln.color} opacity="0.18" />
              <text x={(leftPad - 8) / 2 + 6} y={y + 4} textAnchor="middle" fill={ln.color} fontSize="11" fontWeight="800">{ln.label}</text>
              <text x={leftPad + plotW + 10} y={y - 1} fill="#eef1f8" fontSize="13" fontWeight="700" fontFamily="'JetBrains Mono', monospace">{fmtPrice(ln.price)}</text>
              {ent && ln.price !== ent && (
                <text x={leftPad + plotW + 10} y={y + 13} fill={ln.color} fontSize="10" fontWeight="800" fontFamily="'JetBrains Mono', monospace">{pctVs(ln.price, ent)}</text>
              )}
            </g>
          );
        })}
      </svg>
      <div style={{ display: "grid", gridTemplateColumns: rr2 ? "1fr 1fr 1fr" : "1fr 1fr", gap: "8px", marginTop: "8px" }}>
        <div style={{ padding: "10px 12px", background: "#12161f", border: "1px solid #252b3a", borderRadius: "8px", textAlign: "center" }}>
          <div style={{ fontSize: "10px", color: "#8892a8", fontWeight: 700 }}>리스크</div>
          <div style={{ fontSize: "16px", fontWeight: 900, color: "#3b82f6", fontFamily: "'JetBrains Mono', monospace" }}>-{riskPct.toFixed(2)}%</div>
        </div>
        <div style={{ padding: "10px 12px", background: "#12161f", border: "1px solid #252b3a", borderRadius: "8px", textAlign: "center" }}>
          <div style={{ fontSize: "10px", color: "#8892a8", fontWeight: 700 }}>1차 손익비</div>
          <div style={{ fontSize: "16px", fontWeight: 900, color: rr1 >= 2 ? "#22c55e" : rr1 >= 1.5 ? "#fbbf24" : "#ff4757", fontFamily: "'JetBrains Mono', monospace" }}>1 : {rr1}</div>
        </div>
        {rr2 && (
          <div style={{ padding: "10px 12px", background: "#12161f", border: "1px solid #252b3a", borderRadius: "8px", textAlign: "center" }}>
            <div style={{ fontSize: "10px", color: "#8892a8", fontWeight: 700 }}>2차 손익비</div>
            <div style={{ fontSize: "16px", fontWeight: 900, color: rr2 >= 3 ? "#22c55e" : rr2 >= 2 ? "#fbbf24" : "#ff4757", fontFamily: "'JetBrains Mono', monospace" }}>1 : {rr2}</div>
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================================
// 텍스트 모드 분석 (모바일 대응) - v4 prompt
// ============================================================
async function analyzeWithText(textInput, stockName) {
  const prompt = "당신은 침착해 종가베팅 전문가다. 사용자가 텍스트로 제공한 정보를 4엔진 스코어링 모델로 분석하라.\n\n" +
    "━━ 사용자 입력 ━━\n" +
    (stockName ? "종목명: " + stockName + "\n" : "") +
    "정보:\n" + textInput + "\n\n" +
    "━━ 스코어링 (100점) ━━\n" +
    "1. 수급(35): 후반 동반매수15+일관성10+거래대금10\n" +
    "2. 시황섹터(25): 주도섹터10+지속성10+상대강도5\n" +
    "3. 차트(25): 매물대돌파10+정배열5+거래량5+종가캔들5\n" +
    "4. 재료(15): 재료타입10+익일모멘텀5\n\n" +
    "등급 7단계: S+(90+)25-30% / S(80-89)20-25% / A+(70-79)14-18% / A(60-69)10-13% / B+(50-59)5-8% / B(40-49)2-4% / C(<40)0%\n\n" +
    "━━ 가격 산출 가이드 (중요) ━━\n" +
    "현재가/종가 정보를 바탕으로 진입가/1차익절/2차익절/손절가를 실제 숫자(원)로 산출:\n" +
    "- entryPrice: 종가 또는 다음날 시초 부근 (= 현재가 ±1%)\n" +
    "- tp1Price: 진입가 +5~8% (S+급은 +8~12%)\n" +
    "- tp2Price: 진입가 +12~25% (S/A+급만 의미있음, B 이하는 null)\n" +
    "- slPrice: 진입가 -3~5% 또는 매물대 하단/지지선 (등급 낮을수록 타이트)\n" +
    "현재가 정보가 전혀 없으면 모두 null. 숫자만 입력 (콤마 X, 단위 X).\n\n" +
    "━━ 신뢰도 ━━\n" +
    "confidenceScore (0~100): 입력 정보의 완전성 + 분석 자신감. 핵심 정보(수급/차트/재료) 3개 모두 명시 = 80+, 1~2개만 = 50~70, 거의 없음 = 30 미만.\n\n" +
    "━━ 필수 JSON 출력 (다른 텍스트 금지) ━━\n" +
    "{\n" +
    '  "stockName":"종목명",\n' +
    '  "stockCode":"코드 또는 빈값",\n' +
    '  "extractedData":{"currentPrice":"","changeRate":"","tradingValue":"","foreignLate":"","instLate":"","progLate":"","threeDaysSupply":"","sector":"","sectorRank":"","chartPattern":"","breakoutType":"","maArrangement":"","volumeSurge":"","closeType":"","material":"","materialType":""},\n' +
    '  "engines":{\n' +
    '    "supply":{"score":N,"max":35,"breakdown":{"lateHours":N,"consistency":N,"volume":N},"reasoning":"..."},\n' +
    '    "market":{"score":N,"max":25,"breakdown":{"lead":N,"duration":N,"strength":N},"reasoning":"..."},\n' +
    '    "chart":{"score":N,"max":25,"breakdown":{"breakout":N,"ma":N,"volume":N,"close":N},"reasoning":"..."},\n' +
    '    "material":{"score":N,"max":15,"breakdown":{"type":N,"nextDay":N},"reasoning":"..."}\n' +
    "  },\n" +
    '  "supplyZone":{"level":"long|mid|short|none","levelLabel":"...","period":"...","thickness":"heavy|medium|thin","thicknessLabel":"...","status":"돌파|돌파시도|저항|안착","breakoutQuality":"...","detail":"..."},\n' +
    '  "technicalIndicators":{\n' +
    '    "rsi":{"status":"positive|neutral|negative|unknown","value":"","comment":""},\n' +
    '    "stochastic":{"status":"...","value":"","comment":""},\n' +
    '    "bollinger":{"status":"...","value":"","comment":""},\n' +
    '    "ichimoku":{"status":"...","value":"","comment":""},\n' +
    '    "envelope":{"status":"...","value":"","comment":""},\n' +
    '    "overallTone":"positive|neutral|negative",\n' +
    '    "summary":"..."\n' +
    "  },\n" +
    '  "totalScore":N,"grade":"S+|S|A+|A|B+|B|C","verdict":"...","recommendedWeight":N,"nextDayRiseProbability":N,\n' +
    '  "confidenceScore":N,\n' +
    '  "keyReasons":["...","...","...","...","..."],\n' +
    '  "risks":["...","..."],\n' +
    '  "strategy":{"entry":"","exit":"","stopLoss":"","hold":"","entryPrice":N,"tp1Price":N,"tp2Price":N,"slPrice":N},\n' +
    '  "chimchakhaeAnalysis":"5~7문장 종합평가"\n' +
    "}\n\n" +
    "사용자가 언급 안한 정보는 '확인불가'로. 가격 정보 없으면 entryPrice/tp1Price/tp2Price/slPrice 모두 null. JSON 외 텍스트 금지.";

  let rawResponse = "";

  if (typeof window !== "undefined" && window.claude && typeof window.claude.complete === "function") {
    try { rawResponse = await window.claude.complete(prompt); } catch (e) {}
  }

  if (!rawResponse) {
    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json", "anthropic-version": "2023-06-01" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 6000,
          messages: [{ role: "user", content: prompt }],
        }),
      });
      const t = await response.text();
      if (!response.ok) throw new Error("API " + response.status + ": " + t.substring(0, 300));
      const data = JSON.parse(t);
      if (data.error) throw new Error(data.error.message || "Unknown error");
      if (data.content && Array.isArray(data.content)) {
        for (let i = 0; i < data.content.length; i++) {
          if (data.content[i].type === "text") rawResponse += data.content[i].text;
        }
      }
    } catch (e) {
      throw new Error("두 가지 방식 모두 실패: " + e.message);
    }
  }

  if (!rawResponse) throw new Error("응답이 비어있음");

  let parsed = null;
  try { parsed = JSON.parse(rawResponse); } catch (e) {}
  if (!parsed) {
    const cleaned = rawResponse.replace(/```json/g, "").replace(/```/g, "").trim();
    try { parsed = JSON.parse(cleaned); } catch (e) {}
  }
  if (!parsed) {
    const m = rawResponse.match(/\{[\s\S]*\}/);
    if (m) { try { parsed = JSON.parse(m[0]); } catch (e) {} }
  }
  if (!parsed) {
    const fb = rawResponse.indexOf("{");
    const lb = rawResponse.lastIndexOf("}");
    if (fb !== -1 && lb !== -1) {
      try { parsed = JSON.parse(rawResponse.substring(fb, lb + 1)); } catch (e) {}
    }
  }
  if (!parsed) throw new Error("JSON 파싱 실패. 응답 앞 200자: " + rawResponse.substring(0, 200));

  if (!parsed.imagesAnalyzed) parsed.imagesAnalyzed = [];
  return parsed;
}

// ============================================================
// 이미지 모드 분석 - v4 prompt
// ============================================================
async function analyzeWithAI(images, stockName, memo) {
  const prompt = "당신은 침착해 종가베팅 기법의 최고 전문가입니다. 업로드된 이미지들(일봉차트, 분봉차트, 수급현황, 거래원, 공시, 뉴스, 섹터순위 등)을 모두 종합 분석해서 종가베팅 진입 여부를 판단하세요.\n\n" +
    "━━━━ 스코어링 규칙 (100점 만점) ━━━━\n\n" +
    "【1. 수급 엔진 (35점) - 최우선】\n" +
    "- 장 후반(14:00~) 동반매수 (15점): 외+기+프 3주체=15 / 2주체=10 / 1주체=5 / 마감직전 급감 시 -7\n" +
    "- 수급 일관성 (10점): 3일 연속 순매수=10 / 혼조=5 / 없음=0\n" +
    "- 거래대금 (10점): 1000억↑=10 / 500억↑=6 / 300억↑=3\n\n" +
    "【2. 시황·섹터 엔진 (25점)】\n" +
    "- 주도섹터 순위 (10점): 거래대금 1위=10 / 2-3위=7 / 4-5위=4\n" +
    "- 섹터 지속성 (10점): 정책·장기=10 / 며칠 연속=7 / 오늘만 반짝=2\n" +
    "- 섹터 내 상대강도 (5점): 1-3위 선도주=5 / 4-5위=3 / 그외=1\n\n" +
    "【3. 차트 엔진 (25점) - 매물대 중심 고도화】\n" +
    "- 매물대 돌파 강도 (10점): 장기(3개월+)=10 / 중기(1~3개월)=7-8 / 단기(2~4주)=5 / 박스권 시도=3 / 막힘=0-2\n" +
    "- 정배열 (5점): 완전정배열=5 / 전환중=3 / 5-10선 위=2 / 역배열=0\n" +
    "- 거래량 (5점): 전일 +100%↑=5 / +50%↑=3 / 보통=1\n" +
    "- 종가 캔들 (5점): 돌파형 장대양봉=5 / 매집봉=4 / 고가권=3 / 중간=1 / 윗꼬리 분산봉=-3\n\n" +
    "【4. 재료 엔진 (15점)】\n" +
    "- 재료 타입 (10점): 정책=10 / 실적=9 / 대형계약=8 / 테마=5 / 1회성=2\n" +
    "- 익일 모멘텀 (5점): 강함=5 / 보통=3 / 약함=1\n\n" +
    "━━━━ 등급 및 비중 (7단계) ━━━━\n" +
    "S+ (90~100점): 25~30% / S (80~89): 20~25% / A+ (70~79): 14~18% / A (60~69): 10~13% / B+ (50~59): 5~8% / B (40~49): 2~4% / C (<40): 0%\n\n" +
    "━━━━ 보조지표 분석 (점수 영향 없음) ━━━━\n" +
    "차트 이미지에서 보조지표 판독. 각 지표 positive/neutral/negative/unknown.\n" +
    "- RSI(와일더), 스토캐스틱(레인), 볼린저(존 볼린저), 일목균형표(이치모쿠), Envelope(±이평채널)\n\n" +
    "━━━━ 🆕 가격 산출 (v4 신규) ━━━━\n" +
    "차트의 현재가/종가/지지·저항선을 보고 실제 가격(원)으로 산출:\n" +
    "- entryPrice: 종가 또는 다음날 시초 부근 (현재가 기준 ±1%)\n" +
    "- tp1Price: 진입가 +5~8% (S+는 +8~12%, 매물대/저항 위까지)\n" +
    "- tp2Price: 진입가 +12~25% (S/A+급만, B이하면 null)\n" +
    "- slPrice: 진입가 -3~5% 또는 매물대 하단/지지선. 등급 낮을수록 타이트\n" +
    "차트에서 현재가 식별 불가시 모두 null. 숫자만 (콤마/단위 X).\n\n" +
    "━━━━ 🆕 신뢰도 (v4 신규) ━━━━\n" +
    "confidenceScore (0~100): 이미지 품질 + 데이터 가독성 + 분석 자신감.\n" +
    "차트/수급/재료 모두 선명하게 판독 가능 = 85+, 일부 흐릿/누락 = 60~80, 핵심 정보 부족 = 50 미만.\n\n" +
    "━━━━ 필수 JSON 출력 (다른 설명 금지) ━━━━\n" +
    "{\n" +
    '  "stockName": "종목명",\n' +
    '  "stockCode": "코드",\n' +
    '  "imagesAnalyzed": [ { "type": "분류", "summary": "핵심 데이터" } ],\n' +
    '  "extractedData": { "currentPrice":"", "changeRate":"", "tradingValue":"", "foreignLate":"", "instLate":"", "progLate":"", "threeDaysSupply":"", "sector":"", "sectorRank":"", "chartPattern":"", "breakoutType":"", "maArrangement":"", "volumeSurge":"", "closeType":"", "material":"", "materialType":"" },\n' +
    '  "engines": {\n' +
    '    "supply": { "score": 숫자, "max": 35, "breakdown": {"lateHours":숫자,"consistency":숫자,"volume":숫자}, "reasoning":"상세 근거" },\n' +
    '    "market": { "score": 숫자, "max": 25, "breakdown": {"lead":숫자,"duration":숫자,"strength":숫자}, "reasoning":"상세 근거" },\n' +
    '    "chart": { "score": 숫자, "max": 25, "breakdown": {"breakout":숫자,"ma":숫자,"volume":숫자,"close":숫자}, "reasoning":"상세 근거" },\n' +
    '    "material": { "score": 숫자, "max": 15, "breakdown": {"type":숫자,"nextDay":숫자}, "reasoning":"상세 근거" }\n' +
    "  },\n" +
    '  "supplyZone": { "level":"long|mid|short|none", "levelLabel":"장기|중기|단기|없음 매물대", "period":"형성 기간", "thickness":"heavy|medium|thin", "thicknessLabel":"두께 설명", "status":"돌파|돌파시도|저항|안착", "breakoutQuality":"돌파봉 품질", "detail":"3~5문장" },\n' +
    '  "technicalIndicators": {\n' +
    '    "rsi": { "status":"positive|neutral|negative|unknown", "value":"수치", "comment":"해석" },\n' +
    '    "stochastic": { "status":"...", "value":"%K/%D 상태", "comment":"..." },\n' +
    '    "bollinger": { "status":"...", "value":"밴드 위치", "comment":"..." },\n' +
    '    "ichimoku": { "status":"...", "value":"구름 위/아래/안", "comment":"..." },\n' +
    '    "envelope": { "status":"...", "value":"중심선 대비", "comment":"..." },\n' +
    '    "overallTone": "positive|neutral|negative",\n' +
    '    "summary": "보조지표 종합 톤 2~3문장"\n' +
    "  },\n" +
    '  "totalScore": 숫자,\n' +
    '  "grade": "S+|S|A+|A|B+|B|C",\n' +
    '  "verdict": "진입 강력추천|조건부 매수|관망|진입 보류",\n' +
    '  "recommendedWeight": 숫자(0~30),\n' +
    '  "nextDayRiseProbability": 숫자(0~100),\n' +
    '  "confidenceScore": 숫자(0~100),\n' +
    '  "keyReasons": ["근거1","근거2","근거3","근거4","근거5"],\n' +
    '  "risks": ["리스크1","리스크2"],\n' +
    '  "strategy": {"entry":"","exit":"","stopLoss":"","hold":"","entryPrice":숫자|null,"tp1Price":숫자|null,"tp2Price":숫자|null,"slPrice":숫자|null},\n' +
    '  "chimchakhaeAnalysis": "침착해 관점 5~7문장 종합 평가"\n' +
    "}\n\n" +
    "판독 불가 항목은 '확인불가'로. 가격 식별 불가시 null. JSON 외 텍스트 절대 금지.";

  const userInfo = (stockName ? "종목명: " + stockName + "\n" : "") + (memo ? "메모: " + memo : "");

  const content = [];
  for (let i = 0; i < images.length; i++) {
    content.push({
      type: "image",
      source: { type: "base64", media_type: images[i].mediaType || "image/png", data: images[i].base64 },
    });
  }
  content.push({ type: "text", text: prompt + "\n\n" + (userInfo || "종목 정보 없음. 이미지에서 추출.") });

  let totalKB = 0;
  for (let i = 0; i < images.length; i++) totalKB += Math.round((images[i].base64 || "").length * 0.75 / 1024);

  const requestBody = {
    model: "claude-sonnet-4-20250514",
    max_tokens: 8000,
    messages: [{ role: "user", content: content }],
  };

  let response;
  try {
    response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json", "anthropic-version": "2023-06-01" },
      body: JSON.stringify(requestBody),
    });
  } catch (fetchErr) {
    throw new Error("fetch 실패 (페이로드 " + totalKB + "KB · 이미지 " + images.length + "개): " + fetchErr.message);
  }

  let rawText;
  try { rawText = await response.text(); } catch (e) { throw new Error("응답 본문 읽기 실패. 상태:" + response.status); }

  if (!response.ok) {
    let detail = rawText;
    try {
      const errJson = JSON.parse(rawText);
      if (errJson.error && errJson.error.message) detail = errJson.error.message;
      else if (errJson.error && typeof errJson.error === "string") detail = errJson.error;
      else if (errJson.message) detail = errJson.message;
    } catch (e) {}
    throw new Error("API " + response.status + " (페이로드 " + totalKB + "KB): " + detail.substring(0, 400));
  }

  if (!rawText || rawText.length < 10) throw new Error("응답 본문 비어있음 (상태:" + response.status + ")");

  let data;
  try { data = JSON.parse(rawText); } catch (e) { throw new Error("응답이 JSON 아님. 본문 앞 300자: " + rawText.substring(0, 300)); }

  if (data.type === "error" || data.error) {
    const msg = (data.error && data.error.message) || data.error || "Unknown API error";
    throw new Error("API 에러: " + msg);
  }

  let text = "";
  if (data.content && Array.isArray(data.content)) {
    for (let i = 0; i < data.content.length; i++) {
      if (data.content[i].type === "text") text += data.content[i].text;
    }
  }
  if (!text) throw new Error("응답 content 비어있음. data 키: " + Object.keys(data).join(",") + " stop_reason:" + (data.stop_reason || "?"));

  let parsed = null;
  try { parsed = JSON.parse(text); } catch (e) {}
  if (!parsed) {
    const cleaned = text.replace(/```json/g, "").replace(/```/g, "").trim();
    try { parsed = JSON.parse(cleaned); } catch (e) {}
  }
  if (!parsed) {
    const m = text.match(/\{[\s\S]*\}/);
    if (m) { try { parsed = JSON.parse(m[0]); } catch (e) {} }
  }
  if (!parsed) {
    const fb = text.indexOf("{");
    const lb = text.lastIndexOf("}");
    if (fb !== -1 && lb !== -1) {
      try { parsed = JSON.parse(text.substring(fb, lb + 1)); } catch (e) {}
    }
  }
  if (!parsed) throw new Error("AI 응답 파싱 실패. 일부: " + text.substring(0, 200));
  return parsed;
}

// ============================================================
// 복기 평가 AI (v3와 동일)
// ============================================================
async function reviewWithAI(record, reviewImages, buyPrice, sellPrice) {
  const origScore = record.result.totalScore;
  const origGrade = record.result.grade;
  const origVerdict = record.result.verdict;
  const origProb = record.result.nextDayRiseProbability;
  const origWeight = record.result.recommendedWeight;
  const pnl = buyPrice > 0 ? ((sellPrice - buyPrice) / buyPrice) * 100 : 0;

  const prompt = "당신은 침착해 종가베팅 복기 전문가입니다. 과거 분석과 실제 매매 결과를 비교하여 복기 평가를 작성하세요.\n\n" +
    "━━━━ 원래 분석 ━━━━\n" +
    "종목: " + (record.stockName || "-") + "\n" +
    "종합점수: " + origScore + "점 / " + origGrade + "등급 / " + origVerdict + "\n" +
    "추천비중: " + origWeight + "% / 예상 상승확률: " + origProb + "%\n" +
    "침착해 분석: " + (record.result.chimchakhaeAnalysis || "") + "\n\n" +
    "━━━━ 실제 매매 결과 ━━━━\n" +
    "매수가: " + buyPrice + "원\n" +
    "매도가: " + sellPrice + "원\n" +
    "실제 손익률: " + pnl.toFixed(2) + "%\n\n" +
    "━━━━ 매도 후 차트 (이미지 첨부) ━━━━\n" +
    "매도 시점 또는 이후 차트를 보고 실제 흐름을 판독하여 아래 JSON으로 복기 리포트를 작성하세요.\n\n" +
    "{\n" +
    '  "outcome": "success|partial|failure",\n' +
    '  "outcomeLabel": "성공|부분성공|실패 + 1줄 요약",\n' +
    '  "predictionAccuracy": "예측 vs 실제 얼마나 맞았는지 2~3문장",\n' +
    '  "whatWorked": ["맞게 판단한 부분 1","2","3"],\n' +
    '  "whatMissed": ["놓친 부분 1","2","3"],\n' +
    '  "optimalExit": "더 나은 매도 타이밍",\n' +
    '  "lessonLearned": "다음번 적용할 핵심 교훈 3~5문장",\n' +
    '  "patternTag": "이 매매의 패턴 한마디"\n' +
    "}\n\n" +
    "JSON 외 텍스트 금지.";

  const content = [];
  for (let i = 0; i < reviewImages.length; i++) {
    content.push({
      type: "image",
      source: { type: "base64", media_type: reviewImages[i].mediaType || "image/png", data: reviewImages[i].base64 },
    });
  }
  content.push({ type: "text", text: prompt });

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json", "anthropic-version": "2023-06-01" },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 4000,
      messages: [{ role: "user", content: content }],
    }),
  });
  if (!response.ok) {
    const t = await response.text();
    throw new Error("복기 API 오류: " + response.status + " - " + t);
  }
  const data = await response.json();
  let text = "";
  if (data.content && Array.isArray(data.content)) {
    for (let i = 0; i < data.content.length; i++) {
      if (data.content[i].type === "text") text += data.content[i].text;
    }
  }
  let parsed = null;
  try { parsed = JSON.parse(text); } catch (e) {}
  if (!parsed) {
    const cleaned = text.replace(/```json/g, "").replace(/```/g, "").trim();
    try { parsed = JSON.parse(cleaned); } catch (e) {}
  }
  if (!parsed) {
    const m = text.match(/\{[\s\S]*\}/);
    if (m) { try { parsed = JSON.parse(m[0]); } catch (e) {} }
  }
  if (!parsed) throw new Error("복기 응답 파싱 실패");
  return parsed;
}

export default function ChimchakhaeAI() {
  const [tab, setTab] = useState("analyze");
  const [analyzeMode, setAnalyzeMode] = useState("image");
  const [textInput, setTextInput] = useState("");
  const [images, setImages] = useState([]);
  const [stockName, setStockName] = useState("");
  const [memo, setMemo] = useState("");
  const [analyzing, setAnalyzing] = useState(false);
  const [progress, setProgress] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [records, setRecords] = useState([]);
  const [loadingRecords, setLoadingRecords] = useState(true);
  const [dragOver, setDragOver] = useState(false);
  const [detailRecord, setDetailRecord] = useState(null);
  const [buyPriceInput, setBuyPriceInput] = useState("");
  const [sellPriceInput, setSellPriceInput] = useState("");
  const [reviewImages, setReviewImages] = useState([]);
  const [reviewing, setReviewing] = useState(false);
  const fileInputRef = useRef(null);
  const reviewFileRef = useRef(null);

  // 등급별 본인 통계 (useMemo로 캐시)
  const gradeStats = useMemo(function () { return calcGradeStats(records); }, [records]);

  useEffect(function () {
    async function loadRecords() {
      try {
        const r = await window.storage.get(STORAGE_KEY);
        if (r && r.value) setRecords(JSON.parse(r.value));
      } catch (e) {}
      // v3 마이그레이션 시도
      try {
        const oldR = await window.storage.get("chimchakhae_v3_records");
        if (oldR && oldR.value) {
          const oldData = JSON.parse(oldR.value);
          if (oldData && oldData.length > 0) {
            const newR = await window.storage.get(STORAGE_KEY);
            if (!newR || !newR.value) {
              await window.storage.set(STORAGE_KEY, JSON.stringify(oldData));
              setRecords(oldData);
            }
          }
        }
      } catch (e) {}
      setLoadingRecords(false);
    }
    loadRecords();
  }, []);

  function processImageFile(file) {
    return new Promise(function (resolve, reject) {
      const reader = new FileReader();
      reader.onerror = function () { reject(new Error("파일 읽기 실패: " + file.name)); };
      reader.onload = function (ev) {
        const img = new Image();
        img.onerror = function () { reject(new Error("이미지 형식 미지원 (" + file.name + "). HEIC라면 JPEG/PNG로 변환 후 업로드")); };
        img.onload = function () {
          const MAX = 1024;
          let w = img.naturalWidth;
          let h = img.naturalHeight;
          if (w > MAX || h > MAX) {
            if (w > h) { h = Math.round(h * (MAX / w)); w = MAX; }
            else { w = Math.round(w * (MAX / h)); h = MAX; }
          }
          const canvas = document.createElement("canvas");
          canvas.width = w; canvas.height = h;
          const ctx = canvas.getContext("2d");
          ctx.fillStyle = "#ffffff";
          ctx.fillRect(0, 0, w, h);
          ctx.drawImage(img, 0, 0, w, h);
          const jpegDataUrl = canvas.toDataURL("image/jpeg", 0.7);
          const base64 = jpegDataUrl.split(",")[1];
          if (!base64 || base64.length < 100) { reject(new Error("이미지 변환 실패: " + file.name)); return; }
          resolve({
            id: Date.now() + Math.random(),
            name: file.name,
            dataUrl: jpegDataUrl,
            base64: base64,
            mediaType: "image/jpeg",
            sizeKB: Math.round(base64.length * 0.75 / 1024),
          });
        };
        img.src = ev.target.result;
      };
      reader.readAsDataURL(file);
    });
  }

  async function handleFiles(files, target) {
    if (!files || files.length === 0) return;
    const arr = Array.from(files).filter(function (f) { return f.type.startsWith("image/") || f.name.match(/\.(jpg|jpeg|png|gif|webp|heic|heif)$/i); });
    if (arr.length === 0) { setError("이미지 파일이 아닙니다"); return; }
    setError("");
    for (let i = 0; i < arr.length; i++) {
      try {
        const obj = await processImageFile(arr[i]);
        if (target === "review") setReviewImages(function (prev) { return prev.concat([obj]); });
        else setImages(function (prev) { return prev.concat([obj]); });
      } catch (e) { setError(e.message); }
    }
  }

  function removeImage(id) { setImages(function (prev) { return prev.filter(function (img) { return img.id !== id; }); }); }
  function removeReviewImage(id) { setReviewImages(function (prev) { return prev.filter(function (img) { return img.id !== id; }); }); }

  async function runAnalysis() {
    if (analyzeMode === "image") {
      if (images.length === 0) { setError("이미지를 1개 이상 업로드하세요"); return; }
      let totalKB = 0;
      for (let i = 0; i < images.length; i++) totalKB += images[i].sizeKB || 0;
      setError(""); setAnalyzing(true);
      setProgress("이미지 " + images.length + "개 (" + totalKB + "KB) · 4엔진 + 매물대 + 보조지표 + 가격산출 분석중...");
      try {
        const res = await analyzeWithAI(images, stockName, memo);
        setResult(res);
        setTimeout(function () { const el = document.getElementById("result-top"); if (el) el.scrollIntoView({ behavior: "smooth" }); }, 150);
      } catch (e) {
        let extraHint = "";
        if (e.message.indexOf("Invalid response format") !== -1 || e.message.indexOf("fetch 실패") !== -1) {
          extraHint = "\n\n🚨 모바일 Claude 앱은 이미지 fetch가 차단됩니다.\n→ 위에서 ✏️ 텍스트 모드로 전환하세요\n→ 또는 PC 브라우저에서 이용";
        }
        setError("분석 실패\n" + e.message + "\n\n[디버그]\n· 이미지 " + images.length + "개\n· 페이로드 " + totalKB + "KB" + extraHint);
      }
      setAnalyzing(false); setProgress("");
    } else {
      if (textInput.trim().length < 20) { setError("정보를 더 자세히 입력해주세요 (최소 20자)"); return; }
      setError(""); setAnalyzing(true);
      setProgress("텍스트 " + textInput.length + "자 → 4엔진 스코어링 + 가격산출 중...");
      try {
        const res = await analyzeWithText(textInput, stockName);
        setResult(res);
        setTimeout(function () { const el = document.getElementById("result-top"); if (el) el.scrollIntoView({ behavior: "smooth" }); }, 150);
      } catch (e) {
        setError("분석 실패\n" + e.message);
      }
      setAnalyzing(false); setProgress("");
    }
  }

  async function saveResult() {
    if (!result) return;
    const rec = {
      id: Date.now(),
      date: new Date().toISOString(),
      stockName: result.stockName || stockName || "-",
      stockCode: result.stockCode || "",
      result: result,
      thumbnailImage: images.length > 0 ? images[0].dataUrl : null,
      imageCount: images.length,
      memo: memo,
      actualResult: null,
      buyPrice: null,
      sellPrice: null,
      reviewImages: [],
      reviewReport: null,
    };
    const next = [rec].concat(records);
    setRecords(next);
    try { await window.storage.set(STORAGE_KEY, JSON.stringify(next)); alert("저장 완료"); } catch (e) { alert("저장 실패: " + e.message); }
  }

  function resetAll() { setImages([]); setStockName(""); setMemo(""); setResult(null); setError(""); setTextInput(""); }

  async function updateRecord(id, patch) {
    const next = records.map(function (r) {
      if (r.id === id) return Object.assign({}, r, patch);
      return r;
    });
    setRecords(next);
    if (detailRecord && detailRecord.id === id) setDetailRecord(Object.assign({}, detailRecord, patch));
    try { await window.storage.set(STORAGE_KEY, JSON.stringify(next)); } catch (e) {}
  }

  async function deleteRecord(id) {
    if (!confirm("삭제하시겠습니까?")) return;
    const next = records.filter(function (r) { return r.id !== id; });
    setRecords(next);
    if (detailRecord && detailRecord.id === id) setDetailRecord(null);
    try { await window.storage.set(STORAGE_KEY, JSON.stringify(next)); } catch (e) {}
  }

  async function saveBuyPrice() {
    if (!detailRecord) return;
    const bp = Number(buyPriceInput);
    if (!bp || bp <= 0) { alert("매수가를 숫자로 입력하세요"); return; }
    await updateRecord(detailRecord.id, { buyPrice: bp });
    alert("매수가 저장 완료: " + bp.toLocaleString() + "원");
  }

  async function runReview() {
    if (!detailRecord) return;
    const bp = Number(detailRecord.buyPrice || buyPriceInput);
    const sp = Number(sellPriceInput);
    if (!bp || bp <= 0) { alert("매수가가 먼저 필요합니다"); return; }
    if (!sp || sp <= 0) { alert("매도가를 입력하세요"); return; }
    if (reviewImages.length === 0) { alert("매도 후 차트 이미지를 1개 이상 업로드하세요"); return; }

    setReviewing(true);
    try {
      const report = await reviewWithAI(detailRecord, reviewImages, bp, sp);
      const reviewImgData = reviewImages.map(function (img) { return { dataUrl: img.dataUrl, name: img.name }; });
      await updateRecord(detailRecord.id, {
        buyPrice: bp,
        sellPrice: sp,
        reviewImages: reviewImgData,
        reviewReport: report,
        actualResult: report.outcome === "success" ? "win" : report.outcome === "failure" ? "loss" : "partial",
      });
      setReviewImages([]); setSellPriceInput("");
      alert("복기 평가 완료");
    } catch (e) { alert("복기 실패: " + e.message); }
    setReviewing(false);
  }

  function openDetail(rec) {
    setDetailRecord(rec);
    setBuyPriceInput(rec.buyPrice ? String(rec.buyPrice) : "");
    setSellPriceInput(rec.sellPrice ? String(rec.sellPrice) : "");
    setReviewImages([]);
  }
  function closeDetail() { setDetailRecord(null); setBuyPriceInput(""); setSellPriceInput(""); setReviewImages([]); }

  // ─────── 스타일 ───────
  const C = {
    bg: "#0a0d14", card: "#12161f", cardRaised: "#1a1f2b",
    border: "#252b3a", borderLight: "#2f3648",
    text: "#eef1f8", textDim: "#8892a8", textMuted: "#5a6378",
    red: "#ff4757", redSoft: "rgba(255, 71, 87, 0.12)",
    blue: "#3b82f6", blueSoft: "rgba(59, 130, 246, 0.12)",
    green: "#22c55e", greenSoft: "rgba(34, 197, 94, 0.12)",
    gold: "#fbbf24", goldSoft: "rgba(251, 191, 36, 0.12)",
    purple: "#a855f7", purpleSoft: "rgba(168, 85, 247, 0.1)",
  };

  const S = {
    root: { minHeight: "100vh", background: C.bg, color: C.text, fontFamily: "'Pretendard', -apple-system, BlinkMacSystemFont, sans-serif", padding: "16px 12px" },
    maxWidth: { maxWidth: "1180px", margin: "0 auto" },
    header: { display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "16px", marginBottom: "24px", paddingBottom: "20px", borderBottom: "1px solid " + C.border },
    titleBox: { display: "flex", alignItems: "center", gap: "12px" },
    logoBadge: { width: "42px", height: "42px", background: "linear-gradient(135deg, #ff4757 0%, #a855f7 100%)", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px", fontWeight: 900 },
    title: { fontSize: "22px", fontWeight: 800, letterSpacing: "-0.5px", margin: 0 },
    subtitle: { fontSize: "12px", color: C.textDim, marginTop: "3px", fontWeight: 500 },
    tabs: { display: "flex", gap: "4px", background: C.card, padding: "4px", borderRadius: "10px", border: "1px solid " + C.border },
    dropzone: function (isDrag) { return { border: "2px dashed " + (isDrag ? C.blue : C.borderLight), borderRadius: "14px", padding: "40px 20px", textAlign: "center", background: isDrag ? C.blueSoft : C.card, cursor: "pointer", transition: "all 0.15s", marginBottom: "20px" }; },
    dropIcon: { fontSize: "40px", marginBottom: "8px" },
    imageGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))", gap: "10px", marginBottom: "20px" },
    imageItem: { position: "relative", borderRadius: "8px", overflow: "hidden", border: "1px solid " + C.border, aspectRatio: "16/10", background: C.card },
    removeBtn: { position: "absolute", top: "6px", right: "6px", width: "24px", height: "24px", borderRadius: "50%", background: "rgba(0,0,0,0.7)", color: "#fff", border: "none", cursor: "pointer", fontSize: "14px", fontWeight: 700 },
    imageName: { position: "absolute", bottom: 0, left: 0, right: 0, padding: "4px 8px", background: "rgba(0,0,0,0.7)", fontSize: "10px", color: "#fff", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" },
    inputRow: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "10px", marginBottom: "16px" },
    input: { background: C.card, border: "1px solid " + C.border, borderRadius: "10px", padding: "12px 14px", color: C.text, fontSize: "14px", outline: "none", fontFamily: "inherit", width: "100%", boxSizing: "border-box" },
    btnPrimary: { background: "linear-gradient(135deg, #ff4757 0%, #a855f7 100%)", color: "#fff", border: "none", borderRadius: "12px", padding: "16px 24px", fontSize: "15px", fontWeight: 800, cursor: "pointer", width: "100%", fontFamily: "inherit", letterSpacing: "0.3px" },
    btnPrimaryDisabled: { opacity: 0.5, cursor: "not-allowed" },
    btnSecondary: { background: C.card, color: C.text, border: "1px solid " + C.border, borderRadius: "10px", padding: "10px 18px", fontSize: "13px", fontWeight: 600, cursor: "pointer", fontFamily: "inherit" },
    errorBox: { background: C.redSoft, border: "1px solid " + C.red, borderRadius: "10px", padding: "12px 16px", fontSize: "13px", color: C.red, marginBottom: "16px", whiteSpace: "pre-wrap", wordBreak: "break-word", lineHeight: 1.5 },
    analyzingBox: { background: C.card, border: "1px solid " + C.border, borderRadius: "14px", padding: "40px 20px", textAlign: "center" },
    loader: { width: "48px", height: "48px", border: "3px solid " + C.border, borderTopColor: C.blue, borderRadius: "50%", margin: "0 auto 16px", animation: "spin 0.8s linear infinite" },
    heroCard: { background: "linear-gradient(135deg, #12161f 0%, #1a1f2b 100%)", border: "1px solid " + C.borderLight, borderRadius: "16px", padding: "28px", marginBottom: "16px" },
    heroGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "16px", alignItems: "center" },
    metricLabel: { fontSize: "11px", color: C.textDim, fontWeight: 700, textTransform: "uppercase", letterSpacing: "1px", marginBottom: "8px" },
    bigNum: { fontSize: "64px", fontWeight: 900, lineHeight: 1, letterSpacing: "-2px", fontFamily: "'JetBrains Mono', 'IBM Plex Mono', monospace" },
    bigNumMed: { fontSize: "40px", fontWeight: 900, lineHeight: 1, letterSpacing: "-1px", fontFamily: "'JetBrains Mono', monospace" },
    gradeBadge: { display: "inline-block", padding: "5px 12px", borderRadius: "6px", fontSize: "12px", fontWeight: 800, marginTop: "12px" },
    section: { background: C.card, border: "1px solid " + C.border, borderRadius: "14px", padding: "22px", marginBottom: "16px" },
    sectionTitle: { fontSize: "14px", fontWeight: 800, marginBottom: "16px", display: "flex", alignItems: "center", gap: "8px", letterSpacing: "-0.2px" },
    enginesGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "10px" },
    engineCard: { background: C.cardRaised, border: "1px solid " + C.border, borderRadius: "10px", padding: "16px" },
    engineHead: { display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "12px" },
    engineName: { fontSize: "12px", color: C.textDim, fontWeight: 700 },
    engineScore: { fontSize: "24px", fontWeight: 900, fontFamily: "'JetBrains Mono', monospace", lineHeight: 1 },
    engineMax: { fontSize: "11px", color: C.textMuted, marginLeft: "3px" },
    progressBar: { height: "5px", background: C.border, borderRadius: "3px", overflow: "hidden" },
    breakdownRow: { display: "flex", justifyContent: "space-between", fontSize: "11px", padding: "3px 0", color: C.textDim },
    dataTable: { display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "0", background: C.cardRaised, borderRadius: "10px", border: "1px solid " + C.border, overflow: "hidden" },
    dataCell: { padding: "12px 14px", borderBottom: "1px solid " + C.border, borderRight: "1px solid " + C.border, display: "flex", justifyContent: "space-between", fontSize: "13px" },
    dataKey: { color: C.textDim, fontSize: "12px" },
    dataVal: { color: C.text, fontWeight: 600, textAlign: "right" },
    bulletList: { listStyle: "none", padding: 0, margin: 0 },
    bulletItem: { padding: "10px 14px", background: C.cardRaised, borderRadius: "8px", marginBottom: "6px", fontSize: "13px", display: "flex", gap: "10px", lineHeight: 1.5 },
    riskItem: { padding: "10px 14px", background: C.redSoft, borderRadius: "8px", marginBottom: "6px", fontSize: "13px", color: "#ffaaaa", borderLeft: "3px solid " + C.red, display: "flex", gap: "10px", lineHeight: 1.5 },
    strategyGrid: { display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "10px" },
    strategyCard: { background: C.cardRaised, borderRadius: "10px", padding: "14px", border: "1px solid " + C.border },
    strategyLabel: { fontSize: "11px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "6px" },
    strategyText: { fontSize: "13px", lineHeight: 1.5, color: C.text },
    chimchakhaeBox: { background: "linear-gradient(135deg, rgba(168, 85, 247, 0.08) 0%, rgba(59, 130, 246, 0.08) 100%)", border: "1px solid rgba(168, 85, 247, 0.3)", borderRadius: "14px", padding: "22px", fontSize: "14px", lineHeight: 1.7, color: C.text, marginBottom: "16px" },
    imageSummary: { padding: "10px 14px", background: C.cardRaised, borderRadius: "8px", marginBottom: "6px", fontSize: "12px", display: "flex", gap: "10px", alignItems: "center" },
    imageTag: { fontSize: "10px", padding: "2px 8px", background: C.blueSoft, color: C.blue, borderRadius: "4px", fontWeight: 700, flexShrink: 0 },
    supplyZoneCard: { background: C.cardRaised, border: "1px solid " + C.border, borderRadius: "10px", padding: "18px" },
    supplyZoneGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))", gap: "8px", marginBottom: "14px" },
    supplyZoneStatCell: { padding: "12px", background: C.bg, borderRadius: "8px", textAlign: "center" },
    indicatorGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "10px", marginBottom: "14px" },
    indicatorCard: { padding: "14px", borderRadius: "10px", border: "1px solid " + C.border },
    indicatorTop: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" },
    indicatorName: { fontSize: "12px", fontWeight: 800, letterSpacing: "-0.2px" },
    indicatorDot: { width: "10px", height: "10px", borderRadius: "50%" },
    indicatorValue: { fontSize: "14px", fontWeight: 700, color: C.text, marginBottom: "6px" },
    indicatorComment: { fontSize: "11px", color: C.textDim, lineHeight: 1.5 },
    recordCard: { background: C.card, border: "1px solid " + C.border, borderRadius: "12px", padding: "16px", marginBottom: "12px", cursor: "pointer", transition: "border-color 0.15s" },
    empty: { textAlign: "center", padding: "60px 20px", color: C.textDim },
    btnRow: { display: "flex", gap: "10px", marginTop: "18px" },
    modalOverlay: { position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0, 0, 0, 0.75)", zIndex: 1000, display: "flex", alignItems: "flex-start", justifyContent: "center", padding: "30px 20px", overflowY: "auto" },
    modal: { background: C.bg, border: "1px solid " + C.borderLight, borderRadius: "16px", maxWidth: "1000px", width: "100%", padding: "24px", position: "relative" },
    modalClose: { position: "absolute", top: "16px", right: "16px", background: C.card, border: "1px solid " + C.border, color: C.text, width: "32px", height: "32px", borderRadius: "50%", cursor: "pointer", fontSize: "16px", fontWeight: 700 },
  };

  function gradeColor(grade) {
    if (grade === "S+") return "#ff1744";
    if (grade === "S") return C.red;
    if (grade === "A+") return "#ff8800";
    if (grade === "A") return C.gold;
    if (grade === "B+") return "#5b9bd5";
    if (grade === "B") return C.textDim;
    return C.blue;
  }
  function statusColor(status) {
    if (status === "positive") return C.green;
    if (status === "negative") return C.red;
    if (status === "unknown") return C.textMuted;
    return C.gold;
  }
  function statusLabel(status) {
    if (status === "positive") return "긍정";
    if (status === "negative") return "부정";
    if (status === "unknown") return "미판독";
    return "중립";
  }

  // ────── renderResultBody (v4 대폭 확장) ──────
  function renderResultBody(res, thumbImage) {
    const balance = calcBalance(res.engines);
    const confidence = calcConfidence(res);
    const myGradeStat = gradeStats[res.grade];
    const supplyPct = calcEnginePercentile(records, res.engines.supply.score, "supply");
    const marketPct = calcEnginePercentile(records, res.engines.market.score, "market");
    const chartPct = calcEnginePercentile(records, res.engines.chart.score, "chart");
    const materialPct = calcEnginePercentile(records, res.engines.material.score, "material");
    const enginePcts = { supply: supplyPct, market: marketPct, chart: chartPct, material: materialPct };

    return (
      <div>
        {/* ─── HERO ─── */}
        <div style={S.heroCard}>
          <div style={{ marginBottom: "20px" }}>
            <div style={{ fontSize: "13px", color: C.textDim, fontWeight: 600 }}>
              {res.stockName || "-"} {res.stockCode && "· " + res.stockCode}
            </div>
          </div>
          <div style={S.heroGrid}>
            <div>
              <div style={S.metricLabel}>종합 스코어</div>
              <div style={Object.assign({}, S.bigNum, { color: gradeColor(res.grade) })}>
                {res.totalScore}<span style={{ fontSize: "22px", color: C.textMuted, fontWeight: 700 }}> /100</span>
              </div>
              <div>
                <span style={Object.assign({}, S.gradeBadge, { background: gradeColor(res.grade), color: "#fff" })}>{res.grade}등급</span>
                <span style={{ marginLeft: "10px", fontSize: "14px", fontWeight: 700, color: gradeColor(res.grade) }}>{res.verdict}</span>
              </div>
            </div>
            <div style={{ borderLeft: "1px solid " + C.border, paddingLeft: "24px" }}>
              <div style={S.metricLabel}>추천 비중</div>
              <div style={Object.assign({}, S.bigNumMed, { color: res.recommendedWeight >= 15 ? C.red : res.recommendedWeight > 0 ? C.gold : C.textMuted })}>
                {res.recommendedWeight}<span style={{ fontSize: "20px" }}>%</span>
              </div>
              <div style={{ fontSize: "12px", color: C.textDim, marginTop: "6px" }}>
                자본 대비 <strong style={{ color: C.text }}>{res.recommendedWeight}%</strong> 투입
              </div>
            </div>
            <div style={{ borderLeft: "1px solid " + C.border, paddingLeft: "24px" }}>
              <div style={S.metricLabel}>익일 상승 확률</div>
              <div style={Object.assign({}, S.bigNumMed, { color: res.nextDayRiseProbability >= 70 ? C.red : res.nextDayRiseProbability >= 55 ? C.gold : C.blue })}>
                {res.nextDayRiseProbability}<span style={{ fontSize: "20px" }}>%</span>
              </div>
              <div style={{ fontSize: "12px", color: C.textDim, marginTop: "6px" }}>
                {res.nextDayRiseProbability >= 70 ? "높음" : res.nextDayRiseProbability >= 55 ? "보통 이상" : res.nextDayRiseProbability >= 40 ? "보통" : "낮음"}
              </div>
            </div>
          </div>

          {/* 본인 등급 통계 + 신뢰도 (v4 신규) */}
          <div style={{ display: "grid", gridTemplateColumns: myGradeStat && myGradeStat.traded > 0 ? "1.5fr 1fr" : "1fr", gap: "10px", marginTop: "20px", paddingTop: "18px", borderTop: "1px solid " + C.border }}>
            {myGradeStat && myGradeStat.traded > 0 && (
              <div style={{ background: C.cardRaised, borderRadius: "10px", padding: "14px", borderLeft: "3px solid " + gradeColor(res.grade) }}>
                <div style={{ fontSize: "10px", color: C.textDim, fontWeight: 700, textTransform: "uppercase", letterSpacing: "1px", marginBottom: "8px" }}>
                  📊 내 {res.grade} 등급 실전 통계
                </div>
                <div style={{ display: "flex", gap: "16px", flexWrap: "wrap", alignItems: "center" }}>
                  <div>
                    <span style={{ fontSize: "10px", color: C.textDim }}>거래 </span>
                    <span style={{ fontSize: "16px", fontWeight: 800, color: C.text, fontFamily: "'JetBrains Mono', monospace" }}>{myGradeStat.traded}회</span>
                  </div>
                  <div>
                    <span style={{ fontSize: "10px", color: C.textDim }}>승률 </span>
                    <span style={{ fontSize: "20px", fontWeight: 900, color: myGradeStat.winRate >= 60 ? C.green : myGradeStat.winRate >= 40 ? C.gold : C.red, fontFamily: "'JetBrains Mono', monospace" }}>{myGradeStat.winRate}%</span>
                  </div>
                  <div>
                    <span style={{ fontSize: "10px", color: C.textDim }}>평균수익률 </span>
                    <span style={{ fontSize: "20px", fontWeight: 900, color: myGradeStat.avgPnl > 0 ? C.red : C.blue, fontFamily: "'JetBrains Mono', monospace" }}>
                      {myGradeStat.avgPnl > 0 ? "+" : ""}{myGradeStat.avgPnl}%
                    </span>
                  </div>
                </div>
              </div>
            )}
            <div style={{ background: C.cardRaised, borderRadius: "10px", padding: "14px", borderLeft: "3px solid " + (confidence >= 75 ? C.green : confidence >= 50 ? C.gold : C.red) }}>
              <div style={{ fontSize: "10px", color: C.textDim, fontWeight: 700, textTransform: "uppercase", letterSpacing: "1px", marginBottom: "8px" }}>
                🎯 분석 신뢰도
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <div style={{ fontSize: "28px", fontWeight: 900, color: confidence >= 75 ? C.green : confidence >= 50 ? C.gold : C.red, fontFamily: "'JetBrains Mono', monospace", lineHeight: 1 }}>
                  {confidence}<span style={{ fontSize: "14px", color: C.textMuted }}>%</span>
                </div>
                <div style={{ flex: 1, fontSize: "11px", color: C.textDim, lineHeight: 1.4 }}>
                  {confidence >= 75 ? "데이터 풍부, 분석 신뢰 가능" : confidence >= 50 ? "일부 누락, 보수적 판단 권장" : "정보 부족, 추가 확인 필수"}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ─── 4엔진 (레이더 + 카드 percentile) ─── */}
        <div style={S.section}>
          <div style={S.sectionTitle}>🔬 4엔진 종합 분석</div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "16px", alignItems: "center", marginBottom: "20px" }}>
            <div style={{ background: C.cardRaised, borderRadius: "12px", padding: "16px", border: "1px solid " + C.border }}>
              <RadarChart engines={res.engines} color={gradeColor(res.grade)} />
            </div>
            <div>
              {balance && (
                <div style={{ background: balance.isHigh ? C.redSoft : balance.isMild ? C.goldSoft : C.greenSoft, border: "1px solid " + (balance.isHigh ? C.red : balance.isMild ? C.gold : C.green), borderRadius: "10px", padding: "14px", marginBottom: "12px" }}>
                  <div style={{ fontSize: "11px", fontWeight: 800, color: balance.isHigh ? C.red : balance.isMild ? C.gold : C.green, marginBottom: "6px" }}>
                    {balance.isHigh ? "⚠️ 심한 불균형" : balance.isMild ? "⚖️ 약한 불균형" : "✅ 균형 잡힘"}
                  </div>
                  <div style={{ fontSize: "12px", color: C.text, lineHeight: 1.5 }}>
                    가장 강한 엔진: <strong style={{ color: C.green }}>{balance.strongest.name}</strong> ({Math.round(balance.strongest.ratio * 100)}%)
                    <br />
                    가장 약한 엔진: <strong style={{ color: balance.isHigh ? C.red : C.gold }}>{balance.weakest.name}</strong> ({Math.round(balance.weakest.ratio * 100)}%)
                    {balance.isHigh && (
                      <div style={{ marginTop: "6px", fontSize: "11px", color: C.textDim }}>
                        한쪽으로 치우침. {balance.weakest.name} 엔진 점수가 낮아 변동성 위험 존재.
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* 4엔진 한 줄 요약 */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "8px" }}>
                {[
                  { key: "supply", label: "수급", color: C.red, data: res.engines.supply, pct: enginePcts.supply },
                  { key: "market", label: "시황섹터", color: C.blue, data: res.engines.market, pct: enginePcts.market },
                  { key: "chart", label: "차트", color: C.green, data: res.engines.chart, pct: enginePcts.chart },
                  { key: "material", label: "재료", color: C.gold, data: res.engines.material, pct: enginePcts.material },
                ].map(function (eng) {
                  const ratio = eng.data.score / eng.data.max;
                  return (
                    <div key={eng.key} style={{ background: C.cardRaised, padding: "10px 12px", borderRadius: "8px", border: "1px solid " + C.border, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div>
                        <div style={{ fontSize: "11px", color: C.textDim, fontWeight: 700 }}>{eng.label}</div>
                        <div style={{ fontSize: "18px", fontWeight: 900, color: eng.color, fontFamily: "'JetBrains Mono', monospace", lineHeight: 1.1 }}>
                          {eng.data.score}<span style={{ fontSize: "10px", color: C.textMuted }}>/{eng.data.max}</span>
                        </div>
                      </div>
                      {eng.pct !== null && (
                        <div style={{ textAlign: "right" }}>
                          <div style={{ fontSize: "9px", color: C.textDim, fontWeight: 700 }}>내 기록 대비</div>
                          <div style={{ fontSize: "12px", fontWeight: 800, color: eng.pct >= 70 ? C.green : eng.pct >= 40 ? C.gold : C.red, fontFamily: "'JetBrains Mono', monospace" }}>
                            상위 {100 - eng.pct}%
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* 엔진 상세 카드 */}
          <div style={S.enginesGrid}>
            {[
              { key: "supply", label: "수급", color: C.red, data: res.engines.supply, items: [["장후반 동반매수", res.engines.supply.breakdown.lateHours, 15], ["수급 일관성", res.engines.supply.breakdown.consistency, 10], ["거래대금", res.engines.supply.breakdown.volume, 10]] },
              { key: "market", label: "시황·섹터", color: C.blue, data: res.engines.market, items: [["주도섹터", res.engines.market.breakdown.lead, 10], ["섹터 지속성", res.engines.market.breakdown.duration, 10], ["상대강도", res.engines.market.breakdown.strength, 5]] },
              { key: "chart", label: "차트", color: C.green, data: res.engines.chart, items: [["매물대 돌파", res.engines.chart.breakdown.breakout, 10], ["정배열", res.engines.chart.breakdown.ma, 5], ["거래량", res.engines.chart.breakdown.volume, 5], ["종가 캔들", res.engines.chart.breakdown.close, 5]] },
              { key: "material", label: "재료", color: C.gold, data: res.engines.material, items: [["재료 타입", res.engines.material.breakdown.type, 10], ["익일 모멘텀", res.engines.material.breakdown.nextDay, 5]] },
            ].map(function (eng) {
              const pct = (eng.data.score / eng.data.max) * 100;
              return (
                <div key={eng.key} style={S.engineCard}>
                  <div style={S.engineHead}>
                    <div style={S.engineName}>{eng.label}</div>
                    <div>
                      <span style={Object.assign({}, S.engineScore, { color: eng.color })}>{eng.data.score}</span>
                      <span style={S.engineMax}>/{eng.data.max}</span>
                    </div>
                  </div>
                  <div style={S.progressBar}>
                    <div style={{ width: pct + "%", height: "100%", background: eng.color, transition: "width 0.5s" }} />
                  </div>
                  <div style={{ marginTop: "10px" }}>
                    {eng.items.map(function (it, i) {
                      return (
                        <div key={i} style={S.breakdownRow}>
                          <span>{it[0]}</span>
                          <span style={{ fontFamily: "'JetBrains Mono', monospace", color: C.text, fontWeight: 700 }}>{it[1]}/{it[2]}</span>
                        </div>
                      );
                    })}
                  </div>
                  <div style={{ fontSize: "11px", color: C.textDim, marginTop: "10px", lineHeight: 1.5, paddingTop: "10px", borderTop: "1px solid " + C.border }}>
                    {eng.data.reasoning}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ─── 매물대 ─── */}
        {res.supplyZone && (
          <div style={S.section}>
            <div style={S.sectionTitle}>🧱 매물대 돌파 심층 분석</div>
            <div style={S.supplyZoneCard}>
              <div style={S.supplyZoneGrid}>
                <div style={S.supplyZoneStatCell}>
                  <div style={{ fontSize: "10px", color: C.textDim, fontWeight: 700, marginBottom: "4px" }}>매물대 등급</div>
                  <div style={{ fontSize: "15px", fontWeight: 800, color: res.supplyZone.level === "long" ? C.red : res.supplyZone.level === "mid" ? C.gold : C.text }}>
                    {res.supplyZone.levelLabel || "-"}
                  </div>
                </div>
                <div style={S.supplyZoneStatCell}>
                  <div style={{ fontSize: "10px", color: C.textDim, fontWeight: 700, marginBottom: "4px" }}>형성 기간</div>
                  <div style={{ fontSize: "13px", fontWeight: 700, color: C.text }}>{res.supplyZone.period || "-"}</div>
                </div>
                <div style={S.supplyZoneStatCell}>
                  <div style={{ fontSize: "10px", color: C.textDim, fontWeight: 700, marginBottom: "4px" }}>두께</div>
                  <div style={{ fontSize: "13px", fontWeight: 700, color: res.supplyZone.thickness === "heavy" ? C.red : res.supplyZone.thickness === "medium" ? C.gold : C.textDim }}>
                    {res.supplyZone.thickness === "heavy" ? "두꺼움" : res.supplyZone.thickness === "medium" ? "보통" : res.supplyZone.thickness === "thin" ? "얇음" : "-"}
                  </div>
                </div>
                <div style={S.supplyZoneStatCell}>
                  <div style={{ fontSize: "10px", color: C.textDim, fontWeight: 700, marginBottom: "4px" }}>현재 상태</div>
                  <div style={{ fontSize: "13px", fontWeight: 800, color: res.supplyZone.status === "돌파" || res.supplyZone.status === "안착" ? C.green : res.supplyZone.status === "저항" ? C.red : C.gold }}>
                    {res.supplyZone.status || "-"}
                  </div>
                </div>
              </div>
              {res.supplyZone.thicknessLabel && (
                <div style={{ fontSize: "12px", color: C.textDim, padding: "10px", background: C.bg, borderRadius: "8px", marginBottom: "8px", lineHeight: 1.5 }}>
                  <strong style={{ color: C.text }}>두께 분석: </strong>{res.supplyZone.thicknessLabel}
                </div>
              )}
              {res.supplyZone.breakoutQuality && (
                <div style={{ fontSize: "12px", color: C.textDim, padding: "10px", background: C.bg, borderRadius: "8px", marginBottom: "8px", lineHeight: 1.5 }}>
                  <strong style={{ color: C.text }}>돌파봉 품질: </strong>{res.supplyZone.breakoutQuality}
                </div>
              )}
              {res.supplyZone.detail && (
                <div style={{ fontSize: "13px", color: C.text, padding: "14px", background: C.bg, borderRadius: "8px", lineHeight: 1.7, borderLeft: "3px solid " + C.green }}>
                  {res.supplyZone.detail}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ─── 보조지표 ─── */}
        {res.technicalIndicators && (
          <div style={S.section}>
            <div style={S.sectionTitle}>
              📐 보조지표 종합 (대가 관점 · 점수 미반영)
              <span style={{ fontSize: "10px", padding: "3px 8px", background: statusColor(res.technicalIndicators.overallTone) + "22", color: statusColor(res.technicalIndicators.overallTone), borderRadius: "4px", fontWeight: 700, marginLeft: "auto" }}>
                종합: {statusLabel(res.technicalIndicators.overallTone)}
              </span>
            </div>
            <div style={S.indicatorGrid}>
              {[
                { key: "rsi", name: "RSI", master: "와일더", data: res.technicalIndicators.rsi },
                { key: "stochastic", name: "스토캐스틱", master: "조지 레인", data: res.technicalIndicators.stochastic },
                { key: "bollinger", name: "볼린저밴드", master: "존 볼린저", data: res.technicalIndicators.bollinger },
                { key: "ichimoku", name: "일목균형표", master: "이치모쿠", data: res.technicalIndicators.ichimoku },
                { key: "envelope", name: "엔벨로프", master: "±이평 채널", data: res.technicalIndicators.envelope },
              ].map(function (ind) {
                if (!ind.data) return null;
                const col = statusColor(ind.data.status);
                return (
                  <div key={ind.key} style={Object.assign({}, S.indicatorCard, { background: col + "0f", borderColor: col + "44" })}>
                    <div style={S.indicatorTop}>
                      <div>
                        <div style={S.indicatorName}>{ind.name}</div>
                        <div style={{ fontSize: "10px", color: C.textMuted, marginTop: "2px" }}>{ind.master}</div>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                        <div style={Object.assign({}, S.indicatorDot, { background: col })}></div>
                        <span style={{ fontSize: "11px", fontWeight: 700, color: col }}>{statusLabel(ind.data.status)}</span>
                      </div>
                    </div>
                    <div style={S.indicatorValue}>{ind.data.value || "-"}</div>
                    <div style={S.indicatorComment}>{ind.data.comment || "-"}</div>
                  </div>
                );
              })}
            </div>
            {res.technicalIndicators.summary && (
              <div style={{ fontSize: "13px", color: C.text, padding: "14px", background: C.cardRaised, borderRadius: "8px", lineHeight: 1.7, borderLeft: "3px solid " + statusColor(res.technicalIndicators.overallTone) }}>
                {res.technicalIndicators.summary}
              </div>
            )}
          </div>
        )}

        {/* ─── 가격 타임라인 (v4 신규) ─── */}
        {res.strategy && (parsePrice(res.strategy.entryPrice) || parsePrice(res.extractedData && res.extractedData.currentPrice)) && parsePrice(res.strategy.tp1Price) && parsePrice(res.strategy.slPrice) && (
          <div style={S.section}>
            <div style={S.sectionTitle}>🎯 가격 액션 플랜 (실전 진입/익절/손절)</div>
            <div style={{ background: C.cardRaised, borderRadius: "10px", padding: "16px", border: "1px solid " + C.border }}>
              <PriceTimeline strategy={res.strategy} currentPrice={res.extractedData && res.extractedData.currentPrice} />
            </div>
          </div>
        )}

        {/* ─── 이미지 분석 리스트 ─── */}
        {res.imagesAnalyzed && res.imagesAnalyzed.length > 0 && (
          <div style={S.section}>
            <div style={S.sectionTitle}>📸 분석한 이미지 ({res.imagesAnalyzed.length}개)</div>
            {res.imagesAnalyzed.map(function (img, i) {
              return (
                <div key={i} style={S.imageSummary}>
                  <span style={S.imageTag}>{img.type}</span>
                  <span style={{ color: C.text, lineHeight: 1.5 }}>{img.summary}</span>
                </div>
              );
            })}
          </div>
        )}

        {/* ─── 추출 데이터 ─── */}
        {res.extractedData && (
          <div style={S.section}>
            <div style={S.sectionTitle}>📊 AI 추출 데이터</div>
            <div style={S.dataTable}>
              {[
                ["현재가", res.extractedData.currentPrice], ["등락률", res.extractedData.changeRate],
                ["거래대금", res.extractedData.tradingValue], ["섹터", res.extractedData.sector],
                ["섹터 순위", res.extractedData.sectorRank], ["외국인 후반", res.extractedData.foreignLate],
                ["기관 후반", res.extractedData.instLate], ["프로그램 후반", res.extractedData.progLate],
                ["3일 수급", res.extractedData.threeDaysSupply], ["차트 패턴", res.extractedData.chartPattern],
                ["돌파 유형", res.extractedData.breakoutType], ["이평선 배열", res.extractedData.maArrangement],
                ["거래량", res.extractedData.volumeSurge], ["종가 캔들", res.extractedData.closeType],
                ["재료", res.extractedData.material], ["재료 타입", res.extractedData.materialType],
              ].map(function (row, i) {
                return (
                  <div key={i} style={S.dataCell}>
                    <span style={S.dataKey}>{row[0]}</span>
                    <span style={S.dataVal}>{row[1] || "-"}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ─── 핵심 근거 ─── */}
        {res.keyReasons && res.keyReasons.length > 0 && (
          <div style={S.section}>
            <div style={S.sectionTitle}>✅ 진입/보류 핵심 근거</div>
            <ul style={S.bulletList}>
              {res.keyReasons.map(function (r, i) {
                return (
                  <li key={i} style={S.bulletItem}>
                    <span style={{ color: C.green, fontWeight: 800 }}>{i + 1}.</span>
                    <span>{r}</span>
                  </li>
                );
              })}
            </ul>
          </div>
        )}

        {/* ─── 리스크 ─── */}
        {res.risks && res.risks.length > 0 && (
          <div style={S.section}>
            <div style={S.sectionTitle}>⚠️ 리스크 경고</div>
            <ul style={S.bulletList}>
              {res.risks.map(function (r, i) {
                return <li key={i} style={S.riskItem}><span>•</span><span>{r}</span></li>;
              })}
            </ul>
          </div>
        )}

        {/* ─── 매매 전략 텍스트 ─── */}
        {res.strategy && (
          <div style={S.section}>
            <div style={S.sectionTitle}>📋 매매 전략 (텍스트)</div>
            <div style={S.strategyGrid}>
              <div style={S.strategyCard}><div style={Object.assign({}, S.strategyLabel, { color: C.green })}>진입</div><div style={S.strategyText}>{res.strategy.entry || "-"}</div></div>
              <div style={S.strategyCard}><div style={Object.assign({}, S.strategyLabel, { color: C.red })}>익절</div><div style={S.strategyText}>{res.strategy.exit || "-"}</div></div>
              <div style={S.strategyCard}><div style={Object.assign({}, S.strategyLabel, { color: C.blue })}>손절</div><div style={S.strategyText}>{res.strategy.stopLoss || "-"}</div></div>
              <div style={S.strategyCard}><div style={Object.assign({}, S.strategyLabel, { color: C.gold })}>홀드</div><div style={S.strategyText}>{res.strategy.hold || "-"}</div></div>
            </div>
          </div>
        )}

        {/* ─── 침착해 총평 ─── */}
        {res.chimchakhaeAnalysis && (
          <div style={S.chimchakhaeBox}>
            <div style={{ fontSize: "13px", fontWeight: 800, color: C.purple, marginBottom: "12px", textTransform: "uppercase", letterSpacing: "1px" }}>💡 침착해 관점 종합 평가</div>
            {res.chimchakhaeAnalysis}
          </div>
        )}
      </div>
    );
  }

  // ─────── return JSX ───────
  return (
    <div style={S.root}>
      <style>{"@keyframes spin{to{transform:rotate(360deg)}} @keyframes slideUp{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}} .fade{animation:slideUp .3s ease-out}"}</style>

      <div style={S.maxWidth}>
        <div style={S.header}>
          <div style={S.titleBox}>
            <div style={S.logoBadge}>침</div>
            <div>
              <h1 style={S.title}>침착해 종가베팅 AI v4</h1>
              <div style={S.subtitle}>레이더차트 · 가격액션 · 신뢰도 · 본인 통계 · 복기 평가</div>
            </div>
          </div>
          <div style={S.tabs}>
            <button
              style={{ padding: "8px 16px", border: "none", background: tab === "analyze" ? C.blue : "transparent", color: tab === "analyze" ? "#fff" : C.textDim, cursor: "pointer", borderRadius: "6px", fontSize: "13px", fontWeight: 700 }}
              onClick={function () { setTab("analyze"); }}
            >
              분석
            </button>
            <button
              style={{ padding: "8px 16px", border: "none", background: tab === "history" ? C.blue : "transparent", color: tab === "history" ? "#fff" : C.textDim, cursor: "pointer", borderRadius: "6px", fontSize: "13px", fontWeight: 700 }}
              onClick={function () { setTab("history"); }}
            >
              기록 {records.length > 0 ? "(" + records.length + ")" : ""}
            </button>
          </div>
        </div>

        {tab === "analyze" && !analyzing && !result && (
          <div className="fade">
            {/* ─── v4 등급표 (본인 통계 인레이) ─── */}
            <div style={{ background: C.card, border: "1px solid " + C.border, borderRadius: "12px", padding: "16px", marginBottom: "14px" }}>
              <div style={{ fontSize: "11px", color: C.textDim, fontWeight: 700, letterSpacing: "0.5px", marginBottom: "12px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span>📊 등급표 + 내 실전 통계</span>
                <span style={{ fontSize: "10px", color: C.textMuted, fontWeight: 500 }}>거래완료 기록 자동 산출</span>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(100px, 1fr))", gap: "6px" }}>
                {[
                  { g: "S+", range: "90+", weight: "25-30%", color: "#ff1744" },
                  { g: "S", range: "80-89", weight: "20-25%", color: "#ff4757" },
                  { g: "A+", range: "70-79", weight: "14-18%", color: "#ff8800" },
                  { g: "A", range: "60-69", weight: "10-13%", color: "#fbbf24" },
                  { g: "B+", range: "50-59", weight: "5-8%", color: "#5b9bd5" },
                  { g: "B", range: "40-49", weight: "2-4%", color: "#8892a8" },
                  { g: "C", range: "<40", weight: "0%", color: "#3b82f6" },
                ].map(function (t) {
                  const stat = gradeStats[t.g];
                  const hasStat = stat && stat.traded > 0;
                  return (
                    <div key={t.g} style={{ background: t.color + "15", border: "1px solid " + t.color + "44", borderRadius: "8px", padding: "10px 4px", textAlign: "center" }}>
                      <div style={{ fontSize: "14px", fontWeight: 900, color: t.color, fontFamily: "'JetBrains Mono', monospace", lineHeight: 1 }}>{t.g}</div>
                      <div style={{ fontSize: "9px", color: C.textDim, marginTop: "3px", fontWeight: 600 }}>{t.range}</div>
                      <div style={{ fontSize: "10px", color: C.text, marginTop: "3px", fontWeight: 700, fontFamily: "'JetBrains Mono', monospace" }}>{t.weight}</div>
                      <div style={{ marginTop: "8px", paddingTop: "6px", borderTop: "1px solid " + t.color + "33" }}>
                        {hasStat ? (
                          <div>
                            <div style={{ fontSize: "9px", color: C.textDim, fontWeight: 700 }}>{stat.traded}회</div>
                            <div style={{ fontSize: "11px", fontWeight: 800, color: stat.winRate >= 60 ? C.green : stat.winRate >= 40 ? C.gold : C.red, fontFamily: "'JetBrains Mono', monospace" }}>{stat.winRate}%</div>
                            <div style={{ fontSize: "10px", fontWeight: 800, color: stat.avgPnl > 0 ? C.red : C.blue, fontFamily: "'JetBrains Mono', monospace" }}>
                              {stat.avgPnl > 0 ? "+" : ""}{stat.avgPnl}%
                            </div>
                          </div>
                        ) : stat && stat.total > 0 ? (
                          <div style={{ fontSize: "9px", color: C.textMuted, fontWeight: 600 }}>{stat.total}회 분석<br/>매매미입력</div>
                        ) : (
                          <div style={{ fontSize: "9px", color: C.textMuted, fontWeight: 600 }}>-</div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
              <div style={{ fontSize: "10px", color: C.textMuted, marginTop: "10px", textAlign: "center", lineHeight: 1.5 }}>
                각 카드 하단 = 본인의 해당 등급 거래완료 횟수 / 승률 / 평균수익률 (저장된 매매 기록 자동 분석)
              </div>
            </div>

            {/* ─── 모드 토글 ─── */}
            <div style={{ display: "flex", gap: "8px", marginBottom: "16px", background: C.card, padding: "6px", borderRadius: "12px", border: "1px solid " + C.border }}>
              <button
                onClick={function () { setAnalyzeMode("image"); setError(""); }}
                style={{ flex: 1, padding: "12px", border: "none", cursor: "pointer", borderRadius: "8px", background: analyzeMode === "image" ? C.blue : "transparent", color: analyzeMode === "image" ? "#fff" : C.textDim, fontWeight: 700, fontSize: "13px", fontFamily: "inherit" }}
              >
                📸 이미지 모드 (PC 권장)
              </button>
              <button
                onClick={function () { setAnalyzeMode("text"); setError(""); }}
                style={{ flex: 1, padding: "12px", border: "none", cursor: "pointer", borderRadius: "8px", background: analyzeMode === "text" ? C.purple : "transparent", color: analyzeMode === "text" ? "#fff" : C.textDim, fontWeight: 700, fontSize: "13px", fontFamily: "inherit" }}
              >
                ✏️ 텍스트 모드 (모바일 OK)
              </button>
            </div>

            {analyzeMode === "image" ? (
              <div>
                <div
                  style={S.dropzone(dragOver)}
                  onClick={function () { fileInputRef.current && fileInputRef.current.click(); }}
                  onDragOver={function (e) { e.preventDefault(); setDragOver(true); }}
                  onDragLeave={function () { setDragOver(false); }}
                  onDrop={function (e) { e.preventDefault(); setDragOver(false); handleFiles(e.dataTransfer.files, "main"); }}
                >
                  <input ref={fileInputRef} type="file" accept="image/*" multiple onChange={function (e) { handleFiles(e.target.files, "main"); e.target.value = ""; }} style={{ display: "none" }} />
                  <div style={S.dropIcon}>📸</div>
                  <div style={{ fontSize: "16px", fontWeight: 700, marginBottom: "6px" }}>
                    {images.length === 0 ? "이미지 업로드 또는 드래그" : "이미지 더 추가 (현재 " + images.length + "개)"}
                  </div>
                  <div style={{ fontSize: "12px", color: C.textDim }}>
                    일봉·분봉차트(+보조지표) · 수급현황 · 거래원 · 공시 · 뉴스 · 섹터순위
                  </div>
                </div>

                {images.length > 0 && (
                  <div style={S.imageGrid}>
                    {images.map(function (img) {
                      return (
                        <div key={img.id} style={S.imageItem}>
                          <img src={img.dataUrl} alt={img.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                          <button style={S.removeBtn} onClick={function () { removeImage(img.id); }}>×</button>
                          <div style={S.imageName}>{img.name}{img.sizeKB ? " (" + img.sizeKB + "KB)" : ""}</div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            ) : (
              <div>
                <div style={{ background: C.purpleSoft, border: "1px solid rgba(168,85,247,0.3)", borderRadius: "12px", padding: "14px", marginBottom: "12px", fontSize: "12px", lineHeight: 1.6, color: C.text }}>
                  <strong style={{ color: C.purple }}>📝 텍스트 모드 사용법</strong><br />
                  HTS/MTS에서 본 정보를 자유롭게 적어. AI가 4엔진으로 자동 스코어링한다.<br />
                  <span style={{ color: C.textDim }}>모바일 앱에서도 작동. 정보가 많을수록 정확함.</span>
                </div>

                <textarea
                  value={textInput}
                  onChange={function (e) { setTextInput(e.target.value); }}
                  placeholder={"예시 (있는 정보만 적어도 됨):\n\n[현재가] 230,000원 +4.5%\n[거래대금] 1조 5천억 (역대급)\n[수급] 후반 외인+1500억, 기관+500억 동반매수 / 3일 연속 외인 순매수\n[섹터] AI반도체 거래대금 1위, 5일 연속 주도\n[차트] 3개월 박스권 상단 돌파, 정배열, 거래량 전일 대비 +120%, 장대양봉 종가\n[보조지표] RSI 68 / 일목 구름 위 / 볼린저 상단 / 스토캐스틱 80\n[재료] HBM3 양산 발표, 정책+실적 호재\n[매물대] 220k 부근 두꺼운 매물대 본격 돌파\n[기타] 기관 5일 연속 매수\n"}
                  style={{ width: "100%", minHeight: "260px", boxSizing: "border-box", background: C.card, border: "1px solid " + C.border, borderRadius: "12px", padding: "14px", color: C.text, fontSize: "13px", fontFamily: "inherit", lineHeight: 1.6, outline: "none", resize: "vertical" }}
                />
                <div style={{ fontSize: "11px", color: C.textMuted, marginTop: "6px", textAlign: "right" }}>
                  {textInput.length}자 (최소 20자 필요)
                </div>
              </div>
            )}

            <div style={S.inputRow}>
              <input style={S.input} placeholder="종목명 (선택)" value={stockName} onChange={function (e) { setStockName(e.target.value); }} />
              <input style={S.input} placeholder="메모 (선택)" value={memo} onChange={function (e) { setMemo(e.target.value); }} />
            </div>

            {error && <div style={S.errorBox}>⚠️ {error}</div>}

            <button
              style={Object.assign({}, S.btnPrimary, analyzeMode === "image" ? (images.length === 0 ? S.btnPrimaryDisabled : {}) : (textInput.trim().length < 20 ? S.btnPrimaryDisabled : {}))}
              onClick={runAnalysis}
              disabled={analyzeMode === "image" ? images.length === 0 : textInput.trim().length < 20}
            >
              🎯 AI 종가베팅 분석 시작 {analyzeMode === "image" && images.length > 0 && "(이미지 " + images.length + "개)"}
              {analyzeMode === "text" && textInput.length >= 20 && "(텍스트 " + textInput.length + "자)"}
            </button>
          </div>
        )}

        {tab === "analyze" && analyzing && (
          <div style={S.analyzingBox}>
            <div style={S.loader}></div>
            <div style={{ fontSize: "16px", fontWeight: 700, marginBottom: "6px" }}>🤖 Claude가 분석 중</div>
            <div style={{ fontSize: "13px", color: C.textDim, marginBottom: "20px" }}>{progress}</div>
            <div style={{ fontSize: "11px", color: C.textMuted, lineHeight: 1.8 }}>
              수급 · 시황섹터 · 차트(매물대) · 재료 + 보조지표 + 가격 액션플랜 (30~50초)
            </div>
          </div>
        )}

        {tab === "analyze" && result && !analyzing && (
          <div className="fade">
            <div id="result-top"></div>
            {renderResultBody(result)}
            <div style={S.btnRow}>
              <button style={Object.assign({}, S.btnSecondary, { flex: 1 })} onClick={saveResult}>💾 이 분석 저장</button>
              <button style={Object.assign({}, S.btnSecondary, { flex: 1 })} onClick={resetAll}>🔄 새 분석 시작</button>
            </div>
          </div>
        )}

        {tab === "history" && (
          <div>
            {loadingRecords ? (
              <div style={S.empty}>로딩 중...</div>
            ) : records.length === 0 ? (
              <div style={S.empty}>
                <div style={{ fontSize: "48px", marginBottom: "12px" }}>📭</div>
                <div>저장된 기록이 없습니다</div>
              </div>
            ) : (
              <div>
                <div style={S.section}>
                  <div style={S.sectionTitle}>📊 복기 통계</div>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: "10px" }}>
                    {(function () {
                      const wins = records.filter(function (r) { return r.actualResult === "win"; }).length;
                      const losses = records.filter(function (r) { return r.actualResult === "loss"; }).length;
                      const partials = records.filter(function (r) { return r.actualResult === "partial"; }).length;
                      const judged = wins + losses + partials;
                      const winRate = judged > 0 ? Math.round((wins / judged) * 100) : 0;
                      const pnlList = records.filter(function (r) { return r.buyPrice && r.sellPrice; }).map(function (r) { return ((r.sellPrice - r.buyPrice) / r.buyPrice) * 100; });
                      const sumPnl = pnlList.reduce(function (a, b) { return a + b; }, 0);
                      const avgPnl = pnlList.length > 0 ? (sumPnl / pnlList.length).toFixed(1) + "%" : "-";
                      return [
                        ["전체", records.length, C.text],
                        ["익절", wins, C.red],
                        ["손절", losses, C.blue],
                        ["승률", winRate + "%", C.gold],
                        ["평균 수익률", avgPnl, avgPnl !== "-" && sumPnl > 0 ? C.red : C.blue],
                      ];
                    })().map(function (s, i) {
                      return (
                        <div key={i} style={{ textAlign: "center", padding: "14px", background: C.cardRaised, borderRadius: "10px" }}>
                          <div style={{ fontSize: "11px", color: C.textDim, fontWeight: 700 }}>{s[0]}</div>
                          <div style={{ fontSize: "22px", fontWeight: 900, color: s[2], marginTop: "4px", fontFamily: "'JetBrains Mono', monospace" }}>{s[1]}</div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {records.map(function (r) {
                  const hasPnl = r.buyPrice && r.sellPrice;
                  const pnl = hasPnl ? ((r.sellPrice - r.buyPrice) / r.buyPrice) * 100 : null;
                  return (
                    <div key={r.id} style={S.recordCard} onClick={function () { openDetail(r); }} onMouseEnter={function (e) { e.currentTarget.style.borderColor = C.blue; }} onMouseLeave={function (e) { e.currentTarget.style.borderColor = C.border; }}>
                      <div style={{ display: "flex", gap: "14px", alignItems: "flex-start" }}>
                        {r.thumbnailImage && <img src={r.thumbnailImage} alt="" style={{ width: "80px", height: "60px", objectFit: "cover", borderRadius: "6px", flexShrink: 0 }} />}
                        <div style={{ flex: 1 }}>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "8px" }}>
                            <div>
                              <div style={{ fontSize: "15px", fontWeight: 700 }}>{r.stockName} {r.stockCode && <span style={{ fontSize: "11px", color: C.textDim }}>· {r.stockCode}</span>}</div>
                              <div style={{ fontSize: "11px", color: C.textDim }}>{new Date(r.date).toLocaleString("ko-KR")}</div>
                            </div>
                            <div style={{ textAlign: "right" }}>
                              <div style={{ fontSize: "22px", fontWeight: 900, color: gradeColor(r.result.grade), fontFamily: "'JetBrains Mono', monospace" }}>{r.result.totalScore}</div>
                              <div style={{ fontSize: "10px", color: gradeColor(r.result.grade), fontWeight: 700 }}>{r.result.grade}등급</div>
                            </div>
                          </div>
                          <div style={{ display: "flex", gap: "12px", fontSize: "11px", color: C.textDim, flexWrap: "wrap" }}>
                            <span>비중 <strong style={{ color: C.text }}>{r.result.recommendedWeight}%</strong></span>
                            <span>확률 <strong style={{ color: C.text }}>{r.result.nextDayRiseProbability}%</strong></span>
                            {r.actualResult && (
                              <span style={{ color: r.actualResult === "win" ? C.red : r.actualResult === "loss" ? C.blue : C.gold, fontWeight: 700 }}>
                                {r.actualResult === "win" ? "✅ 익절" : r.actualResult === "loss" ? "❌ 손절" : "➖ 부분성공"}
                              </span>
                            )}
                            {hasPnl && (
                              <span style={{ color: pnl > 0 ? C.red : C.blue, fontWeight: 700 }}>
                                {pnl > 0 ? "+" : ""}{pnl.toFixed(2)}%
                              </span>
                            )}
                            <span style={{ marginLeft: "auto", color: C.blue }}>→ 클릭하여 상세/복기</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>

      {/* 상세보기 모달 */}
      {detailRecord && (
        <div style={S.modalOverlay} onClick={function (e) { if (e.target === e.currentTarget) closeDetail(); }}>
          <div style={S.modal}>
            <button style={S.modalClose} onClick={closeDetail}>×</button>

            <div style={{ marginBottom: "20px", paddingBottom: "16px", borderBottom: "1px solid " + C.border }}>
              <div style={{ fontSize: "11px", color: C.textDim }}>{new Date(detailRecord.date).toLocaleString("ko-KR")}</div>
              <div style={{ fontSize: "22px", fontWeight: 800, marginTop: "4px" }}>
                {detailRecord.stockName} {detailRecord.stockCode && <span style={{ fontSize: "14px", color: C.textDim }}>· {detailRecord.stockCode}</span>}
              </div>
              {detailRecord.memo && <div style={{ fontSize: "12px", color: C.textDim, marginTop: "6px" }}>메모: {detailRecord.memo}</div>}
            </div>

            <div style={Object.assign({}, S.section, { border: "1px solid " + C.purple, background: C.purpleSoft })}>
              <div style={S.sectionTitle}>💼 매매 & 복기 기록</div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(100px, 1fr))", gap: "10px", marginBottom: "14px" }}>
                <div>
                  <div style={{ fontSize: "11px", color: C.textDim, fontWeight: 700, marginBottom: "4px" }}>매수가 (원)</div>
                  <div style={{ display: "flex", gap: "4px" }}>
                    <input
                      type="number"
                      style={Object.assign({}, S.input, { padding: "8px 10px", fontSize: "13px" })}
                      placeholder={detailRecord.buyPrice ? detailRecord.buyPrice.toLocaleString() : "예: 15000"}
                      value={buyPriceInput}
                      onChange={function (e) { setBuyPriceInput(e.target.value); }}
                    />
                    <button style={Object.assign({}, S.btnSecondary, { padding: "8px 12px", fontSize: "12px" })} onClick={saveBuyPrice}>저장</button>
                  </div>
                  {detailRecord.buyPrice && (
                    <div style={{ fontSize: "11px", color: C.green, marginTop: "4px" }}>✓ 저장됨: {detailRecord.buyPrice.toLocaleString()}원</div>
                  )}
                </div>

                <div>
                  <div style={{ fontSize: "11px", color: C.textDim, fontWeight: 700, marginBottom: "4px" }}>매도가 (원)</div>
                  <input
                    type="number"
                    style={Object.assign({}, S.input, { padding: "8px 10px", fontSize: "13px" })}
                    placeholder={detailRecord.sellPrice ? detailRecord.sellPrice.toLocaleString() : "예: 16200"}
                    value={sellPriceInput}
                    onChange={function (e) { setSellPriceInput(e.target.value); }}
                  />
                  {detailRecord.sellPrice && (
                    <div style={{ fontSize: "11px", color: C.green, marginTop: "4px" }}>✓ 저장됨: {detailRecord.sellPrice.toLocaleString()}원</div>
                  )}
                </div>

                <div>
                  <div style={{ fontSize: "11px", color: C.textDim, fontWeight: 700, marginBottom: "4px" }}>실제 수익률</div>
                  {detailRecord.buyPrice && detailRecord.sellPrice ? (
                    (function () {
                      const pnl = ((detailRecord.sellPrice - detailRecord.buyPrice) / detailRecord.buyPrice) * 100;
                      return (
                        <div style={{ fontSize: "22px", fontWeight: 900, color: pnl > 0 ? C.red : C.blue, fontFamily: "'JetBrains Mono', monospace", padding: "4px 0" }}>
                          {pnl > 0 ? "+" : ""}{pnl.toFixed(2)}%
                        </div>
                      );
                    })()
                  ) : (
                    <div style={{ fontSize: "13px", color: C.textMuted, padding: "8px 0" }}>매수가·매도가 입력 필요</div>
                  )}
                </div>
              </div>

              <div style={{ borderTop: "1px solid " + C.border, paddingTop: "14px" }}>
                <div style={{ fontSize: "12px", fontWeight: 700, marginBottom: "8px" }}>🔎 매도 후 차트 이미지 업로드 (복기용)</div>
                <input
                  ref={reviewFileRef}
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={function (e) { handleFiles(e.target.files, "review"); e.target.value = ""; }}
                  style={{ display: "none" }}
                />
                <button
                  style={Object.assign({}, S.btnSecondary, { fontSize: "12px", padding: "8px 14px", marginBottom: "10px" })}
                  onClick={function () { reviewFileRef.current && reviewFileRef.current.click(); }}
                >
                  📎 이미지 선택 {reviewImages.length > 0 && "(현재 " + reviewImages.length + "개)"}
                </button>

                {reviewImages.length > 0 && (
                  <div style={Object.assign({}, S.imageGrid, { marginBottom: "10px" })}>
                    {reviewImages.map(function (img) {
                      return (
                        <div key={img.id} style={S.imageItem}>
                          <img src={img.dataUrl} alt={img.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                          <button style={S.removeBtn} onClick={function () { removeReviewImage(img.id); }}>×</button>
                          <div style={S.imageName}>{img.name}</div>
                        </div>
                      );
                    })}
                  </div>
                )}

                <button
                  style={Object.assign({}, S.btnPrimary, { fontSize: "13px", padding: "12px 16px" }, (reviewing || !sellPriceInput || reviewImages.length === 0) ? S.btnPrimaryDisabled : {})}
                  disabled={reviewing || !sellPriceInput || reviewImages.length === 0}
                  onClick={runReview}
                >
                  {reviewing ? "🤖 복기 평가 중..." : "🎯 AI 복기 평가 실행"}
                </button>
                <div style={{ fontSize: "11px", color: C.textMuted, marginTop: "8px" }}>
                  원래 분석 vs 실제 결과를 비교해 예측 정확도·교훈·패턴 태그를 AI가 작성합니다
                </div>
              </div>

              {detailRecord.reviewReport && (
                <div style={{ marginTop: "16px", paddingTop: "16px", borderTop: "1px solid " + C.border }}>
                  <div style={{ fontSize: "12px", fontWeight: 800, color: C.purple, marginBottom: "10px" }}>📝 AI 복기 리포트</div>
                  <div style={{ padding: "14px", background: C.cardRaised, borderRadius: "10px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px" }}>
                      <span style={{ padding: "4px 10px", borderRadius: "5px", fontSize: "12px", fontWeight: 800, background: detailRecord.reviewReport.outcome === "success" ? C.red : detailRecord.reviewReport.outcome === "failure" ? C.blue : C.gold, color: "#fff" }}>
                        {detailRecord.reviewReport.outcomeLabel || "-"}
                      </span>
                      {detailRecord.reviewReport.patternTag && (
                        <span style={{ padding: "4px 10px", borderRadius: "5px", fontSize: "11px", background: C.border, color: C.text }}>
                          #{detailRecord.reviewReport.patternTag}
                        </span>
                      )}
                    </div>

                    {detailRecord.reviewReport.predictionAccuracy && (
                      <div style={{ fontSize: "13px", color: C.text, marginBottom: "12px", padding: "10px", background: C.bg, borderRadius: "8px", lineHeight: 1.6 }}>
                        <strong>예측 정확도: </strong>{detailRecord.reviewReport.predictionAccuracy}
                      </div>
                    )}

                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: "8px", marginBottom: "12px" }}>
                      {detailRecord.reviewReport.whatWorked && (
                        <div style={{ padding: "12px", background: C.greenSoft, borderRadius: "8px", borderLeft: "3px solid " + C.green }}>
                          <div style={{ fontSize: "11px", fontWeight: 700, color: C.green, marginBottom: "6px" }}>✅ 맞은 판단</div>
                          {detailRecord.reviewReport.whatWorked.map(function (w, i) {
                            return <div key={i} style={{ fontSize: "12px", color: C.text, marginBottom: "4px", lineHeight: 1.5 }}>• {w}</div>;
                          })}
                        </div>
                      )}
                      {detailRecord.reviewReport.whatMissed && (
                        <div style={{ padding: "12px", background: C.redSoft, borderRadius: "8px", borderLeft: "3px solid " + C.red }}>
                          <div style={{ fontSize: "11px", fontWeight: 700, color: C.red, marginBottom: "6px" }}>❌ 놓친 부분</div>
                          {detailRecord.reviewReport.whatMissed.map(function (w, i) {
                            return <div key={i} style={{ fontSize: "12px", color: C.text, marginBottom: "4px", lineHeight: 1.5 }}>• {w}</div>;
                          })}
                        </div>
                      )}
                    </div>

                    {detailRecord.reviewReport.optimalExit && (
                      <div style={{ fontSize: "12px", color: C.text, padding: "10px", background: C.goldSoft, borderRadius: "8px", marginBottom: "10px", borderLeft: "3px solid " + C.gold }}>
                        <strong style={{ color: C.gold }}>최적 매도: </strong>{detailRecord.reviewReport.optimalExit}
                      </div>
                    )}

                    {detailRecord.reviewReport.lessonLearned && (
                      <div style={{ fontSize: "13px", color: C.text, padding: "14px", background: C.purpleSoft, borderRadius: "8px", lineHeight: 1.7, borderLeft: "3px solid " + C.purple }}>
                        <strong style={{ color: C.purple }}>💡 교훈: </strong>{detailRecord.reviewReport.lessonLearned}
                      </div>
                    )}
                  </div>

                  {detailRecord.reviewImages && detailRecord.reviewImages.length > 0 && (
                    <div style={{ marginTop: "12px" }}>
                      <div style={{ fontSize: "11px", color: C.textDim, marginBottom: "6px" }}>첨부된 복기 차트</div>
                      <div style={S.imageGrid}>
                        {detailRecord.reviewImages.map(function (img, i) {
                          return (
                            <div key={i} style={S.imageItem}>
                              <img src={img.dataUrl} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                              <div style={S.imageName}>{img.name}</div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {renderResultBody(detailRecord.result)}

            <div style={S.btnRow}>
              <button style={Object.assign({}, S.btnSecondary, { color: C.red, borderColor: C.red })} onClick={function () { deleteRecord(detailRecord.id); }}>
                🗑 이 기록 삭제
              </button>
              <button style={Object.assign({}, S.btnSecondary, { flex: 1 })} onClick={closeDetail}>닫기</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
