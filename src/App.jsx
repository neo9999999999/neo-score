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
</div><div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(148px,1fr))",gap:8,marginBottom:18}}>{["S+","S","A+","A","B+","B","C"].map(g=>{const i=GI[g],s=st[g];return(<div key={g} onClick={()=>{setTab(g);setPg(0);setOpen(null)}} style={{background:tab===g?i.c:i.bg,borderRadius:14,padding:"12px 14px",cursor:"pointer",border:tab===g?"none":"0.5px solid "+i.bd}}><div style={{display:"flex",gap:8,margin:"8px 0",padding:"8px 10px",background:"#f8fafc",borderRadius:8,border:"1px solid #e2e8f0",alignItems:"center",flexWrap:"wrap"}}><span style={{fontSize:11,fontWeight:700,color:"#475569"}}>전략설정</span><label style={{fontSize:10,color:"#64748b"}}>TP1<input type="number" value={cTP[g]?.tp1||""} onChange={(_g=>e=>setCTP(p=>({...p,[_g]:{...p[_g],tp1:+e.target.value}})))(g)} placeholder={NS[g]?.tp1} style={{width:40,margin:"0 4px",padding:"2px 4px",border:"1px solid #cbd5e1",borderRadius:4,fontSize:11}}/>%</label><label style={{fontSize:10,color:"#64748b"}}>TP2<input type="number" value={cTP[g]?.tp2||""} onChange={(_g=>e=>setCTP(p=>({...p,[_g]:{...p[_g],tp2:+e.target.value}})))(g)} placeholder={NS[g]?.tp2} style={{width:40,margin:"0 4px",padding:"2px 4px",border:"1px solid #cbd5e1",borderRadius:4,fontSize:11}}/>%</label><label style={{fontSize:10,color:"#64748b"}}>SL<input type="number" value={cTP[g]?.sl||""} onChange={(_g=>e=>setCTP(p=>({...p,[_g]:{...p[_g],sl:+e.target.value}})))(g)} placeholder={NS[g]?.sl} style={{width:40,margin:"0 4px",padding:"2px 4px",border:"1px solid #cbd5e1",borderRadius:4,fontSize:11}}/>%</label><label style={{fontSize:10,color:"#64748b"}}>강제SL<input type="number" value={cTP[g]?.fsl||""} onChange={(_g=>e=>setCTP(p=>({...p,[_g]:{...p[_g],fsl:+e.target.value}})))(g)} placeholder={NS[g]?.fsl||"off"} style={{width:40,margin:"0 4px",padding:"2px 4px",border:"1px solid #cbd5e1",borderRadius:4,fontSize:11}}/>%</label><button onClick={()=>{setCTP({...cTP,[g]:{tp1:0,tp2:0,sl:0,fsl:0}})}} style={{fontSize:10,padding:"2px 8px",background:"#e2e8f0",border:"none",borderRadius:4,cursor:"pointer"}}>초기화</button> <button onClick={()=>{const ds=D_live.filter(x=>x.ccG===g);let best=null;for(const t1 of [10,15,20,25,30])for(const t2 of [30,50,80,100])for(const sl of [3,5,7,10,15])for(const fsl of [0,7,10,15]){if(t2<=t1)continue;if(fsl>0&&fsl<sl)continue;const rs=ds.map(x=>simReal(x.ohlc,t1,t2,sl,fsl));const cum=rs.reduce((a,x)=>a+x.t,0);if(!best||cum>best.cum)best={t1,t2,sl,fsl,cum};}if(best)setCTP({...cTP,[g]:{tp1:best.t1,tp2:best.t2,sl:best.sl,fsl:best.fsl||0}});}} style={{fontSize:10,padding:"2px 8px",background:"#dbeafe",color:"#1e40af",border:"none",borderRadius:4,cursor:"pointer",marginLeft:4}}>수익MAX</button><button onClick={()=>{const ds=D_live.filter(x=>x.ccG===g);let best=null;for(const tp of [10,15,20,25,30,40,50,60,80,100])for(const sl of [3,5,7,10,15,20]){const rs=ds.map(x=>simReal(x.ohlc,tp,tp*2,sl,0));const cum=rs.reduce((a,x)=>a+x.t,0);if(!best||cum>best.cum)best={tp,sl,cum};}if(best)setCTP({...cTP,[g]:{tp1:best.tp,tp2:best.tp,sl:best.sl}});}} style={{fontSize:10,padding:"2px 8px",background:"#ffedd5",color:"#ea580c",border:"none",borderRadius:4,cursor:"pointer",marginLeft:4}}>단일TP</button>{(()=>{const ds=D_live.filter(x=>x.ccG===g);const rs=ds.map(x=>x);const cum=Math.round(rs.reduce((a,x)=>a+x.t,0));const wr=ds.length?Math.round(rs.filter(x=>x.t>0).length/ds.length*100):0;const ev=ds.length?(rs.reduce((a,x)=>a+x.t,0)/ds.length).toFixed(2):0;return(<span style={{fontSize:11,fontWeight:700,marginLeft:8}}><span style={{color:"#2563eb"}}>누적{cum>0?"+":""}{cum}%</span> <span style={{color:"#dc2626"}}>승률{wr}%</span> <span style={{color:"#7c3aed"}}>EV={ev}</span></span>)})()}</div><div style={{display:"flex",justifyContent:"space-between"}}><span style={{fontSize:26,fontWeight:900,color:tab===g?"#fff":i.c}}>{g}</span></div><div style={{fontSize:22,fontWeight:900,color:tab===g?"#fff":i.c}}>{s.n}<span style={{fontSize:11,fontWeight:400}}>건</span></div><div style={{fontSize:11,color:tab===g?"rgba(255,255,255,0.8)":"#64748b",marginTop:2}}>+{s.avg}%/건 · 승률<strong>{s.wr}%</strong> · 현행+{s.cum}%</div><div style={{fontSize:10,color:tab===g?"rgba(255,255,255,0.65)":"#94a3b8",marginTop:1}}>TP1{s.tp1c}({s.tp1r}%) · TP2{s.boc}({s.bor}%) · SL{s.slc}({s.slr}%)</div></div>)})}</div>{st[tab]&&<div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:6,marginBottom:12}}><div style={{background:"#f0fdf4",borderRadius:10,padding:"8px 10px",textAlign:"center",border:"1px solid #fee2e2"}}><div style={{fontSize:10,color:"#dc2626"}}>익절 (TP1+TP2)</div><div style={{fontSize:18,fontWeight:900,color:"#dc2626"}}>{st[tab].tp1c}건</div><div style={{fontSize:10,color:"#64748b"}}>{st[tab].tp1r}% · TP2{st[tab].boc}건({st[tab].bor}%)</div></div><div style={{background:"#fef2f2",borderRadius:10,padding:"8px 10px",textAlign:"center",border:"1px solid #fecaca"}}><div style={{fontSize:10,color:"#dc2626"}}>손절 (SL)</div><div style={{fontSize:18,fontWeight:900,color:"#dc2626"}}>{st[tab].slc}건</div><div style={{fontSize:10,color:"#64748b"}}>{Math.round((st[tab].slc)/st[tab].n*100)}%</div></div><div style={{background:"#f8fafc",borderRadius:10,padding:"8px 10px",textAlign:"center",border:"1px solid #e2e8f0"}}><div style={{fontSize:10,color:"#64748b"}}>기간만료 (TO)</div><div style={{fontSize:18,fontWeight:900,color:"#64748b"}}>{st[tab].toc}건</div><div style={{fontSize:10,color:"#94a3b8"}}>{st[tab].tor}%</div></div></div>}<div style={{borderRadius:12,border:"1px solid #e2e8f0",overflow:"hidden"}}><div style={{overflowX:"auto"}}><table style={{width:"100%",minWidth:760,borderCollapse:"collapse",fontSize:13}}><thead><tr style={{background:"#f8fafc"}}>{[{k:"d",l:"날짜"},{k:"n",l:"종목"},{k:"ch",l:"등락"},{k:"iv",l:"수급"},{k:"sc",l:"NEO"},{k:"r",l:""}].map(h=>(<th key={h.k} onClick={()=>ds(h.k)} style={{padding:"8px 5px",textAlign:h.k==="n"?"left":"center",fontWeight:600,fontSize:11,color:"#94a3b8",cursor:"pointer",borderBottom:"2px solid #e2e8f0",whiteSpace:"nowrap",userSelect:"none"}}>{h.l}{srt.c===h.k?(srt.d==="asc"?" ↑":" ↓"):""}</th>))}</tr></thead><tbody>{pd.map((r,i)=>{const isO=open===pg*PP+i,gi=GI[r.ccG];return[<tr key={"r"+i} onClick={()=>{setOpen(isO?null:pg*PP+i);onRowClick&&onRowClick(r);}} style={{cursor:"pointer",borderBottom:"1px solid #f1f5f9",background:isO?gi.bg:"#fff"}}><td style={{padding:"8px 5px",textAlign:"center",fontSize:11,color:"#94a3b8"}}>{r.d.slice(2)}</td><td style={{padding:"8px 5px",fontWeight:700,fontSize:13,maxWidth:120,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{r.n}</td><td style={{padding:"8px 5px",textAlign:"center",fontWeight:700,color:"#dc2626",fontSize:12}}>+{r.ch}%</td><td style={{padding:"8px 5px",textAlign:"center",fontSize:11,fontWeight:600,color:r.iv==="기+외"?"#7c3aed":r.iv==="외인"?"#2563eb":"#94a3b8"}}>{r.iv}</td><td style={{padding:"8px 5px",textAlign:"center"}}><span style={{background:gi.c+"12",color:gi.c,padding:"1px 7px",borderRadius:20,fontWeight:800,fontSize:12}}>{r.sc}</span></td><td style={{padding:"8px 5px",textAlign:"center",fontWeight:800,fontSize:13,color:r.t>0?"#dc2626":"#2563eb"}}>{((r.t>0?"+":"")+r.t+"%"+(function(){var a=invAmt.useSame?invAmt.same:(invAmt[r.ccG]||0);if(!a)return"";var g=Math.round(a*r.t/100);return" ("+(g>=0?"+":"")+g.toLocaleString()+"원)";})())}</td><td style={{padding:"8px 5px",textAlign:"center"}}><span style={{padding:"1px 4px",borderRadius:4,fontSize:10,fontWeight:700,background:RC(r.r)+"12",color:RC(r.r)}}>{RL(r.r)}</span></td></tr>,isO&&(<tr key={"d"+i}><td colSpan={9} style={{padding:0}}><div style={{padding:"12px 16px",background:gi.bg,borderBottom:"2px solid "+gi.bd}}><div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(80px,1fr))",gap:5,marginBottom:8}}>{[{l:"시총",v:r.mc},{l:"수급",v:r.iv},{l:"최대↑",v:"+"+r.pk+"%",c:"#dc2626"},{l:"최대↓",v:r.dd+"%",c:"#dc2626"},{l:"TP1도달일",v:r.tp1d?r.tp1d+(r.tp1dy?" ("+r.tp1dy+"일)":""):"-",c:r.tp1d?"#2563eb":"#94a3b8"},{l:"SL손절일",v:r.sld?r.sld+(r.sldy?" ("+r.sldy+"일)":""):"-",c:r.sld?"#dc2626":"#94a3b8"},{l:"TP2도달일",v:r.tp2d||"-",c:r.tp2d?"#dc2626":"#94a3b8"},{l:"청산일",v:r.exd?r.exd+(r.exdy?" ("+r.exdy+"일)":""):"-",c:"#64748b"}].map((x,j)=>(<div key={j} style={{background:"#fff",borderRadius:6,padding:"4px 6px"}}><div style={{fontSize:9,color:"#94a3b8"}}>{x.l}</div><div style={{fontSize:13,fontWeight:700,color:x.c||"#1e293b"}}>{x.v}</div></div>))}</div><div style={{background:"#fff",borderRadius:6,padding:"12px 14px"}}><div style={{display:"flex",alignItems:"baseline",gap:10,marginBottom:6,flexWrap:"wrap"}}><div style={{fontSize:22,fontWeight:900,color:r.t>=0?"#dc2626":"#2563eb"}}>실현 {r.t>0?"+":""}{r.t}%</div><div style={{fontSize:10,color:"#94a3b8",fontWeight:600}}>거래 시나리오</div></div><div style={{fontSize:11,color:"#475569",lineHeight:1.8}}>{SD(r,cTP)}</div></div></div></td></tr>)]})}</tbody></table></div></div><div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginTop:10}}><span style={{fontSize:12,color:"#94a3b8"}}>{fl.length}건 중 {pg*PP+1}~{Math.min((pg+1)*PP,fl.length)}</span><div style={{display:"flex",gap:4}}><button onClick={()=>setPg(Math.max(0,pg-1))} disabled={pg===0} style={{padding:"5px 12px",borderRadius:8,border:"1px solid #e2e8f0",background:"#fff",fontSize:13,fontWeight:700,cursor:pg===0?"default":"pointer",color:pg===0?"#e2e8f0":"#1e293b"}}>←</button><input type="number" value={pg+1} min={1} max={mx+1} onChange={e=>{const v=parseInt(e.target.value)-1;if(!isNaN(v)&&v>=0&&v<=mx)setPg(v);}} style={{padding:"5px 4px",fontSize:13,color:"#64748b",width:50,textAlign:"center",border:"1px solid #e2e8f0",borderRadius:6}}/><span style={{padding:"5px 2px",fontSize:13,color:"#94a3b8"}}>/{mx+1}</span><button onClick={()=>setPg(Math.min(mx,pg+1))} disabled={pg>=mx} style={{padding:"5px 12px",borderRadius:8,border:"1px solid #e2e8f0",background:"#fff",fontSize:13,fontWeight:700,cursor:pg>=mx?"default":"pointer",color:pg>=mx?"#e2e8f0":"#1e293b"}}>→</button></div></div></div>);}

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
</div><div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(148px,1fr))",gap:8,marginBottom:18}}>{["S+","S","A+","A","B+","B","C"].map(g=>{const i=GI[g],s=st[g];return(<div key={g} onClick={()=>{setTab(g);setPg(0);setOpen(null)}} style={{background:tab===g?i.c:i.bg,borderRadius:14,padding:"12px 14px",cursor:"pointer",border:tab===g?"none":"0.5px solid "+i.bd}}><div style={{display:"flex",gap:8,margin:"8px 0",padding:"8px 10px",background:"#f8fafc",borderRadius:8,border:"1px solid #e2e8f0",alignItems:"center",flexWrap:"wrap"}}><span style={{fontSize:11,fontWeight:700,color:"#475569"}}>전략설정</span><label style={{fontSize:10,color:"#64748b"}}>TP1<input type="number" value={cTP[g]?.tp1||""} onChange={(_g=>e=>setCTP(p=>({...p,[_g]:{...p[_g],tp1:+e.target.value}})))(g)} placeholder={NS[g]?.tp1} style={{width:40,margin:"0 4px",padding:"2px 4px",border:"1px solid #cbd5e1",borderRadius:4,fontSize:11}}/>%</label><label style={{fontSize:10,color:"#64748b"}}>TP2<input type="number" value={cTP[g]?.tp2||""} onChange={(_g=>e=>setCTP(p=>({...p,[_g]:{...p[_g],tp2:+e.target.value}})))(g)} placeholder={NS[g]?.tp2} style={{width:40,margin:"0 4px",padding:"2px 4px",border:"1px solid #cbd5e1",borderRadius:4,fontSize:11}}/>%</label><label style={{fontSize:10,color:"#64748b"}}>SL<input type="number" value={cTP[g]?.sl||""} onChange={(_g=>e=>setCTP(p=>({...p,[_g]:{...p[_g],sl:+e.target.value}})))(g)} placeholder={NS[g]?.sl} style={{width:40,margin:"0 4px",padding:"2px 4px",border:"1px solid #cbd5e1",borderRadius:4,fontSize:11}}/>%</label><label style={{fontSize:10,color:"#64748b"}}>강제SL<input type="number" value={cTP[g]?.fsl||""} onChange={(_g=>e=>setCTP(p=>({...p,[_g]:{...p[_g],fsl:+e.target.value}})))(g)} placeholder={NS[g]?.fsl||"off"} style={{width:40,margin:"0 4px",padding:"2px 4px",border:"1px solid #cbd5e1",borderRadius:4,fontSize:11}}/>%</label><button onClick={()=>{setCTP({...cTP,[g]:{tp1:0,tp2:0,sl:0,fsl:0}})}} style={{fontSize:10,padding:"2px 8px",background:"#e2e8f0",border:"none",borderRadius:4,cursor:"pointer"}}>초기화</button> <button onClick={()=>{const ds=D_live.filter(x=>x.jdG===g);let best=null;for(const t1 of [10,15,20,25,30])for(const t2 of [30,50,80,100])for(const sl of [3,5,7,10,15])for(const fsl of [0,7,10,15]){if(t2<=t1)continue;if(fsl>0&&fsl<sl)continue;const rs=ds.map(x=>simReal(x.ohlc,t1,t2,sl,fsl));const cum=rs.reduce((a,x)=>a+x.t,0);if(!best||cum>best.cum)best={t1,t2,sl,fsl,cum};}if(best)setCTP({...cTP,[g]:{tp1:best.t1,tp2:best.t2,sl:best.sl,fsl:best.fsl||0}});}} style={{fontSize:10,padding:"2px 8px",background:"#dbeafe",color:"#1e40af",border:"none",borderRadius:4,cursor:"pointer",marginLeft:4}}>수익MAX</button><button onClick={()=>{const ds=D_live.filter(x=>x.jdG===g);let best=null;for(const tp of [10,15,20,25,30,40,50,60,80,100])for(const sl of [3,5,7,10,15,20]){const rs=ds.map(x=>simReal(x.ohlc,tp,tp*2,sl,0));const cum=rs.reduce((a,x)=>a+x.t,0);if(!best||cum>best.cum)best={tp,sl,cum};}if(best)setCTP({...cTP,[g]:{tp1:best.tp,tp2:best.tp,sl:best.sl}});}} style={{fontSize:10,padding:"2px 8px",background:"#ffedd5",color:"#ea580c",border:"none",borderRadius:4,cursor:"pointer",marginLeft:4}}>단일TP</button>{(()=>{const ds=D_live.filter(x=>x.jdG===g);const rs=ds.map(x=>x);const cum=Math.round(rs.reduce((a,x)=>a+x.t,0));const wr=ds.length?Math.round(rs.filter(x=>x.t>0).length/ds.length*100):0;const ev=ds.length?(rs.reduce((a,x)=>a+x.t,0)/ds.length).toFixed(2):0;return(<span style={{fontSize:11,fontWeight:700,marginLeft:8}}><span style={{color:"#2563eb"}}>누적{cum>0?"+":""}{cum}%</span> <span style={{color:"#dc2626"}}>승률{wr}%</span> <span style={{color:"#7c3aed"}}>EV={ev}</span></span>)})()}</div><div style={{display:"flex",justifyContent:"space-between"}}><span style={{fontSize:26,fontWeight:900,color:tab===g?"#fff":i.c}}>{g}</span></div><div style={{fontSize:22,fontWeight:900,color:tab===g?"#fff":i.c}}>{s.n}<span style={{fontSize:11,fontWeight:400}}>건</span></div><div style={{fontSize:11,color:tab===g?"rgba(255,255,255,0.8)":"#64748b",marginTop:2}}>+{s.avg}%/건 · 승률<strong>{s.wr}%</strong> · 현행+{s.cum}%</div><div style={{fontSize:10,color:tab===g?"rgba(255,255,255,0.65)":"#94a3b8",marginTop:1}}>TP1{s.tp1c}({s.tp1r}%) · TP2{s.boc}({s.bor}%) · SL{s.slc}({s.slr}%)</div></div>)})}</div>{st[tab]&&<div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:6,marginBottom:12}}><div style={{background:"#f0fdf4",borderRadius:10,padding:"8px 10px",textAlign:"center",border:"1px solid #fee2e2"}}><div style={{fontSize:10,color:"#dc2626"}}>익절 (TP1+TP2)</div><div style={{fontSize:18,fontWeight:900,color:"#dc2626"}}>{st[tab].tp1c}건</div><div style={{fontSize:10,color:"#64748b"}}>{st[tab].tp1r}% · TP2{st[tab].boc}건({st[tab].bor}%)</div></div><div style={{background:"#fef2f2",borderRadius:10,padding:"8px 10px",textAlign:"center",border:"1px solid #fecaca"}}><div style={{fontSize:10,color:"#dc2626"}}>손절 (SL)</div><div style={{fontSize:18,fontWeight:900,color:"#dc2626"}}>{st[tab].slc}건</div><div style={{fontSize:10,color:"#64748b"}}>{Math.round((st[tab].slc)/st[tab].n*100)}%</div></div><div style={{background:"#f8fafc",borderRadius:10,padding:"8px 10px",textAlign:"center",border:"1px solid #e2e8f0"}}><div style={{fontSize:10,color:"#64748b"}}>기간만료 (TO)</div><div style={{fontSize:18,fontWeight:900,color:"#64748b"}}>{st[tab].toc}건</div><div style={{fontSize:10,color:"#94a3b8"}}>{st[tab].tor}%</div></div></div>}<div style={{borderRadius:12,border:"1px solid #e2e8f0",overflow:"hidden"}}><div style={{overflowX:"auto"}}><table style={{width:"100%",minWidth:760,borderCollapse:"collapse",fontSize:13}}><thead><tr style={{background:"#f8fafc"}}>{[{k:"d",l:"날짜"},{k:"n",l:"종목"},{k:"ch",l:"등락"},{k:"iv",l:"수급"},{k:"sc",l:"NEO"},{k:"r",l:""}].map(h=>(<th key={h.k} onClick={()=>ds(h.k)} style={{padding:"8px 5px",textAlign:h.k==="n"?"left":"center",fontWeight:600,fontSize:11,color:"#94a3b8",cursor:"pointer",borderBottom:"2px solid #e2e8f0",whiteSpace:"nowrap",userSelect:"none"}}>{h.l}{srt.c===h.k?(srt.d==="asc"?" ↑":" ↓"):""}</th>))}</tr></thead><tbody>{pd.map((r,i)=>{const isO=open===pg*PP+i,gi=GI[r.jdG];return[<tr key={"r"+i} onClick={()=>{setOpen(isO?null:pg*PP+i);onRowClick&&onRowClick(r);}} style={{cursor:"pointer",borderBottom:"1px solid #f1f5f9",background:isO?gi.bg:"#fff"}}><td style={{padding:"8px 5px",textAlign:"center",fontSize:11,color:"#94a3b8"}}>{r.d.slice(2)}</td><td style={{padding:"8px 5px",fontWeight:700,fontSize:13,maxWidth:120,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{r.n}</td><td style={{padding:"8px 5px",textAlign:"center",fontWeight:700,color:"#dc2626",fontSize:12}}>+{r.ch}%</td><td style={{padding:"8px 5px",textAlign:"center",fontSize:11,fontWeight:600,color:r.iv==="기+외"?"#7c3aed":r.iv==="외인"?"#2563eb":"#94a3b8"}}>{r.iv}</td><td style={{padding:"8px 5px",textAlign:"center"}}><span style={{background:gi.c+"12",color:gi.c,padding:"1px 7px",borderRadius:20,fontWeight:800,fontSize:12}}>{r.sc}</span></td><td style={{padding:"8px 5px",textAlign:"center",fontWeight:800,fontSize:13,color:r.t>0?"#dc2626":"#2563eb"}}>{((r.t>0?"+":"")+r.t+"%"+(function(){var a=invAmt.useSame?invAmt.same:(invAmt[r.jdG]||0);if(!a)return"";var g=Math.round(a*r.t/100);return" ("+(g>=0?"+":"")+g.toLocaleString()+"원)";})())}</td><td style={{padding:"8px 5px",textAlign:"center"}}><span style={{padding:"1px 4px",borderRadius:4,fontSize:10,fontWeight:700,background:RC(r.r)+"12",color:RC(r.r)}}>{RL(r.r)}</span></td></tr>,isO&&(<tr key={"d"+i}><td colSpan={9} style={{padding:0}}><div style={{padding:"12px 16px",background:gi.bg,borderBottom:"2px solid "+gi.bd}}><div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(80px,1fr))",gap:5,marginBottom:8}}>{[{l:"시총",v:r.mc},{l:"수급",v:r.iv},{l:"최대↑",v:"+"+r.pk+"%",c:"#dc2626"},{l:"최대↓",v:r.dd+"%",c:"#dc2626"},{l:"TP1도달일",v:r.tp1d?r.tp1d+(r.tp1dy?" ("+r.tp1dy+"일)":""):"-",c:r.tp1d?"#2563eb":"#94a3b8"},{l:"SL손절일",v:r.sld?r.sld+(r.sldy?" ("+r.sldy+"일)":""):"-",c:r.sld?"#dc2626":"#94a3b8"},{l:"TP2도달일",v:r.tp2d||"-",c:r.tp2d?"#dc2626":"#94a3b8"},{l:"청산일",v:r.exd?r.exd+(r.exdy?" ("+r.exdy+"일)":""):"-",c:"#64748b"}].map((x,j)=>(<div key={j} style={{background:"#fff",borderRadius:6,padding:"4px 6px"}}><div style={{fontSize:9,color:"#94a3b8"}}>{x.l}</div><div style={{fontSize:13,fontWeight:700,color:x.c||"#1e293b"}}>{x.v}</div></div>))}</div><div style={{background:"#fff",borderRadius:6,padding:"12px 14px"}}><div style={{display:"flex",alignItems:"baseline",gap:10,marginBottom:6,flexWrap:"wrap"}}><div style={{fontSize:22,fontWeight:900,color:r.t>=0?"#dc2626":"#2563eb"}}>실현 {r.t>0?"+":""}{r.t}%</div><div style={{fontSize:10,color:"#94a3b8",fontWeight:600}}>거래 시나리오</div></div><div style={{fontSize:11,color:"#475569",lineHeight:1.8}}>{SD(r,cTP)}</div></div></div></td></tr>)]})}</tbody></table></div></div><div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginTop:10}}><span style={{fontSize:12,color:"#94a3b8"}}>{fl.length}건 중 {pg*PP+1}~{Math.min((pg+1)*PP,fl.length)}</span><div style={{display:"flex",gap:4}}><button onClick={()=>setPg(Math.max(0,pg-1))} disabled={pg===0} style={{padding:"5px 12px",borderRadius:8,border:"1px solid #e2e8f0",background:"#fff",fontSize:13,fontWeight:700,cursor:pg===0?"default":"pointer",color:pg===0?"#e2e8f0":"#1e293b"}}>←</button><input type="number" value={pg+1} min={1} max={mx+1} onChange={e=>{const v=parseInt(e.target.value)-1;if(!isNaN(v)&&v>=0&&v<=mx)setPg(v);}} style={{padding:"5px 4px",fontSize:13,color:"#64748b",width:50,textAlign:"center",border:"1px solid #e2e8f0",borderRadius:6}}/><span style={{padding:"5px 2px",fontSize:13,color:"#94a3b8"}}>/{mx+1}</span><button onClick={()=>setPg(Math.min(mx,pg+1))} disabled={pg>=mx} style={{padding:"5px 12px",borderRadius:8,border:"1px solid #e2e8f0",background:"#fff",fontSize:13,fontWeight:700,cursor:pg>=mx?"default":"pointer",color:pg>=mx?"#e2e8f0":"#1e293b"}}>→</button></div></div></div>);}



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
</div><div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(148px,1fr))",gap:8,marginBottom:18}}>{["S+","S","A+","A","B+","B","C"].map(g=>{const i=GI[g],s=st[g];return(<div key={g} onClick={()=>{setTab(g);setPg(0);setOpen(null)}} style={{background:tab===g?i.c:i.bg,borderRadius:14,padding:"12px 14px",cursor:"pointer",border:tab===g?"none":"0.5px solid "+i.bd}}><div style={{display:"flex",gap:8,margin:"8px 0",padding:"8px 10px",background:"#f8fafc",borderRadius:8,border:"1px solid #e2e8f0",alignItems:"center",flexWrap:"wrap"}}><span style={{fontSize:11,fontWeight:700,color:"#475569"}}>전략설정</span><label style={{fontSize:10,color:"#64748b"}}>TP1<input type="number" value={cTP[g]?.tp1||""} onChange={(_g=>e=>setCTP(p=>({...p,[_g]:{...p[_g],tp1:+e.target.value}})))(g)} placeholder={NS[g]?.tp1} style={{width:40,margin:"0 4px",padding:"2px 4px",border:"1px solid #cbd5e1",borderRadius:4,fontSize:11}}/>%</label><label style={{fontSize:10,color:"#64748b"}}>TP2<input type="number" value={cTP[g]?.tp2||""} onChange={(_g=>e=>setCTP(p=>({...p,[_g]:{...p[_g],tp2:+e.target.value}})))(g)} placeholder={NS[g]?.tp2} style={{width:40,margin:"0 4px",padding:"2px 4px",border:"1px solid #cbd5e1",borderRadius:4,fontSize:11}}/>%</label><label style={{fontSize:10,color:"#64748b"}}>SL<input type="number" value={cTP[g]?.sl||""} onChange={(_g=>e=>setCTP(p=>({...p,[_g]:{...p[_g],sl:+e.target.value}})))(g)} placeholder={NS[g]?.sl} style={{width:40,margin:"0 4px",padding:"2px 4px",border:"1px solid #cbd5e1",borderRadius:4,fontSize:11}}/>%</label><label style={{fontSize:10,color:"#64748b"}}>강제SL<input type="number" value={cTP[g]?.fsl||""} onChange={(_g=>e=>setCTP(p=>({...p,[_g]:{...p[_g],fsl:+e.target.value}})))(g)} placeholder={NS[g]?.fsl||"off"} style={{width:40,margin:"0 4px",padding:"2px 4px",border:"1px solid #cbd5e1",borderRadius:4,fontSize:11}}/>%</label><button onClick={()=>{setCTP({...cTP,[g]:{tp1:0,tp2:0,sl:0,fsl:0}})}} style={{fontSize:10,padding:"2px 8px",background:"#e2e8f0",border:"none",borderRadius:4,cursor:"pointer"}}>초기화</button> <button onClick={()=>{const ds=D_live.filter(x=>x.hsG===g);let best=null;for(const t1 of [10,15,20,25,30])for(const t2 of [30,50,80,100])for(const sl of [3,5,7,10,15])for(const fsl of [0,7,10,15]){if(t2<=t1)continue;if(fsl>0&&fsl<sl)continue;const rs=ds.map(x=>simReal(x.ohlc,t1,t2,sl,fsl));const cum=rs.reduce((a,x)=>a+x.t,0);if(!best||cum>best.cum)best={t1,t2,sl,fsl,cum};}if(best)setCTP({...cTP,[g]:{tp1:best.t1,tp2:best.t2,sl:best.sl,fsl:best.fsl||0}});}} style={{fontSize:10,padding:"2px 8px",background:"#dbeafe",color:"#1e40af",border:"none",borderRadius:4,cursor:"pointer",marginLeft:4}}>수익MAX</button><button onClick={()=>{const ds=D_live.filter(x=>x.hsG===g);let best=null;for(const tp of [10,15,20,25,30,40,50,60,80,100])for(const sl of [3,5,7,10,15,20]){const rs=ds.map(x=>simReal(x.ohlc,tp,tp*2,sl,0));const cum=rs.reduce((a,x)=>a+x.t,0);if(!best||cum>best.cum)best={tp,sl,cum};}if(best)setCTP({...cTP,[g]:{tp1:best.tp,tp2:best.tp,sl:best.sl}});}} style={{fontSize:10,padding:"2px 8px",background:"#ffedd5",color:"#ea580c",border:"none",borderRadius:4,cursor:"pointer",marginLeft:4}}>단일TP</button>{(()=>{const ds=D_live.filter(x=>x.hsG===g);const rs=ds.map(x=>x);const cum=Math.round(rs.reduce((a,x)=>a+x.t,0));const wr=ds.length?Math.round(rs.filter(x=>x.t>0).length/ds.length*100):0;const ev=ds.length?(rs.reduce((a,x)=>a+x.t,0)/ds.length).toFixed(2):0;return(<span style={{fontSize:11,fontWeight:700,marginLeft:8}}><span style={{color:"#2563eb"}}>누적{cum>0?"+":""}{cum}%</span> <span style={{color:"#dc2626"}}>승률{wr}%</span> <span style={{color:"#7c3aed"}}>EV={ev}</span></span>)})()}</div><div style={{display:"flex",justifyContent:"space-between"}}><span style={{fontSize:26,fontWeight:900,color:tab===g?"#fff":i.c}}>{g}</span></div><div style={{fontSize:22,fontWeight:900,color:tab===g?"#fff":i.c}}>{s.n}<span style={{fontSize:11,fontWeight:400}}>건</span></div><div style={{fontSize:11,color:tab===g?"rgba(255,255,255,0.8)":"#64748b",marginTop:2}}>+{s.avg}%/건 · 승률<strong>{s.wr}%</strong> · 현행+{s.cum}%</div><div style={{fontSize:10,color:tab===g?"rgba(255,255,255,0.65)":"#94a3b8",marginTop:1}}>TP1{s.tp1c}({s.tp1r}%) · TP2{s.boc}({s.bor}%) · SL{s.slc}({s.slr}%)</div></div>)})}</div>{st[tab]&&<div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:6,marginBottom:12}}><div style={{background:"#f0fdf4",borderRadius:10,padding:"8px 10px",textAlign:"center",border:"1px solid #fee2e2"}}><div style={{fontSize:10,color:"#dc2626"}}>익절 (TP1+TP2)</div><div style={{fontSize:18,fontWeight:900,color:"#dc2626"}}>{st[tab].tp1c}건</div><div style={{fontSize:10,color:"#64748b"}}>{st[tab].tp1r}% · TP2{st[tab].boc}건({st[tab].bor}%)</div></div><div style={{background:"#fef2f2",borderRadius:10,padding:"8px 10px",textAlign:"center",border:"1px solid #fecaca"}}><div style={{fontSize:10,color:"#dc2626"}}>손절 (SL)</div><div style={{fontSize:18,fontWeight:900,color:"#dc2626"}}>{st[tab].slc}건</div><div style={{fontSize:10,color:"#64748b"}}>{Math.round((st[tab].slc)/st[tab].n*100)}%</div></div><div style={{background:"#f8fafc",borderRadius:10,padding:"8px 10px",textAlign:"center",border:"1px solid #e2e8f0"}}><div style={{fontSize:10,color:"#64748b"}}>기간만료 (TO)</div><div style={{fontSize:18,fontWeight:900,color:"#64748b"}}>{st[tab].toc}건</div><div style={{fontSize:10,color:"#94a3b8"}}>{st[tab].tor}%</div></div></div>}<div style={{borderRadius:12,border:"1px solid #e2e8f0",overflow:"hidden"}}><div style={{overflowX:"auto"}}><table style={{width:"100%",minWidth:760,borderCollapse:"collapse",fontSize:13}}><thead><tr style={{background:"#f8fafc"}}>{[{k:"d",l:"날짜"},{k:"n",l:"종목"},{k:"ch",l:"등락"},{k:"iv",l:"수급"},{k:"sc",l:"NEO"},{k:"r",l:""}].map(h=>(<th key={h.k} onClick={()=>ds(h.k)} style={{padding:"8px 5px",textAlign:h.k==="n"?"left":"center",fontWeight:600,fontSize:11,color:"#94a3b8",cursor:"pointer",borderBottom:"2px solid #e2e8f0",whiteSpace:"nowrap",userSelect:"none"}}>{h.l}{srt.c===h.k?(srt.d==="asc"?" ↑":" ↓"):""}</th>))}</tr></thead><tbody>{pd.map((r,i)=>{const isO=open===pg*PP+i,gi=GI[r.hsG];return[<tr key={"r"+i} onClick={()=>{setOpen(isO?null:pg*PP+i);onRowClick&&onRowClick(r);}} style={{cursor:"pointer",borderBottom:"1px solid #f1f5f9",background:isO?gi.bg:"#fff"}}><td style={{padding:"8px 5px",textAlign:"center",fontSize:11,color:"#94a3b8"}}>{r.d.slice(2)}</td><td style={{padding:"8px 5px",fontWeight:700,fontSize:13,maxWidth:120,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{r.n}</td><td style={{padding:"8px 5px",textAlign:"center",fontWeight:700,color:"#dc2626",fontSize:12}}>+{r.ch}%</td><td style={{padding:"8px 5px",textAlign:"center",fontSize:11,fontWeight:600,color:r.iv==="기+외"?"#7c3aed":r.iv==="외인"?"#2563eb":"#94a3b8"}}>{r.iv}</td><td style={{padding:"8px 5px",textAlign:"center"}}><span style={{background:gi.c+"12",color:gi.c,padding:"1px 7px",borderRadius:20,fontWeight:800,fontSize:12}}>{r.sc}</span></td><td style={{padding:"8px 5px",textAlign:"center",fontWeight:800,fontSize:13,color:r.t>0?"#dc2626":"#2563eb"}}>{((r.t>0?"+":"")+r.t+"%"+(function(){var a=invAmt.useSame?invAmt.same:(invAmt[r.hsG]||0);if(!a)return"";var g=Math.round(a*r.t/100);return" ("+(g>=0?"+":"")+g.toLocaleString()+"원)";})())}</td><td style={{padding:"8px 5px",textAlign:"center"}}><span style={{padding:"1px 4px",borderRadius:4,fontSize:10,fontWeight:700,background:RC(r.r)+"12",color:RC(r.r)}}>{RL(r.r)}</span></td></tr>,isO&&(<tr key={"d"+i}><td colSpan={9} style={{padding:0}}><div style={{padding:"12px 16px",background:gi.bg,borderBottom:"2px solid "+gi.bd}}><div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(80px,1fr))",gap:5,marginBottom:8}}>{[{l:"시총",v:r.mc},{l:"수급",v:r.iv},{l:"최대↑",v:"+"+r.pk+"%",c:"#dc2626"},{l:"최대↓",v:r.dd+"%",c:"#dc2626"},{l:"TP1도달일",v:r.tp1d?r.tp1d+(r.tp1dy?" ("+r.tp1dy+"일)":""):"-",c:r.tp1d?"#2563eb":"#94a3b8"},{l:"SL손절일",v:r.sld?r.sld+(r.sldy?" ("+r.sldy+"일)":""):"-",c:r.sld?"#dc2626":"#94a3b8"},{l:"TP2도달일",v:r.tp2d||"-",c:r.tp2d?"#dc2626":"#94a3b8"},{l:"청산일",v:r.exd?r.exd+(r.exdy?" ("+r.exdy+"일)":""):"-",c:"#64748b"}].map((x,j)=>(<div key={j} style={{background:"#fff",borderRadius:6,padding:"4px 6px"}}><div style={{fontSize:9,color:"#94a3b8"}}>{x.l}</div><div style={{fontSize:13,fontWeight:700,color:x.c||"#1e293b"}}>{x.v}</div></div>))}</div><div style={{background:"#fff",borderRadius:6,padding:"12px 14px"}}><div style={{display:"flex",alignItems:"baseline",gap:10,marginBottom:6,flexWrap:"wrap"}}><div style={{fontSize:22,fontWeight:900,color:r.t>=0?"#dc2626":"#2563eb"}}>실현 {r.t>0?"+":""}{r.t}%</div><div style={{fontSize:10,color:"#94a3b8",fontWeight:600}}>거래 시나리오</div></div><div style={{fontSize:11,color:"#475569",lineHeight:1.8}}>{SD(r,cTP)}</div></div></div></td></tr>)]})}</tbody></table></div></div><div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginTop:10}}><span style={{fontSize:12,color:"#94a3b8"}}>{fl.length}건 중 {pg*PP+1}~{Math.min((pg+1)*PP,fl.length)}</span><div style={{display:"flex",gap:4}}><button onClick={()=>setPg(Math.max(0,pg-1))} disabled={pg===0} style={{padding:"5px 12px",borderRadius:8,border:"1px solid #e2e8f0",background:"#fff",fontSize:13,fontWeight:700,cursor:pg===0?"default":"pointer",color:pg===0?"#e2e8f0":"#1e293b"}}>←</button><input type="number" value={pg+1} min={1} max={mx+1} onChange={e=>{const v=parseInt(e.target.value)-1;if(!isNaN(v)&&v>=0&&v<=mx)setPg(v);}} style={{padding:"5px 4px",fontSize:13,color:"#64748b",width:50,textAlign:"center",border:"1px solid #e2e8f0",borderRadius:6}}/><span style={{padding:"5px 2px",fontSize:13,color:"#94a3b8"}}>/{mx+1}</span><button onClick={()=>setPg(Math.min(mx,pg+1))} disabled={pg>=mx} style={{padding:"5px 12px",borderRadius:8,border:"1px solid #e2e8f0",background:"#fff",fontSize:13,fontWeight:700,cursor:pg>=mx?"default":"pointer",color:pg>=mx?"#e2e8f0":"#1e293b"}}>→</button></div></div></div>);}



