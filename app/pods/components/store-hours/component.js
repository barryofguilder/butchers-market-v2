import Component from '@glimmer/component';
import { isAfter, isBefore } from 'date-fns';
import { valueOrDefault } from 'butchers-market/utils/value-or-default';

export default class StoreHours extends Component {
  get hourType() {
    return valueOrDefault(this.args.hourType, 'Store');
  }

  hoursForType = [];

  constructor() {
    super(...arguments);

    this.setHoursForType();
  }

  setHoursForType() {
    let hours = valueOrDefault(this.args.hours, []);
    let now = new Date();

    // Get the hours set to be used during the time frame.
    let storeHours = hours.filter(hour => {
      if (
        hour.type === this.hourType &&
        (isAfter(now, hour.activeStartDate) && isBefore(now, hour.activeEndDate))
      ) {
        return hour;
      }
    });

    // Get the hours marked as `default`
    if (storeHours.length === 0) {
      storeHours = hours.filter(hour => {
        if (hour.type === this.hourType && hour.default) {
          return hour;
        }
      });
    }

    this.hoursForType = storeHours.firstObject;
  }
}
