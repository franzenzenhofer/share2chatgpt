import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
let errors = 0;

function check(condition, msg) {
  if (!condition) {
    console.error(`  FAIL: ${msg}`);
    errors++;
  } else {
    console.log(`  OK: ${msg}`);
  }
}

function fileExists(rel) {
  return fs.existsSync(path.join(root, rel));
}

function fileContains(rel, needle) {
  if (!fileExists(rel)) return false;
  return fs.readFileSync(path.join(root, rel), 'utf8').includes(needle);
}

console.log('Checking source files...');
check(fileExists('share2chatgpt.js'), 'share2chatgpt.js exists');
check(fileExists('index.html'), 'index.html exists');
check(fileExists('go/index.html'), 'go/index.html exists');
check(fileExists('og-image.png'), 'og-image.png exists');
check(fileExists('LICENSE'), 'LICENSE exists');
check(fileExists('README.md'), 'README.md exists');
check(fileExists('scripts/prepare-dist.mjs'), 'build script exists');

console.log('\nChecking widget JS...');
const js = fs.readFileSync(path.join(root, 'share2chatgpt.js'), 'utf8');
check(js.startsWith('(function()'), 'JS is an IIFE');
check(js.includes('Share2ChatGPT'), 'exposes Share2ChatGPT global');
check(js.includes('data-share2chatgpt'), 'scans for data-share2chatgpt');
check(js.includes('chatgpt.com'), 'targets chatgpt.com');
check(!js.includes('innerHTML'), 'no innerHTML (XSS safe)');
check(js.includes("'use strict'"), 'strict mode enabled');

console.log('\nChecking index.html...');
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
check(html.includes('og:image'), 'has OG image meta');
check(html.includes('og:title'), 'has OG title meta');
check(html.includes('twitter:card'), 'has Twitter card meta');
check(html.includes('share2chatgpt.franzai.com'), 'uses franzai.com domain');
check(html.includes('data-share2chatgpt'), 'has demo buttons');
check(html.includes('configurator'), 'has configurator');
check(
  html.includes('cdn.jsdelivr.net') || html.includes('share2chatgpt.franzai.com/share2chatgpt.js'),
  'embed code references widget JS URL'
);

console.log('\nChecking redirect page...');
const redir = fs.readFileSync(path.join(root, 'go/index.html'), 'utf8');
check(redir.includes('noindex'), 'redirect page is noindex');
check(redir.includes('location.replace'), 'uses location.replace (no history)');

console.log('\nChecking for broken internal links...');
const htmlLinks = html.match(/href="[^"]*"/g) || [];
const localLinks = htmlLinks
  .map(h => h.slice(6, -1))
  .filter(h => h.startsWith('#') || (h.startsWith('/') && !h.startsWith('//')));
localLinks.forEach(link => {
  if (link.startsWith('#')) {
    const id = link.slice(1);
    check(html.includes(`id="${id}"`), `anchor #${id} target exists`);
  }
});

console.log(`\n${errors === 0 ? 'ALL CHECKS PASSED' : `${errors} CHECK(S) FAILED`}`);
process.exit(errors > 0 ? 1 : 0);
