import { defineClass } from '../schema/class.ts';

/**
 * NeurIPS 2026: plain article with neurips_2026.sty (2026-01-29), loaded by the neurips setting as
 * \usepackage[preprint]{neurips_2026}. Not measured by the class probe (batch 2, b2p): every field is read from the pinned
 * style file, testing-pipeline/settings/classes/files/neurips_2026.sty (sha256 c3fc2894...), whose line numbers are cited.
 * - Preloads: environ (l.110), natbib with no options (l.119-121; the nonatbib option, which the setting does not give,
 *   leaves it out), geometry with verbose=true,letterpaper (l.128). natbib makes biblatex and apacite refused through their
 *   package facts (biblatex: "Incompatible package 'natbib'"), and makes every natbib way that gives an option (numbers,
 *   square, sort&compress, ...) an option clash. geometry's options do the same for a way that loads geometry with others.
 *   lineno (l.411) is loaded only in submission mode (neither preprint nor final, l.390-411), so it is not a preload here.
 * - Page: \newgeometry at \begin{document} (l.129-141) sets a 5.5in x 9in block on US letter whatever the document set;
 *   \normalsize is 10pt (l.150-156). One column.
 * - Names: \section..\subparagraph are redefined with \@startsection (l.186-220), article's counters stay; abstract, table
 *   and \maketitle are redefined (l.369, l.238, l.291); `ack` is a new environment (\NewEnviron, l.112), with \acksection,
 *   \answerYes/\answerNo/\answerNA/\answerTODO/\justificationTODO (l.384-388) and \workshoptitle (l.82).
 * - XeTeX: \rmdefault ptm and \sfdefault phv (l.101-102) have no TU shapes, so the text falls back to Latin Modern with
 *   font warnings, no error.
 * Its name is "article", the setting's class, as latexLib's check requires; base class.article, so a key's article rule holds.
 */
export default defineClass({
  id: 'class.neurips',
  name: "article",
  base: 'class.article',
  zerotex: "untested",
  preloads: [{"pkg": "environ"}, {"pkg": "natbib"}, {"pkg": "geometry", "options": ["verbose=true", "letterpaper"]}],
  defines: ["counter:part", "counter:section", "counter:subsection", "counter:subsubsection", "counter:paragraph", "counter:subparagraph", "env:abstract", "env:figure", "env:table", "env:thebibliography", "env:ack", "cmd:\\maketitle", "cmd:\\tableofcontents", "cmd:\\appendix", "cmd:\\acksection", "cmd:\\answerYes", "cmd:\\answerNo", "cmd:\\answerNA", "cmd:\\answerTODO", "cmd:\\justificationTODO", "cmd:\\workshoptitle", "cmd:\\subsubsubsection"],
  options: {},
  forbids: {
    technical: [],
    policy: [],
  },
  layout: { columns: 1, textwidth: "397.48499pt", fontsize: "10pt" },
  vocabulary: {"\\workshoptitle": "the workshop's title (workshop options only)"},
  evidence: [
    { kind: 'source', file: 'testing-pipeline/settings/classes/files/neurips_2026.sty', line: '110-121 (environ; natbib unless nonatbib)' },
    { kind: 'source', file: 'testing-pipeline/settings/classes/files/neurips_2026.sty', line: '128-141 (geometry [verbose=true,letterpaper]; \\newgeometry 5.5in x 9in at \\begin{document})' },
    { kind: 'source', file: 'testing-pipeline/settings/classes/files/neurips_2026.sty', line: '101-102, 150-220, 238, 291, 369 (fonts, sizes, headings, table, \\maketitle, abstract)' },
    { kind: 'source', file: 'testing-pipeline/settings/classes/files/neurips_2026.sty', line: '390-412 (lineno only in submission mode)' },
  ],
});
