import { defineClass } from '../schema/class.ts';

/**
 * jacow (JACoW accelerator conference proceedings, jacow.cls 2022/02/02 v2.7), read from the class source (MiKTeX snapshot
 * 9766, package jacow) for batch 2 (b2p), not yet measured by a class probe. It loads article as
 * \LoadClass[10pt,twocolumn]{article} (l.218), so it is always two columns, and its preloads are listed as ZeroTeX-NG
 * (XeTeX) runs it:
 * - fix-cm, flushend, etoolbox, iftex, textcase (l.217-223);
 * - siunitx [mode=match, reset-text-series=false, text-series-to-math=true] (l.250), graphicx, booktabs (l.251-252),
 *   caption [figureposition=bottom, tableposition=top, skip=5pt] (l.253), xcolor, amsmath (l.254-255);
 * - geometry with its text block (l.259-269) and paper=a4paper, which the setting's a4paper option passes (l.198-199);
 * - footmisc [hang] (l.271), url (l.279), newtxtt [zerostyle=d] (l.283);
 * - under XeTeX unicode-math, and so fontspec, with \setmainfont{TeX Gyre Termes} and \setmathfont{TeX Gyre Termes Math}
 *   (l.292-298; the pdfTeX branch's textcomp, fontenc, lmodern, tgtermes and newtxmath, l.304-310, are not loaded);
 * - microtype (l.315), enumitem (l.319), cite without its biblatex option (l.559), and csquotes [autostyle] at the end of
 *   the preamble (l.256), so a way's csquotes with other options clashes even though it loads first.
 * A way loading any of these with an option the class did not give stops at "Option clash"; enumitem's facts refuse
 * enumerate and paralist. It defines Enumerate, Itemize and Description (l.320-322) and keeps an abstract environment
 * (redefined as \subsection*{Abstract}, l.419-436). \setcounter{secnumdepth}{0} (l.369): headings are unnumbered, but
 * article's counters stay. Layout: 170mm = 483.6966pt text width (l.260), 10pt.
 */
export default defineClass({
  id: 'class.jacow',
  name: "jacow",
  base: 'class.article',
  zerotex: "untested",
  preloads: [
    {"pkg": "fix-cm"}, {"pkg": "flushend"}, {"pkg": "etoolbox"}, {"pkg": "iftex"}, {"pkg": "textcase"},
    {"pkg": "siunitx", "options": ["mode=match", "reset-text-series=false", "text-series-to-math=true"]},
    {"pkg": "graphicx"}, {"pkg": "booktabs"},
    {"pkg": "caption", "options": ["figureposition=bottom", "tableposition=top", "skip=5pt"]},
    {"pkg": "xcolor"}, {"pkg": "amsmath"},
    {"pkg": "geometry", "options": ["paper=a4paper", "textwidth=170mm", "textheight=241mm", "heightrounded", "left=20mm", "bottom=56pt", "columnsep=5mm", "noheadfoot", "nomarginpar", "twocolumn"]},
    {"pkg": "footmisc", "options": ["hang"]}, {"pkg": "url"}, {"pkg": "newtxtt", "options": ["zerostyle=d"]},
    {"pkg": "unicode-math"}, {"pkg": "fontspec"}, {"pkg": "microtype"}, {"pkg": "enumitem"}, {"pkg": "cite"},
    {"pkg": "csquotes", "options": ["autostyle"]},
  ],
  defines: ["counter:part", "counter:section", "counter:subsection", "counter:subsubsection", "counter:paragraph", "counter:subparagraph", "env:abstract", "env:Enumerate", "env:Itemize", "env:Description", "env:figure", "env:table", "env:thebibliography", "cmd:\\maketitle", "cmd:\\tableofcontents", "cmd:\\appendix", "cmd:\\copyrightspace", "cmd:\\urlZDtxt", "length:\\titleblockheight", "length:\\titleblockstartskip", "length:\\titleblockmiddleskip", "length:\\titleblockendskip"],
  options: {},
  forbids: {
    technical: [
      { pkg: "biblatex", reason: "jacow.cls loads cite when its biblatex option is not given (l.559), and biblatex stops at \"Incompatible package 'cite'\" (biblatex.sty l.168-179); the class's own biblatex option (l.441-444) loads biblatex with its options, which clash with General's", evidence: [{ kind: 'source', file: 'jacow.cls (jacow 2022/02/02 v2.7, MiKTeX snapshot 9766)', line: '559' }, { kind: 'source', file: 'biblatex.sty (MiKTeX snapshot 9766)', line: '168-179' }] },
    ],
    policy: [],
  },
  layout: { columns: 2, textwidth: "483.6966pt", fontsize: "10pt" },
  vocabulary: {"\\copyrightspace": "the space left for the copyright notice on the first page"},
  evidence: [
    { kind: 'source', file: 'jacow.cls (jacow 2022/02/02 v2.7, MiKTeX snapshot 9766)', line: '198-199 (a4paper), 217-283 (article, preloads, geometry), 292-298 (XeTeX branch), 315-322 (microtype, enumitem, Enumerate/Itemize/Description)' },
    { kind: 'source', file: 'jacow.cls (jacow 2022/02/02 v2.7, MiKTeX snapshot 9766)', line: '369 (secnumdepth 0), 388-398 (title block lengths), 419-436 (abstract), 559 (cite)' },
  ],
});
