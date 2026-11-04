/**
 * fig.floatrow: a caption beside the image. sidecap's SCfigure (options
 * leftcaption, rightcaption, outercaption, innercaption; the caption's
 * width as a factor of the image's, \sidecaptionvpos), or floatrow's \fcapside under
 * \floatsetup[figure]{capposition=beside, capbesideposition=…}.
 * sidecap's image is at most half the line wide, so the caption beside it
 * keeps the other half less the separation (`besideWidth`). [OV1]
 * floatrow's presets also give two-column pages their own widths back when
 * a page is shipped inside a float (`FLOAT_OUTPUT`, b23).
 * CTAN: https://ctan.org/pkg/sidecap, https://ctan.org/pkg/floatrow
 */
import { withDefaults } from '../../../schema/params.ts';
import type { Realization, Subject } from '../../../schema/realization.ts';
import { field, labelKey, param } from '../../protocol.ts';
import { captionLines, pathOf, placementOf, widthOf } from '../node.ts';
import key from './key.ts';

const VPOS: { readonly [v: string]: string } = { t: 'top', c: 'center', b: 'bottom' };

/**
 * sidecap's image width. SCfigure sets the image in a box first, at the text's \linewidth (the float starts only at
 * \end{SCfigure}), and gives the caption \SC@fraction times the image's width, cut to \columnwidth less the image and
 * \sidecaptionsep (sidecap.sty l.52-64). The `[]` this handler wrote until b22 left \SC@fraction empty, so the caption asked for the
 * image's width (l.217-228; \sidecaptionrelwidth is read only when the optional argument is absent): with the run's samples, 0.8
 * or 1 of the line, the caption got 0.2\linewidth less the separation (59pt in a 345pt column) or less than nothing, every
 * caption word an overfull line and the float taller than the page (GitHub run 41584963423: 1,985 not-denied sidecap branches
 * with a box on \end{SCfigure}, 554 failing on nothing else, e.g. amsart.A ddb728d8787e8b439eccf result 4e13c1628a l.643,
 * `\includegraphics[width=1\linewidth]`, one box per caption word or escape, 16 to 100pt over; 1,201 'Float too large' first
 * failures). So the image is at most half the line wide and the caption gets the other half less the separation (162pt in a
 * 345pt column); a narrower image keeps its width. floatrow's \fcapside keeps the node's width: there \linewidth in the object
 * is already half of what the separation leaves (floatrow.sty l.310-333, l.582-588), and its caption keeps the rest (no
 * word-per-line boxes, 65 'Float too large'). [OV1]
 */
const besideWidth = (node: Subject): string => {
  const asked = widthOf(node, 'linewidth');
  return Number.parseFloat(asked) <= 0.5 ? asked : '0.5\\linewidth';
};

/**
 * floatrow's floats leave the output routine the page's widths (FLOATROW-2, b23). floatrow restyles figure and table when it
 * loads (floatrow.sty l.1459), and its restyled environment sets \textwidth to \columnwidth for the float (l.117; its
 * sidewaysfigure and sidewaystable set \columnwidth to \textheight, l.131-145). LaTeX ends a float with a penalty that runs the
 * output routine while the environment is still open (\end@float; floatrow's [H] float puts its box on the page there too,
 * \float@endH, l.426), so a page that fills there is shipped inside it, and in two columns the kernel's \@outputdblcol builds
 * that page \hb@xt@\textwidth: two columns in one column's width, a column's width over. TeX packs it while \output is active,
 * so the box names no line and fails every branch of the document. GitHub run r2-461ed0e: 84 cells holding floatrow's presets
 * had such a box, `[] []|[] []`, exactly one column wide over (article.B dea0743335b92e81de95e result 3d2692a634, "Overfull
 * \hbox (229.5pt too wide) has occurred while \output is active", right after a table's \end{table}), and no cell without
 * floatrow had one; 1,738 not-denied branches failed on nothing else. Moving the preamble's \floatsetup[figure] into the figure
 * left the box in place (probe b23-1, GitHub run 41775212344: article.B and amsart.B).
 *
 * So each float environment records the widths around it (an environment's begin hook runs inside its group, before the
 * environment's own code: \begin in ltmiscen.dtx), and \@outputdblcol puts them back for the page it builds, inside the output
 * routine's own group. Outside a float nothing is recorded; in one column \textwidth is \columnwidth already; a first column is
 * only saved. So only a page that was shipped one column too narrow changes. Guarded, so a second floatrow preset in the
 * document does not wrap \@outputdblcol twice.
 */
