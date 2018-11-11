import { computed } from '@ember/object';
import { sort } from '@ember/object/computed';
import Component from '@ember/component';
import dateSort from 'butchers-market/utils/date-sort';
import { format } from 'date-fns';

export default Component.extend({
  classNames: ['col-sm-6', 'col-md-4'],

  events: null,
  sortedEvents: sort('events', dateSort),
  monthDisplay: computed('events.@each.startTime', function() {
    let firstEvent = this.get('events.firstObject');

    return format(firstEvent.get('startTime'), 'MMMM yyyy');
  })
});
