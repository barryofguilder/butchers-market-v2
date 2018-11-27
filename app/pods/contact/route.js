import Route from '@ember/routing/route';
import ResetScrollMixin from 'butchers-market/mixins/reset-scroll-mixin';

export default Route.extend(ResetScrollMixin, {
  queryParams: {
    events: {
      refreshModel: true
    }
  },
});
