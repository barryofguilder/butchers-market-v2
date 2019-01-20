import Component from '@ember/component';
import { computed } from '@ember/object';
import { filterBy, sort } from '@ember/object/computed';
import dateSort from 'butchers-market/utils/date-sort';

export default Component.extend({
  events: null,
  filteredEvents: filterBy('events', 'isNew', false),
  sortedEvents: sort('filteredEvents', dateSort),
  eventColumns: computed('media.isMobile', function() {
    return this.get('media.isMobile') ? 1 : 2;
  })
});
