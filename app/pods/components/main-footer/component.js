import Component from '@glimmer/component';

export default class MainFooterComponent extends Component {
  year = new Date().getFullYear();
}
