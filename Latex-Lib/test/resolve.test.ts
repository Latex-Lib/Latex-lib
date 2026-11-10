/**
 * The resolver on the real library: class rules, names the class defines,
 * forbidden packages, two theorem engines, counters a class lacks; and the
 * pilot's pick of one handler under a class; a conflict with General's ways of
 * a node, when the caller says General prints it. On a small library: a preset
 * bound to the classes that give its form (`onlyWhen`).
 */
import assert from 'node:assert/strict';
import { join } from 'node:path';
import { before, test } from 'node:test';

import { pick, resolve } from '../engine/resolve.ts';
import { loadLibrary } from '../library.ts';
import { ELEMENTS } from '../nodes/containerBlock.mathElement/statement.ts';
import type { Library } from '../schema/validate.ts';
import { class_, key } from './fixtures.ts';

let library: Library;
before(async () => {
  library = (await loadLibrary(join(import.meta.dirname, '..'))).library;
});
const kinds = { 'containerBlock/mathElement': ELEMENTS };
const under = (classId: string, ...choices: { way: string; params?: Record<string, string | boolean> }[]) => resolve(library, { classId, choices, kinds });
/** Whether the class keeps its abstract environment for \maketitle (`heldByMaketitle`): an abstract way there goes with a title that runs it. */
const keepsAbstract = (classId: string) => library.classes.find((c) => c.id === classId)?.heldByMaketitle?.some((h) => h.resource === 'env:abstract') ?? false;

test('amsthm goes under article and amsart, and not under llncs, acmart or revtex4-2', () => {
  assert.deepEqual(under('class.article', { way: 'thm.amsthm' }), []);
  assert.deepEqual(under('class.amsart', { way: 'thm.amsthm' }), []);
  assert.ok(under('class.llncs', { way: 'thm.amsthm' }).some((v) => v.includes('\\proof already defined')));
  const acm = under('class.acmart', { way: 'thm.amsthm' });
  assert.ok(acm.some((v) => v.includes('defines env:definition, env:theorem, env:lemma, env:corollary') || v.includes('which class.acmart already defines')), acm.join('\n'));
  assert.deepEqual(under('class.acmart', { way: 'thm.amsthm', params: { rename: 'yes' } }), [], 'renamed, it no longer clashes');
  assert.ok(under('class.revtex4-2', { way: 'thm.amsthm' }).some((v) => v.includes('amsthm markup may not be used')));
});

test('ntheorem cannot go with amsthm, whether a class or another handler loads it', () => {
  assert.ok(under('class.amsart', { way: 'thm.ntheorem' }).some((v) => v.includes('conflicts with amsthm')));
  assert.deepEqual(under('class.article', { way: 'thm.ntheorem' }), []);
  assert.ok(under('class.article', { way: 'thm.ntheorem' }, { way: 'thm.amsthm' }).some((v) => v.includes('both own theorem-engine')));
});

test('a counter the class lacks cannot number statements', () => {
  assert.ok(under('class.article', { way: 'thm.kernel', params: { numberWithin: 'chapter' } }).some((v) => v.includes('needs counter:chapter')));
  assert.deepEqual(under('class.memoir', { way: 'thm.kernel', params: { numberWithin: 'chapter' } }), []);
  assert.deepEqual(under('class.ieeetran', { way: 'thm.kernel', params: { numberWithin: 'none' } }), []);
});

test("LNCS numbers statements through the paper, so a way declaring its own goes there only renamed and unnumbered by section", () => {
  assert.ok(under('class.llncs', { way: 'thm.kernel', params: { rename: 'yes' } }).length > 0);
  assert.deepEqual(under('class.llncs', { way: 'thm.kernel', params: { rename: 'yes', numberWithin: 'none' } }), []);
});

test("the class's own environments go only under a class that has them", () => {
  assert.deepEqual(under('class.llncs', { way: 'thm.class-native' }), []);
  assert.ok(under('class.article', { way: 'thm.class-native' }).some((v) => v.includes('only for class.llncs, class.acmart')));
});

test('the pick: the way as it is, renamed, or the class native', () => {
  const at = (way: string, classId: string) => pick(library, { node: 'containerBlock/mathElement', way, classId, kinds: ELEMENTS, nativeWay: 'thm.class-native' });
  assert.deepEqual(at('thm.amsthm', 'class.article'), { way: 'thm.amsthm', params: library.keys.find((k) => k.id === 'thm.amsthm')?.presets['ams-section']?.params, how: 'as-is' });
  assert.equal((at('thm.amsthm', 'class.acmart') as { how: string }).how, 'renamed');
  assert.equal((at('thm.amsthm', 'class.llncs') as { how: string }).how, 'class-native');
  assert.deepEqual(at('thm.amsthm', 'class.revtex4-2'), { way: 'thm.kernel', params: { numberWithin: 'none', sharedCounter: false }, how: 'fallback' }, 'APS permits \\newtheorem, not amsthm');
});

const at = (classId: string, node: string, way: string, kinds: readonly string[] = [], params: Record<string, string> = {}) =>
  resolve(library, { classId, choices: [{ way, node, params }], kinds: { [node]: kinds } });

test("what a class lacks stops the ways that need it: book has no abstract, letter no sections, floats, title or contents", () => {
  assert.ok(at('class.book', 'containerBlock/abstract', 'abs.kernel').some((v) => v.includes('needs env:abstract')));
  assert.deepEqual(at('class.report', 'containerBlock/abstract', 'abs.kernel'), []);
  assert.ok(at('class.letter', 'paragraph/heading', 'head.kernel', ['section']).some((v) => v.includes('needs counter:section')));
  assert.ok(at('class.letter', 'atomicBlock/image', 'fig.graphicx').some((v) => v.includes('needs env:figure')));
  assert.ok(at('class.letter', 'paragraph/title', 'front.maketitle').some((v) => v.includes('needs cmd:\\maketitle')));
  assert.ok(at('class.letter', 'atomicBlock/tableContents', 'toc.kernel').some((v) => v.includes('needs cmd:\\tableofcontents')));
  assert.deepEqual(at('class.book', 'paragraph/heading', 'head.fncychap', ['chapter']), []);
  assert.ok(at('class.article', 'paragraph/heading', 'head.fncychap', ['section']).some((v) => v.includes('needs counter:chapter')));
});

