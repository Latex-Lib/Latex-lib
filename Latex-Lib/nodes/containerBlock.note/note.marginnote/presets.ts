/**
 * note.marginnote's presets, each from the templates that use it (`node seed.ts note --rows`).
 */
import type { Preset } from '../../../schema/params.ts';
import { solution } from '../../evidence.ts';

export const PRESETS = {
  'small-sans': {
    description: 'A margin note that does not float, scriptsize sans-serif (\\renewcommand*{\\marginfont}{\\scriptsize\\sffamily}), beside its line.',
    features: ['margin-note', 'sans-serif', 'small-type'],
    params: { font: '\\scriptsize\\sffamily' },
    evidence: [solution('0583-rescience-c-article', '55'), solution('0160-cnltx', '51'), solution('0514-udesoftec', '78')],
  },
  'reversed-dates': {
    description: 'Notes in the left margin, \\reversemarginpar, as CVs set their dates beside each entry; no title.',
    features: ['margin-note'],
    params: { side: 'reverse', title: false },
    evidence: [solution('0222-sara-venkatraman-latex-templates', '80'), solution('0894-mdpi', '35')],
  },
  colored: {
    description: 'Small sans-serif notes in an accent colour, ragged (\\marginfont with \\color).',
    features: ['margin-note', 'sans-serif', 'small-type', 'colored'],
    params: { font: '\\small\\sffamily', color: 'teal' },
    evidence: [solution('0841-ijsra', '53'), solution('0257-polaris-aeterna-loom-notes', '69'), solution('0236-hu-berlin-bundle', '55')],
  },
  'italic-unadjusted': {
    description: 'Italic footnote-size notes not adjusted to the line\'s height or depth (noadjust).',
    features: ['margin-note', 'italic-body', 'small-type'],
    params: { font: '\\footnotesize\\itshape', adjust: 'noadjust', title: false },
    evidence: [solution('0164-coursework-term-paper', '50'), solution('0149-parsa', '54')],
  },
} as const satisfies { readonly [name: string]: Preset };
