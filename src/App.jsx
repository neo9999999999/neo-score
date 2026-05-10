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
import { analyzeNeoAnalysis, NeoAnalysisResultCard, calcNeoAnalysisGrade, neoAnalysisGradeColor, NeoAnalysisDetailModal } from "./NeoAnalysisHelpers.jsx";

function _getCacheDateKey(){const d=new Date();const day=d.getDay();if(day===0)d.setDate(d.getDate()-2);else if(day===6)d.setDate(d.getDate()-1);return d.toISOString().slice(0,10);}

const R=[...R_26,...R_2025,...R_2024,...R_2023,...R_2022,...R_2021];
const _mStats={};
for(const _rr of R){
  const _ym2=String(_rr[1]||"").slice(0,5);
  if(!_ym2||_ym2.length<5)continue;
  if(!_mStats[_ym2])_mStats[_ym2]={n:0,w:0,l:0,ret:0};
  _mStats[_ym2].n++;
  const _ret2=+_rr[18]||0;
  const _isSL2=_rr[19]==="SL"||String(_rr[19]||"").startsWith("SL");
  if(!_isSL2&&_ret2>=5)_mStats[_ym2].w++;
  if(_isSL2)_mStats[_ym2].l++;
  _mStats[_ym2].ret+=_ret2;
}
const D=R.map(r=>{
  const _ym=String(r[1]||"").slice(0,5);
  const _pym=(()=>{const[_yy,_mm]=_ym.split("-").map(Number);if(_mm===1)return String(_yy-1).padStart(2,"0")+"-12";return String(_yy).padStart(2,"0")+"-"+String(_mm-1).padStart(2,"0");})();
  const _ms=_mStats&&_mStats[_pym];
  const _prevAvgRet=(_ms&&_ms.n>=50)?_ms.ret/_ms.n:null;
  const _prevWinRate=(_ms&&_ms.n>=50)?_ms.w/_ms.n:null;
  const _mc=r[4]||"";
  const _mcm=_mc.match(/(\d+(?:\.\d+)?)/);
  const _mcn=_mcm?+_mcm[1]:0;
  const _amt=_mc.includes("兆")||_mc.includes("조")?_mcn*10000:_mcn;
  const _g=_amt>=2500?"S":_amt>=500?"A":_amt>=50?"B":"X";
  const _cc=calcChimchakhaeScore({change:r[3],amount:_amt,investor:r[5],market:r[2],wick:r[9]||0});
  const _jd=calcJudojuScore({change:r[3],amount:_amt,investor:r[5],market:r[2],wick:r[9]||0});
  const _hs=calcHaseunghoonScore({change:r[3],amount:_amt,investor:r[5],market:r[2],wick:r[9]||0,breakType:r[8]});
  return {n:r[0],d:"20"+r[1],m:r[2],ch:r[3],mc:r[4],iv:r[5],sc:r[6],g:_g,ccG:_cc.grade,ccScore:_cc.score,ccBreakdown:_cc.breakdown,jdG:_jd.grade,jdScore:_jd.score,jdBreakdown:_jd.breakdown,hsG:_hs.grade,hsScore:_hs.score,hsBreakdown:_hs.breakdown,hsVetoed:_hs.vetoed,bd:r[8],wk:r[9],am:r[10],pk:r[11],dd:r[12],tp1:r[13],tp2:r[14],sl:r[15],h1:r[16],h2:r[17],t:r[18],r:r[19],hd1:r[20],hd2:r[21],etf:r[22],gp:r[23],h60:r[24],h120:r[25],vc:r[26],ema:r[27],tp1d:r[28]||"",sld:r[29]||"",tp2d:r[30]||"",exd:r[31]||"",tp1dy:r[32]||0,sldy:r[33]||0,exdy:r[34]||0,bed:r[35]||"",bedy:r[36]||0,tp12dy:r[37]||0,ohlc:PF(r[38]||""),v1Total:r[39]||0,v1Grade:r[40]||"X",v1Supply:r[41]||0,v1Breakout:r[42]||0,v1Momentum:r[43]||0,v1Sm:r[44]||0,v1Acc:r[45]||0,prevAvgRet:_prevAvgRet,prevWinRate:_prevWinRate};
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
const NS={S:{tp1:10,tp2:20,sl:5,fsl:0},A:{tp1:10,tp2:20,sl:5,fsl:0},B:{tp1:10,tp2:20,sl:5,fsl:0}};function simNew(pk,dd,g,t1,t2,sl,res,origT){const ns=NS[g];const s=(t1>0)?{tp1:t1,tp2:t2,sl:sl}:ns;if(!s)return{t:0,r:"X"};const isDef=ns&&s.tp1===ns.tp1&&s.tp2===ns.tp2&&s.sl===ns.sl;if(isDef&&res&&origT!=null)return{t:origT,r:res};const a=Math.abs(dd);const hitSL=a>=s.sl;const hitTP1=pk>=s.tp1;const hitTP2=pk>=s.tp2;if(res==="SL"&&hitSL)return{t:Math.round(-s.sl*1.04*10)/10,r:"SL"};if(res==="TO"&&!hitSL&&!hitTP1)return{t:0,r:"TO"};if(hitSL&&hitTP1){if(hitTP2)return{t:Math.round((s.tp1*0.5+s.tp2*0.5)*10)/10,r:"BOTH"};return{t:Math.round((s.tp1*0.5)*10)/10,r:"TP1_BE"};}if(hitSL)return{t:Math.round(-s.sl*1.04*10)/10,r:"SL"};if(hitTP2)return{t:Math.round((s.tp1*0.5+s.tp2*0.5)*10)/10,r:"BOTH"};if(hitTP1)return{t:Math.round((s.tp1*0.5)*10)/10,r:"TP1"};return{t:0,r:"TO"};}

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
const SYS_PROMPT = `당신은 한국 주식 종가돌파매매의 통합 분석 전문가입니다. 차트/수급/뉴스 이미지를 NeoAnalysis v1 룰로 평가합니다.

## 검증된 매매 룰 (6년 백테스트)
- TP1=10% (50% 익절), TP2=20% (잔여), SL=-5% (전량 손절), 보유 10일
- 매수 타이밍: 14:50~15:20 (장 마감 직전 분할)

## 스코어링 (5섹션 100점)
【1. 수급 (25점) - 침착해 룰】 장 후반 동반매수 10 + 수급 일관성 8 + 거래대금 가중 7
【2. 돌파 품질 (25점) - 하승훈 룰】 종가위치(윗꼬리≤1%) 10 + 등락폭 8 + 종가 안착 7
【3. 모멘텀+시장 (20점) - 주도주 룰】 등락률 강도 8 + 마감 강도 7 + 시장순위 5
【4. 시황·섹터+재료 (15점) - 침착해】 주도섹터 8 + 재료 타입+익일 모멘텀 7
【5. 사전응축+이평 (15점) - 하승훈】 신고가 단계 6 + 이평 정렬 5 + 저항 테스트 4

## 등급 매핑
- 85+ → S+ (강력진입)
- 75~84 → S (강력진입)
- 70~74 → A+ (진입)
- 60~69 → A (진입)
- 50~59 → B (조건부진입)
- 50 미만 → X (관망/금지)

## 응답 형식 (단일 JSON, 코드블록 금지)
{"grade":"S+/S/A+/A/B/X","totalScore":0,"score":0,"verdict":"강력진입/진입/조건부진입/관망/금지","stockName":"","extractedData":{"currentPrice":"","change":"","volume":"","foreigner":"","institution":"","sector":"","chartPattern":""},"engines":{"supply":{"score":0,"max":25,"items":[]},"breakout":{"score":0,"max":25,"items":[]},"momentumMarket":{"score":0,"max":20,"items":[]},"sectorMaterial":{"score":0,"max":15,"items":[]},"accumulation":{"score":0,"max":15,"items":[]}},"detailedAnalysis":"3-5문장 종합","keyReasons":[],"risks":[],"technicalIndicators":{"rsi":"","macd":"","bollinger":"","movingAverage":"","volume":""},"supplyZone":{"status":"돌파|돌파시도|보유|이탈","level":"","thickness":"","breakoutQuality":""},"strategy":{"entry":"","entryPrice":"","tp1Price":"","tp2Price":"","stopLoss":"","exit":"","hold":"10일"},"confidenceScore":0,"nextDayRiseProbability":0,"nextDayProbability":0,"recommendedWeight":0,"summary":""}

규칙:
- score 와 totalScore 둘 다 동일하게 0~100 채우기 (호환성)
- nextDayRiseProbability 와 nextDayProbability 둘 다 동일 채우기
- engines 의 5섹션 모두 채우기 (supply, breakout, momentumMarket, sectorMaterial, accumulation)
- 모든 필드 빠짐없이`;

function SignalDB(){const [tab,setTab]=useState("S");const [cTP,setCTP]=useState(NS);const [srt,setSrt]=useState({c:"d",d:"desc"});const [open,setOpen]=useState(null);const [pg,setPg]=useState(0);const[invAmt,setInvAmt]=useState(()=>{try{return JSON.parse(localStorage.getItem("invAmt_v1")||"")||{S:1000000,A:500000,B:300000,same:500000,useSame:false}}catch(e){return{S:1000000,A:500000,B:300000,same:500000,useSame:false}}});const[mode,setMode]=useState(()=>{try{const v=localStorage.getItem("mode_v1");return v==="full"||v==="middle"||v==="tight"?v:"tight"}catch(e){return "tight"}});const[yearFilter,setYearFilter]=useState("all");const[fromD,setFromD]=useState("");const[toD,setToD]=useState("");const[supplyFilter,setSupplyFilter]=useState("all");const[highFilter,setHighFilter]=useState("all");const[holdFilter,setHoldFilter]=useState("all");
useEffect(()=>{const h=(e)=>{if((e.ctrlKey||e.metaKey)&&(e.key==="k"||e.key==="K")){e.preventDefault();setMode(v=>v==="tight"?"full":v==="full"?"middle":"tight");}};window.addEventListener("keydown",h);return()=>window.removeEventListener("keydown",h);},[]);
useEffect(()=>{const t=setTimeout(()=>{[...document.querySelectorAll("button")].filter(b=>b.textContent.trim()==="수익MAX").forEach(b=>b.click());},400);return ()=>clearTimeout(t);},[]);useEffect(()=>{try{localStorage.setItem("mode_v1",mode)}catch(e){}},[mode]);const PP=30;const D_live=useMemo(()=>{let _r=D.filter(r=>[r.ccG,r.jdG,r.hsG].filter(g=>g==="S+"||g==="S"||g==="A+").length>=2&&strictPass(r,mode)&&(yearFilter==="all"||(r.d&&r.d.slice(0,4)===yearFilter))&&(!fromD||(r.d&&r.d>=fromD))&&(!toD||(r.d&&r.d<=toD))&&(supplyFilter==="all"||(supplyFilter==="gi_oe"&&r.iv==="기+외")||(supplyFilter==="oe"&&r.iv==="외만")||(supplyFilter==="gi"&&r.iv==="기만")||(supplyFilter==="dual_minus"&&r.iv==="둘다-"))&&(highFilter==="all"||(highFilter==="h60"&&r.h60===1)||(highFilter==="h120"&&r.h120===1)||(highFilter==="both"&&r.h60===1&&r.h120===1)));_r=_r.map(rr=>{const cp=cTP[rr.g];if(!cp||!rr.ohlc||!rr.ohlc.length)return rr;const sim=simReal(rr.ohlc,cp.tp1,cp.tp2,cp.sl,cp.fsl||0);return{g:(rr.g||"B"),ta:rr.mc,...rr,t:sim.t,r:sim.r,tp1d:sim.tp1d||rr.tp1d,tp2d:sim.tp2d||rr.tp2d,sld:sim.sld||rr.sld,bed:sim.bed,exd:sim.exd||rr.exd,tp1dy:sim.tp1dy,tp2dy:sim.tp2dy,sldy:sim.sldy,bedy:sim.bedy,exdy:sim.exdy};});if(holdFilter!=="all"){const hd=+holdFilter;_r=_r.filter(x=>x.ohlc&&x.ohlc.length>=hd).map(x=>({...x,t:x.ohlc[hd-1].c,r:hd+"일보유"}));}return _r;},[cTP,mode,yearFilter,fromD,toD,supplyFilter,highFilter,holdFilter]);const st=useMemo(()=>{const r={};["S","A","B"].forEach(g=>{const d=D_live.filter(x=>x.g===g),w=d.filter(x=>x.t>0),sl=d.filter(x=>x.r==="SL"),bo=d.filter(x=>x.r==="BOTH"),tp1=d.filter(x=>{const rr=x.r;return rr==="TP1"||rr==="BOTH";}),to=d.filter(x=>x.r==="TO");const avg=d.length?(d.reduce((s,x)=>s+x.t,0)/d.length):0;const nw=d.map(x=>x);const nwCum=Math.round(nw.reduce((s,x)=>s+x.t,0));const nwWin=nw.filter(x=>x.t>0).length;r[g]={n:d.length,avg:avg.toFixed(2),wr:d.length?Math.round(w.length/d.length*100):0,cum:Math.round(d.reduce((s,x)=>s+x.t,0)),tp1c:tp1.length,tp1r:d.length?Math.round(tp1.length/d.length*100):0,boc:bo.length,bor:d.length?Math.round(bo.length/d.length*100):0,slc:sl.length,slr:d.length?Math.round(sl.length/d.length*100):0,toc:to.length,tor:d.length?Math.round(to.length/d.length*100):0,nwCum,nwWr:d.length?Math.round(nwWin/d.length*100):0}});return r},[cTP,D_live]);const fl=useMemo(()=>{let d=D_live.filter(r=>r.g===tab);return[...d].sort((a,b)=>{const av=a[srt.c],bv=b[srt.c];if(typeof av==="number")return (srt.d==="asc"?av-bv:bv-av);return srt.d==="asc"?String(av).localeCompare(String(bv)):String(bv).localeCompare(String(av))})},[tab,srt,invAmt,D_live]);const portfolio=useMemo(()=>{
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
},[D_live,invAmt]);const pd=fl.slice(pg*PP,(pg+1)*PP),mx=Math.ceil(fl.length/PP)-1;const ds=c=>setSrt(p=>p.c===c?{c,d:p.d==="asc"?"desc":"asc"}:{c,d:"desc"});return(<div><div style={{marginBottom:8,padding:10,background:"#fff",border:"1px solid #e5e8eb",borderRadius:8,display:"flex",alignItems:"center",gap:10,flexWrap:"wrap"}}><span style={{color:"#191f28",fontSize:12,fontWeight:700,letterSpacing:"-0.2px"}}>기간</span>{[["all","전체"],["2026","26년"],["2025","25년"],["2024","24년"],["2023","23년"],["2022","22년"],["2021","21년"]].map(([v,l])=>(<button key={v} onClick={()=>setYearFilter(v)} style={{background:yearFilter===v?"#191f28":"#fff",color:yearFilter===v?"#fff":"#4e5968",border:"1px solid #e5e8eb",borderRadius:8,padding:"6px 12px",fontSize:12,cursor:"pointer",fontWeight:yearFilter===v?700:400}}>{l}</button>))}<span style={{color:"#d1d6db",margin:"0 4px"}}>|</span><input type="date" value={fromD} onChange={e=>setFromD(e.target.value)} style={{background:"#fff",color:"#191f28",border:"1px solid #e5e8eb",borderRadius:8,padding:"5px 8px",fontSize:11}}/><span style={{color:"#8b95a1",fontSize:11}}>~</span><input type="date" value={toD} onChange={e=>setToD(e.target.value)} style={{background:"#fff",color:"#191f28",border:"1px solid #e5e8eb",borderRadius:8,padding:"5px 8px",fontSize:11}}/><button onClick={()=>{setFromD("");setToD("");setYearFilter("all")}} style={{background:"#f2f4f6",color:"#4e5968",border:"none",borderRadius:8,padding:"5px 10px",fontSize:11,cursor:"pointer",fontWeight:600}}>초기화</button><span style={{color:"#d1d6db",margin:"0 4px"}}>|</span><span style={{color:"#6b7684",fontSize:12}}>총 <b style={{color:"#191f28"}}>{D_live.length}</b>건</span><span style={{color:"#6b7684",fontSize:12}}>누적 <b style={{color:D_live.reduce((a,b)=>a+(b.t||0),0)>=0?"#ef4444":"#3b82f6"}}>{D_live.reduce((a,b)=>a+(b.t||0),0).toFixed(1)}%</b></span><span style={{color:"#6b7684",fontSize:12}}>승률 <b style={{color:"#191f28"}}>{D_live.length?(D_live.filter(x=>x.t>0).length/D_live.length*100).toFixed(1):0}%</b></span></div><div style={{marginBottom:12,padding:14,background:"#191f28",borderRadius:14,color:"#fff"}}>
<div style={{display:"flex",alignItems:"center",gap:8,marginBottom:10,flexWrap:"wrap"}}>
<span style={{fontSize:13,fontWeight:700,color:"#fff",letterSpacing:"-0.3px"}}>💰 투자금 계산기</span>
<label style={{display:"flex",alignItems:"center",gap:5,fontSize:11,color:"rgba(255,255,255,0.7)",cursor:"pointer",fontWeight:500}}>
<input type="checkbox" checked={invAmt.useSame} onChange={e=>setInvAmt({...invAmt,useSame:e.target.checked})}/>
모든 종목 동일 금액
</label>
<button onClick={()=>setMode(mode==="tight"?"full":mode==="full"?"middle":"tight")} style={{padding:"4px 10px",fontSize:10,fontWeight:700,border:"1px solid "+((mode==="tight"?"#dc2626":mode==="middle"?"#F5A623":"#444")),background:(mode==="tight"?"#dc2626":mode==="middle"?"#F5A623":"transparent"),color:(mode==="tight")?"#fff":"#888",borderRadius:6,cursor:"pointer",marginRight:8,letterSpacing:"-0.2px"}}>{mode==="tight"?"🎯 타이트 (Ctrl+K)":mode==="middle"?"🔸 미들 (Ctrl+K)":"⚪ 풀 (Ctrl+K)"}</button><div style={{display:"flex",gap:10,fontSize:10,marginLeft:"auto",flexWrap:"wrap"}}><span style={{color:"#ff7a85",fontWeight:700}}>🎯 익절 {portfolio.resStats.tp}건</span><span style={{color:"#7eb6ff",fontWeight:700}}>🛑 손절 {portfolio.resStats.sl}건</span><span style={{color:"rgba(255,255,255,0.55)"}}>⏱ 기간만료 {portfolio.resStats.to}건</span><span style={{color:"rgba(255,255,255,0.6)"}}>전체 {portfolio.total.n}건</span></div>


</div>
{invAmt.useSame?(
<div style={{display:"flex",alignItems:"center",gap:8,marginBottom:10}}>
<span style={{fontSize:11,color:"rgba(255,255,255,0.7)",width:60,fontWeight:500}}>종목당</span>
<input type="number" value={invAmt.same} onChange={e=>setInvAmt({...invAmt,same:+e.target.value||0})} style={{flex:1,padding:"7px 10px",background:"rgba(255,255,255,0.06)",border:"1px solid rgba(255,255,255,0.15)",borderRadius:8,color:"#fff",fontSize:13,fontWeight:600,outline:"none"}} step="100000"/>
<span style={{fontSize:11,color:"rgba(255,255,255,0.6)",fontWeight:500}}>원</span>
</div>
):(
<div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:6,marginBottom:10}}>
{["S","A","B"].map(gk=>(
<div key={gk} style={{display:"flex",alignItems:"center",gap:4}}>
<span style={{fontSize:11,fontWeight:700,color:gk==="S"?"#dc2626":gk==="A"?"#F5A623":"#5B8DEF",width:20}}>{gk}</span>
<input type="number" value={invAmt[gk]} onChange={e=>setInvAmt({...invAmt,[gk]:+e.target.value||0})} style={{flex:1,padding:"6px 8px",background:"rgba(255,255,255,0.06)",border:"1px solid rgba(255,255,255,0.15)",borderRadius:8,color:"#fff",fontSize:12,fontWeight:600,outline:"none"}} step="100000"/>
</div>
))}
</div>
)}
<div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:6}}>
{["S","A","B"].map(gk=>{
const d=portfolio.byG[gk];
const roi=d.amt>0?(d.pnl/d.amt*100):0;
const c=d.pnl>0?"#ff7a85":d.pnl<0?"#7eb6ff":"rgba(255,255,255,0.55)";
return(<div key={gk} style={{padding:"10px 12px",background:"rgba(255,255,255,0.05)",borderRadius:10,borderLeft:"3px solid "+(gk==="S"?"#dc2626":gk==="A"?"#F5A623":"#5B8DEF")}}>
<div style={{fontSize:10,color:"rgba(255,255,255,0.55)",marginBottom:4,fontWeight:600,letterSpacing:"-0.2px"}}>{gk}급 ({d.n}건)</div>
<div style={{fontSize:14,fontWeight:700,color:c}}>{d.pnl>=0?"+":""}{d.pnl.toLocaleString()}원</div>
<div style={{fontSize:10,color:"rgba(255,255,255,0.5)",letterSpacing:"-0.2px",marginTop:2}}>투입 {d.amt.toLocaleString()} · {roi.toFixed(1)}% · 승 {d.n>0?(d.win/d.n*100).toFixed(0):0}%</div>
</div>);
})}
<div style={{padding:"10px 12px",background:"rgba(38,198,218,0.1)",borderRadius:10,borderLeft:"3px solid #26C6DA"}}>
<div style={{fontSize:10,color:"#26C6DA",marginBottom:4,fontWeight:700,letterSpacing:"-0.2px"}}>전체 ({portfolio.total.n}건)</div>
<div style={{fontSize:14,fontWeight:700,color:portfolio.total.pnl>0?"#ff7a85":portfolio.total.pnl<0?"#7eb6ff":"rgba(255,255,255,0.55)"}}>{portfolio.total.pnl>=0?"+":""}{portfolio.total.pnl.toLocaleString()}원</div>
<div style={{fontSize:10,color:"rgba(255,255,255,0.5)",letterSpacing:"-0.2px",marginTop:2}}>투입 {portfolio.total.amt.toLocaleString()} · {portfolio.total.amt>0?(portfolio.total.pnl/portfolio.total.amt*100).toFixed(1):0}% · 승 {portfolio.total.n>0?(portfolio.total.win/portfolio.total.n*100).toFixed(0):0}%</div>
</div>
</div>
</div><div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(148px,1fr))",gap:8,marginBottom:18}}>{["S","A","B"].map(g=>{const i=GI[g],s=st[g];return(<div key={g} onClick={()=>{setTab(g);setPg(0);setOpen(null)}} style={{background:tab===g?i.c:i.bg,borderRadius:14,padding:"12px 14px",cursor:"pointer",border:tab===g?"none":"0.5px solid "+i.bd}}><div style={{display:"flex",gap:6,margin:"8px 0",padding:"7px 10px",background:"#ffffff",borderRadius:8,border:"1px solid #e5e8eb",alignItems:"center",flexWrap:"wrap"}}><span style={{fontSize:11,fontWeight:700,color:"#475569"}}>전략설정</span><label style={{fontSize:10,color:"#64748b"}}>TP1<input type="number" value={cTP[g]?.tp1||""} onChange={(_g=>e=>setCTP(p=>({...p,[_g]:{...p[_g],tp1:+e.target.value}})))(g)} placeholder={NS[g]?.tp1} style={{width:40,margin:"0 4px",padding:"3px 5px",border:"1px solid #d1d6db",borderRadius:6,fontSize:11,fontWeight:600,color:"#191f28"}}/>%</label><label style={{fontSize:10,color:"#64748b"}}>TP2<input type="number" value={cTP[g]?.tp2||""} onChange={(_g=>e=>setCTP(p=>({...p,[_g]:{...p[_g],tp2:+e.target.value}})))(g)} placeholder={NS[g]?.tp2} style={{width:40,margin:"0 4px",padding:"3px 5px",border:"1px solid #d1d6db",borderRadius:6,fontSize:11,fontWeight:600,color:"#191f28"}}/>%</label><label style={{fontSize:10,color:"#64748b"}}>SL<input type="number" value={cTP[g]?.sl||""} onChange={(_g=>e=>setCTP(p=>({...p,[_g]:{...p[_g],sl:+e.target.value}})))(g)} placeholder={NS[g]?.sl} style={{width:40,margin:"0 4px",padding:"3px 5px",border:"1px solid #d1d6db",borderRadius:6,fontSize:11,fontWeight:600,color:"#191f28"}}/>%</label><label style={{fontSize:10,color:"#64748b"}}>강제SL<input type="number" value={cTP[g]?.fsl||""} onChange={(_g=>e=>setCTP(p=>({...p,[_g]:{...p[_g],fsl:+e.target.value}})))(g)} placeholder={NS[g]?.fsl||"off"} style={{width:40,margin:"0 4px",padding:"3px 5px",border:"1px solid #d1d6db",borderRadius:6,fontSize:11,fontWeight:600,color:"#191f28"}}/>%</label><button onClick={()=>{setCTP({...cTP,[g]:{tp1:0,tp2:0,sl:0,fsl:0}})}} style={{fontSize:10,padding:"3px 9px",background:"#191f28",color:"#fff",border:"none",borderRadius:6,cursor:"pointer",fontWeight:600,letterSpacing:"-0.2px"}}>초기화</button> <button onClick={()=>{const ds=D_live.filter(x=>x.g===g);let best=null;for(const t1 of [10,15,20,25,30])for(const t2 of [30,50,80,100])for(const sl of [3,5,7,10,15])for(const fsl of [0,7,10,15]){if(t2<=t1)continue;if(fsl>0&&fsl<sl)continue;const rs=ds.map(x=>simReal(x.ohlc,t1,t2,sl,fsl));const cum=rs.reduce((a,x)=>a+x.t,0);if(!best||cum>best.cum)best={t1,t2,sl,fsl,cum};}if(best)setCTP({...cTP,[g]:{tp1:best.t1,tp2:best.t2,sl:best.sl,fsl:best.fsl||0}});}} style={{fontSize:10,padding:"3px 9px",background:"#3182f6",color:"#fff",border:"none",borderRadius:6,cursor:"pointer",marginLeft:4,fontWeight:700,letterSpacing:"-0.2px"}}>수익MAX</button><button onClick={()=>{const ds=D_live.filter(x=>x.g===g);let best=null;for(const tp of [10,15,20,25,30,40,50,60,80,100])for(const sl of [3,5,7,10,15,20]){const rs=ds.map(x=>simReal(x.ohlc,tp,tp*2,sl,0));const cum=rs.reduce((a,x)=>a+x.t,0);if(!best||cum>best.cum)best={tp,sl,cum};}if(best)setCTP({...cTP,[g]:{tp1:best.tp,tp2:best.tp,sl:best.sl}});}} style={{fontSize:10,padding:"3px 9px",background:"#f04452",color:"#fff",border:"none",borderRadius:6,cursor:"pointer",marginLeft:4,fontWeight:700,letterSpacing:"-0.2px"}}>단일TP</button>{(()=>{const ds=D_live.filter(x=>x.g===g);const rs=ds.map(x=>x);const cum=Math.round(rs.reduce((a,x)=>a+x.t,0));const wr=ds.length?Math.round(rs.filter(x=>x.t>0).length/ds.length*100):0;const ev=ds.length?(rs.reduce((a,x)=>a+x.t,0)/ds.length).toFixed(2):0;return(<span style={{fontSize:11,fontWeight:700,marginLeft:8}}><span style={{color:"#2563eb"}}>누적{cum>0?"+":""}{cum}%</span> <span style={{color:"#dc2626"}}>승률{wr}%</span> <span style={{color:"#7c3aed"}}>EV={ev}</span></span>)})()}</div><div style={{display:"flex",justifyContent:"space-between"}}><span style={{fontSize:26,fontWeight:900,color:tab===g?"#fff":i.c}}>{g}</span></div><div style={{fontSize:22,fontWeight:900,color:tab===g?"#fff":i.c}}>{s.n}<span style={{fontSize:11,fontWeight:400}}>건</span></div><div style={{fontSize:11,color:tab===g?"rgba(255,255,255,0.8)":"#64748b",marginTop:2}}>+{s.avg}%/건 · 승률<strong>{s.wr}%</strong> · 현행+{s.cum}%</div><div style={{fontSize:10,color:tab===g?"rgba(255,255,255,0.65)":"#94a3b8",marginTop:1}}>TP1{s.tp1c}({s.tp1r}%) · TP2{s.boc}({s.bor}%) · SL{s.slc}({s.slr}%)</div></div>)})} <div style={{background:"#f1f5f9",borderRadius:14,padding:"12px 14px"}}><span style={{fontSize:26,fontWeight:900,color:"#94a3b8"}}>X</span><div style={{fontSize:22,fontWeight:900,color:"#94a3b8"}}>{XN}<span style={{fontSize:11,fontWeight:400}}>건</span></div><div style={{fontSize:11,color:"#94a3b8",marginTop:2}}>매수금지</div></div></div>{st[tab]&&<div style={{background:"#191f28",borderRadius:14,padding:"16px",marginBottom:12,color:"#fff"}}><div style={{display:"flex"}}><div style={{flex:1}}><div style={{fontSize:11,opacity:0.55,marginBottom:4,letterSpacing:"-0.2px",fontWeight:500}}>익절 (TP1+TP2)</div><div style={{fontSize:22,fontWeight:800,letterSpacing:"-0.5px",color:"#ff7a85"}}>{st[tab].tp1c}<span style={{fontSize:12,fontWeight:500,opacity:0.7,marginLeft:1}}>건</span></div><div style={{fontSize:11,opacity:0.6,marginTop:2,letterSpacing:"-0.2px"}}>{st[tab].tp1r}% · TP2 {st[tab].boc}건 ({st[tab].bor}%)</div></div><div style={{flex:1,borderLeft:"1px solid rgba(255,255,255,0.12)",paddingLeft:14}}><div style={{fontSize:11,opacity:0.55,marginBottom:4,letterSpacing:"-0.2px",fontWeight:500}}>손절 (SL)</div><div style={{fontSize:22,fontWeight:800,letterSpacing:"-0.5px",color:"#7eb6ff"}}>{st[tab].slc}<span style={{fontSize:12,fontWeight:500,opacity:0.7,marginLeft:1}}>건</span></div><div style={{fontSize:11,opacity:0.6,marginTop:2,letterSpacing:"-0.2px"}}>{Math.round((st[tab].slc)/st[tab].n*100)}%</div></div><div style={{flex:1,borderLeft:"1px solid rgba(255,255,255,0.12)",paddingLeft:14}}><div style={{fontSize:11,opacity:0.55,marginBottom:4,letterSpacing:"-0.2px",fontWeight:500}}>기간만료</div><div style={{fontSize:22,fontWeight:800,letterSpacing:"-0.5px",opacity:0.75}}>{st[tab].toc}<span style={{fontSize:12,fontWeight:500,opacity:0.7,marginLeft:1}}>건</span></div><div style={{fontSize:11,opacity:0.6,marginTop:2,letterSpacing:"-0.2px"}}>{st[tab].tor}%</div></div></div></div>}<div style={{borderRadius:12,border:"1px solid #e2e8f0",overflow:"hidden"}}><div style={{overflowX:"auto"}}><table style={{width:"100%",minWidth:760,borderCollapse:"collapse",fontSize:13}}><thead><tr style={{background:"#f8fafc"}}>{[{k:"d",l:"날짜"},{k:"n",l:"종목"},{k:"ch",l:"등락"},{k:"iv",l:"수급"},{k:"sc",l:"NEO"},{k:"r",l:""}].map(h=>(<th key={h.k} onClick={()=>ds(h.k)} style={{padding:"8px 5px",textAlign:h.k==="n"?"left":"center",fontWeight:600,fontSize:11,color:"#94a3b8",cursor:"pointer",borderBottom:"2px solid #e2e8f0",whiteSpace:"nowrap",userSelect:"none"}}>{h.l}{srt.c===h.k?(srt.d==="asc"?" ↑":" ↓"):""}</th>))}</tr></thead><tbody>{pd.map((r,i)=>{const isO=open===pg*PP+i,gi=GI[r.g];return[<tr key={"r"+i} onClick={()=>setOpen(isO?null:pg*PP+i)} style={{cursor:"pointer",borderBottom:"1px solid #f1f5f9",background:isO?gi.bg:"#fff"}}><td style={{padding:"8px 5px",textAlign:"center",fontSize:11,color:"#94a3b8"}}>{r.d.slice(2)}</td><td style={{padding:"8px 5px",fontWeight:700,fontSize:13,maxWidth:120,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{r.n}</td><td style={{padding:"8px 5px",textAlign:"center",fontWeight:700,color:"#dc2626",fontSize:12}}>+{r.ch}%</td><td style={{padding:"8px 5px",textAlign:"center",fontSize:11,fontWeight:600,color:r.iv==="기+외"?"#7c3aed":r.iv==="외인"?"#2563eb":"#94a3b8"}}>{r.iv}</td><td style={{padding:"8px 5px",textAlign:"center"}}><span style={{background:gi.c+"12",color:gi.c,padding:"1px 7px",borderRadius:20,fontWeight:800,fontSize:12}}>{r.sc}</span></td><td style={{padding:"8px 5px",textAlign:"center",fontWeight:800,fontSize:13,color:r.t>0?"#dc2626":"#2563eb"}}>{((r.t>0?"+":"")+r.t+"%"+(function(){var a=invAmt.useSame?invAmt.same:(invAmt[r.g]||0);if(!a)return"";var g=Math.round(a*r.t/100);return" ("+(g>=0?"+":"")+g.toLocaleString()+"원)";})())}</td><td style={{padding:"8px 5px",textAlign:"center"}}><span style={{padding:"1px 4px",borderRadius:4,fontSize:10,fontWeight:700,background:RC(r.r)+"12",color:RC(r.r)}}>{RL(r.r)}</span></td></tr>,isO&&(<tr key={"d"+i}><td colSpan={9} style={{padding:0}}><div style={{padding:"12px 16px",background:gi.bg,borderBottom:"2px solid "+gi.bd}}><div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(80px,1fr))",gap:5,marginBottom:8}}>{[{l:"시총",v:r.mc},{l:"수급",v:r.iv},{l:"최대↑",v:"+"+r.pk+"%",c:"#dc2626"},{l:"최대↓",v:r.dd+"%",c:"#dc2626"},{l:"TP1도달일",v:r.tp1d?r.tp1d+(r.tp1dy?" ("+r.tp1dy+"일)":""):"-",c:r.tp1d?"#2563eb":"#94a3b8"},{l:"SL손절일",v:r.sld?r.sld+(r.sldy?" ("+r.sldy+"일)":""):"-",c:r.sld?"#dc2626":"#94a3b8"},{l:"TP2도달일",v:r.tp2d||"-",c:r.tp2d?"#dc2626":"#94a3b8"},{l:"청산일",v:r.exd?r.exd+(r.exdy?" ("+r.exdy+"일)":""):"-",c:"#64748b"}].map((x,j)=>(<div key={j} style={{background:"#fff",borderRadius:6,padding:"4px 6px"}}><div style={{fontSize:9,color:"#94a3b8"}}>{x.l}</div><div style={{fontSize:13,fontWeight:700,color:x.c||"#1e293b"}}>{x.v}</div></div>))}</div><div style={{background:"#fff",borderRadius:6,padding:"12px 14px"}}><div style={{display:"flex",alignItems:"baseline",gap:10,marginBottom:6,flexWrap:"wrap"}}><div style={{fontSize:22,fontWeight:900,color:r.t>=0?"#dc2626":"#2563eb"}}>실현 {r.t>0?"+":""}{r.t}%</div><div style={{fontSize:10,color:"#94a3b8",fontWeight:600}}>거래 시나리오</div></div><div style={{fontSize:11,color:"#475569",lineHeight:1.8}}>{SD(r,cTP)}</div></div></div></td></tr>)]})}</tbody></table></div></div><div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginTop:10}}><span style={{fontSize:12,color:"#94a3b8"}}>{fl.length}건 중 {pg*PP+1}~{Math.min((pg+1)*PP,fl.length)}</span><div style={{display:"flex",gap:4}}><button onClick={()=>setPg(Math.max(0,pg-1))} disabled={pg===0} style={{padding:"5px 12px",borderRadius:8,border:"1px solid #e2e8f0",background:"#fff",fontSize:13,fontWeight:700,cursor:pg===0?"default":"pointer",color:pg===0?"#e2e8f0":"#1e293b"}}>←</button><input type="number" value={pg+1} min={1} max={mx+1} onChange={e=>{const v=parseInt(e.target.value)-1;if(!isNaN(v)&&v>=0&&v<=mx)setPg(v);}} style={{padding:"5px 4px",fontSize:13,color:"#64748b",width:50,textAlign:"center",border:"1px solid #e2e8f0",borderRadius:6}}/><span style={{padding:"5px 2px",fontSize:13,color:"#94a3b8"}}>/{mx+1}</span><button onClick={()=>setPg(Math.min(mx,pg+1))} disabled={pg>=mx} style={{padding:"5px 12px",borderRadius:8,border:"1px solid #e2e8f0",background:"#fff",fontSize:13,fontWeight:700,cursor:pg>=mx?"default":"pointer",color:pg>=mx?"#e2e8f0":"#1e293b"}}>→</button></div></div></div>);}

