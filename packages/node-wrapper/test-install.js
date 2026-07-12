const assert = require('assert');
const path = require('path');
const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');

const server = http.createServer((req, res) => {
  if (req.url === '/test/success') {
    res.writeHead(302, { Location: `http://localhost:${server.address().port}/test/target` });
    res.end();
  } else if (req.url === '/test/target') {
    res.writeHead(200);
    // write out a dummy empty gzip file so the tar command succeeds but extraction verification fails
    const emptyGzip = Buffer.from([0x1f, 0x8b, 0x08, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0xff, 0x03, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00]);
    res.end(emptyGzip);
  } else if (req.url === '/test/loop') {
    res.writeHead(302, { Location: `http://localhost:${server.address().port}/test/loop` });
    res.end();
  } else if (req.url === '/test/no-location') {
    res.writeHead(302);
    res.end();
  } else if (req.url === '/test/not-found') {
    res.writeHead(404);
    res.end();
  } else {
    res.writeHead(500);
    res.end();
  }
});

server.listen(0, async () => {
  const port = server.address().port;
  let installScript = fs.readFileSync(path.join(__dirname, 'install.js'), 'utf8');

  const testScriptPath = path.join(__dirname, 'install-test-runner.js');

  async function runTest(url, expectedWarnings, httpsCheckValue) {
    let script = installScript.replace("const https = require('https');", "const https = require('http');");
    script = script.replace(/const url = [^;]+;/, `const url = '${url}';`);
    script = script.replace(/process\.env\.CV_GH_SKIP_INSTALL === '1'/g, "false");

    if (httpsCheckValue === 'http') {
      script = script.replace("if (!location.startsWith('https://')) {", "if (!location.startsWith('http')) {");
    }

    fs.writeFileSync(testScriptPath, script);

    // Make sure temp extracted binary file doesn't exist
    const targetPath = path.join(__dirname, 'bin', process.platform === 'win32' ? 'cv-gh.exe' : 'cv-gh');
    if (fs.existsSync(targetPath)) fs.unlinkSync(targetPath);

    return new Promise((resolve, reject) => {
      const child = spawn('node', [testScriptPath], { env: { ...process.env, CV_GH_SKIP_INSTALL: '0', CV_GH_BINARY_PATH: '' } });

      let output = '';
      child.stdout.on('data', data => output += data.toString());
      child.stderr.on('data', data => output += data.toString());

      const timeoutId = setTimeout(() => {
        child.kill();
        reject(new Error(`Test for ${url} timed out!`));
      }, 5000);

      child.on('close', code => {
        clearTimeout(timeoutId);
        let matched = false;
        for (const warning of expectedWarnings) {
          if (output.includes(warning)) {
            matched = true;
            break;
          }
        }

        if (!matched && expectedWarnings.length > 0) {
          console.error(`Expected one of warnings: ${expectedWarnings.join(' OR ')}`);
          console.error(`Actual output:\n${output}`);
          reject(new Error("Test failed"));
        } else {
          resolve(output);
        }
      });
    });
  }

  try {
    console.log('Testing success redirect...');
    await runTest(`http://localhost:${port}/test/success`, ['Could not extract the cv-gh binary', 'tar: '], 'http');

    console.log('Testing missing location...');
    await runTest(`http://localhost:${port}/test/no-location`, ['Redirect with no Location header'], 'http');

    console.log('Testing redirect loop...');
    await runTest(`http://localhost:${port}/test/loop`, ['Too many redirects'], 'http');

    console.log('Testing not found...');
    await runTest(`http://localhost:${port}/test/not-found`, ['HTTP 404'], 'http');

    console.log('Testing non-HTTPS redirect check...');
    await runTest(`http://localhost:${port}/test/success`, ['Redirected to non-HTTPS URL'], 'https://');

    console.log('All tests passed!');
  } catch (err) {
    console.error(err);
    process.exitCode = 1;
  } finally {
    if (fs.existsSync(testScriptPath)) fs.unlinkSync(testScriptPath);
    server.close();
  }
});
