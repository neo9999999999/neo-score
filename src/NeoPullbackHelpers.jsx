// 네오 눌림목 반등매매법 컴포넌트
import React, { useState, useMemo } from "react";
import { PULLBACK, PULLBACK_HEADERS } from "./data_neo_pullback.js";

// 컬럼 인덱스 (가독성)
const C = {
  YEAR:0, MONTH:1, DATE:2, NAME:3, CODE:4, GRADE:5, INVEST:6,
  BASE_DATE:7, D:8, BASE_CH:9, BASE_MULT:10, BASE_AMT:11, BASE_POS:12,
  REBOUND_CH:13, REBOUND_AMT:14, REBOUND_BODY:15, REBOUND_WICK:16, DEPTH:17,
  BUY1:18, ADD_FIRED:19, ADD_DATE:20, ADD_PRICE:21,
  TP1:22, TP1_DAY:23, TP1_PRICE:24, TP2:25, TP2_DAY:26, TP2_PRICE:27,
  PEAK60:28, TROUGH60:29, RET60:30, HOLD:31, INPROG:32
};

const _fmt = (v, d=2) => (v==null || v==='' || isNaN(+v)) ? '' : (+v).toFixed(d);
const _pct = (v) => v==null || v==='' || isNaN(+v) ? '' : ((+v)>=0?'+':'')+(+v).toFixed(2)+'%';
const _won = (v) => v==null || v==='' || isNaN(+v) ? '' : (+v).toLocaleString();

// 등급 색상
const _gradeColor = (g) => g === 'S' ? '#dc2626' : '#2563eb';
const _gradeBg = (g) => g === 'S' ? 'rgba(220,38,38,0.10)' : 'rgba(37,99,235,0.10)';

