import { defineClass } from '../schema/class.ts';
import { ctan } from '../schema/minimal.ts';

/** The class source as the engine fetches it (MiKTeX package quantumarticle); line numbers below are this file's. */
const CLS = 'quantumarticle.cls (quantumarticle 2022/11/08 v6.1, MiKTeX snapshot 9766)';
const LTXGRID = 'ltxgrid.sty (revtex 4.2, MiKTeX snapshot 9766)';
const LTXUTIL = 'ltxutil.sty (revtex 4.2, MiKTeX snapshot 9766)';
const NICEMATRIX = 'nicematrix.sty (MiKTeX snapshot 9766)';

/**
 * Quantum's quantumarticle, read from its source (batch 2, setting quantumarticle.A: a4paper,twocolumn,11pt,nopdfoutputerror; not
 * yet measured by the class probe). It is a class of its own, not built on article (no \LoadClass; its sectioning counters,
 * floats, \maketitle, \tableofcontents and thebibliography are its own, l.422-906).
 * It redefines \usepackage (l.256-278) to skip a package on its blacklist: silently for titlesec (l.280), geometry (l.287),
 * fancyhdr (l.917) and authblk (l.1144), each of which the class loads or replaces itself, and with a ClassError for the font
 * packages (l.1514-1556: times, lmodern, helvet, mathptmx, newtx, ...).
 * Loaded while the class loads: xkeyval, etoolbox (l.26-27), geometry with margin=2cm,bottom=3cm in two columns (l.282-284), ltxcmds
 * (l.342), revtex's ltxgrid in two columns (l.346-348; it loads ltxutil, ltxgrid.sty l.57) and fancyhdr (l.916). It loads neither
 * amsmath, amssymb nor amsfonts unless asked (l.155-168), nor natbib outside its revtex compatibility mode (l.197-205, l.1474-1480).
 * Loaded late, after the preamble's own packages, so not `preloads` (a way's options win there, and the class's later request asks
 * for nothing the way's load lacks): caption at the end of the preamble with font={small,sf} passed beforehand (l.1508-1512),
 * hyperref at \begin{document} (l.1392-1394, colorlinks and hyperindex passed l.1375-1385), lmodern, bbm, xcolor (l.311-337),
 * xstring and tikz (l.1272-1278).
 */
