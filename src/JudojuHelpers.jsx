import React from "react";
import { gradeColor, RadarChart, EXTRACTED_LABELS, fmtPrice, statusColor, statusLabel } from "./ChimchakhaeHelpers.jsx";

// ============================================================
// 주도주(主導株) 분석 헬퍼
// 침착해와 완전히 다른 4엔진 (가이드 문서 기반):
//   1. 상대강도 RS (30점): 그날 시장 내 거래대금/등락률 순위 — 핵심 차별점
//   2. 대장주 위치 (25점): 코스닥 부각 + 거래대금 절대값
//   3. 모멘텀 가속도 (25점): 상한가 근접도 + 종가 마감 강도
//   4. 수급 강도 (20점): 외+기 동반매수 + 거래대금 가중치
//
// 침착해와 차이:
//   - 침착해: 절대값 기반 종가베팅(안정/보수) — 큰 등락 감점
//   - 주도주: 상대평가 기반 추세추종(공격/대장주) — 강한 등락 가산
//   - 침착해의 4엔진: 수급 / 시황 / 차트 / 재료
//   - 주도주의 4엔진: 상대강도 / 대장주위치 / 모멘텀 / 수급강도
//
// 핵심 혁신: 상대강도(RS) 엔진
//   - 같은 종목이라도 그날 다른 신호들이 더 강하면 점수가 깎임
//   - 진짜 "그날의 1등주" 개념을 정량화
//   - calcJudojuScoreContext에 같은 시점 전체 신호 전달 필요
// ============================================================

// 단일 종목 점수 (절대값 기반, RS는 0으로 처리)
// KIS API 단건 호출이나 DB 단건 평가용
export function calcJudojuScore(s) {
  return calcJudojuScoreContext(s, null);
}

