#!/usr/bin/env bash
# The table of a run's pairs (testing-pipeline/ARCHITECTURE.md section 7, `ci/`): one row per job from
# <dir>/logs/run-<pair>[@<shard>].log and logs/bisect-<pair>[@<shard>].log, as markdown on stdout. The summary job of compat.yml
# writes it; ci/fetch-run.sh writes it again over two joined runs, where it is the same table one run of every
# pair would have given.
#
#   ci/summary.sh <dir>
set -euo pipefail

dir=${1:?the folder that holds logs/}
echo "## compat run"
echo
echo '| pair | run | solo | bisect |'
echo '|---|---|---|---|'
for log in "$dir"/logs/run-*.log; do
  [ -f "$log" ] || continue
  pair=${log##*/run-}; pair=${pair%.log}
  # A shard's log (<pair>@<i>) names the pair without its shard.
  base=${pair%@*}
  # A pair with no summary line (its compile died) or no bisect log (bisect 0, or it crashed) still gets its row.
  line=$(grep -E "^  $base " "$log" | head -1 | sed -E 's/^ +[^ ]+ +//' | cut -c1-140 || true)
  solo=$(grep -E "^  $base " "$log" | sed -n 2p | sed -E 's/^ +[^ ]+ +//' | cut -c1-140 || true)
  bisect=$(grep -E "^bisect: $base: [0-9]+ group" "$dir/logs/bisect-$pair.log" 2>/dev/null | head -1 | sed -E 's/^bisect: [^:]+: //' | cut -c1-160 || true)
  echo "| $pair | ${line:-(no summary: see its log)} | $solo | $bisect |"
done
