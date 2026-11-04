# Batches: how the library grows and is tested

The library grows in batches. A batch is a set of class settings, the setups
they run under, and the handlers in the library when it starts. Each batch is
compiled on GitHub Actions (`.github/workflows/compat.yml`, README step 5a),
fixed in one round, closed, and followed by the next. This page is the cycle;
`settings/batches.json` is the list.

## What a batch holds

`settings/batches.json` lists every batch:

```json
{ "batches": [
  { "id": 1, "status": "running", "classes": ["article", "amsart"], "added": { "classes": [], "handlers": [] }, "why": "…" }
] }
```

- **id** counts up. **status** is `planned`, `running` or `closed`. The workflow
  runs every `running` batch unless told otherwise (`batch:current`): a new batch, and an
  earlier one kept `running` beside it while it is still being checked.
- **classes** are class-setting ids (`settings/classes/<id>.json`). Each runs
  under every setup that applies to it (`settings/setups.json`: A, the class's
  defaults; B, two columns for a one-column class).
- **added** names what this batch brought in: new class settings, profiles,
  package facts and handlers. Earlier batches' classes stay in the store; a
  batch lists the classes it compiles.
- **why** says why these classes, with their CTAN pages.

Which repository compiles a class is not the batch's business: `settings/runners.json`
gives each class to one runner repository for good (README step 5a), so a batch
runs in both at once and its two runs join into one store.

A run compiles every handler under every class of the batch. A handler added in
batch 3 is also compiled under batch 1's classes when batch 1 is run again;
that costs only the documents its branches are in.

## The cycle

1. **Choose the classes** (see "Which classes" below). For each new class:
   - a class setting in `settings/classes/` (README step 4a), with its files and
     their SHA-256 if the engine cannot fetch them;
   - a class profile in `../Latex-Lib/classes/`, read from the class's
     documentation and its source on CTAN, then measured by `compat probe`
     (which runs in the plan job's place for a new class: push it with the
     batch and read `out/profiles/` from the run).
2. **Write or extend handlers carefully** (see "Writing a handler" below) before
   anything compiles. A run should confirm handlers, not find their mistakes.
3. **Checks that compile nothing**, locally: in `Latex-Lib`, `npm test`,
   `npm run check`, `npm run verify`; in `testing-pipeline`, `npm test`,
   `npm run check`, `npm run compat -- run --library --plan-only`.
4. **Set the batch to `running`** in `settings/batches.json` and push to
   `latex-ci`. The plan job checks again, runs the oracle, files once, lints
   the emitted LaTeX, and compiles every handler alone under `article` with A
   (the smoke test, which stops the run if the engine or its setup is broken).
   Then one job per class and setup compiles and splits its documents that
   failed with an untied error down to the branches causing them, and the
   summary job sums them up on the run's page. The store lives in the Actions
   cache, so only documents whose LaTeX changed compile.
5. **Read the run's page first.** The triage report (artifact `triage`) groups
   every failing cell by its first TeX error, biggest group first, with the
   pairs it reaches and an example log. The bisect column names the branches
   that cause the untied failures. The diff (artifact `diff`) says what changed
   since the previous run: fixes, and any regression a fix caused elsewhere.
   The lint report shows emission mistakes found without compiling. Then bring
   the run back for the details: `bash ci/fetch-run.sh <run id> <folder>`.
6. **Triage and fix everything a run shows before the next run.** The goal is
   that the batch's branches work; the cost is test rounds, so keep them few.
   Never push one fix per run. README step 6 says where each kind of finding
   goes (a key's class rule, a parent rule, a class profile, a handler defect,
   a defect in the emitted preamble or the host). Group failures by their first
   TeX error, find each cause from the stored logs, fix every confirmed cause,
   look for the same mistake in the other handlers, run the checks again, then
   push once.
7. **Run again** (push). Repeat 5 to 7 until the batch's branches work, or what
   still fails is understood: a rule the keys state, or a defect recorded as
   open with its evidence. A batch usually takes a few rounds, not one.
8. **Close the batch**: `compat explain` and `compat review` over the store
   (README steps 6 and 7) turn the remaining failures into rules; `npm run
   generate`, verify, test; set the batch `closed`; update ARCHITECTURE.md's
   status and M1/M3 "Where it stands". Then plan the next batch.

## Writing a handler

Most failures in the runs so far were not exotic: escaping, arguments that
cannot take a paragraph, packages loaded twice with different options, and
names a class does not define. A handler is written so these cannot happen:

- **Escape every string from the document**: titles, captions, short titles,
  authors, dates, labels' text, cells. Use the library's `escapeText`
  (`nodes/protocol.ts`), never the raw value. Text that goes into a PDF string
  (bookmarks, `\texorpdfstring`) gets the PDF form.
