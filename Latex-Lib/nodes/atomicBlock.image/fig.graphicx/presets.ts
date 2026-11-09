/**
 * fig.graphicx's presets, each from the templates that use it (`node seed.ts fig --rows`).
 */
import type { Preset } from '../../../schema/params.ts';
import { manual, solution } from '../../evidence.ts';

const ACMART = 'Latex Related Research/Latex-lib-main/Source/0665-acmart/acmart.dtx';

export const PRESETS = {
  centered: {
    description: 'A figure float placed where LaTeX finds room (htbp), the image centred at its width of the line, the caption below.',
    features: ['floating', 'centered', 'captioned', 'scaled'],
    params: {},
    evidence: [solution('0125-eurographics', '47'), solution('0228-tikz', '35'), solution('0042-jankapunkt-master-thesis', '64')],
  },
  'top-or-bottom': {
    description: 'A figure only at the top or bottom of a page or on a float page (tbp), never in the text.',
    features: ['floating', 'centered', 'captioned', 'scaled'],
    params: { placement: 'tbp' },
    evidence: [solution('0070-ntgclass', '44'), solution('0432-langsci', '55')],
  },
  wide: {
    description: 'A figure across both columns of a two-column page (figure*), at the text width.',
    writes: '\\begin{figure*}[…] \\centering \\includegraphics[width=…\\textwidth]{…} \\caption{…} \\label{…} \\end{figure*}',
    features: ['floating', 'centered', 'captioned', 'scaled', 'full-width'],
    params: { span: true, unit: 'textwidth', placement: 'tbp' },
    evidence: [solution('0125-eurographics', '47')],
  },
  'graphics-folder': {
    description: 'Images looked up in a folder of their own (\\graphicspath{{images/}}), in a centred figure float.',
    writes: '\\begin{figure}[…] \\centering \\includegraphics[width=…]{…} \\caption{…} \\label{…} \\end{figure}; \\graphicspath{{…/}}',
    features: ['floating', 'centered', 'captioned', 'scaled'],
    params: { graphicsPath: 'images' },
    evidence: [solution('0004-lebhart', '46'), solution('0197-unbtex-university-of-bras-lia-thesis', '48'), solution('0088-tinoryj-uestc-thesis-latex-template', '74')],
  },
  inline: {
    description: 'The image alone, not in a float, at a fixed width (a logo, a photo, a signature): \\includegraphics[width=…]{…} in the text.',
    writes: '\\noindent\\includegraphics[width=…]{…} \\refstepcounter{figure} \\label{…}',
    features: ['scaled'],
    params: { float: false, center: false },
    evidence: [solution('0105-unswcover', '34'), solution('0142-topletter', '46'), solution('0035-iop-journals', '40')],
  },
  'acm-described': {
    description: "acmart's figure: a centred figure float with \\Description{…} after the caption, the text description ACM asks of every image (acmart warns 'A possible image without description' without it).",
    writes: '\\begin{figure}[…] \\centering \\includegraphics[width=…]{…} \\caption{…} \\Description{…} \\label{…} \\end{figure}',
    features: ['floating', 'centered', 'captioned', 'scaled', 'class-styled'],
    params: { describe: true },
    evidence: [
      { kind: 'source', file: ACMART, line: '1460-1480 (\\Description in every figure), 4134, 4173-4185' },
      manual('acmart', 'Figures and tables: \\Description'),
      solution('0665-acmart', '73'),
    ],
  },
  'acm-wide-described': {
    description: "acmart's two-column figure: figure* at the text width (sigconf, sigplan, acmtog), with \\Description{…} after the caption.",
    writes: '\\begin{figure*}[…] \\centering \\includegraphics[width=…\\textwidth]{…} \\caption{…} \\Description{…} \\label{…} \\end{figure*}',
    features: ['floating', 'centered', 'captioned', 'scaled', 'full-width', 'class-styled'],
    params: { describe: true, span: true, unit: 'textwidth', placement: 'tbp' },
    evidence: [
      { kind: 'source', file: ACMART, line: '1370-1388 (figure* across the text width in two-column formats, \\textwidth), 4176, 4182-4185' },
      manual('acmart', 'Figures and tables'),
    ],
  },
  'letter-centered': {
    description: 'The image centred in the text, with no float, caption or label: the letter class has no figure environment or counter.',
    writes: '\\begin{center} \\includegraphics[width=…]{…} \\end{center}',
    features: ['centered', 'scaled'],
    params: { float: false, center: true, numberInline: false },
    evidence: [
      { kind: 'requirement', file: 'Template/template-requirement/Letter.md', line: '110-116' },
      { kind: 'requirement', file: 'Template/template-requirement/Letter.md', line: '196' },
    ],
  },
} as const satisfies { readonly [name: string]: Preset };
