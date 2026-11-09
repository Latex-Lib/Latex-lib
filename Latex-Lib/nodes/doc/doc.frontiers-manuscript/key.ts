import { defineKey } from '../../../schema/key.ts';
import { minimal } from '../../../schema/minimal.ts';
import { PRESETS } from './presets.ts';

export default defineKey(
  minimal({
    id: 'doc.frontiers-manuscript',
    node: 'doc',
    description:
      "Frontiers' (FrontiersinHarvard) manuscript form: the whole document in one column from the first page, against the class's \\twocolumn, and the first page's number, \\AtBeginDocument{\\onecolumn\\firstpage{1}}, as the template's \\onecolumn \\firstpage{1} right after \\begin{document}.",
    writes: '\\AtBeginDocument{\\onecolumn\\firstpage{…}}',
    ctan: [],
    features: ['class-styled'],
    params: {
      columns: { type: 'enum', values: ['one', 'two'], default: 'two', compat: true, description: "one column from the first page (\\onecolumn, the template's manuscript form), or the class's two (nothing printed)" },
      firstPage: { type: 'number', default: 0, description: 'the first page number, \\firstpage{n}, which also starts the page range; 0 prints none (the class starts at 1)' },
    },
    presets: PRESETS,
    requires: ['cmd:\\firstpage'],
    only: ['class.frontiers'],
    // Typeset ok (ZeroTeX-NG, 2026-11-07) under FrontiersinHarvard.cls v2.6 [utf8] (the profile's digest, from Source/0757-frontiers),
    // with the setting's \firstAuthorLast: manuscript gives \columnwidth 504pt on page 1; two-column with firstPage 3 gives 243pt and
    // page 3 ("Increasing pagenumber to 3").
    targetEngine: 'yes',
  }),
);
