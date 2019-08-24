import Component from '@ember/component';
import { task } from 'ember-concurrency';

export default Component.extend({
  event: null,
  onCancel() {},
  onSave() {},

  errorMessage: null,

  deleteEvent: task(function*() {
    try {
      yield this.event.destroyRecord();
      this.onSave();
    } catch (ex) {
      this.set('errorMessage', ex);
    }
  }).drop(),
});
