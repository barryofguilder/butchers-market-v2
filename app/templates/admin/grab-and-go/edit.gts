import Component from '@glimmer/component';
import { service } from '@ember/service';
import type RouterService from '@ember/routing/router-service';
import type { GrabAndGo } from '../../../schemas/grab-and-go';
import BackLink from '../../../components/admin/back-link';
import ItemForm from '../../../components/admin/grab-and-go/item-form';
import Title from '../../../components/admin/title';

interface Signature {
  Args: {
    model: GrabAndGo;
  };
}

export default class AdminGrabAndGoEditTemplate extends Component<Signature> {
  @service declare router: RouterService;

  returnToIndex = () => {
    this.router.transitionTo('admin.grab-and-go');
  };

  <template>
    <BackLink @route="admin.grab-and-go" @text="Grab and Go" />

    <Title @title="Edit Grab and Go" />

    <ItemForm @item={{@model}} @saved={{this.returnToIndex}} @cancelled={{this.returnToIndex}} />
  </template>
}
