/**
 * doc's ways (`DOC_NODE`): the document-level ways, attached to no Flouest node: a template's own switches and constants
 * (a camera-ready switch, a journal's name, a theme), printed in the preamble from the way's parameters, which are the
 * template's. A value that changes from paper to paper is the title's instead (`templateSpecific`).
 */
import type { Realization } from '../../schema/realization.ts';
import w_doc_acm_rights from './doc.acm-rights/handler.ts';
import w_doc_book_matter from './doc.book-matter/handler.ts';
import w_doc_class_setup from './doc.class-setup/handler.ts';
import w_doc_frontiers_manuscript from './doc.frontiers-manuscript/handler.ts';
import w_doc_generic_packages from './doc.generic-packages/handler.ts';
import w_doc_ieee from './doc.ieee/handler.ts';
import w_doc_journal_meta from './doc.journal-meta/handler.ts';
import w_doc_koma_options from './doc.koma-options/handler.ts';
import w_doc_minimal_provide from './doc.minimal-provide/handler.ts';
import w_doc_page_headers from './doc.page-headers/handler.ts';
import w_doc_style_mode from './doc.style-mode/handler.ts';
import w_doc_theme from './doc.theme/handler.ts';

export type Handler = (params?: { readonly [name: string]: unknown }) => Realization;

export const HANDLERS: { readonly [way: string]: Handler } = {
  'doc.acm-rights': w_doc_acm_rights,
  'doc.book-matter': w_doc_book_matter,
  'doc.class-setup': w_doc_class_setup,
  'doc.frontiers-manuscript': w_doc_frontiers_manuscript,
  'doc.generic-packages': w_doc_generic_packages,
  'doc.ieee': w_doc_ieee,
  'doc.journal-meta': w_doc_journal_meta,
  'doc.koma-options': w_doc_koma_options,
  'doc.minimal-provide': w_doc_minimal_provide,
  'doc.page-headers': w_doc_page_headers,
  'doc.style-mode': w_doc_style_mode,
  'doc.theme': w_doc_theme,
};
