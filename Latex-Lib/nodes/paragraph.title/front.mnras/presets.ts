/**
 * front.mnras's presets, from MNRAS's own template and the class: which authors' e-mails go in \thanks footnotes.
 */
import type { Preset } from '../../../schema/params.ts';

const TEMPLATE = 'Latex Related Research/Latex-Template-Examples/class.mnras/main.tex';
const CLS = 'mnras.cls (CTAN/MiKTeX package mnras, v3.2)';

export const PRESETS = {
  mnras: {
    description:
      "MNRAS's front matter as its template writes it: short title and short authors for the running heads, superscript affiliation numbers, the corresponding author's e-mail in a \\thanks footnote, the affiliations under the names, the publisher's date line, \\pubyear, \\pagerange and \\maketitle; the keywords joined by -- after the abstract; \\bsp at the end.",
    features: ['class-styled'],
    params: {},
    evidence: [
      { kind: 'source', file: TEMPLATE, line: '106-132 (\\title[short], \\author[short]{A,$^{1}$\\thanks{E-mail: …} … \\\\ $^{1}$…}, \\date, \\pubyear, \\label{firstpage}, \\pagerange, \\maketitle), 144-146 (keywords after the abstract), 333-334 (\\bsp, \\label{lastpage})' },
      { kind: 'source', file: CLS, line: '1055-1071 (\\maketitle; \\let\\thanks\\relax), 1122-1146 (keywords; \\endkeywords and \\nokeywords print \\@thanks), 1183-1199 (\\author[short], \\title[short], \\pubyear, \\pagerange), 1669 (\\bsp)' },
      { kind: 'requirement', file: 'Template/template-requirement/MNRAS.md', line: '44-49' },
    ],
  },
  'all-emails': {
    description: "MNRAS's front matter with every author's e-mail in its own \\thanks footnote.",
    features: ['class-styled'],
    params: { emails: 'all' },
    evidence: [{ kind: 'requirement', file: 'Template/template-requirement/MNRAS.md', line: '48 (e-mail addresses \"may be included as footnotes\")' }],
  },
  'no-emails': {
    description: "MNRAS's front matter with no e-mail footnotes: names with superscript affiliation numbers and the affiliations only.",
    writes:
      '\\title[…]{…} \\author[…]{…,$^{1}$ … and …$^{1,2}$ \\\\ $^{1}$… \\\\ $^{2}$…} \\date{…} \\pubyear{…} \\label{firstpage} \\pagerange{\\pageref{firstpage}--\\pageref{lastpage}} \\maketitle; \\AddToHookNext{env/abstract/after}{\\begin{keywords} … -- … \\end{keywords}} \\AtEndDocument{\\bsp\\label{lastpage}}',
    features: ['class-styled'],
    params: { emails: 'none' },
    evidence: [{ kind: 'requirement', file: 'Template/template-requirement/MNRAS.md', line: '48' }],
  },
} as const satisfies { readonly [name: string]: Preset };
