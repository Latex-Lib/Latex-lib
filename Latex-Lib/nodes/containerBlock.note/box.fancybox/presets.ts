/**
 * box.fancybox's presets, each from the templates that use it (`node seed.ts box --rows`):
 * fancybox's frames, and the kernel's \fbox family the research files under it.
 */
import type { Preset } from '../../../schema/params.ts';
import { manual, solution } from '../../evidence.ts';

export const PRESETS = {
  shadow: {
    description: "fancybox's \\shadowbox around a paragraph box 0.9 of the line wide, centred; it does not break across pages.",
    features: ['framed', 'shadow', 'centered'],
    params: {},
    evidence: [manual('fancybox', '1 Fancy frames: \\shadowbox, \\doublebox, \\ovalbox, \\Ovalbox'), solution('0409-mcmthesis', '58')],
  },
  framed: {
    description: "The kernel's \\fbox around a \\parbox, flush with the text (\\noindent\\fbox{\\parbox{0.94\\linewidth}{…}}).",
    features: ['framed'],
    params: { frame: 'fbox', width: '0.94\\linewidth', center: false },
    evidence: [solution('0618-shahriar-labs-assignment', '38'), solution('0804-sf298', '50'), solution('0183-fphw-assignment', '42')],
  },
  tinted: {
    description: "A tinted panel without a frame, \\colorbox{…}{\\parbox{\\dimexpr\\linewidth-2\\fboxsep}{…}} (xcolor), full width.",
    features: ['background', 'colored'],
    params: { frame: 'colorbox', background: 'tone!10', width: '\\dimexpr\\linewidth-2\\fboxsep\\relax', center: false },
    evidence: [solution('0786-frostybee-modular-homework', '45'), solution('0012-basic-academic-journal-article', '48')],
  },
  'warning-frame': {
    description: 'A coloured frame on a pale back, \\fcolorbox{red}{red!8}{…}.',
    features: ['framed', 'background', 'colored'],
    params: { frame: 'fcolorbox', frameColor: 'tone', background: 'tone!8' },
    evidence: [solution('0124-r-s-laboratory-safety-sign', '40'), solution('0780-esami', '48')],
  },
  double: {
    description: "fancybox's \\doublebox, a double frame (inner .75\\fboxrule, outer 1.5\\fboxrule).",
    features: ['framed', 'centered'],
    params: { frame: 'doublebox' },
    evidence: [solution('0690-termcal-de', '61'), manual('fancybox', '1 Fancy frames')],
  },
  oval: {
    description: "fancybox's \\ovalbox, a thin frame with round corners (\\cornersize sets their diameter).",
    features: ['framed', 'rounded-corners', 'centered'],
    params: { frame: 'ovalbox' },
    evidence: [manual('fancybox', '1 Fancy frames')],
  },
} as const satisfies { readonly [name: string]: Preset };
