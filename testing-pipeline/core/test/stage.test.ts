import assert from 'node:assert/strict';
import { test } from 'node:test';

import { runStage, stageStatus, type Stage } from '../src/stage.ts';
import { MemoryStore } from '../src/memoryStore.ts';

type Input = { readonly id: string; readonly latex: string };

/** A stage that measures its input, and counts how often it really ran. */
const measuring = (version = 1) => {
  const calls: string[] = [];
  const stage: Stage<Input, { length: number }> = {
    name: 'measure',
    version,
    instance: (input) => input.id,
    inputs: (input) => ({ latex: input.latex }),
    compute: (input) => {
      calls.push(input.id);
      return { length: input.latex.length };
    },
  };
  return { stage, calls };
};

test('a stage computes once for each distinct input, then reads the output back', async () => {
  const store = new MemoryStore();
  const { stage, calls } = measuring();
  const first = await runStage(store, stage, { id: 'c1', latex: 'abc' });
  const second = await runStage(store, stage, { id: 'c1', latex: 'abc' });
  assert.deepEqual(first.output, { length: 3 });
  assert.equal(first.cached, false);
  assert.equal(second.cached, true);
  assert.deepEqual(second.output, { length: 3 });
  assert.equal(first.key, second.key);
  assert.deepEqual(calls, ['c1']);
});

test('outputs are found by content: two instances with the same inputs share one', async () => {
  const store = new MemoryStore();
  const { stage, calls } = measuring();
  await runStage(store, stage, { id: 'c1', latex: 'same' });
  const other = await runStage(store, stage, { id: 'c2', latex: 'same' });
  assert.equal(other.cached, true);
  assert.deepEqual(calls, ['c1']);
});

test('status says never-run, then current, then which input changed', async () => {
  const store = new MemoryStore();
  const { stage } = measuring();
  assert.equal(stageStatus(store, stage, { id: 'c1', latex: 'abc' }).state, 'never-run');
  await runStage(store, stage, { id: 'c1', latex: 'abc' });
  assert.equal(stageStatus(store, stage, { id: 'c1', latex: 'abc' }).state, 'current');
  const changed = stageStatus(store, stage, { id: 'c1', latex: 'abcd' });
  assert.equal(changed.state, 'stale');
  assert.deepEqual(changed.state === 'stale' ? changed.changed : [], ['latex']);
});

test('raising a stage version puts its outputs out of date, and says so', async () => {
  const store = new MemoryStore();
  await runStage(store, measuring(1).stage, { id: 'c1', latex: 'abc' });
  const next = measuring(2);
  const status = stageStatus(store, next.stage, { id: 'c1', latex: 'abc' });
  assert.equal(status.state, 'stale');
  assert.deepEqual(status.state === 'stale' ? status.changed : [], ['(stage version)']);
  const rerun = await runStage(store, next.stage, { id: 'c1', latex: 'abc' });
  assert.equal(rerun.cached, false);
  assert.deepEqual(next.calls, ['c1']);
});
