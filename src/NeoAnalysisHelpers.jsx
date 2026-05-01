import React from "react";

const NEO_ANALYSIS_SYS_PROMPT = `당신은 한국 주식 종가돌파매매 전문가입니다.
침착해 + 주도주 + 하승훈 분석 룰을 통합한 "네오분석 v1" 으로 차트를 평가합니다.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
## 점수 룰 (100점 만점, 5개 섹션)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━

### ① 수급 분석 (25점) ─ 침착해 룰 채택
- 장 후반(14:00~) 동반매수 시점 (12점)
  외+기+프 3주체 일치: 12 / 2주체: 8 / 1주체: 4 / 없음: 0
- 수급 일관성 (전일~당일 누적 추세) (8점)
- 거래대금 절대값 + 가중 (5점, 1000억+: 5)

### ② 돌파 품질 (25점) ─ 하승훈 룰 채택
- 종가 위치 / 윗꼬리 (10점)
  윗꼬리 ≤1%: 10 / 1~3%: 6 / 3%+: 3
- 돌파폭 (저항대 명확 돌파) (8점)
- 종가 안착성 (장중 매물 흡수) (7점)

### ③ 모멘텀 + 시장위치 (20점) ─ 주도주 룰 채택
- 등락률 강도 (시장 상위권 5~10위) (8점)
- 종가 마감 강도 (고가 근처 마감) (7점)
- 시장/섹터 거래대금 절대값 (대장주) (5점)

### ④ 시황·섹터 + 재료 (15점) ─ 침착해 룰 채택
- 주도섹터 순위 (1~3위) (8점)
- 재료 타입 + 익일 모멘텀 (정책/실적/공시) (7점)

### ⑤ 사전응축 + 이평정렬 (15점) ─ 하승훈 룰 채택
- 신고가 단계 (52W/120일/60일) (6점)
- 5/20/60/120일 정배열 (5점)
- 저항대 테스트 (3회+ 우상향 박스권) (4점)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
## 등급 매핑
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
- 85점+ → S+ (강력진입)
- 75~84점 → S (강력진입)
- 70~74점 → A+ (진입)
- 60~69점 → A (진입)
- 50~59점 → B (조건부진입)
- 50점 미만 → X (관망/금지)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
## 응답 형식 (반드시 단일 JSON, 코드블록/추가텍스트 금지)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
{
  "name": "종목명",
  "total": 0~100 (정수),
  "grade": "S+|S|A+|A|B|X",
  "verdict": "강력진입|진입|조건부진입|관망|금지",
  "sections": {
    "supply":         { "score": 0~25, "details": "수급 평가 3-4문장" },
    "breakout":       { "score": 0~25, "details": "돌파 품질 3-4문장" },
    "momentum":       { "score": 0~20, "details": "모멘텀+시장위치 3-4문장" },
    "sectorMaterial": { "score": 0~15, "details": "시황·재료 2-3문장" },
    "accumulation":   { "score": 0~15, "details": "사전응축+이평 2-3문장" }
  },
  "summary": "한 줄 핵심 결론",
  "keyReasons": ["근거1", "근거2", "근거3"],
  "risks": ["리스크1", "리스크2"],
  "buyTiming": "14:50~15:20 분할매수 등 구체",
  "buyStrategy": "1차/2차 진입가 + 사이즈",
  "exitPlan": { "tp1": "TP1 +10% 가격대", "tp2": "TP2 +20% 가격대", "sl": "SL -5% 가격대" },
  "confidence": 0~100
}`;

