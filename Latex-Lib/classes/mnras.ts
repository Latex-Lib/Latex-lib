import { defineClass } from '../schema/class.ts';
import { ctan } from '../schema/minimal.ts';

/**
 * The Monthly Notices' class: geometry and hyperref loaded, four heading levels (\part, \chapter and \subparagraph are not to be used), an abstract environment with a fixed heading.
 * Read from its requirement document and source; measured by the class probe (mnras.A: loads, preloads, names it already defines, refused packages, layout).
 * mnras.cls is not built on article: it lacks \if@titlepage, \abstractname, \contentsname, \listfigurename, \listtablename, \appendixname, a global \@makecaption and \abovecaptionskip/\belowcaptionskip, allocates \bibhang (cls l.1641-1644, as natbib and biblatex do) and defines a fragile \cite and a non-\long \title; the class setting's preamble supplies or mends these (b21, GitHub run 41584963423), so the names are not listed here as defined and no package is refused for them.
 * usenatbib loads natbib (line 40); \part and \subparagraph exist but the guide says they should not be used (line 53), so the profile does not offer them.
 */
export default defineClass({
  id: 'class.mnras',
  name: "mnras",
  zerotex: "yes",
  preloads: [{"pkg": "hyperref"}, {"pkg": "geometry"}],
  defines: ["counter:section", "counter:subsection", "counter:subsubsection", "counter:paragraph", "env:proof", "env:keywords", "env:abstract", "env:figure", "env:table", "env:thebibliography", "cmd:\\maketitle", "cmd:\\tableofcontents", "cmd:\\appendix"],
  options: {},
  forbids: {
    technical: [{ pkg: "amsthm", reason: "its load test stops: LaTeX Error: Command \\proof already defined. Or name \\end... illegal, see p.192 of the manual.", evidence: [{ kind: 'compile', cell: 'testing-pipeline/out/profiles/mnras.A.json' }] }],
    policy: [],
  },
  layout: { columns: 2, textwidth: "508.0pt", fontsize: "9pt" },
  vocabulary: {},
  evidence: [{ kind: 'compile', cell: 'testing-pipeline/out/profiles/mnras.A.json' }, { kind: 'requirement', file: 'Template/template-requirement/MNRAS.md', line: '40' }, { kind: 'requirement', file: 'Template/template-requirement/MNRAS.md', line: '53' }, { kind: 'requirement', file: 'Template/template-requirement/MNRAS.md', line: '54' }, { kind: 'requirement', file: 'Template/template-requirement/MNRAS.md', line: '64' }, { kind: 'requirement', file: 'Template/template-requirement/MNRAS.md', line: '82' }, { kind: 'requirement', file: 'Template/template-requirement/MNRAS.md', line: '141' }],
});
