import { defineClass } from '../schema/class.ts';
import revtex from './revtex4-2.ts';

/**
 * revtex4-2 with its AIP society file for J. Chem. Phys. in the reprint format
 * (`[aip,jcp,reprint]`, the revtex4-2-aip setting, batch 2): the same
 * revtex4-2.cls (2022/06/05 4.2f) as class.revtex4-2, read from the class
 * source and aip4-2.rtx, not yet measured by the class probe. aip4-2.rtx loads
 * no package (no \RequirePackage in it); reprint at 10pt reads aps10pt4-2.rtx
 * (aip4-2.rtx l.614-622), whose page is APS's: \textwidth 42.5pc, two columns
 * (aps10pt4-2.rtx l.114-115). jcp sets only author-year off (l.644-647). The
 * class code that every revtex4-2 refusal rests on (incompatible@package,
 * ltxgrid, the array copies at \begin{document}) is the class's, whatever the
 * society.
 *
 * It is class.revtex4-2 with its own evidence: everything the host and filing
 * read is taken from that profile, since both are named revtex4-2. The host
 * finds a class's facts by that name (latexLibClasses keeps the last profile
 * read, class.revtex4-2: 'revtex4-2-aip.ts' sorts before 'revtex4-2.ts'), and
 * a way unfit for either profile is unfit for both settings (factsOf's
 * `unfit` lists names). `base` keeps class.revtex4-2's key rules (abstract,
 * titling, sectsty, twocolumn, apacite, etoc, colortbl denies) on this profile.
 *
 * Its one addition, mcite, holds for the same code under APS: revtex4-2.cls
 * l.6453-6455 refuses cite, mcite and multicol alike. No way loads mcite
 * today, so it changes no fit (class.revtex4-2 could take it too). The APS
 * amsthm policy is APS's (REVTeX_APS.md), not AIP's, but forbids.policy is
 * read by no fit rule, so it is kept as it stands.
 */
export default defineClass({
  ...revtex,
  id: 'class.revtex4-2-aip',
  name: "revtex4-2",
  base: 'class.revtex4-2',
  forbids: {
    ...revtex.forbids,
    technical: [
      ...revtex.forbids.technical,
      { pkg: "mcite", reason: "revtex4-2 stops at \\begin{document} when mcite is loaded: \\incompatible@package{mcite} (revtex4-2.cls l.6454; l.80-87: \"Class revtex4-2 Error: The mcite package cannot be used with revtex4-2\", then \\stop), as for cite and multicol (l.6453, 6455), in every society", evidence: [{ kind: 'source', file: 'revtex4-2.cls (MiKTeX package revtex, 2022/06/05 4.2f)', line: '80-87, 6453-6455' }] },
    ],
  },
  // reprint at 10pt: aps10pt4-2.rtx's \textwidth 42.5pc = 510pt, two columns (\twocolumn@sw under reprint), as revtex4-2-aps.A measured.
  layout: { columns: 2, textwidth: "510.0pt", fontsize: "10pt" },
  evidence: [
    { kind: 'source', file: 'aip4-2.rtx (MiKTeX package revtex, 4.2f)', line: '614-622' },
    { kind: 'source', file: 'aip4-2.rtx (MiKTeX package revtex, 4.2f)', line: '644-647' },
    { kind: 'source', file: 'aps10pt4-2.rtx (MiKTeX package revtex, 4.2f)', line: '114-115' },
    { kind: 'source', file: 'revtex4-2.cls (MiKTeX package revtex, 2022/06/05 4.2f)', line: '6112, 6450, 7042' },
    { kind: 'source', file: 'testing-pipeline/settings/classes/revtex4-2-aip.json', line: '1' },
    ...revtex.evidence,
  ],
});
