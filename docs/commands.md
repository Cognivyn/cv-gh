# Commands

## `init [--path PATH]`
Creates `.cv-gh.toml` in the current directory, or in `PATH` when supplied. Existing configuration is preserved; the target directory must already exist.

## `status`
Runs `git status --short --branch` in the current directory and returns Git's exit status.

## `doctor`
Reports whether Git is available and whether `GITHUB_TOKEN` is configured. It does not print token values. GitHub API commands currently use the GitHub CLI's authentication state rather than reading this token.

## `pr [--title TITLE] [--body BODY] [--draft]`
Runs `gh pr create` with the supplied options. Run `gh auth login` before using it.

## `release TAG [--title TITLE] [--notes NOTES]`
Runs `gh release create TAG` with the supplied options. The tag must exist and the GitHub CLI must be authenticated.
