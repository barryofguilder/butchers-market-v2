import { Factory } from 'miragejs';
import { faker } from '@faker-js/faker';
import { addHours } from 'date-fns';

export default Factory.extend({
  title() {
    const wordCount = faker.number.int({ min: 2, max: 4 });
    return faker.lorem.words(wordCount);
  },

  price() {
    return faker.commerce.price();
  },

  featured() {
    return faker.datatype.boolean();
  },

  specialText: null,
  isHidden: false,

  orderEnabled() {
    return faker.datatype.boolean();
  },

  items() {
    return [
      '5 lbs. Fresh Ground Chuck',
      '3 1/2 lbs. Boneless Pork Chops',
      '4 lbs. Country Style Pork Ribs',
      '2 1/2 lbs. Market Style Bacon',
      '5 lbs. Boneless Chicken Breasts',
      '10 lbs. Chicken Leg Quarters',
    ];
  },

  createdAt() {
    return faker.date.recent(30);
  },

  updatedAt() {
    return addHours(this.createdAt, 5);
  },
});
