/**
 * The class probe against a scripted engine: the documents it writes, how it
 * reads them into a profile, and how adding a package to the ask compiles one
 * more load test and nothing else.
 */
import assert from 'node:assert/strict';
import { test } from 'node:test';

import { runStage, stageStatus } from '../src/stage.ts';
import type { ClassSetting, Job, RawResult } from '../src/model.ts';
import type { Engine } from '../src/ports.ts';
import { loadProbeLatex, loadTestLatex, probeClass, probeStage, readProbe, type ProbeAsk } from '../src/classProbe.ts';
import { MemoryStore } from '../src/memoryStore.ts';
import { SETUP_A, SETUP_B } from './fakeRun.ts';

const ACMART: ClassSetting = { id: 'acmart-manuscript', class: 'acmart', options: ['manuscript'], preamble: [], files: [] };
const ARTICLE: ClassSetting = { id: 'article', class: 'article', options: ['onecolumn'], preamble: [], files: [] };

const ASK: ProbeAsk = {
  packages: [
    { name: 'amsmath', options: [] },
    { name: 'amssymb', options: [] },
    { name: 'titlesec', options: [] },
    { name: 'xcolor', options: ['table'] },
  ],
  defines: ['env:theorem', 'cmd:email', 'counter:chapter'],
  redefines: ['cmd:contentsname'],
};

const ok = (extra: string[] = []): RawResult => ({ log: [...extra, 'Output written on main.xdv (1 page, 9 bytes).'].join('\n'), pages: null, ms: 1 });

/**
 * Plays a class that preloads amsmath and xcolor, already defines `\email`,
 * stops on amssymb (`\Bbbk` defined twice), clashes on xcolor's options and
 * frowns on titlesec.
 */
class ScriptedClassEngine implements Engine {
  readonly jobs: Job[] = [];
  fingerprint(): string {
    return 'scripted-1';
  }
  async compile(job: Job): Promise<RawResult> {
    this.jobs.push(job);
    const { latex } = job;
    if (latex.includes('COMPAT-PROBE')) {
      return ok([
        'COMPAT-PROBE{file}{acmart.cls}',
        'COMPAT-PROBE{file}{amsmath.sty}',
        'COMPAT-PROBE{file}{xcolor.sty}',
        'COMPAT-PROBE{loaded}{amsmath}',
        'COMPAT-PROBE{loaded}{xcolor}',
        'COMPAT-PROBE{defined}{cmd:email}',
        'COMPAT-PROBE{defined}{cmd:contentsname}',
        'COMPAT-PROBE{twocolumn}{no}',
        'COMPAT-PROBE{textWidth}{478.0pt}',
        'COMPAT-PROBE{columnWidth}{478.0pt}',
        'COMPAT-PROBE{paperWidth}{614.295pt}',
        'COMPAT-PROBE{paperHeight}{794.96999pt}',
        'COMPAT-PROBE{fontSize}{10pt}',
      ]);
    }
    if (latex.includes('\\usepackage{amssymb}')) return ok(['! LaTeX Error: Command `\\Bbbk\' already defined.', 'l.2 \\usepackage{amssymb}']);
    if (latex.includes('\\usepackage[table]{xcolor}')) return ok(['! LaTeX Error: Option clash for package xcolor.', 'l.2 \\usepackage[table]{xcolor}']);
    if (latex.includes('\\usepackage{titlesec}')) return ok(['Class acmart Warning: titlesec is not recommended with this class on input line 2.']);
    return ok();
  }
  async close(): Promise<void> {}
}

