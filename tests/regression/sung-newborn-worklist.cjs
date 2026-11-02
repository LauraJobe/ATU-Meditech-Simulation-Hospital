/* Regression test (moved from development checks). Run with `npm test`. */
const { playwright, startServer } = require('../helpers.cjs');
const { chromium } = playwright();
const ok = (c, m) => { console.log((c ? 'PASS ' : 'FAIL ') + m); if (!c) process.exitCode = 1; };
(async () => {
  const srv = await startServer(); const BASE = srv.url; const U = BASE + '/index.html';
  const b = await chromium.launch(); const pg = await b.newPage({ viewport: { width: 1280, height: 900 } });
  const errs = []; pg.on('pageerror', e => errs.push(e.message));
  await pg.goto(U); await pg.evaluate(() => { localStorage.clear(); sessionStorage.clear(); }); await pg.reload();
  await pg.fill('[name=name]', 'Stu Dent'); await pg.selectOption('[name=cred]', 'Faculty'); await pg.fill('[name=pin]', '2468'); await pg.click('button[type=submit]');
  await pg.waitForTimeout(300);
  await pg.evaluate(() => Screens.setMode('student'));
  await pg.waitForTimeout(200); if (await pg.$('.modal [name=experience]')) { await pg.selectOption('.modal [name=experience]', 'ob'); await pg.click('.modal-foot .btn-primary'); await pg.waitForTimeout(300); }
  const go = async h => { await pg.evaluate(h => { location.hash = h; }, h); await pg.waitForTimeout(300); };

  await go('#/patient/babyboysung/worklist');
  const rows = await pg.$$eval('.wl-row', rs => rs.map(r => [r.dataset.key, r.querySelector('.wl-item span').textContent, r.querySelector('.wl-status').textContent.trim()]));
  const nb = rows.filter(r => r[0].startsWith('nb:'));
  ok(nb.length === 5 && nb.every(r => r[2] === 'After delivery'), 'before delivery: 5 newborn worklist items shown, locked: ' + nb.map(r => r[1]).join(' | '));
  ok(await pg.$eval('.wl-filter', e => /opens after delivery/i.test(e.textContent)), 'locked note shown on the worklist');
  // Clicking a locked item and Document → toast, nothing opens
  await pg.click('.wl-row[data-key="nb:apgar"] .wl-item'); await pg.click('[data-wl=document]'); await pg.waitForTimeout(200);
  ok(!(await pg.$('.modal')), 'locked item does not open a form');

  // Release from Baby's own card
  const evs = await pg.evaluate(() => Model.base('babyboysung').events.map(e => e.id));
  ok(evs.includes('sung-delivery'), 'Baby Boy Sung card has its own Delivery completed release');
  await pg.evaluate(() => { Store.release('babyboysung', 'sung-delivery'); App.render(); }); await pg.waitForTimeout(300);
  const rows2 = await pg.$$eval('.wl-row', rs => rs.map(r => [r.dataset.key, r.querySelector('.wl-status').textContent.trim(), !!r.querySelector('.wl-clock')]));
  ok(rows2.filter(r => r[0].startsWith('nb:')).every(r => r[1] !== 'After delivery' && r[2]), 'after delivery: every newborn item is due with a clock ' + JSON.stringify(rows2.filter(r => r[0].startsWith('nb:'))));
  ok(await pg.evaluate(() => Views.newborn.isOpen(Model.get('ameliasung'))), 'releasing on Baby also opens Amelia\'s Newborn tab');

  // Document APGAR 1 min from the worklist
  const apgar = async (minute, picks) => {
    await pg.click('.wl-row[data-key="nb:apgar"] .wl-item'); await pg.click('[data-wl=document]'); await pg.waitForTimeout(300);
    await pg.selectOption('.modal [name="ap.minute"]', minute);
    for (const [f, i] of picks) await pg.click(`.modal [name="sc.${f}"] >> nth=${i}`);
    const tot = await pg.$eval('.modal .score-total', e => e.textContent);
    await pg.click('.modal-foot .btn-primary'); await pg.waitForTimeout(300); return tot;
  };
  const t1 = await apgar('1 minute', [['hr', 2], ['resp', 1], ['tone', 1], ['reflex', 1], ['color', 1]]);
  ok(/Total: 6.*Moderately abnormal/.test(t1), 'APGAR totals live: ' + t1);
  let st = await pg.$eval('.wl-row[data-key="nb:apgar"] .wl-status', e => e.textContent.trim());
  ok(st !== 'Done', 'APGAR still due after only the 1-minute score: ' + st);
  await apgar('5 minutes', [['hr', 2], ['resp', 2], ['tone', 1], ['reflex', 2], ['color', 1]]);
  st = await pg.$eval('.wl-row[data-key="nb:apgar"] .wl-status', e => e.textContent.trim());
  ok(st === 'Done', 'APGAR done after 1 and 5 minute scores (5-min ≥ 7)');
  // Required minute
  await pg.click('.wl-row[data-key="nb:apgar"] .wl-item'); await pg.click('[data-wl=document]'); await pg.waitForTimeout(300);
  await pg.click('.modal-foot .btn-primary'); await pg.waitForTimeout(200);
  ok(await pg.$eval('.modal', e => /Complete: Minutes after birth/.test(e.textContent)), 'APGAR requires the scoring time');
  await pg.click('.modal-foot .btn >> text=Cancel'); await pg.waitForTimeout(200);
  await pg.reload(); await pg.waitForTimeout(400); await go('#/patient/babyboysung/worklist');

  // Delivery assessment, H2T, Glucose open from worklist
  for (const [k, title] of [['nb:delivery', 'Newborn Delivery Assessment'], ['nb:h2t', 'Newborn Head-to-Toe Assessment'], ['nb:glucose', 'Newborn Glucose Monitoring']]) {
    await pg.click(`.wl-row[data-key="${k}"] .wl-item`); await pg.click('[data-wl=document]'); await pg.waitForTimeout(300);
    const t = await pg.$eval('.modal h2, .modal .modal-title', e => e.textContent).catch(() => '');
    ok(t.includes(title), `${k} opens "${t}" from the Worklist`);
    if (k === 'nb:glucose') { await pg.fill('.modal [name="chk.bg"]', '38'); await pg.selectOption('.modal [name="chk.type"]', { index: 1 }); await pg.click('.modal-foot .btn-primary'); await pg.waitForTimeout(300); }
    else { await pg.click('.modal-foot .btn >> text=Cancel'); await pg.waitForTimeout(200); await pg.reload(); await pg.waitForTimeout(400); await go('#/patient/babyboysung/worklist'); }
  }
  // The shared Transitional Record is documented in the Assessments view: its Worklist row goes there.
  await pg.click('.wl-row[data-key="nb:record"] .wl-item'); await pg.click('[data-wl=document]'); await pg.waitForTimeout(400);
  ok(/\/assess$/.test(await pg.evaluate(() => location.hash)) && !!(await pg.$('.tr2 [data-tr2]')), 'Transitional Record row opens the shared record in Assessments');
  await go('#/patient/babyboysung/worklist');
  const saved = await pg.evaluate(() => Store.doc('babyboysung').assess.map(e => e.data.formId + ':' + Views.assess.summary(ASSESSMENT_FORMS[e.data.formId], e.data)));
  ok(saved.length === 3, 'saved to Baby Boy Sung: ' + saved.join(' | '));

  // Documents: only the prenatal record remains
  const docs = await pg.evaluate(() => Model.get('babyboysung').documents.map(d => d.title));
  ok(docs.length === 1 && /Prenatal/.test(docs[0]), 'Other Clinical documents: ' + docs.join(', '));

  // Orders: order set band with P link; glucose gel inside the set
  await go('#/patient/babyboysung/orders');
  const bands = await pg.$$eval('.ord-band th', a => a.map(x => x.textContent));
  ok(bands[0] === 'Order Set: Newborn Glucose Management', 'order set band first: ' + bands.join(' | '));
  const setRows = await pg.evaluate(() => { const out = []; let on = false; document.querySelectorAll('.orders tr, table tr').forEach(r => { if (r.classList.contains('ord-band')) on = /Order Set/.test(r.textContent); else if (on && r.classList.contains('ord-row')) out.push(r.textContent.replace(/\s+/g, ' ').trim().slice(0, 60)); }); return out; });
  ok(setRows.length === 11 && setRows.some(t => /Glucose gel/.test(t)), `order set has ${setRows.length} orders incl. glucose gel`);
  await pg.click('[data-protocol="glucose"] >> nth=0'); await pg.waitForTimeout(300);
  ok(await pg.$eval('.modal', e => /Clinical pathway for glucose management/.test(e.textContent) && /2.25 mL/.test(e.textContent)), 'P opens the full policy with pathway and gel tables');
  await pg.click('.modal-foot .btn >> text=Close');
  // Amelia's worklist unchanged (no newborn rows); Amelia assess tab lists newborn docs
  await go('#/patient/ameliasung/worklist');
  ok(!(await pg.$('.wl-row[data-key^="nb:"]')), 'Amelia\'s worklist has no newborn rows');
  await go('#/patient/ameliasung/assess');
  ok(await pg.$eval('main, body', e => /APGAR Score/.test(e.textContent) && /Newborn Glucose Monitoring/.test(e.textContent)), 'Amelia Assessments tab lists the newborn documentation saved to Baby');
  ok(errs.length === 0, 'no page errors ' + errs.join('; '));
  await b.close(); srv.close();
})();
