/**
 * The explainer (ARCHITECTURE.md section 5, stage 7; ../ARCHITECTURE.md 4.6):
 * from a failure the matrix shows to a candidate rule with a minimal
 * reproducer.
 *
 * Failures are grouped by what they say (the check and the shape of its
 * evidence), where they were seen (the class setting and setup, for a failure
 * new under a class; the reference, for one the branch shows there too) and,
 * when the log tied the failure to its branch, the branch's chain of nodes and
 * its leaf's way. A failure the way shows alone needs no trial: its solo
 * branch is the reproducer (`soloExplanations`). One branch stands for each
 * other group and is explained by trials: small documents compiled through
 * the store like any other, so explaining again compiles nothing.
 *
 * 0. A failure the log could not tie to a branch is first tried on a document
 *    holding no branch: one that shows it there comes from the host's own
 *    preamble under that class, whatever the document holds.
 * 1. Which branches it takes. The branch alone; if it passes alone, the
 *    fewest of its document's other branches that bring the failure back,
 *    found by halving as Flouest's `limits.ts` does. A failure the log could
 *    not tie to a branch is halved over the whole document. Two branches give
 *    a combination rule. More that cannot be halved further give a limit: the
 *    document's mass, not a pair.
 * 2. The shortest chain. Every legal chain made from the one branch by
 *    dropping steps (each kept step keeping its variant and, while it still
 *    fits, its member) is tried, shortest first; the first that still fails is
 *    the reproducer, and its last step is the rule's child. A node that fails
 *    alone at the top is its way's own: a defect, or, when the reference
 *    passes it, a class rule.
 * 3. What matters about the parent. Its node's other variants and its
 *    variant's other members are tried in its place, and the child's other
 *    members in the child's. Values every failing member shares and no
 *    passing one has become the rule's `when`. A node above the parent
 *    matters when one of its other variants passes; one that does not is
 *    there only to make the place legal, and the rule's scope stays direct.
 * 4. A way that works there. The child node's other variants are tried in its
 *    place; the first that passes is the fallback, else the rule denies.
 * 5. Where it holds. A rule found under another class setting is tried under
 *    the reference; when the reference passes it, the rule is that class
 *    setting's.
 *
 * Adapts, and dropping one package of a way, need what the interim library
 * cannot give (a way's adapt candidates, its packages as parts); they come
 * with the library's keys. Trying a node's other variants covers its other
 * package sets.
 */
import { appliesTo } from './config.ts';
import { documentCells } from './cells.ts';
import { documentOf } from './file.ts';
import { canonical, hashJson } from './hash.ts';
import { branchId, variantKey } from './ids.ts';
import { shapeOf } from './log.ts';
import type {
  BranchId,
  BranchSpec,
  ClassSetting,
  DocumentRules,
  EngineFile,
  Failure,
  HostVariant,
  Json,
  MemberValues,
  NestingTree,
  NodeId,
  PathStep,
  Setup,
  Variant,
  Verdict,
  WayId,
} from './model.ts';
import { judge, ORACLE_VERSION } from './oracle.ts';
import { attribute, checkOf, type Origin, type SoloFailures } from './origin.ts';
import { fits, markedOf, remembered, soloKey, type VariantsOf } from './plan.ts';
import type { Engine, Host, Store } from './ports.ts';
import { runCells } from './run.ts';

/** Raised whenever what the explainer decides changes, so saved explanations are made again. */
export const EXPLAIN_VERSION = 2;

/** How many of a node's other variants, or of a variant's other members, one step tries. */
const MOST_TRIED = 8;

const FAILED = 'the explainer failed: ';

/** A class setting under a setup, by id. */
export type Pair = { readonly classSetting: string; readonly setup: string };
export const pairName = ({ classSetting, setup }: Pair): string => `${classSetting}.${setup}`;

/** A failure as the explainer follows it: its check, the shape of its evidence, and whether the log tied it to a branch. */
export type Symptom = { readonly check: string; readonly shape: string; readonly tied: boolean };

/** Evidence with what changes from one place to the next taken out: numbers, quoted names, the line, the glyph a font lacks. */
export const evidenceShape = (evidence: string): string =>
  shapeOf(evidence.replace(/\s*\(l\.\d+\)\s*$/, '').replace(/There is no \S+ in font \S+/, 'There is no … in font …')).slice(0, 100);

