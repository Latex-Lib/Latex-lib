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
 * - Refused (b29, B3A): it \def's \titlefont (l.55) and \sectionfont (l.46), so scrextend's KOMA kernel
 *   (\newcommand*\titlefont, scrextend.sty l.1528) and sectsty (\newcommand*\sectionfont, sectsty.sty l.256-257) stop at
 *   "already defined" while they load (GitHub run b28-e9f730a: 19,717 and 232 failing interact.A branches).
 * - Its \small defines \@list with a parameter text, \def\@list1{...} (l.77, a typo for \@listi), dead code under the kernel's
 *   lists; enumitem's \trivlist calls \@list<depth> at depth 0, so a statement in \small type with enumitem loaded stopped at
 *   "Use of \@list doesn't match its definition". The setting's preamble renames that definition (b29, B3A-4).
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
    technical: [
      { pkg: "scrextend", reason: "interact.cls defines \\titlefont (\\def, l.55), and scrextend's KOMA kernel defines it again while it loads (\\newcommand*\\titlefont{\\sectfont}, scrextend.sty l.1528): \"LaTeX Error: Command \\titlefont already defined\" in the preamble, so every branch of the cell fails (GitHub run b28-e9f730a, interact.A: 19,717 branches in 477 documents as a document error, all 3,123 list.scrextend branches failing), as under spie, achemso and ieeeaccess", evidence: [{ kind: 'source', file: 'testing-pipeline/settings/classes/files/interact.cls', line: '55' }, { kind: 'compile', cell: 'GitHub run b28-e9f730a, interact.A document d2175129367a78ddff1c9, result 9b8d83b298fb: l.1528 \\newcommand*\\titlefont{\\sectfont}' }] },
      { pkg: "sectsty", reason: "interact.cls defines \\sectionfont (\\def, l.46), so sectsty's \\newcommand*{\\sectionfont} stops at \"Command \\sectionfont already defined\" (sectsty.sty l.256-257), leaves \\SS@sectfont undefined, and the next heading stops at \"Undefined control sequence\" (\\SS@sectfont, thebibliography's heading), as under cas-sc and sn-jnl (GitHub run b28-e9f730a, interact.A: all 232 head.sectsty branches failing)", evidence: [{ kind: 'source', file: 'testing-pipeline/settings/classes/files/interact.cls', line: '46' }, { kind: 'compile', cell: 'GitHub run b28-e9f730a, interact.A documents d997ecc4b9bfd6a722d95 (result 0d0c5dbbe0a0) and dc7d695579f46fd200797 (\\SS@sectfont at l.119)' }] },
    ],
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
