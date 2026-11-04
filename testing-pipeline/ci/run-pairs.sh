#!/usr/bin/env bash
# Runs the matrix on a Linux machine against the shared store
# (testing-pipeline/ARCHITECTURE.md section 7, `ci/`).
#
#   ci/run-pairs.sh plan [--pairs-out <file>] [PAIRS]   file once, centrally, and list the pairs
#   ci/run-pairs.sh run PAIRS                            each pair in turn: fetch its results, compile the rest, push
#   ci/run-pairs.sh smoke                                every handler alone under article A (ci/smoke.ts): stops if
#                                                        the engine or its setup is broken
#   ci/run-pairs.sh explain                              the whole store down, `compat explain --library --limit 300`, push
#                                                        (all pairs in one process: give it a large NODE_HEAP_MB)
#
# PAIRS is `all` (the default), `batch:<id>` or `batch:current` (the classes of
# that batch, or of the newest running one, in settings/batches.json:
# testing-pipeline/BATCHES.md), or names, comma- or
# space-separated: class.setup (article.A) or a class alone for every setup
# that applies to it (amsart). Each pair runs in a process of its own, as on the
# laptop. Only one plan may run against a store at a time. Plan runs before any
# job of a fan-out, so the jobs find nothing left to file and agree on every
# document; a run that files anyway pushes nothing.
#
# A pair's log always goes to the store (logs/<time>/), and what it compiled
# is pushed even when it fails: results are keyed by their inputs and written
# whole. ENGINES (a number, `default`, or `auto`: what RAM and cores allow) is
# written into compat.config.json when set; NODE_HEAP_MB is Node's heap
# (8192). With QUIET=1 the console shows a pair's summary lines, not its
# output: a public repository's CI console is public. PULL=all fetches every
# result once instead of each pair's own. The store variables are
# ci/store.sh's. Node options already set (the workflow's crash guard,
# ci/no-source.cjs) are kept.
#
# On GitHub (GITHUB_REPOSITORY set) plan keeps only the pairs of the classes
# this repository runs (settings/runners.json): `all` and `batch:` keep this
# repository's part, a class or pair named outright that another repository
# runs stops the plan. Elsewhere it keeps every pair. It writes the run record
# out/runs/<owner>--<name>.json (commit, private commit checked out, what was asked, every
# pair picked, this repository's, the manifest's sha256), which
# ci/fetch-run.sh checks before it joins two runs. A pair split over several
# jobs (settings/shards.json, from ci/balance.mjs) is n jobs, each COMPAT_SHARD=i/n:
# run compiles that part of its documents, its log and ledger part named <pair>@<i>.
set -euo pipefail

here=$(cd "$(dirname "$0")" && pwd)
tp=$(cd "$here/.." && pwd)
out="$tp/out"
store() { bash "$here/store.sh" "$@"; }
cd "$tp"
export NODE_OPTIONS="${NODE_OPTIONS:+$NODE_OPTIONS }--max-old-space-size=${NODE_HEAP_MB:-8192}"
stamp=$(date -u +%Y%m%dT%H%M%SZ)
s3=("${AWS_CLI:-aws}" ${S3_ENDPOINT:+--endpoint-url "$S3_ENDPOINT"} s3)
if [ -n "${STORE_URI:-}" ]; then store mask; fi

