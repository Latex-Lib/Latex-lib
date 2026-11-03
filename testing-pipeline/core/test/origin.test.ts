/**
 * Where a failure comes from: the way alone, the class, or the nesting.
 */
import assert from 'node:assert/strict';
import { test } from 'node:test';

import { branchId } from '../src/ids.ts';
import { attribute, type SoloFailures } from '../src/origin.ts';
import type { BranchSpec, PathStep, Verdict } from '../src/model.ts';
import { soloKey } from '../src/plan.ts';

const step = (node: string, way: string): PathStep => ({ node, variant: { way, compat: {}, flags: {} }, member: {} });
const path = [step('list', 'list.kernel'), step('table', 'tbl.tabular')];
const branch: BranchSpec = { id: branchId(path, true), path, marked: true };
const verdict = (...checks: string[]): Verdict => ({ branch: branch.id, cell: 'c', pass: checks.length === 0, failures: checks.map((check) => ({ check, evidence: '' })) });

test('a check the solo branch of a step fails too comes from that way, under the same marked runs', () => {
  const solo: SoloFailures = new Map([[soloKey('table', path[1]?.variant ?? path[0]!.variant, true), new Set(['warning:overfull-hbox'])]]);
  const a = attribute(branch, verdict('warning:overfull-hbox', 'error'), solo);
  assert.deepEqual(a.checks, [
    { check: 'warning:overfull-hbox', origin: 'way', node: 'table' },
    { check: 'error', origin: 'nesting' },
  ]);
  assert.equal(a.origin, 'nesting', 'the worst check decides');
  const escaped = attribute({ ...branch, marked: false }, verdict('warning:overfull-hbox'), solo);
  assert.equal(escaped.origin, 'nesting', 'the solo branch with the escape run did not fail');
});

test('a check the branch does not fail under the reference is new under the class, even when the way alone fails it here', () => {
  const solo: SoloFailures = new Map([[soloKey('list', path[0]!.variant, true), new Set(['error'])]]);
  const a = attribute(branch, verdict('error', 'sentinel:outside'), solo, verdict('sentinel:outside'));
  assert.deepEqual(a.checks, [
    { check: 'error', origin: 'class', node: 'list' },
    { check: 'sentinel:outside', origin: 'nesting' },
  ]);
  assert.equal(attribute(branch, verdict('error'), new Map(), verdict('error')).origin, 'nesting');
});

test('a check the log could not tie to the branch is the document\'s, unless the way alone fails it', () => {
  const a = attribute(branch, verdict('warning:page-overflow:document'), new Map(), verdict('warning:page-overflow:document'));
  assert.deepEqual(a.checks, [{ check: 'warning:page-overflow', origin: 'document' }]);
  const tied = attribute(branch, verdict('error:document', 'error'), new Map());
  assert.equal(tied.origin, 'nesting', 'tied to the branch once, it is the branch\'s');
});
