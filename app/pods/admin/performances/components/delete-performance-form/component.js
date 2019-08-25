import Component from '@ember/component';
import { task } from 'ember-concurrency';

export default Component.extend({
  performance: null,
  onCancel() {},
  onSave() {},

  errorMessage: null,

  deletePerformance: task(function*() {
    try {
      yield this.performance.destroyRecord();
      this.onSave();
    } catch (ex) {
      this.set('errorMessage', ex);
    }
  }).drop(),
});
