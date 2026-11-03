// Joins verdicts files of runs that compiled different pairs (testing-pipeline/ARCHITECTURE.md section 7, `ci/`).
//
//   node ci/merge-verdicts.mjs <out.json.gz> <verdicts.json.gz>...
//
// A verdicts file (ci/diff.mjs) keeps, per pair, the run that judged it and its branches' verdicts. Two runner
// repositories each keep their own (compat.yml), each carrying forward the pairs it did not compile; joined, each
// pair takes the entry of its newest run (run ids sort by time), which is what one run of every pair would have
// carried. ci/fetch-run.sh joins the previous verdicts this way before it runs diff.mjs over two joined runs.
// Files that are missing are skipped; with none left nothing is written and it exits 1. Plain Node.
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { gunzipSync, gzipSync } from 'node:zlib';

const [out, ...inputs] = process.argv.slice(2);
if (!out || inputs.length === 0) {
  console.error('usage: node ci/merge-verdicts.mjs <out.json.gz> <verdicts.json.gz>...');
  process.exit(2);
}
const read = inputs.filter((f) => existsSync(f)).map((f) => JSON.parse(gunzipSync(readFileSync(f)).toString('utf8')));
if (read.length === 0) {
  console.error('merge-verdicts: none of the files is there');
  process.exit(1);
}
const pairs = {};
for (const v of read) {
  for (const [pair, p] of Object.entries(v.pairs ?? {})) if (pairs[pair] === undefined || p.run > pairs[pair].run) pairs[pair] = p;
}
const at = read.map((v) => v.at ?? '').sort().at(-1);
const sorted = Object.fromEntries(Object.keys(pairs).sort().map((k) => [k, pairs[k]]));
writeFileSync(out, gzipSync(JSON.stringify({ version: 1, at, pairs: sorted })));
console.log(`merge-verdicts: ${Object.keys(sorted).length} pairs from ${read.length} file(s)`);
