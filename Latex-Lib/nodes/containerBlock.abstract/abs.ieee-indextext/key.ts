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
