import { defineKey } from '../../../schema/key.ts';
import { minimal } from '../../../schema/minimal.ts';
import { PRESETS } from './presets.ts';

export default defineKey(
  minimal({
    id: 'pg.break',
    node: 'atomicBlock/pageBreak',
    description:
      "The kernel's page breaks: \\clearpage (floats placed first), \\newpage, \\cleardoublepage (a right-hand page), \\pagebreak. 325 templates.",
    ctan: ['latex-base'],
    features: ['float-flush', 'odd-page'],
    params: {
      command: { type: 'enum', values: ['clearpage', 'newpage', 'cleardoublepage', 'pagebreak'], default: 'clearpage', description: 'the break' },
    },
    presets: PRESETS,
    zerotex: 'untested',
  }),
);
