import { Factory } from 'ember-cli-mirage';
import faker from 'faker';

export default Factory.extend({
  title() {
    const wordCount = faker.random.number({ min: 1, max: 6 });
    return faker.lorem.words(wordCount);
  },
});
