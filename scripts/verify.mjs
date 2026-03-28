const BASE = 'https://share2chatgpt.franzai.com';
let errors = 0;

function check(condition, msg) {
  if (!condition) {
    console.error(`  FAIL: ${msg}`);
    errors++;
  } else {
    console.log(`  OK: ${msg}`);
  }
}

console.log('Verifying live deployment...\n');

try {
  console.log('Checking landing page...');
  const page = await fetch(BASE + '/');
  check(page.ok, `${BASE}/ returns ${page.status}`);
  const html = await page.text();
  check(html.includes('share2chatgpt'), 'landing page has share2chatgpt content');
  check(html.includes('og:image'), 'landing page has OG tags');

  console.log('\nChecking widget JS...');
  const js = await fetch(BASE + '/share2chatgpt.js');
  check(js.ok, `share2chatgpt.js returns ${js.status}`);
  const jsText = await js.text();
  check(jsText.startsWith('(function()'), 'JS starts with IIFE');
  check(jsText.includes('Share2ChatGPT'), 'JS exposes Share2ChatGPT');

  console.log('\nChecking redirect page...');
  const redir = await fetch(BASE + '/go/?url=https://share2chatgpt.franzai.com', { redirect: 'manual' });
  check(redir.status === 200 || redir.status === 301 || redir.status === 302, `redirect page returns ${redir.status}`);

  console.log('\nChecking OG image...');
  const og = await fetch(BASE + '/og-image.png', { method: 'HEAD' });
  check(og.ok, `og-image.png returns ${og.status}`);
  const contentType = og.headers.get('content-type') || '';
  check(contentType.includes('image'), `content-type is ${contentType}`);

  console.log('\nChecking jsDelivr CDN...');
  const cdn = await fetch('https://cdn.jsdelivr.net/gh/franzenzenhofer/share2chatgpt@latest/share2chatgpt.js', { method: 'HEAD' });
  check(cdn.ok, `jsDelivr CDN returns ${cdn.status}`);

} catch (e) {
  console.error(`  FAIL: Network error — ${e.message}`);
  errors++;
}

console.log(`\n${errors === 0 ? 'ALL LIVE CHECKS PASSED' : `${errors} LIVE CHECK(S) FAILED`}`);
process.exit(errors > 0 ? 1 : 0);
