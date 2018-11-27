import Component from '@ember/component';

export default Component.extend({
  classNames: ['carousel-item'],
  classNameBindings: ['active'],

  src: null,
  alt: null,
  active: false
});
