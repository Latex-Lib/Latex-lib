#!/usr/bin/env bash
# Checks the private companion out at a commit or branch, over SSH with the read-only deploy key, trying again for
# about nine minutes (compat.yml, probe.yml). GitHub's Git operations fail in short spells: on 2026-11-04 a working
# key got "Permission denied (publickey)" for minutes during an incident, and actions/checkout gives up after three
# tries in about 40 s, which loses the job.
#
#   ci/private-checkout.sh <commit or branch> <folder>
#
# PRIVATE_DEPLOY_KEY holds the key; GITHUB_TOKEN, when set, is used for reading GitHub's SSH host keys from its meta
# API over HTTPS, so the host is checked strictly. The folder keeps its .git, so the commit can be read back.
set -euo pipefail

ref=${1:?a commit or branch of the private companion}
dir=${2:?the folder to check it out in}
: "${PRIVATE_DEPLOY_KEY:?the deploy key is not set}"
tmp=$(mktemp -d)
trap 'rm -rf "$tmp"' EXIT
printf '%s\n' "$PRIVATE_DEPLOY_KEY" > "$tmp/key"
chmod 600 "$tmp/key"

auth=()
[ -z "${GITHUB_TOKEN:-}" ] || auth=(-H "Authorization: Bearer $GITHUB_TOKEN")
for i in 1 2 3 4 5 6; do
  if curl -fsS "${auth[@]}" https://api.github.com/meta -o "$tmp/meta.json"; then break; fi
  [ "$i" -lt 6 ] || { echo "private: GitHub's host keys could not be read" >&2; exit 1; }
  sleep $((10 * i))
done
node -e 'for (const k of JSON.parse(require("fs").readFileSync(process.argv[1], "utf8")).ssh_keys) console.log(`github.com ${k}`);' "$tmp/meta.json" > "$tmp/known_hosts"
export GIT_SSH_COMMAND="ssh -i $tmp/key -o IdentitiesOnly=yes -o UserKnownHostsFile=$tmp/known_hosts -o StrictHostKeyChecking=yes"

mkdir -p "$dir"
git init -q "$dir"
git -C "$dir" remote add origin git@github.com:yguo499/Latex-lib-private.git 2>/dev/null || git -C "$dir" remote set-url origin git@github.com:yguo499/Latex-lib-private.git
for i in 1 2 3 4 5 6 7 8; do
  if git -C "$dir" fetch -q --no-tags --depth=1 origin "$ref"; then
    git -C "$dir" checkout -q --force FETCH_HEAD
    echo "private: checked out at try $i"
    exit 0
  fi
  [ "$i" -lt 8 ] || break
  echo "private: the fetch failed (try $i of 8); trying again in $((20 * i)) s" >&2
  sleep $((20 * i))
done
echo "private: the fetch failed 8 times" >&2
exit 1
