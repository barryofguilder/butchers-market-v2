import Route from '@ember/routing/route';
import RSVP from 'rsvp';
import ResetScrollMixin from 'butchers-market/mixins/reset-scroll-mixin';
import MobileAppMixin from 'butchers-market/mixins/mobile-app-mixin';

export default Route.extend(ResetScrollMixin, MobileAppMixin, {
  queryParams: {
    events: {
      refreshModel: true
    }
  },

  model() {
    return RSVP.hash({
      hours: this.store.findAll('hour'),
      events: this.store.findAll('event'),
      performances: this.store.findAll('performance'),
      reviews: this.store.findAll('review')
    });
  },

  resetController: function(controller, isExiting/*, transition*/) {
    if (isExiting) {
      controller.set('events', false);
    }
  }
});