# The pairs named in $@ (or all), one class.setup per line, checked against the plan's.
pairs_of() {
  local all=$1; shift
  local wanted="${*:-all}"
  node -e '
    const fs = require("fs");
    const pairs = JSON.parse(fs.readFileSync(process.argv[1], "utf8"));
    const all = pairs.map((p) => `${p.class}.${p.setup}`);
    const unknown = [];
    const expand = (name) => {
      if (name === "all") return all;
      if (name.startsWith("batch:")) {
        const batches = JSON.parse(fs.readFileSync("settings/batches.json", "utf8")).batches;
        const id = name.slice(6);
        const batch = id === "current" ? batches.filter((b) => b.status === "running").at(-1) : batches.find((b) => String(b.id) === id);
        if (batch === undefined) { unknown.push(name); return []; }
        return batch.classes.flatMap(expand);
      }
      const of = name.includes(".") ? all.filter((p) => p === name) : pairs.filter((p) => p.class === name).map((p) => `${p.class}.${p.setup}`);
      if (of.length === 0) unknown.push(name);
      return of;
    };
    const picked = [...new Set(process.argv[2].split(/[\s,]+/).filter(Boolean).flatMap(expand))];
    if (unknown.length > 0) { console.error(`no such pair, class or batch: ${unknown.join(", ")}`); process.exit(1); }
    console.log(picked.join("\n"));
  ' "$all" "$wanted"
}

set_engines() {
  [ -n "${ENGINES:-}" ] || return 0
  local engines=$ENGINES
  if [ "$engines" = auto ]; then
    # About 2 GB an engine beside Node's heap and 2 GB for the system, and no more engines than cores.
    local mem_mb cores
    mem_mb=$(awk '/MemTotal/ {print int($2 / 1024)}' /proc/meminfo)
    cores=$(nproc)
    engines=$(( (mem_mb - ${NODE_HEAP_MB:-8192} - 2048) / 2048 ))
    [ "$engines" -gt "$cores" ] && engines=$cores
    [ "$engines" -lt 1 ] && engines=1
  fi
  node -e '
    const fs = require("fs");
    const config = JSON.parse(fs.readFileSync("compat.config.json", "utf8"));
    config.engines = process.argv[1] === "default" ? "default" : Number(process.argv[1]);
    fs.writeFileSync("compat.config.json", `${JSON.stringify(config, null, 2)}\n`);
  ' "$engines"
  export ENGINES=$engines
  echo "engines: $engines"
}

# Stops if the store here has branches no document of the bucket's holds: then the plan step has not run.
filed_already() {
  npm run --silent compat -- ci/prepare.ts --library --pairs "$out/.all-pairs.json" > /dev/null
  cmp -s "$out/manifest.jsonl" "$out/.manifest.pulled" || { echo "$1: this store has branches no document holds; run the plan step first" >&2; exit 1; }
}

# Runs compat with the rest of the arguments, its output into the log $1; returns its status.
compat_logged() {
  local log=$1; shift
  local rc=0
  npm run --silent compat -- "$@" > "$log" 2>&1 || rc=$?
  if [ -n "${STORE_URI:-}" ]; then "${s3[@]}" cp --only-show-errors "$log" "${STORE_URI%/}/logs/$stamp/$(basename "$log")" || true; fi
  [ "${QUIET:-}" = 1 ] || cat "$log"
  return "$rc"
}

