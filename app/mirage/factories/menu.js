import { Factory } from 'miragejs';
import { faker } from '@faker-js/faker';
import { addHours } from 'date-fns';

export default Factory.extend({
  fileUrl() {
    return 'docs/bmmenu.pdf';
  },

  createdAt() {
    return faker.date.recent(30);
  },

  updatedAt() {
    return addHours(this.createdAt, 5);
  },
});
