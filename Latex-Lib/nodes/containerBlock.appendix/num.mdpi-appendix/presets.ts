/**
 * num.mdpi-appendix's presets: the MDPI template's appendix, \appendixstart then \appendix, then \section per appendix.
 */
import type { Preset } from '../../../schema/params.ts';
import { solution } from '../../evidence.ts';

const TEMPLATE = 'Latex Related Research/Latex-lib-main/Source/0894-mdpi/template.tex';
const CLS = 'testing-pipeline/settings/classes/files/Definitions/mdpi.cls';

export const PRESETS = {
  mdpi: {
    description:
      "MDPI's appendix: \\appendixstart and \\appendix once, then each appendix as \\section{Title}, a bold 12pt \"Appendix A. Title\" heading lettered A, B, with the figures, tables, equations and statements in it numbered A1, A2 and a contents line \"Appendix A. Title\".",
    features: ['lettered', 'appendix-prefix', 'class-styled'],
    params: {},
    evidence: [
      solution('0894-mdpi', '67'),
      { kind: 'source', file: TEMPLATE, line: '445-452, 467 (\\appendixstart, \\appendix, \\section[\\appendixname~\\thesection]{})' },
      { kind: 'source', file: CLS, line: '1462-1491 (\\mdpi@appendix@printtitle, the contents line), 1496-1525 (\\appendixstart), 1527-1571 (\\appendix)' },
    ],
  },
} as const satisfies { readonly [name: string]: Preset };