const FLOAT_OUTPUT = String.raw`\makeatletter\ifdefined\LatexLibFloatOuter\else\def\LatexLibFloatOuter{\edef\LatexLibFloatWidths{\textwidth\the\textwidth\relax\columnwidth\the\columnwidth\relax}}\AddToHook{env/figure/begin}{\LatexLibFloatOuter}\AddToHook{env/table/begin}{\LatexLibFloatOuter}\AddToHook{env/sidewaysfigure/begin}{\LatexLibFloatOuter}\AddToHook{env/sidewaystable/begin}{\LatexLibFloatOuter}\let\LatexLibOutputdblcol\@outputdblcol\def\@outputdblcol{\ifdefined\LatexLibFloatWidths\LatexLibFloatWidths\fi\LatexLibOutputdblcol}\fi\makeatother`;

/** sidecap's caption factor: the param as a plain number (1 when it is not one), as SCfigure's first optional argument takes it. */
const relWidthOf = (p: { readonly [name: string]: unknown }): string => {
  const factor = p['relWidth'];
  return typeof factor === 'number' && Number.isFinite(factor) && factor > 0 ? String(factor) : '1';
};

export const realize = (given: { readonly [name: string]: unknown } = {}): Realization => {
  const p = withDefaults(key.params, given as never) as { readonly [name: string]: unknown };
  const sidecap = param(p, 'engine', 'sidecap') === 'sidecap';
  const position = param(p, 'position', 'outer');
  const vpos = param(p, 'vpos', 'b');
  return {
    preamble: () => {
      if (sidecap) {
        const declarations = [...(vpos === 'b' ? [] : [`\\sidecaptionvpos{figure}{${vpos}}`])];
        return { packages: ['\\usepackage{graphicx}', position === 'outer' ? '\\usepackage{sidecap}' : `\\usepackage[${position}caption]{sidecap}`], ...(declarations.length === 0 ? {} : { declarations }) };
      }
      const side = position === 'outer' || position === 'inner' ? position : position === 'left' ? 'left' : 'right';
      return { packages: ['\\usepackage{graphicx}', '\\usepackage{floatrow}'], declarations: [`\\floatsetup[figure]{capposition=beside,capbesideposition={${VPOS[vpos] ?? 'bottom'},${side}},capbesidesep=quad}`, FLOAT_OUTPUT] };
    },
    emit: (node, content, context) => {
      if (pathOf(node) === '') return '';
      const image = `\\includegraphics[width=${sidecap ? besideWidth(node) : widthOf(node, 'linewidth')}]{${pathOf(node)}}`;
      // The caption's factor goes in SCfigure's first optional argument, the only place sidecap reads it once a placement is
      // given: `[]` left \SC@fraction empty, so the caption asked for the image's width and \sidecaptionrelwidth, which this
      // handler used to set, was never read (sidecap.sty l.217-228, l.55). sidecap cuts the caption to what the line leaves
      // (l.59-62), so a factor of 50 (sidecap-outer's template) gives it the rest. [b22]
      if (sidecap) return `\\begin{SCfigure}[${relWidthOf(p)}][${placementOf(node, 'h')}]\n\\centering\n${image}${captionLines(node, context)}\n\\end{SCfigure}\n\n`;
      const label = labelKey(field(node, 'label'));
      return `\\begin{figure}[${placementOf(node, 'h')}]\n\\fcapside[\\FBwidth]{\\caption{${(context ?? '').trim()}}${label === '' ? '' : `\\label{${label}}`}}{${image}}\n\\end{figure}\n\n`;
    },
  };
};

export default realize;
