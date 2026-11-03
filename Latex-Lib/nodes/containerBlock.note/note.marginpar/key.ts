import { defineKey } from '../../../schema/key.ts';
import { minimal } from '../../../schema/minimal.ts';
import { PRESETS } from './presets.ts';

export default defineKey(
  minimal({
    id: 'note.marginpar',
    node: 'containerBlock/note',
    description:
      "The kernel's \\marginpar{…}: a note in the margin, itself a float, so not inside another float, a box or a footnote. \\reversemarginpar for the other margin, \\marginparwidth and \\marginparsep for the column. 56 templates.",
    ctan: ['latex-base'],
    features: ['margin-note', 'small-type'],
    params: {
      // In two columns the kernel's \@addmarginpar puts each column's notes on that column's own side and ignores \reversemarginpar
      // (ltoutput.dtx l.5280-5290), so @reversed prints like @ragged-small there (copy batch-3b B pairs: its sentinels left 14, right 10).
      side: { type: 'enum', values: ['outer', 'reverse'], default: 'outer', description: "the margin: the class's (outer), or the other one (\\reversemarginpar, for the whole document); in two columns the kernel ignores it, each column's notes going to its own side" },
      font: { type: 'tex', default: '\\footnotesize', description: "the note's font and size" },
      align: { type: 'enum', values: ['ragged', 'justified', 'center'], default: 'ragged', description: "the note's alignment (\\raggedright, justified, \\centering)" },
      title: { type: 'boolean', default: true, description: "the note's title in bold above its text (or as the box's title)" },
      width: { type: 'dimen', default: '', description: "\\marginparwidth; '' keeps the class's, or the room its margin has where the class's is under 2cm or runs off the paper (memoir's rule: the narrower margin, on both pages when they alternate, less twice \\marginparsep)" },
      sep: { type: 'dimen', default: '', description: "\\marginparsep, between text and note; '' keeps the class's" },
    },
    presets: PRESETS,
    deny: [
      {
        class: 'class.beamer',
        reason:
          "a slide has no margin for a note: beamer loads geometry with hmargin=1cm, a 28.45pt margin, and leaves \\marginparwidth at 4pt (\\marginparsep 10pt), so every word of the note overflows its column (\"Overfull \\hbox (16.331pt too wide)\" at its bold title alone), and a width that holds text runs off the paper (@wide's 50mm: the note ends at x 486.9pt on a 364.2pt page); in beamer's theorem blocks, which are boxes, \\marginpar is also \"Not in outer par mode\"",
        evidence: [
          { kind: 'compile', cell: "c6a7da97300b7511ef68b (copy batch-3b beamer.A, result 6449a84057f3: geometry's result \\marginparwidth=4.0pt, \\marginparsep=10.0pt, h-part 28.45274pt, 307.28987pt, 28.45274pt; l.188 'Overfull \\hbox (16.331pt too wide)' at the title; 0 of 266 @ragged-small and @reversed branches pass)" },
          { kind: 'compile', cell: "c64f0227f269b08a2c706 (copy batch-3b beamer.A, result 59ef036f38be, @wide: \\marginparwidth=142.26378pt, the note's sentinel at x 486.9pt, paper 364.19536pt; @wide's 16 passes of 62 are 12 displays, which place no sentinel, these 2 notes off the paper and 2 that shipped nothing checkable)" },
          { kind: 'compile', cell: "c4445d3ea407f5c3bc943 (copy batch-3b beamer.A, result ede3eb64d5db: thm.class-native@elsarticle > note.marginpar, l.134 'Not in outer par mode'; 51 of 51 \\marginpar branches directly under a plain theorem way, against 27 of 165 in article.A)" },
          { kind: 'requirement', file: 'Template/template-requirement/Beamer.md', line: '29' },
        ],
      },
      {
        class: 'class.cas-sc',
        reason:
          "cas-sc leaves no margin a note fits in: its text block is 468.33pt wide on a 546.29pt page, 38.98pt from either edge, and it keeps article's 65pt \\marginparwidth and 11pt \\marginparsep, so a note ran 37pt off the paper; the room that margin has, 38.98pt less \\marginparsep on either side (memoir's rule, which the library's note-column fit applies), is 16.98pt, narrower than a note's own bold title (20.84pt in \\footnotesize)",
        evidence: [
          { kind: 'compile', cell: "GitHub run 41584963423, cas-sc.A: COMPAT-GEOMETRY paperWidth 546.29291pt, oddLeft 38.98026pt, textWidth 468.3324pt; d13e0dcf2f1aebba0760a result e6ed0775a7, note.marginnote@italic-unadjusted's sentinel at x 682.8pt; 987 of the 2,980 passing not-denied branches below a margin note shipped their sentinel off the paper, which the oracle did not check for a margin note's until b22's `sentinel:off-paper` (b22 MC1/O-MNJ)" },
        ],
      },
    ],
    // Its body is a box: a float in it is "Not in outer par mode" (04b32896a8, article.A run: branch b9b4ea177bc18de6f86b4,
    // note.marginpar@ragged-small > list.enumerate-pkg > fig.floatrow, l.288); 136 of 324 float branches below it (8 core pairs).
    // A footnote in it is lost: \marginpar sets its body in a \vtop (latex.ltx \@savemarbox), which reaches the page only as a box
    // the output routine places, and the insert in it never reaches the page's footnotes (GitHub run 41584963423: 0 of 94
    // not-denied branches with General's footnote anchor below it pass, 90 never ship the text, e.g. acmart-manuscript.A
    // d08f06e41bd6b4c059d1f result a8ef3c1a69, branch bd90e9d63c66d9e558e41, '.t never shipped'). [OV2]
    // Since b22 the handler sets a note that holds a footnote inside footnotehyper's \savenotes … \spewnotes, as Flouest's
    // General note does, so the text is set after the note at the page's foot (`keepingFootnotes`), and the footnote is no
    // longer denied below it. [OV2-alt]
    gives: { floats: false, boxDepth: 1 },
    needs: { floats: true, argument: false },
    zerotex: 'untested',
  }),
);
