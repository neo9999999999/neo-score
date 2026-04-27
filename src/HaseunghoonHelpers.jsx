import React from "react";
import { gradeColor, RadarChart, EXTRACTED_LABELS, fmtPrice, statusColor, statusLabel } from "./ChimchakhaeHelpers.jsx";

// ============================================================
// 하승훈(Toptrader) 돌파매매 분석 헬퍼
// 5엔진 + VETO 강등 룰 (가이드 3종 통합)
//
// 기존 시스템과 차별점:
//   - 시그널: 18항목 절대 점수 합산 → 정량
//   - 침착해: 종가베팅 안정성 (큰 등락 감점)
//   - 하승훈: 그날 시장 내 상대평가 (1등주 추적)
//   - 하승훈: "세력 흔적 + 가짜 돌파 배제" (다단계 강등)
//
// 5엔진 (100점 만점):
//   1. 사전 응축 에너지 (25점): 박스권/이평수렴/저항테스트 + 장기 신고가 가산
//   2. 돌파 품질 (30점): 종가위치 + 몸통비율 + 돌파폭 — 가장 큰 가중
//   3. 거래 진정성 (20점): 상대거래량 + 거래대금
//   4. 수급 지속성 (15점): 외+기+프 + 후반 강화
//   5. 바닥권 첫 양봉 (10점): 별도 가산 — 사용자 강조 핵심
//
// VETO 룰 (총점 무관 즉시 C 강등):
//   - 윗꼬리 비율 35%+
//   - 종가가 저항선 아래 마감 (음봉 또는 약한 종가)
//   - 이격도 30%+ (20일 이평 대비)
//   - 역배열 추정 (장기 하락추세에서 반등)
//   - 거래대금 컸지만 종가 5% 이상 밀림
// ============================================================

// 단일 종목 점수 (절대값 기반, 컨텍스트 없음)
export function calcHaseunghoonScore(s) {
  return calcHaseunghoonScoreContext(s, null);
}

// 컨텍스트 기반 점수 (시장 전체 분포 반영)
// signalsContext: { amounts: [...], changes: [...] } | null
export function calcHaseunghoonScoreContext(s, signalsContext) {
  let condensation = 0; // 사전 응축 (25)
  let breakout = 0;     // 돌파 품질 (30)
  let volume = 0;       // 거래 진정성 (20)
  let supply = 0;       // 수급 지속성 (15)
  let bottomFirst = 0;  // 바닥권 첫 양봉 (10)

  const amt = s.amount || 0;
  const ch = s.change || 0;
  const wick = s.wick != null ? s.wick : 99;
  const breakType = s.breakType || s.breaktype || ""; // ATH, 52W, 60일, 매물대 등

  // ════════════════════════════════════════════════════════════
  // 1. 사전 응축 에너지 (25점)
  // 장기 신고가일수록 (240일 > 120일 > 60일) 응축이 강함
  // ════════════════════════════════════════════════════════════
  if (breakType === "ATH" || breakType === "사상최고가" || breakType === "신고가") {
    condensation += 25; // 사상 최고가 = 모든 매물 소화
  } else if (breakType === "52W" || breakType === "52주" || breakType === "240일") {
    condensation += 22;
  } else if (breakType === "120일") {
    condensation += 17;
  } else if (breakType === "60일") {
    condensation += 12;
  } else if (breakType === "매물대" || breakType === "박스돌파") {
    condensation += 8;
  } else {
    condensation += 3;
  }

  // ════════════════════════════════════════════════════════════
  // 2. 돌파 품질 (30점) - 가장 큰 가중치
  // 몸통돌파 + 종가 마감 강도 핵심
  // ════════════════════════════════════════════════════════════
  // 종가 위치 (윗꼬리 작을수록 강함, 12점)
  if (wick <= 0.5) breakout += 12;       // 종가=고가 (완벽 마감)
  else if (wick <= 1.5) breakout += 10;
  else if (wick <= 3) breakout += 7;
  else if (wick <= 5) breakout += 4;
  else if (wick <= 8) breakout += 1;
  // 8% 초과는 0점 (35% 초과는 VETO)

  // 등락률 = 돌파폭 (10점) - 너무 작으면 의미 없고, 너무 크면 과열
  if (ch >= 8 && ch <= 20) breakout += 10;     // 골든존 (몸통 돌파)
  else if (ch >= 20 && ch <= 25) breakout += 8;
  else if (ch >= 5 && ch < 8) breakout += 6;
  else if (ch > 25) breakout += 5;             // 과열 의심
  else if (ch >= 3) breakout += 3;
  // 3% 미만은 0점 (몸통 돌파 부적격)

  // 종가 안착 강도 (8점) - 종가가 고점 근처면 강함
  if (wick <= 1.5 && ch >= 8) breakout += 8;       // 고점 마감 + 강한 등락
  else if (wick <= 3 && ch >= 5) breakout += 5;
  else if (wick <= 5) breakout += 2;

  // ════════════════════════════════════════════════════════════
  // 3. 거래 진정성 (20점)
  // 상대거래량 + 거래대금 절대값
  // ════════════════════════════════════════════════════════════
  // 거래대금 절대 규모 (12점)
  if (amt >= 5000) volume += 12;
  else if (amt >= 3000) volume += 11;
  else if (amt >= 2000) volume += 9;
  else if (amt >= 1000) volume += 7;
  else if (amt >= 500) volume += 5;
  else if (amt >= 200) volume += 3;
  else volume += 1;

  // 시장 내 거래대금 순위 (상대 진정성, 8점)
  if (signalsContext && signalsContext.amounts && signalsContext.amounts.length > 0) {
    const amtIdx = signalsContext.amounts.findIndex(function (x) { return x <= amt; });
    const ai = amtIdx === -1 ? signalsContext.amounts.length : amtIdx;
    if (ai === 0) volume += 8;
    else if (ai <= 2) volume += 7;
    else if (ai <= 4) volume += 5;
    else if (ai <= 9) volume += 3;
    else if (ai <= 19) volume += 1;
  } else {
    // 컨텍스트 없으면 절대값 추정
    if (amt >= 3000) volume += 8;
    else if (amt >= 1000) volume += 5;
    else if (amt >= 500) volume += 3;
    else if (amt >= 200) volume += 1;
  }

  // ════════════════════════════════════════════════════════════
  // 4. 수급 지속성 (15점)
  // 외+기+프 동반 + 후반 강화
  // ════════════════════════════════════════════════════════════
  if (s.investor === "기+외" || s.investor === "외+기") supply += 15; // 3주체급
  else if (s.investor === "외만" || s.investor === "외인") supply += 10;
  else if (s.investor === "기만" || s.investor === "기관") supply += 8;
  else if (s.investor === "둘다-") supply -= 5; // 음수 (개인 비중 높음 의심)
  else supply += 2;

  // ════════════════════════════════════════════════════════════
  // 5. 바닥권 첫 양봉 (10점) - 사용자 강조 핵심
  // 추정 룰: 사상최고가나 52W가 아니면서 8%+ 강한 등락 + 윗꼬리 짧음
  // = 새로운 추세의 시작 신호일 가능성
  // ════════════════════════════════════════════════════════════
  const isFirstBottomBreak = (
    (breakType === "60일" || breakType === "매물대" || breakType === "박스돌파") &&
    ch >= 8 && ch <= 18 &&
    wick <= 2 &&
    amt >= 500
  );
  if (isFirstBottomBreak) bottomFirst += 10;
  else if (breakType === "ATH" || breakType === "52W") bottomFirst += 5; // 신고가는 절반
  else if (ch >= 8 && wick <= 3 && amt >= 300) bottomFirst += 5;
  else if (ch >= 5 && wick <= 5) bottomFirst += 2;

  // ════════════════════════════════════════════════════════════
  // 합산
  // ════════════════════════════════════════════════════════════
  let total = condensation + breakout + volume + supply + bottomFirst;
  total = Math.max(0, Math.min(100, total));

  // ════════════════════════════════════════════════════════════
  // VETO 룰 — 즉시 C 강등 (총점 무관)
  // ════════════════════════════════════════════════════════════
  let vetoed = false;
  let vetoReasons = [];

  // V1: 치명적 윗꼬리 (35%+) — 세력 이탈
  if (wick >= 50) { vetoed = true; vetoReasons.push("윗꼬리 35%+"); }
  // V2: 거래대금 큰데 종가 약함 (5%+ 윗꼬리 + 큰 거래대금)
  if (amt >= 2000 && wick >= 10) { vetoed = true; vetoReasons.push("대량거래 + 윗꼬리 과다"); }
  // V3: 등락률 미달 (3% 미만은 돌파 부적격)
  if (ch < 2) { vetoed = true; vetoReasons.push("돌파폭 부족"); }
  // V4: 둘다- (음수 수급)
  if (s.investor === "둘다-") { vetoed = true; vetoReasons.push("외+기 동반 매도"); }

  // 등급 산출 (등급 임계 — 가이드 그대로)
  let grade = "C";
  let weight = 0;
  let note = "";
  if (vetoed) {
    grade = "C";
    weight = 0;
    note = "🚫 VETO: " + vetoReasons.join(", ");
  } else {
    if (total >= 78) { grade = "S+"; weight = 25; note = "💎 최상급 진성 돌파"; }
    else if (total >= 68) { grade = "S"; weight = 20; note = "🔥 매우 우수한 돌파"; }
    else if (total >= 58) { grade = "A+"; weight = 15; note = "✅ 분할 접근 가능"; }
    else if (total >= 48) { grade = "A"; weight = 10; note = "👀 재테스트 확인"; }
    else if (total >= 50) { grade = "B"; weight = 3; note = "⚠️ 관찰 위주"; }
    else { grade = "C"; weight = 0; note = "❌ 매매 제외"; }
  }

  return {
    score: total,
    grade: grade,
    weight: weight,
    note: note,
    vetoed: vetoed,
    vetoReasons: vetoReasons,
    breakdown: {
      condensation: condensation, // 사전 응축 (25)
      breakout: breakout,         // 돌파 품질 (30)
      volume: volume,             // 거래 진정성 (20)
      supply: supply,             // 수급 지속성 (15)
      bottomFirst: bottomFirst,   // 바닥권 첫 양봉 (10)
    },
  };
}

