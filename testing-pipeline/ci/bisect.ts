/**
 * Bisecting document-wide failures after a pair's run (ARCHITECTURE.md
 * section 5, stages 6 and 7; BATCHES.md step 6): which branch of a document
 * causes a failure the judge could not tie to one. It runs in the pair's own
 * CI job, after its compile, on the same engines.
 *
 *   npm run compat -- ci/bisect.ts --classes <id> --setups <id> [--library] [--depth 2] [--size 64] [--budget 200] [--lanes <n>] [--dry] [--out <file>]
 *
 * A failure no line ties to a branch (an error on a preamble line no branch
 * put there, a fatal stop, no page, no .bbl, labels that changed) fails every
 * branch of its document, so the ledger cannot say which one to fix. This
 * command files as `run` does (after the run it finds nothing new), rebuilds
 * the pair's cells, reads their results through the store and judges them.
 *
 * 1. The symptom. Each failing document gets one: its first document-wide
 *    failure that is not a consequence of another (`fatal`, `no-pages`,
 *    `sentinel:preamble`, an `Emergency stop` error), else the first of those.
 *    It is matched by check and evidence shape, as explain.ts matches
 *    (`checkOf`, `evidenceShape`). A trial shows it when any failure of its
 *    judgement matches, the document's or any verdict's, tied or not (explain's
 *    `failureIn` for an untied symptom): in a smaller document the log may tie
 *    it to a branch. A consequence counts only when it is the trial's own
 *    symptom by the same rule: in a half, another branch's own error, or the
 *    class's preamble, can stop TeX where the whole stopped earlier, and that
 *    stop is not the one sought. A document whose only document-wide failures are
 *    consequences while a verdict holds a tied error is skipped: the judge
 *    already named what stopped TeX. One whose symptom a verdict also holds
 *    tied (a skipped conditional's owner) is answered without a trial.
 * 2. The base. Once per pair, the document of no branch is compiled
 *    (`documentOf([])`, explain's step 0). A symptom it shows is the class's
 *    or the setup's own preamble: its group is reported `base` and not halved.
 * 3. Groups. Documents are grouped by symptom, the biggest group first. One
 *    representative per group, its smallest document, is halved fully: each
 *    half packed as the filer packs (`packBranches`), compiled through the
 *    store (a repeat is free) and judged. A half that does not show the
 *    symptom clears its branches; one that does is halved again, down to
 *    single branches: the culprits. When both halves pass but their whole
 *    fails, explain's `minimize` keeps the fewest that still fail: a
 *    combination, a limit when more than two (the document's mass), marked
 *    unverified when that set's own trial does not fail. Each other document
 *    of the group takes one trial without the branches holding a culprit's
 *    way (its leaf's node and way, at any step): passing credits the culprit;
 *    failing halves what is left, while the budget allows.
 * 4. Lanes. Groups run side by side, `--lanes` at once (half the engines,
 *    rounded up), each trial's fresh result keys reserved against `--budget`
 *    before it compiles, so the cap holds exactly.
 *
 * `--budget` caps the new compiles (results in the store cost nothing). A
 * trial that would go over it is not compiled: its group stops there, no
 * other group starts, and what is left is listed unresolved or not split.
 * Run it again with a larger budget: every trial so far comes from the store.
 *
 * `--dry` compiles nothing: per group, its symptom, documents, representative
 * and at most how many compiles it takes; the base from the store when it is
 * there. Reading the run back never compiles either: a cell with no stored
 * result is skipped and counted, and the engine it reads with refuses to
 * compile.
 *
 * Output: JSON to `--out` (default `out/bisect-<class>.<setup>.json`): per
 * group its symptom, documents, culprits (branches with chain, node and way,
 * the matched failure's evidence, the key of the result that showed it, how
 * many documents credit it), confirmations, tied owners, halvings and what is
 * unresolved; compiles used, and results the engine threw on or gave no log
 * for, counted apart. Then a summary on the console, culprits counted by the
 * node and way of each step of their chains, since a preamble clash often
 * comes from a step above the leaf.
 */
