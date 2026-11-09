/**
 * front.sn-jnl (paragraph/title). Springer Nature's journal title block (sn-jnl.cls), all at the title's place before
 * \maketitle: \title[short]{full}, one \author[affiliation numbers]{\fnm{…} \sur{…}} per author with \email{…} (or \nomail),
 * \author* for the corresponding author, \affil[n]{\orgdiv{…}, \orgname{…}, \orgaddress{…}} with \affil* for the corresponding
 * author's, \keywords{…} and \pacs[scheme]{codes}.
 * Source: Springer Nature's LaTeX template (sn-article.tex, sn-jnl.cls), read through Template/template-requirement/Springer_Nature_SN_Jnl.md.
 */
import type { Realization, Subject } from '../../../schema/realization.ts';
import { affiliationNumber, affiliationsOf, affiliationsOfAuthor, authorsOf, templateField, templateList } from '../node.ts';
import { subjectClassesOf } from './records.ts';

/** \fnm{given names} \sur{surname}: the name less its last word, and its last word (cls l.520-526); one word is a surname alone. */
const nameParts = (name: string): string => {
  const words = name.split(/\s+/u).filter(Boolean);
  const surname = words.pop() ?? name;
  return words.length === 0 ? `\\sur{${surname}}` : `\\fnm{${words.join(' ')}} \\sur{${surname}}`;
};

const front = (node: Subject, content: string): string => {
  const title = content.trim();
  const affiliations = affiliationsOf(node);
  const authors = authorsOf(node);
  const lines: string[] = [];
  // \title[short]{full}: the short form goes only to \markboth (cls l.463-466), so it is written only when the paper gives one.
  const shortTitle = templateField(node, 'shortTitle');
  lines.push(`\\title${shortTitle === '' ? '' : `[${shortTitle}]`}{${title}}`);
  // The corresponding authors, by name or email (templateSpecific.correspondingAuthor, one or several), take \author*
  // ("to be used for the corresponding author", manual section 6; requirement line 47).
  const corresponding = templateList(node, 'correspondingAuthor');
  const isCorresponding = (name: string, email: string): boolean => corresponding.includes(name) || (email !== '' && corresponding.includes(email));
  for (const a of authors) {
    // \author[1,2]{…}: "sequential Arabic numerals in the optional argument", the author's affiliations' numbers in the title's
    // list, as \affil[n] below gives them. No ORCID: \orcid includes Orcidlogo.eps, which the publisher's zip does not ship
    // (cls l.1796-1800; requirement line 132). \nomail for an author with no e-mail (manual section 6).
    const numbers = affiliationsOfAuthor(a, affiliations).map((f) => affiliationNumber(f, affiliations));
    const star = isCorresponding(a.name, a.email) ? '*' : '';
    lines.push(`\\author${star}${numbers.length === 0 ? '' : `[${numbers.join(',')}]`}{${nameParts(a.name)}}${a.email === '' ? '\\nomail' : `\\email{${a.email}}`}`);
  }
  // \affil[n]{\orgdiv{…}, \orgname{…}, \orgaddress{…}} (cls l.600-607), empty parts left out; \affil* on the corresponding
  // author's first affiliation, as the template stars the first author's (main.tex l.73).
  const lead = authors.find((a) => isCorresponding(a.name, a.email));
  const starred = lead === undefined ? undefined : affiliationsOfAuthor(lead, affiliations)[0]?.id;
  for (const f of affiliations) {
    const parts = [['orgdiv', f.department], ['orgname', f.name], ['orgaddress', f.address]].filter(([, v]) => v !== '').map(([c, v]) => `\\${c}{${v}}`);
    lines.push(`\\affil${f.id === starred ? '*' : ''}[${affiliationNumber(f, affiliations)}]{${parts.join(', ')}}`);
  }
  // \keywords and \pacs only store their text, which \maketitle prints after the abstract (cls l.644-645, 677); after
  // \maketitle they are lost (cls l.816-826), so they come before it.
  const keywords = templateList(node, 'keywords');
  if (keywords.length > 0) lines.push(`\\keywords{${keywords.join(', ')}}`);
  for (const g of subjectClassesOf(node)) lines.push(`\\pacs${g.scheme === '' ? '' : `[${g.scheme}]`}{${g.codes}}`);
  return lines.join('\n');
};

export const realize = (): Realization => ({
  // \email prints through \textcolor{blue} (cls l.540, 545) and the class never loads xcolor or color: the template loads
  // xcolor itself (sn-article.tex l.50; main.tex l.19).
  preamble: () => ({ packages: ['\\usepackage{xcolor}'] }),
  // Everything in the body at the title's place: \maketitle prints the stored abstract (abs.class-native's \abstract{}
  // command) and keywords, then sets \title and \author to \relax (cls l.632-645, 760-761, 816-826). No \date: the class's
  // title block prints none.
  emit: (node, content) => `${front(node, content)}\n\\maketitle\n\n`,
});

export default realize;
