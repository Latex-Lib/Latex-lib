/**
 * fn.kernel's presets, each from the templates that use it (`node seed.ts fn --rows`).
 */
import type { Preset } from '../../../schema/params.ts';
import { solution } from '../../evidence.ts';

export const PRESETS = {
  arabic: {
    description: "The kernel's \\footnote{…} as Flouest's emitter writes it, numbered 1, 2, 3; nothing to load.",
    features: ['numbered'],
    params: {},
    evidence: [solution('0497-easychair', '66'), solution('0149-parsa', '52')],
  },
  symbols: {
    description: 'Footnotes marked by symbols, * † ‡ (\\renewcommand{\\thefootnote}{\\fnsymbol{footnote}}).',
    features: ['symbols'],
    params: { marks: 'symbols' },
    evidence: [solution('0231-tecosaur-bmc', '64'), solution('0238-wiley-njd', '82')],
  },
  'per-chapter': {
    description: 'Footnote numbers restarting with each chapter (\\counterwithin{footnote}{chapter}).',
    features: ['numbered', 'numbered-within'],
    params: { numberWithin: 'chapter' },
    evidence: [solution('0088-tinoryj-uestc-thesis-latex-template', '70')],
  },
} as const satisfies { readonly [name: string]: Preset };
