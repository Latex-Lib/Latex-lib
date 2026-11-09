import type { Evidence } from '../../../schema/evidence.ts';
import { defineKey } from '../../../schema/key.ts';
import { minimal } from '../../../schema/minimal.ts';
import { PRESETS } from './presets.ts';

const SRC = (file: string, line: string): Evidence => ({ kind: 'source', file: `Latex Related Research/Latex-lib-main/Source/${file}`, line });
const EXAMPLE = (file: string, line: string): Evidence => ({ kind: 'source', file: `Latex Related Research/Latex-Template-Examples/${file}`, line });

/** One form's classes, with why the commands are theirs. */
const form = (name: string, classes: readonly string[], reason: string, evidence: readonly Evidence[]) => ({ when: { form: name }, classes: classes as never, reason, evidence });

export default defineKey({
  ...minimal({
    id: 'doc.class-setup',
    node: 'doc',
    description:
      "A class's own set-up commands in the preamble, the template's constants, one line per parameter set: memoir's layout and spacing (\\settrimmedsize, \\setlrmarginsandblock, \\setulmarginsandblock, \\checkandfixthelayout, \\OnehalfSpacing); jlreq's \\jlreqsetup{…}; ctex's \\ctexset{today=…, contentsname={…}} (ctexart, ctexrep, ctexbook, ctexbeamer); achemso's \\SectionNumbersOn and \\setkeys{acs}{…}; sn-jnl's \\unnumbered; SPIE's \\baselinestretch, \\pagestyle{empty} and first page number; Tufte-LaTeX's \\setsidenotefont and siblings; JACoW's title block skips; the standard letter's \\longindentation, \\makelabels and page style; elsarticle's \\newpageafter, \\keywordtitle and \\myfooter; exam's answer key (\\printanswers, \\framedsolutions) and points (\\pointpoints, \\bracketedpoints, \\qformat); ltxdoc's index and change history (\\EnableCrossrefs, \\CodelineIndex, \\RecordChanges, \\PrintIndex).",
    writes:
      '\\settrimmedsize{…}{…}{*} \\setlrmarginsandblock{…}{…}{*} \\setulmarginsandblock{…}{…}{*} \\checkandfixthelayout \\OnehalfSpacing | \\jlreqsetup{…} | \\ctexset{today=…, contentsname={…}} | \\SectionNumbersOn \\setkeys{acs}{…} | \\unnumbered | \\renewcommand{\\baselinestretch}{…} \\pagestyle{empty} \\setcounter{page}{…} | \\setsidenotefont{…} \\setmarginnotefont{…} \\setcaptionfont{…} \\setcitationfont{…} | \\setlength{\\titleblockstartskip}{…} | \\setlength{\\longindentation}{…} \\makelabels | \\newpageafter{…} \\keywordtitle{…} \\myfooter[…]{…} | \\printanswers \\framedsolutions | \\pointpoints{…}{…} \\qformat{…} | \\EnableCrossrefs \\CodelineIndex \\RecordChanges \\AtEndDocument{\\PrintIndex}',
    ctan: ['memoir', 'jlreq', 'ctex', 'achemso', 'tufte-latex', 'jacow', 'latex-base', 'elsarticle', 'exam'],
    features: ['class-styled'],
    params: {
      form: {
        type: 'enum',
        values: ['memoir', 'jlreq', 'ctex', 'achemso', 'sn-jnl', 'spie', 'tufte', 'jacow', 'letter', 'elsarticle', 'exam', 'ltxdoc'],
        default: 'memoir',
        compat: true,
        description: 'whose set-up commands: the class family the template is for',
      },
      // memoir
      trimHeight: { type: 'dimen', default: '', description: "memoir: the trimmed page's height (\\settrimmedsize, with trimWidth); ''" },
      trimWidth: { type: 'dimen', default: '', description: "memoir: the trimmed page's width; ''" },
      spine: { type: 'dimen', default: '', description: "memoir: the spine margin (\\setlrmarginsandblock{spine}{edge}{*}); ''" },
      edge: { type: 'dimen', default: '', description: "memoir: the fore-edge margin; ''" },
      upper: { type: 'dimen', default: '', description: "memoir: the upper margin (\\setulmarginsandblock{upper}{lower}{*}); ''" },
      lower: { type: 'dimen', default: '', description: "memoir: the lower margin; ''" },
      spacing: { type: 'enum', values: ['class', 'single', 'onehalf', 'double'], default: 'class', description: "memoir: line spacing (\\SingleSpacing, \\OnehalfSpacing, \\DoubleSpacing)" },
      // jlreq
      jlreqSettings: { type: 'tex', default: '', description: "jlreq: the key=value list of \\jlreqsetup{…}; ''" },
      // ctex
      ctexToday: { type: 'enum', values: ['class', 'big', 'small', 'old'], default: 'class', description: "ctex: the form of \\today (today=)" },
      contentsName: { type: 'tex', default: '', description: "ctex: the contents' title (contentsname=); ''" },
      ctexKeys: { type: 'tex', default: '', description: "ctex: further \\ctexset keys as the template writes them (figurename={…}, …); ''" },
      // achemso
      sectionNumbers: { type: 'enum', values: ['class', 'on', 'off'], default: 'class', description: 'achemso: section numbers (\\SectionNumbersOn, \\SectionNumbersOff); the journal .cfg decides by default' },
      acsKeys: { type: 'tex', default: '', description: "achemso: the \\setkeys{acs}{…} list (keywords=true, abbreviations=true, email=true …); ''" },
      // sn-jnl
      numbered: { type: 'boolean', default: true, description: "sn-jnl: numbered headings, the class's default; false prints \\unnumbered" },
      // spie, letter
      baselineStretch: { type: 'string', default: '', description: "SPIE: the line spacing factor (\\renewcommand{\\baselinestretch}{…}); ''" },
      pageStyle: { type: 'enum', values: ['class', 'empty', 'plain', 'headings'], default: 'class', description: 'SPIE and letter: the page style (\\pagestyle{…})' },
      firstPage: { type: 'string', default: '', description: "SPIE: the first page's number (\\setcounter{page}{…}); ''" },
      // tufte
      sidenoteFont: { type: 'tex', default: '', description: "Tufte: the side notes' font (\\setsidenotefont); ''" },
      marginnoteFont: { type: 'tex', default: '', description: "Tufte: the margin notes' font (\\setmarginnotefont); ''" },
      captionFont: { type: 'tex', default: '', description: "Tufte: the captions' font (\\setcaptionfont); ''" },
      citationFont: { type: 'tex', default: '', description: "Tufte: the margin citations' font (\\setcitationfont); ''" },
      // jacow
      titleblockStartSkip: { type: 'dimen', default: '', description: "JACoW: the space above the title block (\\titleblockstartskip); ''" },
      titleblockMiddleSkip: { type: 'dimen', default: '', description: "JACoW: the space inside the title block (\\titleblockmiddleskip); ''" },
      titleblockEndSkip: { type: 'dimen', default: '', description: "JACoW: the space after the title block (\\titleblockendskip); ''" },
      // letter
      longIndentation: { type: 'dimen', default: '', description: "letter: the closing's indentation (\\longindentation; 0pt flush left); ''" },
      makelabels: { type: 'boolean', default: false, description: 'letter: mailing labels after the letters (\\makelabels)' },
      ccName: { type: 'string', default: '', description: "letter: the cc label (\\ccname); ''" },
      enclName: { type: 'string', default: '', description: "letter: the enclosure label (\\enclname); ''" },
      // elsarticle
      newpageafter: { type: 'enum', values: ['none', 'title', 'author', 'abstract'], default: 'none', description: 'elsarticle: a page break after that part of the title block (\\newpageafter{…})' },
      keywordTitle: { type: 'string', default: '', description: "elsarticle: the keyword heading (\\keywordtitle; the class's Keywords); ''" },
      keywordTitleSep: { type: 'tex', default: '', description: "elsarticle: what follows the keyword heading (\\keywordtitlesep); ''" },
      footer: { type: 'tex', default: '', description: "elsarticle: the title page's footer line (\\myfooter[align]{…}); ''" },
      footerAlign: { type: 'enum', values: ['L', 'C', 'R'], default: 'C', description: "elsarticle: the footer line's alignment" },
      footerFont: { type: 'tex', default: '', description: "elsarticle: the footer line's font (\\myfooterfont); ''" },
      // exam
      printAnswers: { type: 'boolean', default: false, description: 'exam: the solutions printed (\\printanswers), an answer key' },
      solutionStyle: { type: 'enum', values: ['class', 'framed', 'shaded', 'unframed'], default: 'class', description: 'exam: how solutions are set (\\framedsolutions, \\shadedsolutions, \\unframedsolutions)' },
      solutionTitle: { type: 'string', default: '', description: "exam: the solutions' title (\\solutiontitle; the class's Solution:); ''" },
      pointName: { type: 'string', default: '', description: "exam: the singular of point (\\pointpoints, with pointsName); ''" },
      pointsName: { type: 'string', default: '', description: "exam: the plural of points; ''" },
      pointPlacement: { type: 'enum', values: ['class', 'bracketed', 'margin', 'rightmargin'], default: 'class', description: 'exam: where points stand (\\bracketedpoints, \\pointsinmargin, \\pointsinrightmargin)' },
      questionFormat: { type: 'tex', default: '', description: "exam: each question's head (\\qformat{…}); ''" },
      pointFormat: { type: 'tex', default: '', description: "exam: the points' format (\\pointformat{…}); ''" },
      // ltxdoc
      crossrefs: { type: 'enum', values: ['class', 'enable', 'disable'], default: 'class', description: 'ltxdoc: index cross-references (\\EnableCrossrefs, \\DisableCrossrefs)' },
      indexBy: { type: 'enum', values: ['none', 'codeline', 'page'], default: 'none', description: 'ltxdoc: index entries by code line or by page (\\CodelineIndex, \\PageIndex)' },
      recordChanges: { type: 'boolean', default: false, description: 'ltxdoc: the change history recorded (\\RecordChanges)' },
      doNotIndex: { type: 'tex', default: '', description: "ltxdoc: control sequences left out of the index (\\DoNotIndex{…}); ''" },
      printChanges: { type: 'boolean', default: false, description: 'ltxdoc: the change history printed at the end (\\AtEndDocument{\\PrintChanges})' },
      printIndex: { type: 'boolean', default: false, description: 'ltxdoc: the index printed at the end (\\AtEndDocument{\\PrintIndex})' },
    },
    presets: PRESETS,
    requiresWhen: [
      { when: { form: 'memoir' }, requires: ['cmd:\\checkandfixthelayout'] },
      { when: { form: 'jlreq' }, requires: ['cmd:\\jlreqsetup'] },
      { when: { form: 'ctex' }, requires: ['cmd:\\ctexset'] },
      { when: { form: 'achemso' }, requires: ['cmd:\\SectionNumbersOn'] },
      { when: { form: 'sn-jnl' }, requires: ['cmd:\\unnumbered'] },
      { when: { form: 'tufte' }, requires: ['cmd:\\setsidenotefont'] },
      { when: { form: 'jacow' }, requires: ['length:\\titleblockstartskip'] },
      { when: { form: 'letter' }, requires: ['cmd:\\makelabels'] },
      { when: { form: 'elsarticle' }, requires: ['cmd:\\newpageafter'] },
      { when: { form: 'exam' }, requires: ['cmd:\\printanswers'] },
      { when: { form: 'ltxdoc' }, requires: ['cmd:\\PrintIndex'] },
    ],
    only: [
      'class.memoir',
      'class.jlreq',
      'class.ctexart',
      'class.ctexrep',
      'class.ctexbook',
      'class.ctexbeamer',
      'class.achemso',
      'class.sn-jnl',
      'class.spie',
      'class.tufte-handout',
      'class.tufte-book',
      'class.jacow',
      'class.letter',
      'class.elsarticle',
      'class.elsarticle-3p',
      'class.exam',
      'class.ltxdoc',
    ],
    onlyWhen: [
      form('memoir', ['class.memoir'], "\\settrimmedsize, \\setlrmarginsandblock, \\checkandfixthelayout and \\OnehalfSpacing are memoir's own layout and spacing commands (setspace is only emulated by memoir)", [SRC('0185-memhfixc/memoir.dtx', '4634, 4705, 5513, 7687-7772')]),
      form('jlreq', ['class.jlreq'], "\\jlreqsetup is jlreq's own preamble-only settings command", [SRC('0529-jlreq/jlreq.cls', '437-445')]),
      form('ctex', ['class.ctexart', 'class.ctexrep', 'class.ctexbook', 'class.ctexbeamer'], '\\ctexset is the ctex bundle\'s interface, loaded by its classes', [SRC('0624-houluy-buptemplate/buptthesis.cls', '236-238, 300-304')]),
      form('achemso', ['class.achemso'], "\\SectionNumbersOn and the acs keys are achemso's", [SRC('0528-achemso/achemso.dtx', '313-338, 1955-1968')]),
      form('sn-jnl', ['class.sn-jnl'], "\\unnumbered is sn-jnl's switch (cls:877-879)", [{ kind: 'requirement', file: 'Template/template-requirement/Springer_Nature_SN_Jnl.md', line: '54' }]),
      form('spie', ['class.spie'], "SPIE's template sets its line spacing, page style and first page number by hand (kernel commands, the template's values)", [EXAMPLE('class.spie/main.tex', '39, 103-105')]),
      form('tufte', ['class.tufte-handout', 'class.tufte-book'], "\\setsidenotefont and its siblings are Tufte-LaTeX's (tufte-common.def)", [SRC('0793-xtufte/latex/xtufte-common.def', '497-500')]),
      form('jacow', ['class.jacow'], "the title block lengths are JACoW's", [{ kind: 'source', file: 'template-lib-based-automation/Latex-Lib/classes/jacow.ts', line: '38, 50' }]),
      form('letter', ['class.letter'], "\\longindentation and \\makelabels are the standard letter class's", [{ kind: 'source', file: 'TinyTeX texmf-dist/tex/latex/base/letter.cls', line: '163-171, 216-220' }]),
      form('elsarticle', ['class.elsarticle', 'class.elsarticle-3p'], "\\newpageafter, \\keywordtitle and \\myfooter are elsarticle's", [SRC('0107-elsarticle/elsarticle.dtx', '808-812, 855-861, 1093-1101')]),
      form('exam', ['class.exam'], "\\printanswers, the solution styles, \\pointpoints and \\qformat are the exam class's", [EXAMPLE('class.exam/main.tex', '37, 56-59')]),
      form('ltxdoc', ['class.ltxdoc'], 'the index and change-history commands come from the doc package, which ltxdoc loads', [SRC('0577-latex-base-dev/doc.dtx', '3084, 4249, 4423, 4547, 5250')]),
    ],
    // Typeset ok on ZeroTeX-NG (2026-11-07), each preset under its class: memoir and memoir-trimmed (memoir), ctex (ctexart, ctexrep,
    // ctexbook, ctexbeamer, fontset=fandol), achemso (journal=jacsat, the title in the preamble), spie, tufte (tufte-handout and
    // tufte-book, nols), jacow, letter, elsarticle (preprint and 3p), exam-answers and exam-points (exam), ltxdoc. Not run: jlreq
    // (jlreq.cls stops under XeTeX at "Undefined control sequence. l.493 \epTeXinputencoding"; its profile's targetEngine is 'no')
    // and sn-jnl (sn-jnl.cls is in neither the mirror nor the class files). So 'untested'.
    targetEngine: 'untested',
  }),
  evidence: [
    SRC('0185-memhfixc/memoir.dtx', '4634-5513, 7687-7772'),
    SRC('0529-jlreq/jlreq.cls', '437-445'),
    SRC('0624-houluy-buptemplate/buptthesis.cls', '236-304'),
    SRC('0528-achemso/achemso.dtx', '300-375, 1955-1968'),
    { kind: 'requirement', file: 'Template/template-requirement/Springer_Nature_SN_Jnl.md', line: '54' },
    EXAMPLE('class.spie/main.tex', '39, 103-105'),
    SRC('0793-xtufte/latex/xtufte-common.def', '489-500'),
    { kind: 'source', file: 'template-lib-based-automation/Latex-Lib/classes/jacow.ts', line: '38, 50' },
    { kind: 'source', file: 'TinyTeX texmf-dist/tex/latex/base/letter.cls', line: '163-220' },
    SRC('0107-elsarticle/elsarticle.dtx', '808-888, 1088-1135'),
    EXAMPLE('class.exam/main.tex', '34-59'),
    SRC('0577-latex-base-dev/doc.dtx', '3084-5250'),
  ],
});
