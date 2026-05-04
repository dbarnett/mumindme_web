#!/usr/bin/env node
// Expands source SVGs from src/svg/ into public/images/, patching animation phases.
//
// For each <!-- @phase phase=Xs --> comment immediately before a <use href="#id" .../>
// on the same line, clones the referenced <symbol> content inline and sets all begin=
// attributes to the specified phase.
//
// SVGs with no @phase annotations are copied through unchanged.
//
// Usage:
//   node scripts/expand-svg-phases.cjs                  # process all src/svg/**/*.svg
//   node scripts/expand-svg-phases.cjs src/svg/foo.svg  # single file

'use strict';
const fs = require('fs');
const path = require('path');

const SRC_DIR = path.resolve(__dirname, '../src/svg');
const OUT_DIR = path.resolve(__dirname, '../public/images');

function findSvgs(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  return entries.flatMap(e =>
    e.isDirectory() ? findSvgs(path.join(dir, e.name))
                    : e.name.endsWith('.svg') ? [path.join(dir, e.name)] : []
  );
}

function expand(src) {
  const symbolRe = /<symbol\s+id="([^"]+)"([^>]*)>([\s\S]*?)<\/symbol>/g;
  const symbols = {};
  let m;
  while ((m = symbolRe.exec(src)) !== null) {
    symbols[m[1]] = m[3];
  }

  // Expand a symbol body, recursively inlining any nested <use href="#id"/> references.
  function expandBody(body, phase) {
    const nested = body.replace(/<use\s+href="#([^"]+)"([^\/]*?)\/>/g, (m, id, attrs) => {
      const nb = symbols[id];
      if (!nb) return m;
      return `<g${attrs.trim() ? ' ' + attrs.trim() : ''}>${expandBody(nb, phase)}</g>`;
    });
    return nested.replace(/\bbegin="[^"]*"/g, `begin="${phase}"`);
  }

  const useRe = /<!--\s*@phase\s+phase=([\d.]+s)\s*-->\s*<use\s+href="#([^"]+)"([^\/]*?)\/>/g;
  return src.replace(useRe, (match, phase, symbolId, useAttrs) => {
    const body = symbols[symbolId];
    if (!body) {
      process.stderr.write(`Warning: symbol #${symbolId} not found, leaving <use> unchanged\n`);
      return match;
    }
    const gAttrs = useAttrs.trim();
    return `<g${gAttrs ? ' ' + gAttrs : ''}>${expandBody(body, phase)}</g>`;
  });
}

const inputs = process.argv[2]
  ? [path.resolve(process.argv[2])]
  : findSvgs(SRC_DIR);

for (const inFile of inputs) {
  const rel = path.relative(SRC_DIR, inFile);
  const outFile = path.join(OUT_DIR, rel);
  fs.mkdirSync(path.dirname(outFile), { recursive: true });
  const raw = fs.readFileSync(inFile, 'utf8');
  fs.writeFileSync(outFile, expand(raw), 'utf8');
  console.log(`  ${rel} → public/images/${rel}`);
}
