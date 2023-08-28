import Component from '@glimmer/component';
import HourModel from 'butchers-market/models/hour';

export interface StoreHoursHoursSignature {
  Args: {
    hours?: HourModel;
  };
}

export default class StoreHoursHoursComponent extends Component<StoreHoursHoursSignature> {
  get hourType() {
    if (this.args.hours) {
      return this.args.hours.type;
    }

    return '';
  }

  get hourTypeTestId() {
    return this.hourType.toLowerCase();
  }
}
