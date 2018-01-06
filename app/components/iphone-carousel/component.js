import $ from 'jquery';
import Component from '@ember/component';

export default Component.extend({
  classNames: ['iphone-carousel'],
  
  didInsertElement() {
    $('.fotorama').fotorama();
  }
});
