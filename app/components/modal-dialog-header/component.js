import Component from '@ember/component';

export default Component.extend({
  classNames: ['modal-header'],

  close: null,

  actions: {
    close() {
      this.get('close')();
    }
  }
});
