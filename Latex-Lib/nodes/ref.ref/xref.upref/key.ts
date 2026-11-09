import { defineKey } from '../../../schema/key.ts';
import { minimal } from '../../../schema/minimal.ts';
import { PRESETS } from './presets.ts';

/** The AMS kit's upref.dtx (amscls v2.04), read in the research's amsproc source. */
const UPREF = 'Latex Related Research/Latex-lib-main/Source/0260-amsproc/upref.dtx';

const base = minimal({
  id: 'xref.upref',
  node: 'ref/ref',
  description:
    "The kernel's \\ref{label} with the AMS package upref loaded (amscls), so the number prints upright inside italic or slanted text such as a theorem's body; after its name when the node gives one (Figure~\\ref{…}). amsgen is loaded first, since upref calls its \\@xp and \\sw@slant without loading it. Shipped in the amsproc kit, loaded by no sample.",
  writes: '\\usepackage{amsgen} \\usepackage{upref} … …~\\ref{…}',
  ctan: ['upref', 'amscls'],
  features: ['named-refs'],
  params: {
    name: { type: 'boolean', default: true, description: "the node's name before the number, tied to it" },
  },
  presets: PRESETS,
  // upref's \@setref calls \@xp (and, under hyperref, \sw@slant): amsgen's, which upref does not load (upref.dtx l.66-144).
  // Under article alone every \ref stopped at "Undefined control sequence. \@xp"; with amsgen first it typeset, with and without
  // hyperref (scratch cases upref-article, upref-hyperref). amsmath and the AMS classes load amsgen themselves; a second load is a no-op.
  loads: [{ pkg: 'amsgen' }, { pkg: 'upref' }],
  loadOrder: [{ after: 'amsgen', reason: "upref uses amsgen's \\@xp and \\sw@slant (upref.dtx l.119-140) and does not load it" }],
  targetEngine: 'yes',
});

export default defineKey({
  ...base,
  evidence: [
    ...base.evidence,
    { kind: 'source', file: UPREF, line: '58-66, 97-144' },
    {
      kind: 'compile',
      reproducer:
        '\\documentclass{article}\\usepackage{upref} with a \\ref in a theorem: Undefined control sequence \\@xp at the \\ref; with \\usepackage{amsgen} before upref (and with hyperref before both): ok, 1 page (ZeroTeX-NG, typeset-dir.ts)',
    },
  ],
});
