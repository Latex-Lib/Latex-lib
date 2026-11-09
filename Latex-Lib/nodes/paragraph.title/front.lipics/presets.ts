/**
 * front.lipics's presets: the LIPIcs series' one title block (lipics-v2021). Line numbering (\nolinenumbers), the hidden
 * series logo (\hideLIPIcs), anonymous review and the editors' event macros are the template's own document-level switches,
 * not the title's.
 */
import type { Preset } from '../../../schema/params.ts';

const EXAMPLE = 'Latex Related Research/Latex-Template-Examples/class.lipics/main.tex';

export const PRESETS = {
  lipics: {
    description:
      "LIPIcs's title block: \\title, \\titlerunning, one five-argument \\author{name}{affiliations joined by \\and}{email}{ORCID URL}{funding} per author, \\authorrunning, \\Copyright, \\ccsdesc[500]{General~Specific}, comma-separated \\keywords, and \\category, \\relatedversion, \\supplement, \\funding and \\ArticleNo when given, in the preamble; the class's \\maketitle where the title stands.",
    features: ['class-styled'],
    params: {},
    evidence: [
      { kind: 'requirement', file: 'Template/template-requirement/LIPIcs.md', line: '41-44 (title, running title, one \\author per author with affiliation, email, ORCID and funding, author running head, Copyright, ACM classification, keywords, related version), 53 (printed at the end of the abstract), 89 (optional fields)' },
      { kind: 'source', file: EXAMPLE, line: '56-75 (\\title … \\funding), 92 (\\ArticleNo), 96 (\\maketitle)' },
    ],
  },
} as const satisfies { readonly [name: string]: Preset };