test("sectsty goes under extarticle, whose sectioning is article's (its handler marks article as loaded while sectsty loads, b22), and not under the classes with sectioning of their own", () => {
  assert.deepEqual(at('class.extarticle', 'paragraph/heading', 'head.sectsty', ['section']), []);
  for (const c of ['class.mnras', 'class.siamart', 'class.aastex']) assert.ok(at(c, 'paragraph/heading', 'head.sectsty', ['section']).some((v) => v.includes("doesn't work with this document class")), c);
});

test("llncs refuses \\subparagraph, whose warning recurses, unless sectsty replaces it", () => {
  for (const way of ['head.kernel', 'head.class-native', 'head.fncychap']) {
    assert.ok(at('class.llncs', 'paragraph/heading', way, ['subparagraph']).some((v) => v.includes('forbids cmd:\\subparagraph')), way);
  }
  assert.deepEqual(at('class.llncs', 'paragraph/heading', 'head.sectsty', ['subparagraph']), [], 'sectsty replaces it');
  for (const way of ['head.kernel', 'head.class-native', 'head.sectsty', 'head.fncychap']) assert.deepEqual(at('class.llncs', 'paragraph/heading', way, ['paragraph']), [], way);
  assert.deepEqual(at('class.article', 'paragraph/heading', 'head.kernel', ['subparagraph']), [], "article's works");
});

test("beamer: its own lists, sections, contents and colours refuse the packages that restyle them, and it has no chapters", () => {
  for (const [node, way] of [['containerBlock/listing', 'list.enumitem'], ['paragraph/heading', 'head.titlesec'], ['atomicBlock/tableContents', 'toc.tocloft'], ['table', 'tbl.colortbl'], ['table', 'tbl.longtable'], ['atomicBlock/image', 'fig.wrapfig']] as const) {
    assert.ok(at('class.beamer', node, way, ['section']).length > 0, `${way} under beamer`);
  }
  assert.ok(at('class.beamer', 'paragraph/heading', 'head.kernel', ['chapter']).some((v) => v.includes('needs counter:chapter')));
  assert.deepEqual(at('class.beamer', 'paragraph/heading', 'head.kernel', ['section', 'subsection']), []);
  assert.deepEqual(at('class.beamer', 'containerBlock/mathElement', 'thm.class-native'), []);
});

test('ACM forbids changing list definitions, and acmart refuses a restyled \\section', () => {
  for (const way of ['list.enumitem', 'list.paralist', 'list.enumerate-pkg', 'list.scrextend']) assert.ok(at('class.acmart', 'containerBlock/listing', way).some((v) => v.includes('not allowed')), way);
  assert.deepEqual(at('class.acmart', 'containerBlock/listing', 'list.kernel'), []);
  assert.ok(at('class.acmart', 'paragraph/heading', 'head.titlesec', ['section']).some((v) => v.includes('forbids titlesec')));
  assert.ok(at('class.acmart', 'paragraph/heading', 'head.sectsty', ['section']).length > 0);
});

test('acmart defines marginfigure and margintable, which sidenotes defines again, and refuses cite, whose \\cite breaks its natbib', () => {
  assert.ok(at('class.acmart', 'containerBlock/note', 'note.sidenotes').some((v) => v.includes('env:marginfigure') && v.includes('already defines')));
  assert.ok(at('class.acmart', 'containerBlock/refContainer', 'bib.cite-pkg').some((v) => v.includes('forbids cite')));
});

test("amsart's and acmart's \\@starttoc takes the heading as a second argument, which tocloft's calls never give: tocloft is refused there", () => {
  for (const cls of ['class.amsart', 'class.acmart']) {
    assert.ok(at(cls, 'atomicBlock/tableContents', 'toc.tocloft').some((v) => v.includes('forbids tocloft')), cls);
    assert.deepEqual(at(cls, 'atomicBlock/tableContents', 'toc.kernel'), [], cls);
  }
  assert.deepEqual(at('class.article', 'atomicBlock/tableContents', 'toc.tocloft'), []);
});

test("KOMA and memoir style their own headings and contents: titlesec and tocloft are refused, KOMA's own ways go", () => {
  for (const cls of ['class.scrartcl', 'class.scrbook', 'class.scrreprt']) {
    assert.ok(at(cls, 'paragraph/heading', 'head.titlesec', ['section']).length > 0, cls);
    assert.ok(at(cls, 'atomicBlock/tableContents', 'toc.tocloft').length > 0, cls);
    assert.deepEqual(at(cls, 'paragraph/heading', 'head.koma-fonts', ['section']), [], cls);
    assert.deepEqual(at(cls, 'atomicBlock/tableContents', 'toc.koma'), [], cls);
  }
  assert.ok(at('class.memoir', 'paragraph/heading', 'head.titlesec', ['chapter']).length > 0);
  assert.deepEqual(at('class.memoir', 'paragraph/heading', 'head.memoir-style', ['chapter']), []);
  assert.ok(at('class.book', 'paragraph/heading', 'head.koma-fonts', ['chapter']).some((v) => v.includes('only for')));
});

test('amsbook builds in amsmath and amsthm, and the AMS asks that neither be loaded again', () => {
  assert.ok(at('class.amsbook', 'containerBlock/blockMath', 'math.amsmath').some((v) => v.includes('do not load')));
  assert.deepEqual(at('class.amsbook', 'containerBlock/blockMath', 'math.kernel'), []);
});

