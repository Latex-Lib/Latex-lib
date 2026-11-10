import { defineKey } from '../../../schema/key.ts';
import { minimal } from '../../../schema/minimal.ts';
import { PRESETS } from './presets.ts';

export default defineKey(
  minimal({
    id: 'abs.ieee-indextext',
    node: 'containerBlock/abstract',
    description:
      "IEEEtran's title-area abstract, as IEEE Computer Society journals write it: the abstract environment and the index terms stored with \\IEEEtitleabstractindextext{…} in the preamble, so the compsoc (and transmag) journal's \\maketitle prints them in its title area under the authors, and \\IEEEdisplaynontitleabstractindextext where the abstract node stands, which prints them there in the conference, technote and plain journal formats. The index terms are the title's keywords, handed over by the title way in \\LatexLibIndexTerms. Before any \\maketitle (no title, or a title after the abstract) the stored text prints where the node stands.",
    writes: '\\IEEEtitleabstractindextext{\\begin{abstract} … \\end{abstract}\\LatexLibIndexTerms} … \\IEEEdisplaynontitleabstractindextext',
    ctan: ['ieeetran'],
    features: ['class-styled', 'full-width'],
    params: {},
    presets: PRESETS,
    // The class's store and display commands (IEEEtran.cls l.5226-5249, V1.7) and its abstract environment, which the stored text opens.
    requires: ['cmd:\\IEEEtitleabstractindextext', 'cmd:\\IEEEdisplaynontitleabstractindextext', 'env:abstract'],
    only: ['class.ieeetran-compsoc', 'class.ieeetran'],
    // Two classes built on class.ieeetran (their profiles' base), so `only` lets them in, that cannot run the way.
    deny: [
      {
        class: 'class.ieeeconf-ras',
        reason: "ieeeconf.cls is a renamed IEEEtran V1.6b (2002/11/18), older than \\IEEEtitleabstractindextext and \\IEEEdisplaynontitleabstractindextext (IEEEtran V1.7, l.5226-5249 as cited above), so the abstract stops at 'Undefined control sequence' at \\IEEEtitleabstractindextext; its profile lists neither command",
        evidence: [
          { kind: 'source', file: 'testing-pipeline/settings/classes/files/ieeeconf.cls', line: '2 (IEEEtran.cls 2002/11/18 version V1.6b); no \\IEEEtitleabstractindextext in the file' },
          { kind: 'compile', cell: 'batch 4 round 1 (testing-pipeline/out/fetched/batch4-round1): ieeeconf-ras.A, 128 cells whose first error is \\IEEEtitleabstractindextext (1,336 failing branches); abs.ieee-indextext@compsoc passed 0 of its 1,301 not-denied branches there (document dd7cc80e2db6516dd263c, result 1001d3233f)' },
        ],
      },
      {
        // As abs.kernel's and abs.class-native's ieeeaccess rules (b30 IEA-1); IEEE Access's own form is abs.ieeeaccess.
        class: 'class.ieeeaccess',
        reason:
          "ieeeaccess-latexlib.cls renews the abstract environment as \\global\\setbox99=\\hbox{…minipage…} (l.625-634), which only its own \\@maketitle prints (\\noindent\\box99, l.763), and its title area never reads \\@IEEEtitleabstractindextext: the stored \\begin{abstract} … \\end{abstract} only fills box 99, so a document whose \\maketitle does not come after it never prints the abstract, as under abs.kernel (b30 IEA-1)",
        evidence: [
          { kind: 'source', file: 'testing-pipeline/settings/classes/files/ieeeaccess-latexlib.cls', line: '4 (\\LoadClass{IEEEtran}), 625-634 (\\renewenvironment{abstract}: \\global\\setbox99), 763 (\\noindent\\box99 in \\@maketitle)' },
          { kind: 'compile', cell: 'batch 4 round 1 (testing-pipeline/out/fetched/batch4-round1), ieeeaccess.A: 1,151 not-denied abs.ieee-indextext branches, 156 passing; 738 in 38 no-page documents holding only compsoc abstracts and no title (document d3c0195e7602e1e4ab038, cell c05774c259b3455b4e176, result 2d121c511dd9), and 249 more at sentinel:missing in documents that ship pages (document d97facfebaa1487d73daf, result 09138cf75b)' },
        ],
      },
    ],
    // The body is \IEEEtitleabstractindextext's argument (\long\def, l.5227), typed inside \maketitle's \parbox under compsoc
    // (\@IEEEtitleabstractindextextbox, l.4791-4797): read as an argument, so no verbatim (a code way), no float (not in outer par
    // mode in a \parbox) and no footnote (lost in a \parbox, as in a table cell).
    gives: { argument: true, verbatim: false, floats: false, footnotes: false },
    // Typeset ok on ZeroTeX-NG (2026-11-07) under [journal,compsoc] with the title first (the abstract only in \maketitle's title
    // area: the node adds no print), with no title and with the abstract before the title (printed once, at the node), under
    // [journal] and [conference,compsoc] (printed once, at the node).
    targetEngine: 'yes',
  }),
);
