import { Factory } from 'miragejs';
import faker from 'faker';

export default Factory.extend({
  title() {
    const wordCount = faker.datatype.number({ min: 2, max: 4 });
    return faker.lorem.words(wordCount);
  },

  price() {
    return faker.commerce.price();
  },

  featured() {
    return faker.datatype.boolean();
  },

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
});
