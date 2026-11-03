import { defineClass } from '../schema/class.ts';
import { ctan } from '../schema/minimal.ts';

/**
 * IOP Publishing's journal class: article underneath, no chapter, an abstract with a fixed heading. Its \title and \author typeset at once, so \maketitle (article's) is forbidden, titling's too, which only appends a copy of the title to \thetitle.
 * Read from its requirement document and source; measured by the class probe (iopjournal.A: loads, preloads, names it already defines, refused packages, layout).
 */
export default defineClass({
  id: 'class.iopjournal',
  name: "iopjournal",
  base: 'class.article',
  zerotex: "yes",
  preloads: [{"pkg": "fancyhdr"}, {"pkg": "xcolor"}, {"pkg": "graphicx"}, {"pkg": "hyperref", "options": ["colorlinks=true", "allcolors=blue"]}],
  defines: ["counter:part", "counter:section", "counter:subsection", "counter:subsubsection", "counter:paragraph", "counter:subparagraph", "env:abstract", "env:figure", "env:table", "env:thebibliography", "cmd:\\maketitle", "cmd:\\tableofcontents", "cmd:\\appendix"],
  options: {},
  forbids: {
    technical: [],
    policy: [],
    // titling does not redefine \title: it appends \protected@xdef\thetitle{#1} to the class's own (\appendiargdef, titling.sty
    // l.239-251), so iopjournal's \title still typesets at once and a preamble \title stopped at "Missing \begin{document}" with
    // titling too (GitHub run 41584963423, iopjournal.A: front.titling 0 of 5, F88 21 branches; e.g. dc6ad4929b03e0ad838b3 result
    // 9b3ac82c13ff, l.32). The exception for titling is gone (batch 1 round 2).
    names: [{ name: "cmd:\\maketitle", reason: "iopjournal.cls redefines \\title and \\author to typeset their text at once and never sets \\@title, so article's \\maketitle stops at 'No \\title given', and a \\title in the preamble typesets before \\begin{document} ('Missing \\begin{document}'), titling's included, which only appends a copy to \\thetitle (titling.sty l.239-251); IOP's template sets \\title and \\author in the body and calls no \\maketitle", evidence: [{ kind: 'source', file: 'titling.sty (titling 2009/09/04 v2.1d, MiKTeX snapshot 9766)', line: '239-251' }, { kind: 'compile', cell: 'GitHub run 41584963423 results/9b3ac82c13ff (iopjournal.A, dc6ad4929b03e0ad838b3: front.titling, Missing \\begin{document} at l.32)' },{ kind: 'source', file: 'testing-pipeline/settings/classes/files/iopjournal.cls', line: '98-106' }, { kind: 'source', file: 'Latex Related Research/Latex-lib-main/Source/0035-iop-journals/iopjournal-template.tex', line: '8-14' }] }],
  },
  layout: { columns: 1, textwidth: "435.32716pt", fontsize: "10pt" },
  vocabulary: {},
  evidence: [{ kind: 'compile', cell: 'testing-pipeline/out/profiles/iopjournal.A.json' }, { kind: 'requirement', file: 'Template/template-requirement/IOP_Journals.md', line: '35' }, { kind: 'requirement', file: 'Template/template-requirement/IOP_Journals.md', line: '41' }, { kind: 'requirement', file: 'Template/template-requirement/IOP_Journals.md', line: '42' }, { kind: 'source', file: 'testing-pipeline/settings/classes/files/iopjournal.cls', line: '33, 57' }, { kind: 'source', file: 'testing-pipeline/settings/classes/files/iopjournal.cls', line: '98-106' }],
});
