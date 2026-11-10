import { defineKey } from '../../../schema/key.ts';
import { minimal } from '../../../schema/minimal.ts';
import { PRESETS } from './presets.ts';

/**
 * batch 4 round 1 (OVF-TODO): the classes whose margin column cannot hold fancy-shadow's note, each with what was measured
 * there (the column, \marginparwidth after FIT_NOTE_COLUMN, from a local probe of each class setting). fancy-shadow gives no
 * size, so todonotes sets the note at \normalsize, framed and shadowed; in a column of 24-34pt (39.61pt at frontiers' 12pt
 * type) its bold title overflows first. Only the shadowed preset is denied (`unless: { shadow: false }`): the sized presets
 * (review \tiny, red-alert and listed-green \scriptsize) and the unframed tag stay judged there, except under frontiers,
 * whose 39.61pt column held no framed \scriptsize note in batch 4 round 2 (0 of 208 branches): there only \tiny and the
 * package's own size stay.
 */
const NO_ROOM_FOR_A_NORMAL_SIZE_NOTE: readonly (readonly [string, string])[] = [
  ['class.ieeetran', 'ieeetran-journal and ieeetran-conference (29.15pt) and ieeetran-compsoc (28.18pt) 127 of 127 each, ieeeconf-ras (34.20pt) 125 of 125; e.g. ieeetran-journal.A d44e7154a62016494964d result a15de6b8a5, l.258 "Default" 15.98853pt and "theme)" 14.19852pt over'],
  ['class.acmart-acmsmall', '57 of 57 (24pt)'],
  ['class.cas-dc', '84 of 84 (29.50pt)'],
  ['class.mnras', '67 of 67 (30.27pt)'],
  ['class.siamart', '65 of 65 (30.76pt)'],
  ['class.icassp', '118 of 118 (31.21pt)'],
  ['class.ijcai', '118 of 118 (32.20pt)'],
  ['class.copernicus', '117 of 117 (33.20pt)'],
  ['class.icml', '118 of 118 (33.65pt)'],
  ['class.usenix', '115 of 115 (34.20pt)'],
  ['class.frontiers', "109 of 109 (39.61pt, at the class's 12pt type)"],
];

