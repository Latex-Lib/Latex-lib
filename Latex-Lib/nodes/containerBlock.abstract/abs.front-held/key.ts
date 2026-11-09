import { defineKey } from '../../../schema/key.ts';
import { minimal } from '../../../schema/minimal.ts';
import { AASTEX, EXAMPLES, PRESETS, REVTEX } from './presets.ts';

const EAPJ = 'emulateapj.cls (MiKTeX package emulateapj, version February 19, 2025)';
const RTX4 = 'revtex4.cls (MiKTeX package revtex4, 2020/09/30 v4.0a)';
const ECAI = 'testing-pipeline/settings/classes/files/ecai.cls (2023/12/10 v04), as classes/ecai.ts cites it';

export default defineKey({
  ...minimal({
    id: 'abs.front-held',
    node: 'containerBlock/abstract',
    description:
      "The class's abstract environment, \\begin{abstract} … \\end{abstract}, where the class holds it for its title block: in the front matter after the title's declarations and before the first heading, with no \\maketitle before it. aastex701 and emulateapj keep it for the \\maketitle their first \\section runs (with front.aastex or front.emulateapj); revtex4-2 (APS, AIP) prints \\maketitle right after it (with front.revtex's after-abstract); ecai fills its abstract box at \\begin{document}, before the frontmatter environment prints it (with front.ecai-frontmatter).",
    writes: '\\begin{abstract} … \\end{abstract}',
    ctan: ['aastex', 'emulateapj', 'revtex'],
    features: ['class-styled'],
    params: {
      maketitle: {
        type: 'enum',
        values: ['none', 'after'],
        default: 'none',
        description:
          "what follows the abstract: nothing (aastex701 and emulateapj: the first \\section runs \\maketitle), or \\maketitle (revtex4-2, whose title way writes none: front.revtex's maketitle 'after-abstract')",
      },
      place: {
        type: 'enum',
        values: ['here', 'begin-document'],
        default: 'here',
        description: "where it is set: where the node stands, or at \\begin{document} (\\AtBeginDocument, ecai: the box is filled before the title's \\end{frontmatter} prints it)",
      },
    },
    presets: PRESETS,
    // Each class keeps the environment for its title block (aastex701 l.2342-2373, revtex4 l.4621-4622, revtex4-2 l.2548-2574,
    // ecai l.766-772); the way prints it where the title block will still read it. revtex4-2's profile holds env:abstract for
    // \maketitle (heldByMaketitle, before), which front.revtex's claim meets.
    requires: ['env:abstract'],
    requiresWhen: [{ when: { maketitle: 'after' }, requires: ['cmd:\\maketitle'] }],
    // No claim: under aastex701 and emulateapj the title way owns the \maketitle the first \section runs, under revtex4-2
    // front.revtex claims it whether it writes it or leaves it to this way (its key), and under ecai the frontmatter runs it.
    only: ['class.aastex', 'class.emulateapj', 'class.revtex4-2', 'class.revtex4-2-aip', 'class.ecai'],
    onlyWhen: [
      {
        when: { maketitle: 'none', place: 'here' },
        classes: ['class.aastex', 'class.emulateapj'],
        reason:
          "only aastex701 and emulateapj print a held abstract with no \\maketitle written: their first \\section runs it (aastex701.cls l.7583-7594, emulateapj.cls l.655-662). Under revtex4-2 the abstract would wait for a \\maketitle that front.revtex writes before it (\"Environment abstract undefined\" after it, l.2685), and under ecai an abstract after the frontmatter is on no page",
        evidence: [
          { kind: 'source', file: AASTEX, line: '7583-7594' },
          { kind: 'source', file: EAPJ, line: '655-662' },
          { kind: 'source', file: REVTEX, line: '2629-2654, 2685' },
        ],
      },
      {
        when: { maketitle: 'after' },
        classes: ['class.revtex4-2', 'class.revtex4-2-aip'],
        reason:
          "the \\maketitle after the abstract is revtex4-2's order ('\\maketitle must follow title, authors, abstract', aiptemplate.tex l.50-54); aastex701 forbids an explicit \\maketitle (its first \\section prints the block again and stops, the profile's forbids.names), emulateapj's first \\section would find it spent, and ecai's frontmatter runs its own",
        evidence: [
          { kind: 'source', file: REVTEX, line: '2548-2574, 2629-2654, 2685' },
          { kind: 'source', file: 'Latex Related Research/Latex-lib-main/Source/0908-aip-conference-proceedings/doc/latex/revtex/sample/aip/aiptemplate.tex', line: '50-54' },
        ],
      },
      {
        when: { place: 'begin-document' },
        classes: ['class.ecai'],
        reason:
          "only ecai fills its abstract box globally for a \\maketitle that may come later (\\global\\setbox\\abstract@box, ecai.cls l.766-772, l.849); aastex701 sets up its front matter at \\begin{document} (\\frontmatter@init, l.1922-1926) and revtex's \\absbox is read by the title block in the body, untested from \\AtBeginDocument",
        evidence: [{ kind: 'source', file: ECAI, line: '766-772, 849' }, { kind: 'source', file: AASTEX, line: '1922-1926' }],
      },
    ],
    // The generic title ways write \maketitle where the title stands, before the abstract: under aastex701 the profile refuses
    // them (forbids.names cmd:\maketitle), under revtex4-2 the abstract after their \maketitle stops at "Environment abstract
    // undefined" (revtex4-2.cls l.2685). The class's own title ways leave \maketitle out (front.aastex, front.emulateapj's
    // first-section, front.revtex's after-abstract) or run it with the frontmatter (front.ecai-frontmatter). A title way's
    // parameter is not a rule the key can state: front.emulateapj with maketitle 'here' or front.revtex with maketitle 'here'
    // writes \maketitle before this abstract, which then stops or never prints; pair the presets as the descriptions say.
    conflicts: [
      {
        way: 'front.class-native',
        reason: "it writes \\maketitle at the title's place, before the abstract the class holds for it: under revtex4-2 the abstract after it stops at \"Environment abstract undefined\" (revtex4-2.cls l.2685)",
        evidence: [{ kind: 'source', file: REVTEX, line: '2685' }],
      },
      {
        way: 'front.maketitle',
        reason: "it writes \\maketitle at the title's place, before the abstract the class holds for it: under revtex4-2 the abstract after it stops at \"Environment abstract undefined\" (revtex4-2.cls l.2685)",
        evidence: [{ kind: 'source', file: REVTEX, line: '2685' }],
      },
    ],
    // Set in the class's box (\absbox, \abstract@box: a \vbox), so a float in it is lost, nothing in it breaks across pages, and
    // a footnote in it is aastex701's minipage note or lost; set at \begin{document} (ecai), it is an argument besides.
    gives: { floats: false, breakable: false, footnotes: false, boxDepth: 1 },
    givesWhen: [{ when: { place: 'begin-document' }, gives: { argument: true, verbatim: false } }],
    // Typeset ok (ZeroTeX-NG, 2026-11-07), a two-paragraph abstract whose \write sentinels each reached the page once: aastex
    // under aastex701 (front.aastex's lines, then a \section) and emulateapj under \documentclass{emulateapj} (front.emulateapj's
    // first-section lines, \keywords, a \section); revtex under revtex4-2 [aps,reprint] and [aip,reprint] with the profile's setup
    // line (front.revtex's lines with no \maketitle, then this way's). Untested as a whole: the ecai preset is not typeset, since
    // ecai.cls is neither on CTAN nor in testing-pipeline/settings/classes/files here (front.ecai-frontmatter's key says the same).
    targetEngine: 'untested',
  }),
  evidence: [
    { kind: 'source', file: AASTEX, line: '2342-2373 (frontmatter@abstract into \\absbox), 7583-7594 (the first \\section runs \\maketitle)' },
    { kind: 'source', file: RTX4, line: '4621-4622, 4704-4717, 5065 (emulateapj: the abstract kept in \\absbox)' },
    { kind: 'source', file: EAPJ, line: '655-662 (the first \\section runs \\maketitle)' },
    { kind: 'source', file: REVTEX, line: '2548-2574, 2629-2654, 2685' },
    { kind: 'source', file: ECAI, line: '766-772, 776-810, 849' },
    { kind: 'source', file: `${EXAMPLES}/class.aastex/main.tex`, line: '100-111' },
  ],
});
