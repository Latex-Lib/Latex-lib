import { defineKey } from '../../../schema/key.ts';
import { minimal } from '../../../schema/minimal.ts';
import { PRESETS } from './presets.ts';

export default defineKey(
  minimal({
    id: 'front.maketitle',
    node: 'paragraph/title',
    description:
      'The kernel title block: \\title{…}, \\author{…} (several joined by \\and) and \\date{…} just before \\maketitle, where the title stands; \\date{} for no date line. 440 templates.',
    writes: '\\title{…} \\author{… \\and …} \\date{…} \\maketitle',
    ctan: ['latex-base'],
    features: ['centered'],
    params: {
      date: { type: 'enum', values: ['given', 'today', 'none'], default: 'given', description: "the date line: the node's date (the kernel prints today's when there is none), \\today explicitly, or none (\\date{})" },
    },
    presets: PRESETS,
    deny: [
      {
        class: 'class.revtex4-2',
        reason: "revtex4-2 takes one \\author per author: \\author{A \\and B} stops at \"\\and is not supported\"; the class's own title block (front.class-native) writes them so",
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
