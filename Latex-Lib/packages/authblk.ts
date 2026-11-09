import { definePackage } from '../schema/class.ts';
import { ctan } from '../schema/minimal.ts';

/**
 * authblk: \author[n]{…} and \affil[n]{…}, the affiliations set in blocks under the authors by \maketitle (front.authblk).
 * ascelike loads it itself (its log loads authblk.sty 2001/02/27 1.3). \usepackage[max6]{authblk} typeset under article
 * (ZeroTeX-NG, 2026-11-07); a research template loads it so (Source/0653-gerhardt-academic-paper/main.tex l.46).
 */
export default definePackage({
  id: "authblk",
  description: "authblk: \\author[n]{…} and \\affil[n]{…}, affiliations set in blocks under the authors by \\maketitle.",
  options: {
    "max2": "affiliations in blocks for up to two authors",
    "max3": "affiliations in blocks for up to three authors",
    "max4": "affiliations in blocks for up to four authors",
    "max5": "affiliations in blocks for up to five authors",
    "max6": "affiliations in blocks for up to six authors",
    "noblocks": "affiliations as footnote-style lines, never in blocks",
    "auth-sc": "authors in small caps",
    "auth-sc-lg": "authors in large small caps",
    "auth-lg": "authors large",
    "affil-sl": "affiliations slanted",
    "affil-it": "affiliations italic",
  },
  exclusive: [["max2", "max3", "max4", "max5", "max6", "noblocks"]],
  loadOrder: [],
  defines: ["cmd:\\affil"],
  targetEngine: 'yes',
  evidence: [ctan("authblk"), { kind: 'source', file: 'Latex Related Research/Latex-lib-main/Source/0653-gerhardt-academic-paper/main.tex', line: '46' }],
});