import { existsSync, writeFileSync } from 'node:fs';
import { availableParallelism } from 'node:os';
import { join } from 'node:path';

import {
  checkOf,
  documentCells,
  documentOf,
  evidenceShape,
  fileBranches,
  judge,
  minimize,
  packBranches,
  resultAt,
  resultKey,
  runCells,
  type BranchId,
  type BranchSpec,
  type Engine,
  type Failure,
  type FiledDocument,
  type JudgedJob,
  type Judgement,
  type PathStep,
  type RawResult,
} from 'compat-core';

import { latexLibClasses, latexLibWays } from '../host-flouest/src/latexLib.ts';
import { loadSubject } from '../host-flouest/src/subject.ts';
import { flag, numberOption, openWorkspace, option, underName } from '../host-flouest/src/workspace.ts';

const depth = numberOption('depth', 2);
const size = numberOption('size', 64);
const budget = numberOption('budget', 200);
const dry = flag('dry');

/** The next trial would compile past `--budget`. */
class Spent extends Error {}
/** The engine could not give a result: it says nothing of the branches, so the search stops rather than guess a side. */
class Unusable extends Error {}

const messageOf = (error: unknown): string => (error instanceof Error ? error.message : String(error));

// ---- Symptoms ----

/** A failure as bisect follows it: its check and evidence shape (explain.ts's), with the evidence as first seen. */
type Symptom = { readonly check: string; readonly shape: string; readonly evidence: string };

const asSymptom = (failure: Failure): Symptom => ({ check: checkOf(failure), shape: evidenceShape(failure.evidence), evidence: failure.evidence });
const symptomKey = (s: Symptom): string => `${s.check}\n${s.shape}`;
const matches = (failure: Failure, s: Symptom): boolean => checkOf(failure) === s.check && evidenceShape(failure.evidence) === s.shape;

/** What follows from an earlier failure: TeX stopped, shipped nothing, never ran the sentinel preamble. */
const CONSEQUENCES = new Set(['fatal', 'no-pages', 'sentinel:preamble']);
const isConsequence = (failure: Failure): boolean =>
  CONSEQUENCES.has(checkOf(failure)) || (checkOf(failure) === 'error' && failure.evidence.startsWith('Emergency stop'));

/** A TeX error the judge tied to a branch: what stopped TeX is named. */
const tiedError = (j: Judgement): boolean => j.verdicts.some((v) => v.failures.some((f) => f.check === 'error'));

/** A failing document's symptom and the branches a verdict ties it to; `attributed` when only consequences are untied and a tied error explains them. */
const primaryOf = (j: Judgement): { readonly symptom: Symptom; readonly owners: readonly BranchId[] } | 'attributed' | undefined => {
  const wide = [...j.document, ...j.verdicts.flatMap((v) => v.failures.filter((f) => f.check.endsWith(':document')))];
  const pick = wide.find((f) => !isConsequence(f)) ?? wide[0];
  if (pick === undefined) return undefined;
  if (isConsequence(pick) && tiedError(j)) return 'attributed';
  const symptom = asSymptom(pick);
  // Owners only when the oracle skipped the end of a conditional (its other verdicts got `:document`): a failure
  // in judgement.document is one it could tie to no branch, and a branch's own error of the same shape (every
  // "Undefined control sequence" is one shape) does not explain it, so that document goes through the trials.
  const owners = j.document.includes(pick) ? [] : j.verdicts.filter((v) => v.failures.some((f) => !f.check.endsWith(':document') && matches(f, symptom))).map((v) => v.branch);
  return { symptom, owners };
};

/**
 * The failure that shows `s` in `j`, anywhere. A consequence only when it is `j`'s own symptom too: a stop that
 * follows another error, tied (a branch's own) or not (the class's preamble), is that error's.
 */
