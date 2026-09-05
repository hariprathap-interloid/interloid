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
await new Promise(r=>srv.listen(4323,r));
const b = await chromium.launch({args:['--use-gl=swiftshader','--enable-unsafe-swiftshader']});
const p = await b.newPage({viewport:{width:1440,height:900}});
await p.goto('http://localhost:4323/index.html');
await p.evaluate(()=>{document.documentElement.classList.add('dark');localStorage.setItem('interloid-theme','dark')});
await p.waitForTimeout(1500);
const secs = await p.$$eval('section[id]', els=>els.map(e=>e.id));
for (const id of secs) {
  await p.evaluate(i=>document.getElementById(i).scrollIntoView({block:'start'}), id);
  await p.waitForTimeout(1400);
  await p.screenshot({path:`shots/dark-sec-${id}.png`});
}
// hunt for hardcoded light-only colours still in play
const suspects = await p.evaluate(() => {
  const bad = [];
  document.querySelectorAll('*').forEach(el => {
    const c = [...el.classList];
    const hit = c.filter(x => /^(bg|text|border|from|via|to)-(white|black|slate-\d+)/.test(x) || /^bg-white\//.test(x) || /^border-white\//.test(x));
    if (hit.length) bad.push({ tag: el.tagName.toLowerCase(), id: el.id || null, hit });
  });
  return bad;
});
const tally = {};
suspects.forEach(s=>s.hit.forEach(h=>tally[h]=(tally[h]||0)+1));
console.log('hardcoded non-token colour utilities still present:');
console.log(JSON.stringify(tally, null, 1));
await b.close(); srv.close();
