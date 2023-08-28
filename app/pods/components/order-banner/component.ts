import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import config from 'butchers-market/config/environment';

export default class OrderBannerComponent extends Component {
  // TODO: Create types for `ember-responsive`
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  @service declare media: any;

  get isMobile() {
    return !this.media.isLg && !this.media.isXl;
  }

  get showOrderOnline() {
    return config.showOrderOnline === true;
  }
}
