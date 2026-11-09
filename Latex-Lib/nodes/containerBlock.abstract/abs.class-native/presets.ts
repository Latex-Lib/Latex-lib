/**
 * abs.class-native's presets, each from the templates that use it (`node seed.ts abs --rows`).
 */
import type { Preset } from '../../../schema/params.ts';
import { solution } from '../../evidence.ts';

export const PRESETS = {
  environment: {
    description: "The class's own abstract environment, unstyled: \\begin{abstract} … \\end{abstract} as acmart, IEEEtran, elsarticle or iopjournal print it.",
    features: ['class-styled'],
    params: {},
    evidence: [solution('0035-iop-journals', '44'), solution('0159-deutschesmuseum', '42'), solution('0003-ucsmonograph', '60')],
  },
  command: {
    description: 'The abstract as a preamble command the class stores and \\maketitle prints, \\abstract{…} (sn-jnl, mdpi, aa).',
    writes: '\\LatexLibClassAbstractHere{…}; \\protected\\def\\libClassAbstract{…}\\abstract{\\libClassAbstract}',
    features: ['class-styled'],
    params: { form: 'command' },
    evidence: [solution('0108-lix', '41')],
  },
  // b31: the command form under apa7 and oup-authoring-template, whose \abstract is a storing command (no abstract environment).
  apa7: {
    description: "apa7's abstract: \\abstract{…} in the preamble, which the class stores (\\long\\def\\abstract#1) and its \\maketitle prints on the abstract page, with the keywords under it.",
    writes: '\\LatexLibClassAbstractHere{…}; \\protected\\def\\libClassAbstract{…}\\abstract{\\libClassAbstract}',
    features: ['class-styled'],
    params: { form: 'command' },
    evidence: [
      { kind: 'source', file: 'Latex Related Research/Latex-Template-Examples/class.apa7/main.tex', line: '81-85 (\\abstract{…} in the preamble)' },
      { kind: 'source', file: 'apa7.cls (apa7 2022/07/25 v2.16, MiKTeX snapshot 9766)', line: '785' },
    ],
  },
  oup: {
    description:
      "Oxford University Press (oup-authoring-template) abstract: \\abstract{…} before \\maketitle, which prints it under its centred 'Abstract' heading between the dotted rules (contemporary); paragraphs pass, since the class's non-\\long \\abstract only ever takes the macro holding them.",
    writes: '\\LatexLibClassAbstractHere{…}; \\protected\\def\\libClassAbstract{…}\\abstract{\\libClassAbstract}',
    features: ['class-styled', 'centered'],
    params: { form: 'command' },
    evidence: [
      solution('0914-oup-authoring-template', '39'),
      { kind: 'source', file: 'Latex Related Research/Latex-lib-main/Source/0914-oup-authoring-template/oup-authoring-template.tex', line: '105-113' },
      { kind: 'source', file: 'Latex Related Research/Latex-lib-main/Source/0914-oup-authoring-template/oup-authoring-template.cls', line: '1205, 1564-1640' },
    ],
  },
  // b31: jss's own storing command.
  jss: {
    description: "The Journal of Statistical Software's abstract: \\Abstract{…} in the preamble, which jss prints in its title block (the abstract environment between rules, before the Keywords line) at \\begin{document}.",
    writes: '\\protected\\def\\libClassAbstract{…}\\Abstract{\\libClassAbstract}',
    features: ['class-styled'],
    params: { form: 'command', command: 'Abstract' },
    evidence: [solution('0623-jss', '44'), { kind: 'source', file: 'Latex Related Research/Latex-lib-main/Source/0623-jss/jss.cls', line: '92, 120, 352-354' }],
  },
} as const satisfies { readonly [name: string]: Preset };
