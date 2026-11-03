/**
 * The CI runner's planning step (ARCHITECTURE.md section 3, `ci/`): what
 * `compat run` would file and compile, with nothing compiled and no Chrome
 * started.
 *
 *   npm run compat -- ci/prepare.ts [--classes id,id] [--setups A,B] [--depth 2] [--size 64] [--library] [--pairs <file>] [--keys <file>] [--todo <file>]
 *
 * It files the plan's branches as `run` does (`fileBranches`), so a store that
 * has been through it has nothing left to file, and jobs that start from it
 * agree on every document. `--pairs` writes the picked class settings and
 * setups as a JSON list of `{ class, setup }`, for a CI matrix. `--keys` writes
 * the store key of every cell `run` would compile for them, matrix and solo,
 * one per line, so a job can fetch just those results. `--todo` writes, per
 * class setting and setup, how many of those cells have no result in the
 * store yet, as a JSON list of `{ class, setup, cells, todo }`: a pair with
 * nothing to compile needs no job. Each document is built once and its cells
 * hashed as they come, so no LaTeX is kept. The engine fingerprint that goes
 * into every key is printed: the engine opens without Chrome, which starts
 * only at the first compile.
 */
import { existsSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

import { documentCells, fileBranches, packBranches, resultAt, resultKey, soloBranches, type CellJob } from 'compat-core';

import { latexLibClasses, latexLibWays } from '../host-flouest/src/latexLib.ts';
import { loadSubject } from '../host-flouest/src/subject.ts';
import { flag, numberOption, openWorkspace, option, underName } from '../host-flouest/src/workspace.ts';

const depth = numberOption('depth', 2);
const size = numberOption('size', 64);

const ws = openWorkspace();
try {
  const subject = loadSubject(ws.flouest, depth).withWays(flag('library') ? await latexLibWays(ws) : [], await latexLibClasses(ws));
  const { host, plan, library } = subject;
  // The same filing and the same cells as runMatrix and runSolo (src/matrix.ts, src/solo.ts).
  const filing = fileBranches(ws.store, plan.branches, host.documentRules(), { size, requires: (branch) => host.requires(branch), claims: (branch) => host.claims(branch) });
  console.log(`prepare: ${plan.branches.length} branches in ${filing.documents.length} documents, ${filing.filed.length} newly filed; ${ws.under.length} pair(s): ${ws.under.map(underName).join(' ')}`);

  const pairsFile = option('pairs');
  if (pairsFile !== undefined) {
    writeFileSync(pairsFile, `${JSON.stringify(ws.under.map((u) => ({ class: u.classSetting.id, setup: u.setup.id })))}\n`);
  }

  const keysFile = option('keys');
  const todoFile = option('todo');
  if (keysFile !== undefined || todoFile !== undefined) {
    const fingerprint = (await ws.engine()).fingerprint();
    const keys = new Set<string>();
    const pairs = new Map(ws.under.map((u) => [underName(u), { class: u.classSetting.id, setup: u.setup.id, cells: 0, todo: 0 }]));
    let matrix = 0;
    let solo = 0;
    const take = ({ cell, job }: CellJob): void => {
      const key = resultAt(resultKey(job, fingerprint));
      if (keysFile !== undefined) keys.add(key);
      const pair = pairs.get(`${cell.classSetting}.${cell.setup}`);
      if (pair === undefined) return;
      pair.cells++;
      if (!existsSync(join(ws.config.out, `${key}.json.gz`))) pair.todo++;
    };
    for (const d of filing.documents) {
      for (const job of documentCells(host, d.document, ws.classSettings, ws.setups, ws.classFiles)) {
        take(job);
        matrix++;
      }
    }
    const rules = host.documentRules();
    for (const branch of soloBranches(host.nesting(depth), (node) => host.variants(node, library.ways(node)))) {
      for (const d of packBranches([branch], rules, 1)) {
        for (const job of documentCells(host, d, ws.classSettings, ws.setups, ws.classFiles)) {
          take(job);
          solo++;
        }
      }
    }
    if (keysFile !== undefined) writeFileSync(keysFile, keys.size === 0 ? '' : `${[...keys].join('\n')}\n`);
    if (todoFile !== undefined) writeFileSync(todoFile, `${JSON.stringify([...pairs.values()])}\n`);
    const todo = [...pairs.values()].reduce((n, p) => n + p.todo, 0);
    console.log(`prepare: ${matrix} matrix and ${solo} solo cells; ${todo} with no result in the store, in ${[...pairs.values()].filter((p) => p.todo > 0).length} of ${pairs.size} pair(s)`);
    console.log(`fingerprint ${fingerprint}`);
  }
} finally {
  await ws.close();
}
