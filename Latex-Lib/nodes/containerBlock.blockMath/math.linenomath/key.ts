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
    gives: { math: true },
    // Typeset on ZeroTeX-NG under article (both presets) and AGU's agujournal2019.cls [draft] (the agu preset): equation, \[ … \],
    // align with row labels and \\[2pt], a nested aligned and cases, each in linenomath*. class.agu's pinned agujournal2025.cls is
    // not among the class files here; its manuscript branch is the 2019 class's code (the profile's note).
    targetEngine: 'yes',
  }),
);
