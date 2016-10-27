import Ember from 'ember';
import RSVP from 'rsvp';
import ResetScrollMixin from '../mixins/reset-scroll-mixin';

export default Ember.Route.extend(ResetScrollMixin, {
  model() {
    return RSVP.hash({
      events: this.store.findAll('event'),
      reviews: this.store.findAll('review')
    });
  },

  resetController: function(controller, isExiting/*, transition*/) {
    if (isExiting) {
      controller.set('events', false);
    }
  }
});
