import { defineClass } from '../schema/class.ts';
import { ctan } from '../schema/minimal.ts';

/**
 * beamer: slides in frames; sections print nothing on a slide; floats are placed where they start; its own theorem blocks.
 * Read from its requirement document and its source; measured by the class probe
 * (beamer.A: loads, preloads, names it already defines, refused packages, layout).
 * Its geometry, which the probe does not ask about, is read from its source with the options it gives (beamer.cls v3.78
 * l.355-362, batch 6): a way that loaded geometry with another option would stop at an option clash. url is left out:
 * hyperref loads it with no options, and no way gives url an option.
 */
export default defineClass({
  id: 'class.beamer',
  name: "beamer",
  zerotex: "yes",
  preloads: [{"pkg": "amsmath"}, {"pkg": "amssymb"}, {"pkg": "amsthm"}, {"pkg": "hyperref"}, {"pkg": "xcolor"}, {"pkg": "graphicx"}, {"pkg": "enumerate"}, {"pkg": "geometry", "options": ["papersize={\\beamer@paperwidth,\\beamer@paperheight}", "hmargin=1cm", "vmargin=0cm", "head=0.5cm", "headsep=0pt", "foot=0.5cm"]}],
  defines: ["counter:part", "counter:section", "counter:subsection", "counter:subsubsection", "env:theorem", "env:corollary", "env:fact", "env:lemma", "env:problem", "env:solution", "env:definition", "env:example", "env:abstract", "cmd:\\note", "env:figure", "env:table", "env:thebibliography", "cmd:\\maketitle", "cmd:\\tableofcontents", "cmd:\\appendix"],
  options: {"notheorems": {"removes": ["env:theorem", "env:corollary", "env:fact", "env:lemma", "env:problem", "env:solution", "env:definition", "env:example"], "description": "the class predefines none of its theorem blocks"}},
  forbids: {
    technical: [{ pkg: "footnotehyper", reason: "Package footnotehyper Warning: This package is incompatible with the beamer class. Aborting input... (no \\savenotes, \\makesavenoteenv)", evidence: [{ kind: 'compile', cell: "cba3f05b123c62ad46795 (the copy's beamer.A run)" }] }, { pkg: "tocloft", reason: "its load test stops: LaTeX Error: Command \\l@section undefined.", evidence: [{ kind: 'compile', cell: 'testing-pipeline/out/profiles/beamer.A.json' }] }, { pkg: "titlesec", reason: "beamer's sectioning commands are not \\@startsection, so titlesec takes no format from them: loading it warns \"Package titlesec Warning: Non standard sectioning command \\section detected. Using default spacing and no format.\" (and the same for \\subsection, \\subsubsection and \\paragraph), then a heading at any level given no \\titleformat stops at \"Package titlesec Error: No format for this command\" (83 documents of beamer.A, every one holding General's titlesec heading or appendix way; 813 branches failed on their own heading lines, 653 of them holding no titlesec way)", evidence: [{ kind: 'compile', cell: "4f9c6bced07f8 (beamer.A run before the copy's beamer fixes: the load warnings, then General's titlesec heading loads it and another branch's kernel heading stops at l.153)" }, { kind: 'compile', cell: "23d2fab8cc5ee (beamer.A: the load warnings, then after General's titlesec appendix, l.233)" }] }],
    policy: [{ pkg: "geometry", reason: "beamer: \"you should refrain from changing the paper size\", set by the aspectratio option", evidence: [{ kind: 'requirement', file: 'Template/template-requirement/Beamer.md', line: '30' }] }],
  },
  layout: { columns: 1, textwidth: "307.28987pt", fontsize: "10.95pt" },
  vocabulary: {"\\frametitle": "a frame's title", "\\institute": "affiliations", "\\titlepage": "the title page inside a frame"},
  evidence: [{ kind: 'compile', cell: 'testing-pipeline/out/profiles/beamer.A.json' }, { kind: 'requirement', file: 'Template/template-requirement/Beamer.md', line: '34' }, { kind: 'requirement', file: 'Template/template-requirement/Beamer.md', line: '53' }, { kind: 'requirement', file: 'Template/template-requirement/Beamer.md', line: '57' }, { kind: 'requirement', file: 'Template/template-requirement/Beamer.md', line: '65' }, { kind: 'requirement', file: 'Template/template-requirement/Beamer.md', line: '77' }, { kind: 'requirement', file: 'Template/template-requirement/Beamer.md', line: '80' }, { kind: 'requirement', file: 'Template/template-requirement/Beamer.md', line: '85' }, { kind: 'source', file: 'beamer.cls (beamer 2026/08/20 v3.78, as the engine fetches it)', line: '355-362 (\\RequirePackage[papersize={\\beamer@paperwidth,\\beamer@paperheight},hmargin=1cm,vmargin=0cm,head=0.5cm,headsep=0pt,foot=0.5cm]{geometry}); 388 (\\RequirePackage[implicit=false]{hyperref}, which loads url)' }, ctan('beamer')],
});
