import Component from '@glimmer/component';
import { service } from '@ember/service';
import type RouterService from '@ember/routing/router-service';
import type DeliItem from '../../../models/deli-item';
import BackLink from '../../../components/admin/back-link';
import DeliItemForm from '../../../components/admin/deli-items/deli-item-form';
import Title from '../../../components/admin/title';

interface Signature {
  Args: {
    model: DeliItem;
  };
}

export default class AdminDeliItemsNewTemplate extends Component<Signature> {
  @service declare router: RouterService;

  returnToIndex = () => {
    this.router.transitionTo('admin.deli-items');
  };

  <template>
    <BackLink @route="admin.deli-items" @text="Deli Items" />

    <Title @title="New Deli Item" />

    <DeliItemForm
      @item={{@model}}
      @saved={{this.returnToIndex}}
      @cancelled={{this.returnToIndex}}
    />
  </template>
}