function ChimchakhaeDB({onRowClick}={}){const [tab,setTab]=useState("S+");const [cTP,setCTP]=useState(CCNS);const [srt,setSrt]=useState({c:"d",d:"desc"});const [open,setOpen]=useState(null);const [pg,setPg]=useState(0);const[invAmt,setInvAmt]=useState(()=>{try{return JSON.parse(localStorage.getItem("invAmt_cc_v1")||"")||{"S+":1000000,S:1000000,"A+":700000,A:500000,"B+":400000,B:300000,C:100000,same:500000,useSame:false}}catch(e){return{"S+":1000000,S:1000000,"A+":700000,A:500000,"B+":400000,B:300000,C:100000,same:500000,useSame:false}}});const[mode,setMode]=useState(()=>{try{const v=localStorage.getItem("mode_cc_v1");return v==="full"||v==="middle"||v==="tight"?v:"tight"}catch(e){return "tight"}});const[yearFilter,setYearFilter]=useState("all");const[fromD,setFromD]=useState("");const[toD,setToD]=useState("");const[supplyFilter,setSupplyFilter]=useState("all");const[highFilter,setHighFilter]=useState("all");const[holdFilter,setHoldFilter]=useState("all");
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
},[D_live,invAmt]);const pd=fl.slice(pg*PP,(pg+1)*PP),mx=Math.ceil(fl.length/PP)-1;const ds=c=>setSrt(p=>p.c===c?{c,d:p.d==="asc"?"desc":"asc"}:{c,d:"desc"});return(<div><div style={{marginBottom:8,padding:10,background:"#fff",border:"1px solid #e5e8eb",borderRadius:8,display:"flex",alignItems:"center",gap:10,flexWrap:"wrap"}}><span style={{color:"#191f28",fontSize:12,fontWeight:700,letterSpacing:"-0.2px"}}>기간</span>{[["all","전체"],["2026","26년"],["2025","25년"],["2024","24년"],["2023","23년"],["2022","22년"],["2021","21년"]].map(([v,l])=>(<button key={v} onClick={()=>setYearFilter(v)} style={{background:yearFilter===v?"#191f28":"#fff",color:yearFilter===v?"#fff":"#4e5968",border:"1px solid #e5e8eb",borderRadius:8,padding:"6px 12px",fontSize:12,cursor:"pointer",fontWeight:yearFilter===v?700:400}}>{l}</button>))}<span style={{color:"#d1d6db",margin:"0 4px"}}>|</span><input type="date" value={fromD} onChange={e=>setFromD(e.target.value)} style={{background:"#fff",color:"#191f28",border:"1px solid #e5e8eb",borderRadius:8,padding:"5px 8px",fontSize:11}}/><span style={{color:"#8b95a1",fontSize:11}}>~</span><input type="date" value={toD} onChange={e=>setToD(e.target.value)} style={{background:"#fff",color:"#191f28",border:"1px solid #e5e8eb",borderRadius:8,padding:"5px 8px",fontSize:11}}/><button onClick={()=>{setFromD("");setToD("");setYearFilter("all")}} style={{background:"#f2f4f6",color:"#4e5968",border:"none",borderRadius:8,padding:"5px 10px",fontSize:11,cursor:"pointer",fontWeight:600}}>초기화</button><span style={{color:"#d1d6db",margin:"0 4px"}}>|</span><span style={{color:"#6b7684",fontSize:12}}>총 <b style={{color:"#191f28"}}>{D_live.length}</b>건</span><span style={{color:"#6b7684",fontSize:12}}>누적 <b style={{color:D_live.reduce((a,b)=>a+(b.t||0),0)>=0?"#ef4444":"#3b82f6"}}>{D_live.reduce((a,b)=>a+(b.t||0),0).toFixed(1)}%</b></span><span style={{color:"#6b7684",fontSize:12}}>승률 <b style={{color:"#191f28"}}>{D_live.length?(D_live.filter(x=>x.t>0).length/D_live.length*100).toFixed(1):0}%</b></span></div><div style={{marginBottom:12,padding:14,background:"#191f28",borderRadius:14,color:"#fff"}}>
<div style={{display:"flex",alignItems:"center",gap:8,marginBottom:10,flexWrap:"wrap"}}>
<span style={{fontSize:13,fontWeight:700,color:"#fff",letterSpacing:"-0.3px"}}>💰 투자금 계산기</span>
<label style={{display:"flex",alignItems:"center",gap:5,fontSize:11,color:"rgba(255,255,255,0.7)",cursor:"pointer",fontWeight:500}}>
<input type="checkbox" checked={invAmt.useSame} onChange={e=>setInvAmt({...invAmt,useSame:e.target.checked})}/>
모든 종목 동일 금액
</label>
<button onClick={()=>setMode(mode==="tight"?"full":mode==="full"?"middle":"tight")} style={{padding:"4px 10px",fontSize:10,fontWeight:700,border:"1px solid "+((mode==="tight"?"#dc2626":mode==="middle"?"#F5A623":"#444")),background:(mode==="tight"?"#dc2626":mode==="middle"?"#F5A623":"transparent"),color:(mode==="tight")?"#fff":"#888",borderRadius:6,cursor:"pointer",marginRight:8,letterSpacing:"-0.2px"}}>{mode==="tight"?"🎯 타이트 (Ctrl+K)":mode==="middle"?"🔸 미들 (Ctrl+K)":"⚪ 풀 (Ctrl+K)"}</button><div style={{display:"flex",gap:10,fontSize:10,marginLeft:"auto",flexWrap:"wrap"}}><span style={{color:"#ff7a85",fontWeight:700}}>🎯 익절 {portfolio.resStats.tp}건</span><span style={{color:"#7eb6ff",fontWeight:700}}>🛑 손절 {portfolio.resStats.sl}건</span><span style={{color:"rgba(255,255,255,0.55)"}}>⏱ 기간만료 {portfolio.resStats.to}건</span><span style={{color:"rgba(255,255,255,0.6)"}}>전체 {portfolio.total.n}건</span></div>


</div>
{invAmt.useSame?(
<div style={{display:"flex",alignItems:"center",gap:8,marginBottom:10}}>
<span style={{fontSize:11,color:"rgba(255,255,255,0.7)",width:60,fontWeight:500}}>종목당</span>
<input type="number" value={invAmt.same} onChange={e=>setInvAmt({...invAmt,same:+e.target.value||0})} style={{flex:1,padding:"7px 10px",background:"rgba(255,255,255,0.06)",border:"1px solid rgba(255,255,255,0.15)",borderRadius:8,color:"#fff",fontSize:13,fontWeight:600,outline:"none"}} step="100000"/>
<span style={{fontSize:11,color:"rgba(255,255,255,0.6)",fontWeight:500}}>원</span>
</div>
):(
<div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:6,marginBottom:10}}>
{["S+","S","A+","A","B+","B","C"].map(gk=>(
<div key={gk} style={{display:"flex",alignItems:"center",gap:4}}>
<span style={{fontSize:11,fontWeight:700,color:gk==="S"?"#dc2626":gk==="A"?"#F5A623":"#5B8DEF",width:20}}>{gk}</span>
<input type="number" value={invAmt[gk]} onChange={e=>setInvAmt({...invAmt,[gk]:+e.target.value||0})} style={{flex:1,padding:"6px 8px",background:"rgba(255,255,255,0.06)",border:"1px solid rgba(255,255,255,0.15)",borderRadius:8,color:"#fff",fontSize:12,fontWeight:600,outline:"none"}} step="100000"/>
</div>
))}
</div>
)}
<div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:6}}>
{["S+","S","A+","A","B+","B","C"].map(gk=>{
const d=portfolio.byG[gk];
const roi=d.amt>0?(d.pnl/d.amt*100):0;
const c=d.pnl>0?"#ff7a85":d.pnl<0?"#7eb6ff":"rgba(255,255,255,0.55)";
return(<div key={gk} style={{padding:"10px 12px",background:"rgba(255,255,255,0.05)",borderRadius:10,borderLeft:"3px solid "+(gk==="S"?"#dc2626":gk==="A"?"#F5A623":"#5B8DEF")}}>
<div style={{fontSize:10,color:"rgba(255,255,255,0.55)",marginBottom:4,fontWeight:600,letterSpacing:"-0.2px"}}>{gk}급 ({d.n}건)</div>
<div style={{fontSize:14,fontWeight:700,color:c}}>{d.pnl>=0?"+":""}{d.pnl.toLocaleString()}원</div>
<div style={{fontSize:10,color:"rgba(255,255,255,0.5)",letterSpacing:"-0.2px",marginTop:2}}>투입 {d.amt.toLocaleString()} · {roi.toFixed(1)}% · 승 {d.n>0?(d.win/d.n*100).toFixed(0):0}%</div>
</div>);
})}
<div style={{padding:"10px 12px",background:"rgba(38,198,218,0.1)",borderRadius:10,borderLeft:"3px solid #26C6DA"}}>
<div style={{fontSize:10,color:"#26C6DA",marginBottom:4,fontWeight:700,letterSpacing:"-0.2px"}}>전체 ({portfolio.total.n}건)</div>
<div style={{fontSize:14,fontWeight:700,color:portfolio.total.pnl>0?"#ff7a85":portfolio.total.pnl<0?"#7eb6ff":"rgba(255,255,255,0.55)"}}>{portfolio.total.pnl>=0?"+":""}{portfolio.total.pnl.toLocaleString()}원</div>
<div style={{fontSize:10,color:"rgba(255,255,255,0.5)",letterSpacing:"-0.2px",marginTop:2}}>투입 {portfolio.total.amt.toLocaleString()} · {portfolio.total.amt>0?(portfolio.total.pnl/portfolio.total.amt*100).toFixed(1):0}% · 승 {portfolio.total.n>0?(portfolio.total.win/portfolio.total.n*100).toFixed(0):0}%</div>
</div>
</div>
</div><div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(148px,1fr))",gap:8,marginBottom:18}}>{["S+","S","A+","A","B+","B","C"].map(g=>{const i=GI[g],s=st[g];return(<div key={g} onClick={()=>{setTab(g);setPg(0);setOpen(null)}} style={{background:tab===g?i.c:i.bg,borderRadius:14,padding:"12px 14px",cursor:"pointer",border:tab===g?"none":"0.5px solid "+i.bd}}><div style={{display:"flex",gap:6,margin:"8px 0",padding:"7px 10px",background:"#ffffff",borderRadius:8,border:"1px solid #e5e8eb",alignItems:"center",flexWrap:"wrap"}}><span style={{fontSize:11,fontWeight:700,color:"#475569"}}>전략설정</span><label style={{fontSize:10,color:"#64748b"}}>TP1<input type="number" value={cTP[g]?.tp1||""} onChange={(_g=>e=>setCTP(p=>({...p,[_g]:{...p[_g],tp1:+e.target.value}})))(g)} placeholder={NS[g]?.tp1} style={{width:40,margin:"0 4px",padding:"3px 5px",border:"1px solid #d1d6db",borderRadius:6,fontSize:11,fontWeight:600,color:"#191f28"}}/>%</label><label style={{fontSize:10,color:"#64748b"}}>TP2<input type="number" value={cTP[g]?.tp2||""} onChange={(_g=>e=>setCTP(p=>({...p,[_g]:{...p[_g],tp2:+e.target.value}})))(g)} placeholder={NS[g]?.tp2} style={{width:40,margin:"0 4px",padding:"3px 5px",border:"1px solid #d1d6db",borderRadius:6,fontSize:11,fontWeight:600,color:"#191f28"}}/>%</label><label style={{fontSize:10,color:"#64748b"}}>SL<input type="number" value={cTP[g]?.sl||""} onChange={(_g=>e=>setCTP(p=>({...p,[_g]:{...p[_g],sl:+e.target.value}})))(g)} placeholder={NS[g]?.sl} style={{width:40,margin:"0 4px",padding:"3px 5px",border:"1px solid #d1d6db",borderRadius:6,fontSize:11,fontWeight:600,color:"#191f28"}}/>%</label><label style={{fontSize:10,color:"#64748b"}}>강제SL<input type="number" value={cTP[g]?.fsl||""} onChange={(_g=>e=>setCTP(p=>({...p,[_g]:{...p[_g],fsl:+e.target.value}})))(g)} placeholder={NS[g]?.fsl||"off"} style={{width:40,margin:"0 4px",padding:"3px 5px",border:"1px solid #d1d6db",borderRadius:6,fontSize:11,fontWeight:600,color:"#191f28"}}/>%</label><button onClick={()=>{setCTP({...cTP,[g]:{tp1:0,tp2:0,sl:0,fsl:0}})}} style={{fontSize:10,padding:"3px 9px",background:"#191f28",color:"#fff",border:"none",borderRadius:6,cursor:"pointer",fontWeight:600,letterSpacing:"-0.2px"}}>초기화</button> <button onClick={()=>{const ds=D_live.filter(x=>x.ccG===g);let best=null;for(const t1 of [10,15,20,25,30])for(const t2 of [30,50,80,100])for(const sl of [3,5,7,10,15])for(const fsl of [0,7,10,15]){if(t2<=t1)continue;if(fsl>0&&fsl<sl)continue;const rs=ds.map(x=>simReal(x.ohlc,t1,t2,sl,fsl));const cum=rs.reduce((a,x)=>a+x.t,0);if(!best||cum>best.cum)best={t1,t2,sl,fsl,cum};}if(best)setCTP({...cTP,[g]:{tp1:best.t1,tp2:best.t2,sl:best.sl,fsl:best.fsl||0}});}} style={{fontSize:10,padding:"3px 9px",background:"#3182f6",color:"#fff",border:"none",borderRadius:6,cursor:"pointer",marginLeft:4,fontWeight:700,letterSpacing:"-0.2px"}}>수익MAX</button><button onClick={()=>{const ds=D_live.filter(x=>x.ccG===g);let best=null;for(const tp of [10,15,20,25,30,40,50,60,80,100])for(const sl of [3,5,7,10,15,20]){const rs=ds.map(x=>simReal(x.ohlc,tp,tp*2,sl,0));const cum=rs.reduce((a,x)=>a+x.t,0);if(!best||cum>best.cum)best={tp,sl,cum};}if(best)setCTP({...cTP,[g]:{tp1:best.tp,tp2:best.tp,sl:best.sl}});}} style={{fontSize:10,padding:"3px 9px",background:"#f04452",color:"#fff",border:"none",borderRadius:6,cursor:"pointer",marginLeft:4,fontWeight:700,letterSpacing:"-0.2px"}}>단일TP</button>{(()=>{const ds=D_live.filter(x=>x.ccG===g);const rs=ds.map(x=>x);const cum=Math.round(rs.reduce((a,x)=>a+x.t,0));const wr=ds.length?Math.round(rs.filter(x=>x.t>0).length/ds.length*100):0;const ev=ds.length?(rs.reduce((a,x)=>a+x.t,0)/ds.length).toFixed(2):0;return(<span style={{fontSize:11,fontWeight:700,marginLeft:8}}><span style={{color:"#2563eb"}}>누적{cum>0?"+":""}{cum}%</span> <span style={{color:"#dc2626"}}>승률{wr}%</span> <span style={{color:"#7c3aed"}}>EV={ev}</span></span>)})()}</div><div style={{display:"flex",justifyContent:"space-between"}}><span style={{fontSize:26,fontWeight:900,color:tab===g?"#fff":i.c}}>{g}</span></div><div style={{fontSize:22,fontWeight:900,color:tab===g?"#fff":i.c}}>{s.n}<span style={{fontSize:11,fontWeight:400}}>건</span></div><div style={{fontSize:11,color:tab===g?"rgba(255,255,255,0.8)":"#64748b",marginTop:2}}>+{s.avg}%/건 · 승률<strong>{s.wr}%</strong> · 현행+{s.cum}%</div><div style={{fontSize:10,color:tab===g?"rgba(255,255,255,0.65)":"#94a3b8",marginTop:1}}>TP1{s.tp1c}({s.tp1r}%) · TP2{s.boc}({s.bor}%) · SL{s.slc}({s.slr}%)</div></div>)})}</div>{st[tab]&&<div style={{background:"#191f28",borderRadius:14,padding:"16px",marginBottom:12,color:"#fff"}}><div style={{display:"flex"}}><div style={{flex:1}}><div style={{fontSize:11,opacity:0.55,marginBottom:4,letterSpacing:"-0.2px",fontWeight:500}}>익절 (TP1+TP2)</div><div style={{fontSize:22,fontWeight:800,letterSpacing:"-0.5px",color:"#ff7a85"}}>{st[tab].tp1c}<span style={{fontSize:12,fontWeight:500,opacity:0.7,marginLeft:1}}>건</span></div><div style={{fontSize:11,opacity:0.6,marginTop:2,letterSpacing:"-0.2px"}}>{st[tab].tp1r}% · TP2 {st[tab].boc}건 ({st[tab].bor}%)</div></div><div style={{flex:1,borderLeft:"1px solid rgba(255,255,255,0.12)",paddingLeft:14}}><div style={{fontSize:11,opacity:0.55,marginBottom:4,letterSpacing:"-0.2px",fontWeight:500}}>손절 (SL)</div><div style={{fontSize:22,fontWeight:800,letterSpacing:"-0.5px",color:"#7eb6ff"}}>{st[tab].slc}<span style={{fontSize:12,fontWeight:500,opacity:0.7,marginLeft:1}}>건</span></div><div style={{fontSize:11,opacity:0.6,marginTop:2,letterSpacing:"-0.2px"}}>{Math.round((st[tab].slc)/st[tab].n*100)}%</div></div><div style={{flex:1,borderLeft:"1px solid rgba(255,255,255,0.12)",paddingLeft:14}}><div style={{fontSize:11,opacity:0.55,marginBottom:4,letterSpacing:"-0.2px",fontWeight:500}}>기간만료</div><div style={{fontSize:22,fontWeight:800,letterSpacing:"-0.5px",opacity:0.75}}>{st[tab].toc}<span style={{fontSize:12,fontWeight:500,opacity:0.7,marginLeft:1}}>건</span></div><div style={{fontSize:11,opacity:0.6,marginTop:2,letterSpacing:"-0.2px"}}>{st[tab].tor}%</div></div></div></div>}<div style={{borderRadius:12,border:"1px solid #e2e8f0",overflow:"hidden"}}><div style={{overflowX:"auto"}}><table style={{width:"100%",minWidth:760,borderCollapse:"collapse",fontSize:13}}><thead><tr style={{background:"#f8fafc"}}>{[{k:"d",l:"날짜"},{k:"n",l:"종목"},{k:"ch",l:"등락"},{k:"iv",l:"수급"},{k:"sc",l:"NEO"},{k:"r",l:""}].map(h=>(<th key={h.k} onClick={()=>ds(h.k)} style={{padding:"8px 5px",textAlign:h.k==="n"?"left":"center",fontWeight:600,fontSize:11,color:"#94a3b8",cursor:"pointer",borderBottom:"2px solid #e2e8f0",whiteSpace:"nowrap",userSelect:"none"}}>{h.l}{srt.c===h.k?(srt.d==="asc"?" ↑":" ↓"):""}</th>))}</tr></thead><tbody>{pd.map((r,i)=>{const isO=open===pg*PP+i,gi=GI[r.ccG];return[<tr key={"r"+i} onClick={()=>{setOpen(isO?null:pg*PP+i);onRowClick&&onRowClick(r);}} style={{cursor:"pointer",borderBottom:"1px solid #f1f5f9",background:isO?gi.bg:"#fff"}}><td style={{padding:"8px 5px",textAlign:"center",fontSize:11,color:"#94a3b8"}}>{r.d.slice(2)}</td><td style={{padding:"8px 5px",fontWeight:700,fontSize:13,maxWidth:120,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{r.n}</td><td style={{padding:"8px 5px",textAlign:"center",fontWeight:700,color:"#dc2626",fontSize:12}}>+{r.ch}%</td><td style={{padding:"8px 5px",textAlign:"center",fontSize:11,fontWeight:600,color:r.iv==="기+외"?"#7c3aed":r.iv==="외인"?"#2563eb":"#94a3b8"}}>{r.iv}</td><td style={{padding:"8px 5px",textAlign:"center"}}><span style={{background:gi.c+"12",color:gi.c,padding:"1px 7px",borderRadius:20,fontWeight:800,fontSize:12}}>{r.sc}</span></td><td style={{padding:"8px 5px",textAlign:"center",fontWeight:800,fontSize:13,color:r.t>0?"#dc2626":"#2563eb"}}>{((r.t>0?"+":"")+r.t+"%"+(function(){var a=invAmt.useSame?invAmt.same:(invAmt[r.ccG]||0);if(!a)return"";var g=Math.round(a*r.t/100);return" ("+(g>=0?"+":"")+g.toLocaleString()+"원)";})())}</td><td style={{padding:"8px 5px",textAlign:"center"}}><span style={{padding:"1px 4px",borderRadius:4,fontSize:10,fontWeight:700,background:RC(r.r)+"12",color:RC(r.r)}}>{RL(r.r)}</span></td></tr>,isO&&(<tr key={"d"+i}><td colSpan={9} style={{padding:0}}><div style={{padding:"12px 16px",background:gi.bg,borderBottom:"2px solid "+gi.bd}}><div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(80px,1fr))",gap:5,marginBottom:8}}>{[{l:"시총",v:r.mc},{l:"수급",v:r.iv},{l:"최대↑",v:"+"+r.pk+"%",c:"#dc2626"},{l:"최대↓",v:r.dd+"%",c:"#dc2626"},{l:"TP1도달일",v:r.tp1d?r.tp1d+(r.tp1dy?" ("+r.tp1dy+"일)":""):"-",c:r.tp1d?"#2563eb":"#94a3b8"},{l:"SL손절일",v:r.sld?r.sld+(r.sldy?" ("+r.sldy+"일)":""):"-",c:r.sld?"#dc2626":"#94a3b8"},{l:"TP2도달일",v:r.tp2d||"-",c:r.tp2d?"#dc2626":"#94a3b8"},{l:"청산일",v:r.exd?r.exd+(r.exdy?" ("+r.exdy+"일)":""):"-",c:"#64748b"}].map((x,j)=>(<div key={j} style={{background:"#fff",borderRadius:6,padding:"4px 6px"}}><div style={{fontSize:9,color:"#94a3b8"}}>{x.l}</div><div style={{fontSize:13,fontWeight:700,color:x.c||"#1e293b"}}>{x.v}</div></div>))}</div><div style={{background:"#fff",borderRadius:6,padding:"12px 14px"}}><div style={{display:"flex",alignItems:"baseline",gap:10,marginBottom:6,flexWrap:"wrap"}}><div style={{fontSize:22,fontWeight:900,color:r.t>=0?"#dc2626":"#2563eb"}}>실현 {r.t>0?"+":""}{r.t}%</div><div style={{fontSize:10,color:"#94a3b8",fontWeight:600}}>거래 시나리오</div></div><div style={{fontSize:11,color:"#475569",lineHeight:1.8}}>{SD(r,cTP)}</div></div></div></td></tr>)]})}</tbody></table></div></div><div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginTop:10}}><span style={{fontSize:12,color:"#94a3b8"}}>{fl.length}건 중 {pg*PP+1}~{Math.min((pg+1)*PP,fl.length)}</span><div style={{display:"flex",gap:4}}><button onClick={()=>setPg(Math.max(0,pg-1))} disabled={pg===0} style={{padding:"5px 12px",borderRadius:8,border:"1px solid #e2e8f0",background:"#fff",fontSize:13,fontWeight:700,cursor:pg===0?"default":"pointer",color:pg===0?"#e2e8f0":"#1e293b"}}>←</button><input type="number" value={pg+1} min={1} max={mx+1} onChange={e=>{const v=parseInt(e.target.value)-1;if(!isNaN(v)&&v>=0&&v<=mx)setPg(v);}} style={{padding:"5px 4px",fontSize:13,color:"#64748b",width:50,textAlign:"center",border:"1px solid #e2e8f0",borderRadius:6}}/><span style={{padding:"5px 2px",fontSize:13,color:"#94a3b8"}}>/{mx+1}</span><button onClick={()=>setPg(Math.min(mx,pg+1))} disabled={pg>=mx} style={{padding:"5px 12px",borderRadius:8,border:"1px solid #e2e8f0",background:"#fff",fontSize:13,fontWeight:700,cursor:pg>=mx?"default":"pointer",color:pg>=mx?"#e2e8f0":"#1e293b"}}>→</button></div></div></div>);}

function JudojuDB({onRowClick}={}){const [tab,setTab]=useState("S+");const [cTP,setCTP]=useState(JDNS);const [srt,setSrt]=useState({c:"d",d:"desc"});const [open,setOpen]=useState(null);const [pg,setPg]=useState(0);const[invAmt,setInvAmt]=useState(()=>{try{return JSON.parse(localStorage.getItem("invAmt_jd_v1")||"")||{"S+":1000000,S:1000000,"A+":700000,A:500000,"B+":400000,B:300000,C:100000,same:500000,useSame:false}}catch(e){return{"S+":1000000,S:1000000,"A+":700000,A:500000,"B+":400000,B:300000,C:100000,same:500000,useSame:false}}});const[mode,setMode]=useState(()=>{try{const v=localStorage.getItem("mode_jd_v1");return v==="full"||v==="middle"||v==="tight"?v:"tight"}catch(e){return "tight"}});const[yearFilter,setYearFilter]=useState("all");const[fromD,setFromD]=useState("");const[toD,setToD]=useState("");const[supplyFilter,setSupplyFilter]=useState("all");const[highFilter,setHighFilter]=useState("all");const[holdFilter,setHoldFilter]=useState("all");
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
},[D_live,invAmt]);const pd=fl.slice(pg*PP,(pg+1)*PP),mx=Math.ceil(fl.length/PP)-1;const ds=c=>setSrt(p=>p.c===c?{c,d:p.d==="asc"?"desc":"asc"}:{c,d:"desc"});return(<div><div style={{marginBottom:8,padding:10,background:"#fff",border:"1px solid #e5e8eb",borderRadius:8,display:"flex",alignItems:"center",gap:10,flexWrap:"wrap"}}><span style={{color:"#191f28",fontSize:12,fontWeight:700,letterSpacing:"-0.2px"}}>기간</span>{[["all","전체"],["2026","26년"],["2025","25년"],["2024","24년"],["2023","23년"],["2022","22년"],["2021","21년"]].map(([v,l])=>(<button key={v} onClick={()=>setYearFilter(v)} style={{background:yearFilter===v?"#191f28":"#fff",color:yearFilter===v?"#fff":"#4e5968",border:"1px solid #e5e8eb",borderRadius:8,padding:"6px 12px",fontSize:12,cursor:"pointer",fontWeight:yearFilter===v?700:400}}>{l}</button>))}<span style={{color:"#d1d6db",margin:"0 4px"}}>|</span><input type="date" value={fromD} onChange={e=>setFromD(e.target.value)} style={{background:"#fff",color:"#191f28",border:"1px solid #e5e8eb",borderRadius:8,padding:"5px 8px",fontSize:11}}/><span style={{color:"#8b95a1",fontSize:11}}>~</span><input type="date" value={toD} onChange={e=>setToD(e.target.value)} style={{background:"#fff",color:"#191f28",border:"1px solid #e5e8eb",borderRadius:8,padding:"5px 8px",fontSize:11}}/><button onClick={()=>{setFromD("");setToD("");setYearFilter("all")}} style={{background:"#f2f4f6",color:"#4e5968",border:"none",borderRadius:8,padding:"5px 10px",fontSize:11,cursor:"pointer",fontWeight:600}}>초기화</button><span style={{color:"#d1d6db",margin:"0 4px"}}>|</span><span style={{color:"#6b7684",fontSize:12}}>총 <b style={{color:"#191f28"}}>{D_live.length}</b>건</span><span style={{color:"#6b7684",fontSize:12}}>누적 <b style={{color:D_live.reduce((a,b)=>a+(b.t||0),0)>=0?"#ef4444":"#3b82f6"}}>{D_live.reduce((a,b)=>a+(b.t||0),0).toFixed(1)}%</b></span><span style={{color:"#6b7684",fontSize:12}}>승률 <b style={{color:"#191f28"}}>{D_live.length?(D_live.filter(x=>x.t>0).length/D_live.length*100).toFixed(1):0}%</b></span></div><div style={{marginBottom:12,padding:14,background:"#191f28",borderRadius:14,color:"#fff"}}>
<div style={{display:"flex",alignItems:"center",gap:8,marginBottom:10,flexWrap:"wrap"}}>
<span style={{fontSize:13,fontWeight:700,color:"#fff",letterSpacing:"-0.3px"}}>💰 투자금 계산기</span>
<label style={{display:"flex",alignItems:"center",gap:5,fontSize:11,color:"rgba(255,255,255,0.7)",cursor:"pointer",fontWeight:500}}>
<input type="checkbox" checked={invAmt.useSame} onChange={e=>setInvAmt({...invAmt,useSame:e.target.checked})}/>
모든 종목 동일 금액
</label>
<button onClick={()=>setMode(mode==="tight"?"full":mode==="full"?"middle":"tight")} style={{padding:"4px 10px",fontSize:10,fontWeight:700,border:"1px solid "+((mode==="tight"?"#dc2626":mode==="middle"?"#F5A623":"#444")),background:(mode==="tight"?"#dc2626":mode==="middle"?"#F5A623":"transparent"),color:(mode==="tight")?"#fff":"#888",borderRadius:6,cursor:"pointer",marginRight:8,letterSpacing:"-0.2px"}}>{mode==="tight"?"🎯 타이트 (Ctrl+K)":mode==="middle"?"🔸 미들 (Ctrl+K)":"⚪ 풀 (Ctrl+K)"}</button><div style={{display:"flex",gap:10,fontSize:10,marginLeft:"auto",flexWrap:"wrap"}}><span style={{color:"#ff7a85",fontWeight:700}}>🎯 익절 {portfolio.resStats.tp}건</span><span style={{color:"#7eb6ff",fontWeight:700}}>🛑 손절 {portfolio.resStats.sl}건</span><span style={{color:"rgba(255,255,255,0.55)"}}>⏱ 기간만료 {portfolio.resStats.to}건</span><span style={{color:"rgba(255,255,255,0.6)"}}>전체 {portfolio.total.n}건</span></div>


</div>
{invAmt.useSame?(
<div style={{display:"flex",alignItems:"center",gap:8,marginBottom:10}}>
<span style={{fontSize:11,color:"rgba(255,255,255,0.7)",width:60,fontWeight:500}}>종목당</span>
<input type="number" value={invAmt.same} onChange={e=>setInvAmt({...invAmt,same:+e.target.value||0})} style={{flex:1,padding:"7px 10px",background:"rgba(255,255,255,0.06)",border:"1px solid rgba(255,255,255,0.15)",borderRadius:8,color:"#fff",fontSize:13,fontWeight:600,outline:"none"}} step="100000"/>
<span style={{fontSize:11,color:"rgba(255,255,255,0.6)",fontWeight:500}}>원</span>
</div>
):(
<div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:6,marginBottom:10}}>
{["S+","S","A+","A","B+","B","C"].map(gk=>(
<div key={gk} style={{display:"flex",alignItems:"center",gap:4}}>
<span style={{fontSize:11,fontWeight:700,color:gk==="S"?"#dc2626":gk==="A"?"#F5A623":"#5B8DEF",width:20}}>{gk}</span>
<input type="number" value={invAmt[gk]} onChange={e=>setInvAmt({...invAmt,[gk]:+e.target.value||0})} style={{flex:1,padding:"6px 8px",background:"rgba(255,255,255,0.06)",border:"1px solid rgba(255,255,255,0.15)",borderRadius:8,color:"#fff",fontSize:12,fontWeight:600,outline:"none"}} step="100000"/>
</div>
))}
</div>
)}
<div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:6}}>
{["S+","S","A+","A","B+","B","C"].map(gk=>{
const d=portfolio.byG[gk];
const roi=d.amt>0?(d.pnl/d.amt*100):0;
const c=d.pnl>0?"#ff7a85":d.pnl<0?"#7eb6ff":"rgba(255,255,255,0.55)";
return(<div key={gk} style={{padding:"10px 12px",background:"rgba(255,255,255,0.05)",borderRadius:10,borderLeft:"3px solid "+(gk==="S"?"#dc2626":gk==="A"?"#F5A623":"#5B8DEF")}}>
<div style={{fontSize:10,color:"rgba(255,255,255,0.55)",marginBottom:4,fontWeight:600,letterSpacing:"-0.2px"}}>{gk}급 ({d.n}건)</div>
<div style={{fontSize:14,fontWeight:700,color:c}}>{d.pnl>=0?"+":""}{d.pnl.toLocaleString()}원</div>
<div style={{fontSize:10,color:"rgba(255,255,255,0.5)",letterSpacing:"-0.2px",marginTop:2}}>투입 {d.amt.toLocaleString()} · {roi.toFixed(1)}% · 승 {d.n>0?(d.win/d.n*100).toFixed(0):0}%</div>
</div>);
})}
<div style={{padding:"10px 12px",background:"rgba(38,198,218,0.1)",borderRadius:10,borderLeft:"3px solid #26C6DA"}}>
<div style={{fontSize:10,color:"#26C6DA",marginBottom:4,fontWeight:700,letterSpacing:"-0.2px"}}>전체 ({portfolio.total.n}건)</div>
<div style={{fontSize:14,fontWeight:700,color:portfolio.total.pnl>0?"#ff7a85":portfolio.total.pnl<0?"#7eb6ff":"rgba(255,255,255,0.55)"}}>{portfolio.total.pnl>=0?"+":""}{portfolio.total.pnl.toLocaleString()}원</div>
<div style={{fontSize:10,color:"rgba(255,255,255,0.5)",letterSpacing:"-0.2px",marginTop:2}}>투입 {portfolio.total.amt.toLocaleString()} · {portfolio.total.amt>0?(portfolio.total.pnl/portfolio.total.amt*100).toFixed(1):0}% · 승 {portfolio.total.n>0?(portfolio.total.win/portfolio.total.n*100).toFixed(0):0}%</div>
</div>
</div>
</div><div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(148px,1fr))",gap:8,marginBottom:18}}>{["S+","S","A+","A","B+","B","C"].map(g=>{const i=GI[g],s=st[g];return(<div key={g} onClick={()=>{setTab(g);setPg(0);setOpen(null)}} style={{background:tab===g?i.c:i.bg,borderRadius:14,padding:"12px 14px",cursor:"pointer",border:tab===g?"none":"0.5px solid "+i.bd}}><div style={{display:"flex",gap:6,margin:"8px 0",padding:"7px 10px",background:"#ffffff",borderRadius:8,border:"1px solid #e5e8eb",alignItems:"center",flexWrap:"wrap"}}><span style={{fontSize:11,fontWeight:700,color:"#475569"}}>전략설정</span><label style={{fontSize:10,color:"#64748b"}}>TP1<input type="number" value={cTP[g]?.tp1||""} onChange={(_g=>e=>setCTP(p=>({...p,[_g]:{...p[_g],tp1:+e.target.value}})))(g)} placeholder={NS[g]?.tp1} style={{width:40,margin:"0 4px",padding:"3px 5px",border:"1px solid #d1d6db",borderRadius:6,fontSize:11,fontWeight:600,color:"#191f28"}}/>%</label><label style={{fontSize:10,color:"#64748b"}}>TP2<input type="number" value={cTP[g]?.tp2||""} onChange={(_g=>e=>setCTP(p=>({...p,[_g]:{...p[_g],tp2:+e.target.value}})))(g)} placeholder={NS[g]?.tp2} style={{width:40,margin:"0 4px",padding:"3px 5px",border:"1px solid #d1d6db",borderRadius:6,fontSize:11,fontWeight:600,color:"#191f28"}}/>%</label><label style={{fontSize:10,color:"#64748b"}}>SL<input type="number" value={cTP[g]?.sl||""} onChange={(_g=>e=>setCTP(p=>({...p,[_g]:{...p[_g],sl:+e.target.value}})))(g)} placeholder={NS[g]?.sl} style={{width:40,margin:"0 4px",padding:"3px 5px",border:"1px solid #d1d6db",borderRadius:6,fontSize:11,fontWeight:600,color:"#191f28"}}/>%</label><label style={{fontSize:10,color:"#64748b"}}>강제SL<input type="number" value={cTP[g]?.fsl||""} onChange={(_g=>e=>setCTP(p=>({...p,[_g]:{...p[_g],fsl:+e.target.value}})))(g)} placeholder={NS[g]?.fsl||"off"} style={{width:40,margin:"0 4px",padding:"3px 5px",border:"1px solid #d1d6db",borderRadius:6,fontSize:11,fontWeight:600,color:"#191f28"}}/>%</label><button onClick={()=>{setCTP({...cTP,[g]:{tp1:0,tp2:0,sl:0,fsl:0}})}} style={{fontSize:10,padding:"3px 9px",background:"#191f28",color:"#fff",border:"none",borderRadius:6,cursor:"pointer",fontWeight:600,letterSpacing:"-0.2px"}}>초기화</button> <button onClick={()=>{const ds=D_live.filter(x=>x.jdG===g);let best=null;for(const t1 of [10,15,20,25,30])for(const t2 of [30,50,80,100])for(const sl of [3,5,7,10,15])for(const fsl of [0,7,10,15]){if(t2<=t1)continue;if(fsl>0&&fsl<sl)continue;const rs=ds.map(x=>simReal(x.ohlc,t1,t2,sl,fsl));const cum=rs.reduce((a,x)=>a+x.t,0);if(!best||cum>best.cum)best={t1,t2,sl,fsl,cum};}if(best)setCTP({...cTP,[g]:{tp1:best.t1,tp2:best.t2,sl:best.sl,fsl:best.fsl||0}});}} style={{fontSize:10,padding:"3px 9px",background:"#3182f6",color:"#fff",border:"none",borderRadius:6,cursor:"pointer",marginLeft:4,fontWeight:700,letterSpacing:"-0.2px"}}>수익MAX</button><button onClick={()=>{const ds=D_live.filter(x=>x.jdG===g);let best=null;for(const tp of [10,15,20,25,30,40,50,60,80,100])for(const sl of [3,5,7,10,15,20]){const rs=ds.map(x=>simReal(x.ohlc,tp,tp*2,sl,0));const cum=rs.reduce((a,x)=>a+x.t,0);if(!best||cum>best.cum)best={tp,sl,cum};}if(best)setCTP({...cTP,[g]:{tp1:best.tp,tp2:best.tp,sl:best.sl}});}} style={{fontSize:10,padding:"3px 9px",background:"#f04452",color:"#fff",border:"none",borderRadius:6,cursor:"pointer",marginLeft:4,fontWeight:700,letterSpacing:"-0.2px"}}>단일TP</button>{(()=>{const ds=D_live.filter(x=>x.jdG===g);const rs=ds.map(x=>x);const cum=Math.round(rs.reduce((a,x)=>a+x.t,0));const wr=ds.length?Math.round(rs.filter(x=>x.t>0).length/ds.length*100):0;const ev=ds.length?(rs.reduce((a,x)=>a+x.t,0)/ds.length).toFixed(2):0;return(<span style={{fontSize:11,fontWeight:700,marginLeft:8}}><span style={{color:"#2563eb"}}>누적{cum>0?"+":""}{cum}%</span> <span style={{color:"#dc2626"}}>승률{wr}%</span> <span style={{color:"#7c3aed"}}>EV={ev}</span></span>)})()}</div><div style={{display:"flex",justifyContent:"space-between"}}><span style={{fontSize:26,fontWeight:900,color:tab===g?"#fff":i.c}}>{g}</span></div><div style={{fontSize:22,fontWeight:900,color:tab===g?"#fff":i.c}}>{s.n}<span style={{fontSize:11,fontWeight:400}}>건</span></div><div style={{fontSize:11,color:tab===g?"rgba(255,255,255,0.8)":"#64748b",marginTop:2}}>+{s.avg}%/건 · 승률<strong>{s.wr}%</strong> · 현행+{s.cum}%</div><div style={{fontSize:10,color:tab===g?"rgba(255,255,255,0.65)":"#94a3b8",marginTop:1}}>TP1{s.tp1c}({s.tp1r}%) · TP2{s.boc}({s.bor}%) · SL{s.slc}({s.slr}%)</div></div>)})}</div>{st[tab]&&<div style={{background:"#191f28",borderRadius:14,padding:"16px",marginBottom:12,color:"#fff"}}><div style={{display:"flex"}}><div style={{flex:1}}><div style={{fontSize:11,opacity:0.55,marginBottom:4,letterSpacing:"-0.2px",fontWeight:500}}>익절 (TP1+TP2)</div><div style={{fontSize:22,fontWeight:800,letterSpacing:"-0.5px",color:"#ff7a85"}}>{st[tab].tp1c}<span style={{fontSize:12,fontWeight:500,opacity:0.7,marginLeft:1}}>건</span></div><div style={{fontSize:11,opacity:0.6,marginTop:2,letterSpacing:"-0.2px"}}>{st[tab].tp1r}% · TP2 {st[tab].boc}건 ({st[tab].bor}%)</div></div><div style={{flex:1,borderLeft:"1px solid rgba(255,255,255,0.12)",paddingLeft:14}}><div style={{fontSize:11,opacity:0.55,marginBottom:4,letterSpacing:"-0.2px",fontWeight:500}}>손절 (SL)</div><div style={{fontSize:22,fontWeight:800,letterSpacing:"-0.5px",color:"#7eb6ff"}}>{st[tab].slc}<span style={{fontSize:12,fontWeight:500,opacity:0.7,marginLeft:1}}>건</span></div><div style={{fontSize:11,opacity:0.6,marginTop:2,letterSpacing:"-0.2px"}}>{Math.round((st[tab].slc)/st[tab].n*100)}%</div></div><div style={{flex:1,borderLeft:"1px solid rgba(255,255,255,0.12)",paddingLeft:14}}><div style={{fontSize:11,opacity:0.55,marginBottom:4,letterSpacing:"-0.2px",fontWeight:500}}>기간만료</div><div style={{fontSize:22,fontWeight:800,letterSpacing:"-0.5px",opacity:0.75}}>{st[tab].toc}<span style={{fontSize:12,fontWeight:500,opacity:0.7,marginLeft:1}}>건</span></div><div style={{fontSize:11,opacity:0.6,marginTop:2,letterSpacing:"-0.2px"}}>{st[tab].tor}%</div></div></div></div>}<div style={{borderRadius:12,border:"1px solid #e2e8f0",overflow:"hidden"}}><div style={{overflowX:"auto"}}><table style={{width:"100%",minWidth:760,borderCollapse:"collapse",fontSize:13}}><thead><tr style={{background:"#f8fafc"}}>{[{k:"d",l:"날짜"},{k:"n",l:"종목"},{k:"ch",l:"등락"},{k:"iv",l:"수급"},{k:"sc",l:"NEO"},{k:"r",l:""}].map(h=>(<th key={h.k} onClick={()=>ds(h.k)} style={{padding:"8px 5px",textAlign:h.k==="n"?"left":"center",fontWeight:600,fontSize:11,color:"#94a3b8",cursor:"pointer",borderBottom:"2px solid #e2e8f0",whiteSpace:"nowrap",userSelect:"none"}}>{h.l}{srt.c===h.k?(srt.d==="asc"?" ↑":" ↓"):""}</th>))}</tr></thead><tbody>{pd.map((r,i)=>{const isO=open===pg*PP+i,gi=GI[r.jdG];return[<tr key={"r"+i} onClick={()=>{setOpen(isO?null:pg*PP+i);onRowClick&&onRowClick(r);}} style={{cursor:"pointer",borderBottom:"1px solid #f1f5f9",background:isO?gi.bg:"#fff"}}><td style={{padding:"8px 5px",textAlign:"center",fontSize:11,color:"#94a3b8"}}>{r.d.slice(2)}</td><td style={{padding:"8px 5px",fontWeight:700,fontSize:13,maxWidth:120,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{r.n}</td><td style={{padding:"8px 5px",textAlign:"center",fontWeight:700,color:"#dc2626",fontSize:12}}>+{r.ch}%</td><td style={{padding:"8px 5px",textAlign:"center",fontSize:11,fontWeight:600,color:r.iv==="기+외"?"#7c3aed":r.iv==="외인"?"#2563eb":"#94a3b8"}}>{r.iv}</td><td style={{padding:"8px 5px",textAlign:"center"}}><span style={{background:gi.c+"12",color:gi.c,padding:"1px 7px",borderRadius:20,fontWeight:800,fontSize:12}}>{r.sc}</span></td><td style={{padding:"8px 5px",textAlign:"center",fontWeight:800,fontSize:13,color:r.t>0?"#dc2626":"#2563eb"}}>{((r.t>0?"+":"")+r.t+"%"+(function(){var a=invAmt.useSame?invAmt.same:(invAmt[r.jdG]||0);if(!a)return"";var g=Math.round(a*r.t/100);return" ("+(g>=0?"+":"")+g.toLocaleString()+"원)";})())}</td><td style={{padding:"8px 5px",textAlign:"center"}}><span style={{padding:"1px 4px",borderRadius:4,fontSize:10,fontWeight:700,background:RC(r.r)+"12",color:RC(r.r)}}>{RL(r.r)}</span></td></tr>,isO&&(<tr key={"d"+i}><td colSpan={9} style={{padding:0}}><div style={{padding:"12px 16px",background:gi.bg,borderBottom:"2px solid "+gi.bd}}><div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(80px,1fr))",gap:5,marginBottom:8}}>{[{l:"시총",v:r.mc},{l:"수급",v:r.iv},{l:"최대↑",v:"+"+r.pk+"%",c:"#dc2626"},{l:"최대↓",v:r.dd+"%",c:"#dc2626"},{l:"TP1도달일",v:r.tp1d?r.tp1d+(r.tp1dy?" ("+r.tp1dy+"일)":""):"-",c:r.tp1d?"#2563eb":"#94a3b8"},{l:"SL손절일",v:r.sld?r.sld+(r.sldy?" ("+r.sldy+"일)":""):"-",c:r.sld?"#dc2626":"#94a3b8"},{l:"TP2도달일",v:r.tp2d||"-",c:r.tp2d?"#dc2626":"#94a3b8"},{l:"청산일",v:r.exd?r.exd+(r.exdy?" ("+r.exdy+"일)":""):"-",c:"#64748b"}].map((x,j)=>(<div key={j} style={{background:"#fff",borderRadius:6,padding:"4px 6px"}}><div style={{fontSize:9,color:"#94a3b8"}}>{x.l}</div><div style={{fontSize:13,fontWeight:700,color:x.c||"#1e293b"}}>{x.v}</div></div>))}</div><div style={{background:"#fff",borderRadius:6,padding:"12px 14px"}}><div style={{display:"flex",alignItems:"baseline",gap:10,marginBottom:6,flexWrap:"wrap"}}><div style={{fontSize:22,fontWeight:900,color:r.t>=0?"#dc2626":"#2563eb"}}>실현 {r.t>0?"+":""}{r.t}%</div><div style={{fontSize:10,color:"#94a3b8",fontWeight:600}}>거래 시나리오</div></div><div style={{fontSize:11,color:"#475569",lineHeight:1.8}}>{SD(r,cTP)}</div></div></div></td></tr>)]})}</tbody></table></div></div><div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginTop:10}}><span style={{fontSize:12,color:"#94a3b8"}}>{fl.length}건 중 {pg*PP+1}~{Math.min((pg+1)*PP,fl.length)}</span><div style={{display:"flex",gap:4}}><button onClick={()=>setPg(Math.max(0,pg-1))} disabled={pg===0} style={{padding:"5px 12px",borderRadius:8,border:"1px solid #e2e8f0",background:"#fff",fontSize:13,fontWeight:700,cursor:pg===0?"default":"pointer",color:pg===0?"#e2e8f0":"#1e293b"}}>←</button><input type="number" value={pg+1} min={1} max={mx+1} onChange={e=>{const v=parseInt(e.target.value)-1;if(!isNaN(v)&&v>=0&&v<=mx)setPg(v);}} style={{padding:"5px 4px",fontSize:13,color:"#64748b",width:50,textAlign:"center",border:"1px solid #e2e8f0",borderRadius:6}}/><span style={{padding:"5px 2px",fontSize:13,color:"#94a3b8"}}>/{mx+1}</span><button onClick={()=>setPg(Math.min(mx,pg+1))} disabled={pg>=mx} style={{padding:"5px 12px",borderRadius:8,border:"1px solid #e2e8f0",background:"#fff",fontSize:13,fontWeight:700,cursor:pg>=mx?"default":"pointer",color:pg>=mx?"#e2e8f0":"#1e293b"}}>→</button></div></div></div>);}



