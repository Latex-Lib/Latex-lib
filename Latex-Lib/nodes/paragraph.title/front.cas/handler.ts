/**
 * front.cas (paragraph/title). Elsevier's CAS title block (cas-sc, cas-dc over cas-common.sty), all at the title's place
 * before \maketitle: \shorttitle and \shortauthors, \title[mode=title]{…} (and a subtitle as a second \title), keyed
 * \author[affiliation numbers]{name}[orcid=…] with \cormark, \ead and \credit, \affiliation[n]{organization=…,
 * addressline=…}, \cortext, \nonumnote, the highlights and the keywords box with \sep and \MSC, \JEL, \PACS.
 * CTAN: https://ctan.org/pkg/els-cas-templates
 */
import { withDefaults } from '../../../schema/params.ts';
import type { Realization, Subject } from '../../../schema/realization.ts';
import { param } from '../../protocol.ts';
import { affiliationNumber, affiliationsOf, affiliationsOfAuthor, authorsOf, templateField, templateList } from '../node.ts';
import key from './key.ts';
import { creditOf, highlightsOf } from './records.ts';

const front = (node: Subject, content: string, subtitleMode: string): string => {
  const title = content.trim();
  const affiliations = affiliationsOf(node);
  const authors = authorsOf(node);
  const lines: string[] = [];
  // Without them every page's head and foot keep the class's placeholders, "Short Title of the Article" and "First Author
  // et al." (cas-common.sty l.2390-2394). The short author list falls back to the first author's surname and "et al.".
  const first = authors[0];
  const surname = first === undefined ? '' : (first.name.split(/\s+/u).pop() ?? first.name);
  const shortAuthors = templateField(node, 'runningAuthor') || (authors.length > 1 ? `${surname} et al.` : (first?.name ?? ''));
  lines.push(`\\shorttitle{${templateField(node, 'shortTitle') || title}}`, `\\shortauthors{${shortAuthors}}`);
  // [mode=title] gives the title its \LARGE and its title-note stars (cas-common.sty l.50-63, 146-170); the subtitle is a second
  // \title in a smaller mode (sub, alt or trans, l.64-100), printed under it in order.
  const titleNote = templateField(node, 'titleNote');
  lines.push(`\\title[mode=title]{${title}}${titleNote === '' ? '' : '\\tnotemark[1]'}`);
  const subtitle = templateField(node, 'subtitle');
  // Each \title also sets \casprelimstitle, the title the highlights and graphical-abstract pages print (l.146-148), so after
  // the subtitle's it is set back to the title: else those pages head with the subtitle (cas-dc, ZeroTeX-NG, 2026-11-07).
  if (subtitle !== '') lines.push(`\\title[mode=${subtitleMode}]{${subtitle}}`, `\\csgdef{casprelimstitle}{${title}}`);
  if (titleNote !== '') lines.push(`\\tnotetext[1]{${titleNote}}`);
  // The corresponding authors, by name or email (templateSpecific.correspondingAuthor, one or several), share mark 1 and its
  // \cortext (cas-common.sty l.234, 587-625).
  const corresponding = templateList(node, 'correspondingAuthor');
  const isCorresponding = (name: string, email: string): boolean => corresponding.includes(name) || (email !== '' && corresponding.includes(email));
  for (const a of authors) {
    // \author[1,2]{Name}[orcid=…] (l.895): the numbers are the author's affiliations' in the title's list, as \affiliation[n] below
    // gives them (a number, not a label starting with a, takes \processAffNum, l.288); the key list only with an ORCID.
    const numbers = affiliationsOfAuthor(a, affiliations).map((f) => affiliationNumber(f, affiliations));
    lines.push(`\\author[${numbers.join(',')}]{${a.name}}${a.orcid === '' ? '' : `[orcid=${a.orcid}]`}`);
    if (isCorresponding(a.name, a.email)) lines.push('\\cormark[1]');
    if (a.email !== '') lines.push(`\\ead{${a.email}}`);
    // \credit writes the roles to the .aux for \printcredits (l.443-468); nothing prints them on the title page.
    const credit = creditOf(node, a.name);
    if (credit !== '') lines.push(`\\credit{${credit}}`);
  }
  // \affiliation[n]{organization=…, addressline=…} (l.1252, keys l.1118-1162): the department and the name are the
  // organisation, the address its line; each value braced, so its commas stay in it.
  for (const f of affiliations) {
    const keys = [...([f.department, f.name].some(Boolean) ? [`organization={${[f.department, f.name].filter(Boolean).join(', ')}}`] : []), ...(f.address === '' ? [] : [`addressline={${f.address}}`])];
    lines.push(`\\affiliation[${affiliationNumber(f, affiliations)}]{${keys.join(', ')}}`);
  }
  if (authors.some((a) => isCorresponding(a.name, a.email))) lines.push('\\cortext[1]{Corresponding author}');
  const nonumNote = templateField(node, 'nonumNote');
  if (nonumNote !== '') lines.push(`\\nonumnote{${nonumNote}}`);
  // The highlights box, which cas's \maketitle prints on its own page (l.1572-1584; cas-dc.cls l.98-131).
  const highlights = highlightsOf(node);
  if (highlights.length > 0) lines.push('\\begin{highlights}', ...highlights.map((h) => `\\item ${h}`), '\\end{highlights}');
  // The keywords box beside the abstract ("ARTICLE INFO"), keywords separated by \sep, the classification codes inside it
  // (l.1599-1623). The box is printed only by \maketitle, so it comes before it.
  const keywords = templateList(node, 'keywords');
  const codes = [['MSC', templateField(node, 'msc')], ['JEL', templateField(node, 'jel')], ['PACS', templateField(node, 'pacs')]].filter(([, v]) => v !== '').map(([c, v]) => `\\${c}{${v}}`);
  if (keywords.length > 0 || codes.length > 0) lines.push('\\begin{keywords}', ...(keywords.length > 0 ? [keywords.join(' \\sep ')] : []), ...codes, '\\end{keywords}');
  return lines.join('\n');
};

export const realize = (given: { readonly [name: string]: unknown } = {}): Realization => {
  const p = withDefaults(key.params, given as never) as { readonly [name: string]: unknown };
  return {
    // Everything goes in the body at the title's place, as the CAS templates write it (preamble.tpl l.57-102). cas's abstract
    // environment writes \jobname.abs, which \maketitle reads back (cas-common.sty l.1547-1553, 1811-1814), so an abstract
    // node after the title is on no title page: the profile's heldByMaketitle, as for front.class-native. No \date: cas never
    // prints one.
    // The email line's label: with the default, the class's nologo key (stm / mktitle, cas-common.sty l.1723-1733, the key
    // \pprintMaketitle[nologo] sets) prints "Email address:" in words. Its icon form includes thumbnails/cas-email.jpeg
    // (l.380-386), which the engine's els-cas-templates install does not supply: every author's \ead stopped at "Unable to load
    // picture or PDF file 'thumbnails/cas-email.jpeg'" (cas-dc and cas-sc, ZeroTeX-NG, 2026-11-07); the icon preset is for a
    // template whose bundle carries Elsevier's thumbnails/ folder.
    preamble: () => (param(p, 'emailLabel', 'text') === 'text' ? { declarations: [String.raw`\ExplSyntaxOn\keys_set:nn{stm/mktitle}{nologo}\ExplSyntaxOff`] } : {}),
    emit: (node, content) => `${front(node, content, param(p, 'subtitleMode', 'sub'))}\n\\maketitle\n\n`,
  };
};

export default realize;
