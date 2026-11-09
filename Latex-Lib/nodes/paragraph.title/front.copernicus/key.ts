import { defineKey } from '../../../schema/key.ts';
import { minimal } from '../../../schema/minimal.ts';
import { PRESETS } from './presets.ts';

const SOURCE = 'Latex Related Research/Latex-lib-main/Source/0195-copernicus';

export default defineKey({
  ...minimal({
    id: 'front.copernicus',
    node: 'paragraph/title',
    description:
      "Copernicus Publications' own title block (copernicus.cls, for ACP, Biogeosciences, The Cryosphere and the other Copernicus journals): \\title, one \\Author[affiliation numbers][email]{given name}{surname} per author with the email on the corresponding author, one \\affil[n]{…} per affiliation, \\deceased[date]{author number} and \\equalcontrib{author numbers} notes, \\correspondence, the required running heads \\runningtitle and \\runningauthor, \\keywords, then \\maketitle, with the abstract after it. copernicus only.",
    writes: '\\title{…} \\Author[…][…]{…}{…} \\affil[…]{…} \\deceased[…]{…} \\equalcontrib{…} \\correspondence{…} \\runningtitle{…} \\runningauthor{…} \\keywords{…} \\maketitle',
    ctan: ['copernicus'],
    features: ['class-styled'],
    // The email is \Author's second optional argument, on the corresponding authors only; each affiliation's department, name
    // and address are one \affil. \Author's given name and surname are the name's words (records.ts nameParts): the title's
    // records hold one name. The deceased and equal-contribution authors are template fields (names, emails or author numbers;
    // a deceased entry's date after a colon), as the schema has no per-author field for them; templateSpecific.correspondence
    // replaces the correspondence line the class builds from \Author. No ORCID: the class has no command for it.
    fields: [
      'author.email',
      'affiliation.name',
      'affiliation.department',
      'affiliation.address',
      'templateSpecific.shortTitle',
      'templateSpecific.runningAuthor',
      'templateSpecific.correspondingAuthor',
      'templateSpecific.correspondence',
      'templateSpecific.deceased',
      'templateSpecific.equalContribution',
      'templateSpecific.keywords',
    ],
    presets: PRESETS,
    // It runs the class's own \maketitle (copernicus.cls l.568-603).
    claims: ['maketitle'],
    requires: ['cmd:\\maketitle', 'cmd:\\Author', 'cmd:\\affil', 'cmd:\\runningtitle', 'cmd:\\runningauthor'],
    only: ['class.copernicus'],
    // Typeset on ZeroTeX-NG (2026-11-07) under \documentclass[acp,manuscript]{copernicus}, with the class and copernicus.cfg
    // from Source/0195-copernicus patched for XeTeX as classes/copernicus.ts describes the setting's copy (its \pdfoutput tests,
    // \pdfpageattr, inputenc and ucharacters): ok, 1 page, both with the sample's block and with \deceased, \equalcontrib and
    // \correspondence (the ribbon and star marks by the names, the notes under the affiliations, the correspondence line). The
    // class is not on the package mirror, and the setting's pinned copy is not in testing-pipeline/settings/classes/files/ here.
    targetEngine: 'yes',
  }),
  evidence: [
    { kind: 'manual', of: 'copernicus', section: 'CTAN package page', url: 'https://ctan.org/pkg/copernicus' },
    { kind: 'source', file: `${SOURCE}/template.tex`, line: '85-126' },
    { kind: 'source', file: `${SOURCE}/copernicus.cls`, line: '551-553, 568-603, 1583-1742, 2606-2624, 2671-2695' },
    { kind: 'solution', file: 'Solution/0195-copernicus.md', lines: '50-51' },
    {
      kind: 'compile',
      reproducer:
        "\\documentclass[acp,manuscript]{copernicus} (the Source/0195-copernicus class, XeTeX-patched) \\begin{document} \\title{On Engines} \\Author[1][ada@example.org]{Ada}{Lovelace} \\Author[1,2]{Alan}{Turing} \\Author[2]{Charles}{Babbage} \\affil[1]{…} \\affil[2]{…} \\deceased[18 October 1871]{3} \\equalcontrib{1,2} \\correspondence{…} \\runningtitle{Engines} \\runningauthor{Lovelace and Turing} \\keywords{engines, computing} \\maketitle \\begin{abstract}…\\end{abstract}: ok, 1 page (ZeroTeX-NG, 2026-11-07)",
    },
  ],
});
