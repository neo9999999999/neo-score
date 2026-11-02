const fs = require('fs');
const { chromium } = require('playwright');
const S = process.argv[2];
const D = `${S}/design`;
const src = fs.readFileSync(`${D}/index.html`, 'utf8');
const DATA = JSON.parse(src.match(/<script type="application\/json" id="themes">\n([\s\S]*?)\n<\/script>/)[1]);
const code = src.match(/\/\* DERIVE:START \*\/([\s\S]*?)\/\* DERIVE:END \*\//)[1];
const { derive } = new Function(code + '; return { derive };')();
const T = DATA.themes;
const ORDER = ['christmas', 'newyear', 'valentine', 'spring', 'family', 'summer', 'autumn'];
const ALL = ['default', ...ORDER];
const img = (f) => 'data:image/png;base64,' + fs.readFileSync(`${D}/phones/${f}.png`).toString('base64');
const fmtW = (w) => (w ? `${+w[0].slice(0, 2)}/${+w[0].slice(3)} – ${+w[1].slice(0, 2)}/${+w[1].slice(3)}` : '기본 · 상시');
const EN = { default: 'Everyday', christmas: 'Merry Chocolate Christmas', newyear: 'Golden New Year', valentine: 'Sweet Valentine', spring: 'Blossom Spring', family: 'Thank-you May', summer: 'Cool Summer Splash', autumn: 'Maple Autumn' };
const CONCEPT = {
  christmas: '3D 트리 · 오너먼트 · 선물상자가 배너 양옆을 감싸는 무대형 키비주얼. 박스는 원본 그대로, 골드 포일 테두리와 오너먼트 참으로만 시즌을 입힙니다.',
  newyear: '복주머니와 엽전, 금빛 반짝임. 네이비 무대 위 골드 타이틀로 새해 첫 박스의 설렘을, 박스엔 금박 테두리.',
  valentine: '초콜릿 서비스의 가장 큰 시즌. 광택 하트 · 초콜릿 하트 · 트러플 3D 오브제와 로즈골드 테두리로 달콤하게.',
  spring: '3D 벚꽃 가지와 흩날리는 꽃잎. 펄 핑크 테두리로 박스는 그대로 두고 봄빛만 더합니다.',
  family: '카네이션 꽃다발과 감사 편지 3D 오브제. 코럴 골드 테두리로 따뜻한 가정의 달.',
  summer: '비치볼 · 튜브 · 아이스바 · 수박 3D 오브제. 아쿠아 홀로그램 테두리로 시원하게.',
  autumn: '단풍잎 · 감 · 도토리 3D 오브제. 코퍼(구리빛) 포일 테두리로 깊은 가을 톤.'
};
const DEV = {
  christmas: ['3D 트리·오너먼트 배너', '골드 포일 박스 테두리', '오너먼트 3D 참', '전구줄 가랜드'],
  newyear: ['3D 복주머니·엽전 배너', '금박 박스 테두리', '복주머니 3D 참', '별 가랜드'],
  valentine: ['3D 하트·트러플 배너', '로즈골드 박스 테두리', '하트 3D 참', '하트 가랜드'],
  spring: ['3D 벚꽃가지 배너', '펄 핑크 박스 테두리', '벚꽃 3D 참', '벚꽃 가랜드'],
  family: ['3D 카네이션 꽃다발 배너', '코럴 골드 박스 테두리', '카네이션 3D 참', '카네이션 가랜드'],
  summer: ['3D 비치볼·튜브 배너', '아쿠아 홀로 박스 테두리', '비치볼 3D 참', '파도 띠'],
  autumn: ['3D 단풍·감 배너', '코퍼 포일 박스 테두리', '단풍잎 3D 참', '단풍 가랜드']
};
const KO = { lights: '전구줄 가랜드', stars: '별 가랜드', hearts: '하트 가랜드', blossoms: '벚꽃 가랜드', carnations: '카네이션 가랜드', waves: '파도 띠', leaves: '단풍 가랜드', tree: '트리', firework: '불꽃놀이', heart: '광택 하트', branch: '벚꽃 가지', carnation: '카네이션', sun: '해와 파도', maple: '단풍잎', flake: '눈꽃', star: '별', blossom: '벚꽃', petal: '꽃잎', dot: '빛망울', piece: '초콜릿 조각', bubble: '물방울', wave: '물결', burst: '불꽃', confetti: '색종이', acorn: '도토리' };
const SCREENS = [['boxes', '박스구매 홈'], ['shop', '포인트샵'], ['detail', '상품상세'], ['news', '뉴스룸'], ['buy', '구매하기']];
const BASE = `*{box-sizing:border-box}body{margin:0;font-family:'Noto Sans KR',system-ui,sans-serif;word-break:keep-all;-webkit-font-smoothing:antialiased}
.phone{position:relative;border-radius:46px;padding:10px;background:#0E0E10;box-shadow:0 40px 80px rgba(0,0,0,.35),0 0 0 1.5px rgba(255,255,255,.08) inset}
.phone .scr{overflow:hidden;border-radius:36px;background:#fff}.phone img{display:block;width:100%}
.lbl{margin-top:16px;text-align:center;font-size:17px;font-weight:700;letter-spacing:-.01em}
.chip{display:inline-flex;align-items:center;gap:8px;padding:6px 14px;border-radius:999px;font-size:15px;font-weight:700}
.sw{display:flex;flex-direction:column;gap:6px;font-size:12px;font-weight:500}.sw i{display:block;width:54px;height:54px;border-radius:16px;box-shadow:0 0 0 1px rgba(255,255,255,.25) inset}`;
const phone = (f, w) => `<div class="phone" style="width:${w}px"><div class="scr"><img src="${img(f)}"></div></div>`;

function themeBoard(id, idx) {
  const t = T[id], d = derive(t.seeds), o = t.orn;
  const devices = DEV[id];
  const sw = [['헤더', d['--header-bg']], ['CTA', d['--cta-bg']], ['강조', d['--accent']], ['배너', t.seeds.banner[1]], ['번호판', t.seeds.grid[1]], ['선택', t.seeds.mine]];
  return `<!doctype html><html lang="ko"><head><meta charset="utf-8"><style>${BASE}
  body{width:1920px;height:1080px;overflow:hidden;color:#fff;background:radial-gradient(circle at 78% 30%, ${t.seeds.glow || '#fff'}55, transparent 45%), linear-gradient(135deg, ${t.seeds.banner[0]}, ${t.seeds.grid[1]} 60%, ${t.seeds.grid[0]})}
  .wrap{position:absolute;inset:0;display:flex;align-items:center;gap:56px;padding:0 64px 0 80px}
  .left{flex:0 0 440px}.k{font-size:15px;font-weight:700;letter-spacing:.18em;opacity:.85}
  h1{margin:14px 0 4px;font-size:76px;line-height:1.05;font-weight:900;letter-spacing:-.04em;text-shadow:0 4px 0 rgba(0,0,0,.18),0 18px 40px rgba(0,0,0,.3)}
  .en{font-size:24px;font-weight:700;color:${o.hl || '#FFD84D'}}
  .desc{margin:22px 0 0;font-size:19px;line-height:1.65;opacity:.95}
  .dev{display:flex;flex-wrap:wrap;gap:8px;margin-top:22px}.dev span{padding:6px 12px;border-radius:999px;background:rgba(255,255,255,.16);font-size:14px;font-weight:700}
  .sws{display:flex;gap:12px;margin-top:30px}
  .phones{display:flex;gap:22px;align-items:flex-start}
  </style></head><body><div class="wrap"><div class="left">
  <div class="k">SEASON SKIN ${String(idx).padStart(2, '0')} / 07</div>
  <h1>${t.name}</h1><div class="en">${EN[id]}</div>
  <div style="margin-top:18px"><span class="chip" style="background:rgba(255,255,255,.95);color:${d['--accent']}">${fmtW(t.window)}</span></div>
  <p class="desc">${CONCEPT[id]}</p>
  <div class="dev">${devices.map((v) => `<span>${v}</span>`).join('')}</div>
  <div class="sws">${sw.map(([l, c]) => `<div class="sw"><i style="background:${c}"></i>${l}</div>`).join('')}</div>
  </div><div class="phones">${SCREENS.map(([s, l]) => `<div>${phone(id + '-' + s, 234)}<div class="lbl">${l}</div></div>`).join('')}</div></div></body></html>`;
}

function overview() {
  const segs = [['newyear', 1, 19], ['valentine', 20, 51], ['spring', 52, 120], ['family', 121, 151], ['summer', 152, 243], ['autumn', 244, 334], ['christmas', 335, 360], ['newyear', 361, 365]];
  return `<!doctype html><html lang="ko"><head><meta charset="utf-8"><style>${BASE}
  body{width:1920px;height:1460px;overflow:hidden;background:#F4F1EC;color:#141414}
  .top{padding:64px 80px 0;display:flex;justify-content:space-between;align-items:flex-end}
  .k{font-size:15px;font-weight:700;letter-spacing:.18em;color:#8A8278}
  h1{margin:10px 0 0;font-size:64px;font-weight:900;letter-spacing:-.04em;line-height:1.1}
  .sub{margin-top:10px;font-size:20px;color:#5A544C}
  .cal{margin:34px 80px 0;display:flex;height:46px;border-radius:14px;overflow:hidden}
  .cal span{display:flex;align-items:center;justify-content:center;color:#fff;font-size:14px;font-weight:700;white-space:nowrap;overflow:hidden}
  .mon{margin:6px 80px 0;display:flex;font-size:12px;color:#8A8278}.mon span{flex:1;text-align:center}
  .grid{display:grid;grid-template-columns:repeat(8,1fr);gap:22px;padding:44px 80px 0}
  .cell .lbl{margin-top:14px;font-size:17px}.cell .d{text-align:center;font-size:13px;color:#7A7268;margin-top:2px}
  </style></head><body>
  <div class="top"><div><div class="k">CHOCOLATEBOX · SEASON SKIN SYSTEM</div><h1>같은 화면, 8개의 계절</h1><div class="sub">구조와 3D 박스 원본은 그대로 두고, 컬러 톤 · 3D 키비주얼 · 박스 테두리 · 문구만 바꿉니다. 날짜에 따라 자동 전환됩니다.</div></div></div>
  <div class="cal">${segs.map(([id, a, b]) => `<span style="flex:${b - a + 1};background:${derive(T[id].seeds)['--header-bg']}">${b - a > 14 ? T[id].name : ''}</span>`).join('')}</div>
  <div class="mon">${Array.from({ length: 12 }, (_, i) => `<span>${i + 1}월</span>`).join('')}</div>
  <div class="grid">${ALL.map((id) => `<div class="cell">${phone(id + '-boxes', 199)}<div class="lbl">${T[id].name}</div><div class="d">${fmtW(T[id].window)}</div></div>`).join('')}</div>
  <div style="padding:30px 80px 0;display:grid;grid-template-columns:repeat(8,1fr);gap:22px">${ALL.map((id) => `<div>${phone(id + '-buy', 199)}</div>`).join('')}</div>
  </body></html>`;
}

const crop = async (page, f, x, y, w, h, scale) => {
  // returns data url of a crop from a phone screenshot via canvas in page
  return page.evaluate(async ({ src, x, y, w, h, scale }) => {
    const im = new Image(); im.src = src; await im.decode();
    const c = document.createElement('canvas'); c.width = Math.round(w * scale); c.height = Math.round(h * scale);
    const g = c.getContext('2d'); g.imageSmoothingQuality = 'high'; g.drawImage(im, x, y, w, h, 0, 0, c.width, c.height);
    return c.toDataURL('image/png');
  }, { src: img(f), x, y, w, h, scale });
};
async function frames(page) {
  const cells = [];
  for (const id of ['default', ...ORDER]) cells.push([id, img(id + '-frames')]);
  return `<!doctype html><html lang="ko"><head><meta charset="utf-8"><style>${BASE}
  body{width:1920px;height:1080px;overflow:hidden;background:#F4F1EC;color:#141414}
  .top{padding:56px 80px 0}.k{font-size:15px;font-weight:700;letter-spacing:.18em;color:#8A8278}
  h1{margin:10px 0 0;font-size:52px;font-weight:900;letter-spacing:-.04em}.sub{margin-top:8px;font-size:19px;color:#5A544C}
  .g{display:grid;grid-template-columns:repeat(4,1fr);gap:26px 26px;padding:34px 80px 0}
  .c{border-radius:22px;overflow:hidden;background:#F4F4F4;box-shadow:0 10px 30px rgba(0,0,0,.08)}.c img{display:block;width:100%;height:auto}
  .n{display:flex;justify-content:space-between;align-items:center;margin-top:10px;font-size:17px;font-weight:800}.n span{font-size:13px;font-weight:500;color:#7A7268}
  </style></head><body><div class="top"><div class="k">BOX FRAME SYSTEM</div><h1>박스는 그대로, 테두리로 시즌을 입힌다</h1>
  <div class="sub">3D 박스 이미지 내부는 원본 유지 · 3px 포일 그라데이션 테두리 + 안쪽 펄 하이라이트 + 시즌 컬러 그림자 + 모서리 3D 참</div></div>
  <div class="g">${cells.map(([id, src]) => `<div><div class="c"><img src="${src}"></div><div class="n">${T[id].name}<span>${FOIL[id]}</span></div></div>`).join('')}</div></body></html>`;
}
const FOIL = { default: '테두리 없음 (기본)', christmas: '골드 포일 · 오너먼트', newyear: '금박 · 복주머니', valentine: '로즈골드 · 하트', spring: '펄 핑크 · 벚꽃', family: '코럴 골드 · 카네이션', summer: '아쿠아 홀로 · 비치볼', autumn: '코퍼 포일 · 단풍잎' };
async function visuals(page) {
  const cells = [];
  for (const id of ORDER) cells.push([id, await crop(page, id + '-boxes', 32, 136, 716, 404, 1), await crop(page, id + '-buy', 0, 100, 780, 420, 1)]);
  return `<!doctype html><html lang="ko"><head><meta charset="utf-8"><style>${BASE}
  body{width:1920px;height:1300px;overflow:hidden;background:#111114;color:#fff}
  .top{padding:56px 80px 0}.k{font-size:15px;font-weight:700;letter-spacing:.18em;color:#9C948A}
  h1{margin:10px 0 0;font-size:52px;font-weight:900;letter-spacing:-.04em}.sub{margin-top:8px;font-size:19px;color:#C8C0B6}
  .g{display:grid;grid-template-columns:repeat(4,1fr);gap:22px;padding:34px 80px 0}
  .c img{display:block;width:100%;border-radius:18px}.c .b{margin-top:10px}.n{margin-top:8px;font-size:16px;font-weight:800}
  </style></head><body><div class="top"><div class="k">SEASON KEY VISUAL</div><h1>배너 · 상단 키비주얼</h1>
  <div class="sub">3D 렌더 오브제를 양옆에 배치하고 가운데는 입체 타이틀 — 홈 배너와 구매하기 상단이 같은 무대를 공유합니다.</div></div>
  <div class="g">${cells.map(([id, a, b2]) => `<div class="c"><img src="${a}"><img class="b" src="${b2}"><div class="n">${T[id].name} · ${EN[id]}</div></div>`).join('')}</div></body></html>`;
}

function principles() {
  const P = [
    ['1', '구조는 그대로, 스킨만 교체', '배치·흐름은 고정하고 색·질감·장식만 바꾼다', '게임 리스킨 · LiveOps 실무 글'],
    ['2', '첫 화면에서 크게 알린다', '이벤트는 로비(박스구매 배너)에서 존재감 있게', 'Roblox LiveOps 가이드'],
    ['3', '브랜드는 알아볼 수 있게', '3D 박스 원본 · 코인 · 검정 버튼 · 탭 구조는 그대로', '시즌 아이콘 가이드'],
    ['4', '글씨는 깨끗하게', '장식은 글씨 영역을 피하고, 대비 4.5:1 유지', '가독성 이슈 사례'],
    ['5', '시드 컬러 하나에서 파생', '시드색 → 카드·태그·번호판 팔레트 자동 생성', 'Material 3 Dynamic Color']
  ];
  const marks = [['①', 28, 'header', '헤더 컬러'], ['②', 64, 'garland', '가랜드(전구줄)'], ['③', 160, 'banner', '3D 키비주얼 배너 + 입체 타이틀'], ['④', 286, 'sticker', '3D 시즌 참'], ['⑤', 380, 'box', '포일 테두리 (박스 원본 유지)'], ['⑥', 805, 'tab', '탭 활성 틴트']];
  const W = 360, k = (W - 20) / 390;
  return `<!doctype html><html lang="ko"><head><meta charset="utf-8"><style>${BASE}
  body{width:1920px;height:1080px;overflow:hidden;background:#141414;color:#fff}
  .wrap{position:absolute;inset:0;display:flex;gap:70px;padding:72px 80px}
  .left{flex:1}.k{font-size:15px;font-weight:700;letter-spacing:.18em;color:#9C948A}
  h1{margin:12px 0 30px;font-size:56px;font-weight:900;letter-spacing:-.04em;line-height:1.12}
  .p{display:flex;gap:18px;padding:18px 0;border-top:1px solid rgba(255,255,255,.12)}
  .p b{flex:none;display:grid;place-items:center;width:44px;height:44px;border-radius:50%;background:#FFD84D;color:#141414;font-size:20px;font-weight:900}
  .p h3{margin:0;font-size:23px;font-weight:800}.p div{font-size:17px;color:#D8D2C8;margin-top:2px}.p small{display:block;margin-top:4px;font-size:13px;color:#8F877C}
  .right{position:relative;flex:0 0 720px}.mk{position:absolute;display:flex;align-items:center;gap:10px;font-size:18px;font-weight:800;white-space:nowrap}
  .mk i{display:grid;place-items:center;width:34px;height:34px;border-radius:50%;background:#FFD84D;color:#141414;font-style:normal;font-size:18px;font-weight:900}
  .mk:before{content:"";position:absolute;right:100%;top:50%;width:46px;border-top:2px dashed rgba(255,216,77,.7)}
  </style></head><body><div class="wrap"><div class="left"><div class="k">REFERENCES → APPLICATION</div><h1>레퍼런스에서 가져온<br>5가지 적용 원칙</h1>
  ${P.map(([n, h, d, s]) => `<div class="p"><b>${n}</b><div><h3>${h}</h3><div>${d}</div><small>근거 · ${s}</small></div></div>`).join('')}
  </div><div class="right"><div style="position:absolute;left:0;top:0">${phone('christmas-boxes', W)}</div>
  ${marks.map(([m, y, , l]) => `<div class="mk" style="left:${W + 70}px;top:${10 + y * k - 17}px"><i>${m}</i>${l}</div>`).join('')}
  </div></div></body></html>`;
}

(async () => {
  const b = await chromium.launch();
  const ctx = await b.newContext({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 1.5 });
  await ctx.route('**/*', (r) => (r.request().url().startsWith('data:') || r.request().url().startsWith('file:') || r.request().url() === 'about:blank' ? r.continue() : r.abort()));
  const page = await ctx.newPage();
  const shoot = async (html, name, h = 1080) => { await page.setViewportSize({ width: 1920, height: h }); await page.setContent(html, { waitUntil: 'load' }); await page.waitForTimeout(200); await page.screenshot({ path: `${D}/boards/${name}.png` }); };
  await shoot(overview(), '00-overview', 1460);
  await shoot(principles(), '01-principles');
  await shoot(await frames(page), '09-box-frames');
  await shoot(await visuals(page), '10-key-visuals', 1300);
  let i = 1;
  for (const id of ORDER) { await shoot(themeBoard(id, i), `${String(i + 1).padStart(2, '0')}-${id}`); i++; }
  await b.close();
  console.log('boards done');
})();
