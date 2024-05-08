import Component from '@glimmer/component';
import { eq, or } from 'ember-truth-helpers';
import { LinkTo } from '@ember/routing';
import { modifier } from 'ember-modifier';
import { valueOrDefault } from '../utils/value-or-default';

export interface UiBaseLinkSignature {
  Element: HTMLAnchorElement;
  Args: {
    download?: boolean;
    href?: string;
    model?: string;
    models?: string[];
    query?: Record<string, unknown>;
    route?: string;
  };
  Blocks: {
    default: [];
  };
}

export default class UiBaseLink extends Component<UiBaseLinkSignature> {
  get download() {
    return valueOrDefault(this.args.download, false);
  }

  get href() {
    return valueOrDefault(this.args.href, null);
  }

  get route() {
    return valueOrDefault(this.args.route, null);
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
    return valueOrDefault(this.args.query, {});
  }

  registerLinkAttributes = modifier((element: HTMLAnchorElement) => {
    if (this.args.href === '') {
      element.removeAttribute('href');
    }

    if (this.args.download === true) {
      element.setAttribute('download', '');
    }
  });

  <template>
    {{#if (or @href (eq @href ''))}}
      <a href={{@href}} ...attributes {{this.registerLinkAttributes}}>{{yield}}</a>
    {{else}}
      <LinkTo
        @route={{@route}}
        @models={{this.models}}
        @query={{this.query}}
        ...attributes
      >{{yield}}</LinkTo>
    {{/if}}
  </template>
}
