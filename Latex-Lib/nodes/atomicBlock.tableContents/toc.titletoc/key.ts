import { defineKey } from '../../../schema/key.ts';
import { minimal } from '../../../schema/minimal.ts';
import { CONTENTS } from '../node.ts';
import { PRESETS } from './presets.ts';

export default defineKey(
  minimal({
    id: 'toc.titletoc',
    node: 'atomicBlock/tableContents',
    description:
      "titletoc: each section entry's format with \\titlecontents{section}[left]{above}{\\contentslabel{1.5em}}{}{\\titlerule*[0.6pc]{.}\\contentspage} (\\contentspush for the number, \\contentsmargin for the margin), then \\tableofcontents. 35 templates.",
    ctan: ['titlesec'],
    features: ['dot-leaders', 'bold-head', 'sans-serif', 'lists-of-floats'],
    params: {
      sectionFont: { type: 'tex', default: '\\bfseries', description: "section entries' font" },
      leaders: { type: 'boolean', default: true, description: 'dot leaders (\\titlerule*); false pushes the page right (\\hfill)' },
      pitch: { type: 'dimen', default: '0.6pc', description: "the leaders' dot spacing" },
      push: { type: 'boolean', default: false, description: 'the number pushed into the text with a quad (\\contentspush) instead of a fixed box (\\contentslabel)' },
      labelWidth: { type: 'dimen', default: '1.5em', description: "the number's box (\\contentslabel)" },
      indent: { type: 'dimen', default: '0pt', description: "the entries' left indent" },
      margin: { type: 'dimen', default: '', description: "the right margin (\\contentsmargin); ''" },
      ...CONTENTS,
    },
    presets: PRESETS,
    loads: [
      { pkg: 'titletoc' },
    ],
    requires: [
      'cmd:\\tableofcontents',
    ],
    deny: [
      { class: 'class.beamer', reason: "beamer's \\tableofcontents only reads the .toc file inside a frame", evidence: [{ kind: 'requirement', file: 'Template/template-requirement/Beamer.md', line: '61' }] },
    ],
    zerotex: 'untested',
  }),
);
