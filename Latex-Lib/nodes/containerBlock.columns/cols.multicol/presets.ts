/**
 * cols.multicol's presets, each from the templates that use it (`node seed.ts cols --rows`).
 */
import type { Preset } from '../../../schema/params.ts';
import { manual, solution } from '../../evidence.ts';

export const PRESETS = {
  balanced: {
    description: 'Columns in the text, balanced at the end, the gap from the node (\\begin{multicols}{2}, \\columnsep).',
    features: ['balanced-columns'],
    params: {},
    evidence: [solution('0120-blank-dotted-notebook-with-index', '47'), solution('0401-erfnzdeh-sharif-course-project-report-te', '50'), solution('0640-meowmeow-cheatsheet', '34')],
  },
  ragged: {
    description: 'Balanced columns whose bottoms may be ragged instead of stretched (\\raggedcolumns), as lists in columns want.',
    features: ['balanced-columns'],
    params: { ragged: true },
    evidence: [solution('0676-aidisclose', '44'), solution('0552-worcestersociety-homeworktemplate', '44')],
  },
  ruled: {
    description: 'A thin rule between the columns (\\columnseprule 0.4pt).',
    features: ['balanced-columns', 'column-rule'],
    params: { rule: '0.4pt' },
    evidence: [manual('multicol', 'the parameters \\columnsep and \\columnseprule')],
  },
  unbalanced: {
    description: 'Columns filled one after the other and not balanced at the end (multicols*).',
    features: [],
    params: { balance: false },
    evidence: [manual('multicol', 'the multicols* environment')],
  },
} as const satisfies { readonly [name: string]: Preset };
