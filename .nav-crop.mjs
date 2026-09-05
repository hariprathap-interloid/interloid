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
await new Promise(r=>srv.listen(4326,r));
const b = await chromium.launch({args:['--use-gl=swiftshader','--enable-unsafe-swiftshader']});
for (const th of ['light','dark']) {
  const p = await b.newPage({viewport:{width:1440,height:900}});
  await p.goto('http://localhost:4326/index.html');
  if (th==='dark') await p.evaluate(()=>document.documentElement.classList.add('dark'));
  else await p.evaluate(()=>{document.documentElement.classList.remove('dark');localStorage.setItem('interloid-theme','light')});
  // wait for the mark to be fully condensed so the cloud is at its densest near the nav
  await p.waitForTimeout(7000);
  await p.screenshot({path:`shots/nav-band-${th}.png`, clip:{x:340,y:0,width:1100,height:150}});
  await p.close();
}
await b.close(); srv.close();
console.log('cropped nav band captured');
