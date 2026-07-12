#!/usr/bin/env node

const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const binaryName = process.platform === 'win32' ? 'cv-gh.exe' : 'cv-gh';

function findBinary() {
  const bundled = path.join(__dirname, 'bin', binaryName);
  if (fs.existsSync(bundled)) return bundled;
  const pathEntries = (process.env.PATH || '').split(path.delimiter);
  for (const entry of pathEntries) {
    const candidate = path.join(entry, binaryName);
    if (fs.existsSync(candidate)) return candidate;
  }
  return null;
}

function main() {
  const binary = findBinary();
  if (!binary) {
    console.error(`cv-gh binary not found for ${process.platform}-${process.arch}.`);
    console.error('Reinstall the package or install the Rust binary with `cargo install cv-gh`.');
    process.exitCode = 1;
    return;
  }
  const child = spawn(binary, process.argv.slice(2), { stdio: 'inherit', shell: false });
  child.on('error', (error) => {
    console.error(`Unable to start cv-gh: ${error.message}`);
    process.exitCode = 1;
  });
  child.on('close', (code, signal) => {
    if (signal) process.exitCode = 1;
    else process.exitCode = code ?? 1;
  });
}

if (require.main === module) main();

module.exports = { findBinary, binaryName };
