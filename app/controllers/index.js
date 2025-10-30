import Controller from '@ember/controller';
import { isBefore } from 'date-fns';

export default class IndexController extends Controller {
  get showThanksgivingMealPromo() {
    const endDate = new Date(2020, 10, 25);
    return isBefore(new Date(), endDate);
  }
}
