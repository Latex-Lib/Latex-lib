/**
 * note.todonotes's presets, each from the templates that use it (`node seed.ts note --rows`).
 */
import type { Preset } from '../../../schema/params.ts';
import { solution } from '../../evidence.ts';

export const PRESETS = {
  review: {
    description: "A review note in the margin in todonotes' orange, tiny text, joined to its place by a line.",
    features: ['margin-note', 'connector-line', 'background', 'small-type'],
    params: { size: '\\tiny' },
    evidence: [solution('0461-icml', '77'), solution('0281-cs-techrep', '90')],
  },
  'red-alert': {
    description: 'A red note: red line and border, a light red background (\\todo[linecolor=red,backgroundcolor=red!25,bordercolor=red]).',
    features: ['margin-note', 'connector-line', 'background', 'colored'],
    params: { color: 'red!25', lineColor: 'red', borderColor: 'red', size: '\\scriptsize' },
    evidence: [solution('0281-cs-techrep', '90')],
  },
  'listed-green': {
    description: 'Green notes whose colour also marks their entry in \\listoftodos (colorinlistoftodos).',
    features: ['margin-note', 'connector-line', 'background', 'colored'],
    params: { color: 'green!40', colorInList: true, size: '\\scriptsize' },
    evidence: [solution('0740-gandalfsaxe-laursens-xelatex-thesis-temp', '74'), solution('0514-udesoftec', '79'), solution('0715-usp-ime-thesis-starter', '77')],
  },
  tag: {
    description: 'A bare margin tag: no line, no border, no background (\\todo[noline,backgroundcolor=none,bordercolor=none]).',
    features: ['margin-note'],
    params: { line: 'noline', color: 'none', borderColor: 'none' },
    evidence: [solution('0310-competences', '38'), solution('0943-rebuttal', '37')],
  },
  'fancy-shadow': {
    description: 'A white note with a drop shadow and a curved connecting line (fancyline, shadow).',
    features: ['margin-note', 'connector-line', 'shadow'],
    params: { color: 'white', line: 'fancyline', shadow: true },
    evidence: [solution('0475-alexpovel-latex-cookbook', '83'), solution('0720-dev-aditya-course-notes-core', '62')],
  },
} as const satisfies { readonly [name: string]: Preset };