function HaseunghoonDB({onRowClick}={}){const [tab,setTab]=useState("S+");const [cTP,setCTP]=useState(HSNS);const [srt,setSrt]=useState({c:"d",d:"desc"});const [open,setOpen]=useState(null);const [pg,setPg]=useState(0);const[invAmt,setInvAmt]=useState(()=>{try{return JSON.parse(localStorage.getItem("invAmt_hs_v1")||"")||{"S+":1000000,S:1000000,"A+":700000,A:500000,"B+":400000,B:300000,C:100000,same:500000,useSame:false}}catch(e){return{"S+":1000000,S:1000000,"A+":700000,A:500000,"B+":400000,B:300000,C:100000,same:500000,useSame:false}}});const[mode,setMode]=useState(()=>{try{const v=localStorage.getItem("mode_hs_v1");return v==="full"||v==="middle"||v==="tight"?v:"tight"}catch(e){return "tight"}});const[yearFilter,setYearFilter]=useState("all");const[fromD,setFromD]=useState("");const[toD,setToD]=useState("");const[supplyFilter,setSupplyFilter]=useState("all");const[highFilter,setHighFilter]=useState("all");const[holdFilter,setHoldFilter]=useState("all");
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
},[D_live,invAmt]);const pd=fl.slice(pg*PP,(pg+1)*PP),mx=Math.ceil(fl.length/PP)-1;const ds=c=>setSrt(p=>p.c===c?{c,d:p.d==="asc"?"desc":"asc"}:{c,d:"desc"});return(<div><div style={{marginBottom:8,padding:10,background:"#fff",border:"1px solid #e5e8eb",borderRadius:8,display:"flex",alignItems:"center",gap:10,flexWrap:"wrap"}}><span style={{color:"#191f28",fontSize:12,fontWeight:700,letterSpacing:"-0.2px"}}>기간</span>{[["all","전체"],["2026","26년"],["2025","25년"],["2024","24년"],["2023","23년"],["2022","22년"],["2021","21년"]].map(([v,l])=>(<button key={v} onClick={()=>setYearFilter(v)} style={{background:yearFilter===v?"#191f28":"#fff",color:yearFilter===v?"#fff":"#4e5968",border:"1px solid #e5e8eb",borderRadius:8,padding:"6px 12px",fontSize:12,cursor:"pointer",fontWeight:yearFilter===v?700:400}}>{l}</button>))}<span style={{color:"#d1d6db",margin:"0 4px"}}>|</span><input type="date" value={fromD} onChange={e=>setFromD(e.target.value)} style={{background:"#fff",color:"#191f28",border:"1px solid #e5e8eb",borderRadius:8,padding:"5px 8px",fontSize:11}}/><span style={{color:"#8b95a1",fontSize:11}}>~</span><input type="date" value={toD} onChange={e=>setToD(e.target.value)} style={{background:"#fff",color:"#191f28",border:"1px solid #e5e8eb",borderRadius:8,padding:"5px 8px",fontSize:11}}/><button onClick={()=>{setFromD("");setToD("");setYearFilter("all")}} style={{background:"#f2f4f6",color:"#4e5968",border:"none",borderRadius:8,padding:"5px 10px",fontSize:11,cursor:"pointer",fontWeight:600}}>초기화</button><span style={{color:"#d1d6db",margin:"0 4px"}}>|</span><span style={{color:"#6b7684",fontSize:12}}>총 <b style={{color:"#191f28"}}>{D_live.length}</b>건</span><span style={{color:"#6b7684",fontSize:12}}>누적 <b style={{color:D_live.reduce((a,b)=>a+(b.t||0),0)>=0?"#ef4444":"#3b82f6"}}>{D_live.reduce((a,b)=>a+(b.t||0),0).toFixed(1)}%</b></span><span style={{color:"#6b7684",fontSize:12}}>승률 <b style={{color:"#191f28"}}>{D_live.length?(D_live.filter(x=>x.t>0).length/D_live.length*100).toFixed(1):0}%</b></span></div><div style={{marginBottom:12,padding:14,background:"#191f28",borderRadius:14,color:"#fff"}}>
<div style={{display:"flex",alignItems:"center",gap:8,marginBottom:10,flexWrap:"wrap"}}>
<span style={{fontSize:13,fontWeight:700,color:"#fff",letterSpacing:"-0.3px"}}>💰 투자금 계산기</span>
<label style={{display:"flex",alignItems:"center",gap:5,fontSize:11,color:"rgba(255,255,255,0.7)",cursor:"pointer",fontWeight:500}}>
<input type="checkbox" checked={invAmt.useSame} onChange={e=>setInvAmt({...invAmt,useSame:e.target.checked})}/>
모든 종목 동일 금액
</label>
<button onClick={()=>setMode(mode==="tight"?"full":mode==="full"?"middle":"tight")} style={{padding:"4px 10px",fontSize:10,fontWeight:700,border:"1px solid "+((mode==="tight"?"#dc2626":mode==="middle"?"#F5A623":"#444")),background:(mode==="tight"?"#dc2626":mode==="middle"?"#F5A623":"transparent"),color:(mode==="tight")?"#fff":"#888",borderRadius:6,cursor:"pointer",marginRight:8,letterSpacing:"-0.2px"}}>{mode==="tight"?"🎯 타이트 (Ctrl+K)":mode==="middle"?"🔸 미들 (Ctrl+K)":"⚪ 풀 (Ctrl+K)"}</button><div style={{display:"flex",gap:10,fontSize:10,marginLeft:"auto",flexWrap:"wrap"}}><span style={{color:"#ff7a85",fontWeight:700}}>🎯 익절 {portfolio.resStats.tp}건</span><span style={{color:"#7eb6ff",fontWeight:700}}>🛑 손절 {portfolio.resStats.sl}건</span><span style={{color:"rgba(255,255,255,0.55)"}}>⏱ 기간만료 {portfolio.resStats.to}건</span><span style={{color:"rgba(255,255,255,0.6)"}}>전체 {portfolio.total.n}건</span></div>


</div>
{invAmt.useSame?(
<div style={{display:"flex",alignItems:"center",gap:8,marginBottom:10}}>
<span style={{fontSize:11,color:"rgba(255,255,255,0.7)",width:60,fontWeight:500}}>종목당</span>
<input type="number" value={invAmt.same} onChange={e=>setInvAmt({...invAmt,same:+e.target.value||0})} style={{flex:1,padding:"7px 10px",background:"rgba(255,255,255,0.06)",border:"1px solid rgba(255,255,255,0.15)",borderRadius:8,color:"#fff",fontSize:13,fontWeight:600,outline:"none"}} step="100000"/>
<span style={{fontSize:11,color:"rgba(255,255,255,0.6)",fontWeight:500}}>원</span>
</div>
):(
<div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:6,marginBottom:10}}>
{["S+","S","A+","A","B+","B","C"].map(gk=>(
<div key={gk} style={{display:"flex",alignItems:"center",gap:4}}>
<span style={{fontSize:11,fontWeight:700,color:gk==="S"?"#dc2626":gk==="A"?"#F5A623":"#5B8DEF",width:20}}>{gk}</span>
<input type="number" value={invAmt[gk]} onChange={e=>setInvAmt({...invAmt,[gk]:+e.target.value||0})} style={{flex:1,padding:"6px 8px",background:"rgba(255,255,255,0.06)",border:"1px solid rgba(255,255,255,0.15)",borderRadius:8,color:"#fff",fontSize:12,fontWeight:600,outline:"none"}} step="100000"/>
</div>
))}
</div>
)}
<div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:6}}>
{["S+","S","A+","A","B+","B","C"].map(gk=>{
const d=portfolio.byG[gk];
const roi=d.amt>0?(d.pnl/d.amt*100):0;
const c=d.pnl>0?"#ff7a85":d.pnl<0?"#7eb6ff":"rgba(255,255,255,0.55)";
return(<div key={gk} style={{padding:"10px 12px",background:"rgba(255,255,255,0.05)",borderRadius:10,borderLeft:"3px solid "+(gk==="S"?"#dc2626":gk==="A"?"#F5A623":"#5B8DEF")}}>
<div style={{fontSize:10,color:"rgba(255,255,255,0.55)",marginBottom:4,fontWeight:600,letterSpacing:"-0.2px"}}>{gk}급 ({d.n}건)</div>
<div style={{fontSize:14,fontWeight:700,color:c}}>{d.pnl>=0?"+":""}{d.pnl.toLocaleString()}원</div>
<div style={{fontSize:10,color:"rgba(255,255,255,0.5)",letterSpacing:"-0.2px",marginTop:2}}>투입 {d.amt.toLocaleString()} · {roi.toFixed(1)}% · 승 {d.n>0?(d.win/d.n*100).toFixed(0):0}%</div>
</div>);
})}
<div style={{padding:"10px 12px",background:"rgba(38,198,218,0.1)",borderRadius:10,borderLeft:"3px solid #26C6DA"}}>
<div style={{fontSize:10,color:"#26C6DA",marginBottom:4,fontWeight:700,letterSpacing:"-0.2px"}}>전체 ({portfolio.total.n}건)</div>
<div style={{fontSize:14,fontWeight:700,color:portfolio.total.pnl>0?"#ff7a85":portfolio.total.pnl<0?"#7eb6ff":"rgba(255,255,255,0.55)"}}>{portfolio.total.pnl>=0?"+":""}{portfolio.total.pnl.toLocaleString()}원</div>
<div style={{fontSize:10,color:"rgba(255,255,255,0.5)",letterSpacing:"-0.2px",marginTop:2}}>투입 {portfolio.total.amt.toLocaleString()} · {portfolio.total.amt>0?(portfolio.total.pnl/portfolio.total.amt*100).toFixed(1):0}% · 승 {portfolio.total.n>0?(portfolio.total.win/portfolio.total.n*100).toFixed(0):0}%</div>
</div>
</div>
</div><div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(148px,1fr))",gap:8,marginBottom:18}}>{["S+","S","A+","A","B+","B","C"].map(g=>{const i=GI[g],s=st[g];return(<div key={g} onClick={()=>{setTab(g);setPg(0);setOpen(null)}} style={{background:tab===g?i.c:i.bg,borderRadius:14,padding:"12px 14px",cursor:"pointer",border:tab===g?"none":"0.5px solid "+i.bd}}><div style={{display:"flex",gap:6,margin:"8px 0",padding:"7px 10px",background:"#ffffff",borderRadius:8,border:"1px solid #e5e8eb",alignItems:"center",flexWrap:"wrap"}}><span style={{fontSize:11,fontWeight:700,color:"#475569"}}>전략설정</span><label style={{fontSize:10,color:"#64748b"}}>TP1<input type="number" value={cTP[g]?.tp1||""} onChange={(_g=>e=>setCTP(p=>({...p,[_g]:{...p[_g],tp1:+e.target.value}})))(g)} placeholder={NS[g]?.tp1} style={{width:40,margin:"0 4px",padding:"3px 5px",border:"1px solid #d1d6db",borderRadius:6,fontSize:11,fontWeight:600,color:"#191f28"}}/>%</label><label style={{fontSize:10,color:"#64748b"}}>TP2<input type="number" value={cTP[g]?.tp2||""} onChange={(_g=>e=>setCTP(p=>({...p,[_g]:{...p[_g],tp2:+e.target.value}})))(g)} placeholder={NS[g]?.tp2} style={{width:40,margin:"0 4px",padding:"3px 5px",border:"1px solid #d1d6db",borderRadius:6,fontSize:11,fontWeight:600,color:"#191f28"}}/>%</label><label style={{fontSize:10,color:"#64748b"}}>SL<input type="number" value={cTP[g]?.sl||""} onChange={(_g=>e=>setCTP(p=>({...p,[_g]:{...p[_g],sl:+e.target.value}})))(g)} placeholder={NS[g]?.sl} style={{width:40,margin:"0 4px",padding:"3px 5px",border:"1px solid #d1d6db",borderRadius:6,fontSize:11,fontWeight:600,color:"#191f28"}}/>%</label><label style={{fontSize:10,color:"#64748b"}}>강제SL<input type="number" value={cTP[g]?.fsl||""} onChange={(_g=>e=>setCTP(p=>({...p,[_g]:{...p[_g],fsl:+e.target.value}})))(g)} placeholder={NS[g]?.fsl||"off"} style={{width:40,margin:"0 4px",padding:"3px 5px",border:"1px solid #d1d6db",borderRadius:6,fontSize:11,fontWeight:600,color:"#191f28"}}/>%</label><button onClick={()=>{setCTP({...cTP,[g]:{tp1:0,tp2:0,sl:0,fsl:0}})}} style={{fontSize:10,padding:"3px 9px",background:"#191f28",color:"#fff",border:"none",borderRadius:6,cursor:"pointer",fontWeight:600,letterSpacing:"-0.2px"}}>초기화</button> <button onClick={()=>{const ds=D_live.filter(x=>x.hsG===g);let best=null;for(const t1 of [10,15,20,25,30])for(const t2 of [30,50,80,100])for(const sl of [3,5,7,10,15])for(const fsl of [0,7,10,15]){if(t2<=t1)continue;if(fsl>0&&fsl<sl)continue;const rs=ds.map(x=>simReal(x.ohlc,t1,t2,sl,fsl));const cum=rs.reduce((a,x)=>a+x.t,0);if(!best||cum>best.cum)best={t1,t2,sl,fsl,cum};}if(best)setCTP({...cTP,[g]:{tp1:best.t1,tp2:best.t2,sl:best.sl,fsl:best.fsl||0}});}} style={{fontSize:10,padding:"3px 9px",background:"#3182f6",color:"#fff",border:"none",borderRadius:6,cursor:"pointer",marginLeft:4,fontWeight:700,letterSpacing:"-0.2px"}}>수익MAX</button><button onClick={()=>{const ds=D_live.filter(x=>x.hsG===g);let best=null;for(const tp of [10,15,20,25,30,40,50,60,80,100])for(const sl of [3,5,7,10,15,20]){const rs=ds.map(x=>simReal(x.ohlc,tp,tp*2,sl,0));const cum=rs.reduce((a,x)=>a+x.t,0);if(!best||cum>best.cum)best={tp,sl,cum};}if(best)setCTP({...cTP,[g]:{tp1:best.tp,tp2:best.tp,sl:best.sl}});}} style={{fontSize:10,padding:"3px 9px",background:"#f04452",color:"#fff",border:"none",borderRadius:6,cursor:"pointer",marginLeft:4,fontWeight:700,letterSpacing:"-0.2px"}}>단일TP</button>{(()=>{const ds=D_live.filter(x=>x.hsG===g);const rs=ds.map(x=>x);const cum=Math.round(rs.reduce((a,x)=>a+x.t,0));const wr=ds.length?Math.round(rs.filter(x=>x.t>0).length/ds.length*100):0;const ev=ds.length?(rs.reduce((a,x)=>a+x.t,0)/ds.length).toFixed(2):0;return(<span style={{fontSize:11,fontWeight:700,marginLeft:8}}><span style={{color:"#2563eb"}}>누적{cum>0?"+":""}{cum}%</span> <span style={{color:"#dc2626"}}>승률{wr}%</span> <span style={{color:"#7c3aed"}}>EV={ev}</span></span>)})()}</div><div style={{display:"flex",justifyContent:"space-between"}}><span style={{fontSize:26,fontWeight:900,color:tab===g?"#fff":i.c}}>{g}</span></div><div style={{fontSize:22,fontWeight:900,color:tab===g?"#fff":i.c}}>{s.n}<span style={{fontSize:11,fontWeight:400}}>건</span></div><div style={{fontSize:11,color:tab===g?"rgba(255,255,255,0.8)":"#64748b",marginTop:2}}>+{s.avg}%/건 · 승률<strong>{s.wr}%</strong> · 현행+{s.cum}%</div><div style={{fontSize:10,color:tab===g?"rgba(255,255,255,0.65)":"#94a3b8",marginTop:1}}>TP1{s.tp1c}({s.tp1r}%) · TP2{s.boc}({s.bor}%) · SL{s.slc}({s.slr}%)</div></div>)})}</div>{st[tab]&&<div style={{background:"#191f28",borderRadius:14,padding:"16px",marginBottom:12,color:"#fff"}}><div style={{display:"flex"}}><div style={{flex:1}}><div style={{fontSize:11,opacity:0.55,marginBottom:4,letterSpacing:"-0.2px",fontWeight:500}}>익절 (TP1+TP2)</div><div style={{fontSize:22,fontWeight:800,letterSpacing:"-0.5px",color:"#ff7a85"}}>{st[tab].tp1c}<span style={{fontSize:12,fontWeight:500,opacity:0.7,marginLeft:1}}>건</span></div><div style={{fontSize:11,opacity:0.6,marginTop:2,letterSpacing:"-0.2px"}}>{st[tab].tp1r}% · TP2 {st[tab].boc}건 ({st[tab].bor}%)</div></div><div style={{flex:1,borderLeft:"1px solid rgba(255,255,255,0.12)",paddingLeft:14}}><div style={{fontSize:11,opacity:0.55,marginBottom:4,letterSpacing:"-0.2px",fontWeight:500}}>손절 (SL)</div><div style={{fontSize:22,fontWeight:800,letterSpacing:"-0.5px",color:"#7eb6ff"}}>{st[tab].slc}<span style={{fontSize:12,fontWeight:500,opacity:0.7,marginLeft:1}}>건</span></div><div style={{fontSize:11,opacity:0.6,marginTop:2,letterSpacing:"-0.2px"}}>{Math.round((st[tab].slc)/st[tab].n*100)}%</div></div><div style={{flex:1,borderLeft:"1px solid rgba(255,255,255,0.12)",paddingLeft:14}}><div style={{fontSize:11,opacity:0.55,marginBottom:4,letterSpacing:"-0.2px",fontWeight:500}}>기간만료</div><div style={{fontSize:22,fontWeight:800,letterSpacing:"-0.5px",opacity:0.75}}>{st[tab].toc}<span style={{fontSize:12,fontWeight:500,opacity:0.7,marginLeft:1}}>건</span></div><div style={{fontSize:11,opacity:0.6,marginTop:2,letterSpacing:"-0.2px"}}>{st[tab].tor}%</div></div></div></div>}<div style={{borderRadius:12,border:"1px solid #e2e8f0",overflow:"hidden"}}><div style={{overflowX:"auto"}}><table style={{width:"100%",minWidth:760,borderCollapse:"collapse",fontSize:13}}><thead><tr style={{background:"#f8fafc"}}>{[{k:"d",l:"날짜"},{k:"n",l:"종목"},{k:"ch",l:"등락"},{k:"iv",l:"수급"},{k:"sc",l:"NEO"},{k:"r",l:""}].map(h=>(<th key={h.k} onClick={()=>ds(h.k)} style={{padding:"8px 5px",textAlign:h.k==="n"?"left":"center",fontWeight:600,fontSize:11,color:"#94a3b8",cursor:"pointer",borderBottom:"2px solid #e2e8f0",whiteSpace:"nowrap",userSelect:"none"}}>{h.l}{srt.c===h.k?(srt.d==="asc"?" ↑":" ↓"):""}</th>))}</tr></thead><tbody>{pd.map((r,i)=>{const isO=open===pg*PP+i,gi=GI[r.hsG];return[<tr key={"r"+i} onClick={()=>{setOpen(isO?null:pg*PP+i);onRowClick&&onRowClick(r);}} style={{cursor:"pointer",borderBottom:"1px solid #f1f5f9",background:isO?gi.bg:"#fff"}}><td style={{padding:"8px 5px",textAlign:"center",fontSize:11,color:"#94a3b8"}}>{r.d.slice(2)}</td><td style={{padding:"8px 5px",fontWeight:700,fontSize:13,maxWidth:120,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{r.n}</td><td style={{padding:"8px 5px",textAlign:"center",fontWeight:700,color:"#dc2626",fontSize:12}}>+{r.ch}%</td><td style={{padding:"8px 5px",textAlign:"center",fontSize:11,fontWeight:600,color:r.iv==="기+외"?"#7c3aed":r.iv==="외인"?"#2563eb":"#94a3b8"}}>{r.iv}</td><td style={{padding:"8px 5px",textAlign:"center"}}><span style={{background:gi.c+"12",color:gi.c,padding:"1px 7px",borderRadius:20,fontWeight:800,fontSize:12}}>{r.sc}</span></td><td style={{padding:"8px 5px",textAlign:"center",fontWeight:800,fontSize:13,color:r.t>0?"#dc2626":"#2563eb"}}>{((r.t>0?"+":"")+r.t+"%"+(function(){var a=invAmt.useSame?invAmt.same:(invAmt[r.hsG]||0);if(!a)return"";var g=Math.round(a*r.t/100);return" ("+(g>=0?"+":"")+g.toLocaleString()+"원)";})())}</td><td style={{padding:"8px 5px",textAlign:"center"}}><span style={{padding:"1px 4px",borderRadius:4,fontSize:10,fontWeight:700,background:RC(r.r)+"12",color:RC(r.r)}}>{RL(r.r)}</span></td></tr>,isO&&(<tr key={"d"+i}><td colSpan={9} style={{padding:0}}><div style={{padding:"12px 16px",background:gi.bg,borderBottom:"2px solid "+gi.bd}}><div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(80px,1fr))",gap:5,marginBottom:8}}>{[{l:"시총",v:r.mc},{l:"수급",v:r.iv},{l:"최대↑",v:"+"+r.pk+"%",c:"#dc2626"},{l:"최대↓",v:r.dd+"%",c:"#dc2626"},{l:"TP1도달일",v:r.tp1d?r.tp1d+(r.tp1dy?" ("+r.tp1dy+"일)":""):"-",c:r.tp1d?"#2563eb":"#94a3b8"},{l:"SL손절일",v:r.sld?r.sld+(r.sldy?" ("+r.sldy+"일)":""):"-",c:r.sld?"#dc2626":"#94a3b8"},{l:"TP2도달일",v:r.tp2d||"-",c:r.tp2d?"#dc2626":"#94a3b8"},{l:"청산일",v:r.exd?r.exd+(r.exdy?" ("+r.exdy+"일)":""):"-",c:"#64748b"}].map((x,j)=>(<div key={j} style={{background:"#fff",borderRadius:6,padding:"4px 6px"}}><div style={{fontSize:9,color:"#94a3b8"}}>{x.l}</div><div style={{fontSize:13,fontWeight:700,color:x.c||"#1e293b"}}>{x.v}</div></div>))}</div><div style={{background:"#fff",borderRadius:6,padding:"12px 14px"}}><div style={{display:"flex",alignItems:"baseline",gap:10,marginBottom:6,flexWrap:"wrap"}}><div style={{fontSize:22,fontWeight:900,color:r.t>=0?"#dc2626":"#2563eb"}}>실현 {r.t>0?"+":""}{r.t}%</div><div style={{fontSize:10,color:"#94a3b8",fontWeight:600}}>거래 시나리오</div></div><div style={{fontSize:11,color:"#475569",lineHeight:1.8}}>{SD(r,cTP)}</div></div></div></td></tr>)]})}</tbody></table></div></div><div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginTop:10}}><span style={{fontSize:12,color:"#94a3b8"}}>{fl.length}건 중 {pg*PP+1}~{Math.min((pg+1)*PP,fl.length)}</span><div style={{display:"flex",gap:4}}><button onClick={()=>setPg(Math.max(0,pg-1))} disabled={pg===0} style={{padding:"5px 12px",borderRadius:8,border:"1px solid #e2e8f0",background:"#fff",fontSize:13,fontWeight:700,cursor:pg===0?"default":"pointer",color:pg===0?"#e2e8f0":"#1e293b"}}>←</button><input type="number" value={pg+1} min={1} max={mx+1} onChange={e=>{const v=parseInt(e.target.value)-1;if(!isNaN(v)&&v>=0&&v<=mx)setPg(v);}} style={{padding:"5px 4px",fontSize:13,color:"#64748b",width:50,textAlign:"center",border:"1px solid #e2e8f0",borderRadius:6}}/><span style={{padding:"5px 2px",fontSize:13,color:"#94a3b8"}}>/{mx+1}</span><button onClick={()=>setPg(Math.min(mx,pg+1))} disabled={pg>=mx} style={{padding:"5px 12px",borderRadius:8,border:"1px solid #e2e8f0",background:"#fff",fontSize:13,fontWeight:700,cursor:pg>=mx?"default":"pointer",color:pg>=mx?"#e2e8f0":"#1e293b"}}>→</button></div></div></div>);}



