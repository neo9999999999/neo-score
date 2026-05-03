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
const R=[...R_26,...R_2025,...R_2024,...R_2023,...R_2022,...R_2021];
const D=R.map(r=>{
  const _mc=r[4]||"";
  const _mcm=_mc.match(/(\d+(?:\.\d+)?)/);
  const _mcn=_mcm?+_mcm[1]:0;
  const _amt=_mc.includes("Ã¥ÂÂ")||_mc.includes("Ã¬Â¡Â°")?_mcn*10000:_mcn;
  const _g=_amt>=2500?"S":_amt>=500?"A":_amt>=50?"B":"X";
  const _cc=calcChimchakhaeScore({change:r[3],amount:_amt,investor:r[5],market:r[2],wick:r[9]||0});
  const _jd=calcJudojuScore({change:r[3],amount:_amt,investor:r[5],market:r[2],wick:r[9]||0});
  const _hs=calcHaseunghoonScore({change:r[3],amount:_amt,investor:r[5],market:r[2],wick:r[9]||0,breakType:r[8]});
  return {n:r[0],d:"20"+r[1],m:r[2],ch:r[3],mc:r[4],iv:r[5],sc:r[6],g:_g,ccG:_cc.grade,ccScore:_cc.score,ccBreakdown:_cc.breakdown,jdG:_jd.grade,jdScore:_jd.score,jdBreakdown:_jd.breakdown,hsG:_hs.grade,hsScore:_hs.score,hsBreakdown:_hs.breakdown,hsVetoed:_hs.vetoed,bd:r[8],wk:r[9],am:r[10],pk:r[11],dd:r[12],tp1:r[13],tp2:r[14],sl:r[15],h1:r[16],h2:r[17],t:r[18],r:r[19],hd1:r[20],hd2:r[21],etf:r[22],gp:r[23],h60:r[24],h120:r[25],vc:r[26],ema:r[27],tp1d:r[28]||"",sld:r[29]||"",tp2d:r[30]||"",exd:r[31]||"",tp1dy:r[32]||0,sldy:r[33]||0,exdy:r[34]||0,bed:r[35]||"",bedy:r[36]||0,tp12dy:r[37]||0,ohlc:PF(r[38]||""),v1Total:r[39]||0,v1Grade:r[40]||"X",v1Supply:r[41]||0,v1Breakout:r[42]||0,v1Momentum:r[43]||0,v1Sm:r[44]||0,v1Acc:r[45]||0};
});
const XN=1061;
const GI={S:{c:"#dc2626",bg:"#fef2f2",bd:"#fca5a5"},A:{c:"#2563eb",bg:"#eff6ff",bd:"#93c5fd"},B:{c:"#d97706",bg:"#fffbeb",bd:"#fcd34d"},X:{c:"#94a3b8",bg:"#f1f5f9",bd:"#cbd5e1"},"S+":{c:"#7c3aed",bg:"#faf5ff",bd:"#d8b4fe"},"A+":{c:"#0284c7",bg:"#f0f9ff",bd:"#7dd3fc"},"B+":{c:"#ca8a04",bg:"#fefce8",bd:"#fde68a"},C:{c:"#6b7280",bg:"#f9fafb",bd:"#d1d5db"}};
const CCNS={"S+":{tp1:20,tp2:50,sl:5,fsl:0},"S":{tp1:20,tp2:50,sl:5,fsl:0},"A+":{tp1:20,tp2:45,sl:6,fsl:0},"A":{tp1:20,tp2:40,sl:7,fsl:10},"B+":{tp1:20,tp2:45,sl:8,fsl:12},"B":{tp1:20,tp2:50,sl:10,fsl:15},"C":{tp1:25,tp2:50,sl:12,fsl:18}};
const JDNS={"S+":{tp1:25,tp2:60,sl:5,fsl:0},"S":{tp1:25,tp2:60,sl:6,fsl:0},"A+":{tp1:20,tp2:50,sl:7,fsl:0},"A":{tp1:20,tp2:45,sl:8,fsl:12},"B+":{tp1:20,tp2:45,sl:9,fsl:14},"B":{tp1:20,tp2:50,sl:10,fsl:15},"C":{tp1:25,tp2:50,sl:12,fsl:18}};
// Ã­ÂÂÃ¬ÂÂ¹Ã­ÂÂ Ã«ÂÂÃ­ÂÂÃ«Â§Â¤Ã«Â§Â¤ TP/SL Ã¢ÂÂ Ã­ÂÂ° Ã­ÂÂ­ Ã¬ÂÂÃ¬ÂÂµ Ã¬Â¶ÂÃªÂµÂ¬, Ã¬Â§ÂÃ¬ÂÂ± Ã«ÂÂÃ­ÂÂÃ«Â§Â Ã«Â§Â¤Ã«Â§Â¤
const HSNS={"S+":{tp1:25,tp2:60,sl:7,fsl:0},"S":{tp1:20,tp2:50,sl:7,fsl:0},"A+":{tp1:15,tp2:40,sl:7,fsl:0},"A":{tp1:12,tp2:30,sl:8,fsl:12},"B+":{tp1:10,tp2:25,sl:9,fsl:14},"B":{tp1:10,tp2:25,sl:10,fsl:15},"C":{tp1:15,tp2:30,sl:12,fsl:18}};
function strictPassCC(rr,mode){const g=rr.ccG;if(!g)return mode==="full";if(mode==="tight")return g==="S+"||g==="S";if(mode==="middle")return g==="S+"||g==="S"||g==="A+"||g==="A";return true;}
function strictPassJD(rr,mode){const g=rr.jdG;if(!g)return mode==="full";if(mode==="tight")return g==="S+"||g==="S";if(mode==="middle")return g==="S+"||g==="S"||g==="A+"||g==="A";return true;}
function strictPassHS(rr,mode){const g=rr.hsG;if(!g)return mode==="full";if(mode==="tight")return g==="S+"||g==="S";if(mode==="middle")return g==="S+"||g==="S"||g==="A+"||g==="A";return true;}
const NS={S:{tp1:10,tp2:20,sl:5,fsl:0},A:{tp1:10,tp2:20,sl:5,fsl:0},B:{tp1:10,tp2:20,sl:5,fsl:0}};function simNew(pk,dd,g,t1,t2,sl,res,origT){const ns=NS[g];const s=(t1>0)?{tp1:t1,tp2:t2,sl:sl}:ns;if(!s)return{t:0,r:"X"};const isDef=ns&&s.tp1===ns.tp1&&s.tp2===ns.tp2&&s.sl===ns.sl;if(isDef&&res&&origT!=null)return{t:origT,r:res};const a=Math.abs(dd);const hitSL=a>=s.sl;const hitTP1=pk>=s.tp1;const hitTP2=pk>=s.tp2;if(res==="SL"&&hitSL)return{t:Math.round(-s.sl*1.04*10)/10,r:"SL"};if(res==="TO"&&!hitSL&&!hitTP1)return{t:0,r:"TO"};if(hitSL&&hitTP1){if(hitTP2)return{t:Math.round((s.tp1*0.5+s.tp2*0.5)*10)/10,r:"BOTH"};return{t:Math.round((s.tp1*0.5)*10)/10,r:"TP1_BE"};}if(hitSL)return{t:Math.round(-s.sl*1.04*10)/10,r:"SL"};if(hitTP2)return{t:Math.round((s.tp1*0.5+s.tp2*0.5)*10)/10,r:"BOTH"};if(hitTP1)return{t:Math.round((s.tp1*0.5)*10)/10,r:"TP1"};return{t:0,r:"TO"};}

function PF(s){if(!s)return[];return s.split(";").map(p=>{const[d,v]=p.split(":");const[o,h,l,c]=v.split(",").map(parseFloat);return{d,o,h,l,c};});}

function parseAmount(inv){if(!inv||!/Ã¬ÂÂµ/.test(inv))return null;const p=inv.split("/"),r={Ã¬ÂÂ¸:0,ÃªÂ¸Â°:0,ÃªÂ°Â:0};for(const x of p){const m=x.match(/^(Ã¬ÂÂ¸|ÃªÂ¸Â°|ÃªÂ°Â)([+-]?\d+)Ã¬ÂÂµ$/);if(m)r[m[1]]=+m[2];}return r;}
function isSupplyX(inv){const a=parseAmount(inv);if(!a)return false;return(a.Ã¬ÂÂ¸+a.ÃªÂ¸Â°)<=0;}
function parseAmt2(s){if(!s)return 0;const m=s.match(/(\d+(?:\.\d+)?)Ã¬ÂÂµ/);return m?+m[1]:0;}
function parseSup2(inv){if(!inv||!/Ã¬ÂÂµ/.test(inv))return null;const p=inv.split("/"),r={Ã¬ÂÂ¸:0,ÃªÂ¸Â°:0,ÃªÂ°Â:0};for(const x of p){const m=x.match(/^(Ã¬ÂÂ¸|ÃªÂ¸Â°|ÃªÂ°Â)([+-]?\d+)Ã¬ÂÂµ$/);if(m)r[m[1]]=+m[2];}return r;}
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
function SD(r,cTP){const cp=(cTP&&cTP[r.g])||{tp1:r.tp1,tp2:r.tp2,sl:r.sl,fsl:0};const res=r.r;if(res==="BOTH")return"1Ã¬Â°Â¨ TP1 +"+cp.tp1+"% @ "+r.tp1d+" ("+r.tp1dy+"Ã¬ÂÂ¼) Ã¢ÂÂ 50% Ã¬ÂÂµÃ¬Â Â ÃÂ· 2Ã¬Â°Â¨ TP2 +"+cp.tp2+"% @ "+(r.tp2d||r.exd)+" ("+(r.tp2dy||r.exdy)+"Ã¬ÂÂ¼) Ã¢ÂÂ 50% Ã¬ÂÂµÃ¬Â Â";if(res==="TP1")return"1Ã¬Â°Â¨ TP1 +"+cp.tp1+"% @ "+r.tp1d+" ("+r.tp1dy+"Ã¬ÂÂ¼) Ã¢ÂÂ 50% Ã¬ÂÂµÃ¬Â Â ÃÂ· 2Ã¬Â°Â¨ ÃªÂ¸Â°ÃªÂ°ÂÃ«Â§ÂÃ«Â£Â @ "+r.exd+" ("+r.exdy+"Ã¬ÂÂ¼) Ã¬Â¢ÂÃªÂ°ÂÃ¬ÂÂÃ¬ÂÂ Ã«ÂÂÃ«Â¨Â¸Ã¬Â§Â 50% Ã«Â§Â¤Ã«ÂÂ";if(res==="TP1_BE")return"1Ã¬Â°Â¨ TP1 +"+cp.tp1+"% @ "+r.tp1d+" ("+r.tp1dy+"Ã¬ÂÂ¼) Ã¢ÂÂ 50% Ã¬ÂÂµÃ¬Â Â ÃÂ· 2Ã¬Â°Â¨ Ã«Â³Â¸Ã¬Â Â(0%) @ "+r.bed+" ("+r.bedy+"Ã¬ÂÂ¼) Ã¢ÂÂ Ã«ÂÂÃ«Â¨Â¸Ã¬Â§Â 50% Ã«Â³Â¸Ã¬Â Â Ã«Â§Â¤Ã«ÂÂ";if(res==="TP1_FSL")return"1Ã¬Â°Â¨ TP1 +"+cp.tp1+"% @ "+r.tp1d+" ("+r.tp1dy+"Ã¬ÂÂ¼) Ã¢ÂÂ 50% Ã¬ÂÂµÃ¬Â Â ÃÂ· 2Ã¬Â°Â¨ Ã¬ÂÂ¥Ã¬Â¤Â ÃªÂ°ÂÃ¬Â Â Ã¬ÂÂÃ¬Â Â @ -"+cp.fsl+"% ("+r.exdy+"Ã¬ÂÂ¼) Ã¢ÂÂ Ã«ÂÂÃ«Â¨Â¸Ã¬Â§Â 50% Ã«Â§Â¤Ã«ÂÂ";if(res==="TP1_SL")return"1Ã¬Â°Â¨ TP1 +"+cp.tp1+"% @ "+r.tp1d+" ("+r.tp1dy+"Ã¬ÂÂ¼) Ã¢ÂÂ 50% Ã¬ÂÂµÃ¬Â Â ÃÂ· 2Ã¬Â°Â¨ SL Ã¬ÂÂÃ¬Â Â @ "+r.sld+" ("+r.sldy+"Ã¬ÂÂ¼) Ã¢ÂÂ 50% Ã¬ÂÂÃ¬Â Â";if(res==="SL")return"Ã¬Â¢ÂÃªÂ°Â SL Ã¬Â ÂÃ«ÂÂ Ã¬ÂÂÃ¬Â Â @ "+r.sld+" ("+r.sldy+"Ã¬ÂÂ¼), Ã¬Â¢ÂÃªÂ°Â "+r.t+"%";if(res==="FSL")return"Ã¬ÂÂ¥Ã¬Â¤Â ÃªÂ°ÂÃ¬Â Â SL Ã¬Â ÂÃ«ÂÂ Ã¬ÂÂÃ¬Â Â @ -"+cp.fsl+"% ("+r.exdy+"Ã¬ÂÂ¼), Ã¬Â¦ÂÃ¬ÂÂ Ã«Â§Â¤Ã«ÂÂ";if(res==="TO")return"ÃªÂ¸Â°ÃªÂ°ÂÃ«Â§ÂÃ«Â£Â Ã¬Â ÂÃ«ÂÂ Ã«Â§Â¤Ã«ÂÂ @ "+r.exd+" ("+r.exdy+"Ã¬ÂÂ¼), Ã¬Â¢ÂÃªÂ°Â "+(r.t>0?"+":"")+r.t+"%";return"-";}


const RC=r=>r==="BOTH"?"#dc2626":r==="TP1"?"#2563eb":r==="TP1_SL"?"#d97706":r==="SL"?"#dc2626":"#64748b";
const RL=r=>r==="BOTH"?"TP2":r==="TP1"?"TP1":r==="TP1_SL"?"TP1Ã¢ÂÂSL":r==="SL"?"SL":r==="TP2"?"TP2":r==="FSL"?"ÃªÂ°ÂÃ¬Â ÂSL":r==="TRAIL"?"TRAIL":"ÃªÂ¸Â°ÃªÂ°ÂÃ«Â§ÂÃ«Â£Â";
const BL=b=>b==="ATH"?"Ã¬ÂÂ¬Ã¬ÂÂÃ¬ÂµÂÃªÂ³Â ":b==="52W"?"52Ã¬Â£Â¼":b==="120D"?"120Ã¬ÂÂ¼":"Ã«Â¹ÂÃ¬ÂÂ ÃªÂ³Â ";
const BC=b=>b==="ATH"?"#dc2626":b==="52W"?"#2563eb":b==="120D"?"#d97706":"#94a3b8";
const API_URL="https://sector-api-pink.vercel.app/api/screening";
const HIST_URL="https://sector-api-pink.vercel.app/api/history";
const TRACK_API="https://sector-api-pink.vercel.app/api/track";
const PRICE_API="https://sector-api-pink.vercel.app/api/daily-price";
const SYS_PROMPT = `Ã«ÂÂ¹Ã¬ÂÂ Ã¬ÂÂ Ã­ÂÂÃªÂµÂ­ Ã¬Â£Â¼Ã¬ÂÂ Ã¬Â¢ÂÃªÂ°ÂÃ«ÂÂÃ­ÂÂÃ«Â§Â¤Ã«Â§Â¤Ã¬ÂÂ Ã­ÂÂµÃ­ÂÂ© Ã«Â¶ÂÃ¬ÂÂ Ã¬Â ÂÃ«Â¬Â¸ÃªÂ°ÂÃ¬ÂÂÃ«ÂÂÃ«ÂÂ¤. Ã¬Â°Â¨Ã­ÂÂ¸/Ã¬ÂÂÃªÂ¸Â/Ã«ÂÂ´Ã¬ÂÂ¤ Ã¬ÂÂ´Ã«Â¯Â¸Ã¬Â§ÂÃ«Â¥Â¼ NeoAnalysis v1 Ã«Â£Â°Ã«Â¡Â Ã­ÂÂÃªÂ°ÂÃ­ÂÂ©Ã«ÂÂÃ«ÂÂ¤.

## ÃªÂ²ÂÃ¬Â¦ÂÃ«ÂÂ Ã«Â§Â¤Ã«Â§Â¤ Ã«Â£Â° (6Ã«ÂÂ Ã«Â°Â±Ã­ÂÂÃ¬ÂÂ¤Ã­ÂÂ¸)
- TP1=10% (50% Ã¬ÂÂµÃ¬Â Â), TP2=20% (Ã¬ÂÂÃ¬ÂÂ¬), SL=-5% (Ã¬Â ÂÃ«ÂÂ Ã¬ÂÂÃ¬Â Â), Ã«Â³Â´Ã¬ÂÂ  10Ã¬ÂÂ¼
- Ã«Â§Â¤Ã¬ÂÂ Ã­ÂÂÃ¬ÂÂ´Ã«Â°Â: 14:50~15:20 (Ã¬ÂÂ¥ Ã«Â§ÂÃªÂ°Â Ã¬Â§ÂÃ¬Â Â Ã«Â¶ÂÃ­ÂÂ )

## Ã¬ÂÂ¤Ã¬Â½ÂÃ¬ÂÂ´Ã«Â§Â (5Ã¬ÂÂ¹Ã¬ÂÂ 100Ã¬Â Â)
Ã£ÂÂ1. Ã¬ÂÂÃªÂ¸Â (25Ã¬Â Â) - Ã¬Â¹Â¨Ã¬Â°Â©Ã­ÂÂ´ Ã«Â£Â°Ã£ÂÂ Ã¬ÂÂ¥ Ã­ÂÂÃ«Â°Â Ã«ÂÂÃ«Â°ÂÃ«Â§Â¤Ã¬ÂÂ 10 + Ã¬ÂÂÃªÂ¸Â Ã¬ÂÂ¼ÃªÂ´ÂÃ¬ÂÂ± 8 + ÃªÂ±Â°Ã«ÂÂÃ«ÂÂÃªÂ¸Â ÃªÂ°ÂÃ¬Â¤Â 7
Ã£ÂÂ2. Ã«ÂÂÃ­ÂÂ Ã­ÂÂÃ¬Â§Â (25Ã¬Â Â) - Ã­ÂÂÃ¬ÂÂ¹Ã­ÂÂ Ã«Â£Â°Ã£ÂÂ Ã¬Â¢ÂÃªÂ°ÂÃ¬ÂÂÃ¬Â¹Â(Ã¬ÂÂÃªÂ¼Â¬Ã«Â¦Â¬Ã¢ÂÂ¤1%) 10 + Ã«ÂÂ±Ã«ÂÂ½Ã­ÂÂ­ 8 + Ã¬Â¢ÂÃªÂ°Â Ã¬ÂÂÃ¬Â°Â© 7
Ã£ÂÂ3. Ã«ÂªÂ¨Ã«Â©ÂÃ­ÂÂ+Ã¬ÂÂÃ¬ÂÂ¥ (20Ã¬Â Â) - Ã¬Â£Â¼Ã«ÂÂÃ¬Â£Â¼ Ã«Â£Â°Ã£ÂÂ Ã«ÂÂ±Ã«ÂÂ½Ã«Â¥Â  ÃªÂ°ÂÃ«ÂÂ 8 + Ã«Â§ÂÃªÂ°Â ÃªÂ°ÂÃ«ÂÂ 7 + Ã¬ÂÂÃ¬ÂÂ¥Ã¬ÂÂÃ¬ÂÂ 5
Ã£ÂÂ4. Ã¬ÂÂÃ­ÂÂ©ÃÂ·Ã¬ÂÂ¹Ã­ÂÂ°+Ã¬ÂÂ¬Ã«Â£Â (15Ã¬Â Â) - Ã¬Â¹Â¨Ã¬Â°Â©Ã­ÂÂ´Ã£ÂÂ Ã¬Â£Â¼Ã«ÂÂÃ¬ÂÂ¹Ã­ÂÂ° 8 + Ã¬ÂÂ¬Ã«Â£Â Ã­ÂÂÃ¬ÂÂ+Ã¬ÂÂµÃ¬ÂÂ¼ Ã«ÂªÂ¨Ã«Â©ÂÃ­ÂÂ 7
Ã£ÂÂ5. Ã¬ÂÂ¬Ã¬Â ÂÃ¬ÂÂÃ¬Â¶Â+Ã¬ÂÂ´Ã­ÂÂ (15Ã¬Â Â) - Ã­ÂÂÃ¬ÂÂ¹Ã­ÂÂÃ£ÂÂ Ã¬ÂÂ ÃªÂ³Â ÃªÂ°Â Ã«ÂÂ¨ÃªÂ³Â 6 + Ã¬ÂÂ´Ã­ÂÂ Ã¬Â ÂÃ«Â Â¬ 5 + Ã¬Â ÂÃ­ÂÂ­ Ã­ÂÂÃ¬ÂÂ¤Ã­ÂÂ¸ 4

## Ã«ÂÂ±ÃªÂ¸Â Ã«Â§Â¤Ã­ÂÂ
- 85+ Ã¢ÂÂ S+ (ÃªÂ°ÂÃ«Â Â¥Ã¬Â§ÂÃ¬ÂÂ)
- 75~84 Ã¢ÂÂ S (ÃªÂ°ÂÃ«Â Â¥Ã¬Â§ÂÃ¬ÂÂ)
- 70~74 Ã¢ÂÂ A+ (Ã¬Â§ÂÃ¬ÂÂ)
- 60~69 Ã¢ÂÂ A (Ã¬Â§ÂÃ¬ÂÂ)
- 50~59 Ã¢ÂÂ B (Ã¬Â¡Â°ÃªÂ±Â´Ã«Â¶ÂÃ¬Â§ÂÃ¬ÂÂ)
- 50 Ã«Â¯Â¸Ã«Â§Â Ã¢ÂÂ X (ÃªÂ´ÂÃ«Â§Â/ÃªÂ¸ÂÃ¬Â§Â)

## Ã¬ÂÂÃ«ÂÂµ Ã­ÂÂÃ¬ÂÂ (Ã«ÂÂ¨Ã¬ÂÂ¼ JSON, Ã¬Â½ÂÃ«ÂÂÃ«Â¸ÂÃ«Â¡Â ÃªÂ¸ÂÃ¬Â§Â)
{"grade":"S+/S/A+/A/B/X","totalScore":0,"score":0,"verdict":"ÃªÂ°ÂÃ«Â Â¥Ã¬Â§ÂÃ¬ÂÂ/Ã¬Â§ÂÃ¬ÂÂ/Ã¬Â¡Â°ÃªÂ±Â´Ã«Â¶ÂÃ¬Â§ÂÃ¬ÂÂ/ÃªÂ´ÂÃ«Â§Â/ÃªÂ¸ÂÃ¬Â§Â","stockName":"","extractedData":{"currentPrice":"","change":"","volume":"","foreigner":"","institution":"","sector":"","chartPattern":""},"engines":{"supply":{"score":0,"max":25,"items":[]},"breakout":{"score":0,"max":25,"items":[]},"momentumMarket":{"score":0,"max":20,"items":[]},"sectorMaterial":{"score":0,"max":15,"items":[]},"accumulation":{"score":0,"max":15,"items":[]}},"detailedAnalysis":"3-5Ã«Â¬Â¸Ã¬ÂÂ¥ Ã¬Â¢ÂÃ­ÂÂ©","keyReasons":[],"risks":[],"technicalIndicators":{"rsi":"","macd":"","bollinger":"","movingAverage":"","volume":""},"supplyZone":{"status":"Ã«ÂÂÃ­ÂÂ|Ã«ÂÂÃ­ÂÂÃ¬ÂÂÃ«ÂÂ|Ã«Â³Â´Ã¬ÂÂ |Ã¬ÂÂ´Ã­ÂÂ","level":"","thickness":"","breakoutQuality":""},"strategy":{"entry":"","entryPrice":"","tp1Price":"","tp2Price":"","stopLoss":"","exit":"","hold":"10Ã¬ÂÂ¼"},"confidenceScore":0,"nextDayRiseProbability":0,"nextDayProbability":0,"recommendedWeight":0,"summary":""}

ÃªÂ·ÂÃ¬Â¹Â:
- score Ã¬ÂÂ totalScore Ã«ÂÂ Ã«ÂÂ¤ Ã«ÂÂÃ¬ÂÂ¼Ã­ÂÂÃªÂ²Â 0~100 Ã¬Â±ÂÃ¬ÂÂ°ÃªÂ¸Â° (Ã­ÂÂ¸Ã­ÂÂÃ¬ÂÂ±)
- nextDayRiseProbability Ã¬ÂÂ nextDayProbability Ã«ÂÂ Ã«ÂÂ¤ Ã«ÂÂÃ¬ÂÂ¼ Ã¬Â±ÂÃ¬ÂÂ°ÃªÂ¸Â°
- engines Ã¬ÂÂ 5Ã¬ÂÂ¹Ã¬ÂÂ Ã«ÂªÂ¨Ã«ÂÂ Ã¬Â±ÂÃ¬ÂÂ°ÃªÂ¸Â° (supply, breakout, momentumMarket, sectorMaterial, accumulation)
- Ã«ÂªÂ¨Ã«ÂÂ  Ã­ÂÂÃ«ÂÂ Ã«Â¹Â Ã¬Â§ÂÃ¬ÂÂÃ¬ÂÂ´`;

