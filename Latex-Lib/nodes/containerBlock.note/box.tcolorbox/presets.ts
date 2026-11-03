/**
 * box.tcolorbox's presets, each from the templates that use it (`node seed.ts box --rows`).
 */
import type { Preset } from '../../../schema/params.ts';
import { solution } from '../../evidence.ts';

export const PRESETS = {
  titled: {
    description: "tcolorbox's own look with the note's title in the title bar: grey frame, light grey back, rounded corners.",
    features: ['framed', 'background', 'title-bar', 'rounded-corners'],
    params: {},
    evidence: [solution('0073-qyxf-book', '42'), solution('0145-professional-newsletter', '44')],
  },
  tone: {
    description: "Coloured by the note's tone: frame in the tone's colour, back at 5% of it, bold title, 1pt rule (\\newtcolorbox{warning|info|hint} with colback=<c>!5!white).",
    features: ['framed', 'background', 'title-bar', 'rounded-corners', 'colored'],
    params: { colback: 'tone!5!white', colframe: 'tone', titleFont: '\\bfseries', boxrule: '1pt' },
    evidence: [solution('0313-iodhbwm', '82'), solution('0189-praecordi-praecordi-book', '70')],
  },
  'left-bar': {
    description: 'Only a coloured bar at the left, a faint tinted back, square corners, no title bar (borderline west, leftrule).',
    features: ['left-rule', 'background', 'colored', 'breakable'],
    params: { style: 'left-bar', colback: 'tone!4', colframe: 'tone', title: false, breakable: true },
    evidence: [solution('0257-polaris-aeterna-loom-notes', '64'), solution('0347-rpgtex-dnd-5e-latex-template', '79')],
  },
  'sharp-breakable': {
    description: 'A white box with a coloured frame and title bar, square corners, bold white title, breaking across pages (enhanced, breakable, sharp corners).',
    features: ['framed', 'title-bar', 'breakable', 'colored'],
    params: { colback: 'white', colframe: 'blue!60!black', titleFont: '\\bfseries', corners: 'sharp', breakable: true },
    evidence: [solution('0318-stem-assignment-template', '74'), solution('0164-coursework-term-paper', '55'), solution('0174-jambro', '65')],
  },
  shadowed: {
    description: 'A rounded framed box with a drop shadow (enhanced skin, drop shadow).',
    features: ['framed', 'background', 'title-bar', 'rounded-corners', 'shadow'],
    params: { shadow: true, arc: '3pt' },
    evidence: [solution('0236-hu-berlin-bundle', '68')],
  },
  filled: {
    description: 'A filled grey panel with no visible frame and square corners (colback=colframe=gray!20, arc=0pt).',
    features: ['background'],
    params: { style: 'filled', colback: 'gray!20', title: false, corners: 'sharp' },
    evidence: [solution('0324-sabirdvd-latex-template-for-upc-thesis', '67'), solution('0016-rho-class-research-article', '63')],
  },
} as const satisfies { readonly [name: string]: Preset };
