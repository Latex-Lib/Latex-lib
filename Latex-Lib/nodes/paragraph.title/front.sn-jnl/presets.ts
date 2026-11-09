/**
 * front.sn-jnl's preset: Springer Nature's one title block (sn-article.tex, the template every SN journal shares).
 */
import type { Preset } from '../../../schema/params.ts';

export const REQUIREMENT = 'Template/template-requirement/Springer_Nature_SN_Jnl.md';
export const TEMPLATE = 'template-lib-based-automation/Latex Related Research/Latex-Template-Examples/class.sn-jnl/main.tex';

export const PRESETS = {
  'sn-jnl': {
    description:
      "Springer Nature's title block: \\title[short]{full}, \\author*[n]{\\fnm{…} \\sur{…}}\\email{…} for the corresponding author and \\author[n] for the others (\\nomail without an e-mail), \\affil*[n]{\\orgdiv{…}, \\orgname{…}, \\orgaddress{…}}, \\keywords{…} and \\pacs[MSC Classification]{…}, then \\maketitle, which prints them with the stored abstract.",
    features: ['class-styled'],
    params: {},
    evidence: [
      { kind: 'requirement', file: REQUIREMENT, line: '45-49, 65, 132' },
      { kind: 'source', file: TEMPLATE, line: '63-86' },
    ],
  },
} as const satisfies { readonly [name: string]: Preset };
