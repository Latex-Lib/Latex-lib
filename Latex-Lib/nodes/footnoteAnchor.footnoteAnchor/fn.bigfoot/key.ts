import { defineKey } from '../../../schema/key.ts';
import { minimal } from '../../../schema/minimal.ts';
import { PRESETS } from './presets.ts';

export default defineKey(
  minimal({
    id: 'fn.bigfoot',
    node: 'footnoteAnchor/footnoteAnchor',
    description:
      'footnotehyper (bigfoot, manyfoot and footnote in the same family): footnotes in tables, long tables and boxes saved and printed at the foot of the page (\\makesavenoteenv{tabular}), linking with hyperref. 6 templates.',
    ctan: ['footnotehyper', 'bigfoot', 'manyfoot'],
    features: ['box-safe', 'numbered'],
    params: {
      environments: { type: 'string', default: 'tabular', description: 'the environments whose footnotes are saved, comma-separated (\\makesavenoteenv each)' },
    },
    presets: PRESETS,
    loads: [
      { pkg: 'footnotehyper' },
    ],
    zerotex: 'yes',
  }),
);
