/**
 * ack.block's presets: the acknowledgements where a heading does not show, as a slide's or a poster's block (beamer, ctexbeamer,
 * tikzposter), or where the class has no heading at all, as a hand-set bold line (minimal).
 */
import type { Preset } from '../../../schema/params.ts';
import { solution } from '../../evidence.ts';

const SOURCE = 'Latex Related Research/Latex-lib-main/Source';

export const PRESETS = {
  block: {
    description:
      "beamer's titled block, \\begin{block}{Acknowledgements} … \\end{block}, as a poster column or a slide holds it; the theme draws its title bar.",
    features: ['class-styled', 'title-bar'],
    params: {},
    evidence: [{ kind: 'source', file: `${SOURCE}/0417-gemini-poster-theme/main.tex`, line: '96-99' }, solution('0417-gemini-poster-theme', '47')],
  },
  frame: {
    description:
      "A beamer frame of its own whose title is the heading, \\begin{frame} \\frametitle{Acknowledgements} … \\end{frame}, as decks end on a thank-you slide.",
    writes: '\\begin{frame} \\frametitle{Acknowledgements} … \\end{frame}',
    features: ['class-styled', 'page-break-before'],
    params: { form: 'frame' },
    evidence: [
      { kind: 'source', file: `${SOURCE}/0664-ticket/doc/manual.tex`, line: '474-480' },
      { kind: 'source', file: `${SOURCE}/0144-geode/main.tex`, line: '89-93' },
    ],
  },
  'poster-block': {
    description: "tikzposter's block, \\block{Acknowledgements}{…}, its title and body drawn by the poster's block style.",
    writes: '\\block{Acknowledgements}{…}',
    features: ['class-styled', 'title-bar'],
    params: { form: 'poster-block' },
    evidence: [{ kind: 'source', file: `${SOURCE}/0707-tu-delft-poster/main.tex`, line: '143-145' }, solution('0707-tu-delft-poster', '23')],
  },
  handset: {
    description:
      'A hand-set unnumbered bold heading for a class with no sectioning (minimal): \\bigskip \\noindent{\\large\\bfseries Acknowledgements}\\par \\medskip, then the text.',
    writes: '\\bigskip \\noindent{\\large\\bfseries Acknowledgements}\\par \\medskip …',
    features: ['bold-head', 'unnumbered'],
    params: { form: 'handset' },
    evidence: [
      { kind: 'source', file: 'Latex Related Research/Latex-Template-Examples/class.minimal/main.tex', line: '246-250 (the heading); 48 (\\providecommand{\\large}{\\fontsize{12}{14}\\selectfont})' },
    ],
  },
} as const satisfies { readonly [name: string]: Preset };