function MultiFilterDB({onRowClick}={}){
const _g7=['S+','S','A+','A','B+','B','C'];
const _hsg=['A+','A','C'];
const _ng=['S','A','B','X'];
// 검증된 프리셋 (24,355건 6년 백테스트 직접 산출)
const _presets=[
// Tier 1 — 6년 검증된 알파
{label:'🌟 6년 알파',desc:'침S+×주S (6/6년 양수, n=163, +3.16%)',n:[],c:['S+'],j:['S'],h:[],mc:'all',yr:'all'},
{label:'💎 6년 수익왕',desc:'Neo:B×주A (5/5년 양수, n=103, +5.63%)',n:['B'],c:[],j:['A'],h:[],mc:'all',yr:'all'},
// Tier 2 — 단일년도 1위
{label:'21형',desc:'Neo:S 침S 주A+ 하A (52%·+9.89%)',n:['S'],c:['S'],j:['A+'],h:['A'],mc:'all',yr:'21'},
{label:'22형',desc:'침C 주B (베어보합 +0.09%)',n:[],c:['C'],j:['B'],h:[],mc:'all',yr:'22'},
{label:'23형',desc:'Neo:B 침B 주B+ (51.5%·+5.98%)',n:['B'],c:['B'],j:['B+'],h:[],mc:'all',yr:'23'},
{label:'24형',desc:'침S+×주S (42.9%·+3.49%)',n:[],c:['S+'],j:['S'],h:[],mc:'all',yr:'24'},
{label:'25형',desc:'Neo:S 침S+ 주A+ (47.2%·+5.25%)',n:['S'],c:['S+'],j:['A+'],h:[],mc:'all',yr:'25'},
{label:'26형',desc:'Neo:A 침B+ 주B (50%·+6.99%)',n:['A'],c:['B+'],j:['B'],h:[],mc:'all',yr:'26'},
{label:'🔄 초기화',desc:'',n:[],c:[],j:[],h:[],mc:'all',yr:null}
];
// 년도별 자동 적용 매핑 (yf 변경시 디폴트 필터)
const _yrAutoMap={
'all':{n:[],c:['S+'],j:['S'],h:[],mc:'all'},
'21':{n:['S'],c:['S'],j:['A+'],h:['A'],mc:'all'},
'22':{n:[],c:['C'],j:['B'],h:[],mc:'all'},
'23':{n:['B'],c:['B'],j:['B+'],h:[],mc:'all'},
'24':{n:[],c:['S+'],j:['S'],h:[],mc:'all'},
'25':{n:['S'],c:['S+'],j:['A+'],h:[],mc:'all'},
'26':{n:['A'],c:['B+'],j:['B'],h:[],mc:'all'}
};
const [selN,setSelN]=useState([]);
const [selCC,setSelCC]=useState([]);
const [selJD,setSelJD]=useState([]);
const [selHS,setSelHS]=useState([]);
const [yf,setYf]=useState('all');
const [hideSL,setHideSL]=useState(false);
const [sortMode,setSortMode]=useState('profit');
const [mc,setMc]=useState('all');
const filtered=useMemo(()=>{
let arr=D.filter(r=>{
if(yf!=='all'&&r.d&&r.d.slice(2,4)!==yf)return false;
if(selN.length&&!selN.includes(r.g))return false;
if(selCC.length&&!selCC.includes(r.ccG))return false;
if(selJD.length&&!selJD.includes(r.jdG))return false;
if(selHS.length&&!selHS.includes(r.hsG))return false;
if(hideSL&&(r.r==='SL'||String(r.r||'').startsWith('SL')))return false;
if(mc==='bear'&&(r.prevAvgRet==null||r.prevAvgRet>=-1))return false;
if(mc==='bull'&&(r.prevAvgRet==null||r.prevAvgRet<1))return false;
if(mc==='flat'&&(r.prevAvgRet==null||r.prevAvgRet<-1||r.prevAvgRet>=1))return false;
return true;
});
if(sortMode==='profit')return arr.sort((a,b)=>(b.t||0)-(a.t||0));
if(sortMode==='oldest')return arr.sort((a,b)=>String(a.d||'').localeCompare(String(b.d||'')));
if(sortMode==='newest')return arr.sort((a,b)=>String(b.d||'').localeCompare(String(a.d||'')));
return arr;
},[selN,selCC,selJD,selHS,yf,hideSL,sortMode,mc]);
const stats=useMemo(()=>{
if(!filtered.length)return null;
const p5=filtered.filter(x=>(x.t||0)>=5&&x.r!=='SL'&&!String(x.r||'').startsWith('SL'));
const sl=filtered.filter(x=>x.r==='SL'||String(x.r||'').startsWith('SL'));
const avg=filtered.reduce((a,b)=>a+(b.t||0),0)/filtered.length;
return {n:filtered.length,p5:p5.length,sl:sl.length,avg};
},[filtered]);
const _applyFilter=(p)=>{setSelN(p.n);setSelCC(p.c);setSelJD(p.j);setSelHS(p.h);setMc(p.mc||'all');};
const applyP=(p)=>{_applyFilter(p);if(p.yr!==undefined&&p.yr!==null)setYf(p.yr);};
// 년도 변경시 자동으로 그 년도의 1위 조합 필터 세팅 (검증된 알파)
useEffect(()=>{const m=_yrAutoMap[yf];if(m){_applyFilter(m);}},[yf]);
const Tg=({arr,setArr,val,col})=>(<button onClick={()=>setArr(arr.includes(val)?arr.filter(x=>x!==val):[...arr,val])} style={{padding:'6px 10px',borderRadius:6,border:'1px solid '+(arr.includes(val)?col:'#cbd5e1'),background:arr.includes(val)?col:'#fff',color:arr.includes(val)?'#fff':'#475569',fontSize:11,fontWeight:arr.includes(val)?700:500,cursor:'pointer',marginRight:4,marginBottom:4}}>{val}</button>);
const _sorts=[{id:'profit',l:'💰 익절순'},{id:'newest',l:'🆕 최신순'},{id:'oldest',l:'📜 오래된순'}];
const _mcs=[{id:'all',l:'전체'},{id:'bear',l:'약세 후'},{id:'flat',l:'훡보'},{id:'bull',l:'강세 후'}];
return (<div style={{padding:'12px'}}>
<div style={{marginBottom:12,padding:10,background:'#fef3c7',borderRadius:8,border:'1px solid #fbbf24'}}>
<div style={{fontSize:12,fontWeight:700,marginBottom:8,color:'#92400e'}}>⭐ 최적 프리셋 (검증된 강력 패턴)</div>
<div style={{display:'flex',flexWrap:'wrap',gap:6}}>
{_presets.map((p,i)=>(<button key={i} onClick={()=>applyP(p)} style={{padding:'8px 12px',borderRadius:6,border:'1px solid #fbbf24',background:'#fff',color:'#92400e',fontSize:11,fontWeight:600,cursor:'pointer',display:'flex',flexDirection:'column',alignItems:'flex-start',minWidth:130,textAlign:'left'}}><span style={{fontWeight:700}}>{p.label}</span>{p.desc&&<span style={{fontSize:9,color:'#a16207',marginTop:2}}>{p.desc}</span>}</button>))}
</div></div>
<div style={{marginBottom:10,padding:8,background:'#eff6ff',borderRadius:6,border:'1px solid #93c5fd'}}>
<div style={{fontSize:11,fontWeight:700,marginBottom:6,color:'#1e40af'}}>📉 시장 컨디션 (직전월 평균 수익)</div>
{_mcs.map(m=>(<button key={m.id} onClick={()=>setMc(m.id)} style={{padding:'5px 10px',borderRadius:5,border:'1px solid '+(mc===m.id?'#1e40af':'#bfdbfe'),background:mc===m.id?'#1e40af':'#fff',color:mc===m.id?'#fff':'#1e40af',fontSize:11,marginRight:4,cursor:'pointer'}}>{m.l}</button>))}
</div>
<div style={{marginBottom:10}}><div style={{fontSize:12,fontWeight:700,marginBottom:6}}>📅 연도</div>
{['all','21','22','23','24','25','26'].map(y=>(<button key={y} onClick={()=>setYf(y)} style={{padding:'6px 10px',borderRadius:6,border:'1px solid '+(yf===y?'#1e293b':'#cbd5e1'),background:yf===y?'#1e293b':'#fff',color:yf===y?'#fff':'#475569',fontSize:11,marginRight:4,cursor:'pointer'}}>{y==='all'?'전체':y+'년'}</button>))}
<button onClick={()=>setHideSL(!hideSL)} style={{padding:'6px 10px',borderRadius:6,border:'1px solid '+(hideSL?'#dc2626':'#cbd5e1'),background:hideSL?'#dc2626':'#fff',color:hideSL?'#fff':'#475569',fontSize:11,marginLeft:8,cursor:'pointer'}}>손절 숨김</button>
</div>
<div style={{marginBottom:8}}><div style={{fontSize:12,fontWeight:700,marginBottom:6,color:'#10b981'}}>💰 네오 (거래대금)</div>{_ng.map(g=>(<Tg key={g} arr={selN} setArr={setSelN} val={g} col="#10b981"/>))}</div>
<div style={{marginBottom:8}}><div style={{fontSize:12,fontWeight:700,marginBottom:6,color:'#0ea5e9'}}>🎯 침착해</div>{_g7.map(g=>(<Tg key={g} arr={selCC} setArr={setSelCC} val={g} col="#0ea5e9"/>))}</div>
<div style={{marginBottom:8}}><div style={{fontSize:12,fontWeight:700,marginBottom:6,color:'#f59e0b'}}>🥇 주도주</div>{_g7.map(g=>(<Tg key={g} arr={selJD} setArr={setSelJD} val={g} col="#f59e0b"/>))}</div>
<div style={{marginBottom:12}}><div style={{fontSize:12,fontWeight:700,marginBottom:6,color:'#ef4444'}}>🔥 하승훈</div>{_hsg.map(g=>(<Tg key={g} arr={selHS} setArr={setSelHS} val={g} col="#ef4444"/>))}</div>
{stats&&(<div style={{padding:10,background:'#f1f5f9',borderRadius:8,marginBottom:8,fontSize:12}}><strong>총 {stats.n}건</strong> · 5%+ 익절 {stats.p5}건 ({(stats.p5/stats.n*100).toFixed(1)}%) · 손절 {stats.sl}건 ({(stats.sl/stats.n*100).toFixed(1)}%) · 평균 수익 {stats.avg.toFixed(2)}%</div>)}
<div style={{marginBottom:12,display:'flex',gap:6,flexWrap:'wrap',alignItems:'center'}}>
<span style={{fontSize:11,fontWeight:700,color:'#475569',marginRight:4}}>정렬:</span>
{_sorts.map(s=>(<button key={s.id} onClick={()=>setSortMode(s.id)} style={{padding:'6px 12px',borderRadius:6,border:'1px solid '+(sortMode===s.id?'#1e293b':'#cbd5e1'),background:sortMode===s.id?'#1e293b':'#fff',color:sortMode===s.id?'#fff':'#475569',fontSize:11,fontWeight:sortMode===s.id?700:500,cursor:'pointer'}}>{s.l}</button>))}
</div>
<div style={{maxHeight:'60vh',overflowY:'auto',border:'1px solid #e2e8f0',borderRadius:8}}>
<table style={{width:'100%',fontSize:11,borderCollapse:'collapse'}}>
<thead style={{position:'sticky',top:0,background:'#f8fafc',zIndex:1}}><tr><th style={{padding:'8px 6px',textAlign:'left'}}>종목</th><th style={{padding:'8px 6px'}}>날짜</th><th style={{padding:'8px 6px'}}>등락</th><th style={{padding:'8px 6px'}}>직전월</th><th style={{padding:'8px 6px'}}>네</th><th style={{padding:'8px 6px'}}>침</th><th style={{padding:'8px 6px'}}>주</th><th style={{padding:'8px 6px'}}>하</th><th style={{padding:'8px 6px'}}>결과</th><th style={{padding:'8px 6px'}}>수익</th></tr></thead>
<tbody>{filtered.slice(0,300).map((r,i)=>(<tr key={i} onClick={()=>onRowClick&&onRowClick(r)} style={{cursor:'pointer',borderTop:'1px solid #f1f5f9'}}><td style={{padding:'6px'}}>{r.n}</td><td style={{padding:'6px',textAlign:'center'}}>{r.d}</td><td style={{padding:'6px',textAlign:'right',color:(r.ch||0)>0?'#dc2626':'#059669'}}>{r.ch}%</td><td style={{padding:'6px',textAlign:'right',color:r.prevAvgRet==null?'#94a3b8':(r.prevAvgRet>=0?'#dc2626':'#059669'),fontSize:10}}>{r.prevAvgRet==null?'-':r.prevAvgRet.toFixed(1)+'%'}</td><td style={{padding:'6px',textAlign:'center',fontWeight:700}}>{r.g}</td><td style={{padding:'6px',textAlign:'center',fontWeight:700}}>{r.ccG}</td><td style={{padding:'6px',textAlign:'center',fontWeight:700}}>{r.jdG}</td><td style={{padding:'6px',textAlign:'center',fontWeight:700}}>{r.hsG}</td><td style={{padding:'6px',textAlign:'center'}}>{r.r}</td><td style={{padding:'6px',textAlign:'right',color:(r.t||0)>=0?'#dc2626':'#059669',fontWeight:700}}>{(r.t||0).toFixed(1)}%</td></tr>))}</tbody></table>
{filtered.length>300&&(<div style={{padding:8,textAlign:'center',color:'#94a3b8',fontSize:11}}>※ 상위 300건만 표시 (전체 {filtered.length}건)</div>)}
</div></div>);
}


