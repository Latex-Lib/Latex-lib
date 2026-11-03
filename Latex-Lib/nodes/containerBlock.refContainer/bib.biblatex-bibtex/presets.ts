/**
 * bib.biblatex-bibtex's presets, each from the templates that use it (`node seed.ts bib --rows`).
 */
import type { Preset } from '../../../schema/params.ts';
import { solution } from '../../evidence.ts';

export const PRESETS = {
  'node-style': {
    description: 'biblatex in the style the node asks for (data.referenceStyling, numeric by default), \addbibresource, \printbibliography.',
    features: ['numeric-citations', 'external-tool'],
    params: {},
    evidence: [solution('0642-elegantnote', '41')],
  },
  'author-year': {
    description: 'Author and year citations sorted by year, then name (style=authoryear, sorting=ynt).',
    features: ['author-year', 'external-tool'],
    params: { style: 'authoryear', sorting: 'ynt' },
    evidence: [solution('0700-lectures', '73')],
  },
  alphabetic: {
    description: 'Alphabetic labels, given names as initials, at most six names in the list, back references to the citing pages (style=alphabetic, giveninits, maxbibnames=6, backref).',
    features: ['external-tool'],
    params: { style: 'alphabetic', giveninits: true, maxnames: 6, backref: true },
    evidence: [solution('0547-dfgproposal', '73')],
  },
  'ieee-newest': {
    description: 'IEEE style (biblatex-ieee), newest first (style=ieee, sorting=ydnt), the list under its own heading.',
    features: ['numeric-citations', 'external-tool'],
    params: { style: 'ieee', sorting: 'ydnt', heading: 'Publications' },
    evidence: [solution('0153-komacv', '57')],
  },
  'citation-order': {
    description: 'Numbered in citation order, compressed ranges (style=numeric-comp, sorting=none).',
    features: ['numeric-citations', 'sorted-compressed', 'external-tool'],
    params: { style: 'numeric-comp', sorting: 'none' },
    evidence: [solution('0064-korogodin-nslreport', '77')],
  },
} as const satisfies { readonly [name: string]: Preset };
