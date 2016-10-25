import Ember from 'ember';
//import moment from 'moment';

export default Ember.Component.extend({
  events: null,
  // eventsByMonth: Ember.computed('events.@each', function() {
  //   let events = this.get('events');
  //   let eventMonths = Ember.A();
  //   let addedMonths = Ember.A();
  //   let currentMonth = Ember.A();
  //   let processedMonth = false;
  //
  //   events.forEach(event => {
  //     debugger;
  //     let date = moment(event.get('startTime'), 'MM-DD-YYYY hh:mm aa');
  //     let month = date.month();
  //
  //     if (!addedMonths.contains(month)) {
  //       addedMonths.push(month);
  //       if (processedMonth) {
  //         eventMonths.push(currentMonth);
  //       }
  //       currentMonth = Ember.A();
  //       processedMonth = true;
  //     }
  //
  //     currentMonth.push(event);
  //   });
  //
  //   return eventMonths
  // }),
  // eventColumns: Ember.computed('media.isMobile', function() {
  //   return this.get('media.isMobile') ? 2 : 3;
  // })
});
