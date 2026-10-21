/*
 * ATU barcodes — the final, accepted barcodes for the 13 simulation patients. These labels are
 * already printed and installed (source: "Laura Jobe — All 13 Patients — Barcodes, Medications,
 * Doses", ATU faculty handoff, October 21, 2026; ATU commit e986b04).
 *
 *   wristbands  Code 39, 4-digit patient code (1000–1012). Accepted alongside the MRN.
 *   packages    Code 128, MED-#### package code. A package identifies a medication PACKAGE (the drug),
 *               not a dose: scanning it finds the matching order(s) on the current patient's MAR
 *               ("match" = patterns tested against the order's medication name). When more than one
 *               order matches (e.g., aspirin 81 mg and 325 mg), the nurse picks the order.
 *               "patients" = patients whose ATU MAR lists this package (for the label checklist).
 *
 * Do not renumber. New codes for new medications must use unused MED numbers (next: MED-0066).
 */
window.ATU_BARCODES = {
  wristbands: {
    '1000': 'ameliasung',
    '1001': 'janefowler',
    '1002': 'fatimasanogo',
    '1003': 'mollythomas',
    '1004': 'stephaniesmith',
    '1005': 'charlesjones',
    '1006': 'babyboysung',
    '1007': 'brody',
    '1008': 'livingston',
    '1009': 'shapiro',
    '1010': 'sharp',
    '1011': 'watkins',
    '1012': 'carter'
  },
  packages: {
    'MED-0001': { name: "Oxytocin", match: ["^oxytocin"], patients: ["ameliasung","fatimasanogo"] },
    'MED-0002': { name: "Lactated Ringer’s", match: ["lactated ringer"], patients: ["ameliasung","fatimasanogo","janefowler","livingston"] },
    'MED-0003': { name: "Clindamycin", match: ["^clindamycin"], patients: ["ameliasung"] },
    'MED-0004': { name: "Morphine", match: ["^morphine"], patients: ["janefowler","stephaniesmith"] },
    'MED-0005': { name: "Lidocaine 1% solution", match: ["^lidocaine"], patients: ["ameliasung"] },
    'MED-0006': { name: "Cefazolin", match: ["^cefazolin"], patients: ["janefowler"] },
    'MED-0007': { name: "Metoclopramide 10 mg/2 mL injection", match: ["^metoclopramide"], patients: ["janefowler"] },
    'MED-0008': { name: "Midazolam 5 mg/mL injection", match: ["^midazolam"], patients: ["janefowler"] },
    'MED-0009': { name: "Ondansetron 4 mg/2 mL injection", match: ["^ondansetron"], patients: ["janefowler"] },
    'MED-0010': { name: "Naloxone (Narcan) 0.4 mg/mL injection", match: ["^naloxone"], patients: ["janefowler"] },
    'MED-0011': { name: "Ketorolac 30 mg/mL injection", match: ["^ketorolac"], patients: ["janefowler","livingston"] },
    'MED-0012': { name: "Witch hazel", match: ["^witch hazel"], patients: ["fatimasanogo"] },
    'MED-0013': { name: "Pramoxine", match: ["^pramoxine"], patients: ["fatimasanogo"] },
    'MED-0014': { name: "Oxycodone / acetaminophen", match: ["^oxycodone ?\\/ ?acetaminophen","percocet"], patients: ["fatimasanogo"] },
    'MED-0015': { name: "Ibuprofen", match: ["^ibuprofen"], patients: ["fatimasanogo"] },
    'MED-0016': { name: "Methylergonovine", match: ["^methylergonovine"], patients: ["fatimasanogo"] },
    'MED-0017': { name: "Carboprost tromethamine", match: ["^carboprost"], patients: ["fatimasanogo"] },
    'MED-0018': { name: "Misoprostol", match: ["^misoprostol"], patients: ["fatimasanogo"] },
    'MED-0019': { name: "Tranexamic acid", match: ["^tranexamic"], patients: ["fatimasanogo"] },
    'MED-0020': { name: "Sodium chloride 0.9%", match: ["^normal saline","^0\\.9% sodium chloride","^sodium chloride 0\\.9"], patients: ["charlesjones","mollythomas","shapiro","sharp","livingston","watkins"] },
    'MED-0021': { name: "Racepinephrine 2.25% nebulizer solution", match: ["^racepinephrine"], patients: ["mollythomas"] },
    'MED-0022': { name: "Dexamethasone", match: ["^dexamethasone"], patients: ["mollythomas"] },
    'MED-0023': { name: "Ampicillin", match: ["^ampicillin"], patients: ["mollythomas"] },
    'MED-0024': { name: "Dextrose 5% / sodium chloride 0.45% infusion bag", match: ["^dextrose 5% in 0\\.45% sodium chloride(?!.*(kcl|potassium))","^d5 ?(1\\/2|½) ?ns(?!.*(kcl|potassium))"], patients: ["mollythomas","stephaniesmith"] },
    'MED-0025': { name: "Lisinopril", match: ["^lisinopril"], patients: ["charlesjones"] },
    'MED-0026': { name: "Metoprolol", match: ["^metoprolol"], patients: ["charlesjones"] },
    'MED-0027': { name: "Amiodarone", match: ["^amiodarone"], patients: ["charlesjones"] },
    'MED-0028': { name: "Digoxin", match: ["^digoxin"], patients: ["charlesjones"] },
    'MED-0029': { name: "Metformin", match: ["^metformin"], patients: ["charlesjones"] },
    'MED-0030': { name: "Warfarin", match: ["^warfarin"], patients: ["charlesjones"] },
    'MED-0031': { name: "Regular insulin", match: ["regular insulin","^insulin regular"], patients: ["charlesjones"] },
    'MED-0032': { name: "Spironolactone", match: ["^spironolactone"], patients: ["charlesjones"] },
    'MED-0033': { name: "Vitamin K", match: ["^vitamin k","^phytonadione"], patients: ["babyboysung"] },
    'MED-0034': { name: "Erythromycin ophthalmic ointment", match: ["^erythromycin ophthalmic"], patients: ["babyboysung"] },
    'MED-0035': { name: "Glucose gel", match: ["^glucose gel"], patients: ["babyboysung"] },
    'MED-0036': { name: "Dextrose 5% / sodium chloride 0.45% / potassium chloride", match: ["^d5 ?(1\\/2|½) ?ns with .*(kcl|potassium)","^dextrose 5%.*0\\.45%.*(kcl|potassium)"], patients: ["brody"] },
    'MED-0037': { name: "Albuterol", match: ["^albuterol"], patients: ["brody"] },
    'MED-0038': { name: "Ipratropium", match: ["^ipratropium"], patients: ["brody"] },
    'MED-0039': { name: "Prednisone", match: ["^prednisone"], patients: ["brody"] },
    'MED-0040': { name: "Docusate sodium", match: ["^docusate"], patients: ["livingston"] },
    'MED-0041': { name: "Enoxaparin", match: ["^enoxaparin"], patients: ["shapiro","sharp","livingston","watkins"] },
    'MED-0042': { name: "Piperacillin-tazobactam", match: ["^piperacillin"], patients: ["livingston"] },
    'MED-0043': { name: "Calcium carbonate", match: ["^calcium carbonate"], patients: ["livingston"] },
    'MED-0044': { name: "Alendronate", match: ["^alendronate"], patients: ["livingston"] },
    'MED-0045': { name: "Oxycodone", match: ["^oxycodone(?! ?\\/)"], patients: ["livingston","watkins"] },
    'MED-0047': { name: "Norepinephrine", match: ["^norepinephrine"], patients: ["livingston"] },
    'MED-0048': { name: "Vancomycin", match: ["^vancomycin"], patients: ["livingston"] },
    'MED-0049': { name: "Aspirin", match: ["^aspirin"], patients: ["shapiro","sharp"] },
    'MED-0050': { name: "Ticagrelor", match: ["^ticagrelor"], patients: ["shapiro","sharp"] },
    'MED-0051': { name: "Nitroglycerin", match: ["^nitroglycerin"], patients: ["shapiro","sharp"] },
    'MED-0052': { name: "Hydrochlorothiazide", match: ["^hydrochlorothiazide"], patients: ["watkins"] },
    'MED-0053': { name: "Ciprofloxacin", match: ["^ciprofloxacin"], patients: ["watkins"] },
    'MED-0054': { name: "Metronidazole", match: ["^metronidazole"], patients: ["watkins"] },
    'MED-0055': { name: "Gabapentin", match: ["^gabapentin"], patients: ["watkins"] },
    'MED-0056': { name: "Olanzapine", match: ["^olanzapine"], patients: ["carter"] },
    'MED-0057': { name: "Venlafaxine XR", match: ["^venlafaxine"], patients: ["carter"] },
    'MED-0058': { name: "Lorazepam", match: ["^lorazepam"], patients: ["carter"] },
    'MED-0059': { name: "Haloperidol", match: ["^haloperidol"], patients: ["carter"] },
    'MED-0060': { name: "Acetaminophen", match: ["^acetaminophen"], patients: ["stephaniesmith"] },
    'MED-0061': { name: "Ceftriaxone 500 mg/100 mL infusion bag", match: ["^ceftriaxone"], patients: ["stephaniesmith"] },
    'MED-0062': { name: "Ephedrine Injection", match: ["^ephedrine"], patients: ["ameliasung"] },
    'MED-0063': { name: "Bupivacaine / fentanyl epidural infusion 0.1% / 2 mcg/mL Epidural solution", match: ["^bupivacaine"], patients: ["ameliasung"] },
    'MED-0064': { name: "Hepatitis B vaccine Injection", match: ["^hepatitis b"], patients: ["babyboysung"] },
    'MED-0065': { name: "Fentanyl Injection", match: ["^fentanyl"], patients: ["fatimasanogo"] }
  }
};