export const symptomOf = (failure: Failure): Symptom => ({
  check: checkOf(failure),
  shape: evidenceShape(failure.evidence),
  tied: !failure.check.endsWith(':document'),
});

const matches = (failure: Failure, symptom: Symptom): boolean => checkOf(failure) === symptom.check && evidenceShape(failure.evidence) === symptom.shape;

// ---- Trials ----

/** Some branches as one document under one pair: each branch's verdict, and what the log could not tie to one. */
export type TrialResult = {
  readonly verdicts: readonly Verdict[];
  readonly document: readonly Failure[];
  /** Where its result is saved (`results/<key>`). */
  readonly key: string;
};

export type Trial = (branches: readonly BranchSpec[], pair: Pair) => Promise<TrialResult>;

/** Trials on a host: the branches packed as one document (`documentOf`), emitted, compiled through the store and judged. */
export const hostTrials = <D, P>(input: {
  readonly host: Host<D, P>;
  readonly store: Store;
  readonly engine: Engine;
  readonly rules: DocumentRules;
  readonly classSettings: readonly ClassSetting[];
  readonly setups: readonly Setup[];
  readonly classFiles?: (setting: ClassSetting) => readonly EngineFile[];
}): { readonly trial: Trial; readonly compiled: () => number } => {
  let compiled = 0;
  const trial: Trial = async (branches, pair) => {
    const classSetting = input.classSettings.find((c) => c.id === pair.classSetting);
    const setup = input.setups.find((s) => s.id === pair.setup);
    if (classSetting === undefined || setup === undefined || !appliesTo(setup, classSetting)) {
      throw new Error(`explain: no class setting and setup ${pairName(pair)} to try under`);
    }
    // A branch the class setting or setup does not fit (`Host.fits`, a class's own way) fails there without a compile.
    const unfit = branches.filter((b) => input.host.fits?.(b, classSetting, setup) === false);
    if (unfit.length > 0) {
      const failure = { check: 'fit', evidence: `not compiled under ${classSetting.id}: the host says ${unfit.map((b) => b.id).join(', ')} does not fit it` };
      return { verdicts: branches.map((b) => ({ branch: b.id, cell: '', pass: false, failures: [failure] })), document: [failure], key: '' };
    }
    const [job] = documentCells(input.host, documentOf(branches, input.rules), [classSetting], [setup], input.classFiles);
    if (job === undefined) throw new Error(`explain: nothing to emit for ${pairName(pair)}`);
    const [outcome] = await runCells(input.store, input.engine, [job]);
    if (outcome === undefined) throw new Error('explain: the runner returned nothing');
    if (!outcome.cached) compiled++;
    const judgement = judge({ cell: outcome.cell.id, emitted: job.emitted, result: outcome.result, expected: job.expected });
    return { verdicts: judgement.verdicts, document: judgement.document, key: outcome.key };
  };
  return { trial, compiled: () => compiled };
};

/**
 * The fewest of `items` with which `fails` still holds, by halving (Flouest's
 * `limits.ts` search). `fails(held + items)` holds on entry. Keep whichever
 * half still fails; when neither does alone, the failure takes some of each,
 * and each half is shrunk with the other held.
 */
export const minimize = async <T>(items: readonly T[], fails: (some: readonly T[]) => Promise<boolean>, held: readonly T[] = []): Promise<T[]> => {
  if (items.length <= 1) return [...items];
  const half = Math.ceil(items.length / 2);
  const first = items.slice(0, half);
  const second = items.slice(half);
  if (await fails([...held, ...first])) return minimize(first, fails, held);
  if (await fails([...held, ...second])) return minimize(second, fails, held);
  const keptFirst = await minimize(first, fails, [...held, ...second]);
  const keptSecond = await minimize(second, fails, [...held, ...keptFirst]);
  return [...keptFirst, ...keptSecond];
};

// ---- Rules ----

/** Some variants of a node, and the member values that matter, when some do. */
export type VariantsAt = {
  readonly node: NodeId;
  readonly variants: readonly Variant[];
  readonly when?: { readonly [name: string]: readonly Json[] };
};

