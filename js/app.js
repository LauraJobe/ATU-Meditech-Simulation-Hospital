/* App shell: Expanse-style toolbar, folder tabs, patient side panel, routing. */
(function () {
  'use strict';
  const esc = U.esc;
  const C = window.EHR_CONFIG;

  // Folder tabs, in rows like the Expanse chart (bottom row sits on the page).
  const TAB_ROWS = [
    ['results', 'notes', 'assess', 'mar'],
    ['history', 'careplan', 'io', 'heparin', 'report'],
    ['summary', 'worklist', 'vitals', 'orders']
  ];
  const TABS = TAB_ROWS.flat();

  const ICON = {
    back: '<path d="M10 4 4 10l6 6M4 10h12"/>',
    home: '<path d="M3 10 10 3l7 7M5 8.5V17h4v-5h2v5h4V8.5"/>',
    workload: '<rect x="3" y="4" width="14" height="13" rx="1"/><path d="M3 8h14M7 2v4M13 2v4M6 11h2M9 11h2M12 11h2M6 14h2M9 14h2"/>',
    chart: '<path d="M3 5h5l2 2h7v10H3z"/>',
    document: '<path d="M5 2h7l4 4v12H5z"/><path d="M12 2v4h4M8 10h5M8 13h5"/>',
    orders: '<rect x="4" y="3" width="12" height="15" rx="1"/><path d="M8 3V2h4v1M7 8h6M7 11h6M7 14h4"/>',
    gear: '<circle cx="10" cy="10" r="2.5"/><path d="M10 2v2.5M10 15.5V18M2 10h2.5M15.5 10H18M4.3 4.3l1.8 1.8M13.9 13.9l1.8 1.8M4.3 15.7l1.8-1.8M13.9 6.1l1.8-1.8"/>',
    suspend: '<circle cx="10" cy="10" r="7"/><path d="M7.5 7.5l5 5M12.5 7.5l-5 5"/>'
  };
  const svg = name => `<svg viewBox="0 0 20 20" aria-hidden="true">${ICON[name]}</svg>`;
  const tool = (name, label, href, attrs) => `<a class="tb-btn" href="${href}" ${attrs || ''}>${svg(name)}<span>${esc(label)}</span></a>`;

  function route() {
    const parts = location.hash.replace(/^#\/?/, '').split('/');
    return { page: parts[0] || 'census', pid: parts[1], tab: parts[2] || 'summary' };
  }

  function toolbar(p) {
    const s = Store.session();
    const clock = p ? p.clock.now() : Date.now();
    const exp = Screens.experienceLabel(Screens.experience());
    return `<header class="toolbar">
      <div class="tb-group">
        ${tool('back', 'Return To', '#/census')}
        ${tool('home', 'Home', '#/census')}
        ${tool('workload', 'Workload', p ? `#/patient/${esc(p.id)}/worklist` : '#/census')}
      </div>
      ${p ? `<div class="tb-group tb-center">
        ${tool('chart', 'Chart', `#/patient/${esc(p.id)}/summary`)}
        ${tool('document', 'Document', `#/patient/${esc(p.id)}/notes`)}
        ${tool('orders', 'Orders', `#/patient/${esc(p.id)}/orders`)}
      </div>` : '<div class="tb-center tb-title">' + esc(C.hospitalName) + ' · ' + esc(C.systemName) + '</div>'}
      <div class="tb-group tb-right">
        <div class="tb-info"><div class="tb-clock">${p ? 'Sim ' : ''}<span id="clock">${U.fmtDT(clock)}</span></div>
          <div class="tb-user">${esc(s.name)}, ${esc(s.cred)} · ${esc(exp)}</div></div>
        ${tool('gear', 'Instructor', '#/instructor')}
        <a class="tb-btn" href="#" data-action="logout">${svg('suspend')}<span>Suspend</span></a>
      </div>
    </header>
    <div class="sim-strip">SIMULATION — FOR EDUCATIONAL USE ONLY · NOT A REAL MEDICAL RECORD</div>`;
  }

  function tabs(p, doc, tab) {
    const counts = {
      orders: Model.unackedOrders(p, doc).length,
      results: Model.unreviewedResults(p, doc).length,
      mar: (c => c.due + c.overdue)(Model.dueCounts(p, doc))
    };
    const rows = TAB_ROWS.map(r => r.filter(t => t !== 'heparin' || p.heparinFlowsheet));
    // Like Expanse, the row holding the active tab moves down next to the page.
    const activeRow = rows.findIndex(r => r.includes(tab));
    const ordered = rows.filter((_, i) => i !== activeRow).concat([rows[activeRow]]);
    return `<nav class="folder-tabs" aria-label="Chart sections">${ordered.map((r, i) => `<div class="tab-row" style="padding-left:${(ordered.length - 1 - i) * 18}px">
      ${r.map(t => `<a href="#/patient/${esc(p.id)}/${t}" class="ftab ${t === tab ? 'ftab-on' : ''}" ${t === tab ? 'aria-current="page"' : ''}>${esc(Views[t].label)}${counts[t] ? `<span class="count">${counts[t]}</span>` : ''}</a>`).join('')}
    </div>`).join('')}</nav>`;
  }

  function sidePanel(p) {
    const initials = (p.name.first[0] + p.name.last[0]).toUpperCase();
    const bmi = Model.bmi(p);
    const allergies = p.nkda || !(p.allergies || []).length
      ? '<p>No Known Drug Allergies</p>'
      : p.allergies.map(a => `<p class="al">${esc(a.agent)} <span class="muted">— ${esc(a.reaction)}${a.severity ? ', ' + esc(a.severity) : ''}</span></p>`).join('');
    const indicators = [
      `<span class="code ${p.codeStatus === 'DNR' ? 'code-dnr' : ''}">${esc(p.codeStatus)}</span>`,
      p.isolation && p.isolation !== 'None' && p.isolation !== 'Standard' ? `<p>Isolation: ${esc(p.isolation)}</p>` : '',
      ...(p.flags || []).map(f => `<p>${esc(f)}</p>`)
    ].join('');
    const problems = [p.admitDx, ...(p.pmh || [])].map(x => `<p>${esc(x)}</p>`).join('');
    return `<aside class="side" aria-label="Patient">
      <div class="side-id">
        <div class="avatar" aria-hidden="true">${esc(initials)}</div>
        <div><div class="side-name">${esc(p.name.last)},${esc(p.name.first)}</div>
          <div>${esc(p.age.replace(' years', ''))}, ${esc(p.sex)} — ${esc(U.fmtDOB(p.dob))}</div>
          <div>MRN# ${esc(p.mrn)}</div></div>
      </div>
      <div class="side-facts">
        <div>${esc(p.unit)}${p.room && p.room !== '—' ? ' · ' + esc(p.room) : ''}</div>
        <div>${p.heightCm ? esc(p.heightCm) + ' cm' : 'Ht —'} · ${p.weightKg ? esc(p.weightKg) + ' kg' : 'Wt —'}${bmi ? ' · BMI ' + bmi : ''}</div>
        <div>Admit: ${esc(U.fmtDate(p.admitTime))} · ${esc(p.attending)}</div>
      </div>
      <details class="side-sec" open><summary>Special Indicators</summary>${indicators}</details>
      <details class="side-sec" open><summary>Allergies</summary>${allergies}</details>
      <details class="side-sec" open><summary>Problems</summary>${problems}</details>
    </aside>`;
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
        app.innerHTML = `${toolbar(p)}<div class="chart">
          <div class="chart-main">${tabs(p, doc, tab)}
            <main class="content" id="content"><div class="pane-head"><h1 class="view-title">${esc(view.label)}</h1></div>${view.render(p, doc)}</main>
          </div>${sidePanel(p)}</div>`;
        if (view.bind) view.bind(app.querySelector('#content'), p, doc);
        document.title = `${p.name.last}, ${p.name.first} — ${view.label} · ${C.systemName}`;
        if (App._lastKey === location.hash) window.scrollTo(0, scroll);
      } else if (r.page === 'instructor') {
        if (!Store.instructorUnlocked()) {
          location.hash = '#/census';
          Screens.unlock(() => { location.hash = '#/instructor'; });
          return;
        }
        app.innerHTML = toolbar(null) + `<main class="content solo">${Screens.instructor.render()}</main>`;
        Screens.instructor.bind(app);
        document.title = `Instructor Tools · ${C.systemName}`;
      } else {
        app.innerHTML = toolbar(null) + `<main class="content solo">${Screens.census.render()}</main>`;
        Screens.census.bind(app);
        document.title = `Census · ${C.hospitalName}`;
      }
      App._lastKey = location.hash;
      app.querySelector('[data-action="logout"]').addEventListener('click', e => {
        e.preventDefault();
        UI.confirm('Suspend session', 'Sign out of the simulation EHR? Your documentation stays saved on this computer.', () => {
          Store.clearSession(); Store.setInstructor(false); location.hash = '#/'; App.render();
        }, 'Sign Out');
      });
    }
  };

  window.App = App;
  window.addEventListener('hashchange', () => App.render());
  // Keep the clock current; refresh due/overdue colors each minute.
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
