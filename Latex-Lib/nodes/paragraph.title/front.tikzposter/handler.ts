/**
 * front.tikzposter (paragraph/title). tikzposter's title box: \title{…}, \author{A\textsuperscript{1}, \underline{B}\textsuperscript{1,2}}
 * with the presenting author underlined, \institute{\textsuperscript{1}… \quad \textsuperscript{2}… \\ \texttt{e-mail}} and the
 * class's \maketitle[width=…, roundedcorners=…], which draws the box across the poster. No \date: the box prints none.
 * CTAN: https://ctan.org/pkg/tikzposter. Source: Latex Related Research/Latex-lib-main/Source/0436-jacobs-landscape-poster/main.tex
 * l.17-22, 0429-ndpvt-web-latex-document-skill/assets/templates/poster.tex l.105-117, 0368-sjijon-tex-templates/Tikzposter
 * posters/Simple poster/simple-poster.tex l.55-72.
 */
import { withDefaults } from '../../../schema/params.ts';
import type { Realization, Subject } from '../../../schema/realization.ts';
import { param } from '../../protocol.ts';
import { affiliationNumber, affiliationsOf, affiliationsOfAuthor, authorsOf, templateField, type TitleAuthor } from '../node.ts';
import key from './key.ts';

/** The \maketitle options the parameters set, in the order simple-poster.tex l.72 writes them; empty ones are left out. */
const OPTIONS = ['width', 'titletoblockverticalspace', 'linewidth', 'roundedcorners'] as const;

export const realize = (given: { readonly [name: string]: unknown } = {}): Realization => {
  const p = withDefaults(key.params, given as never) as { readonly [name: string]: unknown };

  const body = (node: Subject, content: string): string => {
    const authors = authorsOf(node);
    const affiliations = affiliationsOf(node);
    // Numbers only when there is more than one institute to tell apart: one institute is written bare (main.tex l.20-21).
    const numbered = affiliations.length > 1;
    const presenting = templateField(node, 'presentingAuthor');
    const isPresenting = (a: TitleAuthor): boolean => presenting !== '' && (a.name === presenting || a.email === presenting);

    // Each author: the presenting one underlined (simple-poster.tex l.62), then the numbers of their institutes as a superscript.
    const authorEntry = (a: TitleAuthor): string => {
      const numbers = numbered ? affiliationsOfAuthor(a, affiliations).map((x) => affiliationNumber(x, affiliations)).sort((x, y) => x - y) : [];
      return `${isPresenting(a) ? `\\underline{${a.name}}` : a.name}${numbers.length === 0 ? '' : `\\textsuperscript{${numbers.join(',')}}`}`;
    };

    // The institutes side by side with \quad (poster.tex l.110-112) or one a line (simple-poster.tex l.64-65), then the e-mails in
    // \texttt on a line of their own (poster.tex l.113-114).
    const separator = param(p, 'institutes', 'quad') === 'newline' ? ' \\\\\n  ' : ' \\quad\n  ';
    const institutes = affiliations.map((x, i) => `${numbered ? `\\textsuperscript{${i + 1}}` : ''}${x.text}`).join(separator);
    const emails = p['emails'] === false ? [] : authors.filter((a) => a.email !== '').map((a) => `\\texttt{${a.email}}`);
    const institute = [institutes, ...(emails.length === 0 ? [] : [emails.join(' \\quad ')])].filter(Boolean).join(' \\\\\n  ');

    const options = OPTIONS.map((name) => [name, param(p, name, '')] as const)
      .filter(([, value]) => value !== '')
      .map(([name, value]) => `${name}=${value}`);
    return [
      `\\title{${content.trim()}}`,
      ...(authors.length === 0 ? [] : [`\\author{${authors.map(authorEntry).join(', ')}}`]),
      ...(institute === '' ? [] : [`\\institute{${institute}}`]),
      `\\maketitle${options.length === 0 ? '' : `[${options.join(',')}]`}`,
    ].join('\n');
  };

  return {
    // tikzposter's \title, \author and \institute only store their text for \maketitle, so they sit with it in the body, before the
    // columns, as front.class-native writes them.
    preamble: () => ({}),
    emit: (node, content) => `${body(node, content)}\n\n`,
  };
};

export default realize;
