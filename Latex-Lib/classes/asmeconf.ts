import { defineClass } from '../schema/class.ts';

/**
 * asmeconf v1.46 (2026/01/10, John Lienhard, CTAN/MiKTeX), ASME's conference paper format. Not measured by the class probe
 * (batch 2, b2p): every field is read from the class source of the same date, Latex Related Research/Latex-lib-main/Source/
 * 0909-asmeconf/asmeconf.cls (\versiondate 2026/01/10, l.9), under the asmeconf setting (no options, XeTeX).
 * - Base: \LoadClass[twoside,10pt]{article} (l.69); two columns begin in \maketitle (\twocolumn[...], l.2150-2163).
 * - Preloads, in load order: etoolbox (l.72); geometry [letterpaper, left=0.5in, right=0.5in, top=0.5in, bottom=1.in,
 *   footskip=0.5in, columnsep=0.38in] (l.508); graphicx (l.512); xcolor [dvipsnames,svgnames,x11names] (l.513); natbib
 *   [sort&compress,numbers] (l.515); booktabs, array, dcolumn (l.521-524); caption, subcaption (l.536-537); mathtools, which
 *   loads amsmath with no options (l.642); babel (l.650); on XeTeX, with fontspec on by default, unicode-math (which loads
 *   fontspec, l.658); fancyhdr (l.1255); hyperref [psdextra] (l.1449); doi (l.1467). textcase (l.107-108) loads only on
 *   kernels before 2022-06 and footmisc (l.1295-1309) only on kernels before 2025-06, so neither is listed; lineno (l.1543)
 *   and flushend (l.1570) need the lineno and balance options, which the setting does not give.
 *   So: natbib ways with options other than numbers or sort&compress (round, square, authoryear, super, ...) clash;
 *   biblatex and apacite are refused by their facts against natbib; xcolor[table] (tbl.colortbl) clashes with xcolor's
 *   options; amsmath or mathtools with fleqn/leqno (math.amsmath@flush-left) clash with the options-free amsmath/mathtools.
 * - Page: 8.5in letter less 0.5in side margins: \textwidth 7.5in (542.025pt), \columnsep 0.38in, 10pt.
 * - Names: abstract (+b body, with \keywords, l.1626) and abstract* (l.1636), nomenclature (l.1664), \section re-made as an
 *   xparse wrapper around article's (l.1331-1366), \subsection/\subsubsection redefined (l.1337-1345), \paragraph \let to
 *   \subsubsection (l.1349: a paragraph heading is a numbered subsubsection, no error), \appendix (l.1410), \maketitle,
 *   \title, \thanks (does nothing) and \date (a footnote) re-made (l.2179-2195); article's counters all stay.
 * - It has no theorem environments.
 */
