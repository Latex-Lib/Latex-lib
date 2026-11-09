import { defineClass } from '../schema/class.ts';

/**
 * Copernicus Publications' journal class copernicus.cls v10.1.34 with copernicus.cfg, loaded by the copernicus setting as
 * \documentclass[acp,manuscript]{copernicus}. Not measured by the class probe (batch 3, b3p G2): every field is read from the
 * pinned files in testing-pipeline/settings/classes/files/, whose lines are cited (b3q: the CI session's XeTeX-patched copy,
 * class name unchanged; its lines are those of the unpatched file +3 up to l.33 and +5 after).
 * - XeTeX patch (l.2-4, l.37-38): the class knew only pdfTeX and LuaTeX and stopped at \ifnum\pdfoutput (unpatched l.255);
 *   its four \pdfoutput tests now read \cop@pdfoutput, 1 under XeTeX (l.260, 1534, 2327, 2371), \pdfpageattr is left out
 *   (l.285), and, as under LuaTeX, neither inputenc (l.1369) nor ucharacters (l.1372-1382) loads, so inputenc is no preload.
 *   The CI session's probe 41977413848 of the patched class is clean.
 * - It refuses every standard size, paper and column option with \@latexerr (l.94-110) and loads article itself with fleqn
 *   (l.174), so article is the base and setup B (twocolumn) cannot be used.
 * - Stage: \if@stage@final starts true (l.111) and acp keeps it; \if@cop@home is true only when copernicuslogo.pdf exists
 *   (l.121), which is not shipped, so hyperref is NOT loaded (its \usepackage[bookmarks=true,colorlinks]{hyperref},
 *   l.2310-2329, is inside \if@cop@home) and the final manuscript layout applies (l.177-185).
 * - Preloads (load order): etoolbox, iftex (l.26-27), ulem [normalem] (l.1330), fontenc [T5,T3,T1] (l.1331), textcomp [warn]
 *   (l.1332), fontawesome5 (l.1333), upquote, regexpatch (l.1342-1343), babel
 *   (l.1391), array (l.1507), tabularx (l.1531), graphicx, color, amssymb (l.1532-1545), amsmath [intlimits,fleqn,tbtags]
 *   (l.1547), amsthm (l.1554), url (l.1849), accents, cancel, multirow, supertabular, algorithmic (l.1888-1928), algorithm
 *   (l.1955, which loads float), caption (l.1978, final stage; subfig only for discussions), listings (l.1986), subfloat
 *   (l.2033), natbib [authoryear,round] (l.2044), rotating (l.2085), lineno [mathlines,modulo] (l.2093), tikz (l.2140), times
 *   (l.2142) and pifont (l.2309). amsmath's options make a leqno way an 'Option clash', natbib's a numbers, square, super or
 *   sort way, rotating's empty list a figuresright or figuresleft way.
 * - natbib: \bibpunct{(}{)}{;}{a}{,}{,~} (l.2045) and, at \begin{document}, \let\@citex\NAT@citex (l.2054), which replaces
 *   cite.sty's one-optional \@citex with natbib's two-optional one, so cite is refused (as under elsarticle). No
 *   \bibliographystyle is set by the class (grep), so author-year styles work; a numeric style stops natbib ('Bibliography not
 *   compatible with author-year citations'), which bib.bibtex-bst's deny holds (CA2).
 * - It renews \maketitle (l.573), \title (l.568-571), \author[affil]{names} (l.1588), \and as a new line (l.50), the
 *   abstract (l.1210, l.1237), thebibliography (l.2057), \@startsection itself (l.1041) for its numbered-line headings, and
 *   \appendix (l.1752-1839: it redefines \section and \@sect inside the appendix). \runningtitle and \runningauthor are
 *   required (l.557-558); the setting gives both. It defines no theorem environment.
 * - Page: final manuscript, \textwidth 177mm = 503.61pt (l.180), article's 10pt with \baselinestretch 1.4 (l.606), one column.
 */
