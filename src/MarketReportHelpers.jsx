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

const DIR = {
  up: { c: "#16a34a", arrow: "▲" },
  down: { c: "#ef4444", arrow: "▼" },
  flat: { c: "#8b95a1", arrow: "—" },
};
const TONE = {
  pos: { c: "#16a34a", label: "긍정" },
  neg: { c: "#ef4444", label: "부담" },
  neutral: { c: "#d97706", label: "중립" },
};
const SENT = {
  bullish: { c: "#16a34a", bg: "rgba(22,163,74,0.14)", label: "강세 우호", emoji: "📈" },
  neutral: { c: "#d97706", bg: "rgba(217,119,6,0.14)", label: "중립·혼조", emoji: "⚖️" },
  bearish: { c: "#ef4444", bg: "rgba(239,68,68,0.14)", label: "약세 경계", emoji: "📉" },
};
const BIAS = {
  up: { c: "#16a34a", label: "상승 기대", emoji: "🔺" },
  down: { c: "#ef4444", label: "약세", emoji: "🔻" },
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
  const palette = ["#7c3aed", "#2563eb", "#0d9488", "#d97706", "#db2777", "#dc2626"];
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
        {cell("방향 적중률", a.hitRate == null ? "—" : a.hitRate + "%", a.hitRate >= 50 ? "#16a34a" : "#ef4444")}
        {cell("평가일수", (a.directionHits ?? 0) + "/" + (a.evaluated ?? 0))}
        {cell("강세 예측", a.bullishDays + "일")}
        {cell("약세 예측", a.bearishDays + "일")}
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 8 }}>
        {cell("강세일 코스피 평균", pct(a.avgKospiOnBullish), a.avgKospiOnBullish >= 0 ? "#16a34a" : "#ef4444")}
        {cell("약세일 코스피 평균", pct(a.avgKospiOnBearish), a.avgKospiOnBearish >= 0 ? "#16a34a" : "#ef4444")}
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
                {oos.kospiRet != null && <div style={{ fontSize: 13, fontWeight: 800, color: oos.kospiRet >= 0 ? "#16a34a" : "#ef4444" }}>{oos.kospiRet >= 0 ? "+" : ""}{oos.kospiRet}%</div>}
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