function MultiFilterDB({onRowClick}={}){
// Toss / LINE 통합 팔레트
const _T={text:'#191f28',body:'#333d4b',sub:'#4e5968',hint:'#6b7684',mute:'#8b95a1',line:'#e5e8eb',linelt:'#f2f4f6',bg:'#f9fafb',card:'#ffffff',up:'#f04452',down:'#1f6dee',accentN:'#0d8050',accentC:'#0367c4',accentJ:'#b54708',accentH:'#c81e1e'};
const _g6=['S+','S','A+','A','B+','B'];
const _hsg=['A+','A'];
const _ng=['S','A','B','X'];
const _presets=[
{id:'alpha6',label:'6년 알파',sub:'침S+ × 주S',stat:'+3.16%',n:[],c:['S+'],j:['S'],h:[],yr:'all'},
{id:'profit6',label:'6년 수익왕',sub:'네오:B × 주A',stat:'+5.63%',n:['B'],c:[],j:['A'],h:[],yr:'all'},
{id:'neo7',label:'네오 7%',sub:'100~5000억 / 기관·기+외 / 점수3+ / 120일신고',stat:'+0.39%',special:'neo7',n:[],c:[],j:[],h:[],yr:'all'},
{id:'neo25',label:'네오 25%',sub:'5000억+ / 기관·기+외 / 점수3+ / 120일신고',stat:'+4.75%',special:'neo25',n:[],c:[],j:[],h:[],yr:'all'},
{id:'y21',label:'21형',sub:'Neo:S 침S 주A+ 하A',stat:'+9.89%',n:['S'],c:['S'],j:['A+'],h:['A'],yr:'21'},
{id:'y22',label:'22형',sub:'Neo:S 침A+ 주A',stat:'+0.04%',n:['S'],c:['A+'],j:['A'],h:[],yr:'22'},
{id:'y23',label:'23형',sub:'Neo:B 침B 주B+',stat:'+5.98%',n:['B'],c:['B'],j:['B+'],h:[],yr:'23'},
{id:'y24',label:'24형',sub:'침S+ × 주S',stat:'+3.49%',n:[],c:['S+'],j:['S'],h:[],yr:'24'},
{id:'y25',label:'25형',sub:'Neo:S 침S+ 주A+',stat:'+5.25%',n:['S'],c:['S+'],j:['A+'],h:[],yr:'25'},
{id:'y26',label:'26형',sub:'Neo:A 침B+ 주B',stat:'+6.99%',n:['A'],c:['B+'],j:['B'],h:[],yr:'26'}
];
const _jbAmt=(s)=>{const m=String(s||'').match(/(\d+(?:\.\d+)?)/);if(!m)return 0;const n=+m[1];return s.includes('兆')||s.includes('조')?n*10000:n;};
const _jbInst=(iv)=>iv==='기관'||iv==='기만'||iv==='기+외'||iv==='외+기';
const _neoBase=(r)=>{const ch=+r.ch||0;if(!(ch>=15&&ch<29))return false;if(!_jbInst(r.iv))return false;if((+r.sc||0)<3)return false;if(r.h120!==1)return false;return true;};
// 네오 7%: 100~5000억 + 기관/기+외 + 점수3+ + 120일 신고가 / 7% 즉익 + 25일 만기
const _neo7=(r)=>{if(!_neoBase(r))return false;const a=_jbAmt(r.mc);return a>=100&&a<5000;};
// 네오 25%: 5000억+ + 기관/기+외 + 점수3+ + 120일 신고가 / 25% 즉익 + 25일 만기
const _neo25=(r)=>{if(!_neoBase(r))return false;return _jbAmt(r.mc)>=5000;};
const _yrAutoMap={'all':{n:[],c:['S+'],j:['S'],h:[]},'21':{n:['S'],c:['S'],j:['A+'],h:['A']},'22':{n:['S'],c:['A+'],j:['A'],h:[]},'23':{n:['B'],c:['B'],j:['B+'],h:[]},'24':{n:[],c:['S+'],j:['S'],h:[]},'25':{n:['S'],c:['S+'],j:['A+'],h:[]},'26':{n:['A'],c:['B+'],j:['B'],h:[]}};
const [selN,setSelN]=useState([]);
const [selCC,setSelCC]=useState([]);
const [selJD,setSelJD]=useState([]);
const [selHS,setSelHS]=useState([]);
const [yf,setYf]=useState([]);
const [activePreset,setActivePreset]=useState('alpha6');
const [specialMode,setSpecialMode]=useState(null); // 'neo7'|'neo25'|null
const [sortMode,setSortMode]=useState('profit');
// 라이브 누적 신호 (sector-api signals.json fetch)
const [liveSignals,setLiveSignals]=useState([]);
const [liveLoaded,setLiveLoaded]=useState(false);
useEffect(()=>{
  fetch("https://raw.githubusercontent.com/neo9999999999/sector-api/main/data/signals.json?_="+Date.now())
    .then(r=>r.json())
    .then(d=>{setLiveSignals(Array.isArray(d)?d:[]);setLiveLoaded(true);})
    .catch(()=>{setLiveLoaded(true);});
},[]);
// 라이브 신호 분류 (네오 7% / 네오 25%)
const liveClassify=(s)=>{
  const ch=+s.rate||0;if(!(ch>=15&&ch<29))return null;
  const a=+s.vol||0;if(a<100)return null;
  const inv=s.supply||"";if(!(inv==="기관"||inv==="기만"||inv==="기+외"||inv==="외+기"))return null;
  if((+s.score||0)<3)return null;
  if(s.h120!==1)return null;
  return a>=5000?"neo25":"neo7";
};
const liveByCat=useMemo(()=>{
  const r={neo7:[],neo25:[]};
  for(const s of liveSignals){const c=liveClassify(s);if(c)r[c].push(s);}
  // 최신순 정렬
  r.neo7.sort((a,b)=>String(b.signal_date||"").localeCompare(String(a.signal_date||"")));
  r.neo25.sort((a,b)=>String(b.signal_date||"").localeCompare(String(a.signal_date||"")));
  return r;
},[liveSignals]);
const _liveDate=(d)=>{const s=String(d||"");return s.length===8?s.slice(2,4)+"-"+s.slice(4,6)+"-"+s.slice(6,8):s;};
const [invAmt,setInvAmt]=useState(()=>{try{const v=localStorage.getItem('mfdb_invAmt_v1');return v?+v:500000;}catch(e){return 500000;}});
useEffect(()=>{try{localStorage.setItem('mfdb_invAmt_v1',String(invAmt));}catch(e){}},[invAmt]);
const filtered=useMemo(()=>{
let arr=D.filter(r=>{
if(yf.length&&r.d&&!yf.includes(r.d.slice(2,4)))return false;
// 네오 7%/25% — 데이터 기반 조건만 적용 (등급 chip 무시)
if(specialMode==='neo7')return _neo7(r);
if(specialMode==='neo25')return _neo25(r);
if(selN.length&&!selN.includes(r.g))return false;
if(selCC.length&&!selCC.includes(r.ccG))return false;
if(selJD.length&&!selJD.includes(r.jdG))return false;
if(selHS.length&&!selHS.includes(r.hsG))return false;
return true;
});
if(sortMode==='profit')return arr.sort((a,b)=>(b.t||0)-(a.t||0));
if(sortMode==='oldest')return arr.sort((a,b)=>String(a.d||'').localeCompare(String(b.d||'')));
if(sortMode==='newest')return arr.sort((a,b)=>String(b.d||'').localeCompare(String(a.d||'')));
return arr;
},[selN,selCC,selJD,selHS,yf,sortMode,specialMode]);
const stats=useMemo(()=>{
if(!filtered.length)return null;
const p5=filtered.filter(x=>(x.t||0)>=5&&x.r!=='SL'&&!String(x.r||'').startsWith('SL'));
const sl=filtered.filter(x=>x.r==='SL'||String(x.r||'').startsWith('SL'));
const sumRet=filtered.reduce((a,b)=>a+(b.t||0),0);
const avg=sumRet/filtered.length;
const totalInvest=invAmt*filtered.length;
const totalPnl=Math.round(invAmt*sumRet/100);
const ret=totalInvest>0?(totalPnl/totalInvest*100):0;
return {n:filtered.length,p5:p5.length,sl:sl.length,avg,totalInvest,totalPnl,ret};
},[filtered,invAmt]);
const _applyFilter=(p)=>{setSelN(p.n||[]);setSelCC(p.c||[]);setSelJD(p.j||[]);setSelHS(p.h||[]);};
const applyP=(p)=>{_applyFilter(p);if(p.yr==='all')setYf([]);else if(p.yr)setYf([p.yr]);setActivePreset(p.id);setSpecialMode(p.special||null);};
const resetAll=()=>{setSelN([]);setSelCC([]);setSelJD([]);setSelHS([]);setYf([]);setActivePreset(null);setSpecialMode(null);};
const toggleYr=(y)=>{if(y==='all'){setYf([]);return;}setYf(yf.includes(y)?yf.filter(x=>x!==y):[...yf,y]);};
useEffect(()=>{if(specialMode)return;let key=null;if(yf.length===0)key='all';else if(yf.length===1)key=yf[0];if(key){const m=_yrAutoMap[key];if(m)_applyFilter(m);}},[yf,specialMode]);
// 통일 active 스타일 = solid black bg, white text
const Seg=({active,children,onClick})=>(<button onClick={onClick} style={{flex:'1 1 0',padding:'7px 8px',border:'none',background:active?_T.text:'transparent',color:active?'#fff':_T.sub,fontSize:13,fontWeight:active?700:500,cursor:'pointer',borderRadius:7,transition:'all .12s',letterSpacing:'-0.2px'}}>{children}</button>);
// 등급 칩 — black active 통일, 컬러는 카테고리 헤더 텍스트로만 표시
const Chip=({arr,setArr,val})=>{const active=arr.includes(val);return(<button onClick={()=>{setArr(active?arr.filter(x=>x!==val):[...arr,val]);setActivePreset(null);}} style={{padding:'6px 11px',borderRadius:7,border:'1px solid '+(active?_T.text:_T.line),background:active?_T.text:_T.card,color:active?'#fff':_T.body,fontSize:12,fontWeight:active?700:600,cursor:'pointer',marginRight:4,marginBottom:4,minWidth:34,letterSpacing:'-0.2px',transition:'all .12s'}}>{val}</button>);};
const Card=({title,hint,children,pad})=>(<div style={{background:_T.card,borderRadius:12,padding:pad||'10px 12px',marginBottom:8,border:'1px solid '+_T.line}}><div style={{display:'flex',alignItems:'baseline',justifyContent:'space-between',marginBottom:6}}><div style={{fontSize:13,fontWeight:700,color:_T.text,letterSpacing:'-0.3px'}}>{title}</div>{hint&&<div style={{fontSize:11,color:_T.hint,fontWeight:500}}>{hint}</div>}</div>{children}</div>);
const _sorts=[{id:'profit',l:'익절순'},{id:'newest',l:'최신순'},{id:'oldest',l:'오래된순'}];
const _yrs=[{id:'all',l:'전체'},{id:'21',l:'21'},{id:'22',l:'22'},{id:'23',l:'23'},{id:'24',l:'24'},{id:'25',l:'25'},{id:'26',l:'26'}];
const _amtPresets=[100000,300000,500000,1000000,3000000];
const _man=(n)=>(n>=10000?Math.round(n/10000).toLocaleString()+'만':n.toLocaleString());
// 결과 한글 라벨
const _resLbl=(r)=>{const s=String(r||"");if(!s)return "—";if(s==="BOTH")return "익절";if(s==="TP1")return "1차익절";if(s==="TP2")return "익절";if(s==="TP1_BE")return "익절+본절";if(s==="TP1_SL")return "익절+손절";if(s==="TP1_FSL")return "익절+강제SL";if(s==="SL")return "손절";if(s==="FSL")return "강제손절";if(s==="TRAIL")return "트레일익절";if(s==="TO")return "15일만료";if(s.endsWith("일보유"))return s;return s;};
const _resCol=(r)=>{const s=String(r||"");if(s==="SL"||s==="FSL")return _T.down;if(s==="TO"||s.endsWith("일보유"))return _T.mute;return _T.up;};
const GradeRow=({label,col,arr,setArr,opts})=>(<div style={{marginBottom:5,display:'flex',alignItems:'center',gap:8}}><div style={{fontSize:11,fontWeight:700,color:col,letterSpacing:'-0.2px',width:48,flexShrink:0}}>{label}</div><div style={{flex:1,display:'flex',flexWrap:'wrap'}}>{opts.map(g=>(<Chip key={g} arr={arr} setArr={setArr} val={g}/>))}</div></div>);
return (<div style={{padding:'10px 12px',background:_T.bg,minHeight:'100vh',fontFamily:"-apple-system, 'Pretendard', sans-serif"}}>
{/* 검증된 프리셋 */}
<Card title="검증된 프리셋" hint="6년 24,355건">
{/* 1행: 6년 등급 베스트 (상단 강조 2개) */}
<div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:5,marginBottom:5}}>
{_presets.slice(0,2).map(p=>{const a=activePreset===p.id;return(<button key={p.id} onClick={()=>applyP(p)} style={{padding:'8px 11px',borderRadius:9,border:'1px solid '+(a?_T.text:_T.line),background:a?_T.text:_T.card,cursor:'pointer',textAlign:'left',transition:'all .12s'}}><div style={{display:'flex',alignItems:'baseline',justifyContent:'space-between',gap:6}}><div style={{fontSize:13,fontWeight:800,color:a?'#fff':_T.text,letterSpacing:'-0.3px'}}>{p.label}</div><div style={{fontSize:12,fontWeight:700,color:a?'#ff7a85':_T.up}}>{p.stat}</div></div><div style={{fontSize:10,color:a?'rgba(255,255,255,0.6)':_T.hint,marginTop:1,fontWeight:500}}>{p.sub}</div></button>);})}
</div>
{/* 2행: 네오 7% / 네오 25% — 두 모드 */}
<div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:5,marginBottom:5}}>
{_presets.slice(2,4).map(p=>{const a=activePreset===p.id;const bg=p.id==='neo7'?'#1f6dee':'#c81e1e';const emo=p.id==='neo7'?'🚀':'🐉';return(<button key={p.id} onClick={()=>applyP(p)} style={{padding:'10px 12px',borderRadius:9,border:'1px solid '+(a?bg:_T.line),background:a?bg:_T.card,cursor:'pointer',textAlign:'left',transition:'all .12s'}}><div style={{display:'flex',alignItems:'baseline',justifyContent:'space-between',gap:6}}><div style={{fontSize:13,fontWeight:800,color:a?'#fff':_T.text,letterSpacing:'-0.3px'}}>{emo} {p.label}</div><div style={{fontSize:12,fontWeight:700,color:a?'#fff':_T.up}}>{p.stat}</div></div><div style={{fontSize:10,color:a?'rgba(255,255,255,0.75)':_T.hint,marginTop:2,fontWeight:500,letterSpacing:'-0.2px'}}>{p.sub}</div></button>);})}
</div>
{/* 3행: 연도형 21~26 + 리셋 */}
<div style={{display:'grid',gridTemplateColumns:'repeat(6,1fr) auto',gap:5}}>
{_presets.slice(4).map(p=>{const a=activePreset===p.id;return(<button key={p.id} onClick={()=>applyP(p)} style={{padding:'6px 2px',borderRadius:8,border:'1px solid '+(a?_T.text:_T.line),background:a?_T.text:_T.card,cursor:'pointer',transition:'all .12s'}}><div style={{fontSize:12,fontWeight:800,color:a?'#fff':_T.text,letterSpacing:'-0.3px'}}>{p.label}</div><div style={{fontSize:10,color:a?'#ff7a85':_T.up,fontWeight:600,marginTop:1}}>{p.stat}</div></button>);})}
<button onClick={resetAll} style={{padding:'6px 12px',borderRadius:8,border:'1px solid '+_T.line,background:_T.linelt,color:_T.sub,fontSize:11,fontWeight:600,cursor:'pointer',whiteSpace:'nowrap'}}>↻</button>
</div>
</Card>
{/* 연도 + 등급 결합 */}
<Card title="필터" hint={yf.length>=2?yf.join('+')+'년':null}>
<div style={{display:'flex',background:_T.linelt,borderRadius:8,padding:2,marginBottom:8}}>
{_yrs.map(y=>{const isActive=y.id==='all'?yf.length===0:yf.includes(y.id);return(<Seg key={y.id} active={isActive} onClick={()=>toggleYr(y.id)}>{y.l}</Seg>);})}
</div>
<GradeRow label="네오" col={_T.accentN} arr={selN} setArr={setSelN} opts={_ng}/>
<GradeRow label="침착해" col={_T.accentC} arr={selCC} setArr={setSelCC} opts={_g6}/>
<GradeRow label="주도주" col={_T.accentJ} arr={selJD} setArr={setSelJD} opts={_g6}/>
<GradeRow label="하승훈" col={_T.accentH} arr={selHS} setArr={setSelHS} opts={_hsg}/>
</Card>
{/* 통합 다크 카드 — 통계 + 투자금 계산기 */}
{stats&&(<div style={{background:_T.text,borderRadius:14,padding:'16px',marginBottom:8,color:'#fff'}}>
{/* 1행: 백테스트 통계 */}
<div style={{display:'flex',marginBottom:14}}>
<div style={{flex:1}}><div style={{fontSize:11,opacity:0.55,marginBottom:4,letterSpacing:'-0.2px',fontWeight:500}}>총 건수</div><div style={{fontSize:22,fontWeight:800,letterSpacing:'-0.5px'}}>{stats.n.toLocaleString()}<span style={{fontSize:12,fontWeight:500,opacity:0.7,marginLeft:1}}>건</span></div></div>
<div style={{flex:1,borderLeft:'1px solid rgba(255,255,255,0.12)',paddingLeft:12}}><div style={{fontSize:11,opacity:0.55,marginBottom:4,letterSpacing:'-0.2px',fontWeight:500}}>익절률</div><div style={{fontSize:22,fontWeight:800,letterSpacing:'-0.5px',color:'#ff7a85'}}>{(stats.p5/stats.n*100).toFixed(1)}<span style={{fontSize:12,fontWeight:500,opacity:0.8,marginLeft:1}}>%</span></div></div>
<div style={{flex:1,borderLeft:'1px solid rgba(255,255,255,0.12)',paddingLeft:12}}><div style={{fontSize:11,opacity:0.55,marginBottom:4,letterSpacing:'-0.2px',fontWeight:500}}>평균 수익</div><div style={{fontSize:22,fontWeight:800,letterSpacing:'-0.5px',color:stats.avg>=0?'#ff7a85':'#7eb6ff'}}>{stats.avg>=0?'+':''}{stats.avg.toFixed(2)}<span style={{fontSize:12,fontWeight:500,opacity:0.8,marginLeft:1}}>%</span></div></div>
</div>
<div style={{height:1,background:'rgba(255,255,255,0.08)',margin:'0 -16px 14px'}}/>
{/* 2행: 투자금 입력 */}
<div style={{fontSize:11,opacity:0.55,marginBottom:8,letterSpacing:'-0.2px',fontWeight:500}}>1건당 투자금</div>
<div style={{display:'flex',alignItems:'center',gap:8,marginBottom:8}}>
<input type="number" value={invAmt} onChange={e=>setInvAmt(+e.target.value||0)} step="100000" style={{flex:1,padding:'9px 12px',border:'1px solid rgba(255,255,255,0.15)',borderRadius:8,fontSize:14,fontWeight:700,color:'#fff',background:'rgba(255,255,255,0.06)',outline:'none',letterSpacing:'-0.3px'}}/>
<span style={{fontSize:13,opacity:0.7,fontWeight:600}}>원</span>
</div>
<div style={{display:'flex',gap:5,marginBottom:14,flexWrap:'wrap'}}>
{_amtPresets.map(a=>(<button key={a} onClick={()=>setInvAmt(a)} style={{padding:'5px 11px',borderRadius:16,border:'1px solid '+(invAmt===a?'#fff':'rgba(255,255,255,0.18)'),background:invAmt===a?'#fff':'transparent',color:invAmt===a?_T.text:'rgba(255,255,255,0.7)',fontSize:11,fontWeight:700,cursor:'pointer',letterSpacing:'-0.2px',transition:'all .12s'}}>{_man(a)}원</button>))}
</div>
{/* 3행: 환산 결과 */}
<div style={{display:'flex'}}>
<div style={{flex:1}}><div style={{fontSize:11,opacity:0.55,marginBottom:4,letterSpacing:'-0.2px',fontWeight:500}}>총 투입</div><div style={{fontSize:18,fontWeight:800,letterSpacing:'-0.4px'}}>{_man(stats.totalInvest)}<span style={{fontSize:11,fontWeight:500,opacity:0.7,marginLeft:1}}>원</span></div></div>
<div style={{flex:1,borderLeft:'1px solid rgba(255,255,255,0.12)',paddingLeft:12}}><div style={{fontSize:11,opacity:0.55,marginBottom:4,letterSpacing:'-0.2px',fontWeight:500}}>총 손익</div><div style={{fontSize:18,fontWeight:800,letterSpacing:'-0.4px',color:stats.totalPnl>=0?'#ff7a85':'#7eb6ff'}}>{stats.totalPnl>=0?'+':''}{_man(Math.abs(stats.totalPnl))}<span style={{fontSize:11,fontWeight:500,opacity:0.8,marginLeft:1}}>원</span></div></div>
<div style={{flex:1,borderLeft:'1px solid rgba(255,255,255,0.12)',paddingLeft:12}}><div style={{fontSize:11,opacity:0.55,marginBottom:4,letterSpacing:'-0.2px',fontWeight:500}}>수익률</div><div style={{fontSize:18,fontWeight:800,letterSpacing:'-0.4px',color:stats.ret>=0?'#ff7a85':'#7eb6ff'}}>{stats.ret>=0?'+':''}{stats.ret.toFixed(2)}<span style={{fontSize:11,fontWeight:500,opacity:0.8,marginLeft:1}}>%</span></div></div>
</div>
</div>)}
{/* 정렬 */}
<div style={{display:'flex',background:_T.linelt,borderRadius:8,padding:3,marginBottom:8}}>
{_sorts.map(s=>(<Seg key={s.id} active={sortMode===s.id} onClick={()=>setSortMode(s.id)}>{s.l}</Seg>))}
</div>
{/* 거래 리스트 */}
<div style={{background:_T.card,borderRadius:12,border:'1px solid '+_T.line,overflow:'hidden'}}>
<div style={{maxHeight:'62vh',overflowY:'auto'}}>
<table style={{width:'100%',fontSize:12,borderCollapse:'collapse'}}>
<thead style={{position:'sticky',top:0,background:_T.linelt,zIndex:1}}><tr><th style={{padding:'10px 8px',textAlign:'left',fontSize:11,fontWeight:600,color:_T.hint,letterSpacing:'-0.2px'}}>종목</th><th style={{padding:'10px 6px',textAlign:'center',fontSize:11,fontWeight:600,color:_T.hint}}>날짜</th><th style={{padding:'10px 6px',textAlign:'center',fontSize:11,fontWeight:600,color:_T.hint}}>청산일</th><th style={{padding:'10px 6px',textAlign:'right',fontSize:11,fontWeight:600,color:_T.hint}}>등락</th><th style={{padding:'10px 4px',textAlign:'center',fontSize:11,fontWeight:600,color:_T.hint}}>네</th><th style={{padding:'10px 4px',textAlign:'center',fontSize:11,fontWeight:600,color:_T.hint}}>침</th><th style={{padding:'10px 4px',textAlign:'center',fontSize:11,fontWeight:600,color:_T.hint}}>주</th><th style={{padding:'10px 4px',textAlign:'center',fontSize:11,fontWeight:600,color:_T.hint}}>하</th><th style={{padding:'10px 6px',textAlign:'center',fontSize:11,fontWeight:600,color:_T.hint}}>결과</th><th style={{padding:'10px 8px',textAlign:'right',fontSize:11,fontWeight:600,color:_T.hint}}>수익</th></tr></thead>
<tbody>{filtered.slice(0,300).map((r,i)=>{const won=Math.round(invAmt*((r.t||0)/100));return(<tr key={i} onClick={()=>onRowClick&&onRowClick(r)} style={{cursor:'pointer',borderTop:'1px solid '+_T.linelt}}><td style={{padding:'10px 8px',fontWeight:600,color:_T.text,letterSpacing:'-0.2px'}}>{r.n}</td><td style={{padding:'10px 6px',textAlign:'center',color:_T.hint,fontSize:11}}>{r.d?r.d.slice(2):''}</td><td style={{padding:'10px 6px',textAlign:'center',color:_T.hint,fontSize:11}}>{r.exd||'—'}</td><td style={{padding:'10px 6px',textAlign:'right',color:(r.ch||0)>0?_T.up:_T.down,fontWeight:600}}>{r.ch}%</td><td style={{padding:'10px 4px',textAlign:'center',fontWeight:700,color:_T.body}}>{r.g}</td><td style={{padding:'10px 4px',textAlign:'center',fontWeight:700,color:_T.body}}>{r.ccG}</td><td style={{padding:'10px 4px',textAlign:'center',fontWeight:700,color:_T.body}}>{r.jdG}</td><td style={{padding:'10px 4px',textAlign:'center',fontWeight:700,color:_T.body}}>{r.hsG}</td><td style={{padding:'10px 6px',textAlign:'center',fontSize:11,fontWeight:600,color:_resCol(r.r)}}>{_resLbl(r.r)}</td><td style={{padding:'10px 8px',textAlign:'right',fontWeight:700}}><div style={{color:(r.t||0)>=0?_T.up:_T.down}}>{(r.t||0)>=0?'+':''}{(r.t||0).toFixed(1)}%</div><div style={{fontSize:10,color:_T.hint,fontWeight:500,marginTop:1}}>{won>=0?'+':''}{_man(Math.abs(won))}원</div></td></tr>);})}</tbody></table>
</div>
{filtered.length>300&&(<div style={{padding:'10px',textAlign:'center',color:_T.mute,fontSize:11,borderTop:'1px solid '+_T.line,background:_T.linelt}}>상위 300건만 표시 · 전체 {filtered.length.toLocaleString()}건</div>)}
</div>
</div>);
}


function NeoBaeFilterDB({onRowClick,theme="dark"}={}){
// 다크/라이트 토큰
const _T=theme==="dark"
  ?{text:'#e6edf3',body:'#c9d1d9',sub:'#8b949e',hint:'#6e7681',mute:'#484f58',line:'#30363d',linelt:'#21262d',bg:'#0d1117',card:'#161b22',cardHov:'#1c2229',up:'#f85149',down:'#58a6ff',green:'#10b981',accent:'#7c3aed'}
  :{text:'#191f28',body:'#333d4b',sub:'#4e5968',hint:'#6b7684',mute:'#8b95a1',line:'#e5e8eb',linelt:'#f2f4f6',bg:'#f9fafb',card:'#ffffff',cardHov:'#f5f7fa',up:'#f04452',down:'#1f6dee',green:'#10b981',accent:'#7c3aed'};
const _supplyOpts=[
{id:"기관",l:"기관",col:"#475569",match:(iv)=>iv==="기만"||iv==="기관"},
{id:"기+외",l:"기+외",col:"#7c3aed",match:(iv)=>iv==="기+외"||iv==="외+기"},
{id:"외인",l:"외인",col:"#3182f6",match:(iv)=>iv==="외만"||iv==="외인"}
];
const _qualifyAny=(iv)=>_supplyOpts.some(o=>o.match(iv));
const _qualifyInst=(iv)=>iv==="기관"||iv==="기만"||iv==="기+외"||iv==="외+기";
const _supLabel=(iv)=>{const o=_supplyOpts.find(x=>x.match(iv));return o?o.id:iv||"—";};
const _supColor=(lbl)=>{const o=_supplyOpts.find(x=>x.id===lbl);return o?o.col:_T.mute;};
const _amtNum=(s)=>{const m=String(s||"").match(/(\d+(?:\.\d+)?)/);if(!m)return 0;const n=+m[1];return s.includes("兆")||s.includes("조")?n*10000:n;};
// 모드 state — leader / neo25 / neo90 / best01 (시초가 매도 최고조합)
const [mode,setMode]=useState(()=>{try{const v=localStorage.getItem('nbdb_mode_v2');const valid=['leader','neo25','neo90','best01'];if(valid.includes(v))return v;if(v==='neo7'||v==='custom'||v==='neo90b')return 'best01';if(v==='mix')return 'best01';return 'leader';}catch(e){return 'leader';}});
useEffect(()=>{try{localStorage.setItem('nbdb_mode_v2',mode);}catch(e){}},[mode]);
// 라이브 누적 신호 fetch (sector-api signals.json)
const [liveSignals,setLiveSignals]=useState([]);
const [liveLoaded,setLiveLoaded]=useState(false);
useEffect(()=>{
  fetch("https://raw.githubusercontent.com/neo9999999999/sector-api/main/data/signals.json?_="+Date.now())
    .then(r=>r.json()).then(d=>{setLiveSignals(Array.isArray(d)?d:[]);setLiveLoaded(true);}).catch(()=>setLiveLoaded(true));
},[]);
// 라이브 신호 분류 — 주말 제외 (월~금만)
const _liveDate=(d)=>{const s=String(d||"");return s.length===8?s.slice(2,4)+"-"+s.slice(4,6)+"-"+s.slice(6,8):s;};
const _isWeekday=(dStr)=>{if(!dStr||dStr.length!==8)return false;const dt=new Date(+dStr.slice(0,4),+dStr.slice(4,6)-1,+dStr.slice(6,8));const day=dt.getDay();return day>=1&&day<=5;};
// 네오 90% 필터 — 6년 백테스트 검증된 통합 90% 종배 룰
// 진입: 등락 15~29 + 거래대금≥50억 + 수급OK(둘다- 제외) + (침S/S+ OR 하A+)
// 청산: 5% 도달 후 트레일링 발동 → 저가 ≤ peak × 0.97 즉시 청산 / 15일 만기 / 손절X
const _neo90Filter=(r)=>{
  const ch=+r.ch||0;if(!(ch>=15&&ch<29))return false;
  if(_amtNum(r.mc)<50)return false;
  if(!_qualifyAny(r.iv))return false; // 둘다- 자동 제외
  const ccS=r.ccG==='S'||r.ccG==='S+';
  const hsAplus=r.hsG==='A+';
  return ccS||hsAplus;
};
// 옵션B 정밀형 = 네오 90% + 60일+120일 둘 다 신고가 + 외만 제외 (기만/기+외만)
const _neo90BFilter=(r)=>{
  if(!_neo90Filter(r))return false;
  if(r.h60!==1||r.h120!==1)return false;
  // 외만 제외: 기만 또는 기+외/외+기만 통과
  const inv=r.iv;
  if(!(inv==='기관'||inv==='기만'||inv==='기+외'||inv==='외+기'))return false;
  return true;
};
// 시뮬: D+1 시초가 매도 (대장주 모드용 — 분봉 데이터 누적 전까지 보수적 시뮬)
const _simNextOpen=(ohlc)=>{
  if(!ohlc||!ohlc.length)return null;
  const t=+ohlc[0].o||0;
  return {t:Math.round(t*10)/10,r:'시초가매도',tp1d:ohlc[0].d,tp1dy:1,exd:ohlc[0].d,exdy:1,_peak:0};
};
// 시뮬: D+1 종가 매도
const _simNextClose=(ohlc)=>{
  if(!ohlc||!ohlc.length)return null;
  const t=+ohlc[0].c||0;
  return {t:Math.round(t*10)/10,r:'종가매도',exd:ohlc[0].d,exdy:1};
};
// 3-way 비교: 시초가 / 종가 / 트레일 (모드 무관, 모든 카드 공통 비교)
const _compareExits=(ohlc)=>{
  const op=_simNextOpen(ohlc),cl=_simNextClose(ohlc),tr=_simNeo90(ohlc);
  return {
    open:op?op.t:null,
    close:cl?cl.t:null,
    trail:tr?tr.t:null,
    trailDays:tr?tr.exdy:0,
    trailReason:tr?tr.r:''
  };
};
// 시뮬: 5% 도달 후 트레일 -3% (peak × 0.97 가격 기준), 15일 만기
const _simNeo90=(ohlc)=>{
  if(!ohlc||!ohlc.length)return null;
  let triggered=false,peak=0,firstReachDay=0,firstReachDate='';
  const maxDay=15;
  for(let i=0;i<Math.min(ohlc.length,maxDay);i++){
    const b=ohlc[i],h=+b.h||0,l=+b.l||0;
    if(!triggered){
      if(h>=5){triggered=true;firstReachDay=i+1;firstReachDate=b.d;peak=h;}
    }else{
      if(h>peak)peak=h;
      // 가격 기준 -3% trail: peak% → 가격(1+peak/100) × 0.97 → -1 × 100
      const stopPct=((1+peak/100)*0.97-1)*100;
      if(l<=stopPct){
        return {t:Math.round(stopPct*10)/10,r:'트레일익절',tp1d:firstReachDate,tp1dy:firstReachDay,exd:b.d,exdy:i+1,_peak:peak};
      }
    }
  }
  // 15일 만기
  const lastIdx=Math.min(ohlc.length,maxDay)-1;const last=ohlc[lastIdx];
  const t=+last.c||0;
  if(!triggered){
    return {t,r:'시간컷',tp1d:'',tp1dy:0,exd:last.d,exdy:lastIdx+1,_peak:0};
  }
  return {t,r:'시간컷',tp1d:firstReachDate,tp1dy:firstReachDay,exd:last.d,exdy:lastIdx+1,_peak:peak};
};
// 라이브 신호 분류 — 완화 조건 (등락 10-29 + 500억+ + 평일)
// 5000억+ → neo25, 그 외 → leader (네오 대장주, 1,2,3등주 후보)
const liveClassify=(s)=>{
  if(!_isWeekday(s.signal_date))return null;
  const ch=+s.rate||0;if(!(ch>=10&&ch<29))return null;
  const a=+s.vol||0;if(a<500)return null;
  return a>=5000?"neo25":"leader";
};
// 라이브 신호 → D 형식으로 변환 (메인 리스트와 통합)
const liveAsD=useMemo(()=>{
  return liveSignals.map(s=>{
    const cat=liveClassify(s);if(!cat)return null;
    return {
      n:s.name,d:'20'+_liveDate(s.signal_date),m:s.market,ch:+s.rate||0,mc:s.vol+'억',iv:s.supply,sc:+s.score||0,g:s.grade,
      h60:s.h60===1?1:0,h120:s.h120===1?1:0,
      ma5:+s.ma5||0,ma20:+s.ma20||0,ma60:+s.ma60||0,maAlign:s.maAlign===1?1:0,cum5:+s.cum5||0,
      tp1:cat==='neo25'?25:5,tp2:cat==='neo25'?50:0,
      t:0,r:'진행중',exd:'',exdy:0,
      tp1d:'',tp2d:'',tp1dy:0,tp2dy:0,
      _isLive:true,_cat:cat
    };
  }).filter(x=>x);
},[liveSignals]);
const [yf,setYf]=useState([]);
const [selSup,setSelSup]=useState([]);
const [sortMode,setSortMode]=useState('profit');
const [invAmt,setInvAmt]=useState(()=>{try{const v=localStorage.getItem('nbdb_invAmt_v1');return v?+v:500000;}catch(e){return 500000;}});
useEffect(()=>{try{localStorage.setItem('nbdb_invAmt_v1',String(invAmt));}catch(e){}},[invAmt]);
// 모드 단독 filter helpers (D row 단위)
const _isNeo25=(r)=>{
  const ch=+r.ch||0;if(!(ch>=15&&ch<29))return false;
  if(_amtNum(r.mc)<5000)return false;
  if(!_qualifyInst(r.iv))return false;
  if((+r.sc||0)<3)return false;
  if(r.h120!==1)return false;
  return true;
};
// 시장별 ≥3건 발화 시 1,2,3등 — 전역 leader Set 계산
const _leaderSet=useMemo(()=>{
  const set=new Set();
  const groups={};
  for(const r of D){
    const ch=+r.ch||0;if(!(ch>=10&&ch<28))continue;
    if(_amtNum(r.mc)<500)continue;
    if(r.m!=='KS'&&r.m!=='KO')continue;
    const mkt=r.m==='KS'?'KOSPI':'KOSDAQ';
    const key=(r.d||'')+'|'+mkt;
    if(!groups[key])groups[key]=[];
    groups[key].push(r);
  }
  for(const k of Object.keys(groups)){
    const g=groups[k];if(g.length<3)continue;
    const sorted=[...g].sort((a,b)=>(+b.ch||0)-(+a.ch||0));
    const mkt=k.split('|')[1];
    sorted.slice(0,3).forEach((r,i)=>{
      const id=(r.n||'')+'|'+(r.d||'');
      set.add(id);
      r._rank=i+1;r._mktLabel=mkt;
    });
  }
  return set;
},[]);
const _isLeader=(r)=>_leaderSet.has((r.n||'')+'|'+(r.d||''));
const filtered=useMemo(()=>{
// historical D + 라이브 신호 통합
const merged=[...D,...liveAsD];
// 모드별 등락률 범위
const _chMin=mode==='leader'?10:15;
const _chMax=mode==='leader'?28:29;
let arr=merged.filter(r=>{
if(yf.length&&r.d&&!yf.includes(r.d.slice(2,4)))return false;
if(!(r.ch>=_chMin&&r.ch<_chMax))return false;
const amt=_amtNum(r.mc);
// 라이브 신호 — mode 필터 우회 (단 거래대금 영역만 매칭)
if(r._isLive){
  if(mode==='leader')return amt>=500;
  if(mode==='neo25')return amt>=5000;
  return amt>=100;
}
if(r.g==="X")return false;
// historical — 모드별 자동 필터
if(mode==='leader'){
  if(amt<500)return false;
  if(r.m!=='KS'&&r.m!=='KO')return false;
  return true;
}
if(mode==='neo25')return _isNeo25(r);
if(mode==='neo90')return _neo90Filter(r);
if(mode==='best01'){
  // best01 합집합: A ∪ B ∪ C (시초가 매도용 검증된 룰)
  const ch=+r.ch||0;
  if(!(ch>=15&&ch<28))return false;
  const inA=r._rank===2&&(r.iv==='기+외'||r.iv==='외+기')&&amt>=1000&&r.h120===1;
  const inB=r._rank===2&&_qualifyInst(r.iv)&&amt>=500&&(+r.sc||0)>=3&&r.h120===1;
  const inC=(r._rank===1||r._rank===2)&&_qualifyInst(r.iv)&&amt>=500&&(+r.sc||0)>=3&&r.h60===1;
  return inA||inB||inC;
}
return true;
});
// 대장주 모드: 시장별 ≥3건 발화 시 1,2,3등 추출
if(mode==='leader'){
  const groups={};
  for(const r of arr){
    const mkt=r.m==='KS'?'KOSPI':r.m==='KO'?'KOSDAQ':'';
    if(!mkt)continue;
    const key=(r.d||'')+'|'+mkt;
    if(!groups[key])groups[key]=[];
    groups[key].push(r);
  }
  const newArr=[];
  for(const k of Object.keys(groups)){
    const g=groups[k];
    if(g.length<3)continue;
    const sorted=[...g].sort((a,b)=>(+b.ch||0)-(+a.ch||0));
    const mktLabel=k.split('|')[1];
    sorted.slice(0,3).forEach((rr,i)=>{
      newArr.push({...rr,_rank:i+1,_mktLabel:mktLabel});
    });
  }
  arr=newArr;
  // 시뮬 적용 (D+1 시초가 매도)
  arr=arr.map(rr=>{
    if(rr._isLive)return rr;
    const sim=_simNextOpen(rr.ohlc);
    if(!sim)return rr;
    return {...rr,t:sim.t,r:sim.r,tp1d:sim.tp1d,tp1dy:sim.tp1dy,tp2d:'',tp2dy:0,exd:sim.exd,exdy:sim.exdy,_peak:sim._peak};
  });
}
// 네오 90% 모드: 시뮬 결과로 t/r/exd/tp1d 덮어쓰기 (트레일링)
if(mode==='neo90'){
  arr=arr.map(r=>{
    if(r._isLive)return r;
    const sim=_simNeo90(r.ohlc);
    if(!sim)return r;
    return {...r,t:sim.t,r:sim.r,tp1d:sim.tp1d,tp1dy:sim.tp1dy,tp2d:'',tp2dy:0,exd:sim.exd,exdy:sim.exdy,_peak:sim._peak};
  });
}
// best01 모드: 시초가 매도 시뮬 + tier 배지 부착 (A/B/C 어디 속하는지)
if(mode==='best01'){
  arr=arr.map(r=>{
    if(r._isLive)return r;
    const amt=_amtNum(r.mc);
    const inA=r._rank===2&&(r.iv==='기+외'||r.iv==='외+기')&&amt>=1000&&r.h120===1;
    const inB=r._rank===2&&_qualifyInst(r.iv)&&amt>=500&&(+r.sc||0)>=3&&r.h120===1;
    const inC=(r._rank===1||r._rank===2)&&_qualifyInst(r.iv)&&amt>=500&&(+r.sc||0)>=3&&r.h60===1;
    let tier='C',tierCol='#10b981',tierLabel='C';
    if(inA&&inB&&inC){tier='ABC';tierCol='#dc2626';tierLabel='🥇 A∩B∩C';}
    else if(inA&&inB){tier='AB';tierCol='#ea580c';tierLabel='A∩B';}
    else if(inA&&inC){tier='AC';tierCol='#ea580c';tierLabel='A∩C';}
    else if(inB&&inC){tier='BC';tierCol='#f59e0b';tierLabel='B∩C';}
    else if(inA){tier='A';tierCol='#a855f7';tierLabel='A only';}
    else if(inB){tier='B';tierCol='#1f6dee';tierLabel='B only';}
    const sim=_simNextOpen(r.ohlc);
    const base={...r,_tier:tier,_tierCol:tierCol,_tierLabel:tierLabel,_inA:inA,_inB:inB,_inC:inC};
    if(!sim)return base;
    return {...base,t:sim.t,r:sim.r,tp1d:sim.tp1d,tp1dy:sim.tp1dy,tp2d:'',tp2dy:0,exd:sim.exd,exdy:sim.exdy,_peak:sim._peak};
  });
}
// 정렬 모드별 동작
if(sortMode==='live')return arr.filter(x=>x._isLive).sort((a,b)=>String(b.d||'').localeCompare(String(a.d||'')));
if(sortMode==='profit')return arr.sort((a,b)=>(b.t||0)-(a.t||0));
if(sortMode==='oldest')return arr.sort((a,b)=>String(a.d||'').localeCompare(String(b.d||'')));
if(sortMode==='newest')return arr.sort((a,b)=>String(b.d||'').localeCompare(String(a.d||'')));
return arr;
},[yf,selSup,sortMode,mode,liveAsD,_leaderSet]);
// 결과 단순 분류 — 익절(t≥1) / 손절(t≤-1) / 무사통과 / 진행중
const _classifyResult=(r)=>{
  if(r._isLive||String(r.r||'')==='진행중')return 'live';
  const t=+r.t||0;
  if(t>=1)return 'win';
  if(t<=-1)return 'sl';
  return 'flat';
};
const stats=useMemo(()=>{
if(!filtered.length)return null;
const cnt={win:0,sl:0,flat:0,live:0};
const sum={win:0,sl:0,flat:0};
for(const r of filtered){
  const c=_classifyResult(r);
  if(cnt[c]!==undefined)cnt[c]++;
  if(sum[c]!==undefined)sum[c]+=(+r.t||0);
}
const realRows=filtered.filter(x=>!x._isLive&&String(x.r||'')!=='진행중');
const realN=realRows.length||1;
const sumRet=realRows.reduce((a,b)=>a+(+b.t||0),0);
const avg=sumRet/realN;
const totalInvest=invAmt*realN;
const totalPnl=Math.round(invAmt*sumRet/100);
const ret=totalInvest>0?(totalPnl/totalInvest*100):0;
const winRate=realN?cnt.win/realN*100:0;
const lossRate=realN?cnt.sl/realN*100:0;
const avgWin=cnt.win?sum.win/cnt.win:0;
const avgSL=cnt.sl?sum.sl/cnt.sl:0;
const avgFlat=cnt.flat?sum.flat/cnt.flat:0;
const ratio=avgSL<0?Math.abs(avgWin/avgSL):0;
return {n:filtered.length,realN,avg,totalInvest,totalPnl,ret,
  cnt,winRate,lossRate,
  avgWin,avgSL,avgFlat,ratio,
  p5:cnt.win,sl:cnt.sl};
},[filtered,invAmt]);
// 3-way 청산 평균 — 모든 모드에서 비교 가능
const exitStats=useMemo(()=>{
  if(!filtered.length)return null;
  const real=filtered.filter(x=>!x._isLive&&x.ohlc&&x.ohlc.length);
  if(!real.length)return null;
  const opens=[],closes=[],trails=[];
  for(const r of real){
    const c=_compareExits(r.ohlc);
    if(c.open!=null)opens.push(c.open);
    if(c.close!=null)closes.push(c.close);
    if(c.trail!=null)trails.push(c.trail);
  }
  const avg=(a)=>a.length?a.reduce((x,y)=>x+y,0)/a.length:0;
  const wr=(a,th)=>a.length?a.filter(x=>x>=th).length/a.length*100:0;
  return {
    n:real.length,
    open:{avg:avg(opens),winRate:wr(opens,1)},
    close:{avg:avg(closes),winRate:wr(closes,1)},
    trail:{avg:avg(trails),winRate:wr(trails,5)}
  };
},[filtered]);
// best01 모드 — 연도별 통계 + 3가지 청산 비교 + tier 분포
const best01Stats=useMemo(()=>{
  if(mode!=='best01'||!filtered.length)return null;
  const real=filtered.filter(x=>!x._isLive&&x.ohlc&&x.ohlc.length);
  if(!real.length)return null;
  // 각 row에 3가지 청산 결과 부착
  const enriched=real.map(r=>{
    const cmp=_compareExits(r.ohlc);
    return {r,open:cmp.open,close:cmp.close,trail:cmp.trail};
  });
  // 연도별 × 청산별 통계
  const yrs={};
  for(const e of enriched){
    const y=e.r.d?e.r.d.slice(2,4):'';if(!y)continue;
    if(!yrs[y])yrs[y]={open:[],close:[],trail:[]};
    if(e.open!=null)yrs[y].open.push(e.open);
    if(e.close!=null)yrs[y].close.push(e.close);
    if(e.trail!=null)yrs[y].trail.push(e.trail);
  }
  const calcSet=(arr,winTh,feeAdj)=>{
    if(!arr.length)return null;
    const avg=arr.reduce((a,b)=>a+b,0)/arr.length;
    const win=arr.filter(x=>x>=winTh).length;
    const loss=arr.filter(x=>x<=-winTh).length;
    const wins=arr.filter(x=>x>=winTh),losses=arr.filter(x=>x<=-winTh);
    const aw=wins.length?wins.reduce((a,b)=>a+b,0)/wins.length:0;
    const al=losses.length?losses.reduce((a,b)=>a+b,0)/losses.length:0;
    return {n:arr.length,avg,adjAvg:avg-feeAdj,winRate:win/arr.length*100,lossRate:loss/arr.length*100,ratio:al<0?Math.abs(aw/al):0,cumAdj:(avg-feeAdj)*arr.length};
  };
  const yrAvgs=[];
  for(const y of ["21","22","23","24","25","26"]){
    if(!yrs[y])continue;
    yrAvgs.push({
      y,
      open:calcSet(yrs[y].open,1,0.25),
      close:calcSet(yrs[y].close,1,0.25),
      trail:calcSet(yrs[y].trail,5,0.25)
    });
  }
  // tier별 카운트
  const tiers={ABC:0,AB:0,AC:0,BC:0,A:0,B:0,C:0};
  for(const r of real)if(r._tier&&tiers[r._tier]!==undefined)tiers[r._tier]++;
  // 전체
  const opens=enriched.map(e=>e.open).filter(x=>x!=null);
  const closes=enriched.map(e=>e.close).filter(x=>x!=null);
  const trails=enriched.map(e=>e.trail).filter(x=>x!=null);
  // 모든 연도 양수 검증 (각 청산별)
  const allPos=(k)=>yrAvgs.length>=5&&yrAvgs.every(x=>x[k]&&x[k].avg>0);
  return {
    n:real.length,
    open:calcSet(opens,1,0.25),
    close:calcSet(closes,1,0.25),
    trail:calcSet(trails,5,0.25),
    yrAvgs,tiers,
    allPosOpen:allPos('open'),allPosClose:allPos('close'),allPosTrail:allPos('trail')
  };
},[filtered,mode]);
// 대장주 모드 — 랭크별 통계
const leaderStats=useMemo(()=>{
  if(mode!=='leader'||!filtered.length)return null;
  const byRank={1:[],2:[],3:[]};
  for(const r of filtered){
    if(r._rank>=1&&r._rank<=3)byRank[r._rank].push(+r.t||0);
  }
  const calc=(arr)=>{
    if(!arr.length)return {n:0,avg:0,winRate:0};
    const avg=arr.reduce((a,b)=>a+b,0)/arr.length;
    const winRate=arr.filter(x=>x>=5).length/arr.length*100;
    return {n:arr.length,avg,winRate};
  };
  const r1=calc(byRank[1]),r2=calc(byRank[2]),r3=calc(byRank[3]);
  // 이벤트(일자/시장) 단위 가중수익 = 0.5*1등 + 0.335*2등 + 0.165*3등
  const events={};
  for(const r of filtered){
    const k=(r.d||'')+'|'+(r._mktLabel||'');
    if(!events[k])events[k]={1:null,2:null,3:null};
    events[k][r._rank]=+r.t||0;
  }
  const evtArr=Object.values(events).filter(e=>e[1]!=null&&e[2]!=null&&e[3]!=null);
  const wsum=evtArr.reduce((a,e)=>a+(0.5*e[1]+0.335*e[2]+0.165*e[3]),0);
  const wAvg=evtArr.length?wsum/evtArr.length:0;
  return {r1,r2,r3,events:evtArr.length,wAvg};
},[filtered,mode]);
const toggleYr=(y)=>{if(y==='all'){setYf([]);return;}setYf(yf.includes(y)?yf.filter(x=>x!==y):[...yf,y]);};
const toggleSup=(s)=>{setSelSup(selSup.includes(s)?selSup.filter(x=>x!==s):[...selSup,s]);};
const Seg=({active,children,onClick})=>(<button onClick={onClick} style={{flex:'1 1 0',padding:'8px 8px',border:'none',background:active?_T.accent:'transparent',color:active?'#fff':_T.sub,fontSize:12,fontWeight:active?700:500,cursor:'pointer',borderRadius:8,transition:'all .15s',letterSpacing:'-0.2px'}}>{children}</button>);
const Card=({title,hint,children,pad})=>(<div style={{background:_T.card,borderRadius:10,padding:pad||'14px 14px',marginBottom:8,border:'1px solid '+_T.line}}><div style={{display:'flex',alignItems:'baseline',justifyContent:'space-between',marginBottom:10}}><div style={{fontSize:13,fontWeight:700,color:_T.text,letterSpacing:'-0.3px'}}>{title}</div>{hint&&<div style={{fontSize:11,color:_T.hint,fontWeight:500}}>{hint}</div>}</div>{children}</div>);
const _sorts=[{id:'live',l:'📡 진행중'},{id:'profit',l:'익절순'},{id:'newest',l:'최신순'},{id:'oldest',l:'오래된순'}];
const _yrs=[{id:'all',l:'전체'},{id:'21',l:'21'},{id:'22',l:'22'},{id:'23',l:'23'},{id:'24',l:'24'},{id:'25',l:'25'},{id:'26',l:'26'}];
const _amtPresets=[100000,300000,500000,1000000,3000000];
const _man=(n)=>(n>=10000?Math.round(n/10000).toLocaleString()+'만':n.toLocaleString());
const _resLbl=(r)=>{const s=String(r||"");if(!s)return "—";if(s==="진행중")return "진행중";if(s==="BOTH")return "익절";if(s==="TP1")return "1차익절";if(s==="TP2")return "익절";if(s==="TP1_BE")return "익절+본절";if(s==="TP1_SL")return "익절+손절";if(s==="TP1_FSL")return "익절+강제SL";if(s==="SL")return "손절";if(s==="FSL")return "강제손절";if(s==="TRAIL")return "트레일익절";if(s==="TO")return "15일만료";if(s.endsWith("일보유"))return s;return s;};
const _resCol=(r)=>{const s=String(r||"");if(s==="진행중")return"#f59e0b";if(s==="SL"||s==="FSL")return _T.down;if(s==="TO"||s.endsWith("일보유"))return _T.mute;return _T.up;};
return (<div style={{padding:'12px',background:_T.bg,minHeight:'100vh',fontFamily:"-apple-system, 'Pretendard', sans-serif",color:_T.text}}>
{/* 모드 토글 — 네오 대장주 / 네오 25% / 네오 90% / 옵션B */}
<div style={{display:'flex',background:_T.linelt,borderRadius:14,padding:4,marginBottom:10,gap:2}}>
{[
  {id:'leader',l:'네오 대장주',sub:'1,2,3등주',col:'#a855f7'},
  {id:'neo25',l:'네오 25%',sub:'5000억+',col:'#c81e1e'},
  {id:'neo90',l:'네오 90%',sub:'침S/하A+ 트레일',col:'#10b981'},
  {id:'best01',l:'최고조합01',sub:'시초가 매도 (A∪B∪C)',col:'#f59e0b'}
].map(m=>{const a=mode===m.id;return(
  <button key={m.id} onClick={()=>setMode(m.id)} style={{flex:'1 1 0',padding:'10px 6px',border:'none',background:a?m.col:'transparent',color:a?'#fff':_T.sub,borderRadius:10,cursor:'pointer',transition:'all .15s',letterSpacing:'-0.3px',fontWeight:a?800:600,minWidth:0}}>
    <div style={{fontSize:12,whiteSpace:'nowrap'}}>{m.l}</div>
    <div style={{fontSize:9,fontWeight:500,opacity:a?0.85:0.7,marginTop:2,whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{m.sub}</div>
  </button>);})}
</div>
{/* 필터 카드 */}
<Card title={mode==='leader'?'네오 대장주 자동 필터 (1,2,3등주)':mode==='neo25'?'네오 25% 자동 필터':mode==='neo90'?'네오 90% 자동 필터':mode==='best01'?'최고조합01 — 시초가 매도 합집합 (A∪B∪C)':'필터'} hint={mode==='leader'?'D+1 시초가 매도 · 5년4개월 가중평균 +0.12%':mode==='neo25'?'+25% 즉익 · 25일 만기 · 평균 +4.75%':mode==='neo90'?'5% 후 트레일 -3% · 15일 만기 · 평균 +4.35%':mode==='best01'?'D+1 시초가 매도 · 비용후 +0.79%/거래 · 모든 연도+ · 자본25% 분산 시 연 +28%':'등락 15-29% · 거래대금≥50억'}>
{(<div style={{fontSize:11,color:_T.sub,fontWeight:500,lineHeight:1.6,padding:'8px 10px',background:_T.linelt,borderRadius:8,marginBottom:10,letterSpacing:'-0.2px'}}>
{mode==='leader'&&(<>
  · 등락률 +10% ~ +28%<br/>
  · 거래대금 <b style={{color:_T.text}}>500억 이상</b><br/>
  · 시장별 (KOSPI/KOSDAQ) <b style={{color:_T.text}}>≥3건 발화</b> 시 등락률 1,2,3등 추출<br/>
  · 베팅 가중: <b style={{color:_T.text}}>1등 50% / 2등 33.5% / 3등 16.5%</b><br/>
  · 청산: <b style={{color:_T.text}}>D+1 시초가 매도</b> · 분봉 데이터 누적 후 트레일링 검증 예정
</>)}
{mode==='neo25'&&(<>
  · 등락률 +15% ~ +29%<br/>
  · 거래대금 <b style={{color:_T.text}}>5,000억 이상 (대장주)</b><br/>
  · 수급 <b style={{color:_T.text}}>기관 또는 기관+외인</b><br/>
  · 점수 <b style={{color:_T.text}}>3점 이상</b> + 120일 신고가<br/>
  · 청산: <b style={{color:_T.text}}>+25% 즉시 익절 / 25일 만기</b>
</>)}
{mode==='neo90'&&(<>
  · 등락률 +15% ~ +29%<br/>
  · 거래대금 <b style={{color:_T.text}}>50억 이상</b><br/>
  · 수급 <b style={{color:_T.text}}>기만 / 기+외 / 외만</b> (둘다- 제외)<br/>
  · 등급 <b style={{color:_T.text}}>침착해 S/S+ 또는 하승훈 A+</b><br/>
  · 청산: <b style={{color:_T.text}}>+5% 도달 후 트레일링 -3%</b> (peak × 0.97)<br/>
  · <b style={{color:_T.text}}>15일 만기 강제 청산 / 손절 없음</b>
</>)}
{mode==='best01'&&(<>
  · 시초가 매도 시나리오 — D당일 종가 매수 → D+1 시초가 매도<br/>
  · <b style={{color:'#f59e0b'}}>A</b>: 2등 + 기+외만 + 1000억+ + 120일신고 + 등락 15-28%<br/>
  · <b style={{color:'#f59e0b'}}>B</b>: 2등 + 기관/기+외 + 500억+ + 점수3+ + 120일신고 + 등락 15-28%<br/>
  · <b style={{color:'#f59e0b'}}>C</b>: 1+2등 + 기관/기+외 + 500억+ + 점수3+ + 60일신고 + 등락 15-28%<br/>
  · 합집합 759건 / 5년 모두 양수 / 22년 +0.29% / 분산 효과로 안정도 ↑
</>)}
</div>)}
{/* 연도 필터 — 모든 모드에서 표시 */}
<div style={{display:'flex',background:_T.bg,borderRadius:10,padding:3,gap:1,marginBottom:0}}>
{_yrs.map(y=>{const isActive=y.id==='all'?yf.length===0:yf.includes(y.id);return(<Seg key={y.id} active={isActive} onClick={()=>toggleYr(y.id)}>{y.l}</Seg>);})}
</div>
</Card>
{exitStats&&(()=>{
  const items=[
    {l:'시초가',k:'open',col:'#1f6dee'},
    {l:'종가',k:'close',col:'#0d8050'},
    {l:'트레일',k:'trail',col:'#a855f7'}
  ];
  const best=Math.max(...items.map(x=>exitStats[x.k].avg));
  return(<div style={{background:_T.card,borderRadius:14,padding:'14px 16px',marginBottom:10,color:_T.text,border:'1px solid '+_T.line}}>
    <div style={{fontSize:12,fontWeight:700,color:_T.text,marginBottom:8,letterSpacing:'-0.3px',display:'flex',alignItems:'baseline',gap:8}}>
      📊 청산룰 평균 비교
      <span style={{fontSize:10,color:_T.hint,fontWeight:500}}>{exitStats.n}건 기준</span>
    </div>
    <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:8}}>
      {items.map(x=>{
        const d=exitStats[x.k];
        const isBest=Math.abs(d.avg-best)<0.001;
        return(<div key={x.k} style={{padding:'10px 8px',borderRadius:9,background:_T.bg,border:'1px solid '+(isBest?x.col:_T.line),textAlign:'center'}}>
          <div style={{fontSize:10,fontWeight:700,color:x.col,letterSpacing:'-0.2px',marginBottom:4}}>{x.l}{isBest&&' ★'}</div>
          <div style={{fontSize:18,fontWeight:800,color:d.avg>=0?_T.up:_T.down,letterSpacing:'-0.3px'}}>{d.avg>=0?'+':''}{d.avg.toFixed(2)}%</div>
          <div style={{fontSize:9,color:_T.sub,fontWeight:600,marginTop:2}}>승률 {d.winRate.toFixed(0)}%</div>
        </div>);
      })}
    </div>
  </div>);
})()}
{leaderStats&&(<div style={{background:_T.card,borderRadius:14,padding:'16px 18px',marginBottom:10,color:_T.text,border:'1px solid '+_T.line}}>
<div style={{fontSize:12,fontWeight:700,color:'#a855f7',marginBottom:10,letterSpacing:'-0.3px'}}>📈 랭크별 통계 (1,2,3등주)</div>
<div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:8,marginBottom:12}}>
{[{rank:1,col:'#dc2626',d:leaderStats.r1},{rank:2,col:'#f59e0b',d:leaderStats.r2},{rank:3,col:'#10b981',d:leaderStats.r3}].map(x=>(
<div key={x.rank} style={{padding:'10px',borderRadius:10,background:_T.bg,border:'1px solid '+_T.line,textAlign:'center'}}>
  <div style={{display:'inline-block',padding:'2px 8px',borderRadius:5,background:x.col,color:'#fff',fontSize:10,fontWeight:900,marginBottom:6}}>{x.rank}등</div>
  <div style={{fontSize:18,fontWeight:800,color:x.d.avg>=0?_T.up:_T.down,letterSpacing:'-0.3px'}}>{x.d.avg>=0?'+':''}{x.d.avg.toFixed(2)}%</div>
  <div style={{fontSize:10,color:_T.sub,marginTop:3}}>n={x.d.n} · 익절 {x.d.winRate.toFixed(0)}%</div>
</div>))}
</div>
<div style={{display:'flex',padding:'10px 12px',background:_T.linelt,borderRadius:8,gap:14,alignItems:'baseline'}}>
<div style={{fontSize:11,color:_T.hint,fontWeight:600}}>이벤트 가중평균</div>
<div style={{fontSize:18,fontWeight:800,color:leaderStats.wAvg>=0?_T.up:_T.down,letterSpacing:'-0.3px'}}>{leaderStats.wAvg>=0?'+':''}{leaderStats.wAvg.toFixed(2)}%</div>
<div style={{fontSize:10,color:_T.sub,marginLeft:'auto'}}>{leaderStats.events}이벤트 · 0.5×1등 + 0.335×2등 + 0.165×3등</div>
</div>
</div>)}
{best01Stats&&(<div style={{background:_T.card,borderRadius:14,padding:'16px 18px',marginBottom:10,color:_T.text,border:'1px solid '+_T.line}}>
<div style={{fontSize:13,fontWeight:800,color:'#f59e0b',letterSpacing:'-0.3px',marginBottom:10}}>📊 최고조합01 — 청산 3가지 종합 비교 (n={best01Stats.n})</div>
{/* 3가지 청산 전체 평균 비교 */}
<div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:8,marginBottom:12}}>
{[
  {k:'open',l:'시초가 매도',sub:'D+1 시가',col:'#1f6dee',allPos:best01Stats.allPosOpen},
  {k:'close',l:'종가 매도',sub:'D+1 종가',col:'#0d8050',allPos:best01Stats.allPosClose},
  {k:'trail',l:'트레일 -3%',sub:'5%후 / 15일',col:'#a855f7',allPos:best01Stats.allPosTrail}
].map(x=>{const d=best01Stats[x.k];if(!d)return null;
  return(<div key={x.k} style={{padding:'10px',borderRadius:10,background:_T.bg,border:'1px solid '+x.col,textAlign:'center'}}>
    <div style={{display:'flex',alignItems:'center',justifyContent:'center',gap:5}}>
      <span style={{fontSize:11,fontWeight:800,color:x.col,letterSpacing:'-0.2px'}}>{x.l}</span>
      {x.allPos&&<span style={{fontSize:9,color:'#10b981',fontWeight:800}}>✅</span>}
    </div>
    <div style={{fontSize:9,color:_T.sub,fontWeight:600,marginTop:1}}>{x.sub}</div>
    <div style={{fontSize:18,fontWeight:800,color:d.adjAvg>=0?_T.up:_T.down,letterSpacing:'-0.3px',marginTop:5}}>{d.adjAvg>=0?'+':''}{d.adjAvg.toFixed(2)}%</div>
    <div style={{fontSize:9,color:_T.hint,fontWeight:600,marginTop:1}}>비용차감 (원평균 +{d.avg.toFixed(2)}%)</div>
    <div style={{fontSize:10,color:_T.body,fontWeight:600,marginTop:4}}>익절 {d.winRate.toFixed(0)}% · 손익비 {d.ratio.toFixed(2)}</div>
    <div style={{fontSize:9,color:d.cumAdj>=0?_T.up:_T.down,fontWeight:700,marginTop:2}}>5년누적 {d.cumAdj>=0?'+':''}{d.cumAdj.toFixed(0)}%</div>
  </div>);
})}
</div>
{/* 연도별 × 청산 비교 표 */}
<div style={{padding:'10px 12px',background:_T.linelt,borderRadius:8,marginBottom:10}}>
<div style={{fontSize:10,fontWeight:700,color:_T.hint,marginBottom:6,letterSpacing:'-0.2px'}}>연도별 × 청산 (비용 차감 후 평균)</div>
<div style={{fontSize:11,fontWeight:600}}>
<div style={{display:'grid',gridTemplateColumns:'42px repeat(6,1fr) 50px',gap:4,fontSize:10,fontWeight:700,color:_T.hint,marginBottom:4,padding:'0 2px'}}>
  <span></span>{best01Stats.yrAvgs.map(yr=>(<span key={yr.y} style={{textAlign:'center'}}>20{yr.y}</span>))}<span style={{textAlign:'right',color:_T.text}}>n</span>
