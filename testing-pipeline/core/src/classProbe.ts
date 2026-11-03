/**
 * The class probe (ARCHITECTURE.md section 10, step 3): what a class brings
 * and refuses, measured by compiling, never written down.
 *
 * Two kinds of document per class setting.
 *
 * - **The load probe**: the class alone and an empty page. At the end of
 *   `\begin{document}` it writes to the log, one fact per line:
 *   - every file the class read in (`\@filelist`);
 *   - which asked packages it already loaded (`\ver@<name>.sty`);
 *   - which asked names it already defines;
 *   - its layout (two columns or one, text and column widths, paper, font size).
 * - **A load test per asked package**: the class and that package alone. An
 *   error means the class refuses it (a class that stops on `geometry`, an
 *   option clash with what it preloaded, a name defined twice). A warning of
 *   incompatibility is a caution.
 *
 * The asked packages and names come from the library, so a class is probed
 * for exactly what the ways would bring to it. Every compile goes through the
 * store, so asking for one more package compiles one more load test.
 */
import { appliesTo } from './config.ts';
import type { Stage } from './stage.ts';
import { sha256 } from './hash.ts';
import { cellId, looseDocumentId } from './ids.ts';
import { shapeOf, statusOf } from './log.ts';
import type { ClassProfile, ClassSetting, EngineFile, PackageLoad, PackageTest, Setup } from './model.ts';
import type { Engine, Store } from './ports.ts';
import { runCells, type CellJob } from './run.ts';

/** Raised whenever the probe's documents or its reading change: 2 and 3 read messages the log cut short and columns from the widths; 4 lists files. */
export const PROBE_VERSION = 4;

const MARK = 'COMPAT-PROBE';

/** What the library asks of every class: the packages its ways load, the names they define, and the names they redefine. */
export type ProbeAsk = {
  readonly packages: readonly PackageLoad[];
  readonly defines: readonly string[];
  readonly redefines: readonly string[];
};

export const spellingOf = (load: PackageLoad): string => (load.options.length > 0 ? `${load.name}[${load.options.join(',')}]` : load.name);
const usepackage = (load: PackageLoad): string =>
  `\\usepackage${load.options.length > 0 ? `[${load.options.join(',')}]` : ''}{${load.name}}`;

const NAME = /^(env|cmd|counter):([A-Za-z@]+)$/;

/** The control sequence that exists when a name is defined: `\theorem` for an environment, `\c@x` for a counter. */
const csOf = (name: string): string => {
  const m = NAME.exec(name);
  if (!m) throw new Error(`probe: ${JSON.stringify(name)} is not env:<name>, cmd:<name> or counter:<name>`);
  return m[1] === 'counter' ? `c@${m[2]}` : (m[2] ?? '');
};

const classLine = (setting: ClassSetting, setup: Setup): string => {
  const options = [...setting.options.filter((o) => !setup.removeOptions.includes(o)), ...setup.addOptions];
  return `\\documentclass${options.length > 0 ? `[${options.join(',')}]` : ''}{${setting.class}}`;
};

const write = (key: string, value: string): string => `\\immediate\\write-1{${MARK}{${key}}{${value}}}`;

/** `then` when the control sequence named `cs` exists and is not `\relax` (what `\csname` leaves behind for a name never defined). */
const ifDefined = (cs: string, then: string): string =>
  `\\ifcsname ${cs}\\endcsname\\expandafter\\ifx\\csname ${cs}\\endcsname\\relax\\else${then}\\fi\\fi`;

/** The class alone, writing what it brought. */
export const loadProbeLatex = (setting: ClassSetting, setup: Setup, ask: ProbeAsk): string => {
  const names = [...ask.defines, ...ask.redefines];
  const facts = [
    `\\@for\\compat@file:=\\@filelist\\do{\\ifx\\compat@file\\@empty\\else${write('file', '\\compat@file')}\\fi}`,
    // `\@ifpackageloaded` is preamble-only, and this runs after the preamble,
    // so it tests what `\@ifpackageloaded` tests: `\ver@<name>.sty`.
    ...[...new Set(ask.packages.map((p) => p.name))].map((name) => ifDefined(`ver@${name}.sty`, write('loaded', name))),
    ...names.map((name) => ifDefined(csOf(name), write('defined', name))),
    write('twocolumn', '\\if@twocolumn yes\\else no\\fi'),
    write('textWidth', '\\the\\textwidth'),
    write('columnWidth', '\\the\\columnwidth'),
    write('paperWidth', '\\the\\paperwidth'),
    write('paperHeight', '\\the\\paperheight'),
    write('fontSize', '\\f@size pt'),
  ];
  return `${[
    // LaTeX keeps `\@filelist` only under `\listfiles`, and only from where
    // it is given, so it comes before the class.
    '\\listfiles',
    classLine(setting, setup),
    ...setting.preamble,
    ...setup.preamble,
    '\\makeatletter',
    `\\AddToHook{begindocument/end}{${facts.join('')}}`,
    '\\makeatother',
    '\\begin{document}',
    'Probe.',
    '\\end{document}',
  ].join('\n')}\n`;
};

/** The class and one package alone. */
export const loadTestLatex = (setting: ClassSetting, setup: Setup, load: PackageLoad): string =>
  `${[classLine(setting, setup), ...setting.preamble, ...setup.preamble, usepackage(load), '\\begin{document}', 'Probe.', '\\end{document}'].join('\n')}\n`;

