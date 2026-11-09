/**
 * Every way of every node (ARCHITECTURE.md 9.1): each preset's LaTeX on a
 * sample of its node fixed by snapshot, and every package a handler prints
 * declared in its key's loads, so the resolver sees what the handler loads.
 *
 * The snapshot is written when missing; `UPDATE_SNAPSHOTS=1 npm test` writes
 * it again after a deliberate change.
 */
import assert from 'node:assert/strict';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { before, test } from 'node:test';

import { loadLibrary } from '../library.ts';
import type { HandlerKey } from '../schema/key.ts';
import { loadHandlers, SAMPLES, type Handler } from '../samples.ts';


let keys: readonly HandlerKey[] = [];
let handlers = new Map<string, Handler>();
before(async () => {
  const root = join(import.meta.dirname, '..');
  keys = (await loadLibrary(root)).library.keys;
  handlers = await loadHandlers(root);
});

const printed = (key: HandlerKey, params: Record<string, unknown>) => {
  const handler = handlers.get(`${key.node} ${key.id}`);
  assert.ok(handler, `${key.node} ${key.id} has no handler in its node's index`);
  const sample = SAMPLES[key.node];
  assert.ok(sample, `no sample of ${key.node}`);
  const r = handler(params);
  const pre = r.preamble({}, 'doc', sample.node, sample.content);
  return { ...pre, body: r.emit(sample.node, sample.content, sample.context, 'doc') };
};

test('every node of Flouest has at least one way, and every way a handler', () => {
  const nodes = new Set(keys.map((k) => k.node));
  assert.equal(nodes.size, Object.keys(SAMPLES).length, `nodes with ways: ${[...nodes].sort().join(', ')}`);
  for (const key of keys) assert.ok(handlers.has(`${key.node} ${key.id}`), `${key.node} ${key.id}`);
});

test("every package a handler prints is in its key's loads", () => {
  for (const key of keys) {
    for (const [name, preset] of Object.entries(key.presets)) {
      const out = printed(key, preset.params);
      for (const line of out.packages ?? []) {
        const pkg = /\\usepackage(?:\[[^\]]*\])?\{([^}]+)\}/u.exec(line)?.[1];
        assert.ok(pkg !== undefined && key.loads.some((l) => l.pkg === pkg), `${key.node} ${key.id} (${name}) prints ${line}, not in its loads`);
      }
    }
  }
});

test('every preset of every way prints what its snapshot holds', () => {
  const snapshots: Record<string, unknown> = {};
  for (const key of [...keys].sort((a, b) => `${a.node} ${a.id}`.localeCompare(`${b.node} ${b.id}`))) {
    for (const [name, preset] of Object.entries(key.presets)) snapshots[`${key.node} ${key.id} ${name}`] = printed(key, preset.params);
  }
  const dir = join(import.meta.dirname, 'snapshots');
  const file = join(dir, 'ways.json');
  const text = `${JSON.stringify(snapshots, null, 2)}\n`;
  if (!existsSync(file) || process.env['UPDATE_SNAPSHOTS'] === '1') {
    mkdirSync(dir, { recursive: true });
    writeFileSync(file, text);
  }
  assert.equal(text, readFileSync(file, 'utf8'), 'a handler prints something new: check it, then UPDATE_SNAPSHOTS=1 npm test');
});
