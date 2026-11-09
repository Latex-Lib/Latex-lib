import { defineKey } from '../../../schema/key.ts';
import { minimal } from '../../../schema/minimal.ts';
import { PRESETS } from './presets.ts';

export default defineKey(
  minimal({
    id: 'front.class-native',
    node: 'paragraph/title',
    description:
      "The class's own title block: \\title, \\author, \\date and \\maketitle as the class lays them out (acmart, llncs and IEEEtran restyle \\maketitle themselves). 393 templates.",
    // The same LaTeX as front.maketitle's: the class, not the source, restyles \maketitle.
    writes: '\\title{…} \\author{… \\and …} \\date{…} \\maketitle',
    ctan: ['latex-base'],
    features: ['class-styled'],
    params: {
      authors: { type: 'enum', values: ['joined', 'separate'], default: 'joined', description: "the authors in one \\author joined by \\and, or one \\author each (revtex4-2's form)" },
    },
    presets: PRESETS,
    deny: [
      {
        class: 'class.revtex4-2',
        reason: "revtex4-2 takes one \\author per author: \\author{A \\and B} stops at \"\\and is not supported\"",
        unless: { authors: 'separate' },
        evidence: [{ kind: 'compile', reproducer: "\\documentclass[reprint,aps]{revtex4-2} \\begin{document} \\begin{abstract}…\\end{abstract} \\title{A Title} \\author{A One \\and B Two} \\maketitle: '\\and is not supported.'; with \\author{A One} \\author{B Two} it typesets (ZeroTeX-NG, 2026-10-31)" }],
      },
    ],
    // It runs the class's own \maketitle, which prints what the class keeps for it (a revtex4-2 or amsart abstract).
    claims: ['maketitle'],
    requires: [
      'cmd:\\maketitle',
    ],
    targetEngine: 'untested',
  }),
);
