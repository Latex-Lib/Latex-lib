/**
 * num.unnumbered: an appendix as an unnumbered chapter (or section) with a contents line added by hand, and no \appendix:
 * \chapter*{附\quad 录} \addcontentsline{toc}{chapter}{附录} (Source/0987-twtstudio-tjuthesislatextemplate/Thesis/appendix/
 * appendix.tex l.2-4, on ctexbook: tjumain.tex l.8). The template writes \texorpdfstring{附\quad 录}{附录} in both and puts the
 * contents line before the heading; here the contents line follows the heading, so it takes the heading's page when
 * \chapter* opens a new one, and the contents line gets the plain word (the `contents` param), so no \texorpdfstring (a
 * hyperref command) is needed. With hyperref, \phantomsection anchors the contents line and a label at the heading, as
 * num.appendix does for its unnumbered appendices; without it the test prints nothing. A \ref to the label prints the last
 * number before it (no counter is stepped: measured, ctexbook printed the previous chapter's); \pageref and \nameref hold.
 * CTAN: https://ctan.org/pkg/latex-base
 */
import { withDefaults } from '../../../schema/params.ts';
import type { Realization } from '../../../schema/realization.ts';
import { escapeText, field, labelLine, param } from '../../protocol.ts';
import key from './key.ts';

export const realize = (given: { readonly [name: string]: unknown } = {}): Realization => {
  const p = withDefaults(key.params, given as never) as { readonly [name: string]: unknown };
  const level = param(p, 'level', 'chapter');
  return {
    preamble: () => ({}),
    emit: (node, content) => {
      // The preset's fixed word is LaTeX; the node's own title is plain text (escaped, as General's is).
      const heading = param(p, 'name') !== '' ? param(p, 'name') : escapeText(field(node, 'title', 'Appendix'));
      const line = param(p, 'contents') !== '' ? param(p, 'contents') : heading;
      const toc = p['toc'] !== false;
      // The anchor for the contents line, or for a label alone: else \label took the previous chapter's (or section's).
      const anchor = toc || field(node, 'label') !== '';
      return (
        [
          `\\${level}*{${heading}}`,
          ...(anchor ? ['\\ifdefined\\phantomsection\\phantomsection\\fi'] : []),
          ...(toc ? [`\\addcontentsline{toc}{${level}}{${line}}`] : []),
        ].join('\n') +
        labelLine(field(node, 'label')) +
        (content.trim() === '' ? '' : `\n${content.trim()}`) +
        '\n\n'
      );
    },
  };
};

export default realize;
