/**
 * pg.matter (atomicBlock/pageBreak). A book's division command in place of the break: \frontmatter, \mainmatter or \backmatter.
 * No \clearpage goes beside it: each command clears the page itself (book.cls l.284-295; memoir.dtx l.8938-9069; xtufte-book.cls
 * l.40-77).
 * CTAN: https://ctan.org/pkg/latex-base, https://ctan.org/pkg/memoir
 */
import { withDefaults } from '../../../schema/params.ts';
import type { Realization } from '../../../schema/realization.ts';
import { field, param } from '../../protocol.ts';
import key from './key.ts';

/** The division a break's data.matter names (front, main, back, or the command's own name), or nothing. */
const divisionOf = (value: string): string | undefined => {
  const v = value.toLowerCase().replace(/matter$/u, '').replace(/^\\/u, '');
  return v === 'front' || v === 'main' || v === 'back' ? v : undefined;
};

export const realize = (given: { readonly [name: string]: unknown } = {}): Realization => {
  const p = withDefaults(key.params, given as never) as { readonly [name: string]: unknown };
  const matter = param(p, 'matter', 'main');
  return {
    preamble: () => {
      const declarations = [
        ...(p['front'] === true ? ['\\AtBeginDocument{\\frontmatter}'] : []),
        // The breaks counted so far, for `order` (\newcounter is a preamble command).
        ...(matter === 'order' ? ['\\newcounter{LatexLibMatter}'] : []),
      ];
      return declarations.length === 0 ? {} : { declarations };
    },
    emit: (node) => {
      const division = divisionOf(field(node, 'matter')) ?? (matter === 'order' ? undefined : matter);
      if (division !== undefined) return `\n\\${division}matter\n`;
      // In turn: the first break \mainmatter, the second \backmatter, later ones the `after` break. \expandafter runs the
      // command after \fi, outside the conditional, where memoir's \@ifstar reads what follows, not \or.
      return `\n\\stepcounter{LatexLibMatter}\\ifcase\\value{LatexLibMatter}\\or\\expandafter\\mainmatter\\or\\expandafter\\backmatter\\else\\expandafter\\${param(p, 'after', 'clearpage')}\\fi\n`;
    },
  };
};

export default realize;
