/* Regression test (moved from development checks). Run with `npm test`. */
const { playwright, startServer } = require('../helpers.cjs');
const { chromium } = playwright();
const ok = (c, m) => { console.log((c ? 'PASS ' : 'FAIL ') + m); if (!c) process.exitCode = 1; };
(async () => {
  const srv = await startServer(); const BASE = srv.url;
  const b = await chromium.launch(); const pg = await b.newPage({ viewport: { width: 1400, height: 1000 } });
  const errs = []; pg.on('pageerror', e => errs.push(e.message));
  await pg.goto(BASE + '/index.html?x=' + Date.now()); await pg.evaluate(() => { localStorage.clear(); sessionStorage.clear(); }); await pg.reload();
  await pg.fill('[name=name]', 'Fac Ulty'); await pg.selectOption('[name=cred]', 'Faculty'); await pg.fill('[name=pin]', '2468'); await pg.click('button[type=submit]'); await pg.waitForTimeout(300);
  for (const id of ['shapiro', 'sharp']) {
    await pg.evaluate(id => { location.hash = '#/patient/' + id + '/mar'; }, id); await pg.waitForTimeout(500);
    const r = await pg.evaluate(() => [...document.querySelectorAll('.mg-notyet .mg-btn')].map(b => b.disabled + ' ' + b.textContent.trim() + ' ' + b.title));
    ok(r.length === 3 && r.every(x => x.startsWith('true Starts tmrw')), id + ': 3 tomorrow doses grayed and disabled: ' + r.join(' | '));
    const st = await pg.evaluate(id => { const p = Model.get(id), d = Store.doc(id); return p.meds.filter(m => /-asa$|-tica$/.test(m.id)).map(m => m.doseTimes.map(t => Model.doseStatus(p, d, m, t).code).join(',')).join(' / '); }, id);
    ok(!/due|future/.test(st), id + ' statuses: ' + st);
    const other = await pg.evaluate(id => { const p = Model.get(id); return p.meds.filter(m => m.startsOn).map(m => m.id).join(','); }, id);
    ok(other.split(',').length === 2, 'only the start-tomorrow meds are affected: ' + other);
  }
  const all = await pg.evaluate(() => SIM_PATIENTS.flatMap(s => Model.get(s.id).meds.filter(m => m.startsOn).map(m => m.id)));
  ok(all.length === 4, 'across all patients only: ' + all.join(','));
  ok(errs.length === 0, 'no errors ' + errs.join(';'));
  await b.close(); srv.close();
})();
