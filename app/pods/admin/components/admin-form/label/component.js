import Component from '@ember/component';
import layout from './template';
import { gt } from '@ember/object/computed';

export default Component.extend({
  layout,

  tagName: '',

  for: null,
  errors: null,

  hasErrors: gt('errors.length', 0),
});
