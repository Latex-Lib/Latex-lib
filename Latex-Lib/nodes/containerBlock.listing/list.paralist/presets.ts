/**
 * list.paralist's presets, each from the templates that use it (`node seed.ts list --rows`).
 */
import type { Preset } from '../../../schema/params.ts';
import { manual, solution } from '../../evidence.ts';

export const PRESETS = {
  compact: {
    description: 'Compact lists without space between items: compactitem, compactenum, compactdesc.',
    features: ['compact'],
    params: {},
    evidence: [solution('0042-jankapunkt-master-thesis', '60'), solution('0409-mcmthesis', '56')],
  },
  inline: {
    description: "Items run into the paragraph, (a) … (b) …: paralist's inparaenum and inparaitem (descriptions stay compact).",
    features: ['inline-list', 'custom-labels'],
    params: { form: 'inline', label: '(a)' },
    evidence: [manual('paralist', 'the environments: inparaenum, inparaitem')],
  },
  'bold-labels': {
    description: 'Bold numbered labels (1), (a), (i) by level and margins fitted per level (\\setdefaultenum, \\setdefaultleftmargin).',
    features: ['compact', 'custom-labels', 'numbered'],
    params: { defaultEnum: '{\\bfseries (1)}{\\bfseries (a)}{\\bfseries (i)}{}', defaultMargins: '{1.87em}{1.7em}{1.5em}{1em}{1em}{1em}' },
    evidence: [solution('0738-jdujava-textured', '59')],
  },
  paragraphs: {
    description: 'Each item a paragraph of its own with a run-in label (asparaitem, asparaenum, asparadesc).',
    features: ['custom-labels'],
    params: { form: 'aspara' },
    evidence: [manual('paralist', 'the environments: asparaenum, asparaitem, asparadesc')],
  },
} as const satisfies { readonly [name: string]: Preset };
