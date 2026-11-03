import { defineKey } from '../../../schema/key.ts';
import { minimal } from '../../../schema/minimal.ts';
import { NUMBERING } from '../node.ts';
import { PRESETS } from './presets.ts';

export default defineKey(
  minimal({
    id: 'head.sectsty',
    node: 'paragraph/heading',
    description:
      'sectsty: heading fonts without touching their layout, \\allsectionsfont{font} for every level or \\sectionfont, \\subsectionfont … per level when the sizes are set; \\raggedright, \\nohang\\centering or \\raggedleft for alignment (never on the run-in paragraph levels), \\underline last for underlined titles. 13 templates.',
    ctan: ['sectsty'],
    features: ['sans-serif', 'bold-head', 'smallcaps-head', 'upright-body', 'colored', 'centered'],
    params: {
      font: { type: 'tex', default: '\\sffamily', description: "family, series and shape over the class's bold heading font" },
      scale: { type: 'enum', values: ['class', 'kernel', 'larger', 'smaller', 'text'], default: 'class', description: "each level's size: kernel the standard classes', larger or smaller one step, text the text size (chapters and parts stay large); class leaves the class's sizes" },
      color: { type: 'color', default: '', description: "an xcolor colour for the heading, or '' for none" },
      align: { type: 'enum', values: ['class', 'left', 'center', 'right'], default: 'class', description: 'alignment of the titles above the paragraph level' },
      underline: { type: 'boolean', default: false, description: 'titles underlined (\\underline last; long titles do not break)' },
      ...NUMBERING,
    },
    presets: PRESETS,
    loads: [
      { pkg: 'sectsty' },
      { pkg: 'xcolor' },
    ],
    requires: [
      'counter:{kind}',
    ],
    deny: [
      { class: 'class.acmart', reason: 'acmart stops any redefinition of \\section ("Please do not do this for ACM submissions!"), which sectsty makes as titlesec does', evidence: [{ kind: 'compile', cell: 'testing-pipeline/out/profiles/acmart-manuscript.A.json' }] },
      // Its solo branches stop at "The sectsty package doesn't work with this document class" under these (library run, 2026-10-30).
      { class: 'class.amsart', reason: "sectsty refuses amsart's sectioning (\"The sectsty package doesn't work with this document class\")", evidence: [{ kind: 'compile', cell: 'testing-pipeline/out/results/7b3c45eff581 (solo, amsart.A)' }] },
      { class: 'class.ieeetran', reason: "sectsty refuses IEEEtran's sectioning (\"The sectsty package doesn't work with this document class\")", evidence: [{ kind: 'compile', cell: 'testing-pipeline/out/results/854d5f9b88a6 (solo, ieeetran-journal.A)' }] },
      { class: 'class.revtex4-2', reason: "sectsty refuses REVTeX's sectioning (\"The sectsty package doesn't work with this document class\")", evidence: [{ kind: 'compile', cell: 'testing-pipeline/out/results/854d5f9b88a6 (solo, revtex4-2-aps.A)' }] },
      { class: 'class.beamer', reason: 'beamer replaces the sectioning commands sectsty restyles', evidence: [{ kind: 'requirement', file: 'Template/template-requirement/Beamer.md', line: '54' }] },
      // sectsty works only where article, report, book or a KOMA class is loaded (sectsty.sty l.277-297, \@ifclassloaded): every other
      // class stops at its load, document-wide, wherever a heading uses this way. mnras, siamart251216 and aastex701 are classes of
      // their own, not built on article (no \LoadClass), with sectioning of their own. GitHub run 41584963423, l.296 of the package
      // (F13: 2,882 branches). extarticle, also a class of its own, is not denied since b22: its sectioning is article.cls's, and the
      // handler marks article as loaded while sectsty loads under it (handler.ts, EXTARTICLE; 232 extarticle.A and 202 extarticle.B
      // fit, not-denied branches, whose article twins pass 221 and 193).
      { class: 'class.mnras', reason: "sectsty refuses mnras, a class of its own (mnras.cls loads no article): \"The sectsty package doesn't work with this document class\" (sectsty.sty l.277-297), document-wide", evidence: [{ kind: 'source', file: 'sectsty.sty (sectsty 2002/02/25 v2.0.2, MiKTeX snapshot 9766)', line: '277-297' }, { kind: 'compile', cell: 'GitHub run 41584963423 results/1eb604aa86c7 (mnras.A, d08645e784cb7e3a4898e, l.296)' }] },
      { class: 'class.siamart', reason: "sectsty refuses siamart251216, a class of its own (based on article.cls, but it loads no article): \"The sectsty package doesn't work with this document class\" (sectsty.sty l.277-297), document-wide", evidence: [{ kind: 'source', file: 'sectsty.sty (sectsty 2002/02/25 v2.0.2, MiKTeX snapshot 9766)', line: '277-297' }, { kind: 'compile', cell: 'GitHub run 41584963423 results/4b4ead44f703 (siamart.A, d08645e784cb7e3a4898e, l.296)' }] },
      { class: 'class.aastex', reason: "sectsty refuses aastex701, a class of its own (it loads no article): \"The sectsty package doesn't work with this document class\" (sectsty.sty l.277-297), document-wide", evidence: [{ kind: 'source', file: 'sectsty.sty (sectsty 2002/02/25 v2.0.2, MiKTeX snapshot 9766)', line: '277-297' }, { kind: 'compile', cell: 'GitHub run 41584963423 results/5a078b3e1f7f (aastex.A, d6e79a1062349f3243521, l.296)' }] },
      // cas and sn-jnl load article, so sectsty passes its check, but they define its \sectionfont … \subparagraphfont: its
      // \newcommand*s stop (sectsty.sty l.256-265), \SS@sectfont and the other level fonts are never defined, and every heading at
      // a level sectsty redefines then stops at "Undefined control sequence" (F24 1,277; their share of F23, 470; F100, F124 22).
      { class: 'class.cas-sc', reason: 'cas-common.sty defines \\sectionfont (l.1913), so sectsty stops at "Command \\sectionfont already defined" (sectsty.sty l.256), leaves \\SS@sectfont undefined, and every \\section then stops at "Undefined control sequence"', evidence: [{ kind: 'source', file: 'cas-common.sty (els-cas-templates, MiKTeX snapshot 9766)', line: '1913' }, { kind: 'compile', cell: 'GitHub run 41584963423 results/933bc2927b1a (cas-sc.A, d08645e784cb7e3a4898e, l.257 of sectsty.sty, then \\SS@sectfont at l.329)' }] },
      { class: 'class.cas-dc', reason: 'cas-common.sty defines \\sectionfont (l.1913), so sectsty stops at "Command \\sectionfont already defined" (sectsty.sty l.256), leaves \\SS@sectfont undefined, and every \\section then stops at "Undefined control sequence"', evidence: [{ kind: 'source', file: 'cas-common.sty (els-cas-templates, MiKTeX snapshot 9766)', line: '1913' }, { kind: 'compile', cell: 'GitHub run 41584963423 results/e3d5ddfe20b5 (cas-dc.A, d08645e784cb7e3a4898e, l.257 of sectsty.sty, then \\SS@sectfont at l.329)' }] },
      { class: 'class.sn-jnl', reason: 'sn-jnl.cls defines \\sectionfont to \\subparagraphfont (l.922-927), so each of sectsty\'s \\newcommand*s stops at "already defined" (sectsty.sty l.256-265), its level fonts stay undefined, and every heading then stops at "Undefined control sequence" (\\SS@sectfont, \\SS@subparafont in \\@svsechd)', evidence: [{ kind: 'source', file: 'testing-pipeline/settings/classes/files/sn-jnl.cls', line: '922-927 (CR line ends)' }, { kind: 'compile', cell: 'GitHub run 41584963423 results/51b77df01aae (sn-jnl.A, d2440001176455fd2f2b7: l.257-265 of sectsty.sty, then \\SS@subparafont at l.54)' }] },
    ],
    // Below cols.vwcol a heading comes out at the full text width (172.7pt over in a 0.5 column): 0 of 561 library headings there pass but
    // head.sectsty@smallcaps's \subparagraph (55 of 59), run-in titles that never print (their footnote sibling's sentinel is missing).
    // Copy batch-3b, 5 pairs; e.g. d165d94f2adcdc3093699 result 82adbd1a35 l.150, an unmarked \section* 172.7pt over.
    needs: { paragraph: true },
    zerotex: 'untested',
  }),
);
