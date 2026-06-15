// OOS-style 신호 히스토리 (2019~2026) — 탭별 검출 종목 누적 표시
// 8,408건 백테스트 신호. 각 탭 자격 + D+1/D+5/D+10 시뮬 결과.
import React, { useState, useMemo } from "react";
import { OOS_HISTORY as OOS, OOS_HEADERS } from "./data_oos_history.js";

const C = {
  DATE:0, YEAR:1, CODE:2, NAME:3, MKT:4, CH:5, AMT:6,
  H60:7, H120:8, CUM5:9, MA_ALIGN:10, RNG_POS:11, BODY_PCT:12, UPPER_PCT:13,
  LEADER_RANK:14, LEADER_COUNT:15, SCORE_EST:16,
  Q_LEADER:17, Q_NEO25:18, Q_NEO90:19, Q_BEST01:20, Q_PULLBACK:21, Q_HS:22,
  CLOSE:23, D1_OPEN:24, D1_CLOSE:25, D1_HIGH:26, D1_TRAIL:27, D5:28, D10:29
};

const TABS = [
  { id:'leader',   l:'네오 대장주',  q:'Q_LEADER',   col:'#a855f7', desc:'10~28% / 500억+ / 시장 1,2,3등' },
  { id:'neo25',    l:'네오 25%',     q:'Q_NEO25',    col:'#c81e1e', desc:'15~29% / 5000억+ / 120일신고 / score 3+' },
  { id:'neo90',    l:'네오 90%',     q:'Q_NEO90',    col:'#10b981', desc:'15~29% / 50억+ / 5% 후 트레일' },
  { id:'best01',   l:'최고조합01',   q:'Q_BEST01',   col:'#f59e0b', desc:'15~28% / 1,2등 / 500억+ / score 3+ / 신고가' },
  { id:'pullback', l:'네오눌림목반등', q:'Q_PULLBACK', col:'#0ea5e9', desc:'5~28% / 50억+ / 몸통 40%+ / 윗꼬리 <30%' },
  { id:'hs',       l:'하승훈 종가',  q:'Q_HS',       col:'#0d9488', desc:'5+3 통과 (STRONG/BUY)' },
];

const EXIT_METHODS = [
  { id:'d1_open',  l:'D+1 시초가',  col:'#1f6dee', idx: C.D1_OPEN },
  { id:'d1_close', l:'D+1 종가',    col:'#0d8050', idx: C.D1_CLOSE },
  { id:'d1_trail', l:'D+1 트레일+5%', col:'#10b981', idx: C.D1_TRAIL },
  { id:'d5',       l:'D+5 종가',    col:'#f59e0b', idx: C.D5 },
  { id:'d10',      l:'D+10 종가',   col:'#a855f7', idx: C.D10 },
];

const _verdictColor = v => ({ STRONG:'#10b981', BUY:'#f59e0b', HOLD:'#f97316', EXCLUDE:'#94a3b8' })[v] || '#94a3b8';
const _verdictKR = v => ({ STRONG:'🟢 강력', BUY:'🟡 진입', HOLD:'🟠 보류', EXCLUDE:'🔴 제외' })[v] || '-';

