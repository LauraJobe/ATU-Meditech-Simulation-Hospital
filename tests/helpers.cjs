/*
 * Test helpers: a static server for the site, Playwright, and sign-in.
 * Run everything with `npm test` (see package.json). Playwright and Chromium must be installed
 * (globally is fine: the helper finds the global module when it is not in node_modules).
 */
'use strict';
const http = require('http');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const ROOT = path.join(__dirname, '..');
const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.png': 'image/png', '.jpg': 'image/jpeg', '.svg': 'image/svg+xml', '.pdf': 'application/pdf', '.webp': 'image/webp' };

function playwright() {
  if (process.env.PW) return require(process.env.PW);
  try { return require('playwright'); } catch (e) { return require(path.join(execSync('npm root -g').toString().trim(), 'playwright')); }
}

// Serve the repository on a free port. BASE_URL (set by tests/run-all.cjs) reuses one server for every test.
function startServer() {
  if (process.env.BASE_URL) return Promise.resolve({ url: process.env.BASE_URL, close() {} });
  return new Promise(resolve => {
    const srv = http.createServer((req, res) => {
      const p = path.normalize(decodeURIComponent(req.url.split('?')[0])).replace(/^(\.\.[/\\])+/, '');
      const file = path.join(ROOT, p === '/' ? 'index.html' : p);
      if (!file.startsWith(ROOT) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) { res.writeHead(404); res.end(); return; }
      res.writeHead(200, { 'Content-Type': TYPES[path.extname(file)] || 'application/octet-stream', 'Cache-Control': 'no-store' });
      fs.createReadStream(file).pipe(res);
    });
    srv.listen(0, '127.0.0.1', () => resolve({ url: `http://127.0.0.1:${srv.address().port}`, close: () => srv.close() }));
  });
}

// Fresh browser storage, signed in with the faculty PIN (faculty can document and release).
async function signIn(pg, url) {
  await pg.goto(url + '/index.html');
  await pg.evaluate(() => { localStorage.clear(); sessionStorage.clear(); });
  await pg.reload();
  await pg.fill('[name=name]', 'Test Student');
  await pg.selectOption('[name=cred]', 'Faculty');
  await pg.fill('[name=pin]', '2468');
  await pg.click('button[type=submit]');
  await pg.waitForTimeout(300);
}

function checker() {
  let failed = 0;
  const ok = (cond, msg) => { console.log((cond ? 'PASS ' : 'FAIL ') + msg); if (!cond) { failed++; process.exitCode = 1; } };
  ok.failed = () => failed;
  return ok;
}

const go = async (pg, hash) => { await pg.evaluate(h => { location.hash = h; }, hash); await pg.waitForTimeout(350); };

module.exports = { ROOT, playwright, startServer, signIn, checker, go };
