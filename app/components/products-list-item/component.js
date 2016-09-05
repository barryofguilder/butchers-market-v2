import Ember from 'ember';

export default Ember.Component.extend({
  classNames: ['col-md-4'],

  product: null,
  topPrice: Ember.computed('product.isTop', function() {
    return this.get('product.isTop') ? 'natural-products-top' : null;
  })
});
