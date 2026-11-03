/**
 * cols.multicol: \begin{multicols}{n} … \end{multicols}, balanced columns
 * in the text, or multicols* filled in turn; \columnsep for the gap,
 * \columnseprule and \columnseprulecolor for a rule, \raggedcolumns.
 * CTAN: https://ctan.org/pkg/multicol (the user interface section)
 */
import { withDefaults } from '../../../schema/params.ts';
import type { Realization } from '../../../schema/realization.ts';
import { param } from '../../protocol.ts';
import { afterOptional, countOf, gapOf } from '../node.ts';
import key from './key.ts';

export const realize = (given: { readonly [name: string]: unknown } = {}): Realization => {
  const p = withDefaults(key.params, given as never) as { readonly [name: string]: unknown };
  const color = param(p, 'ruleColor');
  return {
    preamble: () => ({ packages: ['\\usepackage{multicol}', ...(color === '' ? [] : ['\\usepackage{xcolor}'])] }),
    emit: (node, content) => {
      if (countOf(node) === 1) return `${content}\n`;
      const env = p['balance'] === false ? 'multicols*' : 'multicols';
      const setup = [
        `\\setlength{\\columnsep}{${gapOf(node)}}`,
        ...(param(p, 'rule') === '' ? [] : [`\\setlength{\\columnseprule}{${param(p, 'rule')}}`]),
        ...(color === '' ? [] : [`\\renewcommand{\\columnseprulecolor}{\\color{${color}}}`]),
        ...(p['ragged'] === true ? ['\\raggedcolumns'] : []),
      ];
      return `\n{\n${setup.join('\n')}\n\\begin{${env}}{${countOf(node)}}\n${afterOptional(content.trim())}\n\\end{${env}}\n}\n`;
    },
  };
};

export default realize;
