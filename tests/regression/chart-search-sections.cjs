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
  const search = async (pid, q) => {
    if (!(await pg.evaluate(pid => location.hash.includes(pid) && !!document.querySelector('.side-search'), pid))) { await pg.evaluate(pid => { location.hash = '#/patient/' + pid + '/summary'; }, pid); await pg.waitForTimeout(400); }
    await pg.fill('.side-search input', q); await pg.press('.side-search input', 'Enter'); await pg.waitForTimeout(500);
    return { hash: await pg.evaluate(() => location.hash.split('/').pop()), sub: await pg.$eval('.dx-subtab-on', e => e.textContent).catch(() => ''), strip: await pg.$eval('.cs-strip', e => e.textContent.replace(/\s+/g, ' ').trim()).catch(() => '') };
  };
  const cases = [['livingston', 'Vital signs', 'vitals'], ['livingston', 'vitals', 'vitals'], ['livingston', 'BP', 'vitals'], ['livingston', 'Lab', 'results', 'Laboratory'], ['livingston', 'laboratory', 'results', 'Laboratory'],
    ['livingston', 'culture', 'results', 'Microbiology'], ['shapiro', 'ECG', 'results', 'Cardiovascular'], ['livingston', 'demographics', 'admin'], ['livingston', 'contact', 'admin'], ['livingston', 'emergency contact', 'admin'],
    ['livingston', 'insurance', 'admin'], ['livingston', 'orders', 'orders'], ['livingston', 'MAR', 'mar'], ['livingston', 'I&O', 'io'], ['livingston', 'care plan', 'careplan'], ['livingston', 'history', 'history'],
    ['livingston', 'provider notes', 'provnotes'], ['livingston', 'assessment', 'assess'], ['watkins', 'heparin protocol', 'heparin'], ['babyboysung', 'newborn', 'newborn'], ['livingston', 'allergies', 'summary'], ['livingston', 'consent', 'documents']];
  for (const [pid, q, tab, sub] of cases) {
    const r = await search(pid, q);
    ok(r.hash === tab && (!sub || r.sub === sub) && /opened/.test(r.strip), `"${q}" (${pid}) → ${r.hash}${r.sub && sub ? ' / ' + r.sub : ''} · ${r.strip.slice(0, 80)}`);
  }
  // free-text still works
  let r = await search('livingston', 'oxycodone'); ok(/found in/.test(r.strip), 'free text "oxycodone": ' + r.hash + ' · ' + r.strip.slice(0, 80));
  r = await search('livingston', 'lactate'); ok(/found in/.test(r.strip), 'free text "lactate": ' + r.hash);
  await pg.evaluate(() => { location.hash = '#/patient/livingston/summary'; }); await pg.waitForTimeout(300);
  await search('livingston', 'labs');
  ok(errs.length === 0, 'no errors ' + errs.join(';'));
  await b.close(); srv.close();
})();
