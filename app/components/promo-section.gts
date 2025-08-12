import Component from '@glimmer/component';
import type { WithBoundArgs } from '@glint/template';
import { hash } from '@ember/helper';
import Subtitle from './promo-section/subtitle';
import Title from './promo-section/title';

interface PromoSectionSignature {
  Element: HTMLElement;
  Args: {
    image: string;
  };
  Blocks: {
    default: [
      {
        title: WithBoundArgs<typeof Title, never>;
        subtitle: WithBoundArgs<typeof Subtitle, never>;
      },
    ];
  };
}

export default class PromoSectionComponent extends Component<PromoSectionSignature> {
  get backgroundImage() {
    const { image } = this.args;
    return `background-image: url('../images/${image}');`;
  }

  <template>
    <section
      style={{this.backgroundImage}}
      class='bg-black parallax-background bg-center bg-cover bg-no-repeat'
      ...attributes
    >
      <div class='py-16 text-white text-shadow'>
        {{yield (hash title=(component Title) subtitle=(component Subtitle))}}
      </div>
    </section>
  </template>
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    PromoSection: typeof PromoSectionComponent;
  }
}
