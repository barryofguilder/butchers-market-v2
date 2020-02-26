import { Factory, trait } from 'ember-cli-mirage';
import { getYear, getMonth, getDay } from 'date-fns';
import faker from 'faker';

export default Factory.extend({
  reviewer() {
    return `${faker.name.firstName()} ${faker.name.lastName()}`;
  },

  image() {
    return 'images/review-person3.png';
  },

  text() {
    return faker.lorem.sentence();
  },

  source() {
    return faker.random.arrayElement(['Trip Advisor Contributor', 'Yelp Contributor']);
  },

  url() {
    return faker.internet.url();
  },
});
