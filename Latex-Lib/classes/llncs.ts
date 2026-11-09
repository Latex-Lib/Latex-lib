import { defineClass } from '../schema/class.ts';

/**
 * llncs, as the class probe measured it (llncs.A: loads, preloads,
 * names it already defines, refused packages, layout), with what its
 * requirement document says it defines and forbids, the theorem-like
 * environments its source predefines (llncs.cls l.1153-1183), and the name
 * its source defines but refuses (`forbids.names`). Its counters include
 * article's part counter, which llncs's own \part numbers (llncs.cls v2.26
 * l.257-300, a page of its own; b22, owner item O-L7): without it the host
 * read llncs as lacking `part`, so no part heading was ever compiled under it.
 */
export default defineClass({
  id: 'class.llncs',
  name: "llncs",
  targetEngine: "yes",
  preloads: [{"pkg": "multicol"}],
  defines: ["counter:part", "counter:chapter", "counter:section", "counter:subsection", "counter:subsubsection", "counter:paragraph", "counter:subparagraph", "env:theorem", "env:lemma", "env:corollary", "env:definition", "env:proposition", "env:remark", "env:example", "env:property", "env:note", "env:conjecture", "env:claim", "env:proof", "env:case", "env:exercise", "env:problem", "env:question", "env:solution", "env:abstract", "env:figure", "env:table", "env:thebibliography", "cmd:\\maketitle", "cmd:\\tableofcontents", "cmd:\\appendix", "cmd:\\institute", "cmd:\\inst", "cmd:\\orcidID", "cmd:\\keywords", "cmd:\\subtitle", "env:credits", "cmd:\\ackname", "cmd:\\discintname", "cmd:\\spnewtheorem"],
  options: {},
  forbids: {
    technical: [{ pkg: "titlesec", reason: "its load test stops: Argument of \\subparagraph has an extra }.", evidence: [{ kind: 'compile', cell: 'testing-pipeline/out/profiles/llncs.A.json' }] }, { pkg: "amsthm", reason: "its load test stops: LaTeX Error: Command \\proof already defined. Or name \\end... illegal, see p.192 of the manual.", evidence: [{ kind: 'compile', cell: 'testing-pipeline/out/profiles/llncs.A.json' }] }],
    policy: [],
    names: [{ name: "cmd:\\subparagraph", unlessLoaded: ["sectsty"], reason: "llncs.cls replaces \\subparagraph with a warning whose body prints \\verb|\\subparagraph|: in a macro body the \\verb meets an already tokenized \\subparagraph, which runs again with the next | as its argument, so every call recurses until TeX's save size runs out (and the title is discarded anyway); the publisher's four levels stop at \\paragraph. sectsty redefines \\subparagraph as a working heading, so a branch whose own way loads sectsty keeps it", evidence: [{ kind: 'source', file: 'Latex Related Research/Latex-lib-main/Source/0712-llncs/llncs.cls', line: '375' }, { kind: 'requirement', file: 'Template/template-requirement/Springer_LNCS.md', line: '54' }, { kind: 'compile', cell: "16e73f76e178 (the copy's llncs.A run, document de8d2247b10ed83bc3626: 3,278 warnings, then TeX capacity exceeded [save size=200000]; all 71 llncs.A documents with the warning stopped there, 1,631 branches; 69 in llncs.B, 1,473)" }, { kind: 'compile', cell: 'llncs.A run: 52 documents load sectsty and none shows the LLNCS warning; head.sectsty subparagraph headings pass 56 of 61 (db38944429f6fec4fb539, d1bfe3ac99a4575ba5d35)' }] }],
  },
  layout: { columns: 1, textwidth: "347.12354pt", fontsize: "10pt" },
  vocabulary: {"\\institute": "affiliations", "\\keywords": "keywords", "\\orcidID": "an author's ORCID"},
  evidence: [{ kind: 'compile', cell: 'testing-pipeline/out/profiles/llncs.A.json' }, { kind: 'source', file: 'llncs.cls (llncs 2025/02/25 v2.26, MiKTeX snapshot 9766)', line: '257-300 (\\part, \\@part with \\refstepcounter{part}, \\@endpart)' }, { kind: 'requirement', file: 'Template/template-requirement/Springer_LNCS.md', line: '81' }, { kind: 'requirement', file: 'Template/template-requirement/Springer_LNCS.md', line: '79' }, { kind: 'source', file: 'Latex Related Research/Latex-lib-main/Source/0712-llncs/llncs.cls', line: '1153' }],
});
