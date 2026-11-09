/**
 * math.ieeeeqnarray's presets, from the templates and the class source that give it.
 */
import type { Preset } from '../../../schema/params.ts';

const SOURCE = 'Latex Related Research/Latex-lib-main/Source';

export const PRESETS = {
  ieee: {
    description: "IEEE's recommended display: IEEEeqnarray{rCl}, each line's left side, relation and right side in their own columns, every line numbered, starred when unnumbered.",
    features: ['numbered', 'unnumbered', 'aligned', 'multiline', 'class-styled'],
    params: {},
    evidence: [
      { kind: 'source', file: `${SOURCE}/0743-ieeetran-journal/IEEEtran/IEEEtran.cls`, line: '3621-3625 (IEEEeqnarray, IEEEeqnarray*; 2015/08/26 V1.8b)' },
      { kind: 'source', file: `${SOURCE}/0859-ieeetran-compsoc-conference/IEEE-conference-template-062824.tex`, line: '132-134 ("Use {align} or {IEEEeqnarray} instead" of eqnarray)' },
    ],
  },
} as const satisfies { readonly [name: string]: Preset };
