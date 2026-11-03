/**
 * The explainer on the fake host: from a failure the matrix shows to a
 * candidate rule with a minimal reproducer, then the review queue and the
 * compat tables.
 */
import assert from 'node:assert/strict';
import { test } from 'node:test';

import { compatTables } from '../src/compat.ts';
import {
  candidatesOf,
  decide,
  explainer,
  groupFailures,
  hostTrials,
  minimize,
  queueCandidates,
  reviewQueue,
  soloExplanations,
  type Explanation,
  type Pair,
  type PairRun,
  type Rule,
} from '../src/explain.ts';
import { branchId } from '../src/ids.ts';
import type { BranchSpec, ClassSetting, PathStep, Verdict } from '../src/model.ts';
import { MemoryStore } from '../src/memoryStore.ts';
import { judge } from '../src/oracle.ts';
import { runCells } from '../src/run.ts';
import { FakeEngine, type FakeClash, type FakeFault } from './fakeEngine.ts';
import { FakeHost } from './fakeHost.ts';
import { FakeLibrary } from './fakeLibrary.ts';
import { AMSART, ARTICLE, cellsOf, packed, planOf, SETUP_A } from './fakeRun.ts';

const host = new FakeHost();
const library = new FakeLibrary();
const variantsOf = (node: string) => host.variants(node, library.ways(node));
const REFERENCE: Pair = { classSetting: 'article', setup: 'A' };
const UNDER_AMSART: Pair = { classSetting: 'amsart', setup: 'A' };

/** The matrix on the fake host under each class setting with setup A: each pair's verdicts, and each branch's document. */
const matrix = async (depth: number, faults: readonly FakeFault[], clashes: readonly FakeClash[] = [], classSettings: readonly ClassSetting[] = [ARTICLE]) => {
  const store = new MemoryStore();
  const engine = new FakeEngine(faults, clashes);
  const plan = planOf(host, library, depth);
  const documents = packed(host, plan.branches, 64);
  const jobs = cellsOf(host, documents, classSettings, [SETUP_A]);
  const outcomes = await runCells(store, engine, jobs);
  const runs: PairRun[] = classSettings.map((cs) => ({ pair: { classSetting: cs.id, setup: 'A' }, verdicts: new Map<string, Verdict>() }));
  outcomes.forEach((outcome, i) => {
    const job = jobs[i];
    assert.ok(job);
    const run = runs.find((r) => r.pair.classSetting === job.cell.classSetting);
    for (const v of judge({ cell: outcome.cell.id, emitted: job.emitted, result: outcome.result, expected: job.expected }).verdicts) (run?.verdicts as Map<string, Verdict>).set(v.branch, v);
  });
  const byBranch = new Map(documents.flatMap((d) => d.paths.map((b) => [b.id, d.paths] as const)));
  const { groups } = groupFailures({
    runs,
    branches: new Map(plan.branches.map((b) => [b.id, b])),
    documentOf: (id) => byBranch.get(id),
    solo: () => new Map(),
    reference: REFERENCE,
  });
  const { explain } = explainer({
    trial: hostTrials({ host, store, engine, rules: host.documentRules(), classSettings, setups: [SETUP_A] }).trial,
    nesting: host.nesting(depth),
    variantsOf,
    reference: REFERENCE,
    saved: { store, fingerprint: 'fake' },
  });
  return { store, engine, plan, runs, groups, explain };
};

const BOXED_IN_NOTE: FakeFault = { outer: 'fn.kernel', inner: 'thm.boxed', message: 'LaTeX Error: Not in outer par mode.' };

test('halving keeps the one item that fails, or the two that fail only together', async () => {
  let calls = 0;
  assert.deepEqual(await minimize([1, 2, 3, 4, 5, 6, 7, 8], async (some) => (calls++, some.includes(6))), [6]);
  assert.ok(calls <= 6, `${calls} trials for one item of eight`);
  assert.deepEqual(await minimize([1, 2, 3, 4, 5, 6, 7, 8], async (some) => some.includes(2) && some.includes(7)), [2, 7]);
});

