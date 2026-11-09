/**
 * front.inst-institute (paragraph/title). The LNCS-style title block of llncs, eccv, easychair and aa: \author{A\inst{1}\orcidID{…}
 * \and B\inst{1,2}} pointing into one \institute{… \email{…} \and …}, \titlerunning and \authorrunning, \subtitle, a \thanks note on
 * the title, then the class's own \maketitle; the keywords at the abstract's end (llncs) or stored for \maketitle (aa).
 * CTAN: https://ctan.org/pkg/llncs, https://ctan.org/pkg/easychair; aa.cls from A&A's macro package.
 */
import { withDefaults } from '../../../schema/params.ts';
import type { Realization, Subject } from '../../../schema/realization.ts';
import { param } from '../../protocol.ts';
import { affiliationNumber, affiliationsOf, affiliationsOfAuthor, authorsOf, templateField, templateList, type TitleAuthor } from '../node.ts';
import key from './key.ts';

/** `\cmd{value}`, or nothing when the value is empty. */
const line = (command: string, value: string): string[] => (value === '' ? [] : [`\\${command}{${value}}`]);

/** The running author's fallback, as llncsdoc asks for it: one name, "A and B", or "A et al." past two. */
const runningNames = (authors: readonly TitleAuthor[]): string =>
  authors.length === 0 ? '' : authors.length === 1 ? authors[0]!.name : authors.length === 2 ? `${authors[0]!.name} and ${authors[1]!.name}` : `${authors[0]!.name} et al.`;

/** Whether the author is the one templateSpecific.correspondingAuthor names (by e-mail or by name). */
const isCorresponding = (author: TitleAuthor, corresponding: string): boolean => corresponding !== '' && (author.email === corresponding || author.name === corresponding);

export const realize = (given: { readonly [name: string]: unknown } = {}): Realization => {
  const p = withDefaults(key.params, given as never) as { readonly [name: string]: unknown };
  const keywordsMode = param(p, 'keywords', 'abstract-end');

  const body = (node: Subject, content: string): string => {
    const authors = authorsOf(node);
    const affiliations = affiliationsOf(node);
    const corresponding = templateField(node, 'correspondingAuthor');
    const emails = param(p, 'emails', 'institute');

    // The title, with templateSpecific.titleNote as llncs's (and easychair's, aa's) \thanks on it.
    const note = templateField(node, 'titleNote');
    const title = `\\title{${content.trim()}${note === '' ? '' : `\\thanks{${note}}`}}`;

    // Each author: the name, \inst with the numbers of their institutes in the \institute list, llncs's \orcidID, and under aa the
    // e-mail after them (\corrauth for the corresponding author, aa.cls l.812, which makes it a \thanks; \email for the others, l.811).
    const authorEntry = (a: TitleAuthor): string => {
      const numbers = affiliationsOfAuthor(a, affiliations).map((x) => affiliationNumber(x, affiliations)).sort((x, y) => x - y);
      const inst = numbers.length === 0 ? '' : `\\inst{${numbers.join(',')}}`;
      const orcid = param(p, 'orcid', 'orcidID') === 'orcidID' && a.orcid !== '' ? `\\orcidID{${a.orcid}}` : '';
      const mail =
        emails !== 'author' || a.email === '' ? '' : param(p, 'corresponding', 'none') === 'corrauth' && isCorresponding(a, corresponding) ? `\\corrauth{${a.email}}` : `\\email{${a.email}}`;
      return `${a.name}${inst}${orcid}${mail}`;
    };

    // The institutes, each with the e-mails of the authors whose first institute it is (llncsdoc.tex l.185-190, easychair.tex
    // l.60-75); with no institute at all, one entry holding the e-mails, and never the class's "No Institute Given".
    const mailsAt = new Map<string, string[]>();
    const unplaced: string[] = [];
    if (emails === 'institute') {
      for (const a of authors) {
        if (a.email === '') continue;
        const first = affiliationsOfAuthor(a, affiliations)[0];
        if (first === undefined) unplaced.push(a.email);
        else mailsAt.set(first.id, [...(mailsAt.get(first.id) ?? []), a.email]);
      }
    }
    const mailText = (list: readonly string[]): string => list.map((e) => `\\email{${e}}`).join(', ');
    const institutes =
      affiliations.length === 0
        ? [mailText(unplaced)]
        : affiliations.map((x) => {
            const here = mailsAt.get(x.id) ?? [];
            return here.length === 0 ? x.text : `${x.text}\\\\ ${mailText(here)}`;
          });

    const heads = param(p, 'runningHeads', 'given');
    const shortTitle = heads === 'none' ? '' : templateField(node, 'shortTitle') || (heads === 'always' ? content.trim() : '');
    const runningAuthor = heads === 'none' ? '' : templateField(node, 'runningAuthor') || (heads === 'always' ? runningNames(authors) : '');

    // aa's date line (aa.cls l.743, its \date): "Received …; accepted …", as aa_example.tex l.73 writes it.
    const [received, accepted] = [templateField(node, 'received'), templateField(node, 'accepted')];
    const date =
      param(p, 'date', 'none') !== 'received' || (received === '' && accepted === '')
        ? ''
        : received === ''
          ? `Accepted ${accepted}`
          : accepted === ''
            ? `Received ${received}`
            : `Received ${received}; accepted ${accepted}`;

    const correspondingAuthor = authors.find((a) => isCorresponding(a, corresponding));
    const offprints = param(p, 'corresponding', 'none') === 'offprints' ? templateField(node, 'offprints') || correspondingAuthor?.name || corresponding : '';
    const keywords = keywordsMode === 'stored' ? templateList(node, 'keywords').join(' -- ') : '';

    return [
      title,
      ...(p['subtitle'] === false ? [] : line('subtitle', templateField(node, 'subtitle'))),
      // Each on a line of its own: easychair's \titlerunning and \authorrunning are delimited by the space that ends their line
      // (easychair.cls l.200-219, \def\titlerunning#1<end of line>).
      ...line('titlerunning', shortTitle),
      ...(authors.length === 0 ? [] : [`\\author{${authors.map(authorEntry).join(' \\and ')}}`]),
      ...line('authorrunning', runningAuthor),
      `\\institute{${institutes.join(' \\and ')}}`,
      ...line('date', date),
      ...line('offprints', offprints),
      ...(p['frontNotes'] === true ? [...line('headnote', templateField(node, 'headnote')), ...line('dedication', templateField(node, 'dedication'))] : []),
      // aa stores \keywords and its \maketitle prints them under the abstract (aa.cls l.861-868); they must come before it.
      ...line('keywords', keywords),
    ].join('\n');
  };

  return {
    // llncs wants \keywords{a \and b} as the abstract's last line (llncsdoc.tex l.215-220; llncs.cls l.906 provides it at
    // \begin{document}, with \and as a centred dot). The title cannot write into the abstract, so the kernel's env/abstract/end hook
    // runs it at \end{abstract}, inside the environment; with no abstract environment in the document the keywords are not printed.
    preamble: (_params, _parentType, node) => {
      if (node === undefined || keywordsMode !== 'abstract-end') return {};
      const keywords = templateList(node, 'keywords');
      return keywords.length === 0 ? {} : { declarations: [`\\AddToHook{env/abstract/end}{\\keywords{${keywords.join(' \\and ')}}}`] };
    },
    // The title lines go in the body, just before \maketitle, as front.class-native writes them (the classes keep them until it).
    emit: (node, content) => `${body(node, content)}\n\\maketitle\n\n`,
  };
};

export default realize;
