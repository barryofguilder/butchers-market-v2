import DS from 'ember-data';

export default DS.Model.extend({
  title: DS.attr('string'),
  startTime: DS.attr('string'),
  endTime: DS.attr('string')
});
