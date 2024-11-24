import Component from '@glimmer/component';
import BackLink from './back-link';

export interface RequestError {
  status: string;
}

export interface PageErrorSignature {
  Element: HTMLButtonElement | HTMLAnchorElement;
  Args: {
    backText: string;
    errors?: RequestError[];
    name: string;
    route: string;
  };
  Blocks: {
    default: [];
  };
}

export default class PageErrorComponent extends Component<PageErrorSignature> {
  get is404() {
    if (this.args.errors?.[0]) {
      return this.args.errors[0].status === '404';
    }
    return false;
  }

  <template>
    <section class='py-16'>
      {{#if this.is404}}
        <h1 class='mt-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-5xl'>
          {{@name}}
          not found
        </h1>
        <p class='mt-4 sm:mt-6 text-base leading-7 text-gray-600'>
          Sorry, we couldn't find the
          {{@name}}
          you're looking for.
        </p>
        <div class='mt-10'>
          <BackLink @route={{@route}}>
            {{@backText}}
          </BackLink>
        </div>
      {{else}}
        <h1 class='mt-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-5xl'>
          Oops! An error occurred
        </h1>
        <p class='mt-4 sm:mt-6 text-base leading-7 text-gray-600'>
          There was an error, but it's not your fault. Please try again later.
        </p>
        <div class='mt-10'>
          <BackLink @route={{@route}}>
            {{@backText}}
          </BackLink>
        </div>
      {{/if}}
    </section>
  </template>
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'Admin::PageError': typeof PageErrorComponent;
  }
}
