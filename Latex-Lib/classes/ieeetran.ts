import { defineClass } from '../schema/class.ts';

/**
 * IEEEtran, as the class probe measured it (ieeetran-journal.A: loads, preloads,
 * names it already defines, refused packages, layout), with what its
 * requirement document says it defines and forbids.
 */
export default defineClass({
  id: 'class.ieeetran',
  name: "IEEEtran",
  targetEngine: "yes",
  preloads: [],
  defines: ["counter:section", "counter:subsection", "counter:subsubsection", "counter:paragraph", "env:abstract", "env:figure", "env:table", "env:thebibliography", "cmd:\\maketitle", "cmd:\\tableofcontents", "cmd:\\appendix", "cmd:\\IEEEauthorblockN", "cmd:\\IEEEauthorblockA", "cmd:\\IEEEauthorrefmark", "env:IEEEkeywords", "cmd:\\IEEEspecialpapernotice", "cmd:\\IEEEpeerreviewmaketitle", "cmd:\\IEEEoverridecommandlockouts", "cmd:\\IEEEmembership", "cmd:\\IEEEpubid", "cmd:\\IEEEcompsocitemizethanks", "cmd:\\IEEEcompsocthanksitem", "cmd:\\IEEEtitleabstractindextext", "env:IEEEbiography", "env:IEEEbiographynophoto", "cmd:\\IEEEdisplaynontitleabstractindextext", "cmd:\\appendices", "env:IEEEeqnarray", "env:IEEEeqnarraybox", "cmd:\\bstctlcite", "cmd:\\IEEEraisesectionheading", "cmd:\\IEEEPARstart"],
  options: {},
  forbids: {
    technical: [{ pkg: "appendix", reason: "IEEEtran defines \\appendices itself (IEEEtran.cls l.5755: \\def\\appendices), so appendix.sty's \\newenvironment{appendices} fails while the package loads: LaTeX Error: Command \\appendices already defined (appendix.sty l.241). TeX ignores that definition and goes on, so every document that loads appendix carries the error", evidence: [{ kind: 'compile', cell: 'testing-pipeline/out/results/0993456c7165 (ieeetran-journal.A run: document d7663d450afe34b90dfaa, num.appendix@sections and @with-page only; its one error is this one, raised inside appendix.sty)' }, { kind: 'compile', cell: 'testing-pipeline/out/results/a0a0eed4d76d (ieeetran-journal.A run: document d345e334bc355bf6ba589, the same error; all 94 documents holding num.appendix@with-page that left a log carry it, while under article.A the preset passes 233 branches)' }, { kind: 'compile', cell: 'testing-pipeline/out/results/9161f615114b (ieeetran-journal.A run: document d51a13ef70ce6b8999f6d, where 8 of the 17 branches holding num.appendix@with-page pass: the error, raised in the preamble, is charged to one branch of a document. All 81 of the 1,289 holders that pass are in 8 such documents, each carrying the error; the kernel presets load nothing and are not refused)' }] }],
    policy: [],
  },
  layout: { columns: 2, textwidth: "516.0pt", fontsize: "10pt" },
  vocabulary: {},
  evidence: [{ kind: 'compile', cell: 'testing-pipeline/out/profiles/ieeetran-journal.A.json' }, { kind: 'requirement', file: 'Template/template-requirement/IEEEtran_Journal.md', line: '100' }, { kind: 'requirement', file: 'Template/template-requirement/IEEEtran_Journal.md', line: '102' }],
});
