import { defineClass } from '../schema/class.ts';
import ieeetran from './ieeetran.ts';

/**
 * IEEEtran in its Computer Society journal format (`[journal,compsoc]`, the
 * ieeetran-compsoc setting, batch 2): the same IEEEtran.cls (2015/08/26
 * V1.8b) as class.ieeetran, read from the class source, not yet measured by
 * the class probe. compsoc changes only fonts (\rmdefault ppl, l.500,
 * through \renewcommand, no package), heading styles, section numbers
 * (arabic) and the page: it loads no package (the newtxmath search,
 * l.466-479, runs only under comsoc, l.482), defines the same sectioning counters
 * and environments, and keeps \appendices (l.5755), so it refuses
 * appendix.sty as class.ieeetran does.
 *
 * It is class.ieeetran with its own layout: everything the host and filing
 * read is taken from that profile, since both are named IEEEtran. The host
 * finds a class's facts by that name (latexLibClasses keeps the last profile
 * read, class.ieeetran: 'ieeetran-compsoc.ts' sorts before 'ieeetran.ts'),
 * and a way unfit for either profile is unfit for every IEEEtran setting
 * (factsOf's `unfit` lists names). A rule found under compsoc alone belongs
 * in class.ieeetran, where it holds for the journal and conference settings
 * too. `base` keeps class.ieeetran's key rules (sectsty's deny, the
 * class-native ways' `only`) on this profile; without it every IEEEtran
 * class-native way would be unfit here, and so for every IEEEtran setting.
 */
export default defineClass({
  ...ieeetran,
  id: 'class.ieeetran-compsoc',
  name: "IEEEtran",
  base: 'class.ieeetran',
  // compsoc journal: \columnsep 12bp, \textwidth 7in plus \columnsep (l.1752-1760), 7in + 12bp = 517.935pt; two columns, 10pt
  // (the class default). The journal's 43pc (516pt, l.1735) is replaced. To be confirmed by the class probe or the first run's log.
  layout: { columns: 2, textwidth: "517.935pt", fontsize: "10pt" },
  evidence: [
    { kind: 'source', file: 'IEEEtran.cls (MiKTeX package ieeetran, 2015/08/26 V1.8b)', line: '1752-1760' },
    { kind: 'source', file: 'IEEEtran.cls (MiKTeX package ieeetran, 2015/08/26 V1.8b)', line: '466-482, 500' },
    { kind: 'source', file: 'IEEEtran.cls (MiKTeX package ieeetran, 2015/08/26 V1.8b)', line: '5755' },
    { kind: 'source', file: 'testing-pipeline/settings/classes/ieeetran-compsoc.json', line: '1' },
    ...ieeetran.evidence,
  ],
});
