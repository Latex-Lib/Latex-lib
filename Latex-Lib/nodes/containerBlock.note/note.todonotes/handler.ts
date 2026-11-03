/**
 * note.todonotes: \todo[options]{text}, a coloured note in the margin. The
 * command's keys (color, backgroundcolor, linecolor, bordercolor, textcolor,
 * size, line, noline, fancyline, inline, shadow), caption (the note's title in
 * the list of todos) and the package options colorinlistoftodos and disable.
 * CTAN: https://ctan.org/pkg/todonotes (sections 1.2 and 1.3)
 */
import { withDefaults } from '../../../schema/params.ts';
import type { Realization } from '../../../schema/realization.ts';
import { param } from '../../protocol.ts';
import { titled, titleOf } from '../node.ts';
import key from './key.ts';

export const realize = (given: { readonly [name: string]: unknown } = {}): Realization => {
  const p = withDefaults(key.params, given as never) as { readonly [name: string]: unknown };
  const pkgOptions = [...(p['colorInList'] === true ? ['colorinlistoftodos'] : []), ...(p['disable'] === true ? ['disable'] : [])];
  const packages = [`\\usepackage${pkgOptions.length === 0 ? '' : `[${pkgOptions.join(',')}]`}{todonotes}`];
  const keys = [
    ...(param(p, 'color') === '' ? [] : [`color=${param(p, 'color')}`]),
    ...(param(p, 'lineColor') === '' ? [] : [`linecolor=${param(p, 'lineColor')}`]),
    ...(param(p, 'borderColor') === '' ? [] : [`bordercolor=${param(p, 'borderColor')}`]),
    ...(param(p, 'textColor') === '' ? [] : [`textcolor=${param(p, 'textColor')}`]),
    ...(param(p, 'size') === '' ? [] : [`size=${param(p, 'size')}`]),
    ...(param(p, 'line', 'line') === 'line' ? [] : [param(p, 'line')]),
    ...(p['inline'] === true ? ['inline'] : []),
    ...(p['shadow'] === true ? ['shadow'] : []),
  ];
  return {
    // A margin note is a \marginpar, which runs the output routine twice without shipping a page: a page of 50 notes and
    // little text stopped at "Output loop---100 consecutive dead cycles", then "Float(s) lost" at \end{document} (run
    // 41584963423: d2f9893f01482515bc703, 63 notes, article.A result 2588eefa38 l.328 after 50 notes; 42 pairs, 496 branches
    // charged "Float(s) lost", 42 the output loop). Raised, never lowered (mdpi.cls sets 10000). The inline and disabled notes
    // place no \marginpar.
    preamble: () => (p['inline'] === true || p['disable'] === true ? { packages } : { packages, declarations: ['\\ifnum\\maxdeadcycles<1000 \\maxdeadcycles=1000 \\fi'] }),
    // caption=: the list of todos gets the title, not the body. Otherwise todonotes writes the body into the .aux for
    // \listoftodos (\protected@write), and a list in it (\item) breaks there: "Paragraph ended before \reserved@a was complete"
    // at the note, then "Missing control sequence inserted" when main.aux is read back (989 of 2,710 branches with a list in the
    // note), or "Incomplete \iffalse" and nothing after the note typeset (article.A 83b6d343795f, l.190).
    emit: (node, content) => `\n\\todo[${[...keys, `caption={${titleOf(node) === '' ? 'Note' : titleOf(node)}}`].join(',')}]{${titled(node, content)}}\n`,
  };
};

export default realize;
