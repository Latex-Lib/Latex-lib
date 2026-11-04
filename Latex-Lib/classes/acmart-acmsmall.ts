import { defineClass } from '../schema/class.ts';
import acmart from './acmart.ts';

/**
 * acmart in its acmsmall journal format (the acmart-acmsmall setting, batch 2):
 * the same acmart.cls (2026/08/16 v2.20) as class.acmart, read from the class
 * source, not yet measured by the class probe. acmsmall loads what manuscript
 * loads: the format switch changes only the font size (10pt, l.267-268), the
 * page (\geometry, l.629-635) and, at the end of the preamble, nothing (no
 * pbalance or balance under acmsmall, l.3478-3526); amsart, natbib, hyperref,
 * xcolor, graphicx, geometry, caption, float, booktabs and the fonts are
 * loaded in every format (l.290-308, 530, 595-596, 624, 786-805, 878).
 *
 * It is class.acmart with its own layout: everything the host and filing read
 * is taken from that profile, since both are named acmart. The host finds a
 * class's facts by that name (latexLibClasses keeps the last profile read,
 * class.acmart: 'acmart-acmsmall.ts' sorts before 'acmart.ts'), and a way
 * unfit for either profile is unfit for every acmart setting (factsOf's
 * `unfit` lists names). A rule found under acmsmall alone belongs in
 * class.acmart. `base` keeps class.acmart's key rules (titlesec, enumitem,
 * the theorem ways' denies, the class-native ways' `only`) on this profile.
 */
export default defineClass({
  ...acmart,
  id: 'class.acmart-acmsmall',
  name: "acmart",
  base: 'class.acmart',
  // acmsmall: paperwidth 6.75in with inner and outer margins of 46pt (l.629-635), so \textwidth = 487.8225pt - 92pt = 395.8225pt;
  // one column, 10pt (l.267-268). To be confirmed by the class probe or the first run's log.
  layout: { columns: 1, textwidth: "395.8225pt", fontsize: "10pt" },
  evidence: [
    { kind: 'source', file: 'acmart.cls (MiKTeX package acmart, 2026/08/16 v2.20)', line: '267-268' },
    { kind: 'source', file: 'acmart.cls (MiKTeX package acmart, 2026/08/16 v2.20)', line: '624, 629-635' },
    { kind: 'source', file: 'acmart.cls (MiKTeX package acmart, 2026/08/16 v2.20)', line: '3478-3526' },
    { kind: 'source', file: 'testing-pipeline/settings/classes/acmart-acmsmall.json', line: '1' },
    ...acmart.evidence,
  ],
});
