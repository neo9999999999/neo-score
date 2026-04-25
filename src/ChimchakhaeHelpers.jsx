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
      model: "claude-sonnet-4-20250514",
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
function gradeColor(grade) {
  if (grade === "S+") return "#dc2626";
  if (grade === "S") return "#ef4444";
  if (grade === "A+") return "#ea580c";
  if (grade === "A") return "#f59e0b";
  if (grade === "B+") return "#3b82f6";
  if (grade === "B") return "#94a3b8";
  return "#64748b";
}

function statusColor(status) {
  if (status === "positive") return "#22c55e";
  if (status === "negative") return "#dc2626";
  if (status === "unknown") return "#94a3b8";
  return "#f59e0b"; // neutral
}

function statusLabel(status) {
  if (status === "positive") return "긍정";
  if (status === "negative") return "부정";
  if (status === "unknown") return "미판독";
  return "중립";
}

function fmtPrice(n) {
  if (n == null || isNaN(n)) return "-";
  if (n >= 1) return Math.round(n).toLocaleString();
  return n.toFixed(2);
}

// 4엔진 레이더 차트 SVG
function RadarChart(props) {
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
const EXTRACTED_LABELS = {
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