// 신호 배열 일괄 점수 계산 (시장 컨텍스트 자동)
export function calcHaseunghoonScores(signals) {
  if (!signals || signals.length === 0) return [];
  const amounts = signals.map(function (s) { return s.amount || 0; }).sort(function (a, b) { return b - a; });
  const changes = signals.map(function (s) { return s.change || 0; }).sort(function (a, b) { return b - a; });
  const context = { amounts: amounts, changes: changes };
  return signals.map(function (s) {
    const result = calcHaseunghoonScoreContext(s, context);
    return Object.assign({}, s, {
      hsScore: result.score,
      hsGrade: result.grade,
      hsWeight: result.weight,
      hsBreakdown: result.breakdown,
      hsNote: result.note,
      hsVetoed: result.vetoed,
      hsVetoReasons: result.vetoReasons,
    });
  });
}

export function haseunghoonGradeColor(grade) {
  if (grade === "S+") return "#0d9488"; // 진한 청록
  if (grade === "S") return "#0891b2";  // 시안
  if (grade === "A+") return "#0284c7"; // 하늘
  if (grade === "A") return "#2563eb";  // 파랑
  if (grade === "B") return "#ca8a04";  // 황색
  return "#dc2626";                      // C는 빨강 (위험)
}

// 하승훈 전용 5엔진 펜타곤 레이더 차트
// 5각형 (사전응축/돌파품질/거래진정성/수급지속성/바닥첫양봉)
export function HaseunghoonRadarChart(props) {
  const engines = props.engines;
  const color = props.color || "#0d9488";
  if (!engines || !engines.condensation || !engines.breakout || !engines.volume || !engines.supply || !engines.bottomFirst) return null;
  const points = [
    { label: "사전응축", value: engines.condensation.score / engines.condensation.max, score: engines.condensation.score, max: engines.condensation.max },
    { label: "돌파품질", value: engines.breakout.score / engines.breakout.max, score: engines.breakout.score, max: engines.breakout.max },
    { label: "거래진정성", value: engines.volume.score / engines.volume.max, score: engines.volume.score, max: engines.volume.max },
    { label: "수급지속성", value: engines.supply.score / engines.supply.max, score: engines.supply.score, max: engines.supply.max },
    { label: "바닥첫양봉", value: engines.bottomFirst.score / engines.bottomFirst.max, score: engines.bottomFirst.score, max: engines.bottomFirst.max },
  ];
  const cx = 150, cy = 150, R = 95;
  // 5각형 - 12시 방향부터 시작, 시계방향
  const angles = [];
  for (let i = 0; i < 5; i++) {
    angles.push(-Math.PI / 2 + (Math.PI * 2 * i) / 5);
  }
  function gridStr(scale) {
    const pts = [];
    for (let i = 0; i < 5; i++) {
      const x = cx + Math.cos(angles[i]) * R * scale;
      const y = cy + Math.sin(angles[i]) * R * scale;
      pts.push(x.toFixed(1) + "," + y.toFixed(1));
    }
    return pts.join(" ");
  }
  const dataPts = [];
  for (let i = 0; i < 5; i++) {
    const v = Math.max(points[i].value, 0.02);
    const x = cx + Math.cos(angles[i]) * R * v;
    const y = cy + Math.sin(angles[i]) * R * v;
    dataPts.push(x.toFixed(1) + "," + y.toFixed(1));
  }
  // 라벨 위치 — 각 정점에서 약간 바깥으로
  function labelPos(i) {
    const lx = cx + Math.cos(angles[i]) * (R + 18);
    const ly = cy + Math.sin(angles[i]) * (R + 18);
    let anchor = "middle";
    if (Math.cos(angles[i]) > 0.3) anchor = "start";
    else if (Math.cos(angles[i]) < -0.3) anchor = "end";
    return { x: lx, y: ly, anchor: anchor };
  }
  return (
    <svg viewBox="0 0 300 300" style={{ width: "100%", maxWidth: "280px", height: "auto", display: "block", margin: "0 auto" }}>
      <polygon points={gridStr(1.0)} fill="none" stroke="#cbd5e1" strokeWidth="1" />
      <polygon points={gridStr(0.75)} fill="none" stroke="#e2e8f0" strokeWidth="1" />
      <polygon points={gridStr(0.5)} fill="none" stroke="#e2e8f0" strokeWidth="1" />
      <polygon points={gridStr(0.25)} fill="none" stroke="#e2e8f0" strokeWidth="1" />
      {angles.map(function (a, i) {
        const ex = cx + Math.cos(a) * R;
        const ey = cy + Math.sin(a) * R;
        return <line key={i} x1={cx} y1={cy} x2={ex} y2={ey} stroke="#e2e8f0" strokeWidth="1" />;
      })}
      <polygon points={dataPts.join(" ")} fill={color + "33"} stroke={color} strokeWidth="2" strokeLinejoin="round" />
      {points.map(function (p, i) {
        const v = Math.max(p.value, 0.02);
        const x = cx + Math.cos(angles[i]) * R * v;
        const y = cy + Math.sin(angles[i]) * R * v;
        return <circle key={i} cx={x} cy={y} r="3" fill={color} />;
      })}
      {points.map(function (p, i) {
        const lp = labelPos(i);
        return (
          <g key={i}>
            <text x={lp.x} y={lp.y} textAnchor={lp.anchor} fontSize="10" fontWeight="700" fill="#475569">{p.label}</text>
            <text x={lp.x} y={lp.y + 11} textAnchor={lp.anchor} fontSize="10" fontWeight="800" fill={color}>{p.score}/{p.max}</text>
          </g>
        );
      })}
    </svg>
  );
}

