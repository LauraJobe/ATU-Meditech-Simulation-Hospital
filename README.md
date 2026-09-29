# ATU Simulation Hospital — SimEHR

A simulation electronic health record for nursing students to document in during simulation. It's laid out like MEDITECH Expanse: a dark icon toolbar (Return To, Home, Workload, Chart, Document, Orders, Suspend), Expanse's 3 × 4 folder tabs (Diagnostics · Provider Notes · Nurse/Allied Health · Medications / History & Problems · Administrative · Other Clinical / Summary · Activity · Flowsheets · Health Mgmt, with the active row in tan), a right-hand patient panel (Special Indicators, Allergies, Problems), and yellow-highlighted abnormal values, plus an eMAR with barcode scanning, flowsheets, and notes. It's an independent teaching tool, not affiliated with MEDITECH, and never holds real patient data.

It's a static website with no server, database, or build step. Host it free on GitHub Pages and open it in any browser on the sim lab workstations.

## What students can do

| Chart section | What it does |
|---|---|
| **Sign-in** | Students enter their name and role and **choose their sim experience**: Medical-Surgical, Advanced Medical-Surgical, ICU / Critical Care, Psychiatric / Mental Health, OB / Maternal-Newborn, or Pediatrics. Students see and can open **only that experience's patients**; to change experience they sign out and back in. Ruth Livingston starts on the ortho unit and shows ICU once the "Transfer to ICU" event is released. Instructors (after the PIN) can view any or all experiences from the census; click **Lock** in Instructor Tools before handing the computer back to a student. |
| **PCS Status Board** (census) | Modeled on the Expanse PCS Status Board: Rm/Bed, photo, Name/Diagnosis/Reg Status, alerts (allergy, DNR, isolation), Home Meds, next **Interventions** and **Next Meds** (overdue in red), **Orders** (Ack / New / red **Stat**), and yellow **New Results**. Click a row to select, double-click or **Open Chart** to open. Level 1/2/3 lists on the right. |
| **Worklist** | Care items with frequency, Last Done, and Status/Due (overdue items starred in red): vital signs at the ordered frequency, WDL assessment, pain, Braden, Morse, I&O, and more. **Document** opens the right form. |
| **Summary** | Alerts, patient info, latest vitals with abnormal flags, meds due now, abnormal results, HPI, and recent documentation. |
| **Orders** | Provider orders by category. **Acknowledge** new orders. Enter **verbal/telephone orders**; read-back is required and the order is flagged for co-signature. |
| **eMAR** | Scheduled, PRN, and continuous meds. **Scan the wristband and the medication** (a USB scanner or typing both work). The eMAR checks for wrong patient and wrong med, allergies, required pre-assessment (HR, BP, pain, labs), hold parameters, early/late doses, PRN given too soon, and high-alert double checks. It also prompts a PRN effectiveness reassessment. |
| **Vital Signs** | Entry form plus a time-column flowsheet with H/L flags. Patients can have their own ranges (e.g., SpO₂ 88–92% for COPD). |
| **Assessments** | ATU's **WDL / WDL-Except** physical assessment (definitions from the Notion charts), Mental Status Exam, pain, Braden, Morse, and GCS, with automatic scoring. |
| **Intake & Output** | Entries with current-shift, previous-shift, and 24-hour balance. |
| **Notes** | Nursing narrative, **SBAR provider notification**, DAR focus note, patient education, and I-PASS handoff. Notes are electronically signed and support addenda. |
| **Results** | Cumulative lab tables with H/L/critical flags, imaging/ECG reports, and **Mark Reviewed** for new results. |
| **Care Plan** | Nursing diagnoses (with suggestions), goals, interventions, and evaluations. |
| **History** | HPI, PMH/PSH, family and social history, and home meds. |
| **Heparin Flowsheet** | For Vernon Watkins' nurse-driven heparin protocol. Requires two-RN verification. |
| **Chart Report** | A printable record of everything the student documented, including errors and late entries. Students can **Print / Save as PDF** or download JSON to submit. |

Documentation follows legal-record rules. Entries are never deleted; they are **marked "entered in error"** with a reason and stay visible struck through. Entries charted more than 30 minutes after the event time are labeled **late entry**.

## Level 3 patients (from Notion)

| Patient | Sim experience | Scenario | Chart clock starts | Instructor events |
|---|---|---|---|---|
| Vincent Brody, 67 M | Adv. Med-Surg | COPD exacerbation | 1200 | — |
| Ruth Livingston, 80 F | ICU | POD 5 ORIF R hip → deterioration | 0930 | **Transfer to ICU** (NS bolus, norepinephrine, Foley, vancomycin, DC pip-tazo/LR) |
| Carl Shapiro, 54 M | ICU | NSTEMI | 1400 | **Repeat troponin resulted** (0.06 → 0.1) |
| Karl Sharp, 64 M | Adv. Med-Surg | NSTEMI, **DNR** (look-alike of Shapiro — kept in a different experience so students never see both) | 1400 | — |
| Vernon Watkins, 69 M | Adv. Med-Surg | POD 4 hemicolectomy → STAT orders | 1000 | **STAT orders — nurse-driven heparin protocol** |
| David Carter, 28 M | Psych | Schizophrenia, involuntary hold | 1000 | — |

