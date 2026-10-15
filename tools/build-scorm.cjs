#!/usr/bin/env node
/*
 * Build the EMR Orientation SCORM 1.2 package for Blackboard (or any SCORM LMS).
 *
 *   node tools/build-scorm.cjs
 *
 * Copies orientation.html (as index.html) and only the files it loads — no simulation patients —
 * writes imsmanifest.xml, and zips everything to scorm/EMR-Orientation-SCORM12.zip.
 * Rebuild and re-upload the zip after changing the orientation.
 */
'use strict';
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const ROOT = path.resolve(__dirname, '..');
const OUT_DIR = path.join(ROOT, 'scorm');
const STAGE = path.join(OUT_DIR, 'package');
const ZIP = path.join(OUT_DIR, 'EMR-Orientation-SCORM12.zip');
const TITLE = 'EMR Orientation — ATU Simulation Hospital';

const html = fs.readFileSync(path.join(ROOT, 'orientation.html'), 'utf8');
// Local scripts and stylesheets the page loads (CDN files load from the internet as usual).
const refs = [...html.matchAll(/(?:src|href)="((?:js|css)\/[^"?]+)(?:\?[^"]*)?"/g)].map(m => m[1]);
const files = ['index.html', ...new Set(refs)];

fs.rmSync(STAGE, { recursive: true, force: true });
fs.mkdirSync(STAGE, { recursive: true });
fs.writeFileSync(path.join(STAGE, 'index.html'), html);
refs.forEach(f => {
  const src = path.join(ROOT, f);
  if (!fs.existsSync(src)) throw new Error('Missing file referenced by orientation.html: ' + f);
  fs.mkdirSync(path.dirname(path.join(STAGE, f)), { recursive: true });
  fs.copyFileSync(src, path.join(STAGE, f));
});

const esc = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');
const manifest = `<?xml version="1.0" encoding="UTF-8"?>
<manifest identifier="ATU_EMR_ORIENTATION" version="1.0"
  xmlns="http://www.imsproject.org/xsd/imscp_rootv1p1p2"
  xmlns:adlcp="http://www.adlnet.org/xsd/adlcp_rootv1p2"
  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
  xsi:schemaLocation="http://www.imsproject.org/xsd/imscp_rootv1p1p2 imscp_rootv1p1p2.xsd http://www.imsglobal.org/xsd/imsmd_rootv1p2p1 imsmd_rootv1p2p1.xsd http://www.adlnet.org/xsd/adlcp_rootv1p2 adlcp_rootv1p2.xsd">
  <metadata>
    <schema>ADL SCORM</schema>
    <schemaversion>1.2</schemaversion>
  </metadata>
  <organizations default="ATU_ORG">
    <organization identifier="ATU_ORG">
      <title>${esc(TITLE)}</title>
      <item identifier="ATU_ITEM" identifierref="ATU_RES" isvisible="true">
        <title>${esc(TITLE)}</title>
      </item>
    </organization>
  </organizations>
  <resources>
    <resource identifier="ATU_RES" type="webcontent" adlcp:scormtype="sco" href="index.html">
${files.map(f => `      <file href="${esc(f)}"/>`).join('\n')}
    </resource>
  </resources>
</manifest>
`;
fs.writeFileSync(path.join(STAGE, 'imsmanifest.xml'), manifest);

fs.rmSync(ZIP, { force: true });
execFileSync('zip', ['-q', '-r', '-X', ZIP, '.'], { cwd: STAGE });
fs.rmSync(STAGE, { recursive: true, force: true });
console.log(`Built ${path.relative(ROOT, ZIP)} (${files.length} files, ${(fs.statSync(ZIP).size / 1024).toFixed(0)} KB)`);
