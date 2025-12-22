import Component from '@glimmer/component';
import { LinkTo } from '@ember/routing';
import { modifier } from 'ember-modifier';

export type RouteModel = object | string | number;

export interface UiBaseLinkArgs {
  download?: boolean;
  href?: string;
  model?: RouteModel;
  models?: [RouteModel];
  query?: Record<string, unknown>;
  route?: string;
}

export interface UiBaseLinkSignature {
  Element: HTMLAnchorElement;
  Args: UiBaseLinkArgs;
  Blocks: {
    default: [];
  };
}

export default class UiBaseLink extends Component<UiBaseLinkSignature> {
  get hasRoute() {
    return this.args.route !== undefined;
  }

  get models() {
    if (this.args.model) {
      return [this.args.model];
    } else if (this.args.models) {
      return this.args.models;
    }

    return [];
  }

  get query() {
    return this.args.query ? this.args.query : {};
  }

  initAttributes = modifier((element: Element) => {
    // If you want to have a button trigger the file picker for a file input, it
    // requires you to have an `a` tag with no `href` set.
    if (this.args.href === '') {
      element.removeAttribute('href');
    }
  });

  <template>
    {{#if this.hasRoute}}
      <LinkTo
        data-test-id='link'
        @route={{@route}}
        @models={{this.models}}
        @query={{this.query}}
        ...attributes
      >{{yield}}</LinkTo>
    {{else}}
      <a
        data-test-id='link'
        href={{@href}}
        download={{@download}}
        ...attributes
        {{this.initAttributes}}
      >{{yield}}</a>
    {{/if}}
  </template>
}