</div>
{[
  {k:'open',l:'시초가',col:'#1f6dee'},
  {k:'close',l:'종가',col:'#0d8050'},
  {k:'trail',l:'트레일',col:'#a855f7'}
].map(row=>(
  <div key={row.k} style={{display:'grid',gridTemplateColumns:'42px repeat(6,1fr) 50px',gap:4,padding:'5px 2px',borderTop:'1px solid '+_T.line,alignItems:'center'}}>
    <span style={{fontSize:11,fontWeight:800,color:row.col,letterSpacing:'-0.2px'}}>{row.l}</span>
    {best01Stats.yrAvgs.map(yr=>{
      const d=yr[row.k];if(!d)return <span key={yr.y}>—</span>;
      const v=d.adjAvg;
      return(<span key={yr.y} style={{textAlign:'center',fontSize:11,fontWeight:700,color:v>=0?_T.up:_T.down,letterSpacing:'-0.2px'}}>{v>=0?'+':''}{v.toFixed(2)}%</span>);
    })}
    <span style={{textAlign:'right',fontSize:10,color:_T.sub,fontWeight:600}}>{best01Stats[row.k]?.n||0}</span>
  </div>
))}
</div>
</div>
{/* tier 분포 */}
<div style={{padding:'10px 12px',background:_T.linelt,borderRadius:8}}>
<div style={{fontSize:10,fontWeight:700,color:_T.hint,marginBottom:5,letterSpacing:'-0.2px'}}>Tier 분포 (어느 룰에 속하는지)</div>
<div style={{display:'flex',gap:8,flexWrap:'wrap',fontSize:11,fontWeight:600,color:_T.body}}>
{best01Stats.tiers.ABC>0&&<span><span style={{color:'#dc2626',fontWeight:800}}>🥇 A∩B∩C</span> {best01Stats.tiers.ABC}</span>}
{(best01Stats.tiers.AB+best01Stats.tiers.AC)>0&&<span><span style={{color:'#ea580c',fontWeight:800}}>🥈 둘 만족</span> {best01Stats.tiers.AB+best01Stats.tiers.AC}</span>}
{best01Stats.tiers.BC>0&&<span><span style={{color:'#f59e0b',fontWeight:800}}>B∩C</span> {best01Stats.tiers.BC}</span>}
{best01Stats.tiers.A>0&&<span><span style={{color:'#a855f7',fontWeight:800}}>A only</span> {best01Stats.tiers.A}</span>}
{best01Stats.tiers.B>0&&<span><span style={{color:'#1f6dee',fontWeight:800}}>B only</span> {best01Stats.tiers.B}</span>}
{best01Stats.tiers.C>0&&<span><span style={{color:'#10b981',fontWeight:800}}>🥉 C only</span> {best01Stats.tiers.C}</span>}
</div>
</div>
{/* 트레일링 검증 안내 */}
<div style={{marginTop:10,padding:'10px 12px',background:'rgba(168,85,247,0.10)',border:'1px solid #a855f7',borderRadius:8}}>
<div style={{fontSize:11,fontWeight:800,color:'#a855f7',marginBottom:4,letterSpacing:'-0.2px'}}>📡 트레일링 검증 데이터 누적 중</div>
<div style={{fontSize:10,color:_T.body,fontWeight:500,lineHeight:1.6,letterSpacing:'-0.2px'}}>
  · KIS 1분봉 자동 수집 (장 마감 5분 후 cron) → <code style={{background:_T.bg,padding:'1px 5px',borderRadius:3,fontSize:9}}>data/intraday/&#123;date&#125;.json</code><br/>
  · 일봉 종가 기준 트레일링은 보수적 추정 — <b>분봉 누적 후 시간대별 트레일 정확 검증 예정</b><br/>
  · 위 트레일 통계는 <b>일봉 OHLC 기반 시뮬</b> (실제 분봉 트레일은 더 빠른 익절/손절 가능)
</div>
</div>
</div>)}
{stats&&(<div style={{background:_T.card,borderRadius:14,padding:'18px',marginBottom:10,color:_T.text,border:'1px solid '+_T.line}}>
<div style={{display:'flex',marginBottom:14}}>
<div style={{flex:1}}><div style={{fontSize:11,color:_T.hint,marginBottom:6,letterSpacing:'-0.2px',fontWeight:600}}>총 건수 {yf.length>0?'('+yf.join('+')+'년)':'(전체)'}</div><div style={{fontSize:24,fontWeight:800,letterSpacing:'-0.5px',color:_T.text}}>{stats.n.toLocaleString()}<span style={{fontSize:12,fontWeight:500,color:_T.sub,marginLeft:2}}>건</span></div></div>
<div style={{flex:1,borderLeft:'1px solid '+_T.line,paddingLeft:14}}><div style={{fontSize:11,color:_T.hint,marginBottom:6,letterSpacing:'-0.2px',fontWeight:600}}>익절률</div><div style={{fontSize:24,fontWeight:800,letterSpacing:'-0.5px',color:_T.up}}>{stats.winRate.toFixed(1)}<span style={{fontSize:12,fontWeight:500,opacity:0.8,marginLeft:2}}>%</span></div></div>
<div style={{flex:1,borderLeft:'1px solid '+_T.line,paddingLeft:14}}><div style={{fontSize:11,color:_T.hint,marginBottom:6,letterSpacing:'-0.2px',fontWeight:600}}>평균 수익</div><div style={{fontSize:24,fontWeight:800,letterSpacing:'-0.5px',color:stats.avg>=0?_T.up:_T.down}}>{stats.avg>=0?'+':''}{stats.avg.toFixed(2)}<span style={{fontSize:12,fontWeight:500,opacity:0.8,marginLeft:2}}>%</span></div></div>
</div>
{/* 결과 분류 — 익절 / 손절 (단순) */}
<div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8,marginBottom:12}}>
{[
  {k:'win',l:'익절',sub:'+1% 이상',col:'#dc2626',n:stats.cnt.win,avg:stats.avgWin},
  {k:'sl',l:'손절',sub:'-1% 이상',col:'#1f6dee',n:stats.cnt.sl,avg:stats.avgSL}
].map(x=>{
  const pct=stats.realN?x.n/stats.realN*100:0;
  return(<div key={x.k} style={{padding:'12px 14px',borderRadius:10,background:_T.bg,border:'1px solid '+(x.n>0?x.col:_T.line)}}>
    <div style={{display:'flex',alignItems:'baseline',justifyContent:'space-between',marginBottom:6}}>
      <span style={{fontSize:12,fontWeight:800,color:x.col,letterSpacing:'-0.2px'}}>{x.l}</span>
      <span style={{fontSize:10,color:_T.hint,fontWeight:600}}>{x.sub}</span>
    </div>
    <div style={{display:'flex',alignItems:'baseline',gap:6}}>
      <span style={{fontSize:22,fontWeight:800,color:_T.text,letterSpacing:'-0.3px'}}>{x.n}</span>
      <span style={{fontSize:11,color:_T.sub,fontWeight:600}}>건 ({pct.toFixed(1)}%)</span>
    </div>
    {x.n>0&&<div style={{fontSize:11,color:x.avg>=0?_T.up:_T.down,fontWeight:700,marginTop:3,letterSpacing:'-0.2px'}}>평균 {x.avg>=0?'+':''}{x.avg.toFixed(2)}%</div>}
  </div>);
})}
</div>
{(stats.cnt.flat>0||stats.cnt.live>0)&&(<div style={{padding:'8px 12px',background:_T.linelt,borderRadius:8,marginBottom:12,fontSize:11,color:_T.body,fontWeight:600,letterSpacing:'-0.2px',display:'flex',gap:14,flexWrap:'wrap',alignItems:'center'}}>
  {stats.cnt.flat>0&&<span>📭 무사통과(±1%): <b>{stats.cnt.flat}</b>건 ({(stats.cnt.flat/stats.realN*100).toFixed(1)}%) · 평균 {stats.avgFlat>=0?'+':''}{stats.avgFlat.toFixed(2)}%</span>}
  {stats.cnt.live>0&&<span style={{color:'#f59e0b'}}>📡 진행중: <b>{stats.cnt.live}</b>건</span>}
  {stats.ratio>0&&<span style={{marginLeft:'auto',color:_T.text,fontWeight:700}}>손익비 <b>{stats.ratio.toFixed(2)}</b></span>}
</div>)}
<div style={{height:1,background:_T.line,margin:'0 -18px 16px'}}/>
<div style={{fontSize:11,color:_T.hint,marginBottom:8,letterSpacing:'-0.2px',fontWeight:600}}>1건당 투자금</div>
<div style={{display:'flex',alignItems:'center',gap:8,marginBottom:8}}>
<input type="number" value={invAmt} onChange={e=>setInvAmt(+e.target.value||0)} step="100000" style={{flex:1,padding:'10px 12px',border:'1px solid '+_T.line,borderRadius:9,fontSize:14,fontWeight:700,color:_T.text,background:_T.bg,outline:'none',letterSpacing:'-0.3px'}}/>
<span style={{fontSize:13,color:_T.sub,fontWeight:600}}>원</span>
</div>
<div style={{display:'flex',gap:5,marginBottom:16,flexWrap:'wrap'}}>
{_amtPresets.map(a=>(<button key={a} onClick={()=>setInvAmt(a)} style={{padding:'6px 12px',borderRadius:18,border:'1px solid '+(invAmt===a?_T.accent:_T.line),background:invAmt===a?_T.accent:'transparent',color:invAmt===a?'#fff':_T.body,fontSize:11,fontWeight:700,cursor:'pointer',letterSpacing:'-0.2px',transition:'all .15s'}}>{_man(a)}원</button>))}
</div>
<div style={{display:'flex'}}>
<div style={{flex:1}}><div style={{fontSize:11,color:_T.hint,marginBottom:6,letterSpacing:'-0.2px',fontWeight:600}}>총 투입</div><div style={{fontSize:18,fontWeight:800,letterSpacing:'-0.4px',color:_T.text}}>{_man(stats.totalInvest)}<span style={{fontSize:11,fontWeight:500,color:_T.sub,marginLeft:2}}>원</span></div></div>
<div style={{flex:1,borderLeft:'1px solid '+_T.line,paddingLeft:14}}><div style={{fontSize:11,color:_T.hint,marginBottom:6,letterSpacing:'-0.2px',fontWeight:600}}>총 손익</div><div style={{fontSize:18,fontWeight:800,letterSpacing:'-0.4px',color:stats.totalPnl>=0?_T.up:_T.down}}>{stats.totalPnl>=0?'+':''}{_man(Math.abs(stats.totalPnl))}<span style={{fontSize:11,fontWeight:500,opacity:0.8,marginLeft:2}}>원</span></div></div>
<div style={{flex:1,borderLeft:'1px solid '+_T.line,paddingLeft:14}}><div style={{fontSize:11,color:_T.hint,marginBottom:6,letterSpacing:'-0.2px',fontWeight:600}}>수익률</div><div style={{fontSize:18,fontWeight:800,letterSpacing:'-0.4px',color:stats.ret>=0?_T.up:_T.down}}>{stats.ret>=0?'+':''}{stats.ret.toFixed(2)}<span style={{fontSize:11,fontWeight:500,opacity:0.8,marginLeft:2}}>%</span></div></div>
</div>
</div>)}
<div style={{display:'flex',background:_T.card,border:'1px solid '+_T.line,borderRadius:10,padding:3,marginBottom:10}}>
{_sorts.map(s=>(<Seg key={s.id} active={sortMode===s.id} onClick={()=>setSortMode(s.id)}>{s.l}</Seg>))}
</div>
{/* 종목 리스트 — 카드형 (라이브 신호 포함) */}
<div style={{background:_T.card,borderRadius:14,border:'1px solid '+_T.line,overflow:'hidden'}}>
<div style={{maxHeight:'62vh',overflowY:'auto'}}>
{filtered.slice(0,300).map((r,i)=>{
const won=Math.round(invAmt*((r.t||0)/100));
const sLbl=_supLabel(r.iv);
// 모드별 표시 익절가 — 7%/25%/90% 모드는 모드 룰, 맞춤은 historical 등급별 tp1/tp2
let tp1=r.tp1||0, tp2=r.tp2||0;
if(mode==='neo25'){tp1=25;tp2=50;}
else if(mode==='neo90'||mode==='best01'||mode==='leader'){tp1=5;tp2=0;}
// 도달일 재계산 (OHLC에서 모드 익절가 기준)
const _calcReach=(target)=>{if(!r.ohlc||!r.ohlc.length)return null;for(let i=0;i<Math.min(r.ohlc.length,25);i++){if((+r.ohlc[i].h||0)>=target)return i+1;}return null;};
let tp1Reached, tp2Reached, tp1dy, tp2dy, tp1d, tp2d;
if(mode==='neo25'){
  const d1=_calcReach(tp1);tp1Reached=d1!=null;tp1dy=d1||0;tp1d=d1!=null&&r.ohlc?r.ohlc[d1-1].d:'';
  const d2=_calcReach(tp2);tp2Reached=d2!=null;tp2dy=d2||0;tp2d=d2!=null&&r.ohlc?r.ohlc[d2-1].d:'';
}else if(mode==='neo90'||mode==='best01'||mode==='leader'){
  // simNeo90 결과 활용
  tp1Reached=!!(r.tp1d&&r.tp1dy);tp1dy=r.tp1dy||0;tp1d=r.tp1d||'';
  tp2Reached=false;tp2dy=0;tp2d='';
}else{
  tp1Reached=!!(r.tp1d&&r.tp1dy);tp2Reached=!!(r.tp2d&&r.tp2dy)||r.r==='BOTH'||r.r==='TP2';
  tp1dy=r.tp1dy||0;tp2dy=r.tp2dy||0;tp1d=r.tp1d||'';tp2d=r.tp2d||'';
}
const _profit=(r.t||0);
// 모드별 익절 표시: 90%/옵션B/네오테마 모드는 단일, 25%는 1차/2차 분리
const _showSingle=mode==='neo90'||mode==='best01'||mode==='leader';
// 대장주 랭크 배지 색상
const _rankCol=r._rank===1?'#dc2626':r._rank===2?'#f59e0b':r._rank===3?'#10b981':null;
return(<div key={i} onClick={()=>onRowClick&&onRowClick(r)} style={{cursor:'pointer',padding:'18px 20px',borderTop:i?'1px solid '+_T.line:'none',transition:'all .12s'}} onMouseEnter={(e)=>e.currentTarget.style.background=_T.cardHov} onMouseLeave={(e)=>e.currentTarget.style.background='transparent'}>
{/* 1행: 종목명 (큼) + 수급/LIVE + 우측 진행중/결과 */}
<div style={{display:'flex',justifyContent:'space-between',alignItems:'center',gap:10,marginBottom:12}}>
<div style={{flex:1,minWidth:0,display:'flex',alignItems:'center',gap:8,flexWrap:'wrap'}}>
{_rankCol&&<span style={{fontSize:11,fontWeight:900,color:'#fff',background:_rankCol,padding:'3px 9px',borderRadius:5,letterSpacing:'-0.2px',minWidth:32,textAlign:'center'}}>{r._rank}등</span>}
{_rankCol&&r._mktLabel&&<span style={{fontSize:10,fontWeight:700,color:_T.body,background:_T.linelt,padding:'3px 7px',borderRadius:4,letterSpacing:'-0.2px'}}>{r._mktLabel}</span>}
{r._tierLabel&&<span style={{fontSize:10,fontWeight:800,color:'#fff',background:r._tierCol,padding:'3px 8px',borderRadius:4,letterSpacing:'-0.2px'}}>{r._tierLabel}</span>}
<span style={{fontSize:19,fontWeight:800,color:_T.text,letterSpacing:'-0.4px'}}>{r.n}</span>
<span style={{fontSize:11,fontWeight:700,color:'#fff',background:_supColor(sLbl),padding:'3px 9px',borderRadius:5,letterSpacing:'-0.2px'}}>{sLbl}</span>
{r._isLive&&<span style={{fontSize:10,fontWeight:800,color:'#fff',background:'#f59e0b',padding:'3px 8px',borderRadius:4,letterSpacing:'-0.2px'}}>📡 LIVE</span>}
{r._isLive&&r.maAlign===1&&<span style={{fontSize:10,fontWeight:700,color:'#fff',background:'#10b981',padding:'3px 7px',borderRadius:4,letterSpacing:'-0.2px'}} title="MA5 > MA20 > MA60">📈 MA정배열</span>}
{r._isLive&&Math.abs(+r.cum5||0)>=1&&<span style={{fontSize:10,fontWeight:700,color:(+r.cum5||0)>=0?'#dc2626':'#2563eb',background:_T.linelt,padding:'3px 7px',borderRadius:4,letterSpacing:'-0.2px'}} title="5일 누적 등락률">5일 {(+r.cum5||0)>=0?'+':''}{(+r.cum5||0).toFixed(1)}%</span>}
</div>
{!r._isLive&&<span style={{fontWeight:800,color:_resCol(r.r),fontSize:13,padding:'4px 10px',background:_T.bg,borderRadius:6,border:'1px solid '+_T.line}}>{_resLbl(r.r)}</span>}
{r._isLive&&<span style={{fontSize:13,fontWeight:800,color:'#f59e0b',padding:'4px 10px',background:'rgba(245,158,11,0.12)',borderRadius:6,border:'1px solid rgba(245,158,11,0.35)'}}>진행중</span>}
</div>
{/* 2행: 기본 정보 — 폰트 키움 */}
<div style={{display:'flex',gap:10,fontSize:12,color:_T.body,fontWeight:600,marginBottom:12,flexWrap:'wrap',alignItems:'baseline'}}>
<span><b style={{color:_T.text,fontSize:13}}>{r.mc}</b></span>
<span style={{color:_T.mute}}>·</span>
<span style={{color:_T.sub}}>당일 <b style={{color:_T.body}}>+{r.ch}%</b></span>
<span style={{color:_T.mute}}>·</span>
<span style={{color:_T.sub}}>📅 매수 <b style={{color:_T.body}}>{r.d?r.d.slice(2):'—'}</b></span>
<span style={{color:_T.mute}}>·</span>
<span style={{color:_T.sub}}>청산 <b style={{color:_T.body}}>{r.exd||'—'}</b></span>
<span style={{color:_T.mute}}>·</span>
<span style={{color:_T.sub}}>소요 <b style={{color:_T.body}}>{r.exdy?r.exdy+'일':'—'}</b></span>
</div>
{/* 3행: 익절 정보 — 모드별 분기 */}
{_showSingle?(
  // 7%/90% 모드: 단일 익절 + 최종수익
  <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8,padding:'12px 14px',background:_T.bg,borderRadius:10,border:'1px solid '+_T.line}}>
    <div style={{textAlign:'center',borderRight:'1px solid '+_T.line,paddingRight:8}}>
      <div style={{fontSize:10,color:_T.hint,fontWeight:600,marginBottom:5,letterSpacing:'-0.2px'}}>{mode==='leader'||mode==='best01'?`D+1 시초가 매도`:mode==='neo90'?`5% 도달 후 트레일`:`익절 도달 (+${tp1}%)`}</div>
      {tp1Reached?<div><div style={{fontSize:15,fontWeight:800,color:_T.up,letterSpacing:'-0.3px'}}>D+{tp1dy}일 <span style={{fontSize:10,color:_T.sub,fontWeight:600,marginLeft:3}}>{tp1d}</span></div>{(mode==='neo90')&&r._peak>0&&<div style={{fontSize:10,color:_T.sub,fontWeight:600,marginTop:2}}>peak +{r._peak.toFixed(1)}%</div>}</div>:<div style={{fontSize:13,fontWeight:700,color:_T.mute}}>{mode==='leader'||mode==='best01'?'대기':mode==='neo90'?'5% 미도달':'미도달'}</div>}
    </div>
    <div style={{textAlign:'center'}}>
      <div style={{fontSize:10,color:_T.hint,fontWeight:600,marginBottom:5,letterSpacing:'-0.2px'}}>최종 수익</div>
      {r._isLive?<div style={{fontSize:14,fontWeight:800,color:'#f59e0b'}}>진행중</div>:(<>
      <div style={{fontSize:16,fontWeight:800,color:_profit>=0?_T.up:_T.down,letterSpacing:'-0.3px'}}>{_profit>=0?'+':''}{_profit.toFixed(1)}%</div>
      <div style={{fontSize:10,color:_T.sub,fontWeight:600,marginTop:2}}>{won>=0?'+':''}{_man(Math.abs(won))}원</div>
      </>)}
    </div>
  </div>
):(
  // 25%/맞춤 모드: 1차/2차/최종
  <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:8,padding:'12px 14px',background:_T.bg,borderRadius:10,border:'1px solid '+_T.line}}>
    <div style={{textAlign:'center',borderRight:'1px solid '+_T.line,paddingRight:6}}>
      <div style={{fontSize:10,color:_T.hint,fontWeight:600,marginBottom:5,letterSpacing:'-0.2px'}}>1차 (+{tp1}%)</div>
      {tp1Reached?<div><div style={{fontSize:15,fontWeight:800,color:_T.up,letterSpacing:'-0.3px',lineHeight:1.1}}>D+{tp1dy}일</div><div style={{fontSize:9,color:_T.sub,fontWeight:600,marginTop:3}}>{tp1d}</div></div>:<div style={{fontSize:13,fontWeight:700,color:_T.mute,lineHeight:1.4}}>미도달</div>}
    </div>
    <div style={{textAlign:'center',borderRight:'1px solid '+_T.line,paddingRight:6}}>
      <div style={{fontSize:10,color:_T.hint,fontWeight:600,marginBottom:5,letterSpacing:'-0.2px'}}>2차 (+{tp2}%)</div>
      {tp2Reached?<div><div style={{fontSize:15,fontWeight:800,color:_T.up,letterSpacing:'-0.3px',lineHeight:1.1}}>{tp2dy?'D+'+tp2dy+'일':'도달'}</div>{tp2d&&<div style={{fontSize:9,color:_T.sub,fontWeight:600,marginTop:3}}>{tp2d}</div>}</div>:<div style={{fontSize:13,fontWeight:700,color:_T.mute,lineHeight:1.4}}>미도달</div>}
    </div>
    <div style={{textAlign:'center'}}>
      <div style={{fontSize:10,color:_T.hint,fontWeight:600,marginBottom:5,letterSpacing:'-0.2px'}}>최종 수익</div>
      {r._isLive?<div style={{fontSize:14,fontWeight:800,color:'#f59e0b'}}>진행중</div>:(<>
      <div style={{fontSize:15,fontWeight:800,color:_profit>=0?_T.up:_T.down,letterSpacing:'-0.3px',lineHeight:1.1}}>{_profit>=0?'+':''}{_profit.toFixed(1)}%</div>
      <div style={{fontSize:9,color:_T.sub,fontWeight:600,marginTop:3}}>{won>=0?'+':''}{_man(Math.abs(won))}원</div>
      </>)}
    </div>
  </div>
)}
{/* 3-way 청산 비교 (시초가 / 종가 / 트레일) — 모든 모드 공통 */}
{!r._isLive&&(()=>{
  const cmp=_compareExits(r.ohlc);
  if(cmp.open===null&&cmp.close===null&&cmp.trail===null)return null;
  const vals=[
    {l:'시초가',v:cmp.open,sub:'D+1 시가'},
    {l:'종가',v:cmp.close,sub:'D+1 종가'},
    {l:'트레일',v:cmp.trail,sub:cmp.trailDays?'D+'+cmp.trailDays+'일':'15일 만기'}
  ];
  const valid=vals.filter(x=>x.v!=null).map(x=>x.v);
  const best=valid.length?Math.max(...valid):null;
  return(<div style={{marginTop:8,padding:'10px 12px',background:_T.linelt,borderRadius:9,border:'1px solid '+_T.line}}>
    <div style={{fontSize:10,fontWeight:700,color:_T.hint,marginBottom:6,letterSpacing:'-0.2px'}}>📊 청산 비교</div>
    <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:6}}>
      {vals.map((x,j)=>{
        const isBest=x.v!=null&&x.v===best;
        const col=x.v==null?_T.mute:x.v>=0?_T.up:_T.down;
        return(<div key={j} style={{textAlign:'center',padding:'6px 4px',borderRadius:7,background:isBest?(_T.text==='#e6edf3'?'rgba(168,85,247,0.18)':'rgba(168,85,247,0.10)'):'transparent',border:'1px solid '+(isBest?'#a855f7':'transparent')}}>
          <div style={{fontSize:9,color:isBest?'#a855f7':_T.hint,fontWeight:isBest?800:600,letterSpacing:'-0.2px'}}>{x.l}{isBest&&' ★'}</div>
          <div style={{fontSize:13,fontWeight:800,color:col,letterSpacing:'-0.3px',marginTop:2}}>{x.v==null?'—':(x.v>=0?'+':'')+x.v.toFixed(1)+'%'}</div>
          <div style={{fontSize:8,color:_T.sub,fontWeight:600,marginTop:1}}>{x.sub}</div>
        </div>);
      })}
    </div>
  </div>);
})()}
</div>);})}
</div>
{filtered.length>300&&(<div style={{padding:'12px',textAlign:'center',color:_T.mute,fontSize:11,borderTop:'1px solid '+_T.line,background:_T.linelt}}>상위 300건만 표시 · 전체 {filtered.length.toLocaleString()}건</div>)}
{!filtered.length&&(<div style={{padding:'40px 20px',textAlign:'center',color:_T.mute,fontSize:13}}>조건 충족 종목 없음</div>)}
</div>
</div>);
}


