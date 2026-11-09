/**
 * cols.beamer-columns's presets, each from the templates that use it (the research's Solution files) or beamer's user guide.
 */
import type { Preset } from '../../../schema/params.ts';
import { manual, solution } from '../../evidence.ts';

export const PRESETS = {
  top: {
    description: "beamer's columns, top-aligned on their first lines ([T]), of equal width, the blocks shared out in order.",
    features: ['parallel-columns'],
    params: {},
    evidence: [solution('0106-kmbeamer-blackboard', '48'), solution('0803-sjtu-beamer', '62'), solution('0001-digital-minimal', '66')],
  },
  centered: {
    description: "beamer's columns centred on each other vertically ([c]).",
    writes: '\\begin{columns}[c] \\begin{column}{…\\textwidth} … \\end{column} … \\end{columns}',
    features: ['parallel-columns'],
    params: { align: 'c' },
    evidence: [manual('beamer', 'Splitting a frame into multiple columns: the c option')],
  },
  bottom: {
    description: "beamer's columns aligned on their last lines ([b]).",
    writes: '\\begin{columns}[b] \\begin{column}{…\\textwidth} … \\end{column} … \\end{columns}',
    features: ['parallel-columns'],
    params: { align: 'b' },
    evidence: [manual('beamer', 'Splitting a frame into multiple columns: the b option')],
  },
  'text-width': {
    description: "beamer's top-aligned columns kept to the text width ([T,onlytextwidth]) instead of the whole slide width.",
    writes: '\\begin{columns}[T,onlytextwidth] \\begin{column}{…\\textwidth} … \\end{column} … \\end{columns}',
    features: ['parallel-columns'],
    params: { onlytextwidth: true },
    evidence: [solution('0114-scu-beamer', '63')],
  },
} as const satisfies { readonly [name: string]: Preset };
