import Component from '@glimmer/component';
import type { TOC } from '@ember/component/template-only';
import Container from './container';
import FacebookIcon from './icons/facebook';
import InstagramIcon from './icons/instagram';
import TwitterIcon from './icons/twitter';

const SocialMediaButton: TOC<{
  Element: HTMLAnchorElement;
  Args: {
    href: string;
  };
  Blocks: {
    default: [];
  };
}> = <template>
  <a
    href={{@href}}
    class='inline-block h-8 w-8 text-center text-xl text-gray-900 border border-gray-900 rounded-sm hover:bg-gray-900 hover:text-white'
    ...attributes
  >
    {{yield}}
  </a>
</template>;

export interface MainFooterSignature {
  Element: HTMLElement;
}

export default class MainFooterComponent extends Component<MainFooterSignature> {
  year = new Date().getFullYear();

  <template>
    <footer class='bg-gray-200 py-4' ...attributes>
      <Container>
        <div class='flex flex-col gap-4 sm:gap-2 sm:flex-row sm:justify-between sm:items-center'>
          <div class='text-center sm:text-left'>
            Copyright ©
            {{this.year}}
            <br class='sm:hidden' />
            The Butcher's Market
          </div>
          <div class='flex gap-2 justify-center sm:justify-end'>
            <SocialMediaButton @href='https://www.facebook.com/thebutchersmarket'>
              <FacebookIcon />
              <span class='sr-only'>Facebook</span>
            </SocialMediaButton>
            <SocialMediaButton @href='https://www.instagram.com/thebutchersmarket'>
              <InstagramIcon />
              <span class='sr-only'>Instagram</span>
            </SocialMediaButton>
            <SocialMediaButton @href='https://x.com/thebutchersmkt'>
              <TwitterIcon />
              <span class='sr-only'>Twitter</span>
            </SocialMediaButton>
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
