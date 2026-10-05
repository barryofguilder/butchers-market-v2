import Controller from '@ember/controller';
import { tracked } from '@glimmer/tracking';

export default class AdminDeliItemsIndexController extends Controller {
  queryParams = ['sort'];

  @tracked sort: string | null = null;
}
