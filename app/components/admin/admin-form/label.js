import Component from '@glimmer/component';

export default class LabelComponent extends Component {
  get hasErrors() {
    return this.args.errors && this.args.errors.length > 0;
  }
}
