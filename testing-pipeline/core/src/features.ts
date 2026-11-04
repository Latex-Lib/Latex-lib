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
  /** Every branch's sentinels in the cell, this one's too: what a probe may read of the page around it (the footnote probe's split notes). */
  readonly cell?: readonly (readonly SentinelSpec[])[];
};

/** A probe gives a failure's evidence, or nothing when the feature did its job. */
export type FeatureProbe = (context: FeatureContext) => string | undefined;

const withRole = (context: FeatureContext, role: string) =>
  context.placed.filter((s) => s.role === role).map((spec) => ({ spec, hit: context.hits.get(spec.id)?.[0] }));

/**
 * The pages a footnote was split across: a note of the cell whose text started on page p (`footnote:text`) and ended on a
 * later page (`footnote:end`, the host's end sentinel where the text has a start sentinel) was split on p and on every page
 * up to the one before its end. TeX takes no more insertions of a class on a page once one of them was split there (tex.web
 * §1008: an insertion arriving while its class is `split_up` only adds to `insert_penalties`, and `fire_up` holds it over),
 * so every later footnote of that page starts on the next one, whole. An end sentinel in a note column's text (`nextRun`,
 * scrlayer-notecolumn) shows no split: the column sets its notes on the first page with room, not where the footnote's
 * text stood (b25 REGRESS-FNSPLIT: r3 aastex.A db1903b6bf4d7c46bf2e7 passed note 1, mark on page 1 and text on page 2,
 * because a footnote whose body ends in such a note printed it on page 2; r4 printed it on page 1, the TeX output
 * otherwise the same, and failed note 1).
 */
const splitPages = (context: FeatureContext): ReadonlySet<number> => {
  const pages = new Set<number>();
  for (const sentinels of context.cell ?? []) {
    const start = sentinels.find((s) => s.role === 'footnote:text');
    const end = sentinels.find((s) => s.role === 'footnote:end' && s.nextRun !== true);
    const from = start === undefined ? undefined : context.hits.get(start.id)?.[0]?.page;
    const to = end === undefined ? undefined : context.hits.get(end.id)?.[0]?.page;
    if (from !== undefined && to !== undefined) for (let page = from; page < to; page++) pages.add(page);
  }
  return pages;
};

export const FEATURE_PROBES: Readonly<Record<string, FeatureProbe>> = {
  /** A breakable box with more than a page of content must break: its first and last sentinels land on different pages. */
  breakable: (context) => {
    const start = withRole(context, 'breakable:start')[0];
    const end = withRole(context, 'breakable:end').at(-1);
    if (start === undefined || end === undefined) return 'needs sentinels with roles breakable:start and breakable:end';
    if (start.hit === undefined || end.hit === undefined) return undefined;
    return start.hit.page === end.hit.page ? `start and end both shipped on page ${start.hit.page}: the box never broke` : undefined;
  },

  /**
   * A footnote's text starts on the page of its mark: the n-th `footnote:text` with the n-th `footnote:mark`. Or on a later
   * page that TeX held it over to: every page from the mark's to the one before the text's holds another note split across
   * it (`splitPages`, b23 PG-2). Most late notes of run r2-461ed0e were split after the mark's line, which the host's start
   * sentinel now shows (PG-1; GitHub probe b23-1: none of the late notes of its three footnote documents was held over).
   * Held-over notes are the rarer case: in that run's logs, 367 late notes were marked after another late note on the same
   * page, 341 of them under aastex, whose notes come one to eight pages late with no note split (not TeX's hold-over), so
   * this passes a few dozen at most. A note a box's saved notes release pages late, or one lost, still fails: no split note
   * fills the pages in between (a lost one is `sentinel:missing`).
   */
  footnote: (context) => {
    const marks = withRole(context, 'footnote:mark');
    const texts = withRole(context, 'footnote:text');
    if (marks.length === 0 || marks.length !== texts.length) return 'needs as many footnote:mark sentinels as footnote:text ones';
    let split: ReadonlySet<number> | undefined;
    const heldOver = (from: number, to: number): boolean => {
      split ??= splitPages(context);
      for (let page = from; page < to; page++) if (!split.has(page)) return false;
      return true;
    };
    const apart = marks.flatMap((mark, i) => {
      const text = texts[i];
      if (mark.hit === undefined || text?.hit === undefined) return [];
      if (mark.hit.page === text.hit.page || (text.hit.page > mark.hit.page && heldOver(mark.hit.page, text.hit.page))) return [];
      return [`note ${i + 1}: mark on page ${mark.hit.page}, text on page ${text.hit.page}`];
    });
    return apart.length > 0 ? apart.join('; ') : undefined;
  },
};
