import React from "react";

// ============================================================
// 침착해 v4 분석 헬퍼 (sector-api-pink 프록시 경유)
// 5번째 탭 ChimchakhaeAI.jsx와 동일한 전체 프롬프트 사용
// ============================================================

const CHIMCHAKHAE_PROMPT = "당신은 침착해 종가베팅 기법의 최고 전문가입니다. 업로드된 이미지들(일봉차트, 분봉차트, 수급현황, 거래원, 공시, 뉴스, 섹터순위 등)을 모두 종합 분석해서 종가베팅 진입 여부를 판단하세요.\n\n" +
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
  "━━━━ 가격 산출 ━━━━\n" +
  "차트의 현재가/종가/지지·저항선을 보고 실제 가격(원)으로 산출:\n" +
  "- entryPrice: 종가 또는 다음날 시초 부근 (현재가 ±1%)\n" +
  "- tp1Price: 진입가 +5~8% (S+ 는 +8~12%, 매물대/저항 위까지)\n" +
  "- tp2Price: 진입가 +12~25% (S/A+급만, B 이하면 null)\n" +
  "- slPrice: 진입가 -3~5% 또는 매물대 하단/지지선. 등급 낮을수록 타이트\n" +
  "차트에서 현재가 식별 불가시 모두 null. 숫자만 (콤마/단위 X).\n\n" +
  "━━━━ 신뢰도 ━━━━\n" +
  "confidenceScore (0~100): 이미지 품질 + 데이터 가독성 + 분석 자신감.\n" +
  "차트/수급/재료 모두 선명하게 판독 = 85+, 일부 흐릿/누락 = 60~80, 핵심 정보 부족 = 50 미만.\n\n" +
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
  '  "totalScore": 숫자, "grade": "S+|S|A+|A|B+|B|C", "verdict": "진입 강력추천|조건부 매수|관망|진입 보류",\n' +
  '  "recommendedWeight": 숫자(0~30), "nextDayRiseProbability": 숫자(0~100), "confidenceScore": 숫자(0~100),\n' +
  '  "keyReasons": ["근거1","근거2","근거3","근거4","근거5"],\n' +
  '  "risks": ["리스크1","리스크2"],\n' +
  '  "strategy": {"entry":"","exit":"","stopLoss":"","hold":"","entryPrice":숫자|null,"tp1Price":숫자|null,"tp2Price":숫자|null,"slPrice":숫자|null},\n' +
  '  "chimchakhaeAnalysis": "침착해 관점 5~7문장 종합 평가"\n' +
  "}\n\n" +
  "판독 불가 항목은 '확인불가'로. 가격 식별 불가시 null. JSON 외 텍스트 절대 금지.";

// 침착해 프록시 분석 호출 (NEO-SCORE의 sector-api-pink 사용)
export async function analyzeChimchakhae(images, stockName) {
  const content = [];
  for (let i = 0; i < images.length; i++) {
    content.push({
      type: "image",
      source: { type: "base64", media_type: images[i].type || "image/jpeg", data: images[i].data },
    });
  }
  const userInfo = stockName ? "종목명: " + stockName + "\n" : "";
  content.push({ type: "text", text: CHIMCHAKHAE_PROMPT + "\n\n" + (userInfo || "종목 정보 없음. 이미지에서 추출.") });

  const resp = await fetch("https://sector-api-pink.vercel.app/api/analyze", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 8000,
      messages: [{ role: "user", content: content }],
    }),
  });
  if (!resp.ok) {
    const t = await resp.text();
    throw new Error("침착해 API " + resp.status + ": " + t.substring(0, 200));
  }
  const data = await resp.json();
  let text = "";
  if (data.content && Array.isArray(data.content)) {
    for (let i = 0; i < data.content.length; i++) {
      if (data.content[i].type === "text") text += data.content[i].text;
    }
  }
  if (!text) throw new Error("침착해 응답 비어있음");

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
  if (!parsed) throw new Error("침착해 JSON 파싱 실패. 응답 앞 200자: " + text.substring(0, 200));
  if (!parsed.imagesAnalyzed) parsed.imagesAnalyzed = [];
  return parsed;
}

// ============================================================
// 결과 표시 헬퍼
// ============================================================
export function gradeColor(grade) {
  if (grade === "S+") return "#dc2626";
  if (grade === "S") return "#ef4444";
  if (grade === "A+") return "#ea580c";
  if (grade === "A") return "#f59e0b";
  if (grade === "B+") return "#3b82f6";
  if (grade === "B") return "#94a3b8";
  return "#64748b";
}

export function statusColor(status) {
  if (status === "positive") return "#22c55e";
  if (status === "negative") return "#dc2626";
  if (status === "unknown") return "#94a3b8";
  return "#f59e0b"; // neutral
}

export function statusLabel(status) {
  if (status === "positive") return "긍정";
  if (status === "negative") return "부정";
  if (status === "unknown") return "미판독";
  return "중립";
}

export function fmtPrice(n) {
  if (n == null || isNaN(n)) return "-";
  if (n >= 1) return Math.round(n).toLocaleString();
  return n.toFixed(2);
}

// 4엔진 레이더 차트 SVG
export function RadarChart(props) {
  const engines = props.engines;
  const color = props.color || "#a855f7";
  if (!engines || !engines.supply) return null;
  const points = [
    { label: "수급", value: engines.supply.score / engines.supply.max, score: engines.supply.score, max: engines.supply.max },
    { label: "시황", value: engines.market.score / engines.market.max, score: engines.market.score, max: engines.market.max },
    { label: "차트", value: engines.chart.score / engines.chart.max, score: engines.chart.score, max: engines.chart.max },
    { label: "재료", value: engines.material.score / engines.material.max, score: engines.material.score, max: engines.material.max },
  ];
  const cx = 140, cy = 140, R = 90;
  const angles = [-Math.PI / 2, 0, Math.PI / 2, Math.PI];
  function gridStr(scale) {
    const pts = [];
    for (let i = 0; i < 4; i++) {
      const x = cx + Math.cos(angles[i]) * R * scale;
      const y = cy + Math.sin(angles[i]) * R * scale;
      pts.push(x.toFixed(1) + "," + y.toFixed(1));
    }
    return pts.join(" ");
  }
  const dataPts = [];
  for (let i = 0; i < 4; i++) {
    const v = Math.max(points[i].value, 0.02);
    const x = cx + Math.cos(angles[i]) * R * v;
    const y = cy + Math.sin(angles[i]) * R * v;
    dataPts.push(x.toFixed(1) + "," + y.toFixed(1));
  }
  const labels = [
    { x: cx, y: cy - R - 14, anchor: "middle" },
    { x: cx + R + 14, y: cy + 4, anchor: "start" },
    { x: cx, y: cy + R + 22, anchor: "middle" },
    { x: cx - R - 14, y: cy + 4, anchor: "end" },
  ];
  return (
    <svg viewBox="0 0 280 280" style={{ width: "100%", maxWidth: "260px", height: "auto", display: "block", margin: "0 auto" }}>
      <polygon points={gridStr(1.0)} fill="none" stroke="#cbd5e1" strokeWidth="1" />
      <polygon points={gridStr(0.75)} fill="none" stroke="#e2e8f0" strokeWidth="1" />
      <polygon points={gridStr(0.5)} fill="none" stroke="#e2e8f0" strokeWidth="1" />
      <polygon points={gridStr(0.25)} fill="none" stroke="#e2e8f0" strokeWidth="1" />
      <line x1={cx} y1={cy} x2={cx} y2={cy - R} stroke="#e2e8f0" strokeWidth="1" />
      <line x1={cx} y1={cy} x2={cx + R} y2={cy} stroke="#e2e8f0" strokeWidth="1" />
      <line x1={cx} y1={cy} x2={cx} y2={cy + R} stroke="#e2e8f0" strokeWidth="1" />
      <line x1={cx} y1={cy} x2={cx - R} y2={cy} stroke="#e2e8f0" strokeWidth="1" />
      <polygon points={dataPts.join(" ")} fill={color + "33"} stroke={color} strokeWidth="2" strokeLinejoin="round" />
      {points.map(function (p, i) {
        const v = Math.max(p.value, 0.02);
        const x = cx + Math.cos(angles[i]) * R * v;
        const y = cy + Math.sin(angles[i]) * R * v;
        return <circle key={i} cx={x} cy={y} r={4} fill={color} stroke="#fff" strokeWidth="1.5" />;
      })}
      {points.map(function (p, i) {
        return (
          <g key={"l" + i}>
            <text x={labels[i].x} y={labels[i].y} textAnchor={labels[i].anchor} fill="#1e293b" fontSize="12" fontWeight="800">{p.label}</text>
            <text x={labels[i].x} y={labels[i].y + 13} textAnchor={labels[i].anchor} fill={color} fontSize="10" fontWeight="700" fontFamily="'JetBrains Mono', monospace">{p.score}/{p.max}</text>
          </g>
        );
      })}
    </svg>
  );
}