// 컨텍스트 기반 점수 (RS 포함, 전체 신호 분포 반영)
// signalsContext: { amounts: [정렬된 거래대금 배열], changes: [정렬된 등락률 배열] } | null
export function calcJudojuScoreContext(s, signalsContext) {
  let rs = 0, leader = 0, momentum = 0, supply = 0;

  const amt = s.amount || 0;
  const ch = s.change || 0;
  const wick = s.wick != null ? s.wick : 99;

  // ════════════════════════════════════════════════════════════
  // 1. 상대강도 RS 엔진 (30점) - 그날 시장 내 위치
  // ════════════════════════════════════════════════════════════
  // 거래대금 순위 (15점) + 등락률 순위 (15점)
  // 컨텍스트가 없으면 절대값 fallback (거래대금 5000억 = 만점 / 등락률 25% = 만점)
  if (signalsContext && signalsContext.amounts && signalsContext.amounts.length > 0) {
    // 거래대금 순위 점수 (15점) - 상대평가
    const amtRank = signalsContext.amounts.findIndex(function (x) { return x <= amt; });
    const amtRankIdx = amtRank === -1 ? signalsContext.amounts.length : amtRank;
    if (amtRankIdx === 0) rs += 15;          // 1등 (최강)
    else if (amtRankIdx <= 2) rs += 13;      // 2~3등
    else if (amtRankIdx <= 4) rs += 11;      // 4~5등
    else if (amtRankIdx <= 9) rs += 8;       // 6~10등
    else if (amtRankIdx <= 19) rs += 5;      // 11~20등
    else if (amtRankIdx <= 49) rs += 2;      // 21~50등
    // 50등 밖은 0점 (후발주)

    // 등락률 순위 점수 (15점) - 상대평가
    const chRank = signalsContext.changes.findIndex(function (x) { return x <= ch; });
    const chRankIdx = chRank === -1 ? signalsContext.changes.length : chRank;
    if (chRankIdx === 0) rs += 15;
    else if (chRankIdx <= 2) rs += 13;
    else if (chRankIdx <= 4) rs += 11;
    else if (chRankIdx <= 9) rs += 8;
    else if (chRankIdx <= 19) rs += 5;
    else if (chRankIdx <= 49) rs += 2;
  } else {
    // 컨텍스트 없으면 절대값 추정 (DB 단건 평가용)
    // 거래대금 (15점)
    if (amt >= 10000) rs += 15;       // 1조+
    else if (amt >= 5000) rs += 13;
    else if (amt >= 3000) rs += 11;
    else if (amt >= 1500) rs += 8;
    else if (amt >= 800) rs += 5;
    else if (amt >= 300) rs += 2;

    // 등락률 (15점)
    if (ch >= 25) rs += 15;            // 상한가 근접
    else if (ch >= 20) rs += 13;
    else if (ch >= 17) rs += 11;
    else if (ch >= 13) rs += 8;
    else if (ch >= 10) rs += 5;
    else if (ch >= 7) rs += 2;
  }

  // ════════════════════════════════════════════════════════════
  // 2. 대장주 위치 엔진 (25점) - 코스닥 + 거래대금 절대값
  // ════════════════════════════════════════════════════════════
  // 시장 분류 (10점) - 코스닥 소형주가 부각되기 쉬움
  if (s.market === "코스닥" || s.market === "KO" || s.market === "KQ") leader += 10;
  else if (s.market === "코스피" || s.market === "KS") leader += 6;

  // 거래대금 절대값 (15점) - 대장주는 자금 집중도가 높음
  if (amt >= 5000) leader += 15;
  else if (amt >= 3000) leader += 13;
  else if (amt >= 2000) leader += 11;
  else if (amt >= 1000) leader += 8;
  else if (amt >= 500) leader += 5;
  else if (amt >= 200) leader += 2;

  // ════════════════════════════════════════════════════════════
  // 3. 모멘텀 가속도 엔진 (25점) - 상한가 근접도 + 종가 마감
  // ════════════════════════════════════════════════════════════
  // 등락률 강도 (15점) - 침착해와 정반대: 강할수록 가산
  if (ch >= 28) momentum += 15;        // 상한가 직전 (최강 신호)
  else if (ch >= 25) momentum += 14;
  else if (ch >= 22) momentum += 13;
  else if (ch >= 18) momentum += 11;
  else if (ch >= 15) momentum += 9;
  else if (ch >= 12) momentum += 6;
  else if (ch >= 10) momentum += 3;
  // 10% 미만은 0점 (주도주 후보 부적격)

  // 종가 마감 강도 (10점) - 윗꼬리 짧을수록 강함
  if (wick <= 0.5) momentum += 10;     // 종가=고가 (완벽 마감)
  else if (wick <= 1.5) momentum += 8;
  else if (wick <= 3) momentum += 6;
  else if (wick <= 5) momentum += 3;
  else if (wick <= 7) momentum += 0;
  else if (wick <= 10) momentum -= 3;
  else momentum -= 6;                   // 큰 윗꼬리 = 매물 출회 (강한 음수)

  // ════════════════════════════════════════════════════════════
  // 4. 수급 강도 엔진 (20점) - 외+기 + 거래대금 가중치
  // ════════════════════════════════════════════════════════════
  // 동반매수 주체 (12점)
  if (s.investor === "기+외" || s.investor === "외+기") supply += 12;
  else if (s.investor === "외인" || s.investor === "외만") supply += 8;
  else if (s.investor === "기관" || s.investor === "기만") supply += 6;
  else if (s.investor === "둘다-") supply -= 5; // 음수 (부적격 신호)

  // 거래대금 양적 가중 (8점) - 큰 자금이 동반될수록 신뢰도↑
  if (amt >= 3000) supply += 8;
  else if (amt >= 1500) supply += 6;
  else if (amt >= 800) supply += 4;
  else if (amt >= 400) supply += 2;
  else if (amt >= 200) supply += 1;

  // ════════════════════════════════════════════════════════════
  // 합산 (100점 만점)
  // ════════════════════════════════════════════════════════════
  const total = Math.max(0, Math.min(100, rs + leader + momentum + supply));

  // 등급 (7단계)
  let grade = "C";
  if (total >= 88) grade = "S+";
  else if (total >= 78) grade = "S";
  else if (total >= 68) grade = "A+";
  else if (total >= 58) grade = "A";
  else if (total >= 48) grade = "B+";
  else if (total >= 38) grade = "B";

  // 추천 비중 (주도주는 대장주 집중 투자 → S+/S 비중 더 큼)
  let weight = 0;
  if (grade === "S+") weight = 100;
  else if (grade === "S") weight = 80;
  else if (grade === "A+") weight = 60;
  else if (grade === "A") weight = 35;
  else if (grade === "B+") weight = 15;
  else if (grade === "B") weight = 5;

  // 대장주 판정 노트
  let note = "";
  if (grade === "S+") note = "🏆 시장 대장주";
  else if (grade === "S") note = "🥇 1등 후보";
  else if (grade === "A+") note = "🥈 주도주";
  else if (grade === "A") note = "🥉 선도주";
  else if (grade === "B+") note = "관찰";
  else if (grade === "B") note = "후발주";
  else note = "부적격";

  return {
    score: total,
    grade: grade,
    weight: weight,
    note: note,
    breakdown: {
      rs: rs,            // 상대강도 (30점 만점)
      leader: leader,    // 대장주 위치 (25점)
      momentum: momentum, // 모멘텀 가속도 (25점)
      supply: supply,    // 수급 강도 (20점)
    },
  };
}

