# @cognivyn/cv-gh

This package installs the `cv-gh` command and downloads the matching release binary during installation.

```sh
npm install -g @cognivyn/cv-gh
cv-gh --help
```

Set `CV_GH_VERSION` to install a specific release. Set `CV_GH_SKIP_INSTALL=1` when the binary is already available on `PATH`. For local development, `CV_GH_BINARY_PATH=/path/to/cv-gh npm install` copies a locally built binary into the package.
