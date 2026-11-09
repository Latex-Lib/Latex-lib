import { defineKey } from '../../../schema/key.ts';
import { minimal } from '../../../schema/minimal.ts';
import { PRESETS } from './presets.ts';

export default defineKey({
  ...minimal({
    id: 'front.ijcai',
    node: 'paragraph/title',
    description:
      "IJCAI's own title block (ijcai27.sty, the IJCAI conference style on article): \\title{…}, then one \\author{…} with the authors joined by \\and (a comma) and \\And (\" and \") before the last, each numbered $^{1,2}$ by affiliation and \\\\ after the last, \\affiliations with one numbered affiliation per line ended by \\\\, and \\emails with the authors' e-mails, then the style's \\maketitle across both columns. \\affiliations and \\emails exist only inside \\author. ijcai only.",
    writes: '\\title{…} \\author{…$^{…}$ \\and … \\And …\\\\ \\affiliations $^{…}$…\\\\ … \\emails …} \\maketitle',
    // ijcai27.sty is not on CTAN (IJCAI's FormattingGuidelines kit): its evidence is the style source and the kit's example below.
    ctan: [],
    features: ['class-styled', 'centered'],
    params: {
      emails: { type: 'enum', values: ['all', 'none'], default: 'all', description: "the \\emails section: every author's e-mail in the authors' order, or none (the kit makes it optional)" },
    },
    // Each affiliation's department, name and address are its line in \affiliations; the e-mails are \emails' list. A per-author
    // \thanks (author.thanks in the research) is not printed: the title's records carry no per-author note.
    fields: ['author.email', 'affiliation.name', 'affiliation.department', 'affiliation.address'],
    presets: PRESETS,
    // It runs the style's own \maketitle (ijcai26.sty l.101-109: \twocolumn[\@maketitle]).
    claims: ['maketitle'],
    // \affiliations, \emails, \and and \And are not required: the style defines them only inside \@maketitle (l.122-127,
    // 153-164), where the \author text is set, so a profile cannot list them as the class's commands.
    requires: ['cmd:\\maketitle'],
    only: ['class.ijcai'],
    // The pinned ijcai27.sty that classes/ijcai.ts cites is not in testing-pipeline/settings/classes/files/ here and the style is
    // not on CTAN, so the form is not typeset against it. A sanity run on the kit's ijcai26.sty (also a copy of ijcai22.sty,
    // whose title code ijcai27.sty shares) typeset ok on ZeroTeX-NG (2026-11-07), both presets.
    targetEngine: 'untested',
  }),
  evidence: [
    { kind: 'solution', file: 'Solution/0319-ijcai.md', lines: '23, 41-42' },
    { kind: 'source', file: 'Latex Related Research/Latex-lib-main/Source/0319-ijcai/ijcai26.tex', line: '74-107, 221-245' },
    { kind: 'source', file: 'Latex Related Research/Latex-lib-main/Source/0319-ijcai/ijcai26.sty', line: '99-168' },
    { kind: 'source', file: 'Latex-Lib/classes/ijcai.ts', line: '9-10, 34 (\\maketitle redefined; \\affiliations and \\emails inside \\author)' },
  ],
});
