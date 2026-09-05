/* ==========================================================================
   Page fidelity check — prototype3 vs the Next.js port.

   Answers "did every style transfer unchanged?" by measurement rather than
   assertion: walks every element inside the hero on both sides and compares
   geometry plus ~40 computed properties each.

   Deliberately NOT a pixel diff. The mark's particle positions come from
   Math.random() per load (smoke shell, phase) and a 14s time-based loop, so
   the canvas can never match byte-for-byte. Computed style + box geometry is
   both deterministic and a stricter test of "the CSS is the same".

   Usage: start the Next production server on :3000 first (npm run build &&
   npm start), then `node .fidelity.mjs` from the repo root.
   ========================================================================== */
import { chromium } from "playwright";
import http from "node:http";
import fs from "node:fs";
import path from "node:path";

const NEXT = process.env.NEXT ?? "http://localhost:3000";
const PORT = 4400;

const types = {
  ".html": "text/html",
  ".js": "text/javascript",
  ".css": "text/css",
  ".json": "application/json",
};
const root = path.resolve("prototype3");
const srv = http.createServer((req, res) => {
  const f = path.join(root, decodeURIComponent(req.url.split("?")[0]));
  if (!fs.existsSync(f) || fs.statSync(f).isDirectory()) {
    res.writeHead(404);
    return res.end("x");
  }
  res.writeHead(200, {
    "Content-Type": types[path.extname(f)] ?? "application/octet-stream",
  });
  fs.createReadStream(f).pipe(res);
});
await new Promise((r) => srv.listen(PORT, r));

const PROPS = [
  "display", "position", "zIndex", "boxSizing",
  "width", "height", "marginTop", "marginBottom", "marginLeft", "marginRight",
  "paddingTop", "paddingBottom", "paddingLeft", "paddingRight",
  "color", "backgroundColor", "backgroundImage", "opacity",
  "fontSize", "fontWeight", "lineHeight", "letterSpacing", "fontStyle",
  "textAlign", "textTransform", "textDecorationLine",
  "borderTopWidth", "borderTopColor", "borderTopStyle", "borderRadius",
  "boxShadow", "flexDirection", "flexWrap", "alignItems", "justifyContent",
  "gap", "maxWidth", "minHeight", "overflowX", "overflowY",
  "transitionProperty", "transitionDuration", "backdropFilter",
];

/* Identify elements by their position in the hero's tree, not by class — the
   whole point is to catch a class that silently differs.

   Passed to page.evaluate as a FUNCTION, not a template string: building the
   colour regex inside a template literal ate its backslashes. */
