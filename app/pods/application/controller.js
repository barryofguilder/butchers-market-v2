import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { bool } from '@ember/object/computed';

export default Controller.extend({
  mobileApp: service('mobile-app'),

  isMobileApp: bool('mobileApp.isMobileApp'),
});
