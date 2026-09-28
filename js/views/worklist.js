/* Worklist — nursing care items with frequency, last done, and status/due. */
(function () {
  'use strict';
  const esc = U.esc;
  const H = 3600000;
  window.Views = window.Views || {};

  // Frequency of vital signs from the most recent active order that mentions them.
  function vitalsInterval(p) {
    const orders = p.orders.filter(o => o.status === 'Active' && /vital signs/i.test(o.text)).sort((a, b) => b.time - a.time);
    for (const o of orders) {
      const matches = [...o.text.matchAll(/\b(?:every|q)\s*(\d+)?\s*(minutes?|min|hours?|hrs?|hr)\b/gi)];
      if (!matches.length) continue;
      // "every 5 min x3 ... then every 4 hours" -> use the last (maintenance) frequency
      const m = matches[matches.length - 1];
      const n = Number(m[1] || 1);
      const ms = /^min/i.test(m[2]) ? n * 60000 : n * H;
      return { ms, label: /^min/i.test(m[2]) ? `Q${n}MIN` : `Q${n}H` };
    }
    return { ms: 4 * H, label: 'Q4H' };
  }

  function items(p) {
    const forms = p.assessmentForms || [];
    const list = [];
    const vi = vitalsInterval(p);
    list.push({ key: 'vitals', name: 'Vital Signs', freq: vi.label, ms: vi.ms, tab: 'vitals' });
    const formItem = (id, name, freq, ms) => { if (forms.includes(id)) list.push({ key: 'form:' + id, formId: id, name, freq, ms, tab: 'assess' }); };
    formItem('wdl-adult', 'Physical Assessment (WDL)', 'Q12H', 12 * H);
    formItem('mse', 'Mental Status Exam', 'Q12H', 12 * H);
    formItem('pain', 'Pain Assessment', 'Q4H', 4 * H);
    formItem('gcs', 'Glasgow Coma Scale', 'Q12H', 12 * H);
    formItem('braden', 'Braden Scale Assessment', 'DAILY', 24 * H);
    formItem('morse', 'Morse Fall Risk Assessment', 'DAILY', 24 * H);
    if (p.orders.some(o => o.status === 'Active' && /I\s*&\s*O|intake/i.test(o.text))) list.push({ key: 'io', name: 'Intake and Output Measurement', freq: 'Q4H', ms: 4 * H, tab: 'io' });
    if (p.heparinFlowsheet && p.meds.some(m => /heparin/i.test(m.name) && m.status === 'Active')) list.push({ key: 'heparin', name: 'Heparin Protocol / aPTT', freq: 'Q6H', ms: 6 * H, tab: 'heparin' });
    list.push({ key: 'careplan', name: 'Plan of Care Review', freq: 'DAILY', ms: 24 * H, tab: 'careplan' });
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
    }
    return times.length ? Math.max(...times) : null;
  }

  const ago = ms => ms < H ? Math.max(0, Math.round(ms / 60000)) + 'm' : ms < 48 * H ? Math.round(ms / H) + 'h' : Math.round(ms / 24 / H) + 'd';

  Views.worklist = {
    label: 'Worklist',
    render(p, doc) {
      const now = p.clock.now();
      const rows = items(p).map(it => {
        const last = lastDone(p, doc, it);
        let status, cls;
        if (last == null) { status = 'Due now'; cls = 'wl-overdue'; }
        else {
          const due = last + it.ms;
          if (now >= due) { status = `Overdue ${ago(now - due)}`; cls = 'wl-overdue'; }
          else if (due - now <= H) { status = `Due ${U.fmtTime(due)}`; cls = 'wl-due'; }
          else { status = `Due ${U.fmtTime(due)}`; cls = ''; }
        }
        return `<tr class="${cls}">
          <td class="wl-a">A</td>
          <td><strong>${esc(it.name)}</strong></td>
          <td class="nowrap">${esc(it.freq)}</td>
          <td class="nowrap">${last == null ? '—' : `${ago(now - last)} <span class="muted small">(${U.fmtTime(last)})</span>`}</td>
          <td class="nowrap wl-status">${cls === 'wl-overdue' ? '<span class="wl-star">★</span> ' : ''}${esc(status)}</td>
          <td class="nowrap"><button class="btn btn-sm btn-primary" data-doc="${esc(it.key)}">Document</button></td>
        </tr>`;
      }).join('');
      return `<p class="muted">Care items come from active orders and this unit's assessment standards. "Last Done" updates as you chart.</p>
        <div class="scroll-x"><table class="grid worklist"><thead><tr><th></th><th>Care Item</th><th>Frequency</th><th>Last Done</th><th>Status / Due</th><th></th></tr></thead>
        <tbody>${rows}</tbody></table></div>`;
    },
    bind(root, p) {
      const list = items(p);
      root.querySelectorAll('[data-doc]').forEach(b => b.addEventListener('click', () => {
        const it = list.find(x => x.key === b.dataset.doc);
        if (it.formId && Views.assess.open) { Views.assess.open(p, it.formId); return; }
        location.hash = `#/patient/${p.id}/${it.tab}`;
      }));
    }
  };
})();