// 추출된 데이터 라벨 매핑
export const EXTRACTED_LABELS = {
  currentPrice: "현재가",
  changeRate: "등락률",
  tradingValue: "거래대금",
  foreignLate: "외인 후반",
  instLate: "기관 후반",
  progLate: "프로그램 후반",
  threeDaysSupply: "3일 수급",
  sector: "섹터",
  sectorRank: "섹터 순위",
  chartPattern: "차트 패턴",
  breakoutType: "돌파 유형",
  maArrangement: "이평 배열",
  volumeSurge: "거래량 급증",
  closeType: "종가 유형",
  material: "재료",
  materialType: "재료 타입",
};

// 침착해 결과 카드 (전체 상세 표시 - v2)
export function ChimchakhaeResultCard(props) {
  const res = props.result;
  if (!res) return null;
  const color = gradeColor(res.grade);
  const strat = res.strategy || {};
  const eng = res.engines || {};
  const sz = res.supplyZone;
  const ti = res.technicalIndicators;
  const ed = res.extractedData;

  // 엔진별 항목 정의
  const engineItems = [
    { key: "supply", label: "수급", color: "#dc2626", data: eng.supply, items: eng.supply ? [
      ["장 후반 동반매수", eng.supply.breakdown && eng.supply.breakdown.lateHours, 15],
      ["수급 일관성", eng.supply.breakdown && eng.supply.breakdown.consistency, 10],
      ["거래대금", eng.supply.breakdown && eng.supply.breakdown.volume, 10],
    ] : [] },
    { key: "market", label: "시황·섹터", color: "#3b82f6", data: eng.market, items: eng.market ? [
      ["주도섹터 순위", eng.market.breakdown && eng.market.breakdown.lead, 10],
      ["섹터 지속성", eng.market.breakdown && eng.market.breakdown.duration, 10],
      ["상대강도", eng.market.breakdown && eng.market.breakdown.strength, 5],
    ] : [] },
    { key: "chart", label: "차트", color: "#22c55e", data: eng.chart, items: eng.chart ? [
      ["매물대 돌파", eng.chart.breakdown && eng.chart.breakdown.breakout, 10],
      ["정배열", eng.chart.breakdown && eng.chart.breakdown.ma, 5],
      ["거래량", eng.chart.breakdown && eng.chart.breakdown.volume, 5],
      ["종가 캔들", eng.chart.breakdown && eng.chart.breakdown.close, 5],
    ] : [] },
    { key: "material", label: "재료", color: "#f59e0b", data: eng.material, items: eng.material ? [
      ["재료 타입", eng.material.breakdown && eng.material.breakdown.type, 10],
      ["익일 모멘텀", eng.material.breakdown && eng.material.breakdown.nextDay, 5],
    ] : [] },
  ];

  // 보조지표 항목
  const indicators = ti ? [
    { key: "rsi", name: "RSI", master: "와일더", data: ti.rsi },
    { key: "stochastic", name: "스토캐스틱", master: "레인", data: ti.stochastic },
    { key: "bollinger", name: "볼린저밴드", data: ti.bollinger },
    { key: "ichimoku", name: "일목균형표", data: ti.ichimoku },
    { key: "envelope", name: "엔벨로프", data: ti.envelope },
  ] : [];

  return (
    <div style={{ borderRadius: 14, border: "2px solid " + color, overflow: "hidden", marginBottom: 14, background: "#fff" }}>
      {/* 헤더 */}
      <div style={{ background: color, padding: "14px 18px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10 }}>
        <div style={{ minWidth: 0, flex: "1 1 auto" }}>
          <div style={{ fontSize: 11, color: "rgba(255,255,255,0.85)", fontWeight: 700, marginBottom: 2 }}>침착해 v4 분석</div>
          <div style={{ fontSize: 18, fontWeight: 900, color: "#fff" }}>{res.stockName || props.stockName || "분석 결과"}{res.stockCode && res.stockCode !== "확인불가" ? <span style={{ fontSize: 12, fontWeight: 600, marginLeft: 6, opacity: 0.85 }}>{res.stockCode}</span> : null}</div>
          <div style={{ fontSize: 11, color: "rgba(255,255,255,0.85)", marginTop: 2 }}>{res.verdict}</div>
        </div>
        <div style={{ textAlign: "center", flexShrink: 0 }}>
          <div style={{ fontSize: 32, fontWeight: 900, color: "#fff", lineHeight: 1 }}>{res.grade}</div>
          <div style={{ fontSize: 13, color: "rgba(255,255,255,0.85)", marginTop: 3 }}>{res.totalScore}/100</div>
        </div>
      </div>

      {/* 본문 */}
      <div style={{ padding: "16px" }}>
        {/* 추천비중 / 익일상승 / 신뢰도 */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(95px,1fr))", gap: 6, marginBottom: 14 }}>
          <div style={{ textAlign: "center", padding: 10, background: "#f8fafc", borderRadius: 8 }}>
            <div style={{ fontSize: 10, color: "#64748b", fontWeight: 700 }}>추천비중</div>
            <div style={{ fontSize: 22, fontWeight: 900, color: res.recommendedWeight >= 15 ? color : "#94a3b8" }}>{res.recommendedWeight}<span style={{ fontSize: 14 }}>%</span></div>
          </div>
          <div style={{ textAlign: "center", padding: 10, background: "#f8fafc", borderRadius: 8 }}>
            <div style={{ fontSize: 10, color: "#64748b", fontWeight: 700 }}>익일상승</div>
            <div style={{ fontSize: 22, fontWeight: 900, color: res.nextDayRiseProbability >= 70 ? color : "#94a3b8" }}>{res.nextDayRiseProbability}<span style={{ fontSize: 14 }}>%</span></div>
          </div>
          <div style={{ textAlign: "center", padding: 10, background: "#f8fafc", borderRadius: 8 }}>
            <div style={{ fontSize: 10, color: "#64748b", fontWeight: 700 }}>신뢰도</div>
            <div style={{ fontSize: 22, fontWeight: 900, color: res.confidenceScore >= 75 ? "#22c55e" : res.confidenceScore >= 50 ? "#f59e0b" : "#dc2626" }}>{res.confidenceScore}<span style={{ fontSize: 14 }}>%</span></div>
          </div>
        </div>

        {/* 4엔진 레이더 */}
        {res.engines && eng.supply && (
          <div style={{ background: "#f8fafc", padding: 14, borderRadius: 10, marginBottom: 14 }}>
            <div style={{ fontSize: 12, fontWeight: 800, color: "#475569", marginBottom: 8, textAlign: "center" }}>🎯 4엔진 분석</div>
            <RadarChart engines={res.engines} color={color} />
          </div>
        )}

        {/* 추출된 데이터 (16개 필드) */}
        {ed && Object.keys(ed).length > 0 && (
          <div style={{ marginBottom: 14 }}>
            <div style={{ fontSize: 11, fontWeight: 800, color: "#475569", marginBottom: 6 }}>📋 추출된 데이터</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px,1fr))", gap: 0, background: "#fff", border: "1px solid #e2e8f0", borderRadius: 8, overflow: "hidden" }}>
              {Object.keys(EXTRACTED_LABELS).map(function (k) {
                const v = ed[k];
                if (!v || v === "확인불가" || v === "-" || String(v).trim() === "") return null;
                return (
                  <div key={k} style={{ padding: "8px 10px", borderBottom: "1px solid #f1f5f9", borderRight: "1px solid #f1f5f9", display: "flex", justifyContent: "space-between", gap: 6, fontSize: 11 }}>
                    <span style={{ color: "#94a3b8", flexShrink: 0 }}>{EXTRACTED_LABELS[k]}</span>
                    <span style={{ color: "#1e293b", fontWeight: 700, textAlign: "right", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{v}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* 4엔진 상세 점수 + 근거 */}
        {res.engines && eng.supply && (
          <div style={{ marginBottom: 14 }}>
            <div style={{ fontSize: 11, fontWeight: 800, color: "#475569", marginBottom: 6 }}>🔬 4엔진 상세 분석</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px,1fr))", gap: 8 }}>
              {engineItems.map(function (e) {
                if (!e.data) return null;
                const pct = (e.data.score / e.data.max) * 100;
                return (
                  <div key={e.key} style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 8, padding: 10 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 6 }}>
                      <span style={{ fontSize: 11, color: "#64748b", fontWeight: 700 }}>{e.label}</span>
                      <span><span style={{ fontSize: 18, fontWeight: 900, color: e.color, fontFamily: "'JetBrains Mono', monospace" }}>{e.data.score}</span><span style={{ fontSize: 10, color: "#94a3b8" }}>/{e.data.max}</span></span>
                    </div>
                    <div style={{ height: 4, background: "#e2e8f0", borderRadius: 2, marginBottom: 8, overflow: "hidden" }}>
                      <div style={{ width: pct + "%", height: "100%", background: e.color }} />
                    </div>
                    {e.items.map(function (it, idx) {
                      if (it[1] == null) return null;
                      return (
                        <div key={idx} style={{ display: "flex", justifyContent: "space-between", fontSize: 10, padding: "2px 0", color: "#64748b" }}>
                          <span>{it[0]}</span>
                          <span style={{ fontFamily: "'JetBrains Mono', monospace", color: "#1e293b", fontWeight: 700 }}>{it[1]}/{it[2]}</span>
                        </div>
                      );
                    })}
                    {e.data.reasoning && (
                      <div style={{ fontSize: 10, color: "#475569", marginTop: 6, paddingTop: 6, borderTop: "1px solid #f1f5f9", lineHeight: 1.5 }}>
                        {e.data.reasoning}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* 매물대 분석 (supplyZone) */}
        {sz && (
          <div style={{ marginBottom: 14 }}>
            <div style={{ fontSize: 11, fontWeight: 800, color: "#475569", marginBottom: 6 }}>🧱 매물대 돌파 분석</div>
            <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 8, padding: 12 }}>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(110px,1fr))", gap: 8, marginBottom: sz.detail || sz.thicknessLabel || sz.breakoutQuality ? 10 : 0 }}>
                <div style={{ textAlign: "center", padding: 8, background: "#f8fafc", borderRadius: 6 }}>
                  <div style={{ fontSize: 9, color: "#94a3b8", fontWeight: 700 }}>매물대 등급</div>
                  <div style={{ fontSize: 13, fontWeight: 800, color: sz.level === "long" ? "#dc2626" : sz.level === "mid" ? "#f59e0b" : "#1e293b" }}>{sz.levelLabel || "-"}</div>
                </div>
                <div style={{ textAlign: "center", padding: 8, background: "#f8fafc", borderRadius: 6 }}>
                  <div style={{ fontSize: 9, color: "#94a3b8", fontWeight: 700 }}>형성 기간</div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "#1e293b" }}>{sz.period || "-"}</div>
                </div>
                <div style={{ textAlign: "center", padding: 8, background: "#f8fafc", borderRadius: 6 }}>
                  <div style={{ fontSize: 9, color: "#94a3b8", fontWeight: 700 }}>두께</div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: sz.thickness === "heavy" ? "#dc2626" : sz.thickness === "medium" ? "#f59e0b" : "#94a3b8" }}>
                    {sz.thickness === "heavy" ? "두꺼움" : sz.thickness === "medium" ? "보통" : sz.thickness === "thin" ? "얇음" : "-"}
                  </div>
                </div>
                <div style={{ textAlign: "center", padding: 8, background: "#f8fafc", borderRadius: 6 }}>
                  <div style={{ fontSize: 9, color: "#94a3b8", fontWeight: 700 }}>현재 상태</div>
                  <div style={{ fontSize: 13, fontWeight: 800, color: sz.status === "돌파" || sz.status === "안착" ? "#22c55e" : sz.status === "저항" ? "#dc2626" : "#f59e0b" }}>{sz.status || "-"}</div>
                </div>
              </div>
              {sz.thicknessLabel && (
                <div style={{ fontSize: 12, color: "#475569", padding: 8, background: "#f8fafc", borderRadius: 6, marginBottom: 6, lineHeight: 1.5 }}>
                  <strong style={{ color: "#1e293b" }}>두께 분석:</strong> {sz.thicknessLabel}
                </div>
              )}
              {sz.breakoutQuality && (
                <div style={{ fontSize: 12, color: "#475569", padding: 8, background: "#f8fafc", borderRadius: 6, marginBottom: 6, lineHeight: 1.5 }}>
                  <strong style={{ color: "#1e293b" }}>돌파봉 품질:</strong> {sz.breakoutQuality}
                </div>
              )}
              {sz.detail && (
                <div style={{ fontSize: 12, color: "#1e293b", padding: 10, background: "#f0fdf4", borderRadius: 6, lineHeight: 1.6, borderLeft: "3px solid #22c55e" }}>
                  {sz.detail}
                </div>
              )}
            </div>
          </div>
        )}

        {/* 보조지표 (5개 + 종합) */}
        {ti && (
          <div style={{ marginBottom: 14 }}>
            <div style={{ fontSize: 11, fontWeight: 800, color: "#475569", marginBottom: 6, display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
              <span>📊 보조지표 (참고)</span>
              {ti.overallTone && <span style={{ fontSize: 10, padding: "2px 8px", background: statusColor(ti.overallTone) + "22", color: statusColor(ti.overallTone), borderRadius: 4, fontWeight: 700 }}>종합: {statusLabel(ti.overallTone)}</span>}
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(145px,1fr))", gap: 8 }}>
              {indicators.map(function (ind) {
                if (!ind.data) return null;
                const col = statusColor(ind.data.status);
                return (
                  <div key={ind.key} style={{ padding: 10, borderRadius: 8, border: "1px solid " + col + "44", background: col + "0a" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                      <div>
                        <div style={{ fontSize: 11, fontWeight: 800, color: "#1e293b" }}>{ind.name}</div>
                        {ind.master && <div style={{ fontSize: 9, color: "#94a3b8" }}>{ind.master}</div>}
                      </div>
                      <span style={{ fontSize: 10, fontWeight: 700, color: col }}>● {statusLabel(ind.data.status)}</span>
                    </div>
                    <div style={{ fontSize: 12, fontWeight: 700, color: "#1e293b", marginBottom: 3 }}>{ind.data.value || "-"}</div>
                    {ind.data.comment && <div style={{ fontSize: 10, color: "#64748b", lineHeight: 1.4 }}>{ind.data.comment}</div>}
                  </div>
                );
              })}
            </div>
            {ti.summary && (
              <div style={{ fontSize: 12, color: "#1e293b", padding: 10, background: "#f8fafc", borderRadius: 6, marginTop: 8, lineHeight: 1.6, borderLeft: "3px solid " + statusColor(ti.overallTone) }}>
                {ti.summary}
              </div>
            )}
          </div>
        )}

        {/* 가격 액션 플랜 */}
        {strat.entryPrice && (
          <div style={{ background: "#fef3c7", border: "1px solid #fbbf24", borderRadius: 10, padding: 12, marginBottom: 14 }}>
            <div style={{ fontSize: 11, fontWeight: 800, color: "#92400e", marginBottom: 8 }}>💰 가격 액션 플랜</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(80px,1fr))", gap: 6 }}>
              <div style={{ textAlign: "center", padding: 8, background: "#fff", borderRadius: 6 }}>
                <div style={{ fontSize: 9, color: "#64748b", fontWeight: 700 }}>진입</div>
                <div style={{ fontSize: 14, fontWeight: 800, color: "#1e293b", fontFamily: "'JetBrains Mono', monospace" }}>{fmtPrice(strat.entryPrice)}</div>
              </div>
              <div style={{ textAlign: "center", padding: 8, background: "#dcfce7", borderRadius: 6 }}>
                <div style={{ fontSize: 9, color: "#15803d", fontWeight: 700 }}>1차익절</div>
                <div style={{ fontSize: 14, fontWeight: 800, color: "#15803d", fontFamily: "'JetBrains Mono', monospace" }}>{fmtPrice(strat.tp1Price)}</div>
              </div>
              {strat.tp2Price && (
                <div style={{ textAlign: "center", padding: 8, background: "#dcfce7", borderRadius: 6 }}>
                  <div style={{ fontSize: 9, color: "#15803d", fontWeight: 700 }}>2차익절</div>
                  <div style={{ fontSize: 14, fontWeight: 800, color: "#15803d", fontFamily: "'JetBrains Mono', monospace" }}>{fmtPrice(strat.tp2Price)}</div>
                </div>
              )}
              <div style={{ textAlign: "center", padding: 8, background: "#dbeafe", borderRadius: 6 }}>
                <div style={{ fontSize: 9, color: "#1e40af", fontWeight: 700 }}>손절</div>
                <div style={{ fontSize: 14, fontWeight: 800, color: "#1e40af", fontFamily: "'JetBrains Mono', monospace" }}>{fmtPrice(strat.slPrice)}</div>
              </div>
            </div>
          </div>
        )}

        {/* 진입/청산/손절/홀딩 전략 텍스트 */}
        {(strat.entry || strat.exit || strat.stopLoss || strat.hold) && (
          <div style={{ marginBottom: 14 }}>
            <div style={{ fontSize: 11, fontWeight: 800, color: "#475569", marginBottom: 6 }}>📋 매매 전략</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px,1fr))", gap: 6 }}>
              {strat.entry && <div style={{ padding: 10, background: "#f0fdf4", borderRadius: 6, fontSize: 11, lineHeight: 1.5, borderLeft: "3px solid #22c55e" }}><strong style={{ color: "#15803d" }}>진입</strong> {strat.entry}</div>}
              {strat.exit && <div style={{ padding: 10, background: "#eff6ff", borderRadius: 6, fontSize: 11, lineHeight: 1.5, borderLeft: "3px solid #3b82f6" }}><strong style={{ color: "#1e40af" }}>청산</strong> {strat.exit}</div>}
              {strat.stopLoss && <div style={{ padding: 10, background: "#fef2f2", borderRadius: 6, fontSize: 11, lineHeight: 1.5, borderLeft: "3px solid #dc2626" }}><strong style={{ color: "#991b1b" }}>손절</strong> {strat.stopLoss}</div>}
              {strat.hold && <div style={{ padding: 10, background: "#fef3c7", borderRadius: 6, fontSize: 11, lineHeight: 1.5, borderLeft: "3px solid #f59e0b" }}><strong style={{ color: "#92400e" }}>홀딩</strong> {strat.hold}</div>}
            </div>
          </div>
        )}

        {/* 핵심 근거 */}
        {res.keyReasons && res.keyReasons.length > 0 && (
          <div style={{ marginBottom: 12 }}>
            <div style={{ fontSize: 11, fontWeight: 800, color: "#475569", marginBottom: 6 }}>✅ 핵심 근거</div>
            {res.keyReasons.map(function (r, i) {
              return (
                <div key={i} style={{ fontSize: 12, color: "#1e293b", padding: "6px 10px", background: "#f0fdf4", borderRadius: 6, marginBottom: 4, borderLeft: "3px solid #22c55e", lineHeight: 1.5 }}>
                  {r}
                </div>
              );
            })}
          </div>
        )}

        {/* 리스크 */}
        {res.risks && res.risks.length > 0 && (
          <div style={{ marginBottom: 12 }}>
            <div style={{ fontSize: 11, fontWeight: 800, color: "#475569", marginBottom: 6 }}>⚠️ 리스크</div>
            {res.risks.map(function (r, i) {
              return (
                <div key={i} style={{ fontSize: 12, color: "#991b1b", padding: "6px 10px", background: "#fef2f2", borderRadius: 6, marginBottom: 4, borderLeft: "3px solid #dc2626", lineHeight: 1.5 }}>
                  {r}
                </div>
              );
            })}
          </div>
        )}

        {/* 분석된 이미지 요약 */}
        {res.imagesAnalyzed && res.imagesAnalyzed.length > 0 && (
          <div style={{ marginBottom: 12 }}>
            <div style={{ fontSize: 11, fontWeight: 800, color: "#475569", marginBottom: 6 }}>🖼️ 분석된 이미지</div>
            {res.imagesAnalyzed.map(function (im, i) {
              return (
                <div key={i} style={{ display: "flex", gap: 8, alignItems: "center", padding: "6px 10px", background: "#f8fafc", borderRadius: 6, marginBottom: 4, fontSize: 11 }}>
                  <span style={{ fontSize: 10, padding: "2px 8px", background: "#dbeafe", color: "#1e40af", borderRadius: 4, fontWeight: 700, flexShrink: 0 }}>{im.type}</span>
                  <span style={{ color: "#475569", lineHeight: 1.4 }}>{im.summary}</span>
                </div>
              );
            })}
          </div>
        )}

        {/* 침착해 종합 평가 */}
        {res.chimchakhaeAnalysis && (
          <div style={{ background: "linear-gradient(135deg, #faf5ff 0%, #eff6ff 100%)", border: "1px solid #c4b5fd", borderRadius: 10, padding: 12, fontSize: 12, lineHeight: 1.7, color: "#1e293b" }}>
            <div style={{ fontSize: 11, fontWeight: 800, color: "#7c3aed", marginBottom: 6 }}>🎯 침착해 종합 평가</div>
            {res.chimchakhaeAnalysis}
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================================
// KIS 시그널 데이터 → 침착해 100점 환산 (간이 룰)
// ============================================================
// KIS raw 데이터로 차트/매물대 분석은 불가능 → 데이터 가능한 부분만 부분점수
// supply/market 부분점수 가중치 키워서 60점 만점 환산 후 100점으로 비례
// ============================================================
export function calcChimchakhaeScore(s) {
  // 침착해 4엔진 부분 점수 (KIS 데이터로 가능한 만큼만)
  let supply = 0, supplyMax = 20;       // 35점 중 거래대금/수급만 (장후반/일관성 X)
  let market = 0, marketMax = 5;        // 25점 중 거래대금 기반 시황 강도만
  let chart  = 0, chartMax  = 10;       // 25점 중 등락률+윗꼬리만
  let material = 0, materialMax = 5;    // 15점 중 거래대금 + 시총 추정만 (재료 알 수 없음)

  // ── 수급 엔진 (20점 만점)
  // 동반매수 (10점): 외+기 동시=10 / 외만=7 / 기만=5
  if (s.investor === "기+외" || s.investor === "외+기") supply += 10;
  else if (s.investor === "외인" || s.investor === "외만") supply += 7;
  else if (s.investor === "기관" || s.investor === "기만") supply += 5;
  else if (s.investor === "둘다-") supply += 0;
  // 거래대금 (10점): 부드러운 계단 (3000억 만점, 100억 최저)
  const amt = s.amount || 0;
  if (amt >= 3000) supply += 10;
  else if (amt >= 1500) supply += 9;
  else if (amt >= 1000) supply += 8;
  else if (amt >= 700) supply += 7;
  else if (amt >= 500) supply += 6;
  else if (amt >= 300) supply += 4;
  else if (amt >= 200) supply += 3;
  else if (amt >= 100) supply += 2;
  else if (amt >= 50) supply += 1;

  // ── 시황·섹터 엔진 (5점 만점) - 거래대금 기반 시황 강도 (세분화)
  if (amt >= 3000) market += 5;
  else if (amt >= 1500) market += 4;
  else if (amt >= 800) market += 3;
  else if (amt >= 400) market += 2;
  else if (amt >= 200) market += 1;

  // ── 차트 엔진 (10점 만점)
  // 등락률 (5점): 침착해 골든존 13~17%, 너무 강한 등락 감점
  const ch = s.change || 0;
  if (ch >= 13 && ch <= 17) chart += 5;        // 골든존
  else if (ch >= 11 && ch < 13) chart += 4;    // 적정
  else if (ch > 17 && ch <= 20) chart += 4;    // 약간 강함
  else if (ch >= 9 && ch < 11) chart += 3;     // 약함
  else if (ch > 20 && ch <= 25) chart += 2;    // 과열
  else if (ch >= 7 && ch < 9) chart += 1;      // 부족
  else if (ch > 25) chart += 0;                // 너무 강함 (꺾일 위험)
  // 윗꼬리 (5점): 부드러운 계단, 큰 윗꼬리는 감점 강화
  const wick = s.wick != null ? s.wick : 99;
  if (wick <= 0.5) chart += 5;
  else if (wick <= 1.5) chart += 4;
  else if (wick <= 3) chart += 3;
  else if (wick <= 5) chart += 2;
  else if (wick <= 7) chart += 1;
  else if (wick <= 10) chart -= 1;
  else chart -= 3;

  // ── 재료 엔진 (5점 만점) - 코스닥 + 거래대금 변동 + 강한 등락 (소형주 부각)
  if (s.market === "코스닥" || s.market === "KO" || s.market === "KQ") material += 3;
  if (amt >= 500) material += 2;
  else if (amt >= 200) material += 1;
  // 강한 등락은 재료 강도 신호 (수급보다 가벼운 가산)
  if (ch >= 20) material = Math.min(5, material + 1);

  // 합계 (40점 만점) → 100점 환산
  const totalRaw = supply + market + chart + material;
  const totalMax = supplyMax + marketMax + chartMax + materialMax;
  const score100 = Math.round((totalRaw / totalMax) * 100);

  // 등급 (7단계)
  let grade = "C";
  if (score100 >= 90) grade = "S+";
  else if (score100 >= 80) grade = "S";
  else if (score100 >= 70) grade = "A+";
  else if (score100 >= 60) grade = "A";
  else if (score100 >= 50) grade = "B+";
  else if (score100 >= 40) grade = "B";

  // 추천 비중
  let weight = 0;
  if (grade === "S+") weight = 28;
  else if (grade === "S") weight = 22;
  else if (grade === "A+") weight = 16;
  else if (grade === "A") weight = 12;
  else if (grade === "B+") weight = 7;
  else if (grade === "B") weight = 3;

  return {
    score: score100,
    grade: grade,
    weight: weight,
    breakdown: {
      supply: { score: supply, max: supplyMax },
      market: { score: market, max: marketMax },
      chart: { score: chart, max: chartMax },
      material: { score: material, max: materialMax },
    },
    note: "KIS 데이터 기반 간이 환산. 정확한 분석은 차트 업로드 후 AI분석 탭 사용.",
  };
}

export function chimchakhaeGradeColor(grade) {
  if (grade === "S+") return "#dc2626";
  if (grade === "S") return "#ef4444";
  if (grade === "A+") return "#ea580c";
  if (grade === "A") return "#f59e0b";
  if (grade === "B+") return "#3b82f6";
  if (grade === "B") return "#94a3b8";
  return "#64748b";
}

// ============================================================
// 침착해 오늘 탭 (TodaySignals 변형)
// ============================================================
export function ChimchakhaeToday(props) {
  const apiUrl = props.apiUrl;
  const [data, setData] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [err, setErr] = React.useState(null);
  const [sortBy, setSortBy] = React.useState("score");
  const [selected, setSelected] = React.useState(null);

  const load = React.useCallback(async function () {
    setLoading(true); setErr(null);
    try {
      const r = await fetch(apiUrl);
      const j = await r.json();
      if (!j.ok) { setErr(j.error || "API 오류"); setLoading(false); return; }
      const all = [].concat(
        (j.signals && j.signals.S) || [],
        (j.signals && j.signals.A) || [],
        (j.signals && j.signals.B) || [],
        (j.signals && j.signals.X) || []
      );
      const seen = new Set();
      const uniq = all.filter(function (x) { if (seen.has(x.code)) return false; seen.add(x.code); return true; });
      // 침착해 점수 매핑
      const enriched = uniq.map(function (s) {
        const cc = calcChimchakhaeScore(s);
        return Object.assign({}, s, { ccScore: cc.score, ccGrade: cc.grade, ccWeight: cc.weight, ccBreakdown: cc.breakdown, ccNote: cc.note });
      });
      setData({ date: j.date, time: j.time, signals: enriched });
    } catch (e) { setErr(e.message); }
    setLoading(false);
  }, [apiUrl]);

  React.useEffect(function () { load(); }, [load]);

  if (loading) return (
    <div style={{ textAlign: "center", padding: "60px 20px" }}>
      <div style={{ fontSize: 36, marginBottom: 12 }}>⏳</div>
      <div style={{ fontSize: 16, fontWeight: 600, color: "#64748b" }}>KIS API 스크리닝 중...</div>
      <div style={{ fontSize: 13, color: "#94a3b8", marginTop: 4 }}>침착해 100점 환산 분석 중</div>
    </div>
  );
  if (err) return (
    <div style={{ textAlign: "center", padding: "40px 20px" }}>
      <div style={{ fontSize: 36, marginBottom: 12 }}>⚠️</div>
      <div style={{ fontSize: 15, color: "#dc2626", marginBottom: 8 }}>{err}</div>
      <button onClick={load} style={{ padding: "8px 20px", borderRadius: 8, border: "1px solid #e2e8f0", background: "#fff", fontSize: 14, fontWeight: 600, cursor: "pointer" }}>다시 시도</button>
    </div>
  );
  if (!data) return null;

  const sorted = [].concat(data.signals).sort(function (a, b) {
    if (sortBy === "score") return (b.ccScore || 0) - (a.ccScore || 0);
    if (sortBy === "amount") return (b.amount || 0) - (a.amount || 0);
    if (sortBy === "change") return (b.change || 0) - (a.change || 0);
    return 0;
  });

  // 등급별 카운트
  const counts = {};
  ["S+", "S", "A+", "A", "B+", "B", "C"].forEach(function (g) { counts[g] = 0; });
  sorted.forEach(function (s) { if (counts[s.ccGrade] != null) counts[s.ccGrade]++; });

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12, flexWrap: "wrap", gap: 8 }}>
        <div style={{ fontSize: 13, color: "#64748b" }}>{data.date} · {data.time} KST · 침착해 환산</div>
        <button onClick={load} style={{ padding: "5px 12px", borderRadius: 8, border: "1px solid #e2e8f0", background: "#fff", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>🔄</button>
      </div>

      {/* 등급별 카운트 */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(70px, 1fr))", gap: 6, marginBottom: 14 }}>
        {["S+", "S", "A+", "A", "B+", "B"].map(function (g) {
          const col = chimchakhaeGradeColor(g);
          return (
            <div key={g} style={{ textAlign: "center", padding: "8px 0", borderRadius: 8, background: col + "10", border: "1px solid " + col + "30" }}>
              <div style={{ fontSize: 18, fontWeight: 900, color: col }}>{counts[g]}</div>
              <div style={{ fontSize: 10, color: "#64748b", fontWeight: 700 }}>{g}</div>
            </div>
          );
        })}
      </div>

      {/* 정렬 */}
      <div style={{ display: "flex", gap: 6, marginBottom: 10, flexWrap: "wrap" }}>
        <span style={{ fontSize: 11, color: "#94a3b8", fontWeight: 700, alignSelf: "center" }}>정렬:</span>
        {[{ k: "score", l: "침착해 점수" }, { k: "amount", l: "거래대금" }, { k: "change", l: "등락률" }].map(function (o) {
          return (
            <button key={o.k} onClick={function () { setSortBy(o.k); }} style={{ padding: "4px 10px", borderRadius: 6, border: "1px solid " + (sortBy === o.k ? "#7c3aed" : "#e2e8f0"), background: sortBy === o.k ? "#7c3aed" : "#fff", color: sortBy === o.k ? "#fff" : "#64748b", fontSize: 11, fontWeight: 700, cursor: "pointer" }}>{o.l}</button>
          );
        })}
      </div>

      <div style={{ fontSize: 10, color: "#94a3b8", padding: "6px 10px", background: "#fffbeb", border: "1px solid #fcd34d", borderRadius: 6, marginBottom: 10, lineHeight: 1.4 }}>
        ℹ️ 침착해 100점은 KIS 데이터(거래대금/수급/등락률/윗꼬리)로 환산한 간이 점수. 정확한 분석은 차트 이미지 업로드 → AI분석 탭.
      </div>

      {sorted.length === 0 ? (
        <div style={{ textAlign: "center", padding: 40, color: "#94a3b8" }}>
          <div style={{ fontSize: 36, marginBottom: 8 }}>📭</div>
          <div style={{ fontSize: 15 }}>오늘은 시그널이 없습니다</div>
        </div>
      ) : sorted.map(function (s, i) {
        const col = chimchakhaeGradeColor(s.ccGrade);
        return (
          <div key={i} onClick={function () { setSelected(s); }} style={{ display: "flex", alignItems: "center", gap: 10, padding: "11px 14px", borderRadius: 12, border: "1px solid #e2e8f0", marginBottom: 6, background: "#fff", cursor: "pointer", transition: "border-color 0.15s" }}>
            <div style={{ width: 46, height: 46, borderRadius: 10, background: col + "15", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, flexDirection: "column" }}>
              <span style={{ fontSize: 14, fontWeight: 900, color: col, lineHeight: 1 }}>{s.ccGrade}</span>
              <span style={{ fontSize: 9, color: col, fontWeight: 700, marginTop: 2 }}>{s.ccScore}</span>
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
                <span style={{ fontWeight: 700, fontSize: 14 }}>{s.name}</span>
                <span style={{ fontSize: 11, fontWeight: 700, color: "#dc2626" }}>+{s.change}%</span>
              </div>
              <div style={{ fontSize: 10, color: "#94a3b8", marginTop: 2 }}>{s.investor} · {s.market} · {s.amount}억 · 윗꼬리{s.wick}%</div>
            </div>
            <div style={{ textAlign: "right", flexShrink: 0 }}>
              <div style={{ fontSize: 11, color: "#94a3b8" }}>비중</div>
              <div style={{ fontSize: 13, fontWeight: 800, color: s.ccWeight >= 15 ? col : "#94a3b8" }}>{s.ccWeight}%</div>
            </div>
          </div>
        );
      })}
      {selected && <ChimchakhaeDetailModal item={selected} onClose={function () { setSelected(null); }} />}
    </div>
  );
}

// ============================================================
// 침착해 시그널DB 탭 - 같은 데이터 + 침착해 점수 (간이 버전)
// ============================================================
export function ChimchakhaeDB(props) {
  const D = props.records || [];
  const [tab, setTab] = React.useState("S+");
  const [pg, setPg] = React.useState(0);
  const PP = 20;
  const [selected, setSelected] = React.useState(null);
  const [query, setQuery] = React.useState("");
  const [mkt, setMkt] = React.useState("ALL");
  const [iv, setIv] = React.useState("ALL");

  // 모든 레코드에 침착해 점수 매핑
  const enriched = React.useMemo(function () {
    // 거래대금 문자열 파싱 ("59272억" → 59272, "1.2兆" → 12000)
    function parseAmt(mc) {
      if (!mc || typeof mc !== "string") return 0;
      const m = mc.match(/(\d+(?:\.\d+)?)/);
      if (!m) return 0;
      const n = +m[1];
      return mc.indexOf("兆") >= 0 || mc.indexOf("조") >= 0 ? n * 10000 : n;
    }
    return D.map(function (r) {
      // r 형태: {n, d, ch, m, mc, iv, sc, g, ...}
      // KIS 시그널 형태로 변환해서 calc
      const fakeSignal = {
        change: r.ch,
        amount: parseAmt(r.mc),
        investor: r.iv,
        market: r.m,
        wick: r.wk || 0,
      };
      const cc = calcChimchakhaeScore(fakeSignal);
      return Object.assign({}, r, { ccScore: cc.score, ccGrade: cc.grade, ccWeight: cc.weight, ccBreakdown: cc.breakdown, ccNote: cc.note });
    });
  }, [D]);

  // 검색·시장·수급 필터 (등급 탭 적용 전)
  const q = query.trim();
  const preFiltered = enriched.filter(function (r) {
    if (q && r.n.indexOf(q) === -1) return false;
    if (mkt !== "ALL" && r.m !== mkt) return false;
    if (iv !== "ALL" && r.iv !== iv) return false;
    return true;
  });

  const filtered = preFiltered.filter(function (r) { return r.ccGrade === tab; });
  const mx = Math.max(0, Math.ceil(filtered.length / PP) - 1);
  const pd = filtered.slice(pg * PP, (pg + 1) * PP);

  // 등급별 카운트 (필터 적용 후)
  const counts = {};
  ["S+", "S", "A+", "A", "B+", "B", "C"].forEach(function (g) { counts[g] = 0; });
  preFiltered.forEach(function (r) { if (counts[r.ccGrade] != null) counts[r.ccGrade]++; });

  // 페이지 리셋 (필터 변경 시)
  React.useEffect(function () { setPg(0); }, [query, mkt, iv, tab]);

  return (
    <div>
      <div style={{ fontSize: 13, color: "#64748b", marginBottom: 10 }}>
        총 <strong style={{ color: "#1e293b" }}>{enriched.length}건</strong> · 필터: <strong style={{ color: "#1e293b" }}>{preFiltered.length}건</strong>
      </div>

      <div style={{ fontSize: 10, color: "#94a3b8", padding: "6px 10px", background: "#fffbeb", border: "1px solid #fcd34d", borderRadius: 6, marginBottom: 12, lineHeight: 1.4 }}>
        ℹ️ 과거 시그널 DB에 침착해 100점 룰 적용. 차트/매물대/재료 분석은 별도 차트 업로드 필요.
      </div>

      {/* 검색바 */}
      <div style={{ position: "relative", marginBottom: 8 }}>
        <input
          type="text"
          value={query}
          onChange={function (e) { setQuery(e.target.value); }}
          placeholder="🔍 종목명 검색..."
          style={{ width: "100%", padding: "9px 30px 9px 12px", borderRadius: 8, border: "1px solid #e2e8f0", fontSize: 13, background: "#fff", outline: "none", boxSizing: "border-box" }}
        />
        {query && (
          <button onClick={function () { setQuery(""); }} style={{ position: "absolute", right: 8, top: "50%", transform: "translateY(-50%)", width: 22, height: 22, borderRadius: "50%", background: "#f1f5f9", border: "none", cursor: "pointer", fontSize: 11, color: "#64748b" }}>✕</button>
        )}
      </div>

      {/* 시장 토글 */}
      <div style={{ display: "flex", gap: 4, marginBottom: 6 }}>
        {[
          { k: "ALL", label: "전체 시장" },
          { k: "KS", label: "코스피" },
          { k: "KO", label: "코스닥" },
        ].map(function (m) {
          const active = mkt === m.k;
          return (
            <button key={m.k} onClick={function () { setMkt(m.k); }} style={{ flex: 1, padding: "6px 4px", borderRadius: 7, border: "1px solid " + (active ? "#1e293b" : "#e2e8f0"), background: active ? "#1e293b" : "#fff", color: active ? "#fff" : "#64748b", fontSize: 11, fontWeight: 700, cursor: "pointer" }}>{m.label}</button>
          );
        })}
      </div>

      {/* 수급 토글 */}
      <div style={{ display: "flex", gap: 4, marginBottom: 12, flexWrap: "wrap" }}>
        {[
          { k: "ALL", label: "전체 수급" },
          { k: "기+외", label: "기+외" },
          { k: "외만", label: "외인만" },
          { k: "기만", label: "기관만" },
          { k: "둘다-", label: "둘다-" },
        ].map(function (x) {
          const active = iv === x.k;
          const col = x.k === "기+외" ? "#7c3aed" : x.k === "외만" ? "#2563eb" : x.k === "기만" ? "#dc2626" : x.k === "둘다-" ? "#94a3b8" : "#1e293b";
          return (
            <button key={x.k} onClick={function () { setIv(x.k); }} style={{ flex: "1 1 80px", padding: "6px 4px", borderRadius: 7, border: "1px solid " + (active ? col : "#e2e8f0"), background: active ? col : "#fff", color: active ? "#fff" : "#64748b", fontSize: 11, fontWeight: 700, cursor: "pointer" }}>{x.label}</button>
          );
        })}
      </div>

      {/* 통계 카드 (필터 적용된 preFiltered 기준) */}
      {(function () {
        let resolved = 0, totalProfit = 0, wins = 0;
        const resultCount = { TP1: 0, TP1_BE: 0, BOTH: 0, SL: 0, TO: 0 };
        preFiltered.forEach(function (r) {
          if (r.r && resultCount[r.r] != null) resultCount[r.r]++;
          if (typeof r.t === "number" && r.r && r.r !== "TO") {
            resolved++;
            totalProfit += r.t;
            if (r.t > 0) wins++;
          }
        });
        const avg = resolved > 0 ? (totalProfit / resolved).toFixed(1) : "—";
        const winRate = resolved > 0 ? Math.round((wins / resolved) * 100) : 0;
        const avgCol = resolved > 0 ? (totalProfit >= 0 ? "#dc2626" : "#2563eb") : "#94a3b8";
        return (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 6, marginBottom: 12 }}>
            <div style={{ textAlign: "center", padding: "8px 4px", borderRadius: 9, background: "#f8fafc", border: "1px solid #e2e8f0" }}>
              <div style={{ fontSize: 10, color: "#94a3b8", fontWeight: 700, marginBottom: 2 }}>평균손익</div>
              <div style={{ fontSize: 16, fontWeight: 900, color: avgCol }}>{avg !== "—" ? (totalProfit >= 0 ? "+" : "") + avg + "%" : "—"}</div>
            </div>
            <div style={{ textAlign: "center", padding: "8px 4px", borderRadius: 9, background: "#f8fafc", border: "1px solid #e2e8f0" }}>
              <div style={{ fontSize: 10, color: "#94a3b8", fontWeight: 700, marginBottom: 2 }}>승률</div>
              <div style={{ fontSize: 16, fontWeight: 900, color: winRate >= 50 ? "#dc2626" : "#64748b" }}>{resolved > 0 ? winRate + "%" : "—"}</div>
            </div>
            <div style={{ textAlign: "center", padding: "8px 4px", borderRadius: 9, background: "#f8fafc", border: "1px solid #e2e8f0" }}>
              <div style={{ fontSize: 10, color: "#94a3b8", fontWeight: 700, marginBottom: 2 }}>익절</div>
              <div style={{ fontSize: 16, fontWeight: 900, color: "#dc2626" }}>{resultCount.TP1 + resultCount.TP1_BE + resultCount.BOTH}건</div>
            </div>
            <div style={{ textAlign: "center", padding: "8px 4px", borderRadius: 9, background: "#f8fafc", border: "1px solid #e2e8f0" }}>
              <div style={{ fontSize: 10, color: "#94a3b8", fontWeight: 700, marginBottom: 2 }}>손절</div>
              <div style={{ fontSize: 16, fontWeight: 900, color: "#2563eb" }}>{resultCount.SL}건</div>
            </div>
          </div>
        );
      })()}

      {/* 결과 분포 가로 막대 */}
      {(function () {
        const dist = { TP1: 0, TP1_BE: 0, BOTH: 0, SL: 0, TO: 0 };
        let total = 0;
        preFiltered.forEach(function (r) { if (r.r && dist[r.r] != null) { dist[r.r]++; total++; } });
        if (total === 0) return null;
        const segs = [
          { k: "BOTH", label: "BOTH", col: "#dc2626", count: dist.BOTH },
          { k: "TP1", label: "TP1", col: "#ef4444", count: dist.TP1 },
          { k: "TP1_BE", label: "TP1_BE", col: "#f59e0b", count: dist.TP1_BE },
          { k: "TO", label: "TO", col: "#94a3b8", count: dist.TO },
          { k: "SL", label: "SL", col: "#3b82f6", count: dist.SL },
        ];
        return (
          <div style={{ marginBottom: 14 }}>
            <div style={{ display: "flex", height: 14, borderRadius: 7, overflow: "hidden", border: "1px solid #e2e8f0" }}>
              {segs.map(function (s) {
                const w = (s.count / total) * 100;
                if (w === 0) return null;
                return <div key={s.k} title={s.label + " " + s.count + "건"} style={{ width: w + "%", background: s.col }} />;
              })}
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4, fontSize: 9, color: "#94a3b8", flexWrap: "wrap", gap: 4 }}>
              {segs.map(function (s) {
                if (s.count === 0) return null;
                return (
                  <span key={s.k} style={{ display: "flex", alignItems: "center", gap: 3 }}>
                    <span style={{ width: 6, height: 6, borderRadius: 2, background: s.col, display: "inline-block" }} />
                    {s.label} {s.count}
                  </span>
                );
              })}
            </div>
          </div>
        );
      })()}

      {/* 등급 탭 */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(60px, 1fr))", gap: 4, marginBottom: 14 }}>
        {["S+", "S", "A+", "A", "B+", "B", "C"].map(function (g) {
          const col = chimchakhaeGradeColor(g);
          const active = tab === g;
          return (
            <button key={g} onClick={function () { setTab(g); }} style={{ padding: "8px 4px", borderRadius: 8, border: "1px solid " + (active ? col : "#e2e8f0"), background: active ? col : col + "0a", color: active ? "#fff" : col, fontSize: 11, fontWeight: 800, cursor: "pointer" }}>
              <div style={{ fontSize: 16, fontWeight: 900, lineHeight: 1 }}>{g}</div>
              <div style={{ fontSize: 10, marginTop: 2, opacity: 0.85 }}>{counts[g]}건</div>
            </button>
          );
        })}
      </div>

      {/* 데이터 리스트 */}
      {pd.length === 0 ? (
        <div style={{ textAlign: "center", padding: 40, color: "#94a3b8" }}>
          <div style={{ fontSize: 32, marginBottom: 8 }}>📭</div>
          <div style={{ fontSize: 14 }}>{tab} 등급 데이터 없음</div>
        </div>
      ) : (
        <div style={{ borderRadius: 10, border: "1px solid #e2e8f0", overflow: "hidden" }}>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", minWidth: 600, borderCollapse: "collapse", fontSize: 12 }}>
              <thead>
                <tr style={{ background: "#f8fafc" }}>
                  <th style={{ padding: "8px 6px", textAlign: "center", fontSize: 10, color: "#94a3b8", borderBottom: "2px solid #e2e8f0" }}>날짜</th>
                  <th style={{ padding: "8px 6px", textAlign: "left", fontSize: 10, color: "#94a3b8", borderBottom: "2px solid #e2e8f0" }}>종목</th>
                  <th style={{ padding: "8px 6px", textAlign: "center", fontSize: 10, color: "#94a3b8", borderBottom: "2px solid #e2e8f0" }}>등락</th>
                  <th style={{ padding: "8px 6px", textAlign: "center", fontSize: 10, color: "#94a3b8", borderBottom: "2px solid #e2e8f0" }}>수급</th>
                  <th style={{ padding: "8px 6px", textAlign: "center", fontSize: 10, color: "#94a3b8", borderBottom: "2px solid #e2e8f0" }}>침</th>
                  <th style={{ padding: "8px 6px", textAlign: "center", fontSize: 10, color: "#94a3b8", borderBottom: "2px solid #e2e8f0" }}>NEO</th>
                  <th style={{ padding: "8px 6px", textAlign: "center", fontSize: 10, color: "#94a3b8", borderBottom: "2px solid #e2e8f0" }}>실현</th>
                </tr>
              </thead>
              <tbody>
                {pd.map(function (r, i) {
                  const ccCol = chimchakhaeGradeColor(r.ccGrade);
                  return (
                    <tr key={i} onClick={function () { setSelected(r); }} style={{ borderBottom: "1px solid #f1f5f9", background: "#fff", cursor: "pointer" }} onMouseEnter={function (e) { e.currentTarget.style.background = "#f8fafc"; }} onMouseLeave={function (e) { e.currentTarget.style.background = "#fff"; }}>
                      <td style={{ padding: "8px 6px", textAlign: "center", fontSize: 10, color: "#94a3b8" }}>{r.d ? r.d.slice(2) : "-"}</td>
                      <td style={{ padding: "8px 6px", fontWeight: 700, fontSize: 12, maxWidth: 140, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{r.n}</td>
                      <td style={{ padding: "8px 6px", textAlign: "center", color: "#dc2626", fontWeight: 700, fontSize: 11 }}>+{r.ch}%</td>
                      <td style={{ padding: "8px 6px", textAlign: "center", fontSize: 10, fontWeight: 600, color: r.iv === "기+외" ? "#7c3aed" : r.iv === "외인" ? "#2563eb" : "#94a3b8" }}>{r.iv}</td>
                      <td style={{ padding: "8px 6px", textAlign: "center" }}>
                        <span style={{ background: ccCol + "15", color: ccCol, padding: "2px 7px", borderRadius: 8, fontWeight: 800, fontSize: 11 }}>{r.ccScore}</span>
                      </td>
                      <td style={{ padding: "8px 6px", textAlign: "center" }}>
                        <span style={{ background: "#f1f5f9", color: "#64748b", padding: "2px 6px", borderRadius: 8, fontWeight: 700, fontSize: 10 }}>{r.sc}</span>
                      </td>
                      <td style={{ padding: "8px 6px", textAlign: "center", fontWeight: 800, fontSize: 12, color: r.t > 0 ? "#dc2626" : "#2563eb" }}>{r.t > 0 ? "+" : ""}{r.t}%</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 페이지네이션 */}
      {filtered.length > PP && (
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 12 }}>
          <span style={{ fontSize: 11, color: "#94a3b8" }}>{filtered.length}건 중 {pg * PP + 1}~{Math.min((pg + 1) * PP, filtered.length)}</span>
          <div style={{ display: "flex", gap: 4 }}>
            <button onClick={function () { setPg(Math.max(0, pg - 1)); }} disabled={pg === 0} style={{ padding: "4px 10px", borderRadius: 6, border: "1px solid #e2e8f0", background: "#fff", fontSize: 12, fontWeight: 700, cursor: pg === 0 ? "default" : "pointer", color: pg === 0 ? "#cbd5e1" : "#1e293b" }}>←</button>
            <span style={{ padding: "4px 8px", fontSize: 12, color: "#64748b" }}>{pg + 1}/{mx + 1}</span>
            <button onClick={function () { setPg(Math.min(mx, pg + 1)); }} disabled={pg >= mx} style={{ padding: "4px 10px", borderRadius: 6, border: "1px solid #e2e8f0", background: "#fff", fontSize: 12, fontWeight: 700, cursor: pg >= mx ? "default" : "pointer", color: pg >= mx ? "#cbd5e1" : "#1e293b" }}>→</button>
          </div>
        </div>
      )}
      {selected && <ChimchakhaeDetailModal item={selected} onClose={function () { setSelected(null); }} />}
    </div>
  );
}

// ============================================================
// 침착해 종목 상세 모달 (오늘/DB 공용)
// ============================================================
export function ChimchakhaeDetailModal(props) {
  const item = props.item;
  const onClose = props.onClose;
  if (!item) return null;
  const col = chimchakhaeGradeColor(item.ccGrade);
  const bd = item.ccBreakdown || {};

  // 종목명 (today: name / db: n)
  const stockName = item.name || item.n || "-";
  const change = item.change != null ? item.change : item.ch;
  const market = item.market || item.m || "-";
  const investor = item.investor || item.iv || "-";
  const amount = item.amount != null ? item.amount : item.am;
  const wick = item.wick != null ? item.wick : item.wk;
  const code = item.code || "";

  // 4엔진 항목
  const engines = [
    { label: "수급", color: "#dc2626", data: bd.supply, sub: "동반매수+거래대금" },
    { label: "시황", color: "#3b82f6", data: bd.market, sub: "거래대금 강도" },
    { label: "차트", color: "#22c55e", data: bd.chart, sub: "등락률+윗꼬리" },
    { label: "재료", color: "#f59e0b", data: bd.material, sub: "코스닥+거래대금" },
  ];

  return (
    <div onClick={onClose} style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.6)", zIndex: 1000, display: "flex", alignItems: "flex-start", justifyContent: "center", padding: "20px 12px", overflowY: "auto" }}>
      <div onClick={function (e) { e.stopPropagation(); }} style={{ background: "#fff", borderRadius: 14, maxWidth: 720, width: "100%", padding: 0, position: "relative", marginBottom: 40 }}>
        <button onClick={onClose} style={{ position: "absolute", top: 12, right: 12, width: 30, height: 30, borderRadius: "50%", background: "#f1f5f9", border: "none", cursor: "pointer", fontSize: 16, fontWeight: 700, color: "#64748b", zIndex: 2 }}>✕</button>

        {/* 헤더 */}
        <div style={{ background: col, padding: "16px 18px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8, borderRadius: "14px 14px 0 0" }}>
          <div style={{ minWidth: 0, flex: "1 1 auto" }}>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.85)", fontWeight: 700 }}>침착해 환산 분석</div>
            <div style={{ fontSize: 18, fontWeight: 900, color: "#fff", marginTop: 2 }}>{stockName}{code ? <span style={{ fontSize: 12, fontWeight: 600, marginLeft: 6, opacity: 0.85 }}>{code}</span> : null}</div>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.85)", marginTop: 2 }}>{market} · {investor} · 거래대금 {amount}억{wick != null ? " · 윗꼬리 " + wick + "%" : ""}</div>
          </div>
          <div style={{ textAlign: "center", flexShrink: 0 }}>
            <div style={{ fontSize: 32, fontWeight: 900, color: "#fff", lineHeight: 1 }}>{item.ccGrade}</div>
            <div style={{ fontSize: 13, color: "rgba(255,255,255,0.85)", marginTop: 3 }}>{item.ccScore}/100</div>
          </div>
        </div>

        {/* 본문 */}
        <div style={{ padding: "16px" }}>
          {/* 추천비중 + 등락 */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(110px,1fr))", gap: 6, marginBottom: 14 }}>
            <div style={{ textAlign: "center", padding: 10, background: "#f8fafc", borderRadius: 8 }}>
              <div style={{ fontSize: 10, color: "#64748b", fontWeight: 700 }}>추천비중</div>
              <div style={{ fontSize: 22, fontWeight: 900, color: item.ccWeight >= 15 ? col : "#94a3b8" }}>{item.ccWeight}<span style={{ fontSize: 14 }}>%</span></div>
            </div>
            <div style={{ textAlign: "center", padding: 10, background: "#f8fafc", borderRadius: 8 }}>
              <div style={{ fontSize: 10, color: "#64748b", fontWeight: 700 }}>등락률</div>
              <div style={{ fontSize: 22, fontWeight: 900, color: "#dc2626" }}>+{change}<span style={{ fontSize: 14 }}>%</span></div>
            </div>
            {item.t != null && (
              <div style={{ textAlign: "center", padding: 10, background: "#f8fafc", borderRadius: 8 }}>
                <div style={{ fontSize: 10, color: "#64748b", fontWeight: 700 }}>실현손익</div>
                <div style={{ fontSize: 22, fontWeight: 900, color: item.t > 0 ? "#dc2626" : "#2563eb" }}>{item.t > 0 ? "+" : ""}{item.t}<span style={{ fontSize: 14 }}>%</span></div>
              </div>
            )}
          </div>

          {/* 4엔진 breakdown */}
          <div style={{ marginBottom: 14 }}>
            <div style={{ fontSize: 11, fontWeight: 800, color: "#475569", marginBottom: 6 }}>🎯 4엔진 환산 점수</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(135px,1fr))", gap: 6 }}>
              {engines.map(function (e) {
                if (!e.data) return null;
                const pct = e.data.max > 0 ? (e.data.score / e.data.max) * 100 : 0;
                return (
                  <div key={e.label} style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 8, padding: 10 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 4 }}>
                      <span style={{ fontSize: 11, color: "#64748b", fontWeight: 700 }}>{e.label}</span>
                      <span><span style={{ fontSize: 16, fontWeight: 900, color: e.color, fontFamily: "'JetBrains Mono', monospace" }}>{e.data.score}</span><span style={{ fontSize: 10, color: "#94a3b8" }}>/{e.data.max}</span></span>
                    </div>
                    <div style={{ height: 4, background: "#e2e8f0", borderRadius: 2, marginBottom: 4, overflow: "hidden" }}>
                      <div style={{ width: pct + "%", height: "100%", background: e.color }} />
                    </div>
                    <div style={{ fontSize: 9, color: "#94a3b8" }}>{e.sub}</div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 신호 후 일봉 흐름 (DB 데이터에 ohlc 있을 때만) */}
          {item.ohlc && Array.isArray(item.ohlc) && item.ohlc.length > 0 && (
            <div style={{ marginBottom: 14 }}>
              <div style={{ fontSize: 11, fontWeight: 800, color: "#475569", marginBottom: 6 }}>📈 신호 후 일봉 흐름 ({item.ohlc.length}일)</div>
              {(function () {
                const W = 360, H = 130, P = 24;
                const closes = item.ohlc.map(function (d) { return d.c; });
                const allVals = closes.slice();
                if (item.tp1 != null) allVals.push(item.tp1);
                if (item.sl != null) allVals.push(item.sl);
                allVals.push(0);
                let min = Math.min.apply(null, allVals);
                let max = Math.max.apply(null, allVals);
                const pad = (max - min) * 0.05 || 1;
                min -= pad; max += pad;
                const range = (max - min) || 1;
                const xStep = item.ohlc.length > 1 ? (W - P * 2) / (item.ohlc.length - 1) : 0;
                function yPos(v) { return P + (H - P * 2) * (1 - (v - min) / range); }
                const linePts = item.ohlc.map(function (d, i) { return (P + i * xStep).toFixed(1) + "," + yPos(d.c).toFixed(1); }).join(" ");
                const areaPts = "0," + yPos(0).toFixed(1) + " " + linePts + " " + (P + (item.ohlc.length - 1) * xStep).toFixed(1) + "," + yPos(0).toFixed(1);
                const tp1Y = item.tp1 != null ? yPos(item.tp1) : null;
                const slY = item.sl != null ? yPos(item.sl) : null;
                const zeroY = yPos(0);
                const lastClose = item.ohlc[item.ohlc.length - 1].c;
                const lastY = yPos(lastClose);
                const lastX = P + (item.ohlc.length - 1) * xStep;
                return (
                  <svg width="100%" viewBox={"0 0 " + W + " " + H} style={{ background: "#f8fafc", borderRadius: 8, display: "block" }}>
                    <defs>
                      <linearGradient id="ccArea" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#1e293b" stopOpacity="0.15" />
                        <stop offset="100%" stopColor="#1e293b" stopOpacity="0" />
                      </linearGradient>
                    </defs>
                    {/* 0% 라인 */}
                    <line x1={P} y1={zeroY} x2={W - P} y2={zeroY} stroke="#cbd5e1" strokeWidth="1" />
                    <text x={P - 4} y={zeroY + 3} textAnchor="end" fontSize="9" fill="#94a3b8">0%</text>
                    {/* TP1 라인 */}
                    {tp1Y != null && (
                      <g>
                        <line x1={P} y1={tp1Y} x2={W - P} y2={tp1Y} stroke="#dc2626" strokeWidth="1" strokeDasharray="3,3" opacity="0.6" />
                        <text x={P - 4} y={tp1Y + 3} textAnchor="end" fontSize="9" fill="#dc2626" fontWeight="700">+{item.tp1}</text>
                      </g>
                    )}
                    {/* SL 라인 */}
                    {slY != null && (
                      <g>
                        <line x1={P} y1={slY} x2={W - P} y2={slY} stroke="#2563eb" strokeWidth="1" strokeDasharray="3,3" opacity="0.6" />
                        <text x={P - 4} y={slY + 3} textAnchor="end" fontSize="9" fill="#2563eb" fontWeight="700">{item.sl}</text>
                      </g>
                    )}
                    {/* 영역 + 종가 라인 */}
                    <polygon points={areaPts} fill="url(#ccArea)" />
                    <polyline points={linePts} fill="none" stroke="#1e293b" strokeWidth="1.5" />
                    {/* 마지막 점 */}
                    <circle cx={lastX} cy={lastY} r="3" fill={lastClose >= 0 ? "#dc2626" : "#2563eb"} />
                    <text x={lastX - 5} y={lastY - 6} textAnchor="end" fontSize="10" fontWeight="800" fill={lastClose >= 0 ? "#dc2626" : "#2563eb"}>{(lastClose >= 0 ? "+" : "") + lastClose + "%"}</text>
                  </svg>
                );
              })()}
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 9, color: "#94a3b8", marginTop: 4 }}>
                <span>{item.ohlc[0].d}</span>
                <span>{item.ohlc[item.ohlc.length - 1].d}</span>
              </div>
              {/* 결과 라벨 */}
              {item.r && (
                <div style={{ fontSize: 10, color: "#64748b", marginTop: 6, padding: "4px 8px", background: "#fff", border: "1px solid #e2e8f0", borderRadius: 6, display: "inline-block" }}>
                  결과: <strong style={{ color: item.r === "BOTH" || item.r === "TP1" ? "#dc2626" : item.r === "SL" ? "#2563eb" : item.r === "TP1_BE" ? "#f59e0b" : "#64748b" }}>{item.r}</strong>
                  {typeof item.t === "number" && <span> · 실현 <strong style={{ color: item.t >= 0 ? "#dc2626" : "#2563eb" }}>{(item.t >= 0 ? "+" : "") + item.t + "%"}</strong></span>}
                </div>
              )}
            </div>
          )}

          {/* KIS raw 데이터 */}
          <div style={{ marginBottom: 14 }}>
            <div style={{ fontSize: 11, fontWeight: 800, color: "#475569", marginBottom: 6 }}>📋 KIS 데이터</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px,1fr))", gap: 0, border: "1px solid #e2e8f0", borderRadius: 8, overflow: "hidden" }}>
              {[
                ["등락률", change != null ? "+" + change + "%" : "-"],
                ["거래대금", amount != null ? amount + "억" : "-"],
                ["수급", investor],
                ["시장", market],
                ["윗꼬리", wick != null ? wick + "%" : "-"],
                item.mc ? ["시총", item.mc] : null,
                item.sc != null ? ["NEO 점수", item.sc] : null,
                item.d ? ["날짜", item.d] : null,
              ].filter(Boolean).map(function (kv, i) {
                return (
                  <div key={i} style={{ padding: "8px 10px", borderBottom: "1px solid #f1f5f9", borderRight: "1px solid #f1f5f9", display: "flex", justifyContent: "space-between", gap: 6, fontSize: 11 }}>
                    <span style={{ color: "#94a3b8" }}>{kv[0]}</span>
                    <span style={{ color: "#1e293b", fontWeight: 700 }}>{kv[1]}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 안내 */}
          <div style={{ background: "#fffbeb", border: "1px solid #fcd34d", borderRadius: 8, padding: 10, fontSize: 11, color: "#92400e", lineHeight: 1.5 }}>
            <strong>ℹ️ 간이 환산 점수입니다.</strong> 매물대 돌파, 정배열, 종가 캔들, 재료 타입은 KIS API 데이터로 판단 불가합니다. 정확한 침착해 분석은 차트 이미지 업로드 → 🤖 AI분석 탭을 이용하세요.
          </div>
        </div>
      </div>
    </div>
  );
}

