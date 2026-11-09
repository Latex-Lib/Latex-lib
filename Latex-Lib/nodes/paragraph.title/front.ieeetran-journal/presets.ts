/**
 * front.ieeetran-journal's presets: IEEE's journal format (bare_jrnl.tex) and the Computer Society's journal format
 * (bare_jrnl_compsoc.tex), both from IEEEtran's own templates.
 */
import type { Preset } from '../../../schema/params.ts';

const DIR = 'Latex Related Research/Latex-lib-main/Source/0743-ieeetran-journal/IEEEtran';

export const PRESETS = {
  journal: {
    description:
      "IEEE's journal title block (IEEEtran journal): the names in one line with their IEEE grades in italics (\\IEEEmembership), the affiliations, funding, corresponding author and received dates as first-page footnotes (\\thanks), the running heads (\\markboth), then \\maketitle; the index terms (IEEEkeywords) right after the abstract and the biographies at the end.",
    features: ['class-styled', 'centered'],
    params: {},
    evidence: [
      { kind: 'source', file: `${DIR}/bare_jrnl.tex`, line: '361-379 (\\title, \\author with \\IEEEmembership and \\thanks), 403-404 (\\markboth), 418-425 (\\IEEEpubid, \\maketitle), 435-442 (abstract, IEEEkeywords), 683-698 (IEEEbiography, IEEEbiographynophoto)' },
      { kind: 'compile', reproducer: "\\documentclass[journal]{IEEEtran} \\begin{document} the preset's body on the title sample, \\begin{abstract}…\\end{abstract} \\section{Intro}: ok (ZeroTeX-NG, 2026-11-07)" },
    ],
  },
  compsoc: {
    description:
      "The Computer Society's journal title block (IEEEtran journal,compsoc): the names with their grades in sans-serif, the affiliations as one itemized footnote (\\IEEEcompsocitemizethanks, each with its e-mails on a line), then the funding, corresponding author and received dates (\\thanks), the running heads, and the index terms in the title area under the authors.",
    writes:
      '\\title{…} \\author{…,~\\IEEEmembership{…,} and~…\\IEEEcompsocitemizethanks{\\IEEEcompsocthanksitem … is with … .\\protect\\\\ E-mail: … \\IEEEcompsocthanksitem …}\\thanks{…}} \\markboth{…}{…: …} \\IEEEpubid{…} \\def\\LatexLibIndexTerms{\\begin{IEEEkeywords} … \\end{IEEEkeywords}} \\IEEEtitleabstractindextext{\\LatexLibIndexTerms} \\maketitle',
    features: ['class-styled', 'sans-serif'],
    params: { thanks: 'compsoc', keywords: 'index-text' },
    evidence: [
      { kind: 'source', file: `${DIR}/bare_jrnl_compsoc.tex`, line: '402-412 (\\IEEEcompsocitemizethanks, \\IEEEcompsocthanksitem, \\protect\\\\ E-mail), 435-436 (\\markboth), 473-485 (\\IEEEtitleabstractindextext with IEEEkeywords before \\maketitle), 753-768 (biographies)' },
      { kind: 'compile', reproducer: "\\documentclass[journal,compsoc]{IEEEtran} \\begin{document} the preset's body on the title sample, \\section{Intro}: ok (ZeroTeX-NG, 2026-11-07)" },
    ],
  },
} as const satisfies { readonly [name: string]: Preset };
