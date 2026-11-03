import { defineKey } from '../../../schema/key.ts';
import { PRESETS } from './presets.ts';

const requirement = (file: string, line: string) => ({ kind: 'requirement', file: `Template/template-requirement/${file}.md`, line }) as const;

export default defineKey({
  id: 'thm.class-native',
  node: 'containerBlock/mathElement',
  description:
    "The class's own theorem vocabulary: environments it predefines, emitted by name (llncs: bold head, italic body, consecutive numbers; acmart: acmplain on one counter within the section), and a kind it lacks declared with its own commands only if still undefined (IEEEtran's patched \\newtheorem, elsarticle's \\newdefinition for upright kinds; under aa, whose \\newtheorem takes the head and body fonts after the title, those fonts). 51 of the research's templates do this.",
  features: ['class-styled', 'numbered'],
  params: {
    uprightCommand: { type: 'tex', default: '', description: "the class's command for definitions, examples and remarks (elsarticle's \\newdefinition); '' for \\newtheorem" },
  },
  presets: PRESETS,
  zerotex: 'yes',
  loads: [],
  // A kind the class lacks it declares itself (the handler's fallback), so it can meet another way's declaration of it
  // ("Environment corollary already defined" beside thm.tcolorbox, the copy's amsart.A run). Under a class that has the
  // kind, the name is the class's: the resolver does not count a class-native way's names against its class.
  defines: ['env:{kind}'],
  claims: [],
  requires: [],
  classes: {
    deny: [],
    only: ['class.llncs', 'class.acmart', 'class.elsarticle', 'class.ieeetran', 'class.beamer', 'class.siamart', 'class.aa', 'class.lipics', 'class.amsart', 'class.amsbook', 'class.amsproc', 'class.jlreq'],
  },
  packages: { conflicts: [] },
  context: { gives: {}, needs: { paragraph: true } },
  parents: {},
  // A class with no theorems of its own (a template's own class built on book or report): the kernel's \newtheorem stands in.
  fallback: { way: 'thm.kernel' },
  evidence: [requirement('Springer_LNCS', '81'), requirement('ACM', '85'), requirement('ACM', '199'), requirement('IEEEtran_Journal', '100'), requirement('Elsarticle', '113'), requirement('Beamer', '77'), requirement('SIAM_Siamart', '114'), requirement('AandA', '82'), requirement('LIPIcs', '60'), { kind: 'solution', file: 'Solution/0260-amsproc.md', lines: '50' }, { kind: 'solution', file: 'Solution/0529-jlreq.md', lines: '45' }],
  status: 'draft',
});
