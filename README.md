# ATU Simulation Hospital — SimEHR

A simulation electronic health record for nursing students to document in during simulation. It's laid out like MEDITECH Expanse: a dark icon toolbar (Return To, Home, Workload, Chart, Document, Orders, Suspend), Expanse's 3 × 4 folder tabs (Diagnostics · Provider Notes · Nurse/Allied Health · Medications / History & Problems · Administrative (demographics, next of kin, insurance) · Other Clinical (Chart Report) / Summary · Activity · Flowsheets · Health Mgmt, with the active row in tan), a right-hand patient panel (Special Indicators, Allergies, Problems), and yellow-highlighted abnormal values, plus an eMAR with barcode scanning, flowsheets, and notes. It's an independent teaching tool, not affiliated with MEDITECH, and never holds real patient data.

It's a static website with no server, database, or build step. Host it free on GitHub Pages and open it in any browser on the sim lab workstations.

## What students can do

| Chart section | What it does |
|---|---|
| **Sign-in** | Students enter their name and role and **choose their sim experience**: Medical-Surgical, Advanced Medical-Surgical, ICU / Critical Care, Psychiatric / Mental Health, OB / Maternal-Newborn, or Pediatrics. Students see and can open **only that experience's patients**; to change experience they sign out and back in. Ruth Livingston starts on the ortho unit and shows ICU once the "Transfer to ICU" event is released. Instructors (after the PIN) can view any or all experiences from the census; click **Lock** in Instructor Tools before handing the computer back to a student. |
| **Chart modes** | Chosen at sign-in and switched from the mode button in the toolbar (top right). **Student** documents as usual. **Observer (view only)** is for students watching the simulation: they can open and read the whole chart for their experience, but every charting, medication, worklist, TAR, order-entry, acknowledge, and mark-reviewed action is blocked, and nothing is saved. A purple banner shows the mode. **Faculty** (PIN) sees every experience, instructor tools, and event release. Switching to Faculty, or from Observer to Student, requires the instructor PIN; Faculty → Student/Observer and Student → Observer do not. |
| **PCS Status Board** (census) | Modeled on the Expanse PCS Status Board: Rm/Bed, photo, Name/Diagnosis/Reg Status, alerts (allergy, DNR, isolation), Home Meds, next **Interventions** and **Next Meds** (overdue in red), **Orders** (**New (n)** in yellow or red **Stat (n)** when orders need acknowledging; blank when there is nothing to acknowledge), and yellow **New Results**. Click a row to select, double-click or **Open Chart** to open. Level 1/2/3 lists on the right. |
| **Worklist** (Document button) | Its **own full-screen view**, like Expanse: no folder tabs. Click the **Chart** folder button to return to the tab screens (it reopens the last tab you were on). Everything documented from the worklist shows up in the tabs (Vital Signs, Assessments, Nursing Notes, I&O, Summary, Chart Report). Layout: green patient band, button bar (Refresh, Change View, Detail, **Document**, Close; students review what they charted in the chart folders, so there is no View/Edit), "Include: Interventions; Look Ahead: 8 Hours", care items with frequency, Last Done, Status/Due (red when overdue), and **clocks in the time columns when each item is due**. Click a clock (it turns into a ✔) or any box for a task and time to put a ✔ in that box; click it again to uncheck. Clicking the task name checks its next due box. **Document** then opens a form for each checked box in time order (vitals, WDL assessment, pain, Braden, Morse, GCS, MSE, education, handoff). The **Document ▾** menu links to Worklist, Mar, Transfusion Administration Record (TAR), Plan Of Care, Specialty Care, and Write Note. |
| **TAR** (Document ▾ → Transfusion Administration Record) | Its own screen. Lists blood product orders (provider orders, or a verbal/telephone order entered under **Blood Products**). **Start Transfusion** requires the product, unit number, unit and patient ABO/Rh, expiration, volume, rate, every bedside verification item (consent, order, two identifiers, unit tag match, not expired, bag inspection, IV and filtered tubing), a **second RN verifier**, and pre-transfusion vitals. It **blocks ABO/Rh-incompatible red cells or plasma** and expired units. Then chart **15-minute vitals** and hourly vitals (added to the Worklist as *Transfusion Monitoring*), **Complete Transfusion** (post-vitals; volume goes to I&O), or **Stop — Suspected Reaction** (symptoms, nursing actions, provider/blood bank notification). Warns after 4 hours. All transfusion vitals also appear on the Vital Signs flowsheet. |
| **Summary** | Alerts, patient info, latest vitals with abnormal flags, meds due now, abnormal results, HPI, and recent documentation. |
| **Orders** (Orders button at the top) | Its own screen, laid out like Expanse: teal **Orders** header with **ACKNOWLEDGE (n)**, CURRENT / ENTER / RECONCILE / TRANSFER-ADMIT tabs (ENTER = verbal/telephone order with required read-back, flagged for co-signature), and one table with category bands (Medications, IV Fluids, Laboratory, Imaging, Nursing Care, …) and the same columns throughout: order, Provider, Date (start/stop), Status. Medication orders show the sig in green. **i** at the end of each order opens its full detail. Orders with a protocol (Watkins' heparin order set, Ruth's norepinephrine) show a purple **P** that opens the signed protocol; these appear only once the event releases the order. |
| **Medications tab** (chart folder) | Like Expanse's Medications tab: a **Current Visit by Category** list (Generic Name, Provider, Start/Stop, Status, **i**) grouped into Medications, PRN Medications, IV/Continuous, and Discontinued. The **Current Visit ▾** menu switches to Current Inf/Titr, Home Medications, **Mar**, and Medication History. |
| **MAR** (Document ▾ → Mar, or Medications tab → Mar) | Its own Expanse-style grid screen with only Return To (top left) and **Close** (bottom right). Include filters: Active, STAT/ONE, IVs, PRNs, Discontinued. Columns: Start/Stop/Status; Medication (Route) with frequency, **Current Dose** for infusions, Give line, Rx#, and Label Comments; Time; then yesterday / **TODAY** / tomorrow. Small boxed icons under the drug: **P** opens the protocol, **⇅** titrates, **HA** marks high-alert. Cells are red when overdue (showing how late), yellow when due, and green with time and initials when given. Click a cell to administer. PRNs: **PRN ⊕** in the Time column (Last Admin row below; **Reassess** appears for PRN effectiveness). Infusions: click today's cell to document. Click a medication for **Medication Detail** with Detail / History / Prot/Taper / Order tabs; History is where an entry is marked in error. All scanning and safety checks still apply. Blood products are on the TAR. |
| **MAR scanning** | On the MAR, **scan the wristband first**; "✔ Patient verified — wristband scanned HH:MM" appears under the patient's name. Then **scan a medication**: the MAR finds its active order and opens the administration with the dose filled in. If the next dose isn't due, it asks "Are you charting this for the HH:MM scheduled dose?" (Yes charts it, No cancels). **Unit-dose labels add up**: for acetaminophen 650 mg, scanning one 325 mg shows "LESS than ordered — scan the remaining 325 mg", and a second 325 mg brings it to the correct total. Scanning more than ordered (for example 2 × 300 mg for a 300 mg order) fills in the total, flags it red (**EXCEEDS**), and blocks charting until the dose is edited. Charting less than ordered requires a comment. A wrong wristband, a drug with no active order (or a discontinued one), or the wrong drug inside the dialog stops with an alert. Print the unit-dose labels (`NDC-DRUG-STRENGTH`, including other strengths for practice) from **Print Wristbands & Med Labels**. Each med label's barcode is a short **8-digit code** (printed under the barcode with its text code, e.g. `25668974 · RX-LIV-LR`), which tablet cameras and scanners read far more reliably than the long text codes; the number never changes for a given med, and typing either form also works. **Reprint labels printed before this change** — the old long barcodes were too dense for the iPad camera. |
| **Weight-based protocol doses** | Protocol doses are always entered on the MAR. **Heparin bolus:** the student enters the units they calculated. The MAR shows units/kg (80 kg) and the mL to draw from the 10,000 units/10 mL vial, and blocks more than the 10,000-unit maximum. **Heparin drip:** the student enters units/kg/hr; the MAR calculates units/hr and mL/hr from the 80 kg weight and the 25,000 units/500 mL bag (e.g., 18 → 1,440 units/hr = 28.8 mL/hr) and blocks a start above 2,250 units/hr. Titrations work the same way; mL/hr is calculated, not typed. Norepinephrine doses (mcg/min) are also entered on each titration. |
| **Vital Signs** | **Charted only from the Worklist.** The Flowsheets tab shows a time-column flowsheet with H/L flags. Patients can have their own ranges (e.g., SpO₂ 88–92% for COPD). |
| **Assessments** | **Charted only from the Worklist**; the Nurse/Allied Health tab shows the history. ATU's **WDL / WDL-Except** physical assessment (definitions from the Notion charts), Mental Status Exam, pain, Braden, Morse, and GCS, with automatic scoring. |
| **Intake & Output** | Entries with current-shift, previous-shift, and 24-hour balance. |
| **Notes** | Nursing narrative, **SBAR provider notification**, DAR focus note, patient education, and I-PASS handoff. Notes are electronically signed and support addenda. |
| **Diagnostics** | Laid out like Expanse: subtabs **Laboratory**, Imaging, Microbiology, Pathology, Blood Bank Tests, Cardiovascular, Other Specialty (tabs with no results are grayed). Laboratory is one cumulative table with collapsible sections (Hematology, Coagulation, Chemistry, Blood Gases, Cardiac), a side list to show All or one section, the **reference range under each test name**, and one column per collection time, **oldest to newest left to right** (a dark line marks the latest). A released result becomes a new column flagged NEW on the same rows. Abnormal values are yellow with H/L; critical values are pink. Blood cultures are under Microbiology, blood type under Blood Bank Tests, ECGs under Cardiovascular. **Mark Reviewed** clears new results. |
| **Care Plan** | Nursing diagnoses (with suggestions), goals, interventions, and evaluations. |
| **History** | HPI, PMH/PSH, family and social history, and home meds. |
| **Administrative** | Registration: demographics, encounter (admit date, unit, attending, code status), next of kin / emergency contact, and insurance. |
| **Protocol titration** | **Heparin (Watkins):** Titrate (aPTT) on the MAR or from the Worklist (*Heparin Protocol / aPTT Titration*). The dialog shows the protocol and nomogram; students enter aPTT, bolus, hold, rate change, new rate (units/kg/hr and mL/hr), and next aPTT, with a required second-RN double check. Flowsheets → Heparin Flowsheet is the read-only history. **Norepinephrine (Ruth, after ICU transfer):** Titrate on the MAR records MAP/SBP/HR, action, previous and new dose (mcg/min), and mL/hr, with no second-RN check required (heparin requires one). It blocks doses above the 30 mcg/min maximum, and the BP/HR also go on the vital signs flowsheet. |
| **Chart Report** | A printable record of everything the student documented, including errors and late entries. Students can **Print / Save as PDF** or download JSON to submit. |

