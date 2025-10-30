import type { TOC } from '@ember/component/template-only';
import UiButton from './ui-button';

const FacebookButton: TOC<{
  Element: HTMLButtonElement | HTMLAnchorElement;
}> = <template>
  <UiButton
    @href='https://www.facebook.com/thebutchersmarket'
    @variant='primary'
    class='mt-8'
    ...attributes
  >
    Like us on Facebook
  </UiButton>
</template>;

export default FacebookButton;

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    FacebookButton: typeof FacebookButton;
  }
}
