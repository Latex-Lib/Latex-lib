/**
 * front.koma-title: KOMA-Script's title fields around \title, \author and
 * \date: \subject above the title, \subtitle under it, \titlehead at the
 * top, \publishers at the foot; titlepage=true or false through
 * \KOMAoptions; the title's font through \addtokomafont{title}. The title
 * pages' own parts: a half-title (\extratitle), the back of the title page
 * (\uppertitleback, \lowertitleback) and \dedication (scrkernel-title.dtx
 * l.225-270), and the authors' affiliation and e-mail under each name or in a
 * \thanks. KOMA classes only.
 * CTAN: https://ctan.org/pkg/koma-script
 */
import { withDefaults } from '../../../schema/params.ts';
import type { Realization, Subject } from '../../../schema/realization.ts';
import { param } from '../../protocol.ts';
import { affiliationsOf, affiliationsOfAuthor, authorsOf, templateField, titleLinesWith } from '../node.ts';
import key from './key.ts';

/**
 * The \author line with each author's affiliations and e-mail: on lines under the name (KOMA sets each author in a
 * centred tabular, so \\ breaks it), or in a \thanks footnote. Nothing when no author has a record (a string author).
 */
const authorLine = (node: Subject, notes: string): string | undefined => {
  const affiliations = affiliationsOf(node);
  const authors = authorsOf(node);
  if (authors.length === 0) return undefined;
  const each = authors.map((a) => {
    const where = affiliationsOfAuthor(a, affiliations).map((f) => f.text);
    const email = a.email === '' ? [] : [`\\texttt{${a.email}}`];
    if (notes === 'thanks') {
      const note = [where.join('; '), ...email].filter(Boolean).join('. ');
      return note === '' ? a.name : `${a.name}\\thanks{${note}}`;
    }
    const lines = [...where, ...email];
    // Each line is a row of KOMA's tabular, a group of its own, so \small is set on each: a brace group around the rows stops
    // at "Missing } inserted" (scrartcl, ZeroTeX-NG, 2026-11-07).
    return lines.length === 0 ? a.name : [a.name, ...lines.map((l) => `\\small ${l}`)].join('\\\\ ');
  });
  return `\\author{${each.join(' \\and ')}}`;
};

export const realize = (given: { readonly [name: string]: unknown } = {}): Realization => {
  const p = withDefaults(key.params, given as never) as { readonly [name: string]: unknown };
  const field = (name: string, command: string): string[] => (param(p, name) === '' ? [] : [`\\${command}{${param(p, name)}}`]);
  const notes = param(p, 'authorNotes', 'none');
  return {
    preamble: (_params, _parentType, node, content) => {
      if (node === undefined || content === undefined) return {};
      // The paper's own subtitle and dedication (templateSpecific) before the template's constant subtitle.
      const subtitle = templateField(node, 'subtitle') || param(p, 'subtitle');
      const dedication = templateField(node, 'dedication');
      const authors = notes === 'none' ? undefined : authorLine(node, notes);
      const title = titleLinesWith(node, content, param(p, 'date', 'given')).map((l) => (authors !== undefined && l.startsWith('\\author{') ? authors : l));
      return {
        declarations: [
          ...(param(p, 'titlePage', 'class') === 'class' ? [] : [`\\KOMAoptions{titlepage=${param(p, 'titlePage')}}`]),
          ...(param(p, 'titleFont') === '' ? [] : [`\\addtokomafont{title}{${param(p, 'titleFont')}}`]),
          ...field('titlehead', 'titlehead'),
          ...field('subject', 'subject'),
          ...title,
          ...(subtitle === '' ? [] : [`\\subtitle{${subtitle}}`]),
          ...field('publishers', 'publishers'),
          // Printed by \maketitle only on title pages (scrkernel-title.dtx l.444-451, 500-520): under scrartcl with titlepage=true.
          ...field('extratitle', 'extratitle'),
          ...field('uppertitleback', 'uppertitleback'),
          ...field('lowertitleback', 'lowertitleback'),
          ...(dedication === '' ? [] : [`\\dedication{${dedication}}`]),
        ],
      };
    },
    emit: () => '\\maketitle\n\n',
  };
};

export default realize;