const shown = (j: Judgement, s: Symptom): Failure | undefined => {
  if (j.noVerdict !== undefined) return undefined;
  if (isConsequence(s)) {
    const own = primaryOf(j);
    if (typeof own !== 'object' || symptomKey(own.symptom) !== symptomKey(s)) return undefined;
  }
  return [...j.document, ...j.verdicts.flatMap((v) => v.failures)].find((f) => matches(f, s));
};

// ---- Branches ----

/** A branch as the report names it: its chain and its leaf's node, variant and way. */
const named = (branch: BranchSpec) => {
  const leaf = branch.path.at(-1);
  return { branch: branch.id, chain: branch.path.map((s) => s.node).join(' > '), node: leaf?.node, way: leaf?.variant.way, variant: leaf?.variant, member: leaf?.member };
};

const stepKey = (step: PathStep): string => `${step.node} ${step.variant.way}`;
const leafKey = (branch: BranchSpec): string => {
  const leaf = branch.path.at(-1);
  return leaf === undefined ? '' : stepKey(leaf);
};
/** Whether the branch holds that node and way at any step: a way can break its document from above the leaf. */
const holds = (branch: BranchSpec, key: string): boolean => branch.path.some((s) => stepKey(s) === key);

/** The two halves bisecting takes, the first the larger. */
const halvesOf = <T>(items: readonly T[]): [T[], T[]] => {
  const half = Math.ceil(items.length / 2);
  return [items.slice(0, half), items.slice(half)];
};

/** Halves compiled at most to reach one culprit among `n` branches: two at each level. */
const halvesToOne = (n: number): number => 2 * Math.ceil(Math.log2(Math.max(1, n)));

const ws = openWorkspace();
const [under, ...more] = ws.under;
if (under === undefined || more.length > 0) {
  console.error(`bisect: pick one class setting and setup (--classes <id> --setups <id>); these pick ${ws.under.length}: ${ws.under.map(underName).join(' ')}`);
  process.exit(1);
}
const pair = underName(under);
const outFile = option('out') ?? join(ws.config.out, `bisect-${pair}.json`);
// Two halves are in flight per lane, so half the engines keep them all busy.
const engines = typeof ws.config.engines === 'number' ? ws.config.engines : Math.min(8, availableParallelism());
const lanes = Math.max(1, Math.floor(numberOption('lanes', Math.ceil(engines / 2))));

