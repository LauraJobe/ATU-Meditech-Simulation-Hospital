/* eMAR — medication administration with barcode verification and safety checks. */
(function () {
  'use strict';
  const esc = U.esc;
  const C = window.EHR_CONFIG;
  window.Views = window.Views || {};

  const STATUS_TEXT = { given: 'Given', notgiven: 'Not given', due: 'Due', overdue: 'Overdue', future: 'Scheduled', notdue: 'Not due today', dc: 'DC\'d', hold: 'Held' };
  const INFUSION_ACTIONS = ['Started / hung', 'Rate verified', 'Rate change', 'Paused', 'Resumed', 'Bolus completed', 'Stopped / discontinued'];
  const NOT_GIVEN = ['Held — hold parameters met', 'Held — provider notified', 'Patient refused', 'Patient NPO', 'Patient off unit', 'Medication unavailable', 'Clarification needed with provider', 'Allergy — not given', 'Other (see comment)'];
  const SITES = ['', 'Right arm', 'Left arm', 'Right hand', 'Left hand', 'Abdomen — RUQ', 'Abdomen — LUQ', 'Abdomen — RLQ', 'Abdomen — LLQ', 'Right thigh', 'Left thigh', 'Right deltoid', 'Left deltoid', 'Right ventrogluteal', 'Left ventrogluteal', 'PIV — right', 'PIV — left', 'Central line', 'Other'];
  const PRE = {
    HR: ['hr', 'Heart rate (bpm)'], SBP: ['sbp', 'Systolic BP'], DBP: ['dbp', 'Diastolic BP'], RR: ['rr', 'Respiratory rate'],
    SpO2: ['spo2', 'SpO₂ (%)'], Temp: ['temp', 'Temp (°F)'], Glucose: ['glucose', 'Blood glucose (mg/dL)'], Pain: ['pain', 'Pain score (0–10)']
  };


  function typeOf(m) { return m.type === 'once' ? 'scheduled' : m.type; }

  function statusBadge(m) {
    if (m.status === 'Active') return '';
    const kind = m.status === 'Do Not Administer' ? 'danger' : m.status === 'Discontinued' ? 'muted' : 'warn';
    return UI.badge(m.status, kind);
  }

  function infusionState(doc, m) {
    const e = doc.mar.filter(x => x.status === 'active' && x.data.medId === m.id && x.data.infusion).sort((a, b) => b.time - a.time)[0];
    if (e) return `${e.data.action}${e.data.rate ? ' — ' + e.data.rate : ''} at ${U.fmtTime(e.time)} (${Model.signature(e)})`;
    if (m.startedPrior) return `Infusing — started ${U.fmtTime(m.startedPrior.time)} (${m.startedPrior.by})`;
    return 'Not started';
  }

  /* ---------------- MAR grid (Expanse style, its own screen) ---------------- */

  const include = { active: true, stat: true, iv: true, prn: true, dc: false };
  let days = 3;              // Change View: 2 (yesterday + today) or 3 (+ tomorrow)
  let selected = null;       // medication selected for Detail
  const DAY = 86400000;
  const dayStart = t => { const d = new Date(t); d.setHours(0, 0, 0, 0); return d.getTime(); };
  const hhmm = t => U.fmtTime(t);
  const rel = ms => { const a = Math.abs(ms); const txt = a < 3600000 ? Math.round(a / 60000) + 'm' : a < 48 * 3600000 ? Math.round(a / 3600000) + 'h' : Math.round(a / DAY) + 'd'; return (ms < 0 ? '+' : '-') + txt; };

  function shown(m) {
    const inactive = m.status === 'Discontinued';
    if (inactive && !include.dc) return false;
    if (!inactive && !include.active) return false;
    if (m.type === 'once') return include.stat;
    if (m.type === 'continuous') return include.iv;
    if (m.type === 'prn') return include.prn;
    return true;
  }

  function doseCell(p, doc, m, dt) {
    const s = Model.doseStatus(p, doc, m, dt);
    const now = p.clock.now();
    const who = s.entry ? U.initials(s.entry.user.name) : (dt.priorBy || dt.priorNGBy || '');
    let txt = '';
    if (s.code === 'given') txt = `✔ ${s.entry ? hhmm(s.entry.time) : hhmm(dt.time)}${who ? ' ' + esc(who) : ''}`;
    else if (s.code === 'notgiven') txt = `Not given${who ? ' ' + esc(who) : ''}`;
    else if (s.code === 'due') txt = Math.abs(now - dt.time) < 60000 ? 'Due' : `Due ${rel(now - dt.time)}`;
    else if (s.code === 'overdue') txt = rel(now - dt.time);
    else if (s.code === 'notdue') txt = 'Not today';
    else if (s.code === 'dc') txt = 'DC';
    else if (s.code === 'hold') txt = 'Held';
    return `<td class="mg-cell mg-${s.code}"><button class="mg-btn" data-dose="${esc(dt.key)}" title="${esc(STATUS_TEXT[s.code])} — scheduled ${U.fmtDT(dt.time)}">${txt || '&nbsp;'}</button></td>`;
  }

  function medCell(p, m, rows) {
    const conflicts = Model.allergyConflicts(p, m);
    const sig = [m.dose, m.route, m.freq].filter(x => x && x !== '—').join(' ');
    const t = m.type === 'once' ? 'ONE' : m.type === 'prn' ? 'PRN' : m.type === 'continuous' ? 'IV' : 'SCH';
    return `<td class="mg-start" rowspan="${rows}">${esc(U.fmtDT(m.orderTime))}${m.dcTime ? `<br>${esc(U.fmtDT(m.dcTime))}` : ''}<br><span class="${m.status === 'Active' ? '' : 'mg-status-off'}">${esc(m.status)}</span>
        ${m.isNew ? '<br>' + UI.badge('NEW', 'new') : ''}</td>
      <td class="mg-med ${selected === m.id ? 'mg-selected' : ''}" rowspan="${rows}" data-select="${esc(m.id)}" tabindex="0">
        ${m.highAlert ? UI.badge('HIGH ALERT', 'danger') + ' ' : ''}${conflicts.length ? UI.badge('ALLERGY: ' + conflicts.map(a => a.agent).join(', '), 'danger') + ' ' : ''}
        <strong>${esc(m.name)}</strong> ${esc(sig)} ${t}${m.protocol ? ' ' + Views.protocol.link(p, m.protocol) : ''}
        <div class="mg-give">Give: ${esc(m.dose)}${m.rate && m.type === 'continuous' ? ' · Rate ' + esc(m.rate) : ''}</div>
        ${m.indication ? `<div class="mg-give">PRN Reason / indication: ${esc(m.indication)}</div>` : ''}
        ${m.instructions ? `<div class="med-instr">${esc(m.instructions)}</div>` : ''}
        ${m.holdReason ? `<div class="med-hold">${esc(m.holdReason)}</div>` : ''}
        ${m.holdIf ? `<div class="med-hold">Hold if ${m.holdIf.map(h => `${esc(h.p)} ${esc(h.op)} ${esc(h.v)}`).join(' or ')}</div>` : ''}
      </td>`;
  }

  function medRows(p, doc, m, cols) {
    const t = typeOf(m);
    if (t === 'prn') {
      const last = Model.lastGiven(doc, m);
      const pending = doc.mar.filter(e => e.status === 'active' && e.data.medId === m.id && e.data.action === 'Given' && e.data.prn &&
        !doc.mar.some(x => x.status === 'active' && x.data.action === 'Effectiveness' && x.data.refId === e.id));
      return `<tr>${medCell(p, m, 2)}<td class="mg-time">PRN</td><td class="mg-span" colspan="${cols.length}">
          ${m.status === 'Active' ? `<button class="btn btn-sm btn-primary" data-prn="${esc(m.id)}">+ Give PRN</button>` : ''}
          ${pending.map(e => `<button class="btn btn-sm" data-effect="${e.id}" data-med="${esc(m.id)}">Document effectiveness (dose ${hhmm(e.time)})</button>`).join(' ')}</td></tr>
        <tr><td class="mg-time muted">Last Admin</td><td class="mg-span muted" colspan="${cols.length}">${last ? esc(U.fmtDT(last.time) + ' — ' + last.by) : 'none on record'}</td></tr>`;
    }
    if (t === 'continuous') {
      const titr = m.status === 'Active' && m.protocol ? `<button class="btn btn-sm" data-titrate="${esc(m.id)}">Titrate${m.protocol === 'heparin' ? ' (aPTT)' : ''}</button>` : '';
      return `<tr>${medCell(p, m, 1)}<td class="mg-time">IV</td><td class="mg-span" colspan="${cols.length}">
          ${m.status === 'Active' ? `<button class="btn btn-sm btn-primary" data-infusion="${esc(m.id)}">Document Infusion</button> ${titr}` : ''}
          <span class="muted">${esc(infusionState(doc, m))}</span></td></tr>`;
    }
    // Scheduled / one-time: one row per time of day, one column per day.
    const inView = m.doseTimes.filter(dt => cols.some(c => dt.time >= c && dt.time < c + DAY));
    const times = [...new Set(inView.map(dt => hhmm(dt.time)))].sort();
    if (!times.length) return `<tr>${medCell(p, m, 1)}<td class="mg-time">—</td><td class="mg-span muted" colspan="${cols.length}">No doses scheduled in this view</td></tr>`;
    return times.map((tm, i) => `<tr>${i === 0 ? medCell(p, m, times.length) : ''}<td class="mg-time">${tm.replace(/(\d\d)(\d\d)/, '$1:$2')}</td>
      ${cols.map(c => { const dt = inView.find(d => d.time >= c && d.time < c + DAY && hhmm(d.time) === tm); return dt ? doseCell(p, doc, m, dt) : '<td class="mg-cell mg-none"></td>'; }).join('')}</tr>`).join('');
  }

  // Detail: everything about one medication, with the student's documentation (and Mark in error).
  function medDetail(p, doc, m) {
    const hist = Model.marEntries(doc, m.id).sort((a, b) => b.time - a.time);
    const prior = (m.doseTimes || []).filter(d => d.priorBy || d.priorNotGiven).map(d => `<li>${esc(U.fmtDT(d.time))} — ${d.priorBy ? 'Given' : 'Not given: ' + esc(d.priorNotGiven)} (${esc(d.priorBy || d.priorNGBy || 'prior RN')})</li>`)
      .concat(m.lastGivenPrior ? [`<li>${esc(U.fmtDT(m.lastGivenPrior.time))} — Given (${esc(m.lastGivenPrior.by)})</li>`] : [])
      .concat(m.startedPrior ? [`<li>${esc(U.fmtDT(m.startedPrior.time))} — Infusion started (${esc(m.startedPrior.by)})</li>`] : []);
    UI.modal({
      title: 'Medication Detail — ' + m.name, wide: true,
      body: `<div class="mar-order"><strong>${esc(Model.medLabel(m))}</strong>${m.instructions ? `<div class="med-instr">${esc(m.instructions)}</div>` : ''}
          <div class="muted">Ordered ${esc(U.fmtDT(m.orderTime))} · ${esc(m.orderedBy || p.attending)} · ${esc(m.status)} · Barcode ${esc(m.barcode)}</div></div>
        ${m.protocol && Views.protocol.get(p, m.protocol) ? `<details class="prior"><summary>Protocol</summary>${Views.protocol.html(Views.protocol.get(p, m.protocol))}</details>` : ''}
        <h4>Prior documentation</h4>${prior.length ? `<ul class="plain">${prior.join('')}</ul>` : UI.empty('None.')}
        <h4>Documented this shift</h4>${hist.length ? `<ul class="plain">${hist.map(e => `<li class="${e.status === 'error' ? 'struck' : ''}">
          <strong>${esc(e.data.action)}</strong>${e.data.dose ? ' — ' + esc(e.data.dose) : ''}${e.data.rate ? ' — ' + esc(e.data.rate) : ''}${e.data.reason ? ' — ' + esc(e.data.reason) : ''}${e.data.response ? ' — ' + esc(e.data.response) : ''}${e.data.comment ? ' — ' + esc(e.data.comment) : ''}
          ${e.data.override ? ' ' + UI.badge('Override', 'danger') : ''} ${UI.entryMeta(e)}
          ${e.status === 'active' ? `<button class="btn btn-sm btn-link" data-err="${e.id}">Mark in error</button>` : ''}</li>`).join('')}</ul>` : UI.empty('Nothing documented yet.')}`,
      onOpen(api) {
        api.el.querySelectorAll('[data-err]').forEach(b => b.addEventListener('click', () => { api.close(); UI.errorEntry(p, 'mar', b.dataset.err); }));
      },
      buttons: [{ label: 'Close' }]
    });
  }

  Views.mar = {
    label: 'MAR',
    render(p, doc) {
      const today = dayStart(p.clock.now());
      const cols = [today - DAY, today].concat(days === 3 ? [today + DAY] : []);
      const meds = p.meds.filter(shown);
      const order = { continuous: 2, scheduled: 0, prn: 1 };
      meds.sort((a, b) => (a.status === 'Discontinued') - (b.status === 'Discontinued') || order[typeOf(a)] - order[typeOf(b)] || a.orderTime - b.orderTime);
      const chk = (k, label) => `<label class="mg-inc"><input type="checkbox" data-inc="${k}" ${include[k] ? 'checked' : ''}> ${label}</label>`;
      const colHead = c => c === today ? `TODAY<br>${new Date(c).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}` : new Date(c).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
      return `${Views.worklist.band(p)}
        <div class="wl-bar">
          <div><button class="wl-btn" data-mar="refresh">Refresh</button></div>
          <div><button class="wl-btn" data-mar="view">Change<br>View</button><button class="wl-btn" data-mar="detail" ${selected && meds.some(m => m.id === selected) ? '' : 'disabled'}>Detail</button></div>
          <div class="wl-bar-right"><a class="wl-btn" href="#/patient/${esc(p.id)}/${App.lastChartTab && App.lastChartTab[p.id] || 'summary'}">Close</a></div>
        </div>
        <div class="mg-include">Include: ${chk('active', 'Active')}${chk('stat', 'STAT/ONE')}${chk('iv', 'IVs')}${chk('prn', 'PRNs')}${chk('dc', 'Discontinued')}</div>
        <p class="muted small">Click a time cell to administer (red = overdue, yellow = due now within ${C.medWindowMinutes} minutes, green = given). Click a medication, then <strong>Detail</strong>, to see or correct documentation. Scan the wristband and each medication.</p>
        <div class="scroll-x"><table class="grid mar-grid">
          <thead><tr><th class="mg-start">Start<br>Stop<br>Status</th><th>Medication (Route)</th><th>Time</th>${cols.map(c => `<th class="${c === today ? 'mg-today' : ''}">${colHead(c)}</th>`).join('')}</tr></thead>
          <tbody>${meds.length ? meds.map(m => medRows(p, doc, m, cols)).join('<tr class="mg-sep"><td colspan="' + (3 + cols.length) + '"></td></tr>') : `<tr><td colspan="${3 + cols.length}">${UI.empty('No medications match the Include filters.')}</td></tr>`}</tbody>
        </table></div>`;
    },
    bind(root, p, doc) {
      root.querySelectorAll('[data-inc]').forEach(b => b.addEventListener('change', () => { include[b.dataset.inc] = b.checked; App.render(); }));
      root.querySelectorAll('[data-select]').forEach(c => {
        const pick = () => { selected = selected === c.dataset.select ? null : c.dataset.select; App.render(); };
        c.addEventListener('click', e => { if (!e.target.closest('button')) pick(); });
        c.addEventListener('dblclick', () => medDetail(p, doc, p.meds.find(m => m.id === c.dataset.select)));
        c.addEventListener('keydown', e => { if (e.key === 'Enter') pick(); });
      });
      const act = (k, fn) => { const b = root.querySelector(`[data-mar="${k}"]`); if (b) b.addEventListener('click', fn); };
      act('refresh', () => App.render());
      act('view', () => { days = days === 3 ? 2 : 3; App.render(); });
      act('detail', () => { const m = p.meds.find(x => x.id === selected); if (m) medDetail(p, doc, m); });
      root.querySelectorAll('[data-dose]').forEach(b => b.addEventListener('click', () => {
        const key = b.dataset.dose;
        const med = p.meds.find(m => m.doseTimes.some(d => d.key === key));
        const dt = med.doseTimes.find(d => d.key === key);
        const s = Model.doseStatus(p, doc, med, dt);
        if (s.code === 'given' && s.prior) { UI.toast(`Documented by ${dt.priorBy} at ${U.fmtTime(dt.time)} (prior shift).`, 'info'); return; }
        if (s.code === 'given' || s.code === 'notgiven') { UI.toast('Already documented. Select the medication and click Detail to correct an entry.', 'info'); return; }
        administer(p, doc, med, dt, 'dose');
      }));
      root.querySelectorAll('[data-prn]').forEach(b => b.addEventListener('click', () => administer(p, doc, p.meds.find(m => m.id === b.dataset.prn), null, 'prn')));
      root.querySelectorAll('[data-infusion]').forEach(b => b.addEventListener('click', () => administer(p, doc, p.meds.find(m => m.id === b.dataset.infusion), null, 'infusion')));
      root.querySelectorAll('[data-titrate]').forEach(b => b.addEventListener('click', () => {
        const m = p.meds.find(x => x.id === b.dataset.titrate);
        if (m.protocol === 'heparin') Views.heparin.titrate(p); else Views.protocol.titrateDrip(p, m);
      }));
      root.querySelectorAll('[data-effect]').forEach(b => b.addEventListener('click', () => effectiveness(p, p.meds.find(m => m.id === b.dataset.med), b.dataset.effect)));
      Views.protocol.bind(root, p);
    }
  };
  Views.mar.detail = medDetail;

  /* ---------------- Medications folder tab (Current Visit list) ---------------- */

  const MED_VIEWS = [['inf', 'Current Inf/Titr'], ['current', 'Current Visit'], ['home', 'Home Medications'], ['mar', 'Mar'], ['history', 'Medication History']];
  let medView = 'current';

  function medTable(p, groups) {
    return `<table class="grid meds-list"><colgroup><col><col class="oc-by"><col class="oc-time"><col class="oc-status"><col class="oc-i"></colgroup>
      <thead><tr><th>Generic Name [Trade Name]</th><th>Provider</th><th>Start/Stop</th><th>Status</th><th></th></tr></thead>
      <tbody>${groups.filter(g => g[1].length).map(([name, list]) => `<tr class="ord-band"><th colspan="5">${esc(name)}</th></tr>
        ${list.map(m => `<tr class="${m.status === 'Discontinued' ? 'dc' : ''}"><td><span class="ord-text">${esc(m.name)}</span> <span class="ml-sig">${esc([m.dose, m.route, m.freq].filter(x => x && x !== '—').join(' '))}</span>${m.protocol ? ' ' + Views.protocol.link(p, m.protocol) : ''}${m.isNew ? ' ' + UI.badge('NEW', 'new') : ''}</td>
          <td>${esc(m.orderedBy || p.attending)}</td><td class="nowrap">${esc(U.fmtDT(m.orderTime))}${m.dcTime ? '<br>' + esc(U.fmtDT(m.dcTime)) : ''}</td><td>${esc(m.status)}</td>
          <td><button type="button" class="i-link" data-medinfo="${esc(m.id)}" title="Medication detail" aria-label="Medication detail">i</button></td></tr>`).join('')}`).join('')}</tbody></table>`;
  }

  Views.meds = {
    label: 'Medications',
    render(p, doc) {
      const active = p.meds.filter(m => m.status !== 'Discontinued');
      let body = '';
      if (medView === 'current') {
        body = medTable(p, [['Medications', active.filter(m => m.type === 'scheduled' || m.type === 'once')], ['PRN Medications', active.filter(m => m.type === 'prn')],
          ['IV / Continuous Infusions', active.filter(m => m.type === 'continuous')], ['Discontinued', p.meds.filter(m => m.status === 'Discontinued')]]);
      } else if (medView === 'inf') {
        const inf = p.meds.filter(m => m.type === 'continuous');
        body = inf.length ? `<table class="grid"><thead><tr><th>Infusion</th><th>Ordered rate / dose</th><th>Current status</th><th>Status</th></tr></thead><tbody>
          ${inf.map(m => `<tr class="${m.status === 'Discontinued' ? 'dc' : ''}"><td><strong>${esc(m.name)}</strong>${m.protocol ? ' ' + Views.protocol.link(p, m.protocol) : ''}${m.highAlert ? ' ' + UI.badge('HIGH ALERT', 'danger') : ''}</td>
            <td>${esc(m.rate || m.dose)}</td><td>${esc(infusionState(doc, m))}</td><td>${esc(m.status)}</td></tr>`).join('')}</tbody></table>
          <p class="muted small">Infusions are documented and titrated on the <a href="#/patient/${esc(p.id)}/mar">MAR</a>.</p>` : UI.empty('No infusions ordered.');
      } else if (medView === 'home') {
        body = (p.homeMeds || []).length ? `<table class="grid"><thead><tr><th>Medication</th><th>Dose</th><th>Route</th><th>Frequency</th></tr></thead><tbody>
          ${p.homeMeds.map(m => `<tr><td>${esc(m.name)}</td><td>${esc(m.dose)}</td><td>${esc(m.route)}</td><td>${esc(m.freq)}</td></tr>`).join('')}</tbody></table>` : UI.empty('No home medications recorded.');
      } else {
        const rows = [];
        p.meds.forEach(m => {
          (m.doseTimes || []).forEach(d => { if (d.priorBy) rows.push([d.time, m.name, 'Given', m.dose, d.priorBy]); else if (d.priorNotGiven) rows.push([d.time, m.name, 'Not given — ' + d.priorNotGiven, m.dose, d.priorNGBy || '']); });
          if (m.lastGivenPrior) rows.push([m.lastGivenPrior.time, m.name, 'Given', m.dose, m.lastGivenPrior.by]);
          if (m.startedPrior) rows.push([m.startedPrior.time, m.name, 'Infusion started', m.rate || m.dose, m.startedPrior.by]);
        });
        doc.mar.forEach(e => rows.push([e.time, e.data.medName, e.data.action + (e.status === 'error' ? ' (entered in error)' : ''), e.data.dose || e.data.rate || '', Model.signature(e)]));
        rows.sort((a, b) => b[0] - a[0]);
        body = rows.length ? `<table class="grid"><thead><tr><th>Date/time</th><th>Medication</th><th>Action</th><th>Dose / rate</th><th>By</th></tr></thead><tbody>
          ${rows.map(r => `<tr><td class="nowrap">${esc(U.fmtDT(r[0]))}</td><td>${esc(r[1])}</td><td>${esc(r[2])}</td><td>${esc(r[3])}</td><td>${esc(r[4])}</td></tr>`).join('')}</tbody></table>` : UI.empty('No administrations on record.');
      }
      const label = (MED_VIEWS.find(v => v[0] === medView) || [])[1];
      return `<div class="ml-bar"><span class="muted">${esc(label)}${medView === 'current' ? ' by Category' : ''}</span>
          <div class="ml-menu-wrap"><button class="btn btn-sm ml-menu-btn" aria-haspopup="true" aria-expanded="false">${esc(label)} ▾</button>
            <div class="tb-menu ml-menu" hidden role="menu"><div class="ml-menu-h">Administrations</div>
              ${MED_VIEWS.map(([k, l]) => `<a role="menuitem" href="${k === 'mar' ? `#/patient/${esc(p.id)}/mar` : '#'}" data-medview="${k}" class="${k === medView ? 'ml-on' : ''}">${esc(l)}</a>`).join('')}</div></div></div>
        ${body}`;
    },
    bind(root, p, doc) {
      const btn = root.querySelector('.ml-menu-btn'), menu = root.querySelector('.ml-menu');
      const close = () => { menu.hidden = true; btn.setAttribute('aria-expanded', 'false'); };
      btn.addEventListener('click', e => { e.stopPropagation(); menu.hidden = !menu.hidden; btn.setAttribute('aria-expanded', String(!menu.hidden)); if (!menu.hidden) setTimeout(() => document.addEventListener('click', close, { once: true }), 0); });
      root.querySelectorAll('[data-medview]').forEach(a => a.addEventListener('click', e => {
        if (a.dataset.medview === 'mar') return;
        e.preventDefault(); medView = a.dataset.medview; App.render();
      }));
      root.querySelectorAll('[data-medinfo]').forEach(b => b.addEventListener('click', () => {
        const o = Model.medOrders(p).find(x => x.id === b.dataset.medinfo);
        if (o) Views.orders.detail(p, doc, o);
      }));
      Views.protocol.bind(root, p);
    }
  };

  /* ---------------- Administration dialog ---------------- */

  function evalHold(med, values) {
    return (med.holdIf || []).filter(h => {
      const key = (PRE[h.p] || [h.p.toLowerCase()])[0];
      const v = U.num(values['pre_' + key]);
      if (v == null) return false;
      return h.op === '<' ? v < h.v : h.op === '>' ? v > h.v : h.op === '<=' ? v <= h.v : h.op === '>=' ? v >= h.v : false;
    });
  }

  function administer(p, doc, med, dt, mode) {
    const conflicts = Model.allergyConflicts(p, med);
    const now = p.clock.now();
    const warnings = [];
    if (med.status !== 'Active') warnings.push(`This order is <strong>${esc(med.status)}</strong>${med.holdReason ? ': ' + esc(med.holdReason) : ''}. Do not administer without a current, active order.`);
    if (mode === 'dose' && dt) {
      const diff = Math.round((now - dt.time) / 60000);
      if (Math.abs(diff) > C.medWindowMinutes) warnings.push(`Dose is <strong>${Math.abs(diff)} minutes ${diff < 0 ? 'early' : 'late'}</strong> (scheduled ${U.fmtTime(dt.time)}). Document the reason.`);
      if (dt.notToday) warnings.push('This medication is not due today.');
    }
    if (mode === 'prn' && med.minIntervalHr) {
      const last = Model.lastGiven(doc, med);
      if (last && now - last.time < med.minIntervalHr * 3600000) {
        warnings.push(`<strong>Too soon:</strong> last given ${U.fmtDT(last.time)} (${esc(last.by)}). Minimum interval is ${med.minIntervalHr} hours.`);
      }
    }

    const pre = (med.preAssess || []).map(k => {
      if (k.startsWith('lab:')) {
        const name = k.slice(4);
        const l = Model.latestLab(p, name);
        return `<div class="pre-lab"><span>${esc(name)} (latest)</span><strong>${l ? esc(l.value + ' ' + (l.unit || '')) + ' ' + UI.flag(l.flag) + ` <small>${U.fmtDT(l.time)}</small>` : 'No result on file'}</strong></div>`;
      }
      const [key, label] = PRE[k] || [k.toLowerCase(), k];
      const last = Model.latestVital(p, doc, key);
      return `<label class="field"><span>${esc(label)}</span><input type="number" step="any" name="pre_${key}" required>
        <small class="muted">${last ? 'Last charted: ' + esc(last.value) + ' at ' + U.fmtTime(last.time) : 'No prior value'}</small></label>`;
    }).join('');

    const scan = `<fieldset class="scan">
        <legend>Barcode verification</legend>
        <div class="form-grid">
          <label class="field"><span>1. Scan patient wristband</span><input name="scanPt" autocomplete="off" autofocus placeholder="Scan or type MRN"><small class="scan-msg" data-msg="pt"></small></label>
          <label class="field"><span>2. Scan medication barcode</span><input name="scanMed" autocomplete="off" placeholder="Scan medication label"><small class="scan-msg" data-msg="med"></small></label>
        </div>
        <label class="check"><input type="checkbox" name="noScan" data-single="1"> Unable to scan</label>
        <label class="field scan-reason" hidden><span>Reason unable to scan</span><select name="noScanReason">${UI.options(['Wristband unreadable', 'Medication barcode damaged/missing', 'Scanner unavailable', 'Emergency situation', 'Other'])}</select></label>
      </fieldset>`;

    const allergyBox = conflicts.length ? `<div class="hard-stop">
        <strong>⚠ ALLERGY ALERT</strong> — Patient is allergic to ${conflicts.map(a => `<strong>${esc(a.agent)}</strong> (${esc(a.reaction)})`).join(', ')}.
        This medication is in a related drug class.
        <label class="check"><input type="checkbox" name="allergyOverride" data-single="1"> Override — I verified with the provider/pharmacist that this medication may be given.</label>
        <label class="field"><span>Override reason</span><input name="allergyReason"></label>
      </div>` : '';

    let body = '';
    if (mode === 'infusion') {
      body = `<div class="form-grid">
          <label class="field"><span>Action</span><select name="action">${UI.options(INFUSION_ACTIONS, null, false)}</select></label>
          <label class="field"><span>Rate / dose</span><input name="rate" value="${esc(med.rate || med.dose || '')}"></label>
          <label class="field"><span>Site</span><select name="site">${UI.options(SITES, '', false)}</select></label>
          ${UI.timeField(p, 'Date/time')}
        </div>
        <label class="check"><input type="checkbox" name="doubleCheck" data-single="1"> Independent double check completed${med.highAlert ? ' (required for high-alert infusions)' : ''}</label>
        <label class="field"><span>Second RN / verifier</span><input name="verifier"></label>`;
    } else {
      body = `<div class="form-grid">
          ${mode === 'dose' ? `<label class="field"><span>Administration</span><select name="action"><option>Given</option><option>Not Given</option></select></label>` : '<input type="hidden" name="action" value="Given">'}
          <label class="field"><span>Dose given</span><input name="dose" value="${esc(med.dose)}"></label>
          <label class="field"><span>Route</span><input name="route" value="${esc(med.route)}"></label>
          <label class="field"><span>Site</span><select name="site">${UI.options(SITES, '', false)}</select></label>
          ${UI.timeField(p, 'Date/time administered')}
          ${mode === 'prn' ? `<label class="field"><span>PRN reason</span><input name="prnReason" value="${esc(med.indication || '')}"></label>` : ''}
        </div>
        <label class="field not-given" hidden><span>Reason not given</span><select name="reason">${UI.options(NOT_GIVEN)}</select></label>
        ${med.highAlert ? `<label class="check"><input type="checkbox" name="doubleCheck" data-single="1"> Independent double check completed (high-alert medication)</label>
          <label class="field"><span>Second RN / verifier</span><input name="verifier"></label>` : ''}`;
    }

    UI.modal({
      title: (mode === 'infusion' ? 'Document Infusion — ' : 'Administer — ') + med.name,
      wide: true,
      body: `<div class="mar-dialog">
          <div class="mar-order"><strong>${esc(Model.medLabel(med))}</strong>
            ${dt ? `<div>Scheduled: ${U.fmtDT(dt.time)}</div>` : ''}
            ${med.instructions ? `<div class="med-instr">${esc(med.instructions)}</div>` : ''}</div>
          ${warnings.map(w => `<div class="warn-box">${w}</div>`).join('')}
          ${allergyBox}
          ${scan}
          ${pre ? `<fieldset><legend>Pre-administration assessment</legend><div class="form-grid">${pre}</div><div class="hold-live"></div></fieldset>` : ''}
          <fieldset><legend>Documentation</legend>${body}
            <label class="field"><span>Comment</span><textarea name="comment" rows="2"></textarea></label>
          </fieldset>
        </div>`,
      onOpen(api) {
        const el = api.el;
        const q = s => el.querySelector(s);
        const setMsg = (which, ok, text) => { const m = q(`[data-msg="${which}"]`); m.textContent = text; m.className = 'scan-msg ' + (ok ? 'ok' : 'bad'); };
        const checkPt = () => {
          const v = q('[name="scanPt"]').value.trim().toUpperCase();
          if (!v) { setMsg('pt', false, ''); return; }
          if (v === String(p.mrn).toUpperCase()) { setMsg('pt', true, `✔ Patient verified: ${p.name.last}, ${p.name.first}`); return; }
          const other = Model.allPatients().find(x => String(x.mrn).toUpperCase() === v && Screens.canSee(x));
          setMsg('pt', false, other ? `✖ WRONG PATIENT — this wristband belongs to ${other.name.last}, ${other.name.first}` : '✖ Wristband does not match this patient');
        };
        const checkMed = () => {
          const v = q('[name="scanMed"]').value.trim().toUpperCase();
          if (!v) { setMsg('med', false, ''); return; }
          if (v === med.barcode.toUpperCase()) { setMsg('med', true, `✔ Medication verified: ${med.name}`); return; }
          const other = p.meds.find(m => m.barcode.toUpperCase() === v);
          setMsg('med', false, other ? `✖ WRONG MEDICATION — scanned ${other.name} ${other.dose}` : '✖ Barcode does not match this order');
        };
        ['input', 'change'].forEach(ev => { q('[name="scanPt"]').addEventListener(ev, checkPt); q('[name="scanMed"]').addEventListener(ev, checkMed); });
        q('[name="scanPt"]').addEventListener('keydown', e => { if (e.key === 'Enter') { e.preventDefault(); q('[name="scanMed"]').focus(); } });
        q('[name="scanMed"]').addEventListener('keydown', e => { if (e.key === 'Enter') e.preventDefault(); });
        q('[name="noScan"]').addEventListener('change', e => { q('.scan-reason').hidden = !e.target.checked; });
        const act = q('select[name="action"]');
        if (act && mode === 'dose') act.addEventListener('change', () => { q('.not-given').hidden = act.value !== 'Not Given'; });
        const live = q('.hold-live');
        if (live) el.addEventListener('input', () => {
          const hits = evalHold(med, U.formValues(el));
          live.innerHTML = hits.length ? `<div class="warn-box"><strong>Hold parameter met:</strong> ${hits.map(h => `${esc(h.p)} ${esc(h.op)} ${esc(h.v)}`).join(', ')}. Consider holding the dose and notifying the provider.</div>` : '';
        });
      },
      buttons: [
        { label: 'Cancel' },
        { label: 'Sign & Save', cls: 'btn-primary', onClick: api => save(api, p, med, dt, mode, conflicts) }
      ]
    });
  }

  function save(api, p, med, dt, mode, conflicts) {
    const el = api.el;
    const body = el.querySelector('.modal-body');
    const v = U.formValues(el);
    const ptOK = v.scanPt && v.scanPt.toUpperCase() === String(p.mrn).toUpperCase();
    const medOK = v.scanMed && v.scanMed.toUpperCase() === med.barcode.toUpperCase();
    const given = mode === 'infusion' || v.action === 'Given';

    if (v.scanPt && !ptOK) return fail('The wristband scanned does not match this patient. Stop and verify patient identity.');
    if (v.scanMed && !medOK) return fail('The medication scanned does not match this order. Do not administer.');
    if (C.requireBarcodeScan && given && !(ptOK && medOK) && !v.noScan) return fail('Scan the patient wristband and the medication, or check "Unable to scan" and give a reason.');
    if (v.noScan && !v.noScanReason) return fail('Select a reason you were unable to scan.');
    if (given && conflicts.length && !v.allergyOverride) return fail('Allergy alert: review the alert. Either choose "Not Given" or document an override.');
    if (given && conflicts.length && !v.allergyReason) return fail('Enter the allergy override reason.');
    if (mode === 'dose' && v.action === 'Not Given' && !v.reason) return fail('Select the reason the dose was not given.');
    if (given && med.highAlert && !v.doubleCheck) return fail('High-alert medication: document the independent double check.');
    const missingPre = (med.preAssess || []).filter(k => !k.startsWith('lab:')).some(k => U.isEmpty(v['pre_' + (PRE[k] || [k.toLowerCase()])[0]]));
    if (given && missingPre) return fail('Complete the pre-administration assessment before giving this medication.');

    const preAssess = {};
    Object.keys(v).filter(k => k.startsWith('pre_')).forEach(k => { preAssess[k.slice(4)] = v[k]; });
    const holds = evalHold(med, v).map(h => `${h.p} ${h.op} ${h.v}`);

    const data = {
      medId: med.id, medName: med.name, doseKey: dt ? dt.key : null, prn: mode === 'prn', infusion: mode === 'infusion',
      action: mode === 'infusion' ? v.action : v.action,
      dose: v.dose, route: v.route, site: v.site, rate: v.rate, prnReason: v.prnReason, reason: v.action === 'Not Given' ? v.reason : '',
      scan: { patient: ptOK ? 'verified' : 'not scanned', med: medOK ? 'verified' : 'not scanned', unableReason: v.noScan ? v.noScanReason : '' },
      override: (v.noScan || (conflicts.length && v.allergyOverride)) ? true : false,
      allergyOverride: conflicts.length && v.allergyOverride ? v.allergyReason : '',
      doubleCheck: v.doubleCheck ? (v.verifier || 'Yes') : '',
      preAssess, holdParamsMet: holds, comment: v.comment
    };
    Store.add(p.id, 'mar', data, UI.readTime(p, el), p.clock.now());
    UI.toast(mode === 'infusion' ? 'Infusion documented.' : given ? `${med.name} documented as given.` : `${med.name} documented as not given.`);
    App.render();
    return true;

    function fail(msg) { UI.formError(body, msg); return false; }
  }

  function effectiveness(p, med, refId) {
    UI.modal({
      title: 'PRN Effectiveness — ' + med.name,
      body: `<div class="form-grid">
          ${UI.timeField(p, 'Date/time reassessed')}
          <label class="field"><span>Response</span><select name="response">${UI.options(['Effective', 'Partially effective', 'Not effective'], null, false)}</select></label>
          <label class="field"><span>Pain score after (if applicable)</span><input type="number" name="painAfter" min="0" max="10"></label>
        </div>
        <label class="field"><span>Comment</span><textarea name="comment" rows="2"></textarea></label>`,
      buttons: [{ label: 'Cancel' }, { label: 'Save', cls: 'btn-primary', onClick: api => {
        const v = U.formValues(api.el);
        Store.add(p.id, 'mar', { medId: med.id, medName: med.name, action: 'Effectiveness', refId, response: v.response, painAfter: v.painAfter, comment: v.comment }, UI.readTime(p, api.el), p.clock.now());
        UI.toast('Reassessment documented.');
        App.render();
      } }]
    });
  }
})();
