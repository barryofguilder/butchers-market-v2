import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { bool } from '@ember/object/computed';

export default Controller.extend({
  mobileApp: service(),

  isMobileApp: bool('mobileApp.isMobileApp'),
});
