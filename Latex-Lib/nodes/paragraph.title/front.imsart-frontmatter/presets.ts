/**
 * front.imsart-frontmatter's preset: the one IMS front matter, as aos-template.tex writes it.
 */
import type { Preset } from '../../../schema/params.ts';

export const PRESETS = {
  imsart: {
    description:
      'The IMS front matter: \\begin{frontmatter}, \\title and \\runtitle, the aug environment with \\author[A]{\\fnms{…}~\\snm{…}\\ead[label=e1]{…}\\orcid{…}} and one \\address[A]{\\orgdiv{…},\\orgname{…}\\printead{e1}} per author, the MSC2020 and keyword environments of \\kwd, then \\end{frontmatter}, which prints it.',
    features: ['class-styled'],
    params: {},
    evidence: [
      { kind: 'requirement', file: 'Template/template-requirement/IMS_Imsart.md', line: '58-60 (frontmatter holds abstract and keywords; one address per author; one ORCID), 74-75 (MSC2020 and keywords footnote), 141 (keywords and MSC2020 codes), 144 (\\runtitle, one address per author, \\orcid)' },
      { kind: 'source', file: 'Latex-Lib/classes/imsart.ts', line: '19-20 (\\maketitle becomes \\local@maketitle, which prints the front matter)' },
    ],
  },
} as const satisfies { readonly [name: string]: Preset };
