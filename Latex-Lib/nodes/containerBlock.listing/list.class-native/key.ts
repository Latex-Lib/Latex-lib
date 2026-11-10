import { defineKey } from '../../../schema/key.ts';
import { minimal } from '../../../schema/minimal.ts';
import { PRESETS } from './presets.ts';

/** A class's source, as the engine fetches it (MiKTeX snapshot 9766) or as the research holds it. */
const source = (file: string, line: string) => ({ kind: 'source', file, line }) as const;

export default defineKey(
  minimal({
    id: 'list.class-native',
    node: 'containerBlock/listing',
    description:
      "The class's own list environments in place of the kernel's, nested by the items' indent (data.latexStyle): apa7's APAenumerate and APAitemize, or its in-sentence seriation \\begin{seriate} (a) (b) (c); jacow's compact Itemize, Enumerate and Description; jmlr's enumerate* (levels sharing one counter) and altdescription{widest label}; cas-dc and cas-sc's enumerate with a label pattern \\begin{enumerate}[a)] and itemize with a bullet \\begin{itemize}[--], with no package; imsart's longlist, labelled (i), (ii).",
    writes:
      '\\begin{APAenumerate|APAitemize|Itemize|Enumerate|Description|enumerate*|altdescription|longlist} \\item … \\item[…] … \\end{APAenumerate|APAitemize|Itemize|Enumerate|Description|enumerate*|altdescription|longlist}',
    ctan: ['apa7', 'jacow', 'jmlr', 'els-cas-templates'],
    features: ['class-styled', 'numbered'],
    params: {
      form: {
        type: 'enum',
        values: ['apa7', 'jacow', 'jmlr', 'cas', 'imsart'],
        default: 'jacow',
        compat: true,
        description: "whose lists: apa7's APAenumerate/APAitemize, jacow's Itemize/Enumerate/Description, jmlr's enumerate*/altdescription, cas's patterned enumerate and itemize, imsart's longlist",
      },
      seriation: { type: 'boolean', default: false, compat: true, description: "apa7: an enumerate as the class's in-sentence seriation, \\begin{seriate}, (a) (b) (c)" },
      sharedCounter: { type: 'boolean', default: true, description: "jmlr: an enumerate as enumerate*, every level counting on with enumi; false keeps the kernel's enumerate" },
      widestLabel: { type: 'tex', default: '', description: "jmlr: altdescription's widest label, which sets the label column; '' takes the longest label among the items" },
      pattern: { type: 'tex', default: '', description: "cas: a first-level enumerate's label pattern, 1 a A i I standing for the counter (a), (i), Step 1.); '' the class's numbers" },
      bullet: { type: 'tex', default: '', description: "cas: a first-level itemize's bullet (\\begin{itemize}[--]); '' the class's" },
    },
    presets: PRESETS,
    requiresWhen: [
      { when: { form: 'apa7' }, requires: ['env:APAenumerate', 'env:APAitemize'] },
      { when: { form: 'apa7', seriation: true }, requires: ['cmd:\\seriate'] },
      { when: { form: 'jacow' }, requires: ['env:Itemize', 'env:Enumerate', 'env:Description'] },
      { when: { form: 'jmlr' }, requires: ['env:enumerate*', 'env:altdescription'] },
      // imsart.sty l.3292-3316 defines longlist; classes/imsart.ts does not list it yet.
      { when: { form: 'imsart' }, requires: ['env:longlist'] },
      // cas's patterned enumerate and labelled itemize are its redefinitions of the kernel's names (cas-common.sty l.2491-2534): no
      // resource names them, so `onlyWhen` alone keeps the form to cas-dc and cas-sc.
    ],
    only: ['class.apa7', 'class.jacow', 'class.jmlr-pmlr', 'class.cas-dc', 'class.cas-sc', 'class.imsart'],
    onlyWhen: [
      {
        when: { form: 'apa7' },
        classes: ['class.apa7'],
        reason: 'APAenumerate, APAitemize and seriate are apa7.cls\'s own environments (l.739-785); no other class defines them: "Environment APAenumerate undefined"',
        evidence: [source('apa7.cls (apa7 2022/07/25 v2.16, MiKTeX snapshot 9766)', '739-785 (APAenumerate, APAitemize, \\seriate)')],
      },
      {
        when: { form: 'jacow' },
        classes: ['class.jacow'],
        reason: "Itemize, Enumerate and Description are jacow.cls's own compact lists over the enumitem it loads (l.319-322); no other class defines them",
        evidence: [source('jacow.cls (jacow 2022/02/02 v2.7, MiKTeX snapshot 9766)', '319-322')],
      },
      {
        when: { form: 'jmlr' },
        classes: ['class.jmlr-pmlr'],
        reason: "enumerate* and altdescription are jmlrutils.sty's (loaded by jmlr.cls); elsewhere altdescription is undefined and enumerate* is enumitem's or undefined",
        evidence: [source('Latex Related Research/Latex-lib-main/Source/0662-jmlr/jmlr.dtx', '2493-2509 (enumerate*), 2518-2531 (altdescription)')],
      },
      {
        when: { form: 'cas' },
        classes: ['class.cas-dc', 'class.cas-sc'],
        reason:
          "only cas-common.sty reads enumerate's optional argument as a label pattern and itemize's as its bullet (l.2491-2534); under the kernel's enumerate and itemize the bracket is the first item's text, and under enumitem a pattern is an unknown key",
        evidence: [
          source('Latex Related Research/Latex-lib-main/Source/0920-sylvainhalle-papershell/Source/sty/cas/cas-common.sty', '2491-2534'),
          { kind: 'requirement', file: 'Template/template-requirement/Elsevier_CAS_DC.md', line: '153-156' },
        ],
      },
      {
        when: { form: 'imsart' },
        classes: ['class.imsart'],
        reason: "longlist is imsart.sty's own environment (l.3292-3316); no other class defines it",
        evidence: [{ kind: 'requirement', file: 'Template/template-requirement/IMS_Imsart.md', line: '100' }],
      },
    ],
    // The cas form's bracket is cas-common.sty's syntax; enumitem, loaded by another list in the document (General's listing,
    // list.enumitem), replaces enumerate and itemize after the class and reads the bracket as its keys. The jacow form is
    // written over the enumitem jacow.cls loads, so the rule is the cas form's alone (`when`).
    conflicts: [
      {
        pkg: 'enumitem',
        when: { form: 'cas' },
        reason:
          "cas's patterned enumerate and labelled itemize are cas-common.sty's (l.2491-2534); enumitem, loaded after the class, replaces both environments and reads the bracket as its own keys: \\begin{enumerate}[a)] stops at \"Package enumitem Error: a) undefined\", [(i)] at \"(i) undefined\"",
        evidence: [
          { kind: 'compile', cell: 'batch 4 round 1, cas-dc.A, document db8f1b6dc85aa8e7a95a2, result a9ff5c8e369c (l.60 \\begin{enumerate}[a)]): 283 cells under cas-dc.A and cas-sc.A stop at "a) undefined", 289 of their 296 failing branches end in a cas-letters enumerate, each in a document that loads enumitem' },
          { kind: 'compile', reproducer: '\\documentclass{cas-dc} \\usepackage{enumitem} \\begin{document} \\begin{enumerate}[a)] \\item First \\end{enumerate}: "Package enumitem Error: a) undefined"; with [(i)]: "(i) undefined"; without enumitem both pass (ZeroTeX-NG through compat cases, 2026-11-09)' },
        ],
      },
    ],
    // A list sets its own \parshape at the full \linewidth, as the kernel's lists do (list.kernel's needs).
    needs: { paragraph: true },
    // Typeset (ZeroTeX-NG, 2026-11-07) under apa7, jacow, jmlr, cas-dc and cas-sc; imsart's class files are neither in the MiKTeX
    // mirror nor in testing-pipeline/settings/classes/files here ("File `imsart.cls' not found"), so its form is unmeasured.
    targetEngine: 'untested',
  }),
);
