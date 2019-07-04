import Component from '@ember/component';

export default Component.extend({
  classNames: ['modal-header'],

  title: null,
  close: null,

  actions: {
    close() {
      this.get('close')();
    },
  },
});
