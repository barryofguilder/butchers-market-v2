import Component from '@ember/component';
import { computed } from '@ember/object';
import { isAfter, isBefore } from 'date-fns';

export default Component.extend({
  hours: null,
  hourType: null,

  storeHours: computed('hours.@each.{type,activeStartDate,activeEndDate}', 'hourType', function() {
    let now = new Date();
    let storeHours = this.get('hours').filter((hour) => {
      if (hour.get('type') === this.hourType && (isAfter(now, hour.activeStartDate) && isBefore(now, hour.activeEndDate))) {
        return hour;
      }
    });

    if (storeHours.get('length') === 0) {
      storeHours = this.get('hours').filter((hour) => {
        if (hour.get('type') === this.hourType && hour.get('default')) {
          return hour;
        }
      });
    }

    return storeHours.get('firstObject');
  })
});
