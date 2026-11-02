/*
 * Charles Jones: 28 single releases under collapsible Shift 1–4 headings, weights, packet orders, new barcodes.
 * Run with `npm test`.
 */
'use strict';
const { playwright, startServer, signIn, checker, go } = require('../helpers.cjs');
// Every other patient's event ids before this change (main at 0ea8d34).
const OTHERS = {"brody":[],"livingston":["liv-culture","liv-icu-labs","liv-transfuse","liv-icu-bolus","liv-icu-statlabs","liv-icu-vanco","liv-icu"],"shapiro":["sha-trop"],"sharp":[],"watkins":["wat-stat"],"carter":[],"janefowler":["janefowler-ev1","janefowler-ev2","janefowler-ev3","janefowler-ev4","janefowler-ev5"],"ameliasung":["amel-hypotension","amel-ephedrine","sung-delivery"],"babyboysung":["babyboysung-ev1","babyboysung-ev2","babyboysung-ev3","babyboysung-ev4","sung-delivery"],"fatimasanogo":["fatimasanogo-ev2","fati-tc","fati-iv2","fati-transfuse","fati-hh","fatimasanogo-ev5","fatimasanogo-ev6","fatimasanogo-ev7","fatimasanogo-ev8","fati-tamponade","fati-cbc6","fati-foley","fati-fundal","fatimasanogo-ev1"],"mollythomas":["mollythomas-ev4","mollythomas-ev5","mollythomas-ev6","mollythomas-ev7","moll-o2","moll-cxr-order","mollythomas-ev1"],"stephaniesmith":["stephaniesmith-ev2","stephaniesmith-ev1","stephaniesmith-ev3","stephaniesmith-ev4","stephaniesmith-ev5","stephaniesmith-ev6"]};

