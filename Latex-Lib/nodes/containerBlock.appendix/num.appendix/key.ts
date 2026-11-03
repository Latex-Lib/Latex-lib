import { defineKey } from '../../../schema/key.ts';
import { minimal } from '../../../schema/minimal.ts';
import { PRESETS } from './presets.ts';

export default defineKey(
  minimal({
    id: 'num.appendix',
    node: 'containerBlock/appendix',
    description:
      'Appendices: \\appendix once, then each appendix as \\section{Title} lettered A, B … or \\chapter{Title} ("Appendix A" in chaptered classes); the appendix package\'s \\appendixpage and \\addappheadtotoc for an "Appendices" heading and contents line; \\appendixname renamed. 167 templates.',
    ctan: ['latex-base', 'appendix'],
    features: ['lettered', 'appendix-prefix', 'in-contents'],
    params: {
      form: { type: 'enum', values: ['kernel', 'package'], default: 'kernel', description: "the kernel's \\appendix, or the appendix package's commands with it" },
      level: { type: 'enum', values: ['section', 'chapter'], default: 'section', description: 'each appendix a section or a chapter' },
      page: { type: 'boolean', default: false, description: 'package: an "Appendices" heading like a part (\\appendixpage)' },
      toc: { type: 'boolean', default: false, description: 'package: an "Appendices" line in the contents (\\addappheadtotoc)' },
      name: { type: 'string', default: '', description: "the word before each letter (\\appendixname); ''" },
    },
    presets: PRESETS,
    loads: [
      { pkg: 'appendix', when: { form: 'package' } },
    ],
    requires: [
      'cmd:\\appendix',
      'counter:{level}',
    ],
    zerotex: 'untested',
  }),
);
