// 네오 종배 — 오늘 눌림목 반등 후보 탐지
// detect_neo.py 룰 클라이언트 사이드 재구현
//   1) screening API 오늘 신호 가져옴
//   2) 반등봉 조건 필터: +5~28% / 50억+ / 몸통 40%+ / 윗꼬리 30% 미만
//   3) (옵션) 클릭 시 daily-price로 과거 60일 가져와 기준봉 검증
import React, { useState, useEffect, useMemo, useCallback } from "react";

const API_BASE = "https://sector-api-pink.vercel.app/api";
const SCREENING_URL = API_BASE + "/screening";
const DAILY_URL = API_BASE + "/daily-price";

// 룰
const REB = { min: 5, max: 28, vol: 50, body: 40, wick: 30 };
const BASE = { min: 15, max: 30.5, vol: 1000, ratio: 3, rngPos: 0.7 };
const PB_DAYS = { min: 1, max: 60 };

const _won = (v) => v==null || v==='' || isNaN(+v) ? '-' : Math.round(+v).toLocaleString();
const _fmt = (v, d=2) => (v==null || v==='' || isNaN(+v)) ? '-' : (+v).toFixed(d);

// 등급 분류 (기준봉 정보 기반)
function _grade(baseChg, baseVolBil, dPlus) {
  const s1 = baseChg >= 25 && baseVolBil >= 2000 && dPlus >= 1 && dPlus <= 10;
  const s2 = baseVolBil >= 5000;
  const s3 = baseChg >= 28;
  return (s1 || s2 || s3) ? 'S' : 'A';
}

// 반등봉 조건 매치 (오늘 신호)
function _isReboundCandidate(s) {
  const ch = +s.change || +s.rate || 0;
  const amt = +s.amount || +s.vol || 0;
  if (!(ch >= REB.min && ch < REB.max)) return false;
  if (amt < REB.vol) return false;
  const o = +s.open || 0, h = +s.high || 0, l = +s.low || 0, c = +s.price || +s.close || 0;
  if (h <= l) return false;
  const range = h - l;
  const body = Math.abs(c - o);
  const bodyPct = body / range * 100;
  const upperEdge = Math.max(c, o);
  const upperPct = (h - upperEdge) / range * 100;
  if (bodyPct < REB.body) return false;
  if (upperPct >= REB.wick) return false;
  return { bodyPct, upperPct, rangePos: (c - l) / range };
}

// 기준봉 검출 (과거 60일 일봉 → 가장 최근 기준봉)
function _findBaseBar(bars, todayIdx) {
  // bars: [{date, open, high, low, close, volume, trade_value}, ...]
  if (!bars || bars.length < 21) return null;
  if (todayIdx == null) todayIdx = bars.length - 1;

  // 20일 평균 거래대금 계산
  for (let i = 20; i < bars.length; i++) {
    let sum = 0;
    for (let k = i - 20; k < i; k++) sum += bars[k].trade_value || 0;
    bars[i]._tvAvg20 = sum / 20;
  }

  // 오늘 직전 60일 내에서 기준봉 후보 찾기 (오늘 제외, 가장 가까운 기준봉)
  const minIdx = Math.max(20, todayIdx - PB_DAYS.max);
  for (let j = todayIdx - 1; j >= minIdx; j--) {
    const b = bars[j];
    if (j - (todayIdx - PB_DAYS.max) < PB_DAYS.min) continue;
    const ch = +b.change || 0;
    if (!(ch >= BASE.min && ch <= BASE.max)) continue;
    if (!b._tvAvg20 || b.trade_value < b._tvAvg20 * BASE.ratio) continue;
    const tvBil = b.trade_value / 1e8;
    if (tvBil < BASE.vol) continue;
    const range = b.high - b.low;
    if (range <= 0) continue;
    const rngPos = (b.close - b.low) / range;
    if (rngPos < BASE.rngPos) continue;
    // 매치!
    const pbSection = bars.slice(j + 1, todayIdx);
    const pbLow = pbSection.length ? Math.min(...pbSection.map(x => x.low)) : b.close;
    const pbDepth = b.close > 0 ? (pbLow - b.close) / b.close * 100 : 0;
    return {
      bar: b, idx: j, dPlus: todayIdx - j,
      baseChg: ch, baseVolBil: tvBil, baseRatio: b.trade_value / b._tvAvg20,
      rngPos, pbDepth
    };
  }
  return null;
}

