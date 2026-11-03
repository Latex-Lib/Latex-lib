/**
 * The compat tables (ARCHITECTURE.md section 5, stage 8; ../ARCHITECTURE.md
 * 4.4), one per way, for `Library.writeCompat`. Each says, for every parent
 * the way sat directly under (or the top of the document), how many branches
 * of the plan holding that step passed under each class setting and setup,
 * and which rules a person accepted for the way. A candidate still waiting
 * for review is named, not written in as a rule: nothing enters a key without
 * a person's review. Recording never compiles anything.
 */
import type { Candidate, Decision, PairRun, Rule } from './explain.ts';
import { pairName } from './explain.ts';
import type { BranchSpec, CompatTable, Json, NodeId, WayId } from './model.ts';

export type CompatEntry =
  | {
      readonly kind: 'verified';
      /** The node and way directly above; null at the top of the document. */
      readonly parent: { readonly node: NodeId; readonly way: WayId } | null;
      readonly pair: string;
      readonly branches: number;
      readonly pass: number;
      readonly status: 'verified-ok' | 'failing';
    }
  | { readonly kind: 'rule'; readonly candidate: string; readonly rule: Rule; readonly why?: string }
  | { readonly kind: 'pending'; readonly candidates: readonly string[] };

/** The ways a rule speaks of. */
export const waysIn = (rule: Rule): WayId[] => {
  switch (rule.kind) {
    case 'defect':
    case 'class':
      return [rule.way];
    case 'parent':
      return [...new Set([...rule.child.variants, ...rule.ancestors.flatMap((a) => a.variants)].map((v) => v.way))];
    case 'combo':
      return [...new Set(rule.ways.flat())];
    default:
      return [];
  }
};

export const compatTables = (input: {
  readonly ways: readonly WayId[];
  readonly branches: readonly BranchSpec[];
  readonly runs: readonly PairRun[];
  readonly candidates: readonly (Candidate & { readonly decision?: Decision })[];
  /** The keys of what the tables were made from. */
  readonly from: { readonly [input: string]: string };
}): CompatTable[] => {
  const verified = new Map<string, { way: WayId; parent: { node: NodeId; way: WayId } | null; pair: string; branches: number; pass: number }>();
  for (const run of input.runs) {
    const pair = pairName(run.pair);
    for (const branch of input.branches) {
      const verdict = run.verdicts.get(branch.id);
      if (verdict === undefined) continue;
      branch.path.forEach((step, i) => {
        const above = branch.path[i - 1];
        const parent = above === undefined ? null : { node: above.node, way: above.variant.way };
        const key = JSON.stringify([step.variant.way, parent, pair]);
        const entry = verified.get(key) ?? { way: step.variant.way, parent, pair, branches: 0, pass: 0 };
        entry.branches++;
        if (verdict.pass) entry.pass++;
        verified.set(key, entry);
      });
    }
  }
  return input.ways.map((way): CompatTable => {
    const entries: CompatEntry[] = [...verified.values()]
      .filter((e) => e.way === way)
      .map(({ parent, pair, branches, pass }) => ({ kind: 'verified', parent, pair, branches, pass, status: pass === branches ? 'verified-ok' : 'failing' }));
    const touching = input.candidates.filter((c) => waysIn(c.rule).includes(way));
    for (const c of touching) {
      if (c.decision?.decision === 'accept') entries.push({ kind: 'rule', candidate: c.id, rule: c.rule, ...(c.decision.why === undefined ? {} : { why: c.decision.why }) });
    }
    const pending = touching.filter((c) => c.decision === undefined).map((c) => c.id);
    if (pending.length > 0) entries.push({ kind: 'pending', candidates: pending });
    return { way, from: input.from, entries: entries as unknown as readonly Json[] };
  });
};
