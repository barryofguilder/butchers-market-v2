import { computed } from '@ember/object';
import Component from '@ember/component';

export default Component.extend({
  classNames: ['col-md-4'],

  product: null,
  topPrice: computed('product.featured', function() {
    return this.get('product.featured') ? 'natural-products-top' : null;
  }),
});
