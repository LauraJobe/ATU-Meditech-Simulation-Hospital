/*
 * Orders added to match the ATU faculty handoff "Laura Jobe — All 13 Patients — Barcodes,
 * Medications, Doses" (October 21, 2026). Each entry lists its packet page. Applied on top of
 * js/data/patients.js and js/data/patients-imported.js (the imported file is generated, so these
 * additions live here and survive a re-import). Loaded after both patient files.
 *
 * Wording, dose, route, frequency, and release status follow the packet. "Faculty release pending"
 * orders are scenario events (Instructor Tools → Release Now). Medication package barcodes come from
 * js/data/atu-barcodes.js and are the same for every patient.
 */
(function () {
  'use strict';
  const P = id => (window.SIM_PATIENTS || []).find(p => p.id === id);
  const addMeds = (id, meds) => { const p = P(id); if (p) p.meds = (p.meds || []).concat(meds); };
  const addEvents = (id, events) => { const p = P(id); if (p) p.events = (p.events || []).concat(events); };

  // Amelia Sung (pages 4, 24)
  addMeds('ameliasung', [
    { id: 'amel-epidural', name: 'Bupivacaine / fentanyl epidural infusion', dose: 'Bupivacaine 0.1% with fentanyl 2 mcg/mL at 10 mL/hr', route: 'Epidural',
      freq: 'Continuous — managed by anesthesia', type: 'continuous', rate: '10 mL/hr', orderedBy: 'Dr. Darnell',
      instructions: 'Managed by anesthesia. Post-epidural monitoring per protocol.' }
  ]);
  addEvents('ameliasung', [
    { id: 'amel-hypotension', title: 'Maternal Hypotension / Category II Tracing — Provider Orders', discontinue: ['amel-oxytocin-0'],
      orders: [
        { id: 'amel-hypo-o1', cat: 'Medication', text: 'Discontinue oxytocin (Pitocin). Pitocin remains off during Shift 2.', by: 'Dr. Darnell' },
        { id: 'amel-hypo-o2', cat: 'Nursing', text: 'Position left lateral.', by: 'Dr. Darnell' },
        { id: 'amel-hypo-o3', cat: 'Respiratory', text: 'Oxygen 10 L/min via non-rebreather.', by: 'Dr. Darnell' },
        { id: 'amel-hypo-o4', cat: 'Nursing', text: 'Notify provider and anesthesia.', by: 'Dr. Darnell' }
      ],
      meds: [{ id: 'amel-lr-bolus', name: 'Lactated Ringer’s solution (LR) bolus', dose: '500 mL', route: 'IV bolus', freq: 'Once', type: 'once', doses: [{ at: 0 }], orderedBy: 'Dr. Darnell' }],
      instructorNotes: 'From the ATU packet: after provider notification — discontinue oxytocin; left lateral; LR 500 mL IV bolus once; O2 10 L/min NRB; notify provider and anesthesia.' },
    { id: 'amel-ephedrine', title: 'Ephedrine — Provider Order',
      meds: [{ id: 'amel-ephedrine', name: 'Ephedrine', dose: '5 mg', route: 'IV', freq: 'PRN hypotension not responding to initial measures', type: 'prn',
        indication: 'Hypotension not responding to initial measures', highAlert: true, orderedBy: 'Dr. Darnell',
        instructions: 'High-alert medication; independent verification required.' }] }
  ]);

  // Baby Boy Sung (pages 5, 25) — the order is already on the chart; this adds it to the MAR.
  addMeds('babyboysung', [
    { id: 'baby-hepb', name: 'Hepatitis B vaccine', dose: '0.5 mL', route: 'IM — vastus lateralis (anterolateral thigh)', freq: 'Once, over 2,000 g, with consent',
      type: 'scheduled', doses: [{ time: '13:00' }], orderedBy: 'MD' }
  ]);

  // Fatima Sanogo (pages 7, 28)
  addMeds('fatimasanogo', [
    { id: 'fati-fentanyl', name: 'Fentanyl', dose: '50 mcg', route: 'IV push', freq: 'Every 1 hour PRN pain', type: 'prn', indication: 'Pain', minIntervalHr: 1,
      highAlert: true, preAssess: ['Pain', 'RR', 'SpO2'], orderedBy: 'Dr. Nelson' }
  ]);

  // Stephanie Smith (pages 11, 32) — the IV order is already on the chart; this adds it to the MAR.
  addMeds('stephaniesmith', [
    { id: 'step-d5halfns', name: 'Dextrose 5% in 0.45% sodium chloride (D5 1/2 NS)', dose: '150 mL/hr', route: 'IV infusion', freq: 'Continuous', type: 'continuous', rate: '150 mL/hr', orderedBy: 'Dr. Henderson' }
  ]);
  // The packet's transfusion order is 1 unit (the chart said 2).
  (function () {
    const ev = (P('stephaniesmith') || {}).events && P('stephaniesmith').events.find(e => e.id === 'stephaniesmith-ev3');
    if (!ev) return;
    ev.title = 'Infuse 1 Unit PRBC';
    (ev.orders || []).forEach(o => { if (/PRBC/i.test(o.text)) o.text = 'Infuse 1 unit of packed red blood cells (PRBCs). Complete blood-product verification and transfusion monitoring per protocol.'; });
  })();

  // Carl Shapiro (pages 12, 33–34): ED medication orders, listed as due.
  addMeds('shapiro', [
    { id: 'sha-ed-asa', name: 'Aspirin (chewed)', dose: '325 mg', route: 'PO', freq: 'Once in ED', type: 'once', doses: [{ time: '14:00' }], orderedBy: 'Dr. C. Revis' },
    { id: 'sha-ed-bolus', name: 'Normal saline bolus', dose: '500 mL', route: 'IV bolus', freq: 'Once in ED — after the second nitroglycerin dose', type: 'once', doses: [{ time: '14:00' }], orderedBy: 'Dr. C. Revis' }
  ]);

  // Vernon Watkins (pages 19, 41): infusing at report (prior nurse LB).
  addMeds('watkins', [
    { id: 'wat-ns', name: 'Normal saline', dose: '100 mL/hr', route: 'IV infusion', freq: 'Continuous — 1,000 mL at 100 mL/hr', type: 'continuous', rate: '100 mL/hr',
      started: { time: '10:00', by: 'LB' }, orderedBy: 'Dr. Jack Nelson' }
  ]);
})();
