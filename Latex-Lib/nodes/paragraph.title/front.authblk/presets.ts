/**
 * front.authblk's presets, each from the templates that use it (`node seed.ts front --rows`).
 */
import type { Preset } from '../../../schema/params.ts';
import { solution } from '../../evidence.ts';

export const PRESETS = {
  article: {
    description:
      'authblk under article: \\usepackage[max6]{authblk}, then one \\author[n]{…} per author with its affiliation numbers and one \\affil[n]{…} per affiliation (unnumbered when there is one), the date, and \\maketitle, which sets the affiliations in blocks under the authors.',
    writes: '\\title{…} \\author[1]{…} \\author[1,2]{…} \\affil[1]{…} \\affil[2]{…} \\date{…} \\maketitle',
    features: ['centered'],
    params: { authblk: 'max6' },
    evidence: [solution('0653-gerhardt-academic-paper', '44')],
  },
  ascelike: {
    description:
      "ascelike's authors (the class loads authblk itself): \\author[n]{…} and \\affil[n]{…}, each author's email after their first affiliation (\". Email: …\"), \\maketitle, and the keywords in the class's \\KeyWords{…; …} line right after the abstract.",
    writes: '\\title{…} \\author[1]{…} \\author[1,2]{…} \\affil[1]{…. Email: …} \\affil[2]{…} \\date{…} \\AddToHookNext{env/abstract/after}{\\KeyWords{…; …}} \\maketitle',
    features: ['class-styled'],
    params: { authblk: 'class', emails: 'in-affil', keywords: 'after-abstract' },
    evidence: [solution('0339-asce-style-engineering-manuscript', '35-37')],
  },
  'ascelike-name-tag': {
    description: "ascelike's authors as in the ascelike preset, with the paper's name tag in the page foot beside the page number (\\NameTag{…} in the preamble).",
    writes: '\\NameTag{…}; \\title{…} \\author[1]{…} \\author[1,2]{…} \\affil[1]{…. Email: …} \\affil[2]{…} \\date{…} \\AddToHookNext{env/abstract/after}{\\KeyWords{…; …}} \\maketitle',
    features: ['class-styled'],
    params: { authblk: 'class', emails: 'in-affil', keywords: 'after-abstract', nameTag: true },
    evidence: [solution('0339-asce-style-engineering-manuscript', '33-37')],
  },
} as const satisfies { readonly [name: string]: Preset };
