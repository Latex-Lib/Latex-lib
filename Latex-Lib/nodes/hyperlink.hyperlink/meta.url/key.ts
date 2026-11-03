import { defineKey } from '../../../schema/key.ts';
import { minimal } from '../../../schema/minimal.ts';
import { PRESETS } from './presets.ts';

export default defineKey(
  minimal({
    id: 'meta.url',
    node: 'hyperlink/hyperlink',
    description:
      "url (or xurl): \\url{…}, the address typeset with breaks at its punctuation (xurl breaks it anywhere), \\urlstyle for its font; the link's text, when it differs, before it in words. 247 templates.",
    ctan: ['url'],
    features: ['url-breaks', 'sans-serif'],
    params: {
      style: { type: 'enum', values: ['tt', 'rm', 'sf', 'same'], default: 'tt', description: "the address's font (\\urlstyle)" },
      anywhere: { type: 'boolean', default: false, description: 'breaks anywhere in the address (xurl)' },
    },
    presets: PRESETS,
    loads: [
      { pkg: 'url' },
      { pkg: 'xurl', when: { anywhere: true } },
    ],
    zerotex: 'untested',
  }),
);
