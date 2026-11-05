import { defineKey } from '../../../schema/key.ts';
import { minimal } from '../../../schema/minimal.ts';
import { PRESETS } from './presets.ts';

export default defineKey(
  minimal({
    id: 'ack.kernel',
    node: 'containerBlock/acknowledgement',
    description:
      'Acknowledgements as an unnumbered heading, \\section*{Acknowledgements} or \\chapter*{…}, entered in the contents by \\addcontentsline when asked, then the text.',
    ctan: ['latex-base'],
    features: ['unnumbered', 'in-contents'],
    params: {
      level: { type: 'enum', values: ['section', 'chapter'], default: 'section', description: 'an unnumbered section or chapter' },
      title: { type: 'string', default: 'Acknowledgements', description: 'the heading when the node has no title' },
      inContents: { type: 'boolean', default: false, description: 'entered in the contents (\\addcontentsline)' },
    },
    presets: PRESETS,
    requires: [
      'counter:{level}',
    ],
    // As num.appendix's: jmlr has a chapter counter but \chapter (starred too) is an error outside its book mode.
    deny: [
      {
        class: 'class.jmlr-pmlr',
        unless: { level: 'section' },
        reason: "jmlr.cls lets \\chapter to artchapter outside its book mode, a class error (l.743-745, 959): \\chapter*{Acknowledgements} stops at 'Class jmlr Error: Chapters not permitted in articles'",
        evidence: [
          { kind: 'source', file: 'jmlr.cls (jmlr 2022/02/09 v1.30, MiKTeX snapshot 9766)', line: '743-745, 959' },
          { kind: 'compile', cell: 'GitHub run b12-5bdc624, jmlr-pmlr.A: ack.kernel@chapter and @chapter-in-contents, 2 of 2 branches fail' },
        ],
      },
    ],
    zerotex: 'untested',
  }),
);
