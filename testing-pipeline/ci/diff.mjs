// What changed since the previous run (testing-pipeline/ARCHITECTURE.md section 7, `ci/`; BATCHES.md steps 5 to 7).
//
//   node ci/diff.mjs <store>                                    writes <store>/verdicts.json.gz
//   node ci/diff.mjs <store> --previous <verdicts.json.gz>      and <store>/diff.md, and prints its head
//
// It reads the run's ledger parts (<store>/ledger.d/*.jsonl, as triage.mjs
// does) and keeps, for each pair (class.setup), each branch's verdict: pass,
// or the first check it fails. That is <store>/verdicts.json.gz, which the
// next run takes as --previous. A part can hold more than one run of a pair;
// only the newest is kept, and in it each cell's last line.
//
// With --previous it writes diff.md: for each pair, the branches newly passing,
// newly failing (the regressions), still failing, new and gone; then the
// regressions and the fixes grouped by the branch's way, its leaf node and
// variant, read from the document it was in (<store>/documents/<id>.json.gz).
// Branches are compared by (pair, branch id): a branch id is a hash of its
// path, so it is the same in every run, but its document is not (filing again
// can put it in another).
//
// A pair this run did not compile keeps its previous verdicts in the new
// verdicts.json.gz, so a run of a few pairs does not make the next diff
// call every other pair's branches gone. A cell the engine could not compile
// (it threw) has no verdicts; its branches that the previous run judged in the
// pair count as failing with the check `threw`, not as gone, since its
// document says which branches it held.
//
// Counts are per judged branch: every branch with a verdict in a kept cell.
// A document keeps the paths it was filed with, so a branch that has left the
// plan is still compiled and judged while its document is in use, and counted.
//
// A ledger line that is not JSON (a part cut short by a job that died) is
// skipped and counted in the headline. A --previous that names no file is
// warned about and the run is taken as the first: verdicts.json.gz is still
// written, and it exits 0, so a lost artifact does not stop the run's report.
// A verdict the ledger marks denied (a branch the library denies in its context, CP-5) is left out of every
// count and comparison, and counted apart in the Denied column; runs from before CP-5 have none.
// A branch that moves between a pass and warning:labels-changed is counted apart as a flip: TeX's "Label(s) may
// have changed" comes and goes between runs of the same LaTeX.
// Plain Node, nothing to install.
import { closeSync, existsSync, openSync, readdirSync, readFileSync, readSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { StringDecoder } from 'node:string_decoder';
import { gunzipSync, gzipSync } from 'node:zlib';

const args = process.argv.slice(2);
const store = args[0];
const at = args.indexOf('--previous');
const previousFile = at < 0 ? undefined : args[at + 1];
if (!store || store.startsWith('--') || (at >= 0 && !previousFile)) {
  console.error('usage: node ci/diff.mjs <store> [--previous <verdicts.json.gz>]');
  process.exit(2);
}
// A missing previous file is a first run, not a failure: the next run still needs this run's verdicts.
const previousMissing = previousFile !== undefined && !existsSync(previousFile);
if (previousMissing) console.warn(`diff: warning: no previous verdicts at ${previousFile}; comparing with nothing, as a first run.`);

const PASS = true;
// A verdict on a branch the library denies in its context (the ledger's `denied`, CP-5): it is meant to fail there,
// so it is neither a pass nor a failure here. It is kept, so the branch is not gone, and counted apart.
const DENIED = 'denied';
// The check that flips between runs of the same LaTeX: a move between it and a pass is a flip, counted apart.
const LABELS = 'warning:labels-changed';
const pairOf = (l) => `${l.classSetting}.${l.setup}`;

/** A file's lines a chunk at a time: a part can outgrow the longest string Node will hold. */
function* linesOf(file) {
  const fd = openSync(file, 'r');
  try {
    const chunk = Buffer.alloc(1 << 20);
    const decoder = new StringDecoder('utf8');
    let rest = '';
    for (let read = readSync(fd, chunk); read > 0; read = readSync(fd, chunk)) {
      const lines = (rest + decoder.write(chunk.subarray(0, read))).split('\n');
      rest = lines.pop() ?? '';
      for (const line of lines) if (line.trim() !== '') yield line;
    }
    rest += decoder.end();
    if (rest.trim() !== '') yield rest;
  } finally {
    closeSync(fd);
  }
}

// The previous verdicts first: --previous may be the very file this run overwrites.
let previous;
if (previousFile !== undefined && !previousMissing) {
  try {
    previous = JSON.parse(gunzipSync(readFileSync(previousFile)).toString('utf8'));
  } catch (e) {
    // A file that is there but unreadable is not a first run: carrying on would drop every pair it kept.
    console.error(`diff: cannot read previous verdicts at ${previousFile}: ${e.message}`);
    process.exit(2);
  }
}
const before = new Map(Object.entries(previous?.pairs ?? {}).map(([pair, p]) => [pair, { run: p.run, branches: new Map(Object.entries(p.branches)) }]));

// Each pair's newest run, and in it each cell's last line, cut down to what a verdict needs.
const parts = join(store, 'ledger.d');
const files = existsSync(parts) ? readdirSync(parts).filter((f) => f.endsWith('.jsonl')).sort() : [];
const runs = new Map();
let lineCount = 0;
let unparsable = 0;
for (const f of files) {
  for (const text of linesOf(join(parts, f))) {
    lineCount++;
    let l;
    try {
      l = JSON.parse(text);
    } catch {
      // A part's last line can be cut short; one bad line should not lose the run.
      unparsable++;
      continue;
    }
    if (typeof l?.cell !== 'string') continue;
    const pair = pairOf(l);
    let r = runs.get(pair);
    // Run ids are the moment the run started (`r` and digits), so they sort as strings.
    if (r === undefined || l.run > r.run) runs.set(pair, (r = { run: l.run, cells: new Map() }));
    else if (l.run < r.run) continue;
    // A verdict's failures are its own, then the document's (oracle.ts). The ledger writes the document's once, under
    // `problems` and without their `:document` suffix (ledger.ts), so a failing branch with no failure of its own
    // fails the first of them. Older lines kept every failure on each verdict, and still read right.
    const first = l.problems?.[0]?.check;
    const shared = typeof first !== 'string' ? 'unknown' : first.endsWith(':document') ? first : `${first}:document`;
    const verdicts = Array.isArray(l.verdicts) ? l.verdicts.map((v) => [v.branch, v.denied ? DENIED : v.pass ? PASS : (v.failures?.[0]?.check ?? shared)]) : undefined;
    r.cells.set(l.cell, { document: l.document, verdicts });
  }
}

// Documents are read only when a branch needs its leaf, once each.
const documents = new Map();
const documentOf = (id) => {
  if (!documents.has(id)) {
    const file = join(store, 'documents', `${id}.json.gz`);
    documents.set(id, existsSync(file) ? JSON.parse(gunzipSync(readFileSync(file)).toString('utf8')) : undefined);
  }
  return documents.get(id);
};

// This run's verdicts: per pair, branch id to PASS or its first failing check, and the document it was judged in.
const now = new Map();
for (const [pair, r] of runs) {
  const branches = new Map();
  const judgedIn = new Map();
  const unjudged = [];
  for (const { document, verdicts } of r.cells.values()) {
    if (verdicts === undefined) {
      unjudged.push(document);
      continue;
    }
    for (const [branch, verdict] of verdicts) {
      // A branch in two cells of one pair (it should not be) fails if either fails.
      if (branches.get(branch) !== undefined && branches.get(branch) !== PASS) continue;
      branches.set(branch, verdict);
      judgedIn.set(branch, document);
    }
  }
  const earlier = before.get(pair)?.branches;
  let unknown = 0;
  for (const document of unjudged) {
    const d = documentOf(document);
    const held = (d?.branches ?? []).filter((b) => earlier?.has(b) && !branches.has(b));
    if (held.length === 0) unknown++;
    for (const b of held) {
      branches.set(b, 'threw');
      judgedIn.set(b, document);
    }
  }
  now.set(pair, { run: r.run, branches, judgedIn, unjudged: unjudged.length, unknown });
}

// The next run's --previous: this run's pairs, and every earlier pair this run did not compile, as it was.
const saved = {};
for (const [pair, p] of before) if (!now.has(pair)) saved[pair] = { run: p.run, branches: Object.fromEntries(p.branches) };
for (const [pair, p] of now) saved[pair] = { run: p.run, branches: Object.fromEntries(p.branches) };
const sorted = Object.fromEntries(Object.entries(saved).sort(([a], [b]) => (a < b ? -1 : 1)));
writeFileSync(join(store, 'verdicts.json.gz'), gzipSync(JSON.stringify({ version: 1, at: new Date().toISOString(), pairs: sorted })));

const fmt = (n) => n.toLocaleString('en-US');
const passing = (m) => [...m.values()].filter((v) => v === PASS).length;
const denying = (m) => [...m.values()].filter((v) => v === DENIED).length;
let branchCount = 0;
let passCount = 0;
let deniedCount = 0;
for (const p of now.values()) {
  branchCount += p.branches.size - denying(p.branches);
  passCount += passing(p.branches);
  deniedCount += denying(p.branches);
}
let cellsKept = 0;
for (const r of runs.values()) cellsKept += r.cells.size;
const skipped = unparsable === 0 ? '' : ` (${fmt(unparsable)} not JSON, skipped)`;
const headline = `${fmt(lineCount)} ledger lines read${skipped}, ${fmt(cellsKept)} cells kept for this run, ${now.size} pair(s): ${fmt(passCount)} of ${fmt(branchCount)} judged branches pass${deniedCount === 0 ? '' : ` (${fmt(deniedCount)} more are denied in their context and left out)`}.`;
if (previous === undefined) {
  const why = previousMissing ? `the previous verdicts at ${previousFile} are missing` : 'with no --previous';
  console.log(`diff: ${headline} Wrote ${join(store, 'verdicts.json.gz')}; ${why}, there is nothing to compare.`);
  process.exit(0);
}

// The diff, pair by pair. Regressions and fixes keep where they were, for grouping by way.
const rows = [];
const regressions = [];
const fixes = [];
const total = { pairs: now.size, fixed: 0, regressed: 0, still: 0, changed: 0, fresh: 0, freshFail: 0, gone: 0, unjudged: 0, unknown: 0, denied: 0, flips: 0 };
for (const [pair, p] of now) {
  const was = before.get(pair)?.branches ?? new Map();
  const row = { pair, branches: p.branches.size - denying(p.branches), pass: passing(p.branches), fixed: 0, regressed: 0, still: 0, changed: 0, fresh: 0, freshFail: 0, gone: 0, unjudged: p.unjudged, unknown: p.unknown, denied: denying(p.branches), flips: 0, previous: before.has(pair) };
  for (const [branch, verdict] of p.branches) {
    const old = was.get(branch);
    // Denied now or before: no regression, fix or failure to compare (a run before CP-5 has no denied verdicts).
    if (verdict === DENIED || old === DENIED) continue;
    if ((old === PASS && verdict === LABELS) || (old === LABELS && verdict === PASS)) {
      row.flips++;
      continue;
    }
    const where = { pair, branch, document: p.judgedIn.get(branch), check: verdict, was: old };
    if (old === undefined) {
      row.fresh++;
      if (verdict !== PASS) row.freshFail++;
    } else if (old === PASS && verdict !== PASS) {
      row.regressed++;
      regressions.push(where);
    } else if (old !== PASS && verdict === PASS) {
      row.fixed++;
      fixes.push(where);
    } else if (old !== PASS) {
      row.still++;
      if (old !== verdict) row.changed++;
    }
  }
  for (const branch of was.keys()) if (!p.branches.has(branch)) row.gone++;
  for (const k of ['fixed', 'regressed', 'still', 'changed', 'fresh', 'freshFail', 'gone', 'unjudged', 'unknown', 'denied', 'flips']) total[k] += row[k];
  rows.push(row);
}
const notRun = [...before].filter(([pair]) => !now.has(pair));

/** A branch's way: its leaf node, way and variant, from the document it was judged in. */
const variantOf = (v) => [...Object.entries(v.compat ?? {}), ...Object.entries(v.flags ?? {})].map(([k, x]) => `${k}=${typeof x === 'string' ? x : JSON.stringify(x)}`).join(' ');
const leafOf = (where) => {
  const path = documentOf(where.document)?.paths?.find((s) => s.id === where.branch)?.path;
  const leaf = path?.[path.length - 1];
  if (leaf === undefined) return { way: '(its document is not in this store)', variant: '' };
  return { way: `${leaf.node} ${leaf.variant.way}`, variant: variantOf(leaf.variant) };
};
const byWay = (list, checkOf) => {
  const groups = new Map();
  for (const where of list) {
    const { way, variant } = leafOf(where);
    const g = groups.get(way) ?? { branches: 0, pairs: new Set(), checks: new Map(), variants: new Map(), example: where };
    g.branches++;
    g.pairs.add(where.pair);
    const check = checkOf(where);
    g.checks.set(check, (g.checks.get(check) ?? 0) + 1);
    if (variant !== '') g.variants.set(variant, (g.variants.get(variant) ?? 0) + 1);
    groups.set(way, g);
  }
  return [...groups].sort((a, b) => b[1].branches - a[1].branches || (a[0] < b[0] ? -1 : 1));
};
const top = (counts, n) => {
  const list = [...counts].sort((a, b) => b[1] - a[1]);
  return `${list.slice(0, n).map(([k, c]) => `${k.replace(/\|/g, '/')} (${fmt(c)})`).join(', ')}${list.length > n ? `, ${list.length - n} more` : ''}`;
};
const pairsOf = (set) => `${[...set].sort().slice(0, 8).join(', ')}${set.size > 8 ? `, … (${set.size})` : ''}`;
const wayTable = (title, list, checkOf, checkTitle, empty) => {
  const out = [`## ${title}`, ''];
  if (list.length === 0) return [...out, empty, ''];
  const groups = byWay(list, checkOf);
  out.push(`| Way (leaf node, way) | Branches | Pairs | ${checkTitle} | Variants | Example (pair, branch, document) |`, '|---|---|---|---|---|---|');
  for (const [way, g] of groups.slice(0, 60)) {
    const e = g.example;
    out.push(`| ${way} | ${fmt(g.branches)} | ${pairsOf(g.pairs)} | ${top(g.checks, 3)} | ${g.variants.size === 0 ? '-' : top(g.variants, 3)} | ${e.pair}, ${e.branch}, ${e.document} |`);
  }
  if (groups.length > 60) out.push('', `(${groups.length - 60} smaller groups not shown.)`);
  return [...out, ''];
};

// A store can hold hundreds of pairs, each its own run: the count and the range say enough.
const runsOf = (m) => {
  const ids = [...new Set([...m.values()].map((p) => p.run))].sort();
  if (ids.length === 0) return 'no runs';
  if (ids.length === 1) return `run ${ids[0]}`;
  return `${fmt(ids.length)} runs, ${ids[0]} to ${ids[ids.length - 1]}`;
};
const out = [];
out.push('# What changed since the previous run', '');
out.push(`This run (${runsOf(now)}) against the previous verdicts (${previousFile}, written ${previous.at ?? '?'}; ${runsOf(before)}). ${headline}`, '');
out.push(`**${fmt(total.regressed)} newly failing** (regressions), **${fmt(total.fixed)} newly passing**, ${fmt(total.still)} still failing (${fmt(total.changed)} with another first check), ${fmt(total.fresh)} new (${fmt(total.freshFail)} failing), ${fmt(total.gone)} gone. Branches are compared by pair and branch id${total.denied === 0 ? '' : `; ${fmt(total.denied)} denied in their context are left out of every count`}${total.flips === 0 ? '' : `; ${fmt(total.flips)} moved between a pass and ${LABELS}, which flips between runs of the same LaTeX, and are counted apart`}.`, '');
if (total.unjudged > 0) out.push(`${fmt(total.unjudged)} cell(s) had no verdict (the engine threw): their branches the previous run judged count as failing with \`threw\`; ${fmt(total.unknown)} of those cells held none the previous run knew.`, '');
out.push('## By pair', '', '| Pair | Branches | Pass | Newly failing | Newly passing | Still failing | New (failing) | Gone | No verdict | Denied |', '|---|---|---|---|---|---|---|---|---|---|');
for (const r of rows.sort((a, b) => b.regressed - a.regressed || b.fixed - a.fixed || (a.pair < b.pair ? -1 : 1))) {
  const still = r.changed > 0 ? `${fmt(r.still)} (${fmt(r.changed)} changed check)` : fmt(r.still);
  out.push(`| ${r.pair}${r.previous ? '' : ' (new pair)'} | ${fmt(r.branches)} | ${fmt(r.pass)} | ${fmt(r.regressed)} | ${fmt(r.fixed)} | ${still} | ${fmt(r.fresh)} (${fmt(r.freshFail)}) | ${fmt(r.gone)} | ${r.unjudged === 0 ? '-' : fmt(r.unjudged)} | ${r.denied === 0 ? '-' : fmt(r.denied)} |`);
}
out.push('');
out.push(...wayTable('Regressions by way', regressions, (w) => w.check, 'First failing check now', 'None: no branch that passed before fails now.'));
out.push(...wayTable('Fixes by way', fixes, (w) => w.was, 'First failing check before', 'None: no branch that failed before passes now.'));
if (notRun.length > 0) {
  out.push('## Pairs not in this run', '', 'Their previous verdicts are kept in the new verdicts.json.gz.', '');
  for (const [pair, p] of notRun.sort(([a], [b]) => (a < b ? -1 : 1))) out.push(`- ${pair}: ${fmt(p.branches.size)} branches, ${fmt(passing(p.branches))} passing (run ${p.run})`);
  out.push('');
}
writeFileSync(join(store, 'diff.md'), `${out.join('\n')}\n`);
console.log(out.slice(0, 60).join('\n'));
