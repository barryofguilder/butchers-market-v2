import Component from '@ember/component';
import { task } from 'ember-concurrency';

export default Component.extend({
  bundle: null,
  onCancel() {},
  onSave() {},

  errorMessage: null,

  deleteBundle: task(function*() {
    try {
      yield this.bundle.destroyRecord();
      this.onSave();
    } catch (ex) {
      this.set('errorMessage', ex);
    }
  }).drop(),
});