export default defineKey(
  minimal({
    id: 'note.todonotes',
    node: 'containerBlock/note',
    description:
      'todonotes: \\todo[keys]{…}, a coloured note in the margin joined to its place by a line; color, linecolor, bordercolor, textcolor, size, line, noline, fancyline, inline, shadow per note; colorinlistoftodos and disable as package options. Uses TikZ. A margin note is \\marginparwidth wide: the class column, or the room its margin has where that column is under 2cm or runs off the paper. 17 templates.',
    writes: '\\todo[…,caption={…}]{{\\bfseries …\\par} …}',
    ctan: ['todonotes'],
    features: ['margin-note', 'connector-line', 'background', 'colored', 'shadow', 'small-type'],
    params: {
      color: { type: 'color', default: '', description: "the note's fill (color=); '' keeps todonotes' orange, none for no fill" },
      lineColor: { type: 'color', default: '', description: "the connecting line's colour (linecolor=); ''" },
      borderColor: { type: 'color', default: '', description: "the border's colour (bordercolor=); '', none for no border" },
      textColor: { type: 'color', default: '', description: "the text colour (textcolor=); ''" },
      size: { type: 'tex', default: '', description: "the text size (size=\\tiny); '' keeps the package's" },
      line: { type: 'enum', values: ['line', 'noline', 'fancyline'], default: 'line', description: 'the connecting line: straight, none, or curved' },
      // A preset with inline: true prints in the text: it leaves out the feature margin-note, which the testing pipeline reads as a
      // note set in the margin (its sentinel placed as outside).
      inline: { type: 'boolean', default: false, description: 'the note in the text instead of the margin (inline)' },
      shadow: { type: 'boolean', default: false, description: 'a drop shadow (shadow)' },
      colorInList: { type: 'boolean', default: false, description: "each entry's square in \\listoftodos in the note's colour (colorinlistoftodos)" },
      disable: { type: 'boolean', default: false, description: 'every note hidden (disable), for the final version' },
    },
    presets: PRESETS,
    deny: [
      {
        class: 'class.bmvc',
        reason:
          "each note is drawn in the margin, and bmvc2k's 410pt x 620pt page has inner=9mm and outer=6mm margins (bmvc2k.cls l.246), 25.5pt and 17.1pt: every note overflows (round b28 bmvc.A: 419 overfull-hbox rows, 0 passes)",
        evidence: [
          { kind: 'source', file: 'testing-pipeline/settings/classes/files/bmvc2k.cls', line: '246 (geometry: papersize={410pt,620pt}, inner=9mm, outer=6mm)' },
          { kind: 'compile', cell: 'GitHub run b28-e9f730a, bmvc.A: the note ways fail 3,233 not-denied rows and pass 294, all branches whose note held no sentinel' },
        ],
        // Inline, a note prints in the text at \linewidth, not in the margin (as for beamer).
        unless: { inline: true },
      },
      {
        class: 'class.beamer',
        reason:
          "each note is drawn \\marginparwidth wide in the margin, which beamer leaves at 4pt in a 28.45pt margin (geometry, hmargin=1cm): todonotes warns \"The length marginparwidth is less than 2cm\", every word overflows (\"Overfull \\hbox (32.5549pt too wide)\" at 'escapes'), and the 2cm it asks for would run 38.4pt off the paper; \\todo is a \\marginpar, so in beamer's theorem blocks, which are boxes, its content is lost too",
        evidence: [
          { kind: 'compile', cell: "ccffb8ed9e042f18ddbe7 (copy batch-3b beamer.A, result b29d63a4f5dd: the warning at l.1401, \\marginparwidth=4.0pt, l.60 'Overfull \\hbox (32.5549pt too wide)'; 260 of 310 branches overflow on their own lines, 39 lose their content below a theorem; the 5 passes are 4 displays, which place no sentinel, and a @review note at x -12.2pt, off the paper, in ca08a1ead019abd79fdbe)" },
          { kind: 'requirement', file: 'Template/template-requirement/Beamer.md', line: '29' },
        ],
        // Inline, a note prints in the text at \linewidth, not in the margin (no preset sets it yet; untested under beamer).
        unless: { inline: true },
      },
      {
        class: 'class.cas-sc',
        reason:
          "cas-sc leaves no margin a note fits in: its text block is 468.33pt wide on a 546.29pt page, 38.98pt from either edge, and it keeps article's 65pt \\marginparwidth and 11pt \\marginparsep, so a note ran 37pt off the paper; the room that margin has, 38.98pt less \\marginparsep on either side (memoir's rule, which the library's note-column fit applies), is 16.98pt, narrower than a note's own bold title (20.84pt in \\footnotesize) and than todonotes' 2cm",
        evidence: [
          { kind: 'compile', cell: "GitHub run 41584963423, cas-sc.A: COMPAT-GEOMETRY paperWidth 546.29291pt, oddLeft 38.98026pt, textWidth 468.3324pt; 987 of the 2,980 passing not-denied branches below a margin note shipped their sentinel off the paper (76 below this way), which the oracle did not check for a margin note's; since b22 it does (`sentinel:off-paper`), but not in this way's TikZ node, whose sentinels are placed `drawn` (b22 MC1/O-MNJ)" },
        ],
        // Inline, a note prints in the text at \linewidth, not in the margin.
        unless: { inline: true },
      },
      {
        // b30 (IEA-2): as asmeconf (b28 MARGIN-1), a page whose margins leave no column a note fits in.
        class: 'class.ieeeaccess',
        reason:
          "ieeeaccess leaves no margin a note fits in: its text block is 177.53mm (505.12pt, ieeeaccess-latexlib.cls l.266) on the a4paper option's 203.2mm (578.16pt) page (l.24-26), 36.31pt from the left edge (\\oddsidemargin 12.76mm, l.269-272) and 36.73pt from the right, and it keeps IEEEtran's 20pt \\marginparwidth beside a 10pt \\marginparsep (IEEEtran.cls l.1689-1690), and the room b22 MC1's fit gives a note column (the margin less \\marginparsep on either side, FIT_NOTE_COLUMN) is 16.31pt, so the class's 20pt column stays: narrower than the note's bold title (20.84pt in \\footnotesize), the line cas-sc (16.98pt) and asmeconf (14.14pt) are denied by, where oup-authoring-template's 29.57pt and acmsmall's 24pt stay. The class's T1 Courier (\\ttdefault pcr, l.256; \\encodingdefault T1, l.1099) never hyphenates, so a note's 'courierNew' (48pt at 8pt) overflows that column by 28.00003pt, and so does any unbreakable run wider than 30pt: a \\todo note (todonotes asks for 2cm) overflows at its first long word (GitHub run b29-6a43925, ieeeaccess.A: 444 not-denied note.todonotes branches, 29 passing; 410 fail on a note's own overfull box (19.85994pt, 17.62993pt) and 5 only on the class's foot boxes, so the deny takes about 34 passes (8%)). An inline note way (box.*) prints in the text; General's margin note stays a class failure (owner item MC3).",
        evidence: [
          { kind: 'source', file: 'testing-pipeline/settings/classes/files/ieeeaccess-latexlib.cls', line: '24-26 (a4paper 203.2mm), 256 (\\ttdefault pcr), 266 (\\textwidth 177.53mm), 269-272 (\\oddsidemargin 12.76mm), 1099 (\\encodingdefault T1)' },
          { kind: 'source', file: 'IEEEtran.cls (V1.8b, which the class loads)', line: '1689-1690 (\\marginparsep 10pt, \\marginparwidth 20pt)' },
          { kind: 'compile', cell: "GitHub run b29-6a43925, ieeeaccess.A: COMPAT-GEOMETRY oddLeft 36.3057pt; result 2191ca5157 l.1753, Overfull \\hbox (28.00003pt too wide), \\T1/pcr/m/n/8 courierNew; all five margin-note ways: 3,495 not-denied branches, 730 passing, 1,861 failing on the notes' own overfull boxes (28.00003pt 558, 11.60489pt 379, 40pt 305, 13.62976pt 275), and 864 failing only on the class's 505.12177pt foot boxes, which pass once the CI session's foot mend lands" },
        ],
        // Inline, a note prints in the text at \linewidth, not in the margin.
        unless: { inline: true },
      },
      {
        class: 'class.asmeconf',
        reason:
          "asmeconf leaves no margin a note fits in: its text block is 7.5in (542.03pt) on letter paper, 0.5in (36.14pt) from either edge (asmeconf.cls l.508, geometry left=0.5in, right=0.5in), and it keeps article's \\marginparsep (11pt, 10pt in two columns), so the room b22 MC1's fit gives a note column (the margin less \\marginparsep on either side, FIT_NOTE_COLUMN) is 14.14pt (GitHub probe b28-1, asmeconf.A: COMPAT-NOTEROOM \\marginparwidth 14.135pt beside \\marginparsep 11pt), narrower than the note's bold title (20.84pt in \\footnotesize) and than a five-letter word of its 8pt italic text ('short' overflowed it by 2.39pt), as under cas-sc (16.98pt). An inline note way (box.*) or General's note takes its place (b28 MARGIN-1)",
        evidence: [
          { kind: 'compile', cell: "GitHub run b27-39fa711, asmeconf.A: COMPAT-GEOMETRY paperWidth 614.295pt, oddLeft and evenLeft 36.135pt, textWidth 542.02501pt; d6798e4384649992529a5 result 0a42bff148, one note's words overflow its column by 2.31-33.87pt ('italic' 2.31pt, 'small-' 7.36pt, 'courierNew' 33.87pt); 365 of its 398 not-denied branches below this way fail, almost all on margin-note overfull boxes, and every margin note of d1e3ae8dc1e5d564a7679 result 342075df21 overflows ('short' 2.39pt, 'capes' 4.08pt)" },
        ],
        // Inline, a note prints in the text at \linewidth, not in the margin.
        unless: { inline: true },
      },
      {
        // batch 4 round 1 (OVF-ELS5P): as cas-sc (16.98pt) and asmeconf (14.14pt), margins that leave no column a note fits in.
        class: 'class.elsarticle-5p',
        reason:
          "elsarticle's 5p format leaves no margin a note fits in: its 522pt text block (two 252pt columns) stands 37.75pt from either edge of its 597.51pt page, beside an 11pt \\marginparsep, so the room b22 MC1's fit gives a note column (the margin less \\marginparsep on either side, FIT_NOTE_COLUMN) is 15.75pt, narrower than cas-sc's 16.98pt and than the note's bold title (20.84pt in \\footnotesize): a note's 8pt words overflow it ('verbatim' by 16.25pt, 'small-' by 10.02pt). elsarticle-preprint (a 65pt column) is untouched. An inline note way (box.*) prints in the text; General's margin note stays a class failure (owner item MC3).",
        evidence: [
          { kind: 'compile', cell: "batch 4 round 1, elsarticle-5p.A: COMPAT-GEOMETRY paperWidth 597.50787pt, oddLeft and evenLeft 37.75394pt, textWidth 522.0pt; local probe of the class setting with FIT_NOTE_COLUMN (ZeroTeX-NG): \\marginparwidth 15.75394pt beside \\marginparsep 11pt; d8abb67840fd4c4265514 result 4e6c7aab15, branch ba9a668c31531c181ceb5 (note.marginnote@italic-unadjusted), l.134 Overfull \\hbox (16.24606pt too wide), 'verbatim' at 8pt; over the five margin-note ways 2,791 not-denied branches fail on overfull boxes (note.marginnote 787, note.notecolumn 729, note.sidenotes 517, note.todonotes 463, note.marginpar 295) and 1,281 pass (note.marginnote 861)" },
        ],
        unless: { inline: true },
      },
      {
        // batch 4 round 2: frontiers' 39.61pt column (at the class's 12pt type) holds a \tiny note, not a framed \scriptsize one.
        class: 'class.frontiers',
        reason:
          "frontiers' margin column is 39.61pt at the class's 12pt type, and a framed note set in \\scriptsize (red-alert, listed-green) overflows it in every branch (by about 10pt); \\tiny (review) passes in most branches, the unframed tag in some, and fancy-shadow is denied with the other normal-size notes below. The rule reads the size alone, so an inline note in \\scriptsize (no preset sets one) is denied too",
        evidence: [
          { kind: 'compile', cell: 'batch 4 round 2, frontiers.A: note.todonotes@listed-green passes 0 of 164 not-denied branches (163 on overfull boxes, 1 on page overflow), @red-alert 0 of 44 (44 overfull), against @review 34 of 56 and @tag 18 of 44; e.g. document d1b98c82914859a6eed25, cell cf8feecfc17e80e7b7c24, result fda00fc5f39120f3461ce1499c70b4ae2459900065b90c608bfa8225785df6cd, branch b1228f5a90d4d9c5596ac: Overfull \\hbox (10.40178pt too wide) at lines 122--122' },
        ],
        unless: { size: ['\\tiny', ''] },
      },
      ...NO_ROOM_FOR_A_NORMAL_SIZE_NOTE.map(([id, measured]) => ({
        class: id,
        reason:
          "fancy-shadow sets its note at todonotes' own \\normalsize (the preset gives no size), framed and with a drop shadow, and this class's margin column cannot hold a word of it: the note's bold title overflows first. Where the class's type is 9pt and its column 32pt (acmart's sigconf, aamas, vldb) only 5 of 56 fail, and from 38pt up (revtex, aastex, cvpr) almost none; a sized preset or the unframed tag is not denied here",
        evidence: [{ kind: 'compile' as const, cell: `batch 4 round 1: note.todonotes@fancy-shadow fails on overfull boxes in every not-denied branch, ${measured}` }],
        unless: { shadow: false },
      })),
    ],
    loads: [
      { pkg: 'todonotes' },
      { pkg: 'todonotes', options: ['colorinlistoftodos'], when: { colorInList: true } },
      { pkg: 'todonotes', options: ['disable'], when: { disable: true } },
    ],
    defines: [
      'cmd:\\todo',
    ],
    // Its body is set in a TikZ node, inside \marginpar unless inline: a box, so a float in it is "Not in outer par mode" (21cb83842c5b,
    // article.A run: document da56460ace75e3fc774d6, note.todonotes@listed-green > list.kernel@letter-paren > fig.svg@inkscape-text,
    // twice at l.162 `\end{figure}}`). 26 of the 285 float branches below it that print show it on their own lines (10 core pairs);
    // 211 fail on other errors first, and the 48 with no failure are image leaves, which place no sentinel, so a float lost fails nothing.
    // Its note is a TikZ node's minipage, which never breaks across pages (b23: tbl.longtable stays out of it).
    gives: { floats: false, breakable: false, boxDepth: 1 },
    // \todo prints through \marginpar unless inline (disabled, it prints nothing), a float: under a box, a footnote or columns it is lost, "Float(s) lost" at
    // \end{document} (5e82acb539, memoir.A run: document d7351df521275b54fafd9, thm.tcolorbox@titled > thm.amsthm@global >
    // note.todonotes@fancy-shadow, the document's only float, l.78). article.A run: 199 of 217 lose their content under a float-less
    // parent (59 of 62 under thm.tcolorbox, 63 of 77 under General's tcolorbox statement), 8 of 153 with none above.
    needsWhen: [{ when: { inline: false, disable: false }, needs: { floats: true } }],
    targetEngine: 'untested',
  }),
);
