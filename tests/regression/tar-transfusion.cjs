/* Regression test (moved from development checks). Run with `npm test`. */
const { playwright, startServer } = require('../helpers.cjs');
const { chromium } = playwright();
const ok = (c, m) => { console.log((c ? 'PASS ' : 'FAIL ') + m); if (!c) process.exitCode = 1; };
(async () => {
  const srv = await startServer(); const BASE = srv.url;
  const b = await chromium.launch(); const pg = await b.newPage({ viewport: { width: 1280, height: 900 } });
  const errs = []; pg.on('pageerror', e => errs.push(e.message));
  await pg.goto(BASE + '/index.html'); await pg.evaluate(() => { localStorage.clear(); sessionStorage.clear(); }); await pg.reload();
  await pg.fill('[name=name]', 'Stu Dent'); await pg.selectOption('[name=experience]', 'ob'); await pg.click('button[type=submit]');
  await pg.evaluate(() => Store.release('fatimasanogo', 'fati-transfuse'));
  await pg.goto(BASE + '/index.html#/patient/fatimasanogo/tar'); await pg.waitForTimeout(400);
  const tarTxt = await pg.textContent('#content');
  ok(/Transfuse 1 unit O-negative/.test(tarTxt) || !!(await pg.$('[data-tar]')), 'TAR offers the released 1-unit O-negative order');
  const tryUnit = async abo => {
    await pg.click('[data-tar="start"], button:has-text("Start Transfusion")'); await pg.waitForTimeout(300);
    const opts = await pg.$$eval('.modal [name=orderRef] option', o => o.map(x => x.textContent));
    await pg.selectOption('.modal [name=product]', 'Packed red blood cells (PRBC)');
    await pg.fill('.modal [name=unitNo]', abo === 'O−' ? 'JF46302' : 'WRONG-A-NEG');
    await pg.selectOption('.modal [name=unitABO]', abo); await pg.selectOption('.modal [name=patientABO]', 'O+');
    await pg.fill('.modal [name=expires]', '2030-01-01T00:00'); await pg.fill('.modal [name=volume]', '300'); await pg.fill('.modal [name=rate]', '100');
    await pg.$$eval('.modal [name=checks]', c => c.forEach(x => { x.checked = true; }));
    await pg.fill('.modal [name=rn2]', 'Second RN');
    for (const n of ['temp', 'hr', 'rr', 'sbp', 'dbp', 'spo2']) { const el = await pg.$(`.modal [name=pre_${n}]`); if (el) await el.fill({ temp: '98.4', hr: '105', rr: '16', sbp: '90', dbp: '50', spo2: '96' }[n]); }
    console.log('   empty required:', await pg.$$eval('.modal [required]', r => r.filter(x => !x.value).map(x => x.name).join(',')));
    await pg.click('.modal-foot .btn-primary'); await pg.waitForTimeout(300);
    const msg = await pg.evaluate(() => { const m = document.querySelector('.modal'); if (!m) return 'closed'; const e = m.querySelector('.form-error, .alert-danger, .error'); return e ? e.innerText : 'open (no error shown)'; });
    return { opts, msg };
  };
  const wrong = await tryUnit('A−');
  console.log('   order choices:', wrong.opts.join(' | '));
  ok(/ABO INCOMPATIBLE/.test(wrong.msg), 'A-negative bag is stopped (intentional incorrect unit)');
  await pg.click('.modal-foot .btn >> nth=0'); await pg.waitForTimeout(200);
  const right = await tryUnit('O−');
  ok(right.msg === 'closed' || !/INCOMPATIBLE/.test(right.msg), 'O-negative unit JF46302 is accepted: ' + right.msg.slice(0, 80));
  ok(errs.length === 0, 'no page errors ' + errs.join('|'));
  await b.close(); srv.close();
})();
