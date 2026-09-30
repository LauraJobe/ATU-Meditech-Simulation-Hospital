/*
 * Patients imported from laurablasdel/ATU-Simulation-Hospital (built from the
 * Notion Level 1 and Level 2 charts) by tools/import-atu-sim-hospital.cjs.
 * Generated file — re-run the tool to refresh, then review. Edits here are
 * overwritten.
 */
window.SIM_PATIENTS = (window.SIM_PATIENTS || []).concat([
 {
  id: "charlesjones",
  level: 1,
  experiences: [
   "ms"
  ],
  source: "ATU-Simulation-Hospital (Notion)",
  name: {
   first: "Charles",
   last: "Jones"
  },
  mrn: "201041",
  dob: "1958-04-20",
  age: "68 years",
  sex: "M",
  unit: "Medical-Surgical Unit",
  room: "211A",
  service: "Medicine",
  attending: "Dr. Burris",
  admitted: {
   time: "10:00",
   day: -2
  },
  scenarioStart: "08:00",
  admitDx: "Congestive Heart Failure",
  codeStatus: "Full Code",
  isolation: "Standard",
  nkda: true,
  allergies: [],
  heightCm: null,
  weightKg: 82,
  assessmentForms: [
   "wdl-adult",
   "pain",
   "braden",
   "morse"
  ],
  orders: [
   {
    id: "charlesjones-o8-0",
    cat: "Admission",
    text: "Admit to Med surg Unit",
    at: -240,
    by: "Dr. Burris"
   },
   {
    id: "charlesjones-o8-1",
    cat: "Admission",
    text: "Condition: Stable",
    at: -240,
    by: "Dr. Burris"
   },
   {
    id: "charlesjones-o8-2",
    cat: "Code Status",
    text: "Code status: Full Code",
    at: -240,
    by: "Dr. Burris"
   },
   {
    id: "charlesjones-o8-3",
    cat: "Nursing",
    text: "Vital signs q 4 hours including SpO2; continuous pulse ox",
    at: -240,
    by: "Dr. Burris"
   },
   {
    id: "charlesjones-o8-5",
    cat: "Respiratory",
    text: "Oxygen per nasal cannula 2-4 L titrated to maintain SpO2>92",
    at: -240,
    by: "Dr. Burris"
   },
   {
    id: "charlesjones-o8-6",
    cat: "Activity",
    text: "Activity: Out of bed as tolerated",
    at: -240,
    by: "Dr. Burris"
   },
   {
    id: "charlesjones-o8-7",
    cat: "Nursing",
    text: "Strict Intake and output q shift",
    at: -240,
    by: "Dr. Burris"
   },
   {
    id: "charlesjones-o8-8",
    cat: "Nursing",
    text: "Daily weight",
    at: -240,
    by: "Dr. Burris"
   },
   {
    id: "charlesjones-o8-9",
    cat: "Diet",
    text: "Diet: 2 gm sodium, low cholesterol",
    at: -240,
    by: "Dr. Burris"
   },
   {
    id: "charlesjones-o8-10",
    cat: "IV Fluids",
    text: "IV: normal saline at KVO",
    at: -240,
    by: "Dr. Burris"
   },
   {
    id: "charlesjones-o8-11",
    cat: "Nursing",
    text: "Continue home meds:",
    at: -240,
    by: "Dr. Burris"
   },
   {
    id: "charlesjones-o8-18",
    cat: "Lab",
    text: "Daily Labs: BMP, CBC, BNP",
    at: -240,
    by: "Dr. Burris"
   },
   {
    id: "charlesjones-o8-19",
    cat: "Imaging",
    text: "Chest XRAY and 12 lead EKG on admission",
    at: -240,
    by: "Dr. Burris"
   }
  ],
  meds: [
   {
    id: "char-lisinopril-0",
    name: "Lisinopril",
    dose: "20 mg",
    route: "PO",
    freq: "Daily",
    type: "scheduled",
    doses: [
     {
      time: "09:00"
     }
    ]
   },
   {
    id: "char-metoprolol-1",
    name: "Metoprolol",
    dose: "50 mg",
    route: "PO",
    freq: "Daily",
    type: "scheduled",
    doses: [
     {
      time: "09:00"
     }
    ]
   },
   {
    id: "char-amiodarone-2",
    name: "Amiodarone",
    dose: "200 mg",
    route: "PO",
    freq: "Daily",
    type: "scheduled",
    doses: [
     {
      time: "09:00"
     }
    ]
   },
   {
    id: "char-digoxin-3",
    name: "Digoxin",
    dose: "0.125 mg",
    route: "PO",
    freq: "Daily",
    type: "scheduled",
    doses: [
     {
      time: "09:00"
     }
    ]
   },
   {
    id: "char-metformin-4",
    name: "Metformin",
    dose: "1000 mg",
    route: "PO",
    freq: "Daily",
    type: "scheduled",
    doses: [
     {
      time: "08:00"
     }
    ]
   },
   {
    id: "char-warfarin-5",
    name: "Warfarin",
    dose: "2.5 mg",
    route: "PO",
    freq: "Daily",
    type: "scheduled",
    highAlert: true,
    doses: [
     {
      time: "21:00"
     }
    ]
   },
   {
    id: "char-regular-insulin-6",
    name: "Regular insulin",
    dose: "Sliding scale",
    route: "Subcutaneous",
    freq: "AC and HS",
    type: "scheduled",
    drugKey: "INSULIN",
    highAlert: true,
    doses: [
     {
      time: "07:30"
     },
     {
      time: "11:30"
     },
     {
      time: "16:30"
     },
     {
      time: "21:00"
     }
    ]
   },
   {
    id: "char-normal-saline-7",
    name: "Normal saline",
    dose: "KVO",
    route: "IV infusion",
    freq: "Continuous",
    type: "continuous",
    rate: "KVO"
   },
   {
    id: "char-spironolactone-8",
    name: "Spironolactone",
    dose: "12.5 mg",
    route: "PO",
    freq: "Daily—held while receiving Lasix",
    type: "scheduled",
    doses: [
     {
      at: 0
     }
    ],
    status: "Held",
    holdReason: "Daily—held while receiving Lasix"
   }
  ],
  vitals: [
   {
    time: "10:00",
    day: -2,
    temp: 97,
    hr: 82,
    rr: 22,
    sbp: 100,
    dbp: 60,
    spo2: 82,
    note: "Admit/ shift",
    by: "MK, ID, MB"
   },
   {
    time: "07:35",
    temp: 98.6,
    hr: 86,
    rr: 20,
    sbp: 102,
    dbp: 60,
    spo2: 95,
    o2: "Nasal cannula",
    o2Flow: 2,
    note: "Day 2 AM",
    by: "GB, Z , JC"
   },
   {
    time: "08:45",
    hr: 85,
    rr: 20,
    sbp: 125,
    dbp: 81,
    spo2: 95,
    o2: "Nasal cannula",
    o2Flow: 2,
    note: "day 2",
    by: "GB, JC"
   }
  ],
  labs: [
   {
    id: "charlesjones-l7-0",
    panel: "Admission Labs",
    at: -120,
    results: [
     {
      t: "Sodium",
      v: "139",
      lo: 136,
      hi: 145
     },
     {
      t: "Potassium",
      v: "4.0",
      lo: 3.5,
      hi: 5
     },
     {
      t: "Chloride",
      v: "104",
      lo: 98,
      hi: 106
     },
     {
      t: "HCO3",
      v: "28",
      lo: 23,
      hi: 30
     },
     {
      t: "BUN",
      v: "19",
      lo: 8,
      hi: 20
     },
     {
      t: "Creatinine",
      v: "1.3",
      lo: 0.6,
      hi: 1.5
     },
     {
      t: "Glucose",
      v: "110",
      lo: 70,
      hi: 110
     }
    ]
   }
  ],
  imaging: [
   {
    id: "charlesjones-im1",
    study: "Echo Results-admission",
    at: -180,
    text: "",
    images: [
     "assets/imported/5b6a8e8db33e51d57b.png"
    ]
   },
   {
    id: "charlesjones-im2",
    study: "ECG Results-Admission",
    at: -180,
    text: "",
    images: [
     "assets/imported/25d059b717ff05f78a.png"
    ]
   },
   {
    id: "charlesjones-im7",
    study: "Admission Labs",
    at: -180,
    text: "",
    images: [
     "assets/imported/e54397fe73dd5df32f.png"
    ]
   }
  ],
  notes: [
   {
    id: "charlesjones-n3",
    type: "ER Note (Admit Day)",
    author: "Dr. Burris",
    at: -270,
    md: true,
    text: "### **ER  Note**\n**Date of Admission:** 2 days ago\n\n**Patient Name:** Charles Jones\n**Chief Complaint:** Dyspnea, orthopnea, fatigue, and weight gain\n\n**DOB:** 004/20/XXXX\n**ER Physician:** Dr. Henderson\n\n**Age/Sex:** 68-year-old male\n**Source of History:** Patient\n\n### **History of Present Illness**\nMr. Jones was seen in his physician’s office this morning. He presented with a 12 lb weight gain, severe dyspnea, O2 saturation of 87% on room air, orthopnea and lower extremity edema. Mr. Jones was sent to the ER to be evaluated.\n\n### **Past Medical History**\n- No history of surgeries\n- History of Hypertension, atrial fibrillation, and hyperlipemia\n- IDDM\n\n### **Family History**\n- None\n\n### **Allergies**\n- **NKDA**\n\n### **Social History**\n- Lives with wife\n- Retired 2 yrs ago from school maintenance supervisor\n- Baptist\n- Smokes 1 pack day 20 years, quit 2 years ago\n\n### **Review of Systems**\n- **General:** Cooperative, short of breath\n- **Cardiovascular:** No palpitations\n- **Respiratory:** severe shortness of breath\n- **GI/GU:** No Nausea, vomiting, and abdominal pain\n- **Musculoskeletal:** No pain, ROM WDL\n- **Neurological:** No headache, no focal deficits\n### **Physical Examination**\n**General:** Appears uncomfortable, in moderate distress due to shortness of breath\n**Vital Signs:**\n- Temperature: 98.6°C\n- Heart Rate: 95bpm\n- Respiratory Rate: 20 breaths/min\n- Blood Pressure: 140/84 mmHg\n- Oxygen Saturation: 87% on room air\n**HEENT:**\n- No oropharyngeal lesions; No cervical lymphadenopathy\n**Respiratory:**\n- Clear to rales and wheezes bilaterally, regular rate, equal expansion;\n**Cardiovascular:**\n- S1 S2 irregular RR, no murmurs/gallops\n- 3+ peripheral edema, CR <3 sec in all extremities\n**Abdomen:**\n- Soft, non tender\n- Normoactive bowel sounds x 4 quadrants\n**Musculoskeletal:**\n- No joint swelling or erythema\n**Neurological:**\n- No focal deficits\n### **Laboratory & Imaging Results**\n- **CBC, BMP:** pending\n- **Chest X-Ray: **Pending\n### **Plan**\n1. **Admit to Medical for CHF**"
   },
   {
    id: "charlesjones-n4",
    type: "Medical Admit Note",
    author: "Dr. Burris",
    at: -240,
    md: true,
    text: "### **Medical Admission Note**\n**Date of Admission:** today\n\n**Patient Name:** Charles Jones\n**Chief Complaint:** Dyspnea, orthopnea, fatigue, and weight gain\n\n**DOB:** 004/20/XXXX\n**ER Physician:** Dr. Smith\n\n**Age/Sex:** 68-year-old male\n**Source of History:** Patient\n\n### **History of Present Illness:**\nMr. Jones was seen in his physician’s office this morning. He presented with a 12 lb weight gain, severe dyspnea, O2 saturation of 87% on room air, orthopnea and lower extremity edema. Mr. Jones was sent to the ER to be evaluated.\n\n### **Past Medical History**\n- No history of surgeries\n- History of Hypertension, atrial fibrillation, and hyperlipemia\n- Type 2 diabetes controlled with metformin\n\n### **Family History**\n- None\n\n### **Allergies**\n- **NKDA**\n\n### **Social History**\n- Lives with wife\n- Retired 2 yrs ago from school maintenance supervisor\n- Baptist\n- Smokes 1 pack day 20 years, quit 2 years ago\n\n### **Assessment**\nCharles Jones is a 68-year-old male with a history of congestive heart failure (CHF), who was sent to the ER from a physician’s office at 9.00 a.m. this morning. Upon arrival, the patient had severe dyspnea and orthopnea. Auscultation of the lungs revealed rales that are noted bilaterally in lower lobes. The patient is on oxygen 4 L/min and the saturation is on average 92-94%. Patient has received IV Lasix of 160 mg over 20 minutes IV piggy back. Total urine output is 800 cc over the past 4 hours. His BP is stable 122/78 and he has 3+ bilateral lower extremity edema. Mr. Jones is oriented to place, time, and person, and he denies any pain.\n# Home medications\nWarfarin 2.5 mg po daily\nMetformin 1000mg in am daily\nLisinopril 20mg daily in the am\nMetoprolol 50mg daily in am\nAminodarone 200mg po daily in am\nDigoxin 0.125 mg po daily in am\nSpironolactone 12.5mg daily in am\n### **Plan**\n1. **Admission:**\n- Admit to medical unit\n2. **Medication:**\n- Continue Home medications\n- Diuresis patient to help with overload"
   },
   {
    id: "charlesjones-n5",
    type: "Medical Progress Note",
    author: "Dr. Burris",
    at: -210,
    md: true,
    text: "### **Medical Progress Note**\n**Course of Stay:** Day 2\n\n**Patient Name:** Charles Jones\n**Chief Complaint:** Dyspnea, orthopnea, fatigue, and weight gain\n\n**DOB:** 004/20/XXXX\n**ER Physician:** Dr. Smith\n\n**Age/Sex:** 68-year-old male\n**Source of History:** Patient\n\n### **History of Present Illness**\nMr. Jones was seen in his physician’s office 2 mornings ago. He presented with a 12 lb weight gain, severe dyspnea, O2 saturation of 87% on room air, orthopnea and lower extremity edema. Mr. Jones was sent to the ER to be evaluated.\n\n### **Past Medical History**\n- No history of surgeries\n- History of Hypertension, atrial fibrillation, and hyperlipemia\n- HEP C positive\n\n### **Family History**\n- None\n\n### **Allergies**\n- **NKDA**\n\n### **Social History**\n- Lives with wife\n- Retired 2 yrs ago from school maintenance supervisor\n- Baptist\n- Smokes 1 pack day 20 years, quit 2 years ago\n\n### **Assessment**\nCharles Jones is a 68-year-old male with history of congestive heart failure (CHF) who presented to the emergency department two days ago with shortness of breath, fatigue, and weight gain and ankle edema. An echo performed upon admission showed ejection fraction (EF) of 35%. The chest x-ray revealed bilateral congestion to the lower lungs. Despite IV furosemide, resulting in a weight loss of 4 lbs., he remains short of breath and requires oxygen 2 L on nasal cannula to maintain a saturation > 92%. He complains of lightheadedness when standing and has required assistance when out of bed.\n### **Plan**\n1. **CHF Overload**\n- Continue home meds\n- Monitor fluid status\n2. **Diet:**\n- 2-gram low sodium, low cholesterol diet\n3. Oxygenation:\n- titrate O2 to maintain SpO2>92%"
   }
  ],
  io: [],
  documents: [
   {
    id: "charlesjones-d6",
    title: "Shift Assessments",
    category: "assessments",
    md: "Complete and save a head-to-toe assessment in Assessments for each shift."
   },
   {
    id: "charlesjones-d9",
    title: "Printable assessment form",
    category: "documents",
    md: "[Open assessment PDF](assets/ATU_Head_to_Toe_Checkbox_Assessment_Interactive.pdf)"
   },
   {
    id: "charlesjones-d14",
    title: "Input/Output Record",
    category: "io",
    md: "## Intake Record\nDay 1\n\n| Time | PO Intake | IV Fluids | Type of Fluid | Total Intake |\n| --- | --- | --- | --- | --- |\n\n# Output day 1\n\n| Time | Urine | Emesis | Blood Loss | Total Output |\n| --- | --- | --- | --- | --- |\n\n## Day 2\n\n| Time | PO Intake | IV Fluids | Type of Fluid | Total Intake |\n| --- | --- | --- | --- | --- |\n\n# Output day 2\n\n| Time | Urine | Emesis | Blood Loss | Total Output |\n| --- | --- | --- | --- | --- |"
   }
  ],
  events: [
   {
    id: "charlesjones-ev1",
    title: "Shift 3",
    orders: [
     {
      id: "charlesjones-ev1-o1-0",
      cat: "Lab",
      text: "A1C and CMP now . Call MD when you get results",
      by: "Dr. Burris"
     },
     {
      id: "charlesjones-ev1-o1-1",
      cat: "Nursing",
      text: "Remove foley",
      by: "Dr. Burris"
     },
     {
      id: "charlesjones-ev1-o1-2",
      cat: "Lab",
      text: "Glucose Checks AC and HS. Follow sliding scale on admission orders,",
      by: "Dr. Burris"
     }
    ],
    labs: [
     {
      id: "charlesjones-ev1-l0-0",
      panel: "Shift 3 Labs",
      at: 0,
      results: [
       {
        t: "Sodium",
        v: "137",
        lo: 136,
        hi: 145
       },
       {
        t: "Potassium",
        v: "3.8",
        lo: 3.5,
        hi: 5
       },
       {
        t: "Chloride",
        v: "104",
        lo: 98,
        hi: 106
       },
       {
        t: "HCO3",
        v: "29",
        lo: 23,
        hi: 30
       },
       {
        t: "BUN",
        v: "25",
        lo: 8,
        hi: 20
       },
       {
        t: "Creatinine",
        v: "1.5",
        lo: 0.6,
        hi: 1.5
       },
       {
        t: "Glucose",
        v: "110",
        lo: 70,
        hi: 110
       }
      ]
     },
     {
      id: "charlesjones-ev1-l0-1",
      panel: "Shift 3 Labs",
      at: 0,
      results: [
       {
        t: "Hemoglobin A1c",
        v: "9.5",
        ref: "blood sugar average of 226"
       }
      ]
     }
    ],
    instructorNotes: "MAR — Shift 3: **Day Shift (7 AM–7 PM)** - Lisinopril 20 mg | PO | Due 0900 - Metoprolol 50 mg | PO | Due 0900 - Amiodarone 200 mg | PO | Due 0900 - Digoxin 0.125 mg | PO | Due 0900 - Metformin 1000 mg | PO | Due 0800 - Insulin per AC/HS sliding scale | Subcutaneous | Due AC/HS - Spironolactone 12.5 mg | PO | Due HELD while receiving Lasix"
   },
   {
    id: "charlesjones-ev2",
    title: "Shift 4",
    orders: [
     {
      id: "charlesjones-ev2-o3-0",
      cat: "Nursing",
      text: "Shift 4 orders new orders — No additional orders entered. Record new provider orders in the Provider Orders section",
      by: "Dr. Burris"
     }
    ],
    labs: [
     {
      id: "charlesjones-ev2-l0-0",
      panel: "Shift 4 Urinalysis",
      at: 0,
      results: [
       {
        t: "Glucose",
        v: "Negative",
        ref: "Negative"
       },
       {
        t: "Bilirubin, total",
        v: "Negative",
        ref: "Negative"
       },
       {
        t: "Ketones",
        v: "Negative",
        ref: "Negative"
       },
       {
        t: "Specific Gravity",
        v: "1.0",
        lo: 1,
        hi: 1.03
       },
       {
        t: "Blood",
        v: "trace",
        flag: "A",
        ref: "Negative"
       },
       {
        t: "Protein",
        v: "Negative",
        ref: "Negative"
       },
       {
        t: "WBC",
        v: "28",
        ref: "<5"
       },
       {
        t: "Nitrates",
        v: "positive",
        flag: "A",
        ref: "Negative"
       },
       {
        t: "Leukocytes",
        v: "trace",
        flag: "A",
        ref: "Negative"
       },
       {
        t: "Appearance",
        v: "cloudy",
        flag: "A",
        ref: "Yellow"
       },
       {
        t: "Color",
        v: "dark amber",
        flag: "A",
        ref: "Clear"
       }
      ]
     },
     {
      id: "charlesjones-ev2-l1-0",
      panel: "Shift 4 Follow-up Labs",
      at: 0,
      results: [
       {
        t: "Sodium",
        v: "137",
        lo: 136,
        hi: 145
       },
       {
        t: "Potassium",
        v: "4.0",
        lo: 3.5,
        hi: 5
       },
       {
        t: "Chloride",
        v: "104",
        lo: 98,
        hi: 106
       },
       {
        t: "HCO3",
        v: "29",
        lo: 23,
        hi: 30
       },
       {
        t: "BUN",
        v: "20",
        lo: 8,
        hi: 20
       },
       {
        t: "Creatinine",
        v: "1.5",
        lo: 0.6,
        hi: 1.5
       },
       {
        t: "Glucose",
        v: "100",
        lo: 70,
        hi: 110
       }
      ]
     },
     {
      id: "charlesjones-ev2-l1-1",
      panel: "Shift 4 Follow-up Labs",
      at: 0,
      results: [
       {
        t: "Lactate",
        v: "≥ 2 mmol/L",
        ref: "<2MMO/L"
       }
      ]
     },
     {
      id: "charlesjones-ev2-l1-2",
      panel: "Shift 4 Follow-up Labs",
      at: 0,
      results: [
       {
        t: "Hgb",
        v: "13.2",
        lo: 12.1,
        hi: 15.1
       },
       {
        t: "HCT",
        v: "39.4",
        lo: 36.1,
        hi: 44.3
       },
       {
        t: "WBC",
        v: "18000",
        lo: 4.5,
        hi: 10000
       },
       {
        t: "RBC",
        v: "3.24",
        lo: 4.2,
        hi: 5.4
       },
       {
        t: "MCV",
        v: "96",
        lo: 80,
        hi: 99
       },
       {
        t: "MCH",
        v: "30",
        lo: 27,
        hi: 31
       },
       {
        t: "MCHC",
        v: "34.2",
        lo: 32,
        hi: 36
       },
       {
        t: "Platelets",
        v: "140",
        lo: 140,
        hi: 400
       }
      ]
     }
    ],
    instructorNotes: "MAR — Shift 4: **Night Shift (7 PM–7 AM)** - Warfarin 2.5 mg | PO | Due 2100 - Insulin per AC/HS sliding scale | Subcutaneous | Due AC/HS"
   },
   {
    id: "charlesjones-ev3",
    title: "Shift 2",
    orders: [
     {
      id: "charlesjones-ev3-o3-0",
      cat: "Nursing",
      text: "Shift 2 orders new orders — No additional orders entered. Record new provider orders in the Provider Orders section",
      by: "Dr. Burris"
     }
    ],
    labs: [
     {
      id: "charlesjones-ev3-l0-0",
      panel: "Shift 2 Labs",
      at: 0,
      results: [
       {
        t: "Sodium",
        v: "137",
        lo: 136,
        hi: 145
       },
       {
        t: "Potassium",
        v: "3.2",
        lo: 3.5,
        hi: 5
       },
       {
        t: "Chloride",
        v: "104",
        lo: 98,
        hi: 106
       },
       {
        t: "HCO3",
        v: "29",
        lo: 23,
        hi: 30
       },
       {
        t: "BUN",
        v: "30",
        lo: 8,
        hi: 20
       },
       {
        t: "Creatinine",
        v: "1.5",
        lo: 0.6,
        hi: 1.5
       },
       {
        t: "Glucose",
        v: "130",
        lo: 70,
        hi: 110
       },
       {
        t: "Calcium",
        v: "9.5",
        lo: 8.5,
        hi: 10.5
       },
       {
        t: "Magnesium",
        v: "2.0",
        lo: 1.5,
        hi: 2
       },
       {
        t: "Cholesterol",
        v: "220",
        ref: "<200"
       },
       {
        t: "Triglycerides",
        v: "145",
        lo: 10,
        hi: 150
       },
       {
        t: "ALT",
        v: "16",
        lo: 10,
        hi: 35
       },
       {
        t: "AST",
        v: "24",
        lo: 14,
        hi: 20
       },
       {
        t: "Bilirubin, total",
        v: "1.0",
        lo: 0.3,
        hi: 1
       }
      ]
     }
    ],
    imaging: [
     {
      id: "charlesjones-ev3-im1",
      study: "Shift 2 Chest X-ray Results",
      text: "**View:** [PA and Lateral / AP Portable] Chest X-ray\n**Findings:**\n- There is **blunting of the right costophrenic angle**, consistent with a **moderate right pleural effusion**.\n- **Meniscus sign** is present, indicating fluid layering in the right pleural space.\n- The right hemidiaphragm is **partially obscured**.\n- There is a **mild shift of the mediastinum to the left**, suggesting volume effect from the effusion.\n- The underlying lung fields on the right are **partially obscured**, but no obvious consolidation or mass is seen.\n- The left lung appears **clear**, and the left costophrenic angle is **sharp**.\n- Cardiac silhouette is **within normal limits**.\n- No evidence of pneumothorax or acute bony abnormalities.\n**Impression:**\n- **Right-sided pleural effusion**, moderate in volume.",
      images: [
       "assets/imported/7a9b97e711c726af17.png"
      ]
     }
    ],
    instructorNotes: "MAR — Shift 2: **Night Shift (7 PM–7 AM)** - Warfarin 2.5 mg | PO | Due 2100 - Insulin per AC/HS sliding scale | Subcutaneous | Due AC/HS"
   }
  ],
  hpi: "Mr. Jones presented to the emergency department two days ago with dyspnea, orthopnea, fatigue, a weight gain of 10 pounds, and ankle edema. His appetite is poor, he complains of slight nausea, no emesis. Patient has received IV Lasix twice daily and has diuresed approximately 2 L (weight down 4 lbs). Last lung auscultation revealed fine rales in the bases bilaterally, no cough, and 2+ edema in lower extremities."
 },
 {
  id: "janefowler",
  level: 1,
  experiences: [
   "ms"
  ],
  source: "ATU-Simulation-Hospital (Notion)",
  name: {
   first: "Jane",
   last: "Fowler"
  },
  mrn: "SIM-204051",
  dob: "1947-01-28",
  age: "79 years",
  sex: "F",
  unit: "Surgical Unit — Pre-Op",
  room: "204",
  service: "Gynecologic Surgery",
  attending: "Dr. Smith",
  admitted: {
   at: -240
  },
  scenarioStart: "08:00",
  admitDx: "Ovarian cancer — preoperative total abdominal hysterectomy with bilateral salpingo-oophorectomy",
  codeStatus: "Full Code",
  isolation: "Standard",
  nkda: true,
  allergies: [],
  heightCm: null,
  weightKg: 60,
  assessmentForms: [
   "wdl-adult",
   "pain",
   "braden",
   "morse"
  ],
  bloodType: "A+",
  demographics: {
   Surgery: "Total abdominal hysterectomy with bilateral salpingo-oophorectomy and surgical staging",
   Scenario: "Postoperative opioid intoxication / respiratory depression"
  },
  orders: [
   {
    id: "janefowler-o1",
    cat: "Admission",
    text: "Admit to Surgical Pre-Op for preoperative total abdominal hysterectomy with bilateral salpingo-oophorectomy",
    at: -240,
    by: "Dr. Smith"
   },
   {
    id: "janefowler-o2",
    cat: "Nursing",
    text: "Vital signs every 30 minutes until surgery",
    at: -240,
    by: "Dr. Smith"
   },
   {
    id: "janefowler-o3",
    cat: "IV Fluids",
    text: "Lactated Ringer's solution (LR) at 125 mL/hr",
    at: -240,
    by: "Dr. Smith"
   },
   {
    id: "janefowler-o4",
    cat: "Diet",
    text: "NPO",
    at: -240,
    by: "Dr. Smith"
   },
   {
    id: "janefowler-o5",
    cat: "Code Status",
    text: "Full Code",
    at: -240,
    by: "Dr. Smith"
   },
   {
    id: "janefowler-o6",
    cat: "Nursing",
    text: "Obtain sterilization consent, blood-administration consent, and surgical consent for total abdominal hysterectomy with bilateral salpingo-oophorectomy",
    at: -240,
    by: "Dr. Smith"
   },
   {
    id: "janefowler-o7",
    cat: "Lab",
    text: "Obtain CBC, urine hCG, BMP, and blood type",
    at: -240,
    by: "Dr. Smith"
   },
   {
    id: "janefowler-o8",
    cat: "Nursing",
    text: "Insert indwelling urinary catheter",
    at: -240,
    by: "Dr. Smith"
   },
   {
    id: "janefowler-o12",
    cat: "Nursing",
    text: "Apply bilateral sequential compression devices (SCDs)",
    at: -240,
    by: "Dr. Smith"
   },
   {
    id: "janefowler-o13",
    cat: "Nursing",
    text: "Prepare the abdomen: shave as needed and cleanse with antibacterial wipes",
    at: -240,
    by: "Dr. Smith"
   },
   {
    id: "janefowler-o14",
    cat: "Nursing",
    text: "Complete the surgical checklist and time-out documentation",
    at: -240,
    by: "Dr. Smith"
   },
   {
    id: "janefowler-o15",
    cat: "Nursing",
    text: "Teach postoperative incision splinting and incentive-spirometer use",
    at: -240,
    by: "Dr. Smith"
   }
  ],
  meds: [
   {
    id: "jane-lactated-ringer-s-soluti-0",
    name: "Lactated Ringer’s solution (LR)",
    dose: "125 mL/hr",
    route: "IV infusion",
    freq: "Continuous",
    type: "continuous",
    rate: "125 mL/hr"
   },
   {
    id: "jane-cefazolin-1",
    name: "Cefazolin (Ancef)",
    dose: "2 g in 250 mL",
    route: "IVPB",
    freq: "On call to OR; infuse over 1 hour",
    type: "once",
    doses: [
     {
      at: 0
     }
    ]
   },
   {
    id: "jane-metoclopramide-2",
    name: "Metoclopramide (Reglan)",
    dose: "10 mg (10 mg/2 mL)",
    route: "IV",
    freq: "Once",
    type: "once",
    doses: [
     {
      at: 0
     }
    ]
   },
   {
    id: "jane-midazolam-3",
    name: "Midazolam (Versed)",
    dose: "1 mg (5 mg/mL)",
    route: "IV",
    freq: "On call to OR",
    type: "once",
    highAlert: true,
    doses: [
     {
      at: 0
     }
    ]
   }
  ],
  vitals: [
   {
    at: -120,
    temp: 98.9,
    hr: 89,
    rr: 20,
    sbp: 124,
    dbp: 76,
    spo2: 97,
    pain: 0,
    note: "Admit",
    by: "SE"
   },
   {
    time: "13:27",
    temp: 97.9,
    hr: 86,
    rr: 19,
    sbp: 123,
    dbp: 84,
    spo2: 99,
    pain: 0,
    note: "today",
    by: "EH"
   }
  ],
  labs: [
   {
    id: "janefowler-l3-1-0",
    panel: "Admission labs-Fowler",
    at: -240,
    results: [
     {
      t: "Hgb",
      v: "11.8",
      lo: 12,
      hi: 16,
      u: "g/dL"
     },
     {
      t: "HCT",
      v: "36",
      lo: 36,
      hi: 48,
      u: "%"
     },
     {
      t: "WBC",
      v: "11.5",
      lo: 4.5,
      hi: 10.5,
      u: "×10⁹/L"
     },
     {
      t: "Platelets",
      v: "220",
      lo: 150,
      hi: 400,
      u: "×10⁹/L"
     }
    ]
   },
   {
    id: "janefowler-l3-2-0",
    panel: "Admission labs-Fowler",
    at: -240,
    results: [
     {
      t: "Sodium",
      v: "140",
      lo: 136,
      hi: 145,
      u: "mEq/L"
     },
     {
      t: "Potassium",
      v: "4.1",
      lo: 3.5,
      hi: 5.5,
      u: "mEq/L"
     },
     {
      t: "Chloride",
      v: "104",
      lo: 98,
      hi: 106,
      u: "mEq/L"
     },
     {
      t: "HCO3",
      v: "25",
      lo: 23,
      hi: 30,
      u: "mEq/L"
     },
     {
      t: "BUN",
      v: "18",
      lo: 8,
      hi: 20,
      u: "mg/dL"
     },
     {
      t: "Creatinine",
      v: "1.0",
      lo: 0.4,
      hi: 1,
      u: "mg/dL"
     },
     {
      t: "Glucose",
      v: "108",
      lo: 70,
      hi: 110,
      u: "mg/dL"
     },
     {
      t: "Blood type",
      v: "A+"
     }
    ]
   },
   {
    id: "janefowler-l3-3-0",
    panel: "Admission labs-Fowler",
    at: -240,
    results: [
     {
      t: "Pregnancy Test",
      v: "Negative",
      ref: "hCG"
     },
     {
      t: "Urinalysis",
      v: "Negative"
     }
    ]
   }
  ],
  imaging: [
   {
    id: "janefowler-im1",
    study: "CT Results",
    at: -180,
    text: "**CT ABDOMEN AND PELVIS**\n**Patient:** Jane Fowler\n**Referring Physician:** Dr. Smith\n**Clinical Indication:** Abdominal pain and evaluation of suspected adnexal mass; concern for ovarian neoplasm.\n**Findings:**\n**Liver, Gallbladder, Biliary Tree:**\nNormal in size and attenuation. No focal hepatic lesions or biliary ductal dilation.\n**Pancreas:**\nUnremarkable. No masses identified.\n**Spleen:**\nNormal in size and appearance.\n**Kidneys and Adrenals:**\nBoth kidneys are normal in size and contour; no masses, stones, or hydronephrosis. Adrenal glands are unremarkable.\n**Bowel and Mesentery:**\nNo evidence of bowel obstruction or wall thickening. Mesenteric fat planes are preserved.\n**Lymph Nodes:**\nNo pathologically enlarged lymph nodes in the abdomen or pelvis.\n**Uterus and Adnexa:**\nA heterogenous soft-tissue mass is seen in the right adnexal region measuring approximately 3.12 cm. The mass demonstrates solid components with irregular margins and is in close relation to the right ovary, concerning for tumor involvement or direct invasion of the right ovary. The left ovary appears unremarkable. The uterus is normal in size and contour.\n**Peritoneal Cavity:**\nNo definite peritoneal implants or omental caking identified.",
    images: [
     "assets/imported/fe6431c4023fdd7641.png"
    ]
   },
   {
    id: "janefowler-im5",
    study: "CT Abdomen and Pelvis",
    at: -180,
    text: "**CT Abdomen and Pelvis Result**\n\nLarge right ovarian tumor with possible local invasion. Findings correlate with the patient’s pelvic pressure, bloating, constipation, and palpable right ovary.",
    images: [
     "assets/imported/jane-fowler-ct.png"
    ]
   }
  ],
  notes: [
   {
    id: "janefowler-n4",
    type: "History and Physical",
    author: "Dr. Smith",
    at: -270,
    md: true,
    text: "## History and Physical\n\n**Date of Admission:** Today\n**Patient Name:** Jane Fowler\n**Chief Complaint:** Pelvic pressure, bloating, and constipation\n**DOB:** 01/28/XXXX\n**Admitting Physician:** Dr. Smith\n**Age/Sex:** 79-year-old female\n**Source of History:** Patient and daughter\n\n### History of Present Illness\n\nJane Fowler has been experiencing pelvic pressure, bloating, and constipation. Her primary provider could palpate her right ovary. An abdominal CT scan showed a tumor with possible invasion of the right ovary. She is admitted for a total abdominal hysterectomy with bilateral salpingo-oophorectomy and surgical staging today.\n\n### Past Medical History\n\n- No history of surgeries\n- No significant medical history\n\n### Allergies\n\n- NKDA\n\n### Social History\n\n- Lives alone\n- No tobacco, alcohol, or drug use\n\n### Home Medications\n\n- Acetaminophen (Tylenol) 650 mg as needed\n- Polyethylene glycol 3350 (MiraLAX) daily\n- Docusate sodium (Colace) daily\n- Melatonin (Natrol) 3 mg every night\n- Escitalopram (Lexapro) 10 mg PO daily\n\n### Assessment\n\nShe is alert and oriented to time, person, place, and situation. Heart rate and rhythm are regular. Lungs are clear to auscultation; oxygen saturation is 97% on room air. The abdomen is slightly distended and tender to light palpation, with rebound tenderness present.\n\n### Plan\n\n1. Total abdominal hysterectomy with bilateral salpingo-oophorectomy and surgical staging.\n   - Cefazolin (Ancef) 2 g IV once on call to the operating room.\n2. Hydration and preoperative care.\n   - Lactated Ringer’s solution (LR) IV at 125 mL/hr.\n   - NPO.\n   - Sequential compression devices.\n   - Indwelling Foley catheter.\n3. Disposition.\n   - Admit to the medical-surgical floor for close monitoring."
   },
   {
    id: "janefowler-n8",
    type: "Surgery Admit Note",
    author: "Dr. Smith",
    at: -240,
    md: true,
    text: "### **Surgery Admission Note**\n**Date of Admission:** today\n\n**Patient Name:** Jane Fowler\n**Chief Complaint:** Pelvic pressure, bloating, and constipation.\n\n**DOB:** 01/28/XXXX\n**Admitting Physician:** Dr. Smith\n\n**Age/Sex:** 79-year-old female\n**Source of History:** Patient and Daughter\n\n### **History of Present Illness:**\nJane Fowler has been experiencing pelvic pressure, bloating, and constipation. Her primary provider could palpate her right ovary. An abdominal CT scan showed a tumor with possible invasion on the right ovary. She is here for a total abdominal hysterectomy with bilateral salpingo-opherectomy and surgical staging will be completed today.\n\n### **Past Medical History**\n- No history of surgeries\n- No significant medical history\n\n### **Allergies**\n- **NKDA**\n\n### **Social History**\n- Lives alone\n- No tobacco, alcohol, or drug use\n\n### **Medications**\n- Tylenol 650mg as needed\n- MiraLAX daily\n- Colace daily\n- Melatonin 3mg every night\n- Escitalopram 10mg Po daily\n\n### **Assessment**\nShe is alert and oriented to time, person, place, and situation. Heart rate and rhythm are regular. Lungs are clear to auscultation; oxygen saturation has been 97% on room air. The abdomen is slightly distended and tender to light palpation, with rebound tenderness present.\n### **Plan**\n1.  Total abdominal hysterectomy with bilateral salpingo-opherectomy and surgical staging\n- Cefazolin 2 grams IV x 1 on call to OR\n2. **Hydration:**\n- IV fluids Lactated Ringers at 125 ml/hr\n- NPO\n- SCDs\n- indwelling foley catheter.\n3. **Disposition:**\n- **Admit to Medical Surgical Floor** for close monitoring"
   },
   {
    id: "janefowler-cn0",
    type: "Admission Nursing Note",
    author: "S. Escobar RN",
    at: -210,
    text: "Jane Fowler, a 79-year-old female, was admitted to the surgical unit in preparation for a scheduled total hysterectomy under the care of Dr. Smith. Patient arrived to the unit ambulatory, awake, alert, and oriented ×4, and in no acute distress."
   }
  ],
  io: [],
  documents: [
   {
    id: "janefowler-d9",
    title: "Preop-Nurse Checklist",
    category: "documents",
    md: "---\n- [ ] Shift assessment completed\n- [ ] **Two patient identifiers verified** (Full name + DOB) against ID band and EMR\n- [ ] Patient verbally confirms planned procedure in own words\n- *Expected:* “Hysterectomy with removal of ovaries and tubes”\n---\n- [ ] **Informed consent present**, signed, dated, and timed\n- [ ] Consent specifies:\n- [ ] Hysterectomy\n- [ ]  Bilateral salpingo-oophorectomy\n- [ ] Blood\n- [ ] Sterilization\n- [ ] History & Physical on chart\n- [ ] Code status ordered\n- [ ] Advance directives reviewed (if applicable)\n---\n- [ ] Allergies _______________________________)\n- [ ]  Is the patient a Fall risk\n---\n- [ ] labs reviewed and reported to MD of indicated\n- [ ]  hCG pregnancy test results negative\n---\n- [ ] Home medications\n- [ ] ___________________________ last taken ______________________\n- [ ] ___________________________ last taken ______________________\n- [ ] ___________________________ last taken ______________________\n- [ ] ___________________________ last taken ______________________\n- [ ] ___________________________ last taken ______________________\n- [ ] ___________________________ last taken ______________________\n- [ ]  Antibiotic ______________________started at _____________________\n- [ ] IV: Location _______________; Fluids infusing________________ @________________________\n---\n- [ ] NPO status verified and documented\n- [ ] Time of last oral intake @_____________________\n- [ ]  Baseline vital signs\n- [ ] Temp: _____________\n- [ ] Heart Rate___________\n- [ ] Resp Rate ___________\n- [ ] Blood Pressure ________\n- [ ] Pain_______________\n---\n- [ ]  Pre-operative abdominal cleaning completed.\n- [ ]  Shave Prep completed\n- [ ] All Jewelry removed\n- [ ]  Dentures, glasses, hearing aids removed and secured\n---\n- [ ]  Sequential compression devices applied\n- [ ] Foley catheter inserted at ___________ by __________________. Foley Cath ______FR and ballon volume __________ml\n---\n---\n- [ ]  Procedure and perioperative expectations reviewed\n- [ ]  Patient questions addressed\n- [ ] Discussed splinting procedures for post op.\n- [ ] Discussed incentive spirometer.\n---\n- [ ] Call Surgery for Verbal handoff. Given to ____________________ @ _______________\n---"
   },
   {
    id: "janefowler-d10",
    title: "Printable assessment form",
    category: "documents",
    md: "[Open assessment PDF](assets/ATU_Head_to_Toe_Checkbox_Assessment_Interactive.pdf)"
   }
  ],
  events: [
   {
    id: "janefowler-ev1",
    title: "Post-Op Progress Notes & Orders",
    orders: [
     {
      id: "janefowler-ev1-o0-0",
      cat: "Diet",
      text: "Diet: Sips of water; advance to clear liquids as tolerated",
      by: "Dr. Smith"
     },
     {
      id: "janefowler-ev1-o0-1",
      cat: "Activity",
      text: "Activity: Out of bed tonight",
      by: "Dr. Smith"
     },
     {
      id: "janefowler-ev1-o0-2",
      cat: "Nursing",
      text: "Postoperative vital signs per protocol",
      by: "Dr. Smith"
     },
     {
      id: "janefowler-ev1-o0-3",
      cat: "Nursing",
      text: "Titrate oxygen to maintain pulse oximetry of 98% or greater",
      by: "Dr. Smith"
     },
     {
      id: "janefowler-ev1-o0-4",
      cat: "IV Fluids",
      text: "Lactated Ringer’s solution (LR) IV at 125 mL/hr",
      by: "Dr. Smith"
     },
     {
      id: "janefowler-ev1-o0-5",
      cat: "Nursing",
      text: "Continue sequential compression devices (SCDs)",
      by: "Dr. Smith"
     },
     {
      id: "janefowler-ev1-o0-6",
      cat: "Nursing",
      text: "Maintain indwelling Foley catheter",
      by: "Dr. Smith"
     },
     {
      id: "janefowler-ev1-o0-7",
      cat: "Nursing",
      text: "Intake and output every 4 hours; notify the provider for urine output less than 30 mL/hr",
      by: "Dr. Smith"
     },
     {
      id: "janefowler-ev1-o0-8",
      cat: "IV Fluids",
      text: "Morphine sulfate (Duramorph) 2 mg IV push PRN pain; may repeat up to 10 mg every 4 hours. Available concentration: 2 mg/1 mL",
      by: "Dr. Smith"
     },
     {
      id: "janefowler-ev1-o0-9",
      cat: "IV Fluids",
      text: "Ondansetron (Zofran) 4 mg IV push every 4 hours PRN nausea. Available concentration: 4 mg/2 mL",
      by: "Dr. Smith"
     },
     {
      id: "janefowler-ev1-o0-10",
      cat: "Consult",
      text: "Consult oncology in AM",
      by: "Dr. Smith"
     },
     {
      id: "janefowler-ev1-o0-11",
      cat: "Admission",
      text: "Transfer to the surgical floor",
      by: "Dr. Smith"
     }
    ],
    meds: [
     {
      id: "jane-morphine-sulfate-104",
      name: "Morphine sulfate (Duramorph)",
      dose: "2 mg/1 mL",
      route: "IV push",
      freq: "Every 4 hours PRN; may repeat up to 10 mg every 4 hours",
      type: "prn",
      highAlert: true,
      indication: "; may repeat up to 10 mg every 4 hours",
      minIntervalHr: 4
     },
     {
      id: "jane-ondansetron-105",
      name: "Ondansetron (Zofran)",
      dose: "4 mg (4 mg/2 mL)",
      route: "IV push",
      freq: "Every 4 hours PRN nausea",
      type: "prn",
      indication: "nausea",
      minIntervalHr: 4
     }
    ]
   },
   {
    id: "janefowler-ev2",
    title: "Postoperative MAR",
    instructorNotes: "Postoperative MAR: > 🎫 You must enter any newly ordered medications on the MAR to chart that they are given. | Medication | Time Due | Last Time given/Initials | Time given/Initials | | --- | --- | --- | --- | | Morphine sulfate (Duramorph) 2mg IVP as needed for pain; may repeat/titrate to a maximum of 10 mg per dose, not to exceed more that 10mg every 4 hours. |  |  | 14:26/SF | | Zofran 4 mg IVP every 4 hours as needed for nausea and vomiting. |  |  | 14:45/SF | | IV: LR @125ml/hr |  | Running |  | | Ketorolac (Toradol) 30mg IV push STAT |  |  | 14:45/SF | | Narcan 1mL IV |  |  | 14:31/SF |"
   },
   {
    id: "janefowler-ev3",
    title: "Naloxone (Narcan) 0.2 mg IV push",
    meds: [
     {
      id: "jane-naloxone-106",
      name: "Naloxone (Narcan)",
      dose: "0.2 mg (0.4 mg/mL)",
      route: "IV push",
      freq: "Every 2–3 minutes PRN respiratory rate less than 6/min or change in level of consciousness",
      type: "prn",
      highAlert: true,
      indication: "respiratory rate less than 6/min or change in level of consciousness"
     }
    ]
   },
   {
    id: "janefowler-ev4",
    title: "Ketorolac (Toradol) 30 mg IV push",
    meds: [
     {
      id: "jane-ketorolac-107",
      name: "Ketorolac (Toradol)",
      dose: "30 mg (30 mg/mL)",
      route: "IV push",
      freq: "Once now",
      type: "once",
      doses: [
       {
        at: 0
       }
      ]
     }
    ]
   },
   {
    id: "janefowler-ev5",
    title: "Shift 2",
    documents: [
     {
      id: "janefowler-ev5-d1",
      title: "Shift 2 Fowler",
      md: "Postoperative provider notes, orders, MAR and vital signs are in their chart sections. Complete each shift assessment in Assessments."
     }
    ],
    vitals: [
     {
      temp: 97.5,
      hr: 93,
      rr: 12,
      sbp: 141,
      dbp: 85,
      spo2: 92,
      pain: 6,
      by: "TS",
      at: 0
     },
     {
      temp: 98,
      hr: 96,
      rr: 12,
      sbp: 142,
      dbp: 84,
      spo2: 98,
      o2: "Nasal cannula",
      o2Flow: 2,
      pain: 6,
      by: "RN",
      at: 5
     },
     {
      temp: 98.2,
      hr: 89,
      rr: 11,
      sbp: 119,
      dbp: 60,
      spo2: 95,
      o2: "Nasal cannula",
      o2Flow: 2,
      pain: 7,
      by: "TS",
      at: 10
     },
     {
      hr: 53,
      rr: 0,
      sbp: 95,
      dbp: 38,
      spo2: 70,
      pain: 2,
      by: "TS",
      at: 15
     },
     {
      hr: 95,
      rr: 12,
      sbp: 139,
      dbp: 62,
      spo2: 93,
      o2: "Nasal cannula",
      o2Flow: 5,
      by: "TS",
      at: 20
     },
     {
      temp: 97.9,
      hr: 94,
      rr: 12,
      sbp: 142,
      dbp: 65,
      spo2: 95,
      o2: "Nasal cannula",
      o2Flow: 7,
      by: "TS",
      at: 25
     }
    ]
   }
  ],
  facultyGuide: [
   {
    title: "Jane Fowler Faculty Simulation Guide",
    md: "Shift 1\n\nSituation\nJane Fowler has experienced pelvic pressure, bloating, and constipation. Her primary provider palpated her right ovary. CT showed a right ovarian tumor with possible invasion. She is scheduled for a total abdominal hysterectomy with bilateral salpingo-oophorectomy and surgical staging.\n\nStarting findings\nT 98.9 F; HR 89; RR 20; BP 124/76; SpO2 97%. Alert and oriented x4; moves all extremities on command; denies pain; normoactive bowel sounds; clear breath sounds.\n\nStudent expectations\nIntroduce self; perform hand hygiene; review orders; verify two identifiers; complete initial assessment and vital signs; explain the plan of care; begin IV fluids; verify consents and complete the pre-op checklist; insert the urinary catheter; teach incentive spirometry, leg exercises, splinting, coughing, and deep breathing; administer the ordered antibiotic using medication rights.\n\nShift 2\n\nSituation\nPostoperative total abdominal hysterectomy with bilateral salpingo-oophorectomy under general anesthesia. The patient tolerated surgery without complications. Abdominal incision is covered with a 4 x 4 gauze dressing with no drainage. Lactated Ringer's solution is infusing at 125 mL/hr after 2 L received during surgery. Estimated blood loss was 400 mL. She was extubated in the operating room and is breathing spontaneously. Foley catheter is present with 200 mL urine output.\n\nStarting findings\nT 97.9 F; HR 98; RR 17; BP 143/86; SpO2 93%. Pale; responds to name; moves extremities on command; moaning; hypoactive bowel sounds; clear breath sounds.\n\nStudent expectations\nIntroduce self; perform hand hygiene; review orders; verify two identifiers; complete the initial assessment and apply cardiopulmonary monitoring; recognize the low SpO2 and apply oxygen; assess pain; explain the plan of care. When the patient reports pain 6/10, administer the released analgesic using medication rights. If the patient becomes unresponsive with RR 6 and SpO2 85%, recognize respiratory depression, begin bag-mask ventilation, notify anesthesia, administer released rescue medications, reassess, and monitor stability."
   }
  ],
  hpi: ""
 },
 {
  id: "ameliasung",
  level: 2,
  experiences: [
   "ob"
  ],
  source: "ATU-Simulation-Hospital (Notion)",
  name: {
   first: "Amelia",
   last: "Sung"
  },
  mrn: "SIM-201036",
  dob: "1990-12-08",
  age: "36 years",
  sex: "F",
  unit: "Labor & Delivery",
  room: "201",
  service: "Obstetrics",
  attending: "Dr. Darnell",
  admitted: {
   at: -240
  },
  scenarioStart: "08:00",
  admitDx: "Active labor / gestational diabetes",
  codeStatus: "Full Code",
  isolation: "Standard",
  nkda: false,
  allergies: [
   {
    agent: "Shellfish",
    reaction: "Not documented",
    severity: "Unknown",
    tags: [
     "shellfish"
    ]
   },
   {
    agent: "Penicillin",
    reaction: "Not documented",
    severity: "Unknown",
    tags: [
     "penicillin"
    ]
   }
  ],
  heightCm: null,
  weightKg: 83,
  flags: [
   "GBS Positive"
  ],
  assessmentForms: [
   "wdl-adult",
   "pain",
   "morse"
  ],
  bloodType: "O+",
  demographics: {
   "Gestational age": "39 weeks",
   Gravida: "2",
   Para: "1",
   GBS: "Positive",
   "Feeding plan": "Breastfeeding",
   Ethnicity: "Filipino"
  },
  orders: [
   {
    id: "ameliasung-o2",
    cat: "IV Fluids",
    text: "Lactated Ringer’s solution (LR) at 125 mL/hr",
    at: -240,
    by: "Dr. Darnell"
   },
   {
    id: "ameliasung-o6",
    cat: "Nursing",
    text: "Continuous fetal monitoring with bathroom privileges; vital signs per protocol. Clear liquid diet. Intake and output every shift",
    at: -240,
    by: "Dr. Darnell"
   }
  ],
  meds: [
   {
    id: "amel-oxytocin-0",
    name: "Oxytocin (Pitocin)",
    dose: "30 units in 500 mL sodium chloride 0.9%; start at 2 milliunits/min",
    route: "IV infusion",
    freq: "Increase by 2 milliunits/min every 15 minutes until contractions are every 2–3 minutes",
    type: "continuous",
    highAlert: true
   },
   {
    id: "amel-lactated-ringer-s-soluti-1",
    name: "Lactated Ringer’s solution (LR)",
    dose: "125 mL/hr",
    route: "IV infusion",
    freq: "Continuous",
    type: "continuous",
    rate: "125 mL/hr"
   },
   {
    id: "amel-clindamycin-2",
    name: "Clindamycin (Cleocin)",
    dose: "900 mg",
    route: "IVPB",
    freq: "Every 6 hours until delivery for GBS prophylaxis",
    type: "scheduled",
    doses: [
     {
      at: 0
     },
     {
      at: 360
     },
     {
      at: 720
     },
     {
      at: 1080
     }
    ]
   },
   {
    id: "amel-morphine-sulfate-3",
    name: "Morphine sulfate (Duramorph)",
    dose: "2 mg",
    route: "Slow IV push",
    freq: "Every 2 hours PRN pain",
    type: "prn",
    highAlert: true,
    indication: "pain",
    minIntervalHr: 2
   },
   {
    id: "amel-lidocaine-1-4",
    name: "Lidocaine (Xylocaine) 1%",
    dose: "Available at delivery",
    route: "Local infiltration",
    freq: "As needed at delivery",
    type: "prn",
    indication: "at delivery"
   }
  ],
  vitals: [],
  labs: [
   {
    id: "ameliasung-sl0",
    panel: "Admission CBC",
    at: -240,
    results: [
     {
      t: "Hgb",
      v: "10.7",
      lo: 12.1,
      hi: 15.1
     },
     {
      t: "HCT",
      v: "31.2",
      lo: 36.1,
      hi: 44.3
     },
     {
      t: "WBC",
      v: "12",
      lo: 4.5,
      hi: 10
     },
     {
      t: "RBC",
      v: "3.24",
      lo: 4.2,
      hi: 5.4
     },
     {
      t: "MCV",
      v: "96",
      lo: 80,
      hi: 99
     },
     {
      t: "MCH",
      v: "30",
      lo: 27,
      hi: 31
     },
     {
      t: "MCHC",
      v: "34.2",
      lo: 32,
      hi: 36
     },
     {
      t: "Platelets",
      v: "140",
      lo: 140,
      hi: 400
     }
    ]
   },
   {
    id: "ameliasung-sl1",
    panel: "Prenatal/Admission",
    at: -240,
    results: [
     {
      t: "Blood Type",
      v: "O+"
     }
    ]
   },
   {
    id: "ameliasung-sl2",
    panel: "Prenatal",
    at: -240,
    results: [
     {
      t: "HIV",
      v: "NEG"
     }
    ]
   },
   {
    id: "ameliasung-sl3",
    panel: "Group B Strep positive",
    at: -240,
    results: [
     {
      t: "GBS",
      v: "Positive",
      flag: "A"
     }
    ]
   }
  ],
  imaging: [],
  notes: [
   {
    id: "ameliasung-n2",
    type: "Progress note",
    author: "Dr. Darnell",
    at: -270,
    md: true,
    text: "## OB-GYN Admission Note\n\n**Patient:** Amelia Sung, 36-year-old Filipino female, G2 P1 at 39 weeks\n**Provider:** Dr. Darnell\n**Allergies:** Shellfish and Penicillin\n**Weight:** 83 kg\n\n### History\nAdmitted in active labor at 39 weeks with gestational diabetes. Cervix was 4 cm on admission. No epidural. AROM was 12 hours ago with clear fluid. Blood type O positive; GBS positive.\n\n### Plan\nContinue released orders, continuous fetal monitoring, maternal assessment, clindamycin GBS prophylaxis, and PRN morphine for pain."
   }
  ],
  io: [],
  documents: [
   {
    id: "ameliasung-d3",
    title: "Consents",
    category: "documents",
    md: "![](assets/imported/73cfe054591b0c71c4.jpg)\n![](assets/imported/f6395b74ad90eb7c44.jpg)\n![](assets/imported/673ef52df9fcd6f61f.jpg)\n![](assets/imported/c29471e5a98680d48d.jpg)"
   },
   {
    id: "ameliasung-d4",
    title: "Prenatal Record Amelia Sung",
    category: "prenatal",
    md: "## Prenatal Record — Amelia Sung\n\n- G2 P1 at 39 weeks\n- Blood type O positive\n- GBS positive\n- Diet-controlled gestational diabetes\n- Allergies: Shellfish and Penicillin\n- Previous vaginal delivery"
   },
   {
    id: "ameliasung-d5",
    title: "Labor & Delivery Input/Output Record SUNG",
    category: "io",
    md: "## Intake Record\n\n| Time | PO Intake | IV Fluids | Type of Fluid | Total Intake |\n| --- | --- | --- | --- | --- |\n\n## Output Record\n\n| Time | Urine | Emesis | Blood Loss | Total Output |\n| --- | --- | --- | --- | --- |\n\n##\n## Postpartum Bleeding Assessment\n\n| Time | Pad Count | Estimated Blood Loss | Clots | Fundal Status |\n| --- | --- | --- | --- | --- |"
   }
  ],
  events: [
   {
    id: "ameliasung-ev1",
    title: "Shift 2",
    documents: [
     {
      id: "ameliasung-ev1-d0",
      title: "Shift 2 — Shoulder Dystocia and Newborn Resuscitation",
      md: "Shoulder dystocia occurs during delivery. Newborn is limp and cyanotic with no respiratory effort. Move to warmer; dry and stimulate; remove wet towels; open the airway; suction as needed; assess heart rate for a full minute. Initial heart rate 100 and 1-minute SpO2 52%. Begin positive-pressure ventilation per neonatal resuscitation protocol and reassess. If heart rate falls to 60 with no respiratory effort, verify chest movement and reposition, then begin 3:1 chest compressions with ventilation. Continue until spontaneous breathing and heart rate above 100. Apgar: 1 minute = 2; 5 minutes = 7. Assess left arm movement and clavicle crepitus; notify pediatrician; evaluate for Erb palsy, hypoglycemia, and thermoregulation."
     }
    ]
   }
  ],
  facultyGuide: [
   {
    title: "Amelia Sung Faculty Simulation Guide",
    md: "36-year-old Filipino female, G2 P1 at 39 weeks, 83 kg. Allergies: shellfish and penicillin. Admitted in active labor with diet-controlled gestational diabetes; 4 cm on admission; no epidural; AROM 12 hours ago with clear fluid. Blood type O positive and GBS positive. Clindamycin is ordered for GBS prophylaxis, and morphine is ordered for pain. Faculty-only progression includes shoulder dystocia and newborn resuscitation."
   }
  ],
  hpi: "## Patient Overview\n\n- 36-year-old Filipino female; G2 P1; 39 weeks\n- Weight: 83 kg\n- Allergies: Shellfish and Penicillin\n- Blood type: O positive\n- GBS: Positive\n- Diet-controlled gestational diabetes\n- Admitted in active labor; 4 cm on admission; no epidural\n- AROM 12 hours ago with clear fluid"
 },
 {
  id: "babyboysung",
  level: 2,
  experiences: [
   "ob"
  ],
  source: "ATU-Simulation-Hospital (Notion)",
  name: {
   first: "Baby Boy",
   last: "Sung"
  },
  mrn: "201042",
  dob: "today",
  age: "Newborn",
  sex: "M",
  unit: "Newborn Nursery",
  room: "211E",
  service: "Pediatrics — Newborn",
  attending: "Dr. Craig",
  admitted: {
   at: -240
  },
  scenarioStart: "08:00",
  admitDx: "Newborn after vaginal delivery with shoulder dystocia",
  codeStatus: "Full Code",
  isolation: "Standard",
  nkda: true,
  allergies: [],
  heightCm: null,
  weightKg: 4.37,
  assessmentForms: [
   "pain"
  ],
  vitalRanges: {
   hr: [
    110,
    160
   ],
   rr: [
    30,
    60
   ],
   sbp: [
    60,
    90
   ],
   dbp: [
    30,
    60
   ],
   temp: [
    97.7,
    99.5
   ],
   spo2: [
    95,
    100
   ]
  },
  demographics: {
   "Gestational age": "39.1 weeks"
  },
  orders: [
   {
    id: "babyboysung-o1-0",
    cat: "Admission",
    text: "Admit to newborn care",
    at: -240,
    by: "Dr. Craig"
   },
   {
    id: "babyboysung-o1-1",
    cat: "Nursing",
    text: "Vitals: Axillary temp, heart rate, Resp rate every 30 mins x4 or repeat until stable, prior to and after bath, and prior to transfer to mother/baby care. Blood pressures in right extremity, also left extremities if heart murmur is present.",
    at: -240,
    by: "Dr. Craig"
   },
   {
    id: "babyboysung-o1-4",
    cat: "Medication",
    text: "Hepatitis B vaccine 0.5 ml IM anterior thigh x 1 if > 2000 gm with consent",
    at: -240,
    by: "Dr. Craig"
   },
   {
    id: "babyboysung-o1-5",
    cat: "Nursing",
    text: "Cord blood work up: Maternal type 0 pr RH negative blood or positive maternal ABS",
    at: -240,
    by: "Dr. Craig"
   },
   {
    id: "babyboysung-o1-6",
    cat: "Nursing",
    text: "Daily weight",
    at: -240,
    by: "Dr. Craig"
   },
   {
    id: "babyboysung-o1-8",
    cat: "Nursing",
    text: "Obtain measurements: Head, chest and abdomen, and length",
    at: -240,
    by: "Dr. Craig"
   }
  ],
  meds: [
   {
    id: "baby-vitamin-k-0",
    name: "Vitamin K",
    dose: "1 mg",
    route: "IM",
    freq: "Once",
    type: "scheduled",
    doses: [
     {
      time: "13:00"
     }
    ]
   },
   {
    id: "baby-erythromycin-ophthalmic--1",
    name: "Erythromycin ophthalmic ointment",
    dose: "0.5 mL ribbon",
    route: "Ophthalmic",
    freq: "Once both eyes",
    type: "scheduled",
    doses: [
     {
      time: "13:00"
     }
    ]
   },
   {
    id: "baby-glucose-gel-2",
    name: "Glucose gel",
    dose: "Per protocol",
    route: "PO",
    freq: "PRN hypoglycemia",
    type: "prn",
    indication: "hypoglycemia"
   }
  ],
  vitals: [],
  labs: [],
  imaging: [],
  notes: [],
  io: [],
  documents: [
   {
    id: "babyboysung-d2",
    title: "APGAR-Click here to assign Agars for 1 min/ 5 mins / 10 mins",
    category: "labor",
    md: "Document 1-, 5-, and 10-minute Apgar scores in the Newborn Assessment below."
   },
   {
    id: "babyboysung-d3",
    title: "Prenatal Record Amelia Sung",
    category: "prenatal",
    md: "## Patient Information\nName: Angela Sung\nDOB: 12/8/xxxx\nAge: 36 year old\nInsurance: self pay\nEmergency Contact: Husband\nPhone: phone on file\n## Current Pregnancy\nLMP: 9 months ago\nEDD: 7 days from now\nGestational Age: 39 weeks\nBlood Type: O +\n\n## Obstetric History\nGravida:2\nPara:1\nLiving Children: 1\nPrevious Pregnancies:\nPrevious Pregnancy Details:\n\n- Dates: 1/28/2022\n- Outcomes: vaginal delivery of 9#1 oz male\n- Complications: heavy bleeding\n- Delivery Method: vaginal delivery\n\n## Medical History\nPast Medical History:\n\n- Chronic Conditions: none\n- Surgeries: none\n- Medications: Prenatal vitamins\n- Allergies: shellfish and penicillin\n\n## Family History\n- Genetic Disorders: none\n- Birth Defects: none\n- Other Relevant History: none\n## Prenatal Visits\n\n|  | Weeks | Weight | BP | Fundal Height | Fetal Heart Rate | Notes |  |\n| --- | --- | --- | --- | --- | --- | --- | --- |\n| 10 | 38 | 69 kg | 145/90 | 38 in | 140 | Trace protein or ketones in urine. + fetal movement . Discussed labor signs of labor and when to go to L&D . Patient plans epidural. GBS swab positive , discussed need for clindamycin at delivery |  |\n| 9 | 37 | 68 kg | 134/89 | 37 in | 145 | No protein or ketones in urine+ fetal movement , Kick counts discussed. Pt states blood sugars are below 100 |  |\n| 8 | 36 | 68 kg | 138/80 | 36 in | 140 | No protein or ketones in urine. GBS swab collected and sent to lab |  |\n| 7 | 34 | 65 kg | 130/70 | 34.5 in | 135 | No protein or ketones in urine. Pt states + fetal movement Pt states blood sugars are below 100 |  |\n| 6 | 31.5 | 64 kg | 125/70 | 32 in | 140 | No protein or ketones in urine. PT C/O back pain. Urine tested, pt treated for UTI |  |\n| 5 | 28 | 61 kg | 120/80 | 29 in | 135 | No protein or ketones in urine. + fetal movement noted. |  |\n| 4 | 24 | 60kg | 125/75 | 24 in | 140 | No protein or ketones in urine, Pt states blood sugars are below 100 |  |\n| 3 | 20 | 58 kg | 125/65 | 20 ins | 140 | Anatomy ultrasound completed. Male fetus |  |\n| 2 | 16 | 55 kg | 120/70 | 16 in | 135 | Pt c/o Nausea and vomitting . Zofran called in . No protein or ketones noted in urine. Discussed glucose tolerance test, diet and testing |  |\n| 1 | 12 | 55 kg | 120/78 | 12 | 135 | Positive urine pregnancy at come and pt states she is experiencing N/V |  |\n\n## Laboratory Results\nFirst Trimester:\n\n- Blood Type and RH: O+\n- Rubella: Immune\n- Hepatitis B: neg\n- HIV: Neg\n- Syphilis: Neg\n\nSecond Trimester:\n\n- Glucose Challenge Test: abnormal\n- Alpha-Fetoprotein: normal\n- Multiple Marker Screen: low risk\n\nThird Trimester:\n\n- Group B Strep: Positive\n\n## Ultrasound Reports\n\n| Date | Gestational Age | Findings |\n| --- | --- | --- |\n|  | 21.3 weeks | Normal findings. Infant measuring 22.3 weeks. Male fetus |\n\n## Birth Plan\n- Delivery Preferences: vaginal delivery\n- Pain Management: None\n- Support Person: Husband\n- Special Requests: Delayed cord clamping and skin to skin at delivery\n## Risk Assessment\n- [ ] Gestational Diabetes\n- [ ] Multiple Pregnancy\n- [ ] Advanced Maternal Age\n# Quick links\n\nPrenatal Record Amelia Sung"
   },
   {
    id: "babyboysung-d4",
    title: "Newborn Glucose Management Policy",
    category: "orders",
    md: "## Newborn Glucose Management Policy\n\n<ul>\n<li>Patient: Baby Boy Sung</li>\n<li>Policy area: Newborn care</li>\n<li>Purpose: Prevention, screening, treatment, monitoring, and documentation of neonatal hypoglycemia.</li>\n</ul>\n\n---\n\n### Policy\n\n<ul>\n<li>Use for newborns at risk for unstable blood glucose or with signs or symptoms of hypoglycemia.</li>\n<li>Follow the provider's orders and notify the provider of any concerning result or change in condition.</li>\n</ul>\n\n### Definitions\n\n| Term | Definition |\n| --- | --- |\n| Hypoglycemia | Less than 45 mg/dL in a symptomatic newborn or less than 40 mg/dL in an asymptomatic newborn. |\n| LGA | Large for gestational age: 4,000 g or at or above the 90th percentile. |\n| AGA | Appropriate for gestational age: 2,500-4,000 g. |\n| SGA | Small for gestational age: below 2,500 g or at or below the 10th percentile. |\n| Macrosomia | Birth weight greater than 4,500 g. |\n| IUGR / FGR | Intrauterine or fetal growth restriction. |\n\n### Prevention of hypoglycemia\n\n<ol>\n<li>Promote skin-to-skin care after delivery and cover the parent-newborn dyad to conserve heat.</li>\n<li>Monitor newborn temperature and support thermoregulation of the infant and environment.</li>\n<li>Offer an early feed during transition. If breastfeeding, offer the first nursing opportunity within 30-60 minutes after birth.</li>\n<li>For at-risk newborns, encourage regular, frequent feeds.</li>\n</ol>\n\n### Who requires glucose screening\n\n<ul>\n<li>Screen within 30 minutes after feeding for SGA, LGA, IUGR/FGR, late-preterm (34-36 weeks), or infant-of-diabetic-parent risk factors.</li>\n<li>Check blood glucose immediately for any sign or symptom of hypoglycemia.</li>\n</ul>\n\nSymptoms of hypoglycemia:\n\n<ul>\n<li>Jitteriness, irritability, or high-pitched cry</li>\n<li>Apnea, cyanosis, irregular or rapid respirations</li>\n<li>Hypotonia or seizures</li>\n<li>Temperature instability or hypothermia</li>\n<li>Poor suck, poor feeding, or refusal to eat</li>\n</ul>\n\n### Clinical pathway for glucose management\n\n| Newborn status / result | Nursing action | Recheck / next step |\n| --- | --- | --- |\n| Asymptomatic, no risk factors | No additional glucose action required. | Continue routine newborn care. |\n| Asymptomatic, risk factors; BG greater than 40 mg/dL | Continue feeding plan. | Check BG before feeds every 2-3 hours for 2 more consecutive feeds. Stop checks when BG remains greater than 40 mg/dL before 24 hours of age or greater than 50 mg/dL from 24-48 hours of age. |\n| Asymptomatic, risk factors; BG 25-40 mg/dL | Apply glucose gel and refeed. | Recheck BG 1 hour after gel. Up to 3 separate gel doses may be given in the first 48 hours. Notify provider to initiate IV dextrose treatment when indicated. |\n| Asymptomatic, risk factors; BG less than 25 mg/dL | Apply glucose gel and refeed; notify provider. | Recheck BG 1 hour after gel. Follow provider management plan; consider IV dextrose treatment. |\n| Symptomatic; BG greater than 45 mg/dL | Notify provider of symptoms. | Continue provider-directed management. |\n| Symptomatic; BG 45 mg/dL or less | Notify provider immediately. | Obtain management plan; consider IV dextrose treatment. |\n\n### Glucose gel protocol\n\n<ol>\n<li>For infants greater than 35 weeks who meet criteria, use glucose gel according to the clinical pathway and the infant's weight. Pharmacy supplies gel in 2 mL prefilled syringes.</li>\n<li>Administer the gel with a gloved finger to the buccal mucosa of each cheek in 0.5 mL increments. Massage gently into gums and cheek, alternating sides until the full dose is given.</li>\n<li>A maximum of 3 gel doses may be given in the first 48 hours.</li>\n<li>If BG remains below 40 mg/dL after the second gel dose and a third dose is necessary, notify the pediatrician and initiate IV glucose therapy per provider order.</li>\n<li>Glucose gel is for treatment of asymptomatic hypoglycemia as outlined in this pathway.</li>\n</ol>\n\n| Weight in kilograms | Dosage amount |\n| --- | --- |\n| 2 kg | 1 mL |\n| 2.5 kg | 1.25 mL |\n| 3 kg | 1.5 mL |\n| 3.5 kg | 1.75 mL |\n| 4 kg | 2 mL |\n| 4.5 kg | 2.25 mL |\n| 5 kg | 2.5 mL |\n\n<ul><li>Baby Boy Sung: 4.37 kg. Use the facility weight-based glucose-gel dose and clarify the exact dose with the pediatrician/pharmacy when needed.</li></ul>\n\n### NPO newborns\n\n<ul><li>For NPO orders, continue glucose monitoring every 6 hours after values have stabilized.</li></ul>\n\n### Heel-stick glucose specimen collection\n\n<ol>\n<li>Explain the procedure to the parent(s).</li>\n<li>Perform hand hygiene and don gloves.</li>\n<li>Place the infant securely.</li>\n<li>Select a heel-stick site; cleanse with alcohol and allow to air dry.</li>\n<li>Perform the heel stick with an approved lancet.</li>\n<li>Remove the lancet and gently wipe away the first drop with gauze.</li>\n<li>Immediately process the specimen on the approved glucose monitor and verify patient information on the log.</li>\n<li>Apply pressure with gauze and/or an adhesive bandage.</li>\n<li>Document the glucose result. For a heel-stick result below 40 mg/dL, obtain serum glucose by venipuncture.</li>\n</ol>\n\n### IV glucose therapy and monitoring\n\n<ul><li>Initiate IV therapy only with the appropriate provider order.</li></ul>\n\n<ul>\n<li>Administer D10W 2 mL/kg IV push and begin continuous D10W at 3.3 mL/kg/hr (80 mL/kg/day) when ordered.</li>\n<li>Recheck BG 15-30 minutes after the bolus.</li>\n<li>Obtain plasma glucose 30-45 minutes after IV therapy begins; adjust infusion rate or dextrose concentration as ordered to maintain BG above 45 mg/dL during the first 48 hours, generally not exceeding 90-100 mg/dL.</li>\n<li>Recheck BG 30-45 minutes after a change in IV dextrose infusion rate.</li>\n<li>Notify the pediatrician for glucose infusion requirements above 12 mg/kg/min or fluids above 160 mL/kg/day; obtain an order for D12.5 if indicated.</li>\n<li>Monitor fluid balance and clinical status for volume overload.</li>\n<li>When BG is within target range, gradually transition to oral feeds. Begin weaning after values remain in range for 6-9 hours. Decrease fluids by 2 mL/hr and recheck glucose in 3 hours when ordered; do not titrate fluids when BG is 45 mg/dL or lower.</li>\n</ul>\n\n### Required documentation\n\n<ul>\n<li>Risk factor or symptom</li>\n<li>Feeding and glucose result</li>\n<li>Collection method</li>\n<li>Gel or IV treatment and dose</li>\n<li>Time of recheck</li>\n<li>Provider notification and orders received</li>\n<li>Newborn response</li>\n</ul>\n\n### References\n\n<ul>\n<li>American Academy of Pediatrics, Committee on Fetus and Newborn: neonatal hypoglycemia guidance.</li>\n<li>Conway Regional Health System, Women's and Infants' Services, Glucose Management Protocol: Newborn, last reviewed April 2024.</li>\n</ul>"
   },
   {
    id: "babyboysung-d5",
    title: "Glucose policy -Baby Boy Sung",
    category: "assessments",
    md: "---\n\n---\n---\n# **NEWBORN GLUCOSE MONITORING SHEET**\n---\n## **PATIENT INFORMATION**\n- **Baby Name:** Baby Boy Sung\n- **Date of Birth:** Today\n- **Gestational Age:** 39.1 weeks\n- **Birth Weight:** _______10lb___________\n- **Mother with GDM/Diabetes:** ☐ Yes ☐ No\n---\n## **STEP 1: INITIAL GLUCOSE CHECK**\n*(Check within 30 minutes after feeding)*\n- **Date/Time:** ___4/20/26__1058__\n- **Blood Glucose Level:** _____40_____ mg/dL\n**Reason for Screening (check all that apply):**\n- [ ] SGA\n- [x] LGA\n- [ ] IUGR\n- [ ] Late Preterm (34–36 weeks)\n- [x] Maternal GDM/Diabetes\n---\n## **STEP 2: SYMPTOMS (IF PRESENT)**\n- **Date/Time Symptoms Noted:** __________________\n**Symptoms (check all that apply):**\n- [ ]  Tremors / Jitteriness\n- [ ]  Poor feeding\n- [ ] Lethargy\n- [ ] Respiratory distress\n- [ ] Other: __________________\n- **Blood Glucose Level:** __________ mg/dL\n---\n## **STEP 3: GLUCOSE GEL (IF GLUCOSE <40)**\n**Weight-Based Dose:** ____2.25____ mL\n**Route:** Buccal (inside cheek)\n![](assets/imported/b945fd5249ff333bae.png)\n### **Dose #1**\n- **Date/Time Given:** __________________\n- **Nurse Initials:** ______\n- **Glucose Recheck (30 min later):** __________ mg/dL\n### **Dose #2 (if needed)**\n- **Date/Time Given:** __________________\n- **Nurse Initials:** ______\n- **Glucose Recheck:** __________ mg/dL\n### **Dose #3 (if needed)**\n- **Date/Time Given:** __________________\n- **Nurse Initials:** ______\n- **Glucose Recheck:** __________ mg/dL\n---\n## **STEP 4: IF GLUCOSE REMAINS <40 AFTER 3 DOSES**\n- **Pediatrician Notified:** ☐ Yes ☐ No\n- **IV Glucose Started:** ☐ Yes ☐ No\n- **Date/Time IV Started:** __________________\n- **Nurse Initials:** ______\n---"
   },
   {
    id: "babyboysung-d6",
    title: "Printable assessment form",
    category: "documents",
    md: "[Open assessment PDF](assets/ATU_Newborn_Ballard_Detailed_AUTOCALC.pdf)"
   },
   {
    id: "babyboysung-d7",
    title: "Newborn Glucose Protocol",
    category: "documents",
    md: "[Newborn Glucose Protocol](assets/newborn-glucose-protocol.pdf)"
   }
  ],
  events: [
   {
    id: "babyboysung-ev1",
    title: "Lab Results baby boy",
    labs: [
     {
      id: "babyboysung-ev1-l0-0",
      panel: "Lab Results baby boy",
      at: 0,
      results: [
       {
        t: "WBC",
        v: "28,500 /µL",
        lo: 9000,
        hi: 30000,
        u: "/µL"
       },
       {
        t: "Neutrophils",
        v: "72%",
        lo: 50,
        hi: 70,
        u: "%"
       },
       {
        t: "Bands",
        v: "8%",
        lo: 0,
        hi: 10,
        u: "%"
       },
       {
        t: "Lymphocytes",
        v: "18%",
        lo: 20,
        hi: 40,
        u: "%"
       },
       {
        t: "Hgb",
        v: "18.5 g/dL",
        lo: 14,
        hi: 22,
        u: "g/dL"
       },
       {
        t: "HCT",
        v: "55%",
        lo: 45,
        hi: 65,
        u: "%"
       },
       {
        t: "RBC",
        v: "5.2 million/µL",
        lo: 4,
        hi: 6.6,
        u: "million/µL"
       },
       {
        t: "Platelets",
        v: "275,000 /µL",
        lo: 150000,
        hi: 450000,
        u: "/µL"
       }
      ]
     }
    ]
   },
   {
    id: "babyboysung-ev2",
    title: "Chest X-ray",
    imaging: [
     {
      id: "babyboysung-ev2-im0",
      study: "Chest X-ray",
      text: "_(Image not included in the source record.)_\n\n**Chest X-ray Report**\n\nFracture of the left clavicle noted. Full expansion of both right and left lung noted, no lung involvement.",
      images: []
     }
    ]
   },
   {
    id: "babyboysung-ev3",
    title: "New Results-Sung,baby",
    labs: [
     {
      id: "babyboysung-ev3-l0-0",
      panel: "New Results-Sung,baby",
      at: 0,
      results: [
       {
        t: "Hgb",
        v: "10.9",
        lo: 12.1,
        hi: 15.1
       },
       {
        t: "HCT",
        v: "30.2",
        lo: 36.1,
        hi: 44.3
       },
       {
        t: "WBC",
        v: "20000",
        lo: 4.5,
        hi: 10000
       }
      ]
     }
    ]
   },
   {
    id: "babyboysung-ev4",
    title: "Chest X-ray Order",
    orders: [
     {
      id: "babyboysung-ev4-o0-0",
      cat: "Imaging",
      text: "Chest X-ray Order — Chest X-ray. Provider: Dr. Craig",
      by: "Dr. Craig"
     }
    ]
   }
  ],
  hpi: "Allergies: NKA\nGestational Age: 39.1 weeks\nType of birth: Vaginal birth (Shoulder Dystocia)\nMeconium: NO\n\n4.08 kg male infant just born after vaginal delivery with shoulder dystocia. McRoberts maneuver and suprapubic pressure was used. OB stated it was the left shoulder that was manipulated\n\n# History\n\n# Physicians’ documentation\n\n# Diagnostics\n\n# Nursing"
 },
 {
  id: "fatimasanogo",
  level: 2,
  experiences: [
   "ob"
  ],
  source: "ATU-Simulation-Hospital (Notion)",
  name: {
   first: "Fatima",
   last: "Sanogo"
  },
  mrn: "201038",
  dob: "2003-07-08",
  age: "23 years",
  sex: "F",
  unit: "Mother-Baby / Postpartum",
  room: "211E",
  service: "Obstetrics",
  attending: "Dr. Nelson",
  admitted: {
   at: -240
  },
  scenarioStart: "08:00",
  admitDx: "Postpartum hemorrhage after vaginal delivery",
  codeStatus: "Full Code",
  isolation: "Standard",
  nkda: true,
  allergies: [],
  heightCm: null,
  weightKg: 71,
  assessmentForms: [
   "wdl-adult",
   "pain",
   "morse"
  ],
  bloodType: "O+",
  demographics: {
   Gravida: "1",
   Para: "1"
  },
  orders: [
   {
    id: "fatimasanogo-o10-0",
    cat: "Admission",
    text: "Admit to labor and deliver for postpartum care",
    at: -240,
    by: "Dr. Nelson"
   },
   {
    id: "fatimasanogo-o10-1",
    cat: "Code Status",
    text: "Full code",
    at: -240,
    by: "Dr. Nelson"
   },
   {
    id: "fatimasanogo-o10-2",
    cat: "Diet",
    text: "Regular diet",
    at: -240,
    by: "Dr. Nelson"
   },
   {
    id: "fatimasanogo-o10-3",
    cat: "Activity",
    text: "Activity: Patient may get up to bathroom once recovery is complete .Nurse should assist patient with first time up out of bed.",
    at: -240,
    by: "Dr. Nelson"
   },
   {
    id: "fatimasanogo-o10-4",
    cat: "IV Fluids",
    text: "LR 1000ml to infuse at 125ml/hr, may saline lock IV 3 hours after delivery if bleeding is scant.",
    at: -240,
    by: "Dr. Nelson"
   },
   {
    id: "fatimasanogo-o10-5",
    cat: "Nursing",
    text: "Vital signs: every 15 mins x 4 for 1st hour after delivery, then q 30 mins x2 for 2nd hour. Then q 8 hours until discharge. Fundal messages and lochia assessment to be done with vital signs.",
    at: -240,
    by: "Dr. Nelson"
   },
   {
    id: "fatimasanogo-o10-7",
    cat: "Nursing",
    text: "I & O q shift",
    at: -240,
    by: "Dr. Nelson"
   },
   {
    id: "fatimasanogo-o10-13",
    cat: "Nursing",
    text: "Weigh all pads for the first 2 hours after delivery.",
    at: -240,
    by: "Dr. Nelson"
   }
  ],
  meds: [
   {
    id: "fati-lactated-ringer-s-soluti-0",
    name: "Lactated Ringer’s solution (LR)",
    dose: "125 mL/hr",
    route: "IV infusion",
    freq: "Continuous",
    type: "continuous",
    rate: "125 mL/hr"
   },
   {
    id: "fati-oxytocin-1",
    name: "Oxytocin (Pitocin)",
    dose: "30 units in 500 mL normal saline",
    route: "IV infusion",
    freq: "334 mL/hr for 100 mL after placenta, then 95 mL/hr until complete",
    type: "continuous",
    highAlert: true
   },
   {
    id: "fati-witch-hazel-2",
    name: "Witch hazel (Tucks)",
    dose: "Pads",
    route: "Topical",
    freq: "Apply to hemorrhoids PRN",
    type: "prn"
   },
   {
    id: "fati-pramoxine-3",
    name: "Pramoxine (Epifoam)",
    dose: "Spray",
    route: "Topical",
    freq: "Apply to perineum PRN pain",
    type: "prn",
    indication: "pain"
   },
   {
    id: "fati-oxycodone-acetaminophen-4",
    name: "Oxycodone/acetaminophen (Percocet)",
    dose: "1 tablet",
    route: "PO",
    freq: "Every 4 hours PRN pain",
    type: "prn",
    indication: "pain",
    minIntervalHr: 4
   },
   {
    id: "fati-ibuprofen-5",
    name: "Ibuprofen (Motrin)",
    dose: "600 mg",
    route: "PO",
    freq: "Every 6 hours PRN pain",
    type: "prn",
    indication: "pain",
    minIntervalHr: 6
   }
  ],
  vitals: [
   {
    time: "12:53",
    temp: 99.2,
    hr: 94,
    rr: 18,
    sbp: 140,
    dbp: 80,
    spo2: 97,
    pain: 2,
    by: "Prior RN"
   },
   {
    time: "13:24",
    temp: 99.4,
    hr: 91,
    rr: 18,
    sbp: 142,
    dbp: 80,
    spo2: 95,
    pain: 4,
    by: "Prior RN"
   },
   {
    at: -90,
    sbp: 88,
    dbp: 49,
    by: "Prior RN"
   }
  ],
  labs: [
   {
    id: "fatimasanogo-l5-0",
    panel: "Lab Results",
    at: -120,
    results: [
     {
      t: "Hgb",
      v: "11.1",
      lo: 12.1,
      hi: 15.1
     },
     {
      t: "HCT",
      v: "43",
      lo: 36.1,
      hi: 44.3
     },
     {
      t: "WBC",
      v: "11",
      lo: 4.5,
      hi: 10
     },
     {
      t: "RBC",
      v: "5",
      lo: 4.2,
      hi: 5.4
     },
     {
      t: "MCV",
      v: "94",
      lo: 80,
      hi: 99
     },
     {
      t: "MCH",
      v: "30",
      lo: 27,
      hi: 31
     },
     {
      t: "MCHC",
      v: "33",
      lo: 32,
      hi: 36
     },
     {
      t: "Platelets",
      v: "245",
      lo: 140,
      hi: 400
     },
     {
      t: "Blood type",
      v: "O +"
     },
     {
      t: "HIV",
      v: "Negative"
     },
     {
      t: "GBS",
      v: "Negative"
     },
     {
      t: "Gonorrhea/Chlamydia",
      v: "Negative"
     },
     {
      t: "Syphilis Treponemal IGA",
      v: "Nonreactive"
     },
     {
      t: "Hepatitis B",
      v: "Negative"
     },
     {
      t: "Rubella",
      v: "Immune"
     }
    ]
   },
   {
    id: "fatimasanogo-l5-1",
    panel: "Lab Results",
    at: -120,
    results: [
     {
      t: "Hgb",
      v: "9.3",
      lo: 12.1,
      hi: 15.1
     },
     {
      t: "HCT",
      v: "27.5",
      lo: 36.1,
      hi: 44.3
     },
     {
      t: "WBC",
      v: "12",
      lo: 4.5,
      hi: 10
     },
     {
      t: "RBC",
      v: "4.2",
      lo: 4.2,
      hi: 5.4
     },
     {
      t: "MCV",
      v: "92",
      lo: 80,
      hi: 99
     },
     {
      t: "MCH",
      v: "29",
      lo: 27,
      hi: 31
     },
     {
      t: "MCHC",
      v: "32",
      lo: 32,
      hi: 36
     },
     {
      t: "Platelets",
      v: "233",
      lo: 140,
      hi: 400
     }
    ]
   }
  ],
  imaging: [],
  notes: [
   {
    id: "fatimasanogo-n7",
    type: "PROGRESS NOTES",
    author: "Dr. Nelson",
    at: -270,
    md: true,
    text: "## Postpartum Progress Note\n\nSpontaneous vaginal delivery of a vigorous male infant, 9 lb, Apgar 9/9. Second-degree periurethral laceration repaired. Placenta delivered manually and intact at 1235. Estimated blood loss 350 mL. Fundus firm at U-1 with small lochia after fundal massage and oxytocin. Infant breastfed for 20 minutes, then went to the nursery. Third 15-minute recovery check occurred at 1320."
   }
  ],
  io: [],
  documents: [
   {
    id: "fatimasanogo-d1",
    title: "Consents",
    category: "documents",
    md: "![](assets/imported/b84202580c6ff7a474.jpg)\n\n![](assets/imported/4a36922eba9b227bb3.jpg)"
   },
   {
    id: "fatimasanogo-d2",
    title: "Prenatal Record Fatima Sanogo",
    category: "prenatal",
    md: "## Prenatal Record — Fatima Sanogo\n\n- 23-year-old, G1 P1 at 39 weeks\n- Blood type O positive; hepatitis B negative; rubella immune; GBS negative\n- Induction for elevated blood pressure\n- History of depression and anxiety\n- Nonsmoker; married; limited English for 7 months"
   },
   {
    id: "fatimasanogo-d3",
    title: "Input/Output Record Sanogo",
    category: "io",
    md: "## Intake Record\n\n| Time | PO Intake | IV Fluids | Type of Fluid | Total Intake |\n| --- | --- | --- | --- | --- |\n\n## Postpartum Bleeding Assessment\n\n| Time | Pad Count | Estimated Blood Loss | Clots | Fundal Status |\n| --- | --- | --- | --- | --- |\n| Delivery 1232 |  | 350 |  | firm |\n| 1311 | 2 | 695 |  | firm |\n\n## Output Record\n\n| Time | Urine | Emesis | DRY PAD WEIGHT GRAMS | WET PAD WEIGHT GRAMS | TOTAL BLOOD LOSS IN MLS | Total Output |\n| --- | --- | --- | --- | --- | --- | --- |\n| 1129 | 700 cc |  |  |  |  |  |"
   },
   {
    id: "fatimasanogo-d6",
    title: "Delivery summary",
    category: "labor",
    md: "## Delivery Summary\n\n- Provider: Dr. Nelson\n- AROM 0912, clear fluid; oxytocin started 0700\n- Complete 0948; pushing began 0952\n- Spontaneous vaginal delivery at 1232\n- Vigorous male, 9 lb; Apgar 9 at 1 minute and 9 at 5 minutes\n- Unmedicated delivery\n- Second-degree periurethral laceration repaired\n- Placenta manually delivered intact at 1235\n- Estimated blood loss: 350 mL\n- Fundus firm at U-1; lochia small after fundal massage and oxytocin"
   }
  ],
  events: [
   {
    id: "fatimasanogo-ev1",
    title: "BLOOD BANK FORMS-Sanogo",
    documents: [
     {
      id: "fatimasanogo-ev1-d0",
      title: "BLOOD BANK FORMS-Sanogo",
      md: "PATIENT NAME: Fatima Sanogo\nDOB : 7/8/xxxx\nDATE  2/24/25\n\nYou need two RN’S to check the following\n- [x] Verify order to transfuse PRBC.\n- [x] Verify blood consent is signed by patient or patient representative\n- [x] Verify blood type compatibility\n- [x] Blood band number matches  blood unit number\n- [x] Check blood expiration date\n- [x] Verify patient name and DOB\n- [x] Wristband ID compared with ALL blood component units at patient’s bedside\n- [x] Patient has a dedicated venous access line with only blood and/or 0.9% NaCl running Patient\n- [x] Have blood tubing\n- [x] The blood product has not sit for more than 30 minutes after leaving the lab.\n- [x] Transfusion Vitals: pre transfusion, q 15 mins x 1, q 30 mins x 2 and then q hour.\n\n| Component blood type | Unit ID Number | Unit ABO/Rh | Start |  | End |  | Adverse Reaction |  |\n| --- | --- | --- | --- | --- | --- | --- | --- | --- |\n|  | JF46302 | O neg |  |  |  |  |  |  |\n\n- Vital signs, including patient temperature, are to be monitored every 10 minutes and recorded .\n\n| Pre-transfusion |  |  |  |  |\n| --- | --- | --- | --- | --- |\n| Time | Blood pressure | Pulse | Resp. rate | Temperature |\n| Vital signs every 10 minutes after start of unit. |  |  |  |  |\n| Time | Blood pressure | Pulse | Resp rate | Temperature |"
     }
    ]
   },
   {
    id: "fatimasanogo-ev2",
    title: "Critical CBC — Postpartum Hemorrhage",
    labs: [
     {
      id: "fatimasanogo-ev2-l0-0-0",
      panel: "Critical CBC — Postpartum Hemorrhage",
      at: 0,
      results: [
       {
        t: "Hgb",
        v: "6 g/dL"
       },
       {
        t: "HCT",
        v: "22%"
       },
       {
        t: "Platelets",
        v: "100,000/mm3"
       }
      ]
     }
    ]
   },
   {
    id: "fatimasanogo-ev3",
    title: "Postpartum Hemorrhage Medication Orders",
    orders: [
     {
      id: "fatimasanogo-ev3-o0-0",
      cat: "Medication",
      text: "Methylergonovine (Methergine) 0.2 mg IM every 2–4 hours as needed. Do not administer with elevated blood pressure",
      by: "Dr. Nelson"
     },
     {
      id: "fatimasanogo-ev3-o0-1",
      cat: "Medication",
      text: "Carboprost tromethamine (Hemabate) 250 mcg IM every 15–90 minutes as needed; maximum approximately 2 mg total. Specific provider order required before administration",
      by: "Dr. Nelson"
     },
     {
      id: "fatimasanogo-ev3-o0-2",
      cat: "Medication",
      text: "Misoprostol (Cytotec) 800 mcg rectally; 600–1000 mcg PR / SL / PO as needed per protocol. Specific provider order required before administration",
      by: "Dr. Nelson"
     },
     {
      id: "fatimasanogo-ev3-o0-3",
      cat: "IV Fluids",
      text: "Tranexamic acid (Cyklokapron; TXA) 1 g IV over 10 minutes once postpartum hemorrhage is diagnosed. May repeat 1 g after 30 minutes–24 hours if bleeding persists, per protocol. Specific provider order required before administration",
      by: "Dr. Nelson"
     }
    ]
   },
   {
    id: "fatimasanogo-ev4",
    title: "Postpartum Hemorrhage Follow-up Orders",
    orders: [
     {
      id: "fatimasanogo-ev4-o0-0",
      cat: "Lab",
      text: "CBC in 6 hours",
      by: "Dr. Nelson"
     },
     {
      id: "fatimasanogo-ev4-o0-1",
      cat: "Nursing",
      text: "Foley catheter",
      by: "Dr. Nelson"
     },
     {
      id: "fatimasanogo-ev4-o0-2",
      cat: "Nursing",
      text: "Fundus checks every 15 minutes",
      by: "Dr. Nelson"
     }
    ]
   },
   {
    id: "fatimasanogo-ev5",
    title: "Methylergonovine (Methergine) 0.2 mg",
    meds: [
     {
      id: "fati-methylergonovine-106",
      name: "Methylergonovine (Methergine)",
      dose: "0.2 mg",
      route: "IM",
      freq: "Every 2–4 hours PRN",
      type: "prn"
     }
    ]
   },
   {
    id: "fatimasanogo-ev6",
    title: "Carboprost tromethamine (Hemabate) 250 mcg",
    meds: [
     {
      id: "fati-carboprost-tromethamine-107",
      name: "Carboprost tromethamine (Hemabate)",
      dose: "250 mcg",
      route: "IM",
      freq: "Every 15–90 minutes PRN; maximum 2 mg",
      type: "prn",
      indication: "; maximum 2 mg"
     }
    ]
   },
   {
    id: "fatimasanogo-ev7",
    title: "Misoprostol (Cytotec) 600–1,000 mcg",
    meds: [
     {
      id: "fati-misoprostol-108",
      name: "Misoprostol (Cytotec)",
      dose: "600–1,000 mcg",
      route: "PR / SL / PO",
      freq: "PRN per protocol",
      type: "prn",
      indication: "per protocol"
     }
    ]
   },
   {
    id: "fatimasanogo-ev8",
    title: "Tranexamic acid (Cyklokapron; TXA) 1 g",
    meds: [
     {
      id: "fati-tranexamic-acid-109",
      name: "Tranexamic acid (Cyklokapron; TXA)",
      dose: "1 g",
      route: "IV over 10 minutes",
      freq: "Once when PPH diagnosed; may repeat once",
      type: "prn",
      highAlert: true
     }
    ]
   },
   {
    id: "fatimasanogo-ev9",
    title: "Shift 2",
    documents: [
     {
      id: "fatimasanogo-ev9-d0",
      title: "Shift 2 — Continued Postpartum Hemorrhage",
      md: "Continued vaginal bleeding with large clots. Obtain second IV access. T 97.5 F; HR 105; RR 16; BP 90/50. Moderate bleeding with critical Hgb 6 g/dL, Hct 22%, platelets 100,000. Pending verbal orders: type and crossmatch 2 units PRBC; start second IV; infuse blood; H&H after transfusion; tranexamic acid; uterine tamponade balloon; CBC. Students should notify provider, prepare blood verification and administration, call the surgical team for possible hysterectomy, administer released medications, and assist with tamponade placement."
     }
    ]
   }
  ],
  facultyGuide: [
   {
    title: "Fatima Sanogo Faculty Simulation Guide",
    md: "23-year-old G1 P1 at 39 weeks. Induction began yesterday at 0600 for elevated BP. History depression/anxiety; nonsmoker; married to Henry; limited English for 7 months. AROM at 0912 with clear fluid; oxytocin started 0700; O positive, hepatitis B negative, rubella immune, GBS negative. Complete at 0948; pushing 0952; voided at 1000. Vigorous male delivered vaginally at 1232, 9 lb, Apgar 9/9. Unmedicated delivery; second-degree periurethral laceration repaired; placenta manually delivered at 1235; EBL 350 mL. Fundus initially firm at U-1 with small lochia. Shift 1 vitals: T 98.5 F, HR 93, BP 140/80, RR 18, SpO2 96%, capillary refill under 2 seconds. If hemorrhage develops, assess fundus, insert Foley, weigh pads (1 g = 1 mL), notify MD, apply oxygen 10 L by mask, bring hemorrhage cart, and do not administer methylergonovine while BP is elevated."
   }
  ],
  hpi: "## Patient Overview\n\n- Fatima Sanogo, 23-year-old female, G1 P1 at 39 weeks\n- Weight: 71 kg; Blood type: O positive; GBS negative; NKDA\n- Induction began yesterday at 0600 for elevated blood pressure\n- AROM 0912 with clear fluid; oxytocin started 0700\n- Complete 0948; pushing 0952; voided on bedpan 1000\n- Vigorous male delivered 1232, 9 lb, Apgar 9/9\n- Unmedicated vaginal delivery; second-degree periurethral laceration repaired\n- Placenta manually delivered 1235; EBL 350 mL\n- Fundus firm at U-1 with small lochia after massage and oxytocin\n- History: depression/anxiety; nonsmoker; limited English for 7 months"
 },
 {
  id: "mollythomas",
  level: 2,
  experiences: [
   "peds"
  ],
  source: "ATU-Simulation-Hospital (Notion)",
  name: {
   first: "Molly",
   last: "Thomas"
  },
  mrn: "20139",
  dob: "2026-07-05",
  age: "7 months",
  sex: "F",
  unit: "Pediatric Unit",
  room: "211C",
  service: "Pediatrics",
  attending: "Dr. Henderson",
  admitted: {
   at: -240
  },
  scenarioStart: "08:00",
  admitDx: "Upper airway obstruction / croup",
  codeStatus: "Full Code",
  isolation: "Standard",
  nkda: true,
  allergies: [],
  heightCm: null,
  weightKg: 7,
  assessmentForms: [
   "pain"
  ],
  vitalRanges: {
   hr: [
    100,
    160
   ],
   rr: [
    30,
    53
   ],
   sbp: [
    72,
    104
   ],
   dbp: [
    37,
    56
   ],
   spo2: [
    95,
    100
   ]
  },
  orders: [
   {
    id: "mollythomas-o11-0",
    cat: "Admission",
    text: "Admit to pediatric floor.",
    at: -240,
    by: "Dr. Henderson"
   },
   {
    id: "mollythomas-o11-1",
    cat: "Code Status",
    text: "Full Code.",
    at: -240,
    by: "Dr. Henderson"
   },
   {
    id: "mollythomas-o11-2",
    cat: "Nursing",
    text: "Continuous pulse oximetry.",
    at: -240,
    by: "Dr. Henderson"
   },
   {
    id: "mollythomas-o11-3",
    cat: "Diet",
    text: "Regular diet; NPO if respiratory rate exceeds 60/min.",
    at: -240,
    by: "Dr. Henderson"
   },
   {
    id: "mollythomas-o11-4",
    cat: "Nursing",
    text: "Call MD with assessment findings.",
    at: -240,
    by: "Dr. Henderson"
   },
   {
    id: "mollythomas-o11-5",
    cat: "Nursing",
    text: "Strict intake and output.",
    at: -240,
    by: "Dr. Henderson"
   },
   {
    id: "mollythomas-o11-6",
    cat: "Nursing",
    text: "Daily weight.",
    at: -240,
    by: "Dr. Henderson"
   }
  ],
  meds: [
   {
    id: "moll-sodium-chloride-0-9-0",
    name: "Sodium chloride 0.9% (Normal Saline)",
    dose: "20 mL/kg",
    route: "IV bolus",
    freq: "Infuse over 30 minutes",
    type: "scheduled",
    doses: [
     {
      at: 0
     }
    ]
   }
  ],
  vitals: [
   {
    at: -60,
    temp: 99.1,
    hr: 165,
    rr: 50,
    sbp: 80,
    dbp: 40,
    spo2: 87,
    o2: "Room air",
    by: "Prior RN",
    note: "Temperature: 37.3 C"
   }
  ],
  labs: [
   {
    id: "mollythomas-l9-0",
    panel: "Lab results-Thomas",
    at: -120,
    results: [
     {
      t: "Glucose",
      v: "65 mg/dl",
      lo: 70,
      hi: 110,
      u: "mg/dl"
     },
     {
      t: "Chloride",
      v: "110 mmol/L",
      lo: 95,
      hi: 105,
      u: "mmol/L"
     },
     {
      t: "Sodium",
      v: "145 meq/L",
      lo: 139,
      hi: 145,
      u: "meq/L"
     },
     {
      t: "Potassium",
      v: "4.7 meq/L",
      lo: 3.5,
      hi: 5.5,
      u: "meq/L"
     },
     {
      t: "HCO3",
      v: "22 mmol/L",
      lo: 20,
      hi: 28,
      u: "mmol/L"
     },
     {
      t: "BUN",
      v: "20 mg/dL",
      lo: 8,
      hi: 28,
      u: "mg/dL"
     },
     {
      t: "Creatinine",
      v: "0.9 mg/dL",
      lo: 0.12,
      hi: 1.06,
      u: "mg/dL"
     }
    ]
   }
  ],
  imaging: [],
  notes: [
   {
    id: "mollythomas-n3",
    type: "Progress notes-DOCTORS DOCUMENTATION ONLY",
    author: "Dr. Henderson",
    at: -270,
    md: true,
    text: "**Age/Sex:** 7-month-old female\n**Date of Admission:** today\n**Admitting Physician:** Dr. Henderson\n**Source of History:** Mother\n**Chief Complaint:** Decreased oral intake and difficulty breathing\n**History of Present Illness**\nThe patient is a previously healthy 7-month-old female who presented to the Emergency Department with decreased oral intake and respiratory distress. The mother reports that the infant has had worsening cough over the past two days, which became progressively more severe, described as a **\"barking\" cough.** She also noticed increased work of breathing, nasal flaring, and irritability. There has been no history of cyanosis or apnea. No known sick contacts.\n**Past Medical History**\n- No known chronic medical conditions\n- No history of prior hospitalizations or surgeries\n**Birth History**\n- Full-term vaginal delivery, no complications\n- No NICU stay\n**Medications**\n- None\n**Allergies**\n- No known drug allergies\n**Family History**\n- No history of asthma or respiratory illnesses in immediate family\n**Social History**\n- Lives with parents\n- No exposure to smoke or sick contacts\n**Review of Systems**\n- **General:** Irritable, decreased oral intake\n- **Respiratory:** Barking cough, nasal flaring, no cyanosis\n- **GI:** No vomiting or diarrhea\n- **GU:** Normal urine output\n- **Neurological:** No seizures or lethargy\n**Physical Examination**\n**General:** Irritable, pale, moderate respiratory distress\n**Vital Signs:**\n- Temperature: 37.3°C\n- Heart Rate: 165 bpm\n- Respiratory Rate: 50 breaths/min\n- Blood Pressure: 80/40 mmHg\n- Oxygen Saturation: 87% on room air\n**HEENT:**\n- Mild nasal congestion, nasal flaring\n- No oropharyngeal lesions\n**Respiratory:**\n- Barking cough\n- Mild intercostal retractions\n- Stridor present at rest\n- Good air movement bilaterally\n**Cardiovascular:**\n- Regular rate and rhythm\n- No murmurs\n**Abdomen:**\n- Soft, non-distended, normoactive bowel sounds\n**Neurological:**\n- Active, appropriate for age\n**Laboratory & Imaging Results**\n- **Nasal Pharyngeal Wash:** Positive for **Parainfluenza**\n- **CMP:** Pending\n**Assessment**\n7-month-old female with **viral croup** (parainfluenza positive), presenting with **barking cough, respiratory distress, and decreased oral intake.**\n**Plan**\n1. **Respiratory Support:**\n- Supplemental oxygen if saturation < 92%\n2. **Hydration & Nutrition:**\n- IV bolus and Po hydration\n3. **Monitoring:**\n- Continuous pulse oximetry\n- Monitor for worsening respiratory distress or impending respiratory failure\n4. **Diagnostics:**\n- Await CMP results\n**Attending Physician Signature: Dr. Henderson**"
   }
  ],
  io: [],
  documents: [
   {
    id: "mollythomas-d1",
    title: "Input and Output",
    category: "io",
    md: "Intake/Output Flowchart\nUse this sheet to track how much your child takes in and how much comes out\n\n| **Date** | **Time** | **Intake** |  |  | **Output** |  |  |  |  |\n| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |\n|  |  | Amount of Formula | Solid food intake | Other/Notes | Urine output/wet diapers | Bowel Movement/Stools | Vomiting | Drainage | Other/Notes |\n|  | 1138 |  |  |  | 50 |  |  |  |  |\n|  | 1130 | 29 |  | D5 infusion mL/hr |  |  |  |  |  |"
   },
   {
    id: "mollythomas-d2",
    title: "PEW SCORE CALCULATION",
    category: "assessments",
    md: "Enter the three component scores in the Pediatric Assessment to calculate the total PEWS."
   },
   {
    id: "mollythomas-d6",
    title: "ATU Pediatric Head-to-Toe Assessment Shift 2",
    category: "assessments",
    md: "**VITALS & PAIN**\nTemp: _______   HR: _______   RR: _______   BP: _______   SpO₂: _______\nPain Score: _______\nPain Scale: ____ FLACC ____ FACES ____ Numeric ____ Nonverbal\n\n[Pediatric Early Warning Score (PEWS) Click to calculate](https://www.mdcalc.com/calc/3901/pediatric-early-warning-score-pews#when-to-use)\nBehavior Score (0–3): _______\nCardio Score (0–3): _______\nResp Score (0–3): _______\nTOTAL: _______\n### PEWS ≤2: low risk • Reassess as needed\n- Recommended to alert charge nurse and** staff MD**\n- PEWS 3-4: intermediate risk\n- PEWS ≥5: high risk\n- Recommended to initiate rapid **response team (MET Team)**\nClinical Concern / Escalation Notes:\n\n**NEUROLOGICAL / DEVELOPMENTAL**\nLOC: ____ Alert ____ Lethargic ____ Irritable ____ Unresponsive\nOrientation: ____ A&O x4 ____ x3 ____ x2 ____ x1 ____ Disoriented ____ Confused\nBehavior: ____ Calm ____ Fussy ____ Consolable ____ Inconsolable\nCry: ____ Strong ____ Weak ____ High-pitched\nPupils: ____ Equal ____ Reactive ____ Sluggish\nFontanelles: ____ Flat ____ Sunken ____ Bulging\nDevelopment Appropriate: ____ Yes ____ No\nAbnormal Findings:\n\n**CARDIOVASCULAR**\nRhythm: ____ Regular ____ Irregular ____ Murmur\nRate: ____ Tachycardia ____ Bradycardia\nCap Refill: ____ <2 sec ____ >2 sec\nPulses: ____ Strong ____ Weak ____ Absent\nSkin Color: ____ Pink ____ Pale ____ Cyanotic ____ Mottled\nApical Pulse: _______\nAbnormal Findings:\n\n**RESPIRATORY**\nBreath Sounds: ____ Clear ____ Diminished ____ Crackles ____ Wheezes ____ Rhonchi\nEffort: ____ Unlabored ____ Dyspnea ____ Retractions ____ Nasal flaring ____ Grunting\nOxygen: ____ Room Air ____ Nasal Cannula ____ Mask ____ Non-rebreather\nO₂ Rate: _______\nCough: ____ None ____ Dry ____ Productive\nAbnormal Findings:\n\n**GASTROINTESTINAL**\nAbdomen: ____ Soft ____ Firm ____ Distended\nBowel Sounds: ____ Present ____ Hypoactive ____ Hyperactive\nNausea/Vomiting: ____ Nausea ____ Vomiting\nFeeding: ____ Breast ____ Bottle ____ PO ____ NPO\nTolerance: __________________________\nLast BM: __________________________\nStool: ____ Normal ____ Diarrhea ____ Constipation\nAbnormal Findings:\n\n**GENITOURINARY / FOLEY**\nVoiding: ____ Normal ____ Decreased ____ None\nFoley Present: ____ Yes ____ No\nUrine: ____ Clear ____ Cloudy ____ Dark\nOutput Adequate: ____ Yes ____ No\nDiaper: ____ Wet ____ Dry\nOutput (mL): _______\nUrine Color: __________________________\nFrench Size: _______\nBalloon: _______\nInserted By: __________________________\nAbnormal Findings:\n\n**IV / FLUIDS**\nLocation: ____ RT Hand ____ LT Hand ____ RT FA ____ LT FA ____ RT AC ____ LT AC ____ RT Wrist ____ LT Wrist\nGauge: ____ 18g ____ 20g ____ 22g ____ 24g\nSite Condition: ____ WNL ____ Red ____ Swollen ____ Infiltrated\nFluids: __________________________\nRate (mL/hr): _______\nOther Lines/Drains: __________________________\nAbnormal Findings:\n\n**MUSCULOSKELETAL / SKIN**\nMobility: ____ Independent ____ Assist x1 ____ Assist x2 ____ Bedrest\nROM: ____ Full ____ Limited\nTone: ____ Normal ____ Hypotonic ____ Hypertonic\nSkin: ____ Intact ____ Redness ____ Pressure Injury ____ Wound\nTemp: ____ Warm/Dry ____ Cool/Pale\nOther: ____ Bruising ____ Dressing CDI\nBirthmarks / Lesions / Rash: __________________________\nAbnormal Findings:\n\n**SAFETY**\n____ Bed low\n____ Call light in reach\n____ Side rails up\n____ Fall precautions\n____ ID band present\n____ Alarm on"
   },
   {
    id: "mollythomas-d7",
    title: "ATU Pediatric Head-to-Toe Assessment Shift 1",
    category: "assessments",
    md: "**VITALS & PAIN**\nTemp: _______   HR: _______   RR: _______   BP: _______   SpO₂: _______\nPain Score: _______\nPain Scale: ____ FLACC ____ FACES ____ Numeric ____ Nonverbal\n\n[Pediatric Early Warning Score (PEWS) Click to calculate](https://www.mdcalc.com/calc/3901/pediatric-early-warning-score-pews#when-to-use)\nBehavior Score (0–3): _______\nCardio Score (0–3): _______\nResp Score (0–3): _______\nTOTAL: _______\n### PEWS ≤2: low risk • Reassess as needed\n- Recommended to alert charge nurse and** staff MD**\n- PEWS 3-4: intermediate risk\n- PEWS ≥5: high risk\n- Recommended to initiate rapid **response team (MET Team)**\nClinical Concern / Escalation Notes:\n\n**NEUROLOGICAL / DEVELOPMENTAL**\nLOC: ____ Alert ____ Lethargic ____ Irritable ____ Unresponsive\nOrientation: ____ A&O x4 ____ x3 ____ x2 ____ x1 ____ Disoriented ____ Confused\nBehavior: ____ Calm ____ Fussy ____ Consolable ____ Inconsolable\nCry: ____ Strong ____ Weak ____ High-pitched\nPupils: ____ Equal ____ Reactive ____ Sluggish\nFontanelles: ____ Flat ____ Sunken ____ Bulging\nDevelopment Appropriate: ____ Yes ____ No\nAbnormal Findings:\n\n**CARDIOVASCULAR**\nRhythm: ____ Regular ____ Irregular ____ Murmur\nRate: ____ Tachycardia ____ Bradycardia\nCap Refill: ____ <2 sec ____ >2 sec\nPulses: ____ Strong ____ Weak ____ Absent\nSkin Color: ____ Pink ____ Pale ____ Cyanotic ____ Mottled\nApical Pulse: _______\nAbnormal Findings:\n\n**RESPIRATORY**\nBreath Sounds: ____ Clear ____ Diminished ____ Crackles ____ Wheezes ____ Rhonchi\nEffort: ____ Unlabored ____ Dyspnea ____ Retractions ____ Nasal flaring ____ Grunting\nOxygen: ____ Room Air ____ Nasal Cannula ____ Mask ____ non-rebreather\nO₂ Rate: _______\nCough: ____ None ____ Dry ____ Productive\nAbnormal Findings:\n\n**GASTROINTESTINAL**\nAbdomen: ____ Soft ____ Firm ____ Distended\nBowel Sounds: ____ Present ____ Hypoactive ____ Hyperactive\nNausea/Vomiting: ____ Nausea ____ Vomiting\nFeeding: ____ Breast ____ Bottle ____ PO ____ NPO\nTolerance: __________________________\nLast BM: __________________________\nStool: ____ Normal ____ Diarrhea ____ Constipation\nAbnormal Findings:\n\n**GENITOURINARY / FOLEY**\nVoiding: ____ Normal ____ Decreased ____ None\nFoley Present: ____ Yes ____ No\nUrine: ____ Clear ____ Cloudy ____ Dark\nOutput Adequate: ____ Yes ____ No\nDiaper: ____ Wet ____ Dry\nOutput (mL): _______\nUrine Color: __________________________\nFrench Size: _______\nBalloon: _______\nInserted By: __________________________\nAbnormal Findings:\n\n**IV / FLUIDS**\nLocation: ____ RT Hand ____ LT Hand ____ RT FA ____ LT FA ____ RT AC ____ LT AC ____ RT Wrist ____ LT Wrist\nGauge: ____ 18g ____ 20g ____ 22g ____ 24g\nSite Condition: ____ WNL ____ Red ____ Swollen ____ Infiltrated\nFluids: __________________________\nRate (mL/hr): _______\nOther Lines/Drains: __________________________\nAbnormal Findings:\n\n**MUSCULOSKELETAL / SKIN**\nMobility: ____ Independent ____ Assist x1 ____ Assist x2 ____ Bedrest\nROM: ____ Full ____ Limited\nTone: ____ Normal ____ Hypotonic ____ Hypertonic\nSkin: ____ Intact ____ Redness ____ Pressure Injury ____ Wound\nTemp: ____ Warm/Dry ____ Cool/Pale\nOther: ____ Bruising ____ Dressing CDI\nBirthmarks / Lesions / Rash: __________________________\nAbnormal Findings:\n\n**SAFETY**\n____ Bed low\n____ Call light in reach\n____ Side rails up\n____ Fall precautions\n____ ID band present\n____ Alarm on"
   },
   {
    id: "mollythomas-d13",
    title: "Molly Thomas",
    category: "documents",
    md: "| CMP | Pending |\n| --- | --- |\n\n| Time / Shift | Provider order | Provider |\n| --- | --- | --- |\n| Today (1) | Racemic Epinephrine 2.5% updraft | Dr. Henderson |\n| Today | D5 1/2 daily if void occurs during bolus | Dr. Henderson |\n| Today | Maintain o2 saturation @ 92% | Dr. Henderson |\n| Today | Ampicillin 50mg/kg IV q6hr | Dr. henderson |"
   }
  ],
  events: [
   {
    id: "mollythomas-ev1",
    title: "Radiology -New results Thomas",
    imaging: [
     {
      id: "mollythomas-ev1-im0",
      study: "Radiology -New results Thomas",
      text: "Results: Bilateral Diffuse infiltrates consistant with aspiration pneumoinia",
      images: [
       "assets/imported/75c169b3fd918c40cf.jpg"
      ]
     }
    ]
   },
   {
    id: "mollythomas-ev2",
    title: "MD Orders",
    orders: [
     {
      id: "mollythomas-ev2-o0-0",
      cat: "Respiratory",
      text: "Racepinephrine (Asthmanefrin) 2.25% inhalation solution, 0.5 mL mixed with 3 mL of sodium chloride 0.9% (Normal Saline), to be given by respiratory therapy. Call respiratory when needed",
      by: "Dr. Henderson"
     },
     {
      id: "mollythomas-ev2-o0-1",
      cat: "IV Fluids",
      text: "Dexamethasone (Decadron) 0.6 mg/kg IV now",
      by: "Dr. Henderson"
     }
    ]
   },
   {
    id: "mollythomas-ev3",
    title: "Shift 2",
    orders: [
     {
      id: "mollythomas-ev3-o0-0",
      cat: "IV Fluids",
      text: "Ampicillin (Principen) 50 mg/kg IV every 6 hours",
      by: "Dr. Henderson"
     },
     {
      id: "mollythomas-ev3-o0-1",
      cat: "IV Fluids",
      text: "Dextrose 5% in 0.45% sodium chloride (D5 1/2 NS) IV at daily maintenance rate after void during bolus",
      by: "Dr. Henderson"
     },
     {
      id: "mollythomas-ev3-o0-2",
      cat: "Respiratory",
      text: "Maintain oxygen saturation at 92% or greater",
      by: "Dr. Henderson"
     },
     {
      id: "mollythomas-ev3-o0-3",
      cat: "Imaging",
      text: "Chest X-ray",
      by: "Dr. Henderson"
     }
    ]
   },
   {
    id: "mollythomas-ev4",
    title: "Racepinephrine (Asthmanefrin) 2.25% nebulized",
    meds: [
     {
      id: "moll-racepinephrine-101",
      name: "Racepinephrine (Asthmanefrin)",
      dose: "2.25% nebulized",
      route: "Nebulizer",
      freq: "Give now",
      type: "scheduled",
      doses: [
       {
        at: 0
       }
      ]
     }
    ]
   },
   {
    id: "mollythomas-ev5",
    title: "Dexamethasone (Decadron) 0.6 mg/kg",
    meds: [
     {
      id: "moll-dexamethasone-102",
      name: "Dexamethasone (Decadron)",
      dose: "0.6 mg/kg",
      route: "IV",
      freq: "Give now",
      type: "scheduled",
      doses: [
       {
        at: 0
       }
      ]
     }
    ]
   },
   {
    id: "mollythomas-ev6",
    title: "Ampicillin (Principen) 50 mg/kg",
    meds: [
     {
      id: "moll-ampicillin-103",
      name: "Ampicillin (Principen)",
      dose: "50 mg/kg",
      route: "IV",
      freq: "Every 6 hours",
      type: "scheduled",
      doses: [
       {
        at: 0
       },
       {
        at: 360
       },
       {
        at: 720
       },
       {
        at: 1080
       }
      ]
     }
    ]
   },
   {
    id: "mollythomas-ev7",
    title: "Dextrose 5% in 0.45% sodium chloride (D5 1/2 NS) Daily maintenance rate after void during bolus",
    meds: [
     {
      id: "moll-dextrose-5-in-0-45-sodiu-104",
      name: "Dextrose 5% in 0.45% sodium chloride (D5 1/2 NS)",
      dose: "Daily maintenance rate after void during bolus",
      route: "IV infusion",
      freq: "Continuous",
      type: "continuous"
     }
    ]
   }
  ],
  facultyGuide: [
   {
    title: "Molly Thomas Faculty Simulation Guide",
    md: "7-month-old female, 7 kg, NKDA, upper-airway obstruction/croup. Decreased oral intake and difficulty breathing; irritable, pale, barking cough, nasal flaring. Nasopharyngeal wash positive for parainfluenza; CMP pending. Shift 1: T 37.3 C, HR 165, BP 80/40, RR 50, SpO2 87%; congestion and barking cough, deep suprasternal retractions, nasal flaring, pale dry mucosa, capillary refill 3 seconds. Shift 2 after choking/coughing and cyanosis: T 39 C, HR 168, BP 90/55, RR 60, SpO2 83%; coarse breath sounds and crackles, deep retractions and nasal flaring, fussy, capillary refill 2 seconds. Apply 100% oxygen by mask, support airway and suction, administer released medications, contact respiratory therapy and radiology, and initiate PEWS/MET escalation."
   }
  ],
  hpi: "The patient is 7-month-old female just admitted to the pediatric floor.  The patient was brought to the emergency department by her mother because of decreased oral intake and difficulty breathing.  The infant is irritable and pale with a barking cough and nasal flaring. Nasal pharyngeal wash positive for parainfluenza. CMP pending.\n\n# History\n- Video Documentation\n<video src=\"https://youtu.be/oeoAze-CHng\"></video>\n\n# Physicians’ documents\n\n# Diagnostics\n\n# Nursing"
 },
 {
  id: "stephaniesmith",
  level: 2,
  experiences: [
   "peds"
  ],
  source: "ATU-Simulation-Hospital (Notion)",
  name: {
   first: "Stephanie",
   last: "Smith"
  },
  mrn: "201040",
  dob: "2010-07-14",
  age: "16 years",
  sex: "F",
  unit: "Pediatric Unit",
  room: "211E",
  service: "Pediatrics",
  attending: "Dr. Henderson",
  admitted: {
   at: -240
  },
  scenarioStart: "08:00",
  admitDx: "Sickle Cell Crisis",
  codeStatus: "Full Code",
  isolation: "Standard",
  nkda: true,
  allergies: [],
  heightCm: null,
  weightKg: 53.5,
  assessmentForms: [
   "wdl-adult",
   "pain",
   "morse"
  ],
  orders: [
   {
    id: "stephaniesmith-o4-0",
    cat: "Admission",
    text: "Admit to Pediatric floor for sickle cell crisis-medical admission",
    at: -240,
    by: "Dr. Henderson"
   },
   {
    id: "stephaniesmith-o4-1",
    cat: "Code Status",
    text: "Full Code",
    at: -240,
    by: "Dr. Henderson"
   },
   {
    id: "stephaniesmith-o4-2",
    cat: "Diet",
    text: "Regular diet",
    at: -240,
    by: "Dr. Henderson"
   },
   {
    id: "stephaniesmith-o4-3",
    cat: "Nursing",
    text: "Vital signs Q 4 hours",
    at: -240,
    by: "Dr. Henderson"
   },
   {
    id: "stephaniesmith-o4-4",
    cat: "Nursing",
    text: "Strict I&O",
    at: -240,
    by: "Dr. Henderson"
   },
   {
    id: "stephaniesmith-o4-5",
    cat: "Nursing",
    text: "Daily weight",
    at: -240,
    by: "Dr. Henderson"
   },
   {
    id: "stephaniesmith-o4-6",
    cat: "Nursing",
    text: "Bedrest with bathroom privileges",
    at: -240,
    by: "Dr. Henderson"
   },
   {
    id: "stephaniesmith-o4-7",
    cat: "IV Fluids",
    text: "IV : IV D5 1/2 NS @ 150ml/hr",
    at: -240,
    by: "Dr. Henderson"
   },
   {
    id: "stephaniesmith-o4-8",
    cat: "Respiratory",
    text: "Oxygen therapy protocol: Titrate Spo2>/= 92",
    at: -240,
    by: "Dr. Henderson"
   }
  ],
  meds: [
   {
    id: "step-morphine-0",
    name: "Morphine",
    dose: "5 mg",
    route: "IV",
    freq: "Every 4 hours PRN pain",
    type: "prn",
    highAlert: true,
    indication: "pain",
    minIntervalHr: 4
   }
  ],
  vitals: [
   {
    at: -150,
    temp: 101.5,
    hr: 108,
    rr: 34,
    sbp: 142,
    dbp: 94,
    spo2: 86,
    o2: "Nasal cannula",
    o2Flow: 2,
    by: "Prior RN"
   },
   {
    at: -120,
    temp: 100.9,
    tempRoute: "Axillary",
    hr: 107,
    rr: 22,
    sbp: 120,
    dbp: 90,
    spo2: 92,
    o2: "Nasal cannula",
    o2Flow: 5,
    note: "1:36",
    by: "Prior RN"
   },
   {
    at: -90,
    temp: 100.4,
    tempRoute: "Axillary",
    hr: 109,
    rr: 22,
    sbp: 121,
    dbp: 90,
    spo2: 91,
    o2: "Nasal cannula",
    o2Flow: 5,
    note: "1:58",
    by: "Prior RN"
   }
  ],
  labs: [
   {
    id: "stephaniesmith-l8-0-0",
    panel: "CBC Results -Smith",
    at: -120,
    results: [
     {
      t: "WBC",
      v: "16"
     },
     {
      t: "Hgb",
      v: "5"
     },
     {
      t: "HCT",
      v: "28"
     },
     {
      t: "Platelets",
      v: "130"
     },
     {
      t: "Blood Type",
      v: "A-"
     }
    ]
   },
   {
    id: "stephaniesmith-l8-0-1",
    panel: "CBC Results -Smith",
    at: -120,
    results: [
     {
      t: "WBC",
      v: "4.5-10"
     },
     {
      t: "Hgb",
      v: "12.1-15.1"
     },
     {
      t: "HCT",
      v: "36.1-44.3"
     },
     {
      t: "Platelets",
      v: "140-400"
     }
    ]
   }
  ],
  imaging: [],
  notes: [
   {
    id: "stephaniesmith-n3",
    type: "Progress Notes",
    author: "Dr. Henderson",
    at: -270,
    md: true,
    text: "### ** **\n\n**Pediatric Admission Note**\n**Patient Name:** Stephanie Smith\n**DOB:** 07/14/XXXX\n**Age/Sex:** 16-year-old female\n**Date of Admission:** today\n**Admitting Physician:** Dr. Henderson\n**Source of History:** Patient and mother\n**Chief Complaint:** Chest pain and shortness of breath\n### **History of Present Illness**\nStephanie Smith is a **16-year-old female** with a known history of **sickle cell disease (HbSS)** diagnosed at age 5. She has experienced **annual hospitalizations for vaso-occlusive crises** over the past eight years. The patient presented to the **Emergency Department** with complaints of **chest pain and shortness of breath**, which have progressively worsened despite her usual home management with **hydration, rest, and pain medications.**\nShe describes the chest pain as **sharp, constant, and worse with deep breaths.** She also reports **generalized body pain, particularly in her lower extremities, consistent with prior sickle cell crises.** No history of recent infection or fever reported.\nIn the ED, a **type and crossmatch, along with a CBC, were obtained.** Her mother provided **consent for a blood transfusion.**\n### **Past Medical History**\n- **Sickle Cell Disease (HbSS)** – diagnosed at age 5\n- **Recurrent vaso-occlusive crises** requiring **annual hospitalizations**\n- No history of stroke or avascular necrosis\n- No history of splenectomy\n### **Medications**\n- Home pain regimen: Tylenol\n### **Allergies**\n- **NKDA**\n### **Family History**\n- Sickle cell trait in both parents\n### **Social History**\n- Lives with mother\n- Attends high school, no recent absences\n- No tobacco, alcohol, or drug use\n### **Review of Systems**\n- **General:** Fatigue, weakness\n- **Cardiovascular:** Chest pain, no palpitations\n- **Respiratory:** Shortness of breath, no cough or wheezing\n- **Musculoskeletal:** Generalized pain, especially lower extremities\n- **Neurological:** No headache, no focal deficits\n- **GI/GU:** No nausea, vomiting, or abdominal pain\n### **Physical Examination**\n**General:** Appears uncomfortable, in moderate distress due to pain\n**Vital Signs:** [(Refer to linked documentation for values)]\n- Temperature: 38.6°C\n- Heart Rate: 100 bpm\n- Respiratory Rate: 30 breaths/min\n- Blood Pressure: 140/90  mmHg\n- Oxygen Saturation: 80% on room air\n**HEENT:**\n- No oropharyngeal lesions\n- No cervical lymphadenopathy\n**Respiratory:**\n- Mild tachypnea\n- No wheezing or crackles noted\n**Cardiovascular:**\n- Tachycardia, no murmurs, no gallops\n- No peripheral edema\n**Abdomen:**\n- Soft, non-tender, no hepatosplenomegaly\n**Musculoskeletal:**\n- Tenderness over lower extremities\n- No joint swelling or erythema\n**Neurological:**\n- No focal deficits\n### **Laboratory & Imaging Results**\n- **CBC:** pending\n- **Type & Crossmatch:** Completed,pending\n### **Assessment**\n16-year-old female with **sickle cell disease (HbSS),** presenting with **vaso-occlusive crisis complicated by chest pain and shortness of breath.** Concern for **acute chest syndrome** versus **severe vaso-occlusive crisis.**\n### **Plan**\n1. **Pain Management:**\n- **IV opioids** per protocol for severe pain\n- Continue **scheduled acetaminophen/NSAIDs** if tolerated\n2. **Oxygenation & Respiratory Support:**\n- Supplemental **oxygen if SpO₂ < 92%**\n- Monitor for worsening respiratory symptoms\n3. **Hydration:**\n- IV fluids (**D5 ½ NS**) at maintenance rate\n- Encourage PO intake if tolerated\n4. **Blood Transfusion:**\n- **Transfusion planned** per mother's consent\n- Monitor post-transfusion hemoglobin and symptoms\n5. **Infection Surveillance:**\n- Monitor for fever/signs of sepsis\n6. **Disposition:**\n- **Admit to Pediatric Floor** for close monitoring\n\nPersistent cough"
   }
  ],
  io: [],
  documents: [
   {
    id: "stephaniesmith-d1",
    title: "Input and output tracking",
    category: "io",
    md: "Intake/Output Flowchart\nUse this sheet to track how much your child takes in and how much comes out\n\n|  |  | **Intake** |  |  | **Output** |  |  |  |  |\n| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |\n| Date | Time | Amount in ml’s | Solid food intake | Other/Notes | Urine output | Bowel Movement/Stools | Vomiting | Drainage | Other/Notes |"
   },
   {
    id: "stephaniesmith-d5",
    title: "ATU Pediatric Head-to-Toe Assessment  (Shift 2)",
    category: "assessments",
    md: "**VITALS & PAIN**\nTemp: _______   HR: _______   RR: _______   BP: _______   SpO₂: _______\nPain Score: _______\nPain Scale: ____ FLACC ____ FACES ____ Numeric ____ Nonverbal\n\n[Pediatric Early Warning Score (PEWS) Click to calculate](https://www.mdcalc.com/calc/3901/pediatric-early-warning-score-pews#when-to-use)\nBehavior Score (0–3): _______\nCardio Score (0–3): _______\nResp Score (0–3): _______\nTOTAL: _______\n### PEWS ≤2: low risk • Reassess as needed\n- Recommended to alert charge nurse and** staff MD**\n- PEWS 3-4: intermediate risk\n- PEWS ≥5: high risk\n- Recommended to initiate rapid **response team (MET Team)**\nClinical Concern / Escalation Notes:\n\n**NEUROLOGICAL / DEVELOPMENTAL**\nLOC: ____ Alert ____ Lethargic ____ Irritable ____ Unresponsive\nOrientation: ____ A&O x4 ____ x3 ____ x2 ____ x1 ____ Disoriented ____ Confused\nBehavior: ____ Calm ____ Fussy ____ Consolable ____ Inconsolable\nCry: ____ Strong ____ Weak ____ High-pitched\nPupils: ____ Equal ____ Reactive ____ Sluggish\nFontanelles: ____ Flat ____ Sunken ____ Bulging\nDevelopment Appropriate: ____ Yes ____ No\nAbnormal Findings:\n\n**CARDIOVASCULAR**\nRhythm: ____ Regular ____ Irregular ____ Murmur\nRate: ____ Tachycardia ____ Bradycardia\nCap Refill: ____ <2 sec ____ >2 sec\nPulses: ____ Strong ____ Weak ____ Absent\nSkin Color: ____ Pink ____ Pale ____ Cyanotic ____ Mottled\nApical Pulse: _______\nAbnormal Findings:\n\n**RESPIRATORY**\nBreath Sounds: ____ Clear ____ Diminished ____ Crackles ____ Wheezes ____ Rhonchi\nEffort: ____ Unlabored ____ Dyspnea ____ Retractions ____ Nasal flaring ____ Grunting\nOxygen: ____ Room Air ____ Nasal Cannula ____ Mask ____ Non-rebreather\nO₂ Rate: _______\nCough: ____ None ____ Dry ____ Productive\nAbnormal Findings:\n\n**GASTROINTESTINAL**\nAbdomen: ____ Soft ____ Firm ____ Distended\nBowel Sounds: ____ Present ____ Hypoactive ____ Hyperactive\nNausea/Vomiting: ____ Nausea ____ Vomiting\nFeeding: ____ Breast ____ Bottle ____ PO ____ NPO\nTolerance: __________________________\nLast BM: __________________________\nStool: ____ Normal ____ Diarrhea ____ Constipation\nAbnormal Findings:\n\n**GENITOURINARY / FOLEY**\nVoiding: ____ Normal ____ Decreased ____ None\nFoley Present: ____ Yes ____ No\nUrine: ____ Clear ____ Cloudy ____ Dark\nOutput Adequate: ____ Yes ____ No\nDiaper: ____ Wet ____ Dry\nOutput (mL): _______\nUrine Color: __________________________\nFrench Size: _______\nBalloon: _______\nInserted By: __________________________\nAbnormal Findings:\n\n**IV / FLUIDS**\nLocation: ____ RT Hand ____ LT Hand ____ RT FA ____ LT FA ____ RT AC ____ LT AC ____ RT Wrist ____ LT Wrist\nGauge: ____ 18g ____ 20g ____ 22g ____ 24g\nSite Condition: ____ WNL ____ Red ____ Swollen ____ Infiltrated\nFluids: __________________________\nRate (mL/hr): _______\nOther Lines/Drains: __________________________\nAbnormal Findings:\n\n**MUSCULOSKELETAL / SKIN**\nMobility: ____ Independent ____ Assist x1 ____ Assist x2 ____ Bedrest\nROM: ____ Full ____ Limited\nTone: ____ Normal ____ Hypotonic ____ Hypertonic\nSkin: ____ Intact ____ Redness ____ Pressure Injury ____ Wound\nTemp: ____ Warm/Dry ____ Cool/Pale\nOther: ____ Bruising ____ Dressing CDI\nBirthmarks / Lesions / Rash: __________________________\nAbnormal Findings:\n\n**SAFETY**\n____ Bed low\n____ Call light in reach\n____ Side rails up\n____ Fall precautions\n____ ID band present\n____ Alarm on"
   },
   {
    id: "stephaniesmith-d6",
    title: "ATU Pediatric Head-to-Toe Assessment (Shift 3)",
    category: "assessments",
    md: "**VITALS & PAIN**\nTemp: _______   HR: _______   RR: _______   BP: _______   SpO₂: _______\nPain Score: _______\nPain Scale: ____ FLACC ____ FACES ____ Numeric ____ Nonverbal\n\n[Pediatric Early Warning Score (PEWS) Click to calculate](https://www.mdcalc.com/calc/3901/pediatric-early-warning-score-pews#when-to-use)\nBehavior Score (0–3): _______\nCardio Score (0–3): _______\nResp Score (0–3): _______\nTOTAL: _______\n### PEWS ≤2: low risk • Reassess as needed\n- Recommended to alert charge nurse and** staff MD**\n- PEWS 3-4: intermediate risk\n- PEWS ≥5: high risk\n- Recommended to initiate rapid **response team (MET Team)**\nClinical Concern / Escalation Notes:\n\n**NEUROLOGICAL / DEVELOPMENTAL**\nLOC: ____ Alert ____ Lethargic ____ Irritable ____ Unresponsive\nOrientation: ____ A&O x4 ____ x3 ____ x2 ____ x1 ____ Disoriented ____ Confused\nBehavior: ____ Calm ____ Fussy ____ Consolable ____ Inconsolable\nCry: ____ Strong ____ Weak ____ High-pitched\nPupils: ____ Equal ____ Reactive ____ Sluggish\nFontanelles: ____ Flat ____ Sunken ____ Bulging\nDevelopment Appropriate: ____ Yes ____ No\nAbnormal Findings:\n\n**CARDIOVASCULAR**\nRhythm: ____ Regular ____ Irregular ____ Murmur\nRate: ____ Tachycardia ____ Bradycardia\nCap Refill: ____ <2 sec ____ >2 sec\nPulses: ____ Strong ____ Weak ____ Absent\nSkin Color: ____ Pink ____ Pale ____ Cyanotic ____ Mottled\nApical Pulse: _______\nAbnormal Findings:\n\n**RESPIRATORY**\nBreath Sounds: ____ Clear ____ Diminished ____ Crackles ____ Wheezes ____ Rhonchi\nEffort: ____ Unlabored ____ Dyspnea ____ Retractions ____ Nasal flaring ____ Grunting\nOxygen: ____ Room Air ____ Nasal Cannula ____ Mask ____ non-rebreather\nO₂ Rate: _______\nCough: ____ None ____ Dry ____ Productive\nAbnormal Findings:\n\n**GASTROINTESTINAL**\nAbdomen: ____ Soft ____ Firm ____ Distended\nBowel Sounds: ____ Present ____ Hypoactive ____ Hyperactive\nNausea/Vomiting: ____ Nausea ____ Vomiting\nFeeding: ____ Breast ____ Bottle ____ PO ____ NPO\nTolerance: __________________________\nLast BM: __________________________\nStool: ____ Normal ____ Diarrhea ____ Constipation\nAbnormal Findings:\n\n**GENITOURINARY / FOLEY**\nVoiding: ____ Normal ____ Decreased ____ None\nFoley Present: ____ Yes ____ No\nUrine: ____ Clear ____ Cloudy ____ Dark\nOutput Adequate: ____ Yes ____ No\nDiaper: ____ Wet ____ Dry\nOutput (mL): _______\nUrine Color: __________________________\nFrench Size: _______\nBalloon: _______\nInserted By: __________________________\nAbnormal Findings:\n\n**IV / FLUIDS**\nLocation: ____ RT Hand ____ LT Hand ____ RT FA ____ LT FA ____ RT AC ____ LT AC ____ RT Wrist ____ LT Wrist\nGauge: ____ 18g ____ 20g ____ 22g ____ 24g\nSite Condition: ____ WNL ____ Red ____ Swollen ____ Infiltrated\nFluids: __________________________\nRate (mL/hr): _______\nOther Lines/Drains: __________________________\nAbnormal Findings:\n\n**MUSCULOSKELETAL / SKIN**\nMobility: ____ Independent ____ Assist x1 ____ Assist x2 ____ Bedrest\nROM: ____ Full ____ Limited\nTone: ____ Normal ____ Hypotonic ____ Hypertonic\nSkin: ____ Intact ____ Redness ____ Pressure Injury ____ Wound\nTemp: ____ Warm/Dry ____ Cool/Pale\nOther: ____ Bruising ____ Dressing CDI\nBirthmarks / Lesions / Rash: __________________________\nAbnormal Findings:\n\n**SAFETY**\n____ Bed low\n____ Call light in reach\n____ Side rails up\n____ Fall precautions\n____ ID band present\n____ Alarm on"
   },
   {
    id: "stephaniesmith-d7",
    title: "ATU Pediatric Head-to-Toe Assessment Shift 1",
    category: "assessments",
    md: "**VITALS & PAIN**\nTemp: _______   HR: _______   RR: _______   BP: _______   SpO₂: _______\nPain Score: _______\nPain Scale: ____ FLACC ____ FACES ____ Numeric ____ Nonverbal\n\n[Pediatric Early Warning Score (PEWS) Click to calculate](https://www.mdcalc.com/calc/3901/pediatric-early-warning-score-pews#when-to-use)\nBehavior Score (0–3): _______\nCardio Score (0–3): _______\nResp Score (0–3): _______\nTOTAL: _______\n### PEWS ≤2: low risk • Reassess as needed\n- Recommended to alert charge nurse and** staff MD**\n- PEWS 3-4: intermediate risk\n- PEWS ≥5: high risk\n- Recommended to initiate rapid **response team (MET Team)**\nClinical Concern / Escalation Notes:\n\n**NEUROLOGICAL / DEVELOPMENTAL**\nLOC: ____ Alert ____ Lethargic ____ Irritable ____ Unresponsive\nOrientation: ____ A&O x4 ____ x3 ____ x2 ____ x1 ____ Disoriented ____ Confused\nBehavior: ____ Calm ____ Fussy ____ Consolable ____ Inconsolable\nCry: ____ Strong ____ Weak ____ High-pitched\nPupils: ____ Equal ____ Reactive ____ Sluggish\nFontanelles: ____ Flat ____ Sunken ____ Bulging\nDevelopment Appropriate: ____ Yes ____ No\nAbnormal Findings:\n\n**CARDIOVASCULAR**\nRhythm: ____ Regular ____ Irregular ____ Murmur\nRate: ____ Tachycardia ____ Bradycardia\nCap Refill: ____ <2 sec ____ >2 sec\nPulses: ____ Strong ____ Weak ____ Absent\nSkin Color: ____ Pink ____ Pale ____ Cyanotic ____ Mottled\nApical Pulse: _______\nAbnormal Findings:\n\n**RESPIRATORY**\nBreath Sounds: ____ Clear ____ Diminished ____ Crackles ____ Wheezes ____ Rhonchi\nEffort: ____ Unlabored ____ Dyspnea ____ Retractions ____ Nasal flaring ____ Grunting\nOxygen: ____ Room Air ____ Nasal Cannula ____ Mask ____ Non-rebreather\nO₂ Rate: _______\nCough: ____ None ____ Dry ____ Productive\nAbnormal Findings:\n\n**GASTROINTESTINAL**\nAbdomen: ____ Soft ____ Firm ____ Distended\nBowel Sounds: ____ Present ____ Hypoactive ____ Hyperactive\nNausea/Vomiting: ____ Nausea ____ Vomiting\nFeeding: ____ Breast ____ Bottle ____ PO ____ NPO\nTolerance: __________________________\nLast BM: __________________________\nStool: ____ Normal ____ Diarrhea ____ Constipation\nAbnormal Findings:\n\n**GENITOURINARY / FOLEY**\nVoiding: ____ Normal ____ Decreased ____ None\nFoley Present: ____ Yes ____ No\nUrine: ____ Clear ____ Cloudy ____ Dark\nOutput Adequate: ____ Yes ____ No\nDiaper: ____ Wet ____ Dry\nOutput (mL): _______\nUrine Color: __________________________\nFrench Size: _______\nBalloon: _______\nInserted By: __________________________\nAbnormal Findings:\n\n**IV / FLUIDS**\nLocation: ____ RT Hand ____ LT Hand ____ RT FA ____ LT FA ____ RT AC ____ LT AC ____ RT Wrist ____ LT Wrist\nGauge: ____ 18g ____ 20g ____ 22g ____ 24g\nSite Condition: ____ WNL ____ Red ____ Swollen ____ Infiltrated\nFluids: __________________________\nRate (mL/hr): _______\nOther Lines/Drains: __________________________\nAbnormal Findings:\n\n**MUSCULOSKELETAL / SKIN**\nMobility: ____ Independent ____ Assist x1 ____ Assist x2 ____ Bedrest\nROM: ____ Full ____ Limited\nTone: ____ Normal ____ Hypotonic ____ Hypertonic\nSkin: ____ Intact ____ Redness ____ Pressure Injury ____ Wound\nTemp: ____ Warm/Dry ____ Cool/Pale\nOther: ____ Bruising ____ Dressing CDI\nBirthmarks / Lesions / Rash: __________________________\nAbnormal Findings:\n\n**SAFETY**\n____ Bed low\n____ Call light in reach\n____ Side rails up\n____ Fall precautions\n____ ID band present\n____ Alarm on"
   },
   {
    id: "stephaniesmith-d10",
    title: "Blood Transfusion Consent",
    category: "documents",
    md: "![](assets/imported/stephanie-smith-blood-consent.jpg)"
   },
   {
    id: "stephaniesmith-d11",
    title: "BLOOD BANK FORMS-Smith",
    category: "documents",
    md: "PATIENT NAME: Stephanie Smith\n\nDOB 7/14/xxxx\nDATE 02/24/25\nYou need two RN’S to check the following\n**Blood left lab at **\n\n- [ ] Verify order to transfuse PRBC\n- [ ] Verify blood consent is signed by patient or patient representative.\n- [ ] Verify blood type compatibility\n- [ ] Blood band number matches blood unit number\n- [ ] Check blood expiration date\n- [ ] Verify patient name and DOB\n- [ ] Wristband ID compared with ALL blood component units at patient’s bedside\n- [ ] Patient has a dedicated venous access line with only blood and/or 0.9% NaCl running Patient\n- [ ] Have blood tubing\n- [ ] The blood product has not sit for more than 30 minutes after leaving the lab.\n- [ ] Baseline vitals signs obtained\n\n| Component blood type | Unit ID Number | Unit ABO/Rh | Start |  | End |  | Adverse Reaction |  |\n| --- | --- | --- | --- | --- | --- | --- | --- | --- |\n| PRBC | JF46350 | A- | 1430 |  |  |  |  |  |\n\n- Vital signs, including patient temperature, are to be monitored every 10 minutes and recorded.\n\n| Pre-transfusion |  |  |  |  |\n| --- | --- | --- | --- | --- |\n| Transfusion vitals below q 15 mins x 1, q 30 mins x 2 and then q hour. |  |  |  |  |\n| Time initial | 38.0 C | 109 HR 141/92 | 93% O2 NC 4L | 38 RR |\n| 15 min | 39.0C temperature | 109 HR 140/93 | 94% O2 NC 4L | 34 RR |\n| 1 hr | 37.9 C | 80 HR 141/93 | 95% O2 NC 4L | 34 RR |"
   }
  ],
  events: [
   {
    id: "stephaniesmith-ev1",
    title: "Radiology (Chest Xray) -Smith",
    imaging: [
     {
      id: "stephaniesmith-ev1-im0",
      study: "Radiology (Chest Xray) -Smith",
      text: "Bilateral infiltrates with left lower lobe consolidation consistent with pneumonia",
      images: [
       "assets/imported/8329c1088d7c5dd78e.jpeg"
      ]
     }
    ]
   },
   {
    id: "stephaniesmith-ev2",
    title: "Chest X-Ray",
    orders: [
     {
      id: "stephaniesmith-ev2-o0-0",
      cat: "Imaging",
      text: "Chest X-Ray",
      by: "Dr. Henderson"
     }
    ]
   },
   {
    id: "stephaniesmith-ev3",
    title: "Infuse 2 Units PRBC",
    orders: [
     {
      id: "stephaniesmith-ev3-o0-0",
      cat: "Blood Products",
      text: "Infuse 2 Units PRBC",
      by: "Dr. Henderson"
     }
    ]
   },
   {
    id: "stephaniesmith-ev4",
    title: "Ceftriaxone 500 mg/100 mL q12h",
    orders: [
     {
      id: "stephaniesmith-ev4-o0-0",
      cat: "Medication",
      text: "Ceftriaxone 500 mg/100 mL q12h",
      by: "Dr. Henderson"
     }
    ],
    meds: [
     {
      id: "step-ceftriaxone-102",
      name: "Ceftriaxone",
      dose: "500 mg/100 mL",
      route: "",
      freq: "Every 12 hours",
      type: "scheduled",
      doses: [
       {
        at: 0
       },
       {
        at: 720
       }
      ]
     }
    ]
   },
   {
    id: "stephaniesmith-ev5",
    title: "Acetaminophen 650 mg",
    orders: [
     {
      id: "stephaniesmith-ev5-o0-0",
      cat: "Medication",
      text: "Acetaminophen 650 mg",
      by: "Dr. Henderson"
     }
    ],
    meds: [
     {
      id: "step-acetaminophen-101",
      name: "Acetaminophen",
      dose: "650 mg",
      route: "",
      freq: "",
      type: "scheduled",
      doses: [
       {
        at: 0
       }
      ]
     }
    ]
   },
   {
    id: "stephaniesmith-ev6",
    title: "CBC in AM",
    orders: [
     {
      id: "stephaniesmith-ev6-o0-0",
      cat: "Lab",
      text: "CBC in AM",
      by: "Dr. Henderson"
     }
    ]
   }
  ],
  hpi: "**Mother: Susan Smith phone on file     Password: Milo**\n\n\nA 16-year-old female patient was brought to the ED by her mother. She was diagnosed with sickle cell disease at the age of 5 and has been hospitalized annually for the past eight years due to crisis. The patient reports experiencing chest pain and shortness of breath. Her usual management with fluids, rest, and pain medication has been ineffective. She is currently alone in the room. In the ED, a type and crossmatch, along with a CBC, were drawn. Her mother provided consent for a blood transfusion.\n\n# History\n\n# Physicians’ documents\n\n# Diagnostics\n\n# Nursing",
  bloodType: "A−"
 }
]);
