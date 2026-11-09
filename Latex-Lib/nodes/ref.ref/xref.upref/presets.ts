/**
 * xref.upref's presets: the AMS kit's upref, which the research's amsproc kit ships and no sample loads
 * (Solution/0260-amsproc.md l.62, l.105; upref.dtx l.58-66: "upright references must be obtained via \usepackage{upref}").
 */
import type { Preset } from '../../../schema/params.ts';
import { manual, solution } from '../../evidence.ts';

const source = (file: string, line: string) => ({ kind: 'source', file, line }) as const;

export const PRESETS = {
  ams: {
    description:
      "AMS upright references: \\ref{label} after the target's name when the node gives one (Figure~\\ref{…}), its number upright in a theorem's italic body (upref, with amsgen before it).",
    features: ['named-refs'],
    params: {},
    evidence: [
      solution('0260-amsproc', '62'),
      solution('0260-amsproc', '105'),
      source('Latex Related Research/Latex-lib-main/Source/0260-amsproc/upref.dtx', '58-66, 97-144'),
      manual('upref', 'CTAN package page'),
    ],
  },
} as const satisfies { readonly [name: string]: Preset };
