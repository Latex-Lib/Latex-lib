/**
 * thm.class-native's preset: the class's own environments, as they are.
 */
import type { Preset } from '../../../schema/params.ts';

const solution = (file: string, lines: string) => ({ kind: 'solution', file: `Solution/${file}.md`, lines }) as const;

export const PRESETS = {
  native: {
    description: "The class's own theorem environments with its own style and numbering; a kind the class lacks is declared with \\newtheorem, which takes the class's current style.",
    features: ['class-styled', 'numbered'],
    params: {},
    evidence: [solution('0019-stylish-article', '38'), solution('0151-siam-siamonline', '53'), solution('0093-foiltex', '52'), solution('0743-ieeetran-journal', '74')],
  },
  elsarticle: {
    description: "elsarticle's own commands: theorem-like kinds with \\newtheorem (bold head, italic body), definitions, examples and remarks with \\newdefinition (upright body).",
    features: ['class-styled', 'numbered', 'bold-head', 'italic-body', 'upright-body'],
    params: { uprightCommand: '\\newdefinition' },
    evidence: [solution('0107-elsarticle', '53'), { kind: 'requirement', file: 'Template/template-requirement/Elsarticle.md', line: '113' }],
  },
} as const satisfies { readonly [name: string]: Preset };
