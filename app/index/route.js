import Ember from 'ember';
import RSVP from 'rsvp';

const featured = [{
  title: '20lb Meat Pack',
  price: '$68',
  items: [
    '5lb. Beef Ground Chuck',
    '5lb. Bonesless Chicken Breast',
    '5lb. Bonelesss Pork Chops',
    '5lb. Boston Butt Pork Roast'
  ]
}, {
  title: '50lb Meat Pack',
  price: '$129',
  items: [
    '10lb. Beef Ground Chuck',
    '10lb. Boneless Chicken Breast',
    '10lb. Boneless Pork Chops',
    '10lb. Boneless Country Style Ribs',
    '10lb. Chicken Leg Quarters'
  ]
}, {
  title: 'Mega Bundle',
  price: '$119',
  items: [
    '2 (7 oz.) Ribeye Steaks',
    '2 (7 oz.) N.Y. Strip Steaks',
    '2lb. Beef Chuck Roast',
    '2lb. Beef Cube Steak',
    '5lb. Beef Ground Chuck',
    '5lb. Boneless Pork Chops',
    '3lb. Pork Sausage',
    '2 1/2 lb. Sliced Slab Bacon',
    '10lb. Bone-in Chicken Breast'
  ]
}, {
  title: 'View All Packages',
  description: 'We have a meat or grocery packages for every need and budget!'
}];

export default Ember.Route.extend({
  model() {
    return RSVP.hash({
      featured
    });
  }
});
