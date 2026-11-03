import { defineKey } from '../../../schema/key.ts';
import { minimal } from '../../../schema/minimal.ts';
import { CONTENTS } from '../node.ts';
import { PRESETS } from './presets.ts';

export default defineKey(
  minimal({
    id: 'toc.koma',
    node: 'atomicBlock/tableContents',
    description:
      "KOMA-Script's contents options, \\KOMAoptions{toc=flat} (or graduated), entries for the bibliography, the lists and the index (toc=bibliography, listof, index), then \\tableofcontents; KOMA classes only. 22 templates.",
    ctan: ['koma-script'],
    features: ['flat-contents', 'in-contents', 'lists-of-floats'],
    params: {
      layout: { type: 'enum', values: ['flat', 'graduated'], default: 'flat', description: 'entries flush left, or indented by level (toc=)' },
      entries: { type: 'string', default: '', description: "contents entries for these, comma-separated: bibliography, listof, index (toc=…); ''" },
      ...CONTENTS,
    },
    presets: PRESETS,
    requires: [
      'cmd:\\tableofcontents',
    ],
    only: ['class.scrartcl', 'class.scrbook', 'class.scrreprt'],
    zerotex: 'untested',
  }),
);
