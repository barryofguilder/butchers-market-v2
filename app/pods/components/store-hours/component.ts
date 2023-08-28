import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';
import { isAfter, isBefore } from 'date-fns';
import { valueOrDefault } from 'butchers-market/utils/value-or-default';
import Store from '@ember-data/store';
import HourModel from 'butchers-market/models/hour';

type HourType = 'Store' | 'Cafe';

export interface StoreHoursSignature {
  Args: {
    hours: HourModel[];
    primaryType?: HourType;
  };
}

export default class StoreHoursComponent extends Component<StoreHoursSignature> {
  @service declare store: Store;

  @tracked primaryHours;
  @tracked secondaryHours;

  get primaryType() {
    return valueOrDefault(this.args.primaryType, 'Store');
  }

  constructor(owner: unknown, args: StoreHoursSignature['Args']) {
    super(owner, args);

    const storeHours = this.getHoursForType('Store');
    const cafeHours = this.getHoursForType('Cafe');

    if (this.primaryType === 'Store') {
      this.primaryHours = storeHours;
      this.secondaryHours = cafeHours;
    } else {
      this.primaryHours = cafeHours;
      this.secondaryHours = storeHours;
    }
  }

  getHoursForType(hourType: HourType) {
    const hours = this.args.hours;
    const now = new Date();

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
