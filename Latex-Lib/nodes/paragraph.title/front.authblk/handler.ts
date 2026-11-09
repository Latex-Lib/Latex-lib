/**
 * front.authblk (paragraph/title). authblk's author blocks: \author[1,2]{…} per author and \affil[n]{…} per
 * affiliation before \maketitle; under ascelike (which loads authblk itself) the emails in the affiliations, the
 * class's \KeyWords after the abstract and its \NameTag.
 * CTAN: https://ctan.org/pkg/authblk
 *
 * The forms are the templates': \usepackage[max6]{authblk}, \author{…} \author{…} \affil{…} under article
 * (Source/0653-gerhardt-academic-paper/main.tex l.46, 56-58), \author[1]{…} \author[2]{…} \affil[1]{…. E-mail: …}
 * \affil[2]{…}, then \maketitle, the abstract and \KeyWords{…; …} under ascelike (Source/0339-asce-style-engineering-
 * manuscript/main.tex l.22, 31-44; Latex-Template-Examples/class.ascelike/main.tex l.57-77). Never \thanks or \and:
 * authblk collects the lists itself (0339 l.28-30).
 */
import { withDefaults } from '../../../schema/params.ts';
import type { Realization, Subject } from '../../../schema/realization.ts';
import { dataOf, param } from '../../protocol.ts';
import { affiliationNumber, affiliationsOf, affiliationsOfAuthor, authorsOf, peopleOf, templateField, templateList } from '../node.ts';
import key from './key.ts';

const PACKAGE: { readonly [v: string]: string } = { load: '\\usepackage{authblk}', max6: '\\usepackage[max6]{authblk}' };

export const lines = (node: Subject, content: string, p: { readonly [name: string]: unknown }): string[] => {
  const authors = authorsOf(node);
  const affiliations = affiliationsOf(node);
  // One affiliation: unnumbered \author{…} and \affil{…}, as 0653 writes them (authblk then sets no marks).
  const numbered = affiliations.length > 1;
  const out = [`\\title{${content.trim()}}`];
  for (const a of authors) {
    const n = numbered ? affiliationsOfAuthor(a, affiliations).map((x) => affiliationNumber(x, affiliations)) : [];
    out.push(`\\author${n.length > 0 ? `[${n.join(',')}]` : ''}{${a.name}}`);
  }
  for (const [i, aff] of affiliations.entries()) {
    // in-affil: each author's email after their first affiliation (". Email: …", the ASCE form); an author with none is left out.
    const emails = param(p, 'emails') === 'in-affil' ? authors.filter((a) => a.email !== '' && affiliationsOfAuthor(a, affiliations)[0]?.id === aff.id).map((a) => a.email) : [];
    out.push(`\\affil${numbered ? `[${i + 1}]` : ''}{${aff.text}${emails.length > 0 ? `. Email: ${emails.join(', ')}` : ''}}`);
  }
  const { date } = peopleOf(node);
  // The date as front.maketitle prints it: \date{} when the node asks for none (dateMode 'none'), else the node's text.
  if (dataOf(node)['dateMode'] === 'none') out.push('\\date{}');
  else if (date !== '') out.push(`\\date{${date}}`);
  return out;
};

export const realize = (given: { readonly [name: string]: unknown } = {}): Realization => {
  const p = withDefaults(key.params, given as never) as { readonly [name: string]: unknown };
  const pkg = PACKAGE[param(p, 'authblk', 'load')];
  return {
    // ascelike's \NameTag in the preamble, where 0339 has it (l.22): it makes a length (\newlength{\LeftFootSpace}), so it runs once.
    preamble: (_params, _parentType, node) => {
      const tag = p['nameTag'] === true && node !== undefined ? templateField(node, 'nameTag') : '';
      return { ...(pkg === undefined ? {} : { packages: [pkg] }), ...(tag === '' ? {} : { declarations: [`\\NameTag{${tag}}`] }) };
    },
    emit: (node, content) => {
      // The keywords as ascelike prints them, \KeyWords{a; b; c} (0339 l.44): a one-shot hook so the line follows the next
      // abstract wherever the paper has it (the class example puts it right after \end{abstract}), or after the title.
      const keywords = templateList(node, 'keywords').join('; ');
      const at = param(p, 'keywords', 'none');
      const hook = keywords !== '' && at === 'after-abstract' ? [`\\AddToHookNext{env/abstract/after}{\\KeyWords{${keywords}}}`] : [];
      const after = keywords !== '' && at === 'after-title' ? `\\KeyWords{${keywords}}\n\n` : '';
      return `${[...lines(node, content, p), ...hook].join('\n')}\n\\maketitle\n\n${after}`;
    },
  };
};

export default realize;
