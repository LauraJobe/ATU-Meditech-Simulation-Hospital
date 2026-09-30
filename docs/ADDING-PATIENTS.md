# Adding and editing simulation patients

There are two ways to add patients:

1. **Permanent (for everyone):** add an object to the list in `js/data/patients.js` and push to GitHub. Copy an existing patient as a starting point.
2. **Quick, on one computer:** fill in `docs/patient-template.json` and use **Instructor Tools → Add Patient (JSON)**. The patient is saved only in that browser.

## Times

Each patient has a `scenarioStart` clock time. When the chart is first opened (or **Restart Clock** is clicked), the chart clock is set to that time and then runs in real time. Everything else is timed relative to it:

| Write this | Meaning |
|---|---|
| `time: '09:00'` | 0900 on the scenario day |
| `time: '21:00', day: -1` | 2100 the day before |
| `at: -30` | 30 minutes before scenario start |
| inside an event: `at: 15` | 15 minutes after the instructor releases the event |

## Patient fields

| Field | Example / notes |
|---|---|
| `id` | `'watkins'`. Unique, lowercase, no spaces. |
| `level` | `1`, `2`, or `3`. Controls which census tab shows the patient. |
| `experiences` | `['advms', 'icu']`. Sim experiences this patient appears under: `ms`, `advms`, `icu`, `psych`, `ob`, `peds` (list in `js/config.js`). |
| `name` | `{ first: 'Vernon', last: 'Watkins' }` |
| `mrn` | Printed on the wristband barcode. Must be unique. |
| `dob`, `age`, `sex` | `'1957-04-09'`, `'69 years'`, `'M'` |
| `unit`, `room`, `service`, `attending` | Banner and census |
| `admitted` | `{ time: '10:00', day: -4 }` |
| `scenarioStart` | `'10:00'` |
| `admitDx`, `codeStatus`, `isolation` | `codeStatus: 'DNR'` shows in purple on the banner and census |
| `allergies` | `[{ agent: 'Penicillin', reaction: 'Hives', severity: 'Moderate', tags: ['penicillin'] }]`. Use `nkda: true` and `allergies: []` for none. |
| `heightCm`, `weightKg` | Used for BMI and the heparin flowsheet |
| `flags` | Extra banner chips, e.g. `['Fall Risk']`. A flag containing "Name alert" also shows on the census. |
| `vitalRanges` | Per-patient flag ranges, e.g. `{ spo2: [88, 92] }` |
| `assessmentForms` | Any of `'wdl-adult'`, `'mse'`, `'pain'`, `'braden'`, `'morse'`, `'gcs'` |
| `wdlDefinitions` | Optional per-patient WDL wording: `{ skin: '…surgical site clean, dry, intact' }` |
| `heparinFlowsheet` | `true` adds the Heparin Flowsheet tab |
| `hpi`, `pmh`, `psh`, `familyHx`, `socialHx`, `immunizations`, `homeMeds`, `ros`, `demographics`, `emergencyContact` | History tab |
| `bloodType` | Optional type & crossmatch result (e.g., `'A−'`) checked on the TAR |
| `labsPending` | A notice shown on Summary/Results (e.g., "labs are in the Notion PDF") |

## Orders

```js
{ id: 'wat-o5', cat: 'Nursing', text: 'Vital signs with SpO2 every 4 hours', time: '06:00', by: 'Dr. Jack Nelson' }
```
Optional: `detail`, `priority: 'STAT'`, `type: 'Telephone'`, `status: 'Pending'`. Categories group the Orders screen (Admission, Code Status, Nursing, Activity, Diet, Respiratory, IV Fluids, Medication, Lab, Imaging, Diagnostics, Consult, …). Medication orders come from `meds` automatically.

**Transfusions:** give a blood product order `cat: 'Blood Products'` (e.g., `text: 'Transfuse 1 unit PRBC over 2 hours'`); it appears on the TAR. Put it in an `events` entry to release it during the sim. Optionally add `bloodType: 'O+'` to the patient; the TAR then rejects a mismatched patient ABO/Rh entry.

