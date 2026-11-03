/**
 * front.koma-title's presets, each from the templates that use it (`node seed.ts front --rows`).
 */
import type { Preset } from '../../../schema/params.ts';
import { solution } from '../../evidence.ts';

export const PRESETS = {
  'subject-subtitle': {
    description: "KOMA's title block with a subject above the title and a subtitle under it (\\subject, \\subtitle), then \\maketitle.",
    features: ['subject-line', 'sans-serif', 'centered'],
    params: { subject: 'Report', subtitle: 'Subtitle' },
    evidence: [solution('0020-koma-script', '48'), solution('0231-tecosaur-bmc', '63'), solution('0582-biblatex-juradiss', '49')],
  },
  publishers: {
    description: 'A subtitle and a publisher line at the foot of the title (\\subtitle, \\publishers).',
    features: ['sans-serif', 'centered'],
    params: { subtitle: 'Subtitle', publishers: 'Publisher' },
    evidence: [solution('0777-qrbill', '50'), solution('0240-ksp-thesis', '70')],
  },
  'in-page': {
    description: 'The title block at the head of the first page instead of a title page of its own (\\KOMAoptions{titlepage=false}).',
    features: ['sans-serif', 'centered'],
    params: { titlePage: 'false' },
    evidence: [solution('0279-musuos', '49')],
  },
  'roman-title': {
    description: "The title in the roman family instead of KOMA's sans-serif (\\addtokomafont{title}{\\rmfamily}).",
    features: ['centered'],
    params: { titleFont: '\\rmfamily' },
    evidence: [solution('0146-extsizes', '34'), solution('0173-uni-titlepage', '40')],
  },
} as const satisfies { readonly [name: string]: Preset };