test('journal classes: AASTeX refuses cite, multicol and a second hyperref; LIPIcs forbids enumitem; MDPI prints its own title', () => {
  assert.ok(at('class.aastex', 'containerBlock/columns', 'cols.multicol').some((v) => v.includes('forbids multicol')));
  assert.ok(at('class.aastex', 'containerBlock/refContainer', 'bib.cite-pkg').some((v) => v.includes('forbids cite')));
  assert.ok(at('class.aastex', 'hyperlink/hyperlink', 'meta.hyperref').some((v) => v.includes('do not import hyperref')));
  assert.ok(at('class.lipics', 'containerBlock/listing', 'list.enumitem').some((v) => v.includes('forbids enumitem')));
  // enumitem against enumerate needs enumerate loaded after it: mdpi's own enumitem refuses a way's enumerate, while aa's own enumerate,
  // loaded first, is left out of its profile and refuses no enumitem branch (b22, O-ENUM).
  assert.ok(at('class.mdpi', 'containerBlock/listing', 'list.enumerate-pkg').some((v) => v.includes('enumitem cannot be loaded with enumerate')));
  assert.ok(!at('class.aa', 'containerBlock/listing', 'list.enumitem').some((v) => v.includes('enumerate')));
  assert.ok(at('class.mdpi', 'paragraph/title', 'front.maketitle').some((v) => v.includes('needs cmd:\\maketitle')));
});

test('a class whose abstract is a command takes the class-native abstract in its command form, not the environment', () => {
  for (const cls of ['class.sn-jnl', 'class.mdpi', 'class.aa']) {
    assert.ok(at(cls, 'containerBlock/abstract', 'abs.kernel').some((v) => v.includes('needs env:abstract')), cls);
    assert.deepEqual(at(cls, 'containerBlock/abstract', 'abs.class-native', [], { form: 'command' }), [], cls);
    assert.ok(at(cls, 'containerBlock/abstract', 'abs.class-native').some((v) => v.includes('one-argument command')), `${cls}: its environment form`);
  }
});

test("a class whose \\abstract is the environment refuses the class-native command form and takes its environment form", () => {
  for (const cls of ['class.article', 'class.report', 'class.ieeetran', 'class.amsart', 'class.elsarticle', 'class.acmart', 'class.cas-sc']) {
    const command = at(cls, 'containerBlock/abstract', 'abs.class-native', [], { form: 'command' });
    assert.ok(command.some((v) => v.includes('only for class.aa, class.mdpi, class.sn-jnl')), `${cls}: ${command.join('\n')}`);
    // Where the class keeps the abstract for \maketitle, with a title that runs it.
    assert.deepEqual(keepsAbstract(cls) ? under(cls, { way: 'abs.class-native' }, { way: 'front.class-native' }) : at(cls, 'containerBlock/abstract', 'abs.class-native'), [], cls);
  }
});

test('a class that keeps its abstract for \\maketitle needs a title that runs it; one that prints it in place does not', () => {
  for (const cls of ['class.amsart', 'class.acmart', 'class.elsarticle']) {
    const lost = under(cls, { way: 'abs.class-native' }, { way: 'front.titlepage-env' });
    assert.ok(lost.some((v) => v.includes('keeps env:abstract for \\maketitle')), `${cls}: ${lost.join('\n')}`);
    assert.equal(under(cls, { way: 'abs.class-native' }, { way: 'front.class-native' }).some((v) => v.includes('keeps env:abstract')), false, cls);
    assert.equal(under(cls, { way: 'abs.class-native' }, { way: 'front.maketitle' }).some((v) => v.includes('keeps env:abstract')), false, cls);
  }
  // abs.kernel prints the same environment, and is lost the same way.
  assert.ok(under('class.amsart', { way: 'abs.kernel' }, { way: 'front.titlepage-env' }).some((v) => v.includes('keeps env:abstract')));
  // article and IEEEtran print the abstract where it is written.
  for (const cls of ['class.article', 'class.ieeetran']) assert.deepEqual(under(cls, { way: 'abs.class-native' }, { way: 'front.titlepage-env' }), [], cls);
});

test("revtex4-2 takes one \\author per author: the class's title block in that form, and no \\and", () => {
  assert.ok(under('class.revtex4-2', { way: 'front.class-native' }).some((v) => v.includes('\\and is not supported')));
  assert.deepEqual(under('class.revtex4-2', { way: 'front.class-native', params: { authors: 'separate' } }), []);
  assert.ok(under('class.revtex4-2', { way: 'front.maketitle' }).some((v) => v.includes('\\and is not supported')));
  // Elsewhere the kernel's \\author{A \\and B} goes.
  assert.deepEqual(under('class.article', { way: 'front.class-native' }), []);
});

test('a package the class loads itself takes no option the class did not give it', () => {
  // revtex4-2 loads natbib with sort&compress: natbib's numbers or square after it stop at an option clash.
  const list = { way: 'bib.natbib', node: 'containerBlock/refContainer', params: { brackets: 'square', sort: 'sort&compress', separator: 'comma' } };
  const natbib = resolve(library, { classId: 'class.revtex4-2', choices: [list] });
  assert.ok(natbib.some((v) => v.includes('class.revtex4-2 loads natbib itself with sort&compress') && v.includes('Option clash for package natbib')), natbib.join('\n'));
  assert.equal(natbib.some((v) => v.includes('sort&compress stops')), false, 'the option the class gave is not one');
  // Under article nothing loads natbib first.
  assert.deepEqual(resolve(library, { classId: 'class.article', choices: [list] }), []);
});

