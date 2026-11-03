/**
 * bib.cite-pkg's presets, each from the templates that use it (`node seed.ts bib --rows`).
 */
import type { Preset } from '../../../schema/params.ts';
import { solution } from '../../evidence.ts';

export const PRESETS = {
  'sorted-compressed': {
    description: 'Numbered citations sorted and compressed to ranges, [1-3], with BibTeX\'s plain style.',
    features: ['numeric-citations', 'sorted-compressed', 'external-tool'],
    params: {},
    evidence: [solution('0524-doem97-ntu-eee-msc-dissertation-template', '76'), solution('0125-eurographics', '54')],
  },
  superscript: {
    description: 'Citations as superscript numbers in the text (the super option), as optics journals print them.',
    features: ['numeric-citations', 'superscript', 'sorted-compressed', 'external-tool'],
    params: { superscript: true },
    evidence: [solution('0758-osa', '39')],
  },
  'citation-order': {
    description: 'Numbered in citation order (unsrt) and left unsorted in the text (nosort), compressed.',
    features: ['numeric-citations', 'external-tool'],
    params: { sort: false, bst: 'unsrt' },
    evidence: [solution('0250-ustc-thesis', '87')],
  },
} as const satisfies { readonly [name: string]: Preset };
