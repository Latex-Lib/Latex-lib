/**
 * head.copernicus: Copernicus Publications' named first and last sections. copernicus.cls gives
 * \newcommand\introduction[1][\introductionname]{\section[#1]{#1…}} and the same \conclusions[\conclusionname]
 * (Source/0195-copernicus/copernicus.cls l.2802-2805; \introductionname Introduction and \conclusionname Conclusions
 * under English, l.1411-1414), and the publisher's template writes them bare (template.tex l.138, l.154: "\introduction
 * [modified heading if necessary]"). Every other heading is the kernel command under the class's own \@startsection
 * (l.1036-1053), as head.class-native prints it.
 * CTAN: https://ctan.org/pkg/copernicus
 *
 * A numbered section whose title is Introduction or Conclusion(s), with no short title of its own (the command's one
 * optional argument is both the contents line and the heading), is the class command: bare when the title is the class's
 * English name, with the title as its optional argument otherwise (another case, "Conclusion"). Anything else falls back.
 */
import type { Realization } from '../../../schema/realization.ts';
import { escapeText, field, labelLine } from '../../protocol.ts';
import { headingCommand, levelOf } from '../node.ts';

/** The class command for a title, its English default name, and the titles it takes. */
const NAMED = [
  { command: '\\introduction', name: 'Introduction', titles: /^introduction$/iu },
  { command: '\\conclusions', name: 'Conclusions', titles: /^conclusions?$/iu },
] as const;

export const realize = (_given: { readonly [name: string]: unknown } = {}): Realization => ({
  preamble: () => ({}),
  emit: (node, content) => {
    const title = content.trim();
    const numbered = (node.attrs?.['data'] as { numbered?: unknown } | undefined)?.numbered !== false;
    const short = escapeText(field(node, 'shortTitle'));
    const named = NAMED.find((n) => n.titles.test(title));
    if (named === undefined || levelOf(node) !== 'section' || !numbered || (short !== '' && short !== title)) return headingCommand(node, content);
    // \introduction then a \par (the blank line) or \label: \@ifnextchar[ sees no bracket, so the default name is used.
    return `${named.command}${title === named.name ? '' : `[${title}]`}${labelLine(field(node, 'label'))}\n\n`;
  },
});

export default realize;
