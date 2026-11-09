import { defineKey } from '../../../schema/key.ts';
import { minimal } from '../../../schema/minimal.ts';
import { PRESETS } from './presets.ts';

export default defineKey(
  minimal({
    id: 'code.escape',
    node: 'codeEscape/codeEscape',
    description:
      "LaTeX escaped from code, between Flouest's escape markers; the code way prints it its own way (listings: between (*@ and @*)).",
    writes: '⟨U+E000⟩…⟨U+E001⟩',
    ctan: ['listings'],
    features: [],
    presets: PRESETS,
    targetEngine: 'untested',
  }),
);
