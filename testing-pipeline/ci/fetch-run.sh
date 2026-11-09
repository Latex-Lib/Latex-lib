#!/usr/bin/env bash
# Brings a GitHub run of the matrix (.github/workflows/compat.yml) back as a
# store (testing-pipeline/ARCHITECTURE.md section 7, `ci/`).
#
#   ci/fetch-run.sh <run>[,<run>...] <folder>
#   ci/fetch-run.sh sha:<commit> <folder>      the runs of that commit in every runner repository
#
# A run is its id (the number in the address of its page), in GITHUB_REPOSITORY
# (owner/name, Latex-Lib/Latex-lib by default), or owner/name:id. sha:<commit>
# finds the push run of that commit in the default repository and in each
# active runner of settings/runners.json. The folder becomes a store like out/:
# the filing index (manifest.jsonl, documents/), every pair's results, the
# ledger joined from each pair's part, the logs, and the reports.
#
# Two runner repositories run the same commit, each its own classes, so their
# runs join like two branches: before anything is joined, every run must be
# finished, of the same commit and private commit, with the same manifest
# (each plan job's run record, runs/), and their pairs must not overlap and
# together be every pair picked; otherwise it stops and says why. Then the
# per-pair files are unioned (results/, documents/, ledger.d/, logs/run-* and
# logs/bisect-*), each run's own logs go to logs/<owner>--<name>/, and the
# reports are written again over all the pairs: summary.md (ci/summary.sh),
# triage.md, and diff.md against both repositories' previous verdicts joined
# (ci/merge-verdicts.mjs; PREVIOUS, a verdicts.json.gz, replaces them).
# Nothing compiles.
#
# A workspace reads the store with "out" set to it in compat.config.json. The
# token comes from GITHUB_TOKEN, or else from git's stored credentials.
# Artifacts are sealed (ci/seal.sh): the key is FLOUEST_KEY, or the file
# FLOUEST_KEY_FILE names.
set -euo pipefail

runs=${1:?a run id, a comma-separated list of runs, or sha:<commit>}
dest=${2:?the folder the store goes in}
here=$(cd "$(dirname "$0")" && pwd)
# Local change (2026-11-09): written as an if, since macOS's bash 3.2 cannot parse $( ) inside ${:-}.
token=${GITHUB_TOKEN:-}
if [ -z "$token" ]; then token=$( { printf 'protocol=https\nhost=github.com\n\n' | git credential fill 2>/dev/null || true; } | sed -n 's/^password=//p'); fi
[ -n "$token" ] || { echo "fetch-run: no token (set GITHUB_TOKEN)" >&2; exit 1; }
api() { curl -fsSL -H "Authorization: Bearer $token" -H "Accept: application/vnd.github+json" "$@"; }
json() { node -e "const v = JSON.parse(require('fs').readFileSync(0, 'utf8')); console.log($1)"; }

if [ -z "${FLOUEST_KEY:-}" ] && [ -n "${FLOUEST_KEY_FILE:-}" ]; then FLOUEST_KEY=$(tr -d '\r\n' < "$FLOUEST_KEY_FILE"); fi
export FLOUEST_KEY
tmp=$(mktemp -d)
trap 'rm -rf "$tmp"' EXIT
# A fresh folder (results/ alone may stay, as a cache): another store's pairs and logs would join in unseen.
if [ -d "$dest" ] && [ -n "$(find "$dest" -mindepth 1 -maxdepth 1 ! -name results -print -quit)" ]; then
  echo "fetch-run: $dest already holds a store; give a new folder" >&2
  exit 1
fi