/**
 * A candidate rule (../ARCHITECTURE.md 4.3). `pair`, when given: it holds
 * under that class setting and setup, and the reference passes it.
 *
 * - `base`: a document holding no branch fails: the host's own preamble.
 * - `defect`: the way fails alone at the top, under the reference too.
 * - `class`: the way fails alone at the top under `pair` only.
 * - `parent`: the child's variants fail under that chain of ancestors
 *   (`scope: 'direct'` for the parent alone); `passes` are the parent's
 *   variants that work there, `fallback` the child's first variant that does.
 * - `combo`: two branches fail together and pass apart; each one's ways.
 * - `limit`: more branches than two fail together and no fewer do.
 * - `unexplained`: the trials could not bring the failure back.
 */
export type Rule =
  | { readonly kind: 'base'; readonly pair?: string }
  | { readonly kind: 'defect'; readonly node: NodeId; readonly way: WayId }
  | { readonly kind: 'class'; readonly node: NodeId; readonly way: WayId; readonly pair: string }
  | {
      readonly kind: 'parent';
      readonly child: VariantsAt;
      readonly ancestors: readonly VariantsAt[];
      readonly scope: 'direct' | 'ancestor';
      readonly verdict: 'deny' | 'fallback';
      readonly fallback?: Variant;
      readonly passes: readonly Variant[];
      readonly pair?: string;
    }
  | { readonly kind: 'combo'; readonly ways: readonly (readonly WayId[])[]; readonly pair?: string }
  | { readonly kind: 'limit'; readonly branches: number; readonly nodes: readonly NodeId[]; readonly pair?: string }
  | { readonly kind: 'unexplained'; readonly why: string; readonly check: string; readonly shape: string };

/** What one explanation found. */
export type Explanation = {
  readonly rule: Rule;
  /** Where it was explained. */
  readonly pair: Pair;
  readonly symptom: Symptom;
  /** The failure as the reproducer shows it. */
  readonly evidence: string;
  /** The fewest branches, each on the shortest chain, that still show it. */
  readonly reproducer: readonly BranchSpec[];
  /** The reproducer's result (`results/<key>`). */
  readonly key?: string;
  readonly trials: number;
};

/** One failure to explain: a branch, the document it failed in, the pair it failed under, and what it showed. */
export type Case = {
  readonly branch: BranchSpec;
  readonly document: readonly BranchSpec[];
  readonly pair: Pair;
  readonly symptom: Symptom;
};

export type ExplainContext = {
  readonly trial: Trial;
  readonly nesting: NestingTree;
  readonly variantsOf: VariantsOf;
  /** The pair every other is compared with (`origin.ts`). */
  readonly reference: Pair;
  /** Where explanations are saved (`artifacts/explain/<key>`), keyed by the case and what its trials compile with (host and engine). */
  readonly saved?: { readonly store: Store; readonly fingerprint: string };
};

const isPlace = (nesting: NestingTree, nodes: readonly NodeId[]): boolean => {
  let level = nesting.roots;
  for (const node of nodes) {
    const found = level.find((n) => n.node === node);
    if (found === undefined) return false;
    level = found.children;
  }
  return true;
};

/** `when` from the members tried: each value name whose failing values no passing member has. Nothing when none passed. */
const whenOf = (failing: readonly MemberValues[], passing: readonly MemberValues[]): VariantsAt['when'] => {
  if (passing.length === 0 || failing.length === 0) return undefined;
  const when: { [name: string]: Json[] } = {};
  for (const name of new Set(failing.flatMap((m) => Object.keys(m)))) {
    const failed = new Set(failing.map((m) => canonical(m[name] ?? null)));
    const passed = new Set(passing.map((m) => canonical(m[name] ?? null)));
    if ([...failed].every((v) => !passed.has(v))) when[name] = [...failed].map((v) => JSON.parse(v) as Json);
  }
  return Object.keys(when).length > 0 ? when : undefined;
};

const waysOf = (branch: BranchSpec): WayId[] => branch.path.map((s) => s.variant.way);

