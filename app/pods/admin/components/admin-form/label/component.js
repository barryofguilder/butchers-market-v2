import Component from '@glimmer/component';

export default class Label extends Component {
  get hasErrors() {
    return this.args.errors && this.args.errors.length > 0;
  }
}
