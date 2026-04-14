import { useState, useMemo } from "react";
import {R} from "./data.js";

const D=R.map(r=>({n:r[0],d:"20"+r[1],m:r[2],ch:r[3],mc:r[4],iv:r[5],sc:r[6],g:r[7],bd:r[8],wk:r[9],am:r[10],pk:r[11],dd:r[12],tp1:r[13],tp2:r[14],sl:r[15],h1:r[16],h2:r[17],t:r[18],r:r[19],hd1:r[20],hd2:r[21],etf:r[22],gp:r[23],bt:r[24],bs:r[25],vc:r[26],ema:r[27]}));
const XN=1061;
const GI={S:{c:"#dc2626",bg:"#fef2f2",bd:"#fca5a5"},A:{c:"#2563eb",bg:"#eff6ff",bd:"#93c5fd"},B:{c:"#d97706",bg:"#fffbeb",bd:"#fcd34d"}};
const RC=r=>r==="BOTH"?"#059669":r==="TP1"?"#2563eb":r.includes("SL")?"#dc2626":"#94a3b8";
const RL=r=>r==="BOTH"?"✓":r==="TP1"?"1차":r==="SL"?"SL":r==="SL2"?"SL2":"TO";
const BL=b=>b==="ATH"?"사상최고":b==="52W"?"52주":b==="120D"?"120일":"비신고";
const BC=b=>b==="ATH"?"#dc2626":b==="52W"?"#2563eb":b==="120D"?"#d97706":"#94a3b8";

