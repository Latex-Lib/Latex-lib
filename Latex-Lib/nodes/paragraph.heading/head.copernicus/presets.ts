/**
 * head.copernicus's presets: the publisher's author kit (Solution/0195-copernicus.md).
 */
import type { Preset } from '../../../schema/params.ts';
import { solution } from '../../evidence.ts';

export const PRESETS = {
  copernicus: {
    description:
      "Copernicus journals' sections: an Introduction section as the class's \\introduction and a Conclusions section as \\conclusions (both \\section underneath, numbered, bold, ragged right at the text size); every other heading the class's own \\section, \\subsection, \\subsubsection.",
    features: ['class-styled', 'numbered', 'bold-head', 'hang-head'],
    params: {},
    evidence: [
      solution('0195-copernicus', '57'),
      solution('0195-copernicus', '58'),
      { kind: 'source', file: 'Latex Related Research/Latex-lib-main/Source/0195-copernicus/template.tex', line: '138, 154' },
    ],
  },
} as const satisfies { readonly [name: string]: Preset };
