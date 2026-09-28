/* Small helpers shared by every screen. */
(function () {
  'use strict';
  const pad = n => String(n).padStart(2, '0');
  const ESC = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };

  const U = {
    pad,
    esc: s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ESC[c]),
    nl2br: s => U.esc(s).replace(/\n/g, '<br>'),
    uid: () => Date.now().toString(36) + Math.random().toString(36).slice(2, 7),

    fmtDate(t) { const d = new Date(t); return `${pad(d.getMonth() + 1)}/${pad(d.getDate())}/${d.getFullYear()}`; },
    fmtTime(t) { const d = new Date(t); return pad(d.getHours()) + pad(d.getMinutes()); },
    fmtDT(t) { return U.fmtDate(t) + ' ' + U.fmtTime(t); },
    fmtDOB(iso) { const [y, m, d] = iso.split('-'); return `${m}/${d}/${y}`; },

    // Value for <input type="datetime-local">
    toInput(t) {
      const d = new Date(t);
      return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
    },
    fromInput(s) { const t = new Date(s).getTime(); return isNaN(t) ? null : t; },

    num(v) { if (v === '' || v == null) return null; const n = Number(v); return isNaN(n) ? null : n; },
    isEmpty: v => v == null || v === '' || (Array.isArray(v) && v.length === 0),

    // Collects named inputs of a form into an object. Checkbox groups become arrays.
    formValues(root) {
      const out = {};
      root.querySelectorAll('input[name], select[name], textarea[name]').forEach(el => {
        if (el.disabled) return;
        if (el.type === 'checkbox') {
          if (el.dataset.single) { out[el.name] = el.checked; return; }
          if (!Array.isArray(out[el.name])) out[el.name] = [];
          if (el.checked) out[el.name].push(el.value);
        } else if (el.type === 'radio') {
          if (el.checked) out[el.name] = el.value;
          else if (!(el.name in out)) out[el.name] = '';
        } else {
          out[el.name] = el.value.trim();
        }
      });
      return out;
    },

    download(filename, text, type) {
      const blob = new Blob([text], { type: type || 'application/json' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 0);
    },

    initials(name) {
      return String(name || '').split(/\s+/).filter(Boolean).map(w => w[0].toUpperCase()).join('');
    }
  };

  window.U = U;
})();
