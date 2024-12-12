import Component from '@glimmer/component';
import { service } from '@ember/service';
import config from 'butchers-market/config/environment';

export default class OrderBannerComponent extends Component {
  @service media;

  get isMobile() {
    return !this.media.isLg && !this.media.isXl;
  }

  get showOrderOnline() {
    return config.showOrderOnline === true;
  }
}
