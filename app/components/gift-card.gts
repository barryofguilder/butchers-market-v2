import type { TOC } from '@ember/component/template-only';
import type { EmptyObject } from '@ember/component/helper';
import { concat } from '@ember/helper';
import { htmlSafe } from '@ember/template';
import Container from './container';
import UiButton from './ui-button';

const GiftCard: TOC<{
  Element: HTMLElement;
  Args: {
    image?: string;
  };
  Blocks: EmptyObject;
}> = <template>
  <section
    style={{htmlSafe (concat "background-image: url('../images/" @image "');")}}
    class='bg-black parallax-background bg-center bg-cover bg-no-repeat'
    ...attributes
  >
    <Container>
      <div class='my-auto py-12 flex justify-center'>
        <div class='text-center sm:text-left sm:flex sm:items-center'>
          <h3 class='text-xl uppercase tracking-wide font-black text-white sm:text-3xl'>
            Gifts for anyone
          </h3>

          <UiButton
            class='mt-6 sm:mt-0 sm:ml-10'
            @variant='primary'
            @href='https://squareup.com/gift/20D3X4DRPNGY3/order'
          >
            Send E-Gift Card
          </UiButton>
        </div>
      </div>
    </Container>
  </section>
</template>;

export default GiftCard;

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    GiftCard: typeof GiftCard;
  }
}