export function NeoPullbackTab({ theme = "dark" }) {
  const _T = theme === "dark"
    ? { text:'#e6edf3', body:'#c9d1d9', sub:'#8b949e', hint:'#6e7681', mute:'#484f58', line:'#30363d', linelt:'#21262d', bg:'#0d1117', card:'#161b22', up:'#f85149', down:'#58a6ff', accent:'#7c3aed' }
    : { text:'#191f28', body:'#333d4b', sub:'#4e5968', hint:'#6b7684', mute:'#8b95a1', line:'#e5e8eb', linelt:'#f2f4f6', bg:'#f9fafb', card:'#ffffff', up:'#f04452', down:'#1f6dee', accent:'#7c3aed' };

  const [yearFilter, setYearFilter] = useState('all');
  const [gradeFilter, setGradeFilter] = useState('all'); // all/A/S
  const [sortKey, setSortKey] = useState('date_desc'); // date_desc / date_asc / ret_desc / ret_asc

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

  // 통계
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
    const addCnt = completed.filter(r => r[C.ADD_FIRED] === 'Y').length;
    // 자본 수익 (투입금 만원 기준)
    const totalInvest = completed.reduce((a,r) => a + (+r[C.INVEST]||0) * (r[C.ADD_FIRED]==='Y'?2:1), 0);
    const totalPnl = completed.reduce((a,r) => a + (+r[C.INVEST]||0) * (r[C.ADD_FIRED]==='Y'?2:1) * (+r[C.RET60]||0) / 100, 0);
    const capitalRet = totalInvest > 0 ? (totalPnl/totalInvest*100) : 0;
    const inprog = filtered.filter(r => r[C.INPROG]).length;
    return { n, avg, winRate: winCnt/n*100, tp1Rate: tp1Cnt/n*100, tp2Rate: tp2Cnt/n*100, addRate: addCnt/n*100, capitalRet, totalInvest, totalPnl, inprog };
  }, [filtered]);

  const years = ['all', ...Array.from(new Set(PULLBACK.map(r=>+r[C.YEAR]))).sort((a,b)=>b-a)];

  return (
    <div style={{padding:'4px 0', color:_T.text}}>
      {/* 룰 카드 */}
      <div style={{background:_T.card, border:'1px solid '+_T.line, borderRadius:12, padding:'14px 16px', marginBottom:10, fontSize:13, lineHeight:1.7, color:_T.body}}>
        <div style={{fontSize:14, fontWeight:800, color:_T.text, marginBottom:8, letterSpacing:'-0.3px'}}>📘 네오 눌림목 반등매매법</div>
        <div style={{fontSize:12, color:_T.sub}}>
          <b style={{color:_T.text}}>기준봉</b>: +15~30% / 거래대금 1,000억+ / 배율 3배+ / 종가 상위 70%+ &nbsp;|&nbsp;
          <b style={{color:_T.text}}>반등봉</b>: +5~28% / 거래대금 50억+ / 몸통 40%+ / 윗꼬리 30% 미만 &nbsp;|&nbsp;
          기준봉 ~ 반등봉 1~60일 이내
        </div>
        <div style={{fontSize:12, color:_T.sub, marginTop:4}}>
          <b style={{color:_gradeColor('S')}}>S급</b>: 기준봉 +25%↑+2천억+ AND D+1~10일 OR 기준봉 5천억+ OR 기준봉 +28%+ &nbsp;|&nbsp;
          <b style={{color:_gradeColor('A')}}>일반A</b>: 그 외
        </div>
        <div style={{fontSize:12, color:_T.sub, marginTop:4}}>
          <b style={{color:_T.text}}>매수</b>: D0 종가 100% 매수 (A=10만/S=20만) → -15% 도달 시 추가매수 1회 &nbsp;|&nbsp;
          <b style={{color:_T.text}}>매도</b>: TP1 +100% 50% 익절 / TP2 +200% 잔여 청산 / 60일 만기 강제 청산 (무손절)
        </div>
      </div>

      {/* 통계 */}
      {stats && (
        <div style={{background:_T.card, border:'1px solid '+_T.line, borderRadius:12, padding:'14px 16px', marginBottom:10}}>
          <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(110px,1fr))', gap:10}}>
            <Stat l="총 신호" v={stats.n+'건'} sub={stats.inprog>0?`+${stats.inprog} 진행중`:''} _T={_T} />
            <Stat l="평균 실현" v={(stats.avg>=0?'+':'')+stats.avg.toFixed(2)+'%'} c={stats.avg>=0?_T.up:_T.down} _T={_T} />
            <Stat l="승률" v={stats.winRate.toFixed(1)+'%'} _T={_T} />
            <Stat l="TP1 도달" v={stats.tp1Rate.toFixed(1)+'%'} sub="50% 익절" _T={_T} />
            <Stat l="TP2 도달" v={stats.tp2Rate.toFixed(1)+'%'} sub="잔여 청산" _T={_T} />
            <Stat l="추가매수" v={stats.addRate.toFixed(1)+'%'} sub="-15% 도달" _T={_T} />
            <Stat l="자본 수익률" v={(stats.capitalRet>=0?'+':'')+stats.capitalRet.toFixed(2)+'%'} c={stats.capitalRet>=0?_T.up:_T.down} _T={_T} />
            <Stat l="총 손익" v={(stats.totalPnl>=0?'+':'')+stats.totalPnl.toFixed(0)+'만원'} c={stats.totalPnl>=0?_T.up:_T.down} sub={`투입 ${stats.totalInvest.toLocaleString()}만`} _T={_T} />
          </div>
        </div>
      )}

      {/* 필터 */}
      <div style={{display:'flex', gap:8, marginBottom:10, flexWrap:'wrap', alignItems:'center'}}>
        <span style={{fontSize:12, color:_T.sub, fontWeight:700}}>년도</span>
        {years.map(y => (
          <button key={y} onClick={()=>setYearFilter(y)} style={{padding:'5px 11px', borderRadius:7, border:'1px solid '+_T.line, background:yearFilter===y?_T.accent:_T.bg, color:yearFilter===y?'#fff':_T.body, fontSize:12, fontWeight:yearFilter===y?700:500, cursor:'pointer'}}>{y==='all'?'전체':y+'년'}</button>
        ))}
        <span style={{fontSize:12, color:_T.sub, fontWeight:700, marginLeft:8}}>등급</span>
        {['all','S','A'].map(g => (
          <button key={g} onClick={()=>setGradeFilter(g)} style={{padding:'5px 11px', borderRadius:7, border:'1px solid '+_T.line, background:gradeFilter===g?(g==='S'?'#dc2626':g==='A'?'#2563eb':_T.accent):_T.bg, color:gradeFilter===g?'#fff':_T.body, fontSize:12, fontWeight:gradeFilter===g?700:500, cursor:'pointer'}}>{g==='all'?'전체':g==='S'?'🔴 S급':'🔵 일반A'}</button>
        ))}
        <span style={{fontSize:12, color:_T.sub, fontWeight:700, marginLeft:8}}>정렬</span>
        <select value={sortKey} onChange={e=>setSortKey(e.target.value)} style={{padding:'5px 8px', borderRadius:7, border:'1px solid '+_T.line, background:_T.bg, color:_T.body, fontSize:12, fontWeight:600, cursor:'pointer'}}>
          <option value="date_desc">최신순</option>
          <option value="date_asc">오래된순</option>
          <option value="ret_desc">수익률 높은순</option>
          <option value="ret_asc">수익률 낮은순</option>
        </select>
      </div>

      {/* 테이블 */}
      <div style={{background:_T.card, border:'1px solid '+_T.line, borderRadius:12, overflow:'hidden'}}>
        <div style={{overflowX:'auto'}}>
          <table style={{width:'100%', minWidth:1400, borderCollapse:'collapse', fontSize:12}}>
            <thead>
              <tr style={{background:_T.linelt, borderBottom:'2px solid '+_T.line}}>
                {['반등일','종목','등급','투입','기준봉','D','기준등락','배율','거래대금','종가위','반등등락','반등억','몸통','윗꼬리','조정','매수가','추매','추매가','TP1','TP1일','TP1가','TP2','TP2일','TP2가','60일peak','60일low','60일실현','보유','상태'].map(h=>(
                  <th key={h} style={{padding:'8px 6px', textAlign:'center', fontSize:11, fontWeight:700, color:_T.sub, whiteSpace:'nowrap', letterSpacing:'-0.2px'}}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.slice(0,500).map((r,i) => (
                <tr key={i} style={{borderBottom:'1px solid '+_T.linelt, background:i%2?_T.bg:'transparent'}}>
                  <td style={{padding:'7px 5px', textAlign:'center', fontSize:11, color:_T.body, fontWeight:600}}>{String(r[C.DATE]||'').slice(2)}</td>
                  <td style={{padding:'7px 5px', textAlign:'left', fontWeight:700, fontSize:12, color:_T.text, whiteSpace:'nowrap'}}>{r[C.NAME]}<span style={{fontSize:10, color:_T.mute, marginLeft:4}}>{String(r[C.CODE]).padStart(6,'0')}</span></td>
                  <td style={{padding:'7px 5px', textAlign:'center'}}><span style={{padding:'1px 7px', borderRadius:5, fontSize:11, fontWeight:800, background:_gradeBg(r[C.GRADE]), color:_gradeColor(r[C.GRADE])}}>{r[C.GRADE]==='S'?'🔴 S':'🔵 A'}</span></td>
                  <td style={{padding:'7px 5px', textAlign:'right', fontSize:11, color:_T.body, fontWeight:600}}>{r[C.INVEST]}만</td>
                  <td style={{padding:'7px 5px', textAlign:'center', fontSize:11, color:_T.sub}}>{String(r[C.BASE_DATE]||'').slice(5)}</td>
                  <td style={{padding:'7px 5px', textAlign:'center', fontSize:11, color:_T.sub, fontWeight:600}}>{r[C.D]}</td>
                  <td style={{padding:'7px 5px', textAlign:'right', fontSize:11, color:_T.up, fontWeight:700}}>+{_fmt(r[C.BASE_CH],1)}%</td>
                  <td style={{padding:'7px 5px', textAlign:'right', fontSize:11, color:_T.body, fontWeight:600}}>{_fmt(r[C.BASE_MULT],1)}x</td>
                  <td style={{padding:'7px 5px', textAlign:'right', fontSize:11, color:_T.body}}>{_fmt(r[C.BASE_AMT],0)}억</td>
                  <td style={{padding:'7px 5px', textAlign:'right', fontSize:11, color:_T.body}}>{_fmt(r[C.BASE_POS]*100,0)}%</td>
                  <td style={{padding:'7px 5px', textAlign:'right', fontSize:11, color:_T.up, fontWeight:700}}>+{_fmt(r[C.REBOUND_CH],2)}%</td>
                  <td style={{padding:'7px 5px', textAlign:'right', fontSize:11, color:_T.body}}>{_fmt(r[C.REBOUND_AMT],0)}억</td>
                  <td style={{padding:'7px 5px', textAlign:'right', fontSize:11, color:_T.body}}>{_fmt(r[C.REBOUND_BODY],0)}%</td>
                  <td style={{padding:'7px 5px', textAlign:'right', fontSize:11, color:_T.body}}>{_fmt(r[C.REBOUND_WICK],0)}%</td>
                  <td style={{padding:'7px 5px', textAlign:'right', fontSize:11, color:_T.down, fontWeight:600}}>{_fmt(r[C.DEPTH],1)}%</td>
                  <td style={{padding:'7px 5px', textAlign:'right', fontSize:11, color:_T.body, fontWeight:700}}>{_won(r[C.BUY1])}</td>
                  <td style={{padding:'7px 5px', textAlign:'center', fontSize:11, fontWeight:700, color:r[C.ADD_FIRED]==='Y'?_T.up:_T.mute}}>{r[C.ADD_FIRED]||'-'}</td>
                  <td style={{padding:'7px 5px', textAlign:'right', fontSize:11, color:r[C.ADD_FIRED]==='Y'?_T.body:_T.mute}}>{r[C.ADD_PRICE]?_won(r[C.ADD_PRICE]):'-'}</td>
                  <td style={{padding:'7px 5px', textAlign:'center', fontSize:11, fontWeight:700, color:r[C.TP1]==='Y'?_T.up:_T.mute}}>{r[C.TP1]||'-'}</td>
                  <td style={{padding:'7px 5px', textAlign:'right', fontSize:11, color:r[C.TP1]==='Y'?_T.body:_T.mute}}>{r[C.TP1_DAY]||'-'}</td>
                  <td style={{padding:'7px 5px', textAlign:'right', fontSize:11, color:r[C.TP1]==='Y'?_T.body:_T.mute}}>{r[C.TP1_PRICE]?_won(r[C.TP1_PRICE]):'-'}</td>
                  <td style={{padding:'7px 5px', textAlign:'center', fontSize:11, fontWeight:700, color:r[C.TP2]==='Y'?_T.up:_T.mute}}>{r[C.TP2]||'-'}</td>
                  <td style={{padding:'7px 5px', textAlign:'right', fontSize:11, color:r[C.TP2]==='Y'?_T.body:_T.mute}}>{r[C.TP2_DAY]||'-'}</td>
                  <td style={{padding:'7px 5px', textAlign:'right', fontSize:11, color:r[C.TP2]==='Y'?_T.body:_T.mute}}>{r[C.TP2_PRICE]?_won(r[C.TP2_PRICE]):'-'}</td>
                  <td style={{padding:'7px 5px', textAlign:'right', fontSize:11, color:_T.up}}>+{_fmt(r[C.PEAK60],1)}%</td>
                  <td style={{padding:'7px 5px', textAlign:'right', fontSize:11, color:_T.down}}>{_fmt(r[C.TROUGH60],1)}%</td>
                  <td style={{padding:'7px 5px', textAlign:'right', fontSize:13, fontWeight:800, color:(+r[C.RET60]||0)>=0?_T.up:_T.down}}>{(+r[C.RET60]||0)>=0?'+':''}{_fmt(r[C.RET60],2)}%</td>
                  <td style={{padding:'7px 5px', textAlign:'center', fontSize:11, color:_T.body}}>{r[C.HOLD]}일</td>
                  <td style={{padding:'7px 5px', textAlign:'center', fontSize:11, fontWeight:700, color:r[C.INPROG]?'#f59e0b':_T.sub}}>{r[C.INPROG]?'진행중':'완료'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length > 500 && (
          <div style={{padding:'10px 16px', background:_T.linelt, fontSize:12, color:_T.sub, textAlign:'center'}}>
            상위 500건 표시 (전체 {filtered.length}건). 필터를 좁혀서 정밀 조회하세요.
          </div>
        )}
      </div>
    </div>
  );
}

function Stat({ l, v, sub, c, _T }) {
  return (
    <div style={{padding:'8px 10px', background:_T.bg, borderRadius:9, border:'1px solid '+_T.line}}>
      <div style={{fontSize:11, color:_T.hint, fontWeight:600, marginBottom:3}}>{l}</div>
      <div style={{fontSize:16, fontWeight:800, color:c||_T.text, letterSpacing:'-0.3px'}}>{v}</div>
      {sub && <div style={{fontSize:10, color:_T.sub, marginTop:2}}>{sub}</div>}
    </div>
  );
}