plan() {
  local pairs_out="$out/.pairs" list
  if [ "${1:-}" = --pairs-out ]; then pairs_out=$2; shift 2; fi
  store pull-index
  npm run --silent compat -- ci/prepare.ts --library --pairs "$out/.all-pairs.json"
  store push-index
  list=$(pairs_of "$out/.all-pairs.json" "$@")
  echo "$list" | node -e '
    const fs = require("fs");
    const picked = fs.readFileSync(0, "utf8").split("\n").filter(Boolean);
    const asked = process.argv[1].split(/[\s,]+/).filter(Boolean);
    const classOf = (p) => p.slice(0, p.lastIndexOf("."));
    const runners = JSON.parse(fs.readFileSync("settings/runners.json", "utf8"));
    const owner = new Map();
    for (const r of runners.runners.filter((r) => r.active)) {
      for (const c of r.classes) {
        if (owner.has(c)) { console.error(`plan: settings/runners.json gives ${c} to ${owner.get(c)} and ${r.repository}`); process.exit(1); }
        owner.set(c, r.repository);
      }
    }
    // An entry is a class or one class.setup pair (ci/balance.mjs); the entry for the pair itself wins.
    const ownerOf = (p) => owner.get(p) ?? owner.get(classOf(p)) ?? runners.default;
    const here = process.env.GITHUB_REPOSITORY;
    const same = (a, b) => a.toLowerCase() === b.toLowerCase();
    let mine = picked;
    if (here) {
      const known = [runners.default, ...owner.values()];
      if (!known.some((r) => same(r, here))) { console.error(`plan: ${here} runs no classes: it is not the default or an active runner in settings/runners.json`); process.exit(1); }
      const named = new Set(asked.filter((a) => a !== "all" && !a.startsWith("batch:")));
      const elsewhere = picked.filter((p) => (named.has(p) || named.has(classOf(p))) && !same(ownerOf(p), here));
      if (elsewhere.length > 0) { console.error(`plan: ${elsewhere.map((p) => `${p} runs in ${ownerOf(p)}`).join(", ")}; start it there (its store is there)`); process.exit(1); }
      mine = picked.filter((p) => same(ownerOf(p), here));
    }
    const manifest = fs.existsSync("out/manifest.jsonl") ? require("crypto").createHash("sha256").update(fs.readFileSync("out/manifest.jsonl")).digest("hex") : null;
    // The private commit the job checked out (compat.yml sets PRIVATE_COMMIT), else the one ci/private.ref names.
    const ref = process.env.PRIVATE_COMMIT || (fs.existsSync("ci/private.ref") ? fs.readFileSync("ci/private.ref", "utf8").trim() : null);
    // Each pair in as many jobs as settings/shards.json says (ci/balance.mjs), each job one shard: <pair>@<i>. A pair
    // it does not list is sized the same way from its minutes (settings/job-minutes.json; the median when unknown).
    const split = fs.existsSync("settings/shards.json") ? JSON.parse(fs.readFileSync("settings/shards.json", "utf8")) : { overhead: 0, target: 0, shards: {} };
    const minutes = fs.existsSync("settings/job-minutes.json") ? JSON.parse(fs.readFileSync("settings/job-minutes.json", "utf8")).minutes : {};
    const known = Object.values(minutes).sort((x, y) => x - y);
    const median = known.length > 0 ? known[Math.floor(known.length / 2)] : 60;
    const minutesOf = (p) => minutes[p] ?? median;
    const count = (p) => Math.max(1, Math.floor(split.shards[p] ?? (split.target > 0 ? Math.min(8, Math.ceil((minutesOf(p) - split.overhead) / split.target)) : 1)));
    const units = mine.flatMap((p) => Array.from({ length: count(p) }, (_, i) => ({ pair: p, shard: i, shards: count(p) })));
    // GitHub runs at most 256 jobs from one matrix.
    if (units.length > 256) { console.error(`plan: ${units.length} jobs is more than a matrix may hold (256); lower settings/shards.json`); process.exit(1); }
    const record = { repository: here ?? "local", run: process.env.GITHUB_RUN_ID ?? null, sha: process.env.GITHUB_SHA ?? null, private: ref, asked, picked, mine, units: units.map((u) => `${u.pair}@${u.shard}`), manifest };
    fs.mkdirSync("out/runs", { recursive: true });
    fs.writeFileSync(`out/runs/${record.repository.replace("/", "--")}.json`, `${JSON.stringify(record, null, 2)}
`);
    // Longest first, by the last runs minutes shared out over the shards: GitHub starts a matrix in this order as its
    // job slots free up, so the long jobs do not wait behind short ones.
    const length = (u) => split.overhead + Math.max(0, minutesOf(u.pair) - split.overhead) / u.shards;
    const order = [...units].sort((x, y) => length(y) - length(x) || (x.pair < y.pair ? -1 : x.pair > y.pair ? 1 : x.shard - y.shard));
    console.log(JSON.stringify(order.map((u) => ({ class: classOf(u.pair), setup: u.pair.slice(u.pair.lastIndexOf(".") + 1), shard: u.shard, shards: u.shards }))));
    console.error(`plan: ${mine.length} of ${picked.length} pair(s) run here${here ? ` (${here})` : ""}, in ${units.length} job(s)`);
  ' "${*:-all}" > "$pairs_out"
  echo "plan: the pairs are in $pairs_out"
}