try {
  const { host, plan } = loadSubject(ws.flouest, depth).withWays(flag('library') ? await latexLibWays(ws) : [], await latexLibClasses(ws));
  const rules = host.documentRules();
  const requires = (branch: BranchSpec): readonly string[] => host.requires(branch);
  const claims = (branch: BranchSpec): readonly string[] => host.claims(branch);
  // The same filing as runMatrix (src/matrix.ts): after the run it files nothing.
  const filing = fileBranches(ws.store, plan.branches, rules, { size, requires, claims });
  if (filing.filed.length > 0) console.log(`bisect: filed ${filing.filed.length} new document(s): the run had not filed them, so their cells have no result yet`);

  const engine = await ws.engine();
  const fingerprint = engine.fingerprint();
  // Reading the run back, and anything under --dry, compiles nothing: this engine refuses to.
  const readOnly: Engine = { fingerprint: () => fingerprint, compile: () => Promise.reject(new Error('bisect: this step compiles nothing')), close: async () => {} };
  const keyOf = (job: JudgedJob): string => resultKey(job.job, fingerprint);
  const stored = (key: string): boolean => existsSync(join(ws.config.out, `${resultAt(key)}.json.gz`));
  const cellsOf = (document: FiledDocument): JudgedJob[] => documentCells(host, document, [under.classSetting], [under.setup], ws.classFiles);

  type Judged = { readonly key: string; readonly judgement: Judgement };
  /** Cells read through the store with the read-only engine and judged. */
  const readJudged = async (jobs: readonly JudgedJob[]): Promise<Judged[]> => {
    const outcomes = await runCells(ws.store, readOnly, jobs);
    return jobs.flatMap((job, i) => {
      const o = outcomes[i];
      return o === undefined ? [] : [{ key: o.key, judgement: judge({ cell: o.cell.id, emitted: job.emitted, result: o.result, expected: job.expected }) }];
    });
  };

  // 1. The run's failing documents, one at a time, so no LaTeX or log is kept but theirs.
  type Target = { readonly document: string; readonly cell: string; readonly key: string; readonly branches: readonly BranchSpec[]; readonly symptom: Symptom; readonly owners: readonly BranchId[] };
  const targets: Target[] = [];
  const read = { cells: 0, missing: 0, emptyLog: 0, attributed: 0 };
  for (const { document } of filing.documents) {
    for (const job of cellsOf(document)) {
      read.cells++;
      if (!stored(keyOf(job))) {
        read.missing++;
        continue;
      }
      const [judged] = await readJudged([job]);
      if (judged === undefined) continue;
      const { judgement } = judged;
      // The store keeps no result the engine threw on; one saved with no log is taken as missing, so the read-only engine refused it.
      if (judgement.noVerdict !== undefined) {
        read.emptyLog++;
        continue;
      }
      const primary = primaryOf(judgement);
      if (primary === undefined) continue;
      if (primary === 'attributed') {
        read.attributed++;
        continue;
      }
      // The branches the cell judged: those that fit the pair, in the order they were packed.
      const judgedIds = new Set(judgement.verdicts.map((v) => v.branch));
      targets.push({ document: document.id, cell: judgement.cell, key: judged.key, branches: document.paths.filter((b) => judgedIds.has(b.id)), ...primary });
    }
  }

  // Grouped by symptom, the biggest group first; in each, the smallest document first, so the one halved is the cheapest.
  type Group = { readonly key: string; readonly symptom: Symptom; readonly targets: Target[] };
  const byKey = new Map<string, Group>();
  for (const t of targets) {
    const key = symptomKey(t.symptom);
    const group = byKey.get(key) ?? { key, symptom: t.symptom, targets: [] };
    group.targets.push(t);
    byKey.set(key, group);
  }
  const groups = [...byKey.values()].sort((a, b) => b.targets.length - a.targets.length || (a.key < b.key ? -1 : 1));
  for (const g of groups) g.targets.sort((a, b) => a.branches.length - b.branches.length || (a.document < b.document ? -1 : 1));
  console.log(
    `bisect: ${pair}: ${targets.length} document(s) with a document-wide failure in ${groups.length} symptom group(s) among ${read.cells - read.missing - read.emptyLog} cells read` +
      (read.attributed > 0 ? `; ${read.attributed} skipped (only consequences untied, a tied error names the cause)` : '') +
      (read.missing > 0 ? `; ${read.missing} cell(s) have no stored result and are skipped` : '') +
      (read.emptyLog > 0 ? `; ${read.emptyLog} stored with no log, skipped` : ''),
  );

  // ---- Compiling ----

  let used = 0;
  let spent = false;
  const reserved = new Set<string>();
  const broken = { threw: new Set<string>(), emptyLog: new Set<string>() };
  // Lanes run side by side: a cell two of them try at once compiles once.
  const pending = new Map<string, Promise<RawResult>>();
  const once: Engine = {
    fingerprint: () => fingerprint,
    compile: (job) => {
      const key = resultKey(job, fingerprint);
      let result = pending.get(key);
      if (result === undefined) {
        result = engine.compile(job);
        pending.set(key, result);
        // Once run.ts has saved it the store answers; one it does not save (threw, no log) stays here, so it is not compiled twice.
        result.then(
          (r) => {
            if (r.threw === undefined && r.log.trim() !== '') setTimeout(() => pending.delete(key), 0);
          },
          () => {},
        );
      }
      return result;
    },
    close: async () => {},
  };

  type Tally = { compiles: number };
  /** Sets of cells compiled through the store and judged, their fresh keys reserved against --budget first. */
  // `symptom`: what the trial looks for. A result with no log (the engine gave up, about 120 s) shows nothing but
  // no-log, so it cannot clear a half or decide a minimize step for any other symptom: it is unusable, like a throw.
  const compileSets = async (sets: readonly (readonly JudgedJob[])[], tally: Tally, symptom?: Symptom): Promise<Judged[][]> => {
    const fresh = [...new Set(sets.flat().map(keyOf))].filter((k) => !reserved.has(k) && !stored(k));
    if (used + fresh.length > budget) throw new Spent();
    used += fresh.length;
    tally.compiles += fresh.length;
    for (const k of fresh) reserved.add(k);
    const outcomes = await runCells(ws.store, once, sets.flat());
    let at = 0;
    return sets.map((jobs) =>
      jobs.map((job) => {
        const outcome = outcomes[at++];
        if (outcome === undefined) throw new Error('the runner returned too few outcomes');
        if (outcome.result.threw !== undefined) {
          broken.threw.add(outcome.key);
          throw new Unusable(`the engine could not compile ${outcome.cell.id}: ${outcome.result.threw.slice(0, 200)}`);
        }
        if (outcome.result.log.trim() === '') {
          broken.emptyLog.add(outcome.key);
          if (symptom !== undefined && symptom.check !== 'no-log') throw new Unusable(`the engine gave ${outcome.cell.id} no log (it gave up): no trial for ${symptom.check}`);
        }
        return { key: outcome.key, judgement: judge({ cell: outcome.cell.id, emitted: job.emitted, result: outcome.result, expected: job.expected }) };
      }),
    );
  };

  /** Some branches compiled as the filer packs them: whether one of their documents shows the symptom, and which. */
  type Trial = { readonly fails: boolean; readonly key?: string; readonly evidence?: string; readonly keys: readonly string[] };
  const trySets = async (sets: readonly (readonly BranchSpec[])[], symptom: Symptom, tally: Tally): Promise<Trial[]> => {
    const judged = await compileSets(sets.map((set) => packBranches(set, rules, size, requires, claims).flatMap(cellsOf)), tally, symptom);
    return judged.map((docs) => {
      const keys = docs.map((d) => d.key);
      for (const d of docs) {
        const failure = shown(d.judgement, symptom);
        if (failure !== undefined) return { fails: true, key: d.key, evidence: failure.evidence, keys };
      }
      return { fails: false, keys };
    });
  };

  // 2. The base: the document of no branch, once per pair. Under --dry only from the store, else compiled (one key against the budget).
  const baseJobs = documentCells(host, documentOf([], rules), [under.classSetting], [under.setup], ws.classFiles);
  const baseKey = baseJobs[0] === undefined ? undefined : keyOf(baseJobs[0]);
  const baseGroups = new Set<Group>();
  let baseNote: string | undefined;
  if (groups.length > 0 && baseKey !== undefined) {
    try {
      const judged = dry ? (stored(baseKey) ? await readJudged(baseJobs) : undefined) : (await compileSets([baseJobs], { compiles: 0 }))[0];
      if (judged === undefined) baseNote = 'not stored: compiled first when not dry (one compile)';
      for (const g of groups) if (judged?.some((d) => shown(d.judgement, g.symptom) !== undefined) === true) baseGroups.add(g);
    } catch (error) {
      // Over the budget nothing starts; a base the engine could not give leaves every group to be halved.
      if (error instanceof Spent) spent = true;
      baseNote = error instanceof Spent ? `not compiled: over --budget ${budget}` : `failed: ${messageOf(error)}`.slice(0, 300);
    }
  }

  if (dry) {
    // 3a. The plan only: each representative is packed and emitted, never compiled.
    let atMost = baseKey !== undefined && !stored(baseKey) && groups.length > 0 ? 1 : 0;
    for (const g of groups) {
      const tied = g.targets.filter((t) => t.owners.length > 0).length;
      const rep = g.targets.find((t) => t.owners.length === 0);
      let line = `  ${String(g.targets.length).padStart(4)} document(s)  ${g.symptom.check.padEnd(20)} ${g.symptom.shape.slice(0, 70)}`;
      if (baseGroups.has(g)) line += '\n        base: the document of no branch shows it, nothing to halve';
      else if (rep === undefined) line += `\n        every one tied to its owner (${tied}): nothing to compile`;
      else {
        const whole = packBranches(rep.branches, rules, size, requires, claims).flatMap(cellsOf);
        const same = whole.length === 1 && whole[0] !== undefined && keyOf(whole[0]) === rep.key;
        const most = (rep.branches.length > 1 ? halvesToOne(rep.branches.length) : 0) + (same ? 0 : 1);
        const confirm = g.targets.length - tied - 1;
        atMost += most + confirm;
        line +=
          `\n        halve ${rep.document} (${rep.branches.length} branches): at most ${most} compiles${same ? '' : ' (its repacked whole is not the stored one: +1)'}` +
          `; then ${confirm} confirmation(s), one compile each when the culprit's way is there${tied > 0 ? `; ${tied} tied to their owner` : ''}`;
      }
      console.log(line);
    }
    const base = baseKey === undefined ? 'none (no cell)' : stored(baseKey) ? `stored, shows ${baseGroups.size} group(s)` : (baseNote ?? 'not stored');
    console.log(`bisect: --dry: ${groups.length} group(s); base ${base}; at most about ${atMost} compiles if every confirmation passes (budget ${budget}, ${lanes} lane(s)); nothing compiled`);
  } else {
    // 3b. Halving one representative per group and confirming the rest, groups side by side.
    type Found = { readonly branches: readonly BranchSpec[]; readonly document: string; readonly trial: Trial; readonly minimized: boolean; readonly verified: boolean };
    const kindOf = (f: Found): string => (f.branches.length === 1 ? 'branch' : f.branches.length === 2 ? 'combination' : 'limit');

    /** Halving `from`, some of a document's branches; `given` is their trial when one was made. */
    const halve = async (t: Target, from: readonly BranchSpec[], given: Trial | undefined, without: readonly string[], tally: Tally) => {
      const order = new Map(t.branches.map((b, i) => [b.id, i]));
      const inOrder = (set: readonly BranchSpec[]): BranchSpec[] => [...set].sort((a, b) => (order.get(a.id) ?? 0) - (order.get(b.id) ?? 0));
      const tryIn = (sets: readonly (readonly BranchSpec[])[]): Promise<Trial[]> => trySets(sets.map(inOrder), t.symptom, tally);
      const found: Found[] = [];
      const cleared: BranchSpec[] = [];
      const before = tally.compiles;
      let stopped: string | undefined;

      const split = async (branches: readonly BranchSpec[], trial: Trial): Promise<void> => {
        if (branches.length === 1) {
          found.push({ branches, document: t.document, trial, minimized: true, verified: true });
          return;
        }
        const [first, second] = halvesOf(branches);
        const [a, b] = await tryIn([first, second]);
        if (a === undefined || b === undefined) throw new Error('no trial for a half');
        // One half failing clears the other; both failing means a culprit in each.
        if (a.fails !== b.fails) cleared.push(...(a.fails ? second : first));
        if (a.fails) await split(first, a);
        if (b.fails) await split(second, b);
        if (a.fails || b.fails) return;
        // Neither half alone: the failure takes branches from both. The fewest that still bring it back, by explain.ts's halving.
        try {
          const kept = inOrder(await minimize(branches, async (some) => some.length > 0 && (await tryIn([some]))[0]?.fails === true));
          // minimize may end on a set it never tried whole: try it, and say so when it does not fail.
          const [check] = kept.length === branches.length ? [trial] : await tryIn([kept]);
          const verified = check?.fails === true;
          found.push({ branches: kept, document: t.document, trial: verified && check !== undefined ? check : trial, minimized: true, verified });
        } catch (error) {
          if (!(error instanceof Spent)) throw error;
          found.push({ branches: inOrder(branches), document: t.document, trial, minimized: false, verified: false });
          throw error;
        }
      };

      try {
        // The whole, repacked: the stored result when it packs the same, else one compile.
        const whole = given ?? (await tryIn([from]))[0];
        if (whole?.fails !== true) stopped = 'not reproduced: the repacked document does not show its symptom';
        else await split(from, whole);
      } catch (error) {
        stopped = error instanceof Spent ? `budget: the next trial would compile past --budget ${budget}` : `failed: ${messageOf(error)}`.slice(0, 300);
      }
      const decided = new Set([...found.flatMap((f) => (f.minimized ? f.branches.map((b) => b.id) : [])), ...cleared.map((b) => b.id)]);
      const report = {
        document: t.document,
        cell: t.cell,
        key: t.key,
        branches: t.branches.length,
        halved: from.length,
        ...(without.length > 0 ? { without } : {}),
        found: found.length,
        cleared: cleared.length,
        undecided: stopped === undefined ? [] : from.filter((b) => !decided.has(b.id)).map((b) => b.id),
        compiles: tally.compiles - before,
        ...(stopped === undefined ? {} : { stopped }),
      };
      return { found, stopped, report };
    };

    const runGroup = async (g: Group) => {
      const tally: Tally = { compiles: 0 };
      const known: Found[] = [];
      const credits = new Map<Found, number>();
      const tied: unknown[] = [];
      const confirmations: unknown[] = [];
      const halvings: unknown[] = [];
      const unresolved: { readonly document: string; readonly why: string }[] = [];
      let stop: string | undefined;
      for (const t of g.targets) {
        if (stop !== undefined) {
          unresolved.push({ document: t.document, why: stop });
          continue;
        }
        // The judge tied the symptom to its owner (a skipped conditional's error): no trial needed.
        if (t.owners.length > 0) {
          tied.push({ document: t.document, branches: t.branches.filter((b) => t.owners.includes(b.id)).map(named) });
          continue;
        }
        // Culprits found in this group whose ways this document holds too: one trial without them.
        const present = known.filter((f) => f.verified && f.branches.every((b) => t.branches.some((x) => holds(x, leafKey(b)))));
        const without = [...new Set(present.flatMap((f) => f.branches.map(leafKey)))];
        let from = t.branches;
        let given: Trial | undefined;
        if (present.length > 0) {
          const rest = t.branches.filter((b) => !without.some((k) => holds(b, k)));
          try {
            const [trial] = await trySets([rest], g.symptom, tally);
            if (trial !== undefined && !trial.fails) {
              for (const f of present) credits.set(f, (credits.get(f) ?? 0) + 1);
              // Every branch holding the way leaves nothing to compile: credited, not verified.
              confirmations.push({ document: t.document, culprits: present.map((f) => known.indexOf(f)), removed: t.branches.length - rest.length, verified: rest.length > 0, keys: trial.keys });
              continue;
            }
            // Something else among the rest shows it too: halve the rest, its trial already made.
            from = rest;
            given = trial;
          } catch (error) {
            if (error instanceof Spent) {
              stop = `budget: the next trial would compile past --budget ${budget}`;
              spent = true;
            }
            unresolved.push({ document: t.document, why: stop ?? `failed: ${messageOf(error)}`.slice(0, 300) });
            continue;
          }
        }
        const h = await halve(t, from, given, present.length > 0 ? without : [], tally);
        halvings.push(h.report);
        known.push(...h.found);
        if (h.stopped?.startsWith('budget') === true) {
          stop = h.stopped;
          spent = true;
        }
      }
      return {
        symptom: g.symptom,
        documents: g.targets.map((t) => t.document),
        ways: [...new Set(known.flatMap((f) => (f.verified ? f.branches.map(leafKey) : [])))],
        culprits: known.map((f) => ({
          kind: kindOf(f),
          ...(f.minimized ? {} : { minimized: false }),
          verified: f.verified,
          found: f.document,
          key: f.trial.key,
          error: f.trial.evidence,
          credited: 1 + (credits.get(f) ?? 0),
          branches: f.branches.map(named),
        })),
        confirmations,
        tied,
        halvings,
        unresolved,
        compiles: tally.compiles,
        // Each step of each verified culprit's chain, weighted by the documents that credit it: where to look.
        steps: known.flatMap((f) => (f.verified ? f.branches.flatMap((b) => b.path.map((s) => ({ step: stepKey(s), credit: 1 + (credits.get(f) ?? 0) }))) : [])),
      };
    };

    const queue = groups.filter((g) => !baseGroups.has(g));
    const done = new Map<Group, Awaited<ReturnType<typeof runGroup>>>();
    await Promise.all(
      Array.from({ length: lanes }, async () => {
        // Once the budget is spent no group starts; one already running goes on while its trials fit.
        for (let g = spent ? undefined : queue.shift(); g !== undefined; g = spent ? undefined : queue.shift()) done.set(g, await runGroup(g));
      }),
    );
    const notSplit = groups.filter((g) => !baseGroups.has(g) && !done.has(g));

    const reports = groups.flatMap((g): object[] => {
      if (baseGroups.has(g)) return [{ symptom: g.symptom, documents: g.targets.map((t) => t.document), base: true }];
      const r = done.get(g);
      if (r === undefined) return [];
      const { steps: _steps, ...report } = r;
      return [report];
    });
    const out = {
      pair,
      at: new Date().toISOString(),
      budget,
      lanes,
      compiles: used,
      read,
      trials: { threw: broken.threw.size, emptyLog: broken.emptyLog.size },
      base: { key: baseKey, groups: baseGroups.size, ...(baseNote === undefined ? {} : { note: baseNote }) },
      groups: reports,
      notSplit: notSplit.map((g) => ({ symptom: g.symptom, documents: g.targets.map((t) => t.document) })),
    };
    writeFileSync(outFile, `${JSON.stringify(out, null, 1)}\n`);

    const all = [...done.values()];
    const count = (pick: (r: (typeof all)[number]) => readonly unknown[]): number => all.reduce((n, r) => n + pick(r).length, 0);
    console.log(
      `bisect: ${pair}: ${groups.length} group(s), ${baseGroups.size} from the base, ${done.size} searched with ${used} new compile(s) (budget ${budget}, ${lanes} lane(s)): ` +
        `${count((r) => r.culprits)} culprit(s), ${count((r) => r.confirmations)} confirmation(s), ${count((r) => r.tied)} tied, ${count((r) => r.unresolved)} unresolved, ` +
        `${count((r) => r.halvings.filter((h) => (h as { stopped?: string }).stopped !== undefined))} halving(s) stopped` +
        (notSplit.length > 0 ? `; ${notSplit.length} group(s) not started (budget)` : '') +
        (broken.threw.size + broken.emptyLog.size > 0 ? `; trials the engine threw on: ${broken.threw.size}, with no log: ${broken.emptyLog.size}` : ''),
    );
    const bySteps = new Map<string, number>();
    for (const { step, credit } of all.flatMap((r) => r.steps)) bySteps.set(step, (bySteps.get(step) ?? 0) + credit);
    for (const [step, n] of [...bySteps].sort((a, b) => b[1] - a[1]).slice(0, 15)) console.log(`  ${String(n).padStart(4)}  ${step}`);
    for (const r of all) for (const u of r.unresolved.filter((x) => !x.why.startsWith('budget'))) console.log(`  ${u.document}: ${u.why}`);
    console.log(`bisect: written to ${outFile}`);
  }
} finally {
  await ws.close();
}
