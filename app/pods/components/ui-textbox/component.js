import Component from '@glimmer/component';
import { guidFor } from '@ember/object/internals';
import { valueOrDefault } from 'butchers-market/utils/value-or-default';

export default class UiTextbox extends Component {
  get id() {
    return valueOrDefault(this.args.id, guidFor(this));
  }

  get readonly() {
    return valueOrDefault(this.args.readonly, false);
  }

  get hasErrors() {
    return this.args.errors && this.args.errors.length > 0;
  }

  get inputClasses() {
    let classes = 'styled-textbox';

    if (this.hasErrors) {
      classes += ' has-errors';
    }

    return classes;
  }
}
