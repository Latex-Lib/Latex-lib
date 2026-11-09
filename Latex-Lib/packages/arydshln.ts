import { definePackage } from '../schema/class.ts';
import { ctan } from '../schema/minimal.ts';

export default definePackage({
  id: "arydshln",
  description: "arydshln: dashed rules in tables.",
  options: {},
  exclusive: [],
  conflicts: [
    {
      pkg: 'colortbl',
      // colortbl loaded after arydshln takes back the array internals arydshln patched: 69 of 73 documents with colortbl (or
      // xcolor[table]) after arydshln show it in the copy's article, report, amsart and scrartcl A runs. The host does not honour
      // loadOrder, so the pair is kept apart; classes that preload colortbl before arydshln (cas-dc, cas-sc, mdpi, moderncv) are
      // denied too, which an order-aware rule would lift. The 120 s hang the scrreprt.A bisection (d59764a3f15ae7d5b63c9) found was
      // General's table writing \par in a spanning cell: tbl.arydshln's key keeps General's tables away (conflicts: general 'table').
      // The bisection never tested its one-branch halves, so tbl.colortbl@header-band was never shown to be needed.
      reason: "colortbl loaded after arydshln undoes arydshln's array patches: \\hdashline stops at an undefined \\adl@rowsL and ;{dash/gap} at 'Illegal pream-token'",
      evidence: [{ kind: 'compile', cell: "af8ae984620f (the copy's article.A run, document d12c7a7026a2503848c37: arydshln l.19, \\usepackage[table]{xcolor} l.21; '! Undefined control sequence' in \\adl@hline at l.70 \\hdashline)" }],
    },
  ],
  // Documentation only: the host does not honour loadOrder, so tbl.arydshln prints \usepackage{array} before arydshln itself (a
  // later \usepackage{array} is then a no-op) and keeps tbl.colortbl apart (colortbl patches array again, whatever came first).
  loadOrder: [
    {
      after: 'longtable',
      reason:
        "arydshln adapts longtable only when longtable is already loaded; a longtable loaded after it runs arydshln's row and rule code with no row state: 'Undefined control sequence' in \\adl@@cr (\\adl@rowsL), \\adl@vlineL and \\adl@vlineR (copy batch-3b article, amsart, report and scrartcl A runs: 95 of 168 documents with arydshln in force and longtable after it, 0 of 103 with longtable first; article.A d726f2f8b00cf6df968e0 result 1c7b69896ed8 l.377). tbl.arydshln prints longtable before arydshln itself",
    },
    {
      after: 'array',
      reason:
        "arydshln patches array's preamble scanner and \\hline; array loaded after it (awesomebox, tabularx and nicematrix require it, xcolor[table] through colortbl) restores the unpatched code: 'Illegal pream-token (;)', \\adl@hline undefined (copy batch-3b article.A: 80 of 80 fit tbl.arydshln branches whose log loads array after arydshln, awesomebox 60, colortbl 17, nicematrix 2, tabularx 1; report.A 86 of 86; with array or colortbl first, 0 own errors in 42 documents, 59 branches; e.g. dcf918d94336db5017f17 result d2cba02525)",
    },
  ],
  defines: [],
  targetEngine: 'untested',
  evidence: [ctan("arydshln"), { kind: 'manual', of: "arydshln", section: "2 Usage: \\hdashline, \\cdashline, : and ;{dash/gap}, \\dashlinedash, \\dashlinegap", url: 'https://ctan.org/pkg/arydshln' }],
});
