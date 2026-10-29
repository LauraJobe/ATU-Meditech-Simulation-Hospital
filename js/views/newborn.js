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

  // Newborn Transitional Record — follows the hospital paper form (sections, field order, circle choices, and the
  // vital-signs grid). Field: [id, label, choices?] — choices are circled on paper (one per field).
  // "confirmed" values come from p.newborn.confirmed (scenario facts; shown, not editable). Handwritten examples on
  // the paper form are NOT used; blanks stay blank for the student.
  const YN = ['Yes', 'No'], PM = ['+', '−'], TX = ['Y', 'N'];
  const TR = [
    { id: 'maternal', title: 'Maternal History', cols: [
      [[['gbs', 'GBS', ['Pos', 'Neg']], ['abx', 'Antibiotic'], ['abxTimes', 'Times']],
        [['rubella', 'Rubella', ['Immune', 'NonImmune', 'Equivocal']]],
        [['chlam', 'Chlamydia history', YN], ['chlamTx', 'Treated', TX]],
        [['herpes', 'Herpes history', YN], ['herpesTx', 'Treated', TX]],
        [['gon', 'Gonorrhea history', YN], ['gonTx', 'Treated', TX]],
        [['diab', 'Diabetes history', YN], ['diabCtl', 'Controlled', ['Diet', 'Insulin']]],
        [['pih', 'PIH history', YN], ['mag', 'Magnesium', TX]],
        [['smoker', 'Smoker', YN], ['cigs', 'Cigs / day']],
        [['drugs', 'Illegal drug use', YN], ['substance', 'Substance']],
        [['urine', 'If yes, urine collected'], ['cordCol', 'Cord collected']]],
      [[['hepb', 'Hep B', PM]], [['vdrl', 'VDRL', PM]], [['hiv', 'HIV', PM]],
        [['gravida', 'Gravida'], ['para', 'Para']], [['edc', 'EDC']], [['bloodType', 'Blood type']],
        [['romDate', 'Rupture of membranes: date'], ['romTime', 'Time']],
        [['anes', 'Anesthesia', ['Epidural', 'Spinal', 'General']]],
        [['feedPref', 'Feeding preference', ['Breast', 'Bottle', 'Both']]],
        [['mOther', 'Other', null, true]]]] },
    { id: 'infant', title: 'Infant', rows: [
      [['band', 'Band #'], ['obMd', 'Physician: OB'], ['ped', 'Ped']],
      [['dob', 'Date of birth'], ['tob', 'Time'], ['sex', 'Sex', ['Male', 'Female']], ['present', 'Presentation', ['Ceph', 'Breech']], ['apgar1', 'Apgar 1 min'], ['apgar5', '5 min'], ['apgar10', '10 min']],
      [['delivery', 'Delivery', ['Vaginal', 'C-Section']], ['csReason', 'C/S reason'], ['mec', 'Meconium del', YN], ['useOf', 'Use of', ['Forceps', 'Vac', 'N/A']], ['output', 'Output', ['Void', 'Stool', 'Both', 'None']], ['delee', 'DeLee (mL)']],
      [['cordSent', 'Cord blood: sent'], ['cordTime', 'Time'], ['cordOrd', 'Ordered'], ['labTime', 'Lab: time'], ['hct', 'Hct'], ['hgb', 'Hgb'], ['gluc', 'Gluc']],
      [['gestDates', 'Gest age by: dates'], ['gestExam', 'Exam'], ['size', 'Size', ['AGA', 'LGA', 'SGA']], ['bath', 'Bath']],
      [['wtG', 'Weight (gms)'], ['wtLb', 'lb'], ['wtOz', 'oz'], ['lenCm', 'Length (cm)'], ['lenIn', 'in'], ['hcCm', 'Head circ (cm)'], ['hcIn', 'in'],
        ['ccCm', 'Chest circ (cm)'], ['ccIn', 'in'], ['acCm', 'Abd circ (cm)'], ['acIn', 'in'], ['secTag', 'Security tag']]] },
    { id: 'meds', title: 'Medications (from the approved orders; time and site come from the MAR)', rows: [
      [['eryDecl', 'Erythromycin declined', YN], ['vitkDecl', 'Vitamin K declined', YN], ['hepbConsent', 'Hep B consent signed', YN], ['hepbLot', 'Hep B lot #'], ['hepbDecl', 'Hep B declined', YN]]] },
    { id: 'findings', title: 'Abnormal Findings and Feeding', rows: [
      [['abn', 'Abnormal findings', null, true]],
      [['breastR', 'Feeding: breast R (min)'], ['breastL', 'L (min)'], ['bottle', 'Bottle (mL)']]] }
  ];
  const SEC_OF = {};   // field id -> section id (saved values are "section.field", like other forms)
  TR.forEach(s => (s.cols ? s.cols.flat() : s.rows).forEach(r => r.forEach(f => { SEC_OF[f[0]] = s.id; })));
  const TR_FORM = { title: 'Newborn Transitional Record', newborn: true, sections: TR.map(s => ({ id: s.id, title: s.title,
    fields: (s.cols ? s.cols.flat() : s.rows).flat().map(([id, label, , area]) => ({ id, label, type: area ? 'textarea' : 'text' })) })) };
  // Vital signs grid: one column per saved entry, rows as on the paper form.
  const VS_COLS = [['temp', 'Axillary Temp'], ['hr', 'Heart Rate'], ['rr', 'Resp Rate'], ['spo2', 'O2 Sats'], ['bpArm', 'BP R Arm'], ['bpLeg', 'BP R Leg'], ['distress', 'S/S Distress'], ['other', 'Other'], ['initials', 'Initials']];
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

  // Medication lines of the paper form, from the CURRENT APPROVED ORDERS on the baby's MAR (documented on the MAR).
  function medRefs(b, doc) {
    return b.meds.map(m => {
      const given = doc.mar.filter(e => e.status === 'active' && e.data.medId === m.id && e.data.action === 'Given').sort((x, y) => y.time - x.time)[0];
      const site = given && (given.data.site || given.data.siteDesc);
      return `<tr><td>${esc(Model.medLabel(m))}</td><td>${given ? `Time: ${esc(U.fmtDT(given.time))}${site ? ` · Site: ${esc(site)}` : ''} · ${esc(initialsOf(given.user.name))}` : '<span class="muted">Not documented on the MAR</span>'}</td></tr>`;
    }).join('') + '<tr><td>HBIG 0.5 mL IM</td><td class="muted">No order — N/A</td></tr>';
  }

  function recordHtml(p, b, doc) {
    const conf = cfg(p).confirmed || {};
    const vals = trValues(doc);
    const val = ([id, label, choices, area]) => {
      const c = conf[id], s = vals[id];
      const v = c != null ? c : s ? (Array.isArray(s.v) ? s.v.join(', ') : s.v) : '';
      const by = c == null && s ? ` <span class="tr-by">${esc(initialsOf(s.e.user.name))} ${esc(U.fmtTime(s.e.time))}</span>` : '';
      const body = choices ? choices.map(o => `<span class="tr-opt ${o === v ? 'tr-on' : ''}">${esc(o)}</span>`).join(' / ')
        : `<span class="tr-line ${area ? 'tr-area' : ''}">${v ? `<span class="${c != null ? 'tr-conf' : ''}">${esc(v)}</span>` : ''}</span>`;
      return `<span class="tr-f"><span class="tr-lab">${esc(label)}:</span> ${body}${by}</span>`;
    };
    const row = r => `<div class="tr-row">${r.map(val).join('')}</div>`;
    const sec = s => `<div class="tr-box"><div class="tr-h">${esc(s.title.toUpperCase())}</div>
      ${s.cols ? `<div class="tr-cols">${s.cols.map(col => `<div>${col.map(row).join('')}</div>`).join('')}</div>` : s.rows.map(row).join('')}
      ${s.id === 'meds' ? `<table class="tr-sec"><tbody>${medRefs(b, doc)}</tbody></table>` : ''}</div>`;
    const vs = live(doc, 'newborn-tr-vs');
    const cols = Math.max(vs.length, 5);
    const vsGrid = `<table class="tr-sec tr-vs"><thead><tr><th colspan="${cols + 1}">VITAL SIGNS</th></tr></thead><tbody>
      <tr><td class="tr-l">Time</td>${Array.from({ length: cols }, (_, i) => `<td class="nowrap">${vs[i] ? esc(U.fmtDT(vs[i].time)) : ''}</td>`).join('')}</tr>
      ${VS_COLS.map(([k, l]) => `<tr><td class="tr-l">${esc(l)}</td>${Array.from({ length: cols }, (_, i) => `<td>${vs[i] ? esc(vs[i].data.values['vs.' + k] || '') : ''}</td>`).join('')}</tr>`).join('')}</tbody></table>`;
    const nurses = [...new Set(live(doc, 'newborn-transition').concat(vs).map(e => Model.signature(e)))];
    return `<div class="tr-form">
      <div class="tr-title"><div>${esc(window.EHR_CONFIG.hospitalName)}</div><strong>NEWBORN TRANSITIONAL RECORD</strong>
        <div class="tr-id">${esc(b.name.last.toUpperCase())}, ${esc(b.name.first)} · MRN ${esc(b.mrn)} · ${esc(b.unit)}</div></div>
      ${TR.map(sec).join('')}
      ${vsGrid}
      <div class="tr-row"><span class="tr-f"><span class="tr-lab">Nurse signature:</span> <span class="tr-line">${esc(nurses.join('; '))}</span></span></div>
      <p class="muted small">Gray values are confirmed scenario information; circled choices are what was documented. Initials and time follow each entry; full author and date/time are in Assessment History.</p>
    </div>`;
  }

  /* ---------- documenting ---------- */
  function openH2T(p) { Views.assess.open(babyOf(p), 'newborn-h2t'); }

  function openRecord(p) {
    const b = babyOf(p), doc = Store.doc(b.id), conf = cfg(p).confirmed || {}, vals = trValues(doc);
    const input = ([id, label, choices, area]) => {
      if (conf[id] != null) return `<label class="field"><span>${esc(label)}</span><input value="${esc(conf[id])}" disabled title="Confirmed scenario information"></label>`;
      const cur = vals[id] ? vals[id].v : '';
      if (choices) return `<fieldset class="field checks"><legend>${esc(label)}</legend>${choices.map(o => `<label class="check"><input type="radio" name="${SEC_OF[id]}.${id}" value="${esc(o)}" ${o === cur ? 'checked' : ''}> ${esc(o)}</label>`).join('')}</fieldset>`;
      if (area) return `<label class="field wide"><span>${esc(label)}</span><textarea name="${SEC_OF[id]}.${id}" rows="2" placeholder="${cur ? esc('Current: ' + cur) : ''}"></textarea></label>`;
      return `<label class="field"><span>${esc(label)}</span><input name="${SEC_OF[id]}.${id}" placeholder="${cur ? esc('Current: ' + cur) : ''}"></label>`;
    };
    UI.modal({
      title: 'Newborn Transitional Record', wide: true,
      body: `<p class="muted">Saves to Baby Boy Sung's record. Confirmed scenario information is filled in and locked; complete what you assess and leave unknown items blank. Medications are documented on the MAR; vital signs use "Add Vital Signs".</p>
        <form class="assess-form"><div class="form-grid">${UI.timeField(b, 'Date/time documented')}</div>
        ${TR.map(s => `<fieldset class="form-sec"><legend>${esc(s.title)}</legend><div class="form-grid">${(s.cols ? s.cols.flat() : s.rows).flat().map(input).join('')}</div></fieldset>`).join('')}</form>`,
      buttons: [{ label: 'Cancel' }, { label: 'Sign & Save', cls: 'btn-primary', onClick: api => {
        const values = U.formValues(api.el.querySelector('.assess-form')); const time = UI.readTime(b, api.el); delete values._time;
        // Only what changed: a choice that is still the current value is not saved again.
        Object.keys(values).forEach(k => { const id = k.split('.').pop(); if (U.isEmpty(values[k]) || (vals[id] && vals[id].v === values[k])) delete values[k]; });
        if (!Object.keys(values).length) { UI.formError(api.el.querySelector('.modal-body'), 'Nothing new has been documented.'); return false; }
        if (!Store.add(b.id, 'assess', { formId: 'newborn-transition', values }, time, b.clock.now())) return false;
        UI.toast('Transitional Record saved to Baby Boy Sung.'); App.render();
      } }]
    });
  }

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
