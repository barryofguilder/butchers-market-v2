import Component from '@glimmer/component';
import { action } from '@ember/object';
import { guidFor } from '@ember/object/internals';
import { valueOrDefault } from '../utils/value-or-default';

export default class UiTextareaComponent extends Component {
  get id() {
    return valueOrDefault(this.args.id, guidFor(this));
  }

  get hasErrors() {
    if (this.args.hasErrors) {
      return true;
    }

    return (this.args.errors ?? []).length > 0;
  }

  get onChange() {
    return valueOrDefault(this.args.onChange, () => {
      //
    });
  }

  get readonly() {
    return valueOrDefault(this.args.readonly, false);
  }

  @action
  handleInput(event) {
    this.onChange(event.target.value);
  }
}
