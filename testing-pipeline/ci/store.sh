#!/usr/bin/env bash
# The results store kept in S3-compatible object storage, so runs on other
# machines share it (testing-pipeline/ARCHITECTURE.md section 7, `ci/`).
#
#   ci/store.sh pull-index           manifest.jsonl and documents/: what is filed where
#   ci/store.sh push-index           the same, back, only if no one else filed meanwhile (only the plan step files)
#   ci/store.sh pull-keys <file>     the results the file lists that the bucket has (ci/prepare.ts --keys)
#   ci/store.sh pull-results         every result (one big machine, or explain)
#   ci/store.sh push                 keyed files written since the last pull or push; the ledger's new lines as a
#                                    part; review decisions merged with the bucket's; the review queue if newer
#   ci/store.sh pull-all             everything, merged into what is here (to explain, review or look locally)
#   ci/store.sh pull-explain [time]  an explain machine's compat tables (the newest, or that run's)
#   ci/store.sh pull-profiles        the engines' Chrome profiles (format and packages), if the bucket has them
#   ci/store.sh push-profiles        the same, up, if the bucket has none for this engine count yet
#   ci/store.sh seed                 a whole local store up, once, into an empty prefix (its ledger becomes the base)
#   ci/store.sh mask                 on GitHub Actions, hide the bucket and the account id in the log
#
# STORE_URI is s3://bucket/prefix. S3_ENDPOINT is set for a store that is not
# AWS S3 (Cloudflare R2: https://<account>.r2.cloudflarestorage.com). The AWS
# CLI takes its credentials as usual. AWS_CLI names another command (tests).
# LEDGER_NAME ends the name of the ledger part a push sends
# (ledger.d/<time>-<machine>-<LEDGER_NAME>.jsonl).
#
# Without STORE_URI there is no bucket: the store is whatever out/ holds, and
# every command does nothing but note the manifest as pulled. The GitHub
# workflow runs that way, moving out/ between its jobs as artifacts.
#
# results/, documents/ and artifacts/ are keyed by hashes of their inputs, so
# copies from two machines are equally good and the store only ever grows:
# nothing here deletes. The rest is merged, never overwritten: the manifest
# only if one copy extends the other, and only if the bucket's is still the
# one pulled; review decisions as a union of lines in time order; the ledger by
# parts, a push sending only the lines it added and a pull appending only the
# parts not seen here; and the review queue (latest/explain and the review/
# candidates it names, which hold one explain run's counts) whole, from
# whichever side's explain ran last.
set -euo pipefail

here=$(cd "$(dirname "$0")" && pwd)
tp=$(cd "$here/.." && pwd)
out="$tp/out"
command=${1:-}
case "$command" in
  pull-index | push-index | pull-keys | pull-results | push | pull-all | pull-explain | pull-profiles | push-profiles | seed | mask) ;;
  *) sed -n '2,/^set -euo/p' "$0" | sed '$d' >&2; exit 2 ;;
esac
if [ -z "${STORE_URI:-}" ]; then
  mkdir -p "$out"
  case "$command" in
    pull-index | pull-all)
      [ -f "$out/manifest.jsonl" ] || : > "$out/manifest.jsonl"
      cp "$out/manifest.jsonl" "$out/.manifest.pulled"
      ;;
  esac
  touch "$out/.store-marker"
  exit 0
