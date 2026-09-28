/* Results — cumulative lab panels, imaging/diagnostics, new-result review. */
(function () {
  'use strict';
  const esc = U.esc;
  window.Views = window.Views || {};

  Views.results = {
    label: 'Results',
    render(p, doc) {
      const pending = Model.unreviewedResults(p, doc);
      const byPanel = {};
      p.labs.forEach(l => { (byPanel[l.panel] = byPanel[l.panel] || []).push(l); });

      const panels = Object.entries(byPanel).map(([name, list]) => {
        list.sort((a, b) => b.time - a.time);
        const tests = [];
        list.forEach(l => l.results.forEach(r => { if (!tests.includes(r.t)) tests.push(r.t); }));
        const refOf = t => { for (const l of list) { const r = l.results.find(x => x.t === t); if (r && Model.labRef(r)) return Model.labRef(r) + (r.u ? ' ' + r.u : ''); } return ''; };
        const isNew = list.some(l => l.isNew && !Model.isAcked(doc, l.id));
        return UI.panel(name, `<div class="scroll-x"><table class="grid labs">
          <thead><tr><th>Test</th>${list.map(l => `<th>${U.fmtDate(l.time).slice(0, 5)} ${U.fmtTime(l.time)}${l.isNew ? '<br>' + UI.badge('NEW', 'new') : ''}</th>`).join('')}<th>Reference</th></tr></thead>
          <tbody>${tests.map(t => `<tr><th>${esc(t)}</th>${list.map(l => {
            const r = l.results.find(x => x.t === t);
            if (!r) return '<td></td>';
            const f = Model.labFlag(r);
            return `<td class="${f ? 'abn' : ''}">${esc(r.v)}${UI.flag(f)}${r.comment ? `<div class="muted small">${esc(r.comment)}</div>` : ''}</td>`;
          }).join('')}<td class="muted">${esc(refOf(t))}</td></tr>`).join('')}</tbody></table></div>`,
          { cls: isNew ? 'panel-new' : '', actions: isNew ? list.filter(l => l.isNew && !Model.isAcked(doc, l.id)).map(l => `<button class="btn btn-sm btn-primary" data-review="${esc(l.id)}">Mark Reviewed</button>`).join(' ') : '' });
      }).join('');

      const imaging = p.imaging.length ? [...p.imaging].sort((a, b) => b.time - a.time).map(i => `<article class="note ${i.isNew ? 'note-new' : ''}">
          <header><strong>${esc(i.study)}</strong>${i.isNew ? ' ' + UI.badge('NEW', 'new') : ''}<span class="muted"> — ${esc(U.fmtDT(i.time))}</span></header>
          <div class="note-body">${U.nl2br(i.text)}</div>
          ${i.isNew && !Model.isAcked(doc, i.id) ? `<button class="btn btn-sm btn-primary" data-review="${esc(i.id)}">Mark Reviewed</button>` : ''}
        </article>`).join('') : UI.empty('No imaging or diagnostic reports.');

      return `${pending.length ? `<div class="alerts"><div class="alert alert-new">${pending.length} new result(s) — review and notify the provider of critical or significantly abnormal values.</div></div>` : ''}
        ${p.labsPending ? `<div class="alerts"><div class="alert alert-info">${esc(p.labsPending)}</div></div>` : ''}
        <p class="muted">Flags: H high · L low · H* / L* critical · A abnormal.</p>
        ${panels || UI.panel('Laboratory', UI.empty('No laboratory results on file.'))}
        ${UI.panel('Imaging & Diagnostics', imaging)}`;
    },
    bind(root, p) {
      root.querySelectorAll('[data-review]').forEach(b => b.addEventListener('click', () => {
        Store.add(p.id, 'ack', { ref: b.dataset.review, kind: 'result' }, p.clock.now(), p.clock.now());
        UI.toast('Result marked as reviewed.');
        App.render();
      }));
    }
  };
})();
