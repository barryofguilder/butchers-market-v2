import { Factory } from 'miragejs';

export default Factory.extend({
  fileUrl() {
    return 'docs/bmmenu.pdf';
  },

  updatedAt() {
    return new Date();
  },
});
