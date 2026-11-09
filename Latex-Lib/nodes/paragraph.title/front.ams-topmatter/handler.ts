/**
 * front.ams-topmatter (paragraph/title). The AMS classes' top matter in the order their templates write it
 * (amsart-template.tex l.54-83, amsbook-template.tex l.66-94): \title, per author \author, \address and \email, the
 * paper's \thanks, \subjclass, \keywords, \date, \dedicatory, the class's optional tags, then \maketitle.
 * CTAN: https://ctan.org/pkg/amscls
 */
import { withDefaults } from '../../../schema/params.ts';
import type { Realization } from '../../../schema/realization.ts';
import { param } from '../../protocol.ts';
import { affiliationsOf, affiliationsOfAuthor, authorsOf, peopleOf, templateField, templateList } from '../node.ts';
import key from './key.ts';

export const realize = (given: { readonly [name: string]: unknown } = {}): Realization => {
  const p = withDefaults(key.params, given as never) as { readonly [name: string]: unknown };
  const tags = param(p, 'tags', 'amsart');
  return {
    // Everything in the body, where the title stands: the AMS templates set the top matter after \begin{document}, and
    // amsclass's tags only store their text until \maketitle (amsclass.dtx l.1266-1366, 1489-1522). The one preamble line mends
    // \contrib: it calls \@wraptoccontribs (l.1336) but the class defines \wraptoccontribs (l.1338), so under amsart 2020/05/29
    // v2.20.6 every \contrib stops at 'Undefined control sequence' (ZeroTeX-NG, 2026-11-07); \providecommand leaves a fixed class alone.
    preamble: () => (tags === 'amsbook' ? {} : { declarations: [String.raw`\makeatletter\providecommand*\@wraptoccontribs[2]{}\makeatother`] }),
    emit: (node, content) => {
      const affiliations = affiliationsOf(node);
      const shortTitle = templateField(node, 'shortTitle');
      const running = templateField(node, 'runningAuthor');
      const lines: string[] = [];
      if (p['frontmatter'] === true) lines.push('\\frontmatter');
      lines.push(shortTitle !== '' ? `\\title[${shortTitle}]{${content.trim()}}` : `\\title{${content.trim()}}`);
      authorsOf(node).forEach((a, i) => {
        // \author[short]{…} feeds \shortauthors, the left running head (l.1288-1295, 1611-1612); an empty optional argument adds
        // nothing to it. With a running author given, the first author carries it whole and the rest add nothing, so the head
        // reads exactly as given; without one, \author{…} gives each name, as the class does.
        lines.push(running === '' ? `\\author{${a.name}}` : i === 0 ? `\\author[${running}]{${a.name}}` : `\\author[]{${a.name}}`);
        // One \address per affiliation, repeated for a shared one: amsclass binds each \address to the \author before it (l.1282-1298, 1363).
        for (const f of affiliationsOfAuthor(a, affiliations)) lines.push(`\\address{${f.text}}`);
        if (a.email !== '') lines.push(`\\email{${a.email}}`);
      });
      // \thanks given on its own, never inside \author (a class error, l.1372-1377): a first-page footnote with no mark.
      const thanks = templateField(node, 'thanks', ' ');
      if (thanks !== '') lines.push(`\\thanks{${thanks}}`);
      const subject = templateField(node, 'subjectClass', '; ');
      if (subject !== '') lines.push(`\\subjclass[${param(p, 'subjclassEdition', '2020')}]{${subject}}`);
      const keywords = templateField(node, 'keywords', ', ');
      if (keywords !== '') lines.push(`\\keywords{${keywords}}`);
      // amsclass starts with an empty date (l.1489), so only a date the node gives is written; dateMode 'none' needs nothing.
      const { date } = peopleOf(node);
      if (date !== '') lines.push(`\\date{${date}}`);
      const dedication = templateField(node, 'dedication');
      if (dedication !== '') lines.push(`\\dedicatory{${dedication}}`);
      const communicated = templateField(node, 'communicatedBy');
      if (tags === 'amsart' && communicated !== '') lines.push(`\\commby{${communicated}}`);
      // A contributor as 'role: name' (\contrib[with an appendix by]{…}, l.1305-1319), or a name alone.
      if (tags !== 'amsbook') {
        for (const c of templateList(node, 'contributors')) {
          const at = c.indexOf(':');
          lines.push(at > 0 ? `\\contrib[${c.slice(0, at).trim()}]{${c.slice(at + 1).trim()}}` : `\\contrib{${c}}`);
        }
      }
      for (const t of templateList(node, 'translator')) lines.push(`\\translator{${t}}`);
      // \pagespan{first}{last} (l.1815): the first page number sets the page counter.
      const span = /^(-?\d+)\s*(?:-{1,3}|–|—)\s*(-?\d+)$/u.exec(templateField(node, 'pageSpan'));
      if (tags !== 'amsbook' && span !== null) lines.push(`\\pagespan{${span[1]}}{${span[2]}}`);
      return `${lines.join('\n')}\n\\maketitle\n\n`;
    },
  };
};

export default realize;