test('the load probe is the class alone, writing what it brought once the preamble is over', () => {
  const latex = loadProbeLatex(ARTICLE, SETUP_B, ASK);
  assert.match(latex, /^\\listfiles\n\\documentclass\[twocolumn\]\{article\}\n/, 'files listed from before the class; the setup applied to its options');
  assert.match(latex, /\\AddToHook\{begindocument\/end\}\{/);
  assert.match(latex, /\\@for\\compat@file:=\\@filelist\\do/);
  assert.match(latex, /\\ifcsname ver@xcolor\.sty\\endcsname/, 'asked packages tested as \\@ifpackageloaded does');
  assert.equal((latex.match(/ver@amsmath\.sty/g) ?? []).length, 2, 'each package name once (two \\ifcsname tests)');
  assert.match(latex, /\\ifcsname c@chapter\\endcsname/, 'a counter is its c@ register');
  assert.match(latex, /\\ifcsname theorem\\endcsname/, 'an environment is its begin macro');
  assert.doesNotMatch(latex, /\\usepackage/);
  assert.throws(() => loadProbeLatex(ARTICLE, SETUP_A, { ...ASK, defines: ['theorem'] }), /not env:<name>/);
});

test('a load test is the class and one package line', () => {
  assert.equal(
    loadTestLatex(ACMART, SETUP_A, { name: 'xcolor', options: ['table'] }),
    '\\documentclass[manuscript]{acmart}\n\\usepackage[table]{xcolor}\n\\begin{document}\nProbe.\n\\end{document}\n',
  );
});

test('readProbe reads the files, the preloads, the defined names and the layout', () => {
  const read = readProbe('COMPAT-PROBE{file}{article.cls}\nCOMPAT-PROBE{loaded}{amsmath}\nCOMPAT-PROBE{defined}{env:theorem}\nCOMPAT-PROBE{twocolumn}{yes}\n');
  assert.deepEqual(read.files, ['article.cls']);
  assert.deepEqual([...read.loaded], ['amsmath']);
  assert.deepEqual([...read.defined], ['env:theorem']);
  assert.equal(read.layout.get('twocolumn'), 'yes');
});

test('the profile says what the class brings, what clashes, what it lacks, and what it refuses', async () => {
  const profile = await probeClass(new MemoryStore(), new ScriptedClassEngine(), { setting: ACMART, setup: SETUP_A, ask: ASK, files: [] });
  assert.deepEqual(profile.loads, { status: 'ok', errors: [] });
  assert.deepEqual(profile.files, ['acmart.cls', 'amsmath.sty', 'xcolor.sty']);
  assert.deepEqual(profile.preloads, ['amsmath', 'xcolor']);
  assert.deepEqual(profile.clashes, ['cmd:email']);
  assert.deepEqual(profile.lacks, []);
  assert.deepEqual(profile.layout, { twocolumn: false, textWidth: '478.0pt', columnWidth: '478.0pt', paperWidth: '614.295pt', paperHeight: '794.96999pt', fontSize: '10pt' });
  assert.deepEqual(profile.forbids, ['amssymb', 'xcolor[table]']);
  assert.deepEqual(profile.packages['amssymb']?.errors, ["LaTeX Error: Command `\\Bbbk' already defined."]);
  assert.deepEqual(profile.cautions, ['titlesec']);
  assert.equal(profile.packages['amsmath']?.status, 'ok');
});

test('the probe as a stage: a rerun compiles nothing, one more package compiles one more load test', async () => {
  const store = new MemoryStore();
  const engine = new ScriptedClassEngine();
  const stage = probeStage(store, engine);
  const input = { setting: ACMART, setup: SETUP_A, ask: ASK, files: [] };
  await runStage(store, stage, input);
  assert.equal(engine.jobs.length, 1 + ASK.packages.length);
  const again = await runStage(store, stage, input);
  assert.equal(again.cached, true);
  assert.equal(engine.jobs.length, 1 + ASK.packages.length);

  const grown = { ...input, ask: { ...ASK, packages: [...ASK.packages, { name: 'geometry', options: [] }] } };
  const status = stageStatus(store, stage, grown);
  assert.deepEqual(status.state === 'stale' ? status.changed : [], ['ask']);
  const rerun = await runStage(store, stage, grown);
  assert.equal(rerun.cached, false);
  assert.equal(engine.jobs.length, 1 + ASK.packages.length + 2, 'the load probe (its ask changed) and the new load test');
  assert.equal(rerun.output.packages['geometry']?.status, 'ok');
});

test('a setup that does not apply to the class is refused', async () => {
  await assert.rejects(
    probeClass(new MemoryStore(), new ScriptedClassEngine(), { setting: { ...ACMART, setups: ['A'] }, setup: SETUP_B, ask: ASK, files: [] }),
    /does not apply/,
  );
});