export default defineClass({
  id: 'class.asmeconf',
  name: "asmeconf",
  base: 'class.article',
  targetEngine: "untested",
  preloads: [
    {"pkg": "etoolbox"},
    {"pkg": "geometry", "options": ["letterpaper", "left=0.5in", "right=0.5in", "top=0.5in", "bottom=1.in", "footskip=0.5in", "columnsep=0.38in"]},
    {"pkg": "graphicx"},
    {"pkg": "xcolor", "options": ["dvipsnames", "svgnames", "x11names"]},
    {"pkg": "natbib", "options": ["sort&compress", "numbers"]},
    {"pkg": "booktabs"}, {"pkg": "array"}, {"pkg": "dcolumn"},
    {"pkg": "caption"}, {"pkg": "subcaption"},
    {"pkg": "amsmath"}, {"pkg": "mathtools"},
    {"pkg": "babel"},
    {"pkg": "fontspec"}, {"pkg": "unicode-math"},
    {"pkg": "fancyhdr"},
    {"pkg": "hyperref", "options": ["psdextra"]},
    {"pkg": "doi"},
  ],
  defines: ["counter:part", "counter:section", "counter:subsection", "counter:subsubsection", "counter:paragraph", "counter:subparagraph", "env:abstract", "env:abstract*", "env:nomenclature", "env:figure", "env:table", "env:thebibliography", "cmd:\\maketitle", "cmd:\\tableofcontents", "cmd:\\appendix", "cmd:\\keywords", "cmd:\\ConfName", "cmd:\\ConfAcronym", "cmd:\\ConfDate", "cmd:\\ConfCity", "cmd:\\PaperNo", "cmd:\\SetAuthors", "cmd:\\SetAffiliation", "cmd:\\affil", "cmd:\\CorrespondingAuthor", "cmd:\\JointFirstAuthor", "cmd:\\versionfootnote", "cmd:\\entry", "cmd:\\EntryHeading"],
  options: {
    grid: { description: "turns the inline author line into a grid of author blocks, three to a row, each name over its own address (asmeconf.cls l.245-246, 286, 1808-2038); \\SetAffiliation{n} then fills the n-th block, at most 15 blocks (front.asmeconf's grid preset)" },
    lineno: { description: "loads lineno [switch,mathlines] and numbers lines from \\begin{document} (l.1542-1566); not given by the setting, so lineno is not a preload" },
    balance: { description: "loads flushend for the last page's columns unless lineno is given (l.1567-1573); not given by the setting" },
    nofontspec: { unloads: ["fontspec", "unicode-math"], description: "outside pdfTeX, turns \\ifac@fontspec off (l.256-257, 369-371), so the block from l.657 loads neither unicode-math nor fontspec and sets no TeX Gyre fonts (whose \\setmathfont{texgyretermes-math} name lookup fails on the runner: b2p probes G4-asmeconf-*); not given by the setting unless the CI session adds it" },
  },
  forbids: {
    technical: [
      { pkg: "authblk", reason: "asmeconf.cls defines \\affil itself (its profile's defines), so authblk's \\newcommand\\affil stops at 'Command \\affil already defined' as it loads (front.authblk, the only way that loads it, takes `only` article and so fits every class built on article)", evidence: [{ kind: 'compile', cell: 'batch 4 round 1, asmeconf.A: front.authblk 19 of 19 branches fail (document d6e846db7aa0d2d5ecffb, result 3d24735b1e, l.166)' }] },
    ],
    policy: [],
  },
  layout: { columns: 2, textwidth: "542.025pt", fontsize: "10pt" },
  vocabulary: {"\\ConfName": "the conference name (header)", "\\ConfAcronym": "the conference acronym", "\\ConfDate": "the conference dates", "\\ConfCity": "the conference city", "\\PaperNo": "the paper number", "\\SetAuthors": "the author list, with \\affil keys", "\\SetAffiliation": "an affiliation by key", "\\CorrespondingAuthor": "the corresponding author's email", "\\keywords": "keywords, printed at the abstract's end"},
  evidence: [
    { kind: 'source', file: 'Latex Related Research/Latex-lib-main/Source/0909-asmeconf/asmeconf.cls', line: '9, 69 (version 2026/01/10; \\LoadClass[twoside,10pt]{article})' },
    { kind: 'source', file: 'Latex Related Research/Latex-lib-main/Source/0909-asmeconf/asmeconf.cls', line: '508-537 (geometry, graphicx, xcolor, natbib, booktabs, array, dcolumn, caption, subcaption)' },
    { kind: 'source', file: 'Latex Related Research/Latex-lib-main/Source/0909-asmeconf/asmeconf.cls', line: '642-705 (mathtools, babel, unicode-math and fonts on XeTeX)' },
    { kind: 'source', file: 'Latex Related Research/Latex-lib-main/Source/0909-asmeconf/asmeconf.cls', line: '1255, 1295-1309, 1449, 1467, 1542-1573 (fancyhdr, footmisc on old kernels, hyperref, doi, lineno/flushend)' },
    { kind: 'source', file: 'Latex Related Research/Latex-lib-main/Source/0909-asmeconf/asmeconf.cls', line: '1331-1366, 1410, 1626-1664, 2150-2195 (headings, appendix, abstract, nomenclature, \\maketitle)' },
  ],
});
