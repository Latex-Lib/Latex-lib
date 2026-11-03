#!/usr/bin/env bash
# Seals what a job hands on as an artifact, so a public run's artifacts can be
# read only with the key (testing-pipeline/ARCHITECTURE.md section 7, `ci/`).
# The key is FLOUEST_KEY (the workflow's secret, or the owner's copy locally).
#
#   ci/seal.sh pack <out.tar.gz.enc> <base> <path>...   paths under base, missing ones skipped
#   ci/seal.sh open <dest> <file>...                    each sealed file unpacked into dest
#
# pack writes nothing when none of the paths exist, so an upload with
# if-no-files-found: ignore uploads nothing. Paths may be globs, matched under
# base.
set -euo pipefail

command=${1:-}
[ -n "${FLOUEST_KEY:-}" ] || { echo "seal: FLOUEST_KEY is not set" >&2; exit 1; }
seal() { openssl enc -aes-256-cbc -pbkdf2 -iter 200000 -salt -pass env:FLOUEST_KEY; }
unseal() { openssl enc -d -aes-256-cbc -pbkdf2 -iter 200000 -pass env:FLOUEST_KEY; }

case "$command" in
  pack)
    out=${2:?the sealed file}
    base=${3:?the folder the paths are under}
    shift 3
    list=()
    if [ -d "$base" ]; then
      for pattern in "$@"; do
        while IFS= read -r found; do list+=("$found"); done < <(cd "$base" && compgen -G "$pattern" || true)
      done
    fi
    if [ "${#list[@]}" -eq 0 ]; then echo "seal: nothing to pack for $(basename "$out")"; exit 0; fi
    mkdir -p "$(dirname "$out")"
    tar -C "$base" -czf - -- "${list[@]}" | seal > "$out"
    echo "seal: $(basename "$out"), ${#list[@]} path(s), $(du -h "$out" | cut -f1)"
    ;;
  open)
    dest=${2:?the folder to unpack into}
    shift 2
    mkdir -p "$dest"
    for file in "$@"; do
      [ -f "$file" ] || continue
      unseal < "$file" | tar -xz -C "$dest"
    done
    ;;
  *) sed -n '2,13p' "$0" >&2; exit 2 ;;
esac
