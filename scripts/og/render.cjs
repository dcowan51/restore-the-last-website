// Renders the link-preview cards in this folder to public/og/*.png at 1200x630.
// Playwright isn't a dependency of the site, so this borrows the copy installed
// for the social-graphics engine next door in the Cowork workspace (or wherever
// PLAYWRIGHT_MODULE points):
//
//   node scripts/og/render.cjs
//
// Re-run it after editing any .html file here, and commit the PNG it writes.
const { readdirSync } = require('node:fs');
const { join, resolve } = require('node:path');
const { chromium } = require(
  process.env.PLAYWRIGHT_MODULE ||
    resolve(__dirname, '../../../../CalmWaves/Social-Graphics/node_modules/playwright')
);

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });
  for (const name of readdirSync(__dirname).filter((f) => f.endsWith('.html'))) {
    await page.goto('file://' + join(__dirname, name), { waitUntil: 'networkidle' });
    await page.evaluate(() => document.fonts.ready);
    const out = resolve(__dirname, '../../public/og', name.replace(/\.html$/, '.png'));
    await page.screenshot({ path: out });
    console.log('wrote', out);
  }
  await browser.close();
})();
