#!/usr/bin/env node
/**
 * Pre-process markdown to embed images as base64 data URIs
 * Usage: node embed-images-markdown.js <input.md> <output.md>
 *
 * SVGs used as marp `![bg ...]` backgrounds are converted to inline HTML <img>
 * blocks, because marp does not support image/svg+xml data URIs in bg directives
 * but does pass through inline HTML. This preserves SVG animations.
 *
 * All other images are embedded as base64 data URIs normally.
 */

const fs = require('fs');
const path = require('path');

const [,, inputFile, outputFile] = process.argv;

if (!inputFile || !outputFile) {
  console.error('Usage: node embed-images-markdown.js <input.md> <output.md>');
  process.exit(1);
}

let markdown = fs.readFileSync(inputFile, 'utf8');

const imageRegex = /!\[([^\]]*)\]\((\/images\/[^)]+)\)/g;

const replacements = [];
let match;
while ((match = imageRegex.exec(markdown)) !== null) {
  const [fullMatch, altText, imgPath] = match;
  replacements.push({ fullMatch, altText, imgPath });
}

console.log(`Found ${replacements.length} image references`);

for (const { fullMatch, altText, imgPath } of replacements) {
  const filePath = path.join(__dirname, '..', 'public', imgPath);

  try {
    const imageBuffer = fs.readFileSync(filePath);
    const ext = path.extname(filePath).slice(1).toLowerCase();
    const isSvg = ext === 'svg';

    // Parse marp bg directive: "bg [right[:pct%]] [contain|cover]"
    const bgMatch = altText.match(/^bg(?:\s+right(?::(\d+)%)?)?\s*(contain|cover)?/);
    const isBgDirective = bgMatch !== null && altText.startsWith('bg');

    if (isSvg && isBgDirective) {
      // Marp doesn't support SVG data URIs in ![bg] directives, but does pass
      // through inline HTML. Emit an absolutely-positioned <img> that replicates
      // the bg right layout, preserving SMIL animations.
      const widthPct = bgMatch[1] ? parseInt(bgMatch[1]) : 50;
      const base64 = imageBuffer.toString('base64');
      const dataUri = `data:image/svg+xml;base64,${base64}`;
      const leftPct = 100 - widthPct;
      // Block-level HTML so marp's markdown parser treats it as HTML block, not inline.
      // <style scoped> constrains text to the left portion; the div places the SVG on the right.
      // This replicates marp's ![bg right:N%] layout while preserving SMIL animations.
      const html = [
        '',
        `<style scoped>section > *:not(div) { max-width: ${leftPct}%; }</style>`,
        `<div style="position:absolute;right:0;top:0;width:${widthPct}%;height:100%;display:flex;align-items:center;justify-content:center;overflow:hidden;">`,
        `<img src="${dataUri}" style="max-width:100%;max-height:100%;object-fit:contain;"/>`,
        `</div>`,
        '',
      ].join('\n');
      markdown = markdown.replace(fullMatch, () => html);
      console.log(`  ✓ Embedded ${imgPath} (SVG→HTML, ${widthPct}% right) (${Math.round(imageBuffer.length / 1024)}KB)`);
    } else {
      const mimeType = {
        'jpg': 'image/jpeg',
        'jpeg': 'image/jpeg',
        'png': 'image/png',
        'gif': 'image/gif',
        'svg': 'image/svg+xml',
        'webp': 'image/webp'
      }[ext] || 'application/octet-stream';

      const base64 = imageBuffer.toString('base64');
      const dataUri = `data:${mimeType};base64,${base64}`;
      // Use a function to avoid `$` in base64 being interpreted as special
      // replacement patterns by String.replace
      markdown = markdown.replace(fullMatch, () => `![${altText}](${dataUri})`);
      console.log(`  ✓ Embedded ${imgPath} (${Math.round(imageBuffer.length / 1024)}KB)`);
    }
  } catch (err) {
    console.error(`  ✗ Failed to embed ${imgPath}: ${err.message}`);
  }
}

fs.writeFileSync(outputFile, markdown, 'utf8');
console.log(`\nWrote embedded markdown to ${outputFile}`);