run() {
  set_engines
  store pull-index
  filed_already run
  local list pair class setup unit log rc failed=""
  list=$(pairs_of "$out/.all-pairs.json" "$@")
  mkdir -p "$out/logs"
  store pull-profiles
  if [ "${PULL:-keys}" = all ]; then store pull-results; fi
  for pair in $list; do
    class=${pair%.*}
    setup=${pair##*.}
    # One shard of the pair (COMPAT_SHARD=i/n, host-flouest/src/shard.ts) names its log and ledger part <pair>@<i>.
    unit=$pair${COMPAT_SHARD:+@${COMPAT_SHARD%/*}}
    log="$out/logs/run-$unit.log"
    echo "== $unit ($(date -u +%H:%M:%S))"
    if [ -n "${STORE_URI:-}" ] && [ "${PULL:-keys}" != all ]; then
      npm run --silent compat -- ci/prepare.ts --library --classes "$class" --setups "$setup" --keys "$out/.keys"
      store pull-keys "$out/.keys"
    fi
    rc=0
    compat_logged "$log" run --classes "$class" --setups "$setup" --library || rc=$?
    grep -E "^(run|solo) |^  $class\.$setup " "$log" | cut -c1-200 || true
    if ! cmp -s "$out/manifest.jsonl" "$out/.manifest.pulled"; then
      echo "run: $pair filed documents the plan step did not; nothing pushed" >&2
      exit 1
    fi
    LEDGER_NAME="$unit" store push
    if [ "$rc" -ne 0 ]; then
      echo "run: $pair stopped with status $rc; what it compiled is pushed, its log is in the store (logs/$stamp/)" >&2
      failed="$failed $pair"
    fi
  done
  store push-profiles
  [ -z "$failed" ] || { echo "run: failed:$failed" >&2; exit 1; }
}

smoke() {
  set_engines
  mkdir -p "$out/logs"
  local rc=0
  compat_logged "$out/logs/smoke.log" ci/smoke.ts || rc=$?
  grep '^smoke:' "$out/logs/smoke.log" | cut -c1-300 || true
  return "$rc"
}

explain() {
  set_engines
  store pull-all
  filed_already explain
  local log="$out/logs/explain-$stamp.log" rc=0
  mkdir -p "$out/logs"
  compat_logged "$log" explain --library --limit 300 || rc=$?
  cmp -s "$out/manifest.jsonl" "$out/.manifest.pulled" || { echo "explain: it filed documents the plan step did not; nothing pushed" >&2; exit 1; }
  # The push sends the review queue explain wrote (review/ and latest/explain). Its compat tables go under
  # explain/<time>/ (ci/store.sh pull-explain): the library's from Latex-Lib/nodes/**/matrix.generated.json,
  # General's ways' from out/compat/.
  LEDGER_NAME=explain store push
  if [ -d "$out/compat" ]; then "${s3[@]}" sync --only-show-errors "$out/compat/" "${STORE_URI%/}/explain/$stamp/compat/"; fi
  (cd "$tp/.." && find Latex-Lib/nodes -name matrix.generated.json -print0 | tar -czf "$out/matrix-tables.tar.gz" --null -T -)
  "${s3[@]}" cp --only-show-errors "$out/matrix-tables.tar.gz" "${STORE_URI%/}/explain/$stamp/matrix-tables.tar.gz"
  return "$rc"
}

command=${1:-}
[ $# -gt 0 ] && shift
case "$command" in
  plan) plan "$@" ;;
  run) run "$@" ;;
  smoke) smoke ;;
  explain) explain ;;
  *) sed -n '2,/^set -euo/p' "$0" | sed '$d' >&2; exit 2 ;;
esac
