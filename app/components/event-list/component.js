import { A } from '@ember/array';
import { computed } from '@ember/object';
import { filterBy, sort } from '@ember/object/computed';
import Component from '@ember/component';
import moment from 'moment';
import momentSort from 'butchers-market/utils/moment-sort';

export default Component.extend({
  events: null,
  filteredEvents: filterBy('events', 'isNew', false),
  sortedEvents: sort('filteredEvents', momentSort),
  eventsByMonth: computed('sortedEvents.@each', function() {
    let events = this.get('sortedEvents');
    let now = moment();

    let upcomingEvents = events.filter(event => {
      let date = moment(event.get('startTime'));
      return date.isSameOrAfter(now, 'day');
    });

    let eventsLength = upcomingEvents.get('length');
    let eventsByMonth = A();
    let monthEvents = A();

    for (let i = 0; i < eventsLength; i++) {
      let date = moment(upcomingEvents[i].get('startTime'));
      let month = date.month();

      if (monthEvents.get('length')) {
        let recentDate = moment(monthEvents[0].get('startTime'));

        if (month !== recentDate.month()) {
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
