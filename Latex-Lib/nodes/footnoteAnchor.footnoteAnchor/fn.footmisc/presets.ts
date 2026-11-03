/**
 * fn.footmisc's presets, each from the templates that use it (`node seed.ts fn --rows`).
 */
import type { Preset } from '../../../schema/params.ts';
import { solution } from '../../evidence.ts';

export const PRESETS = {
  'hang-flush': {
    description: 'Footnote marks hanging in the margin with the text flush to it (hang, flushmargin), footnotes kept at the page bottom under floats (bottom).',
    features: ['hanging', 'numbered'],
    params: { layout: 'hang-flushmargin', bottom: true },
    evidence: [solution('0016-rho-class-research-article', '71'), solution('0263-beamertheme-spectrum', '44'), solution('0217-osda', '52'), solution('0302-ludus-journal-article', '64')],
  },
  bottom: {
    description: 'Footnotes always at the very bottom of the page, below any float there (bottom).',
    features: ['numbered'],
    params: { bottom: true },
    evidence: [solution('0222-sara-venkatraman-latex-templates', '86'), solution('0366-simpletexcv', '52'), solution('0497-easychair', '66'), solution('0238-wiley-njd', '82')],
  },
  'per-page': {
    description: 'Footnote numbers restarting on every page (perpage), marks hanging (hang).',
    features: ['per-page', 'hanging', 'numbered'],
    params: { perpage: true, layout: 'hang' },
    evidence: [solution('0088-tinoryj-uestc-thesis-latex-template', '70'), solution('0250-ustc-thesis', '73'), solution('0149-parsa', '52')],
  },
  symbols: {
    description: 'Footnotes marked by symbols, doubled when they run out (symbol*), stable in moving arguments (stable).',
    features: ['symbols', 'hanging'],
    params: { symbols: 'symbol*', stable: true, layout: 'hang-flushmargin', bottom: true },
    evidence: [solution('0068-kaobook', '83'), solution('0231-tecosaur-bmc', '64')],
  },
  'no-rule': {
    description: 'No rule above the footnotes (norule).',
    features: ['numbered'],
    params: { rule: false },
    evidence: [solution('0102-invoice-cc0', '53')],
  },
  'hang-margin': {
    description: 'Hanging marks with a 1em margin for them (hang, \\footnotemargin 1em).',
    features: ['hanging', 'numbered'],
    params: { layout: 'hang', margin: '1em' },
    evidence: [solution('0279-musuos', '77'), solution('0077-gi-ev-lni', '63'), solution('0049-jstrieb-homework-template', '51')],
  },
  paragraph: {
    description: 'All the footnotes of a page run together into one paragraph (para).',
    features: ['paragraph-notes', 'numbered'],
    params: { layout: 'para' },
    evidence: [{ kind: 'manual', of: 'footmisc', section: 'the para option', url: 'https://ctan.org/pkg/footmisc' }],
  },
} as const satisfies { readonly [name: string]: Preset };
