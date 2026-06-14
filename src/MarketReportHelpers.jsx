import { useState, useEffect, useMemo, useCallback } from "react";

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
  up: { c: "#16a34a", arrow: "▲", bg: "rgba(22,163,74,0.12)" },
  down: { c: "#ef4444", arrow: "▼", bg: "rgba(239,68,68,0.12)" },
  flat: { c: "#8b95a1", arrow: "—", bg: "rgba(139,149,161,0.12)" },
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
    <div>
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

function CardNews({ cards, T }) {
  const [idx, setIdx] = useState(0);
  if (!cards || !cards.length) return null;
  const n = cards.length;
  const card = cards[idx];
  const palette = ["#7c3aed", "#2563eb", "#0d9488", "#d97706", "#db2777", "#dc2626"];
  const accent = palette[idx % palette.length];
  return (
    <div>
      <div style={{ position: "relative", borderRadius: 18, overflow: "hidden", background: "linear-gradient(135deg," + accent + "ee," + accent + "99)", padding: "26px 22px", minHeight: 150, color: "#fff", boxShadow: "0 6px 20px " + accent + "33" }}>
        <div style={{ fontSize: 40, marginBottom: 8 }}>{card.emoji || "📰"}</div>
        <div style={{ fontSize: 19, fontWeight: 900, letterSpacing: "-0.4px", marginBottom: 8, lineHeight: 1.3 }}>{card.title}</div>
        <div style={{ fontSize: 14, lineHeight: 1.65, opacity: 0.96, fontWeight: 500 }}>{card.body}</div>
        <div style={{ position: "absolute", top: 14, right: 16, fontSize: 12, fontWeight: 700, opacity: 0.85 }}>{idx + 1} / {n}</div>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 12 }}>
        <button onClick={() => setIdx(i => (i - 1 + n) % n)} style={navBtn(T)}>‹ 이전</button>
        <div style={{ flex: 1, display: "flex", justifyContent: "center", gap: 6 }}>
          {cards.map((_, i) => (
            <span key={i} onClick={() => setIdx(i)} style={{ cursor: "pointer", width: i === idx ? 22 : 8, height: 8, borderRadius: 4, background: i === idx ? accent : T.border, transition: "all .2s" }} />
          ))}
        </div>
        <button onClick={() => setIdx(i => (i + 1) % n)} style={navBtn(T)}>다음 ›</button>
      </div>
    </div>
  );
}
const navBtn = (T) => ({ border: "1px solid " + T.border, background: T.card, color: T.text, borderRadius: 9, padding: "7px 13px", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" });

function Section({ title, sub, children, T }) {
  return (
    <div style={{ marginTop: 22 }}>
      <div style={{ fontSize: 15, fontWeight: 900, color: T.text, letterSpacing: "-0.3px" }}>{title}</div>
      {sub && <div style={{ fontSize: 12, color: T.hint, marginTop: 2, marginBottom: 10 }}>{sub}</div>}
      {!sub && <div style={{ height: 10 }} />}
      {children}
    </div>
  );
}

export function MarketReportTab({ theme }) {
  const T = useTheme(theme);
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDetail, setShowDetail] = useState(false);

  const load = useCallback(async () => {
    setLoading(true); setError(null);
    for (const src of REPORT_SOURCES) {
      try {
        const r = await fetch(src());
        if (!r.ok) continue;
        const data = await r.json();
        if (data && data.date) { setReport(data); setLoading(false); return; }
      } catch (e) { /* try next */ }
    }
    setError("리포트를 불러오지 못했습니다. 잠시 후 다시 시도해주세요.");
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const sent = useMemo(() => (report && SENT[report.sentiment]) || SENT.neutral, [report]);

  if (loading) return <div style={{ padding: 40, textAlign: "center", color: T.hint, fontSize: 14 }}>리포트 불러오는 중…</div>;
  if (error || !report) return (
    <div style={{ padding: 30, textAlign: "center", color: T.sub }}>
      <div style={{ fontSize: 14, marginBottom: 12 }}>{error || "리포트가 없습니다."}</div>
      <button onClick={load} style={navBtn(T)}>다시 시도</button>
    </div>
  );

  const detailParas = (report.detail || "").split("\n\n").filter(Boolean);

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
          ⓘ 예시 데이터입니다. 매일 새벽 5시 30분(KST) 실데이터로 자동 갱신됩니다.
        </div>
      )}

      {/* 요약본 (터치 시 상세) */}
      <div style={{ marginTop: 14, background: "linear-gradient(135deg," + sent.c + "1f, transparent)", border: "1px solid " + T.border, borderRadius: 16, padding: 16 }}>
        <div style={{ fontSize: 13, fontWeight: 800, color: sent.c, marginBottom: 7 }}>📋 오늘의 요약</div>
        <div style={{ fontSize: 14.5, lineHeight: 1.7, color: T.text, fontWeight: 500 }}>{report.summary}</div>
        <button onClick={() => setShowDetail(s => !s)} style={{ marginTop: 12, width: "100%", border: "none", background: sent.c, color: "#fff", borderRadius: 10, padding: "10px 0", fontSize: 13.5, fontWeight: 800, cursor: "pointer", fontFamily: "inherit" }}>
          {showDetail ? "상세 분석 접기 ▲" : "상세 분석 보기 ▼"}
        </button>
        {showDetail && (
          <div style={{ marginTop: 14, paddingTop: 14, borderTop: "1px solid " + T.border }}>
            {detailParas.map((p, i) => (
              <p key={i} style={{ fontSize: 13.5, lineHeight: 1.75, color: T.sub, margin: i === 0 ? "0 0 10px" : "0 0 10px" }}>{p}</p>
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

      {/* 주요 이슈 */}
      {report.issues && report.issues.length > 0 && (
        <Section title="📰 주요 이슈" T={T}>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {report.issues.map((it, i) => (
              <div key={i} style={{ background: T.card, border: "1px solid " + T.border, borderRadius: 12, padding: "11px 13px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 3 }}>
                  <span style={{ fontSize: 11, fontWeight: 800, color: "#fff", background: T.hint, padding: "2px 7px", borderRadius: 6 }}>{it.category}</span>
                  <span style={{ fontSize: 14, fontWeight: 800, color: T.text }}>{it.title}</span>
                </div>
                {it.detail && <div style={{ fontSize: 13, lineHeight: 1.6, color: T.sub }}>{it.detail}</div>}
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* 카드뉴스 */}
      {report.cards && report.cards.length > 0 && (
        <Section title="🃏 카드뉴스" sub="좌우로 넘겨보세요" T={T}>
          <CardNews cards={report.cards} T={T} />
        </Section>
      )}

      <div style={{ marginTop: 24, textAlign: "center", fontSize: 11.5, color: T.hint }}>
        생성 시각: {report.generatedAt || report.date} · 본 리포트는 투자 참고용이며 투자 책임은 본인에게 있습니다.
      </div>
    </div>
  );
}
