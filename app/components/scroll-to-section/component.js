import { bool } from '@ember/object/computed';
import { inject as service } from '@ember/service';
import Component from '@ember/component';

export default Component.extend({
  tagName: 'section',

  scroller: service(),
  mobileApp: service('mobile-app'),

  shouldScroll: false,
  selector: null,
  isMobileApp: bool('mobileApp.isMobileApp'),

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
