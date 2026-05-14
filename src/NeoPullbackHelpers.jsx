// 네오 눌림목 반등매매법 컴포넌트
import React, { useState, useMemo } from "react";
import { PULLBACK, PULLBACK_HEADERS } from "./data_neo_pullback.js";

// 컬럼 인덱스
const C = {
  YEAR:0, MONTH:1, DATE:2, NAME:3, CODE:4, GRADE:5, INVEST:6,
  BASE_DATE:7, D:8, BASE_CH:9, BASE_MULT:10, BASE_AMT:11, BASE_POS:12,
  REBOUND_CH:13, REBOUND_AMT:14, REBOUND_BODY:15, REBOUND_WICK:16, DEPTH:17,
  BUY1:18, ADD_FIRED:19, ADD_DATE:20, ADD_PRICE:21,
  TP1:22, TP1_DAY:23, TP1_PRICE:24, TP2:25, TP2_DAY:26, TP2_PRICE:27,
  PEAK60:28, TROUGH60:29, RET60:30, HOLD:31, INPROG:32
};

const _fmt = (v, d=2) => (v==null || v==='' || isNaN(+v)) ? '-' : (+v).toFixed(d);
const _won = (v) => v==null || v==='' || isNaN(+v) ? '-' : (+v).toLocaleString();
const _gradeColor = (g) => g === 'S' ? '#dc2626' : '#2563eb';
const _gradeBg = (g) => g === 'S' ? 'rgba(220,38,38,0.12)' : 'rgba(37,99,235,0.12)';

