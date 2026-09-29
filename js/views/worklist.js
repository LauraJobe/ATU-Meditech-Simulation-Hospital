/*
 * Worklist — Expanse-style nursing documentation worklist.
 * Care items down the left, clocks in the time columns when each is due.
 * Click a clock or any cell to check an item, then click Document to chart
 * the checked items one after another.
 */
(function () {
  'use strict';
  const esc = U.esc;
  const H = 3600000;
  const MIN = 60000;
  window.Views = window.Views || {};

  const selection = {};              // pid -> Set of checked item keys
  const lookAhead = {};              // pid -> hours shown in time columns
  const sel = p => (selection[p.id] = selection[p.id] || new Set());

  // Frequency of vital signs from the most recent active order that mentions them.
  function vitalsInterval(p) {
    const orders = p.orders.filter(o => o.status === 'Active' && /vital signs/i.test(o.text)).sort((a, b) => b.time - a.time);
    for (const o of orders) {
      const matches = [...o.text.matchAll(/\b(?:every|q)\s*(\d+)?\s*(minutes?|min|hours?|hrs?|hr)\b/gi)];
      if (!matches.length) continue;
      // "every 5 min x3 ... then every 4 hours" -> use the last (maintenance) frequency
      const m = matches[matches.length - 1];
      const n = Number(m[1] || 1);
      const isMin = /^min/i.test(m[2]);
      return { ms: n * (isMin ? MIN : H), label: isMin ? `Q${n}MIN` : `Q${n}HOURS` };
    }
    return { ms: 4 * H, label: 'Q4HOURS' };
  }

  function items(p) {
    const forms = p.assessmentForms || [];
    const list = [];
    const vi = vitalsInterval(p);
    list.push({ key: 'vitals', name: 'Vital Signs, Routine', freq: vi.label, ms: vi.ms, tab: 'vitals', kind: 'vitals' });
    const formItem = (id, name, freq, ms) => { if (forms.includes(id)) list.push({ key: 'form:' + id, formId: id, name, freq, ms, tab: 'assess', kind: 'form' }); };
    formItem('wdl-adult', 'Nursing Shift Assessment (WDL)', 'Q12HOURS', 12 * H);
    formItem('mse', 'Mental Status Exam', 'Q12HOURS', 12 * H);
    formItem('pain', 'Pain Assessment', 'Q4HOURS', 4 * H);
    formItem('gcs', 'Glasgow Coma Scale', 'Q12HOURS', 12 * H);
    formItem('braden', 'Braden Scale Assessment', 'DAILY', 24 * H);
    formItem('morse', 'Morse Fall Risk Assessment', 'DAILY', 24 * H);
    if (p.orders.some(o => o.status === 'Active' && /I\s*&\s*O|intake/i.test(o.text))) list.push({ key: 'io', name: 'Intake and Output Measurement', freq: 'Q4HOURS', ms: 4 * H, tab: 'io', kind: 'tab' });
    if (p.heparinFlowsheet && p.meds.some(m => /heparin/i.test(m.name) && m.status === 'Active')) list.push({ key: 'heparin', name: 'Heparin Protocol / aPTT', freq: 'Q6HOURS', ms: 6 * H, tab: 'heparin', kind: 'tab' });
    list.push({ key: 'note:edu', name: 'Teaching: Patient/Family Education', freq: 'EOS', eos: true, ms: 12 * H, tab: 'notes', kind: 'note', noteType: 'Patient Education' });
    list.push({ key: 'careplan', name: 'Plan of Care Review', freq: 'DAILY', ms: 24 * H, tab: 'careplan', kind: 'tab' });
    list.push({ key: 'note:handoff', name: 'Handoff Communication', freq: 'EOS', eos: true, ms: 12 * H, tab: 'notes', kind: 'note', noteType: 'Handoff Report (I-PASS)' });
    return list;
  }

  function lastDone(p, doc, it) {
    const active = arr => arr.filter(e => e.status === 'active');
    let times = [];
    if (it.key === 'vitals') {
      times = active(doc.vitals).map(e => e.time).concat(p.vitalsPrior.filter(v => v.hr != null || v.sbp != null).map(v => v.time));
    } else if (it.formId) {
      times = active(doc.assess).filter(e => e.data.formId === it.formId).map(e => e.time);
      if (it.formId.startsWith('wdl')) times = times.concat((p.priorAssessments || []).map(a => a.time));
    } else if (it.key === 'io') {
      times = active(doc.io).map(e => e.time).concat(p.ioPrior.map(r => r.time));
    } else if (it.key === 'heparin') {
      times = active(doc.heparin).map(e => e.time);
    } else if (it.key === 'careplan') {
      times = active(doc.careplan).map(e => e.time);
    } else if (it.kind === 'note') {
      times = active(doc.notes).filter(e => e.data.type === it.noteType).map(e => e.time);
    }
    return times.length ? Math.max(...times) : null;
  }

  // End of the 12-hour shift (0700 / 1900) that contains time t.
  function shiftEnd(t) {
    const d = new Date(t);
    const h = d.getHours();
    const e = new Date(d);
    if (h >= 7 && h < 19) e.setHours(19, 0, 0, 0);
    else { if (h >= 19) e.setDate(e.getDate() + 1); e.setHours(7, 0, 0, 0); }
    return e.getTime();
  }

  function dueTime(p, it, last) {
    if (it.eos) return shiftEnd(last != null && last >= p.clock.simStart ? last + MIN : p.clock.now());
    return last == null ? p.clock.simStart : last + it.ms;
  }

  const span = ms => {
    const a = Math.abs(ms);
    const txt = a < H ? Math.round(a / MIN) + 'm' : a < 48 * H ? Math.round(a / H) + 'h' : Math.round(a / 24 / H) + 'd';
    return (ms < 0 && txt !== '0m' ? '-' : '') + txt;
  };

  // Care items with next due time (used by the status board's Interventions column).
  function due(p, doc) {
    const now = p.clock.now();
    return items(p).map(it => {
      const time = dueTime(p, it, lastDone(p, doc, it));
      return { name: it.name, time, overdue: time <= now };
    }).sort((a, b) => a.time - b.time);
  }

  function patientBand(p) {
    const allergies = p.nkda || !(p.allergies || []).length ? 'NKDA' : p.allergies.map(a => a.agent).join(', ');
    const resus = /not documented/i.test(p.codeStatus || '') ? '<span class="wb-resus">Resus Status Not Ordered</span>' : `<span class="${p.codeStatus === 'DNR' ? 'wb-dnr' : ''}">Code: ${esc(p.codeStatus)}</span>`;
    const bmi = Model.bmi(p);
    return `<div class="wl-band">
      <div class="wb-id"><div class="avatar wb-avatar" aria-hidden="true">${esc((p.name.first[0] + p.name.last[0]).toUpperCase())}</div>
        <div><div class="wb-name">${esc(p.name.last)},${esc(p.name.first)}</div>
          <div>${esc(p.age.replace(' years', ''))} ${esc(p.sex)} ${esc(U.fmtDOB(p.dob))}</div>
          <div>ADM IN ${esc(p.unit)}${p.room && p.room !== '—' ? ' ' + esc(p.room) : ''}</div></div></div>
      <div class="wb-mid">${resus}
        <div>${p.heightCm ? esc(p.heightCm) + ' cm' : ''} ${p.weightKg ? esc(p.weightKg) + ' kg' : ''}${bmi ? ' &nbsp;BMI: ' + bmi + ' kg/m²' : ''}</div>
        <div>Allergy/Adv: <span class="${allergies === 'NKDA' ? '' : 'wb-allergy'}">${esc(allergies)}</span></div></div>
      <div class="wb-right">${esc(p.mrn)}</div>
    </div>`;
  }

  Views.worklist = {
    due,
    label: 'Worklist',
    render(p, doc) {
      const now = p.clock.now();
      const hours = lookAhead[p.id] || 8;
      const checked = sel(p);
      const list = items(p).map(it => {
        const last = lastDone(p, doc, it);
        return Object.assign({ last, due: dueTime(p, it, last) }, it);
      }).sort((a, b) => a.due - b.due);

      // Time columns: every due occurrence from one hour ago through the look-ahead window.
      const from = now - H, to = now + hours * H;
      const occ = it => {
        const out = [];
        for (let t = it.due; t <= to && out.length < 50; t += it.ms) if (t >= from) out.push(t);
        return out;
      };
      const colTimes = [...new Set(list.flatMap(occ).map(t => Math.floor(t / MIN) * MIN))].sort((a, b) => a - b).slice(0, 12);
      const day = t => new Date(t).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });

      const rows = list.map(it => {
        const diff = it.due - now;
        const times = new Set(occ(it).map(t => Math.floor(t / MIN) * MIN));
        const on = checked.has(it.key);
        return `<tr class="wl-row ${on ? 'wl-checked' : ''}" data-key="${esc(it.key)}" tabindex="0">
          <td class="wl-a">${on ? '<span class="wl-check">✔</span>' : 'A'}</td>
          <td class="wl-item"><span>${esc(it.name)}</span><span class="wl-freq">${esc(it.freq)}</span></td>
          <td class="nowrap wl-last">${it.last == null ? '' : span(now - it.last).replace('-', '')}</td>
          <td class="nowrap wl-status ${diff <= 0 ? 'wl-late' : ''}">${span(diff)}</td>
          ${colTimes.map(t => `<td class="wl-cell ${t <= now ? 'wl-past' : ''}">${times.has(t) ? `<svg class="wl-clock" viewBox="0 0 20 20" role="img" aria-label="Due ${U.fmtTime(t)}"><circle cx="10" cy="10" r="7.5"/><path d="M10 5.5V10h3.5"/></svg>` : ''}</td>`).join('')}
        </tr>`;
      }).join('');

      const btn = (label, action, enabled) => `<button class="wl-btn" ${action ? `data-wl="${action}"` : ''} ${enabled ? '' : 'disabled'}>${label}</button>`;
      const any = checked.size > 0;
      return `${patientBand(p)}
        <div class="wl-bar">
          <div>${btn('Prior', '', false)}${btn('Next', '', false)}</div>
          <div>${btn('Refresh', 'refresh', true)}${btn('Change<br>View', 'view', true)}${btn('Add', '', false)}</div>
          <div>${btn('Not<br>Done', '', false)}${btn('View/<br>Edit', 'viewedit', any)}</div>
          <div>${btn('Detail', 'detail', any)}${btn('Document', 'document', any)}</div>
          <div>${btn('Utility', '', false)}${btn('Questionnaires', '', false)}</div>
          <div class="wl-bar-right">${btn('Close', 'close', true)}</div>
        </div>
        <div class="wl-filter"><strong>Page 1 of 1</strong>
          <div><span class="wl-filterbtn">Filter ▾</span> Include: Interventions; Look Ahead: ${hours} Hours</div>
          <div class="muted small">Click a clock or any cell to check a care item, then click <strong>Document</strong>. ${any ? `<strong>${checked.size}</strong> item(s) checked.` : ''}</div>
        </div>
        <div class="scroll-x"><table class="grid worklist">
          <thead><tr><th></th><th class="wl-item-h">Care Item</th><th>Last<br>Done</th><th>Status/<br>Due ▾</th>
            ${colTimes.map(t => `<th class="wl-time ${t <= now ? 'wl-past' : ''}">${esc(day(t))}<br>${U.fmtTime(t).replace(/(\d\d)(\d\d)/, '$1:$2')}</th>`).join('')}</tr></thead>
          <tbody>${rows}</tbody></table></div>`;
    },
    bind(root, p) {
      const list = items(p);
      const byKey = k => list.find(x => x.key === k);
      root.querySelectorAll('.wl-row').forEach(r => {
        const toggle = () => { const s = sel(p); s.has(r.dataset.key) ? s.delete(r.dataset.key) : s.add(r.dataset.key); App.render(); };
        r.addEventListener('click', toggle);
        r.addEventListener('keydown', e => { if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); toggle(); } });
      });
      const act = (name, fn) => { const b = root.querySelector(`[data-wl="${name}"]`); if (b) b.addEventListener('click', fn); };
      act('refresh', () => App.render());
      act('view', () => { lookAhead[p.id] = (lookAhead[p.id] || 8) === 8 ? 12 : 8; App.render(); });
      act('close', () => { location.hash = `#/patient/${p.id}/summary`; });
      act('viewedit', () => { const it = byKey([...sel(p)][0]); if (it) location.hash = `#/patient/${p.id}/${it.tab}`; });
      act('detail', () => {
        const doc = Store.doc(p.id);
        UI.modal({ title: 'Care Item Detail', body: [...sel(p)].map(byKey).filter(Boolean).map(it => {
          const last = lastDone(p, doc, it);
          return `<div class="detail-row"><strong>${esc(it.name)}</strong> — ${esc(it.freq)}<br>Last done: ${last ? esc(U.fmtDT(last)) : 'not yet this scenario'} · Next due: ${esc(U.fmtDT(dueTime(p, it, last)))}</div>`;
        }).join('') });
      });
      act('document', () => run(p, [...sel(p)], byKey));
    }
  };

  // Chart the checked items one after another.
  function run(p, keys, byKey) {
    if (!keys.length) return;
    const it = byKey(keys[0]);
    const rest = keys.slice(1);
    const next = () => { sel(p).delete(it.key); App.render(); run(p, rest, byKey); };
    if (!it) { run(p, rest, byKey); return; }
    if (it.kind === 'form' && Views.assess.open) Views.assess.open(p, it.formId, next);
    else if (it.kind === 'vitals' && Views.vitals.modal) Views.vitals.modal(p, next);
    else if (it.kind === 'note' && Views.notes.write) Views.notes.write(p, it.noteType, next);
    else { sel(p).delete(it.key); location.hash = `#/patient/${p.id}/${it.tab}`; }
  }

  Views.worklist.run = run;
})();
