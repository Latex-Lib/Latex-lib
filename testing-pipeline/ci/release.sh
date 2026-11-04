#!/usr/bin/env bash
# Publishes this checkout and pushes it to every runner repository (README step 5a).
#
#   ci/release.sh [--run | --keys] <public worktree> <private worktree> <sealed engine archive> <message>
#
# 0. ci/balance.mjs --write decides which runner repository runs each pair of
#    the current batch (settings/runners.json), from settings/job-minutes.json.
# 1. ci/publish.sh mirrors the checkout into both worktrees and scans the public
#    tree; any finding stops here, before anything is pushed.
# 2. The private worktree is committed (when it changed) and pushed to the
#    private companion's ci-private.
# 3. Its commit goes into the public tree as testing-pipeline/ci/private.ref:
#    every job checks the private files out at that commit (compat.yml), so one
#    public commit fixes the whole tree, in every job and every repository.
# 4. The public worktree is committed and the same commit pushed to main of the
#    default repository and of each active runner (settings/runners.json); with
#    --run also to latex-ci (each repository runs its classes of the current
#    batch), with --keys to latex-ci-keys (the plan job only). Nothing is forced.
#
# SCAN_SECRETS and SCAN_REFERENCE are publish.sh's. Run it from anywhere; the
# worktrees' git identity and stored credentials are used.
set -euo pipefail

branch=""
case "${1:-}" in
  --run) branch=latex-ci; shift ;;
  --keys) branch=latex-ci-keys; shift ;;
esac
pub=${1:?the public worktree}
priv=${2:?the private worktree}
archive=${3:?the sealed engine archive}
message=${4:?a commit message}
here=$(cd "$(dirname "$0")" && pwd)
trailer=${COMMIT_TRAILER:-}
private_repo=yguo499/Latex-lib-private
# The split between the runner repositories, made shortest for the current batch from the last runs' minutes.
node "$here/balance.mjs" --write
runners=$(node -e '
  const r = JSON.parse(require("fs").readFileSync(process.argv[1], "utf8"));
  for (const x of [r.default, ...r.runners.filter((x) => x.active).map((x) => x.repository)]) console.log(x);
' "$here/../settings/runners.json")

# Swapped worktrees would publish the private tree: each must be the checkout it is said to be, and no runner
# may be the private companion.
case "$(git -C "$priv" remote get-url origin)" in
  *"$private_repo"*) ;;
  *) echo "release: $priv is not a checkout of $private_repo" >&2; exit 1 ;;
esac
case "$(git -C "$pub" remote get-url origin)" in
  *"$private_repo"*) echo "release: $pub is a checkout of the private companion" >&2; exit 1 ;;
esac
if echo "$runners" | grep -qix "$private_repo"; then echo "release: settings/runners.json names $private_repo as a runner" >&2; exit 1; fi

# A push tried again for about ten minutes: GitHub refuses pushes in short spells (500 during an incident).
push() {
  local i
  for i in 1 2 3 4 5 6 7 8; do
    if git "$@"; then return 0; fi
    [ "$i" -lt 8 ] || break
    echo "release: the push failed (try $i of 8); trying again in $((15 * i)) s" >&2
    sleep $((15 * i))
  done
  echo "release: the push failed 8 times: git $*" >&2
  return 1
}

bash "$here/publish.sh" "$pub" "$priv" "$archive"
[ ! -e "$pub/testing-pipeline/ci/flouest.tar.gz.enc" ] || { echo "release: the public tree holds the engine archive" >&2; exit 1; }

git -C "$priv" add -A
if ! git -C "$priv" diff --cached --quiet; then git -C "$priv" commit -q -m "$message${trailer:+$'\n\n'$trailer}"; fi
push -C "$priv" push -q "https://github.com/$private_repo.git" HEAD:refs/heads/ci-private
ref=$(git -C "$priv" rev-parse HEAD)
echo "release: private ci-private at $ref"

printf '%s\n' "$ref" > "$pub/testing-pipeline/ci/private.ref"
git -C "$pub" add -A
if ! git -C "$pub" diff --cached --quiet; then git -C "$pub" commit -q -m "$message${trailer:+$'\n\n'$trailer}"; fi
sha=$(git -C "$pub" rev-parse HEAD)

for repo in $runners; do
  refs=(HEAD:refs/heads/main)
  [ -z "$branch" ] || refs+=("HEAD:refs/heads/$branch")
  push -C "$pub" push -q "https://github.com/$repo.git" "${refs[@]}"
  echo "release: $repo main${branch:+ and $branch} at $sha"
done
echo "release: fetch the runs with ci/fetch-run.sh sha:$sha <folder>"
