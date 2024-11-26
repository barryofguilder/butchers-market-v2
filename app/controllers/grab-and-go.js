import Controller from '@ember/controller';

export default class GrabAndGoController extends Controller {
  get todaysItems() {
    return this.model.filter((item) => item.featured);
  }

  get commonItems() {
    return this.model.filter((item) => !item.featured);
  }
}
