import Ember from 'ember';
import RSVP from 'rsvp';
import ResetScrollMixin from '../mixins/reset-scroll-mixin';
import MobileAppMixin from '../mixins/mobile-app-mixin';

export default Ember.Route.extend(ResetScrollMixin, MobileAppMixin, {
  model() {
    return RSVP.hash({
      items: this.store.findAll('deli-item')
    });
  }
});
