/**
 * head.koma-fonts: KOMA-Script's own heading interface. \setkomafont or
 * \addtokomafont on the disposition element (every heading), the heading
 * sizes and number dots through \KOMAoptions, "Chapter N" above chapters
 * with chapterprefix.
 * CTAN: https://ctan.org/pkg/koma-script
 */
import { withDefaults } from '../../../schema/params.ts';
import type { Realization } from '../../../schema/realization.ts';
import { param } from '../../protocol.ts';
import { colorOf, headingCommand, levelOf, numberingLines } from '../node.ts';
import key from './key.ts';

export const realize = (given: { readonly [name: string]: unknown } = {}): Realization => {
  const p = withDefaults(key.params, given as never) as { readonly [name: string]: unknown };
  const look = `${param(p, 'font')}${colorOf(p)}`;
  const options = [
    ...(param(p, 'headings', 'class') === 'class' ? [] : [`headings=${param(p, 'headings')}`]),
    ...(param(p, 'numbers', 'class') === 'class' ? [] : [`numbers=${param(p, 'numbers')}`]),
  ];
  const packages = colorOf(p) === '' ? [] : ['\\usepackage{xcolor}'];
  return {
    preamble: (_params, _parentType, node) => {
      if (node === undefined) return packages.length === 0 ? {} : { packages };
      const level = levelOf(node);
      const declarations = [
        ...numberingLines(p, level),
        ...(options.length === 0 ? [] : [`\\KOMAoptions{${options.join(',')}}`]),
        ...(p['chapterPrefix'] === true && level === 'chapter' ? ['\\KOMAoptions{chapterprefix=true}'] : []),
        ...(look === '' ? [] : [`\\${param(p, 'mode', 'set') === 'add' ? 'addtokomafont' : 'setkomafont'}{disposition}{${look}}`]),
      ];
      return { ...(packages.length === 0 ? {} : { packages }), ...(declarations.length === 0 ? {} : { declarations }) };
    },
    emit: (node, content) => headingCommand(node, content),
  };
};

export default realize;
