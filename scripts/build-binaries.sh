#!/usr/bin/env bash
set -euo pipefail

root_dir=$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)
cd "$root_dir"

cargo build --release -p cv-gh
mkdir -p dist
host=$(rustc -vV | awk '/host:/{print $2}')
case "$host" in
  x86_64-unknown-linux-gnu)
    platform=linux-x86_64
    binary=cv-gh
    ;;
  aarch64-apple-darwin)
    platform=darwin-aarch64
    binary=cv-gh
    ;;
  x86_64-pc-windows-gnu|x86_64-pc-windows-msvc)
    platform=windows-x86_64
    binary=cv-gh.exe
    ;;
  *)
    echo "Unsupported release target: $host" >&2
    exit 1
    ;;
esac

archive="dist/cv-gh-${platform}.tar.gz"
tar -czf "$archive" -C target/release "$binary"
echo "Created $archive"
