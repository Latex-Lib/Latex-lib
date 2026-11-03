/**
 * head.fncychap's presets, from the templates that use it (`node seed.ts head --rows`)
 * and the manual's own style pages.
 */
import type { Preset } from '../../../schema/params.ts';
import { manual, solution } from '../../evidence.ts';

export const PRESETS = {
  sonny: {
    description: 'fncychap Sonny: "CHAPTER" in sans capitals with a huge number, the title between two rules, sans and large.',
    features: ['chapter-opening', 'ruled', 'sans-serif', 'uppercase', 'numbered'],
    params: { style: 'Sonny' },
    evidence: [manual('fncychap', '3.1 The chapter Sonny')],
  },
  'lenny-raggedleft': {
    description: 'fncychap Lenny, a boxed number in a large font, with the title huge, bold, sans-serif and flush right (\\ChTitleVar{\\huge\\bfseries\\sffamily\\raggedleft}).',
    features: ['chapter-opening', 'ruled', 'sans-serif', 'bold-head', 'flush-right', 'numbered'],
    params: { style: 'Lenny', titleFont: '\\huge\\bfseries\\sffamily\\raggedleft' },
    evidence: [solution('0951-cr0wg4n-plantilla-latex-tesis-proyecto-d', '52')],
  },
  conny: {
    description: 'fncychap Conny: centred, the name and number in a framed band between rules, name and title upper-cased.',
    features: ['chapter-opening', 'ruled', 'centered', 'uppercase', 'numbered'],
    params: { style: 'Conny', nameCase: 'upper', titleCase: 'upper' },
    evidence: [solution('0367-rkkautsar-ui-thesis-template', '50'), manual('fncychap', '3.4 The chapter Conny')],
  },
  bjornstrup: {
    description: 'fncychap Bjornstrup: the number large and grey at the right in a shaded band, the title below in small capitals.',
    features: ['chapter-opening', 'background', 'smallcaps-head', 'numbered'],
    params: { style: 'Bjornstrup' },
    evidence: [manual('fncychap', '3.7 The chapter Bjornstrup')],
  },
} as const satisfies { readonly [name: string]: Preset };
