/**
 * Feature probes (ARCHITECTURE.md 4.6, the oracle's fourth check): whether a
 * feature still does its job where the branch put it. A probe reads the
 * sentinels the host placed with its roles. A sentinel that never shipped is
 * the sentinel check's to report, so a probe says nothing about it.
 *
 * Adding a probe: an entry here, and a raised `ORACLE_VERSION` (oracle.ts), so
 * saved results are judged again without compiling anything.
 */
import type { SentinelSpec } from './model.ts';
import type { SentinelHit } from './sentinels.ts';

export type FeatureContext = {
  readonly placed: readonly SentinelSpec[];
  readonly hits: ReadonlyMap<string, readonly SentinelHit[]>;
};

/** A probe gives a failure's evidence, or nothing when the feature did its job. */
export type FeatureProbe = (context: FeatureContext) => string | undefined;

const withRole = (context: FeatureContext, role: string) =>
  context.placed.filter((s) => s.role === role).map((spec) => ({ spec, hit: context.hits.get(spec.id)?.[0] }));

export const FEATURE_PROBES: Readonly<Record<string, FeatureProbe>> = {
  /** A breakable box with more than a page of content must break: its first and last sentinels land on different pages. */
  breakable: (context) => {
    const start = withRole(context, 'breakable:start')[0];
    const end = withRole(context, 'breakable:end').at(-1);
    if (start === undefined || end === undefined) return 'needs sentinels with roles breakable:start and breakable:end';
    if (start.hit === undefined || end.hit === undefined) return undefined;
    return start.hit.page === end.hit.page ? `start and end both shipped on page ${start.hit.page}: the box never broke` : undefined;
  },

  /** A footnote's text ships on the page of its mark: the n-th `footnote:text` with the n-th `footnote:mark`. */
  footnote: (context) => {
    const marks = withRole(context, 'footnote:mark');
    const texts = withRole(context, 'footnote:text');
    if (marks.length === 0 || marks.length !== texts.length) return 'needs as many footnote:mark sentinels as footnote:text ones';
    const apart = marks.flatMap((mark, i) => {
      const text = texts[i];
      if (mark.hit === undefined || text?.hit === undefined) return [];
      return mark.hit.page === text.hit.page ? [] : [`note ${i + 1}: mark on page ${mark.hit.page}, text on page ${text.hit.page}`];
    });
    return apart.length > 0 ? apart.join('; ') : undefined;
  },
};
