import { defineKey } from '../../../schema/key.ts';
import { minimal } from '../../../schema/minimal.ts';
import { PRESETS } from './presets.ts';

export default defineKey(
  minimal({
    id: 'note.notecolumn',
    node: 'containerBlock/note',
    description:
      "KOMA's scrlayer-notecolumn: \\makenote*[column]{…} (the starred form, its text kept detokenized for the column) into a note column beside the text, synchronised with it across pages; the marginpar column, or one of its own declared with \\DeclareNewNoteColumn[font=…,width=…]{name}. Without a width a column is \\marginparwidth wide: the class's, or the room its margin has where the class's is under 2cm or runs off the paper. Under a two-sided class whose notes keep one side (tufte-handout), an even page's column goes right of the text, where \\marginpar sets the note, not in the package's left margin; odd pages, and a reversed document's sides, stay the package's. 1 template.",
    ctan: ['koma-script'],
    features: ['margin-note', 'note-column', 'colored', 'small-type'],
    params: {
      column: { type: 'string', default: 'marginpar', description: "the column's name; marginpar is the predefined margin column, any other name declares a new one" },
      font: { type: 'tex', default: '', description: "the column's font (font=); ''" },
      width: { type: 'dimen', default: '', description: "the column's width (width=); ''" },
      side: { type: 'enum', values: ['normal', 'reverse'], default: 'normal', description: 'the margin (reversemarginpar)' },
    },
    presets: PRESETS,
    deny: [
      {
        class: 'class.beamer',
        reason:
          "a note column is as wide as \\marginparwidth, which beamer leaves at 4pt in a 28.45pt margin (geometry, hmargin=1cm): the notes, typeset while \\output is active, overflow at every word (\"Overfull \\hbox (26.483pt too wide) has occurred while \\output is active\"), the marginpar column and a declared one alike, and a width that holds text runs off the paper",
        evidence: [
          { kind: 'compile', cell: "ce4fa63c8b20370d9e5ae (copy batch-3b beamer.A, result 2c53bf729dfd: @colored-column, 128 such boxes; 8 of the 9 notecolumn documents that built with no TeX error show them, with either preset; the ninth, c64f0227f269b08a2c706, result 59ef036f38be, had its notes set 142.26pt wide by a @wide marginpar and shipped them at x 485.6pt on a 364.2pt page)" },
          { kind: 'requirement', file: 'Template/template-requirement/Beamer.md', line: '29' },
        ],
      },
      {
        class: 'class.cas-sc',
        reason:
          "cas-sc leaves no margin a note column fits in: its text block is 468.33pt wide on a 546.29pt page, 38.98pt from either edge, and it keeps article's 65pt \\marginparwidth and 11pt \\marginparsep, so the column ran 37pt off the paper; the room that margin has, 38.98pt less \\marginparsep on either side (memoir's rule, which the library's note-column fit applies), is 16.98pt, narrower than a note's own bold title",
        evidence: [
          { kind: 'compile', cell: "GitHub run 41584963423, cas-sc.A: COMPAT-GEOMETRY paperWidth 546.29291pt, oddLeft 38.98026pt, textWidth 468.3324pt; 987 of the 2,980 passing not-denied branches below a margin note shipped their sentinel off the paper (94 below this way), which the oracle did not check for a margin note's until b22's `sentinel:off-paper` (b22 MC1/O-MNJ)" },
        ],
      },
      {
        class: 'class.asmeconf',
        reason:
          "asmeconf leaves no margin a note column fits in: its text block is 7.5in (542.03pt) on letter paper, 0.5in (36.14pt) from either edge (asmeconf.cls l.508, geometry left=0.5in, right=0.5in), and it keeps article's \\marginparsep (11pt, 10pt in two columns), so the room b22 MC1's fit gives a note column (the margin less \\marginparsep on either side, FIT_NOTE_COLUMN) is 14.14pt (GitHub probe b28-1, asmeconf.A: COMPAT-NOTEROOM \\marginparwidth 14.135pt beside \\marginparsep 11pt), narrower than the note's bold title (20.84pt in \\footnotesize) and than a five-letter word of its 8pt italic text ('short' overflowed it by 2.39pt), as under cas-sc (16.98pt). An inline note way (box.*) or General's note takes its place (b28 MARGIN-1)",
        evidence: [
          { kind: 'compile', cell: "GitHub run b27-39fa711, asmeconf.A: COMPAT-GEOMETRY paperWidth 614.295pt, oddLeft and evenLeft 36.135pt, textWidth 542.02501pt; d6798e4384649992529a5 result 0a42bff148, one note's words overflow its column by 2.31-33.87pt ('italic' 2.31pt, 'small-' 7.36pt, 'courierNew' 33.87pt); 628 of its 700 not-denied branches below this way fail, almost all on margin-note overfull boxes, and every margin note of d1e3ae8dc1e5d564a7679 result 342075df21 overflows ('short' 2.39pt, 'capes' 4.08pt)" },
        ],
      },
    ],
    // The handler writes \makenote*, where the template (0020-koma-script, scrlayer-notecolumn-example-en.tex) writes \makenote. The
    // KOMA source sets \slnc@unexpanded to \detokenize for the starred form, so the body reaches the .slnc file as written; unstarred
    // it is expanded in \protected@write, where a list's \item breaks: "Use of \slnc@makenote doesn't match its definition", then
    // Incomplete \iffalse and no page (copy batch-3b article.A: 0 of 280 list children below it passed, 40 with the makenote error,
    // e.g. d77bcaaf762a result e65157ea7c; 1,131 more branches in 45 documents never judged after the \iffalse skip). A # in a body
    // is doubled on the re-read. Its probe (batch 4, staging store) kept it: the refiled documents holding the branches of
    // d77bcaaf762a9afbed394 and daeb8339e6261ec3b3860 (d7b963d202b7c6612cf8e result ba2bfb301b, db530b6d1e7e624586f90 result
    // ab58b170ab) build with no error, where both stopped before, and every sentinel ships from the re-read text, lists included.
    // Their 17 note branches fail only on the @margin column's boxes during output: 15.52pt over, and 40.52pt in documents whose
    // notes hold lists (25pt more, which is \leftmargini at 10pt: inferred, not isolated) (deferred L-d4).
    loads: [
      { pkg: 'scrlayer-notecolumn' },
    ],
    // \makenote keeps its body for the note column, a layer of the page style typeset as the page ships, beside the text block: a float
    // in it never reaches the page. None of the 266 float branches below it that print passes on its own (73 documents, 10 core pairs):
    // 252 fail on other errors first (a list in the note, the only way a float reaches it, was "Use of \slnc@makenote doesn't match its
    // definition" before the starred form), and the 14 with no failure are image leaves in documents where every sentinel below the
    // note is lost (8b17d209a531, scrartcl.A run: document d3eab1d3845ecd56d88cf). The earlier figure here, 401 of 461 judged
    // sentinels below it never shipped (article.A run), was mostly another cause: the column is typeset from the .slnc file an earlier
    // run wrote, so a build a TeX error ends after its first run never ships it (copy batch-3b article.A: note-column sentinels missing
    // in 54 of 54 error documents with no document problem, 0 of 289 ok documents; the older run's 10 pairs 3,057 of 3,058 against 0
    // of 302), which the oracle no longer charges there (`nextRun`).
    // A box: scrlayer-notecolumn sets the note's text in a \vbox while \output is active (scrlayer-notecolumn.dtx l.785-800).
    // A footnote in it is lost: \makenote writes the note to the .slnc file (scrlayer-notecolumn.sty l.609-616) and the note is
    // typeset at shipout into the column's \vbox (l.675), where its insert stays (GitHub run 41584963423: the one document with
    // General's footnote anchor below it that printed, mdpi.A d7f1d4153e60aee6e0ba2 result 9f5c788f77, 2 of 2 branches '.t never
    // shipped'; in the other 46 pairs that notes-only document printed no page, FC2). [OV2]
    // Its notes are boxes set as the page ships; none breaks across pages (b23: tbl.longtable stays out of it).
    gives: { floats: false, footnotes: false, breakable: false, boxDepth: 1 },
    // The handler has \clearnotecolumns do nothing in internal vertical mode (`CLEAR_ON_THE_PAGE_ONLY`): every \clearpage
    // clears the note columns first and loops until their notes have shipped, which in a box or in the output routine never
    // happens. A breakable tcolorbox's last-part \clearpage in a footnote's text or thm.mdframed's body ran main memory out so
    // in 163 cells of GitHub run 41584963423, and \@doclearpage's own \clearpage in \output, by the source, in 36 two-column
    // cells (b21 M1-NC; e.g. aa.A db76c3d7b09a0788ce503 result 4188056999 l.684).
    zerotex: 'untested',
  }),
);
