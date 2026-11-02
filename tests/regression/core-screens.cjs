/* Regression test (moved from development checks). Run with `npm test`. */
const { playwright, startServer } = require('../helpers.cjs');
const { chromium } = playwright();
const ok = (c, m) => { console.log((c ? 'PASS ' : 'FAIL ') + m); if (!c) process.exitCode = 1; };
(async () => {
  const srv = await startServer(); const BASE = srv.url;
  const b = await chromium.launch(); const ctx = await b.newContext({ viewport: { width: 1280, height: 900 } });
  await ctx.route('https://cdn.jsdelivr.net/**', r => r.fulfill({ contentType: 'text/javascript', body: '' }));
  const pg = await ctx.newPage(); const errs = []; pg.on('pageerror', e => errs.push(e.message));
  await pg.goto(BASE + '/index.html'); await pg.evaluate(() => { localStorage.clear(); sessionStorage.clear(); }); await pg.reload();
  await pg.fill('[name=name]', 'Stu Dent'); await pg.selectOption('[name=experience]', 'peds'); await pg.click('button[type=submit]');
  // existing student documentation stays: chart a vital on Molly, then release items
  await pg.evaluate(() => Store.add('mollythomas', 'vitals', { hr: 160 }, Date.now(), Date.now()));
  await pg.evaluate(() => { Store.release('mollythomas', 'mollythomas-ev4'); });
  await pg.goto(BASE + '/index.html#/patient/mollythomas/mar'); await pg.waitForTimeout(400);
  const scan = async t => { await pg.fill('#mar-scan', t); await pg.press('#mar-scan', 'Enter'); await pg.waitForTimeout(250); };
  await scan('1003');
  ok(/Patient verified/i.test(await pg.textContent('#content')), 'Molly ATU wristband 1003 verifies');
  await scan('MED-0021');
  const q = await pg.evaluate(() => [...document.querySelectorAll('[data-unqueue]')].length + ' ' + ((document.querySelector('.modal') || {}).innerText || ''));
  ok(/^1 /.test(q) || /scheduled dose|Racepinephrine/.test(q), 'released racepinephrine scans with MED-0021: ' + q.slice(0, 80));
  ok((await pg.evaluate(() => Store.doc('mollythomas').vitals.length)) === 1, 'earlier student charting intact after releases');
  // Orders view: released med shows as NEW order with instructions
  await pg.goto(BASE + '/index.html#/patient/mollythomas/orders'); await pg.waitForTimeout(300);
  ok(/Racepinephrine/.test(await pg.textContent('#content')), 'released racepinephrine order on Orders');
  // Instructor Tools lists each item
  await pg.evaluate(() => { Store.setInstructor(true); sessionStorage.setItem(EHR_CONFIG.storagePrefix + '.instructorPatient', 'fatimasanogo'); });
  await pg.goto(BASE + '/index.html#/instructor'); await pg.waitForTimeout(400);
  const ins = await pg.textContent('main');
  ok((await pg.$$('[data-release^="fatimasanogo|"]')).length === 14 && /Medication order \+ MAR/.test(ins) && /Transfusion order \(TAR\)/.test(ins) && /Shift 2 — Continued Postpartum Hemorrhage \(faculty only\)/.test(ins), 'Instructor Tools: 14 Fatima release buttons with item kinds; Shift 2 guide faculty-only');
  await pg.goto(BASE + '/index.html#/barcodes'); await pg.waitForTimeout(300);
  await pg.fill('#bc-in', 'MED-0023'); await pg.press('#bc-in', 'Enter'); await pg.waitForTimeout(200);
  ok(/Ampicillin/.test(await pg.textContent('.bc-result')), 'Barcode Check identifies MED-0023');
  const lp = await ctx.newPage(); lp.on('pageerror', e => errs.push('labels: ' + e.message));
  await lp.addInitScript(() => sessionStorage.setItem('atuSimEHR.v1.instructor', '1'));
  await lp.goto(BASE + '/labels.html'); await lp.waitForTimeout(500);
  ok((await lp.$$('.patient')).length === 13, 'label page renders all 13 patients');
  const op = await ctx.newPage(); op.on('pageerror', e => errs.push('orientation: ' + e.message));
  await op.goto(BASE + '/orientation.html'); await op.waitForTimeout(500);
  ok(errs.length === 0, 'no page errors ' + errs.join(' | '));
  await b.close(); srv.close();
})();
