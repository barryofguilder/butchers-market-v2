import Component from '@glimmer/component';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { valueOrDefault } from 'butchers-market/utils/value-or-default';
import config from 'butchers-market/config/environment';

export default class MainNavItems extends Component {
  @service media;

  get isMobile() {
    return !this.media.isLg && !this.media.isXl;
  }

  get showOrderOnline() {
    return config.showOrderOnline === true;
  }

  get itemClicked() {
    return valueOrDefault(this.args.itemClicked, () => {});
  }

  @action
  setDropdown(dropdown) {
    this.dropdown = dropdown;
  }

  @action
  dropdowmMenuClicked() {
    this.dropdown.actions.close();

    this.itemClicked();
  }
}
