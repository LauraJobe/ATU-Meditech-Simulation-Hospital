/* Regression test (moved from development checks). Run with `npm test`. */
const { playwright, startServer } = require('../helpers.cjs');
const { chromium } = playwright();
const ok = (c, m) => { console.log((c ? 'PASS ' : 'FAIL ') + m); if (!c) process.exitCode = 1; };
(async () => {
  const srv = await startServer(); const BASE = srv.url; const U = BASE + '/index.html';
  const b = await chromium.launch(); const pg = await b.newPage({ viewport: { width: 1280, height: 900 } });
  const errs = []; pg.on('pageerror', e => errs.push(e.message));
  await pg.goto(U); await pg.evaluate(() => { localStorage.clear(); sessionStorage.clear(); }); await pg.reload();
  await pg.fill('[name=name]', 'Fac Ulty'); await pg.selectOption('[name=cred]', 'Faculty'); await pg.fill('[name=pin]', '2468'); await pg.click('button[type=submit]');
  await pg.waitForTimeout(300);

  /* --- 1. Each release button reveals only its intended item; med order and MAR agree --- */
  const snap = pid => pg.evaluate(pid => { const p = Model.get(pid); const ids = a => (a || []).map(x => x.id);
    return { orders: ids(p.orders), meds: ids(p.meds), medOrders: ids(Model.medOrders(p)), labs: ids(p.labs), imaging: ids(p.imaging), docs: ids(p.documents), notes: ids(p.notes) }; }, pid);
  for (const pid of ['mollythomas', 'stephaniesmith', 'fatimasanogo']) {
    const events = await pg.evaluate(pid => Model.base(pid).events.map(e => ({ id: e.id, title: e.title,
      want: { orders: (e.orders || []).map(x => x.id), meds: (e.meds || []).map(x => x.id), labs: (e.labs || []).map(x => x.id), imaging: (e.imaging || []).map(x => x.id), docs: (e.documents || []).map(x => x.id) } })), pid);
    let good = 0;
    for (const ev of events) {
      await pg.evaluate(pid => Store.resetPatient(pid), pid);
      const before = await snap(pid);
      await pg.evaluate(([pid, id]) => Store.release(pid, id), [pid, ev.id]);
      const after = await snap(pid);
      const added = k => after[k].filter(x => !before[k].includes(x));
      const same = (a, b2) => a.slice().sort().join() === b2.slice().sort().join();
      const match = same(added('orders'), ev.want.orders) && same(added('meds'), ev.want.meds) && same(added('medOrders'), ev.want.meds) &&
        same(added('labs'), ev.want.labs) && same(added('imaging'), ev.want.imaging) && same(added('docs'), ev.want.docs) && added('notes').length === 0;
      if (match) good++; else console.log('   MISMATCH', pid, ev.title, JSON.stringify({ added: { o: added('orders'), m: added('meds'), mo: added('medOrders'), l: added('labs'), i: added('imaging'), d: added('docs') }, want: ev.want }));
    }
    ok(good === events.length, `${pid}: ${good}/${events.length} release buttons reveal exactly their item (medication order and MAR entry together)`);
    await pg.evaluate(pid => Store.resetPatient(pid), pid);
  }
  // Nothing faculty-only reaches students (documents / notes / orders of every released event)
  const leak = await pg.evaluate(() => { const out = [];
    for (const pid of ['mollythomas', 'stephaniesmith', 'fatimasanogo', 'ameliasung']) { Model.base(pid).events.forEach(e => Store.release(pid, e.id)); const p = Model.get(pid);
      const txt = JSON.stringify([p.documents, p.notes, p.orders, p.labs, p.imaging]);
      if (/Students should|expected student|possible hysterectomy|surgical team|wrong-blood|incorrect unit/i.test(txt)) out.push(pid); Store.resetPatient(pid); }
    return out; });
  ok(leak.length === 0, 'teaching guides / expected student actions are never released to students ' + leak.join(','));

  /* --- 2. Stephanie --- */
  await pg.evaluate(() => Store.release('stephaniesmith', 'stephaniesmith-ev4'));
  const st = await pg.evaluate(() => { const p = Model.get('stephaniesmith'); const cef = p.meds.find(m => m.id === 'step-ceftriaxone-102'); const o = Model.medOrders(p).find(x => x.id === cef.id);
    return { panels: p.labs.length, rbc: p.labs[0].results.find(r => r.t === 'RBC'), ref: Model.labRef(p.labs[0].results.find(r => r.t === 'RBC')), label: Model.medLabel(cef), order: o.text,
      title: Model.base('stephaniesmith').events.find(e => e.id === 'stephaniesmith-ev4').title, prbc: Model.base('stephaniesmith').events.find(e => e.id === 'stephaniesmith-ev3').orders[0].text, d5: Model.medLabel(p.meds.find(m => m.id === 'step-d5halfns')) }; });
  ok(st.panels === 1 && st.rbc && st.rbc.v === 4.2 && st.ref === '4.2–5.4', `Stephanie CBC: one panel, RBC ${st.rbc && st.rbc.v} with range ${st.ref}`);
  ok(/IV — Every 6 hours/.test(st.label) && /Every 6 hours/.test(st.order) && /every 6 hours/.test(st.title), `ceftriaxone every 6 hours in title, order, and MAR (${st.label})`);
  ok(/1 unit/.test(st.prbc) && /verification and transfusion monitoring per protocol/.test(st.prbc), 'PRBC order: 1 unit with verification and monitoring');
  ok(/150 mL\/hr/.test(st.d5), 'D5 1/2 NS 150 mL/hr on the starting MAR');
  await pg.goto(U + '#/patient/stephaniesmith/results'); await pg.waitForTimeout(400);
  const labTxt = await pg.textContent('#content');
  ok(/RBC/.test(labTxt) && /4\.2–5\.4/.test(labTxt) && !/12\.1-15\.1\s*$/m.test(labTxt), 'Labs tab shows RBC 4.2 with its reference range beside it');
  await pg.evaluate(() => Store.resetPatient('stephaniesmith'));

  /* --- 3. Fatima: one-unit O-negative everywhere --- */
  const fa = await pg.evaluate(() => { const base = Model.base('fatimasanogo'); base.events.forEach(e => Store.release('fatimasanogo', e.id)); const p = Model.get('fatimasanogo');
    const student = JSON.stringify([p.orders, p.documents, p.labs, p.notes]); const all = JSON.stringify(base);
    const r = { onegTransfuse: /Transfuse 1 unit O-negative/.test(student), opos: /O\+ crossmatched|O-positive crossmatched|O positive crossmatched|2 units O\+/i.test(all), twoUnitTransfuse: /(transfuse|infuse)[^.]{0,20}2 units/i.test(all),
      tc: /Type and crossmatch 2 units/.test(student), dr: p.orders.filter(o => o.isNew).every(o => o.by === 'Dr. Nelson'), placenta: /1235|12:35/.test(all) && !/1245/.test(all), bank: /O neg/.test(student) };
    Store.resetPatient('fatimasanogo'); return r; });
  ok(fa.onegTransfuse && !fa.opos && !fa.twoUnitTransfuse, 'Fatima: transfusion is 1 unit O-negative (no O-positive / 2-unit transfusion anywhere)');
  ok(fa.tc && fa.dr && fa.placenta && fa.bank, `Fatima: type & crossmatch 2 units, Dr. Nelson on released orders, placenta 12:35, blood bank unit O neg (${JSON.stringify(fa)})`);

  /* --- 4. Newborn documentation --- */
  await pg.goto(U + '#/patient/ameliasung/newborn'); await pg.waitForTimeout(300);
  ok(/opens after delivery/.test(await pg.textContent('#content')) && !(await pg.$('[data-nb]')), 'Amelia: newborn forms locked before delivery');
  await pg.goto(U + '#/patient/babyboysung/newborn'); await pg.waitForTimeout(300);
  ok(/opens after delivery/.test(await pg.textContent('#content')), 'Baby: newborn forms locked before delivery');
  await pg.evaluate(() => Store.release('ameliasung', 'sung-delivery'));
  await pg.goto(U + '#/patient/ameliasung/newborn'); await pg.waitForTimeout(300);
  ok(!!(await pg.$('[data-nb="h2t"]')), 'Amelia: newborn forms open after faculty marks delivery completed');
  // Head-to-toe from Amelia's chart: nothing preselected; saves to Baby Boy Sung
  await pg.evaluate(() => Screens.setMode('student'));
  await pg.waitForTimeout(200); if (await pg.$('.modal [name=experience]')) { await pg.selectOption('.modal [name=experience]', 'ob'); await pg.click('.modal-foot .btn-primary'); await pg.waitForTimeout(300); }
  await pg.goto(U + '#/patient/ameliasung/newborn'); await pg.waitForTimeout(300);
  await pg.click('[data-nb="h2t"]'); await pg.waitForTimeout(300);
  const pre = await pg.$$eval('.modal select', s => s.filter(x => x.value).length);
  const checked = await pg.$$eval('.modal input[type=checkbox]:checked, .modal input[type=radio]:checked', s => s.length);
  ok(pre === 0 && checked === 0, `head-to-toe opens with nothing marked normal (${pre} selected, ${checked} checked)`);
  await pg.check('.modal [name="msk.dl"][value="N"]');
  await pg.check('.modal [name="msk.upperWith"][value="Limp arm L"]');
  await pg.fill('.modal [name="msk.injury"]', 'Left clavicle crepitus; decreased left arm movement');
  await pg.selectOption('.modal [name="reflex.moro"]', 'Asymmetrical');
  await pg.click('.modal-foot .btn-primary'); await pg.waitForTimeout(300);
  const saved = await pg.evaluate(() => ({ baby: Store.doc('babyboysung').assess.filter(e => e.data.formId === 'newborn-h2t').length, mom: Store.doc('ameliasung').assess.length }));
  ok(saved.baby === 1 && saved.mom === 0, `head-to-toe from Amelia's chart saved to Baby Boy Sung (${JSON.stringify(saved)})`);
  await pg.goto(U + '#/patient/babyboysung/newborn'); await pg.waitForTimeout(300);
  ok((await pg.$$('[data-nbview]')).length === 1, 'baby chart shows the head-to-toe saved from Amelia\'s chart');
  await pg.goto(U + '#/patient/babyboysung/assess'); await pg.waitForTimeout(300);
  ok(/Newborn Head-to-Toe Assessment/.test(await pg.textContent('#content')), 'Assessment History lists the newborn head-to-toe');
  await pg.goto(U + '#/patient/ameliasung/assess'); await pg.waitForTimeout(300);
  ok(/Newborn Documentation — saved to Baby Boy Sung/.test(await pg.textContent('#content')), 'Amelia\'s Assessments tab lists newborn documentation separately');

  /* --- 5. Barcodes and blood --- */
  const bc = await pg.evaluate(() => ({ wrist: Object.keys(ATU_BARCODES.wristbands).length, pk: Object.keys(ATU_BARCODES.packages).length,
    amp: Scan.pkgFor(Model.base('mollythomas').events.find(e => e.id === 'mollythomas-ev6').meds[0], 'mollythomas'), cef: Scan.pkgFor(Model.base('stephaniesmith').events.find(e => e.id === 'stephaniesmith-ev4').meds[0], 'stephaniesmith'),
    meth: Scan.pkgFor(Model.base('fatimasanogo').events.find(e => e.id === 'fatimasanogo-ev5').meds[0], 'fatimasanogo'), sung: Scan.patientOf('1006').id }));
  ok(bc.wrist === 13 && bc.pk === 71 && bc.amp === 'MED-0023' && bc.cef === 'MED-0061' && bc.meth === 'MED-0016' && bc.sung === 'babyboysung', 'barcodes unchanged: 13 wristbands, 71 packages (68 + Charles Jones MED-0066/0067/0068), released meds keep their package codes ' + JSON.stringify(bc));
  ok(errs.length === 0, 'no page errors ' + errs.join(' | '));
  await b.close(); srv.close();
})();
