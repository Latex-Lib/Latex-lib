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
    zerotex: 'untested',
  }),
);