test("revtex4-2 and aastex701 undefine the abstract at \\maketitle, so neither abstract way that prints the class's environment goes there (b22, R3)", () => {
  for (const cls of ['class.revtex4-2', 'class.aastex']) {
    assert.ok(at(cls, 'containerBlock/abstract', 'abs.kernel').some((v) => v.includes('Environment abstract undefined')), cls);
    assert.ok(at(cls, 'containerBlock/abstract', 'abs.class-native').some((v) => v.includes('Environment abstract undefined')), cls);
  }
});

test("a renamed abstract heading goes only where the class prints \\abstractname (b22, JR1-3)", () => {
  for (const cls of ['class.mnras', 'class.iopjournal']) {
    assert.ok(at(cls, 'containerBlock/abstract', 'abs.kernel', [], { name: 'Executive Summary' }).some((v) => v.includes('renamed heading never shows')), cls);
    assert.deepEqual(at(cls, 'containerBlock/abstract', 'abs.kernel'), [], `${cls}: its fixed heading is no bar to an unrenamed preset`);
  }
  // elsarticle keeps the abstract for \\maketitle: with a title that runs it.
  assert.deepEqual(under('class.elsarticle', { way: 'abs.kernel', params: { name: 'Executive Summary' } }, { way: 'front.class-native' }), [], 'elsarticle takes the name through \\abstracttitle');
});

test("theorems: aa's \\newtheorem takes two more arguments, siamart loads ntheorem, both predefine their environments", () => {
  assert.ok(at('class.aa', 'containerBlock/mathElement', 'thm.kernel', [], { rename: 'yes' }).some((v) => v.includes('two more arguments')));
  assert.ok(at('class.siamart', 'containerBlock/mathElement', 'thm.amsthm', [], { rename: 'yes' }).some((v) => v.includes('ntheorem')));
  for (const cls of ['class.aa', 'class.siamart', 'class.lipics']) assert.deepEqual(at(cls, 'containerBlock/mathElement', 'thm.class-native'), [], cls);
});

test("a class built on another keeps that class's rules: ctexbeamer is beamer's, and EasyChair's thesis option brings chapters", () => {
  assert.ok(at('class.ctexbeamer', 'containerBlock/listing', 'list.enumitem').some((v) => v.includes('beamer redefines')));
  assert.deepEqual(at('class.ctexbeamer', 'containerBlock/mathElement', 'thm.class-native'), []);
  assert.ok(at('class.easychair', 'paragraph/heading', 'head.kernel', ['chapter']).some((v) => v.includes('needs counter:chapter')));
  assert.deepEqual(resolve(library, { classId: 'class.easychair', classOptions: ['thesis'], choices: [{ way: 'head.kernel', node: 'paragraph/heading' }], kinds: { 'paragraph/heading': ['chapter'] } }), []);
});

test('minimal has nothing a way could rest on: no sections, title, floats, contents or bibliography', () => {
  for (const [node, way, kinds] of [['paragraph/heading', 'head.kernel', ['section']], ['atomicBlock/image', 'fig.graphicx', []], ['paragraph/title', 'front.maketitle', []], ['atomicBlock/tableContents', 'toc.kernel', []], ['containerBlock/refContainer', 'bib.thebibliography', []]] as const) {
    assert.ok(at('class.minimal', node, way, kinds).some((v) => v.includes('needs')), way);
  }
  assert.deepEqual(at('class.minimal', 'paragraph/paragraph', 'para.kernel'), []);
});

test("Tufte's own \\sidenote and \\marginnote clash with the packages of those names, and its natbib with biblatex", () => {
  assert.ok(at('class.tufte-handout', 'containerBlock/note', 'note.sidenotes').some((v) => v.includes('defines cmd:\\sidenote')));
  assert.ok(at('class.tufte-book', 'containerBlock/note', 'note.marginnote').some((v) => v.includes('defines cmd:\\marginnote')));
  assert.deepEqual(at('class.tufte-handout', 'containerBlock/note', 'note.marginpar'), []);
  assert.ok(at('class.tufte-handout', 'containerBlock/refContainer', 'bib.biblatex-bibtex').some((v) => v.includes('natbib')));
  // Its nobib loads neither natbib nor bibentry (OptionEffect.unloads, b22), so biblatex goes under a template that gives it.
  assert.deepEqual(resolve(library, { classId: 'class.tufte-handout', classOptions: ['nobib'], choices: [{ way: 'bib.biblatex-bibtex', node: 'containerBlock/refContainer' }] }).filter((v) => v.includes('natbib')), []);
});

test("tufte-handout refuses footnotehyper under its sidenote \\footnote, and \\subsubsection and \\subparagraph are its errors (round 2 of batch 1)", () => {
  // Its \footnote hands \@footnotetext an optional offset, which footnotehyper's \savenotes does not take (TU2).
  assert.ok(at('class.tufte-handout', 'footnoteAnchor/footnoteAnchor', 'fn.bigfoot').some((v) => v.includes('forbids footnotehyper')));
  // tufte-common.def replaces both commands with a class error, which no heading way brings back (TU3).
  for (const level of ['subsubsection', 'subparagraph']) for (const way of ['head.kernel', 'head.titlesec']) {
    assert.ok(at('class.tufte-handout', 'paragraph/heading', way, [level]).some((v) => v.includes(`forbids cmd:\\${level}`)), `${way} ${level}`);
  }
  assert.ok(!at('class.tufte-handout', 'paragraph/heading', 'head.kernel', ['subsection']).some((v) => v.includes('forbids')), 'subsection stays');
});