function SignalDB(){const [tab,setTab]=useState("S");const [cTP,setCTP]=useState(NS);const [srt,setSrt]=useState({c:"d",d:"desc"});const [open,setOpen]=useState(null);const [pg,setPg]=useState(0);const[invAmt,setInvAmt]=useState(()=>{try{return JSON.parse(localStorage.getItem("invAmt_v1")||"")||{S:1000000,A:500000,B:300000,same:500000,useSame:false}}catch(e){return{S:1000000,A:500000,B:300000,same:500000,useSame:false}}});const[mode,setMode]=useState(()=>{try{const v=localStorage.getItem("mode_v1");return v==="full"||v==="middle"||v==="tight"?v:"tight"}catch(e){return "tight"}});const[yearFilter,setYearFilter]=useState("all");const[fromD,setFromD]=useState("");const[toD,setToD]=useState("");const[supplyFilter,setSupplyFilter]=useState("all");const[highFilter,setHighFilter]=useState("all");const[holdFilter,setHoldFilter]=useState("all");
useEffect(()=>{const h=(e)=>{if((e.ctrlKey||e.metaKey)&&(e.key==="k"||e.key==="K")){e.preventDefault();setMode(v=>v==="tight"?"full":v==="full"?"middle":"tight");}};window.addEventListener("keydown",h);return()=>window.removeEventListener("keydown",h);},[]);
useEffect(()=>{const t=setTimeout(()=>{[...document.querySelectorAll("button")].filter(b=>b.textContent.trim()==="Ã¬ÂÂÃ¬ÂÂµMAX").forEach(b=>b.click());},400);return ()=>clearTimeout(t);},[]);useEffect(()=>{try{localStorage.setItem("mode_v1",mode)}catch(e){}},[mode]);const PP=30;const D_live=useMemo(()=>{let _r=D.filter(r=>[r.ccG,r.jdG,r.hsG].filter(g=>g==="S+"||g==="S"||g==="A+").length>=2&&strictPass(r,mode)&&(yearFilter==="all"||(r.d&&r.d.slice(0,4)===yearFilter))&&(!fromD||(r.d&&r.d>=fromD))&&(!toD||(r.d&&r.d<=toD))&&(supplyFilter==="all"||(supplyFilter==="gi_oe"&&r.iv==="ÃªÂ¸Â°+Ã¬ÂÂ¸")||(supplyFilter==="oe"&&r.iv==="Ã¬ÂÂ¸Ã«Â§Â")||(supplyFilter==="gi"&&r.iv==="ÃªÂ¸Â°Ã«Â§Â")||(supplyFilter==="dual_minus"&&r.iv==="Ã«ÂÂÃ«ÂÂ¤-"))&&(highFilter==="all"||(highFilter==="h60"&&r.h60===1)||(highFilter==="h120"&&r.h120===1)||(highFilter==="both"&&r.h60===1&&r.h120===1)));_r=_r.map(rr=>{const cp=cTP[rr.g];if(!cp||!rr.ohlc||!rr.ohlc.length)return rr;const sim=simReal(rr.ohlc,cp.tp1,cp.tp2,cp.sl,cp.fsl||0);return{g:(rr.g||"B"),ta:rr.mc,...rr,t:sim.t,r:sim.r,tp1d:sim.tp1d||rr.tp1d,tp2d:sim.tp2d||rr.tp2d,sld:sim.sld||rr.sld,bed:sim.bed,exd:sim.exd||rr.exd,tp1dy:sim.tp1dy,tp2dy:sim.tp2dy,sldy:sim.sldy,bedy:sim.bedy,exdy:sim.exdy};});if(holdFilter!=="all"){const hd=+holdFilter;_r=_r.filter(x=>x.ohlc&&x.ohlc.length>=hd).map(x=>({...x,t:x.ohlc[hd-1].c,r:hd+"Ã¬ÂÂ¼Ã«Â³Â´Ã¬ÂÂ "}));}return _r;},[cTP,mode,yearFilter,fromD,toD,supplyFilter,highFilter,holdFilter]);const st=useMemo(()=>{const r={};["S","A","B"].forEach(g=>{const d=D_live.filter(x=>x.g===g),w=d.filter(x=>x.t>0),sl=d.filter(x=>x.r==="SL"),bo=d.filter(x=>x.r==="BOTH"),tp1=d.filter(x=>{const rr=x.r;return rr==="TP1"||rr==="BOTH";}),to=d.filter(x=>x.r==="TO");const avg=d.length?(d.reduce((s,x)=>s+x.t,0)/d.length):0;const nw=d.map(x=>x);const nwCum=Math.round(nw.reduce((s,x)=>s+x.t,0));const nwWin=nw.filter(x=>x.t>0).length;r[g]={n:d.length,avg:avg.toFixed(2),wr:d.length?Math.round(w.length/d.length*100):0,cum:Math.round(d.reduce((s,x)=>s+x.t,0)),tp1c:tp1.length,tp1r:d.length?Math.round(tp1.length/d.length*100):0,boc:bo.length,bor:d.length?Math.round(bo.length/d.length*100):0,slc:sl.length,slr:d.length?Math.round(sl.length/d.length*100):0,toc:to.length,tor:d.length?Math.round(to.length/d.length*100):0,nwCum,nwWr:d.length?Math.round(nwWin/d.length*100):0}});return r},[cTP,D_live]);const fl=useMemo(()=>{let d=D_live.filter(r=>r.g===tab);return[...d].sort((a,b)=>{const av=a[srt.c],bv=b[srt.c];if(typeof av==="number")return (srt.d==="asc"?av-bv:bv-av);return srt.d==="asc"?String(av).localeCompare(String(bv)):String(bv).localeCompare(String(av))})},[tab,srt,invAmt,D_live]);const portfolio=useMemo(()=>{
const amt=invAmt.useSame?{S:invAmt.same,A:invAmt.same,B:invAmt.same}:{S:invAmt.S,A:invAmt.A,B:invAmt.B};
const parseTA=s=>{if(!s)return 0;const m=s.match(/(\d+)Ã¬ÂÂµ/);return m?+m[1]:0;};
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
},[D_live,invAmt]);const pd=fl.slice(pg*PP,(pg+1)*PP),mx=Math.ceil(fl.length/PP)-1;const ds=c=>setSrt(p=>p.c===c?{c,d:p.d==="asc"?"desc":"asc"}:{c,d:"desc"});return(<div><div style={{marginBottom:8,padding:10,background:"#0f1420",border:"1px solid #2a3040",borderRadius:8,display:"flex",alignItems:"center",gap:10,flexWrap:"wrap"}}><span style={{color:"#9ca3af",fontSize:12,fontWeight:700}}>ÃªÂ¸Â°ÃªÂ°Â</span>{[["all","Ã¬Â ÂÃ¬Â²Â´"],["2026","26Ã«ÂÂ"],["2025","25Ã«ÂÂ"],["2024","24Ã«ÂÂ"],["2023","23Ã«ÂÂ"],["2022","22Ã«ÂÂ"],["2021","21Ã«ÂÂ"]].map(([v,l])=>(<button key={v} onClick={()=>setYearFilter(v)} style={{background:yearFilter===v?"#60a5fa":"#1f2937",color:yearFilter===v?"#000":"#d1d5db",border:"1px solid #374151",borderRadius:6,padding:"4px 10px",fontSize:12,cursor:"pointer",fontWeight:yearFilter===v?700:400}}>{l}</button>))}<span style={{color:"#4b5563"}}>|</span><input type="date" value={fromD} onChange={e=>setFromD(e.target.value)} style={{background:"#1f2937",color:"#fff",border:"1px solid #374151",borderRadius:6,padding:"3px 6px",fontSize:11}}/><span style={{color:"#6b7280",fontSize:11}}>~</span><input type="date" value={toD} onChange={e=>setToD(e.target.value)} style={{background:"#1f2937",color:"#fff",border:"1px solid #374151",borderRadius:6,padding:"3px 6px",fontSize:11}}/><button onClick={()=>{setFromD("");setToD("");setYearFilter("all")}} style={{background:"#374151",color:"#fff",border:"none",borderRadius:6,padding:"3px 8px",fontSize:11,cursor:"pointer"}}>Ã¬Â´ÂÃªÂ¸Â°Ã­ÂÂ</button><span style={{color:"#4b5563"}}>|</span><span style={{color:"#9ca3af",fontSize:12}}>Ã¬Â´Â <b style={{color:"#fff"}}>{D_live.length}</b>ÃªÂ±Â´</span><span style={{color:"#9ca3af",fontSize:12}}>Ã«ÂÂÃ¬Â Â <b style={{color:D_live.reduce((a,b)=>a+(b.t||0),0)>=0?"#ef4444":"#3b82f6"}}>{D_live.reduce((a,b)=>a+(b.t||0),0).toFixed(1)}%</b></span><span style={{color:"#9ca3af",fontSize:12}}>Ã¬ÂÂ¹Ã«Â¥Â  <b style={{color:"#fff"}}>{D_live.length?(D_live.filter(x=>x.t>0).length/D_live.length*100).toFixed(1):0}%</b></span></div><div style={{marginBottom:8,padding:10,background:"#0f1420",border:"1px solid #2a3040",borderRadius:8,display:"flex",alignItems:"center",gap:10,flexWrap:"wrap"}}><span style={{color:"#9ca3af",fontSize:12,fontWeight:700}}>Ã¬ÂÂÃªÂ¸Â</span>{[["all","Ã¬Â ÂÃ¬Â²Â´"],["gi_oe","ÃªÂ¸Â°+Ã¬ÂÂ¸"],["oe","Ã¬ÂÂ¸Ã«Â§Â"],["gi","ÃªÂ¸Â°Ã«Â§Â"],["dual_minus","Ã«ÂÂÃ«ÂÂ¤-"]].map(([v,l])=>(<button key={v} onClick={()=>setSupplyFilter(v)} style={{background:supplyFilter===v?"#60a5fa":"#1f2937",color:supplyFilter===v?"#000":"#d1d5db",border:"1px solid #374151",borderRadius:6,padding:"4px 10px",fontSize:12,cursor:"pointer",fontWeight:supplyFilter===v?700:400}}>{l}</button>))}<span style={{color:"#9ca3af",fontSize:11,marginLeft:"auto"}}>Ã¢ÂÂ» Ã­ÂÂÃ¬ÂÂ¬ 26Ã«ÂÂ Ã«ÂÂ°Ã¬ÂÂ´Ã­ÂÂ°Ã«Â§Â Ã¬ÂÂÃªÂ¸Â Ã¬Â ÂÃ«Â³Â´ Ã¬ÂÂÃ¬ÂÂ (22~25Ã«ÂÂ Ã¬Â¶ÂÃ­ÂÂ Ã«Â³Â´ÃªÂ°Â Ã¬ÂÂÃ¬Â Â)</span></div><div style={{marginBottom:8,padding:10,background:"#0f1420",border:"1px solid #2a3040",borderRadius:8,display:"flex",alignItems:"center",gap:10,flexWrap:"wrap"}}><span style={{color:"#9ca3af",fontSize:12,fontWeight:700}}>Ã¬ÂÂ ÃªÂ³Â ÃªÂ°Â</span>{[["all","Ã¬Â ÂÃ¬Â²Â´"],["h60","60Ã¬ÂÂ¼Ã¢ÂÂ"],["h120","120Ã¬ÂÂ¼Ã¢ÂÂ"],["both","Ã«ÂÂÃ«ÂÂ¤Ã¢ÂÂ"]].map(([v,l])=>(<button key={v} onClick={()=>setHighFilter(v)} style={{background:highFilter===v?"#f59e0b":"#1f2937",color:highFilter===v?"#000":"#d1d5db",border:"1px solid #374151",borderRadius:6,padding:"4px 10px",fontSize:12,cursor:"pointer",fontWeight:highFilter===v?700:400}}>{l}</button>))}<span style={{color:"#9ca3af",fontSize:11,marginLeft:"auto"}}>Ã¢ÂÂ» 25/26Ã«ÂÂ Ã¬Â ÂÃ¬ÂÂ© (22~24Ã«ÂÂ Ã¬ÂÂ¬Ã¬ÂÂÃ¬Â§Â Ã¬ÂÂÃ¬Â Â)</span></div><div style={{marginBottom:8,padding:10,background:"#0f1420",border:"1px solid #2a3040",borderRadius:8,display:"flex",alignItems:"center",gap:10,flexWrap:"wrap"}}><span style={{color:"#9ca3af",fontSize:12,fontWeight:700}}>Ã«Â³Â´Ã¬ÂÂ </span>{[["all","Ã¬Â ÂÃ¬Â²Â´"],["5","Ã¢ÂÂ¤5Ã¬ÂÂ¼"],["10","Ã¢ÂÂ¤10Ã¬ÂÂ¼"],["15","Ã¢ÂÂ¤15Ã¬ÂÂ¼"],["20","Ã¢ÂÂ¤20Ã¬ÂÂ¼"],["25","Ã¢ÂÂ¤25Ã¬ÂÂ¼"],["30","Ã¢ÂÂ¤30Ã¬ÂÂ¼"],["35","Ã¢ÂÂ¤35Ã¬ÂÂ¼"],["40","Ã¢ÂÂ¤40Ã¬ÂÂ¼"],["45","Ã¢ÂÂ¤45Ã¬ÂÂ¼"],["50","Ã¢ÂÂ¤50Ã¬ÂÂ¼"],["55","Ã¢ÂÂ¤55Ã¬ÂÂ¼"],["60","Ã¢ÂÂ¤60Ã¬ÂÂ¼"]].map(([v,l])=>(<button key={v} onClick={()=>setHoldFilter(v)} style={{background:holdFilter===v?"#10b981":"#1f2937",color:holdFilter===v?"#000":"#d1d5db",border:"1px solid #374151",borderRadius:6,padding:"4px 10px",fontSize:12,cursor:"pointer",fontWeight:holdFilter===v?700:400}}>{l}</button>))}<span style={{color:"#9ca3af",fontSize:11,marginLeft:"auto"}}>Ã¢ÂÂ» 60Ã¬ÂÂ¼ÃªÂ¹ÂÃ¬Â§Â Ã¬Â ÂÃªÂµÂ¬ÃªÂ°Â Ã¬Â ÂÃ¬ÂÂ©</span></div><div style={{marginBottom:12,padding:12,background:"#0f1420",border:"1px solid #2a3040",borderRadius:8}}>
<div style={{display:"flex",alignItems:"center",gap:8,marginBottom:10,flexWrap:"wrap"}}>
<span style={{fontSize:12,fontWeight:700,color:"#26C6DA"}}>Ã°ÂÂÂ° Ã­ÂÂ¬Ã¬ÂÂÃªÂ¸Â ÃªÂ³ÂÃ¬ÂÂ°ÃªÂ¸Â°</span>
<label style={{display:"flex",alignItems:"center",gap:4,fontSize:11,color:"#aaa",cursor:"pointer"}}>
<input type="checkbox" checked={invAmt.useSame} onChange={e=>setInvAmt({...invAmt,useSame:e.target.checked})}/>
Ã«ÂªÂ¨Ã«ÂÂ  Ã¬Â¢ÂÃ«ÂªÂ© Ã«ÂÂÃ¬ÂÂ¼ ÃªÂ¸ÂÃ¬ÂÂ¡
</label>
<button onClick={()=>setMode(mode==="tight"?"full":mode==="full"?"middle":"tight")} style={{padding:"4px 10px",fontSize:10,fontWeight:700,border:"1px solid "+((mode==="tight"?"#dc2626":mode==="middle"?"#F5A623":"#444")),background:(mode==="tight"?"#dc2626":mode==="middle"?"#F5A623":"transparent"),color:(mode==="tight")?"#fff":"#888",borderRadius:4,cursor:"pointer",marginRight:8}}>{mode==="tight"?"Ã°ÂÂÂ¯ Ã­ÂÂÃ¬ÂÂ´Ã­ÂÂ¸ (Ctrl+K)":mode==="middle"?"Ã°ÂÂÂ¸ Ã«Â¯Â¸Ã«ÂÂ¤ (Ctrl+K)":"Ã¢ÂÂª Ã­ÂÂ (Ctrl+K)"}</button><div style={{display:"flex",gap:10,fontSize:10,marginLeft:"auto",flexWrap:"wrap"}}><span style={{color:"#dc2626",fontWeight:700}}>Ã°ÂÂÂ¯ Ã¬ÂÂµÃ¬Â Â {portfolio.resStats.tp}ÃªÂ±Â´</span><span style={{color:"#2563eb",fontWeight:700}}>Ã°ÂÂÂ Ã¬ÂÂÃ¬Â Â {portfolio.resStats.sl}ÃªÂ±Â´</span><span style={{color:"#888"}}>Ã¢ÂÂ± ÃªÂ¸Â°ÃªÂ°ÂÃ«Â§ÂÃ«Â£Â {portfolio.resStats.to}ÃªÂ±Â´</span><span style={{color:"#666"}}>Ã¬Â ÂÃ¬Â²Â´ {portfolio.total.n}ÃªÂ±Â´</span></div>


</div>
{invAmt.useSame?(
<div style={{display:"flex",alignItems:"center",gap:8,marginBottom:10}}>
<span style={{fontSize:11,color:"#ccc",width:60}}>Ã¬Â¢ÂÃ«ÂªÂ©Ã«ÂÂ¹</span>
<input type="number" value={invAmt.same} onChange={e=>setInvAmt({...invAmt,same:+e.target.value||0})} style={{flex:1,padding:"6px 8px",background:"#1a1a2e",border:"1px solid #333",borderRadius:4,color:"#fff",fontSize:12}} step="100000"/>
<span style={{fontSize:10,color:"#888"}}>Ã¬ÂÂ</span>
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
<div style={{fontSize:10,color:"#888",marginBottom:3}}>{gk}ÃªÂ¸Â ({d.n}ÃªÂ±Â´)</div>
<div style={{fontSize:14,fontWeight:700,color:c}}>{d.pnl>=0?"+":""}{d.pnl.toLocaleString()}Ã¬ÂÂ</div>
<div style={{fontSize:9,color:"#666"}}>Ã­ÂÂ¬Ã¬ÂÂ {d.amt.toLocaleString()} ÃÂ· {roi.toFixed(1)}% ÃÂ· Ã¬ÂÂ¹ {d.n>0?(d.win/d.n*100).toFixed(0):0}%</div>
</div>);
})}
<div style={{padding:"8px 10px",background:"#1a2e2a",borderRadius:6,borderLeft:"3px solid #26C6DA"}}>
<div style={{fontSize:10,color:"#26C6DA",marginBottom:3,fontWeight:700}}>Ã¬Â ÂÃ¬Â²Â´ ({portfolio.total.n}ÃªÂ±Â´)</div>
<div style={{fontSize:14,fontWeight:700,color:portfolio.total.pnl>0?"#dc2626":portfolio.total.pnl<0?"#2563eb":"#888"}}>{portfolio.total.pnl>=0?"+":""}{portfolio.total.pnl.toLocaleString()}Ã¬ÂÂ</div>
<div style={{fontSize:9,color:"#666"}}>Ã­ÂÂ¬Ã¬ÂÂ {portfolio.total.amt.toLocaleString()} ÃÂ· {portfolio.total.amt>0?(portfolio.total.pnl/portfolio.total.amt*100).toFixed(1):0}% ÃÂ· Ã¬ÂÂ¹ {portfolio.total.n>0?(portfolio.total.win/portfolio.total.n*100).toFixed(0):0}%</div>
</div>
</div>
</div><div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(148px,1fr))",gap:8,marginBottom:18}}>{["S","A","B"].map(g=>{const i=GI[g],s=st[g];return(<div key={g} onClick={()=>{setTab(g);setPg(0);setOpen(null)}} style={{background:tab===g?i.c:i.bg,borderRadius:14,padding:"12px 14px",cursor:"pointer",border:tab===g?"none":"0.5px solid "+i.bd}}><div style={{display:"flex",gap:8,margin:"8px 0",padding:"8px 10px",background:"#f8fafc",borderRadius:8,border:"1px solid #e2e8f0",alignItems:"center",flexWrap:"wrap"}}><span style={{fontSize:11,fontWeight:700,color:"#475569"}}>Ã¬Â ÂÃ«ÂÂµÃ¬ÂÂ¤Ã¬Â Â</span><label style={{fontSize:10,color:"#64748b"}}>TP1<input type="number" value={cTP[g]?.tp1||""} onChange={(_g=>e=>setCTP(p=>({...p,[_g]:{...p[_g],tp1:+e.target.value}})))(g)} placeholder={NS[g]?.tp1} style={{width:40,margin:"0 4px",padding:"2px 4px",border:"1px solid #cbd5e1",borderRadius:4,fontSize:11}}/>%</label><label style={{fontSize:10,color:"#64748b"}}>TP2<input type="number" value={cTP[g]?.tp2||""} onChange={(_g=>e=>setCTP(p=>({...p,[_g]:{...p[_g],tp2:+e.target.value}})))(g)} placeholder={NS[g]?.tp2} style={{width:40,margin:"0 4px",padding:"2px 4px",border:"1px solid #cbd5e1",borderRadius:4,fontSize:11}}/>%</label><label style={{fontSize:10,color:"#64748b"}}>SL<input type="number" value={cTP[g]?.sl||""} onChange={(_g=>e=>setCTP(p=>({...p,[_g]:{...p[_g],sl:+e.target.value}})))(g)} placeholder={NS[g]?.sl} style={{width:40,margin:"0 4px",padding:"2px 4px",border:"1px solid #cbd5e1",borderRadius:4,fontSize:11}}/>%</label><label style={{fontSize:10,color:"#64748b"}}>ÃªÂ°ÂÃ¬Â ÂSL<input type="number" value={cTP[g]?.fsl||""} onChange={(_g=>e=>setCTP(p=>({...p,[_g]:{...p[_g],fsl:+e.target.value}})))(g)} placeholder={NS[g]?.fsl||"off"} style={{width:40,margin:"0 4px",padding:"2px 4px",border:"1px solid #cbd5e1",borderRadius:4,fontSize:11}}/>%</label><button onClick={()=>{setCTP({...cTP,[g]:{tp1:0,tp2:0,sl:0,fsl:0}})}} style={{fontSize:10,padding:"2px 8px",background:"#e2e8f0",border:"none",borderRadius:4,cursor:"pointer"}}>Ã¬Â´ÂÃªÂ¸Â°Ã­ÂÂ</button> <button onClick={()=>{const ds=D_live.filter(x=>x.g===g);let best=null;for(const t1 of [10,15,20,25,30])for(const t2 of [30,50,80,100])for(const sl of [3,5,7,10,15])for(const fsl of [0,7,10,15]){if(t2<=t1)continue;if(fsl>0&&fsl<sl)continue;const rs=ds.map(x=>simReal(x.ohlc,t1,t2,sl,fsl));const cum=rs.reduce((a,x)=>a+x.t,0);if(!best||cum>best.cum)best={t1,t2,sl,fsl,cum};}if(best)setCTP({...cTP,[g]:{tp1:best.t1,tp2:best.t2,sl:best.sl,fsl:best.fsl||0}});}} style={{fontSize:10,padding:"2px 8px",background:"#dbeafe",color:"#1e40af",border:"none",borderRadius:4,cursor:"pointer",marginLeft:4}}>Ã¬ÂÂÃ¬ÂÂµMAX</button><button onClick={()=>{const ds=D_live.filter(x=>x.g===g);let best=null;for(const tp of [10,15,20,25,30,40,50,60,80,100])for(const sl of [3,5,7,10,15,20]){const rs=ds.map(x=>simReal(x.ohlc,tp,tp*2,sl,0));const cum=rs.reduce((a,x)=>a+x.t,0);if(!best||cum>best.cum)best={tp,sl,cum};}if(best)setCTP({...cTP,[g]:{tp1:best.tp,tp2:best.tp,sl:best.sl}});}} style={{fontSize:10,padding:"2px 8px",background:"#ffedd5",color:"#ea580c",border:"none",borderRadius:4,cursor:"pointer",marginLeft:4}}>Ã«ÂÂ¨Ã¬ÂÂ¼TP</button>{(()=>{const ds=D_live.filter(x=>x.g===g);const rs=ds.map(x=>x);const cum=Math.round(rs.reduce((a,x)=>a+x.t,0));const wr=ds.length?Math.round(rs.filter(x=>x.t>0).length/ds.length*100):0;const ev=ds.length?(rs.reduce((a,x)=>a+x.t,0)/ds.length).toFixed(2):0;return(<span style={{fontSize:11,fontWeight:700,marginLeft:8}}><span style={{color:"#2563eb"}}>Ã«ÂÂÃ¬Â Â{cum>0?"+":""}{cum}%</span> <span style={{color:"#dc2626"}}>Ã¬ÂÂ¹Ã«Â¥Â {wr}%</span> <span style={{color:"#7c3aed"}}>EV={ev}</span></span>)})()}</div><div style={{display:"flex",justifyContent:"space-between"}}><span style={{fontSize:26,fontWeight:900,color:tab===g?"#fff":i.c}}>{g}</span></div><div style={{fontSize:22,fontWeight:900,color:tab===g?"#fff":i.c}}>{s.n}<span style={{fontSize:11,fontWeight:400}}>ÃªÂ±Â´</span></div><div style={{fontSize:11,color:tab===g?"rgba(255,255,255,0.8)":"#64748b",marginTop:2}}>+{s.avg}%/ÃªÂ±Â´ ÃÂ· Ã¬ÂÂ¹Ã«Â¥Â <strong>{s.wr}%</strong> ÃÂ· Ã­ÂÂÃ­ÂÂ+{s.cum}%</div><div style={{fontSize:10,color:tab===g?"rgba(255,255,255,0.65)":"#94a3b8",marginTop:1}}>TP1{s.tp1c}({s.tp1r}%) ÃÂ· TP2{s.boc}({s.bor}%) ÃÂ· SL{s.slc}({s.slr}%)</div></div>)})} <div style={{background:"#f1f5f9",borderRadius:14,padding:"12px 14px"}}><span style={{fontSize:26,fontWeight:900,color:"#94a3b8"}}>X</span><div style={{fontSize:22,fontWeight:900,color:"#94a3b8"}}>{XN}<span style={{fontSize:11,fontWeight:400}}>ÃªÂ±Â´</span></div><div style={{fontSize:11,color:"#94a3b8",marginTop:2}}>Ã«Â§Â¤Ã¬ÂÂÃªÂ¸ÂÃ¬Â§Â</div></div></div>{st[tab]&&<div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:6,marginBottom:12}}><div style={{background:"#f0fdf4",borderRadius:10,padding:"8px 10px",textAlign:"center",border:"1px solid #fee2e2"}}><div style={{fontSize:10,color:"#dc2626"}}>Ã¬ÂÂµÃ¬Â Â (TP1+TP2)</div><div style={{fontSize:18,fontWeight:900,color:"#dc2626"}}>{st[tab].tp1c}ÃªÂ±Â´</div><div style={{fontSize:10,color:"#64748b"}}>{st[tab].tp1r}% ÃÂ· TP2{st[tab].boc}ÃªÂ±Â´({st[tab].bor}%)</div></div><div style={{background:"#fef2f2",borderRadius:10,padding:"8px 10px",textAlign:"center",border:"1px solid #fecaca"}}><div style={{fontSize:10,color:"#dc2626"}}>Ã¬ÂÂÃ¬Â Â (SL)</div><div style={{fontSize:18,fontWeight:900,color:"#dc2626"}}>{st[tab].slc}ÃªÂ±Â´</div><div style={{fontSize:10,color:"#64748b"}}>{Math.round((st[tab].slc)/st[tab].n*100)}%</div></div><div style={{background:"#f8fafc",borderRadius:10,padding:"8px 10px",textAlign:"center",border:"1px solid #e2e8f0"}}><div style={{fontSize:10,color:"#64748b"}}>ÃªÂ¸Â°ÃªÂ°ÂÃ«Â§ÂÃ«Â£Â (TO)</div><div style={{fontSize:18,fontWeight:900,color:"#64748b"}}>{st[tab].toc}ÃªÂ±Â´</div><div style={{fontSize:10,color:"#94a3b8"}}>{st[tab].tor}%</div></div></div>}<div style={{borderRadius:12,border:"1px solid #e2e8f0",overflow:"hidden"}}><div style={{overflowX:"auto"}}><table style={{width:"100%",minWidth:760,borderCollapse:"collapse",fontSize:13}}><thead><tr style={{background:"#f8fafc"}}>{[{k:"d",l:"Ã«ÂÂ Ã¬Â§Â"},{k:"n",l:"Ã¬Â¢ÂÃ«ÂªÂ©"},{k:"ch",l:"Ã«ÂÂ±Ã«ÂÂ½"},{k:"iv",l:"Ã¬ÂÂÃªÂ¸Â"},{k:"sc",l:"NEO"},{k:"r",l:""}].map(h=>(<th key={h.k} onClick={()=>ds(h.k)} style={{padding:"8px 5px",textAlign:h.k==="n"?"left":"center",fontWeight:600,fontSize:11,color:"#94a3b8",cursor:"pointer",borderBottom:"2px solid #e2e8f0",whiteSpace:"nowrap",userSelect:"none"}}>{h.l}{srt.c===h.k?(srt.d==="asc"?" Ã¢ÂÂ":" Ã¢ÂÂ"):""}</th>))}</tr></thead><tbody>{pd.map((r,i)=>{const isO=open===pg*PP+i,gi=GI[r.g];return[<tr key={"r"+i} onClick={()=>setOpen(isO?null:pg*PP+i)} style={{cursor:"pointer",borderBottom:"1px solid #f1f5f9",background:isO?gi.bg:"#fff"}}><td style={{padding:"8px 5px",textAlign:"center",fontSize:11,color:"#94a3b8"}}>{r.d.slice(2)}</td><td style={{padding:"8px 5px",fontWeight:700,fontSize:13,maxWidth:120,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{r.n}</td><td style={{padding:"8px 5px",textAlign:"center",fontWeight:700,color:"#dc2626",fontSize:12}}>+{r.ch}%</td><td style={{padding:"8px 5px",textAlign:"center",fontSize:11,fontWeight:600,color:r.iv==="ÃªÂ¸Â°+Ã¬ÂÂ¸"?"#7c3aed":r.iv==="Ã¬ÂÂ¸Ã¬ÂÂ¸"?"#2563eb":"#94a3b8"}}>{r.iv}</td><td style={{padding:"8px 5px",textAlign:"center"}}><span style={{background:gi.c+"12",color:gi.c,padding:"1px 7px",borderRadius:20,fontWeight:800,fontSize:12}}>{r.sc}</span></td><td style={{padding:"8px 5px",textAlign:"center",fontWeight:800,fontSize:13,color:r.t>0?"#dc2626":"#2563eb"}}>{((r.t>0?"+":"")+r.t+"%"+(function(){var a=invAmt.useSame?invAmt.same:(invAmt[r.g]||0);if(!a)return"";var g=Math.round(a*r.t/100);return" ("+(g>=0?"+":"")+g.toLocaleString()+"Ã¬ÂÂ)";})())}</td><td style={{padding:"8px 5px",textAlign:"center"}}><span style={{padding:"1px 4px",borderRadius:4,fontSize:10,fontWeight:700,background:RC(r.r)+"12",color:RC(r.r)}}>{RL(r.r)}</span></td></tr>,isO&&(<tr key={"d"+i}><td colSpan={9} style={{padding:0}}><div style={{padding:"12px 16px",background:gi.bg,borderBottom:"2px solid "+gi.bd}}><div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(80px,1fr))",gap:5,marginBottom:8}}>{[{l:"Ã¬ÂÂÃ¬Â´Â",v:r.mc},{l:"Ã¬ÂÂÃªÂ¸Â",v:r.iv},{l:"Ã¬ÂµÂÃ«ÂÂÃ¢ÂÂ",v:"+"+r.pk+"%",c:"#dc2626"},{l:"Ã¬ÂµÂÃ«ÂÂÃ¢ÂÂ",v:r.dd+"%",c:"#dc2626"},{l:"TP1Ã«ÂÂÃ«ÂÂ¬Ã¬ÂÂ¼",v:r.tp1d?r.tp1d+(r.tp1dy?" ("+r.tp1dy+"Ã¬ÂÂ¼)":""):"-",c:r.tp1d?"#2563eb":"#94a3b8"},{l:"SLÃ¬ÂÂÃ¬Â ÂÃ¬ÂÂ¼",v:r.sld?r.sld+(r.sldy?" ("+r.sldy+"Ã¬ÂÂ¼)":""):"-",c:r.sld?"#dc2626":"#94a3b8"},{l:"TP2Ã«ÂÂÃ«ÂÂ¬Ã¬ÂÂ¼",v:r.tp2d||"-",c:r.tp2d?"#dc2626":"#94a3b8"},{l:"Ã¬Â²Â­Ã¬ÂÂ°Ã¬ÂÂ¼",v:r.exd?r.exd+(r.exdy?" ("+r.exdy+"Ã¬ÂÂ¼)":""):"-",c:"#64748b"}].map((x,j)=>(<div key={j} style={{background:"#fff",borderRadius:6,padding:"4px 6px"}}><div style={{fontSize:9,color:"#94a3b8"}}>{x.l}</div><div style={{fontSize:13,fontWeight:700,color:x.c||"#1e293b"}}>{x.v}</div></div>))}</div><div style={{background:"#fff",borderRadius:6,padding:"12px 14px"}}><div style={{display:"flex",alignItems:"baseline",gap:10,marginBottom:6,flexWrap:"wrap"}}><div style={{fontSize:22,fontWeight:900,color:r.t>=0?"#dc2626":"#2563eb"}}>Ã¬ÂÂ¤Ã­ÂÂ {r.t>0?"+":""}{r.t}%</div><div style={{fontSize:10,color:"#94a3b8",fontWeight:600}}>ÃªÂ±Â°Ã«ÂÂ Ã¬ÂÂÃ«ÂÂÃ«Â¦Â¬Ã¬ÂÂ¤</div></div><div style={{fontSize:11,color:"#475569",lineHeight:1.8}}>{SD(r,cTP)}</div></div></div></td></tr>)]})}</tbody></table></div></div><div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginTop:10}}><span style={{fontSize:12,color:"#94a3b8"}}>{fl.length}ÃªÂ±Â´ Ã¬Â¤Â {pg*PP+1}~{Math.min((pg+1)*PP,fl.length)}</span><div style={{display:"flex",gap:4}}><button onClick={()=>setPg(Math.max(0,pg-1))} disabled={pg===0} style={{padding:"5px 12px",borderRadius:8,border:"1px solid #e2e8f0",background:"#fff",fontSize:13,fontWeight:700,cursor:pg===0?"default":"pointer",color:pg===0?"#e2e8f0":"#1e293b"}}>Ã¢ÂÂ</button><input type="number" value={pg+1} min={1} max={mx+1} onChange={e=>{const v=parseInt(e.target.value)-1;if(!isNaN(v)&&v>=0&&v<=mx)setPg(v);}} style={{padding:"5px 4px",fontSize:13,color:"#64748b",width:50,textAlign:"center",border:"1px solid #e2e8f0",borderRadius:6}}/><span style={{padding:"5px 2px",fontSize:13,color:"#94a3b8"}}>/{mx+1}</span><button onClick={()=>setPg(Math.min(mx,pg+1))} disabled={pg>=mx} style={{padding:"5px 12px",borderRadius:8,border:"1px solid #e2e8f0",background:"#fff",fontSize:13,fontWeight:700,cursor:pg>=mx?"default":"pointer",color:pg>=mx?"#e2e8f0":"#1e293b"}}>Ã¢ÂÂ</button></div></div></div>);}

