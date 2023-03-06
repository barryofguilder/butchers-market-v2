import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import { lastValue, restartableTask } from 'ember-concurrency';
import { valueOrDefault } from 'butchers-market/utils/value-or-default';
import config from 'butchers-market/config/environment';

export default class MainNavItemsComponent extends Component {
  @service media;
  @service store;

  get isMobile() {
    return !this.media.isLg && !this.media.isXl;
  }

  get showOrderOnline() {
    return config.showOrderOnline === true;
  }

  get itemClicked() {
    return valueOrDefault(this.args.itemClicked, () => {});
  }

  @lastValue('loadMenu')
  menus;

  get menuUrl() {
    if (this.menus?.length > 0) {
      return this.menus[0].fileUrlPath;
    }

    return null;
  }

  loadMenu = restartableTask(async () => {
    return await this.store.findAll('menu');
  });
}