export function OosHistoryTab({ theme = "dark" }) {
  const _T = theme === "dark"
    ? { text:'#e6edf3', body:'#c9d1d9', sub:'#8b949e', hint:'#6e7681', mute:'#484f58', line:'#30363d', linelt:'#21262d', bg:'#0d1117', card:'#161b22', up:'#f85149', down:'#58a6ff', accent:'#7c3aed', green:'#10b981' }
    : { text:'#191f28', body:'#333d4b', sub:'#4e5968', hint:'#6b7684', mute:'#8b95a1', line:'#e5e8eb', linelt:'#f2f4f6', bg:'#f9fafb', card:'#ffffff', up:'#f04452', down:'#1f6dee', accent:'#7c3aed', green:'#10b981' };

  const [activeTab, setActiveTab] = useState('leader');
  const [yearFilter, setYearFilter] = useState('all');
  const [exitMethod, setExitMethod] = useState('d1_trail');
  const [sortKey, setSortKey] = useState('date_desc');
  const [investAmt, setInvestAmt] = useState(() => { try { return +localStorage.getItem('oos_invest') || 100; } catch { return 100; } });
  const [showAll, setShowAll] = useState(false);

  const tabDef = TABS.find(t => t.id === activeTab);
  const exitDef = EXIT_METHODS.find(e => e.id === exitMethod);

  // 탭 자격 필터링
  const tabFiltered = useMemo(() => {
    return OOS.filter(r => {
      if (activeTab === 'hs') {
        return r[C.Q_HS] === 'STRONG' || r[C.Q_HS] === 'BUY';
      }
      const qIdx = C[tabDef.q];
      return !!r[qIdx];
    });
  }, [activeTab, tabDef]);

  // 년도 필터
  const filtered = useMemo(() => {
    let arr = yearFilter === 'all' ? tabFiltered : tabFiltered.filter(r => +r[C.YEAR] === +yearFilter);
    const idx = exitDef.idx;
    if (sortKey === 'date_desc') arr = [...arr].sort((a,b) => String(b[C.DATE]).localeCompare(String(a[C.DATE])));
    else if (sortKey === 'date_asc') arr = [...arr].sort((a,b) => String(a[C.DATE]).localeCompare(String(b[C.DATE])));
    else if (sortKey === 'ret_desc') arr = [...arr].sort((a,b) => (+b[idx]||0) - (+a[idx]||0));
    else if (sortKey === 'ret_asc') arr = [...arr].sort((a,b) => (+a[idx]||0) - (+b[idx]||0));
    else if (sortKey === 'ch_desc') arr = [...arr].sort((a,b) => (+b[C.CH]||0) - (+a[C.CH]||0));
    return arr;
  }, [tabFiltered, yearFilter, sortKey, exitDef]);

  // 년도별 통계
  const yearStats = useMemo(() => {
    const idx = exitDef.idx;
    const by = {};
    for (const r of tabFiltered) {
      const y = +r[C.YEAR];
      if (!by[y]) by[y] = { n:0, win:0, loss:0, flat:0, retSum:0 };
      by[y].n++;
      const ret = +r[idx] || 0;
      by[y].retSum += ret;
      if (ret >= 1) by[y].win++;
      else if (ret <= -1) by[y].loss++;
      else by[y].flat++;
    }
    return Object.entries(by).map(([y, s]) => ({
      year:+y, ...s,
      avg: s.n ? s.retSum/s.n : 0,
      winRate: s.n ? s.win/s.n*100 : 0,
      totalInvest: s.n * investAmt,
      totalPnl: s.n * investAmt * (s.retSum/Math.max(s.n,1)) / 100,
    })).sort((a,b) => a.year - b.year);
  }, [tabFiltered, exitDef, investAmt]);

  // 탭별 신호 count
  const tabCounts = useMemo(() => {
    const c = {};
    for (const t of TABS) c[t.id] = 0;
    for (const r of OOS) {
      for (const t of TABS) {
        if (t.id === 'hs') { if (r[C.Q_HS] === 'STRONG' || r[C.Q_HS] === 'BUY') c.hs++; }
        else if (r[C[t.q]]) c[t.id]++;
      }
    }
    return c;
  }, []);

  const years = ['all', ...Array.from(new Set(OOS.map(r => +r[C.YEAR]))).sort((a,b) => b-a)];
  const displayLimit = showAll ? filtered.length : 100;
  const display = filtered.slice(0, displayLimit);

  return (
    <div style={{padding:'4px 0', color:_T.text}}>
      {/* 헤더 */}
      <div style={{background:_T.card, border:'1px solid '+_T.line, borderRadius:12, padding:'12px 14px', marginBottom:10}}>
        <div style={{fontSize:14, fontWeight:800, color:_T.text, marginBottom:6}}>📊 OOS 신호 히스토리 (2019.06 ~ 2026.05)</div>
        <div style={{fontSize:11, color:_T.sub}}>전체 {OOS.length.toLocaleString()}건. 각 탭의 자격 조건 통과한 신호 누적. cache OHLC 백테스트 기준.</div>
        <div style={{fontSize:11, color:'#f59e0b', marginTop:3}}>⚠️ 2018년 데이터는 cache에 없음 (2019.06부터 가능). signals.json OOS 실시간은 2026.04~ (별도)</div>
      </div>

      {/* 탭 선택 */}
      <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(140px, 1fr))', gap:6, marginBottom:10}}>
        {TABS.map(t => {
          const a = activeTab === t.id;
          return (
            <button key={t.id} onClick={()=>setActiveTab(t.id)} style={{padding:'9px 10px', borderRadius:9, border:'1px solid '+(a?t.col:_T.line), background:a?t.col:_T.bg, color:a?'#fff':_T.body, cursor:'pointer', textAlign:'left'}}>
              <div style={{fontSize:12, fontWeight:800}}>{t.l}</div>
              <div style={{fontSize:11, opacity:a?0.85:0.6, marginTop:2}}>{tabCounts[t.id].toLocaleString()}건</div>
            </button>
          );
        })}
      </div>

      {/* 탭 설명 */}
      <div style={{padding:'8px 12px', background:_T.linelt, borderRadius:8, marginBottom:10, fontSize:11, color:_T.body}}>
        <b style={{color:tabDef.col}}>{tabDef.l}</b>: {tabDef.desc}
      </div>

      {/* 청산 방식 */}
      <div style={{display:'flex', gap:4, background:_T.linelt, borderRadius:8, padding:3, marginBottom:10, flexWrap:'wrap'}}>
        {EXIT_METHODS.map(e => {
          const a = exitMethod === e.id;
          return (
            <button key={e.id} onClick={()=>setExitMethod(e.id)} style={{flex:'1 1 auto',padding:'6px 8px',border:'none',background:a?e.col:'transparent',color:a?'#fff':_T.sub,borderRadius:6,cursor:'pointer',fontSize:11,fontWeight:a?800:600,whiteSpace:'nowrap'}}>{e.l}</button>
          );
        })}
      </div>

      {/* 투입금 */}
      <div style={{background:_T.card, border:'1px solid '+_T.line, borderRadius:10, padding:'8px 12px', marginBottom:10, display:'flex', alignItems:'center', gap:8, flexWrap:'wrap'}}>
        <span style={{fontSize:12, fontWeight:700}}>💰 종목당 투입금</span>
        <input type="number" value={investAmt} onChange={e=>{const v=Math.max(1,+e.target.value||1);setInvestAmt(v);try{localStorage.setItem('oos_invest',String(v));}catch{}}} style={{width:80,padding:'5px 8px',borderRadius:6,border:'1px solid '+_T.line,background:_T.bg,color:_T.text,fontSize:13,fontWeight:700,textAlign:'right'}}/>
        <span style={{fontSize:11, color:_T.sub}}>만원</span>
      </div>

      {/* 년도별 통계 테이블 */}
      <div style={{background:_T.card, border:'1px solid '+_T.line, borderRadius:12, padding:'12px 14px', marginBottom:10, overflowX:'auto'}}>
        <div style={{fontSize:12, fontWeight:800, marginBottom:8}}>📈 {tabDef.l} 년도별 ({exitDef.l} 매도 기준)</div>
        <table style={{width:'100%', minWidth:560, borderCollapse:'collapse', fontSize:12}}>
          <thead>
            <tr style={{background:_T.linelt, borderBottom:'2px solid '+_T.line}}>
              {['년도','신호','수익','손절','무사','승률','평균실현','자본수익률','총손익'].map(h => (
                <th key={h} style={{padding:'7px 6px', textAlign:'center', fontSize:11, fontWeight:700, color:_T.sub, whiteSpace:'nowrap'}}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {yearStats.map(s => {
              const cap = s.totalInvest>0 ? s.totalPnl/s.totalInvest*100 : 0;
              return (
                <tr key={s.year} style={{borderBottom:'1px solid '+_T.linelt}}>
                  <td style={{padding:'7px 6px', textAlign:'center', fontWeight:800, color:_T.text}}>{s.year}</td>
                  <td style={{padding:'7px 6px', textAlign:'right', color:_T.body, fontWeight:700}}>{s.n}</td>
                  <td style={{padding:'7px 6px', textAlign:'right', color:_T.up, fontWeight:700}}>{s.win}</td>
                  <td style={{padding:'7px 6px', textAlign:'right', color:_T.down, fontWeight:700}}>{s.loss}</td>
                  <td style={{padding:'7px 6px', textAlign:'right', color:_T.sub}}>{s.flat}</td>
                  <td style={{padding:'7px 6px', textAlign:'right', fontWeight:700}}>{s.winRate.toFixed(1)}%</td>
                  <td style={{padding:'7px 6px', textAlign:'right', fontWeight:700, color:s.avg>=0?_T.up:_T.down}}>{s.avg>=0?'+':''}{s.avg.toFixed(2)}%</td>
                  <td style={{padding:'7px 6px', textAlign:'right', fontWeight:800, color:cap>=0?_T.up:_T.down}}>{cap>=0?'+':''}{cap.toFixed(2)}%</td>
                  <td style={{padding:'7px 6px', textAlign:'right', fontWeight:800, color:s.totalPnl>=0?_T.up:_T.down}}>{s.totalPnl>=0?'+':''}{Math.round(s.totalPnl).toLocaleString()}만</td>
                </tr>
              );
            })}
            {(() => {
              const tot = yearStats.reduce((a,s) => ({n:a.n+s.n,win:a.win+s.win,loss:a.loss+s.loss,flat:a.flat+s.flat,retSum:a.retSum+s.retSum,totalInvest:a.totalInvest+s.totalInvest,totalPnl:a.totalPnl+s.totalPnl}), {n:0,win:0,loss:0,flat:0,retSum:0,totalInvest:0,totalPnl:0});
              const avg = tot.n ? tot.retSum/tot.n : 0;
              const wr = tot.n ? tot.win/tot.n*100 : 0;
              const cap = tot.totalInvest>0 ? tot.totalPnl/tot.totalInvest*100 : 0;
              return (
                <tr style={{borderTop:'2px solid '+_T.line, background:_T.linelt}}>
                  <td style={{padding:'8px 6px', textAlign:'center', fontWeight:800}}>합계</td>
                  <td style={{padding:'8px 6px', textAlign:'right', fontWeight:800}}>{tot.n}</td>
                  <td style={{padding:'8px 6px', textAlign:'right', color:_T.up, fontWeight:800}}>{tot.win}</td>
                  <td style={{padding:'8px 6px', textAlign:'right', color:_T.down, fontWeight:800}}>{tot.loss}</td>
                  <td style={{padding:'8px 6px', textAlign:'right', color:_T.sub}}>{tot.flat}</td>
                  <td style={{padding:'8px 6px', textAlign:'right', fontWeight:800}}>{wr.toFixed(1)}%</td>
                  <td style={{padding:'8px 6px', textAlign:'right', fontWeight:800, color:avg>=0?_T.up:_T.down}}>{avg>=0?'+':''}{avg.toFixed(2)}%</td>
                  <td style={{padding:'8px 6px', textAlign:'right', fontWeight:800, color:cap>=0?_T.up:_T.down, fontSize:13}}>{cap>=0?'+':''}{cap.toFixed(2)}%</td>
                  <td style={{padding:'8px 6px', textAlign:'right', fontWeight:800, color:tot.totalPnl>=0?_T.up:_T.down}}>{tot.totalPnl>=0?'+':''}{Math.round(tot.totalPnl).toLocaleString()}만</td>
                </tr>
              );
            })()}
          </tbody>
        </table>
      </div>

      {/* 필터 */}
      <div style={{display:'flex', gap:6, marginBottom:10, flexWrap:'wrap', alignItems:'center'}}>
        <span style={{fontSize:11, color:_T.sub, fontWeight:700}}>년도</span>
        {years.map(y => (
          <button key={y} onClick={()=>setYearFilter(y)} style={{padding:'4px 9px', borderRadius:6, border:'1px solid '+_T.line, background:yearFilter===y?_T.accent:_T.bg, color:yearFilter===y?'#fff':_T.body, fontSize:11, fontWeight:yearFilter===y?700:500, cursor:'pointer'}}>{y==='all'?'전체':y}</button>
        ))}
        <span style={{fontSize:11, color:_T.sub, fontWeight:700, marginLeft:8}}>정렬</span>
        <select value={sortKey} onChange={e=>setSortKey(e.target.value)} style={{padding:'4px 8px', borderRadius:6, border:'1px solid '+_T.line, background:_T.bg, color:_T.body, fontSize:11, fontWeight:600}}>
          <option value="date_desc">최신순</option>
          <option value="date_asc">오래된순</option>
          <option value="ret_desc">수익↑</option>
          <option value="ret_asc">수익↓</option>
          <option value="ch_desc">당일등락↑</option>
        </select>
      </div>

      {/* 종목 카드 */}
      <div style={{display:'flex', flexDirection:'column', gap:5}}>
        {display.map((r, i) => {
          const ret = +r[exitDef.idx] || 0;
          const ch = +r[C.CH] || 0;
          const isLeader = +r[C.LEADER_RANK] === 1;
          return (
            <div key={i} style={{background:_T.card, border:'1px solid '+(activeTab==='hs' && r[C.Q_HS]==='STRONG'?'#10b981':_T.line), borderRadius:8, padding:'8px 12px'}}>
              <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', gap:8, flexWrap:'wrap'}}>
                <div style={{display:'flex', alignItems:'baseline', gap:6, flexWrap:'wrap', minWidth:0}}>
                  <span style={{fontSize:13, fontWeight:800, color:_T.text}}>{r[C.NAME]}</span>
                  <span style={{fontSize:10, color:_T.mute}}>{r[C.CODE]}</span>
                  <span style={{fontSize:11, color:_T.sub}}>{r[C.DATE]}</span>
                  <span style={{fontSize:10, color:_T.mute}}>{r[C.MKT]}</span>
                  {isLeader && <span style={{padding:'1px 5px', borderRadius:3, fontSize:9, fontWeight:800, background:'rgba(220,38,38,0.18)', color:'#dc2626'}}>🏆 1등</span>}
                  {activeTab==='hs' && <span style={{padding:'1px 5px', borderRadius:3, fontSize:9, fontWeight:800, background:_verdictColor(r[C.Q_HS])+'33', color:_verdictColor(r[C.Q_HS])}}>{_verdictKR(r[C.Q_HS])}</span>}
                </div>
                <div style={{display:'flex', alignItems:'baseline', gap:8}}>
                  <span style={{fontSize:11, color:_T.sub}}>+{ch.toFixed(2)}% / {r[C.AMT]}억</span>
                  <span style={{fontSize:14, fontWeight:900, color:ret>=0?_T.up:_T.down}}>{ret>=0?'+':''}{ret.toFixed(2)}%</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filtered.length > displayLimit && !showAll && (
        <div style={{padding:'14px', textAlign:'center', marginTop:8}}>
          <button onClick={()=>setShowAll(true)} style={{padding:'10px 24px', borderRadius:8, border:'1px solid '+_T.line, background:_T.card, color:_T.body, fontSize:13, fontWeight:700, cursor:'pointer'}}>
            전체 {filtered.length.toLocaleString()}건 보기 (현재 {displayLimit}건)
          </button>
        </div>
      )}
    </div>
  );
}
