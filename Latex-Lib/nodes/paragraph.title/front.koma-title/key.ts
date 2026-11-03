import { defineKey } from '../../../schema/key.ts';
import { minimal } from '../../../schema/minimal.ts';
import { PRESETS } from './presets.ts';

export default defineKey(
  minimal({
    id: 'front.koma-title',
    node: 'paragraph/title',
    description:
      "KOMA-Script's title block: \\subject above the title, \\subtitle under it, \\titlehead at the top, \\publishers at the foot, then \\title, \\author, \\date and \\maketitle; titlepage=true or false, the title's font by \\addtokomafont{title}. KOMA classes only. 13 templates.",
    ctan: ['koma-script'],
    features: ['subject-line', 'sans-serif', 'centered'],
    params: {
      subject: { type: 'string', default: '', description: "a line above the title (\\subject); ''" },
      subtitle: { type: 'string', default: '', description: "a line under the title (\\subtitle); ''" },
      titlehead: { type: 'string', default: '', description: "text at the head of the title (\\titlehead); ''" },
      publishers: { type: 'string', default: '', description: "a line at the foot (\\publishers); ''" },
      titlePage: { type: 'enum', values: ['class', 'true', 'false'], default: 'class', description: 'a title page of its own, or the title at the head of the first page (titlepage=)' },
      titleFont: { type: 'tex', default: '', description: "added to the title's font (\\addtokomafont{title}); ''" },
      date: { type: 'enum', values: ['given', 'today', 'none'], default: 'given', description: "the date line: the node's date (the kernel prints today's when there is none), \\today explicitly, or none (\\date{})" },
    },
    presets: PRESETS,
    requires: [
      'cmd:\\maketitle',
    ],
    only: ['class.scrartcl', 'class.scrbook', 'class.scrreprt'],
    zerotex: 'untested',
  }),
);
