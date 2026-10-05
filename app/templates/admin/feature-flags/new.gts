import Component from '@glimmer/component';
import { service } from '@ember/service';
import type RouterService from '@ember/routing/router-service';
import type FeatureFlag from '../../../models/feature-flag';
import BackLink from '../../../components/admin/back-link';
import FeatureFlagForm from '../../../components/admin/feature-flags/feature-flag-form';
import Title from '../../../components/admin/title';

interface Signature {
  Args: {
    model: FeatureFlag;
  };
}

export default class AdminFeatureFlagsNewTemplate extends Component<Signature> {
  @service declare router: RouterService;

  returnToIndex = () => {
    this.router.transitionTo('admin.feature-flags');
  };

  <template>
    <BackLink @route="admin.feature-flags" @text="Feature Flags" />

    <Title @title="New Feature Flag" />

    <FeatureFlagForm
      @flag={{@model}}
      @saved={{this.returnToIndex}}
      @cancelled={{this.returnToIndex}}
    />
  </template>
}
