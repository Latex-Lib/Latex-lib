import assert from 'node:assert/strict';
import { test } from 'node:test';

import { judge, ORACLE_VERSION } from '../src/oracle.ts';
import { latestByCell, ledgerLine, newRun, recordRun } from '../src/ledger.ts';
import type { CellOutcome } from '../src/run.ts';
import { runCells } from '../src/run.ts';
import { MemoryStore } from '../src/memoryStore.ts';
import { FakeEngine } from './fakeEngine.ts';
import { FakeHost } from './fakeHost.ts';
import { FakeLibrary } from './fakeLibrary.ts';
import { ARTICLE, cellsOf, packed, planOf, SETUP_A } from './fakeRun.ts';

const host = new FakeHost();
const all = planOf(host, new FakeLibrary(), 2).branches;
const ways = (b: (typeof all)[number]) => b.path.map((s) => s.variant.way).join('>');
const bad = all.find((b) => ways(b) === 'thm.plain>fn.kernel>thm.boxed');
const good = all.find((b) => ways(b) === 'thm.boxed>fn.kernel>thm.plain');

test('a run is named by the moment it started', () => {
  assert.deepEqual(newRun(new Date('2026-10-29T08:15:30.123Z')), { id: 'r20261029081530123', at: '2026-10-29T08:15:30.123Z' });
});

test('the ledger records each cell with what its log says and its verdicts, and the run is summed up', async () => {
  assert.ok(bad && good);
  const store = new MemoryStore();
  const engine = new FakeEngine();
  const jobs = cellsOf(host, [...packed(host, [good], 1), ...packed(host, [bad], 1)], [ARTICLE], [SETUP_A]);
  const outcomes = await runCells(store, engine, jobs);
  const judgements = new Map(
    outcomes.map((outcome, i) => {
      const job = jobs[i];
      assert.ok(job);
      return [outcome.cell.id, judge({ cell: outcome.cell.id, emitted: job.emitted, result: outcome.result, expected: job.expected })] as const;
    }),
  );
  const run = newRun();
  const summary = recordRun(store, outcomes, run, engine.fingerprint(), judgements);
  assert.deepEqual(summary, {
    run: run.id,
    cells: 2,
    compiled: 2,
    cached: 0,
    status: { ok: 1, errors: 1, 'no-output': 0, threw: 0 },
    branches: { pass: 1, fail: 1 },
  });

  const lines = latestByCell(store);
  const [goodCell, badCell] = outcomes.map((o) => o.cell.id);
  const goodLine = lines.get(goodCell ?? '');
  const badLine = lines.get(badCell ?? '');
  assert.equal(goodLine?.status, 'ok');
  assert.equal(goodLine?.pages, 1);
  assert.equal(badLine?.status, 'errors');
  assert.equal(badLine?.errors[0]?.message, 'LaTeX Error: Not in outer par mode.');
  assert.equal(typeof badLine?.errors[0]?.line, 'number');
  assert.equal(badLine?.engine, 'fake-engine-1');
  assert.equal(badLine?.run, run.id);
  assert.equal(badLine?.oracle, ORACLE_VERSION);
  assert.deepEqual(goodLine?.verdicts?.map((v) => [v.branch, v.pass]), [[good.id, true]]);
  assert.deepEqual(badLine?.verdicts?.map((v) => [v.branch, v.pass, v.failures.map((f) => f.check)]), [[bad.id, false, ['error']]]);
});

test('a later run of the same cells adds lines, and the latest says it came from the store', async () => {
  assert.ok(good);
  const store = new MemoryStore();
  const engine = new FakeEngine();
  const jobs = cellsOf(host, packed(host, [good], 1), [ARTICLE], [SETUP_A]);
  recordRun(store, await runCells(store, engine, jobs), newRun(), engine.fingerprint());
  const second = recordRun(store, await runCells(store, engine, jobs), newRun(), engine.fingerprint());
  assert.equal(second.compiled, 0);
  assert.equal(second.cached, 1);
  assert.equal([...store.read('ledger')].length, 2);
  assert.equal([...latestByCell(store).values()][0]?.cached, true);
});

test('a cell the engine gave nothing for is threw; one with no pages and no error is no-output', () => {
  const cell = { id: 'c1', document: 'd1', classSetting: 'article', setup: 'A' };
  const run = newRun();
  const threw: CellOutcome = { cell, key: 'k', cached: false, result: { log: '', pages: null, ms: 0, threw: 'Chrome went away' } };
  const empty: CellOutcome = { cell, key: 'k', cached: false, result: { log: 'No pages of output.\n', pages: null, ms: 3 } };
  assert.equal(ledgerLine(threw, run, 'e').status, 'threw');
  assert.equal(ledgerLine(threw, run, 'e').threw, 'Chrome went away');
  assert.equal(ledgerLine(empty, run, 'e').status, 'no-output');
  assert.equal(ledgerLine(empty, run, 'e').pages, 0);
});

