/**
 * The compat table: every legal parent and every way it can use, derived from
 * contexts unless an authored rule says otherwise (deny > adapt > allow),
 * written beside the handler and found stale when its inputs change.
 */
import assert from 'node:assert/strict';
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { after, test } from 'node:test';

import { checkCompat, compatPath, compatTable, MATRIX_FILE, writeCompat } from '../compat.ts';
import { AMSTHM, BOXED, CELL, FOOTNOTE, key, NESTING } from './fixtures.ts';

const keys = [AMSTHM, BOXED, FOOTNOTE, CELL];
const folders: string[] = [];
after(() => {
  for (const f of folders) rmSync(f, { recursive: true, force: true });
});

test('each legal parent and each of its ways gets a row; a parent with no library way prints as General', () => {
  const table = compatTable(BOXED, keys, NESTING);
  assert.deepEqual(Object.keys(table.parents), ['body', 'containerBlock/footnote', 'table_cell']);
  assert.deepEqual(Object.keys(table.parents.table_cell ?? {}), ['cell.kernel', 'cell.kernel[column=l]']);
  assert.deepEqual(table.parents.body?.['(document body)'], { verdict: 'ok', source: 'derived', status: 'derived' });
  const plainTable = compatTable(BOXED, [BOXED], NESTING);
  assert.deepEqual(Object.keys(plainTable.parents['containerBlock/footnote'] ?? {}), ['(General)']);
});

test('a need the parent does not meet is denied, with what it lacks, and falls back when the key has a fallback', () => {
  const row = compatTable(BOXED, keys, NESTING).parents['containerBlock/footnote']?.['fn.kernel'];
  assert.deepEqual(row, { verdict: 'fallback', source: 'derived', status: 'derived', to: 'thm.amsthm', reason: 'cannot have argument', lacks: ['cannot have argument'] });
});

test('an authored rule wins: deny over adapt over allow, each untested until the matrix runs', () => {
  const ruled = {
    ...BOXED,
    parents: {
      table_cell: {
        scope: 'direct' as const,
        allow: [{ way: '*', reason: 'cells take boxes', evidence: [] }],
        adapt: [{ way: 'cell.kernel', set: { breakable: false }, reason: 'a box in a cell cannot break', evidence: [] }],
        deny: [{ way: 'cell.kernel', when: { column: 'l' }, reason: 'no paragraph mode', evidence: [] }],
      },
    },
  };
  const rows = compatTable(ruled, keys, NESTING).parents.table_cell ?? {};
  assert.deepEqual(rows['cell.kernel'], { verdict: 'adapt', source: 'authored', status: 'untested', set: { breakable: false }, reason: 'a box in a cell cannot break' });
  assert.deepEqual(rows['cell.kernel[column=l]'], { verdict: 'fallback', source: 'authored', status: 'untested', to: 'thm.amsthm', reason: 'no paragraph mode' });
  const allowed = compatTable({ ...ruled, parents: { table_cell: { scope: 'direct', allow: [{ way: '*', reason: 'cells take boxes', evidence: [] }] } } }, keys, NESTING);
  assert.equal(allowed.parents.table_cell?.['cell.kernel']?.verdict, 'ok');
  assert.equal(allowed.parents.table_cell?.['cell.kernel']?.source, 'authored');
});

test('the tables are written beside each handler, and one is stale once its key changes', () => {
  const root = mkdtempSync(join(tmpdir(), 'latex-lib-compat-'));
  folders.push(root);
  for (const k of keys) mkdirSync(dirname(compatPath(root, k)), { recursive: true });
  assert.equal(checkCompat(root, keys, NESTING).length, keys.length, 'none written yet');
  writeCompat(root, keys, NESTING);
  assert.deepEqual(checkCompat(root, keys, NESTING), []);
  const changed = keys.map((k) => (k === BOXED ? { ...BOXED, description: 'changed' } : k));
  assert.deepEqual(checkCompat(root, changed, NESTING), ['way thm.tcolorbox: compat.generated.json is stale (npm run generate)']);
  writeFileSync(compatPath(root, AMSTHM), '{}');
  assert.ok(checkCompat(root, keys, NESTING).includes('way thm.amsthm: compat.generated.json is stale (npm run generate)'));
});

test("the matrix's verdicts make a row verified-ok or failing, naming the class settings, and a changed matrix makes the table stale", () => {
  const root = mkdtempSync(join(tmpdir(), 'latex-lib-matrix-'));
  folders.push(root);
  for (const k of keys) mkdirSync(dirname(compatPath(root, k)), { recursive: true });
  const matrix = (pass: number) => ({
    way: 'thm.tcolorbox',
    from: { plan: 'p' },
    entries: [
      { kind: 'verified', parent: null, pair: 'article.A', branches: 4, pass: 4 },
      { kind: 'verified', parent: { node: 'containerBlock/footnote', way: 'fn.kernel' }, pair: 'article.A', branches: 2, pass: 2 },
      { kind: 'verified', parent: { node: 'containerBlock/footnote', way: 'fn.kernel' }, pair: 'llncs.A', branches: 2, pass },
    ],
  });
  const path = join(dirname(compatPath(root, BOXED)), MATRIX_FILE);
  writeFileSync(path, JSON.stringify(matrix(0)));
  writeCompat(root, keys, NESTING);
  const table = JSON.parse(readFileSync(compatPath(root, BOXED), 'utf8'));
  assert.equal(table.parents.body['(document body)'].status, 'verified-ok');
  assert.deepEqual(table.parents['containerBlock/footnote']['fn.kernel'].matrix, { branches: 4, pass: 2, failing: ['llncs.A'] });
  assert.equal(table.parents['containerBlock/footnote']['fn.kernel'].status, 'failing');
  assert.equal(table.parents.table_cell['cell.kernel'].status, 'derived', 'a parent the matrix has not compiled keeps its status');
  assert.notEqual(table.generatedFrom.matrix, null);
  writeFileSync(path, JSON.stringify(matrix(2)));
  assert.deepEqual(checkCompat(root, keys, NESTING), ['way thm.tcolorbox: compat.generated.json is stale (npm run generate)']);
});

