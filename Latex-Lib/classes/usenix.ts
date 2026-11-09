import { defineClass } from '../schema/class.ts';

/**
 * USENIX's style (class setting usenix): article with letterpaper, twocolumn and 10pt and `\usepackage{usenix2019_v3}` (the
 * 2018-12-19 revision for ATC'19 that usenix.org's paper-templates page links), between the setting's two lines that stand in
 * for breakurl (it stops under XeTeX when loaded before hyperref, breakurl.sty l.55-61). Not measured by the class probe: every
 * field is read from the pinned usenix2019_v3.sty (b2p, batch 2).
 * Preloads in load order (l.22-38): mathptmx, fontenc with T1, inputenc with utf8 (ignored under XeTeX), pslatex, microtype with
 * kerning and spacing (pdfTeX features: warnings under XeTeX), flushend, cite (no option: bib.cite-pkg's nosort and super presets
 * meet "Option clash"), url, xcolor (tbl.colortbl's xcolor[table] clashes) and hyperref, set to coloured links (l.39-44).
 * breakurl is not listed: the setting marks it loaded without loading it, so a way's \usepackage{breakurl} would load nothing.
 * Without twocolumn the style inputs twocolumn.sty, which does not exist (l.21); the setting gives twocolumn, so setup A only.
 * Text block 7.00in by 9.0in (l.51-53). It redefines \maketitle (l.77-90), abstract (l.114-117, by \def) and \section.
 */
export default defineClass({
  id: 'class.usenix',
  name: "article",
  base: 'class.article',
  targetEngine: "untested",
  preloads: [{"pkg": "mathptmx"}, {"pkg": "fontenc", "options": ["T1"]}, {"pkg": "inputenc", "options": ["utf8"]}, {"pkg": "pslatex"}, {"pkg": "microtype", "options": ["kerning", "spacing"]}, {"pkg": "flushend"}, {"pkg": "cite"}, {"pkg": "url"}, {"pkg": "xcolor"}, {"pkg": "hyperref"}],
  defines: ["counter:part", "counter:section", "counter:subsection", "counter:subsubsection", "counter:paragraph", "counter:subparagraph", "env:abstract", "env:figure", "env:table", "env:thebibliography", "cmd:\\maketitle", "cmd:\\tableofcontents", "cmd:\\appendix"],
  options: {},
  forbids: {
    technical: [
      { pkg: "biblatex", reason: "usenix2019_v3.sty loads cite (l.34) and biblatex stops at 'Incompatible package \'cite\'' when cite is loaded; biblatex's package facts name only natbib, so the class must refuse it (General's biblatex bibliography included) (b2p probe G5-usenix-*, verify-V2)", evidence: [{ kind: 'source', file: 'testing-pipeline/settings/classes/files/usenix2019_v3.sty (2018-12-19)', line: '34' }] },
    ],
    policy: [],
  },
  layout: { columns: 2, textwidth: "505.88998pt", fontsize: "10pt" },
  vocabulary: {},
  evidence: [
    { kind: 'source', file: 'testing-pipeline/settings/classes/files/usenix2019_v3.sty (2018-12-19)', line: '21 (twocolumn.sty without twocolumn), 22-38 (mathptmx, fontenc T1, inputenc utf8, pslatex, microtype kerning spacing, flushend, cite, breakurl, url, xcolor, hyperref), 39-44 (\\hypersetup colorlinks)' },
    { kind: 'source', file: 'testing-pipeline/settings/classes/files/usenix2019_v3.sty (2018-12-19)', line: '51-53 (\\textheight 9.0in, \\columnsep 0.33in, \\textwidth 7.00in), 77-90 (\\maketitle), 114-117 (abstract), 122 (\\section)' },
  ],
});
