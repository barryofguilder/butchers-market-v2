import Ember from 'ember';
import RSVP from 'rsvp';
import ResetScrollMixin from '../mixins/reset-scroll-mixin';

export default Ember.Route.extend(ResetScrollMixin, {
  model() {
    return RSVP.hash({
      items: this.store.findAll('deli-item')
    });
  }
});
