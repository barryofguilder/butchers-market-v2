import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';
import { isAfter, isBefore } from 'date-fns';
import { valueOrDefault } from '../utils/value-or-default';

export default class StoreHoursComponent extends Component {
  @service store;

  @tracked primaryHours;
  @tracked secondaryHours;

  get primaryType() {
    return valueOrDefault(this.args.primaryType, 'Store');
  }

  constructor() {
    super(...arguments);

    let storeHours = this.getHoursForType('Store');
    let cafeHours = this.getHoursForType('Cafe');

    if (this.primaryType === 'Store') {
      this.primaryHours = storeHours;
      this.secondaryHours = cafeHours;
    } else {
      this.primaryHours = cafeHours;
      this.secondaryHours = storeHours;
    }
  }

  getHoursForType(hourType) {
    const hours = this.args.hours;
    let now = new Date();

    // Get the hours set to be used during the time frame.
    let storeHours = hours.filter((hour) => {
      if (
        hour.type === hourType &&
        isAfter(now, hour.activeStartDate) &&
        isBefore(now, hour.activeEndDate)
      ) {
        return hour;
      }
    });

    // Get the hours marked as `default`
    if (storeHours.length === 0) {
      storeHours = hours.filter((hour) => {
        if (hour.type === hourType && hour.default) {
          return hour;
        }
      });
    }

    return storeHours[0];
  }
}
