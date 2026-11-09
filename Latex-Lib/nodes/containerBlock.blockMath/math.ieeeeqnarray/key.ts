import { defineKey } from '../../../schema/key.ts';
import { minimal } from '../../../schema/minimal.ts';
import { PRESETS } from './presets.ts';

/**
 * math.ieeeeqnarray: IEEEtran's own multi-line display, IEEEeqnarray (IEEEtran.cls l.3621, its starred form l.3624), with the
 * rCl column spec IEEE's documentation uses: the left side flush right, the relation centred with relation spacing, the
 * right side flush left. IEEE's conference template tells authors to use it, or align, instead of eqnarray
 * (IEEE-conference-template-062824.tex l.132-134). The environment is the class's, so the way is for IEEEtran and ieeeconf
 * (a renamed IEEEtran V1.6b) alone.
 */
export default defineKey(
  minimal({
    id: 'math.ieeeeqnarray',
    node: 'containerBlock/blockMath',
    description:
      "IEEEtran's IEEEeqnarray display with the rCl column spec: each line split at its first & into left side, relation and right side (a & = & b), lines broken by \\\\, starred (IEEEeqnarray*) when unnumbered; for IEEEtran (journal, conference, compsoc) and ieeeconf, which define the environment.",
    writes: '\\begin{IEEEeqnarray}{rCl} … & = & … \\\\ … & = & … \\label{…} \\end{IEEEeqnarray}, \\begin{IEEEeqnarray*}{rCl} … & = & … \\end{IEEEeqnarray*}',
    ctan: ['ieeetran'],
    features: ['numbered', 'unnumbered', 'aligned', 'multiline', 'class-styled'],
    presets: PRESETS,
    // amsmath: a display IEEEeqnarray's three columns cannot hold (an align-style line with more than two &, or a nested
    // aligned, split, cases or matrix) is printed as math.amsmath prints it; IEEE's templates load amsmath beside the class.
    loads: [{ pkg: 'amsmath' }],
    requires: ['env:IEEEeqnarray'],
    only: ['class.ieeetran', 'class.ieeetran-compsoc', 'class.ieeeconf-ras'],
    gives: { math: true },
    // Typeset on ZeroTeX-NG under IEEEtran [journal], [conference] and [journal,compsoc]: numbered and starred, one row spanning
    // the columns, row labels, \\[2pt] inside a row, and the amsmath fallbacks. ieeeconf.cls is not on the mirror nor among the
    // class files here, so class.ieeeconf-ras is untested (its V1.6b defines the same IEEEeqnarray, per its profile).
    targetEngine: 'yes',
  }),
);
