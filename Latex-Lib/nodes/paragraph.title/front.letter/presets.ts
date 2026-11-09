/**
 * front.letter's presets, each from the letters on the kernel letter class that use it.
 */
import type { Preset } from '../../../schema/params.ts';
import { solution } from '../../evidence.ts';

export const PRESETS = {
  letter: {
    description: "The kernel letter's frame: the sender and the date in the preamble, \\begin{letter}{recipient} and \\opening{Dear Sir or Madam,} at the title, \\closing{Yours sincerely,} with \\ps, \\encl and \\cc at the end; the title's text is not printed.",
    features: ['class-styled'],
    params: { salutation: 'Dear Sir or Madam,', closing: 'Yours sincerely,' },
    evidence: [solution('0366-simpletexcv', '48'), solution('0678-tj-csccg-tongji-recommendation-template', '23')],
  },
  'subject-before-opening': {
    description: "The kernel letter's frame with the title's text in bold between the recipient and \\opening, as a cover letter's heading.",
    writes:
      '\\name{…} \\signature{…} \\address{… \\\\ …} \\location{…} \\telephone{…} \\date{…} \\AtEndDocument{\\closing{…} \\ps{…} \\encl{…} \\cc{…} \\end{letter}}; \\begin{letter}{… \\\\ …} {\\bfseries …\\par} \\opening{…}',
    features: ['class-styled', 'subject-line', 'bold-head'],
    params: { subject: 'before-opening', salutation: 'Dear Sir or Madam,', closing: 'Yours sincerely,' },
    evidence: [solution('0366-simpletexcv', '48')],
  },
} as const satisfies { readonly [name: string]: Preset };
