import { defineClass } from '../schema/class.ts';
import { ctan } from '../schema/minimal.ts';

/**
 * The LIPIcs proceedings class: article underneath, its own theorem environments and list settings, which must not be overridden; times, enumitem, paralist, wrapfig and natbib are forbidden.
 * Read from its requirement document and source; measured by the class probe (lipics.A: loads, preloads, names it already defines, refused packages, layout).
 * Its theorem environments are the class's (line 60), read from its source (l.1125, l.1239-1255; proof redefined at l.1029, claimproof at l.1042).
 * Preloads beyond the probe's asked set are read from the source (threeparttable with online, l.589). xcolor is loaded only at \begin{document} and only if absent (l.548-553), so the probe's begindocument/end reading counted it; amsmath comes with tbtags and fleqn (l.562).
 * Its author count is \c@author, made with \newcount (l.762), which biblatex's \newcounter{author} (one counter per name list) stopped at; the class setting's preamble lets biblatex make the counter and copies the count into it (b21, GitHub run 41584963423: 11,260 lipics.A branches), so biblatex is not refused here.
 * enumerate is loaded by the class (l.567) but not listed: enumitem's package facts conflict with it, which would refuse every enumitem branch, though that conflict's failure needs enumerate to load after enumitem, and lipics loads it first.
 */
export default defineClass({
  id: 'class.lipics',
  name: "lipics-v2021",
  base: 'class.article',
  zerotex: "yes",
  preloads: [{"pkg": "lmodern"}, {"pkg": "amsmath", "options": ["tbtags", "fleqn"]}, {"pkg": "amssymb"}, {"pkg": "amsthm"}, {"pkg": "hyperref", "options": ["unicode"]}, {"pkg": "graphicx"}, {"pkg": "caption"}, {"pkg": "listings"}, {"pkg": "tabularx"}, {"pkg": "threeparttable", "options": ["online"]}, {"pkg":"rotating","options":["figuresright"]}, {"pkg":"subcaption"}, {"pkg":"multirow"}, {"pkg":"array"}, {"pkg":"babel"}, {"pkg":"microtype"}, {"pkg":"soul"}, {"pkg":"lineno","options":["left","mathlines"]}],
  defines: ["counter:part", "counter:section", "counter:subsection", "counter:subsubsection", "counter:paragraph", "counter:subparagraph", "env:abstract", "env:theorem", "env:lemma", "env:corollary", "env:proposition", "env:definition", "env:example", "env:remark", "env:exercise", "env:conjecture", "env:observation", "env:note", "env:claim", "env:claimproof", "env:proof", "env:figure", "env:table", "env:thebibliography", "cmd:\\maketitle", "cmd:\\tableofcontents", "cmd:\\appendix"],
  options: {},
  forbids: {
    technical: [],
    policy: [{ pkg: "times", reason: "LIPIcs: the checklist forbids times (no change of main font)", evidence: [{ kind: 'requirement', file: 'Template/template-requirement/LIPIcs.md', line: '33' }] }, { pkg: "enumitem", reason: "LIPIcs: the checklist forbids enumitem (keep the class list settings)", evidence: [{ kind: 'requirement', file: 'Template/template-requirement/LIPIcs.md', line: '33' }] }, { pkg: "paralist", reason: "LIPIcs: the checklist forbids paralist", evidence: [{ kind: 'requirement', file: 'Template/template-requirement/LIPIcs.md', line: '33' }] }, { pkg: "wrapfig", reason: "LIPIcs: the checklist says wrapfig is unsupported (no text wrapped around figures or tables)", evidence: [{ kind: 'requirement', file: 'Template/template-requirement/LIPIcs.md', line: '36' }] }, { pkg: "natbib", reason: "LIPIcs: the checklist says natbib is unsupported (plainurl, numeric, no author-year)", evidence: [{ kind: 'requirement', file: 'Template/template-requirement/LIPIcs.md', line: '36' }] }],
  },
  layout: { columns: 1, textwidth: "398.33858pt", fontsize: "10pt" },
  vocabulary: {},
  evidence: [{ kind: 'compile', cell: 'testing-pipeline/out/profiles/lipics.A.json' }, { kind: 'requirement', file: 'Template/template-requirement/LIPIcs.md', line: '33' }, { kind: 'requirement', file: 'Template/template-requirement/LIPIcs.md', line: '49' }, { kind: 'requirement', file: 'Template/template-requirement/LIPIcs.md', line: '54' }, { kind: 'requirement', file: 'Template/template-requirement/LIPIcs.md', line: '60' }, { kind: 'requirement', file: 'Template/template-requirement/LIPIcs.md', line: '73' }, { kind: 'requirement', file: 'Template/template-requirement/LIPIcs.md', line: '36' }, { kind: 'source', file: 'testing-pipeline/settings/classes/files/lipics-v2021.cls', line: '589' }, { kind: 'source', file: 'testing-pipeline/settings/classes/files/lipics-v2021.cls', line: '548-553, 562' }, { kind: 'source', file: 'testing-pipeline/settings/classes/files/lipics-v2021.cls', line: '512, 545, 561, 567, 579, 587, 597-598, 619-621, 724-727' }, { kind: 'source', file: 'testing-pipeline/settings/classes/files/lipics-v2021.cls', line: '1029, 1042, 1125, 1239-1255' }],
});