export function TodayPullbackTab({ theme = "dark" }) {
  const _T = theme === "dark"
    ? { text:'#e6edf3', body:'#c9d1d9', sub:'#8b949e', hint:'#6e7681', mute:'#484f58', line:'#30363d', linelt:'#21262d', bg:'#0d1117', card:'#161b22', up:'#f85149', down:'#58a6ff', accent:'#7c3aed', green:'#10b981' }
    : { text:'#191f28', body:'#333d4b', sub:'#4e5968', hint:'#6b7684', mute:'#8b95a1', line:'#e5e8eb', linelt:'#f2f4f6', bg:'#f9fafb', card:'#ffffff', up:'#f04452', down:'#1f6dee', accent:'#7c3aed', green:'#10b981' };

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState(null);
  const [verifying, setVerifying] = useState(false);
  const [verified, setVerified] = useState({});   // code -> {matched, baseBar info}
  const [verifyProgress, setVerifyProgress] = useState({done:0, total:0});

  const load = useCallback(async () => {
    setLoading(true); setErr(null);
    setVerified({});
    try {
      const r = await fetch(SCREENING_URL);
      const d = await r.json();
      setData(d);
    } catch (e) {
      setErr(e.message || 'screening fetch 실패');
    }
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  // 반등봉 후보 (1차 필터) — 기준봉 검증 전
  const reboundCandidates = useMemo(() => {
    if (!data || !data.all) return [];
    return data.all.map(s => {
      const m = _isReboundCandidate(s);
      if (!m) return null;
      return { ...s, ...m };
    }).filter(x => x).sort((a, b) => (+b.change||0) - (+a.change||0));
  }, [data]);

  // 기준봉 검증된 후보만 (매수 대상)
  const matched = useMemo(() => {
    return reboundCandidates.filter(s => verified[s.code] && verified[s.code].matched);
  }, [reboundCandidates, verified]);

  // 기준봉 없는 후보 (참고)
  const unmatched = useMemo(() => {
    return reboundCandidates.filter(s => verified[s.code] && verified[s.code].matched === false);
  }, [reboundCandidates, verified]);

  // 자동 일괄 검증 (screening 응답 받으면 즉시)
  const verifyOne = useCallback(async (s) => {
    const today = new Date(Date.now() + 9*3600000);
    const fromD = new Date(today); fromD.setDate(fromD.getDate() - 100);
    const ymd = (d) => d.getFullYear() + String(d.getMonth()+1).padStart(2,'0') + String(d.getDate()).padStart(2,'0');
    const url = `${DAILY_URL}?code=${s.code}&from=${ymd(fromD)}&to=${ymd(today)}`;
    try {
      const r = await fetch(url);
      const d = await r.json();
      let bars = d.all_rows || d.bars || [];
      bars = bars.map(b => ({
        date: b.date, open: +b.open, high: +b.high, low: +b.low, close: +b.close,
        volume: +b.volume, trade_value: +b.trade_value || (+b.close)*(+b.volume),
        change: +b.change_rate || +b.change || 0
      })).filter(b => b.close > 0).sort((a,b) => a.date.localeCompare(b.date));
      if (!bars.length) return { code: s.code, error: 'no bars' };
      const todayYMD = ymd(today);
      let todayIdx = bars.findIndex(b => b.date === todayYMD);
      if (todayIdx < 0) {
        bars.push({ date: todayYMD, open:+s.open, high:+s.high, low:+s.low, close:+s.price, volume:+s.volume||0, trade_value:(+s.amount||0)*1e8, change:+s.change||0 });
        todayIdx = bars.length - 1;
      }
      const base = _findBaseBar(bars, todayIdx);
      if (!base) return { code: s.code, matched: false };
      const g = _grade(base.baseChg, base.baseVolBil, base.dPlus);
      return { code: s.code, matched: true, ...base, grade: g };
    } catch (e) {
      return { code: s.code, error: e.message };
    }
  }, []);

  // 후보가 잡히면 자동 일괄 검증
  useEffect(() => {
    if (!reboundCandidates.length) return;
    const toVerify = reboundCandidates.filter(s => !verified[s.code]);
    if (!toVerify.length) return;
    setVerifying(true);
    setVerifyProgress({done: 0, total: toVerify.length});
    let cancelled = false;
    (async () => {
      // 동시 5개씩 병렬 처리 (API rate limit 고려)
      const batchSize = 5;
      for (let i = 0; i < toVerify.length; i += batchSize) {
        if (cancelled) return;
        const batch = toVerify.slice(i, i+batchSize);
        const results = await Promise.all(batch.map(verifyOne));
        if (cancelled) return;
        setVerified(p => {
          const next = {...p};
          for (const r of results) {
            next[r.code] = r.matched !== undefined ? r : { matched: false, error: r.error };
          }
          return next;
        });
        setVerifyProgress(p => ({ ...p, done: Math.min(p.done + batch.length, toVerify.length) }));
      }
      setVerifying(false);
    })();
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reboundCandidates]);

  return (
    <div style={{padding:'4px 0', color:_T.text}}>
      {/* 룰 카드 */}
      <div style={{background:_T.card, border:'1px solid '+_T.line, borderRadius:12, padding:'14px 16px', marginBottom:10, fontSize:12, lineHeight:1.7, color:_T.body}}>
        <div style={{fontSize:14, fontWeight:800, color:_T.text, marginBottom:8}}>📘 오늘 반등봉 (D0 = 매수 시점)</div>
        <div><b style={{color:_T.text}}>반등봉 조건</b> 만족 종목 자동 추출: +5~28% / 50억+ / 몸통 40%+ / 윗꼬리 30% 미만</div>
        <div style={{fontSize:12, color:_T.sub, marginTop:3}}>→ "기준봉 검증" 클릭 시 과거 60일 OHLC 조회 → 기준봉 (15~30%/1000억+/배율 3x+) 매칭 + S/A 등급 분류</div>
        <div style={{fontSize:11, color:_T.sub, marginTop:4, paddingTop:4, borderTop:'1px solid '+_T.linelt}}>
          <b style={{color:'#dc2626'}}>🔴 S급</b> = 기준봉 +25%↑+2천억+ AND D+1~10일 OR 기준봉 5천억+ OR 기준봉 +28%↑ &nbsp;|&nbsp;
          <b style={{color:'#2563eb'}}>🔵 일반A</b> = 그 외 (S조건 미달)
        </div>
        <div style={{fontSize:11, color:_T.sub, marginTop:3}}>
          매수: D0 종가 100% (A=10만/S=20만) → -15% 추매 1회 / 매도: TP1 +100% 50% / TP2 +200% 잔여 / 60일 만기
        </div>
      </div>

      {/* 새로조회 + 진행상태 */}
      <div style={{display:'flex', gap:8, marginBottom:10, alignItems:'center', flexWrap:'wrap'}}>
        <button onClick={load} disabled={loading} style={{padding:'8px 14px', borderRadius:9, border:'1px solid '+_T.line, background:_T.bg, color:_T.body, fontSize:12, fontWeight:700, cursor:loading?'wait':'pointer'}}>🔄 {loading?'조회 중':'새로 조회'}</button>
        {data && <span style={{fontSize:12, color:_T.sub}}>{data.date} · {data.time}</span>}
        {verifying && <span style={{fontSize:12, color:_T.accent, fontWeight:700, marginLeft:'auto'}}>⏳ 기준봉 검증 {verifyProgress.done}/{verifyProgress.total}</span>}
        {!verifying && reboundCandidates.length > 0 && (
          <span style={{fontSize:12, color:_T.sub, marginLeft:'auto'}}>
            반등봉 {reboundCandidates.length}건 · <b style={{color:_T.green}}>매수대상 {matched.length}건</b> · 기준봉없음 {unmatched.length}건
          </span>
        )}
      </div>

      {err && <div style={{padding:'10px 14px', borderRadius:9, background:'rgba(248,81,73,0.12)', border:'1px solid rgba(248,81,73,0.35)', color:_T.up, fontSize:12, marginBottom:10}}>⚠️ {err}</div>}

      {!loading && reboundCandidates.length === 0 && (
        <div style={{padding:'40px 20px', textAlign:'center', color:_T.mute, fontSize:13, background:_T.card, border:'1px solid '+_T.line, borderRadius:12}}>
          오늘 반등봉 조건 만족 종목 없음<br/>
          <span style={{fontSize:11}}>(+5~28% / 50억+ / 몸통 40%+ / 윗꼬리 30% 미만)</span>
        </div>
      )}

      {!verifying && reboundCandidates.length > 0 && matched.length === 0 && (
        <div style={{padding:'40px 20px', textAlign:'center', color:_T.mute, fontSize:13, background:_T.card, border:'1px solid '+_T.line, borderRadius:12, marginBottom:10}}>
          오늘 반등봉 {reboundCandidates.length}건 중 <b>기준봉 매칭된 매수 대상 0건</b><br/>
          <span style={{fontSize:11}}>과거 60일 내 기준봉 (+15~30% / 1000억+ / 배율 3x+) 없음</span>
        </div>
      )}

      {/* 매수 대상 카드 (기준봉 매칭된 것만) */}
      <div style={{display:'flex', flexDirection:'column', gap:8}}>
        {matched.map((s, i) => {
          const v = verified[s.code];
          const ch = +s.change || 0;
          const amt = +s.amount || 0;
          return (
            <div key={s.code+'_'+i} style={{background:_T.card, border:'2px solid #10b981', borderRadius:11, padding:'12px 14px'}}>
              <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', gap:10, flexWrap:'wrap'}}>
                <div style={{display:'flex', alignItems:'baseline', gap:8, flexWrap:'wrap'}}>
                  <span style={{padding:'2px 8px', borderRadius:6, fontSize:11, fontWeight:800, background:v.grade==='S'?'rgba(220,38,38,0.12)':'rgba(37,99,235,0.12)', color:v.grade==='S'?'#dc2626':'#2563eb'}}>{v.grade==='S'?'🔴 S':'🔵 A'}</span>
                  <span style={{fontSize:14, fontWeight:800, color:_T.text}}>{s.name}</span>
                  <span style={{fontSize:11, color:_T.mute}}>{s.code}</span>
                  <span style={{fontSize:12, color:_T.sub}}>{s.market}</span>
                  <span style={{padding:'1px 6px', borderRadius:4, fontSize:10, fontWeight:700, background:'rgba(16,185,129,0.18)', color:'#10b981'}}>✓ 매수대상</span>
                </div>
                <div style={{display:'flex', alignItems:'baseline', gap:8}}>
                  <span style={{fontSize:18, fontWeight:900, color:_T.up}}>+{ch.toFixed(2)}%</span>
                  <span style={{fontSize:12, color:_T.sub}}>{amt}억</span>
                </div>
              </div>
              {/* 반등봉 (D0 = 매수 시점) — PRIMARY */}
              <div style={{marginTop:8}}>
                <div style={{fontSize:11, fontWeight:800, color:'#10b981', marginBottom:6}}>● 반등봉 (D0 = 매수 시점)</div>
                <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(105px, 1fr))', gap:6}}>
                  <Mini l="등락" v={`+${ch.toFixed(2)}%`} c={_T.up} _T={_T} />
                  <Mini l="거래대금" v={`${amt}억`} _T={_T} />
                  <Mini l="몸통" v={`${_fmt(s.bodyPct,0)}%`} _T={_T} />
                  <Mini l="윗꼬리" v={`${_fmt(s.upperPct,0)}%`} _T={_T} />
                  <Mini l="종가위치" v={`${_fmt(s.rangePos*100,0)}%`} _T={_T} />
                  <Mini l="수급" v={s.investor||'-'} _T={_T} />
                </div>
                <div style={{marginTop:8, padding:'8px 10px', background:'rgba(16,185,129,0.10)', borderRadius:7, fontSize:12, color:_T.body, lineHeight:1.6}}>
                  💡 <b style={{color:_T.text}}>매수가 {_won(s.price||s.close)}원</b> (D0 종가) × {v.grade==='S'?'20':'10'}만원 ({v.grade}급)<br/>
                  💡 <b style={{color:_T.text}}>추매 -15% {_won((+s.price||+s.close||0)*0.85)}원</b> 도달 시 +{v.grade==='S'?'20':'10'}만원<br/>
                  💡 매도: <b style={{color:_T.text}}>TP1 +100% 50% / TP2 +200% 잔여 / 60일 만기</b>
                </div>
              </div>

              {/* 기준봉 (등급 분류 근거) — SECONDARY */}
              <div style={{marginTop:8, paddingTop:8, borderTop:'1px solid '+_T.linelt}}>
                <div style={{fontSize:11, fontWeight:800, color:'#a855f7', marginBottom:6}}>● 기준봉 (등급 {v.grade} 분류 근거 · {v.bar.date} · D+{v.dPlus})</div>
                <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(105px, 1fr))', gap:6}}>
                  <Mini l="등락" v={`+${_fmt(v.baseChg,2)}%`} c={_T.up} _T={_T} />
                  <Mini l="거래대금" v={`${_fmt(v.baseVolBil,0)}억`} _T={_T} />
                  <Mini l="배율" v={`${_fmt(v.baseRatio,2)}배`} _T={_T} />
                  <Mini l="종가위치" v={`${_fmt(v.rngPos*100,0)}%`} _T={_T} />
                  <Mini l="조정깊이" v={`${_fmt(v.pbDepth,2)}%`} c={_T.down} _T={_T} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* 기준봉 없는 후보 (참고용 — 기본 열림) */}
      {unmatched.length > 0 && (
        <details open style={{marginTop:14, background:_T.card, border:'1px solid '+_T.line, borderRadius:11, padding:'12px 14px'}}>
          <summary style={{color:_T.body, cursor:'pointer', fontWeight:700, fontSize:13, marginBottom:4, listStyle:'none', display:'flex', alignItems:'center', gap:8}}>
            <span style={{fontSize:16}}>⚠️</span>
            <span>반등봉 조건만 만족 (기준봉 없음 — 매수 대상 아님)</span>
            <span style={{padding:'2px 9px', borderRadius:6, fontSize:12, fontWeight:800, background:'rgba(245,158,11,0.18)', color:'#f59e0b', marginLeft:'auto'}}>{unmatched.length}건</span>
          </summary>
          <div style={{marginTop:10, display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(220px, 1fr))', gap:8}}>
            {unmatched.map(s => {
              const ch = +s.change || 0;
              const amt = +s.amount || 0;
              return (
                <div key={s.code} style={{padding:'10px 12px', background:_T.bg, border:'1px solid '+_T.line, borderRadius:8}}>
                  <div style={{display:'flex', justifyContent:'space-between', alignItems:'baseline', marginBottom:6, gap:8}}>
                    <div style={{display:'flex', alignItems:'baseline', gap:6, flexWrap:'wrap', minWidth:0}}>
                      <span style={{fontSize:13, fontWeight:800, color:_T.text}}>{s.name}</span>
                      <span style={{fontSize:11, color:_T.mute}}>{s.code}</span>
                      <span style={{fontSize:11, color:_T.sub}}>{s.market}</span>
                    </div>
                    <span style={{fontSize:14, fontWeight:800, color:_T.up, whiteSpace:'nowrap'}}>+{ch.toFixed(2)}%</span>
                  </div>
                  <div style={{display:'flex', gap:10, fontSize:12, color:_T.sub, flexWrap:'wrap'}}>
                    <span>거래대금 <b style={{color:_T.body}}>{amt}억</b></span>
                    <span>몸통 <b style={{color:_T.body}}>{_fmt(s.bodyPct,0)}%</b></span>
                    <span>윗꼬리 <b style={{color:_T.body}}>{_fmt(s.upperPct,0)}%</b></span>
                    <span>수급 <b style={{color:_T.body}}>{s.investor||'-'}</b></span>
                  </div>
                </div>
              );
            })}
          </div>
        </details>
      )}
    </div>
  );
}

function Mini({ l, v, c, _T }) {
  return (
    <div style={{padding:'5px 8px', background:_T.bg, borderRadius:6, border:'1px solid '+_T.linelt}}>
      <div style={{fontSize:10, color:_T.hint, fontWeight:600}}>{l}</div>
      <div style={{fontSize:12, fontWeight:700, color:c||_T.text, marginTop:1}}>{v}</div>
    </div>
  );
}
