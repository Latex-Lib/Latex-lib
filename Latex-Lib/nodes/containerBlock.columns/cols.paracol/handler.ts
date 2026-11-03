/**
 * cols.paracol: \begin{paracol}{n} … \switchcolumn … \end{paracol},
 * parallel columns, the blocks (split at top-level blank lines only,
 * `blocksOf`) shared out across them in order;
 * \columnratio{r} for unequal widths, \columnsep for the gap, \columnseprule
 * and \colseprulecolor for a rule.
 * CTAN: https://ctan.org/pkg/paracol (paracol, \switchcolumn, \columnratio, \colseprulecolor)
 */
import { withDefaults } from '../../../schema/params.ts';
import type { Realization } from '../../../schema/realization.ts';
import { param } from '../../protocol.ts';
import { afterOptional, countOf, gapOf } from '../node.ts';
import key from './key.ts';

/**
 * `content`'s blocks for the columns: split at blank lines that stand outside every environment, brace group and verbatim
 * environment, so a child's own blank line (an empty statement's body, a list's paragraph break) never takes \switchcolumn
 * inside it ("Something's wrong--perhaps a missing \item" at the child's \end: copy batch-3b article.A, 69 branches, 125 of 822
 * paracol blocks in 20 documents, e.g. d54f9153a2eb34f948dd5 result 1880f6a38f l.650; over 29 rebuilt documents' 1,173
 * paracols, the columns with unbalanced \begin/\end go from 183 to 0).
 */
const blocksOf = (content: string): string[] => {
  const blocks: string[] = [];
  let lines: string[] = [];
  let depth = 0;
  let verbatim: string | undefined;
  for (const line of content.trim().split('\n')) {
    if (verbatim === undefined && depth === 0 && line.trim() === '') {
      if (lines.length > 0) blocks.push(lines.join('\n'));
      lines = [];
      continue;
    }
    lines.push(line);
    if (verbatim !== undefined) {
      if (line.includes(`\\end{${verbatim}}`)) verbatim = undefined;
      continue;
    }
    const opened = /\\begin\{(lstlisting|verbatim\*?|Verbatim|minted|tcblisting)\}/u.exec(line);
    if (opened?.[1] !== undefined && !line.includes(`\\end{${opened[1]}}`)) {
      verbatim = opened[1];
      continue;
    }
    const bare = line.replace(/\\[\\{}%]/gu, '').replace(/%.*$/u, '');
    depth += (bare.match(/\\begin\{/gu) ?? []).length - (bare.match(/\\end\{/gu) ?? []).length;
    depth += (bare.match(/\{/gu) ?? []).length - (bare.match(/\}/gu) ?? []).length;
  }
  if (lines.length > 0) blocks.push(lines.join('\n'));
  return blocks;
};

export const realize = (given: { readonly [name: string]: unknown } = {}): Realization => {
  const p = withDefaults(key.params, given as never) as { readonly [name: string]: unknown };
  const color = param(p, 'ruleColor');
  // Inside its columns paracol makes \marginnote a \marginpar (paracol.sty l.2065), passing the note's left-margin text as
  // \marginpar's optional argument unbraced (l.2646-2650). marginnote copies the note's text there (\@dblarg), so a note whose
  // text holds a ] (a list's [nosep, …] or [(a)] options) ended that argument early: "Argument of \\itemize has an extra }",
  // "Paragraph ended before \@enumlabel@ was complete", "\begin{paracol} … ended by \end{itemize}" at the next \switchcolumn, and
  // "Float(s) lost" at \end{document} (run 41584963423: dd6b1b5d0ce58d226d163, \begin{enumerate}[(a)] in a note, 679 branches
  // charged the document's "Float(s) lost" in 20 pairs, amsart.A result e447088924 l.708; dd2864b9d72df4cf1ccea,
  // dfd58bc4a8431b6361779, d59b90d0b470c69e1e7e5, d9bae5d91b976b7b2e11a, e.g. amsart.A result da4535484b l.295; General's
  // marginnote note and note.marginnote alike). The same definition with the argument braced; \marginpar strips the braces.
  const braced = '\\makeatletter\\long\\def\\pcol@marginnote[#1]#2[#3]{\\endgroup\\pcol@mn@warning\\global\\let\\pcol@mn@warning\\relax\\def\\pcol@mparoffset{#3}\\pcol@@marginpar[{\\marginfont\\raggedleftmarginnote#1}]{\\marginfont\\raggedrightmarginnote#2}}\\makeatother';
  return {
    // paracol takes over the output routine, so it is not put in a group: its settings go in the preamble.
    preamble: (_params, _parentType, node) => ({
      packages: ['\\usepackage{paracol}', ...(color === '' ? [] : ['\\usepackage{xcolor}'])],
      declarations: [
        ...(node === undefined ? [] : [`\\setlength{\\columnsep}{${gapOf(node)}}`]),
        ...(param(p, 'ratio') === '' ? [] : [`\\columnratio{${param(p, 'ratio')}}`]),
        ...(param(p, 'rule') === '' ? [] : [`\\setlength{\\columnseprule}{${param(p, 'rule')}}`]),
        ...(color === '' ? [] : [`\\colseprulecolor{${color}}`]),
        braced,
      ],
    }),
    emit: (node, content) => {
      const blocks = blocksOf(content);
      const n = countOf(node);
      const per = Math.ceil(blocks.length / n);
      const parts = Array.from({ length: n }, (_, i) => blocks.slice(i * per, (i + 1) * per).join('\n\n'));
      return `\\begin{paracol}{${n}}\n${afterOptional(parts.join('\n\\switchcolumn\n'))}\n\\end{paracol}\n\n`;
    },
  };
};

export default realize;
