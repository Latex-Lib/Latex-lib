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
    // Typeset in bib.class-bst's b45 probes: \cite (aa, aastex, elsarticle, achemso, revtex aip, acmart, mnras...), \citep (cas-dc,
    // elsarticle-harv, icml, apa7, jmlr, jss, Frontiers), \citet (cas-sc, elsarticle-num-names, acmart), \onlinecite (revtex4-2
    // aps), \citeN (ascelike), \citenum (achemso).
    targetEngine: 'yes',
  }),
);
