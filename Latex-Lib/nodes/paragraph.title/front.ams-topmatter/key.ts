import { defineKey } from '../../../schema/key.ts';
import { minimal } from '../../../schema/minimal.ts';
import { PRESETS } from './presets.ts';

const DTX = 'Latex Related Research/Latex-lib-main/Source/0260-amsproc/amsclass.dtx';

export default defineKey({
  ...minimal({
    id: 'front.ams-topmatter',
    node: 'paragraph/title',
    description:
      "The AMS classes' top matter (amsart, amsproc, amsbook): \\title[short]{…}, each \\author[short]{…} followed by one \\address{…} per affiliation and its \\email{…}, a \\thanks{…} note, \\subjclass[2020]{…}, \\keywords{…}, \\date, \\dedicatory, amsart's \\commby, \\contrib, \\translator and \\pagespan, then \\maketitle; amsbook's form opens with \\frontmatter. The addresses print at the end of the article (amsart, amsproc) or on the title page (amsbook).",
    writes: '\\title[…]{…} \\author[…]{…} \\address{…} \\email{…} \\thanks{…} \\subjclass[2020]{…} \\keywords{…} \\date{…} \\dedicatory{…} \\commby{…} \\contrib[…]{…} \\translator{…} \\pagespan{…}{…} \\maketitle',
    ctan: ['amscls'],
    features: ['class-styled', 'centered'],
    params: {
      tags: { type: 'enum', values: ['amsart', 'amsproc', 'amsbook'], default: 'amsart', description: "the class whose optional tags it writes: amsart's all (\\commby, \\contrib, \\pagespan), amsproc's (\\contrib, \\pagespan), amsbook's (none of them)" },
      subjclassEdition: { type: 'enum', values: ['1991', '2000', '2010', '2020'], default: '2020', description: "the Mathematics Subject Classification edition in \\subjclass[…] (the class knows these four, amsclass.dtx l.2029-2040; 2020 is its default, the template writes 2010)" },
      frontmatter: { type: 'boolean', default: false, description: "\\frontmatter before the title (amsbook's roman-numbered front matter)" },
    },
    // Per-author \curraddr, \urladdr and \thanks have no field in Flouest's title records and are not written; the paper's \thanks
    // (a grant) is templateSpecific.thanks. No ORCID or corresponding mark: the classes have none.
    fields: [
      'author.email',
      'affiliation.department',
      'affiliation.name',
      'affiliation.address',
      'templateSpecific.shortTitle',
      'templateSpecific.runningAuthor',
      'templateSpecific.thanks',
      'templateSpecific.subjectClass',
      'templateSpecific.keywords',
      'templateSpecific.dedication',
      'templateSpecific.communicatedBy',
      'templateSpecific.contributors',
      'templateSpecific.translator',
      'templateSpecific.pageSpan',
    ],
    presets: PRESETS,
    // It runs the class's own \maketitle, which prints the abstract the class keeps for it (amsart's heldByMaketitle).
    claims: ['maketitle'],
    requires: ['cmd:\\maketitle', 'cmd:\\address', 'cmd:\\email', 'cmd:\\subjclass', 'cmd:\\keywords'],
    requiresWhen: [{ when: { frontmatter: true }, requires: ['cmd:\\frontmatter'] }],
    only: ['class.amsart', 'class.amsproc', 'class.amsbook'],
    onlyWhen: [
      {
        when: { tags: 'amsart' },
        classes: ['class.amsart'],
        reason: "\\commby is amsart's alone (amsclass.dtx l.1511, guarded <amsart>): under amsproc or amsbook it is 'Undefined control sequence'",
        evidence: [{ kind: 'source', file: DTX, line: '1511-1512' }],
      },
      {
        when: { tags: 'amsproc' },
        classes: ['class.amsart', 'class.amsproc'],
        reason: "\\contrib and \\pagespan are amsart's and amsproc's (amsclass.dtx l.1317-1354 and 1814-1819, guarded <amsart|amsproc>): under amsbook they are 'Undefined control sequence'",
        evidence: [{ kind: 'source', file: DTX, line: '1317-1354, 1814-1819' }],
      },
      {
        when: { frontmatter: true },
        classes: ['class.amsbook'],
        reason: "\\frontmatter is amsbook's (amsclass.dtx l.2815-2821, guarded <amsbook>): under amsart or amsproc it is 'Undefined control sequence'",
        evidence: [{ kind: 'source', file: DTX, line: '2815-2821' }],
      },
    ],
    targetEngine: 'yes',
  }),
  evidence: [
    { kind: 'source', file: DTX, line: '1266-1298 (\\title[short], \\author[short] and \\addresses), 1363-1366 (\\address, \\curraddr, \\email, \\urladdr), 1372-1377 (\\thanks inside \\author is an error), 1489-1522 (\\date, \\dedicatory, \\keywords, \\subjclass, \\commby, \\translator), 1600-1630 (\\maketitle, \\shortauthors)' },
    { kind: 'source', file: 'Latex Related Research/Latex-lib-main/Source/0260-amsproc/doc/amsart-template.tex', line: '54-83' },
    { kind: 'requirement', file: 'Template/template-requirement/AMS_Amsart.md', line: '41-48, 105-107' },
    { kind: 'manual', of: 'amscls', section: 'CTAN package page', url: 'https://ctan.org/pkg/amscls' },
  ],
});
