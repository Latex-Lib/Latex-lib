import { defineKey } from '../../../schema/key.ts';
import { minimal } from '../../../schema/minimal.ts';
import { CLS, KIT, PRESETS } from './presets.ts';

export default defineKey({
  ...minimal({
    id: 'abs.aa-structured',
    node: 'containerBlock/abstract',
    description:
      "Astronomy & Astrophysics' (aa) structured abstract: \\abstract{context}{aims}{methods}{results}{conclusions} in the preamble, which aa's \\maketitle prints under its own run-in headings Context. Aims. Methods. Results. Conclusions. The abstract's paragraphs are sorted into the five slots by the label each opens with (\"Aims.\", \"\\textbf{Methods:}\"), the labels left out; Context and Conclusions may be empty, and an abstract without Aims, Methods and Results falls back to the one-argument \\abstract{…}. In a document with no title yet it is printed where it stands, in aa's own lines. aa only.",
    writes: '\\LatexLibAaStructuredHere; \\protected\\def\\libAaAims{…} … \\abstract{…}{\\libAaAims}{\\libAaMethods}{\\libAaResults}{…}',
    // aa.cls is not on CTAN (A&A's macro package): its evidence is the class file and the kit below.
    ctan: [],
    features: ['class-styled', 'run-in-head'],
    presets: PRESETS,
    // aa's \abstract is a command with one argument and four more when a brace follows (aa.cls l.814-823); the profile defines it.
    requires: ['cmd:\\abstract'],
    only: ['class.aa'],
    // As abs.class-native's command form (its key): the body is a macro's replacement text read in the preamble, and aa prints it
    // in its title box, so it takes no verbatim child, no float and no footnote.
    gives: { argument: true, verbatim: false, floats: false, footnotes: false },
    // Typeset ok under aa (ZeroTeX-NG, 2026-11-07): the sample (one paragraph, so the one-argument fallback) with a title; a labelled
    // five-slot abstract (\textbf{Aims:}, "Methods." over two paragraphs, \textbf{Results}.) and one with only Aims, Methods and
    // Results, each with \title and \maketitle and with no title (printed in place). A \write sentinel in every slot reached the
    // page exactly once in each, so the slots printed under aa's structured branch and never twice.
    targetEngine: 'yes',
  }),
  evidence: [
    { kind: 'source', file: CLS, line: '479-483 (\\aa@subabstractiname … \\aa@subabstractvname), 814-837 (\\abstract, \\aa@abstract@next[4]), 1145-1168 (the title block prints the slots)' },
    { kind: 'source', file: KIT, line: '75-91 (the five braces, Context and Conclusions optional)' },
    { kind: 'source', file: 'Latex Related Research/Latex-Template-Examples/class.aa/main.tex', line: '115-123' },
  ],
});
