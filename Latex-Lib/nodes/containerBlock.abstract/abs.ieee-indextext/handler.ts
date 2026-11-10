/**
 * abs.ieee-indextext (containerBlock/abstract). IEEEtran's title-area abstract (V1.7): the abstract and the index terms handed to
 * \IEEEtitleabstractindextext{…}, which only stores them (\long\def\IEEEtitleabstractindextext#1{\def\@IEEEtitleabstractindextext{#1}},
 * IEEEtran.cls l.5226-5227); the compsoc and transmag journal formats print them inside \maketitle's title area, in a
 * \parbox{0.922\textwidth} under compsoc (l.4791-4797, l.4821-4834), and \IEEEdisplaynontitleabstractindextext prints them where it
 * stands in every other format (conference, technote, the plain journal) and nothing under a compsoc or transmag journal
 * (l.5229-5249). bare_jrnl_compsoc.tex l.469-495 writes the pair: \IEEEtitleabstractindextext{\begin{abstract}…\end{abstract}
 * \begin{IEEEkeywords}…\end{IEEEkeywords}} before \maketitle, \IEEEdisplaynontitleabstractindextext after it.
 * CTAN: https://ctan.org/pkg/ieeetran
 *
 * The store must precede \maketitle wherever the abstract node stands, so it goes in the preamble, built from the node's body
 * (the handler is given the node and its content there, as abs.class-native's command form is); the node itself prints the display
 * command. The index terms are the title's templateSpecific.keywords, which an abstract way cannot read: the title way hands them
 * over in \LatexLibIndexTerms (\gdef'd before \maketitle, e.g. to \begin{IEEEkeywords}…\end{IEEEkeywords}), provided empty here.
 * The class keeps one title-area text. The first abstract node's store is kept (\LatexLibIndexTextStore gobbles every later
 * one) and that node prints it as above; every later abstract node prints its own text in place, in the class's abstract
 * environment (\LatexLibIndexTextNode). Until batch 4 each store replaced the one before, so only the last node's text printed
 * (at the first node's place) and every earlier one was lost (GitHub run batch 4 round 1, ieeetran-journal.A document
 * d159e2fc9d5d9a0575176, result f0d13d3c0b: of its five abs.ieee-indextext branches the four earlier ones never shipped and the
 * last passed; 612 sentinel:missing branches in each of the three IEEEtran pairs). The preamble's stores and the body's nodes
 * stand in the same (document) order.
 */
import type { Realization } from '../../../schema/realization.ts';
import { abstractBody } from '../node.ts';

/**
 * Where the node stands. After \maketitle (which lets itself to \relax, IEEEtran.cls l.4784) the class's display command, as the
 * sample writes it. Before any \maketitle (a document whose title comes later, or one with no title, which Flouest prints no
 * \maketitle for) the stored text is printed here and the store emptied, so the compsoc title area of a later \maketitle does not
 * print it again and a title-less compsoc paper does not lose its abstract (the interim abs.class-native's STORED_ABSTRACT_RELEASE
 * makes for the classes that keep the abstract for \maketitle).
 */
const INDEX_TEXT_HERE = String.raw`\makeatletter\providecommand*{\LatexLibIndexTextHere}{\ifx\maketitle\relax\expandafter\IEEEdisplaynontitleabstractindextext\else\expandafter\LatexLibIndexTextNow\fi}\providecommand*{\LatexLibIndexTextNow}{\@IEEEtitleabstractindextext\global\let\@IEEEtitleabstractindextext\relax}\providecommand\LatexLibIndexTextStore[1]{\IEEEtitleabstractindextext{#1}\long\gdef\LatexLibIndexTextStore##1{}}\providecommand\LatexLibIndexTextNode[1]{\ifx\LatexLibIndexTextShown\@undefined\gdef\LatexLibIndexTextShown{}\expandafter\@firstoftwo\else\expandafter\@secondoftwo\fi{\LatexLibIndexTextHere}{\begin{abstract}#1\end{abstract}}}\makeatother`;

export const realize = (_given: { readonly [name: string]: unknown } = {}): Realization => ({
  preamble: (_params, _parentType, node, content) =>
    node === undefined || content === undefined
      ? { declarations: ['\\providecommand*{\\LatexLibIndexTerms}{}', INDEX_TEXT_HERE] }
      : {
          declarations: ['\\providecommand*{\\LatexLibIndexTerms}{}', INDEX_TEXT_HERE, `\\LatexLibIndexTextStore{\\begin{abstract}\n${abstractBody(node, content)}\n\\end{abstract}\\LatexLibIndexTerms}`],
        },
  // The first node prints the stored text as the class places it (its own body, the argument, is dropped); a later one its own.
  emit: (node, content) => `\\LatexLibIndexTextNode{${abstractBody(node, content)}}\n\n`,
});

export default realize;
