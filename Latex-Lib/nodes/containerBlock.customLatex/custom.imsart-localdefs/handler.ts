/**
 * custom.imsart-localdefs (containerBlock/customLatex). imsart's raw LaTeX block: the author's LaTeX unchanged in the body,
 * and its preamble (data.preamble) between \startlocaldefs and \endlocaldefs, where the IMS template asks for the author's
 * definitions (Template/template-requirement/IMS_Imsart.md l.164; aos-template.tex l.55-59).
 */
import { withDefaults } from '../../../schema/params.ts';
import type { Realization } from '../../../schema/realization.ts';
import { dataOf } from '../../protocol.ts';
import key from './key.ts';

export const realize = (given: { readonly [name: string]: unknown } = {}): Realization => {
  withDefaults(key.params, given as never);
  return {
    // data.preamble as written (untrimmed, as custom.raw keeps it), inside one \startlocaldefs … \endlocaldefs pair per block;
    // a block with no preamble prints nothing there.
    preamble: (_params, _parentType, node) => {
      const pre = dataOf(node)['preamble'];
      return typeof pre === 'string' && pre !== '' ? { declarations: [`\\startlocaldefs\n${pre}\n\\endlocaldefs`] } : {};
    },
    emit: (_node, content) => `${content}\n`,
  };
};

export default realize;
