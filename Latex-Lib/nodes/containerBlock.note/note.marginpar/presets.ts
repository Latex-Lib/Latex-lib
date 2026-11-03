/**
 * note.marginpar's presets, each from the templates that use it (`node seed.ts note --rows`).
 */
import type { Preset } from '../../../schema/params.ts';
import { solution } from '../../evidence.ts';

export const PRESETS = {
  'ragged-small': {
    description: 'A margin note in the footnote size, ragged right, its title in bold above the text.',
    features: ['margin-note'],
    params: {},
    evidence: [solution('0020-koma-script', '72'), solution('0236-hu-berlin-bundle', '55')],
  },
  reversed: {
    description: 'Notes in the opposite margin, \\reversemarginpar (the left margin on one-sided pages), ragged against the text.',
    features: ['margin-note'],
    params: { side: 'reverse' },
    evidence: [solution('0222-sara-venkatraman-latex-templates', '80'), solution('0594-nwejm', '63')],
  },
  wide: {
    description: 'A wide margin column for notes, \\marginparwidth 50mm, scriptsize text with no title.',
    features: ['margin-note', 'small-type'],
    params: { width: '50mm', font: '\\scriptsize', title: false },
    evidence: [solution('0411-aanda', '80')],
  },
} as const satisfies { readonly [name: string]: Preset };
