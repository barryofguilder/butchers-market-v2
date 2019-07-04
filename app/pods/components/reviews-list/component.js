import Component from '@ember/component';
import $ from 'jquery';

export default Component.extend({
  tagName: 'section',

  title: null,
  reviews: null,

  didInsertElement() {
    $('.carousel').carousel({
      interval: 7500,
    });
  },
});