export async function analyzeNeoAnalysis(images, stockName) {
  const content = [];
  for (let i = 0; i < images.length; i++) {
    content.push({
      type: "image",
      source: {
        type: "base64",
        media_type: images[i].type || "image/jpeg",
        data: images[i].data
      }
    });
  }
  content.push({
    type: "text",
    text: "종목: " + (stockName || "미상") + "\n위 차트들을 네오분석 v1 룰(5섹션 100점) 로 채점하고 JSON만 출력."
  });

  const r = await fetch("https://sector-api-pink.vercel.app/api/analyze", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 4500,
      system: NEO_ANALYSIS_SYS_PROMPT,
      messages: [{ role: "user", content: content }]
    })
  });
  const data = await r.json();
  if (data.type === "error") throw new Error((data.error && data.error.message) || "API 에러");

  const text = ((data.content && data.content[0] && data.content[0].text) || "").trim();
  let clean = text.replace(/```json|```/g, "").trim();
  const m = clean.match(/\{[\s\S]*\}/);
  if (m) clean = m[0];
  return JSON.parse(clean);
}

export function calcNeoAnalysisGrade(total) {
  if (total >= 85) return "S+";
  if (total >= 75) return "S";
  if (total >= 70) return "A+";
  if (total >= 60) return "A";
  if (total >= 50) return "B";
  return "X";
}

export function neoAnalysisGradeColor(grade) {
  const map = {
    "S+": { bg: "#FCEBEB", fg: "#791F1F", border: "#A32D2D" },
    "S":  { bg: "#FAEEDA", fg: "#412402", border: "#BA7517" },
    "A+": { bg: "#E6F1FB", fg: "#042C53", border: "#185FA5" },
    "A":  { bg: "#EAF3DE", fg: "#173404", border: "#3B6D11" },
    "B":  { bg: "#EEEDFE", fg: "#26215C", border: "#534AB7" },
    "X":  { bg: "#F1EFE8", fg: "#2C2C2A", border: "#5F5E5A" }
  };
  return map[grade] || map.X;
}

