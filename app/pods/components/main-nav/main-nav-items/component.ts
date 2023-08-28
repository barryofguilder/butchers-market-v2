import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';
import { restartableTask } from 'ember-concurrency';
import { valueOrDefault } from 'butchers-market/utils/value-or-default';
import config from 'butchers-market/config/environment';
import Store from '@ember-data/store';
import MenuModel from 'butchers-market/models/menu';

export interface MainNavItemsSignature {
  Args: {
    itemClicked?: () => void;
  };
}

export default class MainNavItemsComponent extends Component<MainNavItemsSignature> {
  // TODO: Create types for `ember-responsive`
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  @service declare media: any;
  @service declare store: Store;

  @tracked menus: MenuModel[] = [];

  get isMobile() {
    return !this.media.isLg && !this.media.isXl;
  }

  get showOrderOnline() {
    return config.showOrderOnline === true;
  }

  get itemClicked() {
    return valueOrDefault(this.args.itemClicked, () => {});
  }

  get menuUrl() {
    if (this.menus.length > 0 && this.menus[0]) {
      return this.menus[0].fileUrlPath;
    }

    return null;
  }

  loadMenu = restartableTask(async () => {
    const menus = await this.store.findAll('menu');
    this.menus = menus.slice();
  });
}
