/**
 * front.siam's presets, from SIAM's own template and class (Source/0186-siam-siamart, siamart251216.cls).
 */
import type { Preset } from '../../../schema/params.ts';

const SIAM = 'Latex Related Research/Latex-lib-main/Source/0186-siam-siamart';
const CLS = 'testing-pipeline/settings/classes/files/siamart251216.cls';

export const PRESETS = {
  msc: {
    description:
      "SIAM's current front matter: \\headers in the preamble, the title's \\thanks with \\funding, one \\thanks per author with the affiliation and e-mails, \\footnotemark for a shared one, \\maketitle, then the keywords and the MSC codes after the abstract.",
    features: ['class-styled', 'centered', 'uppercase'],
    params: {},
    evidence: [
      { kind: 'source', file: `${SIAM}/ex_shared.tex`, line: '31-43 (\\headers, \\title with \\thanks and \\funding, \\author with \\thanks, \\email and \\footnotemark[3])' },
      { kind: 'source', file: `${SIAM}/ex_article.tex`, line: '39-59 (\\maketitle, abstract, keywords, MSCcodes)' },
      { kind: 'source', file: CLS, line: '474-496 (\\maketitle), 576-596 (\\@ucnothanks, \\@doauth), 769-773 (keywords, MSCcodes, AMS), 1158 (\\funding), 1365 (\\email), 1588-1593 (\\headers)' },
    ],
  },
  ams: {
    description: "SIAM's older front matter: the same title block, with the classification in the AMS environment (\"AMS subject classifications\") after the keywords.",
    writes:
      '\\headers{…}{…} \\title{…\\thanks{…\\funding{…}}} \\author{…\\orcid{…}\\thanks{… (\\email{…}, \\email{…}).} \\and …\\footnotemark[…]} \\maketitle; \\AddToHookNext{env/abstract/after}{\\begin{keywords}…\\end{keywords}\\begin{AMS}…\\end{AMS}}',
    features: ['class-styled', 'centered', 'uppercase'],
    params: { classification: 'AMS' },
    evidence: [{ kind: 'source', file: CLS, line: '773 (\\newenvironment{AMS}), 1147 (\\AMSname: AMS subject classifications)' }],
  },
} as const satisfies { readonly [name: string]: Preset };
