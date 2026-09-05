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
await new Promise(r=>srv.listen(4324,r));
const b = await chromium.launch({args:['--use-gl=swiftshader','--enable-unsafe-swiftshader']});
const errs=[];
const p = await b.newPage({viewport:{width:1440,height:900}});
p.on('console', m=>{ if(m.type()==='error') errs.push(m.text()); });
p.on('pageerror', e=>errs.push(e.message));
await p.goto('http://localhost:4324/hero-type-lab.html');
await p.waitForTimeout(4000);

console.log('font status:', await p.textContent('#fontstatus'));

// the collision claim, measured
const col = await p.evaluate(()=>{
  const hl = getComputedStyle(document.querySelector('.ab-solid')).color;
  const cta = getComputedStyle(document.querySelector('#home a[href="#"]')).backgroundColor;
  return {headlineSolid: hl, ctaBg: cta, identical: hl === cta};
});
console.log('light-theme collision check:', JSON.stringify(col));

for (const th of ['light','dark']) {
  await p.click(`.th[data-theme="${th}"]`);
  await p.waitForTimeout(600);
  // §2 highlight A/B, one shot each theme
  await p.evaluate(()=>document.querySelectorAll('section')[1].scrollIntoView({block:'start'}));
  await p.waitForTimeout(500);
  await p.screenshot({path:`shots/type-highlight-${th}.png`});
  // §3 face A/B, one shot each theme
  await p.evaluate(()=>document.querySelectorAll('section')[2].scrollIntoView({block:'start'}));
  await p.waitForTimeout(500);
  await p.screenshot({path:`shots/type-face-${th}.png`});
  // §1 in context, gradient on
  await p.click('.hb[data-hl="static"]');
  await p.evaluate(()=>window.scrollTo(0,0));
  await p.waitForTimeout(900);
  await p.screenshot({path:`shots/type-hero-gradient-${th}.png`});
  await p.click('.hb[data-hl="solid"]');
}
await b.close(); srv.close();
console.log(errs.length ? 'CONSOLE ERRORS:\n'+errs.join('\n') : 'no console errors');
