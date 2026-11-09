import { defineKey } from '../../../schema/key.ts';
import { minimal } from '../../../schema/minimal.ts';
import { PRESETS } from './presets.ts';

const EXAMPLE = 'Latex Related Research/Latex-Template-Examples/class.lipics/main.tex';

export default defineKey({
  ...minimal({
    id: 'front.lipics',
    node: 'paragraph/title',
    description:
      "The LIPIcs title block (lipics-v2021, Dagstuhl's Leibniz International Proceedings in Informatics): \\title and \\titlerunning, one five-argument \\author{name}{affiliations joined by \\and}{email}{ORCID URL}{author funding} per author, \\authorrunning, \\Copyright{full names}, the ACM 2012 classification as \\ccsdesc[500]{General~Specific}, comma-separated \\keywords, and the optional \\category, \\relatedversion, \\supplement, \\funding and \\ArticleNo, all in the preamble, which the class prints at the end of the abstract; then the class's \\maketitle where the title stands. lipics-v2021 only.",
    // Preamble lines first, then the body's \maketitle.
    writes:
      '\\title{…} \\titlerunning{…} \\author{…}{… \\and …}{…}{…}{…} \\authorrunning{…} \\Copyright{…} \\ccsdesc[…]{…~…} \\keywords{…, …} \\category{…} \\relatedversion{…} \\supplement{…} \\funding{…} \\ArticleNo{…} \\maketitle',
    ctan: ['lipics'],
    features: ['class-styled'],
    // The email and ORCID are \author's third and fourth arguments, each affiliation's department, name and address its second;
    // the rest are the paper's own values. An author's own funding (the fifth argument) has no field in Flouest's author records:
    // it is one templateSpecific list naming its authors (records.ts).
    fields: [
      'author.email',
      'author.orcid',
      'affiliation.name',
      'affiliation.department',
      'affiliation.address',
      'templateSpecific.shortTitle',
      'templateSpecific.runningAuthor',
      'templateSpecific.copyright',
      'templateSpecific.authorFunding',
      'templateSpecific.ccsConcepts',
      'templateSpecific.keywords',
      'templateSpecific.category',
      'templateSpecific.relatedVersion',
      'templateSpecific.supplement',
      'templateSpecific.funding',
      'templateSpecific.articleNo',
    ],
    presets: PRESETS,
    // It runs the class's own \maketitle.
    claims: ['maketitle'],
    // The class's metadata commands the block always writes (the others, \category … \ArticleNo, only when the paper gives
    // them). classes/lipics.ts lists none of them yet besides \maketitle (reported to its owner).
    requires: ['cmd:\\maketitle', 'cmd:\\titlerunning', 'cmd:\\authorrunning', 'cmd:\\Copyright', 'cmd:\\ccsdesc', 'cmd:\\keywords'],
    only: ['class.lipics'],
    // lipics-v2021.cls is not in this engine's package mirror ("File `lipics-v2021.cls' not found", 2026-11-07, as in
    // Latex-Template-Examples/_results/class.lipics.log l.17) nor in testing-pipeline/settings/classes/files, so the block is
    // not typeset here.
    targetEngine: 'untested',
  }),
  evidence: [
    { kind: 'requirement', file: 'Template/template-requirement/LIPIcs.md', line: '41-44, 53, 89, 122' },
    { kind: 'source', file: EXAMPLE, line: '56-75, 92, 96' },
    { kind: 'source', file: 'Latex-Lib/classes/lipics.ts', line: '21 (defines cmd:\\maketitle)' },
    { kind: 'manual', of: 'lipics', section: 'CTAN package page', url: 'https://ctan.org/pkg/lipics' },
  ],
});
