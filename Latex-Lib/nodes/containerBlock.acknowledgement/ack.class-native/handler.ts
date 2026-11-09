/**
 * ack.class-native (containerBlock/acknowledgement). The class's own acknowledgements environment, \begin{<env>} … \end{<env>}:
 * acmart's acks, aa's, quantumarticle's, ut-thesis's and spie's acknowledgements, aastex's, revtex's and spie's acknowledgments,
 * achemso's acknowledgement, neurips' and ecai's ack, imsart's acks. The class prints its own heading. The node's title reaches it
 * only where the class takes one: as the environment's option (`titleOption`: imsart's \begin{acks}[…], aastex's
 * \begin{acknowledgments}[…]), as a renewed name command in a group (`nameCommand`: revtex's \acknowledgmentsname, achemso's
 * \acknowledgementname), or as the class's funding environment when the title reads as funding (`fundingEnv`: imsart's funding,
 * whose heading is fixed, imsart.sty l.4855, 4865-4866).
 * CTAN: https://ctan.org/pkg/acmart
 */
import { withDefaults } from '../../../schema/params.ts';
import type { Realization } from '../../../schema/realization.ts';
import { escapeText, field, param } from '../../protocol.ts';
import key from './key.ts';

export const realize = (given: { readonly [name: string]: unknown } = {}): Realization => {
  const p = withDefaults(key.params, given as never) as { readonly [name: string]: unknown };
  const fundingEnv = param(p, 'fundingEnv');
  const nameCommand = param(p, 'nameCommand');
  return {
    preamble: (_params, _parentType, node, content) => ({}),
    emit: (node, content, context, parentType) => {
      const title = field(node, 'title');
      // A title that reads as funding goes to the class's funding environment, which prints its own fixed heading.
      if (fundingEnv !== '' && /fund/iu.test(title)) return `\\begin{${fundingEnv}}\n${content.trim()}\n\\end{${fundingEnv}}\n\n`;
      const env = param(p, 'env', 'acks');
      // Braced, so a ] in the title does not end the option.
      const option = p['titleOption'] === true && title !== '' ? `[{${escapeText(title)}}]` : '';
      const body = `\\begin{${env}}${option}\n${content.trim()}\n\\end{${env}}\n`;
      // The renewed name holds for this environment only: the group ends with it.
      if (nameCommand !== '' && title !== '') return `\\begingroup\\renewcommand{${nameCommand}}{${escapeText(title)}}\n${body}\\endgroup\n\n`;
      return `${body}\n`;
    },
  };
};

export default realize;
