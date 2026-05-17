// 하승훈 종가베팅 백테스트 (2020~2026) — 7,276건
// R_xx 신호에 5+3 룰 평가 + D+1 시초가/종가/트레일 시뮬 결과
import React, { useState, useMemo } from "react";
import { HASEUNGHOON_BACKTEST as BT, HASEUNGHOON_HEADERS } from "./data_haseunghoon_backtest.js";

const C = {
  YEAR:0, DATE:1, NAME:2, CODE:3, MKT:4, CH:5, AMT:6, SUPPLY:7, SCORE:8,
  H60:9, H120:10, CUM5:11, MA_ALIGN:12, RNG_POS:13, IS_LEADER:14, LEADER_RANK:15,
  PASS_VOL:16, PASS_HIGH:17, PASS_LATE:18, PASS_LEADER:19, PASS_THEME:20,
  PASS_RET:21, PASS_CUM5:22, PASS_MA:23, MUST_PASS:24, SAFE_PASS:25,
  VERDICT:26, RET_OPEN:27, RET_CLOSE:28, RET_TRAIL:29, PRICE:30
};

const _won = (v) => v==null||v===''||isNaN(+v) ? '-' : Math.round(+v).toLocaleString();
const _fmt = (v, d=2) => v==null||v===''||isNaN(+v) ? '-' : (+v).toFixed(d);

function _verdictColor(v) {
  return { STRONG:'#10b981', BUY:'#f59e0b', HOLD:'#f97316', EXCLUDE:'#94a3b8' }[v] || '#94a3b8';
}
function _verdictKR(v) {
  return { STRONG:'🟢 강력', BUY:'🟡 진입', HOLD:'🟠 보류', EXCLUDE:'🔴 제외' }[v] || '-';
}
function _verdictBg(v) {
  return { STRONG:'rgba(16,185,129,0.12)', BUY:'rgba(245,158,11,0.12)', HOLD:'rgba(249,115,22,0.12)', EXCLUDE:'rgba(139,148,158,0.12)' }[v] || 'rgba(139,148,158,0.12)';
}

