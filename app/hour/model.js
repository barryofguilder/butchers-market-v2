import DS from 'ember-data';

export default DS.Model.extend({
  type: DS.attr('string'),
  active: DS.attr('boolean'),
  lines: DS.attr()
});
