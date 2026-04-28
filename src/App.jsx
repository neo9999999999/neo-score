// vercel rebuild trigger 1777038639400
// rebuild 1777034990679
import { useState, useMemo, useRef, useCallback, useEffect } from "react";
import {R_26} from "./data.js";
import {R_2025} from "./data_2025.js";
import {R_2024} from "./data_2024.js";
import {R_2023} from "./data_2023.js";
import {R_2022} from "./data_2022.js";
import {R_2021} from "./data_2021.js";
import { analyzeChimchakhae, ChimchakhaeResultCard, ChimchakhaeToday, ChimchakhaeDetailModal, calcChimchakhaeScore, chimchakhaeGradeColor } from "./ChimchakhaeHelpers.jsx";
import { calcJudojuScore, judojuGradeColor, JudojuToday, JudojuDetailModal, analyzeJudoju, JudojuResultCard } from "./JudojuHelpers.jsx";
import { calcHaseunghoonScore, haseunghoonGradeColor, HaseunghoonToday, HaseunghoonDetailModal, analyzeHaseunghoon, HaseunghoonResultCard } from "./HaseunghoonHelpers.jsx";
const R=[...R_26,...R_2025,...R_2024,...R_2023,...R_2022,...R_2021];
const D=R.map(r=>{
  const _mc=r[4]||"";
  const _mcm=_mc.match(/(\d+(?:\.\d+)?)/);
  const _mcn=_mcm?+_mcm[1]:0;
  const _amt=_mc.includes("兆")||_mc.includes("조")?_mcn*10000:_mcn;
  const _g=_amt>=2500?"S":_amt>=500?"A":_amt>=50?"B":"X";
  const _cc=calcChimchakhaeScore({change:r[3],amount:_amt,investor:r[5],market:r[2],wick:r[9]||0});
  const _jd=calcJudojuScore({change:r[3],amount:_amt,investor:r[5],market:r[2],wick:r[9]||0});
  const _hs=calcHaseunghoonScore({change:r[3],amount:_amt,investor:r[5],market:r[2],wick:r[9]||0,breakType:r[8]});
  return {n:r[0],d:"20"+r[1],m:r[2],ch:r[3],mc:r[4],iv:r[5],sc:r[6],g:_g,ccG:_cc.grade,ccScore:_cc.score,ccBreakdown:_cc.breakdown,jdG:_jd.grade,jdScore:_jd.score,jdBreakdown:_jd.breakdown,hsG:_hs.grade,hsScore:_hs.score,hsBreakdown:_hs.breakdown,hsVetoed:_hs.vetoed,bd:r[8],wk:r[9],am:r[10],pk:r[11],dd:r[12],tp1:r[13],tp2:r[14],sl:r[15],h1:r[16],h2:r[17],t:r[18],r:r[19],hd1:r[20],hd2:r[21],etf:r[22],gp:r[23],h60:r[24],h120:r[25],vc:r[26],ema:r[27],tp1d:r[28]||"",sld:r[29]||"",tp2d:r[30]||"",exd:r[31]||"",tp1dy:r[32]||0,sldy:r[33]||0,exdy:r[34]||0,bed:r[35]||"",bedy:r[36]||0,tp12dy:r[37]||0,ohlc:PF(r[38]||"")};
});
const XN=1061;
const GI={S:{c:"#dc2626",bg:"#fef2f2",bd:"#fca5a5"},A:{c:"#2563eb",bg:"#eff6ff",bd:"#93c5fd"},B:{c:"#d97706",bg:"#fffbeb",bd:"#fcd34d"},X:{c:"#94a3b8",bg:"#f1f5f9",bd:"#cbd5e1"},"S+":{c:"#7c3aed",bg:"#faf5ff",bd:"#d8b4fe"},"A+":{c:"#0284c7",bg:"#f0f9ff",bd:"#7dd3fc"},"B+":{c:"#ca8a04",bg:"#fefce8",bd:"#fde68a"},C:{c:"#6b7280",bg:"#f9fafb",bd:"#d1d5db"}};
const CCNS={"S+":{tp1:20,tp2:50,sl:5,fsl:0},"S":{tp1:20,tp2:50,sl:5,fsl:0},"A+":{tp1:20,tp2:45,sl:6,fsl:0},"A":{tp1:20,tp2:40,sl:7,fsl:10},"B+":{tp1:20,tp2:45,sl:8,fsl:12},"B":{tp1:20,tp2:50,sl:10,fsl:15},"C":{tp1:25,tp2:50,sl:12,fsl:18}};
const JDNS={"S+":{tp1:25,tp2:60,sl:5,fsl:0},"S":{tp1:25,tp2:60,sl:6,fsl:0},"A+":{tp1:20,tp2:50,sl:7,fsl:0},"A":{tp1:20,tp2:45,sl:8,fsl:12},"B+":{tp1:20,tp2:45,sl:9,fsl:14},"B":{tp1:20,tp2:50,sl:10,fsl:15},"C":{tp1:25,tp2:50,sl:12,fsl:18}};
// 하승훈 돌파매매 TP/SL — 큰 폭 수익 추구, 진성 돌파만 매매
const HSNS={"S+":{tp1:25,tp2:60,sl:7,fsl:0},"S":{tp1:20,tp2:50,sl:7,fsl:0},"A+":{tp1:15,tp2:40,sl:7,fsl:0},"A":{tp1:12,tp2:30,sl:8,fsl:12},"B+":{tp1:10,tp2:25,sl:9,fsl:14},"B":{tp1:10,tp2:25,sl:10,fsl:15},"C":{tp1:15,tp2:30,sl:12,fsl:18}};
function strictPassCC(rr,mode){const g=rr.ccG;if(!g)return mode==="full";if(mode==="tight")return g==="S+"||g==="S";if(mode==="middle")return g==="S+"||g==="S"||g==="A+"||g==="A";return true;}
function strictPassJD(rr,mode){const g=rr.jdG;if(!g)return mode==="full";if(mode==="tight")return g==="S+"||g==="S";if(mode==="middle")return g==="S+"||g==="S"||g==="A+"||g==="A";return true;}
function strictPassHS(rr,mode){const g=rr.hsG;if(!g)return mode==="full";if(mode==="tight")return g==="S+"||g==="S";if(mode==="middle")return g==="S+"||g==="S"||g==="A+"||g==="A";return true;}
const NS={S:{tp1:10,tp2:20,sl:5,fsl:0},A:{tp1:10,tp2:20,sl:5,fsl:0},B:{tp1:10,tp2:20,sl:5,fsl:0}};function simNew(pk,dd,g,t1,t2,sl,res,origT){const ns=NS[g];const s=(t1>0)?{tp1:t1,tp2:t2,sl:sl}:ns;if(!s)return{t:0,r:"X"};const isDef=ns&&s.tp1===ns.tp1&&s.tp2===ns.tp2&&s.sl===ns.sl;if(isDef&&res&&origT!=null)return{t:origT,r:res};const a=Math.abs(dd);const hitSL=a>=s.sl;const hitTP1=pk>=s.tp1;const hitTP2=pk>=s.tp2;if(res==="SL"&&hitSL)return{t:Math.round(-s.sl*1.04*10)/10,r:"SL"};if(res==="TO"&&!hitSL&&!hitTP1)return{t:0,r:"TO"};if(hitSL&&hitTP1){if(res==="SL"||res==="TP1_SL")return{t:Math.round(-s.sl*1.04*10)/10,r:"SL"};if(hitTP2)return{t:Math.round((s.tp1*0.5+s.tp2*0.5)*10)/10,r:"BOTH"};return{t:Math.round((s.tp1*0.5)*10)/10,r:"TP1"};}if(hitSL)return{t:Math.round(-s.sl*1.04*10)/10,r:"SL"};if(hitTP2)return{t:Math.round((s.tp1*0.5+s.tp2*0.5)*10)/10,r:"BOTH"};if(hitTP1)return{t:Math.round((s.tp1*0.5)*10)/10,r:"TP1"};return{t:0,r:"TO"};}

function PF(s){if(!s)return[];return s.split(";").map(p=>{const[d,v]=p.split(":");const[o,h,l,c]=v.split(",").map(parseFloat);return{d,o,h,l,c};});}

function parseAmount(inv){if(!inv||!/억/.test(inv))return null;const p=inv.split("/"),r={외:0,기:0,개:0};for(const x of p){const m=x.match(/^(외|기|개)([+-]?\d+)억$/);if(m)r[m[1]]=+m[2];}return r;}
function isSupplyX(inv){const a=parseAmount(inv);if(!a)return false;return(a.외+a.기)<=0;}
function parseAmt2(s){if(!s)return 0;const m=s.match(/(\d+(?:\.\d+)?)억/);return m?+m[1]:0;}
function parseSup2(inv){if(!inv||!/억/.test(inv))return null;const p=inv.split("/"),r={외:0,기:0,개:0};for(const x of p){const m=x.match(/^(외|기|개)([+-]?\d+)억$/);if(m)r[m[1]]=+m[2];}return r;}
function strictPass(rr,mode){const g=rr.g;if(g==="X")return false;if(mode==="tight")return g==="S";if(mode==="middle")return g==="S"||g==="A";return true;}
function simReal(fut,tp1,tp2,sl,fsl,grade){if(!fut||!fut.length)return{t:0,r:"X",tp1d:"",tp2d:"",sld:"",bed:"",exd:"",tp1dy:0,tp2dy:0,sldy:0,bedy:0,exdy:0};
fut=fut.slice(0,10);
const g=grade||"B",trailPct={S:15,A:12,B:10}[g]||10;
let peak=0,tp1Hit=false,tp1Idx=-1,exIdx=-1,exR="";
for(let i=0;i<fut.length;i++){const b=fut[i],h=+b.h||0,c=+b.c||0,l=+b.l||0;peak=Math.max(peak,h);
if(fsl>0&&l<=-fsl){exIdx=i;exR="FSL";break;}
if(c<=-sl){exIdx=i;exR="SL";break;}
if(h>=tp2){exIdx=i;exR="TP2";break;}
if(!tp1Hit&&h>=tp1){tp1Hit=true;tp1Idx=i;}
if(tp1Hit&&tp1Idx+1<i){const stopPct=Math.max(peak-trailPct,2);if(c<=stopPct){exIdx=i;exR="TRAIL";break;}}}
if(exIdx<0){exIdx=fut.length-1;exR="TO";}
const ex=fut[exIdx];
return{t:exR==="FSL"?-fsl:exR==="TP2"?tp2:Math.min(+ex.c,tp2),r:exR,tp1d:tp1Idx>=0?fut[tp1Idx].d:"",tp2d:exR==="TP2"?ex.d:"",sld:(exR==="SL"||exR==="FSL")?ex.d:"",bed:"",exd:ex.d,tp1dy:tp1Idx+1,tp2dy:exR==="TP2"?exIdx+1:0,sldy:exR==="SL"?exIdx+1:0,bedy:0,exdy:exIdx+1};
}
function SD(r,cTP){const cp=(cTP&&cTP[r.g])||{tp1:r.tp1,tp2:r.tp2,sl:r.sl,fsl:0};const res=r.r;if(res==="BOTH")return"1차 TP1 +"+cp.tp1+"% @ "+r.tp1d+" ("+r.tp1dy+"일) → 50% 익절 · 2차 TP2 +"+cp.tp2+"% @ "+(r.tp2d||r.exd)+" ("+(r.tp2dy||r.exdy)+"일) → 50% 익절";if(res==="TP1")return"1차 TP1 +"+cp.tp1+"% @ "+r.tp1d+" ("+r.tp1dy+"일) → 50% 익절 · 2차 기간만료 @ "+r.exd+" ("+r.exdy+"일) 종가에서 나머지 50% 매도";if(res==="TP1_BE")return"1차 TP1 +"+cp.tp1+"% @ "+r.tp1d+" ("+r.tp1dy+"일) → 50% 익절 · 2차 본절(0%) @ "+r.bed+" ("+r.bedy+"일) → 나머지 50% 본절 매도";if(res==="TP1_FSL")return"1차 TP1 +"+cp.tp1+"% @ "+r.tp1d+" ("+r.tp1dy+"일) → 50% 익절 · 2차 장중 강제 손절 @ -"+cp.fsl+"% ("+r.exdy+"일) → 나머지 50% 매도";if(res==="TP1_SL")return"1차 TP1 +"+cp.tp1+"% @ "+r.tp1d+" ("+r.tp1dy+"일) → 50% 익절 · 2차 SL 손절 @ "+r.sld+" ("+r.sldy+"일) → 50% 손절";if(res==="SL")return"종가 SL 전량 손절 @ "+r.sld+" ("+r.sldy+"일), 종가 "+r.t+"%";if(res==="FSL")return"장중 강제 SL 전량 손절 @ -"+cp.fsl+"% ("+r.exdy+"일), 즉시 매도";if(res==="TO")return"기간만료 전량 매도 @ "+r.exd+" ("+r.exdy+"일), 종가 "+(r.t>0?"+":"")+r.t+"%";return"-";}


const RC=r=>r==="BOTH"?"#dc2626":r==="TP1"?"#2563eb":r==="TP1_SL"?"#d97706":r==="SL"?"#dc2626":"#64748b";
const RL=r=>r==="BOTH"?"TP2":r==="TP1"?"TP1":r==="TP1_SL"?"TP1→SL":r==="SL"?"SL":r==="TP2"?"TP2":r==="FSL"?"강제SL":r==="TRAIL"?"TRAIL":"기간만료";
const BL=b=>b==="ATH"?"사상최고":b==="52W"?"52주":b==="120D"?"120일":"비신고";
const BC=b=>b==="ATH"?"#dc2626":b==="52W"?"#2563eb":b==="120D"?"#d97706":"#94a3b8";
const API_URL="https://sector-api-pink.vercel.app/api/screening";
const HIST_URL="https://sector-api-pink.vercel.app/api/history";
const TRACK_API="https://sector-api-pink.vercel.app/api/track";
const PRICE_API="https://sector-api-pink.vercel.app/api/daily-price";
const SYS_PROMPT=`당신은 종가돌파매매 전문 AI 분석가입니다. 차트 이미지를 분석하여 NEO-SCORE 등급을 판정합니다.\n\n## 분석 항목 (14점 스케일)\n가점: 기관+외인동시(+3) · 외인만(+2) · 윗꼬리0.5%이하(+2)/2%이하(+1) · 거래대금200억이하(+2)/500억이하(+1) · 등락률25%+(+2)/20%+(+1) · 코스닥(+1) · 사상최고가(+1) · 소폭돌파0-3%(+2) · 매물대돌파(+1)\n감점: 윗꼬리7%+(-1) · 1500억+(-1) · ETF(-3) · 초강력돌파15%+(-1)\n\n## 등급\nS(9+): TP15/50 SL13 풀사이즈 | A(7-8): TP15/50 SL13 기본 | B(5-6): TP12/50 SL13 소량 | X(4이하): 매수금지\n\n## 응답 형식 (반드시 JSON)\n{"name":"종목명","grade":"S/A/B/X","score":점수,"change":등락률,"upperWick":윗꼬리,"amount":거래대금억,"investor":"기관+외인/외인/기관","breakType":"ATH/52W/120D","ema50":"상승/하락","tp1":15,"tp2":50,"sl":13,"summary":"[S/A/B/X등급] 이 종목이 좋은/위험한 핵심이유 + 구체적 근거 2-3줄. 9점+(S)=강력한패턴+엔트리조건충족+구체적이유, 7-8점(A)=신뢰도높음+미충족조건명시, 5-6점(B)=기본요건만충족+부정적요소명시, 4점이하(X)=패턴미충족+구체적부족사유","details":[{"item":"항목명","point":점수,"reason":"이유"}]}`;

