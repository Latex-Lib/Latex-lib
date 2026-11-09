/**
 * front.spie's presets: SPIE's one title block, its keywords after the abstract as the template sets them, or under the
 * title for a paper with no abstract.
 */
import type { Preset } from '../../../schema/params.ts';

export const TEMPLATE = 'template-lib-based-automation/Latex Related Research/Latex-Template-Examples/class.spie/main.tex';

export const PRESETS = {
  spie: {
    description:
      "SPIE's title block: \\title, one \\author with each name's \\supit affiliation letters, \\skiplinehalf and the affiliations each after its letter, the \\authorinfo footnote with the correspondence and e-mails, then \\maketitle; the keywords (\\keywords) right after the abstract.",
    features: ['class-styled'],
    params: {},
    evidence: [
      { kind: 'source', file: TEMPLATE, line: '93-103 (\\title, \\author with \\supit and \\skiplinehalf, \\authorinfo), 109-119 (\\maketitle, abstract, \\keywords)' },
      { kind: 'requirement', file: 'Template/template-requirement/SPIE_Proceedings.md', line: '33-34' },
    ],
  },
  'keywords-after-title': {
    description: "SPIE's title block with the keywords printed under the title block, right after \\maketitle, for a paper with no abstract.",
    writes: '\\title{…} \\author{…\\supit{…}, and …\\supit{…} \\skiplinehalf \\supit{…}…; \\\\ \\supit{…}…} \\authorinfo{…} \\maketitle \\keywords{…}',
    features: ['class-styled'],
    params: { keywords: 'after-title' },
    evidence: [{ kind: 'source', file: 'spie.cls (spie 2007/04/14 v3.25, MiKTeX snapshot 9766)', line: '295 (\\keywords prints a bold "Keywords:" paragraph where it stands)' }],
  },
} as const satisfies { readonly [name: string]: Preset };
