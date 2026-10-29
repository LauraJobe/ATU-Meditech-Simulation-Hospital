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
      gbs: 'Pos', abx: 'Clindamycin 900 mg IVPB', abxTimes: 'One dose before delivery', diab: 'Yes', diabCtl: 'Diet',
      gravida: '2', para: '1 (before this delivery)', bloodType: 'O positive', anes: 'Epidural', feedPref: 'Breast',
      mOther: 'Clindamycin is not adequate GBS prophylaxis — observe for early-onset GBS per unit protocol. Shoulder dystocia (left shoulder) — McRoberts and suprapubic pressure; nuchal cord; PPV for 30 seconds.',
      obMd: 'Dr. Darnell', ped: 'Dr. Craig', sex: 'Male', delivery: 'Vaginal', useOf: 'Vac', apgar1: '6', apgar5: '8',
      gestDates: '39 weeks 1 day', wtG: '4,080', wtLb: '9', wtOz: '0'
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

    // Baby Boy Sung's clinical documents become charting and orders (Laura Jobe, October 29, 2026):
    //   APGAR, the printable delivery/Ballard PDF, and the glucose monitoring sheet → Worklist assessments (js/views/newborn.js);
    //   the Newborn Glucose Management Policy (and its PDF) → an order set, with the full policy on the orders' P (protocol).
    // The prenatal record stays as a reference document.
    b.documents = (b.documents || []).filter(d => !['babyboysung-d2', 'babyboysung-d4', 'babyboysung-d5', 'babyboysung-d6', 'babyboysung-d7'].includes(d.id));
    b.assessmentForms = ['apgar', 'newborn-delivery', 'ballard', 'newborn-h2t', 'newborn-transition', 'newborn-glucose', 'pain'];
    // The same "Delivery completed" release on Baby Boy Sung's card (either one opens the newborn documentation).
    b.events = (b.events || []).concat([{ id: 'sung-delivery', title: 'Delivery completed — opens newborn documentation on the Worklist (APGAR, Delivery Assessment, Ballard, Head-to-Toe, Transitional Record, Glucose Monitoring)', delivery: true,
      instructorNotes: 'Same release as "Delivery completed" on Amelia Sung\'s card — releasing either one opens the newborn documentation on both Sung charts.' }]);

    // Newborn Glucose Management order set (source: Newborn Glucose Management Policy; Conway Regional glucose management protocol).
    const SET = 'Newborn Glucose Management';
    const gl = (id, cat, text) => ({ id: 'baby-glu-' + id, cat, text, by: 'Dr. Craig', at: -240, set: SET, protocol: 'glucose' });
    b.orders = (b.orders || []).concat([
      gl('screen', 'Nursing', 'Glucose screening for newborns with risk factors (SGA, LGA, IUGR/FGR, late preterm 34–36 weeks, infant of a diabetic parent): heel-stick blood glucose within 30 minutes after feeding.'),
      gl('symptom', 'Nursing', 'Check blood glucose immediately for any sign or symptom of hypoglycemia (jitteriness, irritability, high-pitched cry, apnea, cyanosis, irregular or rapid respirations, hypotonia, seizures, temperature instability, poor suck or feeding).'),
      gl('over40', 'Nursing', 'Asymptomatic with risk factors, BG greater than 40 mg/dL: continue feeding plan. Check BG before feeds every 2–3 hours for 2 more consecutive feeds. Stop checks when BG remains greater than 40 mg/dL before 24 hours of age, or greater than 50 mg/dL from 24–48 hours of age.'),
      gl('25to40', 'Nursing', 'Asymptomatic with risk factors, BG 25–40 mg/dL: give glucose gel (MAR) and refeed. Recheck BG 1 hour after gel. Maximum 3 gel doses in the first 48 hours. Notify provider to initiate IV dextrose when indicated.'),
      gl('under25', 'Nursing', 'Asymptomatic with risk factors, BG less than 25 mg/dL: give glucose gel (MAR), refeed, and notify provider. Recheck BG 1 hour after gel; follow the provider management plan.'),
      gl('sympbg', 'Nursing', 'Symptomatic newborn: BG greater than 45 mg/dL — notify provider of symptoms. BG 45 mg/dL or less — notify provider immediately and obtain a management plan.'),
      gl('serum', 'Lab', 'Heel-stick glucose below 40 mg/dL: obtain serum glucose by venipuncture.'),
      gl('npo', 'Nursing', 'If NPO: continue glucose monitoring every 6 hours after values have stabilized.'),
      gl('iv', 'Nursing', 'IV dextrose only with a separate provider order (see protocol for D10W dosing and monitoring).'),
      gl('doc', 'Nursing', 'Document each check (Worklist → Newborn Glucose Monitoring): risk factor or symptom, feeding, glucose result, collection method, gel or IV treatment and dose, recheck time, provider notification and orders, newborn response.')
    ]);
    const gel = (b.meds || []).find(m => m.id === 'baby-glucose-gel-2');
    if (gel) Object.assign(gel, { dose: 'Weight-based per protocol (see P)', route: 'Buccal', freq: 'PRN BG 25–40 mg/dL (maximum 3 doses in 48 hours)',
      indication: 'Asymptomatic hypoglycemia per the Newborn Glucose Management order set', orderSet: SET, protocol: 'glucose', orderedBy: 'Dr. Craig',
      instructions: 'Gloved finger to the buccal mucosa of each cheek in 0.5 mL increments; massage gently into gums and cheek, alternating sides. Refeed after gel. Recheck BG 1 hour after gel.' });
    b.protocols = Object.assign({}, b.protocols, { glucose: {
      title: 'Newborn Glucose Management Policy',
      items: [
        ['Purpose', 'Prevention, screening, treatment, monitoring, and documentation of neonatal hypoglycemia. Follow the provider\'s orders and notify the provider of any concerning result or change in condition.'],
        ['Hypoglycemia', 'Less than 45 mg/dL in a symptomatic newborn or less than 40 mg/dL in an asymptomatic newborn.'],
        ['LGA / AGA / SGA', 'LGA: 4,000 g or at/above the 90th percentile. AGA: 2,500–4,000 g. SGA: below 2,500 g or at/below the 10th percentile. Macrosomia: birth weight greater than 4,500 g. IUGR/FGR: intrauterine or fetal growth restriction.'],
        ['Prevention', 'Skin-to-skin care after delivery, covering the parent-newborn dyad; monitor temperature and support thermoregulation; offer an early feed during transition (first breastfeeding within 30–60 minutes after birth); frequent feeds for at-risk newborns.'],
        ['Who requires screening', 'SGA, LGA, IUGR/FGR, late preterm (34–36 weeks), or infant of a diabetic parent: screen within 30 minutes after feeding. Any sign or symptom of hypoglycemia: check immediately.'],
        ['Symptoms', 'Jitteriness, irritability, or high-pitched cry; apnea, cyanosis, irregular or rapid respirations; hypotonia or seizures; temperature instability or hypothermia; poor suck, poor feeding, or refusal to eat.'],
        ['Glucose gel', 'Infants greater than 35 weeks who meet criteria, by weight (table below). Pharmacy supplies 2 mL prefilled syringes. Gloved finger to the buccal mucosa of each cheek in 0.5 mL increments, massaging into gums and cheek, alternating sides. Maximum 3 doses in 48 hours. If BG remains below 40 mg/dL after the second dose and a third is needed, notify the pediatrician and initiate IV glucose per provider order. For asymptomatic hypoglycemia only.'],
        ['NPO newborns', 'Continue glucose monitoring every 6 hours after values have stabilized.'],
        ['Heel-stick collection', 'Explain to parent(s); hand hygiene and gloves; position infant securely; select heel site, cleanse with alcohol and air dry; approved lancet; wipe away the first drop; process immediately on the approved monitor and verify patient information; pressure with gauze/bandage; document. Result below 40 mg/dL: serum glucose by venipuncture.'],
        ['IV glucose therapy', 'Only with a provider order. D10W 2 mL/kg IV push, then continuous D10W 3.3 mL/kg/hr (80 mL/kg/day). Recheck BG 15–30 minutes after the bolus; plasma glucose 30–45 minutes after IV therapy begins and 30–45 minutes after any rate change. Keep BG above 45 mg/dL in the first 48 hours, generally not over 90–100 mg/dL. Notify pediatrician for glucose infusion above 12 mg/kg/min or fluids above 160 mL/kg/day (D12.5 order if indicated). Monitor fluid balance. Wean after 6–9 hours in range: decrease by 2 mL/hr and recheck in 3 hours when ordered; do not titrate when BG is 45 mg/dL or lower.'],
        ['Required documentation', 'Risk factor or symptom; feeding and glucose result; collection method; gel or IV treatment and dose; time of recheck; provider notification and orders received; newborn response.'],
        ['References', 'American Academy of Pediatrics, Committee on Fetus and Newborn: neonatal hypoglycemia guidance. Conway Regional Health System, Women\'s and Infants\' Services, Glucose Management Protocol: Newborn (reviewed April 2024).']
      ],
      tables: [
        { title: 'Clinical pathway for glucose management', head: ['Newborn status / result', 'Nursing action', 'Recheck / next step'], rows: [
          ['Asymptomatic, no risk factors', 'No additional glucose action required.', 'Continue routine newborn care.'],
          ['Asymptomatic, risk factors; BG greater than 40 mg/dL', 'Continue feeding plan.', 'Check BG before feeds every 2–3 hours for 2 more consecutive feeds. Stop when BG remains greater than 40 mg/dL before 24 hours of age or greater than 50 mg/dL from 24–48 hours.'],
          ['Asymptomatic, risk factors; BG 25–40 mg/dL', 'Apply glucose gel and refeed.', 'Recheck BG 1 hour after gel. Up to 3 gel doses in the first 48 hours. Notify provider to initiate IV dextrose when indicated.'],
          ['Asymptomatic, risk factors; BG less than 25 mg/dL', 'Apply glucose gel and refeed; notify provider.', 'Recheck BG 1 hour after gel. Follow provider management plan; consider IV dextrose.'],
          ['Symptomatic; BG greater than 45 mg/dL', 'Notify provider of symptoms.', 'Continue provider-directed management.'],
          ['Symptomatic; BG 45 mg/dL or less', 'Notify provider immediately.', 'Obtain management plan; consider IV dextrose.']] },
        { title: 'Glucose gel dose by weight', head: ['Weight', 'Dose'], rows: [
          ['2 kg', '1 mL'], ['2.5 kg', '1.25 mL'], ['3 kg', '1.5 mL'], ['3.5 kg', '1.75 mL'], ['4 kg', '2 mL'], ['4.5 kg', '2.25 mL'], ['5 kg', '2.5 mL']] }
      ],
      signedBy: 'Dr. Craig'
    } });
  })();
})();
