/**
 * bib.natbib's presets, each from the templates that use it (`node seed.ts bib --rows`).
 */
import type { Preset } from '../../../schema/params.ts';
import { solution } from '../../evidence.ts';

export const PRESETS = {
  numbers: {
    description: 'natbib with numbered citations, \\usepackage[numbers]{natbib}, plainnat.',
    features: ['numeric-citations', 'external-tool'],
    params: {},
    evidence: [solution('0017-hit-report', '49')],
  },
  'square-compressed': {
    description: 'Numbers in square brackets, sorted and compressed to ranges, separated by commas ([square, numbers, comma, sort&compress]).',
    features: ['numeric-citations', 'sorted-compressed', 'external-tool'],
    params: { brackets: 'square', sort: 'sort&compress', separator: 'comma' },
    evidence: [solution('0083-ntu-thesis', '79'), solution('0031-nhatkhangcs-overleaf-comments', '85')],
  },
  'author-year': {
    description: 'Author and year citations in round brackets, natbib\'s own default (authoryear, round), plainnat.',
    features: ['author-year', 'external-tool'],
    params: { citeStyle: 'authoryear' },
    evidence: [solution('0094-nostarch', '46'), solution('0141-msu-thesis', '40'), solution('0031-nhatkhangcs-overleaf-comments', '89')],
  },
  'author-year-square': {
    description: 'Author and year in square brackets with abbreviated first names (square, authoryear; abbrvnat).',
    features: ['author-year', 'external-tool'],
    params: { citeStyle: 'authoryear', brackets: 'square', bst: 'abbrvnat' },
    evidence: [solution('0042-jankapunkt-master-thesis', '77')],
  },
  superscript: {
    description: 'Superscript numbers in the text (super), square brackets in the list.',
    features: ['numeric-citations', 'superscript', 'external-tool'],
    params: { citeStyle: 'super', brackets: 'square' },
    evidence: [solution('0005-cococo2000-ict-beamer', '41')],
  },
} as const satisfies { readonly [name: string]: Preset };
