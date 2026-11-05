import { defineClass } from '../schema/class.ts';

/**
 * IEEE RAS conferences (ICRA, IROS, PaperPlaza): ieeeconf.cls, "2016/4/23 revision V1.6b by Pradeep Misra", a renamed
 * IEEEtran V1.6b (2002/11/18), from ieeeconf.zip (testing-pipeline/settings/classes/files/ieeeconf.cls), with the setting's
 * options letterpaper, 10pt, conference and its preamble (\IEEEoverridecommandlockouts, \overrideIEEEmargins, and a hook
 * that clears the class's \proof before amsthm loads, plus the CI session's \labelindent hook, \if@titlepage and
 * \abstractname lines, see below). Not measured by the class probe (batch 3, b3p).
 * - Loads no package. `base` is class.ieeetran: the same IEEEtran code, so its key rules hold (sectsty: the class is not
 *   article, report, book or KOMA, sectsty.sty l.278-295; the class-native theorem way's `only`, the kernel's \newtheorem).
 * - \appendices is \def'd (l.4103), so appendix.sty's \newenvironment{appendices} stops at "Command \appendices already
 *   defined" (appendix.sty l.241), as under IEEEtran V1.8b: refused.
 * - \proof and \endproof are \def'd (l.3947-3948); the setting's package/amsthm/before hook clears both, so amsthm's proof is
 *   used and env:proof is not listed (a way that defines proof with no amsthm loaded would still meet the class's \proof,
 *   but General loads amsthm in every document).
 * - Conference mode swallows \thanks, \keywords, \PARstart, \pubid, \IEEEmembership and \IEEEaftertitletext (l.4531-4566)
 *   unless \IEEEoverridecommandlockouts (l.4572), which the setting gives. keywords is an environment (\def\keywords and
 *   \def\endkeywords, l.3809-3816), as spconf's: a way that \newcommand's \keywords stops at "already defined".
 * - Names it defines: \IEEEeqnarray and its family, IEEEitemize, IEEEenumerate, IEEEdescription, \QED, \QEDclosed, \QEDopen,
 *   biography, biographynophoto, \IEEEmembership, \authorblockN, \authorblockA, \today (l.3263), \bstctlcite.
 * - Page: two columns and oneside by default (l.797), \textwidth 7.0in = 505.89pt with \columnsep 0.2in (l.1165-1166),
 *   10pt. \rmdefault ptm, \sfdefault phv, \ttdefault pcr (l.790-792), which General's fontspec lines replace under XeTeX.
 * - abstract.sty and enumitem: the b3p-1 probe (verify-V2) saw abstract.sty stop at \if@titlepage (abstract.sty l.57, 103;
 *   V1.6b has only the titlepage environment, l.1820-1822) and enumitem at "Command \labelindent already defined" (the class's
 *   \newdimen\labelindent, l.1444), so b3p refused both. The setting's preamble now declares \if@titlepage when undefined,
 *   gives \providecommand\abstractname{Abstract} (V1.6b has none; abstract.sty prints it) and clears \labelindent in a
 *   package/enumitem/before hook, so enumitem allocates it afresh and the class's list code reads that register (CI session;
 *   its probes b3opt ras-enumitem-1, ras-lists-1 and b3opt2 ras-abstract-2 have 0 errors, against 7 and 1 for the -0 cases):
 *   both refusals are lifted (b3q).
 */
