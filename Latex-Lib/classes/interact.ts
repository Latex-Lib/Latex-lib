import { defineClass } from '../schema/class.ts';

/**
 * Taylor & Francis' Interact layout class interact.cls (2016/10/17 v1.03), loaded by the interact setting with no options.
 * Not measured by the class probe (batch 3, b3p G2): every field is read from the pinned file,
 * testing-pipeline/settings/classes/files/interact.cls, whose lines are cited.
 * - article at 11pt on A4 underneath (\LoadClass[11pt,a4paper]{article}, l.23), so article is the base.
 * - Preloads, all with no options (l.25): amsmath, amssymb, amsfonts, amsbsy, amsthm, booktabs, epsfig, graphicx and
 *   rotating; then geometry with textwidth=34pc,textheight=650pt (l.30; largeformat's 1in margins are not used). A way that
 *   loads one of these with an option the class did not give meets 'Option clash' (amsmath's fleqn or leqno, rotating's
 *   figuresright or figuresleft), which the host reads from these preloads.
 * - It renews \maketitle (l.251-279, article-like: \@title, \@author, \@thanks), abstract (l.281), the headings as
 *   \@startsection commands (l.341-357), \appendix (l.426-433), figure and table (l.443-487), booktabs' \toprule, \midrule and
 *   \bottomrule as \hline with fixed skips (l.509-511, so booktabs' rule widths do not show), \footnoterule and \@makefntext
 *   (l.653-657), proof (l.695) and the plain, definition and remark theorem styles (l.704-710; no theorem is defined). It
 *   defines keywords, abbreviations, amscode, jelcode and pacscode environments (l.288-316).
 * - Fonts: \rmdefault cmr in OT1 (l.124-131), replaced by General's fontspec lines; \cal and \mit renewed (l.119-122);
 *   upright Greek \ualpha ... (l.168-227).
 * - Page: \textwidth 34pc = 408pt (geometry, l.30), 11pt, one column.
 */
export default defineClass({
  id: 'class.interact',
  name: "interact",
  base: 'class.article',
  zerotex: "untested",
  preloads: [{"pkg": "amsmath"}, {"pkg": "amssymb"}, {"pkg": "amsfonts"}, {"pkg": "amsbsy"}, {"pkg": "amsthm"}, {"pkg": "booktabs"}, {"pkg": "epsfig"}, {"pkg": "graphicx"}, {"pkg": "rotating"}, {"pkg": "geometry", "options": ["textwidth=34pc", "textheight=650pt"]}],
  defines: ["counter:part", "counter:section", "counter:subsection", "counter:subsubsection", "counter:paragraph", "counter:subparagraph", "env:abstract", "env:keywords", "env:figure", "env:table", "env:thebibliography", "cmd:\\maketitle", "cmd:\\tableofcontents", "cmd:\\appendix"],
  options: {},
  forbids: {
    technical: [],
    policy: [],
  },
  layout: { columns: 1, textwidth: "408.0pt", fontsize: "11pt" },
  vocabulary: {},
  evidence: [
    { kind: 'source', file: 'testing-pipeline/settings/classes/files/interact.cls', line: '12 (\\ProvidesClass), 23 (\\LoadClass[11pt,a4paper]{article}), 25 (packages), 30 (geometry)' },
    { kind: 'source', file: 'testing-pipeline/settings/classes/files/interact.cls', line: '251-279 (\\maketitle), 281-316 (abstract, keywords), 341-357 (headings), 426-433 (\\appendix), 443-487 (floats)' },
    { kind: 'source', file: 'testing-pipeline/settings/classes/files/interact.cls', line: '509-511 (booktabs rules), 653-657 (footnotes), 695-710 (proof, theorem styles)' },
  ],
});
