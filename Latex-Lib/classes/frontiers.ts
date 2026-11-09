import { defineClass } from '../schema/class.ts';

/**
 * Frontiers (author-date journals): FrontiersinHarvard.cls v2.6 (2016/11/10, built on bioinfo.cls) from
 * Frontiers_LaTeX_Templates.zip (testing-pipeline/settings/classes/files/FrontiersinHarvard.cls), with the setting's option
 * `utf8`. Not measured by the class probe (batch 3, b3p): every field is read from the pinned class.
 * - Not built on article (no \LoadClass): it defines its own sizes, counters section to subparagraph, figure, subfigure and
 *   table (l.325-332), abstract (l.517), \section... with \@startsection (l.531-555), figure and table floats (l.596-609),
 *   enumerate, itemize, quotation and quote (l.724-797), thebibliography (l.851) and \appendix (l.870). It has no part counter,
 *   no \tableofcontents or \listoffigures, and no description, verse or titlepage environment of its own: a way that
 *   requires \tableofcontents is unfit here (no name of that kind is listed). The setting's preamble (CI session, b3q) defines
 *   description with \descriptionlabel when the class has none, as article's list, so env:description is listed.
 * - Preloads (l.25-40, l.863): inputenc [utf8], crop [a4,off,center,info] (ExecuteOptions l.27: a4paper, nocrop, centre,
 *   info), graphicx [paper], amsmath, array, color, amssymb, flushend, stfloats, amsthm, chngpage, times, datetime, epstopdf,
 *   parskip (requested as [=v1]), xcolor [usenames,dvipsnames], caption [labelsep=quad,indention=10pt], subcaption
 *   [labelfont=bf,list=true] and natbib with no option (author-year). A way that gives one of these packages an option the
 *   class did not give is an "Option clash" (amsmath leqno or fleqn, xcolor table, parskip skip/indent, every bib.natbib
 *   preset); natbib refuses biblatex and apacite through their package facts. amsthm's proof is restyled by
 *   \renewenvironment (l.939), so the class does not list env:proof (amsthm's facts give it, as under amsart).
 * - Bibliography: natbib author-year, no \bibliographystyle of its own (the template gives Frontiers-Harvard): bib.bibtex-bst
 *   denies class.frontiers unless `apalike`, as neurips; cite is refused; bib.thebibliography's B2CITE-1 chooser gives each
 *   \bibitem an Author(Year) label.
 * - subcaption loads at l.40, before the class defines its figure and table counters (l.330-332), so it declares no sub
 *   types; the class then defines counter subfigure and \subfigure as a float of its own (l.331, l.627-635). subcaption's
 *   subfigure environment is therefore the class's float (inside a figure: "Not in outer par mode"), and subfig's
 *   \newsubfloat{figure} or the subfigure package would define subfigure again. No library way loads them now.
 * - sectsty stops at "The sectsty package doesn't work with this document class" (sectsty.sty l.278-295 accepts only article,
 *   report, book and KOMA): refused.
 * - \href is \newcommand{\href}[2]{#2} (l.937); hyperref's \DeclareRobustCommand*{\href} (hyperref.sty l.4716) replaces it
 *   silently, so hyperref still loads.
 * - Page: \twocolumn at the class's end (l.903), \textwidth 42pc = 504pt (l.152), \normalsize 12pt on 12pt (l.52-53).
 *   \maketitle includes ./logo1.eps (l.486), shipped with the setting, and prints \Authors, \Address, \corrAuthor,
 *   \corrEmail and \firstAuthorLast, which the setting's preamble defines (l.496-504, l.240-245).
 * - abstract.sty and enumitem: the b3p-1 probe (verify-V2) saw abstract.sty stop at \if@titlepage (abstract.sty l.57, 103)
 *   and enumitem at \renewenvironment{description} (enumitem.sty l.1853), so b3p refused both. The setting's preamble now
 *   declares \if@titlepage when undefined and defines description (CI session; its probes b3opt fr-abstract-1,
 *   fr-enumitem-1 and fr-description-1 have 0 errors, against 6 and 1 for the -0 cases without those lines), and the class
 *   has \abstractname (l.349): both refusals are lifted (b3q). enumitem allocates \labelindent itself (the class has none).
 */
