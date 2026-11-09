/**
 * num.handset's presets, each from the template that uses it.
 */
import type { Preset } from '../../../schema/params.ts';

export const PRESETS = {
  minimal: {
    description: 'The minimal class\'s technical note: each appendix a hand-set bold heading a size larger, "Appendix A  Derivation Details", set off by a big skip above and a medium one below.',
    features: ['bold-head', 'lettered', 'appendix-prefix'],
    params: {},
    evidence: [{ kind: 'source', file: 'Latex Related Research/Latex-Template-Examples/class.minimal/main.tex', line: '34, 48, 255-257, 265-266' }],
  },
} as const satisfies { readonly [name: string]: Preset };
