import TextField from '@ember/component/text-field';
import { computed } from '@ember/object';
import { gt } from '@ember/object/computed';

export default TextField.extend({
  classNameBindings: ['inputClasses'],
  attributeBindings: ['data-test-id'],

  'data-test-id': 'textbox',
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
