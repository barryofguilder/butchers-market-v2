import Component from '@glimmer/component';
import { guidFor } from '@ember/object/internals';
import { valueOrDefault } from '../../../utils/value-or-default';

export default class GroupComponent extends Component {
  uniqueId = `${guidFor(this)}-field`;

  get useDefaultMargin() {
    return valueOrDefault(this.args.useDefaultMargin, true);
  }

  get errors() {
    // Skip checking for errors if no `model` or `property` was passed in.
    if (!this.args.model || !this.args.property) {
      return [];
    }

    const fieldErrors = this.args.model.errors.find((error) => error.key === this.args.property);

    if (fieldErrors) {
      return fieldErrors.validation;
    }

    return [];
  }
}
