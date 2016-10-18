import Ember from 'ember';
import RSVP from 'rsvp';

export default Ember.Route.extend({
  model() {
    return RSVP.hash({
      events: this.store.findAll('event'),
      reviews: this.store.findAll('review')
    });
  }
});
