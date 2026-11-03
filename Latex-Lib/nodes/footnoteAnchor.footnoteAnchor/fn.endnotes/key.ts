import { defineKey } from '../../../schema/key.ts';
import { minimal } from '../../../schema/minimal.ts';
import { PRESETS } from './presets.ts';

export default defineKey(
  minimal({
    id: 'fn.endnotes',
    node: 'footnoteAnchor/footnoteAnchor',
    description:
      'endnotes: every footnote becomes an endnote (\\let\\footnote=\\endnote), printed at the end with \\theendnotes; \\enotesize for their size, \\notesname for their heading. 5 templates.',
    ctan: ['endnotes'],
    features: ['endnotes', 'numbered', 'small-type'],
    params: {
      size: { type: 'tex', default: '', description: "the endnotes' size (\\enotesize); ''" },
      heading: { type: 'string', default: '', description: "their heading (\\notesname, Notes); ''" },
    },
    presets: PRESETS,
    loads: [
      { pkg: 'endnotes' },
    ],
    zerotex: 'untested',
  }),
);
