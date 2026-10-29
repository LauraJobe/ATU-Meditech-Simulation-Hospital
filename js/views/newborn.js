/*
 * Newborn documentation for the Sung scenario (Nurse/Allied Health → Newborn), on BOTH Amelia Sung's and
 * Baby Boy Sung's charts. Everything saves to Baby Boy Sung's record (p.newborn.chart), so both charts
 * show the same documentation; Amelia's own maternal assessments stay on her Assessments tab.
 * The forms open only after faculty release "Delivery completed" (p.newborn.deliveryEvent on Amelia).
 *
 *   Newborn Head-to-Toe Assessment — structure follows Stanford Medicine Newborn Nursery, "The Newborn
 *     Exam" (med.stanford.edu/newborns). Nothing is pre-marked normal: every choice starts blank.
 *   Newborn Transitional Record — hospital-record layout: maternal history, delivery, infant,
 *     measurements, feeding, abnormal findings, medication references (from the MAR), and a vital-signs
 *     table with one saved row per entry.
 * Saved entries are ordinary assessment entries (author, date/time, entered-in-error), so they appear in
 * Assessment History and sync like other charting.
 */
(function () {
  'use strict';
  const esc = U.esc;
  window.Views = window.Views || {};

  /* ---------- form definitions ---------- */
  const S = (id, label, options) => ({ id, label, type: 'select', options });
  const C = (id, label, options) => ({ id, label, type: 'checks', options });
  const T = (id, label) => ({ id, label, type: 'text' });
  const A = (id, label) => ({ id, label, type: 'textarea' });
  const N = (id, label) => ({ id, label, type: 'number' });
  const ARM = ['Moves spontaneously, full range', 'Decreased movement', 'No spontaneous movement', 'Not assessed'];
  const CLAV = ['Intact — no crepitus or swelling', 'Crepitus', 'Swelling / deformity', 'Tenderness (cries with palpation)', 'Not assessed'];

  const H2T = {
    title: 'Newborn Head-to-Toe Assessment',
    newborn: true,
    intro: 'Structure follows Stanford Medicine Newborn Nursery, "The Newborn Exam." Document what you assess; nothing is pre-marked normal.',
    sections: [
      { id: 'gen', title: 'General Appearance', fields: [
        S('appear', 'General appearance', ['Well-appearing', 'Ill-appearing', 'Dysmorphic features noted']),
        S('alert', 'Alertness / state', ['Quiet alert', 'Active alert', 'Drowsy', 'Lethargic', 'Difficult to arouse']),
        S('activity', 'Activity', ['Active, spontaneous movement', 'Decreased activity', 'Jittery / tremulous', 'Irritable']),
        S('cry', 'Cry', ['Strong, vigorous', 'Weak', 'High-pitched', 'Absent']),
        S('tone', 'Tone', ['Flexed, normal tone', 'Hypotonic / floppy', 'Hypertonic', 'Asymmetric tone']),
        T('genNote', 'Comments')] },
      { id: 'head', title: 'Head, Molding, Sutures, and Fontanelles', fields: [
        S('shape', 'Head shape / molding', ['No molding', 'Mild molding', 'Moderate molding', 'Severe molding']),
        C('scalp', 'Scalp findings', ['Caput succedaneum', 'Cephalohematoma', 'Vacuum (chignon) mark', 'Abrasion / laceration', 'Bruising', 'None']),
        S('sutures', 'Sutures', ['Approximated', 'Overriding', 'Widely separated']),
        S('af', 'Anterior fontanelle', ['Soft and flat', 'Bulging', 'Sunken', 'Full']),
        S('pf', 'Posterior fontanelle', ['Open, soft', 'Closed', 'Bulging']),
        N('hc', 'Head circumference (cm)'), T('headNote', 'Comments')] },
      { id: 'face', title: 'Eyes, Ears, Nose, Mouth, and Palate', fields: [
        S('eyes', 'Eyes', ['Symmetric, clear', 'Edematous lids', 'Discharge', 'Subconjunctival hemorrhage']),
        S('redReflex', 'Red reflex', ['Present bilaterally', 'Absent / abnormal right', 'Absent / abnormal left', 'Not assessed']),
        S('ears', 'Ears', ['Well-formed, normally set', 'Low-set / posteriorly rotated', 'Preauricular pit or tag']),
        S('nose', 'Nose', ['Patent bilaterally', 'Nasal flaring', 'Discharge / congestion']),
        S('mouth', 'Mouth', ['Moist, pink', 'Epstein pearls', 'Natal tooth', 'Excessive secretions']),
        S('palate', 'Palate', ['Hard and soft palate intact', 'Cleft palate', 'Cleft lip', 'Not assessed']),
        S('suck', 'Suck', ['Strong', 'Weak', 'Absent']), T('faceNote', 'Comments')] },
      { id: 'neck', title: 'Neck and Clavicles', fields: [
        S('neck', 'Neck', ['Supple, full range of motion', 'Webbing', 'Mass', 'Torticollis']),
        S('clavR', 'Right clavicle', CLAV), S('clavL', 'Left clavicle', CLAV), T('neckNote', 'Comments')] },
      { id: 'resp', title: 'Respiratory Effort and Breath Sounds', fields: [
        S('effort', 'Respiratory effort', ['Unlabored', 'Tachypnea', 'Retractions', 'Grunting', 'Nasal flaring', 'Apnea / gasping']),
        S('bsR', 'Breath sounds — right', ['Clear', 'Crackles', 'Diminished', 'Wheezes']),
        S('bsL', 'Breath sounds — left', ['Clear', 'Crackles', 'Diminished', 'Wheezes']),
        S('chest', 'Chest', ['Symmetric expansion', 'Asymmetric expansion']), T('respNote', 'Comments')] },
      { id: 'cv', title: 'Heart Sounds, Pulses, Perfusion, and Skin Color', fields: [
        S('heart', 'Heart sounds', ['Regular rate and rhythm, no murmur', 'Murmur', 'Irregular rhythm', 'Muffled / displaced']),
        S('femoral', 'Femoral pulses', ['Equal and strong bilaterally', 'Weak / diminished', 'Unequal', 'Absent']),
        S('brachial', 'Brachial pulses', ['Equal and strong bilaterally', 'Weak / diminished', 'Unequal']),
        S('crt', 'Capillary refill', ['Less than 3 seconds', '3 seconds or more']),
        S('color', 'Skin color', ['Pink', 'Acrocyanosis (hands/feet)', 'Central cyanosis', 'Pale', 'Plethoric', 'Jaundiced']),
        T('cvNote', 'Comments')] },
      { id: 'abd', title: 'Abdomen and Umbilical Cord', fields: [
        S('abd', 'Abdomen', ['Soft, round, nondistended', 'Distended', 'Scaphoid', 'Mass palpated']),
        S('bowel', 'Bowel sounds', ['Present', 'Hypoactive', 'Absent']),
        S('cord', 'Umbilical cord', ['3 vessels, clamp secure', '2 vessels', 'Bleeding / oozing', 'Drainage / redness']),
        T('abdNote', 'Comments')] },
      { id: 'gu', title: 'Genitalia, Urinary Output, and Stool', fields: [
        S('genit', 'Genitalia', ['Male: testes descended bilaterally', 'Male: undescended testis', 'Hypospadias / epispadias', 'Hydrocele', 'Female: normal', 'Ambiguous']),
        S('anus', 'Anus', ['Patent', 'Not patent / not visualized']),
        S('void', 'Urinary output', ['Voided', 'Not yet voided']), T('voidTime', 'Void time / amount'),
        S('stool', 'Stool', ['Meconium passed', 'No stool yet']), T('stoolTime', 'Stool time / description')] },
      { id: 'skin', title: 'Skin Findings', fields: [
        C('skin', 'Findings', ['Vernix', 'Lanugo', 'Milia', 'Erythema toxicum', 'Congenital dermal melanocytosis', 'Peeling / cracking', 'Bruising', 'Petechiae', 'Jaundice', 'Birthmark', 'None noted']),
        T('skinLoc', 'Location / description')] },
      { id: 'msk', title: 'Spine, Extremities, and Movement Symmetry', fields: [
        S('spine', 'Spine', ['Straight and intact', 'Sacral dimple', 'Hair tuft / mass', 'Opening / defect']),
        S('hips', 'Hips (Ortolani / Barlow)', ['Stable, negative', 'Clunk / positive', 'Not assessed']),
        S('armR', 'Right arm movement', ARM), S('armL', 'Left arm movement', ARM),
        S('legs', 'Leg movement', ['Symmetric, full range', 'Decreased right', 'Decreased left']),
        S('symm', 'Movement symmetry', ['Symmetric', 'Asymmetric — upper extremities', 'Asymmetric — lower extremities']),
        S('digits', 'Digits', ['10 fingers, 10 toes', 'Polydactyly', 'Syndactyly']), T('mskNote', 'Comments')] },
      { id: 'reflex', title: 'Newborn Reflexes', fields: [
        S('moro', 'Moro', ['Present, symmetric', 'Asymmetric — decreased right', 'Asymmetric — decreased left', 'Absent']),
        S('root', 'Rooting', ['Present', 'Weak', 'Absent']),
        S('suckRef', 'Sucking', ['Present', 'Weak', 'Absent']),
        S('graspR', 'Palmar grasp — right', ['Present', 'Weak', 'Absent']),
        S('graspL', 'Palmar grasp — left', ['Present', 'Weak', 'Absent']),
        S('plantar', 'Plantar grasp', ['Present', 'Absent']),
        S('babinski', 'Babinski', ['Present (fanning)', 'Absent']),
        S('step', 'Stepping', ['Present', 'Absent', 'Not assessed'])] },
      { id: 'feed', title: 'Feeding Assessment and Tolerance', fields: [
        S('method', 'Feeding method', ['Breastfeeding', 'Bottle — formula', 'Bottle — expressed breast milk', 'Not yet fed']),
        S('latch', 'Latch / suck', ['Good latch, sustained suck', 'Fair', 'Poor latch', 'Not observed']),
        S('coord', 'Suck–swallow–breathe coordination', ['Coordinated', 'Uncoordinated']),
        S('tol', 'Tolerance', ['Tolerating well', 'Spitting up', 'Vomiting', 'Not yet fed']),
        N('feedMin', 'Duration (minutes) or volume (mL)'), T('glucose', 'Blood glucose (mg/dL) and time')] },
      { id: 'abn', title: 'Abnormal Findings, Interventions, and Provider Notification', fields: [
        A('abnFind', 'Abnormal findings'), A('abnInt', 'Interventions'),
        S('notified', 'Provider notified', ['Yes', 'No']), T('notifyWho', 'Provider name / time'), T('notifyResp', 'Provider response / orders')] }
    ]
  };

  // Transitional Record fields; "confirmed" values come from p.newborn.confirmed (shown, not editable).
  const TR = [
    { id: 'maternal', title: 'Maternal History', fields: [['mName', "Mother's name"], ['mAge', 'Age'], ['mGP', 'Gravida / para'], ['mEga', 'Gestational age'], ['mBlood', 'Blood type / Rh'],
      ['mGbs', 'GBS'], ['mAbx', 'Antibiotics in labor'], ['mCond', 'Maternal conditions'], ['mAllergy', 'Maternal allergies'], ['mAnes', 'Anesthesia / analgesia'],
      ['mRubella', 'Rubella'], ['mHbsag', 'HBsAg'], ['mHiv', 'HIV'], ['mRpr', 'RPR / syphilis']] },
    { id: 'delivery', title: 'Delivery Information', fields: [['dDate', 'Date of birth'], ['dTime', 'Time of birth'], ['dType', 'Type of delivery'], ['dProvider', 'Delivering provider'],
      ['dRom', 'Membranes / amniotic fluid'], ['dComp', 'Complications'], ['dResus', 'Resuscitation'], ['dApgar1', 'Apgar 1 minute'], ['dApgar5', 'Apgar 5 minutes'], ['dApgar10', 'Apgar 10 minutes'], ['dCord', 'Cord vessels / cord blood']] },
    { id: 'infant', title: 'Infant Information', fields: [['iName', 'Infant'], ['iSex', 'Sex'], ['iMrn', 'MRN'], ['iBand', 'ID band number'], ['iEga', 'Gestational age'], ['iPeds', 'Pediatric provider'], ['iTo', 'Transferred to / time']] },
    { id: 'measure', title: 'Measurements', fields: [['wt', 'Weight'], ['len', 'Length (cm)'], ['hc', 'Head circumference (cm)'], ['cc', 'Chest circumference (cm)'], ['ac', 'Abdominal circumference (cm)']] },
    { id: 'feeding', title: 'Feeding', fields: [['fPlan', 'Feeding plan'], ['fFirst', 'First feeding'], ['fTime', 'Time of first feeding'], ['fLatch', 'Latch / suck'], ['fTol', 'Tolerance'], ['fGlu', 'Blood glucose (mg/dL) / time']] },
    { id: 'abnormal', title: 'Abnormal Findings', fields: [['abn', 'Abnormal findings', true], ['abnInt', 'Interventions', true], ['abnProv', 'Provider notified / time / response']] }
  ];
  const TR_FORM = { title: 'Newborn Transitional Record', newborn: true, sections: TR.map(s => ({ id: s.id, title: s.title, fields: s.fields.map(([id, label, area]) => ({ id, label, type: area ? 'textarea' : 'text' })) })) };
  const VS_COLS = [['temp', 'Axillary temp (°F)'], ['hr', 'Heart rate'], ['rr', 'Resp. rate'], ['spo2', 'SpO₂ (%)'], ['bpArm', 'BP right arm'], ['bpLeg', 'BP right leg'], ['distress', 'Signs of distress'], ['other', 'Other observations'], ['initials', 'Initials']];
  const VS_FORM = { title: 'Transitional Record — Vital Signs', newborn: true, sections: [{ id: 'vs', title: 'Vital signs', fields: VS_COLS.map(([id, label]) => ({ id, label, type: 'text' })) }],
    summary: d => VS_COLS.slice(0, 6).map(([k, l]) => d.values['vs.' + k] ? `${l.replace(/ \(.*\)/, '')} ${d.values['vs.' + k]}` : '').filter(Boolean).join(' · ') || 'Vital signs row' };
  window.ASSESSMENT_FORMS = Object.assign(window.ASSESSMENT_FORMS || {}, { 'newborn-h2t': H2T, 'newborn-transition': TR_FORM, 'newborn-tr-vs': VS_FORM });

  /* ---------- helpers ---------- */
  const cfg = p => p && p.newborn;
  const isOpen = p => !!(cfg(p) && Store.released(cfg(p).deliveryPid)[cfg(p).deliveryEvent]);
  const babyOf = p => Model.get(cfg(p).chart);
  const live = (doc, formId) => doc.assess.filter(e => e.status === 'active' && e.data.formId === formId).sort((a, b) => a.time - b.time);
  // Latest saved value for each Transitional Record field (each save adds to the record).
  function trValues(doc) {
    const out = {};
    live(doc, 'newborn-transition').forEach(e => Object.keys(e.data.values).forEach(k => { const v = e.data.values[k]; if (!U.isEmpty(v)) out[k.split('.').pop()] = { v, e }; }));
    return out;
  }
  const initialsOf = name => String(name || '').split(/\s+/).filter(Boolean).map(w => w[0].toUpperCase()).join('').slice(0, 3);

  // Medication documentation references: straight from the baby's MAR (documented there, not here).
  function medRefs(b, doc) {
    return b.meds.map(m => {
      const given = doc.mar.filter(e => e.status === 'active' && e.data.medId === m.id && e.data.action === 'Given').sort((x, y) => y.time - x.time)[0];
      return `<tr><td>${esc(Model.medLabel(m))}</td><td>${given ? `Given ${esc(U.fmtDT(given.time))} · ${esc(initialsOf(given.user.name))}` : '<span class="muted">Not documented on the MAR</span>'}</td></tr>`;
    }).join('');
  }

  function recordHtml(p, b, doc) {
    const conf = cfg(p).confirmed || {};
    const vals = trValues(doc);
    const cell = ([id, label]) => {
      const c = conf[id], s = vals[id];
      const v = c != null ? `<span class="tr-conf">${esc(c)}</span>` : s ? `${esc(Array.isArray(s.v) ? s.v.join(', ') : s.v)} <span class="tr-by">${esc(initialsOf(s.e.user.name))} ${esc(U.fmtTime(s.e.time))}</span>` : '';
      return `<td class="tr-l">${esc(label)}</td><td class="tr-v">${v}</td>`;
    };
    const rows = fields => { let h = ''; for (let i = 0; i < fields.length; i += 2) h += `<tr>${cell(fields[i])}${fields[i + 1] ? cell(fields[i + 1]) : '<td></td><td></td>'}</tr>`; return h; };
    const vs = live(doc, 'newborn-tr-vs');
    return `<div class="tr-form">
      <div class="tr-title"><div>${esc(window.EHR_CONFIG.hospitalName)}</div><strong>NEWBORN TRANSITIONAL RECORD</strong>
        <div class="tr-id">${esc(b.name.last.toUpperCase())}, ${esc(b.name.first)} · MRN ${esc(b.mrn)} · ${esc(b.unit)}</div></div>
      ${TR.map(sec => `<table class="tr-sec"><thead><tr><th colspan="4">${esc(sec.title)}</th></tr></thead><tbody>${rows(sec.fields)}</tbody></table>`).join('')}
      <table class="tr-sec"><thead><tr><th colspan="2">Medications — documented on the MAR (current approved orders)</th></tr></thead><tbody>${medRefs(b, doc)}</tbody></table>
      <table class="tr-sec tr-vs"><thead><tr><th colspan="${VS_COLS.length + 1}">Vital Signs</th></tr>
        <tr><th>Date / time</th>${VS_COLS.map(([, l]) => `<th>${esc(l)}</th>`).join('')}</tr></thead>
        <tbody>${vs.length ? vs.map(e => `<tr><td class="nowrap">${esc(U.fmtDT(e.time))}</td>${VS_COLS.map(([k]) => `<td>${esc(e.data.values['vs.' + k] || '')}</td>`).join('')}</tr>`).join('')
          : `<tr><td colspan="${VS_COLS.length + 1}" class="muted">No vital signs recorded yet.</td></tr>`}</tbody></table>
      <p class="muted small">Gray values are confirmed scenario information. Other entries show the documenting nurse's initials and time; full author and date/time are in Assessment History.</p>
    </div>`;
  }

  /* ---------- documenting ---------- */
  function openH2T(p) { Views.assess.open(babyOf(p), 'newborn-h2t'); }

  function openRecord(p) {
    const b = babyOf(p), doc = Store.doc(b.id), conf = cfg(p).confirmed || {}, vals = trValues(doc);
    const input = ([id, label, area]) => conf[id] != null
      ? `<label class="field"><span>${esc(label)}</span><input value="${esc(conf[id])}" disabled title="Confirmed scenario information"></label>`
      : area ? `<label class="field wide"><span>${esc(label)}</span><textarea name="${sectionOf(id)}.${id}" rows="2"></textarea></label>`
        : `<label class="field"><span>${esc(label)}</span><input name="${sectionOf(id)}.${id}" placeholder="${vals[id] ? esc('Current: ' + vals[id].v) : ''}"></label>`;
    UI.modal({
      title: 'Newborn Transitional Record', wide: true,
      body: `<p class="muted">Saves to Baby Boy Sung's record. Confirmed scenario information is filled in and locked; complete the blanks you assess. Leave unknown items blank. Medications are documented on the MAR; vital signs use "Add Vital Signs".</p>
        <form class="assess-form"><div class="form-grid">${UI.timeField(b, 'Date/time documented')}</div>
        ${TR.map(sec => `<fieldset class="form-sec"><legend>${esc(sec.title)}</legend><div class="form-grid">${sec.fields.map(input).join('')}</div></fieldset>`).join('')}</form>`,
      buttons: [{ label: 'Cancel' }, { label: 'Sign & Save', cls: 'btn-primary', onClick: api => {
        const values = U.formValues(api.el.querySelector('.assess-form')); const time = UI.readTime(b, api.el); delete values._time;
        Object.keys(values).forEach(k => { if (U.isEmpty(values[k])) delete values[k]; });
        if (!Object.keys(values).length) { UI.formError(api.el.querySelector('.modal-body'), 'Nothing has been documented.'); return false; }
        if (!Store.add(b.id, 'assess', { formId: 'newborn-transition', values }, time, b.clock.now())) return false;
        UI.toast('Transitional Record saved to Baby Boy Sung.'); App.render();
      } }]
    });
  }
  function sectionOf(id) { const s = TR.find(x => x.fields.some(f => f[0] === id)); return s ? s.id : 'tr'; }

  function openVitals(p) {
    const b = babyOf(p), s = Store.session() || {};
    UI.modal({
      title: 'Transitional Record — Add Vital Signs', wide: true,
      body: `<form class="assess-form"><div class="form-grid">${UI.timeField(b, 'Date/time')}
          ${VS_COLS.map(([k, l]) => k === 'distress'
            ? `<label class="field"><span>${esc(l)}</span><select name="vs.${k}">${UI.options(['None observed', 'Tachypnea', 'Retractions', 'Grunting', 'Nasal flaring', 'Cyanosis', 'Apnea'])}</select></label>`
            : k === 'other' ? `<label class="field wide"><span>${esc(l)}</span><textarea name="vs.${k}" rows="2"></textarea></label>`
            : `<label class="field"><span>${esc(l)}</span><input name="vs.${k}" ${k === 'initials' ? `value="${esc(initialsOf(s.name))}"` : ''} ${['temp', 'hr', 'rr', 'spo2'].includes(k) ? 'inputmode="decimal"' : ''}></label>`).join('')}
        </div></form>`,
      buttons: [{ label: 'Cancel' }, { label: 'Sign & Save', cls: 'btn-primary', onClick: api => {
        const values = U.formValues(api.el.querySelector('.assess-form')); const time = UI.readTime(b, api.el); delete values._time;
        const measured = ['temp', 'hr', 'rr', 'spo2', 'bpArm', 'bpLeg', 'distress', 'other'].some(k => !U.isEmpty(values['vs.' + k]));
        if (!measured) { UI.formError(api.el.querySelector('.modal-body'), 'Enter at least one vital sign or observation.'); return false; }
        if (U.isEmpty(values['vs.initials'])) { UI.formError(api.el.querySelector('.modal-body'), 'Enter your initials.'); return false; }
        Object.keys(values).forEach(k => { if (U.isEmpty(values[k])) delete values[k]; });
        if (!Store.add(b.id, 'assess', { formId: 'newborn-tr-vs', values }, time, b.clock.now())) return false;
        UI.toast('Vital signs added to the Transitional Record.'); App.render();
      } }]
    });
  }

  /* ---------- the Newborn tab ---------- */
  Views.newborn = {
    label: 'Newborn',
    render(p) {
      const b = babyOf(p), doc = Store.doc(b.id), self = p.id === b.id;
      const where = self ? 'Also shown on Amelia Sung\'s chart (Newborn tab).' : 'Saves to Baby Boy Sung\'s record (MRN ' + b.mrn + '); the same documentation is on his chart. Amelia\'s maternal assessments stay on her Assessments tab.';
      if (!isOpen(p)) return UI.panel('Newborn Documentation — Baby Boy Sung', `<div class="alert alert-info">Newborn documentation opens after delivery. Faculty: Instructor Tools → Amelia Sung → <strong>Delivery completed</strong>.</div>`);
      const h2t = live(doc, 'newborn-h2t').reverse();
      return `<div class="nb-head"><div><strong>Newborn Documentation — Baby Boy Sung</strong><div class="muted small">${esc(where)}</div></div>
          <div class="nb-actions"><button class="btn btn-primary" data-nb="h2t">Document Newborn Head-to-Toe</button>
            <button class="btn btn-primary" data-nb="record">Document Transitional Record</button>
            <button class="btn" data-nb="vitals">Add Vital Signs</button></div></div>
        ${UI.panel('Newborn Head-to-Toe Assessments', h2t.length ? `<table class="grid"><thead><tr><th>Date/time</th><th>Summary</th><th>Documented by</th><th></th></tr></thead><tbody>
          ${h2t.map(e => `<tr><td class="nowrap">${esc(U.fmtDT(e.time))}</td><td>${esc(Views.assess.summary(H2T, e.data))}</td><td>${esc(Model.signature(e))}</td><td><button class="btn btn-sm" data-nbview="${esc(e.id)}">View</button></td></tr>`).join('')}</tbody></table>` : UI.empty('No newborn head-to-toe assessment documented yet.'))}
        ${UI.panel('Newborn Transitional Record', recordHtml(p, b, doc))}`;
    },
    bind(root, p) {
      const act = { h2t: openH2T, record: openRecord, vitals: openVitals };
      root.querySelectorAll('[data-nb]').forEach(btn => btn.addEventListener('click', () => {
        if (Screens.mode() === 'observer') { UI.toast('Observer mode is view only. You cannot document.', 'warn'); return; }
        act[btn.dataset.nb](p);
      }));
      root.querySelectorAll('[data-nbview]').forEach(btn => btn.addEventListener('click', () => {
        const b = babyOf(p), e = Store.doc(b.id).assess.find(x => x.id === btn.dataset.nbview);
        UI.modal({ title: H2T.title, wide: true, body: `${UI.entryMeta(e)}${Views.assess.detail(b, H2T, e.data)}` });
      }));
    }
  };
  Views.newborn.isOpen = isOpen;
})();
