/**
 * Filing: new branches packed as Flouest packs them, into documents that never
 * change, named in an append-only manifest.
 */
import assert from 'node:assert/strict';
import { test } from 'node:test';

import { documentAt, fileBranches, MANIFEST, packBranches } from '../src/file.ts';
import { branchId } from '../src/ids.ts';
import type { BranchSpec, DocumentRules, NodeId } from '../src/model.ts';
import { MemoryStore } from '../src/memoryStore.ts';

const RULES: DocumentRules = { version: 'r1', alone: ['title'], last: ['appendix'] };

/** A branch down `nodes`, its root at `root`'s variant, `n` keeping it apart from its siblings. */
const branch = (nodes: readonly NodeId[], n: number, root = 'a'): BranchSpec => {
  const path = nodes.map((node, i) => ({ node, variant: { way: i === 0 ? root : 'k', compat: {}, flags: {} }, member: { n } }));
  return { id: branchId(path), path };
};

test('a root\'s branches stay together while they fit; a root that does not fit what is left starts the next document', () => {
  const a = [0, 1, 2].map((n) => branch(['section', 'para'], n, 'a'));
  const b = [0, 1].map((n) => branch(['section', 'para'], n, 'b'));
  const docs = packBranches([...a, ...b], RULES, 4);
  assert.deepEqual(docs.map((d) => d.paths.map((p) => p.path[0]?.variant.way)), [['a', 'a', 'a'], ['b', 'b']]);
});

test('a root of more than the size fills documents in a row', () => {
  const a = [0, 1, 2, 3, 4].map((n) => branch(['section', 'para'], n, 'a'));
  assert.deepEqual(packBranches(a, RULES, 2).map((d) => d.branches.length), [2, 2, 1]);
});

test('a title is a document of its own, and an appendix goes after the other branches of its document', () => {
  const appendix = branch(['appendix', 'para'], 0, 'a');
  const title = branch(['title'], 0, 'a');
  const para = branch(['para'], 1, 'a');
  const docs = packBranches([appendix, title, para], RULES, 8);
  assert.deepEqual(docs.map((d) => d.paths.map((p) => p.path[0]?.node)), [['appendix'], ['title'], ['para']]);
  const together = packBranches([appendix, para], { ...RULES, alone: [] }, 8);
  assert.deepEqual(together.map((d) => d.paths.map((p) => p.path[0]?.node)), [['para', 'appendix']], 'one document, the appendix last');
});

test('branches that need different things of their document never share one; those that need the same are packed as usual', () => {
  const cites = [0, 1, 2].map((n) => branch(['para', 'cite'], n, 'a'));
  const plain = [0, 1].map((n) => branch(['para'], n + 10, 'a'));
  const needs = (b: BranchSpec) => (b.path.some((s) => s.node === 'cite') ? ['bibliography'] : []);
  const docs = packBranches([cites[0], plain[0], cites[1], plain[1], cites[2]].filter((b) => b !== undefined), RULES, 8, needs);
  assert.deepEqual(docs.map((d) => d.paths.map((p) => needs(p).join() || '-')), [['bibliography', 'bibliography', 'bibliography'], ['-', '-']]);
  const store = new MemoryStore();
  const filed = fileBranches(store, [...cites, ...plain], RULES, { size: 2, requires: needs });
  assert.deepEqual(filed.documents.map((d) => d.document.paths.map((p) => needs(p).join() || '-')), [['bibliography', 'bibliography'], ['bibliography'], ['-', '-']]);
});

test('a document holds no more branches holding a node than its limit; the next one starts a new document', () => {
  const appendices = [0, 1, 2, 3, 4].map((n) => branch(['appendix', 'para'], n, 'a'));
  const docs = packBranches(appendices, { ...RULES, limits: { appendix: 2 } }, 8);
  assert.deepEqual(docs.map((d) => d.branches.length), [2, 2, 1]);
  const mixed = packBranches([...appendices.slice(0, 3), branch(['para'], 9, 'a')], { ...RULES, limits: { appendix: 2 } }, 8);
  assert.deepEqual(mixed.map((d) => d.paths.map((p) => p.path[0]?.node)), [['appendix', 'appendix'], ['para', 'appendix']], 'a branch without the node is not held back');
});

test('filing again files only what no document holds, and the documents filed before are used as they were', () => {
  const store = new MemoryStore();
  const first = [0, 1, 2].map((n) => branch(['para'], n));
  const one = fileBranches(store, first, RULES, { size: 2 });
  assert.equal(one.filed.length, 2);
  assert.equal([...store.read(MANIFEST)].length, 2);
  const again = fileBranches(store, first, RULES, { size: 2 });
  assert.deepEqual(again.filed, []);
  assert.deepEqual(again.documents.map((d) => d.document.id), one.documents.map((d) => d.document.id));

  const more = [...first, branch(['para'], 9, 'z')];
  const grown = fileBranches(store, more, RULES, { size: 2 });
  assert.equal(grown.filed.length, 1);
  assert.deepEqual(grown.documents.slice(0, 2).map((d) => d.document.id), one.documents.map((d) => d.document.id));
  assert.ok(store.get(documentAt(grown.filed[0] ?? '')) !== undefined, 'each document is saved with its paths');
});

