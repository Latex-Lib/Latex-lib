/**
 * front.titling's presets, each from the templates that use it (`node seed.ts front --rows`)
 * and the manual's own examples.
 */
import type { Preset } from '../../../schema/params.ts';
import { manual, solution } from '../../evidence.ts';

export const PRESETS = {
  centered: {
    description: "titling's hooks set to the kernel look: title \\LARGE, author and date \\large, centred, 1.5em under the title.",
    features: ['centered'],
    params: {},
    evidence: [solution('0225-hep-title', '32'), manual('titling', '2.1.1 Restyling the titling: \\pretitle, \\posttitle, \\preauthor, \\postauthor, \\predate, \\postdate')],
  },
  'left-sans': {
    description: 'The title block flush left in bold sans-serif, \\pretitle{\\begin{flushleft}\\LARGE\\bfseries\\sffamily}, pulled up the page (\\droptitle).',
    features: ['sans-serif', 'bold-head'],
    params: { align: 'left', titleFont: '\\LARGE\\bfseries\\sffamily', drop: '-3em' },
    evidence: [solution('0164-coursework-term-paper', '35'), solution('0012-basic-academic-journal-article', '44')],
  },
  'right-sans': {
    description: "The title flush right in sans-serif, the date flush left in small capitals (the manual's own example).",
    features: ['sans-serif', 'flush-right'],
    params: { align: 'right', titleFont: '\\LARGE\\sffamily', dateAlign: 'left', dateFont: '\\large\\scshape' },
    evidence: [manual('titling', '2.1.1 Restyling the titling (example: flushright title, flushleft small-caps date)')],
  },
  'page-centred': {
    description: 'The title block alone on its page, centred vertically (\\maketitlehooka and \\maketitlehookd as \\vfill, titlingpage).',
    features: ['title-page', 'centered'],
    params: { page: true },
    evidence: [solution('0084-guitartabs', '36')],
  },
} as const satisfies { readonly [name: string]: Preset };
