import { defineKey } from '../../../schema/key.ts';
import { minimal } from '../../../schema/minimal.ts';
import { PRESETS } from './presets.ts';

const SOURCE = 'Latex Related Research/Latex-lib-main/Source/0909-asmeconf';

export default defineKey({
  ...minimal({
    id: 'front.asmeconf',
    node: 'paragraph/title',
    description:
      "asmeconf's own title block for ASME conference papers: \\PaperNo{…}, \\title{…}, \\SetAuthors{…} with \\affil{n}, \\JointFirstAuthor and \\CorrespondingAuthor{email} after each name, \\SetAffiliation{n}{…} per address, \\maketitle (the conference header, the uppercase title and the authors across both columns), then the date as \\versionfootnote{…} and \\keywords{…}, which the class prints at the abstract's end. Inline names (ASME's current style) or, with the class option grid, a grid of author blocks.",
    writes: '\\PaperNo{…} \\title{…} \\SetAuthors{…\\affil{…}\\JointFirstAuthor\\CorrespondingAuthor{…}, …} \\SetAffiliation{…}{…} \\maketitle \\versionfootnote{…} \\keywords{…}',
    ctan: ['asmeconf'],
    features: ['class-styled', 'centered', 'sans-serif'],
    params: {
      authorBlock: {
        type: 'enum',
        values: ['inline', 'grid'],
        default: 'inline',
        description: "the authors as the inline block (numbered affiliations, shared addresses once) or as the grid's blocks (one block number per author, the block's address holding all their affiliations); grid looks so only under the class option grid",
      },
    },
    // The author's email only for the corresponding author (\CorrespondingAuthor{email}); asmeconf prints no ORCID.
    fields: ['author.email', 'affiliation.name', 'affiliation.department', 'affiliation.address', 'templateSpecific.paperNumber', 'templateSpecific.keywords', 'templateSpecific.correspondingAuthor', 'templateSpecific.jointFirstAuthors'],
    presets: PRESETS,
    // It runs the class's own \maketitle (the \twocolumn[…] title page, asmeconf.cls l.2150-2180).
    claims: ['maketitle'],
    requires: [
      'cmd:\\maketitle',
      'cmd:\\PaperNo',
      'cmd:\\SetAuthors',
      'cmd:\\SetAffiliation',
      'cmd:\\affil',
      'cmd:\\JointFirstAuthor',
      'cmd:\\CorrespondingAuthor',
      'cmd:\\versionfootnote',
      'cmd:\\keywords',
    ],
    only: ['class.asmeconf'],
    // Typeset on ZeroTeX-NG (2026-11-07) under \documentclass[nofontspec]{asmeconf}, the class line the asmeconf setting's sample
    // uses, and \documentclass[nofontspec,grid]{asmeconf}: both presets, with the library's title sample (two affiliations, one
    // author in both, a corresponding author) and with one shared affiliation, joint first authors and a paper number. Without
    // nofontspec the class itself stops at load ("The font \"texgyretermes-math\" cannot be found"), whatever the title.
    targetEngine: 'yes',
  }),
  evidence: [
    { kind: 'manual', of: 'asmeconf', section: 'CTAN package page', url: 'https://ctan.org/pkg/asmeconf' },
    { kind: 'source', file: `${SOURCE}/asmeconf-template.tex`, line: '148-196 (\\PaperNo, \\title, \\SetAuthors, \\SetAffiliation, \\maketitle, \\versionfootnote, \\keywords)' },
    { kind: 'source', file: `${SOURCE}/asmeconf.cls`, line: '1593-1634 (\\keywords, printed at \\end{abstract})' },
    { kind: 'source', file: `${SOURCE}/asmeconf.cls`, line: '1706-1800 (\\PaperNo, \\JointFirstAuthor, \\CorrespondingAuthor)' },
    { kind: 'source', file: `${SOURCE}/asmeconf.cls`, line: '1808-2141 (the grid and inline \\SetAuthors, \\SetAffiliation, \\affil)' },
    { kind: 'source', file: `${SOURCE}/asmeconf.cls`, line: '2150-2195 (\\maketitle, \\title, \\thanks disabled, \\versionfootnote, \\date)' },
  ],
});
