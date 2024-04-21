import Component from '@glimmer/component';
import { valueOrDefault } from '../utils/value-or-default';

export default class UiAlertComponent extends Component {
  get variant() {
    return valueOrDefault(this.args.variant, 'primary');
  }
}
