/**
 * The acceptance test for growing the library (ARCHITECTURE.md section 6),
 * through core's own plan and filer: add a way, and every branch planned
 * before keeps its id, every document filed before is used as filed and comes
 * back from the store, and only documents of the new way's branches compile.
 * Remove the way again: nothing is filed, nothing compiles, and every old
 * cell's latest ledger line is as it was.
 */
import assert from 'node:assert/strict';
import { test } from 'node:test';

import { fileBranches, MANIFEST } from '../src/file.ts';
import { variantKey } from '../src/ids.ts';
import type { BranchSpec, Setup } from '../src/model.ts';
import type { Store } from '../src/ports.ts';
import { latestByCell, newRun, recordRun } from '../src/ledger.ts';
import { runCells } from '../src/run.ts';
import { MemoryStore } from '../src/memoryStore.ts';
import { FakeEngine } from './fakeEngine.ts';
import { FakeHost } from './fakeHost.ts';
import { FakeLibrary, FRAMED } from './fakeLibrary.ts';
import { ARTICLE, cellsOf, planOf, SETUP_A, SETUP_B } from './fakeRun.ts';

const DEPTH = 2;
const SIZE = 8;
const SETUPS: readonly Setup[] = [SETUP_A, SETUP_B];
const host = new FakeHost();
const rules = host.documentRules();
const before = new FakeLibrary();
const after = before.with(FRAMED);

const usesFramed = (branch: BranchSpec): boolean => branch.path.some((step) => step.variant.way === FRAMED.id);

/** Plan, file and run under `library`, and record the run. */
const runWith = async (store: Store, engine: FakeEngine, library: FakeLibrary) => {
  const plan = planOf(host, library, DEPTH);
  const filing = fileBranches(store, plan.branches, rules, { size: SIZE, requires: (branch) => host.requires(branch) });
  const jobs = cellsOf(host, filing.documents.map((d) => d.document), [ARTICLE], SETUPS);
  const summary = recordRun(store, await runCells(store, engine, jobs), newRun(), engine.fingerprint());
  return { plan, filing, jobs, summary };
};

test('adding a way keeps every branch of the split, and adds only branches that hold it', () => {
  const old = planOf(host, before, DEPTH);
  const grown = planOf(host, after, DEPTH);
  const oldIds = new Set(old.branches.map((b) => b.id));
  const grownIds = new Set(grown.branches.map((b) => b.id));
  assert.equal(oldIds.size, old.branches.length, 'no two branches share an id');
  for (const id of oldIds) {
    if (grownIds.has(id)) continue;
    // Only a top-up may leave: its member is now taken by one of the new branches.
    assert.ok(old.toppedUp.includes(id), `branch ${id} kept its id`);
    const leaf = old.branches.find((b) => b.id === id)?.path.at(-1);
    const use = grown.uses.find((u) => u.node === leaf?.node && leaf && u.variant === variantKey(leaf.variant));
    assert.ok(use && use.shown.length >= Math.min(use.cover, use.members), `the member topped up by ${id} is still shown`);
  }
  const added = grown.branches.filter((b) => !oldIds.has(b.id));
  assert.ok(added.length > 0);
  assert.ok(added.every(usesFramed));
  assert.equal(added.length, grown.branches.filter(usesFramed).length);
});

test('after adding a way, only documents of its branches are filed and compiled; every old cell comes from the store', async () => {
  const store = new MemoryStore();
  const engine = new FakeEngine();
  const first = await runWith(store, engine, before);
  assert.equal(first.summary.cached, 0);
  assert.equal(first.summary.compiled, first.filing.documents.length * SETUPS.length);

  const second = await runWith(store, engine, after);
  const oldDocuments = new Set(first.filing.documents.map((d) => d.document.id));
  assert.ok(second.filing.filed.length > 0);
  for (const id of second.filing.filed) {
    const document = second.filing.documents.find((d) => d.document.id === id)?.document;
    assert.ok(document?.paths.every(usesFramed), 'a new document holds only the new way\'s branches');
  }
  const used = second.filing.documents.filter((d) => !second.filing.filed.includes(d.document.id)).map((d) => d.document.id);
  assert.ok(used.every((id) => oldDocuments.has(id)), 'every other document used is an old one, as filed');
  const current = new Set(second.plan.branches.map((b) => b.id));
  for (const d of first.filing.documents) {
    if (used.includes(d.document.id)) continue;
    // Only a document all of whose branches left the plan drops out: top-ups whose members the new way now shows.
    assert.ok(d.document.branches.every((id) => !current.has(id) && first.plan.toppedUp.includes(id)), `${d.document.id} dropped out`);
  }
  assert.equal(second.summary.cached, used.length * SETUPS.length, 'every old cell still used came from the store');
  assert.equal(second.summary.compiled, second.filing.filed.length * SETUPS.length, 'only the new cells compiled');
  assert.equal(engine.compiles, first.summary.compiled + second.summary.compiled);
});

test('removing the way again files nothing, compiles nothing, and every old cell reads as before', async () => {
  const store = new MemoryStore();
  const engine = new FakeEngine();
  const first = await runWith(store, engine, before);
  const asFirst = latestByCell(store);
  await runWith(store, engine, after);
  const manifest = [...store.read(MANIFEST)].length;
  const compiles = engine.compiles;

  const third = await runWith(store, engine, before);
  assert.deepEqual(third.filing.filed, []);
  assert.equal([...store.read(MANIFEST)].length, manifest, 'the manifest only grows when something new is filed');
  assert.deepEqual(third.filing.documents.map((d) => d.document.id), first.filing.documents.map((d) => d.document.id), "the way's documents dropped out");
  assert.equal(third.summary.compiled, 0);
  assert.equal(engine.compiles, compiles);
  const now = latestByCell(store);
  for (const { cell } of first.jobs) {
    const was = asFirst.get(cell.id);
    const is = now.get(cell.id);
    assert.ok(was && is);
    assert.equal(is.result, was.result);
    assert.equal(is.status, was.status);
    assert.deepEqual(is.errors, was.errors);
  }
});
