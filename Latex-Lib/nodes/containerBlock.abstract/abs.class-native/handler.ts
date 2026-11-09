/**
 * abs.class-native (containerBlock/abstract). The class's own abstract, unstyled: \begin{abstract} … \end{abstract} as acmart, IEEEtran or elsarticle print it, or \abstract{…} in the preamble where the class makes it a command that \maketitle prints (sn-jnl, mdpi, aa, apa7, oup-authoring-template), or jss's \Abstract{…}.
 * CTAN: https://ctan.org/pkg/latex-base
 */
import { withDefaults } from '../../../schema/params.ts';
import type { Realization } from '../../../schema/realization.ts';
import { param } from '../../protocol.ts';
import { abstractBody, CLASS_ABSTRACT_HERE, STORED_ABSTRACT_RELEASE } from '../node.ts';
import key from './key.ts';

// The command form hands \abstract a \protected macro holding the body, not the body itself: aa expands its argument at once to
// count its words (\protected@xdef, aa.cls l.839, and \protected@edef, l.619), and mdpi tests it with ifthen's \equal (an edef,
// mdpi.cls l.1254) and passes it to pdfsubject (l.559-561), so a fragile command in the body (marginnote's \marginnote, enumitem's
// lists, \vspace, tabbing) broke while expanding: "Incomplete \iffalse" at the line after the \abstract (aa.A, GitHub run
// 41584963423: 18 documents, all under this form; e.g. d837f06185e6661a6a354 result 194c40e12e47, l.40), "Paragraph ended before
// \def", "\enit@enditemize" and input stack size at \begin{document} (mdpi.A: de0fffa1d01adfd4c562d, d214ca174b73463a0e1d3,
// d7b38cdc22c6c4a317785). A \protected macro is left alone by every edef; it expands where the class prints the abstract. sn-jnl
// only stores it (sn-jnl.cls l.632). The last \abstract still wins, as before: each class keeps one abstract. An empty body stays
// \abstract{}: mdpi prints its abstract block only when ifthen's \equal finds \@abstract non-empty (l.1254), which a macro always is.
//
// The same holds for apa7's \long\def\abstract#1 (apa7.cls l.785) and for oup-authoring-template's \abstract, which is not \long
// (\def\abstract#1, oup-authoring-template.cls l.1205): its one argument is the macro, never the body, so a body of several
// paragraphs passes (a \def's replacement text may hold \par; only a non-\long argument may not) and needs no \endgraf (probe:
// two paragraphs under [webpdf,contemporary,large], ZeroTeX-NG, 2026-11-07, ok). jss's command is \Abstract (`command`), a
// \newcommand that stores its argument for the title block the class prints itself at \begin{document} (jss.cls l.92, 352-354, 471).
const commandForm = (content: string, command = 'abstract'): string => {
  const body = content.trim();
  return body === '' ? `\\${command}{}` : `\\protected\\def\\libClassAbstract{${body}}\\${command}{\\libClassAbstract}`;
};

export const realize = (given: { readonly [name: string]: unknown } = {}): Realization => {
  const p = withDefaults(key.params, given as never) as { readonly [name: string]: unknown };
  return {
    // The command form also prints its body where the node stands, under sn-jnl and aa when the document has no title and
    // always under mdpi, whose own print after the preamble is emptied (CLASS_ABSTRACT_HERE, b23 PG-4); the environment
    // form's abstract a class keeps for \maketitle is printed where it stands
    // (STORED_ABSTRACT_RELEASE). Both are b22's interim forms for Flouest's one \maketitle after all front matter (revtex O3).
    // jss's \Abstract (command 'Abstract') needs no print in place: the class prints its title block, abstract included, at every
    // \begin{document} (\maketitle at begindocument/end, jss.cls l.471), title or none; so nothing in the body.
    preamble: (_params, _parentType, node, content) =>
      param(p, 'form') === 'command'
        ? node !== undefined && content !== undefined
          ? { declarations: param(p, 'command', 'abstract') === 'Abstract' ? [commandForm(content, 'Abstract')] : [commandForm(content), CLASS_ABSTRACT_HERE] }
          : {}
        : { declarations: [STORED_ABSTRACT_RELEASE] },
    emit: (node, content, context, parentType) =>
      param(p, 'form') === 'command'
        ? content.trim() === '' || param(p, 'command', 'abstract') === 'Abstract'
          ? ''
          : `\\LatexLibClassAbstractHere{${content.trim()}}\n\n`
        : `\\begin{abstract}\n${abstractBody(node, content)}\n\\end{abstract}\n\n`,
  };
};

export default realize;