function SignalDB(){const [tab,setTab]=useState("S");const [cTP,setCTP]=useState(NS);const [srt,setSrt]=useState({c:"d",d:"desc"});const [open,setOpen]=useState(null);const [pg,setPg]=useState(0);const[invAmt,setInvAmt]=useState(()=>{try{return JSON.parse(localStorage.getItem("invAmt_v1")||"")||{S:1000000,A:500000,B:300000,same:500000,useSame:false}}catch(e){return{S:1000000,A:500000,B:300000,same:500000,useSame:false}}});const[mode,setMode]=useState(()=>{try{const v=localStorage.getItem("mode_v1");return v==="full"||v==="middle"||v==="tight"?v:"tight"}catch(e){return "tight"}});const[yearFilter,setYearFilter]=useState("all");const[fromD,setFromD]=useState("");const[toD,setToD]=useState("");const[supplyFilter,setSupplyFilter]=useState("all");const[highFilter,setHighFilter]=useState("all");const[holdFilter,setHoldFilter]=useState("all");
useEffect(()=>{const h=(e)=>{if((e.ctrlKey||e.metaKey)&&(e.key==="k"||e.key==="K")){e.preventDefault();setMode(v=>v==="tight"?"full":v==="full"?"middle":"tight");}};window.addEventListener("keydown",h);return()=>window.removeEventListener("keydown",h);},[]);
useEffect(()=>{const t=setTimeout(()=>{[...document.querySelectorAll("button")].filter(b=>b.textContent.trim()==="수익MAX").forEach(b=>b.click());},400);return ()=>clearTimeout(t);},[]);useEffect(()=>{try{localStorage.setItem("mode_v1",mode)}catch(e){}},[mode]);const PP=30;const D_live=useMemo(()=>{let _r=D.filter(r=>r.sc>=4&&[r.ccG,r.jdG,r.hsG].filter(g=>g==="S+"||g==="S"||g==="A+").length>=2&&strictPass(r,mode)&&(yearFilter==="all"||(r.d&&r.d.slice(0,4)===yearFilter))&&(!fromD||(r.d&&r.d>=fromD))&&(!toD||(r.d&&r.d<=toD))&&(supplyFilter==="all"||(supplyFilter==="gi_oe"&&r.iv==="기+외")||(supplyFilter==="oe"&&r.iv==="외만")||(supplyFilter==="gi"&&r.iv==="기만")||(supplyFilter==="dual_minus"&&r.iv==="둘다-"))&&(highFilter==="all"||(highFilter==="h60"&&r.h60===1)||(highFilter==="h120"&&r.h120===1)||(highFilter==="both"&&r.h60===1&&r.h120===1)));_r=_r.map(rr=>{const cp=cTP[rr.g];if(!cp||!rr.ohlc||!rr.ohlc.length)return rr;const sim=simReal(rr.ohlc,cp.tp1,cp.tp2,cp.sl,cp.fsl||0);return{g:(rr.g||"B"),ta:rr.mc,...rr,t:sim.t,r:sim.r,tp1d:sim.tp1d||rr.tp1d,tp2d:sim.tp2d||rr.tp2d,sld:sim.sld||rr.sld,bed:sim.bed,exd:sim.exd||rr.exd,tp1dy:sim.tp1dy,tp2dy:sim.tp2dy,sldy:sim.sldy,bedy:sim.bedy,exdy:sim.exdy};});if(holdFilter!=="all"){const hd=+holdFilter;_r=_r.filter(x=>x.ohlc&&x.ohlc.length>=hd).map(x=>({...x,t:x.ohlc[hd-1].c,r:hd+"일보유"}));}return _r;},[cTP,mode,yearFilter,fromD,toD,supplyFilter,highFilter,holdFilter]);const st=useMemo(()=>{const r={};["S","A","B"].forEach(g=>{const d=D_live.filter(x=>x.g===g),w=d.filter(x=>x.t>0),sl=d.filter(x=>x.r==="SL"),bo=d.filter(x=>x.r==="BOTH"),tp1=d.filter(x=>{const rr=x.r;return rr==="TP1"||rr==="BOTH";}),to=d.filter(x=>x.r==="TO");const avg=d.length?(d.reduce((s,x)=>s+x.t,0)/d.length):0;const nw=d.map(x=>x);const nwCum=Math.round(nw.reduce((s,x)=>s+x.t,0));const nwWin=nw.filter(x=>x.t>0).length;r[g]={n:d.length,avg:avg.toFixed(2),wr:d.length?Math.round(w.length/d.length*100):0,cum:Math.round(d.reduce((s,x)=>s+x.t,0)),tp1c:tp1.length,tp1r:d.length?Math.round(tp1.length/d.length*100):0,boc:bo.length,bor:d.length?Math.round(bo.length/d.length*100):0,slc:sl.length,slr:d.length?Math.round(sl.length/d.length*100):0,toc:to.length,tor:d.length?Math.round(to.length/d.length*100):0,nwCum,nwWr:d.length?Math.round(nwWin/d.length*100):0}});return r},[cTP,D_live]);const fl=useMemo(()=>{let d=D_live.filter(r=>r.g===tab);return[...d].sort((a,b)=>{const av=a[srt.c],bv=b[srt.c];if(typeof av==="number")return (srt.d==="asc"?av-bv:bv-av);return srt.d==="asc"?String(av).localeCompare(String(bv)):String(bv).localeCompare(String(av))})},[tab,srt,invAmt,D_live]);const portfolio=useMemo(()=>{
const amt=invAmt.useSame?{S:invAmt.same,A:invAmt.same,B:invAmt.same}:{S:invAmt.S,A:invAmt.A,B:invAmt.B};
const parseTA=s=>{if(!s)return 0;const m=s.match(/(\d+)억/);return m?+m[1]:0;};
const byG={S:{n:0,pnl:0,win:0,amt:0},A:{n:0,pnl:0,win:0,amt:0},B:{n:0,pnl:0,win:0,amt:0}};
let resStats={tp:0,sl:0,to:0,trail:0,be:0};
let filtered=0;
for(const r of D_live){
const g=r.g||"B";
if(!byG[g])continue;
if(g==="X")continue;

const tPct=r.t||0;
const gAmt=amt[g]||0;
const gain=Math.round(gAmt*tPct/100);
byG[g].n++;byG[g].pnl+=gain;byG[g].amt+=gAmt;
if(tPct>0){byG[g].win++;resStats.tp++;}else if(tPct<0){if(r.r==="SL")resStats.sl++;else if(r.r==="TRAIL")resStats.trail++;else resStats.to++;}else{resStats.be++;}
}
const total={n:0,pnl:0,win:0,amt:0};
for(const g of["S","A","B"]){total.n+=byG[g].n;total.pnl+=byG[g].pnl;total.win+=byG[g].win;total.amt+=byG[g].amt;}
try{localStorage.setItem("invAmt_v1",JSON.stringify(invAmt))}catch(e){}
return{byG,total,resStats,filtered};
},[D_live,invAmt]);const pd=fl.slice(pg*PP,(pg+1)*PP),mx=Math.ceil(fl.length/PP)-1;const ds=c=>setSrt(p=>p.c===c?{c,d:p.d==="asc"?"desc":"asc"}:{c,d:"desc"});return(<div><div style={{marginBottom:8,padding:10,background:"#0f1420",border:"1px solid #2a3040",borderRadius:8,display:"flex",alignItems:"center",gap:10,flexWrap:"wrap"}}><span style={{color:"#9ca3af",fontSize:12,fontWeight:700}}>기간</span>{[["all","전체"],["2026","26년"],["2025","25년"],["2024","24년"],["2023","23년"],["2022","22년"],["2021","21년"]].map(([v,l])=>(<button key={v} onClick={()=>setYearFilter(v)} style={{background:yearFilter===v?"#60a5fa":"#1f2937",color:yearFilter===v?"#000":"#d1d5db",border:"1px solid #374151",borderRadius:6,padding:"4px 10px",fontSize:12,cursor:"pointer",fontWeight:yearFilter===v?700:400}}>{l}</button>))}<span style={{color:"#4b5563"}}>|</span><input type="date" value={fromD} onChange={e=>setFromD(e.target.value)} style={{background:"#1f2937",color:"#fff",border:"1px solid #374151",borderRadius:6,padding:"3px 6px",fontSize:11}}/><span style={{color:"#6b7280",fontSize:11}}>~</span><input type="date" value={toD} onChange={e=>setToD(e.target.value)} style={{background:"#1f2937",color:"#fff",border:"1px solid #374151",borderRadius:6,padding:"3px 6px",fontSize:11}}/><button onClick={()=>{setFromD("");setToD("");setYearFilter("all")}} style={{background:"#374151",color:"#fff",border:"none",borderRadius:6,padding:"3px 8px",fontSize:11,cursor:"pointer"}}>초기화</button><span style={{color:"#4b5563"}}>|</span><span style={{color:"#9ca3af",fontSize:12}}>총 <b style={{color:"#fff"}}>{D_live.length}</b>건</span><span style={{color:"#9ca3af",fontSize:12}}>누적 <b style={{color:D_live.reduce((a,b)=>a+(b.t||0),0)>=0?"#ef4444":"#3b82f6"}}>{D_live.reduce((a,b)=>a+(b.t||0),0).toFixed(1)}%</b></span><span style={{color:"#9ca3af",fontSize:12}}>승률 <b style={{color:"#fff"}}>{D_live.length?(D_live.filter(x=>x.t>0).length/D_live.length*100).toFixed(1):0}%</b></span></div><div style={{marginBottom:8,padding:10,background:"#0f1420",border:"1px solid #2a3040",borderRadius:8,display:"flex",alignItems:"center",gap:10,flexWrap:"wrap"}}><span style={{color:"#9ca3af",fontSize:12,fontWeight:700}}>수급</span>{[["all","전체"],["gi_oe","기+외"],["oe","외만"],["gi","기만"],["dual_minus","둘다-"]].map(([v,l])=>(<button key={v} onClick={()=>setSupplyFilter(v)} style={{background:supplyFilter===v?"#60a5fa":"#1f2937",color:supplyFilter===v?"#000":"#d1d5db",border:"1px solid #374151",borderRadius:6,padding:"4px 10px",fontSize:12,cursor:"pointer",fontWeight:supplyFilter===v?700:400}}>{l}</button>))}<span style={{color:"#9ca3af",fontSize:11,marginLeft:"auto"}}>※ 현재 26년 데이터만 수급 정보 있음 (22~25년 추후 보강 예정)</span></div><div style={{marginBottom:8,padding:10,background:"#0f1420",border:"1px solid #2a3040",borderRadius:8,display:"flex",alignItems:"center",gap:10,flexWrap:"wrap"}}><span style={{color:"#9ca3af",fontSize:12,fontWeight:700}}>신고가</span>{[["all","전체"],["h60","60일↑"],["h120","120일↑"],["both","둘다↑"]].map(([v,l])=>(<button key={v} onClick={()=>setHighFilter(v)} style={{background:highFilter===v?"#f59e0b":"#1f2937",color:highFilter===v?"#000":"#d1d5db",border:"1px solid #374151",borderRadius:6,padding:"4px 10px",fontSize:12,cursor:"pointer",fontWeight:highFilter===v?700:400}}>{l}</button>))}<span style={{color:"#9ca3af",fontSize:11,marginLeft:"auto"}}>※ 25/26년 적용 (22~24년 재수집 예정)</span></div><div style={{marginBottom:8,padding:10,background:"#0f1420",border:"1px solid #2a3040",borderRadius:8,display:"flex",alignItems:"center",gap:10,flexWrap:"wrap"}}><span style={{color:"#9ca3af",fontSize:12,fontWeight:700}}>보유</span>{[["all","전체"],["5","≤5일"],["10","≤10일"],["15","≤15일"],["20","≤20일"],["25","≤25일"],["30","≤30일"],["35","≤35일"],["40","≤40일"],["45","≤45일"],["50","≤50일"],["55","≤55일"],["60","≤60일"]].map(([v,l])=>(<button key={v} onClick={()=>setHoldFilter(v)} style={{background:holdFilter===v?"#10b981":"#1f2937",color:holdFilter===v?"#000":"#d1d5db",border:"1px solid #374151",borderRadius:6,padding:"4px 10px",fontSize:12,cursor:"pointer",fontWeight:holdFilter===v?700:400}}>{l}</button>))}<span style={{color:"#9ca3af",fontSize:11,marginLeft:"auto"}}>※ 60일까지 전구간 적용</span></div><div style={{marginBottom:12,padding:12,background:"#0f1420",border:"1px solid #2a3040",borderRadius:8}}>
<div style={{display:"flex",alignItems:"center",gap:8,marginBottom:10,flexWrap:"wrap"}}>
<span style={{fontSize:12,fontWeight:700,color:"#26C6DA"}}>💰 투자금 계산기</span>
<label style={{display:"flex",alignItems:"center",gap:4,fontSize:11,color:"#aaa",cursor:"pointer"}}>
<input type="checkbox" checked={invAmt.useSame} onChange={e=>setInvAmt({...invAmt,useSame:e.target.checked})}/>
모든 종목 동일 금액
</label>
<button onClick={()=>setMode(mode==="tight"?"full":mode==="full"?"middle":"tight")} style={{padding:"4px 10px",fontSize:10,fontWeight:700,border:"1px solid "+((mode==="tight"?"#dc2626":mode==="middle"?"#F5A623":"#444")),background:(mode==="tight"?"#dc2626":mode==="middle"?"#F5A623":"transparent"),color:(mode==="tight")?"#fff":"#888",borderRadius:4,cursor:"pointer",marginRight:8}}>{mode==="tight"?"🎯 타이트 (Ctrl+K)":mode==="middle"?"🔸 미들 (Ctrl+K)":"⚪ 풀 (Ctrl+K)"}</button><div style={{display:"flex",gap:10,fontSize:10,marginLeft:"auto",flexWrap:"wrap"}}><span style={{color:"#dc2626",fontWeight:700}}>🎯 익절 {portfolio.resStats.tp}건</span><span style={{color:"#2563eb",fontWeight:700}}>🛑 손절 {portfolio.resStats.sl}건</span><span style={{color:"#888"}}>⏱ 기간만료 {portfolio.resStats.to}건</span><span style={{color:"#666"}}>전체 {portfolio.total.n}건</span></div>


</div>
{invAmt.useSame?(
<div style={{display:"flex",alignItems:"center",gap:8,marginBottom:10}}>
<span style={{fontSize:11,color:"#ccc",width:60}}>종목당</span>
<input type="number" value={invAmt.same} onChange={e=>setInvAmt({...invAmt,same:+e.target.value||0})} style={{flex:1,padding:"6px 8px",background:"#1a1a2e",border:"1px solid #333",borderRadius:4,color:"#fff",fontSize:12}} step="100000"/>
<span style={{fontSize:10,color:"#888"}}>원</span>
</div>
):(
<div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:6,marginBottom:10}}>
{["S","A","B"].map(gk=>(
<div key={gk} style={{display:"flex",alignItems:"center",gap:4}}>
<span style={{fontSize:11,fontWeight:700,color:gk==="S"?"#dc2626":gk==="A"?"#F5A623":"#5B8DEF",width:20}}>{gk}</span>
<input type="number" value={invAmt[gk]} onChange={e=>setInvAmt({...invAmt,[gk]:+e.target.value||0})} style={{flex:1,padding:"5px 6px",background:"#1a1a2e",border:"1px solid #333",borderRadius:4,color:"#fff",fontSize:11}} step="100000"/>
</div>
))}
</div>
)}
<div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:6}}>
{["S","A","B"].map(gk=>{
const d=portfolio.byG[gk];
const roi=d.amt>0?(d.pnl/d.amt*100):0;
const c=d.pnl>0?"#dc2626":d.pnl<0?"#2563eb":"#888";
return(<div key={gk} style={{padding:"8px 10px",background:"#1a1a2e",borderRadius:6,borderLeft:"3px solid "+(gk==="S"?"#dc2626":gk==="A"?"#F5A623":"#5B8DEF")}}>
<div style={{fontSize:10,color:"#888",marginBottom:3}}>{gk}급 ({d.n}건)</div>
<div style={{fontSize:14,fontWeight:700,color:c}}>{d.pnl>=0?"+":""}{d.pnl.toLocaleString()}원</div>
<div style={{fontSize:9,color:"#666"}}>투입 {d.amt.toLocaleString()} · {roi.toFixed(1)}% · 승 {d.n>0?(d.win/d.n*100).toFixed(0):0}%</div>
</div>);
})}
<div style={{padding:"8px 10px",background:"#1a2e2a",borderRadius:6,borderLeft:"3px solid #26C6DA"}}>
<div style={{fontSize:10,color:"#26C6DA",marginBottom:3,fontWeight:700}}>전체 ({portfolio.total.n}건)</div>
<div style={{fontSize:14,fontWeight:700,color:portfolio.total.pnl>0?"#dc2626":portfolio.total.pnl<0?"#2563eb":"#888"}}>{portfolio.total.pnl>=0?"+":""}{portfolio.total.pnl.toLocaleString()}원</div>
<div style={{fontSize:9,color:"#666"}}>투입 {portfolio.total.amt.toLocaleString()} · {portfolio.total.amt>0?(portfolio.total.pnl/portfolio.total.amt*100).toFixed(1):0}% · 승 {portfolio.total.n>0?(portfolio.total.win/portfolio.total.n*100).toFixed(0):0}%</div>
</div>
</div>
</div><div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(148px,1fr))",gap:8,marginBottom:18}}>{["S","A","B"].map(g=>{const i=GI[g],s=st[g];return(<div key={g} onClick={()=>{setTab(g);setPg(0);setOpen(null)}} style={{background:tab===g?i.c:i.bg,borderRadius:14,padding:"12px 14px",cursor:"pointer",border:tab===g?"none":"0.5px solid "+i.bd}}><div style={{display:"flex",gap:8,margin:"8px 0",padding:"8px 10px",background:"#f8fafc",borderRadius:8,border:"1px solid #e2e8f0",alignItems:"center",flexWrap:"wrap"}}><span style={{fontSize:11,fontWeight:700,color:"#475569"}}>전략설정</span><label style={{fontSize:10,color:"#64748b"}}>TP1<input type="number" value={cTP[g]?.tp1||""} onChange={(_g=>e=>setCTP(p=>({...p,[_g]:{...p[_g],tp1:+e.target.value}})))(g)} placeholder={NS[g]?.tp1} style={{width:40,margin:"0 4px",padding:"2px 4px",border:"1px solid #cbd5e1",borderRadius:4,fontSize:11}}/>%</label><label style={{fontSize:10,color:"#64748b"}}>TP2<input type="number" value={cTP[g]?.tp2||""} onChange={(_g=>e=>setCTP(p=>({...p,[_g]:{...p[_g],tp2:+e.target.value}})))(g)} placeholder={NS[g]?.tp2} style={{width:40,margin:"0 4px",padding:"2px 4px",border:"1px solid #cbd5e1",borderRadius:4,fontSize:11}}/>%</label><label style={{fontSize:10,color:"#64748b"}}>SL<input type="number" value={cTP[g]?.sl||""} onChange={(_g=>e=>setCTP(p=>({...p,[_g]:{...p[_g],sl:+e.target.value}})))(g)} placeholder={NS[g]?.sl} style={{width:40,margin:"0 4px",padding:"2px 4px",border:"1px solid #cbd5e1",borderRadius:4,fontSize:11}}/>%</label><label style={{fontSize:10,color:"#64748b"}}>강제SL<input type="number" value={cTP[g]?.fsl||""} onChange={(_g=>e=>setCTP(p=>({...p,[_g]:{...p[_g],fsl:+e.target.value}})))(g)} placeholder={NS[g]?.fsl||"off"} style={{width:40,margin:"0 4px",padding:"2px 4px",border:"1px solid #cbd5e1",borderRadius:4,fontSize:11}}/>%</label><button onClick={()=>{setCTP({...cTP,[g]:{tp1:0,tp2:0,sl:0,fsl:0}})}} style={{fontSize:10,padding:"2px 8px",background:"#e2e8f0",border:"none",borderRadius:4,cursor:"pointer"}}>초기화</button> <button onClick={()=>{const ds=D_live.filter(x=>x.g===g);let best=null;for(const t1 of [10,15,20,25,30])for(const t2 of [30,50,80,100])for(const sl of [3,5,7,10,15])for(const fsl of [0,7,10,15]){if(t2<=t1)continue;if(fsl>0&&fsl<sl)continue;const rs=ds.map(x=>simReal(x.ohlc,t1,t2,sl,fsl));const cum=rs.reduce((a,x)=>a+x.t,0);if(!best||cum>best.cum)best={t1,t2,sl,fsl,cum};}if(best)setCTP({...cTP,[g]:{tp1:best.t1,tp2:best.t2,sl:best.sl,fsl:best.fsl||0}});}} style={{fontSize:10,padding:"2px 8px",background:"#dbeafe",color:"#1e40af",border:"none",borderRadius:4,cursor:"pointer",marginLeft:4}}>수익MAX</button><button onClick={()=>{const ds=D_live.filter(x=>x.g===g);let best=null;for(const tp of [10,15,20,25,30,40,50,60,80,100])for(const sl of [3,5,7,10,15,20]){const rs=ds.map(x=>simReal(x.ohlc,tp,tp*2,sl,0));const cum=rs.reduce((a,x)=>a+x.t,0);if(!best||cum>best.cum)best={tp,sl,cum};}if(best)setCTP({...cTP,[g]:{tp1:best.tp,tp2:best.tp,sl:best.sl}});}} style={{fontSize:10,padding:"2px 8px",background:"#ffedd5",color:"#ea580c",border:"none",borderRadius:4,cursor:"pointer",marginLeft:4}}>단일TP</button>{(()=>{const ds=D_live.filter(x=>x.g===g);const rs=ds.map(x=>x);const cum=Math.round(rs.reduce((a,x)=>a+x.t,0));const wr=ds.length?Math.round(rs.filter(x=>x.t>0).length/ds.length*100):0;const ev=ds.length?(rs.reduce((a,x)=>a+x.t,0)/ds.length).toFixed(2):0;return(<span style={{fontSize:11,fontWeight:700,marginLeft:8}}><span style={{color:"#2563eb"}}>누적{cum>0?"+":""}{cum}%</span> <span style={{color:"#dc2626"}}>승률{wr}%</span> <span style={{color:"#7c3aed"}}>EV={ev}</span></span>)})()}</div><div style={{display:"flex",justifyContent:"space-between"}}><span style={{fontSize:26,fontWeight:900,color:tab===g?"#fff":i.c}}>{g}</span></div><div style={{fontSize:22,fontWeight:900,color:tab===g?"#fff":i.c}}>{s.n}<span style={{fontSize:11,fontWeight:400}}>건</span></div><div style={{fontSize:11,color:tab===g?"rgba(255,255,255,0.8)":"#64748b",marginTop:2}}>+{s.avg}%/건 · 승률<strong>{s.wr}%</strong> · 현행+{s.cum}%</div><div style={{fontSize:10,color:tab===g?"rgba(255,255,255,0.65)":"#94a3b8",marginTop:1}}>TP1{s.tp1c}({s.tp1r}%) · TP2{s.boc}({s.bor}%) · SL{s.slc}({s.slr}%)</div></div>)})} <div style={{background:"#f1f5f9",borderRadius:14,padding:"12px 14px"}}><span style={{fontSize:26,fontWeight:900,color:"#94a3b8"}}>X</span><div style={{fontSize:22,fontWeight:900,color:"#94a3b8"}}>{XN}<span style={{fontSize:11,fontWeight:400}}>건</span></div><div style={{fontSize:11,color:"#94a3b8",marginTop:2}}>매수금지</div></div></div>{st[tab]&&<div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:6,marginBottom:12}}><div style={{background:"#f0fdf4",borderRadius:10,padding:"8px 10px",textAlign:"center",border:"1px solid #fee2e2"}}><div style={{fontSize:10,color:"#dc2626"}}>익절 (TP1+TP2)</div><div style={{fontSize:18,fontWeight:900,color:"#dc2626"}}>{st[tab].tp1c}건</div><div style={{fontSize:10,color:"#64748b"}}>{st[tab].tp1r}% · TP2{st[tab].boc}건({st[tab].bor}%)</div></div><div style={{background:"#fef2f2",borderRadius:10,padding:"8px 10px",textAlign:"center",border:"1px solid #fecaca"}}><div style={{fontSize:10,color:"#dc2626"}}>손절 (SL)</div><div style={{fontSize:18,fontWeight:900,color:"#dc2626"}}>{st[tab].slc}건</div><div style={{fontSize:10,color:"#64748b"}}>{Math.round((st[tab].slc)/st[tab].n*100)}%</div></div><div style={{background:"#f8fafc",borderRadius:10,padding:"8px 10px",textAlign:"center",border:"1px solid #e2e8f0"}}><div style={{fontSize:10,color:"#64748b"}}>기간만료 (TO)</div><div style={{fontSize:18,fontWeight:900,color:"#64748b"}}>{st[tab].toc}건</div><div style={{fontSize:10,color:"#94a3b8"}}>{st[tab].tor}%</div></div></div>}<div style={{borderRadius:12,border:"1px solid #e2e8f0",overflow:"hidden"}}><div style={{overflowX:"auto"}}><table style={{width:"100%",minWidth:760,borderCollapse:"collapse",fontSize:13}}><thead><tr style={{background:"#f8fafc"}}>{[{k:"d",l:"날짜"},{k:"n",l:"종목"},{k:"ch",l:"등락"},{k:"iv",l:"수급"},{k:"sc",l:"NEO"},{k:"r",l:""}].map(h=>(<th key={h.k} onClick={()=>ds(h.k)} style={{padding:"8px 5px",textAlign:h.k==="n"?"left":"center",fontWeight:600,fontSize:11,color:"#94a3b8",cursor:"pointer",borderBottom:"2px solid #e2e8f0",whiteSpace:"nowrap",userSelect:"none"}}>{h.l}{srt.c===h.k?(srt.d==="asc"?" ↑":" ↓"):""}</th>))}</tr></thead><tbody>{pd.map((r,i)=>{const isO=open===pg*PP+i,gi=GI[r.g];return[<tr key={"r"+i} onClick={()=>setOpen(isO?null:pg*PP+i)} style={{cursor:"pointer",borderBottom:"1px solid #f1f5f9",background:isO?gi.bg:"#fff"}}><td style={{padding:"8px 5px",textAlign:"center",fontSize:11,color:"#94a3b8"}}>{r.d.slice(2)}</td><td style={{padding:"8px 5px",fontWeight:700,fontSize:13,maxWidth:120,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{r.n}</td><td style={{padding:"8px 5px",textAlign:"center",fontWeight:700,color:"#dc2626",fontSize:12}}>+{r.ch}%</td><td style={{padding:"8px 5px",textAlign:"center",fontSize:11,fontWeight:600,color:r.iv==="기+외"?"#7c3aed":r.iv==="외인"?"#2563eb":"#94a3b8"}}>{r.iv}</td><td style={{padding:"8px 5px",textAlign:"center"}}><span style={{background:gi.c+"12",color:gi.c,padding:"1px 7px",borderRadius:20,fontWeight:800,fontSize:12}}>{r.sc}</span></td><td style={{padding:"8px 5px",textAlign:"center",fontWeight:800,fontSize:13,color:r.t>0?"#dc2626":"#2563eb"}}>{((r.t>0?"+":"")+r.t+"%"+(function(){var a=invAmt.useSame?invAmt.same:(invAmt[r.g]||0);if(!a)return"";var g=Math.round(a*r.t/100);return" ("+(g>=0?"+":"")+g.toLocaleString()+"원)";})())}</td><td style={{padding:"8px 5px",textAlign:"center"}}><span style={{padding:"1px 4px",borderRadius:4,fontSize:10,fontWeight:700,background:RC(r.r)+"12",color:RC(r.r)}}>{RL(r.r)}</span></td></tr>,isO&&(<tr key={"d"+i}><td colSpan={9} style={{padding:0}}><div style={{padding:"12px 16px",background:gi.bg,borderBottom:"2px solid "+gi.bd}}><div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(80px,1fr))",gap:5,marginBottom:8}}>{[{l:"시총",v:r.mc},{l:"수급",v:r.iv},{l:"최대↑",v:"+"+r.pk+"%",c:"#dc2626"},{l:"최대↓",v:r.dd+"%",c:"#dc2626"},{l:"TP1도달일",v:r.tp1d?r.tp1d+(r.tp1dy?" ("+r.tp1dy+"일)":""):"-",c:r.tp1d?"#2563eb":"#94a3b8"},{l:"SL손절일",v:r.sld?r.sld+(r.sldy?" ("+r.sldy+"일)":""):"-",c:r.sld?"#dc2626":"#94a3b8"},{l:"TP2도달일",v:r.tp2d||"-",c:r.tp2d?"#dc2626":"#94a3b8"},{l:"청산일",v:r.exd?r.exd+(r.exdy?" ("+r.exdy+"일)":""):"-",c:"#64748b"}].map((x,j)=>(<div key={j} style={{background:"#fff",borderRadius:6,padding:"4px 6px"}}><div style={{fontSize:9,color:"#94a3b8"}}>{x.l}</div><div style={{fontSize:13,fontWeight:700,color:x.c||"#1e293b"}}>{x.v}</div></div>))}</div><div style={{background:"#fff",borderRadius:6,padding:"12px 14px"}}><div style={{display:"flex",alignItems:"baseline",gap:10,marginBottom:6,flexWrap:"wrap"}}><div style={{fontSize:22,fontWeight:900,color:r.t>=0?"#dc2626":"#2563eb"}}>실현 {r.t>0?"+":""}{r.t}%</div><div style={{fontSize:10,color:"#94a3b8",fontWeight:600}}>거래 시나리오</div></div><div style={{fontSize:11,color:"#475569",lineHeight:1.8}}>{SD(r,cTP)}</div></div></div></td></tr>)]})}</tbody></table></div></div><div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginTop:10}}><span style={{fontSize:12,color:"#94a3b8"}}>{fl.length}건 중 {pg*PP+1}~{Math.min((pg+1)*PP,fl.length)}</span><div style={{display:"flex",gap:4}}><button onClick={()=>setPg(Math.max(0,pg-1))} disabled={pg===0} style={{padding:"5px 12px",borderRadius:8,border:"1px solid #e2e8f0",background:"#fff",fontSize:13,fontWeight:700,cursor:pg===0?"default":"pointer",color:pg===0?"#e2e8f0":"#1e293b"}}>←</button><input type="number" value={pg+1} min={1} max={mx+1} onChange={e=>{const v=parseInt(e.target.value)-1;if(!isNaN(v)&&v>=0&&v<=mx)setPg(v);}} style={{padding:"5px 4px",fontSize:13,color:"#64748b",width:50,textAlign:"center",border:"1px solid #e2e8f0",borderRadius:6}}/><span style={{padding:"5px 2px",fontSize:13,color:"#94a3b8"}}>/{mx+1}</span><button onClick={()=>setPg(Math.min(mx,pg+1))} disabled={pg>=mx} style={{padding:"5px 12px",borderRadius:8,border:"1px solid #e2e8f0",background:"#fff",fontSize:13,fontWeight:700,cursor:pg>=mx?"default":"pointer",color:pg>=mx?"#e2e8f0":"#1e293b"}}>→</button></div></div></div>);}

