import Component from '@glimmer/component';
import { service } from '@ember/service';
import type RouterService from '@ember/routing/router-service';
import type { PackageBundle } from '../../../schemas/package-bundle';
import BackLink from '../../../components/admin/back-link';
import PackageBundleForm from '../../../components/admin/package-bundles/package-bundle-form';
import Title from '../../../components/admin/title';

interface Signature {
  Args: {
    model: PackageBundle;
  };
}

export default class AdminPackageBundlesEditTemplate extends Component<Signature> {
  @service declare router: RouterService;

  returnToIndex = () => {
    this.router.transitionTo('admin.package-bundles');
  };

  <template>
    <BackLink @route="admin.package-bundles" @text="Package Bundles" />

    <Title @title="Edit Package Bundle" />

    <PackageBundleForm
      @bundle={{@model}}
      @saved={{this.returnToIndex}}
      @cancelled={{this.returnToIndex}}
    />
  </template>
}
