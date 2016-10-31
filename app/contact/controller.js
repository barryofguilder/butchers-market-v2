import Ember from 'ember';

export default Ember.Controller.extend({
  queryParams: ['events'],
  events: false,

  isEventsPage: Ember.computed.bool('events')
});