export function NeoAnalysisResultCard(props) {
  const result = props.result;
  if (!result) return null;
  const c = neoAnalysisGradeColor(result.grade);
  const sec = result.sections || {};
  const sectionList = [
    ["supply", "① 수급", 25],
    ["breakout", "② 돌파품질", 25],
    ["momentum", "③ 모멘텀·시장", 20],
    ["sectorMaterial", "④ 시황·재료", 15],
    ["accumulation", "⑤ 사전응축·이평", 15]
  ];
  return React.createElement("div",
    { style: { padding: 16, border: "2px solid " + c.border, borderRadius: 12, background: c.bg } },
    React.createElement("div",
      { style: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12, gap: 12 } },
      React.createElement("div", null,
        React.createElement("div", { style: { fontSize: 12, color: c.fg, opacity: 0.85, fontWeight: 600 } }, "🧠 네오분석 v1"),
        React.createElement("div", { style: { fontSize: 18, fontWeight: 700, marginTop: 2 } }, result.name || "종목"),
        result.verdict && React.createElement("div", { style: { fontSize: 12, color: c.fg, marginTop: 4, padding: "2px 8px", background: "#fff", borderRadius: 4, display: "inline-block" } }, result.verdict)
      ),
      React.createElement("div", { style: { textAlign: "right" } },
        React.createElement("div", { style: { fontSize: 36, fontWeight: 700, color: c.fg, lineHeight: 1 } }, result.grade || "X"),
        React.createElement("div", { style: { fontSize: 16, fontWeight: 600, color: c.fg, marginTop: 4 } }, (result.total || 0) + " / 100")
      )
    ),
    result.summary && React.createElement("div",
      { style: { padding: 10, background: "#fff", borderRadius: 6, fontSize: 13, fontWeight: 500, marginBottom: 10, lineHeight: 1.6 } },
      "💬 " + result.summary
    ),
    React.createElement("div",
      { style: { display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 6, marginBottom: 10 } },
      sectionList.map(function (item) {
        const k = item[0], label = item[1], max = item[2];
        const score = (sec[k] && sec[k].score) || 0;
        const pct = score / max;
        return React.createElement("div",
          { key: k, style: { padding: 10, background: "#fff", borderRadius: 6 } },
          React.createElement("div", { style: { display: "flex", justifyContent: "space-between", marginBottom: 4 } },
            React.createElement("div", { style: { fontSize: 11, color: c.fg, fontWeight: 600 } }, label),
            React.createElement("div", { style: { fontSize: 12, fontWeight: 700, color: c.fg } }, score + "/" + max)
          ),
          React.createElement("div", { style: { height: 4, background: "#f0f0f0", borderRadius: 2, overflow: "hidden" } },
            React.createElement("div", { style: { height: "100%", width: (pct * 100) + "%", background: c.border } })
          ),
          sec[k] && sec[k].details && React.createElement("div", { style: { fontSize: 10, color: "#444", marginTop: 6, lineHeight: 1.5 } }, sec[k].details)
        );
      })
    ),
    Array.isArray(result.keyReasons) && result.keyReasons.length > 0 && React.createElement("div",
      { style: { marginBottom: 8 } },
      React.createElement("div", { style: { fontSize: 11, fontWeight: 600, color: "#15803d", marginBottom: 4 } }, "✅ 핵심 근거"),
      React.createElement("ul", { style: { margin: 0, paddingLeft: 18, fontSize: 12, lineHeight: 1.6 } },
        result.keyReasons.map(function (r, i) { return React.createElement("li", { key: i }, r); })
      )
    ),
    Array.isArray(result.risks) && result.risks.length > 0 && React.createElement("div",
      { style: { marginBottom: 8 } },
      React.createElement("div", { style: { fontSize: 11, fontWeight: 600, color: "#dc2626", marginBottom: 4 } }, "⚠️ 리스크"),
      React.createElement("ul", { style: { margin: 0, paddingLeft: 18, fontSize: 12, lineHeight: 1.6 } },
        result.risks.map(function (r, i) { return React.createElement("li", { key: i }, r); })
      )
    ),
    (result.buyTiming || result.buyStrategy) && React.createElement("div",
      { style: { padding: 10, background: "#dcfce7", borderRadius: 6, marginBottom: 8 } },
      React.createElement("div", { style: { fontSize: 11, fontWeight: 600, color: "#15803d", marginBottom: 4 } }, "🟢 매수 전략"),
      result.buyTiming && React.createElement("div", { style: { fontSize: 11, color: "#14532d", marginBottom: 2 } },
        React.createElement("b", null, "타이밍: "), result.buyTiming
      ),
      result.buyStrategy && React.createElement("div", { style: { fontSize: 11, color: "#14532d" } },
        React.createElement("b", null, "전략: "), result.buyStrategy
      )
    ),
    result.exitPlan && React.createElement("div",
      { style: { padding: 10, background: "#fef2f2", borderRadius: 6 } },
      React.createElement("div", { style: { fontSize: 11, fontWeight: 600, color: "#991b1b", marginBottom: 4 } }, "🔴 청산 계획"),
      result.exitPlan.tp1 && React.createElement("div", { style: { fontSize: 11, color: "#7f1d1d" } },
        React.createElement("b", null, "TP1: "), result.exitPlan.tp1
      ),
      result.exitPlan.tp2 && React.createElement("div", { style: { fontSize: 11, color: "#7f1d1d" } },
        React.createElement("b", null, "TP2: "), result.exitPlan.tp2
      ),
      result.exitPlan.sl && React.createElement("div", { style: { fontSize: 11, color: "#7f1d1d" } },
        React.createElement("b", null, "SL: "), result.exitPlan.sl
      )
    )
  );
}