(async () => {
  const ok = checker();
  const srv = await startServer();
  const browser = await playwright().chromium.launch();
  const pg = await browser.newPage({ viewport: { width: 1400, height: 1000 } });
  const errs = []; pg.on('pageerror', e => errs.push(e.message));
  await signIn(pg, srv.url);
  const P = 'charlesjones';
  const ins = async () => { await go(pg, '#/census'); await go(pg, '#/instructor'); if (await pg.$('[data-action="ins-pick"]')) { await pg.selectOption('[data-action="ins-pick"]', P); await pg.waitForTimeout(300); } };
  const snap = () => pg.evaluate(() => { const p = Model.get('charlesjones'); return { orders: p.orders.map(o => o.id), meds: p.meds.map(m => m.id + ':' + m.status) }; });
  const groupState = () => pg.$$eval('.ev-group', g => g.map(d => ({ name: d.querySelector('summary strong').textContent, open: d.open, n: d.querySelectorAll('[data-release], [data-unrelease]').length, prog: d.querySelector('.ev-progress').textContent })));

  /* 28 buttons, Shift 1–4 with 2, 8, 10, 8; no Release All; headings collapsed */
  await ins();
  const groups = await groupState();
  ok(groups.map(g => g.name + ' ' + g.n).join(', ') === 'Shift 1 2, Shift 2 8, Shift 3 10, Shift 4 8', 'four shift headings with 2, 8, 10, 8 buttons: ' + groups.map(g => g.name + ' ' + g.n).join(', '));
  ok(await pg.$$eval('[data-release^="charlesjones|"]', a => a.length) === 28, 'exactly 28 Release Now buttons for Charles');
  ok(!(await pg.$$eval('button, a', a => a.some(x => /release all/i.test(x.textContent)))), 'no "Release All" button');
  ok(groups.every(g => !g.open) && groups[1].prog === '0 of 8 released', 'headings start collapsed and show progress ("0 of 8 released")');
  ok(!(await pg.$$eval('.ev-group > summary', s => s.some(x => x.querySelector('button')))), 'a shift heading has no release button');

  /* Release ch-lasix: only its order + MAR entry; heading stays open; Undo removes it and heading stays open */
  await pg.click('[data-evgroup="charlesjones|Shift 2"] > summary'); await pg.waitForTimeout(200);
  const before = await snap();
  await pg.click('[data-release="charlesjones|ch-lasix"]'); await pg.waitForTimeout(300);
  const after = await snap();
  const addedMeds = after.meds.filter(m => !before.meds.includes(m)), addedOrders = after.orders.filter(o => !before.orders.includes(o));
  ok(JSON.stringify(addedMeds) === '["ch-lasix:Active"]' && addedOrders.length === 0, 'releasing ch-lasix adds only its order + MAR entry: ' + JSON.stringify(addedMeds));
  ok(!after.meds.some(m => /^ch-(kcl|ceftriaxone|tylenol)/.test(m)), 'potassium, ceftriaxone, and Tylenol stay hidden');
  ok(await pg.evaluate(() => Model.medOrders(Model.get('charlesjones')).some(o => o.id === 'ch-lasix' && /Furosemide/.test(o.text))), 'the Lasix order shows on Orders (medication order)');
  let st = await groupState();
  ok(st[1].open && st[1].prog === '1 of 8 released', 'Shift 2 stays open after Release Now and shows "1 of 8 released"');
  await pg.click('[data-unrelease="charlesjones|ch-lasix"]'); await pg.waitForTimeout(300);
  st = await groupState();
  ok(!(await snap()).meds.some(m => m.startsWith('ch-lasix')) && st[1].open && st[1].prog === '0 of 8 released', 'Undo removes ch-lasix and the heading stays open');

  /* Hold metformin */
  await pg.click('[data-evgroup="charlesjones|Shift 3"] > summary'); await pg.waitForTimeout(200);
  const met = () => pg.evaluate(() => { const m = Model.get('charlesjones').meds.find(x => x.id === 'char-metformin-4'); return m.status + '|' + (m.holdReason || ''); });
  ok(/^Active\|/.test(await met()), 'metformin starts Active');
  await pg.click('[data-release="charlesjones|ch-hold-metformin"]'); await pg.waitForTimeout(300);
  ok(/^Held\|On hold/.test(await met()) && (await snap()).orders.includes('ch-hold-metformin'), 'ch-hold-metformin puts char-metformin-4 on hold (and adds the order): ' + await met());
  await pg.click('[data-unrelease="charlesjones|ch-hold-metformin"]'); await pg.waitForTimeout(300);
  ok(/^Active\|/.test(await met()), 'Undo restores metformin');

  /* Weight 106.6 kg in sidebar, Summary, Worklist; later weights hidden until released; no Shift 4 weight */
  await go(pg, `#/patient/${P}/summary`);
  const side = await pg.$eval('.side', e => e.textContent), summary = await pg.$eval('#content', e => e.textContent);
  await go(pg, `#/patient/${P}/worklist`);
  const band = await pg.$eval('.wl-band', e => e.textContent);
  ok(/106\.6 kg/.test(side) && /106\.6/.test(summary) && /106\.6 kg/.test(band) && !/\b82 kg/.test(side + band), 'Charles shows 106.6 kg in the sidebar, Summary, and Worklist');
  const weights = () => pg.evaluate(() => Model.get('charlesjones').vitalsPrior.filter(v => v.weight != null).map(v => v.weight));
  ok(JSON.stringify(await weights()) === '[106.6]', 'before release: only the admission weight (106.6 kg) on his Vital Signs');
  await pg.evaluate(() => Store.release('charlesjones', 'ch-wt-1'));
  ok(JSON.stringify(await weights()) === '[106.6,104.8]', 'Shift 1 weight (104.8 kg) appears only after its release');
  ok(await pg.evaluate(() => Model.base('charlesjones').events.filter(e => e.group === 'Shift 4' && (e.vitals || []).length).length === 0), 'no Shift 4 weight');
  ok(await pg.evaluate(() => { const e = Model.base('charlesjones').events.find(x => x.id === 'ch-wt-2'); return e.vitals[0].weight === 107.0 && e.vitals[0].note === '236 lb'; }), 'Shift 2 weight row: 107.0 kg, note "236 lb" only');

  /* Release everything: placeholders gone; barcodes find their orders */
  await pg.evaluate(() => Model.base('charlesjones').events.forEach(e => Store.release('charlesjones', e.id)));
  const all = await pg.evaluate(() => JSON.stringify(Model.get('charlesjones')));
  ok(!/No additional orders entered/.test(all), 'the "No additional orders entered" orders are gone');
  const codes = await pg.evaluate(() => ['MED-0066', 'MED-0067', 'MED-0068', 'MED-0060', 'MED-0020'].map(c => {
    const parsed = Scan.parseCode(c), p = Model.get('charlesjones');
    const hit = parsed && parsed.kind === 'pkg' ? p.meds.filter(m => m.status === 'Active' && parsed.pkg.match.some(r => new RegExp(r, 'i').test(m.name))).map(m => m.id) : [];
    return c + '→' + hit.join('+');
  }));
  ok(codes.every(c => /→\S/.test(c)) && /MED-0066→ch-lasix/.test(codes.join()) && /MED-0067→ch-kcl/.test(codes.join()) && /MED-0068→ch-ceftriaxone/.test(codes.join()) && /MED-0060→ch-tylenol/.test(codes.join()),
    'MED-0066/0067/0068/0060/0020 each find the matching order on his MAR: ' + codes.join(', '));
  ok(await pg.evaluate(() => ['ch-lasix', 'ch-kcl', 'ch-ceftriaxone', 'ch-tylenol-now'].every(id => { const m = Model.get('charlesjones').meds.find(x => x.id === id); return Scan.pkgFor(m, 'charlesjones'); })) &&
    await pg.evaluate(() => Scan.pkgFor(Model.get('charlesjones').meds.find(x => x.id === 'ch-ceftriaxone'), 'charlesjones') === 'MED-0068'), 'his labels use the new codes (ceftriaxone → MED-0068, not Stephanie\'s MED-0061)');

  /* A student telephone order for a packet order warns faculty not to approve both */
  await pg.evaluate(() => { const p = Model.get('charlesjones'); const e = Store.add('charlesjones', 'orders', { type: 'Telephone', cat: 'Medication', provider: 'Dr. Burris', text: 'Lasix 107 mg IV push now', readBack: true }, p.clock.now(), p.clock.now()); Views.orders.review(p, e); });
  await pg.waitForTimeout(300);
  ok(/packet order you can release in Instructor Tools: Furosemide \(Lasix\)/.test(await pg.textContent('.modal')), 'reviewing a matching student telephone order warns: approve or release, not both');
  await pg.click('.modal-foot .btn >> text=Cancel');

  /* Other patients unchanged */
  const now = await pg.evaluate(() => { const o = {}; SIM_PATIENTS.filter(p => p.id !== 'charlesjones').forEach(p => { o[p.id] = (p.events || []).map(e => e.id); }); return o; });
  ok(JSON.stringify(now) === JSON.stringify(OTHERS), 'every other patient has the same event ids as before');
  await ins(); await pg.selectOption('[data-action="ins-pick"]', 'livingston'); await pg.waitForTimeout(300);
  ok(!(await pg.$('.ev-group')) && (await pg.$$('[data-release^="livingston|"], [data-unrelease^="livingston|"]')).length === 7, 'other patients keep the flat (ungrouped) Instructor Tools list');

  ok(errs.length === 0, 'no page errors ' + errs.join(' | '));
  await browser.close(); srv.close();
})().catch(e => { console.log('FAIL ' + e.message); process.exit(1); });