function TodaySignals({onSignalsLoaded,onSignalClick}){const [data,setData]=useState(null);const [loading,setLoading]=useState(true);const [err,setErr]=useState(null);const [saving,setSaving]=useState(false);const [saveMsg,setSaveMsg]=useState(null);const load=useCallback(async()=>{setLoading(true);setErr(null);try{const r=await fetch(API_URL);const j=await r.json();if(j.ok){const _all=[...(j.signals?.S||[]),...(j.signals?.A||[]),...(j.signals?.B||[]),...(j.signals?.X||[])];const _seen=new Set();const _uniq=_all.filter(x=>{if(_seen.has(x.code))return false;_seen.add(x.code);return true});const _new={S:[],A:[],B:[],X:[]};for(const _x of _uniq){const _a=_x.amount||0,_c=_x.change||0;if(_a<100||_c<10||_c>29)continue;const _g=_a>=5000?'S':_a>=2500?'A':'B';_new[_g].push({..._x,grade:_g});}j.signals=_new;j.all=[..._new.S,..._new.A,..._new.B,..._new.X];j.summary={total:j.all.length,S:_new.S.length,A:_new.A.length,B:_new.B.length,X:_new.X.length};setData(j);(()=>{const _s=JSON.stringify({ts:Date.now(),data:j});try{localStorage.setItem("today_signals_cache",_s);}catch(e){const _td=_getCacheDateKey();Object.keys(localStorage).forEach(_k=>{if(_k.startsWith("aianalyze_")&&!_k.endsWith(_td))localStorage.removeItem(_k);});try{localStorage.setItem("today_signals_cache",_s);}catch(e2){}}})();if(onSignalsLoaded)onSignalsLoaded(j.all||[]);}else setErr(j.error||"API 오류")}catch(e){setErr(e.message)}setLoading(false)},[]);useEffect(()=>{try{const _c=localStorage.getItem("today_signals_cache");if(_c){const _p=JSON.parse(_c);if(_p&&_p.ts&&Date.now()-_p.ts<259200000&&_p.data){setData(_p.data);setLoading(false);if(onSignalsLoaded)onSignalsLoaded(_p.data.all||[]);return;}}}catch(e){}load();},[load]);const saveSignals=async()=>{if(!data||!data.all||!data.all.length)return;setSaving(true);setSaveMsg(null);try{const r=await fetch(TRACK_API,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(data.all.filter(s=>s.grade!=="X").map(s=>({code:s.code,name:s.name,entry_price:s.price,rate:s.change,score:s.score,grade:s.grade,supply:s.investor,wick:s.wick,vol:s.amount,market:s.market,tp1:s.tp1,tp2:s.tp2,sl:s.sl})))});const j=await r.json();setSaveMsg(j.github_ok?("✅ "+j.added+"건 저장"):("⚠️ GITHUB_TOKEN 미설정 — Vercel 환경변수 추가 필요"));}catch(e){setSaveMsg("오류: "+e.message);}setSaving(false);};const gC=g=>GI[g]?.c||"#94a3b8";if(loading)return(<div style={{textAlign:"center",padding:"60px 20px"}}><div style={{fontSize:36,marginBottom:12}}>⏳</div><div style={{fontSize:16,fontWeight:600,color:"#64748b"}}>KIS API 스크리닝 중...</div><div style={{fontSize:13,color:"#94a3b8",marginTop:4}}>거래대금·등락률 상위 종목 분석 중</div></div>);if(err)return(<div style={{textAlign:"center",padding:"40px 20px"}}><div style={{fontSize:36,marginBottom:12}}>⚠️</div><div style={{fontSize:15,color:"#dc2626",marginBottom:8}}>{err}</div><button onClick={load} style={{padding:"8px 20px",borderRadius:8,border:"1px solid #e2e8f0",background:"#fff",fontSize:14,fontWeight:600,cursor:"pointer"}}>다시 시도</button></div>);if(!data)return null;return(<div><div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}><div style={{fontSize:14,color:"#64748b"}}>{data.date} · {data.time} KST</div><div style={{display:"flex",gap:6}}><button onClick={saveSignals} disabled={saving} style={{padding:"5px 12px",borderRadius:8,border:"none",background:saving?"#e2e8f0":"#1e293b",color:saving?"#94a3b8":"#fff",fontSize:12,fontWeight:700,cursor:saving?"default":"pointer"}}>📌 신호저장</button><button onClick={load} style={{padding:"5px 12px",borderRadius:8,border:"1px solid #e2e8f0",background:"#fff",fontSize:12,fontWeight:600,cursor:"pointer"}}>🔄</button></div></div>{saveMsg&&<div style={{padding:"8px 12px",borderRadius:8,background:saveMsg.startsWith("✅")?"#f0fdf4":"#fffbeb",border:"1px solid "+(saveMsg.startsWith("✅")?"#fee2e2":"#fcd34d"),color:saveMsg.startsWith("✅")?"#dc2626":"#d97706",fontSize:12,marginBottom:10}}>{saveMsg}</div>}<div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:8,marginBottom:16}}>{["S","A","B","X"].map(g=>(<div key={g} style={{textAlign:"center",padding:"10px 0",borderRadius:10,background:gC(g)+"10",border:"1px solid "+gC(g)+"30"}}><div style={{fontSize:22,fontWeight:900,color:gC(g)}}>{data.summary[g]}</div><div style={{fontSize:11,color:"#64748b"}}>{g}등급</div></div>))}</div>{data.all.filter(s=>s.grade!=="X").length===0?(<div style={{textAlign:"center",padding:"40px",color:"#94a3b8"}}><div style={{fontSize:36,marginBottom:8}}>📭</div><div style={{fontSize:15}}>오늘은 10%+ 돌파 시그널이 없습니다</div><div style={{fontSize:13,marginTop:4}}>장 마감 후(15:30~) 결과가 갱신됩니다</div></div>):data.all.filter(s=>s.grade!=="X").map((s,i)=>(<div key={i} onClick={()=>onSignalClick&&onSignalClick(s.code)} style={{display:"flex",alignItems:"center",gap:10,padding:"12px 14px",borderRadius:12,border:"1px solid #e2e8f0",marginBottom:6,background:"#fff",cursor:onSignalClick?"pointer":"default"}}><div style={{width:42,height:42,borderRadius:10,background:gC(s.grade)+"12",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}><span style={{fontSize:18,fontWeight:900,color:gC(s.grade)}}>{s.grade}</span></div><div style={{flex:1,minWidth:0}}><div style={{display:"flex",alignItems:"center",gap:6}}><span style={{fontWeight:700,fontSize:15}}>{s.name}</span><span style={{fontSize:12,fontWeight:700,color:"#dc2626"}}>+{s.change}%</span></div><div style={{fontSize:11,color:"#94a3b8",marginTop:2}}>{s.score}점 · {s.investor} · {s.market} · {s.amount}억</div></div><div style={{textAlign:"right",flexShrink:0,display:"flex",flexDirection:"column",alignItems:"flex-end",gap:4}}><div style={{fontSize:12,fontWeight:700,color:"#1e293b",fontFamily:"monospace"}}>{s.code}</div><button onClick={(e)=>{e.stopPropagation();navigator.clipboard.writeText(s.code).then(()=>{const b=e.currentTarget;const o=b.textContent;b.textContent="✓ 복사됨";b.style.background="#10b981";b.style.color="#fff";setTimeout(()=>{b.textContent=o;b.style.background="#f1f5f9";b.style.color="#475569";},1200);})}} style={{fontSize:10,fontWeight:600,padding:"3px 8px",borderRadius:6,border:"1px solid #cbd5e1",background:"#f1f5f9",color:"#475569",cursor:"pointer"}}>복사</button></div></div>))}</div>);}

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

      <button onClick={analyze} disabled={(imgs.length === 0 && !/^[0-9]{6}$/.test((codeInput||"").trim())) || loading} style={{width:"100%", padding:"14px", borderRadius:10, border:"none", background: (imgs.length===0 && !/^[0-9]{6}$/.test((codeInput||"").trim())) ? "#e2e8f0" : "linear-gradient(135deg, #1e293b 0%, #0d9488 100%)", color: (imgs.length===0 && !/^[0-9]{6}$/.test((codeInput||"").trim())) ? "#94a3b8" : "#fff", fontSize:15, fontWeight:800, cursor: (imgs.length===0 && !/^[0-9]{6}$/.test((codeInput||"").trim())) ? "default" : "pointer", marginBottom:14, letterSpacing:"0.3px"}}>
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
            <div style={{marginTop:14, padding:16, background:"linear-gradient(135deg,#dcfce7 0%,#bbf7d0 100%)", border:"2px solid #16a34a", borderRadius:12}}>
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
            <div style={{marginTop:14, padding:16, background:"linear-gradient(135deg,#fef3c7 0%,#fde68a 100%)", border:"2px solid #f59e0b", borderRadius:12}}>
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
                <div style={{marginTop:14, padding:14, background:"linear-gradient(135deg,#fef3c7,#fde68a)", border:"2px solid #f59e0b", borderRadius:10}}>
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
  const [history,setHistory]=useState(()=>{try{return JSON.parse(localStorage.getItem("neo_history")||"[]")}catch{return[]}});
  const [todaySignals,setTodaySignals]=useState([]);
  useEffect(()=>{fetch(HIST_URL).then(r=>r.json()).then(d=>{if(!d||!Array.isArray(d.history))return;window.__historySha=d.sha;if(d.history.length===0){try{const local=JSON.parse(localStorage.getItem("neo_history")||"[]");if(local.length>0){fetch(HIST_URL,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({history:local})}).then(r=>r.json()).then(d2=>{if(d2&&d2.sha)window.__historySha=d2.sha}).catch(()=>{});return;}}catch(_){}}setHistory(d.history);try{localStorage.setItem("neo_history",JSON.stringify(d.history))}catch(_){}}).catch(()=>{})},[]);
  const saveHistory=useCallback((entry)=>{setHistory(prev=>{const next=[entry,...prev];try{localStorage.setItem("neo_history",JSON.stringify(next));}catch(_e){try{const _trash=["__bg21_resume","__data2021_partial","__supply_backup","__data2026_v2_partial","__correctedDataJS","__bf_v3","appCode_b64","chunk_ai"];for(const _k of _trash)localStorage.removeItem(_k);const _td=_getCacheDateKey();Object.keys(localStorage).forEach(_k=>{if(_k.startsWith("aianalyze_")&&!_k.endsWith(_td))localStorage.removeItem(_k);});localStorage.setItem("neo_history",JSON.stringify(next));}catch(_e2){}}fetch(HIST_URL,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({history:next,sha:window.__historySha})}).then(r=>r.json()).then(d=>{if(d&&d.sha)window.__historySha=d.sha}).catch(()=>{});return next});setPage("history")},[]);
  const clearHistory=useCallback(()=>{setHistory([]);localStorage.removeItem("neo_history");fetch(HIST_URL,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({history:[]})}).then(r=>r.json()).then(d=>{if(d&&d.sha)window.__historySha=d.sha}).catch(()=>{})},[]);
  const deleteHistoryItem=useCallback((idx)=>{setHistory(prev=>{const next=prev.filter((_,i)=>i!==idx);localStorage.setItem("neo_history",JSON.stringify(next));fetch(HIST_URL,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({history:next,sha:window.__historySha})}).then(r=>r.json()).then(d=>{if(d&&d.sha)window.__historySha=d.sha}).catch(()=>{});return next})},[]);
  return(
    <div style={{background:"#fff",minHeight:"100vh",fontFamily:"-apple-system,'Pretendard',sans-serif",color:"#1e293b",fontSize:15,paddingBottom:68}}>
      <link href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/static/pretendard.css" rel="stylesheet"/>
      <div style={{maxWidth:920,margin:"0 auto",padding:"20px 14px"}}>
        <div style={{marginBottom:16}}><h1 style={{fontSize:26,fontWeight:900,letterSpacing:"-0.5px",margin:0}}>NEO-SCORE</h1><p style={{fontSize:12,color:"#94a3b8",margin:"2px 0 0"}}>종가돌파매매 · S/A/B/X · AI차트분석 · 실시간스크리닝 · 신호추적</p></div>
        {page==="today"&&<TodaySignals onSignalsLoaded={setTodaySignals} onSignalClick={(code)=>{window.__pendingAiCode=code;setPage("ai");}}/>}
        {(page==="db"||page==="ccdb"||page==="jddb"||page==="hsdb"||page==="filterdb")&&<div style={{padding:"12px 12px 0",display:"flex",gap:6,flexWrap:"wrap"}}>{[{id:"db",l:"네오"},{id:"ccdb",l:"침착해"},{id:"jddb",l:"주도주"},{id:"hsdb",l:"하승훈"},{id:"filterdb",l:"맞춤"}].map(o=>(<button key={o.id} onClick={()=>setPage(o.id)} style={{flex:"1 0 auto",padding:"8px 12px",borderRadius:8,border:"1px solid "+(page===o.id?"#1e293b":"#cbd5e1"),background:page===o.id?"#1e293b":"#fff",color:page===o.id?"#fff":"#475569",fontSize:12,fontWeight:page===o.id?700:500,cursor:"pointer"}}>{o.l}</button>))}</div>}{page==="db"&&<SignalDB/>}
        {page==="cctoday"&&<ChimchakhaeToday apiUrl={API_URL}/>}
        {page==="jdtoday"&&<JudojuToday apiUrl={API_URL}/>}
        {page==="hstoday"&&<HaseunghoonToday apiUrl={API_URL}/>}
        {page==="ccdb"&&<ChimchakhaeDB records={D} onRowClick={showFromD}/>}
        {page==="jddb"&&<JudojuDB onRowClick={showFromD}/>}
        {page==="hsdb"&&<HaseunghoonDB onRowClick={showFromD}/>}
        {page==="filterdb"&&<MultiFilterDB onRowClick={showFromD}/>}
        {page==="ai"&&<AIAnalysis onSave={saveHistory}/>}
        {page==="history"&&<History items={history} onClear={clearHistory} onDelete={deleteHistoryItem}/>}
        {page==="track"&&<TrackTab todaySignals={todaySignals}/>}
        {page==="verify"&&<VerifyTab/>}{detailModal&&<NeoAnalysisDetailModal result={detailModal} onClose={()=>setDetailModal(null)}/>}
      </div>
      <div style={{position:"fixed",bottom:0,left:0,right:0,background:"#fff",borderTop:"1px solid #e2e8f0",display:"flex",justifyContent:"center",zIndex:100}}>
        <div style={{display:"flex",maxWidth:1080,width:"100%",overflowX:"auto"}}>
          {[{id:"ai",label:"네오 Ai분석",icon:"🤖"},{id:"db",label:"네오스코어",icon:"🎯"},{id:"today",label:"네오오늘",icon:"🔥"},{id:"history",label:"히스토리",icon:"📋"}].map(t=>(
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
