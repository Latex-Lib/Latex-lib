/**
 * xref.cleveref's presets, each from the templates that use it (`node seed.ts xref --rows`) and the manual.
 */
import type { Preset } from '../../../schema/params.ts';
import { manual, solution } from '../../evidence.ts';

export const PRESETS = {
  cref: {
    description: "cleveref's \\cref{label}: the target's kind and number in words, abbreviated (fig. 2, eq. (3)).",
    features: ['named-refs', 'linked'],
    params: {},
    evidence: [solution('0016-rho-class-research-article', '56'), solution('0072-beamertheme-gotham', '78')],
  },
  capitalised: {
    description: 'The kinds capitalised everywhere, Figure 2 (the capitalise option).',
    features: ['named-refs', 'linked', 'capitalised'],
    params: { capitalise: true },
    evidence: [solution('0166-retosmatematicos', '74')],
  },
  'full-names-linked': {
    description: 'Names never abbreviated and part of the link (noabbrev, nameinlink).',
    features: ['named-refs', 'linked'],
    params: { noabbrev: true, nameInLink: true },
    evidence: [manual('cleveref', '7.2 Including names in hyperlink targets; 7.3 Abbreviations in cross-reference names')],
  },
} as const satisfies { readonly [name: string]: Preset };