// data.js raw row → 5섹션 점수 + 등급 (자동 룰 매핑)
// row 컬럼: 0=name, 1=date, 2=market, 3=change%, 4=mc_str, 5=investor, 6=NEO, 7=grade,
//          11=peak%, 12=trough%, 18=pnl%, 19=result, 21=breakType
export function calcNeoAnalysisFromRaw(row) {
  if (!row || !Array.isArray(row)) return null;
  const change = +row[3] || 0;
  const mc_str = row[4] || "";
  const investor = row[5] || "";
  const neoScore = +row[6] || 0;
  const peak = +row[11] || 0;
  const breakType = row[21] || "";

  // 거래대금 (한글 → 숫자, 단위: 억)
  let mcVal = 0;
  const mcMatch = mc_str.match(/([\d,]+)/);
  if (mcMatch) mcVal = parseInt(mcMatch[1].replace(/,/g, "")) || 0;

  // ① 수급 (25점) — investor 기반
  let supply = 8;
  const inv = investor;
  if (/(기|기관).*(외|외인).*(프|프로)/.test(inv) || /(외|외인).*(기|기관).*(프|프로)/.test(inv) || /(프|프로).*(기|기관).*(외|외인)/.test(inv)) supply = 25;
  else if (/(기|기관).*(외|외인)|(외|외인).*(기|기관)/.test(inv)) supply = 22;
  else if (/외만|기만/.test(inv)) supply = 18;
  else if (/외|기/.test(inv)) supply = 15;
  if (mcVal >= 1000) supply = Math.min(25, supply + 2);

  // ② 돌파 품질 (25점) — change + breakType + peak
  let breakout = 5;
  if (change >= 15) breakout = 18;
  else if (change >= 10) breakout = 15;
  else if (change >= 5) breakout = 10;
  if (breakType === "ATH") breakout = Math.min(25, breakout + 5);
  if (peak >= change * 1.2 && change > 0) breakout = Math.min(25, breakout + 2);

  // ③ 모멘텀 + 시장위치 (20점) — change + 거래대금
  let momentum = 5;
  if (change >= 15 && mcVal >= 500) momentum = 18;
  else if (change >= 10 && mcVal >= 300) momentum = 14;
  else if (change >= 5) momentum = 10;
  if (mcVal >= 1000) momentum = Math.min(20, momentum + 2);

  // ④ 시황·재료 (15점) — 데이터 없음, 거래대금으로 추정
  let sectorMaterial = 10;
  if (mcVal >= 1500) sectorMaterial = 13;
  else if (mcVal >= 800) sectorMaterial = 11;

  // ⑤ 사전응축 + 이평 (15점) — breakType + neoScore
  let accumulation = 8;
  if (breakType === "ATH") accumulation = 13;
  if (neoScore >= 5) accumulation = Math.min(15, accumulation + 2);
  else if (neoScore >= 3) accumulation = Math.min(15, accumulation + 1);

  const total = Math.round(supply + breakout + momentum + sectorMaterial + accumulation);
  let grade;
  if (total >= 85) grade = "S+";
  else if (total >= 75) grade = "S";
  else if (total >= 70) grade = "A+";
  else if (total >= 60) grade = "A";
  else if (total >= 50) grade = "B";
  else grade = "X";

  return {
    name: row[0],
    date: row[1],
    market: row[2],
    total,
    grade,
    sections: {
      supply: { score: supply, max: 25 },
      breakout: { score: breakout, max: 25 },
      momentum: { score: momentum, max: 20 },
      sectorMaterial: { score: sectorMaterial, max: 15 },
      accumulation: { score: accumulation, max: 15 }
    },
    raw: { change, investor, mcVal, neoScore, breakType, peak, originalGrade: row[7] }
  };
}

// 자동 룰 등급 + 색상
export function NeoAnalysisAutoBadge(props) {
  const result = props.result;
  if (!result) return null;
  const c = neoAnalysisGradeColor(result.grade);
  return React.createElement("span",
    { style: { display: "inline-flex", alignItems: "center", gap: 4, padding: "2px 8px", background: c.bg, color: c.fg, border: "1px solid " + c.border, borderRadius: 4, fontSize: 11, fontWeight: 600, cursor: props.onClick ? "pointer" : "default" }, onClick: props.onClick },
    result.grade, " ", React.createElement("span", { style: { opacity: 0.7, fontSize: 10 } }, result.total)
  );
}

