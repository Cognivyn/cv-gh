# cv-gh

`cv-gh` is a cross-platform CLI for common GitHub and repository workflows.

## Install

With Rust:

```sh
cargo install --path packages/rust-core
```

With npm (published releases):

```sh
npm install -g @cognivyn/cv-gh
```

## Commands

- `cv-gh init` creates a `.cv-gh.toml` project config.
- `cv-gh status` prints Git status.
- `cv-gh doctor` checks local Git and GitHub CLI availability.
- `cv-gh pr` delegates pull request creation to the authenticated `gh` CLI.
- `cv-gh release <tag>` delegates release creation to `gh`.

Run `cv-gh --help` for all options. `cv-gh pr` and `cv-gh release` require GitHub CLI authentication via `gh auth login`.

## Development

```sh
cargo fmt --all
cargo test --workspace
cargo clippy --workspace --all-targets --all-features -- -D warnings
cd packages/node-wrapper && npm install --ignore-scripts --no-package-lock && npm test
```
