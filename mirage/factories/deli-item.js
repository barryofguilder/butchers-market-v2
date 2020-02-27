import { Factory } from 'ember-cli-mirage';
import faker from 'faker';

export default Factory.extend({
  title() {
    const wordCount = faker.random.number({ min: 2, max: 5 });
    return faker.lorem.words(wordCount);
  },

  imageUrl() {
    return 'generic-deli-item.jpg';
  },

  ingredients() {
    const wordCount = faker.random.number({ min: 2, max: 10 });
    return faker.lorem.words(wordCount).replace(' ', ', ');
  },
});
