import { defineClass } from '../schema/class.ts';

/**
 * scrartcl, as the class probe measured it (scrartcl.A: loads, preloads,
 * names it already defines, refused packages, layout), with what its
 * requirement document says it defines and forbids.
 */
export default defineClass({
  id: 'class.scrartcl',
  name: "scrartcl",
  zerotex: "yes",
  preloads: [],
  defines: ["counter:part", "counter:section", "counter:subsection", "counter:subsubsection", "counter:paragraph", "counter:subparagraph", "env:abstract", "env:figure", "env:table", "env:thebibliography", "cmd:\\maketitle", "cmd:\\tableofcontents", "cmd:\\appendix"],
  options: {},
  forbids: {
    // As under scrreprt: this keeps out General's titlesec ways (head.titlesec denies KOMA in its key), whose grouped heading leaves every other one with no format.
    technical: [{ pkg: "titlesec", reason: "KOMA-Script declares its headings with \\DeclareSectionCommand, not \\@startsection: titlesec warns \"Non standard sectioning command \\section detected. Using default spacing and no format\" and every heading at a level no \\titleformat set stops at \"Package titlesec Error: No format for this command\"; the class warns \"Usage of package `titlesec' together with a KOMA-Script class is not recommended\". General's titlesec ways format only their own heading, inside a group, so every other heading of the document stops", evidence: [
      { kind: 'compile', cell: "eb6ba84fe220 (the copy's scrartcl.A run: KOMA's warning at log line 402, titlesec's at 427, \"No format for this command\" at l.32, a \\section after \\appendix)" },
      { kind: 'compile', cell: "48f472d1ce73 (the copy's scrartcl.A run: of the 1,583 branches holding one of General's titlesec ways, 10 pass, all heading looks; the appendix's inlineTitle passes none of its 1,250, its label's \\appendixname being undefined under scrartcl, l.874 here; the other branches of those 145 documents stop at \"No format for this command\" 684 times in 2,816, against 0 under article.A)" },
    ] }],
    policy: [],
  },
  layout: { columns: 1, textwidth: "418.25555pt", fontsize: "10.95pt" },
  vocabulary: {},
  evidence: [{ kind: 'compile', cell: 'testing-pipeline/out/profiles/scrartcl.A.json' }, { kind: 'requirement', file: 'Template/template-requirement/KOMA_Scrartcl.md', line: '105' }],
});
