import { defineKey } from '../../../schema/key.ts';
import { minimal } from '../../../schema/minimal.ts';
import { PRESETS } from './presets.ts';

export default defineKey(
  minimal({
    id: 'ack.llncs-credits',
    node: 'containerBlock/acknowledgement',
    description:
      "Springer LNCS's credits environment (llncs, and ECCV on it): \\begin{credits} \\subsubsection{\\ackname} … \\end{credits}, small text under a small bold run-in head, \\ackname (Acknowledgments.) or, for a Disclosure of Interests title, \\discintname, else the node's title.",
    writes: '\\begin{credits} \\subsubsection{\\ackname} … \\end{credits}',
    ctan: ['llncs'],
    features: ['class-styled', 'run-in-head', 'bold-head', 'small-type'],
    presets: PRESETS,
    requires: ['env:credits', 'cmd:\\ackname', 'cmd:\\discintname'],
    // eccv runs on llncs (class.eccv's base), so it would take the way from llncs alone; it is named as the form is ECCV's too.
    only: ['class.llncs', 'class.eccv'],
    // Typeset under llncs (the llncs preset's compile evidence); not under eccv, whose eccv.sty is not in this checkout: its
    // loads (eccv.sty l.43-72, 249-255) touch neither credits nor \subsubsection.
    targetEngine: 'yes',
  }),
);
