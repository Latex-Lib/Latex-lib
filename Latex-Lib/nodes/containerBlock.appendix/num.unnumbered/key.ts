import { defineKey } from '../../../schema/key.ts';
import { minimal } from '../../../schema/minimal.ts';
import { PRESETS } from './presets.ts';

export default defineKey(
  minimal({
    id: 'num.unnumbered',
    node: 'containerBlock/appendix',
    description:
      'An unnumbered appendix entered in the contents by hand: no \\appendix and no letter, the appendix a starred \\chapter*{Title} (or \\section*{Title}) and then \\addcontentsline{toc}{chapter}{Title}; a thesis\'s single appendix chapter under a fixed word, as the Tianjin University thesis\'s \\chapter*{附\\quad 录} on ctexbook.',
    writes: '\\chapter*{…} \\ifdefined\\phantomsection\\phantomsection\\fi \\addcontentsline{toc}{chapter}{…} \\label{…} …',
    ctan: ['latex-base'],
    features: ['unnumbered', 'in-contents'],
    params: {
      level: { type: 'enum', values: ['chapter', 'section'], default: 'chapter', description: 'the appendix a starred chapter or a starred section' },
      name: {
        type: 'tex',
        default: '',
        description: "a fixed heading that replaces the node's title (LaTeX: 附\\quad 录); '' prints the node's title",
      },
      contents: { type: 'tex', default: '', description: "the contents line's text (LaTeX: 附录); '' repeats the heading" },
      toc: { type: 'boolean', default: true, description: 'a line in the contents (\\addcontentsline); false prints the heading alone' },
    },
    presets: PRESETS,
    // \chapter* needs the class's chapter (book, report, ctexbook, theses), \section* its section: the counter stands for the
    // command, as num.appendix's does. \addcontentsline and \phantomsection's test are the kernel's.
    requires: ['counter:{level}'],
    // The tju preset's fixed word (附\quad 录, 附录) is Chinese: only the ctex classes load the CJK fonts that have its glyphs.
    onlyWhen: [
      {
        when: { name: '附\\quad 录' },
        classes: ['class.ctexart', 'class.ctexrep', 'class.ctexbook'],
        reason:
          "the Tianjin thesis's fixed heading 附\\quad 录 (and its contents line 附录) needs CJK glyphs, which only ctex's fonts give; under a Latin class's Latin Modern every character is \"Missing character: There is no 附 in font Latin Modern Roman 12 Bold\" and the heading and contents line print empty",
        evidence: [
          { kind: 'source', file: 'Latex Related Research/Latex-lib-main/Source/0987-twtstudio-tjuthesislatextemplate/Thesis/tjumain.tex', line: '8 (ctexbook)' },
          {
            kind: 'compile',
            cell: "GitHub run batch 4 round 1 (r20261109215129525), book.A: document d6dbcc136f29902ba2627 (cell c3a1c0e37533779807eb9, result 3c4b4cc4f6) 'Missing character: There is no 附 in font Latin Modern Roman 12 Bold'; all 288 documents with a missing glyph in no TeX error cell hold num.unnumbered@tju, 2,916 cells and 20,277 branches (document-level warning:missing-character) over book.A/B, report.A/B, memoir.A/B, scrbook.A/B, scrreprt.A/B, ut-thesis.A, llncs.A/B and eccv.A",
          },
        ],
      },
    ],
    // As num.appendix's and ack.kernel's: jmlr makes a chapter counter (so counter:chapter is defined) but lets \chapter, starred
    // too, to a class error outside its book mode; its profile's forbids.names (cmd:\chapter) holds the heading node only.
    deny: [
      {
        class: 'class.jmlr-pmlr',
        unless: { level: 'section' },
        reason: "jmlr.cls lets \\chapter to artchapter outside its book mode, a class error (l.743-745, 959): the appendix's \\chapter*{…} stops at 'Class jmlr Error: Chapters not permitted in articles'",
        evidence: [
          { kind: 'source', file: 'jmlr.cls (jmlr 2022/02/09 v1.30, MiKTeX snapshot 9766)', line: '732, 743-745, 959' },
          { kind: 'compile', cell: 'batch 4 round 1, jmlr-pmlr.A: num.unnumbered@chapter and @tju, 778 of 778 branches fail, 596 at their own \\chapter* (document d5ca546900e510892a449, result b8df9c9ca2, l.38)' },
        ],
      },
    ],
    // Typeset ok on ZeroTeX-NG (2026-11-07): tju on ctexbook with hyperref (the contents line 附录 on the heading's page), chapter
    // on book, level section on article with hyperref; \pageref to the label resolves.
    targetEngine: 'yes',
  }),
);
