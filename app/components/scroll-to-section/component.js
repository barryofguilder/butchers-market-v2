import Ember from 'ember';

export default Ember.Component.extend({
  tagName: 'section',

  scroller: Ember.inject.service(),
  mobileApp: Ember.inject.service('mobile-app'),

  shouldScroll: false,
  selector: null,
  isMobileApp: Ember.computed.bool('mobileApp.isMobileApp'),

  didInsertElement() {
    this._super(...arguments);

    this._scrollToSection();
  },

  didUpdateAttrs() {
    this._scrollToSection();
  },

  _scrollToSection() {
    if (this.get('shouldScroll')) {
      let offset = -125;

      if (this.get('isMobileApp')) {
        offset = 0;
      }

      // Offset is to make up for the fixed position of the navbar
      this.get('scroller').scrollVertical(this.get('selector'), {
        offset: offset
      });
    }
  }
});
