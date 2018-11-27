import { A } from '@ember/array';
import { computed } from '@ember/object';
import { filterBy, sort } from '@ember/object/computed';
import Component from '@ember/component';
import dateSort from 'butchers-market/utils/date-sort';
import { isAfter, isSameDay, getMonth } from 'date-fns';

export default Component.extend({
  events: null,
  filteredEvents: filterBy('events', 'isNew', false),
  sortedEvents: sort('filteredEvents', dateSort),
  eventsByMonth: computed('sortedEvents.@each', function() {
    let events = this.get('sortedEvents');
    let now = new Date();

    let upcomingEvents = events.filter(event => {
      let date = event.get('startTime');
      return isSameDay(date, now) || isAfter(date, now);
    });

    let eventsLength = upcomingEvents.get('length');
    let eventsByMonth = A();
    let monthEvents = A();

    for (let i = 0; i < eventsLength; i++) {
      let date = upcomingEvents[i].get('startTime');
      let month = getMonth(date);

      if (monthEvents.get('length')) {
        let recentDate = monthEvents[0].get('startTime');

        if (month !== getMonth(recentDate)) {
          eventsByMonth.pushObject(monthEvents);
          monthEvents = A();
        }
      }

      monthEvents.pushObject(upcomingEvents[i]);
    }

    if (monthEvents.get('length') > 0) {
      eventsByMonth.pushObject(monthEvents);
    }

    return eventsByMonth;
  }),
  eventColumns: computed('media.isMobile', function() {
    return this.get('media.isMobile') ? 2 : 3;
  })
});
