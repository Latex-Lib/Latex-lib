import { defineKey } from '../../../schema/key.ts';
import { minimal } from '../../../schema/minimal.ts';
import { PRESETS } from './presets.ts';

export default defineKey(
  minimal({
    id: 'xref.cleveref',
    node: 'ref/ref',
    description:
      "cleveref: \\cref{label} (\\Cref at a sentence start), the target's kind and number in words (fig. 2); the options capitalise, noabbrev and nameinlink; loaded after hyperref. 48 templates.",
    ctan: ['cleveref'],
    features: ['named-refs', 'linked', 'capitalised'],
    params: {
      command: { type: 'enum', values: ['cref', 'Cref'], default: 'cref', description: '\\cref, or \\Cref capitalised and unabbreviated' },
      capitalise: { type: 'boolean', default: false, description: 'kinds capitalised everywhere (capitalise)' },
      noabbrev: { type: 'boolean', default: false, description: 'kinds never abbreviated (noabbrev)' },
      nameInLink: { type: 'boolean', default: false, description: 'the kind part of the link (nameinlink)' },
    },
    presets: PRESETS,
    loads: [
      { pkg: 'hyperref' },
      { pkg: 'cleveref' },
      { pkg: 'cleveref', options: ['capitalise'], when: { capitalise: true } },
      { pkg: 'cleveref', options: ['noabbrev'], when: { noabbrev: true } },
      { pkg: 'cleveref', options: ['nameinlink'], when: { nameInLink: true } },
    ],
    loadOrder: [
      { after: 'hyperref', reason: 'cleveref must come after hyperref' },
    ],
    zerotex: 'untested',
  }),
);
