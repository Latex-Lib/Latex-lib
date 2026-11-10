import { defineKey } from '../../../schema/key.ts';
import { minimal } from '../../../schema/minimal.ts';
import CLASS_BST from '../../containerBlock.refContainer/bib.class-bst/key.ts';
import { PRESETS } from './presets.ts';

export default defineKey(
  minimal({
    id: 'bib.class-bst',
    node: 'cite/cite',
    description:
      "The citation paired with bib.class-bst's list, with the class's own commands: \\cite{key}, natbib's \\citep and \\citet where the class loads natbib, revtex's \\onlinecite, ascelike's \\citeN, \\citeNP and \\citeA, achemso's \\citenum.",
    // The cite ways share their list way's id (../index.ts); bib.class-bst's list is for these classes only, so its citations are too.
    writes: '\\cite{…}',
    ctan: ['natbib'],
    features: ['numeric-citations', 'author-year', 'class-styled'],
    params: {
      command: {
        type: 'enum',
        values: ['cite', 'citep', 'citet', 'citealp', 'citeauthor', 'citenum', 'citeyear', 'onlinecite', 'citeN', 'citeNP', 'citeA'],
        default: 'cite',
        description: 'the citation command',
      },
      tie: { type: 'boolean', default: false, description: 'a tie before the citation (~\\cite)' },
    },
    presets: PRESETS,
    requiresWhen: [
      // natbib's commands, which the class (or bib.class-bst's natbib param) loads.
      { when: { command: ['citep', 'citet', 'citealp', 'citeauthor', 'citenum'] }, requires: ['pkg:natbib'] },
      // The class's own commands: revtex4-2's \onlinecite (revtex4-2.cls l.7069), ascelike's \citeN, \citeNP, \citeA, \citeyear.
      { when: { command: ['onlinecite', 'citeN', 'citeNP', 'citeA', 'citeyear'] }, requires: ['cmd:\\{command}'] },
    ],
    only: CLASS_BST.classes.only,
    // The class's own commands, for the presets that print them: the matrix files by `only` and `onlyWhen`, not by `requiresWhen`.
    // natbib's commands are not bound here: under aaai, cas and imsart natbib comes from the list's own `natbib` parameter.
    onlyWhen: [
      {
        when: { command: 'onlinecite' },
        classes: ['class.revtex4-2', 'class.aastex'],
        reason: "\\onlinecite is revtex4-2's (l.7069), which aastex701 copies (l.6448, 6471) and emulateapj, built on aastex, has; under every other class of the list's `only` it stops at 'Undefined control sequence'",
        evidence: [
          { kind: 'source', file: 'Latex Related Research/Latex-lib-main/Source/0908-aip-conference-proceedings/tex/latex/revtex/revtex4-2.cls', line: '7069, 7092' },
          { kind: 'source', file: 'testing-pipeline/settings/classes/files/aastex701.cls', line: '6448, 6471' },
          { kind: 'compile', cell: 'batch 4 round 1 (testing-pipeline/out/fetched/batch4-round1): aa.A (document db0c8b2a439d3c1e5c4e7, result d961ea92a5) and 40 more pairs, 359 cells whose first error is \\onlinecite (1,147 failing branches in the group with no context, 59 more under a heading or title); bib.class-bst@cite@revtex-online passes under revtex4-2-aip.A (26 of 26), revtex4-2-aps.A, aastex.A, aastex.B and emulateapj.A, and fails 1,066 not-denied branches at the error everywhere else' },
        ],
      },
      {
        when: { command: 'citeN' },
        classes: ['class.ascelike', 'class.acmart'],
        reason: "\\citeN is ascelike's (re-made at \\begin{document}) and acmart's; under every other class of the list's `only` it stops at 'Undefined control sequence'",
        evidence: [
          { kind: 'source', file: 'Latex-Lib/classes/ascelike.ts', line: '18' },
          { kind: 'compile', cell: 'batch 4 round 1 (testing-pipeline/out/fetched/batch4-round1): 383 cells in 37 pairs whose first error is \\citeN (942 failing branches in the group with no context; agu.A document de3adb5ff077249d92e96, result ee8db798cb); bib.class-bst@cite@ascelike-textual passes under ascelike.A and the acmart settings (aamas, acmart-*, vldb: 6-7 each, no error) and fails 876 not-denied branches at the error elsewhere' },
        ],
      },
      {
        when: { command: ['citeNP', 'citeA'] },
        classes: ['class.ascelike'],
        reason: "\\citeNP and \\citeA are ascelike's own forms",
        evidence: [{ kind: 'source', file: 'Latex-Lib/classes/ascelike.ts', line: '18' }],
      },
    ],
    // Typeset in bib.class-bst's b45 probes: \cite (aa, aastex, elsarticle, achemso, revtex aip, acmart, mnras...), \citep (cas-dc,
    // elsarticle-harv, icml, apa7, jmlr, jss, Frontiers), \citet (cas-sc, elsarticle-num-names, acmart), \onlinecite (revtex4-2
    // aps), \citeN (ascelike), \citenum (achemso).
    targetEngine: 'yes',
  }),
);
