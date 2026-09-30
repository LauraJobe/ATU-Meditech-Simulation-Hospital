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

  let filter = 'all';

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

  function medCard(p, doc, m) {
    const conflicts = Model.allergyConflicts(p, m);
    const t = typeOf(m);
    let action = '';
    if (t === 'scheduled') {
      action = (m.doseTimes.length ? `<div class="dose-row">${m.doseTimes.map(dt => {
        const s = Model.doseStatus(p, doc, m, dt);
        const who = s.entry ? U.initials(s.entry.user.name) : (dt.priorBy || dt.priorNGBy || '');
        const when = s.entry ? U.fmtTime(s.entry.time) : '';
        return `<button class="dose dose-${s.code}" data-dose="${esc(dt.key)}" title="${esc(STATUS_TEXT[s.code])}">
            <span class="dose-time">${U.fmtDate(dt.time) !== U.fmtDate(p.clock.now()) ? U.fmtDate(dt.time).slice(0, 5) + ' ' : ''}${U.fmtTime(dt.time)}</span>
            <span class="dose-status">${esc(STATUS_TEXT[s.code])}${when ? ' ' + when : ''}${who ? ' · ' + esc(who) : ''}</span>
          </button>`;
      }).join('')}</div>` : '<p class="muted">No scheduled times.</p>');
    } else if (t === 'prn') {
      const last = Model.lastGiven(doc, m);
      const pendingEffect = doc.mar.filter(e => e.status === 'active' && e.data.medId === m.id && e.data.action === 'Given' && e.data.prn &&
        !doc.mar.some(x => x.status === 'active' && x.data.action === 'Effectiveness' && x.data.refId === e.id));
      action = `<div class="prn-row">
          <button class="btn btn-primary btn-sm" data-prn="${esc(m.id)}">Give PRN Dose</button>
          <span class="muted">Last given: ${last ? esc(U.fmtDT(last.time) + ' (' + last.by + ')') : 'none on record'}</span>
        </div>
        ${pendingEffect.map(e => `<div class="reassess">Reassessment due for dose given ${U.fmtTime(e.time)} <button class="btn btn-sm" data-effect="${e.id}" data-med="${esc(m.id)}">Document Effectiveness</button></div>`).join('')}`;
    } else {
      action = `<div class="prn-row">
          <button class="btn btn-primary btn-sm" data-infusion="${esc(m.id)}">Document Infusion</button>
          ${/heparin/i.test(m.name) && p.heparinProtocol && m.status === 'Active' ? `<button class="btn btn-sm" data-titrate="${esc(m.id)}">Titrate (aPTT)</button>` : ''}
          <span class="muted">${esc(infusionState(doc, m))}</span>
        </div>`;
    }

    const hist = Model.marEntries(doc, m.id).sort((a, b) => b.time - a.time);
    const history = hist.length ? `<details class="med-history"><summary>My documentation (${hist.length})</summary><ul class="plain">
        ${hist.map(e => `<li class="${e.status === 'error' ? 'struck' : ''}">
          <strong>${esc(e.data.action)}</strong>${e.data.dose ? ' — ' + esc(e.data.dose) : ''}${e.data.rate ? ' — ' + esc(e.data.rate) : ''}${e.data.reason ? ' — ' + esc(e.data.reason) : ''}${e.data.response ? ' — ' + esc(e.data.response) : ''}
          ${e.data.override ? ' ' + UI.badge('Override', 'danger') : ''}
          ${UI.entryMeta(e)}
          ${e.status === 'active' ? `<button class="btn btn-sm btn-link" data-err="${e.id}">Mark in error</button>` : ''}
        </li>`).join('')}</ul></details>` : '';

    return `<article class="med-card ${m.status !== 'Active' ? 'med-inactive' : ''} ${conflicts.length ? 'med-allergy' : ''}">
      <div class="med-main">
        <div class="med-title">
          ${m.isNew ? UI.badge('NEW', 'new') : ''}
          ${m.highAlert ? UI.badge('HIGH ALERT', 'danger') : ''}
          ${conflicts.length ? UI.badge('ALLERGY: ' + conflicts.map(a => a.agent).join(', '), 'danger') : ''}
          ${statusBadge(m)}
          <h3>${esc(m.name)}</h3>
        </div>
        <div class="med-sig">${esc([m.dose, m.route, m.freq].filter(x => x && x !== '—').join(' · '))}${m.rate && t === 'continuous' ? ' · Rate ' + esc(m.rate) : ''}</div>
        ${m.indication ? `<div class="muted">Indication: ${esc(m.indication)}</div>` : ''}
        ${m.instructions ? `<div class="med-instr">${esc(m.instructions)}</div>` : ''}
        ${m.holdReason ? `<div class="med-hold">${esc(m.holdReason)}</div>` : ''}
        ${m.holdIf ? `<div class="med-hold">Hold if ${m.holdIf.map(h => `${esc(h.p)} ${esc(h.op)} ${esc(h.v)}`).join(' or ')}</div>` : ''}
      </div>
      <div class="med-actions">${action}${history}</div>
    </article>`;
  }

  Views.mar = {
    setFilter(f) { filter = f; },
    label: 'Medications',
    render(p, doc) {
      const groups = [
        ['all', 'All'], ['scheduled', 'Scheduled'], ['prn', 'PRN'], ['continuous', 'Continuous / IV'], ['inactive', 'Held / DC\'d']
      ];
      const meds = p.meds.filter(m => {
        if (filter === 'all') return true;
        if (filter === 'inactive') return m.status !== 'Active';
        return typeOf(m) === filter && m.status === 'Active';
      });
      const order = { continuous: 0, scheduled: 1, prn: 2 };
      meds.sort((a, b) => (a.status !== 'Active') - (b.status !== 'Active') || order[typeOf(a)] - order[typeOf(b)]);
      return `
        <div class="view-actions">
          <div class="chips">${groups.map(([k, l]) => `<button class="chip ${filter === k ? 'chip-on' : ''}" data-filter="${k}">${l}</button>`).join('')}</div>
          <div class="legend">
            <span class="dose dose-due">Due</span><span class="dose dose-overdue">Overdue</span><span class="dose dose-given">Given</span>
            <span class="dose dose-notgiven">Not given</span><span class="dose dose-future">Scheduled</span>
          </div>
        </div>
        <p class="muted">Due window: ${C.medWindowMinutes} minutes before or after the scheduled time. Scan the patient wristband and each medication before charting.</p>
        ${meds.length ? meds.map(m => medCard(p, doc, m)).join('') : UI.empty('No medications in this view.')}`;
    },
    bind(root, p, doc) {
      root.querySelectorAll('[data-filter]').forEach(b => b.addEventListener('click', () => { filter = b.dataset.filter; App.render(); }));
      root.querySelectorAll('[data-dose]').forEach(b => b.addEventListener('click', () => {
        const key = b.dataset.dose;
        const med = p.meds.find(m => m.doseTimes.some(d => d.key === key));
        const dt = med.doseTimes.find(d => d.key === key);
        const s = Model.doseStatus(p, doc, med, dt);
        if (s.code === 'given' && s.prior) { UI.toast(`Documented by ${dt.priorBy} at ${U.fmtTime(dt.time)} (prior shift).`, 'info'); return; }
        if (s.code === 'given') { UI.toast('Already documented. Use "My documentation" to correct an entry.', 'info'); return; }
        administer(p, doc, med, dt, 'dose');
      }));
      root.querySelectorAll('[data-prn]').forEach(b => b.addEventListener('click', () => administer(p, doc, p.meds.find(m => m.id === b.dataset.prn), null, 'prn')));
      root.querySelectorAll('[data-infusion]').forEach(b => b.addEventListener('click', () => administer(p, doc, p.meds.find(m => m.id === b.dataset.infusion), null, 'infusion')));
      root.querySelectorAll('[data-titrate]').forEach(b => b.addEventListener('click', () => Views.heparin.titrate(p)));
      root.querySelectorAll('[data-effect]').forEach(b => b.addEventListener('click', () => effectiveness(p, p.meds.find(m => m.id === b.dataset.med), b.dataset.effect)));
      root.querySelectorAll('[data-err]').forEach(b => b.addEventListener('click', () => UI.errorEntry(p, 'mar', b.dataset.err)));
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