- **No paragraph where an argument cannot take one.** A cell that spans
  columns, a section title, a `\caption`, a `\footnote` in a table, a box's
  title: end paragraphs with `\endgraf` or use a `\parbox`/`minipage`, never a
  blank line or `\par` inside a non-`\long` argument (`nodes/table/node.ts`
  `noPar`).
- **Fragile commands in moving arguments** (section titles, captions, anything
  that goes to the table of contents or a running head) get `\protect`, and
  anything upper-cased by a class (running heads, some headings) keeps colour
  names and commands out of `\MakeUppercase`.
- **Every package the output needs is in the key**, with its options, and its
  facts in `packages/` list its exclusive options and the packages it refuses.
  Never `\usepackage` the same package twice with different options in one
  handler; options that are document-wide (`fleqn`, a chapter style) are a
  preset's, and the facts say they are exclusive.
- **Names a class may lack** (`\chapter`, `\abstract`, `\keywords`, theorem
  environments, `\proof`, counters such as `chapter`) are either guarded
  (`\ifdefined`, `\@ifundefined`, `\providecommand`) or declared on the key
  (`classes.only`, `classes.deny`, a fit rule), so the handler is never
  compiled where it cannot work.
- **Names a class already defines** are never redefined with `\newcommand` or
  `\newtheorem`: check the class profile's `defines`, and use the class's own
  form (`*.class-native` ways) where it has one.
- **Groups and environments balance** in every branch of the handler,
  including the marked runs and empty children.
- **Floats** never go inside boxes, minipages or other floats; a figure in a
  box becomes a non-floating `\captionof`.
- **Tables**: `\multicolumn` only where the table package allows it (not in
  `tabbing`); every row has as many cells as the column spec; `\\` never ends
  a paragraph.
- **XeTeX**: fonts through `fontspec` only when the key says so; no
  pdfLaTeX-only packages (`inputenc` options, `pdftex` driver options).

## Which classes

A batch adds the classes people actually write in, highest use first:

1. **Journals**: the classes the largest publishers ship for their journals
   (Elsevier, Springer Nature, IEEE, ACM, APS/AIP, IOP, ACS, RSC, MDPI, AMS,
   SIAM, the astronomy journals).
2. **Conferences**: the classes of the biggest conference series (ACM, IEEE,
   Springer LNCS, LIPIcs, EasyChair). Venues that use `article` with a style
   file (NeurIPS, ICML, ICLR, CVPR, ACL, AAAI) are setups on `article`, not
   classes.
3. **Homework, reports and theses**: the standard and KOMA classes, `memoir`,
   `exam`, `apa7`, the `ext*` sizes, `beamer`, and the Chinese and Japanese
   classes students use.

Each class cites its CTAN page (`https://ctan.org/pkg/<name>`) or its
publisher's author page, and says whether it runs under XeTeX. A class that
needs pdfLaTeX or LuaLaTeX only waits. Classes nobody writes papers in
(`minimal`, `ltxdoc`, `proc`, …) are not batch material.

## The batches

| Batch | Status | Classes | Added |
|---|---|---|---|
| 1 | running | 30 of the first 48 settings: article, report, book, beamer, amsart; revtex4-2 (APS), IEEEtran (journal, conference), aastex, elsarticle (preprint, 5p), cas-sc, cas-dc, acmart (sigconf, manuscript), aa, mnras, llncs, lipics, iopjournal, sn-jnl, siamart, mdpi; scrartcl, scrreprt, scrbook, memoir, exam, extarticle; tufte-handout | the first 46 class profiles and every handler of M1/M3 |
| 2 | running | revtex4-2 (AIP), acmart (acmsmall), IEEEtran (compsoc); achemso, spie, oup-authoring-template, emulateapj, apa7, jacow, elegantpaper, ut-thesis; jmlr (PMLR), quantumarticle, asmejour, asmeconf, ascelike; conference styles on article: NeurIPS, ICML, ICLR, ACL, CVPR, ECCV (on llncs), AAAI, IJCAI, USENIX, ICASSP, AISTATS, COLM, TMLR | 13 classes from CTAN, 13 conference styles (their files private: settings/classes/files/private.txt) and 3 more settings of batch 1 classes, each under setup A only (their real use is one layout); settings drafted from each class's documentation and source and checked against the source |

Left out of batch 1, as rarely used or out of scope (their settings stay, in no
batch): minimal, ltxdoc, proc; letter, scrlttr2, moderncv; a0poster,
tikzposter; extbook, extreport, amsbook, amsproc, tufte-book, ctexbeamer,
ctexrep (a sibling covers each); easychair (not on CTAN, licence unstated).
Set aside for now as little used outside China (owner, 2026-11-03): ctexart,
ctexbook (batch 1) and thuthesis (batch 2); their settings stay, in no batch.
`settings/batches.json` says why for each batch, with the evidence: the ar5iv
class tally of arXiv sources, publishers' volumes and Overleaf's templates.