test('a document whose branches all left the plan drops out; one that keeps some is used whole', () => {
  const store = new MemoryStore();
  const all = [0, 1, 2].map((n) => branch(['para'], n));
  fileBranches(store, all, RULES, { size: 2 });
  const fewer = fileBranches(store, all.slice(0, 1), RULES, { size: 2 });
  assert.equal(fewer.documents.length, 1);
  assert.equal(fewer.documents[0]?.document.paths.length, 2, 'built whole, as filed');
  assert.deepEqual(fewer.documents[0]?.current, [all[0]?.id]);
});

test('other rules are another filing', () => {
  const store = new MemoryStore();
  const all = [0, 1].map((n) => branch(['para'], n));
  fileBranches(store, all, RULES, { size: 2 });
  assert.equal(fileBranches(store, all, { ...RULES, version: 'r2' }, { size: 2 }).filed.length, 1);
});

test('branches that hold different values of one slot never share a document; a root splits into runs that claim alike', () => {
  const plain = [0, 1].map((n) => branch(['section', 'para'], n, 'a'));
  const fleqn = [2, 3].map((n) => branch(['section', 'para'], n, 'a'));
  const free = branch(['section', 'para'], 4, 'a');
  const claims = (b: BranchSpec): string[] => (plain.includes(b) ? ['options:amsmath='] : fleqn.includes(b) ? ['options:amsmath=fleqn', 'claim:theorem-engine=thm.amsthm'] : []);
  const docs = packBranches([plain[0], fleqn[0], free, plain[1], fleqn[1]].filter((b) => b !== undefined), RULES, 8, () => [], claims);
  assert.deepEqual(docs.map((d) => d.paths.map((p) => claims(p)[0] ?? '-')), [['options:amsmath=', '-', 'options:amsmath='], ['options:amsmath=fleqn', 'options:amsmath=fleqn']], 'a branch that claims nothing goes with the first run');
  assert.deepEqual(
    packBranches([...plain, ...fleqn], RULES, 8).map((d) => d.branches.length),
    [4],
    'with no claims, as before',
  );
  // A run that agrees with the open document joins it; one that does not starts the next.
  const other = [5, 6].map((n) => branch(['section', 'para'], n, 'b'));
  const withOther = (b: BranchSpec): string[] => (other.includes(b) ? ['options:amsmath=fleqn'] : claims(b));
  const joined = packBranches([...fleqn, ...other], RULES, 8, () => [], withOther);
  assert.deepEqual(joined.map((d) => d.branches.length), [4], 'a slot the other does not claim is no clash');
  const apart = packBranches([...plain, ...other], RULES, 8, () => [], withOther);
  assert.deepEqual(apart.map((d) => d.branches.length), [2, 2]);
  const store = new MemoryStore();
  assert.equal(fileBranches(store, [...plain, ...fleqn], RULES, { size: 8, claims }).documents.length, 2, 'fileBranches passes claims on');
});

test('a run the open document disagrees with goes into the first earlier document it agrees with and fits in', () => {
  const a = [0, 1].map((n) => branch(['section', 'para'], n, 'a'));
  const b = [2, 3].map((n) => branch(['section', 'para'], n, 'b'));
  const c = [4, 5].map((n) => branch(['section', 'para'], n, 'c'));
  const claims = (x: BranchSpec): string[] => [b.includes(x) ? 'options:amsmath=fleqn' : 'options:amsmath='];
  const docs = packBranches([...a, ...b, ...c], RULES, 8, () => [], claims);
  assert.deepEqual(docs.map((d) => d.paths.map((p) => p.path[0]?.variant.way)), [['a', 'a', 'c', 'c'], ['b', 'b']]);
  assert.deepEqual(packBranches([...a, ...b, ...c], RULES, 3, () => [], claims).map((d) => d.branches.length), [2, 2, 2], 'only into one it fits in whole');
});

test('a branch that clashes with itself shares a document only with branches that clash alike', () => {
  const [self, twin, clean] = [0, 1, 2].map((n) => branch(['section', 'para'], n, 'a'));
  const claims = (x: BranchSpec): string[] => (x === self || x === twin ? ['defines:env:theorem=thm.amsthm', 'defines:env:theorem=thm.kernel'] : x === clean ? [] : []);
  const docs = packBranches([self, clean, twin].filter((b) => b !== undefined), RULES, 8, () => [], claims);
  assert.deepEqual(docs.map((d) => d.branches.length), [2, 1]);
  assert.deepEqual(docs[1]?.branches, [clean?.id], 'the branch that claims nothing is kept out of the clash');
});
