import { defineKey } from '../../../schema/key.ts';
import { minimal } from '../../../schema/minimal.ts';
import { PRESETS } from './presets.ts';

export default defineKey(
  minimal({
    id: 'note.marginnote',
    node: 'containerBlock/note',
    description:
      'marginnote: \\marginnote{…}[voffset] beside the line it is written on, a margin note that is not a float, so it also works where \\marginpar does not (floats, footnotes). The adjust options, \\marginfont, \\raggedleftmarginnote and \\raggedrightmarginnote, \\marginnotevadjust, \\reversemarginpar. 21 templates.',
    writes: '\\marginnote{{\\bfseries …\\par} …}',
    ctan: ['marginnote'],
    features: ['margin-note', 'sans-serif', 'small-type', 'colored', 'italic-body'],
    params: {
      font: { type: 'tex', default: '\\footnotesize', description: "\\marginfont, the notes' font" },
      color: { type: 'color', default: '', description: "an xcolor colour for the notes, or ''" },
      align: { type: 'enum', values: ['package', 'justified', 'center'], default: 'package', description: 'package: ragged towards the text; justified or centred (\\raggedleftmarginnote, \\raggedrightmarginnote)' },
      adjust: { type: 'enum', values: ['package', 'fulladjust', 'heightadjust', 'depthadjust', 'noadjust'], default: 'package', compat: true, description: "how the note is aligned with its line's height and depth (the package option)" },
      vadjust: { type: 'dimen', default: '', description: "\\marginnotevadjust, a vertical shift of every note; ''" },
      offset: { type: 'dimen', default: '', description: "the note's own vertical offset, \\marginnote{…}[offset]; ''" },
      // In two columns the kernel ignores \reversemarginpar for \marginpar, each column's notes going to its own side (ltoutput.dtx
      // l.5280-5290); marginnote honours it and sends the notes to the far side of the page (copy batch-3b, result 1613cd9be943: anchor
      // at x 92.27pt, note at x 582.3pt).
      side: { type: 'enum', values: ['outer', 'reverse'], default: 'outer', description: "the margin (\\reversemarginpar for the other one); in two columns, where the kernel's \\marginpar keeps each column's notes on its own side, marginnote sends them to the far side" },
      width: { type: 'dimen', default: '', description: "\\marginparwidth, for the whole document; '' keeps the class's, or the room its margin has where the class's is under 2cm or runs off the paper (memoir's rule: the narrower margin, on both pages when they alternate, less twice \\marginparsep); a width given here is kept where it is on the paper, otherwise the wider of the class's column and that room" },
      title: { type: 'boolean', default: true, description: "the note's title in bold above its text (or as the box's title)" },
    },
    presets: PRESETS,
    deny: [
      {
        class: 'class.bmvc',
        reason:
          "bmvc2k's page has no margin for a note: geometry sets a 410pt x 620pt page with inner=9mm and outer=6mm (bmvc2k.cls l.246), a 25.5pt and a 17.1pt margin, so \\marginnote's text overflows at every word or runs off the paper (round b28 bmvc.A: 1,169 overfull-hbox rows, 223 off the paper; the passes are notes that held no sentinel)",
        evidence: [
          { kind: 'source', file: 'testing-pipeline/settings/classes/files/bmvc2k.cls', line: '246 (geometry: papersize={410pt,620pt}, inner=9mm, outer=6mm)' },
          { kind: 'compile', cell: 'GitHub run b28-e9f730a, bmvc.A: the note ways fail 3,233 not-denied rows (overfull hboxes while \\output is active, 31.39998pt and 18.32pt the commonest; sentinel:off-paper 445) and pass 294, all branches whose note held no sentinel' },
        ],
      },
      {
        class: 'class.beamer',
        reason:
          "a slide has no margin for a note: beamer loads geometry with hmargin=1cm, a 28.45pt margin, and leaves \\marginparwidth, the width \\marginnote sets its text in, at 4pt, so every word overflows (\"Overfull \\hbox (13.631pt too wide)\" at the word 'bold'); a width that holds text runs off the paper",
        evidence: [
          { kind: 'compile', cell: "c3dbd9c230243a043511d (copy batch-3b beamer.A, result d0c8ca013343: \\marginparwidth=4.0pt, l.60 'Overfull \\hbox (13.631pt too wide)'; 414 of 638 branches overflow on their own lines; the 155 passes are 86 displays and 66 images with no file, which place no sentinel, and 3 notes in ca08a1ead019abd79fdbe set 142.26pt wide by a @wide marginpar beside them, shipped at x 17.9pt and y -93.8pt or never)" },
          { kind: 'requirement', file: 'Template/template-requirement/Beamer.md', line: '29' },
        ],
      },
      {
        class: 'class.cas-sc',
        reason:
          "cas-sc leaves no margin a note fits in: its text block is 468.33pt wide on a 546.29pt page, 38.98pt from either edge, and it keeps article's 65pt \\marginparwidth and 11pt \\marginparsep, so a note ran 37pt off the paper; the room that margin has, 38.98pt less \\marginparsep on either side (memoir's rule, which the library's note-column fit applies), is 16.98pt, narrower than a note's own bold title (20.84pt in \\footnotesize)",
        evidence: [
          { kind: 'compile', cell: "GitHub run 41584963423, cas-sc.A: COMPAT-GEOMETRY paperWidth 546.29291pt, oddLeft 38.98026pt, textWidth 468.3324pt; d13e0dcf2f1aebba0760a result e6ed0775a7, this way's @italic-unadjusted sentinel at x 682.8pt; 987 of the 2,980 passing not-denied branches below a margin note shipped their sentinel off the paper, which the oracle did not check for a margin note's until b22's `sentinel:off-paper` (b22 MC1/O-MNJ)" },
        ],
      },
      {
        // b30 (IEA-2): as asmeconf (b28 MARGIN-1), a page whose margins leave no column a note fits in.
        class: 'class.ieeeaccess',
        reason:
          "ieeeaccess leaves no margin a note fits in: its text block is 177.53mm (505.12pt, ieeeaccess-latexlib.cls l.266) on the a4paper option's 203.2mm (578.16pt) page (l.24-26), 36.31pt from the left edge (\\oddsidemargin 12.76mm, l.269-272) and 36.73pt from the right, and it keeps IEEEtran's 20pt \\marginparwidth beside a 10pt \\marginparsep (IEEEtran.cls l.1689-1690), and the room b22 MC1's fit gives a note column (the margin less \\marginparsep on either side, FIT_NOTE_COLUMN) is 16.31pt, so the class's 20pt column stays: narrower than the note's bold title (20.84pt in \\footnotesize), the line cas-sc (16.98pt) and asmeconf (14.14pt) are denied by, where oup-authoring-template's 29.57pt and acmsmall's 24pt stay. The class's T1 Courier (\\ttdefault pcr, l.256; \\encodingdefault T1, l.1099) never hyphenates, so a note's 'courierNew' (48pt at 8pt) overflows that column by 28.00003pt, and so does any unbreakable run wider than 30pt: \\marginnote's text overflows at its first long word (GitHub run b29-6a43925, ieeeaccess.A: 1,389 not-denied \\marginnote branches, 391 passing; 575 fail on a note's own overfull box and 407 only on the class's foot boxes, so the deny takes about 798 passes once the feet are mended (57%), each in a column four or five letters wide; of the 564 branches whose sentinel is the note's own, 124 pass). An inline note way (box.*) prints in the text; General's margin note stays a class failure (owner item MC3).",
        evidence: [
          { kind: 'source', file: 'testing-pipeline/settings/classes/files/ieeeaccess-latexlib.cls', line: '24-26 (a4paper 203.2mm), 256 (\\ttdefault pcr), 266 (\\textwidth 177.53mm), 269-272 (\\oddsidemargin 12.76mm), 1099 (\\encodingdefault T1)' },
          { kind: 'source', file: 'IEEEtran.cls (V1.8b, which the class loads)', line: '1689-1690 (\\marginparsep 10pt, \\marginparwidth 20pt)' },
          { kind: 'compile', cell: "GitHub run b29-6a43925, ieeeaccess.A: COMPAT-GEOMETRY oddLeft 36.3057pt; document d3e2e8ab2d894cb3e5bbc (result 518a903114): note.marginnote@italic-unadjusted, Overfull \\hbox (28.00003pt too wide) at lines 160--160; result 2191ca5157 l.1753, \\T1/pcr/m/n/8 courierNew, marginnote Info: xpos seems to be 36.3057pt; all five margin-note ways: 3,495 not-denied branches, 730 passing, 1,861 failing on the notes' own overfull boxes (28.00003pt 558, 11.60489pt 379, 40pt 305, 13.62976pt 275), and 864 failing only on the class's 505.12177pt foot boxes, which pass once the CI session's foot mend lands" },
        ],
      },
      {
        class: 'class.asmeconf',
        reason:
          "asmeconf leaves no margin a note fits in: its text block is 7.5in (542.03pt) on letter paper, 0.5in (36.14pt) from either edge (asmeconf.cls l.508, geometry left=0.5in, right=0.5in), and it keeps article's \\marginparsep (11pt, 10pt in two columns), so the room b22 MC1's fit gives a note column (the margin less \\marginparsep on either side, FIT_NOTE_COLUMN) is 14.14pt (GitHub probe b28-1, asmeconf.A: COMPAT-NOTEROOM \\marginparwidth 14.135pt beside \\marginparsep 11pt), narrower than the note's bold title (20.84pt in \\footnotesize) and than a five-letter word of its 8pt italic text ('short' overflowed it by 2.39pt), as under cas-sc (16.98pt). An inline note way (box.*) or General's note takes its place (b28 MARGIN-1)",
        evidence: [
          { kind: 'compile', cell: "GitHub run b27-39fa711, asmeconf.A: COMPAT-GEOMETRY paperWidth 614.295pt, oddLeft and evenLeft 36.135pt, textWidth 542.02501pt; d6798e4384649992529a5 result 0a42bff148, one note's words overflow its column by 2.31-33.87pt ('italic' 2.31pt, 'small-' 7.36pt, 'courierNew' 33.87pt); 691 of its 1,398 not-denied branches below this way fail, almost all on margin-note overfull boxes, and every margin note of d1e3ae8dc1e5d564a7679 result 342075df21 overflows ('short' 2.39pt, 'capes' 4.08pt)" },
        ],
      },
      {
        // batch 4 round 1 (OVF-ELS5P): as cas-sc (16.98pt) and asmeconf (14.14pt), margins that leave no column a note fits in.
        class: 'class.elsarticle-5p',
        reason:
          "elsarticle's 5p format leaves no margin a note fits in: its 522pt text block (two 252pt columns) stands 37.75pt from either edge of its 597.51pt page, beside an 11pt \\marginparsep, so the room b22 MC1's fit gives a note column (the margin less \\marginparsep on either side, FIT_NOTE_COLUMN) is 15.75pt, narrower than cas-sc's 16.98pt and than the note's bold title (20.84pt in \\footnotesize): a note's 8pt words overflow it ('verbatim' by 16.25pt, 'small-' by 10.02pt). elsarticle-preprint (a 65pt column) is untouched. An inline note way (box.*) prints in the text; General's margin note stays a class failure (owner item MC3).",
        evidence: [
          { kind: 'compile', cell: "batch 4 round 1, elsarticle-5p.A: COMPAT-GEOMETRY paperWidth 597.50787pt, oddLeft and evenLeft 37.75394pt, textWidth 522.0pt; local probe of the class setting with FIT_NOTE_COLUMN (ZeroTeX-NG): \\marginparwidth 15.75394pt beside \\marginparsep 11pt; d8abb67840fd4c4265514 result 4e6c7aab15, branch ba9a668c31531c181ceb5 (note.marginnote@italic-unadjusted), l.134 Overfull \\hbox (16.24606pt too wide), 'verbatim' at 8pt; over the five margin-note ways 2,791 not-denied branches fail on overfull boxes (note.marginnote 787, note.notecolumn 729, note.sidenotes 517, note.todonotes 463, note.marginpar 295) and 1,281 pass (note.marginnote 861)" },
        ],
      },
    ],
    loads: [
      { pkg: 'marginnote' },
      { pkg: 'marginnote', options: ['fulladjust'], when: { adjust: 'fulladjust' } },
      { pkg: 'marginnote', options: ['heightadjust'], when: { adjust: 'heightadjust' } },
      { pkg: 'marginnote', options: ['depthadjust'], when: { adjust: 'depthadjust' } },
      { pkg: 'marginnote', options: ['noadjust'], when: { adjust: 'noadjust' } },
      { pkg: 'xcolor' },
    ],
    defines: [
      'cmd:\\marginnote',
    ],
    // A float in the note is never output: "Float(s) lost" at \end{document} (c76122ffd0, article.A run: the only box of document
    // d66816450114925d61971, no 'Not in outer par mode'); 42 of 57 documents where it is the only box lose floats (8 core pairs).
    // A box: \marginnote sets its text in a \vbox in the margin, as General's marginnote note is counted (GENERAL_GIVES
    // containerBlock/note, boxDepth 1) that never breaks across pages (breakable: false, b23), so a longtable, which since b23 may
    // sit in one box that breaks, is not filed below it.
    // A footnote in it is lost: its insert stays in the note's \vbox (marginnote.sty, \vbox to\z@ in \rlap or \llap, put in by
    // \vadjust), and TeX takes an insert to the page only from the main vertical list (GitHub run 41584963423: 4 of 182 not-denied
    // branches with General's footnote anchor below it pass, all under revtex4-2-aps, whose footnotes were then bibliography
    // notes (footinbib, until b22's nofootinbib); 170 ship the note and its mark but never the text, e.g. acmart-manuscript.A
    // df8785e02fa69250eff4c result e55ab5c2dd, branch bece41309677755440868, '.t never shipped'). [OV2]
    // Since b22 the handler sets a note that holds a footnote inside footnotehyper's \savenotes … \spewnotes, as Flouest's
    // General note does (`\savenotes\marginnote{…}\spewnotes`), so the text is set after the note at the page's foot
    // (`keepingFootnotes`), and the footnote is no longer denied below it. [OV2-alt]
    gives: { floats: false, breakable: false, boxDepth: 1 },
    targetEngine: 'yes',
  }),
);
