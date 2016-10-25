import Ember from 'ember';
import RSVP from 'rsvp';
import ResetScrollMixin from 'ember-cli-reset-scroll';

export default Ember.Route.extend(ResetScrollMixin, {
  model() {
    return RSVP.hash({
      items: this.store.findAll('deli-item')
    });
  }
});
