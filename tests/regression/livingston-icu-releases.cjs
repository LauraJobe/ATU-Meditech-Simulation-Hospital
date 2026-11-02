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
  await pg.evaluate(() => { location.hash = '#/instructor'; }); await pg.waitForTimeout(300);
  if (await pg.$('[data-action="ins-pick"]')) { await pg.selectOption('[data-action="ins-pick"]', 'livingston'); await pg.waitForTimeout(300); }
  const snap = () => pg.evaluate(() => { const p = Model.get('livingston'); const c = re => p.orders.filter(o => re.test(o.text)).length + '/' + p.meds.filter(m => re.test(m.name)).length;
    return { bolus: p.orders.filter(o => /^Normal saline bolus 500/.test(o.text)).length + '/' + p.meds.filter(m => /Sodium chloride bolus/i.test(m.name)).length, labs: p.orders.filter(o => /prior to starting IV antibiotics/.test(o.text)).length, vanco: c(/vancomycin/i), icu: p.orders.some(o => o.text === 'Transfer to ICU'), rel: Object.keys(Store.released('livingston')).sort().join(',') }; });
  const click = async sel => { await pg.click(sel); await pg.waitForTimeout(250); };
  const evs = await pg.$$eval('.event strong', a => a.map(x => x.textContent));
  ok(evs.some(t => /Normal saline bolus/.test(t)) && evs.some(t => /STAT BMP/.test(t)) && evs.some(t => /Vancomycin/.test(t)), 'three individual ICU order buttons: ' + evs.join(' | '));
  ok(await pg.$eval('.event:has([data-release="livingston|liv-icu"]) .ev-items', e => (e.textContent.match(/Also releases/g) || []).length === 3), 'ICU event lists the three it also releases');
  // 1) bolus early, then ICU set
  await click('[data-release="livingston|liv-icu-bolus"]');
  let s = await snap(); ok(s.bolus === '1/1' && !s.icu && s.vanco === '0/0', 'bolus alone: ' + JSON.stringify(s));
  await click('[data-release="livingston|liv-icu"]');
  s = await snap(); ok(s.bolus === '1/1' && s.labs === 1 && s.vanco === '1/1' && s.icu, 'after ICU set: no duplicates: ' + JSON.stringify(s));
  // undo ICU: bolus (released earlier) stays, labs/vanco come back off
  await click('[data-unrelease="livingston|liv-icu"]');
  s = await snap(); ok(s.bolus === '1/1' && s.labs === 0 && s.vanco === '0/0' && !s.icu, 'undo ICU keeps the earlier bolus only: ' + JSON.stringify(s));
  await click('[data-unrelease="livingston|liv-icu-bolus"]');
  // 2) ICU set alone releases all
  await click('[data-release="livingston|liv-icu"]');
  s = await snap(); ok(s.bolus === '1/1' && s.labs === 1 && s.vanco === '1/1' && s.icu, 'ICU set alone includes all three: ' + JSON.stringify(s));
  // DC/modify still available on released orders
  await pg.evaluate(() => { location.hash = '#/patient/livingston/orders'; }); await pg.waitForTimeout(400);
  ok(!!(await pg.$('[data-dc="liv-vanco"]')) && !!(await pg.$('[data-modify="liv-icu-o11"]')), 'DC/Modify on the released ICU orders');
  ok(errs.length === 0, 'no errors ' + errs.join(';'));
  await b.close(); srv.close();
})();
