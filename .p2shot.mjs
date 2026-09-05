import { chromium } from 'playwright';
import { pathToFileURL } from 'url';
import path from 'path';
const b = await chromium.launch();
for (const [n, f] of [['index','prototype2/index.html'],['why','prototype2/why-choose-us.html']]) {
  const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
  await p.goto(pathToFileURL(path.resolve(f)).href, { waitUntil:'networkidle' });
  for (let y=0;y<14000;y+=500){ await p.evaluate(v=>window.scrollTo(0,v),y); await p.waitForTimeout(60); }
  await p.evaluate(()=>window.scrollTo(0,0)); await p.waitForTimeout(1200);
  await p.screenshot({ path:`.s-${n}.png`, fullPage:true });
  console.log(n, await p.evaluate(()=>document.body.scrollHeight)+'px');
  await p.close();
}
await b.close();
