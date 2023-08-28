import Component from '@glimmer/component';
import { EmptyObject } from '@ember/component/helper';

export interface MainFooterSignature {
  Args: EmptyObject;
}

export default class MainFooterComponent extends Component<MainFooterSignature> {
  year = new Date().getFullYear();
}
