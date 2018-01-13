import Component from '@ember/component';
import { computed } from '@ember/object';

export default Component.extend({
  tagName: 'button',
  attributeBindings: null,

  task: null,
  disabled: null,

  _disabled: computed('task.isRunning', 'disabled', function() {
    let taskIsRunning = this.get('task.isRunning');
    let disabled = this.get('disabled');

    return taskIsRunning || disabled;
  }),

  init() {
    this._super(...arguments);

    this.set('attributeBindings', ['_disabled:disabled']);
  },

  click() {
    this.get('task').perform();
  }
});
