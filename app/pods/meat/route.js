import Route from '@ember/routing/route';
import RSVP from 'rsvp';
import ResetScrollMixin from 'butchers-market/mixins/reset-scroll-mixin';
import MobileAppMixin from 'butchers-market/mixins/mobile-app-mixin';

export default Route.extend(ResetScrollMixin, MobileAppMixin, {
  model() {
    return RSVP.hash({
      bundles: this.store.findAll('meat-bundle'),
      products: this.store.findAll('meat-product')
    });
  },

  resetController: function(controller, isExiting/*, transition*/) {
    if (isExiting) {
      controller.set('packages', false);
    }
  }
});