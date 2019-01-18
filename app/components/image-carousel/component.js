import Component from '@ember/component';
import $ from 'jquery';

export default Component.extend({
  tagName: '',

  photos: null,

  init() {
    this._super(...arguments);

    if (!this.photos) {
      this.set('photos', []);
    }
  },

  didInsertElement() {
    $('.carousel').carousel({
      interval: 7500
    });
  }
});
