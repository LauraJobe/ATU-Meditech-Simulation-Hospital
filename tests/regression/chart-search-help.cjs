/* Regression test (moved from development checks). Run with `npm test`. */
const { playwright, startServer } = require('../helpers.cjs');
const { chromium } = playwright();
const ok = (c, m) => { console.log((c ? 'PASS ' : 'FAIL ') + m); if (!c) process.exitCode = 1; };
(async () => {
  const srv = await startServer(); const BASE = srv.url;
  const b = await chromium.launch(); const pg = await b.newPage({ viewport: { width: 1400, height: 900 } });
  const errs = []; pg.on('pageerror', e => errs.push(e.message));
  await pg.goto(BASE + '/index.html?x=' + Date.now()); await pg.evaluate(() => { localStorage.clear(); sessionStorage.clear(); }); await pg.reload();
  await pg.fill('[name=name]', 'Stu Dent'); await pg.selectOption('[name=cred]', 'Faculty'); await pg.fill('[name=pin]', '2468'); await pg.click('button[type=submit]'); await pg.waitForTimeout(300);
  await pg.evaluate(() => { location.hash = '#/patient/livingston/summary'; }); await pg.waitForTimeout(500);
  const tb = await pg.$$eval('.toolbar .tb-btn span:last-child', a => a.map(x => x.textContent.trim()));
  ok(tb.includes('Help') && tb.indexOf('Help') < tb.indexOf('Suspend'), 'toolbar: ' + tb.join(' | '));
  await pg.click('[data-action="help"]'); await pg.waitForTimeout(200);
  ok(await pg.$eval('.modal', e => /Help information will be added/.test(e.textContent)), 'Help opens a placeholder window');
  await pg.click('.modal-foot .btn'); await pg.waitForTimeout(200);
  ok(!!(await pg.$('.side .side-search input')), 'right column has Search Patient\'s Chart');
  for (const q of ['oxycodone', 'lactate', 'hgb', 'zzzz']) {
    await pg.fill('.side-search input', q); await pg.press('.side-search input', 'Enter'); await pg.waitForTimeout(600);
    const strip = await pg.$eval('.cs-strip', e => e.textContent.replace(/\s+/g, ' ').trim()).catch(() => '(no strip)');
    const marks = await pg.$$eval('mark.cs-mark', a => a.length);
    console.log(`   "${q}" → ${await pg.evaluate(() => location.hash)} · ${marks} marks · ${strip.slice(0, 140)}`);
  }
  await pg.fill('.side-search input', 'oxycodone'); await pg.press('.side-search input', 'Enter'); await pg.waitForTimeout(600);
  ok(errs.length === 0, 'no errors ' + errs.join(';'));
  await b.close(); srv.close();
})();