export default defineClass({
  id: 'class.frontiers',
  name: "FrontiersinHarvard",
  targetEngine: "untested",
  preloads: [
    {"pkg": "inputenc", "options": ["utf8"]}, {"pkg": "crop", "options": ["a4", "off", "center", "info"]},
    {"pkg": "graphicx", "options": ["paper"]}, {"pkg": "amsmath"}, {"pkg": "array"}, {"pkg": "color"}, {"pkg": "amssymb"},
    {"pkg": "flushend"}, {"pkg": "stfloats"}, {"pkg": "amsthm"}, {"pkg": "chngpage"}, {"pkg": "times"}, {"pkg": "datetime"},
    {"pkg": "epstopdf"}, {"pkg": "parskip"}, {"pkg": "xcolor", "options": ["usenames", "dvipsnames"]},
    {"pkg": "caption", "options": ["labelsep=quad", "indention=10pt"]}, {"pkg": "subcaption", "options": ["labelfont=bf", "list=true"]},
    {"pkg": "natbib"},
  ],
  defines: ["counter:section", "counter:subsection", "counter:subsubsection", "counter:paragraph", "counter:subparagraph", "counter:figure", "counter:subfigure", "counter:table", "env:abstract", "env:description", "env:figure", "env:table", "env:thebibliography", "env:methods", "env:processtable", "env:unlist", "cmd:\\maketitle", "cmd:\\appendix", "cmd:\\frontmatter", "cmd:\\mainmatter", "cmd:\\backmatter", "cmd:\\subfigure", "cmd:\\helvetica", "cmd:\\helveticabold", "cmd:\\medline", "cmd:\\address", "cmd:\\history", "cmd:\\extraAuth", "cmd:\\correspondance", "cmd:\\vol", "cmd:\\issue", "cmd:\\firstpage"],
  options: {},
  forbids: {
    technical: [
      { pkg: "cite", reason: "FrontiersinHarvard.cls loads natbib (l.863), whose \\NAT@set@cites at \\begin{document} installs a two-optional \\@citex (natbib.sty 8.31b l.375, l.645-674); cite.sty redefines \\cite to call \\@citex with one optional argument (cite.sty v5.5 l.302-307), so citations scan on to the paragraph's end: 'Paragraph ended before \\@citex was complete' (as achemso, apa7 and oup-authoring-template, b2p probe)", evidence: [{ kind: 'source', file: 'FrontiersinHarvard.cls (v2.6 2016/11/10, testing-pipeline/settings/classes/files)', line: '863' }] },
      { pkg: "sectsty", reason: "FrontiersinHarvard is not article, report, book or a KOMA class (it loads no class, l.1-40), and sectsty stops at 'The sectsty package doesn't work with this document class' for any other (sectsty.sty l.278-295)", evidence: [{ kind: 'source', file: 'sectsty.sty (MiKTeX snapshot 9766)', line: '278-295' }, { kind: 'source', file: 'FrontiersinHarvard.cls', line: '1-40' }] },
    ],
    policy: [],
    // b29 (B3B-5): the host holds a class to a missing \tableofcontents only through this list (a profile's `defines` is read for
    // environments, \maketitle and sectioning counters alone), so without it General's contents and every toc way fitted here.
    names: [{ name: "cmd:\\tableofcontents", reason: "FrontiersinHarvard.cls defines no \\tableofcontents, \\l@section..\\l@paragraph or \\contentsname (it loads no class, l.1-40): General's contents stops at 'Command \\tableofcontents undefined' at \\begin{document}, tocloft at 'Command \\l@paragraph undefined' while it loads", evidence: [{ kind: 'source', file: 'testing-pipeline/settings/classes/files/FrontiersinHarvard.cls', line: '1-40' }, { kind: 'compile', cell: 'GitHub run b28-e9f730a, frontiers.A documents dde31eb1c8f49ec69d2e5 and d71ae77d5108a97c793fc (tocloft.sty l.651 \\renewcommand*{\\l@paragraph}; \\tableofcontents undefined at \\begin{document}): 89 branches as a document error, 74 with \\l@paragraph first' }] }],
  },
  layout: { columns: 2, textwidth: "504.0pt", fontsize: "12pt" },
  files: [
    { path: "FrontiersinHarvard.cls", sha256: "5d0653546d3adb8fbc21e57948e762636f2193c9bb11e22d25c3d7c334843fa6" },
    { path: "Frontiers-Harvard.bst", sha256: "f08f8fb7b5d5a7613416e5c1ba7979dd88356f785b0f292ee9dde95bc2c53cda" },
    { path: "logo1.eps", sha256: "317053e5132185d4ec4149bab9a437c1af29ef46240d1bab6ddaebc310a402b8" },
  ],
  vocabulary: {"\\firstAuthorLast": "the running-head author (e.g. Author et al.)", "\\Authors": "the author line with affiliation marks", "\\Address": "the affiliations", "\\corrAuthor": "the corresponding author", "\\corrEmail": "the corresponding author's e-mail", "\\keyFont": "the keyword font (the template's keywords are set with it after the abstract)"},
  evidence: [
    { kind: 'source', file: 'FrontiersinHarvard.cls (v2.6 2016/11/10, testing-pipeline/settings/classes/files)', line: '16-40 (options; inputenc, crop, graphicx, amsmath, array, color, amssymb, flushend, stfloats, amsthm, chngpage, times, datetime, epstopdf, parskip, xcolor, caption, subcaption)' },
    { kind: 'source', file: 'FrontiersinHarvard.cls', line: '52-53 (\\normalsize 12/12), 152 (\\textwidth 42pc), 171 (\\columnsep 1.5pc), 903 (\\twocolumn)' },
    { kind: 'source', file: 'FrontiersinHarvard.cls', line: '325-332 (counters), 395-414 (\\title, \\author, \\address...), 427-504 (\\maketitle, logo1.eps)' },
    { kind: 'source', file: 'FrontiersinHarvard.cls', line: '517 (abstract), 531-555 (\\section...), 583-587 (\\toprule, \\midrule, \\botrule), 596-640 (figure, table, subfigure float)' },
    { kind: 'source', file: 'FrontiersinHarvard.cls', line: '851 (thebibliography), 863 (natbib), 870 (\\appendix), 911 (methods), 937 (\\href), 939 (proof)' },
    { kind: 'source', file: 'testing-pipeline/settings/classes/frontiers.json (CI session, 2026-11-05)', line: 'preamble: \\@ifundefined{if@titlepage}{\\newif\\if@titlepage}{}; \\providecommand*\\descriptionlabel and \\newenvironment{description} when undefined' },
    { kind: 'compile', cell: 'CI probes C:/dev/template-ai/probes/b3opt: fr-abstract-0 6 errors, fr-abstract-1 0, fr-enumitem-0 1, fr-enumitem-1 0, fr-description-1 0' },
    { kind: 'source', file: 'subcaption.sty (2023/07/28 v1.6b, MiKTeX snapshot 9766)', line: '226-237 (sub types declared only for counters that exist when it loads)' },
  ],
});
