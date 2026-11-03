#!/usr/bin/env bash
# Compiles a handful of documents on GitHub's runners and brings the outputs back (README step 5a; the workflow
# is .github/workflows/probe.yml; the host's `compat cases` command compiles).
#
#   ci/probe.sh <cases folder> [--repo owner/name] [--shards n] [--engines k] [--out folder] [--no-wait]
#
# A case is a folder: main.tex, any text files it reads (main.bib), and case.json naming its class setting and
# setup, { "setting": "aastex.A" } (add "dump": false to leave out the line that brings main.aux, main.bbl and
# main.blg back). The cases are pushed to the private companion's branch probe-cases (emitted LaTeX carries
# the host's macros, so they never go to a public repository), the probe workflow is started (on latex-ci, or
# on main while latex-ci does not have it yet) in --repo (Latex-Lib/Latex-lib by default), and, unless
# --no-wait, it waits for the run and brings it back with ci/fetch-run.sh into --out
# (C:/dev/template-ai/probes/<run> by default): probe/<case>/ with main.log, main.pdf, main.aux, main.bbl
# and result.json (main.blg too if the engine ever keeps it), and each job's log. --shards is how many jobs share the cases (one per 15 cases by
# default, at most 40). The key that opens the outputs is FLOUEST_KEY or the file FLOUEST_KEY_FILE names. It
# touches no store and no batch run.
set -euo pipefail

here=$(cd "$(dirname "$0")" && pwd)
cases=${1:?the cases folder}
shift
repo=Latex-Lib/Latex-lib shards="" engines=3 out="" wait=1
while [ $# -gt 0 ]; do
  case "$1" in
    --repo) repo=$2; shift 2 ;;
    --shards) shards=$2; shift 2 ;;
    --engines) engines=$2; shift 2 ;;
    --out) out=$2; shift 2 ;;
    --no-wait) wait=0; shift ;;
    *) echo "probe: unknown option $1" >&2; exit 2 ;;
  esac
done
private_repo=yguo499/Latex-lib-private
token=${GITHUB_TOKEN:-$( { printf 'protocol=https\nhost=github.com\n\n' | git credential fill 2>/dev/null || true; } | sed -n 's/^password=//p')}
[ -n "$token" ] || { echo "probe: no token (set GITHUB_TOKEN)" >&2; exit 1; }
api() { curl -fsSL -H "Authorization: Bearer $token" -H "Accept: application/vnd.github+json" "$@"; }
json() { node -e "const v = JSON.parse(require('fs').readFileSync(0, 'utf8')); console.log($1)"; }

# Everything that can be wrong is found before anything is pushed.
case "$engines" in '' | *[!0-9]*) echo "probe: --engines takes a whole number" >&2; exit 2 ;; esac
[ -z "$shards" ] || case "$shards" in *[!0-9]* | 0) echo "probe: --shards takes a whole number from 1" >&2; exit 2 ;; esac
if [ "$wait" = 1 ]; then
  [ -n "${FLOUEST_KEY:-}" ] || [ -f "${FLOUEST_KEY_FILE:-}" ] || { echo "probe: set FLOUEST_KEY or FLOUEST_KEY_FILE, which open the outputs" >&2; exit 2; }
  if [ -n "$out" ] && [ -d "$out" ] && [ -n "$(ls -A "$out")" ]; then echo "probe: $out is not empty" >&2; exit 2; fi
fi
tmp=$(mktemp -d)
trap 'rm -rf "$tmp"' EXIT
mkdir -p "$tmp/probe"
n=0
for dir in "$cases"/*/; do
  name=$(basename "$dir")
  case "$name" in .*) continue ;; esac
  [ -f "$dir/main.tex" ] && [ -f "$dir/case.json" ] || { echo "probe: $name needs main.tex and case.json" >&2; exit 1; }
  node -e '
    const c = JSON.parse(require("fs").readFileSync(process.argv[1], "utf8"));
    if (typeof c.setting !== "string" || !/^[^.]+(\.[^.]+)*\.[^.]+$/.test(c.setting)) throw new Error(`${process.argv[2]}: case.json needs "setting": "<class setting>.<setup>"`);
  ' "$dir/case.json" "$name"
  cp -r "$dir" "$tmp/probe/$name"
  n=$((n + 1))
done
[ "$n" -gt 0 ] || { echo "probe: no cases in $cases" >&2; exit 1; }
[ -n "$shards" ] || shards=$(( (n + 14) / 15 ))
[ "$shards" -le 40 ] || shards=40
[ "$shards" -le "$n" ] || shards=$n
echo "probe: $n cases, $shards job(s), on $repo"

# The cases to the private companion, as one commit of their own.
git -C "$tmp" init -q
git -C "$tmp" config core.autocrlf false
git -C "$tmp" add -A
git -C "$tmp" -c user.name="${GIT_AUTHOR_NAME:-probe}" -c user.email="${GIT_AUTHOR_EMAIL:-probe@localhost}" commit -q -m "probe: $n cases"
git -C "$tmp" push -q --force "https://github.com/$private_repo.git" HEAD:refs/heads/probe-cases
sha=$(git -C "$tmp" rev-parse HEAD)
echo "probe: cases at $private_repo@${sha:0:12}"

# Start the workflow on latex-ci, whose caches hold the batch's engine setup, once a release has put it there;
# on main until then. Its run is the one named after the cases' commit (probe.yml's run-name).
status=$(curl -s -o /dev/null -w '%{http_code}' -H "Authorization: Bearer $token" "https://api.github.com/repos/$repo/contents/.github/workflows/probe.yml?ref=latex-ci")
case "$status" in
  200) ref=latex-ci ;;
  404) ref=main ;;
  *) echo "probe: GitHub answered $status when asked for latex-ci's probe.yml" >&2; exit 1 ;;
esac
api -X POST "https://api.github.com/repos/$repo/actions/workflows/probe.yml/dispatches" \
  -d "{\"ref\":\"$ref\",\"inputs\":{\"cases\":\"$sha\",\"shards\":\"$shards\",\"engines\":\"$engines\"}}" > /dev/null
run=""
for _ in $(seq 1 60); do
  sleep 5
  run=$(api "https://api.github.com/repos/$repo/actions/workflows/probe.yml/runs?event=workflow_dispatch&branch=$ref&per_page=20" |
    json "(v.workflow_runs.find((r) => r.display_title === 'probe $sha') ?? {}).id ?? ''")
  [ -z "$run" ] || break
done
[ -n "$run" ] || { echo "probe: the run did not appear on $repo" >&2; exit 1; }
echo "probe: run $run on $ref, https://github.com/$repo/actions/runs/$run"
[ "$wait" = 1 ] || exit 0

until [ "$(api "https://api.github.com/repos/$repo/actions/runs/$run" | json 'v.status')" = completed ]; do sleep 30; done
echo "probe: run $run $(api "https://api.github.com/repos/$repo/actions/runs/$run" | json 'v.conclusion')"
out=${out:-C:/dev/template-ai/probes/$run}
bash "$here/fetch-run.sh" "$repo:$run" "$out"
echo "probe: $(find "$out/probe" -name main.log 2>/dev/null | wc -l) logs and $(find "$out/probe" -name main.pdf 2>/dev/null | wc -l) PDFs in $out/probe"
