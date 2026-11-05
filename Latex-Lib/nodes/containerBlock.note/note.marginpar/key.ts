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
      width: { type: 'dimen', default: '', description: "\\marginparwidth, for the whole document; '' keeps the class's, or the room its margin has where the class's is under 2cm or runs off the paper (memoir's rule: the narrower margin, on both pages when they alternate, less twice \\marginparsep); a width given here is kept where it is on the paper, otherwise the wider of the class's column and that room" },
      sep: { type: 'dimen', default: '', description: "\\marginparsep, between text and note; '' keeps the class's" },
    },
    presets: PRESETS,
    deny: [
      {
        class: 'class.bmvc',
        reason:
          "bmvc2k's page has no margin for a note: geometry sets a 410pt x 620pt page with inner=9mm and outer=6mm (bmvc2k.cls l.246), a 25.5pt and a 17.1pt margin, so a \\marginpar note, at the room its margin has or at the class's width, overflows at every word or runs off the paper (round b28 bmvc.A: 410 of 410 failing marginpar rows are overfull hboxes, 46 also off the paper; 0 passes)",
        evidence: [
          { kind: 'source', file: 'testing-pipeline/settings/classes/files/bmvc2k.cls', line: '246 (geometry: papersize={410pt,620pt}, inner=9mm, outer=6mm)' },
          { kind: 'compile', cell: 'GitHub run b28-e9f730a, bmvc.A: the note ways fail 3,233 not-denied rows (overfull hboxes while \\output is active, 31.39998pt and 18.32pt the commonest; sentinel:off-paper 445) and pass 294, all branches whose note held no sentinel' },
        ],
      },
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
      {
        class: 'class.asmeconf',
        reason:
          "asmeconf leaves no margin a note fits in: its text block is 7.5in (542.03pt) on letter paper, 0.5in (36.14pt) from either edge (asmeconf.cls l.508, geometry left=0.5in, right=0.5in), and it keeps article's \\marginparsep (11pt, 10pt in two columns), so the room b22 MC1's fit gives a note column (the margin less \\marginparsep on either side, FIT_NOTE_COLUMN) is 14.14pt (GitHub probe b28-1, asmeconf.A: COMPAT-NOTEROOM \\marginparwidth 14.135pt beside \\marginparsep 11pt), narrower than the note's bold title (20.84pt in \\footnotesize) and than a five-letter word of its 8pt italic text ('short' overflowed it by 2.39pt), as under cas-sc (16.98pt). An inline note way (box.*) or General's note takes its place (b28 MARGIN-1)",
        evidence: [
          { kind: 'compile', cell: "GitHub run b27-39fa711, asmeconf.A: COMPAT-GEOMETRY paperWidth 614.295pt, oddLeft and evenLeft 36.135pt, textWidth 542.02501pt; d6798e4384649992529a5 result 0a42bff148, one note's words overflow its column by 2.31-33.87pt ('italic' 2.31pt, 'small-' 7.36pt, 'courierNew' 33.87pt); 241 of its 401 not-denied branches below this way fail, almost all on margin-note overfull boxes, and every margin note of d1e3ae8dc1e5d564a7679 result 342075df21 overflows ('short' 2.39pt, 'capes' 4.08pt)" },
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
    // A \marginpar box never breaks across pages (b23: tbl.longtable, which may sit in one box that breaks, stays out of it).
    gives: { floats: false, breakable: false, boxDepth: 1 },
    needs: { floats: true, argument: false },
    zerotex: 'untested',
  }),
);
