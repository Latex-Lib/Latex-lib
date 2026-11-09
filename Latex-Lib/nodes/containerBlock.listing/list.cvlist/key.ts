import { defineKey } from '../../../schema/key.ts';
import { minimal } from '../../../schema/minimal.ts';
import { PRESETS } from './presets.ts';

export default defineKey(
  minimal({
    id: 'list.cvlist',
    node: 'containerBlock/listing',
    description:
      "moderncv: a list as the CV's lines in its main column, one \\cvlistitem{…} per item (or two side by side, \\cvlistdoubleitem{…}{…}), a described item \\cvitem{term}{text} with its term in the hints column, an enumerate a kernel enumerate inside \\cvitem{}{…}.",
    writes: '\\cvlistitem{…} \\cvitem{…}{…}',
    ctan: ['moderncv'],
    features: ['class-styled'],
    params: {
      double: { type: 'boolean', default: false, description: 'two items side by side on each line (\\cvlistdoubleitem)' },
    },
    presets: PRESETS,
    // moderncv.cls l.568-584 declares \cvitem, \cvlistitem and \cvlistdoubleitem and each body style sets them (moderncvbodyi.sty
    // l.91-123, moderncvbodyvi.sty l.91-126); classes/moderncv.ts defines all three.
    requires: ['cmd:\\cvlistitem', 'cmd:\\cvitem'],
    requiresWhen: [{ when: { double: true }, requires: ['cmd:\\cvlistdoubleitem'] }],
    only: ['class.moderncv'],
    needs: { paragraph: true },
    targetEngine: 'yes',
  }),
);
