import DS from 'ember-data';

export default DS.Model.extend({
  text: DS.attr('string'),
  reviewer: DS.attr('string'),
  source: DS.attr('string'),
  url: DS.attr('string'),
  image: DS.attr('string')
});
