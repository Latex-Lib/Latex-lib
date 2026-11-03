/**
 * toc.etoc's presets, each from the templates that use it (`node seed.ts toc --rows`) and the manual.
 */
import type { Preset } from '../../../schema/params.ts';
import { manual, solution } from '../../evidence.ts';

export const PRESETS = {
  full: {
    description: "The document's contents through etoc's \\tableofcontents.",
    features: [],
    params: {},
    evidence: [solution('0108-lix', '48'), solution('0523-cup-data-template', '73')],
  },
  local: {
    description: "Only the current section's or chapter's own entries, where the contents block stands (\\localtableofcontents).",
    features: ['local-contents'],
    params: { scope: 'local' },
    evidence: [manual('etoc', '\\localtableofcontents')],
  },
  'sections-only': {
    description: 'The next contents listed down to sections only (\\etocsetnexttocdepth{section}).',
    features: ['flat-contents'],
    params: { nextDepth: 'section' },
    evidence: [manual('etoc', '\\etocsetnexttocdepth')],
  },
} as const satisfies { readonly [name: string]: Preset };
