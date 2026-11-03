/**
 * ack.kernel's presets, from the templates whose acknowledgements are an
 * unnumbered heading (`node seed.ts head --rows`, `node seed.ts front --rows`).
 */
import type { Preset } from '../../../schema/params.ts';
import { solution } from '../../evidence.ts';

export const PRESETS = {
  section: {
    description: 'Acknowledgements as an unnumbered section, \\section*{Acknowledgements}, then the text.',
    features: ['unnumbered'],
    params: {},
    evidence: [solution('0012-basic-academic-journal-article', '71')],
  },
  'chapter-in-contents': {
    description: 'An unnumbered chapter that still reaches the contents (\\chapter*{Acknowledgements}, \\addcontentsline{toc}{chapter}{…}), as theses put it in the front matter.',
    features: ['unnumbered', 'in-contents'],
    params: { level: 'chapter', inContents: true },
    evidence: [solution('0180-simple-thesis-dissertation', '60'), solution('0006-gsemthesis', '51')],
  },
  chapter: {
    description: 'An unnumbered chapter, \\chapter*{…}, kept out of the contents.',
    features: ['unnumbered'],
    params: { level: 'chapter' },
    evidence: [solution('0201-nova-thesis-starter', '82')],
  },
} as const satisfies { readonly [name: string]: Preset };
