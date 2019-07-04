import Component from '@ember/component';
import { equal } from '@ember/object/computed';

export default Component.extend({
  classNames: ['carousel-item'],
  classNameBindings: ['active'],
  active: equal('index', 0),

  review: null,
  index: 0,
});