function ChimchakhaeDB(){const [tab,setTab]=useState("S+");const [cTP,setCTP]=useState(CCNS);const [srt,setSrt]=useState({c:"d",d:"desc"});const [open,setOpen]=useState(null);const [pg,setPg]=useState(0);const[invAmt,setInvAmt]=useState(()=>{try{return JSON.parse(localStorage.getItem("invAmt_cc_v1")||"")||{"S+":1000000,S:1000000,"A+":700000,A:500000,"B+":400000,B:300000,C:100000,same:500000,useSame:false}}catch(e){return{"S+":1000000,S:1000000,"A+":700000,A:500000,"B+":400000,B:300000,C:100000,same:500000,useSame:false}}});const[mode,setMode]=useState(()=>{try{const v=localStorage.getItem("mode_cc_v1");return v==="full"||v==="middle"||v==="tight"?v:"tight"}catch(e){return "tight"}});const[yearFilter,setYearFilter]=useState("all");const[fromD,setFromD]=useState("");const[toD,setToD]=useState("");const[supplyFilter,setSupplyFilter]=useState("all");const[highFilter,setHighFilter]=useState("all");const[holdFilter,setHoldFilter]=useState("all");
useEffect(()=>{const h=(e)=>{if((e.ctrlKey||e.metaKey)&&(e.key==="k"||e.key==="K")){e.preventDefault();setMode(v=>v==="tight"?"full":v==="full"?"middle":"tight");}};window.addEventListener("keydown",h);return()=>window.removeEventListener("keydown",h);},[]);
useEffect(()=>{const t=setTimeout(()=>{[...document.querySelectorAll("button")].filter(b=>b.textContent.trim()==="수익MAX").forEach(b=>b.click());},400);return ()=>clearTimeout(t);},[]);useEffect(()=>{try{localStorage.setItem("mode_cc_v1",mode)}catch(e){}},[mode]);const PP=30;const D_live=useMemo(()=>{let _r=D.filter(r=>strictPassCC(r,mode)&&(yearFilter==="all"||(r.d&&r.d.slice(0,4)===yearFilter))&&(!fromD||(r.d&&r.d>=fromD))&&(!toD||(r.d&&r.d<=toD))&&(supplyFilter==="all"||(supplyFilter==="gi_oe"&&r.iv==="기+외")||(supplyFilter==="oe"&&r.iv==="외만")||(supplyFilter==="gi"&&r.iv==="기만")||(supplyFilter==="dual_minus"&&r.iv==="둘다-"))&&(highFilter==="all"||(highFilter==="h60"&&r.h60===1)||(highFilter==="h120"&&r.h120===1)||(highFilter==="both"&&r.h60===1&&r.h120===1)));_r=_r.map(rr=>{const cp=cTP[rr.ccG];if(!cp||!rr.ohlc||!rr.ohlc.length)return rr;const sim=simReal(rr.ohlc,cp.tp1,cp.tp2,cp.sl,cp.fsl||0);return{g:(rr.ccG||"B"),ta:rr.mc,...rr,t:sim.t,r:sim.r,tp1d:sim.tp1d||rr.tp1d,tp2d:sim.tp2d||rr.tp2d,sld:sim.sld||rr.sld,bed:sim.bed,exd:sim.exd||rr.exd,tp1dy:sim.tp1dy,tp2dy:sim.tp2dy,sldy:sim.sldy,bedy:sim.bedy,exdy:sim.exdy};});if(holdFilter!=="all"){const hd=+holdFilter;_r=_r.filter(x=>x.ohlc&&x.ohlc.length>=hd).map(x=>({...x,t:x.ohlc[hd-1].c,r:hd+"일보유"}));}return _r;},[cTP,mode,yearFilter,fromD,toD,supplyFilter,highFilter,holdFilter]);const st=useMemo(()=>{const r={};["S+","S","A+","A","B+","B","C"].forEach(g=>{const d=D_live.filter(x=>x.ccG===g),w=d.filter(x=>x.t>0),sl=d.filter(x=>x.r==="SL"),bo=d.filter(x=>x.r==="BOTH"),tp1=d.filter(x=>{const rr=x.r;return rr==="TP1"||rr==="BOTH";}),to=d.filter(x=>x.r==="TO");const avg=d.length?(d.reduce((s,x)=>s+x.t,0)/d.length):0;const nw=d.map(x=>x);const nwCum=Math.round(nw.reduce((s,x)=>s+x.t,0));const nwWin=nw.filter(x=>x.t>0).length;r[g]={n:d.length,avg:avg.toFixed(2),wr:d.length?Math.round(w.length/d.length*100):0,cum:Math.round(d.reduce((s,x)=>s+x.t,0)),tp1c:tp1.length,tp1r:d.length?Math.round(tp1.length/d.length*100):0,boc:bo.length,bor:d.length?Math.round(bo.length/d.length*100):0,slc:sl.length,slr:d.length?Math.round(sl.length/d.length*100):0,toc:to.length,tor:d.length?Math.round(to.length/d.length*100):0,nwCum,nwWr:d.length?Math.round(nwWin/d.length*100):0}});return r},[cTP,D_live]);const fl=useMemo(()=>{let d=D_live.filter(r=>r.ccG===tab);return[...d].sort((a,b)=>{const av=a[srt.c],bv=b[srt.c];if(typeof av==="number")return (srt.d==="asc"?av-bv:bv-av);return srt.d==="asc"?String(av).localeCompare(String(bv)):String(bv).localeCompare(String(av))})},[tab,srt,invAmt,D_live]);const portfolio=useMemo(()=>{
const amt=invAmt.useSame?{"S+":invAmt.same,"S":invAmt.same,"A+":invAmt.same,"A":invAmt.same,"B+":invAmt.same,"B":invAmt.same,"C":invAmt.same}:{"S+":invAmt["S+"],"S":invAmt.S,"A+":invAmt["A+"],"A":invAmt.A,"B+":invAmt["B+"],"B":invAmt.B,"C":invAmt.C};
const parseTA=s=>{if(!s)return 0;const m=s.match(/(\d+)억/);return m?+m[1]:0;};
const byG={"S+":{n:0,pnl:0,win:0,amt:0},"S":{n:0,pnl:0,win:0,amt:0},"A+":{n:0,pnl:0,win:0,amt:0},"A":{n:0,pnl:0,win:0,amt:0},"B+":{n:0,pnl:0,win:0,amt:0},"B":{n:0,pnl:0,win:0,amt:0},"C":{n:0,pnl:0,win:0,amt:0}};
let resStats={tp:0,sl:0,to:0,trail:0,be:0};
let filtered=0;
for(const r of D_live){
const g=r.ccG||"B";
if(!byG[g])continue;
if(g==="X")continue;

const tPct=r.t||0;
const gAmt=amt[g]||0;
const gain=Math.round(gAmt*tPct/100);
byG[g].n++;byG[g].pnl+=gain;byG[g].amt+=gAmt;
if(tPct>0){byG[g].win++;resStats.tp++;}else if(tPct<0){if(r.r==="SL")resStats.sl++;else if(r.r==="TRAIL")resStats.trail++;else resStats.to++;}else{resStats.be++;}
}
const total={n:0,pnl:0,win:0,amt:0};
for(const g of["S+","S","A+","A","B+","B","C"]){total.n+=byG[g].n;total.pnl+=byG[g].pnl;total.win+=byG[g].win;total.amt+=byG[g].amt;}
try{localStorage.setItem("invAmt_cc_v1",JSON.stringify(invAmt))}catch(e){}
return{byG,total,resStats,filtered};
},[D_live,invAmt]);const pd=fl.slice(pg*PP,(pg+1)*PP),mx=Math.ceil(fl.length/PP)-1;const ds=c=>setSrt(p=>p.c===c?{c,d:p.d==="asc"?"desc":"asc"}:{c,d:"desc"});return(<div><div style={{marginBottom:8,padding:10,background:"#0f1420",border:"1px solid #2a3040",borderRadius:8,display:"flex",alignItems:"center",gap:10,flexWrap:"wrap"}}><span style={{color:"#9ca3af",fontSize:12,fontWeight:700}}>기간</span>{[["all","전체"],["2026","26년"],["2025","25년"],["2024","24년"],["2023","23년"],["2022","22년"],["2021","21년"]].map(([v,l])=>(<button key={v} onClick={()=>setYearFilter(v)} style={{background:yearFilter===v?"#60a5fa":"#1f2937",color:yearFilter===v?"#000":"#d1d5db",border:"1px solid #374151",borderRadius:6,padding:"4px 10px",fontSize:12,cursor:"pointer",fontWeight:yearFilter===v?700:400}}>{l}</button>))}<span style={{color:"#4b5563"}}>|</span><input type="date" value={fromD} onChange={e=>setFromD(e.target.value)} style={{background:"#1f2937",color:"#fff",border:"1px solid #374151",borderRadius:6,padding:"3px 6px",fontSize:11}}/><span style={{color:"#6b7280",fontSize:11}}>~</span><input type="date" value={toD} onChange={e=>setToD(e.target.value)} style={{background:"#1f2937",color:"#fff",border:"1px solid #374151",borderRadius:6,padding:"3px 6px",fontSize:11}}/><button onClick={()=>{setFromD("");setToD("");setYearFilter("all")}} style={{background:"#374151",color:"#fff",border:"none",borderRadius:6,padding:"3px 8px",fontSize:11,cursor:"pointer"}}>초기화</button><span style={{color:"#4b5563"}}>|</span><span style={{color:"#9ca3af",fontSize:12}}>총 <b style={{color:"#fff"}}>{D_live.length}</b>건</span><span style={{color:"#9ca3af",fontSize:12}}>누적 <b style={{color:D_live.reduce((a,b)=>a+(b.t||0),0)>=0?"#ef4444":"#3b82f6"}}>{D_live.reduce((a,b)=>a+(b.t||0),0).toFixed(1)}%</b></span><span style={{color:"#9ca3af",fontSize:12}}>승률 <b style={{color:"#fff"}}>{D_live.length?(D_live.filter(x=>x.t>0).length/D_live.length*100).toFixed(1):0}%</b></span></div><div style={{marginBottom:8,padding:10,background:"#0f1420",border:"1px solid #2a3040",borderRadius:8,display:"flex",alignItems:"center",gap:10,flexWrap:"wrap"}}><span style={{color:"#9ca3af",fontSize:12,fontWeight:700}}>수급</span>{[["all","전체"],["gi_oe","기+외"],["oe","외만"],["gi","기만"],["dual_minus","둘다-"]].map(([v,l])=>(<button key={v} onClick={()=>setSupplyFilter(v)} style={{background:supplyFilter===v?"#60a5fa":"#1f2937",color:supplyFilter===v?"#000":"#d1d5db",border:"1px solid #374151",borderRadius:6,padding:"4px 10px",fontSize:12,cursor:"pointer",fontWeight:supplyFilter===v?700:400}}>{l}</button>))}<span style={{color:"#9ca3af",fontSize:11,marginLeft:"auto"}}>※ 현재 26년 데이터만 수급 정보 있음 (22~25년 추후 보강 예정)</span></div><div style={{marginBottom:8,padding:10,background:"#0f1420",border:"1px solid #2a3040",borderRadius:8,display:"flex",alignItems:"center",gap:10,flexWrap:"wrap"}}><span style={{color:"#9ca3af",fontSize:12,fontWeight:700}}>신고가</span>{[["all","전체"],["h60","60일↑"],["h120","120일↑"],["both","둘다↑"]].map(([v,l])=>(<button key={v} onClick={()=>setHighFilter(v)} style={{background:highFilter===v?"#f59e0b":"#1f2937",color:highFilter===v?"#000":"#d1d5db",border:"1px solid #374151",borderRadius:6,padding:"4px 10px",fontSize:12,cursor:"pointer",fontWeight:highFilter===v?700:400}}>{l}</button>))}<span style={{color:"#9ca3af",fontSize:11,marginLeft:"auto"}}>※ 25/26년 적용 (22~24년 재수집 예정)</span></div><div style={{marginBottom:8,padding:10,background:"#0f1420",border:"1px solid #2a3040",borderRadius:8,display:"flex",alignItems:"center",gap:10,flexWrap:"wrap"}}><span style={{color:"#9ca3af",fontSize:12,fontWeight:700}}>보유</span>{[["all","전체"],["5","≤5일"],["10","≤10일"],["15","≤15일"],["20","≤20일"],["25","≤25일"],["30","≤30일"],["35","≤35일"],["40","≤40일"],["45","≤45일"],["50","≤50일"],["55","≤55일"],["60","≤60일"]].map(([v,l])=>(<button key={v} onClick={()=>setHoldFilter(v)} style={{background:holdFilter===v?"#10b981":"#1f2937",color:holdFilter===v?"#000":"#d1d5db",border:"1px solid #374151",borderRadius:6,padding:"4px 10px",fontSize:12,cursor:"pointer",fontWeight:holdFilter===v?700:400}}>{l}</button>))}<span style={{color:"#9ca3af",fontSize:11,marginLeft:"auto"}}>※ 60일까지 전구간 적용</span></div><div style={{marginBottom:12,padding:12,background:"#0f1420",border:"1px solid #2a3040",borderRadius:8}}>
<div style={{display:"flex",alignItems:"center",gap:8,marginBottom:10,flexWrap:"wrap"}}>
<span style={{fontSize:12,fontWeight:700,color:"#26C6DA"}}>💰 투자금 계산기</span>
<label style={{display:"flex",alignItems:"center",gap:4,fontSize:11,color:"#aaa",cursor:"pointer"}}>
<input type="checkbox" checked={invAmt.useSame} onChange={e=>setInvAmt({...invAmt,useSame:e.target.checked})}/>
모든 종목 동일 금액
</label>
<button onClick={()=>setMode(mode==="tight"?"full":mode==="full"?"middle":"tight")} style={{padding:"4px 10px",fontSize:10,fontWeight:700,border:"1px solid "+((mode==="tight"?"#dc2626":mode==="middle"?"#F5A623":"#444")),background:(mode==="tight"?"#dc2626":mode==="middle"?"#F5A623":"transparent"),color:(mode==="tight")?"#fff":"#888",borderRadius:4,cursor:"pointer",marginRight:8}}>{mode==="tight"?"🎯 타이트 (Ctrl+K)":mode==="middle"?"🔸 미들 (Ctrl+K)":"⚪ 풀 (Ctrl+K)"}</button><div style={{display:"flex",gap:10,fontSize:10,marginLeft:"auto",flexWrap:"wrap"}}><span style={{color:"#dc2626",fontWeight:700}}>🎯 익절 {portfolio.resStats.tp}건</span><span style={{color:"#2563eb",fontWeight:700}}>🛑 손절 {portfolio.resStats.sl}건</span><span style={{color:"#888"}}>⏱ 기간만료 {portfolio.resStats.to}건</span><span style={{color:"#666"}}>전체 {portfolio.total.n}건</span></div>


</div>
{invAmt.useSame?(
<div style={{display:"flex",alignItems:"center",gap:8,marginBottom:10}}>
<span style={{fontSize:11,color:"#ccc",width:60}}>종목당</span>
<input type="number" value={invAmt.same} onChange={e=>setInvAmt({...invAmt,same:+e.target.value||0})} style={{flex:1,padding:"6px 8px",background:"#1a1a2e",border:"1px solid #333",borderRadius:4,color:"#fff",fontSize:12}} step="100000"/>
<span style={{fontSize:10,color:"#888"}}>원</span>
</div>
):(
<div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:6,marginBottom:10}}>
{["S+","S","A+","A","B+","B","C"].map(gk=>(
<div key={gk} style={{display:"flex",alignItems:"center",gap:4}}>
<span style={{fontSize:11,fontWeight:700,color:gk==="S"?"#dc2626":gk==="A"?"#F5A623":"#5B8DEF",width:20}}>{gk}</span>
<input type="number" value={invAmt[gk]} onChange={e=>setInvAmt({...invAmt,[gk]:+e.target.value||0})} style={{flex:1,padding:"5px 6px",background:"#1a1a2e",border:"1px solid #333",borderRadius:4,color:"#fff",fontSize:11}} step="100000"/>
</div>
))}
</div>
)}
<div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:6}}>
{["S+","S","A+","A","B+","B","C"].map(gk=>{
const d=portfolio.byG[gk];
const roi=d.amt>0?(d.pnl/d.amt*100):0;
const c=d.pnl>0?"#dc2626":d.pnl<0?"#2563eb":"#888";
return(<div key={gk} style={{padding:"8px 10px",background:"#1a1a2e",borderRadius:6,borderLeft:"3px solid "+(gk==="S"?"#dc2626":gk==="A"?"#F5A623":"#5B8DEF")}}>
<div style={{fontSize:10,color:"#888",marginBottom:3}}>{gk}급 ({d.n}건)</div>
<div style={{fontSize:14,fontWeight:700,color:c}}>{d.pnl>=0?"+":""}{d.pnl.toLocaleString()}원</div>
<div style={{fontSize:9,color:"#666"}}>투입 {d.amt.toLocaleString()} · {roi.toFixed(1)}% · 승 {d.n>0?(d.win/d.n*100).toFixed(0):0}%</div>
</div>);
})}
<div style={{padding:"8px 10px",background:"#1a2e2a",borderRadius:6,borderLeft:"3px solid #26C6DA"}}>
<div style={{fontSize:10,color:"#26C6DA",marginBottom:3,fontWeight:700}}>전체 ({portfolio.total.n}건)</div>
<div style={{fontSize:14,fontWeight:700,color:portfolio.total.pnl>0?"#dc2626":portfolio.total.pnl<0?"#2563eb":"#888"}}>{portfolio.total.pnl>=0?"+":""}{portfolio.total.pnl.toLocaleString()}원</div>
<div style={{fontSize:9,color:"#666"}}>투입 {portfolio.total.amt.toLocaleString()} · {portfolio.total.amt>0?(portfolio.total.pnl/portfolio.total.amt*100).toFixed(1):0}% · 승 {portfolio.total.n>0?(portfolio.total.win/portfolio.total.n*100).toFixed(0):0}%</div>
</div>
</div>
</div><div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(148px,1fr))",gap:8,marginBottom:18}}>{["S+","S","A+","A","B+","B","C"].map(g=>{const i=GI[g],s=st[g];return(<div key={g} onClick={()=>{setTab(g);setPg(0);setOpen(null)}} style={{background:tab===g?i.c:i.bg,borderRadius:14,padding:"12px 14px",cursor:"pointer",border:tab===g?"none":"0.5px solid "+i.bd}}><div style={{display:"flex",gap:8,margin:"8px 0",padding:"8px 10px",background:"#f8fafc",borderRadius:8,border:"1px solid #e2e8f0",alignItems:"center",flexWrap:"wrap"}}><span style={{fontSize:11,fontWeight:700,color:"#475569"}}>전략설정</span><label style={{fontSize:10,color:"#64748b"}}>TP1<input type="number" value={cTP[g]?.tp1||""} onChange={(_g=>e=>setCTP(p=>({...p,[_g]:{...p[_g],tp1:+e.target.value}})))(g)} placeholder={NS[g]?.tp1} style={{width:40,margin:"0 4px",padding:"2px 4px",border:"1px solid #cbd5e1",borderRadius:4,fontSize:11}}/>%</label><label style={{fontSize:10,color:"#64748b"}}>TP2<input type="number" value={cTP[g]?.tp2||""} onChange={(_g=>e=>setCTP(p=>({...p,[_g]:{...p[_g],tp2:+e.target.value}})))(g)} placeholder={NS[g]?.tp2} style={{width:40,margin:"0 4px",padding:"2px 4px",border:"1px solid #cbd5e1",borderRadius:4,fontSize:11}}/>%</label><label style={{fontSize:10,color:"#64748b"}}>SL<input type="number" value={cTP[g]?.sl||""} onChange={(_g=>e=>setCTP(p=>({...p,[_g]:{...p[_g],sl:+e.target.value}})))(g)} placeholder={NS[g]?.sl} style={{width:40,margin:"0 4px",padding:"2px 4px",border:"1px solid #cbd5e1",borderRadius:4,fontSize:11}}/>%</label><label style={{fontSize:10,color:"#64748b"}}>강제SL<input type="number" value={cTP[g]?.fsl||""} onChange={(_g=>e=>setCTP(p=>({...p,[_g]:{...p[_g],fsl:+e.target.value}})))(g)} placeholder={NS[g]?.fsl||"off"} style={{width:40,margin:"0 4px",padding:"2px 4px",border:"1px solid #cbd5e1",borderRadius:4,fontSize:11}}/>%</label><button onClick={()=>{setCTP({...cTP,[g]:{tp1:0,tp2:0,sl:0,fsl:0}})}} style={{fontSize:10,padding:"2px 8px",background:"#e2e8f0",border:"none",borderRadius:4,cursor:"pointer"}}>초기화</button> <button onClick={()=>{const ds=D_live.filter(x=>x.ccG===g);let best=null;for(const t1 of [10,15,20,25,30])for(const t2 of [30,50,80,100])for(const sl of [3,5,7,10,15])for(const fsl of [0,7,10,15]){if(t2<=t1)continue;if(fsl>0&&fsl<sl)continue;const rs=ds.map(x=>simReal(x.ohlc,t1,t2,sl,fsl));const cum=rs.reduce((a,x)=>a+x.t,0);if(!best||cum>best.cum)best={t1,t2,sl,fsl,cum};}if(best)setCTP({...cTP,[g]:{tp1:best.t1,tp2:best.t2,sl:best.sl,fsl:best.fsl||0}});}} style={{fontSize:10,padding:"2px 8px",background:"#dbeafe",color:"#1e40af",border:"none",borderRadius:4,cursor:"pointer",marginLeft:4}}>수익MAX</button><button onClick={()=>{const ds=D_live.filter(x=>x.ccG===g);let best=null;for(const tp of [10,15,20,25,30,40,50,60,80,100])for(const sl of [3,5,7,10,15,20]){const rs=ds.map(x=>simReal(x.ohlc,tp,tp*2,sl,0));const cum=rs.reduce((a,x)=>a+x.t,0);if(!best||cum>best.cum)best={tp,sl,cum};}if(best)setCTP({...cTP,[g]:{tp1:best.tp,tp2:best.tp,sl:best.sl}});}} style={{fontSize:10,padding:"2px 8px",background:"#ffedd5",color:"#ea580c",border:"none",borderRadius:4,cursor:"pointer",marginLeft:4}}>단일TP</button>{(()=>{const ds=D_live.filter(x=>x.ccG===g);const rs=ds.map(x=>x);const cum=Math.round(rs.reduce((a,x)=>a+x.t,0));const wr=ds.length?Math.round(rs.filter(x=>x.t>0).length/ds.length*100):0;const ev=ds.length?(rs.reduce((a,x)=>a+x.t,0)/ds.length).toFixed(2):0;return(<span style={{fontSize:11,fontWeight:700,marginLeft:8}}><span style={{color:"#2563eb"}}>누적{cum>0?"+":""}{cum}%</span> <span style={{color:"#dc2626"}}>승률{wr}%</span> <span style={{color:"#7c3aed"}}>EV={ev}</span></span>)})()}</div><div style={{display:"flex",justifyContent:"space-between"}}><span style={{fontSize:26,fontWeight:900,color:tab===g?"#fff":i.c}}>{g}</span></div><div style={{fontSize:22,fontWeight:900,color:tab===g?"#fff":i.c}}>{s.n}<span style={{fontSize:11,fontWeight:400}}>건</span></div><div style={{fontSize:11,color:tab===g?"rgba(255,255,255,0.8)":"#64748b",marginTop:2}}>+{s.avg}%/건 · 승률<strong>{s.wr}%</strong> · 현행+{s.cum}%</div><div style={{fontSize:10,color:tab===g?"rgba(255,255,255,0.65)":"#94a3b8",marginTop:1}}>TP1{s.tp1c}({s.tp1r}%) · TP2{s.boc}({s.bor}%) · SL{s.slc}({s.slr}%)</div></div>)})}</div>{st[tab]&&<div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:6,marginBottom:12}}><div style={{background:"#f0fdf4",borderRadius:10,padding:"8px 10px",textAlign:"center",border:"1px solid #fee2e2"}}><div style={{fontSize:10,color:"#dc2626"}}>익절 (TP1+TP2)</div><div style={{fontSize:18,fontWeight:900,color:"#dc2626"}}>{st[tab].tp1c}건</div><div style={{fontSize:10,color:"#64748b"}}>{st[tab].tp1r}% · TP2{st[tab].boc}건({st[tab].bor}%)</div></div><div style={{background:"#fef2f2",borderRadius:10,padding:"8px 10px",textAlign:"center",border:"1px solid #fecaca"}}><div style={{fontSize:10,color:"#dc2626"}}>손절 (SL)</div><div style={{fontSize:18,fontWeight:900,color:"#dc2626"}}>{st[tab].slc}건</div><div style={{fontSize:10,color:"#64748b"}}>{Math.round((st[tab].slc)/st[tab].n*100)}%</div></div><div style={{background:"#f8fafc",borderRadius:10,padding:"8px 10px",textAlign:"center",border:"1px solid #e2e8f0"}}><div style={{fontSize:10,color:"#64748b"}}>기간만료 (TO)</div><div style={{fontSize:18,fontWeight:900,color:"#64748b"}}>{st[tab].toc}건</div><div style={{fontSize:10,color:"#94a3b8"}}>{st[tab].tor}%</div></div></div>}<div style={{borderRadius:12,border:"1px solid #e2e8f0",overflow:"hidden"}}><div style={{overflowX:"auto"}}><table style={{width:"100%",minWidth:760,borderCollapse:"collapse",fontSize:13}}><thead><tr style={{background:"#f8fafc"}}>{[{k:"d",l:"날짜"},{k:"n",l:"종목"},{k:"ch",l:"등락"},{k:"iv",l:"수급"},{k:"sc",l:"NEO"},{k:"r",l:""}].map(h=>(<th key={h.k} onClick={()=>ds(h.k)} style={{padding:"8px 5px",textAlign:h.k==="n"?"left":"center",fontWeight:600,fontSize:11,color:"#94a3b8",cursor:"pointer",borderBottom:"2px solid #e2e8f0",whiteSpace:"nowrap",userSelect:"none"}}>{h.l}{srt.c===h.k?(srt.d==="asc"?" ↑":" ↓"):""}</th>))}</tr></thead><tbody>{pd.map((r,i)=>{const isO=open===pg*PP+i,gi=GI[r.ccG];return[<tr key={"r"+i} onClick={()=>setOpen(isO?null:pg*PP+i)} style={{cursor:"pointer",borderBottom:"1px solid #f1f5f9",background:isO?gi.bg:"#fff"}}><td style={{padding:"8px 5px",textAlign:"center",fontSize:11,color:"#94a3b8"}}>{r.d.slice(2)}</td><td style={{padding:"8px 5px",fontWeight:700,fontSize:13,maxWidth:120,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{r.n}</td><td style={{padding:"8px 5px",textAlign:"center",fontWeight:700,color:"#dc2626",fontSize:12}}>+{r.ch}%</td><td style={{padding:"8px 5px",textAlign:"center",fontSize:11,fontWeight:600,color:r.iv==="기+외"?"#7c3aed":r.iv==="외인"?"#2563eb":"#94a3b8"}}>{r.iv}</td><td style={{padding:"8px 5px",textAlign:"center"}}><span style={{background:gi.c+"12",color:gi.c,padding:"1px 7px",borderRadius:20,fontWeight:800,fontSize:12}}>{r.sc}</span></td><td style={{padding:"8px 5px",textAlign:"center",fontWeight:800,fontSize:13,color:r.t>0?"#dc2626":"#2563eb"}}>{((r.t>0?"+":"")+r.t+"%"+(function(){var a=invAmt.useSame?invAmt.same:(invAmt[r.ccG]||0);if(!a)return"";var g=Math.round(a*r.t/100);return" ("+(g>=0?"+":"")+g.toLocaleString()+"원)";})())}</td><td style={{padding:"8px 5px",textAlign:"center"}}><span style={{padding:"1px 4px",borderRadius:4,fontSize:10,fontWeight:700,background:RC(r.r)+"12",color:RC(r.r)}}>{RL(r.r)}</span></td></tr>,isO&&(<tr key={"d"+i}><td colSpan={9} style={{padding:0}}><div style={{padding:"12px 16px",background:gi.bg,borderBottom:"2px solid "+gi.bd}}><div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(80px,1fr))",gap:5,marginBottom:8}}>{[{l:"시총",v:r.mc},{l:"수급",v:r.iv},{l:"최대↑",v:"+"+r.pk+"%",c:"#dc2626"},{l:"최대↓",v:r.dd+"%",c:"#dc2626"},{l:"TP1도달일",v:r.tp1d?r.tp1d+(r.tp1dy?" ("+r.tp1dy+"일)":""):"-",c:r.tp1d?"#2563eb":"#94a3b8"},{l:"SL손절일",v:r.sld?r.sld+(r.sldy?" ("+r.sldy+"일)":""):"-",c:r.sld?"#dc2626":"#94a3b8"},{l:"TP2도달일",v:r.tp2d||"-",c:r.tp2d?"#dc2626":"#94a3b8"},{l:"청산일",v:r.exd?r.exd+(r.exdy?" ("+r.exdy+"일)":""):"-",c:"#64748b"}].map((x,j)=>(<div key={j} style={{background:"#fff",borderRadius:6,padding:"4px 6px"}}><div style={{fontSize:9,color:"#94a3b8"}}>{x.l}</div><div style={{fontSize:13,fontWeight:700,color:x.c||"#1e293b"}}>{x.v}</div></div>))}</div><div style={{background:"#fff",borderRadius:6,padding:"12px 14px"}}><div style={{display:"flex",alignItems:"baseline",gap:10,marginBottom:6,flexWrap:"wrap"}}><div style={{fontSize:22,fontWeight:900,color:r.t>=0?"#dc2626":"#2563eb"}}>실현 {r.t>0?"+":""}{r.t}%</div><div style={{fontSize:10,color:"#94a3b8",fontWeight:600}}>거래 시나리오</div></div><div style={{fontSize:11,color:"#475569",lineHeight:1.8}}>{SD(r,cTP)}</div></div></div></td></tr>)]})}</tbody></table></div></div><div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginTop:10}}><span style={{fontSize:12,color:"#94a3b8"}}>{fl.length}건 중 {pg*PP+1}~{Math.min((pg+1)*PP,fl.length)}</span><div style={{display:"flex",gap:4}}><button onClick={()=>setPg(Math.max(0,pg-1))} disabled={pg===0} style={{padding:"5px 12px",borderRadius:8,border:"1px solid #e2e8f0",background:"#fff",fontSize:13,fontWeight:700,cursor:pg===0?"default":"pointer",color:pg===0?"#e2e8f0":"#1e293b"}}>←</button><input type="number" value={pg+1} min={1} max={mx+1} onChange={e=>{const v=parseInt(e.target.value)-1;if(!isNaN(v)&&v>=0&&v<=mx)setPg(v);}} style={{padding:"5px 4px",fontSize:13,color:"#64748b",width:50,textAlign:"center",border:"1px solid #e2e8f0",borderRadius:6}}/><span style={{padding:"5px 2px",fontSize:13,color:"#94a3b8"}}>/{mx+1}</span><button onClick={()=>setPg(Math.min(mx,pg+1))} disabled={pg>=mx} style={{padding:"5px 12px",borderRadius:8,border:"1px solid #e2e8f0",background:"#fff",fontSize:13,fontWeight:700,cursor:pg>=mx?"default":"pointer",color:pg>=mx?"#e2e8f0":"#1e293b"}}>→</button></div></div></div>);}

