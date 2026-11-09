/**
 * tbl.class-env's presets: one per class family, each the class's own table form as its template writes it.
 */
import type { Preset } from '../../../schema/params.ts';
import { solution } from '../../evidence.ts';

const SRC = 'Latex Related Research/Latex-lib-main/Source';

export const PRESETS = {
  ruledtabular: {
    description: "REVTeX's ruledtabular (revtex4-2, its AIP setting, and aastex701, which copies it): the tabular in a table float, caption and label above, \\hline under the header row; the environment draws the double rules at top and bottom and stretches the table to the column.",
    features: ['floating', 'captioned', 'horizontal-rules', 'class-styled'],
    params: {},
    evidence: [
      { kind: 'source', file: `${SRC}/0908-aip-conference-proceedings/tex/latex/revtex/revtex4-2.cls`, line: '6901-6926' },
      { kind: 'source', file: `${SRC}/0908-aip-conference-proceedings/doc/latex/revtex/sample/aps/apssamp.tex`, line: '460-470' },
      { kind: 'source', file: `${SRC}/0908-aip-conference-proceedings/doc/latex/revtex/sample/aip/aipsamp.tex`, line: '339-355' },
      { kind: 'source', file: 'testing-pipeline/settings/classes/files/aastex701.cls', line: '6294-6320' },
    ],
  },
  deluxetable: {
    description: "AASTeX's deluxetable: \\begin{deluxetable}{lcc} with \\tablecaption, \\tablehead{\\colhead{…} & …} and the rows between \\startdata and \\enddata; the class draws the double rule, sets the 'Table N' caption at the table's width and turns a table wider than the page sideways.",
    writes: '\\begin{deluxetable}{lcc} \\tablecaption{…} \\label{…} \\tablehead{\\colhead{…} & \\colhead{…}} \\startdata … & … \\\\ … \\enddata \\end{deluxetable}',
    features: ['floating', 'captioned', 'horizontal-rules', 'class-styled'],
    params: { form: 'deluxetable' },
    evidence: [
      { kind: 'source', file: 'testing-pipeline/settings/classes/files/aastex701.cls', line: '8411-8420, 8527-8540, 11264-11267, 11296-11420' },
      { kind: 'source', file: `${SRC}/0563-aastex/aastex701-sample.tex`, line: '458-484' },
      solution('0563-aastex', '24'),
    ],
  },
  'deluxetable-wide': {
    description: "AASTeX's deluxetable* across the page, in a smaller size (\\tabletypesize{\\small}), breaking across pages (\\startlongtable).",
    writes: '\\startlongtable \\begin{deluxetable*}{lcc} \\tabletypesize{\\small} \\tablecaption{…} \\label{…} \\tablehead{\\colhead{…} & \\colhead{…}} \\startdata … \\enddata \\end{deluxetable*}',
    features: ['floating', 'captioned', 'horizontal-rules', 'class-styled', 'full-width', 'page-breaking'],
    params: { form: 'deluxetable', span: true, long: true, fontSize: '\\small' },
    evidence: [{ kind: 'source', file: 'testing-pipeline/settings/classes/files/aastex701.cls', line: '8411 (\\tabletypesize), 11264-11267 (deluxetable*), 11279 (\\startlongtable)' }],
  },
  longtab: {
    description: "Astronomy & Astrophysics' \\longtab{…}: a longtable the class sets in one column at the end of the document, caption first, \\hline\\hline over the header row, the header repeated after 'continued.', \\hline at each page's foot.",
    writes: '\\longtab{ \\begin{longtable}{p{…}p{…}} \\caption{…}\\label{…}\\\\ \\hline\\hline … \\\\ \\hline \\endfirsthead \\caption{continued.}\\\\ \\hline\\hline … \\\\ \\hline \\endhead \\hline \\endfoot … \\\\ \\end{longtable}}',
    features: ['captioned', 'horizontal-rules', 'page-breaking', 'class-styled'],
    params: { form: 'longtab' },
    evidence: [
      { kind: 'source', file: 'testing-pipeline/settings/classes/files/aa.cls', line: '1385-1422' },
      { kind: 'source', file: `${SRC}/0411-aanda/aa_example.zip (aa_example.tex)`, line: '329-345' },
    ],
  },
  tbl: {
    description: "Taylor & Francis Interact's \\tbl{caption}{tabular}: the caption held to the table's width above it, the class's \\toprule, \\midrule and \\bottomrule (plain \\hline rules), \\label just before \\end{table}.",
    writes: '\\begin{table}[tbp] \\tbl{…}{\\begin{tabular}{p{…}p{…}} \\toprule … & … \\\\ \\midrule … \\\\ \\bottomrule \\end{tabular}} \\label{…} \\end{table}',
    features: ['floating', 'captioned', 'horizontal-rules', 'class-styled'],
    params: { form: 'tbl' },
    evidence: [
      { kind: 'source', file: `${SRC}/0207-tandf-interact/interact.cls`, line: '627-645' },
      { kind: 'source', file: `${SRC}/0207-tandf-interact/interactapasample.tex`, line: '247-261, 279' },
    ],
  },
  cas: {
    description: "Elsevier CAS's key-value table: \\begin{table}[width=\\linewidth,cols=…,pos=…], caption and label above, a tabular* at \\tblwidth with booktabs rules; the class sets the caption and the table in its sans-serif small type.",
    writes: '\\begin{table}[width=\\linewidth,cols=…,pos=…] \\caption{…} \\label{…} \\begin{tabular*}{\\tblwidth}{@{\\extracolsep{\\fill}}p{…}p{…}} \\toprule … & … \\\\ \\midrule … \\\\ \\bottomrule \\end{tabular*} \\end{table}',
    features: ['floating', 'captioned', 'booktabs-rules', 'class-styled'],
    params: { form: 'cas' },
    evidence: [
      { kind: 'source', file: `${SRC}/0920-sylvainhalle-papershell/Source/sty/cas/cas-common.sty`, line: '2070-2140' },
      { kind: 'requirement', file: 'Template/template-requirement/Elsevier_CAS_SC.md', line: '96-100, 192' },
    ],
  },
  'cas-columns': {
    description: "CAS's table with the template's own stretching columns, \\begin{tabular*}{\\tblwidth}{@{}LC@{}} (L, C: @{\\extracolsep{\\fill}}l, c), as wide as their text.",
    writes: '\\begin{table}[width=\\linewidth,cols=…,pos=…] \\caption{…} \\label{…} \\begin{tabular*}{\\tblwidth}{@{}LC@{}} \\toprule … & … \\\\ \\midrule … \\\\ \\bottomrule \\end{tabular*} \\end{table}',
    features: ['floating', 'captioned', 'booktabs-rules', 'class-styled'],
    params: { form: 'cas', columns: 'natural' },
    evidence: [{ kind: 'source', file: `${SRC}/0920-sylvainhalle-papershell/Source/sty/cas/cas-common.sty`, line: '2070-2072 (\\newcolumntype L, R, C)' }],
  },
  mdpi: {
    description: "MDPI's table: \\begin{table}[H], the caption with its label inside, above, then \\begin{tabularx}{\\textwidth}{CCC} (centred X columns that wrap) with booktabs rules.",
    writes: '\\begin{table}[H] \\caption{…\\label{…}} \\begin{tabularx}{\\textwidth}{CC} \\toprule … & … \\\\ \\midrule … \\\\ \\bottomrule \\end{tabularx} \\end{table}',
    features: ['floating', 'here', 'captioned', 'booktabs-rules', 'class-styled'],
    params: { form: 'mdpi' },
    evidence: [
      { kind: 'source', file: `${SRC}/0894-mdpi/template.tex`, line: '223-237' },
      { kind: 'source', file: 'testing-pipeline/settings/classes/files/Definitions/mdpi.cls', line: '1679, 1714-1717' },
    ],
  },
  copernicus: {
    description: "Copernicus' table: caption and label above, the class's \\tophline, \\middlehline under the header row and \\bottomhline (\\hline with 1mm of space), no vertical rules.",
    writes: '\\begin{table}[tbp] \\centering \\caption{…} \\label{…} \\begin{tabular}{p{…}p{…}} \\tophline … & … \\\\ \\middlehline … \\\\ \\bottomhline \\end{tabular} \\end{table}',
    features: ['floating', 'captioned', 'horizontal-rules', 'class-styled'],
    params: { form: 'copernicus' },
    evidence: [
      { kind: 'source', file: `${SRC}/0195-copernicus/copernicus.cls`, line: '2774-2777' },
      { kind: 'source', file: `${SRC}/0195-copernicus/template.tex`, line: '277-325' },
    ],
  },
  oup: {
    description: "Oxford University Press (oup-authoring-template) table: the caption with its label inside, then a tabular whose wrapping columns fill the column (the template's tabular* breaks under arydshln, which the contemporary layout loads) with the class's \\toprule, \\midrule and \\botrule, dashed in the contemporary layout.",
    writes: '\\begin{table}[tbp] \\caption{…\\label{…}} \\begin{tabular}{p{…}p{…}} \\toprule … & … \\\\ \\midrule … \\\\ \\botrule \\end{tabular} \\end{table}',
    features: ['floating', 'captioned', 'horizontal-rules', 'class-styled'],
    params: { form: 'oup' },
    evidence: [
      { kind: 'source', file: `${SRC}/0914-oup-authoring-template/oup-authoring-template.tex`, line: '258-271' },
      { kind: 'source', file: `${SRC}/0914-oup-authoring-template/oup-authoring-template.cls`, line: '1910-1948, 1996-2080' },
      solution('0914-oup-authoring-template', '39'),
    ],
  },
  iopart: {
    description: "IOP's iopart table: caption and label above, the tabular in the class's indented environment after \\item[], \\br above, \\mr under the header row and \\br below.",
    writes: '\\begin{table}[tbp] \\caption{…} \\label{…} \\begin{indented} \\item[]\\begin{tabular}{@{}p{…}p{…}} \\br … & … \\\\ \\mr … \\\\ \\br \\end{tabular} \\end{indented} \\end{table}',
    features: ['floating', 'captioned', 'horizontal-rules', 'indented', 'class-styled'],
    params: { form: 'iopart' },
    evidence: [
      { kind: 'source', file: 'template-lib-based-automation/Latex-Lib/classes/iopart.ts', line: '17 (\\br \\mr \\ms \\bs \\ns \\es \\centre \\crule, iopart.cls l.912-938)' },
      { kind: 'source', file: 'Latex Related Research/Latex-Template-Examples/class.iopart/main.tex', line: '237-241' },
    ],
  },
  plos: {
    description: "PLOS's table: caption above, | rules at every edge, \\hline between rows and the template's heavy \\thickhline under the header row, \\label last.",
    writes: '\\begin{table}[tbp] \\centering \\caption{…} \\begin{tabular}{|p{…}|p{…}|} \\hline … & … \\\\ \\thickhline … \\\\ \\hline \\end{tabular} \\label{…} \\end{table}',
    features: ['floating', 'captioned', 'horizontal-rules', 'vertical-rules', 'class-styled'],
    params: { form: 'plos' },
    evidence: [
      { kind: 'source', file: `${SRC}/0862-plos/plos_latex_template.tex`, line: '107-122, 285-298' },
      { kind: 'requirement', file: 'Template/template-requirement/PLOS.md', line: 'Tables' },
    ],
  },
} as const satisfies { readonly [name: string]: Preset };
