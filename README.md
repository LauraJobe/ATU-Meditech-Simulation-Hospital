# ATU Simulation Hospital — SimEHR

A simulation electronic health record for nursing students to document in during simulation. It's laid out like MEDITECH Expanse: a dark icon toolbar (Return To, Home, Workload, Chart, Document, Orders, Suspend), Expanse's 3 × 4 folder tabs (Diagnostics · Provider Notes · Nurse/Allied Health · Medications / History & Problems · Administrative (demographics, next of kin, insurance) · Other Clinical (Chart Report) / Summary · Activity · Flowsheets · Health Mgmt, with the active row in tan), a right-hand patient panel (Special Indicators, Allergies, Problems), and yellow-highlighted abnormal values, plus an eMAR with barcode scanning, flowsheets, and notes. It's an independent teaching tool, not affiliated with MEDITECH, and never holds real patient data.

It's a static website with no server, database, or build step. Host it free on GitHub Pages and open it in any browser on the sim lab workstations.

## EMR Orientation (before simulation)

**orientation.html** — `https://laurajobe.github.io/ATU-Meditech-Simulation-Hospital/orientation.html` — is a practice version of this same EHR for students to use before sim day. It looks and works exactly like the simulation site, but:

- Sign-in is simplified: the role is always **Student Nurse (SN)** and there is no Documenting / Observer choice.
- It has one **practice patient, Morgan, Taylor** (community-acquired pneumonia, sulfa allergy), not the simulation patients, so orientation never previews a scenario.
- Practice charting is saved separately (`storagePrefix` `atuSimEHR.orient`) and never mixes with simulation documentation.
- A **guided task panel** (right side; along the bottom on tablets) lists nine tasks that check themselves off from what the student does:
  1. Open your patient from the PCS Status Board
  2. Check allergies and code status (short question)
  3. Find the latest hemoglobin in Diagnostics (short question)
  4. Acknowledge the new order
  5. Chart a set of vital signs from the Worklist
  6. Complete a focused assessment (e.g., Pain Assessment)
  7. Give a scheduled medication on the MAR (scan the wristband and the medication, Save, Document)
  8. Give a PRN (two 325 mg acetaminophen labels add up to 650 mg) and document its effectiveness
  9. Write a nursing note
- **Show me** highlights the next thing to tap on the screen the student is on (for example the Diagnostics tab, then the Hgb row; the Orders button, then Acknowledge). It never opens a screen for them. **Practice labels** on the MAR stand in for a scanner: tap the wristband, then the medication labels — the MAR treats each tap as a scan.
- The scheduled meds are due whenever the student opens the chart (`fixedTimes` in `js/data/orientation-patients.js`), so the MAR works the same in a morning or afternoon session.
- When all nine tasks are done, **Print completion summary** prints the student's name, group, and the time each task was completed, with a line for faculty initials. **Start over** erases that student's practice charting.

Files: `orientation.html`, `js/orientation-config.js`, `js/data/orientation-patients.js`, `js/views/tutorial.js` (tasks are defined at the top — add, remove, or reword them there).

### EMR Orientation as a SCORM package (Blackboard, graded for completion)

`scorm/EMR-Orientation-SCORM12.zip` is the orientation packaged as **SCORM 1.2** (only the orientation and its practice patient — none of the simulation patients). In Blackboard, add it as a SCORM package (Ultra: **+ → Create → SCORM package**; Original: **Build Content → Content Package (SCORM)**), then turn grading on.

- **Grade:** *Incomplete* until all nine tasks are done, then *Completed* with a score of **100**. While in progress the score is the percent of tasks done (e.g., 3 of 9 = 33). An earned score is never lowered — **Start over** keeps the recorded completion. Grade by completion or by score (100 = complete).
- **Resume:** progress is saved in Blackboard (`cmi.suspend_data`), so students can leave and come back, even on another device. Their practice charting itself stays on the device they used; finished tasks stay checked off.
- **Name:** the sign-in name is filled in from Blackboard.
- **No printing in Blackboard:** the *Print completion summary* button is hidden in the SCORM package (Blackboard records the completion); students can still view their progress. The regular orientation link keeps the print button.
- Outside an LMS (the GitHub Pages link) the same page works as before and reports nothing (`js/scorm.js`).
- **Rebuild after changing the orientation:** `node tools/build-scorm.cjs`, then upload the new zip to Blackboard (replace the package).

