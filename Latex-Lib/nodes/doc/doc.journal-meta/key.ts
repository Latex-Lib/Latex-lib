import { defineKey } from '../../../schema/key.ts';
import { minimal } from '../../../schema/minimal.ts';
import { PRESETS } from './presets.ts';

/** Each form's class (`onlyWhen`) and the commands it prints there (`requiresWhen`). */
const FORMS = {
  aastex: { classes: ['class.aastex'], requires: ['cmd:\\submitjournal', 'cmd:\\watermark'] },
  emulateapj: { classes: ['class.emulateapj'], requires: ['cmd:\\slugcomment'] },
  agu: { classes: ['class.agu'], requires: ['cmd:\\journalname'] },
  asmeconf: { classes: ['class.asmeconf'], requires: ['cmd:\\ConfName', 'cmd:\\ConfAcronym', 'cmd:\\ConfDate', 'cmd:\\ConfCity'] },
  asmejour: { classes: ['class.asmejour'], requires: ['cmd:\\JourName'] },
  oup: { classes: ['class.oup-authoring-template'], requires: ['cmd:\\journaltitle', 'cmd:\\pubyear', 'cmd:\\copyrightyear', 'cmd:\\vol', 'cmd:\\issue', 'cmd:\\DOI', 'cmd:\\access', 'cmd:\\appnotes'] },
  amsproc: { classes: ['class.amsproc'], requires: ['cmd:\\copyrightinfo'] },
  elsarticle: { classes: ['class.elsarticle', 'class.elsarticle-3p'], requires: ['cmd:\\journal'] },
  jmlr: { classes: ['class.jmlr-pmlr'], requires: ['cmd:\\jmlrvolume', 'cmd:\\jmlryear', 'cmd:\\jmlrworkshop', 'cmd:\\editor'] },
  vldb: { classes: ['class.vldb'], requires: ['cmd:\\vldbvolume', 'cmd:\\vldbissue', 'cmd:\\vldbyear', 'cmd:\\vldbauthors', 'cmd:\\vldbtitle', 'cmd:\\vldbpagestyle'] },
  mdpi: { classes: ['class.mdpi'], requires: ['cmd:\\firstpage', 'cmd:\\pubvolume', 'cmd:\\issuenum', 'cmd:\\articlenumber', 'cmd:\\pubyear', 'cmd:\\copyrightyear', 'cmd:\\PublishersNote'] },
  easychair: { classes: ['class.easychair'], requires: ['cmd:\\volumeinfo'] },
  neurips: { classes: ['class.neurips'], requires: ['cmd:\\workshoptitle'] },
  copernicus: { classes: ['class.copernicus'], requires: ['cmd:\\firstpage'] },
} as const;

