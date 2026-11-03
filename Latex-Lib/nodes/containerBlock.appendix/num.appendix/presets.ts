/**
 * num.appendix's presets, each from the templates that use it (`node seed.ts num --rows`).
 */
import type { Preset } from '../../../schema/params.ts';
import { manual, solution } from '../../evidence.ts';

export const PRESETS = {
  sections: {
    description: '\\appendix once, then each appendix as \\section{Title}, lettered A, B, C.',
    features: ['lettered'],
    params: {},
    evidence: [solution('0280-term-paper', '37'), solution('0107-elsarticle', '48'), solution('0336-elteiktdk', '55')],
  },
  chapters: {
    description: 'Each appendix a chapter after \\appendix, titled "Appendix A" by the class (report, book, theses).',
    features: ['lettered', 'appendix-prefix'],
    params: { level: 'chapter' },
    evidence: [solution('0396-dzwaneveld-tudelft-report-thesis-templat', '33'), solution('0221-c1ydehhx-ntut-thesis-template', '60')],
  },
  'with-page': {
    description: 'The appendix package: an "Appendices" heading in the style of a part (\\appendixpage) and an "Appendices" line in the contents (\\addappheadtotoc) before the first appendix.',
    features: ['lettered', 'in-contents'],
    params: { form: 'package', page: true, toc: true },
    evidence: [manual('appendix', '2 The appendix package: \\appendixpage, \\addappheadtotoc')],
  },
  renamed: {
    description: 'Appendices named in another word (\\renewcommand{\\appendixname}{Anhang}), as chapters.',
    features: ['lettered', 'appendix-prefix'],
    params: { level: 'chapter', name: 'Anhang' },
    evidence: [solution('0064-korogodin-nslreport', '67')],
  },
} as const satisfies { readonly [name: string]: Preset };
