import { defineKey } from '../../../schema/key.ts';
import { minimal } from '../../../schema/minimal.ts';
import { PRESETS } from './presets.ts';

export default defineKey(
  minimal({
    id: 'math.mathtools',
    node: 'containerBlock/blockMath',
    description:
      "mathtools over amsmath: the same displays (equation, align, gather, multline, split) with mathtools' fixes and extensions loaded; \\mathtoolsset{showonlyrefs} numbers only referenced equations. 66 templates.",
    ctan: ['mathtools'],
    features: ['numbered', 'unnumbered', 'numbered-within', 'aligned', 'multiline', 'breakable'],
    params: {
      multiline: { type: 'enum', values: ['auto', 'align', 'gather', 'multline', 'split'], default: 'auto', description: 'several rows: align when a row aligns on &, else gather (auto); or always align, gather, multline, or split inside equation' },
      numberWithin: { type: 'enum', values: ['none', 'section', 'chapter'], default: 'none', description: 'equations numbered within this level (\\numberwithin{equation}{…})' },
      allowBreaks: { type: 'number', default: 0, description: 'multi-row displays may break across pages (\\allowdisplaybreaks[1-4]); 0 never' },
      flushLeft: { type: 'boolean', default: false, compat: true, description: 'displays flush left (the fleqn option)' },
      leftNumbers: { type: 'boolean', default: false, compat: true, description: 'equation numbers at the left (the leqno option)' },
      showOnlyRefs: { type: 'boolean', default: false, description: 'only equations that are referenced get a number (\\mathtoolsset{showonlyrefs})' },
    },
    presets: PRESETS,
    loads: [
      { pkg: 'mathtools' },
      { pkg: 'mathtools', options: ['fleqn'], when: { flushLeft: true } },
      { pkg: 'mathtools', options: ['leqno'], when: { leftNumbers: true } },
    ],
    gives: { math: true },
    zerotex: 'yes',
  }),
);
