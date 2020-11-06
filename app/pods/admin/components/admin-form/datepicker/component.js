import Component from '@glimmer/component';

export default class DatePickerComponent extends Component {
  get hasErrors() {
    return this.args.errors?.length > 0;
  }

  get inputClasses() {
    let classes = 'styled-textbox ember-flatpickr';

    if (this.hasErrors) {
      classes += ' has-errors';
    }

    return classes;
  }
}