function collect(props) {
  /* COLOUR NORMALISATION.
     The prototype runs Tailwind's browser CDN, which leaves colours as
     oklch(); the compiled build emits lab() for the identical colour. Both
     paint the same pixel. Resolve every colour through a canvas so the
     comparison is about colour, not about how a build step serialised it. */
  const cx = document.createElement("canvas").getContext("2d");
  const px = (c) => {
    try {
      cx.clearRect(0, 0, 1, 1);
      cx.fillStyle = "#000";
      cx.fillStyle = c;
      cx.fillRect(0, 0, 1, 1);
      const d = cx.getImageData(0, 0, 1, 1).data;
      return "rgba(" + d[0] + "," + d[1] + "," + d[2] + "," + d[3] + ")";
    } catch {
      return c;
    }
  };
  /* Balanced-paren aware, so gradients and shadows normalise too. */
  const FN = /\b(oklch|oklab|lab|lch|color|rgba?|hsla?)\(/g;
  const norm = (v) => {
    if (!v || v === "none") return v;
    let out = "";
    let i = 0;
    for (;;) {
      FN.lastIndex = i;
      const m = FN.exec(v);
      if (!m) {
        out += v.slice(i);
        break;
      }
      out += v.slice(i, m.index);
      let depth = 1;
      let j = FN.lastIndex;
      while (j < v.length && depth > 0) {
        if (v[j] === "(") depth++;
        else if (v[j] === ")") depth--;
        j++;
      }
      out += px(v.slice(m.index, j));
      i = j;
    }
    return out;
  };

  const out = [];
  const walk = (el, pathStr) => {
    const cs = getComputedStyle(el);
    const r = el.getBoundingClientRect();
    const style = {};
    for (const p of props) style[p] = norm(cs[p]);
    out.push({
      path: pathStr,
      tag: el.tagName.toLowerCase(),
      text: (el.children.length === 0 ? el.textContent : "").trim().slice(0, 40),
      box: [
        Math.round(r.x),
        Math.round(r.y),
        Math.round(r.width),
        Math.round(r.height),
      ],
      style,
    });
    [...el.children].forEach((c, i) =>
      walk(c, pathStr + "/" + c.tagName.toLowerCase() + "[" + i + "]"),
    );
  };
  /* <html> and <body> too: bg-background, font-sans, text-muted-foreground,
     antialiased and overflow-x-hidden all live on body, and scroll-behaviour /
     scroll-padding on html. A difference there would move the whole hero
     without any element inside it differing. Measured without geometry —
     body's box legitimately differs, since the prototype page carries eight
     more sections below the hero. */
  const chrome = (el, name) => {
    const cs = getComputedStyle(el);
    const style = {};
    for (const p of props) style[p] = norm(cs[p]);
    delete style.height;
    delete style.minHeight;
    delete style.width;
    out.push({ path: name, tag: name, text: "", box: [0, 0, 0, 0], style });
  };
  chrome(document.documentElement, "html");
  chrome(document.body, "body");

  /* The WHOLE page now, not just the hero: nav, all seven sections, footer. */
  walk(document.querySelector("#nav"), "nav");
  walk(document.querySelector("#main"), "main");
  walk(document.querySelector("footer"), "footer");
  return out;
}

const browser = await chromium.launch({
  args: ["--use-gl=swiftshader", "--enable-unsafe-swiftshader"],
});

async function snap(url, theme) {
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.addInitScript((t) => {
    try {
      localStorage.setItem("interloid-theme", t);
    } catch {}
  }, theme);
  await page.goto(url, { waitUntil: "networkidle" });
  /* Freeze the stage so the canvas element's own box is stable, and let
     reveals finish so opacity/transform have settled. */
  await page.waitForTimeout(2500);
  await page.evaluate(() => {
    document
      .querySelectorAll("[data-reveal]")
      .forEach((el) => el.classList.add("is-in"));
    /* Freeze looping animations before measuring. `.scroll-cue` bobs 0->6px on
       a 2.4s infinite loop, so without this the cue's box differs by whatever
       phase each page happened to be in — a timing artifact that reads as a
       style difference. Reset to the 0% keyframe, do not merely pause. */
    const st = document.createElement("style");
    st.textContent =
      "*,*::before,*::after{animation:none !important;transition:none !important}" +
      ".scroll-cue{transform:translate(-50%,0) !important}";
    document.head.appendChild(st);
  });
  await page.waitForTimeout(900);
  const data = await page.evaluate(collect, PROPS);
  await page.close();
  return data;
}

let problems = 0;

for (const theme of ["light", "dark"]) {
  const a = await snap(`http://localhost:${PORT}/index.html`, theme);
  const b = await snap(NEXT, theme);

  console.log(`\n=== ${theme} ===`);
  console.log(`elements: prototype ${a.length}, next ${b.length}`);
  if (a.length !== b.length) {
    problems++;
    console.log("  ! element count differs — tree shape changed");
  }

  /* Align by PATH, not index. A single extra or missing node shifts every
     later index and turns one real difference into hundreds of phantom ones —
     the first run of this reported 1943. */
  const A = new Map(a.map((e) => [e.path, e]));
  const B = new Map(b.map((e) => [e.path, e]));

  const onlyProto = [...A.keys()].filter((k) => !B.has(k));
  const onlyNext = [...B.keys()].filter((k) => !A.has(k));
  if (onlyProto.length || onlyNext.length) {
    problems += onlyProto.length + onlyNext.length;
    console.log(`  ! structure differs`);
    onlyProto.slice(0, 12).forEach((k) => console.log(`      only in prototype: ${k}`));
    if (onlyProto.length > 12) console.log(`      ...and ${onlyProto.length - 12} more`);
    onlyNext.slice(0, 12).forEach((k) => console.log(`      only in next:      ${k}`));
    if (onlyNext.length > 12) console.log(`      ...and ${onlyNext.length - 12} more`);
  }

  let shown = 0;
  for (const [key, x] of A) {
    const y = B.get(key);
    if (!y) continue;
    const label = `${x.path}${x.text ? ` "${x.text}"` : ""}`;
    const diffs = [];
    if (x.box.join() !== y.box.join())
      diffs.push(`box ${x.box.join(",")} -> ${y.box.join(",")}`);
    for (const p of PROPS) {
      if (x.style[p] === y.style[p]) continue;
      diffs.push(`${p}: ${x.style[p]}  ->  ${y.style[p]}`);
    }
    if (!diffs.length) continue;
    problems += diffs.length;
    if (shown++ < 25) {
      console.log(`  ! ${label}`);
      diffs.forEach((d) => console.log(`      ${d}`));
    }
  }
  if (shown > 25)
    console.log(`  ...and ${shown - 25} more elements with differences`);
}

await browser.close();
srv.close();

console.log("");
console.log(
  problems === 0
    ? "IDENTICAL — every element matches in geometry and computed style, both themes"
    : `${problems} difference(s)`,
);
process.exitCode = problems === 0 ? 0 : 1;
