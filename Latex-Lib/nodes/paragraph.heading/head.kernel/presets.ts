/**
 * head.kernel's presets, each from the templates that use it (`node seed.ts head --rows`).
 */
import type { Preset } from '../../../schema/params.ts';
import { solution } from '../../evidence.ts';

export const PRESETS = {
  numbered: {
    description: "The class's sectioning commands as they are: numbered to the class's depth, the class's fonts and spacing.",
    features: ['numbered', 'bold-head', 'hang-head'],
    params: {},
    evidence: [solution('0015-malaysian-journal-of-mathematical-scienc', '42'), solution('0164-coursework-term-paper', '43'), solution('0188-elegantpaper', '53')],
  },
  unnumbered: {
    description: 'Nothing numbered: \\setcounter{secnumdepth}{0} (or below), every heading printed without its number but still in the contents.',
    features: ['unnumbered', 'bold-head', 'hang-head'],
    params: { numberDepth: 'none' },
    evidence: [solution('0046-classic-homework-template', '37'), solution('0278-bilingual-homework-template', '74')],
  },
  'to-subsection': {
    description: 'Numbered down to the subsection only (secnumdepth 2); deeper levels print without numbers.',
    features: ['numbered', 'bold-head', 'hang-head'],
    params: { numberDepth: 'subsection' },
    evidence: [solution('0070-ntgclass', '35')],
  },
  'roman-sections': {
    description: 'Sections numbered in capital Roman numerals, \\renewcommand{\\thesection}{\\Roman{section}} (I, II, III).',
    features: ['numbered', 'bold-head', 'hang-head'],
    params: { numberStyle: 'Roman' },
    evidence: [solution('0172-br-lex', '52'), solution('0169-open-source-uc-latex-templates', '64')],
  },
  'lettered-sections': {
    description: 'Sections lettered, \\renewcommand{\\thesection}{\\Alph{section}} (A, B, C).',
    features: ['numbered', 'lettered', 'bold-head', 'hang-head'],
    params: { numberStyle: 'Alph' },
    evidence: [solution('0470-anton-petrunin-birkhoff', '55'), solution('0723-amnestyreport', '57'), solution('0572-nihbiosketch', '39')],
  },
} as const satisfies { readonly [name: string]: Preset };
