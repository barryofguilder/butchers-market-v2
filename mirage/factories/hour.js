import { Factory } from 'miragejs';
import { faker } from '@faker-js/faker';
import { addHours, addWeeks } from 'date-fns';

export default Factory.extend({
  type() {
    return faker.helpers.arrayElement(['Cafe', 'Store']);
  },

  default() {
    return false;
  },

  activeStartDate() {
    if (this.default === false) {
      return faker.date.past({ years: 2 });
    }
  },

  activeEndDate() {
    if (this.default === false) {
      return addWeeks(this.activeStartDate, 2);
    }
  },

  label() {
    const wordCount = faker.datatype.number({ min: 1, max: 6 });
    return faker.lorem.words(wordCount);
  },

  line1() {
    return 'Mon - Thurs: 9:00am - 5:30pm';
  },

  line2() {
    return 'Fri & Sat: 9:00am - 10:00pm';
  },

  createdAt() {
    return faker.date.recent(30);
  },

  updatedAt() {
    return addHours(this.createdAt, 5);
  },
});
