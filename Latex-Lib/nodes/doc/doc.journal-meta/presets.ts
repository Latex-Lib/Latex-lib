/**
 * doc.journal-meta's presets: one per class form, each with the values the class's own template gives (its placeholders
 * where it ships placeholders), so a template made from it starts where the publisher's sample does.
 */
import type { Preset } from '../../../schema/params.ts';

const SRC = 'Latex Related Research/Latex-lib-main/Source';
const EX = 'Latex Related Research/Latex-Template-Examples';

export const PRESETS = {
  aastex: {
    description: "AASTeX 7's journal constants: \\submitjournal{…}, which prints 'Submitted to …' under the title block, and \\watermark{…}, a grey diagonal word on the first page.",
    writes: '\\submitjournal{…} \\watermark{…} \\setwatermarkfontsize{…} \\turnoffedit',
    features: ['class-styled'],
    params: { form: 'aastex', journal: 'PSJ', watermark: 'DRAFT' },
    evidence: [
      { kind: 'source', file: `${SRC}/0563-aastex/aastex701-sample.tex`, line: '96-106 (\\submitjournal{PSJ}, \\watermark{text}, \\setwatermarkfontsize{dimension})' },
      { kind: 'source', file: 'testing-pipeline/settings/classes/files/aastex701.cls', line: '12346-12350 (\\turnoffedit), 12376-12382 (\\setwatermarkfontsize, \\watermark), 12395-12396 (\\submitjournal)' },
    ],
  },
  emulateapj: {
    description: "emulateapj's slug line: \\slugcomment{…}, the line at the top of the first page ('Draft version …', 'Submitted to ApJ').",
    writes: '\\slugcomment{…}',
    features: ['class-styled'],
    params: { form: 'emulateapj', slugcomment: 'Draft version \\today' },
    evidence: [{ kind: 'source', file: `${EX}/class.emulateapj/main.tex`, line: '90-91 (\\slugcomment{Draft version \\today})' }],
  },
  agu: {
    description: "AGU's journal name and draft switch: \\journalname{…}, which the running head prints as 'manuscript submitted to …', and \\draftfalse after the class's draft option.",
    writes: '\\draftfalse \\journalname{…}',
    features: ['class-styled'],
    params: { form: 'agu', journal: 'Enter journal name here', draft: false },
    evidence: [
      { kind: 'source', file: `${SRC}/0040-agu/April 16 2019/agujournaltemplate.tex`, line: '36 (\\draftfalse), 38-64 (the journal list and \\journalname{Enter journal name here})' },
      { kind: 'source', file: `${SRC}/0040-agu/April 16 2019/agujournal2019.cls`, line: '573 (\\def\\journalname#1{\\def\\thejournalname{#1}})' },
    ],
  },
  asmeconf: {
    description: "ASME conference paper's conference: \\ConfName, \\ConfAcronym, \\ConfDate and \\ConfCity, which the class prints in the first page's head; an empty one keeps the class's 'Missing conference …!' placeholder.",
    writes: '\\ConfName{…} \\ConfAcronym{…} \\ConfDate{…} \\ConfCity{…}',
    features: ['class-styled'],
    params: {
      form: 'asmeconf',
      conference: 'Proceedings of the ASME 2025\\linebreak International Mechanical Engineering Congress and Exposition',
      conferenceShort: 'IMECE2025',
      conferenceDate: 'November 16--20, 2025',
      conferenceVenue: 'Memphis, TN',
    },
    evidence: [
      { kind: 'source', file: `${SRC}/0909-asmeconf/asmeconf-template.tex`, line: '144-147' },
      { kind: 'source', file: `${SRC}/0909-asmeconf/asmeconf.cls`, line: '1686-1708 (the placeholders and the four \\NewDocumentCommand setters)' },
    ],
  },
  asmejour: {
    description: "ASME journal paper's journal: \\JourName{…}, printed in the footer and the first page's head.",
    writes: '\\JourName{…}',
    features: ['class-styled'],
    params: { form: 'asmejour', journal: 'Journal of Mechanical Design' },
    evidence: [{ kind: 'source', file: `${EX}/class.asmejour/main.tex`, line: '15 (\\JourName{Journal of Mechanical Design})' }],
  },
  oup: {
    description:
      "Oxford University Press's journal block: \\journaltitle{…}, \\DOI, \\copyrightyear, \\pubyear, \\vol, \\issue, \\access and \\appnotes (the article type), with the template's production placeholders; \\societylogo when the journal has one.",
    writes: '\\providecommand\\societylogo{…} \\journaltitle{…} \\appnotes{…} \\pubyear{…} \\copyrightyear{…} \\vol{…} \\issue{…} \\DOI{…} \\access{…}',
    features: ['class-styled'],
    params: {
      form: 'oup',
      journal: 'Journal Title Here',
      doi: 'DOI added during production',
      copyrightYear: 'YEAR',
      year: 'YEAR',
      volume: 'XX',
      issue: 'x',
      access: 'Published: Date added during production',
      articleType: 'Paper',
    },
    evidence: [
      { kind: 'source', file: `${SRC}/0914-oup-authoring-template/oup-authoring-template.tex`, line: '44 (\\newcommand{\\societylogo}{}), 67-74 (\\journaltitle … \\appnotes)' },
      { kind: 'source', file: `${SRC}/0914-oup-authoring-template/oup-authoring-template.cls`, line: '1170-1172, 1275-1279, 1328, 1394-1396 (each a \\def that only stores its value)' },
    ],
  },
  amsproc: {
    description: "AMS proceedings series: \\def\\publname{…} turns on the series logo on the first page, \\def\\volinfo{…} its volume line, and \\copyrightinfo{year}{holder} the copyright line under it.",
    writes: '\\def\\publname{…} \\def\\volinfo{…} \\copyrightinfo{…}{…}',
    features: ['class-styled'],
    params: { form: 'amsproc', journal: 'Contemporary Mathematics', volumeInfo: 'Volume 00, 0000', copyrightYear: '0000', copyrightHolder: 'American Mathematical Society' },
    evidence: [{ kind: 'source', file: `${SRC}/0260-amsproc/amsclass.dtx`, line: '1735-1752 (\\publname turns on \\@serieslogo), 1763-1781 (\\volinfo), 1804-1808 (\\copyrightinfo)' }],
  },
  elsarticle: {
    description: "Elsevier's journal: \\journal{…}, the journal the template is for (stored by elsarticle, whose 'Preprint submitted to …' footer the current version no longer prints).",
    writes: '\\journal{…}',
    features: ['class-styled'],
    params: { form: 'elsarticle', journal: 'Nuclear Physics B' },
    evidence: [{ kind: 'source', file: `${SRC}/0107-elsarticle/elsarticle-template-num.tex`, line: '52 (\\journal{Nuclear Physics B})' }],
  },
  jmlr: {
    description: "PMLR proceedings volume: \\jmlrvolume, \\jmlryear and \\jmlrworkshop, printed in the first page's head, and \\editor (\\editors for several).",
    writes: '\\jmlrvolume{…} \\jmlryear{…} \\jmlrworkshop{…} \\editor{…}',
    features: ['class-styled'],
    params: { form: 'jmlr', volume: '1', year: '2010', conference: 'Workshop Title', editors: "Editor's name" },
    evidence: [
      { kind: 'source', file: `${SRC}/0662-jmlr/pmlr-sample.tex`, line: '30-32 (\\jmlrvolume{1} \\jmlryear{2010} \\jmlrworkshop{Workshop Title}), 81-82 (\\editor, \\editors)' },
      { kind: 'source', file: `${SRC}/0662-jmlr/jmlr.dtx`, line: '185-215 (\\jmlrvolume, \\jmlryear, \\jmlrworkshop)' },
    ],
  },
  vldb: {
    description: "PVLDB's issue constants: \\renewcommand of pvldb.sty's \\vldbvolume, \\vldbissue, \\vldbyear, \\vldbauthors, \\vldbtitle and \\vldbpagestyle (plain for the submission, empty for the camera-ready).",
    writes: '\\renewcommand\\vldbvolume{…} \\renewcommand\\vldbissue{…} \\renewcommand\\vldbyear{…} \\renewcommand\\vldbauthors{…} \\renewcommand\\vldbtitle{…} \\renewcommand\\vldbpagestyle{…}',
    features: ['class-styled'],
    params: { form: 'vldb', volume: '20', issue: '1', year: '2027', vldbAuthors: '\\authors', vldbTitle: '\\shorttitle', vldbPageStyle: 'plain' },
    evidence: [{ kind: 'source', file: `${EX}/class.vldb/main.tex`, line: '22-33' }],
  },
  mdpi: {
    description:
      "MDPI's internal issue commands: \\firstpage{…} with the page counter set from it, \\pubvolume, \\issuenum, \\articlenumber, \\pubyear and \\copyrightyear, and the publisher's note at the end of the document.",
    writes: '\\firstpage{…} \\makeatletter\\setcounter{page}{\\@firstpage}\\makeatother \\pubvolume{…} \\issuenum{…} \\articlenumber{…} \\pubyear{…} \\copyrightyear{…} \\AtEndDocument{\\PublishersNote}',
    features: ['class-styled'],
    params: { form: 'mdpi', firstPage: '1', volume: '1', issue: '1', articleNumber: '0', year: '2026', copyrightYear: '2026', publishersNote: true },
    evidence: [
      { kind: 'source', file: `${SRC}/0894-mdpi/template.tex`, line: '38-53 (the "MDPI internal commands - do not modify" block), 540 (\\PublishersNote{} at the end of the body)' },
      { kind: 'source', file: 'testing-pipeline/settings/classes/files/Definitions/mdpi.cls', line: '614, 682-684, 727, 752, 1890' },
    ],
  },
  easychair: {
    description: "EasyChair proceedings volume: \\volumeinfo{editors}{count}{event}{volume}{issue}{first page}, the footer line 'Editors (eds.); Event; Volume v, issue: i, pp. first–last', which also sets the first page's number.",
    writes: '\\volumeinfo{…}{…}{…}{…}{…}{…}',
    features: ['class-styled'],
    params: { form: 'easychair', editors: 'J. Bloe', editorCount: 1, conference: 'LICS 2008', volume: '1', issue: '4', firstPage: '134' },
    evidence: [{ kind: 'source', file: `${SRC}/0497-easychair/easychair.cls`, line: '487 (lastpage), 489-499 (the example), 500-531 (\\headfootstyle, \\volumeinfo)' }],
  },
  neurips: {
    description: "NeurIPS workshop's name: \\workshoptitle{…}, which the final notice of a workshop track prints ('Workshop: …').",
    writes: '\\workshoptitle{…}',
    features: ['class-styled'],
    params: { form: 'neurips', conference: 'Workshop Title' },
    evidence: [{ kind: 'source', file: `${SRC}/0506-neurips/neurips_2026.sty`, line: '81-92 (\\workshoptitle, the workshop tracks\' \\@trackname)' }],
  },
  copernicus: {
    description: "Copernicus journal's first page: \\firstpage{…}, the number the class starts the paper's pages at.",
    writes: '\\firstpage{…}',
    features: ['class-styled'],
    params: { form: 'copernicus', firstPage: '1' },
    evidence: [
      { kind: 'source', file: `${SRC}/0195-copernicus/template.tex`, line: '124 (\\firstpage{1})' },
      { kind: 'source', file: `${SRC}/0195-copernicus/copernicus.cls`, line: '2591 (\\def\\firstpage#1{…\\gdef\\@fpage{#1}…})' },
    ],
  },
} as const satisfies { readonly [name: string]: Preset };
