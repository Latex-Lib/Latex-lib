// The pairs of a run that did not run through (testing-pipeline/ARCHITECTURE.md section 7, `ci/`).
//
//   node ci/incomplete.mjs <store>
//
// A pair split over several jobs (settings/shards.json) is complete when every one of its shards, <pair>@<i> in
// the plan job's run record (<store>/runs/*.json, `units`), left its ledger part (<store>/ledger.d/<pair>@<i>.jsonl).
// A pair with a shard missing (it timed out, crashed or was cancelled) would give ci/diff.mjs only part of its
// branches, and the saved verdicts would lose the rest: compat.yml's summary job sets such a pair's parts aside
// while the diff runs, so its previous verdicts are kept. Prints those pairs, one per line. Plain Node.
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const store = process.argv[2];
if (!store) {
  console.error('usage: node ci/incomplete.mjs <store>');
  process.exit(2);
}
const runs = join(store, 'runs');
const units = existsSync(runs) ? readdirSync(runs).filter((f) => f.endsWith('.json')).flatMap((f) => JSON.parse(readFileSync(join(runs, f), 'utf8')).units ?? []) : [];
const missing = new Set(units.filter((u) => !existsSync(join(store, 'ledger.d', `${u}.jsonl`))).map((u) => u.replace(/@[0-9]+$/, '')));
for (const pair of [...missing].sort()) console.log(pair);
