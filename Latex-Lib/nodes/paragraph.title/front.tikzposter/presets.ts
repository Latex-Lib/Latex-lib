/**
 * front.tikzposter's presets, each from a poster that writes it.
 */
import type { Preset } from '../../../schema/params.ts';
import { manual } from '../../evidence.ts';

const SOURCE = 'Latex Related Research/Latex-lib-main/Source';

export const PRESETS = {
  plain: {
    description: "tikzposter's title box as the theme draws it: the title, the authors with their institutes' numbers, the institutes side by side and the e-mails under them.",
    features: ['class-styled', 'centered'],
    params: {},
    evidence: [
      { kind: 'source', file: `${SOURCE}/0436-jacobs-landscape-poster/main.tex`, line: '17-22 (\\title, \\author, \\institute, \\maketitle)' },
      { kind: 'source', file: `${SOURCE}/0429-ndpvt-web-latex-document-skill/assets/templates/poster.tex`, line: '105-117 (numbered institutes parted by \\quad, e-mails in \\texttt)' },
      manual('tikzposter', 'Title matter: \\title, \\author, \\institute, \\maketitle'),
    ],
  },
  'boxed-stacked': {
    description:
      'The title box set narrower than the poster with rounded corners and no frame line, extra space before the blocks, and the institutes one a line.',
    writes:
      '\\title{…} \\author{…\\textsuperscript{…}, \\underline{…}\\textsuperscript{…,…}} \\institute{\\textsuperscript{…}… \\\\ \\textsuperscript{…}… \\\\ \\texttt{…} \\quad \\texttt{…}} \\maketitle[width=…,titletoblockverticalspace=…,linewidth=…,roundedcorners=…]',
    features: ['class-styled', 'centered', 'rounded-corners'],
    params: { institutes: 'newline', width: '0.96\\linewidth', titletoblockverticalspace: '36pt', linewidth: '0', roundedcorners: '10' },
    evidence: [{ kind: 'source', file: `${SOURCE}/0368-sjijon-tex-templates/Tikzposter posters/Simple poster/simple-poster.tex`, line: '55-72 (\\underline presenting author, \\textsuperscript numbers, institutes one a line, \\maketitle[width=0.96\\linewidth,titletoblockverticalspace=36pt,linewidth=0,roundedcorners=10])' }],
  },
} as const satisfies { readonly [name: string]: Preset };