function TodaySignals({onSignalsLoaded,onSignalClick,theme="dark"}){
const [data,setData]=useState(null);
const [loading,setLoading]=useState(false);
const [err,setErr]=useState(null);
const [saving,setSaving]=useState(false);
const [saveMsg,setSaveMsg]=useState(null);
// 종배 단일 확정안 (5년 4개월 백테스트 기반)
// 진입: 등락 15-29% + 거래대금 100억+ + 수급 기관/기+외 + 점수3+ + 120일 신고가
// 청산: +7% 도달시 100% 즉시 익절 / 25일 만기 강제 청산 / 손절 없음
// 성과: 평균 +1.42% / 익절 78.6% / 모든 연도 양수 / 일평균 1.26개
const _normMkt=(m)=>(m==="KOSDAQ"||m==="KQ"||m==="코스닥")?"KO":(m==="KOSPI"||m==="KS"||m==="코스피")?"KS":m;
const _qualifySupply=(inv)=>inv==="기관"||inv==="기만"||inv==="기+외"||inv==="외+기"||inv==="외만"||inv==="외인";
const _supplyLabel=(inv)=>{
  if(inv==="기관"||inv==="기만")return "기관";
  if(inv==="기+외"||inv==="외+기")return "외+기";
  if(inv==="외만"||inv==="외인")return "외인";
  return inv||"없음";
};
const _qualifyInst=(inv)=>inv==="기관"||inv==="기만"||inv==="기+외"||inv==="외+기";
// 테마 1,2,3등 추출 — 시장별 ≥3건 발화 시 등락률 1,2,3등 선정
// 진입 조건: 거래대금 500억+ / 등락률 10-28% / 같은 시장 ≥3건 동시 발화
const _classifyLeaders=(allSignals)=>{
  if(!allSignals||!allSignals.length)return [];
  // 라이브 (rate/vol) 와 API_URL (change/amount) 양쪽 호환
  const _ch=(s)=>+s.change||+s.rate||0;
  const _am=(s)=>+s.amount||+s.vol||0;
  const filt=allSignals.filter(s=>{
    const ch=_ch(s),amt=_am(s);
    return ch>=10&&ch<28&&amt>=500;
  });
  const byMkt={KOSPI:[],KOSDAQ:[]};
  for(const s of filt){
    const mkt=_normMkt(s.market||"");
    if(mkt==="KS")byMkt.KOSPI.push(s);
    else if(mkt==="KO")byMkt.KOSDAQ.push(s);
  }
  const out=[];
  for(const mk of ["KOSPI","KOSDAQ"]){
    if(byMkt[mk].length>=3){
      const sorted=[...byMkt[mk]].sort((a,b)=>_ch(b)-_ch(a));
      sorted.slice(0,3).forEach((s,i)=>{
        // change/amount 정규화 (라이브 데이터는 rate/vol만 있음)
        const norm={...s,change:_ch(s),amount:_am(s),_rank:i+1,_mktLabel:mk};
        out.push(norm);
      });
    }
  }
  return out;
};
const _LEADER_WEIGHTS=[0.50,0.335,0.165]; // 1등 50% / 2등 33.5% / 3등 16.5%
const _classify=(s)=>{
  const ch=+s.change||0, amt=+s.amount||0, px=+s.price||0;
  const inv=s.investor||"", mkt=_normMkt(s.market||""), wk=+s.wick||0;
  const sc=+s.score||0;
  const h60=+s.h60||0, h120=+s.h120||0;
  const cc=calcChimchakhaeScore({change:ch,amount:amt,investor:inv,market:mkt,wick:wk});
  const hs=calcHaseunghoonScore({change:ch,amount:amt,investor:inv,market:mkt,wick:wk,breakType:""});
  // 진입 조건 미통과 사유 (네오 25% base)
  const reasons=[];
  if(!(ch>=15&&ch<29))reasons.push(ch<15?`등락 ${ch}% (15% 미달)`:`등락 ${ch}% (29% 초과)`);
  if(amt<5000)reasons.push(`거래대금 ${amt}억 (5,000억 미달)`);
  if(px>0&&px<1000)reasons.push(`주가 ${px.toLocaleString()}원 (1,000원 미달)`);
  if(!_qualifyInst(inv))reasons.push(`수급 ${inv||"없음"} (기관/기+외 외)`);
  if(sc<3)reasons.push(`점수 ${sc} (3점 미달)`);
  if(h120!==1)reasons.push(`120일 신고가 미달성`);
  const baseOK=reasons.length===0;
  // 모드 분류: 5000억+=neo25 (네오 25%) / 그 외=기타 (네오 대장주는 별도 _classifyLeaders로 추출)
  let category="기타";
  if(baseOK&&amt>=5000)category="neo25";
  return {...s,ccG:cc.grade,hsG:hs.grade,category,supplyTag:_supplyLabel(inv),failReason:reasons[0]||"",h60,h120};
};
const load=useCallback(async()=>{
  setLoading(true);setErr(null);
  try{
    const r=await fetch(API_URL);
    const j=await r.json();
    if(!j.ok){setErr(j.error||"API 오류");setLoading(false);return;}
    const all=[...(j.signals?.S||[]),...(j.signals?.A||[]),...(j.signals?.B||[]),...(j.signals?.X||[])];
    const seen=new Set();
    const uniq=all.filter(x=>{if(seen.has(x.code))return false;seen.add(x.code);return true;});
    const proc=uniq.map(_classify).sort((a,b)=>(b.amount||0)-(a.amount||0));
    const neo25=proc.filter(s=>s.category==="neo25");
    const leader=_classifyLeaders(proc);
    const cetc=proc.filter(s=>s.category==="기타");
    const newData={date:j.date,time:j.time,all:proc,neo25,leader,cetc,summary:{total:proc.length,neo25:neo25.length,leader:leader.length,cetc:cetc.length}};
    setData(newData);
    try{localStorage.setItem("today_signals_v5",JSON.stringify({ts:Date.now(),data:newData}));}catch(e){}
    if(onSignalsLoaded)onSignalsLoaded(proc);
  }catch(e){setErr(e.message);}
  setLoading(false);
},[]);
// 마운트 시 캐시만 로드 — v4 이전 캐시는 폐기 (leader 필드 누락)
useEffect(()=>{try{localStorage.removeItem("today_signals_v2");localStorage.removeItem("today_signals_v3");localStorage.removeItem("today_signals_v4");}catch(e){}try{const c=localStorage.getItem("today_signals_v5");if(c){const p=JSON.parse(c);if(p&&p.data&&p.data.all){setData(p.data);if(onSignalsLoaded)onSignalsLoaded(p.data.all||[]);}}}catch(e){}},[]);
const saveSignals=async()=>{
  if(!data||!data.all||!data.all.length)return;
  setSaving(true);setSaveMsg(null);
  try{
    const targets=data.all.filter(s=>s.category==="neo25");
    const r=await fetch(TRACK_API,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(targets.map(s=>({code:s.code,name:s.name,entry_price:s.price,rate:s.change,score:s.score,grade:"네오종배",supply:s.investor,wick:s.wick,vol:s.amount,market:s.market,tp1:s.tp1,tp2:s.tp2,sl:s.sl})))});
    const j=await r.json();
    setSaveMsg(j.github_ok?("✅ "+j.added+"건 저장"):"⚠️ GITHUB_TOKEN 미설정");
  }catch(e){setSaveMsg("오류: "+e.message);}
  setSaving(false);
};
const _T=theme==="dark"
  ?{text:"#e6edf3",body:"#c9d1d9",sub:"#8b949e",hint:"#6e7681",mute:"#484f58",line:"#30363d",linelt:"#21262d",bg:"#0d1117",card:"#161b22",cardHov:"#1c2229",up:"#f85149",down:"#58a6ff",green:"#10b981",cc:"#22d3ee",hs:"#f97316",blue:"#3b82f6",accent:"#7c3aed"}
  :{text:"#191f28",body:"#333d4b",sub:"#4e5968",hint:"#6b7684",mute:"#8b95a1",line:"#e5e8eb",linelt:"#f2f4f6",bg:"#f9fafb",card:"#ffffff",cardHov:"#f5f7fa",up:"#f04452",down:"#1f6dee",green:"#10b981",cc:"#0367c4",hs:"#c81e1e",blue:"#3182f6",accent:"#7c3aed"};
// 활성 탭 (좌우 분기): neo25 | leader (네오 대장주)
const [activeTab,setActiveTab]=useState(()=>{try{const v=localStorage.getItem("today_tab_v1");if(v==="neo25"||v==="leader")return v;return "neo25";}catch(e){return "neo25";}});
useEffect(()=>{try{localStorage.setItem("today_tab_v1",activeTab);}catch(e){}},[activeTab]);
// 테마 1,2,3등 자본 (200만 기본)
const [leaderCapital,setLeaderCapital]=useState(()=>{try{return +localStorage.getItem("today_leader_cap_v1")||2000000;}catch(e){return 2000000;}});
useEffect(()=>{try{localStorage.setItem("today_leader_cap_v1",String(leaderCapital));}catch(e){}},[leaderCapital]);
const _supColor=(t)=>t==="기관"?"#475569":t==="외+기"?"#7c3aed":t==="외인"?"#3b82f6":_T.mute;
const _fmtKQty=(n)=>{const a=Math.abs(n);if(a>=10000)return(n>=0?'+':'-')+Math.round(a/1000)/10+'만';if(a>=1000)return(n>=0?'+':'-')+Math.round(a/100)/10+'천';return(n>=0?'+':'')+n.toLocaleString();};
// 카드 — 종목명 큼, 등락률 작게, 정보 폰트 키워서 가독성 확보
const Card=({s,accent})=>{
  const prog=+s.prog||0;const progPos=prog>0;
  const _copy=(e)=>{
    e.stopPropagation();
    navigator.clipboard.writeText(s.code).then(()=>{
      const b=e.currentTarget,o=b.textContent;
      b.textContent="✓ 복사됨";b.style.background=_T.green;b.style.color="#fff";b.style.borderColor=_T.green;
      setTimeout(()=>{b.textContent=o;b.style.background=_T.bg;b.style.color=_T.body;b.style.borderColor=_T.line;},1200);
    });
  };
  return(
    <div style={{padding:"16px 18px",borderRadius:13,border:"1px solid "+_T.line,marginBottom:10,background:_T.card,transition:"all .15s"}} onMouseEnter={e=>{e.currentTarget.style.borderColor=accent+"60";}} onMouseLeave={e=>{e.currentTarget.style.borderColor=_T.line;}}>
      {/* 1행: 종목명 (큼) + 코드 + 복사 버튼 + 등락률 (작게) */}
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",gap:10,marginBottom:12}}>
        <div style={{flex:1,minWidth:0,display:"flex",alignItems:"center",gap:8,flexWrap:"wrap"}}>
          <span style={{fontSize:19,fontWeight:800,color:_T.text,letterSpacing:"-0.4px"}}>{s.name}</span>
          <span style={{fontSize:12,fontWeight:600,color:_T.hint,fontFamily:"ui-monospace,monospace"}}>{s.code}</span>
          <button onClick={_copy} style={{fontSize:11,fontWeight:700,padding:"4px 10px",borderRadius:6,border:"1px solid "+_T.line,background:_T.bg,color:_T.body,cursor:"pointer",letterSpacing:"-0.2px",transition:"all .15s"}}>복사</button>
        </div>
        <div style={{fontSize:13,fontWeight:700,color:_T.up,letterSpacing:"-0.2px",flexShrink:0}}>+{(+s.change).toFixed(2)}%</div>
      </div>
      {/* 2행: 정보 그룹 — 폰트 키워서 가독성 확보 */}
      <div style={{display:"flex",alignItems:"center",gap:10,flexWrap:"wrap",padding:"12px 14px",background:_T.bg,borderRadius:10,border:"1px solid "+_T.line}}>
        {/* 수급 — 큰 칩 */}
        <span style={{fontSize:12,fontWeight:700,color:"#fff",background:_supColor(s.supplyTag),padding:"4px 11px",borderRadius:6,letterSpacing:"-0.2px"}}>{s.supplyTag}</span>
        {/* 거래대금 — 강조 */}
        <span style={{fontSize:14,color:_T.text,fontWeight:800,letterSpacing:"-0.3px"}}>{s.amount}억</span>
        <span style={{color:_T.mute,fontSize:11}}>·</span>
        {/* 점수 */}
        <span style={{fontSize:12,fontWeight:700,color:_T.body}}>점수 <b style={{color:_T.text}}>{s.score}</b></span>
        {/* 신고가 */}
        {s.h120===1?(<span style={{fontSize:11,fontWeight:700,color:_T.green,background:"rgba(16,185,129,0.12)",border:"1px solid rgba(16,185,129,0.35)",padding:"3px 9px",borderRadius:5,letterSpacing:"-0.2px"}}>120일↑</span>):s.h60===1&&(<span style={{fontSize:11,fontWeight:700,color:_T.green,background:"rgba(16,185,129,0.08)",border:"1px solid rgba(16,185,129,0.25)",padding:"3px 9px",borderRadius:5,letterSpacing:"-0.2px"}}>60일↑</span>)}
        {/* 프로그램 */}
        {prog!==0&&(<span style={{fontSize:11,fontWeight:700,color:progPos?_T.green:_T.down,background:progPos?"rgba(16,185,129,0.12)":"rgba(88,166,255,0.12)",border:"1px solid "+(progPos?"rgba(16,185,129,0.35)":"rgba(88,166,255,0.35)"),padding:"3px 9px",borderRadius:5}}>프로그램 {_fmtKQty(prog)}</span>)}
        {/* 우측: 주가 + 시장 */}
        {s.price>0&&<span style={{marginLeft:"auto",fontSize:12,fontWeight:700,color:_T.body}}>{(+s.price).toLocaleString()}원 <span style={{color:_T.hint,fontWeight:500,marginLeft:4}}>{s.market}</span></span>}
      </div>
    </div>
  );
};
const Empty=({msg})=>(<div style={{padding:"32px 20px",textAlign:"center",color:_T.mute,fontSize:12,background:_T.card,borderRadius:12,border:"1px dashed "+_T.line}}>{msg}</div>);
// 로딩 화면 (다크)
if(loading)return(<div style={{padding:"12px",background:_T.bg,minHeight:"100vh"}}><div style={{textAlign:"center",padding:"80px 20px",background:_T.card,borderRadius:14,border:"1px solid "+_T.line}}><div style={{fontSize:36,marginBottom:14}}>⏳</div><div style={{fontSize:16,fontWeight:700,color:_T.text,letterSpacing:"-0.3px"}}>KIS 조회 중...</div><div style={{fontSize:12,color:_T.hint,marginTop:8}}>등락률 상위 종목 분석 + 등급 산출</div></div></div>);
// 첫 조회 화면 (다크)
if(!data)return(<div style={{padding:"12px",background:_T.bg,minHeight:"100vh"}}><div style={{padding:"60px 24px",textAlign:"center",background:_T.card,borderRadius:14,border:"1px solid "+_T.line}}><div style={{fontSize:42,marginBottom:14}}>📡</div><div style={{fontSize:17,fontWeight:800,color:_T.text,marginBottom:10,letterSpacing:"-0.3px"}}>네오 종배 신호 조회</div><div style={{fontSize:12,color:_T.sub,marginBottom:24,lineHeight:1.7}}>등락 15-29% / 거래대금 100억+ / 기관·기+외 / 점수3+ / 120일 신고가<br/>네오 7% (소형~중형) / 네오 25% (대장주) 자동 분류</div>{err&&<div style={{padding:"10px 14px",borderRadius:9,background:"rgba(248,81,73,0.12)",border:"1px solid rgba(248,81,73,0.35)",color:_T.up,fontSize:12,marginBottom:14}}>⚠️ {err}</div>}<button onClick={load} style={{padding:"14px 32px",borderRadius:11,border:"none",background:_T.accent,color:"#fff",fontSize:14,fontWeight:800,cursor:"pointer",letterSpacing:"-0.3px"}}>📡 KIS 조회</button></div></div>);
// 메인 화면 (다크 + 좌우 탭)
const _tabConf={
  neo25:{l:"네오 25%",emoji:"🐉",col:"#c81e1e",cnt:(data.summary&&data.summary.neo25)||0,winRate:"51.3%",avg:"+4.75%",amtRange:"5,000억 이상",tp:"+25%",strategy:"대장주, 큰 수익 추구"},
  leader:{l:"네오 대장주",emoji:"📈",col:"#a855f7",cnt:(data.summary&&data.summary.leader)||0,winRate:"—",avg:"+0.12%",amtRange:"500억 이상 / 시장별 ≥3건 발화",tp:"D+1 시초가",strategy:"테마 1,2,3등주 (베팅 50/33.5/16.5)"}
};
const tab=_tabConf[activeTab];
const list=data[activeTab]||[];
return(<div style={{padding:"12px",background:_T.bg,minHeight:"100vh",color:_T.text}}>
{/* 상단 — 날짜 + 조회/저장 버튼 */}
<div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10,padding:"12px 14px",background:_T.card,border:"1px solid "+_T.line,borderRadius:12}}>
  <div>
    <div style={{fontSize:13,fontWeight:700,color:_T.text,letterSpacing:"-0.3px"}}>{data.date} · {data.time}</div>
    <div style={{fontSize:11,color:_T.hint,marginTop:3}}>총 {(data.summary&&data.summary.total)||0}건 · 25% <b style={{color:"#c81e1e"}}>{_tabConf.neo25.cnt}</b> · 테마 <b style={{color:"#a855f7"}}>{_tabConf.leader.cnt}</b> · 미통과 {(data.summary&&data.summary.cetc)||0}</div>
  </div>
  <div style={{display:"flex",gap:6}}>
    <button onClick={saveSignals} disabled={saving||!(data.summary&&data.summary.neo25)} style={{padding:"8px 12px",borderRadius:9,border:"1px solid "+_T.accent,background:saving?_T.line:_T.accent,color:saving?_T.mute:"#fff",fontSize:12,fontWeight:700,cursor:saving?"default":"pointer",letterSpacing:"-0.2px"}}>📌 신호저장</button>
    <button onClick={load} style={{padding:"8px 12px",borderRadius:9,border:"1px solid "+_T.line,background:_T.bg,color:_T.body,fontSize:12,fontWeight:600,cursor:"pointer",letterSpacing:"-0.2px"}}>🔄 새로조회</button>
  </div>
</div>
{saveMsg&&<div style={{padding:"10px 14px",borderRadius:9,background:saveMsg.startsWith("✅")?"rgba(16,185,129,0.12)":"rgba(245,158,11,0.12)",border:"1px solid "+(saveMsg.startsWith("✅")?"rgba(16,185,129,0.35)":"rgba(245,158,11,0.35)"),color:saveMsg.startsWith("✅")?_T.green:"#f59e0b",fontSize:12,marginBottom:10,fontWeight:600}}>{saveMsg}</div>}
{err&&<div style={{padding:"10px 14px",borderRadius:9,background:"rgba(248,81,73,0.12)",border:"1px solid rgba(248,81,73,0.35)",color:_T.up,fontSize:12,marginBottom:10,fontWeight:600}}>⚠️ {err}</div>}

{/* 좌우 탭 — 네오 25% / 네오 대장주 (1,2,3등주) */}
<div style={{display:"flex",gap:6,marginBottom:12}}>
  {["neo25","leader"].map(tk=>{
    const t=_tabConf[tk];const a=activeTab===tk;
    return(
      <button key={tk} onClick={()=>setActiveTab(tk)} style={{flex:"1 1 0",padding:"14px 12px",borderRadius:11,border:"1px solid "+(a?t.col:_T.line),background:a?t.col:_T.card,color:a?"#fff":_T.body,cursor:"pointer",transition:"all .12s",textAlign:"left"}}>
        <div style={{display:"flex",alignItems:"baseline",gap:7,marginBottom:6}}>
          <span style={{fontSize:18}}>{t.emoji}</span>
          <span style={{fontSize:14,fontWeight:800,letterSpacing:"-0.3px"}}>{t.l}</span>
          <span style={{marginLeft:"auto",fontSize:13,fontWeight:800,padding:"2px 9px",borderRadius:9,background:a?"rgba(255,255,255,0.22)":_T.bg,color:a?"#fff":_T.text}}>{t.cnt}</span>
        </div>
        <div style={{fontSize:10,fontWeight:600,opacity:a?0.85:0.7,letterSpacing:"-0.2px"}}>익절 {t.winRate} · 평균 {t.avg}</div>
      </button>);
  })}
</div>

{/* 활성 탭 진입조건/청산룰 카드 */}
<div style={{padding:"12px 14px",background:_T.card,border:"1px solid "+_T.line,borderRadius:12,marginBottom:10}}>
  <div style={{display:"flex",gap:8,alignItems:"baseline",marginBottom:8}}>
    <span style={{fontSize:11,fontWeight:700,color:tab.col,letterSpacing:"-0.2px"}}>📋 진입 조건</span>
    <span style={{fontSize:10,color:_T.hint,fontWeight:500}}>{tab.strategy}</span>
  </div>
  {activeTab==='leader'?(<div style={{fontSize:11,color:_T.body,fontWeight:500,lineHeight:1.7,letterSpacing:"-0.2px",marginBottom:10}}>
    · 등락률 <b style={{color:_T.text}}>+10% ~ +28%</b><br/>
    · 거래대금 <b style={{color:_T.text}}>500억 이상</b><br/>
    · 시장별 (KOSPI/KOSDAQ) <b style={{color:_T.text}}>≥3건 동시 발화</b> 시 1,2,3등 추출<br/>
    · 베팅 가중 <b style={{color:_T.text}}>1등 50% / 2등 33.5% / 3등 16.5%</b>
  </div>):(<div style={{fontSize:11,color:_T.body,fontWeight:500,lineHeight:1.7,letterSpacing:"-0.2px",marginBottom:10}}>
    · 등락률 <b style={{color:_T.text}}>+15% ~ +29%</b><br/>
    · 거래대금 <b style={{color:_T.text}}>{tab.amtRange}</b><br/>
    · 수급 <b style={{color:_T.text}}>기관 또는 기관+외인</b> 동반매수<br/>
    · 점수 <b style={{color:_T.text}}>3점 이상</b> + <b style={{color:_T.text}}>120일 신고가</b>
  </div>)}
  <div style={{height:1,background:_T.line,margin:"0 -14px 10px"}}/>
  <div style={{display:"flex",gap:8,alignItems:"baseline",marginBottom:6}}>
    <span style={{fontSize:11,fontWeight:700,color:tab.col,letterSpacing:"-0.2px"}}>💰 청산 룰</span>
  </div>
  {activeTab==='leader'?(<div style={{fontSize:11,color:_T.body,fontWeight:500,lineHeight:1.7,letterSpacing:"-0.2px"}}>
    · <b style={{color:_T.text}}>D+1 시초가 매도</b> (당일 종가 진입 → 익일 시가 청산)<br/>
    · 5년4개월 백테스트 평균 <b style={{color:_T.text}}>+0.12%</b> (분봉 누적 전 보수치)<br/>
    · 분봉 데이터 누적 후 <b style={{color:_T.up}}>+4.70%</b> 트레일링 검증 예정
  </div>):(<div style={{fontSize:11,color:_T.body,fontWeight:500,lineHeight:1.7,letterSpacing:"-0.2px"}}>
    · <b style={{color:_T.text}}>{tab.tp} 도달시 100% 즉시 익절</b><br/>
    · 미도달시 <b style={{color:_T.text}}>25일 만기 강제 청산</b><br/>
    · 손절가 없음
  </div>)}
</div>

{/* 활성 탭 종목 리스트 */}
{activeTab==='leader'?(()=>{
  const leaders=data.leader||[];
  if(!leaders.length)return <div style={{marginBottom:18}}><Empty msg="오늘 1,2,3등 조건 충족 시장 없음 (시장별 ≥3건 발화 필요)"/></div>;
  const _man=(n)=>(n>=10000?Math.round(n/10000).toLocaleString()+"만":n.toLocaleString());
  return(<div style={{marginBottom:18}}>
    <div style={{padding:"12px 14px",background:_T.card,border:"1px solid "+_T.line,borderRadius:11,marginBottom:8}}>
      <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:6}}>
        <span style={{fontSize:11,fontWeight:700,color:_T.text,letterSpacing:"-0.2px"}}>💰 자본</span>
        <input type="number" value={leaderCapital} onChange={e=>setLeaderCapital(+e.target.value||0)} step="100000" style={{flex:1,padding:"6px 10px",border:"1px solid "+_T.line,borderRadius:7,fontSize:12,fontWeight:700,color:_T.text,background:_T.bg,outline:"none"}}/>
        <span style={{fontSize:11,fontWeight:600,color:_T.sub}}>원</span>
      </div>
      <div style={{display:"flex",gap:6,fontSize:10,fontWeight:600,color:_T.hint,letterSpacing:"-0.2px"}}>
        <span>1등: <b style={{color:_T.text}}>{_man(Math.round(leaderCapital*0.5))}원 (50%)</b></span>
        <span>·</span>
        <span>2등: <b style={{color:_T.text}}>{_man(Math.round(leaderCapital*0.335))}원 (33.5%)</b></span>
        <span>·</span>
        <span>3등: <b style={{color:_T.text}}>{_man(Math.round(leaderCapital*0.165))}원 (16.5%)</b></span>
      </div>
    </div>
    {leaders.map((s,i)=>{
      const w=_LEADER_WEIGHTS[s._rank-1]||0;
      const amt=Math.round(leaderCapital*w);
      const rankCol=s._rank===1?"#dc2626":s._rank===2?"#f59e0b":"#10b981";
      return(<div key={s.code+i} style={{padding:"14px 16px",borderRadius:12,border:"1px solid "+_T.line,marginBottom:8,background:_T.card}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",gap:10,marginBottom:10}}>
          <div style={{flex:1,minWidth:0,display:"flex",alignItems:"center",gap:8,flexWrap:"wrap"}}>
            <span style={{fontSize:14,fontWeight:800,color:"#fff",background:rankCol,padding:"3px 10px",borderRadius:6,letterSpacing:"-0.2px"}}>{s._rank}등</span>
            <span style={{fontSize:18,fontWeight:800,color:_T.text,letterSpacing:"-0.4px"}}>{s.name}</span>
            <span style={{fontSize:11,fontWeight:600,color:_T.hint,fontFamily:"ui-monospace,monospace"}}>{s.code}</span>
            <span style={{fontSize:10,fontWeight:600,color:_T.sub,padding:"2px 7px",borderRadius:4,background:_T.bg,border:"1px solid "+_T.line}}>{s._mktLabel}</span>
          </div>
          <div style={{fontSize:14,fontWeight:800,color:_T.up,letterSpacing:"-0.3px"}}>+{(+s.change).toFixed(2)}%</div>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,padding:"10px 12px",background:_T.bg,borderRadius:9,border:"1px solid "+_T.line}}>
          <div>
            <div style={{fontSize:10,color:_T.hint,fontWeight:600,marginBottom:3,letterSpacing:"-0.2px"}}>매수 비중</div>
            <div style={{fontSize:14,fontWeight:800,color:rankCol,letterSpacing:"-0.3px"}}>{(w*100).toFixed(1)}% <span style={{fontSize:11,color:_T.sub,fontWeight:600,marginLeft:3}}>{_man(amt)}원</span></div>
          </div>
          <div>
            <div style={{fontSize:10,color:_T.hint,fontWeight:600,marginBottom:3,letterSpacing:"-0.2px"}}>거래대금 · 수급</div>
            <div style={{fontSize:13,fontWeight:700,color:_T.body,letterSpacing:"-0.2px"}}>{s.amount}억 <span style={{fontSize:10,color:_T.sub,marginLeft:4}}>{s.investor||"—"}</span></div>
          </div>
        </div>
      </div>);
    })}
  </div>);
})():(<div style={{marginBottom:18}}>
  {!list.length?<Empty msg={`오늘 ${tab.l} 조건 충족 종목 없음`}/>:list.map((s,i)=><Card key={s.code+i} s={s} accent={tab.col}/>)}
</div>)}

{/* 미통과 — 접기 (다크) */}
{data.cetc&&data.cetc.length>0&&(<details style={{marginBottom:10}}>
  <summary style={{cursor:"pointer",fontSize:12,color:_T.hint,fontWeight:600,padding:"11px 14px",background:_T.card,border:"1px solid "+_T.line,borderRadius:10,letterSpacing:"-0.2px"}}>📭 필터 미통과 ({data.cetc.length}건) · 사유 펼쳐보기</summary>
  <div style={{padding:"6px 0"}}>{data.cetc.map((s,i)=>(
    <div key={s.code+i} onClick={()=>onSignalClick&&onSignalClick(s.code)} style={{padding:"10px 14px",fontSize:11,borderBottom:"1px solid "+_T.line,cursor:"pointer",background:_T.card,marginBottom:2,borderRadius:8}}>
      <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:4,flexWrap:"wrap"}}>
        <span style={{fontWeight:700,color:_T.body,fontSize:12}}>{s.name}</span>
        <span style={{fontFamily:"ui-monospace,monospace",fontSize:10,background:_T.bg,padding:"2px 6px",borderRadius:4,color:_T.hint,border:"1px solid "+_T.line}}>{s.code}</span>
        <span style={{color:_T.up,fontWeight:700,fontSize:12}}>+{s.change}%</span>
        <span style={{color:_T.mute,fontSize:10}}>{s.investor||"—"} · {s.amount}억 · 점수 {s.score}</span>
      </div>
      <div style={{fontSize:10,color:_T.up,fontWeight:600,letterSpacing:"-0.2px",opacity:0.85}}>⚠️ {s.failReason||"기타"}</div>
    </div>
  ))}</div>
</details>)}
</div>);
}

function compressImg(file,maxW){return new Promise(function(res,rej){var img=new Image();img.onload=function(){var w=img.width,h=img.height;if(w>maxW){h=Math.round(h*maxW/w);w=maxW}var c=document.createElement("canvas");c.width=w;c.height=h;c.getContext("2d").drawImage(img,0,0,w,h);var d=c.toDataURL("image/jpeg",0.7);res({name:file.name,data:d.split(",")[1],type:"image/jpeg"})};img.onerror=rej;img.src=URL.createObjectURL(file)})}
async function fetchStockSnapshot(code){
  const today = new Date().toISOString().slice(0,10).replace(/-/g,'');
  try {
    const [r1, r2] = await Promise.all([
      fetch(API_URL + '/api/daily-price?code=' + code + '&date=' + today),
      fetch(API_URL + '/api/daily-price?kind=inv&code=' + code)
    ]);
    const [j1, j2] = await Promise.all([r1.json(), r2.json()]);
    const todayRow = (j1.all_rows && j1.all_rows[0]) || {};
    const invRows = (j2.output || []);
    const closes = invRows.map(x => +x.stck_clpr || 0).filter(x => x > 0);
    const todayClose = +todayRow.close || closes[0] || 0;
    const todayVol = +todayRow.vol || 0;
    const ma = (n) => { const sl = closes.slice(0, n); return sl.length ? Math.round(sl.reduce((a,b)=>a+b,0) / sl.length) : 0; };
    const ranges = invRows.slice(0, 30).map(x => Math.abs(+x.prdy_vrss || 0) / (+x.stck_clpr || 1) * 100);
    const lowVolDays = ranges.filter(x => x < 2).length;
    const sum15 = (key) => invRows.slice(0, 15).reduce((a,x)=>a+(+x[key]||0),0);
    return {
      ok: true, code,
      name: j1.name || '',
      market: j1.market || '',
      today: { close: todayClose, open: +todayRow.open || 0, high: +todayRow.high || 0, low: +todayRow.low || 0, vol: todayVol, amount_eok: Math.round(todayClose * todayVol / 1e8), rate: +todayRow.rate || 0 },
      ma: { ma5: ma(5), ma20: ma(20) },
      supply: {
        today: { foreign_mil: +(invRows[0] && invRows[0].frgn_ntby_tr_pbmn) || 0, inst_mil: +(invRows[0] && invRows[0].orgn_ntby_tr_pbmn) || 0, person_mil: +(invRows[0] && invRows[0].prsn_ntby_tr_pbmn) || 0 },
        d15: { foreign_mil: sum15('frgn_ntby_tr_pbmn'), inst_mil: sum15('orgn_ntby_tr_pbmn') }
      },
      history_30d: invRows.slice(0, 30).map(x => ({ date: x.stck_bsop_date, close: +x.stck_clpr || 0, chg: +x.prdy_vrss || 0, foreign_mil: +x.frgn_ntby_tr_pbmn || 0, inst_mil: +x.orgn_ntby_tr_pbmn || 0 })),
      diagnostics: { lowVolDays_30d: lowVolDays, closes_count: closes.length }
    };
  } catch (e) { return { ok: false, error: e.message }; }
}