test("a denied branch's verdict names its denial, and one the contexts allow names none (b23)", () => {
  const cell = { id: 'c1', document: 'd1', classSetting: 'article', setup: 'A' };
  const outcome: CellOutcome = { cell, key: 'k', cached: false, result: { log: '', pages: 1, ms: 1 } };
  const own = { check: 'error', evidence: 'LaTeX Error: Not in outer par mode. (l.9)' };
  const judgement = {
    cell: cell.id,
    verdicts: [
      { branch: 'b1', cell: cell.id, pass: true, failures: [] },
      { branch: 'b2', cell: cell.id, pass: false, failures: [own] },
    ],
    document: [],
  };
  const deniedOf = (branch: string) => (branch === 'b2' ? 'thm.tcolorbox > tbl.booktabs' : undefined);
  assert.deepEqual(ledgerLine(outcome, newRun(), 'e', judgement, deniedOf).verdicts, [
    { branch: 'b1', pass: true, failures: [] },
    { branch: 'b2', pass: false, failures: [own], denied: 'thm.tcolorbox > tbl.booktabs' },
  ]);
  assert.deepEqual(ledgerLine(outcome, newRun(), 'e', judgement).verdicts?.map((v) => 'denied' in v), [false, false], 'no lookup, no denial');
  // A matrix ban holds under one class setting: the lookup is given the cell's.
  const banned = (branch: string, classSetting: string) => (branch === 'b1' && classSetting === 'article' ? 'ban:never-passes (document body) > tbl.booktabs' : undefined);
  assert.deepEqual(ledgerLine(outcome, newRun(), 'e', judgement, banned).verdicts?.map((v) => v.denied), ['ban:never-passes (document body) > tbl.booktabs', undefined]);
  assert.deepEqual(ledgerLine({ ...outcome, cell: { ...cell, classSetting: 'llncs' } }, newRun(), 'e', judgement, banned).verdicts?.map((v) => v.denied), [undefined, undefined]);
});

test("a verdict's line holds its own failures; the document's are written once, under problems", () => {
  const cell = { id: 'c1', document: 'd1', classSetting: 'article', setup: 'A' };
  const outcome: CellOutcome = { cell, key: 'k', cached: false, result: { log: '', pages: 1, ms: 1 } };
  const glyph = { check: 'warning:missing-character', evidence: 'Missing character: There is no 𝑎 in font rm-lmr9!' };
  const asDocument = { ...glyph, check: `${glyph.check}:document` };
  const own = { check: 'error', evidence: 'LaTeX Error: Not in outer par mode. (l.9)' };
  const line = ledgerLine(outcome, newRun(), 'e', {
    cell: cell.id,
    verdicts: [
      { branch: 'b1', cell: cell.id, pass: false, failures: [own, asDocument, asDocument] },
      { branch: 'b2', cell: cell.id, pass: false, failures: [asDocument, asDocument] },
    ],
    document: [glyph, glyph],
  });
  assert.deepEqual(line.verdicts, [
    { branch: 'b1', pass: false, failures: [own] },
    { branch: 'b2', pass: false, failures: [] },
  ]);
  assert.deepEqual(line.problems, [glyph, glyph]);
});

test("a :document failure only some branches carry stays in their verdict's line", () => {
  const cell = { id: 'c1', document: 'd1', classSetting: 'article', setup: 'A' };
  const outcome: CellOutcome = { cell, key: 'k', cached: false, result: { log: '', pages: 1, ms: 1 } };
  const evidence = 'Incomplete \\iffalse; all text was ignored after line 15. (l.15)';
  const skipped = { check: 'error:document', evidence };
  const glyph = { check: 'warning:missing-character', evidence: 'Missing character: There is no 𝑎 in font rm-lmr9!' };
  const asDocument = { ...glyph, check: `${glyph.check}:document` };
  const line = ledgerLine(outcome, newRun(), 'e', {
    cell: cell.id,
    verdicts: [
      { branch: 'b1', cell: cell.id, pass: false, failures: [{ check: 'error', evidence }, asDocument] },
      { branch: 'b2', cell: cell.id, pass: false, failures: [skipped, asDocument] },
    ],
    document: [glyph],
  });
  assert.deepEqual(line.verdicts?.[1], { branch: 'b2', pass: false, failures: [skipped] });
  assert.deepEqual(line.problems, [glyph]);
});