export default defineClass({
  id: 'class.ieeeconf-ras',
  name: "ieeeconf",
  base: 'class.ieeetran',
  zerotex: "untested",
  preloads: [],
  defines: ["counter:section", "counter:subsection", "counter:subsubsection", "counter:paragraph", "counter:figure", "counter:table", "env:abstract", "env:figure", "env:table", "env:thebibliography", "env:keywords", "env:biography", "env:biographynophoto", "env:IEEEeqnarray", "env:IEEEeqnarraybox", "env:IEEEitemize", "env:IEEEenumerate", "env:IEEEdescription", "cmd:\\maketitle", "cmd:\\tableofcontents", "cmd:\\listoffigures", "cmd:\\appendix", "cmd:\\appendices", "cmd:\\keywords", "cmd:\\QED", "cmd:\\QEDclosed", "cmd:\\QEDopen", "cmd:\\IEEEmembership", "cmd:\\IEEEoverridecommandlockouts", "cmd:\\overrideIEEEmargins", "cmd:\\authorblockN", "cmd:\\authorblockA", "cmd:\\PARstart", "cmd:\\pubid", "cmd:\\bstctlcite", "cmd:\\specialpapernotice"],
  options: {},
  forbids: {
    technical: [
      { pkg: "appendix", reason: "ieeeconf.cls (IEEEtran V1.6b) defines \\appendices itself (l.4103: \\def\\appendices), so appendix.sty's \\newenvironment{appendices} fails while the package loads: LaTeX Error: Command \\appendices already defined (appendix.sty l.241), as class.ieeetran", evidence: [{ kind: 'source', file: 'ieeeconf.cls (2016/4/23 V1.6b, testing-pipeline/settings/classes/files)', line: '4103' }] },
      { pkg: "sectsty", reason: "ieeeconf is not article, report, book or a KOMA class, and sectsty stops at 'The sectsty package doesn't work with this document class' for any other (sectsty.sty l.278-295; class.ieeetran's deny in head.sectsty holds through `base` too)", evidence: [{ kind: 'source', file: 'sectsty.sty (MiKTeX snapshot 9766)', line: '278-295' }] },
    ],
    policy: [],
  },
  layout: { columns: 2, textwidth: "505.89pt", fontsize: "10pt" },
  files: [{ path: "ieeeconf.cls", sha256: "4befef671c2a996889d325f5170d3387bf42aac9a37dcaa93724ad49816e4ec2" }],
  vocabulary: {"\\keywords": "keywords (an environment: \\begin{keywords} ... \\end{keywords}, printed as Index Terms; kept by \\IEEEoverridecommandlockouts)", "\\thanks": "author notes (kept in conference mode by \\IEEEoverridecommandlockouts)", "\\authorblockN": "an author's name block", "\\authorblockA": "an author's affiliation block"},
  evidence: [
    { kind: 'source', file: 'ieeeconf.cls (2016/4/23 V1.6b, testing-pipeline/settings/classes/files)', line: '790-797 (fonts; twocolumn, oneside defaults)' },
    { kind: 'source', file: 'ieeeconf.cls', line: '1165-1191 (\\textwidth 7.0in, \\columnsep 0.2in, \\overrideIEEEmargins)' },
    { kind: 'source', file: 'ieeeconf.cls', line: '1615-1619 (itemize, enumerate, description), 1882-1938 (counters, \\tableofcontents, \\listoffigures), 2035-2045 (figure, table)' },
    { kind: 'source', file: 'ieeeconf.cls', line: '3263 (\\today), 3350 (thebibliography), 3589 (\\maketitle), 3797-3816 (abstract, keywords)' },
    { kind: 'source', file: 'ieeeconf.cls', line: '3922-3948 (\\section, \\proof, \\endproof), 4064-4103 (\\appendix, \\appendices)' },
    { kind: 'source', file: 'ieeeconf.cls', line: '4531-4572 (conference lockouts, \\IEEEoverridecommandlockouts)' },
    { kind: 'source', file: 'testing-pipeline/settings/classes/ieeeconf-ras.json (CI session, 2026-11-05)', line: 'preamble: \\IEEEoverridecommandlockouts, \\overrideIEEEmargins, package/amsthm/before and package/enumitem/before hooks, \\@ifundefined{if@titlepage}{\\newif\\if@titlepage}{}, \\providecommand\\abstractname{Abstract}' },
    { kind: 'compile', cell: 'CI probes C:/dev/template-ai/probes/b3opt: ras-abstract-0 7 errors, ras-abstract-1 1, ras-enumitem-0 1, ras-enumitem-1 0, ras-lists-1 0; b3opt2 ras-abstract-2 0' },
  ],
});
