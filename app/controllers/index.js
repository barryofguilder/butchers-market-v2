import Controller from '@ember/controller';
import { service } from '@ember/service';
import { isBefore } from 'date-fns';

export default class IndexController extends Controller {
  @service media;

  get isMobile() {
    return !this.media.isMd && !this.media.isLg && !this.media.isXl;
  }

  get isTablet() {
    return this.media.isMd || this.media.isLg || this.media.isXl;
  }

  get showThanksgivingMealPromo() {
    const endDate = new Date(2020, 10, 25);
    return isBefore(new Date(), endDate);
  }
}