function ChimchakhaeDB({onRowClick}={}){const [tab,setTab]=useState("S+");const [cTP,setCTP]=useState(CCNS);const [srt,setSrt]=useState({c:"d",d:"desc"});const [open,setOpen]=useState(null);const [pg,setPg]=useState(0);const[invAmt,setInvAmt]=useState(()=>{try{return JSON.parse(localStorage.getItem("invAmt_cc_v1")||"")||{"S+":1000000,S:1000000,"A+":700000,A:500000,"B+":400000,B:300000,C:100000,same:500000,useSame:false}}catch(e){return{"S+":1000000,S:1000000,"A+":700000,A:500000,"B+":400000,B:300000,C:100000,same:500000,useSame:false}}});const[mode,setMode]=useState(()=>{try{const v=localStorage.getItem("mode_cc_v1");return v==="full"||v==="middle"||v==="tight"?v:"tight"}catch(e){return "tight"}});const[yearFilter,setYearFilter]=useState("all");const[fromD,setFromD]=useState("");const[toD,setToD]=useState("");const[supplyFilter,setSupplyFilter]=useState("all");const[highFilter,setHighFilter]=useState("all");const[holdFilter,setHoldFilter]=useState("all");
useEffect(()=>{const h=(e)=>{if((e.ctrlKey||e.metaKey)&&(e.key==="k"||e.key==="K")){e.preventDefault();setMode(v=>v==="tight"?"full":v==="full"?"middle":"tight");}};window.addEventListener("keydown",h);return()=>window.removeEventListener("keydown",h);},[]);
useEffect(()=>{const t=setTimeout(()=>{[...document.querySelectorAll("button")].filter(b=>b.textContent.trim()==="Ã¬ÂÂÃ¬ÂÂµMAX").forEach(b=>b.click());},400);return ()=>clearTimeout(t);},[]);useEffect(()=>{try{localStorage.setItem("mode_cc_v1",mode)}catch(e){}},[mode]);const PP=30;const D_live=useMemo(()=>{let _r=D.filter(r=>strictPassCC(r,mode)&&(yearFilter==="all"||(r.d&&r.d.slice(0,4)===yearFilter))&&(!fromD||(r.d&&r.d>=fromD))&&(!toD||(r.d&&r.d<=toD))&&(supplyFilter==="all"||(supplyFilter==="gi_oe"&&r.iv==="ÃªÂ¸Â°+Ã¬ÂÂ¸")||(supplyFilter==="oe"&&r.iv==="Ã¬ÂÂ¸Ã«Â§Â")||(supplyFilter==="gi"&&r.iv==="ÃªÂ¸Â°Ã«Â§Â")||(supplyFilter==="dual_minus"&&r.iv==="Ã«ÂÂÃ«ÂÂ¤-"))&&(highFilter==="all"||(highFilter==="h60"&&r.h60===1)||(highFilter==="h120"&&r.h120===1)||(highFilter==="both"&&r.h60===1&&r.h120===1)));_r=_r.map(rr=>{const cp=cTP[rr.ccG];if(!cp||!rr.ohlc||!rr.ohlc.length)return rr;const sim=simReal(rr.ohlc,cp.tp1,cp.tp2,cp.sl,cp.fsl||0);return{g:(rr.ccG||"B"),ta:rr.mc,...rr,t:sim.t,r:sim.r,tp1d:sim.tp1d||rr.tp1d,tp2d:sim.tp2d||rr.tp2d,sld:sim.sld||rr.sld,bed:sim.bed,exd:sim.exd||rr.exd,tp1dy:sim.tp1dy,tp2dy:sim.tp2dy,sldy:sim.sldy,bedy:sim.bedy,exdy:sim.exdy};});if(holdFilter!=="all"){const hd=+holdFilter;_r=_r.filter(x=>x.ohlc&&x.ohlc.length>=hd).map(x=>({...x,t:x.ohlc[hd-1].c,r:hd+"Ã¬ÂÂ¼Ã«Â³Â´Ã¬ÂÂ "}));}return _r;},[cTP,mode,yearFilter,fromD,toD,supplyFilter,highFilter,holdFilter]);const st=useMemo(()=>{const r={};["S+","S","A+","A","B+","B","C"].forEach(g=>{const d=D_live.filter(x=>x.ccG===g),w=d.filter(x=>x.t>0),sl=d.filter(x=>x.r==="SL"),bo=d.filter(x=>x.r==="BOTH"),tp1=d.filter(x=>{const rr=x.r;return rr==="TP1"||rr==="BOTH";}),to=d.filter(x=>x.r==="TO");const avg=d.length?(d.reduce((s,x)=>s+x.t,0)/d.length):0;const nw=d.map(x=>x);const nwCum=Math.round(nw.reduce((s,x)=>s+x.t,0));const nwWin=nw.filter(x=>x.t>0).length;r[g]={n:d.length,avg:avg.toFixed(2),wr:d.length?Math.round(w.length/d.length*100):0,cum:Math.round(d.reduce((s,x)=>s+x.t,0)),tp1c:tp1.length,tp1r:d.length?Math.round(tp1.length/d.length*100):0,boc:bo.length,bor:d.length?Math.round(bo.length/d.length*100):0,slc:sl.length,slr:d.length?Math.round(sl.length/d.length*100):0,toc:to.length,tor:d.length?Math.round(to.length/d.length*100):0,nwCum,nwWr:d.length?Math.round(nwWin/d.length*100):0}});return r},[cTP,D_live]);const fl=useMemo(()=>{let d=D_live.filter(r=>r.ccG===tab);return[...d].sort((a,b)=>{const av=a[srt.c],bv=b[srt.c];if(typeof av==="number")return (srt.d==="asc"?av-bv:bv-av);return srt.d==="asc"?String(av).localeCompare(String(bv)):String(bv).localeCompare(String(av))})},[tab,srt,invAmt,D_live]);const portfolio=useMemo(()=>{
const amt=invAmt.useSame?{"S+":invAmt.same,"S":invAmt.same,"A+":invAmt.same,"A":invAmt.same,"B+":invAmt.same,"B":invAmt.same,"C":invAmt.same}:{"S+":invAmt["S+"],"S":invAmt.S,"A+":invAmt["A+"],"A":invAmt.A,"B+":invAmt["B+"],"B":invAmt.B,"C":invAmt.C};
const parseTA=s=>{if(!s)return 0;const m=s.match(/(\d+)Ã¬ÂÂµ/);return m?+m[1]:0;};
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
},[D_live,invAmt]);const pd=fl.slice(pg*PP,(pg+1)*PP),mx=Math.ceil(fl.length/PP)-1;const ds=c=>setSrt(p=>p.c===c?{c,d:p.d==="asc"?"desc":"asc"}:{c,d:"desc"});return(<div><div style={{marginBottom:8,padding:10,background:"#0f1420",border:"1px solid #2a3040",borderRadius:8,display:"flex",alignItems:"center",gap:10,flexWrap:"wrap"}}><span style={{color:"#9ca3af",fontSize:12,fontWeight:700}}>ÃªÂ¸Â°ÃªÂ°Â</span>{[["all","Ã¬Â ÂÃ¬Â²Â´"],["2026","26Ã«ÂÂ"],["2025","25Ã«ÂÂ"],["2024","24Ã«ÂÂ"],["2023","23Ã«ÂÂ"],["2022","22Ã«ÂÂ"],["2021","21Ã«ÂÂ"]].map(([v,l])=>(<button key={v} onClick={()=>setYearFilter(v)} style={{background:yearFilter===v?"#60a5fa":"#1f2937",color:yearFilter===v?"#000":"#d1d5db",border:"1px solid #374151",borderRadius:6,padding:"4px 10px",fontSize:12,cursor:"pointer",fontWeight:yearFilter===v?700:400}}>{l}</button>))}<span style={{color:"#4b5563"}}>|</span><input type="date" value={fromD} onChange={e=>setFromD(e.target.value)} style={{background:"#1f2937",color:"#fff",border:"1px solid #374151",borderRadius:6,padding:"3px 6px",fontSize:11}}/><span style={{color:"#6b7280",fontSize:11}}>~</span><input type="date" value={toD} onChange={e=>setToD(e.target.value)} style={{background:"#1f2937",color:"#fff",border:"1px solid #374151",borderRadius:6,padding:"3px 6px",fontSize:11}}/><button onClick={()=>{setFromD("");setToD("");setYearFilter("all")}} style={{background:"#374151",color:"#fff",border:"none",borderRadius:6,padding:"3px 8px",fontSize:11,cursor:"pointer"}}>Ã¬Â´ÂÃªÂ¸Â°Ã­ÂÂ</button><span style={{color:"#4b5563"}}>|</span><span style={{color:"#9ca3af",fontSize:12}}>Ã¬Â´Â <b style={{color:"#fff"}}>{D_live.length}</b>ÃªÂ±Â´</span><span style={{color:"#9ca3af",fontSize:12}}>Ã«ÂÂÃ¬Â Â <b style={{color:D_live.reduce((a,b)=>a+(b.t||0),0)>=0?"#ef4444":"#3b82f6"}}>{D_live.reduce((a,b)=>a+(b.t||0),0).toFixed(1)}%</b></span><span style={{color:"#9ca3af",fontSize:12}}>Ã¬ÂÂ¹Ã«Â¥Â  <b style={{color:"#fff"}}>{D_live.length?(D_live.filter(x=>x.t>0).length/D_live.length*100).toFixed(1):0}%</b></span></div><div style={{marginBottom:8,padding:10,background:"#0f1420",border:"1px solid #2a3040",borderRadius:8,display:"flex",alignItems:"center",gap:10,flexWrap:"wrap"}}><span style={{color:"#9ca3af",fontSize:12,fontWeight:700}}>Ã¬ÂÂÃªÂ¸Â</span>{[["all","Ã¬Â ÂÃ¬Â²Â´"],["gi_oe","ÃªÂ¸Â°+Ã¬ÂÂ¸"],["oe","Ã¬ÂÂ¸Ã«Â§Â"],["gi","ÃªÂ¸Â°Ã«Â§Â"],["dual_minus","Ã«ÂÂÃ«ÂÂ¤-"]].map(([v,l])=>(<button key={v} onClick={()=>setSupplyFilter(v)} style={{background:supplyFilter===v?"#60a5fa":"#1f2937",color:supplyFilter===v?"#000":"#d1d5db",border:"1px solid #374151",borderRadius:6,padding:"4px 10px",fontSize:12,cursor:"pointer",fontWeight:supplyFilter===v?700:400}}>{l}</button>))}<span style={{color:"#9ca3af",fontSize:11,marginLeft:"auto"}}>Ã¢ÂÂ» Ã­ÂÂÃ¬ÂÂ¬ 26Ã«ÂÂ Ã«ÂÂ°Ã¬ÂÂ´Ã­ÂÂ°Ã«Â§Â Ã¬ÂÂÃªÂ¸Â Ã¬Â ÂÃ«Â³Â´ Ã¬ÂÂÃ¬ÂÂ (22~25Ã«ÂÂ Ã¬Â¶ÂÃ­ÂÂ Ã«Â³Â´ÃªÂ°Â Ã¬ÂÂÃ¬Â Â)</span></div><div style={{marginBottom:8,padding:10,background:"#0f1420",border:"1px solid #2a3040",borderRadius:8,display:"flex",alignItems:"center",gap:10,flexWrap:"wrap"}}><span style={{color:"#9ca3af",fontSize:12,fontWeight:700}}>Ã¬ÂÂ ÃªÂ³Â ÃªÂ°Â</span>{[["all","Ã¬Â ÂÃ¬Â²Â´"],["h60","60Ã¬ÂÂ¼Ã¢ÂÂ"],["h120","120Ã¬ÂÂ¼Ã¢ÂÂ"],["both","Ã«ÂÂÃ«ÂÂ¤Ã¢ÂÂ"]].map(([v,l])=>(<button key={v} onClick={()=>setHighFilter(v)} style={{background:highFilter===v?"#f59e0b":"#1f2937",color:highFilter===v?"#000":"#d1d5db",border:"1px solid #374151",borderRadius:6,padding:"4px 10px",fontSize:12,cursor:"pointer",fontWeight:highFilter===v?700:400}}>{l}</button>))}<span style={{color:"#9ca3af",fontSize:11,marginLeft:"auto"}}>Ã¢ÂÂ» 25/26Ã«ÂÂ Ã¬Â ÂÃ¬ÂÂ© (22~24Ã«ÂÂ Ã¬ÂÂ¬Ã¬ÂÂÃ¬Â§Â Ã¬ÂÂÃ¬Â Â)</span></div><div style={{marginBottom:8,padding:10,background:"#0f1420",border:"1px solid #2a3040",borderRadius:8,display:"flex",alignItems:"center",gap:10,flexWrap:"wrap"}}><span style={{color:"#9ca3af",fontSize:12,fontWeight:700}}>Ã«Â³Â´Ã¬ÂÂ </span>{[["all","Ã¬Â ÂÃ¬Â²Â´"],["5","Ã¢ÂÂ¤5Ã¬ÂÂ¼"],["10","Ã¢ÂÂ¤10Ã¬ÂÂ¼"],["15","Ã¢ÂÂ¤15Ã¬ÂÂ¼"],["20","Ã¢ÂÂ¤20Ã¬ÂÂ¼"],["25","Ã¢ÂÂ¤25Ã¬ÂÂ¼"],["30","Ã¢ÂÂ¤30Ã¬ÂÂ¼"],["35","Ã¢ÂÂ¤35Ã¬ÂÂ¼"],["40","Ã¢ÂÂ¤40Ã¬ÂÂ¼"],["45","Ã¢ÂÂ¤45Ã¬ÂÂ¼"],["50","Ã¢ÂÂ¤50Ã¬ÂÂ¼"],["55","Ã¢ÂÂ¤55Ã¬ÂÂ¼"],["60","Ã¢ÂÂ¤60Ã¬ÂÂ¼"]].map(([v,l])=>(<button key={v} onClick={()=>setHoldFilter(v)} style={{background:holdFilter===v?"#10b981":"#1f2937",color:holdFilter===v?"#000":"#d1d5db",border:"1px solid #374151",borderRadius:6,padding:"4px 10px",fontSize:12,cursor:"pointer",fontWeight:holdFilter===v?700:400}}>{l}</button>))}<span style={{color:"#9ca3af",fontSize:11,marginLeft:"auto"}}>Ã¢ÂÂ» 60Ã¬ÂÂ¼ÃªÂ¹ÂÃ¬Â§Â Ã¬Â ÂÃªÂµÂ¬ÃªÂ°Â Ã¬Â ÂÃ¬ÂÂ©</span></div><div style={{marginBottom:12,padding:12,background:"#0f1420",border:"1px solid #2a3040",borderRadius:8}}>
<div style={{display:"flex",alignItems:"center",gap:8,marginBottom:10,flexWrap:"wrap"}}>
<span style={{fontSize:12,fontWeight:700,color:"#26C6DA"}}>Ã°ÂÂÂ° Ã­ÂÂ¬Ã¬ÂÂÃªÂ¸Â ÃªÂ³ÂÃ¬ÂÂ°ÃªÂ¸Â°</span>
<label style={{display:"flex",alignItems:"center",gap:4,fontSize:11,color:"#aaa",cursor:"pointer"}}>
<input type="checkbox" checked={invAmt.useSame} onChange={e=>setInvAmt({...invAmt,useSame:e.target.checked})}/>
Ã«ÂªÂ¨Ã«ÂÂ  Ã¬Â¢ÂÃ«ÂªÂ© Ã«ÂÂÃ¬ÂÂ¼ ÃªÂ¸ÂÃ¬ÂÂ¡
</label>
<button onClick={()=>setMode(mode==="tight"?"full":mode==="full"?"middle":"tight")} style={{padding:"4px 10px",fontSize:10,fontWeight:700,border:"1px solid "+((mode==="tight"?"#dc2626":mode==="middle"?"#F5A623":"#444")),background:(mode==="tight"?"#dc2626":mode==="middle"?"#F5A623":"transparent"),color:(mode==="tight")?"#fff":"#888",borderRadius:4,cursor:"pointer",marginRight:8}}>{mode==="tight"?"Ã°ÂÂÂ¯ Ã­ÂÂÃ¬ÂÂ´Ã­ÂÂ¸ (Ctrl+K)":mode==="middle"?"Ã°ÂÂÂ¸ Ã«Â¯Â¸Ã«ÂÂ¤ (Ctrl+K)":"Ã¢ÂÂª Ã­ÂÂ (Ctrl+K)"}</button><div style={{display:"flex",gap:10,fontSize:10,marginLeft:"auto",flexWrap:"wrap"}}><span style={{color:"#dc2626",fontWeight:700}}>Ã°ÂÂÂ¯ Ã¬ÂÂµÃ¬Â Â {portfolio.resStats.tp}ÃªÂ±Â´</span><span style={{color:"#2563eb",fontWeight:700}}>Ã°ÂÂÂ Ã¬ÂÂÃ¬Â Â {portfolio.resStats.sl}ÃªÂ±Â´</span><span style={{color:"#888"}}>Ã¢ÂÂ± ÃªÂ¸Â°ÃªÂ°ÂÃ«Â§ÂÃ«Â£Â {portfolio.resStats.to}ÃªÂ±Â´</span><span style={{color:"#666"}}>Ã¬Â ÂÃ¬Â²Â´ {portfolio.total.n}ÃªÂ±Â´</span></div>


</div>
{invAmt.useSame?(
<div style={{display:"flex",alignItems:"center",gap:8,marginBottom:10}}>
<span style={{fontSize:11,color:"#ccc",width:60}}>Ã¬Â¢ÂÃ«ÂªÂ©Ã«ÂÂ¹</span>
<input type="number" value={invAmt.same} onChange={e=>setInvAmt({...invAmt,same:+e.target.value||0})} style={{flex:1,padding:"6px 8px",background:"#1a1a2e",border:"1px solid #333",borderRadius:4,color:"#fff",fontSize:12}} step="100000"/>
<span style={{fontSize:10,color:"#888"}}>Ã¬ÂÂ</span>
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
<div style={{fontSize:10,color:"#888",marginBottom:3}}>{gk}ÃªÂ¸Â ({d.n}ÃªÂ±Â´)</div>
<div style={{fontSize:14,fontWeight:700,color:c}}>{d.pnl>=0?"+":""}{d.pnl.toLocaleString()}Ã¬ÂÂ</div>
<div style={{fontSize:9,color:"#666"}}>Ã­ÂÂ¬Ã¬ÂÂ {d.amt.toLocaleString()} ÃÂ· {roi.toFixed(1)}% ÃÂ· Ã¬ÂÂ¹ {d.n>0?(d.win/d.n*100).toFixed(0):0}%</div>
</div>);
})}
<div style={{padding:"8px 10px",background:"#1a2e2a",borderRadius:6,borderLeft:"3px solid #26C6DA"}}>
<div style={{fontSize:10,color:"#26C6DA",marginBottom:3,fontWeight:700}}>Ã¬Â ÂÃ¬Â²Â´ ({portfolio.total.n}ÃªÂ±Â´)</div>
<div style={{fontSize:14,fontWeight:700,color:portfolio.total.pnl>0?"#dc2626":portfolio.total.pnl<0?"#2563eb":"#888"}}>{portfolio.total.pnl>=0?"+":""}{portfolio.total.pnl.toLocaleString()}Ã¬ÂÂ</div>
<div style={{fontSize:9,color:"#666"}}>Ã­ÂÂ¬Ã¬ÂÂ {portfolio.total.amt.toLocaleString()} ÃÂ· {portfolio.total.amt>0?(portfolio.total.pnl/portfolio.total.amt*100).toFixed(1):0}% ÃÂ· Ã¬ÂÂ¹ {portfolio.total.n>0?(portfolio.total.win/portfolio.total.n*100).toFixed(0):0}%</div>
</div>
</div>
</div><div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(148px,1fr))",gap:8,marginBottom:18}}>{["S+","S","A+","A","B+","B","C"].map(g=>{const i=GI[g],s=st[g];return(<div key={g} onClick={()=>{setTab(g);setPg(0);setOpen(null)}} style={{background:tab===g?i.c:i.bg,borderRadius:14,padding:"12px 14px",cursor:"pointer",border:tab===g?"none":"0.5px solid "+i.bd}}><div style={{display:"flex",gap:8,margin:"8px 0",padding:"8px 10px",background:"#f8fafc",borderRadius:8,border:"1px solid #e2e8f0",alignItems:"center",flexWrap:"wrap"}}><span style={{fontSize:11,fontWeight:700,color:"#475569"}}>Ã¬Â ÂÃ«ÂÂµÃ¬ÂÂ¤Ã¬Â Â</span><label style={{fontSize:10,color:"#64748b"}}>TP1<input type="number" value={cTP[g]?.tp1||""} onChange={(_g=>e=>setCTP(p=>({...p,[_g]:{...p[_g],tp1:+e.target.value}})))(g)} placeholder={NS[g]?.tp1} style={{width:40,margin:"0 4px",padding:"2px 4px",border:"1px solid #cbd5e1",borderRadius:4,fontSize:11}}/>%</label><label style={{fontSize:10,color:"#64748b"}}>TP2<input type="number" value={cTP[g]?.tp2||""} onChange={(_g=>e=>setCTP(p=>({...p,[_g]:{...p[_g],tp2:+e.target.value}})))(g)} placeholder={NS[g]?.tp2} style={{width:40,margin:"0 4px",padding:"2px 4px",border:"1px solid #cbd5e1",borderRadius:4,fontSize:11}}/>%</label><label style={{fontSize:10,color:"#64748b"}}>SL<input type="number" value={cTP[g]?.sl||""} onChange={(_g=>e=>setCTP(p=>({...p,[_g]:{...p[_g],sl:+e.target.value}})))(g)} placeholder={NS[g]?.sl} style={{width:40,margin:"0 4px",padding:"2px 4px",border:"1px solid #cbd5e1",borderRadius:4,fontSize:11}}/>%</label><label style={{fontSize:10,color:"#64748b"}}>ÃªÂ°ÂÃ¬Â ÂSL<input type="number" value={cTP[g]?.fsl||""} onChange={(_g=>e=>setCTP(p=>({...p,[_g]:{...p[_g],fsl:+e.target.value}})))(g)} placeholder={NS[g]?.fsl||"off"} style={{width:40,margin:"0 4px",padding:"2px 4px",border:"1px solid #cbd5e1",borderRadius:4,fontSize:11}}/>%</label><button onClick={()=>{setCTP({...cTP,[g]:{tp1:0,tp2:0,sl:0,fsl:0}})}} style={{fontSize:10,padding:"2px 8px",background:"#e2e8f0",border:"none",borderRadius:4,cursor:"pointer"}}>Ã¬Â´ÂÃªÂ¸Â°Ã­ÂÂ</button> <button onClick={()=>{const ds=D_live.filter(x=>x.ccG===g);let best=null;for(const t1 of [10,15,20,25,30])for(const t2 of [30,50,80,100])for(const sl of [3,5,7,10,15])for(const fsl of [0,7,10,15]){if(t2<=t1)continue;if(fsl>0&&fsl<sl)continue;const rs=ds.map(x=>simReal(x.ohlc,t1,t2,sl,fsl));const cum=rs.reduce((a,x)=>a+x.t,0);if(!best||cum>best.cum)best={t1,t2,sl,fsl,cum};}if(best)setCTP({...cTP,[g]:{tp1:best.t1,tp2:best.t2,sl:best.sl,fsl:best.fsl||0}});}} style={{fontSize:10,padding:"2px 8px",background:"#dbeafe",color:"#1e40af",border:"none",borderRadius:4,cursor:"pointer",marginLeft:4}}>Ã¬ÂÂÃ¬ÂÂµMAX</button><button onClick={()=>{const ds=D_live.filter(x=>x.ccG===g);let best=null;for(const tp of [10,15,20,25,30,40,50,60,80,100])for(const sl of [3,5,7,10,15,20]){const rs=ds.map(x=>simReal(x.ohlc,tp,tp*2,sl,0));const cum=rs.reduce((a,x)=>a+x.t,0);if(!best||cum>best.cum)best={tp,sl,cum};}if(best)setCTP({...cTP,[g]:{tp1:best.tp,tp2:best.tp,sl:best.sl}});}} style={{fontSize:10,padding:"2px 8px",background:"#ffedd5",color:"#ea580c",border:"none",borderRadius:4,cursor:"pointer",marginLeft:4}}>Ã«ÂÂ¨Ã¬ÂÂ¼TP</button>{(()=>{const ds=D_live.filter(x=>x.ccG===g);const rs=ds.map(x=>x);const cum=Math.round(rs.reduce((a,x)=>a+x.t,0));const wr=ds.length?Math.round(rs.filter(x=>x.t>0).length/ds.length*100):0;const ev=ds.length?(rs.reduce((a,x)=>a+x.t,0)/ds.length).toFixed(2):0;return(<span style={{fontSize:11,fontWeight:700,marginLeft:8}}><span style={{color:"#2563eb"}}>Ã«ÂÂÃ¬Â Â{cum>0?"+":""}{cum}%</span> <span style={{color:"#dc2626"}}>Ã¬ÂÂ¹Ã«Â¥Â {wr}%</span> <span style={{color:"#7c3aed"}}>EV={ev}</span></span>)})()}</div><div style={{display:"flex",justifyContent:"space-between"}}><span style={{fontSize:26,fontWeight:900,color:tab===g?"#fff":i.c}}>{g}</span></div><div style={{fontSize:22,fontWeight:900,color:tab===g?"#fff":i.c}}>{s.n}<span style={{fontSize:11,fontWeight:400}}>ÃªÂ±Â´</span></div><div style={{fontSize:11,color:tab===g?"rgba(255,255,255,0.8)":"#64748b",marginTop:2}}>+{s.avg}%/ÃªÂ±Â´ ÃÂ· Ã¬ÂÂ¹Ã«Â¥Â <strong>{s.wr}%</strong> ÃÂ· Ã­ÂÂÃ­ÂÂ+{s.cum}%</div><div style={{fontSize:10,color:tab===g?"rgba(255,255,255,0.65)":"#94a3b8",marginTop:1}}>TP1{s.tp1c}({s.tp1r}%) ÃÂ· TP2{s.boc}({s.bor}%) ÃÂ· SL{s.slc}({s.slr}%)</div></div>)})}</div>{st[tab]&&<div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:6,marginBottom:12}}><div style={{background:"#f0fdf4",borderRadius:10,padding:"8px 10px",textAlign:"center",border:"1px solid #fee2e2"}}><div style={{fontSize:10,color:"#dc2626"}}>Ã¬ÂÂµÃ¬Â Â (TP1+TP2)</div><div style={{fontSize:18,fontWeight:900,color:"#dc2626"}}>{st[tab].tp1c}ÃªÂ±Â´</div><div style={{fontSize:10,color:"#64748b"}}>{st[tab].tp1r}% ÃÂ· TP2{st[tab].boc}ÃªÂ±Â´({st[tab].bor}%)</div></div><div style={{background:"#fef2f2",borderRadius:10,padding:"8px 10px",textAlign:"center",border:"1px solid #fecaca"}}><div style={{fontSize:10,color:"#dc2626"}}>Ã¬ÂÂÃ¬Â Â (SL)</div><div style={{fontSize:18,fontWeight:900,color:"#dc2626"}}>{st[tab].slc}ÃªÂ±Â´</div><div style={{fontSize:10,color:"#64748b"}}>{Math.round((st[tab].slc)/st[tab].n*100)}%</div></div><div style={{background:"#f8fafc",borderRadius:10,padding:"8px 10px",textAlign:"center",border:"1px solid #e2e8f0"}}><div style={{fontSize:10,color:"#64748b"}}>ÃªÂ¸Â°ÃªÂ°ÂÃ«Â§ÂÃ«Â£Â (TO)</div><div style={{fontSize:18,fontWeight:900,color:"#64748b"}}>{st[tab].toc}ÃªÂ±Â´</div><div style={{fontSize:10,color:"#94a3b8"}}>{st[tab].tor}%</div></div></div>}<div style={{borderRadius:12,border:"1px solid #e2e8f0",overflow:"hidden"}}><div style={{overflowX:"auto"}}><table style={{width:"100%",minWidth:760,borderCollapse:"collapse",fontSize:13}}><thead><tr style={{background:"#f8fafc"}}>{[{k:"d",l:"Ã«ÂÂ Ã¬Â§Â"},{k:"n",l:"Ã¬Â¢ÂÃ«ÂªÂ©"},{k:"ch",l:"Ã«ÂÂ±Ã«ÂÂ½"},{k:"iv",l:"Ã¬ÂÂÃªÂ¸Â"},{k:"sc",l:"NEO"},{k:"r",l:""}].map(h=>(<th key={h.k} onClick={()=>ds(h.k)} style={{padding:"8px 5px",textAlign:h.k==="n"?"left":"center",fontWeight:600,fontSize:11,color:"#94a3b8",cursor:"pointer",borderBottom:"2px solid #e2e8f0",whiteSpace:"nowrap",userSelect:"none"}}>{h.l}{srt.c===h.k?(srt.d==="asc"?" Ã¢ÂÂ":" Ã¢ÂÂ"):""}</th>))}</tr></thead><tbody>{pd.map((r,i)=>{const isO=open===pg*PP+i,gi=GI[r.ccG];return[<tr key={"r"+i} onClick={()=>{setOpen(isO?null:pg*PP+i);onRowClick&&onRowClick(r);}} style={{cursor:"pointer",borderBottom:"1px solid #f1f5f9",background:isO?gi.bg:"#fff"}}><td style={{padding:"8px 5px",textAlign:"center",fontSize:11,color:"#94a3b8"}}>{r.d.slice(2)}</td><td style={{padding:"8px 5px",fontWeight:700,fontSize:13,maxWidth:120,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{r.n}</td><td style={{padding:"8px 5px",textAlign:"center",fontWeight:700,color:"#dc2626",fontSize:12}}>+{r.ch}%</td><td style={{padding:"8px 5px",textAlign:"center",fontSize:11,fontWeight:600,color:r.iv==="ÃªÂ¸Â°+Ã¬ÂÂ¸"?"#7c3aed":r.iv==="Ã¬ÂÂ¸Ã¬ÂÂ¸"?"#2563eb":"#94a3b8"}}>{r.iv}</td><td style={{padding:"8px 5px",textAlign:"center"}}><span style={{background:gi.c+"12",color:gi.c,padding:"1px 7px",borderRadius:20,fontWeight:800,fontSize:12}}>{r.sc}</span></td><td style={{padding:"8px 5px",textAlign:"center",fontWeight:800,fontSize:13,color:r.t>0?"#dc2626":"#2563eb"}}>{((r.t>0?"+":"")+r.t+"%"+(function(){var a=invAmt.useSame?invAmt.same:(invAmt[r.ccG]||0);if(!a)return"";var g=Math.round(a*r.t/100);return" ("+(g>=0?"+":"")+g.toLocaleString()+"Ã¬ÂÂ)";})())}</td><td style={{padding:"8px 5px",textAlign:"center"}}><span style={{padding:"1px 4px",borderRadius:4,fontSize:10,fontWeight:700,background:RC(r.r)+"12",color:RC(r.r)}}>{RL(r.r)}</span></td></tr>,isO&&(<tr key={"d"+i}><td colSpan={9} style={{padding:0}}><div style={{padding:"12px 16px",background:gi.bg,borderBottom:"2px solid "+gi.bd}}><div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(80px,1fr))",gap:5,marginBottom:8}}>{[{l:"Ã¬ÂÂÃ¬Â´Â",v:r.mc},{l:"Ã¬ÂÂÃªÂ¸Â",v:r.iv},{l:"Ã¬ÂµÂÃ«ÂÂÃ¢ÂÂ",v:"+"+r.pk+"%",c:"#dc2626"},{l:"Ã¬ÂµÂÃ«ÂÂÃ¢ÂÂ",v:r.dd+"%",c:"#dc2626"},{l:"TP1Ã«ÂÂÃ«ÂÂ¬Ã¬ÂÂ¼",v:r.tp1d?r.tp1d+(r.tp1dy?" ("+r.tp1dy+"Ã¬ÂÂ¼)":""):"-",c:r.tp1d?"#2563eb":"#94a3b8"},{l:"SLÃ¬ÂÂÃ¬Â ÂÃ¬ÂÂ¼",v:r.sld?r.sld+(r.sldy?" ("+r.sldy+"Ã¬ÂÂ¼)":""):"-",c:r.sld?"#dc2626":"#94a3b8"},{l:"TP2Ã«ÂÂÃ«ÂÂ¬Ã¬ÂÂ¼",v:r.tp2d||"-",c:r.tp2d?"#dc2626":"#94a3b8"},{l:"Ã¬Â²Â­Ã¬ÂÂ°Ã¬ÂÂ¼",v:r.exd?r.exd+(r.exdy?" ("+r.exdy+"Ã¬ÂÂ¼)":""):"-",c:"#64748b"}].map((x,j)=>(<div key={j} style={{background:"#fff",borderRadius:6,padding:"4px 6px"}}><div style={{fontSize:9,color:"#94a3b8"}}>{x.l}</div><div style={{fontSize:13,fontWeight:700,color:x.c||"#1e293b"}}>{x.v}</div></div>))}</div><div style={{background:"#fff",borderRadius:6,padding:"12px 14px"}}><div style={{display:"flex",alignItems:"baseline",gap:10,marginBottom:6,flexWrap:"wrap"}}><div style={{fontSize:22,fontWeight:900,color:r.t>=0?"#dc2626":"#2563eb"}}>Ã¬ÂÂ¤Ã­ÂÂ {r.t>0?"+":""}{r.t}%</div><div style={{fontSize:10,color:"#94a3b8",fontWeight:600}}>ÃªÂ±Â°Ã«ÂÂ Ã¬ÂÂÃ«ÂÂÃ«Â¦Â¬Ã¬ÂÂ¤</div></div><div style={{fontSize:11,color:"#475569",lineHeight:1.8}}>{SD(r,cTP)}</div></div></div></td></tr>)]})}</tbody></table></div></div><div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginTop:10}}><span style={{fontSize:12,color:"#94a3b8"}}>{fl.length}ÃªÂ±Â´ Ã¬Â¤Â {pg*PP+1}~{Math.min((pg+1)*PP,fl.length)}</span><div style={{display:"flex",gap:4}}><button onClick={()=>setPg(Math.max(0,pg-1))} disabled={pg===0} style={{padding:"5px 12px",borderRadius:8,border:"1px solid #e2e8f0",background:"#fff",fontSize:13,fontWeight:700,cursor:pg===0?"default":"pointer",color:pg===0?"#e2e8f0":"#1e293b"}}>Ã¢ÂÂ</button><input type="number" value={pg+1} min={1} max={mx+1} onChange={e=>{const v=parseInt(e.target.value)-1;if(!isNaN(v)&&v>=0&&v<=mx)setPg(v);}} style={{padding:"5px 4px",fontSize:13,color:"#64748b",width:50,textAlign:"center",border:"1px solid #e2e8f0",borderRadius:6}}/><span style={{padding:"5px 2px",fontSize:13,color:"#94a3b8"}}>/{mx+1}</span><button onClick={()=>setPg(Math.min(mx,pg+1))} disabled={pg>=mx} style={{padding:"5px 12px",borderRadius:8,border:"1px solid #e2e8f0",background:"#fff",fontSize:13,fontWeight:700,cursor:pg>=mx?"default":"pointer",color:pg>=mx?"#e2e8f0":"#1e293b"}}>Ã¢ÂÂ</button></div></div></div>);}

