import Component from '@glimmer/component';

export default class StoreHoursHours extends Component {
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
