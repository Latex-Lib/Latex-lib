import { defineClass } from '../schema/class.ts';
import acmart from './acmart.ts';

/**
 * acmart in its sigplan proceedings format with screen (the acmart-sigplan setting, batch 3: `\documentclass[sigplan,screen]
 * {acmart}`, as the SIGPLAN kit loads it). The same acmart.cls (2026/08/16 v2.20) as class.acmart, read from the class
 * source, not yet measured by the class probe. sigplan loads every package manuscript loads (l.290-308, 530, 595-596, 624,
 * 786-805, 878) and, at the end of the preamble, balance with no options (l.127-130, 3478-3526).
 *
 * What sigplan and screen change is set by the class, not loaded: sans-serif URLs (`\urlstyle{sf}`, l.547-548), bold
 * period-separated caption labels (l.895-897), 'n.' enumerate labels (l.990-994; the list packages are already denied under
 * class.acmart by ACM's policy), and under screen a `\hypersetup{colorlinks, linkcolor=ACMPurple, ...}` at the end of the
 * preamble (l.556-563), after any way's own `\hypersetup` (that way's colours give way; nothing stops). hyperref is among
 * class.acmart's preloads with no options, so a way that gives it options is already unfit.
 *
 * The page turns two-column at `\maketitle` (l.2442), so the layout has two columns: keys that need one column
 * (`classes.oneColumn`: cols.paracol, tbl.longtable) are unfit here.
 *
 * It is class.acmart with its own layout and balance among the preloads, keyed by its setting's id (`classKeys`); `base`
 * keeps class.acmart's key rules on this profile.
 */
export default defineClass({
  ...acmart,
  id: 'class.acmart-sigplan',
  name: "acmart",
  base: 'class.acmart',
  preloads: [...acmart.preloads, { pkg: "balance" }],
  // sigplan: letter paper (614.295pt) with 0.75in inner and outer margins and a 2pc column gap (l.664-669), so
  // \textwidth = 614.295pt - 108.405pt = 505.89pt and each column 240.945pt; 10pt type (l.277-278).
  layout: { columns: 2, textwidth: "505.89pt", fontsize: "10pt" },
  evidence: [
    { kind: 'source', file: 'acmart.cls (MiKTeX package acmart, 2026/08/16 v2.20)', line: '238-239, 277-278 (proceedings format, 10pt)' },
    { kind: 'source', file: 'acmart.cls (MiKTeX package acmart, 2026/08/16 v2.20)', line: '664-669 (geometry)' },
    { kind: 'source', file: 'acmart.cls (MiKTeX package acmart, 2026/08/16 v2.20)', line: '2442 (\\twocolumn at \\maketitle)' },
    { kind: 'source', file: 'acmart.cls (MiKTeX package acmart, 2026/08/16 v2.20)', line: '74-81, 547-548, 556-563 (screen, \\urlstyle, colorlinks)' },
    { kind: 'source', file: 'acmart.cls (MiKTeX package acmart, 2026/08/16 v2.20)', line: '127-130, 3478-3532 (balance)' },
    { kind: 'source', file: 'testing-pipeline/settings/classes/acmart-sigplan.json', line: '1' },
    ...acmart.evidence,
  ],
});
