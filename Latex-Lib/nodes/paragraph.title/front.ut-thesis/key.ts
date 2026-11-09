import { defineKey } from '../../../schema/key.ts';
import { minimal } from '../../../schema/minimal.ts';
import { PRESETS } from './presets.ts';

const CLS = 'ut-thesis.cls (ut-thesis 2024/07/26 v3.1.8, MiKTeX snapshot 9766)';

export default defineKey({
  ...minimal({
    id: 'front.ut-thesis',
    node: 'paragraph/title',
    description:
      "The University of Toronto thesis class's SGS title page (ut-thesis): \\title, \\author, \\degree{…}, \\department[prefix]{graduate unit}, \\gradyear{…} and \\copyrighttext{…} declared in the preamble, so the class's abstract can print them too, then \\maketitle, a centred page of its own; no \\date.",
    // The class's own \department takes the unit after its default prefix, so the bracket stands only for another prefix.
    writes: '\\title{…} \\author{…} \\degree{…} \\department{…} \\gradyear{…} \\copyrighttext{…} \\maketitle',
    ctan: ['ut-thesis'],
    features: ['title-page', 'centered', 'class-styled'],
    params: {
      departmentPrefix: {
        type: 'string',
        default: 'Department of',
        description: "the words the title page and abstract print before the graduate unit (\\department's optional argument); the class's own 'Department of' writes no bracket, '' none at all",
      },
      degree: { type: 'string', default: '', description: "the degree (\\degree), a template constant under the paper's own templateSpecific.degree; '' leaves the class's placeholder" },
    },
    // The degree, the year and the copyright line change per thesis, so they are template fields; the graduate unit is the
    // first author's affiliation (its department, else its name).
    fields: ['affiliation.department', 'affiliation.name', 'templateSpecific.degree', 'templateSpecific.gradYear', 'templateSpecific.copyrightText'],
    presets: PRESETS,
    // It runs the class's own \maketitle, the SGS title page.
    claims: ['maketitle'],
    requires: ['cmd:\\degree', 'cmd:\\department', 'cmd:\\gradyear', 'cmd:\\copyrighttext', 'cmd:\\maketitle'],
    only: ['class.ut-thesis'],
    targetEngine: 'yes',
  }),
  evidence: [
    { kind: 'manual', of: 'ut-thesis', section: 'CTAN package page', url: 'https://ctan.org/pkg/ut-thesis' },
    { kind: 'source', file: CLS, line: '115-152 (\\maketitle, the SGS title page, and the abstract print \\@degree, \\@deptpre, \\@deptname, \\@gradyear)' },
    { kind: 'source', file: 'Latex Related Research/Latex-Template-Examples/class.ut-thesis/main.tex', line: '97-102' },
    {
      kind: 'compile',
      reproducer:
        "\\documentclass{ut-thesis}: \\meaning of \\degree, \\gradyear and \\copyrighttext is '#1->\\gdef \\@… {#1}'; \\maketitle prints {\\@degree}, {\\@deptpre} {\\@deptname}, {\\@copyrighttext} in a center environment; the abstract prints {\\@title}, {\\@author}, {\\@degree}, {\\@deptpre} {\\@deptname} and {\\@gradyear}; the defaults are the placeholders '(degree)', '(department)', '(gradyear)' (ZeroTeX-NG, 2026-11-07)",
    },
    {
      kind: 'compile',
      reproducer:
        "\\documentclass{ut-thesis} with \\title{On Engines} \\author{Ada Lovelace and Alan Turing} \\degree{…} \\department{Engines} \\gradyear{1843} \\copyrighttext{…} in the preamble, \\frontmatter \\maketitle and an abstract in the body; and with \\department[Graduate Department of]{Engines}: each typesets (ZeroTeX-NG through class-examples/typeset-dir.ts, 2026-11-07)",
    },
  ],
});
