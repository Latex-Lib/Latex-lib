/**
 * abs.ieeeaccess's presets: the one form IEEE Access's starter writes.
 */
import type { Preset } from '../../../schema/params.ts';

const CLS = 'Template/templates/ieee-access/files/ieeeaccess.cls';

export const PRESETS = {
  ieeeaccess: {
    description:
      "IEEE Access's abstract in the title block: a blue bullet, the blue ABSTRACT heading run into the text, set at the abstract's width across both columns under the authors and above the INDEX TERMS, between the class's rules.",
    features: ['class-styled', 'run-in-head'],
    params: {},
    evidence: [
      { kind: 'source', file: CLS, line: '615-625 (\\renewenvironment{abstract}: \\global\\setbox99=\\hbox{…\\begin{minipage}[t]{\\abstractwidth}\\abstracttitle\\bodyfont…})' },
      { kind: 'source', file: CLS, line: '763 (\\noindent\\box99 in \\@maketitle)' },
      { kind: 'source', file: 'Template/templates/ieee-access/starter.tex', line: '15-17 (the abstract, written before \\maketitle)' },
      { kind: 'compile', reproducer: "\\documentclass{ieeeaccess} (Template/templates/ieee-access/files) with graphicx: front.ieeeaccess's access preset on the title sample, then \\begin{abstract}We study engines.\\end{abstract}, \\section, \\EOD: ok, ABSTRACT under the authors above INDEX TERMS on page 1; the same with the abstract before the title, and with a list opening it: ok (ZeroTeX-NG, 2026-11-07)" },
    ],
  },
} as const satisfies { readonly [name: string]: Preset };