**Older iPads (iOS 12.5.8):** the EHR runs on iOS 12. Camera scanning works only in **Safari** (on iOS 12–14.2 Chrome and other browsers cannot use the camera). Open the site in a Safari tab; a Home Screen shortcut is fine as long as it opens in Safari. A Bluetooth barcode scanner also works: tap the MAR scan box, then scan.

Documentation follows legal-record rules. Entries are never deleted; they are **marked "entered in error"** with a reason and stay visible struck through. Entries charted more than 30 minutes after the event time are labeled **late entry**.

## Level 3 patients (from Notion)

| Patient | Sim experience | Scenario | Scenario written for | Instructor events |
|---|---|---|---|---|
| Vincent Brody, 67 M | Adv. Med-Surg | COPD exacerbation | 1200 | — |
| Ruth Livingston, 80 F | ICU | POD 5 ORIF R hip → deterioration | 0930 | **Transfer to ICU** (NS bolus, norepinephrine, Foley, vancomycin, DC pip-tazo/LR) |
| Carl Shapiro, 54 M | ICU | NSTEMI | 1400 | **Repeat troponin resulted** (0.06 → 0.1) |
| Karl Sharp, 64 M | Adv. Med-Surg | NSTEMI, **DNR** (look-alike of Shapiro — kept in a different experience so students never see both) | 1400 | — |
| Vernon Watkins, 69 M | Adv. Med-Surg | POD 4 hemicolectomy → STAT orders | 1000 | **STAT orders — nurse-driven heparin protocol** |
| David Carter, 28 M | Psych | Schizophrenia, involuntary hold | 1000 | — |

