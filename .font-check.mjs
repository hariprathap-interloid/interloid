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
await new Promise(r=>srv.listen(4325,r));
const b = await chromium.launch({args:['--use-gl=swiftshader','--enable-unsafe-swiftshader']});
for (let run=1; run<=3; run++) {
  const p = await b.newPage({viewport:{width:1440,height:900}});
  const failed=[];
  p.on('requestfailed', r => failed.push(`${r.url()} :: ${r.failure()?.errorText}`));
  await p.goto('http://localhost:4325/index.html');
  await p.waitForTimeout(4000);
  const f = await p.evaluate(()=>({
    satoshi: document.fonts.check('900 64px "Satoshi"'),
    inter: document.fonts.check('400 16px "Inter"'),
    h1: getComputedStyle(document.querySelector('#home h1')).fontFamily,
  }));
  console.log(`run ${run}:`, JSON.stringify(f), failed.length? '\n  FAILED: '+failed.join('\n  FAILED: ') : '  (no failed requests)');
  await p.close();
}
await b.close(); srv.close();