/** An explainer over trials; each `explain` is one case. */
export const explainer = (ctx: ExplainContext) => {
  const variantsFor = remembered(ctx.variantsOf);
  const variantOf = (step: PathStep): HostVariant | undefined => variantsFor(step.node).find((v) => variantKey(v.variant) === variantKey(step.variant));

  /** Steps as a path: each keeps its variant, and its member while it fits its parent, else the first of its variant that does. */
  const rechain = (steps: readonly PathStep[]): PathStep[] | undefined => {
    const path: PathStep[] = [];
    for (const step of steps) {
      const hv = variantOf(step);
      if (hv === undefined) return undefined;
      const own = hv.members.find((m) => canonical(m.values) === canonical(step.member));
      const member = own !== undefined && fits(own, path.at(-1)) ? own : hv.members.find((m) => fits(m, path.at(-1)));
      if (member === undefined) return undefined;
      path.push({ node: step.node, variant: step.variant, member: member.values });
    }
    return path;
  };

  /**
   * Every legal chain made by dropping some of the path's steps, in order, by
   * length. Steps below may go too: a failure between two containers needs
   * neither the leaf nor what sits in it.
   */
  const shorterChains = (path: readonly PathStep[]): PathStep[][][] => {
    const byLength: PathStep[][][] = Array.from({ length: path.length }, () => []);
    for (let mask = 1; mask < (1 << path.length) - 1; mask++) {
      const kept = path.filter((_, i) => (mask & (1 << i)) !== 0);
      if (!isPlace(ctx.nesting, kept.map((s) => s.node))) continue;
      const chain = rechain(kept);
      if (chain !== undefined) byLength[kept.length]?.push(chain);
    }
    return byLength.filter((chains) => chains.length > 0);
  };

  const explain = async (c: Case): Promise<Explanation> => {
    const { symptom } = c;
    let trials = 0;
    const run = (branches: readonly BranchSpec[], pair: Pair = c.pair): Promise<TrialResult> => {
      trials++;
      return ctx.trial(branches, pair);
    };
    const failureIn = (result: TrialResult, on: BranchId): Failure | undefined =>
      symptom.tied
        ? result.verdicts.find((v) => v.branch === on)?.failures.find((f) => matches(f, symptom))
        : [...result.document, ...result.verdicts.flatMap((v) => v.failures)].find((f) => matches(f, symptom));
    /** A changed path as a branch, with the marked runs or the escape run of the branch it was made from. */
    const branchOf = (path: readonly PathStep[], from: BranchSpec): BranchSpec => {
      const marked = from.marked ?? markedOf(from.id);
      return { id: branchId(path, marked), path, marked };
    };
    const order = new Map(c.document.map((b, i) => [b.id, i]));
    const inOrder = (branches: readonly BranchSpec[]): BranchSpec[] => [...branches].sort((a, b) => (order.get(a.id) ?? -1) - (order.get(b.id) ?? -1));
    /** The reproducer, with the failure as it shows it, under `pair` and the scope that gives. */
    const done = async (rule: Rule, reproducer: readonly BranchSpec[], result: TrialResult, on: BranchId): Promise<Explanation> => ({
      rule,
      pair: c.pair,
      symptom,
      evidence: failureIn(result, on)?.evidence ?? '',
      reproducer,
      key: result.key,
      trials,
    });
    /** `{ pair }` when this is not the reference and the reference passes the reproducer. */
    const scope = async (reproducer: readonly BranchSpec[], on: BranchId): Promise<{ readonly pair?: string }> => {
      if (pairName(c.pair) === pairName(ctx.reference)) return {};
      return failureIn(await run(reproducer, ctx.reference), on) === undefined ? { pair: pairName(c.pair) } : {};
    };

    // 0. The host's own preamble.
    if (!symptom.tied) {
      const bare = await run([]);
      if (failureIn(bare, '') !== undefined) return done({ kind: 'base', ...(await scope([], '')) }, [], bare, '');
    }

    // 1. Which branches it takes.
    let culprits: BranchSpec[];
    const alone = await run([c.branch]);
    if (failureIn(alone, c.branch.id) !== undefined) {
      culprits = [c.branch];
    } else {
      const whole = await run(inOrder(c.document));
      if (failureIn(whole, c.branch.id) === undefined) {
        return { rule: { kind: 'unexplained', why: 'its document does not show it again', check: symptom.check, shape: symptom.shape }, pair: c.pair, symptom, evidence: '', reproducer: [c.branch], trials };
      }
      culprits = symptom.tied
        ? inOrder([
            c.branch,
            ...(await minimize(
              c.document.filter((b) => b.id !== c.branch.id),
              async (some) => failureIn(await run(inOrder([c.branch, ...some])), c.branch.id) !== undefined,
            )),
          ])
        : inOrder(await minimize(c.document, async (some) => some.length > 0 && failureIn(await run(inOrder(some)), c.branch.id) !== undefined));
    }
    const one = culprits.length === 1 ? culprits[0] : undefined;
    if (one === undefined) {
      const result = await run(culprits);
      const on = symptom.tied ? c.branch.id : '';
      const where = await scope(culprits, on);
      const rule: Rule =
        culprits.length === 2
          ? { kind: 'combo', ways: culprits.map(waysOf), ...where }
          : { kind: 'limit', branches: culprits.length, nodes: [...new Set(culprits.map((b) => b.path.at(-1)?.node ?? ''))].sort(), ...where };
      return done(rule, culprits, result, on);
    }

    // 2. The shortest chain that still fails.
    let reproducer = one;
    let result = one === c.branch ? alone : await run([one]);
    for (const chains of shorterChains(one.path)) {
      const tried = await Promise.all(chains.map(async (path) => ({ branch: branchOf(path, one), result: await run([branchOf(path, one)]) })));
      const failing = tried.find((t) => failureIn(t.result, t.branch.id) !== undefined);
      if (failing !== undefined) {
        reproducer = failing.branch;
        result = failing.result;
        break;
      }
    }
    const chain = reproducer.path;
    const leaf = chain.at(-1);
    const parent = chain.at(-2);
    if (leaf === undefined) throw new Error('explain: a branch with no steps');
    if (parent === undefined) {
      const where = await scope([reproducer], reproducer.id);
      const rule: Rule = where.pair === undefined ? { kind: 'defect', node: leaf.node, way: leaf.variant.way } : { kind: 'class', node: leaf.node, way: leaf.variant.way, pair: where.pair };
      return done(rule, [reproducer], result, reproducer.id);
    }

    // 3 and 4. The parent's other variants and members, the child's other members, the child's other variants;
    // and each node above the parent's other variants, to tell one that matters from one only there to make the place legal.
    const fails = async (steps: readonly PathStep[]): Promise<boolean | undefined> => {
      const path = rechain(steps);
      if (path === undefined) return undefined;
      const branch = branchOf(path, one);
      return failureIn(await run([branch]), branch.id) !== undefined;
    };
    const above = chain.slice(0, -2);
    const parentHv = variantOf(parent);
    const leafHv = variantOf(leaf);
    const others = (hvs: readonly HostVariant[], own: Variant) => hvs.filter((hv) => variantKey(hv.variant) !== variantKey(own)).slice(0, MOST_TRIED);
    const otherMembers = (hv: HostVariant | undefined, own: MemberValues) =>
      (hv?.members ?? []).filter((m) => canonical(m.values) !== canonical(own)).slice(0, MOST_TRIED);
    const [aboveMatters, parentVariants, parentMembers, leafMembers, fallbacks] = await Promise.all([
      Promise.all(
        above.map(async (step, i) =>
          (await Promise.all(others(variantsFor(step.node), step.variant).slice(0, 4).map((hv) => fails(chain.map((s, j) => (j === i ? { node: s.node, variant: hv.variant, member: hv.members[0]?.values ?? {} } : s)))))).some(
            (f) => f === false,
          ),
        ),
      ),
      Promise.all(others(variantsFor(parent.node), parent.variant).map(async (hv) => ({ hv, fails: await fails([...above, { node: parent.node, variant: hv.variant, member: hv.members[0]?.values ?? {} }, leaf]) }))),
      Promise.all(otherMembers(parentHv, parent.member).map(async (m) => ({ values: m.values, fails: await fails([...above, { ...parent, member: m.values }, leaf]) }))),
      Promise.all(otherMembers(leafHv, leaf.member).map(async (m) => ({ values: m.values, fails: await fails([...above, parent, { ...leaf, member: m.values }]) }))),
      Promise.all(others(variantsFor(leaf.node), leaf.variant).map(async (hv) => ({ hv, fails: await fails([...above, parent, { node: leaf.node, variant: hv.variant, member: hv.members[0]?.values ?? {} }]) }))),
    ]);
    const parentWhen = whenOf([parent.member, ...parentMembers.filter((m) => m.fails === true).map((m) => m.values)], parentMembers.filter((m) => m.fails === false).map((m) => m.values));
    const leafWhen = whenOf([leaf.member, ...leafMembers.filter((m) => m.fails === true).map((m) => m.values)], leafMembers.filter((m) => m.fails === false).map((m) => m.values));
    const fallback = fallbacks.find((f) => f.fails === false)?.hv.variant;
    const where = await scope([reproducer], reproducer.id);
    const rule: Rule = {
      kind: 'parent',
      child: { node: leaf.node, variants: [leaf.variant], ...(leafWhen === undefined ? {} : { when: leafWhen }) },
      ancestors: [
        ...above.filter((_, i) => aboveMatters[i] === true).map((s) => ({ node: s.node, variants: [s.variant] })),
        {
          node: parent.node,
          variants: [parent.variant, ...parentVariants.filter((p) => p.fails === true).map((p) => p.hv.variant)],
          ...(parentWhen === undefined ? {} : { when: parentWhen }),
        },
      ],
      scope: aboveMatters.some((m) => m) ? 'ancestor' : 'direct',
      verdict: fallback === undefined ? 'deny' : 'fallback',
      ...(fallback === undefined ? {} : { fallback }),
      passes: parentVariants.filter((p) => p.fails === false).map((p) => p.hv.variant),
      ...where,
    };
    return done(rule, [reproducer], result, reproducer.id);
  };

  /** An explanation, or, when a trial throws (the host cannot build a chain), an unexplained rule that says so and is not saved. */
  const explainOrSay = async (c: Case): Promise<Explanation> => {
    try {
      return await explain(c);
    } catch (error) {
      const why = `${FAILED}${error instanceof Error ? error.message : String(error)}`.slice(0, 300);
      return { rule: { kind: 'unexplained', why, check: c.symptom.check, shape: c.symptom.shape }, pair: c.pair, symptom: c.symptom, evidence: '', reproducer: [c.branch], trials: 0 };
    }
  };

  /** A saved explanation of the same case under the same host, engine, oracle and explainer, else a new one, saved. */
  const explainSaved = async (c: Case): Promise<Explanation & { readonly saved: boolean }> => {
    if (ctx.saved === undefined) return { ...(await explainOrSay(c)), saved: false };
    const key = `artifacts/explain/${hashJson({
      version: EXPLAIN_VERSION,
      oracle: ORACLE_VERSION,
      fingerprint: ctx.saved.fingerprint,
      reference: ctx.reference,
      branch: c.branch.id,
      document: c.document.map((b) => b.id),
      pair: c.pair,
      symptom: c.symptom,
    })}`;
    const hit = ctx.saved.store.get(key) as unknown as Explanation | undefined;
    if (hit !== undefined) return { ...hit, saved: true };
    const made = await explainOrSay(c);
    if (made.rule.kind !== 'unexplained' || !made.rule.why.startsWith(FAILED)) ctx.saved.store.put(key, made as unknown as Json);
    return { ...made, saved: false };
  };

  return { explain: explainSaved };
};

