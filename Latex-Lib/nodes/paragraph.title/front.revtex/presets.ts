/**
 * front.revtex's presets, from REVTeX 4.2's APS and AIP samples and quantumarticle's class.
 */
import type { Preset } from '../../../schema/params.ts';
import { solution } from '../../evidence.ts';

export const REVTEX = 'Latex Related Research/Latex-lib-main/Source/0908-aip-conference-proceedings';
export const QUANTUM = 'quantumarticle.cls (quantumarticle 2022/11/08 v6.1, MiKTeX snapshot 9766)';

export const PRESETS = {
  aps: {
    description:
      "APS (revtex4-2): \\preprint, \\title[short]{…}, each author with \\email (the corresponding author's prefixed 'Corresponding author: '), one \\affiliation per institute after each run of authors, \\collaboration, \\date{\\today}, \\keywords and \\pacs; no \\maketitle, which the abstract way writes after the abstract, as revtex needs.",
    writes: '\\preprint{…} \\title[…]{…} \\thanks{…} \\author{…} \\email[…]{…} \\affiliation{…} \\collaboration{…} \\noaffiliation \\date{\\today} \\keywords{…} \\pacs{…}',
    features: ['class-styled', 'centered'],
    params: { form: 'revtex', maketitle: 'after-abstract', date: 'today', correspondingText: 'Corresponding author: ' },
    evidence: [
      { kind: 'source', file: `${REVTEX}/doc/latex/revtex/sample/aps/apstemplate.tex`, line: '35-79 (\\preprint, \\title, \\author, \\email, \\affiliation, \\collaboration, \\noaffiliation, \\date{\\today}, abstract, \\keywords, then \\maketitle)' },
      { kind: 'source', file: `${REVTEX}/tex/latex/revtex/revtex4-2.cls`, line: '2117-2240 (\\title, \\author, \\collaboration, \\affiliation, \\noaffiliation), 2404-2422 (\\email, \\thanks, \\altaffiliation), 2513-2537 (\\keywords, \\date, \\pacs, \\preprint)' },
    ],
  },
  aip: {
    description:
      "AIP (revtex4-2 under aip): the same block with the corresponding author's e-mail prefixed 'Author to whom correspondence should be addressed: ' and the keywords joined by semicolons; no \\maketitle, which the abstract way writes after the abstract.",
    writes: '\\preprint{…} \\title[…]{…} \\thanks{…} \\author{…} \\email[…]{…} \\affiliation{…} \\collaboration{…} \\noaffiliation \\date{\\today} \\keywords{…; …} \\pacs{…}',
    features: ['class-styled', 'centered'],
    params: { form: 'revtex', maketitle: 'after-abstract', date: 'today', correspondingText: 'Author to whom correspondence should be addressed: ', keywordSeparator: '; ' },
    evidence: [
      { kind: 'source', file: `${REVTEX}/doc/latex/revtex/sample/aip/aipsamp.tex`, line: '40-71 (\\preprint{AIP/123-QED}, \\title[…]{…}, \\email, \\affiliation, \\date{\\today}, \\keywords before \\maketitle)' },
      { kind: 'source', file: `${REVTEX}/doc/latex/revtex/auguide/auguide4-2.tex`, line: '642-645 (keywords separated by semicolons)' },
      solution('0908-aip-conference-proceedings', 'title block and keywords rows'),
    ],
  },
  'revtex-title-only': {
    description: 'REVTeX 4.2 for a paper with no abstract: the APS block with \\maketitle right after it.',
    features: ['class-styled', 'centered'],
    params: { form: 'revtex', maketitle: 'here', date: 'today', correspondingText: 'Corresponding author: ' },
    evidence: [{ kind: 'source', file: `${REVTEX}/tex/latex/revtex/revtex4-2.cls`, line: '2513-2537 (\\keywords and \\pacs stored for \\maketitle), 2548-2574 (an abstract is optional: \\absbox stays empty)' }],
  },
  quantum: {
    description:
      "quantumarticle: \\title, each author with \\orcid and \\email, one \\affiliation per institute after each run of authors, \\collaboration, the date only when the paper gives one (\\today stops the class), \\keywords, then \\maketitle.",
    writes: '\\title[…]{…} \\author{…} \\orcid{…} \\email{…} \\affiliation{…} \\collaboration{…} \\date{…} \\keywords{…} \\maketitle',
    features: ['class-styled'],
    params: { form: 'quantum', maketitle: 'here', date: 'given' },
    evidence: [
      { kind: 'source', file: QUANTUM, line: '216-221 (\\date{} default), 296-307 (\\today error), 1072-1110 (\\title, \\author), 1147-1182 (\\affiliation, \\collaboration), 1220-1231 (\\email, \\thanks, \\orcid), 1413-1414 (\\keywords)' },
      { kind: 'source', file: 'Latex Related Research/Latex-Template-Examples/class.quantumarticle/main.tex', line: '91-102' },
    ],
  },
} as const satisfies { readonly [name: string]: Preset };
