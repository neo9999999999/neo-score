// 하승훈 종가베팅 자동 평가 시스템
// 14:50~15:25 거래대금 상위 종목 자동 스캔 + 8개 평가 + 점수화 + 추천
import React, { useState, useEffect, useMemo, useCallback } from "react";

const SCREENING_URL = "https://sector-api-pink.vercel.app/api/screening";
const DAILY_URL = "https://sector-api-pink.vercel.app/api/daily-price";
const THEMES_URL = "https://sector-api-pink.vercel.app/api/themes?top=20&per=3";
const INTRADAY_URL = "https://sector-api-pink.vercel.app/api/intraday";

// 평가 룰
const MUST = {
  vol_eok: 2000,       // ① 거래대금 ≥ 2000억
  // ② 테마: 미지원 (수급 대체)
  // ③ 신고가: h60==1 OR h120==1
  // ④ 장 막판 매수세: 분봉 미지원 → 종가위치 ≥ 80% 대체
  // ⑤ 대장주: 시장(KS/KO) 1등
  late_close_pos: 0.80, // 종가가 일중 상단 80% 이상
};
const SAFE = {
  ret_min: 10, ret_max: 28,
  cum5_max: 30,
};
// 자동 제외 (강제)
const EXCLUDE = {
  vol_min_eok: 500,    // < 500억
  ret_high: 29,        // 등락 ≥ 29%
  cum5_high: 30,       // 5일 누적 > 30%
};

const _won = (v) => v==null||v===''||isNaN(+v) ? '-' : Math.round(+v).toLocaleString();
const _fmt = (v, d=2) => v==null||v===''||isNaN(+v) ? '-' : (+v).toFixed(d);
const _eok = (v) => v==null||v===''||isNaN(+v) ? '-' : Math.round(+v).toLocaleString()+'억';

function _gradeColor(g) {
  if (g === 'STRONG') return '#10b981';
  if (g === 'BUY') return '#f59e0b';
  if (g === 'HOLD') return '#f97316';
  return '#94a3b8';
}
function _verdictKR(v) {
  return { STRONG:'🟢 강력 추천', BUY:'🟡 진입 가능', HOLD:'🟠 보류', EXCLUDE:'🔴 진입 금지' }[v] || '-';
}
function _verdictBg(v) {
  return { STRONG:'rgba(16,185,129,0.12)', BUY:'rgba(245,158,11,0.12)', HOLD:'rgba(249,115,22,0.12)', EXCLUDE:'rgba(139,148,158,0.12)' }[v] || 'rgba(139,148,158,0.12)';
}

