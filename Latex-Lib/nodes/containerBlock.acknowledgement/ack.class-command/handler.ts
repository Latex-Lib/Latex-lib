/**
 * ack.class-command (containerBlock/acknowledgement). The class's own acknowledgements command, which prints its fixed heading:
 * - `argument`: the text as the command's argument, \acknowledgments{…} (corl_2026.sty l.130-136; aistats2026.sty l.65-73,
 *   which drops it unless [accepted]), jmlr's \acks{…} (jmlr.dtx l.4181), iopjournal's \ack{…} and mdpi's \acknowledgments{…};
 *   under iopjournal and mdpi the node's title picks the class's other back-matter command (\funding, \roles, \data,
 *   \authorcontributions, \conflictsofinterest, … ; `byTitle`, titles.ts);
 * - `run-in`: the command alone on its line, then the text: agu's \acknowledgments, a bold run-in head (agujournal2019.cls
 *   l.1077-1079);
 * - `preamble`: lipics' \acknowledgements{…}, which the class stores and prints in the abstract's metadata block
 *   (Template/template-requirement/LIPIcs.md l.85): written in the preamble, nothing where the node stands.
 * CTAN: https://ctan.org/pkg/jmlr
 */
import { withDefaults } from '../../../schema/params.ts';
import type { Realization } from '../../../schema/realization.ts';
import { escapeText, field, param } from '../../protocol.ts';
import key from './key.ts';
import { iopjournal, mdpi, type Pick } from './titles.ts';

export const realize = (given: { readonly [name: string]: unknown } = {}): Realization => {
  const p = withDefaults(key.params, given as never) as { readonly [name: string]: unknown };
  const command = param(p, 'command', 'acknowledgments');
  const form = param(p, 'form', 'argument');
  const pick = (title: string): Pick => {
    // mdpi's \backnotes adds its own colon (mdpi.cls l.1455-1456).
    const heading = escapeText(title.replace(/:\s*$/u, ''));
    switch (param(p, 'byTitle', 'none')) {
      case 'iopjournal':
        return iopjournal(title, command);
      case 'mdpi':
        return mdpi(title, heading, command);
      default:
        return { command };
    }
  };
  return {
    // The stored form: \acknowledgements{…} in the preamble, before the abstract the class prints it with.
    preamble: (_params, _parentType, node, content) =>
      form === 'preamble' && node !== undefined && content !== undefined && content.trim() !== '' ? { declarations: [`\\${command}{${content.trim()}}`] } : {},
    emit: (node, content) => {
      if (form === 'preamble') return '';
      if (form === 'run-in') return `\\${command}\n${content.trim()}\n\n`;
      const chosen = pick(field(node, 'title'));
      const heading = chosen.heading === undefined ? '' : `{${chosen.heading}}`;
      return `\\${chosen.command}${heading}{${content.trim()}}\n\n`;
    },
  };
};

export default realize;
