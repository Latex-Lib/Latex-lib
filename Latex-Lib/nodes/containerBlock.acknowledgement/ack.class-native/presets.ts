/**
 * ack.class-native's presets: the class's own acknowledgements environment, one preset per spelling the classes give.
 */
import type { Preset } from '../../../schema/params.ts';
import { solution } from '../../evidence.ts';

export const PRESETS = {
  acks: {
    description: "acmart's acknowledgements environment, \\begin{acks} … \\end{acks}, which the class titles and hides in anonymous review.",
    writes: '\\begin{acks} … \\end{acks}',
    features: ['class-styled'],
    params: {},
    evidence: [solution('0346-anonymous-acm', '39'), solution('0332-ejp-electronic-communications-in-probabi', '44')],
  },
  acknowledgements: {
    description:
      "The class's \\begin{acknowledgements} … \\end{acknowledgements}: aa's small run-in 'Acknowledgements.' at 0.81 spacing, quantumarticle's and spie's unnumbered heading, ut-thesis's front-matter page.",
    writes: '\\begin{acknowledgements} … \\end{acknowledgements}',
    features: ['class-styled'],
    params: { env: 'acknowledgements' },
    evidence: [
      { kind: 'source', file: 'testing-pipeline/settings/classes/files/aa.cls', line: '1351-1372 (nopar run-in name, \\newenvironment{acknowledgements}, \\let\\acknowledgement)' },
      solution('0411-aanda', '44'),
      { kind: 'source', file: 'quantumarticle.cls (CTAN quantumarticle)', line: '1500 (acknowledgements: \\section*{Acknowledgements})' },
      { kind: 'source', file: 'spie.cls (CTAN spie)', line: '300-304 (acknowledgments and acknowledgements)' },
    ],
  },
  acknowledgments: {
    description:
      "The class's \\begin{acknowledgments} … \\end{acknowledgments}, an unnumbered heading in the class's own style: revtex's \\section*{\\acknowledgmentsname} with its contents line, aastex's upper-cased heading (boxed away behind a notice in anonymous review), spie's ACKNOWLEDGMENTS.",
    writes: '\\begin{acknowledgments} … \\end{acknowledgments}',
    features: ['class-styled', 'unnumbered'],
    params: { env: 'acknowledgments' },
    evidence: [
      { kind: 'source', file: 'Latex Related Research/Latex-lib-main/Source/0908-aip-conference-proceedings/tex/latex/revtex/revtex4-2.cls', line: '6578-6595, 7505' },
      solution('0908-aip-conference-proceedings', '44'),
      { kind: 'source', file: 'testing-pipeline/settings/classes/files/aastex701.cls', line: '7700-7769' },
      solution('0563-aastex', '41'),
    ],
  },
  acknowledgement: {
    description: "achemso's \\begin{acknowledgement} … \\end{acknowledgement}, which prints \\section*{\\acknowledgementname} ('Acknowledgement') and changes form in the class's two-column and communication layouts.",
    writes: '\\begin{acknowledgement} … \\end{acknowledgement}',
    features: ['class-styled', 'unnumbered'],
    params: { env: 'acknowledgement' },
    evidence: [{ kind: 'source', file: 'Latex Related Research/Latex-lib-main/Source/0528-achemso/achemso.dtx', line: '2009-2023' }, solution('0528-achemso', '42')],
  },
  ack: {
    description: "neurips' and ecai's \\begin{ack} … \\end{ack}: the style's heading ('Acknowledgments and Disclosure of Funding' under neurips), and the text dropped in the anonymous submission.",
    writes: '\\begin{ack} … \\end{ack}',
    features: ['class-styled', 'unnumbered'],
    params: { env: 'ack' },
    evidence: [
      { kind: 'source', file: 'Latex Related Research/Latex-lib-main/Source/0506-neurips/neurips_2026.sty', line: '110-114, 406-407' },
      solution('0506-neurips', '73'),
      { kind: 'source', file: 'testing-pipeline/settings/classes/files/ecai.cls (2023/12/10 v04)', line: '1246-1250 (ack, doubleblind)' },
    ],
  },
  'imsart-acks': {
    description:
      "imsart's \\begin{acks}[title] … \\end{acks}, the node's title as its \\section* heading (the class's 'Acknowledgments' when it has none), and a funding title as \\begin{funding} … \\end{funding} with its fixed 'Funding' heading.",
    writes: '\\begin{acks}[…] … \\end{acks} | \\begin{funding} … \\end{funding}',
    features: ['class-styled', 'unnumbered'],
    params: { titleOption: true, fundingEnv: 'funding' },
    evidence: [
      { kind: 'requirement', file: 'Template/template-requirement/IMS_Imsart.md', line: '118-121' },
      { kind: 'source', file: 'imsart.sty (CTAN imsart)', line: '4842-4866 (acks with its optional title, funding)' },
    ],
  },
} as const satisfies { readonly [name: string]: Preset };
