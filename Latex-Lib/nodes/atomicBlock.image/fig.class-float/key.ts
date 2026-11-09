import { defineKey } from '../../../schema/key.ts';
import { minimal } from '../../../schema/minimal.ts';
import { PRESETS } from './presets.ts';

const SRC = 'Latex Related Research/Latex-lib-main/Source';

export default defineKey(
  minimal({
    id: 'fig.class-float',
    node: 'atomicBlock/image',
    description:
      "The image in a float form the class itself gives: achemso's (and mdpi's) own float kinds \\begin{scheme|chart|graph} … \\end{…}; A&A's \\sidecaption in a figure*, the caption beside the image; jmlr's \\floatconts{label}{\\caption{…}}{\\includegraphics…}; apa7's caption above with \\fitfigure{file}; IEEE Access's \\Figure[t!](skips)[width=…]{file}{caption}; REVTeX's and AASTeX's landscape \\begin{turnpage}\\begin{figure} … ; MDPI's wide figure in \\begin{adjustwidth}{-\\extralength}{0cm}.",
    writes: '\\begin{scheme} \\centering \\includegraphics[width=…]{…} \\caption{…} \\label{…} \\end{scheme}',
    ctan: ['graphics'],
    features: ['floating', 'centered', 'captioned', 'scaled', 'class-styled', 'side-caption', 'rotated', 'full-width', 'here'],
    params: {
      form: {
        type: 'enum',
        values: ['kind', 'sidecaption', 'floatconts', 'fitfigure', 'access-figure', 'turnpage', 'adjustwidth'],
        default: 'kind',
        description: "the class's form: its own float kind (achemso, mdpi), \\sidecaption (aa), \\floatconts (jmlr), \\fitfigure (apa7), \\Figure (ieeeaccess), turnpage (revtex4-2, aastex) or a wide adjustwidth figure (mdpi)",
      },
      floatKind: { type: 'enum', values: ['scheme', 'chart', 'graph'], default: 'scheme', description: "kind: the class's float environment, which names and numbers the caption (Scheme 1, Chart 1, Graph 1)" },
      placement: { type: 'string', default: '', description: "the float's placement letters; '' leaves the form's own (the class's for a kind, aa and turnpage, htbp for floatconts, t! for \\Figure, H for the wide mdpi figure); a node marked fixed uses h! (H for the wide mdpi figure)" },
      unit: { type: 'enum', values: ['linewidth', 'textwidth', 'columnwidth'], default: 'linewidth', description: "the length the node's width fraction is of (not used by \\fitfigure, which fits the image itself)" },
      center: { type: 'boolean', default: true, description: 'the image centred (\\centering); the classes centre their floats anyway, and the side caption sets image and caption on one line' },
      span: { type: 'boolean', default: false, description: 'figure* across both columns, for the forms written in a figure (sidecaption, floatconts, fitfigure, turnpage)' },
    },
    presets: PRESETS,
    loads: [
      { pkg: 'graphicx' },
    ],
    // What each form prints into, all the class's own: a float kind, a command, an environment (adjustwidth is changepage's, which
    // mdpi loads itself, l.64, with its \extralength, l.1579).
    requiresWhen: [
      { when: { form: 'kind' }, requires: ['env:{floatKind}'] },
      { when: { form: 'sidecaption' }, requires: ['cmd:\\sidecaption', 'env:figure'] },
      { when: { form: 'floatconts' }, requires: ['cmd:\\floatconts', 'env:figure'] },
      { when: { form: 'fitfigure' }, requires: ['cmd:\\fitfigure', 'env:figure'] },
      { when: { form: 'access-figure' }, requires: ['cmd:\\Figure', 'env:figure'] },
      { when: { form: 'turnpage' }, requires: ['env:turnpage', 'env:figure'] },
      { when: { form: 'adjustwidth' }, requires: ['env:adjustwidth', 'length:\\extralength', 'env:figure'] },
    ],
    only: ['class.achemso', 'class.aa', 'class.jmlr-pmlr', 'class.apa7', 'class.ieeeaccess', 'class.revtex4-2', 'class.revtex4-2-aip', 'class.aastex', 'class.mdpi'],
    onlyWhen: [
      {
        when: { form: 'kind' },
        classes: ['class.achemso', 'class.mdpi'],
        reason: 'scheme, chart and graph are float environments only achemso (\\newfloat) and mdpi (\\DeclareFloatingEnvironment) declare; elsewhere "Environment scheme undefined"',
        evidence: [
          { kind: 'source', file: `${SRC}/0528-achemso/achemso.dtx`, line: '1833-1838' },
          { kind: 'source', file: 'testing-pipeline/settings/classes/files/Definitions/mdpi.cls', line: '1665-1667' },
        ],
      },
      {
        when: { form: 'sidecaption' },
        classes: ['class.aa'],
        reason: "\\sidecaption is aa's (\\def\\sidecaption#1\\caption); elsewhere it is undefined, or sidenotes' \\sidecaption with another argument form",
        evidence: [{ kind: 'source', file: 'testing-pipeline/settings/classes/files/aa.cls', line: '1656-1705' }],
      },
      {
        when: { form: 'floatconts' },
        classes: ['class.jmlr-pmlr'],
        reason: "\\floatconts is jmlr's (jmlrutils, loaded by the class); elsewhere it is undefined",
        evidence: [{ kind: 'source', file: `${SRC}/0662-jmlr/jmlr.dtx`, line: '2022-2035' }],
      },
      {
        when: { form: 'fitfigure' },
        classes: ['class.apa7'],
        reason: "\\fitfigure is apa7's; elsewhere it is undefined",
        evidence: [{ kind: 'compile', reproducer: '\\documentclass[man,natbib,floatsintext,nofontenc]{apa7} \\typeout{\\meaning\\fitfigure}: \\@protected@testopt \\fitfigure \\\\fitfigure {0.5} (apa7 v2.16, ZeroTeX-NG, 2026-11-07)' }],
      },
      {
        when: { form: 'access-figure' },
        classes: ['class.ieeeaccess'],
        reason: "\\Figure[#1](#2)[#3]{#4}{#5} is ieeeaccess.cls's own (with its figkeys); IEEEtran has none",
        evidence: [{ kind: 'source', file: 'Template/templates/ieee-access/files/ieeeaccess.cls', line: '416-458' }],
      },
      {
        when: { form: 'turnpage' },
        classes: ['class.revtex4-2', 'class.revtex4-2-aip', 'class.aastex'],
        reason: "turnpage is revtex4-2's ltxgrid environment, which aastex701 copies; elsewhere it is undefined (rotating's sidewaysfigure is fig.rotating)",
        evidence: [
          { kind: 'source', file: `${SRC}/0908-aip-conference-proceedings/tex/latex/revtex/revtex4-2.cls`, line: '4210-4216' },
          { kind: 'source', file: 'testing-pipeline/settings/classes/files/aastex701.cls', line: '3876' },
        ],
      },
      {
        when: { form: 'adjustwidth' },
        classes: ['class.mdpi'],
        reason: "\\extralength is mdpi's left column (marginparwidth + marginparsep); elsewhere it is undefined and no column waits to the left",
        evidence: [{ kind: 'source', file: 'testing-pipeline/settings/classes/files/Definitions/mdpi.cls', line: '1579-1580' }],
      },
    ],
    // A float in every form (\Figure opens a figure), so it needs a place that takes floats, as fig.graphicx's float does.
    needs: { floats: true },
    targetEngine: 'yes',
  }),
);
