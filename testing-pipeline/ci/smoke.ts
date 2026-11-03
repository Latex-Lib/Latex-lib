/**
 * The smoke test before the matrix (ARCHITECTURE.md section 3, `ci/`): every
 * variant of every node alone, the solo branches, under one class setting and
 * setup (article with A unless picked), compiled through the store.
 *
 *   npm run compat -- ci/smoke.ts [--classes article] [--setups A] [--depth 2]
 *
 * It stops the run (exit 1) only when something larger than a handler is
 * wrong: a compile the engine could not give at all (it threw: a package it
 * could not fetch, a page that crashed), more than a tenth of the compiles
 * with no log (the engine gave up), or no branch passing. A handler that
 * fails alone is the matrix's to report, not the smoke test's. What it
 * compiles is saved in the store, so the pair's own job takes it from there.
 */
import { documentCells, judge, packBranches, runCells, soloBranches } from 'compat-core';

import { latexLibClasses, latexLibWays } from '../host-flouest/src/latexLib.ts';
import { loadSubject } from '../host-flouest/src/subject.ts';
import { numberOption, openWorkspace } from '../host-flouest/src/workspace.ts';

const ws = openWorkspace({ classes: ['article'], setups: ['A'] });
try {
  const depth = numberOption('depth', 2);
  const { host, library } = loadSubject(ws.flouest, depth).withWays(await latexLibWays(ws), await latexLibClasses(ws));
  const rules = host.documentRules();
  const jobs = soloBranches(host.nesting(depth), (node) => host.variants(node, library.ways(node))).flatMap((branch) =>
    packBranches([branch], rules, 1).flatMap((d) => documentCells(host, d, ws.classSettings, ws.setups, ws.classFiles)),
  );
  const started = performance.now();
  const outcomes = await runCells(ws.store, await ws.engine(), jobs);
  const threw = outcomes.filter((o) => o.result.threw !== undefined);
  const noLog = outcomes.filter((o) => o.result.threw === undefined && o.result.log.trim() === '');
  let pass = 0;
  let fail = 0;
  outcomes.forEach((o, i) => {
    const job = jobs[i];
    if (job === undefined || o.result.threw !== undefined) return;
    for (const v of judge({ cell: o.cell.id, emitted: job.emitted, result: o.result, expected: job.expected }).verdicts) v.pass ? pass++ : fail++;
  });
  const compiled = outcomes.filter((o) => !o.cached).length;
  console.log(`smoke: ${outcomes.length} solo cells under ${ws.under.map((u) => `${u.classSetting.id}.${u.setup.id}`).join(', ')} (${compiled} compiled, ${outcomes.length - compiled} from the store) in ${((performance.now() - started) / 1000).toFixed(0)} s: ${pass} branches pass, ${fail} fail, ${noLog.length} with no log, ${threw.length} the engine could not give`);
  for (const o of threw.slice(0, 5)) console.log(`smoke: could not compile ${o.cell.id}: ${(o.result.threw ?? '').slice(0, 300)}`);
  const broken = threw.length > 0 || noLog.length > outcomes.length / 10 || pass === 0;
  if (broken) {
    console.log('smoke: the engine or its setup is broken, not a handler: the matrix does not start');
    process.exitCode = 1;
  }
} finally {
  await ws.close();
}
