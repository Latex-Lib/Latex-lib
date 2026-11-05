import { defineClass } from '../schema/class.ts';

/**
 * The Institute of Mathematical Statistics' imsart in its Annals of Statistics layout: imsart.cls (2025/03/18 driver) and
 * imsart.sty (\imsfmt@version 2026/09/11), loaded by the imsart setting as \documentclass[aos]{imsart}. Not measured by the
 * class probe (batch 3, b3p G2): every field is read from the pinned files in testing-pipeline/settings/classes/files/.
 * - imsart.cls passes aos's 11pt, oneside and leqno to article (l.99-102), leqno and cmex10 to amsmath without loading it
 *   (l.101, l.130), loads article (l.135) and imsart.sty (l.149). So article is the base.
 * - imsart.sty's aos option (l.278-296) sets the IMS layout and asks for amsthm (\@load@amsthmtrue), not amsmath (only
 *   l.352's journal), natbib (l.353) or rotating (the rotating option, l.166). Preloads, in load order: etoolbox (l.72), keyval
 *   (l.872), ifpdf (l.889), [T1]fontenc, times, [scaled=.9]helvet, textcomp and textcase (the IMS layout, l.3164-3168), and
 *   amsthm (l.4840-4842), whose \set@amsthm (l.4671-4752) renews proof and the plain and definition styles and defines no
 *   theorem. General's natbib is the template's ([numbers], aos-template.tex l.17), loaded after the class.
 * - It defines the acks environment (l.4842, \newenvironment{acks}[1][\acknowledgementsname]) and funding (l.4855), and
 *   undefines \ack (l.4843): a way that defines acks meets 'Environment acks already defined'.
 * - The text block is fixed: \set@page@layout (l.502-541) records \textwidth and \textheight and, at \end{document}, raises
 *   'Package imsart Error: \textwidth cannot be altered' (and \textheight) when either changed, so geometry is refused.
 *   hyperref must come after imsart (l.75-76), which every way's does; l.80-88 passes it colorlinks and blue links.
 * - \maketitle becomes \local@maketitle at \begin{document} (l.2423-2452), which prints the front matter; a titling
 *   \maketitle, defined while the preamble loads, is replaced by it there, so titling's formats do not show (no error).
 * - \@sect is imsart's (l.1685, the dot after a section number); the headings stay article's \@startsection commands.
 * - Page: 405bp x 646bp (l.282), \@settopoint'ed: \textwidth 406pt; 11pt; one column.
 */
export default defineClass({
  id: 'class.imsart',
  name: "imsart",
  base: 'class.article',
  zerotex: "untested",
  preloads: [{"pkg": "etoolbox"}, {"pkg": "keyval"}, {"pkg": "ifpdf"}, {"pkg": "fontenc", "options": ["T1"]}, {"pkg": "times"}, {"pkg": "helvet", "options": ["scaled=.9"]}, {"pkg": "textcomp"}, {"pkg": "textcase"}, {"pkg": "amsthm"}],
  defines: ["counter:part", "counter:section", "counter:subsection", "counter:subsubsection", "counter:paragraph", "counter:subparagraph", "env:abstract", "env:acks", "env:figure", "env:table", "env:thebibliography", "cmd:\\maketitle", "cmd:\\tableofcontents", "cmd:\\appendix"],
  options: {},
  forbids: {
    technical: [
      { pkg: "geometry", reason: "imsart.sty fixes the aos text block (\\set@page@layout{405bp}{646bp}) and checks it at \\end{document}: 'Package imsart Error: \\textwidth cannot be altered' (and \\textheight) when geometry or anything else changed either (imsart.sty l.502-541; the check is skipped only when \\do@not@check@textbox@alter is defined)", evidence: [{ kind: 'source', file: 'testing-pipeline/settings/classes/files/imsart.sty', line: '282, 502-541' }] },
    ],
    policy: [],
  },
  layout: { columns: 1, textwidth: "406.0pt", fontsize: "11pt" },
  vocabulary: {},
  evidence: [
    { kind: 'source', file: 'testing-pipeline/settings/classes/files/imsart.cls', line: '69 (\\ProvidesClass), 99-102 (aos), 130 (cmex10), 135 (\\LoadClass{article}), 149 (\\RequirePackage{imsart})' },
    { kind: 'source', file: 'testing-pipeline/settings/classes/files/imsart.sty', line: '72, 872, 889 (etoolbox, keyval, ifpdf), 278-296 (aos), 3164-3168 (fonts), 4840-4855 (amsthm, acks, funding)' },
    { kind: 'source', file: 'testing-pipeline/settings/classes/files/imsart.sty', line: '75-88 (hyperref), 502-541 (text block check), 1685 (\\@sect), 2423-2452 (\\maketitle)' },
  ],
});
