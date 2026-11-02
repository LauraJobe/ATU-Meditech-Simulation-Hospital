/*
 * Shared Newborn Transitional Record (Amelia Sung + Baby Boy Sung): one record, both charts.
 * Run: npm run test:transitional   (or npm test for everything)
 */
'use strict';
const { playwright, startServer, signIn, checker, go } = require('./helpers.cjs');

(async () => {
  const ok = checker();
  const srv = await startServer();
  const browser = await playwright().chromium.launch();
  const pg = await browser.newPage({ viewport: { width: 1400, height: 1000 } });
  const errs = []; pg.on('pageerror', e => errs.push(e.message));
  await signIn(pg, srv.url);
  await pg.evaluate(() => Store.release('ameliasung', 'sung-delivery'));

  const MOM = 'ameliasung', BABY = 'babyboysung';
  // Navigating to the hash already shown does not redraw; redraw explicitly.
  const open = async pid => { await go(pg, `#/patient/${pid}/summary`); await go(pg, `#/patient/${pid}/assess`); };
  const field = (k) => `[data-tr2] [name="${k}"]`;
  const valueOf = k => pg.$eval(field(k), e => e.value);
  const trRows = () => pg.evaluate(() => ({ baby: Store.doc('babyboysung').assess.filter(e => e.data.formId === 'newborn-transition').length,
    mom: Store.doc('ameliasung').assess.filter(e => e.data.formId === 'newborn-transition').length }));
  const save = async () => { await pg.click('[data-tr2] button[type=submit]'); await pg.waitForTimeout(350); };
  // Another device's save arriving through the shared sync: a row on the baby's chart, as compose() writes it.
  const remoteSave = (values, opts) => pg.evaluate(([values, opts]) => {
    const d = Store.doc('babyboysung');
    const p = Model.get('babyboysung');
    d.assess.push({ id: 'remote-' + Math.random().toString(36).slice(2), time: p.clock.now(), recorded: Date.now() + (opts.later || 0), status: 'active',
      user: { name: opts.name || 'Other Device', cred: 'SN' },
      data: { formId: 'newborn-transition', v: 2, values, epochs: opts.epochs || Views.transitional.currentEpochs(p), from: opts.from || 'babyboysung', shift: 'Day (0700–1900)' } });
    Store.saveDoc('babyboysung', d);
  }, [values, opts || {}]);

  /* 1. Shows for Amelia and Baby Boy Sung only */
  for (const pid of [MOM, BABY]) {
    await go(pg, `#/patient/${pid}/assess`);
    // Above the other assessments: before the Worklist note and the Assessment History.
    const first = await pg.$eval('#content', c => { const t = c.querySelector('.tr2'), h = [...c.querySelectorAll('.panel, .alerts')].filter(x => x !== t && !t.contains(x));
      return !t ? 'missing' : h.every(x => t.compareDocumentPosition(x) & Node.DOCUMENT_POSITION_FOLLOWING) ? '' : 'not first'; });
    const head = await pg.$eval('.tr2', e => e.textContent).catch(() => '');
    ok(!first && /Newborn Transitional Record/.test(head) && /Shared record — saving here updates both Amelia Sung’s and Baby Boy Sung’s charts\./.test(head), `${pid}: form shows in Assessments (${first || 'above the other forms'}) with the shared-record line`);
  }
  for (const pid of ['fatimasanogo', 'livingston', 'mollythomas']) {
    await go(pg, `#/patient/${pid}/assess`);
    ok(!(await pg.$('.tr2')), `${pid}: no Transitional Record`);
  }

  /* 2. Opens with every prefilled value; PIH and time of birth blank */
  await go(pg, `#/patient/${MOM}/assess`);
  const expected = await pg.evaluate(() => Views.transitional.baseline(Model.get('ameliasung')));
  const shown = await pg.$$eval('[data-tr2] [data-open]', els => Object.fromEntries(els.map(e => [e.name, e.value])));
  const wrong = Object.keys(expected).filter(k => shown[k] !== expected[k]);
  const want = { 'GBS': 'Pos', 'Antibiotic': 'Clindamycin 900 mg IVPB', 'Rubella': 'Immune', 'Hep B': '−', 'VDRL': '−', 'HIV': '−', 'Chlamydia history': 'N', 'Herpes history': 'N', 'Gonorrhea history': 'N',
    'Diabetes history': 'Y', 'Diabetes controlled': 'Diet', 'Smoker': 'N', 'Illegal drug use': 'N', 'Gravida': '2', 'Para': '1', 'Blood type': 'O+', 'Rupture of membranes time': '0300',
    'Anesthesia': 'Epidural', 'Feeding preference': 'Breast', 'Band #': '31539', 'Physician OB': 'Dr. Darnell', 'Physician Ped': 'Dr. Craig' };
  const missing = Object.keys(want).filter(k => shown[k] !== want[k]);
  const day = await pg.evaluate(() => { const d = new Date(Model.get('babyboysung').clock.simStart); const e = new Date(d); e.setDate(e.getDate() + 7);
    const f = x => `${String(x.getMonth() + 1).padStart(2, '0')}/${String(x.getDate()).padStart(2, '0')}/${x.getFullYear()}`; return { rom: f(d), edc: f(e) }; });
  ok(!wrong.length && !missing.length && shown['EDC'] === day.edc && shown['Rupture of membranes date'] === day.rom, `opens with every prefilled value (EDC ${shown['EDC']}, ROM ${shown['Rupture of membranes date']} ${shown['Rupture of membranes time']})${wrong.concat(missing).length ? ' wrong: ' + wrong.concat(missing).join(', ') : ''}`);
  ok(shown['PIH history'] === '' && shown['Magnesium'] === '' && shown['Time of birth'] === '' && shown['Antibiotic times'] === '' && shown['Sex'] === '', 'PIH, magnesium, time of birth, antibiotic times, and infant fields are blank');
  ok(Object.keys(shown).filter(k => /^VS\d /.test(k)).length >= 60 && 'VS6 Initials' in shown && 'Nurse signature' in shown, 'vital-signs grid has 6 columns x 10 rows and a nurse signature');

  /* 3–4. Save from Amelia → shows on baby; save from baby → shows on Amelia; one row per save on the baby's chart */
  let before = await trRows();
  await pg.fill(field('Antibiotic times'), '0400');
  await save();
  let after = await trRows();
  const row1 = await pg.evaluate(() => Store.doc('babyboysung').assess.filter(e => e.data.formId === 'newborn-transition').pop().data);
  ok(after.baby === before.baby + 1 && after.mom === 0 && row1.from === 'ameliasung' && Object.keys(row1.values).join() === 'Antibiotic times', `save from Amelia adds one row on Baby Boy Sung's chart with only the changed field (${JSON.stringify(row1.values)})`);
  ok(await valueOf('Antibiotic times') === '0400', 'form is not reset to blank after saving');
  await go(pg, `#/patient/${BABY}/assess`);
  ok(await valueOf('Antibiotic times') === '0400', 'baby\'s chart shows the save from Amelia\'s chart (no reload)');
  await pg.fill(field('Time of birth'), '1235'); await pg.selectOption(field('Sex'), 'Male');
  await save();
  await go(pg, `#/patient/${MOM}/assess`);
  ok(await valueOf('Time of birth') === '1235' && await valueOf('Sex') === 'Male', 'Amelia\'s chart shows the save from the baby\'s chart');
  ok((await trRows()).baby === before.baby + 2 && (await trRows()).mom === 0, 'each save is one row, always on the baby\'s chart');
  const hist = await pg.$eval('.tr2', e => e.textContent);
  ok(/Amelia Sung/.test(hist) && /Baby Boy Sung/.test(hist) && /Day \(0700–1900\)/.test(hist) && /Time of birth/.test(hist) && /Test Student/.test(hist), 'history shows time, student, shift, chart entered from, and fields changed');

  /* No changes → no row */
  before = await trRows();
  await save();
  ok((await trRows()).baby === before.baby && /No changes to save/.test(await pg.$eval('[data-tr2msg]', e => e.textContent)), 'a save with no changes adds no row ("No changes to save")');

  /* A cleared field is saved as '' and wins */
  await pg.fill(field('Antibiotic times'), ''); await save();
  ok(await valueOf('Antibiotic times') === '' && await pg.evaluate(() => Store.doc('babyboysung').assess.filter(e => e.data.formId === 'newborn-transition').pop().data.values['Antibiotic times'] === ''), 'clearing a field saves \'\' and the cleared value wins');

  /* 5. Two devices: different fields both kept; same field → later save wins, both in history */
  await go(pg, `#/patient/${MOM}/assess`);
  await pg.fill(field('Bath'), 'Delayed until stable'); await save();
  await remoteSave({ 'Security tag': 'Tag 4471' }, { name: 'Device Two', later: 5000 });
  await go(pg, `#/patient/${BABY}/assess`);
  ok(await valueOf('Bath') === 'Delayed until stable' && await valueOf('Security tag') === 'Tag 4471', 'two devices changing different fields: both changes kept');
  await pg.fill(field('Abnormal findings'), 'Left clavicle crepitus'); await save();
  await remoteSave({ 'Abnormal findings': 'Left clavicle crepitus; decreased left arm movement' }, { name: 'Device Two', later: 10000 });
  await go(pg, `#/patient/${MOM}/assess`);
  const histSame = await pg.$eval('.tr2', e => e.textContent);
  ok(await valueOf('Abnormal findings') === 'Left clavicle crepitus; decreased left arm movement' && /Device Two/.test(histSame) && (histSame.match(/Left clavicle crepitus/g) || []).length >= 2, 'same field from two devices: the later save wins and both stay in the history');

  /* 9. Reload keeps values; a shared update does not erase unsaved typing */
  await pg.reload(); await pg.waitForTimeout(400); await go(pg, `#/patient/${MOM}/assess`);
  ok(await valueOf('Time of birth') === '1235' && await valueOf('Security tag') === 'Tag 4471', 'reload keeps saved values');
  await pg.fill(field('Weight g'), '4080');           // typing, not saved
  await pg.click('h3');                                // focus leaves the form
  await remoteSave({ 'Length cm': '53' }, { name: 'Device Two', later: 20000 });
  await pg.evaluate(() => App.render()); await pg.waitForTimeout(300);
  ok(await valueOf('Weight g') === '4080' && await valueOf('Length cm') === '53', 'a shared update shows the other device\'s value and keeps unsaved typing');
  await go(pg, `#/patient/${BABY}/assess`);
  ok(await valueOf('Weight g') === '4080', 'the unsaved draft is shared by both charts (one draft key)');
  await save();
  const last = await pg.evaluate(() => Store.doc('babyboysung').assess.filter(e => e.data.formId === 'newborn-transition').pop().data.values);
  ok(JSON.stringify(last) === JSON.stringify({ 'Weight g': '4080' }), 'on save only the typed field is sent (the other device\'s newer field is not overwritten)');

  /* 10. Medications section does not touch the MAR */
  const marBefore = await pg.evaluate(() => JSON.stringify([Store.doc('babyboysung').mar, Model.get('babyboysung').meds.map(m => [m.id, m.status, m.doseTimes.map(d => d.priorBy || '')])]));
  await pg.fill(field('Erythromycin 0.5 mL both eyes time'), '1330'); await pg.selectOption(field('AquaMephyton IM dose'), '1 mg (>1500 g)');
  await pg.fill(field('Hep B vaccine lot #'), 'LOT123'); await save();
  const marAfter = await pg.evaluate(() => JSON.stringify([Store.doc('babyboysung').mar, Model.get('babyboysung').meds.map(m => [m.id, m.status, m.doseTimes.map(d => d.priorBy || '')])]));
  ok(marBefore === marAfter, 'the MAR is unchanged after saving the medications section');

  /* 8. Late save from a device still on the previous group (old epochs) does not appear */
  await remoteSave({ 'Bath': 'LATE SAVE FROM OLD GROUP' }, { epochs: { ameliasung: 0, babyboysung: 1 }, later: 30000 });
  await go(pg, `#/patient/${MOM}/assess`);
  ok(await valueOf('Bath') === 'Delayed until stable', 'a late save with old reset epochs does not appear');

  /* 7. Reset either patient: record cleared on both, baseline restored, the other patient's charting unchanged */
  await pg.evaluate(() => {
    const m = Model.get('ameliasung'), b = Model.get('babyboysung');
    Store.add('ameliasung', 'vitals', { hr: 88, sbp: 118, dbp: 70 }, m.clock.now(), m.clock.now());
    Store.add('ameliasung', 'notes', { type: 'Nursing Note', text: 'Mom note' }, m.clock.now(), m.clock.now());
    Store.add('babyboysung', 'vitals', { hr: 148, rr: 44 }, b.clock.now(), b.clock.now());
    Store.add('babyboysung', 'notes', { type: 'Nursing Note', text: 'Baby note' }, b.clock.now(), b.clock.now());
    Store.add('babyboysung', 'mar', { medId: 'baby-vitamin-k-0', action: 'Given' }, b.clock.now(), b.clock.now());
    Store.add('babyboysung', 'assess', { formId: 'pain', values: { 'p.x': 1 } }, b.clock.now(), b.clock.now());
  });
  const babyOther = () => pg.evaluate(() => { const d = Store.doc('babyboysung'); return JSON.stringify([d.vitals, d.notes, d.mar, d.assess.filter(e => e.data.formId !== 'newborn-transition')]); });
  const momOther = () => pg.evaluate(() => { const d = Store.doc('ameliasung'); return JSON.stringify([d.vitals, d.notes, d.mar, d.assess]); });
  const babyBefore = await babyOther();
  await pg.evaluate(() => Store.resetPatient('ameliasung'));
  await pg.evaluate(() => Store.release('babyboysung', 'sung-delivery'));   // Amelia's reset also took back her Delivery completed release
  for (const pid of [MOM, BABY]) {
    await open(pid);
    const st = { tob: await valueOf('Time of birth'), bath: await valueOf('Bath'), gbs: await valueOf('GBS'), band: await valueOf('Band #'), hist: /No saves yet/.test(await pg.$eval('.tr2', e => e.textContent)) };
    if (!(st.tob === '' && st.bath === '' && st.gbs === 'Pos' && st.band === '31539' && st.hist)) console.log('   ', pid, JSON.stringify(st));
    ok(st.tob === '' && st.bath === '' && st.gbs === 'Pos' && st.band === '31539' && st.hist,
      `reset Amelia → ${pid}: record cleared and prefilled values restored`);
  }
  ok(await babyOther() === babyBefore, 'resetting Amelia does not change Baby Boy Sung\'s vitals, MAR, notes, or forms');
  ok(await pg.evaluate(() => Store.doc('babyboysung').assess.every(e => e.data.formId !== 'newborn-transition')), 'hidden record rows are removed from the baby\'s chart at reset');
  // Reset the baby: Amelia's charting stays
  await pg.evaluate(() => { const m = Model.get('ameliasung'); Store.add('ameliasung', 'vitals', { hr: 90 }, m.clock.now(), m.clock.now()); });
  await go(pg, `#/patient/${MOM}/assess`);
  await pg.fill(field('Bath'), 'At 2 hours'); await save();
  const momBefore = await momOther();
  await pg.evaluate(() => Store.resetPatient('babyboysung'));
  await pg.evaluate(() => Store.release('ameliasung', 'sung-delivery'));
  await open(MOM);
  if (!(await valueOf('Bath') === '' && await valueOf('GBS') === 'Pos')) console.log('    after baby reset', await valueOf('Bath'), await pg.evaluate(() => JSON.stringify([Views.transitional.currentEpochs(Model.get('ameliasung')), Store.doc('babyboysung').assess.map(e => e.data.epochs)])));
  ok(await valueOf('Bath') === '' && await valueOf('GBS') === 'Pos', 'reset Baby Boy Sung → record cleared on Amelia\'s chart, prefilled values restored');
  ok(await momOther() === momBefore, 'resetting the baby does not change Amelia\'s vitals, MAR, notes, or forms');

  ok(errs.length === 0, 'no page errors ' + errs.join(' | '));
  await browser.close(); srv.close();
})().catch(e => { console.log('FAIL ' + e.message); process.exit(1); });
