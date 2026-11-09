import { defineKey } from '../../../schema/key.ts';
import { minimal } from '../../../schema/minimal.ts';
import { PRESETS } from './presets.ts';

const TEMPLATE = 'Latex Related Research/Latex-lib-main/Source/0894-mdpi/template.tex';
const CLS = 'testing-pipeline/settings/classes/files/Definitions/mdpi.cls';

export default defineKey({
  ...minimal({
    id: 'front.mdpi',
    node: 'paragraph/title',
    description:
      "MDPI's title declarations (Definitions/mdpi.cls), all in the preamble, which the class prints by itself after the preamble: \\Title, one \\newcommand{\\orcidauthorA}{iD} per author with an ORCID, \\Author{Name $^{1}$\\orcidA{}, … and Name $^{1,2,}$*} with affiliation numbers and the corresponding author's star, \\AuthorNames, \\address{$^{1}$ \\quad Department, Institution, Address; e-mail\\\\ …} (\\address[1]{…} for one affiliation), \\corres{Correspondence: …}, \\conference, \\firstnote, \\secondnote, \\simplesumm, \\keyword{…; …} and \\PACS, \\MSC, \\JEL; optionally \\longauthorlist{yes}. Nothing where the title stands. mdpi only.",
    // Preamble only: the class runs \maketitle itself after the preamble and disables it.
    writes:
      '\\Title{…} \\newcommand{\\orcidauthorA}{…} \\Author{… $^{1}$\\orcidA{}, … and … $^{1,2,}$*} \\AuthorNames{…} \\address{$^{1}$ \\quad …; …\\\\ $^{2}$ \\quad …} \\corres{Correspondence: …} \\conference{…} \\firstnote{…} \\secondnote{…} \\simplesumm{…} \\keyword{…; …} \\PACS{…} \\MSC{…} \\JEL{…}',
    // mdpi.cls is MDPI's own template, not on CTAN: its evidence is the class source and the template below.
    ctan: [],
    features: ['class-styled'],
    params: {
      longAuthorList: { type: 'enum', values: ['no', 'yes'], default: 'no', description: "the names in the class's usual title column, or across the full width beside the left column (\\longauthorlist{yes}), for a long author list" },
    },
    // The ORCID is the \orcidauthorX iD, the email goes on the author's first affiliation's line and into the correspondence line,
    // each affiliation's department, name and address its \address line; the rest are the paper's own values.
    fields: [
      'author.email',
      'author.orcid',
      'affiliation.name',
      'affiliation.department',
      'affiliation.address',
      'templateSpecific.correspondingAuthor',
      'templateSpecific.correspondence',
      'templateSpecific.conference',
      'templateSpecific.firstNote',
      'templateSpecific.secondNote',
      'templateSpecific.simpleSummary',
      'templateSpecific.keywords',
      'templateSpecific.pacs',
      'templateSpecific.msc',
      'templateSpecific.jel',
    ],
    presets: PRESETS,
    // No claim on maketitle: the class runs its own \maketitle after the preamble whatever the ways do (mdpi.cls l.1325-1331),
    // and the way writes none.
    // classes/mdpi.ts lists none of these yet (reported to its owner).
    requires: ['cmd:\\Title', 'cmd:\\Author', 'cmd:\\AuthorNames', 'cmd:\\address', 'cmd:\\corres', 'cmd:\\keyword'],
    requiresWhen: [{ when: { longAuthorList: 'yes' }, requires: ['cmd:\\longauthorlist'] }],
    only: ['class.mdpi'],
    // Typeset on ZeroTeX-NG (2026-11-07) with the setting's Definitions/ folder beside main.tex: the sample under
    // \documentclass{Definitions/mdpi}, and under [journal,article,submit,moreauthors] (template.tex l.5) the sample with every
    // optional field, both presets, and one affiliation (\address[1]{…}, a star with no number, two ORCID macros): all ok.
    targetEngine: 'yes',
  }),
  evidence: [
    { kind: 'source', file: TEMPLATE, line: '72-114' },
    { kind: 'source', file: CLS, line: '608-765 (\\Title, \\Author, \\AuthorNames, \\address, \\corres, \\conference, \\PACS, \\MSC, \\JEL, \\keyword, \\firstnote, \\secondnote, \\simplesumm, \\longauthorlist), 778-789 (\\orcidA … \\orcidZ), 1141-1333 (printed after the preamble)' },
    { kind: 'requirement', file: 'Template/template-requirement/MDPI.md', line: '55-56' },
  ],
});
