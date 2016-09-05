import Ember from 'ember';

export default Ember.Component.extend({
  tagName: 'section',
  classNames: ['newsletter'],
  attributeBindings: ['ratio:data-stellar-background-ratio', 'verticalOffset:data-stellar-vertical-offset'],

  ratio: '0.5',
  verticalOffset: '-180'
});