export default defineClass({
  id: 'class.quantumarticle',
  name: "quantumarticle",
  targetEngine: "untested",
  preloads: [
    {"pkg": "xkeyval"}, {"pkg": "etoolbox"}, {"pkg": "geometry", "options": ["margin=2cm", "bottom=3cm"]}, {"pkg": "ltxcmds"},
    {"pkg": "ltxgrid"}, {"pkg": "ltxutil"}, {"pkg": "fancyhdr"},
  ],
  defines: [
    "counter:part", "counter:section", "counter:subsection", "counter:subsubsection", "counter:paragraph", "counter:subparagraph",
    "env:figure", "env:table", "env:thebibliography", "env:abstract", "env:acknowledgements",
    "cmd:\\maketitle", "cmd:\\tableofcontents", "cmd:\\appendix",
    "cmd:\\keywords", "cmd:\\affiliation", "cmd:\\address", "cmd:\\email", "cmd:\\homepage", "cmd:\\orcid", "cmd:\\openone",
  ],
  options: {
    onecolumn: { columns: 1, unloads: ["ltxgrid", "ltxutil"], description: "one column: the class loads ltxgrid only when \\if@twocolumn holds (l.346-348), and geometry gets margin=3cm (l.284)" },
  },
  setup: {
    options: ['nopdfoutputerror'],
    loads: [{ pkg: 'hyperref' }],
    reason: "quantumarticle.cls stops at \\pdfoutput unless given nopdfoutputerror (XeTeX has no \\pdfoutput: 'Undefined control sequence', then 'Missing \\begin{document}'), and it loads hyperref itself at \\begin{document} (l.1392-1394), where the engine's nameref (2026-01-29 v2.58, l.372) stops at 'Sorting rule for begindocument hook applied too late' unless hyperref is already in the preamble",
    evidence: [
      { kind: 'compile', reproducer: "\\documentclass[a4paper,twocolumn,11pt]{quantumarticle} with url and a \\url: 'Undefined control sequence' at \\pdfoutput; with nopdfoutputerror: 'LaTeX hooks Error: Sorting rule for begindocument hook applied too late'; with \\usepackage{hyperref} in the preamble as well it compiles (class-examples' probe (Latex Related Research/Latex-Template-Examples, 2026-11-06), through Flouest's headless ZeroTeX-NG runner)" },
      { kind: 'compile', cell: 'class-examples: _results/class.quantumarticle.log (2026-11-06)' },
    ],
  },
  forbids: {
    technical: [
      { pkg: "abstract", reason: "abstract.sty's environment tests if@titlepage, which quantumarticle never defines (it keeps titlepage as an etoolbox toggle, l.32-33, 91-92), so its else and \\fi are left over: 'Extra else', 'Extra \\fi': every \\begin{abstract} stops at 'Undefined control sequence' (b2p probe G3-quantumarticle-tables-omit)", evidence: [{ kind: 'source', file: "G3/quantumarticle.ts", line: "32-33, 91-92" }] },
      { pkg: "sectsty", reason: "quantumarticle is a standalone class whose sectioning sectsty does not recognise: 'Package sectsty Error: The sectsty package doesn't work with this document class' (b2p probe G3-quantumarticle-biblatex)", evidence: [{ kind: 'source', file: "G3/quantumarticle.ts", line: "own sectioning" }] },
      { pkg: "colortbl", reason: "in two columns quantumarticle loads revtex's ltxgrid and ltxutil (l.346-348), and ltxutil swaps in its own copies of array's internals at \\begin{document} whenever array is loaded (ltxutil.sty switch@array l.909-910, 1033-1098: endarray@array@new replaces colortbl's patched endarray), so colortbl's row colours run on, as revtex4-2's colortbl forbid; the probe's tables also stop at 'Extra or' until the setting relaxes @endpbox as revtex4-2-aps.json does", evidence: [{ kind: 'source', file: "G3/quantumarticle.ts", line: "346-348; ltxutil.sty 1033-1098" }] },
      // b28 (batch 2, round 2, GitHub run b27-39fa711): the same \switch@array swap keeps arydshln's wrappers from ever running.
      { pkg: "arydshln", reason: "arydshln wraps \\@array, \\@mkpream, \\endarray and \\endtabular when it loads (arydshln.sty l.104-111, 171-176, 497-499), and in two columns quantumarticle loads revtex's ltxgrid and ltxutil (l.346-348), whose \\switch@array lets them to its own copies at \\begin{document} (ltxutil.sty l.909-910, 1033-1098), as revtex4-2 and aastex701 do: \\adl@rowsL is never initialised and \\hline stops in \\adl@hline. tbl.arydshln passed 0 of the 207 not-denied quantumarticle.A branches of GitHub run b27-39fa711 ('Undefined control sequence' in \\adl@hline, 'Argument of \\adl@vlineR has an extra }', 'Missing } inserted'), and its cells are 143 of the 144 that ended at '100 errors', taking 1,684 other branches with them", evidence: [{ kind: 'source', file: 'arydshln.sty (arydshln 2019/02/21 v1.76, as the engine fetches it)', line: '104-111, 171-176, 497-499' }, { kind: 'source', file: CLS, line: '346-348' }, { kind: 'source', file: LTXUTIL, line: '909-910, 1033-1098' }, { kind: 'compile', cell: 'GitHub run b27-39fa711, quantumarticle.A: tbl.arydshln 0 of 207 (document dafffd9d9eb47f7719197)' }] },
      { pkg: "titlesec", reason: "quantumarticle's \\usepackage skips a package on its blacklist (l.256-278), and titlesec is on it with no message (l.280): the package never loads, so a way's \\titleformat or \\titlespacing stops at 'Undefined control sequence'", evidence: [{ kind: 'source', file: CLS, line: '256-280' }] },
      { pkg: "times", reason: "quantumarticle's \\usepackage stops with a ClassError for custom font packages (l.256-278, blacklist l.1555: 'You are not supposed to load custom font packages such as times')", evidence: [{ kind: 'source', file: CLS, line: '256-278' }, { kind: 'source', file: CLS, line: '1514-1556' }] },
      { pkg: "nicematrix", reason: "in two columns quantumarticle loads revtex's ltxgrid (l.346-348), which loads ltxutil (ltxgrid.sty l.57), which defines \\rvtx@ifformat@geq (ltxutil.sty l.158-160); nicematrix stops while it loads when that command exists ('nicematrix is incompatible with REVTeX', nicematrix.sty l.86-93), as in aastex701 and revtex4-2", evidence: [{ kind: 'source', file: CLS, line: '346-348' }, { kind: 'source', file: LTXGRID, line: '57' }, { kind: 'source', file: LTXUTIL, line: '158-160' }, { kind: 'source', file: NICEMATRIX, line: '86-93' }] },
      // batch 4 round 1: the same grid's output routine and multicol's.
      { pkg: "multicol", reason: "in two columns quantumarticle builds its pages with revtex's ltxgrid (l.346-348), which undefines \\@kludgeins (\\let\\@kludgeins\\@undefined, ltxgrid 4.2f; the same line in aastex701.cls's copy, l.5069); multicol's output routine tests \\ifvbox\\@kludgeins whenever a multicols environment breaks across a page, and stops there at 'Undefined control sequence' in \\multi@column@out, then 'Missing number'. revtex4-2 and aastex701 refuse multicol outright for the same grid. A multicols that never breaks a page compiles, which is why most cells holding multicol passed: the template's text decides it, not the way", evidence: [{ kind: 'source', file: CLS, line: '346-348' }, { kind: 'source', file: 'testing-pipeline/settings/classes/files/aastex701.cls', line: '2813-2814 (ltxgrid 4.2f), 5069 (\\let\\@kludgeins\\@undefined)' }, { kind: 'compile', cell: 'batch 4 round 1 (testing-pipeline/out/fetched/batch4-round1): quantumarticle.A, 36 cells whose first error is \\@kludgeins in \\multi@column@out (235 failing branches; document df900c569b53e940b9755, result e49d3af7be), as in the run of 2026-11-05 (43 cells); 2,800 of the 3,260 not-denied branches with multicol (cols.multicol, General\'s multicol) passed, all in cells whose multicols did not cross a page' }] },
      { pkg: "titling", reason: "titling.sty tests \\if@titlepage while it loads (titling 2009/09/04 v2.1d, l.35), which quantumarticle never defines (it keeps titlepage as an etoolbox toggle, l.32-33, 91-92, as for abstract.sty above): 'Undefined control sequence' at \\if@titlepage, then 'Extra \\else'", evidence: [{ kind: 'compile', cell: 'batch 4 round 1 (testing-pipeline/out/fetched/batch4-round1): quantumarticle.A, 24 cells whose first error is \\if@titlepage at titling.sty l.35, each holding front.titling' }] },
      { pkg: "paracol", reason: "in two columns quantumarticle builds its pages with revtex's ltxgrid (l.346-348), which undefines \\@holdpg (ltxgrid.sty l.1143-1144) and \\col@number (l.1532-1533; the class lets \\col@number to \\@colnum again, l.352); paracol boxes \\@holdpg in its output routine, which failed with 'Undefined control sequence' under aastex701's copy of the same grid (cols.paracol's one-column rule keeps it out already)", evidence: [{ kind: 'source', file: CLS, line: '346-352' }, { kind: 'source', file: LTXGRID, line: '1143-1144' }, { kind: 'source', file: LTXGRID, line: '1532-1533' }] },
    ],
    policy: [],
  },
  // A4 less margin=2cm left and right (l.283): 170mm = 483.69pt; the setting gives 11pt (the class default is 10pt, l.232).
  layout: { columns: 2, textwidth: "483.69pt", fontsize: "11pt" },
  vocabulary: {"\\affiliation": "an author's affiliation (after \\author)", "\\email": "an author's e-mail (only after the first \\author, l.1221)", "\\homepage": "an author's home page", "\\orcid": "an author's ORCID", "\\keywords": "keywords"},
  evidence: [
    { kind: 'source', file: CLS, line: '155-245' },
    { kind: 'source', file: CLS, line: '256-352' },
    { kind: 'source', file: CLS, line: '916-917' },
    { kind: 'source', file: CLS, line: '1137-1230' },
    { kind: 'source', file: CLS, line: '1375-1512' },
    ctan('quantumarticle'),
  ],
});
