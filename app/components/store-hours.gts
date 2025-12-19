import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { service } from '@ember/service';
import type Owner from '@ember/owner';
import type Store from '@ember-data/store';
import { isAfter, isBefore } from 'date-fns';
import type Hour from '../models/hour';
import { type HourType } from '../models/hour';
import Hours from './store-hours/hours';

interface StoreHoursSignature {
  Element: HTMLDivElement;
  Args: {
    hours: Hour[];
    primaryType?: HourType;
  };
}

export default class StoreHoursComponent extends Component<StoreHoursSignature> {
  @service declare store: Store;

  @tracked primaryHours: Hour | null = null;
  @tracked secondaryHours: Hour | null = null;

  get primaryType() {
    return this.args.primaryType ?? 'Store';
  }

  constructor(owner: Owner, args: StoreHoursSignature['Args']) {
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

    return storeHours[0] ?? null;
  }

  <template>
    <div ...attributes>
      <Hours @hours={{this.primaryHours}} />
      <Hours @hours={{this.secondaryHours}} class='mt-8' />
    </div>
  </template>
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    StoreHours: typeof StoreHoursComponent;
  }
}
