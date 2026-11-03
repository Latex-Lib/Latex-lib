/**
 * custom.raw's presets: raw LaTeX passes through as the author wrote it.
 */
import type { Preset } from '../../../schema/params.ts';

export const PRESETS = {
  raw: {
    description: 'Raw LaTeX the author wrote, passed through unchanged, with its preamble line when it has one.',
    features: [],
    params: {},
    evidence: [{ kind: 'manual', of: 'latex-base', section: 'CTAN package page', url: 'https://ctan.org/pkg/latex-base' }],
  },
} as const satisfies { readonly [name: string]: Preset };
