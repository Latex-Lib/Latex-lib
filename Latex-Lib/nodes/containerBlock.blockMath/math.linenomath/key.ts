import { defineKey } from '../../../schema/key.ts';
import { minimal } from '../../../schema/minimal.ts';
import { PRESETS } from './presets.ts';

/**
 * math.linenomath: AGU's way to keep line numbers through a display. lineno numbers the lines of the running text and skips
 * a display; its starred linenomath* environment numbers the display's lines as well (lineno.sty's linenomath*: the
 * mathlines behaviour for that one display). AGU's template asks authors to surround every equation with it
 * (agujournaltemplate.tex l.208-214, 296-301) and turns numbering on with \linenumbers in its preamble (l.22).
 */
export default defineKey(
  minimal({
    id: 'math.linenomath',
    node: 'containerBlock/blockMath',
    description:
      "Display maths wrapped in lineno's linenomath* environment, so a line-numbered manuscript (AGU's journals) numbers the display's lines too: amsmath's displays inside (\\[ … \\] or equation for one row, align or gather for several, starred when unnumbered); \\linenumbers turns numbering on where the class does not.",
    writes: '\\begin{linenomath*} \\begin{equation} … \\label{…} \\end{equation} \\end{linenomath*}, \\begin{linenomath*} \\begin{align} … \\\\ … \\end{align} \\end{linenomath*}',
    ctan: ['lineno', 'amsmath'],
    features: ['numbered', 'unnumbered', 'aligned', 'multiline', 'line-numbers'],
    params: {
      multiline: { type: 'enum', values: ['auto', 'align', 'gather', 'multline', 'split'], default: 'auto', description: 'several rows: align when a row aligns on &, else gather (auto); or always align, gather, multline, or split inside equation' },
      lineNumbers: { type: 'boolean', default: false, description: 'turn line numbering on in the preamble (\\linenumbers), for a class that does not number lines itself' },
    },
    presets: PRESETS,
    loads: [{ pkg: 'amsmath' }, { pkg: 'lineno' }],
    requires: ['pkg:lineno'],
    deny: [
      {
        class: 'class.jss',
        reason:
          "jss.cls prints its title header itself at begindocument/end (l.471): \\maketitle runs `\\@oddhead{\\@myoddhead} \\par` (l.302), where article's \\@oddhead takes no argument, so the header is set in a group and its `\\\\[-1.42cm]` (l.258) ends a line inside it: the \\vadjust that \\\\[…] leaves carries `\\reserved@f`, which \\\\ \\let to \\relax only inside that group. With \\linenumbers on from the preamble, lineno 5.9 (2026/03/08) runs a paragraph's \\vadjust material from \\@LN@do@vadjusts after the paragraph ends, outside the group, so every document stops at \\begin{document} on 'Undefined control sequence' (\\reserved@f). lineno loaded without \\linenumbers (wrap-only) builds; numbering switched on after the class's title (\\AddToHook{begindocument/end}{\\linenumbers}) builds too",
        evidence: [
          { kind: 'compile', cell: "batch 4 round 1, jss.A: document d44e7154a62016494964d, cell c5715a8f42ef5bbc9575d, result 0b4701e82e9f, l.184 \\begin{document} 'Undefined control sequence. \\@LN@do@vadjusts ...o@vadjusts \\relax \\reserved@f \\@vspace@calcify {-1.42cm}'; 527 jss.A cells (12,249 judged branches) fail on it, every one holding math.linenomath@agu, and the pair's bisect names math.linenomath@agu the verified culprit (137 documents credited); the 214 cells with only @wrap-only build" },
          { kind: 'compile', reproducer: "ZeroTeX-NG (local Flouest, 2026-11-09), jss.A: \\usepackage{lineno}\\linenumbers in the preamble stops at l.5 \\begin{document} on the same error; without \\linenumbers, or with \\AddToHook{begindocument/end}{\\linenumbers}: ok. article.A with \\linenumbers: `\\noindent{Header\\\\[-1cm]} \\par` stops on the same error, `\\noindent Header\\\\[-1cm] \\par` is ok (lineno's deferred \\vadjust, not jss alone)" },
        ],
        unless: { lineNumbers: false },
      },
      // Batch 4 round 2: round 1 left "math.linenomath@agu \linenumbers: also sends sentinels off the page under frontiers and
      // oup" unpatched for want of a mechanism; the reproducers below show the page itself is wrong, not the measurement.
      {
        class: 'class.frontiers',
        reason:
          "with \\linenumbers on, every breakable tcolorbox (General's statement, thm.tcolorbox@boxed and @sharp, box.tcolorbox's breakable presets) and what follows it in its column is shipped above the paper: FrontiersinHarvard.cls (two columns, \\twocolumn at l.903) puts a box's split parts some 1,400pt over the page top, and the rest of the column prints blank. Without \\linenumbers (lineno loaded, the wrap-only preset), or with an unbreakable box, the same document is right; \\linenumbers switched on at begindocument/end is as wrong. Not the packages the class loads: each of flushend, stfloats, crop, amsthm, chngpage, caption, natbib and array under article [twocolumn] with \\linenumbers and the same boxes places them right, so it is the class's own page code. The way's own branches pass (the boxes they break are other branches'), so the deny is on the cause: about 600 passing agu branches here, against about 950 failing branches in other ways",
        evidence: [
          { kind: 'compile', cell: "batch 4 round 2, frontiers.A: every one of the 730 branches whose sentinel shipped above the paper (y over 1,000pt on a 795pt page; no other pair but oup-authoring-template.A shows one) sits in a document holding math.linenomath@agu (154 documents); document dcf7a4cdcf9bbcf9df32b, cell c82cf14b86d7aa30ec061, result d30286d121, branch b6016031f605fa1930613 (thm.tcolorbox@boxed > thm.tcolorbox@boxed > General's paragraph) at x 250.0pt, y 2067.4pt on page 1; dd26c71042b415c42f97b, cell c689809153764bade9018, result 36b062120e, branch bd056c44737aed3be4e29 at y 1915.0pt on page 2. Documents with @agu fail 2,277 of 13,595 judged branches (924 sentinel:outside), those without 1,071 of 10,947 (169)" },
          { kind: 'compile', reproducer: "ZeroTeX-NG (local Flouest, 2026-11-10), frontiers.A setting: \\usepackage{lineno}\\linenumbers, then six paragraphs each followed by a [breakable] tcbtheorem holding a nested one, a sentinel in each: page 1's second column ships its sentinels at y 2223pt, 2120pt, 1907pt (paper 795pt) and prints blank; without \\linenumbers they ship at y 711pt down to 143pt; with \\AddToHook{begindocument/end}{\\linenumbers} as wrong as before; article [twocolumn] with \\linenumbers: right" },
        ],
        unless: { lineNumbers: false },
      },
      {
        class: 'class.oup-authoring-template',
        reason:
          "with \\linenumbers on, every breakable tcolorbox (General's statement, thm.tcolorbox@boxed and @sharp, box.tcolorbox's breakable presets) and what follows it in its column is shipped above the paper, as under frontiers: the class (two columns, its own \\twocolumn) puts the box's split parts some 1,500pt over the page top and the rest of the column prints blank. Lineno loaded without \\linenumbers (the wrap-only preset), or an unbreakable box, is right; \\linenumbers at begindocument/end is as wrong. Not the packages it shares with frontiers (flushend, stfloats, crop and the rest: each is right under article [twocolumn]). The way's own branches pass, so the deny is on the cause: about 610 passing agu branches here, against about 900 failing branches in other ways",
        evidence: [
          { kind: 'compile', cell: "batch 4 round 2, oup-authoring-template.A: every one of the 668 branches whose sentinel shipped above the paper (y over 1,000pt on a 785pt page) sits in a document holding math.linenomath@agu (155 documents); document dc3e6ae4dd7a0613d6f61, cell c99784e78fb2fd6a61afe, result b248eb095d, branch bf5ace207f38683da2c1e (thm.tcolorbox@titled in General's breakable statement) at x 48.8pt, y 2063.8pt on page 7. Documents with @agu fail 1,972 of 12,505 judged branches (765 sentinel:outside), those without 808 of 9,493 (21)" },
          { kind: 'compile', reproducer: "ZeroTeX-NG (local Flouest, 2026-11-10), oup-authoring-template.A setting: \\usepackage{lineno}\\linenumbers and the same [breakable] tcbtheorems: page 1's second column ships at y 2189.9pt to 1630.6pt (paper 785pt) and the rendered page shows only the first column's opening paragraph; without \\linenumbers, or with the boxes unbreakable, every sentinel ships inside the text block" },
        ],
        unless: { lineNumbers: false },
      },
    ],
    gives: { math: true },
    // Typeset on ZeroTeX-NG under article (both presets) and AGU's agujournal2019.cls [draft] (the agu preset): equation, \[ … \],
    // align with row labels and \\[2pt], a nested aligned and cases, each in linenomath*. class.agu's pinned agujournal2025.cls is
    // not among the class files here; its manuscript branch is the 2019 class's code (the profile's note).
    targetEngine: 'yes',
  }),
);
