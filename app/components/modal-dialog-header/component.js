import Component from '@ember/component';

export default Component.extend({
  classNames: ['modal-header'],

  title: null,

  actions: {
    close() {
      this.sendAction('close');
    }
  }
});
