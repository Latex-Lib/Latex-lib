/**
 * code.tcblisting's presets, each from the templates that use it (`node seed.ts code --rows`).
 */
import type { Preset } from '../../../schema/params.ts';
import { solution } from '../../evidence.ts';

export const PRESETS = {
  titled: {
    description: "tcolorbox's own box round the listing, the caption as its title, small typewriter code (listing only).",
    features: ['syntax-highlighting', 'framed', 'background', 'title-bar', 'captioned'],
    params: {},
    evidence: [solution('0783-exercisebank', '42'), solution('0240-ksp-thesis', '69')],
  },
  'gray-numbered': {
    description: 'A dark grey frame on a 5% grey back, room at the left for line numbers (colframe=darkgray, colback=darkgray!5!white, left=6mm, numbers=left).',
    features: ['syntax-highlighting', 'framed', 'background', 'title-bar', 'line-numbers', 'captioned'],
    params: { colframe: 'darkgray', colback: 'darkgray!5!white', numbers: 'left', left: '6mm' },
    evidence: [solution('0313-iodhbwm', '84'), solution('0114-scu-beamer', '69')],
  },
  cyan: {
    description: 'A cyan frame on a near-white cyan back, 0.95 of the line wide and centred, lines broken.',
    features: ['syntax-highlighting', 'framed', 'background', 'title-bar', 'colored', 'captioned'],
    params: { colframe: 'cyan!75!black', colback: 'cyan!2!white', width: '0.95\\linewidth' },
    evidence: [solution('0474-quizztex', '56'), solution('0948-didec', '73')],
  },
  breakable: {
    description: 'A sharp-cornered box that breaks across pages, for long code (breakable, sharp corners).',
    features: ['syntax-highlighting', 'framed', 'background', 'title-bar', 'breakable', 'captioned'],
    params: { breakable: true, corners: 'sharp' },
    evidence: [solution('0240-ksp-thesis', '69'), solution('0231-tecosaur-bmc', '83')],
  },
} as const satisfies { readonly [name: string]: Preset };