function CandidateRow({ c, T }) {
  const up = c.changePct >= 0;
  return (
    <div style={{ background: T.card, border: "1px solid " + T.border, borderRadius: 12, padding: "11px 12px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
        <span style={{ flex: "0 0 26px", height: 26, borderRadius: 7, background: c.rank <= 3 ? "#7c3aed" : T.cardAlt, color: c.rank <= 3 ? "#fff" : T.sub, fontSize: 13, fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center" }}>{c.rank}</span>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
            <span style={{ fontSize: 14.5, fontWeight: 800, color: T.text }}>{c.name}</span>
            {c.target3 && <span style={{ fontSize: 10.5, fontWeight: 800, color: "#fff", background: "#dc2626", padding: "1px 6px", borderRadius: 6 }}>🔥 3%↑ 유력</span>}
            <span style={{ fontSize: 11, color: T.hint, fontWeight: 600 }}>{c.code} · {c.market}</span>
          </div>
        </div>
        <div style={{ flex: "0 0 auto", textAlign: "right" }}>
          {c.p3 != null
            ? <div style={{ fontSize: 15, fontWeight: 800, color: "#7c3aed" }}>3%↑ {c.p3}%</div>
            : <div style={{ fontSize: 14, fontWeight: 800, color: up ? "#16a34a" : "#ef4444" }}>{up ? "+" : ""}{c.changePct}%</div>}
          <div style={{ fontSize: 11, color: T.hint }}>{c.expRet != null ? "예상 익일 " + (c.expRet >= 0 ? "+" : "") + c.expRet + "%" : "점수 " + c.score}</div>
        </div>
      </div>
      <div style={{ display: "flex", gap: 6, marginTop: 8, flexWrap: "wrap" }}>
        {c.supplyLabel && <span style={c.dongban ? { fontSize: 11, fontWeight: 800, color: "#fff", background: "#16a34a", padding: "3px 8px", borderRadius: 7 } : chip(T)}>{c.dongban ? "🟢 " : ""}{c.supplyLabel}</span>}
        <span style={chip(T)}>당일 {up ? "+" : ""}{c.changePct}%</span>
        <span style={chip(T)}>거래대금 {c.valueText}</span>
        <span style={chip(T)}>거래량 {c.volSurge}배</span>
        <span style={chip(T)}>종가강도 {Math.round((c.rangePos || 0) * 100)}%</span>
        {c.aboveMA && <span style={{ ...chip(T), color: "#16a34a" }}>정배열</span>}
      </div>
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
        {cell("익일 3%↑ 적중률", a.hit3Rate == null ? "—" : a.hit3Rate + "%", (a.hit3Rate || 0) >= 30 ? "#16a34a" : "#d97706")}
        {cell("후보 평균 익일", pct(a.avgNextRet), (a.avgNextRet || 0) >= 0 ? "#16a34a" : "#ef4444")}
        {cell("시장 평균(baseline)", pct(a.baselineAvgNextRet))}
        {cell("초과수익 edge", pct(a.edge), (a.edge || 0) >= 0 ? "#16a34a" : "#ef4444")}
      </div>
      {(a.hit5Rate != null || a.upRate != null) && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 8 }}>
          {cell("익일 5%↑", a.hit5Rate == null ? "—" : a.hit5Rate + "%")}
          {cell("익일 상승(>0%)", a.upRate == null ? "—" : a.upRate + "%")}
        </div>
      )}
      {a.note && <div style={{ fontSize: 11.5, color: T.hint, marginTop: 10, lineHeight: 1.55 }}>{a.note}</div>}
    </div>
  );
}

function AfternoonDayRow({ r, T }) {
  const [open, setOpen] = useState(false);
  const hasOutcome = r.dayHitRate != null;
  const picks = r.picks || [];
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
              <div style={{ fontSize: 13, fontWeight: 800, color: r.dayHitRate >= 30 ? "#16a34a" : "#d97706" }}>3%↑ {r.dayHitRate}%</div>
              <div style={{ fontSize: 11, color: r.avgNextRet >= 0 ? "#16a34a" : "#ef4444" }}>익일 {r.avgNextRet >= 0 ? "+" : ""}{r.avgNextRet}%</div>
            </>
          ) : <div style={{ fontSize: 11, color: T.hint }}>결과 대기</div>}
        </div>
        <span style={{ flex: "0 0 auto", fontSize: 11, color: T.hint }}>{open ? "▲" : "▼"}</span>
      </button>
      {open && (
        <div style={{ padding: "0 13px 12px" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
            {picks.map((p, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, background: T.cardAlt, borderRadius: 8, padding: "7px 10px" }}>
                <span style={{ flex: 1, fontSize: 13, fontWeight: 700, color: T.text }}>{p.name} <span style={{ fontSize: 10.5, color: T.hint, fontWeight: 500 }}>{p.code}</span></span>
                <span style={{ fontSize: 12, color: T.hint }}>당일 {p.changePct >= 0 ? "+" : ""}{p.changePct}%</span>
                {p.nextRet != null && <span style={{ fontSize: 12.5, fontWeight: 800, color: p.nextRet >= 0 ? "#16a34a" : "#ef4444" }}>→ 익일 {p.nextRet >= 0 ? "+" : ""}{p.nextRet}%</span>}
                {p.nextRet != null && <span style={{ fontSize: 12 }} title="익일 3%↑ 달성">{(p.hit3 != null ? p.hit3 : p.nextRet >= 3) ? "✅" : "❌"}</span>}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function AfternoonView({ T }) {
  const [rep, setRep] = useState(null);
  const [hist, setHist] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => { (async () => {
    const [r, h] = await Promise.all([fetchFirst(AFT_SOURCES.map(f => f())), fetchFirst(AFT_HIST_SOURCES.map(f => f()))]);
    setRep(r); setHist(h); setLoading(false);
  })(); }, []);

  if (loading) return <div style={{ padding: 40, textAlign: "center", color: T.hint }}>익일예측 불러오는 중…</div>;
  if (!rep || !rep.candidates) return (
    <div style={{ padding: 24, textAlign: "center", color: T.sub, fontSize: 13.5, lineHeight: 1.7 }}>
      아직 오후 리포트가 없습니다.<br />매일 오후 3시(KST) 자동 생성되며, Afternoon Report 워크플로로도 실행할 수 있습니다.
      {hist && hist.analysis && <div style={{ marginTop: 16 }}><AfternoonAnalysis a={hist.analysis} T={T} /></div>}
      {hist && hist.reports && hist.reports.length > 0 && (
        <div style={{ marginTop: 16, textAlign: "left" }}>
          <Section title="📅 일자별 예측 · 결과" sub="날짜를 눌러 그날 선정 종목과 실제 익일 등락 확인" T={T}>
            <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
              {hist.reports.map((r) => <AfternoonDayRow key={r.date} r={r} T={T} />)}
            </div>
          </Section>
        </div>
      )}
    </div>
  );
  const bias = SENT[rep.marketBias] || SENT.neutral;

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
            {rep.candidates.map((c, i) => <CandidateRow key={i} c={c} T={T} />)}
          </div>
        )}
      </Section>

      {hist && hist.analysis && <div style={{ marginTop: 22 }}><AfternoonAnalysis a={hist.analysis} T={T} /></div>}

      {hist && hist.reports && hist.reports.length > 0 && (
        <Section title="📅 일자별 예측 · 결과" sub="날짜를 눌러 그날 선정 종목과 실제 익일 등락 확인" T={T}>
          <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
            {hist.reports.map((r) => <AfternoonDayRow key={r.date} r={r} T={T} />)}
          </div>
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
