import Component from '@ember/component';
import { computed, get } from '@ember/object';
import { isAfter, isBefore } from 'date-fns';

export default Component.extend({
  tagName: '',

  hours: null,
  hourType: 'Store',

  hoursForType: computed(
    'hours.@each.{type,activeStartDate,activeEndDate}',
    'hourType',
    function() {
      let now = new Date();

      // Get the hours set to be used during the time frame.
      let storeHours = this.hours.filter(hour => {
        if (
          get(hour, 'type') === this.hourType &&
          (isAfter(now, hour.activeStartDate) && isBefore(now, hour.activeEndDate))
        ) {
          return hour;
        }
      });

      // Get the hours marked as `default`
      if (get(storeHours, 'length') === 0) {
        storeHours = this.hours.filter(hour => {
          if (get(hour, 'type') === this.hourType && get(hour, 'default')) {
            return hour;
          }
        });
      }

      return get(storeHours, 'firstObject');
    }
  ),
});
