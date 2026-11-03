/**
 * head.sectsty's presets, each from the templates that use it (`node seed.ts head --rows`).
 */
import type { Preset } from '../../../schema/params.ts';
import { solution } from '../../evidence.ts';

export const PRESETS = {
  sans: {
    description: 'Every heading in sans-serif, \\allsectionsfont{\\sffamily}, bold and sizes as the class has them.',
    features: ['sans-serif', 'bold-head'],
    params: { font: '\\sffamily' },
    evidence: [solution('0138-lund-university-thesis-starter', '57'), solution('0363-tiet-question-paper', '53'), solution('0926-tiet-question-paper', '51')],
  },
  colored: {
    description: 'Headings in an accent colour, each level its own size (\\sectionfont{\\color{…}\\Large}, \\subsectionfont{\\color{…}\\large}).',
    features: ['colored', 'bold-head'],
    params: { font: '', color: 'blue!60!black', scale: 'kernel' },
    evidence: [solution('0722-bitkeks-theolog-ss2017', '47'), solution('0368-sjijon-tex-templates', '59'), solution('0027-schooldocs', '65')],
  },
  'roman-medium': {
    description: 'Headings in the roman medium weight at the class sizes, \\sectionfont{\\rmfamily\\mdseries\\Large}.',
    features: ['upright-body'],
    params: { font: '\\rmfamily\\mdseries', scale: 'kernel' },
    evidence: [solution('0683-amrsekilly-amr-elsekilly-resume-template', '35'), solution('0042-jankapunkt-master-thesis', '49')],
  },
  smallcaps: {
    description: 'Headings in small capitals of the normal weight, \\sectionfont{\\large\\normalfont\\scshape}.',
    features: ['smallcaps-head'],
    params: { font: '\\normalfont\\scshape', scale: 'smaller' },
    evidence: [solution('0222-sara-venkatraman-latex-templates', '77')],
  },
  centered: {
    description: 'Every heading centred without hanging indentation, \\allsectionsfont{\\nohang\\centering} (the run-in levels left as they are).',
    features: ['centered', 'bold-head'],
    params: { font: '', align: 'center' },
    evidence: [{ kind: 'manual', of: 'sectsty', section: '3.1 A complication affecting multiple line headings', url: 'https://ctan.org/pkg/sectsty' }],
  },
} as const satisfies { readonly [name: string]: Preset };