// 자동 평가 (screening signal → 점수/판정)
function evaluate(s, leaderMap, sectorMap) {
  const ch = +s.change || +s.rate || 0;
  const amt = +s.amount || +s.vol || 0;
  const h60 = +s.h60 || 0;
  const h120 = +s.h120 || 0;
  const cum5 = +s.cum5 || 0;
  const maAlign = +s.maAlign || 0;
  const o = +s.open || 0, h = +s.high || 0, l = +s.low || 0, c = +s.price || +s.close || 0;
  const range = h - l;
  const rangePos = range > 0 ? (c - l) / range : 0.5;
  const score_s = +s.score || 0;
  const code = String(s.code).padStart(6, '0');
  const market = s.market || '';
  // 테마 정보 (Naver 스크래핑 결과)
  const themeInfo = (sectorMap||{})[code]; // {theme, themeChange, themeRank}
  const sector = themeInfo ? themeInfo.theme : (s.sector || s.theme || '');
  const themeRank = themeInfo ? themeInfo.themeRank : 99;
  const isThemeLeader = themeRank === 1;
  // 시장별 등락률 1등 여부
  const isMktLeader = (leaderMap||{})[code] === 1;
  const leaderRank = (leaderMap||{})[code] || 99;
  // 대장주 판정 — 테마 1등 OR 시장 1등
  const isLeader = isThemeLeader || isMktLeader;

  // 자동 제외 체크
  const excludeReasons = [];
  if (amt < EXCLUDE.vol_min_eok) excludeReasons.push(`거래대금 ${amt}억 < 500억`);
  if (ch >= EXCLUDE.ret_high) excludeReasons.push(`D등락 ${ch.toFixed(2)}% ≥ 29%`);
  if (cum5 > EXCLUDE.cum5_high) excludeReasons.push(`5일누적 ${cum5.toFixed(1)}% > 30%`);
  // 시총 데이터 없음 (생략)
  if (excludeReasons.length > 0) {
    return { verdict: 'EXCLUDE', score: 0, excludeReasons, checks: {}, data: { ch, amt, cum5, h60, h120, maAlign, rangePos, c, h, l, o } };
  }

  // 5대 필수 조건
  const must = {
    vol_2000eok: { pass: amt >= MUST.vol_eok, label: `거래대금 ${amt}억 ${amt>=MUST.vol_eok?'≥':'<'} 2,000억` },
    core_theme: {
      pass: !!sector && themeInfo && themeInfo.themeChange >= 1.0,
      label: themeInfo
        ? `테마: ${sector} (${themeInfo.themeChange>=0?'+':''}${themeInfo.themeChange.toFixed(2)}%, 테마내 ${themeRank}등)`
        : sector ? `테마: ${sector}` : `수급: ${s.investor||s.supply||'미지정'} (테마 미매칭)`,
      tbd: !themeInfo
    },
    new_high: { pass: h60===1 || h120===1, label: h60===1 && h120===1 ? '60일+120일 신고가 동시' : h60===1 ? '60일 신고가' : h120===1 ? '120일 신고가' : '신고가 미달성' },
    late_momentum: { pass: rangePos >= MUST.late_close_pos, label: `종가위치 ${(rangePos*100).toFixed(0)}% ${rangePos>=MUST.late_close_pos?'≥':'<'} 80% (분봉 미지원 → 종가위치 대체)`, tbd: true },
    leader: {
      pass: isLeader,
      label: isThemeLeader ? `🏆 테마 ${sector} 1등주`
        : isMktLeader ? `🏆 시장 ${market} 1등 (테마 매칭 X)`
        : themeRank<=3 ? `테마내 ${themeRank}등`
        : leaderRank<=3 ? `시장 ${leaderRank}등`
        : '1등 아님',
      tbd: false
    },
  };

  // 3대 안전 조건
  const safe = {
    ret_range: { pass: ch >= SAFE.ret_min && ch <= SAFE.ret_max, label: `D등락 ${ch.toFixed(2)}% ${ch>=SAFE.ret_min&&ch<=SAFE.ret_max?'∈':'∉'} [10, 28]` },
    cum5_ok: { pass: cum5 <= SAFE.cum5_max, label: `5일누적 ${cum5.toFixed(1)}% ${cum5<=SAFE.cum5_max?'≤':'>'} 30%` },
    ma_aligned: { pass: maAlign === 1, label: maAlign===1 ? 'MA정배열 (MA5>MA20>MA60)' : 'MA역배열' },
  };

  // 패턴 (분봉 미지원 → 종가위치 + 신고가로 추정 패턴)
  const pattern = {
    // 분봉 미지원 — 대체 로직: 종가 상단 + 신고가 = A 패턴 추정
    pattern_A: rangePos >= 0.85 && (h60===1 || h120===1),
    pattern_B: false,  // MA5 분봉 데이터 필요 → 미지원
    pattern_C: false,  // 14:00~14:50 분봉 필요 → 미지원
  };

  // 점수 계산
  // ① 거래대금 (20점)
  // ③ 신고가 (15점)
  // ④ 종가위치 (15점, 분봉 미지원 대체)
  // ⑤ 대장주 (15점, 시장 1등)
  // S1 등락범위 (10점)
  // S2 5일누적 (10점)
  // S3 MA정배열 (10점)
  // 패턴A (5점)
  let score = 0;
  if (must.vol_2000eok.pass) score += 20;
  else if (amt >= 1000) score += 10; // 1000~2000 부분점
  if (must.new_high.pass) score += h60===1 && h120===1 ? 15 : 10;
  if (must.late_momentum.pass) score += 15;
  else if (rangePos >= 0.5) score += 7;
  if (must.leader.pass) score += 15;
  else if (leaderRank <= 3) score += 8;
  if (safe.ret_range.pass) score += 10;
  if (safe.cum5_ok.pass) score += 10;
  if (safe.ma_aligned.pass) score += 10;
  if (pattern.pattern_A) score += 5;

  // 판정
  let verdict = 'HOLD';
  if (score >= 90) verdict = 'STRONG';
  else if (score >= 70) verdict = 'BUY';
  else if (score >= 50) verdict = 'HOLD';
  else verdict = 'EXCLUDE';

  // 추천 비중
  let weight = 0;
  if (verdict === 'STRONG') weight = isLeader ? 100 : 60;
  else if (verdict === 'BUY') weight = isLeader ? 60 : 40;
  else if (verdict === 'HOLD') weight = 20;

  return { verdict, score, excludeReasons:[], checks: { must, safe, pattern }, weight, isLeader, isThemeLeader, isMktLeader, leaderRank, themeRank, themeInfo, data: { ch, amt, cum5, h60, h120, maAlign, rangePos, c, h, l, o } };
}

