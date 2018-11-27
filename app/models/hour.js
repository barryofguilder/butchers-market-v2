import DS from 'ember-data';

export default DS.Model.extend({
  type: DS.attr('string'),
  label: DS.attr('string'),
  active: DS.attr('boolean'),
  line1: DS.attr('string'),
  line2: DS.attr('string'),
  line3: DS.attr('string')
});
