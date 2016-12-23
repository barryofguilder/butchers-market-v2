import Ember from 'ember';

export default Ember.Controller.extend({
  mobileApp: Ember.inject.service('mobile-app'),
  isMobileApp: Ember.computed.bool('mobileApp.isMobileApp')
});
