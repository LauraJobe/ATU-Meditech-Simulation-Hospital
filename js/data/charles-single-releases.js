/*
 * Charles Jones (id "charlesjones") — every release is its own Release Now button, grouped under collapsible
 * Shift 1–4 headings in Instructor Tools (ev.group). Weights from the faculty packet's yellow instructor boxes, and the
 * packet orders the hospital chart did not have. Applied on top of js/data/patients-imported.js (generated; not
 * edited), so this survives a re-import. Loaded directly after js/data/atu-barcodes.js.
 *
 *   - One button = one item. A medication order and its MAR entry are one item (the event's medication creates both).
 *   - ATU items keep their content; their event ids are "rel-" + the original item id.
 *   - The "No additional orders entered" placeholder orders are dropped.
 *   - aka: words that identify a packet order, so faculty reviewing a student's telephone order for the same thing
 *     are warned not to approve it AND release it.
 * Open faculty items are built exactly as written in the report (Lasix 1 mg/kg once; Tylenol 1,000 mg now then q4h
 * PRN; D50 not built).
 */
(function () {
  'use strict';
  const p = (window.SIM_PATIENTS || []).find(x => x.id === 'charlesjones');
  if (!p) return;
  const BY = 'Dr. Burris';
  const old = id => (p.events || []).find(e => e.id === id) || {};
  const item = (evId, kind, id) => (old(evId)[kind] || []).find(x => x.id === id);
  const order = (id, cat, text) => ({ id, cat, text, by: BY });
  const weightRow = (lb, kg) => ({ at: 0, weight: kg, note: `${lb} lb`, by: 'Faculty release (packet)' });
  // The shift MAR schedules (formerly instructor notes on the ATU events) become documents students can open.
  const marDoc = (n, evId) => {
    const txt = String(old(evId).instructorNotes || '').replace(/^MAR — Shift \d+:\s*/, '');
    const [head, ...rows] = txt.split(/\s+-\s+/);
    return { id: `ch-mar-${n}-doc`, title: `MAR — Shift ${n}`, category: 'mar', md: `${head}\n\n${rows.map(r => '- ' + r).join('\n')}` };
  };

  // Admission weight 235 lb (106.6 kg), also on his first Vital Signs row.
  p.weightKg = 106.6;

  // Admission chart corrections (Laura Jobe, November 3, 2026).
  // 1. "Admission Labs" was an old lab-report image filed under Imaging; the labs are under Laboratory (charlesjones-l7-0).
  p.imaging = (p.imaging || []).filter(i => i.id !== 'charlesjones-im7');
  // 2. Admission labs: BNP.
  const admLabs = (p.labs || []).find(l => l.id === 'charlesjones-l7-0');
  if (admLabs && !admLabs.results.some(r => r.t === 'BNP')) admLabs.results.push({ t: 'BNP', v: '4000', u: 'pg/mL', ref: '<100', flag: 'H' });
  // 3. Spironolactone: frequency Daily, no hold reason (dose, route, status, and the "Hold spironolactone" release unchanged).
  const spiro = (p.meds || []).find(m => m.id === 'char-spironolactone-8');
  if (spiro) { spiro.freq = 'Daily'; delete spiro.holdReason; }
  // 4. Echo and ECG (charlesjones-im1, -im2) stay under Diagnostics > Cardiovascular. The Echo report sheet's patient
  //    header (old weight / MRN / provider) is covered on a copy, assets/charles-jones-echo.png (the imported file is
  //    unchanged); the chart's own patient data stays as is (wristbands are already printed).
  const echo = p.imaging.find(i => i.id === 'charlesjones-im1');
  if (echo) echo.images = ['assets/charles-jones-echo.png'];
  // 5. Admission chest X-ray: part of the admission chart (not a release). Image: the faculty's report sheet, with its
  //    patient header covered the same way.
  if (!p.imaging.some(i => i.id === 'charlesjones-im-cxr-adm')) p.imaging.push({ id: 'charlesjones-im-cxr-adm', study: 'Admission Chest X-ray', at: -180, images: ['assets/charles-jones-admission-cxr.png'],
    text: 'Study Type: Portable AP Chest Radiograph\n' +
      'Indication: Dyspnea, orthopnea, fatigue, weight gain; history of hypertension and reduced ejection fraction.\n' +
      'Findings:\n' +
      'Lungs: Bilateral lower lung field interstitial and alveolar opacities consistent with pulmonary congestion. No focal consolidation, pleural effusion, or pneumothorax. No lung mass or cavitary lesion.\n' +
      'Heart and Mediastinum: Cardiomegaly is present. Pulmonary vasculature is mildly prominent. No widened mediastinum.\n' +
      'Pleura: No pleural effusion or thickening.\n' +
      'Bones and Soft Tissues: No acute osseous abnormalities. No subcutaneous emphysema.\n' +
      'Impression:\n' +
      'Cardiomegaly with bilateral lower lung field congestion, consistent with pulmonary edema in the setting of congestive heart failure. No evidence of pneumonia, pneumothorax, or pleural effusion.\n' +
      'Read by Dr. Sneed' });
  if (p.vitals && p.vitals[0]) p.vitals[0].weight = 106.6;

  const S1 = 'Shift 1', S2 = 'Shift 2', S3 = 'Shift 3', S4 = 'Shift 4';
  p.events = [
    // Shift 1 (2)
    { id: 'ch-wt-1', group: S1, title: 'Weight — Shift 1 (231 lb)', vitals: [weightRow(231, 104.8)] },
    { id: 'ch-ns-bolus', group: S1, title: 'Normal saline bolus 250 mL IV over 1 hour', aka: ['bolus'],
      meds: [{ id: 'ch-ns-bolus', name: 'Normal saline bolus', dose: '250 mL', route: 'IV', freq: 'Once — over 1 hour', type: 'once', rate: '250 mL/hr', doses: [{ at: 0 }], orderedBy: BY }] },

    // Shift 2 (8)
    { id: 'ch-wt-2', group: S2, title: 'Weight — Shift 2 (236 lb)', vitals: [weightRow(236, 107.0)] },
    { id: 'rel-charlesjones-ev3-l0-0', group: S2, title: 'Shift 2 Labs', labs: [item('charlesjones-ev3', 'labs', 'charlesjones-ev3-l0-0')] },
    { id: 'ch-cxr', group: S2, title: 'Repeat chest X-ray — order', aka: ['x-ray', 'xray', 'cxr'], orders: [order('ch-cxr', 'Imaging', 'Repeat chest X-ray')] },
    { id: 'rel-charlesjones-ev3-im1', group: S2, title: 'Shift 2 Chest X-ray Results', imaging: [item('charlesjones-ev3', 'imaging', 'charlesjones-ev3-im1')] },
    { id: 'ch-lasix', group: S2, title: 'Furosemide (Lasix) 1 mg/kg IV once', aka: ['lasix', 'furosemide'],
      instructorNotes: 'Packet answer: 107 mg (10.7 mL of 10 mg/mL) at 236 lb (107.0 kg). Open with faculty: the Nursing Calculations sheet shows 82 mg, and the older packet shows 10 mg IVP.',
      meds: [{ id: 'ch-lasix', name: 'Furosemide (Lasix)', dose: '1 mg/kg', route: 'IV', freq: 'Once', type: 'once', doses: [{ at: 0 }], orderedBy: BY,
        instructions: 'Weight-based: 1 mg/kg. Vial 10 mg/mL.' }] },
    { id: 'ch-foley', group: S2, title: 'Place an indwelling Foley catheter', aka: ['foley', 'catheter'], orders: [order('ch-foley', 'Nursing', 'Place an indwelling Foley catheter')] },
    { id: 'ch-kcl', group: S2, title: 'Potassium chloride 20 mEq PO daily', aka: ['potassium', 'kcl', 'k-dur'],
      meds: [{ id: 'ch-kcl', name: 'Potassium chloride', dose: '20 mEq', route: 'PO', freq: 'Daily', type: 'scheduled', doses: [{ at: 0 }], orderedBy: BY }] },
    { id: 'ch-mar-2', group: S2, title: 'MAR — Shift 2', documents: [marDoc(2, 'charlesjones-ev3')] },

    // Shift 3 (10)
    { id: 'ch-wt-3', group: S3, title: 'Weight — Shift 3 (237 lb)', vitals: [weightRow(237, 107.5)] },
    { id: 'ch-oj', group: S3, title: 'Give orange juice and recheck blood sugar', aka: ['orange juice', 'juice'], orders: [order('ch-oj', 'Nursing', 'Give orange juice and recheck blood sugar')] },
    { id: 'rel-charlesjones-ev1-o1-0', group: S3, title: 'A1C and CMP now. Call MD when you get results', orders: [item('charlesjones-ev1', 'orders', 'charlesjones-ev1-o1-0')] },
    { id: 'rel-charlesjones-ev1-o1-1', group: S3, title: 'Remove foley', orders: [item('charlesjones-ev1', 'orders', 'charlesjones-ev1-o1-1')],
      instructorNotes: 'Shift 4 is a CAUTI with the Foley in place — this button can be left unreleased.' },
    { id: 'rel-charlesjones-ev1-o1-2', group: S3, title: 'Glucose checks AC and HS. Follow sliding scale', orders: [item('charlesjones-ev1', 'orders', 'charlesjones-ev1-o1-2')] },
    { id: 'ch-hold-metformin', group: S3, title: 'Hold metformin', aka: ['metformin'], orders: [order('ch-hold-metformin', 'Medication', 'Hold metformin')],
      hold: [{ id: 'char-metformin-4', reason: 'On hold per provider order (Shift 3)' }] },
    { id: 'ch-hold-spiro', group: S3, title: 'Hold spironolactone', aka: ['spironolactone', 'aldactone'], orders: [order('ch-hold-spiro', 'Medication', 'Hold spironolactone')],
      instructorNotes: 'Spironolactone is already held on the MAR (held while receiving Lasix).' },
    { id: 'rel-charlesjones-ev1-l0-0', group: S3, title: 'Shift 3 CMP', labs: [item('charlesjones-ev1', 'labs', 'charlesjones-ev1-l0-0')] },
    { id: 'rel-charlesjones-ev1-l0-1', group: S3, title: 'Hemoglobin A1c', labs: [item('charlesjones-ev1', 'labs', 'charlesjones-ev1-l0-1')] },
    { id: 'ch-mar-3', group: S3, title: 'MAR — Shift 3', documents: [marDoc(3, 'charlesjones-ev1')] },

    // Shift 4 (8) — no Shift 4 weight
    { id: 'rel-charlesjones-ev2-l0-0', group: S4, title: 'Shift 4 Urinalysis', labs: [item('charlesjones-ev2', 'labs', 'charlesjones-ev2-l0-0')] },
    { id: 'ch-culture', group: S4, title: 'Blood culture — pending', labs: [{ id: 'ch-culture', panel: 'Shift 4 Follow-up Labs', at: 0, results: [{ t: 'Blood culture', v: 'Pending', ref: 'No growth' }] }] },
    { id: 'rel-charlesjones-ev2-l1-0', group: S4, title: 'Shift 4 BMP', labs: [item('charlesjones-ev2', 'labs', 'charlesjones-ev2-l1-0')] },
    { id: 'rel-charlesjones-ev2-l1-1', group: S4, title: 'Shift 4 Lactate', labs: [item('charlesjones-ev2', 'labs', 'charlesjones-ev2-l1-1')] },
    { id: 'rel-charlesjones-ev2-l1-2', group: S4, title: 'Shift 4 CBC', labs: [item('charlesjones-ev2', 'labs', 'charlesjones-ev2-l1-2')] },
    { id: 'ch-ceftriaxone', group: S4, title: 'Ceftriaxone 1 g in 50 mL IV over 30 minutes every 12 hours', aka: ['ceftriaxone', 'rocephin'],
      meds: [{ id: 'ch-ceftriaxone', name: 'Ceftriaxone', dose: '1 g in 50 mL', route: 'IV', freq: 'Every 12 hours — infuse over 30 minutes', type: 'scheduled', doses: [{ at: 0 }], orderedBy: BY }] },
    { id: 'ch-tylenol', group: S4, title: 'Acetaminophen (Tylenol) 1,000 mg PO now, then every 4 hours PRN fever or pain', aka: ['tylenol', 'acetaminophen'],
      instructorNotes: 'Built as written. Open with faculty: every 4 hours PRN could reach 6 g in a day; the frequency is being confirmed.',
      meds: [
        { id: 'ch-tylenol-now', name: 'Acetaminophen (Tylenol)', dose: '1,000 mg', route: 'PO', freq: 'Now (once)', type: 'once', doses: [{ at: 0 }], orderedBy: BY },
        { id: 'ch-tylenol-prn', name: 'Acetaminophen (Tylenol)', dose: '1,000 mg', route: 'PO', freq: 'Every 4 hours PRN fever or pain', type: 'prn', indication: 'Fever or pain', minIntervalHr: 4, orderedBy: BY }] },
    { id: 'ch-mar-4', group: S4, title: 'MAR — Shift 4', documents: [marDoc(4, 'charlesjones-ev2')] }
  ];
})();