function JudojuDB({onRowClick}={}){const [tab,setTab]=useState("S+");const [cTP,setCTP]=useState(JDNS);const [srt,setSrt]=useState({c:"d",d:"desc"});const [open,setOpen]=useState(null);const [pg,setPg]=useState(0);const[invAmt,setInvAmt]=useState(()=>{try{return JSON.parse(localStorage.getItem("invAmt_jd_v1")||"")||{"S+":1000000,S:1000000,"A+":700000,A:500000,"B+":400000,B:300000,C:100000,same:500000,useSame:false}}catch(e){return{"S+":1000000,S:1000000,"A+":700000,A:500000,"B+":400000,B:300000,C:100000,same:500000,useSame:false}}});const[mode,setMode]=useState(()=>{try{const v=localStorage.getItem("mode_jd_v1");return v==="full"||v==="middle"||v==="tight"?v:"tight"}catch(e){return "tight"}});const[yearFilter,setYearFilter]=useState("all");const[fromD,setFromD]=useState("");const[toD,setToD]=useState("");const[supplyFilter,setSupplyFilter]=useState("all");const[highFilter,setHighFilter]=useState("all");const[holdFilter,setHoldFilter]=useState("all");
useEffect(()=>{const h=(e)=>{if((e.ctrlKey||e.metaKey)&&(e.key==="k"||e.key==="K")){e.preventDefault();setMode(v=>v==="tight"?"full":v==="full"?"middle":"tight");}};window.addEventListener("keydown",h);return()=>window.removeEventListener("keydown",h);},[]);
useEffect(()=>{const t=setTimeout(()=>{[...document.querySelectorAll("button")].filter(b=>b.textContent.trim()==="Ã¬ÂÂÃ¬ÂÂµMAX").forEach(b=>b.click());},400);return ()=>clearTimeout(t);},[]);useEffect(()=>{try{localStorage.setItem("mode_jd_v1",mode)}catch(e){}},[mode]);const PP=30;const D_live=useMemo(()=>{let _r=D.filter(r=>strictPassJD(r,mode)&&(yearFilter==="all"||(r.d&&r.d.slice(0,4)===yearFilter))&&(!fromD||(r.d&&r.d>=fromD))&&(!toD||(r.d&&r.d<=toD))&&(supplyFilter==="all"||(supplyFilter==="gi_oe"&&r.iv==="ÃªÂ¸Â°+Ã¬ÂÂ¸")||(supplyFilter==="oe"&&r.iv==="Ã¬ÂÂ¸Ã«Â§Â")||(supplyFilter==="gi"&&r.iv==="ÃªÂ¸Â°Ã«Â§Â")||(supplyFilter==="dual_minus"&&r.iv==="Ã«ÂÂÃ«ÂÂ¤-"))&&(highFilter==="all"||(highFilter==="h60"&&r.h60===1)||(highFilter==="h120"&&r.h120===1)||(highFilter==="both"&&r.h60===1&&r.h120===1)));_r=_r.map(rr=>{const cp=cTP[rr.jdG];if(!cp||!rr.ohlc||!rr.ohlc.length)return rr;const sim=simReal(rr.ohlc,cp.tp1,cp.tp2,cp.sl,cp.fsl||0);return{g:(rr.jdG||"B"),ta:rr.mc,...rr,t:sim.t,r:sim.r,tp1d:sim.tp1d||rr.tp1d,tp2d:sim.tp2d||rr.tp2d,sld:sim.sld||rr.sld,bed:sim.bed,exd:sim.exd||rr.exd,tp1dy:sim.tp1dy,tp2dy:sim.tp2dy,sldy:sim.sldy,bedy:sim.bedy,exdy:sim.exdy};});if(holdFilter!=="all"){const hd=+holdFilter;_r=_r.filter(x=>x.ohlc&&x.ohlc.length>=hd).map(x=>({...x,t:x.ohlc[hd-1].c,r:hd+"Ã¬ÂÂ¼Ã«Â³Â´Ã¬ÂÂ "}));}return _r;},[cTP,mode,yearFilter,fromD,toD,supplyFilter,highFilter,holdFilter]);const st=useMemo(()=>{const r={};["S+","S","A+","A","B+","B","C"].forEach(g=>{const d=D_live.filter(x=>x.jdG===g),w=d.filter(x=>x.t>0),sl=d.filter(x=>x.r==="SL"),bo=d.filter(x=>x.r==="BOTH"),tp1=d.filter(x=>{const rr=x.r;return rr==="TP1"||rr==="BOTH";}),to=d.filter(x=>x.r==="TO");const avg=d.length?(d.reduce((s,x)=>s+x.t,0)/d.length):0;const nw=d.map(x=>x);const nwCum=Math.round(nw.reduce((s,x)=>s+x.t,0));const nwWin=nw.filter(x=>x.t>0).length;r[g]={n:d.length,avg:avg.toFixed(2),wr:d.length?Math.round(w.length/d.length*100):0,cum:Math.round(d.reduce((s,x)=>s+x.t,0)),tp1c:tp1.length,tp1r:d.length?Math.round(tp1.length/d.length*100):0,boc:bo.length,bor:d.length?Math.round(bo.length/d.length*100):0,slc:sl.length,slr:d.length?Math.round(sl.length/d.length*100):0,toc:to.length,tor:d.length?Math.round(to.length/d.length*100):0,nwCum,nwWr:d.length?Math.round(nwWin/d.length*100):0}});return r},[cTP,D_live]);const fl=useMemo(()=>{let d=D_live.filter(r=>r.jdG===tab);return[...d].sort((a,b)=>{const av=a[srt.c],bv=b[srt.c];if(typeof av==="number")return (srt.d==="asc"?av-bv:bv-av);return srt.d==="asc"?String(av).localeCompare(String(bv)):String(bv).localeCompare(String(av))})},[tab,srt,invAmt,D_live]);const portfolio=useMemo(()=>{
const amt=invAmt.useSame?{"S+":invAmt.same,"S":invAmt.same,"A+":invAmt.same,"A":invAmt.same,"B+":invAmt.same,"B":invAmt.same,"C":invAmt.same}:{"S+":invAmt["S+"],"S":invAmt.S,"A+":invAmt["A+"],"A":invAmt.A,"B+":invAmt["B+"],"B":invAmt.B,"C":invAmt.C};
const parseTA=s=>{if(!s)return 0;const m=s.match(/(\d+)Ã¬ÂÂµ/);return m?+m[1]:0;};
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
},[D_live,invAmt]);const pd=fl.slice(pg*PP,(pg+1)*PP),mx=Math.ceil(fl.length/PP)-1;const ds=c=>setSrt(p=>p.c===c?{c,d:p.d==="asc"?"desc":"asc"}:{c,d:"desc"});return(<div><div style={{marginBottom:8,padding:10,background:"#0f1420",border:"1px solid #2a3040",borderRadius:8,display:"flex",alignItems:"center",gap:10,flexWrap:"wrap"}}><span style={{color:"#9ca3af",fontSize:12,fontWeight:700}}>ÃªÂ¸Â°ÃªÂ°Â</span>{[["all","Ã¬Â ÂÃ¬Â²Â´"],["2026","26Ã«ÂÂ"],["2025","25Ã«ÂÂ"],["2024","24Ã«ÂÂ"],["2023","23Ã«ÂÂ"],["2022","22Ã«ÂÂ"],["2021","21Ã«ÂÂ"]].map(([v,l])=>(<button key={v} onClick={()=>setYearFilter(v)} style={{background:yearFilter===v?"#60a5fa":"#1f2937",color:yearFilter===v?"#000":"#d1d5db",border:"1px solid #374151",borderRadius:6,padding:"4px 10px",fontSize:12,cursor:"pointer",fontWeight:yearFilter===v?700:400}}>{l}</button>))}<span style={{color:"#4b5563"}}>|</span><input type="date" value={fromD} onChange={e=>setFromD(e.target.value)} style={{background:"#1f2937",color:"#fff",border:"1px solid #374151",borderRadius:6,padding:"3px 6px",fontSize:11}}/><span style={{color:"#6b7280",fontSize:11}}>~</span><input type="date" value={toD} onChange={e=>setToD(e.target.value)} style={{background:"#1f2937",color:"#fff",border:"1px solid #374151",borderRadius:6,padding:"3px 6px",fontSize:11}}/><button onClick={()=>{setFromD("");setToD("");setYearFilter("all")}} style={{background:"#374151",color:"#fff",border:"none",borderRadius:6,padding:"3px 8px",fontSize:11,cursor:"pointer"}}>Ã¬Â´ÂÃªÂ¸Â°Ã­ÂÂ</button><span style={{color:"#4b5563"}}>|</span><span style={{color:"#9ca3af",fontSize:12}}>Ã¬Â´Â <b style={{color:"#fff"}}>{D_live.length}</b>ÃªÂ±Â´</span><span style={{color:"#9ca3af",fontSize:12}}>Ã«ÂÂÃ¬Â Â <b style={{color:D_live.reduce((a,b)=>a+(b.t||0),0)>=0?"#ef4444":"#3b82f6"}}>{D_live.reduce((a,b)=>a+(b.t||0),0).toFixed(1)}%</b></span><span style={{color:"#9ca3af",fontSize:12}}>Ã¬ÂÂ¹Ã«Â¥Â  <b style={{color:"#fff"}}>{D_live.length?(D_live.filter(x=>x.t>0).length/D_live.length*100).toFixed(1):0}%</b></span></div><div style={{marginBottom:8,padding:10,background:"#0f1420",border:"1px solid #2a3040",borderRadius:8,display:"flex",alignItems:"center",gap:10,flexWrap:"wrap"}}><span style={{color:"#9ca3af",fontSize:12,fontWeight:700}}>Ã¬ÂÂÃªÂ¸Â</span>{[["all","Ã¬Â ÂÃ¬Â²Â´"],["gi_oe","ÃªÂ¸Â°+Ã¬ÂÂ¸"],["oe","Ã¬ÂÂ¸Ã«Â§Â"],["gi","ÃªÂ¸Â°Ã«Â§Â"],["dual_minus","Ã«ÂÂÃ«ÂÂ¤-"]].map(([v,l])=>(<button key={v} onClick={()=>setSupplyFilter(v)} style={{background:supplyFilter===v?"#60a5fa":"#1f2937",color:supplyFilter===v?"#000":"#d1d5db",border:"1px solid #374151",borderRadius:6,padding:"4px 10px",fontSize:12,cursor:"pointer",fontWeight:supplyFilter===v?700:400}}>{l}</button>))}<span style={{color:"#9ca3af",fontSize:11,marginLeft:"auto"}}>Ã¢ÂÂ» Ã­ÂÂÃ¬ÂÂ¬ 26Ã«ÂÂ Ã«ÂÂ°Ã¬ÂÂ´Ã­ÂÂ°Ã«Â§Â Ã¬ÂÂÃªÂ¸Â Ã¬Â ÂÃ«Â³Â´ Ã¬ÂÂÃ¬ÂÂ (22~25Ã«ÂÂ Ã¬Â¶ÂÃ­ÂÂ Ã«Â³Â´ÃªÂ°Â Ã¬ÂÂÃ¬Â Â)</span></div><div style={{marginBottom:8,padding:10,background:"#0f1420",border:"1px solid #2a3040",borderRadius:8,display:"flex",alignItems:"center",gap:10,flexWrap:"wrap"}}><span style={{color:"#9ca3af",fontSize:12,fontWeight:700}}>Ã¬ÂÂ ÃªÂ³Â ÃªÂ°Â</span>{[["all","Ã¬Â ÂÃ¬Â²Â´"],["h60","60Ã¬ÂÂ¼Ã¢ÂÂ"],["h120","120Ã¬ÂÂ¼Ã¢ÂÂ"],["both","Ã«ÂÂÃ«ÂÂ¤Ã¢ÂÂ"]].map(([v,l])=>(<button key={v} onClick={()=>setHighFilter(v)} style={{background:highFilter===v?"#f59e0b":"#1f2937",color:highFilter===v?"#000":"#d1d5db",border:"1px solid #374151",borderRadius:6,padding:"4px 10px",fontSize:12,cursor:"pointer",fontWeight:highFilter===v?700:400}}>{l}</button>))}<span style={{color:"#9ca3af",fontSize:11,marginLeft:"auto"}}>Ã¢ÂÂ» 25/26Ã«ÂÂ Ã¬Â ÂÃ¬ÂÂ© (22~24Ã«ÂÂ Ã¬ÂÂ¬Ã¬ÂÂÃ¬Â§Â Ã¬ÂÂÃ¬Â Â)</span></div><div style={{marginBottom:8,padding:10,background:"#0f1420",border:"1px solid #2a3040",borderRadius:8,display:"flex",alignItems:"center",gap:10,flexWrap:"wrap"}}><span style={{color:"#9ca3af",fontSize:12,fontWeight:700}}>Ã«Â³Â´Ã¬ÂÂ </span>{[["all","Ã¬Â ÂÃ¬Â²Â´"],["5","Ã¢ÂÂ¤5Ã¬ÂÂ¼"],["10","Ã¢ÂÂ¤10Ã¬ÂÂ¼"],["15","Ã¢ÂÂ¤15Ã¬ÂÂ¼"],["20","Ã¢ÂÂ¤20Ã¬ÂÂ¼"],["25","Ã¢ÂÂ¤25Ã¬ÂÂ¼"],["30","Ã¢ÂÂ¤30Ã¬ÂÂ¼"],["35","Ã¢ÂÂ¤35Ã¬ÂÂ¼"],["40","Ã¢ÂÂ¤40Ã¬ÂÂ¼"],["45","Ã¢ÂÂ¤45Ã¬ÂÂ¼"],["50","Ã¢ÂÂ¤50Ã¬ÂÂ¼"],["55","Ã¢ÂÂ¤55Ã¬ÂÂ¼"],["60","Ã¢ÂÂ¤60Ã¬ÂÂ¼"]].map(([v,l])=>(<button key={v} onClick={()=>setHoldFilter(v)} style={{background:holdFilter===v?"#10b981":"#1f2937",color:holdFilter===v?"#000":"#d1d5db",border:"1px solid #374151",borderRadius:6,padding:"4px 10px",fontSize:12,cursor:"pointer",fontWeight:holdFilter===v?700:400}}>{l}</button>))}<span style={{color:"#9ca3af",fontSize:11,marginLeft:"auto"}}>Ã¢ÂÂ» 60Ã¬ÂÂ¼ÃªÂ¹ÂÃ¬Â§Â Ã¬Â ÂÃªÂµÂ¬ÃªÂ°Â Ã¬Â ÂÃ¬ÂÂ©</span></div><div style={{marginBottom:12,padding:12,background:"#0f1420",border:"1px solid #2a3040",borderRadius:8}}>
<div style={{display:"flex",alignItems:"center",gap:8,marginBottom:10,flexWrap:"wrap"}}>
<span style={{fontSize:12,fontWeight:700,color:"#26C6DA"}}>Ã°ÂÂÂ° Ã­ÂÂ¬Ã¬ÂÂÃªÂ¸Â ÃªÂ³ÂÃ¬ÂÂ°ÃªÂ¸Â°</span>
<label style={{display:"flex",alignItems:"center",gap:4,fontSize:11,color:"#aaa",cursor:"pointer"}}>
<input type="checkbox" checked={invAmt.useSame} onChange={e=>setInvAmt({...invAmt,useSame:e.target.checked})}/>
Ã«ÂªÂ¨Ã«ÂÂ  Ã¬Â¢ÂÃ«ÂªÂ© Ã«ÂÂÃ¬ÂÂ¼ ÃªÂ¸ÂÃ¬ÂÂ¡
</label>
<button onClick={()=>setMode(mode==="tight"?"full":mode==="full"?"middle":"tight")} style={{padding:"4px 10px",fontSize:10,fontWeight:700,border:"1px solid "+((mode==="tight"?"#dc2626":mode==="middle"?"#F5A623":"#444")),background:(mode==="tight"?"#dc2626":mode==="middle"?"#F5A623":"transparent"),color:(mode==="tight")?"#fff":"#888",borderRadius:4,cursor:"pointer",marginRight:8}}>{mode==="tight"?"Ã°ÂÂÂ¯ Ã­ÂÂÃ¬ÂÂ´Ã­ÂÂ¸ (Ctrl+K)":mode==="middle"?"Ã°ÂÂÂ¸ Ã«Â¯Â¸Ã«ÂÂ¤ (Ctrl+K)":"Ã¢ÂÂª Ã­ÂÂ (Ctrl+K)"}</button><div style={{display:"flex",gap:10,fontSize:10,marginLeft:"auto",flexWrap:"wrap"}}><span style={{color:"#dc2626",fontWeight:700}}>Ã°ÂÂÂ¯ Ã¬ÂÂµÃ¬Â Â {portfolio.resStats.tp}ÃªÂ±Â´</span><span style={{color:"#2563eb",fontWeight:700}}>Ã°ÂÂÂ Ã¬ÂÂÃ¬Â Â {portfolio.resStats.sl}ÃªÂ±Â´</span><span style={{color:"#888"}}>Ã¢ÂÂ± ÃªÂ¸Â°ÃªÂ°ÂÃ«Â§ÂÃ«Â£Â {portfolio.resStats.to}ÃªÂ±Â´</span><span style={{color:"#666"}}>Ã¬Â ÂÃ¬Â²Â´ {portfolio.total.n}ÃªÂ±Â´</span></div>


</div>
{invAmt.useSame?(
<div style={{display:"flex",alignItems:"center",gap:8,marginBottom:10}}>
<span style={{fontSize:11,color:"#ccc",width:60}}>Ã¬Â¢ÂÃ«ÂªÂ©Ã«ÂÂ¹</span>
<input type="number" value={invAmt.same} onChange={e=>setInvAmt({...invAmt,same:+e.target.value||0})} style={{flex:1,padding:"6px 8px",background:"#1a1a2e",border:"1px solid #333",borderRadius:4,color:"#fff",fontSize:12}} step="100000"/>
<span style={{fontSize:10,color:"#888"}}>Ã¬ÂÂ</span>
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
<div style={{fontSize:10,color:"#888",marginBottom:3}}>{gk}ÃªÂ¸Â ({d.n}ÃªÂ±Â´)</div>
<div style={{fontSize:14,fontWeight:700,color:c}}>{d.pnl>=0?"+":""}{d.pnl.toLocaleString()}Ã¬ÂÂ</div>
<div style={{fontSize:9,color:"#666"}}>Ã­ÂÂ¬Ã¬ÂÂ {d.amt.toLocaleString()} ÃÂ· {roi.toFixed(1)}% ÃÂ· Ã¬ÂÂ¹ {d.n>0?(d.win/d.n*100).toFixed(0):0}%</div>
</div>);
})}
<div style={{padding:"8px 10px",background:"#1a2e2a",borderRadius:6,borderLeft:"3px solid #26C6DA"}}>
<div style={{fontSize:10,color:"#26C6DA",marginBottom:3,fontWeight:700}}>Ã¬Â ÂÃ¬Â²Â´ ({portfolio.total.n}ÃªÂ±Â´)</div>
<div style={{fontSize:14,fontWeight:700,color:portfolio.total.pnl>0?"#dc2626":portfolio.total.pnl<0?"#2563eb":"#888"}}>{portfolio.total.pnl>=0?"+":""}{portfolio.total.pnl.toLocaleString()}Ã¬ÂÂ</div>
<div style={{fontSize:9,color:"#666"}}>Ã­ÂÂ¬Ã¬ÂÂ {portfolio.total.amt.toLocaleString()} ÃÂ· {portfolio.total.amt>0?(portfolio.total.pnl/portfolio.total.amt*100).toFixed(1):0}% ÃÂ· Ã¬ÂÂ¹ {portfolio.total.n>0?(portfolio.total.win/portfolio.total.n*100).toFixed(0):0}%</div>
</div>
</div>
</div><div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(148px,1fr))",gap:8,marginBottom:18}}>{["S+","S","A+","A","B+","B","C"].map(g=>{const i=GI[g],s=st[g];return(<div key={g} onClick={()=>{setTab(g);setPg(0);setOpen(null)}} style={{background:tab===g?i.c:i.bg,borderRadius:14,padding:"12px 14px",cursor:"pointer",border:tab===g?"none":"0.5px solid "+i.bd}}><div style={{display:"flex",gap:8,margin:"8px 0",padding:"8px 10px",background:"#f8fafc",borderRadius:8,border:"1px solid #e2e8f0",alignItems:"center",flexWrap:"wrap"}}><span style={{fontSize:11,fontWeight:700,color:"#475569"}}>Ã¬Â ÂÃ«ÂÂµÃ¬ÂÂ¤Ã¬Â Â</span><label style={{fontSize:10,color:"#64748b"}}>TP1<input type="number" value={cTP[g]?.tp1||""} onChange={(_g=>e=>setCTP(p=>({...p,[_g]:{...p[_g],tp1:+e.target.value}})))(g)} placeholder={NS[g]?.tp1} style={{width:40,margin:"0 4px",padding:"2px 4px",border:"1px solid #cbd5e1",borderRadius:4,fontSize:11}}/>%</label><label style={{fontSize:10,color:"#64748b"}}>TP2<input type="number" value={cTP[g]?.tp2||""} onChange={(_g=>e=>setCTP(p=>({...p,[_g]:{...p[_g],tp2:+e.target.value}})))(g)} placeholder={NS[g]?.tp2} style={{width:40,margin:"0 4px",padding:"2px 4px",border:"1px solid #cbd5e1",borderRadius:4,fontSize:11}}/>%</label><label style={{fontSize:10,color:"#64748b"}}>SL<input type="number" value={cTP[g]?.sl||""} onChange={(_g=>e=>setCTP(p=>({...p,[_g]:{...p[_g],sl:+e.target.value}})))(g)} placeholder={NS[g]?.sl} style={{width:40,margin:"0 4px",padding:"2px 4px",border:"1px solid #cbd5e1",borderRadius:4,fontSize:11}}/>%</label><label style={{fontSize:10,color:"#64748b"}}>ÃªÂ°ÂÃ¬Â ÂSL<input type="number" value={cTP[g]?.fsl||""} onChange={(_g=>e=>setCTP(p=>({...p,[_g]:{...p[_g],fsl:+e.target.value}})))(g)} placeholder={NS[g]?.fsl||"off"} style={{width:40,margin:"0 4px",padding:"2px 4px",border:"1px solid #cbd5e1",borderRadius:4,fontSize:11}}/>%</label><button onClick={()=>{setCTP({...cTP,[g]:{tp1:0,tp2:0,sl:0,fsl:0}})}} style={{fontSize:10,padding:"2px 8px",background:"#e2e8f0",border:"none",borderRadius:4,cursor:"pointer"}}>Ã¬Â´ÂÃªÂ¸Â°Ã­ÂÂ</button> <button onClick={()=>{const ds=D_live.filter(x=>x.jdG===g);let best=null;for(const t1 of [10,15,20,25,30])for(const t2 of [30,50,80,100])for(const sl of [3,5,7,10,15])for(const fsl of [0,7,10,15]){if(t2<=t1)continue;if(fsl>0&&fsl<sl)continue;const rs=ds.map(x=>simReal(x.ohlc,t1,t2,sl,fsl));const cum=rs.reduce((a,x)=>a+x.t,0);if(!best||cum>best.cum)best={t1,t2,sl,fsl,cum};}if(best)setCTP({...cTP,[g]:{tp1:best.t1,tp2:best.t2,sl:best.sl,fsl:best.fsl||0}});}} style={{fontSize:10,padding:"2px 8px",background:"#dbeafe",color:"#1e40af",border:"none",borderRadius:4,cursor:"pointer",marginLeft:4}}>Ã¬ÂÂÃ¬ÂÂµMAX</button><button onClick={()=>{const ds=D_live.filter(x=>x.jdG===g);let best=null;for(const tp of [10,15,20,25,30,40,50,60,80,100])for(const sl of [3,5,7,10,15,20]){const rs=ds.map(x=>simReal(x.ohlc,tp,tp*2,sl,0));const cum=rs.reduce((a,x)=>a+x.t,0);if(!best||cum>best.cum)best={tp,sl,cum};}if(best)setCTP({...cTP,[g]:{tp1:best.tp,tp2:best.tp,sl:best.sl}});}} style={{fontSize:10,padding:"2px 8px",background:"#ffedd5",color:"#ea580c",border:"none",borderRadius:4,cursor:"pointer",marginLeft:4}}>Ã«ÂÂ¨Ã¬ÂÂ¼TP</button>{(()=>{const ds=D_live.filter(x=>x.jdG===g);const rs=ds.map(x=>x);const cum=Math.round(rs.reduce((a,x)=>a+x.t,0));const wr=ds.length?Math.round(rs.filter(x=>x.t>0).length/ds.length*100):0;const ev=ds.length?(rs.reduce((a,x)=>a+x.t,0)/ds.length).toFixed(2):0;return(<span style={{fontSize:11,fontWeight:700,marginLeft:8}}><span style={{color:"#2563eb"}}>Ã«ÂÂÃ¬Â Â{cum>0?"+":""}{cum}%</span> <span style={{color:"#dc2626"}}>Ã¬ÂÂ¹Ã«Â¥Â {wr}%</span> <span style={{color:"#7c3aed"}}>EV={ev}</span></span>)})()}</div><div style={{display:"flex",justifyContent:"space-between"}}><span style={{fontSize:26,fontWeight:900,color:tab===g?"#fff":i.c}}>{g}</span></div><div style={{fontSize:22,fontWeight:900,color:tab===g?"#fff":i.c}}>{s.n}<span style={{fontSize:11,fontWeight:400}}>ÃªÂ±Â´</span></div><div style={{fontSize:11,color:tab===g?"rgba(255,255,255,0.8)":"#64748b",marginTop:2}}>+{s.avg}%/ÃªÂ±Â´ ÃÂ· Ã¬ÂÂ¹Ã«Â¥Â <strong>{s.wr}%</strong> ÃÂ· Ã­ÂÂÃ­ÂÂ+{s.cum}%</div><div style={{fontSize:10,color:tab===g?"rgba(255,255,255,0.65)":"#94a3b8",marginTop:1}}>TP1{s.tp1c}({s.tp1r}%) ÃÂ· TP2{s.boc}({s.bor}%) ÃÂ· SL{s.slc}({s.slr}%)</div></div>)})}</div>{st[tab]&&<div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:6,marginBottom:12}}><div style={{background:"#f0fdf4",borderRadius:10,padding:"8px 10px",textAlign:"center",border:"1px solid #fee2e2"}}><div style={{fontSize:10,color:"#dc2626"}}>Ã¬ÂÂµÃ¬Â Â (TP1+TP2)</div><div style={{fontSize:18,fontWeight:900,color:"#dc2626"}}>{st[tab].tp1c}ÃªÂ±Â´</div><div style={{fontSize:10,color:"#64748b"}}>{st[tab].tp1r}% ÃÂ· TP2{st[tab].boc}ÃªÂ±Â´({st[tab].bor}%)</div></div><div style={{background:"#fef2f2",borderRadius:10,padding:"8px 10px",textAlign:"center",border:"1px solid #fecaca"}}><div style={{fontSize:10,color:"#dc2626"}}>Ã¬ÂÂÃ¬Â Â (SL)</div><div style={{fontSize:18,fontWeight:900,color:"#dc2626"}}>{st[tab].slc}ÃªÂ±Â´</div><div style={{fontSize:10,color:"#64748b"}}>{Math.round((st[tab].slc)/st[tab].n*100)}%</div></div><div style={{background:"#f8fafc",borderRadius:10,padding:"8px 10px",textAlign:"center",border:"1px solid #e2e8f0"}}><div style={{fontSize:10,color:"#64748b"}}>ÃªÂ¸Â°ÃªÂ°ÂÃ«Â§ÂÃ«Â£Â (TO)</div><div style={{fontSize:18,fontWeight:900,color:"#64748b"}}>{st[tab].toc}ÃªÂ±Â´</div><div style={{fontSize:10,color:"#94a3b8"}}>{st[tab].tor}%</div></div></div>}<div style={{borderRadius:12,border:"1px solid #e2e8f0",overflow:"hidden"}}><div style={{overflowX:"auto"}}><table style={{width:"100%",minWidth:760,borderCollapse:"collapse",fontSize:13}}><thead><tr style={{background:"#f8fafc"}}>{[{k:"d",l:"Ã«ÂÂ Ã¬Â§Â"},{k:"n",l:"Ã¬Â¢ÂÃ«ÂªÂ©"},{k:"ch",l:"Ã«ÂÂ±Ã«ÂÂ½"},{k:"iv",l:"Ã¬ÂÂÃªÂ¸Â"},{k:"sc",l:"NEO"},{k:"r",l:""}].map(h=>(<th key={h.k} onClick={()=>ds(h.k)} style={{padding:"8px 5px",textAlign:h.k==="n"?"left":"center",fontWeight:600,fontSize:11,color:"#94a3b8",cursor:"pointer",borderBottom:"2px solid #e2e8f0",whiteSpace:"nowrap",userSelect:"none"}}>{h.l}{srt.c===h.k?(srt.d==="asc"?" Ã¢ÂÂ":" Ã¢ÂÂ"):""}</th>))}</tr></thead><tbody>{pd.map((r,i)=>{const isO=open===pg*PP+i,gi=GI[r.jdG];return[<tr key={"r"+i} onClick={()=>{setOpen(isO?null:pg*PP+i);onRowClick&&onRowClick(r);}} style={{cursor:"pointer",borderBottom:"1px solid #f1f5f9",background:isO?gi.bg:"#fff"}}><td style={{padding:"8px 5px",textAlign:"center",fontSize:11,color:"#94a3b8"}}>{r.d.slice(2)}</td><td style={{padding:"8px 5px",fontWeight:700,fontSize:13,maxWidth:120,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{r.n}</td><td style={{padding:"8px 5px",textAlign:"center",fontWeight:700,color:"#dc2626",fontSize:12}}>+{r.ch}%</td><td style={{padding:"8px 5px",textAlign:"center",fontSize:11,fontWeight:600,color:r.iv==="ÃªÂ¸Â°+Ã¬ÂÂ¸"?"#7c3aed":r.iv==="Ã¬ÂÂ¸Ã¬ÂÂ¸"?"#2563eb":"#94a3b8"}}>{r.iv}</td><td style={{padding:"8px 5px",textAlign:"center"}}><span style={{background:gi.c+"12",color:gi.c,padding:"1px 7px",borderRadius:20,fontWeight:800,fontSize:12}}>{r.sc}</span></td><td style={{padding:"8px 5px",textAlign:"center",fontWeight:800,fontSize:13,color:r.t>0?"#dc2626":"#2563eb"}}>{((r.t>0?"+":"")+r.t+"%"+(function(){var a=invAmt.useSame?invAmt.same:(invAmt[r.jdG]||0);if(!a)return"";var g=Math.round(a*r.t/100);return" ("+(g>=0?"+":"")+g.toLocaleString()+"Ã¬ÂÂ)";})())}</td><td style={{padding:"8px 5px",textAlign:"center"}}><span style={{padding:"1px 4px",borderRadius:4,fontSize:10,fontWeight:700,background:RC(r.r)+"12",color:RC(r.r)}}>{RL(r.r)}</span></td></tr>,isO&&(<tr key={"d"+i}><td colSpan={9} style={{padding:0}}><div style={{padding:"12px 16px",background:gi.bg,borderBottom:"2px solid "+gi.bd}}><div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(80px,1fr))",gap:5,marginBottom:8}}>{[{l:"Ã¬ÂÂÃ¬Â´Â",v:r.mc},{l:"Ã¬ÂÂÃªÂ¸Â",v:r.iv},{l:"Ã¬ÂµÂÃ«ÂÂÃ¢ÂÂ",v:"+"+r.pk+"%",c:"#dc2626"},{l:"Ã¬ÂµÂÃ«ÂÂÃ¢ÂÂ",v:r.dd+"%",c:"#dc2626"},{l:"TP1Ã«ÂÂÃ«ÂÂ¬Ã¬ÂÂ¼",v:r.tp1d?r.tp1d+(r.tp1dy?" ("+r.tp1dy+"Ã¬ÂÂ¼)":""):"-",c:r.tp1d?"#2563eb":"#94a3b8"},{l:"SLÃ¬ÂÂÃ¬Â ÂÃ¬ÂÂ¼",v:r.sld?r.sld+(r.sldy?" ("+r.sldy+"Ã¬ÂÂ¼)":""):"-",c:r.sld?"#dc2626":"#94a3b8"},{l:"TP2Ã«ÂÂÃ«ÂÂ¬Ã¬ÂÂ¼",v:r.tp2d||"-",c:r.tp2d?"#dc2626":"#94a3b8"},{l:"Ã¬Â²Â­Ã¬ÂÂ°Ã¬ÂÂ¼",v:r.exd?r.exd+(r.exdy?" ("+r.exdy+"Ã¬ÂÂ¼)":""):"-",c:"#64748b"}].map((x,j)=>(<div key={j} style={{background:"#fff",borderRadius:6,padding:"4px 6px"}}><div style={{fontSize:9,color:"#94a3b8"}}>{x.l}</div><div style={{fontSize:13,fontWeight:700,color:x.c||"#1e293b"}}>{x.v}</div></div>))}</div><div style={{background:"#fff",borderRadius:6,padding:"12px 14px"}}><div style={{display:"flex",alignItems:"baseline",gap:10,marginBottom:6,flexWrap:"wrap"}}><div style={{fontSize:22,fontWeight:900,color:r.t>=0?"#dc2626":"#2563eb"}}>Ã¬ÂÂ¤Ã­ÂÂ {r.t>0?"+":""}{r.t}%</div><div style={{fontSize:10,color:"#94a3b8",fontWeight:600}}>ÃªÂ±Â°Ã«ÂÂ Ã¬ÂÂÃ«ÂÂÃ«Â¦Â¬Ã¬ÂÂ¤</div></div><div style={{fontSize:11,color:"#475569",lineHeight:1.8}}>{SD(r,cTP)}</div></div></div></td></tr>)]})}</tbody></table></div></div><div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginTop:10}}><span style={{fontSize:12,color:"#94a3b8"}}>{fl.length}ÃªÂ±Â´ Ã¬Â¤Â {pg*PP+1}~{Math.min((pg+1)*PP,fl.length)}</span><div style={{display:"flex",gap:4}}><button onClick={()=>setPg(Math.max(0,pg-1))} disabled={pg===0} style={{padding:"5px 12px",borderRadius:8,border:"1px solid #e2e8f0",background:"#fff",fontSize:13,fontWeight:700,cursor:pg===0?"default":"pointer",color:pg===0?"#e2e8f0":"#1e293b"}}>Ã¢ÂÂ</button><input type="number" value={pg+1} min={1} max={mx+1} onChange={e=>{const v=parseInt(e.target.value)-1;if(!isNaN(v)&&v>=0&&v<=mx)setPg(v);}} style={{padding:"5px 4px",fontSize:13,color:"#64748b",width:50,textAlign:"center",border:"1px solid #e2e8f0",borderRadius:6}}/><span style={{padding:"5px 2px",fontSize:13,color:"#94a3b8"}}>/{mx+1}</span><button onClick={()=>setPg(Math.min(mx,pg+1))} disabled={pg>=mx} style={{padding:"5px 12px",borderRadius:8,border:"1px solid #e2e8f0",background:"#fff",fontSize:13,fontWeight:700,cursor:pg>=mx?"default":"pointer",color:pg>=mx?"#e2e8f0":"#1e293b"}}>Ã¢ÂÂ</button></div></div></div>);}



