import { defineKey } from '../../../schema/key.ts';
import { minimal } from '../../../schema/minimal.ts';
import { PRESETS } from './presets.ts';

export default defineKey(
  minimal({
    id: 'math.amsmath',
    node: 'containerBlock/blockMath',
    description:
      "amsmath's displays: \\[ … \\] (equation* when it holds a split) or equation for one row, align (on &), gather, multline or split for several, starred when unnumbered; \\numberwithin{equation}{…}, \\allowdisplaybreaks, the fleqn and leqno options. 347 templates.",
    writes: '\\begin{equation} … \\label{…} \\end{equation}, \\[ … \\], \\begin{align} … \\\\ … \\label{…} \\end{align}, \\begin{gather} … \\end{gather}',
    ctan: ['amsmath'],
    features: ['numbered', 'unnumbered', 'numbered-within', 'aligned', 'multiline', 'breakable'],
    params: {
      multiline: { type: 'enum', values: ['auto', 'align', 'gather', 'multline', 'split'], default: 'auto', description: 'several rows: align when a row aligns on &, else gather (auto); or always align, gather, multline, or split inside equation' },
      numberWithin: { type: 'enum', values: ['none', 'section', 'chapter'], default: 'none', description: 'equations numbered within this level (\\numberwithin{equation}{…})' },
      allowBreaks: { type: 'number', default: 0, description: 'multi-row displays may break across pages (\\allowdisplaybreaks[1-4]); 0 never' },
      flushLeft: { type: 'boolean', default: false, compat: true, description: 'displays flush left (the fleqn option)' },
      leftNumbers: { type: 'boolean', default: false, compat: true, description: 'equation numbers at the left (the leqno option)' },
    },
    presets: PRESETS,
    loads: [
      { pkg: 'amsmath' },
      { pkg: 'amsmath', options: ['fleqn'], when: { flushLeft: true } },
      { pkg: 'amsmath', options: ['leqno'], when: { leftNumbers: true } },
    ],
    gives: { math: true },
    targetEngine: 'yes',
  }),
);
