import { chromium } from 'playwright';
import http from 'http'; import fs from 'fs'; import path from 'path';
const root = path.resolve('prototype3');
const types = {'.html':'text/html','.js':'text/javascript','.css':'text/css','.json':'application/json'};
const srv = http.createServer((req,res)=>{
  const f = path.join(root, decodeURIComponent(req.url.split('?')[0]));
  if(!fs.existsSync(f)||fs.statSync(f).isDirectory()){res.writeHead(404);return res.end('x');}
  res.writeHead(200,{'Content-Type':types[path.extname(f)]||'application/octet-stream'});
  fs.createReadStream(f).pipe(res);
});
await new Promise(r=>srv.listen(4322,r));
const b = await chromium.launch({args:['--use-gl=swiftshader','--enable-unsafe-swiftshader']});
const errs=[];
for (const vp of [{w:1440,h:900,n:'desk'},{w:390,h:844,n:'mob'}]) {
  const p = await b.newPage({viewport:{width:vp.w,height:vp.h}});
  p.on('console', m=>{ if(m.type()==='error') errs.push(`${vp.n}: ${m.text()}`); });
  p.on('pageerror', e=>errs.push(`${vp.n}: ${e.message}`));
  await p.goto('http://localhost:4322/index.html');
  await p.waitForTimeout(3800);
  await p.screenshot({path:`shots/index-light-${vp.n}.png`});
  // toggle to dark
  await p.click('#themeToggle');
  await p.waitForTimeout(1200);
  await p.screenshot({path:`shots/index-dark-${vp.n}.png`});
  const st = await p.evaluate(()=>({
    dark: document.documentElement.classList.contains('dark'),
    pressed: document.querySelector('#themeToggle').getAttribute('aria-pressed'),
    label: document.querySelector('#themeToggle').getAttribute('aria-label'),
    sunHidden: document.querySelector('[data-icon="sun"]').classList.contains('hidden'),
    canvasReady: document.querySelector('.stage')?.classList.contains('ready'),
    h1: document.querySelectorAll('h1').length,
    h1text: document.querySelector('h1')?.innerText,
    height: document.documentElement.scrollHeight,
    ph: document.querySelectorAll('[data-placeholder]').length,
    // fold check: does the primary CTA finish above the viewport bottom?
    ctaBottom: Math.round(document.querySelector('#home a[href="#contact"]').getBoundingClientRect().bottom),
    viewport: window.innerHeight,
    badgeLines: Math.round(document.querySelector('#home [data-reveal] span:last-child').getBoundingClientRect().height / 20),
    badgeH: Math.round(document.querySelector('#home div[data-reveal]').getBoundingClientRect().height),
    leadPx: Math.round([...document.querySelectorAll('#home p[data-reveal]')].reduce((a,e)=>a+e.getBoundingClientRect().height,0)),
    railGone: !document.querySelector('#home dl'),
    satoshi: document.fonts.check('900 72px "Satoshi"'),
    h1Lines: (()=>{const h=document.querySelector('#home h1');
      return Math.round(h.getBoundingClientRect().height / (parseFloat(getComputedStyle(h).fontSize)*1.04));})(),
    inter: document.fonts.check('400 16px "Inter"'),
    h1Family: getComputedStyle(document.querySelector('#home h1')).fontFamily.split(',')[0],
  }));
  console.log(vp.n, JSON.stringify(st));
  if (vp.n==='desk') await p.screenshot({path:'shots/index-dark-full.png', fullPage:true});
  await p.close();
}
await b.close(); srv.close();
console.log(errs.length ? 'CONSOLE ERRORS:\n'+errs.join('\n') : 'no console errors');
