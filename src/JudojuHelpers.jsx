import React from "react";
import { gradeColor, RadarChart, EXTRACTED_LABELS, fmtPrice, statusColor, statusLabel } from "./ChimchakhaeHelpers.jsx";

// ============================================================
// 주도주(主導株) 분석 헬퍼
// 가이드 문서 기반 4엔진:
//   1. 수급 엔진 (20점): 동반매수 + 거래대금 (대형 자금 유입)
//   2. 테마/시황 엔진 (5점): 시장 1등 테마 강도 (거래대금 기반)
//   3. 차트 엔진 (10점): 등락률 + 윗꼬리 (전고/신고가 신호)
//   4. 재료/대장주 엔진 (5점): 대장주 위치 (코스닥 + 강한등락 + 거래대금)
// 침착해 대비:
//   - 골든존 더 넓음 (12~25%): 주도주는 강한 등락 환영
//   - 거래대금 가중치 더 높음 (200억부터 점수 부여)
//   - 큰 등락 가산 (감점이 아닌 가산)
//   - 대장주 위치 강조 (재료 엔진에 거래대금 비중 높임)
// ============================================================

export function calcJudojuScore(s) {
  let supply = 0, theme = 0, chart = 0, leader = 0;

  // ── 1. 수급 엔진 (20점 만점)
  // 동반매수 (10점)
  if (s.investor === "기+외" || s.investor === "외+기") supply += 10;
  else if (s.investor === "외인" || s.investor === "외만") supply += 7;
  else if (s.investor === "기관" || s.investor === "기만") supply += 5;
  else if (s.investor === "둘다-") supply += 0;

  // 거래대금 (10점) - 가이드: "단순 거래량보다 거래대금" 강조 → 200억부터 점수
  const amt = s.amount || 0;
  if (amt >= 5000) supply += 10;       // 초대형 자금
  else if (amt >= 3000) supply += 9;
  else if (amt >= 2000) supply += 8;
  else if (amt >= 1500) supply += 7;
  else if (amt >= 1000) supply += 6;
  else if (amt >= 700) supply += 5;
  else if (amt >= 500) supply += 4;
  else if (amt >= 300) supply += 3;
  else if (amt >= 200) supply += 2;
  // 200억 미만은 주도주 후보 부적격 (가이드: 거래대금 부족 = 후발주)

  // ── 2. 테마/시황 엔진 (5점 만점) - 시장 1등 테마 강도
  // KIS 응답에 섹터 데이터 없을 시 거래대금으로 강도 추정
  if (amt >= 5000) theme += 5;
  else if (amt >= 2000) theme += 4;
  else if (amt >= 1000) theme += 3;
  else if (amt >= 500) theme += 2;
  else if (amt >= 200) theme += 1;

  // ── 3. 차트 엔진 (10점 만점)
  // 등락률 (5점) - 주도주 골든존 12~25% (강한 추세 환영)
  const ch = s.change || 0;
  if (ch >= 15 && ch <= 25) chart += 5;       // 주도주 골든존 (강한 상승)
  else if (ch >= 12 && ch < 15) chart += 4;   // 진입 단계
  else if (ch > 25 && ch <= 29.5) chart += 4; // 상한가 근처 (강한 신호)
  else if (ch >= 10 && ch < 12) chart += 3;
  else if (ch >= 7 && ch < 10) chart += 2;
  else if (ch >= 5 && ch < 7) chart += 1;
  // 5% 미만은 주도주 후보 약함

  // 윗꼬리 (5점) - 종가 마감 강도
  const wick = s.wick != null ? s.wick : 99;
  if (wick <= 0.5) chart += 5;       // 종가 = 고가 (최강 마감)
  else if (wick <= 1.5) chart += 4;
  else if (wick <= 3) chart += 3;
  else if (wick <= 5) chart += 1;
  else if (wick <= 8) chart -= 2;
  else chart -= 4;                    // 큰 윗꼬리 = 매물 출회

  // ── 4. 재료/대장주 엔진 (5점 만점)
  // 대장주는 보통 코스닥 + 강한등락 + 큰거래대금 동시 충족
  if (s.market === "코스닥" || s.market === "KO" || s.market === "KQ") leader += 1;
  if (amt >= 1000) leader += 2;       // 대장주급 자금
  else if (amt >= 500) leader += 1;
  if (ch >= 15) leader += 1;          // 강한 추세
  if (ch >= 25) leader = Math.min(5, leader + 1); // 상한가 근처는 대장주 강력 후보

  // ── 합산 (40점 만점) → 100점 환산
  const total = supply + theme + chart + leader;
  const score = Math.round((total / 40) * 100);

  // ── 등급 (침착해와 동일 7등급 체계)
  let grade = "C";
  if (score >= 90) grade = "S+";
  else if (score >= 80) grade = "S";
  else if (score >= 70) grade = "A+";
  else if (score >= 60) grade = "A";
  else if (score >= 50) grade = "B+";
  else if (score >= 40) grade = "B";

  // ── 추천 비중 (등급별)
  let weight = 0;
  if (grade === "S+") weight = 100;
  else if (grade === "S") weight = 80;
  else if (grade === "A+") weight = 60;
  else if (grade === "A") weight = 40;
  else if (grade === "B+") weight = 20;
  else if (grade === "B") weight = 10;

  // ── 노트 (대장주 후보 판정)
  let note = "";
  if (grade === "S+" || grade === "S") note = "대장주 강력 후보";
  else if (grade === "A+") note = "주도주 후보";
  else if (grade === "A") note = "선도주 가능";
  else if (grade === "B+") note = "관찰";
  else note = "후보 부적격";

  return {
    score: score,
    grade: grade,
    weight: weight,
    note: note,
    breakdown: {
      supply: supply,
      theme: theme,
      chart: chart,
      leader: leader,
    },
  };
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
      // 주도주 점수 매핑
      const enriched = uniq.map(function (s) {
        const jd = calcJudojuScore(s);
        return Object.assign({}, s, { jdScore: jd.score, jdGrade: jd.grade, jdWeight: jd.weight, jdBreakdown: jd.breakdown, jdNote: jd.note });
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

        {/* 4엔진 분해 */}
        <div style={{ fontSize: 11, fontWeight: 800, color: "#475569", marginBottom: 8 }}>📊 4엔진 분해</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 8, marginBottom: 14 }}>
          {[
            { k: "supply", label: "수급", max: 20, val: br.supply || 0, col: "#7c3aed", desc: "동반매수+거래대금" },
            { k: "theme", label: "테마/시황", max: 5, val: br.theme || 0, col: "#0284c7", desc: "1등 테마 강도" },
            { k: "chart", label: "차트", max: 10, val: br.chart || 0, col: "#dc2626", desc: "등락률+윗꼬리" },
            { k: "leader", label: "재료/대장주", max: 5, val: br.leader || 0, col: "#ca8a04", desc: "대장주 위치" },
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

        {/* 가이드 체크리스트 */}
        <div style={{ fontSize: 11, fontWeight: 800, color: "#475569", marginBottom: 8 }}>✅ 가이드 체크</div>
        <div style={{ background: "#f8fafc", borderRadius: 8, padding: "10px 12px", marginBottom: 14 }}>
          {[
            { ok: (item.amount || 0) >= 500, label: "거래대금 충분 (500억+)", val: (item.amount || 0).toLocaleString() + "억" },
            { ok: (item.change || 0) >= 12 && (item.change || 0) <= 25, label: "주도주 골든존 (12~25%)", val: (item.change || 0) + "%" },
            { ok: (item.wick || 99) <= 3, label: "종가 마감 강함 (윗꼬리≤3%)", val: (item.wick || 0) + "%" },
            { ok: item.investor === "기+외" || item.investor === "외+기", label: "외+기 동반매수", val: item.investor || "-" },
            { ok: item.market === "코스닥" || item.market === "KO" || item.market === "KQ", label: "코스닥 (소형주 부각)", val: item.market || "-" },
          ].map(function (c, i) {
            return (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "4px 0", borderBottom: i < 4 ? "1px solid #e2e8f0" : "none" }}>
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
// 주도주 AI 분석 (이미지 → 4엔진 분해 + 가이드 기반 평가)
// ============================================================

const JUDOJU_PROMPT = "당신은 한국 주식 주도주(主導株) 매매의 최고 전문가입니다. 업로드된 차트 이미지(일봉/분봉/수급/섹터순위/뉴스 등)를 종합 분석해서 주도주로서의 가치를 판단하세요.\n\n" +
  "━━━━ 핵심 철학 (가이드 기반) ━━━━\n" +
  "주도주 매매의 핵심: 시장 1등 테마의 대장주를 찾는 것.\n" +
  "- 단순 거래량보다 거래대금 (시장 관심 자금 유입 척도)\n" +
  "- 등락률보다 거래대금 우선\n" +
  "- 같은 테마 안에서 가장 먼저 상한가 시도하거나 가장 강하게 버티는 종목 = 대장주\n" +
  "- 후발주는 참고만, 매매는 1등주 중심으로 압축\n" +
  "- 시장이 흔들릴 때도 눌림이 약한 종목이 진짜 주도주\n\n" +
  "━━━━ 스코어링 규칙 (100점 만점) ━━━━\n\n" +
  "【1. 수급 엔진 (35점) - 최우선】\n" +
  "- 외+기+프 동반매수 (15점): 3주체=15 / 2주체=10 / 1주체=5 / 음수=-5\n" +
  "- 장 막판 매수세 유지 (10점): 14:30 이후 강함=10 / 보통=5 / 약함=0\n" +
  "- 거래대금 (10점): 3000억↑=10 / 1500억↑=8 / 1000억↑=6 / 500억↑=4 / 300억↑=2\n\n" +
  "【2. 테마/시황 엔진 (25점)】\n" +
  "- 시장 1등 테마 여부 (12점): 거래대금 1위 테마=12 / 2~3위=8 / 4~5위=4 / 그외=0\n" +
  "- 테마 지속성 (8점): 정책+장기=8 / 며칠 연속=5 / 오늘만=2\n" +
  "- 테마 내 1등주 위치 (5점): 1등=5 / 2~3등=3 / 후발주=1\n\n" +
  "【3. 차트 엔진 (25점)】\n" +
  "- 매물대 돌파 / 신고가 / 전고점 (10점): 신고가 돌파=10 / 전고 돌파=8 / 매물대 돌파=6 / 박스권=3 / 막힘=0\n" +
  "- 일봉 패턴 (8점): 장대양봉 + 종가 마감=8 / 윗꼬리 짧음=5 / 윗꼬리 긴=2 / 음봉=0\n" +
  "- 분봉 흐름 (7점): 저점 상승 + 종가 강함=7 / 보통=4 / 오후 흘러내림=0\n\n" +
  "【4. 재료 엔진 (15점)】\n" +
  "- 재료 강도 (10점): 정책=10 / 단독뉴스=9 / 실적+계약=8 / 테마=5 / 1회성=2\n" +
  "- 재료 지속성 (5점): 며칠 갈만함=5 / 하루짜리=2\n\n" +
  "━━━━ 등급 및 비중 (7단계) ━━━━\n" +
  "S+ (90~100): 25~30% / S (80~89): 20~25% / A+ (70~79): 14~18% / A (60~69): 10~13% / B+ (50~59): 5~8% / B (40~49): 2~4% / C (<40): 0%\n\n" +
  "━━━━ 보조지표 분석 ━━━━\n" +
  "각 지표 positive/neutral/negative/unknown:\n" +
  "- RSI(와일더), 스토캐스틱(레인), 볼린저(존 볼린저), 일목균형표(이치모쿠), Envelope\n\n" +
  "━━━━ 가격 산출 ━━━━\n" +
  "- entryPrice: 종가 또는 다음날 시초 (현재가 ±1%)\n" +
  "- tp1Price: 진입가 +5~10% (S+ +10~15%, 매물대/저항 위까지)\n" +
  "- tp2Price: 진입가 +15~30% (S/A+급만, B 이하면 null)\n" +
  "- slPrice: 진입가 -3~7% 또는 매물대 하단/지지선. 등급 낮을수록 타이트\n" +
  "차트에서 가격 식별 불가시 모두 null. 숫자만.\n\n" +
  "━━━━ 신뢰도 ━━━━\n" +
  "confidenceScore (0~100): 이미지 품질 + 분석 자신감.\n" +
  "차트/수급/재료 모두 선명 = 85+, 일부 흐릿 = 60~80, 핵심 부족 = 50 미만.\n\n" +
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
  '  "totalScore": 숫자, "grade": "S+|S|A+|A|B+|B|C", "verdict": "주도주 강력추천|조건부 매수|관망|진입 보류",\n' +
  '  "recommendedWeight": 숫자(0~30), "nextDayRiseProbability": 숫자(0~100), "confidenceScore": 숫자(0~100),\n' +
  '  "leaderStatus": { "isLeader":true|false, "rank":"1등|2등|3등|후발", "themeRank":"테마 거래대금 순위", "comment":"대장주 판정 근거 2~3문장" },\n' +
  '  "keyReasons": ["근거1","근거2","근거3","근거4","근거5"],\n' +
  '  "risks": ["리스크1","리스크2"],\n' +
  '  "strategy": {"entry":"","exit":"","stopLoss":"","hold":"","entryPrice":숫자|null,"tp1Price":숫자|null,"tp2Price":숫자|null,"slPrice":숫자|null},\n' +
  '  "judojuAnalysis": "주도주 관점 종합 평가 5~7문장 (대장주 여부 + 테마 강도 + 진입 타이밍)"\n' +
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
    { key: "supply", label: "수급", color: "#7c3aed", data: eng.supply, items: eng.supply ? [
      ["외+기+프 동반매수", eng.supply.breakdown && eng.supply.breakdown.lateHours, 15],
      ["장 막판 매수세", eng.supply.breakdown && eng.supply.breakdown.consistency, 10],
      ["거래대금", eng.supply.breakdown && eng.supply.breakdown.volume, 10],
    ] : [] },
    { key: "market", label: "테마/시황", color: "#0284c7", data: eng.market, items: eng.market ? [
      ["1등 테마 여부", eng.market.breakdown && eng.market.breakdown.lead, 12],
      ["테마 지속성", eng.market.breakdown && eng.market.breakdown.duration, 8],
      ["테마 내 1등주", eng.market.breakdown && eng.market.breakdown.strength, 5],
    ] : [] },
    { key: "chart", label: "차트", color: "#dc2626", data: eng.chart, items: eng.chart ? [
      ["매물대/신고가", eng.chart.breakdown && eng.chart.breakdown.breakout, 10],
      ["일봉 패턴", eng.chart.breakdown && (eng.chart.breakdown.ma + (eng.chart.breakdown.volume || 0)), 13],
      ["종가 마감", eng.chart.breakdown && eng.chart.breakdown.close, 7],
    ] : [] },
    { key: "material", label: "재료", color: "#ca8a04", data: eng.material, items: eng.material ? [
      ["재료 강도", eng.material.breakdown && eng.material.breakdown.type, 10],
      ["재료 지속성", eng.material.breakdown && eng.material.breakdown.nextDay, 5],
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

        {/* 4엔진 레이더 */}
        {res.engines && eng.supply && (
          <div style={{ background: "#f8fafc", padding: 14, borderRadius: 10, marginBottom: 14 }}>
            <div style={{ fontSize: 12, fontWeight: 800, color: "#475569", marginBottom: 8, textAlign: "center" }}>🎯 4엔진 분석</div>
            <RadarChart engines={res.engines} color={color} />
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
