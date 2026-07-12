# cv-gh

`cv-gh` is a cross-platform CLI for common GitHub and repository workflows.

## Install

With Rust:

```sh
cargo install --path packages/rust-core
```

With npm after a release is published:

```sh
npm install -g @cognivyn/cv-gh
```

See the [usage guide](docs/usage.md) for installation choices, GitHub authentication, daily workflows, and troubleshooting.

## Commands

- `cv-gh init` creates a `.cv-gh.toml` project config.
- `cv-gh status` prints Git status.
- `cv-gh doctor` checks local Git and GitHub token configuration without printing secrets.
- `cv-gh pr` delegates pull request creation to the authenticated `gh` CLI.
- `cv-gh release <tag>` delegates release creation to `gh`.

Run `cv-gh --help` or `cv-gh <command> --help` for all options. `cv-gh pr` and `cv-gh release` require GitHub CLI authentication via `gh auth login`.

## Development

```sh
cargo fmt --all
cargo test --workspace
cargo clippy --workspace --all-targets --all-features -- -D warnings
cd packages/node-wrapper && npm install --ignore-scripts --no-package-lock && npm test
```
