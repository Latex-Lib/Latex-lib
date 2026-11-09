import { defineKey } from '../../../schema/key.ts';
import { minimal } from '../../../schema/minimal.ts';
import { PRESETS } from './presets.ts';

export default defineKey(
  minimal({
    id: 'num.unnumbered',
    node: 'containerBlock/appendix',
    description:
      'An unnumbered appendix entered in the contents by hand: no \\appendix and no letter, the appendix a starred \\chapter*{Title} (or \\section*{Title}) and then \\addcontentsline{toc}{chapter}{Title}; a thesis\'s single appendix chapter under a fixed word, as the Tianjin University thesis\'s \\chapter*{附\\quad 录} on ctexbook.',
    writes: '\\chapter*{…} \\ifdefined\\phantomsection\\phantomsection\\fi \\addcontentsline{toc}{chapter}{…} \\label{…} …',
    ctan: ['latex-base'],
    features: ['unnumbered', 'in-contents'],
    params: {
      level: { type: 'enum', values: ['chapter', 'section'], default: 'chapter', description: 'the appendix a starred chapter or a starred section' },
      name: {
        type: 'tex',
        default: '',
        description: "a fixed heading that replaces the node's title (LaTeX: 附\\quad 录); '' prints the node's title",
      },
      contents: { type: 'tex', default: '', description: "the contents line's text (LaTeX: 附录); '' repeats the heading" },
      toc: { type: 'boolean', default: true, description: 'a line in the contents (\\addcontentsline); false prints the heading alone' },
    },
    presets: PRESETS,
    // \chapter* needs the class's chapter (book, report, ctexbook, theses), \section* its section: the counter stands for the
    // command, as num.appendix's does. \addcontentsline and \phantomsection's test are the kernel's.
    requires: ['counter:{level}'],
    // Typeset ok on ZeroTeX-NG (2026-11-07): tju on ctexbook with hyperref (the contents line 附录 on the heading's page), chapter
    // on book, level section on article with hyperref; \pageref to the label resolves.
    targetEngine: 'yes',
  }),
);
