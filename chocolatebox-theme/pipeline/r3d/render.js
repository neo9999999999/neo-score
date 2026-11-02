const { chromium } = require('playwright');
const path = require('path');
const dir = __dirname;
const themes = (process.argv[2] || 'christmas').split(',');
const MODE = process.argv[3] || 'banner';
const SIZE = MODE === 'charm' ? [800, 800] : [1600, 800];
(async () => {
  const b = await chromium.launch({ args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
  const ctx = await b.newContext({ viewport: { width: SIZE[0], height: SIZE[1] } });
  const fs = require('fs');
  await ctx.route('**/*', r => { const u = new URL(r.request().url()); if (u.host !== 'local.test') return r.abort(); const f = path.join(dir, decodeURIComponent(u.pathname)); if (!fs.existsSync(f)) return r.fulfill({ status: 404 }); const ct = f.endsWith('.js') ? 'text/javascript' : f.endsWith('.html') ? 'text/html' : 'application/octet-stream'; r.fulfill({ status: 200, contentType: ct, body: fs.readFileSync(f) }); });
  const page = await ctx.newPage();
  page.on('console', m => console.log('console:', m.text()));
  page.on('pageerror', e => console.log('pageerror:', e.message));
  for (const t of themes) {
    await page.goto(`http://local.test/scene.html?theme=${t}&mode=${MODE}&w=${SIZE[0]}&h=${SIZE[1]}`);
    await page.waitForFunction(() => window.__done, null, { timeout: 120000 });
    await page.screenshot({ path: `${dir}/out-${MODE}-${t}.png`, omitBackground: true });
    console.log('ok', t);
  }
  await b.close();
})();
