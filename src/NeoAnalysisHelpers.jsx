import React, { useState } from "react";

export function calcNeoAnalysisScore(s) {
  if (!s || !s.engines) return { total: 0, grade: "X" };
  const e = s.engines;
  const total = (e.supply?.score||0) + (e.breakout?.score||0) + (e.momentumMarket?.score||0) + (e.sectorMaterial?.score||0) + (e.accumulation?.score||0);
  let grade;
  if (total >= 85) grade = "S+";
  else if (total >= 75) grade = "S";
  else if (total >= 70) grade = "A+";
  else if (total >= 60) grade = "A";
  else if (total >= 50) grade = "B";
  else grade = "X";
  return { total, grade };
}

export function neoAnalysisGradeColor(grade) {
  if (grade === "S+") return "#dc2626";
  if (grade === "S") return "#ef4444";
  if (grade === "A+") return "#ea580c";
  if (grade === "A") return "#f59e0b";
  if (grade === "B") return "#3b82f6";
  return "#6b7280";
}

export async function analyzeNeoAnalysis(images, stockName) {
  const content = [];
  for (let i = 0; i < images.length; i++) {
    content.push({
      type: "image",
      source: { type: "base64", media_type: images[i].type || "image/jpeg", data: images[i].data }
    });
  }
  content.push({
    type: "text",
    text: "종목: " + (stockName || "종목명") + "\n위 차트/수급/뉴스/공시 이미지를 NeoAnalysis v1 룰(5섹션 100점)로 분석. JSON만 출력."
  });
  
  const sysPrompt = "당신은 한국 주식 종가돌파매매의 통합 분석 전문가입니다. 침착해/주도주/하승훈 3개 분석법의 강점만 통합한 NeoAnalysis v1 룰로 평가합니다.\n\n업로드된 이미지(일봉/분봉/수급/공시/뉴스/섹터)를 종합 분석해서 5개 섹션 100점 만점으로 점수를 매기세요.\n\n━━━━ 스코어링 규칙 (100점 만점) ━━━━\n\n【1. 수급 분석 (25점) - 침착해 룰】\n- 장 후반(14:00~) 동반매수: 외+기+프 일치 (10점)\n- 수급 일관성: 시간대별 일치도 (8점)\n- 거래대금 절대값 + 가중: 1000억+ 만점 (7점)\n\n【2. 돌파 품질 (25점) - 하승훈 룰】\n- 종가 위치(윗꼬리 ≤1%): 10점\n- 등락폭/돌파폭: 양봉 강도 (8점)\n- 종가 안착성: 고가 근처 마감 (7점)\n\n【3. 모멘텀 + 시장 위치 (20점) - 주도주 룰】\n- 등락률 강도: +5%~+15% 비례 (8점)\n- 종가 마감 강도: 음봉 페널티 (7점)\n- 시장/섹터 내 거래대금 순위 (5점)\n\n【4. 시황·섹터 + 재료 (15점) - 침착해 시황+재료】\n- 주도섹터 순위 + 지속성 (8점)\n- 재료 타입 (정책/실적/공시) + 익일 모멘텀 (7점)\n\n【5. 사전응축 + 이평정렬 (15점) - 하승훈 응축】\n- 신고가 단계 (52W/120일 신고가) (6점)\n- 5/20/60/120 이평 정배열 (5점)\n- 저항대 테스트 횟수 (4점)\n\n━━━━ 등급 매핑 ━━━━\n- 85점+ → S+ (강력진입)\n- 75~84 → S (강력진입)\n- 70~74 → A+ (진입)\n- 60~69 → A (진입)\n- 50~59 → B (조건부진입)\n- 50 미만 → X (관망/금지)\n\n━━━━ TP/SL 룰 ━━━━\n- 매수 타이밍: 14:50~15:20 (장 마감 직전 분할)\n- TP1: +10% (50% 익절)\n- TP2: +20% (잔여 청산)\n- SL: -5% (전량 손절)\n- 보유: 최대 10일\n\n━━━━ 응답 형식 (반드시 단일 JSON) ━━━━\n{\"grade\":\"S+/S/A+/A/B/X\",\"totalScore\":0~100,\"verdict\":\"강력진입/진입/조건부진입/관망/금지\",\"stockName\":\"\",\"engines\":{\"supply\":{\"score\":0,\"max\":25,\"items\":[]},\"breakout\":{\"score\":0,\"max\":25,\"items\":[]},\"momentumMarket\":{\"score\":0,\"max\":20,\"items\":[]},\"sectorMaterial\":{\"score\":0,\"max\":15,\"items\":[]},\"accumulation\":{\"score\":0,\"max\":15,\"items\":[]}},\"detailedAnalysis\":\"\",\"keyReasons\":[],\"risks\":[],\"strategy\":{\"entry\":\"\",\"entryPrice\":\"\",\"tp1Price\":\"\",\"tp2Price\":\"\",\"stopLoss\":\"\",\"hold\":\"10일\"},\"nextDayProbability\":0,\"confidenceScore\":0,\"summary\":\"\"}\n\n반드시 JSON 만 출력. 코드블록(```) 사용 금지.";
  
  const r = await fetch("https://sector-api-pink.vercel.app/api/analyze", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 4500,
      system: sysPrompt,
      messages: [{ role: "user", content }]
    })
  });
  const data = await r.json();
  if (data.type === "error") throw new Error(data.error?.message || "API 에러");
  const text = (data.content?.[0]?.text || "").trim();
  let clean = text.replace(/```json|```/g, "").trim();
  const m = clean.match(/\{[\s\S]*\}/);
  if (m) clean = m[0];
  const parsed = JSON.parse(clean);
  
  const recalc = calcNeoAnalysisScore(parsed);
  parsed.totalScore = recalc.total;
  parsed.grade = recalc.grade;
  return parsed;
}

