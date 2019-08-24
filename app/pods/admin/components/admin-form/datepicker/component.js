import EmberFlatpickr from 'ember-flatpickr/components/ember-flatpickr';
import { computed } from '@ember/object';
import { gt } from '@ember/object/computed';

export default EmberFlatpickr.extend({
  attributeBindings: ['data-test-id'],
  classNameBindings: ['inputClasses'],

  'data-test-id': 'datepicker',
  errors: null,

  hasErrors: gt('errors.length', 0),

  inputClasses: computed('hasErrors', function() {
    let classes = 'styled-textbox';

    if (this.hasErrors) {
      classes += ' has-errors';
    }

    return classes;
  }),
});
