import Component from '@ember/component';
import { computed } from '@ember/object';
import { isAfter, isBefore } from 'date-fns';

export default Component.extend({
  classNames: ['store-hours'],

  hours: null,
  storeHours: computed('hours.@each.{type,active}', function() {
    let now = new Date();
    let storeHours = this.get('hours').filter((hour) => {
      if (hour.get('type') === 'Cafe' && (isAfter(now, hour.activeStartDate) && isBefore(now, hour.activeEndDate))) {
        return hour;
      }
    });

    if (storeHours.get('length') === 0) {
      storeHours = this.get('hours').filter((hour) => {
        if (hour.get('type') === 'Cafe' && hour.get('default')) {
          return hour;
        }
      });
    }

    return storeHours.get('firstObject');
  })
});
