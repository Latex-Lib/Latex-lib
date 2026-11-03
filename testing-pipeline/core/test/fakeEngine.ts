/**
 * An engine that reads the fake host's LaTeX the way TeX would complain about
 * it. It tracks the open environments, and fails wherever a fault's inner way
 * is opened anywhere inside its outer way. Its log uses TeX's own shapes
 * (`! …`, `l.<line>`, `Output written on … (n page`), and, when the sentinel
 * preamble is there, the text block and a line for each sentinel, all shipped
 * on page 1 inside the block.
 */
import type { Job, RawResult } from '../src/model.ts';
import type { Engine } from '../src/ports.ts';

/** A way opened anywhere inside another fails at its line; under `class`, only under that class. */
export type FakeFault = { readonly outer: string; readonly inner: string; readonly message: string; readonly class?: string };

/** Ways that fail together anywhere in one document, with an error the log ties to no line (a package clash). */
export type FakeClash = { readonly ways: readonly string[]; readonly message: string };

/** The fake page: a text block from 90pt to 522pt across, 100pt to 700pt up; every sentinel ships at (100pt, 600pt). */
export const FAKE_GEOMETRY_PT = {
  paperWidth: 612,
  paperHeight: 792,
  oddLeft: 90,
  evenLeft: 90,
  textWidth: 432,
  textTop: 700,
  textHeight: 600,
} as const;

/** A boxed theorem in a footnote: the fake twin of a breakable tcolorbox in a confined parent. */
export const DEFAULT_FAULTS: readonly FakeFault[] = [
  { outer: 'fn.kernel', inner: 'thm.boxed', message: 'LaTeX Error: Not in outer par mode.' },
];

export class FakeEngine implements Engine {
  readonly faults: readonly FakeFault[];
  readonly clashes: readonly FakeClash[];
  /** Every job compiled, by id, in order: what a test counts. */
  readonly jobs: string[] = [];

  constructor(faults: readonly FakeFault[] = DEFAULT_FAULTS, clashes: readonly FakeClash[] = []) {
    this.faults = faults;
    this.clashes = clashes;
  }

  get compiles(): number {
    return this.jobs.length;
  }

  fingerprint(): string {
    return 'fake-engine-1';
  }

  async compile(job: Job): Promise<RawResult> {
    this.jobs.push(job.id);
    const open: string[] = [];
    const log = ['This is FakeTeX, Version 0.0.0'];
    if (job.latex.includes('\\protected\\def\\compatSentinel')) {
      for (const [name, pt] of Object.entries(FAKE_GEOMETRY_PT)) log.push(`COMPAT-GEOMETRY{${name}}{${pt}pt}`);
    }
    const documentClass = /\\documentclass(?:\[[^\]]*\])?\{([^}]+)\}/.exec(job.latex)?.[1];
    for (const clash of this.clashes) {
      if (clash.ways.every((way) => job.latex.includes(`\\begin{${way}}`))) log.push(`! ${clash.message}`, '');
    }
    job.latex.split('\n').forEach((line, i) => {
      const sentinel = /^\\compatSentinel\{([^}]+)\}/.exec(line)?.[1];
      if (sentinel !== undefined) log.push(`COMPAT-SENTINEL{${sentinel}}{1}{${100 * 65536}}{${600 * 65536}}`);
      const begin = /^\\begin\{([^}]+)\}/.exec(line)?.[1];
      if (begin !== undefined) {
        for (const fault of this.faults) {
          if (fault.inner === begin && open.includes(fault.outer) && (fault.class === undefined || fault.class === documentClass)) log.push(`! ${fault.message}`, '', `l.${i + 1} ${line}`);
        }
        open.push(begin);
      } else if (/^\\end\{/.test(line)) {
        open.pop();
      }
    });
    log.push('Output written on main.pdf (1 page, 1024 bytes).');
    return { log: `${log.join('\n')}\n`, pages: 1, ms: 1 };
  }

  async close(): Promise<void> {}
}
