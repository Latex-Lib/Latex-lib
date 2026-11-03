/**
 * The plan: every place split by every variant, ids made from paths, members
 * picked by hash where the host keeps them, and the cover topped up.
 */
import assert from 'node:assert/strict';
import { test } from 'node:test';

import { branchId, variantKey } from '../src/ids.ts';
import type { HostVariant, NestingNode, NestingTree, NodeId } from '../src/model.ts';
import { markedOf, planBranches, soloBranches, soloKey, type VariantsOf } from '../src/plan.ts';
import { FakeHost } from './fakeHost.ts';
import { FakeLibrary } from './fakeLibrary.ts';
import { planOf } from './fakeRun.ts';

const host = new FakeHost();
const library = new FakeLibrary();

/** How many branches the split makes: each leaf path, times the variants of every node on it. */
const leafCombinations = (nodes: readonly NestingNode[], variants: (node: NodeId) => number): number =>
  nodes.reduce((sum, n) => sum + variants(n.node) * (n.children.length === 0 ? 1 : leafCombinations(n.children, variants)), 0);

test('every place is split by every variant of its node, and each branch is named by its path', () => {
  const nesting = host.nesting(2);
  const plan = planOf(host, library, 2);
  const count = (node: NodeId) => host.variants(node, library.ways(node)).length;
  assert.equal(plan.branches.length - plan.toppedUp.length, leafCombinations(nesting.roots, count));
  assert.equal(new Set(plan.branches.map((b) => b.id)).size, plan.branches.length);
  for (const b of plan.branches) assert.equal(b.id, branchId(b.path));
  assert.deepEqual(plan.stranded, []);
  assert.deepEqual(plan.bare, []);
});

test('the plan is the same however often it is made', () => {
  assert.deepEqual(planOf(host, library, 2), planOf(host, library, 2));
});

test('about half the branches carry the marked runs, read from the id', () => {
  const { branches } = planOf(host, library, 2);
  const marked = branches.filter((b) => markedOf(b.id)).length;
  assert.ok(marked > branches.length * 0.3 && marked < branches.length * 0.7, `${marked} of ${branches.length}`);
});

// Three nodes: a list item may sit in a list or a quote, and has a term only in a description list.
const nesting: NestingTree = {
  depth: 1,
  roots: [
    { node: 'list', children: [{ node: 'item', children: [] }] },
    { node: 'quote', children: [{ node: 'item', children: [] }] },
  ],
};
const variant = (way: string) => ({ way, compat: {}, flags: {} });
const LIST: HostVariant = {
  variant: variant('list.kernel'),
  members: [{ values: { style: 'bullet' } }, { values: { style: 'description' } }],
  cover: 2,
};
const ITEM: HostVariant = {
  variant: variant('item.kernel'),
  members: [{ values: { term: '' } }, { values: { term: 'Word' }, needs: { node: 'list', values: { style: 'description' } } }],
  cover: 2,
};
const TERM_ONLY: HostVariant = {
  variant: variant('item.term'),
  members: [{ values: { term: 'Word' }, needs: { node: 'list', values: { style: 'description' } } }],
  cover: 1,
};

test('a member the host keeps only under one parent is taken only there; a variant with none that fits is stranded', () => {
  const variantsOf: VariantsOf = (node) => (node === 'list' ? [LIST] : node === 'item' ? [ITEM, TERM_ONLY] : [{ variant: variant('quote.kernel'), members: [{ values: {} }], cover: 1 }]);
  const plan = planBranches(nesting, variantsOf);
  for (const b of plan.branches) {
    const [parent, item] = b.path;
    if (item?.member['term'] === 'Word') assert.deepEqual([parent?.node, parent?.member['style']], ['list', 'description'], 'a term only in a description list');
  }
  assert.ok(plan.stranded.includes(`item ${variantKey(TERM_ONLY.variant)}`), 'an item that must have a term finds no member in a quote');
  assert.ok(!plan.branches.some((b) => b.path[0]?.node === 'quote' && b.path[1]?.member['term'] === 'Word'));
  const termOnly = plan.uses.find((u) => u.node === 'item' && u.variant === variantKey(TERM_ONLY.variant));
  assert.deepEqual(termOnly?.shown, [0], 'it is taken where it fits, or topped up under a parent that holds it');
});

test('every member of each cover is shown: those no branch took are topped up at the node\'s shallowest place', () => {
  const many: HostVariant = { variant: variant('item.many'), members: Array.from({ length: 6 }, (_, i) => ({ values: { n: i } })), cover: 6 };
  const variantsOf: VariantsOf = (node) => (node === 'list' ? [LIST] : node === 'item' ? [many] : [{ variant: variant('quote.kernel'), members: [{ values: {} }], cover: 1 }]);
  const plan = planBranches(nesting, variantsOf);
  const use = plan.uses.find((u) => u.node === 'item');
  assert.deepEqual(use?.shown, [0, 1, 2, 3, 4, 5]);
  const items = plan.branches.filter((b) => plan.toppedUp.includes(b.id) && b.path.at(-1)?.node === 'item');
  assert.ok(items.length >= 3, 'two places took two members, so at least three more were topped up');
  for (const b of items) assert.deepEqual(b.path.map((s) => s.node), ['list', 'item'], 'at the shallowest place, under the first variant');
});

test('a variant added to a parent keeps every old branch, and adds only branches that hold it', () => {
  const quote: HostVariant = { variant: variant('quote.kernel'), members: [{ values: {} }], cover: 1 };
  const base: VariantsOf = (node) => (node === 'list' ? [LIST] : node === 'item' ? [ITEM] : [quote]);
  const grown: VariantsOf = (node) => (node === 'list' ? [LIST, { ...LIST, variant: variant('list.enumitem') }] : base(node));
  const ids = new Set(planBranches(nesting, base).branches.map((b) => b.id));
  const after = planBranches(nesting, grown).branches;
  for (const id of ids) assert.ok(after.some((b) => b.id === id), 'a variant added to a parent keeps every old branch');
  assert.ok(after.filter((b) => !ids.has(b.id)).every((b) => b.path[0]?.variant.way === 'list.enumitem'));
});

test('each variant of each node has two solo branches, marked and not, placed alone at its shallowest place', () => {
  const nesting = host.nesting(2);
  const variantsOf: VariantsOf = (node) => host.variants(node, library.ways(node));
  const solos = soloBranches(nesting, variantsOf);
  const nodes = [...new Set(planOf(host, library, 2).branches.flatMap((b) => b.path.map((s) => s.node)))];
  const variants = nodes.reduce((sum, node) => sum + variantsOf(node).length, 0);
  assert.equal(solos.length, 2 * variants);
  assert.equal(new Set(solos.map((b) => b.id)).size, solos.length);
  const keys = new Set(solos.map((b) => soloKey(b.path.at(-1)?.node ?? '', b.path.at(-1)?.variant ?? variant(''), b.marked ?? false)));
  assert.equal(keys.size, solos.length, 'one per node, variant and marked');
  for (const b of solos) {
    assert.equal(b.id, branchId(b.path, b.marked));
    assert.notEqual(b.id, branchId(b.path), 'never the id of a plan branch with the same path');
    if (b.path.at(-1)?.node === 'para') assert.deepEqual(b.path.map((s) => s.node), ['section', 'para'], "a paragraph's shallowest place is under a section");
  }
});