// ============================================================
// 하승훈 오늘 탭 (KIS API 스캔 결과)
// ChimchakhaeToday 구조 그대로 + 하승훈 등급 체계
// ============================================================
export function HaseunghoonToday(props) {
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
      // 하승훈 점수 일괄 매핑 (시장 컨텍스트 포함)
      const enriched = calcHaseunghoonScores(uniq);
      setData({ date: j.date, time: j.time, signals: enriched });
    } catch (e) { setErr(e.message); }
    setLoading(false);
  }, [apiUrl]);

  React.useEffect(function () { load(); }, [load]);

  if (loading) return (
    <div style={{ textAlign: "center", padding: "60px 20px" }}>
      <div style={{ fontSize: 36, marginBottom: 12 }}>⏳</div>
      <div style={{ fontSize: 16, fontWeight: 600, color: "#64748b" }}>KIS API 스크리닝 중...</div>
      <div style={{ fontSize: 13, color: "#94a3b8", marginTop: 4 }}>하승훈 5엔진 분석 중</div>
    </div>
  );
  if (err) return (
    <div style={{ textAlign: "center", padding: "40px 20px" }}>
      <div style={{ fontSize: 36, marginBottom: 12 }}>⚠️</div>
      <div style={{ fontSize: 15, color: "#dc2626", marginBottom: 8 }}>{err}</div>
      <button onClick={load} style={{ padding: "8px 20px", borderRadius: 8, border: "1px solid #e2e8f0", background: "#fff", fontSize: 14, fontWeight: 600, cursor: "pointer" }}>다시 시도</button>
    </div>
  );
  if (!data || !data.signals || data.signals.length === 0) return (
    <div style={{ textAlign: "center", padding: "40px 20px", color: "#64748b" }}>
      <div style={{ fontSize: 36, marginBottom: 12 }}>📭</div>
      <div>오늘 신호 없음</div>
    </div>
  );

  const signals = data.signals.slice();
  if (sortBy === "score") signals.sort(function (a, b) { return (b.hsScore || 0) - (a.hsScore || 0); });
  else if (sortBy === "amount") signals.sort(function (a, b) { return (b.amount || 0) - (a.amount || 0); });
  else if (sortBy === "change") signals.sort(function (a, b) { return (b.change || 0) - (a.change || 0); });

  // 등급별 카운트
  const counts = {};
  ["S+", "S", "A+", "A", "B+", "B", "C"].forEach(function (g) { counts[g] = 0; });
  signals.forEach(function (s) { if (counts[s.hsGrade] != null) counts[s.hsGrade]++; });

  return (
    <div style={{ padding: "12px 14px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
        <div>
          <div style={{ fontSize: 18, fontWeight: 800, color: "#1e293b" }}>📈 하승훈 오늘</div>
          <div style={{ fontSize: 11, color: "#64748b", marginTop: 2 }}>{data.date} {data.time} · {signals.length}건</div>
        </div>
        <button onClick={load} style={{ padding: "6px 12px", borderRadius: 7, border: "1px solid #e2e8f0", background: "#fff", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>↻ 새로고침</button>
      </div>

      {/* 등급 분포 */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 4, marginBottom: 10 }}>
        {["S+", "S", "A+", "A", "B+", "B", "C"].map(function (g) {
          const col = haseunghoonGradeColor(g);
          return (
            <div key={g} style={{ textAlign: "center", padding: "6px 2px", borderRadius: 7, background: col + "15", border: "1px solid " + col + "40" }}>
              <div style={{ fontSize: 11, fontWeight: 800, color: col }}>{g}</div>
              <div style={{ fontSize: 13, fontWeight: 800, color: "#1e293b", marginTop: 1 }}>{counts[g]}</div>
            </div>
          );
        })}
      </div>

      {/* 정렬 */}
      <div style={{ display: "flex", gap: 4, marginBottom: 8 }}>
        {[
          { k: "score", label: "하승훈점수" },
          { k: "amount", label: "거래대금" },
          { k: "change", label: "등락률" },
        ].map(function (x) {
          const active = sortBy === x.k;
          return (
            <button key={x.k} onClick={function () { setSortBy(x.k); }} style={{ flex: 1, padding: "6px 4px", borderRadius: 7, border: "1px solid " + (active ? "#1e293b" : "#e2e8f0"), background: active ? "#1e293b" : "#fff", color: active ? "#fff" : "#64748b", fontSize: 11, fontWeight: 700, cursor: "pointer" }}>{x.label}</button>
          );
        })}
      </div>

      {/* 신호 리스트 */}
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        {signals.map(function (s, i) {
          const col = haseunghoonGradeColor(s.hsGrade);
          return (
            <div key={s.code || i} onClick={function () { setSelected(s); }} style={{ padding: "10px 12px", borderRadius: 9, background: "#fff", border: "1px solid " + col + "40", borderLeft: "3px solid " + col, cursor: "pointer" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6, flex: 1, minWidth: 0 }}>
                  <span style={{ padding: "2px 6px", borderRadius: 5, background: col, color: "#fff", fontSize: 10, fontWeight: 800, flexShrink: 0 }}>{s.hsGrade}</span>
                  <span style={{ fontSize: 14, fontWeight: 800, color: "#1e293b", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{s.name}</span>
                  <span style={{ fontSize: 10, color: "#94a3b8", flexShrink: 0 }}>{s.market}</span>
                </div>
                <div style={{ textAlign: "right", flexShrink: 0 }}>
                  <div style={{ fontSize: 14, fontWeight: 800, color: col }}>{s.hsScore}점</div>
                  <div style={{ fontSize: 10, color: "#64748b" }}>비중 {s.hsWeight}%</div>
                </div>
              </div>
              <div style={{ display: "flex", gap: 8, marginTop: 4, fontSize: 10, color: "#64748b", flexWrap: "wrap" }}>
                <span style={{ color: (s.change || 0) >= 0 ? "#dc2626" : "#2563eb", fontWeight: 700 }}>{(s.change || 0) >= 0 ? "+" : ""}{s.change}%</span>
                <span>거래대금 {(s.amount || 0).toLocaleString()}억</span>
                <span>{s.investor || "수급-"}</span>
                <span style={{ color: "#94a3b8" }}>{s.hsNote}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* 상세 모달 */}
      {selected && <HaseunghoonDetailModal item={selected} onClose={function () { setSelected(null); }} />}
    </div>
  );
}

// ============================================================
// 하승훈 상세 모달 — 종목 클릭 시 4엔진 분해 + 가이드 체크
// ============================================================
export function HaseunghoonDetailModal(props) {
  const item = props.item;
  const onClose = props.onClose;
  if (!item) return null;
  const col = haseunghoonGradeColor(item.hsGrade);
  const br = item.hsBreakdown || {};

  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
      <div onClick={function (e) { e.stopPropagation(); }} style={{ background: "#fff", borderRadius: 14, padding: 18, maxWidth: 480, width: "100%", maxHeight: "85vh", overflow: "auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
          <div>
            <div style={{ fontSize: 18, fontWeight: 800, color: "#1e293b" }}>{item.name}</div>
            <div style={{ fontSize: 11, color: "#64748b" }}>{item.code} · {item.market}</div>
          </div>
          <button onClick={onClose} style={{ width: 28, height: 28, borderRadius: "50%", background: "#f1f5f9", border: "none", cursor: "pointer", fontSize: 14 }}>✕</button>
        </div>

        {/* 점수 + 등급 + 비중 */}
        <div style={{ padding: "14px 16px", borderRadius: 11, background: col + "0a", border: "1px solid " + col + "40", marginBottom: 14, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={{ fontSize: 11, color: "#64748b", fontWeight: 700, marginBottom: 4 }}>하승훈 등급</div>
            <div style={{ fontSize: 28, fontWeight: 900, color: col }}>{item.hsGrade}</div>
            <div style={{ fontSize: 10, color: "#94a3b8", marginTop: 2 }}>{item.hsNote}</div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 11, color: "#64748b", fontWeight: 700, marginBottom: 4 }}>점수 / 추천비중</div>
            <div style={{ fontSize: 22, fontWeight: 900, color: "#1e293b" }}>{item.hsScore}점</div>
            <div style={{ fontSize: 12, fontWeight: 700, color: col, marginTop: 2 }}>비중 {item.hsWeight}%</div>
          </div>
        </div>

        {/* 5엔진 분해 (하승훈 고유) */}
        <div style={{ fontSize: 11, fontWeight: 800, color: "#475569", marginBottom: 8 }}>📊 하승훈 5엔진 분해</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 8, marginBottom: 14 }}>
          {[
            { k: "condensation", label: "사전 응축 에너지", max: 25, val: br.condensation || 0, col: "#0d9488", desc: "신고가 + 박스권 응축" },
            { k: "breakout", label: "돌파 품질 (몸통)", max: 30, val: br.breakout || 0, col: "#dc2626", desc: "종가위치 + 등락폭 + 마감" },
            { k: "volume", label: "거래 진정성", max: 20, val: br.volume || 0, col: "#0284c7", desc: "거래대금 + 시장 순위" },
            { k: "supply", label: "수급 지속성", max: 15, val: br.supply || 0, col: "#7c3aed", desc: "외+기 동반 + 후반 강화" },
            { k: "bottomFirst", label: "🏆 바닥권 첫 양봉", max: 10, val: br.bottomFirst || 0, col: "#ea580c", desc: "추세 시작 신호 (가산점)" },
          ].map(function (e) {
            const pct = (e.val / e.max) * 100;
            return (
              <div key={e.k} style={{ padding: "10px 12px", borderRadius: 8, background: "#f8fafc", border: "1px solid #e2e8f0" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 4 }}>
                  <span style={{ fontSize: 11, fontWeight: 700, color: e.col }}>{e.label}</span>
                  <span style={{ fontSize: 12, fontWeight: 800, color: "#1e293b" }}>{e.val}/{e.max}</span>
                </div>
                <div style={{ height: 5, background: "#e2e8f0", borderRadius: 3, overflow: "hidden" }}>
                  <div style={{ width: Math.max(0, Math.min(100, pct)) + "%", height: "100%", background: e.col }} />
                </div>
                <div style={{ fontSize: 9, color: "#94a3b8", marginTop: 3 }}>{e.desc}</div>
              </div>
            );
          })}
        </div>

        {/* VETO 경고 (있을 때만) */}
        {item.hsVetoed && item.hsVetoReasons && item.hsVetoReasons.length > 0 && (
          <div style={{ background: "#fef2f2", border: "2px solid #fca5a5", borderRadius: 8, padding: "10px 12px", marginBottom: 14 }}>
            <div style={{ fontSize: 12, fontWeight: 800, color: "#dc2626", marginBottom: 4 }}>🚫 VETO 강등 — 매매 금지</div>
            <div style={{ fontSize: 11, color: "#7f1d1d" }}>{item.hsVetoReasons.join(" / ")}</div>
          </div>
        )}

        {/* 하승훈 체크리스트 */}
        <div style={{ fontSize: 11, fontWeight: 800, color: "#475569", marginBottom: 8 }}>✅ 하승훈 체크</div>
        <div style={{ background: "#f8fafc", borderRadius: 8, padding: "10px 12px", marginBottom: 14 }}>
          {[
            { ok: item.breakType === "ATH" || item.breakType === "사상최고가" || item.breakType === "52W" || item.breakType === "신고가" || item.breakType === "240일", label: "장기 신고가 돌파 (240일+)", val: item.breakType || "-" },
            { ok: (item.change || 0) >= 8 && (item.change || 0) <= 20, label: "몸통 돌파 골든존 (8~20%)", val: (item.change || 0) + "%" },
            { ok: (item.wick || 99) <= 1.5, label: "완벽 마감 (윗꼬리 ≤1.5%)", val: (item.wick || 0) + "%" },
            { ok: (item.amount || 0) >= 1000, label: "거래대금 1000억+ (자금 집중)", val: (item.amount || 0).toLocaleString() + "억" },
            { ok: item.investor === "기+외" || item.investor === "외+기", label: "외+기 동반매수 (세력 흔적)", val: item.investor || "-" },
            { ok: (item.wick || 99) < 35, label: "🚫 윗꼬리 35% 미만 (VETO 회피)", val: (item.wick || 0) + "%" },
          ].map(function (c, i) {
            return (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "4px 0", borderBottom: i < 5 ? "1px solid #e2e8f0" : "none" }}>
                <span style={{ fontSize: 11, color: c.ok ? "#1e293b" : "#94a3b8" }}>
                  {c.ok ? "✓" : "✗"} {c.label}
                </span>
                <span style={{ fontSize: 10, fontWeight: 700, color: c.ok ? "#0d9488" : "#94a3b8" }}>{c.val}</span>
              </div>
            );
          })}
        </div>

        {/* KIS raw 데이터 */}
        <div style={{ fontSize: 11, fontWeight: 800, color: "#475569", marginBottom: 8 }}>📡 KIS 데이터</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6, fontSize: 11 }}>
          <div style={{ padding: "6px 8px", background: "#f8fafc", borderRadius: 5 }}>등락률 <strong style={{ color: (item.change || 0) >= 0 ? "#dc2626" : "#2563eb" }}>{(item.change || 0) >= 0 ? "+" : ""}{item.change}%</strong></div>
          <div style={{ padding: "6px 8px", background: "#f8fafc", borderRadius: 5 }}>거래대금 <strong>{(item.amount || 0).toLocaleString()}억</strong></div>
          <div style={{ padding: "6px 8px", background: "#f8fafc", borderRadius: 5 }}>수급 <strong>{item.investor || "-"}</strong></div>
          <div style={{ padding: "6px 8px", background: "#f8fafc", borderRadius: 5 }}>윗꼬리 <strong>{item.wick || 0}%</strong></div>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// 하승훈 AI 분석 (이미지 → 5엔진 + VETO)
// 5엔진: 사전응축/돌파품질/거래진정성/수급지속성/바닥권첫양봉 + VETO 룰
// 침착해의 4엔진(수급/시황/차트/재료)과 완전히 다른 축
// ============================================================

const HASEUNGHOON_PROMPT = "당신은 한국 주식 돌파매매(하승훈/Toptrader 기법) 최고 전문가입니다. 업로드된 차트 이미지(일봉/분봉/수급/뉴스 등)를 종합 분석해서 '진성 돌파'인지 '가짜 돌파'인지 판별하세요.\n\n" +
  "━━━━ 하승훈 돌파매매 핵심 철학 ━━━━\n" +
  "기준봉(세력 흔적) + 진짜 돌파만 매매. 가짜 돌파는 VETO로 즉시 탈락:\n" +
  "- 시그널/침착해/주도주와 결정적으로 다른 점: VETO 룰로 가짜 돌파를 무자비하게 강등\n" +
  "- 대량 거래를 동반한 기준봉 = 세력 개입의 유일한 증거\n" +
  "- 저항선 돌파 전후 '저점 상승' + '매물 소화'를 수치화\n" +
  "- 첫 양봉 + 종가베팅 자리 = 확률 가장 높은 타점\n" +
  "- 가장 중요한 신호: 바닥권에서의 첫 장대양봉 돌파 (세력 진입 가능성)\n\n" +
  "━━━━ 하승훈 5엔진 스코어링 (100점 만점) ━━━━\n\n" +
  "【1. 사전 응축 에너지 (25점) - 돌파 전 준비도】\n" +
  "- 사상최고가/52W/240일 신고가=22~25점 (모든 매물 소화)\n" +
  "- 120일 신고가=17점 / 60일 신고가=12점 / 매물대박스 돌파=8점\n" +
  "※ 이평 5/20/60/120일 수렴, 저점 우상향, 저항 2회+ 테스트 = 가산\n\n" +
  "【2. 돌파 품질 (30점) - 가장 큰 가중치, 몸통 돌파 핵심】\n" +
  "- 종가 위치 (12점): 윗꼬리 ≤0.5%=12 / ≤1.5%=10 / ≤3%=7 / ≤5%=4 / ≤8%=1\n" +
  "- 등락폭/돌파폭 (10점): 8~20% 골든존=10 / 20~25%=8 / 5~8%=6 / 25%+ 과열=5\n" +
  "- 종가 안착 (8점): 윗꼬리≤1.5% AND 등락 8%+ = 8점 (완벽 종가)\n\n" +
  "【3. 거래 진정성 (20점) - 돈과 관심】\n" +
  "- 거래대금 절대 규모 (12점): 5000억+=12 / 3000억+=11 / 2000억+=9 / 1000억+=7 / 500억+=5\n" +
  "- 시장 내 거래대금 순위 (8점): 1위=8 / 5위 이내=5 / 10위 이내=3\n" +
  "※ 직전 20일 평균 대비 500%+ 거래량 증가가 이상적\n\n" +
  "【4. 수급 지속성 (15점) - 세력 동반 + 후반 강화】\n" +
  "- 외+기 동반매수=15 / 외인만=10 / 기관만=8 / 둘다 매도=-5 (음수)\n" +
  "- 14:00 이후 거래량 피크 + 후반 매수세 강화 = 가산\n" +
  "- 개인 비중 70%+ 시 수급 신뢰도 하락\n\n" +
  "【5. 🏆 바닥권 첫 양봉 (10점) - 사용자 강조 핵심 가산점】\n" +
  "- 60일 박스 돌파 OR 매물대 돌파 + 등락 8~18% + 윗꼬리 ≤2% + 거래대금 500억+ = 10점\n" +
  "- 사상최고가/52W 갱신은 5점 (이미 추세 진행 중)\n" +
  "- 추세 시작점 신호일 가능성을 높게 평가\n\n" +
  "━━━━ 🚨 VETO 룰 (총점 무관 즉시 C 강등) ━━━━\n" +
  "1. 윗꼬리 35%+ (몸통 대비 매도압력 압도)\n" +
  "2. 종가가 저항선 아래 마감 (돌파 실패)\n" +
  "3. 이격도 30%+ 과열 상태 (20일 이평 대비, 설거지 가능성)\n" +
  "4. 역배열 (120/240일 이평 가파른 하락 중 반등)\n" +
  "5. M자 패턴 완성 (쌍봉 + 넥라인 이탈)\n" +
  "6. 거래대금 1000억+ 인데 윗꼬리 5%+ (대량거래 + 종가 약함)\n" +
  "VETO 발동 시 totalScore 무관, grade='C', verdict='VETO 강등', vetoReasons에 사유 기재.\n\n" +
  "━━━━ 등급 (가이드 그대로) ━━━━\n" +
  "S+ (95+): 최상급 진성 돌파 / S (90+): 매우 우수 / A+ (85+): 분할 접근 / A (75+): 재테스트 확인 / B (60+): 관찰 / C (<60 OR VETO): 매매 제외\n\n" +
  "━━━━ 추천 비중 ━━━━\n" +
  "S+: 25% / S: 20% / A+: 15% / A: 10% / B: 3% / C: 0%\n\n" +
  "━━━━ 가격 산출 (돌파매매 = 큰 폭 수익) ━━━━\n" +
  "- entryPrice: 종가 또는 다음날 시초 (현재가 ±1%)\n" +
  "- tp1Price: 진입가 +10~20% (S+급 +20~30%)\n" +
  "- tp2Price: 진입가 +30~50% (S/A+급만, B 이하면 null)\n" +
  "- slPrice: 진입가 -5~7% 또는 돌파봉 저점 / 직전 매물대 상단\n" +
  "차트에서 가격 식별 불가시 null. 숫자만.\n\n" +
  "━━━━ 보조지표 분석 ━━━━\n" +
  "각 지표 positive/neutral/negative/unknown:\n" +
  "- RSI(와일더), 스토캐스틱(레인), 볼린저(존 볼린저), 일목균형표, Envelope\n\n" +
  "━━━━ 신뢰도 ━━━━\n" +
  "confidenceScore (0~100): 차트/수급/거래대금 모두 선명 = 85+, 일부 흐릿 = 60~80, 핵심 부족 = 50 미만.\n\n" +
  "━━━━ 필수 JSON 출력 (다른 설명 금지) ━━━━\n" +
  "{\n" +
  '  "stockName": "종목명",\n' +
  '  "stockCode": "코드",\n' +
  '  "imagesAnalyzed": [ { "type": "분류", "summary": "핵심 데이터" } ],\n' +
  '  "extractedData": { "currentPrice":"", "changeRate":"", "tradingValue":"", "foreignLate":"", "instLate":"", "progLate":"", "threeDaysSupply":"", "sector":"", "sectorRank":"", "chartPattern":"", "breakoutType":"", "maArrangement":"", "volumeSurge":"", "closeType":"", "material":"", "materialType":"" },\n' +
  '  "engines": {\n' +
  '    "condensation": { "score": 숫자, "max": 25, "breakdown": {"newHigh":숫자,"maAlign":숫자,"resistTest":숫자}, "reasoning":"신고가 단계 + 이평 수렴 + 저항 테스트 근거" },\n' +
  '    "breakout": { "score": 숫자, "max": 30, "breakdown": {"closePos":숫자,"changeRange":숫자,"settle":숫자}, "reasoning":"몸통 돌파 + 종가 위치 근거" },\n' +
  '    "volume": { "score": 숫자, "max": 20, "breakdown": {"absAmt":숫자,"relRank":숫자}, "reasoning":"거래대금 절대값 + 시장 내 순위 근거" },\n' +
  '    "supply": { "score": 숫자, "max": 15, "breakdown": {"foreign":숫자,"institute":숫자,"lateStrength":숫자}, "reasoning":"외+기 동반 + 후반 강화 근거" },\n' +
  '    "bottomFirst": { "score": 숫자, "max": 10, "breakdown": {"isFirst":숫자,"trendStart":숫자}, "reasoning":"바닥권 첫 양봉 + 추세 시작 근거" }\n' +
  "  },\n" +
  '  "vetoStatus": { "vetoed": true|false, "reasons": ["사유1","사유2"] },\n' +
  '  "supplyZone": { "level":"long|mid|short|none", "levelLabel":"장기|중기|단기|없음 매물대", "period":"형성 기간", "thickness":"heavy|medium|thin", "thicknessLabel":"두께", "status":"돌파|돌파시도|저항|안착", "breakoutQuality":"돌파봉 품질", "detail":"3~5문장" },\n' +
  '  "technicalIndicators": {\n' +
  '    "rsi": { "status":"...", "value":"수치", "comment":"..." },\n' +
  '    "stochastic": { "status":"...", "value":"%K/%D", "comment":"..." },\n' +
  '    "bollinger": { "status":"...", "value":"밴드 위치", "comment":"..." },\n' +
  '    "ichimoku": { "status":"...", "value":"구름 위/아래/안", "comment":"..." },\n' +
  '    "envelope": { "status":"...", "value":"중심선 대비", "comment":"..." },\n' +
  '    "overallTone": "positive|neutral|negative",\n' +
  '    "summary": "보조지표 종합 톤 2~3문장"\n' +
  "  },\n" +
  '  "totalScore": 숫자, "grade": "S+|S|A+|A|B|C", "verdict": "최상급 진성|매우 우수|분할 접근|재테스트 확인|관찰|VETO 강등|매매 제외",\n' +
  '  "recommendedWeight": 숫자(0~25), "nextDayRiseProbability": 숫자(0~100), "confidenceScore": 숫자(0~100),\n' +
  '  "breakoutQuality": { "isReal": true|false, "breakType": "ATH|52W|120일|60일|매물대|박스권", "comment":"진성 돌파 판정 근거 2~3문장" },\n' +
  '  "keyReasons": ["근거1","근거2","근거3","근거4","근거5"],\n' +
  '  "risks": ["리스크1","리스크2"],\n' +
  '  "strategy": {"entry":"","exit":"","stopLoss":"","hold":"","entryPrice":숫자|null,"tp1Price":숫자|null,"tp2Price":숫자|null,"slPrice":숫자|null},\n' +
  '  "haseunghoonAnalysis": "하승훈 돌파매매 관점 종합 평가 5~7문장 (진성/가짜 돌파 판정 + 세력 흔적 + 진입 타이밍 + VETO 사유 있다면 명시)"\n' +
  "}\n\n" +
  "판독 불가 항목은 '확인불가'로. 가격 식별 불가시 null. JSON 외 텍스트 절대 금지.";

export async function analyzeHaseunghoon(images, stockName) {
  const content = [];
  for (let i = 0; i < images.length; i++) {
    const img = images[i];
    content.push({ type: "image", source: { type: "base64", media_type: img.type || "image/png", data: img.data } });
  }
  const userText = "위 차트/수급/재료 이미지들을 종합 분석해서 하승훈 돌파매매 판단을 JSON으로만 응답하세요. 마크다운 코드블록 없이 { 로 시작해서 } 로 끝나는 JSON만." + (stockName ? " 종목명: " + stockName : "");
  content.push({ type: "text", text: userText });

  const resp = await fetch("https://sector-api-pink.vercel.app/api/analyze", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 12000,
      system: HASEUNGHOON_PROMPT,
      messages: [{ role: "user", content: content }],
    }),
  });

  if (!resp.ok) {
    const errText = await resp.text().catch(function(){return "";});
    throw new Error("하승훈 분석 API " + resp.status + ": " + errText.slice(0, 200));
  }
  const data = await resp.json();

  if (!data || !data.content || !Array.isArray(data.content)) {
    throw new Error("응답 형식 이상: " + JSON.stringify(data).slice(0, 200));
  }

  const text = data.content.map(function (c) { return c && c.text || ""; }).join("");
  if (!text || text.trim().length < 10) {
    throw new Error("응답 비어있음 (stop_reason: " + (data.stop_reason || "?") + ")");
  }

  // JSON 파싱 (강화된 5단계 폴백)
  let parsed = null;
  let cleaned = text.replace(/```json|```/g, "").trim();
  const firstBrace = cleaned.indexOf("{");
  if (firstBrace > 0) cleaned = cleaned.slice(firstBrace);

  try { parsed = JSON.parse(cleaned); return parsed; } catch (_) {}

  const lastBrace = cleaned.lastIndexOf("}");
  if (lastBrace > 0) {
    const sliced = cleaned.slice(0, lastBrace + 1);
    try { parsed = JSON.parse(sliced); return parsed; } catch (_) {}

    const fixed1 = sliced.replace(/,\s*([}\]])/g, "$1").replace(/'\s*:/g, '":').replace(/:\s*'/g, ': "').replace(/'\s*([,}])/g, '"$1');
    try { parsed = JSON.parse(fixed1); return parsed; } catch (_) {}

    const lastComplete = sliced.lastIndexOf(',"');
    if (lastComplete > 0) {
      const truncated = sliced.slice(0, lastComplete) + "}";
      try { parsed = JSON.parse(truncated); return parsed; } catch (_) {}
    }
  }

  const m = cleaned.match(/\{[\s\S]*\}/);
  if (m) {
    const fixed2 = m[0].replace(/,\s*([}\]])/g, "$1");
    try { parsed = JSON.parse(fixed2); return parsed; } catch (_) {}
  }

  throw new Error("JSON 파싱 실패 (응답 " + text.length + "자, 시작: " + text.slice(0, 50) + ")");
}

