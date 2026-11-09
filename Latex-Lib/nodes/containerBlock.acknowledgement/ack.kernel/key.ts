import { defineKey } from '../../../schema/key.ts';
import { minimal } from '../../../schema/minimal.ts';
import { PRESETS } from './presets.ts';

export default defineKey(
  minimal({
    id: 'ack.kernel',
    node: 'containerBlock/acknowledgement',
    description:
      'Acknowledgements as an unnumbered heading, \\section*{Acknowledgements}, \\chapter*{…}, \\subsection*{…}, \\subsubsection*{Acknowledgments} (aistats, iclr, tmlr, colm) or a run-in \\paragraph{Acknowledgements}, starred or not, entered in the contents by \\addcontentsline when asked, then the text.',
    writes: '\\section*{Acknowledgements} … | \\chapter*{…} … | \\subsection*{…} … | \\subsubsection*{…} … | \\paragraph{…} …',
    ctan: ['latex-base'],
    features: ['unnumbered', 'in-contents', 'run-in-head'],
    params: {
      level: {
        type: 'enum',
        values: ['section', 'chapter', 'subsection', 'subsubsection', 'paragraph'],
        default: 'section',
        description: 'the heading level: a section, chapter, subsection, subsubsection or run-in paragraph',
      },
      starred: { type: 'boolean', default: true, description: 'the starred heading (\\section*), unnumbered; false for the plain command, as \\paragraph{Acknowledgements}' },
      title: { type: 'string', default: 'Acknowledgements', description: 'the heading when the node has no title' },
      inContents: { type: 'boolean', default: false, description: 'entered in the contents (\\addcontentsline), for a starred heading' },
    },
    presets: PRESETS,
    requires: [
      'counter:{level}',
    ],
    // As num.appendix's: jmlr has a chapter counter but \chapter (starred too) is an error outside its book mode.
    deny: [
      {
        class: 'class.jmlr-pmlr',
        // Every level but chapter: jmlr defines the others as article does.
        unless: { level: ['section', 'subsection', 'subsubsection', 'paragraph'] },
        reason: "jmlr.cls lets \\chapter to artchapter outside its book mode, a class error (l.743-745, 959): \\chapter*{Acknowledgements} stops at 'Class jmlr Error: Chapters not permitted in articles'",
        evidence: [
          { kind: 'source', file: 'jmlr.cls (jmlr 2022/02/09 v1.30, MiKTeX snapshot 9766)', line: '743-745, 959' },
          { kind: 'compile', cell: 'GitHub run b12-5bdc624, jmlr-pmlr.A: ack.kernel@chapter and @chapter-in-contents, 2 of 2 branches fail' },
        ],
      },
    ],
    // Typeset on ZeroTeX-NG (2026-11-07): every level, starred and \paragraph{…} unstarred, with \addcontentsline, under
    // article; \subsubsection* under aistats2026 [accepted] and iclr2026_conference; subsection to paragraph under jmlr.
    targetEngine: 'yes',
  }),
);
