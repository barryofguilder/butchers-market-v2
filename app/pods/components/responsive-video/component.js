import Component from '@ember/component';

export default Component.extend({
  url: null,

  didInsertElement() {
    this._super(...arguments);
  },
});