// 5섹션 점수 모달 (등급 클릭 시 상세)
export function NeoAnalysisDetailModal(props) {
  const result = props.result;
  if (!result) return null;
  const sec = result.sections;
  const c = neoAnalysisGradeColor(result.grade);
  const items = [
    ["① 수급", sec.supply.score, sec.supply.max, "투자자 합의 + 거래대금"],
    ["② 돌파품질", sec.breakout.score, sec.breakout.max, "등락률 + 신고가 + 강도"],
    ["③ 모멘텀·시장", sec.momentum.score, sec.momentum.max, "등락률 + 거래대금 절대값"],
    ["④ 시황·재료", sec.sectorMaterial.score, sec.sectorMaterial.max, "거래대금 (재료 없음)"],
    ["⑤ 사전응축·이평", sec.accumulation.score, sec.accumulation.max, "신고가 + NEO score"]
  ];
  return React.createElement("div",
    { onClick: props.onClose, style: { position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 } },
    React.createElement("div",
      { onClick: function(e) { e.stopPropagation(); }, style: { background: "#fff", borderRadius: 12, padding: 16, maxWidth: 480, width: "100%", maxHeight: "80vh", overflow: "auto" } },
      React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 } },
        React.createElement("div", null,
          React.createElement("div", { style: { fontSize: 16, fontWeight: 700 } }, result.name || "종목"),
          React.createElement("div", { style: { fontSize: 11, color: "#666" } }, result.date + " · " + (result.market || ""))
        ),
        React.createElement("button", { onClick: props.onClose, style: { padding: "4px 10px", background: "transparent", border: "1px solid #ccc", borderRadius: 4, cursor: "pointer" } }, "닫기")
      ),
      React.createElement("div", { style: { padding: 12, background: c.bg, border: "1px solid " + c.border, borderRadius: 8, marginBottom: 12, textAlign: "center" } },
        React.createElement("div", { style: { fontSize: 12, color: c.fg, opacity: 0.85 } }, "🧠 네오분석 v1 (자동 룰)"),
        React.createElement("div", { style: { fontSize: 32, fontWeight: 700, color: c.fg, lineHeight: 1, marginTop: 4 } }, result.grade),
        React.createElement("div", { style: { fontSize: 14, fontWeight: 600, color: c.fg, marginTop: 4 } }, result.total + " / 100")
      ),
      React.createElement("div", { style: { marginBottom: 12 } },
        items.map(function(it) {
          const label = it[0], score = it[1], max = it[2], desc = it[3];
          const pct = score / max;
          return React.createElement("div",
            { key: label, style: { padding: 8, background: "#f8fafc", borderRadius: 6, marginBottom: 6 } },
            React.createElement("div", { style: { display: "flex", justifyContent: "space-between" } },
              React.createElement("div", { style: { fontSize: 12, fontWeight: 600 } }, label),
              React.createElement("div", { style: { fontSize: 12, fontWeight: 700, color: c.fg } }, score + "/" + max)
            ),
            React.createElement("div", { style: { height: 4, background: "#e2e8f0", borderRadius: 2, marginTop: 4, overflow: "hidden" } },
              React.createElement("div", { style: { height: "100%", width: (pct * 100) + "%", background: c.border } })
            ),
            React.createElement("div", { style: { fontSize: 10, color: "#666", marginTop: 4 } }, desc)
          );
        })
      ),
      React.createElement("div", { style: { padding: 10, background: "#fef3c7", borderRadius: 6, fontSize: 11, color: "#78350f", lineHeight: 1.6 } },
        "⚠️ 자동 룰 매핑 결과 (정확도 ~70%). raw 데이터의 등락률/거래대금/투자자/신고가/NEO 점수만 사용. 차트 패턴(윗꼬리/매물대) 미반영. 정확한 등급은 차트 분석 필요."
      ),
      React.createElement("div", { style: { padding: 8, background: "#f1f5f9", borderRadius: 4, fontSize: 11, color: "#475569", marginTop: 8 } },
        React.createElement("b", null, "raw 데이터: "),
        "등락 ", result.raw.change, "% · 거래대금 ", result.raw.mcVal, "억 · ", result.raw.investor || "-", " · NEO ", result.raw.neoScore, "점 · ", result.raw.breakType || "-"
      )
    )
  );
}

