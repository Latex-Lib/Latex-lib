import { defineKey } from '../../../schema/key.ts';
import { minimal } from '../../../schema/minimal.ts';
import { PRESETS } from './presets.ts';

export default defineKey({
  ...minimal({
    id: 'front.aistats',
    node: 'paragraph/title',
    description:
      "AISTATS's own title block (aistats2027.sty on article): \\runningtitle{…} and \\runningauthor{…} for the page heads, then \\twocolumn[ \\aistatstitle{…} \\aistatsauthor{A \\And B \\And C} \\aistatsaddress{… \\And … \\And …} ], the title between two rules across both columns with the authors in rows over their institutions; no \\maketitle. aistats only.",
    writes: '\\runningtitle{…} \\runningauthor{…} \\twocolumn[ \\aistatstitle{…} \\aistatsauthor{… \\And …} \\aistatsaddress{… \\And …} ]',
    // aistats2027.sty is not on CTAN (the AISTATS author kit): its evidence is the style source and the kit below.
    ctan: [],
    features: ['class-styled', 'ruled', 'centered'],
    params: {
      perRow: { type: 'number', default: 3, description: 'author blocks to a row: one \\aistatsauthor and \\aistatsaddress pair per row (the kit has three)' },
      emails: { type: 'boolean', default: false, description: "each author's e-mail in \\texttt under their institution (the kit's address blocks hold only the institution)" },
      group: { type: 'enum', values: ['none', 'shared'], default: 'none', description: 'one block per author, or consecutive authors of the same institutions in one block, joined by \\and' },
      wrapper: { type: 'enum', values: ['twocolumn', 'onecolumn'], default: 'twocolumn', description: 'the block in \\twocolumn[…] across both columns, or after \\onecolumn (a supplement-only document)' },
    },
    // The institution block under each author is the author's affiliations' department, name and address; the e-mail with
    // emails: true; the page heads take the short title and the short author list.
    fields: ['author.email', 'affiliation.name', 'affiliation.department', 'affiliation.address', 'templateSpecific.shortTitle', 'templateSpecific.runningAuthor'],
    presets: PRESETS,
    // The title text, for a later supplement title (num.appendix-onecolumn).
    defines: ['cmd:\\LibPaperTitle'],
    // No claim of maketitle: the style does not use \maketitle (aistats2026.sty prints the block from \aistatstitle on).
    requires: ['cmd:\\aistatstitle', 'cmd:\\aistatsauthor', 'cmd:\\aistatsaddress', 'cmd:\\runningtitle', 'cmd:\\runningauthor'],
    only: ['class.aistats'],
    // The pinned aistats2027.sty that classes/aistats.ts cites is not in testing-pipeline/settings/classes/files/ here, and the
    // style is not on CTAN, so the form is not typeset against it. It typeset on the kit's aistats2026.sty (the compile
    // evidence below), which is not the profile's pinned file.
    targetEngine: 'untested',
  }),
  evidence: [
    { kind: 'solution', file: 'Solution/0794-aistats.md', lines: '24, 38, 41' },
    { kind: 'source', file: 'Latex Related Research/Latex-lib-main/Source/0794-aistats/sample_paper.tex', line: '37-57' },
    { kind: 'source', file: 'Latex Related Research/Latex-lib-main/Source/0794-aistats/aistats2026.sty', line: '163-164 (\\runningtitle, \\runningauthor), 166-239 (\\aistatstitle), 241-344 (\\aistatsauthor), 348-391 (\\aistatsaddress)' },
    { kind: 'source', file: 'Latex-Lib/classes/aistats.ts', line: '12-15, 24, 32, 38' },
    { kind: 'compile', reproducer: "\\documentclass[twoside]{article} \\usepackage[preprint]{aistats2026} (and with no option, the review mode) \\begin{document} and each preset's emit on the title sample and on five authors in two rows with emails: true: ok, 1 page each (ZeroTeX-NG, 2026-11-07)" },
  ],
});
