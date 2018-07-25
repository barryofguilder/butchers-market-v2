import Component from '@ember/component';
import $ from 'jquery';

export default Component.extend({
  didInsertElement() {
    $('.carousel').carousel({
      interval: 7500
    });
  }
});
