import { defineKey } from '../../../schema/key.ts';
import { minimal } from '../../../schema/minimal.ts';
import { PRESETS } from './presets.ts';

export default defineKey(
  minimal({
    id: 'abs.abstract-pkg',
    node: 'containerBlock/abstract',
    description:
      "The abstract package over the class's abstract: \\abstractnamefont and \\abstracttextfont for its fonts, \\absleftindent and \\absrightindent for its width, the runin and addtotoc options. 4 templates.",
    ctan: ['abstract'],
    features: ['small-type', 'sans-serif', 'run-in-head', 'in-contents', 'indented', 'centered'],
    params: {
      nameFont: { type: 'tex', default: '\\normalfont\\small\\bfseries', description: "the heading's font (\\abstractnamefont)" },
      textFont: { type: 'tex', default: '\\normalfont\\small', description: "the text's font (\\abstracttextfont)" },
      indent: { type: 'dimen', default: '', description: "the left and right indents (\\absleftindent, \\absrightindent; \\leftmargin by default); ''" },
      runIn: { type: 'boolean', default: false, compat: true, description: 'the heading run into the first line (runin)' },
      inContents: { type: 'boolean', default: false, description: 'the abstract listed in the contents (addtotoc)' },
    },
    presets: PRESETS,
    loads: [
      { pkg: 'abstract' },
      { pkg: 'abstract', options: ['runin'], when: { runIn: true } },
      { pkg: 'abstract', options: ['addtotoc'], when: { inContents: true } },
    ],
    // It restyles the class's abstract and defines none: under book it stops at "Environment abstract undefined" (solo, book.A: result ceebd09fe8e8).
    requires: ['env:abstract'],
    deny: [
      {
        class: 'class.beamer',
        reason: 'abstract.sty tests \\if@titlepage while it loads, which beamer does not define: "Undefined control sequence. l.57 \\if@titlepage", then "Extra \\else", "Extra \\fi"',
        evidence: [{ kind: 'compile', cell: "ceadbb12734923307c41a (the copy's beamer.A run: all 14 documents with this error hold abs.abstract-pkg)" }],
      },
      {
        class: 'class.revtex4-2',
        reason: 'abstract.sty tests \\if@titlepage while it loads, which revtex4-2 does not define: "Undefined control sequence. l.57 \\if@titlepage", then "Extra \\fi"',
        evidence: [{ kind: 'compile', cell: "c8c52bb2795234c3906f5, c5ef96699c4f7a5e08ec7 (the copy's revtex4-2-aps.A run: 79 of the documents stopping at \\if@titlepage hold abs.abstract-pkg)" }],
      },
      {
        class: 'class.aastex',
        reason: 'abstract.sty tests \\if@titlepage while it loads, which aastex701 does not define (it loads no article and copies revtex4-2\'s front matter, with its own \\titlepage@sw): "Undefined control sequence … \\if@titlepage", then "Extra \\fi", as under revtex4-2',
        evidence: [{ kind: 'source', file: 'testing-pipeline/settings/classes/files/aastex701.cls', line: '5575-5577 (\\titlepage@sw; no \\newif\\if@titlepage and no \\LoadClass in the class)' }, { kind: 'compile', cell: "c8c52bb2795234c3906f5, c5ef96699c4f7a5e08ec7 (the revtex4-2 analogue: the copy's revtex4-2-aps.A run, 79 documents stopping at \\if@titlepage hold abs.abstract-pkg)" }],
      },
    ],
    zerotex: 'untested',
  }),
);
