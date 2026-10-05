import Controller from '@ember/controller';
import { tracked } from '@glimmer/tracking';

export default class MeatController extends Controller {
  queryParams = ['packages'];

  @tracked packages = false;
}
