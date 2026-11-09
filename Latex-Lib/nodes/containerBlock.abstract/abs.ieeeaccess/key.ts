import { defineKey } from '../../../schema/key.ts';
import { minimal } from '../../../schema/minimal.ts';
import { PRESETS } from './presets.ts';

const CLS = 'Template/templates/ieee-access/files/ieeeaccess.cls';

export default defineKey({
  ...minimal({
    id: 'abs.ieeeaccess',
    node: 'containerBlock/abstract',
    description:
      "IEEE Access's boxed abstract (ieeeaccess.cls): \\begin{abstract} … \\end{abstract}, which the class keeps in its abstract box (box 99) for \\maketitle, which sets it under the authors with a blue bullet and the blue ABSTRACT heading run in, above the INDEX TERMS. It pairs with the title way front.ieeeaccess, whose \\maketitle is held until this environment ends.",
    writes: '\\begin{abstract} … \\end{abstract}',
    ctan: ['ieeetran'],
    features: ['class-styled', 'run-in-head'],
    presets: PRESETS,
    // The class's renewed environment (ieeetran's env:abstract, renewed at l.615), and the held \maketitle that prints its box:
    // front.ieeeaccess defines \LatexLibAccessTitle and hooks it after this environment (its key's defines).
    requires: ['env:abstract', 'cmd:\\LatexLibAccessTitle'],
    only: ['class.ieeeaccess'],
    // The body is set into a minipage inside an \hbox kept in box 99 (l.616-619): it never breaks across pages, and a float or
    // margin note in it is lost ('Float(s) lost', 'Not in outer par mode'), as the class profile and abs.kernel's deny record.
    gives: { floats: false, breakable: false },
    // Typeset on ZeroTeX-NG (2026-11-07) with Template/templates/ieee-access/files (ieeeaccess.cls, IEEEtran.cls, the class's
    // fonts and bullet.png), front.ieeeaccess's access preset on the title sample, graphicx and \EOD as the setting gives them:
    // the abstract after the title, before it, and one opening with a list.
    targetEngine: 'yes',
  }),
  evidence: [
    { kind: 'source', file: CLS, line: '615-625 (\\renewenvironment{abstract}: box 99), 733-768 (\\@maketitle; \\noindent\\box99 at l.763), 781-787 (\\maketitle)' },
    { kind: 'source', file: 'Template/templates/ieee-access/starter.tex', line: '15-17 (the abstract environment, before \\maketitle)' },
    { kind: 'requirement', file: 'Template/template-requirement/IEEE_Access.md', line: '43' },
    { kind: 'source', file: 'Latex-Lib/nodes/paragraph.title/front.ieeeaccess/handler.ts', line: 'preamble (\\AddToHook{env/abstract/after}{\\LatexLibAccessTitle})' },
  ],
});
