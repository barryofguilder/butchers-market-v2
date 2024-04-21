import Component from '@glimmer/component';
import { action } from '@ember/object';
import { valueOrDefault } from '../utils/value-or-default';

export default class UiBaseLink extends Component {
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
  registerLinkAttributes(element) {
    if (this.args.href === '') {
      element.removeAttribute('href');
    }

    if (this.args.download === true) {
      element.setAttribute('download', '');
    }
  }
}
