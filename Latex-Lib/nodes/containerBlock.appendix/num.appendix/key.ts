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
    // jmlr makes a chapter counter (so counter:chapter is defined) but lets \chapter to an error outside its book mode; its
    // profile's `forbids.names` (cmd:\chapter) holds headings only, and a names rule on counter:chapter would also refuse
    // head.fncychap, which passes there (130 of 193 branches in run b12-5bdc624).
    deny: [
      {
        class: 'class.jmlr-pmlr',
        unless: { level: 'section' },
        reason: "jmlr.cls lets \\chapter to artchapter outside its book mode, a class error (l.743-745, 959): each appendix as a \\chapter stops at 'Class jmlr Error: Chapters not permitted in articles'",
        evidence: [
          { kind: 'source', file: 'jmlr.cls (jmlr 2022/02/09 v1.30, MiKTeX snapshot 9766)', line: '732, 743-745, 959' },
          { kind: 'compile', cell: 'GitHub run b12-5bdc624, jmlr-pmlr.A: num.appendix@chapters 357 of 357 branches fail (document d876668d6f92a42b30ed0)' },
        ],
      },
    ],
    zerotex: 'untested',
  }),
);
