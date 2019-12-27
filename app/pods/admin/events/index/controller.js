import Controller from '@ember/controller';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { isAfter, isBefore, isSameDay } from 'date-fns';
import dateSort from 'butchers-market/utils/date-sort';

export default class AdminEventsIndexController extends Controller {
  @tracked filter = 'upcoming';

  get filteredEvents() {
    let now = new Date();

    let filtered = this.model.filter(item => {
      if (this.filter === 'all') {
        return true;
      }

      let startTime = item.startTime;

      return this.filter === 'upcoming'
        ? isSameDay(startTime, now) || isAfter(startTime, now)
        : isBefore(startTime, now);
    });

    return filtered.sort(dateSort);
  }

  @action
  filterEvents(filter) {
    this.filter = filter;
  }
}
