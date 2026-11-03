import { defineKey } from '../../../schema/key.ts';
import { minimal } from '../../../schema/minimal.ts';
import { PRESETS } from './presets.ts';

export default defineKey(
  minimal({
    id: 'note.marginnote',
    node: 'containerBlock/note',
    description:
      'marginnote: \\marginnote{…}[voffset] beside the line it is written on, a margin note that is not a float, so it also works where \\marginpar does not (floats, footnotes). The adjust options, \\marginfont, \\raggedleftmarginnote and \\raggedrightmarginnote, \\marginnotevadjust, \\reversemarginpar. 21 templates.',
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
      width: { type: 'dimen', default: '', description: "\\marginparwidth; ''" },
      title: { type: 'boolean', default: true, description: "the note's title in bold above its text (or as the box's title)" },
    },
    presets: PRESETS,
    deny: [
      {
        class: 'class.beamer',
        reason:
          "a slide has no margin for a note: beamer loads geometry with hmargin=1cm, a 28.45pt margin, and leaves \\marginparwidth, the width \\marginnote sets its text in, at 4pt, so every word overflows (\"Overfull \\hbox (13.631pt too wide)\" at the word 'bold'); a width that holds text runs off the paper",
        evidence: [
          { kind: 'compile', cell: "c3dbd9c230243a043511d (copy batch-3b beamer.A, result d0c8ca013343: \\marginparwidth=4.0pt, l.60 'Overfull \\hbox (13.631pt too wide)'; 414 of 638 branches overflow on their own lines; the 155 passes are 86 displays and 66 images with no file, which place no sentinel, and 3 notes in ca08a1ead019abd79fdbe set 142.26pt wide by a @wide marginpar beside them, shipped at x 17.9pt and y -93.8pt or never)" },
          { kind: 'requirement', file: 'Template/template-requirement/Beamer.md', line: '29' },
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
    // containerBlock/note, boxDepth 1), so a longtable (maxBoxDepth 0) is not filed below it.
    // A footnote in it is lost: its insert stays in the note's \vbox (marginnote.sty, \vbox to\z@ in \rlap or \llap, put in by
    // \vadjust), and TeX takes an insert to the page only from the main vertical list (GitHub run 41584963423: 4 of 182 not-denied
    // branches with General's footnote anchor below it pass, all under revtex4-2-aps, whose footnotes are bibliography notes;
    // 170 ship the note and its mark but never the text, e.g. acmart-manuscript.A df8785e02fa69250eff4c result e55ab5c2dd,
    // branch bece41309677755440868, '.t never shipped'). [OV2]
    gives: { floats: false, footnotes: false, boxDepth: 1 },
    zerotex: 'yes',
  }),
);
