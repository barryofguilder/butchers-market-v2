import Component from '@glimmer/component';
import { service } from '@ember/service';
import type RouterService from '@ember/routing/router-service';
import type Special from '../../../models/special';
import BackLink from '../../../components/admin/back-link';
import SpecialForm from '../../../components/admin/specials/special-form';
import Title from '../../../components/admin/title';

interface Signature {
  Args: {
    model: Special;
  };
}

export default class AdminSpecialsNewTemplate extends Component<Signature> {
  @service declare router: RouterService;

  returnToIndex = () => {
    this.router.transitionTo('admin.specials');
  };

  <template>
    <BackLink @route="admin.specials" @text="Specials" />

    <Title @title="New Special" />

    <SpecialForm
      @special={{@model}}
      @saved={{this.returnToIndex}}
      @cancelled={{this.returnToIndex}}
    />
  </template>
}
