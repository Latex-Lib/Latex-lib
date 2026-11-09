import { defineKey } from '../../../schema/key.ts';
import { minimal } from '../../../schema/minimal.ts';
import { PRESETS } from './presets.ts';

const CLS = 'testing-pipeline/settings/classes/files/iopjournal.cls';
const TEMPLATE = 'Latex Related Research/Latex-lib-main/Source/0035-iop-journals/iopjournal-template.tex';

export default defineKey({
  ...minimal({
    id: 'front.iopjournal',
    node: 'paragraph/title',
    description:
      "IOP Publishing's journal title block (iopjournal), typeset where the title stands with no \\maketitle: \\articletype{…}, \\title{…}, one \\author{…} line naming every author with their affiliation numbers ($^{1,2}$), a star for the corresponding author ($^{1,*}$) and an ORCID icon (\\orcid{…}), one \\affil{$^1$…} per affiliation and \\affil{$^*$Author to whom any correspondence should be addressed.}, then \\email{…} and \\keywords{…}.",
    writes:
      '\\articletype{…} \\title{…} \\author{…$^{1}$\\orcid{…}, … and …$^{1,*}$} \\affil{$^{1}$…} \\affil{$^{*}$Author to whom any correspondence should be addressed.} \\email{…} \\keywords{…, …}',
    ctan: [],
    features: ['class-styled'],
    // The corresponding author's email only, on the \email line; no date (the class prints placeholder RECEIVED/REVISED dates
    // itself, l.96). The article type, the corresponding author and the keywords are template fields.
    fields: [
      'author.orcid',
      'author.email',
      'affiliation.name',
      'affiliation.department',
      'affiliation.address',
      'templateSpecific.articleType',
      'templateSpecific.correspondingAuthor',
      'templateSpecific.keywords',
    ],
    presets: PRESETS,
    // It stands in for \maketitle, which the class forbids (the iopjournal profile): the one title block of the document.
    claims: ['maketitle'],
    requires: ['cmd:\\articletype', 'cmd:\\affil', 'cmd:\\email', 'cmd:\\keywords', 'cmd:\\orcid'],
    only: ['class.iopjournal'],
    targetEngine: 'yes',
  }),
  evidence: [
    { kind: 'source', file: CLS, line: '93-96 (\\articletype), 98-100 (\\title typesets at once), 103-106 (\\author), 108-110 (\\affil), 112-114 (\\email), 116-118 (\\keywords), 183 (\\orcid)' },
    { kind: 'source', file: TEMPLATE, line: '10-24' },
    { kind: 'compile', reproducer: '\\documentclass{iopjournal} \\begin{document} the emitted title block on the library\'s title sample, then \\begin{abstract}…\\end{abstract} \\section{One}: typesets (ZeroTeX-NG, orcid.pdf beside it, 2026-11-07)' },
  ],
});
