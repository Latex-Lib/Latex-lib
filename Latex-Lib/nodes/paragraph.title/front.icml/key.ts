import { defineKey } from '../../../schema/key.ts';
import { minimal } from '../../../schema/minimal.ts';
import { PRESETS } from './presets.ts';

export default defineKey({
  ...minimal({
    id: 'front.icml',
    node: 'paragraph/title',
    description:
      "ICML's own title block (icml2026.sty, the ICML conference style on article): \\icmltitlerunning{…} for the running head, then the full-width \\twocolumn[…] holding \\icmltitle{…}, \\icmlsetsymbol{equal}{*}, an icmlauthorlist of \\icmlauthor{name}{equal,aff1,aff2}, one \\icmlaffiliation{aff1}{…} per affiliation, \\icmlcorrespondingauthor{name}{email}, \\icmlkeywords{…} and \\vskip 0.3in, then \\printAffiliationsAndNotice{…}, the first column's footnote of numbered affiliations, correspondence and notice. icml only.",
    writes:
      '\\icmltitlerunning{…} \\twocolumn[ \\icmltitle{…} \\icmlsetsymbol{equal}{*} \\begin{icmlauthorlist} \\icmlauthor{…}{…} \\end{icmlauthorlist} \\icmlaffiliation{…}{…} \\icmlcorrespondingauthor{…}{…} \\icmlkeywords{…} \\vskip 0.3in ] \\printAffiliationsAndNotice{…}',
    // icml2026.sty is not on CTAN (ICML's kit, icml2026.zip): its evidence is the style source and the kit's example below.
    ctan: [],
    features: ['class-styled', 'centered', 'ruled'],
    // Each affiliation's department, name and address are its \icmlaffiliation text; the corresponding author's e-mail is
    // \icmlcorrespondingauthor's second argument; templateSpecific.shortTitle is \icmltitlerunning, templateSpecific.keywords
    // \icmlkeywords, templateSpecific.correspondingAuthor (by name or email) who corresponds, and
    // templateSpecific.equalContribution (a list, by name or email) the authors labelled `equal`.
    fields: [
      'author.email',
      'affiliation.name',
      'affiliation.department',
      'affiliation.address',
      'templateSpecific.shortTitle',
      'templateSpecific.keywords',
      'templateSpecific.correspondingAuthor',
      'templateSpecific.equalContribution',
    ],
    presets: PRESETS,
    // It replaces \maketitle: the ICML title block is \twocolumn[\icmltitle…], and article's \maketitle is never run.
    claims: ['maketitle'],
    requires: [
      'cmd:\\icmltitle',
      'cmd:\\icmltitlerunning',
      'env:icmlauthorlist',
      'cmd:\\icmlauthor',
      'cmd:\\icmlsetsymbol',
      'cmd:\\icmlaffiliation',
      'cmd:\\icmlcorrespondingauthor',
      'cmd:\\icmlkeywords',
      'cmd:\\icmlEqualContribution',
      'cmd:\\printAffiliationsAndNotice',
    ],
    only: ['class.icml'],
    // Typeset on ZeroTeX-NG (2026-11-07) on the library's title sample under article with \usepackage[accepted]{icml2025}
    // (ICML2025_Template, the kit the build names) and with \usepackage[accepted]{icml2026} (the pinned kit's copy):
    // both ok, with the authors, affiliations, correspondence and equal-contribution notice printed.
    targetEngine: 'yes',
  }),
  evidence: [
    { kind: 'solution', file: 'Solution/0461-icml.md', lines: '23, 52-53' },
    { kind: 'source', file: 'Latex Related Research/Latex-lib-main/Source/0461-icml/example_paper.tex', line: '58-124' },
    { kind: 'source', file: 'Latex Related Research/Latex-lib-main/Source/0461-icml/icml2026.sty', line: '353-550' },
    { kind: 'source', file: 'Latex-Lib/classes/icml.ts', line: '35 (defines \\icmltitle, \\icmlauthor, \\icmlaffiliation, \\icmlcorrespondingauthor, \\icmlkeywords, \\printAffiliationsAndNotice)' },
  ],
});
