import { Factory } from 'ember-cli-mirage';

export default Factory.extend({
  fileUrl() {
    return 'docs/bmmenu.pdf';
  },

  updatedAt() {
    return new Date();
  },
});