/** What the load probe wrote. */
export const readProbe = (log: string) => {
  const files: string[] = [];
  const loaded = new Set<string>();
  const defined = new Set<string>();
  const layout = new Map<string, string>();
  for (const m of log.matchAll(new RegExp(`^${MARK}\\{(\\w+)\\}\\{([^}\\n]*)\\}`, 'gm'))) {
    const [, key = '', value = ''] = m;
    if (key === 'file') files.push(value.trim());
    else if (key === 'loaded') loaded.add(value);
    else if (key === 'defined') defined.add(value);
    else layout.set(key, value.trim());
  }
  return { files, loaded, defined, layout };
};

const CAUTION = /not recommended|incompatib|conflict|does not work|not supported|unsupported|cannot be used/i;

const testOf = (status: PackageTest['status'], errors: readonly string[], warnings: readonly string[]): PackageTest => ({
  status,
  errors,
  cautions: [...new Set(warnings.filter((w) => CAUTION.test(w)).map(shapeOf))],
});

export type ProbeInput = {
  readonly setting: ClassSetting;
  readonly setup: Setup;
  readonly ask: ProbeAsk;
  /** The class setting's files, read and checked (`readClassFiles`). */
  readonly files: readonly EngineFile[];
};

/** Runs the probe's compiles (through the store) and reads them into the class's profile. */
export const probeClass = async (store: Store, engine: Engine, input: ProbeInput): Promise<ClassProfile> => {
  const { setting, setup, ask, files } = input;
  if (!appliesTo(setup, setting)) throw new Error(`probe: setup ${setup.id} does not apply to ${setting.id}`);
  const job = (kind: string, latex: string): CellJob => {
    const document = looseDocumentId({ probe: kind, latex });
    const cell = { id: cellId(document, setting.id, setup.id), document, classSetting: setting.id, setup: setup.id };
    return { cell, job: { id: cell.id, latex, files } };
  };
  const loadJob = job('load', loadProbeLatex(setting, setup, ask));
  const testJobs = ask.packages.map((p) => job(`package:${spellingOf(p)}`, loadTestLatex(setting, setup, p)));
  const [loadOutcome, ...testOutcomes] = await runCells(store, engine, [loadJob, ...testJobs]);
  if (loadOutcome === undefined) throw new Error('probe: the load probe gave no outcome');

  const load = statusOf(loadOutcome.result);
  const read = readProbe(loadOutcome.result.log);
  const packages: Record<string, PackageTest> = {};
  ask.packages.forEach((p, i) => {
    const outcome = testOutcomes[i];
    if (outcome === undefined) return;
    const { status, reading } = statusOf(outcome.result);
    packages[spellingOf(p)] = testOf(status, outcome.result.threw !== undefined ? [outcome.result.threw] : reading.errors.map((e) => e.message), reading.warnings);
  });
  const spellings = Object.keys(packages);
  const layoutOk = ['twocolumn', 'textWidth', 'columnWidth', 'paperWidth', 'paperHeight', 'fontSize'].every((k) => read.layout.has(k));
  return {
    classSetting: setting.id,
    engine: engine.fingerprint(),
    probe: PROBE_VERSION,
    loads: { status: load.status, errors: loadOutcome.result.threw !== undefined ? [loadOutcome.result.threw] : load.reading.errors.map((e) => e.message) },
    files: read.files,
    preloads: ask.packages.map((p) => p.name).filter((name, i, all) => read.loaded.has(name) && all.indexOf(name) === i),
    clashes: ask.defines.filter((name) => read.defined.has(name)),
    lacks: load.status === 'ok' ? ask.redefines.filter((name) => !read.defined.has(name)) : [],
    layout: layoutOk
      ? {
          // `\if@twocolumn`, or columns narrower than the text: REVTeX lays out
          // its two columns with its own grid and leaves the flag false. A
          // class that switches to two columns only at `\maketitle` (acmart's
          // sigconf) reads as one column here, since the probe has no title.
          twocolumn:
            read.layout.get('twocolumn') === 'yes' ||
            Number.parseFloat(read.layout.get('columnWidth') ?? '0') < 0.75 * Number.parseFloat(read.layout.get('textWidth') ?? '0'),
          textWidth: read.layout.get('textWidth') ?? '',
          columnWidth: read.layout.get('columnWidth') ?? '',
          paperWidth: read.layout.get('paperWidth') ?? '',
          paperHeight: read.layout.get('paperHeight') ?? '',
          fontSize: read.layout.get('fontSize') ?? '',
        }
      : null,
    packages,
    forbids: spellings.filter((s) => packages[s]?.status !== 'ok'),
    cautions: spellings.filter((s) => packages[s]?.status === 'ok' && (packages[s]?.cautions.length ?? 0) > 0),
  };
};

/**
 * The probe as a stage: one instance per class setting, its output saved
 * under the hash of the class setting, the setup, the ask, the files and the
 * engine. Asking for one more package makes the stage stale, and rerunning it
 * compiles only the new load test.
 */
export const probeStage = (store: Store, engine: Engine): Stage<ProbeInput, ClassProfile> => ({
  name: 'probe',
  version: PROBE_VERSION,
  instance: (input) => `${input.setting.id}.${input.setup.id}`,
  inputs: (input) => ({
    setting: input.setting,
    setup: input.setup,
    ask: input.ask,
    files: input.files.map((f) => [f.path, sha256(f.bytes)]),
    engine: engine.fingerprint(),
  }),
  compute: (input) => probeClass(store, engine, input),
});