function JudojuDB(){const [tab,setTab]=useState("S+");const [cTP,setCTP]=useState(JDNS);const [srt,setSrt]=useState({c:"d",d:"desc"});const [open,setOpen]=useState(null);const [pg,setPg]=useState(0);const[invAmt,setInvAmt]=useState(()=>{try{return JSON.parse(localStorage.getItem("invAmt_jd_v1")||"")||{"S+":1000000,S:1000000,"A+":700000,A:500000,"B+":400000,B:300000,C:100000,same:500000,useSame:false}}catch(e){return{"S+":1000000,S:1000000,"A+":700000,A:500000,"B+":400000,B:300000,C:100000,same:500000,useSame:false}}});const[mode,setMode]=useState(()=>{try{const v=localStorage.getItem("mode_jd_v1");return v==="full"||v==="middle"||v==="tight"?v:"tight"}catch(e){return "tight"}});const[yearFilter,setYearFilter]=useState("all");const[fromD,setFromD]=useState("");const[toD,setToD]=useState("");const[supplyFilter,setSupplyFilter]=useState("all");const[highFilter,setHighFilter]=useState("all");const[holdFilter,setHoldFilter]=useState("all");
useEffect(()=>{const h=(e)=>{if((e.ctrlKey||e.metaKey)&&(e.key==="k"||e.key==="K")){e.preventDefault();setMode(v=>v==="tight"?"full":v==="full"?"middle":"tight");}};window.addEventListener("keydown",h);return()=>window.removeEventListener("keydown",h);},[]);
useEffect(()=>{const t=setTimeout(()=>{[...document.querySelectorAll("button")].filter(b=>b.textContent.trim()==="수익MAX").forEach(b=>b.click());},400);return ()=>clearTimeout(t);},[]);useEffect(()=>{try{localStorage.setItem("mode_jd_v1",mode)}catch(e){}},[mode]);const PP=30;const D_live=useMemo(()=>{let _r=D.filter(r=>strictPassJD(r,mode)&&(yearFilter==="all"||(r.d&&r.d.slice(0,4)===yearFilter))&&(!fromD||(r.d&&r.d>=fromD))&&(!toD||(r.d&&r.d<=toD))&&(supplyFilter==="all"||(supplyFilter==="gi_oe"&&r.iv==="기+외")||(supplyFilter==="oe"&&r.iv==="외만")||(supplyFilter==="gi"&&r.iv==="기만")||(supplyFilter==="dual_minus"&&r.iv==="둘다-"))&&(highFilter==="all"||(highFilter==="h60"&&r.h60===1)||(highFilter==="h120"&&r.h120===1)||(highFilter==="both"&&r.h60===1&&r.h120===1)));_r=_r.map(rr=>{const cp=cTP[rr.jdG];if(!cp||!rr.ohlc||!rr.ohlc.length)return rr;const sim=simReal(rr.ohlc,cp.tp1,cp.tp2,cp.sl,cp.fsl||0);return{g:(rr.jdG||"B"),ta:rr.mc,...rr,t:sim.t,r:sim.r,tp1d:sim.tp1d||rr.tp1d,tp2d:sim.tp2d||rr.tp2d,sld:sim.sld||rr.sld,bed:sim.bed,exd:sim.exd||rr.exd,tp1dy:sim.tp1dy,tp2dy:sim.tp2dy,sldy:sim.sldy,bedy:sim.bedy,exdy:sim.exdy};});if(holdFilter!=="all"){const hd=+holdFilter;_r=_r.filter(x=>x.ohlc&&x.ohlc.length>=hd).map(x=>({...x,t:x.ohlc[hd-1].c,r:hd+"일보유"}));}return _r;},[cTP,mode,yearFilter,fromD,toD,supplyFilter,highFilter,holdFilter]);const st=useMemo(()=>{const r={};["S+","S","A+","A","B+","B","C"].forEach(g=>{const d=D_live.filter(x=>x.jdG===g),w=d.filter(x=>x.t>0),sl=d.filter(x=>x.r==="SL"),bo=d.filter(x=>x.r==="BOTH"),tp1=d.filter(x=>{const rr=x.r;return rr==="TP1"||rr==="BOTH";}),to=d.filter(x=>x.r==="TO");const avg=d.length?(d.reduce((s,x)=>s+x.t,0)/d.length):0;const nw=d.map(x=>x);const nwCum=Math.round(nw.reduce((s,x)=>s+x.t,0));const nwWin=nw.filter(x=>x.t>0).length;r[g]={n:d.length,avg:avg.toFixed(2),wr:d.length?Math.round(w.length/d.length*100):0,cum:Math.round(d.reduce((s,x)=>s+x.t,0)),tp1c:tp1.length,tp1r:d.length?Math.round(tp1.length/d.length*100):0,boc:bo.length,bor:d.length?Math.round(bo.length/d.length*100):0,slc:sl.length,slr:d.length?Math.round(sl.length/d.length*100):0,toc:to.length,tor:d.length?Math.round(to.length/d.length*100):0,nwCum,nwWr:d.length?Math.round(nwWin/d.length*100):0}});return r},[cTP,D_live]);const fl=useMemo(()=>{let d=D_live.filter(r=>r.jdG===tab);return[...d].sort((a,b)=>{const av=a[srt.c],bv=b[srt.c];if(typeof av==="number")return (srt.d==="asc"?av-bv:bv-av);return srt.d==="asc"?String(av).localeCompare(String(bv)):String(bv).localeCompare(String(av))})},[tab,srt,invAmt,D_live]);const portfolio=useMemo(()=>{
const amt=invAmt.useSame?{"S+":invAmt.same,"S":invAmt.same,"A+":invAmt.same,"A":invAmt.same,"B+":invAmt.same,"B":invAmt.same,"C":invAmt.same}:{"S+":invAmt["S+"],"S":invAmt.S,"A+":invAmt["A+"],"A":invAmt.A,"B+":invAmt["B+"],"B":invAmt.B,"C":invAmt.C};
const parseTA=s=>{if(!s)return 0;const m=s.match(/(\d+)억/);return m?+m[1]:0;};
const byG={"S+":{n:0,pnl:0,win:0,amt:0},"S":{n:0,pnl:0,win:0,amt:0},"A+":{n:0,pnl:0,win:0,amt:0},"A":{n:0,pnl:0,win:0,amt:0},"B+":{n:0,pnl:0,win:0,amt:0},"B":{n:0,pnl:0,win:0,amt:0},"C":{n:0,pnl:0,win:0,amt:0}};
let resStats={tp:0,sl:0,to:0,trail:0,be:0};
let filtered=0;
for(const r of D_live){
const g=r.jdG||"B";
if(!byG[g])continue;
if(g==="X")continue;

const tPct=r.t||0;
const gAmt=amt[g]||0;
const gain=Math.round(gAmt*tPct/100);
byG[g].n++;byG[g].pnl+=gain;byG[g].amt+=gAmt;
if(tPct>0){byG[g].win++;resStats.tp++;}else if(tPct<0){if(r.r==="SL")resStats.sl++;else if(r.r==="TRAIL")resStats.trail++;else resStats.to++;}else{resStats.be++;}
}
const total={n:0,pnl:0,win:0,amt:0};
for(const g of["S+","S","A+","A","B+","B","C"]){total.n+=byG[g].n;total.pnl+=byG[g].pnl;total.win+=byG[g].win;total.amt+=byG[g].amt;}
try{localStorage.setItem("invAmt_jd_v1",JSON.stringify(invAmt))}catch(e){}
return{byG,total,resStats,filtered};
},[D_live,invAmt]);const pd=fl.slice(pg*PP,(pg+1)*PP),mx=Math.ceil(fl.length/PP)-1;const ds=c=>setSrt(p=>p.c===c?{c,d:p.d==="asc"?"desc":"asc"}:{c,d:"desc"});return(<div><div style={{marginBottom:8,padding:10,background:"#0f1420",border:"1px solid #2a3040",borderRadius:8,display:"flex",alignItems:"center",gap:10,flexWrap:"wrap"}}><span style={{color:"#9ca3af",fontSize:12,fontWeight:700}}>기간</span>{[["all","전체"],["2026","26년"],["2025","25년"],["2024","24년"],["2023","23년"],["2022","22년"],["2021","21년"]].map(([v,l])=>(<button key={v} onClick={()=>setYearFilter(v)} style={{background:yearFilter===v?"#60a5fa":"#1f2937",color:yearFilter===v?"#000":"#d1d5db",border:"1px solid #374151",borderRadius:6,padding:"4px 10px",fontSize:12,cursor:"pointer",fontWeight:yearFilter===v?700:400}}>{l}</button>))}<span style={{color:"#4b5563"}}>|</span><input type="date" value={fromD} onChange={e=>setFromD(e.target.value)} style={{background:"#1f2937",color:"#fff",border:"1px solid #374151",borderRadius:6,padding:"3px 6px",fontSize:11}}/><span style={{color:"#6b7280",fontSize:11}}>~</span><input type="date" value={toD} onChange={e=>setToD(e.target.value)} style={{background:"#1f2937",color:"#fff",border:"1px solid #374151",borderRadius:6,padding:"3px 6px",fontSize:11}}/><button onClick={()=>{setFromD("");setToD("");setYearFilter("all")}} style={{background:"#374151",color:"#fff",border:"none",borderRadius:6,padding:"3px 8px",fontSize:11,cursor:"pointer"}}>초기화</button><span style={{color:"#4b5563"}}>|</span><span style={{color:"#9ca3af",fontSize:12}}>총 <b style={{color:"#fff"}}>{D_live.length}</b>건</span><span style={{color:"#9ca3af",fontSize:12}}>누적 <b style={{color:D_live.reduce((a,b)=>a+(b.t||0),0)>=0?"#ef4444":"#3b82f6"}}>{D_live.reduce((a,b)=>a+(b.t||0),0).toFixed(1)}%</b></span><span style={{color:"#9ca3af",fontSize:12}}>승률 <b style={{color:"#fff"}}>{D_live.length?(D_live.filter(x=>x.t>0).length/D_live.length*100).toFixed(1):0}%</b></span></div><div style={{marginBottom:8,padding:10,background:"#0f1420",border:"1px solid #2a3040",borderRadius:8,display:"flex",alignItems:"center",gap:10,flexWrap:"wrap"}}><span style={{color:"#9ca3af",fontSize:12,fontWeight:700}}>수급</span>{[["all","전체"],["gi_oe","기+외"],["oe","외만"],["gi","기만"],["dual_minus","둘다-"]].map(([v,l])=>(<button key={v} onClick={()=>setSupplyFilter(v)} style={{background:supplyFilter===v?"#60a5fa":"#1f2937",color:supplyFilter===v?"#000":"#d1d5db",border:"1px solid #374151",borderRadius:6,padding:"4px 10px",fontSize:12,cursor:"pointer",fontWeight:supplyFilter===v?700:400}}>{l}</button>))}<span style={{color:"#9ca3af",fontSize:11,marginLeft:"auto"}}>※ 현재 26년 데이터만 수급 정보 있음 (22~25년 추후 보강 예정)</span></div><div style={{marginBottom:8,padding:10,background:"#0f1420",border:"1px solid #2a3040",borderRadius:8,display:"flex",alignItems:"center",gap:10,flexWrap:"wrap"}}><span style={{color:"#9ca3af",fontSize:12,fontWeight:700}}>신고가</span>{[["all","전체"],["h60","60일↑"],["h120","120일↑"],["both","둘다↑"]].map(([v,l])=>(<button key={v} onClick={()=>setHighFilter(v)} style={{background:highFilter===v?"#f59e0b":"#1f2937",color:highFilter===v?"#000":"#d1d5db",border:"1px solid #374151",borderRadius:6,padding:"4px 10px",fontSize:12,cursor:"pointer",fontWeight:highFilter===v?700:400}}>{l}</button>))}<span style={{color:"#9ca3af",fontSize:11,marginLeft:"auto"}}>※ 25/26년 적용 (22~24년 재수집 예정)</span></div><div style={{marginBottom:8,padding:10,background:"#0f1420",border:"1px solid #2a3040",borderRadius:8,display:"flex",alignItems:"center",gap:10,flexWrap:"wrap"}}><span style={{color:"#9ca3af",fontSize:12,fontWeight:700}}>보유</span>{[["all","전체"],["5","≤5일"],["10","≤10일"],["15","≤15일"],["20","≤20일"],["25","≤25일"],["30","≤30일"],["35","≤35일"],["40","≤40일"],["45","≤45일"],["50","≤50일"],["55","≤55일"],["60","≤60일"]].map(([v,l])=>(<button key={v} onClick={()=>setHoldFilter(v)} style={{background:holdFilter===v?"#10b981":"#1f2937",color:holdFilter===v?"#000":"#d1d5db",border:"1px solid #374151",borderRadius:6,padding:"4px 10px",fontSize:12,cursor:"pointer",fontWeight:holdFilter===v?700:400}}>{l}</button>))}<span style={{color:"#9ca3af",fontSize:11,marginLeft:"auto"}}>※ 60일까지 전구간 적용</span></div><div style={{marginBottom:12,padding:12,background:"#0f1420",border:"1px solid #2a3040",borderRadius:8}}>
<div style={{display:"flex",alignItems:"center",gap:8,marginBottom:10,flexWrap:"wrap"}}>
<span style={{fontSize:12,fontWeight:700,color:"#26C6DA"}}>💰 투자금 계산기</span>
<label style={{display:"flex",alignItems:"center",gap:4,fontSize:11,color:"#aaa",cursor:"pointer"}}>
<input type="checkbox" checked={invAmt.useSame} onChange={e=>setInvAmt({...invAmt,useSame:e.target.checked})}/>
모든 종목 동일 금액
</label>
<button onClick={()=>setMode(mode==="tight"?"full":mode==="full"?"middle":"tight")} style={{padding:"4px 10px",fontSize:10,fontWeight:700,border:"1px solid "+((mode==="tight"?"#dc2626":mode==="middle"?"#F5A623":"#444")),background:(mode==="tight"?"#dc2626":mode==="middle"?"#F5A623":"transparent"),color:(mode==="tight")?"#fff":"#888",borderRadius:4,cursor:"pointer",marginRight:8}}>{mode==="tight"?"🎯 타이트 (Ctrl+K)":mode==="middle"?"🔸 미들 (Ctrl+K)":"⚪ 풀 (Ctrl+K)"}</button><div style={{display:"flex",gap:10,fontSize:10,marginLeft:"auto",flexWrap:"wrap"}}><span style={{color:"#dc2626",fontWeight:700}}>🎯 익절 {portfolio.resStats.tp}건</span><span style={{color:"#2563eb",fontWeight:700}}>🛑 손절 {portfolio.resStats.sl}건</span><span style={{color:"#888"}}>⏱ 기간만료 {portfolio.resStats.to}건</span><span style={{color:"#666"}}>전체 {portfolio.total.n}건</span></div>


</div>
{invAmt.useSame?(
<div style={{display:"flex",alignItems:"center",gap:8,marginBottom:10}}>
<span style={{fontSize:11,color:"#ccc",width:60}}>종목당</span>
<input type="number" value={invAmt.same} onChange={e=>setInvAmt({...invAmt,same:+e.target.value||0})} style={{flex:1,padding:"6px 8px",background:"#1a1a2e",border:"1px solid #333",borderRadius:4,color:"#fff",fontSize:12}} step="100000"/>
<span style={{fontSize:10,color:"#888"}}>원</span>
</div>
):(
<div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:6,marginBottom:10}}>
{["S+","S","A+","A","B+","B","C"].map(gk=>(
<div key={gk} style={{display:"flex",alignItems:"center",gap:4}}>
<span style={{fontSize:11,fontWeight:700,color:gk==="S"?"#dc2626":gk==="A"?"#F5A623":"#5B8DEF",width:20}}>{gk}</span>
<input type="number" value={invAmt[gk]} onChange={e=>setInvAmt({...invAmt,[gk]:+e.target.value||0})} style={{flex:1,padding:"5px 6px",background:"#1a1a2e",border:"1px solid #333",borderRadius:4,color:"#fff",fontSize:11}} step="100000"/>
</div>
))}
</div>
)}
<div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:6}}>
{["S+","S","A+","A","B+","B","C"].map(gk=>{
const d=portfolio.byG[gk];
const roi=d.amt>0?(d.pnl/d.amt*100):0;
const c=d.pnl>0?"#dc2626":d.pnl<0?"#2563eb":"#888";
return(<div key={gk} style={{padding:"8px 10px",background:"#1a1a2e",borderRadius:6,borderLeft:"3px solid "+(gk==="S"?"#dc2626":gk==="A"?"#F5A623":"#5B8DEF")}}>
<div style={{fontSize:10,color:"#888",marginBottom:3}}>{gk}급 ({d.n}건)</div>
<div style={{fontSize:14,fontWeight:700,color:c}}>{d.pnl>=0?"+":""}{d.pnl.toLocaleString()}원</div>
<div style={{fontSize:9,color:"#666"}}>투입 {d.amt.toLocaleString()} · {roi.toFixed(1)}% · 승 {d.n>0?(d.win/d.n*100).toFixed(0):0}%</div>
</div>);
})}
<div style={{padding:"8px 10px",background:"#1a2e2a",borderRadius:6,borderLeft:"3px solid #26C6DA"}}>
<div style={{fontSize:10,color:"#26C6DA",marginBottom:3,fontWeight:700}}>전체 ({portfolio.total.n}건)</div>
<div style={{fontSize:14,fontWeight:700,color:portfolio.total.pnl>0?"#dc2626":portfolio.total.pnl<0?"#2563eb":"#888"}}>{portfolio.total.pnl>=0?"+":""}{portfolio.total.pnl.toLocaleString()}원</div>
<div style={{fontSize:9,color:"#666"}}>투입 {portfolio.total.amt.toLocaleString()} · {portfolio.total.amt>0?(portfolio.total.pnl/portfolio.total.amt*100).toFixed(1):0}% · 승 {portfolio.total.n>0?(portfolio.total.win/portfolio.total.n*100).toFixed(0):0}%</div>
</div>
</div>
</div><div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(148px,1fr))",gap:8,marginBottom:18}}>{["S+","S","A+","A","B+","B","C"].map(g=>{const i=GI[g],s=st[g];return(<div key={g} onClick={()=>{setTab(g);setPg(0);setOpen(null)}} style={{background:tab===g?i.c:i.bg,borderRadius:14,padding:"12px 14px",cursor:"pointer",border:tab===g?"none":"0.5px solid "+i.bd}}><div style={{display:"flex",gap:8,margin:"8px 0",padding:"8px 10px",background:"#f8fafc",borderRadius:8,border:"1px solid #e2e8f0",alignItems:"center",flexWrap:"wrap"}}><span style={{fontSize:11,fontWeight:700,color:"#475569"}}>전략설정</span><label style={{fontSize:10,color:"#64748b"}}>TP1<input type="number" value={cTP[g]?.tp1||""} onChange={(_g=>e=>setCTP(p=>({...p,[_g]:{...p[_g],tp1:+e.target.value}})))(g)} placeholder={NS[g]?.tp1} style={{width:40,margin:"0 4px",padding:"2px 4px",border:"1px solid #cbd5e1",borderRadius:4,fontSize:11}}/>%</label><label style={{fontSize:10,color:"#64748b"}}>TP2<input type="number" value={cTP[g]?.tp2||""} onChange={(_g=>e=>setCTP(p=>({...p,[_g]:{...p[_g],tp2:+e.target.value}})))(g)} placeholder={NS[g]?.tp2} style={{width:40,margin:"0 4px",padding:"2px 4px",border:"1px solid #cbd5e1",borderRadius:4,fontSize:11}}/>%</label><label style={{fontSize:10,color:"#64748b"}}>SL<input type="number" value={cTP[g]?.sl||""} onChange={(_g=>e=>setCTP(p=>({...p,[_g]:{...p[_g],sl:+e.target.value}})))(g)} placeholder={NS[g]?.sl} style={{width:40,margin:"0 4px",padding:"2px 4px",border:"1px solid #cbd5e1",borderRadius:4,fontSize:11}}/>%</label><label style={{fontSize:10,color:"#64748b"}}>강제SL<input type="number" value={cTP[g]?.fsl||""} onChange={(_g=>e=>setCTP(p=>({...p,[_g]:{...p[_g],fsl:+e.target.value}})))(g)} placeholder={NS[g]?.fsl||"off"} style={{width:40,margin:"0 4px",padding:"2px 4px",border:"1px solid #cbd5e1",borderRadius:4,fontSize:11}}/>%</label><button onClick={()=>{setCTP({...cTP,[g]:{tp1:0,tp2:0,sl:0,fsl:0}})}} style={{fontSize:10,padding:"2px 8px",background:"#e2e8f0",border:"none",borderRadius:4,cursor:"pointer"}}>초기화</button> <button onClick={()=>{const ds=D_live.filter(x=>x.jdG===g);let best=null;for(const t1 of [10,15,20,25,30])for(const t2 of [30,50,80,100])for(const sl of [3,5,7,10,15])for(const fsl of [0,7,10,15]){if(t2<=t1)continue;if(fsl>0&&fsl<sl)continue;const rs=ds.map(x=>simReal(x.ohlc,t1,t2,sl,fsl));const cum=rs.reduce((a,x)=>a+x.t,0);if(!best||cum>best.cum)best={t1,t2,sl,fsl,cum};}if(best)setCTP({...cTP,[g]:{tp1:best.t1,tp2:best.t2,sl:best.sl,fsl:best.fsl||0}});}} style={{fontSize:10,padding:"2px 8px",background:"#dbeafe",color:"#1e40af",border:"none",borderRadius:4,cursor:"pointer",marginLeft:4}}>수익MAX</button><button onClick={()=>{const ds=D_live.filter(x=>x.jdG===g);let best=null;for(const tp of [10,15,20,25,30,40,50,60,80,100])for(const sl of [3,5,7,10,15,20]){const rs=ds.map(x=>simReal(x.ohlc,tp,tp*2,sl,0));const cum=rs.reduce((a,x)=>a+x.t,0);if(!best||cum>best.cum)best={tp,sl,cum};}if(best)setCTP({...cTP,[g]:{tp1:best.tp,tp2:best.tp,sl:best.sl}});}} style={{fontSize:10,padding:"2px 8px",background:"#ffedd5",color:"#ea580c",border:"none",borderRadius:4,cursor:"pointer",marginLeft:4}}>단일TP</button>{(()=>{const ds=D_live.filter(x=>x.jdG===g);const rs=ds.map(x=>x);const cum=Math.round(rs.reduce((a,x)=>a+x.t,0));const wr=ds.length?Math.round(rs.filter(x=>x.t>0).length/ds.length*100):0;const ev=ds.length?(rs.reduce((a,x)=>a+x.t,0)/ds.length).toFixed(2):0;return(<span style={{fontSize:11,fontWeight:700,marginLeft:8}}><span style={{color:"#2563eb"}}>누적{cum>0?"+":""}{cum}%</span> <span style={{color:"#dc2626"}}>승률{wr}%</span> <span style={{color:"#7c3aed"}}>EV={ev}</span></span>)})()}</div><div style={{display:"flex",justifyContent:"space-between"}}><span style={{fontSize:26,fontWeight:900,color:tab===g?"#fff":i.c}}>{g}</span></div><div style={{fontSize:22,fontWeight:900,color:tab===g?"#fff":i.c}}>{s.n}<span style={{fontSize:11,fontWeight:400}}>건</span></div><div style={{fontSize:11,color:tab===g?"rgba(255,255,255,0.8)":"#64748b",marginTop:2}}>+{s.avg}%/건 · 승률<strong>{s.wr}%</strong> · 현행+{s.cum}%</div><div style={{fontSize:10,color:tab===g?"rgba(255,255,255,0.65)":"#94a3b8",marginTop:1}}>TP1{s.tp1c}({s.tp1r}%) · TP2{s.boc}({s.bor}%) · SL{s.slc}({s.slr}%)</div></div>)})}</div>{st[tab]&&<div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:6,marginBottom:12}}><div style={{background:"#f0fdf4",borderRadius:10,padding:"8px 10px",textAlign:"center",border:"1px solid #fee2e2"}}><div style={{fontSize:10,color:"#dc2626"}}>익절 (TP1+TP2)</div><div style={{fontSize:18,fontWeight:900,color:"#dc2626"}}>{st[tab].tp1c}건</div><div style={{fontSize:10,color:"#64748b"}}>{st[tab].tp1r}% · TP2{st[tab].boc}건({st[tab].bor}%)</div></div><div style={{background:"#fef2f2",borderRadius:10,padding:"8px 10px",textAlign:"center",border:"1px solid #fecaca"}}><div style={{fontSize:10,color:"#dc2626"}}>손절 (SL)</div><div style={{fontSize:18,fontWeight:900,color:"#dc2626"}}>{st[tab].slc}건</div><div style={{fontSize:10,color:"#64748b"}}>{Math.round((st[tab].slc)/st[tab].n*100)}%</div></div><div style={{background:"#f8fafc",borderRadius:10,padding:"8px 10px",textAlign:"center",border:"1px solid #e2e8f0"}}><div style={{fontSize:10,color:"#64748b"}}>기간만료 (TO)</div><div style={{fontSize:18,fontWeight:900,color:"#64748b"}}>{st[tab].toc}건</div><div style={{fontSize:10,color:"#94a3b8"}}>{st[tab].tor}%</div></div></div>}<div style={{borderRadius:12,border:"1px solid #e2e8f0",overflow:"hidden"}}><div style={{overflowX:"auto"}}><table style={{width:"100%",minWidth:760,borderCollapse:"collapse",fontSize:13}}><thead><tr style={{background:"#f8fafc"}}>{[{k:"d",l:"날짜"},{k:"n",l:"종목"},{k:"ch",l:"등락"},{k:"iv",l:"수급"},{k:"sc",l:"NEO"},{k:"r",l:""}].map(h=>(<th key={h.k} onClick={()=>ds(h.k)} style={{padding:"8px 5px",textAlign:h.k==="n"?"left":"center",fontWeight:600,fontSize:11,color:"#94a3b8",cursor:"pointer",borderBottom:"2px solid #e2e8f0",whiteSpace:"nowrap",userSelect:"none"}}>{h.l}{srt.c===h.k?(srt.d==="asc"?" ↑":" ↓"):""}</th>))}</tr></thead><tbody>{pd.map((r,i)=>{const isO=open===pg*PP+i,gi=GI[r.jdG];return[<tr key={"r"+i} onClick={()=>setOpen(isO?null:pg*PP+i)} style={{cursor:"pointer",borderBottom:"1px solid #f1f5f9",background:isO?gi.bg:"#fff"}}><td style={{padding:"8px 5px",textAlign:"center",fontSize:11,color:"#94a3b8"}}>{r.d.slice(2)}</td><td style={{padding:"8px 5px",fontWeight:700,fontSize:13,maxWidth:120,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{r.n}</td><td style={{padding:"8px 5px",textAlign:"center",fontWeight:700,color:"#dc2626",fontSize:12}}>+{r.ch}%</td><td style={{padding:"8px 5px",textAlign:"center",fontSize:11,fontWeight:600,color:r.iv==="기+외"?"#7c3aed":r.iv==="외인"?"#2563eb":"#94a3b8"}}>{r.iv}</td><td style={{padding:"8px 5px",textAlign:"center"}}><span style={{background:gi.c+"12",color:gi.c,padding:"1px 7px",borderRadius:20,fontWeight:800,fontSize:12}}>{r.sc}</span></td><td style={{padding:"8px 5px",textAlign:"center",fontWeight:800,fontSize:13,color:r.t>0?"#dc2626":"#2563eb"}}>{((r.t>0?"+":"")+r.t+"%"+(function(){var a=invAmt.useSame?invAmt.same:(invAmt[r.jdG]||0);if(!a)return"";var g=Math.round(a*r.t/100);return" ("+(g>=0?"+":"")+g.toLocaleString()+"원)";})())}</td><td style={{padding:"8px 5px",textAlign:"center"}}><span style={{padding:"1px 4px",borderRadius:4,fontSize:10,fontWeight:700,background:RC(r.r)+"12",color:RC(r.r)}}>{RL(r.r)}</span></td></tr>,isO&&(<tr key={"d"+i}><td colSpan={9} style={{padding:0}}><div style={{padding:"12px 16px",background:gi.bg,borderBottom:"2px solid "+gi.bd}}><div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(80px,1fr))",gap:5,marginBottom:8}}>{[{l:"시총",v:r.mc},{l:"수급",v:r.iv},{l:"최대↑",v:"+"+r.pk+"%",c:"#dc2626"},{l:"최대↓",v:r.dd+"%",c:"#dc2626"},{l:"TP1도달일",v:r.tp1d?r.tp1d+(r.tp1dy?" ("+r.tp1dy+"일)":""):"-",c:r.tp1d?"#2563eb":"#94a3b8"},{l:"SL손절일",v:r.sld?r.sld+(r.sldy?" ("+r.sldy+"일)":""):"-",c:r.sld?"#dc2626":"#94a3b8"},{l:"TP2도달일",v:r.tp2d||"-",c:r.tp2d?"#dc2626":"#94a3b8"},{l:"청산일",v:r.exd?r.exd+(r.exdy?" ("+r.exdy+"일)":""):"-",c:"#64748b"}].map((x,j)=>(<div key={j} style={{background:"#fff",borderRadius:6,padding:"4px 6px"}}><div style={{fontSize:9,color:"#94a3b8"}}>{x.l}</div><div style={{fontSize:13,fontWeight:700,color:x.c||"#1e293b"}}>{x.v}</div></div>))}</div><div style={{background:"#fff",borderRadius:6,padding:"12px 14px"}}><div style={{display:"flex",alignItems:"baseline",gap:10,marginBottom:6,flexWrap:"wrap"}}><div style={{fontSize:22,fontWeight:900,color:r.t>=0?"#dc2626":"#2563eb"}}>실현 {r.t>0?"+":""}{r.t}%</div><div style={{fontSize:10,color:"#94a3b8",fontWeight:600}}>거래 시나리오</div></div><div style={{fontSize:11,color:"#475569",lineHeight:1.8}}>{SD(r,cTP)}</div></div></div></td></tr>)]})}</tbody></table></div></div><div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginTop:10}}><span style={{fontSize:12,color:"#94a3b8"}}>{fl.length}건 중 {pg*PP+1}~{Math.min((pg+1)*PP,fl.length)}</span><div style={{display:"flex",gap:4}}><button onClick={()=>setPg(Math.max(0,pg-1))} disabled={pg===0} style={{padding:"5px 12px",borderRadius:8,border:"1px solid #e2e8f0",background:"#fff",fontSize:13,fontWeight:700,cursor:pg===0?"default":"pointer",color:pg===0?"#e2e8f0":"#1e293b"}}>←</button><input type="number" value={pg+1} min={1} max={mx+1} onChange={e=>{const v=parseInt(e.target.value)-1;if(!isNaN(v)&&v>=0&&v<=mx)setPg(v);}} style={{padding:"5px 4px",fontSize:13,color:"#64748b",width:50,textAlign:"center",border:"1px solid #e2e8f0",borderRadius:6}}/><span style={{padding:"5px 2px",fontSize:13,color:"#94a3b8"}}>/{mx+1}</span><button onClick={()=>setPg(Math.min(mx,pg+1))} disabled={pg>=mx} style={{padding:"5px 12px",borderRadius:8,border:"1px solid #e2e8f0",background:"#fff",fontSize:13,fontWeight:700,cursor:pg>=mx?"default":"pointer",color:pg>=mx?"#e2e8f0":"#1e293b"}}>→</button></div></div></div>);}