// ---- What to explain ----

/** A class setting and setup's verdicts, as the matrix gave them. */
export type PairRun = { readonly pair: Pair; readonly verdicts: ReadonlyMap<BranchId, Verdict> };

/** Failures that one case stands for, and how many branch verdicts show them. */
export type Group = { readonly key: string; readonly origin: Origin; readonly case: Case; readonly count: number };

/**
 * Branch verdicts that fail because a way fails alone, by pair, node, way and
 * whether the reference shows the failure too (`fromWays`): those are the
 * way's defect, the rest the class's.
 */
export type FromWays = ReadonlyMap<string, number>;
const fromWaysKey = (kind: 'defect' | 'class', pair: string, node: NodeId, way: WayId): string => canonical([kind, pair, node, way]);

/** How many branch verdicts a rule from the solo branches stands for: a defect's under every pair, a class rule's under its own. */
export const countOf = (fromWays: FromWays, rule: Rule): number => {
  if (rule.kind === 'class') return fromWays.get(fromWaysKey('class', rule.pair, rule.node, rule.way)) ?? 0;
  if (rule.kind !== 'defect') return 0;
  let n = 0;
  for (const [key, count] of fromWays) {
    const [kind, , node, way] = JSON.parse(key) as [string, string, string, string];
    if (kind === 'defect' && node === rule.node && way === rule.way) n += count;
  }
  return n;
};

