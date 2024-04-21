import { Factory } from 'miragejs';
import { faker } from '@faker-js/faker';
import { addWeeks } from 'date-fns';

export default Factory.extend({
  title() {
    const wordCount = faker.number.int({ min: 3, max: 10 });
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
    return faker.date.past({ years: 2 });
  },

  activeEndDate() {
    const weekCount = faker.number.int({ min: 1, max: 5 });
    return addWeeks(this.activeStartDate, weekCount);
  },

  isSoldOut() {
    return this.random.boolean();
  },

  isHidden() {
    return false;
  },
});
