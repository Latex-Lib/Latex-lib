/**
 * doc.minimal-provide's presets, from the class.minimal example, the one template written for the kernel's minimal class.
 */
import type { Preset } from '../../../schema/params.ts';

export const PRESETS = {
  minimal: {
    description:
      "Everything the minimal class leaves out: the type sizes at 10pt, \\today, a titlepage environment, the list margins and labels of two levels, and the footnote spacing, as the class.minimal example supplies them.",
    features: [],
    params: { sizes: true, today: true, titlepage: true, lists: true, footnotes: true },
    evidence: [
      { kind: 'source', file: 'Latex Related Research/Latex-Template-Examples/class.minimal/main.tex', line: '40-68' },
      { kind: 'source', file: 'Latex Related Research/Latex-lib-main/Source/0577-latex-base-dev/minimal.cls', line: '33-42' },
    ],
  },
} as const satisfies { readonly [name: string]: Preset };
