import { defineClass } from '../schema/class.ts';
import elsarticle from './elsarticle.ts';

/**
 * elsarticle in its single-column 3p format (the elsarticle-3p setting, batch 3): the same elsarticle.cls (v3.5, MiKTeX
 * 9766) as class.elsarticle, read from the class source, not yet measured by the class probe. 3p sets `\jtype` to 3 (l.85)
 * and so, unlike preprint (jtype 0, which class.elsarticle was measured on), loads geometry with no options and sets an A4
 * page with a 468pt by 622pt text block, centred (l.1266-1279); fleqn.clo comes only with twocolumn (l.1280), which the
 * setting does not give. So geometry joins the preloads: a way that loaded geometry with an option would stop at "Option
 * clash for package geometry". Everything else is class.elsarticle's: natbib with numbers (l.1240-1243), so cite is refused,
 * graphicx (l.116), and the same names.
 *
 * It is class.elsarticle with its own preloads and layout, keyed by its setting's id (`classKeys`), so nothing here changes
 * elsarticle-preprint or elsarticle-5p; `base` keeps class.elsarticle's key rules (front.titling, thm.class-native's `only`)
 * on this profile.
 */
export default defineClass({
  ...elsarticle,
  id: 'class.elsarticle-3p',
  name: "elsarticle",
  base: 'class.elsarticle',
  preloads: [...elsarticle.preloads, { pkg: "geometry" }],
  // 3p: textwidth=468pt (l.1272), one column, 10pt type (the class default, l.112). To be confirmed by the first run's log.
  layout: { columns: 1, textwidth: "468.0pt", fontsize: "10pt" },
  evidence: [
    { kind: 'source', file: 'elsarticle.cls (MiKTeX package elsarticle, v3.5)', line: '85 (3p: \\jtype 3), 112 (10pt by default)' },
    { kind: 'source', file: 'elsarticle.cls (MiKTeX package elsarticle, v3.5)', line: '1266-1280 (\\RequirePackage{geometry}, 468pt by 622pt, fleqn only in two columns)' },
    { kind: 'source', file: 'testing-pipeline/settings/classes/elsarticle-3p.json', line: '1' },
    ...elsarticle.evidence,
  ],
});
