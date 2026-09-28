/* Orders — provider orders, acknowledgment, and verbal/telephone order entry. */
(function () {
  'use strict';
  const esc = U.esc;
  window.Views = window.Views || {};

  const CATS = ['Admission', 'Code Status', 'Alert', 'Nursing', 'Activity', 'Diet', 'Respiratory', 'IV Fluids', 'IV Access', 'Medication', 'Blood Products', 'Lab', 'Imaging', 'Diagnostics', 'Consult'];

  function row(p, doc, o) {
    const acked = Model.isAcked(doc, o.id);
    const conflict = o.med && Model.allergyConflicts(p, o.med).length;
    const status = o.status === 'Active' ? UI.badge('Active', 'ok')
      : o.status === 'Discontinued' ? UI.badge('Discontinued', 'muted')
      : UI.badge(o.status, 'warn');
    return `<tr class="${o.status === 'Discontinued' ? 'dc' : ''} ${o.isNew && !acked ? 'row-new' : ''}">
      <td class="nowrap">${esc(U.fmtDT(o.time))}</td>
      <td>
        ${o.isNew ? UI.badge('NEW', 'new') + ' ' : ''}${o.priority ? UI.badge(o.priority, 'danger') + ' ' : ''}${conflict ? UI.badge('ALLERGY', 'danger') + ' ' : ''}
        <strong>${esc(o.text)}</strong>
        ${o.detail ? `<div class="muted">${esc(o.detail)}</div>` : ''}
        ${o.type ? `<div class="muted">${esc(o.type)} order</div>` : ''}
      </td>
      <td>${esc(o.by || '')}</td>
      <td>${status}</td>
      <td class="nowrap">${o.isNew ? (acked ? '<span class="muted">Acknowledged</span>' : `<button class="btn btn-sm btn-primary" data-ack="${esc(o.id)}">Acknowledge</button>`) : ''}</td>
    </tr>`;
  }

  Views.orders = {
    label: 'Orders',
    render(p, doc) {
      const all = [...p.orders, ...Model.medOrders(p)];
      const groups = {};
      all.forEach(o => { (groups[o.cat] = groups[o.cat] || []).push(o); });
      const order = [...CATS, ...Object.keys(groups).filter(c => !CATS.includes(c))];
      const pending = Model.unackedOrders(p, doc);

      const tables = order.filter(c => groups[c]).map(cat => UI.panel(cat,
        `<table class="grid"><thead><tr><th>Ordered</th><th>Order</th><th>Provider</th><th>Status</th><th></th></tr></thead>
         <tbody>${groups[cat].sort((a, b) => a.time - b.time).map(o => row(p, doc, o)).join('')}</tbody></table>`)).join('');

      const verbal = doc.orders;
      const verbalTable = verbal.length ? `<table class="grid"><thead><tr><th>Received</th><th>Order</th><th>Provider</th><th>Read-back</th><th></th></tr></thead><tbody>
        ${verbal.map(e => `<tr class="${e.status === 'error' ? 'error-row' : ''}">
          <td class="nowrap">${esc(U.fmtDT(e.time))}</td>
          <td><strong>${esc(e.data.text)}</strong><div class="muted">${esc(e.data.cat)} · ${esc(e.data.type)} order · received by ${esc(Model.signature(e))}</div>
            ${e.status === 'error' ? `<div class="err-label">Entered in error — ${esc(e.error.reason)}</div>` : ''}</td>
          <td>${esc(e.data.provider)}</td>
          <td>${e.data.readBack ? '✔ Read back & verified' : '—'}<div class="muted">Pending provider co-signature</div></td>
          <td>${e.status === 'active' ? `<button class="btn btn-sm btn-link" data-err="${e.id}">Mark in error</button>` : ''}</td>
        </tr>`).join('')}</tbody></table>` : UI.empty('No verbal or telephone orders entered.');

      return `
        <div class="toolbar">
          <button class="btn btn-primary" data-action="verbal">+ Enter Verbal / Telephone Order</button>
          ${pending.length ? `<button class="btn" data-action="ackall">Acknowledge All New (${pending.length})</button>` : ''}
        </div>
        ${UI.panel('Verbal & Telephone Orders (entered by nursing)', verbalTable)}
        ${tables}`;
    },
    bind(root, p, doc) {
      root.querySelectorAll('[data-ack]').forEach(b => b.addEventListener('click', () => {
        Store.add(p.id, 'ack', { ref: b.dataset.ack, kind: 'order' }, p.clock.now(), p.clock.now());
        UI.toast('Order acknowledged.');
        App.render();
      }));
      const all = root.querySelector('[data-action="ackall"]');
      if (all) all.addEventListener('click', () => {
        Model.unackedOrders(p, doc).forEach(o => Store.add(p.id, 'ack', { ref: o.id, kind: 'order' }, p.clock.now(), p.clock.now()));
        UI.toast('All new orders acknowledged.');
        App.render();
      });
      root.querySelectorAll('[data-err]').forEach(b => b.addEventListener('click', () => UI.errorEntry(p, 'orders', b.dataset.err)));
      root.querySelector('[data-action="verbal"]').addEventListener('click', () => openVerbal(p));
    }
  };

  function openVerbal(p) {
    UI.modal({
      title: 'Verbal / Telephone Order',
      wide: true,
      body: `<div class="form-grid">
          <label class="field"><span>Order type</span><select name="type"><option>Telephone</option><option>Verbal</option></select></label>
          <label class="field"><span>Category</span><select name="cat">${UI.options(CATS, 'Medication', false)}</select></label>
          <label class="field"><span>Ordering provider</span><input name="provider" value="${esc(p.attending)}" required></label>
          ${UI.timeField(p, 'Date/time received')}
        </div>
        <label class="field"><span>Order (drug, dose, route, frequency, or complete order text)</span><textarea name="text" rows="3" required></textarea></label>
        <label class="check"><input type="checkbox" name="readBack" data-single="1"> I read the complete order back to the provider and the provider confirmed it (RBTO / RBVO).</label>
        <p class="muted">Verbal/telephone orders are flagged for provider co-signature. Medications ordered this way must also be administered and documented on the eMAR.</p>`,
      buttons: [
        { label: 'Cancel' },
        { label: 'Save Order', cls: 'btn-primary', onClick: api => {
          const v = U.formValues(api.el);
          if (!v.text) { UI.formError(api.el.querySelector('.modal-body'), 'Enter the order text.'); return false; }
          if (!v.readBack) { UI.formError(api.el.querySelector('.modal-body'), 'Read-back verification is required before saving a verbal or telephone order.'); return false; }
          Store.add(p.id, 'orders', { type: v.type, cat: v.cat, provider: v.provider, text: v.text, readBack: true }, UI.readTime(p, api.el), p.clock.now());
          UI.toast('Order saved — pending provider co-signature.');
          App.render();
        } }
      ]
    });
  }
})();
