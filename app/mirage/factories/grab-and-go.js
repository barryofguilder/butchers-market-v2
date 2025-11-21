import { Factory } from 'miragejs';
import { faker } from '@faker-js/faker';
import { addHours } from 'date-fns';

export default Factory.extend({
  title() {
    const wordCount = faker.number.int({ min: 3, max: 10 });
    return faker.lorem.words(wordCount);
  },
  socialTitle() {
    return this.title;
  },
  description() {
    return faker.lorem.sentence();
  },
  inStock() {
    return faker.datatype.boolean({ probability: 0.9 });
  },
  isHoliday() {
    return faker.datatype.boolean({ probability: 0.2 });
  },
  createdAt() {
    return faker.date.recent(30);
  },
  updatedAt() {
    return addHours(this.createdAt, 5);
  },
});
