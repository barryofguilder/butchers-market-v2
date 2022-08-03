import { Factory } from 'miragejs';
import { faker } from '@faker-js/faker';

export default Factory.extend({
  reviewer() {
    return `${faker.name.firstName()} ${faker.name.lastName()}`;
  },

  imageUrl() {
    return 'images/review-person3.png';
  },

  text() {
    return faker.lorem.sentence();
  },

  source() {
    return faker.helpers.arrayElement(['Trip Advisor Contributor', 'Yelp Contributor']);
  },

  url() {
    return faker.internet.url();
  },
});
