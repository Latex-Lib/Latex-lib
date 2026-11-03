/**
 * list.enumerate-pkg's presets, each from the templates that use it (`node seed.ts list --rows`).
 */
import type { Preset } from '../../../schema/params.ts';
import { manual, solution } from '../../evidence.ts';

export const PRESETS = {
  'paren-letters': {
    description: 'Numbered lists lettered in parentheses, (a) (b) (c), from the label template [(a)].',
    features: ['numbered', 'custom-labels', 'lettered'],
    params: { label: '(a)' },
    evidence: [manual('enumerate', 'the label template'), solution('0552-worcestersociety-homeworktemplate', '45')],
  },
  'numbers-dot': {
    description: 'Arabic numbers with a dot, 1. 2. 3. ([1.]); nested lists 1.1 under it ([1.1]).',
    features: ['numbered', 'custom-labels'],
    params: { label: '1.' },
    evidence: [solution('0076-utlis-llls-depp-thesis-template', '43')],
  },
  roman: {
    description: 'Lower-case Roman numerals with a dot, i. ii. iii. ([i.]).',
    features: ['numbered', 'custom-labels'],
    params: { label: 'i.' },
    evidence: [manual('enumerate', 'the label template')],
  },
  prefixed: {
    description: 'A word before each letter, braced so the template keeps it, "State A:" ([{State} A:]).',
    features: ['numbered', 'custom-labels', 'lettered'],
    params: { label: '{State} A:' },
    evidence: [solution('0008-envlab', '42')],
  },
} as const satisfies { readonly [name: string]: Preset };