// signal 객체 (s.code/name/investor/amount/change/score/grade/wick/market/breakType)
// → 5섹션 점수 + 등급
export function calcNeoAnalysisFromSignal(s) {
  if (!s) return null;
  const change = +s.change || +s.rate || 0;
  const investor = s.investor || s.supply || "";
  const mcVal = +s.amount || +s.vol || 0;
  const wick = +s.wick || 0;
  const neoScore = +s.score || 0;
  const breakType = s.breakType || "";

  let supply = 8;
  if (/(기|기관).*(외|외인).*(프|프로)/.test(investor) || /(외|외인).*(기|기관).*(프|프로)/.test(investor) || /(프|프로).*(기|기관).*(외|외인)/.test(investor)) supply = 25;
  else if (/(기|기관).*(외|외인)|(외|외인).*(기|기관)/.test(investor)) supply = 22;
  else if (/외만|기만/.test(investor)) supply = 18;
  else if (/외|기/.test(investor)) supply = 15;
  if (mcVal >= 1000) supply = Math.min(25, supply + 2);

  let breakout = 5;
  if (change >= 15) breakout = 18;
  else if (change >= 10) breakout = 15;
  else if (change >= 5) breakout = 10;
  if (breakType === "ATH" || /ATH|신고가/.test(breakType)) breakout = Math.min(25, breakout + 5);
  if (wick > 0 && wick <= 1) breakout = Math.min(25, breakout + 2);

  let momentum = 5;
  if (change >= 15 && mcVal >= 500) momentum = 18;
  else if (change >= 10 && mcVal >= 300) momentum = 14;
  else if (change >= 5) momentum = 10;
  if (mcVal >= 1000) momentum = Math.min(20, momentum + 2);

  let sectorMaterial = 10;
  if (mcVal >= 1500) sectorMaterial = 13;
  else if (mcVal >= 800) sectorMaterial = 11;

  let accumulation = 8;
  if (breakType === "ATH" || /ATH|신고가/.test(breakType)) accumulation = 13;
  if (neoScore >= 5) accumulation = Math.min(15, accumulation + 2);
  else if (neoScore >= 3) accumulation = Math.min(15, accumulation + 1);

  const total = Math.round(supply + breakout + momentum + sectorMaterial + accumulation);
  let grade;
  if (total >= 85) grade = "S+";
  else if (total >= 75) grade = "S";
  else if (total >= 70) grade = "A+";
  else if (total >= 60) grade = "A";
  else if (total >= 50) grade = "B";
  else grade = "X";

  const keyReasons = [];
  if (change >= 10) keyReasons.push("등락률 +" + change + "% 강한 상승");
  if (/외|기/.test(investor)) keyReasons.push("수급 신호: " + investor);
  if (mcVal >= 500) keyReasons.push("거래대금 " + mcVal + "억 양호");
  if (breakType === "ATH" || /ATH/.test(breakType)) keyReasons.push("52주 신고가 돌파");
  if (wick > 0 && wick <= 1) keyReasons.push("종가 윗꼬리 " + wick + "% 강한 안착");

  const risks = [];
  if (mcVal < 500) risks.push("거래대금 " + mcVal + "억 유동성 제한");
  if (wick > 3) risks.push("윗꼬리 " + wick + "% 매도 압박");
  if (change < 5) risks.push("등락률 +" + change + "% 돌파 강도 약함");
  if (!investor || investor === "없음" || investor === "혼다-") risks.push("주도 수급 부재");

  return {
    name: s.name || "",
    code: s.code || "",
    date: s.date || "",
    market: s.market || "",
    total,
    grade,
    sections: {
      supply: { score: supply, max: 25 },
      breakout: { score: breakout, max: 25 },
      momentum: { score: momentum, max: 20 },
      sectorMaterial: { score: sectorMaterial, max: 15 },
      accumulation: { score: accumulation, max: 15 }
    },
    keyReasons,
    risks,
    summary: total >= 70 ? "수급·돌파·모멘텀 우수, 진입 가능 신호" : total >= 50 ? "조건부 진입 — 일부 영역 보강 필요" : "진입 부적절 — 핵심 영역 미흡",
    confidence: total,
    raw: { change, investor, mcVal, neoScore, breakType, wick, originalGrade: s.grade }
  };
}
