/**
 * num.unnumbered's presets, each from the template that uses it.
 */
import type { Preset } from '../../../schema/params.ts';
import { manual } from '../../evidence.ts';

const SOURCE = 'Latex Related Research/Latex-lib-main/Source';

export const PRESETS = {
  chapter: {
    description: "Each appendix an unnumbered chapter, \\chapter*{Title}, with a contents line added by hand (\\addcontentsline{toc}{chapter}{Title}): no \\appendix, no letter.",
    features: ['unnumbered', 'in-contents'],
    params: {},
    evidence: [manual('latex-base', 'LaTeX2e for authors, 4.2 Sectioning: the starred form makes no number and no contents entry; \\addcontentsline adds one')],
  },
  tju: {
    description: 'The Tianjin University thesis\'s single appendix: an unnumbered chapter headed by the fixed word 附\\quad 录 (a full-width space between the two characters), entered in the contents as 附录.',
    writes: '\\chapter*{附\\quad 录} \\ifdefined\\phantomsection\\phantomsection\\fi \\addcontentsline{toc}{chapter}{附录} \\label{…} …',
    features: ['unnumbered', 'in-contents'],
    params: { level: 'chapter', name: '附\\quad 录', contents: '附录' },
    evidence: [
      { kind: 'source', file: `${SOURCE}/0987-twtstudio-tjuthesislatextemplate/Thesis/appendix/appendix.tex`, line: '2-4' },
      { kind: 'source', file: `${SOURCE}/0987-twtstudio-tjuthesislatextemplate/Thesis/tjumain.tex`, line: '8, 84' },
    ],
  },
} as const satisfies { readonly [name: string]: Preset };
