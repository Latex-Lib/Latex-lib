/**
 * box.awesomebox's presets, each from the templates that use it (`node seed.ts box --rows`).
 */
import type { Preset } from '../../../schema/params.ts';
import { manual, solution } from '../../evidence.ts';

export const PRESETS = {
  'by-tone': {
    description: "An admonition block chosen by the note's tone: noteblock (info), tipblock (tip), warningblock (warning), each with its FontAwesome icon and a rule at its side.",
    features: ['icon', 'left-rule'],
    params: {},
    evidence: [solution('0474-quizztex', '40'), manual('awesomebox', '3.2 Environments')],
  },
  important: {
    description: 'Every note as an importantblock, the exclamation icon and a red rule.',
    features: ['icon', 'left-rule', 'colored'],
    params: { block: 'important' },
    evidence: [solution('0474-quizztex', '40')],
  },
  custom: {
    description: 'A block of its own (awesomeblock): a chosen icon and colour, a 2pt rule in the tone\'s colour, the title as the block\'s title with a short line under it.',
    features: ['icon', 'left-rule', 'colored', 'title-bar'],
    params: { block: 'custom', icon: '\\faLightbulb', ruleColor: 'tone', ruleWidth: '2pt', iconColor: 'tone', hrule: 'short' },
    evidence: [solution('0512-formation-latex-ul', '85'), manual('awesomebox', '5.2 Environments (awesomeblock)')],
  },
} as const satisfies { readonly [name: string]: Preset };
