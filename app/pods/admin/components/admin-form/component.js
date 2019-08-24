import Component from '@ember/component';
import layout from './template';
import { task } from 'ember-concurrency';

export default Component.extend({
  layout,

  tagName: '',

  readOnly: false,
  onSubmit() {},
  afterSubmit() {},

  submitTask: task(function*() {
    yield this.onSubmit();
    yield this.afterSubmit();
  }),

  actions: {
    submit() {
      this.submitTask.perform();
    },
  },
});
