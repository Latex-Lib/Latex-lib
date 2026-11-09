/**
 * bib.class-bst's presets: one per class (or family) whose own .bst the list names, or whose class names it itself (bst '').
 * Evidence is the class's template or source, at the lines that set the style.
 */
import type { Preset } from '../../../schema/params.ts';

const src = (file: string, line: string) => ({ kind: 'source', file: `Latex Related Research/Latex-lib-main/Source/${file}`, line }) as const;

export const PRESETS = {
  'class-style': {
    description:
      "The class sets the style itself, so the list writes no \\bibliographystyle, only \\bibliography{\\jobname}: agu, ascelike, bmvc, corl, ecai, sn-jnl, jmlr, jss, acl and revtex4-2 (whose society file picks apsrev4-2, aipnum4-2...).",
    writes: '\\nocite{*} \\bibliography{\\jobname}',
    features: ['class-styled', 'external-tool'],
    params: {},
    evidence: [
      src('0908-aip-conference-proceedings/doc/latex/revtex/sample/aps/apstemplate.tex', '27-31, 167-168 (the journal selects the BibTeX style)'),
      src('0662-jmlr/pmlr-sample.tex', '764-768 (\\bibliography with no \\bibliographystyle)'),
    ],
  },
  achemso: {
    description:
      "achemso: the class names its own achemso.bst (or biochem) and its control entry, so no \\bibliographystyle; only the cited entries are listed, since its mciteplus stops at an entry only \\nocite{*} brings in.",
    writes: '\\bibliography{\\jobname}',
    features: ['numeric-citations', 'superscript', 'class-styled', 'external-tool'],
    params: { nociteAll: false },
    evidence: [
      src('0528-achemso/achemso-demo.tex', '369-374 (the class sets \\bibliographystyle; \\bibliography{achemso-demo})'),
      src('0528-achemso/achemso.dtx', '2512-2532'),
    ],
  },
  aa: {
    description: "Astronomy & Astrophysics' own aa.bst (author-year) over the class's natbib.",
    writes: '\\nocite{*} \\bibliographystyle{aa} \\bibliography{\\jobname}',
    features: ['author-year', 'class-styled', 'external-tool'],
    params: { bst: 'aa' },
    evidence: [src('0411-aanda/aa_example.zip!aa_example.tex', '633-642 (\\bibliographystyle{aa}, \\bibliography{…})'), src('0411-aanda/macros/bibtex/aa.bst', '1-10')],
  },
  aastex: {
    description: "AAS's aasjournalv7.bst (author-year) under aastex701, which loads natbib itself.",
    writes: '\\nocite{*} \\bibliographystyle{aasjournalv7} \\bibliography{\\jobname}',
    features: ['author-year', 'class-styled', 'external-tool'],
    params: { bst: 'aasjournalv7' },
    evidence: [src('0563-aastex/aastex701-sample.tex', '685-686')],
  },
  emulateapj: {
    description: "The ApJ style, apj.bst, under emulateapj's author-year natbib.",
    writes: '\\nocite{*} \\bibliographystyle{apj} \\bibliography{\\jobname}',
    features: ['author-year', 'class-styled', 'external-tool'],
    params: { bst: 'apj' },
    evidence: [src('0425-iit-bhu-thesis/apj.bst', '1-20 (the ApJ natbib style)')],
  },
  aaai: {
    description: "AAAI: \\usepackage{natbib} with no option (the style forbids options) and no \\bibliographystyle, which aaai2027.sty sets once natbib is loaded.",
    writes: '\\usepackage{natbib} \\nocite{*} \\bibliography{\\jobname}',
    features: ['author-year', 'class-styled', 'external-tool'],
    params: { natbib: 'plain' },
    evidence: [
      src('0703-aaai/AnonymousSubmission/LaTeX/anonymous-submission-latex-2026.tex', '11, 689-702 (aaai2026.sty already sets the bibliographystyle)'),
      src('0031-nhatkhangcs-overleaf-comments/examples/aaai/aaai2027.sty', '343-355'),
    ],
  },
  apa7: {
    description: 'apa7 with its natbib option: apacite.bst, the class having loaded apacite with natbibapa.',
    writes: '\\nocite{*} \\bibliographystyle{apacite} \\bibliography{\\jobname}',
    features: ['author-year', 'class-styled', 'external-tool'],
    params: { bst: 'apacite' },
    evidence: [{ kind: 'source', file: 'Latex-Lib/classes/apa7.ts', line: 'header (apacite [natbibapa] loaded by the class, l.208)' }],
  },
  asmeconf: {
    description: "ASME's conference style asmeconf.bst, numbered, over the class's natbib [sort&compress,numbers].",
    writes: '\\nocite{*} \\bibliographystyle{asmeconf} \\bibliography{\\jobname}',
    features: ['numeric-citations', 'sorted-compressed', 'class-styled', 'external-tool'],
    params: { bst: 'asmeconf' },
    evidence: [src('0909-asmeconf/asmeconf-template.tex', '579 (\\bibliographystyle{asmeconf}: do not change)')],
  },
  asmejour: {
    description: "ASME's journal style asmejour.bst, numbered, over the class's natbib [sort&compress,numbers].",
    writes: '\\nocite{*} \\bibliographystyle{asmejour} \\bibliography{\\jobname}',
    features: ['numeric-citations', 'sorted-compressed', 'class-styled', 'external-tool'],
    params: { bst: 'asmejour' },
    evidence: [{ kind: 'manual', of: 'asmejour', section: 'asmejour-template.tex (\\bibliographystyle{asmejour})', url: 'https://ctan.org/pkg/asmejour' }],
  },
  cas: {
    description:
      "Elsevier's CAS classes: natbib loaded with authoryear,longnamesfirst (the class loads none), the CRediT statement (\\printcredits) before the list, and cas-model2-names.bst.",
    writes: '\\usepackage[authoryear,longnamesfirst]{natbib} \\printcredits \\nocite{*} \\bibliographystyle{cas-model2-names} \\bibliography{\\jobname}',
    features: ['author-year', 'class-styled', 'external-tool'],
    params: { natbib: 'authoryear-longnamesfirst', bst: 'cas-model2-names', printCredits: true },
    evidence: [
      { kind: 'requirement', file: 'Template/template-requirement/Elsevier_CAS_DC.md', line: '164-178' },
      src('0920-sylvainhalle-papershell/Source/tpl/cas/midamble.tpl', '6-10 (\\printcredits, then \\bibliographystyle{cas-model2-names})'),
      src('0920-sylvainhalle-papershell/Source/sty/cas/cas-common.sty', '443-468 (\\printcredits)'),
    ],
  },
  copernicus: {
    description: "Copernicus journals' copernicus.bst (author-year) over the class's natbib [authoryear,round].",
    writes: '\\nocite{*} \\bibliographystyle{copernicus} \\bibliography{\\jobname}',
    features: ['author-year', 'class-styled', 'external-tool'],
    params: { bst: 'copernicus' },
    evidence: [src('0195-copernicus/template.tex', '229 (\\bibliographystyle{copernicus})')],
  },
  'elsarticle-num': {
    description: "elsarticle's numbered style, elsarticle-num.bst, over the class's natbib [numbers].",
    writes: '\\nocite{*} \\bibliographystyle{elsarticle-num} \\bibliography{\\jobname}',
    features: ['numeric-citations', 'class-styled', 'external-tool'],
    params: { bst: 'elsarticle-num' },
    evidence: [src('0107-elsarticle/elsarticle-template-num.tex', '256-260')],
  },
  'elsarticle-num-names': {
    description: "elsarticle's numbered style with names in the labels, elsarticle-num-names.bst, for \\citet and \\citep.",
    writes: '\\nocite{*} \\bibliographystyle{elsarticle-num-names} \\bibliography{\\jobname}',
    features: ['numeric-citations', 'class-styled', 'external-tool'],
    params: { bst: 'elsarticle-num-names' },
    evidence: [src('0107-elsarticle/elsarticle-template-num-names.tex', '257')],
  },
  'elsarticle-harv': {
    description: "elsarticle's author-year (Harvard) style, elsarticle-harv.bst, with \\biboptions{authoryear} switching the class's natbib to author-year.",
    writes: '\\biboptions{authoryear} \\nocite{*} \\bibliographystyle{elsarticle-harv} \\bibliography{\\jobname}',
    features: ['author-year', 'class-styled', 'external-tool'],
    params: { bst: 'elsarticle-harv', bibOptions: 'authoryear' },
    evidence: [src('0107-elsarticle/elsarticle-template-harv.tex', '20, 257'), src('0107-elsarticle/elsarticle.dtx', '1338-1347 (\\biboptions through \\jobname.spl)'), src('0107-elsarticle/doc/elsdoc.tex', '199-208, 742-744')],
  },
  oup: {
    description: "Oxford University Press's numbered oup-plain.bst; the class loads natbib and forces numbers.",
    writes: '\\nocite{*} \\bibliographystyle{oup-plain} \\bibliography{\\jobname}',
    features: ['numeric-citations', 'class-styled', 'external-tool'],
    params: { bst: 'oup-plain' },
    evidence: [src('0914-oup-authoring-template/oup-authoring-template.tex', '817-823'), src('0914-oup-authoring-template/oup-authoring-template.cls', '2424-2450')],
  },
  plos: {
    description:
      'PLOS: the setting already names plos2025.bst, so no \\bibliographystyle; the template\'s cite package and hyperref (plos2025.bst writes \\href) are loaded.',
    writes: '\\usepackage{cite} \\usepackage{hyperref} \\nocite{*} \\bibliography{\\jobname}',
    features: ['numeric-citations', 'class-styled', 'external-tool'],
    params: { cite: true, hyperref: true },
    evidence: [src('0862-plos/plos_latex_template.tex', '88-92 (cite: do not remove; hyperref), 140-146 (\\bibliographystyle{plos2025}), 369-382')],
  },
  tufte: {
    description: "The Tufte classes' plainnat.bst over the class's own natbib and bibentry, the full list at the end.",
    writes: '\\nocite{*} \\bibliographystyle{plainnat} \\bibliography{\\jobname}',
    features: ['author-year', 'class-styled', 'external-tool'],
    params: { bst: 'plainnat' },
    evidence: [src('0793-xtufte/doc/sample-handout.tex', '139-145')],
  },
  'tufte-margin-only': {
    description: 'The Tufte classes with no list at the end: \\nobibliography{\\jobname}, the references printed only in the margin citations (bibentry).',
    writes: '\\nocite{*} \\bibliographystyle{plainnat} \\nobibliography{\\jobname}',
    features: ['author-year', 'margin-note', 'class-styled', 'external-tool'],
    params: { bst: 'plainnat', noBibliography: true },
    evidence: [src('0793-xtufte/doc/sample-handout.tex', '145 (\\nobibliography in place of the list)'), src('0793-xtufte/latex/xtufte-common.def', '791-803 (bibentry)')],
  },
  icml: {
    description: "ICML's kit style icml2026.bst (author-year, plainnat-derived) over the style's natbib.",
    writes: '\\nocite{*} \\bibliographystyle{icml2026} \\bibliography{\\jobname}',
    features: ['author-year', 'class-styled', 'external-tool'],
    params: { bst: 'icml2026' },
    evidence: [src('0461-icml/example_paper.tex', '619-625'), src('0461-icml/icml2026.sty', '123 (\\RequirePackage{natbib})')],
  },
  neurips: {
    description: "NeurIPS: plainnat.bst over the style's natbib (author-year by default).",
    writes: '\\nocite{*} \\bibliographystyle{plainnat} \\bibliography{\\jobname}',
    features: ['author-year', 'class-styled', 'external-tool'],
    params: { bst: 'plainnat' },
    evidence: [src('0506-neurips/neurips_2026.tex', '239-266'), src('0506-neurips/neurips_2026.sty', '119-121')],
  },
  iclr: {
    description: "ICLR's kit style iclr2027_conference.bst (author-year) over the style's natbib.",
    writes: '\\nocite{*} \\bibliographystyle{iclr2027_conference} \\bibliography{\\jobname}',
    features: ['author-year', 'class-styled', 'external-tool'],
    params: { bst: 'iclr2027_conference' },
    evidence: [{ kind: 'source', file: 'Latex-Lib/classes/iclr.ts', line: 'natbib with no option, \\setcitestyle{authoryear,round} (iclr2027_conference.sty l.20-23)' }],
  },
  colm: {
    description: "COLM's kit style colm2026_conference.bst (author-year) over the style's natbib.",
    writes: '\\nocite{*} \\bibliographystyle{colm2026_conference} \\bibliography{\\jobname}',
    features: ['author-year', 'class-styled', 'external-tool'],
    params: { bst: 'colm2026_conference' },
    evidence: [{ kind: 'source', file: 'Latex-Lib/classes/colm.ts', line: 'natbib with no option (colm2026_conference.sty l.42-45)' }],
  },
  cvpr: {
    description: "CVPR: the kit's ieeenat_fullname.bst (numbered), the list set in \\small inside a group.",
    writes: '\\nocite{*} {\\small \\bibliographystyle{ieeenat_fullname} \\bibliography{\\jobname}}',
    features: ['numeric-citations', 'small-type', 'class-styled', 'external-tool'],
    params: { bst: 'ieeenat_fullname', size: 'small' },
    evidence: [src('0031-nhatkhangcs-overleaf-comments/examples/cvpr/main.tex', '100-102'), src('0973-apoorvkh-cvpr-latex-template/_main.tex', '24-27')],
  },
  tmlr: {
    description: "TMLR's tmlr.bst (author-year) over the style's natbib.",
    writes: '\\nocite{*} \\bibliographystyle{tmlr} \\bibliography{\\jobname}',
    features: ['author-year', 'class-styled', 'external-tool'],
    params: { bst: 'tmlr' },
    evidence: [{ kind: 'source', file: 'Latex-Lib/classes/tmlr.ts', line: 'natbib preloaded (tmlr.sty l.15, l.21)' }],
  },
  mnras: {
    description: "MNRAS's own mnras.bst (Harvard author-year).",
    writes: '\\nocite{*} \\bibliographystyle{mnras} \\bibliography{\\jobname}',
    features: ['author-year', 'class-styled', 'external-tool'],
    params: { bst: 'mnras' },
    evidence: [{ kind: 'requirement', file: 'Template/template-requirement/MNRAS.md', line: '110-113' }],
  },
  frontiers: {
    description: "Frontiers' Frontiers-Harvard.bst (author-year) over the class's natbib.",
    writes: '\\nocite{*} \\bibliographystyle{Frontiers-Harvard} \\bibliography{\\jobname}',
    features: ['author-year', 'class-styled', 'external-tool'],
    params: { bst: 'Frontiers-Harvard' },
    evidence: [src('0757-frontiers/frontiers.tex', '155-157')],
  },
  'imsart-number': {
    description: "IMS journals (imsart): natbib with numbers and the IMS numbered style imsart-number.bst.",
    writes: '\\usepackage[numbers]{natbib} \\nocite{*} \\bibliographystyle{imsart-number} \\bibliography{\\jobname}',
    features: ['numeric-citations', 'class-styled', 'external-tool'],
    params: { natbib: 'numbers', bst: 'imsart-number' },
    evidence: [{ kind: 'requirement', file: 'Template/template-requirement/IMS_Imsart.md', line: '109-113, 163' }],
  },
  'imsart-nameyear': {
    description: 'IMS journals (imsart): natbib with authoryear and the IMS author-year style imsart-nameyear.bst.',
    writes: '\\usepackage[authoryear]{natbib} \\nocite{*} \\bibliographystyle{imsart-nameyear} \\bibliography{\\jobname}',
    features: ['author-year', 'class-styled', 'external-tool'],
    params: { natbib: 'authoryear', bst: 'imsart-nameyear' },
    evidence: [{ kind: 'requirement', file: 'Template/template-requirement/IMS_Imsart.md', line: '109-113, 163' }],
  },
  acm: {
    description: "The ACM classes (acmart, aamas, vldb): ACM-Reference-Format.bst, numbered (acmnumeric, the class's default).",
    writes: '\\nocite{*} \\bibliographystyle{ACM-Reference-Format} \\bibliography{\\jobname}',
    features: ['numeric-citations', 'class-styled', 'external-tool'],
    params: { bst: 'ACM-Reference-Format' },
    evidence: [src('0665-acmart/samples/samples.dtx', '1005-1010')],
  },
  'acm-authoryear': {
    description: 'The ACM classes in author-year (TOG, SIGGRAPH): \\citestyle{acmauthoryear} and ACM-Reference-Format.bst.',
    writes: '\\citestyle{acmauthoryear} \\nocite{*} \\bibliographystyle{ACM-Reference-Format} \\bibliography{\\jobname}',
    features: ['author-year', 'class-styled', 'external-tool'],
    params: { bst: 'ACM-Reference-Format', citeStyle: 'acmauthoryear' },
    evidence: [src('0665-acmart/samples/samples.dtx', '127-137 (\\citestyle{acmauthoryear}), 1005-1010')],
  },
} as const satisfies { readonly [name: string]: Preset };