// ============================================================
// 하승훈 분석 결과 카드 (ChimchakhaeResultCard와 동일 구조)
// ============================================================
export function HaseunghoonResultCard(props) {
  const res = props.result;
  if (!res || typeof res !== "object") return null;
  // grade 없으면 부분 데이터 — 단순 카드만
  if (!res.grade) {
    return (
      <div style={{ borderRadius: 14, border: "2px solid #cbd5e1", padding: "16px", marginBottom: 14, background: "#fff" }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: "#475569" }}>하승훈 분석 데이터 부족</div>
        <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 4 }}>{res.haseunghoonAnalysis || "분석 결과를 불러올 수 없습니다."}</div>
      </div>
    );
  }
  const color = gradeColor(res.grade);
  const strat = res.strategy || {};
  const eng = res.engines || {};
  const sz = res.supplyZone;
  const ti = res.technicalIndicators;
  const ed = res.extractedData;
  const bq = res.breakoutQuality;
  const vs = res.vetoStatus;

  const engineItems = [
    { key: "condensation", label: "사전 응축 에너지", color: "#0d9488", data: eng.condensation, items: eng.condensation ? [
      ["신고가 단계", eng.condensation.breakdown && eng.condensation.breakdown.newHigh, 12],
      ["이평 정렬", eng.condensation.breakdown && eng.condensation.breakdown.maAlign, 7],
      ["저항 테스트", eng.condensation.breakdown && eng.condensation.breakdown.resistTest, 6],
    ] : [] },
    { key: "breakout", label: "돌파 품질 (몸통)", color: "#dc2626", data: eng.breakout, items: eng.breakout ? [
      ["종가 위치(윗꼬리)", eng.breakout.breakdown && eng.breakout.breakdown.closePos, 12],
      ["등락폭(돌파폭)", eng.breakout.breakdown && eng.breakout.breakdown.changeRange, 10],
      ["종가 안착", eng.breakout.breakdown && eng.breakout.breakdown.settle, 8],
    ] : [] },
    { key: "volume", label: "거래 진정성", color: "#0284c7", data: eng.volume, items: eng.volume ? [
      ["거래대금 절대값", eng.volume.breakdown && eng.volume.breakdown.absAmt, 12],
      ["시장 내 순위", eng.volume.breakdown && eng.volume.breakdown.relRank, 8],
    ] : [] },
    { key: "supply", label: "수급 지속성", color: "#7c3aed", data: eng.supply, items: eng.supply ? [
      ["외국인 매수", eng.supply.breakdown && eng.supply.breakdown.foreign, 6],
      ["기관 매수", eng.supply.breakdown && eng.supply.breakdown.institute, 5],
      ["후반 강화", eng.supply.breakdown && eng.supply.breakdown.lateStrength, 4],
    ] : [] },
    { key: "bottomFirst", label: "🏆 바닥권 첫 양봉", color: "#ea580c", data: eng.bottomFirst, items: eng.bottomFirst ? [
      ["첫 양봉 여부", eng.bottomFirst.breakdown && eng.bottomFirst.breakdown.isFirst, 6],
      ["추세 시작 신호", eng.bottomFirst.breakdown && eng.bottomFirst.breakdown.trendStart, 4],
    ] : [] },
  ];

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
          <div style={{ fontSize: 11, color: "rgba(255,255,255,0.85)", fontWeight: 700, marginBottom: 2 }}>📈 하승훈 분석</div>
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
        {/* 🚨 VETO 강등 경고 (있을 때만, 최상단) */}
        {vs && vs.vetoed && (
          <div style={{ background: "#fef2f2", border: "2px solid #dc2626", borderRadius: 10, padding: 12, marginBottom: 14 }}>
            <div style={{ fontSize: 13, fontWeight: 900, color: "#dc2626", marginBottom: 6 }}>🚫 VETO 강등 — 매매 절대 금지</div>
            {vs.reasons && vs.reasons.length > 0 && (
              <ul style={{ margin: 0, paddingLeft: 18, fontSize: 11, color: "#7f1d1d", lineHeight: 1.6 }}>
                {vs.reasons.map(function (r, i) { return <li key={i}>{r}</li>; })}
              </ul>
            )}
          </div>
        )}

        {/* 진성 돌파 판정 (하승훈 고유) */}
        {bq && (
          <div style={{ background: bq.isReal ? "#f0fdfa" : "#fef2f2", border: "1px solid " + (bq.isReal ? "#5eead4" : "#fca5a5"), borderRadius: 10, padding: 12, marginBottom: 14 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
              <span style={{ fontSize: 11, fontWeight: 800, color: bq.isReal ? "#0d9488" : "#dc2626" }}>
                {bq.isReal ? "✅ 진성 돌파 판정" : "⚠️ 가짜 돌파 의심"}
              </span>
              <span style={{ fontSize: 12, fontWeight: 900, color: bq.isReal ? "#0d9488" : "#dc2626" }}>{bq.breakType || "-"}</span>
            </div>
            {bq.comment && <div style={{ fontSize: 11, color: "#1e293b", lineHeight: 1.5 }}>{bq.comment}</div>}
          </div>
        )}

        {/* KPI */}
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

        {/* 5엔진 레이더 (하승훈 고유) */}
        {res.engines && eng.condensation && eng.breakout && eng.volume && eng.supply && eng.bottomFirst && (
          <div style={{ background: "#f8fafc", padding: 14, borderRadius: 10, marginBottom: 14 }}>
            <div style={{ fontSize: 12, fontWeight: 800, color: "#475569", marginBottom: 8, textAlign: "center" }}>🎯 하승훈 5엔진 분석</div>
            <HaseunghoonRadarChart engines={res.engines} color={color} />
          </div>
        )}

        {/* 추출된 데이터 */}
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

        {/* 5엔진 상세 */}
        {res.engines && (eng.condensation || eng.breakout || eng.volume || eng.supply || eng.bottomFirst) && (
          <div style={{ marginBottom: 14 }}>
            <div style={{ fontSize: 11, fontWeight: 800, color: "#475569", marginBottom: 6 }}>🔬 5엔진 상세 분석</div>
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

        {/* 매물대 분석 */}
        {sz && (
          <div style={{ marginBottom: 14 }}>
            <div style={{ fontSize: 11, fontWeight: 800, color: "#475569", marginBottom: 6 }}>🧱 매물대 돌파 분석</div>
            <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 8, padding: 12 }}>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(110px,1fr))", gap: 8, marginBottom: sz.detail ? 10 : 0 }}>
                <div style={{ textAlign: "center", padding: 8, background: "#f8fafc", borderRadius: 6 }}>
                  <div style={{ fontSize: 9, color: "#94a3b8", fontWeight: 700 }}>등급</div>
                  <div style={{ fontSize: 13, fontWeight: 800, color: sz.level === "long" ? "#dc2626" : sz.level === "mid" ? "#f59e0b" : "#1e293b" }}>{sz.levelLabel || "-"}</div>
                </div>
                <div style={{ textAlign: "center", padding: 8, background: "#f8fafc", borderRadius: 6 }}>
                  <div style={{ fontSize: 9, color: "#94a3b8", fontWeight: 700 }}>형성</div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "#1e293b" }}>{sz.period || "-"}</div>
                </div>
                <div style={{ textAlign: "center", padding: 8, background: "#f8fafc", borderRadius: 6 }}>
                  <div style={{ fontSize: 9, color: "#94a3b8", fontWeight: 700 }}>두께</div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "#1e293b" }}>{sz.thicknessLabel || "-"}</div>
                </div>
                <div style={{ textAlign: "center", padding: 8, background: "#f8fafc", borderRadius: 6 }}>
                  <div style={{ fontSize: 9, color: "#94a3b8", fontWeight: 700 }}>상태</div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "#1e293b" }}>{sz.status || "-"}</div>
                </div>
              </div>
              {sz.detail && <div style={{ fontSize: 11, color: "#475569", lineHeight: 1.6, padding: "8px 10px", background: "#f8fafc", borderRadius: 6 }}>{sz.detail}</div>}
            </div>
          </div>
        )}

        {/* 보조지표 */}
        {ti && indicators.some(function (x) { return x.data && x.data.status; }) && (
          <div style={{ marginBottom: 14 }}>
            <div style={{ fontSize: 11, fontWeight: 800, color: "#475569", marginBottom: 6 }}>📊 보조지표</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px,1fr))", gap: 6 }}>
              {indicators.map(function (ind) {
                if (!ind.data || !ind.data.status) return null;
                const col = statusColor(ind.data.status);
                return (
                  <div key={ind.key} style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 6, padding: 8, borderLeft: "3px solid " + col }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 3 }}>
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

        {/* 매매 전략 */}
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

        {/* 분석된 이미지 */}
        {res.imagesAnalyzed && res.imagesAnalyzed.length > 0 && (
          <div style={{ marginBottom: 12 }}>
            <div style={{ fontSize: 11, fontWeight: 800, color: "#475569", marginBottom: 6 }}>🖼️ 분석된 이미지</div>
            {res.imagesAnalyzed.map(function (im, i) {
              return (
                <div key={i} style={{ display: "flex", gap: 8, alignItems: "center", padding: "6px 10px", background: "#f8fafc", borderRadius: 6, marginBottom: 4, fontSize: 11 }}>
                  <span style={{ fontSize: 10, padding: "2px 8px", background: "#fef3c7", color: "#92400e", borderRadius: 4, fontWeight: 700, flexShrink: 0 }}>{im.type}</span>
                  <span style={{ color: "#475569", lineHeight: 1.4 }}>{im.summary}</span>
                </div>
              );
            })}
          </div>
        )}

        {/* 하승훈 종합 평가 */}
        {res.haseunghoonAnalysis && (
          <div style={{ background: "linear-gradient(135deg, #fef3c7 0%, #fed7aa 100%)", border: "1px solid #fbbf24", borderRadius: 10, padding: 12, fontSize: 12, lineHeight: 1.7, color: "#1e293b" }}>
            <div style={{ fontSize: 11, fontWeight: 800, color: "#92400e", marginBottom: 6 }}>📈 하승훈 종합 평가</div>
            {res.haseunghoonAnalysis}
          </div>
        )}
      </div>
    </div>
  );
}
