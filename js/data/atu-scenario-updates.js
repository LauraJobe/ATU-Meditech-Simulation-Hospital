/*
 * Scenario content from Laura Blasdel's ATU Simulation Hospital (laurablasdel/ATU-Simulation-Hospital,
 * commit e986b04), with Laura Jobe's confirmed decisions (October 29, 2026) taking priority.
 * Loaded after the patient files and js/data/atu-order-updates.js.
 *
 * Faculty release: every separately releasable clinical item is its own event (one Release button):
 *   - a medication order and its MAR entry are ONE event (the event's medication creates both, so an
 *     order can never be visible while its medication is missing from the MAR);
 *   - each nonmedication order, result panel, and document is its own event.
 * Teaching guides and expected student actions stay in facultyGuide / instructorNotes (instructor only).
 * Medication, order, and event ids are kept where they already existed, so saved charting stays linked.
 */
(function () {
  'use strict';
  const P = id => (window.SIM_PATIENTS || []).find(p => p.id === id);
  const evOf = (p, id) => (p.events || []).find(e => e.id === id);
  const medOf = (p, id) => { for (const e of p.events || []) for (const m of e.meds || []) if (m.id === id) return m; return null; };
  const order = (id, cat, text, by) => ({ id, cat, text, by });

  /* ---------- Molly Thomas (source: MD Orders, Shift 2 Respiratory Orders, Radiology -New results Thomas) ---------- */
  (function () {
    const p = P('mollythomas'); if (!p) return;
    const by = 'Dr. Henderson';
    const race = Object.assign(medOf(p, 'moll-racepinephrine-101'), { orderedBy: by,
      instructions: '0.5 mL mixed with 3 mL of sodium chloride 0.9% (Normal Saline), to be given by respiratory therapy. Call respiratory when needed.' });
    const dexa = Object.assign(medOf(p, 'moll-dexamethasone-102'), { orderedBy: by, instructions: 'Dexamethasone (Decadron) 0.6 mg/kg IV now.' });
    // Confirmed: ampicillin-sulbactam (dose, route, and frequency as in the source). Barcode stays MED-0023.
    const amp = Object.assign(medOf(p, 'moll-ampicillin-103'), { name: 'Ampicillin-sulbactam', orderedBy: by });
    const d5 = Object.assign(medOf(p, 'moll-dextrose-5-in-0-45-sodiu-104'), { orderedBy: by,
      instructions: 'IV at daily maintenance rate after void during bolus.' });
    const cxr = evOf(p, 'mollythomas-ev1');
    // An older chart page listed the Shift 2 orders in a table visible from the start; the source chart no
    // longer has it, and it would show orders before faculty release them.
    p.documents = (p.documents || []).filter(d => d.id !== 'mollythomas-d13');
    p.events = [
      { id: 'mollythomas-ev4', title: 'Racepinephrine (Asthmanefrin) 2.25% inhalation — order + MAR', meds: [race] },
      { id: 'mollythomas-ev5', title: 'Dexamethasone (Decadron) 0.6 mg/kg IV now — order + MAR', meds: [dexa] },
      { id: 'mollythomas-ev6', title: 'Ampicillin-sulbactam 50 mg/kg IV every 6 hours — order + MAR', meds: [amp] },
      { id: 'mollythomas-ev7', title: 'D5 1/2 NS IV at daily maintenance rate after void during bolus — order + MAR', meds: [d5] },
      { id: 'moll-o2', title: 'Maintain oxygen saturation at 92% or greater — order', orders: [order('moll-o2-o', 'Respiratory', 'Maintain oxygen saturation at 92% or greater.', by)] },
      { id: 'moll-cxr-order', title: 'Chest X-ray — order', orders: [order('moll-cxr-o', 'Imaging', 'Chest X-ray.', by)] },
      Object.assign(cxr, { title: 'Chest X-ray — result and image' })
    ];
  })();

  /* ---------- Stephanie Smith (source: CBC Results -Smith and the five pending orders) ---------- */
  (function () {
    const p = P('stephaniesmith'); if (!p) return;
    const by = 'Dr. Henderson';
    // One CBC panel; reference ranges sit beside each result (they were a second "result" panel).
    p.labs = [{ id: 'stephaniesmith-l8-0-0', panel: 'CBC Results -Smith', at: -120, results: [
      { t: 'RBC', v: 4.2, lo: 4.2, hi: 5.4 },
      { t: 'WBC', v: 16, lo: 4.5, hi: 10 },
      { t: 'Hgb', v: 5, lo: 12.1, hi: 15.1 },
      { t: 'HCT', v: 28, lo: 36.1, hi: 44.3 },
      { t: 'Platelets', v: 130, lo: 140, hi: 400 },
      { t: 'Blood Type', v: 'A-' }
    ] }];
    const cef = Object.assign(medOf(p, 'step-ceftriaxone-102'), { route: 'IV', freq: 'Every 6 hours', orderedBy: by });
    cef.doses = [{ at: 0 }];                  // first dose at release, then the standard every-6-hour times
    const apap = Object.assign(medOf(p, 'step-acetaminophen-101'), { orderedBy: by });   // route/frequency not specified in the order
    const xr = evOf(p, 'stephaniesmith-ev1'), prbc = evOf(p, 'stephaniesmith-ev3');
    p.events = [
      { id: 'stephaniesmith-ev2', title: 'Chest X-ray — order', orders: [order('stephaniesmith-ev2-o0-0', 'Imaging', 'Chest X-Ray.', by)] },
      Object.assign(xr, { title: 'Chest X-ray — result and image' }),
      Object.assign(prbc, { title: 'Infuse 1 Unit PRBC — transfusion order (TAR)' }),
      { id: 'stephaniesmith-ev4', title: 'Ceftriaxone 500 mg/100 mL IV every 6 hours — order + MAR', meds: [cef] },
      { id: 'stephaniesmith-ev5', title: 'Acetaminophen 650 mg — order + MAR', meds: [apap] },
      { id: 'stephaniesmith-ev6', title: 'CBC in AM — order', orders: [order('stephaniesmith-ev6-o0-0', 'Lab', 'CBC in AM.', by)] }
    ];
  })();

  /* ---------- Fatima Sanogo (source: Critical CBC, BLOOD BANK FORMS, PPH medication and follow-up orders, Shift 2) ---------- */
  (function () {
    const p = P('fatimasanogo'); if (!p) return;
    const by = 'Dr. Nelson';
    const TC_UNITS = 2;   // confirmed: type and crossmatch 2 units; transfuse 1 unit O-negative
    const meth = Object.assign(medOf(p, 'fati-methylergonovine-106'), { orderedBy: by, instructions: 'Do not administer with elevated blood pressure.' });
    const hema = Object.assign(medOf(p, 'fati-carboprost-tromethamine-107'), { orderedBy: by,
      instructions: 'Maximum approximately 2 mg total. Specific provider order required before administration.' });
    delete hema.indication;
    const miso = Object.assign(medOf(p, 'fati-misoprostol-108'), { orderedBy: by,
      instructions: '800 mcg rectally; 600–1,000 mcg PR / SL / PO as needed per protocol. Specific provider order required before administration.' });
    delete miso.indication;
    const txa = Object.assign(medOf(p, 'fati-tranexamic-acid-109'), { orderedBy: by,
      instructions: '1 g IV over 10 minutes once postpartum hemorrhage is diagnosed. May repeat 1 g after 30 minutes–24 hours if bleeding persists, per protocol. Specific provider order required before administration.' });
    const cbc = evOf(p, 'fatimasanogo-ev2'), bank = evOf(p, 'fatimasanogo-ev1');
    p.events = [
      Object.assign(cbc, { title: 'Critical CBC — Postpartum Hemorrhage — result (Hgb 6 g/dL, Hct 22%, platelets 100,000/mm³)' }),
      { id: 'fati-tc', title: `Type and crossmatch ${TC_UNITS} units PRBC — order`, orders: [order('fati-tc-o', 'Lab', `Type and crossmatch ${TC_UNITS} units packed red blood cells (PRBCs).`, by)] },
      { id: 'fati-iv2', title: 'Second IV access — order', orders: [order('fati-iv2-o', 'IV Access', 'Start a second IV.', by)] },
      { id: 'fati-transfuse', title: 'Transfuse 1 unit O-negative crossmatched PRBCs — transfusion order (TAR)',
        orders: [order('fati-transfuse-o', 'Blood Products', 'Transfuse 1 unit O-negative crossmatched packed red blood cells (PRBCs). Complete blood-product verification and transfusion monitoring per protocol.', by)],
        instructorNotes: 'Blood bank unit JF46302 is O neg (correct). The A-negative bag is the intentional incorrect unit for the wrong-blood exercise: the TAR stops an A-negative unit for this O-positive patient.' },
      { id: 'fati-hh', title: 'Hemoglobin and hematocrit after transfusion — order', orders: [order('fati-hh-o', 'Lab', 'H&H after transfusion.', by)] },
      { id: 'fatimasanogo-ev5', title: 'Methylergonovine (Methergine) 0.2 mg IM every 2–4 hours PRN — order + MAR', meds: [meth] },
      { id: 'fatimasanogo-ev6', title: 'Carboprost tromethamine (Hemabate) 250 mcg IM every 15–90 minutes PRN — order + MAR', meds: [hema] },
      { id: 'fatimasanogo-ev7', title: 'Misoprostol (Cytotec) 600–1,000 mcg PR / SL / PO PRN — order + MAR', meds: [miso] },
      { id: 'fatimasanogo-ev8', title: 'Tranexamic acid (TXA) 1 g IV over 10 minutes — order + MAR', meds: [txa] },
      { id: 'fati-tamponade', title: 'Uterine tamponade balloon — order / procedure', orders: [order('fati-tamponade-o', 'Nursing', 'Uterine tamponade balloon placement. Provider procedure; nurse assists with placement.', by)] },
      { id: 'fati-cbc6', title: 'CBC in 6 hours — order', orders: [order('fatimasanogo-ev4-o0-0', 'Lab', 'CBC in 6 hours.', by)] },
      { id: 'fati-foley', title: 'Foley catheter — order', orders: [order('fatimasanogo-ev4-o0-1', 'Nursing', 'Foley catheter.', by)] },
      { id: 'fati-fundal', title: 'Fundus checks every 15 minutes — order', orders: [order('fatimasanogo-ev4-o0-2', 'Nursing', 'Fundus checks every 15 minutes.', by)] },
      Object.assign(bank, { title: 'Blood bank documentation (BLOOD BANK FORMS) — document' })
    ];
    // The Shift 2 teaching guide (expected student responses, surgical escalation) is faculty-only.
    p.facultyGuide = [{ title: 'Shift 2 — Continued Postpartum Hemorrhage (faculty only)', md:
      'Continued vaginal bleeding with large clots. Obtain second IV access. T 97.5 F; HR 105; RR 16; BP 90/50; SpO₂ 96%. ' +
      'Moderate bleeding with critical Hgb 6 g/dL, Hct 22%, platelets 100,000/mm³.\n\n' +
      `Release individually as the students call: critical CBC; type and crossmatch ${TC_UNITS} units PRBC; second IV; transfuse 1 unit O-negative crossmatched PRBCs; ` +
      'H&H after transfusion; tranexamic acid; uterine tamponade balloon; CBC.\n\n' +
      '**Assessment progression:** the fundus starts firm, high, and to the right. After the Foley is placed, it becomes boggy with bleeding.\n\n' +
      '**Wrong-blood exercise:** keep the A-negative bag as the intentional incorrect unit; the correct unit is O-negative (JF46302). Placenta delivered at 12:35.\n\n' +
      'Students should notify the provider, prepare blood verification and administration, call the surgical team for possible hysterectomy, administer released medications, and assist with tamponade placement.' }].concat((p.facultyGuide || []).filter(g => !/^Shift 2/.test(g.title)));
  })();

  /* ---------- Amelia Sung / Baby Boy Sung (source: sung-scenario, Shift 2/3 packets, Baby Boy Sung overview) ---------- */
  (function () {
    const a = P('ameliasung'), b = P('babyboysung'); if (!a || !b) return;
    // Faculty marks delivery completed: opens the newborn documentation on both Sung charts.
    a.events = (a.events || []).filter(e => e.id !== 'ameliasung-ev1').concat([
      { id: 'sung-delivery', title: 'Delivery completed — opens newborn documentation (Newborn Head-to-Toe, Transitional Record)', delivery: true,
        instructorNotes: 'Release after the delivery is complete. The Newborn tab on Amelia Sung\'s and Baby Boy Sung\'s charts then opens the newborn forms; everything saves to Baby Boy Sung.' }
    ]);
    // The Shift 2 delivery packet is a teaching guide: faculty-only (source category "faculty").
    a.facultyGuide = (a.facultyGuide || []).concat([{ title: 'Shift 2 — Delivery with Shoulder Dystocia and Nuchal Cord (faculty only)', md:
      'Pitocin remains OFF. Dr. Darnell wants a call when the baby is crowning; vacuum assist at delivery. The baby delivers after 4 pushes. Head delivers with nuchal cord. ' +
      'Shoulder dystocia: McRoberts and suprapubic pressure. Newborn heart rate greater than 100 with weak/gasping respirations. Dry, stimulate and remove wet towels; PPV for 30 seconds. ' +
      'Apgar 6 at 1 minute and 8 at 5 minutes.' }]);
    // Confirmed scenario facts shown on the Newborn Transitional Record (from the source charts and orders).
    // Anything not confirmed stays blank for the student to complete.
    const confirmed = {
      mName: 'Amelia Sung', mAge: '36', mGP: 'G2 P1 (before this delivery)', mEga: '39 weeks 1 day', mBlood: 'O positive', mGbs: 'Positive',
      mAbx: 'Clindamycin 900 mg IVPB — one dose before delivery (not adequate GBS prophylaxis)', mCond: 'Diet-controlled gestational diabetes',
      mAllergy: 'Shellfish, penicillin', mAnes: 'Epidural — bupivacaine 0.1% with fentanyl 2 mcg/mL',
      dType: 'Vaginal, vacuum-assisted', dProvider: 'Dr. Darnell', dRom: 'AROM; clear fluid',
      dComp: 'Shoulder dystocia (left shoulder) — McRoberts and suprapubic pressure; nuchal cord',
      dResus: 'Dried, stimulated, wet towels removed; PPV for 30 seconds', dApgar1: '6', dApgar5: '8',
      iName: 'Baby Boy Sung', iSex: 'Male', iMrn: '201042', iEga: '39 weeks 1 day',
      wt: '4,080 g (9 lb 0 oz)', fPlan: 'Breastfeeding', fFirst: 'Breastfed for 20 minutes'
    };
    const newborn = { chart: 'babyboysung', deliveryPid: 'ameliasung', deliveryEvent: 'sung-delivery', confirmed };
    a.newborn = newborn; b.newborn = newborn;
    // Confirmed newborn facts (source Baby Boy Sung overview).
    b.weightKg = 4.08;
    b.demographics = Object.assign({}, b.demographics, { 'Gestational age': '39 weeks 1 day' });
    b.hpi = b.hpi || '## Patient Overview\n\nBaby Boy Sung — weight 4.08 kg (9 lb 0 oz); gestational age 39 weeks 1 day.\n\n' +
      'Delivered after 3 hours of pushing with vacuum assistance, shoulder dystocia involving the left shoulder (McRoberts and suprapubic pressure), and nuchal cord. ' +
      'Apgar 6 at 1 minute and 8 at 5 minutes; PPV for 30 seconds. Breastfed for 20 minutes. Mother has diet-controlled gestational diabetes and is GBS positive; received one dose of clindamycin. ' +
      'Newborn medications have not yet been given.\n\nMother received one dose of clindamycin before delivery. Clindamycin does not count as adequate GBS prophylaxis, so the infant is observed for signs of early-onset GBS infection per unit protocol.';
  })();
})();
