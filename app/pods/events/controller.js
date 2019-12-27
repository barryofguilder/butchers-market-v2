import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { sort } from '@ember/object/computed';
import dateSort from 'butchers-market/utils/date-sort';
import { isAfter, isSameDay } from 'date-fns';

const PERFORMANCES_TO_SHOW = 11;

export default class EventsController extends Controller {
  @service media;

  get filteredEvents() {
    let now = new Date();

    return this.model.events.filter(event => {
      let date = event.startTime;
      // Only return events that are today or in the future.
      return isSameDay(date, now) || isAfter(date, now);
    });
  }

  @sort('filteredEvents', dateSort)
  sortedEvents;

  get filteredPerformances() {
    let performances = this.model.performances;
    let performanceCount = performances.length;
    let randomPerformances = [];

    while (randomPerformances.length < performanceCount) {
      let performance = performances.objectAt(Math.floor(Math.random() * performanceCount));
      let found = randomPerformances.findBy('id', performance.id);

      if (found) {
        continue;
      }

      randomPerformances.pushObject(performance);
    }

    return randomPerformances.slice(0, PERFORMANCES_TO_SHOW);
  }
}
