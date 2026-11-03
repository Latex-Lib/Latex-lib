import assert from 'node:assert/strict';
import { test } from 'node:test';

import * as core from '../src/index.ts';
import { canonical, hashJson, sha256 } from '../src/hash.ts';
import { branchId, cellId, documentId, resultKey } from '../src/ids.ts';
import type { Json, PathStep } from '../src/model.ts';

const step = (node: string, way: string, member: { [name: string]: Json } = {}): PathStep => ({
  node,
  variant: { way, compat: {}, flags: {} },
  member,
});

test('the package entry loads under Node type stripping', () => {
  assert.equal(typeof core.runStage, 'function');
  assert.equal(typeof core.FsStore, 'function');
});

test('canonical spells a value one way, whatever order its keys were built in', () => {
  assert.equal(canonical({ b: 1, a: [true, null, 'x'] }), '{"a":[true,null,"x"],"b":1}');
  assert.equal(hashJson({ a: 1, b: { d: 2, c: 3 } }), hashJson({ b: { c: 3, d: 2 }, a: 1 }));
});

test('canonical leaves out undefined keys and refuses numbers JSON cannot hold', () => {
  assert.equal(canonical({ a: 1, b: undefined }), '{"a":1}');
  assert.throws(() => canonical(Number.NaN), TypeError);
  assert.throws(() => canonical(Number.POSITIVE_INFINITY), TypeError);
});

test('sha256 prefixes each part with its length, so parts never run together', () => {
  assert.notEqual(sha256('ab', 'c'), sha256('a', 'bc'));
  assert.equal(sha256('ab', 'c'), sha256('ab', 'c'));
  assert.match(sha256('x'), /^[0-9a-f]{64}$/);
});

test('a branch id is its path: the same path gives the same id, any change another', () => {
  const path = [step('section', 'sec.kernel'), step('theorem', 'thm.plain', { title: '' })];
  assert.equal(branchId(path), branchId(structuredClone(path)));
  assert.notEqual(branchId(path), branchId([step('section', 'sec.kernel'), step('theorem', 'thm.plain', { title: 'Main result' })]));
  assert.notEqual(branchId(path), branchId([...path].reverse()));
  assert.match(branchId(path), /^b[0-9a-f]{20}$/);
});

test('a document id follows its branches in order, and the rules they were filed under', () => {
  assert.equal(documentId(['b1', 'b2'], 'r1'), documentId(['b1', 'b2'], 'r1'));
  assert.notEqual(documentId(['b1', 'b2'], 'r1'), documentId(['b2', 'b1'], 'r1'));
  assert.notEqual(documentId(['b1', 'b2'], 'r1'), documentId(['b1', 'b2'], 'r2'));
  assert.match(documentId(['b1'], 'r1'), /^d[0-9a-f]{20}$/);
});

test('a cell id is its document, class setting and setup', () => {
  const cell = cellId('d1', 'article', 'A');
  assert.equal(cell, cellId('d1', 'article', 'A'));
  assert.notEqual(cell, cellId('d1', 'article', 'B'));
  assert.notEqual(cell, cellId('d1', 'amsart', 'A'));
  assert.notEqual(cell, cellId('d2', 'article', 'A'));
});

test('a result key is the engine and what it reads, not the job id or the order files were listed in', () => {
  const cls = { path: 'a.cls', bytes: new Uint8Array([1]) };
  const png = { path: 'b.png', bytes: new Uint8Array([2]) };
  const job = { id: 'one', latex: 'x', files: [cls, png] };
  assert.equal(resultKey(job, 'e1'), resultKey({ ...job, id: 'two', files: [png, cls] }, 'e1'));
  assert.notEqual(resultKey(job, 'e1'), resultKey(job, 'e2'));
  assert.notEqual(resultKey(job, 'e1'), resultKey({ ...job, latex: 'y' }, 'e1'));
  assert.notEqual(resultKey(job, 'e1'), resultKey({ ...job, files: [cls, { ...png, bytes: new Uint8Array([3]) }] }, 'e1'));
});