// 신호 배열을 받아서 모든 신호의 점수를 일괄 계산 (상대평가 포함)
// JudojuToday에서 사용
export function calcJudojuScores(signals) {
  if (!signals || signals.length === 0) return [];

  // 정렬된 거래대금/등락률 배열 만들기 (내림차순)
  const amounts = signals.map(function (s) { return s.amount || 0; }).sort(function (a, b) { return b - a; });
  const changes = signals.map(function (s) { return s.change || 0; }).sort(function (a, b) { return b - a; });
  const context = { amounts: amounts, changes: changes };

  return signals.map(function (s) {
    const result = calcJudojuScoreContext(s, context);
    return Object.assign({}, s, {
      jdScore: result.score,
      jdGrade: result.grade,
      jdWeight: result.weight,
      jdBreakdown: result.breakdown,
      jdNote: result.note,
    });
  });
}

export function judojuGradeColor(grade) {
  if (grade === "S+") return "#7c3aed";
  if (grade === "S") return "#dc2626";
  if (grade === "A+") return "#0284c7";
  if (grade === "A") return "#2563eb";
  if (grade === "B+") return "#ca8a04";
  if (grade === "B") return "#d97706";
  return "#6b7280";
}

// 주도주 전용 레이더 차트 (4엔진: rs/leader/momentum/supply)
// 침착해 RadarChart와 분리 — 키와 라벨이 다르기 때문
export function JudojuRadarChart(props) {
  const engines = props.engines;
  const color = props.color || "#7c3aed";
  if (!engines || !engines.rs || !engines.leader || !engines.momentum || !engines.supply) return null;
  const points = [
    { label: "RS", value: engines.rs.score / engines.rs.max, score: engines.rs.score, max: engines.rs.max },
    { label: "대장주", value: engines.leader.score / engines.leader.max, score: engines.leader.score, max: engines.leader.max },
    { label: "모멘텀", value: engines.momentum.score / engines.momentum.max, score: engines.momentum.score, max: engines.momentum.max },
    { label: "수급", value: engines.supply.score / engines.supply.max, score: engines.supply.score, max: engines.supply.max },
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
        return <circle key={i} cx={x} cy={y} r="3" fill={color} />;
      })}
      {points.map(function (p, i) {
        return (
          <g key={i}>
            <text x={labels[i].x} y={labels[i].y} textAnchor={labels[i].anchor} fontSize="11" fontWeight="700" fill="#475569">{p.label}</text>
            <text x={labels[i].x} y={labels[i].y + 12} textAnchor={labels[i].anchor} fontSize="10" fontWeight="800" fill={color}>{p.score}/{p.max}</text>
          </g>
        );
      })}
    </svg>
  );
}

