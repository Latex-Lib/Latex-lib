import { defineClass } from '../schema/class.ts';
import elsarticle from './elsarticle.ts';

/**
 * elsarticle in its two-column 5p format (the elsarticle-5p setting): the same elsarticle.cls (v3.5) as class.elsarticle,
 * keyed by its setting's id (`classKeys`), so a key rule can name this format alone, as class.elsarticle-3p does for 3p;
 * `base` keeps class.elsarticle's key rules (front.titling, thm.class-native's `only`) on this profile. 5p loads geometry
 * (local probe, ZeroTeX-NG: \@ifpackageloaded{geometry} true) and sets two 252pt columns of a 522pt text block, 37.75394pt
 * from either edge of its 597.50787pt page (batch 4 round 1, COMPAT-GEOMETRY), so geometry joins the preloads, as for 3p: a
 * way that loaded geometry with an option would stop at "Option clash for package geometry". Its margins leave a note column
 * of 15.75394pt, which the five margin-note ways deny (OVF-ELS5P). Nothing here changes elsarticle-preprint.
 */
export default defineClass({
  ...elsarticle,
  id: 'class.elsarticle-5p',
  name: "elsarticle",
  base: 'class.elsarticle',
  preloads: [...elsarticle.preloads, { pkg: "geometry" }],
  layout: { columns: 2, textwidth: "522.0pt", fontsize: "10pt" },
  evidence: [
    { kind: 'compile', cell: 'local probe (ZeroTeX-NG, 2026-11-09) of \\documentclass[5p]{elsarticle}: geometry loaded, \\textwidth 522.0pt, \\columnwidth 252.0pt, 10pt, two columns' },
    { kind: 'compile', cell: 'batch 4 round 1, elsarticle-5p.A: COMPAT-GEOMETRY paperWidth 597.50787pt, oddLeft and evenLeft 37.75394pt, textWidth 522.0pt' },
    { kind: 'source', file: 'testing-pipeline/settings/classes/elsarticle-5p.json', line: '1' },
    ...elsarticle.evidence,
  ],
});
