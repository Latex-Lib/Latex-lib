/**
 * box.tikzposter's presets, each from the posters that use it.
 */
import type { Preset } from '../../../schema/params.ts';
import { solution } from '../../evidence.ts';

const SIMPLE_POSTER = 'Latex Related Research/Latex-lib-main/Source/0368-sjijon-tex-templates/Tikzposter posters/Simple poster/simple-poster.tex';

export const PRESETS = {
  block: {
    description: "A poster block in the theme's own style, the note's title in its title bar: \\block{title}{…}.",
    writes: '\\block{…}{…}',
    features: ['class-styled', 'title-bar'],
    params: {},
    evidence: [
      solution('0436-jacobs-landscape-poster', '25'),
      { kind: 'source', file: 'Latex Related Research/Latex-lib-main/Source/0436-jacobs-landscape-poster/main.tex', line: '28-96 (seven \\block{title}{body})' },
      { kind: 'source', file: 'Latex Related Research/Latex-lib-main/Source/0707-tu-delft-poster/main.tex', line: '52-145' },
    ],
  },
  'left-rounded': {
    description: 'A poster block with its title on the left and round corners: \\block[titleleft, roundedcorners=16]{title}{…}.',
    writes: '\\block[titleleft, roundedcorners=…]{…}{…}',
    features: ['class-styled', 'title-bar', 'rounded-corners'],
    params: { titleAlign: 'left', roundedCorners: '16' },
    evidence: [solution('0368-sjijon-tex-templates', '28'), { kind: 'source', file: SIMPLE_POSTER, line: '83, 222' }],
  },
  inner: {
    description: "A titled inner block inside a poster block, in the theme's inner-block style: \\innerblock{title}{…}.",
    writes: '\\noindent\\makebox[\\linewidth]{\\innerblock{…}{…}}',
    features: ['class-styled', 'title-bar'],
    params: { form: 'innerblock' },
    evidence: [{ kind: 'source', file: SIMPLE_POSTER, line: '128 (\\innerblock[…]{}{…})' }],
  },
  'tone-box': {
    description: "An untitled coloured box inside a block, its back at 15% of the note's tone colour and round corners, the title in bold on its first line: \\coloredbox[bgcolor=…, roundedcorners=5]{…}.",
    writes: '\\noindent\\makebox[\\linewidth]{\\colorlet{LatexLibNoteBg}{…}\\coloredbox[bgcolor=LatexLibNoteBg, roundedcorners=…]{{\\bfseries …\\par} …}}',
    features: ['background', 'rounded-corners', 'colored'],
    params: { form: 'coloredbox', bgColor: 'tone!15', roundedCorners: '5' },
    evidence: [{ kind: 'source', file: 'Latex Related Research/Latex-lib-main/Source/0429-ndpvt-web-latex-document-skill/assets/templates/poster.tex', line: '138-140 (\\coloredbox[bgcolor=amber!15, fgcolor=darktext, roundedcorners=5])' }],
  },
  callout: {
    description: "tikzposter's note, a tilted callout pinned to the block before it, 14cm wide, 3cm off and turned 15 degrees, the title in bold on its first line.",
    writes: '\\note[width=…, targetoffsetx=…, targetoffsety=…, rotate=…]{{\\bfseries …\\par} …}',
    features: ['class-styled', 'connector-line'],
    params: { form: 'callout', width: '14cm', targetOffsetX: '3cm', targetOffsetY: '3cm', rotate: '15' },
    evidence: [{ kind: 'source', file: SIMPLE_POSTER, line: '242-246 (\\note[width=14cm,targetoffsetx=3cm,targetoffsety=3cm,rotate=15])' }],
  },
} as const satisfies { readonly [name: string]: Preset };
