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
  const go = async h => { await pg.evaluate(h => { location.hash = h; }, h); await pg.waitForTimeout(400); };
  const P = 'livingston';
  // Faculty enters NS bolus early, then releases the ICU event
  await go(`#/patient/${P}/orders`);
  await pg.click('[data-action="facorder"]'); await pg.waitForTimeout(200);
  await pg.selectOption('.modal [name=cat]', 'IV Fluids'); await pg.fill('.modal [name=mname]', '0.9% Sodium chloride bolus'); await pg.fill('.modal [name=mdose]', '500 mL');
  await pg.selectOption('.modal [name=mroute]', 'IV'); await pg.selectOption('.modal [name=mtype]', 'once'); await pg.click('.modal-foot .btn-primary'); await pg.waitForTimeout(300);
  const icu = await pg.evaluate(() => Model.base('livingston').events.find(e => /ICU Orders/.test(e.title)).id);
  await pg.evaluate(id => { ['liv-icu-bolus','liv-icu-statlabs','liv-icu-vanco',id].forEach(e => Store.release('livingston', e)); App.render(); }, icu); await pg.waitForTimeout(300);
  const boluses = () => pg.evaluate(() => Model.get('livingston').meds.filter(m => /bolus/i.test(m.name)).map(m => m.id + ':' + m.status));
  console.log('   boluses after release:', (await boluses()).join(', '));
  // DC the released duplicate med from the row button
  await pg.click('[data-dc="liv-nsbolus"]'); await pg.waitForTimeout(200);
  ok(await pg.$eval('.modal [name=reason]', e => e.value) === 'Duplicate order', 'DC reason defaults to Duplicate order');
  await pg.click('.modal-foot .btn-danger'); await pg.waitForTimeout(300);
  ok((await boluses()).includes('liv-nsbolus:Discontinued'), 'released NS bolus discontinued: ' + (await boluses()).join(', '));
  // and its text order
  await pg.click('[data-dc="liv-icu-o7"]'); await pg.waitForTimeout(200); await pg.click('.modal-foot .btn-danger'); await pg.waitForTimeout(300);
  const o7 = await pg.evaluate(() => Model.get('livingston').orders.find(o => o.id === 'liv-icu-o7').status);
  ok(o7 === 'Discontinued', 'released text order discontinued');
  // MAR: discontinued bolus hidden by default
  await go(`#/patient/${P}/mar`);
  const marNames = await pg.$$eval('.mg-med strong', a => a.map(x => x.textContent));
  ok(marNames.filter(n => /Sodium chloride bolus/i.test(n)).length === 1, 'MAR shows only one NS bolus: ' + marNames.filter(n => /Sodium chloride bolus/i.test(n)).join(','));
  // Detail: discontinued by + undo
  await go(`#/patient/${P}/orders`);
  await pg.click('[data-info="liv-icu-o7"]'); await pg.waitForTimeout(200);
  ok(await pg.$eval('.modal', e => /Discontinued by/.test(e.textContent) && /Duplicate order/.test(e.textContent)), 'detail shows who discontinued and why');
  await pg.click('.modal-foot .btn >> text=Undo Discontinue'); await pg.waitForTimeout(200); await pg.click('.modal-foot .btn-danger'); await pg.waitForTimeout(300);
  ok(await pg.evaluate(() => Model.get('livingston').orders.find(o => o.id === 'liv-icu-o7').status) === 'Active', 'undo discontinue reactivates');
  // Modify a chart med (enoxaparin 40 -> 30 mg)
  await pg.click('[data-modify="liv-enox"]'); await pg.waitForTimeout(200);
  ok(await pg.$eval('.modal [name=mname]', e => e.value) === 'Enoxaparin sodium' && await pg.$eval('.modal [name=mdose]', e => e.value) === '40 mg', 'Modify prefills the medication');
  await pg.fill('.modal [name=mdose]', '30 mg'); await pg.click('.modal-foot .btn-primary'); await pg.waitForTimeout(300);
  const enox = await pg.evaluate(() => Model.get('livingston').meds.filter(m => /enox/i.test(m.name)).map(m => m.dose + ':' + m.status));
  ok(enox.includes('40 mg:Discontinued') && enox.includes('30 mg:Active'), 'modify: old discontinued, new active: ' + enox.join(', '));
  // Modify a text order
  await pg.click('[data-modify="liv-icu-o6"]'); await pg.waitForTimeout(200);
  await pg.fill('.modal [name=text]', 'Vital signs every 30 minutes and PRN; I&O every 4 hours'); await pg.click('.modal-foot .btn-primary'); await pg.waitForTimeout(300);
  const vs = await pg.evaluate(() => Model.get('livingston').orders.filter(o => /Vital signs every (15|30)/.test(o.text)).map(o => o.text.slice(0, 30) + ':' + o.status));
  ok(vs.length === 2 && vs.some(x => /30.*Active/.test(x)) && vs.some(x => /15.*Discontinued/.test(x)), 'modify text order: ' + vs.join(' | '));
  // Modify an IV Fluids text order (no med fields) stays a text order
  await pg.click('[data-modify="liv-icu-o14"]'); await pg.waitForTimeout(200);
  await pg.fill('.modal [name=text]', 'NS @ 100 mL/hr after bolus completed'); await pg.click('.modal-foot .btn-primary'); await pg.waitForTimeout(300);
  ok(!(await pg.$('.modal .form-error, .modal .alert-danger')) && await pg.evaluate(() => Model.get('livingston').orders.some(o => /NS @ 100/.test(o.text) && o.status === 'Active')), 'IV Fluids text order modified without med fields');
  // Student mode: no DC/Modify buttons
  await pg.evaluate(() => Screens.setMode('student')); await pg.waitForTimeout(200);
  if (await pg.$('.modal [name=experience]')) { await pg.selectOption('.modal [name=experience]', 'icu'); await pg.click('.modal-foot .btn-primary'); await pg.waitForTimeout(300); }
  await go(`#/patient/${P}/orders`);
  ok(!(await pg.$('[data-dc], [data-modify]')), 'students see no DC/Modify buttons');
  ok(errs.length === 0, 'no page errors ' + errs.join(';'));
  await b.close(); srv.close();
})();