export default defineKey(
  minimal({
    id: 'doc.journal-meta',
    node: 'doc',
    description:
      "A journal's or a conference's own constants, set once per template in the preamble with the class's commands: AASTeX's \\submitjournal and \\watermark, emulateapj's \\slugcomment, AGU's \\journalname and \\draftfalse, asmeconf's \\ConfName, \\ConfAcronym, \\ConfDate and \\ConfCity, asmejour's \\JourName, OUP's \\journaltitle, \\vol, \\issue and \\DOI, amsproc's \\publname and \\copyrightinfo, elsarticle's \\journal, PMLR's \\jmlrvolume, \\jmlryear, \\jmlrworkshop and \\editor, PVLDB's \\vldbvolume, MDPI's \\firstpage, \\pubvolume and \\issuenum, EasyChair's \\volumeinfo, NeurIPS's \\workshoptitle and Copernicus's \\firstpage. Each line only when its value is set.",
    writes:
      '\\submitjournal{…} \\watermark{…} | \\slugcomment{…} | \\journalname{…} \\draftfalse | \\ConfName{…} \\ConfAcronym{…} \\ConfDate{…} \\ConfCity{…} | \\JourName{…} | \\journaltitle{…} \\pubyear{…} \\vol{…} \\issue{…} \\DOI{…} | \\def\\publname{…} \\copyrightinfo{…}{…} | \\journal{…} | \\jmlrvolume{…} \\jmlryear{…} \\jmlrworkshop{…} \\editor{…} | \\renewcommand\\vldbvolume{…} … | \\firstpage{…} \\pubvolume{…} \\issuenum{…} … | \\volumeinfo{…}{…}{…}{…}{…}{…} | \\workshoptitle{…} | \\firstpage{…}',
    ctan: ['aastex', 'emulateapj', 'asmeconf', 'asmejour', 'oup-authoring-template', 'amscls', 'elsarticle', 'jmlr', 'easychair', 'copernicus'],
    features: ['class-styled'],
    // One value, one parameter, whichever class's command prints it (the journal is \submitjournal, \journalname, \JourName,
    // \journaltitle, \publname or \journal); `form` picks the commands. Values are the template's own LaTeX, printed as given.
    params: {
      form: {
        type: 'enum',
        values: ['none', ...Object.keys(FORMS)],
        default: 'none',
        compat: true,
        description: "the class whose commands print the values; none prints nothing",
      },
      journal: { type: 'tex', default: '', description: "the journal's or the series' name: aastex \\submitjournal, agu \\journalname, asmejour \\JourName, oup \\journaltitle, amsproc \\publname, elsarticle \\journal" },
      conference: { type: 'tex', default: '', description: "the conference's or workshop's name: asmeconf \\ConfName, jmlr \\jmlrworkshop, easychair's event, neurips \\workshoptitle" },
      conferenceShort: { type: 'string', default: '', description: "the conference's acronym: asmeconf \\ConfAcronym" },
      conferenceDate: { type: 'string', default: '', description: "the conference's dates: asmeconf \\ConfDate" },
      conferenceVenue: { type: 'string', default: '', description: "the conference's city: asmeconf \\ConfCity" },
      volume: { type: 'string', default: '', description: 'the volume: jmlr \\jmlrvolume, vldb \\vldbvolume, mdpi \\pubvolume, oup \\vol, easychair (a number)' },
      issue: { type: 'string', default: '', description: 'the issue: vldb \\vldbissue, mdpi \\issuenum, oup \\issue, easychair (a number)' },
      year: { type: 'string', default: '', description: 'the year of publication: jmlr \\jmlryear, vldb \\vldbyear, mdpi and oup \\pubyear' },
      copyrightYear: { type: 'string', default: '', description: 'the copyright year: oup and mdpi \\copyrightyear, amsproc \\copyrightinfo' },
      copyrightHolder: { type: 'string', default: '', description: "the copyright holder: amsproc \\copyrightinfo's second argument" },
      volumeInfo: { type: 'tex', default: '', description: "amsproc's volume line under the series logo (\\volinfo)" },
      firstPage: { type: 'string', default: '', description: 'the first page number: mdpi and copernicus \\firstpage, easychair (default 1)' },
      doi: { type: 'string', default: '', description: "oup's \\DOI line" },
      editors: { type: 'tex', default: '', description: "the volume's editors: jmlr \\editor (\\editors when editorCount is above 1), easychair" },
      editorCount: { type: 'number', default: 1, description: 'how many editors: jmlr \\editors and easychair "eds." when above 1' },
      articleNumber: { type: 'string', default: '', description: "mdpi's \\articlenumber" },
      articleType: { type: 'string', default: '', description: "oup's article type line, \\appnotes (Paper, Original Article)" },
      access: { type: 'string', default: '', description: "oup's publication line, \\access" },
      societyLogo: { type: 'tex', default: '', description: "oup's society logo on the first page (\\societylogo; the class never defines it, and the title way gives an empty one)" },
      slugcomment: { type: 'tex', default: '', description: "emulateapj's slug line, \\slugcomment" },
      watermark: { type: 'string', default: '', description: "aastex's first-page watermark, \\watermark" },
      watermarkFontSize: { type: 'dimen', default: '', description: "aastex's watermark size, \\setwatermarkfontsize (2in by default)" },
      turnOffEdit: { type: 'boolean', default: false, description: "aastex's \\turnoffedit: \\added, \\deleted and \\replaced print plain" },
      draft: { type: 'boolean', default: true, description: "agu: false writes \\draftfalse, which undoes the class's draft option (line numbers, double spacing)" },
      publishersNote: { type: 'boolean', default: false, description: "mdpi's publisher's note at the end of the document (\\AtEndDocument{\\PublishersNote}; the sample's \\PublishersNote{} is a body line)" },
      vldbAuthors: { type: 'tex', default: '', description: "vldb's \\vldbauthors (the template's \\authors)" },
      vldbTitle: { type: 'tex', default: '', description: "vldb's \\vldbtitle (the template's \\shorttitle)" },
      vldbPageStyle: { type: 'string', default: '', description: "vldb's \\vldbpagestyle: plain for the submission, empty for the camera-ready" },
    },
    presets: PRESETS,
    requiresWhen: Object.entries(FORMS).map(([form, f]) => ({ when: { form }, requires: f.requires })),
    only: [...new Set(Object.values(FORMS).flatMap((f) => f.classes))],
    onlyWhen: Object.entries(FORMS).map(([form, f]) => ({
      when: { form },
      classes: f.classes,
      reason: `the ${form} form prints ${f.requires.join(', ').replace(/cmd:/gu, '')}, which only that class defines: elsewhere each stops at "Undefined control sequence"`,
      evidence: PRESETS[form as keyof typeof PRESETS].evidence,
    })),
    // Typeset on ZeroTeX-NG (2026-11-07), each preset's lines in the preamble of a minimal document of its class: ok under aastex701
    // (pinned file), emulateapj, asmeconf, amsproc, elsarticle (preprint and 3p), jmlr[pmlr], Definitions/mdpi (pinned files),
    // easychair (Source/0497-easychair/easychair.cls, title in the preamble), agujournal2019 (Source/0040-agu; the profile's
    // agujournal2025 is not here) and neurips_2026 (Source/0506-neurips, sglblindworkshop). Not shown: oup-authoring-template
    // stops at \maketitle on rsfs10, a font the engine lacks, after these lines ran; asmejour (the mirror's) stops at its own font
    // check (the profile's asmejour-latexlib is not here); copernicus.cls stops at \pdfoutput under XeTeX; vldb (no pvldb.sty here).
    targetEngine: 'yes',
  }),
);

