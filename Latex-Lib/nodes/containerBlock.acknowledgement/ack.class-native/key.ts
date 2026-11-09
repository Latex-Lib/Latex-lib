import { defineKey } from '../../../schema/key.ts';
import { minimal } from '../../../schema/minimal.ts';
import { PRESETS } from './presets.ts';

export default defineKey(
  minimal({
    id: 'ack.class-native',
    node: 'containerBlock/acknowledgement',
    description:
      "The class's own acknowledgements environment, which prints the class's heading: acmart's and imsart's \\begin{acks} … \\end{acks}, aa's, quantumarticle's, ut-thesis's and spie's \\begin{acknowledgements}, aastex's, revtex's and spie's \\begin{acknowledgments}, achemso's \\begin{acknowledgement}, neurips' and ecai's \\begin{ack}. The node's title is printed only where the class takes one: imsart's \\begin{acks}[title], a renewed \\acknowledgmentsname, or imsart's \\begin{funding} for a funding title.",
    writes: '\\begin{acks|acknowledgements|acknowledgments|acknowledgement|ack}[…] … \\end{…} | \\begin{funding} … \\end{funding}',
    ctan: ['acmart'],
    features: ['class-styled'],
    params: {
      env: {
        type: 'enum',
        values: ['acks', 'acknowledgements', 'acknowledgments', 'acknowledgement', 'ack'],
        default: 'acks',
        description: "the class's acknowledgements environment",
      },
      titleOption: { type: 'boolean', default: false, description: "the node's title as the environment's optional heading, \\begin{acks}[title] (imsart, aastex)" },
      nameCommand: { type: 'string', default: '', description: "the class's heading command renewed to the node's title for this environment (\\acknowledgmentsname); empty keeps the class's word" },
      fundingEnv: { type: 'string', default: '', description: "the class's funding environment, used when the node's title reads as funding (imsart's funding); empty for none" },
    },
    presets: PRESETS,
    // Each name comes out empty with its default and then asks for nothing.
    requires: ['env:{env}', 'env:{fundingEnv}', 'cmd:{nameCommand}'],
    only: [
      'class.acmart',
      'class.aa',
      'class.aastex',
      'class.revtex4-2',
      'class.revtex4-2-aip',
      'class.quantumarticle',
      'class.ut-thesis',
      'class.spie',
      'class.achemso',
      'class.neurips',
      'class.ecai',
      'class.imsart',
    ],
    // neurips' ack is environ's \NewEnviron (neurips_2026.sty l.112), which collects its body as an argument: no verbatim in it.
    // aa's acknowledgements sets \par to \relax (aa.cls l.1351-1372, the nopar environment), so its paragraphs run together.
    givesWhen: [{ when: { env: 'ack' }, gives: { argument: true, verbatim: false } }],
    // Typeset on ZeroTeX-NG (2026-11-07): acks under acmart, acknowledgements under aa, quantumarticle, ut-thesis and spie,
    // acknowledgments under aastex (with and without [title]), revtex4-2 (with a renamed \acknowledgmentsname) and spie,
    // acknowledgement under achemso (renamed \acknowledgementname too), ack under neurips. ecai and imsart are not on the
    // engine's mirror nor in the pipeline's files, so their ack, acks[title] and funding are untested.
    targetEngine: 'yes',
  }),
);
