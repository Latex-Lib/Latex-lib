import { defineKey } from '../../../schema/key.ts';
import { minimal } from '../../../schema/minimal.ts';
import { PRESETS } from './presets.ts';

export default defineKey(
  minimal({
    id: 'fn.footmisc',
    node: 'footnoteAnchor/footnoteAnchor',
    description:
      "footmisc: the footnotes' layout by options, \\usepackage[hang,flushmargin]{footmisc} (para, side, bottom, perpage, symbol, symbol*, stable, norule), \\footnotemargin for the marks' room; the footnotes themselves stay \\footnote. 51 templates.",
    ctan: ['footmisc'],
    features: ['hanging', 'per-page', 'symbols', 'paragraph-notes', 'numbered'],
    params: {
      layout: { type: 'enum', values: ['class', 'hang', 'flushmargin', 'hang-flushmargin', 'para', 'side'], default: 'class', description: "the notes' shape: hanging marks, text flush to the margin, both, one paragraph, or in the margin" },
      bottom: { type: 'boolean', default: false, description: 'footnotes at the page bottom, below floats (bottom)' },
      perpage: { type: 'boolean', default: false, description: 'numbers restart on every page (perpage)' },
      symbols: { type: 'enum', values: ['none', 'symbol', 'symbol*'], default: 'none', description: 'symbol marks; symbol* doubles them when they run out' },
      stable: { type: 'boolean', default: false, description: 'footnotes safe in moving arguments such as headings (stable)' },
      rule: { type: 'boolean', default: true, description: 'the rule above the footnotes; false removes it (norule)' },
      margin: { type: 'dimen', default: '', description: "the room for hanging marks (\\footnotemargin); ''" },
    },
    presets: PRESETS,
    loads: [
      { pkg: 'footmisc' },
      { pkg: 'footmisc', options: ['bottom'], when: { bottom: true } },
      { pkg: 'footmisc', options: ['hang'], when: { layout: ['hang', 'hang-flushmargin'] } },
      { pkg: 'footmisc', options: ['flushmargin'], when: { layout: ['flushmargin', 'hang-flushmargin'] } },
      { pkg: 'footmisc', options: ['para'], when: { layout: 'para' } },
      { pkg: 'footmisc', options: ['side'], when: { layout: 'side' } },
      { pkg: 'footmisc', options: ['perpage'], when: { perpage: true } },
      { pkg: 'footmisc', options: ['symbol'], when: { symbols: 'symbol' } },
      { pkg: 'footmisc', options: ['symbol*'], when: { symbols: 'symbol*' } },
      { pkg: 'footmisc', options: ['stable'], when: { stable: true } },
      { pkg: 'footmisc', options: ['norule'], when: { rule: false } },
    ],
    zerotex: 'untested',
  }),
);
