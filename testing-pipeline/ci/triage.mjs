// The triage report of a run (testing-pipeline/ARCHITECTURE.md section 7, `ci/`; BATCHES.md step 6).
//
//   node ci/triage.mjs <store>     writes <store>/triage.md, and prints its head
//
// It reads the run's ledger parts (<store>/ledger.d/*.jsonl, one per pair) and
// groups every failing cell by the first TeX error its log gives, numbers
// written as N, so the same mistake under every class is one line; cells with
// no TeX error are grouped by the checks their branches fail. Each group says
// how many cells, documents, branches and pairs it holds, and shows one
// example: the pair, the document, the result's key and the log's lines from
// the error on (<store>/results/<key>.json.gz). Fixing starts from the biggest
// groups. A verdict the ledger marks denied (CP-5) is left out of the counts, and a cell whose only failing
// branches are denied is no failing cell. Plain Node, nothing to install.
import { existsSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { gunzipSync } from 'node:zlib';

const store = process.argv[2];
if (!store) {
  console.error('usage: node ci/triage.mjs <store>');
  process.exit(2);
}
const parts = join(store, 'ledger.d');
const files = existsSync(parts) ? readdirSync(parts).filter((f) => f.endsWith('.jsonl')).sort() : [];

const normal = (message) => message.replace(/\s+/g, ' ').replace(/[0-9a-f]{12,}/g, 'H').replace(/\d+(\.\d+)?/g, 'N').trim().slice(0, 160);
const pairOf = (l) => `${l.classSetting}.${l.setup}`;

const pairs = new Map();
const errors = new Map();
const checks = new Map();
let cells = 0;
// One pair's part at a time, so the run's whole ledger is never held at once.
for (const f of files) for (const text of readFileSync(join(parts, f), 'utf8').split('\n')) {
  if (text.trim() === '') continue;
  let l;
  try {
    l = JSON.parse(text);
  } catch {
    continue; // a line cut short, by a job stopped mid-write
  }
  cells++;
  const pair = pairOf(l);
  const p = pairs.get(pair) ?? { cells: 0, pass: 0, fail: 0, denied: 0, failingCells: 0 };
  p.cells++;
  // A branch denied in its context (the ledger's `denied`) is meant to fail there: it is counted apart, and a cell
  // whose only failing branches are denied is no failing cell.
  const judged = (l.verdicts ?? []).filter((v) => !v.denied);
  const failing = judged.filter((v) => !v.pass);
  const deniedFailing = (l.verdicts ?? []).filter((v) => v.denied && !v.pass).length;
  p.pass += judged.length - failing.length;
  p.fail += failing.length;
  p.denied += (l.verdicts ?? []).length - judged.length;
  pairs.set(pair, p);
  const first = l.errors?.[0]?.message ?? (l.status === 'threw' ? `the engine could not compile: ${l.threw ?? ''}` : l.status === 'no-output' ? 'no output' : undefined);
  if (failing.length === 0 && (first === undefined || deniedFailing > 0)) continue;
  p.failingCells++;
  if (first !== undefined) {
    const key = normal(first);
    const g = errors.get(key) ?? { cells: 0, branches: 0, documents: new Set(), pairs: new Set(), example: l };
    g.cells++;
    g.branches += failing.length;
    g.documents.add(l.document);
    g.pairs.add(pair);
    errors.set(key, g);
  } else {
    // The document's own failures are written once, under `problems`, not on each verdict (core/src/ledger.ts):
    // every failing branch of the cell carries them too.
    const shared = l.problems ?? [];
    for (const v of failing) {
      const failures = [...(v.failures ?? []), ...shared];
      for (const name of new Set(failures.map((f) => f.check.replace(/:document$/, '')))) {
        const g = checks.get(name) ?? { branches: 0, pairs: new Set(), example: { line: l, evidence: failures.find((f) => f.check.startsWith(name))?.evidence ?? '' } };
        g.branches++;
        g.pairs.add(pair);
        checks.set(name, g);
      }
    }
  }
}

/** The log's first TeX error, without LaTeX's help text, down to the `l.<line>` it names and the line after. */
const BOILERPLATE = /^(See the LaTeX manual|Type {2}H <return>|You're in trouble here|\s*\.\.\.\s*$|\s*$)/;
const excerpt = (result) => {
  const file = join(store, 'results', `${result}.json.gz`);
  if (!existsSync(file)) return '(the result is not in this store)';
  const at = (JSON.parse(gunzipSync(readFileSync(file)).toString('utf8')).log ?? '').split('\n');
  const i = at.findIndex((x) => x.startsWith('! '));
  if (i < 0) return at.slice(-6).join('\n');
  const kept = [at[i]];
  for (let j = i + 1; j < at.length && j < i + 25 && kept.length < 10; j++) {
    if (BOILERPLATE.test(at[j])) continue;
    kept.push(at[j]);
    if (at[j].startsWith('l.')) {
      if (at[j + 1] !== undefined && at[j + 1].trim() !== '') kept.push(at[j + 1]);
      break;
    }
  }
  return kept.map((x) => x.slice(0, 200)).join('\n');
};

const fmt = (n) => n.toLocaleString('en-US');
const out = [];
const total = [...pairs.values()].reduce((t, p) => ({ pass: t.pass + p.pass, fail: t.fail + p.fail, denied: t.denied + p.denied, cells: t.cells + p.cells }), { pass: 0, fail: 0, denied: 0, cells: 0 });
out.push('# Triage', '', `${fmt(cells)} cells in ${pairs.size} pair(s): ${fmt(total.pass)} branches pass, ${fmt(total.fail)} fail${total.denied === 0 ? '' : ` (${fmt(total.denied)} denied in their context, left out)`}. Biggest groups first; fix the cause of a group, not its cells (BATCHES.md step 6).`, '');
out.push('## By pair', '', '| Pair | Cells | Branches pass | Fail | Pass rate | Cells failing |', '|---|---|---|---|---|---|');
for (const [pair, p] of [...pairs].sort((a, b) => b[1].fail - a[1].fail)) {
  out.push(`| ${pair} | ${fmt(p.cells)} | ${fmt(p.pass)} | ${fmt(p.fail)} | ${p.pass + p.fail === 0 ? '-' : `${Math.round((100 * p.pass) / (p.pass + p.fail))}%`} | ${fmt(p.failingCells)} |`);
}
out.push('', '## TeX errors, by the first error of each failing cell', '');
const errorGroups = [...errors].sort((a, b) => b[1].branches - a[1].branches || b[1].cells - a[1].cells);
errorGroups.slice(0, 40).forEach(([key, g], i) => {
  const e = g.example;
  out.push(`### ${i + 1}. \`${key.replace(/`/g, "'")}\``, '');
  out.push(`${fmt(g.cells)} cells, ${fmt(g.documents.size)} documents, ${fmt(g.branches)} failing branches, ${g.pairs.size} pair(s): ${[...g.pairs].sort().slice(0, 12).join(', ')}${g.pairs.size > 12 ? ', …' : ''}`, '');
  out.push(`Example: ${pairOf(e)}, document ${e.document}, cell ${e.cell}, result ${e.result}`, '', '```', excerpt(e.result), '```', '');
});
if (errorGroups.length > 40) out.push(`(${errorGroups.length - 40} smaller groups not shown.)`, '');
out.push('## Failing checks in cells with no TeX error', '', '| Check | Failing branches | Pairs | Example (pair, document: evidence) |', '|---|---|---|---|');
for (const [name, g] of [...checks].sort((a, b) => b[1].branches - a[1].branches).slice(0, 25)) {
  out.push(`| ${name} | ${fmt(g.branches)} | ${g.pairs.size} | ${pairOf(g.example.line)}, ${g.example.line.document}: ${g.example.evidence.replace(/\|/g, '/').replace(/\s+/g, ' ').slice(0, 120)} |`);
}
writeFileSync(join(store, 'triage.md'), `${out.join('\n')}\n`);
console.log(out.slice(0, 60).join('\n'));
