/**
 * cite/cite's ways: way id to handler. A handler turns its parameters (a preset) into Flouest's `Realization`.
 */
import type { Realization } from '../../schema/realization.ts';
import way0 from './bib.biblatex-bibtex/handler.ts';
import way1 from './bib.biblatex-biber/handler.ts';
import way2 from './bib.bibtex-bst/handler.ts';
import way3 from './bib.natbib/handler.ts';
import way4 from './bib.cite-pkg/handler.ts';
import way5 from './bib.apacite/handler.ts';
import way6 from './bib.thebibliography/handler.ts';
import w_bib_class_bst from './bib.class-bst/handler.ts';
import w_bib_gbt7714 from './bib.gbt7714/handler.ts';
import w_bib_named from './bib.named/handler.ts';

export type Handler = (params?: { readonly [name: string]: unknown }) => Realization;

export const HANDLERS: { readonly [way: string]: Handler } = {
  'bib.biblatex-bibtex': way0,
  'bib.biblatex-biber': way1,
  'bib.bibtex-bst': way2,
  'bib.natbib': way3,
  'bib.cite-pkg': way4,
  'bib.apacite': way5,
  'bib.thebibliography': way6,
  'bib.class-bst': w_bib_class_bst,
  'bib.gbt7714': w_bib_gbt7714,
  'bib.named': w_bib_named,
};
