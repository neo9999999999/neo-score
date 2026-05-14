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
  const [verifying, setVerifying] = useState({}); // code -> bool
  const [verified, setVerified] = useState({});   // code -> {basebar info}

  const load = useCallback(async () => {
    setLoading(true); setErr(null);
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

  // 반등봉 후보 추출
  const candidates = useMemo(() => {
    if (!data || !data.all) return [];
    return data.all.map(s => {
      const m = _isReboundCandidate(s);
      if (!m) return null;
      return { ...s, ...m };
    }).filter(x => x).sort((a, b) => (+b.change||0) - (+a.change||0));
  }, [data]);

  const verifyBase = async (s) => {
    setVerifying(p => ({ ...p, [s.code]: true }));
    try {
      // 60일 이전 ~ 어제 일봉 조회 (오늘은 screening에서 가져온 정보만 사용)
      const today = new Date(Date.now() + 9*3600000);
      const fromD = new Date(today); fromD.setDate(fromD.getDate() - 100);
      const ymd = (d) => d.getFullYear() + String(d.getMonth()+1).padStart(2,'0') + String(d.getDate()).padStart(2,'0');
      const url = `${DAILY_URL}?code=${s.code}&from=${ymd(fromD)}&to=${ymd(today)}`;
      const r = await fetch(url);
      const d = await r.json();
      let bars = d.all_rows || d.bars || [];
      // 정렬 + 정규화
      bars = bars.map(b => ({
        date: b.date, open: +b.open, high: +b.high, low: +b.low, close: +b.close,
        volume: +b.volume, trade_value: +b.trade_value || (+b.close)*(+b.volume),
        change: +b.change_rate || +b.change || 0
      })).filter(b => b.close > 0).sort((a,b) => a.date.localeCompare(b.date));
      if (!bars.length) {
        setVerified(p => ({ ...p, [s.code]: { error: '일봉 데이터 없음' } }));
        return;
      }
      // 오늘 봉이 마지막에 있는지 확인 — 없으면 추가 (screening 데이터 활용)
      const todayYMD = ymd(today);
      let todayIdx = bars.findIndex(b => b.date === todayYMD);
      if (todayIdx < 0) {
        bars.push({ date: todayYMD, open:+s.open, high:+s.high, low:+s.low, close:+s.price, volume:+s.volume||0, trade_value:(+s.amount||0)*1e8, change:+s.change||0 });
        todayIdx = bars.length - 1;
      }
      const base = _findBaseBar(bars, todayIdx);
      if (!base) {
        setVerified(p => ({ ...p, [s.code]: { matched: false } }));
        return;
      }
      const g = _grade(base.baseChg, base.baseVolBil, base.dPlus);
      setVerified(p => ({ ...p, [s.code]: { matched: true, ...base, grade: g } }));
    } catch (e) {
      setVerified(p => ({ ...p, [s.code]: { error: e.message } }));
    } finally {
      setVerifying(p => ({ ...p, [s.code]: false }));
    }
  };

  const verifyAll = async () => {
    for (const s of candidates) {
      if (verified[s.code]) continue;
      await verifyBase(s);
    }
  };

  return (
    <div style={{padding:'4px 0', color:_T.text}}>
      {/* 룰 카드 */}
      <div style={{background:_T.card, border:'1px solid '+_T.line, borderRadius:12, padding:'14px 16px', marginBottom:10, fontSize:12, lineHeight:1.7, color:_T.body}}>
        <div style={{fontSize:14, fontWeight:800, color:_T.text, marginBottom:8}}>📘 오늘 눌림목 반등 후보</div>
        <div>오늘 신호 중 <b style={{color:_T.text}}>반등봉 조건</b> 만족 종목 자동 추출:</div>
        <div style={{fontSize:12, color:_T.sub, marginTop:3}}>+5~28% / 50억+ / 몸통 40%+ / 윗꼬리 30% 미만</div>
        <div style={{fontSize:12, color:_T.sub, marginTop:3}}>→ "기준봉 검증" 클릭 시 과거 60일 OHLC 조회하여 기준봉 (15~30%/1000억+/배율 3x+) 자동 매칭</div>
      </div>

      {/* 새로조회 / 일괄검증 */}
      <div style={{display:'flex', gap:8, marginBottom:10, alignItems:'center', flexWrap:'wrap'}}>
        <button onClick={load} disabled={loading} style={{padding:'8px 14px', borderRadius:9, border:'1px solid '+_T.line, background:_T.bg, color:_T.body, fontSize:12, fontWeight:700, cursor:loading?'wait':'pointer'}}>🔄 {loading?'조회 중':'새로 조회'}</button>
        {data && <span style={{fontSize:12, color:_T.sub}}>{data.date} · {data.time}</span>}
        {candidates.length > 0 && (
          <button onClick={verifyAll} style={{padding:'8px 14px', borderRadius:9, border:'1px solid '+_T.accent, background:_T.accent, color:'#fff', fontSize:12, fontWeight:700, cursor:'pointer', marginLeft:'auto'}}>🔍 기준봉 일괄검증 ({candidates.length}건)</button>
        )}
      </div>

      {err && <div style={{padding:'10px 14px', borderRadius:9, background:'rgba(248,81,73,0.12)', border:'1px solid rgba(248,81,73,0.35)', color:_T.up, fontSize:12, marginBottom:10}}>⚠️ {err}</div>}

      {!loading && candidates.length === 0 && (
        <div style={{padding:'40px 20px', textAlign:'center', color:_T.mute, fontSize:13, background:_T.card, border:'1px solid '+_T.line, borderRadius:12}}>
          오늘 반등봉 조건 만족 종목 없음<br/>
          <span style={{fontSize:11}}>(+5~28% / 50억+ / 몸통 40%+ / 윗꼬리 30% 미만)</span>
        </div>
      )}

      {/* 후보 카드 */}
      <div style={{display:'flex', flexDirection:'column', gap:8}}>
        {candidates.map((s, i) => {
          const v = verified[s.code];
          const isVerifying = verifying[s.code];
          const matched = v && v.matched;
          const ch = +s.change || 0;
          const amt = +s.amount || 0;
          return (
            <div key={s.code+'_'+i} style={{background:_T.card, border:'1px solid '+(matched?'#10b981':_T.line), borderRadius:11, padding:'12px 14px'}}>
              <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', gap:10, flexWrap:'wrap'}}>
                <div style={{display:'flex', alignItems:'baseline', gap:8, flexWrap:'wrap'}}>
                  {matched && <span style={{padding:'2px 8px', borderRadius:6, fontSize:11, fontWeight:800, background:v.grade==='S'?'rgba(220,38,38,0.12)':'rgba(37,99,235,0.12)', color:v.grade==='S'?'#dc2626':'#2563eb'}}>{v.grade==='S'?'🔴 S':'🔵 A'}</span>}
                  <span style={{fontSize:14, fontWeight:800, color:_T.text}}>{s.name}</span>
                  <span style={{fontSize:11, color:_T.mute}}>{s.code}</span>
                  <span style={{fontSize:12, color:_T.sub}}>{s.market}</span>
                  {matched && <span style={{padding:'1px 6px', borderRadius:4, fontSize:10, fontWeight:700, background:'rgba(16,185,129,0.18)', color:'#10b981'}}>✓ 기준봉 매칭</span>}
                  {v && v.matched === false && <span style={{padding:'1px 6px', borderRadius:4, fontSize:10, fontWeight:700, background:'rgba(139,148,158,0.18)', color:_T.sub}}>기준봉 없음</span>}
                  {v && v.error && <span style={{padding:'1px 6px', borderRadius:4, fontSize:10, fontWeight:700, background:'rgba(248,81,73,0.18)', color:_T.up}}>⚠️ {v.error}</span>}
                </div>
                <div style={{display:'flex', alignItems:'baseline', gap:8}}>
                  <span style={{fontSize:18, fontWeight:900, color:_T.up}}>+{ch.toFixed(2)}%</span>
                  <span style={{fontSize:12, color:_T.sub}}>{amt}억</span>
                </div>
              </div>
              {/* 반등봉 정보 */}
              <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(105px, 1fr))', gap:6, marginTop:8}}>
                <Mini l="등락" v={`+${ch.toFixed(2)}%`} c={_T.up} _T={_T} />
                <Mini l="거래대금" v={`${amt}억`} _T={_T} />
                <Mini l="몸통" v={`${_fmt(s.bodyPct,0)}%`} _T={_T} />
                <Mini l="윗꼬리" v={`${_fmt(s.upperPct,0)}%`} _T={_T} />
                <Mini l="종가위치" v={`${_fmt(s.rangePos*100,0)}%`} _T={_T} />
                <Mini l="수급" v={s.investor||'-'} _T={_T} />
              </div>

              {/* 기준봉 정보 (검증 후) */}
              {matched && (
                <div style={{marginTop:8, paddingTop:8, borderTop:'1px solid '+_T.linelt}}>
                  <div style={{fontSize:11, fontWeight:800, color:'#a855f7', marginBottom:6}}>● 기준봉 ({v.bar.date}, D+{v.dPlus})</div>
                  <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(105px, 1fr))', gap:6}}>
                    <Mini l="등락" v={`+${_fmt(v.baseChg,2)}%`} c={_T.up} _T={_T} />
                    <Mini l="거래대금" v={`${_fmt(v.baseVolBil,0)}억`} _T={_T} />
                    <Mini l="배율" v={`${_fmt(v.baseRatio,2)}배`} _T={_T} />
                    <Mini l="종가위치" v={`${_fmt(v.rngPos*100,0)}%`} _T={_T} />
                    <Mini l="조정깊이" v={`${_fmt(v.pbDepth,2)}%`} c={_T.down} _T={_T} />
                    <Mini l="투입금" v={v.grade==='S'?'20만':'10만'} _T={_T} />
                  </div>
                  <div style={{marginTop:8, padding:'6px 10px', background:'rgba(16,185,129,0.10)', borderRadius:6, fontSize:11, color:_T.body}}>
                    💡 매수: <b style={{color:_T.text}}>{_won(s.price||s.close)}원 (오늘 종가)</b> × {v.grade==='S'?'20':'10'}만원 / 추매: <b style={{color:_T.text}}>{_won((+s.price||+s.close||0)*0.85)}원 (-15%)</b>
                  </div>
                </div>
              )}

              {/* 검증 버튼 */}
              {!v && (
                <button onClick={()=>verifyBase(s)} disabled={isVerifying} style={{marginTop:8, padding:'6px 12px', borderRadius:7, border:'1px solid '+_T.line, background:_T.bg, color:_T.body, fontSize:11, fontWeight:700, cursor:isVerifying?'wait':'pointer'}}>{isVerifying?'⏳ 검증 중':'🔍 기준봉 검증 (과거 60일 OHLC)'}</button>
              )}
            </div>
          );
        })}
      </div>
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