export function HaseunghoonClosingBetTab({ theme = "dark" }) {
  const _T = theme === "dark"
    ? { text:'#e6edf3', body:'#c9d1d9', sub:'#8b949e', hint:'#6e7681', mute:'#484f58', line:'#30363d', linelt:'#21262d', bg:'#0d1117', card:'#161b22', up:'#f85149', down:'#58a6ff', accent:'#7c3aed', green:'#10b981' }
    : { text:'#191f28', body:'#333d4b', sub:'#4e5968', hint:'#6b7684', mute:'#8b95a1', line:'#e5e8eb', linelt:'#f2f4f6', bg:'#f9fafb', card:'#ffffff', up:'#f04452', down:'#1f6dee', accent:'#7c3aed', green:'#10b981' };

  const [data, setData] = useState(null);
  const [themesData, setThemesData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState(null);
  const [expanded, setExpanded] = useState({});
  const [filter, setFilter] = useState('all'); // all/STRONG/BUY/HOLD/EXCLUDE

  const load = useCallback(async () => {
    setLoading(true); setErr(null);
    try {
      // 병렬: screening + themes
      const [scrRes, thmRes] = await Promise.all([
        fetch(SCREENING_URL),
        fetch(THEMES_URL).catch(() => null)
      ]);
      const d = await scrRes.json();
      setData(d);
      if (thmRes && thmRes.ok) {
        const t = await thmRes.json();
        setThemesData(t);
      }
    } catch (e) {
      setErr(e.message || 'fetch 실패');
    }
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  // 종목코드 → {theme, rank} 매핑 (테마 데이터에서 역인덱스)
  const sectorMap = useMemo(() => {
    if (!themesData || !themesData.themes) return {};
    const map = {};
    for (const t of themesData.themes) {
      if (!t.leaders) continue;
      t.leaders.forEach((stock, idx) => {
        const code = String(stock.code).padStart(6, '0');
        // 같은 종목이 여러 테마에 있으면 등락률 높은 테마 우선
        if (!map[code] || (t.change > map[code].themeChange)) {
          map[code] = {
            theme: t.name,
            themeChange: t.change,
            themeRank: idx + 1, // 테마 내 1,2,3등
          };
        }
      });
    }
    return map;
  }, [themesData]);

  // 시장별 등락률 leader map (KOSPI/KOSDAQ 각각 1,2,3등)
  const leaderMap = useMemo(() => {
    if (!data || !data.all) return {};
    const byMkt = { KOSPI:[], KOSDAQ:[] };
    for (const s of data.all) {
      const mk = s.market === 'KOSPI' || s.market === 'KS' ? 'KOSPI' : s.market === 'KOSDAQ' || s.market === 'KO' ? 'KOSDAQ' : null;
      if (!mk) continue;
      const amt = +s.amount || +s.vol || 0;
      if (amt < 500) continue;
      byMkt[mk].push(s);
    }
    const map = {};
    for (const mk of ['KOSPI','KOSDAQ']) {
      const sorted = [...byMkt[mk]].sort((a,b) => (+b.change||0) - (+a.change||0));
      sorted.slice(0, 5).forEach((s, i) => { map[s.code] = i+1; });
    }
    return map;
  }, [data]);

  // 평가 결과
  const evaluated = useMemo(() => {
    if (!data || !data.all) return [];
    return data.all
      .map(s => ({ ...s, eval: evaluate(s, leaderMap, sectorMap) }))
      .sort((a, b) => b.eval.score - a.eval.score);
  }, [data, leaderMap, sectorMap]);

  // 필터
  const filtered = useMemo(() => {
    if (filter === 'all') return evaluated.filter(s => s.eval.verdict !== 'EXCLUDE');
    return evaluated.filter(s => s.eval.verdict === filter);
  }, [evaluated, filter]);

  // 통계
  const counts = useMemo(() => {
    const c = { STRONG:0, BUY:0, HOLD:0, EXCLUDE:0 };
    for (const s of evaluated) c[s.eval.verdict]++;
    return c;
  }, [evaluated]);

  return (
    <div style={{padding:'4px 0', color:_T.text}}>
      {/* 룰 카드 */}
      <div style={{background:_T.card, border:'1px solid '+_T.line, borderRadius:12, padding:'14px 16px', marginBottom:10, fontSize:12, lineHeight:1.7, color:_T.body}}>
        <div style={{fontSize:14, fontWeight:800, color:_T.text, marginBottom:8}}>🎯 하승훈 종가베팅 자동 평가</div>
        <div style={{color:_T.sub}}>14:50~15:25 자동 스캔 — 거래대금 상위 종목 8개 조건 평가 후 100점 만점 점수화</div>
        <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(180px, 1fr))', gap:8, marginTop:8}}>
          <div style={{padding:'6px 9px', background:_T.linelt, borderRadius:6, fontSize:11}}>
            <b style={{color:_T.text}}>5대 필수 (75점)</b>
            <ul style={{margin:'3px 0 0', paddingLeft:14, color:_T.sub}}>
              <li>거래대금 ≥ 2000억 (20)</li>
              <li>신고가 60/120일 (15)</li>
              <li>종가위치 ≥ 80% (15)</li>
              <li>시장 1등 (15)</li>
              <li>핵심 테마 <span style={{color:'#f59e0b'}}>(TBD)</span></li>
            </ul>
          </div>
          <div style={{padding:'6px 9px', background:_T.linelt, borderRadius:6, fontSize:11}}>
            <b style={{color:_T.text}}>3대 안전 (30점)</b>
            <ul style={{margin:'3px 0 0', paddingLeft:14, color:_T.sub}}>
              <li>D등락 10~28% (10)</li>
              <li>5일 누적 ≤ 30% (10)</li>
              <li>MA정배열 (10)</li>
            </ul>
          </div>
          <div style={{padding:'6px 9px', background:_T.linelt, borderRadius:6, fontSize:11}}>
            <b style={{color:_T.text}}>패턴 (5점)</b>
            <ul style={{margin:'3px 0 0', paddingLeft:14, color:_T.sub}}>
              <li>A 매물소화 후 재돌파 (5)</li>
              <li>B 5일선 눌림 <span style={{color:'#f59e0b'}}>(TBD)</span></li>
              <li>C 박스권 돌파 <span style={{color:'#f59e0b'}}>(TBD)</span></li>
            </ul>
          </div>
          <div style={{padding:'6px 9px', background:_T.linelt, borderRadius:6, fontSize:11}}>
            <b style={{color:_T.text}}>자동 제외</b>
            <ul style={{margin:'3px 0 0', paddingLeft:14, color:_T.sub}}>
              <li>거래대금 &lt; 500억</li>
              <li>D등락 ≥ 29% (상한가)</li>
              <li>5일 누적 &gt; 30%</li>
            </ul>
          </div>
        </div>
        <div style={{marginTop:8, padding:'6px 10px', background:'rgba(245,158,11,0.10)', borderRadius:6, fontSize:11, color:_T.sub}}>
          ⚠️ 분봉 데이터/섹터 테마 미지원 항목은 종가위치/시장 1등으로 대체 (분봉 API 활성화 후 정확 평가)
        </div>
      </div>

      {/* 컨트롤 */}
      <div style={{display:'flex', gap:8, marginBottom:10, alignItems:'center', flexWrap:'wrap'}}>
        <button onClick={load} disabled={loading} style={{padding:'8px 14px', borderRadius:9, border:'1px solid '+_T.line, background:_T.bg, color:_T.body, fontSize:12, fontWeight:700, cursor:loading?'wait':'pointer'}}>🔄 {loading?'조회 중':'새로 조회'}</button>
        {data && <span style={{fontSize:12, color:_T.sub}}>{data.date} · {data.time}</span>}
        {err && <span style={{color:_T.up, fontSize:12}}>⚠️ {err}</span>}
        <div style={{display:'flex', gap:4, marginLeft:'auto', flexWrap:'wrap'}}>
          {[
            {k:'all', l:'전체', c:_T.body},
            {k:'STRONG', l:`🟢 강력 ${counts.STRONG}`, c:'#10b981'},
            {k:'BUY', l:`🟡 진입 ${counts.BUY}`, c:'#f59e0b'},
            {k:'HOLD', l:`🟠 보류 ${counts.HOLD}`, c:'#f97316'},
            {k:'EXCLUDE', l:`🔴 제외 ${counts.EXCLUDE}`, c:_T.mute},
          ].map(f => (
            <button key={f.k} onClick={()=>setFilter(f.k)} style={{padding:'5px 11px', borderRadius:7, border:'1px solid '+_T.line, background:filter===f.k?f.c:_T.bg, color:filter===f.k?'#fff':_T.body, fontSize:11, fontWeight:700, cursor:'pointer'}}>{f.l}</button>
          ))}
        </div>
      </div>

      {!loading && evaluated.length === 0 && (
        <div style={{padding:'40px 20px', textAlign:'center', color:_T.mute, fontSize:13, background:_T.card, border:'1px solid '+_T.line, borderRadius:12}}>
          screening API 결과 없음 — 새로 조회 누르세요
        </div>
      )}

      {/* 후보 카드 */}
      <div style={{display:'flex', flexDirection:'column', gap:8}}>
        {filtered.map((s, i) => {
          const ev = s.eval;
          const v = ev.verdict;
          const isOpen = !!expanded[s.code];
          const ch = +s.change || 0;
          const amt = +s.amount || 0;
          const newsUrl = `https://finance.naver.com/item/news.naver?code=${String(s.code).padStart(6,'0')}`;
          const chartUrl = `https://finance.naver.com/item/main.naver?code=${String(s.code).padStart(6,'0')}`;
          return (
            <div key={s.code+'_'+i} style={{background:_T.card, border:'2px solid '+(v==='STRONG'?_T.green:v==='BUY'?'#f59e0b':_T.line), borderRadius:11, overflow:'hidden'}}>
              <div onClick={()=>setExpanded(p=>({...p, [s.code]: !isOpen}))} style={{padding:'12px 14px', cursor:'pointer'}}>
                <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', gap:10, flexWrap:'wrap'}}>
                  <div style={{display:'flex', alignItems:'baseline', gap:8, flexWrap:'wrap', minWidth:0}}>
                    <span style={{padding:'3px 9px', borderRadius:6, fontSize:11, fontWeight:800, background:_verdictBg(v), color:_gradeColor(v)}}>{_verdictKR(v)}</span>
                    <span style={{fontSize:15, fontWeight:900, color:_T.text, letterSpacing:'-0.3px'}}>{s.name}</span>
                    <span style={{fontSize:11, color:_T.mute}}>{String(s.code).padStart(6,'0')}</span>
                    <span style={{fontSize:11, color:_T.sub}}>{s.market}</span>
                    {ev.isLeader && <span style={{padding:'1px 6px', borderRadius:4, fontSize:10, fontWeight:800, background:'rgba(220,38,38,0.15)', color:'#dc2626'}}>🏆 시장 1등</span>}
                    {!ev.isLeader && ev.leaderRank <= 3 && <span style={{padding:'1px 6px', borderRadius:4, fontSize:10, fontWeight:700, background:'rgba(245,158,11,0.15)', color:'#f59e0b'}}>{ev.leaderRank}등</span>}
                  </div>
                  <div style={{display:'flex', alignItems:'baseline', gap:10}}>
                    <span style={{fontSize:14, fontWeight:700, color:ch>=0?_T.up:_T.down}}>{ch>=0?'+':''}{ch.toFixed(2)}%</span>
                    <span style={{fontSize:11, color:_T.sub}}>{amt}억</span>
                    <span style={{fontSize:22, fontWeight:900, color:_gradeColor(v), letterSpacing:'-0.5px'}}>{ev.score}</span>
                    <span style={{fontSize:11, color:_T.mute}}>/100</span>
                  </div>
                </div>
                {/* 요약 (접힘 상태) */}
                {!isOpen && (
                  <div style={{display:'flex', gap:8, marginTop:6, flexWrap:'wrap', fontSize:11, color:_T.sub}}>
                    <Sm pass={ev.checks.must?.vol_2000eok?.pass} l="거래대금" _T={_T} />
                    <Sm pass={ev.checks.must?.new_high?.pass} l="신고가" _T={_T} />
                    <Sm pass={ev.checks.must?.late_momentum?.pass} l="종가↑" _T={_T} />
                    <Sm pass={ev.checks.must?.leader?.pass} l="1등" _T={_T} />
                    <Sm pass={ev.checks.safe?.ret_range?.pass} l="등락" _T={_T} />
                    <Sm pass={ev.checks.safe?.cum5_ok?.pass} l="5일" _T={_T} />
                    <Sm pass={ev.checks.safe?.ma_aligned?.pass} l="MA" _T={_T} />
                    <Sm pass={ev.checks.pattern?.pattern_A} l="패턴A" _T={_T} />
                  </div>
                )}
              </div>

              {/* 펼침 상태 — 자동 평가 + 추천 */}
              {isOpen && (
                <div style={{padding:'0 14px 14px', borderTop:'1px solid '+_T.linelt}}>
                  {v === 'EXCLUDE' ? (
                    <div style={{padding:'12px', background:'rgba(248,81,73,0.10)', borderRadius:8, marginTop:10}}>
                      <div style={{fontSize:12, fontWeight:800, color:_T.up, marginBottom:6}}>🔴 자동 제외 사유</div>
                      {ev.excludeReasons.map((r, i) => (
                        <div key={i} style={{fontSize:12, color:_T.body, marginLeft:6, marginTop:2}}>• {r}</div>
                      ))}
                    </div>
                  ) : (
                    <>
                      <Section title="5대 필수 조건" col={_T.accent} _T={_T}>
                        {Object.entries(ev.checks.must||{}).map(([k, c]) => (
                          <Check key={k} pass={c.pass} label={c.label} tbd={c.tbd} _T={_T} />
                        ))}
                      </Section>
                      <Section title="3대 안전 조건" col="#0ea5e9" _T={_T}>
                        {Object.entries(ev.checks.safe||{}).map(([k, c]) => (
                          <Check key={k} pass={c.pass} label={c.label} tbd={c.tbd} _T={_T} />
                        ))}
                      </Section>
                      <Section title="매수 타점 패턴" col="#10b981" _T={_T}>
                        <Check pass={ev.checks.pattern?.pattern_A} label="패턴 A: 매물 소화 후 재돌파 (종가 상단 85%+ AND 신고가)" _T={_T} />
                        <Check pass={ev.checks.pattern?.pattern_B} label="패턴 B: 5일선 눌림목 회복 (분봉 미지원)" tbd _T={_T} />
                        <Check pass={ev.checks.pattern?.pattern_C} label="패턴 C: 장 막판 박스권 돌파 (분봉 미지원)" tbd _T={_T} />
                      </Section>
                      <Section title="자동 데이터" col="#a855f7" _T={_T}>
                        <DataRow l="현재가" v={_won(ev.data.c)} _T={_T} />
                        <DataRow l="등락률" v={`+${ev.data.ch.toFixed(2)}%`} c={_T.up} _T={_T} />
                        <DataRow l="거래대금" v={`${ev.data.amt}억`} _T={_T} />
                        <DataRow l="5일 누적" v={`+${ev.data.cum5.toFixed(1)}%`} _T={_T} />
                        <DataRow l="60일 신고가" v={ev.data.h60===1?'Y':'N'} c={ev.data.h60===1?_T.up:_T.mute} _T={_T} />
                        <DataRow l="120일 신고가" v={ev.data.h120===1?'Y':'N'} c={ev.data.h120===1?_T.up:_T.mute} _T={_T} />
                        <DataRow l="종가위치" v={`${(ev.data.rangePos*100).toFixed(0)}%`} _T={_T} />
                        <DataRow l="MA정배열" v={ev.data.maAlign===1?'Y':'N'} c={ev.data.maAlign===1?_T.up:_T.mute} _T={_T} />
                      </Section>
                      {/* 테마 정보 (sectorMap에서 매칭된 경우) */}
                      {ev.themeInfo && (
                        <Section title="테마 (네이버 분류)" col="#ec4899" _T={_T}>
                          <DataRow l="테마명" v={ev.themeInfo.theme} _T={_T} />
                          <DataRow l="테마 등락률" v={`${ev.themeInfo.themeChange>=0?'+':''}${ev.themeInfo.themeChange.toFixed(2)}%`} c={ev.themeInfo.themeChange>=0?_T.up:_T.down} _T={_T} />
                          <DataRow l="테마내 순위" v={`${ev.themeInfo.themeRank}등주`} c={ev.themeInfo.themeRank===1?'#dc2626':_T.body} _T={_T} />
                        </Section>
                      )}

                      {/* 추천 비중 + 매수 시점 */}
                      {(v === 'STRONG' || v === 'BUY') && (
                        <div style={{padding:'12px', background:'rgba(16,185,129,0.10)', borderRadius:8, marginTop:10}}>
                          <div style={{fontSize:12, fontWeight:800, color:_T.green, marginBottom:8}}>💰 매수 추천</div>
                          <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(120px, 1fr))', gap:8, fontSize:12, color:_T.body}}>
                            <div><b style={{color:_T.text}}>추천 비중</b><br/>{ev.weight}만원</div>
                            <div><b style={{color:_T.text}}>매수 시점</b><br/>15:25~15:30</div>
                            <div><b style={{color:_T.text}}>매수가</b><br/>{_won(ev.data.c)}원 (종가)</div>
                            <div><b style={{color:_T.text}}>익절 (D+1)</b><br/>시초가 / 종가 / 트레일</div>
                          </div>
                        </div>
                      )}

                      {/* 외부 링크 */}
                      <div style={{display:'flex', gap:6, marginTop:10, flexWrap:'wrap'}}>
                        <a href={chartUrl} target="_blank" rel="noopener" style={{padding:'5px 10px', borderRadius:6, border:'1px solid '+_T.line, background:_T.bg, color:_T.body, fontSize:11, fontWeight:700, textDecoration:'none'}}>📊 차트 (네이버)</a>
                        <a href={newsUrl} target="_blank" rel="noopener" style={{padding:'5px 10px', borderRadius:6, border:'1px solid '+_T.line, background:_T.bg, color:_T.body, fontSize:11, fontWeight:700, textDecoration:'none'}}>📰 뉴스 (네이버)</a>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function Sm({ pass, l, _T }) {
  return <span style={{color: pass ? _T.up : _T.mute, fontWeight:700}}>{pass?'✓':'✗'} {l}</span>;
}

function Section({ title, col, children, _T }) {
  return (
    <div style={{marginTop:10}}>
      <div style={{fontSize:11, fontWeight:800, color:col, marginBottom:5}}>● {title}</div>
      <div style={{display:'flex', flexDirection:'column', gap:3, paddingLeft:8}}>{children}</div>
    </div>
  );
}

function Check({ pass, label, tbd, _T }) {
  const c = tbd ? '#f59e0b' : pass ? _T.up : _T.mute;
  const icon = tbd ? '⚠️' : pass ? '✅' : '❌';
  return (
    <div style={{fontSize:12, color:_T.body, display:'flex', gap:6, alignItems:'baseline'}}>
      <span style={{color:c, fontSize:11}}>{icon}</span>
      <span style={{color: pass||tbd ? _T.body : _T.sub}}>{label}</span>
    </div>
  );
}

function DataRow({ l, v, c, _T }) {
  return (
    <div style={{display:'flex', justifyContent:'space-between', fontSize:11, padding:'2px 0'}}>
      <span style={{color:_T.sub}}>{l}</span>
      <span style={{color:c||_T.body, fontWeight:700}}>{v}</span>
    </div>
  );
}