export default function App(){
  const [tab,setTab]=useState("S");
  const [srt,setSrt]=useState({c:"d",d:"desc"});
  const [open,setOpen]=useState(null);
  const [pg,setPg]=useState(0);
  const PP=30;

  const st=useMemo(()=>{
    const r={};
    ["S","A","B"].forEach(g=>{
      const d=D.filter(x=>x.g===g),w=d.filter(x=>x.t>0),sl=d.filter(x=>x.r.includes("SL")),bo=d.filter(x=>x.r==="BOTH");
      const avg=d.length?(d.reduce((s,x)=>s+x.t,0)/d.length):0;
      r[g]={n:d.length,avg:avg.toFixed(2),wr:d.length?Math.round(w.length/d.length*100):0,
        cum:Math.round(d.reduce((s,x)=>s+x.t,0)),slc:sl.length,slr:d.length?Math.round(sl.length/d.length*100):0,
        boc:bo.length,bor:d.length?Math.round(bo.length/d.length*100):0}
    });
    return r;
  },[]);

  const fl=useMemo(()=>{
    let d=D.filter(r=>r.g===tab);
    return[...d].sort((a,b)=>{
      const av=a[srt.c],bv=b[srt.c];
      if(typeof av==="number")return srt.d==="asc"?av-bv:bv-av;
      return srt.d==="asc"?String(av).localeCompare(String(bv)):String(bv).localeCompare(String(av));
    });
  },[tab,srt]);

  const pd=fl.slice(pg*PP,(pg+1)*PP),mx=Math.ceil(fl.length/PP)-1;
  const ds=c=>setSrt(p=>p.c===c?{c,d:p.d==="asc"?"desc":"asc"}:{c,d:"desc"});

  return(
    <div style={{background:"#fff",minHeight:"100vh",fontFamily:"-apple-system,'Pretendard',sans-serif",color:"#1e293b",fontSize:15}}>
      <link href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/static/pretendard.css" rel="stylesheet"/>
      <div style={{maxWidth:920,margin:"0 auto",padding:"28px 16px"}}>

        <div style={{marginBottom:24}}>
          <h1 style={{fontSize:30,fontWeight:900,marginBottom:2,letterSpacing:"-0.5px"}}>NEO-SCORE</h1>
          <p style={{fontSize:14,color:"#94a3b8",lineHeight:1.5}}>
            종가돌파매매 · 10~29% · 시총3천억↑ · 외인/기관 · 50억↑ · 돌파유형+EMA · 2020~2026
          </p>
        </div>

        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(155px,1fr))",gap:10,marginBottom:22}}>
          {["S","A","B"].map(g=>{const i=GI[g],s=st[g];return(
            <div key={g} onClick={()=>{setTab(g);setPg(0);setOpen(null)}} style={{background:tab===g?i.c:i.bg,borderRadius:14,padding:"16px 18px",cursor:"pointer",transition:"all .15s",border:tab===g?"none":"0.5px solid "+i.bd}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
                <span style={{fontSize:30,fontWeight:900,color:tab===g?"#fff":i.c}}>{g}</span>
                <span style={{fontSize:11,padding:"3px 8px",borderRadius:6,background:tab===g?"rgba(255,255,255,0.25)":i.c+"15",color:tab===g?"#fff":i.c,fontWeight:600}}>
                  {g==="S"||g==="A"?"TP15/50":g==="B"?"TP12/50":""}
                </span>
              </div>
              <div style={{fontSize:26,fontWeight:900,color:tab===g?"#fff":i.c,marginTop:2}}>{s.n}<span style={{fontSize:12,fontWeight:400}}>건</span></div>
              <div style={{fontSize:13,color:tab===g?"rgba(255,255,255,0.85)":"#64748b",marginTop:4}}>
                +{s.avg}%/건 · 승률 <strong>{s.wr}%</strong> · 누적 +{s.cum}%
              </div>
              <div style={{fontSize:12,color:tab===g?"rgba(255,255,255,0.65)":"#94a3b8",marginTop:2}}>
                손절{s.slr}% · 양쪽{s.bor}% · SL13%
              </div>
            </div>
          )})}
          <div style={{background:"#f1f5f9",borderRadius:14,padding:"16px 18px"}}>
            <span style={{fontSize:30,fontWeight:900,color:"#94a3b8"}}>X</span>
            <div style={{fontSize:26,fontWeight:900,color:"#94a3b8",marginTop:2}}>{XN}<span style={{fontSize:12,fontWeight:400}}>건</span></div>
            <div style={{fontSize:13,color:"#94a3b8",marginTop:4}}>매수금지</div>
          </div>
        </div>

        <div style={{borderRadius:14,border:"1px solid #e2e8f0",overflow:"hidden"}}>
          <div style={{overflowX:"auto",WebkitOverflowScrolling:"touch"}}>
            <table style={{width:"100%",minWidth:800,borderCollapse:"collapse",fontSize:14}}>
              <thead><tr style={{background:"#f8fafc"}}>
                {[{k:"d",l:"날짜"},{k:"n",l:"종목"},{k:"ch",l:"등락"},{k:"bt",l:"돌파"},{k:"iv",l:"수급"},{k:"sc",l:"NEO"},{k:"t",l:"수익"},{k:"r",l:""},{k:"ema",l:"EMA"}].map(h=>(
                  <th key={h.k} onClick={()=>ds(h.k)} style={{padding:"10px 6px",textAlign:h.k==="n"?"left":"center",fontWeight:600,fontSize:12,color:"#94a3b8",cursor:"pointer",borderBottom:"2px solid #e2e8f0",whiteSpace:"nowrap",position:"sticky",top:0,background:"#f8fafc",zIndex:1,userSelect:"none"}}>
                    {h.l}{srt.c===h.k?(srt.d==="asc"?" ↑":" ↓"):""}
                  </th>
                ))}
              </tr></thead>
              <tbody>
                {pd.map((r,i)=>{
                  const isO=open===pg*PP+i,gi=GI[r.g];
                  return[
                    <tr key={"r"+i} onClick={()=>setOpen(isO?null:pg*PP+i)} style={{cursor:"pointer",borderBottom:"1px solid #f1f5f9",background:isO?gi.bg:"#fff",transition:"background .1s"}}>
                      <td style={{padding:"9px 6px",textAlign:"center",fontSize:12,color:"#94a3b8"}}>{r.d.slice(2)}</td>
                      <td style={{padding:"9px 6px",fontWeight:700,fontSize:15,maxWidth:140,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{r.n}</td>
                      <td style={{padding:"9px 6px",textAlign:"center",fontWeight:700,color:"#059669",fontSize:14}}>+{r.ch}%</td>
                      <td style={{padding:"9px 6px",textAlign:"center"}}><span style={{fontSize:11,padding:"2px 7px",borderRadius:4,background:BC(r.bt)+"12",color:BC(r.bt),fontWeight:600}}>{BL(r.bt)}</span></td>
                      <td style={{padding:"9px 6px",textAlign:"center",fontSize:13,fontWeight:600,color:r.iv==="기+외"?"#7c3aed":r.iv==="외인"?"#2563eb":"#94a3b8"}}>{r.iv}</td>
                      <td style={{padding:"9px 6px",textAlign:"center"}}><span style={{background:gi.c+"12",color:gi.c,padding:"2px 9px",borderRadius:20,fontWeight:800,fontSize:14}}>{r.sc}</span></td>
                      <td style={{padding:"9px 6px",textAlign:"center",fontWeight:800,fontSize:15,color:r.t>0?"#059669":"#dc2626"}}>{r.t>0?"+":""}{r.t}%</td>
                      <td style={{padding:"9px 6px",textAlign:"center"}}><span style={{padding:"2px 6px",borderRadius:4,fontSize:11,fontWeight:700,background:RC(r.r)+"12",color:RC(r.r)}}>{RL(r.r)}</span></td>
                      <td style={{padding:"9px 6px",textAlign:"center"}}><span style={{fontSize:12,color:r.ema?"#059669":"#dc2626"}}>{r.ema?"▲":"▼"}</span></td>
                    </tr>,
                    isO && (
                      <tr key={"d"+i}><td colSpan={9} style={{padding:0}}>
                        <div style={{padding:"16px 20px",background:gi.bg,borderBottom:"2px solid "+gi.bd}}>
                          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(88px,1fr))",gap:6,marginBottom:12}}>
                            {[
                              {l:"시총",v:r.mc},{l:"몸통",v:r.bd+"%"},{l:"윗꼬리",v:r.wk+"%"},
                              {l:"갱",v:(r.gp>0?"+":"")+r.gp+"%"},{l:"거래대금",v:r.am+"억"},
                              {l:"최대↑",v:"+"+r.pk+"%",c:"#059669"},{l:"최대↓",v:r.dd+"%",c:"#dc2626"},
                              {l:"돌파강도",v:"+"+r.bs+"%"},{l:"매물대",v:r.vc+"%"},
                              {l:"소요일",v:r.hd1+"/"+r.hd2}
                            ].map((x,j)=>(
                              <div key={j} style={{background:"#fff",borderRadius:8,padding:"6px 8px"}}>
                                <div style={{fontSize:11,color:"#94a3b8"}}>{x.l}</div>
                                <div style={{fontSize:15,fontWeight:700,color:x.c||"#1e293b"}}>{x.v}</div>
                              </div>
                            ))}
                          </div>
                          <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:6}}>
                            {[
                              {l:"1차(50%)",v:"+"+r.tp1+"%",rv:r.h1,c:"#059669"},
                              {l:"2차(50%)",v:"+"+r.tp2+"%",rv:r.h2,c:"#059669"},
                              {l:"손절",v:"-"+r.sl+"%",rv:r.t,c:"#dc2626"}
                            ].map((x,j)=>(
                              <div key={j} style={{background:"#fff",borderRadius:8,padding:10,textAlign:"center"}}>
                                <div style={{fontSize:11,color:"#94a3b8"}}>{x.l}</div>
                                <div style={{fontSize:22,fontWeight:900,color:x.c}}>{x.v}</div>
                                <div style={{fontSize:13,color:"#64748b"}}>실제: {x.rv>0?"+":""}{x.rv}%</div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </td></tr>
                    )
                  ];
                })}
              </tbody>
            </table>
          </div>
        </div>

        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginTop:12,padding:"0 4px"}}>
          <span style={{fontSize:13,color:"#94a3b8"}}>{fl.length}건 중 {pg*PP+1}~{Math.min((pg+1)*PP,fl.length)}</span>
          <div style={{display:"flex",gap:4,alignItems:"center"}}>
            <button onClick={()=>setPg(Math.max(0,pg-1))} disabled={pg===0} style={{padding:"6px 14px",borderRadius:8,border:"1px solid #e2e8f0",background:"#fff",fontSize:14,fontWeight:700,cursor:pg===0?"default":"pointer",color:pg===0?"#e2e8f0":"#1e293b"}}>←</button>
            <span style={{padding:"6px 10px",fontSize:14,color:"#64748b",minWidth:60,textAlign:"center"}}>{pg+1} / {mx+1}</span>
            <button onClick={()=>setPg(Math.min(mx,pg+1))} disabled={pg>=mx} style={{padding:"6px 14px",borderRadius:8,border:"1px solid #e2e8f0",background:"#fff",fontSize:14,fontWeight:700,cursor:pg>=mx?"default":"pointer",color:pg>=mx?"#e2e8f0":"#1e293b"}}>→</button>
          </div>
        </div>

        <div style={{marginTop:24,padding:18,borderRadius:14,background:"#f8fafc",border:"1px solid #e2e8f0",fontSize:14,color:"#64748b",lineHeight:1.9}}>
          <div style={{fontSize:17,fontWeight:800,color:"#1e293b",marginBottom:10}}>NEO-SCORE 스코어링</div>
          <strong style={{color:"#059669"}}>가점:</strong> 기관+외인(+3) · 외인(+2) · 윗꼬리0.5%↓(+2) 2%↓(+1) · 거래대금200억↓(+2) 500억↓(+1) · 등락25%+(+2) 20%+(+1) · 코스닥(+1) · 사상최고가(+1) · 소폭돌파0-3%(+2) · 매물대돌파(+1)<br/>
          <strong style={{color:"#dc2626"}}>감점:</strong> 윗꼬리7%+(-1) · 1500억+(-1) · ETF(-3) · 초강력돌파15%+(-1)<br/><br/>
          <strong>S(9+):</strong> TP15/50 SL13 · <strong>A(7-8):</strong> TP15/50 SL13 · <strong>B(5-6):</strong> TP12/50 SL13 · <strong>X(4↓):</strong> 매수금지<br/>
          <span style={{fontSize:13,color:"#94a3b8"}}>EMA50▲=기본비중 / EMA50▼=비중축소 · 손절 13% 통일 · 20일 타임아웃</span>
        </div>

      </div>
    </div>
  );
}
