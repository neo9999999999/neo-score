import { useState, useMemo, useRef, useCallback } from "react";
import {R} from "./data.js";

const D=R.map(r=>({n:r[0],d:"20"+r[1],m:r[2],ch:r[3],mc:r[4],iv:r[5],sc:r[6],g:r[7],bd:r[8],wk:r[9],am:r[10],pk:r[11],dd:r[12],tp1:r[13],tp2:r[14],sl:r[15],h1:r[16],h2:r[17],t:r[18],r:r[19],hd1:r[20],hd2:r[21],etf:r[22],gp:r[23],bt:r[24],bs:r[25],vc:r[26],ema:r[27]}));
const XN=1061;
const GI={S:{c:"#dc2626",bg:"#fef2f2",bd:"#fca5a5"},A:{c:"#2563eb",bg:"#eff6ff",bd:"#93c5fd"},B:{c:"#d97706",bg:"#fffbeb",bd:"#fcd34d"}};
const RC=r=>r==="BOTH"?"#059669":r==="TP1"?"#2563eb":r.includes("SL")?"#dc2626":"#94a3b8";
const RL=r=>r==="BOTH"?"✓":r==="TP1"?"1차":r==="SL"?"SL":r==="SL2"?"SL2":"TO";
const BL=b=>b==="ATH"?"사상최고":b==="52W"?"52주":b==="120D"?"120일":"비신고";
const BC=b=>b==="ATH"?"#dc2626":b==="52W"?"#2563eb":b==="120D"?"#d97706":"#94a3b8";

const SYS_PROMPT=`당신은 종가돌파매매 전문 AI 분석가입니다. 차트 이미지를 분석하여 NEO-SCORE 등급을 판정합니다.\n\n## 분석 항목 (14점 스케일)\n가점: 기관+외인동시(+3) · 외인만(+2) · 윗꼬리0.5%이하(+2)/2%이하(+1) · 거래대금200억이하(+2)/500억이하(+1) · 등락률25%+(+2)/20%+(+1) · 코스닥(+1) · 사상최고가(+1) · 소폭돌파0-3%(+2) · 매물대돌파(+1)\n감점: 윗꼬리7%+(-1) · 1500억+(-1) · ETF(-3) · 초강력돌파15%+(-1)\n\n## 등급\nS(9+): TP15/50 SL13 풀사이즈 | A(7-8): TP15/50 SL13 기본 | B(5-6): TP12/50 SL13 소량 | X(4이하): 매수금지\n\n## 응답 형식 (반드시 JSON)\n{"name":"종목명","grade":"S/A/B/X","score":점수,"change":등락률,"upperWick":윗꼬리퍼센트,"amount":거래대금억,"investor":"기관+외인/외인/기관","breakType":"ATH/52W/120D","ema50":"상승/하락","tp1":15,"tp2":50,"sl":13,"summary":"2줄 요약","details":[{"item":"항목명","point":점수,"reason":"이유"}]}`;