# The runs as repo:id, one per line.
: > "$tmp/runs"
case "$runs" in
  sha:*)
    sha=${runs#sha:}
    node -e '
      const r = JSON.parse(require("fs").readFileSync(process.argv[1], "utf8"));
      for (const x of [r.default, ...r.runners.filter((x) => x.active).map((x) => x.repository)]) console.log(x);
    ' "$here/../settings/runners.json" | while read -r repo; do
      # The batch's run, on latex-ci (a latex-ci-keys run of the same commit runs the plan job only).
      id=$(api "https://api.github.com/repos/$repo/actions/workflows/compat.yml/runs?head_sha=$sha&event=push&branch=latex-ci&per_page=1" | json 'v.workflow_runs[0]?.id ?? ""')
      [ -n "$id" ] || { echo "fetch-run: $repo has no compat run of $sha on latex-ci" >&2; exit 1; }
      echo "$repo:$id" >> "$tmp/runs"
    done
    ;;
  *)
    IFS=, read -r -a list <<< "$runs"
    for spec in "${list[@]}"; do
      case "$spec" in
        */*:*) echo "$spec" >> "$tmp/runs" ;;
        *) echo "${GITHUB_REPOSITORY:-Latex-Lib/Latex-lib}:$spec" >> "$tmp/runs" ;;
      esac
    done
    ;;
esac
count=$(wc -l < "$tmp/runs")

# Each run into a folder of its own.
n=0
while IFS= read -r spec; do
  n=$((n + 1))
  repo=${spec%:*}; run=${spec##*:}
  api "https://api.github.com/repos/$repo/actions/runs/$run" > "$tmp/run.json"
  status=$(json 'v.status' < "$tmp/run.json")
  conclusion=$(json 'v.conclusion ?? ""' < "$tmp/run.json")
  branch=$(json 'v.head_branch' < "$tmp/run.json")
  # A cancelled run (a newer push replaced it) is completed too, with pairs that never ran.
  if [ "$count" -gt 1 ]; then
    [ "$status" = completed ] || { echo "fetch-run: $repo run $run is $status; join it once it is done" >&2; exit 1; }
    case "$conclusion" in
      cancelled | skipped | "") echo "fetch-run: $repo run $run is ${conclusion:-not concluded}; join runs that went through" >&2; exit 1 ;;
    esac
  fi
  json 'v.head_sha' < "$tmp/run.json" > "$tmp/sha.$n"
  into=$tmp/run.$n
  mkdir -p "$into"
  echo "$repo" > "$tmp/repo.$n"
  page=1
  : > "$tmp/list"
  while :; do
    api "https://api.github.com/repos/$repo/actions/runs/$run/artifacts?per_page=100&page=$page" > "$tmp/page.json"
    json 'v.artifacts.filter((x) => !x.expired).map((x) => `${x.id} ${x.name}`).join("\n")' < "$tmp/page.json" | sed '/^$/d' >> "$tmp/list"
    [ "$(json 'v.artifacts.length' < "$tmp/page.json")" -lt 100 ] && break
    page=$((page + 1))
  done
  echo "fetch-run: $repo run $run ($branch, $status${conclusion:+ $conclusion}): $(wc -l < "$tmp/list") artifacts"
  # A sealed artifact holds one <name>.tar.gz.enc whose paths already say where they go (results/, ledger.d/,
  # logs/, ...). Older runs' artifacts are plain.
  while read -r id name; do
    rm -rf "$tmp/a" && mkdir -p "$tmp/a"
    # Local change (2026-11-09): RESEALED names a folder holding <owner>--<name>/<artifact>/, the re-sealed copy of
    # each artifact (the reseal workflow), read in place of the original, which opens only with the lost key.
    if [ -n "${RESEALED:-}" ]; then
      local_dir="$RESEALED/${repo//\//--}/$name"
      [ -d "$local_dir" ] || { echo "fetch-run: $local_dir is missing from the re-sealed run" >&2; exit 1; }
      cp -R "$local_dir/." "$tmp/a/"
    else
      api -o "$tmp/a.zip" "https://api.github.com/repos/$repo/actions/artifacts/$id/zip"
      unzip -qo "$tmp/a.zip" -d "$tmp/a"
    fi
    sealed=$(find "$tmp/a" -name '*.tar.gz.enc')
    if [ -n "$sealed" ]; then
      bash "$here/seal.sh" open "$into" $sealed
    else
      case "$name" in
        index | pair-* | summary | triage | diff) cp -r "$tmp/a/." "$into/" ;;
        log-*) mkdir -p "$into/logs" && cp -r "$tmp/a/." "$into/logs/" ;;
      esac
    fi
    rm -rf "$tmp/a.zip" "$tmp/a"
  done < "$tmp/list"
done < "$tmp/runs"

mkdir -p "$dest"
if [ "$count" -eq 1 ]; then
  cp -r "$tmp/run.1/." "$dest/"
else
  # Like two branches of one commit: check first, then union.
  node -e '
    const fs = require("fs");
    const [tmp, count] = [process.argv[1], Number(process.argv[2])];
    const stop = (why) => { console.error(`fetch-run: not joined: ${why}`); process.exit(1); };
    const runs = [];
    for (let n = 1; n <= count; n++) {
      const repo = fs.readFileSync(`${tmp}/repo.${n}`, "utf8").trim();
      const sha = fs.readFileSync(`${tmp}/sha.${n}`, "utf8").trim();
      const dir = `${tmp}/run.${n}/runs`;
      const files = fs.existsSync(dir) ? fs.readdirSync(dir).filter((f) => f.endsWith(".json")) : [];
      if (files.length !== 1) stop(`${repo}: its run has ${files.length} run records (runs/); a run from before the record cannot be checked`);
      const record = JSON.parse(fs.readFileSync(`${dir}/${files[0]}`, "utf8"));
      if (record.repository.toLowerCase() !== repo.toLowerCase()) stop(`${repo}: its run record is for ${record.repository}`);
      if (!record.private) stop(`${repo}: its run record names no private commit`);
      // Every job the run took on (each shard of each pair, <pair>@<i>) has its artifact: the pair job uploads its
      // ledger part even when it fails. Older records list pairs only.
      const absent = (record.units ?? record.mine).filter((u) => !fs.existsSync(`${tmp}/run.${n}/ledger.d/${u}.jsonl`));
      if (absent.length > 0) stop(`${repo}: no pair artifact for ${absent.join(", ")}; its jobs did not all run`);
      runs.push({ ...record, repo, sha });
    }
    const [first] = runs;
    for (const r of runs.slice(1)) {
      if (r.sha !== first.sha) stop(`${r.repo} ran ${r.sha}, ${first.repo} ran ${first.sha}`);
      if (r.private !== first.private) stop(`${r.repo} used the private commit ${r.private}, ${first.repo} ${first.private}`);
      if (r.manifest !== first.manifest) stop(`${r.repo} filed another manifest than ${first.repo}`);
      if (JSON.stringify(r.versions ?? null) !== JSON.stringify(first.versions ?? null)) stop(`${r.repo} ran versions ${JSON.stringify(r.versions)}, ${first.repo} ${JSON.stringify(first.versions)}`);
      if (JSON.stringify(r.picked) !== JSON.stringify(first.picked)) stop(`${r.repo} was asked for other pairs (${r.asked.join(" ")}) than ${first.repo} (${first.asked.join(" ")})`);
    }
    const seen = new Map();
    for (const r of runs) for (const p of r.mine) { if (seen.has(p)) stop(`${p} ran in both ${seen.get(p)} and ${r.repo}`); seen.set(p, r.repo); }
    const missing = first.picked.filter((p) => !seen.has(p));
    if (missing.length > 0) stop(`no run has ${missing.join(", ")}`);
    console.log(`fetch-run: ${count} runs of ${first.sha.slice(0, 12)}, ${seen.size} pairs, each in one run`);
  ' "$tmp" "$count"
  n=0
  : > "$tmp/previous"
  while IFS= read -r spec; do
    n=$((n + 1))
    into=$tmp/run.$n
    slug=$(sed 's|/|--|' "$tmp/repo.$n")
    # This run's own logs (oracle, lint, smoke) and reports keep their names in a folder of their own.
    mkdir -p "$dest/logs/$slug"
    if [ -d "$into/logs" ]; then
      find "$into/logs" -maxdepth 1 -type f ! -name 'run-*' ! -name 'bisect-*' -exec mv {} "$dest/logs/$slug/" \;
    fi
    for f in summary.md triage.md diff.md verdicts.json.gz; do [ -f "$into/$f" ] && mv "$into/$f" "$dest/logs/$slug/$f"; done
    if [ -f "$into/verdicts.previous.json.gz" ]; then mv "$into/verdicts.previous.json.gz" "$dest/logs/$slug/"; echo "$dest/logs/$slug/verdicts.previous.json.gz" >> "$tmp/previous"; fi
    [ "$n" -eq 1 ] || rm -f "$into/manifest.jsonl"
    cp -r "$into/." "$dest/"
  done < "$tmp/runs"
  rm -f "$dest/diff.md" "$dest/verdicts.json.gz"
  bash "$here/summary.sh" "$dest" > "$dest/summary.md"
  node "$here/triage.mjs" "$dest" > /dev/null
  previous=${PREVIOUS:-}
  if [ -z "$previous" ] && [ -s "$tmp/previous" ]; then
    previous=$dest/verdicts.previous.json.gz
    tr '\n' '\0' < "$tmp/previous" | xargs -0 node "$here/merge-verdicts.mjs" "$previous"
  fi
  node "$here/diff.mjs" "$dest" ${previous:+--previous "$previous"} > /dev/null
fi

# The ledger: each pair's part in name order.
if [ -d "$dest/ledger.d" ]; then
  find "$dest/ledger.d" -name '*.jsonl' -print0 | LC_ALL=C sort -z | xargs -0 -r cat > "$dest/ledger.jsonl"
fi
echo "fetch-run: $dest has $(find "$dest/results" -name '*.json.gz' 2>/dev/null | wc -l) results from $(paste -sd, "$tmp/runs")"
