# Commands

## `init`
Creates `.cv-gh.toml` in the current directory. Use `--path PATH` for another directory. Existing configuration is preserved.

## `status`
Runs `git status --short --branch` in the current directory and returns Git's exit status.

## `doctor`
Reports whether Git is available and whether `GITHUB_TOKEN` is configured. It does not print token values.

## `pr`
Runs `gh pr create`. Supports `--title`, `--body`, and `--draft`.

## `release TAG`
Runs `gh release create TAG`. Supports `--title` and `--notes`.
