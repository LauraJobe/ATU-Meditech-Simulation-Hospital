/* App shell: top bar, patient banner, chart navigation, and routing. */
(function () {
  'use strict';
  const esc = U.esc;
  const C = window.EHR_CONFIG;

  const TABS = ['summary', 'orders', 'mar', 'vitals', 'assess', 'io', 'notes', 'results', 'careplan', 'history', 'heparin', 'report'];
  const ICONS = { summary: '▦', orders: '✎', mar: '℞', vitals: '♥', assess: '☑', io: '⇅', notes: '✍', results: '⚗', careplan: '◎', history: '☰', heparin: '⧗', report: '⎙' };

  function route() {
    const parts = location.hash.replace(/^#\/?/, '').split('/');
    return { page: parts[0] || 'census', pid: parts[1], tab: parts[2] || 'summary' };
  }

  function topbar(p) {
    const s = Store.session();
    const clock = p ? p.clock.now() : Date.now();
    return `<header class="topbar">
      <a class="brand" href="#/census"><span class="logo-mark" aria-hidden="true">✚</span><span>${esc(C.hospitalName)}</span><span class="brand-sys">${esc(C.systemName)}</span></a>
      <nav class="top-nav">
        <a href="#/census">Census</a>
        <a href="#/instructor">Instructor</a>
      </nav>
      <div class="top-right">
        <span class="clock" title="${p ? 'Scenario time for this chart' : 'Current time'}">${p ? 'Sim ' : ''}<span id="clock">${U.fmtDT(clock)}</span></span>
        <span class="user">${esc(s.name)}, ${esc(s.cred)}</span>
        <button class="btn btn-sm btn-ghost" data-action="logout">Sign Out</button>
      </div>
    </header>
    <div class="sim-strip">SIMULATION — FOR EDUCATIONAL USE ONLY · NOT A REAL MEDICAL RECORD</div>`;
  }

  function banner(p) {
    const allergy = p.nkda || !(p.allergies || []).length
      ? '<span class="allergy nkda">NKDA</span>'
      : `<span class="allergy">ALLERGIES: ${p.allergies.map(a => `${esc(a.agent)} (${esc(a.reaction)})`).join(', ')}</span>`;
    return `<section class="banner" aria-label="Patient banner">
      <div class="banner-name">
        <div class="pt-name">${esc(p.name.last.toUpperCase())}, ${esc(p.name.first)}</div>
        <div class="pt-sub">${esc(p.age)} · ${esc(p.sex)} · DOB ${esc(U.fmtDOB(p.dob))}</div>
      </div>
      <dl class="banner-grid">
        <div><dt>MRN</dt><dd>${esc(p.mrn)}</dd></div>
        <div><dt>Location</dt><dd>${esc(p.unit)}${p.room && p.room !== '—' ? ' · ' + esc(p.room) : ''}</dd></div>
        <div><dt>Attending</dt><dd>${esc(p.attending)}</dd></div>
        <div><dt>Admitted</dt><dd>${esc(U.fmtDate(p.admitTime))}</dd></div>
        <div><dt>Ht / Wt</dt><dd>${p.heightCm ? esc(p.heightCm) + ' cm' : '—'} / ${p.weightKg ? esc(p.weightKg) + ' kg' : '—'}</dd></div>
        <div><dt>Isolation</dt><dd>${esc(p.isolation || 'None')}</dd></div>
      </dl>
      <div class="banner-flags">
        ${allergy}
        <span class="code ${p.codeStatus === 'DNR' ? 'code-dnr' : ''}">${esc(p.codeStatus)}</span>
        ${(p.flags || []).map(f => `<span class="pflag">${esc(f)}</span>`).join('')}
      </div>
    </section>`;
  }

  function sidenav(p, doc, tab) {
    const tabs = TABS.filter(t => t !== 'heparin' || p.heparinFlowsheet);
    const counts = {
      orders: Model.unackedOrders(p, doc).length,
      results: Model.unreviewedResults(p, doc).length,
      mar: (c => c.due + c.overdue)(Model.dueCounts(p, doc))
    };
    return `<nav class="sidenav" aria-label="Chart sections">
      <a class="side-back" href="#/census">‹ Census</a>
      ${tabs.map(t => `<a href="#/patient/${esc(p.id)}/${t}" class="${t === tab ? 'active' : ''}" ${t === tab ? 'aria-current="page"' : ''}>
        <span class="ico" aria-hidden="true">${ICONS[t]}</span><span>${esc(Views[t].label)}</span>${counts[t] ? `<span class="count">${counts[t]}</span>` : ''}</a>`).join('')}
    </nav>`;
  }

  const App = {
    current: null,
    render() {
      const app = document.getElementById('app');
      const r = route();
      const s = Store.session();
      App.current = null;
      if (!s) {
        app.innerHTML = Screens.login.render();
        Screens.login.bind(app);
        return;
      }
      if (r.page === 'patient' && r.pid) {
        const p = Model.get(r.pid);
        if (!p) { location.hash = '#/census'; return; }
        const tab = TABS.includes(r.tab) && (r.tab !== 'heparin' || p.heparinFlowsheet) ? r.tab : 'summary';
        const doc = Store.doc(p.id);
        const view = Views[tab];
        App.current = p;
        const scroll = window.scrollY;
        app.innerHTML = `${topbar(p)}${banner(p)}<div class="shell">${sidenav(p, doc, tab)}
          <main class="content" id="content"><h1 class="view-title">${esc(view.label)}</h1>${view.render(p, doc)}</main></div>`;
        if (view.bind) view.bind(app.querySelector('#content'), p, doc);
        document.title = `${p.name.last}, ${p.name.first} — ${view.label} · ${C.systemName}`;
        if (App._lastKey === location.hash) window.scrollTo(0, scroll);
      } else if (r.page === 'instructor') {
        if (!Store.instructorUnlocked()) {
          location.hash = '#/census';
          Screens.unlock(() => { location.hash = '#/instructor'; });
          return;
        }
        app.innerHTML = topbar(null) + `<main class="content solo">${Screens.instructor.render()}</main>`;
        Screens.instructor.bind(app);
        document.title = `Instructor Tools · ${C.systemName}`;
      } else {
        app.innerHTML = topbar(null) + `<main class="content solo">${Screens.census.render()}</main>`;
        Screens.census.bind(app);
        document.title = `Census · ${C.hospitalName}`;
      }
      App._lastKey = location.hash;
      app.querySelector('[data-action="logout"]').addEventListener('click', () => {
        UI.confirm('Sign out', 'Sign out of the simulation EHR? Your documentation stays saved on this computer.', () => {
          Store.clearSession(); Store.setInstructor(false); location.hash = '#/'; App.render();
        }, 'Sign Out');
      });
    }
  };

  window.App = App;
  window.addEventListener('hashchange', () => App.render());
  // Keep the clock current; refresh MAR due/overdue colors each minute.
  let lastMinute = null;
  setInterval(() => {
    const el = document.getElementById('clock');
    const now = App.current ? App.current.clock.now() : Date.now();
    if (el) el.textContent = U.fmtDT(now);
    const m = Math.floor(now / 60000);
    if (lastMinute != null && m !== lastMinute && App.current && !document.querySelector('.modal-backdrop') && !(document.activeElement && document.activeElement.closest('form'))) App.render();
    lastMinute = m;
  }, 5000);
  // Sync if another tab (e.g., instructor window) changes storage.
  window.addEventListener('storage', () => { if (!document.querySelector('.modal-backdrop')) App.render(); });
  document.addEventListener('DOMContentLoaded', () => App.render());
})();