Level 1 and Level 2 tabs are ready; their patients just need to be added (see below).

## Running a simulation

1. **Before the sim:** open **Instructor** (PIN in `js/config.js`, default `2468`). Click **Reset Patient** for the patients you're using, then **Print Wristbands & Med Labels** and put the labels on the manikin and meds.
2. **Students sign in** with their name and role. Their name becomes the signature on every entry.
3. The chart clock starts at that patient's scenario time (e.g., 1400) the first time the chart is opened and runs in real time. **Restart Clock** resets it.
4. **During the sim:** in Instructor Tools, click **Release Now** on an event (STAT orders, new results, transfer orders). The new orders and results show up flagged **NEW** for the student to acknowledge and act on.
5. **After the sim:** the student opens **Chart Report** and prints or saves it as a PDF, or you use **Export All Documentation** to save a JSON backup.

> **Important:** documentation is saved in the browser on the computer where it was entered (localStorage). Release events and print reports on the same workstation the student used. Clearing browser data erases it, so export when you need a copy.

## Put it online with GitHub Pages (one time, about 2 minutes)

1. In this repository on GitHub, go to **Settings → Pages**.
2. Under **Build and deployment**, set **Source: Deploy from a branch**, **Branch: `main`**, folder **`/ (root)`**, and click **Save**. (Merge this work into `main` first.)
3. After about a minute your EHR is live at `https://<your-github-username>.github.io/ATU-Meditech-Simulation-Hospital/`.
4. You can embed that link in the Notion Level 3 page, the same way you embed your other GitHub Pages tools.

To try it locally, open `index.html` in a browser, or run `python3 -m http.server` in this folder and go to `http://localhost:8000`.

## Customizing

- **Settings** (hospital name, instructor PIN, scan requirement, due window, vital-sign ranges): `js/config.js`
- **Patients:** `js/data/patients.js`. See **[docs/ADDING-PATIENTS.md](docs/ADDING-PATIENTS.md)** for every field, plus `docs/patient-template.json`, which you can import from Instructor Tools → **Add Patient (JSON)** without editing code.
- **Sim experiences:** the list is in `js/config.js` (`experiences`). Each patient's `experiences: ['advms', 'icu']` controls where it appears.
- **Assessment forms and WDL definitions:** `js/data/assessment-forms.js`

## Items to review in the Level 3 data

While moving the Notion charts over, I found these items. I kept your content as written unless noted, so please confirm:

- **Lab results stored as PDFs** in Notion couldn't be imported: Brody (`Brody_Labs.pdf`), Livingston (`Ruth_Livingston_lab_1.pdf`), Watkins (`watkin_labs.pdf`, `watkin_stat_lab.pdf`), and the Nurse Driven Heparin Protocol (`Heparin_1.pdf`). Each chart shows a notice until the values are added to `patients.js`. Shapiro's and Sharp's labs were images and are entered.
- **MRNs:** Brody, Livingston, and Watkins had no MRN, so placeholders were assigned (`ATU-L3-0628`, `ATU-L3-1008`, `ATU-L3-0409`). **Sharp's lab sheet uses Shapiro's MRN (PCS71900)**; Sharp was given `PCS71901` so wristband scanning can tell them apart.
- **Emergency contact phone 479-968-0383** appears on several charts and may be a real number, so it shows as "phone on file."
- **Prior-shift MAR entries** (initials LJ/CR) were kept as documentation by the previous nurse. Leftover student entries were left out: Brody's MAR and assessment notes, and Carter's lorazepam "JS" with no time.
- **Watkins acetaminophen:** the order says 1 g **q12h**; the MAR lists **q8h** (0000/0800/1600). It's shown as ordered with a "verify frequency" note. Watkins also received **enoxaparin 40 mg at 0900** before the heparin protocol order.
- **Livingston:** pip-tazo **450 mg** IV q8h, ketorolac **30 mg** in an 80-year-old, and oxycodone **15 mg** are shown as ordered. If these are intentional med errors for students to catch, great; if not, they need correcting.
- **Shapiro:** the cardiology note says "64-year-old" (the summary says 54). The ticagrelor 180 mg loading dose is not documented as given, so it shows as **due**. Sharp's MAR documents it as given in the ER.
- **Shapiro/Sharp times:** the lab sheet's 1250 draw time was used as the anchor, so the ER arrival (1130) and the enoxaparin first dose (1230) differ from the 0830/0900 times on the Notion MAR.
- **Brody:** the progress note HPI contained a stray sentence from Carter's chart (removed). Prednisone's first dose is set due on admission (1200), then daily at 0900.
- **Carter:** the progress note chief complaint read "Left lower leg pain and fever" (template leftover) and was changed to the violent outburst/hallucinations. Code status is **not documented** in Notion and shows that way. The Hgb reference range listed (12.1–15.1) is a female range, so his 15.5 flags high.
- **Unknown times** (admission times, scenario start clocks) were chosen to fit each story and are easy to change (`scenarioStart`, `admitted`).

## Files

```
index.html              the EHR
labels.html             printable wristbands + medication barcode labels
css/styles.css          look and feel
js/config.js            settings
js/data/patients.js     simulation patients (Level 3 from Notion)
js/data/assessment-forms.js
js/*.js, js/views/*.js  application code
docs/                   authoring guide + patient template
```
