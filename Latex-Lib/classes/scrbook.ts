import { defineClass } from '../schema/class.ts';
import { ctan } from '../schema/minimal.ts';

/**
 * KOMA-Script's book class: chapters, KOMA's fonts and options (\setkomafont, \KOMAoptions).
 * Read from its requirement document and its source; measured by the class probe
 * (scrbook.A: loads, preloads, names it already defines, refused packages, layout).
 */
export default defineClass({
  id: 'class.scrbook',
  name: "scrbook",
  zerotex: "yes",
  preloads: [],
  defines: ["counter:chapter", "counter:part", "counter:section", "counter:subsection", "counter:subsubsection", "counter:paragraph", "counter:subparagraph", "env:figure", "env:table", "env:thebibliography", "cmd:\\maketitle", "cmd:\\tableofcontents", "cmd:\\appendix"],
  options: {},
  forbids: {
    // As under scrreprt: this keeps out General's titlesec ways (head.titlesec denies KOMA in its key). The copy has no scrbook run; the live store's
    // scrbook.A, compiled before this forbid, behaves as its scrreprt.A does.
    technical: [{ pkg: "titlesec", reason: "KOMA-Script declares its headings with \\DeclareSectionCommand, not \\@startsection: titlesec warns \"Non standard sectioning command \\section detected. Using default spacing and no format\" and every heading at a level no \\titleformat set stops at \"Package titlesec Error: No format for this command\"; the class warns \"Usage of package `titlesec' together with a KOMA-Script class is not recommended\". General's titlesec ways format only their own heading, inside a group, so every other heading of the document stops", evidence: [
      { kind: 'compile', cell: "eb6ba84fe220 and 41a17b1b25e5 (the copy's scrartcl.A and scrreprt.A runs; scrbook declares its headings the same way)" },
      { kind: 'compile', cell: "91088f66364f (the live store's scrbook.A run, document d5216e786f3aee20ecd9a: the class's warning at log line 454, titlesec's \"Non standard sectioning command \\section\" at 477, \"No format for this command\" from line 1031 on; its 4 branches holding General's appendix inlineTitle pass on their own lines, while 12 of its 22 other branches stop there. Over the run, the other branches of the 171 documents loading titlesec stop there 399 times in 3,983, as under the store's scrreprt.A, against 0 under its report.A and book.A)" },
    ] }],
    policy: [],
  },
  layout: { columns: 1, textwidth: "418.25555pt", fontsize: "10.95pt" },
  vocabulary: {},
  evidence: [{ kind: 'compile', cell: 'testing-pipeline/out/profiles/scrbook.A.json' }, { kind: 'requirement', file: 'Template/template-requirement/KOMA_Scrartcl.md', line: '68' }, ctan('koma-script')],
});