function HaseunghoonDB({onRowClick}={}){const [tab,setTab]=useState("S+");const [cTP,setCTP]=useState(HSNS);const [srt,setSrt]=useState({c:"d",d:"desc"});const [open,setOpen]=useState(null);const [pg,setPg]=useState(0);const[invAmt,setInvAmt]=useState(()=>{try{return JSON.parse(localStorage.getItem("invAmt_hs_v1")||"")||{"S+":1000000,S:1000000,"A+":700000,A:500000,"B+":400000,B:300000,C:100000,same:500000,useSame:false}}catch(e){return{"S+":1000000,S:1000000,"A+":700000,A:500000,"B+":400000,B:300000,C:100000,same:500000,useSame:false}}});const[mode,setMode]=useState(()=>{try{const v=localStorage.getItem("mode_hs_v1");return v==="full"||v==="middle"||v==="tight"?v:"tight"}catch(e){return "tight"}});const[yearFilter,setYearFilter]=useState("all");const[fromD,setFromD]=useState("");const[toD,setToD]=useState("");const[supplyFilter,setSupplyFilter]=useState("all");const[highFilter,setHighFilter]=useState("all");const[holdFilter,setHoldFilter]=useState("all");
useEffect(()=>{const h=(e)=>{if((e.ctrlKey||e.metaKey)&&(e.key==="k"||e.key==="K")){e.preventDefault();setMode(v=>v==="tight"?"full":v==="full"?"middle":"tight");}};window.addEventListener("keydown",h);return()=>window.removeEventListener("keydown",h);},[]);
useEffect(()=>{const t=setTimeout(()=>{[...document.querySelectorAll("button")].filter(b=>b.textContent.trim()==="Ã¬ÂÂÃ¬ÂÂµMAX").forEach(b=>b.click());},400);return ()=>clearTimeout(t);},[]);useEffect(()=>{try{localStorage.setItem("mode_hs_v1",mode)}catch(e){}},[mode]);const PP=30;const D_live=useMemo(()=>{let _r=D.filter(r=>strictPassHS(r,mode)&&(yearFilter==="all"||(r.d&&r.d.slice(0,4)===yearFilter))&&(!fromD||(r.d&&r.d>=fromD))&&(!toD||(r.d&&r.d<=toD))&&(supplyFilter==="all"||(supplyFilter==="gi_oe"&&r.iv==="ÃªÂ¸Â°+Ã¬ÂÂ¸")||(supplyFilter==="oe"&&r.iv==="Ã¬ÂÂ¸Ã«Â§Â")||(supplyFilter==="gi"&&r.iv==="ÃªÂ¸Â°Ã«Â§Â")||(supplyFilter==="dual_minus"&&r.iv==="Ã«ÂÂÃ«ÂÂ¤-"))&&(highFilter==="all"||(highFilter==="h60"&&r.h60===1)||(highFilter==="h120"&&r.h120===1)||(highFilter==="both"&&r.h60===1&&r.h120===1)));_r=_r.map(rr=>{const cp=cTP[rr.hsG];if(!cp||!rr.ohlc||!rr.ohlc.length)return rr;const sim=simReal(rr.ohlc,cp.tp1,cp.tp2,cp.sl,cp.fsl||0);return{g:(rr.hsG||"B"),ta:rr.mc,...rr,t:sim.t,r:sim.r,tp1d:sim.tp1d||rr.tp1d,tp2d:sim.tp2d||rr.tp2d,sld:sim.sld||rr.sld,bed:sim.bed,exd:sim.exd||rr.exd,tp1dy:sim.tp1dy,tp2dy:sim.tp2dy,sldy:sim.sldy,bedy:sim.bedy,exdy:sim.exdy};});if(holdFilter!=="all"){const hd=+holdFilter;_r=_r.filter(x=>x.ohlc&&x.ohlc.length>=hd).map(x=>({...x,t:x.ohlc[hd-1].c,r:hd+"Ã¬ÂÂ¼Ã«Â³Â´Ã¬ÂÂ "}));}return _r;},[cTP,mode,yearFilter,fromD,toD,supplyFilter,highFilter,holdFilter]);const st=useMemo(()=>{const r={};["S+","S","A+","A","B+","B","C"].forEach(g=>{const d=D_live.filter(x=>x.hsG===g),w=d.filter(x=>x.t>0),sl=d.filter(x=>x.r==="SL"),bo=d.filter(x=>x.r==="BOTH"),tp1=d.filter(x=>{const rr=x.r;return rr==="TP1"||rr==="BOTH";}),to=d.filter(x=>x.r==="TO");const avg=d.length?(d.reduce((s,x)=>s+x.t,0)/d.length):0;const nw=d.map(x=>x);const nwCum=Math.round(nw.reduce((s,x)=>s+x.t,0));const nwWin=nw.filter(x=>x.t>0).length;r[g]={n:d.length,avg:avg.toFixed(2),wr:d.length?Math.round(w.length/d.length*100):0,cum:Math.round(d.reduce((s,x)=>s+x.t,0)),tp1c:tp1.length,tp1r:d.length?Math.round(tp1.length/d.length*100):0,boc:bo.length,bor:d.length?Math.round(bo.length/d.length*100):0,slc:sl.length,slr:d.length?Math.round(sl.length/d.length*100):0,toc:to.length,tor:d.length?Math.round(to.length/d.length*100):0,nwCum,nwWr:d.length?Math.round(nwWin/d.length*100):0}});return r},[cTP,D_live]);const fl=useMemo(()=>{let d=D_live.filter(r=>r.hsG===tab);return[...d].sort((a,b)=>{const av=a[srt.c],bv=b[srt.c];if(typeof av==="number")return (srt.d==="asc"?av-bv:bv-av);return srt.d==="asc"?String(av).localeCompare(String(bv)):String(bv).localeCompare(String(av))})},[tab,srt,invAmt,D_live]);const portfolio=useMemo(()=>{
const amt=invAmt.useSame?{"S+":invAmt.same,"S":invAmt.same,"A+":invAmt.same,"A":invAmt.same,"B+":invAmt.same,"B":invAmt.same,"C":invAmt.same}:{"S+":invAmt["S+"],"S":invAmt.S,"A+":invAmt["A+"],"A":invAmt.A,"B+":invAmt["B+"],"B":invAmt.B,"C":invAmt.C};
const parseTA=s=>{if(!s)return 0;const m=s.match(/(\d+)Ã¬ÂÂµ/);return m?+m[1]:0;};
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
},[D_live,invAmt]);const pd=fl.slice(pg*PP,(pg+1)*PP),mx=Math.ceil(fl.length/PP)-1;const ds=c=>setSrt(p=>p.c===c?{c,d:p.d==="asc"?"desc":"asc"}:{c,d:"desc"});return(<div><div style={{marginBottom:8,padding:10,background:"#0f1420",border:"1px solid #2a3040",borderRadius:8,display:"flex",alignItems:"center",gap:10,flexWrap:"wrap"}}><span style={{color:"#9ca3af",fontSize:12,fontWeight:700}}>ÃªÂ¸Â°ÃªÂ°Â</span>{[["all","Ã¬Â ÂÃ¬Â²Â´"],["2026","26Ã«ÂÂ"],["2025","25Ã«ÂÂ"],["2024","24Ã«ÂÂ"],["2023","23Ã«ÂÂ"],["2022","22Ã«ÂÂ"],["2021","21Ã«ÂÂ"]].map(([v,l])=>(<button key={v} onClick={()=>setYearFilter(v)} style={{background:yearFilter===v?"#60a5fa":"#1f2937",color:yearFilter===v?"#000":"#d1d5db",border:"1px solid #374151",borderRadius:6,padding:"4px 10px",fontSize:12,cursor:"pointer",fontWeight:yearFilter===v?700:400}}>{l}</button>))}<span style={{color:"#4b5563"}}>|</span><input type="date" value={fromD} onChange={e=>setFromD(e.target.value)} style={{background:"#1f2937",color:"#fff",border:"1px solid #374151",borderRadius:6,padding:"3px 6px",fontSize:11}}/><span style={{color:"#6b7280",fontSize:11}}>~</span><input type="date" value={toD} onChange={e=>setToD(e.target.value)} style={{background:"#1f2937",color:"#fff",border:"1px solid #374151",borderRadius:6,padding:"3px 6px",fontSize:11}}/><button onClick={()=>{setFromD("");setToD("");setYearFilter("all")}} style={{background:"#374151",color:"#fff",border:"none",borderRadius:6,padding:"3px 8px",fontSize:11,cursor:"pointer"}}>Ã¬Â´ÂÃªÂ¸Â°Ã­ÂÂ</button><span style={{color:"#4b5563"}}>|</span><span style={{color:"#9ca3af",fontSize:12}}>Ã¬Â´Â <b style={{color:"#fff"}}>{D_live.length}</b>ÃªÂ±Â´</span><span style={{color:"#9ca3af",fontSize:12}}>Ã«ÂÂÃ¬Â Â <b style={{color:D_live.reduce((a,b)=>a+(b.t||0),0)>=0?"#ef4444":"#3b82f6"}}>{D_live.reduce((a,b)=>a+(b.t||0),0).toFixed(1)}%</b></span><span style={{color:"#9ca3af",fontSize:12}}>Ã¬ÂÂ¹Ã«Â¥Â  <b style={{color:"#fff"}}>{D_live.length?(D_live.filter(x=>x.t>0).length/D_live.length*100).toFixed(1):0}%</b></span></div><div style={{marginBottom:8,padding:10,background:"#0f1420",border:"1px solid #2a3040",borderRadius:8,display:"flex",alignItems:"center",gap:10,flexWrap:"wrap"}}><span style={{color:"#9ca3af",fontSize:12,fontWeight:700}}>Ã¬ÂÂÃªÂ¸Â</span>{[["all","Ã¬Â ÂÃ¬Â²Â´"],["gi_oe","ÃªÂ¸Â°+Ã¬ÂÂ¸"],["oe","Ã¬ÂÂ¸Ã«Â§Â"],["gi","ÃªÂ¸Â°Ã«Â§Â"],["dual_minus","Ã«ÂÂÃ«ÂÂ¤-"]].map(([v,l])=>(<button key={v} onClick={()=>setSupplyFilter(v)} style={{background:supplyFilter===v?"#60a5fa":"#1f2937",color:supplyFilter===v?"#000":"#d1d5db",border:"1px solid #374151",borderRadius:6,padding:"4px 10px",fontSize:12,cursor:"pointer",fontWeight:supplyFilter===v?700:400}}>{l}</button>))}<span style={{color:"#9ca3af",fontSize:11,marginLeft:"auto"}}>Ã¢ÂÂ» Ã­ÂÂÃ¬ÂÂ¬ 26Ã«ÂÂ Ã«ÂÂ°Ã¬ÂÂ´Ã­ÂÂ°Ã«Â§Â Ã¬ÂÂÃªÂ¸Â Ã¬Â ÂÃ«Â³Â´ Ã¬ÂÂÃ¬ÂÂ (22~25Ã«ÂÂ Ã¬Â¶ÂÃ­ÂÂ Ã«Â³Â´ÃªÂ°Â Ã¬ÂÂÃ¬Â Â)</span></div><div style={{marginBottom:8,padding:10,background:"#0f1420",border:"1px solid #2a3040",borderRadius:8,display:"flex",alignItems:"center",gap:10,flexWrap:"wrap"}}><span style={{color:"#9ca3af",fontSize:12,fontWeight:700}}>Ã¬ÂÂ ÃªÂ³Â ÃªÂ°Â</span>{[["all","Ã¬Â ÂÃ¬Â²Â´"],["h60","60Ã¬ÂÂ¼Ã¢ÂÂ"],["h120","120Ã¬ÂÂ¼Ã¢ÂÂ"],["both","Ã«ÂÂÃ«ÂÂ¤Ã¢ÂÂ"]].map(([v,l])=>(<button key={v} onClick={()=>setHighFilter(v)} style={{background:highFilter===v?"#f59e0b":"#1f2937",color:highFilter===v?"#000":"#d1d5db",border:"1px solid #374151",borderRadius:6,padding:"4px 10px",fontSize:12,cursor:"pointer",fontWeight:highFilter===v?700:400}}>{l}</button>))}<span style={{color:"#9ca3af",fontSize:11,marginLeft:"auto"}}>Ã¢ÂÂ» 25/26Ã«ÂÂ Ã¬Â ÂÃ¬ÂÂ© (22~24Ã«ÂÂ Ã¬ÂÂ¬Ã¬ÂÂÃ¬Â§Â Ã¬ÂÂÃ¬Â Â)</span></div><div style={{marginBottom:8,padding:10,background:"#0f1420",border:"1px solid #2a3040",borderRadius:8,display:"flex",alignItems:"center",gap:10,flexWrap:"wrap"}}><span style={{color:"#9ca3af",fontSize:12,fontWeight:700}}>Ã«Â³Â´Ã¬ÂÂ </span>{[["all","Ã¬Â ÂÃ¬Â²Â´"],["5","Ã¢ÂÂ¤5Ã¬ÂÂ¼"],["10","Ã¢ÂÂ¤10Ã¬ÂÂ¼"],["15","Ã¢ÂÂ¤15Ã¬ÂÂ¼"],["20","Ã¢ÂÂ¤20Ã¬ÂÂ¼"],["25","Ã¢ÂÂ¤25Ã¬ÂÂ¼"],["30","Ã¢ÂÂ¤30Ã¬ÂÂ¼"],["35","Ã¢ÂÂ¤35Ã¬ÂÂ¼"],["40","Ã¢ÂÂ¤40Ã¬ÂÂ¼"],["45","Ã¢ÂÂ¤45Ã¬ÂÂ¼"],["50","Ã¢ÂÂ¤50Ã¬ÂÂ¼"],["55","Ã¢ÂÂ¤55Ã¬ÂÂ¼"],["60","Ã¢ÂÂ¤60Ã¬ÂÂ¼"]].map(([v,l])=>(<button key={v} onClick={()=>setHoldFilter(v)} style={{background:holdFilter===v?"#10b981":"#1f2937",color:holdFilter===v?"#000":"#d1d5db",border:"1px solid #374151",borderRadius:6,padding:"4px 10px",fontSize:12,cursor:"pointer",fontWeight:holdFilter===v?700:400}}>{l}</button>))}<span style={{color:"#9ca3af",fontSize:11,marginLeft:"auto"}}>Ã¢ÂÂ» 60Ã¬ÂÂ¼ÃªÂ¹ÂÃ¬Â§Â Ã¬Â ÂÃªÂµÂ¬ÃªÂ°Â Ã¬Â ÂÃ¬ÂÂ©</span></div><div style={{marginBottom:12,padding:12,background:"#0f1420",border:"1px solid #2a3040",borderRadius:8}}>
<div style={{display:"flex",alignItems:"center",gap:8,marginBottom:10,flexWrap:"wrap"}}>
<span style={{fontSize:12,fontWeight:700,color:"#26C6DA"}}>Ã°ÂÂÂ° Ã­ÂÂ¬Ã¬ÂÂÃªÂ¸Â ÃªÂ³ÂÃ¬ÂÂ°ÃªÂ¸Â°</span>
<label style={{display:"flex",alignItems:"center",gap:4,fontSize:11,color:"#aaa",cursor:"pointer"}}>
<input type="checkbox" checked={invAmt.useSame} onChange={e=>setInvAmt({...invAmt,useSame:e.target.checked})}/>
Ã«ÂªÂ¨Ã«ÂÂ  Ã¬Â¢ÂÃ«ÂªÂ© Ã«ÂÂÃ¬ÂÂ¼ ÃªÂ¸ÂÃ¬ÂÂ¡
</label>
<button onClick={()=>setMode(mode==="tight"?"full":mode==="full"?"middle":"tight")} style={{padding:"4px 10px",fontSize:10,fontWeight:700,border:"1px solid "+((mode==="tight"?"#dc2626":mode==="middle"?"#F5A623":"#444")),background:(mode==="tight"?"#dc2626":mode==="middle"?"#F5A623":"transparent"),color:(mode==="tight")?"#fff":"#888",borderRadius:4,cursor:"pointer",marginRight:8}}>{mode==="tight"?"Ã°ÂÂÂ¯ Ã­ÂÂÃ¬ÂÂ´Ã­ÂÂ¸ (Ctrl+K)":mode==="middle"?"Ã°ÂÂÂ¸ Ã«Â¯Â¸Ã«ÂÂ¤ (Ctrl+K)":"Ã¢ÂÂª Ã­ÂÂ (Ctrl+K)"}</button><div style={{display:"flex",gap:10,fontSize:10,marginLeft:"auto",flexWrap:"wrap"}}><span style={{color:"#dc2626",fontWeight:700}}>Ã°ÂÂÂ¯ Ã¬ÂÂµÃ¬Â Â {portfolio.resStats.tp}ÃªÂ±Â´</span><span style={{color:"#2563eb",fontWeight:700}}>Ã°ÂÂÂ Ã¬ÂÂÃ¬Â Â {portfolio.resStats.sl}ÃªÂ±Â´</span><span style={{color:"#888"}}>Ã¢ÂÂ± ÃªÂ¸Â°ÃªÂ°ÂÃ«Â§ÂÃ«Â£Â {portfolio.resStats.to}ÃªÂ±Â´</span><span style={{color:"#666"}}>Ã¬Â ÂÃ¬Â²Â´ {portfolio.total.n}ÃªÂ±Â´</span></div>


</div>
{invAmt.useSame?(
<div style={{display:"flex",alignItems:"center",gap:8,marginBottom:10}}>
<span style={{fontSize:11,color:"#ccc",width:60}}>Ã¬Â¢ÂÃ«ÂªÂ©Ã«ÂÂ¹</span>
<input type="number" value={invAmt.same} onChange={e=>setInvAmt({...invAmt,same:+e.target.value||0})} style={{flex:1,padding:"6px 8px",background:"#1a1a2e",border:"1px solid #333",borderRadius:4,color:"#fff",fontSize:12}} step="100000"/>
<span style={{fontSize:10,color:"#888"}}>Ã¬ÂÂ</span>
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
<div style={{fontSize:10,color:"#888",marginBottom:3}}>{gk}ÃªÂ¸Â ({d.n}ÃªÂ±Â´)</div>
<div style={{fontSize:14,fontWeight:700,color:c}}>{d.pnl>=0?"+":""}{d.pnl.toLocaleString()}Ã¬ÂÂ</div>
<div style={{fontSize:9,color:"#666"}}>Ã­ÂÂ¬Ã¬ÂÂ {d.amt.toLocaleString()} ÃÂ· {roi.toFixed(1)}% ÃÂ· Ã¬ÂÂ¹ {d.n>0?(d.win/d.n*100).toFixed(0):0}%</div>
</div>);
})}
<div style={{padding:"8px 10px",background:"#1a2e2a",borderRadius:6,borderLeft:"3px solid #26C6DA"}}>
<div style={{fontSize:10,color:"#26C6DA",marginBottom:3,fontWeight:700}}>Ã¬Â ÂÃ¬Â²Â´ ({portfolio.total.n}ÃªÂ±Â´)</div>
<div style={{fontSize:14,fontWeight:700,color:portfolio.total.pnl>0?"#dc2626":portfolio.total.pnl<0?"#2563eb":"#888"}}>{portfolio.total.pnl>=0?"+":""}{portfolio.total.pnl.toLocaleString()}Ã¬ÂÂ</div>
<div style={{fontSize:9,color:"#666"}}>Ã­ÂÂ¬Ã¬ÂÂ {portfolio.total.amt.toLocaleString()} ÃÂ· {portfolio.total.amt>0?(portfolio.total.pnl/portfolio.total.amt*100).toFixed(1):0}% ÃÂ· Ã¬ÂÂ¹ {portfolio.total.n>0?(portfolio.total.win/portfolio.total.n*100).toFixed(0):0}%</div>
</div>
</div>
</div><div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(148px,1fr))",gap:8,marginBottom:18}}>{["S+","S","A+","A","B+","B","C"].map(g=>{const i=GI[g],s=st[g];return(<div key={g} onClick={()=>{setTab(g);setPg(0);setOpen(null)}} style={{background:tab===g?i.c:i.bg,borderRadius:14,padding:"12px 14px",cursor:"pointer",border:tab===g?"none":"0.5px solid "+i.bd}}><div style={{display:"flex",gap:8,margin:"8px 0",padding:"8px 10px",background:"#f8fafc",borderRadius:8,border:"1px solid #e2e8f0",alignItems:"center",flexWrap:"wrap"}}><span style={{fontSize:11,fontWeight:700,color:"#475569"}}>Ã¬Â ÂÃ«ÂÂµÃ¬ÂÂ¤Ã¬Â Â</span><label style={{fontSize:10,color:"#64748b"}}>TP1<input type="number" value={cTP[g]?.tp1||""} onChange={(_g=>e=>setCTP(p=>({...p,[_g]:{...p[_g],tp1:+e.target.value}})))(g)} placeholder={NS[g]?.tp1} style={{width:40,margin:"0 4px",padding:"2px 4px",border:"1px solid #cbd5e1",borderRadius:4,fontSize:11}}/>%</label><label style={{fontSize:10,color:"#64748b"}}>TP2<input type="number" value={cTP[g]?.tp2||""} onChange={(_g=>e=>setCTP(p=>({...p,[_g]:{...p[_g],tp2:+e.target.value}})))(g)} placeholder={NS[g]?.tp2} style={{width:40,margin:"0 4px",padding:"2px 4px",border:"1px solid #cbd5e1",borderRadius:4,fontSize:11}}/>%</label><label style={{fontSize:10,color:"#64748b"}}>SL<input type="number" value={cTP[g]?.sl||""} onChange={(_g=>e=>setCTP(p=>({...p,[_g]:{...p[_g],sl:+e.target.value}})))(g)} placeholder={NS[g]?.sl} style={{width:40,margin:"0 4px",padding:"2px 4px",border:"1px solid #cbd5e1",borderRadius:4,fontSize:11}}/>%</label><label style={{fontSize:10,color:"#64748b"}}>ÃªÂ°ÂÃ¬Â ÂSL<input type="number" value={cTP[g]?.fsl||""} onChange={(_g=>e=>setCTP(p=>({...p,[_g]:{...p[_g],fsl:+e.target.value}})))(g)} placeholder={NS[g]?.fsl||"off"} style={{width:40,margin:"0 4px",padding:"2px 4px",border:"1px solid #cbd5e1",borderRadius:4,fontSize:11}}/>%</label><button onClick={()=>{setCTP({...cTP,[g]:{tp1:0,tp2:0,sl:0,fsl:0}})}} style={{fontSize:10,padding:"2px 8px",background:"#e2e8f0",border:"none",borderRadius:4,cursor:"pointer"}}>Ã¬Â´ÂÃªÂ¸Â°Ã­ÂÂ</button> <button onClick={()=>{const ds=D_live.filter(x=>x.hsG===g);let best=null;for(const t1 of [10,15,20,25,30])for(const t2 of [30,50,80,100])for(const sl of [3,5,7,10,15])for(const fsl of [0,7,10,15]){if(t2<=t1)continue;if(fsl>0&&fsl<sl)continue;const rs=ds.map(x=>simReal(x.ohlc,t1,t2,sl,fsl));const cum=rs.reduce((a,x)=>a+x.t,0);if(!best||cum>best.cum)best={t1,t2,sl,fsl,cum};}if(best)setCTP({...cTP,[g]:{tp1:best.t1,tp2:best.t2,sl:best.sl,fsl:best.fsl||0}});}} style={{fontSize:10,padding:"2px 8px",background:"#dbeafe",color:"#1e40af",border:"none",borderRadius:4,cursor:"pointer",marginLeft:4}}>Ã¬ÂÂÃ¬ÂÂµMAX</button><button onClick={()=>{const ds=D_live.filter(x=>x.hsG===g);let best=null;for(const tp of [10,15,20,25,30,40,50,60,80,100])for(const sl of [3,5,7,10,15,20]){const rs=ds.map(x=>simReal(x.ohlc,tp,tp*2,sl,0));const cum=rs.reduce((a,x)=>a+x.t,0);if(!best||cum>best.cum)best={tp,sl,cum};}if(best)setCTP({...cTP,[g]:{tp1:best.tp,tp2:best.tp,sl:best.sl}});}} style={{fontSize:10,padding:"2px 8px",background:"#ffedd5",color:"#ea580c",border:"none",borderRadius:4,cursor:"pointer",marginLeft:4}}>Ã«ÂÂ¨Ã¬ÂÂ¼TP</button>{(()=>{const ds=D_live.filter(x=>x.hsG===g);const rs=ds.map(x=>x);const cum=Math.round(rs.reduce((a,x)=>a+x.t,0));const wr=ds.length?Math.round(rs.filter(x=>x.t>0).length/ds.length*100):0;const ev=ds.length?(rs.reduce((a,x)=>a+x.t,0)/ds.length).toFixed(2):0;return(<span style={{fontSize:11,fontWeight:700,marginLeft:8}}><span style={{color:"#2563eb"}}>Ã«ÂÂÃ¬Â Â{cum>0?"+":""}{cum}%</span> <span style={{color:"#dc2626"}}>Ã¬ÂÂ¹Ã«Â¥Â {wr}%</span> <span style={{color:"#7c3aed"}}>EV={ev}</span></span>)})()}</div><div style={{display:"flex",justifyContent:"space-between"}}><span style={{fontSize:26,fontWeight:900,color:tab===g?"#fff":i.c}}>{g}</span></div><div style={{fontSize:22,fontWeight:900,color:tab===g?"#fff":i.c}}>{s.n}<span style={{fontSize:11,fontWeight:400}}>ÃªÂ±Â´</span></div><div style={{fontSize:11,color:tab===g?"rgba(255,255,255,0.8)":"#64748b",marginTop:2}}>+{s.avg}%/ÃªÂ±Â´ ÃÂ· Ã¬ÂÂ¹Ã«Â¥Â <strong>{s.wr}%</strong> ÃÂ· Ã­ÂÂÃ­ÂÂ+{s.cum}%</div><div style={{fontSize:10,color:tab===g?"rgba(255,255,255,0.65)":"#94a3b8",marginTop:1}}>TP1{s.tp1c}({s.tp1r}%) ÃÂ· TP2{s.boc}({s.bor}%) ÃÂ· SL{s.slc}({s.slr}%)</div></div>)})}</div>{st[tab]&&<div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:6,marginBottom:12}}><div style={{background:"#f0fdf4",borderRadius:10,padding:"8px 10px",textAlign:"center",border:"1px solid #fee2e2"}}><div style={{fontSize:10,color:"#dc2626"}}>Ã¬ÂÂµÃ¬Â Â (TP1+TP2)</div><div style={{fontSize:18,fontWeight:900,color:"#dc2626"}}>{st[tab].tp1c}ÃªÂ±Â´</div><div style={{fontSize:10,color:"#64748b"}}>{st[tab].tp1r}% ÃÂ· TP2{st[tab].boc}ÃªÂ±Â´({st[tab].bor}%)</div></div><div style={{background:"#fef2f2",borderRadius:10,padding:"8px 10px",textAlign:"center",border:"1px solid #fecaca"}}><div style={{fontSize:10,color:"#dc2626"}}>Ã¬ÂÂÃ¬Â Â (SL)</div><div style={{fontSize:18,fontWeight:900,color:"#dc2626"}}>{st[tab].slc}ÃªÂ±Â´</div><div style={{fontSize:10,color:"#64748b"}}>{Math.round((st[tab].slc)/st[tab].n*100)}%</div></div><div style={{background:"#f8fafc",borderRadius:10,padding:"8px 10px",textAlign:"center",border:"1px solid #e2e8f0"}}><div style={{fontSize:10,color:"#64748b"}}>ÃªÂ¸Â°ÃªÂ°ÂÃ«Â§ÂÃ«Â£Â (TO)</div><div style={{fontSize:18,fontWeight:900,color:"#64748b"}}>{st[tab].toc}ÃªÂ±Â´</div><div style={{fontSize:10,color:"#94a3b8"}}>{st[tab].tor}%</div></div></div>}<div style={{borderRadius:12,border:"1px solid #e2e8f0",overflow:"hidden"}}><div style={{overflowX:"auto"}}><table style={{width:"100%",minWidth:760,borderCollapse:"collapse",fontSize:13}}><thead><tr style={{background:"#f8fafc"}}>{[{k:"d",l:"Ã«ÂÂ Ã¬Â§Â"},{k:"n",l:"Ã¬Â¢ÂÃ«ÂªÂ©"},{k:"ch",l:"Ã«ÂÂ±Ã«ÂÂ½"},{k:"iv",l:"Ã¬ÂÂÃªÂ¸Â"},{k:"sc",l:"NEO"},{k:"r",l:""}].map(h=>(<th key={h.k} onClick={()=>ds(h.k)} style={{padding:"8px 5px",textAlign:h.k==="n"?"left":"center",fontWeight:600,fontSize:11,color:"#94a3b8",cursor:"pointer",borderBottom:"2px solid #e2e8f0",whiteSpace:"nowrap",userSelect:"none"}}>{h.l}{srt.c===h.k?(srt.d==="asc"?" Ã¢ÂÂ":" Ã¢ÂÂ"):""}</th>))}</tr></thead><tbody>{pd.map((r,i)=>{const isO=open===pg*PP+i,gi=GI[r.hsG];return[<tr key={"r"+i} onClick={()=>{setOpen(isO?null:pg*PP+i);onRowClick&&onRowClick(r);}} style={{cursor:"pointer",borderBottom:"1px solid #f1f5f9",background:isO?gi.bg:"#fff"}}><td style={{padding:"8px 5px",textAlign:"center",fontSize:11,color:"#94a3b8"}}>{r.d.slice(2)}</td><td style={{padding:"8px 5px",fontWeight:700,fontSize:13,maxWidth:120,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{r.n}</td><td style={{padding:"8px 5px",textAlign:"center",fontWeight:700,color:"#dc2626",fontSize:12}}>+{r.ch}%</td><td style={{padding:"8px 5px",textAlign:"center",fontSize:11,fontWeight:600,color:r.iv==="ÃªÂ¸Â°+Ã¬ÂÂ¸"?"#7c3aed":r.iv==="Ã¬ÂÂ¸Ã¬ÂÂ¸"?"#2563eb":"#94a3b8"}}>{r.iv}</td><td style={{padding:"8px 5px",textAlign:"center"}}><span style={{background:gi.c+"12",color:gi.c,padding:"1px 7px",borderRadius:20,fontWeight:800,fontSize:12}}>{r.sc}</span></td><td style={{padding:"8px 5px",textAlign:"center",fontWeight:800,fontSize:13,color:r.t>0?"#dc2626":"#2563eb"}}>{((r.t>0?"+":"")+r.t+"%"+(function(){var a=invAmt.useSame?invAmt.same:(invAmt[r.hsG]||0);if(!a)return"";var g=Math.round(a*r.t/100);return" ("+(g>=0?"+":"")+g.toLocaleString()+"Ã¬ÂÂ)";})())}</td><td style={{padding:"8px 5px",textAlign:"center"}}><span style={{padding:"1px 4px",borderRadius:4,fontSize:10,fontWeight:700,background:RC(r.r)+"12",color:RC(r.r)}}>{RL(r.r)}</span></td></tr>,isO&&(<tr key={"d"+i}><td colSpan={9} style={{padding:0}}><div style={{padding:"12px 16px",background:gi.bg,borderBottom:"2px solid "+gi.bd}}><div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(80px,1fr))",gap:5,marginBottom:8}}>{[{l:"Ã¬ÂÂÃ¬Â´Â",v:r.mc},{l:"Ã¬ÂÂÃªÂ¸Â",v:r.iv},{l:"Ã¬ÂµÂÃ«ÂÂÃ¢ÂÂ",v:"+"+r.pk+"%",c:"#dc2626"},{l:"Ã¬ÂµÂÃ«ÂÂÃ¢ÂÂ",v:r.dd+"%",c:"#dc2626"},{l:"TP1Ã«ÂÂÃ«ÂÂ¬Ã¬ÂÂ¼",v:r.tp1d?r.tp1d+(r.tp1dy?" ("+r.tp1dy+"Ã¬ÂÂ¼)":""):"-",c:r.tp1d?"#2563eb":"#94a3b8"},{l:"SLÃ¬ÂÂÃ¬Â ÂÃ¬ÂÂ¼",v:r.sld?r.sld+(r.sldy?" ("+r.sldy+"Ã¬ÂÂ¼)":""):"-",c:r.sld?"#dc2626":"#94a3b8"},{l:"TP2Ã«ÂÂÃ«ÂÂ¬Ã¬ÂÂ¼",v:r.tp2d||"-",c:r.tp2d?"#dc2626":"#94a3b8"},{l:"Ã¬Â²Â­Ã¬ÂÂ°Ã¬ÂÂ¼",v:r.exd?r.exd+(r.exdy?" ("+r.exdy+"Ã¬ÂÂ¼)":""):"-",c:"#64748b"}].map((x,j)=>(<div key={j} style={{background:"#fff",borderRadius:6,padding:"4px 6px"}}><div style={{fontSize:9,color:"#94a3b8"}}>{x.l}</div><div style={{fontSize:13,fontWeight:700,color:x.c||"#1e293b"}}>{x.v}</div></div>))}</div><div style={{background:"#fff",borderRadius:6,padding:"12px 14px"}}><div style={{display:"flex",alignItems:"baseline",gap:10,marginBottom:6,flexWrap:"wrap"}}><div style={{fontSize:22,fontWeight:900,color:r.t>=0?"#dc2626":"#2563eb"}}>Ã¬ÂÂ¤Ã­ÂÂ {r.t>0?"+":""}{r.t}%</div><div style={{fontSize:10,color:"#94a3b8",fontWeight:600}}>ÃªÂ±Â°Ã«ÂÂ Ã¬ÂÂÃ«ÂÂÃ«Â¦Â¬Ã¬ÂÂ¤</div></div><div style={{fontSize:11,color:"#475569",lineHeight:1.8}}>{SD(r,cTP)}</div></div></div></td></tr>)]})}</tbody></table></div></div><div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginTop:10}}><span style={{fontSize:12,color:"#94a3b8"}}>{fl.length}ÃªÂ±Â´ Ã¬Â¤Â {pg*PP+1}~{Math.min((pg+1)*PP,fl.length)}</span><div style={{display:"flex",gap:4}}><button onClick={()=>setPg(Math.max(0,pg-1))} disabled={pg===0} style={{padding:"5px 12px",borderRadius:8,border:"1px solid #e2e8f0",background:"#fff",fontSize:13,fontWeight:700,cursor:pg===0?"default":"pointer",color:pg===0?"#e2e8f0":"#1e293b"}}>Ã¢ÂÂ</button><input type="number" value={pg+1} min={1} max={mx+1} onChange={e=>{const v=parseInt(e.target.value)-1;if(!isNaN(v)&&v>=0&&v<=mx)setPg(v);}} style={{padding:"5px 4px",fontSize:13,color:"#64748b",width:50,textAlign:"center",border:"1px solid #e2e8f0",borderRadius:6}}/><span style={{padding:"5px 2px",fontSize:13,color:"#94a3b8"}}>/{mx+1}</span><button onClick={()=>setPg(Math.min(mx,pg+1))} disabled={pg>=mx} style={{padding:"5px 12px",borderRadius:8,border:"1px solid #e2e8f0",background:"#fff",fontSize:13,fontWeight:700,cursor:pg>=mx?"default":"pointer",color:pg>=mx?"#e2e8f0":"#1e293b"}}>Ã¢ÂÂ</button></div></div></div>);}