/**
 * The failures to explain, biggest group first. A failure from the way alone
 * (its origin is `way`, or `class` with a solo branch failing it too) is left
 * to `soloExplanations`. One that is not new under the class (`nesting`,
 * `document`) is explained under the reference only, where the branch shows
 * it too. `fromWays` counts the branch verdicts left to the solo branches.
 */
export const groupFailures = (input: {
  readonly runs: readonly PairRun[];
  readonly branches: ReadonlyMap<BranchId, BranchSpec>;
  /** The branches of the document a branch was filed in, in order. */
  readonly documentOf: (branch: BranchId) => readonly BranchSpec[] | undefined;
  readonly solo: (pair: Pair) => SoloFailures;
  readonly reference: Pair;
}): { readonly groups: Group[]; readonly fromWays: FromWays } => {
  const reference = input.runs.find((r) => pairName(r.pair) === pairName(input.reference));
  const groups = new Map<string, { origin: Origin; case: Case; seen: Set<string> }>();
  const fromWays = new Map<string, Set<BranchId>>();
  for (const run of input.runs) {
    const atReference = run === reference;
    for (const verdict of run.verdicts.values()) {
      if (verdict.pass) continue;
      const branch = input.branches.get(verdict.branch);
      const document = input.documentOf(verdict.branch);
      if (branch === undefined || document === undefined) continue;
      const attribution = attribute(branch, verdict, input.solo(run.pair), atReference ? undefined : reference?.verdicts.get(verdict.branch));
      for (const check of attribution.checks) {
        if (check.origin === 'way' || (check.origin === 'class' && check.node !== undefined)) {
          const step = branch.path.find((s) => s.node === check.node);
          if (step === undefined) continue;
          const key = fromWaysKey(check.origin === 'way' ? 'defect' : 'class', pairName(run.pair), step.node, step.variant.way);
          fromWays.set(key, (fromWays.get(key) ?? new Set()).add(branch.id));
          continue;
        }
        if (check.origin !== 'class' && !atReference) continue;
        for (const failure of verdict.failures) {
          if (checkOf(failure) !== check.check) continue;
          const symptom = symptomOf(failure);
          const place = symptom.tied ? { nodes: branch.path.map((s) => s.node), leaf: branch.path.at(-1)?.variant.way ?? '' } : null;
          const key = canonical({ pair: run.pair, check: symptom.check, shape: symptom.shape, tied: symptom.tied, place });
          let group = groups.get(key);
          if (group === undefined) {
            group = { origin: check.origin, case: { branch, document, pair: run.pair, symptom }, seen: new Set() };
            groups.set(key, group);
          }
          group.seen.add(`${pairName(run.pair)} ${branch.id}`);
        }
      }
    }
  }
  return {
    groups: [...groups]
      .map(([key, g]) => ({ key, origin: g.origin, case: g.case, count: g.seen.size }))
      .sort((a, b) => b.count - a.count || (a.key < b.key ? -1 : a.key > b.key ? 1 : 0)),
    fromWays: new Map([...fromWays].map(([key, branches]) => [key, branches.size])),
  };
};

