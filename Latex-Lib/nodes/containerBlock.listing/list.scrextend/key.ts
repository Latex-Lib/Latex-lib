import { defineKey } from '../../../schema/key.ts';
import { minimal } from '../../../schema/minimal.ts';
import { PRESETS } from './presets.ts';

export default defineKey(
  minimal({
    id: 'list.scrextend',
    node: 'containerBlock/listing',
    description:
      "KOMA's scrextend: a description list as a labeling list, \\begin{labeling}[separator]{widest label}, labels aligned in a column, their font through the labelinglabel element; other lists stay the kernel's. 8 templates.",
    ctan: ['koma-script'],
    features: ['aligned-labels', 'bold-head'],
    params: {
      widest: { type: 'string', default: 'Description', description: 'the widest label, which sets the label column' },
      separator: { type: 'string', default: '', description: "text after each label (the optional argument); ''" },
      labelFont: { type: 'tex', default: '', description: "the labels' font (\\setkomafont{labelinglabel}); ''" },
    },
    presets: PRESETS,
    loads: [
      { pkg: 'scrextend' },
    ],
    deny: [
      { class: 'class.acmart', reason: 'ACM: "changing list definitions is not allowed"', evidence: [{ kind: 'requirement', file: 'Template/template-requirement/ACM.md', line: '118' }] },
    ],
    // A paragraph place, not below cols.vwcol (list.kernel's key says why).
    needs: { paragraph: true },
    zerotex: 'untested',
  }),
);
