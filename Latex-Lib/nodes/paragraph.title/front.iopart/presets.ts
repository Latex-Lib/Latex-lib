/**
 * front.iopart's presets. IOP's own iopart template is the evidence (Latex-Template-Examples/class.iopart/main.tex
 * l.101-118); no Solution file of the research uses iopart.cls.
 */
import type { Preset } from '../../../schema/params.ts';

const EXAMPLE = { kind: 'source', file: 'Latex Related Research/Latex-Template-Examples/class.iopart/main.tex', line: '101-118' } as const;
const PROFILE = { kind: 'source', file: 'Latex-Lib/classes/iopart.ts', line: '10-19' } as const;

export const PRESETS = {
  'after-abstract': {
    description:
      "IOP's iopart front matter: \\title[short]{full}, \\author with the affiliations' numbers, \\address and \\ead at the title's place; after the abstract the keywords line, \\submitto{\\JPA} and \\maketitle, as IOP's template orders them.",
    features: ['class-styled'],
    params: { submitTo: '\\JPA' },
    evidence: [EXAMPLE, PROFILE],
  },
  'after-title': {
    description:
      "The same iopart front matter with the keywords line, \\submitto and \\maketitle straight after the e-mail line, for a paper with no abstract.",
    writes: '\\title[…]{…} \\author{…$^{1}$, … and …} \\address{$^{1}$ …} \\ead{…} \\noindent{\\it Keywords\\/}: … \\submitto{…} \\maketitle',
    features: ['class-styled'],
    params: { frontEnd: 'after-title', submitTo: '\\JPA' },
    evidence: [EXAMPLE, PROFILE],
  },
  'two-column': {
    description: "The iopart front matter after the abstract, then \\ioptwocol, which sets the rest of the paper in two columns as IOP's preview does.",
    writes: '\\title[…]{…} \\author{…$^{1}$, … and …} \\address{$^{1}$ …} \\ead{…}; \\AddToHook{env/abstract/after}{\\noindent{\\it Keywords\\/}: … \\submitto{…}\\maketitle\\ioptwocol}',
    features: ['class-styled'],
    params: { submitTo: '\\JPA', twoColumn: true },
    evidence: [EXAMPLE, PROFILE],
  },
} as const satisfies { readonly [name: string]: Preset };
