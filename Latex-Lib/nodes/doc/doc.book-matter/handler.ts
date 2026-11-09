/**
 * doc.book-matter (doc). A book's three matters set by hooks from the preamble, since a Flouest template carries preamble lines
 * only: \frontmatter at \begin{document}, \mainmatter once, before the first numbered chapter, and \backmatter once, before the
 * bibliography (thebibliography's `before` hook). As the class.extbook example places them by hand
 * (Latex-Template-Examples/class.extbook/main.tex l.142, 173, 314): roman page numbers and unnumbered chapters in the front
 * matter, arabic numbering from 1 at the first chapter, and unnumbered chapters again in the back matter (extbook.cls l.298-308).
 * CTAN: https://ctan.org/pkg/latex-base
 *
 * The \mainmatter guard is the one head.book-matter writes in the body (\ifdefined\LatexLibMainmatter\else\mainmatter
 * \global\let\LatexLibMainmatter\empty\fi), so the two together still run \mainmatter once. It runs at the start of \@chapter,
 * the numbered chapter's internal that \chapter reaches through \secdef\@chapter\@schapter (book.cls l.354-355; extbook, amsbook,
 * memoir and scrbook alike), after \chapter's own \cleardoublepage: \mainmatter's \cleardoublepage then finds the page empty, and
 * arabic numbering starts at 1 on the chapter's page. Not \chapter itself: amsbook's contents and lists call an unstarred \chapter
 * with \secdef gobbled (\@starttoc, amsbook.cls l.1022-1026), so a wrapper there started the main matter at the table of contents
 * (probe, ZeroTeX-NG, 2026-11-07: two arabic pages before chapter 1). \@chapter is wrapped at \begin{document}, after every
 * package has loaded (hyperref wraps it in the preamble), copied with \NewCommandCopy. Only a numbered chapter starts the main
 * matter: a \part before the first chapter stays in the front matter. A bibliography printed by biblatex's \printbibliography,
 * which uses no thebibliography environment, gets no \backmatter.
 */
import { withDefaults } from '../../../schema/params.ts';
import type { Realization } from '../../../schema/realization.ts';
import key from './key.ts';

export const FRONTMATTER = '\\AtBeginDocument{\\frontmatter}';

export const MAINMATTER = [
  '\\makeatletter',
  '\\AtBeginDocument{%',
  '  \\NewCommandCopy\\LatexLibBookChapter\\@chapter',
  '  \\def\\@chapter{\\ifdefined\\LatexLibMainmatter\\else\\mainmatter\\global\\let\\LatexLibMainmatter\\empty\\fi\\LatexLibBookChapter}}',
  '\\makeatother',
].join('\n');

export const BACKMATTER = '\\AddToHook{env/thebibliography/before}{\\ifdefined\\LatexLibBackmatter\\else\\backmatter\\global\\let\\LatexLibBackmatter\\empty\\fi}';

export const realize = (given: { readonly [name: string]: unknown } = {}): Realization => {
  const p = withDefaults(key.params, given as never) as { readonly [name: string]: unknown };
  const declarations = [
    ...(p['frontmatter'] === true ? [FRONTMATTER] : []),
    ...(p['mainmatter'] === true ? [MAINMATTER] : []),
    ...(p['backmatter'] === true ? [BACKMATTER] : []),
  ];
  return {
    preamble: () => (declarations.length > 0 ? { declarations } : {}),
    // A document-level way prints nothing in the body: the hooks place the three commands.
    emit: () => '',
  };
};

export default realize;
