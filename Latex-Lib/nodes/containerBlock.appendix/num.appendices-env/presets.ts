/**
 * num.appendices-env's presets, each from the templates or requirement documents that use it.
 */
import type { Preset } from '../../../schema/params.ts';
import { manual, solution } from '../../evidence.ts';

export const PRESETS = {
  // A thesis or book: the appendix package's environment round chapters, lettered "Appendix A".
  chapters: {
    description: 'The appendix package\'s appendices environment round each appendix, as a chapter ("Appendix A" in book and report); the letter carries from one environment to the next.',
    writes: '\\usepackage{appendix}; \\begin{appendices} \\chapter{…} \\label{…} … \\end{appendices}',
    features: ['lettered', 'appendix-prefix'],
    params: { level: 'chapter' },
    evidence: [
      manual('appendix', '2 The appendix package: the appendices environment'),
      solution('0256-ksiminski-polsl-aei-theses', '53'),
      { kind: 'source', file: 'appendix.sty (2020/02/08 v1.2c, TinyTeX texmf-dist/tex/latex/appendix)', line: '88-93, 181-241 (\\restoreapp at \\begin, \\@ppsaveapp at \\end)' },
    ],
  },
  // sn-jnl loads appendix[title] itself (sn-jnl.ts preloads): "Appendix A" comes from the class, so the title defaults to empty.
  'sn-jnl': {
    description: 'Springer Nature: each appendix in \\begin{appendices} … \\end{appendices} with \\section{Title}, the class printing "Appendix A" (its appendix[title]); an untitled appendix prints the word and letter alone.',
    features: ['lettered', 'appendix-prefix'],
    params: { load: false, fallbackTitle: '' },
    evidence: [
      { kind: 'requirement', file: 'Template/template-requirement/Springer_Nature_SN_Jnl.md', line: '115-116, 154' },
    ],
  },
  // oup-authoring-template.tex l.835-992: one appendices environment round every appendix; the class embeds appendix.sty.
  oup: {
    description: "OUP: the class's appendices environment opened once at the first appendix (\\appendices) and left open, then each appendix as \\section{Title}, lettered A, B.",
    writes: '\\ifdefined\\LibAppendicesOpened\\else\\appendices…\\fi \\section{…} \\label{…} …',
    features: ['lettered'],
    params: { load: false, mode: 'openOnce' },
    evidence: [
      { kind: 'source', file: 'Latex Related Research/Latex-lib-main/Source/0914-oup-authoring-template/oup-authoring-template.tex', line: '835-992' },
      { kind: 'source', file: 'Latex Related Research/Latex-lib-main/Source/0914-oup-authoring-template/oup-authoring-template.cls', line: '2719-2960' },
      solution('0914-oup-authoring-template', '46'),
    ],
  },
  // IMS: "Appendices should be provided in {appendix} environment"; the class prints "APPENDIX A:" itself.
  imsart: {
    description: 'IMS (imsart): each appendix in \\begin{appendix} … \\end{appendix} with \\section{Title}, the class printing "APPENDIX A:"; the title defaults to empty, and the letter is carried from one environment to the next.',
    writes: '\\begin{appendix} \\ifdefined\\LibAppendixCarry\\setcounter{section}{…}\\fi \\section{…} \\label{…} … \\xdef\\LibAppendixCarry{…} \\end{appendix}',
    features: ['lettered', 'appendix-prefix'],
    params: { env: 'appendix', load: false, fallbackTitle: '' },
    evidence: [{ kind: 'requirement', file: 'Template/template-requirement/IMS_Imsart.md', line: '125-127, 158' }],
  },
} as const satisfies { readonly [name: string]: Preset };
