import fs from 'node:fs';
import path from 'node:path';

const rootDir = process.cwd();
const distDir = path.join(rootDir, 'dist');
const buildVersion = (
  process.env.BUILD_VERSION ||
  [
    process.env.GITHUB_RUN_NUMBER || Date.now(),
    process.env.GITHUB_RUN_ATTEMPT || '1',
    (process.env.GITHUB_SHA || 'local').slice(0, 7)
  ].join('-')
);

const buildLabel = [
  process.env.GITHUB_SHA ? process.env.GITHUB_SHA.slice(0, 7) : 'local',
  process.env.GITHUB_RUN_NUMBER ? `run ${process.env.GITHUB_RUN_NUMBER}` : 'manual'
].join(' · ');

const replacements = new Map([
  ['__BUILD_VERSION__', buildVersion],
  ['__BUILD_LABEL__', buildLabel]
]);

const filesToCopy = [
  'CNAME',
  'share2chatgpt.js',
  'og-image.png',
  'LICENSE',
  'README.md'
];

const filesToRender = [
  'index.html',
  path.join('go', 'index.html')
];

function ensureDir(dirPath) {
  fs.mkdirSync(dirPath, { recursive: true });
}

function replaceTokens(source) {
  let output = source;
  for (const [token, value] of replacements.entries()) {
    output = output.split(token).join(value);
  }
  return output;
}

function copyFile(relativePath) {
  const sourcePath = path.join(rootDir, relativePath);
  const targetPath = path.join(distDir, relativePath);
  fs.mkdirSync(path.dirname(targetPath), { recursive: true });
  fs.copyFileSync(sourcePath, targetPath);
}

function renderFile(relativePath) {
  const sourcePath = path.join(rootDir, relativePath);
  const targetPath = path.join(distDir, relativePath);
  fs.mkdirSync(path.dirname(targetPath), { recursive: true });
  const rendered = replaceTokens(fs.readFileSync(sourcePath, 'utf8'));
  fs.writeFileSync(targetPath, rendered);
}

ensureDir(distDir);
filesToCopy.forEach(copyFile);
filesToRender.forEach(renderFile);
fs.writeFileSync(path.join(distDir, '.nojekyll'), '');

console.log(`Prepared dist/ with build version ${buildVersion}`);