function SignalDB(){
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
    <div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(150px,1fr))",gap:10,marginBottom:22}}>
        {["S","A","B"].map(g=>{const i=GI[g],s=st[g];return(
          <div key={g} onClick={()=>{setTab(g);setPg(0);setOpen(null)}} style={{background:tab===g?i.c:i.bg,borderRadius:14,padding:"14px 16px",cursor:"pointer",transition:"all .15s",border:tab===g?"none":"0.5px solid "+i.bd}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
              <span style={{fontSize:28,fontWeight:900,color:tab===g?"#fff":i.c}}>{g}</span>
              <span style={{fontSize:11,padding:"2px 7px",borderRadius:6,background:tab===g?"rgba(255,255,255,0.25)":i.c+"15",color:tab===g?"#fff":i.c,fontWeight:600}}>
                {g==="S"||g==="A"?"TP15/50":"TP12/50"}
              </span>
            </div>
            <div style={{fontSize:24,fontWeight:900,color:tab===g?"#fff":i.c,marginTop:2}}>{s.n}<span style={{fontSize:12,fontWeight:400}}>건</span></div>
            <div style={{fontSize:12,color:tab===g?"rgba(255,255,255,0.85)":"#64748b",marginTop:4}}>
              +{s.avg}%/건 · 승률 <strong>{s.wr}%</strong> · 누적 +{s.cum}%
            </div>
            <div style={{fontSize:11,color:tab===g?"rgba(255,255,255,0.65)":"#94a3b8",marginTop:2}}>
              손절{s.slr}% · 양쪽{s.bor}% · SL13%
            </div>
          </div>
        )})}
        <div style={{background:"#f1f5f9",borderRadius:14,padding:"14px 16px"}}>
          <span style={{fontSize:28,fontWeight:900,color:"#94a3b8"}}>X</span>
          <div style={{fontSize:24,fontWeight:900,color:"#94a3b8",marginTop:2}}>{XN}<span style={{fontSize:12,fontWeight:400}}>건</span></div>
          <div style={{fontSize:12,color:"#94a3b8",marginTop:4}}>매수금지</div>
        </div>
      </div>
      <div style={{borderRadius:14,border:"1px solid #e2e8f0",overflow:"hidden"}}>
        <div style={{overflowX:"auto",WebkitOverflowScrolling:"touch"}}>
          <table style={{width:"100%",minWidth:780,borderCollapse:"collapse",fontSize:14}}>
            <thead><tr style={{background:"#f8fafc"}}>
              {[{k:"d",l:"날짜"},{k:"n",l:"종목"},{k:"ch",l:"등락"},{k:"bt",l:"돌파"},{k:"iv",l:"수급"},{k:"sc",l:"NEO"},{k:"t",l:"수익"},{k:"r",l:""},{k:"ema",l:"EMA"}].map(h=>(
                <th key={h.k} onClick={()=>ds(h.k)} style={{padding:"10px 6px",textAlign:h.k==="n"?"left":"center",fontWeight:600,fontSize:12,color:"#94a3b8",cursor:"pointer",borderBottom:"2px solid #e2e8f0",whiteSpace:"nowrap",userSelect:"none"}}>
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
                    <td style={{padding:"9px 6px",fontWeight:700,fontSize:14,maxWidth:130,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{r.n}</td>
                    <td style={{padding:"9px 6px",textAlign:"center",fontWeight:700,color:"#059669",fontSize:13}}>+{r.ch}%</td>
                    <td style={{padding:"9px 6px",textAlign:"center"}}><span style={{fontSize:11,padding:"2px 6px",borderRadius:4,background:BC(r.bt)+"12",color:BC(r.bt),fontWeight:600}}>{BL(r.bt)}</span></td>
                    <td style={{padding:"9px 6px",textAlign:"center",fontSize:12,fontWeight:600,color:r.iv==="기+외"?"#7c3aed":r.iv==="외인"?"#2563eb":"#94a3b8"}}>{r.iv}</td>
                    <td style={{padding:"9px 6px",textAlign:"center"}}><span style={{background:gi.c+"12",color:gi.c,padding:"2px 8px",borderRadius:20,fontWeight:800,fontSize:13}}>{r.sc}</span></td>
                    <td style={{padding:"9px 6px",textAlign:"center",fontWeight:800,fontSize:14,color:r.t>0?"#059669":"#dc2626"}}>{r.t>0?"+":""}{r.t}%</td>
                    <td style={{padding:"9px 6px",textAlign:"center"}}><span style={{padding:"2px 5px",borderRadius:4,fontSize:11,fontWeight:700,background:RC(r.r)+"12",color:RC(r.r)}}>{RL(r.r)}</span></td>
                    <td style={{padding:"9px 6px",textAlign:"center"}}><span style={{fontSize:12,color:r.ema?"#059669":"#dc2626"}}>{r.ema?"▲":"▼"}</span></td>
                  </tr>,
                  isO&&(<tr key={"d"+i}><td colSpan={9} style={{padding:0}}>
                    <div style={{padding:"14px 18px",background:gi.bg,borderBottom:"2px solid "+gi.bd}}>
                      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(85px,1fr))",gap:6,marginBottom:10}}>
                        {[{l:"시총",v:r.mc},{l:"몸통",v:r.bd+"%"},{l:"윗꼬리",v:r.wk+"%"},{l:"갭",v:(r.gp>0?"+":"")+r.gp+"%"},{l:"거래대금",v:r.am+"억"},{l:"최대↑",v:"+"+r.pk+"%",c:"#059669"},{l:"최대↓",v:r.dd+"%",c:"#dc2626"},{l:"돌파강도",v:"+"+r.bs+"%"},{l:"매물대",v:r.vc+"%"},{l:"소요일",v:r.hd1+"/"+r.hd2}].map((x,j)=>(
                          <div key={j} style={{background:"#fff",borderRadius:8,padding:"5px 7px"}}>
                            <div style={{fontSize:10,color:"#94a3b8"}}>{x.l}</div>
                            <div style={{fontSize:14,fontWeight:700,color:x.c||"#1e293b"}}>{x.v}</div>
                          </div>
                        ))}
                      </div>
                      <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:6}}>
                        {[{l:"1차(50%)",v:"+"+r.tp1+"%",rv:r.h1,c:"#059669"},{l:"2차(50%)",v:"+"+r.tp2+"%",rv:r.h2,c:"#059669"},{l:"손절",v:"-"+r.sl+"%",rv:r.t,c:"#dc2626"}].map((x,j)=>(
                          <div key={j} style={{background:"#fff",borderRadius:8,padding:8,textAlign:"center"}}>
                            <div style={{fontSize:10,color:"#94a3b8"}}>{x.l}</div>
                            <div style={{fontSize:20,fontWeight:900,color:x.c}}>{x.v}</div>
                            <div style={{fontSize:12,color:"#64748b"}}>실제: {x.rv>0?"+":""}{x.rv}%</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </td></tr>)
                ];
              })}
            </tbody>
          </table>
        </div>
      </div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginTop:12}}>
        <span style={{fontSize:13,color:"#94a3b8"}}>{fl.length}건 중 {pg*PP+1}~{Math.min((pg+1)*PP,fl.length)}</span>
        <div style={{display:"flex",gap:4}}>
          <button onClick={()=>setPg(Math.max(0,pg-1))} disabled={pg===0} style={{padding:"6px 14px",borderRadius:8,border:"1px solid #e2e8f0",background:"#fff",fontSize:14,fontWeight:700,cursor:pg===0?"default":"pointer",color:pg===0?"#e2e8f0":"#1e293b"}}>←</button>
          <span style={{padding:"6px 10px",fontSize:14,color:"#64748b",minWidth:60,textAlign:"center"}}>{pg+1}/{mx+1}</span>
          <button onClick={()=>setPg(Math.min(mx,pg+1))} disabled={pg>=mx} style={{padding:"6px 14px",borderRadius:8,border:"1px solid #e2e8f0",background:"#fff",fontSize:14,fontWeight:700,cursor:pg>=mx?"default":"pointer",color:pg>=mx?"#e2e8f0":"#1e293b"}}>→</button>
        </div>
      </div>
    </div>
  );
}

