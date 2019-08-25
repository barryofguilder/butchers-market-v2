import Component from '@ember/component';
import { task } from 'ember-concurrency';

export default Component.extend({
  hours: null,
  onCancel() {},
  onSave() {},

  errorMessage: null,

  deleteHours: task(function*() {
    try {
      yield this.hours.destroyRecord();
      this.onSave();
    } catch (ex) {
      this.set('errorMessage', ex);
    }
  }).drop(),
});