function HaseunghoonDB(){const [tab,setTab]=useState("S+");const [cTP,setCTP]=useState(HSNS);const [srt,setSrt]=useState({c:"d",d:"desc"});const [open,setOpen]=useState(null);const [pg,setPg]=useState(0);const[invAmt,setInvAmt]=useState(()=>{try{return JSON.parse(localStorage.getItem("invAmt_hs_v1")||"")||{"S+":1000000,S:1000000,"A+":700000,A:500000,"B+":400000,B:300000,C:100000,same:500000,useSame:false}}catch(e){return{"S+":1000000,S:1000000,"A+":700000,A:500000,"B+":400000,B:300000,C:100000,same:500000,useSame:false}}});const[mode,setMode]=useState(()=>{try{const v=localStorage.getItem("mode_hs_v1");return v==="full"||v==="middle"||v==="tight"?v:"tight"}catch(e){return "tight"}});const[yearFilter,setYearFilter]=useState("all");const[fromD,setFromD]=useState("");const[toD,setToD]=useState("");const[supplyFilter,setSupplyFilter]=useState("all");const[highFilter,setHighFilter]=useState("all");const[holdFilter,setHoldFilter]=useState("all");
useEffect(()=>{const h=(e)=>{if((e.ctrlKey||e.metaKey)&&(e.key==="k"||e.key==="K")){e.preventDefault();setMode(v=>v==="tight"?"full":v==="full"?"middle":"tight");}};window.addEventListener("keydown",h);return()=>window.removeEventListener("keydown",h);},[]);
useEffect(()=>{const t=setTimeout(()=>{[...document.querySelectorAll("button")].filter(b=>b.textContent.trim()==="수익MAX").forEach(b=>b.click());},400);return ()=>clearTimeout(t);},[]);useEffect(()=>{try{localStorage.setItem("mode_hs_v1",mode)}catch(e){}},[mode]);const PP=30;const D_live=useMemo(()=>{let _r=D.filter(r=>strictPassHS(r,mode)&&(yearFilter==="all"||(r.d&&r.d.slice(0,4)===yearFilter))&&(!fromD||(r.d&&r.d>=fromD))&&(!toD||(r.d&&r.d<=toD))&&(supplyFilter==="all"||(supplyFilter==="gi_oe"&&r.iv==="기+외")||(supplyFilter==="oe"&&r.iv==="외만")||(supplyFilter==="gi"&&r.iv==="기만")||(supplyFilter==="dual_minus"&&r.iv==="둘다-"))&&(highFilter==="all"||(highFilter==="h60"&&r.h60===1)||(highFilter==="h120"&&r.h120===1)||(highFilter==="both"&&r.h60===1&&r.h120===1)));_r=_r.map(rr=>{const cp=cTP[rr.hsG];if(!cp||!rr.ohlc||!rr.ohlc.length)return rr;const sim=simReal(rr.ohlc,cp.tp1,cp.tp2,cp.sl,cp.fsl||0);return{g:(rr.hsG||"B"),ta:rr.mc,...rr,t:sim.t,r:sim.r,tp1d:sim.tp1d||rr.tp1d,tp2d:sim.tp2d||rr.tp2d,sld:sim.sld||rr.sld,bed:sim.bed,exd:sim.exd||rr.exd,tp1dy:sim.tp1dy,tp2dy:sim.tp2dy,sldy:sim.sldy,bedy:sim.bedy,exdy:sim.exdy};});if(holdFilter!=="all"){const hd=+holdFilter;_r=_r.filter(x=>x.ohlc&&x.ohlc.length>=hd).map(x=>({...x,t:x.ohlc[hd-1].c,r:hd+"일보유"}));}return _r;},[cTP,mode,yearFilter,fromD,toD,supplyFilter,highFilter,holdFilter]);const st=useMemo(()=>{const r={};["S+","S","A+","A","B+","B","C"].forEach(g=>{const d=D_live.filter(x=>x.hsG===g),w=d.filter(x=>x.t>0),sl=d.filter(x=>x.r==="SL"),bo=d.filter(x=>x.r==="BOTH"),tp1=d.filter(x=>{const rr=x.r;return rr==="TP1"||rr==="BOTH";}),to=d.filter(x=>x.r==="TO");const avg=d.length?(d.reduce((s,x)=>s+x.t,0)/d.length):0;const nw=d.map(x=>x);const nwCum=Math.round(nw.reduce((s,x)=>s+x.t,0));const nwWin=nw.filter(x=>x.t>0).length;r[g]={n:d.length,avg:avg.toFixed(2),wr:d.length?Math.round(w.length/d.length*100):0,cum:Math.round(d.reduce((s,x)=>s+x.t,0)),tp1c:tp1.length,tp1r:d.length?Math.round(tp1.length/d.length*100):0,boc:bo.length,bor:d.length?Math.round(bo.length/d.length*100):0,slc:sl.length,slr:d.length?Math.round(sl.length/d.length*100):0,toc:to.length,tor:d.length?Math.round(to.length/d.length*100):0,nwCum,nwWr:d.length?Math.round(nwWin/d.length*100):0}});return r},[cTP,D_live]);const fl=useMemo(()=>{let d=D_live.filter(r=>r.hsG===tab);return[...d].sort((a,b)=>{const av=a[srt.c],bv=b[srt.c];if(typeof av==="number")return (srt.d==="asc"?av-bv:bv-av);return srt.d==="asc"?String(av).localeCompare(String(bv)):String(bv).localeCompare(String(av))})},[tab,srt,invAmt,D_live]);const portfolio=useMemo(()=>{
const amt=invAmt.useSame?{"S+":invAmt.same,"S":invAmt.same,"A+":invAmt.same,"A":invAmt.same,"B+":invAmt.same,"B":invAmt.same,"C":invAmt.same}:{"S+":invAmt["S+"],"S":invAmt.S,"A+":invAmt["A+"],"A":invAmt.A,"B+":invAmt["B+"],"B":invAmt.B,"C":invAmt.C};
const parseTA=s=>{if(!s)return 0;const m=s.match(/(\d+)억/);return m?+m[1]:0;};
const byG={"S+":{n:0,pnl:0,win:0,amt:0},"S":{n:0,pnl:0,win:0,amt:0},"A+":{n:0,pnl:0,win:0,amt:0},"A":{n:0,pnl:0,win:0,amt:0},"B+":{n:0,pnl:0,win:0,amt:0},"B":{n:0,pnl:0,win:0,amt:0},"C":{n:0,pnl:0,win:0,amt:0}};
let resStats={tp:0,sl:0,to:0,trail:0,be:0};
let filtered=0;
for(const r of D_live){
const g=r.hsG||"B";
if(!byG[g])continue;
if(g==="X")continue;

const tPct=r.t||0;
const gAmt=amt[g]||0;
const gain=Math.round(gAmt*tPct/100);
byG[g].n++;byG[g].pnl+=gain;byG[g].amt+=gAmt;
if(tPct>0){byG[g].win++;resStats.tp++;}else if(tPct<0){if(r.r==="SL")resStats.sl++;else if(r.r==="TRAIL")resStats.trail++;else resStats.to++;}else{resStats.be++;}
}
const total={n:0,pnl:0,win:0,amt:0};
for(const g of["S+","S","A+","A","B+","B","C"]){total.n+=byG[g].n;total.pnl+=byG[g].pnl;total.win+=byG[g].win;total.amt+=byG[g].amt;}
try{localStorage.setItem("invAmt_hs_v1",JSON.stringify(invAmt))}catch(e){}
return{byG,total,resStats,filtered};
},[D_live,invAmt]);const pd=fl.slice(pg*PP,(pg+1)*PP),mx=Math.ceil(fl.length/PP)-1;const ds=c=>setSrt(p=>p.c===c?{c,d:p.d==="asc"?"desc":"asc"}:{c,d:"desc"});return(<div><div style={{marginBottom:8,padding:10,background:"#0f1420",border:"1px solid #2a3040",borderRadius:8,display:"flex",alignItems:"center",gap:10,flexWrap:"wrap"}}><span style={{color:"#9ca3af",fontSize:12,fontWeight:700}}>기간</span>{[["all","전체"],["2026","26년"],["2025","25년"],["2024","24년"],["2023","23년"],["2022","22년"],["2021","21년"]].map(([v,l])=>(<button key={v} onClick={()=>setYearFilter(v)} style={{background:yearFilter===v?"#60a5fa":"#1f2937",color:yearFilter===v?"#000":"#d1d5db",border:"1px solid #374151",borderRadius:6,padding:"4px 10px",fontSize:12,cursor:"pointer",fontWeight:yearFilter===v?700:400}}>{l}</button>))}<span style={{color:"#4b5563"}}>|</span><input type="date" value={fromD} onChange={e=>setFromD(e.target.value)} style={{background:"#1f2937",color:"#fff",border:"1px solid #374151",borderRadius:6,padding:"3px 6px",fontSize:11}}/><span style={{color:"#6b7280",fontSize:11}}>~</span><input type="date" value={toD} onChange={e=>setToD(e.target.value)} style={{background:"#1f2937",color:"#fff",border:"1px solid #374151",borderRadius:6,padding:"3px 6px",fontSize:11}}/><button onClick={()=>{setFromD("");setToD("");setYearFilter("all")}} style={{background:"#374151",color:"#fff",border:"none",borderRadius:6,padding:"3px 8px",fontSize:11,cursor:"pointer"}}>초기화</button><span style={{color:"#4b5563"}}>|</span><span style={{color:"#9ca3af",fontSize:12}}>총 <b style={{color:"#fff"}}>{D_live.length}</b>건</span><span style={{color:"#9ca3af",fontSize:12}}>누적 <b style={{color:D_live.reduce((a,b)=>a+(b.t||0),0)>=0?"#ef4444":"#3b82f6"}}>{D_live.reduce((a,b)=>a+(b.t||0),0).toFixed(1)}%</b></span><span style={{color:"#9ca3af",fontSize:12}}>승률 <b style={{color:"#fff"}}>{D_live.length?(D_live.filter(x=>x.t>0).length/D_live.length*100).toFixed(1):0}%</b></span></div><div style={{marginBottom:8,padding:10,background:"#0f1420",border:"1px solid #2a3040",borderRadius:8,display:"flex",alignItems:"center",gap:10,flexWrap:"wrap"}}><span style={{color:"#9ca3af",fontSize:12,fontWeight:700}}>수급</span>{[["all","전체"],["gi_oe","기+외"],["oe","외만"],["gi","기만"],["dual_minus","둘다-"]].map(([v,l])=>(<button key={v} onClick={()=>setSupplyFilter(v)} style={{background:supplyFilter===v?"#60a5fa":"#1f2937",color:supplyFilter===v?"#000":"#d1d5db",border:"1px solid #374151",borderRadius:6,padding:"4px 10px",fontSize:12,cursor:"pointer",fontWeight:supplyFilter===v?700:400}}>{l}</button>))}<span style={{color:"#9ca3af",fontSize:11,marginLeft:"auto"}}>※ 현재 26년 데이터만 수급 정보 있음 (22~25년 추후 보강 예정)</span></div><div style={{marginBottom:8,padding:10,background:"#0f1420",border:"1px solid #2a3040",borderRadius:8,display:"flex",alignItems:"center",gap:10,flexWrap:"wrap"}}><span style={{color:"#9ca3af",fontSize:12,fontWeight:700}}>신고가</span>{[["all","전체"],["h60","60일↑"],["h120","120일↑"],["both","둘다↑"]].map(([v,l])=>(<button key={v} onClick={()=>setHighFilter(v)} style={{background:highFilter===v?"#f59e0b":"#1f2937",color:highFilter===v?"#000":"#d1d5db",border:"1px solid #374151",borderRadius:6,padding:"4px 10px",fontSize:12,cursor:"pointer",fontWeight:highFilter===v?700:400}}>{l}</button>))}<span style={{color:"#9ca3af",fontSize:11,marginLeft:"auto"}}>※ 25/26년 적용 (22~24년 재수집 예정)</span></div><div style={{marginBottom:8,padding:10,background:"#0f1420",border:"1px solid #2a3040",borderRadius:8,display:"flex",alignItems:"center",gap:10,flexWrap:"wrap"}}><span style={{color:"#9ca3af",fontSize:12,fontWeight:700}}>보유</span>{[["all","전체"],["5","≤5일"],["10","≤10일"],["15","≤15일"],["20","≤20일"],["25","≤25일"],["30","≤30일"],["35","≤35일"],["40","≤40일"],["45","≤45일"],["50","≤50일"],["55","≤55일"],["60","≤60일"]].map(([v,l])=>(<button key={v} onClick={()=>setHoldFilter(v)} style={{background:holdFilter===v?"#10b981":"#1f2937",color:holdFilter===v?"#000":"#d1d5db",border:"1px solid #374151",borderRadius:6,padding:"4px 10px",fontSize:12,cursor:"pointer",fontWeight:holdFilter===v?700:400}}>{l}</button>))}<span style={{color:"#9ca3af",fontSize:11,marginLeft:"auto"}}>※ 60일까지 전구간 적용</span></div><div style={{marginBottom:12,padding:12,background:"#0f1420",border:"1px solid #2a3040",borderRadius:8}}>
<div style={{display:"flex",alignItems:"center",gap:8,marginBottom:10,flexWrap:"wrap"}}>
<span style={{fontSize:12,fontWeight:700,color:"#26C6DA"}}>💰 투자금 계산기</span>
<label style={{display:"flex",alignItems:"center",gap:4,fontSize:11,color:"#aaa",cursor:"pointer"}}>
<input type="checkbox" checked={invAmt.useSame} onChange={e=>setInvAmt({...invAmt,useSame:e.target.checked})}/>
모든 종목 동일 금액
</label>
<button onClick={()=>setMode(mode==="tight"?"full":mode==="full"?"middle":"tight")} style={{padding:"4px 10px",fontSize:10,fontWeight:700,border:"1px solid "+((mode==="tight"?"#dc2626":mode==="middle"?"#F5A623":"#444")),background:(mode==="tight"?"#dc2626":mode==="middle"?"#F5A623":"transparent"),color:(mode==="tight")?"#fff":"#888",borderRadius:4,cursor:"pointer",marginRight:8}}>{mode==="tight"?"🎯 타이트 (Ctrl+K)":mode==="middle"?"🔸 미들 (Ctrl+K)":"⚪ 풀 (Ctrl+K)"}</button><div style={{display:"flex",gap:10,fontSize:10,marginLeft:"auto",flexWrap:"wrap"}}><span style={{color:"#dc2626",fontWeight:700}}>🎯 익절 {portfolio.resStats.tp}건</span><span style={{color:"#2563eb",fontWeight:700}}>🛑 손절 {portfolio.resStats.sl}건</span><span style={{color:"#888"}}>⏱ 기간만료 {portfolio.resStats.to}건</span><span style={{color:"#666"}}>전체 {portfolio.total.n}건</span></div>


</div>
{invAmt.useSame?(
<div style={{display:"flex",alignItems:"center",gap:8,marginBottom:10}}>
<span style={{fontSize:11,color:"#ccc",width:60}}>종목당</span>
<input type="number" value={invAmt.same} onChange={e=>setInvAmt({...invAmt,same:+e.target.value||0})} style={{flex:1,padding:"6px 8px",background:"#1a1a2e",border:"1px solid #333",borderRadius:4,color:"#fff",fontSize:12}} step="100000"/>
<span style={{fontSize:10,color:"#888"}}>원</span>
</div>
):(
<div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:6,marginBottom:10}}>
{["S+","S","A+","A","B+","B","C"].map(gk=>(
<div key={gk} style={{display:"flex",alignItems:"center",gap:4}}>
<span style={{fontSize:11,fontWeight:700,color:gk==="S"?"#dc2626":gk==="A"?"#F5A623":"#5B8DEF",width:20}}>{gk}</span>
<input type="number" value={invAmt[gk]} onChange={e=>setInvAmt({...invAmt,[gk]:+e.target.value||0})} style={{flex:1,padding:"5px 6px",background:"#1a1a2e",border:"1px solid #333",borderRadius:4,color:"#fff",fontSize:11}} step="100000"/>
</div>
))}
</div>
)}
<div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:6}}>
{["S+","S","A+","A","B+","B","C"].map(gk=>{
const d=portfolio.byG[gk];
const roi=d.amt>0?(d.pnl/d.amt*100):0;
const c=d.pnl>0?"#dc2626":d.pnl<0?"#2563eb":"#888";
return(<div key={gk} style={{padding:"8px 10px",background:"#1a1a2e",borderRadius:6,borderLeft:"3px solid "+(gk==="S"?"#dc2626":gk==="A"?"#F5A623":"#5B8DEF")}}>
<div style={{fontSize:10,color:"#888",marginBottom:3}}>{gk}급 ({d.n}건)</div>
<div style={{fontSize:14,fontWeight:700,color:c}}>{d.pnl>=0?"+":""}{d.pnl.toLocaleString()}원</div>
<div style={{fontSize:9,color:"#666"}}>투입 {d.amt.toLocaleString()} · {roi.toFixed(1)}% · 승 {d.n>0?(d.win/d.n*100).toFixed(0):0}%</div>
</div>);
})}
<div style={{padding:"8px 10px",background:"#1a2e2a",borderRadius:6,borderLeft:"3px solid #26C6DA"}}>
<div style={{fontSize:10,color:"#26C6DA",marginBottom:3,fontWeight:700}}>전체 ({portfolio.total.n}건)</div>
<div style={{fontSize:14,fontWeight:700,color:portfolio.total.pnl>0?"#dc2626":portfolio.total.pnl<0?"#2563eb":"#888"}}>{portfolio.total.pnl>=0?"+":""}{portfolio.total.pnl.toLocaleString()}원</div>
<div style={{fontSize:9,color:"#666"}}>투입 {portfolio.total.amt.toLocaleString()} · {portfolio.total.amt>0?(portfolio.total.pnl/portfolio.total.amt*100).toFixed(1):0}% · 승 {portfolio.total.n>0?(portfolio.total.win/portfolio.total.n*100).toFixed(0):0}%</div>
</div>
</div>
</div><div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(148px,1fr))",gap:8,marginBottom:18}}>{["S+","S","A+","A","B+","B","C"].map(g=>{const i=GI[g],s=st[g];return(<div key={g} onClick={()=>{setTab(g);setPg(0);setOpen(null)}} style={{background:tab===g?i.c:i.bg,borderRadius:14,padding:"12px 14px",cursor:"pointer",border:tab===g?"none":"0.5px solid "+i.bd}}><div style={{display:"flex",gap:8,margin:"8px 0",padding:"8px 10px",background:"#f8fafc",borderRadius:8,border:"1px solid #e2e8f0",alignItems:"center",flexWrap:"wrap"}}><span style={{fontSize:11,fontWeight:700,color:"#475569"}}>전략설정</span><label style={{fontSize:10,color:"#64748b"}}>TP1<input type="number" value={cTP[g]?.tp1||""} onChange={(_g=>e=>setCTP(p=>({...p,[_g]:{...p[_g],tp1:+e.target.value}})))(g)} placeholder={NS[g]?.tp1} style={{width:40,margin:"0 4px",padding:"2px 4px",border:"1px solid #cbd5e1",borderRadius:4,fontSize:11}}/>%</label><label style={{fontSize:10,color:"#64748b"}}>TP2<input type="number" value={cTP[g]?.tp2||""} onChange={(_g=>e=>setCTP(p=>({...p,[_g]:{...p[_g],tp2:+e.target.value}})))(g)} placeholder={NS[g]?.tp2} style={{width:40,margin:"0 4px",padding:"2px 4px",border:"1px solid #cbd5e1",borderRadius:4,fontSize:11}}/>%</label><label style={{fontSize:10,color:"#64748b"}}>SL<input type="number" value={cTP[g]?.sl||""} onChange={(_g=>e=>setCTP(p=>({...p,[_g]:{...p[_g],sl:+e.target.value}})))(g)} placeholder={NS[g]?.sl} style={{width:40,margin:"0 4px",padding:"2px 4px",border:"1px solid #cbd5e1",borderRadius:4,fontSize:11}}/>%</label><label style={{fontSize:10,color:"#64748b"}}>강제SL<input type="number" value={cTP[g]?.fsl||""} onChange={(_g=>e=>setCTP(p=>({...p,[_g]:{...p[_g],fsl:+e.target.value}})))(g)} placeholder={NS[g]?.fsl||"off"} style={{width:40,margin:"0 4px",padding:"2px 4px",border:"1px solid #cbd5e1",borderRadius:4,fontSize:11}}/>%</label><button onClick={()=>{setCTP({...cTP,[g]:{tp1:0,tp2:0,sl:0,fsl:0}})}} style={{fontSize:10,padding:"2px 8px",background:"#e2e8f0",border:"none",borderRadius:4,cursor:"pointer"}}>초기화</button> <button onClick={()=>{const ds=D_live.filter(x=>x.hsG===g);let best=null;for(const t1 of [10,15,20,25,30])for(const t2 of [30,50,80,100])for(const sl of [3,5,7,10,15])for(const fsl of [0,7,10,15]){if(t2<=t1)continue;if(fsl>0&&fsl<sl)continue;const rs=ds.map(x=>simReal(x.ohlc,t1,t2,sl,fsl));const cum=rs.reduce((a,x)=>a+x.t,0);if(!best||cum>best.cum)best={t1,t2,sl,fsl,cum};}if(best)setCTP({...cTP,[g]:{tp1:best.t1,tp2:best.t2,sl:best.sl,fsl:best.fsl||0}});}} style={{fontSize:10,padding:"2px 8px",background:"#dbeafe",color:"#1e40af",border:"none",borderRadius:4,cursor:"pointer",marginLeft:4}}>수익MAX</button><button onClick={()=>{const ds=D_live.filter(x=>x.hsG===g);let best=null;for(const tp of [10,15,20,25,30,40,50,60,80,100])for(const sl of [3,5,7,10,15,20]){const rs=ds.map(x=>simReal(x.ohlc,tp,tp*2,sl,0));const cum=rs.reduce((a,x)=>a+x.t,0);if(!best||cum>best.cum)best={tp,sl,cum};}if(best)setCTP({...cTP,[g]:{tp1:best.tp,tp2:best.tp,sl:best.sl}});}} style={{fontSize:10,padding:"2px 8px",background:"#ffedd5",color:"#ea580c",border:"none",borderRadius:4,cursor:"pointer",marginLeft:4}}>단일TP</button>{(()=>{const ds=D_live.filter(x=>x.hsG===g);const rs=ds.map(x=>x);const cum=Math.round(rs.reduce((a,x)=>a+x.t,0));const wr=ds.length?Math.round(rs.filter(x=>x.t>0).length/ds.length*100):0;const ev=ds.length?(rs.reduce((a,x)=>a+x.t,0)/ds.length).toFixed(2):0;return(<span style={{fontSize:11,fontWeight:700,marginLeft:8}}><span style={{color:"#2563eb"}}>누적{cum>0?"+":""}{cum}%</span> <span style={{color:"#dc2626"}}>승률{wr}%</span> <span style={{color:"#7c3aed"}}>EV={ev}</span></span>)})()}</div><div style={{display:"flex",justifyContent:"space-between"}}><span style={{fontSize:26,fontWeight:900,color:tab===g?"#fff":i.c}}>{g}</span></div><div style={{fontSize:22,fontWeight:900,color:tab===g?"#fff":i.c}}>{s.n}<span style={{fontSize:11,fontWeight:400}}>건</span></div><div style={{fontSize:11,color:tab===g?"rgba(255,255,255,0.8)":"#64748b",marginTop:2}}>+{s.avg}%/건 · 승률<strong>{s.wr}%</strong> · 현행+{s.cum}%</div><div style={{fontSize:10,color:tab===g?"rgba(255,255,255,0.65)":"#94a3b8",marginTop:1}}>TP1{s.tp1c}({s.tp1r}%) · TP2{s.boc}({s.bor}%) · SL{s.slc}({s.slr}%)</div></div>)})}</div>{st[tab]&&<div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:6,marginBottom:12}}><div style={{background:"#f0fdf4",borderRadius:10,padding:"8px 10px",textAlign:"center",border:"1px solid #fee2e2"}}><div style={{fontSize:10,color:"#dc2626"}}>익절 (TP1+TP2)</div><div style={{fontSize:18,fontWeight:900,color:"#dc2626"}}>{st[tab].tp1c}건</div><div style={{fontSize:10,color:"#64748b"}}>{st[tab].tp1r}% · TP2{st[tab].boc}건({st[tab].bor}%)</div></div><div style={{background:"#fef2f2",borderRadius:10,padding:"8px 10px",textAlign:"center",border:"1px solid #fecaca"}}><div style={{fontSize:10,color:"#dc2626"}}>손절 (SL)</div><div style={{fontSize:18,fontWeight:900,color:"#dc2626"}}>{st[tab].slc}건</div><div style={{fontSize:10,color:"#64748b"}}>{Math.round((st[tab].slc)/st[tab].n*100)}%</div></div><div style={{background:"#f8fafc",borderRadius:10,padding:"8px 10px",textAlign:"center",border:"1px solid #e2e8f0"}}><div style={{fontSize:10,color:"#64748b"}}>기간만료 (TO)</div><div style={{fontSize:18,fontWeight:900,color:"#64748b"}}>{st[tab].toc}건</div><div style={{fontSize:10,color:"#94a3b8"}}>{st[tab].tor}%</div></div></div>}<div style={{borderRadius:12,border:"1px solid #e2e8f0",overflow:"hidden"}}><div style={{overflowX:"auto"}}><table style={{width:"100%",minWidth:760,borderCollapse:"collapse",fontSize:13}}><thead><tr style={{background:"#f8fafc"}}>{[{k:"d",l:"날짜"},{k:"n",l:"종목"},{k:"ch",l:"등락"},{k:"iv",l:"수급"},{k:"sc",l:"NEO"},{k:"r",l:""}].map(h=>(<th key={h.k} onClick={()=>ds(h.k)} style={{padding:"8px 5px",textAlign:h.k==="n"?"left":"center",fontWeight:600,fontSize:11,color:"#94a3b8",cursor:"pointer",borderBottom:"2px solid #e2e8f0",whiteSpace:"nowrap",userSelect:"none"}}>{h.l}{srt.c===h.k?(srt.d==="asc"?" ↑":" ↓"):""}</th>))}</tr></thead><tbody>{pd.map((r,i)=>{const isO=open===pg*PP+i,gi=GI[r.hsG];return[<tr key={"r"+i} onClick={()=>setOpen(isO?null:pg*PP+i)} style={{cursor:"pointer",borderBottom:"1px solid #f1f5f9",background:isO?gi.bg:"#fff"}}><td style={{padding:"8px 5px",textAlign:"center",fontSize:11,color:"#94a3b8"}}>{r.d.slice(2)}</td><td style={{padding:"8px 5px",fontWeight:700,fontSize:13,maxWidth:120,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{r.n}</td><td style={{padding:"8px 5px",textAlign:"center",fontWeight:700,color:"#dc2626",fontSize:12}}>+{r.ch}%</td><td style={{padding:"8px 5px",textAlign:"center",fontSize:11,fontWeight:600,color:r.iv==="기+외"?"#7c3aed":r.iv==="외인"?"#2563eb":"#94a3b8"}}>{r.iv}</td><td style={{padding:"8px 5px",textAlign:"center"}}><span style={{background:gi.c+"12",color:gi.c,padding:"1px 7px",borderRadius:20,fontWeight:800,fontSize:12}}>{r.sc}</span></td><td style={{padding:"8px 5px",textAlign:"center",fontWeight:800,fontSize:13,color:r.t>0?"#dc2626":"#2563eb"}}>{((r.t>0?"+":"")+r.t+"%"+(function(){var a=invAmt.useSame?invAmt.same:(invAmt[r.hsG]||0);if(!a)return"";var g=Math.round(a*r.t/100);return" ("+(g>=0?"+":"")+g.toLocaleString()+"원)";})())}</td><td style={{padding:"8px 5px",textAlign:"center"}}><span style={{padding:"1px 4px",borderRadius:4,fontSize:10,fontWeight:700,background:RC(r.r)+"12",color:RC(r.r)}}>{RL(r.r)}</span></td></tr>,isO&&(<tr key={"d"+i}><td colSpan={9} style={{padding:0}}><div style={{padding:"12px 16px",background:gi.bg,borderBottom:"2px solid "+gi.bd}}><div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(80px,1fr))",gap:5,marginBottom:8}}>{[{l:"시총",v:r.mc},{l:"수급",v:r.iv},{l:"최대↑",v:"+"+r.pk+"%",c:"#dc2626"},{l:"최대↓",v:r.dd+"%",c:"#dc2626"},{l:"TP1도달일",v:r.tp1d?r.tp1d+(r.tp1dy?" ("+r.tp1dy+"일)":""):"-",c:r.tp1d?"#2563eb":"#94a3b8"},{l:"SL손절일",v:r.sld?r.sld+(r.sldy?" ("+r.sldy+"일)":""):"-",c:r.sld?"#dc2626":"#94a3b8"},{l:"TP2도달일",v:r.tp2d||"-",c:r.tp2d?"#dc2626":"#94a3b8"},{l:"청산일",v:r.exd?r.exd+(r.exdy?" ("+r.exdy+"일)":""):"-",c:"#64748b"}].map((x,j)=>(<div key={j} style={{background:"#fff",borderRadius:6,padding:"4px 6px"}}><div style={{fontSize:9,color:"#94a3b8"}}>{x.l}</div><div style={{fontSize:13,fontWeight:700,color:x.c||"#1e293b"}}>{x.v}</div></div>))}</div><div style={{background:"#fff",borderRadius:6,padding:"12px 14px"}}><div style={{display:"flex",alignItems:"baseline",gap:10,marginBottom:6,flexWrap:"wrap"}}><div style={{fontSize:22,fontWeight:900,color:r.t>=0?"#dc2626":"#2563eb"}}>실현 {r.t>0?"+":""}{r.t}%</div><div style={{fontSize:10,color:"#94a3b8",fontWeight:600}}>거래 시나리오</div></div><div style={{fontSize:11,color:"#475569",lineHeight:1.8}}>{SD(r,cTP)}</div></div></div></td></tr>)]})}</tbody></table></div></div><div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginTop:10}}><span style={{fontSize:12,color:"#94a3b8"}}>{fl.length}건 중 {pg*PP+1}~{Math.min((pg+1)*PP,fl.length)}</span><div style={{display:"flex",gap:4}}><button onClick={()=>setPg(Math.max(0,pg-1))} disabled={pg===0} style={{padding:"5px 12px",borderRadius:8,border:"1px solid #e2e8f0",background:"#fff",fontSize:13,fontWeight:700,cursor:pg===0?"default":"pointer",color:pg===0?"#e2e8f0":"#1e293b"}}>←</button><input type="number" value={pg+1} min={1} max={mx+1} onChange={e=>{const v=parseInt(e.target.value)-1;if(!isNaN(v)&&v>=0&&v<=mx)setPg(v);}} style={{padding:"5px 4px",fontSize:13,color:"#64748b",width:50,textAlign:"center",border:"1px solid #e2e8f0",borderRadius:6}}/><span style={{padding:"5px 2px",fontSize:13,color:"#94a3b8"}}>/{mx+1}</span><button onClick={()=>setPg(Math.min(mx,pg+1))} disabled={pg>=mx} style={{padding:"5px 12px",borderRadius:8,border:"1px solid #e2e8f0",background:"#fff",fontSize:13,fontWeight:700,cursor:pg>=mx?"default":"pointer",color:pg>=mx?"#e2e8f0":"#1e293b"}}>→</button></div></div></div>);}



