import assert from 'node:assert/strict';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { after, test } from 'node:test';

import type { Store } from '../src/ports.ts';
import { FsStore } from '../src/fsStore.ts';
import { MemoryStore } from '../src/memoryStore.ts';

const folders: string[] = [];
const freshFolder = (): string => {
  const folder = mkdtempSync(join(tmpdir(), 'compat-core-store-'));
  folders.push(folder);
  return folder;
};
after(() => {
  for (const folder of folders) rmSync(folder, { recursive: true, force: true });
});

const kinds: readonly (readonly [string, () => Store])[] = [
  ['MemoryStore', () => new MemoryStore()],
  ['FsStore', () => new FsStore(freshFolder())],
];

for (const [name, make] of kinds) {
  test(`${name}: a value comes back as it went in, and a missing key gives undefined`, () => {
    const store = make();
    const value = { log: 'This is TeX', pages: 2, nested: [1, 'two', null, { ok: true }] };
    store.put('results/abc123', value);
    assert.deepEqual(store.get('results/abc123'), value);
    assert.equal(store.get('results/missing'), undefined);
  });

  test(`${name}: putting a key again replaces its value`, () => {
    const store = make();
    store.put('latest/probe/article', { key: 'one' });
    store.put('latest/probe/article', { key: 'two' });
    assert.deepEqual(store.get('latest/probe/article'), { key: 'two' });
  });

  test(`${name}: a log keeps its lines in order`, () => {
    const store = make();
    assert.deepEqual([...store.read('ledger')], []);
    store.append('ledger', { cell: 'c1' });
    store.append('ledger', { cell: 'c2' });
    store.append('manifest', { document: 'd1' });
    assert.deepEqual([...store.read('ledger')], [{ cell: 'c1' }, { cell: 'c2' }]);
    assert.deepEqual([...store.read('manifest')], [{ document: 'd1' }]);
  });

  test(`${name}: refuses keys that could leave its root, and odd log names`, () => {
    const store = make();
    for (const key of ['', '../x', '/abs', 'a//b', 'a/../b', 'a/.hidden', 'a b']) {
      assert.throws(() => store.put(key, 1), /not a key/, key);
    }
    assert.throws(() => store.append('Ledger', 1), /not a log name/);
    assert.throws(() => store.append('../ledger', 1), /not a log name/);
  });
}

test('FsStore: values and logs outlive the store object, on the same folder', () => {
  const folder = freshFolder();
  const first = new FsStore(folder);
  first.put('artifacts/probe/k1', { pages: 1 });
  first.append('ledger', { cell: 'c1' });
  const second = new FsStore(folder);
  assert.deepEqual(second.get('artifacts/probe/k1'), { pages: 1 });
  assert.deepEqual([...second.read('ledger')], [{ cell: 'c1' }]);
});

test('FsStore: reads a log a chunk at a time, lines longer than a chunk and characters split between chunks included', () => {
  const store = new FsStore(freshFolder());
  const long = { cell: 'c1', missing: 'There is no 𝑎 in font rm-lmr9! '.repeat(60_000) };
  store.append('ledger', long);
  store.append('ledger', { cell: 'c2', note: '≤ é 𝑛' });
  const lines = store.read('ledger');
  assert.equal(Array.isArray(lines), false);
  assert.deepEqual([...lines], [long, { cell: 'c2', note: '≤ é 𝑛' }]);
});

test('MemoryStore: what it holds is a copy, untouched by later changes to the original', () => {
  const store = new MemoryStore();
  const value = { list: [1, 2] };
  store.put('results/x', value);
  value.list.push(3);
  assert.deepEqual(store.get('results/x'), { list: [1, 2] });
  assert.equal(store.count('results/'), 1);
});