test("a poster's blocks are macro arguments, a CV has no title or abstract of the kernel's, and exam's \\part is a question's", () => {
  assert.ok(at('class.tikzposter', 'code/code', 'code.listings').some((v) => v.includes('macro argument')));
  assert.ok(at('class.tikzposter', 'atomicBlock/image', 'fig.graphicx').some((v) => v.includes('needs env:figure')));
  assert.deepEqual(at('class.tikzposter', 'paragraph/title', 'front.maketitle'), []);
  assert.ok(at('class.moderncv', 'paragraph/title', 'front.maketitle').some((v) => v.includes('needs cmd:\\maketitle')));
  assert.deepEqual(at('class.moderncv', 'paragraph/heading', 'head.class-native', ['section']), []);
  assert.ok(at('class.exam', 'paragraph/heading', 'head.kernel', ['part']).some((v) => v.includes('forbids cmd:\\part')));
  assert.deepEqual(at('class.exam', 'paragraph/heading', 'head.kernel', ['section']), []);
  assert.deepEqual(resolve(library, { classId: 'class.jlreq', classOptions: ['book'], choices: [{ way: 'head.kernel', node: 'paragraph/heading' }], kinds: { 'paragraph/heading': ['chapter'] } }), ['class.jlreq does not run in the target engine'], 'its book option brings chapters; the engine still refuses it');
});

test('class audit (batch 6): what the journal classes load, define and refuse, read from their sources', () => {
  // aastex701 and sn-jnl load natbib, so biblatex is refused (CA1, CA10).
  assert.ok(at('class.aastex', 'containerBlock/refContainer', 'bib.biblatex-biber').some((v) => v.includes('natbib')));
  assert.ok(at('class.sn-jnl', 'containerBlock/refContainer', 'bib.biblatex-bibtex').some((v) => v.includes('natbib')));
  // aa's and aastex701's natbib is author-year: numeric and hand-written lists stop, apalike goes (CA2).
  assert.ok(at('class.aa', 'containerBlock/refContainer', 'bib.bibtex-bst').some((v) => v.includes('author-year')));
  assert.deepEqual(at('class.aa', 'containerBlock/refContainer', 'bib.bibtex-bst', [], { bst: 'apalike' }), []);
  assert.ok(at('class.aastex', 'containerBlock/refContainer', 'bib.thebibliography').some((v) => v.includes('author-year')));
  assert.ok(at('class.aa', 'containerBlock/refContainer', 'bib.cite-pkg').some((v) => v.includes('author-year')));
  // A class that sets its own \bibliographystyle (CA11), and apacite after natbib (CA5; a package fact since b22, O-APA, so revtex4-2's
  // preloaded natbib refuses it too, besides its own deny).
  for (const cls of ['class.sn-jnl', 'class.mdpi']) for (const way of ['bib.bibtex-bst', 'bib.natbib', 'bib.cite-pkg']) assert.ok(at(cls, 'containerBlock/refContainer', way).some((v) => v.includes('\\bibstyle')), `${way} under ${cls}`);
  for (const cls of ['class.aa', 'class.elsarticle', 'class.revtex4-2']) assert.ok(at(cls, 'containerBlock/refContainer', 'bib.apacite').some((v) => v.includes('apacite cannot be loaded with natbib')), cls);
  assert.deepEqual(at('class.article', 'containerBlock/refContainer', 'bib.apacite'), []);
  // elsarticle's natbib takes cite.sty's one-optional \@citex call apart, as acmart's does (AC8; TU5, round 2 of batch 1).
  assert.ok(at('class.elsarticle', 'containerBlock/refContainer', 'bib.cite-pkg').some((v) => v.includes('forbids cite')));
  // aastex701 lacks \if@titlepage and stops at multicol; it and mnras lack \contentsname (CA3, CA4).
  assert.ok(at('class.aastex', 'containerBlock/abstract', 'abs.abstract-pkg').some((v) => v.includes('\\if@titlepage')));
  assert.ok(at('class.aastex', 'paragraph/title', 'front.titling').some((v) => v.includes('\\if@titlepage')));
  assert.ok(at('class.aastex', 'atomicBlock/tableContents', 'toc.etoc').some((v) => v.includes('multicol')));
  for (const cls of ['class.aastex', 'class.mnras']) assert.ok(at(cls, 'atomicBlock/tableContents', 'toc.tocloft').some((v) => v.includes('\\contentsname')), cls);
  // aa's \newtheorem takes two more arguments, mdframed's too (CA7); mdpi's statement counters (CA24).
  assert.ok(at('class.aa', 'containerBlock/mathElement', 'thm.mdframed', [], { rename: 'yes' }).some((v) => v.includes('two more arguments')));
  for (const way of ['thm.amsthm', 'thm.kernel', 'thm.thmtools', 'thm.mdframed']) {
    assert.ok(at('class.mdpi', 'containerBlock/mathElement', way).some((v) => v.includes('\\c@theorem')), way);
    assert.ok(!at('class.mdpi', 'containerBlock/mathElement', way, [], { rename: 'yes' }).some((v) => v.includes('\\c@theorem')), `${way} renamed`);
  }
  // siamart has no \part and no titlepage environment (CA13, CA14).
  assert.ok(at('class.siamart', 'paragraph/heading', 'head.kernel', ['part']).some((v) => v.includes('needs counter:part')));
  assert.deepEqual(at('class.siamart', 'paragraph/heading', 'head.kernel', ['section']), []);
  assert.ok(at('class.siamart', 'paragraph/title', 'front.titlepage-env').some((v) => v.includes('titlepage')));
  // iopjournal typesets \title at once: \maketitle is forbidden (CA12, on LN1's forbids.names), titling's too, which only appends
  // a copy of the title to \thetitle (batch 1 round 2).
  for (const way of ['front.maketitle', 'front.class-native', 'front.titling']) assert.ok(at('class.iopjournal', 'paragraph/title', way).some((v) => v.includes('forbids cmd:\\maketitle')), way);
  // aa's \title never sets \@title, which titling's \maketitle prints (batch 1 round 2).
  assert.ok(at('class.aa', 'paragraph/title', 'front.titling').some((v) => v.includes('No \\title given')));
  assert.deepEqual(at('class.article', 'paragraph/title', 'front.maketitle'), []);
  // siamart's \tableofcontents is empty (CA15, on LN1's forbids.names).
  assert.ok(at('class.siamart', 'atomicBlock/tableContents', 'toc.kernel').some((v) => v.includes('forbids cmd:\\tableofcontents')));
  // elsarticle's 5p sets two columns (CA26).
  const columns = (option: string) => resolve(library, { classId: 'class.elsarticle', classOptions: [option], choices: [{ way: 'cols.paracol', node: 'containerBlock/columns' }] });
  assert.ok(columns('5p').some((v) => v.includes('one column only')));
  assert.ok(!columns('preprint').some((v) => v.includes('one column only')));
  // LIPIcs's checklist forbids wrapfig (CA34).
  assert.ok(at('class.lipics', 'atomicBlock/image', 'fig.wrapfig').some((v) => v.includes('forbids wrapfig')));
  for (const way of ['head.titlesec', 'head.sectsty']) assert.ok(at('class.lipics', 'paragraph/heading', way, ['section']).some((v) => v.includes('class.lipics forbids')), way);
});

