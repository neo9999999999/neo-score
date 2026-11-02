const { chromium } = require('playwright');
const S = process.argv[2];
(async () => {
  const b = await chromium.launch();
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, reducedMotion: 'reduce' });
  await ctx.route('**/*', r => r.request().url().startsWith('file:') ? r.continue() : r.abort());
  const page = await ctx.newPage();
  for (const t of ['default','christmas','newyear','valentine','spring','family','summer','autumn']) {
    await page.goto(`file://${S}/design/index.html?theme=${t}&screen=boxes&preview=0`);
    await page.waitForTimeout(200);
    const r = await page.evaluate(() => { const g = document.querySelector('.boxgrid').getBoundingClientRect(); return { y: g.top }; });
    await page.screenshot({ path: `${S}/design/phones/${t}-frames.png`, clip: { x: 0, y: r.y - 4, width: 390, height: 300 } });
  }
  await b.close();
})();
