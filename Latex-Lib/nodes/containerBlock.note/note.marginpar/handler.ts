/**
 * note.marginpar: the kernel's \marginpar{…}, a float in the margin;
 * \reversemarginpar for the other side, \marginparwidth and \marginparsep
 * for the column.
 * CTAN: https://ctan.org/pkg/latex-base (usrguide, \marginpar)
 */
import { withDefaults } from '../../../schema/params.ts';
import type { Realization } from '../../../schema/realization.ts';
import { param } from '../../protocol.ts';
import { titled } from '../node.ts';
import key from './key.ts';

export const ALIGN: { readonly [align: string]: string } = { ragged: '\\raggedright', justified: '', center: '\\centering' };

export const realize = (given: { readonly [name: string]: unknown } = {}): Realization => {
  const p = withDefaults(key.params, given as never) as { readonly [name: string]: unknown };
  const declarations = [
    // Each \marginpar runs the output routine twice without shipping a page (\@specialoutput resets \deadcycles only for
    // \clearpage's penalties, latex.ltx l.20831), so a page of many notes and little text stopped at "Output loop---100
    // consecutive dead cycles" at its 51st note, TeX shipped \box255 itself and the notes left were "Float(s) lost" at
    // \end{document} (run 41584963423: d08f06e41bd6b4c059d1f, 63 notes, article.A result 7416a2b593 l.395, 51 notes before
    // it; 41 pairs; 0 of the documents of 35 to 38 notes failed). TeX's own advice: raise \maxdeadcycles. Only raised, never
    // lowered: mdpi.cls sets 10000 (l.590), lineno adds 100 (lineno.sty l.3283).
    '\\ifnum\\maxdeadcycles<1000 \\maxdeadcycles=1000 \\fi',
    ...(param(p, 'side', 'outer') === 'reverse' ? ['\\reversemarginpar'] : []),
    ...(param(p, 'width') === '' ? [] : [`\\setlength{\\marginparwidth}{${param(p, 'width')}}`]),
    ...(param(p, 'sep') === '' ? [] : [`\\setlength{\\marginparsep}{${param(p, 'sep')}}`]),
  ];
  // A reversed note sits left of the text, so ragged means flush against it.
  const align = param(p, 'side', 'outer') === 'reverse' && param(p, 'align', 'ragged') === 'ragged' ? '\\raggedleft' : ALIGN[param(p, 'align', 'ragged')] ?? '';
  return {
    preamble: () => ({ declarations }),
    emit: (node, content) => `\n\\marginpar{${param(p, 'font')}${align}\n${p['title'] === false ? content.trim() || '\\mbox{}' : titled(node, content)}}\n`,
  };
};

export default realize;
