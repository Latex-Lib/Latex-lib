import { defineKey } from '../../../schema/key.ts';
import { PRESETS } from './presets.ts';

const requirement = (file: string, line: string) => ({ kind: 'requirement', file: `Template/template-requirement/${file}.md`, line }) as const;

export default defineKey({
  id: 'thm.class-native',
  node: 'containerBlock/mathElement',
  description:
    "The class's own theorem vocabulary: environments it predefines, emitted by name (llncs: bold head, italic body, consecutive numbers; acmart: acmplain on one counter within the section; mdpi's capitalised Theorem, Lemma, ...), and a kind it lacks declared with its own commands only if still undefined (IEEEtran's patched \\newtheorem; elsarticle's and cas's \\newdefinition for upright kinds and cas's \\newproof; siamart's \\newsiamthm and \\newsiamremark with \\crefname; llncs's \\spnewtheorem with head and body fonts; sn-jnl's and OUP's \\theoremstyle{thmstyleone|two|three}; spie's and jmlr's one theorem counter, with jmlr's \\theorembodyfont, \\theoremheaderfont, \\theorempostheader and \\theoremsep set around the declaration where a preset gives them; under aa, whose \\newtheorem takes the head and body fonts after the title, those fonts). 51 of the research's templates do this.",
  writes: '\\begin{theorem}[{…}] … \\end{theorem}; \\@ifundefined{theorem}{\\newtheorem{theorem}{Theorem}}{}',
  features: ['class-styled', 'numbered'],
  params: {
    uprightCommand: { type: 'tex', default: '', description: "the class's command for definitions, examples and remarks (elsarticle's \\newdefinition, siamart's \\newsiamremark); '' for the plain kinds' command" },
    plainCommand: { type: 'tex', default: '', description: "the class's command for theorem-like kinds (siamart's \\newsiamthm, llncs's \\spnewtheorem), used where the class has it; '' for \\newtheorem" },
    plainFonts: { type: 'tex', default: '', description: "the head and body fonts after the name, for a plainCommand that takes them (\\spnewtheorem: {\\bfseries}{\\itshape}); '' for none" },
    uprightFonts: { type: 'tex', default: '', description: "the head and body fonts after the name, for an uprightCommand that takes them ({\\itshape}{\\rmfamily}); '' for none" },
    proofCommand: { type: 'tex', default: '', description: "the class's command that declares a proof environment where none is defined (cas's \\newproof); '' for none" },
    theoremStyles: {
      type: 'enum',
      values: ['class', 'thmstyle'],
      default: 'class',
      compat: true,
      description: "the style each declared kind takes: the class's current one, or sn-jnl's and OUP's thmstyleone (theorem-like), thmstyletwo (example, remark) and thmstylethree (definition)",
    },
    theoremCounter: {
      type: 'enum',
      values: ['own', 'plain', 'all'],
      default: 'own',
      description: "the counter a declared kind takes: its own, the theorem's for the theorem-like kinds, or the theorem's for every kind (the theorem is declared first if the class lacks it)",
    },
    crefNames: { type: 'boolean', default: false, description: 'give each declared kind its \\crefname (Remark, Remarks), as siamart\'s sample does' },
    capitalise: { type: 'boolean', default: false, compat: true, description: "print each kind in the class's capitalised environment (mdpi's Theorem, Lemma, Definition)" },
    theoremSetters: {
      type: 'enum',
      values: ['none', 'jmlr'],
      default: 'none',
      compat: true,
      description: "set the class's theorem-style setters before a declared kind and restore them after: none, or jmlr's \\theorembodyfont, \\theoremheaderfont, \\theorempostheader and \\theoremsep (jmlr.dtx l.2590-2640), which its \\newtheorem records for the kind",
    },
    bodyFont: { type: 'tex', default: '', description: "with theoremSetters jmlr: the declared kind's body font (\\theorembodyfont{\\upshape}); '' keeps the class's (\\normalfont\\itshape)" },
    headerFont: { type: 'tex', default: '', description: "with theoremSetters jmlr: the declared kind's head font (\\theoremheaderfont{\\scshape}); '' keeps the class's (\\normalfont\\bfseries)" },
    postHeader: { type: 'tex', default: '', description: "with theoremSetters jmlr: the text after the head (\\theorempostheader{:}); '' keeps the class's (none)" },
    separator: { type: 'tex', default: '', description: "with theoremSetters jmlr: what follows the head before the body (\\theoremsep{\\newline}); '' keeps the class's (none)" },
  },
  presets: PRESETS,
  targetEngine: 'yes',
  loads: [],
  // A kind the class lacks it declares itself (the handler's fallback), so it can meet another way's declaration of it
  // ("Environment corollary already defined" beside thm.tcolorbox, the copy's amsart.A run). Under a class that has the
  // kind, the name is the class's: the resolver does not count a class-native way's names against its class.
  defines: [
    { name: 'env:{kind}', when: { capitalise: false } },
    { name: 'env:theorem', when: { capitalise: false, theoremCounter: ['plain', 'all'] } },
    { name: 'env:proof', when: { proofCommand: '\\newproof' } },
  ],
  claims: [],
  // The declaration commands a preset names for the plain kinds and the proof (siamart's \newsiamthm, llncs's \spnewtheorem,
  // cas's \newproof); '' asks for nothing. uprightCommand is not required: it falls back to \newtheorem where the class lacks it
  // (elsarticle's \newdefinition under amsart, above).
  requires: ['cmd:{plainCommand}', 'cmd:{proofCommand}'],
  requiresWhen: [
    { when: { uprightCommand: '\\newsiamremark' }, requires: ['cmd:\\newsiamremark'] },
    { when: { theoremStyles: 'thmstyle' }, requires: ['style:thmstyleone', 'style:thmstyletwo', 'style:thmstylethree'] },
    // jmlrutils' setters (jmlr.dtx l.2596-2637); the profile does not list them yet.
    { when: { theoremSetters: 'jmlr' }, requires: ['cmd:\\theorembodyfont', 'cmd:\\theoremheaderfont', 'cmd:\\theorempostheader', 'cmd:\\theoremsep'] },
  ],
  classes: {
    deny: [
      {
        class: 'class.mdpi',
        reason: "mdpi's statements are its capitalised environments (Theorem, Lemma, ...): the lower-case names it lacks would be declared afresh, outside the class's style and counters",
        unless: { capitalise: true },
        evidence: [{ kind: 'source', file: 'testing-pipeline/settings/classes/files/Definitions/mdpi.cls', line: '255-309' }],
      },
      {
        class: 'class.sn-jnl',
        reason: "sn-jnl declares no statement and its template declares each under the class's thmstyleone, thmstyletwo or thmstylethree: without them every kind takes amsthm's plain style",
        unless: { theoremStyles: 'thmstyle' },
        evidence: [requirement('Springer_Nature_SN_Jnl', '75')],
      },
      {
        class: 'class.oup-authoring-template',
        reason: "the OUP class declares no statement and its template declares each under the class's thmstyleone, thmstyletwo or thmstylethree: without them every kind takes amsthm's plain style",
        unless: { theoremStyles: 'thmstyle' },
        evidence: [{ kind: 'source', file: 'Latex Related Research/Latex-lib-main/Source/0914-oup-authoring-template/oup-authoring-template.tex', line: '50-60' }],
      },
    ],
    only: [
      'class.llncs',
      'class.acmart',
      'class.elsarticle',
      'class.ieeetran',
      'class.beamer',
      'class.siamart',
      'class.aa',
      'class.lipics',
      'class.amsart',
      'class.amsbook',
      'class.amsproc',
      'class.jlreq',
      'class.cas-dc',
      'class.cas-sc',
      'class.eccv',
      'class.sn-jnl',
      'class.oup-authoring-template',
      'class.jmlr-pmlr',
      'class.spie',
      'class.elegantpaper',
      'class.mdpi',
    ],
    onlyWhen: [
      {
        when: { capitalise: true },
        classes: ['class.mdpi'],
        reason: 'only mdpi defines the capitalised environments',
        evidence: [{ kind: 'source', file: 'testing-pipeline/settings/classes/files/Definitions/mdpi.cls', line: '255-309' }],
      },
      {
        when: { theoremStyles: 'thmstyle' },
        classes: ['class.sn-jnl', 'class.oup-authoring-template'],
        reason: 'only sn-jnl and the OUP class define the thmstyleone, thmstyletwo and thmstylethree styles',
        evidence: [requirement('Springer_Nature_SN_Jnl', '75'), { kind: 'source', file: 'Latex Related Research/Latex-lib-main/Source/0914-oup-authoring-template/oup-authoring-template.cls', line: '2639-2692' }],
      },
      {
        when: { theoremSetters: 'jmlr' },
        classes: ['class.jmlr-pmlr'],
        reason: 'only jmlr (its jmlrutils package) defines \\theorembodyfont, \\theoremheaderfont, \\theorempostheader and \\theoremsep',
        evidence: [{ kind: 'source', file: 'Latex Related Research/Latex-lib-main/Source/0662-jmlr/jmlr.dtx', line: '2590-2686' }],
      },
    ],
  },
  packages: { conflicts: [] },
  context: { gives: {}, needs: { paragraph: true } },
  parents: {},
  // A class with no theorems of its own (a template's own class built on book or report): the kernel's \newtheorem stands in.
  fallback: { way: 'thm.kernel' },
  evidence: [requirement('Springer_LNCS', '81'), requirement('ACM', '85'), requirement('ACM', '199'), requirement('IEEEtran_Journal', '100'), requirement('Elsarticle', '113'), requirement('Beamer', '77'), requirement('SIAM_Siamart', '114'), requirement('AandA', '82'), requirement('LIPIcs', '60'), { kind: 'solution', file: 'Solution/0260-amsproc.md', lines: '50' }, { kind: 'solution', file: 'Solution/0529-jlreq.md', lines: '45' }, requirement('Elsevier_CAS_SC', '88'), { kind: 'solution', file: 'Solution/0186-siam-siamart.md', lines: '55' }, { kind: 'solution', file: 'Solution/0712-llncs.md', lines: '61' }, { kind: 'solution', file: 'Solution/0662-jmlr.md', lines: '53' }, { kind: 'source', file: 'Latex Related Research/Latex-lib-main/Source/0662-jmlr/pmlr-sample.tex', line: '22-26' }, { kind: 'solution', file: 'Solution/0188-elegantpaper.md', lines: '59' }, { kind: 'solution', file: 'Solution/0894-mdpi.md', lines: '77' }, { kind: 'solution', file: 'Solution/0914-oup-authoring-template.md', lines: '56' }, requirement('Springer_Nature_SN_Jnl', '75')],
  status: 'draft',
});
