/**
 * front.koma-title: KOMA-Script's title fields around \title, \author and
 * \date: \subject above the title, \subtitle under it, \titlehead at the
 * top, \publishers at the foot; titlepage=true or false through
 * \KOMAoptions; the title's font through \addtokomafont{title}. KOMA classes only.
 * CTAN: https://ctan.org/pkg/koma-script
 */
import { withDefaults } from '../../../schema/params.ts';
import type { Realization } from '../../../schema/realization.ts';
import { param } from '../../protocol.ts';
import { titleLinesWith } from '../node.ts';
import key from './key.ts';

export const realize = (given: { readonly [name: string]: unknown } = {}): Realization => {
  const p = withDefaults(key.params, given as never) as { readonly [name: string]: unknown };
  const field = (name: string, command: string): string[] => (param(p, name) === '' ? [] : [`\\${command}{${param(p, name)}}`]);
  return {
    preamble: (_params, _parentType, node, content) =>
      node === undefined || content === undefined
        ? {}
        : {
            declarations: [
              ...(param(p, 'titlePage', 'class') === 'class' ? [] : [`\\KOMAoptions{titlepage=${param(p, 'titlePage')}}`]),
              ...(param(p, 'titleFont') === '' ? [] : [`\\addtokomafont{title}{${param(p, 'titleFont')}}`]),
              ...field('titlehead', 'titlehead'),
              ...field('subject', 'subject'),
              ...titleLinesWith(node, content, param(p, 'date', 'given')),
              ...field('subtitle', 'subtitle'),
              ...field('publishers', 'publishers'),
            ],
          },
    emit: () => '\\maketitle\n\n',
  };
};

export default realize;
