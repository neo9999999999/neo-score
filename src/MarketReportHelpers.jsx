import { useState, useEffect, useMemo, useCallback, useRef } from "react";

// 마켓 리포트 데이터 소스 (우선순위: 같은 오리진 → GitHub raw main)
const REPORT_SOURCES = [
  () => "/market-report.json?_=" + Date.now(),
  () => "https://raw.githubusercontent.com/neo9999999999/neo-score/main/public/market-report.json?_=" + Date.now(),
];

function useTheme(theme) {
  const dark = theme === "dark";
  return {
    dark,
    bg: dark ? "#0d1117" : "#f7f8fa",
    card: dark ? "#161b22" : "#ffffff",
    cardAlt: dark ? "#1c2230" : "#f1f4f9",
    border: dark ? "#30363d" : "#e5e8eb",
    text: dark ? "#e6edf3" : "#191f28",
    sub: dark ? "#9aa5b1" : "#4e5968",
    hint: dark ? "#6e7681" : "#8b95a1",
  };
}

// 한국식 색상: 상승/＋ 빨강, 하락/− 파랑
const UP_C = "#e02424";
const DN_C = "#1f6feb";
// 포인트 색: 노랑(보라 대체)
const ACCENT = "#eab308";
const ON_ACCENT = "#1a1500";
const DIR = {
  up: { c: UP_C, arrow: "▲" },
  down: { c: DN_C, arrow: "▼" },
  flat: { c: "#8b95a1", arrow: "—" },
};
const TONE = {
  pos: { c: UP_C, label: "긍정" },
  neg: { c: DN_C, label: "부담" },
  neutral: { c: "#d97706", label: "중립" },
};
const SENT = {
  bullish: { c: UP_C, bg: "rgba(224,36,36,0.14)", label: "강세 우호", emoji: "📈" },
  neutral: { c: "#d97706", bg: "rgba(217,119,6,0.14)", label: "중립·혼조", emoji: "⚖️" },
  bearish: { c: DN_C, bg: "rgba(31,111,235,0.14)", label: "약세 경계", emoji: "📉" },
};
const BIAS = {
  up: { c: UP_C, label: "상승 기대", emoji: "🔺" },
  down: { c: DN_C, label: "약세", emoji: "🔻" },
  neutral: { c: "#d97706", label: "중립", emoji: "▪️" },
};
const IMP = {
  high: { c: "#ef4444", label: "★★★" },
  mid: { c: "#d97706", label: "★★" },
  low: { c: "#8b95a1", label: "★" },
};

