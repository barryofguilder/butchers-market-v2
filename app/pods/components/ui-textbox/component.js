import Component from '@glimmer/component';
import { gt } from '@ember/object/computed';

export default class UiTextbox extends Component {
  @gt('errors.length', 0)
  hasErrors;

  get inputClasses() {
    let classes = 'styled-textbox';

    if (this.hasErrors) {
      classes += ' has-errors';
    }

    return classes;
  }
}
