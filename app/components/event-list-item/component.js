import { computed } from '@ember/object';
import { sort } from '@ember/object/computed';
import Component from '@ember/component';
import moment from 'moment';
import momentSort from '../../utils/moment-sort';

export default Component.extend({
  classNames: ['col-sm-6', 'col-md-4'],

  events: null,
  sortedEvents: sort('events', momentSort),
  monthDisplay: computed('events.@each.startTime', function() {
    let firstEvent = this.get('events.firstObject');

    return moment(firstEvent.get('startTime')).format('MMMM YYYY');
  })
});
