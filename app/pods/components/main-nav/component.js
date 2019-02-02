import Component from '@ember/component';

export default Component.extend({
  tagName: 'header',

  showNavigation: false,

  actions: {
    toggleNavigation() {
      this.toggleProperty('showNavigation');
    }
  }
});
