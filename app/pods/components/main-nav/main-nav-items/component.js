import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import { valueOrDefault } from 'butchers-market/utils/value-or-default';

export default class MainNavItems extends Component {
  @service media;

  get isMobile() {
    return !this.media.isLg && !this.media.isXl;
  }

  get itemClicked() {
    return valueOrDefault(this.args.itemClicked, () => {});
  }
}
