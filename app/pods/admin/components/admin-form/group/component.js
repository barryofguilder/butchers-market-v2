import Component from '@glimmer/component';
import { guidFor } from '@ember/object/internals';
import { valueOrDefault } from 'butchers-market/utils/value-or-default';

export default class Button extends Component {
  uniqueId = `${guidFor(this)}-field`;

  get useDefaultMargin() {
    return valueOrDefault(this.args.useDefaultMargin, true);
  }

  get errors() {
    // Skip checking for errors if no `model` or `property` was passed in.
    if (!this.args.model || !this.args.property) {
      return [];
    }

    const fieldErrors = this.args.model.errors.findBy('key', this.args.property);

    if (fieldErrors) {
      return fieldErrors.validation;
    }

    return [];
  }
}