## Medications

```js
{ id: 'wat-cipro', name: 'Ciprofloxacin 400 mg in 100 mL NS', dose: '400 mg', route: 'IVPB',
  freq: 'Every 12 hours', type: 'scheduled',
  doses: [{ time: '09:00', given: 'CR' }, { time: '21:00' }] }
```

| Field | Notes |
|---|---|
| `type` | `'scheduled'`, `'once'`, `'prn'`, or `'continuous'` |
| `doses` | Scheduled times. `given: 'initials'` marks a dose given by the prior shift; `notGiven: 'Patient refused', by: 'HJ'` marks one not given. |
| `lastGiven` | PRN: `{ time: '02:00', by: 'LJ' }`. Used for "too soon" checks with `minIntervalHr`. |
| `started` | Continuous: `{ time: '08:00', by: 'LJ' }` |
| `rate`, `indication`, `instructions` | Shown on the eMAR |
| `preAssess` | Required before giving: `'HR'`, `'SBP'`, `'DBP'`, `'RR'`, `'SpO2'`, `'Temp'`, `'Glucose'`, `'Pain'`, or `'lab:Potassium'` (shows latest lab) |
| `holdIf` | `[{ p: 'SBP', op: '<', v: 100 }]` → warning when the pre-assessment value meets it |
| `tags` | Drug class for allergy checking, e.g. `['penicillin']`, matched against allergy `tags` |
| `highAlert` | `true` → badge + required independent double check |
| `status` | `'Active'` (default), `'On Hold'`, `'Pending'`, `'Do Not Administer'`; add `holdReason` |
| `weekday` | Weekly meds: `3` = Wednesday (0 = Sunday). Other days show "Not due today". |
| `barcode` | Optional. Default is `RX-` + the id in capitals (printed on labels.html). |

## Vitals, labs, notes, I&O

```js
vitals: [{ time: '09:00', temp: 99.0, tempRoute: 'Oral', hr: 105, rr: 22, sbp: 130, dbp: 84, spo2: 94, o2: 'Room air', pain: 0, by: 'Day shift RN' }]
labs:   [{ id: 'sha-bmp', panel: 'Basic Metabolic Panel', time: '12:50', results: [
          { t: 'Potassium', v: 3.8, u: 'mEq/L', lo: 3.5, hi: 5.1 },
          { t: 'Troponin I', v: 0.06, u: 'ng/mL', ref: '≤ 0.04', flag: 'H' } ] }]
notes:  [{ id: 'n1', type: 'Nursing Note', author: 'VR, RN', time: '06:00', text: '…' }]
imaging:[{ id: 'ecg1', study: '12-Lead ECG', time: '11:35', text: '…' }]
io:     [{ time: '06:00', kind: 'out', cat: 'Urine — Foley', amt: 350 }]
```
Lab flags are computed from `lo`/`hi`. You can set `flag` yourself: `'H'`, `'L'`, `'H*'` / `'L*'` (critical), or `'A'` (abnormal).

## Scenario events (instructor-released)

Events are the EHR version of the Notion "STAT Orders — Reveal When Needed" pages. Nothing in an event is visible until the instructor clicks **Release Now**.

```js
events: [{
  id: 'wat-stat',
  title: 'STAT orders — Nurse Driven Heparin Protocol',
  instructorNotes: 'Shown only in Instructor Tools.',
  orders: [ … ],          // appear flagged NEW, student must acknowledge
  meds: [ … ],            // added to the eMAR; doses use "at" minutes after release
  labs: [ … ],            // appear on Results flagged NEW
  notes: [ … ], imaging: [ … ],
  discontinue: ['liv-lr'],   // med/order ids to DC
  activate: ['med-id'],      // turn a Pending med Active
  patch: { unit: 'Intensive Care Unit' }  // change banner fields
}]
```
