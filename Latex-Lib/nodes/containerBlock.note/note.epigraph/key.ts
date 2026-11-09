import { defineKey } from '../../../schema/key.ts';
import { minimal } from '../../../schema/minimal.ts';
import { PRESETS } from './presets.ts';

export default defineKey(
  minimal({
    id: 'note.epigraph',
    node: 'containerBlock/note',
    description:
      "memoir's own epigraph, \\epigraph{text}{source}: the note's text as a quotation in a \\small minipage 0.4\\textwidth wide at the right of the text block, a thin rule under it, and the note's title as the source below (none when the note has no title). \\epigraphwidth, \\epigraphrule, \\epigraphposition and \\epigraphfontsize restyle it from the preamble. memoir emulates the epigraph package, so nothing is loaded. Usually right after a chapter heading.",
    writes: '\\epigraph{…}{…}',
    ctan: ['memoir'],
    features: ['flush-right', 'small-type'],
    params: {
      width: { type: 'dimen', default: '', description: "\\epigraphwidth, the quotation's width; '' keeps memoir's 0.4\\textwidth" },
      rule: { type: 'dimen', default: '', description: "\\epigraphrule, the rule between quotation and source; '' keeps memoir's 0.4pt, 0pt drops it" },
      position: { type: 'enum', values: ['flushright', 'center', 'flushleft'], default: 'flushright', description: 'where the epigraph sits in the text block (\\epigraphposition)' },
      fontSize: { type: 'tex', default: '', description: "the epigraph's size (\\epigraphfontsize); '' keeps memoir's \\small" },
    },
    presets: PRESETS,
    // memoir defines \epigraph itself (memoir.dtx l.18919-18923) and marks the epigraph package emulated (l.33773), so the way
    // loads nothing; its profile does not list cmd:\epigraph yet (reported to the profile's owner).
    requires: ['cmd:\\epigraph'],
    only: ['class.memoir'],
    // Its text is \epigraph's argument, set in a minipage (memoir.dtx l.18919-18923): no float, no verbatim, no page break.
    gives: { floats: false, breakable: false, verbatim: false, argument: true, boxDepth: 1 },
    needs: { paragraph: true },
    // Typeset on ZeroTeX-NG under memoir (v3.8.4b): both presets, a two-paragraph quotation with no source, \epigraphrule 0pt,
    // \epigraphposition{center}, \epigraphfontsize, a footnote in the quotation and an epigraph in an itemize item, ok.
    targetEngine: 'yes',
  }),
);
