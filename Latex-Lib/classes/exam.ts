import { defineClass } from '../schema/class.ts';
import { ctan } from '../schema/minimal.ts';

/**
 * exam: article with questions, parts and choices; \part is a question's part, not a heading, so it is forbidden (forbids.names) while article's part counter stays.
 * Read from the research's Solution files and CTAN; measured by the class probe (exam.A: loads, preloads, names it already defines, refused packages, layout).
 */
export default defineClass({
  id: 'class.exam',
  name: "exam",
  base: 'class.article',
  targetEngine: "yes",
  preloads: [],
  defines: ["counter:part", "counter:section", "counter:subsection", "counter:subsubsection", "counter:paragraph", "counter:subparagraph", "env:abstract", "env:questions", "env:parts", "env:choices", "env:figure", "env:table", "env:thebibliography", "cmd:\\maketitle", "cmd:\\tableofcontents", "cmd:\\appendix", "cmd:\\firstpageheader", "cmd:\\gradetable", "cmd:\\pointtable", "cmd:\\addpoints", "env:solution", "env:solutionorbox", "env:solutionorlines", "env:solutionordottedlines", "cmd:\\runningheader", "cmd:\\printanswers"],
  options: {},
  forbids: {
    technical: [],
    policy: [],
    names: [{ name: "cmd:\\part", reason: "exam.cls redefines \\part as a part of a question (an item of its parts list), so a sectioning \\part is not available; article's part counter stays, so statements may be numbered within it", evidence: [{ kind: 'compile', cell: 'exam probe log, engine-cache 02860e6882f6… (exam 2023/07/09 v2.704 loads article: \\c@part=\\count273)' }, ctan('exam')] }],
  },
  layout: { columns: 1, textwidth: "469.755pt", fontsize: "10pt" },
  vocabulary: {},
  evidence: [{ kind: 'compile', cell: 'testing-pipeline/out/profiles/exam.A.json' }, { kind: 'solution', file: 'Solution/0355-sexam.md', lines: 'class' }, ctan('exam')],
});
