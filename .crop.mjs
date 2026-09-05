import { chromium } from 'playwright';
import { pathToFileURL } from 'url';
import path from 'path';
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
await p.goto(pathToFileURL(path.resolve('prototype2/index.html')).href, { waitUntil:'networkidle' });
for (let y=0;y<12000;y+=500){ await p.evaluate(v=>window.scrollTo(0,v),y); await p.waitForTimeout(60); }
await p.waitForTimeout(1000);
for (const [n,s] of [['cap','#build'],['ladder','#engagement']]) {
  const el = await p.$(s); if (el) await el.screenshot({ path:`.c-${n}.png` });
}
console.log('done');
await b.close();