## What students can do

| Chart section | What it does |
|---|---|
| **Sign-in** | Students enter their name and role and **choose their sim experience**: Medical-Surgical, Advanced Medical-Surgical, ICU / Critical Care, Psychiatric / Mental Health, OB / Maternal-Newborn, or Pediatrics. Students see and can open **only that experience's patients**; to change experience they sign out and back in. Ruth Livingston starts on the ortho unit and shows ICU once the "Transfer to ICU" event is released. Instructors (after the PIN) can view any or all experiences from the census; click **Lock** in Instructor Tools before handing the computer back to a student. |
| **Chart modes** | Chosen at sign-in and switched from the mode button in the toolbar (top right). **Student** documents as usual. **Observer (view only)** is for students watching the simulation: they can open and read the whole chart for their experience, but every charting, medication, worklist, TAR, order-entry, acknowledge, and mark-reviewed action is blocked, and nothing is saved. A purple banner shows the mode. **Faculty** (PIN) sees every experience, instructor tools, and event release. Switching to Faculty, or from Observer to Student, requires the instructor PIN; Faculty → Student/Observer and Student → Observer do not. |
| **Sign-in roles** | The role is **Student Nurse (SN)** or **Faculty**. Faculty enter the instructor PIN at sign-in, go straight to Faculty mode (all experiences), and choosing a sim experience is optional. Switching from Student to Faculty asks for the PIN **every time**; switching back to Student never does (from Instructor Tools it returns to the status board). A faculty member who signed in without an experience picks one when switching to Student. |
| **PCS Status Board** (census) | Modeled on the Expanse PCS Status Board: Rm/Bed, photo, Name/Diagnosis/Reg Status, alerts (allergy, DNR, isolation), Home Meds, next **Interventions** and **Next Meds** (overdue in red), **Orders** (**New (n)** in yellow or red **Stat (n)** when orders need acknowledging; blank when there is nothing to acknowledge), and yellow **New Results**. Click a row to select, double-click or **Open Chart** to open. Level 1/2/3 lists on the right. |
| **Worklist** (Document button) | Its **own full-screen view**, like Expanse: no folder tabs. Click the **Chart** folder button to return to the tab screens (it reopens the last tab you were on). Everything documented from the worklist shows up in the tabs (Vital Signs, Assessments, Nursing Notes, I&O, Summary, Chart Report). Layout: green patient band, button bar (Refresh, Change View, Detail, **Document**, Close; students review what they charted in the chart folders, so there is no View/Edit), "Include: Interventions; Look Ahead: 8 Hours", care items with frequency, Last Done, Status/Due (red when overdue), and **clocks in the time columns when each item is due**. Click a clock (it turns into a ✔) or any box for a task and time to put a ✔ in that box; click it again to uncheck. Clicking the task name checks its next due box. **Document** then opens a form for each checked box in time order (vitals, WDL assessment, pain, Braden, Morse, GCS, MSE, education, handoff). The **Document ▾** menu links to Worklist, Mar, Transfusion Administration Record (TAR), Plan Of Care, Specialty Care, and Write Note. |
| **TAR** (Document ▾ → Transfusion Administration Record) | Its own screen. Lists blood product orders (provider orders, or a verbal/telephone order entered under **Blood Products**). **Start Transfusion** requires the product, unit number, unit and patient ABO/Rh, expiration, volume, rate, every bedside verification item (consent, order, two identifiers, unit tag match, not expired, bag inspection, IV and filtered tubing), a **second RN verifier**, and pre-transfusion vitals. It **blocks ABO/Rh-incompatible red cells or plasma** and expired units. Then chart **15-minute vitals** and hourly vitals (added to the Worklist as *Transfusion Monitoring*), **Complete Transfusion** (post-vitals; volume goes to I&O), or **Stop — Suspected Reaction** (symptoms, nursing actions, provider/blood bank notification). Warns after 4 hours. All transfusion vitals also appear on the Vital Signs flowsheet. |
| **Summary** | Alerts, patient info, latest vitals with abnormal flags, meds due now, abnormal results, HPI, and recent documentation. |
| **Orders** (Orders button at the top) | Its own screen, laid out like Expanse: teal **Orders** header with **ACKNOWLEDGE (n)**, CURRENT / ENTER / RECONCILE / TRANSFER-ADMIT tabs (ENTER = verbal/telephone order with required read-back, flagged for co-signature), and one table with category bands (Medications, IV Fluids, Laboratory, Imaging, Nursing Care, …) and the same columns throughout: order, Provider, Date (start/stop), Status. Medication orders show the sig in green. **i** at the end of each order opens its full detail. Orders with a protocol (Watkins' heparin order set, Ruth's norepinephrine) show a purple **P** that opens the signed protocol; these appear only once the event releases the order. |
| **Medications tab** (chart folder) | Like Expanse's Medications tab: a **Current Visit by Category** list (Generic Name, Provider, Start/Stop, Status, **i**) grouped into Medications, PRN Medications, IV/Continuous, and Discontinued. The **Current Visit ▾** menu switches to Current Inf/Titr, Home Medications, **Mar**, and Medication History. |
| **MAR** (Document ▾ → Mar, or Medications tab → Mar) | Its own Expanse-style grid screen with only Return To (top left) and **Close** (bottom right). Include filters: Active, STAT/ONE, IVs, PRNs, Discontinued. Columns: Start/Stop/Status; Medication (Route) with frequency, **Current Dose** for infusions, Give line, Rx#, and Label Comments; Time; then yesterday / **TODAY** / tomorrow. Small boxed icons under the drug: **P** opens the protocol, **⇅** titrates, **HA** marks high-alert. Cells are red when overdue (showing how late), yellow when due, and green with time and initials when given. Click a cell to administer. PRNs: **PRN ⊕** in the Time column (Last Admin row below; **Reassess** appears for PRN effectiveness). Infusions: click today's cell to document. Click a medication for **Medication Detail** with Detail / History / Prot/Taper / Order tabs; History is where an entry is marked in error. All scanning and safety checks still apply. Blood products are on the TAR. |
| **MAR scanning** | On the MAR, **scan the wristband first** (leaving the MAR ends the verification, so returning means scanning it again); "✔ Patient verified — wristband scanned HH:MM" appears under the patient's name. Then **scan every medication** being given: each scan finds its active order and adds it to the green **Scanned — ready to document** list on the MAR (✕ Remove takes one off). When all are scanned, **Save** opens the **Document Administration** review screen with every medication — dose (filled in from what was scanned), route, site, time, pre-administration assessment, double check — and **Document** charts them all at once. If any medication is missing something, nothing is charted and that medication is flagged. Leaving the MAR clears the list. If the next dose isn't due, a scan asks "Are you charting this for the HH:MM scheduled dose?" (Yes adds it, No cancels). Clicking a time cell or PRN ⊕ still opens the single-medication window. **Unit-dose labels add up**: for acetaminophen 650 mg, scanning one 325 mg shows "LESS than ordered — scan the remaining 325 mg", and a second 325 mg brings it to the correct total. Scanning more than ordered (for example 2 × 300 mg for a 300 mg order) fills in the total, flags it red (**EXCEEDS**), and blocks charting until the dose is edited. Charting less than ordered requires a comment. A wrong wristband, a drug with no active order (or a discontinued one), or the wrong drug inside the dialog stops with an alert. Print the unit-dose labels (`NDC-DRUG-STRENGTH`, including other strengths for practice) from **Print Wristbands & Med Labels**. Each label carries a short **8-digit code** (printed on the label); the number never changes for a given med, and typing it (or the text code) also works. See **Labels and barcodes** below. |
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

