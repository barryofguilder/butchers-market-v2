import Component from '@glimmer/component';
import { inject as service } from '@ember/service';

export default class MainNavItems extends Component {
  @service media;

  get isMobile() {
    return !this.media.isLg && !this.media.isXl;
  }
}
