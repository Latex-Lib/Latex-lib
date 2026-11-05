import { defineClass } from '../schema/class.ts';

/**
 * IOP Publishing's legacy journal class iopart.cls (1996/06/10 v0.0) with iopart12.clo (1997/01/15 v1.0, bare CR line ends),
 * loaded by the iopart setting as \documentclass[12pt]{iopart}. Not measured by the class probe (batch 3, b3p G2): every field
 * is read from the pinned files, testing-pipeline/settings/classes/files/iopart.cls and iopart12.clo, whose lines are cited.
 * - A class of its own: no \LoadClass and no \RequirePackage (grep of iopart.cls), so it preloads nothing and has no base.
 *   It allocates section to subparagraph (l.371-375) but no part counter and no \part, and no chapter.
 * - Headings are \@startsection commands (l.383-399), so titlesec can restyle them. sectsty cannot: it accepts only article, report, book and the KOMA classes (sectsty.sty l.277-296), so it is refused.
 * - \title and \author typeset at once (l.106-116, l.225-237) and \maketitle only ends the page (l.98); the setting's preamble
 *   (line 2) keeps a preamble \title/\author until \maketitle and runs them there, and makes \and a comma (line 3), so
 *   \maketitle is not forbidden here, as it is under iopjournal. titling is: it loads after that line and replaces the
 *   setting's \maketitle with its own, which prints \@title, a macro iopart's \title never sets.
 * - equation* and endequation* are iopart's (l.788-789); the setting's preamble (line 1) clears them so General's amsmath can
 *   load. \footnote is iopart's own (fnsymbol marks, counter from 1, no rule; l.301-315).
 * - Names it defines that a document may also define: \e \rme \rmi \rmd (l.853-856), \Tr \tr \Or \case \fl (l.860-866),
 *   table rules \br \mr \ms \bs \ns \es \centre \crule (l.912-938), \etal (l.940), \mat (l.943), journal abbreviations
 *   \CQG ... (l.947 on); it renews \qquad (l.857), \cal and \mit (l.580-590). No library way defines these today.
 * - Page: \textwidth 37.2pc = 446.4pt, 12pt on 16pt (iopart12.clo l.24-25, l.73), one column (\ioptwocol, l.1096, only on request).
 */
export default defineClass({
  id: 'class.iopart',
  name: "iopart",
  zerotex: "untested",
  preloads: [],
  defines: ["counter:section", "counter:subsection", "counter:subsubsection", "counter:paragraph", "counter:subparagraph", "env:abstract", "env:figure", "env:table", "env:thebibliography", "cmd:\\maketitle", "cmd:\\tableofcontents", "cmd:\\appendix"],
  options: {},
  forbids: {
    technical: [
      { pkg: "sectsty", reason: "iopart is a class of its own (\\ProvidesClass{iopart} at l.28, no \\LoadClass in the file), and sectsty stops unless article, report, book or a KOMA class is loaded: 'Package sectsty Error: The sectsty package doesn't work with this document class' (sectsty.sty 2002/02/25 v2.0.2 l.277-296; seen under agujournal2025, b3p probe G2-agu-thebib main.log l.383)", evidence: [{ kind: 'source', file: 'sectsty.sty (MiKTeX package sectsty, 2002/02/25 v2.0.2)', line: '277-296' }, { kind: 'source', file: 'testing-pipeline/settings/classes/files/iopart.cls', line: '28 (\\ProvidesClass{iopart}; no \\LoadClass in the file)' }] },
      { pkg: "titling", reason: "iopart's \\title is not the kernel's: it typesets at once and never sets \\@title (iopart.cls l.106-116), and the setting keeps it until its own \\maketitle (setting preamble line 2). titling loads after the setting's lines (they follow \\documentclass, before every \\usepackage) and replaces that \\maketitle with one that prints \\@title, so the kept title block is lost and \\@title is still the kernel's 'No \\title given' error; titling's \\title wrapper (an \\appendiargdef of one argument, titling.sty l.239-251) also misreads \\title[short]{full}", evidence: [{ kind: 'source', file: 'testing-pipeline/settings/classes/files/iopart.cls', line: '98, 106-116' }, { kind: 'source', file: 'titling.sty (titling 2009/09/04 v2.1d, MiKTeX snapshot 9766)', line: '239-251' }, { kind: 'source', file: 'testing-pipeline/settings/classes/iopart.json', line: 'preamble[1]' }] },
    ],
    policy: [],
  },
  layout: { columns: 1, textwidth: "446.4pt", fontsize: "12pt" },
  vocabulary: {},
  evidence: [
    { kind: 'source', file: 'testing-pipeline/settings/classes/files/iopart.cls', line: '28 (\\ProvidesClass), 44-50 (options), 371-399 (counters, headings)' },
    { kind: 'source', file: 'testing-pipeline/settings/classes/files/iopart.cls', line: '463 (abstract), 498-523 (\\appendix), 539-550 (figure, table), 595 (\\tableofcontents), 713-725 (thebibliography)' },
    { kind: 'source', file: 'testing-pipeline/settings/classes/files/iopart.cls', line: '98 (\\maketitle), 106-116 (\\title), 225-237 (\\author), 301-315 (\\footnote), 788-789 (equation*)' },
    { kind: 'source', file: 'testing-pipeline/settings/classes/files/iopart12.clo', line: '24-25 (\\normalsize 12/16), 73 (\\textwidth 37.2pc)' },
  ],
});
