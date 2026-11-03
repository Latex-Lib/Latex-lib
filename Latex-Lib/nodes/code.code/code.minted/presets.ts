/**
 * code.minted's presets, each from the templates that use it (`node seed.ts code --rows`).
 */
import type { Preset } from '../../../schema/params.ts';
import { solution } from '../../evidence.ts';

export const PRESETS = {
  'framed-small': {
    description: 'Pygments highlighting in a single frame, small type, long lines broken (\\setminted{frame=single, breaklines, fontsize=\\small}).',
    features: ['syntax-highlighting', 'framed', 'external-tool'],
    params: { frame: 'single', fontsize: '\\small', style: 'lovelace' },
    evidence: [solution('0016-rho-class-research-article', '90')],
  },
  colorful: {
    description: "Pygments' colorful style, footnote size, lines broken (\\usemintedstyle{colorful}).",
    features: ['syntax-highlighting', 'colored', 'external-tool'],
    params: { style: 'colorful', fontsize: '\\footnotesize' },
    evidence: [solution('0191-cloze', '56')],
  },
  background: {
    description: 'Code on a tinted background, footnote size, common indentation removed (bgcolor, autogobble).',
    features: ['syntax-highlighting', 'background', 'external-tool'],
    params: { background: 'gray!8', fontsize: '\\footnotesize', autogobble: true },
    evidence: [solution('0211-wallcalendar', '68'), solution('0552-worcestersociety-homeworktemplate', '46')],
  },
  numbered: {
    description: 'Line numbers, lines broken, tabs of four, the autumn style.',
    features: ['syntax-highlighting', 'line-numbers', 'external-tool'],
    params: { linenos: true, tabsize: 4, style: 'autumn' },
    evidence: [solution('0231-tecosaur-bmc', '83'), solution('0674-greenpark-buaa-beamer', '72')],
  },
} as const satisfies { readonly [name: string]: Preset };
