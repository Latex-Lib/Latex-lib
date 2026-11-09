import { defineKey } from '../../../schema/key.ts';
import { minimal } from '../../../schema/minimal.ts';
import { PRESETS } from './presets.ts';

const SOURCE = 'Latex Related Research/Latex-lib-main/Source';

export default defineKey(
  minimal({
    id: 'ack.block',
    node: 'containerBlock/acknowledgement',
    description:
      "Acknowledgements where a sectioning heading does not show: as beamer's (and ctexbeamer's) titled block, \\begin{block}{Acknowledgements} … \\end{block}, or a frame of its own titled by \\frametitle; as tikzposter's \\block{Acknowledgements}{…}; or, under the minimal class, which has no sectioning, as a hand-set bold heading, \\bigskip \\noindent{\\large\\bfseries Acknowledgements}\\par \\medskip, then the text.",
    writes: '\\begin{block}{Acknowledgements} … \\end{block}',
    ctan: ['beamer', 'tikzposter', 'latex-base'],
    features: ['class-styled', 'title-bar', 'page-break-before', 'bold-head', 'unnumbered'],
    params: {
      // Which construct; each is one class's (onlyWhen), so it can change whether the way works.
      form: {
        type: 'enum',
        values: ['block', 'frame', 'poster-block', 'handset'],
        default: 'block',
        compat: true,
        description:
          "beamer's block environment, a beamer frame titled by \\frametitle, tikzposter's \\block command, or a hand-set bold heading (minimal)",
      },
      title: { type: 'string', default: 'Acknowledgements', description: 'the heading when the node has no title (LaTeX)' },
      posterOptions: {
        type: 'tex',
        default: '',
        description: "tikzposter's block options, \\block[…]{…}{…} (titleoffsety=…, bodyverticalshift=…, roundedcorners=…); empty writes none",
      },
    },
    presets: PRESETS,
    // beamer's block and frame environments (beamerbaselocalstructure.sty, beamerbaseframe.sty), tikzposter's \block command
    // (tikzposter.cls); the minimal class defines no \large, so the hand-set form provides it as the template does (main.tex l.48).
    requiresWhen: [
      { when: { form: 'block' }, requires: ['env:block'] },
      { when: { form: 'frame' }, requires: ['env:frame', 'cmd:\\frametitle'] },
      { when: { form: 'poster-block' }, requires: ['cmd:\\block'] },
    ],
    defines: [{ name: 'cmd:\\large', when: { form: 'handset' } }],
    only: ['class.beamer', 'class.ctexbeamer', 'class.tikzposter', 'class.minimal'],
    onlyWhen: [
      {
        when: { form: ['block', 'frame'] },
        classes: ['class.beamer', 'class.ctexbeamer'],
        reason: 'block and frame are beamer environments, and \\frametitle a beamer command; no other listed class defines them',
        evidence: [{ kind: 'source', file: `${SOURCE}/0417-gemini-poster-theme/main.tex`, line: '2, 96' }, { kind: 'requirement', file: 'Template/template-requirement/Beamer.md', line: '38' }],
      },
      {
        when: { form: 'poster-block' },
        classes: ['class.tikzposter'],
        reason: "\\block{title}{body} is tikzposter's own command (its profile's vocabulary); elsewhere it is undefined",
        evidence: [{ kind: 'source', file: `${SOURCE}/0707-tu-delft-poster/main.tex`, line: '4, 143-145' }],
      },
      {
        when: { form: 'handset' },
        classes: ['class.minimal'],
        reason: 'the hand-set heading is for the minimal class, which has no \\section; every other listed class prints its acknowledgements in a block',
        evidence: [{ kind: 'source', file: 'Latex Related Research/Latex-Template-Examples/class.minimal/main.tex', line: '34, 246-250' }],
      },
    ],
    // A beamer frame is one slide: it never breaks, and a verbatim child needs [fragile], which this frame does not take.
    // tikzposter's \block reads its body as an argument and draws it as a TikZ node: no verbatim, no float, no footnote.
    givesWhen: [
      { when: { form: 'frame' }, gives: { breakable: false, verbatim: false } },
      { when: { form: 'poster-block' }, gives: { argument: true, verbatim: false, floats: false, footnotes: false, breakable: false } },
    ],
    // Typeset ok on ZeroTeX-NG (2026-11-07): block (in a frame, and outside any frame, where beamer still sets it on a page) and
    // frame under beamer and ctexbeamer; poster-block under tikzposter, in a column with options and at the top level; handset
    // under minimal, with the \large it provides.
    targetEngine: 'yes',
  }),
);
