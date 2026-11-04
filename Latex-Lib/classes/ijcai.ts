import { defineClass } from '../schema/class.ts';

/**
 * IJCAI-27's style (class setting ijcai): plain article, the template's page size (\pdfpagewidth 8.5in, \pdfpageheight 11in)
 * and `\usepackage{ijcai27}` ('Conference Style, version of November 2018', a copy of ijcai22.sty, from
 * FormattingGuidelines-IJCAI-27.zip). Not measured by the class probe: every field is read from the pinned ijcai27.sty (b2p,
 * batch 2). It loads no package (the template's times is left to the document), so nothing clashes by options or refusals.
 * It sets two columns with \twocolumn (l.47), not a class option; text block 7.0in by 9.0in (l.52-54). It redefines \maketitle
 * (l.101-109, with \affiliations and \emails inside the title only), abstract (l.170), \section and \subsection (l.174-178,
 * secnumdepth 2) and carries the old named.sty (l.250-335): \cite, \shortcite, \citeauthor and \citeyear by \def, which
 * natbib's and cite's later definitions replace without error.
 */
export default defineClass({
  id: 'class.ijcai',
  name: "article",
  base: 'class.article',
  zerotex: "untested",
  preloads: [],
  defines: ["counter:part", "counter:section", "counter:subsection", "counter:subsubsection", "counter:paragraph", "counter:subparagraph", "env:abstract", "env:figure", "env:table", "env:thebibliography", "cmd:\\maketitle", "cmd:\\tableofcontents", "cmd:\\appendix", "cmd:\\shortcite", "cmd:\\pubnote"],
  options: {},
  forbids: {
    technical: [],
    policy: [],
  },
  layout: { columns: 2, textwidth: "505.88998pt", fontsize: "10pt" },
  vocabulary: {"\\affiliations": "affiliations, inside \\author", "\\emails": "e-mail addresses, inside \\author"},
  evidence: [
    { kind: 'source', file: 'testing-pipeline/settings/classes/files/ijcai27.sty (version of November 2018)', line: '47 (\\twocolumn), 52-54 (\\textheight 9.0in, \\textwidth 7.0in, \\columnsep 0.25in), 59 (\\pagestyle{empty}), 62 (\\pubnote)' },
    { kind: 'source', file: 'testing-pipeline/settings/classes/files/ijcai27.sty (version of November 2018)', line: '101-165 (\\maketitle, \\affiliations, \\emails), 170 (abstract), 174-182 (headings, secnumdepth 2), 286-288 (\\cite, \\shortcite)' },
  ],
});
