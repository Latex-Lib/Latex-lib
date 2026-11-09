/**
 * front.ijcai's presets: IJCAI's one title block, with the authors' e-mails or without them, as the kit's instructions allow
 * (FormattingGuidelines-IJCAI kit, ijcai26.tex; the anonymous submission replaces the names by hand, not by an option).
 */
import type { Preset } from '../../../schema/params.ts';
import { solution } from '../../evidence.ts';

const TEX = 'Latex Related Research/Latex-lib-main/Source/0319-ijcai/ijcai26.tex';
const STY = 'Latex Related Research/Latex-lib-main/Source/0319-ijcai/ijcai26.sty';

export const PRESETS = {
  ijcai: {
    description:
      "IJCAI's title block: \\title, then \\author with the authors joined by \\and and \\And, numbered $^{1,2}$ by affiliation, \\\\ after the last, \\affiliations with each numbered affiliation on its line ended by \\\\, \\emails with the authors' e-mails, then the style's \\maketitle across both columns.",
    features: ['class-styled', 'centered'],
    params: {},
    evidence: [
      solution('0319-ijcai', '23, 41-42'),
      { kind: 'source', file: TEX, line: '74-83 (single author: \\affiliations, \\emails), 86-103 (several: \\and, \\And, $^{2,3}$, \\\\), 107 (\\maketitle), 221-245 (the rules)' },
      { kind: 'source', file: STY, line: '99-168 (\\maketitle, \\@maketitle; \\and, \\And l.153-154; \\affiliations, \\emails l.155-164)' },
    ],
  },
  'no-emails': {
    description: "IJCAI's title block without the e-mail section, which the kit's instructions make optional: \\author with the authors and \\affiliations only.",
    writes: '\\title{…} \\author{…$^{…}$ \\and … \\And …\\\\ \\affiliations $^{…}$…\\\\ …} \\maketitle',
    features: ['class-styled', 'centered'],
    params: { emails: 'none' },
    evidence: [{ kind: 'source', file: TEX, line: '241-245 (the e-mail section is optional and can be omitted entirely)' }],
  },
} as const satisfies { readonly [name: string]: Preset };
