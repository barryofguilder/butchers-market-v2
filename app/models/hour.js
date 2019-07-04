import DS from 'ember-data';

export default DS.Model.extend({
  type: DS.attr('string'),
  default: DS.attr('boolean'),
  activeStartDate: DS.attr('date'),
  activeEndDate: DS.attr('date'),
  label: DS.attr('string'),
  line1: DS.attr('string'),
  line2: DS.attr('string'),
  line3: DS.attr('string'),
});