**Accepted barcodes (ATU set).** The wristband and medication barcodes ATU printed and installed for the 13 patients are the final, accepted codes. They are listed in `js/data/atu-barcodes.js`, from the ATU faculty handoff of October 21, 2026.
- **Wristbands:** Code 39 with a 4-digit code (1000 Amelia Sung, 1001 Jane Fowler, 1002 Fatima Sanogo, 1003 Molly Thomas, 1004 Stephanie Smith, 1005 Charles Jones, 1006 Baby Boy Sung, 1007 Vincent Brody, 1008 Ruth Livingston, 1009 Carl Shapiro, 1010 Karl Sharp, 1011 Vernon Watkins, 1012 David Carter). The MAR, the administration window, Barcode Check, and wrong-patient checks accept the 4-digit code or the MRN.
- **Medication packages:** Code 128, 68 package codes: `MED-0001`–`MED-0065` plus `MED-ACET325` (acetaminophen 325 mg tablet), `MED-HEP10K` (heparin 10,000 units/10 mL vial), `MED-HEPINF` (heparin 25,000 units/500 mL bag), and `MED-PRBC` (PRBC blood bag).
- **One code per product:** each code identifies the **medication product** and is the same for every patient, as in a hospital pharmacy. For example, sodium chloride 0.9% is `MED-0020` on all six patients with NS, D5 ½ NS is `MED-0024`, D5 ½ NS with KCl is `MED-0036`, and LR is `MED-0002`. Scanning a package finds the matching order(s) on the patient whose wristband was scanned. When two orders match (for example aspirin 81 mg and 325 mg), the student picks the order. The package carries no strength, so the dose given is confirmed on the review screen. Held, discontinued, and unreleased orders stop as usual. `MED-PRBC` tells the nurse to document on the TAR.
- **Orders added to match the packet** (`js/data/atu-order-updates.js`, with source pages):
  - Amelia Sung: bupivacaine/fentanyl epidural at 10 mL/hr (active); release events "Maternal Hypotension / Category II Tracing" (discontinues oxytocin; LR 500 mL bolus once; left lateral; O2 10 L/min NRB; notify provider and anesthesia) and "Ephedrine" (5 mg IV PRN, high-alert).
  - Baby Boy Sung: hepatitis B vaccine 0.5 mL IM once.
  - Fatima Sanogo: fentanyl 50 mcg IV push every 1 hour PRN pain.
  - Stephanie Smith: D5 ½ NS at 150 mL/hr on the MAR; the PRBC release event is now 1 unit, as in the packet.
  - Carl Shapiro: ED orders aspirin 325 mg chewed and NS 500 mL bolus, once, due.
  - Vernon Watkins: NS 1,000 mL at 100 mL/hr, infusing at report (LB).
