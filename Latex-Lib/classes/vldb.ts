import { defineClass } from '../schema/class.ts';
import acmart from './acmart.ts';

/**
 * PVLDB Vol. 20 / VLDB 2027 (the vldb setting, batch 3): acmart (2026/08/16 v2.20) in sigconf with nonacm, and the pinned
 * pvldb.sty ('2026/07/06 v1.0', testing-pipeline/settings/classes/files/pvldb.sty, sha256 37e9341f...) loaded right after
 * the class, as the VLDB template's main.tex does. Its name is "acmart", the setting's class, as latexLib's check requires.
 *
 * acmart in sigconf loads every package manuscript loads (l.290-308, 530, 595-596, 624, 786-805, 878) and balance at the end
 * of the preamble (l.127-130, 3478-3526); nonacm only leaves out ACM's copyright block and reference format (l.115-126).
 * pvldb.sty loads textcase with no options (l.33) and appends `\MakeTextUppercase` to acmart's `\@secfont` (l.35). acmart
 * sets headings with the kernel's `\@sect` and `\@ssect` (acmart.cls l.258-261, 478-483), which hand the style the whole
 * heading as one argument (`#6{\@hangfrom{...}\interlinepenalty\@M #8\@@par}`, latex.ltx 2026-06-01 l.17487-17499, `\@ssect`
 * l.17544-17550), and `\ACM@NRadjust` (l.3236-3252) passes `\@secfont` on unchanged, since nothing defines `\Sectionformat`:
 * every `\section` and `\section*` title goes through `\MakeTextUppercase` (expl3's case changer, which skips maths and the
 * arguments of `\begin`, `\end`, `\cite`, `\label`, `\ref` and `\NoCaseChange` only: expl3-code.tex l.36664-36670). So a
 * colour or font name in a section title is upper-cased too: Flouest's marked units print `\textcolor{black}`,
 * `\colorbox{yellow}` and `\fontfamily{phv}` there, which become 'Undefined color `BLACK'' and a substituted `PHV` font.
 * That is the setting's to lift (its preamble can add those commands to `\AddToNoCaseChangeList`, latex.ltx l.22756-22758),
 * not a package a way loads, so no profile field holds it. It defines `\vldbdoi`, `\vldbpages`,
 * `\vldbvolume`, `\vldbissue`, `\vldbyear`, `\vldbauthors`, `\vldbtitle`, `\vldbavailabilityurl`, `\vldbpagestyle` and
 * `\vldbtopmatter` (l.46-86), names no way defines. The setting calls `\vldbtopmatter` after `\maketitle` (a command hook):
 * `\pagestyle{plain}`, a small Reference Format paragraph with an `\href`, and an unnumbered licence `\footnote` whose
 * counter it puts back, so only documents with a title print it.
 *
 * The page turns two-column at `\maketitle` (l.2438), so the layout has two columns: keys that need one column
 * (`classes.oneColumn`: cols.paracol, tbl.longtable) are unfit here. It is class.acmart with its own preloads and layout,
 * keyed by its setting's id (`classKeys`); `base` keeps class.acmart's key rules on this profile.
 */
export default defineClass({
  ...acmart,
  id: 'class.vldb',
  name: "acmart",
  base: 'class.acmart',
  targetEngine: "untested",
  preloads: [...acmart.preloads, { pkg: "balance" }, { pkg: "textcase" }],
  // Its own front-matter values (front.acmart's pvldb preset), set before \\maketitle (pvldb.sty l.46-86).
  defines: [...acmart.defines, "cmd:\\vldbdoi", "cmd:\\vldbpages", "cmd:\\vldbavailabilityurl", "cmd:\\vldbvolume", "cmd:\\vldbissue", "cmd:\\vldbyear", "cmd:\\vldbauthors", "cmd:\\vldbtitle", "cmd:\\vldbpagestyle"],
  // sigconf: letter paper (614.295pt) with 54pt inner and outer margins and a 2pc column gap (l.650-656), so
  // \textwidth = 506.295pt and each column 241.1475pt; 9pt type (l.273-274). pvldb.sty sets no page.
  layout: { columns: 2, textwidth: "506.295pt", fontsize: "9pt" },
  files: [{ path: "pvldb.sty", sha256: "37e9341f03757c138ae3b10bfc9fd9e97f2c40b08e0edf6d87c3eb1e1ffc1dff" }],
  evidence: [
    { kind: 'source', file: 'testing-pipeline/settings/classes/files/pvldb.sty', line: '33 (textcase), 35 (\\@secfont)' },
    { kind: 'source', file: 'testing-pipeline/settings/classes/files/pvldb.sty', line: '46-86 (metadata macros, \\vldbtopmatter)' },
    { kind: 'source', file: 'acmart.cls (MiKTeX package acmart, 2026/08/16 v2.20)', line: '258-261, 478-483 (the kernel\'s \\@sect and \\@ssect), 3236-3252, 3266-3270 (\\ACM@NRadjust, \\section)' },
    { kind: 'source', file: 'latex.ltx (MiKTeX package ltxbase, 2026-06-01)', line: '17487-17499, 17544-17550 (#6{...#8\\@@par}), 22756-22758 (\\AddToNoCaseChangeList)' },
    { kind: 'source', file: 'expl3-code.tex (MiKTeX package l3kernel)', line: '36664-36670 (case-change exclusions: \\begin \\cite \\end \\label \\ref)' },
    { kind: 'source', file: 'acmart.cls (MiKTeX package acmart, 2026/08/16 v2.20)', line: '115-126 (nonacm)' },
    { kind: 'source', file: 'acmart.cls (MiKTeX package acmart, 2026/08/16 v2.20)', line: '273-274, 650-656 (sigconf 9pt, geometry)' },
    { kind: 'source', file: 'acmart.cls (MiKTeX package acmart, 2026/08/16 v2.20)', line: '2438 (\\twocolumn at \\maketitle)' },
    { kind: 'source', file: 'acmart.cls (MiKTeX package acmart, 2026/08/16 v2.20)', line: '127-130, 3478-3532 (balance)' },
    { kind: 'source', file: 'testing-pipeline/settings/classes/vldb.json', line: '1' },
    ...acmart.evidence,
  ],
});
