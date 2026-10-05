import Controller from '@ember/controller';
import { tracked } from '@glimmer/tracking';

export default class AdminGrabAndGoIndexController extends Controller {
  queryParams = ['stock'];

  @tracked stock = 'in-stock';
}
