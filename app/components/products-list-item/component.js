import Ember from 'ember';

export default Ember.Component.extend({
  classNames: ['col-md-4'],

  product: null,
  topPrice: Ember.computed('product.featured', function() {
    return this.get('product.featured') ? 'natural-products-top' : null;
  })
});
