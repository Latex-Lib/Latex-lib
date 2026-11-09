/**
 * front.mdpi's presets: MDPI's title declarations, with the names in the class's narrow column (the default) or across the
 * full width (\longauthorlist{yes}, the template's commented-out option for a long author list). The journal, article type,
 * status and author count are the class line's options, not the title's.
 */
import type { Preset } from '../../../schema/params.ts';

const TEMPLATE = 'Latex Related Research/Latex-lib-main/Source/0894-mdpi/template.tex';
const CLS = 'testing-pipeline/settings/classes/files/Definitions/mdpi.cls';

export const PRESETS = {
  mdpi: {
    description:
      "MDPI's title declarations in the preamble: \\Title, \\newcommand{\\orcidauthorA}{iD}, \\Author{Name $^{1}$\\orcidA{} and Name $^{1,2,}$*}, \\AuthorNames, \\address{$^{1}$ \\quad Affiliation; e-mail\\\\ …}, \\corres{Correspondence: …}, the notes, the simple summary, \\keyword{…; …} and \\PACS, \\MSC, \\JEL; the class prints them after the preamble.",
    features: ['class-styled'],
    params: {},
    evidence: [
      { kind: 'source', file: TEMPLATE, line: '72-114 (\\Title … \\JEL)' },
      { kind: 'source', file: CLS, line: '608-765 (the commands store their text), 1141-1333 (\\maketitlen, \\abstractkeywords, printed after the preamble)' },
    ],
  },
  'long-author-list': {
    description: "MDPI's title declarations for a long author list: as the default, with \\longauthorlist{yes}, so the class sets the names across the full width beside its left column.",
    writes:
      '\\Title{…} \\newcommand{\\orcidauthorA}{…} \\Author{… $^{1}$\\orcidA{}, … and … $^{1,2,}$*} \\longauthorlist{yes} \\AuthorNames{…} \\address{$^{1}$ \\quad …} \\corres{Correspondence: …} \\keyword{…; …}',
    features: ['class-styled'],
    params: { longAuthorList: 'yes' },
    evidence: [
      { kind: 'source', file: TEMPLATE, line: '59, 81 (%\\longauthorlist{yes})' },
      { kind: 'source', file: CLS, line: '764-765 (\\longauthorlist), 943-970 (the names across the full width)' },
    ],
  },
} as const satisfies { readonly [name: string]: Preset };
