/**
 * front.ut-thesis's presets, each from the templates that use it.
 */
import type { Preset } from '../../../schema/params.ts';

/** The class's own example: \title, \author, \degree{Doctor of Philosophy}, \department{Computer Science}, \gradyear{2027}, \maketitle. */
const EXAMPLE = { kind: 'source', file: 'Latex Related Research/Latex-Template-Examples/class.ut-thesis/main.tex', line: '97-102' } as const;
/** \department's optional prefix: "\@protected@testopt \department \\department {Department of}", "[#1]#2->\gdef \@deptpre {#1}\gdef \@deptname {#2}". */
const DEPARTMENT = {
  kind: 'compile',
  reproducer: "\\documentclass{ut-thesis} \\typeout{\\meaning\\department}: '\\@protected@testopt \\department \\\\department {Department of}', and its [#1]#2 form '\\gdef \\@deptpre {#1}\\gdef \\@deptname {#2}' (ut-thesis 2024/07/26 v3.1.8, ZeroTeX-NG, 2026-11-07)",
} as const;

export const PRESETS = {
  sgs: {
    description:
      "The SGS title page as ut-thesis sets it: the title in small capitals, 'by' and the author, 'A thesis submitted in conformity with the requirements for the degree of' the degree, 'Department of' the graduate unit, University of Toronto, and the copyright line, all centred on a page of its own.",
    features: ['title-page', 'centered', 'class-styled'],
    params: {},
    evidence: [EXAMPLE],
  },
  'graduate-department': {
    description: "The SGS title page with the graduate unit after the template's own words instead of the class's 'Department of' (\\department[Graduate Department of]{…}).",
    writes: '\\title{…} \\author{…} \\degree{…} \\department[…]{…} \\gradyear{…} \\copyrighttext{…} \\maketitle',
    features: ['title-page', 'centered', 'class-styled'],
    params: { departmentPrefix: 'Graduate Department of' },
    evidence: [DEPARTMENT],
  },
} as const satisfies { readonly [name: string]: Preset };
