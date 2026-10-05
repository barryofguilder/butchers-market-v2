import Component from '@glimmer/component';
import { service } from '@ember/service';
import type RouterService from '@ember/routing/router-service';
import type Hour from '../../../models/hour';
import BackLink from '../../../components/admin/back-link';
import HoursForm from '../../../components/admin/hours/hours-form';
import Title from '../../../components/admin/title';

interface Signature {
  Args: {
    model: Hour;
  };
}

export default class AdminHoursNewTemplate extends Component<Signature> {
  @service declare router: RouterService;

  returnToIndex = () => {
    this.router.transitionTo('admin.hours');
  };

  <template>
    <BackLink @route="admin.hours" @text="Store Hours" />

    <Title @title="New Hours" />

    <HoursForm @hours={{@model}} @saved={{this.returnToIndex}} @cancelled={{this.returnToIndex}} />
  </template>
}