function AIAnalysis({onSave}){
  const [imgs,setImgs]=useState([]);
  const [loading,setLoading]=useState(false);
  const [result,setResult]=useState(null);
  const [error,setError]=useState(null);
  const fileRef=useRef(null);
  const handleFiles=e=>{
    const files=Array.from(e.target.files);
    Promise.all(files.map(f=>new Promise((res,rej)=>{
      const r=new FileReader();
      r.onload=()=>res({name:f.name,data:r.result.split(",")[1],type:f.type});
      r.onerror=rej;
      r.readAsDataURL(f);
    }))).then(results=>setImgs(prev=>[...prev,...results]));
  };
  const analyze=async()=>{
    if(imgs.length===0)return;
    setLoading(true);setError(null);setResult(null);
    try{
      const content=[];
      imgs.forEach(img=>{
        content.push({type:"image",source:{type:"base64",media_type:img.type||"image/png",data:img.data}});
      });
      content.push({type:"text",text:"위 차트 이미지를 분석해주세요. 반드시 JSON으로만 응답하세요."});
      const resp=await fetch("https://api.anthropic.com/v1/messages",{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:2000,system:SYS_PROMPT,
          messages:[{role:"user",content}]})
      });
      const data=await resp.json();
      const text=data.content?.map(c=>c.text||"").join("")||"";
      const clean=text.replace(/```json|```/g,"").trim();
      const parsed=JSON.parse(clean);
      setResult(parsed);
    }catch(err){
      setError(err.message||"분석 실패");
    }
    setLoading(false);
  };
  const save=()=>{
    if(!result)return;
    const entry={...result,date:new Date().toISOString().slice(0,10),images:imgs.length};
    onSave(entry);
    setResult(null);setImgs([]);
  };
  const gColor=g=>g==="S"?"#dc2626":g==="A"?"#2563eb":g==="B"?"#d97706":"#94a3b8";
  return(
    <div>
      <div onClick={()=>fileRef.current?.click()} style={{border:"2px dashed #cbd5e1",borderRadius:16,padding:imgs.length>0?"16px":"48px 16px",textAlign:"center",cursor:"pointer",background:"#f8fafc",marginBottom:16,transition:"all .15s"}}>
        <input ref={fileRef} type="file" accept="image/*" multiple onChange={handleFiles} style={{display:"none"}}/>
        {imgs.length===0?(
          <div>
            <div style={{fontSize:40,marginBottom:8}}>{"📊"}</div>
            <div style={{fontSize:16,fontWeight:700,color:"#1e293b"}}>차트 이미지 업로드</div>
            <div style={{fontSize:13,color:"#94a3b8",marginTop:4}}>클릭 또는 드래그앤드롭</div>
          </div>
        ):(
          <div style={{display:"flex",gap:8,flexWrap:"wrap",justifyContent:"center"}}>
            {imgs.map((img,i)=>(
              <div key={i} style={{position:"relative"}}>
                <img src={"data:"+img.type+";base64,"+img.data} style={{width:120,height:80,objectFit:"cover",borderRadius:8,border:"1px solid #e2e8f0"}}/>
                <button onClick={e=>{e.stopPropagation();setImgs(prev=>prev.filter((_,j)=>j!==i))}} style={{position:"absolute",top:-6,right:-6,width:20,height:20,borderRadius:10,border:"none",background:"#dc2626",color:"#fff",fontSize:12,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>{"×"}</button>
              </div>
            ))}
            <div style={{width:120,height:80,borderRadius:8,border:"2px dashed #cbd5e1",display:"flex",alignItems:"center",justifyContent:"center",color:"#94a3b8",fontSize:24}}>+</div>
          </div>
        )}
      </div>
      <button onClick={analyze} disabled={imgs.length===0||loading} style={{width:"100%",padding:"14px",borderRadius:12,border:"none",background:imgs.length===0?"#e2e8f0":"#1e293b",color:imgs.length===0?"#94a3b8":"#fff",fontSize:16,fontWeight:700,cursor:imgs.length===0?"default":"pointer",marginBottom:16}}>
        {loading?"⚙️ 분석 중...":"🔍 NEO-SCORE 분석 시작"}
      </button>
      {error&&<div style={{padding:12,borderRadius:10,background:"#fef2f2",border:"1px solid #fca5a5",color:"#dc2626",fontSize:14,marginBottom:16}}>{error}</div>}
      {result&&(
        <div style={{borderRadius:16,border:"2px solid "+gColor(result.grade),overflow:"hidden",marginBottom:16}}>
          <div style={{background:gColor(result.grade),padding:"16px 20px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <div>
              <div style={{fontSize:22,fontWeight:900,color:"#fff"}}>{result.name||"분석 결과"}</div>
              <div style={{fontSize:13,color:"rgba(255,255,255,0.8)",marginTop:2}}>{result.breakType} · {result.investor} · {result.ema50}</div>
            </div>
            <div style={{textAlign:"center"}}>
              <div style={{fontSize:40,fontWeight:900,color:"#fff"}}>{result.grade}</div>
              <div style={{fontSize:14,color:"rgba(255,255,255,0.8)"}}>{result.score}점</div>
            </div>
          </div>
          <div style={{padding:"16px 20px",background:"#fff"}}>
            <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:8,marginBottom:12}}>
              {[{l:"TP1",v:result.tp1+"%",c:"#059669"},{l:"TP2",v:result.tp2+"%",c:"#059669"},{l:"SL",v:result.sl+"%",c:"#dc2626"}].map((x,i)=>(
                <div key={i} style={{textAlign:"center",padding:10,background:"#f8fafc",borderRadius:10}}>
                  <div style={{fontSize:11,color:"#94a3b8"}}>{x.l}</div>
                  <div style={{fontSize:22,fontWeight:900,color:x.c}}>{x.v}</div>
                </div>
              ))}
            </div>
            <div style={{fontSize:14,color:"#475569",lineHeight:1.7,marginBottom:12,padding:12,background:"#f8fafc",borderRadius:10}}>{result.summary}</div>
            {result.details&&(
              <div style={{fontSize:13}}>
                {result.details.map((d,i)=>(
                  <div key={i} style={{display:"flex",justifyContent:"space-between",padding:"6px 0",borderBottom:"1px solid #f1f5f9"}}>
                    <span style={{color:"#475569"}}>{d.item}</span>
                    <span style={{fontWeight:700,color:d.point>0?"#059669":d.point<0?"#dc2626":"#94a3b8"}}>{d.point>0?"+":""}{d.point}</span>
                  </div>
                ))}
              </div>
            )}
            <button onClick={save} style={{width:"100%",padding:12,borderRadius:10,border:"none",background:"#059669",color:"#fff",fontSize:15,fontWeight:700,cursor:"pointer",marginTop:12}}>
              ✅ 히스토리에 저장
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function History({items,onClear}){
  if(items.length===0)return(
    <div style={{textAlign:"center",padding:"60px 20px",color:"#94a3b8"}}>
      <div style={{fontSize:48,marginBottom:12}}>{"📋"}</div>
      <div style={{fontSize:16,fontWeight:600}}>분석 히스토리가 없습니다</div>
      <div style={{fontSize:14,marginTop:4}}>AI분석 탭에서 차트를 분석하면 여기에 쌓입니다</div>
    </div>
  );
  const gColor=g=>g==="S"?"#dc2626":g==="A"?"#2563eb":g==="B"?"#d97706":"#94a3b8";
  return(
    <div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
        <span style={{fontSize:14,color:"#64748b"}}>총 {items.length}건</span>
        <button onClick={onClear} style={{padding:"6px 12px",borderRadius:8,border:"1px solid #fca5a5",background:"#fff",color:"#dc2626",fontSize:12,fontWeight:600,cursor:"pointer"}}>전체 삭제</button>
      </div>
      {items.map((r,i)=>(
        <div key={i} style={{display:"flex",alignItems:"center",gap:12,padding:"12px 16px",borderRadius:12,border:"1px solid #e2e8f0",marginBottom:8,background:"#fff"}}>
          <div style={{width:44,height:44,borderRadius:12,background:gColor(r.grade)+"15",display:"flex",alignItems:"center",justifyContent:"center"}}>
            <span style={{fontSize:20,fontWeight:900,color:gColor(r.grade)}}>{r.grade}</span>
          </div>
          <div style={{flex:1,minWidth:0}}>
            <div style={{fontWeight:700,fontSize:15,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{r.name}</div>
            <div style={{fontSize:12,color:"#94a3b8",marginTop:2}}>{r.date} · {r.score}점 · {r.breakType} · {r.investor}</div>
          </div>
          <div style={{textAlign:"right",flexShrink:0}}>
            <div style={{fontSize:13,fontWeight:700,color:"#059669"}}>TP {r.tp1}/{r.tp2}</div>
            <div style={{fontSize:12,color:"#dc2626"}}>SL {r.sl}%</div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function App(){
  const [page,setPage]=useState("db");
  const [history,setHistory]=useState(()=>{
    try{return JSON.parse(localStorage.getItem("neo_history")||"[]")}catch{return[]}
  });
  const saveHistory=useCallback((entry)=>{
    setHistory(prev=>{
      const next=[entry,...prev];
      localStorage.setItem("neo_history",JSON.stringify(next));
      return next;
    });
    setPage("history");
  },[]);
  const clearHistory=useCallback(()=>{
    setHistory([]);
    localStorage.removeItem("neo_history");
  },[]);
  return(
    <div style={{background:"#fff",minHeight:"100vh",fontFamily:"-apple-system,'Pretendard',sans-serif",color:"#1e293b",fontSize:15,paddingBottom:70}}>
      <link href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/static/pretendard.css" rel="stylesheet"/>
      <div style={{maxWidth:920,margin:"0 auto",padding:"24px 16px"}}>
        <div style={{marginBottom:20}}>
          <h1 style={{fontSize:28,fontWeight:900,marginBottom:2,letterSpacing:"-0.5px"}}>NEO-SCORE</h1>
          <p style={{fontSize:13,color:"#94a3b8"}}>종가돌파매매 · S/A/B/X 등급 · AI 차트분석 · 2020~2026</p>
        </div>
        {page==="db"&&<SignalDB/>}
        {page==="ai"&&<AIAnalysis onSave={saveHistory}/>}
        {page==="history"&&<History items={history} onClear={clearHistory}/>}
      </div>
      <div style={{position:"fixed",bottom:0,left:0,right:0,background:"#fff",borderTop:"1px solid #e2e8f0",display:"flex",justifyContent:"center",zIndex:100}}>
        <div style={{display:"flex",maxWidth:920,width:"100%"}}>
          {[{id:"db",label:"시그널DB",icon:"📊"},{id:"ai",label:"AI분석",icon:"🤖"},{id:"history",label:"히스토리",icon:"📋",badge:history.length}].map(t=>(
            <button key={t.id} onClick={()=>setPage(t.id)} style={{flex:1,padding:"10px 0 8px",border:"none",background:"none",cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",gap:2,position:"relative"}}>
              <span style={{fontSize:20}}>{t.icon}</span>
              <span style={{fontSize:11,fontWeight:page===t.id?700:500,color:page===t.id?"#1e293b":"#94a3b8"}}>{t.label}</span>
              {t.badge>0&&<span style={{position:"absolute",top:6,right:"calc(50% - 20px)",background:"#dc2626",color:"#fff",fontSize:10,fontWeight:700,padding:"1px 5px",borderRadius:10,minWidth:16,textAlign:"center"}}>{t.badge}</span>}
              {page===t.id&&<div style={{position:"absolute",top:0,left:"20%",right:"20%",height:2,background:"#1e293b",borderRadius:1}}/>}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}