test("aastex701 copies revtex4-2's tables and page grid, and loads array itself: it refuses what that code breaks (round 2 of batch 1)", () => {
  // nicematrix stops at any class defining \rvtx@ifformat@geq; its tabularray presets load no nicematrix (JR2-1).
  assert.ok(at('class.aastex', 'table', 'tbl.nicematrix', [], { package: 'nicematrix' }).some((v) => v.includes('forbids nicematrix')));
  assert.ok(!at('class.aastex', 'table', 'tbl.nicematrix').some((v) => v.includes('forbids nicematrix')));
  // A plain tabular's p-columns work under the class's array swap, and since b23 longtable's too (JR2-6): the aastex setting relaxes
  // \@endpbox in the swapped builder, which the class's \LT@array calls as well.
  assert.ok(!at('class.aastex', 'table', 'tbl.tabular').some((v) => v.includes('forbids')));
  assert.deepEqual(at('class.aastex', 'table', 'tbl.longtable'), []);
  // revtex4-2 has the same swap and since b23 no longer refuses tabularx or array: its setting relaxes \@endpbox in the swapped
  // builder, as aastex's does. colortbl stays refused: the copies run none of array's row hooks, which its row colours need.
  for (const way of ['tbl.tabularx', 'tbl.tabular']) assert.ok(!at('class.revtex4-2', 'table', way).some((v) => v.includes('forbids')), way);
  assert.ok(at('class.revtex4-2', 'table', 'tbl.colortbl').length > 0, 'tbl.colortbl stays out of revtex4-2');
  // The swap drops arydshln's \@array; ltxgrid undefines \col@number and \@holdpg (JR2-3, JR2-4), under both classes.
  for (const cls of ['class.aastex', 'class.revtex4-2']) {
    assert.ok(at(cls, 'table', 'tbl.arydshln').some((v) => v.includes('forbids arydshln')), cls);
    assert.ok(at(cls, 'containerBlock/columns', 'cols.paracol').some((v) => v.includes('forbids paracol')), cls);
  }
});

test('the target engine is the only engine: a handler or a class that does not run there goes nowhere', () => {
  assert.ok(at('class.article', 'code/code', 'code.minted').some((v) => v.includes('does not run in the target engine')));
  assert.ok(at('class.article', 'atomicBlock/image', 'fig.svg').some((v) => v.includes('does not run in the target engine')));
  assert.ok(at('class.jlreq', 'paragraph/paragraph', 'para.kernel').some((v) => v.includes('class.jlreq does not run in the target engine')));
  assert.ok(library.keys.every((k) => !('engines' in k)), 'no key names another engine');
});

test('a preset bound to some classes goes only under them and the classes built on them; its other presets go anywhere', () => {
  const small: Library = {
    keys: [
      key('abs.native', 'containerBlock/abstract', {
        params: { form: { type: 'enum', values: ['command', 'environment'], default: 'environment', description: 'the form' } },
        presets: {
          command: { description: 'the stored command', features: [], params: { form: 'command' }, evidence: [] },
          environment: { description: 'the environment', features: [], params: { form: 'environment' }, evidence: [] },
        },
        classes: { deny: [], onlyWhen: [{ when: { form: 'command' }, classes: ['class.sn-jnl'], reason: '\\abstract{} opens the environment in the preamble', evidence: [] }] },
      }),
    ],
    // sn-jnl is built on article, which has no \abstract command.
    classes: [class_('class.article'), class_('class.sn-jnl', { base: 'class.article' }), class_('class.sn-derived', { base: 'class.sn-jnl' })],
    packages: [],
  };
  const bound = (classId: string, form?: string) => resolve(small, { classId, choices: [{ way: 'abs.native', ...(form === undefined ? {} : { params: { form } }) }] });
  assert.deepEqual(bound('class.sn-jnl', 'command'), []);
  assert.deepEqual(bound('class.sn-derived', 'command'), [], 'a class built on sn-jnl takes it too');
  assert.deepEqual(bound('class.article', 'command'), ['abs.native: with {"form":"command"}, only for class.sn-jnl, not class.article: \\abstract{} opens the environment in the preamble']);
  assert.deepEqual(bound('class.article'), [], 'the environment form, its default, goes under article');
  const picked = (classId: string) => pick(small, { node: 'containerBlock/abstract', way: 'abs.native', preset: 'command', classId, kinds: [] });
  assert.deepEqual(picked('class.sn-jnl'), { way: 'abs.native', params: { form: 'command' }, how: 'as-is' });
  assert.deepEqual(picked('class.article'), { way: 'abs.native', params: { form: 'environment' }, how: 'as-is' }, 'the pick falls to the preset that fits');
});