function TodaySignals({onSignalsLoaded}){const [data,setData]=useState(null);const [loading,setLoading]=useState(true);const [err,setErr]=useState(null);const [saving,setSaving]=useState(false);const [saveMsg,setSaveMsg]=useState(null);const load=useCallback(async()=>{setLoading(true);setErr(null);try{const r=await fetch(API_URL);const j=await r.json();if(j.ok){const _all=[...(j.signals?.S||[]),...(j.signals?.A||[]),...(j.signals?.B||[]),...(j.signals?.X||[])];const _seen=new Set();const _uniq=_all.filter(x=>{if(_seen.has(x.code))return false;_seen.add(x.code);return true});const _new={S:[],A:[],B:[],X:[]};for(const _x of _uniq){const _a=_x.amount||0,_c=_x.change||0;if(_a<100||_c<10||_c>29)continue;const _g=_a>=5000?'S':_a>=2500?'A':'B';_new[_g].push({..._x,grade:_g});}j.signals=_new;j.all=[..._new.S,..._new.A,..._new.B,..._new.X];j.summary={total:j.all.length,S:_new.S.length,A:_new.A.length,B:_new.B.length,X:_new.X.length};setData(j);if(onSignalsLoaded)onSignalsLoaded(j.all||[]);}else setErr(j.error||"API 오류")}catch(e){setErr(e.message)}setLoading(false)},[]);useEffect(()=>{load()},[load]);const saveSignals=async()=>{if(!data||!data.all||!data.all.length)return;setSaving(true);setSaveMsg(null);try{const r=await fetch(TRACK_API,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(data.all.filter(s=>s.grade!=="X").map(s=>({code:s.code,name:s.name,entry_price:s.price,rate:s.change,score:s.score,grade:s.grade,supply:s.investor,wick:s.wick,vol:s.amount,market:s.market,tp1:s.tp1,tp2:s.tp2,sl:s.sl})))});const j=await r.json();setSaveMsg(j.github_ok?("✅ "+j.added+"건 저장"):("⚠️ GITHUB_TOKEN 미설정 — Vercel 환경변수 추가 필요"));}catch(e){setSaveMsg("오류: "+e.message);}setSaving(false);};const gC=g=>GI[g]?.c||"#94a3b8";if(loading)return(<div style={{textAlign:"center",padding:"60px 20px"}}><div style={{fontSize:36,marginBottom:12}}>⏳</div><div style={{fontSize:16,fontWeight:600,color:"#64748b"}}>KIS API 스크리닝 중...</div><div style={{fontSize:13,color:"#94a3b8",marginTop:4}}>거래대금·등락률 상위 종목 분석 중</div></div>);if(err)return(<div style={{textAlign:"center",padding:"40px 20px"}}><div style={{fontSize:36,marginBottom:12}}>⚠️</div><div style={{fontSize:15,color:"#dc2626",marginBottom:8}}>{err}</div><button onClick={load} style={{padding:"8px 20px",borderRadius:8,border:"1px solid #e2e8f0",background:"#fff",fontSize:14,fontWeight:600,cursor:"pointer"}}>다시 시도</button></div>);if(!data)return null;return(<div><div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}><div style={{fontSize:14,color:"#64748b"}}>{data.date} · {data.time} KST</div><div style={{display:"flex",gap:6}}><button onClick={saveSignals} disabled={saving} style={{padding:"5px 12px",borderRadius:8,border:"none",background:saving?"#e2e8f0":"#1e293b",color:saving?"#94a3b8":"#fff",fontSize:12,fontWeight:700,cursor:saving?"default":"pointer"}}>📌 신호저장</button><button onClick={load} style={{padding:"5px 12px",borderRadius:8,border:"1px solid #e2e8f0",background:"#fff",fontSize:12,fontWeight:600,cursor:"pointer"}}>🔄</button></div></div>{saveMsg&&<div style={{padding:"8px 12px",borderRadius:8,background:saveMsg.startsWith("✅")?"#f0fdf4":"#fffbeb",border:"1px solid "+(saveMsg.startsWith("✅")?"#fee2e2":"#fcd34d"),color:saveMsg.startsWith("✅")?"#dc2626":"#d97706",fontSize:12,marginBottom:10}}>{saveMsg}</div>}<div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:8,marginBottom:16}}>{["S","A","B","X"].map(g=>(<div key={g} style={{textAlign:"center",padding:"10px 0",borderRadius:10,background:gC(g)+"10",border:"1px solid "+gC(g)+"30"}}><div style={{fontSize:22,fontWeight:900,color:gC(g)}}>{data.summary[g]}</div><div style={{fontSize:11,color:"#64748b"}}>{g}등급</div></div>))}</div>{data.all.filter(s=>s.score>=4).length===0?(<div style={{textAlign:"center",padding:"40px",color:"#94a3b8"}}><div style={{fontSize:36,marginBottom:8}}>📭</div><div style={{fontSize:15}}>오늘은 10%+ 돌파 시그널이 없습니다</div><div style={{fontSize:13,marginTop:4}}>장 마감 후(15:30~) 결과가 갱신됩니다</div></div>):data.all.filter(s=>s.score>=4).map((s,i)=>(<div key={i} style={{display:"flex",alignItems:"center",gap:10,padding:"12px 14px",borderRadius:12,border:"1px solid #e2e8f0",marginBottom:6,background:"#fff"}}><div style={{width:42,height:42,borderRadius:10,background:gC(s.grade)+"12",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}><span style={{fontSize:18,fontWeight:900,color:gC(s.grade)}}>{s.grade}</span></div><div style={{flex:1,minWidth:0}}><div style={{display:"flex",alignItems:"center",gap:6}}><span style={{fontWeight:700,fontSize:15}}>{s.name}</span><span style={{fontSize:12,fontWeight:700,color:"#dc2626"}}>+{s.change}%</span></div><div style={{fontSize:11,color:"#94a3b8",marginTop:2}}>{s.score}점 · {s.investor} · {s.market} · {s.amount}억</div></div><div style={{textAlign:"right",flexShrink:0}}></div></div>))}</div>);}