/** A solo branch's verdict under one pair. */
export type SoloVerdict = { readonly pair: Pair; readonly branch: BranchSpec; readonly verdict: Verdict };

/**
 * What the solo branches show, as explanations with no trial: each solo
 * branch is its own reproducer. A failure is its leaf's way's, unless the solo
 * branch of a node above it fails the same: then it is that one's. It is a
 * defect when the reference shows it too, else a class rule.
 */
export const soloExplanations = (solos: readonly SoloVerdict[], reference: Pair): Explanation[] => {
  // The reference's first, so a defect is shown as the reference shows it.
  solos = [...solos].sort((a, b) => Number(pairName(a.pair) !== pairName(reference)) - Number(pairName(b.pair) !== pairName(reference)));
  const at = new Map<string, Verdict>();
  for (const s of solos) {
    const leaf = s.branch.path.at(-1);
    if (leaf !== undefined) at.set(canonical([pairName(s.pair), soloKey(leaf.node, leaf.variant, s.branch.marked ?? false)]), s.verdict);
  }
  const shows = (pair: Pair, step: PathStep, marked: boolean, symptom: Symptom): boolean =>
    (at.get(canonical([pairName(pair), soloKey(step.node, step.variant, marked)]))?.failures ?? []).some((f) => matches(f, symptom));
  const out: Explanation[] = [];
  for (const s of solos) {
    const leaf = s.branch.path.at(-1);
    if (s.verdict.pass || leaf === undefined) continue;
    const marked = s.branch.marked ?? false;
    const symptoms = new Map(s.verdict.failures.map((f) => [canonical(symptomOf(f)), { symptom: symptomOf(f), evidence: f.evidence }]));
    for (const { symptom, evidence } of symptoms.values()) {
      if (s.branch.path.slice(0, -1).some((step) => shows(s.pair, step, marked, symptom))) continue;
      const own = pairName(s.pair) === pairName(reference) || shows(reference, leaf, marked, symptom);
      const rule: Rule = own ? { kind: 'defect', node: leaf.node, way: leaf.variant.way } : { kind: 'class', node: leaf.node, way: leaf.variant.way, pair: pairName(s.pair) };
      out.push({ rule, pair: s.pair, symptom, evidence, reproducer: [s.branch], trials: 0 });
    }
  }
  return out;
};

