/**
 * list.enumitem's presets, each from the templates that use it (`node seed.ts list --rows`).
 */
import type { Preset } from '../../../schema/params.ts';
import { solution } from '../../evidence.ts';

export const PRESETS = {
  'no-item-space': {
    description: 'Every list without space between items, set once for the document (\\setlist{noitemsep}).',
    features: ['compact'],
    params: { spacing: 'noitemsep', scope: 'document' },
    evidence: [solution('0053-zhanghai-zju-csse-undergraduate-design-l', '62')],
  },
  'cv-tight': {
    description: 'CV entry bullets: no space around the list, 0.8pt between items, a 2ex left margin ([leftmargin=2ex, nosep, itemsep=0.8pt]).',
    features: ['compact'],
    params: { spacing: 'nosep', itemsep: '0.8pt', leftmargin: '2ex' },
    evidence: [solution('0014-daniel-wambua-cv', '53')],
  },
  letters: {
    description: 'Numbered lists lettered a) b), indented by the paragraph indent, no extra space (\\setlist[enumerate,1]{label=\\alph*), labelindent=\\parindent, nosep}).',
    features: ['compact', 'custom-labels', 'lettered', 'numbered'],
    params: { enumLabel: '\\alph*)', labelindent: '\\parindent', spacing: 'nosep', scope: 'document' },
    evidence: [solution('0003-ucsmonograph', '69')],
  },
  'nextline-descriptions': {
    description: 'Description labels on a line of their own when too wide, the text indented 3.2cm ([leftmargin=3.2cm, style=nextline]).',
    features: ['aligned-labels'],
    params: { descriptionStyle: 'nextline', leftmargin: '3.2cm' },
    evidence: [solution('0017-hit-report', '41'), solution('0074-tlc-article', '70')],
  },
  'fitted-margin': {
    description: 'The left margin fitted to the widest label, 1pt between items ([leftmargin=*, itemsep=1pt]).',
    features: ['compact'],
    params: { leftmargin: '*', itemsep: '1pt' },
    evidence: [solution('0050-laboratory-notebook-daily-entry', '48')],
  },
  bullets: {
    description: 'First-level bullets set as $\\bullet$ for the document, deeper levels at a 6mm margin (\\setlist[itemize,1]{label=$\\bullet$}).',
    features: ['custom-labels'],
    params: { label: '$\\bullet$', leftmargin: '6mm', scope: 'document' },
    evidence: [solution('0037-hilbert', '63')],
  },
} as const satisfies { readonly [name: string]: Preset };
