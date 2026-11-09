/**
 * front.jss's preset: the Journal of Statistical Software's own class and review templates (Source/0623-jss).
 */
import type { Preset } from '../../../schema/params.ts';

const JSS = 'Latex Related Research/Latex-lib-main/Source/0623-jss';

export const PRESETS = {
  jss: {
    description:
      "JSS's title block, all in the preamble: \\author with one \"name\\\\affiliation\" cell per author joined by \\And (a new row after three, \\AND), \\Plainauthor, \\title (a note as its \\thanks), \\Plaintitle, \\Shorttitle, \\Keywords and \\Plainkeywords, \\Address with each author's department, institution, address and e-mail, and the masthead values; the class runs \\maketitle at \\begin{document}.",
    features: ['class-styled', 'centered'],
    params: {},
    evidence: [
      { kind: 'source', file: `${JSS}/jss.cls`, line: '81-94 (\\Address, \\Plaintitle, \\Shorttitle, \\Plainauthor, \\Volume, \\Year, \\Month, \\Issue, \\Submitdate, \\Acceptdate, \\Keywords, \\Plainkeywords), 117-161, 197 (their placeholder defaults)' },
      { kind: 'source', file: `${JSS}/jss.cls`, line: '216-251 (\\makefooter prints \\@Address and the volume, issue, dates and DOI at \\AtEndDocument), 257-266 (masthead)' },
      { kind: 'source', file: `${JSS}/jss.cls`, line: '298-359 (\\maketitle, \\@maketitle: \\And and \\AND cells l.340-345, the abstract, the Keywords line l.355), 325 (\\let\\maketitle\\relax), 451-466 (pdfauthor, pdftitle, pdfkeywords from the Plain fields), 471 (\\maketitle at begindocument/end)' },
      { kind: 'source', file: `${JSS}/softwarereview.tex`, line: '30 (\\Address{…} in the preamble)' },
    ],
  },
} as const satisfies { readonly [name: string]: Preset };
