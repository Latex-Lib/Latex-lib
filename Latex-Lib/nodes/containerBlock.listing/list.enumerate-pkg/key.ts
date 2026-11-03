import { defineKey } from '../../../schema/key.ts';
import { minimal } from '../../../schema/minimal.ts';
import { PRESETS } from './presets.ts';

export default defineKey(
  minimal({
    id: 'list.enumerate-pkg',
    node: 'containerBlock/listing',
    description:
      "The enumerate package (tools bundle): a numbered list's labels from a template in brackets, \\begin{enumerate}[(a)] (1, a, A, i, I stand for the counter, braced text is kept); other lists stay the kernel's. 25 templates.",
    ctan: ['enumerate'],
    features: ['numbered', 'custom-labels', 'lettered'],
    params: {
      label: { type: 'string', default: '(a)', description: 'the label template: (a), 1., i., A), {State} A:' },
    },
    presets: PRESETS,
    loads: [
      { pkg: 'enumerate' },
    ],
    deny: [
      { class: 'class.acmart', reason: 'ACM: "changing list definitions is not allowed"', evidence: [{ kind: 'requirement', file: 'Template/template-requirement/ACM.md', line: '118' }] },
    ],
    // A paragraph place, not below cols.vwcol (list.kernel's key says why).
    needs: { paragraph: true },
    zerotex: 'untested',
  }),
);
