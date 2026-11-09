/**
 * front.jmlr's presets: the jmlr class's author block under its pmlr option (the PMLR sample), and TMLR's (tmlr.sty on
 * article, the class.tmlr template). The volume, year and workshop are the template's own (doc ways), not the title's.
 */
import type { Preset } from '../../../schema/params.ts';
import { solution } from '../../evidence.ts';

const JMLR = 'Latex Related Research/Latex-lib-main/Source/0662-jmlr';
const TMLR = 'Latex Related Research/Latex-Template-Examples/class.tmlr/main.tex';

export const PRESETS = {
  'jmlr-pmlr': {
    description:
      "jmlr's title block (pmlr option): \\title[short]{…\\titletag{\\thanks{…}}}, \\author[short]{\\Name{…} \\Email{…} \\and \\Name{…} \\Email{…}\\\\ \\addr … \\AND …} and \\maketitle, the title centred in large bold, names bold, e-mails in small caps at the right, addresses in small italics; the keywords in the class's keywords environment after the abstract.",
    features: ['class-styled', 'centered'],
    params: {},
    evidence: [
      solution('0662-jmlr', '23, 40, 43'),
      { kind: 'source', file: `${JMLR}/pmlr-sample.tex`, line: '34-35 (\\title[Short Title]{…\\titletag{\\thanks{…}}}), 51-81 (\\author{\\Name \\Email \\and … \\\\ \\addr …}, \\AND), 86-93 (\\maketitle, abstract, keywords)' },
      { kind: 'source', file: 'Latex Related Research/Latex-Template-Examples/class.jmlr-pmlr/main.tex', line: '59-65 (\\title[Short Title], \\author{\\Name \\Email\\\\ \\addr … \\AND …}), 69-78 (\\maketitle, abstract, keywords)' },
    ],
  },
  tmlr: {
    description:
      "TMLR's title block (tmlr.sty): \\title{…} and \\author{\\name … \\email …\\\\ \\addr …\\\\ … \\AND …}, with no short forms, then the camera-ready \\def\\month, \\def\\year and \\def\\openreview and \\maketitle; no keywords.",
    writes: '\\title{…} \\author{\\name … \\email … \\\\ \\addr … \\AND …} \\def\\month{…} \\def\\year{…} \\def\\openreview{…} \\maketitle',
    features: ['class-styled', 'centered'],
    params: { form: 'tmlr', keywords: 'none' },
    evidence: [
      { kind: 'source', file: TMLR, line: '79-87 (\\title, \\author{\\name … \\email … \\\\ \\addr … \\AND …}), 92-94 (\\def\\month, \\def\\year, \\def\\openreview), 98 (\\maketitle)' },
      { kind: 'source', file: 'Latex-Lib/classes/tmlr.ts', line: '12-16, 36 (\\addr, \\email, \\name, \\AND defined by tmlr.sty l.98-102)' },
    ],
  },
} as const satisfies { readonly [name: string]: Preset };