// ============================================================
// 주도주 오늘 탭 (KIS API 스캔 결과)
// ChimchakhaeToday 구조 그대로 + 주도주 등급 체계
// ============================================================
export function JudojuToday(props) {
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
      // 주도주 점수 일괄 매핑 (상대강도 포함)
      const enriched = calcJudojuScores(uniq);
      setData({ date: j.date, time: j.time, signals: enriched });
    } catch (e) { setErr(e.message); }
    setLoading(false);
  }, [apiUrl]);

  React.useEffect(function () { load(); }, [load]);

  if (loading) return (
    <div style={{ textAlign: "center", padding: "60px 20px" }}>
      <div style={{ fontSize: 36, marginBottom: 12 }}>⏳</div>
      <div style={{ fontSize: 16, fontWeight: 600, color: "#64748b" }}>KIS API 스크리닝 중...</div>
      <div style={{ fontSize: 13, color: "#94a3b8", marginTop: 4 }}>주도주 4엔진 분석 중</div>
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
  if (sortBy === "score") signals.sort(function (a, b) { return (b.jdScore || 0) - (a.jdScore || 0); });
  else if (sortBy === "amount") signals.sort(function (a, b) { return (b.amount || 0) - (a.amount || 0); });
  else if (sortBy === "change") signals.sort(function (a, b) { return (b.change || 0) - (a.change || 0); });

  // 등급별 카운트
  const counts = {};
  ["S+", "S", "A+", "A", "B+", "B", "C"].forEach(function (g) { counts[g] = 0; });
  signals.forEach(function (s) { if (counts[s.jdGrade] != null) counts[s.jdGrade]++; });

  return (
    <div style={{ padding: "12px 14px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
        <div>
          <div style={{ fontSize: 18, fontWeight: 800, color: "#1e293b" }}>📈 주도주 오늘</div>
          <div style={{ fontSize: 11, color: "#64748b", marginTop: 2 }}>{data.date} {data.time} · {signals.length}건</div>
        </div>
        <button onClick={load} style={{ padding: "6px 12px", borderRadius: 7, border: "1px solid #e2e8f0", background: "#fff", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>↻ 새로고침</button>
      </div>

      {/* 등급 분포 */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 4, marginBottom: 10 }}>
        {["S+", "S", "A+", "A", "B+", "B", "C"].map(function (g) {
          const col = judojuGradeColor(g);
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
          { k: "score", label: "주도주점수" },
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
          const col = judojuGradeColor(s.jdGrade);
          return (
            <div key={s.code || i} onClick={function () { setSelected(s); }} style={{ padding: "10px 12px", borderRadius: 9, background: "#fff", border: "1px solid " + col + "40", borderLeft: "3px solid " + col, cursor: "pointer" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6, flex: 1, minWidth: 0 }}>
                  <span style={{ padding: "2px 6px", borderRadius: 5, background: col, color: "#fff", fontSize: 10, fontWeight: 800, flexShrink: 0 }}>{s.jdGrade}</span>
                  <span style={{ fontSize: 14, fontWeight: 800, color: "#1e293b", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{s.name}</span>
                  <span style={{ fontSize: 10, color: "#94a3b8", flexShrink: 0 }}>{s.market}</span>
                </div>
                <div style={{ textAlign: "right", flexShrink: 0 }}>
                  <div style={{ fontSize: 14, fontWeight: 800, color: col }}>{s.jdScore}점</div>
                  <div style={{ fontSize: 10, color: "#64748b" }}>비중 {s.jdWeight}%</div>
                </div>
              </div>
              <div style={{ display: "flex", gap: 8, marginTop: 4, fontSize: 10, color: "#64748b", flexWrap: "wrap" }}>
                <span style={{ color: (s.change || 0) >= 0 ? "#dc2626" : "#2563eb", fontWeight: 700 }}>{(s.change || 0) >= 0 ? "+" : ""}{s.change}%</span>
                <span>거래대금 {(s.amount || 0).toLocaleString()}억</span>
                <span>{s.investor || "수급-"}</span>
                <span style={{ color: "#94a3b8" }}>{s.jdNote}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* 상세 모달 */}
      {selected && <JudojuDetailModal item={selected} onClose={function () { setSelected(null); }} />}
    </div>
  );
}

// ============================================================
// 주도주 상세 모달 — 종목 클릭 시 4엔진 분해 + 가이드 체크
// ============================================================
export function JudojuDetailModal(props) {
  const item = props.item;
  const onClose = props.onClose;
  if (!item) return null;
  const col = judojuGradeColor(item.jdGrade);
  const br = item.jdBreakdown || {};

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
            <div style={{ fontSize: 11, color: "#64748b", fontWeight: 700, marginBottom: 4 }}>주도주 등급</div>
            <div style={{ fontSize: 28, fontWeight: 900, color: col }}>{item.jdGrade}</div>
            <div style={{ fontSize: 10, color: "#94a3b8", marginTop: 2 }}>{item.jdNote}</div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 11, color: "#64748b", fontWeight: 700, marginBottom: 4 }}>점수 / 추천비중</div>
            <div style={{ fontSize: 22, fontWeight: 900, color: "#1e293b" }}>{item.jdScore}점</div>
            <div style={{ fontSize: 12, fontWeight: 700, color: col, marginTop: 2 }}>비중 {item.jdWeight}%</div>
          </div>
        </div>

        {/* 4엔진 분해 (주도주 고유) */}
        <div style={{ fontSize: 11, fontWeight: 800, color: "#475569", marginBottom: 8 }}>📊 주도주 4엔진 분해</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 8, marginBottom: 14 }}>
          {[
            { k: "rs", label: "상대강도 RS", max: 30, val: br.rs || 0, col: "#7c3aed", desc: "그날 거래대금/등락률 순위" },
            { k: "leader", label: "대장주 위치", max: 25, val: br.leader || 0, col: "#dc2626", desc: "코스닥 + 거래대금 절대값" },
            { k: "momentum", label: "모멘텀 가속도", max: 25, val: br.momentum || 0, col: "#ea580c", desc: "상한가 근접 + 종가 마감" },
            { k: "supply", label: "수급 강도", max: 20, val: br.supply || 0, col: "#0284c7", desc: "외+기 + 거래대금 가중" },
          ].map(function (e) {
            const pct = (e.val / e.max) * 100;
            return (
              <div key={e.k} style={{ padding: "10px 12px", borderRadius: 8, background: "#f8fafc", border: "1px solid #e2e8f0" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 4 }}>
                  <span style={{ fontSize: 11, fontWeight: 700, color: e.col }}>{e.label}</span>
                  <span style={{ fontSize: 12, fontWeight: 800, color: "#1e293b" }}>{e.val}/{e.max}</span>
                </div>
                <div style={{ height: 5, background: "#e2e8f0", borderRadius: 3, overflow: "hidden" }}>
                  <div style={{ width: pct + "%", height: "100%", background: e.col }} />
                </div>
                <div style={{ fontSize: 9, color: "#94a3b8", marginTop: 3 }}>{e.desc}</div>
              </div>
            );
          })}
        </div>

        {/* 가이드 체크리스트 (주도주 기준) */}
        <div style={{ fontSize: 11, fontWeight: 800, color: "#475569", marginBottom: 8 }}>✅ 주도주 체크</div>
        <div style={{ background: "#f8fafc", borderRadius: 8, padding: "10px 12px", marginBottom: 14 }}>
          {[
            { ok: (item.amount || 0) >= 1000, label: "대장주급 거래대금 (1000억+)", val: (item.amount || 0).toLocaleString() + "억" },
            { ok: (item.change || 0) >= 15, label: "강한 추세 (등락 15%+)", val: (item.change || 0) + "%" },
            { ok: (item.change || 0) >= 25, label: "상한가 근접 (등락 25%+)", val: (item.change || 0) + "%" },
            { ok: (item.wick || 99) <= 1.5, label: "완벽 마감 (윗꼬리 ≤1.5%)", val: (item.wick || 0) + "%" },
            { ok: item.investor === "기+외" || item.investor === "외+기", label: "외+기 동반매수", val: item.investor || "-" },
            { ok: item.market === "코스닥" || item.market === "KO" || item.market === "KQ", label: "코스닥 (소형주 부각)", val: item.market || "-" },
          ].map(function (c, i) {
            return (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "4px 0", borderBottom: i < 5 ? "1px solid #e2e8f0" : "none" }}>
                <span style={{ fontSize: 11, color: c.ok ? "#1e293b" : "#94a3b8" }}>
                  {c.ok ? "✓" : "✗"} {c.label}
                </span>
                <span style={{ fontSize: 10, fontWeight: 700, color: c.ok ? "#dc2626" : "#94a3b8" }}>{c.val}</span>
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
// 주도주 AI 분석 (이미지 → 주도주 고유 4엔진)
// 4엔진: 상대강도(RS) / 대장주위치 / 모멘텀가속도 / 수급강도
// 침착해의 4엔진(수급/시황/차트/재료)과 완전히 다른 축
// ============================================================

const JUDOJU_PROMPT = "당신은 한국 주식 주도주(主導株) 매매의 최고 전문가입니다. 업로드된 차트 이미지(일봉/분봉/수급/섹터순위/뉴스 등)를 종합 분석해서 주도주로서의 가치를 판단하세요.\n\n" +
  "━━━━ 주도주 매매 핵심 철학 ━━━━\n" +
  "주도주 매매의 본질은 \"시장 1등 테마의 대장주\"를 찾는 것. 침착해 종가베팅과 결정적으로 다른 점:\n" +
  "- 침착해: 안정적인 종가 마감 + 매물대 돌파 (보수적, 절대 평가)\n" +
  "- 주도주: 시장 내 상대적 강도 + 대장주 위치 (공격적, 상대 평가)\n" +
  "- 단순 거래량보다 거래대금 (자금 유입 절대값)\n" +
  "- 같은 테마 안에서 가장 먼저 상한가 시도하거나 가장 강하게 버티는 종목 = 대장주\n" +
  "- 후발주는 참고만, 매매는 1등주 중심으로 압축\n" +
  "- 시장이 흔들릴 때도 눌림이 약한 종목이 진짜 주도주\n\n" +
  "━━━━ 주도주 4엔진 스코어링 (100점 만점) ━━━━\n\n" +
  "【1. 상대강도 RS 엔진 (30점) - 그날 시장 내 위치】\n" +
  "- 거래대금 시장 순위 (15점): 시장 전체 1위=15 / 5위 이내=12 / 10위 이내=8 / 20위 이내=5 / 그외=2\n" +
  "- 등락률 시장 순위 (15점): 동일 기준\n" +
  "※ 차트/뉴스에서 \"오늘 거래대금 상위\", \"시장 등락률 1위\", \"테마 1등주\" 같은 단서로 추정\n\n" +
  "【2. 대장주 위치 엔진 (25점) - 시장 분류 + 자금 집중】\n" +
  "- 시장 분류 (10점): 코스닥(소형주 부각 환경)=10 / 코스피=6 / 그외=3\n" +
  "- 거래대금 절대값 (15점): 5000억+=15 / 3000억+=13 / 2000억+=11 / 1000억+=8 / 500억+=5 / 200억+=2\n\n" +
  "【3. 모멘텀 가속도 엔진 (25점) - 추세 강도 + 종가 마감】\n" +
  "- 등락률 강도 (15점): 28%+=15(상한가 직전) / 25%+=14 / 22%+=13 / 18%+=11 / 15%+=9 / 12%+=6 / 10%+=3\n" +
  "  ※ 침착해와 정반대: 강할수록 가산 (주도주는 강한 추세 환영)\n" +
  "- 종가 마감 강도 (10점): 윗꼬리 ≤0.5%=10(완벽) / ≤1.5%=8 / ≤3%=6 / ≤5%=3 / ≤7%=0 / ≤10%=-3 / 그외=-6\n\n" +
  "【4. 수급 강도 엔진 (20점) - 동반매수 + 자금 가중】\n" +
  "- 동반매수 주체 (12점): 외+기 동반=12 / 외인만=8 / 기관만=6 / 둘다 음수=-5\n" +
  "- 거래대금 가중 (8점): 3000억+=8 / 1500억+=6 / 800억+=4 / 400억+=2 / 200억+=1\n\n" +
  "━━━━ 등급 (7단계, 침착해보다 엄격) ━━━━\n" +
  "S+ (88+): 시장 대장주 / S (78+): 1등 후보 / A+ (68+): 주도주 / A (58+): 선도주 / B+ (48+): 관찰 / B (38+): 후발주 / C (<38): 부적격\n\n" +
  "━━━━ 추천 비중 (대장주 집중 투자) ━━━━\n" +
  "S+: 25~30% / S: 18~22% / A+: 12~15% / A: 7~10% / B+: 3~5% / B: 1~2% / C: 0%\n\n" +
  "━━━━ 보조지표 분석 ━━━━\n" +
  "각 지표 positive/neutral/negative/unknown:\n" +
  "- RSI(와일더), 스토캐스틱(레인), 볼린저(존 볼린저), 일목균형표(이치모쿠), Envelope(±이평채널)\n\n" +
  "━━━━ 가격 산출 (주도주는 큰 폭 수익 추구) ━━━━\n" +
  "- entryPrice: 종가 또는 다음날 시초 (현재가 ±1%)\n" +
  "- tp1Price: 진입가 +8~15% (S+ +15~25%, 대장주는 큰 폭 추구)\n" +
  "- tp2Price: 진입가 +20~50% (S/A+급만, B 이하면 null)\n" +
  "- slPrice: 진입가 -5~10% 또는 매물대 하단/지지선. 주도주는 변동성 커서 침착해보다 넓게\n" +
  "차트에서 가격 식별 불가시 모두 null. 숫자만.\n\n" +
  "━━━━ 신뢰도 ━━━━\n" +
  "confidenceScore (0~100): 이미지 품질 + 분석 자신감.\n" +
  "차트/수급/섹터 순위 모두 선명 = 85+, 일부 흐릿 = 60~80, 핵심 부족 = 50 미만.\n\n" +
  "━━━━ 필수 JSON 출력 (다른 설명 금지) ━━━━\n" +
  "{\n" +
  '  "stockName": "종목명",\n' +
  '  "stockCode": "코드",\n' +
  '  "imagesAnalyzed": [ { "type": "분류", "summary": "핵심 데이터" } ],\n' +
  '  "extractedData": { "currentPrice":"", "changeRate":"", "tradingValue":"", "foreignLate":"", "instLate":"", "progLate":"", "threeDaysSupply":"", "sector":"", "sectorRank":"", "chartPattern":"", "breakoutType":"", "maArrangement":"", "volumeSurge":"", "closeType":"", "material":"", "materialType":"" },\n' +
  '  "engines": {\n' +
  '    "rs": { "score": 숫자, "max": 30, "breakdown": {"amountRank":숫자,"changeRank":숫자}, "reasoning":"그날 시장 내 거래대금/등락률 순위 근거" },\n' +
  '    "leader": { "score": 숫자, "max": 25, "breakdown": {"market":숫자,"amount":숫자}, "reasoning":"코스닥/코스피 + 거래대금 절대값 근거" },\n' +
  '    "momentum": { "score": 숫자, "max": 25, "breakdown": {"changeStrength":숫자,"closeStrength":숫자}, "reasoning":"등락률 강도 + 종가 마감 근거" },\n' +
  '    "supply": { "score": 숫자, "max": 20, "breakdown": {"investor":숫자,"weight":숫자}, "reasoning":"외+기 동반매수 + 거래대금 가중 근거" }\n' +
  "  },\n" +
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
  '  "totalScore": 숫자, "grade": "S+|S|A+|A|B+|B|C", "verdict": "시장 대장주|1등 후보|주도주|선도주|관찰|후발주|부적격",\n' +
  '  "recommendedWeight": 숫자(0~30), "nextDayRiseProbability": 숫자(0~100), "confidenceScore": 숫자(0~100),\n' +
  '  "leaderStatus": { "isLeader":true|false, "rank":"1등|2등|3등|후발", "themeRank":"테마 거래대금 순위", "comment":"대장주 판정 근거 2~3문장" },\n' +
  '  "keyReasons": ["근거1","근거2","근거3","근거4","근거5"],\n' +
  '  "risks": ["리스크1","리스크2"],\n' +
  '  "strategy": {"entry":"","exit":"","stopLoss":"","hold":"","entryPrice":숫자|null,"tp1Price":숫자|null,"tp2Price":숫자|null,"slPrice":숫자|null},\n' +
  '  "judojuAnalysis": "주도주 관점 종합 평가 5~7문장 (대장주 여부 + 시장 내 순위 + 진입 타이밍)"\n' +
  "}\n\n" +
  "판독 불가 항목은 '확인불가'로. 가격 식별 불가시 null. JSON 외 텍스트 절대 금지.";

export async function analyzeJudoju(images, stockName) {
  const content = [];
  for (let i = 0; i < images.length; i++) {
    const img = images[i];
    content.push({ type: "image", source: { type: "base64", media_type: img.type || "image/png", data: img.data } });
  }
  const userText = "위 차트/수급/재료 이미지들을 종합 분석해서 주도주 매매 판단을 JSON으로만 응답하세요." + (stockName ? " 종목명: " + stockName : "");
  content.push({ type: "text", text: userText });

  const resp = await fetch("https://sector-api-pink.vercel.app/api/analyze", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 8000,
      system: JUDOJU_PROMPT,
      messages: [{ role: "user", content: content }],
    }),
  });

  if (!resp.ok) throw new Error("주도주 분석 API " + resp.status);
  const data = await resp.json();
  const text = (data.content || []).map(function (c) { return c.text || ""; }).join("");

  // JSON 파싱 (5단계 폴백)
  let parsed = null;
  const cleaned = text.replace(/```json|```/g, "").trim();
  try { parsed = JSON.parse(cleaned); } catch (e1) {
    const m = cleaned.match(/\{[\s\S]*\}/);
    if (m) {
      try { parsed = JSON.parse(m[0]); } catch (e2) {
        const fixed = m[0].replace(/,\s*([}\]])/g, "$1").replace(/'\s*:/g, '":').replace(/:\s*'/g, ': "').replace(/'\s*([,}])/g, '"$1');
        try { parsed = JSON.parse(fixed); } catch (e3) {
          throw new Error("JSON 파싱 실패: " + e3.message);
        }
      }
    } else throw new Error("JSON 형식 응답 없음");
  }
  return parsed;
}

// ============================================================
// 주도주 분석 결과 카드 (ChimchakhaeResultCard와 동일 구조)
// ============================================================
export function JudojuResultCard(props) {
  const res = props.result;
  if (!res) return null;
  const color = gradeColor(res.grade);
  const strat = res.strategy || {};
  const eng = res.engines || {};
  const sz = res.supplyZone;
  const ti = res.technicalIndicators;
  const ed = res.extractedData;
  const ls = res.leaderStatus;

  const engineItems = [
    { key: "rs", label: "상대강도 RS", color: "#7c3aed", data: eng.rs, items: eng.rs ? [
      ["거래대금 순위", eng.rs.breakdown && eng.rs.breakdown.amountRank, 15],
      ["등락률 순위", eng.rs.breakdown && eng.rs.breakdown.changeRank, 15],
    ] : [] },
    { key: "leader", label: "대장주 위치", color: "#dc2626", data: eng.leader, items: eng.leader ? [
      ["시장 분류", eng.leader.breakdown && eng.leader.breakdown.market, 10],
      ["거래대금 절대값", eng.leader.breakdown && eng.leader.breakdown.amount, 15],
    ] : [] },
    { key: "momentum", label: "모멘텀 가속도", color: "#ea580c", data: eng.momentum, items: eng.momentum ? [
      ["등락률 강도", eng.momentum.breakdown && eng.momentum.breakdown.changeStrength, 15],
      ["종가 마감 강도", eng.momentum.breakdown && eng.momentum.breakdown.closeStrength, 10],
    ] : [] },
    { key: "supply", label: "수급 강도", color: "#0284c7", data: eng.supply, items: eng.supply ? [
      ["동반매수 주체", eng.supply.breakdown && eng.supply.breakdown.investor, 12],
      ["거래대금 가중", eng.supply.breakdown && eng.supply.breakdown.weight, 8],
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
          <div style={{ fontSize: 11, color: "rgba(255,255,255,0.85)", fontWeight: 700, marginBottom: 2 }}>📈 주도주 분석</div>
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
        {/* 대장주 위치 (주도주 고유) */}
        {ls && (
          <div style={{ background: ls.isLeader ? "#fef3c7" : "#f1f5f9", border: "1px solid " + (ls.isLeader ? "#fbbf24" : "#cbd5e1"), borderRadius: 10, padding: 12, marginBottom: 14 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
              <span style={{ fontSize: 11, fontWeight: 800, color: ls.isLeader ? "#92400e" : "#475569" }}>👑 대장주 위치</span>
              <span style={{ fontSize: 16, fontWeight: 900, color: ls.isLeader ? "#dc2626" : "#94a3b8" }}>{ls.rank || "-"}</span>
            </div>
            <div style={{ fontSize: 11, color: "#64748b", marginBottom: 4 }}>테마 순위: <strong style={{ color: "#1e293b" }}>{ls.themeRank || "-"}</strong></div>
            {ls.comment && <div style={{ fontSize: 11, color: "#1e293b", lineHeight: 1.5 }}>{ls.comment}</div>}
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

        {/* 4엔진 레이더 (주도주 고유) */}
        {res.engines && eng.rs && eng.leader && eng.momentum && eng.supply && (
          <div style={{ background: "#f8fafc", padding: 14, borderRadius: 10, marginBottom: 14 }}>
            <div style={{ fontSize: 12, fontWeight: 800, color: "#475569", marginBottom: 8, textAlign: "center" }}>🎯 주도주 4엔진 분석</div>
            <JudojuRadarChart engines={res.engines} color={color} />
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

        {/* 4엔진 상세 */}
        {res.engines && (eng.rs || eng.leader || eng.momentum || eng.supply) && (
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

        {/* 주도주 종합 평가 */}
        {res.judojuAnalysis && (
          <div style={{ background: "linear-gradient(135deg, #fef3c7 0%, #fed7aa 100%)", border: "1px solid #fbbf24", borderRadius: 10, padding: 12, fontSize: 12, lineHeight: 1.7, color: "#1e293b" }}>
            <div style={{ fontSize: 11, fontWeight: 800, color: "#92400e", marginBottom: 6 }}>📈 주도주 종합 평가</div>
            {res.judojuAnalysis}
          </div>
        )}
      </div>
    </div>
  );
}
