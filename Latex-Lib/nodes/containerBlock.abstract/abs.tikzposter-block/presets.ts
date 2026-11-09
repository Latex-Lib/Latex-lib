/**
 * abs.tikzposter-block's presets, each from a poster that writes its blocks so.
 */
import type { Preset } from '../../../schema/params.ts';
import { manual } from '../../evidence.ts';

const SOURCE = 'Latex Related Research/Latex-lib-main/Source';

export const PRESETS = {
  tikzposter: {
    description: "The abstract as a poster block in the theme's look: the title bar reading Abstract, centred, over the block's body.",
    features: ['class-styled', 'title-bar'],
    params: {},
    evidence: [
      { kind: 'source', file: `${SOURCE}/0707-tu-delft-poster/main.tex`, line: '52 (\\block{Introduction}{…}, the first block of the first column)' },
      { kind: 'source', file: `${SOURCE}/0436-jacobs-landscape-poster/main.tex`, line: '28 (\\block{Motivation}{…})' },
      manual('tikzposter', 'Blocks: \\block[options]{title}{text}'),
      { kind: 'compile', reproducer: "\\documentclass[a0paper]{tikzposter}, front.tikzposter's title and \\maketitle, then \\begin{columns}\\column{0.5} and this preset's \\block{Abstract}{…} with two paragraphs: ok (ZeroTeX-NG, 2026-11-07); alone outside the columns, opening with a list: ok" },
    ],
  },
  'titleleft-rounded': {
    description: 'The abstract block with its title set flush left in the title bar and rounded corners, as a poster sets every block.',
    writes: '\\block[titleleft,roundedcorners=…]{Abstract}{…}',
    features: ['class-styled', 'title-bar', 'rounded-corners'],
    params: { titleleft: true, roundedcorners: '16' },
    evidence: [{ kind: 'source', file: `${SOURCE}/0368-sjijon-tex-templates/Tikzposter posters/Simple poster/simple-poster.tex`, line: '83 (\\block[titleleft,roundedcorners=16]{Introduction}{…}; CR line ends)' },
      { kind: 'compile', reproducer: "as the tikzposter preset, with \\block[titleleft,roundedcorners=16,linewidth=0pt]{Abstract}{…}: ok (ZeroTeX-NG, 2026-11-07); linewidth=0 with no unit stops at 'Illegal unit of measure'" },
    ],
  },
} as const satisfies { readonly [name: string]: Preset };
