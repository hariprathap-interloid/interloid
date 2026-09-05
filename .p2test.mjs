import { chromium } from 'playwright';
import { pathToFileURL } from 'url';
import path from 'path';
const b = await chromium.launch();
for (const [name, file] of [['index','prototype2/index.html'],['why','prototype2/why-choose-us.html']]) {
  const url = pathToFileURL(path.resolve(file)).href;
  console.log(`\n===== ${name} =====`);
  const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
  const errs = [];
  p.on('console', m => { if (m.type()==='error') errs.push(m.text().slice(0,150)); });
  p.on('pageerror', e => errs.push('PAGEERROR: '+e.message.slice(0,150)));
  await p.goto(url, { waitUntil:'networkidle', timeout:60000 });
  await p.waitForTimeout(1500);
  console.log('errors:', errs.length ? errs.join(' | ') : 'none');
  const r = await p.evaluate(() => ({
    h1: document.querySelectorAll('h1').length,
    h1Font: getComputedStyle(document.querySelector('h1')).fontFamily.split(',')[0],
    btnRadius: getComputedStyle(document.querySelector('.btn--primary')).borderRadius,
    heroH: Math.round(document.querySelector('.hero').getBoundingClientRect().height),
    vh: window.innerHeight,
    caps: document.querySelectorAll('.cap__panel').length,
    rungs: document.querySelectorAll('.rung').length,
    people: document.querySelectorAll('.person').length,
    bands: document.querySelectorAll('.band').length,
    rcards: document.querySelectorAll('.rcard').length,
    anchorsOk: [...document.querySelectorAll('a[href^="#"]')].filter(a=>a.getAttribute('href')!=='#')
      .every(a=>document.getElementById(a.getAttribute('href').slice(1))),
    skips: (()=>{let bad=0,prev=0;[...document.querySelectorAll('h1,h2,h3,h4')].forEach(h=>{const l=+h.tagName[1];if(prev&&l>prev+1)bad++;prev=l});return bad})(),
  }));
  console.log(JSON.stringify(r));
  console.log('heading skips:', r.skips===0?'PASS':'FAIL', '| anchors:', r.anchorsOk?'PASS':'FAIL');
  if (name==='index') console.log('hero dvh:', r.heroH>=r.vh-2?'PASS':'FAIL');
  await p.close();
}
await b.close();