function TodaySignals({onSignalsLoaded}){const [data,setData]=useState(null);const [loading,setLoading]=useState(true);const [err,setErr]=useState(null);const [saving,setSaving]=useState(false);const [saveMsg,setSaveMsg]=useState(null);const load=useCallback(async()=>{setLoading(true);setErr(null);try{const r=await fetch(API_URL);const j=await r.json();if(j.ok){const _all=[...(j.signals?.S||[]),...(j.signals?.A||[]),...(j.signals?.B||[]),...(j.signals?.X||[])];const _seen=new Set();const _uniq=_all.filter(x=>{if(_seen.has(x.code))return false;_seen.add(x.code);return true});const _new={S:[],A:[],B:[],X:[]};for(const _x of _uniq){const _a=_x.amount||0,_c=_x.change||0;if(_a<100||_c<10||_c>29)continue;const _g=_a>=5000?'S':_a>=2500?'A':'B';_new[_g].push({..._x,grade:_g});}j.signals=_new;j.all=[..._new.S,..._new.A,..._new.B,..._new.X];j.summary={total:j.all.length,S:_new.S.length,A:_new.A.length,B:_new.B.length,X:_new.X.length};setData(j);if(onSignalsLoaded)onSignalsLoaded(j.all||[]);}else setErr(j.error||"API Ã¬ÂÂ¤Ã«Â¥Â")}catch(e){setErr(e.message)}setLoading(false)},[]);useEffect(()=>{load()},[load]);const saveSignals=async()=>{if(!data||!data.all||!data.all.length)return;setSaving(true);setSaveMsg(null);try{const r=await fetch(TRACK_API,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(data.all.filter(s=>s.grade!=="X").map(s=>({code:s.code,name:s.name,entry_price:s.price,rate:s.change,score:s.score,grade:s.grade,supply:s.investor,wick:s.wick,vol:s.amount,market:s.market,tp1:s.tp1,tp2:s.tp2,sl:s.sl})))});const j=await r.json();setSaveMsg(j.github_ok?("Ã¢ÂÂ "+j.added+"ÃªÂ±Â´ Ã¬Â ÂÃ¬ÂÂ¥"):("Ã¢ÂÂ Ã¯Â¸Â GITHUB_TOKEN Ã«Â¯Â¸Ã¬ÂÂ¤Ã¬Â Â Ã¢ÂÂ Vercel Ã­ÂÂÃªÂ²Â½Ã«Â³ÂÃ¬ÂÂ Ã¬Â¶ÂÃªÂ°Â Ã­ÂÂÃ¬ÂÂ"));}catch(e){setSaveMsg("Ã¬ÂÂ¤Ã«Â¥Â: "+e.message);}setSaving(false);};const gC=g=>GI[g]?.c||"#94a3b8";if(loading)return(<div style={{textAlign:"center",padding:"60px 20px"}}><div style={{fontSize:36,marginBottom:12}}>Ã¢ÂÂ³</div><div style={{fontSize:16,fontWeight:600,color:"#64748b"}}>KIS API Ã¬ÂÂ¤Ã­ÂÂ¬Ã«Â¦Â¬Ã«ÂÂ Ã¬Â¤Â...</div><div style={{fontSize:13,color:"#94a3b8",marginTop:4}}>ÃªÂ±Â°Ã«ÂÂÃ«ÂÂÃªÂ¸ÂÃÂ·Ã«ÂÂ±Ã«ÂÂ½Ã«Â¥Â  Ã¬ÂÂÃ¬ÂÂ Ã¬Â¢ÂÃ«ÂªÂ© Ã«Â¶ÂÃ¬ÂÂ Ã¬Â¤Â</div></div>);if(err)return(<div style={{textAlign:"center",padding:"40px 20px"}}><div style={{fontSize:36,marginBottom:12}}>Ã¢ÂÂ Ã¯Â¸Â</div><div style={{fontSize:15,color:"#dc2626",marginBottom:8}}>{err}</div><button onClick={load} style={{padding:"8px 20px",borderRadius:8,border:"1px solid #e2e8f0",background:"#fff",fontSize:14,fontWeight:600,cursor:"pointer"}}>Ã«ÂÂ¤Ã¬ÂÂ Ã¬ÂÂÃ«ÂÂ</button></div>);if(!data)return null;return(<div><div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}><div style={{fontSize:14,color:"#64748b"}}>{data.date} ÃÂ· {data.time} KST</div><div style={{display:"flex",gap:6}}><button onClick={saveSignals} disabled={saving} style={{padding:"5px 12px",borderRadius:8,border:"none",background:saving?"#e2e8f0":"#1e293b",color:saving?"#94a3b8":"#fff",fontSize:12,fontWeight:700,cursor:saving?"default":"pointer"}}>Ã°ÂÂÂ Ã¬ÂÂ Ã­ÂÂ¸Ã¬Â ÂÃ¬ÂÂ¥</button><button onClick={load} style={{padding:"5px 12px",borderRadius:8,border:"1px solid #e2e8f0",background:"#fff",fontSize:12,fontWeight:600,cursor:"pointer"}}>Ã°ÂÂÂ</button></div></div>{saveMsg&&<div style={{padding:"8px 12px",borderRadius:8,background:saveMsg.startsWith("Ã¢ÂÂ")?"#f0fdf4":"#fffbeb",border:"1px solid "+(saveMsg.startsWith("Ã¢ÂÂ")?"#fee2e2":"#fcd34d"),color:saveMsg.startsWith("Ã¢ÂÂ")?"#dc2626":"#d97706",fontSize:12,marginBottom:10}}>{saveMsg}</div>}<div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:8,marginBottom:16}}>{["S","A","B","X"].map(g=>(<div key={g} style={{textAlign:"center",padding:"10px 0",borderRadius:10,background:gC(g)+"10",border:"1px solid "+gC(g)+"30"}}><div style={{fontSize:22,fontWeight:900,color:gC(g)}}>{data.summary[g]}</div><div style={{fontSize:11,color:"#64748b"}}>{g}Ã«ÂÂ±ÃªÂ¸Â</div></div>))}</div>{data.all.filter(s=>s.score>=4).length===0?(<div style={{textAlign:"center",padding:"40px",color:"#94a3b8"}}><div style={{fontSize:36,marginBottom:8}}>Ã°ÂÂÂ­</div><div style={{fontSize:15}}>Ã¬ÂÂ¤Ã«ÂÂÃ¬ÂÂ 10%+ Ã«ÂÂÃ­ÂÂ Ã¬ÂÂÃªÂ·Â¸Ã«ÂÂÃ¬ÂÂ´ Ã¬ÂÂÃ¬ÂÂµÃ«ÂÂÃ«ÂÂ¤</div><div style={{fontSize:13,marginTop:4}}>Ã¬ÂÂ¥ Ã«Â§ÂÃªÂ°Â Ã­ÂÂ(15:30~) ÃªÂ²Â°ÃªÂ³Â¼ÃªÂ°Â ÃªÂ°Â±Ã¬ÂÂ Ã«ÂÂ©Ã«ÂÂÃ«ÂÂ¤</div></div>):data.all.filter(s=>s.score>=4).map((s,i)=>(<div key={i} style={{display:"flex",alignItems:"center",gap:10,padding:"12px 14px",borderRadius:12,border:"1px solid #e2e8f0",marginBottom:6,background:"#fff"}}><div style={{width:42,height:42,borderRadius:10,background:gC(s.grade)+"12",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}><span style={{fontSize:18,fontWeight:900,color:gC(s.grade)}}>{s.grade}</span></div><div style={{flex:1,minWidth:0}}><div style={{display:"flex",alignItems:"center",gap:6}}><span style={{fontWeight:700,fontSize:15}}>{s.name}</span><span style={{fontSize:12,fontWeight:700,color:"#dc2626"}}>+{s.change}%</span></div><div style={{fontSize:11,color:"#94a3b8",marginTop:2}}>{s.score}Ã¬Â Â ÃÂ· {s.investor} ÃÂ· {s.market} ÃÂ· {s.amount}Ã¬ÂÂµ</div></div><div style={{textAlign:"right",flexShrink:0}}></div></div>))}</div>);}

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
  const [codeInput, setCodeInput] = useState("");
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
  const [finalError, setFinalError] = useState("");

  async function generateFinal() {
    if (!aiResult || !chimResult || !jdResult || !hsResult) {
      setFinalError("4Ã¬Â¤Â Ã«Â¶ÂÃ¬ÂÂÃ¬ÂÂ Ã«Â¨Â¼Ã¬Â Â Ã¬ÂÂÃ«Â£ÂÃ­ÂÂ´Ã¬Â£Â¼Ã¬ÂÂ¸Ã¬ÂÂ");
      return;
    }
    setFinalLoading(true);
    setFinalError("");
    try {
      const today = new Date().toLocaleDateString("ko-KR");
      const sysPrompt = "Ã«ÂÂ¹Ã¬ÂÂ Ã¬ÂÂ Ã­ÂÂÃªÂµÂ­ Ã¬Â£Â¼Ã¬ÂÂ Ã«Â§Â¤Ã«Â§Â¤ Ã¬Â ÂÃ«Â¬Â¸ÃªÂ°ÂÃ¬ÂÂÃ«ÂÂÃ«ÂÂ¤ (Ã¬Â¢ÂÃªÂ°ÂÃ«ÂÂÃ­ÂÂÃ«Â§Â¤Ã«Â§Â¤ + Ã«ÂÂÃ«Â¦Â¼Ã«ÂªÂ©Ã«Â§Â¤Ã«Â§Â¤ Ã«ÂÂ Ã«ÂÂ¤ ÃªÂ°ÂÃ«ÂÂ¥). 4ÃªÂ°Â Ã«Â¶ÂÃ¬ÂÂ ÃªÂ²Â°ÃªÂ³Â¼Ã«Â¥Â¼ Ã¬Â¢ÂÃ­ÂÂ©Ã­ÂÂ´ Ã¬ÂÂ Ã¬Â¤Â Ã­ÂÂÃ«ÂÂÃ«Â¥Â¼ Ã«ÂªÂÃ­ÂÂÃ­ÂÂ ÃªÂ²Â°Ã¬Â Â: 1)Ã«ÂÂÃ­ÂÂÃ«Â§Â¤Ã«Â§Â¤Ã¬Â§ÂÃ¬ÂÂ 2)Ã«ÂÂÃ«Â¦Â¼Ã«ÂªÂ©Ã«Â§Â¤Ã«Â§Â¤Ã«ÂÂÃªÂ¸Â° 3)Ã«Â§Â¤Ã¬ÂÂÃªÂ¸ÂÃ¬Â§Â\n\n## Ã­ÂÂÃ¬Â Â ÃªÂ¸Â°Ã¬Â¤Â\n- Ã«ÂÂÃ­ÂÂ Ã¬Â ÂÃ­ÂÂ©: Ã¬ÂÂ¸+ÃªÂ¸Â° Ã«ÂÂÃ«Â°ÂÃ«Â§Â¤Ã¬ÂÂ + ÃªÂ±Â°Ã«ÂÂÃ«ÂÂÃªÂ¸Â 500Ã¬ÂÂµ+ + Ã¬ÂÂÃªÂ¼Â¬Ã«Â¦Â¬Ã¢ÂÂ¤5% + Ã¬ÂÂ ÃªÂ³Â ÃªÂ°Â/Ã¬Â ÂÃ­ÂÂ­Ã«ÂÂÃ­ÂÂ\n- Ã«ÂÂÃ«Â¦Â¼Ã«ÂªÂ© Ã¬Â ÂÃ­ÂÂ©: Ã¬Â¶ÂÃ¬ÂÂ¸ Ã¬Â¢ÂÃ¬ÂÂÃ«ÂÂ° Ã¬ÂÂÃªÂ¼Â¬Ã«Â¦Â¬>10% Ã«ÂÂÃ«ÂÂ ÃªÂ±Â°Ã«ÂÂÃ«ÂÂÃªÂ¸Â Ã«Â¶ÂÃ¬Â¡Â± Ã¢ÂÂ 5/10/20Ã¬ÂÂ¼Ã¬ÂÂ  Ã¬Â§ÂÃ¬Â§Â Ã«ÂÂÃªÂ¸Â°\n- Ã«Â§Â¤Ã¬ÂÂÃªÂ¸ÂÃ¬Â§Â: Ã¬ÂÂÃªÂ¸Â Ã¬ÂÂÃ­ÂÂ/Ã¬Â¶ÂÃ¬ÂÂ¸ Ã¬ÂÂ½/Ã«ÂÂ°Ã¬ÂÂ´Ã­ÂÂ° Ã«Â¶ÂÃ¬Â¡Â±\n\n## Ã«Â£Â°\n- Ã«ÂÂÃ­ÂÂ: TP1=+10%, TP2=+20%, SL=-5%, Ã«Â³Â´Ã¬ÂÂ  10Ã¬ÂÂ¼\n- Ã«ÂÂÃ«Â¦Â¼Ã«ÂªÂ©: 5/10Ã¬ÂÂ¼Ã¬ÂÂ  1Ã¬Â°Â¨Ã«Â§Â¤Ã¬ÂÂ, Ã¬Â¶ÂÃªÂ°ÂÃ­ÂÂÃ«ÂÂ½Ã¬ÂÂ 2Ã¬Â°Â¨, Ã¬ÂÂÃ¬Â Â Ã¬Â§ÂÃ¬Â ÂÃ¬Â ÂÃ¬Â Â-3%, Ã¬ÂÂµÃ¬Â Â Ã¬Â ÂÃªÂ³Â Ã¬Â Â\n\nÃ¬ÂÂ¤Ã«ÂÂ: " + today + "\n\n## ÃªÂ²ÂÃ¬Â¦ÂÃ«ÂÂ Ã«Â£Â°\n- Ã«Â§Â¤Ã¬ÂÂ Ã¬Â¡Â°ÃªÂ±Â´: NEO 4Ã¬Â Â+ AND Ã¬Â¹Â¨/Ã¬Â£Â¼/Ã­ÂÂ Ã¬Â¤Â 2ÃªÂ°Â Ã¬ÂÂ´Ã¬ÂÂ SSA+\n- TP1=10%, TP2=20%, SL=-5%, Ã«Â³Â´Ã¬ÂÂ  10Ã¬ÂÂ¼\n- Ã«Â§Â¤Ã¬ÂÂ Ã­ÂÂÃ¬ÂÂ´Ã«Â°Â: 14:50~15:20 (Ã¬ÂÂ¥ Ã«Â§ÂÃªÂ°Â Ã¬Â§ÂÃ¬Â Â)\n\n## Ã¬ÂÂÃ«ÂÂµ Ã­ÂÂÃ¬ÂÂ (Ã«Â°ÂÃ«ÂÂÃ¬ÂÂ Ã«ÂÂ¨Ã¬ÂÂ¼ JSON, Ã«ÂªÂ¨Ã«ÂÂ  Ã­ÂÂÃ«ÂÂ Ã¬Â±ÂÃ¬ÂÂ°ÃªÂ¸Â°)\n{\"finalGrade\":\"S/A/B/X\",\"verdict\":\"Ã«ÂÂÃ­ÂÂÃ«Â§Â¤Ã«Â§Â¤Ã¬Â§ÂÃ¬ÂÂ|Ã«ÂÂÃ«Â¦Â¼Ã«ÂªÂ©Ã«Â§Â¤Ã«Â§Â¤Ã«ÂÂÃªÂ¸Â°|Ã«Â§Â¤Ã¬ÂÂÃªÂ¸ÂÃ¬Â§Â (Ã¬ÂÂ Ã¬Â¤Â Ã¬Â ÂÃ­ÂÂÃ­ÂÂ Ã­ÂÂÃ«ÂÂ)\",\"confidence\":0~100,\"summary\":\"Ã­ÂÂÃ¬Â¤ÂÃ­ÂÂ (Ã¬ÂÂ´Ã«ÂªÂ¨Ã¬Â§Â Ã­ÂÂ¬Ã­ÂÂ¨). Ã¬ÂÂ: Ã°ÂÂÂ LXÃ­ÂÂÃ¬ÂÂ°Ã¬ÂÂÃ¬ÂÂ¤ Ã«ÂÂÃ­ÂÂÃ«Â§Â¤Ã«Â§Â¤ Ã¬Â§ÂÃ¬ÂÂ! Ã¬ÂÂ¸+ÃªÂ¸Â° Ã«ÂÂÃ«Â°Â + 800Ã¬ÂÂµ ÃªÂ±Â°Ã«ÂÂÃ«ÂÂÃªÂ¸Â (Ã¬Â ÂÃ­ÂÂ©Ã«ÂÂ 72% vs Ã«ÂÂÃ«Â¦Â¼Ã«ÂªÂ© 28%) | Ã¢ÂÂ¸Ã¯Â¸Â ÃªÂ¸Â°Ã«ÂÂ¤Ã«Â Â¸Ã«ÂÂ¤ Ã«ÂÂÃ«Â¦Â¼Ã«ÂªÂ©Ã«Â§Â¤Ã«Â§Â¤! 5Ã¬ÂÂ¼Ã¬ÂÂ  32000 Ã¬Â§ÂÃ¬Â§Â Ã«ÂÂÃªÂ¸Â° | Ã¢ÂÂ Ã«Â§Â¤Ã¬ÂÂÃªÂ¸ÂÃ¬Â§Â! Ã¬ÂÂÃªÂ¸Â Ã¬ÂÂÃ­ÂÂ\",\"consensus\":\"[Ã­ÂÂÃ«Â§ÂÃ«Â¶ÂÃ¬ÂÂ] Ã¬Â¢ÂÃ«ÂªÂ© Ã­ÂÂÃ«Â§Â(Ã¬ÂÂ: AIÃ«Â°ÂÃ«ÂÂÃ¬Â²Â´/2Ã¬Â°Â¨Ã¬Â ÂÃ¬Â§Â/Ã«Â°Â©Ã¬ÂÂ°/ÃªÂ±Â´Ã¬ÂÂ¤). Ã­ÂÂÃ«Â§Â Ã«ÂÂ´ Ã¬ÂÂÃ¬Â¹Â: Ã«ÂÂÃ¬ÂÂ¥Ã¬Â£Â¼/2Ã«ÂÂ±Ã¬Â£Â¼/3Ã«ÂÂ±Ã¬Â£Â¼/Ã­ÂÂÃ«Â°ÂÃ¬Â£Â¼ (Ã¬ÂÂ´Ã¬ÂÂ : Ã¬ÂÂÃ¬Â´ÂÃÂ·ÃªÂ±Â°Ã«ÂÂÃ«ÂÂÃªÂ¸ÂÃÂ·Ã«ÂÂ±Ã«ÂÂ½Ã«Â¥Â  Ã«Â¹ÂÃªÂµÂ). Ã¬Â§ÂÃªÂ¿Â Ã¬Â¢ÂÃ«ÂªÂ© 3ÃªÂ°Â (ÃªÂ°ÂÃ¬ÂÂ Ã­ÂÂÃ«Â§Â Ã¬ÂÂ Ã¬ÂÂ¬ Ã­ÂÂÃ«Â¦Â): AÃ¬Â½ÂÃ«ÂÂ-AÃ«ÂªÂ, BÃ¬Â½ÂÃ«ÂÂ-BÃ«ÂªÂ, CÃ¬Â½ÂÃ«ÂÂ-CÃ«ÂªÂ. [4Ã«Â¶ÂÃ¬ÂÂ Ã¬Â¢ÂÃ­ÂÂ©] 4ÃªÂ°Â Ã«Â¶ÂÃ¬ÂÂ Ã¬ÂÂ¼Ã¬Â¹Â/Ã«Â¶ÂÃ¬ÂÂ¼Ã¬Â¹Â + Ã¬Â¢ÂÃ­ÂÂ© Ã¬ÂÂÃªÂ²Â¬ 3-4Ã«Â¬Â¸Ã¬ÂÂ¥\",\"marketContext\":\"Ã¬ÂÂ¤Ã«ÂÂ Ã«Â¯Â¸ÃªÂµÂ­Ã¬ÂÂ Ã«Â¬Â¼/Ã«Â§ÂÃ¬Â¼ÂÃ­ÂÂÃ«Â¦Â/Ã¬Â£Â¼Ã¬ÂÂÃ«ÂÂ´Ã¬ÂÂ¤ ÃªÂ°ÂÃ¬Â Â Ã«Â°ÂÃ¬ÂÂ 1-2Ã«Â¬Â¸Ã¬ÂÂ¥\",\"buyTiming\":\"14:50~15:20 Ã«Â¶ÂÃ­ÂÂ Ã«Â§Â¤Ã¬ÂÂ Ã«ÂÂ± ÃªÂµÂ¬Ã¬Â²Â´ Ã¬Â§ÂÃ¬ÂÂ Ã­ÂÂÃ¬ÂÂ´Ã«Â°Â\",\"buyStrategy\":\"Ã­ÂÂ¬Ã¬Â§ÂÃ¬ÂÂ Ã«Â¹ÂÃ¬Â¤Â: Ã¬Â´ÂÃ¬ÂÂÃªÂ¸Â 200Ã«Â§ÂÃ¬ÂÂ ÃªÂ¸Â°Ã¬Â¤Â X% (Ã¬ÂÂ: A=30Ã«Â§Â/15%, B=20Ã«Â§Â/10%, X=0). Ã«ÂÂÃ­ÂÂÃ¬Â§ÂÃ¬ÂÂÃ¬ÂÂ´Ã«Â©Â´: 1Ã¬Â°Â¨ Ã¬Â§ÂÃ¬ÂÂÃªÂ°Â(60% Ã¬ÂÂÃªÂ¸Â) + 2Ã¬Â°Â¨ Ã¬Â§ÂÃ¬ÂÂÃªÂ°Â(40% Ã¬ÂÂÃªÂ¸Â) + Ã¬ÂÂ¬Ã¬ÂÂ´Ã¬Â¦Â. Ã«ÂÂÃ«Â¦Â¼Ã«ÂªÂ©Ã«ÂÂÃªÂ¸Â°Ã«Â©Â´: 1Ã¬Â°Â¨Ã«Â§Â¤Ã¬ÂÂÃªÂ°Â(5/10Ã¬ÂÂ¼Ã¬ÂÂ  ÃªÂµÂ¬Ã¬Â²Â´ÃªÂ°ÂÃªÂ²Â©, 50%) + 2Ã¬Â°Â¨Ã«Â§Â¤Ã¬ÂÂÃªÂ°Â(Ã¬Â¶ÂÃªÂ°ÂÃ­ÂÂÃ«ÂÂ½Ã¬ÂÂ ÃªÂ°ÂÃªÂ²Â©, 50%) + Ã«Â©Â°Ã¬Â¹Â  Ã«ÂÂÃªÂ¸Â°. ÃªÂ¸ÂÃ¬Â§ÂÃ«Â©Â´: Ã«Â§Â¤Ã¬ÂÂÃªÂ¸ÂÃ¬Â§Â Ã¬ÂÂ¬Ã¬ÂÂ \",\"exitPlan\":{\"tp1\":\"Ã«ÂÂÃ­ÂÂ=+10% ÃªÂµÂ¬Ã¬Â²Â´ÃªÂ°ÂÃªÂ²Â©(50% Ã¬ÂÂµÃ¬Â Â), Ã«ÂÂÃ«Â¦Â¼Ã«ÂªÂ©=Ã¬ÂÂµÃ¬Â ÂÃªÂ°Â(Ã¬Â ÂÃªÂ³Â Ã¬Â Â ÃªÂµÂ¬Ã¬Â²Â´ÃªÂ°ÂÃªÂ²Â©)\",\"tp2\":\"Ã«ÂÂÃ­ÂÂ=+20% ÃªÂµÂ¬Ã¬Â²Â´ÃªÂ°ÂÃªÂ²Â©(Ã¬ÂÂÃ¬ÂÂ¬ Ã¬Â²Â­Ã¬ÂÂ°), Ã«ÂÂÃ«Â¦Â¼Ã«ÂªÂ©=N/A\",\"sl\":\"ÃªÂ¸Â°Ã«Â³Â¸Ã¬ÂÂÃ¬Â Â: Ã«ÂÂÃ­ÂÂ=-5% ÃªÂµÂ¬Ã¬Â²Â´ÃªÂ°ÂÃªÂ²Â©, Ã«ÂÂÃ«Â¦Â¼Ã«ÂªÂ©=Ã¬Â§ÂÃ¬Â ÂÃ¬Â ÂÃ¬Â Â-3% ÃªÂµÂ¬Ã¬Â²Â´ÃªÂ°ÂÃªÂ²Â©. Ã¢ÂÂ Ã¯Â¸Â ÃªÂ°ÂÃ¬Â ÂÃ¬ÂÂÃ¬Â Â(Ã¬Â¦ÂÃ¬ÂÂÃ¬Â²Â­Ã¬ÂÂ°): Ã¬ÂÂ¸Ã¬ÂÂ¸ Ã¬ÂÂÃ«Â§Â¤Ã«ÂÂ Ã¬Â ÂÃ­ÂÂ Ã«ÂÂÃ«ÂÂ KOSPI -2% ÃªÂ¸ÂÃ«ÂÂ½ Ã«ÂÂÃ«ÂÂ ÃªÂ±Â°Ã«ÂÂÃ«ÂÂÃªÂ¸Â Ã¬Â ÂÃ¬ÂÂ¼ 50% Ã¬ÂÂ´Ã­ÂÂ ÃªÂ°ÂÃ¬ÂÂ Ã¬ÂÂ\",\"timeStop\":\"10Ã¬ÂÂ¼ Ã«Â§ÂÃªÂ¸Â° Ã¬Â²Â­Ã¬ÂÂ° ÃªÂ°ÂÃ¬ÂÂ´Ã«ÂÂ\"},\"scenarios\":{\"bullish\":\"Ã¬ÂÂµÃ¬ÂÂ¼ ÃªÂ°Â­Ã¬ÂÂÃ¬ÂÂ¹ Ã¬ÂÂÃ«ÂÂÃ«Â¦Â¬Ã¬ÂÂ¤ + Ã«ÂÂÃ¬ÂÂ\",\"neutral\":\"Ã«Â³Â´Ã­ÂÂ© Ã¬ÂÂÃ«ÂÂÃ«Â¦Â¬Ã¬ÂÂ¤ + Ã«ÂÂÃ¬ÂÂ\",\"bearish\":\"Ã­ÂÂÃ«ÂÂ½ Ã¬ÂÂÃ«ÂÂÃ«Â¦Â¬Ã¬ÂÂ¤ + Ã«ÂÂÃ¬ÂÂ (Ã¬Â¶ÂÃªÂ°ÂÃ«Â§Â¤Ã¬ÂÂ vs Ã¬ÂÂÃ¬Â Â)\"},\"addBuy\":\"Ã¬Â¶ÂÃªÂ°ÂÃ«Â§Â¤Ã¬ÂÂ Ã­ÂÂ¸Ã«Â¦Â¬ÃªÂ±Â° Ã¬Â¡Â°ÃªÂ±Â´ (Ã¬ÂÂ: Ã¬Â§ÂÃ¬ÂÂÃªÂ°Â -3% Ã«ÂÂÃ«ÂÂ¬ Ã¬ÂÂ Ã«ÂÂ±)\",\"riskFactors\":[\"Ã¬Â£Â¼Ã¬ÂÂ Ã«Â¦Â¬Ã¬ÂÂ¤Ã­ÂÂ¬ 1\",\"Ã«Â¦Â¬Ã¬ÂÂ¤Ã­ÂÂ¬ 2\",\"Ã«Â¦Â¬Ã¬ÂÂ¤Ã­ÂÂ¬ 3\"],\"watchPoints\":[\"Ã«Â§Â¤Ã«Â§Â¤ Ã¬Â§ÂÃ­ÂÂ Ã¬Â¤Â Ã«ÂªÂ¨Ã«ÂÂÃ­ÂÂ°Ã«Â§Â Ã­ÂÂ¬Ã¬ÂÂ¸Ã­ÂÂ¸ 1\",\"Ã­ÂÂ¬Ã¬ÂÂ¸Ã­ÂÂ¸ 2\"]}";
      const userPrompt = "4ÃªÂ°Â Ã«Â¶ÂÃ¬ÂÂ ÃªÂ²Â°ÃªÂ³Â¼ (JSON):\n\n[NeoAi] " + JSON.stringify(aiResult).slice(0, 1500) +
        "\n\n[Ã¬Â¹Â¨Ã¬Â°Â©Ã­ÂÂ´] " + JSON.stringify(chimResult).slice(0, 1500) +
        "\n\n[Ã¬Â£Â¼Ã«ÂÂÃ¬Â£Â¼] " + JSON.stringify(jdResult).slice(0, 1500) +
        "\n\n[Ã­ÂÂÃ¬ÂÂ¹Ã­ÂÂ] " + JSON.stringify(hsResult).slice(0, 1500) +
        "\n\nÃ¬ÂÂ 4ÃªÂ°Â Ã«Â¶ÂÃ¬ÂÂÃ¬ÂÂ Ã¬Â¢ÂÃ­ÂÂ©Ã­ÂÂÃ¬ÂÂ¬ Ã¬ÂÂ JSON Ã­ÂÂÃ¬ÂÂÃ«ÂÂÃ«Â¡Â Ã¬ÂµÂÃ¬Â¢Â ÃªÂ²Â°Ã«Â¡Â Ã¬ÂÂ Ã¬ÂÂÃ¬ÂÂ±. Ã¬ÂÂÃ¬ÂÂ¥ Ã¬Â»Â¨Ã­ÂÂÃ¬ÂÂ¤Ã­ÂÂ¸(Ã«Â¯Â¸ÃªÂµÂ­Ã¬ÂÂ Ã«Â¬Â¼/Ã«Â§ÂÃ¬Â¼ÂÃ­ÂÂÃ«Â¦Â/Ã¬Â£Â¼Ã¬ÂÂÃ«ÂÂ´Ã¬ÂÂ¤)Ã«Â¥Â¼ ÃªÂ°ÂÃ¬Â ÂÃ­ÂÂÃ¬ÂÂ¬ Ã¬ÂÂ¤Ã¬Â Â Ã«Â§Â¤Ã«Â§Â¤Ã¬ÂÂ Ã«ÂÂÃ¬ÂÂÃ«ÂÂÃ«ÂÂ ÃªÂµÂ¬Ã¬Â²Â´Ã¬Â Â ÃªÂ²Â°Ã«Â¡Â . Ã«Â°ÂÃ«ÂÂÃ¬ÂÂ Ã«ÂÂ¨Ã¬ÂÂ¼ JSONÃ«Â§Â Ã¬Â¶ÂÃ«Â Â¥ (Ã¬Â½ÂÃ«ÂÂÃ«Â¸ÂÃ«Â¡Â X, Ã«ÂÂ¤Ã«Â¥Â¸ Ã­ÂÂÃ¬ÂÂ¤Ã­ÂÂ¸ X).";
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
      if (data.type === "error") throw new Error(data.error && data.error.message || "API Ã¬ÂÂÃ«ÂÂ¬");
      const text = (data.content && data.content[0] && data.content[0].text || "").trim();
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) throw new Error("JSON Ã­ÂÂÃ¬ÂÂ± Ã¬ÂÂ¤Ã­ÂÂ¨");
      const parsed = JSON.parse(jsonMatch[0]);
      setFinalResult(parsed);
    } catch (e) {
      setFinalError(e.message || "Ã¬ÂµÂÃ¬Â¢ÂÃªÂ²Â°Ã«Â¡Â  Ã¬ÂÂÃ¬ÂÂ± Ã¬ÂÂ¤Ã­ÂÂ¨");
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

  const analyze = async () => {
    if (imgs.length === 0 && !(stockNameRef.current && /^[0-9]{6}$/.test(stockNameRef.current.value.trim()))) return;
    setLoading(true);
    setAiError(null); setChimError(null); setJdError(null); setHsError(null);
    setAiResult(null); setChimResult(null); setJdResult(null); setHsResult(null); setFinalResult(null); setFinalError("");
    setProgress("AIÃ«Â¶ÂÃ¬ÂÂ + Ã¬Â¹Â¨Ã¬Â°Â©Ã­ÂÂ´ + Ã¬Â£Â¼Ã«ÂÂÃ¬Â£Â¼ + Ã­ÂÂÃ¬ÂÂ¹Ã­ÂÂ 4Ã¬Â¤Â Ã«Â¶ÂÃ¬ÂÂ Ã«ÂÂÃ¬ÂÂ Ã¬ÂÂ¤Ã­ÂÂ Ã¬Â¤Â...");

    const stockName = stockNameRef.current ? stockNameRef.current.value : "";
    let stockData = null;
    const codeMatch = stockName && stockName.trim().match(/^[0-9]{6}$/);
    if (codeMatch) {
      try {
        setProgress("Ã£ÂÂÃ«ÂªÂ©Ã¬Â½ÂÃ«ÂÂ ÃªÂ°ÂÃ¬Â§Â Ã¢ÂÂ Ã«ÂÂ°Ã¬ÂÂ´Ã­ÂÂ° fetch Ã¬Â¤Â...");
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

    // AI Ã«Â¶ÂÃ¬ÂÂ (NEO-SCORE 14Ã¬Â Â)
    const aiPromise = analyzeNeoAnalysis(stockData || imgs, stockName).then(r => Object.assign(r, { score: r.total, tp1: 10, tp2: 20, sl: -5, breakType: r.breakType || "Ã«ÂÂ¤Ã¬ÂÂ¤Ã«Â¶ÂÃ¬ÂÂ v1", investor: r.investor || "AI Ã¬Â±ÂÃ¬Â Â", ema50: r.ema50 || "5Ã¬ÂÂ¹Ã¬ÂÂ", details: r.details || (r.sections ? [{item:"Ã¢ÂÂ  Ã¬ÂÂÃªÂ¸Â", point:(r.sections.supply&&r.sections.supply.score)||0},{item:"Ã¢ÂÂ¡ Ã«ÂÂÃ­ÂÂÃ­ÂÂÃ¬Â§Â", point:(r.sections.breakout&&r.sections.breakout.score)||0},{item:"Ã¢ÂÂ¢ Ã«ÂªÂ¨Ã«Â©ÂÃ­ÂÂÃÂ·Ã¬ÂÂÃ¬ÂÂ¥", point:(r.sections.momentum&&r.sections.momentum.score)||0},{item:"Ã¢ÂÂ£ Ã¬ÂÂÃ­ÂÂ©ÃÂ·Ã¬ÂÂ¬Ã«Â£Â", point:(r.sections.sectorMaterial&&r.sections.sectorMaterial.score)||0},{item:"Ã¢ÂÂ¤ Ã¬ÂÂ¬Ã¬Â ÂÃ¬ÂÂÃ¬Â¶ÂÃÂ·Ã¬ÂÂ´Ã­ÂÂ", point:(r.sections.accumulation&&r.sections.accumulation.score)||0}] : []), detailedAnalysis: r.summary || "", technicalIndicators: r.technicalIndicators || {}, supplyZone: r.supplyZone || {}, strategy: r.strategy || (r.exitPlan ? { entry: r.buyTiming || "", entryPrice: r.buyStrategy || "", stopLoss: r.exitPlan.sl || "", tp1Price: r.exitPlan.tp1 || "", tp2Price: r.exitPlan.tp2 || "", exit: "TP/SL Ã«ÂÂÃ«ÂÂ¬ Ã¬ÂÂ", hold: "10Ã¬ÂÂ¼" } : {}), confidenceScore: r.confidence || 0, nextDayRiseProbability: r.confidence || 0, recommendedWeight: r.recommendedWeight || 10, verdict: r.verdict || "" }));

    // Ã¬Â¹Â¨Ã¬Â°Â©Ã­ÂÂ´ v4 Ã«Â¶ÂÃ¬ÂÂ
    const chimFn = () => analyzeChimchakhae(stockData || imgs, stockName);

    // Ã¬Â£Â¼Ã«ÂÂÃ¬Â£Â¼ Ã«Â¶ÂÃ¬ÂÂ
    const jdFn = () => analyzeJudoju(stockData || imgs, stockName);

    // Ã­ÂÂÃ¬ÂÂ¹Ã­ÂÂ Ã«ÂÂÃ­ÂÂÃ«Â§Â¤Ã«Â§Â¤ Ã«Â¶ÂÃ¬ÂÂ
    const hsFn = () => analyzeHaseunghoon(stockData || imgs, stockName);

    const [aiRes, chimRes, jdRes, hsRes] = await (async () => { const sleep = (ms) => new Promise(r => setTimeout(r, ms)); const a = await Promise.allSettled([aiPromise]); await sleep(15000); const c = await Promise.allSettled([chimFn()]); await sleep(15000); const j = await Promise.allSettled([jdFn()]); await sleep(15000); const h = await Promise.allSettled([hsFn()]); return [a[0], c[0], j[0], h[0]]; })();

    if (aiRes.status === "fulfilled") setAiResult(aiRes.value);
    else setAiError(aiRes.reason.message || "AIÃ«Â¶ÂÃ¬ÂÂ Ã¬ÂÂ¤Ã­ÂÂ¨");

    if (chimRes.status === "fulfilled") setChimResult(chimRes.value);
    else setChimError(chimRes.reason.message || "Ã¬Â¹Â¨Ã¬Â°Â©Ã­ÂÂ´ Ã«Â¶ÂÃ¬ÂÂ Ã¬ÂÂ¤Ã­ÂÂ¨");

    if (jdRes.status === "fulfilled") setJdResult(jdRes.value);
    else setJdError(jdRes.reason.message || "Ã¬Â£Â¼Ã«ÂÂÃ¬Â£Â¼ Ã«Â¶ÂÃ¬ÂÂ Ã¬ÂÂ¤Ã­ÂÂ¨");

    if (hsRes.status === "fulfilled") setHsResult(hsRes.value);
    else setHsError(hsRes.reason.message || "Ã­ÂÂÃ¬ÂÂ¹Ã­ÂÂ Ã«Â¶ÂÃ¬ÂÂ Ã¬ÂÂ¤Ã­ÂÂ¨");

    // Ã¬ÂÂµÃ¬ÂÂ¼ ÃªÂ²ÂÃ¬Â¦Â (TP1/TP2/SL)
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
    setLoading(false);
    setProgress("");
  };

  const save = () => {
    // AI/Ã¬Â¹Â¨Ã¬Â°Â©Ã­ÂÂ´/Ã¬Â£Â¼Ã«ÂÂÃ¬Â£Â¼/Ã­ÂÂÃ¬ÂÂ¹Ã­ÂÂ Ã¬Â¤Â Ã­ÂÂÃ«ÂÂÃ«ÂÂ¼Ã«ÂÂ ÃªÂ²Â°ÃªÂ³Â¼ Ã¬ÂÂÃ¬ÂÂ¼Ã«Â©Â´ Ã¬Â ÂÃ¬ÂÂ¥ ÃªÂ°ÂÃ«ÂÂ¥
    if (!aiResult && !chimResult && !jdResult && !hsResult) return;
    // aiResultÃªÂ°Â Ã¬ÂÂÃ¬ÂÂ¼Ã«Â©Â´ baseÃ¬ÂÂ Ã¬Â¹Â¨Ã¬Â°Â©Ã­ÂÂ´/Ã¬Â£Â¼Ã«ÂÂÃ¬Â£Â¼/Ã­ÂÂÃ¬ÂÂ¹Ã­ÂÂÃ¬ÂÂÃ¬ÂÂ Ã¬Â¢ÂÃ«ÂªÂ©Ã«ÂªÂ/Ã«ÂÂ Ã¬Â§Â ÃªÂ°ÂÃ¬Â Â¸Ã¬ÂÂ´
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
      <div style={{padding:"10px 12px",background:"#eff6ff",border:"1px solid #93c5fd",borderRadius:8,fontSize:12,color:"#1d4ed8",marginBottom:10,lineHeight:1.5}}>Ã°ÂÂÂ¡ <b>6Ã¬ÂÂÃ«Â¦Â¬ Ã¬Â¢ÂÃ«ÂªÂ©Ã¬Â½ÂÃ«ÂÂ</b>Ã«Â¥Â¼ Ã¬ÂÂÃ«Â Â¥Ã­ÂÂÃ«Â©Â´ Ã¬ÂÂÃ«ÂÂÃ¬ÂÂ¼Ã«Â¡Â Ã¬Â£Â¼ÃªÂ°ÂÃÂ·Ã¬ÂÂÃªÂ¸Â Ã«ÂÂ°Ã¬ÂÂ´Ã­ÂÂ°Ã«Â¥Â¼ Ã¬Â¡Â°Ã­ÂÂÃ­ÂÂ´ Ã«Â¶ÂÃ¬ÂÂÃ­ÂÂ©Ã«ÂÂÃ«ÂÂ¤ (Ã¬Â°Â¨Ã­ÂÂ¸ Ã¬ÂÂ´Ã«Â¯Â¸Ã¬Â§Â Ã«Â¶ÂÃ­ÂÂÃ¬ÂÂ).<br/>Ã¬Â¢ÂÃ«ÂªÂ©Ã«ÂªÂÃ«Â§Â Ã¬ÂÂÃ«Â Â¥Ã­ÂÂÃ«Â©Â´ ÃªÂ¸Â°Ã¬Â¡Â´Ã¬Â²ÂÃ«ÂÂ¼ Ã¬Â°Â¨Ã­ÂÂ¸ Ã¬ÂÂ´Ã«Â¯Â¸Ã¬Â§ÂÃ«Â¥Â¼ Ã¬ÂÂÃ«Â¡ÂÃ«ÂÂÃ­ÂÂ´Ã¬ÂÂ Ã«Â¶ÂÃ¬ÂÂÃ­ÂÂ©Ã«ÂÂÃ«ÂÂ¤.</div>
        <input ref={stockNameRef} type="text" placeholder="Ã¬Â¢ÂÃ«ÂªÂ©Ã¬Â½ÂÃ«ÂÂ 6Ã¬ÂÂÃ«Â¦Â¬ (Ã¬ÂÂ: 005930) Ã«ÂÂÃ«ÂÂ Ã¬Â¢ÂÃ«ÂªÂ©Ã«ÂªÂ" onChange={(e)=>setCodeInput(e.target.value)} style={{width:"100%", padding:"10px 12px", border:"1px solid #cbd5e1", borderRadius:8, fontSize:13, marginBottom:10, fontFamily:"inherit", boxSizing:"border-box"}} />
      <div style={{display:"flex", alignItems:"center", gap:8, marginBottom:10, padding:"8px 10px", background:"#fffbeb", border:"1px solid #fde68a", borderRadius:8, fontSize:12, flexWrap:"wrap"}}>
        <span style={{fontWeight:600}}>Ã°ÂÂÂ ÃªÂ¸Â°Ã¬Â¤ÂÃ¬ÂÂ¼Ã¬ÂÂ:</span>
        <input type="date" value={backDate} onChange={(e)=>setBackDate(e.target.value)} style={{padding:"4px 8px", border:"1px solid #cbd5e1", borderRadius:6, fontSize:12, fontFamily:"inherit"}} />
        <span style={{color:"#92400e", fontSize:11}}>{backDate ? "Ã°ÂÂÂ Ã«Â°Â±Ã­ÂÂÃ¬ÂÂ¤Ã­ÂÂ¸ Ã«ÂªÂ¨Ã«ÂÂ - Ã¬ÂÂ´ Ã«ÂÂ Ã¬Â§Â ÃªÂ¸Â°Ã¬Â¤Â Ã«Â¶ÂÃ¬ÂÂ + Ã¬ÂÂµÃ¬ÂÂ¼ ÃªÂ²ÂÃ¬Â¦Â" : "(Ã«Â¹ÂÃ¬ÂÂÃ«ÂÂÃ«Â©Â´ Ã¬ÂÂ¤Ã«ÂÂ ÃªÂ¸Â°Ã¬Â¤Â Ã«Â¶ÂÃ¬ÂÂ)"}</span>
        {backDate && <button onClick={()=>{setBackDate("");setVerifyResult(null);}} style={{padding:"3px 8px", background:"#fff", border:"1px solid #cbd5e1", borderRadius:6, fontSize:11, cursor:"pointer"}}>Ã¢ÂÂ</button>}
      </div>

      <div onClick={() => fileRef.current && fileRef.current.click()}
        onDragOver={e => {e.preventDefault(); e.stopPropagation(); e.currentTarget.style.borderColor="#3b82f6"; e.currentTarget.style.background="#eff6ff"}}
        onDragLeave={e => {e.currentTarget.style.borderColor="#cbd5e1"; e.currentTarget.style.background="#f8fafc"}}
        onDrop={e => {e.preventDefault(); e.stopPropagation(); e.currentTarget.style.borderColor="#cbd5e1"; e.currentTarget.style.background="#f8fafc"; const fs = Array.from(e.dataTransfer.files).filter(f => f.type.startsWith("image/")); if (fs.length>0) handleFiles({target:{files:fs}})}}
        style={{border:"2px dashed #cbd5e1", borderRadius:14, padding: imgs.length>0 ? "14px" : "44px 14px", textAlign:"center", cursor:"pointer", background:"#f8fafc", marginBottom:14}}>
        <input ref={fileRef} type="file" accept="image/*" multiple onChange={handleFiles} style={{display:"none"}} />
        {imgs.length === 0 ? (
          <div>
            <div style={{fontSize:36, marginBottom:6}}>Ã°ÂÂÂ</div>
            <div style={{fontSize:15, fontWeight:700}}>Ã¬Â°Â¨Ã­ÂÂ¸ Ã¬ÂÂ´Ã«Â¯Â¸Ã¬Â§Â Ã¬ÂÂÃ«Â¡ÂÃ«ÂÂ</div>
            <div style={{fontSize:12, color:"#94a3b8", marginTop:2}}>Ã­ÂÂ´Ã«Â¦Â­ Ã«ÂÂÃ«ÂÂ Ã«ÂÂÃ«ÂÂÃªÂ·Â¸Ã¬ÂÂ¤Ã«ÂÂÃ«Â¡Â­ ÃÂ· Ã«ÂÂ¤Ã¬Â¤Â ÃªÂ°ÂÃ«ÂÂ¥</div>
            <div style={{fontSize:11, color:"#64748b", marginTop:6, fontWeight:600}}>AIÃ«Â¶ÂÃ¬ÂÂ + Ã¬Â¹Â¨Ã¬Â°Â©Ã­ÂÂ´ + Ã¬Â£Â¼Ã«ÂÂÃ¬Â£Â¼ 3Ã¬Â¤Â Ã«ÂÂÃ¬ÂÂ Ã¬ÂÂ¤Ã­ÂÂ</div>
          </div>
        ) : (
          <div style={{display:"flex", gap:6, flexWrap:"wrap", justifyContent:"center"}}>
            {imgs.map((img, i) => (
              <div key={i} style={{position:"relative"}}>
                <img src={"data:" + img.type + ";base64," + img.data} style={{width:100, height:66, objectFit:"cover", borderRadius:6, border:"1px solid #e2e8f0"}} />
                <button onClick={e => {e.stopPropagation(); setImgs(prev => prev.filter((_,j) => j !== i))}} style={{position:"absolute", top:-5, right:-5, width:18, height:18, borderRadius:9, border:"none", background:"#dc2626", color:"#fff", fontSize:11, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center"}}>ÃÂ</button>
              </div>
            ))}
            <div style={{width:100, height:66, borderRadius:6, border:"2px dashed #cbd5e1", display:"flex", alignItems:"center", justifyContent:"center", color:"#94a3b8", fontSize:22}}>+</div>
          </div>
        )}
      </div>

      <button onClick={analyze} disabled={(imgs.length === 0 && !/^[0-9]{6}$/.test((codeInput||"").trim())) || loading} style={{width:"100%", padding:"14px", borderRadius:10, border:"none", background: (imgs.length===0 && !/^[0-9]{6}$/.test((codeInput||"").trim())) ? "#e2e8f0" : "linear-gradient(135deg, #1e293b 0%, #0d9488 100%)", color: (imgs.length===0 && !/^[0-9]{6}$/.test((codeInput||"").trim())) ? "#94a3b8" : "#fff", fontSize:15, fontWeight:800, cursor: (imgs.length===0 && !/^[0-9]{6}$/.test((codeInput||"").trim())) ? "default" : "pointer", marginBottom:14, letterSpacing:"0.3px"}}>
        {loading ? "Ã¢ÂÂÃ¯Â¸Â Ã«Â¶ÂÃ¬ÂÂ Ã¬Â¤Â..." : "Ã°ÂÂÂ AI + Ã¬Â¹Â¨Ã¬Â°Â©Ã­ÂÂ´ + Ã¬Â£Â¼Ã«ÂÂÃ¬Â£Â¼ + Ã­ÂÂÃ¬ÂÂ¹Ã­ÂÂ 4Ã¬Â¤Â Ã«Â¶ÂÃ¬ÂÂ"}
      </button>

      {progress && <div style={{padding:10, borderRadius:8, background:"#eff6ff", border:"1px solid #bfdbfe", color:"#1e40af", fontSize:12, marginBottom:12, textAlign:"center"}}>{progress}</div>}

      {hasResult && (
        <div>
          {/* Ã­ÂÂ­ Ã­ÂÂ¤Ã«ÂÂ */}
          <div style={{display:"flex", gap:0, marginBottom:14, borderBottom:"2px solid #e2e8f0", overflowX:"auto"}}>
            <button onClick={() => setActiveTab("ai")} style={{flex:"1 0 auto", minWidth:80, padding:"12px 8px", border:"none", background:"transparent", borderBottom: activeTab==="ai" ? "3px solid #1e293b" : "3px solid transparent", marginBottom:"-2px", fontSize:12, fontWeight: activeTab==="ai" ? 800 : 600, color: activeTab==="ai" ? "#1e293b" : "#94a3b8", cursor:"pointer", fontFamily:"inherit", whiteSpace:"nowrap"}}>
              Ã°ÂÂ§Â  Ã«ÂÂ¤Ã¬ÂÂ¤Ã«Â¶ÂÃ¬ÂÂ {aiResult && <span style={{fontSize:11, color: gC(aiResult.grade), fontWeight:900, marginLeft:4}}>{aiResult.grade}</span>}
            </button>
            <button onClick={() => setActiveTab("chim")} style={{flex:"1 0 auto", minWidth:80, padding:"12px 8px", border:"none", background:"transparent", borderBottom: activeTab==="chim" ? "3px solid #7c3aed" : "3px solid transparent", marginBottom:"-2px", fontSize:12, fontWeight: activeTab==="chim" ? 800 : 600, color: activeTab==="chim" ? "#7c3aed" : "#94a3b8", cursor:"pointer", fontFamily:"inherit", whiteSpace:"nowrap"}}>
              Ã°ÂÂÂ¯ Ã¬Â¹Â¨Ã¬Â°Â©Ã­ÂÂ´ {chimResult && <span style={{fontSize:11, fontWeight:900, marginLeft:4}}>{chimResult.grade}</span>}
            </button>
            <button onClick={() => setActiveTab("jd")} style={{flex:"1 0 auto", minWidth:80, padding:"12px 8px", border:"none", background:"transparent", borderBottom: activeTab==="jd" ? "3px solid #ca8a04" : "3px solid transparent", marginBottom:"-2px", fontSize:12, fontWeight: activeTab==="jd" ? 800 : 600, color: activeTab==="jd" ? "#ca8a04" : "#94a3b8", cursor:"pointer", fontFamily:"inherit", whiteSpace:"nowrap"}}>
              Ã°ÂÂÂ Ã¬Â£Â¼Ã«ÂÂÃ¬Â£Â¼ {jdResult && <span style={{fontSize:11, fontWeight:900, marginLeft:4}}>{jdResult.grade}</span>}
            </button>
            <button onClick={() => setActiveTab("hs")} style={{flex:"1 0 auto", minWidth:80, padding:"12px 8px", border:"none", background:"transparent", borderBottom: activeTab==="hs" ? "3px solid #0d9488" : "3px solid transparent", marginBottom:"-2px", fontSize:12, fontWeight: activeTab==="hs" ? 800 : 600, color: activeTab==="hs" ? "#0d9488" : "#94a3b8", cursor:"pointer", fontFamily:"inherit", whiteSpace:"nowrap"}}>
              Ã¢ÂÂ¡ Ã­ÂÂÃ¬ÂÂ¹Ã­ÂÂ {hsResult && <span style={{fontSize:11, fontWeight:900, marginLeft:4}}>{hsResult.grade}</span>}
            </button>
          </div>

          {/* AI Ã«Â¶ÂÃ¬ÂÂ ÃªÂ²Â°ÃªÂ³Â¼ */}
          {activeTab === "ai" && (
            <div>
              {aiError && <div style={{padding:10, borderRadius:8, background:"#fef2f2", border:"1px solid #fca5a5", color:"#dc2626", fontSize:13, marginBottom:14}}>AIÃ«Â¶ÂÃ¬ÂÂ Ã¬ÂÂ¤Ã­ÂÂ¨: {aiError}</div>}
              {aiResult && (
                <div style={{borderRadius:14, border:"2px solid " + gC(aiResult.grade), overflow:"hidden", marginBottom:14}}>
                  <div style={{background: gC(aiResult.grade), padding:"14px 18px", display:"flex", justifyContent:"space-between", alignItems:"center"}}>
                    <div>
                      <div style={{fontSize:11, color:"rgba(255,255,255,0.85)", fontWeight:700, marginBottom:2}}>Ã°ÂÂ§Â  Ã«ÂÂ¤Ã¬ÂÂ¤Ã«Â¶ÂÃ¬ÂÂ v1</div>
                      <div style={{fontSize:18, fontWeight:900, color:"#fff"}}>{aiResult.name || "Ã«Â¶ÂÃ¬ÂÂ ÃªÂ²Â°ÃªÂ³Â¼"}</div>
                      <div style={{fontSize:11, color:"rgba(255,255,255,0.85)", marginTop:2}}>{aiResult.breakType} ÃÂ· {aiResult.investor} ÃÂ· {aiResult.ema50}</div>
                    </div>
                    <div style={{textAlign:"center"}}>
                      <div style={{fontSize:32, fontWeight:900, color:"#fff", lineHeight:1}}>{aiResult.grade}</div>
                      <div style={{fontSize:13, color:"rgba(255,255,255,0.85)", marginTop:3}}>{aiResult.score}Ã¬Â Â</div>
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
                    <button onClick={save} style={{width:"100%", padding:10, borderRadius:8, border:"none", background:"#dc2626", color:"#fff", fontSize:14, fontWeight:700, cursor:"pointer", marginTop:10}}>Ã¢ÂÂ Ã­ÂÂÃ¬ÂÂ¤Ã­ÂÂ Ã«Â¦Â¬Ã¬ÂÂ Ã¬Â ÂÃ¬ÂÂ¥</button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* AI Ã¬ÂÂÃ¬ÂÂ¸ Ã«Â¶ÂÃ¬ÂÂ (NEW v2) */}
          {activeTab === "ai" && aiResult && (aiResult.detailedAnalysis || aiResult.keyReasons || aiResult.technicalIndicators) && (
            <div style={{marginTop:12, padding:14, background:"#fefefe", border:"2px solid #c4b5fd", borderRadius:10, width:"100%", flexBasis:"100%", boxSizing:"border-box"}}>
              <div style={{fontSize:14, fontWeight:700, color:"#7c3aed", marginBottom:10}}>Ã°ÂÂ§Â  Ã«ÂÂ¤Ã¬ÂÂ¤Ã«Â¶ÂÃ¬ÂÂ v1 Ã¬ÂÂÃ¬ÂÂ¸</div>

              {aiResult.detailedAnalysis && (
                <div style={{marginBottom:12}}>
                  <div style={{fontSize:11, fontWeight:600, color:"#64748b", marginBottom:4}}>Ã°ÂÂÂ Ã¬Â¢ÂÃ­ÂÂ© Ã«Â¶ÂÃ¬ÂÂ</div>
                  <div style={{fontSize:13, color:"#334155", lineHeight:1.7, padding:10, background:"#f8fafc", borderRadius:6}}>{aiResult.detailedAnalysis}</div>
                </div>
              )}

              {(aiResult.confidenceScore != null || aiResult.nextDayRiseProbability != null || aiResult.recommendedWeight != null || aiResult.verdict) && (
                <div style={{display:"grid", gridTemplateColumns:"repeat(2, 1fr)", gap:8, marginBottom:12}}>
                  {aiResult.confidenceScore != null && (
                    <div style={{padding:8, background:"#f1f5f9", borderRadius:6, textAlign:"center"}}>
                      <div style={{fontSize:10, color:"#64748b"}}>Ã¬ÂÂ Ã«Â¢Â°Ã«ÂÂ</div>
                      <div style={{fontSize:16, fontWeight:700, color:"#0f172a"}}>{aiResult.confidenceScore}</div>
                    </div>
                  )}
                  {aiResult.nextDayRiseProbability != null && (
                    <div style={{padding:8, background:"#f1f5f9", borderRadius:6, textAlign:"center"}}>
                      <div style={{fontSize:10, color:"#64748b"}}>Ã¬ÂÂµÃ¬ÂÂ¼Ã¬ÂÂÃ¬ÂÂ¹Ã­ÂÂÃ«Â¥Â </div>
                      <div style={{fontSize:16, fontWeight:700, color:"#0f172a"}}>{aiResult.nextDayRiseProbability}%</div>
                    </div>
                  )}
                  {aiResult.recommendedWeight != null && (
                    <div style={{padding:8, background:"#f1f5f9", borderRadius:6, textAlign:"center"}}>
                      <div style={{fontSize:10, color:"#64748b"}}>Ã¬Â¶ÂÃ¬Â²ÂÃ«Â¹ÂÃ¬Â¤Â</div>
                      <div style={{fontSize:16, fontWeight:700, color:"#0f172a"}}>{aiResult.recommendedWeight}%</div>
                    </div>
                  )}
                  {aiResult.verdict && (
                    <div style={{padding:8, background:"#fef3c7", borderRadius:6, textAlign:"center"}}>
                      <div style={{fontSize:10, color:"#92400e"}}>Ã­ÂÂÃ¬Â Â</div>
                      <div style={{fontSize:13, fontWeight:700, color:"#78350f"}}>{aiResult.verdict}</div>
                    </div>
                  )}
                </div>
              )}

              {Array.isArray(aiResult.keyReasons) && aiResult.keyReasons.length > 0 && (
                <div style={{marginBottom:12}}>
                  <div style={{fontSize:11, fontWeight:600, color:"#059669", marginBottom:4}}>Ã¢ÂÂ Ã­ÂÂµÃ¬ÂÂ¬ Ã¬ÂÂ´Ã¬ÂÂ </div>
                  <ul style={{margin:0, paddingLeft:18, fontSize:12, color:"#334155", lineHeight:1.7}}>
                    {aiResult.keyReasons.map((r, i) => <li key={i}>{r}</li>)}
                  </ul>
                </div>
              )}

              {Array.isArray(aiResult.risks) && aiResult.risks.length > 0 && (
                <div style={{marginBottom:12}}>
                  <div style={{fontSize:11, fontWeight:600, color:"#dc2626", marginBottom:4}}>Ã¢ÂÂ Ã¯Â¸Â Ã«Â¦Â¬Ã¬ÂÂ¤Ã­ÂÂ¬</div>
                  <ul style={{margin:0, paddingLeft:18, fontSize:12, color:"#334155", lineHeight:1.7}}>
                    {aiResult.risks.map((r, i) => <li key={i}>{r}</li>)}
                  </ul>
                </div>
              )}

              {aiResult.technicalIndicators && typeof aiResult.technicalIndicators === "object" && (
                <div style={{marginBottom:12}}>
                  <div style={{fontSize:11, fontWeight:600, color:"#0284c7", marginBottom:4}}>Ã°ÂÂÂ ÃªÂ¸Â°Ã¬ÂÂ Ã¬Â Â Ã¬Â§ÂÃ­ÂÂ</div>
                  <div style={{fontSize:12, color:"#334155", lineHeight:1.7, padding:10, background:"#f0f9ff", borderRadius:6}}>
                    {aiResult.technicalIndicators.rsi && <div><b>RSI:</b> {aiResult.technicalIndicators.rsi}</div>}
                    {aiResult.technicalIndicators.macd && <div><b>MACD:</b> {aiResult.technicalIndicators.macd}</div>}
                    {aiResult.technicalIndicators.bollinger && <div><b>Ã«Â³Â¼Ã«Â¦Â°Ã¬Â Â:</b> {aiResult.technicalIndicators.bollinger}</div>}
                    {aiResult.technicalIndicators.movingAverage && <div><b>Ã¬ÂÂ´Ã­ÂÂÃ¬ÂÂ :</b> {aiResult.technicalIndicators.movingAverage}</div>}
                    {aiResult.technicalIndicators.volume && <div><b>ÃªÂ±Â°Ã«ÂÂÃ«ÂÂ:</b> {aiResult.technicalIndicators.volume}</div>}
                    {aiResult.technicalIndicators.summary && <div style={{marginTop:4, fontStyle:"italic"}}>{aiResult.technicalIndicators.summary}</div>}
                  </div>
                </div>
              )}

              {aiResult.supplyZone && typeof aiResult.supplyZone === "object" && (
                <div style={{marginBottom:12}}>
                  <div style={{fontSize:11, fontWeight:600, color:"#9333ea", marginBottom:4}}>Ã°ÂÂ§Â± Ã«Â§Â¤Ã«Â¬Â¼Ã«ÂÂ Ã«Â¶ÂÃ¬ÂÂ</div>
                  <div style={{fontSize:12, color:"#334155", lineHeight:1.7, padding:10, background:"#faf5ff", borderRadius:6}}>
                    {aiResult.supplyZone.status && <div><b>Ã¬ÂÂÃ­ÂÂ:</b> {aiResult.supplyZone.status}</div>}
                    {aiResult.supplyZone.level && <div><b>Ã«Â ÂÃ«Â²Â¨:</b> {aiResult.supplyZone.level}</div>}
                    {aiResult.supplyZone.thickness && <div><b>Ã«ÂÂÃªÂ»Â:</b> {aiResult.supplyZone.thickness}</div>}
                    {aiResult.supplyZone.breakoutQuality && <div><b>Ã«ÂÂÃ­ÂÂÃ­ÂÂÃ¬Â§Â:</b> {aiResult.supplyZone.breakoutQuality}</div>}
                    {aiResult.supplyZone.detail && <div style={{marginTop:4, fontStyle:"italic"}}>{aiResult.supplyZone.detail}</div>}
                  </div>
                </div>
              )}

              {aiResult.strategy && typeof aiResult.strategy === "object" && (
                <div style={{marginBottom:6}}>
                  <div style={{fontSize:11, fontWeight:600, color:"#ea580c", marginBottom:4}}>Ã°ÂÂÂ¯ Ã«Â§Â¤Ã«Â§Â¤ Ã¬Â ÂÃ«ÂÂµ</div>
                  <div style={{fontSize:12, color:"#334155", lineHeight:1.7, padding:10, background:"#fff7ed", borderRadius:6}}>
                    {aiResult.strategy.entry && <div><b>Ã¬Â§ÂÃ¬ÂÂ:</b> {aiResult.strategy.entry}</div>}
                    {aiResult.strategy.entryPrice && <div><b>Ã¬Â§ÂÃ¬ÂÂÃªÂ°Â:</b> {aiResult.strategy.entryPrice}</div>}
                    {aiResult.strategy.stopLoss && <div><b>Ã¬ÂÂÃ¬Â Â:</b> {aiResult.strategy.stopLoss}</div>}
                    {aiResult.strategy.tp1Price && <div><b>TP1:</b> {aiResult.strategy.tp1Price}</div>}
                    {aiResult.strategy.tp2Price && <div><b>TP2:</b> {aiResult.strategy.tp2Price}</div>}
                    {aiResult.strategy.exit && <div><b>Ã¬Â²Â­Ã¬ÂÂ°:</b> {aiResult.strategy.exit}</div>}
                    {aiResult.strategy.hold && <div><b>Ã«Â³Â´Ã¬ÂÂ :</b> {aiResult.strategy.hold}</div>}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Ã¬ÂµÂÃ¬Â¢ÂÃªÂ²Â°Ã«Â¡Â  (NEW) */}
          {/* 백테스트 익일 검증 결과 (NEW) */}
          {activeTab === "ai" && verifyResult && (
            <div style={{marginTop:14, padding:16, background:"linear-gradient(135deg,#dcfce7 0%,#bbf7d0 100%)", border:"2px solid #16a34a", borderRadius:12}}>
              <div style={{fontSize:15, fontWeight:700, color:"#14532d", marginBottom:12}}>📊 백테스트 익일 검증 결과</div>
              <div style={{display:"grid", gridTemplateColumns:"repeat(4, 1fr)", gap:8, marginBottom:10}}>
                <div style={{padding:10, background:"#fff", borderRadius:8, textAlign:"center"}}>
                  <div style={{fontSize:10, color:"#64748b"}}>진입가</div>
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
                  <div style={{fontSize:10, color:"#64748b"}}>최종 손익률</div>
                  <div style={{fontSize:18, fontWeight:800, color: (verifyResult.finalPnl >= 0) ? "#16a34a" : "#dc2626"}}>{(verifyResult.finalPnl >= 0) ? "+" : ""}{verifyResult.finalPnl}%</div>
                </div>
                <div style={{padding:10, background:"#fff", borderRadius:8, textAlign:"center"}}>
                  <div style={{fontSize:10, color:"#64748b"}}>청산일</div>
                  <div style={{fontSize:14, fontWeight:700, color:"#0f172a"}}>{verifyResult.exitDay ? (verifyResult.exitDay + "일차") : "보유 중"}</div>
                </div>
                <div style={{padding:10, background:"#fff", borderRadius:8, textAlign:"center"}}>
                  <div style={{fontSize:10, color:"#64748b"}}>청산 이유</div>
                  <div style={{fontSize:14, fontWeight:700, color:"#0f172a"}}>{verifyResult.exitReason || "보유"}</div>
                </div>
              </div>
              {Array.isArray(verifyResult.days) && verifyResult.days.length > 0 && (
                <div style={{background:"#fff", borderRadius:8, padding:10}}>
                  <div style={{fontSize:11, fontWeight:700, color:"#14532d", marginBottom:6}}>📋 일별 상세</div>
                  <div style={{display:"grid", gridTemplateColumns:"50px 1fr 1fr 1fr 1fr 80px", gap:4, fontSize:10, fontWeight:700, color:"#64748b", paddingBottom:4, borderBottom:"1px solid #e2e8f0"}}>
                    <div>날짜</div><div>고가</div><div>저가</div><div>종가</div><div>변동</div><div>이벤트</div>
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
                <div style={{fontSize:15, fontWeight:700, color:"#78350f"}}>Ã¢Â­Â 4Ã¬Â¤Â Ã«Â¶ÂÃ¬ÂÂ Ã¬Â¢ÂÃ­ÂÂ© Ã¬ÂµÂÃ¬Â¢ÂÃªÂ²Â°Ã«Â¡Â </div>
                {!finalResult && !finalLoading && (
                  <button onClick={generateFinal} disabled={!aiResult||!chimResult||!jdResult||!hsResult}
                    style={{padding:"8px 14px",background:"#f59e0b",color:"#fff",border:"none",borderRadius:8,fontSize:12,fontWeight:600,cursor:(!aiResult||!chimResult||!jdResult||!hsResult)?"not-allowed":"pointer",opacity:(!aiResult||!chimResult||!jdResult||!hsResult)?0.5:1}}>
                    Ã¢ÂÂ¡ Ã¬ÂµÂÃ¬Â¢ÂÃªÂ²Â°Ã«Â¡Â  Ã¬ÂÂÃ¬ÂÂ±
                  </button>
                )}
                {finalResult && !finalLoading && (
                  <button onClick={generateFinal}
                    style={{padding:"6px 10px",background:"transparent",color:"#78350f",border:"1px solid #f59e0b",borderRadius:6,fontSize:11,cursor:"pointer"}}>
                    Ã°ÂÂÂ Ã¬ÂÂ¬Ã¬ÂÂÃ¬ÂÂ±
                  </button>
                )}
              </div>
              {finalLoading && (<div style={{textAlign:"center",padding:24,color:"#78350f",fontSize:13}}>Ã¢ÂÂÃ¯Â¸Â 4ÃªÂ°Â Ã«Â¶ÂÃ¬ÂÂ Ã¬Â¢ÂÃ­ÂÂ© Ã¬Â¤Â... (Ã¬ÂÂÃ¬ÂÂ¥ Ã¬Â»Â¨Ã­ÂÂÃ¬ÂÂ¤Ã­ÂÂ¸ Ã«Â°ÂÃ¬ÂÂ)</div>)}
              {finalError && (<div style={{padding:10,background:"#fee2e2",color:"#991b1b",borderRadius:6,fontSize:12}}>Ã¢ÂÂ {finalError}</div>)}
              {finalResult && (
                <div>
                  <div style={{display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:8,marginBottom:12}}>
                    <div style={{padding:10,background:"#fff",borderRadius:8,textAlign:"center"}}>
                      <div style={{fontSize:10,color:"#78350f"}}>Ã¬ÂµÂÃ¬Â¢ÂÃ«ÂÂ±ÃªÂ¸Â</div>
                      <div style={{fontSize:24,fontWeight:700,color:"#78350f"}}>{finalResult.finalGrade}</div>
                    </div>
                    <div style={{padding:10,background:"#fff",borderRadius:8,textAlign:"center"}}>
                      <div style={{fontSize:10,color:"#78350f"}}>Ã­ÂÂÃ¬Â Â</div>
                      <div style={{fontSize:14,fontWeight:700,color:"#78350f",marginTop:6}}>{finalResult.verdict}</div>
                    </div>
                    <div style={{padding:10,background:"#fff",borderRadius:8,textAlign:"center",gridColumn:"span 2"}}>
                      <div style={{fontSize:10,color:"#78350f"}}>Ã¬ÂÂ Ã«Â¢Â°Ã«ÂÂ</div>
                      <div style={{fontSize:18,fontWeight:700,color:"#78350f"}}>{finalResult.confidence}/100</div>
                    </div>
                  </div>
                  {finalResult.summary && (<div style={{padding:10,background:"#fff",borderRadius:8,marginBottom:10,fontSize:13,fontWeight:600,color:"#78350f"}}>Ã°ÂÂÂ¬ {finalResult.summary}</div>)}
                  {finalResult.consensus && (<div style={{marginBottom:10}}><div style={{fontSize:11,fontWeight:600,color:"#78350f",marginBottom:4}}>Ã°ÂÂ¤Â 4ÃªÂ°Â Ã«Â¶ÂÃ¬ÂÂ Ã¬Â¢ÂÃ­ÂÂ©</div><div style={{padding:10,background:"#fff",borderRadius:6,fontSize:12,lineHeight:1.7,color:"#3f2f0a"}}>{finalResult.consensus}</div></div>)}
                  {finalResult.marketContext && (<div style={{marginBottom:10}}><div style={{fontSize:11,fontWeight:600,color:"#78350f",marginBottom:4}}>Ã°ÂÂÂ Ã¬ÂÂÃ¬ÂÂ¥ Ã¬Â»Â¨Ã­ÂÂÃ¬ÂÂ¤Ã­ÂÂ¸</div><div style={{padding:10,background:"#fff",borderRadius:6,fontSize:12,lineHeight:1.6,color:"#3f2f0a",fontStyle:"italic"}}>{finalResult.marketContext}</div></div>)}
                  {(finalResult.buyTiming || finalResult.buyStrategy) && (<div style={{marginBottom:10,padding:10,background:"#dcfce7",borderRadius:8,border:"1px solid #16a34a"}}><div style={{fontSize:12,fontWeight:600,color:"#15803d",marginBottom:6}}>Ã°ÂÂÂ¢ Ã«Â§Â¤Ã¬ÂÂ Ã¬Â ÂÃ«ÂÂµ</div>{finalResult.buyTiming && <div style={{fontSize:12,color:"#14532d",marginBottom:3}}><b>Ã­ÂÂÃ¬ÂÂ´Ã«Â°Â:</b> {finalResult.buyTiming}</div>}{finalResult.buyStrategy && <div style={{fontSize:12,color:"#14532d",marginBottom:3}}><b>Ã¬Â ÂÃ«ÂÂµ:</b> {finalResult.buyStrategy}</div>}{finalResult.addBuy && <div style={{fontSize:12,color:"#14532d"}}><b>Ã¬Â¶ÂÃªÂ°ÂÃ«Â§Â¤Ã¬ÂÂ:</b> {finalResult.addBuy}</div>}</div>)}
                  {finalResult.exitPlan && (<div style={{marginBottom:10,padding:10,background:"#fef2f2",borderRadius:8,border:"1px solid #dc2626"}}><div style={{fontSize:12,fontWeight:600,color:"#991b1b",marginBottom:6}}>Ã°ÂÂÂ´ Ã¬Â²Â­Ã¬ÂÂ° ÃªÂ³ÂÃ­ÂÂ</div>{finalResult.exitPlan.tp1 && <div style={{fontSize:12,color:"#7f1d1d",marginBottom:3}}><b>TP1:</b> {finalResult.exitPlan.tp1}</div>}{finalResult.exitPlan.tp2 && <div style={{fontSize:12,color:"#7f1d1d",marginBottom:3}}><b>TP2:</b> {finalResult.exitPlan.tp2}</div>}{finalResult.exitPlan.sl && <div style={{fontSize:12,color:"#7f1d1d",marginBottom:3}}><b>SL:</b> {finalResult.exitPlan.sl}</div>}{finalResult.exitPlan.timeStop && <div style={{fontSize:12,color:"#7f1d1d"}}><b>Ã¬ÂÂÃªÂ°Â:</b> {finalResult.exitPlan.timeStop}</div>}</div>)}
                  {finalResult.scenarios && (<div style={{marginBottom:10}}><div style={{fontSize:11,fontWeight:600,color:"#78350f",marginBottom:6}}>Ã°ÂÂÂ Ã¬ÂÂµÃ¬ÂÂ¼ Ã¬ÂÂÃ«ÂÂÃ«Â¦Â¬Ã¬ÂÂ¤Ã«Â³Â Ã«ÂÂÃ¬ÂÂ</div>{finalResult.scenarios.bullish && <div style={{padding:8,background:"#dcfce7",borderRadius:6,fontSize:11,marginBottom:4,color:"#14532d"}}><b>Ã°ÂÂÂ ÃªÂ°ÂÃ¬ÂÂ¸:</b> {finalResult.scenarios.bullish}</div>}{finalResult.scenarios.neutral && <div style={{padding:8,background:"#f3f4f6",borderRadius:6,fontSize:11,marginBottom:4,color:"#1f2937"}}><b>Ã¢ÂÂ¡Ã¯Â¸Â Ã«Â³Â´Ã­ÂÂ©:</b> {finalResult.scenarios.neutral}</div>}{finalResult.scenarios.bearish && <div style={{padding:8,background:"#fee2e2",borderRadius:6,fontSize:11,marginBottom:4,color:"#7f1d1d"}}><b>Ã°ÂÂÂ Ã¬ÂÂ½Ã¬ÂÂ¸:</b> {finalResult.scenarios.bearish}</div>}</div>)}
                  {Array.isArray(finalResult.riskFactors) && finalResult.riskFactors.length > 0 && (<div style={{marginBottom:10}}><div style={{fontSize:11,fontWeight:600,color:"#dc2626",marginBottom:4}}>Ã¢ÂÂ Ã¯Â¸Â Ã«Â¦Â¬Ã¬ÂÂ¤Ã­ÂÂ¬ Ã¬ÂÂÃ¬ÂÂ¸</div><ul style={{margin:0,paddingLeft:18,fontSize:12,color:"#3f2f0a",lineHeight:1.6}}>{finalResult.riskFactors.map((r,i)=><li key={i}>{r}</li>)}</ul></div>)}
                  {Array.isArray(finalResult.watchPoints) && finalResult.watchPoints.length > 0 && (<div><div style={{fontSize:11,fontWeight:600,color:"#0284c7",marginBottom:4}}>Ã°ÂÂÂ Ã«ÂªÂ¨Ã«ÂÂÃ­ÂÂ°Ã«Â§Â Ã­ÂÂ¬Ã¬ÂÂ¸Ã­ÂÂ¸</div><ul style={{margin:0,paddingLeft:18,fontSize:12,color:"#3f2f0a",lineHeight:1.6}}>{finalResult.watchPoints.map((r,i)=><li key={i}>{r}</li>)}</ul></div>)}
                </div>
              )}
            </div>
          )}

          {/* Ã¬Â¹Â¨Ã¬Â°Â©Ã­ÂÂ´ ÃªÂ²Â°ÃªÂ³Â¼ */}
          {activeTab === "chim" && (
            <div>
              {chimError && <div style={{padding:10, borderRadius:8, background:"#fef2f2", border:"1px solid #fca5a5", color:"#dc2626", fontSize:13, marginBottom:14}}>Ã¬Â¹Â¨Ã¬Â°Â©Ã­ÂÂ´ Ã«Â¶ÂÃ¬ÂÂ Ã¬ÂÂ¤Ã­ÂÂ¨: {chimError}</div>}
              {chimResult && <ChimchakhaeResultCard result={chimResult} stockName={stockNameRef.current ? stockNameRef.current.value : ""} />}
            </div>
          )}

          {/* Ã¬Â£Â¼Ã«ÂÂÃ¬Â£Â¼ ÃªÂ²Â°ÃªÂ³Â¼ */}
          {activeTab === "jd" && (
            <div>
              {jdError && <div style={{padding:10, borderRadius:8, background:"#fef2f2", border:"1px solid #fca5a5", color:"#dc2626", fontSize:13, marginBottom:14}}>Ã¬Â£Â¼Ã«ÂÂÃ¬Â£Â¼ Ã«Â¶ÂÃ¬ÂÂ Ã¬ÂÂ¤Ã­ÂÂ¨: {jdError}</div>}
              {jdResult && <JudojuResultCard result={jdResult} stockName={stockNameRef.current ? stockNameRef.current.value : ""} />}
            </div>
          )}

          {/* Ã­ÂÂÃ¬ÂÂ¹Ã­ÂÂ ÃªÂ²Â°ÃªÂ³Â¼ */}
          {activeTab === "hs" && (
            <div>
              {hsError && <div style={{padding:10, borderRadius:8, background:"#fef2f2", border:"1px solid #fca5a5", color:"#dc2626", fontSize:13, marginBottom:14}}>Ã­ÂÂÃ¬ÂÂ¹Ã­ÂÂ Ã«Â¶ÂÃ¬ÂÂ Ã¬ÂÂ¤Ã­ÂÂ¨: {hsError}</div>}
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
      <div style={{fontSize:40, marginBottom:10}}>Ã°ÂÂÂ</div>
      <div style={{fontSize:15, fontWeight:600}}>Ã«Â¶ÂÃ¬ÂÂ Ã­ÂÂÃ¬ÂÂ¤Ã­ÂÂ Ã«Â¦Â¬ÃªÂ°Â Ã¬ÂÂÃ¬ÂÂµÃ«ÂÂÃ«ÂÂ¤</div>
      <div style={{fontSize:13, marginTop:4}}>AIÃ«Â¶ÂÃ¬ÂÂ Ã­ÂÂ­Ã¬ÂÂÃ¬ÂÂ Ã¬Â°Â¨Ã­ÂÂ¸Ã«Â¥Â¼ Ã«Â¶ÂÃ¬ÂÂÃ­ÂÂÃ«Â©Â´ Ã¬ÂÂ¬ÃªÂ¸Â°Ã¬ÂÂ Ã¬ÂÂÃ¬ÂÂÃ«ÂÂÃ«ÂÂ¤</div>
    </div>
  );

  return (
    <div>
      <div style={{display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:10}}>
        <span style={{fontSize:13, color:"#64748b"}}>Ã¬Â´Â {h.length}ÃªÂ±Â´</span>
        <button onClick={onClear} style={{padding:"5px 10px", borderRadius:6, border:"1px solid #fca5a5", background:"#fff", color:"#dc2626", fontSize:11, fontWeight:600, cursor:"pointer"}}>Ã¬Â ÂÃ¬Â²Â´ Ã¬ÂÂ­Ã¬Â Â</button>
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
              <div style={{fontSize:11, color:"#94a3b8", marginTop:1}}>{r.date} ÃÂ· {r.score}Ã¬Â Â ÃÂ· {r.breakType || "-"} ÃÂ· {r.investor || "-"}</div>
            </div>
            <div style={{textAlign:"right", flexShrink:0, display:"flex", gap:4, flexDirection:"column", alignItems:"flex-end"}}>
              {hasChim && (
                <span style={{fontSize:10, padding:"2px 6px", borderRadius:4, background: cgC(r.chimchakhaeResult.grade) + "22", color: cgC(r.chimchakhaeResult.grade), fontWeight:800}}>
                  Ã¬Â¹Â¨ {r.chimchakhaeResult.grade}
                </span>
              )}
              {hasJd && (
                <span style={{fontSize:10, padding:"2px 6px", borderRadius:4, background: "#ca8a0422", color: "#ca8a04", fontWeight:800}}>
                  Ã¬Â£Â¼ {r.judojuResult.grade}
                </span>
              )}
              {hasHs && (
                <span style={{fontSize:10, padding:"2px 6px", borderRadius:4, background: "#0d948822", color: "#0d9488", fontWeight:800}}>
                  Ã­ÂÂ {r.haseunghoonResult.grade}
                </span>
              )}
              <div style={{fontSize:11, color:"#dc2626", fontWeight:700}}>TP{r.tp1}/{r.tp2} ÃÂ· SL{r.sl}%</div>
            </div>
            <button onClick={(e) => {e.stopPropagation(); if(window.confirm("Ã¬ÂÂ´ Ã­ÂÂ­Ã«ÂªÂ©Ã¬ÂÂ Ã¬ÂÂ­Ã¬Â ÂÃ­ÂÂ ÃªÂ¹ÂÃ¬ÂÂ?")) onDelete(i);}} style={{flexShrink:0, width:30, height:30, borderRadius:"50%", border:"1px solid #fca5a5", background:"#fff", color:"#dc2626", fontSize:13, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", padding:0}} title="Ã¬ÂÂ­Ã¬Â Â">Ã°ÂÂÂ</button>
          </div>
        );
      })}

      {/* Ã¬ÂÂÃ¬ÂÂ¸ Ã«ÂªÂ¨Ã«ÂÂ¬ */}
      {sel !== null && h[sel] && (
        <div onClick={() => setSel(null)} style={{position:"fixed", top:0, left:0, right:0, bottom:0, background:"rgba(0,0,0,0.6)", zIndex:1000, display:"flex", alignItems:"flex-start", justifyContent:"center", padding:"20px 12px", overflowY:"auto"}}>
          <div onClick={e => e.stopPropagation()} style={{background:"#fff", borderRadius:14, maxWidth:900, width:"100%", padding:0, position:"relative", marginBottom:40}}>
            <button onClick={() => setSel(null)} style={{position:"absolute", top:12, right:12, width:30, height:30, borderRadius:"50%", background:"#f1f5f9", border:"none", cursor:"pointer", fontSize:16, fontWeight:700, color:"#64748b", zIndex:2}}>Ã¢ÂÂ</button>

              {/* Ã¬ÂµÂÃ¬Â¢ÂÃªÂ²Â°Ã«Â¡Â  (Ã­ÂÂÃ¬ÂÂ¤Ã­ÂÂ Ã«Â¦Â¬) */}
              {detailTab === "ai" && (
                <div>
                  <div style={{borderRadius:14, border:"2px solid " + gC(h[sel].grade), overflow:"hidden", marginBottom:14}}>
                    <div style={{background: gC(h[sel].grade), padding:"14px 18px", display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:8}}>
                      <div style={{minWidth:0, flex:"1 1 auto"}}>
                        <div style={{fontSize:11, color:"rgba(255,255,255,0.85)", fontWeight:700, marginBottom:2}}>Ã°ÂÂ§Â  Ã«ÂÂ¤Ã¬ÂÂ¤Ã«Â¶ÂÃ¬ÂÂ v1</div>
                        <div style={{fontSize:18, fontWeight:900, color:"#fff"}}>{h[sel].name || "-"}</div>
                        <div style={{fontSize:11, color:"rgba(255,255,255,0.85)", marginTop:2}}>{h[sel].breakType} ÃÂ· {h[sel].investor} ÃÂ· {h[sel].ema50}</div>
                        <div style={{fontSize:10, color:"rgba(255,255,255,0.7)", marginTop:3}}>{h[sel].date}</div>
                      </div>
                      <div style={{textAlign:"center", flexShrink:0}}>
                        <div style={{fontSize:32, fontWeight:900, color:"#fff", lineHeight:1}}>{h[sel].grade}</div>
                        <div style={{fontSize:13, color:"rgba(255,255,255,0.85)", marginTop:3}}>{h[sel].score}Ã¬Â Â</div>
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
                    <div style={{fontSize:14, fontWeight:700, color:"#7c3aed", marginBottom:10}}>Ã°ÂÂ§Â  Ã«ÂÂ¤Ã¬ÂÂ¤Ã«Â¶ÂÃ¬ÂÂ v1 Ã¬ÂÂÃ¬ÂÂ¸</div>

                    {h[sel].detailedAnalysis && (
                      <div style={{marginBottom:12}}>
                        <div style={{fontSize:11, fontWeight:600, color:"#64748b", marginBottom:4}}>Ã°ÂÂÂ Ã¬Â¢ÂÃ­ÂÂ© Ã«Â¶ÂÃ¬ÂÂ</div>
                        <div style={{fontSize:13, color:"#334155", lineHeight:1.7, padding:10, background:"#f8fafc", borderRadius:6}}>{h[sel].detailedAnalysis}</div>
                      </div>
                    )}

                    {(h[sel].confidenceScore != null || h[sel].nextDayRiseProbability != null || h[sel].recommendedWeight != null || h[sel].verdict) && (
                      <div style={{display:"grid", gridTemplateColumns:"repeat(2, 1fr)", gap:8, marginBottom:12}}>
                        {h[sel].confidenceScore != null && (
                          <div style={{padding:8, background:"#f1f5f9", borderRadius:6, textAlign:"center"}}>
                            <div style={{fontSize:10, color:"#64748b"}}>Ã¬ÂÂ Ã«Â¢Â°Ã«ÂÂ</div>
                            <div style={{fontSize:16, fontWeight:700, color:"#0f172a"}}>{h[sel].confidenceScore}</div>
                          </div>
                        )}
                        {h[sel].nextDayRiseProbability != null && (
                          <div style={{padding:8, background:"#f1f5f9", borderRadius:6, textAlign:"center"}}>
                            <div style={{fontSize:10, color:"#64748b"}}>Ã¬ÂÂµÃ¬ÂÂ¼Ã¬ÂÂÃ¬ÂÂ¹Ã­ÂÂÃ«Â¥Â </div>
                            <div style={{fontSize:16, fontWeight:700, color:"#0f172a"}}>{h[sel].nextDayRiseProbability}%</div>
                          </div>
                        )}
                        {h[sel].recommendedWeight != null && (
                          <div style={{padding:8, background:"#f1f5f9", borderRadius:6, textAlign:"center"}}>
                            <div style={{fontSize:10, color:"#64748b"}}>Ã¬Â¶ÂÃ¬Â²ÂÃ«Â¹ÂÃ¬Â¤Â</div>
                            <div style={{fontSize:16, fontWeight:700, color:"#0f172a"}}>{h[sel].recommendedWeight}%</div>
                          </div>
                        )}
                        {h[sel].verdict && (
                          <div style={{padding:8, background:"#fef3c7", borderRadius:6, textAlign:"center"}}>
                            <div style={{fontSize:10, color:"#92400e"}}>Ã­ÂÂÃ¬Â Â</div>
                            <div style={{fontSize:13, fontWeight:700, color:"#78350f"}}>{h[sel].verdict}</div>
                          </div>
                        )}
                      </div>
                    )}

                    {Array.isArray(h[sel].keyReasons) && h[sel].keyReasons.length > 0 && (
                      <div style={{marginBottom:12}}>
                        <div style={{fontSize:11, fontWeight:600, color:"#059669", marginBottom:4}}>Ã¢ÂÂ Ã­ÂÂµÃ¬ÂÂ¬ Ã¬ÂÂ´Ã¬ÂÂ </div>
                        <ul style={{margin:0, paddingLeft:18, fontSize:12, color:"#334155", lineHeight:1.7}}>
                          {h[sel].keyReasons.map((r, i) => <li key={i}>{r}</li>)}
                        </ul>
                      </div>
                    )}

                    {Array.isArray(h[sel].risks) && h[sel].risks.length > 0 && (
                      <div style={{marginBottom:12}}>
                        <div style={{fontSize:11, fontWeight:600, color:"#dc2626", marginBottom:4}}>Ã¢ÂÂ Ã¯Â¸Â Ã«Â¦Â¬Ã¬ÂÂ¤Ã­ÂÂ¬</div>
                        <ul style={{margin:0, paddingLeft:18, fontSize:12, color:"#334155", lineHeight:1.7}}>
                          {h[sel].risks.map((r, i) => <li key={i}>{r}</li>)}
                        </ul>
                      </div>
                    )}

                    {h[sel].technicalIndicators && typeof h[sel].technicalIndicators === "object" && (
                      <div style={{marginBottom:12}}>
                        <div style={{fontSize:11, fontWeight:600, color:"#0284c7", marginBottom:4}}>Ã°ÂÂÂ ÃªÂ¸Â°Ã¬ÂÂ Ã¬Â Â Ã¬Â§ÂÃ­ÂÂ</div>
                        <div style={{fontSize:12, color:"#334155", lineHeight:1.7, padding:10, background:"#f0f9ff", borderRadius:6}}>
                          {h[sel].technicalIndicators.rsi && <div><b>RSI:</b> {h[sel].technicalIndicators.rsi}</div>}
                          {h[sel].technicalIndicators.macd && <div><b>MACD:</b> {h[sel].technicalIndicators.macd}</div>}
                          {h[sel].technicalIndicators.bollinger && <div><b>Ã«Â³Â¼Ã«Â¦Â°Ã¬Â Â:</b> {h[sel].technicalIndicators.bollinger}</div>}
                          {h[sel].technicalIndicators.movingAverage && <div><b>Ã¬ÂÂ´Ã­ÂÂÃ¬ÂÂ :</b> {h[sel].technicalIndicators.movingAverage}</div>}
                          {h[sel].technicalIndicators.volume && <div><b>ÃªÂ±Â°Ã«ÂÂÃ«ÂÂ:</b> {h[sel].technicalIndicators.volume}</div>}
                          {h[sel].technicalIndicators.summary && <div style={{marginTop:4, fontStyle:"italic"}}>{h[sel].technicalIndicators.summary}</div>}
                        </div>
                      </div>
                    )}

                    {h[sel].supplyZone && typeof h[sel].supplyZone === "object" && (
                      <div style={{marginBottom:12}}>
                        <div style={{fontSize:11, fontWeight:600, color:"#9333ea", marginBottom:4}}>Ã°ÂÂ§Â± Ã«Â§Â¤Ã«Â¬Â¼Ã«ÂÂ Ã«Â¶ÂÃ¬ÂÂ</div>
                        <div style={{fontSize:12, color:"#334155", lineHeight:1.7, padding:10, background:"#faf5ff", borderRadius:6}}>
                          {h[sel].supplyZone.status && <div><b>Ã¬ÂÂÃ­ÂÂ:</b> {h[sel].supplyZone.status}</div>}
                          {h[sel].supplyZone.level && <div><b>Ã«Â ÂÃ«Â²Â¨:</b> {h[sel].supplyZone.level}</div>}
                          {h[sel].supplyZone.thickness && <div><b>Ã«ÂÂÃªÂ»Â:</b> {h[sel].supplyZone.thickness}</div>}
                          {h[sel].supplyZone.breakoutQuality && <div><b>Ã«ÂÂÃ­ÂÂÃ­ÂÂÃ¬Â§Â:</b> {h[sel].supplyZone.breakoutQuality}</div>}
                          {h[sel].supplyZone.detail && <div style={{marginTop:4, fontStyle:"italic"}}>{h[sel].supplyZone.detail}</div>}
                        </div>
                      </div>
                    )}

                    {h[sel].strategy && typeof h[sel].strategy === "object" && (
                      <div style={{marginBottom:6}}>
                        <div style={{fontSize:11, fontWeight:600, color:"#ea580c", marginBottom:4}}>Ã°ÂÂÂ¯ Ã«Â§Â¤Ã«Â§Â¤ Ã¬Â ÂÃ«ÂÂµ</div>
                        <div style={{fontSize:12, color:"#334155", lineHeight:1.7, padding:10, background:"#fff7ed", borderRadius:6}}>
                          {h[sel].strategy.entry && <div><b>Ã¬Â§ÂÃ¬ÂÂ:</b> {h[sel].strategy.entry}</div>}
                          {h[sel].strategy.entryPrice && <div><b>Ã¬Â§ÂÃ¬ÂÂÃªÂ°Â:</b> {h[sel].strategy.entryPrice}</div>}
                          {h[sel].strategy.stopLoss && <div><b>Ã¬ÂÂÃ¬Â Â:</b> {h[sel].strategy.stopLoss}</div>}
                          {h[sel].strategy.tp1Price && <div><b>TP1:</b> {h[sel].strategy.tp1Price}</div>}
                          {h[sel].strategy.tp2Price && <div><b>TP2:</b> {h[sel].strategy.tp2Price}</div>}
                          {h[sel].strategy.exit && <div><b>Ã¬Â²Â­Ã¬ÂÂ°:</b> {h[sel].strategy.exit}</div>}
                          {h[sel].strategy.hold && <div><b>Ã«Â³Â´Ã¬ÂÂ :</b> {h[sel].strategy.hold}</div>}
                        </div>
                      </div>
                    )}
                  </div>
                )}
                          {(h[sel].chimchakhaeResult && h[sel].chimchakhaeResult.grade) || (h[sel].judojuResult && h[sel].judojuResult.grade) || (h[sel].haseunghoonResult && h[sel].haseunghoonResult.grade) ? (
              <div style={{display:"flex", borderBottom:"2px solid #e2e8f0", padding:"16px 16px 0", overflowX:"auto"}}>
                {h[sel].grade && (
                  <button onClick={() => setDetailTab("ai")} style={{flex:"1 0 auto", minWidth:80, padding:"10px 8px", border:"none", background:"transparent", borderBottom: detailTab==="ai" ? "3px solid #1e293b" : "3px solid transparent", marginBottom:"-2px", fontSize:12, fontWeight: detailTab==="ai" ? 800 : 600, color: detailTab==="ai" ? "#1e293b" : "#94a3b8", cursor:"pointer", fontFamily:"inherit", whiteSpace:"nowrap"}}>
                    Ã°ÂÂ§Â  Ã«ÂÂ¤Ã¬ÂÂ¤Ã«Â¶ÂÃ¬ÂÂ <span style={{fontSize:11, color: gC(h[sel].grade), fontWeight:900, marginLeft:4}}>{h[sel].grade}</span>
                  </button>
                )}
                {/* AI Ã¬ÂÂÃ¬ÂÂ¸ Ã«Â¶ÂÃ¬ÂÂ in Ã­ÂÂÃ¬ÂÂ¤Ã­ÂÂ Ã«Â¦Â¬ Ã«ÂªÂ¨Ã«ÂÂ¬ */}
                {detailTab === "ai" && h[sel].finalResult && typeof h[sel].finalResult === "object" && (
                <div style={{marginTop:14, padding:14, background:"linear-gradient(135deg,#fef3c7,#fde68a)", border:"2px solid #f59e0b", borderRadius:10}}>
                  <div style={{fontSize:14, fontWeight:700, color:"#78350f", marginBottom:10}}>Ã¢Â­Â 4Ã¬Â¤Â Ã«Â¶ÂÃ¬ÂÂ Ã¬Â¢ÂÃ­ÂÂ© Ã¬ÂµÂÃ¬Â¢ÂÃªÂ²Â°Ã«Â¡Â </div>
                  <div style={{display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:8,marginBottom:10}}>
                    <div style={{padding:8,background:"#fff",borderRadius:6,textAlign:"center"}}><div style={{fontSize:10,color:"#78350f"}}>Ã¬ÂµÂÃ¬Â¢ÂÃ«ÂÂ±ÃªÂ¸Â</div><div style={{fontSize:20,fontWeight:700,color:"#78350f"}}>{h[sel].finalResult.finalGrade}</div></div>
                    <div style={{padding:8,background:"#fff",borderRadius:6,textAlign:"center"}}><div style={{fontSize:10,color:"#78350f"}}>Ã­ÂÂÃ¬Â Â</div><div style={{fontSize:13,fontWeight:700,color:"#78350f",marginTop:4}}>{h[sel].finalResult.verdict}</div></div>
                  </div>
                  {h[sel].finalResult.confidence != null && (<div style={{padding:8,background:"#fff",borderRadius:6,textAlign:"center",fontSize:13,marginBottom:8}}><b>Ã¬ÂÂ Ã«Â¢Â°Ã«ÂÂ:</b> {h[sel].finalResult.confidence}/100</div>)}
                  {h[sel].finalResult.summary && <div style={{padding:8,background:"#fff",borderRadius:6,fontSize:12,fontWeight:600,color:"#78350f",marginBottom:8}}>Ã°ÂÂÂ¬ {h[sel].finalResult.summary}</div>}
                  {h[sel].finalResult.consensus && <div style={{marginBottom:8}}><div style={{fontSize:11,fontWeight:600,color:"#78350f",marginBottom:3}}>Ã°ÂÂ¤Â Ã¬Â¢ÂÃ­ÂÂ© Ã¬ÂÂÃªÂ²Â¬</div><div style={{padding:8,background:"#fff",borderRadius:6,fontSize:11,lineHeight:1.6}}>{h[sel].finalResult.consensus}</div></div>}
                  {h[sel].finalResult.marketContext && <div style={{marginBottom:8}}><div style={{fontSize:11,fontWeight:600,color:"#78350f",marginBottom:3}}>Ã°ÂÂÂ Ã¬ÂÂÃ¬ÂÂ¥ Ã¬Â»Â¨Ã­ÂÂÃ¬ÂÂ¤Ã­ÂÂ¸</div><div style={{padding:8,background:"#fff",borderRadius:6,fontSize:11,fontStyle:"italic"}}>{h[sel].finalResult.marketContext}</div></div>}
                  {(h[sel].finalResult.buyTiming || h[sel].finalResult.buyStrategy) && (<div style={{marginBottom:8,padding:8,background:"#dcfce7",borderRadius:6}}><div style={{fontSize:11,fontWeight:600,color:"#15803d",marginBottom:4}}>Ã°ÂÂÂ¢ Ã«Â§Â¤Ã¬ÂÂ Ã¬Â ÂÃ«ÂÂµ</div>{h[sel].finalResult.buyTiming && <div style={{fontSize:11,color:"#14532d"}}><b>Ã­ÂÂÃ¬ÂÂ´Ã«Â°Â:</b> {h[sel].finalResult.buyTiming}</div>}{h[sel].finalResult.buyStrategy && <div style={{fontSize:11,color:"#14532d"}}><b>Ã¬Â ÂÃ«ÂÂµ:</b> {h[sel].finalResult.buyStrategy}</div>}{h[sel].finalResult.addBuy && <div style={{fontSize:11,color:"#14532d"}}><b>Ã¬Â¶ÂÃªÂ°ÂÃ«Â§Â¤Ã¬ÂÂ:</b> {h[sel].finalResult.addBuy}</div>}</div>)}
                  {h[sel].finalResult.exitPlan && (<div style={{marginBottom:8,padding:8,background:"#fef2f2",borderRadius:6}}><div style={{fontSize:11,fontWeight:600,color:"#991b1b",marginBottom:4}}>Ã°ÂÂÂ´ Ã¬Â²Â­Ã¬ÂÂ° ÃªÂ³ÂÃ­ÂÂ</div>{h[sel].finalResult.exitPlan.tp1 && <div style={{fontSize:11,color:"#7f1d1d"}}><b>TP1:</b> {h[sel].finalResult.exitPlan.tp1}</div>}{h[sel].finalResult.exitPlan.tp2 && <div style={{fontSize:11,color:"#7f1d1d"}}><b>TP2:</b> {h[sel].finalResult.exitPlan.tp2}</div>}{h[sel].finalResult.exitPlan.sl && <div style={{fontSize:11,color:"#7f1d1d"}}><b>SL:</b> {h[sel].finalResult.exitPlan.sl}</div>}{h[sel].finalResult.exitPlan.timeStop && <div style={{fontSize:11,color:"#7f1d1d"}}><b>Ã¬ÂÂÃªÂ°Â:</b> {h[sel].finalResult.exitPlan.timeStop}</div>}</div>)}
                  {h[sel].finalResult.scenarios && (<div style={{marginBottom:8}}><div style={{fontSize:11,fontWeight:600,color:"#78350f",marginBottom:4}}>Ã°ÂÂÂ Ã¬ÂÂÃ«ÂÂÃ«Â¦Â¬Ã¬ÂÂ¤Ã«Â³Â Ã«ÂÂÃ¬ÂÂ</div>{h[sel].finalResult.scenarios.bullish && <div style={{padding:6,background:"#dcfce7",borderRadius:4,fontSize:11,marginBottom:3}}><b>Ã°ÂÂÂ ÃªÂ°ÂÃ¬ÂÂ¸:</b> {h[sel].finalResult.scenarios.bullish}</div>}{h[sel].finalResult.scenarios.neutral && <div style={{padding:6,background:"#f3f4f6",borderRadius:4,fontSize:11,marginBottom:3}}><b>Ã¢ÂÂ¡Ã¯Â¸Â Ã«Â³Â´Ã­ÂÂ©:</b> {h[sel].finalResult.scenarios.neutral}</div>}{h[sel].finalResult.scenarios.bearish && <div style={{padding:6,background:"#fee2e2",borderRadius:4,fontSize:11}}><b>Ã°ÂÂÂ Ã¬ÂÂ½Ã¬ÂÂ¸:</b> {h[sel].finalResult.scenarios.bearish}</div>}</div>)}
                  {Array.isArray(h[sel].finalResult.riskFactors) && (<div style={{marginBottom:6}}><div style={{fontSize:11,fontWeight:600,color:"#dc2626",marginBottom:3}}>Ã¢ÂÂ Ã¯Â¸Â Ã«Â¦Â¬Ã¬ÂÂ¤Ã­ÂÂ¬</div><ul style={{margin:0,paddingLeft:18,fontSize:11,lineHeight:1.5}}>{h[sel].finalResult.riskFactors.map((r,i)=><li key={i}>{r}</li>)}</ul></div>)}
                </div>
              )}

                {h[sel].chimchakhaeResult && h[sel].chimchakhaeResult.grade && (
                  <button onClick={() => setDetailTab("chim")} style={{flex:"1 0 auto", minWidth:80, padding:"10px 8px", border:"none", background:"transparent", borderBottom: detailTab==="chim" ? "3px solid #7c3aed" : "3px solid transparent", marginBottom:"-2px", fontSize:12, fontWeight: detailTab==="chim" ? 800 : 600, color: detailTab==="chim" ? "#7c3aed" : "#94a3b8", cursor:"pointer", fontFamily:"inherit", whiteSpace:"nowrap"}}>
                    Ã°ÂÂÂ¯ Ã¬Â¹Â¨Ã¬Â°Â©Ã­ÂÂ´ <span style={{fontSize:11, color: cgC(h[sel].chimchakhaeResult.grade), fontWeight:900, marginLeft:4}}>{h[sel].chimchakhaeResult.grade}</span>
                  </button>
                )}
                {h[sel].judojuResult && h[sel].judojuResult.grade && (
                  <button onClick={() => setDetailTab("jd")} style={{flex:"1 0 auto", minWidth:80, padding:"10px 8px", border:"none", background:"transparent", borderBottom: detailTab==="jd" ? "3px solid #ca8a04" : "3px solid transparent", marginBottom:"-2px", fontSize:12, fontWeight: detailTab==="jd" ? 800 : 600, color: detailTab==="jd" ? "#ca8a04" : "#94a3b8", cursor:"pointer", fontFamily:"inherit", whiteSpace:"nowrap"}}>
                    Ã°ÂÂÂ Ã¬Â£Â¼Ã«ÂÂÃ¬Â£Â¼ <span style={{fontSize:11, color: "#ca8a04", fontWeight:900, marginLeft:4}}>{h[sel].judojuResult.grade}</span>
                  </button>
                )}
                {h[sel].haseunghoonResult && h[sel].haseunghoonResult.grade && (
                  <button onClick={() => setDetailTab("hs")} style={{flex:"1 0 auto", minWidth:80, padding:"10px 8px", border:"none", background:"transparent", borderBottom: detailTab==="hs" ? "3px solid #0d9488" : "3px solid transparent", marginBottom:"-2px", fontSize:12, fontWeight: detailTab==="hs" ? 800 : 600, color: detailTab==="hs" ? "#0d9488" : "#94a3b8", cursor:"pointer", fontFamily:"inherit", whiteSpace:"nowrap"}}>
                    Ã¢ÂÂ¡ Ã­ÂÂÃ¬ÂÂ¹Ã­ÂÂ <span style={{fontSize:11, color: "#0d9488", fontWeight:900, marginLeft:4}}>{h[sel].haseunghoonResult.grade}</span>
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

function TrackTab({todaySignals}){const [data,setData]=useState(null);const [loading,setLoading]=useState(false);const [saving,setSaving]=useState(false);const [checking,setChecking]=useState(false);const [msg,setMsg]=useState(null);const load=async()=>{setLoading(true);try{const r=await fetch(TRACK_API);const j=await r.json();setData(j);}catch(e){setMsg({t:"e",v:e.message});}setLoading(false);};const saveToday=async()=>{if(!todaySignals||!todaySignals.length)return setMsg({t:"w",v:"Ã¬ÂÂ¤Ã«ÂÂ Ã­ÂÂ­Ã¬ÂÂÃ¬ÂÂ Ã¬ÂÂ¤Ã­ÂÂ¬Ã«Â¦Â¬Ã«ÂÂ Ã«Â¨Â¼Ã¬Â Â Ã¬ÂÂ¤Ã­ÂÂ"});setSaving(true);try{const r=await fetch(TRACK_API,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(todaySignals.filter(s=>s.grade!=="X").map(s=>({code:s.code,name:s.name,entry_price:s.price,rate:s.change,score:s.score,grade:s.grade,supply:s.investor,wick:s.wick,vol:s.amount,market:s.market,tp1:s.tp1,tp2:s.tp2,sl:s.sl})))});const j=await r.json();setMsg({t:j.added>0?"ok":"w",v:j.github_ok?("Ã¢ÂÂ "+j.added+"ÃªÂ±Â´ Ã¬Â ÂÃ¬ÂÂ¥ (Ã¬Â´Â "+j.total+"ÃªÂ±Â´)"):("Ã¢ÂÂ Ã¯Â¸Â GITHUB_TOKEN Ã«Â¯Â¸Ã¬ÂÂ¤Ã¬Â Â")});await load();}catch(e){setMsg({t:"e",v:e.message});}setSaving(false);};const checkOutcomes=async()=>{setChecking(true);try{const r=await fetch(TRACK_API+"?check=1&limit=15");const j=await r.json();setData(j);setMsg({t:"ok",v:j.updated+"ÃªÂ±Â´ ÃªÂ²Â°ÃªÂ³Â¼ Ã¬ÂÂÃ«ÂÂ°Ã¬ÂÂ´Ã­ÂÂ¸"});}catch(e){setMsg({t:"e",v:e.message});}setChecking(false);};useEffect(()=>{load();},[]);const RC2=r=>r==="BOTH"?"#dc2626":r==="TP1"?"#2563eb":r&&r.includes("SL")?"#dc2626":r==="OPEN"?"#d97706":"#94a3b8";const gC=g=>GI[g]?.c||"#94a3b8";const mc={ok:"#f0fdf4",w:"#fffbeb",e:"#fef2f2"};const tc={ok:"#dc2626",w:"#d97706",e:"#dc2626"};const bc={ok:"#fee2e2",w:"#fcd34d",e:"#fca5a5"};return(<div><div style={{display:"flex",gap:8,marginBottom:14,flexWrap:"wrap"}}><button onClick={saveToday} disabled={saving} style={{padding:"8px 16px",borderRadius:9,border:"none",background:saving?"#e2e8f0":"#1e293b",color:saving?"#94a3b8":"#fff",fontSize:13,fontWeight:700,cursor:saving?"default":"pointer"}}>{saving?"Ã¬Â ÂÃ¬ÂÂ¥ Ã¬Â¤Â...":"Ã°ÂÂÂ Ã¬ÂÂ¤Ã«ÂÂ Ã¬ÂÂ Ã­ÂÂ¸ Ã¬Â ÂÃ¬ÂÂ¥"}</button><button onClick={checkOutcomes} disabled={checking} style={{padding:"8px 16px",borderRadius:9,border:"1px solid #e2e8f0",background:"#fff",fontSize:13,fontWeight:700,cursor:checking?"default":"pointer",color:checking?"#94a3b8":"#1e293b"}}>{checking?"Ã¬Â²Â´Ã­ÂÂ¬ Ã¬Â¤Â...":"Ã°ÂÂÂ ÃªÂ²Â°ÃªÂ³Â¼ Ã¬Â²Â´Ã­ÂÂ¬ (KIS)"}</button><button onClick={load} style={{padding:"8px 14px",borderRadius:9,border:"1px solid #e2e8f0",background:"#fff",fontSize:13,cursor:"pointer"}}>Ã¬ÂÂÃ«Â¡ÂÃªÂ³Â Ã¬Â¹Â¨</button></div>{msg&&<div style={{padding:"9px 14px",borderRadius:8,marginBottom:12,background:mc[msg.t],color:tc[msg.t],border:"1px solid "+bc[msg.t],fontSize:13}}>{msg.v}</div>}{loading&&<div style={{textAlign:"center",padding:40,color:"#94a3b8"}}>Ã«Â¡ÂÃ«ÂÂ© Ã¬Â¤Â...</div>}{data&&!loading&&(<><div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:8,marginBottom:16}}>{[{l:"Ã¬Â ÂÃ¬Â²Â´ Ã¬ÂÂ Ã­ÂÂ¸",v:data.stats.total+"ÃªÂ±Â´",c:"#1e293b"},{l:"Ã«Â¯Â¸ÃªÂ²Â°",v:data.stats.open+"ÃªÂ±Â´",c:"#d97706"},{l:"Ã¬ÂÂ¹Ã«Â¥Â ("+data.stats.resolved+"ÃªÂ±Â´)",v:data.stats.win_rate+"%",c:"#dc2626"},{l:"Ã­ÂÂÃªÂ·Â Ã¬ÂÂÃ¬ÂÂµ",v:(data.stats.avg_profit>=0?"+":"")+data.stats.avg_profit+"%",c:data.stats.avg_profit>=0?"#dc2626":"#2563eb"}].map((x,i)=>(<div key={i} style={{textAlign:"center",padding:"10px 6px",borderRadius:10,background:"#f8fafc",border:"1px solid #e2e8f0"}}><div style={{fontSize:10,color:"#94a3b8",marginBottom:3}}>{x.l}</div><div style={{fontSize:20,fontWeight:900,color:x.c}}>{x.v}</div></div>))}</div>{!data.signals.length&&(<div style={{textAlign:"center",padding:40,color:"#94a3b8"}}><div style={{fontSize:32,marginBottom:8}}>Ã°ÂÂÂ­</div><div style={{fontSize:15,fontWeight:600}}>Ã¬Â ÂÃ¬ÂÂ¥Ã«ÂÂ Ã¬ÂÂ Ã­ÂÂ¸ Ã¬ÂÂÃ¬ÂÂ</div><div style={{fontSize:13,marginTop:4}}>Ã¬ÂÂ¤Ã«ÂÂ Ã­ÂÂ­ Ã¢ÂÂ Ã¬ÂÂ Ã­ÂÂ¸Ã¬Â ÂÃ¬ÂÂ¥ Ã«Â²ÂÃ­ÂÂ¼ Ã­ÂÂ´Ã«Â¦Â­</div>{!data.github_ok&&<div style={{marginTop:10,padding:"8px 14px",borderRadius:8,background:"#fffbeb",color:"#d97706",fontSize:12,border:"1px solid #fcd34d"}}>Ã¢ÂÂ Ã¯Â¸Â Vercel Ã­ÂÂÃªÂ²Â½Ã«Â³ÂÃ¬ÂÂ GITHUB_TOKEN Ã¬Â¶ÂÃªÂ°Â Ã­ÂÂÃ¬ÂÂ</div>}</div>)}{data.signals.map((s,i)=>{const oc=s.outcome;const rc=oc?RC2(oc.result):"#94a3b8";const pc=oc?(oc.profit>=0?"#dc2626":"#2563eb"):"#d97706";return(<div key={i} style={{display:"flex",alignItems:"center",gap:10,padding:"11px 14px",borderRadius:12,border:"1px solid #e2e8f0",marginBottom:6,background:"#fff"}}><div style={{width:38,height:38,borderRadius:9,background:gC(s.grade)+"12",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}><span style={{fontSize:16,fontWeight:900,color:gC(s.grade)}}>{s.grade}</span></div><div style={{flex:1,minWidth:0}}><div style={{display:"flex",alignItems:"center",gap:6}}><span style={{fontWeight:700,fontSize:14}}>{s.name}</span><span style={{fontSize:11,color:"#dc2626",fontWeight:700}}>+{s.rate}%</span><span style={{fontSize:10,color:"#94a3b8"}}>{s.signal_date}</span></div><div style={{fontSize:11,color:"#94a3b8",marginTop:2}}>{s.score}Ã¬Â Â ÃÂ· {s.supply} ÃÂ· {s.market}{oc&&oc.max_gain!==undefined?" ÃÂ· Ã¬ÂµÂÃ«ÂÂÃ¢ÂÂ+"+oc.max_gain+"% Ã¬ÂµÂÃ«ÂÂÃ¢ÂÂ"+oc.max_drop+"%":""}</div></div><div style={{textAlign:"right",flexShrink:0}}><div style={{fontSize:14,fontWeight:900,color:pc}}>{oc?(oc.profit>=0?"+":"")+oc.profit+"%":"Ã¢ÂÂ"}</div><div style={{padding:"1px 6px",borderRadius:5,background:rc+"15",color:rc,fontSize:11,fontWeight:700,marginTop:2}}>{oc?oc.result:"Ã«Â¯Â¸ÃªÂ²Â°"}</div></div></div>);})}</>)}</div>);}

function VerifyTab(){const [code,setCode]=useState("");const [date,setDate]=useState("");const [expRate,setExpRate]=useState("");const [result,setResult]=useState(null);const [loading,setLoading]=useState(false);const [batch,setBatch]=useState([]);const [bLoading,setBLoading]=useState(false);const verify=async()=>{if(!code||!date)return;setLoading(true);setResult(null);try{let url=PRICE_API+"?code="+code+"&date="+date;if(expRate)url+="&verify_rate="+expRate;const r=await fetch(url);setResult(await r.json());}catch(e){setResult({ok:false,error:e.message});}setLoading(false);};const SAMPLES=[{name:"Ã­ÂÂÃ¬ÂÂÃ«ÂÂÃ¬Â§ÂÃ­ÂÂ",code:"078350",date:"26-03-27",rate:20.8},{name:"Ã­ÂÂÃ¬ÂÂ",code:"044490",date:"26-03-20",rate:26.5},{name:"Ã«ÂÂ¤Ã­ÂÂ¨Ã¬ÂÂ¤",code:"033640",date:"26-03-20",rate:17.1},{name:"Ã«Â°ÂÃ¬ÂÂ´Ã¬ÂÂ¤Ã«ÂÂ¤Ã¬ÂÂ¸",code:"314930",date:"26-03-18",rate:15.0},{name:"Ã¬ÂÂ±Ã¬ÂÂ°Ã­ÂÂÃ¬ÂÂ´Ã­ÂÂ",code:"015750",date:"26-03-10",rate:22.1}];const runBatch=async()=>{setBLoading(true);setBatch([]);const res=[];for(const s of SAMPLES){try{const r=await fetch(PRICE_API+"?code="+s.code+"&date="+s.date+"&verify_rate="+s.rate);const j=await r.json();res.push({...s,j});}catch(e){res.push({...s,j:{ok:false,error:e.message}});}setBatch([...res]);await new Promise(r=>setTimeout(r,400));}setBLoading(false);};const SC=s=>s==="Ã¬Â ÂÃ­ÂÂ"||s==="OK"?"#dc2626":s==="ÃªÂ·Â¼Ã¬ÂÂ¬"||s==="NEAR"?"#d97706":"#dc2626";return(<div><div style={{padding:"12px 16px",borderRadius:10,background:"#eff6ff",border:"1px solid #93c5fd",fontSize:13,color:"#1d4ed8",marginBottom:16}}>KIS APIÃ«Â¡Â Ã¬ÂÂ¤Ã¬Â Â Ã¬Â£Â¼ÃªÂ°Â Ã¬Â¡Â°Ã­ÂÂ Ã¢ÂÂ data.js ÃªÂ°ÂÃªÂ³Â¼ Ã«Â¹ÂÃªÂµÂ. <b>Ã¬Â¢ÂÃ«ÂªÂ©Ã¬Â½ÂÃ«ÂÂ</b>Ã«ÂÂ Ã«ÂÂ¤Ã¬ÂÂ´Ã«Â²ÂÃªÂ¸ÂÃ¬ÂÂµ/HTSÃ¬ÂÂÃ¬ÂÂ Ã­ÂÂÃ¬ÂÂ¸.</div><div style={{background:"#f8fafc",borderRadius:12,padding:16,marginBottom:16,border:"1px solid #e2e8f0"}}><div style={{fontWeight:700,fontSize:14,marginBottom:12}}>Ã«ÂÂ¨ÃªÂ±Â´ ÃªÂ²ÂÃ¬Â¦Â</div><div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8,marginBottom:10}}>{[{l:"Ã¬Â¢ÂÃ«ÂªÂ©Ã¬Â½ÂÃ«ÂÂ",v:code,s:setCode,p:"Ã¬ÂÂ: 078350"},{l:"Ã«ÂÂ Ã¬Â§Â(YY-MM-DD)",v:date,s:setDate,p:"Ã¬ÂÂ: 26-03-27"},{l:"data.js Ã«ÂÂ±Ã«ÂÂ½Ã«Â¥Â (%)",v:expRate,s:setExpRate,p:"Ã¬ÂÂ: 20.8"}].map((f,i)=>(<div key={i}><div style={{fontSize:11,color:"#64748b",marginBottom:4}}>{f.l}</div><input value={f.v} onChange={e=>f.s(e.target.value)} placeholder={f.p} style={{width:"100%",padding:"8px 10px",borderRadius:8,border:"1px solid #e2e8f0",fontSize:13,background:"#fff",outline:"none"}}/></div>))}</div><button onClick={verify} disabled={loading||!code||!date} style={{padding:"9px 20px",borderRadius:9,border:"none",background:(!code||!date)?"#e2e8f0":"#1e293b",color:(!code||!date)?"#94a3b8":"#fff",fontSize:13,fontWeight:700,cursor:(!code||!date)?"default":"pointer"}}>{loading?"Ã¬Â¡Â°Ã­ÂÂ Ã¬Â¤Â...":"Ã°ÂÂÂ ÃªÂ²ÂÃ¬Â¦Â"}</button></div>{result&&(<div style={{borderRadius:12,border:"1px solid",marginBottom:16,borderColor:result.ok?"#93c5fd":"#fca5a5",background:result.ok?"#eff6ff":"#fef2f2",padding:16}}>{!result.ok&&<div style={{color:"#dc2626",fontWeight:700}}>Ã¬ÂÂ¤Ã«Â¥Â: {result.kis_error||result.error}</div>}{result.ok&&(<><div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}><div><span style={{fontSize:17,fontWeight:900}}>{result.name}</span><span style={{fontSize:12,color:"#64748b",marginLeft:8}}>{result.market}</span></div>{result.verification&&<div style={{padding:"4px 12px",borderRadius:8,background:SC(result.verification.status)+"15",color:SC(result.verification.status),fontWeight:700,fontSize:13}}>{result.verification.status} (ÃÂ±{result.verification.diff}%p)</div>}</div>{result.target_row&&(<div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:6}}>{[{l:"Ã¬ÂÂ¤Ã¬Â Â Ã«ÂÂ±Ã«ÂÂ½Ã«Â¥Â ",v:(result.target_row.rate>=0?"+":"")+result.target_row.rate+"%",big:true},{l:"data.js Ã«ÂÂ±Ã«ÂÂ½Ã«Â¥Â ",v:expRate?"+"+expRate+"%":"Ã¢ÂÂ"},{l:"Ã¬Â¢ÂÃªÂ°Â",v:result.target_row.close?.toLocaleString()+"Ã¬ÂÂ"},{l:"ÃªÂ±Â°Ã«ÂÂÃ«ÂÂ",v:result.target_row.vol?.toLocaleString()}].map((x,i)=>(<div key={i} style={{textAlign:"center",padding:"8px 6px",background:"#fff",borderRadius:8}}><div style={{fontSize:10,color:"#94a3b8"}}>{x.l}</div><div style={{fontSize:x.big?18:14,fontWeight:700,color:x.big?"#dc2626":"#1e293b"}}>{x.v}</div></div>))}</div>)}</>)}</div>)}<div style={{background:"#f8fafc",borderRadius:12,padding:16,border:"1px solid #e2e8f0"}}><div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}><div style={{fontWeight:700,fontSize:14}}>Ã¬ÂÂÃ­ÂÂ Ã¬ÂÂ¼ÃªÂ´ÂÃªÂ²ÂÃ¬Â¦Â (5ÃªÂ±Â´)</div><button onClick={runBatch} disabled={bLoading} style={{padding:"7px 16px",borderRadius:8,border:"1px solid #e2e8f0",background:"#fff",fontSize:12,fontWeight:700,cursor:bLoading?"default":"pointer",color:bLoading?"#94a3b8":"#1e293b"}}>{bLoading?"ÃªÂ²ÂÃ¬Â¦Â Ã¬Â¤Â...":"Ã¢ÂÂ¶ Ã¬ÂÂ¤Ã­ÂÂ"}</button></div>{batch.map((r,i)=>{const vr=r.j?.verification;return(<div key={i} onClick={()=>setSel(sel===i?null:i)} style={{cursor:"pointer",display:"flex",alignItems:"center",gap:10,padding:"9px 10px",borderRadius:9,border:"1px solid #e2e8f0",marginBottom:5,background:"#fff"}}><div style={{flex:1}}><span style={{fontWeight:700,fontSize:13}}>{r.name}</span><span style={{fontSize:11,color:"#94a3b8",marginLeft:6}}>{r.date} ÃÂ· data.js +{r.rate}%</span></div>{!r.j?.ok&&<span style={{color:"#dc2626",fontSize:12}}>Ã¬ÂÂ¤Ã«Â¥Â</span>}{r.j?.ok&&!vr&&<span style={{color:"#94a3b8",fontSize:12}}>Ã«ÂÂ Ã¬Â§ÂÃ¬ÂÂÃ¬ÂÂ</span>}{r.j?.ok&&vr&&(<div style={{display:"flex",gap:8,alignItems:"center"}}><span style={{fontSize:13,color:"#dc2626"}}>Ã¬ÂÂ¤Ã¬Â Â {(vr.actual_rate>=0?"+":"")+vr.actual_rate}%</span><span style={{padding:"2px 8px",borderRadius:6,fontSize:11,fontWeight:700,background:SC(vr.status)+"15",color:SC(vr.status)}}>{vr.status} ÃÂ±{vr.diff}%p</span></div>)}</div>);})}{!batch.length&&!bLoading&&<div style={{color:"#94a3b8",fontSize:13,textAlign:"center",padding:"10px 0"}}>Ã¬ÂÂ¤Ã­ÂÂ Ã«Â²ÂÃ­ÂÂ¼ Ã­ÂÂ´Ã«Â¦Â­ Ã¬ÂÂ KIS API Ã¬ÂÂ¤ÃªÂ²ÂÃ¬Â¦Â</div>}</div></div>);}

export default function App(){
  const [page,setPage]=useState("today");const [detailModal,setDetailModal]=useState(null);const showFromD=(r)=>setDetailModal({name:r.n,date:r.d,market:r.m,total:r.v1Total,grade:r.v1Grade,sections:{supply:{score:r.v1Supply,max:25},breakout:{score:r.v1Breakout,max:25},momentum:{score:r.v1Momentum,max:20},sectorMaterial:{score:r.v1Sm,max:15},accumulation:{score:r.v1Acc,max:15}}});
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
        <div style={{marginBottom:16}}><h1 style={{fontSize:26,fontWeight:900,letterSpacing:"-0.5px",margin:0}}>NEO-SCORE</h1><p style={{fontSize:12,color:"#94a3b8",margin:"2px 0 0"}}>Ã¬Â¢ÂÃªÂ°ÂÃ«ÂÂÃ­ÂÂÃ«Â§Â¤Ã«Â§Â¤ ÃÂ· S/A/B/X ÃÂ· AIÃ¬Â°Â¨Ã­ÂÂ¸Ã«Â¶ÂÃ¬ÂÂ ÃÂ· Ã¬ÂÂ¤Ã¬ÂÂÃªÂ°ÂÃ¬ÂÂ¤Ã­ÂÂ¬Ã«Â¦Â¬Ã«ÂÂ ÃÂ· Ã¬ÂÂ Ã­ÂÂ¸Ã¬Â¶ÂÃ¬Â Â</p></div>
        {page==="today"&&<TodaySignals onSignalsLoaded={setTodaySignals}/>}
        {page==="db"&&<SignalDB/>}
        {page==="cctoday"&&<ChimchakhaeToday apiUrl={API_URL}/>}
        {page==="jdtoday"&&<JudojuToday apiUrl={API_URL}/>}
        {page==="hstoday"&&<HaseunghoonToday apiUrl={API_URL}/>}
        {page==="ccdb"&&<ChimchakhaeDB onRowClick={showFromD}/>}
        {page==="jddb"&&<JudojuDB onRowClick={showFromD}/>}
        {page==="hsdb"&&<HaseunghoonDB onRowClick={showFromD}/>}
        {page==="ai"&&<AIAnalysis onSave={saveHistory}/>}
        {page==="history"&&<History items={history} onClear={clearHistory} onDelete={deleteHistoryItem}/>}
        {page==="track"&&<TrackTab todaySignals={todaySignals}/>}
        {page==="verify"&&<VerifyTab/>}{detailModal&&<NeoAnalysisDetailModal result={detailModal} onClose={()=>setDetailModal(null)}/>}
      </div>
      <div style={{position:"fixed",bottom:0,left:0,right:0,background:"#fff",borderTop:"1px solid #e2e8f0",display:"flex",justifyContent:"center",zIndex:100}}>
        <div style={{display:"flex",maxWidth:1080,width:"100%",overflowX:"auto"}}>
          {[{id:"today",label:"Ã«ÂÂ¤Ã¬ÂÂ¤Ã¬ÂÂ¤Ã«ÂÂ",icon:"Ã°ÂÂÂ¥"},{id:"db",label:"Ã«ÂÂ¤Ã¬ÂÂ¤Ã¬ÂÂ¤Ã¬Â½ÂÃ¬ÂÂ´",icon:"Ã°ÂÂÂ¯"},{id:"ai",label:"Ã«ÂÂ¤Ã¬ÂÂ¤ AiÃ«Â¶ÂÃ¬ÂÂ",icon:"Ã°ÂÂ¤Â"},{id:"history",label:"Ã­ÂÂÃ¬ÂÂ¤Ã­ÂÂ Ã«Â¦Â¬",icon:"Ã°ÂÂÂ"}].map(t=>(
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
