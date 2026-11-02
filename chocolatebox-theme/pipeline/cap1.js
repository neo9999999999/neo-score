const { chromium } = require('playwright');
const S = process.argv[2]; const themes = process.argv[3].split(','); const screens = (process.argv[4] || 'boxes,shop,detail,news,buy').split(',');
(async () => {
  const b = await chromium.launch();
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, reducedMotion: 'reduce' });
  await ctx.route('**/*', r => r.request().url().startsWith('file:') ? r.continue() : r.abort());
  const page = await ctx.newPage();
  page.on('pageerror', e => console.log('pageerror:', e.message));
  for (const t of themes) for (const s of screens) {
    await page.goto(`file://${S}/design/index.html?theme=${t}&screen=${s}&preview=0`);
    await page.waitForTimeout(200);
    await page.screenshot({ path: `${S}/design/phones/${t}-${s}.png` });
  }
  await b.close();
})();
