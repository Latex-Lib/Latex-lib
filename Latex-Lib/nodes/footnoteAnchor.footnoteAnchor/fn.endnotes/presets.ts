/**
 * fn.endnotes's presets, each from the templates that use it (`node seed.ts fn --rows`).
 */
import type { Preset } from '../../../schema/params.ts';
import { manual } from '../../evidence.ts';

export const PRESETS = {
  'at-end': {
    description: 'Every footnote becomes an endnote (\\let\\footnote=\\endnote), all printed at the end of the document (\\theendnotes) under "Notes".',
    features: ['endnotes', 'numbered'],
    params: {},
    evidence: [manual('endnotes', 'usage: \\let\\footnote=\\endnote, \\theendnotes')],
  },
  'small-named': {
    description: 'The endnotes in a smaller size (\\enotesize) under a heading of their own (\\notesname).',
    features: ['endnotes', 'numbered', 'small-type'],
    params: { size: '\\small', heading: 'Endnotes' },
    evidence: [manual('endnotes', 'usage: \\enotesize, \\notesname')],
  },
} as const satisfies { readonly [name: string]: Preset };