export function NeoAnalysisResultCard(props) {
  const res = props.result;
  if (!res) return null;
  const color = neoAnalysisGradeColor(res.grade);
  const e = res.engines || {};
  const sections = [
    { key: "supply", label: "① 수급", color: "#A32D2D", bg: "#FCEBEB" },
    { key: "breakout", label: "② 돌파품질", color: "#412402", bg: "#FAEEDA" },
    { key: "momentumMarket", label: "③ 모멘텀+시장", color: "#042C53", bg: "#E6F1FB" },
    { key: "sectorMaterial", label: "④ 시황·섹터+재료", color: "#173404", bg: "#EAF3DE" },
    { key: "accumulation", label: "⑤ 사전응축+이평", color: "#26215C", bg: "#EEEDFE" }
  ];
  return React.createElement("div", { style: { padding: 16, background: "#fff", borderRadius: 12, border: "1px solid #e5e7eb" } },
    React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 } },
      React.createElement("div", null,
        React.createElement("div", { style: { fontSize: 13, color: "#6b7280", marginBottom: 2 } }, "🎯 NeoAnalysis v1 종합 분석"),
        React.createElement("div", { style: { fontSize: 18, fontWeight: 700 } }, res.stockName || "")
      ),
      React.createElement("div", { style: { textAlign: "right" } },
        React.createElement("div", { style: { fontSize: 28, fontWeight: 700, color: color } }, res.grade),
        React.createElement("div", { style: { fontSize: 12, color: "#6b7280" } }, (res.totalScore || 0) + "/100")
      )
    ),
    res.summary && React.createElement("div", { style: { padding: 10, background: "#fef3c7", borderRadius: 8, fontSize: 13, marginBottom: 10 } }, "💬 " + res.summary),
    React.createElement("div", { style: { display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 8, marginBottom: 10 } },
      sections.map(function(sec) {
        const eng = e[sec.key] || {};
        const sc = eng.score || 0;
        const mx = eng.max || 0;
        return React.createElement("div", { key: sec.key, style: { padding: 10, background: sec.bg, borderRadius: 8 } },
          React.createElement("div", { style: { fontSize: 11, color: sec.color, fontWeight: 600 } }, sec.label),
          React.createElement("div", { style: { fontSize: 16, fontWeight: 700, color: sec.color, marginTop: 4 } }, sc + "/" + mx)
        );
      })
    ),
    res.detailedAnalysis && React.createElement("div", { style: { padding: 10, background: "#f9fafb", borderRadius: 8, fontSize: 12, lineHeight: 1.7, marginBottom: 8 } }, res.detailedAnalysis),
    Array.isArray(res.keyReasons) && res.keyReasons.length > 0 && React.createElement("div", { style: { marginBottom: 8 } },
      React.createElement("div", { style: { fontSize: 11, fontWeight: 600, color: "#15803d", marginBottom: 4 } }, "✅ 핵심 이유"),
      React.createElement("ul", { style: { margin: 0, paddingLeft: 18, fontSize: 12, lineHeight: 1.6 } },
        res.keyReasons.map(function(r, i) { return React.createElement("li", { key: i }, r); })
      )
    ),
    Array.isArray(res.risks) && res.risks.length > 0 && React.createElement("div", { style: { marginBottom: 8 } },
      React.createElement("div", { style: { fontSize: 11, fontWeight: 600, color: "#dc2626", marginBottom: 4 } }, "⚠️ 리스크"),
      React.createElement("ul", { style: { margin: 0, paddingLeft: 18, fontSize: 12, lineHeight: 1.6 } },
        res.risks.map(function(r, i) { return React.createElement("li", { key: i }, r); })
      )
    ),
    res.strategy && React.createElement("div", { style: { padding: 10, background: "#dcfce7", borderRadius: 8, marginBottom: 8 } },
      React.createElement("div", { style: { fontSize: 12, fontWeight: 600, color: "#15803d", marginBottom: 6 } }, "🟢 매매 전략"),
      res.strategy.entry && React.createElement("div", { style: { fontSize: 12, marginBottom: 3 } }, React.createElement("b", null, "진입: "), res.strategy.entry),
      res.strategy.entryPrice && React.createElement("div", { style: { fontSize: 12, marginBottom: 3 } }, React.createElement("b", null, "진입가: "), res.strategy.entryPrice),
      res.strategy.tp1Price && React.createElement("div", { style: { fontSize: 12, marginBottom: 3 } }, React.createElement("b", null, "TP1: "), res.strategy.tp1Price),
      res.strategy.tp2Price && React.createElement("div", { style: { fontSize: 12, marginBottom: 3 } }, React.createElement("b", null, "TP2: "), res.strategy.tp2Price),
      res.strategy.stopLoss && React.createElement("div", { style: { fontSize: 12 } }, React.createElement("b", null, "SL: "), res.strategy.stopLoss)
    ),
    React.createElement("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 } },
      React.createElement("div", { style: { padding: 8, background: "#f3f4f6", borderRadius: 6, textAlign: "center" } },
        React.createElement("div", { style: { fontSize: 10, color: "#6b7280" } }, "익일상승확률"),
        React.createElement("div", { style: { fontSize: 16, fontWeight: 700 } }, (res.nextDayProbability || 0) + "%")
      ),
      React.createElement("div", { style: { padding: 8, background: "#f3f4f6", borderRadius: 6, textAlign: "center" } },
        React.createElement("div", { style: { fontSize: 10, color: "#6b7280" } }, "신뢰도"),
        React.createElement("div", { style: { fontSize: 16, fontWeight: 700 } }, (res.confidenceScore || 0) + "/100")
      )
    )
  );
}
