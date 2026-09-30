#!/usr/bin/env node
/*
 * Imports patients from the laurablasdel/ATU-Simulation-Hospital repository
 * (simulation-defaults.js, built from the Notion charts) into this EHR's
 * patient format.
 *
 *   node tools/import-atu-sim-hospital.cjs <path-to-ATU-Simulation-Hospital>
 *
 * Writes js/data/patients-imported.js and copies referenced images/PDFs to
 * assets/imported/. Level 3 patients already curated in js/data/patients.js
 * are skipped. Review the output: the source is converted Notion text.
 */
'use strict';
const fs = require('fs');
const path = require('path');

const SRC = process.argv[2];
if (!SRC) { console.error('usage: node tools/import-atu-sim-hospital.cjs <path-to-ATU-Simulation-Hospital>'); process.exit(1); }
const ROOT = path.resolve(__dirname, '..');
global.window = global;
require(path.join(path.resolve(SRC), 'simulation-defaults.js'));
require(path.join(path.resolve(SRC), 'chart-data.js'));
const D = global.SIMULATION_DEFAULTS;
const EXTRA = global.CHART_RECORDS || [];

// Who to import and how they fit this EHR (level, sim experience, unit).
const PLAN = {
  'charles-jones': { level: 1, experiences: ['ms'], unit: 'Medical-Surgical Unit', service: 'Medicine', admittedDaysAgo: 2, forms: ['wdl-adult', 'pain', 'braden', 'morse'], shifts: true },
  'jane-fowler': { level: 1, experiences: ['ms'], unit: 'Surgical Unit — Pre-Op', service: 'Gynecologic Surgery', forms: ['wdl-adult', 'pain', 'braden', 'morse'] },
  'amelia-sung': { level: 2, experiences: ['ob'], unit: 'Labor & Delivery', service: 'Obstetrics', forms: ['wdl-adult', 'pain', 'morse'] },
  'baby-boy-sung': { level: 2, experiences: ['ob'], unit: 'Newborn Nursery', service: 'Pediatrics — Newborn', forms: ['pain'],
    vitalRanges: { hr: [110, 160], rr: [30, 60], sbp: [60, 90], dbp: [30, 60], temp: [97.7, 99.5], spo2: [95, 100] }, newborn: true },
  'fatima-sanogo': { level: 2, experiences: ['ob'], unit: 'Mother-Baby / Postpartum', service: 'Obstetrics', forms: ['wdl-adult', 'pain', 'morse'] },
  'molly-thomas': { level: 2, experiences: ['peds'], unit: 'Pediatric Unit', service: 'Pediatrics', forms: ['pain'],
    vitalRanges: { hr: [100, 160], rr: [30, 53], sbp: [72, 104], dbp: [37, 56], spo2: [95, 100] } },
  'stephanie-smith': { level: 2, experiences: ['peds'], unit: 'Pediatric Unit', service: 'Pediatrics', forms: ['wdl-adult', 'pain', 'morse'] }
};

/* ---------------- text helpers ---------------- */

const assets = new Set();
function assetRef(p) { assets.add(p); return 'assets/imported/' + path.basename(p); }

