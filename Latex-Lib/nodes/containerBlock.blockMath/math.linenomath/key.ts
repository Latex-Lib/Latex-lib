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
    ],
    gives: { math: true },
    // Typeset on ZeroTeX-NG under article (both presets) and AGU's agujournal2019.cls [draft] (the agu preset): equation, \[ … \],
    // align with row labels and \\[2pt], a nested aligned and cases, each in linenomath*. class.agu's pinned agujournal2025.cls is
    // not among the class files here; its manuscript branch is the 2019 class's code (the profile's note).
    targetEngine: 'yes',
  }),
);
