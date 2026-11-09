/**
 * front.corl (paragraph/title): CoRL's title block (article with corl_2026.sty). In the body, at the title's place: \title{…},
 * then \author{…} as CoRL's example paper writes it (Latex-Template-Examples/class.corl/main.tex l.68-78): the names, each with
 * its affiliations' numbers as $^{n}$, joined by \quad; a line per affiliation, $^{n}$department, name, address; a line of the
 * e-mails in \texttt; then the style's own \maketitle (corl_2026.sty l.342-362). The keywords go through the style's \keywords
 * (l.378), which the example writes right after \end{abstract} (main.tex l.84-91): the title cannot write there, so the kernel's
 * env/abstract/after hook does, once (as front.siam); with keywordsPlace 'after-title' they follow \maketitle instead.
 * corl_2026.sty is not in this checkout (testing-pipeline/settings/classes/files has no copy), so the form is the example's.
 */
import { withDefaults } from '../../../schema/params.ts';
import type { Realization, Subject } from '../../../schema/realization.ts';
import { param } from '../../protocol.ts';
import { affiliationNumber, affiliationsOf, affiliationsOfAuthor, authorsOf, templateList } from '../node.ts';
import key from './key.ts';

export const realize = (given: { readonly [name: string]: unknown } = {}): Realization => {
  const p = withDefaults(key.params, given as never) as { readonly [name: string]: unknown };
  const form = param(p, 'authorForm', 'lines');
  const place = param(p, 'keywordsPlace', 'after-abstract');

  /** The example's form: names with $^{n}$ marks joined by \quad, then the numbered affiliation lines, then the e-mails. */
  const lines = (node: Subject): string => {
    const authors = authorsOf(node);
    const affiliations = affiliationsOf(node);
    // Marks only when they tell affiliations apart (two or more), and only when the paper wants them.
    const marked = p['affiliationMarks'] !== false && affiliations.length > 1;
    const names = authors.map((a) => {
      const marks = marked ? affiliationsOfAuthor(a, affiliations).map((f) => affiliationNumber(f, affiliations)) : [];
      return `${a.name}${marks.length === 0 ? '' : `$^{${marks.join(',')}}$`}`;
    });
    const affiliationLines = affiliations.map((f, i) => `${marked ? `$^{${i + 1}}$` : ''}${f.text}`);
    const emails = authors.filter((a) => a.email !== '').map((a) => `\\texttt{${a.email}}`);
    return [names.join(' \\quad '), ...affiliationLines, ...(emails.length === 0 ? [] : [emails.join(', ')])].map((l) => `  ${l}`).join(' \\\\\n');
  };

  /**
   * One block per author, joined by \And, as NeurIPS's style writes them (neurips_2026.sty l.344-348): name, the affiliation's
   * department, name and address, the e-mail in \texttt, each on a line. Only where corl_2026.sty's \@maketitle defines \And
   * (unconfirmed: the key requires cmd:\And for it, which the corl profile does not list).
   */
  const blocks = (node: Subject): string => {
    const affiliations = affiliationsOf(node);
    return authorsOf(node)
      .map((a) => {
        const parts = [a.name, ...affiliationsOfAuthor(a, affiliations).flatMap((f) => [f.department, f.name, f.address].filter(Boolean)), ...(a.email === '' ? [] : [`\\texttt{${a.email}}`])];
        return `  ${parts.join(' \\\\\n  ')}`;
      })
      .join('\n  \\And\n');
  };

  const keywordsLine = (node: Subject): string => {
    const keywords = templateList(node, 'keywords').join(', ');
    return keywords === '' ? '' : `\\keywords{${keywords}}`;
  };

  return {
    preamble: (_params, _parentType, node) => {
      if (node === undefined || place !== 'after-abstract') return {};
      const line = keywordsLine(node);
      // Once, right after the next \end{abstract}; with no abstract environment in the document the keywords are not printed.
      return line === '' ? {} : { declarations: [`\\AddToHookNext{env/abstract/after}{${line}}`] };
    },
    emit: (node, content) => {
      const authors = authorsOf(node).length === 0 ? '' : `\\author{\n${form === 'blocks' ? blocks(node) : lines(node)}\n}\n`;
      const after = place === 'after-title' ? keywordsLine(node) : '';
      return `\\title{${content.trim()}}\n${authors}\\maketitle\n${after === '' ? '' : `${after}\n`}\n`;
    },
  };
};

export default realize;
