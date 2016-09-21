import Ember from 'ember';
import RSVP from 'rsvp';

const products = [{
  title: 'Natural Pork',
  isTop: false,
  items: [
    'No added hormones',
    'No antibiotics',
    'Source of key nutrients',
    'Heart healthy'
  ]
}, {
  title: 'Natural Beef',
  isTop: true,
  items: [
    'Our beef quality is even more selective than USDA prime, choice, & select!*',
    'No added hormones',
    'No antibiotics',
    'Source of key nutrients',
    'Heart healthy'
  ]
}, {
  title: 'Natural Poultry',
  isTop: false,
  items: [
    'No added hormones',
    'No antibiotics',
    'Source of key nutrients',
    'Heart healthy'
  ]
}];

const reviews = [{
  text: 'Great place for quality meat and great burgers',
  reviewer: 'Sandi O',
  source: 'Trip Advisor Contributor',
  url: 'http://tripadvisor.com',
  image: 'review-person1.jpg'
}, {
  text: 'Great place to buy meat',
  reviewer: 'Dan Peeples',
  source: 'Trip Advisor Contributor',
  url: 'http://tripadvisor.com',
  image: 'review-person2.png'
}, {
  text: 'Quality and More Quality',
  reviewer: 'Nathan Puckett',
  source: 'Trip Advisor Contributor',
  url: 'http://tripadvisor.com',
  image: 'review-person3.png'
}];

export default Ember.Route.extend({
  model() {
    return RSVP.hash({
      bundles: this.store.findAll('meat-bundle'),
      products,
      reviews
    });
  }
});