## Level 1 and Level 2 patients (imported)

Imported from [laurablasdel/ATU-Simulation-Hospital](https://laurablasdel.github.io/ATU-Simulation-Hospital/), which was built from the Notion Level 1 and Level 2 charts, using `tools/import-atu-sim-hospital.cjs`. Images (echo, ECG, CT, consents) are copied into `assets/imported/`. Faculty guides from that repo appear only in **Instructor Tools**. Consents, prenatal records, APGAR, the newborn glucose policy, PEWS and head-to-toe forms, and I&O records are on **Other Clinical → Documents**.

| Patient | Level / experience | Scenario | Instructor events |
|---|---|---|---|
| Charles Jones, 68 M | 1 · Med-Surg | CHF exacerbation (EF 35%), 4-shift unfolding case | **Shift 2** (BMP, chest X-ray: R pleural effusion), **Shift 3** (A1c 9.5, remove Foley, AC/HS glucose), **Shift 4** (UA positive nitrites/WBC, WBC 18,000, lactate ≥ 2: sepsis workup) |
| Jane Fowler, 79 F | 1 · Med-Surg | Pre-op TAH-BSO for ovarian cancer → post-op opioid respiratory depression | **Post-op orders** (morphine, ondansetron), **Postoperative MAR**, **Naloxone**, **Ketorolac**, **Shift 2** (post-op vitals: RR 0, SpO₂ 70%) |
| Amelia Sung, 36 F | 2 · OB | G2P1 39 wk, active labor, GDM (diet), GBS+, PCN/shellfish allergy; oxytocin, clindamycin | **Shift 2** (shoulder dystocia / newborn resuscitation document) |
| Baby Boy Sung | 2 · OB | Newborn after shoulder dystocia; vitamin K, erythromycin, glucose protocol | **Newborn labs**, **Chest X-ray order**, **Chest X-ray result** (left clavicle fracture), **New results** |
| Fatima Sanogo, 23 F | 2 · OB | Postpartum hemorrhage after vaginal delivery | **Blood bank forms**, **Critical CBC** (Hgb 6), **PPH medication orders**, **Follow-up orders**, each uterotonic (**methylergonovine, carboprost, misoprostol, TXA**), **Shift 2** |
| Molly Thomas, 7 mo F | 2 · Peds | Croup / upper airway obstruction (SpO₂ 87%) | **Radiology** (aspiration pneumonia), **MD orders**, **Shift 2 respiratory orders**, **racepinephrine**, **dexamethasone 0.6 mg/kg**, **ampicillin 50 mg/kg**, **D5 ½NS** |
| Stephanie Smith, 16 F | 2 · Peds | Sickle cell crisis (Hgb 5, A−) | **Chest X-ray** order and result (LLL pneumonia), **Infuse 2 units PRBC** (TAR), **ceftriaxone**, **acetaminophen**, **CBC in AM** |

To refresh after that repository changes: `node tools/import-atu-sim-hospital.cjs <path-to-ATU-Simulation-Hospital>` (then review `js/data/patients-imported.js`).

## Running a simulation

1. **Before the sim:** open **Instructor** (PIN in `js/config.js`, default `2468`). Click **Reset Patient** for the patients you're using, then **Print Wristbands & Med Labels** and put the labels on the manikin and meds.
2. **Students sign in** with their name, role, and sim experience, as a **documenting nurse** or an **observer (view only)**. The documenting student's name becomes the signature on every entry.
3. The chart clock shows the **actual current time**. The first time a chart is opened, the scenario (written for its start time, e.g. 1400) is moved to begin at the current hour, rounded to the nearest hour. Scheduled doses, prior vitals, and results keep the same spacing as the scenario, so a dose written for 1 hour after start is still due 1 hour after the sim begins. Clock times in the chart may therefore differ from the Notion times; for example, a 0900 dose in a scenario written for 1000 but run at 1300 shows at 1200. Instructor Tools shows the shift. **Restart Clock** re-anchors the scenario to now.
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

- **Lab results stored as PDFs** in Notion couldn't be imported for Brody (`Brody_Labs.pdf`); his chart shows a notice until the values are added. Ruth Livingston's labs were entered from `Ruth_Livingston_lab2.pdf`. If `Ruth_Livingston_lab_1.pdf` has different results, send it too. Watkins' labs (pre-op, POD 3, POD 4), STAT labs, and heparin protocol order were entered from the PDFs you uploaded. Shapiro's and Sharp's labs were images and are entered.
- **Livingston (lab2 PDF):** MRN **PCS10800**, 160 cm, 54 kg, blood type **A+** (the TAR checks it), yesterday's and today's CBC, today's BMP, lactate 5.0, and blood culture positive for *Enterobacter cloacae*, all in the chart at the start. The sheet lists the admitting provider as **Hans Olsson, MD**, but the Notion orders say Dr. Marcus, so the chart still shows Dr. Marcus. The Hb and HCT ranges printed (14–18, 42–50) are male ranges; they're used as printed. Repeat urinalysis still shows as pending.
- **Norepinephrine protocol (Ruth):** built from her ICU order (start after bolus if MAP < 65 or SBP < 100, 2 mcg/min, titrate 2 mcg/min every 5 minutes, maximum 30). The "notify provider" line combines her existing notify order with "goal not met at maximum dose." The bag concentration isn't in Notion, so students calculate mL/hr from the pharmacy label; send the concentration if you want it on the order.
- **Imported Level 1/2 patients:** the source is converted Notion text, so check each chart once. Things I noticed:
  - Pediatric and newborn vital-sign flag ranges were added (infant HR 100–160, RR 30–53; newborn HR 110–160, RR 30–60, temp 97.7–99.5 °F); adjust in `tools/import-atu-sim-hospital.cjs`.
  - Baby Boy Sung's weight is 4.37 kg on the patient record but 4.08 kg in the overview; the chest X-ray image is missing from the source (the text report is included).
  - Charles Jones' source "Progress Notes" record contains Stephanie Smith's note and was left out.
  - A phone number in Stephanie Smith's overview is shown as "phone on file".
  - Amelia Sung's vital-sign table is blank in the source (for students to fill in).
  - Times are placed before the chart clock start (0800) when the source gives none.
- **Livingston:** only the last vital-sign set is charted (T 100.9, HR 110, RR 20, BP 110/60, SpO₂ 94% on 2 L). The blood culture starts as **Pending**, with events for the positive culture, the ICU repeat labs (source chloride printed as 1.5, left out), and transfusion orders (type and cross, transfuse 2 units PRBC).
- **Livingston provider notes were written for the simulation** from her chart (they were not in Notion): an orthopedic admission H&P (Hans Olsson, MD, the admitting provider on her lab sheet), a brief operative note, POD 4 and POD 5 progress notes (Dr. Marcus), and a transfer note released with the ICU event. The POD 5 note is timed 0645, before the 0600 labs result, so students still have to recognize the deterioration. Please review the details (for example EBL 300 mL and general anesthesia) and edit them in `js/data/patients.js`.
- **MAR schedule:** scheduled medications use standard times from their frequency: daily 0900; BID and every 12 hours 0900/2100; TID 0900/1300/1700; QID 0900/1300/1700/2100; every 4 hours 0000/0400/…/2000; every 6 hours 0000/0600/1200/1800; every 8 hours 0600/1400/2200; AC & HS 0730/1130/1630/2100; weekly 0900 on its day. One-time/STAT doses, "start tomorrow" orders, and documented off-schedule doses (for example, ER doses) are kept as written. This changes a few Notion MAR times (for example, Ruth's enoxaparin 1700 → 0900, Watkins' gabapentin 0000/0800/1600 → 0600/1400/2200). Add `fixedTimes: true` to a medication to keep its listed times.
- **Doses before the scenario start:** for Advanced Med-Surg and ICU patients, scheduled doses due before the chart clock starts are documented as given by the prior shift (initials LJ; set `priorRN` on a patient to change it, or `priorDosesGiven: false` to turn it off). One-time doses, such as Shapiro's ticagrelor loading dose, are not auto-charted.
- **Watkins:** the PDFs give MRN **PCS40900**, height 182 cm, and Standard precautions; the chart now uses those. The STAT event releases the ABG (pH 7.49, PaCO₂ 31, PaO₂ 58), D-dimer 0.9, CK-MB, and troponin T, adds the signed protocol (box **B. DVT/PE/AFib** checked: 80 units/kg bolus, 18 units/kg/hr), shows the nomogram on the Heparin Flowsheet, and discontinues enoxaparin. The answer key (6,500-unit bolus = 6.5 mL; 1,440 units/hr = 28.8 mL/hr) is only in the instructor event notes. The pre-op Cl 95 and HCO₃ 30 weren't starred on the PDF but flag by the listed ranges.
- **MRNs:** Brody had no MRN, so placeholders were assigned (`ATU-L3-0628`; Livingston now uses `PCS10800` and Watkins `PCS40900` from their PDFs). **Sharp's lab sheet uses Shapiro's MRN (PCS71900)**; Sharp was given `PCS71901` so wristband scanning can tell them apart.
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