- **Scanning distance:** hand scanners read these line barcodes from normal distance. With the iPad camera, hold wristbands about 4 inches away and medication packages about 3 inches away (simulated-camera test of the installed labels).
- **Do not renumber.** A new medication needs a new, unused number (next: `MED-0066`) added to `js/data/atu-barcodes.js`.
- **Reprints:** **Print Wristbands & Med Labels** defaults to the ATU style, which reprints these codes. Orders with no ATU package (the heparin bolus and infusion) print a hospital label.

**Labels and barcodes.** **Print Wristbands & Med Labels** prints small labels sized like unit-dose blister and vial labels: medication labels 40 × 19 mm (about 1.6 × 0.75 in), unit-dose labels 35 × 16 mm, and wristbands 25 mm tall. **Print at 100% / "Actual size"**, not "Fit to page". Choose the barcode style at the top of the page:
- **Small squares (QR), recommended:** 13 mm square codes. They scan with the iPad/tablet camera (hold the label 3–6 inches away) and with any 2D hand scanner.
- **Data Matrix:** the square code on real blister packs and vials. It scans with 2D hand scanners, but the iPad camera's scanning library often cannot find it next to label text, so use it only with hand scanners.
- **Linear (1D):** only for hand scanners that read lines but not squares.

Wristbands always carry a linear code and a square code for the MRN. A USB or Bluetooth hand scanner types into the MAR scan box like a keyboard. Prefixes some scanners add (`]C0`, `]d1`, `]Q1`) and a trailing Enter or Tab are ignored. Tested: every label for every patient decodes, and no two medications share a code. **Reprint labels printed before October 2026.**

