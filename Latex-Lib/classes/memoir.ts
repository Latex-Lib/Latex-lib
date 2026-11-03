import { defineClass } from '../schema/class.ts';

/**
 * memoir, as the class probe measured it (memoir.A: loads, preloads,
 * names it already defines, refused packages, layout), with what its
 * requirement document says it defines and forbids.
 */
export default defineClass({
  id: 'class.memoir',
  name: "memoir",
  zerotex: "yes",
  // abstract and changepage are emulated by memoir (marked loaded with no options), which its @filelist does not show:
  // a load with options clashes ("Option clash for package abstract/changepage", the copy's memoir.A run, cell cd9964b957df7c2c47ef9).
  // parskip too (cell c43317ef2450034f457a0). Its log names 25 emulated packages; the rest are left out because a preload
  // also counts against a key's package conflicts (enumitem with enumerate), which memoir's emulations do not bear out.
  // array is no emulation: memoir.cls v3.8.4b loads it plainly (l.5453), as it does tabularx and booktabs (l.5469, l.5473),
  // and its \EmulatedPackage{array} is commented out (l.12213), so it is preloaded (batch 6).
  preloads: [{"pkg": "setspace"}, {"pkg": "tocloft"}, {"pkg": "array"}, {"pkg": "tabularx"}, {"pkg": "booktabs"}, {"pkg": "abstract"}, {"pkg": "changepage"}, {"pkg": "parskip"}],
  defines: ["counter:chapter", "counter:part", "counter:section", "counter:subsection", "counter:subsubsection", "counter:paragraph", "counter:subparagraph", "env:abstract", "env:figure", "env:table", "env:thebibliography", "cmd:\\maketitle", "cmd:\\tableofcontents", "cmd:\\appendix"],
  options: {},
  forbids: {
    // Packages that break under memoir whatever way loads them (the copy's memoir.A run, r20261031102055131); none of them errs under book.A or report.A.
    technical: [
      { pkg: "floatrow", reason: "memoir defines \\newfloat itself, and floatrow stops while it loads: \"Command \\newfloat already defined\" (floatrow.sty l.255)", evidence: [{ kind: 'compile', cell: "testing-pipeline/out/results/f74be4db3be0 (the copy's memoir.A run: all 293 documents holding fig.floatrow's floatrow engine that wrote a log stop there; its sidecap engine does not load floatrow)" }, { kind: 'compile', cell: "testing-pipeline/out/results/4f7e019f6a4c (the copy's memoir.A run: the error, raised in the preamble, is charged to one branch of a document, so the document's other holders can pass; the 11 of the 698 branches loading floatrow that pass, @floatrow-right and @floatrow-top-left alike, are in 7 documents that all carry it, 3 of them here)" }] },
      { pkg: "sectsty", reason: "sectsty fails while it loads under memoir: \"Command \\parttitlefont already defined\" (sectsty.sty l.248), then \"The sectsty package doesn't work with this document class\" (l.296); memoir warns it provides its own heading interface (head.memoir-style)", evidence: [{ kind: 'compile', cell: "testing-pipeline/out/results/217ffbb18270 (the copy's memoir.A run: all 51 documents holding head.sectsty that wrote a log stop there)" }, { kind: 'compile', cell: "testing-pipeline/out/results/4f7e019f6a4c (the copy's memoir.A run: the 2 of the 368 branches holding head.sectsty that pass are both in this document, which carries the error on another branch's lines)" }] },
      { pkg: "setspace", reason: "memoir emulates setspace (\"Package setspace [2008/07/23] emulated by memoir\"), so \\usepackage{setspace} loads nothing, and memoir does not define \\setstretch:\"Undefined control sequence. l.207 \\setstretch\"", evidence: [{ kind: 'compile', cell: "testing-pipeline/out/results/f74be4db3be0 (the copy's memoir.A run: General's abstract:setspace passes 0 of its 1,551 branches, 1,449 failing at \\setstretch in 60 documents, against 213 passing under report.A; General's contents ways with setspace pass 0 of 12, 12 of 12 under report.A)" }] },
    ],
    policy: [],
  },
  layout: { columns: 1, textwidth: "341.0pt", fontsize: "10pt" },
  vocabulary: {},
  evidence: [{ kind: 'compile', cell: 'testing-pipeline/out/profiles/memoir.A.json' }, { kind: 'source', file: 'memoir.cls (memoir 2025/11/04 v3.8.4b, as the engine fetches it)', line: '5453 (\\RequirePackage{array}[2018/04/30]), 5469 (tabularx), 5473 (booktabs); 12213 (% \\EmulatedPackage{array}[2016/10/06], commented out)' }],
});