test('a nesting failure becomes a parent rule: the shortest chain, the parent that matters, and a way that works there', async () => {
  const m = await matrix(2, [BOXED_IN_NOTE]);
  const group = m.groups.find((g) => g.case.symptom.check === 'error');
  assert.ok(group);
  assert.equal(group.origin, 'nesting');
  assert.deepEqual(group.case.branch.path.map((s) => s.node), ['theorem', 'footnote', 'theorem']);
  const e = await m.explain(group.case);
  assert.equal(e.rule.kind, 'parent');
  if (e.rule.kind !== 'parent') return;
  assert.equal(e.rule.child.node, 'theorem');
  assert.deepEqual(e.rule.child.variants.map((v) => v.way), ['thm.boxed']);
  assert.deepEqual(e.rule.ancestors.map((a) => [a.node, a.variants.map((v) => v.way)]), [['footnote', ['fn.kernel']]], 'the theorem above the note only makes the place legal');
  assert.equal(e.rule.scope, 'direct');
  assert.equal(e.rule.verdict, 'fallback');
  assert.equal(e.rule.fallback?.way, 'thm.plain');
  assert.equal(e.rule.pair, undefined, 'found under the reference, it holds everywhere');
  assert.deepEqual(e.reproducer.map((b) => b.path.map((s) => s.node)), [['theorem', 'footnote', 'theorem']]);
  assert.match(e.evidence, /Not in outer par mode/);

  const compiles = m.engine.compiles;
  const again = await m.explain(group.case);
  assert.equal(again.saved, true);
  assert.equal(m.engine.compiles, compiles, 'a saved explanation compiles nothing');
});

test('a failure new under a class is explained there, and the rule is that class setting\'s when the reference passes it', async () => {
  const m = await matrix(2, [{ ...BOXED_IN_NOTE, class: 'amsart' }], [], [ARTICLE, AMSART]);
  assert.equal(m.groups.length, 1);
  const [group] = m.groups;
  assert.ok(group);
  assert.equal(group.origin, 'class');
  assert.deepEqual(group.case.pair, UNDER_AMSART);
  const e = await m.explain(group.case);
  assert.equal(e.rule.kind, 'parent');
  assert.equal(e.rule.kind === 'parent' ? e.rule.pair : undefined, 'amsart.A');
});

test('two branches that fail only together, with an error the log ties to no line, give a combination rule', async () => {
  const m = await matrix(0, [], [{ ways: ['thm.plain', 'thm.boxed'], message: 'LaTeX Error: Command \\qed already defined.' }]);
  assert.equal(m.groups.length, 1, 'one group for the whole document');
  const [group] = m.groups;
  assert.ok(group);
  assert.equal(group.origin, 'document');
  assert.equal(group.case.symptom.tied, false);
  const e = await m.explain(group.case);
  assert.equal(e.rule.kind, 'combo');
  assert.deepEqual(e.rule.kind === 'combo' ? e.rule.ways.flat().sort() : [], ['thm.boxed', 'thm.plain']);
  assert.equal(e.reproducer.length, 2);
});

test('a failure a document holding no branch shows too comes from the host\'s own preamble', async () => {
  const m = await matrix(0, [], [{ ways: [], message: 'LaTeX Error: Command \\bibhang already defined.' }]);
  const [group] = m.groups;
  assert.ok(group);
  const e = await m.explain(group.case);
  assert.deepEqual(e.rule, { kind: 'base' });
  assert.deepEqual(e.reproducer, []);
  assert.match(e.evidence, /bibhang/);
});

test('three that fail only together give a limit', async () => {
  const m = await matrix(0, [], [{ ways: ['sec.kernel', 'thm.plain', 'list.kernel'], message: 'TeX capacity exceeded, sorry [save size=50000].' }]);
  const [group] = m.groups;
  assert.ok(group);
  const e = await m.explain(group.case);
  assert.deepEqual(e.rule, { kind: 'limit', branches: 3, nodes: ['list', 'section', 'theorem'] });
});

const step = (node: string, way: string): PathStep => ({ node, variant: { way, compat: {}, flags: {} }, member: {} });
const solo = (path: readonly PathStep[]): BranchSpec => ({ id: branchId(path, true), path, marked: true });
const failing = (branch: BranchSpec, check: string, evidence: string): Verdict => ({ branch: branch.id, cell: 'c', pass: false, failures: [{ check, evidence }] });

