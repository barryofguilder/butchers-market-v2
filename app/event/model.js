import DS from 'ember-data';
import moment from 'moment';

const DATE_FORMAT = 'MM/DD/YYYY hh:mm A';

export default DS.Model.extend({
  title: DS.attr('string'),
  leadIn: DS.attr('string'),
  startTime: DS.attr('string'),
  endTime: DS.attr('string'),
  momentStartTime: Ember.computed('startTime', function() {
    return moment(this.get('startTime'), DATE_FORMAT);
  }),
  momentEndTime: Ember.computed('endTime', function() {
    return moment(this.get('endTime'), DATE_FORMAT);
  }),
  link: DS.attr('string')
});
