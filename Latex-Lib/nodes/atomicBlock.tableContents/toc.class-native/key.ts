import { defineKey } from '../../../schema/key.ts';
import { minimal } from '../../../schema/minimal.ts';
import { CONTENTS } from '../node.ts';
import { PRESETS } from './presets.ts';

const SOURCE = 'Latex Related Research/Latex-lib-main/Source';

export default defineKey(
  minimal({
    id: 'toc.class-native',
    node: 'atomicBlock/tableContents',
    description:
      "The contents through the class's own commands. Under memoir: memoir's starred \\tableofcontents* (which does not list itself) and its own tocloft-style hooks, \\cftchapterdotsep and \\cft<level>dotsep for dot leaders, \\cftchapterfont, \\cftsectionfont, \\printtoctitle, \\cftsetindents{<level>}{<indent>}{<numwidth>} per level, \\bibintoc or \\nobibintoc, \\settocdepth{<level>}, with \\listoffigures* and \\listoftables*. Under beamer and ctexbeamer: \\tableofcontents[<options>] with beamer's keys (hideallsubsections, pausesections, sectionstyle=…, currentsection), no heading, optionally on a frame of its own.",
    // The default (memoir) form; each preset whose skeleton differs gives its own.
    writes: '\\tableofcontents*',
    ctan: ['memoir', 'beamer'],
    features: ['class-styled', 'dot-leaders', 'flat-contents', 'in-contents', 'lists-of-floats'],
    params: {
      form: { type: 'enum', values: ['memoir', 'beamer'], default: 'memoir', description: "memoir's starred contents and hooks, or beamer's \\tableofcontents[options]" },
      starred: { type: 'boolean', default: true, description: "memoir: \\tableofcontents* (and the lists starred), which add no line of their own to the contents" },
      leaders: { type: 'enum', values: ['class', 'all', 'none'], default: 'class', description: "memoir: its own dot leaders (none for chapters, dotted below), dotted for chapters too (\\cftchapterdotsep), or none at all (\\cft<level>dotsep as \\cftnodots)" },
      chapterFont: { type: 'tex', default: '', description: "memoir: chapter entries' font (\\cftchapterfont, \\bfseries by default); ''" },
      sectionFont: { type: 'tex', default: '', description: "memoir: section entries' font (\\cftsectionfont); ''" },
      titleFont: { type: 'tex', default: '', description: "memoir: put before the contents' heading in place of the chapter title's look (\\renewcommand{\\printtoctitle}[1]{…#1}, \\centering to centre); ''" },
      indents: { type: 'string', default: '', description: "memoir: each level's indent and number width, comma-separated level:indent:numwidth (\\cftsetindents), e.g. 'section:1.5em:2.3em, subsection:3.8em:3.2em'; ''" },
      bibInToc: { type: 'enum', values: ['class', 'yes', 'no'], default: 'class', description: "memoir: the bibliography's line in the contents (\\bibintoc, \\nobibintoc); 'class' leaves memoir's (listed)" },
      options: { type: 'string', default: '', description: "beamer: \\tableofcontents's keys, e.g. 'hideallsubsections' or 'sectionstyle=show,subsectionstyle=show/shaded/hide'; ''" },
      frame: { type: 'boolean', default: false, description: 'beamer: the contents on a frame of their own (\\begin{frame}{…} … \\end{frame}); false writes the command where the node stands' },
      frameTitle: { type: 'tex', default: '', description: "beamer: that frame's title; '' for none" },
      // depth: memoir writes \settocdepth{<level>} in the body, beamer \setcounter{tocdepth} in the preamble. title, lists and
      // after hold under memoir only: beamer prints no heading, defines no lists of floats and breaks no pages inside a frame.
      ...CONTENTS,
    },
    presets: PRESETS,
    requires: [
      'cmd:\\tableofcontents',
    ],
    // memoir's hooks are named only by memoir (memoir.dtx), every one of them, so onlyWhen pins that form to memoir and needs
    // no per-hook requirement. beamer's frame is required only when the way makes one.
    requiresWhen: [{ when: { form: 'beamer', frame: true }, requires: ['env:frame'] }],
    only: ['class.memoir', 'class.beamer', 'class.ctexbeamer'],
    onlyWhen: [
      {
        when: { form: 'memoir' },
        classes: ['class.memoir'],
        reason:
          "\\tableofcontents* and the hooks \\cftchapterdotsep, \\cftchapterfont, \\cftsectionfont, \\printtoctitle, \\cftsetindents, \\bibintoc and \\settocdepth are memoir's own (it emulates tocloft under these names); under beamer the star is read as text and the hooks are undefined",
        evidence: [
          { kind: 'source', file: `${SOURCE}/0185-memhfixc/memoir.dtx`, line: '19818 (\\print<ext>title), 19895 (\\newlistof{tableofcontents}), 20344 (\\cftsetindents), 20814 (\\cftchapterdotsep), 21338-21350 (\\settocdepth), 21652-21653 (\\bibintoc, \\nobibintoc), 33820 (\\EmulatedPackage{tocloft})' },
        ],
      },
      {
        when: { form: 'beamer' },
        classes: ['class.beamer', 'class.ctexbeamer'],
        reason: "\\tableofcontents[<options>] is beamer's (beamerbasetoc.sty l.72-93); the kernel's and memoir's \\tableofcontents take no optional argument, so the keys would print as text",
        evidence: [{ kind: 'requirement', file: 'Template/template-requirement/Beamer.md', line: '61' }],
      },
    ],
    // Typeset ok on ZeroTeX-NG through class-examples/typeset-dir.ts (2026-11-07), the .toc read back on the second pass:
    // memoir (no options) with memoir-starred, memoir-thesis, memoir-indents, and unstarred with leaders none, a \printtoctitle
    // font, \nobibintoc, a title and \settocdepth{section}, over chapters, sections, a figure, a table and a bibliography;
    // beamer with beamer-hide-subsections inside a frame and outside any frame (beamer still sets it on a page) and
    // beamer-outline-frame with \setcounter{tocdepth}{2}; ctexbeamer [fontset=fandol] with both beamer presets in a frame.
    targetEngine: 'yes',
  }),
);
