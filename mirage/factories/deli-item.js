import { Factory } from 'miragejs';
import { faker } from '@faker-js/faker';

export default Factory.extend({
  title() {
    const wordCount = faker.number.int({ min: 2, max: 5 });
    return faker.lorem.words(wordCount);
  },

  imageUrl() {
    return 'images/generic-deli-item.jpg';
  },

  ingredients() {
    const wordCount = faker.number.int({ min: 2, max: 10 });
    return faker.lorem.words(wordCount).replace(' ', ', ');
  },
});
