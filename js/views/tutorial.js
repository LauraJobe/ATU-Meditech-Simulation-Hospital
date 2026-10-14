/*
 * EMR Orientation — guided task panel (orientation.html only).
 * A floating checklist of practice tasks on the practice patient. Each task checks itself off
 * from what the student actually charts (or from a short question). "Show me" opens the right
 * screen and highlights where to start. On the MAR, practice labels stand in for a scanner.
 * When every task is done, the student can print a completion summary for faculty.
 */
(function () {
  'use strict';
  const esc = U.esc;
  const C = window.EHR_CONFIG;
  const PID = 'practice';
  const SCHEDULED = ['prac-ceftriaxone', 'prac-lisinopril'];
  const PRN = 'prac-apap';
  const chart = tab => `#/patient/${PID}/${tab}`;

  /* ---------- Per-student progress (kept on this device) ---------- */
  const key = () => `${C.storagePrefix}.tutorial.${((Store.session() || {}).name || 'guest').toLowerCase()}`;
  function load() {
    try { return Object.assign({ quiz: {}, doneAt: {}, collapsed: false }, JSON.parse(localStorage.getItem(key()) || '{}')); }
    catch (e) { return { quiz: {}, doneAt: {}, collapsed: false }; }
  }
  function save(st) { try { localStorage.setItem(key(), JSON.stringify(st)); } catch (e) { /* storage blocked */ } }

  const active = (doc, sec) => (doc[sec] || []).filter(e => e.status === 'active');

  const TASKS = [
    { id: 'open', title: 'Open your patient',
      how: 'On the <strong>PCS Status Board</strong>, double-click <strong>Morgan, Taylor</strong> (or select the row, then <strong>Open Chart</strong>).',
      show: { hash: '#/census', sel: `.census-row[data-open="${PID}"]` },
      done: st => !!st.opened },
    { id: 'safety', title: 'Check allergies and code status',
      how: 'In the chart, find the patient panel with <strong>Special Indicators</strong> and <strong>Allergies</strong> (beside the chart tabs). Then answer:',
      show: { hash: chart('summary'), sel: '.side' },
      quiz: [{ name: 'allergy', label: 'Allergy', options: ['No known drug allergies', 'Penicillin', 'Sulfa drugs', 'Latex'], answer: 'Sulfa drugs' },
             { name: 'code', label: 'Code status', options: ['Full Code', 'DNR', 'DNR/DNI'], answer: 'Full Code' }],
      done: st => !!st.quiz.safety },
    { id: 'hgb', title: 'Find the latest hemoglobin (Hgb)',
      how: 'Open the <strong>Diagnostics</strong> tab. Results run from oldest to newest, left to right — use the newest column.',
      show: { hash: chart('results'), sel: `.ftab[href="${chart('results')}"]` },
      quiz: [{ name: 'hgb', label: 'Latest Hgb (g/dL)', input: true, answer: '11.8' }],
      done: st => !!st.quiz.hgb },
    { id: 'ack', title: 'Acknowledge the new order',
      how: 'Select <strong>Orders</strong> in the toolbar. Find the order marked <strong>NEW</strong> (ambulate in the hallway) and acknowledge it.',
      show: { hash: chart('orders'), sel: '[data-ack="prac-o-new"], [data-action="ackall"]' },
      done: (st, p, doc) => Model.isAcked(doc, 'prac-o-new') },
    { id: 'vitals', title: 'Chart a set of vital signs',
      how: 'Select <strong>Document</strong> (the Worklist). Check the <strong>Vital Signs</strong> row, select <strong>Document</strong>, and enter the vital signs you obtained.',
      show: { hash: chart('worklist'), sel: '.wl-row[data-key="vitals"]' },
      done: (st, p, doc) => active(doc, 'vitals').length > 0 },
    { id: 'assess', title: 'Complete a focused assessment',
      how: 'On the Worklist, check <strong>Pain Assessment</strong> (or another assessment), select <strong>Document</strong>, and complete the form.',
      show: { hash: chart('worklist'), sel: '.wl-row[data-key="form:pain"]' },
      done: (st, p, doc) => active(doc, 'assess').length > 0 },
    { id: 'sched', title: 'Give a scheduled medication',
      how: 'Open the <strong>MAR</strong> (Document ▾ → Mar). Tap the <strong>wristband</strong> practice label, then the label for a scheduled medication (ceftriaxone or lisinopril). Select <strong>Save</strong>, review, then <strong>Document</strong>.',
      show: { hash: chart('mar'), sel: '.tut-labels' },
      done: (st, p, doc) => active(doc, 'mar').some(e => SCHEDULED.includes(e.data.medId) && e.data.action === 'Given' && e.data.scan && e.data.scan.patient === 'verified' && e.data.scan.med === 'verified') },
    { id: 'prn', title: 'Give a PRN and document its effectiveness',
      how: 'On the MAR, scan the wristband, then <strong>two acetaminophen 325 mg</strong> labels (they add up to the 650 mg dose). Save and Document. Then select <strong>Reassess</strong> on the acetaminophen row to document how well it worked.',
      show: { hash: chart('mar'), sel: `[data-prn="${PRN}"], .tut-labels` },
      done: (st, p, doc) => { const m = active(doc, 'mar'); return m.some(e => e.data.medId === PRN && e.data.action === 'Given') && m.some(e => e.data.medId === PRN && e.data.action === 'Effectiveness'); } },
    { id: 'note', title: 'Write a nursing note',
      how: 'Select <strong>Document ▾ → Write Note</strong>. Describe the care you gave, then sign the note.',
      show: { hash: chart('summary'), sel: '.tb-split .tb-caret' },
      done: (st, p, doc) => active(doc, 'notes').length > 0 }
  ];

  function status(st) {
    const p = Model.get(PID);
    const doc = Store.doc(PID);
    let changed = false;
    const list = TASKS.map(t => {
      const ok = !!t.done(st, p, doc);
      if (ok && !st.doneAt[t.id]) { st.doneAt[t.id] = Date.now(); changed = true; }
      return { t, ok };
    });
    if (changed) save(st);
    return list;
  }

  /* ---------- Panel ---------- */
  function root() {
    let el = document.getElementById('tut-root');
    if (!el) { el = document.createElement('div'); el.id = 'tut-root'; document.body.appendChild(el); }
    return el;
  }

  function quizHtml(t) {
    return `<form class="tut-quiz" data-quiz="${t.id}">${t.quiz.map(q => q.input
      ? `<label class="field"><span>${esc(q.label)}</span><input name="${q.name}" inputmode="decimal" autocomplete="off"></label>`
      : `<label class="field"><span>${esc(q.label)}</span><select name="${q.name}"><option value="">— choose —</option>${q.options.map(o => `<option>${esc(o)}</option>`).join('')}</select></label>`).join('')}
      <button type="submit" class="btn btn-sm btn-primary">Check answer</button><div class="tut-msg" aria-live="polite"></div></form>`;
  }

  function render() {
    const el = root();
    const s = Store.session();
    if (!s) { el.innerHTML = ''; document.body.classList.remove('tut-open'); return; }
    const st = load();
    if (App.current && App.current.id === PID && !st.opened) { st.opened = Date.now(); save(st); }
    const list = status(st);
    const n = list.filter(x => x.ok).length;
    const current = list.find(x => !x.ok);
    // The open panel takes its own space beside (or below) the EHR so it never covers a button.
    document.body.classList.toggle('tut-open', !st.collapsed);
    if (st.collapsed) {
      el.innerHTML = `<button type="button" class="tut-pill" data-tut="expand" aria-label="Show orientation tasks">🎓 Orientation ${n}/${TASKS.length}</button>`;
    } else {
      el.innerHTML = `<aside class="tut" aria-label="EMR orientation tasks">
        <div class="tut-h"><strong>🎓 EMR Orientation</strong><span class="tut-count">${n} of ${TASKS.length} done</span>
          <button type="button" class="tut-min" data-tut="collapse" aria-label="Hide orientation tasks">–</button></div>
        <div class="tut-bar"><span style="width:${Math.round(100 * n / TASKS.length)}%"></span></div>
        <ol class="tut-list">${list.map(({ t, ok }) => {
          const cur = current && current.t === t;
          return `<li class="${ok ? 'tut-done' : cur ? 'tut-cur' : ''}"><div class="tut-t"><span class="tut-mark" aria-hidden="true">${ok ? '✔' : ''}</span>${esc(t.title)}</div>
            ${cur ? `<div class="tut-how">${t.how}</div>${t.quiz ? quizHtml(t) : ''}<button type="button" class="btn btn-sm tut-show" data-show="${t.id}">👀 Show me</button>` : ''}</li>`;
        }).join('')}</ol>
        ${current ? '' : `<div class="tut-complete"><strong>Orientation complete!</strong> You are ready to chart in simulation.<button type="button" class="btn btn-primary btn-block" data-tut="summary">Print completion summary</button></div>`}
        <div class="tut-foot"><button type="button" class="tut-link" data-tut="summary">Progress summary</button><button type="button" class="tut-link" data-tut="reset">Start over</button></div>
      </aside>`;
    }
    bind(el, st);
  }

  function bind(el, st) {
    const on = (sel, fn) => el.querySelectorAll(sel).forEach(b => b.addEventListener('click', fn));
    on('[data-tut="collapse"]', () => { st.collapsed = true; save(st); render(); });
    on('[data-tut="expand"]', () => { st.collapsed = false; save(st); render(); });
    on('[data-tut="summary"]', () => summary());
    on('[data-tut="reset"]', () => UI.confirm('Start Over', 'Erase your practice charting on Morgan, Taylor and start the orientation tasks again?', () => {
      Store.saveDoc(PID, {});
      Store.restartScenario(PID);
      try { localStorage.removeItem(key()); } catch (e) { /* ignore */ }
      location.hash = '#/census';
      App.render();
    }, 'Start Over'));
    on('[data-show]', e => showMe(TASKS.find(t => t.id === e.currentTarget.dataset.show)));
    el.querySelectorAll('[data-quiz]').forEach(f => f.addEventListener('submit', e => {
      e.preventDefault();
      const t = TASKS.find(x => x.id === f.dataset.quiz);
      const v = U.formValues(f);
      const wrong = t.quiz.filter(q => String(v[q.name] || '').trim().replace(/\s+/g, ' ').toLowerCase() !== q.answer.toLowerCase());
      const msg = f.querySelector('.tut-msg');
      if (wrong.length) { msg.className = 'tut-msg bad'; msg.textContent = `Not quite — check ${wrong.map(q => q.label.toLowerCase()).join(' and ')} in the chart and try again.`; return; }
      st.quiz[t.id] = true; save(st);
      UI.toast('Correct!');
      render();
    }));
  }

  function showMe(t) {
    const glow = () => {
      const els = document.querySelectorAll(t.show.sel);
      if (!els.length) { UI.toast('Open the screen named in the step, then try Show me again.', 'info'); return; }
      els.forEach(x => x.classList.add('tut-glow'));
      els[0].scrollIntoView({ block: 'center' });
      setTimeout(() => els.forEach(x => x.classList.remove('tut-glow')), 4500);
    };
    if (location.hash !== t.show.hash) { location.hash = t.show.hash; setTimeout(glow, 450); } else glow();
  }

  /* ---------- Practice labels on the MAR (tap = scan) ---------- */
  function practiceLabels(app) {
    const bar = app.querySelector('.mg-scanbar');
    if (!bar || !App.current) return;
    const p = App.current;
    const labels = [{ code: String(p.mrn), text: `Wristband — ${p.name.last.toUpperCase()}, ${p.name.first}`, cls: 'tut-wrist' }];
    p.meds.filter(m => m.status === 'Active').forEach(m => {
      labels.push({ code: Model.barcodeFor(m), text: `${m.name} ${m.dose} — pharmacy label` });
      // Oral and other unit-dose meds also get single-unit labels (e.g., 2 × 325 mg); IV meds only the pharmacy label.
      if (m.type !== 'continuous' && !/\bIV/i.test(m.route)) Scan.products(m).forEach(d => labels.push({ code: Scan.productCode(m, d), text: `${m.name.split(/\s+\(|\s+—/)[0]} ${Scan.fmt(d)} — 1 unit` }));
    });
    bar.insertAdjacentHTML('afterend', `<div class="tut-labels" role="group" aria-label="Practice labels">
      <div class="tut-labels-h">🏷 Practice labels — tap a label to scan it (wristband first)</div>
      ${labels.map(l => `<button type="button" class="tut-label ${l.cls || ''}" data-code="${esc(l.code)}"><span class="tut-bars" aria-hidden="true"></span>${esc(l.text)}</button>`).join('')}</div>`);
    app.querySelectorAll('.tut-label').forEach(b => b.addEventListener('click', () => {
      if (Screens.mode() === 'observer') { UI.toast('Observer mode is view only. You cannot document.', 'warn'); return; }
      Views.mar.scan(Model.get(p.id), b.dataset.code);
    }));
  }

  /* ---------- Completion summary (printable) ---------- */
  function summary() {
    const s = Store.session() || {};
    const st = load();
    const list = status(st);
    const n = list.filter(x => x.ok).length;
    const rows = list.map(({ t, ok }) => `<tr><td>${ok ? '✔' : '—'}</td><td>${esc(t.title)}</td><td>${ok && st.doneAt[t.id] ? esc(new Date(st.doneAt[t.id]).toLocaleString('en-US')) : 'Not done'}</td></tr>`).join('');
    const html = `<h2 style="margin:0 0 4px">EMR Orientation — ${n === TASKS.length ? 'Completed' : 'Progress'}</h2>
      <p style="margin:0 0 10px">${esc(C.hospitalName)} · Practice patient: Morgan, Taylor (MRN ORIENT-001)</p>
      <p><strong>Student:</strong> ${esc(s.name || '')}${s.cred ? ', ' + esc(s.cred) : ''}${s.group ? ` · <strong>Group:</strong> ${esc(s.group)}` : ''}<br><strong>Printed:</strong> ${esc(new Date().toLocaleString('en-US'))}<br><strong>Tasks completed:</strong> ${n} of ${TASKS.length}</p>
      <table class="grid"><thead><tr><th></th><th>Task</th><th>Completed</th></tr></thead><tbody>${rows}</tbody></table>`;
    UI.modal({
      title: 'Orientation Summary', wide: true, body: `<div class="tut-summary">${html}</div>`,
      buttons: [{ label: 'Close' }, { label: 'Print', cls: 'btn-primary', onClick: () => {
        const w = window.open('', '_blank');
        if (!w) { window.print(); return false; }
        w.document.write(`<!doctype html><html><head><meta charset="utf-8"><title>EMR Orientation Summary</title><style>body{font:14px Arial,sans-serif;margin:32px;color:#111}table{border-collapse:collapse;width:100%}th,td{border:1px solid #999;padding:6px 8px;text-align:left}th{background:#eee}</style></head><body>${html}<p style="margin-top:28px">Faculty initials: ____________ &nbsp; Date: ____________</p></body></html>`);
        w.document.close(); w.focus(); setTimeout(() => w.print(), 300);
        return false;
      } }]
    });
  }

  window.Tutorial = {
    afterRender(app) {
      if (location.hash.indexOf(`#/patient/${PID}/mar`) === 0) practiceLabels(app);
      render();
    },
    tasks: TASKS
  };
})();