export function HaseunghoonBacktestTab({ theme = "dark" }) {
  const _T = theme === "dark"
    ? { text:'#e6edf3', body:'#c9d1d9', sub:'#8b949e', hint:'#6e7681', mute:'#484f58', line:'#30363d', linelt:'#21262d', bg:'#0d1117', card:'#161b22', up:'#f85149', down:'#58a6ff', accent:'#7c3aed', green:'#10b981' }
    : { text:'#191f28', body:'#333d4b', sub:'#4e5968', hint:'#6b7684', mute:'#8b95a1', line:'#e5e8eb', linelt:'#f2f4f6', bg:'#f9fafb', card:'#ffffff', up:'#f04452', down:'#1f6dee', accent:'#7c3aed', green:'#10b981' };

  const [yearFilter, setYearFilter] = useState('all');
  const [verdictFilter, setVerdictFilter] = useState('all'); // STRONG/BUY/HOLD/EXCLUDE
  const [exitMethod, setExitMethod] = useState('trail'); // open/close/trail
  const [sortKey, setSortKey] = useState('date_desc');
  const [showAll, setShowAll] = useState(false);
  // 투입금 (만원)
  const [investAmt, setInvestAmt] = useState(() => { try { return +localStorage.getItem('hsbt_invest') || 100; } catch { return 100; } });

  const filtered = useMemo(() => {
    let arr = BT.filter(r => {
      if (yearFilter !== 'all' && +r[C.YEAR] !== +yearFilter) return false;
      if (verdictFilter !== 'all' && r[C.VERDICT] !== verdictFilter) return false;
      return true;
    });
    const retIdx = exitMethod === 'open' ? C.RET_OPEN : exitMethod === 'close' ? C.RET_CLOSE : C.RET_TRAIL;
    if (sortKey === 'date_desc') arr = [...arr].sort((a,b) => String(b[C.DATE]).localeCompare(String(a[C.DATE])));
    else if (sortKey === 'date_asc') arr = [...arr].sort((a,b) => String(a[C.DATE]).localeCompare(String(b[C.DATE])));
    else if (sortKey === 'ret_desc') arr = [...arr].sort((a,b) => (+b[retIdx]||0) - (+a[retIdx]||0));
    else if (sortKey === 'ret_asc') arr = [...arr].sort((a,b) => (+a[retIdx]||0) - (+b[retIdx]||0));
    return arr;
  }, [yearFilter, verdictFilter, exitMethod, sortKey]);

  const retIdx = exitMethod === 'open' ? C.RET_OPEN : exitMethod === 'close' ? C.RET_CLOSE : C.RET_TRAIL;

  // 년도별 통계 (verdict 필터 반영)
  const yearStats = useMemo(() => {
    const rows = BT.filter(r => verdictFilter === 'all' || r[C.VERDICT] === verdictFilter);
    const byYear = {};
    for (const r of rows) {
      const y = +r[C.YEAR];
      if (!byYear[y]) byYear[y] = { n:0, strong:0, buy:0, hold:0, exclude:0, win:0, loss:0, retSum:0, evaluated:0 };
      const stats = byYear[y];
      stats.n++;
      const v = r[C.VERDICT];
      if (v === 'STRONG') stats.strong++;
      else if (v === 'BUY') stats.buy++;
      else if (v === 'HOLD') stats.hold++;
      else stats.exclude++;
      // 매수 대상 (STRONG/BUY)만 익절률 집계
      if (v === 'STRONG' || v === 'BUY') {
        stats.evaluated++;
        const ret = +r[retIdx] || 0;
        stats.retSum += ret;
        if (ret > 0) stats.win++;
        else if (ret < 0) stats.loss++;
      }
    }
    return Object.entries(byYear).map(([y, s]) => ({
      year: +y, ...s,
      buyTargets: s.strong + s.buy,
      avgRet: s.evaluated ? s.retSum / s.evaluated : 0,
      winRate: s.evaluated ? s.win/s.evaluated*100 : 0,
      totalInvest: s.evaluated * investAmt,
      totalPnl: s.evaluated * investAmt * (s.retSum/Math.max(s.evaluated,1)) / 100,
    })).sort((a,b) => a.year - b.year);
  }, [verdictFilter, retIdx, investAmt]);

  const years = ['all', ...Array.from(new Set(BT.map(r=>+r[C.YEAR]))).sort((a,b)=>b-a)];
  const displayLimit = showAll ? filtered.length : 100;
  const display = filtered.slice(0, displayLimit);

  return (
    <div style={{padding:'4px 0', color:_T.text}}>
      {/* 룰 카드 */}
      <div style={{background:_T.card, border:'1px solid '+_T.line, borderRadius:12, padding:'14px 16px', marginBottom:10, fontSize:13, lineHeight:1.7, color:_T.body}}>
        <div style={{fontSize:14, fontWeight:800, color:_T.text, marginBottom:8}}>🎯 하승훈 종가베팅 — 2020~2026 백테스트 ({BT.length.toLocaleString()}건)</div>
        <div style={{color:_T.sub, fontSize:12}}>
          5대 필수 (거래대금 500억+ / 신고가 / 종가위치 80%+ / 시장 1등 / score 3+) + 3대 안전 (등락 10~28% / 5일 ≤30% / MA정배열) 평가
        </div>
        <div style={{fontSize:11, color:_T.sub, marginTop:3}}>
          🟢 STRONG = 필수 5/5 + 안전 3/3 · 🟡 BUY = 필수 4/5 + 안전 3/3 · 🟠 HOLD = 필수 ≥3 + 안전 ≥2 · 🔴 EXCLUDE = 그 외
        </div>
        <div style={{fontSize:11, color:'#f59e0b', marginTop:3}}>
          ⚠️ 백테스트는 테마/분봉 데이터 미지원 (score 3+로 테마 대체) — 실전 대비 보수적 평가
        </div>
      </div>

      {/* 청산 방식 토글 */}
      <div style={{display:'flex', background:_T.linelt, borderRadius:10, padding:3, marginBottom:10, gap:2}}>
        {[
          {id:'open',l:'🐌 D+1 시초가',col:'#1f6dee'},
          {id:'close',l:'📈 D+1 종가',col:'#0d8050'},
          {id:'trail',l:'🚀 트레일+5%',col:'#10b981'},
        ].map(e => {
          const a = exitMethod === e.id;
          return (
            <button key={e.id} onClick={()=>setExitMethod(e.id)} style={{flex:'1 1 0',padding:'8px 6px',border:'none',background:a?e.col:'transparent',color:a?'#fff':_T.sub,borderRadius:8,cursor:'pointer',fontSize:12,fontWeight:a?800:600}}>{e.l}</button>
          );
        })}
      </div>

      {/* 투입금 조절 */}
      <div style={{background:_T.card, border:'1px solid '+_T.line, borderRadius:12, padding:'10px 12px', marginBottom:10, display:'flex', alignItems:'center', gap:10, flexWrap:'wrap'}}>
        <span style={{fontSize:12, fontWeight:700, color:_T.text}}>💰 종목당 투입금</span>
        <input type="number" value={investAmt} onChange={e=>{const v=Math.max(1,+e.target.value||1);setInvestAmt(v);try{localStorage.setItem('hsbt_invest',String(v));}catch{}}} style={{width:80,padding:'5px 8px',borderRadius:6,border:'1px solid '+_T.line,background:_T.bg,color:_T.text,fontSize:13,fontWeight:700,textAlign:'right'}}/>
        <span style={{fontSize:12, color:_T.sub}}>만원 (STRONG+BUY 대상만 집계)</span>
      </div>

      {/* 년도별 통계 */}
      {yearStats.length > 0 && (
        <div style={{background:_T.card, border:'1px solid '+_T.line, borderRadius:12, padding:'12px 14px', marginBottom:10}}>
          <div style={{fontSize:12, fontWeight:800, color:_T.text, marginBottom:8}}>📊 년도별 성과 ({exitMethod==='open'?'시초가':exitMethod==='close'?'종가':'트레일+5%'} 매도 기준)</div>
          <div style={{overflowX:'auto'}}>
            <table style={{width:'100%', minWidth:600, borderCollapse:'collapse', fontSize:12}}>
              <thead>
                <tr style={{background:_T.linelt, borderBottom:'2px solid '+_T.line}}>
                  {['년도','전체','STRONG','BUY','HOLD','EXCLUDE','매수대상','수익','손절','승률','평균실현','자본수익률','총손익'].map(h=>(
                    <th key={h} style={{padding:'7px 5px', textAlign:'center', fontSize:11, fontWeight:700, color:_T.sub, whiteSpace:'nowrap'}}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {yearStats.map(s => {
                  const capitalRet = s.totalInvest > 0 ? (s.totalPnl / s.totalInvest * 100) : 0;
                  return (
                    <tr key={s.year} style={{borderBottom:'1px solid '+_T.linelt}}>
                      <td style={{padding:'7px 5px', textAlign:'center', fontWeight:800, color:_T.text}}>{s.year}</td>
                      <td style={{padding:'7px 5px', textAlign:'right', color:_T.body}}>{s.n}</td>
                      <td style={{padding:'7px 5px', textAlign:'right', color:_verdictColor('STRONG'), fontWeight:700}}>{s.strong}</td>
                      <td style={{padding:'7px 5px', textAlign:'right', color:_verdictColor('BUY'), fontWeight:700}}>{s.buy}</td>
                      <td style={{padding:'7px 5px', textAlign:'right', color:_verdictColor('HOLD')}}>{s.hold}</td>
                      <td style={{padding:'7px 5px', textAlign:'right', color:_verdictColor('EXCLUDE')}}>{s.exclude}</td>
                      <td style={{padding:'7px 5px', textAlign:'right', fontWeight:800, color:_T.text}}>{s.buyTargets}</td>
                      <td style={{padding:'7px 5px', textAlign:'right', color:_T.up}}>{s.win}</td>
                      <td style={{padding:'7px 5px', textAlign:'right', color:_T.down}}>{s.loss}</td>
                      <td style={{padding:'7px 5px', textAlign:'right', fontWeight:700, color:_T.text}}>{s.winRate.toFixed(1)}%</td>
                      <td style={{padding:'7px 5px', textAlign:'right', fontWeight:700, color:s.avgRet>=0?_T.up:_T.down}}>{s.avgRet>=0?'+':''}{s.avgRet.toFixed(2)}%</td>
                      <td style={{padding:'7px 5px', textAlign:'right', fontWeight:800, color:capitalRet>=0?_T.up:_T.down}}>{capitalRet>=0?'+':''}{capitalRet.toFixed(2)}%</td>
                      <td style={{padding:'7px 5px', textAlign:'right', fontWeight:800, color:s.totalPnl>=0?_T.up:_T.down}}>{s.totalPnl>=0?'+':''}{Math.round(s.totalPnl).toLocaleString()}만</td>
                    </tr>
                  );
                })}
                {/* 합계 */}
                {(() => {
                  const tot = yearStats.reduce((a,s) => ({
                    n:a.n+s.n, strong:a.strong+s.strong, buy:a.buy+s.buy, hold:a.hold+s.hold, exclude:a.exclude+s.exclude,
                    buyTargets:a.buyTargets+s.buyTargets, win:a.win+s.win, loss:a.loss+s.loss,
                    evaluated:a.evaluated+s.evaluated, retSum:a.retSum+s.retSum,
                    totalInvest:a.totalInvest+s.totalInvest, totalPnl:a.totalPnl+s.totalPnl,
                  }), {n:0,strong:0,buy:0,hold:0,exclude:0,buyTargets:0,win:0,loss:0,evaluated:0,retSum:0,totalInvest:0,totalPnl:0});
                  const tAvg = tot.evaluated ? tot.retSum / tot.evaluated : 0;
                  const tWr = tot.evaluated ? tot.win / tot.evaluated * 100 : 0;
                  const tCap = tot.totalInvest > 0 ? tot.totalPnl / tot.totalInvest * 100 : 0;
                  return (
                    <tr style={{borderTop:'2px solid '+_T.line, background:_T.linelt}}>
                      <td style={{padding:'8px 5px', textAlign:'center', fontWeight:800, color:_T.text}}>합계</td>
                      <td style={{padding:'8px 5px', textAlign:'right', fontWeight:800, color:_T.text}}>{tot.n}</td>
                      <td style={{padding:'8px 5px', textAlign:'right', color:_verdictColor('STRONG'), fontWeight:800}}>{tot.strong}</td>
                      <td style={{padding:'8px 5px', textAlign:'right', color:_verdictColor('BUY'), fontWeight:800}}>{tot.buy}</td>
                      <td style={{padding:'8px 5px', textAlign:'right', color:_verdictColor('HOLD')}}>{tot.hold}</td>
                      <td style={{padding:'8px 5px', textAlign:'right', color:_verdictColor('EXCLUDE')}}>{tot.exclude}</td>
                      <td style={{padding:'8px 5px', textAlign:'right', fontWeight:800, color:_T.text}}>{tot.buyTargets}</td>
                      <td style={{padding:'8px 5px', textAlign:'right', color:_T.up, fontWeight:700}}>{tot.win}</td>
                      <td style={{padding:'8px 5px', textAlign:'right', color:_T.down, fontWeight:700}}>{tot.loss}</td>
                      <td style={{padding:'8px 5px', textAlign:'right', fontWeight:800, color:_T.text}}>{tWr.toFixed(1)}%</td>
                      <td style={{padding:'8px 5px', textAlign:'right', fontWeight:800, color:tAvg>=0?_T.up:_T.down}}>{tAvg>=0?'+':''}{tAvg.toFixed(2)}%</td>
                      <td style={{padding:'8px 5px', textAlign:'right', fontWeight:800, color:tCap>=0?_T.up:_T.down, fontSize:13}}>{tCap>=0?'+':''}{tCap.toFixed(2)}%</td>
                      <td style={{padding:'8px 5px', textAlign:'right', fontWeight:800, color:tot.totalPnl>=0?_T.up:_T.down}}>{tot.totalPnl>=0?'+':''}{Math.round(tot.totalPnl).toLocaleString()}만</td>
                    </tr>
                  );
                })()}
              </tbody>
            </table>
          </div>
          <div style={{fontSize:10, color:_T.sub, marginTop:6}}>※ 매수대상 = STRONG+BUY. 평균실현/승률/자본수익률은 매수대상만 집계.</div>
        </div>
      )}

      {/* 필터 */}
      <div style={{background:_T.card, border:'1px solid '+_T.line, borderRadius:12, padding:'10px 12px', marginBottom:10}}>
        <div style={{display:'flex', gap:6, marginBottom:6, flexWrap:'wrap', alignItems:'center'}}>
          <span style={{fontSize:12, color:_T.sub, fontWeight:700}}>년도</span>
          {years.map(y => (
            <button key={y} onClick={()=>setYearFilter(y)} style={{padding:'4px 10px', borderRadius:6, border:'1px solid '+_T.line, background:yearFilter===y?_T.accent:_T.bg, color:yearFilter===y?'#fff':_T.body, fontSize:12, fontWeight:yearFilter===y?700:500, cursor:'pointer'}}>{y==='all'?'전체':y}</button>
          ))}
        </div>
        <div style={{display:'flex', gap:6, flexWrap:'wrap', alignItems:'center'}}>
          <span style={{fontSize:12, color:_T.sub, fontWeight:700}}>판정</span>
          {['all','STRONG','BUY','HOLD','EXCLUDE'].map(v => (
            <button key={v} onClick={()=>setVerdictFilter(v)} style={{padding:'4px 10px', borderRadius:6, border:'1px solid '+_T.line, background:verdictFilter===v?_verdictColor(v==='all'?'STRONG':v):_T.bg, color:verdictFilter===v?'#fff':_T.body, fontSize:12, fontWeight:verdictFilter===v?700:500, cursor:'pointer'}}>{v==='all'?'전체':_verdictKR(v)}</button>
          ))}
          <span style={{fontSize:12, color:_T.sub, fontWeight:700, marginLeft:8}}>정렬</span>
          <select value={sortKey} onChange={e=>setSortKey(e.target.value)} style={{padding:'4px 8px', borderRadius:6, border:'1px solid '+_T.line, background:_T.bg, color:_T.body, fontSize:12, fontWeight:600}}>
            <option value="date_desc">최신순</option>
            <option value="date_asc">오래된순</option>
            <option value="ret_desc">수익↑</option>
            <option value="ret_asc">수익↓</option>
          </select>
        </div>
      </div>

      {/* 종목 카드 */}
      <div style={{display:'flex', flexDirection:'column', gap:6}}>
        {display.map((r, i) => {
          const v = r[C.VERDICT];
          const ret = +r[retIdx] || 0;
          const ch = +r[C.CH] || 0;
          return (
            <div key={i} style={{background:_T.card, border:'1px solid '+_verdictColor(v), borderRadius:9, padding:'10px 12px'}}>
              <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', gap:8, flexWrap:'wrap'}}>
                <div style={{display:'flex', alignItems:'baseline', gap:6, flexWrap:'wrap', minWidth:0}}>
                  <span style={{padding:'2px 7px', borderRadius:5, fontSize:11, fontWeight:800, background:_verdictBg(v), color:_verdictColor(v)}}>{_verdictKR(v)}</span>
                  <span style={{fontSize:13, fontWeight:800, color:_T.text}}>{r[C.NAME]}</span>
                  <span style={{fontSize:11, color:_T.sub}}>{String(r[C.DATE]).slice(2)}</span>
                  <span style={{fontSize:10, color:_T.mute}}>{r[C.MKT]}</span>
                  {!!r[C.IS_LEADER] && <span style={{padding:'1px 5px', borderRadius:3, fontSize:9, fontWeight:800, background:'rgba(220,38,38,0.18)', color:'#dc2626'}}>🏆 1등</span>}
                </div>
                <div style={{display:'flex', alignItems:'baseline', gap:8}}>
                  <span style={{fontSize:11, color:_T.sub}}>+{ch.toFixed(2)}% / {r[C.AMT]}억</span>
                  <span style={{fontSize:11, fontWeight:700, color:_verdictColor(v)}}>필수{r[C.MUST_PASS]}/5 · 안전{r[C.SAFE_PASS]}/3</span>
                  <span style={{fontSize:15, fontWeight:900, color:ret>=0?_T.up:_T.down}}>{ret>=0?'+':''}{ret.toFixed(2)}%</span>
                </div>
              </div>
              {/* 통과 표시 */}
              <div style={{display:'flex', gap:4, marginTop:6, flexWrap:'wrap', fontSize:10}}>
                {[
                  {k:'PASS_VOL', l:'거래대금'},
                  {k:'PASS_HIGH', l:'신고가'},
                  {k:'PASS_LATE', l:'종가↑'},
                  {k:'PASS_LEADER', l:'1등'},
                  {k:'PASS_THEME', l:'score'},
                  {k:'PASS_RET', l:'등락'},
                  {k:'PASS_CUM5', l:'5일'},
                  {k:'PASS_MA', l:'MA'},
                ].map(p => {
                  const pass = !!r[C[p.k]];
                  return <span key={p.k} style={{padding:'1px 5px', borderRadius:3, background:pass?'rgba(16,185,129,0.15)':'rgba(139,148,158,0.15)', color:pass?'#10b981':_T.mute, fontWeight:700}}>{pass?'✓':'✗'}{p.l}</span>;
                })}
              </div>
            </div>
          );
        })}
      </div>

      {filtered.length > displayLimit && !showAll && (
        <div style={{padding:'14px', textAlign:'center', marginTop:8}}>
          <button onClick={()=>setShowAll(true)} style={{padding:'10px 24px', borderRadius:8, border:'1px solid '+_T.line, background:_T.card, color:_T.body, fontSize:13, fontWeight:700, cursor:'pointer'}}>
            전체 {filtered.length.toLocaleString()}건 더 보기 (현재 {displayLimit}건)
          </button>
        </div>
      )}
    </div>
  );
}
