/**
 * ack.copernicus (containerBlock/acknowledgement). Copernicus Publications' back-matter statements, chosen by the node's
 * title: no title, or "Acknowledgements", gives the class's \begin{acknowledgements} … \end{acknowledgements}
 * (copernicus.cls l.2883; template.tex l.205-207); a title naming one of the class's statements gives that command with the
 * text as its one argument, \authorcontribution{…}, \competinginterests{…}, \dataavailability{…} … (l.2823-2866; the template's
 * mandatory author contributions and competing interests, template.tex l.199-201); any other title gives
 * \specialsection{<title>}{…} (l.2867-2874).
 *
 * Each is preceded by \ifx\thesection\theolds\else\noappendix\fi, the test the class's own ESSD availability sections run
 * (l.2847-2850): after \appendix the section numbers are lettered (l.1747-1750), and the template ends them with \noappendix
 * (template.tex l.181) before these statements, "otherwise the figures might be numbered incorrectly". Outside an appendix
 * \thesection is still \theolds (l.1745) and nothing runs.
 *
 * The text is a macro argument for the statement commands (\long, so paragraphs are kept); verbatim material inside it cannot
 * be (the environment form takes it).
 * CTAN: https://ctan.org/pkg/copernicus
 */
import { withDefaults } from '../../../schema/params.ts';
import type { Realization } from '../../../schema/realization.ts';
import { escapeText, field, labelLine } from '../../protocol.ts';
import key from './key.ts';
import { ACKNOWLEDGEMENTS, csnameSafe, normalTitle, statementOf } from './statements.ts';

export const CLOSE_APPENDIX = '\\ifx\\thesection\\theolds\\else\\noappendix\\fi';

export const realize = (given: { readonly [name: string]: unknown } = {}): Realization => {
  const p = withDefaults(key.params, given as never) as { readonly [name: string]: unknown };
  return {
    preamble: () => ({}),
    emit: (node, content) => {
      const title = field(node, 'title');
      const label = labelLine(field(node, 'label'));
      const text = content.trim();
      const guard = p['closeAppendix'] === false ? '' : `${CLOSE_APPENDIX}\n`;
      if (title === '' || ACKNOWLEDGEMENTS.has(normalTitle(title))) {
        return `${guard}\\begin{acknowledgements}${label}\n${text}\n\\end{acknowledgements}\n\n`;
      }
      const command = statementOf(title);
      if (command !== undefined) return `${guard}\\${command}{${label.trimStart()}${label === '' ? '' : '\n'}${text}}\n\n`;
      // A heading the class does not name; one with nothing printable left falls back to the environment.
      const heading = escapeText(csnameSafe(title));
      if (heading === '') return `${guard}\\begin{acknowledgements}${label}\n${text}\n\\end{acknowledgements}\n\n`;
      return `${guard}\\specialsection{${heading}}{${label.trimStart()}${label === '' ? '' : '\n'}${text}}\n\n`;
    },
  };
};

export default realize;
