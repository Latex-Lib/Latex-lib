import { defineClass } from '../schema/class.ts';

/**
 * AGU's journal class agujournal2025.cls ([11/12/2024]), loaded by the agu setting as \documentclass[draft]{agujournal2025}.
 * Not measured by the class probe (batch 3, b3p G2): every field is read from the pinned file,
 * testing-pipeline/settings/classes/files/agujournal2025.cls, whose lines are cited. The profile id is the setting's
 * (class.agu); its name is the class's.
 * - Without published (l.58) the class takes its 'old code' branch (l.813-2121), the agujournal2019 manuscript layout: a class
 *   of its own, with no \LoadClass (article is loaded only when published, l.84), so there is no base.
 * - Preloads, in load order, all with no options: graphicx (l.883), xcolor (l.889), url (l.890), lineno (l.900), indentfirst
 *   (l.905), ragged2e (l.910; \RaggedRight for the whole text, l.913), rotating (l.916; sidewaystable and sidewaysfigure
 *   wrapped, l.918-921) and apacite (l.1970; \let\cite\shortcite, l.1972, and \citeA, l.1975). natbib is commented out
 *   (l.1971). xcolor's and rotating's empty option lists make xcolor[table] (tbl.colortbl) and rotating[figuresright] or
 *   [figuresleft] an 'Option clash'; apacite's facts refuse hyperref (\begin{document} overflows the input stack) and natbib
 *   (apacite.sty stops when natbib is read first), which the host reads from this preload.
 * - Front matter: \maketitle is empty (\newcommand{\maketitle}{}, l.822) and \title typesets its argument at once
 *   ({\centering\Large\bf #1\vskip14pt}, l.1376-1378); authors are \authors (l.1380). A \title in the preamble, where
 *   General and the title ways write it, is typeset before \begin{document} ('Missing \begin{document}'), as under
 *   iopjournal, so \maketitle is forbidden: every title way (front.maketitle, front.class-native, front.titling) needs it.
 * - It allocates section to subparagraph (l.1436-1440; no part, no chapter), sets the headings as \@startsection commands
 *   (l.1491-1512), defines figure and table (l.1559-1578), abstract (\abstract, l.1422-1425: a new page and a bold heading),
 *   \appendix (l.1852) and thebibliography (l.1939), and no \tableofcontents. \thanks (l.1391) and \footnoterule
 *   (l.1347-1358) are its own.
 * - Page: \textwidth 5.5in = 397.485pt (l.958), draft's 10pt (\@xpt with \draftskip, l.1229-1231), one column.
 */
export default defineClass({
  id: 'class.agu',
  name: "agujournal2025",
  zerotex: "untested",
  preloads: [{"pkg": "graphicx"}, {"pkg": "xcolor"}, {"pkg": "url"}, {"pkg": "lineno"}, {"pkg": "indentfirst"}, {"pkg": "ragged2e"}, {"pkg": "rotating"}, {"pkg": "apacite"}],
  defines: ["counter:section", "counter:subsection", "counter:subsubsection", "counter:paragraph", "counter:subparagraph", "env:abstract", "env:figure", "env:table", "env:thebibliography", "cmd:\\maketitle", "cmd:\\appendix"],
  options: {},
  forbids: {
    technical: [
      { pkg: "sectsty", reason: "agujournal2025's manuscript branch is a class of its own (article is loaded only under published, l.58-60, 84; the old code from l.813 has no \\LoadClass), and sectsty stops unless article, report, book or a KOMA class is loaded: 'Package sectsty Error: The sectsty package doesn't work with this document class' (sectsty.sty 2002/02/25 v2.0.2 l.277-296; b3p probe G2-agu-thebib main.log l.383)", evidence: [{ kind: 'source', file: 'sectsty.sty (MiKTeX package sectsty, 2002/02/25 v2.0.2)', line: '277-296' }, { kind: 'source', file: 'testing-pipeline/settings/classes/files/agujournal2025.cls', line: '58-60, 84, 813' }] },
      { pkg: "biblatex", reason: "the class loads apacite (l.1970), and biblatex stops at \"Incompatible package 'apacite'\" (biblatex.sty l.168-179), then at 'Command \\biblabelsep already defined' (b3p probe G2-agu-bib main.log l.426, 483)", evidence: [{ kind: 'source', file: 'testing-pipeline/settings/classes/files/agujournal2025.cls', line: '1970' }, { kind: 'source', file: 'biblatex.sty (MiKTeX package biblatex)', line: '168-179' }] },
    ],
    policy: [],
    names: [{ name: "cmd:\\maketitle", reason: "agujournal2025's manuscript branch defines \\maketitle as nothing (l.822) and a \\title that typesets its argument at once (l.1376-1378), so a \\title in the preamble, where every title way writes it, is typeset before \\begin{document} ('Missing \\begin{document}') and \\maketitle prints nothing; AGU's template sets \\title{} after \\begin{document}", evidence: [{ kind: 'source', file: 'testing-pipeline/settings/classes/files/agujournal2025.cls', line: '822, 1376-1380' }] }],
  },
  layout: { columns: 1, textwidth: "397.485pt", fontsize: "10pt" },
  vocabulary: {},
  evidence: [
    { kind: 'source', file: 'testing-pipeline/settings/classes/files/agujournal2025.cls', line: '50 (\\ProvidesClass), 58-59 (published), 84 (article only when published), 813 (old code), 1185-1190 (draft)' },
    { kind: 'source', file: 'testing-pipeline/settings/classes/files/agujournal2025.cls', line: '883-921 (graphicx, xcolor, url, lineno, indentfirst, ragged2e, rotating), 1970-1975 (apacite)' },
    { kind: 'source', file: 'testing-pipeline/settings/classes/files/agujournal2025.cls', line: '958 (\\textwidth), 1229-1231 (\\normalsize), 1436-1440 (counters), 1491-1512 (headings), 1559-1578 (floats), 1852 (\\appendix), 1939 (thebibliography)' },
  ],
});
