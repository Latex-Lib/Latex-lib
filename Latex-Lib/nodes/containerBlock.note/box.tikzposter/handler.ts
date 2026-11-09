/**
 * box.tikzposter: the note as one of tikzposter's own boxes, drawn by the poster's theme:
 * - block (the default): \block[options]{title}{content}, a poster block, at the top level or in a column (cols.tikzposter);
 * - innerblock: \innerblock[options]{title}{content}, a titled box inside a block;
 * - coloredbox: \coloredbox[bgcolor=…, fgcolor=…, roundedcorners=…]{content}, an untitled coloured box inside a block, the
 *   note's title in bold on its first line ('tone' in a colour stands for the note's tone colour);
 * - callout: \note[width=…, targetoffsetx=…, targetoffsety=…, rotate=…]{content}, tikzposter's note pinned to the block
 *   before it, the title in bold on its first line.
 * The content is a macro argument, set in a TikZ node: no verbatim, no float, no footnote.
 * CTAN: https://ctan.org/pkg/tikzposter (tikzposter.pdf, "Blocks", "Inner blocks", "Colored boxes", "Notes")
 */
import { withDefaults } from '../../../schema/params.ts';
import type { Realization } from '../../../schema/realization.ts';
import { param } from '../../protocol.ts';
import { colorFor, titled, titleOf, toneDefinition } from '../node.ts';
import key from './key.ts';

const ALIGN: { readonly [align: string]: string } = { left: 'titleleft', center: 'titlecenter', right: 'titleright' };

export const realize = (given: { readonly [name: string]: unknown } = {}): Realization => {
  const p = withDefaults(key.params, given as never) as { readonly [name: string]: unknown };
  const form = param(p, 'form', 'block');
  const withTitle = p['title'] !== false;
  const colors = form === 'coloredbox' ? [param(p, 'bgColor'), param(p, 'fgColor')] : [];
  /** `name=value` for each option given. */
  const opt = (name: string, keyName: string): string[] => (param(p, name) === '' ? [] : [`${keyName}=${param(p, name)}`]);
  const options = (list: readonly string[]): string => (list.length === 0 ? '' : `[${list.join(', ')}]`);
  return {
    // The tone's colour, defined with xcolor's \definecolor; tikzposter loads xcolor itself (its profile's preloads).
    preamble: (_params, _parentType, node) => {
      const tone = toneDefinition(colors, node);
      return tone.length === 0 ? {} : { declarations: tone };
    },
    emit: (node, content, _context, parentType) => {
      const body = content.trim() || '\\mbox{}';
      // An inner block or a coloured box at the top level of the poster, where tikzposter has no block to draw it in, stops at
      // "TeX capacity exceeded, sorry [input stack size=10000]" (probe, ZeroTeX-NG, 2026-11-07): there it goes in an untitled
      // \block{}{…}, as cols.tikzposter wraps a column's loose pieces. Below a node (a column, a list) it is printed as it is.
      // Inside the block each is drawn \linewidth wide plus its own frame, 4.4pt (inner block) or 3.9pt (coloured box) over
      // ("Overfull \hbox … in paragraph", tikzposter's own \block{…}{\innerblock{…}{…}} included, probe 2026-11-07), so it is set
      // in a \makebox as wide as the line, which centres it: the frame stands out 2.2pt (1.95pt) on either side, unwarned.
      const inBlock = (latex: string): string => {
        const centred = `\\noindent\\makebox[\\linewidth]{${latex.trimEnd()}}\n\n`;
        return parentType === undefined || parentType === '' || parentType === 'doc' ? `\\block{}{\n${centred.trimEnd()}\n}\n\n` : centred;
      };
      const title = withTitle ? titleOf(node) : '';
      if (form === 'block' || form === 'innerblock') {
        const list = [
          ...(ALIGN[param(p, 'titleAlign', 'theme')] === undefined ? [] : [ALIGN[param(p, 'titleAlign', 'theme')] ?? '']),
          ...opt('roundedCorners', 'roundedcorners'),
          ...opt('lineWidth', 'linewidth'),
          ...opt('bodyWidthScale', 'bodywidthscale'),
        ];
        const latex = `\\${form}${options(list)}{${title}}{\n${body}\n}\n\n`;
        return form === 'innerblock' ? inBlock(latex) : latex;
      }
      const text = withTitle ? titled(node, content) : body;
      if (form === 'coloredbox') {
        const list = [...(param(p, 'bgColor') === '' ? [] : ['bgcolor=LatexLibNoteBg']), ...(param(p, 'fgColor') === '' ? [] : ['fgcolor=LatexLibNoteFg']), ...opt('roundedCorners', 'roundedcorners'), ...opt('lineWidth', 'linewidth')];
        // tikzposter's \coloredbox takes a colour's name, not an expression ("Undefined color `red!15'", probe 2026-11-07), so
        // each colour given is named first with \colorlet, inside the block's argument.
        const names = [
          ...(param(p, 'bgColor') === '' ? [] : [`\\colorlet{LatexLibNoteBg}{${colorFor(param(p, 'bgColor'), node)}}`]),
          ...(param(p, 'fgColor') === '' ? [] : [`\\colorlet{LatexLibNoteFg}{${colorFor(param(p, 'fgColor'), node)}}`]),
        ];
        return inBlock(`${names.join('')}\\coloredbox${options(list)}{\n${text}\n}\n\n`);
      }
      const list = [...opt('width', 'width'), ...opt('targetOffsetX', 'targetoffsetx'), ...opt('targetOffsetY', 'targetoffsety'), ...opt('rotate', 'rotate'), ...opt('roundedCorners', 'roundedcorners')];
      return `\\note${options(list)}{\n${text}\n}\n\n`;
    },
  };
};

export default realize;
