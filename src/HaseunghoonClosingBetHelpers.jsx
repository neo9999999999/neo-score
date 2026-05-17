// 하승훈 종가베팅 자동 평가 시스템
// 14:50~15:25 거래대금 상위 종목 자동 스캔 + 8개 평가 + 점수화 + 추천
import React, { useState, useEffect, useMemo, useCallback } from "react";

const SCREENING_URL = "https://sector-api-pink.vercel.app/api/screening";
const DAILY_URL = "https://sector-api-pink.vercel.app/api/daily-price";
const THEMES_URL = "https://sector-api-pink.vercel.app/api/themes?top=20&per=3";
const INTRADAY_URL = "https://sector-api-pink.vercel.app/api/intraday";

// 평가 룰
const MUST = {
  vol_eok: 500,        // ① 거래대금 ≥ 500억
  // ② 테마: 네이버 themes 스크래핑
  // ③ 신고가: h60==1 OR h120==1
  // ④ 장 막판 매수세: 분봉 14:30→15:00 + (분봉 없으면 종가위치 대체)
  // ⑤ 대장주: 테마 1등 OR 시장 1등
  late_close_pos: 0.80, // 종가가 일중 상단 80% 이상
};
const SAFE = {
  ret_min: 10, ret_max: 28,
  cum5_max: 30,
};
// 자동 제외 (강제)
const EXCLUDE = {
  vol_min_eok: 100,    // < 100억 (너무 작은 종목)
  ret_high: 29,        // 등락 ≥ 29% (상한가)
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

// 분봉 분석 — 패턴 A/B/C + 장 막판 매수세
// bars: [{t:'HH:MM', o,h,l,c,v}, ...] 09:00~15:30 1분봉
function analyzeIntraday(bars, dayHigh, dayLow, dayClose, ma5) {
  if (!bars || bars.length < 30) return null;
  const sorted = [...bars].sort((a, b) => String(a.t).localeCompare(String(b.t)));
  // 시간 인덱싱
  const findIdx = (target) => {
    for (let i = 0; i < sorted.length; i++) {
      if (sorted[i].t >= target) return i;
    }
    return sorted.length - 1;
  };
  const i_1400 = findIdx('14:00');
  const i_1430 = findIdx('14:30');
  const i_1450 = findIdx('14:50');
  const i_1500 = findIdx('15:00');
  const i_last = sorted.length - 1;
  // 가격 추출
  const close_1430 = +sorted[i_1430].c || 0;
  const close_1500 = +sorted[i_1500]?.c || 0;
  const close_last = +sorted[i_last].c || 0;
  const high_1450 = +sorted[i_1450].h || 0;
  // 장 막판 매수세 ④: 14:30 → 15:00 +1% 이상
  const late_pct = close_1430 > 0 ? (close_1500 / close_1430 - 1) * 100 : 0;
  const late_momentum = late_pct >= -0.5;  // 보수적: -0.5% 이상
  // 패턴 A: 당일 신고가 만든 후 5% 이상 조정 → 14:50 종가가 당일 고가 -1% 이내
  let pattern_A = false;
  let pattern_A_reason = '';
  if (dayHigh > 0) {
    // 일중 최고가 시각 찾기
    let highIdx = 0, maxH = 0;
    for (let i = 0; i < i_last; i++) {
      if (sorted[i].h > maxH) { maxH = sorted[i].h; highIdx = i; }
    }
    // 최고가 이후 최저점
    let pullback = 0;
    for (let i = highIdx; i < i_last; i++) {
      const pb = (maxH - sorted[i].l) / maxH * 100;
      if (pb > pullback) pullback = pb;
    }
    // 14:50 종가가 dayHigh -1% 이내 = 재돌파
    const near_high = close_last >= dayHigh * 0.99;
    if (pullback >= 5 && near_high) {
      pattern_A = true;
      pattern_A_reason = `매물 조정 ${pullback.toFixed(1)}% 후 재돌파 (${close_last}/${dayHigh})`;
    }
  }
  // 패턴 B: 당일 저가가 MA5 터치 → 15:00 종가가 MA5 위로 +1% 이상
  let pattern_B = false;
  let pattern_B_reason = '';
  if (ma5 > 0 && dayLow > 0) {
    const touched = dayLow <= ma5 * 1.005;
    const recovered = close_last >= ma5 * 1.01;
    if (touched && recovered) {
      pattern_B = true;
      pattern_B_reason = `MA5(${ma5}) 터치 후 회복 (${close_last})`;
    }
  }
  // 패턴 C: 14:00~14:50 박스권 (range ≤ 1.5%) + 14:50 분봉 거래량 2배+
  let pattern_C = false;
  let pattern_C_reason = '';
  if (i_1450 - i_1400 > 5) {
    const boxRange = sorted.slice(i_1400, i_1450);
    const hi = Math.max(...boxRange.map(b => +b.h || 0));
    const lo = Math.min(...boxRange.map(b => +b.l || 0));
    const rangePct = lo > 0 ? (hi - lo) / lo * 100 : 99;
    if (rangePct <= 1.5) {
      // 14:50 거래량 vs 직전 5개 분봉 평균
      const lastVol = +sorted[i_last].v || 0;
      const prevAvg = boxRange.slice(-5).reduce((a, b) => a + (+b.v || 0), 0) / 5;
      if (prevAvg > 0 && lastVol >= prevAvg * 2) {
        pattern_C = true;
        pattern_C_reason = `박스권 ${rangePct.toFixed(2)}% + 거래량 ${(lastVol/prevAvg).toFixed(1)}x`;
      }
    }
  }
  return {
    late_momentum, late_pct,
    pattern_A, pattern_A_reason,
    pattern_B, pattern_B_reason,
    pattern_C, pattern_C_reason,
    barCount: sorted.length,
    last_close: close_last,
    close_1430, close_1500
  };
}

// 자동 평가 (screening signal → 점수/판정)
function evaluate(s, leaderMap, sectorMap, intradayAnalysis) {
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
  if (amt < EXCLUDE.vol_min_eok) excludeReasons.push(`거래대금 ${amt}억 < ${EXCLUDE.vol_min_eok}억`);
  if (ch >= EXCLUDE.ret_high) excludeReasons.push(`D등락 ${ch.toFixed(2)}% ≥ 29%`);
  if (cum5 > EXCLUDE.cum5_high) excludeReasons.push(`5일누적 ${cum5.toFixed(1)}% > 30%`);
  // 시총 데이터 없음 (생략)
  if (excludeReasons.length > 0) {
    return { verdict: 'EXCLUDE', mustPasses: 0, mustTotal: 5, safePasses: 0, safeTotal: 3, excludeReasons, checks: {}, data: { ch, amt, cum5, h60, h120, maAlign, rangePos, c, h, l, o } };
  }

  // 5대 필수 조건
  const must = {
    vol_2000eok: { pass: amt >= MUST.vol_eok, label: `거래대금 ${amt}억 ${amt>=MUST.vol_eok?'≥':'<'} ${MUST.vol_eok}억` },
    core_theme: {
      pass: !!sector && themeInfo && themeInfo.themeChange >= 1.0,
      label: themeInfo
        ? `테마: ${sector} (${themeInfo.themeChange>=0?'+':''}${themeInfo.themeChange.toFixed(2)}%, 테마내 ${themeRank}등)`
        : sector ? `테마: ${sector}` : `수급: ${s.investor||s.supply||'미지정'} (테마 미매칭)`,
      tbd: !themeInfo
    },
    new_high: { pass: h60===1 || h120===1, label: h60===1 && h120===1 ? '60일+120일 신고가 동시' : h60===1 ? '60일 신고가' : h120===1 ? '120일 신고가' : '신고가 미달성' },
    late_momentum: intradayAnalysis ? {
      pass: intradayAnalysis.late_momentum,
      label: `장 막판 ${intradayAnalysis.late_pct>=0?'+':''}${intradayAnalysis.late_pct.toFixed(2)}% (14:30→15:00 분봉)`,
      tbd: false
    } : {
      pass: rangePos >= MUST.late_close_pos,
      label: `종가위치 ${(rangePos*100).toFixed(0)}% ${rangePos>=MUST.late_close_pos?'≥':'<'} 80% (분봉 로딩 중 → 종가위치 대체)`,
      tbd: true
    },
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

  // 패턴 — 분봉 분석 결과 우선, 없으면 추정
  const pattern = intradayAnalysis ? {
    pattern_A: intradayAnalysis.pattern_A,
    pattern_A_reason: intradayAnalysis.pattern_A_reason,
    pattern_B: intradayAnalysis.pattern_B,
    pattern_B_reason: intradayAnalysis.pattern_B_reason,
    pattern_C: intradayAnalysis.pattern_C,
    pattern_C_reason: intradayAnalysis.pattern_C_reason,
    hasIntraday: true,
  } : {
    pattern_A: rangePos >= 0.85 && (h60===1 || h120===1),
    pattern_B: false,
    pattern_C: false,
    hasIntraday: false,
  };

  // 통과/비통과 카운트
  const mustPasses = Object.values(must).filter(x => x.pass).length;
  const mustTotal = Object.keys(must).length;
  const safePasses = Object.values(safe).filter(x => x.pass).length;
  const safeTotal = Object.keys(safe).length;
  const patternPasses = (pattern.pattern_A ? 1 : 0) + (pattern.pattern_B ? 1 : 0) + (pattern.pattern_C ? 1 : 0);

  // 판정 — 점수 없이 통과/비통과 기준
  // STRONG: 필수 5/5 + 안전 3/3 모두 통과
  // BUY: 필수 4/5 + 안전 3/3
  // HOLD: 그 외 (필수 ≥3, 안전 ≥2)
  // EXCLUDE: 필수 ≤2 또는 안전 ≤1
  let verdict = 'HOLD';
  if (mustPasses === mustTotal && safePasses === safeTotal) verdict = 'STRONG';
  else if (mustPasses >= 4 && safePasses === safeTotal) verdict = 'BUY';
  else if (mustPasses >= 3 && safePasses >= 2) verdict = 'HOLD';
  else verdict = 'EXCLUDE';

  // 추천 비중 — 대장주 여부 + 판정으로만 결정
  let weight = 0;
  if (verdict === 'STRONG') weight = isLeader ? 100 : 50;
  else if (verdict === 'BUY') weight = isLeader ? 50 : 30;
  else if (verdict === 'HOLD') weight = 0; // 보류는 매수 안함

  return { verdict, mustPasses, mustTotal, safePasses, safeTotal, patternPasses, excludeReasons:[], checks: { must, safe, pattern }, weight, isLeader, isThemeLeader, isMktLeader, leaderRank, themeRank, themeInfo, data: { ch, amt, cum5, h60, h120, maAlign, rangePos, c, h, l, o } };
}

export function HaseunghoonClosingBetTab({ theme = "dark" }) {
  const _T = theme === "dark"
    ? { text:'#e6edf3', body:'#c9d1d9', sub:'#8b949e', hint:'#6e7681', mute:'#484f58', line:'#30363d', linelt:'#21262d', bg:'#0d1117', card:'#161b22', up:'#f85149', down:'#58a6ff', accent:'#7c3aed', green:'#10b981' }
    : { text:'#191f28', body:'#333d4b', sub:'#4e5968', hint:'#6b7684', mute:'#8b95a1', line:'#e5e8eb', linelt:'#f2f4f6', bg:'#f9fafb', card:'#ffffff', up:'#f04452', down:'#1f6dee', accent:'#7c3aed', green:'#10b981' };

  const [data, setData] = useState(null);
  const [themesData, setThemesData] = useState(null);
  const [intradayMap, setIntradayMap] = useState({}); // code -> bars[]
  const [intradayLoading, setIntradayLoading] = useState({}); // code -> bool
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

  // 분봉 fetch (개별 종목)
  const fetchIntraday = useCallback(async (code) => {
    const c = String(code).padStart(6, '0');
    if (intradayMap[c] || intradayLoading[c]) return;
    setIntradayLoading(p => ({ ...p, [c]: true }));
    try {
      const r = await fetch(`${INTRADAY_URL}?codes=${c}`);
      const d = await r.json();
      const bars = (d.bars_per_stock && d.bars_per_stock[c]) ? null : (d.bars && d.bars[c]) || null;
      // 응답 형식 확인 후 저장 — 실제 데이터는 bars 또는 직접 bars_per_stock
      setIntradayMap(p => ({ ...p, [c]: bars || d.minute_bars || d.intraday || [] }));
    } catch (e) {
      setIntradayMap(p => ({ ...p, [c]: [] }));
    } finally {
      setIntradayLoading(p => ({ ...p, [c]: false }));
    }
  }, [intradayMap, intradayLoading]);

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
      .map(s => {
        const c = String(s.code).padStart(6, '0');
        const bars = intradayMap[c];
        const intradayAnalysis = bars && bars.length > 0
          ? analyzeIntraday(bars, +s.high||0, +s.low||0, +s.price||+s.close||0, +s.ma5||0)
          : null;
        return { ...s, eval: evaluate(s, leaderMap, sectorMap, intradayAnalysis), intradayAnalysis };
      })
      .sort((a, b) => {
        // 1. verdict 우선순위 (STRONG > BUY > HOLD > EXCLUDE)
        const order = { STRONG: 0, BUY: 1, HOLD: 2, EXCLUDE: 3 };
        if (order[a.eval.verdict] !== order[b.eval.verdict]) return order[a.eval.verdict] - order[b.eval.verdict];
        // 2. 필수 통과 수
        if (b.eval.mustPasses !== a.eval.mustPasses) return b.eval.mustPasses - a.eval.mustPasses;
        // 3. 등락률
        return (+b.change||0) - (+a.change||0);
      });
  }, [data, leaderMap, sectorMap, intradayMap]);

  // STRONG/BUY 후보 자동 분봉 fetch (1초 간격)
  useEffect(() => {
    const candidates = evaluated.filter(s =>
      (s.eval.verdict === 'STRONG' || s.eval.verdict === 'BUY')
      && !intradayMap[String(s.code).padStart(6, '0')]
    ).slice(0, 5); // 상위 5개만
    if (candidates.length === 0) return;
    let cancelled = false;
    (async () => {
      for (const s of candidates) {
        if (cancelled) break;
        await fetchIntraday(s.code);
        await new Promise(r => setTimeout(r, 500));
      }
    })();
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [evaluated.length > 0]);

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
        <div style={{color:_T.sub}}>14:50~15:25 자동 스캔 — 거래대금 상위 종목 5대 필수 + 3대 안전 통과 여부 평가</div>
        <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(180px, 1fr))', gap:8, marginTop:8}}>
          <div style={{padding:'6px 9px', background:_T.linelt, borderRadius:6, fontSize:11}}>
            <b style={{color:_T.text}}>5대 필수 조건</b>
            <ul style={{margin:'3px 0 0', paddingLeft:14, color:_T.sub}}>
              <li>거래대금 ≥ 500억</li>
              <li>신고가 60/120일</li>
              <li>장 막판 매수세 (분봉)</li>
              <li>대장주 (테마/시장 1등)</li>
              <li>핵심 테마 (등락률 ≥ 1%)</li>
            </ul>
          </div>
          <div style={{padding:'6px 9px', background:_T.linelt, borderRadius:6, fontSize:11}}>
            <b style={{color:_T.text}}>3대 안전 조건</b>
            <ul style={{margin:'3px 0 0', paddingLeft:14, color:_T.sub}}>
              <li>D등락 10~28%</li>
              <li>5일 누적 ≤ 30%</li>
              <li>MA정배열</li>
            </ul>
          </div>
          <div style={{padding:'6px 9px', background:_T.linelt, borderRadius:6, fontSize:11}}>
            <b style={{color:_T.text}}>매수 타점 패턴 (분봉)</b>
            <ul style={{margin:'3px 0 0', paddingLeft:14, color:_T.sub}}>
              <li>A 매물소화 후 재돌파</li>
              <li>B 5일선 눌림목 회복</li>
              <li>C 장 막판 박스권 돌파</li>
            </ul>
          </div>
          <div style={{padding:'6px 9px', background:_T.linelt, borderRadius:6, fontSize:11}}>
            <b style={{color:_T.text}}>판정 기준</b>
            <ul style={{margin:'3px 0 0', paddingLeft:14, color:_T.sub}}>
              <li>🟢 강력: 필수 5/5 + 안전 3/3</li>
              <li>🟡 진입: 필수 4/5 + 안전 3/3</li>
              <li>🟠 보류: 필수 ≥3 + 안전 ≥2</li>
              <li>🔴 제외: 그 외 / 자동제외</li>
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
                    <span style={{fontSize:14, fontWeight:800, color:_gradeColor(v), letterSpacing:'-0.3px'}}>필수 {ev.mustPasses}/{ev.mustTotal}</span>
                    <span style={{fontSize:12, color:_T.sub, fontWeight:700}}>안전 {ev.safePasses}/{ev.safeTotal}</span>
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
                      <Section title={`매수 타점 패턴 (분봉 ${ev.checks.pattern?.hasIntraday ? '✓' : '로딩...'})`} col="#10b981" _T={_T}>
                        <Check pass={ev.checks.pattern?.pattern_A} label={`패턴 A: 매물 조정 후 재돌파${ev.checks.pattern?.pattern_A_reason ? ' — '+ev.checks.pattern.pattern_A_reason : ''}`} tbd={!ev.checks.pattern?.hasIntraday} _T={_T} />
                        <Check pass={ev.checks.pattern?.pattern_B} label={`패턴 B: 5일선 눌림목 회복${ev.checks.pattern?.pattern_B_reason ? ' — '+ev.checks.pattern.pattern_B_reason : ''}`} tbd={!ev.checks.pattern?.hasIntraday} _T={_T} />
                        <Check pass={ev.checks.pattern?.pattern_C} label={`패턴 C: 장 막판 박스권 돌파${ev.checks.pattern?.pattern_C_reason ? ' — '+ev.checks.pattern.pattern_C_reason : ''}`} tbd={!ev.checks.pattern?.hasIntraday} _T={_T} />
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
                      {/* 분봉 흐름 */}
                      {s.intradayAnalysis && (
                        <Section title={`분봉 흐름 (1분봉 ${s.intradayAnalysis.barCount}개)`} col="#0d9488" _T={_T}>
                          <DataRow l="14:30 종가" v={_won(s.intradayAnalysis.close_1430)} _T={_T} />
                          <DataRow l="15:00 종가" v={_won(s.intradayAnalysis.close_1500)} _T={_T} />
                          <DataRow l="14:30→15:00 변동" v={`${s.intradayAnalysis.late_pct>=0?'+':''}${s.intradayAnalysis.late_pct.toFixed(2)}%`} c={s.intradayAnalysis.late_pct>=0?_T.up:_T.down} _T={_T} />
                          <DataRow l="최종가" v={_won(s.intradayAnalysis.last_close)} _T={_T} />
                          <DataRow l="장 막판 매수세" v={s.intradayAnalysis.late_momentum?'✅ 유지':'❌ 약화'} c={s.intradayAnalysis.late_momentum?_T.up:_T.mute} _T={_T} />
                        </Section>
                      )}
                      {/* 분봉 미로딩 시 수동 fetch 버튼 */}
                      {!s.intradayAnalysis && !intradayMap[String(s.code).padStart(6,'0')] && (
                        <button onClick={(e)=>{e.stopPropagation();fetchIntraday(s.code);}} disabled={intradayLoading[String(s.code).padStart(6,'0')]} style={{marginTop:10,padding:'6px 14px',borderRadius:7,border:'1px solid '+_T.line,background:_T.bg,color:_T.body,fontSize:11,fontWeight:700,cursor:'pointer'}}>
                          {intradayLoading[String(s.code).padStart(6,'0')] ? '⏳ 분봉 로딩...' : '📊 분봉 데이터 가져오기'}
                        </button>
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
