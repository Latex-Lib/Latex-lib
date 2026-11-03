/**
 * list.kernel's presets, each from the templates that use it (`node seed.ts list --rows`).
 */
import type { Preset } from '../../../schema/params.ts';
import { solution } from '../../evidence.ts';

export const PRESETS = {
  class: {
    description: "The kernel's itemize, enumerate and description as the class sets them: bullets, then dashes; 1., (a), i.",
    features: ['numbered'],
    params: {},
    evidence: [solution('0025-mpdinbrief', '54'), solution('0079-modernposter', '45'), solution('0134-maehr-uzh-ma-thesis', '70')],
  },
  'paren-numbers': {
    description: 'Numbers and letters closed by a parenthesis, 1) then a) (\\renewcommand{\\labelenumi}{\\arabic{enumi})}).',
    features: ['numbered', 'custom-labels'],
    params: { numbering: 'arabic-paren', numbering2: 'alph-paren' },
    evidence: [solution('0180-simple-thesis-dissertation', '64'), solution('0064-korogodin-nslreport', '69')],
  },
  'letter-paren': {
    description: 'First-level items lettered, a) b) c) (\\renewcommand{\\labelenumi}{\\alph{enumi})}).',
    features: ['numbered', 'custom-labels', 'lettered'],
    params: { numbering: 'alph-paren' },
    evidence: [solution('0191-cloze', '60')],
  },
  triangles: {
    description: 'Small triangles for first-level bullets and round bullets below (\\labelitemi, \\labelitemii).',
    features: ['custom-labels'],
    params: { bullet: '\\small$\\triangleright$', bullet2: '\\textbullet' },
    evidence: [solution('0068-kaobook', '105')],
  },
  dashes: {
    description: 'Bold en dashes for bullets at every level shown (\\labelitemi and \\labelitemii as \\textbf{--}).',
    features: ['custom-labels'],
    params: { bullet: '\\textbf{--}', bullet2: '\\textbf{--}' },
    evidence: [solution('0195-copernicus', '62')],
  },
} as const satisfies { readonly [name: string]: Preset };
