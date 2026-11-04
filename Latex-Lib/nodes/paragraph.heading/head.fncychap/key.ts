import { defineKey } from '../../../schema/key.ts';
import { minimal } from '../../../schema/minimal.ts';
import { NUMBERING } from '../node.ts';
import { PRESETS } from './presets.ts';

export default defineKey(
  minimal({
    id: 'head.fncychap',
    node: 'paragraph/heading',
    description:
      'fncychap: a ready-made chapter opening, \\usepackage[Sonny]{fncychap} (Lenny, Glenn, Conny, Rejne, Bjarne, Bjornstrup, PetersLenny), adjusted with \\ChNameVar, \\ChNumVar, \\ChTitleVar, \\ChRuleWidth and the case commands; only chapters change, every heading prints with the kernel command. A style\'s own fonts are written in NFSS, since KOMA-Script refuses fncychap\'s \\rm and \\sf. Under two columns Bjornstrup\'s \\chapter* head goes across the page (\\@topnewpage), as the kernel\'s does, since its boxes are \\textwidth wide; they are also as wide as the line the head is set in (\\linewidth), for the starred head KOMA-Script still sets in the column. 3 templates.',
    ctan: ['fncychap'],
    features: ['chapter-opening', 'ruled', 'sans-serif', 'bold-head', 'smallcaps-head', 'uppercase', 'centered', 'flush-right', 'background', 'numbered'],
    params: {
      style: { type: 'enum', values: ['Sonny', 'Lenny', 'Glenn', 'Conny', 'Rejne', 'Bjarne', 'Bjornstrup', 'PetersLenny'], default: 'Sonny', description: 'the chapter style (the package option)' },
      nameFont: { type: 'tex', default: '', description: 'the "Chapter" word\'s font (\\ChNameVar); \'\' keeps the style\'s (written in NFSS, which KOMA-Script and memoir accept)' },
      numberFont: { type: 'tex', default: '', description: "the number's font (\\ChNumVar); '' keeps the style's" },
      titleFont: { type: 'tex', default: '', description: "the title's font (\\ChTitleVar); '' keeps the style's (written in NFSS, which KOMA-Script and memoir accept)" },
      ruleWidth: { type: 'dimen', default: '', description: "the style's rule width (\\ChRuleWidth); '' keeps the style's" },
      nameCase: { type: 'enum', values: ['style', 'upper', 'lower', 'asis'], default: 'style', description: "the chapter name's case (\\ChNameUpperCase, \\ChNameLowerCase, \\ChNameAsIs)" },
      titleCase: { type: 'enum', values: ['style', 'upper', 'lower', 'asis'], default: 'style', description: "the title's case (\\ChTitleUpperCase, \\ChTitleLowerCase, \\ChTitleAsIs)" },
      ...NUMBERING,
    },
    presets: PRESETS,
    loads: [
      { pkg: 'fncychap', options: ['Sonny'], when: { style: 'Sonny' } },
      { pkg: 'fncychap', options: ['Lenny'], when: { style: 'Lenny' } },
      { pkg: 'fncychap', options: ['Glenn'], when: { style: 'Glenn' } },
      { pkg: 'fncychap', options: ['Conny'], when: { style: 'Conny' } },
      { pkg: 'fncychap', options: ['Rejne'], when: { style: 'Rejne' } },
      { pkg: 'fncychap', options: ['Bjarne'], when: { style: 'Bjarne' } },
      { pkg: 'fncychap', options: ['Bjornstrup'], when: { style: 'Bjornstrup' } },
      { pkg: 'fncychap', options: ['PetersLenny'], when: { style: 'PetersLenny' } },
    ],
    requires: [
      'counter:{kind}',
      'counter:chapter',
    ],
    // No memoir deny (CL3b, b21). memoir refused fncychap's \ChNameVar and \ChTitleVar as the package gives them, LaTeX 2.09 \sf
    // and \rm ("Class memoir Error: Font command \sf is not supported", memoir.cls l.6892; the copy's memoir.A results
    // 5586c0bd4412 for Sonny and 0036c6eea2ff for Conny). Those are the only old font commands Sonny and Conny run (fncychap.sty
    // v1.34 l.191-193 and l.504-506; their \DOCH, \DOTI and \DOTIS use the Var macros), and CL3 sets both in NFSS (`STYLE_FONTS`).
    // GitHub run 41584963423 still denied the two under memoir, so it shows this by the rest: no cell of its 48 pairs has an
    // old-font-command error; KOMA-Script, which refuses the same commands, passes Sonny 99 of 108 in each of scrreprt.A,
    // scrreprt.B, scrbook.A and scrbook.B and Conny 57, 59, 35 and 50 of 64 (none failing on a font); and memoir passes
    // fncychap's own chapter heads in its other two styles, Bjornstrup 92 of 93 (memoir.A) and 74 of 78 (memoir.B),
    // lenny-raggedleft 103 of 106 and 77 of 91 not-denied, whose \DOCH runs the same \mghrulefill, \FmN and \@chapapp. The next
    // run is the first to compile Sonny and Conny under memoir.
    // Below cols.vwcol a heading comes out at the full text width (172.7pt over in a 0.5 column): 0 of 561 library headings there pass but
    // head.sectsty@smallcaps's \subparagraph (55 of 59), run-in titles that never print (their footnote sibling's sentinel is missing).
    // Copy batch-3b, 5 pairs; e.g. d165d94f2adcdc3093699 result 82adbd1a35 l.150, an unmarked \section* 172.7pt over.
    needs: { paragraph: true },
    zerotex: 'untested',
  }),
);
