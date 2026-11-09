/**
 * front.elsarticle-frontmatter's preset: the one elsarticle front matter, the same under every elsarticle format (preprint,
 * 3p, 5p share elsarticle.cls; class.elsarticle-3p takes class.elsarticle's rules through its base).
 */
import type { Preset } from '../../../schema/params.ts';

const DTX = 'Latex Related Research/Latex-lib-main/Source/0107-elsarticle/elsarticle.dtx';

export const PRESETS = {
  elsarticle: {
    description:
      "elsarticle's front matter: \\begin{frontmatter}, \\title with a \\tnoteref title note, keyed \\author[labels]{name\\corref{cor1}} each with its \\ead, \\cortext, keyed \\affiliation[label]{organization=…, addressline=…}, the graphical abstract and highlights, the keyword box with \\sep, \\PACS, \\MSC and \\JEL, then \\end{frontmatter}, which runs \\maketitle.",
    features: ['class-styled'],
    params: {},
    evidence: [
      { kind: 'source', file: 'Latex Related Research/Latex-lib-main/Source/0107-elsarticle/elsarticle-template-num.tex', line: '56-139' },
      { kind: 'source', file: DTX, line: '190-194 (\\title), 216-222 (\\tnoteref, \\tnotetext), 252-261 (\\cortext, \\corref), 275-285 (\\ead), 318-345 (\\author), 516-531, 707-718 (\\affiliation), 753-808 (highlights, graphicalabstract), 810-826 (keyword, \\sep, \\MSC, \\PACS, \\JEL), 885-886 (\\maketitle prints the keyword box), 1430 (frontmatter runs \\maketitle)' },
      { kind: 'source', file: 'Latex Related Research/Latex-Template-Examples/class.elsarticle-3p/main.tex', line: '81-124' },
    ],
  },
} as const satisfies { readonly [name: string]: Preset };
