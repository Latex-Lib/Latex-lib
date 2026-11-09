/**
 * fig.class-float: the image in a float form the class itself gives, one form per preset:
 * - kind: the class's own float kind, \begin{scheme|chart|graph} … \end{…}, so the caption reads "Scheme 1" (achemso's
 *   \newfloat, achemso.dtx l.1833-1838; mdpi's \DeclareFloatingEnvironment, mdpi.cls l.1665-1667);
 * - sidecaption: aa's \sidecaption before the graphic, the caption set beside it when 5cm are left, else below (aa.cls
 *   l.392-395, 1656-1705), in figure* across both columns by default;
 * - floatconts: jmlr's \floatconts{label}{\caption{…}}{contents} (jmlr.dtx l.2022-2035; pmlr-sample.tex l.243-250);
 * - fitfigure: apa7's caption above, then \fitfigure{file}, the image at the line's width unless it is taller than the
 *   text block (apa7.cls v2.16: \fitfigure[0.5]{#2}, measured by \meaning in ZeroTeX-NG; the node's width is not used);
 * - access-figure: ieeeaccess's \Figure[t!](skips)[width=…]{file}{caption}, figure or figure* by the image's width
 *   (ieeeaccess.cls l.416-458);
 * - turnpage: revtex4-2's (and aastex701's) turnpage around a figure, set at \textheight and turned to landscape
 *   (revtex4-2.cls l.4210-4216; aastex701.cls l.3876);
 * - adjustwidth: mdpi's wide figure, the graphic in \begin{adjustwidth}{-\extralength}{0cm} so it reaches into the left
 *   column, the caption below (template.tex l.242-257; mdpi.cls l.64, 1579-1580).
 * The caption comes as `context`; with none, a form that needs one (\sidecaption scans to \caption) prints the plain float.
 */
import { withDefaults } from '../../../schema/params.ts';
import type { Realization, Subject } from '../../../schema/realization.ts';
import { labelKey, field, param } from '../../protocol.ts';
import { captionLines, inFloat, pathOf, placementOf, widthOf } from '../node.ts';
import key from './key.ts';

/** Each form's placement when the parameter leaves it to the form: the class's own, or what its template writes. */
const PLACEMENT: { readonly [form: string]: string } = { kind: '', sidecaption: '', floatconts: 'htbp', fitfigure: '', 'access-figure': 't!', turnpage: '', adjustwidth: 'H' };

export const realize = (given: { readonly [name: string]: unknown } = {}): Realization => {
  const p = withDefaults(key.params, given as never) as { readonly [name: string]: unknown };
  const form = param(p, 'form', 'kind');
  const center = p['center'] !== false;
  const figure = p['span'] === true ? 'figure*' : 'figure';
  const placement = (node: Subject): string => {
    const asked = param(p, 'placement');
    const floating = asked === '' ? (PLACEMENT[form] ?? '') : asked;
    // A turned float goes on a page of its own: h! left it stuck (aastex701: "A float is stuck"; revtex4-2 with figure*:
    // "Float cannot be placed"), so a node marked fixed keeps the class's placement there.
    if (form === 'turnpage') return floating;
    return form === 'adjustwidth' ? placementOf(node, 'H', floating) : placementOf(node, 'h!', floating);
  };
  const opt = (node: Subject): string => (placement(node) === '' ? '' : `[${placement(node)}]`);
  return {
    preamble: () => ({ packages: ['\\usepackage{graphicx}'] }),
    emit: (node, content, context) => {
      if (pathOf(node) === '') return '';
      const image = `\\includegraphics[width=${widthOf(node, param(p, 'unit', 'linewidth'))}]{${pathOf(node)}}`;
      const caption = (context ?? '').trim();
      const label = labelKey(field(node, 'label'));
      switch (form) {
        case 'sidecaption':
          if (caption === '') return inFloat(figure, placement(node), center, image, node, context);
          return `\\begin{${figure}}${opt(node)}\n\\sidecaption\n${image}${captionLines(node, caption)}\n\\end{${figure}}\n\n`;
        case 'floatconts':
          return `\\begin{${figure}}${opt(node)}\n\\floatconts\n  {${label}}\n  {${caption === '' ? '' : `\\caption{${caption}}`}}\n  {${image}}\n\\end{${figure}}\n\n`;
        case 'fitfigure':
          return `\\begin{${figure}}${opt(node)}${captionLines(node, caption)}\n\\fitfigure{${pathOf(node)}}\n\\end{${figure}}\n\n`;
        case 'access-figure':
          return `\\Figure${opt(node)}(topskip=0pt, botskip=0pt, midskip=0pt)[width=${widthOf(node, param(p, 'unit', 'linewidth'))}]{${pathOf(node)}}{${caption}${label === '' ? '' : `\\label{${label}}`}}\n\n`;
        case 'turnpage':
          return `\\begin{turnpage}\n${inFloat(figure, placement(node), center, image, node, context).trimEnd()}\n\\end{turnpage}\n\n`;
        case 'adjustwidth':
          return `\\begin{figure}${opt(node)}\n\\begin{adjustwidth}{-\\extralength}{0cm}${center ? '\n\\centering' : ''}\n${image}\n\\end{adjustwidth}${captionLines(node, caption)}\n\\end{figure}\n\n`;
        default:
          return inFloat(param(p, 'floatKind', 'scheme'), placement(node), center, image, node, context);
      }
    },
  };
};

export default realize;
