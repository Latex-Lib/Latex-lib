import { defineKey } from '../../../schema/key.ts';
import { minimal } from '../../../schema/minimal.ts';
import { PRESETS } from './presets.ts';

const SRC = 'Latex Related Research/Latex-lib-main/Source';

/** The forms that float: every one but aa's \longtab, which the class itself sets at the end of the document. */
const FLOATING = ['ruledtabular', 'deluxetable', 'tbl', 'cas', 'mdpi', 'copernicus', 'oup', 'iopart', 'plos'];

export default defineKey(
  minimal({
    id: 'tbl.class-env',
    node: 'table',
    description:
      "The table in the class's own form, one per class family: AASTeX's deluxetable (\\tablehead{\\colhead{…}}, \\startdata … \\enddata, deluxetable*, \\startlongtable); A&A's \\longtab{longtable} set at the end of the document; REVTeX's ruledtabular (revtex4-2 and aastex701); Taylor & Francis Interact's \\tbl{caption}{tabular}; Elsevier CAS's \\begin{table}[width=…,cols=…,pos=…] with tabular* at \\tblwidth; MDPI's table[H] with tabularx{\\textwidth}{CCC}; Copernicus' \\tophline, \\middlehline, \\bottomhline; Oxford University Press's \\toprule, \\midrule, \\botrule; IOP iopart's indented tabular with \\br, \\mr; PLOS's | grid with \\thickhline under the header. Each with the class's own rules and caption placement; columns that wrap, or the templates' natural l/c columns.",
    writes: '\\begin{table}[tbp] \\caption{…} \\label{…} \\begin{ruledtabular} \\begin{tabular}{p{…}p{…}} … & … \\\\ \\hline … \\\\ \\end{tabular} \\end{ruledtabular} \\end{table}',
    ctan: ['revtex', 'aastex'],
    features: ['floating', 'captioned', 'horizontal-rules', 'class-styled'],
    params: {
      form: {
        type: 'enum',
        values: ['ruledtabular', 'deluxetable', 'longtab', 'tbl', 'cas', 'mdpi', 'copernicus', 'oup', 'iopart', 'plos'],
        default: 'ruledtabular',
        compat: true,
        description: "the class's form: REVTeX's ruledtabular, AASTeX's deluxetable, A&A's \\longtab, Interact's \\tbl, CAS's key-value table, MDPI's tabularx[H], Copernicus' hline rules, OUP's \\botrule, iopart's indented \\br/\\mr, PLOS's \\thickhline",
      },
      columns: { type: 'enum', values: ['wrap', 'natural'], default: 'wrap', description: "p-columns sharing the line so a cell wraps (as every table way), or the templates' own l/c columns (cas L/C, plos's + rule), as wide as their text; deluxetable always natural, mdpi always its C (X) columns" },
      span: { type: 'boolean', default: false, description: 'across both columns: table*, deluxetable* (not for longtab or mdpi)' },
      long: { type: 'boolean', default: false, description: "deluxetable only: \\startlongtable before it, so it breaks across pages" },
      pos: { type: 'string', default: 'tbp', description: "cas only: the table's pos= key (t, h, b, p or several letters; a bare [h] is lost on a cas table)" },
      fontSize: { type: 'tex', default: '', description: "the table's size (\\small; deluxetable's \\tabletypesize{…}); ''" },
    },
    presets: PRESETS,
    // Each form is the class's: its environments and commands, and the packages the class preloads. Nothing is loaded.
    loads: [],
    requiresWhen: [
      { when: { form: 'ruledtabular' }, requires: ['env:table', 'env:ruledtabular'] },
      { when: { form: 'deluxetable' }, requires: ['env:deluxetable', 'cmd:\\tablehead', 'cmd:\\colhead', 'cmd:\\startdata', 'cmd:\\tablecaption'] },
      { when: { form: 'deluxetable', long: true }, requires: ['cmd:\\startlongtable'] },
      { when: { form: 'longtab' }, requires: ['cmd:\\longtab', 'pkg:longtable'] },
      { when: { form: 'tbl' }, requires: ['env:table', 'cmd:\\tbl', 'pkg:booktabs'] },
      { when: { form: 'cas' }, requires: ['env:table', 'cmd:\\tblwidth', 'pkg:booktabs'] },
      { when: { form: 'mdpi' }, requires: ['env:table', 'pkg:tabularx', 'pkg:booktabs', 'pkg:float'] },
      { when: { form: 'copernicus' }, requires: ['env:table', 'cmd:\\tophline', 'cmd:\\middlehline', 'cmd:\\bottomhline'] },
      { when: { form: 'oup' }, requires: ['env:table', 'cmd:\\botrule'] },
      { when: { form: 'iopart' }, requires: ['env:table', 'env:indented', 'cmd:\\br', 'cmd:\\mr'] },
      { when: { form: 'plos' }, requires: ['env:table', 'cmd:\\thickhline'] },
    ],
    only: [
      'class.aastex',
      'class.aa',
      'class.revtex4-2',
      'class.revtex4-2-aip',
      'class.interact',
      'class.cas-dc',
      'class.cas-sc',
      'class.mdpi',
      'class.copernicus',
      'class.oup-authoring-template',
      'class.iopart',
      'class.plos',
    ],
    onlyWhen: [
      {
        when: { form: 'ruledtabular' },
        // revtex4-2-aip is built on revtex4-2, so revtex4-2 covers it; aastex701 defines the same environment.
        classes: ['class.revtex4-2', 'class.aastex'],
        reason: 'ruledtabular is REVTeX\'s environment, which aastex701 copies; elsewhere "Environment ruledtabular undefined"',
        evidence: [
          { kind: 'source', file: `${SRC}/0908-aip-conference-proceedings/tex/latex/revtex/revtex4-2.cls`, line: '6901-6926' },
          { kind: 'source', file: 'testing-pipeline/settings/classes/files/aastex701.cls', line: '6298' },
        ],
      },
      {
        when: { form: 'deluxetable' },
        classes: ['class.aastex'],
        reason: 'deluxetable, \\tablehead, \\colhead and \\startdata are aastex701\'s own; elsewhere "Environment deluxetable undefined"',
        evidence: [{ kind: 'source', file: 'testing-pipeline/settings/classes/files/aastex701.cls', line: '8411-8540, 11264-11420' }],
      },
      {
        when: { form: 'longtab' },
        classes: ['class.aa'],
        reason: "\\longtab is aa's command (aa.cls l.1385), which also moves the table to the end of the document in one column",
        evidence: [{ kind: 'source', file: 'testing-pipeline/settings/classes/files/aa.cls', line: '1385-1422' }],
      },
      {
        when: { form: 'tbl' },
        classes: ['class.interact'],
        reason: "\\tbl is interact's command, and its \\toprule, \\midrule and \\bottomrule are the class's \\hline rules, written where booktabs' would sit (interact.cls l.627-645)",
        evidence: [{ kind: 'source', file: `${SRC}/0207-tandf-interact/interact.cls`, line: '627-645' }],
      },
      {
        when: { form: 'cas' },
        classes: ['class.cas-sc', 'class.cas-dc'],
        reason: "the table's width=, cols= and pos= keys and \\tblwidth are cas-common.sty's (l.2097-2140); elsewhere the key list is taken for a placement and \\tblwidth is undefined",
        evidence: [{ kind: 'source', file: `${SRC}/0920-sylvainhalle-papershell/Source/sty/cas/cas-common.sty`, line: '2070-2140' }],
      },
      {
        when: { form: 'mdpi' },
        classes: ['class.mdpi'],
        reason: "the C column is mdpi's (\\newcolumntype{C}{>{\\centering\\arraybackslash}X}, mdpi.cls l.1714-1717), and [H] needs the float package mdpi preloads",
        evidence: [{ kind: 'source', file: 'testing-pipeline/settings/classes/files/Definitions/mdpi.cls', line: '64, 68, 1714-1717' }],
      },
      {
        when: { form: 'copernicus' },
        classes: ['class.copernicus'],
        reason: '\\tophline, \\middlehline and \\bottomhline are copernicus.cls\'s (l.2774-2777)',
        evidence: [{ kind: 'source', file: `${SRC}/0195-copernicus/copernicus.cls`, line: '2774-2777' }],
      },
      {
        when: { form: 'oup' },
        classes: ['class.oup-authoring-template'],
        reason: "\\botrule and the dashed \\toprule and \\midrule are oup-authoring-template.cls's (l.1910-1948, 1996-2080); booktabs has no \\botrule",
        evidence: [{ kind: 'source', file: `${SRC}/0914-oup-authoring-template/oup-authoring-template.cls`, line: '1910-1948, 1996-2080' }],
      },
      {
        when: { form: 'iopart' },
        classes: ['class.iopart'],
        reason: "indented, \\br and \\mr are iopart.cls's table vocabulary (l.912-938)",
        evidence: [{ kind: 'source', file: 'template-lib-based-automation/Latex-Lib/classes/iopart.ts', line: '17' }],
      },
      {
        when: { form: 'plos' },
        classes: ['class.plos'],
        reason: "\\thickhline is the PLOS template's (plos_latex_template.tex l.118-120), which the plos setting carries",
        evidence: [{ kind: 'source', file: `${SRC}/0862-plos/plos_latex_template.tex`, line: '107-122' }],
      },
    ],
    // The cas form's [width=…,cols=…,pos=…] is cas-common.sty's table; floatrow, loaded by another way in the document
    // (fig.floatrow's floatrow presets), restyles figure and table as it loads (floatrow.sty l.1459, as fig.floatrow's handler
    // records), and the restyled table takes the bracket as a placement. sidecap (fig.floatrow's other engine) leaves it alone.
    conflicts: [
      {
        pkg: 'floatrow',
        when: { form: 'cas' },
        reason:
          "floatrow restyles the table environment as it loads, replacing cas-common.sty's key-value table: \\begin{table}[width=\\linewidth,cols=3,pos=tbp] stops at \"Unknown float option `w'\"",
        evidence: [
          { kind: 'compile', cell: "batch 4 round 2, cas-dc.A and cas-sc.A: 14 cells (24 failing branches) stop at \"Unknown float option `w'\" at a tbl.class-env cas table (document d02d223a6dc26d4e3e744, result 72e52ae3d10b, l.247); each of the 7 documents holds fig.floatrow with a floatrow preset" },
          { kind: 'compile', reproducer: "\\documentclass{cas-dc} \\usepackage{graphicx}\\usepackage{floatrow} and \\begin{table}[width=\\linewidth,cols=3,pos=tbp] \\caption{T} \\begin{tabular*}{\\tblwidth}{@{}LLL@{}} … \\end{tabular*} \\end{table}: \"Unknown float option `w'\"; without floatrow, or with sidecap instead, no error (ZeroTeX-NG through compat cases, 2026-11-10)" },
        ],
      },
    ],
    deny: [
      {
        // emulateapj is built on class.aastex (its profile's base), so the deluxetable form's `onlyWhen` lets it in.
        class: 'class.emulateapj',
        unless: { long: false },
        reason: "\\startlongtable is AASTeX 6's (aastex701.cls l.11279); emulateapj's older deluxetable has none, so a long deluxetable stops at 'Undefined control sequence' at \\startlongtable (deluxetable without it and ruledtabular pass there)",
        evidence: [
          { kind: 'source', file: 'testing-pipeline/settings/classes/files/aastex701.cls', line: '11279 (\\startlongtable)' },
          { kind: 'compile', cell: 'batch 4 round 1 (testing-pipeline/out/fetched/batch4-round1): emulateapj.A, 43 cells whose first error is \\startlongtable (document dba51f3428e714e19b7bc, result 36ca0088fb); tbl.class-env@deluxetable-wide failed all 36 of its not-denied branches there, at the error, while @ruledtabular passed 81 and @deluxetable 13' },
        ],
      },
    ],
    // Every form but \longtab is a float, so it needs a place that takes floats (as tbl.tabular, tbl.booktabs).
    needsWhen: [{ when: { form: FLOATING }, needs: { floats: true } }],
    // A table float is itself a float: no float below it.
    gives: { floats: false },
    givesWhen: [
      // \longtab{…}, \tbl{…}{…} and deluxetable's \startdata … \enddata read the rows as a macro argument: no verbatim cell.
      { when: { form: ['longtab', 'tbl', 'deluxetable'] }, gives: { argument: true, verbatim: false } },
    ],
    // ZeroTeX-NG, 2026-11-07, both sample tables (a captioned one with a header row and a span; a headless, captionless, labelled
    // three-column one with maths and a long cell), each form typeset ok with no error and no overfull line in wrap mode:
    // ruledtabular under aastex701, revtex4-2 [aps,reprint] and [aip,jcp,reprint] (with the profile's \@mkpream@relax setup line);
    // deluxetable and deluxetable* with \startlongtable under aastex701; longtab under aa; mdpi; cas under cas-sc and cas-dc
    // (table*); plos (article with the template's preamble lines); tbl under interact (interact.cls copied from Source/0207 into the
    // probe: not on the mirror); oup under [webpdf,contemporary,large] and [webpdf,modern,large] (rsfs mapped to cmsy10 and the
    // journal fields set in the probe only, as front.oup records); copernicus under [acp,manuscript] only with the class copied from
    // Source/0195 and its \pdfoutput tests set to 1 and \pdfpageattr dropped in the probe (the profile's XeTeX-patched copy is not in
    // this repository). iopart's class is not on the mirror or in the repository, so that form is unmeasured, and the way as a
    // whole stays untested.
    targetEngine: 'untested',
  }),
);
