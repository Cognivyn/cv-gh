# cv-gh core

The Rust implementation of the `cv-gh` CLI.

```sh
cargo run -p cv-gh -- --help
cargo test --workspace
```

The `pr` and `release` commands use the GitHub CLI (`gh`) and its existing authentication state.
