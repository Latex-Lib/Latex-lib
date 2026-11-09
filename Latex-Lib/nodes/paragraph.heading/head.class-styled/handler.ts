/**
 * head.class-styled: a class's own heading interface in the preamble, one
 * declaration for the level restyled, then the kernel command.
 * - ctex (ctexart, ctexrep, ctexbook): \ctexset{<level>={format=…, name={…,…}, number=…, aftername=…, beforeskip=…, afterskip=…, indent=…}}
 *   (cqjtuthesis.cls l.171-179, buptthesis.cls l.274-298).
 * - jlreq: \ModifyHeading{<level>}{font={…}, indent=…, after_label_space=…, before_space=…, after_space=…} (README-template.tex l.11-12,
 *   jlreq.cls l.3286-3311).
 * - KOMA-Script: \RedeclareSectionCommand[beforeskip=…, afterskip=…, runin=…, font=…, indent=…]{<level>} (scrkernel-sections.dtx l.3085);
 *   an unnumbered part, chapter or section as \addpart, \addchap or \addsec, still in the contents and the running head (l.5697, 6151);
 *   a heading at `minisecLevel` as \minisec{…} (l.6191).
 * Nothing is loaded: each interface is the class's own.
 * CTAN: https://ctan.org/pkg/ctex, https://ctan.org/pkg/jlreq, https://ctan.org/pkg/koma-script
 */
import { withDefaults } from '../../../schema/params.ts';
import type { Realization, Subject } from '../../../schema/realization.ts';
import { dataOf, field, labelLine, param } from '../../protocol.ts';
import { headingCommand, levelOf, type Level } from '../node.ts';
import key from './key.ts';

/** A key's value braced when a comma or an equals sign in it would end the key early. */
const value = (v: string): string => (/[,=]/u.test(v) ? `{${v}}` : v);

/** `key=value` for each value given, in order. */
const keyvals = (pairs: readonly (readonly [string, string])[]): string[] => pairs.filter(([, v]) => v !== '').map(([k, v]) => `${k}=${v}`);

/** KOMA's commands for an unnumbered heading that still enters the contents (scrkernel-sections.dtx l.4522, 5697, 6151). */
const KOMA_UNNUMBERED: { readonly [level: string]: string } = { part: 'addpart', chapter: 'addchap', section: 'addsec' };

export const realize = (given: { readonly [name: string]: unknown } = {}): Realization => {
  const p = withDefaults(key.params, given as never) as { readonly [name: string]: unknown };
  const iface = param(p, 'interface', 'ctex');
  const declaration = (level: Level): string => {
    const [format, before, after, indent] = [param(p, 'format'), param(p, 'beforeSkip'), param(p, 'afterSkip'), param(p, 'indent')];
    if (iface === 'ctex') {
      const keys = keyvals([
        ['format', value(format)],
        ['name', param(p, 'name') === '' ? '' : `{${param(p, 'name')}}`],
        ['number', value(param(p, 'number'))],
        ['aftername', value(param(p, 'afterName'))],
        ['beforeskip', value(before)],
        ['afterskip', value(after)],
        ['indent', value(indent)],
      ]);
      return keys.length === 0 ? '' : `\\ctexset{${level}={${keys.join(',')}}}`;
    }
    if (iface === 'jlreq') {
      // jlreq's README writes font={…} braced; a block heading given before_space or after_space drops its line counts (jlreq.cls l.3292-3301).
      const keys = keyvals([
        ['font', format === '' ? '' : `{${format}}`],
        ['indent', value(indent)],
        ['after_label_space', value(param(p, 'afterLabelSpace'))],
        ['before_space', value(before)],
        ['after_space', value(after)],
      ]);
      return keys.length === 0 ? '' : `\\ModifyHeading{${level}}{${keys.join(',')}}`;
    }
    const runIn = param(p, 'runIn', 'class');
    const keys = keyvals([
      ['beforeskip', value(before)],
      ['afterskip', value(after)],
      ['runin', runIn === 'class' ? '' : runIn],
      ['font', value(format)],
      ['indent', value(indent)],
    ]);
    return keys.length === 0 ? '' : `\\RedeclareSectionCommand[${keys.join(',')}]{${level}}`;
  };
  const restyled = (level: Level): boolean => {
    const wanted = param(p, 'level', 'every');
    // A \minisec head is not the level's command, so the level is not redeclared for it.
    return (wanted === 'every' || wanted === level) && !(iface === 'koma' && param(p, 'minisecLevel', 'none') === level);
  };
  const emitKoma = (node: Subject, content: string): string => {
    const level = levelOf(node);
    if (param(p, 'minisecLevel', 'none') === level) return `\\minisec{${content.trim()}}${labelLine(field(node, 'label'))}\n\n`;
    const command = KOMA_UNNUMBERED[level];
    if (p['unnumberedInContents'] === true && dataOf(node)['numbered'] === false && command !== undefined) {
      // The kernel command as a numbered heading prints it (its short title, its footnote-free moving copy), under KOMA's unnumbered name.
      const asNumbered: Subject = { ...node, attrs: { ...(node.attrs ?? {}), data: { ...dataOf(node), numbered: true } } };
      return headingCommand(asNumbered, content).replace(`\\${level}`, `\\${command}`);
    }
    return headingCommand(node, content);
  };
  return {
    preamble: (_params, _parentType, node) => {
      if (node === undefined) return {};
      const level = levelOf(node);
      const line = restyled(level) ? declaration(level) : '';
      return line === '' ? {} : { declarations: [line] };
    },
    emit: (node, content) => (iface === 'koma' ? emitKoma(node, content) : headingCommand(node, content)),
  };
};

export default realize;