export function NeoPullbackTab({ theme = "dark" }) {
  const _T = theme === "dark"
    ? { text:'#e6edf3', body:'#c9d1d9', sub:'#8b949e', hint:'#6e7681', mute:'#484f58', line:'#30363d', linelt:'#21262d', bg:'#0d1117', card:'#161b22', up:'#f85149', down:'#58a6ff', accent:'#7c3aed' }
    : { text:'#191f28', body:'#333d4b', sub:'#4e5968', hint:'#6b7684', mute:'#8b95a1', line:'#e5e8eb', linelt:'#f2f4f6', bg:'#f9fafb', card:'#ffffff', up:'#f04452', down:'#1f6dee', accent:'#7c3aed' };

  const [yearFilter, setYearFilter] = useState('all');
  const [gradeFilter, setGradeFilter] = useState('all');
  const [sortKey, setSortKey] = useState('date_desc');
  const [expanded, setExpanded] = useState({});  // index -> bool
  const [showAll, setShowAll] = useState(false);

  const filtered = useMemo(() => {
    let arr = PULLBACK.filter(r => {
      if (yearFilter !== 'all' && +r[C.YEAR] !== +yearFilter) return false;
      if (gradeFilter !== 'all' && r[C.GRADE] !== gradeFilter) return false;
      return true;
    });
    if (sortKey === 'date_desc') arr = [...arr].sort((a,b)=>String(b[C.DATE]).localeCompare(String(a[C.DATE])));
    else if (sortKey === 'date_asc') arr = [...arr].sort((a,b)=>String(a[C.DATE]).localeCompare(String(b[C.DATE])));
    else if (sortKey === 'ret_desc') arr = [...arr].sort((a,b)=>(+b[C.RET60]||0)-(+a[C.RET60]||0));
    else if (sortKey === 'ret_asc') arr = [...arr].sort((a,b)=>(+a[C.RET60]||0)-(+b[C.RET60]||0));
    return arr;
  }, [yearFilter, gradeFilter, sortKey]);

  const stats = useMemo(() => {
    const completed = filtered.filter(r => !r[C.INPROG]);
    if (!completed.length) return null;
    const n = completed.length;
    const rets = completed.map(r => +r[C.RET60] || 0);
    const sum = rets.reduce((a,b)=>a+b, 0);
    const avg = sum / n;
    const winCnt = rets.filter(r => r > 0).length;
    const tp1Cnt = completed.filter(r => r[C.TP1] === 'Y').length;
    const tp2Cnt = completed.filter(r => r[C.TP2] === 'Y').length;
    // CSV 정확 — 투입금이 이미 추매 반영 (추매 시 base×2)
    const addCnt = completed.filter(r => r[C.ADD_FIRED] === 'Y').length;
    const totalInvest = completed.reduce((a,r) => a + (+r[C.INVEST]||0), 0);
    const totalPnl = completed.reduce((a,r) => a + (+r[C.INVEST]||0) * (+r[C.RET60]||0) / 100, 0);
    const capitalRet = totalInvest > 0 ? (totalPnl/totalInvest*100) : 0;
    const inprog = filtered.filter(r => r[C.INPROG]).length;
    return { n, avg, winRate: winCnt/n*100, tp1Rate: tp1Cnt/n*100, tp2Rate: tp2Cnt/n*100, addRate: addCnt/n*100, capitalRet, totalInvest, totalPnl, inprog };
  }, [filtered]);

  const years = ['all', ...Array.from(new Set(PULLBACK.map(r=>+r[C.YEAR]))).sort((a,b)=>b-a)];
  const displayLimit = showAll ? filtered.length : 100;
  const display = filtered.slice(0, displayLimit);

  return (
    <div style={{padding:'4px 0', color:_T.text}}>
      {/* 룰 카드 */}
      <div style={{background:_T.card, border:'1px solid '+_T.line, borderRadius:12, padding:'14px 16px', marginBottom:10, fontSize:13, lineHeight:1.7, color:_T.body}}>
        <div style={{fontSize:14, fontWeight:800, color:_T.text, marginBottom:8, letterSpacing:'-0.3px'}}>📘 네오 눌림목 반등매매법</div>
        <div style={{fontSize:12, color:_T.sub}}>
          <b style={{color:_T.text}}>기준봉</b>: +15~30% / 1,000억+ / 배율 3배+ / 종가 상위 70%+
        </div>
        <div style={{fontSize:12, color:_T.sub, marginTop:3}}>
          <b style={{color:_T.text}}>반등봉</b>: +5~28% / 50억+ / 몸통 40%+ / 윗꼬리 30% 미만 / 1~60일 이내
        </div>
        <div style={{fontSize:12, color:_T.sub, marginTop:3}}>
          <b style={{color:_gradeColor('S')}}>🔴 S급</b>: 기준봉 +25%↑+2천억+ AND D+1~10 OR 기준봉 5천억+ OR 기준봉 +28%+
        </div>
        <div style={{fontSize:12, color:_T.sub, marginTop:3}}>
          <b style={{color:_T.text}}>매수</b>: D0 종가 100% (A=10만/S=20만) → -15% 추가매수 1회 / <b style={{color:_T.text}}>매도</b>: TP1 +100% 50% / TP2 +200% 잔여 / 60일 만기 (무손절)
        </div>
      </div>

      {/* 통계 */}
      {stats && (
        <div style={{background:_T.card, border:'1px solid '+_T.line, borderRadius:12, padding:'14px 16px', marginBottom:10}}>
          <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(110px,1fr))', gap:8}}>
            <Stat l="총 신호" v={stats.n+'건'} sub={stats.inprog>0?`+${stats.inprog} 진행중`:''} _T={_T} />
            <Stat l="평균 실현" v={(stats.avg>=0?'+':'')+stats.avg.toFixed(2)+'%'} c={stats.avg>=0?_T.up:_T.down} _T={_T} />
            <Stat l="승률" v={stats.winRate.toFixed(1)+'%'} _T={_T} />
            <Stat l="TP1 도달" v={stats.tp1Rate.toFixed(1)+'%'} sub="50% 익절" _T={_T} />
            <Stat l="TP2 도달" v={stats.tp2Rate.toFixed(1)+'%'} sub="잔여 청산" _T={_T} />
            <Stat l="추가매수" v={stats.addRate.toFixed(1)+'%'} sub="-15% 도달" _T={_T} />
            <Stat l="자본수익률" v={(stats.capitalRet>=0?'+':'')+stats.capitalRet.toFixed(2)+'%'} c={stats.capitalRet>=0?_T.up:_T.down} _T={_T} />
            <Stat l="총 손익" v={(stats.totalPnl>=0?'+':'')+Math.round(stats.totalPnl).toLocaleString()+'만'} c={stats.totalPnl>=0?_T.up:_T.down} sub={`투입 ${Math.round(stats.totalInvest).toLocaleString()}만`} _T={_T} />
          </div>
        </div>
      )}

      {/* 필터 */}
      <div style={{background:_T.card, border:'1px solid '+_T.line, borderRadius:12, padding:'10px 12px', marginBottom:10}}>
        <div style={{display:'flex', gap:6, marginBottom:6, flexWrap:'wrap', alignItems:'center'}}>
          <span style={{fontSize:12, color:_T.sub, fontWeight:700, marginRight:2}}>년도</span>
          {years.map(y => (
            <button key={y} onClick={()=>setYearFilter(y)} style={{padding:'4px 10px', borderRadius:6, border:'1px solid '+_T.line, background:yearFilter===y?_T.accent:_T.bg, color:yearFilter===y?'#fff':_T.body, fontSize:12, fontWeight:yearFilter===y?700:500, cursor:'pointer'}}>{y==='all'?'전체':y}</button>
          ))}
        </div>
        <div style={{display:'flex', gap:6, flexWrap:'wrap', alignItems:'center'}}>
          <span style={{fontSize:12, color:_T.sub, fontWeight:700, marginRight:2}}>등급</span>
          {[{k:'all',l:'전체',c:_T.accent},{k:'S',l:'🔴 S급',c:'#dc2626'},{k:'A',l:'🔵 일반A',c:'#2563eb'}].map(g => (
            <button key={g.k} onClick={()=>setGradeFilter(g.k)} style={{padding:'4px 10px', borderRadius:6, border:'1px solid '+_T.line, background:gradeFilter===g.k?g.c:_T.bg, color:gradeFilter===g.k?'#fff':_T.body, fontSize:12, fontWeight:gradeFilter===g.k?700:500, cursor:'pointer'}}>{g.l}</button>
          ))}
          <span style={{fontSize:12, color:_T.sub, fontWeight:700, marginLeft:8, marginRight:2}}>정렬</span>
          <select value={sortKey} onChange={e=>setSortKey(e.target.value)} style={{padding:'4px 8px', borderRadius:6, border:'1px solid '+_T.line, background:_T.bg, color:_T.body, fontSize:12, fontWeight:600, cursor:'pointer'}}>
            <option value="date_desc">최신순</option>
            <option value="date_asc">오래된순</option>
            <option value="ret_desc">수익↑</option>
            <option value="ret_asc">수익↓</option>
          </select>
        </div>
      </div>

      {/* 카드 리스트 */}
      <div style={{display:'flex', flexDirection:'column', gap:8}}>
        {display.map((r, i) => {
          const idx = `${r[C.DATE]}_${r[C.CODE]}_${i}`;
          const isOpen = !!expanded[idx];
          const ret = +r[C.RET60] || 0;
          const grade = r[C.GRADE];
          const trough = +r[C.TROUGH60] || 0;
          const buy1 = +r[C.BUY1] || 0;
          // CSV 정확 (수정된 시뮬레이터) — ADD_FIRED/ADD_DATE/ADD_PRICE 그대로 사용
          const addFired = r[C.ADD_FIRED] === 'Y';
          const addDate = r[C.ADD_DATE];
          const addPrice = r[C.ADD_PRICE];
          return (
            <div key={idx} style={{background:_T.card, border:'1px solid '+_T.line, borderRadius:11, padding:'12px 14px', cursor:'pointer'}} onClick={()=>setExpanded(p=>({...p, [idx]: !isOpen}))}>
              {/* 헤더: 종목/등급/날짜 + 수익률 */}
              <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', gap:10, flexWrap:'wrap'}}>
                <div style={{display:'flex', alignItems:'baseline', gap:8, flexWrap:'wrap', minWidth:0}}>
                  <span style={{padding:'2px 8px', borderRadius:6, fontSize:11, fontWeight:800, background:_gradeBg(grade), color:_gradeColor(grade), whiteSpace:'nowrap'}}>{grade==='S'?'🔴 S':'🔵 A'}</span>
                  <span style={{fontSize:14, fontWeight:800, color:_T.text, letterSpacing:'-0.3px'}}>{r[C.NAME]}</span>
                  <span style={{fontSize:11, color:_T.mute, fontWeight:500}}>{String(r[C.CODE]).padStart(6,'0')}</span>
                  <span style={{fontSize:12, color:_T.sub, marginLeft:4}}>매수 {String(r[C.DATE]).slice(2)}</span>
                  {r[C.INPROG] && <span style={{padding:'1px 6px', borderRadius:4, fontSize:10, fontWeight:700, background:'rgba(245,158,11,0.18)', color:'#f59e0b'}}>진행중</span>}
                </div>
                <div style={{display:'flex', alignItems:'baseline', gap:8}}>
                  <span style={{fontSize:18, fontWeight:900, color:ret>=0?_T.up:_T.down, letterSpacing:'-0.5px'}}>{ret>=0?'+':''}{ret.toFixed(2)}%</span>
                  <span style={{fontSize:11, color:_T.sub}}>{r[C.HOLD]}일</span>
                  <span style={{fontSize:14, color:_T.mute, transform:isOpen?'rotate(180deg)':'none', transition:'transform .15s'}}>▾</span>
                </div>
              </div>

              {/* 요약 한 줄 (접힘 상태) */}
              {!isOpen && (
                <div style={{display:'flex', gap:10, marginTop:8, flexWrap:'wrap', fontSize:12, color:_T.body}}>
                  <Tag k="기준봉" v={`+${_fmt(r[C.BASE_CH],1)}% (${r[C.D]})`} _T={_T} />
                  <Tag k="반등" v={`+${_fmt(r[C.REBOUND_CH],2)}%`} _T={_T} />
                  <Tag k="TP1" v={r[C.TP1]==='Y'?`✅ ${r[C.TP1_DAY]}일`:'미달'} c={r[C.TP1]==='Y'?_T.up:_T.mute} _T={_T} />
                  <Tag k="추매" v={addFired?`✅ ${addDate}일`:'미발동'} c={addFired?_T.up:_T.mute} _T={_T} />
                  <Tag k="60일peak" v={`+${_fmt(r[C.PEAK60],1)}%`} c={_T.up} _T={_T} />
                </div>
              )}

              {/* 상세 (펼침 상태) */}
              {isOpen && (
                <div style={{marginTop:10, paddingTop:10, borderTop:'1px solid '+_T.linelt}}>
                  {/* Section 1: 기준봉 정보 */}
                  <Section title="기준봉" col="#a855f7" _T={_T}>
                    <Field l="발생일" v={r[C.BASE_DATE]} _T={_T} />
                    <Field l="경과일" v={r[C.D]} _T={_T} />
                    <Field l="등락률" v={`+${_fmt(r[C.BASE_CH],2)}%`} c={_T.up} _T={_T} />
                    <Field l="거래대금" v={`${_fmt(r[C.BASE_AMT],0)}억`} _T={_T} />
                    <Field l="거래배율" v={`${_fmt(r[C.BASE_MULT],2)}배`} _T={_T} />
                    <Field l="종가위치" v={`${_fmt((+r[C.BASE_POS]||0)*100,0)}%`} _T={_T} />
                  </Section>

                  {/* Section 2: 반등봉 정보 */}
                  <Section title="반등봉 (D0)" col="#10b981" _T={_T}>
                    <Field l="등락률" v={`+${_fmt(r[C.REBOUND_CH],2)}%`} c={_T.up} _T={_T} />
                    <Field l="거래대금" v={`${_fmt(r[C.REBOUND_AMT],0)}억`} _T={_T} />
                    <Field l="몸통" v={`${_fmt(r[C.REBOUND_BODY],0)}%`} _T={_T} />
                    <Field l="윗꼬리" v={`${_fmt(r[C.REBOUND_WICK],0)}%`} _T={_T} />
                    <Field l="조정깊이" v={`${_fmt(r[C.DEPTH],2)}%`} c={_T.down} _T={_T} />
                    <Field l="투입금" v={`${r[C.INVEST]}만원`} _T={_T} />
                  </Section>

                  {/* Section 3: 매수 정보 */}
                  <Section title="매수 (D0 종가 100% → -15% 추매)" col="#f59e0b" _T={_T}>
                    <Field l="1차 매수가" v={_won(buy1)} _T={_T} />
                    <Field l="추매 발동" v={addFired?'Y':'N'} c={addFired?_T.up:_T.mute} _T={_T} />
                    <Field l="추매 도달일" v={addFired?`${addDate}일차`:'-'} _T={_T} />
                    <Field l="추매 가격" v={addPrice?_won(addPrice):'-'} _T={_T} />
                  </Section>

                  {/* Section 4: 매도 정보 */}
                  <Section title="매도" col="#0ea5e9" _T={_T}>
                    <Field l="TP1 도달" v={r[C.TP1]||'-'} c={r[C.TP1]==='Y'?_T.up:_T.mute} _T={_T} />
                    <Field l="TP1 일차" v={r[C.TP1_DAY]?`${r[C.TP1_DAY]}일`:'-'} _T={_T} />
                    <Field l="TP1 가격" v={r[C.TP1_PRICE]?_won(r[C.TP1_PRICE]):'-'} _T={_T} />
                    <Field l="TP2 도달" v={r[C.TP2]||'-'} c={r[C.TP2]==='Y'?_T.up:_T.mute} _T={_T} />
                    <Field l="TP2 일차" v={r[C.TP2_DAY]?`${r[C.TP2_DAY]}일`:'-'} _T={_T} />
                    <Field l="TP2 가격" v={r[C.TP2_PRICE]?_won(r[C.TP2_PRICE]):'-'} _T={_T} />
                  </Section>

                  {/* Section 5: 60일 결과 */}
                  <Section title="60일 결과" col={ret>=0?_T.up:_T.down} _T={_T}>
                    <Field l="60일 peak" v={`+${_fmt(r[C.PEAK60],2)}%`} c={_T.up} _T={_T} />
                    <Field l="60일 trough" v={`${_fmt(r[C.TROUGH60],2)}%`} c={_T.down} _T={_T} />
                    <Field l="최종 실현" v={`${ret>=0?'+':''}${_fmt(ret,2)}%`} c={ret>=0?_T.up:_T.down} bold _T={_T} />
                    <Field l="보유일" v={`${r[C.HOLD]}일`} _T={_T} />
                    <Field l="상태" v={r[C.INPROG]?'진행중':'완료'} c={r[C.INPROG]?'#f59e0b':_T.sub} _T={_T} />
                  </Section>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* 페이지네이션 */}
      {filtered.length > displayLimit && !showAll && (
        <div style={{padding:'14px', textAlign:'center', marginTop:8}}>
          <button onClick={()=>setShowAll(true)} style={{padding:'10px 24px', borderRadius:8, border:'1px solid '+_T.line, background:_T.card, color:_T.body, fontSize:13, fontWeight:700, cursor:'pointer'}}>
            전체 {filtered.length.toLocaleString()}건 더 보기 (현재 {displayLimit}건 표시)
          </button>
        </div>
      )}
      {showAll && (
        <div style={{padding:'10px', textAlign:'center', fontSize:12, color:_T.sub}}>
          전체 {filtered.length.toLocaleString()}건 표시 중 — <button onClick={()=>setShowAll(false)} style={{padding:'2px 8px', border:'none', background:'transparent', color:_T.accent, fontSize:12, fontWeight:700, cursor:'pointer'}}>100건만 보기</button>
        </div>
      )}
    </div>
  );
}

function Stat({ l, v, sub, c, _T }) {
  return (
    <div style={{padding:'8px 10px', background:_T.bg, borderRadius:9, border:'1px solid '+_T.line}}>
      <div style={{fontSize:11, color:_T.hint, fontWeight:600, marginBottom:3}}>{l}</div>
      <div style={{fontSize:15, fontWeight:800, color:c||_T.text, letterSpacing:'-0.3px'}}>{v}</div>
      {sub && <div style={{fontSize:10, color:_T.sub, marginTop:2}}>{sub}</div>}
    </div>
  );
}

function Tag({ k, v, c, _T }) {
  return (
    <span style={{fontSize:12, color:_T.sub}}>
      {k} <b style={{color:c||_T.body, marginLeft:2}}>{v}</b>
    </span>
  );
}

function Section({ title, col, children, _T }) {
  return (
    <div style={{marginBottom:10}}>
      <div style={{fontSize:11, fontWeight:800, color:col, letterSpacing:'-0.2px', marginBottom:6}}>● {title}</div>
      <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(110px, 1fr))', gap:6}}>
        {children}
      </div>
    </div>
  );
}

function Field({ l, v, c, bold, _T }) {
  return (
    <div style={{padding:'6px 9px', background:_T.bg, borderRadius:7, border:'1px solid '+_T.linelt}}>
      <div style={{fontSize:10, color:_T.hint, fontWeight:600, marginBottom:2}}>{l}</div>
      <div style={{fontSize:bold?14:12, fontWeight:bold?800:700, color:c||_T.text, letterSpacing:'-0.2px', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap'}}>{v}</div>
    </div>
  );
}