// Notion-flavored HTML/markdown -> plain markdown the EHR can render.
function clean(s) {
  let t = String(s || '');
  t = t.replace(/<colgroup>[\s\S]*?<\/colgroup>/g, '');
  // HTML tables -> pipe tables
  t = t.replace(/<table[^>]*>([\s\S]*?)<\/table>/g, (_, body) => {
    const rows = [...body.matchAll(/<tr[^>]*>([\s\S]*?)(?=<tr|$)/g)].map(m => [...m[1].matchAll(/<td[^>]*>([\s\S]*?)<\/td>/g)].map(c => c[1].replace(/\s+/g, ' ').trim()));
    const keep = rows.filter(r => r.some(c => c));
    if (!keep.length) return '';
    const w = Math.max(...keep.map(r => r.length));
    return '\n' + keep.map((r, i) => '| ' + Array.from({ length: w }, (_, j) => r[j] || '').join(' | ') + ' |' + (i === 0 ? '\n|' + ' --- |'.repeat(w) : '')).join('\n') + '\n';
  });
  t = t.replace(/<callout[^>]*icon="([^"]*)"[^>]*>\s*([\s\S]*?)<\/callout>/g, (_, ic, body) => `\n> ${ic} ${body.replace(/\s*\n\s*/g, ' ').trim()}\n`);
  t = t.replace(/<details>\s*<summary>([\s\S]*?)<\/summary>([\s\S]*?)<\/details>/g, (_, s1, b) => `${s1.trim()}:\n${b}`);
  t = t.replace(/<\/?columns?[^>]*>/g, '').replace(/<empty-block\/>/g, '').replace(/<unknown[^>]*\/>/g, '');
  t = t.replace(/<mention-page[^>]*>([\s\S]*?)<\/mention-page>/g, '$1').replace(/<page[^>]*>([\s\S]*?)<\/page>/g, '$1');
  t = t.replace(/<span[^>]*>([\s\S]*?)<\/span>/g, '$1').replace(/<\/?(br|u|b|i|strong|em)\s*\/?>/g, '');
  t = t.replace(/<tr color="[^"]*">\s*/g, '');
  t = t.replace(/\\([<>*_#\[\]|-])/g, '$1');
  t = t.replace(/!\[[^\]]*\]\(((?:\.\/)?assets\/[^)]+)\)/g, (_, p) => fs.existsSync(path.join(path.resolve(SRC), p.replace(/^\.\//, ''))) ? `![](${assetRef(p)})` : '_(Image not included in the source record.)_');
  t = t.replace(/\(?\b\d{3}\)?[-. ]\d{3}[-. ]\d{4}\b/g, 'phone on file');   // never publish phone numbers
  t = t.replace(/^\t+/gm, '').replace(/[ \t]+$/gm, '').replace(/\n{3,}/g, '\n\n');
  return t.trim();
}

// Pipe tables in cleaned markdown -> arrays of rows (header first).
function tables(md) {
  const out = [];
  let cur = null;
  md.split('\n').forEach(line => {
    if (/^\|.*\|\s*$/.test(line)) {
      if (/^\|[\s|:-]+\|$/.test(line)) return;
      const cells = line.replace(/^\||\|$/g, '').split('|').map(c => c.replace(/\*\*/g, '').trim());
      if (!cur) { cur = []; out.push(cur); }
      cur.push(cells);
    } else cur = null;
  });
  return out.filter(t => t.length > 1);
}

const TEST = [[/^(hgb|hb|hemoglobin)\b/i, 'Hgb'], [/^(hct|hematocrit)/i, 'HCT'], [/^wbc/i, 'WBC'], [/^rbc/i, 'RBC'], [/^mchc/i, 'MCHC'], [/^mch\b/i, 'MCH'], [/^mcv/i, 'MCV'], [/^rdw/i, 'RDW'],
  [/^(plt|platelet)/i, 'Platelets'], [/^na\+?|^na⁺|^sodium/i, 'Sodium'], [/^k\+?\b|^k⁺|^potassium/i, 'Potassium'], [/^(cl|chloride)/i, 'Chloride'], [/^(co2|hco3|hco₃|bicarb)/i, 'HCO3'],
  [/^bun|^urea/i, 'BUN'], [/^creat/i, 'Creatinine'], [/^glucose/i, 'Glucose'], [/^calcium/i, 'Calcium'], [/^magnes/i, 'Magnesium'], [/^lactate/i, 'Lactate'], [/^bnp/i, 'BNP'],
  [/^a1c/i, 'Hemoglobin A1c'], [/^inr/i, 'INR'], [/^pt\b/i, 'PT'], [/^aptt|^ptt/i, 'aPTT'], [/^alt/i, 'ALT'], [/^ast/i, 'AST'], [/^bili/i, 'Bilirubin, total'],
  [/^chol/i, 'Cholesterol'], [/^trig/i, 'Triglycerides']];
const testName = t => { const s = t.replace(/\*/g, '').replace(/\s*\([^)]*\)\s*$/, '').trim(); const m = TEST.find(([re]) => re.test(s)); return m ? m[1] : s; };

function refOf(r) {
  const s = String(r || '').replace(/\*/g, '').replace(/^female\s+/i, '').trim();
  const m = /^(-?[\d.,]+)\s*[-–]\s*([\d.,]+)\s*(.*)$/.exec(s);
  if (m) return { lo: Number(m[1].replace(/,/g, '')), hi: Number(m[2].replace(/,/g, '')), u: m[3].replace(/^[\s)]+|[\s(]+$/g, '') || undefined };
  return s ? { ref: s } : {};
}
function valueOf(v, ref) {
  const raw = String(v || '').trim();
  const star = /\*/.test(raw);
  let val = raw.replace(/\*/g, '').replace(/\[.*?\]/g, '').trim();
  if (/^[\d,]+(\.\d+)?$/.test(val)) val = val.replace(/,/g, '');
  const r = { v: val };
  const num = /^-?\d+(\.\d+)?$/.test(val) ? Number(val) : null;
  if (num == null && ref.ref && /negative|clear|yellow|no growth/i.test(ref.ref) && !new RegExp('^' + ref.ref.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '$', 'i').test(val)) r.flag = 'A';
  else if (star && (num == null || ref.lo == null)) r.flag = 'A';
  return r;
}

// Column label -> scenario time for a lab column.
function colTime(label, fallbackAt) {
  const s = String(label || '');
  const hm = /(\d{2})(\d{2})/.exec(s);
  const day = /yesterday/i.test(s) ? -1 : 0;
  if (hm && /today|yesterday/i.test(s)) return { time: hm[1] + ':' + hm[2], day };
  if (/admission|preop/i.test(s)) return { at: -240 };
  return { at: fallbackAt };
}

// Lab panels from a record's tables.
function labsFrom(md, title, idBase, fallbackAt) {
  const panels = [];
  tables(md).forEach((tb, ti) => {
    const head = tb[0].map(h => h.toLowerCase());
    if (head.some(h => /temp|heart rate|pulse ox/.test(h))) return;       // vital signs
    if (head.some(h => /order|provider order/.test(h))) return;            // orders
    const rows = tb.slice(1).filter(r => r[0] && !/^name:|^dob:|^diagnosis:/i.test(r[0]));
    if (!rows.length) return;
    const ri = head.findIndex((h, i) => i > 0 && /range|reference|normal/.test(h));
    const vi = head.findIndex((h, i) => i > 0 && /result|value/.test(h));
    if (head.some(h => /^time$|initial|15 min/.test(h))) return;              // transfusion form, not labs
    if (ri > 0 && vi > 0) {
      const results = rows.filter(r => r[vi] !== undefined && r[vi] !== '').map(r => { const ref = refOf(r[ri]); return Object.assign({ t: testName(r[0]) }, valueOf(r[vi], ref), ref); });
      if (results.length) panels.push({ id: `${idBase}-${ti}`, panel: title, ...colTime('', fallbackAt), results });
      return;
    }
    // Test (range) | time1 | time2 ...
    tb[0].slice(1).forEach((label, ci) => {
      const results = rows.filter(r => r[ci + 1]).map(r => {
        const m = /\(([^)]*)\)\s*$/.exec(r[0].replace(/\*/g, ''));
        const ref = m ? refOf(m[1]) : {};
        return Object.assign({ t: testName(r[0]) }, valueOf(r[ci + 1], ref), ref);
      }).filter(x => x.v !== '');
      if (results.length) panels.push({ id: `${idBase}-${ti}-${ci}`, panel: title, ...colTime(label, fallbackAt), results });
    });
  });
  return panels;
}

// Flip a table whose first column holds the labels (Date, Time, BP, HR, ...).
function transpose(tb) {
  const w = Math.max(...tb.map(r => r.length));
  return Array.from({ length: w }, (_, j) => tb.map(r => r[j] || ''));
}
// Vital signs from flowsheet tables (either orientation) or a bulleted list.
function vitalsFrom(md, by) {
  const out = [];
  const list = {};
  md.split('\n').forEach(l => { const m = /^\s*[-•]\s*(temperature|temp|heart rate|hr|blood pressure|bp|respiratory rate|rr|spo2|pulse ox)\s*:\s*(.+)$/i.exec(l); if (m) list[m[1].toLowerCase()] = m[2]; });
  if (Object.keys(list).length >= 3) {
    const g = k => Object.entries(list).find(([kk]) => k.test(kk));
    const num = s => { const m = /-?\d+(\.\d+)?/.exec(s || ''); return m ? Number(m[0]) : undefined; };
    const t = g(/temp/), bp = /(\d+)\s*\/\s*(\d+)/.exec((g(/blood|bp/) || [])[1] || '');
    let temp = t ? num(t[1]) : undefined;
    if (t && /\bC\b|°c/i.test(t[1]) && temp) temp = Math.round((temp * 9 / 5 + 32) * 10) / 10;
    const v = { at: -60, temp, hr: num((g(/heart|hr/) || [])[1]), rr: num((g(/resp|rr/) || [])[1]), sbp: bp ? Number(bp[1]) : undefined, dbp: bp ? Number(bp[2]) : undefined, spo2: num((g(/spo2|pulse ox/) || [])[1]), o2: 'Room air', by };
    const extra = md.split('\n').find(l => /^\s*[-•]\s*(?!temperature|temp|heart|hr|blood|bp|resp|rr|spo2|pulse)/i.test(l));
    if (extra) v.note = extra.replace(/^\s*[-•]\s*/, '').slice(0, 200);
    Object.keys(v).forEach(k => v[k] === undefined && delete v[k]);
    out.push(v);
  }
  tables(md).map(tb => /^(date|time|bp|hr)/i.test(tb[0][0] || '') && tb.some(r => /^bp$|^hr$|^rr$/i.test(r[0] || '')) ? transpose(tb) : tb).forEach(tb => {
    const head = tb[0].map(h => h.toLowerCase());
    const col = re => head.findIndex(h => re.test(h));
    const c = { time: col(/^time|date ?\/time|date\/time/) >= 0 ? col(/^time|date ?\/time|date\/time/) : col(/date/), day: col(/^date$/), temp: col(/^temp/), route: col(/route/), hr: col(/heart|pulse$|^hr$/), rr: col(/resp|^rr$/), bp: col(/blood pressure|^bp$/), spo2: col(/pulse ox|spo2|sat/), o2l: col(/o2 in liters|liters|oxygen flow/), o2m: col(/delivery|o2 method/), pain: col(/pain/), by: col(/initials/), painAlt: -1 };
    if (c.temp < 0 && c.hr < 0) return;
    const rows = tb.slice(1).filter(r => [c.temp, c.hr, c.rr, c.bp, c.spo2].some(i => i >= 0 && /\d/.test(r[i] || '')));
    rows.forEach((r, i) => {
      const g = k => (c[k] >= 0 ? (r[c[k]] || '').trim() : '');
      const num = s => { if (/^n\/?a$/i.test(s)) return undefined; const m = /-?\d+(\.\d+)?/.exec(s); return m ? Number(m[0]) : undefined; };
      const bp = /(\d+)\s*\/\s*(\d+)/.exec(g('bp'));
      const hm = /\b([01]\d|2[0-3])([0-5]\d)\b/.exec(g('time'));
      const dayLbl = c.day >= 0 && c.day !== c.time ? g('day') : '';
      const plus = /\+\s*(\d+)\s*(min|hr|hour)/i.exec(g('time'));
      const flow = num(g('o2l'));
      const method = g('o2m') || (/ra|room/i.test(g('o2l')) ? 'Room air' : '');
      const v = {
        temp: num(g('temp')), tempRoute: /ax/i.test(g('route')) ? 'Axillary' : /rect/i.test(g('route')) ? 'Rectal' : /temp/i.test(g('route')) ? 'Temporal' : g('route') ? 'Oral' : undefined,
        hr: num(g('hr')), rr: num(g('rr')), sbp: bp ? Number(bp[1]) : undefined, dbp: bp ? Number(bp[2]) : undefined, spo2: num(g('spo2')),
        o2: !method && flow ? 'Nasal cannula' : /nc|nasal/i.test(method) ? 'Nasal cannula' : /ra|room/i.test(method) || /^ra$/i.test(g('o2l')) ? 'Room air' : /mask/i.test(method) ? 'Simple face mask' : method || undefined,
        o2Flow: flow && !/^ra$|^na$/i.test(g('o2l')) ? flow : undefined, pain: num(g('pain')),
        note: [dayLbl, !hm && g('time') && !plus ? g('time') : ''].filter(x => x && !/^(date|now)$/i.test(x)).join(' ') || undefined, by: g('by') || by
      };
      Object.keys(v).forEach(k => v[k] === undefined && delete v[k]);
      const dm = /day\s*(\d)/i.exec(dayLbl);
      const back = /admit/i.test(dayLbl) ? -(PLAN_ADMIT_DAYS || 0) : dm ? -((PLAN_ADMIT_DAYS || Number(dm[1])) - Number(dm[1])) : 0;
      out.push(Object.assign(hm ? Object.assign({ time: hm[1] + ':' + hm[2] }, back ? { day: back } : {}) : plus ? { at: -60 + Number(plus[1]) * (/h/i.test(plus[2]) ? 60 : 1) } : { at: -60 - (rows.length - i) * 30 }, v));
    });
  });
  return out;
}

const CAT = [[/transfus|prbc|type and cross|blood product|\bu(nits?)?\s+(of\s+)?blood\b|blood infus/i, 'Blood Products'], [/vital|monitor|pulse ox|i ?& ?o|intake|output|weight|foley|catheter|scd|dressing|checklist|teach|splint|spirometer|bladder|prepare the abdomen|neuro check|pews/i, 'Nursing'],
  [/diet|npo|sips|clear liquid|breastfeed|formula/i, 'Diet'], [/activity|bed rest|out of bed|ambulat|oob/i, 'Activity'], [/code status|full code|dnr/i, 'Code Status'],
  [/admit|transfer|diagnosis|dx:|condition/i, 'Admission'], [/\b(cbc|bmp|cmp|a1c|culture|urinalysis|ua\b|lactate\b|glucose check|hcg|labs?\b|blood type|bilirubin|coomb|newborn screen)/i, 'Lab'],
  [/x-?ray|\bct\b|imaging|radiolog|ultrasound/i, 'Imaging'], [/ekg|ecg|echo/i, 'Diagnostics'], [/oxygen|\bo2\b|spo2|nebuliz|respiratory|suction/i, 'Respiratory'],
  [/\biv\b|saline|ringer|kvo|fluid|bolus|d5|\bns\b/i, 'IV Fluids'], [/consult|physical therapy|\bpt:|oncology|lactation/i, 'Consult'],
  [/\b(mg|mcg|units?|tablet|po|ivp|subcut|sq|im)\b/i, 'Medication']];
const catOf = t => (CAT.find(([re]) => re.test(t)) || [0, 'Nursing'])[1];

// Orders from a record: order-table rows or list lines.
function ordersFrom(md, provider) {
  const out = [];
  tables(md).forEach(tb => {
    const head = tb[0].map(h => h.toLowerCase());
    const oi = head.findIndex(h => /order/.test(h) && !/type of order/.test(h));
    if (oi < 0) return;
    const pi = head.findIndex(h => /^provider$/.test(h));
    tb.slice(1).forEach(r => { const t = (r[oi] || '').replace(/^\d+\.+\s*/, '').trim(); if (t && !/^entered by/i.test(t)) out.push({ text: t, by: pi >= 0 && r[pi] ? r[pi] : provider }); });
    tb.slice(1).forEach(r => { const e = r.find(c => /^entered by/i.test(c || '')); if (e) out.forEach(o => { o.by = e.replace(/^entered by\s*/i, ''); }); });
  });
  if (!out.length) md.split('\n').forEach(l => { const m = /^\s*(?:\d+[.)]|[-•])\s+(.+)$/.exec(l); if (m && !/^\*\*/.test(m[1])) out.push({ text: m[1].replace(/\*\*/g, '').trim(), by: provider }); });
  return out.filter(o => o.text.length > 2 && !/^no additional orders|^record new provider orders/i.test(o.text));
}
// Rough text similarity for de-duplicating orders.
const words = t => new Set(String(t).toLowerCase().replace(/[^a-z0-9 ]/g, ' ').split(/\s+/).filter(w => w.length > 2 && !/^(the|and|for|per|with|every|hours?|daily)$/.test(w)));
const same = (w, x) => w === x || (w.length >= 4 && x.length >= 4 && (w.startsWith(x) || x.startsWith(w)));
// strict: near-identical wording (Jaccard); loose: the shorter text is mostly contained in the longer.
function similar(a, b, strict) {
  const A = [...words(a)], B = [...words(b)];
  if (!A.length || !B.length) return false;
  const n = A.filter(w => B.some(x => same(w, x))).length;
  return strict ? n / (A.length + B.length - n) >= 0.7 : n / Math.min(A.length, B.length) >= 0.6;
}

/* ---------------- medications ---------------- */

const TIMES = { 'AC/HS': ['07:30', '11:30', '16:30', '21:00'] };
function medFrom(m, i, pid) {
  const name = m.name.trim();
  const when = String(m.scheduledTime || '').trim();
  const freq = String(m.frequency || '').trim();
  const text = `${name} ${m.dose} ${m.route} ${freq} ${when}`;
  let type = 'scheduled';
  const every = /every (\d+)\s*hours?/i.exec(freq + ' ' + when);
  if (/\bprn\b|as needed/i.test(freq + ' ' + when)) type = 'prn';
  else if (/continuous|kvo|infusion/i.test(text) && !/ivpb/i.test(m.route)) type = 'continuous';
  else if (/stat|once|on call|^now$|post-op|delivery/i.test(when + ' ' + freq) && !/\d{4}/.test(when) && !every) type = 'once';
  const med = { id: `${pid.split('-')[0].slice(0, 4)}-${slug(name)}-${i}`, name, dose: m.dose || '', route: m.route || '', freq: freq || when, type };
  if (/^regular insulin/i.test(name)) med.drugKey = 'INSULIN';
  if (m.highAlert) med.highAlert = true;
  if (m.notes) med.instructions = m.notes;
  const prior = /(\d{4})\s*\/\s*([A-Za-z]+)/.exec(m.previouslyGiven || '');
  if (type === 'scheduled') {
    const list = TIMES[when] || (when.match(/\b\d{4}\b/g) || []).map(t => t.slice(0, 2) + ':' + t.slice(2));
    med.doses = list.length ? list.map(t => Object.assign({ time: t }, prior && prior[1].slice(0, 2) + ':' + prior[1].slice(2) === t ? { given: prior[2].toUpperCase() } : {}))
      : every ? Array.from({ length: Math.max(1, Math.floor(24 / Number(every[1]))) }, (_, k) => ({ at: k * Number(every[1]) * 60 })) : [{ at: 0 }];
    if (/held|hold/i.test(when + ' ' + freq)) { med.status = 'Held'; med.holdReason = freq; }
  } else if (type === 'once') med.doses = [{ at: 0 }];
  else if (type === 'prn' && prior) med.lastGiven = { time: prior[1].slice(0, 2) + ':' + prior[1].slice(2), by: prior[2].toUpperCase() };
  else if (type === 'continuous') { if (m.dose && /ml\/hr|kvo/i.test(m.dose)) med.rate = m.dose; if (prior) med.started = { time: prior[1].slice(0, 2) + ':' + prior[1].slice(2), by: prior[2].toUpperCase() }; }
  if (type === 'prn') { const ind = /(?:prn|as needed)\s*(?:for\s+)?(.+)$/i.exec(freq); if (ind) med.indication = ind[1]; }
  const mi = /every (\d+)\s*hours?/i.exec(freq);
  if (type === 'prn' && mi) med.minIntervalHr = Number(mi[1]);
  return med;
}
const slug = s => s.toLowerCase().replace(/\(.*?\)/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 24);

/* ---------------- patient ---------------- */

function isoDob(dob, age) {
  const m = /^(\d{1,2})\/(\d{1,2})\/(\w+)/.exec(dob || '');
  const years = /(\d+)/.test(age || '') && !/month|newborn/i.test(age) ? Number(/(\d+)/.exec(age)[1]) : 0;
  const now = new Date(), y = now.getFullYear();
  if (!m) return 'today';
  let year = /^\d{4}$/.test(m[3]) ? Number(m[3]) : y - years;
  if (/month/i.test(age)) { const mo = Number(/(\d+)/.exec(age)[1]); const d = new Date(now); d.setMonth(d.getMonth() - mo); year = d.getFullYear(); }
  return `${year}-${String(m[1]).padStart(2, '0')}-${String(m[2]).padStart(2, '0')}`;
}

let PLAN_ADMIT_DAYS = 0;
function convert(pid, plan) {
  const src = D[pid];
  PLAN_ADMIT_DAYS = plan.admittedDaysAgo || 0;
  // Records: the curated defaults, plus any chart-data records they don't include.
  const have = new Set(src.chartRecords.map(r => r.id));
  const records = src.chartRecords.concat(EXTRA.filter(r => r.patientId === pid && !have.has(r.id) && !/lab results admission and each shift|^shift 1$/i.test(r.title)));
  const sp = src.patient;
  const [first, ...rest] = sp.name.replace(/^BABY BOY/i, 'Baby Boy').split(' ');
  const last = sp.name.replace(/^BABY BOY /i, '').split(' ').slice(-1)[0];
  const provider = /^dr\.?/i.test(sp.provider) ? sp.provider : 'Dr. ' + sp.provider;
  const allergies = (sp.allergies || []).filter(a => !/^(nkda|nka|none)$/i.test(a));
  const p = {
    id: pid.replace(/-/g, ''), level: plan.level, experiences: plan.experiences, source: 'ATU-Simulation-Hospital (Notion)',
    name: { first: /^baby/i.test(sp.name) ? 'Baby Boy' : first, last: /^baby/i.test(sp.name) ? last.charAt(0) + last.slice(1).toLowerCase() : rest.join(' ') || last },
    mrn: sp.mrn, dob: isoDob(sp.dob, sp.age), age: /^\d+$/.test(sp.age) ? sp.age + ' years' : sp.age, sex: /^f/i.test(sp.sex || '') ? 'F' : /^m/i.test(sp.sex || '') ? 'M' : (pid === 'charles-jones' ? 'M' : 'F'),
    unit: plan.unit, room: sp.room || '—', service: plan.service, attending: provider,
    admitted: plan.admittedDaysAgo ? { time: '10:00', day: -plan.admittedDaysAgo } : { at: -240 }, scenarioStart: '08:00',
    admitDx: sp.primaryDiagnosis, codeStatus: sp.codeStatus || 'Full Code', isolation: 'Standard',
    nkda: !allergies.length, allergies: allergies.map(a => ({ agent: a, reaction: 'Not documented', severity: 'Unknown', tags: /penicillin/i.test(a) ? ['penicillin'] : [a.toLowerCase()] })),
    heightCm: sp.heightCm || null, weightKg: sp.weightKg || null, flags: [], assessmentForms: plan.forms
  };
  if (sp.bloodType) p.bloodType = sp.bloodType.replace(/\s*positive/i, '+').replace(/\s*negative/i, '−');
  if (plan.vitalRanges) p.vitalRanges = plan.vitalRanges;
  ['gestationalAge', 'gravida', 'para', 'gbs', 'feedingPlan', 'surgery', 'scenario'].forEach(k => { if (sp[k]) (p.demographics = p.demographics || {})[{ gestationalAge: 'Gestational age', gravida: 'Gravida', para: 'Para', gbs: 'GBS', feedingPlan: 'Feeding plan', surgery: 'Surgery', scenario: 'Scenario' }[k]] = sp[k]; });
  if (sp.gbs) p.flags.push('GBS ' + sp.gbs);
  if (sp.ethnicity) (p.demographics = p.demographics || {}).Ethnicity = sp.ethnicity;

  p.orders = []; p.meds = []; p.vitals = []; p.labs = []; p.imaging = []; p.notes = []; p.io = []; p.documents = []; p.events = []; p.facultyGuide = [];
  const catalog = src.collections.medicationCatalog || [];
  const medNames = [...new Set(catalog.flatMap(m => m.name.toLowerCase().split(/[^a-z]+/)).filter(w => w.length >= 5 && !/^(sodium|chloride|normal|saline|solution|ringer|lactated|regular|dextrose|units)$/.test(w)))];
  const isMedOrder = t => medNames.some(n => new RegExp('\\b' + n.slice(0, 7)).test(t.toLowerCase()));
  let noteAt = -300;

  // Structured orders if present, else parsed from order records.
  const structured = (src.collections.orders || []).filter(o => !/Pending/i.test(o.status || ''));
  structured.forEach((o, i) => { if (!isMedOrder(o.text)) p.orders.push({ id: `${p.id}-o${i + 1}`, cat: catOf(o.text), text: o.text.replace(/\.$/, ''), at: -240, by: provider }); });

  // Released records for Shift 2 or later belong to that shift's instructor event.
  const shiftOf = r => { const m = /shift\s*(\d)/i.exec(r.title); return m && Number(m[1]) >= 2 && !/assessment/i.test(r.title) ? Number(m[1]) : 0; };
  const queued = new Set((src.releaseQueue || []).map(q => q.chartRecordId));
  const later = records.filter(r => r.status === 'released' && shiftOf(r) && !queued.has(r.id));
  const released = records.filter(r => r.status === 'released' && !later.includes(r));
  const structuredLabs = (src.collections.labs || []);
  if (structuredLabs.length) {
    const byGroup = {};
    structuredLabs.forEach(l => { const k = l.comments || l.time || 'Laboratory'; (byGroup[k] = byGroup[k] || []).push(l); });
    Object.entries(byGroup).forEach(([k, list], gi) => p.labs.push({ id: `${p.id}-sl${gi}`, panel: k, at: -240, results: list.map(l => { const ref = refOf(l.reference); return Object.assign({ t: testName(l.test) }, valueOf(l.result, ref), ref, /low|high|abn|crit/i.test(l.flag || '') && !(ref.lo != null) ? { flag: /low/i.test(l.flag) ? 'L' : /high/i.test(l.flag) ? 'H' : 'A' } : {}); }) }));
  }
  const otherNames = Object.values(D).map(x => x.patient.name).filter(n => n.toLowerCase() !== sp.name.toLowerCase());
  const aboutOther = md => otherNames.some(n => new RegExp('Patient Name:\\**\\s*' + n, 'i').test(md) || md.includes('**Patient:** ' + n));
  released.forEach((r, ri) => {
    const md = clean(r.content);
    const title = r.title.replace(/\s*\(\d\)\s*$/, '').trim();
    let cat = r.category;
    if (aboutOther(md)) return;                                                  // mis-linked record in the source
    if (/checklist|blood bank|consent/i.test(title) || title.toLowerCase() === sp.name.toLowerCase()) cat = 'documents';
    if (cat === 'faculty') { p.facultyGuide.push({ title, md }); return; }
    if (cat === 'summary') { p.hpi = md.split('\n').filter(l => !/^(dob|age|wt|primary diagnosis|surgery)\s*:/i.test(l.trim()) && !/^>/.test(l)).join('\n').replace(/###.*$/gms, '').trim(); return; }
    if (cat === 'flowsheets') { p.vitals.push(...vitalsFrom(md, 'Prior RN')); return; }
    if (cat === 'mar') return; // prior administrations come from the medication catalog
    // When the original Notion "Doctors' orders" page exists, a condensed rewrite of the same orders is skipped.
    if (cat === 'orders' && /^admission and|immediate postpartum/i.test(title) && released.some(x => /doctors?.?\s*orders/i.test(x.title))) return;
    if (cat === 'orders' && /order/i.test(title) && !/policy/i.test(title)) {
      if (!structured.length) ordersFrom(md, provider).forEach((o, i) => { if (!isMedOrder(o.text)) p.orders.push({ id: `${p.id}-o${ri}-${i}`, cat: catOf(o.text), text: o.text, at: -240, by: o.by }); });
      return;
    }
    if (cat === 'labs' && structuredLabs.length && !/x-?ray|ct|echo|ecg|radiolog/i.test(title)) return;
    if (cat === 'labs') {
      const panels = labsFrom(md, title, `${p.id}-l${ri}`, -120);
      const img = [...md.matchAll(/!\[\]\(([^)]+)\)/g)].map(m => m[1]);
      if (panels.length) p.labs.push(...panels);
      const narrative = md.replace(/^\|.*$/gm, '').replace(/!\[\]\([^)]+\)/g, '').trim();
      if (img.length || (!panels.length && narrative.length > 40)) p.imaging.push({ id: `${p.id}-im${ri}`, study: title, at: -180, text: panels.length ? '' : narrative, images: img });
      return;
    }
    if (cat === 'notes' || cat === 'surgery') {
      const nursing = /nursing|shift \d/i.test(title) && !/progress|h&p|history/i.test(title);
      p.notes.push({ id: `${p.id}-n${ri}`, type: title, author: nursing ? 'Prior shift RN' : provider, at: (noteAt += 30), md: true, text: md });
      return;
    }
    p.documents.push({ id: `${p.id}-d${ri}`, title, category: cat, md });
  });
  if (!p.bloodType) { const bt = p.labs.flatMap(l => l.results).find(x => /blood type/i.test(x.t)); if (bt) p.bloodType = String(bt.v).replace(/\s+/g, '').replace(/-$/, '−'); }
  (src.collections.notes || []).filter(n => n.narrative).forEach((n, i) => p.notes.push({ id: `${p.id}-cn${i}`, type: n.type || 'Nursing Note', author: n.student || 'Prior RN', at: (noteAt += 30), text: n.narrative }));

  // Medications released at start.
  catalog.filter(m => (m.releaseStatus || 'released') === 'released').forEach((m, i) => p.meds.push(medFrom(m, i, pid)));
  const pendingMeds = catalog.map((m, i) => ({ m, i })).filter(x => x.m.releaseStatus === 'pending');
  const usedMeds = new Set();

  // Faculty release queue -> instructor events (Charles Jones: one per shift).
  const groups = [];
  const queue = (src.releaseQueue || []).concat(later.map(r => ({ kind: r.category === 'flowsheets' ? 'vitals' : r.category === 'mar' ? 'mar' : 'result', title: r.title, content: r.content, chartRecordId: r.id })));
  queue.forEach(item => {
    const shift = /shift\s*(\d)/i.exec(item.title);
    const key = shift ? 'Shift ' + shift[1] : item.title;
    let g = groups.find(x => x.key === key);
    if (!g) { g = { key, items: [] }; groups.push(g); }
    g.items.push(item);
  });
  groups.forEach((g, gi) => {
    const ev = { id: `${p.id}-ev${gi + 1}`, title: g.key.replace(/\s+/g, ' ').trim(), orders: [], meds: [], labs: [], imaging: [], notes: [], documents: [], vitals: [], instructorNotes: '' };
    g.items.forEach((item, ii) => {
      const md = clean(item.content || '');
      const t = item.title.replace(/\s+/g, ' ').trim();
      if (item.kind === 'vitals') { ev.vitals.push(...vitalsFrom(md, 'RN').filter(v => !/admit/i.test(v.note || '')).map((v, vi) => { delete v.time; delete v.day; delete v.note; v.at = vi * 5; return v; })); return; }
      const srcRec = records.find(x => x.id === item.chartRecordId);
      const srcCat = srcRec ? srcRec.category : '';
      if (item.kind === 'mar') { ev.instructorNotes += `${t}: see the source MAR for this shift. `; return; }
      if (item.kind === 'chartdata') {
        const hit = pendingMeds.find(x => !usedMeds.has(x.i) && t.toLowerCase().startsWith(x.m.name.toLowerCase().split(/[\s(]/)[0]));
        if (hit) { usedMeds.add(hit.i); ev.meds.push(medFrom(hit.m, 100 + hit.i, pid)); }
        return;
      }
      const linked = pendingMeds.filter(x => !usedMeds.has(x.i) && (x.m.sourceChartRecordId === item.chartRecordId || (x.m.sourceChartRecordId && (item.linkedChartRecordIds || []).includes(x.m.sourceChartRecordId))));
      linked.forEach(x => { usedMeds.add(x.i); ev.meds.push(medFrom(x.m, 100 + x.i, pid)); });
      if (/\bMAR\b/.test(t)) { ev.instructorNotes += `${t}: ${md.replace(/\n+/g, ' ')} `; return; }
      const labs = labsFrom(md, t, `${ev.id}-l${ii}`, 0).map(l => { delete l.time; delete l.day; return Object.assign(l, { at: 0 }); });
      const orders = ordersFrom(md, provider);
      const img = [...md.matchAll(/!\[\]\(([^)]+)\)/g)].map(m => m[1]);
      const medHit = pendingMeds.find(x => !usedMeds.has(x.i) && t.toLowerCase().startsWith(x.m.name.toLowerCase().split(/[\s(]/)[0]));
      if (/blood bank|consent/i.test(t)) { ev.documents.push({ id: `${ev.id}-d${ii}`, title: t, md }); return; }
      if (srcCat === 'orders' && !medHit) {
        const list = orders.length ? orders : [{ text: (t + (md && !/^provider:/i.test(md) ? ' — ' + md.replace(/\n+/g, ' ').replace(/\*\*/g, '') : '')).replace(/\s*—\s*Provider:.*$/i, '').slice(0, 300), by: provider }];
        list.forEach((o, oi) => ev.orders.push({ id: `${ev.id}-o${ii}-${oi}`, cat: catOf(o.text), text: o.text.replace(/\.\s*$/, ''), by: o.by, priority: /stat/i.test(o.text) ? 'STAT' : undefined }));
        return;
      }
      if (medHit) { usedMeds.add(medHit.i); ev.meds.push(medFrom(medHit.m, 100 + medHit.i, pid)); ev.orders.push({ id: `${ev.id}-mo${ii}`, cat: 'Medication', text: t, by: provider, isMedOrder: true }); return; }
      if (labs.length) ev.labs.push(...labs);
      if (/order|infuse|ceftriaxone|acetaminophen \d|cbc in am/i.test(t) && orders.length) orders.forEach((o, oi) => { if (!isMedOrder(o.text) || /infuse|prbc/i.test(o.text)) ev.orders.push({ id: `${ev.id}-o${ii}-${oi}`, cat: catOf(o.text), text: o.text, by: o.by, priority: /stat/i.test(o.text) ? 'STAT' : undefined }); });
      else if (/order/i.test(t) && !orders.length && md) ev.orders.push({ id: `${ev.id}-o${ii}`, cat: catOf(t + ' ' + md), text: md.replace(/\n+/g, ' ').replace(/\*\*/g, '').slice(0, 400), by: provider });
      else if (!labs.length && (img.length || /x-?ray|radiolog|ct\b|results?/i.test(t))) ev.imaging.push({ id: `${ev.id}-im${ii}`, study: t, text: md.replace(/!\[\]\([^)]+\)/g, '').trim(), images: img });
      else if (!labs.length && /note/i.test(t)) ev.notes.push({ id: `${ev.id}-n${ii}`, type: t, author: provider, md: true, text: md });
      else if (!labs.length) ev.documents.push({ id: `${ev.id}-d${ii}`, title: t, md });
      // A single-order release titled like a medication (e.g., "Ceftriaxone 500 mg/100 mL q12h") also releases that med.
      const med = pendingMeds.find(x => !usedMeds.has(x.i) && t.toLowerCase().startsWith(x.m.name.toLowerCase().split(/[\s(]/)[0]));
      if (med) { usedMeds.add(med.i); ev.meds.push(medFrom(med.m, 100 + med.i, pid)); }
    });
    ['orders', 'meds', 'labs', 'imaging', 'notes', 'documents', 'vitals'].forEach(k => { if (!ev[k].length) delete ev[k]; });
    ev.instructorNotes = (ev.instructorNotes || '').trim() || undefined;
    if (!ev.instructorNotes) delete ev.instructorNotes;
    if (Object.keys(ev).length > 2) p.events.push(ev);
  });
  // Starting orders repeated by a small single-order release (e.g., "Infuse 2 Units PRBC") are dropped.
  const later2 = p.events.filter(e => (e.orders || []).length <= 3).flatMap(e => (e.orders || []).map(o => o.text).concat((e.meds || []).map(m => m.name)));
  const kept = [];
  const laterBlood = p.events.some(e => (e.orders || []).some(o => o.cat === 'Blood Products'));
  p.orders.forEach(o => { if (later2.some(t => similar(o.text, t))) return; if (laterBlood && o.cat === 'Blood Products') return; if (kept.some(k => similar(k.text, o.text, true))) return; kept.push(o); });
  p.orders = kept;
  p.events.forEach(e => { if (e.orders) e.orders = e.orders.filter(o => !o.isMedOrder); if (e.orders && !e.orders.length) delete e.orders; });
  const left = pendingMeds.filter(x => !usedMeds.has(x.i));
  if (left.length) p.events.push({ id: `${p.id}-evmeds`, title: 'Additional medication orders', meds: left.map(x => medFrom(x.m, 100 + x.i, pid)) });
  if (!p.facultyGuide.length) delete p.facultyGuide;
  if (!p.documents.length) delete p.documents;
  if (!p.flags.length) delete p.flags;
  return p;
}

const out = Object.entries(PLAN).map(([pid, plan]) => convert(pid, plan));
const header = `/*
 * Patients imported from laurablasdel/ATU-Simulation-Hospital (built from the
 * Notion Level 1 and Level 2 charts) by tools/import-atu-sim-hospital.cjs.
 * Generated file — re-run the tool to refresh, then review. Edits here are
 * overwritten.
 */
window.SIM_PATIENTS = (window.SIM_PATIENTS || []).concat(`;
fs.writeFileSync(path.join(ROOT, 'js/data/patients-imported.js'), header + JSON.stringify(out, null, 1).replace(/"([a-zA-Z_][a-zA-Z0-9_]*)":/g, '$1:') + ');\n');
fs.mkdirSync(path.join(ROOT, 'assets/imported'), { recursive: true });
let bytes = 0;
[...assets].forEach(a => { const from = path.join(path.resolve(SRC), a.replace(/^\.\//, '')); if (fs.existsSync(from)) { fs.copyFileSync(from, path.join(ROOT, 'assets/imported', path.basename(a))); bytes += fs.statSync(from).size; } else console.warn('missing asset', a); });
console.log(`Imported ${out.length} patients; ${assets.size} assets (${Math.round(bytes / 1024)} KB).`);
out.forEach(p => console.log(` ${p.id}: ${p.orders.length} orders, ${p.meds.length} meds, ${p.vitals.length} vitals, ${p.labs.length} lab panels, ${p.imaging.length} imaging, ${p.notes.length} notes, ${(p.documents || []).length} documents, ${p.events.length} events`));
