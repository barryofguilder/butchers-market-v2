import Component from '@glimmer/component';
import { service } from '@ember/service';
import type RouterService from '@ember/routing/router-service';
import type MeatBundle from '../../../models/meat-bundle';
import BackLink from '../../../components/admin/back-link';
import MeatBundleForm from '../../../components/admin/meat-bundles/meat-bundle-form';
import Title from '../../../components/admin/title';

interface Signature {
  Args: {
    model: MeatBundle;
  };
}

export default class AdminMeatBundlesEditTemplate extends Component<Signature> {
  @service declare router: RouterService;

  returnToIndex = () => {
    this.router.transitionTo('admin.meat-bundles');
  };

  <template>
    <BackLink @route="admin.meat-bundles" @text="Meat Bundles" />

    <Title @title="Edit Meat Bundle" />

    <MeatBundleForm
      @bundle={{@model}}
      @saved={{this.returnToIndex}}
      @cancelled={{this.returnToIndex}}
    />
  </template>
}
