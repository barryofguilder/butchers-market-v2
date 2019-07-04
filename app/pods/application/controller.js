import { bool } from '@ember/object/computed';
import { inject as service } from '@ember/service';
import Controller from '@ember/controller';

export default Controller.extend({
  mobileApp: service('mobile-app'),
  isMobileApp: bool('mobileApp.isMobileApp'),
});