const navBtn = (T) => ({ border: "1px solid " + T.border, background: T.card, color: T.text, borderRadius: 9, padding: "8px 14px", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" });

function Indicator({ ind, T }) {
  const d = DIR[ind.dir] || DIR.flat;
  return (
    <div style={{ background: T.cardAlt, border: "1px solid " + T.border, borderRadius: 12, padding: "10px 12px" }}>
      <div style={{ fontSize: 12, color: T.hint, fontWeight: 600, marginBottom: 4 }}>{ind.label}</div>
      <div style={{ fontSize: 17, fontWeight: 800, color: T.text, letterSpacing: "-0.3px" }}>{ind.value ?? "—"}</div>
      <div style={{ fontSize: 12, fontWeight: 700, color: d.c, marginTop: 2 }}>
        {d.arrow} {ind.change ?? "—"}{ind.changePct && ind.changePct !== "—" ? " (" + ind.changePct + ")" : ""}
      </div>
    </div>
  );
}

function ChainStep({ step, T, last }) {
  const tone = TONE[step.tone] || TONE.neutral;
  return (
    <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
      <div style={{ flex: "0 0 auto", display: "flex", flexDirection: "column", alignItems: "center" }}>
        <span style={{ width: 10, height: 10, borderRadius: 5, background: tone.c, marginTop: 5 }} />
        {!last && <span style={{ width: 2, flex: 1, minHeight: 26, background: T.border, marginTop: 2 }} />}
      </div>
      <div style={{ flex: 1, paddingBottom: last ? 0 : 14 }}>
        <div style={{ fontSize: 14, fontWeight: 800, color: T.text }}>
          {step.from} <span style={{ color: T.hint }}>→</span> {step.to}
          <span style={{ marginLeft: 8, fontSize: 11, fontWeight: 700, color: tone.c, background: tone.c + "22", padding: "1px 7px", borderRadius: 6 }}>{tone.label}</span>
        </div>
        {step.via && <div style={{ fontSize: 12.5, color: T.sub, marginTop: 3 }}>{step.via}</div>}
        {step.note && <div style={{ fontSize: 12.5, color: T.hint, marginTop: 3, lineHeight: 1.55 }}>{step.note}</div>}
      </div>
    </div>
  );
}

function SectorCard({ s, T }) {
  const [open, setOpen] = useState(false);
  const b = BIAS[s.bias] || BIAS.neutral;
  return (
    <div style={{ background: T.card, border: "1px solid " + T.border, borderRadius: 14, overflow: "hidden" }}>
      <button onClick={() => setOpen(o => !o)} style={{ width: "100%", textAlign: "left", border: "none", background: "transparent", cursor: "pointer", padding: "13px 14px", display: "flex", alignItems: "center", gap: 10 }}>
        <span style={{ fontSize: 18 }}>{b.emoji}</span>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 15, fontWeight: 800, color: T.text }}>{s.name}</div>
          <div style={{ fontSize: 12, color: b.c, fontWeight: 700, marginTop: 1 }}>{b.label}</div>
        </div>
        <span style={{ fontSize: 12, color: T.hint }}>{open ? "▲" : "▼"}</span>
      </button>
      {open && (
        <div style={{ padding: "0 14px 14px" }}>
          {s.reason && <div style={{ fontSize: 13, color: T.sub, lineHeight: 1.6, marginBottom: 10 }}>{s.reason}</div>}
          <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
            {(s.stocks || []).map((st, i) => (
              <div key={i} style={{ background: T.cardAlt, borderRadius: 10, padding: "9px 11px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                  <span style={{ fontSize: 14, fontWeight: 800, color: T.text }}>{st.name}</span>
                  {st.code && <span style={{ fontSize: 11, color: T.hint, fontWeight: 600 }}>{st.code}</span>}
                </div>
                {st.reason && <div style={{ fontSize: 12.5, color: T.sub, marginTop: 3, lineHeight: 1.5 }}>{st.reason}</div>}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// 카드뉴스 — 손가락 스와이프 슬라이드 캐러셀
function CardNews({ cards, T }) {
  const [idx, setIdx] = useState(0);
  const [drag, setDrag] = useState(0);
  const startX = useRef(0);
  const dx = useRef(0);
  const dragging = useRef(false);
  const n = (cards && cards.length) || 0;
  const palette = [ACCENT, "#2563eb", "#0d9488", "#d97706", "#db2777", "#dc2626"];
  if (!n) return null;

  const go = (i) => setIdx(Math.max(0, Math.min(n - 1, i)));
  const onStart = (x) => { startX.current = x; dx.current = 0; dragging.current = true; };
  const onMove = (x) => { if (!dragging.current) return; dx.current = x - startX.current; setDrag(dx.current); };
  const onEnd = () => {
    if (!dragging.current) return;
    dragging.current = false;
    if (dx.current < -45 && idx < n - 1) go(idx + 1);
    else if (dx.current > 45 && idx > 0) go(idx - 1);
    setDrag(0); dx.current = 0;
  };

  return (
    <div>
      <div
        style={{ overflow: "hidden", borderRadius: 18, touchAction: "pan-y" }}
        onTouchStart={(e) => onStart(e.touches[0].clientX)}
        onTouchMove={(e) => onMove(e.touches[0].clientX)}
        onTouchEnd={onEnd}
        onMouseDown={(e) => onStart(e.clientX)}
        onMouseMove={(e) => dragging.current && onMove(e.clientX)}
        onMouseUp={onEnd}
        onMouseLeave={onEnd}
      >
        <div style={{ display: "flex", transform: `translateX(calc(${-idx * 100}% + ${drag}px))`, transition: drag ? "none" : "transform .3s cubic-bezier(.22,.61,.36,1)" }}>
          {cards.map((card, i) => {
            const accent = palette[i % palette.length];
            return (
              <div key={i} style={{ flex: "0 0 100%", minWidth: "100%", boxSizing: "border-box", padding: 1 }}>
                <div style={{ position: "relative", borderRadius: 18, background: "linear-gradient(140deg," + accent + "f2," + accent + "b0)", padding: "26px 22px 24px", minHeight: 200, color: "#fff", boxShadow: "0 8px 24px " + accent + "40", userSelect: "none" }}>
                  <div style={{ fontSize: 46, marginBottom: 10, lineHeight: 1 }}>{card.emoji || "📰"}</div>
                  <div style={{ fontSize: 21, fontWeight: 900, letterSpacing: "-0.4px", marginBottom: 10, lineHeight: 1.3, textShadow: "0 1px 2px rgba(0,0,0,0.15)" }}>{card.title}</div>
                  <div style={{ fontSize: 15, lineHeight: 1.7, fontWeight: 500, textShadow: "0 1px 2px rgba(0,0,0,0.1)" }}>{card.body}</div>
                  <div style={{ position: "absolute", top: 16, right: 18, fontSize: 13, fontWeight: 800, background: "rgba(255,255,255,0.22)", padding: "3px 10px", borderRadius: 20 }}>{i + 1} / {n}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 12 }}>
        <button onClick={() => go(idx - 1)} disabled={idx === 0} style={{ ...navBtn(T), opacity: idx === 0 ? 0.4 : 1 }}>‹</button>
        <div style={{ flex: 1, display: "flex", justifyContent: "center", gap: 6 }}>
          {cards.map((_, i) => (
            <span key={i} onClick={() => go(i)} style={{ cursor: "pointer", width: i === idx ? 24 : 8, height: 8, borderRadius: 4, background: i === idx ? palette[idx % palette.length] : T.border, transition: "all .2s" }} />
          ))}
        </div>
        <button onClick={() => go(idx + 1)} disabled={idx === n - 1} style={{ ...navBtn(T), opacity: idx === n - 1 ? 0.4 : 1 }}>›</button>
      </div>
      <div style={{ textAlign: "center", fontSize: 11.5, color: T.hint, marginTop: 6 }}>← 좌우로 밀어서 넘기기 →</div>
    </div>
  );
}

function Section({ title, sub, children, T }) {
  return (
    <div style={{ marginTop: 22 }}>
      <div style={{ fontSize: 15, fontWeight: 900, color: T.text, letterSpacing: "-0.3px" }}>{title}</div>
      {sub ? <div style={{ fontSize: 12, color: T.hint, marginTop: 2, marginBottom: 10 }}>{sub}</div> : <div style={{ height: 10 }} />}
      {children}
    </div>
  );
}

function IssueRow({ it, T }) {
  return (
    <div style={{ background: T.card, border: "1px solid " + T.border, borderRadius: 12, padding: "11px 13px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 3, flexWrap: "wrap" }}>
        {it.category && <span style={{ fontSize: 11, fontWeight: 800, color: "#fff", background: T.hint, padding: "2px 7px", borderRadius: 6 }}>{it.category}</span>}
        <span style={{ fontSize: 14, fontWeight: 800, color: T.text }}>{it.title}</span>
      </div>
      {it.detail && <div style={{ fontSize: 13, lineHeight: 1.6, color: T.sub }}>{it.detail}</div>}
    </div>
  );
}

// 리포트 본문 (오늘/히스토리 상세 공용)
function ReportBody({ report, T }) {
  const [showDetail, setShowDetail] = useState(false);
  const sent = SENT[report.sentiment] || SENT.neutral;
  const detailParas = (report.detail || "").split("\n\n").filter(Boolean);
  const todayIssues = report.todayIssues || report.issues || [];

  return (
    <div style={{ paddingBottom: 20 }}>
      {/* 헤더 */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
        <div>
          <div style={{ fontSize: 12, color: T.hint, fontWeight: 600 }}>{report.date} · 데일리 마켓 리포트</div>
          <h2 style={{ fontSize: 19, fontWeight: 900, color: T.text, margin: "3px 0 0", letterSpacing: "-0.5px", lineHeight: 1.25 }}>{report.title || "거시 연결 기반 증시 브리핑"}</h2>
        </div>
        <span style={{ fontSize: 12.5, fontWeight: 800, color: sent.c, background: sent.bg, padding: "5px 11px", borderRadius: 20 }}>{sent.emoji} {sent.label}</span>
      </div>
      {report.source === "seed" && (
        <div style={{ marginTop: 10, fontSize: 12, color: T.hint, background: T.cardAlt, border: "1px dashed " + T.border, borderRadius: 10, padding: "8px 11px" }}>
          ⓘ 예시 데이터입니다. 매일 새벽 5시 30분(KST) 실시간 시장 분석으로 자동 갱신됩니다.
        </div>
      )}
      {report.source === "oos" && (
        <div style={{ marginTop: 10, fontSize: 12, color: T.hint, background: T.cardAlt, border: "1px solid " + T.border, borderRadius: 10, padding: "8px 11px" }}>
          🧪 OOS(과거 시점 재현) 리포트 — 그날 시점의 거시지표만으로 작성된 룰 기반 분석입니다.
          {report.oos && report.oos.kospiRet != null && (
            <span> · 실제 코스피 {report.oos.kospiRet >= 0 ? "+" : ""}{report.oos.kospiRet}% · 방향 {report.oos.hit === true ? "✅ 적중" : report.oos.hit === false ? "❌ 빗나감" : "—"}</span>
          )}
        </div>
      )}

      {/* 카드뉴스 — 맨 위 */}
      {report.cards && report.cards.length > 0 && (
        <div style={{ marginTop: 14 }}>
          <CardNews cards={report.cards} T={T} />
        </div>
      )}

      {/* 요약본 (터치 시 상세) */}
      <div style={{ marginTop: 18, background: "linear-gradient(135deg," + sent.c + "1f, transparent)", border: "1px solid " + T.border, borderRadius: 16, padding: 16 }}>
        <div style={{ fontSize: 13, fontWeight: 800, color: sent.c, marginBottom: 7 }}>📋 오늘의 요약</div>
        <div style={{ fontSize: 14.5, lineHeight: 1.7, color: T.text, fontWeight: 500 }}>{report.summary}</div>
        <button onClick={() => setShowDetail(s => !s)} style={{ marginTop: 12, width: "100%", border: "none", background: sent.c, color: "#fff", borderRadius: 10, padding: "10px 0", fontSize: 13.5, fontWeight: 800, cursor: "pointer", fontFamily: "inherit" }}>
          {showDetail ? "상세 분석 접기 ▲" : "상세 분석 보기 ▼"}
        </button>
        {showDetail && (
          <div style={{ marginTop: 14, paddingTop: 14, borderTop: "1px solid " + T.border }}>
            {detailParas.map((p, i) => (
              <p key={i} style={{ fontSize: 13.5, lineHeight: 1.75, color: T.sub, margin: "0 0 10px" }}>{p}</p>
            ))}
          </div>
        )}
      </div>

      {/* 핵심 지표 */}
      {report.indicators && report.indicators.length > 0 && (
        <Section title="핵심 거시 지표" sub="간밤 글로벌 마감 기준" T={T}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(105px, 1fr))", gap: 8 }}>
            {report.indicators.map((ind, i) => <Indicator key={i} ind={ind} T={T} />)}
          </div>
        </Section>
      )}

      {/* 연결관계 */}
      {report.chain && report.chain.length > 0 && (
        <Section title="🔗 거시 연결고리" sub="유가 · 달러 · 금리 → 나스닥 → 국내증시" T={T}>
          <div style={{ background: T.card, border: "1px solid " + T.border, borderRadius: 14, padding: "16px 16px 4px" }}>
            {report.chain.map((step, i) => <ChainStep key={i} step={step} T={T} last={i === report.chain.length - 1} />)}
          </div>
        </Section>
      )}

      {/* 나스닥 반응 */}
      {report.nasdaq && (
        <Section title="🇺🇸 나스닥 시장 반응" T={T}>
          <div style={{ background: T.card, border: "1px solid " + T.border, borderRadius: 14, padding: 15 }}>
            <div style={{ fontSize: 14.5, fontWeight: 800, color: T.text, marginBottom: 6 }}>{report.nasdaq.verdict}</div>
            <div style={{ fontSize: 13.5, lineHeight: 1.7, color: T.sub }}>{report.nasdaq.detail}</div>
          </div>
        </Section>
      )}

      {/* 국내 전망 */}
      {report.domestic && (
        <Section title="🇰🇷 국내증시 예상" T={T}>
          <div style={{ background: T.card, border: "1px solid " + T.border, borderRadius: 14, padding: 15 }}>
            <div style={{ display: "flex", gap: 8, marginBottom: 10, flexWrap: "wrap" }}>
              <span style={{ fontSize: 12.5, fontWeight: 700, color: T.text, background: T.cardAlt, padding: "5px 11px", borderRadius: 8 }}>코스피 · {report.domestic.kospiBias}</span>
              <span style={{ fontSize: 12.5, fontWeight: 700, color: T.text, background: T.cardAlt, padding: "5px 11px", borderRadius: 8 }}>코스닥 · {report.domestic.kosdaqBias}</span>
            </div>
            <div style={{ fontSize: 13.5, lineHeight: 1.7, color: T.sub }}>{report.domestic.detail}</div>
            {report.domestic.fxNote && <div style={{ fontSize: 13, lineHeight: 1.6, color: T.hint, marginTop: 8 }}>💱 {report.domestic.fxNote}</div>}
          </div>
        </Section>
      )}

      {/* 수혜 섹터 · 종목 */}
      {report.sectors && report.sectors.length > 0 && (
        <Section title="🎯 상승 예상 섹터 · 수혜 종목" sub="섹터를 눌러 수혜 종목 확인" T={T}>
          <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
            {report.sectors.map((s, i) => <SectorCard key={i} s={s} T={T} />)}
          </div>
        </Section>
      )}

      {/* 글로벌·전쟁 핫이슈 */}
      {report.globalIssues && report.globalIssues.length > 0 && (
        <Section title="🌍 글로벌·전쟁 핫이슈" sub="국제 정세 · 무역 · 지정학 리스크" T={T}>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {report.globalIssues.map((it, i) => <IssueRow key={i} it={it} T={T} />)}
          </div>
        </Section>
      )}

      {/* 이번주 경제 일정 */}
      {report.weeklyCalendar && report.weeklyCalendar.length > 0 && (
        <Section title="🗓️ 이번주 경제 일정" sub="일자별 주요 이벤트" T={T}>
          <div style={{ background: T.card, border: "1px solid " + T.border, borderRadius: 14, overflow: "hidden" }}>
            {report.weeklyCalendar.map((d, i) => {
              const imp = IMP[d.importance] || IMP.mid;
              return (
                <div key={i} style={{ display: "flex", gap: 11, padding: "11px 13px", borderTop: i ? "1px solid " + T.border : "none" }}>
                  <div style={{ flex: "0 0 58px", textAlign: "center" }}>
                    <div style={{ fontSize: 13, fontWeight: 800, color: T.text }}>{d.date}</div>
                    {d.day && <div style={{ fontSize: 11, color: T.hint, marginTop: 1 }}>{d.day}</div>}
                  </div>
                  <div style={{ flex: 1, borderLeft: "1px solid " + T.border, paddingLeft: 11 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
                      <span style={{ fontSize: 13.5, fontWeight: 800, color: T.text }}>{d.title}</span>
                      <span style={{ fontSize: 10.5, color: imp.c, fontWeight: 800 }}>{imp.label}</span>
                    </div>
                    {d.detail && <div style={{ fontSize: 12.5, color: T.sub, marginTop: 2, lineHeight: 1.55 }}>{d.detail}</div>}
                  </div>
                </div>
              );
            })}
          </div>
        </Section>
      )}

      {/* 당일 주요 이슈 */}
      {todayIssues.length > 0 && (
        <Section title="📌 당일 주요 이슈" T={T}>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {todayIssues.map((it, i) => <IssueRow key={i} it={it} T={T} />)}
          </div>
        </Section>
      )}

      <div style={{ marginTop: 24, textAlign: "center", fontSize: 11.5, color: T.hint }}>
        생성 시각: {report.generatedAt || report.date} · 본 리포트는 투자 참고용이며 투자 책임은 본인에게 있습니다.
      </div>
    </div>
  );
}

// 히스토리 인덱스 / 개별 리포트 소스
const HIST_SOURCES = [
  () => "/market-report-history.json?_=" + Date.now(),
  () => "https://raw.githubusercontent.com/neo9999999999/neo-score/main/public/market-report-history.json?_=" + Date.now(),
];
const reportByDate = (d) => [
  "/reports/" + d + ".json?_=" + Date.now(),
  "https://raw.githubusercontent.com/neo9999999999/neo-score/main/public/reports/" + d + ".json?_=" + Date.now(),
];

async function fetchFirst(urls) {
  for (const u of urls) {
    try { const r = await fetch(u); if (r.ok) { const j = await r.json(); if (j) return j; } } catch (e) { /* next */ }
  }
  return null;
}

function AnalysisCard({ a, T }) {
  if (!a) return null;
  const cell = (label, val, c) => (
    <div style={{ background: T.cardAlt, borderRadius: 10, padding: "10px 12px", flex: "1 1 90px" }}>
      <div style={{ fontSize: 11, color: T.hint, fontWeight: 600 }}>{label}</div>
      <div style={{ fontSize: 17, fontWeight: 800, color: c || T.text, marginTop: 2 }}>{val}</div>
    </div>
  );
  const pct = v => v == null ? "—" : (v >= 0 ? "+" : "") + v + "%";
  return (
    <div style={{ background: T.card, border: "1px solid " + T.border, borderRadius: 14, padding: 15, marginBottom: 14 }}>
      <div style={{ fontSize: 14, fontWeight: 900, color: T.text, marginBottom: 3 }}>📊 OOS 백테스트 분석</div>
      <div style={{ fontSize: 12, color: T.hint, marginBottom: 11 }}>{a.range?.start} ~ {a.range?.end} · 거래일 {a.totalDays}일</div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
        {cell("방향 적중률", a.hitRate == null ? "—" : a.hitRate + "%", a.hitRate >= 50 ? UP_C : DN_C)}
        {cell("평가일수", (a.directionHits ?? 0) + "/" + (a.evaluated ?? 0))}
        {cell("강세 예측", a.bullishDays + "일")}
        {cell("약세 예측", a.bearishDays + "일")}
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 8 }}>
        {cell("강세일 코스피 평균", pct(a.avgKospiOnBullish), a.avgKospiOnBullish >= 0 ? UP_C : DN_C)}
        {cell("약세일 코스피 평균", pct(a.avgKospiOnBearish), a.avgKospiOnBearish >= 0 ? UP_C : DN_C)}
        {cell("중립일 코스피 평균", pct(a.avgKospiOnNeutral))}
      </div>
      {a.note && <div style={{ fontSize: 11.5, color: T.hint, marginTop: 10, lineHeight: 1.55 }}>{a.note}</div>}
    </div>
  );
}

function HistoryView({ T, onOpen }) {
  const [hist, setHist] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => { (async () => { setHist(await fetchFirst(HIST_SOURCES.map(f => f()))); setLoading(false); })(); }, []);

  if (loading) return <div style={{ padding: 40, textAlign: "center", color: T.hint }}>히스토리 불러오는 중…</div>;
  if (!hist || !hist.reports || !hist.reports.length) return (
    <div style={{ padding: 24, textAlign: "center", color: T.sub, fontSize: 13.5, lineHeight: 1.7 }}>
      아직 누적된 히스토리가 없습니다.<br />백필 워크플로(Daily Market Report Backfill)를 실행하면 과거 일자별 OOS 리포트가 채워집니다.
    </div>
  );

  return (
    <div style={{ paddingBottom: 20 }}>
      <AnalysisCard a={hist.analysis} T={T} />
      <div style={{ fontSize: 13, fontWeight: 800, color: T.text, marginBottom: 8 }}>일자별 리포트 ({hist.reports.length}건)</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
        {hist.reports.map((r) => {
          const s = SENT[r.sentiment] || SENT.neutral;
          const oos = r.oos || {};
          return (
            <button key={r.date} onClick={() => onOpen(r.date)} style={{ textAlign: "left", border: "1px solid " + T.border, background: T.card, borderRadius: 12, padding: "11px 13px", cursor: "pointer", fontFamily: "inherit", display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ flex: "0 0 66px" }}>
                <div style={{ fontSize: 13, fontWeight: 800, color: T.text }}>{r.date.slice(5)}</div>
                <div style={{ fontSize: 10.5, color: T.hint }}>{r.date.slice(0, 4)}</div>
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <span style={{ fontSize: 11.5, fontWeight: 800, color: s.c, background: s.bg, padding: "2px 8px", borderRadius: 12 }}>{s.emoji} {s.label}</span>
                <div style={{ fontSize: 12, color: T.sub, marginTop: 4, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{(r.topSectors || []).map(x => x.name).join(" · ") || r.kospiBias}</div>
              </div>
              <div style={{ flex: "0 0 auto", textAlign: "right" }}>
                {oos.kospiRet != null && <div style={{ fontSize: 13, fontWeight: 800, color: oos.kospiRet >= 0 ? UP_C : DN_C }}>{oos.kospiRet >= 0 ? "+" : ""}{oos.kospiRet}%</div>}
                {oos.hit != null && <div style={{ fontSize: 12 }}>{oos.hit ? "✅" : "❌"}</div>}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

const AFT_SOURCES = [
  () => "/afternoon-report.json?_=" + Date.now(),
  () => "https://raw.githubusercontent.com/neo9999999999/neo-score/main/public/afternoon-report.json?_=" + Date.now(),
];
const AFT_HIST_SOURCES = [
  () => "/afternoon-history.json?_=" + Date.now(),
  () => "https://raw.githubusercontent.com/neo9999999999/neo-score/main/public/afternoon-history.json?_=" + Date.now(),
];

const wonFmt = (n) => Math.round(n).toLocaleString("ko-KR") + "원";
function CandidateRow({ c, T, alloc, stratAvg }) {
  const up = c.changePct >= 0;
  const qty = (alloc && c.price) ? Math.floor(alloc / c.price) : null;
  const invested = (qty && c.price) ? qty * c.price : null;
  const expProfit = (invested && stratAvg != null) ? invested * stratAvg / 100 : null;
  return (
    <div style={{ background: T.card, border: "1px solid " + T.border, borderRadius: 12, padding: "11px 12px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
        <span style={{ flex: "0 0 26px", height: 26, borderRadius: 7, background: c.rank <= 3 ? ACCENT : T.cardAlt, color: c.rank <= 3 ? ON_ACCENT : T.sub, fontSize: 13, fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center" }}>{c.rank}</span>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
            <span style={{ fontSize: 14.5, fontWeight: 800, color: T.text }}>{c.name}</span>
            {c.target3 && <span style={{ fontSize: 10.5, fontWeight: 800, color: "#fff", background: "#dc2626", padding: "1px 6px", borderRadius: 6 }}>🔥 3%↑ 유력</span>}
            <span style={{ fontSize: 11, color: T.hint, fontWeight: 600 }}>{c.code} · {c.market}</span>
          </div>
        </div>
        <div style={{ flex: "0 0 auto", textAlign: "right" }}>
          {c.p3High != null
            ? <div style={{ fontSize: 15, fontWeight: 800, color: ACCENT }}>고가 3%도달 {c.p3High}%</div>
            : c.p3 != null
              ? <div style={{ fontSize: 15, fontWeight: 800, color: ACCENT }}>3%↑ {c.p3}%</div>
              : <div style={{ fontSize: 14, fontWeight: 800, color: up ? UP_C : DN_C }}>{up ? "+" : ""}{c.changePct}%</div>}
          <div style={{ fontSize: 11, color: T.hint }}>{c.p3 != null ? "종가 3%마감 " + c.p3 + "%" : "점수 " + c.score}</div>
        </div>
      </div>
      <div style={{ display: "flex", gap: 6, marginTop: 8, flexWrap: "wrap" }}>
        {c.nearHighPct != null && <span style={{ fontSize: 11, fontWeight: 800, color: "#fff", background: c.breakout ? UP_C : "#0d9488", padding: "3px 8px", borderRadius: 7 }}>{c.breakout ? "🚀 신고가 돌파" : "신고가 " + c.nearHighPct + "%"}</span>}
        <span style={{ ...chip(T), color: "#16a34a" }}>정배열</span>
        {c.supplyLabel && <span style={c.dongban ? { fontSize: 11, fontWeight: 800, color: "#fff", background: "#16a34a", padding: "3px 8px", borderRadius: 7 } : chip(T)}>{c.dongban ? "🟢 " : ""}{c.supplyLabel}</span>}
        <span style={chip(T)}>당일 {up ? "+" : ""}{c.changePct}%</span>
        <span style={chip(T)}>거래대금 {c.valueText}</span>
        <span style={chip(T)}>거래량 {c.volSurge}배</span>
        <span style={chip(T)}>종가강도 {Math.round((c.rangePos || 0) * 100)}%</span>
      </div>
      {qty != null && (
        <div style={{ marginTop: 8, padding: "8px 10px", background: "rgba(234,179,8,0.16)", border: "1px solid " + T.border, borderRadius: 9, display: "flex", flexWrap: "wrap", gap: 10, fontSize: 12.5 }}>
          <span style={{ color: T.sub }}>현재가 <b style={{ color: T.text }}>{c.price.toLocaleString("ko-KR")}원</b></span>
          <span style={{ color: T.sub }}>매수 <b style={{ color: ACCENT }}>{qty.toLocaleString("ko-KR")}주</b></span>
          <span style={{ color: T.sub }}>투입 <b style={{ color: T.text }}>{wonFmt(invested)}</b></span>
          {expProfit != null && <span style={{ color: T.sub }}>기대수익 <b style={{ color: expProfit >= 0 ? UP_C : DN_C }}>{expProfit >= 0 ? "+" : ""}{wonFmt(expProfit)}</b></span>}
        </div>
      )}
      {c.reason && <div style={{ fontSize: 12.5, color: T.sub, marginTop: 7, lineHeight: 1.55 }}>{c.reason}</div>}
    </div>
  );
}
const chip = (T) => ({ fontSize: 11, fontWeight: 700, color: T.sub, background: T.cardAlt, padding: "3px 8px", borderRadius: 7 });

function AfternoonAnalysis({ a, T }) {
  if (!a) return null;
  const cell = (label, val, c) => (
    <div style={{ background: T.cardAlt, borderRadius: 10, padding: "10px 12px", flex: "1 1 90px" }}>
      <div style={{ fontSize: 11, color: T.hint, fontWeight: 600 }}>{label}</div>
      <div style={{ fontSize: 16, fontWeight: 800, color: c || T.text, marginTop: 2 }}>{val}</div>
    </div>
  );
  const pct = v => v == null ? "—" : (v >= 0 ? "+" : "") + v + "%";
  return (
    <div style={{ background: T.card, border: "1px solid " + T.border, borderRadius: 14, padding: 15, marginBottom: 14 }}>
      <div style={{ fontSize: 14, fontWeight: 900, color: T.text, marginBottom: 3 }}>🧪 익일예측 OOS 백테스트</div>
      <div style={{ fontSize: 12, color: T.hint, marginBottom: 11 }}>{a.range?.start} ~ {a.range?.end} · {a.tradedDays}일 · 선정 {a.totalPicks}건</div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
        {cell("익일 고가 3% 도달", a.hit3HighRate == null ? "—" : a.hit3HighRate + "%", (a.hit3HighRate || 0) >= 45 ? UP_C : "#d97706")}
        {cell("익일 종가 3% 마감", a.hit3Rate == null ? "—" : a.hit3Rate + "%", (a.hit3Rate || 0) >= 30 ? UP_C : "#d97706")}
        {cell("후보 평균 익일종가", pct(a.avgNextRet), (a.avgNextRet || 0) >= 0 ? UP_C : DN_C)}
        {cell("시장 평균(baseline)", pct(a.baselineAvgNextRet))}
      </div>
      {(a.hit5HighRate != null || a.upRate != null) && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 8 }}>
          {cell("익일 고가 5% 도달", a.hit5HighRate == null ? "—" : a.hit5HighRate + "%")}
          {cell("익일 상승(종가>0%)", a.upRate == null ? "—" : a.upRate + "%")}
          {cell("초과수익 edge", pct(a.edge), (a.edge || 0) >= 0 ? UP_C : DN_C)}
        </div>
      )}
      {a.note && <div style={{ fontSize: 11.5, color: T.hint, marginTop: 10, lineHeight: 1.55 }}>{a.note}</div>}
    </div>
  );
}

function MonthCard({ ym, days, T, perStock, recOpt, defaultOpen }) {
  const [open, setOpen] = useState(!!defaultOpen);
  const picks = days.flatMap(r => (r.picks || [])).filter(p => p.nextRet != null);
  const nP = picks.length;
  const hit3H = picks.filter(p => p.nextHigh != null ? p.nextHigh >= 3 : p.nextRet >= 3).length;
  const avg = nP ? picks.reduce((s, p) => s + p.nextRet, 0) / nP : 0;
  const profit = (perStock && nP) ? picks.reduce((s, p) => s + perStock * simExitJS({ o: p.nextOpen, h: p.nextHigh, l: p.nextLow, c: p.nextRet }, recOpt) / 100, 0) : null;
  return (
    <div style={{ background: T.card, border: "1px solid " + T.border, borderRadius: 12, overflow: "hidden" }}>
      <button onClick={() => setOpen(o => !o)} style={{ width: "100%", textAlign: "left", border: "none", background: "transparent", cursor: "pointer", padding: "11px 13px", display: "flex", alignItems: "center", gap: 10, fontFamily: "inherit" }}>
        <div style={{ flex: "0 0 70px", fontSize: 14, fontWeight: 800, color: T.text }}>{ym}</div>
        <div style={{ flex: 1, fontSize: 12, color: T.sub }}>{days.length}일 · {nP}건 · 3%↑ {nP ? (100 * hit3H / nP).toFixed(0) : 0}%</div>
        <div style={{ flex: "0 0 auto", textAlign: "right" }}>
          {profit != null
            ? <div style={{ fontSize: 13, fontWeight: 800, color: profit >= 0 ? UP_C : DN_C }}>{profit >= 0 ? "+" : ""}{wonFmt(profit)}</div>
            : <div style={{ fontSize: 13, fontWeight: 800, color: avg >= 0 ? UP_C : DN_C }}>평균 {avg >= 0 ? "+" : ""}{avg.toFixed(2)}%</div>}
        </div>
        <span style={{ flex: "0 0 auto", fontSize: 11, color: T.hint }}>{open ? "▲" : "▼"}</span>
      </button>
      {open && (
        <div style={{ padding: "0 10px 10px", display: "flex", flexDirection: "column", gap: 6 }}>
          {days.map(r => <AfternoonDayRow key={r.date} r={r} T={T} perStock={perStock} recOpt={recOpt} />)}
        </div>
      )}
    </div>
  );
}

function aggStats(days, perStock, recOpt) {
  const picks = days.flatMap(r => (r.picks || [])).filter(p => p.nextRet != null);
  const n = picks.length;
  const hit3H = picks.filter(p => p.nextHigh != null ? p.nextHigh >= 3 : p.nextRet >= 3).length;
  const avg = n ? picks.reduce((s, p) => s + p.nextRet, 0) / n : 0;
  const profit = (perStock && n) ? picks.reduce((s, p) => s + perStock * simExitJS({ o: p.nextOpen, h: p.nextHigh, l: p.nextLow, c: p.nextRet }, recOpt) / 100, 0) : null;
  return { n, hit3H, avg, profit };
}

function YearCard({ year, days, T, perStock, recOpt, sort, defaultOpen }) {
  const [open, setOpen] = useState(!!defaultOpen);
  const st = aggStats(days, perStock, recOpt);
  const groups = {};
  for (const r of days) { const ym = r.date.slice(0, 7); (groups[ym] = groups[ym] || []).push(r); }
  const yms = Object.keys(groups).sort((a, b) => sort === "desc" ? b.localeCompare(a) : a.localeCompare(b));
  for (const ym of yms) groups[ym].sort((a, b) => sort === "desc" ? b.date.localeCompare(a.date) : a.date.localeCompare(b.date));
  return (
    <div style={{ background: T.card, border: "1px solid " + T.border, borderRadius: 12, overflow: "hidden" }}>
      <button onClick={() => setOpen(o => !o)} style={{ width: "100%", textAlign: "left", border: "none", background: open ? T.cardAlt : "transparent", cursor: "pointer", padding: "13px 14px", display: "flex", alignItems: "center", gap: 10, fontFamily: "inherit" }}>
        <div style={{ flex: "0 0 54px", fontSize: 16, fontWeight: 900, color: T.text }}>{year}</div>
        <div style={{ flex: 1, fontSize: 12, color: T.sub }}>{yms.length}개월 · {st.n}건 · 3%↑ {st.n ? (100 * st.hit3H / st.n).toFixed(0) : 0}%</div>
        <div style={{ flex: "0 0 auto", textAlign: "right" }}>
          {st.profit != null
            ? <div style={{ fontSize: 14, fontWeight: 800, color: st.profit >= 0 ? UP_C : DN_C }}>{st.profit >= 0 ? "+" : ""}{wonFmt(st.profit)}</div>
            : <div style={{ fontSize: 14, fontWeight: 800, color: st.avg >= 0 ? UP_C : DN_C }}>평균 {st.avg >= 0 ? "+" : ""}{st.avg.toFixed(2)}%</div>}
        </div>
        <span style={{ flex: "0 0 auto", fontSize: 12, color: T.hint }}>{open ? "▲" : "▼"}</span>
      </button>
      {open && (
        <div style={{ padding: "8px", display: "flex", flexDirection: "column", gap: 6 }}>
          {yms.map(ym => <MonthCard key={ym} ym={ym} days={groups[ym]} T={T} perStock={perStock} recOpt={recOpt} defaultOpen={false} />)}
        </div>
      )}
    </div>
  );
}

function YearHistory({ reports, T, perStock, recOpt }) {
  const [sort, setSort] = useState("desc");
  const groups = {};
  for (const r of reports) { const y = r.date.slice(0, 4); (groups[y] = groups[y] || []).push(r); }
  const years = Object.keys(groups).sort((a, b) => sort === "desc" ? b.localeCompare(a) : a.localeCompare(b));
  const totalPicks = reports.reduce((s, r) => s + (r.picks ? r.picks.length : 0), 0);
  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
        <button onClick={() => setSort(s => s === "desc" ? "asc" : "desc")} style={{ ...chip(T), cursor: "pointer", border: "1px solid " + T.border }}>
          {sort === "desc" ? "최신순 ↓" : "오래된순 ↑"}
        </button>
        <span style={{ fontSize: 11.5, color: T.hint }}>{years.length}개 연도 · {totalPicks}건 · 연도→월→일 펼쳐보기</span>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {years.map((y, i) => <YearCard key={y} year={y} days={groups[y]} T={T} perStock={perStock} recOpt={recOpt} sort={sort} defaultOpen={i === 0} />)}
      </div>
    </div>
  );
}

function AfternoonDayRow({ r, T, perStock, recOpt }) {
  const [open, setOpen] = useState(false);
  const hasOutcome = r.dayHitRate != null;
  const picks = r.picks || [];
  const dayProfit = (perStock && picks.some(p => p.nextRet != null))
    ? picks.filter(p => p.nextRet != null).reduce((s, p) => s + perStock * simExitJS({ o: p.nextOpen, h: p.nextHigh, l: p.nextLow, c: p.nextRet }, recOpt) / 100, 0)
    : null;
  return (
    <div style={{ background: T.card, border: "1px solid " + T.border, borderRadius: 12, overflow: "hidden" }}>
      <button onClick={() => setOpen(o => !o)} style={{ width: "100%", textAlign: "left", border: "none", background: "transparent", cursor: "pointer", padding: "11px 13px", display: "flex", alignItems: "center", gap: 10, fontFamily: "inherit" }}>
        <div style={{ flex: "0 0 64px" }}>
          <div style={{ fontSize: 13, fontWeight: 800, color: T.text }}>{r.date.slice(5)}</div>
          <div style={{ fontSize: 10.5, color: T.hint }}>{r.date.slice(0, 4)}</div>
        </div>
        <div style={{ flex: 1, fontSize: 12, color: T.sub }}>
          {picks.slice(0, 3).map(p => p.name).join(" · ")}{picks.length > 3 ? " 외" : ""}
        </div>
        <div style={{ flex: "0 0 auto", textAlign: "right" }}>
          {hasOutcome ? (
            <>
              <div style={{ fontSize: 13, fontWeight: 800, color: r.dayHitRate >= 30 ? UP_C : "#d97706" }}>3%↑ {r.dayHitRate}%</div>
              {dayProfit != null
                ? <div style={{ fontSize: 11.5, fontWeight: 700, color: dayProfit >= 0 ? UP_C : DN_C }}>{dayProfit >= 0 ? "+" : ""}{wonFmt(dayProfit)}</div>
                : <div style={{ fontSize: 11, color: r.avgNextRet >= 0 ? UP_C : DN_C }}>익일 {r.avgNextRet >= 0 ? "+" : ""}{r.avgNextRet}%</div>}
            </>
          ) : <div style={{ fontSize: 11, color: T.hint }}>결과 대기</div>}
        </div>
        <span style={{ flex: "0 0 auto", fontSize: 11, color: T.hint }}>{open ? "▲" : "▼"}</span>
      </button>
      {open && (
        <div style={{ padding: "0 11px 12px" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {picks.map((p, i) => {
              const done = (p.hit3High != null ? p.hit3High : (p.nextHigh != null ? p.nextHigh >= 3 : p.nextRet >= 3));
              return (
                <div key={i} style={{ background: T.cardAlt, borderRadius: 9, padding: "9px 11px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                    <span style={{ flex: "0 0 20px", fontSize: 11, fontWeight: 800, color: T.hint }}>{i + 1}</span>
                    <span style={{ flex: 1, fontSize: 13.5, fontWeight: 800, color: T.text }}>{p.name} <span style={{ fontSize: 10.5, color: T.hint, fontWeight: 500 }}>{p.code}{p.market ? " · " + p.market : ""}</span></span>
                    {(p.nextHigh != null || p.nextRet != null) && <span style={{ fontSize: 13 }} title="익일 고가 +3% 도달">{done ? "✅" : "❌"}</span>}
                  </div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginTop: 5, marginLeft: 27, fontSize: 12 }}>
                    {p.nearHigh != null && <span style={{ color: T.hint }}>신고가 <b style={{ color: p.breakout ? UP_C : T.text }}>{p.breakout ? "돌파" : p.nearHigh + "%"}</b></span>}
                    {p.score != null && <span style={{ color: T.hint }}>점수 <b style={{ color: T.text }}>{p.score}</b></span>}
                    <span style={{ color: T.hint }}>당일 <b style={{ color: p.changePct >= 0 ? UP_C : DN_C }}>{p.changePct >= 0 ? "+" : ""}{p.changePct}%</b></span>
                    {p.nextHigh != null && <span style={{ color: T.hint }}>익일고가 <b style={{ color: ACCENT }}>{p.nextHigh >= 0 ? "+" : ""}{p.nextHigh}%</b></span>}
                    {p.nextRet != null && <span style={{ color: T.hint }}>익일종가 <b style={{ color: p.nextRet >= 0 ? UP_C : DN_C }}>{p.nextRet >= 0 ? "+" : ""}{p.nextRet}%</b></span>}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

function HistoryBrowser({ reports, T, perStock, recOpt }) {
  const allYears = useMemo(() => [...new Set(reports.map(r => r.date.slice(0, 4)))].sort((a, b) => b.localeCompare(a)), [reports]);
  const [years, setYears] = useState(() => new Set(allYears.slice(0, 1)));
  const [months, setMonths] = useState(() => new Set());
  const [sort, setSort] = useState("desc");
  const [limit, setLimit] = useState(60);
  const toggle = (set, v, setter) => { const n = new Set(set); n.has(v) ? n.delete(v) : n.add(v); setter(n); setLimit(60); };
  const filtered = reports.filter(r => {
    const y = r.date.slice(0, 4), m = r.date.slice(5, 7);
    if (years.size && !years.has(y)) return false;
    if (months.size && !months.has(m)) return false;
    return true;
  }).sort((a, b) => sort === "desc" ? b.date.localeCompare(a.date) : a.date.localeCompare(b.date));
  const shown = filtered.slice(0, limit);
  const onBtn = (active) => active
    ? { fontSize: 11.5, fontWeight: 800, color: ON_ACCENT, background: ACCENT, padding: "5px 10px", borderRadius: 8, cursor: "pointer", border: "1px solid " + ACCENT }
    : { fontSize: 11.5, fontWeight: 600, color: T.sub, background: T.cardAlt, padding: "5px 10px", borderRadius: 8, cursor: "pointer", border: "1px solid " + T.border };
  return (
    <div>
      <div style={{ fontSize: 11, fontWeight: 700, color: T.hint, marginBottom: 5 }}>연도 (켜기/끄기)</div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginBottom: 9 }}>
        {allYears.map(y => <button key={y} onClick={() => toggle(years, y, setYears)} style={onBtn(years.has(y))}>{y}</button>)}
      </div>
      <div style={{ fontSize: 11, fontWeight: 700, color: T.hint, marginBottom: 5 }}>월 (켜기/끄기)</div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginBottom: 9 }}>
        {Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, "0")).map(m => <button key={m} onClick={() => toggle(months, m, setMonths)} style={onBtn(months.has(m))}>{(+m)}월</button>)}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
        <button onClick={() => setSort(s => s === "desc" ? "asc" : "desc")} style={{ ...chip(T), cursor: "pointer", border: "1px solid " + T.border }}>{sort === "desc" ? "최신순 ↓" : "오래된순 ↑"}</button>
        {(years.size > 0 || months.size > 0) && <button onClick={() => { setYears(new Set()); setMonths(new Set()); setLimit(60); }} style={{ ...chip(T), cursor: "pointer", border: "1px solid " + T.border }}>전체 보기</button>}
        <span style={{ fontSize: 11.5, color: T.hint }}>{filtered.length}일 표시</span>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
        {shown.map(r => <AfternoonDayRow key={r.date} r={r} T={T} perStock={perStock} recOpt={recOpt} />)}
      </div>
      {filtered.length > shown.length && <button onClick={() => setLimit(l => l + 60)} style={{ ...navBtn(T), marginTop: 10, width: "100%" }}>더보기 (+{filtered.length - shown.length}일)</button>}
    </div>
  );
}

// 청산 시뮬레이터 (백엔드 simExit와 동일 로직) — 익일 %수익 반환
function simExitJS(nb, opt) {
  const { tp1Lvl = 5, tp1Frac = 0.5, trailGap = 5, floorLvl = 10, trailFrom = 15, stop = null, gapStop = null } = opt || {};
  const { o, h, l, c } = nb;
  if (gapStop != null && o != null && o <= gapStop) return o;
  if (stop != null) { if (o != null && o <= stop) return o; if (l != null && l <= stop) return stop; }
  if (h == null || c == null) return c ?? 0;
  if (h < tp1Lvl) return c;
  let runner;
  if (h < floorLvl) runner = c;
  else if (h < trailFrom) runner = (c < floorLvl ? floorLvl : c);
  else runner = (c < h - trailGap ? h - trailGap : c);
  return tp1Frac * tp1Lvl + (1 - tp1Frac) * runner;
}

// OOS 백테스트에 종목당 투자금 적용 → 총 투입·수익금·수익률
function OosInvestment({ hist, perStock, T }) {
  const a = hist && hist.analysis;
  if (!a || !hist.reports) return null;
  const recOpt = (a.strategies && a.recommendedStrategy ? (a.strategies.find(s => s.name === a.recommendedStrategy) || {}).opt : null) || { tp1Lvl: 5, tp1Frac: 0.5, stop: null };
  const picks = hist.reports.flatMap(r => (r.picks || [])).filter(p => p.nextRet != null);
  if (!picks.length) return null;
  const rets = picks.map(p => simExitJS({ o: p.nextOpen, h: p.nextHigh, l: p.nextLow, c: p.nextRet }, recOpt));
  const n = rets.length;
  const avgRet = rets.reduce((s, r) => s + r, 0) / n;
  const wins = rets.filter(r => r > 0).length;
  if (!perStock) {
    return (
      <div style={{ marginTop: 12, fontSize: 12.5, color: T.hint, lineHeight: 1.6 }}>
        ⓘ 위 "💰 종목당 투자금"에 금액을 넣으면, 이 백테스트 {n}건에 종목당 그 금액을 투자했을 때의 <b>누적 수익금</b>이 계산됩니다.
      </div>
    );
  }
  const totalInvested = perStock * n;
  const totalProfit = rets.reduce((s, r) => s + perStock * r / 100, 0);
  const totalRet = totalProfit / totalInvested * 100;
  const cell = (label, val, c) => (
    <div style={{ background: T.cardAlt, borderRadius: 10, padding: "10px 12px", flex: "1 1 100px" }}>
      <div style={{ fontSize: 11, color: T.hint, fontWeight: 600 }}>{label}</div>
      <div style={{ fontSize: 15, fontWeight: 800, color: c || T.text, marginTop: 2 }}>{val}</div>
    </div>
  );
  return (
    <div style={{ marginTop: 12, paddingTop: 12, borderTop: "1px dashed " + T.border }}>
      <div style={{ fontSize: 12.5, fontWeight: 800, color: T.text, marginBottom: 8 }}>💰 종목당 {wonFmt(perStock)} 투자 시 (추천 전략, {n}건)</div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
        {cell("총 투입(누적)", wonFmt(totalInvested))}
        {cell("총 수익금", (totalProfit >= 0 ? "+" : "") + wonFmt(totalProfit), totalProfit >= 0 ? UP_C : DN_C)}
        {cell("평균 수익률/건", (avgRet >= 0 ? "+" : "") + avgRet.toFixed(2) + "%", avgRet >= 0 ? UP_C : DN_C)}
        {cell("승률", (100 * wins / n).toFixed(1) + "%")}
      </div>
      <div style={{ fontSize: 11, color: T.hint, marginTop: 8, lineHeight: 1.5 }}>※ 거래마다 종목당 동일 금액 투자 가정(중복기간 무시). 백테스트 추정치이며 실제 체결·세금·슬리피지 제외.</div>
    </div>
  );
}

function OosSplitCard({ oos, oosReal, oosAdv, T }) {
  if (!oos || (!oos.test && !(oos.byYear && oos.byYear.length))) return null;
  const c = oos.chosen || {};
  const seg = (title, d, base) => (
    <div style={{ flex: "1 1 150px", background: T.cardAlt, borderRadius: 10, padding: "11px 12px" }}>
      <div style={{ fontSize: 12, fontWeight: 800, color: T.text, marginBottom: 5 }}>{title}</div>
      <div style={{ fontSize: 12.5, color: T.sub, lineHeight: 1.7 }}>
        평균 익일 <b style={{ color: (d.avg || 0) >= 0 ? UP_C : DN_C }}>{(d.avg || 0) >= 0 ? "+" : ""}{d.avg}%</b><br />
        고가 3%도달 <b style={{ color: T.text }}>{d.hit3HighRate}%</b> · {d.n}건
        {base != null && <><br />시장평균 {base >= 0 ? "+" : ""}{base}% · edge <b style={{ color: (d.edge || 0) >= 0 ? UP_C : DN_C }}>{(d.edge || 0) >= 0 ? "+" : ""}{d.edge}%</b></>}
      </div>
    </div>
  );
  return (
    <div style={{ marginTop: 14, background: T.card, border: "2px solid " + ACCENT, borderRadius: 14, padding: 15 }}>
      <div style={{ fontSize: 14, fontWeight: 900, color: T.text, marginBottom: 3 }}>🔬 진짜 OOS (학습/검증 분리)</div>
      <div style={{ fontSize: 11.5, color: T.hint, marginBottom: 11, lineHeight: 1.5 }}>
        모든 연도를 OOS로 검증: 각 구간은 그 구간을 빼고 고른 파라미터로만 평가합니다. 생존편향·체결비용 제외.
      </div>
      {oos.test && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {seg("학습 " + (oos.trainRange?.start) + "~" + oos.split, oos.train)}
          {seg("✅ 검증 " + oos.split + "~ (미사용)", oos.test, oos.test.baselineAvgNextRet)}
        </div>
      )}
      {oos.foldB && oos.foldB.test && (
        <div style={{ marginTop: 8 }}>{seg("✅ 검증구간 2 (2018~2022, 반대로 분리)", oos.foldB.test, oos.foldB.test.baselineAvgNextRet)}</div>
      )}
      {oos.byYear && oos.byYear.length > 0 && (
        <div style={{ marginTop: 12, paddingTop: 12, borderTop: "1px dashed " + T.border }}>
          <div style={{ fontSize: 12.5, fontWeight: 800, color: T.text, marginBottom: 7 }}>연도별 OOS (각 연도 = 그 해를 뺀 나머지로 파라미터 선택 후 검증)</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            {oos.byYear.slice().sort((a, b) => b.year.localeCompare(a.year)).map(y => (
              <div key={y.year} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, background: T.cardAlt, borderRadius: 8, padding: "7px 10px" }}>
                <span style={{ flex: "0 0 42px", fontWeight: 800, color: T.text }}>{y.year}</span>
                <span style={{ flex: "0 0 auto", fontWeight: 800, color: (y.avg || 0) >= 0 ? UP_C : DN_C }}>평균 {(y.avg || 0) >= 0 ? "+" : ""}{y.avg}%</span>
                <span style={{ color: T.sub }}>고가3%도달 {y.hit3HighRate}%</span>
                <span style={{ color: T.hint }}>edge {(y.edge || 0) >= 0 ? "+" : ""}{y.edge}%</span>
                <span style={{ marginLeft: "auto", color: T.hint, fontSize: 11 }}>{y.n}건</span>
              </div>
            ))}
          </div>
        </div>
      )}
      {oosReal && oosReal.byYear && oosReal.byYear.length > 0 && (
        <div style={{ marginTop: 12, paddingTop: 12, borderTop: "2px solid " + UP_C }}>
          <div style={{ fontSize: 12.5, fontWeight: 800, color: T.text, marginBottom: 3 }}>💵 현실 반영 OOS (비용 {oosReal.cost}% 차감 · 종가청산 · +10~20%만)</div>
          <div style={{ fontSize: 11, color: T.hint, marginBottom: 8, lineHeight: 1.5 }}>{oosReal.note}</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            {oosReal.byYear.slice().sort((a, b) => b.year.localeCompare(a.year)).map(y => (
              <div key={y.year} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, background: T.cardAlt, borderRadius: 8, padding: "7px 10px" }}>
                <span style={{ flex: "0 0 42px", fontWeight: 800, color: T.text }}>{y.year}</span>
                <span style={{ flex: "0 0 auto", fontWeight: 800, color: (y.avg || 0) >= 0 ? UP_C : DN_C }}>순수익 {(y.avg || 0) >= 0 ? "+" : ""}{y.avg}%</span>
                <span style={{ color: T.sub }}>고가3%도달 {y.hit3HighRate}%</span>
                <span style={{ marginLeft: "auto", color: T.hint, fontSize: 11 }}>{y.n}건</span>
              </div>
            ))}
          </div>
        </div>
      )}
      {oosAdv && (oosAdv.gridBest || (oosAdv.byYear && oosAdv.byYear.length)) && (
        <div style={{ marginTop: 12, paddingTop: 12, borderTop: "2px solid " + ACCENT }}>
          <div style={{ fontSize: 12.5, fontWeight: 800, color: T.text, marginBottom: 3 }}>🛠️ 완전탐색: 익절(고가)/손절(종가) 최적 조합 (상한가 제외 · 비용 {oosAdv.cost}% 차감 · 최대 {oosAdv.holdDays}일)</div>
          <div style={{ fontSize: 11, color: T.hint, marginBottom: 8, lineHeight: 1.5 }}>{oosAdv.note}</div>
          {oosAdv.gridBest && (
            <div style={{ background: "rgba(234,179,8,0.16)", border: "1px solid " + ACCENT, borderRadius: 10, padding: "10px 12px", marginBottom: 8 }}>
              <div style={{ fontSize: 12, fontWeight: 800, color: T.text }}>전 구간 최고 조합 (인샘플·과최적)</div>
              <div style={{ fontSize: 13, marginTop: 3 }}>
                <b style={{ color: T.text }}>익절 +{oosAdv.gridBest.tp}% / 손절 {oosAdv.gridBest.sl == null ? "무손절" : "−" + oosAdv.gridBest.sl + "%"}</b>
                <span style={{ color: (oosAdv.gridBest.avg || 0) >= 0 ? UP_C : DN_C, fontWeight: 800, marginLeft: 8 }}>평균 {(oosAdv.gridBest.avg) >= 0 ? "+" : ""}{oosAdv.gridBest.avg}%/건</span>
                <span style={{ color: T.sub, marginLeft: 8 }}>승률 {oosAdv.gridBest.winRate}% · {oosAdv.gridBest.n}건</span>
              </div>
            </div>
          )}
          <div style={{ fontSize: 11.5, fontWeight: 700, color: T.text, margin: "6px 0 4px" }}>연도별 OOS (그 해 빼고 최적화 → 그 해 검증)</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            {(oosAdv.byYear || []).slice().sort((a, b) => b.year.localeCompare(a.year)).map(y => (
              <div key={y.year} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, background: T.cardAlt, borderRadius: 8, padding: "7px 10px", flexWrap: "wrap" }}>
                <span style={{ flex: "0 0 42px", fontWeight: 800, color: T.text }}>{y.year}</span>
                <span style={{ flex: "0 0 auto", fontWeight: 800, color: (y.avg || 0) >= 0 ? UP_C : DN_C }}>순 {(y.avg || 0) >= 0 ? "+" : ""}{y.avg}%</span>
                <span style={{ color: T.sub }}>승률 {y.winRate}%</span>
                <span style={{ color: T.hint, fontSize: 11 }}>익절+{y.chosen.tp}/손절{y.chosen.sl == null ? "무" : "−" + y.chosen.sl}</span>
                <span style={{ marginLeft: "auto", color: T.hint, fontSize: 11 }}>{y.n}건</span>
              </div>
            ))}
          </div>
        </div>
      )}
      <div style={{ fontSize: 11.5, color: T.hint, marginTop: 10, lineHeight: 1.55 }}>
        검증 평균이 학습보다 많이 낮으면 그만큼 과최적화였다는 뜻입니다. 생존편향(상폐 제외)은 여전히 낙관 요인.
      </div>
    </div>
  );
}

function SwingCard({ swing, T }) {
  if (!swing || (!swing.gridBest && !(swing.byYear && swing.byYear.length))) return null;
  const g = swing.gridBest;
  const yrs = (swing.byYear || []);
  const pos = yrs.filter(y => (y.avg || 0) > 0).length;
  return (
    <div style={{ marginTop: 14, background: T.card, border: "2px solid " + UP_C, borderRadius: 14, padding: 15 }}>
      <div style={{ fontSize: 14, fontWeight: 900, color: T.text, marginBottom: 3 }}>🪂 눌림목 스윙 OOS (다른 진입 · 완전탐색)</div>
      <div style={{ fontSize: 11, color: T.hint, marginBottom: 9, lineHeight: 1.5 }}>{swing.note}</div>
      {g && (
        <div style={{ background: T.cardAlt, borderRadius: 10, padding: "10px 12px", marginBottom: 8 }}>
          <div style={{ fontSize: 12, fontWeight: 800, color: T.text }}>전 구간 최고 (인샘플·과최적)</div>
          <div style={{ fontSize: 13, marginTop: 3 }}>
            <b style={{ color: T.text }}>익절 +{g.tp}% / 손절 {g.sl == null ? "무손절" : "−" + g.sl + "%"}</b>
            <span style={{ color: (g.avg || 0) >= 0 ? UP_C : DN_C, fontWeight: 800, marginLeft: 8 }}>평균 {(g.avg) >= 0 ? "+" : ""}{g.avg}%/건</span>
            <span style={{ color: T.sub, marginLeft: 8 }}>승률 {g.winRate}% · {g.n}건</span>
          </div>
        </div>
      )}
      <div style={{ fontSize: 11.5, fontWeight: 700, color: T.text, margin: "6px 0 4px" }}>연도별 OOS · 수익 {pos}/{yrs.length}년</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        {yrs.slice().sort((a, b) => b.year.localeCompare(a.year)).map(y => (
          <div key={y.year} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, background: T.cardAlt, borderRadius: 8, padding: "7px 10px", flexWrap: "wrap" }}>
            <span style={{ flex: "0 0 42px", fontWeight: 800, color: T.text }}>{y.year}</span>
            <span style={{ flex: "0 0 auto", fontWeight: 800, color: (y.avg || 0) >= 0 ? UP_C : DN_C }}>순 {(y.avg || 0) >= 0 ? "+" : ""}{y.avg}%</span>
            <span style={{ color: T.sub }}>승률 {y.winRate}%</span>
            <span style={{ color: T.hint, fontSize: 11 }}>익절+{y.chosen.tp}/손절{y.chosen.sl == null ? "무" : "−" + y.chosen.sl}</span>
            <span style={{ marginLeft: "auto", color: T.hint, fontSize: 11 }}>{y.n}건</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function StrategyTable({ a, T }) {
  if (!a || !a.strategies || !a.strategies.length) return null;
  return (
    <div style={{ marginTop: 14, background: T.card, border: "1px solid " + T.border, borderRadius: 14, padding: 15 }}>
      <div style={{ fontSize: 14, fontWeight: 900, color: T.text, marginBottom: 3 }}>🎯 매도 전략 백테스트 (손절 포함)</div>
      <div style={{ fontSize: 11.5, color: T.hint, marginBottom: 11 }}>진입=당일 종가, 익일 청산 · {a.totalPicks}건 · 추천 전략 강조 (보수적: 손절 우선 가정)</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        {a.strategies.slice().sort((x, y) => y.avg - x.avg).map((s, i) => {
          const rec = s.name === a.recommendedStrategy;
          return (
            <div key={i} style={{ background: rec ? "rgba(234,179,8,0.16)" : T.cardAlt, border: rec ? "1px solid " + ACCENT : "1px solid transparent", borderRadius: 10, padding: "9px 11px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
                {rec && <span style={{ fontSize: 10.5, fontWeight: 800, color: ON_ACCENT, background: ACCENT, padding: "1px 6px", borderRadius: 5 }}>추천</span>}
                <span style={{ fontSize: 12.5, fontWeight: 700, color: T.text }}>{s.name}</span>
              </div>
              <div style={{ display: "flex", gap: 12, marginTop: 5, fontSize: 12 }}>
                <span style={{ color: s.avg >= 0 ? UP_C : DN_C, fontWeight: 800 }}>평균 {s.avg >= 0 ? "+" : ""}{s.avg}%</span>
                <span style={{ color: T.sub }}>승률 {s.winRate}%</span>
                <span style={{ color: T.sub }}>손실 {s.lossRate}%</span>
                <span style={{ color: DN_C }}>최저 {s.worst}%</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function AfternoonView({ T }) {
  const [rep, setRep] = useState(null);
  const [hist, setHist] = useState(null);
  const [loading, setLoading] = useState(true);
  const [capital, setCapital] = useState(() => { try { return localStorage.getItem("neo_capital") || ""; } catch { return ""; } });
  useEffect(() => { try { localStorage.setItem("neo_capital", capital); } catch {} }, [capital]);
  useEffect(() => { (async () => {
    const [r, h] = await Promise.all([fetchFirst(AFT_SOURCES.map(f => f())), fetchFirst(AFT_HIST_SOURCES.map(f => f()))]);
    setRep(r); setHist(h); setLoading(false);
  })(); }, []);
  const capNum = Math.max(0, +(String(capital).replace(/[^0-9]/g, "")) || 0);

  if (loading) return <div style={{ padding: 40, textAlign: "center", color: T.hint }}>익일예측 불러오는 중…</div>;
  if (!rep || !rep.candidates) return (
    <div style={{ padding: 24, textAlign: "center", color: T.sub, fontSize: 13.5, lineHeight: 1.7 }}>
      아직 오후 리포트가 없습니다.<br />매일 오후 3시(KST) 자동 생성되며, Afternoon Report 워크플로로도 실행할 수 있습니다.
      {hist && hist.analysis && <div style={{ marginTop: 16 }}><AfternoonAnalysis a={hist.analysis} T={T} /></div>}
      {hist && hist.reports && hist.reports.length > 0 && (
        <div style={{ marginTop: 16, textAlign: "left" }}>
          <Section title="📅 연도별 예측 · 결과" sub="연도/월 버튼 필터 · 일자별 종목 상세" T={T}>
            <HistoryBrowser reports={hist.reports} T={T} perStock={0} recOpt={null} />
          </Section>
        </div>
      )}
    </div>
  );
  const bias = SENT[rep.marketBias] || SENT.neutral;
  const oosRecOpt = (hist && hist.analysis && hist.analysis.strategies && hist.analysis.recommendedStrategy)
    ? (hist.analysis.strategies.find(s => s.name === hist.analysis.recommendedStrategy) || {}).opt || null
    : null;

  return (
    <div style={{ paddingBottom: 20 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
        <div>
          <div style={{ fontSize: 12, color: T.hint, fontWeight: 600 }}>{rep.date} 15:00 KST · 익일 상승 예측</div>
          <h2 style={{ fontSize: 18, fontWeight: 900, color: T.text, margin: "3px 0 0", letterSpacing: "-0.5px" }}>미 선물 · 당일 주가 기반 익일 후보</h2>
        </div>
        <span style={{ fontSize: 12.5, fontWeight: 800, color: bias.c, background: bias.bg, padding: "5px 11px", borderRadius: 20 }}>{bias.emoji} {bias.label}</span>
      </div>

      <div style={{ marginTop: 14, background: "linear-gradient(135deg," + bias.c + "1f, transparent)", border: "1px solid " + T.border, borderRadius: 16, padding: 16 }}>
        <div style={{ fontSize: 13, fontWeight: 800, color: bias.c, marginBottom: 7 }}>📋 요약</div>
        <div style={{ fontSize: 14, lineHeight: 1.7, color: T.text, fontWeight: 500 }}>{rep.summary}</div>
      </div>

      {(() => {
        const opt = oosRecOpt || { tp1Lvl: 5, tp1Frac: 0.5, gapStop: -7 };
        const stopText = opt.gapStop != null
          ? `익일 시가 ${opt.gapStop}% 이탈 시 시가 전량 청산 (장중 흔들기엔 손절 안 함 — 백테스트상 타이트 손절은 불리)`
          : opt.stop != null
            ? `${opt.stop}% 도달 시 전량 손절`
            : `별도 손절 없음 (갭하락 −7% 이탈만 청산 권장)`;
        return (
          <div style={{ marginTop: 12, background: T.card, border: "1px solid " + T.border, borderRadius: 14, padding: 15 }}>
            <div style={{ fontSize: 14, fontWeight: 900, color: T.text, marginBottom: 9 }}>📋 매도 플랜 (손절 포함 · 백테스트 권장)</div>
            <ol style={{ margin: 0, paddingLeft: 18, fontSize: 13, lineHeight: 1.75, color: T.sub }}>
              {opt.tp1Frac > 0 && <li><b style={{ color: T.text }}>1차 익절</b>: +{opt.tp1Lvl}% 도달 시 <b>{Math.round(opt.tp1Frac * 100)}%</b> 매도</li>}
              <li><b style={{ color: T.text }}>잔량 관리</b>: +10% 도달 후 10% 아래로 빠지면 전량 매도 · +15%↑면 <b>고가−5% 트레일링</b></li>
              <li><b style={{ color: "#ef4444" }}>손절</b>: {stopText}</li>
              <li><b style={{ color: T.text }}>목표 미달</b>: 익일 +{opt.tp1Lvl}% 못 가면 종가 청산</li>
            </ol>
          </div>
        );
      })()}

      {(() => {
        const cands = rep.candidates || [];
        const perStock = capNum; // 종목당 투자금
        const buyable = cands.filter(c => c.price && perStock >= c.price);
        const deployed = cands.reduce((s, c) => s + (c.price && perStock ? Math.floor(perStock / c.price) * c.price : 0), 0);
        const a = hist && hist.analysis;
        const stratRow = a && a.strategies ? a.strategies.find(s => s.name === a.recommendedStrategy) : null;
        const stratAvg = stratRow ? stratRow.avg : null;
        const expGain = (stratAvg != null && deployed) ? deployed * stratAvg / 100 : null;
        const presets = [100000, 300000, 500000, 1000000];
        return (
          <Section title="💰 종목당 투자금" sub="종목당 투자금을 입력하면 각 후보 매수 수량·예상 수익금을 계산합니다" T={T}>
            <div style={{ background: T.card, border: "1px solid " + T.border, borderRadius: 14, padding: 15 }}>
              <input value={capital} onChange={e => setCapital(e.target.value)} inputMode="numeric" placeholder="종목당 투자금 (원)"
                style={{ width: "100%", boxSizing: "border-box", padding: "11px 12px", fontSize: 15, fontWeight: 700, color: T.text, background: T.cardAlt, border: "1px solid " + T.border, borderRadius: 10, fontFamily: "inherit", outline: "none" }} />
              <div style={{ display: "flex", gap: 6, marginTop: 8, flexWrap: "wrap" }}>
                {presets.map(p => (
                  <button key={p} onClick={() => setCapital(String(p))} style={{ ...chip(T), cursor: "pointer", border: "1px solid " + T.border }}>{(p / 10000).toLocaleString("ko-KR")}만</button>
                ))}
                {capital && <button onClick={() => setCapital("")} style={{ ...chip(T), cursor: "pointer", border: "1px solid " + T.border }}>초기화</button>}
              </div>
              {capNum > 0 && cands.length > 0 && (
                <div style={{ marginTop: 11, fontSize: 13, lineHeight: 1.7, color: T.sub }}>
                  종목당 <b style={{ color: T.text }}>{wonFmt(perStock)}</b> × {buyable.length}종목 · 총 투입 <b style={{ color: T.text }}>{wonFmt(deployed)}</b>
                  {expGain != null
                    ? <><br />추천 전략 평균({stratAvg}%) 기준 기대 익일 수익금 <b style={{ color: expGain >= 0 ? UP_C : DN_C }}>{expGain >= 0 ? "+" : ""}{wonFmt(expGain)}</b></>
                    : <><br /><span style={{ color: T.hint }}>전략 평균 데이터 로딩 중…</span></>}
                </div>
              )}
            </div>
          </Section>
        );
      })()}

      <Section title="🇺🇸 미 선물 · 변동성" T={T}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(100px, 1fr))", gap: 8 }}>
          {(rep.futures || []).map((ind, i) => <Indicator key={i} ind={ind} T={T} />)}
        </div>
      </Section>
      <Section title="금리 · 환율 · 유가 · 국내지수" T={T}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(100px, 1fr))", gap: 8 }}>
          {[...(rep.macro || []), ...(rep.indices || [])].map((ind, i) => <Indicator key={i} ind={ind} T={T} />)}
        </div>
      </Section>

      <Section title={"🚀 익일 대장주 후보 TOP " + rep.candidates.length} sub="거래대금 상위 중 강한 종가·거래량·모멘텀 + 과거 OOS 기반 예상 익일등락·5%↑ 확률 순" T={T}>
        {rep.candidates.length === 0 ? (
          <div style={{ padding: 18, textAlign: "center", color: T.hint, fontSize: 13, background: T.card, border: "1px solid " + T.border, borderRadius: 12 }}>오늘은 조건을 충족하는 후보가 없습니다.</div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {rep.candidates.map((c, i) => <CandidateRow key={i} c={c} T={T} alloc={capNum} stratAvg={(hist && hist.analysis && hist.analysis.strategies && hist.analysis.recommendedStrategy) ? (hist.analysis.strategies.find(s => s.name === hist.analysis.recommendedStrategy) || {}).avg : null} />)}
          </div>
        )}
      </Section>

      {hist && hist.analysis && <div style={{ marginTop: 22 }}><AfternoonAnalysis a={hist.analysis} T={T} /><OosSplitCard oos={hist.analysis.oos} oosReal={hist.analysis.oosReal} oosAdv={hist.analysis.oosAdv} T={T} /><SwingCard swing={hist.analysis.swing} T={T} /><OosInvestment hist={hist} perStock={capNum} T={T} /><StrategyTable a={hist.analysis} T={T} /></div>}

      {hist && hist.reports && hist.reports.length > 0 && (
        <Section title="📅 연도별 예측 · 결과" sub="연도/월 버튼으로 켜고 끄기 · 일자를 누르면 당일 종목 상세 리스트" T={T}>
          <HistoryBrowser reports={hist.reports} T={T} perStock={capNum} recOpt={oosRecOpt} />
        </Section>
      )}

      <div style={{ marginTop: 16, textAlign: "center", fontSize: 11.5, color: T.hint }}>{rep.note}</div>
    </div>
  );
}

export function MarketReportTab({ theme }) {
  const T = useTheme(theme);
  const [mode, setMode] = useState("today");
  const [today, setToday] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [detail, setDetail] = useState(null); // 히스토리에서 연 개별 리포트
  const [detailLoading, setDetailLoading] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [spin, setSpin] = useState(false);

  const loadToday = useCallback(async () => {
    setLoading(true); setError(null);
    const data = await fetchFirst(REPORT_SOURCES.map(f => f()));
    if (data && data.date) setToday(data); else setError("리포트를 불러오지 못했습니다.");
    setLoading(false);
  }, []);
  useEffect(() => { loadToday(); }, [loadToday]);

  const openDate = useCallback(async (d) => {
    setDetailLoading(true);
    const rep = await fetchFirst(reportByDate(d));
    setDetail(rep || { date: d, summary: "해당 일자 리포트를 찾을 수 없습니다.", sentiment: "neutral", source: "oos" });
    setDetailLoading(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const handleRefresh = useCallback(async () => {
    setSpin(true);
    setDetail(null);
    if (mode === "today") await loadToday();
    setRefreshKey(k => k + 1); // 히스토리/분석 재로딩 (HistoryView remount)
    setTimeout(() => setSpin(false), 500);
  }, [mode, loadToday]);

  const Toggle = () => (
    <div style={{ display: "flex", gap: 6, flex: 1, background: T.cardAlt, borderRadius: 10, padding: 4 }}>
      {[["today", "오늘"], ["history", "히스토리"], ["afternoon", "익일예측"]].map(([k, label]) => (
        <button key={k} onClick={() => { setMode(k); setDetail(null); }} style={{ flex: 1, border: "none", borderRadius: 8, padding: "9px 0", fontSize: 12.5, fontWeight: 800, cursor: "pointer", fontFamily: "inherit", background: mode === k ? T.card : "transparent", color: mode === k ? T.text : T.hint, boxShadow: mode === k ? "0 1px 3px rgba(0,0,0,0.12)" : "none" }}>{label}</button>
      ))}
    </div>
  );

  return (
    <div>
      <div style={{ display: "flex", gap: 8, alignItems: "stretch", marginBottom: 14 }}>
        <Toggle />
        <button onClick={handleRefresh} title="새로고침" aria-label="새로고침" style={{ flex: "0 0 auto", border: "1px solid " + T.border, background: T.card, color: T.text, borderRadius: 10, padding: "0 14px", fontSize: 18, cursor: "pointer", fontFamily: "inherit", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <span style={{ display: "inline-block", transition: "transform .5s", transform: spin ? "rotate(360deg)" : "none" }}>↻</span>
        </button>
      </div>
      {mode === "today" && (
        loading ? <div style={{ padding: 40, textAlign: "center", color: T.hint }}>리포트 불러오는 중…</div>
          : error ? <div style={{ padding: 30, textAlign: "center", color: T.sub }}><div style={{ marginBottom: 12 }}>{error}</div><button onClick={loadToday} style={navBtn(T)}>다시 시도</button></div>
            : today ? <ReportBody report={today} T={T} /> : null
      )}
      {mode === "history" && (
        detail ? (
          <div>
            <button onClick={() => setDetail(null)} style={{ ...navBtn(T), marginBottom: 12 }}>‹ 목록으로</button>
            {detailLoading ? <div style={{ padding: 30, textAlign: "center", color: T.hint }}>불러오는 중…</div> : <ReportBody report={detail} T={T} />}
          </div>
        ) : (
          detailLoading ? <div style={{ padding: 30, textAlign: "center", color: T.hint }}>불러오는 중…</div> : <HistoryView key={refreshKey} T={T} onOpen={openDate} />
        )
      )}
      {mode === "afternoon" && <AfternoonView key={refreshKey} T={T} />}
    </div>
  );
}
