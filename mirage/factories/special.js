import { Factory } from 'miragejs';
import { faker } from '@faker-js/faker';
import addWeeks from 'date-fns/addWeeks';

export default Factory.extend({
  title() {
    const wordCount = faker.datatype.number({ min: 3, max: 10 });
    return faker.lorem.words(wordCount);
  },

  link: null,

  displayOrder(index) {
    return index + 1;
  },

  imageAltText() {
    return this.title;
  },

  activeStartDate() {
    return faker.date.past(2);
  },

  activeEndDate() {
    const weekCount = faker.datatype.number({ min: 1, max: 5 });
    return addWeeks(this.activeStartDate, weekCount);
  },

  isSoldOut() {
    return this.random.boolean();
  },

  isHidden() {
    return false;
  },
});