test('what solo branches show is a defect of the leaf\'s way, or a class rule, and belongs to a node above when its solo fails the same', () => {
  const boxed = solo([step('theorem', 'thm.boxed')]);
  const list = solo([step('list', 'list.kernel')]);
  const plain = solo([step('theorem', 'thm.plain')]);
  const note = solo([step('theorem', 'thm.plain'), step('footnote', 'fn.kernel')]);
  const wide = 'Overfull \\hbox (12.0pt too wide) at lines 3--4';
  const rules = soloExplanations(
    [
      { pair: REFERENCE, branch: boxed, verdict: failing(boxed, 'warning:overfull-hbox', wide) },
      { pair: UNDER_AMSART, branch: boxed, verdict: failing(boxed, 'warning:overfull-hbox', wide) },
      { pair: UNDER_AMSART, branch: list, verdict: failing(list, 'error', 'LaTeX Error: No counter \'part\' defined. (l.9)') },
      { pair: REFERENCE, branch: plain, verdict: failing(plain, 'warning:overfull-hbox', wide) },
      { pair: REFERENCE, branch: note, verdict: failing(note, 'warning:overfull-hbox', wide) },
    ],
    REFERENCE,
  ).map((e) => e.rule);
  assert.deepEqual(rules, [
    { kind: 'defect', node: 'theorem', way: 'thm.boxed' },
    { kind: 'defect', node: 'theorem', way: 'thm.plain' },
    { kind: 'defect', node: 'theorem', way: 'thm.boxed' },
    { kind: 'class', node: 'list', way: 'list.kernel', pair: 'amsart.A' },
  ], 'the reference\'s first');
});

test('one rule is one candidate; a person\'s decision is kept apart, and only an accepted rule enters a compat table', async () => {
  const m = await matrix(2, [BOXED_IN_NOTE]);
  const group = m.groups.find((g) => g.case.symptom.check === 'error');
  assert.ok(group);
  const parent = await m.explain(group.case);
  const defect: Rule = { kind: 'defect', node: 'list', way: 'list.kernel' };
  const like = (rule: Rule, check: string): Explanation => ({ ...parent, rule, symptom: { ...parent.symptom, check } });
  const candidates = candidatesOf([
    { explanation: parent, count: 3 },
    { explanation: like(parent.rule, 'sentinel:missing'), count: 2 },
    { explanation: like(defect, 'error'), count: 1 },
  ]);
  assert.deepEqual(candidates.map((c) => [c.rule.kind, c.count, c.seen.length]), [['parent', 5, 2], ['defect', 1, 1]]);

  const store = new MemoryStore();
  queueCandidates(store, candidates, '2026-10-29T00:00:00.000Z');
  const [accepted, waiting] = candidates;
  assert.ok(accepted && waiting);
  decide(store, { candidate: accepted.id, decision: 'accept', why: 'a footnote is a confined parent', at: '2026-10-29T01:00:00.000Z' });
  assert.throws(() => decide(store, { candidate: 'r-none', decision: 'reject', at: '' }), /no candidate/);
  const queue = reviewQueue(store);
  assert.deepEqual(queue.candidates.map((c) => c.decision?.decision ?? 'pending'), ['accept', 'pending']);

  const tables = compatTables({ ways: ['thm.boxed', 'list.kernel', 'sec.kernel'], branches: m.plan.branches, runs: m.runs, candidates: queue.candidates, from: { matrix: 'test' } });
  const [boxed, list, section] = tables;
  assert.ok(boxed && list && section);
  const entries = (t: (typeof tables)[number]) => t.entries as unknown as { kind: string; parent?: { node: string; way: string } | null; status?: string; pass?: number; candidate?: string; candidates?: string[] }[];
  const inNote = entries(boxed).find((e) => e.kind === 'verified' && e.parent?.way === 'fn.kernel');
  assert.equal(inNote?.status, 'failing');
  assert.equal(inNote?.pass, 0);
  assert.equal(entries(boxed).find((e) => e.kind === 'rule')?.candidate, accepted.id);
  assert.deepEqual(entries(list).find((e) => e.kind === 'pending')?.candidates, [waiting.id]);
  assert.ok(entries(section).filter((e) => e.kind === 'verified').every((e) => e.status === 'verified-ok'), 'nothing under a section fails');
});
