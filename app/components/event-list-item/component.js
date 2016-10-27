import Ember from 'ember';
import momentSort from '../../utils/moment-sort';

export default Ember.Component.extend({
  classNames: ['col-sm-6', 'col-md-4'],

  events: null,
  sortedEvents: Ember.computed.sort('events', momentSort),
  monthDisplay: Ember.computed('events.@each.momentStartTime', function() {
    let events = this.get('events');

    return events[0].get('momentStartTime').format('MMMM YYYY');
  })
});
