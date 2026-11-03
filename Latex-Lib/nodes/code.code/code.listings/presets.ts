/**
 * code.listings's presets, each from the templates that use it (`node seed.ts code --rows`).
 */
import type { Preset } from '../../../schema/params.ts';
import { solution } from '../../evidence.ts';

export const PRESETS = {
  plain: {
    description: 'Code in small typewriter type, keywords bold, comments italic, lines broken when too long; no numbers, no frame.',
    features: ['syntax-highlighting', 'escape-latex', 'captioned'],
    params: {},
    evidence: [solution('0110-invoice-class', '57'), solution('0030-seu-ml-assign', '41'), solution('0240-ksp-thesis', '69')],
  },
  'numbered-colored': {
    description: 'Line numbers at the left in tiny grey, keywords in blue, comments green, strings purple, on a pale background (an \\lstdefinestyle as most thesis templates write it).',
    features: ['syntax-highlighting', 'line-numbers', 'colored', 'background', 'escape-latex', 'captioned'],
    params: { numbers: 'left', keywordStyle: '\\bfseries\\color{blue!70!black}', commentStyle: '\\itshape\\color{green!45!black}', stringStyle: '\\color{purple!80!black}', numberStyle: '\\tiny\\color{gray}', background: 'gray!6' },
    evidence: [solution('0074-tlc-article', '72'), solution('0081-uithesis', '89'), solution('0005-cococo2000-ict-beamer', '39')],
  },
  framed: {
    description: 'A single frame round the code, line numbers at the left, footnote-size type, tabs of four.',
    features: ['syntax-highlighting', 'line-numbers', 'framed', 'escape-latex', 'captioned'],
    params: { font: '\\ttfamily\\footnotesize', numbers: 'left', frame: 'single', tabsize: 4 },
    evidence: [solution('0064-korogodin-nslreport', '76'), solution('0088-tinoryj-uestc-thesis-latex-template', '80')],
  },
  'gray-flexible': {
    description: 'A grey background, comments in grey upright type, flexible columns so the code keeps its natural spacing.',
    features: ['syntax-highlighting', 'background', 'escape-latex', 'captioned'],
    params: { font: '\\ttfamily', commentStyle: '\\color{gray}\\upshape', background: 'gray!10', columns: 'fullflexible' },
    evidence: [solution('0042-jankapunkt-master-thesis', '71'), solution('0059-ftc-notebook', '77')],
  },
} as const satisfies { readonly [name: string]: Preset };
