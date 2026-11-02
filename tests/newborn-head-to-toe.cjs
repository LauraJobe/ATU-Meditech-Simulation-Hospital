/*
 * Newborn Head-to-Toe Assessment (MEDITECH style) for any newborn (patient flag newborn: true).
 * Run: npm run test:head-to-toe   (or npm test for everything)
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
  const rowsOf = async pid => { await go(pg, `#/patient/${pid}/summary`); await go(pg, `#/patient/${pid}/worklist`); return pg.$$eval('.wl-row', r => r.map(x => x.dataset.key)); };
  const openH2T = async pid => { await rowsOf(pid); await pg.click('.wl-row[data-key="nb:h2t"] .wl-item'); await pg.click('[data-wl=document]'); await pg.waitForTimeout(400); };

  /* Shows for newborn: true, not for others; Baby Boy Sung has the flag on a fresh load and after reset */
  ok(await pg.evaluate(() => Model.get('babyboysung').newborn === true && !Model.get('ameliasung').newborn), 'fresh load: Baby Boy Sung has newborn: true (Amelia does not)');
  await pg.evaluate(() => Store.release('babyboysung', 'sung-delivery'));
  ok((await rowsOf('babyboysung')).includes('nb:h2t'), 'Baby Boy Sung\'s Worklist has the Newborn Head-to-Toe Assessment');
  for (const pid of ['ameliasung', 'livingston', 'mollythomas']) ok(!(await rowsOf(pid)).includes('nb:h2t'), `${pid}: no newborn head-to-toe (not a newborn)`);
  // A different newborn (imported patient): only the flag is needed.
  await pg.evaluate(() => {
    const p = JSON.parse(JSON.stringify(Model.base('livingston')));
    Object.assign(p, { id: 'testnewborn', name: { first: 'Baby Girl', last: 'Testcase' }, mrn: 'TN0001', age: 'Newborn', newborn: true, events: [], experiences: ['ob'] });
    delete p.nbPair; Store.saveCustomPatient(p);
  });
  const custom = await rowsOf('testnewborn');
  ok(custom.includes('nb:h2t') && !custom.includes('nb:apgar'), 'another patient with newborn: true gets the form (and not the Sung delivery items)');
  await pg.evaluate(() => Store.resetPatient('babyboysung'));
  ok(await pg.evaluate(() => Model.get('babyboysung').newborn === true), 'after reset: Baby Boy Sung still has newborn: true');

  /* Every section renders, with the defined-limits text */
  await openH2T('testnewborn');
  const legends = await pg.$$eval('.modal .form-sec > legend', a => a.map(x => x.textContent));
  const want = ['Vital Signs / Measurements', 'Neurological / Behavioral', 'Integumentary', 'HEENT', 'Respiratory', 'Cardiovascular', 'Gastrointestinal', 'Genitourinary', 'Musculoskeletal',
    'Newborn Reflexes', 'Gestational Age Assessment (Ballard)', 'Newborn Screenings / Procedures', 'Patient / Family Education', 'Nursing Notes'];
  ok(want.every(w => legends.includes(w)), 'every section renders: ' + legends.join(' | '));
  const dlText = await pg.$$eval('.modal .wdl-def', a => a.map(x => x.textContent).join(' || '));
  ok(/Flexed posture, good tone, strong cry/.test(dlText) && /Head ~2 cm larger than chest/.test(dlText) && /Apical HR 110–160 bpm, regular rhythm/.test(dlText) && /All 8 reflexes are present, symmetrical and of normal strength/.test(dlText) &&
    /Male: meatus centered at tip of penis/.test(dlText) && /no sacral dimple or tuft of hair/.test(dlText), 'defined-limits text shows for each system');
  const labels = await pg.$$eval('.modal .field span, .modal legend, .modal .form-note', a => a.map(x => x.textContent).join(' | '));
  ok(/97\.7–99\.5 °F/.test(labels) && /110–160 bpm \(to 180 crying\)/.test(labels) && /32–37 cm/.test(labels) && /Turns toward cheek stroke/.test(labels) && /Term: Creases cover entire sole/.test(labels) &&
    /Limp arm — check Moro for brachial plexus injury\./.test(labels) && /Complete within 2 hours of delivery/.test(await pg.textContent('.modal')), 'reference ranges, expected reflex responses, Ballard term findings, and notes show');
  ok(await pg.$$eval('.modal select', s => s.filter(x => x.value).length) === 0 && await pg.$$eval('.modal input:checked', s => s.length) === 0, 'opens with nothing pre-marked');

  /* N opens a system's exception fields; Y keeps them closed */
  const hidden = id => pg.$eval(`.modal [name="${id}.dl"]`, e => e.closest('fieldset').querySelector('.dl-exc').hidden);
  ok(await hidden('resp'), 'Respiratory exception fields start closed');
  await pg.check('.modal [name="resp.dl"][value="Y"]');
  ok(await hidden('resp'), 'Y keeps them closed');
  await pg.check('.modal [name="resp.dl"][value="N"]');
  ok(!(await hidden('resp')), 'N opens them');
  await pg.check('.modal [name="resp.distress"][value="Retractions"]'); await pg.check('.modal [name="resp.distress"][value="Grunting"]');
  await pg.check('.modal [name="resp.dl"][value="Y"]');
  ok(await hidden('resp') && await pg.$$eval('.modal [name="resp.distress"]:checked', a => a.length) === 2, 'choosing Y closes them without clearing what was entered');
  await pg.check('.modal [name="resp.dl"][value="N"]');

  /* Abnormal values show the flag; the form still saves */
  await pg.fill('.modal [name="vm.rr"]', '72'); await pg.fill('.modal [name="vm.hr"]', '95'); await pg.fill('.modal [name="vm.temp"]', '96.8');
  await pg.fill('.modal [name="vm.hc"]', '33'); await pg.fill('.modal [name="vm.cc"]', '34');
  const flags = await pg.$eval('.modal .form-flags', e => e.textContent);
  ok(/Respiratory rate 72/.test(flags) && /Heart rate 95/.test(flags) && /Temperature 96\.8/.test(flags) && /head should be about 2 cm larger/.test(flags), 'abnormal RR, HR, temperature, and head/chest show flags: ' + flags.replace(/\s+/g, ' '));
  await pg.fill('.modal [name="vm.rr"]', '24');
  ok(/Respiratory rate 24/.test(await pg.$eval('.modal .form-flags', e => e.textContent)), 'RR under 25 flags');
  await pg.fill('.modal [name="vm.rr"]', '72');
  await pg.check('.modal [name="integ.dl"][value="N"]'); await pg.check('.modal [name="integ.variations"][value="Milia"]'); await pg.check('.modal [name="integ.variations"][value="Stork bite"]');
  await pg.check('.modal [name="msk.dl"][value="N"]'); await pg.check('.modal [name="msk.upperWith"][value="Limp arm L"]');
  await pg.check('.modal [name="edu.feed"]'); await pg.selectOption('.modal [name="edu.feedLearner"]', 'Mother');
  // Ballard: total still calculates
  const names = await pg.$$eval('.modal .score input[type=radio]', a => [...new Set(a.map(x => x.name))]);
  for (const n of names) { const o = await pg.$$(`.modal [name="${n}"]`); await o[o.length - 1].click(); }
  const total = await pg.$eval('.modal .score-total', e => e.textContent);
  ok(names.length === 12 && /Total: 42 — Estimated gestational age 40\.8 weeks/.test(total), 'Ballard total still calculates: ' + total);
  await pg.click('.modal-foot .btn-primary'); await pg.waitForTimeout(400);
  const saved = await pg.evaluate(() => Store.doc('testnewborn').assess.find(e => e.data.formId === 'newborn-h2t'));
  ok(!!saved && saved.data.ver === 2 && saved.data.flags.length === 4 && saved.data.total === 42, 'flags do not block saving; the entry keeps its flags and Ballard total');
  ok(JSON.stringify(saved.data.values['integ.variations']) === '["Milia","Stork bite"]' && JSON.stringify(saved.data.values['resp.distress']) === '["Retractions","Grunting"]' &&
    JSON.stringify(saved.data.values['edu.feed']) === '["Feeding (breast / bottle)"]', 'checkbox choices are saved (only the checked options)');
  await go(pg, '#/patient/testnewborn/summary'); await go(pg, '#/patient/testnewborn/assess');
  const hist = await pg.textContent('#content');
  ok(/Newborn Head-to-Toe Assessment/.test(hist) && /Exceptions: .*Respiratory/.test(hist) && /Ballard 42/.test(hist) && /4 flag/.test(hist), 'the saved entry shows in Assessment History');
  await pg.click('[data-view]'); await pg.waitForTimeout(300);
  const det = await pg.textContent('.modal');
  ok(/Milia, Stork bite/.test(det) && /Within defined limits\? N/.test(det) && /Respiratory rate 72/.test(det), 'detail view shows checkbox choices, defined-limits answers, and flags');
  await pg.click('.modal-foot .btn, .modal-close').catch(() => {});
  ok(await pg.evaluate(() => { const e = Store.doc('testnewborn').assess.find(x => x.data.formId === 'newborn-h2t'); return e.status === 'active' && e.user.name === 'Test Student' && e.recorded > 0 && e.id; }),
    'saved as an ordinary assessment entry (author, time; the same entries the shared chart syncs)');

  /* Old saved head-to-toe entries still display exactly as saved */
  const legacy = await pg.evaluate(() => {
    const p = Model.get('babyboysung'), f = ASSESSMENT_FORMS['newborn-h2t'];
    const d = { formId: 'newborn-h2t', values: { 'neck.clavL': 'Crepitus', 'msk.armL': 'Decreased movement', 'reflex.moro': 'Asymmetric — decreased left', 'abn.abnFind': 'Left clavicle crepitus' } };
    return Views.assess.detail(p, f, d) + ' || ' + Views.assess.summary(f, d);
  });
  ok(/Left clavicle:.*Crepitus/.test(legacy) && /Left arm movement:.*Decreased movement/.test(legacy) && /Abnormal findings:.*Left clavicle crepitus/.test(legacy), 'an older saved head-to-toe entry still displays with its original fields');

  /* Glucose & Feeding record unchanged */
  const glu = await pg.evaluate(() => { const f = ASSESSMENT_FORMS['newborn-glucose']; return f.title + ' | ' + f.sections.map(s => s.id + ':' + s.fields.map(x => x.id).join(',')).join(' ; '); });
  ok(glu === 'Newborn Glucose Monitoring | chk:type,bg,method,feed,feedTime ; risk:risk ; sym:sym,symTime,symOther ; tx:gel,refed,recheck,notified,orders,iv,ivTime,response,initials', 'Newborn Glucose Monitoring form unchanged');
  ok((await rowsOf('babyboysung')).includes('nb:glucose') && !(await rowsOf('testnewborn')).includes('nb:glucose'), 'Glucose Monitoring still shows for the same patient (Baby Boy Sung)');

  ok(errs.length === 0, 'no page errors ' + errs.join(' | '));
  await browser.close(); srv.close();
})().catch(e => { console.log('FAIL ' + e.message); process.exit(1); });
