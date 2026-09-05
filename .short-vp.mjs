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
await new Promise(r=>srv.listen(4327,r));
const b = await chromium.launch({args:['--use-gl=swiftshader','--enable-unsafe-swiftshader']});
for (const vp of [{w:1280,h:720},{w:1440,h:900},{w:1920,h:1080},{w:2560,h:1440}]) {
  const p = await b.newPage({viewport:{width:vp.w,height:vp.h}});
  await p.goto('http://localhost:4327/index.html');
  await p.evaluate(()=>{document.documentElement.classList.remove('dark');localStorage.setItem('interloid-theme','light')});
  await p.waitForTimeout(7000);
  const m = await p.evaluate(()=>{
    const cta=document.querySelector('#home a[href="#contact"]').getBoundingClientRect();
    const h1=document.querySelector('#home h1'); const cs=getComputedStyle(h1);
    const col=h1.parentElement.getBoundingClientRect();
    return {ctaBottom:Math.round(cta.bottom), vp:window.innerHeight,
      h1Font:cs.fontSize, colW:Math.round(col.width),
      h1Lines:Math.round(h1.getBoundingClientRect().height/(parseFloat(cs.fontSize)*1.04)),
      dpr:window.devicePixelRatio};
  });
  console.log(`${vp.w}x${vp.h}`, JSON.stringify(m));
  await p.screenshot({path:`shots/vp-${vp.w}x${vp.h}.png`});
  await p.close();
}
await b.close(); srv.close();
