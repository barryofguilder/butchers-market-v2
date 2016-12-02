import Ember from 'ember';
import moment from 'moment';
import momentSort from '../../utils/moment-sort';

export default Ember.Component.extend({
  classNames: ['col-sm-6', 'col-md-4'],

  events: null,
  sortedEvents: Ember.computed.sort('events', momentSort),
  monthDisplay: Ember.computed('events.@each.startTime', function() {
    let firstEvent = this.get('events.firstObject');

    return moment(firstEvent.get('startTime')).format('MMMM YYYY');
  })
});
