#!/usr/bin/env node

const { spawn } = require('child_process');
const path = require('path');
const which = require('which');

const binaryName = process.platform === 'win32' ? 'cv-gh.exe' : 'cv-gh';

async function main() {
  try {
    const binary = which.sync(binaryName) || path.join(process.cwd(), 'node_modules', '.bin', binaryName);

    const child = spawn(binary, process.argv.slice(2), {
      stdio: 'inherit',
      shell: false
    });

    child.on('close', (code) => process.exit(code || 0));
  } catch (err) {
    console.error('\x1b[31mError: cv-gh binary not found.\x1b[0m');
    console.error('Please install Rust version first: cargo install cv-gh');
    process.exit(1);
  }
}

main();