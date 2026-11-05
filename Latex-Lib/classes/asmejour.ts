import { defineClass } from '../schema/class.ts';
import { ctan } from '../schema/minimal.ts';

/** The class source as the engine fetches it (MiKTeX package asmejour); line numbers below are this file's. */
const CLS = 'asmejour.cls (asmejour 2025/11/30 v1.27, MiKTeX snapshot 9766)';

/**
 * b28 (batch 2, round 2, from GitHub run b27-39fa711): the setting loads `asmejour-latexlib`, asmejour.cls v1.27 with its
 * `caption/label` socket code guarded (the CI session's patch, shipped through the setting's `files` as icassp ships
 * spconf.sty), since 1,004 of 1,005 cells stopped at "Socket 'caption/label' undeclared!" (l.1128) at class load. A profile's
 * `name` must be its setting's class (`latexLibClasses` stops a run where they differ), so the name follows; `classKeys` still
 * finds this profile for the setting asmejour (one profile of that name, so it is keyed by it, and the setting's class is it).
 * Line numbers below stay the original asmejour.cls's (`CLS`), not the patched file's.
 */

/**
 * John Lienhard's asmejour, read from its source (batch 2, setting asmejour.A, no options; not yet measured by the class probe).
 * It loads extarticle at 9pt, twoside (l.69); \maketitle starts the two columns. Then, with options a way's load of the same package
 * would clash with (the host reads that from `preloads`): geometry for ASME's 215.9 x 285.7 mm page (l.304), natbib with
 * sort&compress and numbers (l.309), xcolor with dvipsnames, svgnames and x11names (l.315), and hyperref with psdextra (l.1296);
 * without options: etoolbox (l.91), xparse (l.116), kvoptions (l.177), graphicx, array, dcolumn, booktabs (l.314-333, with its own
 * \toprule, \midrule and \bottomrule), mathtools (so amsmath, l.341), babel (l.342), fancyhdr (l.898) and doi (l.1314).
 * XeTeX takes the non-pdfTeX branch (l.344, 352-400): unicode-math with mathbf=sym (so fontspec), and the fonts by file name.
 * footmisc (l.930-941) and caption (l.995-1000) are loaded only on formats older than 2025/06/01 and 2025/11/01, and the engine's
 * format is newer, so neither is a preload; without subcaption the class defines its own subfigure environment and \subcaption
 * (l.1004-1030). It redefines \section, \subsection and \subsubsection with xparse (l.1161-1197), \appendix (l.1245), \maketitle,
 * \title and the abstract environment, whose body it stores for \maketitle (l.1707-1722), and makes \author an error ('the \author
 * command is not used', l.1709-1714): authors go in \SetAuthorBlock (l.1503).
 */
export default defineClass({
  id: 'class.asmejour',
  name: "asmejour-latexlib",
  base: 'class.extarticle',
  zerotex: "untested",
  preloads: [
    {"pkg": "etoolbox"}, {"pkg": "xparse"}, {"pkg": "kvoptions"},
    {"pkg": "geometry", "options": ["paperheight=285.7mm", "paperwidth=215.900mm", "left=21.100mm", "right=21.100mm", "top=15.9mm", "bottom=24mm", "footskip=8mm"]},
    {"pkg": "natbib", "options": ["sort&compress", "numbers"]}, {"pkg": "graphicx"},
    {"pkg": "xcolor", "options": ["dvipsnames", "svgnames", "x11names"]}, {"pkg": "array"}, {"pkg": "dcolumn"}, {"pkg": "booktabs"},
    {"pkg": "mathtools"}, {"pkg": "amsmath"}, {"pkg": "babel"},
    {"pkg": "unicode-math", "options": ["warnings-off={mathtools-colon,mathtools-overbracket}", "mathbf=sym"]}, {"pkg": "fontspec"},
    {"pkg": "fancyhdr"}, {"pkg": "hyperref", "options": ["psdextra"]}, {"pkg": "doi"},
  ],
  defines: [
    "counter:part", "counter:section", "counter:subsection", "counter:subsubsection", "counter:paragraph", "counter:subparagraph",
    "env:figure", "env:table", "env:thebibliography", "env:abstract", "env:nomenclature", "env:subfigure",
    "cmd:\\maketitle", "cmd:\\tableofcontents", "cmd:\\appendix",
    "cmd:\\keywords", "cmd:\\SetAuthorBlock", "cmd:\\JourName", "cmd:\\PaperNumber", "cmd:\\subcaption", "cmd:\\CondSans",
    "cmd:\\CondSansBold", "cmd:\\Condhuge", "cmd:\\CondHuge", "cmd:\\nomname", "cmd:\\keywordname", "cmd:\\CAwords", "cmd:\\hrefurl",
  ],
  options: {},
  forbids: {
    technical: [
      { pkg: "cite", reason: "asmejour.cls (natbib[sort&compress,numbers]) loads natbib, whose \\NAT@set@cites at \\begin{document} installs a two-optional \\@citex (natbib.sty 8.31b l.375, l.645-674); cite.sty redefines \\cite to call \\@citex with one optional argument (cite.sty v5.5 l.302-307), so citations scan on to the paragraph's end: 'Paragraph ended before \\@citex was complete' and 'Argument of \\@citex has an extra }' (as elsarticle; b2p probe: G2-apa7-cite and G2-oup-authoring-template-cite, 48 and 53 \\@citex errors, no PDF)", evidence: [{ kind: 'source', file: "G3/asmejour.ts", line: "natbib load" }] },
    ],
    policy: [],
  },
  // Two columns from \maketitle on; 215.9mm less 2 x 21.1mm (l.304) = 173.7mm = 494.22pt; 9pt (l.69).
  layout: { columns: 2, textwidth: "494.22pt", fontsize: "9pt" },
  vocabulary: {"\\SetAuthorBlock": "an author's name and address block (\\author is an error in this class)", "\\JourName": "the journal's name in the footer", "\\PaperNumber": "the paper number", "\\keywords": "keywords, printed under the abstract", "\\CorrespondingAuthor": "the corresponding author's e-mail"},
  evidence: [
    { kind: 'source', file: CLS, line: '69' },
    { kind: 'source', file: CLS, line: '304-400' },
    { kind: 'source', file: CLS, line: '898-1030' },
    { kind: 'source', file: CLS, line: '1161-1314' },
    { kind: 'source', file: CLS, line: '1503-1722' },
    ctan('asmejour'),
  ],
});
