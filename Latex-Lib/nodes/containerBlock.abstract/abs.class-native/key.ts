import { defineKey } from '../../../schema/key.ts';
import { minimal } from '../../../schema/minimal.ts';
import { PRESETS } from './presets.ts';

export default defineKey(
  minimal({
    id: 'abs.class-native',
    node: 'containerBlock/abstract',
    description:
      "The class's own abstract, unstyled: \\begin{abstract} … \\end{abstract} as acmart, IEEEtran or elsarticle print it, or \\abstract{…} in the preamble where the class makes it a command that \\maketitle prints (sn-jnl, mdpi, aa). Where the class keeps the environment's abstract for \\maketitle (amsart, elsarticle, acmart, cas), the class's own code prints it where it stands; the command's too, under sn-jnl and aa in a document with no title yet, and always under mdpi, which then prints no abstract of its own after the preamble. 140 templates.",
    ctan: ['latex-base'],
    features: ['class-styled'],
    params: {
      form: { type: 'enum', values: ['environment', 'command'], default: 'environment', description: "the class's environment, or its \\abstract{} command" },
    },
    presets: PRESETS,
    // The command form only under the classes that give it. A class built on a listed one takes it too, so the list names sn-jnl, never article.
    onlyWhen: [
      {
        when: { form: 'command' },
        classes: ['class.aa', 'class.mdpi', 'class.sn-jnl'],
        reason:
          "the \\abstract{…} command exists only where the class makes \\abstract a command that \\maketitle prints (the profiles defining cmd:\\abstract; 0108-lix's is lix.sty's own, over article); elsewhere \\abstract opens the abstract environment, so the preamble declaration typesets the abstract before \\begin{document}: \"LaTeX Error: Missing \\begin{document}.\" at l.202 \\abstract{\\begin{remark}…, a citation in it stops at an undefined \\blx@setsfcodes, and the group it leaves open stops a package loaded after it at \"Loading a class or package in a group\"",
        evidence: [
          { kind: 'compile', cell: 'testing-pipeline/out/results/ff747ec61f02 (article.A run r20261031122332233: l.202 \\abstract in the preamble, Missing \\begin{document}; 0 of 1,639 branches holding the preset pass under article.A, 0 of 13,997 over the nine core pairs that hold it, and the error is in 572 of their 622 documents)' },
          { kind: 'compile', cell: 'testing-pipeline/out/results/0c63364139b8 (ieeetran-journal.A run r20261031114640974: l.195 \\abstract, Missing \\begin{document})' },
          { kind: 'compile', cell: 'testing-pipeline/out/results/1ab592a32b5d (beamer.A: l.195 \\abstract, Missing \\begin{document}, after earlier errors)' },
          { kind: 'compile', cell: 'testing-pipeline/out/results/1c92df56a52e (revtex4-2-aps.A run r20261031110531465: the preamble abstract stored, \\addcontents@abstract ->\\phantomsection undefined at l.108, then Loading a class or package in a group)' },
          { kind: 'compile', cell: "testing-pipeline/out/results/f027d808ada0 (scrreprt.A: \\blx@setsfcodes undefined at a citation inside the preamble's \\abstract{…}, l.94)" },
        ],
      },
    ],
    deny: [
      {
        class: 'class.book',
        reason: 'book has no abstract, as an environment or a command: "Environment abstract undefined"',
        evidence: [{ kind: 'compile', cell: 'testing-pipeline/out/results/34f0849cd342 (solo, book.A)' }],
      },
      {
        // scrbook is not built on book (its profile has no base), so book's rule does not reach it.
        class: 'class.scrbook',
        reason: 'scrbook has no abstract, as an environment or a command (its profile defines no env:abstract): "Environment abstract undefined", as under book',
        evidence: [{ kind: 'compile', cell: 'testing-pipeline/out/profiles/scrbook.A.json (no abstract environment)' }, { kind: 'compile', cell: 'testing-pipeline/out/results/34f0849cd342 (the book analogue, solo, book.A)' }],
      },
      {
        class: 'class.aa',
        unless: { form: 'command' },
        reason: "aa makes \\abstract a one-argument command that \\maketitle prints (\\let\\endabstract\\relax), so \\begin{abstract} takes the first token as the abstract and sets the rest as body text",
        evidence: [{ kind: 'source', file: 'testing-pipeline/settings/classes/files/aa.cls', line: '813-817' }],
      },
      {
        class: 'class.sn-jnl',
        unless: { form: 'command' },
        reason: "sn-jnl's \\abstract is a one-argument command that \\maketitle prints, so \\begin{abstract} stores only the first token and prints the rest as body text, with no heading",
        evidence: [{ kind: 'source', file: 'testing-pipeline/settings/classes/files/sn-jnl.cls', line: '631-635 (CR line ends)' }],
      },
      {
        // b22 (owner items R3, R3/O3 under aastex): an interim deny until Flouest prints one \maketitle after all front matter (revtex O3).
        class: 'class.revtex4-2',
        reason:
          "revtex4-2 keeps the abstract in \\absbox for \\maketitle (revtex4-2.cls l.2548-2574, l.2629-2654) and undefines the environment after it (l.2685): a title-first abstract stops at \"Environment abstract undefined\", a title-less one never prints, and the box is set at \\textwidth, for aps 400pt centred (aps4-2.rtx l.148-160), which a two-column page cannot take in place",
        evidence: [{ kind: 'source', file: 'revtex4-2.cls (MiKTeX package revtex)', line: '2548-2574, 2629-2654, 2685' }],
      },
      {
        class: 'class.aastex',
        reason:
          "aastex701 keeps the abstract in \\absbox for \\maketitle (aastex701.cls l.2342-2373), its first \\section calls \\maketitle itself (l.7583-7593) and that \\maketitle undefines the environment (l.13248), so an abstract after a heading or a title stops at \"Environment abstract undefined\" and one in a document with neither never prints",
        evidence: [{ kind: 'source', file: 'testing-pipeline/settings/classes/files/aastex701.cls', line: '2342-2373, 7583-7593, 13248' }],
      },
      {
        class: 'class.mdpi',
        unless: { form: 'command' },
        reason: "mdpi makes \\abstract a one-argument command whose text \\abstractkeywords prints once after the preamble, so \\begin{abstract} hands it its first token, which never prints, and sets the rest as body text",
        evidence: [{ kind: 'source', file: 'testing-pipeline/settings/classes/files/Definitions/mdpi.cls', line: '692-693, 1325-1331' }, { kind: 'requirement', file: 'Template/template-requirement/MDPI.md', line: '66' }],
      },
    ],
    // The command form's body is \abstract's argument, kept for \maketitle (sn-jnl l.632 \long\def\abstract#1, mdpi l.693 \gdef\@abstract,
    // aa l.814-839, which expands it at once and prints it in its two-column title box): read as an argument, no verbatim child (a
    // library code way), no float, no footnote. The handler passes it inside a \protected macro (\libClassAbstract), so aa's and mdpi's
    // expansions leave it whole (batch 1 round 2).
    givesWhen: [{ when: { form: 'command' }, gives: { argument: true, verbatim: false, floats: false, footnotes: false } }],
    zerotex: 'untested',
  }),
);
