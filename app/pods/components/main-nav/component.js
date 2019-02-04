import Component from '@ember/component';

export default Component.extend({
  tagName: '',

  showNavigation: false,

  actions: {
    toggleNavigation() {
      this.toggleProperty('showNavigation');
    }
  }
});
