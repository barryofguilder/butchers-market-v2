import { Factory } from 'miragejs';
import { faker } from '@faker-js/faker';

export default Factory.extend({
  title() {
    const wordCount = faker.number.int({ min: 3, max: 10 });
    return faker.lorem.words(wordCount);
  },
  description() {
    return faker.lorem.sentence();
  },
  isFeatured() {
    faker.datatype.boolean({ probability: 0.6 });
  },
  isSoldOut() {
    return faker.datatype.boolean({ probability: 0.1 });
  },
});
