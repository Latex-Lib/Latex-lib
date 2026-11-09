/**
 * front.achemso's preset: achemso's own demonstration (achemso-demo.tex l.30-93).
 */
import type { Preset } from '../../../schema/params.ts';
import { solution } from '../../evidence.ts';

export const PRESETS = {
  achemso: {
    description:
      "achemso's title block in the preamble: one \\author each, \\email (with \\phone and \\fax) for the corresponding author, \\affiliation[short]{…} and \\alsoaffiliation[short]{…}, \\title[short]{…}, \\abbreviations and \\keywords; the class runs \\maketitle at \\begin{document}.",
    features: ['class-styled', 'centered'],
    params: {},
    evidence: [
      { kind: 'source', file: 'Latex Related Research/Latex-lib-main/Source/0528-achemso/achemso-demo.tex', line: '30-93 (five \\author groups with \\email, \\phone, \\fax, \\affiliation[short]{…}, \\alsoaffiliation[short]{…}; \\title[short]{…}; \\abbreviations; \\keywords; "The manuscript does not need to include \\maketitle", all before \\begin{document})' },
      { kind: 'source', file: 'Latex Related Research/Latex-lib-main/Source/0528-achemso/achemso.dtx', line: '781-788 (\\title[short]), 822-832 (\\author), 839-850 (\\and, \\thanks only warn), 860-880 (\\affiliation, duplicates dropped), 954 (\\alsoaffiliation), 1061-1093 (\\email, \\fax, \\phone), 1104-1113 (\\abbreviations, \\keywords), all \\@onlypreamble; 1823 (\\g@addto@macro{\\document}{\\maketitle})' },
      solution('0528-achemso', '23, 35-38'),
    ],
  },
} as const satisfies { readonly [name: string]: Preset };
