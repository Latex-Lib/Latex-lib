/**
 * A filed document's cells (ARCHITECTURE.md section 5): its branches built by
 * the host with the probes recorded (`Host.build`), and under each class
 * setting and each setup that applies to it, the branches that fit there
 * (`Host.fits`) packed in the order filed (`Host.pack`) and emitted
 * (`Host.emit`), each with what the oracle should expect of every branch.
 *
 * A branch the host says cannot be compiled under a class setting or setup (a
 * class's own way under another class, a one-column way in two columns) is
 * left out of that cell, so it gets no verdict there and does not take the
 * others down. Filing need not keep such branches apart: a document is
 * compiled under each class with the branches that fit it. Where none of its
 * branches fits, there is no cell; a document of no branches (the explainer's
 * base trial) still has one. Settings and setups that leave the same branches
 * share one packing.
 *
 * A branch expects the sentinels its host placed. It expects a feature probe
 * when one of its sentinels plays a role in it (`footnote:mark` makes the
 * branch answer the `footnote` probe), so the host declares a feature only by
 * placing for it.
 *
 * A class setting's own files (a class the engine cannot fetch) go with every
 * cell under it, beside the files the host emitted.
 */
import { appliesTo } from './config.ts';
import { cellId } from './ids.ts';
import { FEATURE_PROBES } from './features.ts';
import type { Expected } from './oracle.ts';
import { recordingProbes, SENTINEL_PREAMBLE } from './sentinels.ts';
import type { ClassSetting, Emitted, EngineFile, FiledDocument, Setup } from './model.ts';
import { markedOf } from './plan.ts';
import type { Host } from './ports.ts';
import type { CellJob } from './run.ts';

export type JudgedJob = CellJob & { readonly emitted: Emitted; readonly expected: readonly Expected[] };

export const documentCells = <D, P>(
  host: Host<D, P>,
  document: FiledDocument,
  classSettings: readonly ClassSetting[],
  setups: readonly Setup[],
  classFiles: (setting: ClassSetting) => readonly EngineFile[] = () => [],
): JudgedJob[] => {
  const parts = document.paths.map((branch) => {
    const { probes, placed } = recordingProbes(branch.marked ?? markedOf(branch.id));
    const built = host.build(branch, probes);
    const features = [...new Set(placed.flatMap((s) => (s.role === undefined ? [] : [s.role.split(':')[0] ?? ''])))].filter((f) => f in FEATURE_PROBES);
    return { branch, built, expected: { branch: branch.id, sentinels: placed, features } as Expected };
  });
  // One packing per set of branches that fit: most settings and setups take them all.
  const packed = new Map<string, { readonly doc: D; readonly expected: readonly Expected[] }>();
  const packingOf = (classSetting: ClassSetting, setup: Setup) => {
    const fitting = parts.filter((p) => host.fits?.(p.branch, classSetting, setup) ?? true);
    // A document of no branches (the explainer's base trial: the host's own preamble) still compiles; one whose branches all left does not.
    if (fitting.length === 0 && parts.length > 0) return undefined;
    const key = fitting.map((p) => p.branch.id).join(',');
    let packing = packed.get(key);
    if (packing === undefined) {
      packing = { doc: host.pack(fitting.map((p) => p.built)), expected: fitting.map((p) => p.expected) };
      packed.set(key, packing);
    }
    return packing;
  };
  return classSettings.flatMap((classSetting) =>
    setups
      .filter((setup) => appliesTo(setup, classSetting))
      .flatMap((setup) => {
        const packing = packingOf(classSetting, setup);
        if (packing === undefined) return [];
        const emitted = host.emit(packing.doc, { classSetting, setup, preamble: SENTINEL_PREAMBLE });
        const cell = { id: cellId(document.id, classSetting.id, setup.id), document: document.id, classSetting: classSetting.id, setup: setup.id };
        return [{ cell, job: { id: cell.id, latex: emitted.latex, files: [...classFiles(classSetting), ...emitted.files] }, emitted, expected: packing.expected }];
      }),
  );
};
