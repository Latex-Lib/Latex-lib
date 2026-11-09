/**
 * front.spconf's presets: the ICASSP kit's author forms (one address, two addresses), the superscript form for more, and
 * the choice by the paper's own affiliation groups.
 */
import type { Preset } from '../../../schema/params.ts';

export const TEMPLATE = 'template-lib-based-automation/Latex Related Research/Latex-Template-Examples/class.icassp/main.tex';
export const PROFILE = 'template-lib-based-automation/Latex-Lib/classes/icassp.ts';

export const PRESETS = {
  icassp: {
    description:
      "ICASSP/ICIP (spconf) title block chosen by the paper's affiliation groups: one \\name and \\address for one group, the kit's \\twoauthors for two, superscript affiliation numbers for more; the keywords environment right after the abstract.",
    writes: '\\title{…} \\name{…\\thanks{…}} \\address{… \\\\ …} | \\twoauthors{…\\sthanks{…}}{… \\\\ …}{…}{… \\\\ …} \\AddToHook{env/abstract/after}{\\begin{keywords}…\\end{keywords}} \\maketitle',
    features: ['class-styled', 'centered'],
    params: {},
    evidence: [
      { kind: 'source', file: TEMPLATE, line: '65-86 (\\title, \\name with \\thanks, \\address; the \\twoauthors form), 90 (\\maketitle), 101-103 (keywords after the abstract)' },
      { kind: 'source', file: PROFILE, line: '3-41 (spconf\'s \\maketitle prints \\name and \\address; keywords is an environment)' },
    ],
  },
  'one-address': {
    description: 'ICASSP/ICIP (spconf) title block with every author in one \\name{…} and every affiliation in one \\address{…}, the kit\'s single-address form.',
    writes: '\\title{…} \\name{…, …\\thanks{…}} \\address{… \\\\ … \\\\ …} \\AddToHook{env/abstract/after}{\\begin{keywords}…\\end{keywords}} \\maketitle',
    features: ['class-styled', 'centered'],
    params: { groups: 'one' },
    evidence: [{ kind: 'source', file: TEMPLATE, line: '70-74 (Single address: \\name{Author(s) Name(s)\\thanks{…}} \\address{Author Affiliation(s)})' }],
  },
  'two-addresses': {
    description: "ICASSP/ICIP (spconf) title block with two side-by-side author groups, each with its own address (\\twoauthors, the funding note by \\sthanks).",
    writes: '\\title{…} \\twoauthors{…\\sthanks{…}}{… \\\\ … \\\\ …}{…}{… \\\\ … \\\\ …} \\AddToHook{env/abstract/after}{\\begin{keywords}…\\end{keywords}} \\maketitle',
    features: ['class-styled', 'centered'],
    params: { groups: 'two' },
    evidence: [{ kind: 'source', file: TEMPLATE, line: '76-86 (For two addresses: \\twoauthors{A. Author-one, B. Author-two\\sthanks{…}}{School A-B\\\\ Department A-B\\\\ Address A-B}{…}{…})' }],
  },
  superscript: {
    description: 'ICASSP/ICIP (spconf) title block with one \\name whose authors carry superscript affiliation numbers ($^{1}$, apart by \\qquad) and one \\address listing each affiliation after its number, for three or more addresses.',
    writes: '\\title{…} \\name{…$^{…}$ \\qquad …$^{…}$} \\address{$^{1}$… \\\\ $^{2}$…} \\AddToHook{env/abstract/after}{\\begin{keywords}…\\end{keywords}} \\maketitle',
    features: ['class-styled', 'centered', 'superscript'],
    params: { groups: 'superscript' },
    evidence: [{ kind: 'source', file: PROFILE, line: '26 (spconf defines \\name and \\address; no three-address command, so more addresses share one \\address)' }],
  },
  'with-emails': {
    description: "ICASSP/ICIP (spconf) title block chosen by the affiliation groups, with each group's e-mail addresses as the last line of its address.",
    writes: '\\title{…} \\name{…} \\address{… \\\\ … \\\\ …, …} | \\twoauthors{…}{… \\\\ …}{…}{… \\\\ …} \\AddToHook{env/abstract/after}{\\begin{keywords}…\\end{keywords}} \\maketitle',
    features: ['class-styled', 'centered'],
    params: { emails: 'address' },
    evidence: [{ kind: 'source', file: TEMPLATE, line: '74 (\\address{Author Affiliation(s)}: whatever the address holds is printed under the names)' }],
  },
} as const satisfies { readonly [name: string]: Preset };
