import { defineKey } from '../../../schema/key.ts';
import { minimal } from '../../../schema/minimal.ts';
import { PRESETS } from './presets.ts';

export default defineKey(
  minimal({
    id: 'pg.afterpage',
    node: 'atomicBlock/pageBreak',
    description:
      'afterpage: the break waits until the current page is full, \\afterpage{\\clearpage}, so the page is not left short. 22 templates.',
    ctan: ['afterpage'],
    features: ['deferred', 'float-flush', 'odd-page'],
    params: {
      command: { type: 'enum', values: ['clearpage', 'cleardoublepage', 'newpage'], default: 'clearpage', description: 'the break run once the page is full' },
    },
    presets: PRESETS,
    loads: [
      { pkg: 'afterpage' },
    ],
    zerotex: 'untested',
  }),
);
