import Component from '@glimmer/component';
import { service } from '@ember/service';
import type RouterService from '@ember/routing/router-service';
import type Menu from '../../../models/menu';
import BackLink from '../../../components/admin/back-link';
import MenuForm from '../../../components/admin/menu/menu-form';
import Title from '../../../components/admin/title';

interface Signature {
  Args: {
    model: Menu;
  };
}

export default class AdminMenuEditTemplate extends Component<Signature> {
  @service declare router: RouterService;

  returnToIndex = () => {
    this.router.transitionTo('admin.menu');
  };

  <template>
    <BackLink @route="admin.menu" @text="Menu PDF" />

    <Title @title="Edit Menu PDF" />

    <MenuForm @menu={{@model}} @saved={{this.returnToIndex}} @cancelled={{this.returnToIndex}} />
  </template>
}