function AIAnalysis({onSave}){
  const [imgs, setImgs] = useState([]);
  const [codeInput, setCodeInput] = useState("");useEffect(()=>{if(window.__pendingAiCode){const c=window.__pendingAiCode;window.__pendingAiCode=null;setCodeInput(c);}},[]);
  const [backDate, setBackDate] = useState("");
  const [verifyResult, setVerifyResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState("");
  const [aiResult, setAiResult] = useState(null);
  const [chimResult, setChimResult] = useState(null);
  const [jdResult, setJdResult] = useState(null);
  const [hsResult, setHsResult] = useState(null);
  const [finalResult, setFinalResult] = useState(null);
  const [finalLoading, setFinalLoading] = useState(false);
  const [finalError, setFinalError] = useState("");useEffect(()=>{if(aiResult&&chimResult&&jdResult&&hsResult){try{const _c=stockNameRef.current?stockNameRef.current.value.trim():"";if(_c){const _k="aianalyze_"+_c+"_"+_getCacheDateKey();localStorage.setItem(_k,JSON.stringify({ai:aiResult,chim:chimResult,jd:jdResult,hs:hsResult}));}}catch(e){}}},[aiResult,chimResult,jdResult,hsResult]);

  async function generateFinal() {
    if (!aiResult || !chimResult || !jdResult || !hsResult) {
      setFinalError("4중 분석을 먼저 완료해주세요");
      return;
    }
    setFinalLoading(true);
    setFinalError("");
    try {
      const today = new Date().toLocaleDateString("ko-KR");
      const sysPrompt = "당신은 한국 주식 매매 전문가입니다 (종가돌파매매 + 눌림목매매 둘 다 가능). 4개 분석 결과를 종합해 셋 중 하나를 명확히 결정: 1)돌파매매진입 2)눌림목매매대기 3)매수금지\n\n## 판정 기준\n- 돌파 적합: 외+기 동반매수 + 거래대금 500억+ + 윗꼬리≤5% + 신고가/저항돌파\n- 눌림목 적합: 추세 좋은데 윗꼬리>10% 또는 거래대금 부족 → 5/10/20일선 지지 대기\n- 매수금지: 수급 악화/추세 약/데이터 부족\n\n## 룰\n- 돌파: TP1=+10%, TP2=+20%, SL=-5%, 보유 10일\n- 눌림목: 5/10일선 1차매수, 추가하락시 2차, 손절 직전저점-3%, 익절 전고점\n\n오늘: " + today + "\n\n## 검증된 룰\n- 매수 조건: NEO 4점+ AND 침/주/하 중 2개 이상 SSA+\n- TP1=10%, TP2=20%, SL=-5%, 보유 10일\n- 매수 타이밍: 14:50~15:20 (장 마감 직전)\n\n## 응답 형식 (반드시 단일 JSON, 모든 필드 채우기)\n{\"finalGrade\":\"S/A/B/X\",\"verdict\":\"돌파매매진입|눌림목매매대기|매수금지 (셋 중 정확히 하나)\",\"confidence\":0~100,\"summary\":\"한줄평 (이모지 포함). 예: 🚀 LX하우시스 돌파매매 진입! 외+기 동반 + 800억 거래대금 (적합도 72% vs 눌림목 28%) | ⏸️ 기다렸다 눌림목매매! 5일선 32000 지지 대기 | ⛔ 매수금지! 수급 악화\",\"consensus\":\"[테마분석] 종목 테마(예: AI반도체/2차전지/방산/건설). 테마 내 위치: 대장주/2등주/3등주/후발주 (이유: 시총·거래대금·등락률 비교). 짝꿍 종목 3개 (같은 테마 유사 흐름): A코드-A명, B코드-B명, C코드-C명. [4분석 종합] 4개 분석 일치/불일치 + 종합 의견 3-4문장\",\"marketContext\":\"오늘 미국선물/마켓흐름/주요뉴스 가정 반영 1-2문장\",\"buyTiming\":\"14:50~15:20 분할매수 등 구체 진입 타이밍\",\"buyStrategy\":\"포지션 비중: 총자금 200만원 기준 X% (예: A=30만/15%, B=20만/10%, X=0). 돌파진입이면: 1차 진입가(60% 자금) + 2차 진입가(40% 자금) + 사이즈. 눌림목대기면: 1차매수가(5/10일선 구체가격, 50%) + 2차매수가(추가하락시 가격, 50%) + 며칠 대기. 금지면: 매수금지 사유\",\"exitPlan\":{\"tp1\":\"돌파=+10% 구체가격(50% 익절), 눌림목=익절가(전고점 구체가격)\",\"tp2\":\"돌파=+20% 구체가격(잔여 청산), 눌림목=N/A\",\"sl\":\"기본손절: 돌파=-5% 구체가격, 눌림목=직전저점-3% 구체가격. ⚠️ 강제손절(즉시청산): 외인 순매도 전환 또는 KOSPI -2% 급락 또는 거래대금 전일 50% 이하 감소 시\",\"timeStop\":\"10일 만기 청산 가이드\"},\"scenarios\":{\"bullish\":\"익일 갭상승 시나리오 + 대응\",\"neutral\":\"보합 시나리오 + 대응\",\"bearish\":\"하락 시나리오 + 대응 (추가매수 vs 손절)\"},\"addBuy\":\"추가매수 트리거 조건 (예: 진입가 -3% 도달 시 등)\",\"riskFactors\":[\"주요 리스크 1\",\"리스크 2\",\"리스크 3\"],\"watchPoints\":[\"매매 진행 중 모니터링 포인트 1\",\"포인트 2\"]}";
      const userPrompt = "4개 분석 결과 (JSON):\n\n[시장컨디션] " + (stockData && stockData.marketCondition ? ("직전월 평균수익 " + stockData.prevMonthAvgRet + "%, 직전월 익절률 " + stockData.prevMonthWinRate + "%, 시장상태=" + stockData.marketCondition + " (표본 " + stockData.prevMonthN + "건). 검증된 패턴: 약세후(-1%이하) 침S+×주S이상 신호는 평균+10.9%·승률 53%, 강세후(+1%이상)는 평균-3.5%·승률 24%, 황보는 평균+0.8%. 시장상태 반영해 매매강도/타이밍 결정하라.") : "데이터부족 - 시장컨디션 분석 생략") + "\n\n[NeoAi] " + JSON.stringify(aiResult).slice(0, 1500) +
        "\n\n[침착해] " + JSON.stringify(chimResult).slice(0, 1500) +
        "\n\n[주도주] " + JSON.stringify(jdResult).slice(0, 1500) +
        "\n\n[하승훈] " + JSON.stringify(hsResult).slice(0, 1500) +
        "\n\n위 4개 분석을 종합하여 위 JSON 형식대로 최종 결론을 작성. 시장 컨텍스트(미국선물/마켓흐름/주요뉴스)를 가정하여 실제 매매에 도움되는 구체적 결론. 반드시 단일 JSON만 출력 (코드블록 X, 다른 텍스트 X).";
      const r = await fetch("https://sector-api-pink.vercel.app/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-haiku-4-5-20251001",
          max_tokens: 3500,
          system: sysPrompt,
          messages: [{ role: "user", content: userPrompt }]
        })
      });
      const data = await r.json();
      if (data.type === "error") throw new Error(data.error && data.error.message || "API 에러");
      const text = (data.content && data.content[0] && data.content[0].text || "").trim();
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) throw new Error("JSON 파싱 실패");
      const parsed = JSON.parse(jsonMatch[0]);
      setFinalResult(parsed);
    } catch (e) {
      setFinalError(e.message || "최종결론 생성 실패");
    } finally {
      setFinalLoading(false);
    }
  }

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

  const analyze = async () => {const _ck=(()=>{const c=stockNameRef.current?stockNameRef.current.value.trim():"";return c?"aianalyze_"+c+"_"+_getCacheDateKey():null;})();if(_ck){try{const _c=localStorage.getItem(_ck);if(_c){const _p=JSON.parse(_c);setAiResult(_p.ai);setChimResult(_p.chim);setJdResult(_p.jd);setHsResult(_p.hs);setProgress("✓ 캐시 사용 (오늘 동일 종목 - 비용 0원)");return;}}catch(e){}}window.__neoUsage={input:0,output:0,cache_read:0,cache_write:0,calls:0};window.__neoOrigFetch=window.fetch;window.fetch=async function(...args){const url=typeof args[0]==="string"?args[0]:args[0].url;if(url&&url.indexOf("/api/analyze")>=0){const r=await window.__neoOrigFetch.apply(this,args);try{const j=await r.clone().json();if(j&&j.usage){window.__neoUsage.input+=(j.usage.input_tokens||0);window.__neoUsage.output+=(j.usage.output_tokens||0);window.__neoUsage.cache_read+=(j.usage.cache_read_input_tokens||0);window.__neoUsage.cache_write+=(j.usage.cache_creation_input_tokens||0);window.__neoUsage.calls++;}}catch(e){}return r;}return window.__neoOrigFetch.apply(this,args);};
    if (imgs.length === 0 && !(stockNameRef.current && /^[0-9]{6}$/.test(stockNameRef.current.value.trim()))) return;
    setLoading(true);
    setAiError(null); setChimError(null); setJdError(null); setHsError(null);
    setAiResult(null); setChimResult(null); setJdResult(null); setHsResult(null); setFinalResult(null); setFinalError("");
    setProgress("AI분석 + 침착해 + 주도주 + 하승훈 4중 분석 동시 실행 중...");

    const stockName = stockNameRef.current ? stockNameRef.current.value : "";
    let stockData = null;
    const codeMatch = stockName && stockName.trim().match(/^[0-9]{6}$/);
    if (codeMatch) {
      try {
        setProgress("ㆍ목코드 감지 — 데이터 fetch 중...");
        const codeStr = codeMatch[0];
        const today = new Date();
        const baseDate = backDate ? new Date(backDate) : today;
        const toYmd = baseDate.getFullYear() + String(baseDate.getMonth()+1).padStart(2,"0") + String(baseDate.getDate()).padStart(2,"0");
        const past = new Date(baseDate.getTime() - 90*86400000);
        const fromYmd = past.getFullYear() + String(past.getMonth()+1).padStart(2,"0") + String(past.getDate()).padStart(2,"0");
        const verifyEnd = new Date(baseDate.getTime() + 20*86400000);
        const verifyEndYmd = verifyEnd.getFullYear() + String(verifyEnd.getMonth()+1).padStart(2,"0") + String(verifyEnd.getDate()).padStart(2,"0");
        const ohlcResp = await fetch(PRICE_API + "?code=" + codeStr + "&from=" + fromYmd + "&to=" + toYmd + "&_=" + Date.now(), { cache: "no-store" });
        const ohlcData = await ohlcResp.json();
        const invResp = await fetch(PRICE_API + "?kind=inv&code=" + codeStr + "&_=" + Date.now(), { cache: "no-store" });
        const invData = await invResp.json();
        const rawRows = (ohlcData.all_rows || []).slice(0, 60);
        const days = rawRows.map((rr, ii) => { let rate = +rr.rate || 0; if (!rate && ii + 1 < rawRows.length) { const pc = +rawRows[ii+1].close || 0; if (pc > 0) rate = Math.round(((+rr.close - pc) / pc) * 10000) / 100; } return { date: rr.date, close: +rr.close||0, open: +rr.open||0, high: +rr.high||0, low: +rr.low||0, vol: +rr.vol||0, amt: Math.round((+rr.amt||0)/100000000*10)/10, rate: rate }; });
        const invDays = (invData.output || []).slice(0, 30).map(r => ({ date: r.stck_bsop_date || "", foreign: Math.round((+r.frgn_ntby_tr_pbmn||0) / 100 * 10) / 10, org: Math.round((+r.orgn_ntby_tr_pbmn||0) / 100 * 10) / 10, indiv: Math.round((+r.prsn_ntby_tr_pbmn||0) / 100 * 10) / 10 }));
        const today_d = days[0] || {};
        stockData = { code: codeStr, name: ohlcData.name || "", market: ohlcData.market || "", todayPrice: today_d.close, todayChange: today_d.rate, todayAmt: today_d.amt || Math.round((today_d.close * today_d.vol) / 100000000), days: days, invDays: invDays, baseDate: toYmd, isBacktest: !!backDate };
        try {
          const _bdY = +String(toYmd).slice(2, 4), _bdM = +String(toYmd).slice(4, 6);
          const _pYY = _bdM === 1 ? String(_bdY-1).padStart(2,"0") : String(_bdY).padStart(2,"0");
          const _pMM = _bdM === 1 ? "12" : String(_bdM-1).padStart(2,"0");
          const _pYM = _pYY + "-" + _pMM;
          const _ms = (typeof _mStats !== "undefined") ? _mStats[_pYM] : null;
          if (_ms && _ms.n >= 30) {
            const _par = _ms.ret / _ms.n, _pwr = _ms.w / _ms.n;
            stockData.prevMonthAvgRet = +_par.toFixed(2);
            stockData.prevMonthWinRate = +(_pwr * 100).toFixed(1);
            stockData.prevMonthN = _ms.n;
            stockData.marketCondition = _par < -1 ? "WEAK" : _par > 1 ? "STRONG" : "NEUTRAL";
          }
        } catch(e) {}
        if (backDate) {
          try {
            const nextDay = new Date(baseDate.getTime() + 86400000);
            const nextYmd = nextDay.getFullYear() + String(nextDay.getMonth()+1).padStart(2,"0") + String(nextDay.getDate()).padStart(2,"0");
            const verifyResp = await fetch(PRICE_API + "?code=" + codeStr + "&from=" + nextYmd + "&to=" + verifyEndYmd + "&_=" + Date.now(), { cache: "no-store" });
            const verifyData = await verifyResp.json();
            const futureRows = (verifyData.all_rows || []).slice().reverse();
            stockData.futureDays = futureRows.map((rr, ii) => {
              let rate = +rr.rate || 0;
              if (!rate && ii > 0) {
                const pc = +futureRows[ii-1].close || 0;
                if (pc > 0) rate = Math.round(((+rr.close - pc) / pc) * 10000) / 100;
              } else if (!rate && ii === 0 && today_d.close) {
                rate = Math.round(((+rr.close - today_d.close) / today_d.close) * 10000) / 100;
              }
              return { date: rr.date, close: +rr.close||0, open: +rr.open||0, high: +rr.high||0, low: +rr.low||0, vol: +rr.vol||0, amt: Math.round((+rr.amt||0)/100000000*10)/10, rate: rate };
            });
          } catch(e) { console.error("[verify fetch]", e); }
        }
      } catch(e) { console.error("[stockData fetch]", e); }
    }

    // AI 분석 (NEO-SCORE 14점)
    const aiPromise = analyzeNeoAnalysis(stockData || imgs, stockName).then(r => Object.assign(r, { score: r.total, tp1: 10, tp2: 20, sl: -5, breakType: r.breakType || "네오분석 v1", investor: r.investor || "AI 채점", ema50: r.ema50 || "5섹션", details: r.details || (r.sections ? [{item:"① 수급", point:(r.sections.supply&&r.sections.supply.score)||0},{item:"② 돌파품질", point:(r.sections.breakout&&r.sections.breakout.score)||0},{item:"③ 모멘텀·시장", point:(r.sections.momentum&&r.sections.momentum.score)||0},{item:"④ 시황·재료", point:(r.sections.sectorMaterial&&r.sections.sectorMaterial.score)||0},{item:"⑤ 사전응축·이평", point:(r.sections.accumulation&&r.sections.accumulation.score)||0}] : []), detailedAnalysis: r.summary || "", technicalIndicators: r.technicalIndicators || {}, supplyZone: r.supplyZone || {}, strategy: r.strategy || (r.exitPlan ? { entry: r.buyTiming || "", entryPrice: r.buyStrategy || "", stopLoss: r.exitPlan.sl || "", tp1Price: r.exitPlan.tp1 || "", tp2Price: r.exitPlan.tp2 || "", exit: "TP/SL 도달 시", hold: "10일" } : {}), confidenceScore: r.confidence || 0, nextDayRiseProbability: r.confidence || 0, recommendedWeight: r.recommendedWeight || 10, verdict: r.verdict || "" }));

    // 침착해 v4 분석
    const chimFn = () => analyzeChimchakhae(stockData || imgs, stockName);

    // 주도주 분석
    const jdFn = () => analyzeJudoju(stockData || imgs, stockName);

    // 하승훈 돌파매매 분석
    const hsFn = () => analyzeHaseunghoon(stockData || imgs, stockName);

    const [aiRes, chimRes, jdRes, hsRes] = await (async () => { const sleep = (ms) => new Promise(r => setTimeout(r, ms)); const a = await Promise.allSettled([aiPromise]); await sleep(15000); const c = await Promise.allSettled([chimFn()]); await sleep(15000); const j = await Promise.allSettled([jdFn()]); await sleep(15000); const h = await Promise.allSettled([hsFn()]); return [a[0], c[0], j[0], h[0]]; })();

    if (aiRes.status === "fulfilled") setAiResult(aiRes.value);
    else setAiError(aiRes.reason.message || "AI분석 실패");

    if (chimRes.status === "fulfilled") setChimResult(chimRes.value);
    else setChimError(chimRes.reason.message || "침착해 분석 실패");

    if (jdRes.status === "fulfilled") setJdResult(jdRes.value);
    else setJdError(jdRes.reason.message || "주도주 분석 실패");

    if (hsRes.status === "fulfilled") setHsResult(hsRes.value);
    else setHsError(hsRes.reason.message || "하승훈 분석 실패");

    // 익일 검증 (TP1/TP2/SL)
    if (backDate && stockData && stockData.futureDays && stockData.futureDays.length && stockData.target_row) {
      try {
        const _entry = stockData.target_row.close;
        const _tp1Px = +(_entry * 1.10).toFixed(2);
        const _tp2Px = +(_entry * 1.20).toFixed(2);
        const _slPx = +(_entry * 0.95).toFixed(2);
        const _days = [...stockData.futureDays].sort((a, b) => String(a.date).localeCompare(String(b.date)));
        let _pos = 1.0;
        let _realized = 0;
        let _exitDay = null;
        let _exitReason = null;
        const _detail = [];
        for (let i = 0; i < _days.length && _pos > 0; i++) {
          const d = _days[i];
          const log = { date: d.date, close: d.close, high: d.high, low: d.low, hits: [] };
          if (d.low <= _slPx) {
            _realized += _pos * -0.05;
            log.hits.push('SL');
            _exitDay = i + 1; _exitReason = 'SL'; _pos = 0;
          } else if (d.high >= _tp2Px) {
            _realized += _pos * 0.20;
            log.hits.push('TP2');
            _exitDay = i + 1; _exitReason = 'TP2'; _pos = 0;
          } else if (d.high >= _tp1Px && _pos === 1.0) {
            _realized += 0.5 * 0.10;
            log.hits.push('TP1');
            _pos = 0.5;
          }
          _detail.push(log);
        }
        if (_pos > 0 && _days.length > 0) {
          const _lc = _days[_days.length - 1].close;
          _realized += _pos * (_lc - _entry) / _entry;
          _exitDay = _days.length;
          _exitReason = _exitReason || 'CLOSE';
        }
        setVerifyResult({
          entry: _entry,
          tp1Price: _tp1Px,
          tp2Price: _tp2Px,
          slPrice: _slPx,
          days: _detail,
          finalPnl: +(_realized * 100).toFixed(2),
          exitDay: _exitDay,
          exitReason: _exitReason
        });
      } catch (e) { console.error('verify err:', e); }
    }
    // ???? ??: futureDays? ??? TP1/TP2/SL ?? ??
    if (stockData && stockData.futureDays && stockData.futureDays.length > 0 && stockData.target_row) {
      const entry = stockData.target_row.close;
      const tp1Price = Math.round(entry * 1.10);
      const tp2Price = Math.round(entry * 1.20);
      const slPrice  = Math.round(entry * 0.95);
      let tp1HitDay = null, tp2HitDay = null, slHitDay = null;
      const dailyDetail = [];
      stockData.futureDays.forEach((d, i) => {
        const day = i + 1;
        const tp1Hit = d.high >= tp1Price;
        const tp2Hit = d.high >= tp2Price;
        const slHit  = d.low  <= slPrice;
        if (slHit  && !slHitDay)  slHitDay  = day;
        if (tp1Hit && !tp1HitDay) tp1HitDay = day;
        if (tp2Hit && !tp2HitDay) tp2HitDay = day;
        dailyDetail.push({ day: day, date: d.date, open: d.open, high: d.high, low: d.low, close: d.close, tp1Hit: tp1Hit, tp2Hit: tp2Hit, slHit: slHit });
      });
      const last = stockData.futureDays[stockData.futureDays.length - 1];
      let exitPrice = last.close;
      let exitReason = '????';
      if (slHitDay && (!tp1HitDay || slHitDay < tp1HitDay)) { exitPrice = slPrice;  exitReason = 'SL(-5%) '   + slHitDay  + '??'; }
      else if (tp2HitDay) { exitPrice = tp2Price; exitReason = 'TP2(+20%) ' + tp2HitDay + '??'; }
      else if (tp1HitDay) { exitPrice = tp1Price; exitReason = 'TP1(+10%) ' + tp1HitDay + '?? (50% ??)'; }
      const finalPnl = Math.round(((exitPrice - entry) / entry) * 10000) / 100;
      setVerifyResult({ entry: entry, tp1Price: tp1Price, tp2Price: tp2Price, slPrice: slPrice, tp1HitDay: tp1HitDay, tp2HitDay: tp2HitDay, slHitDay: slHitDay, exitPrice: exitPrice, exitReason: exitReason, finalPnl: finalPnl, dailyDetail: dailyDetail });
    } else {
      setVerifyResult(null);
    }
    setLoading(false);try{if(window.__neoOrigFetch){window.fetch=window.__neoOrigFetch;}}catch(e){}const _u=window.__neoUsage||{input:0,output:0,cache_read:0,cache_write:0,calls:0};const _cost=(_u.input*1+_u.output*5+_u.cache_read*0.1+_u.cache_write*1.25)/1000000;setProgress(_u.calls>0?("✓ 완료 · 호출 "+_u.calls+"회 · 토큰 in:"+_u.input+" out:"+_u.output+" cache:"+_u.cache_read+" · 비용 $"+_cost.toFixed(4)+" (약 "+Math.round(_cost*1300)+"원)"):"");
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
    onSave({...baseAi, date: new Date().toISOString().slice(0,10), images: imgs.length, detailedAnalysis: aiResult && aiResult.detailedAnalysis, keyReasons: aiResult && aiResult.keyReasons, risks: aiResult && aiResult.risks, technicalIndicators: aiResult && aiResult.technicalIndicators, supplyZone: aiResult && aiResult.supplyZone, strategy: aiResult && aiResult.strategy, confidenceScore: aiResult && aiResult.confidenceScore, nextDayRiseProbability: aiResult && aiResult.nextDayRiseProbability, recommendedWeight: aiResult && aiResult.recommendedWeight, verdict: aiResult && aiResult.verdict, chimchakhaeResult: chimResult, judojuResult: jdResult, haseunghoonResult: hsResult, finalResult: finalResult});
    setAiResult(null); setChimResult(null); setJdResult(null); setHsResult(null); setImgs([]);
    if (stockNameRef.current) stockNameRef.current.value = "";
  };

  const gC = g => GI[g] && GI[g].c || "#94a3b8";
  const hasResult = aiResult || chimResult || jdResult || hsResult;

  return (
    <div>
      <div style={{padding:"10px 12px",background:"#eff6ff",border:"1px solid #93c5fd",borderRadius:8,fontSize:12,color:"#1d4ed8",marginBottom:10,lineHeight:1.5}}>💡 <b>6자리 종목코드</b>를 입력하면 자동으로 주가·수급 데이터를 조회해 분석합니다 (차트 이미지 불필요).<br/>종목명만 입력하면 기존처럼 차트 이미지를 업로드해서 분석합니다.</div>
        <input ref={stockNameRef} type="text" placeholder="종목코드 6자리 (예: 005930) 또는 종목명" onChange={(e)=>setCodeInput(e.target.value)} style={{width:"100%", padding:"10px 12px", border:"1px solid #cbd5e1", borderRadius:8, fontSize:13, marginBottom:10, fontFamily:"inherit", boxSizing:"border-box"}} />
      <div style={{display:"flex", alignItems:"center", gap:8, marginBottom:10, padding:"8px 10px", background:"#fffbeb", border:"1px solid #fde68a", borderRadius:8, fontSize:12, flexWrap:"wrap"}}>
        <span style={{fontWeight:600}}>📅 기준일자:</span>
        <input type="date" value={backDate} onChange={(e)=>setBackDate(e.target.value)} style={{padding:"4px 8px", border:"1px solid #cbd5e1", borderRadius:6, fontSize:12, fontFamily:"inherit"}} />
        <span style={{color:"#92400e", fontSize:11}}>{backDate ? "🔍 백테스트 모드 - 이 날짜 기준 분석 + 익일 검증" : "(비워두면 오늘 기준 분석)"}</span>
        {backDate && <button onClick={()=>{setBackDate("");setVerifyResult(null);}} style={{padding:"3px 8px", background:"#fff", border:"1px solid #cbd5e1", borderRadius:6, fontSize:11, cursor:"pointer"}}>✖</button>}
      </div>

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

      <button onClick={analyze} disabled={(imgs.length === 0 && !/^[0-9]{6}$/.test((codeInput||"").trim())) || loading} style={{width:"100%", padding:"14px", borderRadius:10, border:"none", background: (imgs.length===0 && !/^[0-9]{6}$/.test((codeInput||"").trim())) ? "#e2e8f0" : "#191f28", color: (imgs.length===0 && !/^[0-9]{6}$/.test((codeInput||"").trim())) ? "#94a3b8" : "#fff", fontSize:15, fontWeight:800, cursor: (imgs.length===0 && !/^[0-9]{6}$/.test((codeInput||"").trim())) ? "default" : "pointer", marginBottom:14, letterSpacing:"0.3px"}}>
        {loading ? "⚙️ 분석 중..." : "🔍 AI + 침착해 + 주도주 + 하승훈 4중 분석"}
      </button>

      {progress && <div style={{padding:10, borderRadius:8, background:"#eff6ff", border:"1px solid #bfdbfe", color:"#1e40af", fontSize:12, marginBottom:12, textAlign:"center"}}>{progress}</div>}

      {hasResult && (
        <div>
          {/* 탭 헤더 */}
          <div style={{display:"flex", gap:0, marginBottom:14, borderBottom:"2px solid #e2e8f0", overflowX:"auto"}}>
            <button onClick={() => setActiveTab("ai")} style={{flex:"1 0 auto", minWidth:80, padding:"12px 8px", border:"none", background:"transparent", borderBottom: activeTab==="ai" ? "3px solid #1e293b" : "3px solid transparent", marginBottom:"-2px", fontSize:12, fontWeight: activeTab==="ai" ? 800 : 600, color: activeTab==="ai" ? "#1e293b" : "#94a3b8", cursor:"pointer", fontFamily:"inherit", whiteSpace:"nowrap"}}>
              🧠 네오분석 {aiResult && <span style={{fontSize:11, color: gC(aiResult.grade), fontWeight:900, marginLeft:4}}>{aiResult.grade}</span>}
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
                      <div style={{fontSize:11, color:"rgba(255,255,255,0.85)", fontWeight:700, marginBottom:2}}>🧠 네오분석 v1</div>
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

          {/* AI 상세 분석 (NEW v2) */}
          {activeTab === "ai" && aiResult && (aiResult.detailedAnalysis || aiResult.keyReasons || aiResult.technicalIndicators) && (
            <div style={{marginTop:12, padding:14, background:"#fefefe", border:"2px solid #c4b5fd", borderRadius:10, width:"100%", flexBasis:"100%", boxSizing:"border-box"}}>
              <div style={{fontSize:14, fontWeight:700, color:"#7c3aed", marginBottom:10}}>🧠 네오분석 v1 상세</div>

              {aiResult.detailedAnalysis && (
                <div style={{marginBottom:12}}>
                  <div style={{fontSize:11, fontWeight:600, color:"#64748b", marginBottom:4}}>📋 종합 분석</div>
                  <div style={{fontSize:13, color:"#334155", lineHeight:1.7, padding:10, background:"#f8fafc", borderRadius:6}}>{aiResult.detailedAnalysis}</div>
                </div>
              )}

              {(aiResult.confidenceScore != null || aiResult.nextDayRiseProbability != null || aiResult.recommendedWeight != null || aiResult.verdict) && (
                <div style={{display:"grid", gridTemplateColumns:"repeat(2, 1fr)", gap:8, marginBottom:12}}>
                  {aiResult.confidenceScore != null && (
                    <div style={{padding:8, background:"#f1f5f9", borderRadius:6, textAlign:"center"}}>
                      <div style={{fontSize:10, color:"#64748b"}}>신뢰도</div>
                      <div style={{fontSize:16, fontWeight:700, color:"#0f172a"}}>{aiResult.confidenceScore}</div>
                    </div>
                  )}
                  {aiResult.nextDayRiseProbability != null && (
                    <div style={{padding:8, background:"#f1f5f9", borderRadius:6, textAlign:"center"}}>
                      <div style={{fontSize:10, color:"#64748b"}}>익일상승확률</div>
                      <div style={{fontSize:16, fontWeight:700, color:"#0f172a"}}>{aiResult.nextDayRiseProbability}%</div>
                    </div>
                  )}
                  {aiResult.recommendedWeight != null && (
                    <div style={{padding:8, background:"#f1f5f9", borderRadius:6, textAlign:"center"}}>
                      <div style={{fontSize:10, color:"#64748b"}}>추천비중</div>
                      <div style={{fontSize:16, fontWeight:700, color:"#0f172a"}}>{aiResult.recommendedWeight}%</div>
                    </div>
                  )}
                  {aiResult.verdict && (
                    <div style={{padding:8, background:"#fef3c7", borderRadius:6, textAlign:"center"}}>
                      <div style={{fontSize:10, color:"#92400e"}}>판정</div>
                      <div style={{fontSize:13, fontWeight:700, color:"#78350f"}}>{aiResult.verdict}</div>
                    </div>
                  )}
                </div>
              )}

              {Array.isArray(aiResult.keyReasons) && aiResult.keyReasons.length > 0 && (
                <div style={{marginBottom:12}}>
                  <div style={{fontSize:11, fontWeight:600, color:"#059669", marginBottom:4}}>✅ 핵심 이유</div>
                  <ul style={{margin:0, paddingLeft:18, fontSize:12, color:"#334155", lineHeight:1.7}}>
                    {aiResult.keyReasons.map((r, i) => <li key={i}>{r}</li>)}
                  </ul>
                </div>
              )}

              {Array.isArray(aiResult.risks) && aiResult.risks.length > 0 && (
                <div style={{marginBottom:12}}>
                  <div style={{fontSize:11, fontWeight:600, color:"#dc2626", marginBottom:4}}>⚠️ 리스크</div>
                  <ul style={{margin:0, paddingLeft:18, fontSize:12, color:"#334155", lineHeight:1.7}}>
                    {aiResult.risks.map((r, i) => <li key={i}>{r}</li>)}
                  </ul>
                </div>
              )}

              {aiResult.technicalIndicators && typeof aiResult.technicalIndicators === "object" && (
                <div style={{marginBottom:12}}>
                  <div style={{fontSize:11, fontWeight:600, color:"#0284c7", marginBottom:4}}>📊 기술적 지표</div>
                  <div style={{fontSize:12, color:"#334155", lineHeight:1.7, padding:10, background:"#f0f9ff", borderRadius:6}}>
                    {aiResult.technicalIndicators.rsi && <div><b>RSI:</b> {aiResult.technicalIndicators.rsi}</div>}
                    {aiResult.technicalIndicators.macd && <div><b>MACD:</b> {aiResult.technicalIndicators.macd}</div>}
                    {aiResult.technicalIndicators.bollinger && <div><b>볼린저:</b> {aiResult.technicalIndicators.bollinger}</div>}
                    {aiResult.technicalIndicators.movingAverage && <div><b>이평선:</b> {aiResult.technicalIndicators.movingAverage}</div>}
                    {aiResult.technicalIndicators.volume && <div><b>거래량:</b> {aiResult.technicalIndicators.volume}</div>}
                    {aiResult.technicalIndicators.summary && <div style={{marginTop:4, fontStyle:"italic"}}>{aiResult.technicalIndicators.summary}</div>}
                  </div>
                </div>
              )}

              {aiResult.supplyZone && typeof aiResult.supplyZone === "object" && (
                <div style={{marginBottom:12}}>
                  <div style={{fontSize:11, fontWeight:600, color:"#9333ea", marginBottom:4}}>🧱 매물대 분석</div>
                  <div style={{fontSize:12, color:"#334155", lineHeight:1.7, padding:10, background:"#faf5ff", borderRadius:6}}>
                    {aiResult.supplyZone.status && <div><b>상태:</b> {aiResult.supplyZone.status}</div>}
                    {aiResult.supplyZone.level && <div><b>레벨:</b> {aiResult.supplyZone.level}</div>}
                    {aiResult.supplyZone.thickness && <div><b>두께:</b> {aiResult.supplyZone.thickness}</div>}
                    {aiResult.supplyZone.breakoutQuality && <div><b>돌파품질:</b> {aiResult.supplyZone.breakoutQuality}</div>}
                    {aiResult.supplyZone.detail && <div style={{marginTop:4, fontStyle:"italic"}}>{aiResult.supplyZone.detail}</div>}
                  </div>
                </div>
              )}

              {aiResult.strategy && typeof aiResult.strategy === "object" && (
                <div style={{marginBottom:6}}>
                  <div style={{fontSize:11, fontWeight:600, color:"#ea580c", marginBottom:4}}>🎯 매매 전략</div>
                  <div style={{fontSize:12, color:"#334155", lineHeight:1.7, padding:10, background:"#fff7ed", borderRadius:6}}>
                    {aiResult.strategy.entry && <div><b>진입:</b> {aiResult.strategy.entry}</div>}
                    {aiResult.strategy.entryPrice && <div><b>진입가:</b> {aiResult.strategy.entryPrice}</div>}
                    {aiResult.strategy.stopLoss && <div><b>손절:</b> {aiResult.strategy.stopLoss}</div>}
                    {aiResult.strategy.tp1Price && <div><b>TP1:</b> {aiResult.strategy.tp1Price}</div>}
                    {aiResult.strategy.tp2Price && <div><b>TP2:</b> {aiResult.strategy.tp2Price}</div>}
                    {aiResult.strategy.exit && <div><b>청산:</b> {aiResult.strategy.exit}</div>}
                    {aiResult.strategy.hold && <div><b>보유:</b> {aiResult.strategy.hold}</div>}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* 최종결론 (NEW) */}
          {/* ???? ?? ?? ?? (NEW) */}
          {activeTab === "ai" && verifyResult && (
            <div style={{marginTop:14, padding:16, background:"#dcfce7", border:"1px solid #16a34a", borderRadius:10}}>
              <div style={{fontSize:15, fontWeight:700, color:"#14532d", marginBottom:12}}>?? ???? ?? ?? ??</div>
              <div style={{display:"grid", gridTemplateColumns:"repeat(4, 1fr)", gap:8, marginBottom:10}}>
                <div style={{padding:10, background:"#fff", borderRadius:8, textAlign:"center"}}>
                  <div style={{fontSize:10, color:"#64748b"}}>???</div>
                  <div style={{fontSize:16, fontWeight:700, color:"#0f172a"}}>{verifyResult.entry ? verifyResult.entry.toLocaleString() : "-"}</div>
                </div>
                <div style={{padding:10, background:"#fff", borderRadius:8, textAlign:"center"}}>
                  <div style={{fontSize:10, color:"#15803d"}}>TP1 (+10%)</div>
                  <div style={{fontSize:14, fontWeight:700, color:"#16a34a"}}>{verifyResult.tp1Price ? verifyResult.tp1Price.toLocaleString() : "-"}</div>
                </div>
                <div style={{padding:10, background:"#fff", borderRadius:8, textAlign:"center"}}>
                  <div style={{fontSize:10, color:"#15803d"}}>TP2 (+20%)</div>
                  <div style={{fontSize:14, fontWeight:700, color:"#16a34a"}}>{verifyResult.tp2Price ? verifyResult.tp2Price.toLocaleString() : "-"}</div>
                </div>
                <div style={{padding:10, background:"#fff", borderRadius:8, textAlign:"center"}}>
                  <div style={{fontSize:10, color:"#dc2626"}}>SL (-5%)</div>
                  <div style={{fontSize:14, fontWeight:700, color:"#dc2626"}}>{verifyResult.slPrice ? verifyResult.slPrice.toLocaleString() : "-"}</div>
                </div>
              </div>
              <div style={{display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:8, marginBottom:12}}>
                <div style={{padding:10, background:"#fff", borderRadius:8, textAlign:"center"}}>
                  <div style={{fontSize:10, color:"#64748b"}}>?? ???</div>
                  <div style={{fontSize:18, fontWeight:800, color: (verifyResult.finalPnl >= 0) ? "#16a34a" : "#dc2626"}}>{(verifyResult.finalPnl >= 0) ? "+" : ""}{verifyResult.finalPnl}%</div>
                </div>
                <div style={{padding:10, background:"#fff", borderRadius:8, textAlign:"center"}}>
                  <div style={{fontSize:10, color:"#64748b"}}>???</div>
                  <div style={{fontSize:14, fontWeight:700, color:"#0f172a"}}>{verifyResult.exitDay ? (verifyResult.exitDay + "??") : "?? ?"}</div>
                </div>
                <div style={{padding:10, background:"#fff", borderRadius:8, textAlign:"center"}}>
                  <div style={{fontSize:10, color:"#64748b"}}>?? ??</div>
                  <div style={{fontSize:14, fontWeight:700, color:"#0f172a"}}>{verifyResult.exitReason || "??"}</div>
                </div>
              </div>
              {Array.isArray(verifyResult.days) && verifyResult.days.length > 0 && (
                <div style={{background:"#fff", borderRadius:8, padding:10}}>
                  <div style={{fontSize:11, fontWeight:700, color:"#14532d", marginBottom:6}}>?? ?? ??</div>
                  <div style={{display:"grid", gridTemplateColumns:"50px 1fr 1fr 1fr 1fr 80px", gap:4, fontSize:10, fontWeight:700, color:"#64748b", paddingBottom:4, borderBottom:"1px solid #e2e8f0"}}>
                    <div>??</div><div>??</div><div>??</div><div>??</div><div>??</div><div>???</div>
                  </div>
                  {verifyResult.days.map((d, i) => {
                    const chg = (d.close && verifyResult.entry) ? +(((d.close - verifyResult.entry) / verifyResult.entry) * 100).toFixed(2) : 0;
                    const evt = (d.hits && d.hits.length > 0) ? d.hits.join(",") : "";
                    const evtColor = evt.indexOf("TP2") >= 0 ? "#16a34a" : evt.indexOf("TP1") >= 0 ? "#15803d" : evt.indexOf("SL") >= 0 ? "#dc2626" : "#94a3b8";
                    return (
                      <div key={i} style={{display:"grid", gridTemplateColumns:"50px 1fr 1fr 1fr 1fr 80px", gap:4, fontSize:10, padding:"4px 0", borderBottom: i < (verifyResult.days.length - 1) ? "1px solid #f1f5f9" : "none"}}>
                        <div style={{color:"#475569"}}>{d.date ? (d.date.slice(4,6) + "/" + d.date.slice(6,8)) : "-"}</div>
                        <div>{d.high ? d.high.toLocaleString() : "-"}</div>
                        <div>{d.low ? d.low.toLocaleString() : "-"}</div>
                        <div>{d.close ? d.close.toLocaleString() : "-"}</div>
                        <div style={{color: chg >= 0 ? "#16a34a" : "#dc2626"}}>{chg >= 0 ? "+" : ""}{chg}%</div>
                        <div style={{fontWeight:700, color: evtColor}}>{evt || "-"}</div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {activeTab === "ai" && (aiResult || chimResult || jdResult || hsResult) && (
            <div style={{marginTop:14, padding:16, background:"#fef3c7", border:"1px solid #f59e0b", borderRadius:10}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
                <div style={{fontSize:15, fontWeight:700, color:"#78350f"}}>⭐ 4중 분석 종합 최종결론</div>
                {!finalResult && !finalLoading && (
                  <button onClick={generateFinal} disabled={!aiResult||!chimResult||!jdResult||!hsResult}
                    style={{padding:"8px 14px",background:"#f59e0b",color:"#fff",border:"none",borderRadius:8,fontSize:12,fontWeight:600,cursor:(!aiResult||!chimResult||!jdResult||!hsResult)?"not-allowed":"pointer",opacity:(!aiResult||!chimResult||!jdResult||!hsResult)?0.5:1}}>
                    ⚡ 최종결론 생성
                  </button>
                )}
                {finalResult && !finalLoading && (
                  <button onClick={generateFinal}
                    style={{padding:"6px 10px",background:"transparent",color:"#78350f",border:"1px solid #f59e0b",borderRadius:6,fontSize:11,cursor:"pointer"}}>
                    🔄 재생성
                  </button>
                )}
              </div>
              {finalLoading && (<div style={{textAlign:"center",padding:24,color:"#78350f",fontSize:13}}>⚙️ 4개 분석 종합 중... (시장 컨텍스트 반영)</div>)}
              {finalError && (<div style={{padding:10,background:"#fee2e2",color:"#991b1b",borderRadius:6,fontSize:12}}>❌ {finalError}</div>)}
              {finalResult && (
                <div>
                  <div style={{display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:8,marginBottom:12}}>
                    <div style={{padding:10,background:"#fff",borderRadius:8,textAlign:"center"}}>
                      <div style={{fontSize:10,color:"#78350f"}}>최종등급</div>
                      <div style={{fontSize:24,fontWeight:700,color:"#78350f"}}>{finalResult.finalGrade}</div>
                    </div>
                    <div style={{padding:10,background:"#fff",borderRadius:8,textAlign:"center"}}>
                      <div style={{fontSize:10,color:"#78350f"}}>판정</div>
                      <div style={{fontSize:14,fontWeight:700,color:"#78350f",marginTop:6}}>{finalResult.verdict}</div>
                    </div>
                    <div style={{padding:10,background:"#fff",borderRadius:8,textAlign:"center",gridColumn:"span 2"}}>
                      <div style={{fontSize:10,color:"#78350f"}}>신뢰도</div>
                      <div style={{fontSize:18,fontWeight:700,color:"#78350f"}}>{finalResult.confidence}/100</div>
                    </div>
                  </div>
                  {finalResult.summary && (<div style={{padding:10,background:"#fff",borderRadius:8,marginBottom:10,fontSize:13,fontWeight:600,color:"#78350f"}}>💬 {finalResult.summary}</div>)}
                  {finalResult.consensus && (<div style={{marginBottom:10}}><div style={{fontSize:11,fontWeight:600,color:"#78350f",marginBottom:4}}>🤝 4개 분석 종합</div><div style={{padding:10,background:"#fff",borderRadius:6,fontSize:12,lineHeight:1.7,color:"#3f2f0a"}}>{finalResult.consensus}</div></div>)}
                  {finalResult.marketContext && (<div style={{marginBottom:10}}><div style={{fontSize:11,fontWeight:600,color:"#78350f",marginBottom:4}}>🌐 시장 컨텍스트</div><div style={{padding:10,background:"#fff",borderRadius:6,fontSize:12,lineHeight:1.6,color:"#3f2f0a",fontStyle:"italic"}}>{finalResult.marketContext}</div></div>)}
                  {(finalResult.buyTiming || finalResult.buyStrategy) && (<div style={{marginBottom:10,padding:10,background:"#dcfce7",borderRadius:8,border:"1px solid #16a34a"}}><div style={{fontSize:12,fontWeight:600,color:"#15803d",marginBottom:6}}>🟢 매수 전략</div>{finalResult.buyTiming && <div style={{fontSize:12,color:"#14532d",marginBottom:3}}><b>타이밍:</b> {finalResult.buyTiming}</div>}{finalResult.buyStrategy && <div style={{fontSize:12,color:"#14532d",marginBottom:3}}><b>전략:</b> {finalResult.buyStrategy}</div>}{finalResult.addBuy && <div style={{fontSize:12,color:"#14532d"}}><b>추가매수:</b> {finalResult.addBuy}</div>}</div>)}
                  {finalResult.exitPlan && (<div style={{marginBottom:10,padding:10,background:"#fef2f2",borderRadius:8,border:"1px solid #dc2626"}}><div style={{fontSize:12,fontWeight:600,color:"#991b1b",marginBottom:6}}>🔴 청산 계획</div>{finalResult.exitPlan.tp1 && <div style={{fontSize:12,color:"#7f1d1d",marginBottom:3}}><b>TP1:</b> {finalResult.exitPlan.tp1}</div>}{finalResult.exitPlan.tp2 && <div style={{fontSize:12,color:"#7f1d1d",marginBottom:3}}><b>TP2:</b> {finalResult.exitPlan.tp2}</div>}{finalResult.exitPlan.sl && <div style={{fontSize:12,color:"#7f1d1d",marginBottom:3}}><b>SL:</b> {finalResult.exitPlan.sl}</div>}{finalResult.exitPlan.timeStop && <div style={{fontSize:12,color:"#7f1d1d"}}><b>시간:</b> {finalResult.exitPlan.timeStop}</div>}</div>)}
                  {finalResult.scenarios && (<div style={{marginBottom:10}}><div style={{fontSize:11,fontWeight:600,color:"#78350f",marginBottom:6}}>📊 익일 시나리오별 대응</div>{finalResult.scenarios.bullish && <div style={{padding:8,background:"#dcfce7",borderRadius:6,fontSize:11,marginBottom:4,color:"#14532d"}}><b>📈 강세:</b> {finalResult.scenarios.bullish}</div>}{finalResult.scenarios.neutral && <div style={{padding:8,background:"#f3f4f6",borderRadius:6,fontSize:11,marginBottom:4,color:"#1f2937"}}><b>➡️ 보합:</b> {finalResult.scenarios.neutral}</div>}{finalResult.scenarios.bearish && <div style={{padding:8,background:"#fee2e2",borderRadius:6,fontSize:11,marginBottom:4,color:"#7f1d1d"}}><b>📉 약세:</b> {finalResult.scenarios.bearish}</div>}</div>)}
                  {Array.isArray(finalResult.riskFactors) && finalResult.riskFactors.length > 0 && (<div style={{marginBottom:10}}><div style={{fontSize:11,fontWeight:600,color:"#dc2626",marginBottom:4}}>⚠️ 리스크 요인</div><ul style={{margin:0,paddingLeft:18,fontSize:12,color:"#3f2f0a",lineHeight:1.6}}>{finalResult.riskFactors.map((r,i)=><li key={i}>{r}</li>)}</ul></div>)}
                  {Array.isArray(finalResult.watchPoints) && finalResult.watchPoints.length > 0 && (<div><div style={{fontSize:11,fontWeight:600,color:"#0284c7",marginBottom:4}}>👀 모니터링 포인트</div><ul style={{margin:0,paddingLeft:18,fontSize:12,color:"#3f2f0a",lineHeight:1.6}}>{finalResult.watchPoints.map((r,i)=><li key={i}>{r}</li>)}</ul></div>)}
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

              {/* 최종결론 (히스토리) */}
              {detailTab === "ai" && (
                <div>
                  <div style={{borderRadius:14, border:"2px solid " + gC(h[sel].grade), overflow:"hidden", marginBottom:14}}>
                    <div style={{background: gC(h[sel].grade), padding:"14px 18px", display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:8}}>
                      <div style={{minWidth:0, flex:"1 1 auto"}}>
                        <div style={{fontSize:11, color:"rgba(255,255,255,0.85)", fontWeight:700, marginBottom:2}}>🧠 네오분석 v1</div>
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
              )}{detailTab === "ai" && (h[sel].detailedAnalysis || h[sel].keyReasons || h[sel].technicalIndicators || h[sel].supplyZone || h[sel].strategy) && (
                  <div style={{marginTop:12, padding:14, background:"#fefefe", border:"2px solid #c4b5fd", borderRadius:10, width:"100%", flexBasis:"100%", boxSizing:"border-box"}}>
                    <div style={{fontSize:14, fontWeight:700, color:"#7c3aed", marginBottom:10}}>🧠 네오분석 v1 상세</div>

                    {h[sel].detailedAnalysis && (
                      <div style={{marginBottom:12}}>
                        <div style={{fontSize:11, fontWeight:600, color:"#64748b", marginBottom:4}}>📋 종합 분석</div>
                        <div style={{fontSize:13, color:"#334155", lineHeight:1.7, padding:10, background:"#f8fafc", borderRadius:6}}>{h[sel].detailedAnalysis}</div>
                      </div>
                    )}

                    {(h[sel].confidenceScore != null || h[sel].nextDayRiseProbability != null || h[sel].recommendedWeight != null || h[sel].verdict) && (
                      <div style={{display:"grid", gridTemplateColumns:"repeat(2, 1fr)", gap:8, marginBottom:12}}>
                        {h[sel].confidenceScore != null && (
                          <div style={{padding:8, background:"#f1f5f9", borderRadius:6, textAlign:"center"}}>
                            <div style={{fontSize:10, color:"#64748b"}}>신뢰도</div>
                            <div style={{fontSize:16, fontWeight:700, color:"#0f172a"}}>{h[sel].confidenceScore}</div>
                          </div>
                        )}
                        {h[sel].nextDayRiseProbability != null && (
                          <div style={{padding:8, background:"#f1f5f9", borderRadius:6, textAlign:"center"}}>
                            <div style={{fontSize:10, color:"#64748b"}}>익일상승확률</div>
                            <div style={{fontSize:16, fontWeight:700, color:"#0f172a"}}>{h[sel].nextDayRiseProbability}%</div>
                          </div>
                        )}
                        {h[sel].recommendedWeight != null && (
                          <div style={{padding:8, background:"#f1f5f9", borderRadius:6, textAlign:"center"}}>
                            <div style={{fontSize:10, color:"#64748b"}}>추천비중</div>
                            <div style={{fontSize:16, fontWeight:700, color:"#0f172a"}}>{h[sel].recommendedWeight}%</div>
                          </div>
                        )}
                        {h[sel].verdict && (
                          <div style={{padding:8, background:"#fef3c7", borderRadius:6, textAlign:"center"}}>
                            <div style={{fontSize:10, color:"#92400e"}}>판정</div>
                            <div style={{fontSize:13, fontWeight:700, color:"#78350f"}}>{h[sel].verdict}</div>
                          </div>
                        )}
                      </div>
                    )}

                    {Array.isArray(h[sel].keyReasons) && h[sel].keyReasons.length > 0 && (
                      <div style={{marginBottom:12}}>
                        <div style={{fontSize:11, fontWeight:600, color:"#059669", marginBottom:4}}>✅ 핵심 이유</div>
                        <ul style={{margin:0, paddingLeft:18, fontSize:12, color:"#334155", lineHeight:1.7}}>
                          {h[sel].keyReasons.map((r, i) => <li key={i}>{r}</li>)}
                        </ul>
                      </div>
                    )}

                    {Array.isArray(h[sel].risks) && h[sel].risks.length > 0 && (
                      <div style={{marginBottom:12}}>
                        <div style={{fontSize:11, fontWeight:600, color:"#dc2626", marginBottom:4}}>⚠️ 리스크</div>
                        <ul style={{margin:0, paddingLeft:18, fontSize:12, color:"#334155", lineHeight:1.7}}>
                          {h[sel].risks.map((r, i) => <li key={i}>{r}</li>)}
                        </ul>
                      </div>
                    )}

                    {h[sel].technicalIndicators && typeof h[sel].technicalIndicators === "object" && (
                      <div style={{marginBottom:12}}>
                        <div style={{fontSize:11, fontWeight:600, color:"#0284c7", marginBottom:4}}>📊 기술적 지표</div>
                        <div style={{fontSize:12, color:"#334155", lineHeight:1.7, padding:10, background:"#f0f9ff", borderRadius:6}}>
                          {h[sel].technicalIndicators.rsi && <div><b>RSI:</b> {h[sel].technicalIndicators.rsi}</div>}
                          {h[sel].technicalIndicators.macd && <div><b>MACD:</b> {h[sel].technicalIndicators.macd}</div>}
                          {h[sel].technicalIndicators.bollinger && <div><b>볼린저:</b> {h[sel].technicalIndicators.bollinger}</div>}
                          {h[sel].technicalIndicators.movingAverage && <div><b>이평선:</b> {h[sel].technicalIndicators.movingAverage}</div>}
                          {h[sel].technicalIndicators.volume && <div><b>거래량:</b> {h[sel].technicalIndicators.volume}</div>}
                          {h[sel].technicalIndicators.summary && <div style={{marginTop:4, fontStyle:"italic"}}>{h[sel].technicalIndicators.summary}</div>}
                        </div>
                      </div>
                    )}

                    {h[sel].supplyZone && typeof h[sel].supplyZone === "object" && (
                      <div style={{marginBottom:12}}>
                        <div style={{fontSize:11, fontWeight:600, color:"#9333ea", marginBottom:4}}>🧱 매물대 분석</div>
                        <div style={{fontSize:12, color:"#334155", lineHeight:1.7, padding:10, background:"#faf5ff", borderRadius:6}}>
                          {h[sel].supplyZone.status && <div><b>상태:</b> {h[sel].supplyZone.status}</div>}
                          {h[sel].supplyZone.level && <div><b>레벨:</b> {h[sel].supplyZone.level}</div>}
                          {h[sel].supplyZone.thickness && <div><b>두께:</b> {h[sel].supplyZone.thickness}</div>}
                          {h[sel].supplyZone.breakoutQuality && <div><b>돌파품질:</b> {h[sel].supplyZone.breakoutQuality}</div>}
                          {h[sel].supplyZone.detail && <div style={{marginTop:4, fontStyle:"italic"}}>{h[sel].supplyZone.detail}</div>}
                        </div>
                      </div>
                    )}

                    {h[sel].strategy && typeof h[sel].strategy === "object" && (
                      <div style={{marginBottom:6}}>
                        <div style={{fontSize:11, fontWeight:600, color:"#ea580c", marginBottom:4}}>🎯 매매 전략</div>
                        <div style={{fontSize:12, color:"#334155", lineHeight:1.7, padding:10, background:"#fff7ed", borderRadius:6}}>
                          {h[sel].strategy.entry && <div><b>진입:</b> {h[sel].strategy.entry}</div>}
                          {h[sel].strategy.entryPrice && <div><b>진입가:</b> {h[sel].strategy.entryPrice}</div>}
                          {h[sel].strategy.stopLoss && <div><b>손절:</b> {h[sel].strategy.stopLoss}</div>}
                          {h[sel].strategy.tp1Price && <div><b>TP1:</b> {h[sel].strategy.tp1Price}</div>}
                          {h[sel].strategy.tp2Price && <div><b>TP2:</b> {h[sel].strategy.tp2Price}</div>}
                          {h[sel].strategy.exit && <div><b>청산:</b> {h[sel].strategy.exit}</div>}
                          {h[sel].strategy.hold && <div><b>보유:</b> {h[sel].strategy.hold}</div>}
                        </div>
                      </div>
                    )}
                  </div>
                )}
                          {(h[sel].chimchakhaeResult && h[sel].chimchakhaeResult.grade) || (h[sel].judojuResult && h[sel].judojuResult.grade) || (h[sel].haseunghoonResult && h[sel].haseunghoonResult.grade) ? (
              <div style={{display:"flex", borderBottom:"2px solid #e2e8f0", padding:"16px 16px 0", overflowX:"auto"}}>
                {h[sel].grade && (
                  <button onClick={() => setDetailTab("ai")} style={{flex:"1 0 auto", minWidth:80, padding:"10px 8px", border:"none", background:"transparent", borderBottom: detailTab==="ai" ? "3px solid #1e293b" : "3px solid transparent", marginBottom:"-2px", fontSize:12, fontWeight: detailTab==="ai" ? 800 : 600, color: detailTab==="ai" ? "#1e293b" : "#94a3b8", cursor:"pointer", fontFamily:"inherit", whiteSpace:"nowrap"}}>
                    🧠 네오분석 <span style={{fontSize:11, color: gC(h[sel].grade), fontWeight:900, marginLeft:4}}>{h[sel].grade}</span>
                  </button>
                )}
                {/* AI 상세 분석 in 히스토리 모달 */}
                {detailTab === "ai" && h[sel].finalResult && typeof h[sel].finalResult === "object" && (
                <div style={{marginTop:14, padding:14, background:"#fef3c7", border:"1px solid #f59e0b", borderRadius:10}}>
                  <div style={{fontSize:14, fontWeight:700, color:"#78350f", marginBottom:10}}>⭐ 4중 분석 종합 최종결론</div>
                  <div style={{display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:8,marginBottom:10}}>
                    <div style={{padding:8,background:"#fff",borderRadius:6,textAlign:"center"}}><div style={{fontSize:10,color:"#78350f"}}>최종등급</div><div style={{fontSize:20,fontWeight:700,color:"#78350f"}}>{h[sel].finalResult.finalGrade}</div></div>
                    <div style={{padding:8,background:"#fff",borderRadius:6,textAlign:"center"}}><div style={{fontSize:10,color:"#78350f"}}>판정</div><div style={{fontSize:13,fontWeight:700,color:"#78350f",marginTop:4}}>{h[sel].finalResult.verdict}</div></div>
                  </div>
                  {h[sel].finalResult.confidence != null && (<div style={{padding:8,background:"#fff",borderRadius:6,textAlign:"center",fontSize:13,marginBottom:8}}><b>신뢰도:</b> {h[sel].finalResult.confidence}/100</div>)}
                  {h[sel].finalResult.summary && <div style={{padding:8,background:"#fff",borderRadius:6,fontSize:12,fontWeight:600,color:"#78350f",marginBottom:8}}>💬 {h[sel].finalResult.summary}</div>}
                  {h[sel].finalResult.consensus && <div style={{marginBottom:8}}><div style={{fontSize:11,fontWeight:600,color:"#78350f",marginBottom:3}}>🤝 종합 의견</div><div style={{padding:8,background:"#fff",borderRadius:6,fontSize:11,lineHeight:1.6}}>{h[sel].finalResult.consensus}</div></div>}
                  {h[sel].finalResult.marketContext && <div style={{marginBottom:8}}><div style={{fontSize:11,fontWeight:600,color:"#78350f",marginBottom:3}}>🌐 시장 컨텍스트</div><div style={{padding:8,background:"#fff",borderRadius:6,fontSize:11,fontStyle:"italic"}}>{h[sel].finalResult.marketContext}</div></div>}
                  {(h[sel].finalResult.buyTiming || h[sel].finalResult.buyStrategy) && (<div style={{marginBottom:8,padding:8,background:"#dcfce7",borderRadius:6}}><div style={{fontSize:11,fontWeight:600,color:"#15803d",marginBottom:4}}>🟢 매수 전략</div>{h[sel].finalResult.buyTiming && <div style={{fontSize:11,color:"#14532d"}}><b>타이밍:</b> {h[sel].finalResult.buyTiming}</div>}{h[sel].finalResult.buyStrategy && <div style={{fontSize:11,color:"#14532d"}}><b>전략:</b> {h[sel].finalResult.buyStrategy}</div>}{h[sel].finalResult.addBuy && <div style={{fontSize:11,color:"#14532d"}}><b>추가매수:</b> {h[sel].finalResult.addBuy}</div>}</div>)}
                  {h[sel].finalResult.exitPlan && (<div style={{marginBottom:8,padding:8,background:"#fef2f2",borderRadius:6}}><div style={{fontSize:11,fontWeight:600,color:"#991b1b",marginBottom:4}}>🔴 청산 계획</div>{h[sel].finalResult.exitPlan.tp1 && <div style={{fontSize:11,color:"#7f1d1d"}}><b>TP1:</b> {h[sel].finalResult.exitPlan.tp1}</div>}{h[sel].finalResult.exitPlan.tp2 && <div style={{fontSize:11,color:"#7f1d1d"}}><b>TP2:</b> {h[sel].finalResult.exitPlan.tp2}</div>}{h[sel].finalResult.exitPlan.sl && <div style={{fontSize:11,color:"#7f1d1d"}}><b>SL:</b> {h[sel].finalResult.exitPlan.sl}</div>}{h[sel].finalResult.exitPlan.timeStop && <div style={{fontSize:11,color:"#7f1d1d"}}><b>시간:</b> {h[sel].finalResult.exitPlan.timeStop}</div>}</div>)}
                  {h[sel].finalResult.scenarios && (<div style={{marginBottom:8}}><div style={{fontSize:11,fontWeight:600,color:"#78350f",marginBottom:4}}>📊 시나리오별 대응</div>{h[sel].finalResult.scenarios.bullish && <div style={{padding:6,background:"#dcfce7",borderRadius:4,fontSize:11,marginBottom:3}}><b>📈 강세:</b> {h[sel].finalResult.scenarios.bullish}</div>}{h[sel].finalResult.scenarios.neutral && <div style={{padding:6,background:"#f3f4f6",borderRadius:4,fontSize:11,marginBottom:3}}><b>➡️ 보합:</b> {h[sel].finalResult.scenarios.neutral}</div>}{h[sel].finalResult.scenarios.bearish && <div style={{padding:6,background:"#fee2e2",borderRadius:4,fontSize:11}}><b>📉 약세:</b> {h[sel].finalResult.scenarios.bearish}</div>}</div>)}
                  {Array.isArray(h[sel].finalResult.riskFactors) && (<div style={{marginBottom:6}}><div style={{fontSize:11,fontWeight:600,color:"#dc2626",marginBottom:3}}>⚠️ 리스크</div><ul style={{margin:0,paddingLeft:18,fontSize:11,lineHeight:1.5}}>{h[sel].finalResult.riskFactors.map((r,i)=><li key={i}>{r}</li>)}</ul></div>)}
                </div>
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

function TrackTab({todaySignals}){const [data,setData]=useState(null);const [loading,setLoading]=useState(false);const [saving,setSaving]=useState(false);const [checking,setChecking]=useState(false);const [msg,setMsg]=useState(null);const load=async()=>{setLoading(true);try{const r=await fetch(TRACK_API);const j=await r.json();setData(j);}catch(e){setMsg({t:"e",v:e.message});}setLoading(false);};const saveToday=async()=>{if(!todaySignals||!todaySignals.length)return setMsg({t:"w",v:"오늘 탭에서 스크리닝 먼저 실행"});setSaving(true);try{const r=await fetch(TRACK_API,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(todaySignals.filter(s=>s.grade!=="X").map(s=>({code:s.code,name:s.name,entry_price:s.price,rate:s.change,score:s.score,grade:s.grade,supply:s.investor,wick:s.wick,vol:s.amount,market:s.market,tp1:s.tp1,tp2:s.tp2,sl:s.sl})))});const j=await r.json();setMsg({t:j.added>0?"ok":"w",v:j.github_ok?("✅ "+j.added+"건 저장 (총 "+j.total+"건)"):("⚠️ GITHUB_TOKEN 미설정")});await load();}catch(e){setMsg({t:"e",v:e.message});}setSaving(false);};const checkOutcomes=async()=>{setChecking(true);try{const r=await fetch(TRACK_API+"?check=1&limit=15");const j=await r.json();setData(j);setMsg({t:"ok",v:j.updated+"건 결과 업데이트"});}catch(e){setMsg({t:"e",v:e.message});}setChecking(false);};useEffect(()=>{load();},[]);const RC2=r=>r==="BOTH"?"#dc2626":r==="TP1"?"#2563eb":r&&r.includes("SL")?"#dc2626":r==="OPEN"?"#d97706":"#94a3b8";const gC=g=>GI[g]?.c||"#94a3b8";const mc={ok:"#f0fdf4",w:"#fffbeb",e:"#fef2f2"};const tc={ok:"#dc2626",w:"#d97706",e:"#dc2626"};const bc={ok:"#fee2e2",w:"#fcd34d",e:"#fca5a5"};return(<div><div style={{display:"flex",gap:8,marginBottom:14,flexWrap:"wrap"}}><button onClick={saveToday} disabled={saving} style={{padding:"8px 16px",borderRadius:9,border:"none",background:saving?"#e2e8f0":"#1e293b",color:saving?"#94a3b8":"#fff",fontSize:13,fontWeight:700,cursor:saving?"default":"pointer"}}>{saving?"저장 중...":"📌 오늘 신호 저장"}</button><button onClick={checkOutcomes} disabled={checking} style={{padding:"8px 16px",borderRadius:9,border:"1px solid #e2e8f0",background:"#fff",fontSize:13,fontWeight:700,cursor:checking?"default":"pointer",color:checking?"#94a3b8":"#1e293b"}}>{checking?"체크 중...":"🔄 결과 체크 (KIS)"}</button><button onClick={load} style={{padding:"8px 14px",borderRadius:9,border:"1px solid #e2e8f0",background:"#fff",fontSize:13,cursor:"pointer"}}>새로고침</button></div>{msg&&<div style={{padding:"9px 14px",borderRadius:8,marginBottom:12,background:mc[msg.t],color:tc[msg.t],border:"1px solid "+bc[msg.t],fontSize:13}}>{msg.v}</div>}{loading&&<div style={{textAlign:"center",padding:40,color:"#94a3b8"}}>로딩 중...</div>}{data&&!loading&&(<><div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:8,marginBottom:16}}>{[{l:"전체 신호",v:data.stats.total+"건",c:"#1e293b"},{l:"미결",v:data.stats.open+"건",c:"#d97706"},{l:"승률("+data.stats.resolved+"건)",v:data.stats.win_rate+"%",c:"#dc2626"},{l:"평균수익",v:(data.stats.avg_profit>=0?"+":"")+data.stats.avg_profit+"%",c:data.stats.avg_profit>=0?"#dc2626":"#2563eb"}].map((x,i)=>(<div key={i} style={{textAlign:"center",padding:"10px 6px",borderRadius:10,background:"#f8fafc",border:"1px solid #e2e8f0"}}><div style={{fontSize:10,color:"#94a3b8",marginBottom:3}}>{x.l}</div><div style={{fontSize:20,fontWeight:900,color:x.c}}>{x.v}</div></div>))}</div>{!todaySignals?.length&&(<div style={{textAlign:"center",padding:40,color:"#94a3b8"}}><div style={{fontSize:32,marginBottom:8}}>📭</div><div style={{fontSize:15,fontWeight:600}}>저장된 신호 없음</div><div style={{fontSize:13,marginTop:4}}>오늘 탭 → 신호저장 버튼 클릭</div>{!data.github_ok&&<div style={{marginTop:10,padding:"8px 14px",borderRadius:8,background:"#fffbeb",color:"#d97706",fontSize:12,border:"1px solid #fcd34d"}}>⚠️ Vercel 환경변수 GITHUB_TOKEN 추가 필요</div>}</div>)}{todaySignals.map((s,i)=>{const oc=s.outcome;const rc=oc?RC2(oc.result):"#94a3b8";const pc=oc?(oc.profit>=0?"#dc2626":"#2563eb"):"#d97706";return(<div key={i} style={{display:"flex",alignItems:"center",gap:10,padding:"11px 14px",borderRadius:12,border:"1px solid #e2e8f0",marginBottom:6,background:"#fff"}}><div style={{width:38,height:38,borderRadius:9,background:gC(s.grade)+"12",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}><span style={{fontSize:16,fontWeight:900,color:gC(s.grade)}}>{s.grade}</span></div><div style={{flex:1,minWidth:0}}><div style={{display:"flex",alignItems:"center",gap:6}}><span style={{fontWeight:700,fontSize:14}}>{s.name}</span><span style={{fontSize:11,color:"#dc2626",fontWeight:700}}>+{s.rate}%</span><span style={{fontSize:10,color:"#94a3b8"}}>{s.signal_date}</span></div><div style={{fontSize:11,color:"#94a3b8",marginTop:2}}>{s.score}점 · {s.supply} · {s.market}{oc&&oc.max_gain!==undefined?" · 최대↑+"+oc.max_gain+"% 최대↓"+oc.max_drop+"%":""}</div></div><div style={{textAlign:"right",flexShrink:0}}><div style={{fontSize:14,fontWeight:900,color:pc}}>{oc?(oc.profit>=0?"+":"")+oc.profit+"%":"—"}</div><div style={{padding:"1px 6px",borderRadius:5,background:rc+"15",color:rc,fontSize:11,fontWeight:700,marginTop:2}}>{oc?oc.result:"미결"}</div></div></div>);})}</>)}</div>);}

function VerifyTab(){const [code,setCode]=useState("");const [date,setDate]=useState("");const [expRate,setExpRate]=useState("");const [result,setResult]=useState(null);const [loading,setLoading]=useState(false);const [batch,setBatch]=useState([]);const [bLoading,setBLoading]=useState(false);const verify=async()=>{if(!code||!date)return;setLoading(true);setResult(null);try{let url=PRICE_API+"?code="+code+"&date="+date;if(expRate)url+="&verify_rate="+expRate;const r=await fetch(url);setResult(await r.json());}catch(e){setResult({ok:false,error:e.message});}setLoading(false);};const SAMPLES=[{name:"한양디지텍",code:"078350",date:"26-03-27",rate:20.8},{name:"태웅",code:"044490",date:"26-03-20",rate:26.5},{name:"네패스",code:"033640",date:"26-03-20",rate:17.1},{name:"바이오다인",code:"314930",date:"26-03-18",rate:15.0},{name:"성우하이텍",code:"015750",date:"26-03-10",rate:22.1}];const runBatch=async()=>{setBLoading(true);setBatch([]);const res=[];for(const s of SAMPLES){try{const r=await fetch(PRICE_API+"?code="+s.code+"&date="+s.date+"&verify_rate="+s.rate);const j=await r.json();res.push({...s,j});}catch(e){res.push({...s,j:{ok:false,error:e.message}});}setBatch([...res]);await new Promise(r=>setTimeout(r,400));}setBLoading(false);};const SC=s=>s==="정확"||s==="OK"?"#dc2626":s==="근사"||s==="NEAR"?"#d97706":"#dc2626";return(<div><div style={{padding:"12px 16px",borderRadius:10,background:"#eff6ff",border:"1px solid #93c5fd",fontSize:13,color:"#1d4ed8",marginBottom:16}}>KIS API로 실제 주가 조회 → data.js 값과 비교. <b>종목코드</b>는 네이버금융/HTS에서 확인.</div><div style={{background:"#f8fafc",borderRadius:12,padding:16,marginBottom:16,border:"1px solid #e2e8f0"}}><div style={{fontWeight:700,fontSize:14,marginBottom:12}}>단건 검증</div><div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8,marginBottom:10}}>{[{l:"종목코드",v:code,s:setCode,p:"예: 078350"},{l:"날짜(YY-MM-DD)",v:date,s:setDate,p:"예: 26-03-27"},{l:"data.js 등락률(%)",v:expRate,s:setExpRate,p:"예: 20.8"}].map((f,i)=>(<div key={i}><div style={{fontSize:11,color:"#64748b",marginBottom:4}}>{f.l}</div><input value={f.v} onChange={e=>f.s(e.target.value)} placeholder={f.p} style={{width:"100%",padding:"8px 10px",borderRadius:8,border:"1px solid #e2e8f0",fontSize:13,background:"#fff",outline:"none"}}/></div>))}</div><button onClick={verify} disabled={loading||!code||!date} style={{padding:"9px 20px",borderRadius:9,border:"none",background:(!code||!date)?"#e2e8f0":"#1e293b",color:(!code||!date)?"#94a3b8":"#fff",fontSize:13,fontWeight:700,cursor:(!code||!date)?"default":"pointer"}}>{loading?"조회 중...":"🔍 검증"}</button></div>{result&&(<div style={{borderRadius:12,border:"1px solid",marginBottom:16,borderColor:result.ok?"#93c5fd":"#fca5a5",background:result.ok?"#eff6ff":"#fef2f2",padding:16}}>{!result.ok&&<div style={{color:"#dc2626",fontWeight:700}}>오류: {result.kis_error||result.error}</div>}{result.ok&&(<><div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}><div><span style={{fontSize:17,fontWeight:900}}>{result.name}</span><span style={{fontSize:12,color:"#64748b",marginLeft:8}}>{result.market}</span></div>{result.verification&&<div style={{padding:"4px 12px",borderRadius:8,background:SC(result.verification.status)+"15",color:SC(result.verification.status),fontWeight:700,fontSize:13}}>{result.verification.status} (±{result.verification.diff}%p)</div>}</div>{result.target_row&&(<div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:6}}>{[{l:"실제 등락률",v:(result.target_row.rate>=0?"+":"")+result.target_row.rate+"%",big:true},{l:"data.js 등락률",v:expRate?"+"+expRate+"%":"—"},{l:"종가",v:result.target_row.close?.toLocaleString()+"원"},{l:"거래량",v:result.target_row.vol?.toLocaleString()}].map((x,i)=>(<div key={i} style={{textAlign:"center",padding:"8px 6px",background:"#fff",borderRadius:8}}><div style={{fontSize:10,color:"#94a3b8"}}>{x.l}</div><div style={{fontSize:x.big?18:14,fontWeight:700,color:x.big?"#dc2626":"#1e293b"}}>{x.v}</div></div>))}</div>)}</>)}</div>)}<div style={{background:"#f8fafc",borderRadius:12,padding:16,border:"1px solid #e2e8f0"}}><div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}><div style={{fontWeight:700,fontSize:14}}>샘플 일괄검증 (5건)</div><button onClick={runBatch} disabled={bLoading} style={{padding:"7px 16px",borderRadius:8,border:"1px solid #e2e8f0",background:"#fff",fontSize:12,fontWeight:700,cursor:bLoading?"default":"pointer",color:bLoading?"#94a3b8":"#1e293b"}}>{bLoading?"검증 중...":"▶ 실행"}</button></div>{batch.map((r,i)=>{const vr=r.j?.verification;return(<div key={i} onClick={()=>setSel(sel===i?null:i)} style={{cursor:"pointer",display:"flex",alignItems:"center",gap:10,padding:"9px 10px",borderRadius:9,border:"1px solid #e2e8f0",marginBottom:5,background:"#fff"}}><div style={{flex:1}}><span style={{fontWeight:700,fontSize:13}}>{r.name}</span><span style={{fontSize:11,color:"#94a3b8",marginLeft:6}}>{r.date} · data.js +{r.rate}%</span></div>{!r.j?.ok&&<span style={{color:"#dc2626",fontSize:12}}>오류</span>}{r.j?.ok&&!vr&&<span style={{color:"#94a3b8",fontSize:12}}>날짜없음</span>}{r.j?.ok&&vr&&(<div style={{display:"flex",gap:8,alignItems:"center"}}><span style={{fontSize:13,color:"#dc2626"}}>실제 {(vr.actual_rate>=0?"+":"")+vr.actual_rate}%</span><span style={{padding:"2px 8px",borderRadius:6,fontSize:11,fontWeight:700,background:SC(vr.status)+"15",color:SC(vr.status)}}>{vr.status} ±{vr.diff}%p</span></div>)}</div>);})}{!batch.length&&!bLoading&&<div style={{color:"#94a3b8",fontSize:13,textAlign:"center",padding:"10px 0"}}>실행 버튼 클릭 시 KIS API 실검증</div>}</div></div>);}

export default function App(){
  const [page,setPage]=useState("ai");useEffect(()=>{try{const _trash=["__bg21_resume","__data2021_partial","__supply_backup","__data2026_v2_partial","__correctedDataJS","__bf_v3","appCode_b64","chunk_ai","chunk_neo","chunk_app","__data2025_partial","__data2024_partial","__data2023_partial","__data2022_partial"];for(const _k of _trash)if(localStorage.getItem(_k))localStorage.removeItem(_k);let _tot=0;for(const _k of Object.keys(localStorage))_tot+=(localStorage.getItem(_k)||"").length;if(_tot>4000000){const _td=_getCacheDateKey();Object.keys(localStorage).forEach(_k=>{if(_k.startsWith("aianalyze_")&&!_k.endsWith(_td))localStorage.removeItem(_k);});}}catch(e){}},[]);const [detailModal,setDetailModal]=useState(null);const showFromD=(r)=>setDetailModal({name:r.n,date:r.d,market:r.m,total:r.v1Total,grade:r.v1Grade,sections:{supply:{score:r.v1Supply,max:25},breakout:{score:r.v1Breakout,max:25},momentum:{score:r.v1Momentum,max:20},sectorMaterial:{score:r.v1Sm,max:15},accumulation:{score:r.v1Acc,max:15}}});
  // 다크/라이트 모드 — body의 data-theme 속성으로 전체 페이지 동기화
  const [theme,setTheme]=useState(()=>{try{return localStorage.getItem("neo_theme")||"dark";}catch(e){return "dark";}});
  useEffect(()=>{try{localStorage.setItem("neo_theme",theme);document.documentElement.setAttribute("data-theme",theme);document.body.style.background=theme==="dark"?"#0d1117":"#ffffff";document.body.style.color=theme==="dark"?"#e6edf3":"#1e293b";}catch(e){}},[theme]);
  const _isDark=theme==="dark";
  const [history,setHistory]=useState(()=>{try{return JSON.parse(localStorage.getItem("neo_history")||"[]")}catch{return[]}});
  const [todaySignals,setTodaySignals]=useState([]);
  useEffect(()=>{fetch(HIST_URL).then(r=>r.json()).then(d=>{if(!d||!Array.isArray(d.history))return;window.__historySha=d.sha;if(d.history.length===0){try{const local=JSON.parse(localStorage.getItem("neo_history")||"[]");if(local.length>0){fetch(HIST_URL,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({history:local})}).then(r=>r.json()).then(d2=>{if(d2&&d2.sha)window.__historySha=d2.sha}).catch(()=>{});return;}}catch(_){}}setHistory(d.history);try{localStorage.setItem("neo_history",JSON.stringify(d.history))}catch(_){}}).catch(()=>{})},[]);
  const saveHistory=useCallback((entry)=>{setHistory(prev=>{const next=[entry,...prev];try{localStorage.setItem("neo_history",JSON.stringify(next));}catch(_e){try{const _trash=["__bg21_resume","__data2021_partial","__supply_backup","__data2026_v2_partial","__correctedDataJS","__bf_v3","appCode_b64","chunk_ai"];for(const _k of _trash)localStorage.removeItem(_k);const _td=_getCacheDateKey();Object.keys(localStorage).forEach(_k=>{if(_k.startsWith("aianalyze_")&&!_k.endsWith(_td))localStorage.removeItem(_k);});localStorage.setItem("neo_history",JSON.stringify(next));}catch(_e2){}}fetch(HIST_URL,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({history:next,sha:window.__historySha})}).then(r=>r.json()).then(d=>{if(d&&d.sha)window.__historySha=d.sha}).catch(()=>{});return next});setPage("history")},[]);
  const clearHistory=useCallback(()=>{setHistory([]);localStorage.removeItem("neo_history");fetch(HIST_URL,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({history:[]})}).then(r=>r.json()).then(d=>{if(d&&d.sha)window.__historySha=d.sha}).catch(()=>{})},[]);
  const deleteHistoryItem=useCallback((idx)=>{setHistory(prev=>{const next=prev.filter((_,i)=>i!==idx);localStorage.setItem("neo_history",JSON.stringify(next));fetch(HIST_URL,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({history:next,sha:window.__historySha})}).then(r=>r.json()).then(d=>{if(d&&d.sha)window.__historySha=d.sha}).catch(()=>{});return next})},[]);
  return(
    <div style={{background:_isDark?"#0d1117":"#fff",minHeight:"100vh",fontFamily:"-apple-system,'Pretendard',sans-serif",color:_isDark?"#e6edf3":"#1e293b",fontSize:15,paddingBottom:68,transition:"background .2s"}}>
      <link href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/static/pretendard.css" rel="stylesheet"/>
      {/* 다크/라이트 토글 — 우상단 고정 */}
      <button onClick={()=>setTheme(_isDark?"light":"dark")} title={_isDark?"라이트 모드":"다크 모드"} style={{position:"fixed",top:14,right:14,zIndex:200,width:38,height:38,borderRadius:8,border:"1px solid "+(_isDark?"#30363d":"#e5e8eb"),background:_isDark?"#161b22":"#fff",color:_isDark?"#e6edf3":"#1e293b",cursor:"pointer",fontSize:16,transition:"none"}}>{_isDark?"☀️":"🌙"}</button>
      <div style={{maxWidth:920,margin:"0 auto",padding:"20px 14px"}}>
        <div style={{marginBottom:16}}><h1 style={{fontSize:26,fontWeight:900,letterSpacing:"-0.5px",margin:0,color:_isDark?"#e6edf3":"#1e293b"}}>NEO-SCORE</h1><p style={{fontSize:12,color:_isDark?"#6e7681":"#94a3b8",margin:"2px 0 0"}}>종가돌파매매 · S/A/B/X · AI차트분석 · 실시간스크리닝 · 신호추적</p></div>
        {page==="today"&&<TodaySignals theme={theme} onSignalsLoaded={setTodaySignals} onSignalClick={(code)=>{window.__pendingAiCode=code;setPage("ai");}}/>}
        {page==="db"&&<SignalDB/>}
        {page==="cctoday"&&<ChimchakhaeToday apiUrl={API_URL}/>}
        {page==="jdtoday"&&<JudojuToday apiUrl={API_URL}/>}
        {page==="hstoday"&&<HaseunghoonToday apiUrl={API_URL}/>}
        {page==="ccdb"&&<ChimchakhaeDB records={D} onRowClick={showFromD}/>}
        {page==="jddb"&&<JudojuDB onRowClick={showFromD}/>}
        {page==="hsdb"&&<HaseunghoonDB onRowClick={showFromD}/>}
        {(page==="filterdb"||page==="neobaedb")&&<NeoBaeFilterDB theme={theme} onRowClick={showFromD}/>}
        {page==="ai"&&<AIAnalysis onSave={saveHistory}/>}
        {page==="history"&&<History items={history} onClear={clearHistory} onDelete={deleteHistoryItem}/>}
        {page==="track"&&<TrackTab todaySignals={todaySignals}/>}
        {page==="verify"&&<VerifyTab/>}{detailModal&&<NeoAnalysisDetailModal result={detailModal} onClose={()=>setDetailModal(null)}/>}
      </div>
      <div style={{position:"fixed",bottom:0,left:0,right:0,background:_isDark?"#161b22":"#fff",borderTop:"1px solid "+(_isDark?"#30363d":"#e5e8eb"),display:"flex",justifyContent:"center",zIndex:100}}>
        <div style={{display:"flex",maxWidth:1080,width:"100%",overflowX:"auto"}}>
          {[{id:"ai",label:"네오 Ai분석",icon:"🤖"},{id:"neobaedb",label:"네오스코어",icon:"🎯"},{id:"today",label:"네오 종배",icon:"🔥"},{id:"history",label:"히스토리",icon:"📋"}].map(t=>{
            const _act=t.id==="neobaedb"?(page==="filterdb"||page==="neobaedb"):page===t.id;
            const _activeColor=_isDark?"#e6edf3":"#191f28";const _inactiveColor=_isDark?"#6e7681":"#8b95a1";
            return(<button key={t.id} onClick={()=>setPage(t.id)} style={{flex:"1 0 auto",minWidth:65,padding:"10px 0 8px",border:"none",background:"none",cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",gap:3,position:"relative"}}>
              <span style={{fontSize:20,opacity:_act?1:0.55,transition:"opacity .15s"}}>{t.icon}</span>
              <span style={{fontSize:11,fontWeight:_act?700:500,color:_act?_activeColor:_inactiveColor,letterSpacing:"-0.2px"}}>{t.label}</span>
              {t.badge>0&&<span style={{position:"absolute",top:6,right:"calc(50% - 18px)",background:"#f04452",color:"#fff",fontSize:9,fontWeight:700,padding:"0px 4px",borderRadius:8,minWidth:14,textAlign:"center"}}>{t.badge}</span>}
            </button>);
          })}
        </div>
      </div>
    </div>
  );
}
