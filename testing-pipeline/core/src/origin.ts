/**
 * Where a failure comes from (ARCHITECTURE.md section 10, step 5). Each check
 * a branch fails under a class setting and setup is said to come from:
 *
 * - `class`: the branch does not fail it under the reference (article with
 *   setup A). It is new under this class setting or setup. When the solo
 *   branch of one of its steps fails it here too, the class breaks that way
 *   wherever it sits, and the check names the node.
 * - `way`: the branch fails it under the reference too, and the solo branch of
 *   one of its steps (`plan.ts`) fails it as well: the way fails on its
 *   own, wherever it sits. A defect of the way, counted once per way and not
 *   against every place it is tested in.
 * - `document`: the log could not tie it to the branch (a `:document`
 *   failure: a preamble line no branch put there, labels that changed, a page
 *   that overflowed with no sentinel shipped on it, a fatal stop). Any branch
 *   of the document may have caused it, until the explainer separates them
 *   (step 6).
 * - `nesting`: none of these. The branch fails it where it sits, and its ways
 *   alone do not.
 *
 * A check is a failure's `check` without the `:document` suffix. A branch's
 * origin is its worst check's: nesting, class, document, then way.
 */
import type { BranchSpec, Failure, Verdict } from './model.ts';
import { markedOf, soloKey } from './plan.ts';

export type Origin = 'way' | 'class' | 'document' | 'nesting';

/** A failure's check, whether or not the log could tie it to the branch. */
export const checkOf = (failure: Failure): string => failure.check.replace(/:document$/, '');

/** The checks each solo branch fails under one class setting and setup, by `soloKey`. */
export type SoloFailures = ReadonlyMap<string, ReadonlySet<string>>;

export type Attribution = {
  readonly origin: Origin;
  /** Each check the branch fails, with where it comes from; one a solo branch fails too names that branch's node. */
  readonly checks: readonly { readonly check: string; readonly origin: Origin; readonly node?: string }[];
};

const WORST: readonly Origin[] = ['nesting', 'class', 'document', 'way'];

/** Where a failing verdict's checks come from. `reference` is the same branch's verdict under the reference, when this is not the reference. */
export const attribute = (branch: BranchSpec, verdict: Verdict, solo: SoloFailures, reference?: Verdict): Attribution => {
  const marked = branch.marked ?? markedOf(branch.id);
  const referenceChecks = reference === undefined ? undefined : new Set(reference.failures.map(checkOf));
  const checks = [...new Set(verdict.failures.map(checkOf))].map((check) => {
    const step = branch.path.find((s) => solo.get(soloKey(s.node, s.variant, marked))?.has(check));
    const named = step === undefined ? {} : { node: step.node };
    if (referenceChecks !== undefined && !referenceChecks.has(check)) return { check, origin: 'class' as const, ...named };
    if (step !== undefined) return { check, origin: 'way' as const, ...named };
    if (verdict.failures.every((f) => checkOf(f) !== check || f.check.endsWith(':document'))) return { check, origin: 'document' as const };
    return { check, origin: 'nesting' as const };
  });
  const origin = WORST.find((o) => checks.some((c) => c.origin === o)) ?? 'way';
  return { origin, checks };
};
