import { defineKey } from '../../../schema/key.ts';
import { minimal } from '../../../schema/minimal.ts';
import { PRESETS } from './presets.ts';

export default defineKey(
  minimal({
    id: 'num.appendices-env',
    node: 'containerBlock/appendix',
    description:
      'Appendices in an environment: the appendix package\'s \\begin{appendices} … \\end{appendices} round each appendix (book and report chapters, article sections; sn-jnl, which loads the package itself; oup-authoring-template, which embeds it), the letter carried from one to the next, or opened once with \\appendices and left open (OUP); or imsart\'s \\begin{appendix} … \\end{appendix}. The title defaults to empty where the class prints "Appendix A" itself.',
    writes: '\\begin{appendices} \\section{…} \\label{…} … \\end{appendices}',
    ctan: ['appendix', 'latex-base'],
    features: ['lettered', 'appendix-prefix'],
    params: {
      env: { type: 'enum', values: ['appendices', 'appendix'], default: 'appendices', description: "the appendix package's appendices environment, or the appendix environment (\\appendix as an environment: imsart)" },
      mode: { type: 'enum', values: ['perNode', 'openOnce'], default: 'perNode', description: "an environment round each appendix, or the environment's begin code run once at the first appendix and left open (OUP)" },
      load: { type: 'boolean', default: true, description: 'appendices: load the appendix package (false where the class loads it, sn-jnl, or embeds it, oup-authoring-template)' },
      level: { type: 'enum', values: ['section', 'chapter'], default: 'section', description: 'each appendix a section or a chapter' },
      fallbackTitle: { type: 'string', default: 'Appendix', description: "the title of an appendix that has none: '' where the class prints \"Appendix A\" itself (sn-jnl, imsart)" },
    },
    presets: PRESETS,
    loads: [{ pkg: 'appendix', when: { env: 'appendices', load: true } }],
    requires: ['counter:{level}'],
    // The appendix environment is the class's \appendix run by \begin (imsart.sty l.5371-5406).
    requiresWhen: [{ when: { env: 'appendix' }, requires: ['cmd:\\appendix'] }],
    only: ['class.book', 'class.report', 'class.article', 'class.sn-jnl', 'class.oup-authoring-template', 'class.imsart'],
    onlyWhen: [
      {
        // The package's environment with no package loaded: only where the class supplies it.
        when: { env: 'appendices', load: false },
        classes: ['class.sn-jnl', 'class.oup-authoring-template'],
        reason:
          "without the appendix package the appendices environment exists only where the class gives it: sn-jnl loads appendix[title] itself (its profile's preloads), oup-authoring-template embeds appendix.sty's code (cls l.2719-2960); elsewhere \\begin{appendices} stops at \"Environment appendices undefined\"",
        evidence: [
          { kind: 'requirement', file: 'Template/template-requirement/Springer_Nature_SN_Jnl.md', line: '116' },
          { kind: 'source', file: 'Latex Related Research/Latex-lib-main/Source/0914-oup-authoring-template/oup-authoring-template.cls', line: '2719-2960' },
        ],
      },
    ],
    // Typeset on ZeroTeX-NG (class-examples' typeset-dir, 2026-11-07), two appendices each, lettered A, B: chapters under book,
    // sections under article (perNode, appendix.sty), openOnce under oup-authoring-template (its embedded copy), and the
    // appendix environment with the carried letter under article. Not typeset: sn-jnl and imsart, whose class files are
    // neither on the mirror nor in testing-pipeline/settings/classes/files.
    targetEngine: 'yes',
  }),
);