export default defineClass({
  id: 'class.copernicus',
  name: "copernicus",
  base: 'class.article',
  targetEngine: "untested",
  preloads: [
    {"pkg": "etoolbox"}, {"pkg": "iftex"}, {"pkg": "ulem", "options": ["normalem"]}, {"pkg": "fontenc", "options": ["T5", "T3", "T1"]}, {"pkg": "textcomp", "options": ["warn"]}, {"pkg": "fontawesome5"},
    {"pkg": "upquote"}, {"pkg": "regexpatch"}, {"pkg": "babel"}, {"pkg": "array"}, {"pkg": "tabularx"}, {"pkg": "graphicx"}, {"pkg": "color"}, {"pkg": "amssymb"},
    {"pkg": "amsmath", "options": ["intlimits", "fleqn", "tbtags"]}, {"pkg": "amsthm"}, {"pkg": "url"}, {"pkg": "accents"}, {"pkg": "cancel"}, {"pkg": "multirow"}, {"pkg": "supertabular"}, {"pkg": "algorithmic"},
    {"pkg": "float"}, {"pkg": "algorithm"}, {"pkg": "caption"}, {"pkg": "listings"}, {"pkg": "subfloat"}, {"pkg": "natbib", "options": ["authoryear", "round"]}, {"pkg": "rotating"},
    {"pkg": "lineno", "options": ["mathlines", "modulo"]}, {"pkg": "tikz"}, {"pkg": "times"}, {"pkg": "pifont"},
  ],
  defines: ["counter:part", "counter:section", "counter:subsection", "counter:subsubsection", "counter:paragraph", "counter:subparagraph", "env:abstract", "env:figure", "env:table", "env:thebibliography", "cmd:\\maketitle", "cmd:\\tableofcontents", "cmd:\\appendix", "cmd:\\Author", "cmd:\\affil", "cmd:\\runningtitle", "cmd:\\runningauthor", "env:acknowledgements", "cmd:\\authorcontribution", "cmd:\\competinginterests", "cmd:\\specialsection", "cmd:\\noappendix", "cmd:\\theolds", "cmd:\\introduction", "cmd:\\conclusions", "cmd:\\tophline", "cmd:\\middlehline", "cmd:\\bottomhline", "cmd:\\firstpage"],
  options: {},
  forbids: {
    technical: [
      { pkg: "cite", reason: "copernicus.cls loads natbib [authoryear,round] (l.2044) and at \\begin{document} lets \\@citex to natbib's two-optional \\NAT@citex (l.2054); cite.sty's \\cite calls \\@citex with one optional argument (cite.sty v5.5 l.302-307), so a citation scans on to the paragraph's end: 'Paragraph ended before \\@citex was complete' (as elsarticle, apa7 and oup-authoring-template: b2p probe G2-apa7-cite, 48 \\@citex errors, no PDF)", evidence: [{ kind: 'source', file: 'testing-pipeline/settings/classes/files/copernicus.cls', line: '2043-2054' }, { kind: 'source', file: 'cite.sty (cite v5.5, MiKTeX snapshot 9766)', line: '302-307' }] },
      { pkg: "arydshln", reason: "copernicus.cls loads array and tabularx (l.1507, 1531) and redefines \\@arraycr (l.1528-1530); arydshln's \\hdashline rows then break \\endtabular: 'Extra }, or forgotten $', 'Missing $ inserted' (probe b3q-copernicus-floats-abstract: 28 errors, all at l.150 \\end{tabular} of an arydshln table)", evidence: [{ kind: 'source', file: 'testing-pipeline/settings/classes/files/copernicus.cls', line: '1507-1531' }, { kind: 'compile', cell: 'probe b3q-1 b3q-copernicus-floats-abstract main.log l.1626-1654' }] },
    ],
    policy: [],
  },
  layout: { columns: 1, textwidth: "503.61pt", fontsize: "10pt" },
  vocabulary: {},
  evidence: [
    { kind: 'source', file: 'testing-pipeline/settings/classes/files/copernicus.cls', line: '2-4, 37-38 (latexlib XeTeX patch, \\cop@pdfoutput), 21 (\\ProvidesClass), 94-111 (refused options, stage), 121 (\\if@cop@home), 125 (manuscript), 174 (\\LoadClass[fleqn]{article}), 177-185 (layout)' },
    { kind: 'source', file: 'testing-pipeline/settings/classes/files/copernicus.cls', line: '26-27, 1330-1391, 1507-1554, 1849-1986, 2033-2093, 2140-2142, 2309 (packages); 2310-2329 (hyperref, only \\if@cop@home)' },
    { kind: 'source', file: 'testing-pipeline/settings/classes/files/copernicus.cls', line: '50 (\\and), 557-558 (running heads), 568-573 (\\title, \\maketitle), 1041 (\\@startsection), 1210-1250 (abstract), 1588 (\\author), 1752-1839 (\\appendix), 2057 (thebibliography)' },
  ],
});
