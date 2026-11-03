/**
 * front.titling: \maketitle restyled by titling's hooks, \pretitle and
 * \posttitle around the title, \preauthor and \postauthor around the
 * authors, \predate and \postdate around the date; \droptitle to move the
 * block; on a page of its own in titlingpage, vertically centred by
 * \maketitlehooka and \maketitlehookd.
 * CTAN: https://ctan.org/pkg/titling (section 2.1.1)
 */
import { withDefaults } from '../../../schema/params.ts';
import type { Realization } from '../../../schema/realization.ts';
import { param } from '../../protocol.ts';
import { titleLinesWith } from '../node.ts';
import key from './key.ts';

const ENV: { readonly [a: string]: string } = { center: 'center', left: 'flushleft', right: 'flushright' };
const COLUMN: { readonly [a: string]: string } = { center: 'c', left: 'l', right: 'r' };

export const realize = (given: { readonly [name: string]: unknown } = {}): Realization => {
  const p = withDefaults(key.params, given as never) as { readonly [name: string]: unknown };
  const align = param(p, 'align', 'center');
  const env = ENV[align] ?? 'center';
  const dateEnv = ENV[param(p, 'dateAlign', 'same')] ?? env;
  const hooks = [
    `\\pretitle{\\begin{${env}}${param(p, 'titleFont', '\\LARGE')}}`,
    `\\posttitle{\\par\\end{${env}}\\vskip ${param(p, 'gap', '0.5em')}}`,
    `\\preauthor{\\begin{${env}}${param(p, 'authorFont', '\\large')} \\lineskip 0.5em\\begin{tabular}[t]{${COLUMN[align] ?? 'c'}}}`,
    `\\postauthor{\\end{tabular}\\par\\end{${env}}}`,
    `\\predate{\\begin{${dateEnv}}${param(p, 'dateFont', '\\large')}}`,
    `\\postdate{\\par\\end{${dateEnv}}}`,
    ...(param(p, 'drop') === '' ? [] : [`\\setlength{\\droptitle}{${param(p, 'drop')}}`]),
    ...(p['page'] === true ? ['\\renewcommand{\\maketitlehooka}{\\null\\mbox{}\\vfill}', '\\renewcommand{\\maketitlehookd}{\\vfill\\null}'] : []),
  ];
  return {
    preamble: (_params, _parentType, node, content) =>
      node === undefined || content === undefined ? { packages: ['\\usepackage{titling}'] } : { packages: ['\\usepackage{titling}'], declarations: [...hooks, ...titleLinesWith(node, content, param(p, 'date', 'given'))] },
    emit: () => (p['page'] === true ? '\\begin{titlingpage}\n\\maketitle\n\\end{titlingpage}\n\n' : '\\maketitle\n\n'),
  };
};

export default realize;
