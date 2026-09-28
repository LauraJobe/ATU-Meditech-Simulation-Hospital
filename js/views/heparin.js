/* Heparin Flowsheet — nurse-driven heparin protocol documentation (two-RN verification). */
(function () {
  'use strict';
  const esc = U.esc;
  window.Views = window.Views || {};

  const COLS = [
    ['drawTime', 'Time of aPTT draw', 'time'], ['aptt', 'aPTT result (sec)', 'number'], ['hold', 'Hold infusion (min)', 'number'],
    ['bolus', 'Heparin bolus (units)', 'number'], ['change', 'Rate change (units/kg/hr)', 'text'], ['newRate', 'New infusion rate (units/kg/hr)', 'text'],
    ['nextAptt', 'Time of next aPTT', 'time'], ['rn2', 'RN 2 (verifier)', 'text']
  ];

  Views.heparin = {
    label: 'Heparin Flowsheet',
    render(p, doc) {
      const rows = [...doc.heparin].sort((a, b) => a.time - b.time);
      const table = `<div class="scroll-x"><table class="grid"><thead><tr><th>Date/time</th>${COLS.map(c => `<th>${esc(c[1])}</th>`).join('')}<th>RN 1</th><th></th></tr></thead><tbody>
        ${p.labs.flatMap(l => l.results.filter(r => r.t === 'aPTT').map(r => `<tr class="prior-row"><td>${esc(U.fmtDT(l.time))}</td><td></td><td>${esc(r.v)}</td><td colspan="${COLS.length - 1}" class="muted">Lab result — ${esc(l.panel)}</td><td></td></tr>`)).join('')}
        ${rows.map(e => `<tr class="${e.status === 'error' ? 'error-row' : ''}"><td class="nowrap">${esc(U.fmtDT(e.time))}</td>${COLS.map(c => `<td>${esc(e.data[c[0]] || '')}</td>`).join('')}<td>${esc(Model.signature(e))}</td>
          <td>${e.status === 'active' ? `<button class="btn btn-sm btn-link" data-err="${e.id}">Error</button>` : ''}</td></tr>`).join('')}
        </tbody></table></div>`;
      const form = `<form class="hep-form" autocomplete="off"><div class="form-grid g4">
          ${UI.timeField(p, 'Date/time')}
          ${COLS.map(([k, label, type]) => `<label class="field"><span>${esc(label)}</span><input name="${k}" type="${type === 'number' ? 'number' : type === 'time' ? 'time' : 'text'}"></label>`).join('')}
        </div>
        <p class="muted">Weight used for protocol: ${p.weightKg ? esc(p.weightKg + ' kg') : 'see order'}. Both RNs must verify the bolus, initial rate, and every rate change.</p>
        <div class="form-actions"><button class="btn btn-primary" type="submit">Save Row</button></div></form>`;
      return UI.panel('Add Heparin Flowsheet Entry', form) + UI.panel('Heparin Flowsheet', table);
    },
    bind(root, p) {
      root.querySelector('.hep-form').addEventListener('submit', e => {
        e.preventDefault();
        const f = e.target;
        const v = U.formValues(f);
        delete v._time;
        if (!v.aptt && !v.bolus && !v.newRate) { UI.formError(f, 'Enter an aPTT result, bolus, or new rate.'); return; }
        if ((v.bolus || v.newRate || v.change) && !v.rn2) { UI.formError(f, 'A second RN must verify bolus and rate changes.'); return; }
        Store.add(p.id, 'heparin', v, UI.readTime(p, f), p.clock.now());
        UI.toast('Heparin flowsheet updated.');
        App.render();
      });
      root.querySelectorAll('[data-err]').forEach(b => b.addEventListener('click', () => UI.errorEntry(p, 'heparin', b.dataset.err)));
    }
  };
})();
