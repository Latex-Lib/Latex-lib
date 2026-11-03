/**
 * abs.kernel's presets, each from the templates that use it (`node seed.ts abs --rows`).
 */
import type { Preset } from '../../../schema/params.ts';
import { solution } from '../../evidence.ts';

export const PRESETS = {
  kernel: {
    description: "The class's abstract environment: a centred bold \"Abstract\" over an indented, small-type quotation (article, report).",
    features: ['small-type', 'indented', 'centered'],
    params: {},
    evidence: [solution('0070-ntgclass', '33'), solution('0093-foiltex', '38')],
  },
  renamed: {
    description: 'The abstract under a heading of its own (\\renewcommand{\\abstractname}{Executive Summary}).',
    features: ['small-type', 'indented', 'centered'],
    params: { name: 'Executive Summary' },
    evidence: [solution('0042-jankapunkt-master-thesis', '56')],
  },
  unindented: {
    description: 'The abstract without a first-line indent (\\noindent at its start, \\parindent 0pt).',
    features: ['small-type', 'centered'],
    params: { noindent: true },
    evidence: [solution('0041-fancyhandout', '44')],
  },
} as const satisfies { readonly [name: string]: Preset };
