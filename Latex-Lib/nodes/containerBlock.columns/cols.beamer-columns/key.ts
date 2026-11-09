import { defineKey } from '../../../schema/key.ts';
import { minimal } from '../../../schema/minimal.ts';
import { PRESETS } from './presets.ts';

export default defineKey(
  minimal({
    id: 'cols.beamer-columns',
    node: 'containerBlock/columns',
    description:
      "beamer's own columns on a slide, \\begin{columns}[T] \\begin{column}{0.48\\textwidth} … \\end{column} … \\end{columns}, inside a frame: columns of equal width, the blocks (split at blank lines outside every environment and group) shared out across them in order; top-, centre- or bottom-aligned ([T], [c], [b]), onlytextwidth to keep them to the text width. beamer and ctexbeamer. 40 templates.",
    writes: '\\begin{columns}[T] \\begin{column}{…\\textwidth} … \\end{column} … \\end{columns}',
    ctan: ['beamer'],
    features: ['parallel-columns'],
    params: {
      align: { type: 'enum', values: ['T', 'c', 'b'], default: 'T', description: 'the vertical alignment of the columns: on their first lines (T), centred (c), or on their last lines (b)' },
      onlytextwidth: { type: 'boolean', default: false, description: 'the columns kept to the text width (onlytextwidth), not the whole slide width' },
    },
    presets: PRESETS,
    // beamerbaseframecomponents.sty l.212 (\newenvironment<>{columns}[1][]) and l.258 (column): beamer's, not the kernel's.
    requires: ['env:columns', 'env:column'],
    // ctexbeamer is beamer with ctex's fonts (its profile's base); it is listed as well, since its profile is read on its own.
    only: ['class.beamer', 'class.ctexbeamer'],
    // Each column is a box of its own width: a float in it is 'Not in outer par mode', and it does not break across frames.
    // Its place is inside a frame (beamer prints nothing outside one); no context flag says so, the template's frames do.
    gives: { columns: true, floats: false, breakable: false },
    targetEngine: 'yes',
  }),
);
