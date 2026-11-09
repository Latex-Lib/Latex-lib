/**
 * custom.imsart-localdefs's presets: imsart's one form, the author's preamble between \startlocaldefs and \endlocaldefs.
 */
import type { Preset } from '../../../schema/params.ts';

export const PRESETS = {
  imsart: {
    description:
      "Raw LaTeX the author wrote, unchanged in the body, with its preamble lines (data.preamble) inside imsart's \\startlocaldefs … \\endlocaldefs, where the IMS template asks for the author's own definitions.",
    features: [],
    params: {},
    evidence: [
      // "containerBlock.customLatex | General. Emit preamble content between \startlocaldefs and \endlocaldefs." (tier A: aos-template.tex l.55-59, "Please put your definitions here").
      { kind: 'requirement', file: 'Template/template-requirement/IMS_Imsart.md', line: '164' },
    ],
  },
} as const satisfies { readonly [name: string]: Preset };