**Barcode Check (faculty).** **Instructor Tools → Barcode Check** checks printed labels without opening a chart or charting anything. Click in the scan box and scan with a hand scanner, or use **📷 Camera** (check **Keep the camera open** to scan label after label). Each scan shows:
- **Wristband:** the patient, MRN, DOB, and allergies.
- **Medication label:** the drug, dose, and patient, and whether the order is active on the MAR, waiting in a scenario event, or held or discontinued (students are stopped if they scan those).
- **Unit-dose label:** the drug and strength, and which patients have orders for it.
- **Not recognized:** for example an old label that needs reprinting. The raw text the scanner sent is shown, which helps troubleshoot scanner settings.

Choose a patient (or scan their wristband) for a checklist of every label to print for them. Each label is ticked as it is scanned ("12 of 29 labels scanned"). **Clear checkmarks** starts over.

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

Imported from [laurablasdel/ATU-Simulation-Hospital](https://laurablasdel.github.io/ATU-Simulation-Hospital/), which was built from the Notion Level 1 and Level 2 charts, using `tools/import-atu-sim-hospital.cjs`. Images (echo, ECG, CT, consents) are copied into `assets/imported/`. Faculty guides from that repo appear only in **Instructor Tools**. Consents, prenatal records, PEWS and head-to-toe forms, and I&O records are on **Other Clinical → Documents** (Baby Boy Sung's APGAR, delivery/Ballard form, glucose sheet, and glucose policy became Worklist assessments and an order set — see below).

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

1. **Before the sim:** open **Instructor** (PIN in `js/config.js`, default `2468`) on a device connected with the faculty login. Click **Reset Patient** for the patients you're using, then **Print Wristbands & Med Labels** and put the labels on the manikin and meds.
2. **Students sign in** with their name, role, and sim experience, as a **documenting nurse** or an **observer (view only)**. The documenting student's name becomes the signature on every entry.
3. The chart clock shows the **actual current time**. The first time a chart is opened, the scenario (written for its start time, e.g. 1400) is moved to begin at the current hour, rounded to the nearest hour. Scheduled doses, prior vitals, and results keep the same spacing as the scenario, so a dose written for 1 hour after start is still due 1 hour after the sim begins. Clock times in the chart may therefore differ from the Notion times; for example, a 0900 dose in a scenario written for 1000 but run at 1300 shows at 1200. Instructor Tools shows the shift. **Restart Clock** re-anchors the scenario to now.
4. **During the sim:** in Instructor Tools, choose the patient from the **Patient** drop-down at the top (it shows how many events are released, and remembers the choice), then click **Release Now** on an event (STAT orders, new results, transfer orders). The new orders and results show up flagged **NEW** for the student to acknowledge and act on.
5. **After the sim:** the student opens **Chart Report** and prints or saves it as a PDF, or you use **Export All Documentation** to save a JSON backup.

> **Important:** a device that is **not connected** to the shared chart saves documentation only in its own browser (localStorage). Connect every classroom device (below) so faculty, students, and observers see the same chart.

## Orders entered during the sim

**Student verbal/telephone orders need faculty approval.** A student enters the order on **Orders → ENTER (verbal / telephone)** with read-back. It shows as **Pending faculty approval**.

**Faculty review it in Faculty mode.** Faculty see **Orders waiting for approval** in the faculty banner on every screen, with a link to the patient. On the patient's Orders screen, click **Review** to check or complete the order (for medications: drug, dose, route, type, frequency, reason). Then choose:
- **Approve Order**: the order becomes active, shows as **NEW** for students to acknowledge, and medications appear on the **MAR**. For scheduled medications you can make the first dose due now.
- **Not Approved…**: the student sees the order crossed out, with your reason.

**Faculty can enter their own orders.** In Faculty mode, **Orders → ENTER (faculty order)** works the same way: the order is active right away, students see it as NEW to acknowledge, and medications go on the MAR. In an order's **i** detail, faculty can **Discontinue** an order entered this way.

**Labels and scanning.** New medications print on **Print Wristbands & Med Labels**, and their labels scan on the MAR. Common drugs also scan with the unit-dose product labels.

**Allergy check.** A new medication whose name matches a patient allergy is flagged **ALLERGY**.

On connected computers, orders, approvals, and discontinues are shared like other charting. Students get a "new order — acknowledge it in the Orders tab" notice.

## Individual faculty releases and newborn documentation (October 29, 2026)

Scenario content follows Laura Blasdel's ATU Simulation Hospital (commit `e986b04`), with Laura Jobe's confirmed decisions taking priority (`js/data/atu-scenario-updates.js`).

- **One Release button per clinical item:** each medication order, nonmedication order, result panel, and document is released on its own. A medication release shows the order **and** its MAR entry together. Instructor Tools lists exactly what each button reveals.
  - Molly Thomas: racepinephrine, dexamethasone, ampicillin-sulbactam (barcode MED-0023), and D5 ½ NS (each order + MAR); oxygen-saturation instruction; chest X-ray order; chest X-ray result with image.
  - Stephanie Smith: chest X-ray order; chest X-ray result; PRBC transfusion order (1 unit); ceftriaxone 500 mg/100 mL IV every 6 hours; acetaminophen 650 mg; CBC in AM.
  - Fatima Sanogo (Dr. Nelson): critical CBC; type and crossmatch 2 units PRBC; second IV; transfuse 1 unit O-negative crossmatched PRBCs (TAR); H&H after transfusion; Methergine, Hemabate, Cytotec, and TXA (each order + MAR, with precautions); uterine tamponade balloon; CBC in 6 hours; Foley catheter; fundus checks every 15 minutes; blood bank documentation.
- **Faculty-only:** teaching guides and expected student actions stay in the instructor-only guide (Fatima's Shift 2 guide, including surgical escalation, the fundus progression, and the A-negative wrong-blood bag; Amelia's Shift 2 delivery packet).
- **Stephanie's CBC:** one panel with RBC 4.2, and reference ranges shown beside each result.
- **Newborn documentation (Sung):** Nurse/Allied Health → **Newborn** on both Amelia Sung's and Baby Boy Sung's charts. It opens after faculty release **Delivery completed** (Instructor Tools → Amelia Sung). It holds the **Newborn Head-to-Toe Assessment** (structured after Stanford Medicine's Newborn Exam; nothing pre-marked normal) and the **Newborn Transitional Record** laid out like the hospital paper form (maternal history with circled choices, infant, measurements, MAR medication lines, abnormal findings and feeding, and the vital-signs grid with one column per entry). Everything saves to Baby Boy Sung, appears in Assessment History with author and time, and shows on both charts. Amelia's maternal assessments stay separate.

### Baby Boy Sung — newborn documentation on the Worklist

- **Worklist (Baby Boy Sung):** APGAR Score (one entry per scoring time; complete after 1 and 5 minutes, continuing every 5 minutes to 20 if the score is below 7), Newborn Delivery Assessment (ATU delivery form: delivery details, resuscitation, suction, birth injury/clavicle), New Ballard Score (total and estimated gestational age calculate automatically: weeks = (2 × total + 120) ÷ 5), Newborn Head-to-Toe Assessment, Newborn Transitional Record, Transitional Record vital signs (Q30 min × 4), and Newborn Glucose Monitoring. Before delivery the rows show **After delivery** and do not open; releasing **Delivery completed** on either Sung card opens them. Nothing is pre-marked.
- **Orders → Order Set: Newborn Glucose Management:** the glucose policy as orders (screening, symptomatic checks, the BG pathway, serum glucose, NPO, IV dextrose only by separate order, documentation) plus the glucose gel PRN order (buccal, weight-based). **P** on any of these orders opens the full policy with the clinical pathway and gel-dose tables.
- **Other Clinical → Documents** keeps only the prenatal record for Baby Boy Sung.

## Shared charting across devices (Supabase)

When a device is connected, everything charted on it (vitals, assessments, MAR, notes, I&O, acknowledgments, entered-in-error marks) and every faculty release, clock restart, and reset is saved to the class's shared chart and appears on every other connected device within a few seconds. The EMR Orientation is never shared; practice charting stays on each device.

**Header badge** (also on the sign-in screen; tap it for details):
- **✓ Shared** — everything on this device is in the shared chart.
- **Saving to shared chart… (n)** — sending now.
- **Not shared yet — offline (n waiting)** — no connection. The entries stay on this device (even after a reload) and are sent automatically when the connection returns. Each entry is stored only once, even if it is sent more than once.
- **Not connected — this device only** — this device has not been connected yet.

**Logins.** Set up the same way as the original ATU Simulation Hospital: **one hospital login, `Atusim1@atu.edu`, connects every simulation computer.** Students still type their own names at sign-in, and Student, Observer, or Faculty (PIN) is chosen on each computer's screen.

Optional: for stricter control, create separate student, observer, and faculty logins as well. The server then enforces the role (a student login can never release or reset, an observer login can never chart):

| Login | Server allows |
|---|---|
| `Atusim1@atu.edu` (hospital login) | Everything; the screen mode decides |
| `faculty@atusim.test` (optional) | Everything |
| `student@atusim.test` (optional) | Charting and medications only |
| `observer@atusim.test` (optional) | View only |

**Reset Patient** clears that patient's student charting and releases on **every** connected computer and restarts the clock. No copy is kept. Other patients are not changed. Entries from a previous group's computer that was offline during the reset are refused, so they never enter the new group's chart.

Every entry keeps the student name typed at sign-in, the login the computer is connected with, and the time.

### One-time setup (faculty)

1. **Supabase project:** the URL and the **publishable** key are in `js/config.js` (`shared`). Only those two belong in the website. **Never** put the database password or a secret / service_role key in any file.
2. **Hospital login:** in Supabase go to **Authentication → Users → Add user → Create new user**. Email `Atusim1@atu.edu`, a password you choose, and check **Auto Confirm User**. (Optional: also create `faculty@atusim.test`, `student@atusim.test`, `observer@atusim.test` the same way.)
3. **Turn off public sign-ups:** **Authentication → Sign In / Providers → Allow new users to sign up: off**. Logins that are not in the approved list get no access in any case.
4. **Run the setup script:** **SQL Editor → New query**, paste all of [`supabase/setup.sql`](supabase/setup.sql), and click **Run**. The last result lists the approved logins. Run it again any time you add a login; it keeps existing charting.
5. **Connect each computer once:** open the EHR, tap **Not connected — this device only** on the sign-in screen. The email is already filled in; enter the hospital password and choose **Connect**. The computer stays connected (also after Sign Out) until **Disconnect this device** is chosen.

To run a separate chart, for example two sections at the same time, set a different `session` in `js/config.js` on a copy of the site.

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
js/shared.js            shared charting across devices (Supabase)
supabase/setup.sql      one-time database setup for shared charting
docs/                   authoring guide + patient template
```
