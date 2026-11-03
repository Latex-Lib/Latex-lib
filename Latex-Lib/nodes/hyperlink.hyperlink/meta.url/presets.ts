/**
 * meta.url's presets, each from the templates that use it (`node seed.ts meta --rows`).
 */
import type { Preset } from '../../../schema/params.ts';
import { solution } from '../../evidence.ts';

export const PRESETS = {
  typewriter: {
    description: "url's \\url{…}: the address in typewriter type, broken at its punctuation; the text, when it differs, before it.",
    features: ['url-breaks'],
    params: {},
    evidence: [solution('0014-daniel-wambua-cv', '47')],
  },
  'text-font': {
    description: 'Addresses in the surrounding font (\\urlstyle{same}).',
    features: ['url-breaks'],
    params: { style: 'same' },
    evidence: [solution('0014-daniel-wambua-cv', '47')],
  },
  'sans-anywhere': {
    description: 'Addresses in sans-serif, broken anywhere (xurl over url, \\urlstyle{sf}).',
    features: ['url-breaks', 'sans-serif'],
    params: { style: 'sf', anywhere: true },
    evidence: [solution('0016-rho-class-research-article', '53'), solution('0006-gsemthesis', '44')],
  },
} as const satisfies { readonly [name: string]: Preset };
