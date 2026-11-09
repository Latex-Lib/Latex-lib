/**
 * front.ut-thesis (paragraph/title). The University of Toronto thesis class's SGS title page: \title, \author, the
 * class's \degree, \department[prefix]{unit}, \gradyear and \copyrighttext, then \maketitle, which prints them all on a
 * page of its own. No \date: the default copyright line prints the graduation year. The declarations go in the preamble, because the
 * class's abstract prints the title, author, degree, unit and year above itself (\meaning\abstract on the engine's
 * ut-thesis 2024/07/26 v3.1.8), so they must be set before an abstract wherever it stands.
 * CTAN: https://ctan.org/pkg/ut-thesis
 */
import { withDefaults } from '../../../schema/params.ts';
import type { Realization, Subject } from '../../../schema/realization.ts';
import { param } from '../../protocol.ts';
import { affiliationsOf, affiliationsOfAuthor, authorsOf, peopleOf, templateField } from '../node.ts';
import key from './key.ts';

/** The class's own prefix (\department's optional argument defaults to it: "\@protected@testopt \department \\department {Department of}"). */
const CLASS_PREFIX = 'Department of';

/**
 * The authors as one line of prose: "A", "A and B". ut-thesis's \maketitle and abstract set {\@author} in a center
 * environment, not inside a tabular, so the kernel's \and has no tabular to close.
 */
const joinNames = (names: readonly string[]): string =>
  names.length <= 1 ? (names[0] ?? '') : `${names.slice(0, -1).join(', ')} and ${names[names.length - 1] ?? ''}`;

/** The graduate unit: the first author's first affiliation's department, else its name; '' when there is none. */
const unitOf = (node: Subject): string => {
  const affiliations = affiliationsOf(node);
  const first = authorsOf(node)[0];
  const own = first === undefined ? [] : affiliationsOfAuthor(first, affiliations);
  const where = own[0] ?? affiliations[0];
  return where === undefined ? '' : where.department || where.name;
};

export const realize = (given: { readonly [name: string]: unknown } = {}): Realization => {
  const p = withDefaults(key.params, given as never) as { readonly [name: string]: unknown };
  const prefix = param(p, 'departmentPrefix', CLASS_PREFIX);
  return {
    preamble: (_params, _parentType, node, content) => {
      if (node === undefined || content === undefined) return {};
      const { authors, date } = peopleOf(node);
      // The paper's own values before the template's constant ones; a value neither gives is left to the class, whose
      // placeholder ("(degree)", "(gradyear)") then shows on the page.
      const degree = templateField(node, 'degree') || param(p, 'degree');
      // The year of graduation, else the node's date when it is a year alone (the page prints no other date).
      const year = templateField(node, 'gradYear') || (/^\d{4}$/u.test(date) ? date : '');
      const copyright = templateField(node, 'copyrightText');
      // A department written in full ("Department of Engines") loses the prefix the class prints before it, which
      // would otherwise read "Department of Department of Engines".
      const full = unitOf(node);
      const unit = prefix !== '' && full.toLowerCase().startsWith(`${prefix.toLowerCase()} `) ? full.slice(prefix.length + 1).trim() : full;
      return {
        declarations: [
          `\\title{${content.trim()}}`,
          ...(authors.length === 0 ? [] : [`\\author{${joinNames(authors)}}`]),
          ...(degree === '' ? [] : [`\\degree{${degree}}`]),
          ...(unit === '' ? [] : [`\\department${prefix === CLASS_PREFIX ? '' : `[${prefix}]`}{${unit}}`]),
          ...(year === '' ? [] : [`\\gradyear{${year}}`]),
          ...(copyright === '' ? [] : [`\\copyrighttext{${copyright}}`]),
        ],
      };
    },
    emit: () => '\\maketitle\n\n',
  };
};

export default realize;
