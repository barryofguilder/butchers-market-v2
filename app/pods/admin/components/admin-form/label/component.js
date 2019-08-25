import Component from '@ember/component';
import { gt } from '@ember/object/computed';

export default Component.extend({
  tagName: '',

  for: null,
  errors: null,

  hasErrors: gt('errors.length', 0),
});
