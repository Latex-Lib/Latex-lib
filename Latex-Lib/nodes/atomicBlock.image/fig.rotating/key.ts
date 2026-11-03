import { defineKey } from '../../../schema/key.ts';
import { minimal } from '../../../schema/minimal.ts';
import { PRESETS } from './presets.ts';

export default defineKey(
  minimal({
    id: 'fig.rotating',
    node: 'atomicBlock/image',
    description:
      'rotating: the figure on its side on a page of its own, \\begin{sidewaysfigure} … \\end{sidewaysfigure} (figuresright or figuresleft fix which way), or only the image turned with \\rotatebox{angle}{…} in an ordinary figure. 59 templates.',
    ctan: ['rotating'],
    features: ['rotated', 'floating', 'centered', 'captioned', 'scaled'],
    params: {
      turn: { type: 'enum', values: ['float', 'image'], default: 'float', description: 'the whole float on its side (sidewaysfigure), or only the image (\\rotatebox)' },
      angle: { type: 'number', default: 90, description: 'image: the angle in degrees, counterclockwise' },
      direction: { type: 'enum', values: ['class', 'figuresright', 'figuresleft'], default: 'class', description: 'which way sideways floats turn (the package option); class lets the page side decide' },
    },
    presets: PRESETS,
    loads: [
      { pkg: 'graphicx' },
      { pkg: 'rotating', when: { direction: 'class' } },
      { pkg: 'rotating', options: ['figuresright'], when: { direction: 'figuresright' } },
      { pkg: 'rotating', options: ['figuresleft'], when: { direction: 'figuresleft' } },
    ],
    requires: [
      'env:figure',
    ],
    deny: [
      { class: 'class.beamer', reason: 'a sideways figure needs a float page of its own, which beamer does not make', evidence: [{ kind: 'requirement', file: 'Template/template-requirement/Beamer.md', line: '85' }] },
    ],
    // A float in every preset (figure, or sidewaysfigure), so it needs a place that takes floats: "Not in outer par mode" in a box
    // (2db0ada17e, article.A run: General's tcolorbox statement > fig.rotating@rotated-image, l.224; 230 of 497 directly under that
    // statement, 8 core pairs, the rest mostly images with no file).
    needs: { floats: true },
    zerotex: 'untested',
  }),
);