function compressImg(file,maxW){return new Promise(function(res,rej){var img=new Image();img.onload=function(){var w=img.width,h=img.height;if(w>maxW){h=Math.round(h*maxW/w);w=maxW}var c=document.createElement("canvas");c.width=w;c.height=h;c.getContext("2d").drawImage(img,0,0,w,h);var d=c.toDataURL("image/jpeg",0.7);res({name:file.name,data:d.split(",")[1],type:"image/jpeg"})};img.onerror=rej;img.src=URL.createObjectURL(file)})}
function AIAnalysis({onSave}){
  const [imgs, setImgs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState("");
  const [aiResult, setAiResult] = useState(null);
  const [chimResult, setChimResult] = useState(null);
  const [jdResult, setJdResult] = useState(null);
  const [hsResult, setHsResult] = useState(null);
  const [aiError, setAiError] = useState(null);
  const [chimError, setChimError] = useState(null);
  const [jdError, setJdError] = useState(null);
  const [hsError, setHsError] = useState(null);
  const [activeTab, setActiveTab] = useState("ai");
  const fileRef = useRef(null);
  const stockNameRef = useRef(null);

  const handleFiles = e => {
    const files = Array.from(e.target.files);
    Promise.all(files.map(f => compressImg(f, 1024))).then(results => setImgs(prev => [...prev, ...results]));
  };

  const analyze = async () => {
    if (imgs.length === 0) return;
    setLoading(true);
    setAiError(null); setChimError(null); setJdError(null); setHsError(null);
    setAiResult(null); setChimResult(null); setJdResult(null); setHsResult(null);
    setProgress("AI분석 + 침착해 + 주도주 + 하승훈 4중 분석 동시 실행 중...");

    const stockName = stockNameRef.current ? stockNameRef.current.value : "";

    // AI 분석 (NEO-SCORE 14점)
    const aiPromise = (async () => {
      const content = [];
      imgs.forEach(img => {
        content.push({type:"image", source:{type:"base64", media_type:img.type||"image/png", data:img.data}});
      });
      content.push({type:"text", text:"위 차트 이미지를 분석해주세요. 반드시 JSON으로만 응답하세요."});
      const resp = await fetch("https://sector-api-pink.vercel.app/api/analyze", {
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({model:"claude-sonnet-4-20250514", max_tokens:8000, system:SYS_PROMPT, messages:[{role:"user", content}]})
      });
      if (!resp.ok) throw new Error("AI분석 API " + resp.status);
      const data = await resp.json();
      const text = (data.content || []).map(c => c.text || "").join("");
      const clean = text.replace(/```json|```/g, "").trim();
      return JSON.parse(clean);
    })();

    // 침착해 v4 분석
    const chimFn = () => analyzeChimchakhae(imgs, stockName);

    // 주도주 분석
    const jdFn = () => analyzeJudoju(imgs, stockName);

    // 하승훈 돌파매매 분석
    const hsFn = () => analyzeHaseunghoon(imgs, stockName);

    const [aiRes, chimRes, jdRes, hsRes] = await (async () => { const sleep = (ms) => new Promise(r => setTimeout(r, ms)); const a = await Promise.allSettled([aiPromise]); await sleep(15000); const c = await Promise.allSettled([chimFn()]); await sleep(15000); const j = await Promise.allSettled([jdFn()]); await sleep(15000); const h = await Promise.allSettled([hsFn()]); return [a[0], c[0], j[0], h[0]]; })();

    if (aiRes.status === "fulfilled") setAiResult(aiRes.value);
    else setAiError(aiRes.reason.message || "AI분석 실패");

    if (chimRes.status === "fulfilled") setChimResult(chimRes.value);
    else setChimError(chimRes.reason.message || "침착해 분석 실패");

    if (jdRes.status === "fulfilled") setJdResult(jdRes.value);
    else setJdError(jdRes.reason.message || "주도주 분석 실패");

    if (hsRes.status === "fulfilled") setHsResult(hsRes.value);
    else setHsError(hsRes.reason.message || "하승훈 분석 실패");

    setLoading(false);
    setProgress("");
  };

  const save = () => {
    // AI/침착해/주도주/하승훈 중 하나라도 결과 있으면 저장 가능
    if (!aiResult && !chimResult && !jdResult && !hsResult) return;
    // aiResult가 없으면 base에 침착해/주도주/하승훈에서 종목명/날짜 가져옴
    const baseAi = aiResult || {
      stockName: (stockNameRef.current && stockNameRef.current.value) || (chimResult && chimResult.stockName) || (jdResult && jdResult.stockName) || (hsResult && hsResult.stockName) || "",
      stockCode: (chimResult && chimResult.stockCode) || (jdResult && jdResult.stockCode) || (hsResult && hsResult.stockCode) || "",
      name: (stockNameRef.current && stockNameRef.current.value) || (chimResult && chimResult.stockName) || (jdResult && jdResult.stockName) || (hsResult && hsResult.stockName) || "",
      grade: null, score: null,
    };
    onSave({...baseAi, date: new Date().toISOString().slice(0,10), images: imgs.length, chimchakhaeResult: chimResult, judojuResult: jdResult, haseunghoonResult: hsResult});
    setAiResult(null); setChimResult(null); setJdResult(null); setHsResult(null); setImgs([]);
    if (stockNameRef.current) stockNameRef.current.value = "";
  };

  const gC = g => GI[g] && GI[g].c || "#94a3b8";
  const hasResult = aiResult || chimResult || jdResult || hsResult;

  return (
    <div>
      <input ref={stockNameRef} type="text" placeholder="종목명 (선택)" style={{width:"100%", padding:"10px 12px", border:"1px solid #cbd5e1", borderRadius:8, fontSize:13, marginBottom:10, fontFamily:"inherit", boxSizing:"border-box"}} />

      <div onClick={() => fileRef.current && fileRef.current.click()}
        onDragOver={e => {e.preventDefault(); e.stopPropagation(); e.currentTarget.style.borderColor="#3b82f6"; e.currentTarget.style.background="#eff6ff"}}
        onDragLeave={e => {e.currentTarget.style.borderColor="#cbd5e1"; e.currentTarget.style.background="#f8fafc"}}
        onDrop={e => {e.preventDefault(); e.stopPropagation(); e.currentTarget.style.borderColor="#cbd5e1"; e.currentTarget.style.background="#f8fafc"; const fs = Array.from(e.dataTransfer.files).filter(f => f.type.startsWith("image/")); if (fs.length>0) handleFiles({target:{files:fs}})}}
        style={{border:"2px dashed #cbd5e1", borderRadius:14, padding: imgs.length>0 ? "14px" : "44px 14px", textAlign:"center", cursor:"pointer", background:"#f8fafc", marginBottom:14}}>
        <input ref={fileRef} type="file" accept="image/*" multiple onChange={handleFiles} style={{display:"none"}} />
        {imgs.length === 0 ? (
          <div>
            <div style={{fontSize:36, marginBottom:6}}>📊</div>
            <div style={{fontSize:15, fontWeight:700}}>차트 이미지 업로드</div>
            <div style={{fontSize:12, color:"#94a3b8", marginTop:2}}>클릭 또는 드래그앤드롭 · 다중 가능</div>
            <div style={{fontSize:11, color:"#64748b", marginTop:6, fontWeight:600}}>AI분석 + 침착해 + 주도주 3중 동시 실행</div>
          </div>
        ) : (
          <div style={{display:"flex", gap:6, flexWrap:"wrap", justifyContent:"center"}}>
            {imgs.map((img, i) => (
              <div key={i} style={{position:"relative"}}>
                <img src={"data:" + img.type + ";base64," + img.data} style={{width:100, height:66, objectFit:"cover", borderRadius:6, border:"1px solid #e2e8f0"}} />
                <button onClick={e => {e.stopPropagation(); setImgs(prev => prev.filter((_,j) => j !== i))}} style={{position:"absolute", top:-5, right:-5, width:18, height:18, borderRadius:9, border:"none", background:"#dc2626", color:"#fff", fontSize:11, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center"}}>×</button>
              </div>
            ))}
            <div style={{width:100, height:66, borderRadius:6, border:"2px dashed #cbd5e1", display:"flex", alignItems:"center", justifyContent:"center", color:"#94a3b8", fontSize:22}}>+</div>
          </div>
        )}
      </div>

      <button onClick={analyze} disabled={imgs.length === 0 || loading} style={{width:"100%", padding:"14px", borderRadius:10, border:"none", background: imgs.length===0 ? "#e2e8f0" : "linear-gradient(135deg, #1e293b 0%, #0d9488 100%)", color: imgs.length===0 ? "#94a3b8" : "#fff", fontSize:15, fontWeight:800, cursor: imgs.length===0 ? "default" : "pointer", marginBottom:14, letterSpacing:"0.3px"}}>
        {loading ? "⚙️ 분석 중..." : "🔍 AI + 침착해 + 주도주 + 하승훈 4중 분석"}
      </button>

      {progress && <div style={{padding:10, borderRadius:8, background:"#eff6ff", border:"1px solid #bfdbfe", color:"#1e40af", fontSize:12, marginBottom:12, textAlign:"center"}}>{progress}</div>}

      {hasResult && (
        <div>
          {/* 탭 헤더 */}
          <div style={{display:"flex", gap:0, marginBottom:14, borderBottom:"2px solid #e2e8f0", overflowX:"auto"}}>
            <button onClick={() => setActiveTab("ai")} style={{flex:"1 0 auto", minWidth:80, padding:"12px 8px", border:"none", background:"transparent", borderBottom: activeTab==="ai" ? "3px solid #1e293b" : "3px solid transparent", marginBottom:"-2px", fontSize:12, fontWeight: activeTab==="ai" ? 800 : 600, color: activeTab==="ai" ? "#1e293b" : "#94a3b8", cursor:"pointer", fontFamily:"inherit", whiteSpace:"nowrap"}}>
              🤖 AI {aiResult && <span style={{fontSize:11, color: gC(aiResult.grade), fontWeight:900, marginLeft:4}}>{aiResult.grade}</span>}
            </button>
            <button onClick={() => setActiveTab("chim")} style={{flex:"1 0 auto", minWidth:80, padding:"12px 8px", border:"none", background:"transparent", borderBottom: activeTab==="chim" ? "3px solid #7c3aed" : "3px solid transparent", marginBottom:"-2px", fontSize:12, fontWeight: activeTab==="chim" ? 800 : 600, color: activeTab==="chim" ? "#7c3aed" : "#94a3b8", cursor:"pointer", fontFamily:"inherit", whiteSpace:"nowrap"}}>
              🎯 침착해 {chimResult && <span style={{fontSize:11, fontWeight:900, marginLeft:4}}>{chimResult.grade}</span>}
            </button>
            <button onClick={() => setActiveTab("jd")} style={{flex:"1 0 auto", minWidth:80, padding:"12px 8px", border:"none", background:"transparent", borderBottom: activeTab==="jd" ? "3px solid #ca8a04" : "3px solid transparent", marginBottom:"-2px", fontSize:12, fontWeight: activeTab==="jd" ? 800 : 600, color: activeTab==="jd" ? "#ca8a04" : "#94a3b8", cursor:"pointer", fontFamily:"inherit", whiteSpace:"nowrap"}}>
              📈 주도주 {jdResult && <span style={{fontSize:11, fontWeight:900, marginLeft:4}}>{jdResult.grade}</span>}
            </button>
            <button onClick={() => setActiveTab("hs")} style={{flex:"1 0 auto", minWidth:80, padding:"12px 8px", border:"none", background:"transparent", borderBottom: activeTab==="hs" ? "3px solid #0d9488" : "3px solid transparent", marginBottom:"-2px", fontSize:12, fontWeight: activeTab==="hs" ? 800 : 600, color: activeTab==="hs" ? "#0d9488" : "#94a3b8", cursor:"pointer", fontFamily:"inherit", whiteSpace:"nowrap"}}>
              ⚡ 하승훈 {hsResult && <span style={{fontSize:11, fontWeight:900, marginLeft:4}}>{hsResult.grade}</span>}
            </button>
          </div>

          {/* AI 분석 결과 */}
          {activeTab === "ai" && (
            <div>
              {aiError && <div style={{padding:10, borderRadius:8, background:"#fef2f2", border:"1px solid #fca5a5", color:"#dc2626", fontSize:13, marginBottom:14}}>AI분석 실패: {aiError}</div>}
              {aiResult && (
                <div style={{borderRadius:14, border:"2px solid " + gC(aiResult.grade), overflow:"hidden", marginBottom:14}}>
                  <div style={{background: gC(aiResult.grade), padding:"14px 18px", display:"flex", justifyContent:"space-between", alignItems:"center"}}>
                    <div>
                      <div style={{fontSize:11, color:"rgba(255,255,255,0.85)", fontWeight:700, marginBottom:2}}>NEO-SCORE 14점 분석</div>
                      <div style={{fontSize:18, fontWeight:900, color:"#fff"}}>{aiResult.name || "분석 결과"}</div>
                      <div style={{fontSize:11, color:"rgba(255,255,255,0.85)", marginTop:2}}>{aiResult.breakType} · {aiResult.investor} · {aiResult.ema50}</div>
                    </div>
                    <div style={{textAlign:"center"}}>
                      <div style={{fontSize:32, fontWeight:900, color:"#fff", lineHeight:1}}>{aiResult.grade}</div>
                      <div style={{fontSize:13, color:"rgba(255,255,255,0.85)", marginTop:3}}>{aiResult.score}점</div>
                    </div>
                  </div>
                  <div style={{padding:"14px 18px", background:"#fff"}}>
                    <div style={{display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:6, marginBottom:10}}>
                      {[{l:"TP1", v:aiResult.tp1+"%"}, {l:"TP2", v:aiResult.tp2+"%"}, {l:"SL", v:aiResult.sl+"%"}].map((x, i) => (
                        <div key={i} style={{textAlign:"center", padding:8, background:"#f8fafc", borderRadius:8}}>
                          <div style={{fontSize:10, color:"#94a3b8"}}>{x.l}</div>
                          <div style={{fontSize:20, fontWeight:900, color:"#dc2626"}}>{x.v}</div>
                        </div>
                      ))}
                    </div>
                    <div style={{fontSize:13, color:"#475569", lineHeight:1.6, marginBottom:10, padding:10, background:"#f8fafc", borderRadius:8}}>{aiResult.summary}</div>
                    {aiResult.details && (
                      <div style={{fontSize:12}}>
                        {aiResult.details.map((d, i) => (
                          <div key={i} style={{display:"flex", justifyContent:"space-between", padding:"5px 0", borderBottom:"1px solid #f1f5f9"}}>
                            <span style={{color:"#475569"}}>{d.item}</span>
                            <span style={{fontWeight:700, color: d.point !== 0 ? "#dc2626" : "#94a3b8"}}>{d.point > 0 ? "+" : ""}{d.point}</span>
                          </div>
                        ))}
                      </div>
                    )}
                    <button onClick={save} style={{width:"100%", padding:10, borderRadius:8, border:"none", background:"#dc2626", color:"#fff", fontSize:14, fontWeight:700, cursor:"pointer", marginTop:10}}>✅ 히스토리에 저장</button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* 침착해 결과 */}
          {activeTab === "chim" && (
            <div>
              {chimError && <div style={{padding:10, borderRadius:8, background:"#fef2f2", border:"1px solid #fca5a5", color:"#dc2626", fontSize:13, marginBottom:14}}>침착해 분석 실패: {chimError}</div>}
              {chimResult && <ChimchakhaeResultCard result={chimResult} stockName={stockNameRef.current ? stockNameRef.current.value : ""} />}
            </div>
          )}

          {/* 주도주 결과 */}
          {activeTab === "jd" && (
            <div>
              {jdError && <div style={{padding:10, borderRadius:8, background:"#fef2f2", border:"1px solid #fca5a5", color:"#dc2626", fontSize:13, marginBottom:14}}>주도주 분석 실패: {jdError}</div>}
              {jdResult && <JudojuResultCard result={jdResult} stockName={stockNameRef.current ? stockNameRef.current.value : ""} />}
            </div>
          )}

          {/* 하승훈 결과 */}
          {activeTab === "hs" && (
            <div>
              {hsError && <div style={{padding:10, borderRadius:8, background:"#fef2f2", border:"1px solid #fca5a5", color:"#dc2626", fontSize:13, marginBottom:14}}>하승훈 분석 실패: {hsError}</div>}
              {hsResult && <HaseunghoonResultCard result={hsResult} stockName={stockNameRef.current ? stockNameRef.current.value : ""} />}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function History({items:h, onClear, onDelete}) {
  const gC = g => GI[g] && GI[g].c || "#94a3b8";
  const cgC = g => {
    if (g === "S+") return "#dc2626";
    if (g === "S") return "#ef4444";
    if (g === "A+") return "#ea580c";
    if (g === "A") return "#f59e0b";
    if (g === "B+") return "#3b82f6";
    if (g === "B") return "#94a3b8";
    return "#64748b";
  };
  const [sel, setSel] = useState(null);
  const [detailTab, setDetailTab] = useState("ai");

  if (h.length === 0) return (
    <div style={{textAlign:"center", padding:"50px 20px", color:"#94a3b8"}}>
      <div style={{fontSize:40, marginBottom:10}}>📋</div>
      <div style={{fontSize:15, fontWeight:600}}>분석 히스토리가 없습니다</div>
      <div style={{fontSize:13, marginTop:4}}>AI분석 탭에서 차트를 분석하면 여기에 쌓입니다</div>
    </div>
  );

  return (
    <div>
      <div style={{display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:10}}>
        <span style={{fontSize:13, color:"#64748b"}}>총 {h.length}건</span>
        <button onClick={onClear} style={{padding:"5px 10px", borderRadius:6, border:"1px solid #fca5a5", background:"#fff", color:"#dc2626", fontSize:11, fontWeight:600, cursor:"pointer"}}>전체 삭제</button>
      </div>

      {h.map((r, i) => {
        const hasChim = r.chimchakhaeResult && r.chimchakhaeResult.grade;
        const hasJd = r.judojuResult && r.judojuResult.grade;
        const hasHs = r.haseunghoonResult && r.haseunghoonResult.grade;
        return (
          <div key={i} onClick={() => {setSel(i); setDetailTab(r.grade ? "ai" : (hasChim ? "chim" : (hasJd ? "jd" : (hasHs ? "hs" : "ai"))));}} style={{cursor:"pointer", display:"flex", alignItems:"center", gap:10, padding:"10px 14px", borderRadius:10, border:"1px solid #e2e8f0", marginBottom:6, background:"#fff"}}>
            <div style={{width:40, height:40, borderRadius:10, background: gC(r.grade) + "12", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0}}>
              <span style={{fontSize:18, fontWeight:900, color: gC(r.grade)}}>{r.grade}</span>
            </div>
            <div style={{flex:1, minWidth:0}}>
              <div style={{fontWeight:700, fontSize:14, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap"}}>{r.name || (r.chimchakhaeResult && r.chimchakhaeResult.stockName) || (r.judojuResult && r.judojuResult.stockName) || (r.haseunghoonResult && r.haseunghoonResult.stockName) || "-"}</div>
              <div style={{fontSize:11, color:"#94a3b8", marginTop:1}}>{r.date} · {r.score}점 · {r.breakType || "-"} · {r.investor || "-"}</div>
            </div>
            <div style={{textAlign:"right", flexShrink:0, display:"flex", gap:4, flexDirection:"column", alignItems:"flex-end"}}>
              {hasChim && (
                <span style={{fontSize:10, padding:"2px 6px", borderRadius:4, background: cgC(r.chimchakhaeResult.grade) + "22", color: cgC(r.chimchakhaeResult.grade), fontWeight:800}}>
                  침 {r.chimchakhaeResult.grade}
                </span>
              )}
              {hasJd && (
                <span style={{fontSize:10, padding:"2px 6px", borderRadius:4, background: "#ca8a0422", color: "#ca8a04", fontWeight:800}}>
                  주 {r.judojuResult.grade}
                </span>
              )}
              {hasHs && (
                <span style={{fontSize:10, padding:"2px 6px", borderRadius:4, background: "#0d948822", color: "#0d9488", fontWeight:800}}>
                  하 {r.haseunghoonResult.grade}
                </span>
              )}
              <div style={{fontSize:11, color:"#dc2626", fontWeight:700}}>TP{r.tp1}/{r.tp2} · SL{r.sl}%</div>
            </div>
            <button onClick={(e) => {e.stopPropagation(); if(window.confirm("이 항목을 삭제할까요?")) onDelete(i);}} style={{flexShrink:0, width:30, height:30, borderRadius:"50%", border:"1px solid #fca5a5", background:"#fff", color:"#dc2626", fontSize:13, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", padding:0}} title="삭제">🗑</button>
          </div>
        );
      })}

      {/* 상세 모달 */}
      {sel !== null && h[sel] && (
        <div onClick={() => setSel(null)} style={{position:"fixed", top:0, left:0, right:0, bottom:0, background:"rgba(0,0,0,0.6)", zIndex:1000, display:"flex", alignItems:"flex-start", justifyContent:"center", padding:"20px 12px", overflowY:"auto"}}>
          <div onClick={e => e.stopPropagation()} style={{background:"#fff", borderRadius:14, maxWidth:900, width:"100%", padding:0, position:"relative", marginBottom:40}}>
            <button onClick={() => setSel(null)} style={{position:"absolute", top:12, right:12, width:30, height:30, borderRadius:"50%", background:"#f1f5f9", border:"none", cursor:"pointer", fontSize:16, fontWeight:700, color:"#64748b", zIndex:2}}>✕</button>

            {(h[sel].chimchakhaeResult && h[sel].chimchakhaeResult.grade) || (h[sel].judojuResult && h[sel].judojuResult.grade) || (h[sel].haseunghoonResult && h[sel].haseunghoonResult.grade) ? (
              <div style={{display:"flex", borderBottom:"2px solid #e2e8f0", padding:"16px 16px 0", overflowX:"auto"}}>
                {h[sel].grade && (
                  <button onClick={() => setDetailTab("ai")} style={{flex:"1 0 auto", minWidth:80, padding:"10px 8px", border:"none", background:"transparent", borderBottom: detailTab==="ai" ? "3px solid #1e293b" : "3px solid transparent", marginBottom:"-2px", fontSize:12, fontWeight: detailTab==="ai" ? 800 : 600, color: detailTab==="ai" ? "#1e293b" : "#94a3b8", cursor:"pointer", fontFamily:"inherit", whiteSpace:"nowrap"}}>
                    🤖 AI <span style={{fontSize:11, color: gC(h[sel].grade), fontWeight:900, marginLeft:4}}>{h[sel].grade}</span>
                  </button>
                )}
                {h[sel].chimchakhaeResult && h[sel].chimchakhaeResult.grade && (
                  <button onClick={() => setDetailTab("chim")} style={{flex:"1 0 auto", minWidth:80, padding:"10px 8px", border:"none", background:"transparent", borderBottom: detailTab==="chim" ? "3px solid #7c3aed" : "3px solid transparent", marginBottom:"-2px", fontSize:12, fontWeight: detailTab==="chim" ? 800 : 600, color: detailTab==="chim" ? "#7c3aed" : "#94a3b8", cursor:"pointer", fontFamily:"inherit", whiteSpace:"nowrap"}}>
                    🎯 침착해 <span style={{fontSize:11, color: cgC(h[sel].chimchakhaeResult.grade), fontWeight:900, marginLeft:4}}>{h[sel].chimchakhaeResult.grade}</span>
                  </button>
                )}
                {h[sel].judojuResult && h[sel].judojuResult.grade && (
                  <button onClick={() => setDetailTab("jd")} style={{flex:"1 0 auto", minWidth:80, padding:"10px 8px", border:"none", background:"transparent", borderBottom: detailTab==="jd" ? "3px solid #ca8a04" : "3px solid transparent", marginBottom:"-2px", fontSize:12, fontWeight: detailTab==="jd" ? 800 : 600, color: detailTab==="jd" ? "#ca8a04" : "#94a3b8", cursor:"pointer", fontFamily:"inherit", whiteSpace:"nowrap"}}>
                    📈 주도주 <span style={{fontSize:11, color: "#ca8a04", fontWeight:900, marginLeft:4}}>{h[sel].judojuResult.grade}</span>
                  </button>
                )}
                {h[sel].haseunghoonResult && h[sel].haseunghoonResult.grade && (
                  <button onClick={() => setDetailTab("hs")} style={{flex:"1 0 auto", minWidth:80, padding:"10px 8px", border:"none", background:"transparent", borderBottom: detailTab==="hs" ? "3px solid #0d9488" : "3px solid transparent", marginBottom:"-2px", fontSize:12, fontWeight: detailTab==="hs" ? 800 : 600, color: detailTab==="hs" ? "#0d9488" : "#94a3b8", cursor:"pointer", fontFamily:"inherit", whiteSpace:"nowrap"}}>
                    ⚡ 하승훈 <span style={{fontSize:11, color: "#0d9488", fontWeight:900, marginLeft:4}}>{h[sel].haseunghoonResult.grade}</span>
                  </button>
                )}
              </div>
            ) : null}

            <div style={{padding:"16px"}}>
              {detailTab === "ai" && (
                <div>
                  <div style={{borderRadius:14, border:"2px solid " + gC(h[sel].grade), overflow:"hidden", marginBottom:14}}>
                    <div style={{background: gC(h[sel].grade), padding:"14px 18px", display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:8}}>
                      <div style={{minWidth:0, flex:"1 1 auto"}}>
                        <div style={{fontSize:11, color:"rgba(255,255,255,0.85)", fontWeight:700, marginBottom:2}}>NEO-SCORE 14점 분석</div>
                        <div style={{fontSize:18, fontWeight:900, color:"#fff"}}>{h[sel].name || "-"}</div>
                        <div style={{fontSize:11, color:"rgba(255,255,255,0.85)", marginTop:2}}>{h[sel].breakType} · {h[sel].investor} · {h[sel].ema50}</div>
                        <div style={{fontSize:10, color:"rgba(255,255,255,0.7)", marginTop:3}}>{h[sel].date}</div>
                      </div>
                      <div style={{textAlign:"center", flexShrink:0}}>
                        <div style={{fontSize:32, fontWeight:900, color:"#fff", lineHeight:1}}>{h[sel].grade}</div>
                        <div style={{fontSize:13, color:"rgba(255,255,255,0.85)", marginTop:3}}>{h[sel].score}점</div>
                      </div>
                    </div>
                    <div style={{padding:"14px 18px", background:"#fff"}}>
                      <div style={{display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:6, marginBottom:10}}>
                        {[{l:"TP1", v: h[sel].tp1+"%"}, {l:"TP2", v: h[sel].tp2+"%"}, {l:"SL", v: h[sel].sl+"%"}].map((x, idx) => (
                          <div key={idx} style={{textAlign:"center", padding:8, background:"#f8fafc", borderRadius:8}}>
                            <div style={{fontSize:10, color:"#94a3b8"}}>{x.l}</div>
                            <div style={{fontSize:20, fontWeight:900, color:"#dc2626"}}>{x.v}</div>
                          </div>
                        ))}
                      </div>
                      {h[sel].summary && (
                        <div style={{fontSize:13, color:"#475569", lineHeight:1.6, marginBottom:10, padding:10, background:"#f8fafc", borderRadius:8}}>{h[sel].summary}</div>
                      )}
                      {h[sel].details && (
                        <div style={{fontSize:12}}>
                          {h[sel].details.map((d, idx) => (
                            <div key={idx} style={{padding:"6px 0", borderBottom:"1px solid #f1f5f9"}}>
                              <div style={{display:"flex", justifyContent:"space-between", marginBottom: d.reason ? 3 : 0}}>
                                <span style={{color:"#475569", fontWeight:600}}>{d.item}</span>
                                <span style={{fontWeight:700, color: d.point !== 0 ? "#dc2626" : "#94a3b8"}}>{d.point > 0 ? "+" : ""}{d.point}</span>
                              </div>
                              {d.reason && <div style={{color:"#94a3b8", fontSize:11, lineHeight:1.4}}>{d.reason}</div>}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {detailTab === "chim" && h[sel].chimchakhaeResult && (
                <ChimchakhaeResultCard result={h[sel].chimchakhaeResult} stockName={h[sel].name} />
              )}

              {detailTab === "jd" && h[sel].judojuResult && (
                <JudojuResultCard result={h[sel].judojuResult} stockName={h[sel].name} />
              )}

              {detailTab === "hs" && h[sel].haseunghoonResult && (
                <HaseunghoonResultCard result={h[sel].haseunghoonResult} stockName={h[sel].name} />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function TrackTab({todaySignals}){const [data,setData]=useState(null);const [loading,setLoading]=useState(false);const [saving,setSaving]=useState(false);const [checking,setChecking]=useState(false);const [msg,setMsg]=useState(null);const load=async()=>{setLoading(true);try{const r=await fetch(TRACK_API);const j=await r.json();setData(j);}catch(e){setMsg({t:"e",v:e.message});}setLoading(false);};const saveToday=async()=>{if(!todaySignals||!todaySignals.length)return setMsg({t:"w",v:"오늘 탭에서 스크리닝 먼저 실행"});setSaving(true);try{const r=await fetch(TRACK_API,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(todaySignals.filter(s=>s.grade!=="X").map(s=>({code:s.code,name:s.name,entry_price:s.price,rate:s.change,score:s.score,grade:s.grade,supply:s.investor,wick:s.wick,vol:s.amount,market:s.market,tp1:s.tp1,tp2:s.tp2,sl:s.sl})))});const j=await r.json();setMsg({t:j.added>0?"ok":"w",v:j.github_ok?("✅ "+j.added+"건 저장 (총 "+j.total+"건)"):("⚠️ GITHUB_TOKEN 미설정")});await load();}catch(e){setMsg({t:"e",v:e.message});}setSaving(false);};const checkOutcomes=async()=>{setChecking(true);try{const r=await fetch(TRACK_API+"?check=1&limit=15");const j=await r.json();setData(j);setMsg({t:"ok",v:j.updated+"건 결과 업데이트"});}catch(e){setMsg({t:"e",v:e.message});}setChecking(false);};useEffect(()=>{load();},[]);const RC2=r=>r==="BOTH"?"#dc2626":r==="TP1"?"#2563eb":r&&r.includes("SL")?"#dc2626":r==="OPEN"?"#d97706":"#94a3b8";const gC=g=>GI[g]?.c||"#94a3b8";const mc={ok:"#f0fdf4",w:"#fffbeb",e:"#fef2f2"};const tc={ok:"#dc2626",w:"#d97706",e:"#dc2626"};const bc={ok:"#fee2e2",w:"#fcd34d",e:"#fca5a5"};return(<div><div style={{display:"flex",gap:8,marginBottom:14,flexWrap:"wrap"}}><button onClick={saveToday} disabled={saving} style={{padding:"8px 16px",borderRadius:9,border:"none",background:saving?"#e2e8f0":"#1e293b",color:saving?"#94a3b8":"#fff",fontSize:13,fontWeight:700,cursor:saving?"default":"pointer"}}>{saving?"저장 중...":"📌 오늘 신호 저장"}</button><button onClick={checkOutcomes} disabled={checking} style={{padding:"8px 16px",borderRadius:9,border:"1px solid #e2e8f0",background:"#fff",fontSize:13,fontWeight:700,cursor:checking?"default":"pointer",color:checking?"#94a3b8":"#1e293b"}}>{checking?"체크 중...":"🔄 결과 체크 (KIS)"}</button><button onClick={load} style={{padding:"8px 14px",borderRadius:9,border:"1px solid #e2e8f0",background:"#fff",fontSize:13,cursor:"pointer"}}>새로고침</button></div>{msg&&<div style={{padding:"9px 14px",borderRadius:8,marginBottom:12,background:mc[msg.t],color:tc[msg.t],border:"1px solid "+bc[msg.t],fontSize:13}}>{msg.v}</div>}{loading&&<div style={{textAlign:"center",padding:40,color:"#94a3b8"}}>로딩 중...</div>}{data&&!loading&&(<><div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:8,marginBottom:16}}>{[{l:"전체 신호",v:data.stats.total+"건",c:"#1e293b"},{l:"미결",v:data.stats.open+"건",c:"#d97706"},{l:"승률("+data.stats.resolved+"건)",v:data.stats.win_rate+"%",c:"#dc2626"},{l:"평균수익",v:(data.stats.avg_profit>=0?"+":"")+data.stats.avg_profit+"%",c:data.stats.avg_profit>=0?"#dc2626":"#2563eb"}].map((x,i)=>(<div key={i} style={{textAlign:"center",padding:"10px 6px",borderRadius:10,background:"#f8fafc",border:"1px solid #e2e8f0"}}><div style={{fontSize:10,color:"#94a3b8",marginBottom:3}}>{x.l}</div><div style={{fontSize:20,fontWeight:900,color:x.c}}>{x.v}</div></div>))}</div>{!data.signals.length&&(<div style={{textAlign:"center",padding:40,color:"#94a3b8"}}><div style={{fontSize:32,marginBottom:8}}>📭</div><div style={{fontSize:15,fontWeight:600}}>저장된 신호 없음</div><div style={{fontSize:13,marginTop:4}}>오늘 탭 → 신호저장 버튼 클릭</div>{!data.github_ok&&<div style={{marginTop:10,padding:"8px 14px",borderRadius:8,background:"#fffbeb",color:"#d97706",fontSize:12,border:"1px solid #fcd34d"}}>⚠️ Vercel 환경변수 GITHUB_TOKEN 추가 필요</div>}</div>)}{data.signals.map((s,i)=>{const oc=s.outcome;const rc=oc?RC2(oc.result):"#94a3b8";const pc=oc?(oc.profit>=0?"#dc2626":"#2563eb"):"#d97706";return(<div key={i} style={{display:"flex",alignItems:"center",gap:10,padding:"11px 14px",borderRadius:12,border:"1px solid #e2e8f0",marginBottom:6,background:"#fff"}}><div style={{width:38,height:38,borderRadius:9,background:gC(s.grade)+"12",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}><span style={{fontSize:16,fontWeight:900,color:gC(s.grade)}}>{s.grade}</span></div><div style={{flex:1,minWidth:0}}><div style={{display:"flex",alignItems:"center",gap:6}}><span style={{fontWeight:700,fontSize:14}}>{s.name}</span><span style={{fontSize:11,color:"#dc2626",fontWeight:700}}>+{s.rate}%</span><span style={{fontSize:10,color:"#94a3b8"}}>{s.signal_date}</span></div><div style={{fontSize:11,color:"#94a3b8",marginTop:2}}>{s.score}점 · {s.supply} · {s.market}{oc&&oc.max_gain!==undefined?" · 최대↑+"+oc.max_gain+"% 최대↓"+oc.max_drop+"%":""}</div></div><div style={{textAlign:"right",flexShrink:0}}><div style={{fontSize:14,fontWeight:900,color:pc}}>{oc?(oc.profit>=0?"+":"")+oc.profit+"%":"—"}</div><div style={{padding:"1px 6px",borderRadius:5,background:rc+"15",color:rc,fontSize:11,fontWeight:700,marginTop:2}}>{oc?oc.result:"미결"}</div></div></div>);})}</>)}</div>);}

function VerifyTab(){const [code,setCode]=useState("");const [date,setDate]=useState("");const [expRate,setExpRate]=useState("");const [result,setResult]=useState(null);const [loading,setLoading]=useState(false);const [batch,setBatch]=useState([]);const [bLoading,setBLoading]=useState(false);const verify=async()=>{if(!code||!date)return;setLoading(true);setResult(null);try{let url=PRICE_API+"?code="+code+"&date="+date;if(expRate)url+="&verify_rate="+expRate;const r=await fetch(url);setResult(await r.json());}catch(e){setResult({ok:false,error:e.message});}setLoading(false);};const SAMPLES=[{name:"한양디지텍",code:"078350",date:"26-03-27",rate:20.8},{name:"태웅",code:"044490",date:"26-03-20",rate:26.5},{name:"네패스",code:"033640",date:"26-03-20",rate:17.1},{name:"바이오다인",code:"314930",date:"26-03-18",rate:15.0},{name:"성우하이텍",code:"015750",date:"26-03-10",rate:22.1}];const runBatch=async()=>{setBLoading(true);setBatch([]);const res=[];for(const s of SAMPLES){try{const r=await fetch(PRICE_API+"?code="+s.code+"&date="+s.date+"&verify_rate="+s.rate);const j=await r.json();res.push({...s,j});}catch(e){res.push({...s,j:{ok:false,error:e.message}});}setBatch([...res]);await new Promise(r=>setTimeout(r,400));}setBLoading(false);};const SC=s=>s==="정확"||s==="OK"?"#dc2626":s==="근사"||s==="NEAR"?"#d97706":"#dc2626";return(<div><div style={{padding:"12px 16px",borderRadius:10,background:"#eff6ff",border:"1px solid #93c5fd",fontSize:13,color:"#1d4ed8",marginBottom:16}}>KIS API로 실제 주가 조회 → data.js 값과 비교. <b>종목코드</b>는 네이버금융/HTS에서 확인.</div><div style={{background:"#f8fafc",borderRadius:12,padding:16,marginBottom:16,border:"1px solid #e2e8f0"}}><div style={{fontWeight:700,fontSize:14,marginBottom:12}}>단건 검증</div><div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8,marginBottom:10}}>{[{l:"종목코드",v:code,s:setCode,p:"예: 078350"},{l:"날짜(YY-MM-DD)",v:date,s:setDate,p:"예: 26-03-27"},{l:"data.js 등락률(%)",v:expRate,s:setExpRate,p:"예: 20.8"}].map((f,i)=>(<div key={i}><div style={{fontSize:11,color:"#64748b",marginBottom:4}}>{f.l}</div><input value={f.v} onChange={e=>f.s(e.target.value)} placeholder={f.p} style={{width:"100%",padding:"8px 10px",borderRadius:8,border:"1px solid #e2e8f0",fontSize:13,background:"#fff",outline:"none"}}/></div>))}</div><button onClick={verify} disabled={loading||!code||!date} style={{padding:"9px 20px",borderRadius:9,border:"none",background:(!code||!date)?"#e2e8f0":"#1e293b",color:(!code||!date)?"#94a3b8":"#fff",fontSize:13,fontWeight:700,cursor:(!code||!date)?"default":"pointer"}}>{loading?"조회 중...":"🔍 검증"}</button></div>{result&&(<div style={{borderRadius:12,border:"1px solid",marginBottom:16,borderColor:result.ok?"#93c5fd":"#fca5a5",background:result.ok?"#eff6ff":"#fef2f2",padding:16}}>{!result.ok&&<div style={{color:"#dc2626",fontWeight:700}}>오류: {result.kis_error||result.error}</div>}{result.ok&&(<><div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}><div><span style={{fontSize:17,fontWeight:900}}>{result.name}</span><span style={{fontSize:12,color:"#64748b",marginLeft:8}}>{result.market}</span></div>{result.verification&&<div style={{padding:"4px 12px",borderRadius:8,background:SC(result.verification.status)+"15",color:SC(result.verification.status),fontWeight:700,fontSize:13}}>{result.verification.status} (±{result.verification.diff}%p)</div>}</div>{result.target_row&&(<div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:6}}>{[{l:"실제 등락률",v:(result.target_row.rate>=0?"+":"")+result.target_row.rate+"%",big:true},{l:"data.js 등락률",v:expRate?"+"+expRate+"%":"—"},{l:"종가",v:result.target_row.close?.toLocaleString()+"원"},{l:"거래량",v:result.target_row.vol?.toLocaleString()}].map((x,i)=>(<div key={i} style={{textAlign:"center",padding:"8px 6px",background:"#fff",borderRadius:8}}><div style={{fontSize:10,color:"#94a3b8"}}>{x.l}</div><div style={{fontSize:x.big?18:14,fontWeight:700,color:x.big?"#dc2626":"#1e293b"}}>{x.v}</div></div>))}</div>)}</>)}</div>)}<div style={{background:"#f8fafc",borderRadius:12,padding:16,border:"1px solid #e2e8f0"}}><div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}><div style={{fontWeight:700,fontSize:14}}>샘플 일괄검증 (5건)</div><button onClick={runBatch} disabled={bLoading} style={{padding:"7px 16px",borderRadius:8,border:"1px solid #e2e8f0",background:"#fff",fontSize:12,fontWeight:700,cursor:bLoading?"default":"pointer",color:bLoading?"#94a3b8":"#1e293b"}}>{bLoading?"검증 중...":"▶ 실행"}</button></div>{batch.map((r,i)=>{const vr=r.j?.verification;return(<div key={i} onClick={()=>setSel(sel===i?null:i)} style={{cursor:"pointer",display:"flex",alignItems:"center",gap:10,padding:"9px 10px",borderRadius:9,border:"1px solid #e2e8f0",marginBottom:5,background:"#fff"}}><div style={{flex:1}}><span style={{fontWeight:700,fontSize:13}}>{r.name}</span><span style={{fontSize:11,color:"#94a3b8",marginLeft:6}}>{r.date} · data.js +{r.rate}%</span></div>{!r.j?.ok&&<span style={{color:"#dc2626",fontSize:12}}>오류</span>}{r.j?.ok&&!vr&&<span style={{color:"#94a3b8",fontSize:12}}>날짜없음</span>}{r.j?.ok&&vr&&(<div style={{display:"flex",gap:8,alignItems:"center"}}><span style={{fontSize:13,color:"#dc2626"}}>실제 {(vr.actual_rate>=0?"+":"")+vr.actual_rate}%</span><span style={{padding:"2px 8px",borderRadius:6,fontSize:11,fontWeight:700,background:SC(vr.status)+"15",color:SC(vr.status)}}>{vr.status} ±{vr.diff}%p</span></div>)}</div>);})}{!batch.length&&!bLoading&&<div style={{color:"#94a3b8",fontSize:13,textAlign:"center",padding:"10px 0"}}>실행 버튼 클릭 시 KIS API 실검증</div>}</div></div>);}

export default function App(){
  const [page,setPage]=useState("today");
  const [history,setHistory]=useState(()=>{try{return JSON.parse(localStorage.getItem("neo_history")||"[]")}catch{return[]}});
  const [todaySignals,setTodaySignals]=useState([]);
  useEffect(()=>{fetch(HIST_URL).then(r=>r.json()).then(d=>{if(!d||!Array.isArray(d.history))return;window.__historySha=d.sha;if(d.history.length===0){try{const local=JSON.parse(localStorage.getItem("neo_history")||"[]");if(local.length>0){fetch(HIST_URL,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({history:local})}).then(r=>r.json()).then(d2=>{if(d2&&d2.sha)window.__historySha=d2.sha}).catch(()=>{});return;}}catch(_){}}setHistory(d.history);try{localStorage.setItem("neo_history",JSON.stringify(d.history))}catch(_){}}).catch(()=>{})},[]);
  const saveHistory=useCallback((entry)=>{setHistory(prev=>{const next=[entry,...prev];localStorage.setItem("neo_history",JSON.stringify(next));fetch(HIST_URL,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({history:next,sha:window.__historySha})}).then(r=>r.json()).then(d=>{if(d&&d.sha)window.__historySha=d.sha}).catch(()=>{});return next});setPage("history")},[]);
  const clearHistory=useCallback(()=>{setHistory([]);localStorage.removeItem("neo_history");fetch(HIST_URL,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({history:[]})}).then(r=>r.json()).then(d=>{if(d&&d.sha)window.__historySha=d.sha}).catch(()=>{})},[]);
  const deleteHistoryItem=useCallback((idx)=>{setHistory(prev=>{const next=prev.filter((_,i)=>i!==idx);localStorage.setItem("neo_history",JSON.stringify(next));fetch(HIST_URL,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({history:next,sha:window.__historySha})}).then(r=>r.json()).then(d=>{if(d&&d.sha)window.__historySha=d.sha}).catch(()=>{});return next})},[]);
  return(
    <div style={{background:"#fff",minHeight:"100vh",fontFamily:"-apple-system,'Pretendard',sans-serif",color:"#1e293b",fontSize:15,paddingBottom:68}}>
      <link href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/static/pretendard.css" rel="stylesheet"/>
      <div style={{maxWidth:920,margin:"0 auto",padding:"20px 14px"}}>
        <div style={{marginBottom:16}}><h1 style={{fontSize:26,fontWeight:900,letterSpacing:"-0.5px",margin:0}}>NEO-SCORE</h1><p style={{fontSize:12,color:"#94a3b8",margin:"2px 0 0"}}>종가돌파매매 · S/A/B/X · AI차트분석 · 실시간스크리닝 · 신호추적</p></div>
        {page==="today"&&<TodaySignals onSignalsLoaded={setTodaySignals}/>}
        {page==="db"&&<SignalDB/>}
        {page==="cctoday"&&<ChimchakhaeToday apiUrl={API_URL}/>}
        {page==="jdtoday"&&<JudojuToday apiUrl={API_URL}/>}
        {page==="hstoday"&&<HaseunghoonToday apiUrl={API_URL}/>}
        {page==="ccdb"&&<ChimchakhaeDB/>}
        {page==="jddb"&&<JudojuDB/>}
        {page==="hsdb"&&<HaseunghoonDB/>}
        {page==="ai"&&<AIAnalysis onSave={saveHistory}/>}
        {page==="history"&&<History items={history} onClear={clearHistory} onDelete={deleteHistoryItem}/>}
        {page==="track"&&<TrackTab todaySignals={todaySignals}/>}
        {page==="verify"&&<VerifyTab/>}
      </div>
      <div style={{position:"fixed",bottom:0,left:0,right:0,background:"#fff",borderTop:"1px solid #e2e8f0",display:"flex",justifyContent:"center",zIndex:100}}>
        <div style={{display:"flex",maxWidth:1080,width:"100%",overflowX:"auto"}}>
          {[{id:"today",label:"네오오늘",icon:"🔥"},{id:"db",label:"최종가이드",icon:"🎯"},{id:"ccdb",label:"│침DB",icon:"💎"},{id:"jddb",label:"주도주DB",icon:"🚀"},{id:"hsdb",label:"하승훈DB",icon:"🏆"}].map(t=>(
            <button key={t.id} onClick={()=>setPage(t.id)} style={{flex:"1 0 auto",minWidth:65,padding:"8px 0 6px",border:"none",background:"none",cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",gap:1,position:"relative"}}>
              <span style={{fontSize:18}}>{t.icon}</span>
              <span style={{fontSize:10,fontWeight:page===t.id?700:500,color:page===t.id?"#1e293b":"#94a3b8"}}>{t.label}</span>
              {t.badge>0&&<span style={{position:"absolute",top:4,right:"calc(50% - 18px)",background:"#dc2626",color:"#fff",fontSize:9,fontWeight:700,padding:"0px 4px",borderRadius:8,minWidth:14,textAlign:"center"}}>{t.badge}</span>}
              {page===t.id&&<div style={{position:"absolute",top:0,left:"20%",right:"20%",height:2,background:"#1e293b",borderRadius:1}}/>}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
