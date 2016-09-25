import Ember from 'ember';
import RSVP from 'rsvp';

export default Ember.Route.extend({
  model() {
    return RSVP.hash({
      items: this.store.findAll('deli-item')
    });
  }
});
