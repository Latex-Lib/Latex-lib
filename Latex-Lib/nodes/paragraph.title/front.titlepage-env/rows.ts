/**
 * front.titlepage-env's template rows: the entries a template names in its `above`, `below` and `rows` parameters, and the value
 * each prints from the title node.
 */
import type { Subject } from '../../../schema/realization.ts';
import { affiliationsOf, peopleOf, templateField } from '../node.ts';

/**
 * A parameter's entries, separated by `;` or `,`: `field` or `Label=field` (`Supervisor=supervisor; 学~~~~~~~号=studentId`). A
 * label is LaTeX as the template writes it.
 */
export const entries = (spec: string): { readonly label: string; readonly field: string }[] =>
  spec
    .split(/[;,]/u)
    .map((s) => s.trim())
    .filter(Boolean)
    .map((s) => {
      const at = s.lastIndexOf('=');
      return at < 0 ? { label: '', field: s } : { label: s.slice(0, at).trim(), field: s.slice(at + 1).trim() };
    })
    .filter((e) => e.field !== '');

/**
 * A field's value as LaTeX text, or '': `authors` (the names), `date` (the node's date text), `affiliation` (each affiliation's
 * "department, name, address"), `affiliation.name`, `affiliation.department`, `affiliation.address` (each affiliation's, the
 * empty left out), `supervisor` (with templateSpecific.supervisorRank after it, "李四~教授"), and any other name a templateSpecific
 * field. A list is joined by `join`.
 */
export const fieldValue = (node: Subject, field: string, join: string): string => {
  const distinct = (values: readonly string[]): string => [...new Set(values.filter((v) => v !== ''))].join(join);
  switch (field) {
    case 'authors':
      return peopleOf(node).authors.join(join);
    case 'date':
      return peopleOf(node).date;
    case 'affiliation':
      return distinct(affiliationsOf(node).map((a) => a.text));
    case 'affiliation.name':
      return distinct(affiliationsOf(node).map((a) => a.name));
    case 'affiliation.department':
      return distinct(affiliationsOf(node).map((a) => a.department));
    case 'affiliation.address':
      return distinct(affiliationsOf(node).map((a) => a.address));
    case 'supervisor': {
      const [name, rank] = [templateField(node, 'supervisor'), templateField(node, 'supervisorRank')];
      return name === '' ? '' : rank === '' ? name : `${name}~${rank}`;
    }
    default:
      return templateField(node, field, join);
  }
};
