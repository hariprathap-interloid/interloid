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
await new Promise(r=>srv.listen(4321,r));

const b = await chromium.launch({args:['--use-gl=swiftshader','--enable-unsafe-swiftshader']});
const errs=[];
for (const vp of [{w:1440,h:900,n:'desk'},{w:390,h:844,n:'mob'}]) {
  const p = await b.newPage({viewport:{width:vp.w,height:vp.h}});
  p.on('console', m=>{ if(m.type()==='error') errs.push(`${vp.n}: ${m.text()}`); });
  p.on('pageerror', e=>errs.push(`${vp.n}: ${e.message}`));
  await p.goto('http://localhost:4321/hero-copy-lab.html');
  await p.waitForTimeout(3500);
  for (const v of ['a','b','c','d']) {
    await p.click(`.vb[data-v="${v}"]`);
    for (const th of ['dark','light']) {
      await p.click(`.th[data-theme="${th}"]`);
      await p.waitForTimeout(900);
      await p.screenshot({path:`shots/hero-${v}-${th}-${vp.n}.png`});
    }
  }
  const h1 = await p.locator('.v:visible h1').count();
  console.log(vp.n, 'visible h1 count:', h1);
  await p.close();
}
await b.close(); srv.close();
console.log(errs.length ? 'CONSOLE ERRORS:\n'+errs.join('\n') : 'no console errors');
