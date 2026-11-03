import { defineKey } from '../../../schema/key.ts';
import { minimal } from '../../../schema/minimal.ts';
import { PRESETS } from './presets.ts';

export default defineKey(
  minimal({
    id: 'note.todonotes',
    node: 'containerBlock/note',
    description:
      'todonotes: \\todo[keys]{…}, a coloured note in the margin joined to its place by a line; color, linecolor, bordercolor, textcolor, size, line, noline, fancyline, inline, shadow per note; colorinlistoftodos and disable as package options. Uses TikZ. 17 templates.',
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
    gives: { floats: false, boxDepth: 1 },
    // \todo prints through \marginpar unless inline (disabled, it prints nothing), a float: under a box, a footnote or columns it is lost, "Float(s) lost" at
    // \end{document} (5e82acb539, memoir.A run: document d7351df521275b54fafd9, thm.tcolorbox@titled > thm.amsthm@global >
    // note.todonotes@fancy-shadow, the document's only float, l.78). article.A run: 199 of 217 lose their content under a float-less
    // parent (59 of 62 under thm.tcolorbox, 63 of 77 under General's tcolorbox statement), 8 of 153 with none above.
    needsWhen: [{ when: { inline: false, disable: false }, needs: { floats: true } }],
    zerotex: 'untested',
  }),
);
