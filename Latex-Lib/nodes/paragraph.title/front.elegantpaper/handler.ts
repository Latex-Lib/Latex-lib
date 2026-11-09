/**
 * front.elegantpaper (paragraph/title). ElegantLaTeX's elegantpaper title block: \title, one \author whose entries (joined by
 * \and, each set in the class's centred tabular) carry the author's affiliation lines and \email{…} after \\, the \institute line
 * under the authors (or "Corresponding author: \email{…}"), the \version line, the \date line, then the class's \maketitle; the
 * keywords as the class's \keywords{…} at the end of the abstract, as its sample papers write them.
 * CTAN: https://ctan.org/pkg/elegantpaper
 */
import { withDefaults } from '../../../schema/params.ts';
import type { Realization, Subject } from '../../../schema/realization.ts';
import { param } from '../../protocol.ts';
import { affiliationsOf, affiliationsOfAuthor, authorsOf, templateField, templateList, titleLines, type TitleAuthor } from '../node.ts';
import key from './key.ts';

/** `\cmd{value}`, or nothing when the value is empty. */
const line = (command: string, value: string): string[] => (value === '' ? [] : [`\\${command}{${value}}`]);

export const realize = (given: { readonly [name: string]: unknown } = {}): Realization => {
  const p = withDefaults(key.params, given as never) as { readonly [name: string]: unknown };
  const keywordsMode = param(p, 'keywords', 'abstract-end');

  /** The corresponding author's e-mail as the class's \email (l.101), or the name as given when no e-mail is known. */
  const correspondingText = (value: string, authors: readonly TitleAuthor[]): string => {
    const named = authors.find((a) => a.email === value || a.name === value);
    const email = named !== undefined && named.email !== '' ? named.email : value.includes('@') ? value : '';
    return email === '' ? value : `\\email{${email}}`;
  };

  const body = (node: Subject, content: string): string => {
    const authors = authorsOf(node);
    const affiliations = affiliationsOf(node);
    // Each author's entry: the name, then each of their affiliations on a line of its own, then their e-mail, as the class's sample
    // writes "Author1 \\ Institute1" (elegantpaper-en.tex l.4); the class sets \@author in a centred tabular[t]{c} (cls l.322-325),
    // so \\ breaks the entry and the kernel's \and starts the next author's column.
    const entry = (a: TitleAuthor): string =>
      [a.name, ...affiliationsOfAuthor(a, affiliations).map((x) => x.text), ...(param(p, 'emails', 'author') === 'author' && a.email !== '' ? [`\\email{${a.email}}`] : [])].join(' \\\\ ');
    // \institute and \version are token registers (cls l.276-277): \institute{…} assigns it, and \@maketitle prints \the\institute
    // under the authors (l.327) and the Version line only when \version is not empty (l.329-332).
    const institute = templateField(node, 'institute');
    const corresponding = templateField(node, 'correspondingAuthor');
    const instituteLine =
      institute !== '' ? institute : param(p, 'corresponding', 'institute') === 'institute' && corresponding !== '' ? `${param(p, 'correspondingLabel', 'Corresponding author:')} ${correspondingText(corresponding, authors)}` : '';
    return [
      `\\title{${content.trim()}}`,
      ...(authors.length === 0 ? [] : [`\\author{${authors.map(entry).join(' \\and ')}}`]),
      ...line('institute', instituteLine),
      ...line('version', templateField(node, 'version')),
      // The node's date, or \date{} for none (the class then prints no Date line, l.333); with no \date the kernel's \today.
      ...titleLines(node, content).filter((l) => l.startsWith('\\date{')),
    ].join('\n');
  };

  return {
    // The class's labels for the Version and Date lines (\versiontext, \updatetext, cls l.249-250) when the template renames them.
    // The keywords: the class's \keywords{…} prints "Keywords: …" where it stands (l.254), and its sample papers write it as the
    // abstract's last line (elegantpaper-en.tex l.21); the title cannot write into the abstract, so the kernel's env/abstract/end
    // hook runs it at \end{abstract}, inside the environment (as front.inst-institute does for llncs). A paper with no abstract
    // environment then prints none: the 'after-title' form prints them under the title instead.
    preamble: (_params, _parentType, node) => {
      const declarations = [...line('renewcommand\\versiontext', param(p, 'versionLabel')), ...line('renewcommand\\updatetext', param(p, 'dateLabel'))];
      const keywords = node === undefined || keywordsMode !== 'abstract-end' ? [] : templateList(node, 'keywords');
      if (keywords.length > 0) declarations.push(`\\AddToHook{env/abstract/end}{\\keywords{${keywords.join(', ')}}}`);
      return declarations.length === 0 ? {} : { declarations };
    },
    // The title lines go in the body, just before \maketitle, as front.class-native writes them: the class's \maketitle empties them
    // after printing (cls l.300-312).
    emit: (node, content) => {
      const keywords = keywordsMode === 'after-title' ? templateList(node, 'keywords') : [];
      return `${body(node, content)}\n\\maketitle\n${keywords.length === 0 ? '' : `\\keywords{${keywords.join(', ')}}\n`}\n`;
    },
  };
};

export default realize;
