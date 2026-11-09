import { defineKey } from '../../../schema/key.ts';
import { minimal } from '../../../schema/minimal.ts';
import { PRESETS } from './presets.ts';

export default defineKey({
  ...minimal({
    id: 'bib.named',
    node: 'cite/cite',
    description:
      "IJCAI's citation commands (ijcai27.sty's named.sty macros, on article): \\cite{key} as [Author, Year], \\shortcite{key} as [Year] after the authors named in the sentence, \\citeauthor{key} and \\citeyear{key} the authors or the year alone; read from named.bst's \\citeauthoryear labels. ijcai only.",
    writes: '\\cite{…} | \\shortcite{…} | \\citeauthor{…} | \\citeyear{…}',
    // named.sty's commands come with the IJCAI kit's style, not a CTAN package: the evidence is the kit's sources below.
    ctan: [],
    features: ['author-year'],
    params: {
      command: { type: 'enum', values: ['cite', 'shortcite', 'citeauthor', 'citeyear'], default: 'cite', description: 'the citation command' },
      tie: { type: 'boolean', default: false, description: 'a tie before the citation (Knuth~\\shortcite{key})' },
    },
    presets: PRESETS,
    // ijcai26.sty defines all four by \def (l.286-291); \shortcite is the one the kernel and other classes lack, so it marks the style.
    requires: ['cmd:\\shortcite'],
    only: ['class.ijcai'],
    // The pinned ijcai27.sty that classes/ijcai.ts cites is not in testing-pipeline/settings/classes/files/ here and the style is not
    // on CTAN, so the form is not typeset against it. A sanity run on the kit's ijcai26.sty typeset ok on ZeroTeX-NG (2026-11-07),
    // all four commands, beside bib.named's list: [Knuth, 1984], Knuth~[1984], Lamport, 1994.
    targetEngine: 'untested',
  }),
  evidence: [
    { kind: 'solution', file: 'Solution/0319-ijcai.md', lines: '23, 73, 82' },
    { kind: 'source', file: 'Latex Related Research/Latex-lib-main/Source/0319-ijcai/ijcai26.sty', line: '270-319' },
    { kind: 'source', file: 'Latex Related Research/Latex-lib-main/Source/0319-ijcai/ijcai26.tex', line: '258-259, 386-393' },
  ],
});