// ---- The review queue ----

/** A candidate rule with each failure it explains: what a person reviews. */
export type Candidate = {
  readonly id: string;
  readonly rule: Rule;
  /** Branch verdicts it explains, in all. */
  readonly count: number;
  readonly seen: readonly (Omit<Explanation, 'rule' | 'trials'> & { readonly count: number })[];
};

export const candidateId = (rule: Rule): string => `r${hashJson(rule).slice(0, 20)}`;

/** Explanations of one rule as one candidate, the most explained first. `count` is how many branch verdicts each stands for. */
export const candidatesOf = (explained: readonly { readonly explanation: Explanation; readonly count: number }[]): Candidate[] => {
  const byRule = new Map<string, { rule: Rule; seen: Candidate['seen'][number][] }>();
  for (const { explanation, count } of explained) {
    const { rule, trials: _trials, ...seen } = explanation;
    const id = candidateId(rule);
    const entry = byRule.get(id) ?? { rule, seen: [] };
    entry.seen.push({ ...seen, count });
    byRule.set(id, entry);
  }
  return [...byRule]
    .map(([id, { rule, seen }]) => ({ id, rule, count: seen.reduce((n, s) => n + s.count, 0), seen: seen.sort((a, b) => b.count - a.count) }))
    .sort((a, b) => b.count - a.count || (a.id < b.id ? -1 : 1));
};

export const REVIEW = 'review';
export const reviewAt = (id: string): string => `review/${id}`;
const LATEST = 'latest/explain';

/** A person's decision on a candidate, appended to the `review` log. */
export type Decision = { readonly candidate: string; readonly decision: 'accept' | 'reject'; readonly why?: string; readonly at: string };

/** Puts each candidate in the queue (`review/<id>`) and names them as the latest explanation's. A decision already made stays. */
export const queueCandidates = (store: Store, candidates: readonly Candidate[], at: string): void => {
  for (const c of candidates) store.put(reviewAt(c.id), c as unknown as Json);
  store.put(LATEST, { at, candidates: candidates.map((c) => c.id) });
};

/** The latest explanation's candidates, each with its latest decision. */
export const reviewQueue = (store: Store): { readonly at?: string; readonly candidates: readonly (Candidate & { readonly decision?: Decision })[] } => {
  const latest = store.get(LATEST) as { at: string; candidates: string[] } | undefined;
  const decisions = new Map<string, Decision>();
  for (const line of store.read(REVIEW)) {
    const d = line as unknown as Decision;
    if (typeof d?.candidate === 'string') decisions.set(d.candidate, d);
  }
  const candidates = (latest?.candidates ?? []).flatMap((id) => {
    const c = store.get(reviewAt(id)) as unknown as Candidate | undefined;
    if (c === undefined) return [];
    const decision = decisions.get(id);
    return [decision === undefined ? c : { ...c, decision }];
  });
  return latest === undefined ? { candidates } : { at: latest.at, candidates };
};

export const decide = (store: Store, decision: Decision): void => {
  if (store.get(reviewAt(decision.candidate)) === undefined) throw new Error(`review: no candidate ${decision.candidate}`);
  store.append(REVIEW, decision as unknown as Json);
};
