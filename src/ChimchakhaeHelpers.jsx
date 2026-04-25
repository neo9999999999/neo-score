import React from "react";

// ============================================================
// 침착해 v4 분석 헬퍼 (sector-api-pink 프록시 경유)
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
  "━━━━ 가격 산출 ━━━━\n" +
  "차트의 현재가/종가/지지·저항선을 보고 실제 가격(원)으로 산출:\n" +
  "- entryPrice: 종가 또는 다음날 시초 부근 (현재가 ±1%)\n" +
  "- tp1Price: 진입가 +5~8% (S+ 는 +8~12%)\n" +
  "- tp2Price: 진입가 +12~25% (S/A+급만, B 이하면 null)\n" +
  "- slPrice: 진입가 -3~5% 또는 매물대 하단/지지선\n" +
  "차트에서 현재가 식별 불가시 모두 null. 숫자만 (콤마/단위 X).\n\n" +
  "━━━━ 신뢰도 ━━━━\n" +
  "confidenceScore (0~100): 이미지 품질 + 데이터 가독성 + 분석 자신감.\n\n" +
  "━━━━ 필수 JSON 출력 (다른 설명 금지) ━━━━\n" +
  "{\n" +
  '  "stockName": "종목명",\n' +
  '  "stockCode": "코드",\n' +
  '  "engines": {\n' +
  '    "supply": { "score": 숫자, "max": 35, "breakdown": {"lateHours":숫자,"consistency":숫자,"volume":숫자}, "reasoning":"근거" },\n' +
  '    "market": { "score": 숫자, "max": 25, "breakdown": {"lead":숫자,"duration":숫자,"strength":숫자}, "reasoning":"근거" },\n' +
  '    "chart": { "score": 숫자, "max": 25, "breakdown": {"breakout":숫자,"ma":숫자,"volume":숫자,"close":숫자}, "reasoning":"근거" },\n' +
  '    "material": { "score": 숫자, "max": 15, "breakdown": {"type":숫자,"nextDay":숫자}, "reasoning":"근거" }\n' +
  "  },\n" +
  '  "totalScore": 숫자, "grade": "S+|S|A+|A|B+|B|C", "verdict": "진입 강력추천|조건부 매수|관망|진입 보류",\n' +
  '  "recommendedWeight": 숫자(0~30), "nextDayRiseProbability": 숫자(0~100), "confidenceScore": 숫자(0~100),\n' +
  '  "keyReasons": ["근거1","근거2","근거3"],\n' +
  '  "risks": ["리스크1","리스크2"],\n' +
  '  "strategy": {"entryPrice":숫자|null,"tp1Price":숫자|null,"tp2Price":숫자|null,"slPrice":숫자|null},\n' +
  '  "chimchakhaeAnalysis": "침착해 관점 5~7문장 종합 평가"\n' +
  "}\n\n" +
  "JSON 외 텍스트 절대 금지.";

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
      max_tokens: 4000,
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
  if (!parsed) throw new Error("침착해 JSON 파싱 실패");
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
    <svg viewBox="0 0 280 280" style={{ width: "100%", maxWidth: "280px", height: "auto", display: "block", margin: "0 auto" }}>
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

// 침착해 결과 카드 (한 화면)
export function ChimchakhaeResultCard(props) {
  const res = props.result;
  if (!res) return null;
  const color = gradeColor(res.grade);
  const strat = res.strategy || {};

  return (
    <div style={{ borderRadius: 14, border: "2px solid " + color, overflow: "hidden", marginBottom: 14, background: "#fff" }}>
      {/* 헤더 */}
      <div style={{ background: color, padding: "14px 18px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <div style={{ fontSize: 11, color: "rgba(255,255,255,0.85)", fontWeight: 700, marginBottom: 2 }}>침착해 v4 분석</div>
          <div style={{ fontSize: 18, fontWeight: 900, color: "#fff" }}>{res.stockName || props.stockName || "분석 결과"}</div>
          <div style={{ fontSize: 11, color: "rgba(255,255,255,0.85)", marginTop: 2 }}>{res.verdict}</div>
        </div>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 32, fontWeight: 900, color: "#fff", lineHeight: 1 }}>{res.grade}</div>
          <div style={{ fontSize: 13, color: "rgba(255,255,255,0.85)", marginTop: 3 }}>{res.totalScore}/100</div>
        </div>
      </div>

      {/* 본문 */}
      <div style={{ padding: "16px" }}>
        {/* 비중 / 상승확률 / 신뢰도 */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 8, marginBottom: 14 }}>
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
        {res.engines && (
          <div style={{ background: "#f8fafc", padding: 14, borderRadius: 10, marginBottom: 14 }}>
            <div style={{ fontSize: 12, fontWeight: 800, color: "#475569", marginBottom: 8, textAlign: "center" }}>🎯 4엔진 분석</div>
            <RadarChart engines={res.engines} color={color} />
          </div>
        )}

        {/* 가격 액션 플랜 */}
        {strat.entryPrice && (
          <div style={{ background: "#fef3c7", border: "1px solid #fbbf24", borderRadius: 10, padding: 12, marginBottom: 14 }}>
            <div style={{ fontSize: 11, fontWeight: 800, color: "#92400e", marginBottom: 8 }}>💰 가격 액션 플랜</div>
            <div style={{ display: "grid", gridTemplateColumns: strat.tp2Price ? "repeat(4,1fr)" : "repeat(3,1fr)", gap: 6 }}>
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

        {/* 핵심 근거 */}
        {res.keyReasons && res.keyReasons.length > 0 && (
          <div style={{ marginBottom: 12 }}>
            <div style={{ fontSize: 11, fontWeight: 800, color: "#475569", marginBottom: 6 }}>✅ 핵심 근거</div>
            {res.keyReasons.map(function (r, i) {
              return (
                <div key={i} style={{ fontSize: 12, color: "#1e293b", padding: "5px 10px", background: "#f0fdf4", borderRadius: 6, marginBottom: 4, borderLeft: "3px solid #22c55e" }}>
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
                <div key={i} style={{ fontSize: 12, color: "#991b1b", padding: "5px 10px", background: "#fef2f2", borderRadius: 6, marginBottom: 4, borderLeft: "3px solid #dc2626" }}>
                  {r}
                </div>
              );
            })}
          </div>
        )}

        {/* 침착해 종합 평가 */}
        {res.chimchakhaeAnalysis && (
          <div style={{ background: "linear-gradient(135deg, #faf5ff 0%, #eff6ff 100%)", border: "1px solid #c4b5fd", borderRadius: 10, padding: 12, fontSize: 12, lineHeight: 1.6, color: "#1e293b" }}>
            <div style={{ fontSize: 11, fontWeight: 800, color: "#7c3aed", marginBottom: 6 }}>🎯 침착해 종합 평가</div>
            {res.chimchakhaeAnalysis}
          </div>
        )}
      </div>
    </div>
  );
}
