#!/usr/bin/env bash
# Brings a GitHub run of the matrix (.github/workflows/compat.yml) back as a
# store (testing-pipeline/ARCHITECTURE.md section 7, `ci/`).
#
#   ci/fetch-run.sh <run id> <folder>
#
# The folder becomes a store like out/: the run's filing index (manifest.jsonl,
# documents/), every pair's results, the ledger joined from each pair's part,
# and the logs, plus the run's summary. A workspace reads it with "out" set to
# it in compat.config.json. GITHUB_REPOSITORY is owner/name (yguo499/Latex-lib);
# the token comes from GITHUB_TOKEN, or else from git's stored credentials.
# Artifacts are sealed (ci/seal.sh): the key is FLOUEST_KEY, or the file
# FLOUEST_KEY_FILE names.
set -euo pipefail

run=${1:?the run id: the number in the address of the run page}
dest=${2:?the folder the store goes in}
repo=${GITHUB_REPOSITORY:-yguo499/Latex-lib}
token=${GITHUB_TOKEN:-$(printf 'protocol=https\nhost=github.com\n\n' | git credential fill 2>/dev/null | sed -n 's/^password=//p')}
[ -n "$token" ] || { echo "fetch-run: no token (set GITHUB_TOKEN)" >&2; exit 1; }
api() { curl -fsSL -H "Authorization: Bearer $token" -H "Accept: application/vnd.github+json" "$@"; }

mkdir -p "$dest"
tmp=$(mktemp -d)
page=1
: > "$tmp/list"
while :; do
  api "https://api.github.com/repos/$repo/actions/runs/$run/artifacts?per_page=100&page=$page" > "$tmp/page.json"
  node -e '
    const a = JSON.parse(require("fs").readFileSync(process.argv[1], "utf8")).artifacts;
    for (const x of a) if (!x.expired) console.log(`${x.id} ${x.name}`);
  ' "$tmp/page.json" >> "$tmp/list"
  [ "$(node -e 'console.log(JSON.parse(require("fs").readFileSync(process.argv[1], "utf8")).artifacts.length)' "$tmp/page.json")" -lt 100 ] && break
  page=$((page + 1))
done
echo "fetch-run: $(wc -l < "$tmp/list") artifacts"

if [ -z "${FLOUEST_KEY:-}" ] && [ -n "${FLOUEST_KEY_FILE:-}" ]; then FLOUEST_KEY=$(tr -d '\r\n' < "$FLOUEST_KEY_FILE"); fi
export FLOUEST_KEY
# A sealed artifact holds one <name>.tar.gz.enc whose paths already say where they go (results/, ledger.d/,
# logs/, ...). Older runs' artifacts are plain.
while read -r id name; do
  api -o "$tmp/a.zip" "https://api.github.com/repos/$repo/actions/artifacts/$id/zip"
  rm -rf "$tmp/a" && mkdir -p "$tmp/a"
  unzip -qo "$tmp/a.zip" -d "$tmp/a"
  sealed=$(find "$tmp/a" -name '*.tar.gz.enc')
  if [ -n "$sealed" ]; then
    bash "$(dirname "$0")/seal.sh" open "$dest" $sealed
  else
    case "$name" in
      index | pair-* | summary | triage | diff) cp -r "$tmp/a/." "$dest/" ;;
      log-*) mkdir -p "$dest/logs" && cp -r "$tmp/a/." "$dest/logs/" ;;
    esac
  fi
  rm -rf "$tmp/a.zip" "$tmp/a"
done < "$tmp/list"

# The ledger: each pair's part in name order.
if [ -d "$dest/ledger.d" ]; then
  find "$dest/ledger.d" -name '*.jsonl' | sort | xargs -r cat > "$dest/ledger.jsonl"
fi
rm -rf "$tmp"
echo "fetch-run: $dest has $(find "$dest/results" -name '*.json.gz' 2>/dev/null | wc -l) results from run $run"
