# Usage guide

## Choose an installation method

### Install from npm

Use this for normal command-line use after a GitHub release has been published:

```sh
npm install --global @cognivyn/cv-gh
cv-gh --version
cv-gh --help
```

The package downloads the release binary for the current platform during `npm install`. To select a release explicitly:

```sh
CV_GH_VERSION=v0.1.0 npm install --global @cognivyn/cv-gh
```

If a binary is already installed on `PATH`, skip the download:

```sh
CV_GH_SKIP_INSTALL=1 npm install --global @cognivyn/cv-gh
```

### Install from Rust

Use this when developing the CLI or when a platform release artifact is unavailable:

```sh
cargo install --path packages/rust-core
cv-gh --version
```

## Start a repository

Run `init` from the repository you want to configure:

```sh
cd path/to/project
cv-gh init
cat .cv-gh.toml
```

To initialize another existing directory:

```sh
cv-gh init --path /path/to/project
```

`init` creates `.cv-gh.toml` only when it does not already exist. It does not overwrite configuration.

## Inspect repository state

```sh
cv-gh status
```

This prints the current branch and short Git status. Run it from inside a Git working tree.

## Check local prerequisites

```sh
cv-gh doctor
```

`doctor` checks whether Git is available and reports whether the `GITHUB_TOKEN` environment variable is configured. It never prints the token value. The `pr` and `release` commands use the GitHub CLI, so also verify it is installed:

```sh
gh --version
gh auth status
```

Authenticate once if needed:

```sh
gh auth login
```

## Create a pull request

From a branch with committed changes:

```sh
cv-gh status
git push --set-upstream origin HEAD
cv-gh pr --title "Add repository workflow" --body "Describe the change and validation."
```

Create a draft pull request with `--draft`:

```sh
cv-gh pr --title "Work in progress" --body "Remaining work is tracked in the PR." --draft
```

`cv-gh pr` delegates to `gh pr create`, so repository remotes, GitHub permissions, and any additional `gh` configuration apply.

## Create a release

Create and publish a GitHub release from an existing tag:

```sh
git tag v0.1.0
git push origin v0.1.0
cv-gh release v0.1.0 --title "cv-gh v0.1.0" --notes "Initial release."
```

The command delegates to `gh release create`. Ensure the tag exists and that your GitHub identity can create releases.

## Develop locally

From the repository root:

```sh
cargo fmt --all
cargo test --workspace
cargo clippy --workspace --all-targets --all-features -- -D warnings
cargo build --release -p cv-gh
```

Test the npm wrapper with a locally built binary:

```sh
cd packages/node-wrapper
CV_GH_BINARY_PATH=../../target/release/cv-gh npm install
node cli.js --help
npm test
```

Remove the generated local package binary and dependencies when finished:

```sh
rm -rf bin node_modules package-lock.json
```

## Troubleshooting

- **`cv-gh binary not found`:** reinstall the npm package, ensure the package postinstall completed, or install from Rust with `cargo install --path packages/rust-core`.
- **npm download returns an HTTP error:** verify that the package version has a matching GitHub release artifact for your OS and CPU architecture, or use the Rust installation path.
- **`gh` is required:** install GitHub CLI and run `gh auth login`; `GITHUB_TOKEN` alone is used for diagnostics and is not consumed by `pr` or `release`.
- **`git status` fails:** run `cv-gh status` inside a Git working tree and confirm Git is installed.
- **`init` cannot access a path:** provide an existing directory with `--path`; the command does not create parent directories.
