import { defineClass } from '../schema/class.ts';

/**
 * The *ACL conference style (class setting acl): plain article with 11pt and `\usepackage[final]{acl}`, acl.sty from
 * github.com/acl-org/acl-style-files (commit 2427282, 2025-08-19; no version line). Not measured by the class probe: every field
 * is read from the pinned acl.sty (b2p, batch 2). The style's own packages are this profile's preloads, loaded in the setting's
 * preamble before any way's: xcolor (l.33; so tbl.colortbl's xcolor[table] meets "Option clash"), geometry with a4paper,
 * margin=2.5cm and heightrounded=true (l.103-104), caption (l.182), natbib with no option (l.186: author-year; every bib.natbib
 * preset gives natbib an option, so each clashes) and hyperref with breaklinks (l.300-302, under the default `hyperref` option,
 * l.28). lineno and etoolbox load only under review (l.35-64), which the setting does not give.
 * It calls \bibliographystyle{acl_natbib} while loading (l.195), so main.aux opens with that \bibstyle and a way that writes its
 * own \bibliographystyle makes BibTeX stop ('Illegal, another \bibstyle command'); a numeric BibTeX style under its author-year
 * natbib also stops natbib ('Bibliography not compatible with author-year citations'). So the keys of bib.bibtex-bst and
 * bib.cite-pkg deny class.acl (the CA11 rule sn-jnl and mdpi have); bib.natbib is refused by its option clash.
 * It sets two columns itself with \twocolumn (l.112), not by a class option, so the layout says two columns: a way that needs
 * one column is not compiled here. \addcontentsline does nothing (l.116): a table of contents compiles but lists nothing.
 * The names after article's are the style's own (l.127-193), which a way that defines them again would meet as "already defined".
 */
export default defineClass({
  id: 'class.acl',
  name: "article",
  base: 'class.article',
  targetEngine: "untested",
  preloads: [{"pkg": "xcolor"}, {"pkg": "geometry", "options": ["a4paper", "margin=2.5cm", "heightrounded=true"]}, {"pkg": "caption"}, {"pkg": "natbib"}, {"pkg": "hyperref", "options": ["breaklinks"]}],
  defines: ["counter:part", "counter:section", "counter:subsection", "counter:subsubsection", "counter:paragraph", "counter:subparagraph", "env:abstract", "env:figure", "env:table", "env:thebibliography", "cmd:\\maketitle", "cmd:\\tableofcontents", "cmd:\\appendix", "cmd:\\Thanks", "cmd:\\outauthor", "cmd:\\shortcite", "cmd:\\newcite", "cmd:\\citeposs", "cmd:\\And", "cmd:\\AND"],
  options: {},
  forbids: {
    technical: [],
    policy: [],
  },
  layout: { columns: 2, textwidth: "455.24411pt", fontsize: "11pt" },
  vocabulary: {"\\And": "the next author block, on the same line", "\\AND": "the next author block, on a new line"},
  evidence: [
    { kind: 'source', file: 'testing-pipeline/settings/classes/files/acl.sty (acl-style-files commit 2427282)', line: '18-29 (options: final is the default mode, hyperref the default)' },
    { kind: 'source', file: 'testing-pipeline/settings/classes/files/acl.sty (acl-style-files commit 2427282)', line: '33 (xcolor), 103-104 (geometry: a4paper, margin=2.5cm, heightrounded=true), 182 (caption), 186 (natbib), 300-302 (hyperref with breaklinks)' },
    { kind: 'source', file: 'testing-pipeline/settings/classes/files/acl.sty (acl-style-files commit 2427282)', line: '106-112 (\\columnsep 0.6cm, \\twocolumn), 116 (\\addcontentsline does nothing)' },
    { kind: 'source', file: 'testing-pipeline/settings/classes/files/acl.sty (acl-style-files commit 2427282)', line: '127 (\\Thanks), 129 (\\outauthor), 139-165 (\\maketitle with \\And and \\AND), 170 (abstract), 190-193 (\\cite as \\citep, \\shortcite, \\newcite, \\citeposs), 195 (\\bibliographystyle{acl_natbib})' },
  ],
});