fi
store=${STORE_URI%/}
bucket=${store#s3://}; bucket=${bucket%%/*}
key_prefix=${store#s3://"$bucket"}; key_prefix=${key_prefix#/}
endpoint=()
[ -n "${S3_ENDPOINT:-}" ] && endpoint=(--endpoint-url "$S3_ENDPOINT")
cli=${AWS_CLI:-aws}
parallel=${STORE_PARALLEL:-32}
marker="$out/.store-marker"
KEYED="results documents artifacts"

s3() { "$cli" "${endpoint[@]}" s3 "$@"; }
s3api() { "$cli" "${endpoint[@]}" s3api "$@"; }

# Copies each relative path read from stdin from $1 to $2 (one side is local), several at once.
copy_each() {
  local from=$1 to=$2
  xargs -r -P "$parallel" -I{} "$cli" "${endpoint[@]}" s3 cp --only-show-errors "$from/{}" "$to/{}"
}

# Whether the bucket has an object or prefix $1 under the store. `aws s3 ls` exits 1 and says nothing when
# nothing matches; anything else (credentials, network) stops the script rather than read as "none".
exists() {
  local err rc=0
  err=$(s3 ls "$store/$1" 2>&1 >/dev/null) || rc=$?
  [ "$rc" -eq 0 ] && return 0
  [ "$rc" -eq 1 ] && [ -z "$err" ] && return 1
  echo "store: could not list $1: $err" >&2
  exit 1
}

# Fetches the store's object $1 into the file $2, or empties $2 if there is none.
fetch() { if exists "$1"; then s3 cp --only-show-errors "$store/$1" "$2"; else : > "$2"; fi; }

# Whether the file $1 begins with all of the file $2.
starts_with() { head -c "$(wc -c < "$2")" "$1" | cmp -s - "$2"; }

# The `at` of a gzipped review-queue pointer (latest/explain), or nothing.
pointer_at() { [ -s "$1" ] && node -e 'console.log(JSON.parse(require("zlib").gunzipSync(require("fs").readFileSync(process.argv[1]))).at ?? "")' "$1" || true; }

mark() { mkdir -p "$out"; touch "$marker"; }

# The name of a new ledger part: its time and machine, then LEDGER_NAME.
part_name() { echo "$(date -u +%Y%m%dT%H%M%SZ)-$(hostname)-${LEDGER_NAME:-local}.jsonl"; }

# Sends the ledger lines past .ledger.pulled as a new part, and moves the offset past them.
push_ledger() {
  [ -f "$out/ledger.jsonl" ] || return 0
  local from size name tmp
  from=$(cat "$out/.ledger.pulled" 2>/dev/null || echo 0)
  size=$(wc -c < "$out/ledger.jsonl")
  if [ "$size" -gt "$from" ]; then
    name=$(part_name)
    exists "ledger.d/$name" && { echo "store: ledger part $name is in the bucket already" >&2; exit 1; }
    tmp=$(mktemp)
    tail -c +"$((from + 1))" "$out/ledger.jsonl" > "$tmp"
    s3 cp --only-show-errors "$tmp" "$store/ledger.d/$name"
    rm -f "$tmp"
    echo "$name" >> "$out/.ledger-parts"
  fi
  echo "$size" > "$out/.ledger.pulled"
}

# Keyed files written here since the last pull or push go up, before a pull marks everything as seen.
push_new() {
  [ -f "$marker" ] || return 0
  local tmp; tmp=$(mktemp)
  # shellcheck disable=SC2086
  (cd "$out" && find $KEYED -type f -name '*.json.gz' -newer "$marker" 2>/dev/null) > "$tmp" || true
  [ -s "$tmp" ] && echo "store: $(wc -l < "$tmp") new files up"
  copy_each "$out" "$store" < "$tmp"
  rm -f "$tmp"
}

# review.jsonl here and in the bucket become their union, in time order (the last decision on a candidate wins).
merge_review() {
  local tmp; tmp=$(mktemp -d)
  fetch review.jsonl "$tmp/remote"
  [ -f "$out/review.jsonl" ] || : > "$out/review.jsonl"
  node -e '
    const fs = require("fs");
    const lines = (f) => fs.readFileSync(f, "utf8").split("\n").filter(Boolean);
    const seen = new Set();
    const all = [...lines(process.argv[1]), ...lines(process.argv[2])].filter((l) => !seen.has(l) && seen.add(l));
    const at = (l) => { try { return String(JSON.parse(l).at ?? ""); } catch { return ""; } };
    const sorted = all.map((l, i) => [l, i]).sort((a, b) => (at(a[0]) < at(b[0]) ? -1 : at(a[0]) > at(b[0]) ? 1 : a[1] - b[1])).map(([l]) => l);
    fs.writeFileSync(process.argv[3], sorted.length === 0 ? "" : `${sorted.join("\n")}\n`);
  ' "$tmp/remote" "$out/review.jsonl" "$tmp/merged"
  if ! cmp -s "$tmp/merged" "$tmp/remote"; then s3 cp --only-show-errors "$tmp/merged" "$store/review.jsonl"; fi
  cp "$tmp/merged" "$out/review.jsonl"
  rm -rf "$tmp"
}

# The review queue goes whole, from the side whose explain ran last: $1 is up or down.
sync_queue() {
  local tmp here_at there_at; tmp=$(mktemp -d)
  if exists latest/explain.json.gz; then s3 cp --only-show-errors "$store/latest/explain.json.gz" "$tmp/remote.json.gz"; fi
  here_at=$(pointer_at "$out/latest/explain.json.gz")
  there_at=$(pointer_at "$tmp/remote.json.gz")
  if [ "$1" = down ] && [ -n "$there_at" ] && [[ "$there_at" > "$here_at" ]]; then
    s3 sync --only-show-errors "$store/review/" "$out/review/"
    mkdir -p "$out/latest"
    cp "$tmp/remote.json.gz" "$out/latest/explain.json.gz"
  elif [ "$1" = up ] && [ -n "$here_at" ] && [[ "$here_at" > "$there_at" ]]; then
    s3 sync --only-show-errors "$out/review/" "$store/review/" --exclude '*.tex'
    s3 cp --only-show-errors "$out/latest/explain.json.gz" "$store/latest/explain.json.gz"
  fi
  rm -rf "$tmp"
}

# The bucket's manifest ETag, or `none`.
manifest_etag() { s3api head-object --bucket "$bucket" --key "${key_prefix:+$key_prefix/}manifest.jsonl" --query ETag --output text 2>/dev/null || echo none; }

pull_index() {
  push_new
  mkdir -p "$out/documents"
  manifest_etag > "$out/.manifest.etag"
  fetch manifest.jsonl "$out/manifest.jsonl"
  s3 sync --only-show-errors "$store/documents/" "$out/documents/"
  cp "$out/manifest.jsonl" "$out/.manifest.pulled"
  mark
}

push_index() {
  [ -f "$out/.manifest.pulled" ] && [ -f "$out/.manifest.etag" ] || { echo "store: pull-index first" >&2; exit 1; }
  # Documents first, so every manifest line in the bucket names a document that is there.
  s3 sync --only-show-errors "$out/documents/" "$store/documents/"
  # The manifest only if the bucket's is still the one pulled: two plans at once must not both file.
  local etag condition
  etag=$(cat "$out/.manifest.etag")
  if [ "$etag" = none ]; then condition=(--if-none-match '*'); else condition=(--if-match "$etag"); fi
  if ! s3api put-object --bucket "$bucket" --key "${key_prefix:+$key_prefix/}manifest.jsonl" --body "$out/manifest.jsonl" "${condition[@]}" > /dev/null; then
    echo "store: the bucket's manifest changed since pull-index (another plan?); plan again" >&2
    exit 1
  fi
  manifest_etag > "$out/.manifest.etag"
  cp "$out/manifest.jsonl" "$out/.manifest.pulled"
}

pull_keys() {
  local list=${1:?pull-keys needs the file ci/prepare.ts --keys wrote}
  local tmp; tmp=$(mktemp -d)
  push_new
  mkdir -p "$out/results"
  # What the bucket has, once, against what is wanted and not here yet.
  if exists results/; then
    s3 ls "$store/results/" | awk '{print $4}' | sed -n 's/\.json\.gz$//p' | sort -u > "$tmp/remote"
  else
    : > "$tmp/remote"
  fi
  sed -n 's#^results/##p' "$list" | sort -u | while read -r k; do [ -f "$out/results/$k.json.gz" ] || echo "$k"; done > "$tmp/wanted"
  comm -12 "$tmp/remote" "$tmp/wanted" | sed 's/$/.json.gz/' > "$tmp/fetch"
  echo "store: $(wc -l < "$tmp/wanted") results wanted and not here, $(wc -l < "$tmp/fetch") in the bucket"
  copy_each "$store/results" "$out/results" < "$tmp/fetch"
  rm -rf "$tmp"
  mark
}

pull_results() {
  push_new
  mkdir -p "$out/results"
  s3 sync --only-show-errors "$store/results/" "$out/results/"
  mark
}

push() {
  [ -f "$marker" ] || { echo "store: nothing was pulled here, so nothing to tell new files by" >&2; exit 1; }
  push_new
  push_ledger
  if [ -s "$out/review.jsonl" ]; then merge_review; fi
  sync_queue up
  mark
}

pull_all() {
  mkdir -p "$out"
  push_new
  local dir tmp part
  tmp=$(mktemp -d)
  # The manifest only when one copy extends the other: two different filings must not meet.
  manifest_etag > "$out/.manifest.etag"
  fetch manifest.jsonl "$tmp/manifest"
  if [ ! -s "$out/manifest.jsonl" ] || starts_with "$tmp/manifest" "$out/manifest.jsonl"; then
    cp "$tmp/manifest" "$out/manifest.jsonl"
  elif starts_with "$out/manifest.jsonl" "$tmp/manifest"; then
    echo "store: the manifest here extends the bucket's (filed here since); kept, and push-index sends it" >&2
  else
    rm -rf "$tmp"; echo "store: the manifest here and the bucket's were filed apart; nothing pulled" >&2; exit 1
  fi
  for dir in $KEYED; do s3 sync --only-show-errors "$store/$dir/" "$out/$dir/"; done
  merge_review
  sync_queue down
  # The ledger. Everything before the offset in .ledger.pulled is in the bucket; lines added here since go up
  # first, as a part, so that afterwards the whole file is. Then the base if there is no ledger here, and each
  # part not appended yet, in name order (names start with their UTC time).
  if [ -s "$out/ledger.jsonl" ]; then
    [ -f "$out/.ledger.pulled" ] || { rm -rf "$tmp"; echo "store: out/ledger.jsonl was never seeded or pulled, so what of it the bucket has is unknown; move it aside" >&2; exit 1; }
    push_ledger
  else
    : > "$out/.ledger-parts"
    fetch ledger.jsonl "$out/ledger.jsonl"
  fi
  touch "$out/.ledger-parts"
  mkdir -p "$tmp/parts"
  if exists ledger.d/; then s3 sync --only-show-errors "$store/ledger.d/" "$tmp/parts/"; fi
  while read -r part; do
    grep -qxF "$part" "$out/.ledger-parts" && continue
    cat "$tmp/parts/$part" >> "$out/ledger.jsonl"
    echo "$part" >> "$out/.ledger-parts"
  done < <(cd "$tmp/parts" && find . -name '*.jsonl' | sed 's#^\./##' | sort)
  wc -c < "$out/ledger.jsonl" > "$out/.ledger.pulled"
  # The bucket's manifest as pulled: push-index sends this one's own filing only if the bucket's is still that.
  cp "$tmp/manifest" "$out/.manifest.pulled"
  rm -rf "$tmp"
  mark
}

pull_explain() {
  local when=${1:-}
  if [ -z "$when" ]; then
    exists explain/ || { echo "store: no explain run in the bucket" >&2; exit 1; }
    when=$(s3 ls "$store/explain/" | awk '$1 == "PRE" {print $2}' | tr -d / | sort | tail -1)
  fi
  exists "explain/$when/" || { echo "store: no explain run $when" >&2; exit 1; }
  # The library's tables go beside its handlers (Latex-Lib/nodes/**/matrix.generated.json), General's into out/compat/.
  s3 cp --only-show-errors "$store/explain/$when/matrix-tables.tar.gz" - | tar -xz -C "$tp/.."
  if exists "explain/$when/compat/"; then s3 sync --only-show-errors "$store/explain/$when/compat/" "$out/compat/"; fi
  echo "store: compat tables of explain run $when"
}

profiles_key() { echo "profiles/e${ENGINES:-default}.tar.gz"; }

pull_profiles() {
  [ -d "$out/_shared" ] && return 0
  exists "$(profiles_key)" || { echo "store: no Chrome profiles for this engine count yet; the engines fetch the packages"; return 0; }
  mkdir -p "$out/_shared"
  s3 cp --only-show-errors "$store/$(profiles_key)" - | tar -xz -C "$out/_shared"
}

push_profiles() {
  [ -d "$out/_shared" ] || return 0
  exists "$(profiles_key)" && return 0
  local tmp; tmp=$(mktemp -d)
  tar -czf "$tmp/profiles.tar.gz" -C "$out/_shared" --exclude='Singleton*' .
  s3 cp --only-show-errors "$tmp/profiles.tar.gz" "$store/$(profiles_key)"
  rm -rf "$tmp"
}

seed() {
  local dir log
  if [ "${SEED_FORCE:-}" != 1 ] && { exists manifest.jsonl || exists ledger.jsonl || exists ledger.d/; }; then
    echo "store: $store has a store already; seed is for an empty one (SEED_FORCE=1 to seed anyway)" >&2
    exit 1
  fi
  # Keyed files first, the manifest last: every manifest line in the bucket names a document that is there.
  for dir in $KEYED review latest; do
    if [ -d "$out/$dir" ]; then s3 sync --only-show-errors "$out/$dir/" "$store/$dir/" --exclude '*.tex'; fi
  done
  for log in review.jsonl ledger.jsonl manifest.jsonl; do
    if [ -f "$out/$log" ]; then s3 cp --only-show-errors "$out/$log" "$store/$log"; fi
  done
  # The ledger is the bucket's base now: only lines added after this go up.
  if [ -f "$out/ledger.jsonl" ]; then wc -c < "$out/ledger.jsonl" > "$out/.ledger.pulled"; fi
  if [ -f "$out/manifest.jsonl" ]; then cp "$out/manifest.jsonl" "$out/.manifest.pulled"; fi
  manifest_etag > "$out/.manifest.etag"
  mark
  echo "store: seeded $store from $out"
}

mask() {
  [ "${GITHUB_ACTIONS:-}" = true ] || return 0
  local uri b account
  for uri in "$store" "${FLOUEST_URI:-}"; do
    [ -n "$uri" ] || continue
    b=${uri#s3://}; b=${b%%/*}
    echo "::add-mask::$b"
  done
  account=$("$cli" sts get-caller-identity --query Account --output text 2>/dev/null || true)
  [ -n "$account" ] && echo "::add-mask::$account"
  return 0
}

case "$command" in
  pull-index) pull_index ;;
  push-index) push_index ;;
  pull-keys) pull_keys "${2:-}" ;;
  pull-results) pull_results ;;
  push) push ;;
  pull-all) pull_all ;;
  pull-explain) pull_explain "${2:-}" ;;
  pull-profiles) pull_profiles ;;
  push-profiles) push_profiles ;;
  seed) seed ;;
  mask) mask ;;
esac
