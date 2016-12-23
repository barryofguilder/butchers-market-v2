import Ember from 'ember';

export default Ember.Mixin.create({
  mobileApp: Ember.inject.service('mobile-app'),
  isMobileApp: Ember.computed.bool('mobileApp.isMobileApp'),

  beforeModel(params){
    let isMobileApp = params.queryParams.mobile ? true : false;

    this.set('mobileApp.isMobileApp', isMobileApp);

    if (isMobileApp) {
      let classNames = this.get('classNames');
      classNames.push('mobile-app');
    }
  }
});