test("an allowed row is judged without its context denials and banned branches, a deny row on all of them, and the bans are the table's", () => {
  const ban = {
    kind: 'ban' as const,
    way: 'thm.tcolorbox',
    classSetting: 'llncs',
    preset: 'boxed',
    parent: null,
    why: 'never-passes' as const,
    branches: 1,
    pass: 0,
    hardFail: 1,
    checks: ['error'],
  };
  const matrix = (banned: { branches: number; pass: number } | undefined) => ({
    way: 'thm.tcolorbox',
    from: { plan: 'p' },
    entries: [
      // Two of the four at the top of the document failed: one in a branch the contexts deny further down, one the ban covers.
      { kind: 'verified' as const, parent: null, pair: 'llncs.A', branches: 4, pass: 2, denied: { branches: 1, pass: 0 }, ...(banned === undefined ? {} : { banned }) },
      ban,
    ],
  });
  const table = compatTable(BOXED, keys, NESTING, matrix({ branches: 1, pass: 0 }));
  assert.deepEqual(table.parents.body?.['(document body)'], {
    verdict: 'ok',
    source: 'derived',
    status: 'verified-ok',
    matrix: { branches: 4, pass: 2, failing: [], denied: { branches: 1, pass: 0 }, banned: { branches: 1, pass: 0 } },
  });
  assert.deepEqual(table.bans, [{ classSetting: 'llncs', preset: 'boxed', parent: '(document body)', why: 'never-passes', branches: 1, pass: 0, checks: ['error'] }]);
  assert.equal(compatTable(BOXED, keys, NESTING, matrix(undefined)).parents.body?.['(document body)']?.status, 'failing', 'the failure no ban covers still counts');
  const floated = key('fig.floated', 'paragraph/paragraph', { context: { gives: {}, needs: { floats: true } } });
  const denyRow = (pass: number) =>
    compatTable(floated, keys, NESTING, {
      way: 'fig.floated',
      from: { plan: 'p' },
      entries: [{ kind: 'verified', parent: { node: 'containerBlock/mathElement', way: 'thm.tcolorbox' }, pair: 'article.A', branches: 3, pass, denied: { branches: 3, pass } }],
    }).parents['containerBlock/mathElement']?.['thm.tcolorbox']?.status;
  assert.equal(denyRow(0), 'verified-fail', 'a deny row counts its denied branches: they are what tests it');
  assert.equal(denyRow(1), 'failing');
});

test('a need its default params add is derived, and a deny no branch of which passed is verified-fail', () => {
  const floated = key('fig.floated', 'paragraph/paragraph', {
    params: { float: { type: 'boolean', default: true, description: 'a figure float' } },
    context: { gives: {}, needs: {}, needsWhen: [{ when: { float: true }, needs: { floats: true } }] },
  });
  const rows = compatTable(floated, keys, NESTING).parents['containerBlock/mathElement'] ?? {};
  assert.equal(rows['thm.amsthm']?.verdict, 'ok');
  assert.deepEqual(rows['thm.tcolorbox'], { verdict: 'deny', source: 'derived', status: 'derived', reason: 'needs floats', lacks: ['needs floats'] });
  const inline = { ...floated, params: { float: { type: 'boolean' as const, default: false, description: 'a figure float' } } };
  assert.equal(compatTable(inline, keys, NESTING).parents['containerBlock/mathElement']?.['thm.tcolorbox']?.verdict, 'ok', 'inline by default, it needs nothing');
  const matrix = (pass: number) => ({
    way: 'fig.floated',
    from: { plan: 'p' },
    entries: [{ kind: 'verified' as const, parent: { node: 'containerBlock/mathElement', way: 'thm.tcolorbox' }, pair: 'article.A', branches: 3, pass }],
  });
  assert.equal(compatTable(floated, keys, NESTING, matrix(0)).parents['containerBlock/mathElement']?.['thm.tcolorbox']?.status, 'verified-fail');
  assert.equal(compatTable(floated, keys, NESTING, matrix(1)).parents['containerBlock/mathElement']?.['thm.tcolorbox']?.status, 'failing', 'some passed: the deny may be too wide');
  assert.equal(compatTable(floated, keys, NESTING, matrix(3)).parents['containerBlock/mathElement']?.['thm.tcolorbox']?.status, 'verified-ok');
});

test("a conflict with General's ways of a node is named general:<node>", () => {
  const dashed = key('tbl.dashed', 'table', { packages: { conflicts: [{ general: 'table', reason: 'hangs on a spanning cell ending in \\par', evidence: [] }] } });
  assert.deepEqual(compatTable(dashed, [dashed], NESTING).packageCombos.deny, [{ with: 'general:table', reason: 'hangs on a spanning cell ending in \\par', status: 'untested' }]);
});
