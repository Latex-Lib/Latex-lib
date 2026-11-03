# Latex-lib

A library of LaTeX handlers, and the pipeline that tests them.

- **`Latex-Lib/`**: the handlers. Each one is a way of writing a document element in LaTeX (a theorem, a table, a footnote, columns, a bibliography, …). Each comes with a key that says what it achieves, which packages it needs, what it conflicts with and where it can sit. There are also class profiles for the document classes it supports.
- **`testing-pipeline/`**: the compatibility matrix. It compiles every legal nesting of the handlers under each document class, judges the output, and turns failures into rules. `testing-pipeline/BATCHES.md` describes how the library grows batch by batch and which classes come next. `settings/batches.json` lists the batches.
- **`.github/workflows/compat.yml`**: runs the matrix on GitHub Actions. One job per class and setup.

## Running it

Push to `latex-ci` to run the newest batch with status `running`. Push to `latex-ci-keys` to run only the checks and the filing. You can also start a run by hand from the Actions tab, choosing the pairs, the engines per job and the bisect budget.

The engine and the host the pipeline tests against are not part of this repository. Each job checks them out from a private companion repository, using the read-only deploy key in the secret `PRIVATE_DEPLOY_KEY`. The secret `FLOUEST_KEY` decrypts what that repository holds, the store seed and the run's artifacts. Without both secrets, a run stops at its first step.

## Reading a run

The run's page shows:
- a table per class and setup;
- the triage report, which groups failures by their first TeX error with an example log;
- the bisect column, which names the branches that cause failures the judge could not tie to one branch;
- the diff against the previous run;
- the lint report, from static checks on the emitted LaTeX.

The artifacts are sealed. `testing-pipeline/ci/fetch-run.sh <run id> <folder>` brings a run back as a local store; it needs `FLOUEST_KEY`, or a file named by `FLOUEST_KEY_FILE`.
