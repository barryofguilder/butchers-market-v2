import Service from '@ember/service';
import { tracked } from '@glimmer/tracking';

export default class MobileAppService extends Service {
  @tracked isMobileApp = false;
}
