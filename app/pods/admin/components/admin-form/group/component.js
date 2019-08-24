import Component from '@ember/component';
import layout from './template';
import { computed, defineProperty, get } from '@ember/object';
import { guidFor } from '@ember/object/internals';

export default Component.extend({
  layout,

  tagName: '',

  useDefaultMargin: true,
  model: null,
  property: null,
  readOnly: false,

  uniqueId: computed(function() {
    return `${guidFor(this)}-field`;
  }),

  init() {
    this._super(...arguments);

    defineProperty(
      this,
      'errors',
      computed(`model.errors.@each.key`, function() {
        // Skip checking for errors if no `model` or `property` was passed in.
        if (!this.model || !this.property) {
          return [];
        }

        const errors = get(this, 'model.errors');
        const fieldErrors = errors.findBy('key', this.property);

        if (fieldErrors) {
          return get(fieldErrors, 'validation');
        }

        return [];
      })
    );
  },
});
