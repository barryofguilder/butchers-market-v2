import Component from '@glimmer/component';
import { action } from '@ember/object';
import { valueOrDefault } from 'butchers-market/utils/value-or-default';

export interface UiBaseLinkSignature {
  Args: {
    download?: boolean;
    href?: string;
    model?: unknown;
    models?: unknown[];
    query?: Record<string, unknown>;
    route?: string;
  };
}

export default class UiBaseLinkComponent extends Component<UiBaseLinkSignature> {
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

  @action
  registerLinkAttributes(element: HTMLAnchorElement) {
    if (this.args.href === '') {
      element.removeAttribute('href');
    }

    if (this.args.download === true) {
      element.setAttribute('download', '');
    }
  }
}
