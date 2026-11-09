import { defineKey } from '../../../schema/key.ts';
import { minimal } from '../../../schema/minimal.ts';
import { PRESETS } from './presets.ts';

export default defineKey(
  minimal({
    id: 'ack.bmhead',
    node: 'containerBlock/acknowledgement',
    description:
      "Springer Nature's (sn-jnl) back-matter acknowledgements: \\backmatter, run once per document, then the class's unnumbered bold run-in back-matter head \\bmhead{Acknowledgements} and the text, never a \\section.",
    writes: '\\backmatter \\bmhead{Acknowledgements} …',
    ctan: ['sn-jnl'],
    features: ['class-styled', 'unnumbered', 'run-in-head', 'bold-head'],
    params: {
      title: { type: 'tex', default: 'Acknowledgements', description: "the head when the node has no title (the template's word, sn-article.tex l.545)" },
    },
    presets: PRESETS,
    requires: ['cmd:\\backmatter', 'cmd:\\bmhead'],
    only: ['class.sn-jnl'],
    targetEngine: 'untested',
  }),
);
