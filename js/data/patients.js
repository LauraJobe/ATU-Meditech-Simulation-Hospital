/*
 * ATU Simulation Hospital — simulation patients
 * Source: Notion "Level 3 ATU Simulation Hospital" charts.
 *
 * HOW TIMES WORK
 *   Each patient has a scenarioStart clock time (e.g. '10:00'). When the
 *   scenario starts, that patient's chart clock is set to that time and runs
 *   in real time from there. Anything in the chart can be timed with:
 *     time: 'HH:MM'          a clock time on the scenario day
 *     day:  -1               optional: days before (-) or after (+) that day
 *     at:   -30              OR minutes relative to scenario start
 *   Items inside an event (released by the instructor during the scenario)
 *   use "at" = minutes after the moment the event is released (default 0).
 *
 * See docs/ADDING-PATIENTS.md for every field.
 */
window.SIM_PATIENTS = [

  /* ------------------------------------------------------------------ */
  /* LEVEL 3 — MED-SURG: Vincent Brody (COPD exacerbation)               */
  /* ------------------------------------------------------------------ */
  {
    id: 'brody',
    level: 3,
    experiences: ['advms'],
    name: { first: 'Vincent', last: 'Brody' },
    mrn: 'ATU-L3-0628', // not listed in Notion — placeholder for wristband scanning
    dob: '1959-06-28',
    age: '67 years',
    sex: 'M',
    unit: 'Medical-Surgical Unit',
    room: '—',
    service: 'Medicine',
    attending: 'Dr. Janet Jones',
    admitted: { time: '11:00' },
    scenarioStart: '12:00',
    admitDx: 'COPD exacerbation',
    codeStatus: 'Full Code',
    isolation: 'None',
    nkda: true,
    allergies: [],
    heightCm: null,
    weightKg: null,
    flags: ['SpO2 goal 88–92%'],
    vitalRanges: { spo2: [88, 92] },
    assessmentForms: ['wdl-adult', 'pain', 'braden', 'morse'],
    emergencyContact: 'Wife — phone on file',
    demographics: {
      'Marital status': 'Married',
      'Primary language': 'English',
      Race: 'African American',
      Ethnicity: 'Non-Hispanic',
      Occupation: 'Retired businessman',
      Education: 'College degree',
      Insurance: 'Self pay',
      'Cultural considerations': 'None'
    },
    hpi: '67-year-old African American male with a 10-year history of COPD and a 50-year history of smoking 2 packs per day, admitted directly from his primary care provider\'s office earlier today. He was short of breath with a decreased pulse oximetry reading at the office and was sent to the hospital for admission.',
    pmh: ['COPD — 10 years'],
    psh: ['None'],
    familyHx: ['Heart disease — brother, father'],
    socialHx: ['Married; lives with wife; 3 grown children', 'Current smoker: 2 packs per day x 50 years', 'Alcohol: denies', 'Drugs: denies'],
    homeMeds: [{ name: 'Ipratropium inhaler', dose: '1 puff', route: 'Inhaled', freq: 'BID' }],
    ros: [
      ['General', 'Alert, pleasant man, A&O x4'],
      ['Respiratory', 'Productive cough with shortness of breath; barrel chest; clubbing noted to fingers; wheezes throughout'],
      ['Cardiac', 'Regular rate and rhythm; no murmurs or gallops; no peripheral edema'],
      ['GI', 'No nausea, vomiting, diarrhea'],
      ['GU', 'No dysuria or urinary complaints']
    ],
    orders: [
      { id: 'bro-o1', cat: 'Admission', text: 'Admit to Medical-Surgical', time: '11:00', by: 'Dr. Janet Jones' },
      { id: 'bro-o2', cat: 'Admission', text: 'Diagnosis: COPD exacerbation', time: '11:00', by: 'Dr. Janet Jones' },
      { id: 'bro-o3', cat: 'Code Status', text: 'Full Code', time: '11:00', by: 'Dr. Janet Jones' },
      { id: 'bro-o4', cat: 'Diet', text: 'Regular diet', time: '11:00', by: 'Dr. Janet Jones' },
      { id: 'bro-o5', cat: 'Activity', text: 'Up as tolerated', time: '11:00', by: 'Dr. Janet Jones' },
      { id: 'bro-o6', cat: 'Nursing', text: 'Continuous SpO2 monitoring', time: '11:00', by: 'Dr. Janet Jones' },
      { id: 'bro-o7', cat: 'Nursing', text: 'Vital signs every 5 minutes x 3, every 15 minutes x 3, then every 4 hours if stable', time: '11:00', by: 'Dr. Janet Jones' },
      { id: 'bro-o8', cat: 'Respiratory', text: 'Oxygen per nasal cannula @ 2 L/min; titrate O2 for target SpO2 range between 88–92%', time: '11:00', by: 'Dr. Janet Jones' },
      { id: 'bro-o9', cat: 'Nursing', text: 'I & O every 4 hours', time: '11:00', by: 'Dr. Janet Jones' },
      { id: 'bro-o10', cat: 'Lab', text: 'CBC, BMP, BNP, Troponin, CK-MB, ABG', time: '11:00', by: 'Dr. Janet Jones' },
      { id: 'bro-o11', cat: 'Imaging', text: 'Portable chest X-ray (PA)', time: '11:00', by: 'Dr. Janet Jones' },
      { id: 'bro-o12', cat: 'IV Fluids', text: 'D5 1/2 NS with 20 mEq KCl @ 50 mL/hr', time: '11:00', by: 'Dr. Janet Jones' },
      { id: 'bro-o13', cat: 'Respiratory', text: 'Incentive spirometry every 2 hours while awake', time: '11:00', by: 'Dr. Janet Jones' }
    ],
    meds: [
      { id: 'bro-ivf', name: 'D5 1/2 NS with 20 mEq KCl', dose: '50 mL/hr', route: 'IV', freq: 'Continuous', type: 'continuous', rate: '50 mL/hr' },
      { id: 'bro-albuterol', name: 'Albuterol 2.5 mg in 3 mL NS', dose: '2.5 mg', route: 'Nebulizer', freq: 'Every 4 hours — per RT', type: 'scheduled', preAssess: ['HR', 'RR', 'SpO2'], doses: [{ time: '12:00' }, { time: '16:00' }, { time: '20:00' }] },
      { id: 'bro-ipratropium', name: 'Ipratropium', dose: '0.5 mg', route: 'Nebulizer', freq: 'Every 8 hours — per RT', type: 'scheduled', doses: [{ time: '12:00' }, { time: '20:00' }] },
      { id: 'bro-prednisone', name: 'Prednisone', dose: '40 mg', route: 'PO', freq: 'Daily x 5 days', type: 'scheduled', instructions: 'Scheduled daily at 0900. First dose due on admission.', doses: [{ time: '12:00' }, { time: '09:00', day: 1 }] }
    ],
    vitals: [
      { time: '11:00', temp: 99.5, tempRoute: 'Oral', hr: 92, rr: 28, sbp: 142, dbp: 84, spo2: 83, o2: 'Room air', pain: 0, note: 'Admit', by: 'Admitting RN' },
      { time: '11:05', temp: 99.5, tempRoute: 'Oral', hr: 90, rr: 24, sbp: 145, dbp: 90, spo2: 90, o2: 'Nasal cannula', o2Flow: 2, pain: 0, by: 'Admitting RN' },
      { time: '11:10', temp: 99.5, tempRoute: 'Oral', hr: 98, rr: 20, sbp: 135, dbp: 80, spo2: 92, o2: 'Nasal cannula', o2Flow: 2, pain: 0, by: 'Admitting RN' },
      { time: '11:15', temp: 99.5, tempRoute: 'Oral', hr: 96, rr: 22, sbp: 137, dbp: 79, spo2: 92, o2: 'Nasal cannula', o2Flow: 2, pain: 0, by: 'Admitting RN' },
      { time: '11:25', temp: 99.5, tempRoute: 'Oral', hr: 98, rr: 20, sbp: 133, dbp: 76, spo2: 93, o2: 'Nasal cannula', o2Flow: 2, pain: 0, by: 'Admitting RN' },
      { time: '11:40', temp: 99.5, tempRoute: 'Oral', hr: 95, rr: 18, sbp: 135, dbp: 81, spo2: 92, o2: 'Nasal cannula', o2Flow: 2, pain: 0, by: 'Admitting RN' },
      { time: '11:55', temp: 99.5, tempRoute: 'Oral', hr: 90, rr: 18, sbp: 134, dbp: 82, spo2: 92, o2: 'Nasal cannula', o2Flow: 2, pain: 0, by: 'Admitting RN' }
    ],
    labs: [],
    labsPending: 'Admission labs (CBC, BMP, BNP, troponin, CK-MB, ABG) are in the Notion PDF "Brody_Labs.pdf" and have not been entered here yet.',
    imaging: [],
    notes: [
      { id: 'bro-n1', type: 'History & Physical', author: 'Dr. Janet Jones', time: '11:15', text: 'CHIEF COMPLAINT: Shortness of breath.\n\nHPI: 67-year-old African American male with a 10-year history of COPD and a 50-year history of 2 pack per day smoking, admitted after being seen at his primary care office earlier today. He was having shortness of breath and decreased pulse oximetry at the provider\'s office and was sent to the hospital for admission.\n\nREVIEW OF SYSTEMS / ASSESSMENT:\nGeneral: Alert, pleasant man, AOx4.\nRespiratory: Productive cough with shortness of breath, barrel chest, clubbing noted to fingers, wheezes throughout.\nCardiac: Regular rate and rhythm, no murmurs or gallops. No peripheral edema.\nGI: No nausea, vomiting, diarrhea.\nGU: No dysuria or urinary complaints.\n\nLABS: CBC, BMP, BNP, troponin pending.' }
    ],
    io: [],
    events: []
  },

  /* ------------------------------------------------------------------ */
  /* LEVEL 3 — ORTHO / ICU: Ruth Livingston                              */
  /* ------------------------------------------------------------------ */
  {
    id: 'livingston',
    level: 3,
    experiences: ['icu'],
    name: { first: 'Ruth', last: 'Livingston' },
    mrn: 'ATU-L3-1008', // not listed in Notion — placeholder for wristband scanning
    dob: '1945-10-08',
    age: '80 years',
    sex: 'F',
    unit: 'Orthopedic Med-Surg Unit',
    room: '—',
    service: 'Orthopedics',
    attending: 'Dr. Marcus',
    admitted: { time: '08:00', day: -6 },
    scenarioStart: '09:30',
    admitDx: 'Post-op ORIF right hip (POD 5) — right femoral neck fracture after fall at home',
    codeStatus: 'Full Code',
    advanceDirective: 'None',
    isolation: 'None',
    nkda: true,
    allergies: [],
    heightCm: null,
    weightKg: null,
    flags: ['Fall Risk'],
    assessmentForms: ['wdl-adult', 'pain', 'braden', 'morse', 'gcs'],
    emergencyContact: 'Daughter — phone on file',
    demographics: {
      'Marital status': 'Widow',
      'Primary language': 'English',
      Race: 'White',
      Ethnicity: 'Non-Hispanic',
      Occupation: 'Retired',
      Education: 'Master of Economics',
      Insurance: 'Self pay',
      'Cultural considerations': 'None'
    },
    hpi: '80-year-old female admitted 6 days ago through the emergency department for a right femoral neck fracture after falling at home. She is now 5 days post-op from an open reduction internal fixation (ORIF) of the right hip on the orthopedic-surgical unit.',
    pmh: ['Osteoporosis'],
    psh: ['ORIF right hip — this admission (POD 5)'],
    familyHx: ['Genetic disorders: none', 'Birth defects: none', 'Other relevant history: none'],
    socialHx: ['Lives with daughter and son-in-law', 'Denies drug, alcohol, and nicotine use'],
    homeMeds: [{ name: 'Alendronate sodium with calcium', dose: '', route: 'PO', freq: 'As prescribed' }],
    orders: [
      { id: 'liv-o1', cat: 'Admission', text: 'Admit to Medical-Surgical Orthopedic Unit', time: '08:00', day: -5, by: 'Dr. Marcus' },
      { id: 'liv-o2', cat: 'Admission', text: 'Diagnosis: Post-op open reduction internal fixation (ORIF)', time: '08:00', day: -5, by: 'Dr. Marcus' },
      { id: 'liv-o3', cat: 'Code Status', text: 'Full Code', time: '08:00', day: -5, by: 'Dr. Marcus' },
      { id: 'liv-o4', cat: 'Diet', text: 'Regular diet', time: '08:00', day: -5, by: 'Dr. Marcus' },
      { id: 'liv-o5', cat: 'Activity', text: 'Up with assistance; place SCDs when in bed', time: '08:00', day: -5, by: 'Dr. Marcus' },
      { id: 'liv-o6', cat: 'Consult', text: 'PT: full weight bearing; gait training with walker', time: '08:00', day: -5, by: 'Dr. Marcus' },
      { id: 'liv-o7', cat: 'Respiratory', text: 'Administer supplemental O2 to keep SpO2 > 93%', time: '08:00', day: -5, by: 'Dr. Marcus' },
      { id: 'liv-o8', cat: 'Nursing', text: 'Vital signs every 4 hours and PRN', time: '08:00', day: -5, by: 'Dr. Marcus' },
      { id: 'liv-o9', cat: 'Nursing', text: 'I & O every 4 hours', time: '08:00', day: -5, by: 'Dr. Marcus' },
      { id: 'liv-o10', cat: 'Nursing', text: 'Bladder scan every shift & PRN signs/symptoms of urinary retention', time: '08:00', day: -5, by: 'Dr. Marcus' },
      { id: 'liv-o11', cat: 'Nursing', text: 'Sterile dressing change to right hip daily', time: '08:00', day: -5, by: 'Dr. Marcus' },
      { id: 'liv-o12', cat: 'Lab', text: 'BMP, CBC, lactate level', time: '08:00', day: -5, by: 'Dr. Marcus' },
      { id: 'liv-o13', cat: 'Nursing', text: 'Notify provider: SBP < 100 or > 160, HR < 55 or > 110, SpO2 < 90%', time: '08:00', day: -5, by: 'Dr. Marcus' }
    ],
    meds: [
      { id: 'liv-lr', name: 'Lactated Ringer\'s', dose: '75 mL/hr', route: 'IV', freq: 'Continuous', type: 'continuous', rate: '75 mL/hr', started: { time: '08:00', by: 'LJ' } },
      { id: 'liv-docusate', name: 'Docusate sodium', dose: '100 mg', route: 'PO', freq: 'BID', type: 'scheduled', doses: [{ time: '09:00', given: 'LJ' }, { time: '21:00' }] },
      { id: 'liv-enox', name: 'Enoxaparin sodium', dose: '40 mg', route: 'Subcut', freq: 'Daily', type: 'scheduled', indication: 'VTE prophylaxis', highAlert: true, doses: [{ time: '17:00' }] },
      { id: 'liv-piptazo', name: 'Piperacillin-tazobactam', dose: '450 mg', route: 'IVPB', freq: 'Every 8 hours', type: 'scheduled', tags: ['penicillin'], doses: [{ time: '06:00', given: 'LJ' }, { time: '14:00' }, { time: '22:00' }] },
      { id: 'liv-caco3', name: 'Calcium carbonate', dose: '650 mg', route: 'PO', freq: 'Daily', type: 'scheduled', doses: [{ time: '09:00', given: 'LJ' }] },
      { id: 'liv-alendronate', name: 'Alendronate', dose: '70 mg', route: 'PO', freq: 'Weekly on Wednesdays', type: 'scheduled', weekday: 3, instructions: 'Give only on Wednesdays. Give with a full glass of plain water at least 30 minutes before food, drink, or other medications; patient must remain upright for 30 minutes.', doses: [{ time: '09:00' }] },
      { id: 'liv-oxy', name: 'Oxycodone', dose: '15 mg', route: 'PO', freq: 'Every 4 hours PRN', type: 'prn', indication: 'Pain', minIntervalHr: 4, highAlert: true, preAssess: ['Pain', 'RR', 'SpO2'], lastGiven: { time: '02:00', by: 'LJ' } },
      { id: 'liv-apap', name: 'Acetaminophen', dose: '650 mg', route: 'PO', freq: 'Every 6 hours PRN', type: 'prn', indication: 'Temp > 101 °F', minIntervalHr: 6, preAssess: ['Temp'], lastGiven: { time: '06:00', by: 'LJ' } },
      { id: 'liv-ketorolac', name: 'Ketorolac', dose: '30 mg', route: 'IV push', freq: 'Every 6 hours PRN', type: 'prn', indication: 'Pain', instructions: 'Not to exceed 120 mg daily.', minIntervalHr: 6, preAssess: ['Pain'] }
    ],
    vitals: [],
    labs: [],
    labsPending: 'Lab results are in the Notion PDF "Ruth_Livingston_lab_1.pdf" and have not been entered here yet. A repeat urinalysis was sent at 0600 and is pending.',
    imaging: [],
    notes: [
      { id: 'liv-n1', type: 'Nursing Note', author: 'VR, RN', time: '06:00', text: 'Patient started yelling and was found confused in bed with the indwelling catheter lying on the floor. The patient has been incontinent. Scant urethral bleeding and minimal external trauma were noted. Received a complete bath and linen change. A repeat urinalysis was sent to lab and is pending.' }
    ],
    io: [],
    events: [
      {
        id: 'liv-icu',
        title: 'Change in condition — Transfer to ICU (ICU Orders)',
        instructorNotes: 'From the Notion "ICU Orders" page. BMP, CBC, and lactate are to be drawn BEFORE IV antibiotics are started. Norepinephrine is conditional: start only if MAP < 65 or SBP < 100 AFTER the fluid bolus.',
        patch: { unit: 'Intensive Care Unit', room: '—' },
        discontinue: ['liv-lr', 'liv-piptazo'],
        orders: [
          { id: 'liv-icu-o1', cat: 'Admission', text: 'Transfer to ICU', by: 'Dr. Marcus' },
          { id: 'liv-icu-o2', cat: 'Activity', text: 'Bed rest', by: 'Dr. Marcus' },
          { id: 'liv-icu-o3', cat: 'Nursing', text: 'Continuous ECG and pulse oximetry monitoring', by: 'Dr. Marcus' },
          { id: 'liv-icu-o4', cat: 'Consult', text: 'Physical Therapy: evaluate for passive ROM; advance when able', by: 'Dr. Marcus' },
          { id: 'liv-icu-o5', cat: 'Respiratory', text: 'Administer supplemental O2 to keep SpO2 > 93%', by: 'Dr. Marcus' },
          { id: 'liv-icu-o6', cat: 'Nursing', text: 'Vital signs every 15 minutes and PRN; I&O every 4 hours', by: 'Dr. Marcus' },
          { id: 'liv-icu-o7', cat: 'IV Fluids', text: 'Normal saline bolus 500 mL over 30 minutes STAT', priority: 'STAT', by: 'Dr. Marcus' },
          { id: 'liv-icu-o8', cat: 'Medication', text: 'After fluid bolus, if MAP < 65 or SBP < 100 start: Norepinephrine (Levophed) @ 2 mcg/min continuous IV; titrate by 2 mcg every 5 minutes to maintain MAP > 65 or SBP > 100. Maximum dose 30 mcg/min.', by: 'Dr. Marcus' },
          { id: 'liv-icu-o9', cat: 'Nursing', text: 'Place Foley catheter', by: 'Dr. Marcus' },
          { id: 'liv-icu-o10', cat: 'Nursing', text: 'Sterile dressing change to right hip every 12 hours', by: 'Dr. Marcus' },
          { id: 'liv-icu-o11', cat: 'Lab', text: 'BMP, CBC, lactate level prior to starting IV antibiotics', priority: 'STAT', by: 'Dr. Marcus' },
          { id: 'liv-icu-o12', cat: 'IV Fluids', text: 'DC Lactated Ringer\'s IV @ 75 mL/hr', by: 'Dr. Marcus' },
          { id: 'liv-icu-o13', cat: 'Medication', text: 'DC piperacillin-tazobactam 450 mg IV every 8 hours', by: 'Dr. Marcus' },
          { id: 'liv-icu-o14', cat: 'IV Fluids', text: 'NS @ 125 mL/hr after bolus completed', by: 'Dr. Marcus' },
          { id: 'liv-icu-o15', cat: 'Medication', text: 'Vancomycin 500 mg/250 mL IVPB every 8 hours (over 2 hours)', by: 'Dr. Marcus' }
        ],
        meds: [
          { id: 'liv-nsbolus', name: '0.9% Sodium chloride bolus', dose: '500 mL', route: 'IV', freq: 'Once — over 30 minutes STAT', type: 'continuous', rate: '1,000 mL/hr x 30 min', instructions: 'Infuse 500 mL over 30 minutes STAT. Start NS @ 125 mL/hr after the bolus is completed.' },
          { id: 'liv-ns125', name: '0.9% Sodium chloride', dose: '125 mL/hr', route: 'IV', freq: 'Continuous — after bolus completed', type: 'continuous', rate: '125 mL/hr' },
          { id: 'liv-levo', name: 'Norepinephrine (Levophed)', dose: '2 mcg/min — titrate', route: 'IV', freq: 'Continuous — conditional', type: 'continuous', highAlert: true, rate: '2 mcg/min', preAssess: ['SBP', 'DBP', 'HR'], instructions: 'Start ONLY if MAP < 65 or SBP < 100 after the fluid bolus. Titrate by 2 mcg every 5 minutes to maintain MAP > 65 or SBP > 100. Maximum dose 30 mcg/min.' },
          { id: 'liv-vanco', name: 'Vancomycin', dose: '500 mg/250 mL', route: 'IVPB', freq: 'Every 8 hours — over 2 hours', type: 'scheduled', instructions: 'Infuse over 2 hours. Draw BMP, CBC, and lactate BEFORE the first dose.', doses: [{ at: 15 }, { at: 495 }] }
        ]
      }
    ]
  },

  /* ------------------------------------------------------------------ */
  /* LEVEL 3 — PROGRESSIVE CARE: Carl Shapiro (NSTEMI)                   */
  /* ------------------------------------------------------------------ */
  {
    id: 'shapiro',
    level: 3,
    experiences: ['icu'],
    name: { first: 'Carl', last: 'Shapiro' },
    mrn: 'PCS71900',
    dob: '1972-07-19',
    age: '54 years',
    sex: 'M',
    unit: 'Intensive Care Unit',
    room: '—',
    service: 'Cardiology',
    attending: 'Dr. Chin A. Revis',
    admitted: { time: '12:00' },
    scenarioStart: '14:00',
    admitDx: 'NSTEMI (NSTE-ACS)',
    codeStatus: 'Full Code',
    isolation: 'Standard',
    nkda: true,
    allergies: [],
    heightCm: 175,
    weightKg: 110,
    flags: ['Continuous ECG', 'Anticoagulated'],
    assessmentForms: ['wdl-adult', 'pain', 'braden', 'morse'],
    emergencyContact: 'Not documented',
    demographics: {
      'Primary language': 'English',
      Race: 'White',
      Ethnicity: 'Non-Hispanic',
      Occupation: 'Businessman (travels for work)',
      Education: 'College degree',
      Insurance: 'Self pay',
      'Cultural considerations': 'None'
    },
    hpi: '54-year-old male who presented to the Emergency Department a couple of hours ago by ambulance with complaints of chest pain, diaphoresis, and shortness of breath. Initial ECG shows sinus tachycardia with some PVCs and no ST elevation. Initial troponin slightly elevated. Admitted to the Intensive Care Unit for NSTEMI.',
    pmh: ['Hypertension'],
    psh: ['None'],
    familyHx: ['None'],
    socialHx: ['Businessman; travels for work', 'Smokes < 1/2 pack per day', 'Drinks alcohol occasionally'],
    homeMeds: [{ name: '"Water pill" (diuretic — name not known)', dose: '', route: 'PO', freq: '' }],
    orders: [
      { id: 'sha-o1', cat: 'Admission', text: 'Transfer to Intensive Care Unit', time: '12:00', by: 'Dr. C. Revis' },
      { id: 'sha-o2', cat: 'Nursing', text: 'Vital signs every 2 hours', time: '12:00', by: 'Dr. C. Revis' },
      { id: 'sha-o3', cat: 'Nursing', text: 'Continuous ECG and SpO2 monitoring', time: '12:00', by: 'Dr. C. Revis' },
      { id: 'sha-o4', cat: 'Respiratory', text: 'Oxygen for SpO2 less than 90% or respiratory distress', time: '12:00', by: 'Dr. C. Revis' },
      { id: 'sha-o5', cat: 'Activity', text: 'Bed/chair rest', time: '12:00', by: 'Dr. C. Revis' },
      { id: 'sha-o6', cat: 'Diet', text: 'Heart healthy', time: '12:00', by: 'Dr. C. Revis' },
      { id: 'sha-o7', cat: 'IV Fluids', text: 'Normal saline at 25 mL/hr', time: '12:00', by: 'Dr. C. Revis' },
      { id: 'sha-o8', cat: 'Lab', text: 'Repeat troponin I at arrival to unit and 3 hours after', time: '12:00', by: 'Dr. C. Revis' },
      { id: 'sha-o9', cat: 'Diagnostics', text: '12-lead ECG for chest pain and immediately notify provider', time: '12:00', by: 'Dr. C. Revis' }
    ],
    meds: [
      { id: 'sha-ns', name: 'Normal saline', dose: '25 mL/hr', route: 'IV', freq: 'Continuous', type: 'continuous', rate: '25 mL/hr', started: { time: '12:30', by: 'LJ' } },
      { id: 'sha-asa', name: 'Aspirin', dose: '81 mg', route: 'PO', freq: 'Daily — start tomorrow', type: 'scheduled', doses: [{ time: '09:00', day: 1 }] },
      { id: 'sha-tica-load', name: 'Ticagrelor (loading dose)', dose: '180 mg', route: 'PO', freq: 'Once today', type: 'once', highAlert: true, instructions: 'Loading dose x1 today, then 90 mg twice daily.', doses: [{ at: 0 }] },
      { id: 'sha-tica', name: 'Ticagrelor', dose: '90 mg', route: 'PO', freq: 'BID — start tomorrow AM', type: 'scheduled', doses: [{ time: '09:00', day: 1 }, { time: '21:00', day: 1 }] },
      { id: 'sha-enox', name: 'Enoxaparin', dose: '110 mg', route: 'Subcut', freq: 'Every 12 hours', type: 'scheduled', highAlert: true, preAssess: ['lab:Platelets'], doses: [{ time: '12:30', given: 'CR (ER)' }, { time: '21:00' }] },
      { id: 'sha-ntg', name: 'Nitroglycerin', dose: '0.4 mg', route: 'Sublingual', freq: 'Every 5 minutes PRN x 3 doses', type: 'prn', indication: 'Chest pain', preAssess: ['Pain', 'SBP', 'HR'], instructions: 'For chest pain, obtain 12-lead ECG and notify provider immediately to evaluate for IV nitroglycerin.' }
    ],
    vitals: [
      { time: '11:30', temp: 98.4, tempRoute: 'Oral', hr: 120, rr: 24, sbp: 158, dbp: 92, spo2: 89, o2: 'Room air', pain: 7, note: 'ER arrival', by: 'ER RN' },
      { time: '11:45', temp: 98.2, tempRoute: 'Oral', hr: 102, rr: 20, sbp: 96, dbp: 50, spo2: 90, o2: 'Nasal cannula', o2Flow: 2, pain: 6, by: 'ER RN' },
      { time: '12:00', temp: 98.2, tempRoute: 'Oral', hr: 104, rr: 18, sbp: 122, dbp: 83, spo2: 93, o2: 'Nasal cannula', o2Flow: 2, pain: 1, by: 'ER RN' },
      { time: '12:15', temp: 98.4, tempRoute: 'Oral', hr: 100, rr: 16, sbp: 120, dbp: 82, spo2: 93, o2: 'Nasal cannula', o2Flow: 2, pain: 0, by: 'ER RN' },
      { time: '12:30', temp: 98.4, tempRoute: 'Oral', hr: 101, rr: 16, sbp: 125, dbp: 75, spo2: 93, o2: 'Nasal cannula', o2Flow: 2, pain: 0, by: 'ER RN' }
    ],
    labs: [
      { id: 'sha-cbc', panel: 'Complete Blood Count', time: '12:50', results: [
        { t: 'Hgb', v: 14, u: 'g/dL', lo: 13.5, hi: 17.5 },
        { t: 'HCT', v: 44, u: '%', lo: 40, hi: 45 },
        { t: 'WBC', v: 8.2, u: 'x10⁹/L', lo: 5, hi: 11 },
        { t: 'Platelets', v: 295, u: 'x10⁹/L', lo: 150, hi: 400 }
      ] },
      { id: 'sha-bmp', panel: 'Basic Metabolic Panel', time: '12:50', results: [
        { t: 'Sodium', v: 140, u: 'mEq/L', lo: 135, hi: 145 },
        { t: 'Potassium', v: 3.8, u: 'mEq/L', lo: 3.5, hi: 5.1 },
        { t: 'Chloride', v: 96, u: 'mEq/L', lo: 98, hi: 106 },
        { t: 'HCO3', v: 22, u: 'mEq/L', lo: 22, hi: 26 },
        { t: 'BUN', v: 23, u: 'mg/dL', lo: 8, hi: 23 },
        { t: 'Creatinine', v: 1.1, u: 'mg/dL', lo: 0.6, hi: 1.1 },
        { t: 'Glucose', v: 122, u: 'mg/dL', lo: 70, hi: 110 }
      ] },
      { id: 'sha-misc', panel: 'Coagulation & Cardiac', time: '12:50', results: [
        { t: 'INR', v: 0.9, u: '', lo: 0.8, hi: 1.1 },
        { t: 'aPTT', v: 30, u: 's', lo: 25, hi: 40 },
        { t: 'Troponin I', v: 0.06, u: 'ng/mL', ref: '≤ 0.04', flag: 'H' },
        { t: 'BNP', v: 78, u: 'pg/mL', ref: '< 100' }
      ] },
      { id: 'sha-trop2', panel: 'Troponin I (repeat — arrival to unit)', time: '13:00', results: [
        { t: 'Troponin I', v: 'Pending', ref: '≤ 0.04' }
      ] }
    ],
    imaging: [
      { id: 'sha-ecg', study: '12-Lead ECG (ER)', time: '11:35', text: 'No ST elevation noted. Sinus tachycardia with some PVCs.' }
    ],
    notes: [
      { id: 'sha-n1', type: 'ER Note', author: 'Dr. Williams (ER)', time: '11:40', text: 'CHIEF COMPLAINT: Chest pain, diaphoresis, and shortness of breath.\n\nHPI: Mr. Shapiro presents to the ER with complaints of chest pain, diaphoresis, and shortness of breath.\nPMH: No history of surgeries. History of hypertension.\nFamily history: None. Allergies: NKDA.\nSocial: Businessman; travels for work; smokes < 1/2 pack/day; drinks alcohol occasionally.\n\nROS: General — cooperative, pleasant. CV — no palpitations, some chest pain. Resp — shortness of breath. GI/GU — no nausea, vomiting, or abdominal pain. MSK — no pain, ROM WDL. Neuro — no headache, no focal deficits.\n\nEXAM: Appears uncomfortable, in moderate distress due to pain of 9/10. T 98.7 °F, HR 101, RR 20, BP 140/84, SpO2 97% RA. HEENT: no oropharyngeal lesions; no cervical lymphadenopathy. Resp: clear bilaterally, regular rate, equal expansion. CV: S1 S2 RR, no murmurs/gallops; diaphoretic; chest pain 9/10; no peripheral edema; CR < 3 sec all extremities. Abd: soft, round, non-tender; active bowel sounds x4. MSK: no joint swelling or erythema. Neuro: no focal deficits.\n\nLABS/IMAGING: CBC, BMP, troponin pending. 12-lead ECG: no ST elevation; sinus tachycardia with some PVCs.\n\nPLAN: Consult cardiology.' },
      { id: 'sha-n2', type: 'Cardiology Admit Note', author: 'Dr. C. Revis', time: '12:00', text: 'ASSESSMENT: Carl Shapiro is a 54-year-old male with a history of hypertension who presents to the ER with complaints of chest pain, diaphoresis, and shortness of breath. Initial ECG shows sinus tachycardia with some PVCs. Initial troponin slightly elevated.\n\nPLAN:\n1. Admission: NSTEMI — admit to Intensive Care Unit.\n2. Medication: continue home medications.\n3. Labs: trend troponins.' },
      { id: 'sha-n3', type: 'Nursing Note', author: 'LJ, RN', time: '12:30', text: 'Pt arrived in ER complaining of chest pain. He came to the ED by ambulance when the symptoms began. No family is present. He was treated with oxygen 2 L via nasal cannula, aspirin, two doses of sublingual nitroglycerin, and a normal saline bolus required after the second dose of nitroglycerin with no recurrent chest pain. 12-lead ECG in ED showed no ST elevation. Antiplatelet and anticoagulation meds were started and documented in the MAR.' }
    ],
    io: [],
    events: [
      {
        id: 'sha-trop',
        title: 'Repeat troponin I resulted',
        instructorNotes: 'From Notion "Lab Results (Shapiro new)". Troponin I rising 0.06 → 0.1 ng/mL.',
        labs: [
          { id: 'sha-trop2r', panel: 'Troponin I (repeat)', results: [
            { t: 'Troponin I', v: 0.1, u: 'ng/mL', ref: '≤ 0.04', flag: 'H' }
          ] }
        ]
      }
    ]
  },

  /* ------------------------------------------------------------------ */
  /* LEVEL 3 — PROGRESSIVE CARE: Karl Sharp (NSTEMI, DNR)                */
  /* Look-alike / sound-alike partner of Carl Shapiro (same DOB).        */
  /* ------------------------------------------------------------------ */
  {
    id: 'sharp',
    level: 3,
    experiences: ['advms'],
    name: { first: 'Karl', last: 'Sharp' },
    mrn: 'PCS71901', // Notion lab sheet shows PCS71900 (same as Shapiro) — changed so wristband scanning can tell them apart
    dob: '1962-07-19',
    age: '64 years',
    sex: 'M',
    unit: 'Progressive Care Unit',
    room: '—',
    service: 'Cardiology',
    attending: 'Dr. Chin A. Revis',
    admitted: { time: '12:00' },
    scenarioStart: '14:00',
    admitDx: 'NSTEMI (NSTE-ACS)',
    codeStatus: 'DNR',
    advanceDirective: 'DNR',
    isolation: 'Standard',
    nkda: true,
    allergies: [],
    heightCm: 175,
    weightKg: 110,
    flags: ['DNR', 'Continuous ECG'],
    assessmentForms: ['wdl-adult', 'pain', 'braden', 'morse'],
    emergencyContact: 'Not documented',
    demographics: {
      'Primary language': 'English',
      Race: 'White',
      Ethnicity: 'Non-Hispanic',
      Occupation: 'Businessman (travels for work)',
      Education: 'College degree',
      Insurance: 'Self pay',
      'Cultural considerations': 'None'
    },
    hpi: '64-year-old male who presented to the Emergency Department a couple of hours ago by ambulance with complaints of chest pain, diaphoresis, and shortness of breath. Initial ECG shows sinus tachycardia with some PVCs and no ST elevation. Initial troponin slightly elevated. Admitted to the Progressive Care Unit for NSTEMI.',
    pmh: ['Hypertension'],
    psh: ['None'],
    familyHx: ['None'],
    socialHx: ['Businessman; travels for work', 'Smokes < 1/2 pack per day', 'Drinks alcohol occasionally'],
    homeMeds: [{ name: '"Water pill" (diuretic — name not known)', dose: '', route: 'PO', freq: '' }],
    orders: [
      { id: 'shp-o1', cat: 'Admission', text: 'Transfer to Progressive Care Unit', time: '12:00', by: 'Dr. C. Revis' },
      { id: 'shp-o0', cat: 'Code Status', text: 'DNR', time: '12:00', by: 'Dr. C. Revis' },
      { id: 'shp-o2', cat: 'Nursing', text: 'Vital signs every 2 hours', time: '12:00', by: 'Dr. C. Revis' },
      { id: 'shp-o3', cat: 'Nursing', text: 'Continuous ECG and SpO2 monitoring', time: '12:00', by: 'Dr. C. Revis' },
      { id: 'shp-o4', cat: 'Respiratory', text: 'Oxygen for SpO2 less than 90% or respiratory distress', time: '12:00', by: 'Dr. C. Revis' },
      { id: 'shp-o5', cat: 'Activity', text: 'Bed/chair rest', time: '12:00', by: 'Dr. C. Revis' },
      { id: 'shp-o6', cat: 'Diet', text: 'Heart healthy', time: '12:00', by: 'Dr. C. Revis' },
      { id: 'shp-o7', cat: 'IV Fluids', text: 'Normal saline at 25 mL/hr', time: '12:00', by: 'Dr. C. Revis' },
      { id: 'shp-o8', cat: 'Lab', text: 'Repeat troponin I at arrival to unit and 3 hours after', time: '12:00', by: 'Dr. C. Revis' },
      { id: 'shp-o9', cat: 'Diagnostics', text: '12-lead ECG for chest pain and immediately notify provider', time: '12:00', by: 'Dr. C. Revis' }
    ],
    meds: [
      { id: 'shp-ns', name: 'Normal saline', dose: '25 mL/hr', route: 'IV', freq: 'Continuous', type: 'continuous', rate: '25 mL/hr', started: { time: '12:30', by: 'LJ' } },
      { id: 'shp-asa', name: 'Aspirin', dose: '81 mg', route: 'PO', freq: 'Daily — start in AM', type: 'scheduled', doses: [{ time: '09:00', day: 1 }] },
      { id: 'shp-tica', name: 'Ticagrelor', dose: '90 mg', route: 'PO', freq: 'BID — start in AM', type: 'scheduled', doses: [{ time: '09:00', day: 1 }, { time: '21:00', day: 1 }] },
      { id: 'shp-enox', name: 'Enoxaparin', dose: '110 mg', route: 'Subcut', freq: 'Every 12 hours', type: 'scheduled', highAlert: true, preAssess: ['lab:Platelets'], doses: [{ time: '12:30', given: 'CR (ER)' }, { time: '21:00' }] },
      { id: 'shp-ntg', name: 'Nitroglycerin', dose: '0.4 mg', route: 'Sublingual', freq: 'Every 5 minutes PRN x 3 doses', type: 'prn', indication: 'Chest pain', preAssess: ['Pain', 'SBP', 'HR'], instructions: 'For chest pain, obtain 12-lead ECG and notify provider immediately to evaluate for IV nitroglycerin.', lastGiven: { time: '11:40', by: 'ER RN' } },
      { id: 'shp-er-tica', name: 'Ticagrelor (loading dose)', dose: '180 mg', route: 'PO', freq: 'Once', type: 'once', doses: [{ time: '11:45', given: 'Given in ER' }] },
      { id: 'shp-er-asa', name: 'Aspirin (chewed)', dose: '325 mg', route: 'PO', freq: 'Once', type: 'once', doses: [{ time: '11:35', given: 'Given in ER' }] },
      { id: 'shp-er-bolus', name: 'Normal saline bolus', dose: '500 mL', route: 'IV', freq: 'Once', type: 'once', doses: [{ time: '11:50', given: 'Given in ER' }] }
    ],
    vitals: [
      { time: '11:30', temp: 98.4, tempRoute: 'Oral', hr: 120, rr: 24, sbp: 158, dbp: 92, spo2: 89, o2: 'Room air', pain: 7, note: 'ER arrival', by: 'ER RN' },
      { time: '11:45', temp: 98.2, tempRoute: 'Oral', hr: 102, rr: 20, sbp: 96, dbp: 50, spo2: 90, o2: 'Nasal cannula', o2Flow: 2, pain: 6, by: 'ER RN' },
      { time: '12:00', temp: 98.2, tempRoute: 'Oral', hr: 104, rr: 18, sbp: 122, dbp: 83, spo2: 93, o2: 'Nasal cannula', o2Flow: 2, pain: 1, by: 'ER RN' },
      { time: '12:15', temp: 98.4, tempRoute: 'Oral', hr: 100, rr: 16, sbp: 120, dbp: 82, spo2: 93, o2: 'Nasal cannula', o2Flow: 2, pain: 0, by: 'ER RN' },
      { time: '12:30', temp: 98.4, tempRoute: 'Oral', hr: 101, rr: 16, sbp: 125, dbp: 75, spo2: 93, o2: 'Nasal cannula', o2Flow: 2, pain: 0, by: 'ER RN' }
    ],
    labs: [
      { id: 'shp-cbc', panel: 'Complete Blood Count', time: '12:50', results: [
        { t: 'Hgb', v: 14, u: 'g/dL', lo: 13.5, hi: 17.5 },
        { t: 'HCT', v: 44, u: '%', lo: 40, hi: 45 },
        { t: 'WBC', v: 8.2, u: 'x10⁹/L', lo: 5, hi: 11 },
        { t: 'Platelets', v: 295, u: 'x10⁹/L', lo: 150, hi: 400 }
      ] },
      { id: 'shp-bmp', panel: 'Basic Metabolic Panel', time: '12:50', results: [
        { t: 'Sodium', v: 140, u: 'mEq/L', lo: 135, hi: 145 },
        { t: 'Potassium', v: 3.8, u: 'mEq/L', lo: 3.5, hi: 5.1 },
        { t: 'Chloride', v: 96, u: 'mEq/L', lo: 98, hi: 106 },
        { t: 'HCO3', v: 22, u: 'mEq/L', lo: 22, hi: 26 },
        { t: 'BUN', v: 23, u: 'mg/dL', lo: 8, hi: 23 },
        { t: 'Creatinine', v: 1.1, u: 'mg/dL', lo: 0.6, hi: 1.1 },
        { t: 'Glucose', v: 122, u: 'mg/dL', lo: 70, hi: 110 }
      ] },
      { id: 'shp-misc', panel: 'Coagulation & Cardiac', time: '12:50', results: [
        { t: 'INR', v: 0.9, u: '', lo: 0.8, hi: 1.1 },
        { t: 'aPTT', v: 30, u: 's', lo: 25, hi: 40 },
        { t: 'Troponin I', v: 0.06, u: 'ng/mL', ref: '≤ 0.04', flag: 'H' },
        { t: 'BNP', v: 78, u: 'pg/mL', ref: '< 100' }
      ] },
      { id: 'shp-trop2', panel: 'Troponin I (repeat — arrival to unit)', time: '13:00', results: [
        { t: 'Troponin I', v: 0.1, u: 'ng/mL', ref: '≤ 0.04', flag: 'H' }
      ] }
    ],
    imaging: [
      { id: 'shp-ecg', study: '12-Lead ECG (ER)', time: '11:35', text: 'No ST elevation noted. Sinus tachycardia with some PVCs.' }
    ],
    notes: [
      { id: 'shp-n1', type: 'ER Note', author: 'Dr. Williams (ER)', time: '11:40', text: 'CHIEF COMPLAINT: Chest pain, diaphoresis, and shortness of breath.\n\nHPI: Mr. Sharp presents to the ER with complaints of chest pain, diaphoresis, and shortness of breath.\nPMH: No history of surgeries. History of hypertension.\nFamily history: None. Allergies: NKDA.\nSocial: Businessman; travels for work; smokes < 1/2 pack/day; drinks alcohol occasionally.\n\nROS: General — cooperative, pleasant. CV — no palpitations, some chest pain. Resp — shortness of breath. GI/GU — no nausea, vomiting, or abdominal pain. MSK — no pain, ROM WDL. Neuro — no headache, no focal deficits.\n\nEXAM: Appears uncomfortable, in moderate distress due to pain of 9/10. T 98.7 °F, HR 101, RR 20, BP 140/84, SpO2 97% RA. HEENT: no oropharyngeal lesions; no cervical lymphadenopathy. Resp: clear bilaterally, regular rate, equal expansion. CV: S1 S2 RR, no murmurs/gallops; diaphoretic; chest pain 9/10; no peripheral edema; CR < 3 sec all extremities. Abd: soft, round, non-tender; active bowel sounds x4. MSK: no joint swelling or erythema. Neuro: no focal deficits.\n\nLABS/IMAGING: CBC, BMP, troponin pending. 12-lead ECG: no ST elevation; sinus tachycardia with some PVCs.\n\nPLAN: Consult cardiology.' },
      { id: 'shp-n2', type: 'Cardiology Admit Note', author: 'Dr. C. Revis', time: '12:00', text: 'ASSESSMENT: Karl Sharp is a 64-year-old male with a history of hypertension who presents to the ER with complaints of chest pain, diaphoresis, and shortness of breath. Initial ECG shows sinus tachycardia with some PVCs. Initial troponin slightly elevated.\n\nPLAN:\n1. Admission: NSTEMI — admit to Progressive Care Unit.\n2. Medication: continue home medications.\n3. Labs: trend troponins.' },
      { id: 'shp-n3', type: 'Nursing Note', author: 'LJ, RN', time: '12:30', text: 'Pt arrived in ER complaining of chest pain. He came to the ED by ambulance when the symptoms began. No family is present. He was treated with oxygen 2 L via nasal cannula, aspirin, two doses of sublingual nitroglycerin, and a normal saline bolus required after the second dose of nitroglycerin with no recurrent chest pain. 12-lead ECG in ED showed no ST elevation. Antiplatelet and anticoagulation meds were started and documented in the MAR.' }
    ],
    io: [],
    events: []
  },

  /* ------------------------------------------------------------------ */
  /* LEVEL 3 — MED-SURG: Vernon Watkins (POD 4 hemicolectomy)            */
  /* ------------------------------------------------------------------ */
  {
    id: 'watkins',
    level: 3,
    experiences: ['advms'],
    name: { first: 'Vernon', last: 'Watkins' },
    mrn: 'ATU-L3-0409', // not listed in Notion — placeholder for wristband scanning
    dob: '1957-04-09',
    age: '69 years',
    sex: 'M',
    unit: 'Medical-Surgical Unit',
    room: '—',
    service: 'General Surgery',
    attending: 'Dr. Jack Nelson',
    admitted: { time: '10:00', day: -4 },
    scenarioStart: '10:00',
    admitDx: 'Bowel perforation — s/p left hemicolectomy (POD 4)',
    codeStatus: 'Full Code',
    isolation: 'None',
    allergies: [{ agent: 'Penicillin', reaction: 'Hives', severity: 'Moderate', tags: ['penicillin'] }],
    heightCm: null,
    weightKg: 80,
    flags: ['Post-op'],
    assessmentForms: ['wdl-adult', 'pain', 'braden', 'morse'],
    heparinFlowsheet: true,
    emergencyContact: 'Wife — phone on file',
    demographics: {
      'Marital status': 'Married',
      'Primary language': 'English',
      Race: 'White',
      Ethnicity: 'Non-Hispanic',
      Religion: 'Catholic',
      Occupation: 'Retired postal worker',
      Education: 'College degree',
      Insurance: 'Self pay',
      'Cultural considerations': 'None'
    },
    hpi: 'Mr. Watkins presented to the ER 4 days ago with nausea, vomiting, and severe abdominal pain x 2 days. On arrival his abdomen was firm, distended, and tender with hypoactive bowel sounds. Abdominal X-ray indicated perforated bowel with free fluid in the abdomen. An emergency left hemicolectomy was performed that day and he was admitted to the medical-surgical unit. He is now POD 4.',
    pmh: ['Hypertension', 'Cataracts'],
    psh: ['Left hemicolectomy — 4 days ago (this admission)'],
    familyHx: ['None'],
    socialHx: ['Lives with wife', 'Retired postal worker', 'Catholic', 'Smokes 1/2 pack per day (filtered) x 50 years'],
    homeMeds: [{ name: 'Hydrochlorothiazide', dose: '25 mg', route: 'PO', freq: 'Daily' }],
    orders: [
      { id: 'wat-o1', cat: 'Admission', text: 'Diagnosis: s/p hemicolectomy POD 4', time: '06:00', by: 'Dr. Jack Nelson' },
      { id: 'wat-o2', cat: 'Code Status', text: 'Full Code', time: '06:00', by: 'Dr. Jack Nelson' },
      { id: 'wat-o3', cat: 'Diet', text: 'Regular diet', time: '06:00', by: 'Dr. Jack Nelson' },
      { id: 'wat-o4', cat: 'Activity', text: 'Out of bed ad lib', time: '06:00', by: 'Dr. Jack Nelson' },
      { id: 'wat-o5', cat: 'Nursing', text: 'Vital signs with SpO2 every 4 hours', time: '06:00', by: 'Dr. Jack Nelson' },
      { id: 'wat-o6', cat: 'Respiratory', text: 'Oxygen to maintain SpO2 greater than 92%', time: '06:00', by: 'Dr. Jack Nelson' },
      { id: 'wat-o7', cat: 'Lab', text: 'CBC, platelets, BMP, PT/INR, aPTT @ 0600', time: '06:00', by: 'Dr. Jack Nelson' }
    ],
    meds: [
      { id: 'wat-hctz', name: 'Hydrochlorothiazide', dose: '25 mg', route: 'PO', freq: 'Daily', type: 'scheduled', preAssess: ['SBP', 'lab:Potassium'], doses: [{ time: '09:00', given: 'CR' }] },
      { id: 'wat-cipro', name: 'Ciprofloxacin 400 mg in 100 mL NS', dose: '400 mg', route: 'IVPB', freq: 'Every 12 hours', type: 'scheduled', doses: [{ time: '09:00', given: 'CR' }, { time: '21:00' }] },
      { id: 'wat-metro', name: 'Metronidazole 500 mg in 100 mL NS', dose: '500 mg', route: 'IVPB', freq: 'Every 12 hours', type: 'scheduled', doses: [{ time: '06:00', given: 'LJ' }, { time: '18:00' }] },
      { id: 'wat-enox', name: 'Enoxaparin', dose: '40 mg', route: 'Subcut', freq: 'Daily', type: 'scheduled', highAlert: true, doses: [{ time: '09:00', given: 'CR' }] },
      { id: 'wat-apap', name: 'Acetaminophen', dose: '1 gram', route: 'PO', freq: 'Every 12 hours (per order)', type: 'scheduled', instructions: 'Provider order reads every 12 hours; the MAR lists every 8 hours (0000/0800/1600). Verify frequency with the provider.', doses: [{ time: '00:00', given: 'LJ' }, { time: '08:00', given: 'LJ' }, { time: '16:00' }] },
      { id: 'wat-gaba', name: 'Gabapentin', dose: '300 mg', route: 'PO', freq: 'Every 8 hours', type: 'scheduled', doses: [{ time: '00:00', given: 'LJ' }, { time: '08:00', given: 'LJ' }, { time: '16:00' }] },
      { id: 'wat-oxy5', name: 'Oxycodone', dose: '5 mg', route: 'PO', freq: 'Every 4 hours PRN', type: 'prn', indication: 'Moderate pain 4–7', minIntervalHr: 4, highAlert: true, preAssess: ['Pain', 'RR', 'SpO2'] },
      { id: 'wat-oxy10', name: 'Oxycodone', dose: '10 mg', route: 'PO', freq: 'Every 4 hours PRN', type: 'prn', indication: 'Severe pain 8–10', minIntervalHr: 4, highAlert: true, preAssess: ['Pain', 'RR', 'SpO2'] }
    ],
    vitals: [
      { time: '01:00', temp: 99.1, tempRoute: 'Oral', hr: 95, rr: 21, sbp: 125, dbp: 84, spo2: 96, o2: 'Room air', pain: 0, by: 'Night shift RN' },
      { time: '05:00', temp: 99.3, tempRoute: 'Oral', hr: 103, rr: 22, sbp: 129, dbp: 85, spo2: 96, o2: 'Room air', pain: 5, by: 'Night shift RN' },
      { time: '09:00', temp: 99.0, tempRoute: 'Oral', hr: 105, rr: 22, sbp: 130, dbp: 84, spo2: 94, o2: 'Room air', pain: 0, by: 'Day shift RN' }
    ],
    labs: [
      { id: 'wat-coag', panel: 'Coagulation (baseline)', time: '06:00', results: [
        { t: 'aPTT', v: 32, u: 's', lo: 25, hi: 40 }
      ] }
    ],
    labsPending: 'The 0600 labs (CBC, platelets, BMP, PT/INR, aPTT) are in the Notion PDF "watkin_labs.pdf" and have not been entered here yet. Baseline aPTT 32 is from the Notion heparin flowsheet.',
    imaging: [],
    notes: [
      { id: 'wat-n1', type: 'ER Note', author: 'Dr. Henderson (ER)', time: '10:00', day: -4, text: 'CHIEF COMPLAINT: Nausea, vomiting, and severe abdominal pain.\n\nHPI: Mr. Watkins presented to the ER with complaints of nausea, vomiting, and severe abdominal pain x 2 days.\nPMH: No history of surgeries. History of hypertension, cataracts.\nFamily history: None. Allergies: Penicillin.\nSocial: Lives with wife; retired postal worker; Catholic; smokes 1/2 pack/day filtered x 50 years.\n\nROS: General — cooperative, pleasant. CV — no palpitations. Resp — no shortness of breath. GI/GU — nausea, vomiting, and abdominal pain. MSK — no pain, ROM WDL. Neuro — no headache, no focal deficits.\n\nEXAM: Appears uncomfortable, in moderate distress due to pain of 9/10. T 99.6 °F, HR 95, RR 20, BP 140/84, SpO2 97% RA. Resp: clear bilaterally, regular rate, equal expansion. CV: S1 S2 RR, no murmurs/gallops; no peripheral edema; CR < 3 sec. Abdomen: firm, distended, and tender; hypoactive bowel sounds x4 quadrants. MSK: no joint swelling or erythema. Neuro: no focal deficits.\n\nLABS/IMAGING: CBC, BMP pending. Abdominal X-ray pending.\n\nPLAN: Consult surgery.' },
      { id: 'wat-n2', type: 'Surgical Admit Note', author: 'Dr. Jack Nelson', time: '12:00', day: -4, text: 'ASSESSMENT: Vernon Watkins is a 69-year-old male with a history of hypertension who presented to the ER with nausea, vomiting, and abdominal pain x 2 days. Upon arrival, the abdomen was firm, distended, and tender. Auscultation of the abdomen revealed hypoactive bowel sounds. Abdominal X-ray indicated perforated bowel with free fluid in abdomen.\n\nPLAN:\n1. Admission: hemicolectomy; admit to medical-surgical unit.\n2. Medication: continue home medications.' },
      { id: 'wat-n3', type: 'Surgical Progress Note', author: 'Dr. Jack Nelson', time: '07:00', text: 'COURSE OF STAY: Day 4.\n\nMr. Watkins presented to the ER 4 days ago with nausea, vomiting, and severe abdominal pain x 2 days. Emergency hemicolectomy was performed and he was admitted to the MS unit.\n\nASSESSMENT: POD 4. Midline incision noted with no redness, swelling, or drainage. Bowel sounds are hypoactive and patient had a bowel movement yesterday. Patient is frustrated and has refused to ambulate last night and this AM.\n\nPLAN:\n1. Post hemicolectomy — continue home meds; continue antibiotics.\n2. Diet: regular.\n3. Oxygenation: titrate O2 to maintain SpO2 > 92%.' }
    ],
    io: [],
    events: [
      {
        id: 'wat-stat',
        title: 'STAT orders — Nurse Driven Heparin Protocol',
        instructorNotes: 'From Notion "Stat Orders (Watkins)". Weight for protocol: 80 kg. The Nurse Driven Heparin Protocol and STAT lab results are PDFs in Notion ("Heparin_1.pdf", "watkin_stat_lab.pdf") — have students use the printed protocol, or add the STAT labs to this event in patients.js. Note: patient received enoxaparin 40 mg at 0900.',
        orders: [
          { id: 'wat-s1', cat: 'Activity', text: 'Bed rest', priority: 'STAT', by: 'Dr. Nelson' },
          { id: 'wat-s2', cat: 'Nursing', text: 'Continuous SpO2 and ECG monitoring', priority: 'STAT', by: 'Dr. Nelson' },
          { id: 'wat-s3', cat: 'Diagnostics', text: '12-lead ECG', priority: 'STAT', by: 'Dr. Nelson' },
          { id: 'wat-s4', cat: 'Respiratory', text: 'Oxygen via mask: titrate to maintain SpO2 greater than 92%', priority: 'STAT', by: 'Dr. Nelson' },
          { id: 'wat-s5', cat: 'Imaging', text: 'Spiral CT scan with contrast', priority: 'STAT', by: 'Dr. Nelson' },
          { id: 'wat-s6', cat: 'Medication', text: 'Using weight of 80 kg: initiate Nurse Driven Heparin Protocol. Give bolus from the heparin 10,000 units/10 mL vial, and use the bag for the drip. Maintain heparin flowsheet.', priority: 'STAT', by: 'Dr. Nelson' }
        ],
        meds: [
          { id: 'wat-hep-bolus', name: 'Heparin bolus (from 10,000 units/10 mL vial)', dose: 'Per Nurse Driven Heparin Protocol — 80 kg', route: 'IV push', freq: 'Once — per protocol', type: 'once', highAlert: true, preAssess: ['lab:aPTT', 'lab:Platelets'], instructions: 'Calculate bolus per the Nurse Driven Heparin Protocol using 80 kg. Independent double check with a second RN. Document on the Heparin Flowsheet.', doses: [{ at: 0 }] },
          { id: 'wat-hep-drip', name: 'Heparin infusion (premixed bag)', dose: 'Per Nurse Driven Heparin Protocol — units/kg/hr', route: 'IV', freq: 'Continuous — titrate per aPTT', type: 'continuous', highAlert: true, preAssess: ['lab:aPTT'], instructions: 'Initial rate and titration per the Nurse Driven Heparin Protocol using 80 kg. Independent double check with a second RN for start and every rate change. Document every aPTT and rate change on the Heparin Flowsheet.' }
        ]
      }
    ]
  },

  /* ------------------------------------------------------------------ */
  /* LEVEL 3 — PSYCHIATRIC: David Carter                                 */
  /* ------------------------------------------------------------------ */
  {
    id: 'carter',
    level: 3,
    experiences: ['psych'],
    name: { first: 'David', last: 'Carter' },
    mrn: '12855',
    dob: '1997-12-03',
    age: '28 years',
    sex: 'M',
    unit: 'Station 32 — Locked Psychiatric Unit',
    room: '—',
    service: 'Psychiatry',
    attending: 'Dr. J. Diego, MD',
    admitted: { time: '07:00' },
    scenarioStart: '10:00',
    admitDx: 'Schizophrenia — acute exacerbation with active hallucinations and delusions',
    codeStatus: 'Not documented',
    isolation: 'None',
    nkda: true,
    allergies: [],
    heightCm: 155,
    weightKg: 91,
    flags: ['Involuntary emergency detention', 'History of violence — safety checks'],
    assessmentForms: ['mse', 'wdl-adult', 'pain', 'morse'],
    emergencyContact: 'Marjorie Carter (mother) — phone on file',
    demographics: {
      'Marital status': 'Single',
      Education: 'College education',
      'Living situation': 'Lives with mother (Marjorie)',
      'Legal status': 'Involuntary emergency detention',
      'Source of history': 'Mother'
    },
    hpi: '28-year-old male with a 10-year history of schizophrenia, brought in by police after a violent outburst toward his mother: he threw a table at her when she asked him to take his medications. He has active hallucinations and delusions. Currently admitted as an involuntary emergency detention.',
    pmh: ['Schizophrenia — 10 years'],
    psh: ['None reported'],
    familyHx: ['Autism — brother', 'Depression — maternal aunt'],
    socialHx: ['Single; lives with mother (Marjorie)', 'College education', 'Current smoker: 1 pack per day', 'Alcohol: occasional beer', 'Drugs: occasional marijuana'],
    homeMeds: [
      { name: 'Olanzapine', dose: '10 mg', route: 'PO', freq: 'Daily' },
      { name: 'Venlafaxine XR', dose: '75 mg', route: 'PO', freq: 'Daily' }
    ],
    ros: [
      ['General', 'Confused, agitated, unkempt, malodorous'],
      ['Skin', 'Dirty and bruised'],
      ['Respiratory', 'No cough or shortness of breath'],
      ['GI', 'No nausea, vomiting, or diarrhea'],
      ['GU', 'No dysuria or urinary complaints']
    ],
    orders: [
      { id: 'car-o1', cat: 'Admission', text: 'Admit to Station 32 — Locked Unit', time: '07:00', by: 'Dr. J. Diego, MD' },
      { id: 'car-o2', cat: 'Diet', text: 'Regular diet', time: '07:00', by: 'Dr. J. Diego, MD' },
      { id: 'car-o8', cat: 'Lab', text: 'CBC with differential', time: '07:00', by: 'Dr. J. Diego, MD' },
      { id: 'car-o9', cat: 'Lab', text: 'Urine drug screen', time: '07:00', by: 'Dr. J. Diego, MD' },
      { id: 'car-o10', cat: 'Lab', text: 'Basic metabolic panel', time: '07:00', by: 'Dr. J. Diego, MD' }
    ],
    meds: [
      { id: 'car-olanz', name: 'Olanzapine', dose: '10 mg', route: 'PO', freq: 'Give now, then daily', type: 'scheduled', doses: [{ time: '09:00', given: 'LJ' }, { time: '09:00', day: 1 }] },
      { id: 'car-venla', name: 'Venlafaxine XR', dose: '75 mg', route: 'PO', freq: 'Daily', type: 'scheduled', doses: [{ time: '09:00', given: 'LJ' }, { time: '09:00', day: 1 }] },
      { id: 'car-loraz', name: 'Lorazepam', dose: '2 mg', route: 'PO', freq: 'Every 8 hours PRN', type: 'prn', indication: 'Agitation', minIntervalHr: 8, highAlert: true, preAssess: ['RR', 'SBP'] },
      { id: 'car-halo', name: 'Haloperidol', dose: '5 mg', route: 'PO', freq: 'Every 8 hours PRN', type: 'prn', indication: 'Agitation', minIntervalHr: 8 },
      { id: 'car-apap', name: 'Acetaminophen', dose: '650 mg', route: 'PO', freq: 'Every 8 hours PRN', type: 'prn', indication: 'Pain', minIntervalHr: 8, preAssess: ['Pain'] }
    ],
    vitals: [
      { time: '07:00', temp: 98.9, tempRoute: 'Axillary', hr: 90, rr: 16, sbp: 134, dbp: 84, spo2: 96, o2: 'Room air', note: 'Admit', by: 'HJ, RN' }
    ],
    labs: [
      { id: 'car-cbc', panel: 'Admission Labs — CBC', time: '07:30', results: [
        { t: 'Hemoglobin', v: 15.5, u: 'g/dL', lo: 12.1, hi: 15.1 },
        { t: 'Hematocrit', v: 43, u: '%', lo: 36.1, hi: 44.3 },
        { t: 'Platelets', v: 185, u: 'K/uL', lo: 140, hi: 400 }
      ] },
      { id: 'car-bmp', panel: 'Basic Metabolic Panel', time: '07:30', results: [
        { t: 'Sodium', v: 140, u: 'mEq/L', lo: 136, hi: 143 },
        { t: 'Potassium', v: 3.9, u: 'mEq/L', lo: 3.5, hi: 5.0 },
        { t: 'Chloride', v: 102, u: 'mEq/L', lo: 100, hi: 108 },
        { t: 'HCO3', v: 24, u: 'mEq/L', lo: 19, hi: 25 },
        { t: 'BUN', v: 18, u: 'mg/dL', lo: 8, hi: 20 },
        { t: 'Creatinine', v: 0.7, u: 'mg/dL', lo: 0.6, hi: 1.2 },
        { t: 'Glucose', v: 92, u: 'mg/dL', lo: 70, hi: 110 }
      ] },
      { id: 'car-uds', panel: 'Drug Screen', time: '07:30', results: [
        { t: 'Urine drug screen', v: 'Negative', ref: 'Negative' }
      ] }
    ],
    imaging: [],
    notes: [
      { id: 'car-n1', type: 'History & Physical', author: 'Dr. J. Diego, MD', time: '07:15', text: 'CHIEF COMPLAINT: Violent outburst; active hallucinations and delusions.\n\nHPI: 28-year-old white male with a 10-year history of schizophrenia admitted after a violent outburst. Brought in by police with mother. He threw a table at her when she asked him to take his medications. Currently admitted as involuntary emergency detention. Patient has active hallucinations and delusions.\n\nASSESSMENT: 28-year-old male with history of schizophrenia. Patient\'s mother reports non-compliance with home medication administration. Patient admits to having hallucinations at this time.' },
      { id: 'car-n2', type: 'Admission Nursing Note', author: 'HJ, RN', time: '08:00', text: 'Patient admitted to the unit; searched per protocol and oriented to the unit and rules. He was disheveled, wearing layers of clothing and was offered assistance with taking a shower and changing his clothing but he refused. He refused his medications and food. He remains seclusive from his peers and remained in his room for most of the shift. At times he looks internally preoccupied and becomes very guarded when asked about hallucinations. He remains on safety checks secondary to his history of violence, but has not demonstrated any overt violence or agitation since he was admitted. He denies suicidal or homicidal ideation when directly questioned.' }
    ],
    io: [],
    events: []
  }
];
