/* Runs every test file in tests/ and tests/regression/ against one local server. Exit code 1 if any fails. */
'use strict';
const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');
const { startServer } = require('./helpers.cjs');

(async () => {
  const srv = await startServer();
  const files = [
    ...fs.readdirSync(__dirname).filter(f => f.endsWith('.cjs') && !['helpers.cjs', 'run-all.cjs'].includes(f)).sort(),
    ...fs.readdirSync(path.join(__dirname, 'regression')).filter(f => f.endsWith('.cjs')).sort().map(f => 'regression/' + f)
  ];
  let failed = [];
  for (const f of files) {
    // Asynchronous, so this process's server keeps answering while the test runs.
    const r = await new Promise(resolve => {
      const c = spawn(process.execPath, [path.join(__dirname, f)], { env: Object.assign({}, process.env, { BASE_URL: srv.url }) });
      let out = '';
      c.stdout.on('data', d => { out += d; }); c.stderr.on('data', d => { out += d; });
      const t = setTimeout(() => { c.kill(); out += '\nError: timed out after 5 minutes'; }, 300000);
      c.on('close', status => { clearTimeout(t); resolve({ status, out }); });
    });
    const out = r.out;
    const pass = (out.match(/^PASS /gm) || []).length, fail = (out.match(/^FAIL /gm) || []).length;
    const bad = r.status !== 0 || fail > 0;
    console.log(`${bad ? '✗' : '✓'} ${f} — ${pass} passed${fail ? `, ${fail} failed` : ''}${r.status !== 0 && !fail ? ` (exit ${r.status})` : ''}`);
    if (bad) { failed.push(f); console.log(out.split('\n').filter(l => /^FAIL|Error|error/.test(l)).slice(0, 15).map(l => '    ' + l).join('\n')); }
  }
  srv.close();
  console.log(failed.length ? `\n${failed.length} test file(s) failed: ${failed.join(', ')}` : `\nAll ${files.length} test files passed.`);
  process.exit(failed.length ? 1 : 0);
})();
