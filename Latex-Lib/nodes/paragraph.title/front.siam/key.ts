import { defineKey } from '../../../schema/key.ts';
import { minimal } from '../../../schema/minimal.ts';
import { PRESETS } from './presets.ts';

export default defineKey(
  minimal({
    id: 'front.siam',
    node: 'paragraph/title',
    description:
      "SIAM's title block (siamart): \\headers{short title}{running authors} in the preamble; \\title{…} with one \\thanks holding a note and \\funding{…}; \\author{…} joined by \\and, each author with one \\thanks giving their affiliation and the e-mails (\\email) of the authors there, and \\footnotemark[n] pointing at an affiliation an earlier author's note already gives, an \\orcid{…} per author; then the class's \\maketitle. The keywords and the MSC codes (or the older AMS subject classifications) follow the abstract in the class's keywords and MSCcodes (AMS) environments.",
    // Preamble; body; preamble (a hook that runs after the abstract).
    writes:
      '\\headers{…}{…} \\title{…\\thanks{…\\funding{…}}} \\author{…\\orcid{…}\\thanks{… (\\email{…}, \\email{…}).} \\and …\\footnotemark[…]} \\maketitle; \\AddToHookNext{env/abstract/after}{\\begin{keywords}…\\end{keywords}\\begin{MSCcodes}…\\end{MSCcodes}}',
    // siamart is SIAM's own class (Source/0186-siam-siamart), not on CTAN: the presets carry the evidence.
    ctan: [],
    features: ['class-styled', 'centered', 'uppercase'],
    params: {
      runningHeads: {
        type: 'enum',
        values: ['always', 'given', 'none'],
        default: 'always',
        description:
          "\\headers{short title}{running authors} in the preamble: always (templateSpecific.shortTitle and .runningAuthor, else the title and 'A, B, and C'; SIAM papers set it), only when either field is given, or never",
      },
      orcid: { type: 'enum', values: ['orcid', 'none'], default: 'orcid', description: "each author's ORCID as siamart's \\orcid{…} after the name (it records it and prints nothing), or none" },
      classification: {
        type: 'enum',
        values: ['MSCcodes', 'AMS', 'none'],
        default: 'MSCcodes',
        description:
          "templateSpecific.mscCodes after the abstract: in the MSCcodes environment (\"MSC codes\", SIAM's current form), in the AMS environment (\"AMS subject classifications\", the older form), or not printed",
      },
      keywords: { type: 'boolean', default: true, description: 'templateSpecific.keywords, comma-joined, in the keywords environment ("Key words") right after the abstract' },
    },
    fields: [
      'author.email',
      'author.orcid',
      'affiliation.name',
      'affiliation.department',
      'affiliation.address',
      'templateSpecific.shortTitle',
      'templateSpecific.runningAuthor',
      'templateSpecific.titleNote',
      'templateSpecific.funding',
      'templateSpecific.keywords',
      'templateSpecific.mscCodes',
    ],
    presets: PRESETS,
    // It runs the class's own \maketitle (siamart251216.cls l.474-496), which prints the \thanks notes with \fnsymbol marks.
    claims: ['maketitle'],
    // siamart251216.cls: \maketitle l.474, \email l.1365, \funding l.1158, \headers l.1588, \orcid l.821, keywords l.769,
    // MSCcodes l.771, AMS l.773.
    requires: ['cmd:\\maketitle', 'cmd:\\funding', 'cmd:\\email', 'cmd:\\orcid', 'cmd:\\headers', 'env:keywords'],
    requiresWhen: [
      { when: { classification: 'MSCcodes' }, requires: ['env:MSCcodes'] },
      { when: { classification: 'AMS' }, requires: ['env:AMS'] },
    ],
    only: ['class.siamart'],
    // Typeset ok on ZeroTeX-NG (2026-11-07), both presets under siamart251216 (nohypdvips, breakurl marked loaded, as the profile's
    // setup asks) on the title sample, on a fuller one (title note and funding, a third author sharing an affiliation, an author with
    // an e-mail and no affiliation, MSC codes) and on one with funding alone; a probe's \typeout in env/keywords/begin and
    // env/MSCcodes/begin showed both environments run right after the abstract.
    targetEngine: 'yes',
  }),
);
