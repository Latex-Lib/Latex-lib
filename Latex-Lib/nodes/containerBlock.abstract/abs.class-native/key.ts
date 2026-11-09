import { defineKey } from '../../../schema/key.ts';
import { minimal } from '../../../schema/minimal.ts';
import { solution } from '../../evidence.ts';
import { PRESETS } from './presets.ts';

export default defineKey(
  minimal({
    id: 'abs.class-native',
    node: 'containerBlock/abstract',
    description:
      "The class's own abstract, unstyled: \\begin{abstract} … \\end{abstract} as acmart, IEEEtran or elsarticle print it, or \\abstract{…} in the preamble where the class makes it a command that \\maketitle prints (sn-jnl, mdpi, aa, apa7, oup-authoring-template), or jss's \\Abstract{…}, which the class prints in its title block at \\begin{document}. Where the class keeps the environment's abstract for \\maketitle (amsart, elsarticle, acmart, cas), the class's own code prints it where it stands; the command's too, under sn-jnl and aa in a document with no title yet, and always under mdpi, which then prints no abstract of its own after the preamble. 140 templates.",
    // The environment form is the same LaTeX as abs.kernel's, on purpose: the class's own \begin{abstract} … \end{abstract}, with the same stored-abstract release in the preamble.
    writes: '\\begin{abstract} … \\end{abstract}',
    ctan: ['latex-base'],
    features: ['class-styled'],
    params: {
      form: { type: 'enum', values: ['environment', 'command'], default: 'environment', description: "the class's environment, or its \\abstract{} command" },
      // jss names its storing command \Abstract (jss.cls l.92); its \abstract is article's environment.
      command: { type: 'enum', values: ['abstract', 'Abstract'], default: 'abstract', description: "the command form's command: \\abstract{…} (aa, mdpi, sn-jnl, apa7, oup-authoring-template) or \\Abstract{…} (jss)" },
    },
    presets: PRESETS,
    // What each form prints into: the class's environment, or its command; a class may keep either for \maketitle (`heldByMaketitle`).
    requiresWhen: [
      { when: { form: 'environment' }, requires: ['env:abstract'] },
      { when: { form: 'command', command: 'abstract' }, requires: ['cmd:\\abstract'] },
      { when: { form: 'command', command: 'Abstract' }, requires: ['cmd:\\Abstract'] },
    ],
    // The command form only under the classes that give it. A class built on a listed one takes it too, so the list names sn-jnl, never article.
    onlyWhen: [
      {
        when: { form: 'command', command: 'abstract' },
        // apa7 and oup-authoring-template (b31): each makes \abstract a one-argument storing command printed by \maketitle, with no
        // abstract environment (apa7.cls l.785; oup-authoring-template.cls l.1205, 1637; their profiles define cmd:\abstract).
        classes: ['class.aa', 'class.mdpi', 'class.sn-jnl', 'class.apa7', 'class.oup-authoring-template'],
        reason:
          "the \\abstract{…} command exists only where the class makes \\abstract a command that \\maketitle prints (the profiles defining cmd:\\abstract; 0108-lix's is lix.sty's own, over article); elsewhere \\abstract opens the abstract environment, so the preamble declaration typesets the abstract before \\begin{document}: \"LaTeX Error: Missing \\begin{document}.\" at l.202 \\abstract{\\begin{remark}…, a citation in it stops at an undefined \\blx@setsfcodes, and the group it leaves open stops a package loaded after it at \"Loading a class or package in a group\"",
        evidence: [
          { kind: 'compile', cell: 'testing-pipeline/out/results/ff747ec61f02 (article.A run r20261031122332233: l.202 \\abstract in the preamble, Missing \\begin{document}; 0 of 1,639 branches holding the preset pass under article.A, 0 of 13,997 over the nine core pairs that hold it, and the error is in 572 of their 622 documents)' },
          { kind: 'compile', cell: 'testing-pipeline/out/results/0c63364139b8 (ieeetran-journal.A run r20261031114640974: l.195 \\abstract, Missing \\begin{document})' },
          { kind: 'compile', cell: 'testing-pipeline/out/results/1ab592a32b5d (beamer.A: l.195 \\abstract, Missing \\begin{document}, after earlier errors)' },
          { kind: 'compile', cell: 'testing-pipeline/out/results/1c92df56a52e (revtex4-2-aps.A run r20261031110531465: the preamble abstract stored, \\addcontents@abstract ->\\phantomsection undefined at l.108, then Loading a class or package in a group)' },
          { kind: 'compile', cell: "testing-pipeline/out/results/f027d808ada0 (scrreprt.A: \\blx@setsfcodes undefined at a citation inside the preamble's \\abstract{…}, l.94)" },
          { kind: 'source', file: 'apa7.cls (apa7 2022/07/25 v2.16, MiKTeX snapshot 9766)', line: '785 (\\long\\def\\abstract#1, printed by each mode\'s \\maketitle, l.1245, 1409, 1579)' },
          { kind: 'source', file: 'Latex Related Research/Latex-lib-main/Source/0914-oup-authoring-template/oup-authoring-template.cls', line: '1205 (\\def\\abstract#1{…\\global\\def\\@abstract{#1}}), 1564-1637 (\\maketitle prints \\@abstract)' },
        ],
      },
      {
        // b31: jss's own command, \Abstract (the class's \abstract is article's environment, which the title block uses itself).
        when: { command: 'Abstract' },
        classes: ['class.jss'],
        reason:
          "\\Abstract is jss's storing command (\\newcommand{\\Abstract}[1]{\\def\\@Abstract{#1}}, jss.cls l.92), printed in the title block's abstract environment at \\begin{document} (l.352-354, 471); no other profile defines cmd:\\Abstract, so elsewhere it stops at \"Undefined control sequence\"",
        evidence: [
          { kind: 'source', file: 'Latex Related Research/Latex-lib-main/Source/0623-jss/jss.cls', line: '92, 120, 352-354, 471' },
          solution('0623-jss', '44'),
        ],
      },
    ],
    deny: [
      {
        // b31: jss prints its own abstract, from \Abstract, in the title block at \begin{document}, with a placeholder when none was given.
        class: 'class.jss',
        unless: { form: 'command', command: 'Abstract' },
        reason:
          "jss prints the abstract it stores with \\Abstract{…} in its title block at \\begin{document} (jss.cls l.92, 352-354, 471), and '---!!!---an abstract is required---!!!---' when none was given (l.120): the environment form sets a second abstract in the body under that placeholder, and the \\abstract{…} command opens article's environment in the preamble",
        evidence: [{ kind: 'source', file: 'Latex Related Research/Latex-lib-main/Source/0623-jss/jss.cls', line: '92, 120, 352-354, 471' }],
      },
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
      // b30 (IEA-1): the classes abs.kernel denies for keeping the environment's abstract in a box (ieeeaccess, ecai, imsart),
      // denied here too: the environment form is the same environment. The command form is theirs only under aa, mdpi and sn-jnl
      // (onlyWhen), so no `unless`. The same interim as abs.kernel's: until Flouest prints one \maketitle after all front matter.
      {
        class: 'class.ieeeaccess',
        reason:
          "ieeeaccess-latexlib.cls keeps the abstract environment in box 99 (\\global\\setbox99=\\hbox{…minipage…}, l.625-634) for \\maketitle only, so a title-less document never prints it and a float or note in it is lost, as under abs.kernel",
        evidence: [
          { kind: 'source', file: 'testing-pipeline/settings/classes/files/ieeeaccess-latexlib.cls', line: '625-634' },
          { kind: 'compile', cell: 'GitHub run b29-6a43925, ieeeaccess.A: abs.class-native@environment 2 not-denied branches, 0 passing, both in document d180fcfe999dc8d5bf5a2 (result d713d3e985), which holds only class-native abstracts and shipped no page' },
        ],
      },
      {
        class: 'class.ecai',
        reason:
          "ecai keeps the abstract environment in \\abstract@box (\\global\\setbox\\abstract@box=\\vbox, ecai.cls l.766-772) for \\maketitle (l.849), so a title-less document never prints it and a float or note in it is lost, as under abs.kernel (b29 B3B-9)",
        evidence: [
          { kind: 'source', file: 'testing-pipeline/settings/classes/files/ecai.cls (2023/12/10 v04)', line: '766-772, 849' },
          { kind: 'compile', cell: 'GitHub run b29-6a43925, ecai.A: abs.class-native@environment 2 not-denied branches, 0 passing, both in document d180fcfe999dc8d5bf5a2, which shipped no page' },
        ],
      },
      {
        class: 'class.imsart',
        reason:
          "imsart.sty sets every abstract into \\abstract@box, a \\vbox (l.2218-2242), printed only by \\abstract@fmt in the front matter (l.2246-2252), so a title-less document never prints it and a float or note in it is lost, as under abs.kernel (b29 B3A-6)",
        evidence: [
          { kind: 'source', file: 'testing-pipeline/settings/classes/files/imsart.sty', line: '2218-2252, 2423-2452' },
          { kind: 'compile', cell: 'GitHub run b29-6a43925, imsart.A: abs.class-native@environment 2 not-denied branches, 0 passing, both in document d180fcfe999dc8d5bf5a2, which shipped no page' },
        ],
      },
    ],
    // The command form's body is \abstract's argument, kept for \maketitle (sn-jnl l.632 \long\def\abstract#1, mdpi l.693 \gdef\@abstract,
    // aa l.814-839, which expands it at once and prints it in its two-column title box): read as an argument, no verbatim child (a
    // library code way), no float, no footnote. The handler passes it inside a \protected macro (\libClassAbstract), so aa's and mdpi's
    // expansions leave it whole (batch 1 round 2). The same for apa7, oup-authoring-template and jss's \Abstract (b31): the body is a
    // macro's replacement text read in the preamble, so it holds no verbatim, and the class prints it in its title block.
    // apa7 and oup-authoring-template print it only from their \maketitle: in a document with no title way it never prints (node.ts's
    // CLASS_ABSTRACT_HERE has no branch for them, and \LatexLibClassAbstractHere prints nothing there).
    givesWhen: [{ when: { form: 'command' }, gives: { argument: true, verbatim: false, floats: false, footnotes: false } }],
    // b31's presets typeset ok (ZeroTeX-NG, 2026-11-07), a two-paragraph abstract whose \write sentinels each reached the page
    // once: apa7 under [man,natbib,floatsintext,nofontenc] with a title and \maketitle; oup under [webpdf,contemporary,large] with
    // \maketitle (rsfs mapped to cmsy10 in the probe only, as front.oup's key records); jss under [article] (jss.cls from
    // Source/0623-jss, the profile's digest), no \maketitle written. The way as a whole stays untested.
    targetEngine: 'untested',
  }),
);
