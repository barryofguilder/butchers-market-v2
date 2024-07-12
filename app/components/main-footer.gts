import Component from '@glimmer/component';
import type { TOC } from '@ember/component/template-only';
import type { EmptyObject } from '@ember/component/helper';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import FaIcon from '@fortawesome/ember-fontawesome/components/fa-icon';
import Container from './container';

const SocialMediaButton: TOC<{
  Element: HTMLAnchorElement;
  Args: {
    href: string;
    icon: string;
  };
  Blocks: EmptyObject;
}> = <template>
  <a
    href={{@href}}
    class='inline-block h-8 w-8 text-center text-xl text-gray-900 border border-gray-900 rounded hover:bg-gray-900 hover:text-white'
    ...attributes
  >
    <FaIcon @icon={{@icon}} @prefix='fab' />
  </a>
</template>;

export interface MainFooterSignature {
  Element: HTMLElement;
  Args: EmptyObject;
  Blocks: EmptyObject;
}

export default class MainFooterComponent extends Component<MainFooterSignature> {
  year = new Date().getFullYear();

  <template>
    <footer class='bg-gray-200 mt-24 py-4'>
      <Container>
        <div class='sm:flex sm:flex-row sm:justify-between sm:items-center'>
          <div class='text-center sm:text-left'>
            Copyright ©
            {{this.year}}
            <br class='sm:hidden' />
            The Butcher's Market
          </div>
          <div class='mt-4 text-center sm:mt-0 sm:text-left'>
            <SocialMediaButton
              @href='https://www.facebook.com/thebutchersmarket'
              @icon='facebook-f'
            />
            <SocialMediaButton
              @href='https://www.instagram.com/thebutchersmarket'
              @icon='instagram'
              class='ml-2'
            />
            <SocialMediaButton
              @href='https://twitter.com/thebutchersmkt'
              @icon='twitter'
              class='ml-2'
            />
          </div>
        </div>
      </Container>
    </footer>
  </template>
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    MainFooter: typeof MainFooterComponent;
  }
}
