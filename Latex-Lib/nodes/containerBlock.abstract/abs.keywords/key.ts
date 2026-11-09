import { defineKey } from '../../../schema/key.ts';
import { minimal } from '../../../schema/minimal.ts';
import { PRESETS } from './presets.ts';

export default defineKey(
  minimal({
    id: 'abs.keywords',
    node: 'containerBlock/abstract',
    description:
      "The class's abstract environment ending with a keywords line: elegantpaper's own \\keywords{…} command as the abstract's last line, or a line of its own with a bold run-in label, \\par\\noindent\\textbf{Keywords:} … (report, ctexrep; 关键词： in Chinese), or the whole line in italics, \\emph{Keywords: …}. The keywords are the title's templateSpecific.keywords, which the title way hands over in \\LatexLibKeywords (items separated by \\LatexLibKeywordSep, set by this way); the line prints only when there are keywords.",
    writes: '\\begin{abstract} … \\par \\keywords{…} \\end{abstract} | \\begin{abstract} … \\par\\noindent\\textbf{Keywords:} … \\end{abstract}',
    ctan: ['latex-base', 'elegantpaper'],
    features: ['small-type', 'centered', 'bold-head', 'italic-head', 'run-in-head', 'class-styled'],
    params: {
      form: {
        type: 'enum',
        values: ['command', 'line', 'italic'],
        default: 'line',
        compat: true,
        description: "the class's \\keywords{…} command, a line with a bold label (\\noindent\\textbf{label} …), or the label and list in one \\emph",
      },
      label: { type: 'string', default: 'Keywords:', description: "the label before the keywords (line and italic forms; the class's \\keywords prints its own)" },
      separator: { type: 'tex', default: ', ', description: 'what stands between two keywords (\\LatexLibKeywordSep, which the title way puts between them)' },
    },
    presets: PRESETS,
    // The keywords print inside the class's abstract environment; the command form calls the class's \keywords (elegantpaper.cls
    // l.228, l.254), which no other listed class defines.
    requires: ['env:abstract'],
    requiresWhen: [{ when: { form: 'command' }, requires: ['cmd:\\keywords'] }],
    only: ['class.elegantpaper', 'class.report', 'class.ctexrep'],
    onlyWhen: [
      {
        when: { form: 'command' },
        classes: ['class.elegantpaper'],
        reason: "\\keywords{…} as the abstract's last line is elegantpaper's own command (\\vskip 2ex\\par\\noindent\\normalfont{\\bfseries Keywords: } #1); report and ctexrep define no \\keywords",
        evidence: [{ kind: 'source', file: 'Latex Related Research/Latex-lib-main/Source/0188-elegantpaper/elegantpaper.cls', line: '228, 254' }],
      },
    ],
    // Typeset ok on ZeroTeX-NG (2026-11-07): elegantpaper (lang=en) with the class's \keywords, report with the bold and the italic
    // line (the second abstract opening with a list), ctexrep (fontset=fandol) with 关键词：; with \LatexLibKeywords empty no line
    // prints, set by \gdef before or after this way's \providecommand* it prints with this way's separator (checked by \typeout).
    targetEngine: 'yes',
  }),
);
