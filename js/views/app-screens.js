/* Screens outside a chart: sign-in, census, instructor tools. */
(function () {
  'use strict';
  const esc = U.esc;
  const C = window.EHR_CONFIG;
  window.Screens = {};

  const allergyText = p => p.nkda || !(p.allergies || []).length ? 'NKDA' : p.allergies.map(a => a.agent).join(', ');

  Screens.experience = () => (Store.session() || {}).experience || 'all';
  Screens.experienceLabel = id => id === 'all' ? 'All Experiences' : ((C.experiences.find(x => x.id === id) || {}).label || id);

  /* ---------------- Sign in ---------------- */
  Screens.login = {
    render() {
      return `<div class="login-wrap">
        <form class="login-card" autocomplete="off">
          <div class="login-brand"><div class="logo-mark" aria-hidden="true">✚</div><div><div class="brand-1">${esc(C.hospitalName)}</div><div class="brand-2">${esc(C.systemName)} · Simulation Electronic Health Record</div></div></div>
          <div class="sim-warning">SIMULATION ONLY — Do not enter real patient information.</div>
          <label class="field"><span>Full name</span><input name="name" required autofocus placeholder="First Last"></label>
          <label class="field"><span>Role</span><select name="cred">
            <option value="SN">Student Nurse (SN)</option><option value="RN">Registered Nurse (RN)</option>
            <option value="Instructor">Instructor</option></select></label>
          <label class="field"><span>Simulation experience</span><select name="experience" required>
            <option value="">— Select your sim experience —</option>
            ${C.experiences.map(x => `<option value="${esc(x.id)}">${esc(x.label)}</option>`).join('')}
            <option value="all">All experiences (instructor)</option></select></label>
          <label class="field"><span>Clinical group / cohort (optional)</span><input name="group" placeholder="e.g., Level 3 — Group A"></label>
          <button class="btn btn-primary btn-block" type="submit">Sign In</button>
          <p class="muted small">Your name is attached to every entry as your electronic signature.</p>
        </form></div>`;
    },
    bind(root) {
      root.querySelector('form').addEventListener('submit', e => {
        e.preventDefault();
        const v = U.formValues(e.target);
        if (!v.name) return;
        if (!v.experience) { UI.formError(e.target, 'Choose your simulation experience.'); return; }
        Store.setSession({ name: v.name, cred: v.cred, group: v.group, experience: v.experience, signedIn: Date.now() });
        location.hash = '#/census';
        App.render();
      });
    }
  };

  /* ---------------- Census / status board ---------------- */
  let levelTab = null;
  Screens.census = {
    render() {
      const exp = Screens.experience();
      const pts = Model.allPatients().filter(p => exp === 'all' || (p.experiences || []).includes(exp));
      const levels = [1, 2, 3];
      if (levelTab == null) levelTab = pts.some(p => p.level === 3) ? 3 : (pts[0] && pts[0].level) || 3;
      const shown = pts.filter(p => (p.level || 3) === levelTab);
      const rows = shown.map(base => {
        const p = Model.get(base.id);
        const doc = Store.doc(p.id);
        const c = Model.dueCounts(p, doc);
        const newOrders = Model.unackedOrders(p, doc).length;
        const newRes = Model.unreviewedResults(p, doc).length;
        return `<tr class="census-row" data-open="${esc(p.id)}" tabindex="0">
          <td>${esc(p.unit)}${p.room && p.room !== '—' ? ' · ' + esc(p.room) : ''}</td>
          <td><strong>${esc(p.name.last)}, ${esc(p.name.first)}</strong>${p.flags && p.flags.some(f => /name alert/i.test(f)) ? ' ' + UI.badge('NAME ALERT', 'warn') : ''}<div class="muted small">MRN ${esc(p.mrn)} · DOB ${esc(U.fmtDOB(p.dob))}</div></td>
          <td>${esc(p.age)} ${esc(p.sex)}</td>
          <td>${esc(p.admitDx)}</td>
          <td>${esc(p.attending)}</td>
          <td class="${p.nkda || !(p.allergies || []).length ? '' : 'text-danger strong'}">${esc(allergyText(p))}</td>
          <td class="${p.codeStatus === 'DNR' ? 'text-danger strong' : ''}">${esc(p.codeStatus)}</td>
          <td class="nowrap">${c.overdue ? UI.badge(c.overdue + ' overdue', 'danger') : ''} ${c.due ? UI.badge(c.due + ' due', 'warn') : ''} ${newOrders ? UI.badge(newOrders + ' new order', 'new') : ''} ${newRes ? UI.badge(newRes + ' new result', 'new') : ''}</td>
        </tr>`;
      }).join('');
      return `<div class="page">
        <div class="page-head"><h1>Patient Census — ${esc(Screens.experienceLabel(exp))}</h1>
          <label class="inline">Sim experience: <select data-action="experience">
            ${C.experiences.map(x => `<option value="${esc(x.id)}" ${x.id === exp ? 'selected' : ''}>${esc(x.label)}</option>`).join('')}
            <option value="all" ${exp === 'all' ? 'selected' : ''}>All experiences</option></select></label>
          <div class="tabs">${levels.map(l => `<button class="tab ${l === levelTab ? 'tab-on' : ''}" data-level="${l}">Level ${l}</button>`).join('')}</div>
        </div>
        ${UI.panel(`Level ${levelTab} — ATU Simulation Hospital`, shown.length ? `<div class="scroll-x"><table class="grid census">
          <thead><tr><th>Location</th><th>Patient</th><th>Age/Sex</th><th>Diagnosis</th><th>Attending</th><th>Allergies</th><th>Code</th><th>Alerts</th></tr></thead>
          <tbody>${rows}</tbody></table></div>` : UI.empty(`No Level ${levelTab} patients have been added for ${Screens.experienceLabel(exp)} yet.`))}
        <p class="muted">Select a patient to open the chart. Always verify two identifiers (name and date of birth).</p>
      </div>`;
    },
    bind(root) {
      root.querySelector('[data-action="experience"]').addEventListener('change', e => {
        const sess = Store.session(); sess.experience = e.target.value; Store.setSession(sess); levelTab = null; App.render();
      });
      root.querySelectorAll('[data-level]').forEach(b => b.addEventListener('click', () => { levelTab = Number(b.dataset.level); App.render(); }));
      root.querySelectorAll('[data-open]').forEach(r => {
        const go = () => { location.hash = `#/patient/${r.dataset.open}/summary`; };
        r.addEventListener('click', go);
        r.addEventListener('keydown', e => { if (e.key === 'Enter') go(); });
      });
    }
  };

  /* ---------------- Instructor tools ---------------- */
  Screens.unlock = function (then) {
    if (Store.instructorUnlocked()) { then(); return; }
    UI.modal({
      title: 'Instructor Tools',
      body: '<label class="field"><span>Instructor PIN</span><input type="password" name="pin" autofocus inputmode="numeric"></label>',
      buttons: [{ label: 'Cancel' }, { label: 'Unlock', cls: 'btn-primary', onClick: api => {
        if (U.formValues(api.el).pin !== String(C.instructorPin)) { UI.formError(api.el.querySelector('.modal-body'), 'Incorrect PIN.'); return false; }
        Store.setInstructor(true);
        then();
      } }]
    });
  };

  Screens.instructor = {
    render() {
      const pts = Model.allPatients();
      const cards = pts.map(base => {
        const p = Model.get(base.id);
        const doc = Store.doc(p.id);
        const rel = Store.released(p.id);
        const count = Store.SECTIONS.reduce((n, s) => n + doc[s].length, 0);
        const custom = Store.customPatients().some(c => c.id === p.id);
        return `<section class="panel">
          <header class="panel-head"><h2>Level ${esc(p.level || 3)} · ${esc(p.name.last)}, ${esc(p.name.first)} <span class="muted">— ${esc(p.admitDx)} · ${esc((p.experiences || []).map(Screens.experienceLabel).join(', ') || 'No experience assigned')}</span></h2>
            <div class="panel-actions">
              <a class="btn btn-sm" href="#/patient/${esc(p.id)}/summary">Open Chart</a>
              <a class="btn btn-sm" href="#/patient/${esc(p.id)}/report">Chart Report</a>
              <button class="btn btn-sm" data-restart="${esc(p.id)}">Restart Clock</button>
              <button class="btn btn-sm btn-danger" data-reset="${esc(p.id)}">Reset Patient</button>
              ${custom ? `<button class="btn btn-sm btn-danger" data-delcustom="${esc(p.id)}">Remove Patient</button>` : ''}
            </div></header>
          <div class="panel-body">
            <p>Chart clock: <strong>${U.fmtDT(p.clock.now())}</strong> (scenario start ${esc(p.scenarioStart || '—')}) · ${count} student entr${count === 1 ? 'y' : 'ies'} · MRN barcode <code>${esc(p.mrn)}</code></p>
            ${p.labsPending ? `<p class="warn-box">${esc(p.labsPending)}</p>` : ''}
            ${(base.events || []).length ? `<h3>Scenario events</h3>${base.events.map(ev => `<div class="event ${rel[ev.id] ? 'event-on' : ''}">
                <div><strong>${esc(ev.title)}</strong>
                  <div class="muted small">${[(ev.orders || []).length && (ev.orders.length + ' order(s)'), (ev.meds || []).length && (ev.meds.length + ' med(s)'), (ev.labs || []).length && (ev.labs.length + ' result panel(s)')].filter(Boolean).join(' · ')}</div>
                  ${ev.instructorNotes ? `<details><summary>Instructor notes</summary><p>${esc(ev.instructorNotes)}</p></details>` : ''}</div>
                <div>${rel[ev.id] ? `<span class="badge badge-ok">Released ${U.fmtTime(p.clock.toSim(rel[ev.id]))}</span> <button class="btn btn-sm" data-unrelease="${esc(p.id)}|${esc(ev.id)}">Undo</button>`
                  : `<button class="btn btn-sm btn-primary" data-release="${esc(p.id)}|${esc(ev.id)}">Release Now</button>`}</div>
              </div>`).join('')}` : '<p class="muted">No scripted events for this patient.</p>'}
          </div></section>`;
      }).join('');

      return `<div class="page">
        <div class="page-head"><h1>Instructor Tools</h1><div>
          <a class="btn" href="labels.html" target="_blank" rel="noopener">Print Wristbands & Med Labels</a>
          <button class="btn" data-action="export">Export All Documentation</button>
          <label class="btn">Import Documentation<input type="file" accept=".json,application/json" data-action="import" hidden></label>
          <label class="btn">Add Patient (JSON)<input type="file" accept=".json,application/json" data-action="addpt" hidden></label>
          <button class="btn" data-action="lock">Lock</button>
        </div></div>
        <div class="alert alert-info">Documentation is saved in <strong>this browser only</strong>. Release events and export charting on the same workstation the student used. "Reset Patient" erases that patient's documentation and restarts the scenario.</div>
        ${cards}
      </div>`;
    },
    bind(root) {
      const pts = () => Model.allPatients().map(p => p.id);
      root.querySelectorAll('[data-release]').forEach(b => b.addEventListener('click', () => { const [pid, ev] = b.dataset.release.split('|'); Store.release(pid, ev); UI.toast('Event released to the chart.'); App.render(); }));
      root.querySelectorAll('[data-unrelease]').forEach(b => b.addEventListener('click', () => { const [pid, ev] = b.dataset.unrelease.split('|'); Store.unrelease(pid, ev); App.render(); }));
      root.querySelectorAll('[data-restart]').forEach(b => b.addEventListener('click', () => UI.confirm('Restart clock', 'Set this chart\'s clock back to the scenario start time? Existing documentation keeps its times.', () => { Store.restartScenario(b.dataset.restart); App.render(); }, 'Restart')));
      root.querySelectorAll('[data-reset]').forEach(b => b.addEventListener('click', () => UI.confirm('Reset patient', 'Erase ALL student documentation and released events for this patient? This cannot be undone. Export first if you need a copy.', () => { Store.resetPatient(b.dataset.reset); UI.toast('Patient reset.', 'warn'); App.render(); }, 'Erase & Reset')));
      root.querySelectorAll('[data-delcustom]').forEach(b => b.addEventListener('click', () => UI.confirm('Remove patient', 'Remove this imported patient from this browser?', () => { Store.deleteCustomPatient(b.dataset.delcustom); Store.resetPatient(b.dataset.delcustom); App.render(); }, 'Remove')));
      root.querySelector('[data-action="export"]').addEventListener('click', () =>
        U.download(`SimEHR_export_${new Date().toISOString().slice(0, 16).replace(/[:T]/g, '-')}.json`, JSON.stringify(Store.exportAll(pts()), null, 2)));
      root.querySelector('[data-action="lock"]').addEventListener('click', () => { Store.setInstructor(false); location.hash = '#/census'; });
      const readFile = (input, fn) => input.addEventListener('change', () => {
        const f = input.files[0]; if (!f) return;
        const r = new FileReader();
        r.onload = () => { try { fn(JSON.parse(r.result)); App.render(); } catch (err) { UI.toast(err.message, 'danger'); } input.value = ''; };
        r.readAsText(f);
      });
      readFile(root.querySelector('[data-action="import"]'), obj => { Store.importAll(obj); UI.toast('Documentation imported.'); });
      readFile(root.querySelector('[data-action="addpt"]'), obj => {
        const list = Array.isArray(obj) ? obj : [obj];
        list.forEach(pt => {
          if (!pt.id || !pt.name || !pt.mrn || !pt.dob) throw new Error('Patient JSON needs at least id, name, mrn, and dob.');
          if ((window.SIM_PATIENTS || []).some(x => x.id === pt.id)) throw new Error(`A built-in patient already uses id "${pt.id}".`);
          Store.saveCustomPatient(pt);
        });
        UI.toast(`${list.length} patient(s) added to this browser.`);
      });
    }
  };
})();
