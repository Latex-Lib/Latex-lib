/**
 * ack.block (containerBlock/acknowledgement): the acknowledgements as a block where a sectioning heading does not show.
 * beamer's \section prints nothing on a slide (Template/template-requirement/Beamer.md l.54) and tikzposter lays out only its
 * blocks, so ack.kernel's \section*{Acknowledgements} vanishes there; the minimal class has no \section at all.
 * - block: \begin{block}{Acknowledgements} … \end{block} (Source/0417-gemini-poster-theme/main.tex l.96-99);
 * - frame: \begin{frame} \frametitle{Acknowledgements} … \end{frame}, a slide of its own (Source/0664-ticket/doc/manual.tex
 *   l.474-475): General's node set has nothing that makes frames (Beamer.md l.136), so the frame is the way's own;
 * - poster-block: tikzposter's \block[options]{Acknowledgements}{…} (Source/0707-tu-delft-poster/main.tex l.143-145);
 * - handset: \bigskip \noindent{\large\bfseries Acknowledgements}\par \medskip (Latex-Template-Examples/class.minimal/main.tex
 *   l.246-250), with \large provided as the template provides it (l.48): the minimal class defines no size command but \normalsize.
 * tikzposter's other form, a run-in \textbf{Acknowledgments:} inside another block (Source/0429-ndpvt-web-latex-document-skill/
 * assets/templates/poster.tex l.359), is left out: the acknowledgement is a node of its own, and outside a block it is not laid out.
 * CTAN: https://ctan.org/pkg/beamer, https://ctan.org/pkg/tikzposter, https://ctan.org/pkg/latex-base
 */
import { withDefaults } from '../../../schema/params.ts';
import type { Realization } from '../../../schema/realization.ts';
import { escapeText, field, labelLine, param } from '../../protocol.ts';
import key from './key.ts';

export const realize = (given: { readonly [name: string]: unknown } = {}): Realization => {
  const p = withDefaults(key.params, given as never) as { readonly [name: string]: unknown };
  const form = param(p, 'form', 'block');
  const options = param(p, 'posterOptions', '').trim();
  return {
    preamble: () => (form === 'handset' ? { declarations: ['\\providecommand{\\large}{\\fontsize{12}{14}\\selectfont}'] } : {}),
    emit: (node, content) => {
      // The node's own title is plain text (escaped, as General's is); the preset's is LaTeX.
      const title = field(node, 'title') === '' ? param(p, 'title', 'Acknowledgements') : escapeText(field(node, 'title'));
      const label = labelLine(field(node, 'label'));
      const body = content.trim();
      switch (form) {
        case 'frame':
          return `\\begin{frame}\n\\frametitle{${title}}${label}\n${body}\n\\end{frame}\n\n`;
        case 'poster-block':
          return `\\block${options === '' ? '' : `[${options}]`}{${title}}{${label}\n${body}\n}\n\n`;
        case 'handset':
          return `\\bigskip\n\\noindent{\\large\\bfseries ${title}}\\par${label}\n\\medskip\n\n${body}\n\n`;
        default:
          return `\\begin{block}{${title}}${label}\n${body}\n\\end{block}\n\n`;
      }
    },
  };
};

export default realize;
