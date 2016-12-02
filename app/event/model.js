import DS from 'ember-data';

export default DS.Model.extend({
  title: DS.attr('string'),
  leadIn: DS.attr('string'),
  startTime: DS.attr('date'),
  endTime: DS.attr('date'),
  link: DS.attr('string')
});
