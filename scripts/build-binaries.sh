#!/usr/bin/env bash
set -euo pipefail

root_dir=$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)
cd "$root_dir"

cargo build --release -p cv-gh
mkdir -p dist
archive="dist/cv-gh-$(rustc -vV | awk '/host:/{print $2}').tar.gz"
if [[ "$(uname -s)" == "Darwin" ]]; then
  archive="dist/cv-gh-$(uname -s | tr '[:upper:]' '[:lower:]')-$(uname -m).tar.gz"
fi
tar -czf "$archive" -C target/release cv-gh
echo "Created $archive"
