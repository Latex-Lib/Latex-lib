import { defineKey } from '../../../schema/key.ts';
import { minimal } from '../../../schema/minimal.ts';
import { PRESETS } from './presets.ts';

export default defineKey(
  minimal({
    id: 'fn.kernel',
    node: 'footnoteAnchor/footnoteAnchor',
    description:
      "The kernel's \\footnote{…}, as Flouest's emitter writes it; the marks (\\thefootnote as \\fnsymbol, \\alph, \\roman) and \\counterwithin for per-chapter numbers. 233 templates.",
    ctan: ['latex-base'],
    features: ['numbered', 'symbols', 'numbered-within'],
    params: {
      marks: { type: 'enum', values: ['arabic', 'symbols', 'alph', 'roman'], default: 'arabic', description: 'the footnote marks (\\thefootnote)' },
      numberWithin: { type: 'enum', values: ['none', 'chapter', 'section'], default: 'none', description: 'numbers restart with this level (\\counterwithin{footnote}{…})' },
    },
    presets: PRESETS,
    // \counterwithin needs the counter: per-chapter numbering fits only a class with chapters ('counter:none' names nothing).
    requires: ['counter:{numberWithin}'],
    zerotex: 'untested',
  }),
);