test("arydshln conflicts with General's tables only where the caller says General prints them", () => {
  assert.deepEqual(under('class.article', { way: 'tbl.arydshln' }), [], 'the matrix names no General nodes: its filing keeps them apart');
  const printed = resolve(library, { classId: 'class.article', choices: [{ way: 'tbl.arydshln' }], general: ['table'] });
  assert.equal(printed.length, 1);
  assert.match(printed[0] ?? '', /^tbl\.arydshln: conflicts with General's table, which the document prints: /u);
  assert.deepEqual(resolve(library, { classId: 'class.article', choices: [{ way: 'tbl.arydshln' }], general: ['code/code'] }), []);
});

test('natbib needs thebibliography, and biblatex\'s default heading needs \\section: letter, minimal and scrlttr2 refuse them', () => {
  const bib = 'containerBlock/refContainer';
  for (const c of ['class.letter', 'class.minimal', 'class.scrlttr2']) {
    assert.ok(at(c, bib, 'bib.natbib').some((v) => v.includes('needs env:thebibliography')), c);
    assert.ok(at(c, bib, 'bib.biblatex-bibtex').some((v) => v.includes('defines neither \\chapter nor \\section')), c);
    assert.ok(at(c, bib, 'bib.biblatex-biber').some((v) => v.includes('defines neither \\chapter nor \\section')), c);
  }
  // A class with the environment and \section keeps all three.
  assert.deepEqual(at('class.article', bib, 'bib.natbib'), []);
  assert.deepEqual(at('class.article', bib, 'bib.biblatex-bibtex'), []);
  assert.deepEqual(at('class.article', bib, 'bib.biblatex-biber'), []);
  // tikzposter builds on extarticle (has \section) though its profile lists no counter:section: biblatex is not refused there.
  assert.deepEqual(at('class.tikzposter', bib, 'bib.biblatex-biber'), []);
  assert.deepEqual(at('class.tikzposter', bib, 'bib.biblatex-bibtex'), []);
  // heading sets only title=, so it does not lift the refusal.
  assert.ok(at('class.letter', bib, 'bib.biblatex-bibtex', [], { heading: 'References' }).some((v) => v.includes('defines neither')));
});

test('emulateapj refuses sidenotes (caption/ltcaption against revtex4\'s longtable*) and endnotes (its heading under revtex4\'s uppercasing \\@sect)', () => {
  assert.ok(at('class.emulateapj', 'containerBlock/note', 'note.sidenotes').some((v) => v.includes('forbids sidenotes')));
  assert.ok(at('class.emulateapj', 'footnoteAnchor/footnoteAnchor', 'fn.endnotes').some((v) => v.includes('forbids endnotes')));
  for (const cls of ['class.article', 'class.amsart', 'class.revtex4-2', 'class.aastex']) {
    assert.deepEqual(at(cls, 'containerBlock/note', 'note.sidenotes'), [], cls);
    assert.deepEqual(at(cls, 'footnoteAnchor/footnoteAnchor', 'fn.endnotes'), [], cls);
  }
});

test('tikzposter refuses hyperref\'s colorlinks (color loaded in a group at \\begin{document}), not its boxed or hidden links', () => {
  assert.ok(under('class.tikzposter', { way: 'meta.hyperref', params: { look: 'colored', linkColor: 'blue', citeColor: 'blue', urlColor: 'blue' } }).some((v) => v.includes('Loading a class or package in a group')));
  assert.ok(at('class.tikzposter', 'hyperlink/hyperlink', 'meta.hyperref', [], { look: 'colored' }).some((v) => v.includes('Loading a class or package in a group')));
  assert.deepEqual(at('class.tikzposter', 'hyperlink/hyperlink', 'meta.hyperref'), []);
  assert.deepEqual(at('class.tikzposter', 'hyperlink/hyperlink', 'meta.hyperref', [], { look: 'boxed' }), []);
  assert.deepEqual(at('class.tikzposter', 'hyperlink/hyperlink', 'meta.hyperref', [], { look: 'hidden' }), []);
  for (const cls of ['class.article', 'class.a0poster', 'class.beamer']) assert.deepEqual(at(cls, 'hyperlink/hyperlink', 'meta.hyperref', [], { look: 'colored' }), [], cls);
});

test("hyperref's load-time options clash with a class that loads hyperref itself: the cvpr preset, not the \\hypersetup looks (batch 4 round 1)", () => {
  const cvpr = library.keys.find((k) => k.id === 'meta.hyperref')?.presets['cvpr']?.params as Record<string, string>;
  for (const cls of ['class.aamas', 'class.acmart', 'class.apa7', 'class.iopjournal', 'class.cas-dc', 'class.copernicus']) {
    assert.ok(at(cls, 'hyperlink/hyperlink', 'meta.hyperref', [], cvpr).some((v) => v.includes('Option clash for package hyperref')), cls);
    assert.deepEqual(at(cls, 'hyperlink/hyperlink', 'meta.hyperref', [], { look: 'colored' }).filter((v) => v.includes('Option clash')), [], cls);
  }
  assert.deepEqual(at('class.article', 'hyperlink/hyperlink', 'meta.hyperref', [], cvpr), []);
  assert.ok(at('class.lipics', 'hyperlink/hyperlink', 'meta.hyperref', [], { backref: 'backref' }).some((v) => v.includes('Option clash for package hyperref')));
});

test('enumerate.sty cannot pair with a class-supplied \\endenumerate: ascelike refuses list.enumerate-pkg, keeps enumitem', () => {
  const kinds = ['itemize', 'enumerate', 'description'];
  assert.ok(at('class.ascelike', 'containerBlock/listing', 'list.enumerate-pkg', kinds).some((v) => v.includes('ended by \\end{list}')));
  assert.ok(at('class.ascelike', 'containerBlock/listing', 'list.enumerate-pkg', kinds, { label: '1.' }).some((v) => v.includes('ascelike redefines the enumerate environment')), 'any label template');
  assert.deepEqual(at('class.ascelike', 'containerBlock/listing', 'list.enumitem', kinds), [], 'enumitem replaces both halves');
  assert.deepEqual(at('class.article', 'containerBlock/listing', 'list.enumerate-pkg', kinds), []);
});

test("paralist's description lists need \\descriptionlabel, which beamer lacks: refused under beamer and ctexbeamer whatever the params", () => {
  const kinds = ['itemize', 'enumerate', 'description'];
  for (const classId of ['class.beamer', 'class.ctexbeamer']) {
    for (const form of ['compact', 'inline', 'aspara']) {
      assert.ok(at(classId, 'containerBlock/listing', 'list.paralist', kinds, { form }).some((v) => v.includes('\\descriptionlabel')), `${classId} ${form}`);
    }
  }
  assert.ok(under('class.ctexbeamer', { way: 'list.paralist' }).some((v) => v.includes("paralist's description lists")), 'reached through its base class.beamer');
  assert.deepEqual(at('class.article', 'containerBlock/listing', 'list.paralist', kinds), [], 'article defines \\descriptionlabel');
  assert.deepEqual(at('class.report', 'containerBlock/listing', 'list.paralist', kinds, { form: 'aspara' }), []);
  assert.deepEqual(at('class.ctexbeamer', 'containerBlock/listing', 'list.kernel', kinds), [], 'the kernel lists stay open under ctexbeamer');
});

test("the AMS classes' \\@starttoc and \\@tocwriteb refuse titletoc, etoc and tocloft; the kernel's contents and article/book keep them", () => {
  for (const cls of ['class.amsart', 'class.amsbook', 'class.amsproc']) {
    // titletoc's \titlecontents{section} meets \@tocwriteb's \endgroup at every \section (class.amsart.log, 2026-11-06).
    assert.ok(at(cls, 'atomicBlock/tableContents', 'toc.titletoc').some((v) => v.includes('\\@tocwriteb')), cls);
    // etoc's \tableofcontents fails after \openout of main.toc (amsbook: input stack size exceeded, class.amsbook.log, 2026-11-06).
    assert.ok(at(cls, 'atomicBlock/tableContents', 'toc.etoc').some((v) => v.includes('\\@starttoc')), cls);
    // tocloft: amsart through its profile, amsbook and amsproc through the key (class.amsproc.sample.log, 2026-11-06).
    assert.ok(at(cls, 'atomicBlock/tableContents', 'toc.tocloft').some((v) => v.includes('\\@starttoc')), cls);
    assert.deepEqual(at(cls, 'atomicBlock/tableContents', 'toc.kernel'), [], cls);
  }
  assert.ok(at('class.amsbook', 'atomicBlock/tableContents', 'toc.etoc').some((v) => v.includes('input stack size')));
  // every titletoc preset writes \titlecontents{section}...\contentspage: no params let it through.
  assert.ok(at('class.amsart', 'atomicBlock/tableContents', 'toc.titletoc', [], { leaders: 'false' } as never).length > 0);
  assert.ok(under('class.amsproc', { way: 'toc.titletoc', params: { push: true } }).length > 0);
  for (const cls of ['class.article', 'class.book', 'class.report'])
    for (const way of ['toc.titletoc', 'toc.etoc', 'toc.tocloft']) assert.deepEqual(at(cls, 'atomicBlock/tableContents', way), [], `${cls} ${way}`);
});

test('aastex701 reruns \\maketitle at its first \\section, so a title way that writes \\maketitle is refused there', () => {
  for (const way of ['front.class-native', 'front.maketitle']) {
    assert.ok(at('class.aastex', 'paragraph/title', way).some((v) => v.includes('requires all authors to have an affiliation')), way);
  }
  assert.ok(at('class.aastex', 'paragraph/title', 'front.class-native', [], { authors: 'separate' }).some((v) => v.includes('\\if@firstsection')));
  // revtex4-2, whose \maketitle runs once, still takes the separate form.
  assert.deepEqual(at('class.revtex4-2', 'paragraph/title', 'front.class-native', [], { authors: 'separate' }), []);
  assert.deepEqual(at('class.article', 'paragraph/title', 'front.maketitle'), []);
});

test('front.titlepage-env is refused where the class has no titlepage environment: letter, scrlttr2, moderncv, minimal', () => {
  for (const cls of ['class.letter', 'class.scrlttr2', 'class.moderncv', 'class.minimal']) {
    const v = at(cls, 'paragraph/title', 'front.titlepage-env');
    assert.ok(v.some((s) => s.includes('no titlepage environment')), `${cls}: ${v.join('\n')}`);
  }
  for (const cls of ['class.article', 'class.report', 'class.amsart', 'class.ieeetran', 'class.revtex4-2', 'class.aastex', 'class.mnras', 'class.beamer', 'class.tikzposter']) {
    assert.deepEqual(at(cls, 'paragraph/title', 'front.titlepage-env'), [], cls);
  }
});

test("a class's setup counts for every document: its options and its loads, whatever the template gives", () => {
  // quantumarticle loads hyperref in every document's preamble: a way that needs it is met.
  assert.ok(!resolve(library, { classId: 'class.quantumarticle', choices: [{ way: 'xref.cleveref', node: 'ref/ref' }] }).some((v) => v.includes('needs package hyperref')));
  // tufte-book's nols is given though the template's options lack it; revtex4-2-aip inherits revtex4-2's setup.
  assert.deepEqual(library.classes.find((c) => c.id === 'class.tufte-book')?.setup?.options, ['nols']);
  assert.equal(library.classes.find((c) => c.id === 'class.revtex4-2-aip')?.setup?.after?.length, 1);
});
