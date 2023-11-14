import { Plugin } from 'prosemirror-state';
import { Marktion } from './marktion';

export type Intergarte = {
  plugin?: Plugin[];
};

export type ExtensionFactory = (ctx: IntergarteSystem) => Intergarte;

class IntergarteSystem {
  public intergrates: Intergarte[] = [];

  constructor(public editor: Marktion) {}

  use(factory: ExtensionFactory) {
    const intergrate = factory(this);
    this.intergrates.push(intergrate);
  }

  getDOMIntergrate() {
    const el = document.createElement('div');

    this.editor.rootEl?.append(el);

    return el;
  }
}
