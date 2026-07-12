const assert = require('node:assert/strict');
const test = require('node:test');

const { maxRedirects, resolveRedirect } = require('./install');

test('resolves HTTPS release redirects', () => {
  assert.equal(
    resolveRedirect(
      'https://github.com/Cognivyn/cv-gh/releases/download/v0.1.0/cv-gh-linux-x86_64.tar.gz',
      'https://objects.githubusercontent.com/download/cv-gh.tar.gz',
      0,
    ),
    'https://objects.githubusercontent.com/download/cv-gh.tar.gz',
  );
});

test('rejects insecure redirects', () => {
  assert.throws(
    () => resolveRedirect('https://github.com/Cognivyn/cv-gh/releases/download/v0.1.0/file', 'http://example.com/file', 0),
    /non-HTTPS redirect/,
  );
});

test('limits redirect depth', () => {
  assert.throws(
    () => resolveRedirect('https://github.com/Cognivyn/cv-gh/releases/download/v0.1.0/file', '/next', maxRedirects),
    /too many redirects/,
  );
});
