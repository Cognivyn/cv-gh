#!/usr/bin/env node

const fs = require('fs');
const https = require('https');
const os = require('os');
const path = require('path');
const { spawnSync } = require('child_process');

const packageJson = require('./package.json');
const target = process.platform === 'win32' ? 'cv-gh.exe' : 'cv-gh';
const targetPath = path.join(__dirname, 'bin', target);
const version = process.env.CV_GH_VERSION || `v${packageJson.version}`;
const platform = {
  'linux-x64': 'linux-x86_64',
  'darwin-arm64': 'darwin-aarch64',
  'win32-x64': 'windows-x86_64',
}[`${process.platform}-${process.arch}`];
const artifact = platform ? `cv-gh-${platform}.tar.gz` : null;
const url = artifact && `https://github.com/Cognivyn/cv-gh/releases/download/${version}/${artifact}`;

if (process.env.CV_GH_SKIP_INSTALL === '1' || fs.existsSync(targetPath)) process.exit(0);
if (process.env.CV_GH_BINARY_PATH) {
  fs.mkdirSync(path.dirname(targetPath), { recursive: true });
  fs.copyFileSync(process.env.CV_GH_BINARY_PATH, targetPath);
  if (process.platform !== 'win32') fs.chmodSync(targetPath, 0o755);
  process.exit(0);
}
if (!artifact) {
  console.warn(`No prebuilt cv-gh binary is available for ${process.platform}-${process.arch}. Install it with Cargo.`);
  process.exit(0);
}

fs.mkdirSync(path.dirname(targetPath), { recursive: true });
const archive = path.join(os.tmpdir(), `cv-gh-${process.pid}.tar.gz`);
const file = fs.createWriteStream(archive);
https.get(url, (response) => {
  if (response.statusCode !== 200) {
    response.resume();
    file.close();
    fs.rmSync(archive, { force: true });
    console.warn(`Could not download ${url} (HTTP ${response.statusCode}). Install the Rust binary manually.`);
    return;
  }
  response.pipe(file);
  file.on('finish', () => {
    file.close();
    const extractionDirectory = fs.mkdtempSync(path.join(os.tmpdir(), 'cv-gh-extract-'));
    const result = spawnSync('tar', ['-xzf', archive, '-C', extractionDirectory], { stdio: 'inherit' });
    fs.rmSync(archive, { force: true });
    const extracted = path.join(extractionDirectory, target);
    if (result.status !== 0 || !fs.existsSync(extracted)) {
      console.warn('Could not extract the cv-gh binary. Install the Rust binary manually.');
    } else {
      fs.renameSync(extracted, targetPath);
      if (process.platform !== 'win32') fs.chmodSync(targetPath, 0o755);
    }
    fs.rmSync(extractionDirectory, { recursive: true, force: true });
  });
}).on('error', (error) => {
  file.close();
  fs.rmSync(archive, { force: true });
  console.warn(`Could not download cv-gh: ${error.message}`);
});
