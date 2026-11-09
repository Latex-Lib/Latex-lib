/**
 * tbl.nicematrix's presets, each from the templates that use it (`node seed.ts tbl --rows`)
 * and the two manuals.
 */
import type { Preset } from '../../../schema/params.ts';
import { manual, solution } from '../../evidence.ts';

export const PRESETS = {
  'tblr-grid': {
    description: "tabularray's tblr with X columns sharing the line and every rule drawn (colspec={XX}, hlines, vlines); spans by \\SetCell[c=2]{c}.",
    features: ['floating', 'captioned', 'full-width', 'vertical-rules', 'horizontal-rules', 'cell-spans'],
    params: {},
    evidence: [solution('0108-lix', '58'), manual('tabularray', 'inner specifications: hlines and vlines')],
  },
  'tblr-three-rules': {
    description: 'tblr with booktabs-like rules by tabularray\'s own keys: 1pt above and below (hline{1,Z}), 0.5pt under the header (hline{2}), the header bold (row{1}={font=\\bfseries}).',
    writes: '\\begin{tblr}{colspec={XX}, hspan=minimal, hline{1,Z}={…}, hline{2}={…}, row{1}={font=\\bfseries}} … & … \\\\ \\end{tblr}',
    features: ['floating', 'captioned', 'full-width', 'booktabs-rules', 'cell-spans'],
    params: { lines: 'three', headerBold: true },
    evidence: [solution('0108-lix', '58'), solution('0072-beamertheme-gotham', '62')],
  },
  'tblr-zebra': {
    description: 'tblr with even rows shaded (row{even}={bg=…}) and only the outer rules.',
    writes: '\\begin{tblr}{colspec={XX}, hspan=minimal, hline{1,Z}={…}, row{even}={bg=…}} … & … \\\\ \\end{tblr}',
    features: ['floating', 'captioned', 'full-width', 'zebra-rows', 'background', 'cell-spans'],
    params: { lines: 'outer', zebra: 'black!6' },
    evidence: [manual('tabularray', 'inner specifications: cells, rows and columns')],
  },
  'nice-hvlines': {
    description: "nicematrix's NiceTabular with every rule drawn by its own key (hvlines), left-aligned columns as ragged-right p-columns sharing the line, spans as \\multicolumn paragraphs.",
    writes: '\\begin{NiceTabular}{…}[no-cell-nodes,hvlines] … & … \\\\ \\multicolumn{2}{p{…}}{\\centering …} \\\\ \\end{NiceTabular}',
    features: ['floating', 'captioned', 'vertical-rules', 'horizontal-rules', 'cell-spans'],
    params: { package: 'nicematrix', colspec: 'l' },
    evidence: [solution('0030-seu-ml-assign', '38'), manual('nicematrix', '5.3.2 The keys hvlines, hlines-except-borders and hvlines-except-borders')],
  },
  'nice-zebra': {
    description: 'NiceTabular with rows shaded from the second on (\\rowcolors in the \\CodeBefore) and the inner rules only (hvlines-except-borders), centred columns as p-columns sharing the line.',
    writes: '\\begin{NiceTabular}{…}[no-cell-nodes,hvlines-except-borders] \\CodeBefore \\rowcolors{2}{…}{} \\Body … & … \\\\ \\end{NiceTabular}',
    features: ['floating', 'captioned', 'zebra-rows', 'background', 'vertical-rules', 'horizontal-rules', 'cell-spans'],
    params: { package: 'nicematrix', colspec: 'c', lines: 'inner', zebra: 'gray!15' },
    evidence: [manual('nicematrix', '6.2 The tools of nicematrix in the \\CodeBefore')],
  },
} as const satisfies { readonly [name: string]: Preset };
