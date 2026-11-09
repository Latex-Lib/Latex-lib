/**
 * bib.tikzposter-block's presets: the sjijon tikzposter posters' reference blocks, portrait (one column of entries) and landscape
 * (four, in a multicols).
 */
import type { Preset } from '../../../schema/params.ts';
import { solution } from '../../evidence.ts';

const DIR = 'Latex Related Research/Latex-lib-main/Source/0368-sjijon-tex-templates/Tikzposter posters';

export const PRESETS = {
  tikzposter: {
    description:
      "A poster's references in a block of their own, its title left empty since natbib's list brings its References heading: \\block[titleleft,roundedcorners=16]{}{\\small …} with natbib [square,numbers] and unsrtnat, numbered in citation order.",
    writes: '\\block[titleleft,roundedcorners=16]{}{\\small \\nocite{*} \\bibliographystyle{unsrtnat} \\bibliography{\\jobname}}',
    features: ['numeric-citations', 'rounded-corners', 'small-type', 'external-tool'],
    params: { blockOptions: 'titleleft,roundedcorners=16' },
    evidence: [
      solution('0368-sjijon-tex-templates', '89, 95-96'),
      { kind: 'source', file: `${DIR}/Simple poster/simple-poster.tex`, line: '4 (\\usepackage[square,numbers]{natbib}), 222-228 (\\block[titleleft,roundedcorners=16]{}{\\small … \\nocite{*} \\bibliographystyle{unsrtnat} \\bibliography{BibPoster}})' },
    ],
  },
  'landscape-columns': {
    description:
      "A landscape poster's references spread over four columns inside their block: \\block[titleleft,roundedcorners=16]{}{\\small \\begin{multicols}{4} … \\end{multicols}}, natbib [square,numbers] and unsrtnat.",
    writes: '\\block[titleleft,roundedcorners=16]{}{\\small \\begin{multicols}{4} \\nocite{*} \\bibliographystyle{unsrtnat} \\bibliography{\\jobname} \\end{multicols}}',
    features: ['numeric-citations', 'rounded-corners', 'small-type', 'balanced-columns', 'external-tool'],
    params: { blockOptions: 'titleleft,roundedcorners=16', columns: '4' },
    evidence: [
      solution('0368-sjijon-tex-templates', '89, 99'),
      { kind: 'source', file: `${DIR}/Simple poster - Landscape/simple-poster-landscape.tex`, line: '4 (natbib [square,numbers]), 8 (multicol), 220-229 (the block, \\begin{multicols}{4})' },
    ],
  },
} as const satisfies { readonly [name: string]: Preset };
