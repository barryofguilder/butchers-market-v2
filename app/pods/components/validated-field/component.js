import { isPresent } from '@ember/utils';
import { defineProperty, computed } from '@ember/object';
import Component from '@ember/component';

export default Component.extend({
  changeset: null,
  propertyName: null,
  isInvalidClass: computed('isInvalid', function() {
    return this.get('isInvalid') ? 'is-invalid' : null;
  }),

  init() {
    this._super(...arguments);

    let propertyName = this.get('propertyName');


    defineProperty(this, 'isInvalid', computed(`changeset.error.${propertyName}.validation`, function() {
      return isPresent(this.get(`changeset.error.${propertyName}.validation`));
    }));
  }
});
