/**
 * para.ieee-parstart's presets: IEEEtran's own command (journal and compsoc), and IEEE Access's \PARstart alias.
 */
import type { Preset } from '../../../schema/params.ts';
import { solution } from '../../evidence.ts';

export const PRESETS = {
  ieeetran: {
    description:
      "IEEEtran's two-line drop cap on the first body paragraph, the rest of the first word in capitals (\\IEEEPARstart{T}{his} …); under compsoc the letter is medium weight and the word in small capitals.",
    features: ['class-styled'],
    params: {},
    evidence: [
      solution('0743-ieeetran-journal', '54'),
      { kind: 'source', file: 'Latex Related Research/Latex-lib-main/Source/0743-ieeetran-journal/IEEEtran/bare_jrnl.tex', line: '477 (\\IEEEPARstart{T}{his} demo file is …)' },
      { kind: 'source', file: 'Latex Related Research/Latex-lib-main/Source/0743-ieeetran-journal/IEEEtran/bare_jrnl_compsoc.tex', line: '540' },
      { kind: 'source', file: 'Latex Related Research/Latex-lib-main/Source/0743-ieeetran-journal/IEEEtran/IEEEtran.cls', line: '5788-5792 (compsoc styles), 5863-5939 (\\IEEEPARstart)' },
    ],
  },
  'ieee-access': {
    description: "IEEE Access's drop cap on the first body paragraph, written with the template's \\PARstart{T}{his} …, which ieeeaccess.cls makes an alias of IEEEtran's \\IEEEPARstart.",
    writes: '\\PARstart{…}{…} …',
    features: ['class-styled'],
    params: { command: 'PARstart' },
    evidence: [
      { kind: 'source', file: 'Template/templates/ieee-access/files/ieeeaccess.cls', line: '1098-1099 (\\let\\PARstart\\IEEEPARstart)' },
      { kind: 'source', file: 'Latex Related Research/Latex-Template-Examples/class.ieeeaccess/main.tex', line: '139 (\\PARstart{T}{his} document is a template …)' },
    ],
  },
} as const satisfies { readonly [name: string]: Preset };
